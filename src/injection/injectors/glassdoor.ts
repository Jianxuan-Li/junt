import InjectionFactory from '../factory'
import GlassdoorTarget from '../targets/glassdoor'
import { InjectionTarget } from '../interfaces'
import { AppliedMap } from '@/types/appliedJob'

export default class GlassdoorInjector extends InjectionFactory {
  public createInjector(url: string, appliedMap: AppliedMap): InjectionTarget {
    const injectTarget = new GlassdoorTarget(url)
    injectTarget.setAppliedMap(appliedMap)
    return injectTarget
  }
}
