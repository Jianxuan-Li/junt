/*
allows to create a new instance of a injection class like LinkedinInjection
detect by the url of tab
*/
import { InjectionTarget } from './interfaces'
import { AppliedMap } from '@/types/appliedJob'

abstract class InjectionFactory {
  public abstract createInjector(url: string, appliedMap: AppliedMap): InjectionTarget

  public inject(url: string, appliedMap: AppliedMap): boolean {
    const injection = this.createInjector(url, appliedMap)
    if (injection.isInjectable()) {
      injection.inject()
      return true
    }

    return false
  }
}

export default InjectionFactory
