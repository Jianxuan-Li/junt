import React from 'react'
import moment from 'moment'
import { Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import { FormControl } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
// import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { appendAppliedJob } from '@/libs/sync'

type Props = {}

export default function AppliedForm({}: Props) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    appendAppliedJob({
      company: data.get('company') as string,
      title: data.get('position') as string,
      datetime: data.get('datetime') as string,
    })

    event.currentTarget.reset()
  }

  return (
    <Box autoComplete="off" component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
      <h1>Manually save to applied</h1>
      <FormControl fullWidth={true}>
        <TextField
          label="Company Name"
          name="company"
          defaultValue=""
          size="small"
          fullWidth={true}
          variant="standard"
        />
        <TextField label="Position" name="position" defaultValue="" size="small" fullWidth={true} variant="standard" />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker
              label="Datetime"
              slotProps={{ textField: { size: 'small', name: 'datetime' } }}
              defaultValue={moment()}
            />
          </DemoContainer>
        </LocalizationProvider>
        <LoadingButton
          loading={false}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
          type="submit"
        >
          Save
        </LoadingButton>
      </FormControl>
    </Box>
  )
}
