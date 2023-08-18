import React from 'react'
import styled from '@emotion/styled'

const StyledButton = styled.button`
  background: linear-gradient(130deg, #4f4f4f, #3aa571 58%, #319197 76%);
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  color: #f1f1f1;
  box-shadow: 0 0 5px #c4c4c4;
  &:hover {
    background-color: #000;
    color: #fff;
  }
`

type Props = {
  onClick: () => void
}

export default function DisconnectButton({ onClick }: Props) {
  return <StyledButton onClick={onClick}>Disconnect and clean data</StyledButton>
}
