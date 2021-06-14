import React, { useRef, RefObject, useCallback, useState, useMemo, useContext } from 'react'
import Column from 'components/Column'
import { PaddedColumn, Separator, SearchInput } from './styleds'
import Row, { RowBetween, RowFixed } from 'components/Row'
import { TrashIcon, ExternalLinkIcon, ButtonText } from 'theme'
import { useToken } from 'hooks/Tokens'
import styled, { ThemeContext } from 'styled-components'
import { useUserAddedTokens, useRemoveUserAddedToken } from 'state/user/hooks'
import { Token } from '@soy-libs/sdk'
import CurrencyLogo from 'components/CurrencyLogo'
import { getExplorerLink, isAddress } from 'utils'
import { useActiveWeb3React } from 'hooks'
import Card from 'components/Card'
import ImportRow from './ImportRow'
import useTheme from '../../hooks/useTheme'

import { CurrencyModalView } from './CurrencySearchModal'
import { ExternalLink } from 'components/Shared'
import { Text } from '@soy-libs/uikit'

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  position: relative;
  padding-bottom: 60px;
`

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  border-radius: 20px;
  border-top-right-radius: 0;
  border-top-left-radius: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.backgroundAlert};
  padding: 20px;
  text-align: center;
`

export default function ManageTokens({
  setModalView,
  setImportToken
}: {
  setModalView: (view: CurrencyModalView) => void
  setImportToken: (token: Token) => void
}) {
  const { chainId } = useActiveWeb3React()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const theme = useContext(ThemeContext)

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  // if they input an address, use it
  const isAddressSearch = isAddress(searchQuery)
  const searchToken = useToken(searchQuery)

  // all tokens for local lisr
  const userAddedTokens: Token[] = useUserAddedTokens()
  const removeToken = useRemoveUserAddedToken()

  const handleRemoveAll = useCallback(() => {
    if (chainId && userAddedTokens) {
      userAddedTokens.map(token => {
        return removeToken(chainId, token.address)
      })
    }
  }, [removeToken, userAddedTokens, chainId])

  const tokenList = useMemo(() => {
    return (
      chainId &&
      userAddedTokens.map(token => (
        <RowBetween key={token.address} width="100%">
          <RowFixed>
            <CurrencyLogo currency={token} size={'20px'} />
            <ExternalLink href={getExplorerLink(chainId, token.address, 'address')}>
              <Text ml={'10px'} fontWeight={600}>
                {token.symbol}
              </Text>
            </ExternalLink>
          </RowFixed>
          <RowFixed>
            <TrashIcon onClick={() => removeToken(chainId, token.address)} />
            <ExternalLinkIcon href={getExplorerLink(chainId, token.address, 'address')} />
          </RowFixed>
        </RowBetween>
      ))
    )
  }, [userAddedTokens, chainId, removeToken])

  return (
    <Wrapper>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <Row>
            <SearchInput
              type="text"
              id="token-search-input"
              placeholder={'0x0000'}
              value={searchQuery}
              autoComplete="off"
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
            />
          </Row>
          {searchQuery !== '' && !isAddressSearch && <Text >Enter valid token address</Text>}
          {searchToken && (
            <Card backgroundColor={theme.colors.backgroundAlt} padding="10px 0">
              <ImportRow
                token={searchToken}
                showImportView={() => setModalView(CurrencyModalView.importToken)}
                setImportToken={setImportToken}
                style={{ height: 'fit-content' }}
              />
            </Card>
          )}
        </PaddedColumn>
        <Separator />
        <PaddedColumn gap="lg">
          <RowBetween>
            <Text fontWeight={600}>
              {userAddedTokens?.length} Custom {userAddedTokens.length === 1 ? 'Token' : 'Tokens'}
            </Text>
            {userAddedTokens.length > 0 && (
              <ButtonText onClick={handleRemoveAll}>
                <Text>Clear all</Text>
              </ButtonText>
            )}
          </RowBetween>
          {tokenList}
        </PaddedColumn>
      </Column>
      <Footer>
        <Text>Tip: Custom tokens are stored locally in your browser</Text>
      </Footer>
    </Wrapper>
  )
}