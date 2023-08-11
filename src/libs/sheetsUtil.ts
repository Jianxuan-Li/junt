import { sheetsApiGet } from "./sheetsApi";

export const getSheetData = async (sheetId: string, range: string) => {
  const response = await sheetsApiGet(`${sheetId}/values/${range}`);
  return response.values;
};
