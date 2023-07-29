import { getNfts } from '@lib/getNfts'
import getUniqueSongList from '@lib/getUniqueSongList'
import { useEffect, useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'

const useWalletNfts = () => {
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const [walletNfts, setWalletNfts] = useState([] as any)

  useEffect(() => {
    const init = async () => {
      console.log('SWEETS GETTING NFTS')
      const response = await getNfts(activeChain?.id?.toString(), account.address)
      const result = getUniqueSongList(response)
      console.log('SWEETS NFTS', result)

      setWalletNfts(result)
    }

    if (!activeChain || !account) return
    init()
  }, [activeChain, account])

  return {
    walletNfts,
  }
}

export default useWalletNfts
