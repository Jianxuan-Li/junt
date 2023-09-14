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
  id: string
}

// sheet url: https://docs.google.com/spreadsheets/d/1B2Qd22qK6WaTGUGyZRPX6-KVGCBsrtZAh2b5DowgK04/

export default function OpenSheetButton({ id }: Props) {
  const handleOpen = () => {
    window.open(`https://docs.google.com/spreadsheets/d/${id}/`)
  }
  return <StyledButton onClick={handleOpen}>Open spreadsheet</StyledButton>
}
