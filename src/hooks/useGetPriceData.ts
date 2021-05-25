import { useEffect, useState } from 'react'

type ApiResponse = {
  callisto:{
    usd: Number
    usd_24h_change: Number
    usd_24h_vol: Number
    usd_market_cap: Number
  }
}
/**
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */
const apiold = 'https://api.pancakeswap.com/api/v1/price';
const api = 'https://api.coingecko.com/api/v3/simple/price?ids=callisto&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true'

const useGetPriceData = () => {
  const [data, setData] = useState<ApiResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api)
        const res: ApiResponse = await response.json()
        setData(res)
      } catch (error) {
        console.error('Unable to fetch price data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export default useGetPriceData
