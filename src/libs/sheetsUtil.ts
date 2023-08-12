import { sheetsApiGet, sheetsApiPost } from "./sheetsApi";

export const getSheetData = async (sheetId: string, range: string) => {
  const response = await sheetsApiGet(`${sheetId}/values/${range}`);
  return response.values;
};

/*
POST https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID/values/Sheet1!A1:E1:append?valueInputOption=VALUE_INPUT_OPTION

{
  "range": "Sheet1!A1:E1",
  "majorDimension": "ROWS",
  "values": [
    ["Door", "$15", "2", "3/15/2016"],
    ["Engine", "$100", "1", "3/20/2016"],
  ],
}
*/
export const appendSheetData = async (
  sheetId: string,
  range: string,
  values: any[][]
) => {
  const response = await sheetsApiPost(`${sheetId}/values/${range}:append`, {
    range,
    majorDimension: "ROWS",
    values
  });
  return response;
};
