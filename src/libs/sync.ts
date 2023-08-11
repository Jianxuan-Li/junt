// Sync data from google sheet to local
import moment from "moment";
import { getSheetData } from "@/libs/sheetsUtil";
import { saveAppliedList } from "./storage";
import {
  saveToSyncStorage,
  getFromSyncStorage,
  appliedJob,
  STORAGE_KEY
} from "./storage";

export const fromSheetToLocal = async (sheetData: any) => {
  const appliedList = sheetData.map((row: any[], index: number) => {
    return {
      id: index,
      title: row[2],
      company: row[1],
      datetime: row[0],
      url: row[3]
    };
  });
  await saveAppliedList(appliedList);
  return appliedList;
};

export const renewLastSyncDatetime = async () => {
  await saveToSyncStorage("lastSyncDatetime", moment().format());
};

export const getLastSyncDatetime = async (): Promise<string> => {
  return await getFromSyncStorage("lastSyncDatetime");
};

export const shouldSync = async (): Promise<boolean> => {
  const lastSyncDatetime = await getLastSyncDatetime();
  if (!lastSyncDatetime) return true;
  const lastSync = moment(lastSyncDatetime);
  const now = moment();
  const diff = now.diff(lastSync, "hours");
  return diff > 1;
};

export const fetchAppliedList = async (): Promise<appliedJob[]> => {
  if (await shouldSync()) {
    const sheetId = await getFromSyncStorage("sheetId");
    const appliedList = await getSheetData(sheetId, "A:D");
    renewLastSyncDatetime();
    return await fromSheetToLocal(appliedList);
  } else {
    return await getFromSyncStorage(STORAGE_KEY);
  }
};
