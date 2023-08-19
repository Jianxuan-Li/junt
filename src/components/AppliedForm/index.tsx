import React, { useEffect, useContext } from 'react'
import moment from 'moment'
import Stack from '@mui/material/Stack'
import { Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import { FormControl } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
import { appendAppliedJob } from '@/libs/sync'
import { SheetInfoContext } from '@/context/SheetInfoContext'

import './index.css'

import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

type Props = {}

export default function AppliedForm({}: Props) {
  const [loading, setLoading] = React.useState(false)
  const [company, setCompany] = React.useState('')
  const [position, setPosition] = React.useState('')
  const [url, setUrl] = React.useState('')
  const { sheetInfo } = useContext(SheetInfoContext)

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      if (request.company) setCompany(request.company)
      if (request.position) setPosition(request.position)
      if (request.url) setUrl(request.url)
    })

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]

      // supported urls:
      const supportedUrls = ['linkedin.com/jobs/search/', 'linkedin.com/jobs/collections/']

      let isSupported = false
      supportedUrls.forEach((url) => {
        if (tab.url?.includes(url)) {
          isSupported = true
        }
      })

      if (!isSupported) {
        return
      }

      function getCompanyNameAndPosition() {
        let message = {}

        // find company name from linkedin job page
        const companyDiv = document.querySelectorAll('div.jobs-unified-top-card__primary-description a.app-aware-link')
        if (companyDiv && companyDiv.length > 0) {
          message = { company: (companyDiv[0] as HTMLElement).innerText }
        }

        const positionDiv = document.querySelectorAll('h2.jobs-unified-top-card__job-title')
        if (positionDiv && positionDiv.length > 0) {
          message = { ...message, position: (positionDiv[0] as HTMLElement).innerText }
        }

        const urlA = document.querySelectorAll('div.jobs-unified-top-card__content--two-pane a.ember-view')
        if (urlA && urlA.length > 0) {
          const href = (urlA[0] as HTMLElement).getAttribute('href')
          // add hostname and remove query string
          const url = `${window.location.hostname}${href?.split('?')[0]}`
          message = { ...message, url }
        }

        chrome.runtime.sendMessage(message)
      }

      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          func: getCompanyNameAndPosition,
        })
        .then(() => console.log('Injected a function!'))
    })
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!sheetInfo) {
      setMessage('Please setup your sheet first!')
      setAlertType('warning')
      setOpen(true)
      return
    }

    setLoading(true)
    const data = new FormData(event.currentTarget)
    await appendAppliedJob({
      company: company,
      title: position,
      datetime: data.get('datetime') as string,
      url: url,
    })

    setCompany('')
    setPosition('')
    setUrl('')

    setMessage('Application saved!')
    setAlertType('success')
    setOpen(true)
    setLoading(false)
  }

  const [open, setOpen] = React.useState(false)
  const [alertType, setAlertType] = React.useState<'success' | 'warning'>('success')
  const [message, setMessage] = React.useState('Application saved!')

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <div className="manuallyForm">
      <h1>Manually save to applied</h1>
      <Box autoComplete="off" component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
        <FormControl fullWidth={true}>
          <Stack spacing={2}>
            <TextField
              label="Company Name"
              name="company"
              required={true}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              size="small"
              fullWidth={true}
              variant="standard"
            />
            <TextField
              label="Position"
              name="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              size="small"
              fullWidth={true}
              variant="standard"
            />
            <TextField
              label="Url"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              size="small"
              fullWidth={true}
              variant="standard"
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DemoContainer components={['DateTimePicker']}>
                <DateTimePicker
                  label="Datetime"
                  slotProps={{ textField: { size: 'small', name: 'datetime' } }}
                  defaultValue={moment()}
                />
              </DemoContainer>
            </LocalizationProvider>
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="outlined"
              type="submit"
            >
              Save
            </LoadingButton>
          </Stack>
        </FormControl>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  )
}
