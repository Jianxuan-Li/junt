// Sync data from google sheet to local
import { appliedJob } from '@/types/appliedJob'
import moment from 'moment'
import { getSheetData, DEFUALT_RANGE, appendSheetData, sortSheetRows } from '@/libs/sheetsUtil'
import { saveApplied, saveAppliedList, getAppliedList } from './storage'
import { getFromSyncStorage, getFromLocalStorage, saveToLocalStorage } from './storage'
import trie, { initTrie } from './searchUtil'
import {
  STORAGE_KEY_APPLIED_LIST_LENGTH,
  STORAGE_KEY_APPLIED_LAST_SYNC_DATETIME,
  SYNC_STORAGE_KEY_SHEET_ID,
} from '@/constants/storage'

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
  await saveToLocalStorage(STORAGE_KEY_APPLIED_LAST_SYNC_DATETIME, moment().format())
}

export const getLastSyncDatetime = async (): Promise<string> => {
  return await getFromLocalStorage(STORAGE_KEY_APPLIED_LAST_SYNC_DATETIME)
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
  const sheetId = await getFromSyncStorage(SYNC_STORAGE_KEY_SHEET_ID)
  if (!sheetId) return

  const appliedList = await getSheetData(sheetId, DEFUALT_RANGE)
  renewLastSyncDatetime()
  const transedList = await fromSheetToLocal(appliedList)
  await saveToLocalStorage(STORAGE_KEY_APPLIED_LIST_LENGTH, transedList.length)
  initTrie(transedList)
  return transedList
}

export const fetchAppliedList = async (): Promise<appliedJob[]> => {
  /*
  fetch applied list from local storage (cache) or google sheet
  */
  const sheetId = await getFromSyncStorage(SYNC_STORAGE_KEY_SHEET_ID)
  if (!sheetId) return []

  let transedList: appliedJob[] = []
  if (await shouldSync()) {
    const appliedList = await getSheetData(sheetId, DEFUALT_RANGE)
    renewLastSyncDatetime()
    transedList = await fromSheetToLocal(appliedList)
  } else {
    transedList = await getAppliedList()
  }
  await saveToLocalStorage(STORAGE_KEY_APPLIED_LIST_LENGTH, transedList.length)
  initTrie(transedList)
  return transedList
}

export const appendAppliedJob = async (job: appliedJob) => {
  const sheetId = await getFromSyncStorage(SYNC_STORAGE_KEY_SHEET_ID)
  if (!sheetId) return

  const currentLength = await getFromLocalStorage(STORAGE_KEY_APPLIED_LIST_LENGTH)
  job.id = currentLength
  saveApplied(job)
  trie.insert(job.company, job.id)

  const dt = moment(job.datetime).format('YYYY-MM-DD HH:mm:ss')
  const values = [[dt, job.company, job.title, job.url]]
  await appendSheetData(sheetId, DEFUALT_RANGE, values)
  await sortSheetRows(sheetId)
}
