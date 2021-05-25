
type PageMeta = {
  title: string
  description: string
  image: string
}

export const DEFAULT_META: PageMeta = {
  title: 'SoySwap',
  description:
    'The most popular AMM on BSC by user count! Earn CAKE through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by SoySwap), NFTs, and more, on a platform you can trust.',
  image: 'https://soyswap.finance/images/easter-battle.png',
}

export const customMeta: { [key: string]: PageMeta } = {
  '/competition': {
    title: 'SoySwap Easter Battle',
    description: 'Register now for the SoySwap Easter battle!',
    image: 'https://soyswap.finance/images/easter-battle.png',
  },
}
