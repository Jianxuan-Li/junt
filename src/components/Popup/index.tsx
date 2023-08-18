import React from 'react'
import './popup.css'
import Popup from './Popup'
import SheetInfoProvider from '@/context/SheetInfoContext'

type Props = {}

export default function PopupIndexPage({}: Props) {
  return (
    <SheetInfoProvider>
      <Popup />
    </SheetInfoProvider>
  )
}
