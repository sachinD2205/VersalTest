import React, { useEffect, useState } from 'react'
import router from 'next/router'
import Head from 'next/head'
import styles from './vetMasters.module.css'
import Breadcrumb from '../../../components/common/BreadcrumbComponent'

import URLs from '../../../URLS/urls'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import {
  Add,
  Clear,
  Delete,
  Edit,
  ExitToApp,
  Save,
  ToggleOff,
  ToggleOn,
} from '@mui/icons-material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { useSelector } from 'react-redux'
import moment from 'moment'
import { TimePicker } from '@mui/x-date-pickers'
import Loader from '../../../containers/Layout/components/Loader'

import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [table, setTable] = useState([])
  const [collapse, setCollapse] = useState(false)
  const [runAgain, setRunAgain] = useState(false)
  const [zoneDropDown, setZoneDropDown] = useState([])
  const [wardDropDown, setWardDropDown] = useState([])
  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })
  const [loadingState, setLoadingState] = useState(false)
  const [loader, setLoader] = useState(false)

  let opdSchema = yup.object().shape({
    fromDate: yup
      .date()
      .typeError(
        language === 'en'
          ? `Please select a from Date`
          : `कृपया "प्रारंभ तारीख" निवडा`
      )
      .required(
        language === 'en'
          ? `Please select a from Date`
          : `कृपया "प्रारंभ तारीख" निवडा`
      ),
    toDate: yup
      .date()
      .typeError(
        language === 'en'
          ? `Please select a To Date`
          : `कृपया "समाप्ती तारीख" निवडा`
      )
      .required(
        language === 'en'
          ? `Please select a To Date`
          : `कृपया "समाप्ती तारीख" निवडा`
      ),
    zoneKey: yup
      .number()
      .required(
        language === 'en' ? 'Please select a zone' : 'कृपया एक झोन निवडा'
      )
      .typeError(
        language === 'en' ? 'Please select a zone' : 'कृपया एक झोन निवडा'
      ),
    wardKey: yup
      .number()
      .required(
        language === 'en' ? 'Please select a ward' : 'कृपया प्रभाग निवडा'
      )
      .typeError(
        language === 'en' ? 'Please select a ward' : 'कृपया प्रभाग निवडा'
      ),
    officeType: yup
      .string()
      .required(
        language === 'en'
          ? 'Please select an office type'
          : 'कृपया कार्यालय प्रकार निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select an office type'
          : 'कृपया कार्यालय प्रकार निवडा'
      ),
    opdPrefix: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter a prefix'
          : 'कृपया उपसर्ग प्रविष्ट करा'
      )
      .typeError(
        language === 'en'
          ? 'Please enter a prefix'
          : 'कृपया उपसर्ग प्रविष्ट करा'
      ),
    opdNo: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter the IPD no.'
          : 'कृपया IPD क्रमांक प्रविष्ट करा'
      )
      .typeError(
        language === 'en'
          ? 'Please enter the IPD no.'
          : 'कृपया IPD क्रमांक प्रविष्ट करा'
      ),
    opdName: yup
      .string()
      .required(
        language === 'en' ? 'Please enter a name' : 'कृपया नाव प्रविष्ट करा'
      )
      .typeError(
        language === 'en' ? 'Please enter a name' : 'कृपया नाव प्रविष्ट करा'
      ),
    opdOpeningTime: yup
      .string()
      .required(
        language === 'en'
          ? 'Please select an opening time'
          : 'कृपया उघडण्याची वेळ निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select an opening time'
          : 'कृपया उघडण्याची वेळ निवडा'
      ),
    opdClosingTime: yup
      .string()
      .required(
        language === 'en'
          ? 'Please select an closing time'
          : 'कृपया बंद होण्याची वेळ निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select an closing time'
          : 'कृपया बंद होण्याची वेळ निवडा'
      ),
    opdWorkingDays: yup
      .number()
      .required(
        language === 'en'
          ? 'Please enter no. of working days'
          : 'कृपया क्रमांक प्रविष्ट करा. कामाचे दिवस'
      )
      .typeError(
        language === 'en' ? 'Please enter a number' : 'कृपया नंबर टाका'
      ),
    opdDetailAddress: yup
      .string()
      .required(
        language === 'en'
          ? `Please enter IPD's address`
          : `कृपया IPD चा पत्ता प्रविष्ट करा`
      )
      .typeError(
        language === 'en'
          ? `Please enter IPD's address`
          : `कृपया IPD चा पत्ता प्रविष्ट करा`
      ),
    flatOrBuildingNo: yup
      .string()
      .required(
        language === 'en'
          ? `Please enter flat/building no.`
          : `कृपया फ्लॅट/इमारत क्रमांक टाका.`
      )
      .typeError(
        language === 'en'
          ? `Please enter flat/building no.`
          : `कृपया फ्लॅट/इमारत क्रमांक टाका.`
      ),
    buildingName: yup
      .string()
      .required(
        language === 'en'
          ? `Please enter building name`
          : `कृपया इमारतीचे नाव प्रविष्ट करा`
      )
      .typeError(
        language === 'en'
          ? `Please enter building name`
          : `कृपया इमारतीचे नाव प्रविष्ट करा`
      ),
    roadName: yup
      .string()
      .required(
        language === 'en'
          ? `Please enter road name`
          : `कृपया रस्त्याचे नाव प्रविष्ट करा`
      )
      .typeError(
        language === 'en'
          ? `Please enter road name`
          : `कृपया रस्त्याचे नाव प्रविष्ट करा`
      ),
    pincode: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter a pincode'
          : 'कृपया पिनकोड प्रविष्ट करा'
      )
      .matches(
        /^[1-9][0-9]*[1-9]$/,
        language === 'en' ? 'Invalid pincode' : 'अवैध पिनकोड'
      )
      .min(
        6,
        language === 'en'
          ? 'Pincode Number must be of 6 digits'
          : 'पिनकोड क्रमांक 6 अंकी असणे आवश्यक आहे'
      )
      .max(
        6,
        language === 'en'
          ? 'Pincode Number must be of 6 digits'
          : 'पिनकोड क्रमांक 6 अंकी असणे आवश्यक आहे'
      ),
  })

  const {
    register,
    reset,
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(opdSchema),
  })

  useEffect(() => {
    getZones()
  }, [])

  useEffect(() => {
    setRunAgain(false)
    getTableData()
  }, [runAgain])

  const getZones = () => {
    axios
      .get(`${URLs.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setZoneDropDown(
          res.data?.map((zones) => ({
            id: zones.zoneId,
            zoneEn: zones.zoneName,
            zoneMr: zones.zoneNameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }
  const getWards = (zoneId) => {
    axios
      .get(
        `${URLs.CFCURL}/master/zoneWardAreaMapping/getWardByZoneAndModuleId`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { zoneId },
        }
      )
      .then((res) =>
        setWardDropDown(
          res.data?.map((wards) => ({
            id: wards.wardId,
            wardEn: wards.wardName,
            wardMr: wards.wardNameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  const getTableData = (pageSize = 10, pageNo = 0) => {
    setLoadingState(true)
    axios
      .get(`${URLs.VMS}/mstOpd/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize, sortBy: 'id', sortDir: 'desc' },
      })
      .then((res) => {
        setTable(
          res.data.mstOpdList?.map((j, i) => ({
            srNo: i + 1,
            ...j,
            activeFlag: j?.activeFlag,
            status: j?.activeFlag == 'Y' ? 'Active' : 'Inactive',
            opdOpeningTimeShow: moment(j?.opdOpeningTime).format('hh:mm a'),
            opdClosingTimeShow: moment(j?.opdClosingTime).format('hh:mm a'),
          }))
        )

        setData({
          ...data,
          totalRows: res.data.totalElements,
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })
        setLoadingState(false)
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
        setLoadingState(false)
      })
  }

  const deleteById = (rowData, flag) => {
    sweetAlert({
      title: language == 'en' ? 'Confirmation' : 'पुष्टीकरण',
      text:
        language === 'en'
          ? 'Do you really want to change the status of this record ?'
          : 'तुम्हाला खरोखर या रेकॉर्डची स्थिती बदलायची आहे का?',
      icon: 'warning',
      buttons: [
        language === 'en' ? 'No' : 'नाही',
        language === 'en' ? 'Yes' : 'होय',
      ],
    }).then((ok) => {
      if (ok) {
        setLoader(true)
        axios
          .post(
            `${URLs.VMS}/mstOpd/save`,
            {
              ...rowData,
              activeFlag: flag == 'Y' ? 'N' : 'Y',
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            sweetAlert(
              language === 'en' ? 'Success' : 'यशस्वी झाले',
              flag == 'Y'
                ? language === 'en'
                  ? 'Record successfully deactivated'
                  : 'रेकॉर्ड यशस्वीरित्या निष्क्रिय केले'
                : language === 'en'
                ? 'Record successfully activated'
                : 'रेकॉर्ड यशस्वीरित्या सक्रिय केले',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
            setRunAgain(true)
            setLoader(false)
          })
          .catch((error) => {
            catchExceptionHandlingMethod(error, language)
            setLoader(false)
          })
      }
    })
  }

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },
    {
      headerClassName: 'cellColor',

      field: 'opdName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='opdName' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'officeType',
      headerAlign: 'center',
      headerName: <FormattedLabel id='officeType' />,
      width: 200,
    },
    {
      headerClassName: 'cellColor',

      field: 'opdOpeningTimeShow',
      headerAlign: 'center',
      headerName: <FormattedLabel id='opdOpeningTime' />,
      width: 200,
    },
    {
      headerClassName: 'cellColor',

      field: 'opdClosingTimeShow',
      headerAlign: 'center',
      headerName: <FormattedLabel id='opdClosingTime' />,
      width: 200,
    },
    {
      headerClassName: 'cellColor',

      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: params.row.activeFlag == 'Y' ? '#1976d2' : 'lightgray',
              }}
              disabled={params.row.activeFlag == 'N'}
              onClick={() => {
                getWards(params.row.zoneKey)
                reset({
                  ...params.row,
                })
                setCollapse(true)
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              sx={{ color: params.row.activeFlag == 'Y' ? 'green' : 'red' }}
              onClick={() => deleteById(params.row, params.row.activeFlag)}
            >
              {params.row.activeFlag == 'Y' ? (
                <ToggleOn
                  sx={{
                    fontSize: 30,
                  }}
                />
              ) : (
                <ToggleOff
                  sx={{
                    fontSize: 30,
                  }}
                />
              )}
            </IconButton>
          </>
        )
      },
    },
  ]

  const clearFields = () => {
    reset({
      fromDate: null,
      toDate: null,
      opdPrefix: '',
      opdNo: '',
      opdName: '',
      opdWorkingDays: '',
      flatOrBuildingNo: '',
      buildingName: '',
      opdDetailAddress: '',
      roadName: '',
      landmark: '',
      pincode: '',
      remark: '',
      zoneKey: '',
      wardKey: '',
      officeType: '',
      opdOpeningTime: null,
      opdClosingTime: null,
      labFacility: false,
      xrayFacility: false,
    })
  }

  const finalSubmit = (data) => {
    setLoader(true)

    axios
      .post(
        `${URLs.VMS}/mstOpd/save`,
        { ...data, activeFlag: 'Y' },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (data.id) {
          sweetAlert(
            language == 'en' ? 'Updated!' : 'अद्यतनित',
            language == 'en'
              ? 'OPD data updated successfully!'
              : 'OPD डेटा यशस्वीरित्या अपडेट केला',
            'success',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
        } else {
          sweetAlert(
            language == 'en' ? 'Success!' : 'यशस्वी झाले!',
            language == 'en'
              ? 'OPD data saved successfully!'
              : 'ओपीडी डेटा यशस्वीरित्या सेव्ह झाला',
            'success',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
        }
        setRunAgain(true)
        clearFields()
        setCollapse(false)
        setLoader(false)
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
        setLoader(false)
      })
  }

  return (
    <>
      <Head>
        <title>Define OPD</title>
      </Head>
      <Breadcrumb />
      <Paper className={styles.main}>
        {loader && <Loader />}

        <div className={styles.title}>
          <FormattedLabel id='defineOpd' />
        </div>
        <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            onClick={() => {
              setCollapse(!collapse)
            }}
            endIcon={<Add />}
          >
            <FormattedLabel id='add' />
          </Button>
        </div>
        <Slide in={collapse} mountOnEnter unmountOnExit>
          <form
            onSubmit={handleSubmit(finalSubmit)}
            style={{ padding: '5vh 3%' }}
          >
            <div className={styles.row}>
              <FormControl sx={{ width: 250 }} error={!!error.fromDate}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name='fromDate'
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disableFuture
                        disabled={
                          router.query.pageMode == 'view' ? true : false
                        }
                        inputFormat='dd/MM/yyyy'
                        label={<FormattedLabel id='fromDate' required />}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format('YYYY-MM-DD'))
                        }}
                        renderInput={(params) => (
                          <TextField
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
              <FormControl sx={{ width: 250 }} error={!!error.toDate}>
                {/* @ts-ignore */}

                <Controller
                  control={control}
                  name='toDate'
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        // disableFuture
                        disabled={
                          router.query.pageMode == 'view' ? true : false
                        }
                        inputFormat='dd/MM/yyyy'
                        label={<FormattedLabel id='toDate' required />}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format('YYYY-MM-DD'))
                        }}
                        renderInput={(params) => (
                          <TextField
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
              <FormControl
                disabled={router.query.pageMode == 'view' ? true : false}
                variant='standard'
                error={!!error.zoneKey}
              >
                <InputLabel id='demo-simple-select-standard-label'>
                  <FormattedLabel id='zone' required />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: '250px' }}
                      labelId='demo-simple-select-standard-label'
                      id='demo-simple-select-standard'
                      // @ts-ignore
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value)
                        getWards(value.target.value)
                      }}
                      label='zoneKey'
                    >
                      {zoneDropDown &&
                        zoneDropDown?.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == 'en'
                              ? //@ts-ignore
                                value.zoneEn
                              : // @ts-ignore
                                value?.zoneMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name='zoneKey'
                  control={control}
                  defaultValue=''
                />
                <FormHelperText>
                  {error?.zoneKey ? error.zoneKey.message : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.row}>
              <FormControl
                disabled={
                  router.query.pageMode == 'view' || wardDropDown?.length == 0
                }
                variant='standard'
                error={!!error.wardKey}
              >
                <InputLabel id='demo-simple-select-standard-label'>
                  <FormattedLabel id='ward' required />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: '250px' }}
                      labelId='demo-simple-select-standard-label'
                      id='demo-simple-select-standard'
                      // @ts-ignore
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label='wardKey'
                    >
                      {wardDropDown &&
                        wardDropDown?.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == 'en'
                              ? //@ts-ignore
                                value.wardEn
                              : // @ts-ignore
                                value?.wardMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name='wardKey'
                  control={control}
                  defaultValue=''
                />
                <FormHelperText>
                  {error?.wardKey ? error.wardKey.message : null}
                </FormHelperText>
              </FormControl>
              <FormControl
                disabled={router.query.pageMode == 'view' ? true : false}
                variant='standard'
                error={!!error.officeType}
              >
                <InputLabel id='demo-simple-select-standard-label'>
                  <FormattedLabel id='officeType' required />
                </InputLabel>
                {/* @ts-ignore */}
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ width: '250px' }}
                      labelId='demo-simple-select-standard-label'
                      id='demo-simple-select-standard'
                      // @ts-ignore
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label='officeType'
                    >
                      <MenuItem key={1} value={'Head Office'}>
                        {language == 'en' ? 'Head Office' : 'मुख्य कार्यालय'}
                      </MenuItem>
                      <MenuItem key={2} value={'Section Office'}>
                        {language == 'en' ? 'Section Office' : 'विभाग कार्यालय'}
                      </MenuItem>
                    </Select>
                  )}
                  name='officeType'
                  control={control}
                  defaultValue=''
                />
                <FormHelperText>
                  {error?.officeType ? error.officeType.message : null}
                </FormHelperText>
              </FormControl>
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='opdPrefix' required />}
                // @ts-ignore
                variant='standard'
                {...register('opdPrefix')}
                InputLabelProps={{
                  shrink: router.query.id || watch('opdPrefix') ? true : false,
                }}
                error={!!error.opdPrefix}
                helperText={error?.opdPrefix ? error.opdPrefix.message : null}
              />
            </div>
            <div className={styles.row}>
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='opdNo' required />}
                // @ts-ignore
                variant='standard'
                {...register('opdNo')}
                InputLabelProps={{
                  shrink: router.query.id || watch('opdNo') ? true : false,
                }}
                error={!!error.opdNo}
                helperText={error?.opdNo ? error.opdNo.message : null}
              />
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='opdName' required />}
                // @ts-ignore
                variant='standard'
                {...register('opdName')}
                InputLabelProps={{
                  shrink: router.query.id || watch('opdName') ? true : false,
                }}
                error={!!error.opdName}
                helperText={error?.opdName ? error.opdName.message : null}
              />
              <FormControl
                style={{ marginTop: 10 }}
                error={!!error.opdOpeningTime}
              >
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name='opdOpeningTime'
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label={<FormattedLabel id='opdOpeningTime' required />}
                        value={field.value}
                        onChange={(time) => {
                          field.onChange(
                            moment(time).format('YYYY-MM-DDTHH:mm')
                          )
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            fullWidth
                            variant='standard'
                            sx={{ width: 250 }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.opdOpeningTime ? error.opdOpeningTime.message : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.row}>
              <FormControl
                style={{ marginTop: 10 }}
                error={!!error.opdClosingTime}
              >
                {/* @ts-ignore */}
                <Controller
                  //   format="HH:mm"
                  control={control}
                  name='opdClosingTime'
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label={<FormattedLabel id='opdClosingTime' required />}
                        value={field.value}
                        onChange={(time) =>
                          field.onChange(
                            moment(time).format('YYYY-MM-DDTHH:mm')
                          )
                        }
                        // selected={field.value}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            fullWidth
                            variant='standard'
                            sx={{ width: 250 }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.opdClosingTime ? error.opdClosingTime.message : null}
                </FormHelperText>
              </FormControl>
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='opdWorkingDays' required />}
                // @ts-ignore
                variant='standard'
                {...register('opdWorkingDays')}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch('opdWorkingDays') ? true : false,
                }}
                error={!!error.opdWorkingDays}
                helperText={
                  error?.opdWorkingDays ? error.opdWorkingDays.message : null
                }
              />
              <div
                style={{ width: 250, display: 'flex', flexDirection: 'column' }}
              >
                <FormControlLabel
                  control={
                    //  @ts-ignore
                    <Controller
                      name='labFacility'
                      control={control}
                      defaultValue={false}
                      render={({ field: props }) => (
                        <Checkbox
                          {...props}
                          checked={props.value}
                          onChange={(e) => props.onChange(e.target.checked)}
                        />
                      )}
                    />
                  }
                  label={<FormattedLabel id='labFacility' required />}
                />
                <FormControlLabel
                  control={
                    //  @ts-ignore
                    <Controller
                      name='xrayFacility'
                      control={control}
                      defaultValue={false}
                      render={({ field: props }) => (
                        <Checkbox
                          {...props}
                          checked={props.value}
                          onChange={(e) => props.onChange(e.target.checked)}
                        />
                      )}
                    />
                  }
                  label={<FormattedLabel id='xRayFacility' required />}
                />
              </div>
            </div>
            <div className={styles.row}>
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='opdAddress' required />}
                // @ts-ignore
                variant='standard'
                {...register('opdDetailAddress')}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch('opdDetailAddress') ? true : false,
                }}
                error={!!error.opdDetailAddress}
                helperText={
                  error?.opdDetailAddress
                    ? error.opdDetailAddress.message
                    : null
                }
              />
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='flatOrBuildingNo' required />}
                // @ts-ignore
                variant='standard'
                {...register('flatOrBuildingNo')}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch('flatOrBuildingNo') ? true : false,
                }}
                error={!!error.flatOrBuildingNo}
                helperText={
                  error?.flatOrBuildingNo
                    ? error.flatOrBuildingNo.message
                    : null
                }
              />
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='buildingName' required />}
                // @ts-ignore
                variant='standard'
                {...register('buildingName')}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch('buildingName') ? true : false,
                }}
                error={!!error.buildingName}
                helperText={
                  error?.buildingName ? error.buildingName.message : null
                }
              />
            </div>
            <div className={styles.row}>
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='roadName' required />}
                // @ts-ignore
                variant='standard'
                {...register('roadName')}
                InputLabelProps={{
                  shrink: router.query.id || watch('roadName') ? true : false,
                }}
                error={!!error.roadName}
                helperText={error?.roadName ? error.roadName.message : null}
              />
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='landmark' />}
                // @ts-ignore
                variant='standard'
                {...register('landmark')}
                InputLabelProps={{
                  shrink: router.query.id || watch('landmark') ? true : false,
                }}
                error={!!error.landmark}
                helperText={error?.landmark ? error.landmark.message : null}
              />
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='pincode' required />}
                // @ts-ignore
                variant='standard'
                {...register('pincode')}
                InputLabelProps={{
                  shrink: router.query.id || watch('pincode') ? true : false,
                }}
                error={!!error.pincode}
                helperText={error?.pincode ? error.pincode.message : null}
              />
            </div>
            <div className={styles.row}>
              <TextField
                disabled={router.query.pageMode == 'view' ? true : false}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='remark' />}
                // @ts-ignore
                variant='standard'
                {...register('remark')}
                InputLabelProps={{
                  shrink: router.query.id || watch('remark') ? true : false,
                }}
                error={!!error.remark}
                helperText={error?.remark ? error.remark.message : null}
              />
            </div>
            <div className={styles.buttons}>
              <Button
                color='success'
                variant='contained'
                type='submit'
                endIcon={<Save />}
              >
                <FormattedLabel id='save' />
              </Button>
              <Button
                variant='outlined'
                color='error'
                onClick={clearFields}
                endIcon={<Clear />}
              >
                <FormattedLabel id='clear' />
              </Button>
              <Button
                variant='contained'
                color='error'
                endIcon={<ExitToApp />}
                onClick={() =>
                  router.push(`/veterinaryManagementSystem/dashboard`)
                }
              >
                <FormattedLabel id='exit' />
              </Button>
            </div>
          </form>
        </Slide>
        <DataGrid
          loading={loadingState}
          autoHeight
          sx={{
            marginTop: '5vh',
            width: '100%',

            '& .cellColor': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 0 },
              disableExport: false,
              disableToolbarButton: false,
              csvOptions: { disableToolbarButton: false },
              printOptions: { disableToolbarButton: true },
            },
          }}
          paginationMode='server'
          rowCount={data?.totalRows}
          rowsPerPageOptions={data?.rowsPerPageOptions}
          page={data?.page}
          pageSize={data?.pageSize}
          onPageChange={(pageNo) => {
            getTableData(data?.pageSize, pageNo)
          }}
          onPageSizeChange={(pageSize) => {
            setData({ ...data, pageSize })
            getTableData(pageSize, data?.page)
          }}
        />
      </Paper>
    </>
  )
}

export default Index
