/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { isNil } from 'lodash'
import { getLensNfts, getNfts } from '../../../lib/utils'
import { TbLogo } from '../../icon'
import { useGetApprovals, useNft } from '../../../lib/hooks'
import { TbaOwnedNft } from '../../../lib/types'
import { getAddress } from 'viem'
import { TokenDetail } from './TokenDetail'
import { HAS_CUSTOM_IMPLEMENTATION } from '../../../lib/constants'
import { useRouter } from 'next/router'
import useTokenbound from '@hooks/useTokenbound'

export default function Token() {
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [nfts, setNfts] = useState<TbaOwnedNft[]>([])
  const [lensNfts, setLensNfts] = useState<TbaOwnedNft[]>([])
  const router = useRouter()
  const { tokenId, contractAddress, chainId } = router.query as any
  const [showTokenDetail, setShowTokenDetail] = useState(false)
  const chainIdNumber = parseInt(chainId)
  const [account, setAccount] = useState('')
  const { getAccount } = useTokenbound()

  const {
    data: nftImages,
    nftMetadata,
    loading: nftMetadataLoading,
  } = useNft({
    tokenId: parseInt(tokenId as string),
    contractAddress: contractAddress as `0x${string}`,
    hasCustomImplementation: HAS_CUSTOM_IMPLEMENTATION,
    chainId: chainIdNumber,
  })

  useEffect(() => {
    if (!isNil(nftImages) && nftImages.length) {
      const imagePromises = nftImages.map((src: string) => {
        return new Promise((resolve, reject) => {
          const image = new Image()
          image.onload = resolve
          image.onerror = reject
          image.src = src
        })
      })

      Promise.all(imagePromises)
        .then(() => {
          setImagesLoaded(true)
        })
        .catch((error) => {
          console.error('Error loading images:', error)
        })
    }
  }, [nftImages])

  // Fetch nft's TBA
  useEffect(() => {
    const accountLookup = async () => {
      const result = await getAccount(contractAddress, Number(tokenId))
      setAccount(result)
    }
    if (!tokenId || !contractAddress || !chainIdNumber) return
    accountLookup()
  }, [tokenId, contractAddress, chainIdNumber])

  // fetch nfts inside TBA
  useEffect(() => {
    async function fetchNfts(account: string) {
      const [data, lensData] = await Promise.all([
        getNfts(chainId, account),
        getLensNfts(account),
      ])
      if (data) {
        setNfts(data)
      }
      if (lensData) {
        setLensNfts(lensData)
      }
    }

    if (account) {
      fetchNfts(account)
    }
  }, [account, chainId])

  const [tokens, setTokens] = useState<TbaOwnedNft[]>([])
  const allNfts = [...nfts, ...lensNfts]

  const { data: approvalData } = useGetApprovals(
    allNfts.map((nft) => nft.contract.address),
    account
  )

  useEffect(() => {
    if (nfts !== undefined && nfts.length) {
      nfts.map((token) => {
        const foundApproval = approvalData?.find((item: any) => {
          const contract = item?.value?.contract
          const tokenIds = item?.approvedTokenIds
          const approvalForAll = item.nftApprovalForAll

          if (
            getAddress(contract) === getAddress(token.contract.address) &&
            approvalForAll
          ) {
            return true
          }

          if (
            getAddress(contract) === getAddress(token.contract.address) &&
            tokenIds &&
            tokenIds.includes(String(token.tokenId))
          ) {
            return true
          }
        })

        token.hasApprovals = foundApproval?.hasApprovals || false
      })
      setTokens(nfts)
      if (lensNfts) {
        setTokens([...nfts, ...lensNfts])
      }
    }
  }, [nfts, approvalData, lensNfts])

  return (
    <div className="h-screen w-screen bg-slate-100">
      <div className="max-w-screen relative mx-auto aspect-square max-h-screen overflow-hidden bg-white">
        <div className="relative h-full w-full">
          {account && nftImages && nftMetadata && (
            <TokenDetail
              isOpen={showTokenDetail}
              handleOpenClose={setShowTokenDetail}
              approvalTokensCount={approvalData?.length}
              account={account}
              tokens={tokens}
              title={nftMetadata.title}
              chainId={chainIdNumber}
            />
          )}
          <div className="max-h-1080[px] relative h-full w-full max-w-[1080px]">
            {nftMetadataLoading ? (
              <div className="absolute left-[45%] top-[50%] z-10 h-20 w-20 -translate-x-[50%] -translate-y-[50%] animate-bounce">
                <TbLogo />
              </div>
            ) : (
              <div
                className={`grid w-full grid-cols-1 grid-rows-1 transition ${
                  imagesLoaded ? '' : 'blur-xl'
                }`}
              >
                {!isNil(nftImages) ? (
                  nftImages.map((image, i) => (
                    <img
                      key={i}
                      className="col-span-1 col-start-1 row-span-1 row-start-1 translate-x-0"
                      src={image}
                      alt="Nft image"
                    />
                  ))
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
