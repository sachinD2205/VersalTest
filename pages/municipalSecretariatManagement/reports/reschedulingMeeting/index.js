import React, { useState } from 'react'
import router from 'next/router'
import Head from 'next/head'
import styles from './view.module.css'

import { FormControl, FormHelperText, Paper, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/node/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/node/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import moment from 'moment'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@mui/material/Button'
import { Search, Visibility } from '@mui/icons-material'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'

const Index = () => {
  const meetingAgendaSchema = yup.object().shape({
    fromDate: yup.string().required('Please select Reservation'),
    toDate: yup.string().required('Please select Reservation'),
  })

  const {
    handleSubmit,
    // register,
    // setValue,
    // @ts-ignore
    // methods,
    // watch,
    // reset,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(meetingAgendaSchema),
  })

  const [table, setTable] = useState([
    {
      id: 1,
      srNo: 1,
      committeeName: 'Committee 1',
      subject: 'Construction',
      description: 'Construction of temple',
    },
  ])

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 80,
    },
    {
      headerClassName: 'cellColor',

      field: 'committeeName',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='committeeName' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'subject',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='subject' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'description',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='description' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                console.log(params.row)
                router.push({
                  pathname:
                    '/municipalSecretariatManagement/reports/reschedulingMeeting/print',
                  query: params.row,
                })
              }}
            >
              <Visibility sx={{ color: '#1976d2' }} />
            </IconButton>
          </>
        )
      },
    },
  ]

  const submit = (data) => {
    console.log('Data: ', data)
  }

  return (
    <>
      <Head>
        <title>Reports - Meeting Agenda</title>
      </Head>
      <Paper className={styles.main}>
        <form onSubmit={handleSubmit(submit)}>
          <div className={styles.row}>
            <FormControl error={!!error.fromDate}>
              <Controller
                control={control}
                name='fromDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={
                        <span>
                          <FormattedLabel id='fromDate' required />
                        </span>
                      }
                      disabled={router.query.fromDate ? true : false}
                      value={
                        router.query.fromDate
                          ? router.query.fromDate
                          : field.value
                      }
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.fromDate ? error.fromDate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.toDate}>
              <Controller
                control={control}
                name='toDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={
                        <span>
                          <FormattedLabel id='toDate' required />
                        </span>
                      }
                      disabled={router.query.toDate ? true : false}
                      value={
                        router.query.toDate ? router.query.toDate : field.value
                      }
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.toDate ? error.toDate.message : null}
              </FormHelperText>
            </FormControl>
            <Button variant='contained' type='submit' endIcon={<Search />}>
              <FormattedLabel id='search' />
            </Button>
          </div>
          <div className={styles.table} style={{ marginTop: '4%' }}>
            <DataGrid
              sx={{
                marginTop: '5vh',
                marginBottom: '3vh',
                '& .cellColor': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                },
              }}
              autoHeight
              rows={table}
              //@ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
        </form>
      </Paper>
    </>
  )
}

export default Index
