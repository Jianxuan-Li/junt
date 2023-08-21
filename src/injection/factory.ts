/*
allows to create a new instance of a injection class like LinkedinInjection
detect by the url of tab
*/
import { InjectionTarget } from './interfaces'
import { AppliedMap } from '@/types/appliedJob'

abstract class InjectionFactory {
  public abstract createInjector(url: string, appliedMap: AppliedMap): InjectionTarget
  injection: InjectionTarget | null = null

  public inject(url: string, appliedMap: AppliedMap): boolean {
    this.injection = this.createInjector(url, appliedMap)
    if (this.injection.isInjectable()) {
      this.injection.inject()
      return true
    }

    return false
  }

  public setAppliedMap(appliedMap: AppliedMap): void {
    this.injection?.setAppliedMap(appliedMap)
    this.injection?.updateInjection()
  }

  public destroy(): void {
    this.injection?.destory()
  }
}

export default InjectionFactory
