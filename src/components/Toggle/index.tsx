import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  padding: 0.25rem 0.5rem;
  border-radius: 14px;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.colors.primary : theme.colors.textSubtle) : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? "#FFF" : theme.colors.textSubtle) : theme.colors.textSubtle)};
  font-size: 1rem;
  font-weight: 400;

  padding: 0.35rem 0.6rem;
  border-radius: 10px;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.colors.primary : theme.colors.textSubtle) : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? "#FFF" : theme.colors.textSubtle) : theme.colors.textSubtle)};
  font-size: 1rem;
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    background: ${({ theme, isActive, isOnSwitch }) =>
      isActive ? (isOnSwitch ? theme.colors.primary : theme.colors.textSubtle) : 'none'};
    color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? "#FFF" : theme.colors.textSubtle) : theme.colors.textSubtle)};
  }
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 10px;
  border: none;
  background: ${({ theme }) => theme.colors.backgroundFade};
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <ToggleElement isActive={isActive} isOnSwitch={true}>
        On
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false}>
        Off
      </ToggleElement>
    </StyledToggle>
  )
}
