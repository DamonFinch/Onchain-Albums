import { Contract } from "ethers"
import abi from '../lib/abi/tokenbound-registry-abi.json'
import { useNetwork, useSigner } from "wagmi"
import handleTxError from "../lib/handleTxError"
import { useMemo } from "react"
import getDefaultProvider from "@lib/getDefaultProvider"

const REGISTRY_ADDRESS = "0x02101dfB77FDE026414827Fdc604ddAF224F0921"
const IMPLEMENTATION_ADDRESS = "0x2D25602551487C3f3354dD80D76D54383A243358"

const useTokenbound = (chainIdOverride = "") => {
    const { data: signer } = useSigner()
    const { activeChain } = useNetwork()
    const chainId = activeChain?.id
    const provider = getDefaultProvider(chainIdOverride || chainId)
    const contract = useMemo(() => new Contract(
        REGISTRY_ADDRESS,
        abi,
        signer || provider
    ), [signer, provider])

    const salt = 0

    const createAccount = async (contractAddress, tokenId) => {
        try {
            const initData = '0x8129fc1c'
            const tx = await contract.createAccount(
            IMPLEMENTATION_ADDRESS,
            chainId,
            contractAddress,
            tokenId,
            salt,
            initData
            )
            const receipt = await tx.wait()
            return receipt
        } catch (err) {
            handleTxError(err)
            return false
        }
    }

    const getAccount = async (contractAddress, tokenId) => {
        console.log("SWEETS  useTokenBound contractAddress", contractAddress)
        console.log("SWEETS  useTokenBound tokenId", tokenId)
        console.log("SWEETS  useTokenBound chainId", chainId)
        console.log("SWEETS  useTokenBound chainIdOverride", chainIdOverride)
        console.log("SWEETS  useTokenBound IMPLEMENTATION_ADDRESS", IMPLEMENTATION_ADDRESS)
        console.log("SWEETS  useTokenBound salt", salt)
        const account = await contract.account(IMPLEMENTATION_ADDRESS, chainIdOverride || chainId, contractAddress, tokenId, salt)
        return account
    }

    const hasDeployedAccount = async (contractAddress, tokenId) => {
        const account = await getAccount(contractAddress, tokenId)
        const code = await signer.provider?.getCode(account)
        return code !== "0x"
    }

    return {
        createAccount,
        getAccount,
        hasDeployedAccount
    }
}

export default useTokenbound