import { MediaViewer } from '@components/ui'
import useManageTokenbound from '@hooks/useManageTokenbound'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import { useNetwork } from 'wagmi'

const MediaPanelTab = ({ tokens, smartWalletAddress, isSmartWallet = false }: any) => {
  const router = useRouter()
  const { chainId } = router.query as any
  const { addToSmartWallet, removeFromSmartWallet } =
    useManageTokenbound(smartWalletAddress)
  const { switchNetwork } = useNetwork()

  console.log('SWEETS MediaPanelTab tokens', tokens)
  const onClick = async (contractAddress, tokenId) => {
    console.log('REMOVE FROM WALLET')
    console.log('contractAddress', contractAddress)
    console.log('tokenId', tokenId)
    if (isSmartWallet) {
      await removeFromSmartWallet(contractAddress, tokenId, router.reload)
    } else {
      await addToSmartWallet(contractAddress, smartWalletAddress, tokenId, router.reload)
    }
  }

  return (
    <ul className="custom-scroll grid grid-cols-3 gap-2 overflow-y-auto">
      {tokens.map((t, i) => {
        let media = t?.media[0]?.gateway || t?.media[0]?.raw
        const isVideo = t?.media[0]?.format === 'mp4'
        if (isVideo) {
          media = t?.media[0]?.raw
        }

        return (
          <ConnectButton.Custom key={`${t.contract.address}-${t.tokenId}-${i}`}>
            {({ account, chain, openConnectModal }) => {
              // Note: If your app doesn't use authentication, you
              // can remove all 'authenticationStatus' checks
              const connected = account && chain
              const wrongNetwork = chain?.id !== parseInt(chainId)

              const handleConnectClick = () => {
                console.log('SWEETS CLICKED')
                console.log('SWEETS connected', connected)
                console.log('SWEETS wrongNetwork', wrongNetwork)
                return connected
                  ? wrongNetwork
                    ? switchNetwork(parseInt(chainId))
                    : onClick(t.contract.address, t.tokenId)
                  : openConnectModal()
              }

              return (
                <li onClick={handleConnectClick} className="list-none">
                  <MediaViewer url={media} isVideo={isVideo} />
                </li>
              )
            }}
          </ConnectButton.Custom>
        )
      })}
    </ul>
  )
}

export default MediaPanelTab
