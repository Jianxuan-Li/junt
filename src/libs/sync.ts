// Sync data from google sheet to local
import { appliedJob } from '@/types/appliedJob'
import moment from 'moment'
import { getSheetData, DEFUALT_RANGE, appendSheetData, sortSheetRows } from '@/libs/sheetsUtil'
import { getFromSyncStorage, getFromLocalStorage, saveToLocalStorage } from './storage'
import { initTrie } from './searchUtil'
import {
  STORAGE_KEY_APPLIED_LIST,
  STORAGE_KEY_APPLIED_LIST_LENGTH,
  STORAGE_KEY_APPLIED_LAST_SYNC_DATETIME,
  SYNC_STORAGE_KEY_SHEET_ID,
} from '@/constants/storage'

export const normalize = async (sheetData: any) => {
  const appliedList = sheetData.map((row: any[], index: number) => {
    return {
      id: index,
      title: row[2],
      company: row[1],
      datetime: row[0],
      url: row[3],
    }
  })
  return appliedList
}

export const shouldSync = async (): Promise<boolean> => {
  const lastSyncDatetime = await getFromLocalStorage(STORAGE_KEY_APPLIED_LAST_SYNC_DATETIME)
  if (!lastSyncDatetime) return true
  const lastSync = moment(lastSyncDatetime)
  const now = moment()
  const diff = now.diff(lastSync, 'minutes')
  return diff > 5
}

export const fetchAppliedList = async (force: boolean = false, sheetId: string = ''): Promise<appliedJob[]> => {
  /*
  fetch applied list from local storage (cache) or google sheet
  */
  if (!sheetId) sheetId = await getFromSyncStorage(SYNC_STORAGE_KEY_SHEET_ID)
  if (!sheetId) return []

  let transedList: appliedJob[] = []
  if (force || (await shouldSync())) {
    const appliedList = await getSheetData(sheetId, DEFUALT_RANGE)
    transedList = await normalize(appliedList)

    // save last sync datetime
    await saveToLocalStorage(STORAGE_KEY_APPLIED_LAST_SYNC_DATETIME, moment().format())
    await saveToLocalStorage(STORAGE_KEY_APPLIED_LIST, transedList)
  } else {
    transedList = await getFromLocalStorage(STORAGE_KEY_APPLIED_LIST)
  }
  await saveToLocalStorage(STORAGE_KEY_APPLIED_LIST_LENGTH, transedList.length)
  initTrie(transedList)
  return transedList
}

export const appendAppliedJob = async (job: appliedJob): Promise<appliedJob[]> => {
  const sheetId = await getFromSyncStorage(SYNC_STORAGE_KEY_SHEET_ID)
  if (!sheetId) return

  const dt = moment(job.datetime).format('YYYY-MM-DD HH:mm:ss')
  const values = [[dt, job.company, job.title, job.url]]

  await appendSheetData(sheetId, DEFUALT_RANGE, values)
  await sortSheetRows(sheetId)
  return await fetchAppliedList(true, sheetId)
}
