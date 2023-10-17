export type JobPostingMessage = {
  company?: string
  title?: string
  url?: string
  message?: string
  type: 'job-listing-linkedin' | 'job-detail-linkedin' | 'job-listing-glassdoor' | 'job-searching-glassdoor'
}
