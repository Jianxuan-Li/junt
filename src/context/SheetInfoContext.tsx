import React, { createContext, useState, useEffect } from 'react'
import { getFromSyncStorage } from '@/libs/storage'

interface SheetInfo {
  setSheetInfo: (sheetInfo: any) => void
  sheetInfoLoading: boolean
  sheetInfo: any
}

export const SheetInfoContext = createContext<SheetInfo>({
  setSheetInfo: () => {},
  sheetInfo: null,
  sheetInfoLoading: true,
})

type SheetInfoProviderProps = {
  children: React.ReactNode
}

const SheetInfoProvider = ({ children }: SheetInfoProviderProps) => {
  const [sheetInfo, setSheetInfo] = useState<any>(null)
  const [sheetInfoLoading, setSheetInfoLoading] = useState<boolean>(true)

  useEffect(() => {
    const getSheetInfo = async () => {
      setSheetInfo(await getFromSyncStorage('sheet'))
      setSheetInfoLoading(false)
    }
    getSheetInfo()
  }, [])

  return (
    <SheetInfoContext.Provider value={{ sheetInfo, setSheetInfo, sheetInfoLoading }}>
      {children}
    </SheetInfoContext.Provider>
  )
}

export default SheetInfoProvider
