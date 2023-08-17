import { sheetsApiGet, sheetsApiPost } from './sheetsApi'

export const DEFUALT_RANGE = 'A:D'

export const getSheetData = async (sheetId: string, range: string) => {
  const response = await sheetsApiGet(`${sheetId}/values/${range}`)
  return response.values
}

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
export const appendSheetData = async (sheetId: string, range: string, values: any[][]) => {
  const response = await sheetsApiPost(
    `${sheetId}/values/${range}:append`,
    {
      range,
      majorDimension: 'ROWS',
      values,
    },
    {
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
    },
  )
  return response
}

/*
https://developers.google.com/sheets/api/samples/rowcolumn#delete-rows-columns

POST https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID:batchUpdate

{
  "requests": [
    {
      "deleteDimension": {
        "range": {
          "sheetId": SHEET_ID,
          "dimension": "ROWS",
          "startIndex": 0,
          "endIndex": 3
        }
      }
    },
  ],
}
*/
export const deleteSheetRows = async (sheetId: string, index: number) => {
  const response = await sheetsApiPost(
    `${sheetId}:batchUpdate`,
    {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: index,
              endIndex: index,
            },
          },
        },
      ],
    },
    {},
  )
  return response
}

/*
sort by column 0 (datetime) ASCENDING, column 1 (company) DESCENDING
POST https://sheets.googleapis.com/v4/spreadsheets/SPREADSHEET_ID:batchUpdate
{
  "requests": [
    {
      "sortRange": {
        "range": {
          "sheetId": SHEET_ID,
          "startRowIndex": 0,
          "endRowIndex": 10,
          "startColumnIndex": 0,
          "endColumnIndex": 4
        },
        "sortSpecs": [
          {
            "dimensionIndex": 0,
            "sortOrder": "ASCENDING"
          },
          {
            "dimensionIndex": 1,
            "sortOrder": "DESCENDING"
          },
        ]
      }
    }
  ]
}
*/

export const sortSheetRows = async (sheetId: string) => {
  const response = await sheetsApiPost(
    `${sheetId}:batchUpdate`,
    {
      requests: [
        {
          sortRange: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
            },
            sortSpecs: [
              {
                dimensionIndex: 0,
                sortOrder: 'DESCENDING',
              },
              {
                dimensionIndex: 1,
                sortOrder: 'ASCENDING',
              },
            ],
          },
        },
      ],
    },
    {},
  )
  return response
}
