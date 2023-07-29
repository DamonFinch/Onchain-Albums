import { Contract } from "ethers"
import abi from '../lib/abi/implementation.json'
import erc721Abi from '../lib/abi/erc721.json'
import { useAccount, useSigner } from "wagmi"
import handleTxError from "../lib/handleTxError"
import { useMemo } from "react"
import { Interface } from "ethers/lib/utils"

const useManageTokenbound = (smartWalletAddress) => {
    const { data: signer } = useSigner()
    const {data: account} = useAccount()
    const smartWallet = useMemo(() => smartWalletAddress && new Contract(
        smartWalletAddress,
        abi,
        signer 
    ), [signer, smartWalletAddress])


    const removeFromSmartWallet = async (contractAddress, tokenId, onSuccess= (receipt) => null) => {
        let iface = new Interface(erc721Abi);
        const data = iface.encodeFunctionData("safeTransferFrom(address,address,uint256)", [smartWalletAddress, account.address, tokenId]);
        try {
            const tx = await smartWallet.executeCall(
                contractAddress,
                0,
                data
            )
            const receipt = await tx.wait()
            onSuccess(receipt)
            return receipt
        } catch (err) {
            handleTxError(err)
            return false
        }
    }

    const addToSmartWallet = async (contractAddress, to, tokenId, onSuccess= (receipt) => null) => {
        const contract = new Contract(contractAddress, erc721Abi, signer)
        console.log("contract", contract)
        console.log("account.address", account.address)
        console.log("to", to)
        console.log("tokenId", tokenId)
        console.log("signer", signer)
        try {
            const tx = await contract.transferFrom(
                account.address,
                to,
                tokenId
            )
            const receipt = await tx.wait()
            onSuccess(receipt)
            return receipt
        } catch (err) {
            handleTxError(err)
            return false
        }
    }

    return {
        addToSmartWallet,
        removeFromSmartWallet
    }
}

export default useManageTokenbound