export type appliedJob = {
  id: number;
  title: string;
  company: string;
  datetime: string;
};

export const fetchApplied = () => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(["applied"], (result) => {
        return resolve(result.applied);
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const saveApplied = (applied: appliedJob): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ applied }, () => {
        return resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
};
