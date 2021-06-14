import React, { useContext, useState } from 'react'
import { Token, Currency } from '@soy-libs/sdk'
import styled, { ThemeContext } from 'styled-components'
import Card from 'components/Card'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed, AutoRow } from 'components/Row'
import CurrencyLogo from 'components/CurrencyLogo'
import { ArrowLeft, AlertTriangle, X } from 'react-feather'
import { transparentize } from 'polished'
import { SectionBreak } from 'components/swap/styleds'
import { useAddUserToken } from 'state/user/hooks'
import { getExplorerLink } from 'utils'
import { useActiveWeb3React } from 'hooks'
// import { ExternalLink } from '../../theme/components'
import { useCombinedInactiveList } from 'state/lists/hooks'
import ListLogo from 'components/ListLogo'
import { PaddedColumn, Checkbox } from './styleds'
import { Button, Text, CloseIcon } from '@soy-libs/uikit'
import { ExternalLink } from 'components/Shared'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`

const WarningWrapper = styled(Card)<{ highWarning: boolean }>`
  background-color: ${({ theme, highWarning }) =>
    highWarning ? transparentize(0.8, theme.red1) : transparentize(0.8, theme.yellow2)};
  width: fit-content;
`

const AddressText = styled.input`
  font-size: 12px;
`
// export const CloseIcon = styled(X)<{ onClick: () => void }>`
//   cursor: pointer;
// `

interface ImportProps {
  tokens: Token[]
  onBack?: () => void
  onDismiss?: () => void
  handleCurrencySelect?: (currency: Currency) => void
}

export function ImportToken({ tokens, onBack, onDismiss, handleCurrencySelect }: ImportProps) {
  const theme = useContext(ThemeContext)

  const { chainId } = useActiveWeb3React()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  // higher warning severity if either is not on a list
  const fromLists =
    (chainId && inactiveTokenList?.[chainId]?.[tokens[0]?.address]) ||
    (chainId && inactiveTokenList?.[chainId]?.[tokens[1]?.address])

  return (
    <Wrapper>
      <PaddedColumn gap="14px" style={{ width: '100%', flex: '1 1' }}>
        <RowBetween>
          {onBack ? <ArrowLeft style={{ cursor: 'pointer' }} onClick={onBack} /> : <div></div>}
          <Text>Import {tokens.length > 1 ? 'Tokens' : 'Token'}</Text>
          {onDismiss ? <CloseIcon onClick={onDismiss} /> : <div></div>}
        </RowBetween>
      </PaddedColumn>
      <SectionBreak />
      <PaddedColumn gap="md">
        {tokens.map(token => {
          const list = chainId && inactiveTokenList?.[chainId]?.[token.address]
          return (
            <Card backgroundColor={theme.colors.background} key={'import' + token.address} className=".token-warning-container">
              <AutoColumn gap="10px">
                <AutoRow align="center">
                  <CurrencyLogo currency={token} size={'24px'} />
                  <Text ml="8px" mr="8px" fontWeight={500}>
                    {token.symbol}
                  </Text>
                  <Text fontWeight={300}>{token.name}</Text>
                </AutoRow>
                {chainId && (
                  <ExternalLink href={getExplorerLink(chainId, token.address, 'address')}>
                    <AddressText>{token.address}</AddressText>
                  </ExternalLink>
                )}
                {list !== undefined ? (
                  <RowFixed>
                    {list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
                    <Text ml="6px" color={theme.colors.text}>
                      via {list.name}
                    </Text>
                  </RowFixed>
                ) : (
                  <WarningWrapper borderRadius="4px" padding="4px" highWarning={true}>
                    <RowFixed>
                      <AlertTriangle stroke={theme.colors.failure} size="10px" />
                      <Text color={theme.colors.failure} ml="4px" fontSize="10px" fontWeight={500}>
                        Unknown Source
                      </Text>
                    </RowFixed>
                  </WarningWrapper>
                )}
              </AutoColumn>
            </Card>
          )
        })}

        <Card
          style={{ backgroundColor: fromLists ? transparentize(0.8, theme.colors.text) : transparentize(0.8, theme.colors.failure) }}
        >
          <AutoColumn justify="center" style={{ textAlign: 'center', gap: '16px', marginBottom: '12px' }}>
            <AlertTriangle stroke={fromLists ? theme.colors.text : theme.colors.failure} size={32} />
            <Text fontWeight={600} fontSize={"20px"} >
              Trade at your own risk!
            </Text>
          </AutoColumn>

          <AutoColumn style={{ textAlign: 'center', gap: '16px', marginBottom: '12px' }}>
            <Text fontWeight={400}>
              Anyone can create a token, including creating fake versions of existing tokens that claim to represent
              projects.
            </Text>
            <Text fontWeight={600} >
              If you purchase this token, you may not be able to sell it back.
            </Text>
          </AutoColumn>
          <AutoRow justify="center" style={{ cursor: 'pointer' }} onClick={() => setConfirmed(!confirmed)}>
            <Checkbox
              className=".understand-checkbox"
              name="confirmed"
              type="checkbox"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            <Text ml="10px" fontSize="16px" fontWeight={500}>
              I understand
            </Text>
          </AutoRow>
        </Card>
        <Button
          disabled={!confirmed}
          padding="10px 1rem"
          onClick={() => {
            tokens.map(token => addToken(token))
            handleCurrencySelect && handleCurrencySelect(tokens[0])
          }}
          className=".token-dismiss-button"
        >
          Import
        </Button>
      </PaddedColumn>
    </Wrapper>
  )
}
