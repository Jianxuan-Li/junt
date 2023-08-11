import React, { useEffect } from "react";
import { Button, TextField } from "@mui/material";
import { sheetsApiGet } from "@/libs/sheetsApi";
import { getFromSyncStorage } from "@/libs/storage";

type Props = {};

export default function index({}: Props) {
  const [sheet, setSheet] = React.useState<any>(null);
  const [sheetId, setSheetId] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const handleConnect = async () => {
    const res = await sheetsApiGet(`/${sheetId}`);
    setSheet(res);

    chrome.storage.sync.set({ sheetId });
    chrome.storage.sync.set({ sheet: res });
  };

  const handleSheetIdChange = (e: any) => {
    setSheetId(e.target.value);
  };

  useEffect(() => {
    // get sheet id and sheet from storage
    const getData = async () => {
      const [storedSheetId, storedSheet] = await Promise.all([
        getFromSyncStorage("sheetId"),
        getFromSyncStorage("sheet")
      ]);

      setSheetId(storedSheetId);
      setSheet(storedSheet);
      setLoading(false);
    };
    getData();
  }, []);

  return (
    <div>
      <Button
        variant="outlined"
        onClick={() => {
          chrome.storage.local.clear();
          chrome.storage.sync.clear();
        }}
      >
        Clear data
      </Button>
      {!loading && (
        <div>
          <div>
            <TextField
              id="outlined-basic"
              label="Sheet ID"
              variant="outlined"
              fullWidth={true}
              defaultValue={sheetId}
              onChange={handleSheetIdChange}
            />
          </div>
          <div>
            <Button variant="outlined" onClick={handleConnect}>
              Connect to google sheet
            </Button>
          </div>
        </div>
      )}
      <div>
        <pre>{JSON.stringify(sheet, null, 2)}</pre>
      </div>
    </div>
  );
}
