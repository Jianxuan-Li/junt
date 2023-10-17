import { JobPostingMessage } from '../types'

// get company name and position from linkedin job page
export const snapLinkedinDetail = (): JobPostingMessage => {
  let message: JobPostingMessage = {
    message: 'jobSnap',
    type: 'job-detail-linkedin',
  }

  // find company name from linkedin job page
  const companyDiv = document.querySelectorAll(
    'div.job-details-jobs-unified-top-card__primary-description a.app-aware-link',
  )
  if (companyDiv && companyDiv.length > 0) {
    message.company = (companyDiv[0] as HTMLElement).innerText
  }

  // find position from linkedin job page
  const positionDiv = document.querySelectorAll('h1.job-details-jobs-unified-top-card__job-title')
  if (positionDiv && positionDiv.length > 0) {
    message.title = (positionDiv[0] as HTMLElement).innerText
  }

  // find url from window.location, remove query string
  const url = window.location.href.split('?')[0]
  message.url = url

  // send to popup
  chrome.runtime.sendMessage(message).catch(() => {})
  return message
}
