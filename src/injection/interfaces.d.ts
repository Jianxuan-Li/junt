import { AppliedMap } from '@/types/appliedJob'

export interface InjectionTarget {
  url: string
  allowedUrls: string[]
  appliedMap: AppliedMap
  setAppliedMap(appliedMap: AppliedMap): void
  isInjectable(): boolean
  inject(): Promise<void>
}
