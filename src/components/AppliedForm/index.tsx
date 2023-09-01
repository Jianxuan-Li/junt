import React, { useEffect, useContext } from 'react'
import dayjs from 'dayjs'
import { appendAppliedJob } from '@/libs/sync'
import { SheetInfoContext } from '@/context/SheetInfoContext'
import './index.css'
import { JobPostingMessage } from './types'
import { query } from './jobsnap'

type Props = {}

//2018-06-12T19:30
const formDateTimeFormat = 'YYYY-MM-DDTHH:mm'
const savedDateTimeFormat = 'YYYY-MM-DD HH:mm'

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
      if (request.message !== 'jobSnap') return

      setForm({
        company: request.company || '',
        title: request.title || '',
        url: request.url || '',
        datetime: now(),
      })
    }

    // add message listener
    chrome.runtime.onMessage.addListener(messageHandler)

    // run query to get information from job posting page
    query()

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
