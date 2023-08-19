import React, { useContext, useEffect } from 'react'
import './popup.css'
import AppliedFormTab from '../AppliedForm'
import SettingsTab from '@/components/Settings'
import AppliedListTab from '@/components/AppliedList'
import AboutTab from '@/components/About'

import NavButton from '@/components/common/NavButton'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import CreateIcon from '@mui/icons-material/Create'
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest'
import InfoIcon from '@mui/icons-material/Info'
import CachedIcon from '@mui/icons-material/Cached'
import { fetchAppliedList } from '@/libs/sync'
import { SheetInfoContext } from '@/context/SheetInfoContext'

type Props = {
  onAppliedListLoaded?: (appliedList?: any) => void
}

export default function Popup({ onAppliedListLoaded }: Props) {
  const [tab, setTab] = React.useState(0)
  const [defaultAppliedList, setDefaultAppliedList] = React.useState([])
  const { sheetInfo, sheetInfoLoading } = useContext(SheetInfoContext)
  const [loading, setLoading] = React.useState(false)

  const handleSync = async () => {
    setLoading(true)
    const appList = await fetchAppliedList(true)
    setDefaultAppliedList(appList)
    setLoading(false)
    if (onAppliedListLoaded) {
      onAppliedListLoaded()
    }
  }

  useEffect(() => {
    if (!sheetInfoLoading && !sheetInfo) {
      setTab(2)
    }
  }, [sheetInfo, sheetInfoLoading])

  return (
    <div className="base">
      <div
        className={
          (!sheetInfo && tab == 0) || sheetInfoLoading || loading
            ? 'fullPageLoading'
            : 'fullPageLoading fullPageLoadingFadeout'
        }
      ></div>
      <div className="header">
        <div className="title">Junt</div>
        <div className="rightNav">
          {tab === 0 && sheetInfo && (
            <div className="navItem">
              <NavButton onClick={() => handleSync()}>
                <CachedIcon />
              </NavButton>
            </div>
          )}
          <div className="navItem">
            <NavButton onClick={() => setTab(0)}>
              <FormatListNumberedIcon />
            </NavButton>
          </div>
          <div className="navItem">
            <NavButton onClick={() => setTab(1)}>
              <CreateIcon />
            </NavButton>
          </div>
          <div className="navItem">
            <NavButton onClick={() => setTab(2)}>
              <SettingsSuggestIcon />
            </NavButton>
          </div>
          <div className="navItem">
            <NavButton onClick={() => setTab(3)}>
              <InfoIcon />
            </NavButton>
          </div>
        </div>
      </div>
      <div className="content">
        {tab === 0 && (
          <AppliedListTab
            defaultAppliedList={defaultAppliedList}
            onAppliedListLoading={() => setLoading(true)}
            onAppliedListLoaded={() => setLoading(false)}
          />
        )}
        {tab === 1 && <AppliedFormTab />}
        {tab === 2 && <SettingsTab />}
        {tab === 3 && <AboutTab />}
      </div>
    </div>
  )
}
