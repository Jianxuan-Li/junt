import { JobPostingMessage } from '../types'

// get company name and position from linkedin job page
export const snapLinkedin = (): JobPostingMessage => {
  let message: JobPostingMessage = {
    message: 'jobSnap',
    type: 'job-listing-linkedin',
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

  // send to popup
  chrome.runtime.sendMessage(message).catch(() => {})
  return message
}
