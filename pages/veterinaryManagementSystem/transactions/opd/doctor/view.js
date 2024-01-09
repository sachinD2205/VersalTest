import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from '../opd.module.css'

import {
  Paper,
  Button,
  MenuItem,
  Select,
  InputLabel,
  TextareaAutosize,
  InputAdornment,
  IconButton,
} from '@mui/material'
import {
  Add,
  Clear,
  Delete,
  Description,
  ExitToApp,
  Save,
  Search,
} from '@mui/icons-material'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from 'moment'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import axios from 'axios'
import URLs from '../../../../../URLS/urls'
import sweetAlert from 'sweetalert'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { sortByAsc } from '../../../../../containers/reuseableComponents/Sorter'
import UploadButton from '../../../../../containers/reuseableComponents/UploadButton'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import Breadcrumb from '../../../../../components/common/BreadcrumbComponent'
import Title from '../../../../../containers/VMS_ReusableComponents/Title'
import Loader from '../../../../../containers/Layout/components/Loader'
import { useGetToken } from '../../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()

  const [medicineDetails, setMedicineDetails] = useState([])
  const [caseHistory, setCaseHistory] = useState([])

  const [opdDropDown, setOpdDropDown] = useState([])
  const [areaDropDown, setAreaDropDown] = useState([])
  const [zoneDropDown, setZoneDropDown] = useState([])
  const [wardDropDown, setWardDropDown] = useState([])
  const [petAnimal, setPetAnimal] = useState([])
  const [petBreeds, setPetBreeds] = useState([])
  const [applicationData, setApplicationData] = useState({})
  const [animalPhotoOne, setAnimalPhotoOne] = useState('')
  const [animalPhotoTwo, setAnimalPhotoTwo] = useState('')
  const [animalPhotoThree, setAnimalPhotoThree] = useState('')
  const [specialInvestingationDocument, setSpecialInvestingationDocument] =
    useState('')
  const [loader, setLoader] = useState(false)

  let opdSchema = yup.object().shape({
    symptoms: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter the symptoms'
          : 'कृपया लक्षणे प्रविष्ट करा'
      ),
    dignosisDetails: yup.string(),
  })

  const {
    register,
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
    resolver: yupResolver(opdSchema),
  })

  useEffect(() => {
    setValue(
      'casePaperDate',
      moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    )

    //Get OPD
    axios
      .get(`${URLs.VMS}/mstOpd/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setOpdDropDown(
          res.data.mstOpdList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            opdEn: j.buildingName,
            opdMr: j.buildingNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Area
    axios
      .get(`${URLs.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAreaDropDown(
          res.data.area.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            areaEn: j.areaName,
            areaMr: j.areaNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Zone
    axios
      .get(`${URLs.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setZoneDropDown(
          res.data.zone.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Ward
    axios
      .get(`${URLs.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setWardDropDown(
          res.data.ward.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            wardEn: j.wardName,
            wardMr: j.wardNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetAnimal(() => {
          sortByAsc(res.data.mstPetAnimalList, 'nameEn')
          return res.data.mstPetAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            nameEn: j.nameEn,
            nameMr: j.nameMr,
          }))
        })
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Pet Breeds
    axios
      .get(`${URLs.VMS}/mstAnimalBreed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetBreeds(
          res.data.mstAnimalBreedList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            breedNameEn: j.breedNameEn,
            breedNameMr: j.breedNameMr,
            petAnimalKey: j.petAnimalKey,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    if (router.query.id) {
      setLoader(true)

      axios
        .get(`${URLs.VMS}/trnAnimalTreatment/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          const {
            paymentDao,
            paymentId,
            paymentKey,
            treatmentCategory,
            transactionDate,
            receiptNo,
            ipdKey,
            medicineDetails,
            digitalSignatureTreatment,
            digitalSignatureReceipt,
            aknowledgementSlipNo,
            accountGlCode,
            casePaperDate,
            medicineName,
            remark,
            days,
            dosage,
            opdNo,
            ...restData
          } = res.data

          reset({
            ...restData,
            dignosisDetails:
              res.data.dignosisDetails ?? watch('dignosisDetails'),
          })
          setApplicationData({ ...restData })
          setAnimalPhotoOne(res.data.photoOne)
          setAnimalPhotoTwo(res.data.photoTwo)
          setAnimalPhotoThree(res.data.photoThree)
          setSpecialInvestingationDocument(
            res.data.specialInvestingationDocument
          )

          if (res.data.status == 'Awaiting Payment') {
            setMedicineDetails(
              res.data?.opdMedicineDao.map((obj) => ({
                ...obj,
                medicineTakenDate: moment(obj.medicineTakenDate).format(
                  'YYYY-MM-DD'
                ),
                medicineTakenDateShow: moment(obj.medicineTakenDate).format(
                  'DD-MM-YYYY'
                ),
              }))
            )
          }

          if (res.data.casePaperNo) {
            getCaseHistory(res.data.casePaperNo)
          }
          setLoader(false)
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language)
          setLoader(false)
        })
    }
  }, [])

  useEffect(() => {
    reset({
      ...applicationData,
      symptoms:
        // @ts-ignore
        applicationData.symptoms ?? watch('symptoms'),
      dignosisDetails:
        // @ts-ignore
        applicationData.dignosisDetails ?? watch('dignosisDetails'),
    })
  }, [medicineDetails])

  const getOPDData = () => {
    console.log('Searching by Case No.: ', watch('casePaperNo'))

    axios
      .get(`${URLs.VMS}/trnAnimalTreatment/getById`, {
        params: { id: router.query.id },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        const { casePaperNo, ...rest } = res.data
        reset({ ...rest })
        setApplicationData({ ...rest })
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  // useEffect(() => {
  //   console.log('caseHistory: ', caseHistory)
  // }, [caseHistory])

  const getCaseHistory = (casePaperNo) => {
    axios
      .get(`${URLs.VMS}/trnAnimalTreatment/getOldByCasePaperNoAndId`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          casePaperNo,
          id: router.query.id,
        },
      })
      .then((res) => {
        if (res.data.trnAnimalTreatmentList.length > 0) {
          setCaseHistory(
            res.data.trnAnimalTreatmentList.map((j, i) => ({
              srNo: i + 1,
              date: moment(j.applicationDate).format('DD-MM-YYYY'),
              ...j,
            }))
          )
        }
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  const updateMedicineList = (rowData, action) => {
    console.log(rowData, action)

    if (action == 'delete') {
      setMedicineDetails(() => {
        // @ts-ignore
        return medicineDetails.filter((obj) => obj.id != rowData.id)
      })
    } else {
      // @ts-ignore
      setMedicineDetails((oldData) => {
        return [
          ...oldData,
          {
            ...rowData,
            // @ts-ignore
            id: (medicineDetails[medicineDetails.length - 1]?.id ?? 0) + 1,
          },
        ]
      })

      setSpecialInvestingationDocument('')

      let symptomValue = watch('symptoms')
      console.log('symptomValue: ', symptomValue)

      reset({
        medicineTakenDate: '',
        dignosisDetails: '',
        medicineName: '',
        days: '',
        dosage: '',
        remark: '',
      })
    }
  }

  const finalSubmit = (data) => {
    setLoader(true)

    const { medicineName, remark, days, dosage, ...finalData } = data

    let opdMedicineDao = medicineDetails.map((j) => {
      let { id, ...medicine } = j
      return { ...medicine }
    })

    axios
      .post(
        `${URLs.VMS}/trnAnimalTreatment/save`,
        {
          ...applicationData,
          // ...data,
          ...finalData,
          opdMedicineDao,
          specialInvestingationDocument,
          status: 'Awaiting Payment',
          activeFlag: 'Y',
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          setLoader(false)
          console.log('Success data: ', res.data)
          sweetAlert(
            language === 'en' ? 'Success' : 'यशस्वी झाले',
            language === 'en'
              ? 'Patient record updated successfully !'
              : 'रुग्णाचे रेकॉर्ड यशस्वीरित्या अपडेट झाले!',
            'success',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
          router.push(`/veterinaryManagementSystem/transactions/opd/doctor`)
        }
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
        setLoader(false)
      })
  }

  const caseHistoryColumns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 70,
    },
    {
      headerClassName: 'cellColor',

      field: 'date',
      headerAlign: 'center',
      headerName: <FormattedLabel id='date' />,
      width: 100,
    },
    {
      headerClassName: 'cellColor',

      field: 'symptoms',
      headerAlign: 'center',
      headerName: <FormattedLabel id='symptoms' />,
      minWidth: 300,
      flex: 0.5,
    },
    {
      headerClassName: 'cellColor',

      field: 'diagnosisDetails',
      headerAlign: 'center',
      headerName: <FormattedLabel id='diagnosisDetail' />,
      minWidth: 250,
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              margin: '10px 0px',
            }}
          >
            <b>
              {params.row?.opdMedicineDao
                .map((obj) =>
                  !!obj.diagnosisDetails
                    ? obj.diagnosisDetails
                    : language == 'en'
                    ? 'Diagnosis Not Found'
                    : 'निदान सापडले नाही'
                )
                .join(', ')}
            </b>
          </div>
        )
      },
    },
    {
      headerClassName: 'cellColor',

      field: 'prescription',
      headerAlign: 'center',
      headerName: <FormattedLabel id='prescription' />,
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Button
              variant='contained'
              endIcon={<Description />}
              onClick={() => {
                router.push({
                  pathname: `/veterinaryManagementSystem/transactions/prescription`,
                  query: { id: params.row.id, service: 'opd' },
                })
              }}
            >
              <FormattedLabel id='prescription' />
            </Button>
          </div>
        )
      },
    },
    {
      headerClassName: 'cellColor',

      field: 'specialDocuments',
      headerAlign: 'center',
      headerName: <FormattedLabel id='specialDoc' />,
      minWidth: 250,
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              margin: '10px 0px',
            }}
          >
            {params.row.opdMedicineDao.map((obj, index) => (
              <UploadButton
                key={index}
                appName='VMS'
                serviceName='PetLicense'
                filePath={obj.specialDocument}
                fileUpdater={() => {}}
                imageAndPDF
                view
                readOnly
              />
            ))}
          </div>
        )
      },
    },
  ]

  const medicineColumns = [
    {
      headerClassName: 'cellColor',

      field: 'medicineTakenDateShow',
      headerAlign: 'center',
      headerName: <FormattedLabel id='date' />,
      width: 100,
    },
    {
      headerClassName: 'cellColor',

      field: 'diagnosisDetails',
      headerAlign: 'center',
      headerName: <FormattedLabel id='diagnosisDetail' />,
      width: 250,
    },
    {
      headerClassName: 'cellColor',

      field: 'medicineName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='medicineOrInjection' />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'days',
      headerAlign: 'center',
      headerName: <FormattedLabel id='days' />,
      width: 120,
    },
    {
      headerClassName: 'cellColor',

      field: 'dosage',
      headerAlign: 'center',
      headerName: <FormattedLabel id='dosage' />,
      // width: 120,
      width: 120,
    },
    {
      headerClassName: 'cellColor',

      field: 'specialDocument',
      headerAlign: 'center',
      headerName: <FormattedLabel id='specialDoc' />,
      width: 180,
      renderCell: (params) => {
        return (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <UploadButton
              appName='VMS'
              serviceName='PetLicense'
              filePath={params.row.specialDocument}
              fileUpdater={() => {}}
              imageAndPDF
              view
              readOnly
            />
          </div>
        )
      },
    },
    {
      headerClassName: 'cellColor',

      field: 'remark',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='remark' />,
      width: 180,
    },
    {
      headerClassName: 'cellColor',

      field: 'actions',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 80,
      // @ts-ignore
      hide: applicationData.status == 'Initiated' ? false : true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: 'red' }}
              onClick={() => {
                updateMedicineList(params.row, 'delete')
              }}
            >
              <Delete />
            </IconButton>
          </>
        )
      },
    },
  ]

  return (
    <>
      <Head>
        <title>Treating sick and injured animals through OPD</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {loader && <Loader />}

        <Title titleLabel={<FormattedLabel id='opdHeading' />} />

        <form
          onSubmit={handleSubmit(finalSubmit)}
          style={{ padding: '5vh 3%' }}
        >
          <div className={styles.row}>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='casePaperNo' />}
              disabled={!!router.query.id}
              // @ts-ignore
              variant='standard'
              {...register('casePaperNo')}
              error={!!error.casePaperNo}
              // InputLabelProps={{ shrink: watch("casePaperNo") }}
              // InputProps={{
              //   endAdornment: (
              //     <InputAdornment position='end'>
              //       <IconButton
              //         disabled={router.query.id ? true : false}
              //         sx={{ color: '#1976D2' }}
              //         onClick={() => {
              //           getOPDData()
              //         }}
              //       >
              //         <Search />
              //       </IconButton>
              //     </InputAdornment>
              //   ),
              // }}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('casePaperNo'),
              }}
              helperText={error?.casePaperNo ? error.casePaperNo.message : null}
            />
          </div>
          <div className={styles.row}>
            <FormControl disabled variant='standard' error={!!error.opdKey}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='opd' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='opdKey'
                  >
                    {opdDropDown &&
                      opdDropDown.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {/* {language === 'en' ? obj.opdEn : obj.opdMr} */}
                          {obj.opdEn}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='opdKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.opdKey ? error.opdKey.message : null}
              </FormHelperText>
            </FormControl>

            <TextField
              disabled
              sx={{ width: '250px' }}
              label={<FormattedLabel id='licenseNo' />}
              // @ts-ignore
              variant='standard'
              {...register('licenseNo')}
              error={!!error.licenseNo}
              InputLabelProps={{
                shrink: router.query.id || watch('licenseNo') ? true : false,
              }}
              helperText={error?.licenseNo ? error.licenseNo.message : null}
            />
            <div style={{ width: '250px' }}></div>
          </div>
          <div className={styles.row}>
            {/* <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='ownerName' />}
              disabled
              // @ts-ignore
              //   value={router.query.id && applicationDetails.ownerFullName}
              variant='standard'
              {...register('ownerFullName')}
              error={!!error.ownerFullName}
              InputLabelProps={{
                shrink:
                  router.query.id || watch('ownerFullName') ? true : false,
              }}
              helperText={
                error?.ownerFullName ? error.ownerFullName.message : null
              }
            /> */}
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='fNameEn' />}
              disabled={!!router.query.id || registered}
              variant='standard'
              {...register('firstName')}
              error={!!error.firstName}
              InputLabelProps={{
                shrink: router.query.id || watch('firstName'),
              }}
              helperText={error?.firstName ? error.firstName.message : null}
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='mNameEn' />}
              disabled={!!router.query.id || registered}
              variant='standard'
              {...register('middleName')}
              error={!!error.middleName}
              InputLabelProps={{
                shrink: router.query.id || watch('middleName'),
              }}
              helperText={error?.middleName ? error.middleName.message : null}
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='lNameEn' />}
              disabled={!!router.query.id || registered}
              variant='standard'
              {...register('lastName')}
              error={!!error.lastName}
              InputLabelProps={{
                shrink: router.query.id || watch('lastName'),
              }}
              helperText={error?.lastName ? error.lastName.message : null}
            />
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='fNameMr' />}
              disabled={!!router.query.id || registered}
              variant='standard'
              {...register('firstNameMr')}
              error={!!error.firstNameMr}
              InputLabelProps={{
                shrink: router.query.id || watch('firstNameMr'),
              }}
              helperText={error?.firstNameMr ? error.firstNameMr.message : null}
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='mNameMr' />}
              disabled={!!router.query.id || registered}
              variant='standard'
              {...register('middleNameMr')}
              error={!!error.middleNameMr}
              InputLabelProps={{
                shrink: router.query.id || watch('middleNameMr'),
              }}
              helperText={
                error?.middleNameMr ? error.middleNameMr.message : null
              }
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='lNameMr' />}
              disabled={!!router.query.id || registered}
              variant='standard'
              {...register('lastNameMr')}
              error={!!error.lastNameMr}
              InputLabelProps={{
                shrink: router.query.id || watch('lastNameMr'),
              }}
              helperText={error?.lastNameMr ? error.lastNameMr.message : null}
            />
          </div>
          <div className={styles.row}>
            <TextField
              multiline
              sx={{ width: '250px' }}
              label={<FormattedLabel id='ownerAddress' />}
              disabled
              // @ts-ignore
              //   value={router.query.id && applicationDetails.ownerAddress}
              variant='standard'
              {...register('ownerAddress')}
              error={!!error.ownerAddress}
              InputLabelProps={{
                shrink: router.query.id || watch('ownerAddress') ? true : false,
              }}
              helperText={
                error?.ownerAddress ? error.ownerAddress.message : null
              }
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='emailId' />}
              disabled
              // @ts-ignore
              //   value={router.query.id && applicationDetails.emailAddress}
              variant='standard'
              {...register('emailAddress')}
              error={!!error.emailAddress}
              InputLabelProps={{
                shrink: router.query.id || watch('emailAddress') ? true : false,
              }}
              helperText={
                error?.emailAddress ? error.emailAddress.message : null
              }
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='mobileNo' />}
              disabled
              // @ts-ignore
              //   value={router.query.id && applicationDetails.mobileNumber}
              variant='standard'
              {...register('mobileNumber')}
              error={!!error.mobileNumber}
              InputLabelProps={{
                shrink: router.query.id || watch('mobileNumber') ? true : false,
              }}
              helperText={
                error?.mobileNumber ? error.mobileNumber.message : null
              }
            />
          </div>
          <div className={styles.row}>
            <FormControl disabled variant='standard' error={!!error.zoneKey}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='zone' />
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
                    label='zoneKey'
                  >
                    {zoneDropDown &&
                      zoneDropDown.map((value, index) => (
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
            <FormControl disabled variant='standard' error={!!error.wardKey}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='ward' />
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
                      wardDropDown.map((value, index) => (
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
            <FormControl disabled variant='standard' error={!!error.areaKey}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='area' />
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
                    label='areaKey'
                  >
                    {areaDropDown &&
                      areaDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={
                            //@ts-ignore
                            value.id
                          }
                        >
                          {language == 'en'
                            ? //@ts-ignore
                              value.areaEn
                            : // @ts-ignore
                              value?.areaMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='areaKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.areaKey ? error.areaKey.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div className={styles.subTitle}>
            <FormattedLabel id='animalDetails' />
          </div>
          <div className={styles.row}>
            <FormControl disabled variant='standard' error={!!error.animalName}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='petAnimal' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='animalName'
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === 'en' ? obj.nameEn : obj.nameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='animalName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.animalName ? error.animalName.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled
              sx={{ width: '250px' }}
              label={<FormattedLabel id='animalAge' />}
              // @ts-ignore
              variant='standard'
              {...register('animalAge')}
              error={!!error.animalAge}
              InputLabelProps={{
                shrink: router.query.id || watch('animalAge') ? true : false,
              }}
              helperText={error?.animalAge ? error.animalAge.message : null}
            />
            <FormControl disabled variant='standard' error={!!error.animalSex}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='animalGender' />
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
                    label='animalSex'
                  >
                    <MenuItem key={1} value={'M'}>
                      {language === 'en' ? 'Male' : 'पुरुष'}
                    </MenuItem>
                    <MenuItem key={2} value={'F'}>
                      {language === 'en' ? 'Female' : 'स्त्री'}
                    </MenuItem>
                  </Select>
                )}
                name='animalSex'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.animalSex ? error.animalSex.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <FormControl
              disabled
              variant='standard'
              error={!!error.animalSpeciesKey}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='animalBreed' />
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
                    label='animalSpeciesKey'
                  >
                    {petBreeds &&
                      petBreeds
                        .filter((obj) => {
                          //   return obj.petAnimalKey == router.query.petAnimal;
                          return obj.petAnimalKey == watch('animalName')
                        })
                        .map((obj, index) => (
                          <MenuItem key={index} value={obj.id}>
                            {language === 'en'
                              ? obj.breedNameEn
                              : obj.breedNameMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name='animalSpeciesKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.animalSpeciesKey
                  ? error.animalSpeciesKey.message
                  : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled
              sx={{ width: '250px' }}
              label={<FormattedLabel id='animalColor' />}
              // @ts-ignore
              variant='standard'
              {...register('animalColour')}
              error={!!error.animalColour}
              InputLabelProps={{
                shrink: router.query.id || watch('animalColour') ? true : false,
              }}
              helperText={
                error?.animalColour ? error.animalColour.message : null
              }
            />
            <div style={{ width: '250px' }}></div>
          </div>

          <div className={styles.row}>
            <UploadButton
              appName='VMS'
              serviceName='PetLicense'
              // @ts-ignore
              label={<FormattedLabel id='animalPhotoOne' />}
              filePath={animalPhotoOne}
              fileUpdater={setAnimalPhotoOne}
              view={router.query.id ? true : false}
              onlyImage
              readOnly
            />
            <UploadButton
              appName='VMS'
              serviceName='PetLicense'
              // @ts-ignore
              label={<FormattedLabel id='animalPhotoTwo' />}
              filePath={animalPhotoTwo}
              fileUpdater={setAnimalPhotoTwo}
              view={router.query.id ? true : false}
              onlyImage
              readOnly
            />
            <UploadButton
              appName='VMS'
              serviceName='PetLicense'
              // @ts-ignore
              label={<FormattedLabel id='animalPhotoThree' />}
              filePath={animalPhotoThree}
              fileUpdater={setAnimalPhotoThree}
              view={router.query.id ? true : false}
              onlyImage
              readOnly
            />
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id='caseHistory' />
          </div>
          <div style={{ display: 'grid', placeItems: 'center' }}>
            {caseHistory?.length > 0 ? (
              <DataGrid
                getRowHeight={() => 'auto'}
                autoHeight
                sx={{
                  marginTop: '5vh',
                  // width: '65%',
                  width: '100%',

                  '& .cellColor': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  },
                }}
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
                rows={caseHistory}
                //@ts-ignore
                columns={caseHistoryColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            ) : (
              <h2 style={{ marginTop: 20, marginBottom: 0 }}>
                <FormattedLabel id='noCaseHistory' />
              </h2>
            )}
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id='treatment' />
          </div>
          {/* <div className={styles.row} style={{ justifyContent: "center" }}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="casePaperNo" />}
              disabled={router.query.id ? true : false}
              // @ts-ignore
              variant="standard"
              {...register("casePaperNo")}
              error={!!error.casePaperNo}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{ color: "#1976D2" }}
                      onClick={() => {
                        getOPDData();
                      }}
                    >
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              // InputLabelProps={{
              //   shrink: router.query.id || watch("casePaperNo") ? true : false,
              // }}
              helperText={error?.casePaperNo ? error.casePaperNo.message : null}
            />
            <FormControl error={!!error.casePaperDate}>
              <Controller
                control={control}
                name="casePaperDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disabled={router.query.id ? true : false}
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="casePaperDate" />}
                      // @ts-ignore
                      value={field.value}
                      onChange={(date) => field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "250px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{error?.casePaperDate ? error.casePaperDate.message : null}</FormHelperText>
            </FormControl>
            <div style={{ width: "250px" }}></div>
          </div> */}
          {/* <div className={styles.row}>
            <TextField
              sx={{ width: "250px" }}
              label={<FormattedLabel id="aknowledgementSlipNo" />}
              // @ts-ignore
              variant="standard"
              {...register("aknowledgementSlipNo")}
              error={!!error.aknowledgementSlipNo}
              InputLabelProps={{
                shrink: router.query.id || watch("aknowledgementSlipNo") ? true : false,
              }}
              helperText={error?.aknowledgementSlipNo ? error.aknowledgementSlipNo.message : null}
            />
            <FormControl
              disabled={router.query.id ? true : false}
              variant="standard"
              error={!!error.treatmentCategory}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="treatmentCategory" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="treatmentCategory"
                  >
                    <MenuItem key={1} value={"firstAid"}>
                      {language === "en" ? "First Aid" : "प्रथमोपचार"}
                    </MenuItem>
                    <MenuItem key={2} value={"minorSurgery"}>
                      {language === "en" ? "Minor Surgery" : "किरकोळ शस्त्रक्रिया"}
                    </MenuItem>
                  </Select>
                )}
                name="treatmentCategory"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {error?.treatmentCategory ? error.treatmentCategory.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.transactionDate}>
              <Controller
                control={control}
                name="transactionDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disabled
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="transactionDate" />}
                      // @ts-ignore
                      value={field.value}
                      onChange={(date) => field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: "250px" }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>{error?.transactionDate ? error.transactionDate.message : null}</FormHelperText>
            </FormControl>
          </div> */}

          <div className={styles.row}>
            <span
              style={{
                opacity:
                  // @ts-ignore
                  applicationData.status != 'Initiated' ? 0.5 : 1,
              }}
            >
              <FormattedLabel id='symptoms' /> :
            </span>
            {/* @ts-ignore */}
            <TextareaAutosize
              color='neutral'
              style={{
                // @ts-ignore
                opacity: applicationData.status != 'Initiated' ? 0.5 : 1,
              }}
              // @ts-ignore
              disabled={applicationData.status != 'Initiated' ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === 'en' ? 'Symptoms' : 'लक्षणं'}
              className={styles.bigText}
              {...register('symptoms')}
            />
          </div>
          {
            // @ts-ignore
            applicationData.status == 'Initiated' && (
              <div className={styles.row}>
                <span
                  style={{
                    opacity:
                      // @ts-ignore
                      applicationData.status != 'Initiated' ? 0.5 : 1,
                  }}
                >
                  <FormattedLabel id='diagnosisDetail' /> :
                </span>
                <div className={styles.diagnosisDetails}>
                  {/* @ts-ignore */}
                  <TextareaAutosize
                    color='neutral'
                    style={{
                      // @ts-ignore
                      opacity: applicationData.status != 'Initiated' ? 0.5 : 1,
                      width: '100%',
                    }}
                    disabled={
                      // @ts-ignore
                      applicationData.status != 'Initiated' ? true : false
                    }
                    minRows={3}
                    maxRows={5}
                    placeholder={
                      language === 'en'
                        ? 'Tentative Diagnosis Details'
                        : 'तात्पुरते निदान तपशील'
                    }
                    className={styles.bigText}
                    {...register('dignosisDetails')}
                  />
                  {
                    // @ts-ignore
                    applicationData.status == 'Initiated' && (
                      <UploadButton
                        appName='VMS'
                        serviceName='PetLicense'
                        addFileText={{
                          en: 'Upload Special Investigation Document',
                          mr: 'विशेष तपास दस्तऐवज अपलोड करा',
                        }}
                        filePath={specialInvestingationDocument}
                        fileUpdater={setSpecialInvestingationDocument}
                        imageAndPDF
                      />
                    )
                  }
                </div>
              </div>
            )
          }
          <div
            className={styles.row}
            style={{
              fontSize: 'larger',
              fontWeight: 'bold',
              marginBottom: 0,
              justifyContent: 'center',
              textTransform: 'uppercase',
            }}
          >
            <span>
              <FormattedLabel id='caseDetails' /> :
            </span>
          </div>
          {
            // @ts-ignore
            (applicationData.status == 'Initiated' ||
              // @ts-ignore
              applicationData.status == 'Under Treatment') && (
              <>
                <div className={styles.row} style={{ alignItems: 'center' }}>
                  <FormControl error={!!error.medicineTakenDate}>
                    {/* @ts-ignore */}
                    <Controller
                      control={control}
                      name='medicineTakenDate'
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            inputFormat='dd/MM/yyyy'
                            label={<FormattedLabel id='date' />}
                            value={field.value}
                            onChange={(date) => field.onChange(date)}
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: '200px' }}
                                {...params}
                                size='small'
                                fullWidth
                                variant='standard'
                                error={!!error.medicineTakenDate}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {error?.medicineTakenDate
                        ? error.medicineTakenDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>

                  <TextField
                    sx={{ width: '200px' }}
                    label={<FormattedLabel id='medicineOrInjection' />}
                    // @ts-ignore
                    variant='standard'
                    {...register('medicineName')}
                    error={!!error.medicineName}
                    helperText={
                      error?.medicineName ? error.medicineName.message : null
                    }
                  />
                  <TextField
                    sx={{ width: '200px' }}
                    label={<FormattedLabel id='days' />}
                    // @ts-ignore
                    variant='standard'
                    {...register('days')}
                    error={!!error.days}
                    InputLabelProps={{ shrink: !!watch('days') }}
                    helperText={error?.days ? error.days.message : null}
                  />
                  <TextField
                    sx={{ width: '200px' }}
                    label={<FormattedLabel id='dosage' />}
                    // @ts-ignore
                    variant='standard'
                    {...register('dosage')}
                    error={!!error.dosage}
                    helperText={error?.dosage ? error.dosage.message : null}
                  />
                  <TextField
                    sx={{ width: '200px' }}
                    label={<FormattedLabel id='remark' />}
                    // @ts-ignore
                    variant='standard'
                    {...register('remark')}
                    error={!!error.remark}
                    helperText={error?.remark ? error.remark.message : null}
                  />
                </div>
                <div
                  className={styles.row}
                  style={{ justifyContent: 'center' }}
                >
                  <Button
                    disabled={watch('medicineTakenDate') == null ? true : false}
                    variant='contained'
                    endIcon={<Add />}
                    onClick={() => {
                      updateMedicineList(
                        {
                          medicineTakenDate: moment(
                            watch('medicineTakenDate')
                          ).format('YYYY-MM-DD'),
                          medicineTakenDateShow: moment(
                            watch('medicineTakenDate')
                          ).format('DD-MM-YYYY'),
                          diagnosisDetails: watch('dignosisDetails'),
                          medicineName: watch('medicineName'),
                          days: Number(watch('days')),
                          dosage: watch('dosage'),
                          specialDocument: specialInvestingationDocument,
                          remark: watch('remark'),
                        },
                        'add'
                      )
                    }}
                  >
                    <FormattedLabel id='add' />
                  </Button>
                </div>
              </>
            )
          }
          <div className={styles.row} style={{ justifyContent: 'center' }}>
            <DataGrid
              autoHeight
              sx={{
                '& .cellColor': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                },
              }}
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
              rows={medicineDetails}
              //@ts-ignore
              columns={medicineColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
          {/* <div className={styles.row}>
            <div className={styles.column}>
              <span style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1, marginBottom: 20 }}>
                <FormattedLabel id="diagnosisDetail" /> :
              </span>
              <TextareaAutosize
                color="neutral"
                style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1 }}
                disabled={applicationData.status != "Initiated" ? true : false}
                minRows={8}
                maxRows={8}
                // placeholder={language === "en" ? "Medicine Details" : "औषध तपशील"}
                placeholder={language === "en" ? "Diagnosis Details" : "निदान तपशील"}
                className={styles.bigText}
                {...register("dignosisDetails")}
              />
            </div>
            <div className={styles.column}>
              <span style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1, marginBottom: 20 }}>
                <FormattedLabel id="medicineDetails" /> :
              </span>
              <DataGrid
                autoHeight
                sx={{
                  // marginTop: "5vh",
                  width: "100%",

                  "& .cellColor": {
                    backgroundColor: "#1976d2",
                    color: "white",
                  },
                  "& .redText": {
                    color: "red",
                  },
                  "& .orangeText": {
                    color: "orange",
                  },
                  "& .greenText": {
                    color: "green",
                  },
                  "& .blueText": {
                    color: "blue",
                  },
                }}
                getCellClassName={(params) => {
                  if (params.field === "status" && params.value == "Initiated") {
                    return "orangeText";
                  } else if (params.field === "status" && params.value == "Awaiting Payment") {
                    return "greenText";
                  } else if (params.field === "status" && params.value == "Payment Successful") {
                    return "blueText";
                  } else {
                    return "";
                  }
                }}
                rows={medicineDetails}
                //@ts-ignore
                columns={medicineColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </div>
          </div> */}

          {/* <div className={styles.row}>
            <span
              style={{
                opacity:
                  // @ts-ignore
                  applicationData.status != 'Initiated' ? 0.5 : 1,
              }}
            >
              <FormattedLabel id='specialInvestingationDescription' /> :
            </span>
            <TextareaAutosize
              color='neutral'
              style={{
                // @ts-ignore
                opacity: applicationData.status != 'Initiated' ? 0.5 : 1,
              }}
              // @ts-ignore
              disabled={applicationData.status != 'Initiated' ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={
                language === 'en'
                  ? 'Special Investigation Description'
                  : 'विशेष अन्वेषण वर्णन'
              }
              className={styles.bigText}
              {...register('specialInvestingationDescription')}
            />
          </div> */}

          {/* <div className={styles.row}>
            {applicationData.status == 'Initiated' ? (
              <UploadButton
                appName='VMS'
                serviceName='PetLicense'
                // @ts-ignore
                label={<FormattedLabel id='specialInvestingationDocument' />}
                filePath={specialInvestingationDocument}
                fileUpdater={setSpecialInvestingationDocument}
                imageAndPDF
              />
            ) : (
              <>
                {specialInvestingationDocument == '' ||
                specialInvestingationDocument == null ? (
                  <span style={{ fontSize: 'medium', fontWeight: 'bold' }}>
                    <FormattedLabel id='noSpecialInvestigationDocumentAttached' />
                  </span>
                ) : (
                  <UploadButton
                    appName='VMS'
                    serviceName='PetLicense'
                    // @ts-ignore
                    label={
                      <FormattedLabel id='specialInvestingationDocument' />
                    }
                    filePath={specialInvestingationDocument}
                    fileUpdater={setSpecialInvestingationDocument}
                    view
                    imageAndPDF
                  />
                )}
              </>
            )}
          </div> */}

          <div className={styles.buttons}>
            {
              // @ts-ignore
              applicationData.status === 'Initiated' && (
                <Button
                  variant='contained'
                  type='submit'
                  color='success'
                  endIcon={<Save />}
                >
                  <FormattedLabel id='save' />
                </Button>
              )
            }
            {/* <Button variant="outlined" color="error" endIcon={<Clear />}>
              <FormattedLabel id="clear" />
            </Button> */}
            <Button
              variant='contained'
              color='error'
              onClick={() => {
                router.push(
                  `/veterinaryManagementSystem/transactions/opd/doctor`
                )
              }}
              endIcon={<ExitToApp />}
            >
              <FormattedLabel id='exit' />
            </Button>
          </div>
        </form>
      </Paper>
    </>
  )
}

export default Index
