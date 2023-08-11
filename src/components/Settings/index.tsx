import React from "react";
import Button from "@mui/material/Button";

type Props = {};

export default function index({}: Props) {
  const handleConnect = () => {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      if (chrome.runtime.lastError) {
        alert(chrome.runtime.lastError.message);
        return;
      }
      console.log(token);
      // Use the token.
    });
  };

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
      <Button variant="outlined" onClick={handleConnect}>
        Connect to google sheet
      </Button>
    </div>
  );
}
