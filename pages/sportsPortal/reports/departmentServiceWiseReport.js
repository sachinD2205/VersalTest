import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import styles from './reports.module.css'

import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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

const Index = () => {
  const language = useLanguage()

  const userToken = useGetToken()

  const [serviceNames, setServiceNames] = useState([])
  const [venues, setVenues] = useState([])
  const [facilityNames, setFacilityNames] = useState([])
  const [facilityTypes, setFacilityTypes] = useState([])

  const [table, setTable] = useState([])

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
        serviceId: yup
          .number()
          .required(
            language == 'en' ? 'Please select a service' : 'कृपया सेवा निवडा'
          )
          .typeError(
            language == 'en' ? 'Please select a service' : 'कृपया सेवा निवडा'
          ),
      })
    ),
  })

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle:
      serviceNames?.find((obj) => watch('serviceId') == obj.id)?.serviceNameEn +
      ' Report',
  })

  useEffect(() => {
    setLoadingState(true)

    //Get Service Names
    axios
      .get(`${urls.CFCURL}/master/service/getAllServiceByApplication`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params: { applicationId: 6 },
      })
      .then((res) => {
        setServiceNames(
          res.data.service
            ?.filter((j) => j.id != 144) //filtering out deposit refund process service
            ?.map((obj) => ({
              id: obj?.id,
              serviceNameEn: obj?.serviceName,
              serviceNameMr: obj?.serviceNameMr,
            }))
        )
        setLoadingState(false)
      })
      .catch((error) => {
        setLoadingState(false)
        catchExceptionHandlingMethod(error, language)
      })

    //Get Venues
    axios
      .get(`${urls.SPURL}/venueMasterSection/getAllYN`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setVenues(
          res.data?.venueSection?.map((obj) => ({
            id: obj?.id,
            venueEn: obj?.venue,
            venueMr: obj?.venueMr,
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
      width: 110,
    },
    {
      field: language == 'en' ? 'fullNameEn' : 'fullNameMr',
      formattedLabel: 'ApplicatName',
      width: 110,
    },
    {
      field: language == 'en' ? 'venueNameEn' : 'venueNameMr',
      formattedLabel: 'venue',
      width: 110,
    },
    {
      field: language == 'en' ? 'facilityNameEn' : 'facilityNameMr',
      formattedLabel: 'facilityName',
      width: 110,
    },
    {
      field: language == 'en' ? 'facilityTypeEn' : 'facilityTypeMr',
      formattedLabel: 'facilityType',
      width: 110,
    },
    {
      field: 'applicationStatus',
      formattedLabel: 'applicationStatus',
      width: 110,
    },
  ]

  const finalSubmit = (data) => {
    setLoadingState(true)

    axios
      .get(`${urls.SPURL}/report/getDataByServiceId`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params: { serviceId: data?.serviceId },
      })
      .then((res) => {
        const finalData = [
          ...res.data?.swimmingPool,
          ...res.data?.sportsBooking,
          ...res.data?.gymBooking,
          ...res.data?.trnMonthlySwimmingBooking,
          // ...res.data?.depositRefundProcess,
          ...res.data?.groundBooking,
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
            venueNameEn: venues?.find((obj) => obj?.id == j?.venue)?.venueEn,
            venueNameMr: venues?.find((obj) => obj?.id == j?.venue)?.venueMr,

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
        <title>Department Service Wise Report</title>
      </Head>
      {loadingState && <Loader />}

      <Paper className={styles.main}>
        <Title
          titleLabel={<FormattedLabel id='departmentServiceWiseReport' />}
        />

        <form
          className={styles.rowWrapper}
          style={{ justifyContent: 'center' }}
          onSubmit={handleSubmit(finalSubmit)}
        >
          <FormControl variant='standard' error={!!error.serviceId}>
            <InputLabel id='demo-simple-select-standard-label'>
              <FormattedLabel id='serviceName' required />
            </InputLabel>
            {/* @ts-ignore */}
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: 250 }}
                  labelId='demo-simple-select-standard-label'
                  id='demo-simple-select-standard'
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label='serviceId'
                >
                  {serviceNames?.map((j) => (
                    <MenuItem key={j?.id} value={j?.id}>
                      {language === 'en' ? j?.serviceNameEn : j?.serviceNameMr}
                    </MenuItem>
                  ))}
                </Select>
              )}
              name='serviceId'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {error?.serviceId ? error.serviceId.message : null}
            </FormHelperText>
          </FormControl>
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
