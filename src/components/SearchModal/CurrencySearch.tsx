import { Currency, ETHER, Token } from '@soy-libs/sdk'
import React, { KeyboardEvent, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactGA from 'react-ga'
import { Text, CloseIcon } from '@soy-libs/uikit'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FixedSizeList } from 'react-window'
import styled, { ThemeContext } from 'styled-components'
import AutoSizer from 'react-virtualized-auto-sizer'
import useI18n from 'hooks/useI18n'
import { useActiveWeb3React } from '../../hooks'
import { AppState } from '../../state'
import { useAllTokens, useIsUserAddedToken, useToken, useFoundOnInactiveList } from '../../hooks/Tokens'
import { useSelectedListInfo } from '../../state/lists/hooks'
import { LinkStyledButton } from '../Shared'
import { isAddress } from '../../utils'
import Card from '../Card'
import Column from '../Column'
import ListLogo from '../ListLogo'
import QuestionHelper from '../QuestionHelper'
import Row, { RowBetween, RowFixed } from '../Row'
import CommonBases from './CommonBases'
import CurrencyList from './CurrencyList'
import { filterTokens, useSortedTokensByQuery } from './filtering'
import SortButton from './SortButton'
import { useTokenComparator } from './sorting'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import useDebounce from 'hooks/useDebounce'
import useToggle from 'hooks/useToggle'
import useOnClickOutside from 'hooks/useOnClickOutside'
import { Edit } from 'react-feather'

import ImportRow from './ImportRow'
import { ButtonText, IconWrapper } from 'theme'

const Footer = styled.div`
  width: 100%;
  border-radius: 20px;
  padding: 20px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
`

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  showManageView: () => void
  showImportView: () => void
  setImportToken: (token: Token) => void
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  onDismiss,
  isOpen,
  showManageView,
  showImportView,
  setImportToken
}: CurrencySearchProps) {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  const fixedList = useRef<FixedSizeList>()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const [invertSearchOrder, setInvertSearchOrder] = useState<boolean>(false)
  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery)
  const searchToken = useToken(debouncedQuery)
  const searchTokenIsAdded = useIsUserAddedToken(searchToken)

  useEffect(() => {
    if( isAddressSearch ) {
      ReactGA.event({
        category: 'Currency Select',
        action: 'Search by address',
        label: isAddressSearch
      })
    }
  }, [isAddressSearch])

  const showETH: boolean = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    return s === '' || s === 'c' || s === 'cl' || s === 'clo'
  }, [debouncedQuery])

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const audioPlay = useSelector<AppState, AppState['user']['audioPlay']>((state) => state.user.audioPlay)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [isAddressSearch, searchToken, allTokens, debouncedQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter((token) => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter((token) => token.symbol?.toLowerCase() !== symbolMatch[0]),
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
      if (audioPlay) {
        const audio = document.getElementById('bgMusic') as HTMLAudioElement
        if (audio) {
          audio.play()
        }
      }
    },
    [onDismiss, onCurrencySelect, audioPlay]
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'clo') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, debouncedQuery]
  )

  // // menu ui
  const [open, toggle] = useToggle(false)
  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, open ? toggle : undefined)

  const selectedListInfo = useSelectedListInfo()
  const TranslateString = useI18n()

  const inactiveTokens = useFoundOnInactiveList(debouncedQuery)
  const filteredInactiveTokens: Token[] = useSortedTokensByQuery(inactiveTokens, debouncedQuery)
  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text>
            {TranslateString(82, 'Select a token')}
            <QuestionHelper
              text={TranslateString(
                128,
                'Find a token by searching for its name or symbol or by pasting its address below.'
              )}
            />
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={t('tokenSearchPlaceholder')}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        {showCommonBases && (
          <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
        )}
        <RowBetween>
          <Text fontSize="14px">{TranslateString(126, 'Token name')}</Text>
          <SortButton ascending={invertSearchOrder} toggleSortOrder={() => setInvertSearchOrder((iso) => !iso)} />
        </RowBetween>
      </PaddedColumn>

      <Separator />
      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: '20px 0', height: '100%'}}>
          <ImportRow token={searchToken} showImportView={showImportView} setImportToken={setImportToken} />
        </Column>
      ) : filteredSortedTokens?.length > 0 || filteredInactiveTokens?.length > 0 ? (
        <div style={{ flex: '1' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <CurrencyList
                height={height}
                showETH={showETH}
                currencies={filteredInactiveTokens ? filteredSortedTokens.concat(filteredInactiveTokens) : filteredSortedTokens}
                breakIndex={inactiveTokens && filteredSortedTokens ? filteredSortedTokens.length : undefined}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showImportView={showImportView}
                setImportToken={setImportToken}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <Column style={{ padding: '20px', height: '100%' }}>
          <Text color={theme.colors.failure} textAlign="center" mb="20px">
            No results found.
          </Text>
        </Column>
      )}
      <Footer>
        <Row style={{justifyContent: "center"}}>
          <ButtonText onClick={showManageView} color={theme.colors.text} className="list-token-manage-button">
            <RowFixed>
              <IconWrapper size="16px" marginRight="6px">
                <Edit />
              </IconWrapper>
              <Text color={theme.colors.text}>Manage</Text>
            </RowFixed>
          </ButtonText>
        </Row>
      </Footer>
    </Column>
  )
}

export default CurrencySearch


      {/* {null && (
        <>
          <Separator />
          <Card>
            <RowBetween>
              {selectedListInfo.current ? (
                <Row>
                  {selectedListInfo.current.logoURI ? (
                    <ListLogo
                      style={{ marginRight: 12 }}
                      logoURI={selectedListInfo.current.logoURI}
                      alt={`${selectedListInfo.current.name} list logo`}
                    />
                  ) : null}
                  <Text id="currency-search-selected-list-name">{selectedListInfo.current.name}</Text>
                </Row>
              ) : null}
              <LinkStyledButton
                style={{ fontWeight: 500, color: theme.colors.textSubtle, fontSize: 16 }}
                onClick={onChangeList}
                id="currency-search-change-list-button"
              >
                {selectedListInfo.current ? TranslateString(180, 'Change') : TranslateString(1152, 'Select a list')}
              </LinkStyledButton>
            </RowBetween>
          </Card>
        </>
      )} */}