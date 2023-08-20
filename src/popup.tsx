import React from 'react'
import PopupPage from './components/Popup'

import { createRoot } from 'react-dom/client'
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<PopupPage />)
