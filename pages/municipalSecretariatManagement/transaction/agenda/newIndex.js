//localhost:8099/ms/api/mstDefineCorporator/getAll

//listOfConcernCommitteeMembers map to corporatorId

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import { useSelector } from 'react-redux'
import URLs from '../../../../URLS/urls'
import styles from './agenda.module.css'

import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import {
  Paper,
  Slide,
  TextField,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import FormControl from '@mui/material/FormControl'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import * as yup from 'yup'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import moment from 'moment'
import sweetAlert from 'sweetalert'
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const [committeeName, setCommitteeName] = useState([
    {
      id: 1,
      committeeNameEn: '',
      committeeNameMr: '',
    },
  ])
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  //Docket Details
  let docketSchema = yup.object().shape({
    // subjectDate: yup.string().required('Please select Reservation'),
    // subject: yup.string().required('Please select Reservation'),
    // officeName: yup.number().required('Please select Reservation'),
    // departmentId: yup.number().required('Please select Reservation'),
    // CommitteeId: yup.number().required('Please select Reservation'),
    // financialYear: yup.number().required('Please select Reservation'),
    // docketType: yup.number().required('Please select Reservation'),
    // subjectSummary: yup.string().required('Please select Reservation'),
    // amount: yup.number().required('Please select Reservation'),
  })

  const {
    register,
    // handleSubmit: handleSubmit,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(docketSchema),
  })

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  useEffect(() => {
    //Get Committee
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
      .then((res) => {
        console.log('Committee: ', res.data.committees)
        setCommitteeName(
          res.data.committees.map((j) => ({
            id: j.id,
            committeeNameEn: j.CommitteeName,
            committeeNameMr: j.CommitteeNameMr,
          }))
        )
      })
      .catch((error) => {
        // console.log('error: ', error)
        // sweetAlert({
        //   title: 'ERROR!',
        //   text: `${error}`,
        //   icon: 'error',
        //   buttons: {
        //     confirm: {
        //       text: 'OK',
        //       visible: true,
        //       closeModal: true,
        //     },
        //   },
        //   dangerMode: true,
        // })
        callCatchMethod(error, language);
      })
  }, [])

  return (
    <>
      <Head>
        <title>Preparation of meeting Agenda</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>Preparation of meeting agenda</div>
        <form>
          <div
            className={styles.row}
            style={{
              justifyContent: 'space-evenly',
              marginTop: 50,
            }}
          >
            <FormControl
              variant='standard'
              error={!!error.CommitteeId}
              sx={{ width: '40%' }}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='committeeName' required />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='CommitteeId'
                  >
                    {committeeName &&
                      committeeName.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == 'en'
                            ? //@ts-ignore
                            value.committeeNameEn
                            : // @ts-ignore
                            value?.committeeNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='CommitteeId'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.CommitteeId ? error.CommitteeId.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.agendaDate}>
              <Controller
                control={control}
                name='agendaDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={
                        <span>
                          <FormattedLabel id='agendaDate' />
                        </span>
                      }
                      disabled={router.query.agendaDate ? true : false}
                      value={
                        router.query.agendaDate
                          ? router.query.agendaDate
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
                {error?.agendaDate ? error.agendaDate.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div className={styles.row}>
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='karyakramPatrikaNo' required />}
              variant='standard'
              {...register('agendaNo')}
              error={!!error.agendaNo}
              helperText={error?.agendaNo ? error.agendaNo.message : null}
            />
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='agendaNo' required />}
              variant='standard'
              {...register('agendaNo')}
              error={!!error.agendaNo}
              helperText={error?.agendaNo ? error.agendaNo.message : null}
            />
            <TextField
              sx={{ width: '230px' }}
              label={<FormattedLabel id='agendaNo' required />}
              variant='standard'
              {...register('agendaNo')}
              error={!!error.agendaNo}
              helperText={error?.agendaNo ? error.agendaNo.message : null}
            />
          </div>
          <div className={styles.row}>
            <TextareaAutosize
              color='neutral'
              disabled={false}
              minRows={1}
              maxRows={3}
              placeholder='Subject'
              className={styles.bigText}
              {...register('subject')}
            />
          </div>
        </form>
      </Paper>
    </>
  )
}

export default Index
