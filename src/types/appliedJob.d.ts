export type appliedJob = {
  id?: number
  title: string
  company: string
  datetime: string
  url?: string
}

export type AppliedList = appliedJob[]

export type AppliedMapValue = {
  datetime: string
  title: string
  id: number
}

export type AppliedMap = Map<string, AppliedMapValue>
