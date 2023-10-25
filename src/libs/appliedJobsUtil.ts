import { AppliedMap, AppliedList } from '@/types/appliedJob'

export const listToMap = (appliedList: AppliedList) => {
  const companyMap: AppliedMap = new Map()
  for (const item of appliedList) {
    companyMap.set(item.company, {
      datetime: item.datetime,
      title: item.title,
      id: item.id,
    })
  }
  return companyMap
}

export const listToMapLowerCase = (appliedList: AppliedList) => {
  const companyMap: AppliedMap = new Map()
  for (const item of appliedList) {
    companyMap.set(item.company.toLowerCase(), {
      datetime: item.datetime,
      title: item.title,
      id: item.id,
    })
  }
  return companyMap
}
