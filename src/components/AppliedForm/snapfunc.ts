import { JobPostingMessage } from './types'

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

export const snapGlassdoor = (): JobPostingMessage => {
  let message: JobPostingMessage = {
    message: 'jobSnap',
    type: 'job-listing-glassdoor',
  }

  // base element: app-navigation
  const baseNode = document.getElementById('__next')
  if (!baseNode) return message

  // find detail element
  const doms = baseNode.querySelectorAll('header')
  if (!doms || doms.length === 0) return message

  // find job title
  const divs = doms[0].querySelectorAll('div')
  if (divs) {
    divs.forEach((div) => {
      // check is the class name matchs `JobDetails_jobTitle.*`
      let isMatch = false
      div.classList.forEach((className) => {
        if (className.match(/^JobDetails_jobTitle/)) {
          message.title = (div as HTMLElement).innerText
          isMatch = true
          return
        }
      })
      if (isMatch) return
    })
  }

  // find company name, in the first `a` element
  const companyA = doms[0].querySelector('a')
  if (companyA) {
    companyA.querySelectorAll('div').forEach((div) => {
      if (div.firstChild && div.firstChild.textContent) {
        message.company = div.firstChild.textContent
        return
      }
    })
  }

  message.url = window.location.href

  chrome.runtime.sendMessage(message).catch(() => {})
  return message
}
