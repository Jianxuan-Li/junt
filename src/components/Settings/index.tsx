import React from 'react'
import Button from '@mui/material/Button'

type Props = {}

export default function index({}: Props) {
  return (
    <div>
        <Button variant="outlined" onClick={() => {
            chrome.storage.local.clear()
            chrome.storage.sync.clear()
        }} >Clear data</Button>
    </div>
  )
}