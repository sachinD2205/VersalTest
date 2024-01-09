import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import URLs from '../../../../../URLS/urls'

import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TextareaAutosize,
} from '@mui/material'
import styles from '../ipd.module.css'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import {
  Add,
  Delete,
  Description,
  ExitToApp,
  Payment,
  Save,
} from '@mui/icons-material'
import moment from 'moment'
import { useSelector } from 'react-redux'
import UploadButton from '../../../../../containers/reuseableComponents/UploadButton'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DataGrid } from '@mui/x-data-grid'
import Breadcrumb from '../../../../../components/common/BreadcrumbComponent'
import Title from '../../../../../containers/VMS_ReusableComponents/Title'
import Loader from '../../../../../containers/Layout/components/Loader'
import { useGetToken } from '../../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../../util/util'

const View = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()

  const [ipdDropDown, setIpdDropDown] = useState([])
  const [petAnimal, setPetAnimal] = useState([])
  const [petBreeds, setPetBreeds] = useState([])
  const [allData, setAllData] = useState({})

  const [treatmentStatus, setTreatmentStatus] = useState('Under Treatment')
  // const [animalPhoto, setAnimalPhoto] = useState('')
  const [dischargeDoc, setDischargeDoc] = useState('')
  const [animalPhotoOne, setAnimalPhotoOne] = useState('')
  const [animalPhotoTwo, setAnimalPhotoTwo] = useState('')
  const [animalPhotoThree, setAnimalPhotoThree] = useState('')
  const [nameType, setNameType] = useState('')

  const [medicineDetails, setMedicineDetails] = useState([])
  const [existingMedicineDetails, setExistingMedicineDetails] = useState([])
  const [newMedicineDetails, setNewMedicineDetails] = useState([])
  const [specialInvestingationDocument, setSpecialInvestingationDocument] =
    useState('')
  const [loader, setLoader] = useState(false)

  const animalTreatmentSchema = yup.object().shape({
    ipdKey: yup
      .number()
      .required()
      .typeError(
        language === 'en' ? 'Please select an IPD' : 'कृपया एक IPD निवडा'
      ),
    // ownerFullName: yup.string().required("Please enter owner's full name"),
    animalName: yup
      .string()
      .required()
      .typeError(
        language === 'en' ? 'Please select an animal' : 'कृपया एक प्राणी निवडा'
      ),

    animalSpeciesKey: yup
      .number()
      .required(
        language === 'en' ? 'Please select a breed' : 'कृपया एक जात निवडा'
      )
      .typeError(
        language === 'en' ? 'Please select a breed' : 'कृपया एक जात निवडा'
      ),
    // animalColour: yup
    //   .string()
    //   .required()
    //   .typeError(
    //     language === 'en' ? 'Please enter the color' : 'कृपया रंग प्रविष्ट करा'
    //   ),
    symptoms: yup
      .string()
      .required()
      .typeError(
        language === 'en'
          ? 'Please enter the symptoms'
          : 'कृपया लक्षणे प्रविष्ट करा'
      ),
    dischargeDate: yup.string().when('additionalDocRequired', {
      is: true,
      then: yup
        .string()
        .required(
          language === 'en'
            ? `Please enter date of ${
                treatmentStatus == 'Dead' ? 'death' : 'release'
              }`
            : `कृपया ${
                treatmentStatus == 'Dead' ? 'मृत्यूची' : 'सोडण्याची'
              } तारीख प्रविष्ट करा`
        )
        .typeError(
          language === 'en'
            ? `Please enter date of ${
                treatmentStatus == 'Dead' ? 'death' : 'release'
              }`
            : `कृपया ${
                treatmentStatus == 'Dead' ? 'मृत्यूची' : 'सोडण्याची'
              } तारीख प्रविष्ट करा`
        ),
      otherwise: yup.string().nullable(),
    }),
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(animalTreatmentSchema),
  })

  useEffect(() => {
    setValue(
      'additionalDocRequired',
      ['Dead', 'Released'].includes(treatmentStatus)
    )

    !!error.dischargeDate?.message &&
      setError('dischargeDate', {
        message:
          language === 'en'
            ? `Please enter date of ${
                treatmentStatus == 'Dead' ? 'death' : 'release'
              }`
            : `कृपया ${
                treatmentStatus == 'Dead' ? 'मृत्यूची' : 'सोडण्याची'
              } तारीख प्रविष्ट करा`,
      })
  }, [treatmentStatus])

  useEffect(() => {
    if (!router.query.id) {
      setValue('receiptDate', moment(new Date()).format('YYYY-MM-DD'))
      setValue('narration', 'IPD Registration')
    }

    //Get IPD
    axios
      .get(`${URLs.VMS}/mstIpd/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setIpdDropDown(
          res.data.mstIpdList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            ipdEn: j.ipdName,
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
        setPetAnimal(
          res.data.mstPetAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            nameEn: j.nameEn,
            nameMr: j.nameMr,
          }))
        )
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
  }, [])

  useEffect(() => {
    if (
      router.query.id &&
      router.query.id &&
      petAnimal?.length > 0 &&
      petBreeds?.length > 0 &&
      ipdDropDown?.length > 0
    ) {
      setLoader(true)

      axios
        .get(`${URLs.VMS}/trnAnimalTreatmentIpd/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          setAllData({ ...res.data })
          reset({ ...res.data })
          setNameType(res.data.volunteerName ? 'volunteer' : 'team')
          setAnimalPhotoOne(res.data.photoOne ?? '')
          setAnimalPhotoTwo(res.data.photoTwo ?? '')
          setAnimalPhotoThree(res.data.photoThree ?? '')
          setDischargeDoc(res.data.dischargeDoc ?? '')
          setSpecialInvestingationDocument(
            res.data.specialInvestingationDocument
          )

          if (res.data.status !== 'Initiated') {
            setExistingMedicineDetails(
              res.data?.ipdMedicineDao.map((obj) => ({
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
          setLoader(false)
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language)
          setLoader(false)
        })
    }
  }, [petBreeds, petAnimal])

  useEffect(() => {
    let existingMeds = existingMedicineDetails.map((obj) => {
      return {
        // @ts-ignore
        ...obj,
        new: false,
      }
    })
    let newMeds = newMedicineDetails.map((obj) => {
      return {
        // @ts-ignore
        ...obj,
        new: true,
      }
    })
    // @ts-ignore
    setMedicineDetails([...existingMeds, ...newMeds])
  }, [existingMedicineDetails, newMedicineDetails])

  useEffect(() => {
    reset({
      ...allData,
      symptoms: watch('symptoms') ?? '',
      // @ts-ignore
      dignosisDetails: allData.dignosisDetails ?? watch('dignosisDetails'),
    })
  }, [medicineDetails])

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
      hide:
        // @ts-ignore
        allData.status == 'Initiated' || allData.status == 'Under Treatment'
          ? false
          : true,
      renderCell: (params) => {
        return (
          <>
            {params.row.new && (
              <IconButton
                sx={{ color: 'red' }}
                onClick={() => {
                  updateMedicineList(params.row, 'delete')
                }}
              >
                <Delete />
              </IconButton>
            )}
          </>
        )
      },
    },
  ]

  const updateMedicineList = (rowData, action) => {
    if (action == 'delete') {
      setNewMedicineDetails(() => {
        // @ts-ignore
        return newMedicineDetails.filter((obj) => obj.id != rowData.id)
      })
    } else {
      // @ts-ignore
      setNewMedicineDetails((oldData) => {
        return [
          ...oldData,
          {
            ...rowData,
            remark: rowData.remark ?? '',
            id:
              // @ts-ignore
              (newMedicineDetails[newMedicineDetails.length - 1]?.id ?? 0) + 1,
          },
        ]
      })

      setSpecialInvestingationDocument('')
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
    let ipdMedicineDao = newMedicineDetails.map((j) => {
      let { id, ...medicine } = j
      return { ...medicine }
    })

    let finalBody = {}

    // @ts-ignore
    if (
      allData?.status == 'Initiated' ||
      treatmentStatus == 'Under Treatment'
    ) {
      finalBody = {
        ...data,
        ipdMedicineDao,
        specialInvestingationDocument,
        status: treatmentStatus,
      }
    } else {
      finalBody = {
        ...data,
        specialInvestingationDocument,
        dischargeDoc,
        dischargeDate: watch('dischargeDate'),
        status: treatmentStatus,
      }
    }

    if (['Dead', 'Released'].includes(treatmentStatus)) {
      if (!!dischargeDoc) {
        console.log('111')

        sweetAlert({
          title: language === 'en' ? 'Confirmation' : 'पुष्टीकरण',
          text:
            language === 'en'
              ? 'Are you sure you want to submit the application ?'
              : 'तुमची खात्री आहे की तुम्ही अर्ज सबमिट करू इच्छिता?',
          icon: 'warning',
          buttons:
            language == 'en' ? ['Cancel', 'Save'] : ['रद्द करा', 'जतन करा'],
        }).then((ok) => {
          if (ok) {
            setLoader(true)

            axios
              .post(`${URLs.VMS}/trnAnimalTreatmentIpd/save`, finalBody, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                if (res.status == 200 || res.status == 201) {
                  sweetAlert(
                    language === 'en' ? 'Success' : 'यशस्वी झाले',
                    language === 'en'
                      ? 'Patient record saved successfully !'
                      : 'पेशंटचे रेकॉर्ड यशस्वीरित्या जतन केले',
                    'success',
                    { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
                  )
                  router.push(
                    `/veterinaryManagementSystem/transactions/animalTreatment/doctor`
                  )
                }
                setLoader(false)
              })
              .catch((error) => {
                catchExceptionHandlingMethod(error, language)
                setLoader(false)
              })
          }
        })
      } else {
        console.log('222')

        sweetAlert({
          title: language == 'en' ? 'Warning' : 'चेतावणी',
          text:
            language == 'en'
              ? 'Please upload certificate'
              : 'कृपया प्रमाणपत्र अपलोड करा',
          icon: 'warning',
          buttons:
            language == 'en' ? ['Cancel', 'Save'] : ['रद्द करा', 'जतन करा'],
        })
      }
    } else {
      console.log('333')
      sweetAlert({
        title: language === 'en' ? 'Confirmation' : 'पुष्टीकरण',
        text:
          language === 'en'
            ? 'Are you sure you want to submit the application ?'
            : 'तुमची खात्री आहे की तुम्ही अर्ज सबमिट करू इच्छिता?',
        icon: 'warning',
        buttons: [
          language === 'en' ? 'Cancel' : 'रद्द करा',
          language === 'en' ? 'Save' : 'जतन करा',
        ],
      }).then((ok) => {
        if (ok) {
          setLoader(true)

          axios
            .post(`${URLs.VMS}/trnAnimalTreatmentIpd/save`, finalBody, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                sweetAlert(
                  language === 'en' ? 'Success' : 'यशस्वी झाले',
                  language === 'en'
                    ? 'Patient record saved successfully !'
                    : 'पेशंटचे रेकॉर्ड यशस्वीरित्या जतन केले',
                  'success',
                  { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
                )
                router.push(
                  `/veterinaryManagementSystem/transactions/animalTreatment/doctor`
                )
              }
              setLoader(false)
            })
            .catch((error) => {
              catchExceptionHandlingMethod(error, language)
              setLoader(false)
            })
        }
      })
    }
  }

  return (
    <>
      <Head>
        <title>Treating sick and injured animal through IPD</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='ipdHeading' />} />
        {loader && <Loader />}

        <form
          onSubmit={handleSubmit(finalSubmit)}
          style={{ padding: '5vh 3%' }}
        >
          <div className={styles.row}>
            <FormControl
              disabled={router.query.id ? true : false}
              variant='standard'
              error={!!error.ipdKey}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='ipdName' />
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
                    label='IpdKey'
                  >
                    {ipdDropDown &&
                      ipdDropDown.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
                          {language === 'en' ? obj.ipdEn : obj.ipdMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='ipdKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.ipdKey ? error.ipdKey.message : null}
              </FormHelperText>
            </FormControl>

            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id='complainerName' />}
              disabled={router.query.id ? true : false}
              variant='standard'
              {...register('complainerName')}
              error={!!error.complainerName}
              InputLabelProps={{
                shrink:
                  router.query.id || watch('complainerName') ? true : false,
              }}
              helperText={
                error?.complainerName ? error.complainerName.message : null
              }
            />
            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id='complainerAddress' />}
              disabled={router.query.id ? true : false}
              variant='standard'
              {...register('complainerAddress')}
              error={!!error.complainerAddress}
              InputLabelProps={{
                shrink:
                  router.query.id || watch('complainerAddress') ? true : false,
              }}
              helperText={
                error?.complainerAddress
                  ? error.complainerAddress.message
                  : null
              }
            />
            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id='complainerMobileNo' />}
              disabled={router.query.id ? true : false}
              variant='standard'
              {...register('complainerMobileNo')}
              error={!!error.complainerMobileNo}
              InputLabelProps={{
                shrink:
                  router.query.id || watch('complainerMobileNo') ? true : false,
              }}
              helperText={
                error?.complainerMobileNo
                  ? error.complainerMobileNo.message
                  : null
              }
            />
          </div>
          <div className={styles.row}>
            {nameType == 'team' && (
              <TextField
                sx={{ width: 250 }}
                // label={<FormattedLabel id="ownerName" />}
                label={<FormattedLabel id='teamName' />}
                disabled={router.query.id ? true : false}
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
              />
            )}
            {nameType == 'volunteer' && (
              <TextField
                sx={{ width: 250 }}
                label={<FormattedLabel id='volunteerName' />}
                disabled={router.query.id ? true : false}
                variant='standard'
                {...register('volunteerName')}
                error={!!error.volunteerName}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch('volunteerName') ? true : false,
                }}
                helperText={
                  error?.volunteerName ? error.volunteerName.message : null
                }
              />
            )}
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id='animalDetails' />
          </div>

          <div className={styles.row}>
            <FormControl
              disabled={router.query.id ? true : false}
              variant='standard'
              error={!!error.animalName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='petAnimal' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      setValue(
                        'animalSpeciesKey',
                        petBreeds
                          .filter((obj) => {
                            return obj.petAnimalKey == watch('animalName')
                          })
                          .find((obj) => obj.breedNameEn == 'Non Descript')?.id
                      )
                    }}
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
            <FormControl
              // disabled={router.query.id || !watch('animalName') ? true : false}
              disabled
              variant='standard'
              error={!!error.animalSpeciesKey}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='animalBreed' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
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
            <FormControl
              disabled={router.query.id ? true : false}
              variant='standard'
              error={!!error.animalSex}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='animalGender' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
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
            {/* <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: "200px" }}
              label={<FormattedLabel id="animalAge" />}
              // @ts-ignore
              variant="standard"
              {...register("animalAge")}
              error={!!error.animalAge}
              InputLabelProps={{
                shrink: router.query.id || watch("animalAge") ? true : false,
              }}
              helperText={error?.animalAge ? error.animalAge.message : null}
            /> */}
            <TextField
              disabled={router.query.id ? true : false}
              sx={{ width: 250 }}
              label={<FormattedLabel id='animalColor' />}
              // @ts-ignore
              variant='standard'
              {...register('animalColour')}
              error={!!error.animalColour}
              InputLabelProps={{
                // shrink: router.query.id || watch('animalColour') ? true : false,
                shrink: watch('animalColour') ? true : false,
              }}
              helperText={
                error?.animalColour ? error.animalColour.message : null
              }
            />
          </div>

          <div className={styles.row}>
            {/* <UploadButton
              appName='VMS'
              serviceName='PetLicense'
              label={<FormattedLabel id='animalPhoto' />}
              filePath={animalPhoto}
              fileUpdater={setAnimalPhoto}
              view
              onlyImage
            /> */}

            <UploadButton
              appName='VMS'
              serviceName='PetLicense'
              // @ts-ignore
              label={<FormattedLabel id='animalPhotoOne' />}
              filePath={animalPhotoOne}
              fileUpdater={setAnimalPhotoOne}
              view={router.query.id ? true : false}
              onlyImage
              readOnly={!!router.query.id}
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
              readOnly={!!router.query.id}
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
              readOnly={!!router.query.id}
            />
            <div style={{ width: 250 }}></div>
          </div>

          <div className={styles.row}>
            <TextField
              disabled
              sx={{ width: 250 }}
              label={<FormattedLabel id='kennelNo' />}
              // @ts-ignore
              variant='standard'
              {...register('kennelNo')}
              error={!!error.kennelNo}
              InputLabelProps={{
                shrink: router.query.id || watch('kennelNo') ? true : false,
              }}
              helperText={error?.kennelNo ? error.kennelNo.message : null}
            />
          </div>

          <div className={styles.subTitle}>
            <FormattedLabel id='treatment' />
          </div>

          <div className={styles.row}>
            <FormControl error={!!error.pickupDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='pickupDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disabled
                      inputFormat='dd-MM-yyyy'
                      label={<FormattedLabel id='pickupDate' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 250 }}
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
                {error?.pickupDate ? error.pickupDate.message : null}
              </FormHelperText>
            </FormControl>
            <div style={{ width: '75%' }}>
              <span style={{ opacity: 0.5 }}>
                <FormattedLabel id='reasonForPickUp' /> :
              </span>
              <TextareaAutosize
                style={{ opacity: 0.5 }}
                color='neutral'
                disabled={true}
                minRows={3}
                maxRows={5}
                placeholder={
                  language === 'en' ? 'Reason For Picking Up' : 'आणण्याचे कारण'
                }
                className={styles.bigText}
                {...register('reasonforPick')}
              />
            </div>
            {/* <span style={{ opacity: 0.5 }}>
              <FormattedLabel id='reasonForPickUp' /> :
            </span>
            <TextareaAutosize
              style={{ opacity: 0.5 }}
              color='neutral'
              disabled
              minRows={3}
              maxRows={5}
              placeholder={
                language === 'en' ? 'Reason For Picking Up' : 'आणण्याचे कारण'
              }
              className={styles.bigText}
              {...register('reasonforPick')}
            />*/}
          </div>

          <div className={styles.row}>
            <span
              // @ts-ignore
              style={{
                opacity:
                  // @ts-ignore
                  allData.status == 'Dead' || allData.status == 'Released'
                    ? 0.5
                    : 1,
                color: !!error.symptoms?.message ? 'red' : 'black',
              }}
            >
              <FormattedLabel id='symptoms' required /> :
            </span>
            {/* @ts-ignore */}
            <TextareaAutosize
              color='neutral'
              // @ts-ignore
              style={{
                opacity:
                  // @ts-ignore
                  allData.status == 'Dead' || allData.status == 'Released'
                    ? 0.5
                    : 1,
                borderColor: !!error.symptoms?.message ? 'red' : 'black',
              }}
              disabled={
                // @ts-ignore
                allData.status == 'Dead' || allData.status == 'Released'
              }
              minRows={3}
              maxRows={5}
              placeholder={language === 'en' ? 'Symptoms' : 'लक्षणं'}
              className={styles.bigText}
              {...register('symptoms')}
            />
          </div>
          {allData.status != 'Dead' && allData.status != 'Released' && (
            <div className={styles.row}>
              <span
                style={{
                  opacity:
                    // @ts-ignore
                    allData.status == 'Dead' || allData.status == 'Released'
                      ? 0.5
                      : 1,
                }}
              >
                <FormattedLabel id='diagnosisDetail' /> :
              </span>
              <div className={styles.diagnosisDetails}>
                {/* @ts-ignore */}
                <TextareaAutosize
                  color='neutral'
                  style={{
                    opacity:
                      // @ts-ignore
                      allData.status == 'Dead' || allData.status == 'Released'
                        ? 0.5
                        : 1,
                    width: '100%',
                  }}
                  disabled={
                    // @ts-ignore
                    allData.status == 'Dead' || allData.status == 'Released'
                      ? true
                      : false
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
                  (allData.status == 'Initiated' ||
                    // @ts-ignore
                    allData.status == 'Under Treatment') && (
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
          )}

          {/* <div className={styles.row}>
            <span style={{ opacity: router.query.id ? 0.5 : 1 }}>
              <FormattedLabel id="diagnosisDetail" /> :
            </span>
            <TextareaAutosize
              color="neutral"
              style={{ opacity: applicationData.status != "Initiated" ? 0.5 : 1 }}
              disabled={applicationData.status != "Initiated" ? true : false}
              minRows={3}
              maxRows={5}
              placeholder={language === "en" ? "Diagnosis Details" : "निदान तपशील"}
              className={styles.bigText}
              {...register("dignosisDetails")}
              />
            </div> */}
          {/* @ts-ignore */}
          {(allData.status == 'Initiated' ||
            // @ts-ignore
            allData.status == 'Under Treatment') && (
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
                          onChange={(date) => {
                            field.onChange(moment(date).format('YYYY-MM-DD'))
                          }}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: 250 }}
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
                  sx={{ width: 250 }}
                  label={<FormattedLabel id='medicineOrInjection' />}
                  // @ts-ignore
                  variant='standard'
                  {...register('medicineName')}
                  error={!!error.medicineName}
                  InputLabelProps={{ shrink: !!watch('medicineName') }}
                  helperText={
                    error?.medicineName ? error.medicineName.message : null
                  }
                />
                <TextField
                  sx={{ width: 250 }}
                  label={<FormattedLabel id='days' />}
                  // @ts-ignore
                  variant='standard'
                  {...register('days')}
                  error={!!error.days}
                  helperText={error?.days ? error.days.message : null}
                />
                <TextField
                  sx={{ width: 250 }}
                  label={<FormattedLabel id='dosage' />}
                  // @ts-ignore
                  variant='standard'
                  {...register('dosage')}
                  error={!!error.dosage}
                  helperText={error?.dosage ? error.dosage.message : null}
                />
                <TextField
                  sx={{ width: 250 }}
                  label={<FormattedLabel id='remark' />}
                  // @ts-ignore
                  variant='standard'
                  {...register('remark')}
                  error={!!error.remark}
                  helperText={error?.remark ? error.remark.message : null}
                />
              </div>
              <div className={styles.row} style={{ justifyContent: 'center' }}>
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
                        days: watch('days'),
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
          )}
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
            <span
              style={{
                opacity:
                  // @ts-ignore
                  allData.status == 'Dead' || allData.status == 'Released'
                    ? 0.5
                    : 1,
              }}
            >
              <FormattedLabel id='specialInvestingationDescription' /> :
            </span>
            <TextareaAutosize
              color='neutral'
              style={{
                // @ts-ignore
                opacity:
                  allData.status == 'Dead' || allData.status == 'Released'
                    ? 0.5
                    : 1,
              }}
              // @ts-ignore
              disabled={allData.status != 'Initiated' ? true : false}
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
          </div>
          <div className={styles.row}>
            {
              // @ts-ignore
              allData.status == 'Initiated' ||
              // @ts-ignore
              allData.status == 'Under Treatment' ? (
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
              )
            }
          </div> */}

          {
            // @ts-ignore
            allData.status == 'Initiated' ||
            // @ts-ignore
            allData.status == 'Under Treatment' ? (
              <div
                className={styles.row}
                style={{ justifyContent: 'center', marginTop: '2%' }}
              >
                <FormControl
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '18px',
                      marginRight: 60,
                      fontWeight: '400',
                    }}
                  >
                    <FormattedLabel id='status' /> :
                  </span>
                  <RadioGroup
                    name='treatmentStatus'
                    sx={{ gap: 10 }}
                    onChange={(e) => {
                      setTreatmentStatus(e.target.value)
                    }}
                    defaultValue={
                      // @ts-ignore
                      allData.status != 'Initiated'
                        ? // @ts-ignore
                          allData.status ?? 'Under Treatment'
                        : 'Under Treatment'
                    }
                    row
                  >
                    <FormControlLabel
                      value='Under Treatment'
                      control={<Radio />}
                      label={<FormattedLabel id='underTreatment' />}
                    />
                    <FormControlLabel
                      value='Dead'
                      control={<Radio />}
                      label={<FormattedLabel id='dead' />}
                    />
                    <FormControlLabel
                      value='Released'
                      control={<Radio />}
                      label={<FormattedLabel id='released' />}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            ) : (
              <div
                className={styles.row}
                style={{ justifyContent: 'center', marginTop: '2%' }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    marginRight: 60,
                    fontWeight: '400',
                  }}
                >
                  <FormattedLabel id='status' /> :
                  <span style={{ fontWeight: 'bold' }}>
                    {
                      // @ts-ignore
                      allData.status
                    }
                  </span>
                </span>
              </div>
            )
          }
          {(treatmentStatus == 'Dead' ||
            treatmentStatus == 'Released' ||
            // @ts-ignore
            allData.status == 'Dead' ||
            // @ts-ignore
            allData.status == 'Released') && (
            <div
              className={styles.row}
              style={{ justifyContent: 'space-evenly', marginTop: '2%' }}
            >
              {/* @ts-ignore */}
              {(allData.status == 'Dead' || treatmentStatus == 'Dead') && (
                <>
                  <FormControl error={!!error.dischargeDate}>
                    <Controller
                      control={control}
                      name='dischargeDate'
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            disabled={
                              // @ts-ignore
                              allData.status == 'Dead' ||
                              // @ts-ignore
                              allData.status == 'Released'
                                ? true
                                : false
                            }
                            inputFormat='dd/MM/yyyy'
                            label={<FormattedLabel id='dateOfDeath' />}
                            value={field.value}
                            onChange={(date) => {
                              field.onChange(moment(date).format('YYYY-MM-DD'))
                            }}
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: 250 }}
                                {...params}
                                size='small'
                                fullWidth
                                variant='standard'
                                error={!!error.dischargeDate}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {error?.dischargeDate
                        ? error.dischargeDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                  <UploadButton
                    appName='VMS'
                    serviceName='PetLicense'
                    // @ts-ignore
                    label={<FormattedLabel id='deathCertificate' required />}
                    filePath={dischargeDoc}
                    fileUpdater={setDischargeDoc}
                    view={
                      // @ts-ignore
                      allData.status == 'Released' || allData.status == 'Dead'
                        ? true
                        : false
                    }
                    onlyImage
                    readOnly={
                      allData.status == 'Released' || allData.status == 'Dead'
                    }
                  />
                </>
              )}
              {/* @ts-ignore */}
              {(allData.status == 'Released' ||
                treatmentStatus == 'Released') && (
                <>
                  <FormControl error={!!error.dischargeDate}>
                    <Controller
                      control={control}
                      name='dischargeDate'
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            disabled={
                              // @ts-ignore
                              allData.status == 'Dead' ||
                              // @ts-ignore
                              allData.status == 'Released'
                                ? true
                                : false
                            }
                            inputFormat='dd/MM/yyyy'
                            label={<FormattedLabel id='dateOfRelease' />}
                            value={field.value}
                            onChange={(date) => {
                              field.onChange(moment(date).format('YYYY-MM-DD'))
                            }}
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: 250 }}
                                {...params}
                                size='small'
                                fullWidth
                                variant='standard'
                                error={!!error.dischargeDate}
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {error?.dischargeDate
                        ? error.dischargeDate.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                  <UploadButton
                    appName='VMS'
                    serviceName='PetLicense'
                    // @ts-ignore
                    label={<FormattedLabel id='healthCertificate' required />}
                    filePath={dischargeDoc}
                    fileUpdater={setDischargeDoc}
                    view={
                      //  @ts-ignore
                      allData.status == 'Released' || allData.status == 'Dead'
                    }
                    onlyImage
                    readOnly={
                      allData.status == 'Released' || allData.status == 'Dead'
                    }
                  />
                </>
              )}
            </div>
          )}

          <div className={styles.buttons}>
            {
              // @ts-ignore
              (allData.status == 'Awaiting Payment' ||
                // @ts-ignore
                allData.status == 'Payment Successful') && (
                <Button
                  variant='contained'
                  endIcon={<Description />}
                  onClick={() => {
                    router.push({
                      pathname: `/veterinaryManagementSystem/transactions/prescription`,
                      query: { id: router.query.id, service: 'ipd' },
                    })
                  }}
                >
                  <FormattedLabel id='prescription' />
                </Button>
              )
            }

            {
              // @ts-ignore
              (allData.status == 'Initiated' ||
                // @ts-ignore
                allData.status == 'Under Treatment') && (
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

            {/* {router.query.id && (
              <Button
                variant='contained'
                endIcon={<Description />}
                onClick={() => {
                  router.push({
                    pathname:
                      '/veterinaryManagementSystem/transactions/casePaperReceipt',
                    query: { id: router.query.id, service: 'ipd' },
                  })
                }}
              >
                <FormattedLabel id='casePaperReceipt' />
              </Button>
            )} */}

            {
              // @ts-ignore
              allData.status === 'Awaiting Payment' && (
                <Button
                  variant='contained'
                  onClick={() => {
                    router.push({
                      pathname: `/veterinaryManagementSystem/transactions/ipd/paymentGateway`,
                      query: { id: router.query.id },
                    })
                  }}
                  endIcon={<Payment />}
                >
                  <FormattedLabel id='makePayment' />
                </Button>
              )
            }

            <Button
              variant='contained'
              color='error'
              onClick={() => {
                router.push(
                  `/veterinaryManagementSystem/transactions/animalTreatment/doctor`
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

export default View
