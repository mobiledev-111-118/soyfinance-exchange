import { ChainId } from '@soy-libs/sdk'
import MULTICALL_ABI from './abi.json'

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb', // TODO
  [ChainId.CLOTESTNET]: '0xDd2742Ba146A57F1F6e8F47235024ba1bd0cf568'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
