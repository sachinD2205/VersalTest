import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import styles from './reports.module.css'

import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material'
import Title from '../../../containers/VMS_ReusableComponents/Title'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { Print, Search } from '@mui/icons-material'
import { Controller, useForm } from 'react-hook-form'
import {
  useGetToken,
  useLanguage,
} from '../../../containers/reuseableComponents/CustomHooks'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import urls from '../../../URLS/urls'
import Loader from '../../../containers/Layout/components/Loader'
import { catchExceptionHandlingMethod } from '../../../util/util'
import { useReactToPrint } from 'react-to-print'
import ReportLayout from '../../../containers/reuseableComponents/ReportLayout'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import moment from 'moment'

const Index = () => {
  const language = useLanguage()

  const userToken = useGetToken()

  const [venues, setVenues] = useState([])
  const [durationTypes, setDurationTypes] = useState([])
  const [facilityNames, setFacilityNames] = useState([])
  const [facilityTypes, setFacilityTypes] = useState([])
  const [schemaState, setSchemaState] = useState({})

  const [table, setTable] = useState([])

  const [customSelection, setCustomSelection] = useState(false)
  const [loadingState, setLoadingState] = useState(false)

  const componentRef = useRef(null)

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(
      yup.object().shape({
        facilityName: yup
          .number()
          .required(
            language == 'en'
              ? 'Please select a facility'
              : 'कृपया सुविधेचे उपप्रकार  निवडा'
          )
          .typeError(
            language == 'en'
              ? 'Please select a facility'
              : 'कृपया सुविधेचे उपप्रकार  निवडा'
          ),
        durationType: yup
          .number()
          .required(
            language == 'en'
              ? 'Please select a duration type'
              : 'कृपया कालावधी प्रकार निवडा'
          )
          .typeError(
            language == 'en'
              ? 'Please select a duration type'
              : 'कृपया कालावधी प्रकार निवडा'
          ),
        ...schemaState,
      })
    ),
  })

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: 'Facility Venue Wise Register Report Report',
  })

  useEffect(() => {
    setSchemaState(
      customSelection
        ? {
            fromDate: yup
              .date()
              .required(
                language == 'en'
                  ? 'Please select a From Date'
                  : 'कृपया केव्हापासूनची तारीख निवडा'
              )
              .typeError(
                language == 'en'
                  ? 'Please select a From Date'
                  : 'कृपया केव्हापासूनची तारीख निवडा'
              ),
            toDate: yup
              .date()
              .required(
                language == 'en'
                  ? 'Please select a To Date'
                  : 'कृपया केव्हापर्यंत तारीख निवडा'
              )
              .typeError(
                language == 'en'
                  ? 'Please select a To Date'
                  : 'कृपया केव्हापर्यंत तारीख निवडा'
              ),
          }
        : {}
    )
  }, [schemaState])

  useEffect(() => {
    setLoadingState(true)

    //Get Venues
    // axios
    //   .get(`${urls.SPURL}/venueMasterSection/getAllYN`, {
    //     headers: {
    //       Authorization: `Bearer ${userToken}`,
    //     },
    //   })
    //   .then((res) => {
    //     setVenues(
    //       res.data?.venueSection?.map((obj) => ({
    //         id: obj?.id,
    //         venueEn: obj?.venue,
    //         venueMr: obj?.venueMr,
    //       }))
    //     )
    //     setLoadingState(false)
    //   })
    //   .catch((error) => {
    //     setLoadingState(false)
    //     catchExceptionHandlingMethod(error, language)
    //   })

    //Get Duration Types
    axios
      .get(`${urls.SPURL}/master/durationType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setDurationTypes(
          r.data.durationType?.map((obj) => ({
            id: obj.id,
            typeNameEn: obj.typeName,
            typeNameMr: obj.typeNameMr,
          }))
        )
        setLoadingState(false)
      })
      .catch((error) => {
        setLoadingState(false)
        catchExceptionHandlingMethod(error, language)
      })

    //Get Facility Name
    axios
      .get(`${urls.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        {
          setFacilityTypes(
            r.data.facilityType.map((row) => ({
              id: row.id,
              facilityTypeEn: row.facilityType,
              facilityTypeMr: row.facilityTypeMr,
            }))
          )
          setLoadingState(false)
        }
      })
      .catch((error) => {
        setLoadingState(false)
        callCatchMethod(error, language)
      })
    //Get Facility Type
    axios
      .get(`${urls.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        {
          setFacilityNames(
            r.data.facilityName.map((row) => ({
              id: row.id,
              facilityNameEn: row.facilityName,
              facilityNameMr: row.facilityNameMr,
            }))
          )
          setLoadingState(false)
        }
      })
      .catch((error) => {
        setLoadingState(false)
        callCatchMethod(error, language)
      })
  }, [])

  const columns = [
    {
      field: 'srNo',
      formattedLabel: 'srNo',
      width: 60,
    },
    {
      field: 'applicationNumber',
      formattedLabel: 'applicationNumber',
      width: 135,
    },
    {
      field: language == 'en' ? 'fullNameEn' : 'fullNameMr',
      formattedLabel: 'ApplicatName',
      width: 140,
    },

    {
      field: language == 'en' ? 'facilityNameEn' : 'facilityNameMr',
      formattedLabel: 'facilityName',
      width: 115,
    },
    {
      field: language == 'en' ? 'facilityTypeEn' : 'facilityTypeMr',
      formattedLabel: 'facilityType',
      width: 115,
    },
    {
      field: 'applicationStatus',
      formattedLabel: 'applicationStatus',
      width: 115,
    },
  ]

  const finalSubmit = (data) => {
    setLoadingState(true)

    axios
      .get(
        `${urls.SPURL}/report/getDataByFacilityNameAndDurationTypeAndFromAndToDate`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
          params: customSelection
            ? {
                ...data,
                fromDate: moment(data?.fromDate).format('YYYY-MM-DD'),
                toDate: moment(data?.toDate).format('YYYY-MM-DD'),
              }
            : {
                facilityName: data?.facilityName,
                durationType: data?.durationType,
              },
        }
      )
      .then((res) => {
        const finalData = [
          ...res.data?.groundBooking,
          ...res.data?.gymBooking,
          ...res.data?.sportsBooking,
          // ...res.data?.swimmingPool,
          ...res.data?.trnMonthlySwimmingBooking,
        ]

        setTable(
          finalData?.map((j, i) => ({
            id: j?.id,
            srNo: i + 1,
            applicationNumber: j?.applicationNumber,
            applicationStatus: j?.applicationStatus,
            fullNameEn: j?.firstName + ' ' + j?.middleName + ' ' + j?.lastName,
            fullNameMr:
              j?.firstNameMr + ' ' + j?.middleNameMr + ' ' + j?.lastNameMr,
            facilityNameEn: facilityNames?.find(
              (obj) => obj?.id == j?.facilityName
            )?.facilityNameEn,
            facilityNameMr: facilityNames?.find(
              (obj) => obj?.id == j?.facilityName
            )?.facilityNameMr,
            facilityTypeEn: facilityTypes?.find(
              (obj) => obj?.id == j?.facilityType
            )?.facilityTypeEn,
            facilityTypeMr: facilityTypes?.find(
              (obj) => obj?.id == j?.facilityType
            )?.facilityTypeMr,
          }))
        )
        setLoadingState(false)
      })
      .catch((error) => {
        setLoadingState(false)

        catchExceptionHandlingMethod(error, language)
      })
  }
  return (
    <>
      <Head>
        <title>Facility Venue Wise Register Report</title>
      </Head>
      {loadingState && <Loader />}

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='facilityWiseRegister' />} />

        <form onSubmit={handleSubmit(finalSubmit)}>
          <div
            className={styles.rowWrapper}
            style={{ justifyContent: 'center' }}
          >
            <FormControl>
              <FormControlLabel
                label={<FormattedLabel id='customSelection' bold />}
                control={
                  <Checkbox
                    onChange={(e) => setCustomSelection(e.target.checked)}
                    checked={customSelection}
                  />
                }
              />
            </FormControl>
          </div>
          <div
            className={styles.rowWrapper}
            style={{ justifyContent: 'center' }}
          >
            <FormControl variant='standard' error={!!error.facilityName}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='facilityName' required />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 300 }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='facilityName'
                  >
                    {facilityNames?.map((j) => (
                      <MenuItem key={j?.id} value={j?.id}>
                        {language === 'en'
                          ? j?.facilityNameEn
                          : j?.facilityNameMr}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name='facilityName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.facilityName ? error.facilityName.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.durationType}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='durationType' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 200 }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='durationType'
                  >
                    {durationTypes?.map((j) => (
                      <MenuItem key={j?.id} value={j?.id}>
                        {language === 'en' ? j?.typeNameEn : j?.typeNameMr}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name='durationType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.durationType ? error.durationType.message : null}
              </FormHelperText>
            </FormControl>
            {customSelection && (
              <>
                <FormControl error={!!error.fromDate}>
                  {/* @ts-ignore */}
                  <Controller
                    control={control}
                    name='fromDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disableFuture
                          //   maxDate={watch('toDate')}
                          inputFormat='dd-MM-yyyy'
                          label={<FormattedLabel id='fromDate' />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: 175 }}
                              {...params}
                              size='small'
                              fullWidth
                              variant='standard'
                              error={!!error.fromDate}
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
                  {/* @ts-ignore */}
                  <Controller
                    control={control}
                    name='toDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disableFuture
                          //   maxDate={watch('toDate')}
                          inputFormat='dd-MM-yyyy'
                          label={<FormattedLabel id='toDate' />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: 175 }}
                              {...params}
                              size='small'
                              fullWidth
                              variant='standard'
                              error={!!error.toDate}
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
              </>
            )}
            <div className={styles.buttonGrp}>
              <Button variant='contained' endIcon={<Search />} type='submit'>
                <FormattedLabel id='search' />
              </Button>

              <Button
                disabled={table.length == 0}
                variant='outlined'
                onClick={handleToPrint}
                endIcon={<Print />}
              >
                <FormattedLabel id='print' />
              </Button>
            </div>
          </div>
        </form>

        {table.length >= 0 && (
          <div className={styles.centerDiv}>
            <ReportLayout
              centerHeader
              style={{
                marginTop: '5vh',
                boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.75)',
              }}
              componentRef={componentRef}
              rows={table}
              columns={columns}
            />
          </div>
        )}
      </Paper>
    </>
  )
}

export default Index
