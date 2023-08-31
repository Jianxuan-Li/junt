import React, { useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import { appendAppliedJob } from '@/libs/sync'
import { SheetInfoContext } from '@/context/SheetInfoContext'
import './index.css'

type Props = {}
type JobPostingMessage = {
  company?: string
  title?: string
  url?: string
  type: 'job-posting-linkedin'
}

//2018-06-12T19:30
const formDateTimeFormat = 'YYYY-MM-DDThh:mm'
const savedDateTimeFormat = 'YYYY-MM-DD hh:mm'

const now = () => {
  return dayjs().format(formDateTimeFormat)
}

export default function AppliedForm({}: Props) {
  const [loading, setLoading] = React.useState(false)
  const [form, setForm] = React.useState({
    company: '',
    title: '',
    url: '',
    datetime: now(),
  })
  const { sheetInfo } = useContext(SheetInfoContext)

  useEffect(() => {
    const messageHandler = (request: JobPostingMessage) => {
      if (request.type !== 'job-posting-linkedin') return

      setForm({
        company: request.company || '',
        title: request.title || '',
        url: request.url || '',
        datetime: now(),
      })
    }

    // add message listener
    chrome.runtime.onMessage.addListener(messageHandler)

    // do query to get company name and position
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
        let message: JobPostingMessage = {
          type: 'job-posting-linkedin',
        }

        // find company name from linkedin job page
        const companyDiv = document.querySelectorAll('div.jobs-unified-top-card__primary-description a.app-aware-link')
        if (companyDiv && companyDiv.length > 0) {
          message.company = (companyDiv[0] as HTMLElement).innerText
        }

        const positionDiv = document.querySelectorAll('h2.jobs-unified-top-card__job-title')
        if (positionDiv && positionDiv.length > 0) {
          message.title = (positionDiv[0] as HTMLElement).innerText
        }

        const urlA = document.querySelectorAll('div.jobs-unified-top-card__content--two-pane a.ember-view')
        if (urlA && urlA.length > 0) {
          const href = (urlA[0] as HTMLElement).getAttribute('href')
          // add hostname and remove query string
          const url = `${window.location.hostname}${href?.split('?')[0]}`
          message.url = url
        }

        chrome.runtime.sendMessage(message).catch(() => {})
      }

      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          func: getCompanyNameAndPosition,
        })
        .then(() => {})
        .catch(() => {})
    })

    return () => {
      if (chrome.runtime.onMessage.hasListener(messageHandler)) {
        chrome.runtime.onMessage.removeListener(messageHandler)
      }
    }
  }, [])

  const handleChange = (event: any) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!sheetInfo) {
      setMessage('Please setup your sheet first!')
      setAlertType('warning')
      setOpen(true)
      return
    }

    setLoading(true)

    await appendAppliedJob({
      ...form,
      datetime: dayjs(form.datetime).format(savedDateTimeFormat),
    })

    // reset form
    setForm({
      company: '',
      title: '',
      url: '',
      datetime: now(),
    })

    setMessage('Application saved!')
    setAlertType('success')
    setOpen(true)
    setLoading(false)

    // send message to content script to update applied list
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, { message: 'updateAppliedMap' }).catch(() => {})
    })
  }

  const [open, setOpen] = React.useState(false)
  const [alertType, setAlertType] = React.useState<'success' | 'warning'>('success')
  const [message, setMessage] = React.useState('Application saved!')

  return (
    <div className="manuallyForm">
      <h1>Save to applied</h1>
      <form onSubmit={handleSubmit} className="appliedForm">
        <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Company" />
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Position/Title" />
        <input type="text" name="url" value={form.url} onChange={handleChange} placeholder="url" />
        <input type="datetime-local" name="datetime" value={form.datetime} onChange={handleChange} />
        <input type="submit" value="Save" disabled={loading} />
      </form>
      {open && <div className={`alert alert-${alertType}`}>{message}</div>}
    </div>
  )
}
