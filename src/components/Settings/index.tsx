import React, { useEffect } from 'react'
import { sheetsApiGet } from '@/libs/sheetsApi'
import { getFromSyncStorage } from '@/libs/storage'
import { SheetInfoContext } from '@/context/SheetInfoContext'
import './index.css'
import ConnectButton from './ConnectButton'
import DisconnectButton from './DisconnectButton'
import OpenSheetButton from './OpenSheetButton'
import FindSheetsId from './FindSheetsId'
import { fetchAppliedList } from '@/libs/sync'

type Props = {}

export default function index({}: Props) {
  const [sheet, setSheet] = React.useState<any>(null)
  const [sheetId, setSheetId] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(true)

  const { setSheetInfo } = React.useContext(SheetInfoContext)

  const handleConnect = async () => {
    const res = await sheetsApiGet(`/${sheetId}`)
    setSheet(res)

    chrome.storage.sync.set({ sheetId })
    chrome.storage.sync.set({ sheet: res })
    setSheetInfo(res)

    // force sync the applied list to local
    const appliedList = await fetchAppliedList()

    // send message to content script to update applied list
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: 'sheetIdUpdated', appliedList }).catch(() => {})
    })
  }

  const handleDisconnect = () => {
    chrome.storage.local.clear()
    chrome.storage.sync.clear()
    setSheetId('')
    setSheet(null)
    setSheetInfo(null)
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: 'disconnectedGoogleSheet' }).catch(() => {})
    })
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
      setSheet(storedSheet)
      setLoading(false)
    }
    getData()
  }, [])

  return (
    <div className="settings">
      {!loading && !sheet && (
        <div className="connect">
          <div>
            <h1>Connect to your google sheet</h1>
          </div>
          <div className="connectionForm">
            <input
              className="sheetIdInput"
              type="text"
              aria-label="Sheet ID"
              placeholder="Sheet ID"
              value={sheetId}
              onChange={handleSheetIdChange}
            />
            <ConnectButton onClick={handleConnect} />
          </div>
          <div className="helpFindSheetId">
            <FindSheetsId />
          </div>
        </div>
      )}

      {!loading && sheet !== null && (
        <div className="connectedInfo">Connected to your google sheets: {sheet.properties.title}</div>
      )}

      {!loading && sheet !== null && (
        <>
          <DisconnectButton onClick={handleDisconnect} />
          <OpenSheetButton id={sheetId} />
        </>
      )}
    </div>
  )
}
