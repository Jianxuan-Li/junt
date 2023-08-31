import React from 'react'
import styled from '@emotion/styled'

type Props = {
  children?: React.ReactNode
  onClick?: () => any
}

const Button = styled.button`
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  color: #000;
  cursor: pointer;
  line-height: 1;
  margin: 0;
  width: 22px;
  height: 32px;
  outline: none;
  overflow: hidden;
  padding: 5px;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.3s ease-in-out;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: auto;
  &:hover {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    color: #000;
    transition:
      background-color 0.2s ease-in-out,
      border-color 0.2s ease-in-out,
      color 0.2s ease-in-out;
  }
  &:active {
    background-color: #e0e0e0;
    border-color: #aeaeae;
    color: #000;
  }
`

export default function NavButton({ children, onClick }: Props) {
  return <Button onClick={onClick}>{children}</Button>
}
