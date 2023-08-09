export type appliedJob = {
  id: number;
  title: string;
  company: string;
  datetime: string;
};

const storageKey = "applied";

export const fetchApplied = (): Promise<appliedJob[]> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get([storageKey], (result) => {
        if (!result[storageKey]) return resolve([]);
        return resolve(result[storageKey]);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const saveApplied = (applied: appliedJob): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      fetchApplied().then((appliedList: appliedJob[]) => {
        if (appliedList) {
          appliedList.push(applied);
          chrome.storage.local.set({ [storageKey]: appliedList }, () => {
            return resolve();
          });
        } else {
          chrome.storage.local.set({ [storageKey]: [applied] }, () => {
            return resolve();
          });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};
