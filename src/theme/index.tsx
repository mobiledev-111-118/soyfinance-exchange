
import React, { HTMLProps, useCallback } from 'react'
import ReactGA from 'react-ga'
import { Link } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import { darken } from 'polished'
import { ArrowLeft, X, ExternalLink as LinkIconFeather, Trash } from 'react-feather'

export const IconWrapper = styled.div<{ stroke?: string; size?: string; marginRight?: string; marginLeft?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size ?? '20px'};
  height: ${({ size }) => size ?? '20px'};
  margin-right: ${({ marginRight }) => marginRight ?? 0};
  margin-left: ${({ marginLeft }) => marginLeft ?? 0};
  & > * {
    stroke: ${({ theme, stroke }) => stroke ?? theme.colors.contrast};
  }
`

const Base = styled(RebassButton)<{
    padding?: string
    width?: string
    borderRadius?: string
    altDisabledStyle?: boolean
  }>`
    padding: ${({ padding }) => (padding ? padding : '18px')};
    width: ${({ width }) => (width ? width : '100%')};
    font-weight: 500;
    text-align: center;
    border-radius: 40px;
    border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
    outline: none;
    border: 1px solid transparent;
    color: white;
    text-decoration: none;
    display: flex;
    justify-content: center;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
    position: relative;
    z-index: 1;
    &:disabled {
      cursor: auto;
    }
  
    > * {
      user-select: none;
    }
  `
export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`
export const TrashIcon = styled(Trash)`
  height: 16px;
  width: 18px;
  margin-left: 10px;
  stroke: ${({ theme }) => theme.colors.icontext};

  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;

  :hover {
    opacity: 0.7;
  }
`

const LinkIconWrapper = styled.a`
  text-decoration: none;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  display: flex;

  :hover {
    text-decoration: none;
    opacity: 0.7;
  }

  :focus {
    outline: none;
    text-decoration: none;
  }

  :active {
    text-decoration: none;
  }
`

export const LinkIcon = styled(LinkIconFeather)`
  height: 16px;
  width: 18px;
  margin-left: 10px;
  stroke: ${({ theme }) => theme.colors.contrast};
`

export function ExternalLinkIcon({
    target = '_blank',
    href,
    rel = 'noopener noreferrer',
    ...rest
  }: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & { href: string }) {
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        // don't prevent default, don't redirect if it's a new tab
        if (target === '_blank' || event.ctrlKey || event.metaKey) {
          ReactGA.outboundLink({ label: href }, () => {
            console.debug('Fired outbound link event', href)
          })
        } else {
          event.preventDefault()
          // send a ReactGA event and then trigger a location change
          ReactGA.outboundLink({ label: href }, () => {
            window.location.href = href
          })
        }
      },
      [href, target]
    )
    return (
      <LinkIconWrapper target={target} rel={rel} href={href} onClick={handleClick} {...rest}>
        <LinkIcon />
      </LinkIconWrapper>
    )
  }
  export const ButtonText = styled.button`
    outline: none;
    border: none;
    font-size: inherit;
    padding: 0;
    margin: 0;
    background: none;
    cursor: pointer;

    :hover {
        opacity: 0.7;
    }

    :focus {
        text-decoration: underline;
    }
`