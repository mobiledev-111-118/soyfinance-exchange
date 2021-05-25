import { useEffect, useState } from 'react'

type ApiResponse = {
  callisto:{
    usd: number
    usd_24h_change: number
    usd_24h_vol: number
    usd_market_cap: number
  }
}

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
