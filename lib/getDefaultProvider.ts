const { ethers } = require('ethers')

const getDefaultProvider = (chainId) => {
  const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
  const polygonRpc = alchemyId
    ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyId}`
    : 'https://polygon-rpc.com'
  const mumbaiRpc = alchemyId
    ? `https://polygon-mumbai.g.alchemy.com/v2/${alchemyId}`
    : 'https://rpc-mumbai.maticvigil.com'

  const chainIdInt = parseInt(chainId?.toString())

  if (!chainId) return null

  if (chainIdInt === 137) {
    return ethers.getDefaultProvider(polygonRpc)
  } 
  if (chainId = 80001) {
    return ethers.getDefaultProvider(mumbaiRpc)
  }
}

export default getDefaultProvider
