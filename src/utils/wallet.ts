// Set of helper functions to facilitate wallet setup

import { nodes } from './getRpcUrl'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = (window as Window).ethereum
  if (provider) {
    const chainId = parseInt(process.env.REACT_APP_CHAIN_ID === undefined ? "20792" : process.env.REACT_APP_CHAIN_ID, 10)
    console.log("===provider :: ", provider, chainId)

    try {
      if( provider.request ){
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Callisto TestNet',
              nativeCurrency: {
                name: 'CLO',
                symbol: 'clo',
                decimals: 18,
              },
              rpcUrls: nodes,
              blockExplorerUrls: ['https://testnet-explorer.callisto.network/'],
            },
          ],
        })
        return true
      } 
      console.error("Can't setup the CLO network on metamask because provider.request is undefined")
      return false
    } catch (error) {
      console.error(error)
      return false
    }
  } else {
    console.error("Can't setup the CLO network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
) => {
  const provider = (window as Window).ethereum
  if( provider?.request ){
    const tokenAdded = await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    })
  
    return tokenAdded
  }
  return null;
}
