import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepButton from '@mui/material/StepButton'
import Button from '@mui/material/Button'
import Head from 'next/head'
import router from 'next/router'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import {
  Paper,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  TextField,
  MenuItem,
  Checkbox,
} from '@mui/material'
import { FormProvider, Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from './view.module.css'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import URLS from '../../../../URLS/urls'
import { useSelector } from 'react-redux'
import DocumentUploadTable from '../../../../containers/reuseableComponents/DocumentUploadTable'
import Image from 'next/image'

const View = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  // @ts-ignore
  const userDetails = useSelector((state) => state.user.user.userDao)

  const [newDate, setNewDate] = useState('')
  const [personalDetails, setPersonalDetails] = useState({})
  const [areaDetails, setAreaDetails] = useState({})
  const [runAgain, setRunAgain] = useState(false)
  const [isCurrentUser, setIsCurrentUser] = useState(false)
  const [gender, setGender] = useState([
    {
      id: 1,
      genderEn: '',
      genderMr: '',
    },
  ])
  const [title, setTitle] = useState([
    {
      id: 1,
      titleEn: '',
      titleMr: '',
    },
  ])
  const [zone, setZone] = useState([
    {
      id: 1,
      zoneEn: '',
      zoneMr: '',
    },
  ])
  const [village, setVillage] = useState([
    {
      id: 1,
      villageEn: '',
      villageMr: '',
    },
  ])
  const [gat, setGat] = useState([
    {
      id: 1,
      gatEn: '',
      gatMr: '',
    },
  ])
  const [reservationName, setReservationName] = useState([
    {
      id: 1,
      reservationNameEn: '',
      reservationNameMr: '',
    },
  ])

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentChecklistEn: '',
      documentChecklistMr: '',
    },
  ])
  const [files, setFiles] = useState([
    {
      id: 1,
      srNo: 1,
      isDocumentMandetory: true,
      docKey: 1,
      documentNameEn: '',
      documentNameMr: '',
      filePath: '',
      status: '',
      remark: '',
    },
  ])
  const [filesUpdated, setFilesUpdated] = useState(false)
  const [filesAale, setFilesAale] = useState(false)

  let tempFilee = []

  //Personal Details
  let personalDetailsSchema = yup.object().shape({
    title: yup.string().required('Please select a Title'),
    firstNameEn: yup.string().required('Please First name in English'),
    firstNameMr: yup.string().required('Please First name in Marathi'),
    // middleNameEn: yup.string().required('Please Middle name in English'),
    // middleNameMr: yup.string().required('Please Middle name in Marathi'),
    surnameEn: yup.string().required('Please Last name in English'),
    surnameMr: yup.string().required('Please Last name in Marathi'),
    gender: yup.string().required('Please select a Gender'),
    mobile: yup.number().required('Please select a Mobile'),
    // panNo: yup.string().required('Please select a Pan No'),
    emailAddress: yup.string().required('Please select an Email Address'),
  })

  //Area Details
  let areaDetailsSchema = yup.object().shape({
    villageName: yup.string().required('Please select a Village'),
    serviceCompletionDate: yup.string().required('Please select a date.'),
    // gisLocation: yup.string().required('Please select a Village'),
    // tDRZone: yup.string().required('Please select a Zone'),
    // flatNo: yup.string().required('Please select a Village'),
    // buildingName: yup.string().required('Please select a Village'),
    // gatNo: yup.string().required('Please select a Gat'),
    // surveyNo: yup.string().required('Please select a Aadhaar No.'),
  })

  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(personalDetailsSchema),
  })

  const {
    register: register1,
    handleSubmit: handleSubmit2,
    // @ts-ignore
    methods: methods2,
    reset: reset2,
    control: control2,
    // watch,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(areaDetailsSchema),
  })

  useEffect(() => {
    if (isCurrentUser) {
      setValue('firstNameEn', userDetails.firstNameEn)
      setValue('firstNameMr', userDetails.firstNameMr)
      setValue('middleNameEn', userDetails.middleNameEn)
      setValue('middleNameMr', userDetails.middleNameMr)
      setValue('surnameEn', userDetails.lastNameEn)
      setValue('surnameMr', userDetails.lastNameMr)
    } else {
      setValue('firstNameEn', '')
      setValue('firstNameMr', '')
      setValue('middleNameEn', '')
      setValue('middleNameMr', '')
      setValue('surnameEn', '')
      setValue('surnameMr', '')
    }
  }, [isCurrentUser, userDetails, setValue])

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  const steps = [
    <FormattedLabel key={1} id='personalDetails' />,
    <FormattedLabel key={2} id='areaDetails' />,
    <FormattedLabel key={3} id='documentUpload' />,
  ]
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState({})

  const totalSteps = () => {
    return steps.length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
    const newCompleted = completed
    newCompleted[activeStep - 1] = false
    setCompleted(newCompleted)
  }

  const handleStep = (step) => () => {
    setActiveStep(step)
  }

  // const handleReset = () => {
  //   setActiveStep(0)
  //   setCompleted({})
  // }

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+

  useEffect(() => {
    // Date
    let appDate = new Date()
    setNewDate(moment(appDate, 'YYYY-MM-DD').format('YYYY-MM-DD'))

    //Gender
    axios.get(`${URLS.CFCURL}/master/gender/getAll`).then((res) => {
      setGender(
        res.data.gender.map((j) => ({
          id: j.id,
          genderEn: j.gender,
          genderMr: j.genderMr,
        }))
      )
    })

    //Title
    axios.get(`${URLS.CFCURL}/master/title/getAll`).then((res) => {
      setTitle(
        res.data.title.map((j) => ({
          id: j.id,
          titleEn: j.title,
          titleMr: j.titleMr,
        }))
      )
    })

    //Zone
    axios.get(`${URLS.CFCURL}/master/zone/getAll`).then((res) => {
      setZone(
        res.data.zone.map((j) => ({
          id: j.id,
          zoneEn: j.zoneName,
          zoneMr: j.zoneNameMr,
        }))
      )
    })

    //Village
    axios.get(`${URLS.CFCURL}/master/village/getAll`).then((res) => {
      setVillage(
        res.data.village.map((j) => ({
          id: j.id,
          villageEn: j.villageName,
          villageMr: j.villageNameMr,
        }))
      )
    })

    //Gat
    axios.get(`${URLS.CFCURL}/master/gatMaster/getAll`).then((r) => {
      setGat(
        r.data.gatMaster.map((j, i) => ({
          id: j.id,
          gatEn: j.gatNameEn,
          gatMr: j.gatNameMr,
        }))
      )
    })

    //Reservation Name
    axios.get(`${URLS.TPURL}/landReservationMaster/getAll`).then((r) => {
      setReservationName(
        r.data.map((j, i) => ({
          id: i + 1,
          reservationNameEn: j.reservationNameEng,
          reservationNameMr: j.reservationNameMr,
        }))
      )
    })

    //DocumentsList
    axios.get(`${URLS.CFCURL}/master/documentMaster/getAll`).then((res) => {
      setDocuments(
        res.data.documentMaster.map((j, i) => ({
          id: j.id,
          documentNameEn: j.documentChecklistEn,
          documentNameMr: j.documentChecklistMr,
        }))
      )
    })
  }, [])

  useEffect(() => {
    //Document Checklist
    axios
      .post(
        `${
          URLS.CFCURL
        }/master/serviceWiseChecklist/getDocumentsByService?service=${15}`
      )
      .then((r) => {
        if (router.query.id) {
          axios
            .get(`${URLS.TPURL}/partplan/getpartplan/${router.query.id}`)
            .then((res) => {
              setFiles(
                r.data.map((r, i) => ({
                  id: getID(res.data.files, r.document),
                  srNo: i + 1,
                  isDocumentMandetory: r.isDocumentMandetory,
                  docKey: r.document,
                  documentNameEn: documents.find((arg) => arg.id === r.document)
                    ?.documentNameEn,
                  documentNameMr: documents.find((arg) => arg.id === r.document)
                    ?.documentNameMr,

                  filePath: getFilePath(res.data.files, r.document),
                  status: getStatus(res.data.files, r.document),
                  remark: res.data.files.find(
                    (file) => file.docKey === r.document
                  ).remark,
                }))
              )
              setFilesAale(true)
            })
        } else {
          setFiles(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              isDocumentMandetory: j.isDocumentMandetory,
              docKey: j.document,
              documentNameEn: documents.find((arg) => arg.id === j.document)
                ?.documentNameEn,
              documentNameMr: documents.find((arg) => arg.id === j.document)
                ?.documentNameMr,
              filePath: '',
              status: 'upload',
              remark: '',
            }))
          )
          setFilesAale(true)
        }
      })
  }, [documents])

  const getID = (arr, docKey) => {
    return arr.find((file) => file.docKey === docKey).id
  }

  const getFilePath = (arr, id) => {
    return arr.find((file) => file.docKey === id).partPlanAttachmentPath
  }

  const getStatus = (arr, docKey) => {
    return arr.find((file) => file.docKey === docKey).status
  }

  const getDocumentName = (value, lang) => {
    if (lang == 'en') {
      return documents.find((arg) => arg.id === value)?.documentNameEn
    } else {
      return documents.find((arg) => arg.id === value)?.documentNameMr
    }
  }

  useEffect(() => {
    setRunAgain(false)
    setActiveStep(0)
    setCompleted({})
  }, [runAgain])

  const personalSubmit = (personalData) => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()

    setPersonalDetails(personalData)
  }

  const areaSubmit = (areaData) => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    handleNext()

    setAreaDetails(areaData)
  }

  const finalSubmit = async () => {
    const newCompleted = completed
    newCompleted[activeStep] = true
    setCompleted(newCompleted)
    // handleNext()

    let filesToSend = []

    filesToSend = files.map((j) => ({
      // @ts-ignore
      docKey: j.docKey,
      // @ts-ignore
      partPlanAttachmentPath: j.filePath,
      // status: j.status,
      status: j.status === 'upload' ? 'pending' : j.status,
      remark: 'Pending Approval',
    }))

    const bodyForAPI = {
      ...personalDetails,
      ...areaDetails,
      files: filesToSend,
      status: 'Application Created',
      applicationDate: newDate,
      serviceName: 'Part Map',
      applicationNo: router.query.length
        ? `TP/PM/04/${router.query.length}/2022`
        : `TP/PM/04/001/2022`,
    }

    console.log('Body For API: ', bodyForAPI)

    // if (router.query.pageMode === 'edit') {
    //   await axios
    //     .post(`${URLS.TPURL}/partplan/updatepartplan`, bodyForAPI, {
    //       headers: {
    //         // Authorization: `Bearer ${token}`,
    //         role: 'CITIZEN',
    //       },
    //     })
    //     .then((response) => {
    //       if (response.status === 200) {
    //         handleNext()

    //         sweetAlert('Updated!', 'Record Updated successfully !', 'success')
    //         router.push('/townPlanning/transactions/setBackCertificate')
    //       }
    //     })
    // } else {
    //   await axios
    //     .post(`${URLS.TPURL}/partplan/savepartplan`, bodyForAPI, {
    //       headers: {
    //         // Authorization: `Bearer ${token}`,
    //         role: 'CITIZEN',
    //       },
    //     })
    //     .then((response) => {
    //       if (response.status === 200) {
    //         sweetAlert('Saved!', 'Record Saved successfully !', 'success')
    //         router.push('/townPlanning/transactions/acknowledgmentReceipt')
    //       }
    //     })
    // }
  }

  const uploadAgain = async () => {
    let tempNewFiles = files.map((j) => ({
      id: j.id,
      // @ts-ignore
      docKey: j.docKey,
      // @ts-ignore
      partPlanAttachmentPath: j.filePath,
      status: j.status === 'upload' ? 'pending' : j.status,
      remark: j.remark,
    }))

    let status = 'Application Created'

    console.log('status: ', status)

    const statusUpdation = { id: router.query.id, files: tempNewFiles, status }

    await axios
      .post(`${URLS.TPURL}/partplan/savepartplan`, statusUpdation, {
        headers: {
          // Authorization: `Bearer ${token}`,
          role: 'CITIZEN',
        },
      })
      .then((response) => {
        if (response.status === 200) {
          sweetAlert('Saved!', 'Record Saved successfully !', 'success')
          router.push('/townPlanning/transactions/utilizationofTDRFSI')
        }
      })
  }

  const onBack = () => {
    const urlLength = router.asPath.split('/').length
    const urlArray = router.asPath.split('/')
    let backUrl = ''
    if (urlLength > 2) {
      for (let i = 0; i < urlLength - 1; i++) {
        backUrl += urlArray[i] + '/'
      }
      router.push(`${backUrl}`)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <>
      <Head>
        <title>Utilization of TDR/FSI</title>
      </Head>
      <Paper className={styles.main}>
        <h2
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          {/* <FormattedLabel id='setBackCertificate' /> */}
          Utilization of TDR/FSI
        </h2>

        <Box sx={{ width: '100%', marginTop: '3vh' }}>
          <Stepper nonLinear activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index} completed={completed[index]}>
                <StepButton color='inherit' onClick={handleStep(index)}>
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
              // <>
              //   <div
              //     style={{
              //       display: 'flex',
              //       justifyContent: 'center',
              //       alignItems: 'center',
              //       padding: '2vw 2vw',
              //       marginTop: '2%',
              //     }}
              //   >
              //     <h2>
              //       <FormattedLabel id='applicationCreated' />
              //     </h2>
              //   </div>
              //   <div
              //     style={{
              //       display: 'flex',
              //       justifyContent: 'center',
              //       alignItems: 'center',
              //       width: '100%',
              //     }}
              //   >
              //     <Button
              //       color='primary'
              //       variant='contained'
              //       sx={{ marginRight: '2vw' }}
              //       onClick={onBack}
              //     >
              //       <FormattedLabel id='exit' />
              //     </Button>
              //   </div>
              // </>
              ' '
            ) : (
              <>
                {/* Personal Details  */}
                {activeStep === 0 && (
                  <>
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(personalSubmit)}>
                        {/* <div className={styles.fields}> */}
                        <Paper className={styles.fieldsStepper}>
                          {router.query.pageMode === 'new' && (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                marginTop: '2%',
                              }}
                            >
                              <Checkbox
                                checked={isCurrentUser}
                                onChange={() => {
                                  setIsCurrentUser(!isCurrentUser)
                                }}
                              />
                              <h3>
                                <FormattedLabel id='isCurrentUser' />
                              </h3>
                            </div>
                          )}
                          <div className={styles.row}>
                            <FormControl
                              sx={{
                                width: '230px',
                              }}
                              variant='standard'
                              error={!!errors.title}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={router.query.title ? true : false}
                              >
                                <FormattedLabel id='title' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={router.query.title ? true : false}
                                    value={
                                      router.query.title
                                        ? router.query.title
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='title'
                                  >
                                    {title &&
                                      title.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.titleEn
                                              : value?.titleMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='title'
                                control={control}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.title ? errors.title.message : null}
                              </FormHelperText>
                            </FormControl>

                            <TextField
                              sx={{
                                width: '230px',
                              }}
                              id='standard-basic'
                              label={
                                <FormattedLabel id='firstNameEn' required />
                              }
                              variant='standard'
                              {...register('firstNameEn')}
                              error={!!errors.firstNameEn}
                              helperText={
                                errors?.firstNameEn
                                  ? errors.firstNameEn.message
                                  : null
                              }
                              value={
                                router.query.firstNameEn &&
                                router.query.firstNameEn
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('firstNameEn') ? true : false) ||
                                  (router.query.firstNameEn ? true : false) ||
                                  (isCurrentUser ? true : false),
                              }}
                              disabled={
                                (router.query.firstNameEn ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.firstNameEn
                                  ? router.query.firstNameEn
                                  : ''
                              }
                            />
                            <TextField
                              sx={{
                                width: '230px',
                                // marginRight: '5%',
                              }}
                              id='standard-basic'
                              label={<FormattedLabel id='middleNameEn' />}
                              variant='standard'
                              {...register('middleNameEn')}
                              error={!!errors.middleNameEn}
                              helperText={
                                errors?.middleNameEn
                                  ? errors.middleNameEn.message
                                  : null
                              }
                              value={
                                router.query.middleNameEn &&
                                router.query.middleNameEn
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('middleNameEn') ? true : false) ||
                                  (router.query.middleNameEn ? true : false),
                              }}
                              disabled={
                                (router.query.middleNameEn ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.middleNameEn
                                  ? router.query.middleNameEn
                                  : ''
                              }
                            />

                            <TextField
                              sx={{
                                width: '230px',
                              }}
                              id='standard-basic'
                              label={<FormattedLabel id='surnameEn' required />}
                              variant='standard'
                              {...register('surnameEn')}
                              error={!!errors.surnameEn}
                              helperText={
                                errors?.surnameEn
                                  ? errors.surnameEn.message
                                  : null
                              }
                              value={
                                router.query.surnameEn && router.query.surnameEn
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('surnameEn') ? true : false) ||
                                  (router.query.surnameEn ? true : false),
                              }}
                              disabled={
                                (router.query.surnameEn ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.surnameEn
                                  ? router.query.surnameEn
                                  : ''
                              }
                            />
                          </div>
                          <div
                            className={styles.row}
                            style={{ marginTop: '2%' }}
                          >
                            <TextField
                              sx={{
                                width: '230px',
                              }}
                              id='standard-basic'
                              label={
                                <FormattedLabel id='firstNameMr' required />
                              }
                              variant='standard'
                              {...register('firstNameMr')}
                              error={!!errors.firstNameMr}
                              helperText={
                                errors?.firstNameMr
                                  ? errors.firstNameMr.message
                                  : null
                              }
                              value={
                                router.query.firstNameMr &&
                                router.query.firstNameMr
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('firstNameMr') ? true : false) ||
                                  (router.query.firstNameMr ? true : false),
                              }}
                              disabled={
                                (router.query.firstNameMr ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.firstNameMr
                                  ? router.query.firstNameMr
                                  : ''
                              }
                            />
                            <TextField
                              sx={{
                                width: '230px',
                                // marginRight: '5%',
                              }}
                              id='standard-basic'
                              label={<FormattedLabel id='middleNameMr' />}
                              variant='standard'
                              {...register('middleNameMr')}
                              error={!!errors.middleNameMr}
                              helperText={
                                errors?.middleNameMr
                                  ? errors.middleNameMr.message
                                  : null
                              }
                              value={
                                router.query.middleNameMr &&
                                router.query.middleNameMr
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('middleNameMr') ? true : false) ||
                                  (router.query.middleNameMr ? true : false),
                              }}
                              disabled={
                                (router.query.middleNameMr ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.middleNameMr
                                  ? router.query.middleNameMr
                                  : ''
                              }
                            />

                            <TextField
                              sx={{
                                width: '230px',
                              }}
                              id='standard-basic'
                              label={<FormattedLabel id='surnameMr' required />}
                              variant='standard'
                              {...register('surnameMr')}
                              error={!!errors.surnameMr}
                              helperText={
                                errors?.surnameMr
                                  ? errors.surnameMr.message
                                  : null
                              }
                              value={
                                router.query.surnameMr && router.query.surnameMr
                              }
                              InputLabelProps={{
                                shrink:
                                  (watch('surnameMr') ? true : false) ||
                                  (router.query.surnameMr ? true : false),
                              }}
                              disabled={
                                (router.query.surnameMr ? true : false) ||
                                isCurrentUser
                              }
                              defaultValue={
                                router.query.surnameMr
                                  ? router.query.surnameMr
                                  : ''
                              }
                            />

                            <FormControl
                              sx={{
                                width: '230px',
                              }}
                              variant='standard'
                              error={!!errors.gender}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={router.query.gender ? true : false}
                              >
                                <FormattedLabel id='gender' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    // value={field.value}
                                    disabled={
                                      router.query.gender ? true : false
                                    }
                                    value={
                                      router.query.gender
                                        ? router.query.gender
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='gender'
                                  >
                                    {gender &&
                                      gender.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.genderEn
                                              : value?.genderMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='gender'
                                control={control}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.gender ? errors.gender.message : null}
                              </FormHelperText>
                            </FormControl>
                          </div>
                          <div
                            className={styles.row}
                            style={{
                              marginTop: '2%',
                              // display: 'flex',
                              // columnGap: 75,
                              // flexWrap: 'wrap',
                            }}
                          >
                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='mobile' required />}
                              variant='standard'
                              {...register('mobile')}
                              error={!!errors.mobile}
                              helperText={
                                errors?.mobile ? errors.mobile.message : null
                              }
                              disabled={router.query.mobile ? true : false}
                              defaultValue={
                                router.query.mobile ? router.query.mobile : ''
                              }
                            />

                            {/* <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='panNo' required />}
                              variant='standard'
                              {...register('panNo')}
                              error={!!errors.panNo}
                              helperText={
                                errors?.panNo ? errors.panNo.message : null
                              }
                              disabled={router.query.panNo ? true : false}
                              defaultValue={
                                router.query.panNo ? router.query.panNo : ''
                              }
                            /> */}

                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='email' required />}
                              variant='standard'
                              {...register('emailAddress')}
                              error={!!errors.emailAddress}
                              helperText={
                                errors?.emailAddress
                                  ? errors.emailAddress.message
                                  : null
                              }
                              disabled={
                                router.query.emailAddress ? true : false
                              }
                              defaultValue={
                                router.query.emailAddress
                                  ? router.query.emailAddress
                                  : ''
                              }
                            />

                            <div style={{ width: '230px' }}></div>
                            <div style={{ width: '230px' }}></div>

                            {/* <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='surveyNo' required />}
                              variant='standard'
                              {...register('surveyNo')}
                              error={!!errors.surveyNo}
                              helperText={
                                errors?.surveyNo
                                  ? errors.surveyNo.message
                                  : null
                              }
                              disabled={router.query.surveyNo ? true : false}
                              defaultValue={
                                router.query.surveyNo
                                  ? router.query.surveyNo
                                  : ''
                              }
                            /> */}
                          </div>
                        </Paper>
                        {/* </div> */}

                        <div className={styles.box}>
                          <Button
                            color='primary'
                            variant='contained'
                            onClick={onBack}
                          >
                            <FormattedLabel id='exit' />
                          </Button>

                          <Button
                            color='primary'
                            variant='contained'
                            disabled
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                          >
                            <FormattedLabel id='back' />
                          </Button>
                          {activeStep !== steps.length &&
                            router.query.pageMode === 'new' && (
                              <Button
                                style={{ marginLeft: 800 }}
                                color='primary'
                                type='submit'
                                variant='contained'
                              >
                                <FormattedLabel id='saveAndNext' />
                              </Button>
                            )}
                          {activeStep !== steps.length &&
                            router.query.pageMode === 'view' && (
                              <Button
                                style={{ marginLeft: 800 }}
                                color='primary'
                                variant='contained'
                                onClick={handleNext}
                              >
                                <FormattedLabel id='next' />
                              </Button>
                            )}
                        </div>
                      </form>
                    </FormProvider>
                  </>
                )}
                {activeStep === 1 && (
                  <>
                    {/* Address Details  */}
                    <FormProvider {...methods2}>
                      <form onSubmit={handleSubmit2(areaSubmit)}>
                        <div
                          className={styles.fields}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Paper className={styles.leftSide}>
                            <div style={{ width: '100%', marginBottom: '1vw' }}>
                              <Button color='primary' variant='contained'>
                                Locate
                              </Button>
                            </div>

                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='flatNo' required />}
                              variant='standard'
                              {...register('flatNo')}
                              error={!!errors.flatNo}
                              helperText={
                                errors?.flatNo ? errors.flatNo.message : null
                              }
                              disabled={router.query.flatNo ? true : false}
                              defaultValue={
                                router.query.flatNo ? router.query.flatNo : ''
                              }
                            />
                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={
                                <FormattedLabel id='buildingName' required />
                              }
                              variant='standard'
                              {...register('buildingName')}
                              error={!!errors.buildingName}
                              helperText={
                                errors?.buildingName
                                  ? errors.buildingName.message
                                  : null
                              }
                              disabled={
                                router.query.buildingName ? true : false
                              }
                              defaultValue={
                                router.query.buildingName
                                  ? router.query.buildingName
                                  : ''
                              }
                            />

                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='roadName' />}
                              variant='standard'
                              {...register('roadName')}
                              error={!!errors.roadName}
                              helperText={
                                errors?.roadName
                                  ? errors.roadName.message
                                  : null
                              }
                              disabled={router.query.roadName ? true : false}
                              defaultValue={
                                router.query.roadName
                                  ? router.query.roadName
                                  : ''
                              }
                            />

                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='landmark' />}
                              variant='standard'
                              {...register('landmark')}
                              error={!!errors.landmark}
                              helperText={
                                errors?.landmark
                                  ? errors.landmark.message
                                  : null
                              }
                              disabled={router.query.landmark ? true : false}
                              defaultValue={
                                router.query.landmark
                                  ? router.query.landmark
                                  : ''
                              }
                            />

                            {/* <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='surveyNo' required />}
                              variant='standard'
                              {...register('surveyNo')}
                              error={!!errors.surveyNo}
                              helperText={
                                errors?.surveyNo
                                  ? errors.surveyNo.message
                                  : null
                              }
                              disabled={router.query.surveyNo ? true : false}
                              defaultValue={
                                router.query.surveyNo
                                  ? router.query.surveyNo
                                  : ''
                              }
                            /> */}

                            <FormControl
                              sx={{ width: '230px', marginTop: '2%' }}
                              variant='standard'
                              error={!!errors.gatNo}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={router.query.gatNo ? true : false}
                              >
                                <FormattedLabel id='gatName' />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={router.query.gatNo ? true : false}
                                    value={
                                      router.query.gatNo
                                        ? router.query.gatNo
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='gatNo'
                                  >
                                    {gat &&
                                      gat.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.gatEn
                                              : value?.gatMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='gatNo'
                                control={control2}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.gatNo ? errors.gatNo.message : null}
                              </FormHelperText>
                            </FormControl>
                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='ctsNo' />}
                              variant='standard'
                              {...register('ctsNo')}
                              error={!!errors.ctsNo}
                              helperText={
                                errors?.ctsNo ? errors.ctsNo.message : null
                              }
                              disabled={router.query.ctsNo ? true : false}
                              defaultValue={
                                router.query.ctsNo ? router.query.ctsNo : ''
                              }
                            />
                            <TextField
                              sx={{ width: '230px' }}
                              id='standard-basic'
                              label={<FormattedLabel id='plotNo' />}
                              variant='standard'
                              {...register('plotNo')}
                              error={!!errors.plotNo}
                              helperText={
                                errors?.plotNo ? errors.plotNo.message : null
                              }
                              disabled={router.query.plotNo ? true : false}
                              defaultValue={
                                router.query.plotNo ? router.query.plotNo : ''
                              }
                            />

                            {/* <FormControl
                              sx={{ width: '230px', marginTop: '2%' }}
                              variant='standard'
                              error={!!errors.tDRZone}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={router.query.tDRZone ? true : false}
                              >
                                <FormattedLabel id='zoneName' />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={
                                      router.query.tDRZone ? true : false
                                    }
                                    value={
                                      router.query.tDRZone
                                        ? router.query.tDRZone
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='tDRZone'
                                  >
                                    {zone &&
                                      zone.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.zoneEn
                                              : value?.zoneMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='tDRZone'
                                control={control2}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.tDRZone
                                  ? errors.tDRZone.message
                                  : null}
                              </FormHelperText>
                            </FormControl> */}

                            {/* <FormControl
                              sx={{ width: '230px', marginTop: '2%' }}
                              variant='standard'
                              error={!!errors.villageName}
                            >
                              <InputLabel
                                id='demo-simple-select-standard-label'
                                disabled={
                                  router.query.villageName ? true : false
                                }
                              >
                                <FormattedLabel id='villageName' required />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    labelId='demo-simple-select-standard-label'
                                    id='demo-simple-select-standard'
                                    disabled={
                                      router.query.villageName ? true : false
                                    }
                                    value={
                                      router.query.villageName
                                        ? router.query.villageName
                                        : field.value
                                    }
                                    onChange={(value) => field.onChange(value)}
                                    label='villageName'
                                  >
                                    {village &&
                                      village.map((value, index) => (
                                        <MenuItem
                                          key={index}
                                          value={
                                            // @ts-ignore
                                            value?.id
                                          }
                                        >
                                          {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.villageEn
                                              : value?.villageMr
                                          }
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name='villageName'
                                control={control2}
                                defaultValue=''
                              />
                              <FormHelperText>
                                {errors?.villageName
                                  ? errors.villageName.message
                                  : null}
                              </FormHelperText>
                            </FormControl> */}

                            <FormControl
                              style={{
                                width: '230px',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '2%',
                              }}
                              error={!!errors.serviceCompletionDate}
                            >
                              <Controller
                                control={control2}
                                name='serviceCompletionDate'
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <DatePicker
                                      inputFormat='dd/MM/yyyy'
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                          <FormattedLabel
                                            id='serviceCompletionDate'
                                            required
                                          />
                                        </span>
                                      }
                                      disabled={
                                        router.query.serviceCompletionDate
                                          ? true
                                          : false
                                      }
                                      value={
                                        router.query.serviceCompletionDate
                                          ? router.query.serviceCompletionDate
                                          : field.value
                                      }
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date, 'YYYY-MM-DD').format(
                                            'YYYY-MM-DD'
                                          )
                                        )
                                      }
                                      // selected={field.value}
                                      // center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size='small'
                                          fullWidth
                                          variant='standard'
                                          // InputLabelProps={{
                                          //   style: {
                                          //     fontSize: 15,
                                          //     marginTop: 4,
                                          //   },
                                          // }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.serviceCompletionDate
                                  ? errors.serviceCompletionDate.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Paper>
                          <div className={styles.rightSide}>
                            <div className={styles.img}>
                              <Image
                                // src={map}
                                src={'/map.png'}
                                alt='Map.png'
                                height={300}
                                width={345}
                                // priority
                              />
                            </div>
                          </div>
                        </div>

                        <div
                          className={styles.box}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div>
                            <Button
                              color='primary'
                              variant='contained'
                              sx={{ marginRight: '2vw' }}
                              onClick={onBack}
                            >
                              <FormattedLabel id='exit' />
                            </Button>
                            <Button
                              color='primary'
                              variant='contained'
                              onClick={handleBack}
                              sx={{ mr: 1 }}
                            >
                              <FormattedLabel id='back' />
                            </Button>
                          </div>

                          {activeStep !== steps.length &&
                            router.query.pageMode === 'new' && (
                              <Button
                                color='primary'
                                variant='contained'
                                type='submit'
                              >
                                <FormattedLabel id='saveAndNext' />
                              </Button>
                            )}
                          {activeStep !== steps.length &&
                            router.query.pageMode === 'view' && (
                              <Button
                                style={{ marginLeft: 800 }}
                                color='primary'
                                variant='contained'
                                onClick={handleNext}
                              >
                                <FormattedLabel id='next' />
                              </Button>
                            )}
                        </div>
                      </form>
                    </FormProvider>
                  </>
                )}
                {activeStep === 2 && (
                  <>
                    {filesAale ? (
                      <Paper>
                        {/* Documents Details  */}
                        <div
                          className={styles.fieldsStepper}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <DocumentUploadTable
                            appName='TP'
                            serviceName='PARTMAP'
                            rows={files}
                            rowUpdation={setFiles}
                            uploadAgain={uploadAgain}
                          />
                        </div>
                      </Paper>
                    ) : (
                      <Paper
                        className={styles.fieldsStepper}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          fontSize: 'larger',
                        }}
                      >
                        <span>Loading Document Table...</span>
                      </Paper>
                    )}

                    <div
                      className={styles.box}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <Button
                          color='primary'
                          variant='contained'
                          sx={{ marginRight: '2vw' }}
                          onClick={onBack}
                        >
                          <FormattedLabel id='exit' />
                        </Button>
                        <Button
                          color='primary'
                          variant='contained'
                          onClick={handleBack}
                          sx={{ mr: 1 }}
                        >
                          <FormattedLabel id='back' />
                        </Button>
                      </div>
                      {activeStep !== steps.length &&
                        router.query.pageMode === 'new' && (
                          <Button
                            color='primary'
                            variant='contained'
                            onClick={finalSubmit}
                          >
                            <FormattedLabel id='finish' />
                          </Button>
                        )}
                      {/* {activeStep !== steps.length &&
                          router.query.pageMode === 'view' && (
                            <Button
                              style={{ marginLeft: 800 }}
                              color='primary'
                              variant='contained'
                              onClick={handleNext}
                            >
                              <FormattedLabel id='next' />
                            </Button>
                          )} */}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Box>
      </Paper>
    </>
  )
}

export default View
