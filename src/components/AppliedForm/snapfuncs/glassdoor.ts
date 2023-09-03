import { JobPostingMessage } from '../types'

export const snapGlassdoor = (): JobPostingMessage => {
  try {
    // index page
    const snapGlassdoorIndex = (): JobPostingMessage => {
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
      } else {
        // find compnay name in `div` element
        const companyDiv = doms[0].querySelectorAll('div')
        if (companyDiv) {
          let found = false
          companyDiv.forEach((div) => {
            div.classList.forEach((className) => {
              if (className.match(/^JobDetails_jobDetailsHeader/)) {
                if (div.firstChild) {
                  message.company = (div.firstChild as HTMLElement).innerText
                  found = true
                  return
                }
              }
            })
            if (found) return
          })
        }
      }

      message.url = window.location.href

      chrome.runtime.sendMessage(message).catch(() => {})
      return message
    } // end of snapGlassdoorIndex

    // search page
    const snapGlassdoorSearch = (): JobPostingMessage => {
      let message: JobPostingMessage = {
        message: 'jobSnap',
        type: 'job-searching-glassdoor',
      }

      // data-test="jobTitle"
      const jobTitle = document.querySelectorAll('div[data-test="jobTitle"]')
      if (jobTitle && jobTitle.length > 0) {
        message.title = (jobTitle[0] as HTMLElement).innerText
      }

      // div date-test="employerName"
      const employerName = document.querySelectorAll('div[data-test="employerName"]')
      if (employerName && employerName.length > 0) {
        message.company = (employerName[0] as HTMLElement).firstChild?.textContent || ''
      }

      message.url = window.location.href
      chrome.runtime.sendMessage(message).catch(() => {})
      return message
    } // end of snapGlassdoorSearch

    const currentUrl = window.location.href
    if (currentUrl.includes('index.htm')) {
      return snapGlassdoorIndex()
    }

    if (currentUrl.includes('-jobs-')) {
      return snapGlassdoorSearch()
    }

    return {
      message: 'jobSnap',
      type: 'job-listing-glassdoor',
    }
  } catch (e) {
    return {
      message: 'jobSnap',
      type: 'job-listing-glassdoor',
    }
  }
}
