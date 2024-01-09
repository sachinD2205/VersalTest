import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './vaccination.module.css'

import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { Controller, useForm } from 'react-hook-form'
import PetCard from '../../../../containers/VMS_ReusableComponents/PetCard'
import axios from 'axios'
import URLs from '../../../../URLS/urls'
import { Clear, ExitToApp, Save, Search } from '@mui/icons-material'
import Slider from '../../../../containers/reuseableComponents/Slider'
import { useSelector } from 'react-redux'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { sortByAsc } from '../../../../containers/reuseableComponents/Sorter'
import { DataGrid } from '@mui/x-data-grid'
import moment from 'moment'
import Breadcrumb from '../../../../components/common/BreadcrumbComponent'
import Title from '../../../../containers/VMS_ReusableComponents/Title'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state?.labels?.language)
  const userToken = useGetToken()

  const [sliderState, setSliderState] = useState(false)
  const [loadingState, setLoadingState] = useState({
    licenseNo: false,
    mobileNo: false,
  })
  const [multiplePets, setMultiplePets] = useState([])
  const [petAnimal, setPetAnimal] = useState([
    { id: 1, petNameEn: '', petNameMr: '' },
  ])
  const [petBreeds, setPetBreeds] = useState([
    {
      id: 1,
      breedNameEn: '',
      breedNameMr: '',
      petAnimalKey: '',
    },
  ])
  const [allOPD, setAllOPD] = useState([{ id: 1, opdName: '' }])
  const [allTypesOfVaccination, setAllTypesOfVaccination] = useState([
    { id: 1, typeNameEn: '', typeNameMr: '' },
  ])
  const [allVaccines, setAllVaccines] = useState([
    { id: 1, vaccineEn: '', vaccineMr: '' },
  ])
  const [allRoutesOfInjection, setAllRoutesOfInjection] = useState([
    { id: 1, routeOfInjectionEn: '', routeOfInjectionMr: '' },
  ])
  const [historyTable, setHistoryTable] = useState([])

  const schema = yup.object().shape({
    nameOfOwner: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter owner name'
          : 'कृपया मालकाचे नाव प्रविष्ट करा'
      )
      .typeError(
        language === 'en'
          ? 'Please enter owner name'
          : 'कृपया मालकाचे नाव प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === 'en'
          ? 'Must be only english or marathi characters'
          : 'फक्त इंग्लिश किंवा मराठी शब्द'
      ),
    mobileNumber: yup
      .string()
      // .matches(/^[0-9]*$/, 'Must be only digits')
      .matches(
        /^[6-9][0-9]+$/,
        language === 'en' ? 'Invalid mobile no.' : 'अवैध मोबाईल नंबर'
      )
      .required(
        language === 'en' ? 'Please enter mobile no.' : 'कृपया मोबाईल नंबर टाका'
      )
      .typeError(
        language === 'en' ? 'Please enter mobile no.' : 'कृपया मोबाईल नंबर टाका'
      )
      .min(
        10,
        language === 'en'
          ? "Mobile no. shouldn't be less than 10 digits"
          : 'मोबाईल नंबर 10 अंकांपेक्षा कमी नसावा'
      )
      .max(
        10,
        language === 'en'
          ? "Mobile no. shouldn't be greater than 10 digits"
          : 'मोबाईल नंबर 10 अंकांपेक्षा जास्त नसावा'
      ),
    emailId: yup
      .string()
      .required(
        language === 'en' ? 'Please enter email id' : 'कृपया ईमेल आयडी टाका'
      )
      .email(language === 'en' ? 'Incorrect format' : 'चुकीचे स्वरूप'),
    address: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter flat or house no.'
          : 'कृपया फ्लॅट किंवा घर क्रमांक प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s /.,-]+$/,
        language === 'en'
          ? 'Must be only english or marathi characters'
          : 'फक्त इंग्लिश किंवा मराठी शब्द'
      ),
    petAnimalKey: yup
      .number()
      .required(
        language == 'en' ? 'Please select an animal' : 'कृपया एक प्राणी निवडा'
      )
      .typeError(
        language == 'en' ? 'Please select an animal' : 'कृपया एक प्राणी निवडा'
      ),
    breed: yup
      .number()
      .required(
        language == 'en'
          ? 'Please select an animal breed'
          : 'कृपया जनावरांची जात निवडा'
      )
      .typeError(
        language == 'en'
          ? 'Please select an animal breed'
          : 'कृपया जनावरांची जात निवडा'
      ),
    petGender: yup
      .string()
      .required(
        language == 'en'
          ? 'Please select the gender of the animal'
          : 'कृपया प्राण्याचे लिंग निवडा'
      )
      .typeError(
        language == 'en'
          ? 'Please select the gender of the animal'
          : 'कृपया प्राण्याचे लिंग निवडा'
      ),
    petName: yup
      .string()
      .required('Please enter pet name')
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === 'en'
          ? 'Must be only english or marathi characters'
          : 'फक्त इंग्लिश किंवा मराठी शब्द'
      ),
    petAge: yup
      .string()
      .required(
        language === 'en'
          ? `Please enter pet's age`
          : 'कृपया पाळीव प्राण्याचे वय प्रविष्ट करा'
      )
      .typeError(
        language === 'en'
          ? `Please enter pet's age`
          : 'कृपया पाळीव प्राण्याचे वय प्रविष्ट करा'
      ),
    petColour: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter color of the animal'
          : 'कृपया प्राण्याचा रंग प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === 'en'
          ? 'Must be only english or marathi characters'
          : 'फक्त इंग्लिश किंवा मराठी शब्द '
      ),
    opdKey: yup
      .number()
      .required(
        language === 'en' ? 'Please select an OPD' : 'कृपया एक ओपीडी निवडा'
      )
      .typeError(
        language === 'en' ? 'Please select an OPD' : 'कृपया एक ओपीडी निवडा'
      ),
    vaccinationDate: yup
      .date()
      .typeError(
        language === 'en'
          ? 'Please select date of vaccination'
          : 'कृपया लसीकरणाची तारीख निवडा'
      )
      .required(
        language === 'en'
          ? 'Please select date of vaccination'
          : 'कृपया लसीकरणाची तारीख निवडा'
      ),
    vaccinationTypeKey: yup
      .number()
      .required(
        language === 'en'
          ? 'Please select a vaccination type'
          : 'कृपया लसीकरण प्रकार निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select a vaccination type'
          : 'कृपया लसीकरण प्रकार निवडा'
      ),
    vaccineUsedKey: yup
      .number()
      .required(
        language === 'en'
          ? 'Please select vaccine used'
          : 'कृपया वापरलेली लस निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select vaccine used'
          : 'कृपया वापरलेली लस निवडा'
      ),
    vaccinationDose: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter dosage of vaccine'
          : 'कृपया लसीचा डोस प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z0-9०-९\u0900-\u097F\s]+$/,
        language === 'en'
          ? 'Must be only english or marathi characters'
          : 'फक्त इंग्लिश किंवा मराठी शब्द'
      ),
    routeOfInjectionKey: yup
      .number()
      .required(
        language === 'en'
          ? 'Please select a route of injection'
          : 'कृपया इंजेक्शनचा मार्ग निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select a route of injection'
          : 'कृपया इंजेक्शनचा मार्ग निवडा'
      ),
    injectionExpiryDate: yup
      .date()
      .typeError(
        language === 'en'
          ? `Please enter injection's expiry date`
          : 'कृपया इंजेक्शन एक्सपायरी डेट टाका'
      )
      .required(
        language === 'en'
          ? `Please enter injection's expiry date`
          : 'कृपया इंजेक्शन एक्सपायरी डेट टाका'
      ),
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    getValues,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetAnimal(
          res.data.mstPetAnimalList.map((j) => ({
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
        setPetBreeds(() => {
          sortByAsc(res?.data?.mstAnimalBreedList, 'breedNameEn')
          return res?.data?.mstAnimalBreedList?.map((j) => ({
            id: j.id,
            breedNameEn: j.breedNameEn,
            breedNameMr: j.breedNameMr,
            petAnimalKey: j.petAnimalKey,
          }))
        })
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get OPD
    axios
      .get(`${URLs.VMS}/mstOpd/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAllOPD(
          res.data.mstOpdList.map((j, i) => ({
            id: j.id,
            opdName: j.opdName,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Types of Vaccination
    axios
      .get(`${URLs.VMS}/mstTypeOfVaccination/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAllTypesOfVaccination(
          res.data.mstTypeOfVaccinationList.map((j, i) => ({
            id: j.id,
            vaccineTypeEn: j.vaccineTypeEn,
            vaccineTypeMr: j.vaccineTypeMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get all Vaccines
    axios
      .get(`${URLs.VMS}/mstVaccineUsed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAllVaccines(
          res.data.mstVaccineUsedList.map((j, i) => ({
            id: j.id,
            vaccineEn: j.vaccineUsedEn,
            vaccineMr: j.vaccineUsedMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get all Vaccines
    axios
      .get(`${URLs.VMS}/mstRouteInjection/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setAllRoutesOfInjection(
          res.data.mstRouteInjectionList.map((j, i) => ({
            id: j.id,
            routeOfInjectionEn: j.routeInjectionEn,
            routeOfInjectionMr: j.routeInjectionMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    setMultiplePets([])

    setValue(sliderState ? 'licenceNo' : 'mobileNo', '')
    reset({
      nameOfOwner: '',
      mobileNumber: '',
      emailId: '',
      address: '',
      licenseNo: '',
      petAnimalKey: '',
      breed: '',
      petGender: '',
      petName: '',
      petAge: '',
      petColour: '',
      ...getValues(),
    })
  }, [sliderState])

  useEffect(() => {
    if (
      !!allOPD &&
      !!allVaccines &&
      !!petAnimal &&
      !!petBreeds &&
      router.query?.id
    ) {
      axios
        .get(`${URLs.VMS}/trnOpdVaccination/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query?.id },
        })
        .then((res) =>
          reset({
            ...res?.data,
            casePaperNo: res?.data?.opdCaseNo,
          })
        )
        .catch((error) => catchExceptionHandlingMethod(error, language))
    }
  }, [allOPD, allVaccines, petAnimal, petBreeds])

  const historyTableColumns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 75,
    },
    {
      headerClassName: 'cellColor',

      field: 'opdName',
      headerAlign: 'center',
      headerName: <FormattedLabel id='opdName' />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'typeOfVaccineEn' : 'typeOfVaccineMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='typeOfVaccine' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'routeOfInjectionEn' : 'routeOfInjectionMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='routeInjection' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: 'vaccinationDate',
      headerAlign: 'center',
      headerName: <FormattedLabel id='vaccinationDate' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'vaccineUsedEn' : 'vaccineUsedMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='vaccineUsed' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: 'injectionExpiryDate',
      headerAlign: 'center',
      headerName: <FormattedLabel id='injectionExpiryDate' />,
      width: 175,
    },
    {
      headerClassName: 'cellColor',

      field: 'vaccinationDueDate',
      headerAlign: 'center',
      headerName: <FormattedLabel id='vaccinationDueDate' />,
      width: 200,
    },
  ]

  const searchData = () => {
    sliderState
      ? setLoadingState({ licenseNo: false, mobileNo: true })
      : setLoadingState({ licenseNo: true, mobileNo: false })

    axios
      .post(
        `${URLs.VMS}/reportController/getAllByLicenseNoOrMobileNumber`,
        sliderState
          ? { mobileNo: watch('mobileNo') }
          : { licenceNo: watch('licenceNo') },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.data?.reportDaoList?.length > 0) {
          const petData = res?.data?.reportDaoList?.map((j) => ({
            address: j.address,
            petAnimalKey: j.petAnimalkey,
            petAge: j.age,
            breed: j.animalBreedKey,
            petColour: j.color,
            emailId: j.email,
            petGender: j.gender,
            licenseNo: j.licenceNo ?? 'No License',
            mobileNumber: j.mobileNo,
            // nameOfOwner: j.ownerName,
            nameOfOwner: j.firstName + ' ' + j.middleName + ' ' + j.lastName,
            petName: j.petName,
          }))
          res.data?.reportDaoList?.length > 1
            ? setMultiplePets(petData)
            : petDataSetter(petData[0])
        } else {
          sweetAlert(
            'No Data Found',
            sliderState
              ? 'Please enter correct mobile no.'
              : 'Please enter correct license no.',
            'info'
          )
        }
        setValue('registeredData', true)

        setLoadingState({ licenseNo: false, mobileNo: false })
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status == 401) {
          catchExceptionHandlingMethod(error, language)
        } else {
          setLoadingState({ licenseNo: false, mobileNo: false })
          error?.response?.status == 404 || error?.response?.status == 400
            ? sweetAlert(
                'No Data Found',
                sliderState
                  ? 'Please enter correct mobile no.'
                  : 'Please enter correct license no.',
                'info'
              )
            : sweetAlert('Error', 'Something went wrong', 'error')
        }
      })
  }

  const clearData = () => {
    reset({
      //search
      licenceNo: '',
      mobileNo: '',

      //Pet Details
      address: '',
      petAnimalKey: '',
      petAge: '',
      breed: '',
      petColour: '',
      emailId: '',
      petGender: '',
      licenseNo: '',
      mobileNumber: '',
      nameOfOwner: '',
      petName: '',

      //Vaccination Details
      opdKey: '',
      vaccinationDate: null,
      vaccinationTypeKey: '',
      vaccineUsedKey: '',
      vaccinationDose: '1CC',
      routeOfInjectionKey: '',
      injectionExpiryDate: null,
    })

    setHistoryTable([])

    setValue('registeredData', false)
  }

  const petDataSetter = (data = {}) => {
    reset(
      !!data
        ? {
            ...getValues(),
            ...data,
          }
        : { ...data }
    )

    axios
      .get(`${URLs.VMS}/reportController/getRecordsBylicenseNo`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { licenseNo: data?.licenseNo },
      })
      .then((res) => {
        if (res?.data?.trnOpdVaccinationList?.length > 0) {
          setHistoryTable(
            res?.data?.trnOpdVaccinationList?.map((j, i) => ({
              ...j,
              srNo: i + 1,
              opdName: allOPD.find((opd) => opd.id == j.opdKey)?.opdName,
              vaccineUsedEn: allVaccines.find(
                (vaccine) => vaccine.id == j.vaccineUsedKey
              )?.vaccineEn,
              vaccineUsedMr: allVaccines.find(
                (vaccine) => vaccine.id == j.vaccineUsedKey
              )?.vaccineMr,
              typeOfVaccineEn: allTypesOfVaccination?.find(
                (types) => types.id == j.vaccinationTypeKey
              )?.vaccineTypeEn,
              typeOfVaccineMr: allTypesOfVaccination?.find(
                (types) => types.id == j.vaccinationTypeKey
              )?.vaccineTypeMr,
              routeOfInjectionEn: allRoutesOfInjection?.find(
                (routes) => routes.id == j.routeOfInjectionKey
              )?.routeOfInjectionEn,
              routeOfInjectionMr: allRoutesOfInjection?.find(
                (routes) => routes.id == j.routeOfInjectionKey
              )?.routeOfInjectionMr,

              vaccinationDueDate:
                j?.vaccinationDueDate ??
                `${Number(j?.vaccinationDate?.split('-')[0]) + 1}` +
                  '-' +
                  j?.vaccinationDate?.split('-')[1] +
                  '-' +
                  `${Number(j?.vaccinationDate?.split('-')[2]) - 1}` ??
                'not found',
            }))
          )
        } else {
          sweetAlert('Info', 'No Vaccination History', 'info')
          setHistoryTable([])
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language))
  }

  const finalSubmit = (data) => {
    const bodyForAPI = {
      ...data,
      vaccinationDate: moment(data?.vaccinationDate).format('YYYY-MM-DD'),
      injectionExpiryDate: moment(data?.injectionExpiryDate).format(
        'YYYY-MM-DD'
      ),
    }

    sweetAlert({
      title: language == 'en' ? 'Confirmation' : 'पुष्टी',
      text:
        language == 'en'
          ? 'Are you sure you want to save the data?'
          : 'तुमची खात्री आहे की तुम्ही डेटा जतन करू इच्छिता',
      icon: 'warning',
      buttons: language == 'en' ? ['Cancel', 'Save'] : ['रद्द करा', 'जतन करा'],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${URLs.VMS}/trnOpdVaccination/save`, bodyForAPI, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              sweetAlert(
                language == 'en' ? 'Saved' : 'जतन केले',
                bodyForAPI?.id
                  ? language == 'en'
                    ? 'Data updated successfully'
                    : 'डेटा यशस्वीरित्या अपडेट केला'
                  : language == 'en'
                  ? 'Data saved successfully'
                  : 'डेटा यशस्वीरित्या डेटा जतन केला',
                'success'
              )
              router.push(
                `/veterinaryManagementSystem/transactions/vaccination`
              )
            }
          })
          .catch((error) => catchExceptionHandlingMethod(error, language))
      }
    })
  }

  return (
    <>
      <Head>
        <title>Vaccination Report</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='vaccinationReport' />} />
        {!router.query.id ? (
          <>
            <div
              className={styles.row}
              style={{ justifyContent: 'center', gap: 50 }}
            >
              <TextField
                disabled={!!router.query.id || sliderState}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='licenseNo' />}
                variant='standard'
                {...register('licenceNo')}
                InputLabelProps={{
                  shrink: !!router.query.id || !!watch('licenceNo'),
                }}
                error={!!error.licenceNo}
                helperText={error?.licenceNo ? error.licenceNo.message : null}
                InputProps={{
                  endAdornment: !router.query.id && !sliderState && (
                    <InputAdornment position='end'>
                      {loadingState.licenseNo ? (
                        <svg className={styles.loader} viewBox='25 25 50 50'>
                          <circle r='20' cy='50' cx='50'></circle>
                        </svg>
                      ) : (
                        <IconButton
                          disabled={!!router.query.id || sliderState}
                          sx={{ color: '#1976D2' }}
                          onClick={() => searchData()}
                        >
                          <Search />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />

              <Slider slide={sliderState} setSlider={setSliderState} />

              <TextField
                disabled={!sliderState}
                sx={{ width: '250px' }}
                label={<FormattedLabel id='mobileNo' />}
                variant='standard'
                {...register('mobileNo')}
                InputLabelProps={{
                  shrink: !!router.query.id || !!watch('mobileNo'),
                }}
                error={!!error.mobileNo}
                helperText={error?.mobileNo ? error.mobileNo.message : null}
                InputProps={{
                  endAdornment: !router.query.id && sliderState && (
                    <InputAdornment position='end'>
                      {loadingState.mobileNo ? (
                        <svg className={styles.loader} viewBox='25 25 50 50'>
                          <circle r='20' cy='50' cx='50'></circle>
                        </svg>
                      ) : (
                        <IconButton
                          disabled={!sliderState}
                          sx={{ color: '#1976D2' }}
                          onClick={() => searchData()}
                        >
                          <Search />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <Slide
              direction={multiplePets.length > 0 ? 'right' : 'left'}
              in={multiplePets.length > 0}
              mountOnEnter
              unmountOnExit
            >
              <div className={styles.multiplePets}>
                {multiplePets.map((obj, index) => (
                  <PetCard
                    key={index}
                    // @ts-ignore
                    petName={obj?.petName}
                    // @ts-ignore
                    casePaperNo={obj?.licenseNo}
                    onClick={() => {
                      console.log(obj.petAnimalkey)
                      petDataSetter(obj)
                      setMultiplePets([])
                    }}
                  />
                ))}
              </div>
            </Slide>
          </>
        ) : (
          <div
            className={styles.row}
            // style={{ justifyContent: 'center' }}
          >
            <TextField
              disabled={!!router.query.id}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='casePaperNo' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('casePaperNo'),
              }}
              variant='standard'
              {...register('casePaperNo')}
              error={!!error.casePaperNo}
              helperText={error?.casePaperNo ? error.casePaperNo.message : null}
            />
          </div>
        )}

        <div className={styles.subTitle}>
          <FormattedLabel id='animalDetails' />
        </div>
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.wrapper}>
            <TextField
              disabled={!!router.query.id || watch('registeredData')}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='ownerName' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('nameOfOwner'),
              }}
              variant='standard'
              {...register('nameOfOwner')}
              error={!!error.nameOfOwner}
              helperText={error?.nameOfOwner ? error.nameOfOwner.message : null}
            />
            <TextField
              disabled={!!router.query.id || watch('registeredData')}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='mobileNo' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('mobileNumber'),
              }}
              variant='standard'
              {...register('mobileNumber')}
              error={!!error.mobileNumber}
              helperText={
                error?.mobileNumber ? error.mobileNumber.message : null
              }
            />
            <TextField
              disabled={!!router.query.id || watch('registeredData')}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='emailId' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('emailId'),
              }}
              variant='standard'
              {...register('emailId')}
              error={!!error.emailId}
              helperText={error?.emailId ? error.emailId.message : null}
            />
            <TextField
              disabled={!!router.query.id || watch('registeredData')}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='address' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('address'),
              }}
              variant='standard'
              {...register('address')}
              error={!!error.address}
              helperText={error?.address ? error.address.message : null}
            />
            <TextField
              disabled={!!router.query.id || watch('registeredData')}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='licenseNo' />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('licenseNo'),
              }}
              variant='standard'
              {...register('licenseNo')}
              error={!!error.licenseNo}
              helperText={error?.licenseNo ? error.licenseNo.message : null}
            />
            <FormControl
              disabled={!!router.query.id || watch('registeredData')}
              variant='standard'
              error={!!error.petAnimalKey}
            >
              <InputLabel>
                <FormattedLabel id='petAnimal' required />
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
                    label='petAnimalKey'
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={obj.id} value={obj.id}>
                          {language === 'en' ? obj.nameEn : obj.nameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='petAnimalKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.petAnimalKey ? error.petAnimalKey.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={
                !!router.query.id ||
                !watch('petAnimalKey') ||
                watch('registeredData')
              }
              variant='standard'
              error={!!error.breed}
            >
              <InputLabel>
                <FormattedLabel id='animalBreed' required />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='breed'
                  >
                    {petBreeds &&
                      petBreeds
                        .filter((obj) => {
                          return (
                            Number(obj.petAnimalKey) ==
                            Number(watch('petAnimalKey'))
                          )
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
                name='breed'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.breed ? error.breed.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={!!router.query.id || watch('registeredData')}
              variant='standard'
              error={!!error.petGender}
            >
              <InputLabel>
                <FormattedLabel id='animalGender' required />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='petGender'
                  >
                    <MenuItem key={1} value={'Male'}>
                      {language === 'en' ? 'Male' : 'पुरुष'}
                    </MenuItem>
                    <MenuItem key={2} value={'Female'}>
                      {language === 'en' ? 'Female' : 'स्त्री'}
                    </MenuItem>
                  </Select>
                )}
                name='petGender'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.petGender ? error.petGender.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={!!router.query.id || watch('registeredData')}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='petName' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('petName'),
              }}
              variant='standard'
              {...register('petName')}
              error={!!error.petName}
              helperText={error?.petName ? error.petName.message : null}
            />
            <TextField
              disabled={!!router.query.id || watch('registeredData')}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='animalAge' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('petAge'),
              }}
              variant='standard'
              {...register('petAge')}
              error={!!error.petAge}
              helperText={error?.petAge ? error.petAge.message : null}
            />
            <TextField
              disabled={!!router.query.id || watch('registeredData')}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='animalColor' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('petColour'),
              }}
              variant='standard'
              {...register('petColour')}
              error={!!error.petColour}
              helperText={error?.petColour ? error.petColour.message : null}
            />
            <div style={{ width: 250 }}></div>
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id='vaccinationDetails' />
          </div>
          <div className={styles.wrapper}>
            <FormControl
              disabled={!!router.query.id}
              variant='standard'
              error={!!error.opdKey}
            >
              <InputLabel>
                <FormattedLabel id='opdName' required />
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
                    {allOPD &&
                      allOPD.map((obj) => (
                        <MenuItem key={obj.id} value={obj.id}>
                          {/* {language === 'en' ? obj.opdNameEn : obj.opdNameMr} */}
                          {obj.opdName}
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
            <FormControl error={!!error.vaccinationDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='vaccinationDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      // minDate={watch('petBirthdate')}
                      disabled={!!router.query.id}
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='vaccinationDate' required />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '250px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!error.vaccinationDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.vaccinationDate ? error.vaccinationDate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={!!router.query.id}
              variant='standard'
              error={!!error.vaccinationTypeKey}
            >
              <InputLabel>
                <FormattedLabel id='typeOfVaccine' required />
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
                    label='vaccinationTypeKey'
                  >
                    {allTypesOfVaccination &&
                      allTypesOfVaccination.map((obj) => (
                        <MenuItem key={obj.id} value={obj.id}>
                          {language === 'en'
                            ? obj.vaccineTypeEn
                            : obj.vaccineTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='vaccinationTypeKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.vaccinationTypeKey
                  ? error.vaccinationTypeKey.message
                  : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={!!router.query.id}
              variant='standard'
              error={!!error.vaccineUsedKey}
            >
              <InputLabel>
                <FormattedLabel id='vaccineUsed' required />
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
                    label='vaccineUsedKey'
                  >
                    {allVaccines &&
                      allVaccines.map((obj) => (
                        <MenuItem key={obj.id} value={obj.id}>
                          {language === 'en' ? obj.vaccineEn : obj.vaccineMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='vaccineUsedKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.vaccineUsedKey ? error.vaccineUsedKey.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={!!router.query.id}
              sx={{ width: '250px' }}
              label={<FormattedLabel id='vaccinationDose' required />}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('vaccinationDose'),
              }}
              defaultValue='1CC'
              variant='standard'
              {...register('vaccinationDose')}
              error={!!error.vaccinationDose}
              helperText={
                error?.vaccinationDose ? error.vaccinationDose.message : null
              }
            />
            <FormControl
              disabled={!!router.query.id}
              variant='standard'
              error={!!error.routeOfInjectionKey}
            >
              <InputLabel>
                <FormattedLabel id='routeInjection' required />
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
                    label='routeOfInjectionKey'
                  >
                    {allRoutesOfInjection &&
                      allRoutesOfInjection.map((obj) => (
                        <MenuItem key={obj.id} value={obj.id}>
                          {language === 'en'
                            ? obj.routeOfInjectionEn
                            : obj.routeOfInjectionMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='routeOfInjectionKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.routeOfInjectionKey
                  ? error.routeOfInjectionKey.message
                  : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.injectionExpiryDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='injectionExpiryDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      // minDate={watch('petBirthdate')}
                      disabled={!!router.query.id}
                      inputFormat='dd/MM/yyyy'
                      label={
                        <FormattedLabel id='injectionExpiryDate' required />
                      }
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '250px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!error.injectionExpiryDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.injectionExpiryDate
                  ? error.injectionExpiryDate.message
                  : null}
              </FormHelperText>
            </FormControl>
            <div style={{ width: 250 }}></div>
          </div>

          <div className={styles.subTitle}>
            <FormattedLabel id='vaccinationHistoryDetails' />
          </div>
          <div className={styles.centerDiv}>
            {historyTable.length > 0 ? (
              <DataGrid
                autoHeight
                sx={{
                  marginTop: '5vh',
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
                rows={historyTable}
                //@ts-ignore
                columns={historyTableColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            ) : (
              <b style={{ fontSize: 'large', marginTop: '2vh' }}>
                <FormattedLabel id='noVaccinationHistoryFound' />
              </b>
            )}
          </div>

          <div className={styles.buttonGroup}>
            {!router.query.id && (
              <>
                <Button
                  variant='contained'
                  type='submit'
                  color='success'
                  endIcon={<Save />}
                >
                  <FormattedLabel id='save' />
                </Button>
                <Button
                  variant='outlined'
                  color='error'
                  endIcon={<Clear />}
                  onClick={clearData}
                >
                  <FormattedLabel id='clear' />
                </Button>
              </>
            )}
            <Button
              variant='contained'
              color='error'
              endIcon={<ExitToApp />}
              onClick={() => router.back()}
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
