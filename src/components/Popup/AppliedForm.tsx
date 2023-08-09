import React from "react";
import moment from "moment";
import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from '@mui/icons-material/Save';
// import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

type Props = {};

export default function AppliedForm({}: Props) {
  return (
    <Box autoComplete="off" component="form" sx={{ width: "100%" }}>
      <FormControl fullWidth={true}>
        <TextField
          label="Company Name"
          defaultValue=""
          size="small"
          fullWidth={true}
          variant="standard"
        />
        <TextField
          label="Position"
          defaultValue=""
          size="small"
          fullWidth={true}
          variant="standard"
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DemoContainer components={["DateTimePicker"]}>
            <DateTimePicker
              label="Datetime"
              slotProps={{ textField: { size: "small" } }}
              defaultValue={moment()}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LoadingButton
          loading={false}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
        >
          Save
        </LoadingButton>
      </FormControl>
    </Box>
  );
}
