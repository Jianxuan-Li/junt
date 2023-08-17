// Sync data from google sheet to local
import { appliedJob } from '@/types/appliedJob'
import moment from 'moment'
import { getSheetData, DEFUALT_RANGE, appendSheetData, sortSheetRows } from '@/libs/sheetsUtil'
import { saveAppliedList } from './storage'
import { saveToSyncStorage, getFromSyncStorage, STORAGE_KEY } from './storage'
import trie, { initTrie } from './searchUtil'

export const fromSheetToLocal = async (sheetData: any) => {
  const appliedList = sheetData.map((row: any[], index: number) => {
    return {
      id: index,
      title: row[2],
      company: row[1],
      datetime: row[0],
      url: row[3],
    }
  })
  await saveAppliedList(appliedList)
  return appliedList
}

export const renewLastSyncDatetime = async () => {
  await saveToSyncStorage('lastSyncDatetime', moment().format())
}

export const getLastSyncDatetime = async (): Promise<string> => {
  return await getFromSyncStorage('lastSyncDatetime')
}

export const shouldSync = async (): Promise<boolean> => {
  const lastSyncDatetime = await getLastSyncDatetime()
  if (!lastSyncDatetime) return true
  const lastSync = moment(lastSyncDatetime)
  const now = moment()
  const diff = now.diff(lastSync, 'minutes')
  return diff > 5
}

export const syncAppliedList = async (): Promise<appliedJob[]> => {
  /*
  force sync applied list from google sheet to local storage
  */
  const sheetId = await getFromSyncStorage('sheetId')
  if (!sheetId) return

  const appliedList = await getSheetData(sheetId, DEFUALT_RANGE)
  renewLastSyncDatetime()
  const transedList = await fromSheetToLocal(appliedList)
  initTrie(transedList)
  return transedList
}

export const fetchAppliedList = async (): Promise<appliedJob[]> => {
  /*
  fetch applied list from local storage (cache) or google sheet
  */
  const sheetId = await getFromSyncStorage('sheetId')

  if (!sheetId) return []

  let transedList: appliedJob[] = []
  if (await shouldSync()) {
    const appliedList = await getSheetData(sheetId, DEFUALT_RANGE)
    renewLastSyncDatetime()
    transedList = await fromSheetToLocal(appliedList)
  } else {
    transedList = await getFromSyncStorage(STORAGE_KEY)
  }

  initTrie(transedList)
  return transedList
}

export const appendAppliedJob = async (job: appliedJob) => {
  const sheetId = await getFromSyncStorage('sheetId')
  if (!sheetId) return

  const appliedList = await getFromSyncStorage(STORAGE_KEY)
  job.id = appliedList.length
  appliedList.push(job)
  await saveToSyncStorage(STORAGE_KEY, appliedList)
  trie.insert(job.company, job.id)

  const dt = moment(job.datetime).format('YYYY-MM-DD HH:mm:ss')
  const values = [[dt, job.company, job.title, job.url]]
  await appendSheetData(sheetId, DEFUALT_RANGE, values)
  await sortSheetRows(sheetId)
}
