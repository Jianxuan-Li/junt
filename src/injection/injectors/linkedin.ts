import InjectionFactory from '../factory'
import LinkedinTarget from '../targets/linkedin'
import { InjectionTarget } from '../interfaces'
import { AppliedMap } from '@/types/appliedJob'

export default class LinkedinInjector extends InjectionFactory {
  public createInjector(url: string, appliedMap: AppliedMap): InjectionTarget {
    const injectTarget = new LinkedinTarget(url)
    injectTarget.setAppliedMap(appliedMap)
    return injectTarget
  }
}
