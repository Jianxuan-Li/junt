import { AppliedMapValue } from '@/types/appliedJob'
import dayjs from 'dayjs'

export const badgeSelector: string = 'div.juntInjectedAppliedBadge'

// create badge element
export const createBadge = (applied: AppliedMapValue): HTMLElement => {
  const badge = document.createElement('div')
  badge.classList.add(badgeSelector.split('.')[1])
  if (applied.title) {
    badge.innerHTML = `Junt: You applied ${applied.title}`
    badge.innerHTML += `<br />on ${dayjs(applied.datetime).format('dddd, MM D YYYY, h:mm')}`
  } else {
    badge.innerHTML = `Junt: You applied on ${dayjs(applied.datetime).format('dddd, MM D YYYY, h:mm')}`
  }
  return badge
}
