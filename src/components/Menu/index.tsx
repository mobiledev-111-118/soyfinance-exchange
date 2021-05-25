import React, { useContext } from 'react'
import { Menu as UikitMenu} from '@soy-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import useGetLocalProfile from 'hooks/useGetLocalProfile'
import useAuth from 'hooks/useAuth'

// import { Helmet } from 'react-helmet-async'
// import { useLocation } from 'react-router'
// import { customMeta, DEFAULT_META } from 'constants/meta'
import links from './config'

// const PageMeta = ({price}) => {
//   const { pathname } = useLocation()
//   const priceData = price
//   const cakePriceUsd = priceData? priceData.callisto.usd.toString(): 0;
//   const cakePriceUsdDisplay = cakePriceUsd
//     ? ''
//     : `$${cakePriceUsd.toLocaleString(undefined, {
//         minimumFractionDigits: 3,
//         maximumFractionDigits: 3,
//       })}`
//   const pageMeta = customMeta[pathname] || {}
//   const { title, description, image } = { ...DEFAULT_META, ...pageMeta }
//   const pageTitle = cakePriceUsdDisplay ? [title, cakePriceUsdDisplay].join(' - ') : title
//   return (
//     <Helmet>
//       <title>{pageTitle}</title>
//       <meta property="og:title" content={pageTitle} />
//       <meta property="og:description" content={description} />
//       <meta property="og:image" content={image} />
//     </Helmet>
//   )
// }

const Menu: React.FC = (props) => {
  const { account } = useWeb3React()
  const { login, logout } = useAuth()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const priceData = useGetPriceData()
  const cakePriceUsd = priceData ? Number(priceData.callisto.usd) : undefined
  const profile = useGetLocalProfile()

  return (
    <>
      <UikitMenu
        links={links}
        account={account as string}
        login={login}
        logout={logout}
        isDark={isDark}
        toggleTheme={toggleTheme}
        currentLang={selectedLanguage?.code || ''}
        langs={allLanguages}
        setLang={setSelectedLanguage}
        cakePriceUsd={cakePriceUsd}
        profile={profile}
        {...props}
      />
    </>
  )
}

export default Menu
