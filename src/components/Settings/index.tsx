import React, { useEffect } from 'react'
import { Button, TextField } from '@mui/material'
import { sheetsApiGet } from '@/libs/sheetsApi'
import { getFromSyncStorage } from '@/libs/storage'
import './index.css'

import FindSheetsId from './FindSheetsId'

type Props = {}

export default function index({}: Props) {
  const [sheet, setSheet] = React.useState<any>(null)
  const [sheetId, setSheetId] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(true)
  const handleConnect = async () => {
    const res = await sheetsApiGet(`/${sheetId}`)
    setSheet(res)

    chrome.storage.sync.set({ sheetId })
    chrome.storage.sync.set({ sheet: res })
  }

  const handleSheetIdChange = (e: any) => {
    setSheetId(e.target.value)
  }

  useEffect(() => {
    // get sheet id and sheet from storage
    const getData = async () => {
      const [storedSheetId, storedSheet] = await Promise.all([
        getFromSyncStorage('sheetId'),
        getFromSyncStorage('sheet'),
      ])

      setSheetId(storedSheetId)
      console.log(storedSheetId)
      setSheet(storedSheet)
      setLoading(false)
    }
    getData()
  }, [])

  return (
    <div className="settings">
      {!loading && !sheet && (
        <div>
          <div>
            <TextField
              id="outlined-basic"
              label="Sheet ID"
              variant="outlined"
              fullWidth={true}
              defaultValue={sheetId}
              onChange={handleSheetIdChange}
            />
          </div>
          <div>
            <Button variant="outlined" onClick={handleConnect}>
              Connect to google sheet
            </Button>
          </div>
          <div className='helpFindSheetId'>
            <FindSheetsId />
          </div>
        </div>
      )}

      {!loading && sheet !== null && (
        <div className="connectedInfo">Connected to your google sheets: {sheet.properties.title}</div>
      )}

      {!loading && sheet !== null && (
        <Button
          variant="outlined"
          onClick={() => {
            chrome.storage.local.clear()
            chrome.storage.sync.clear()
            setSheetId('')
            setSheet(null)
          }}
        >
          Disconnect the google sheets and Clear data
        </Button>
      )}
    </div>
  )
}
