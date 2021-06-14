import React, { useState, useCallback, useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import ReactGA from 'react-ga'
import Card from 'components/Card'
import { AutoColumn } from 'components/Column'
import { RowBetween, RowFixed, AutoRow } from 'components/Row'
import { ArrowLeft, AlertTriangle } from 'react-feather'
import useTheme from 'hooks/useTheme'
import { transparentize } from 'polished'
import { SectionBreak } from 'components/swap/styleds'
import ListLogo from 'components/ListLogo'
import { PaddedColumn, Checkbox, TextDot } from './styleds'
import { TokenList } from '@uniswap/token-lists'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { useFetchListCallback } from 'hooks/useFetchListCallback'
import { removeList, enableList } from 'state/lists/actions'
import { CurrencyModalView } from './CurrencySearchModal'
import { useAllLists } from 'state/lists/hooks'
import { Text, CloseIcon, Button } from '@soy-libs/uikit'
import { ExternalLink } from 'components/Shared'

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: auto;
`

interface ImportProps {
  listURL: string
  list: TokenList
  onDismiss: () => void
  setModalView: (view: CurrencyModalView) => void
}

export function ImportList({ listURL, list, setModalView, onDismiss }: ImportProps) {
  const theme = useContext(ThemeContext)
  const dispatch = useDispatch<AppDispatch>()

  // user must accept
  const [confirmed, setConfirmed] = useState(false)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List',
          label: listURL
        })

        // turn list on
        dispatch(enableList(listURL))
        // go back to lists
        setModalView(CurrencyModalView.manage)
      })
      .catch(error => {
        ReactGA.event({
          category: 'Lists',
          action: 'Add List Failed',
          label: listURL
        })
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL, setModalView])

  return (
    <Wrapper>
      <PaddedColumn gap="14px" style={{ width: '100%', flex: '1 1' }}>
        <RowBetween>
          <ArrowLeft style={{ cursor: 'pointer' }} onClick={() => setModalView(CurrencyModalView.manage)} />
          <Text>Import List</Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
      </PaddedColumn>
      <SectionBreak />
      <PaddedColumn gap="md">
        <AutoColumn gap="md">
          <Card backgroundColor={theme.colors.background} padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {list.logoURI && <ListLogo logoURI={list.logoURI} size="40px" />}
                <AutoColumn gap="sm" style={{ marginLeft: '20px' }}>
                  <RowFixed>
                    <Text fontWeight={600} mr="6px">
                      {list.name}
                    </Text>
                    <TextDot />
                    <Text fontSize={'16px'} ml="6px">
                      {list.tokens.length} tokens
                    </Text>
                  </RowFixed>
                  <ExternalLink href={`https://tokenlists.org/token-list?url=${listURL}`}>
                    <Text fontSize={'12px'} color={theme.colors.text}>
                      {listURL}
                    </Text>
                  </ExternalLink>
                </AutoColumn>
              </RowFixed>
            </RowBetween>
          </Card>
          <Card style={{ backgroundColor: transparentize(0.8, theme.colors.failure) }}>
            <AutoColumn justify="center" style={{ textAlign: 'center', gap: '16px', marginBottom: '12px' }}>
              <AlertTriangle stroke={theme.colors.failure} size={32} />
              <Text fontWeight={500} fontSize={`20px`} color={theme.colors.failure}>
                Import at your own risk{' '}
              </Text>
            </AutoColumn>

            <AutoColumn style={{ textAlign: 'center', gap: '16px', marginBottom: '12px' }}>
              <Text fontWeight={500} color={theme.colors.failure}>
                By adding this list you are implicitly trusting that the data is correct. Anyone can create a list,
                including creating fake versions of existing lists and lists that claim to represent projects that do
                not have one.
              </Text>
              <Text fontWeight={600} color={theme.colors.failure}>
                If you purchase a token from this list, you may not be able to sell it back.
              </Text>
            </AutoColumn>
            <AutoRow justify="center" style={{ cursor: 'pointer' }} onClick={() => setConfirmed(!confirmed)}>
              <Checkbox
                name="confirmed"
                type="checkbox"
                checked={confirmed}
                onChange={() => setConfirmed(!confirmed)}
              />
              <Text ml="10px" fontSize="16px" color={theme.colors.failure} fontWeight={500}>
                I understand
              </Text>
            </AutoRow>
          </Card>

          <Button
            disabled={!confirmed}
            padding="10px 1rem"
            onClick={handleAddList}
          >
            Import
          </Button>
          {addError ? (
            <Text title={addError} style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {addError}
            </Text>
          ) : null}
        </AutoColumn>
        {/* </Card> */}
      </PaddedColumn>
    </Wrapper>
  )
}
