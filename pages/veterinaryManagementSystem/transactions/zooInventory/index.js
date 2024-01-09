import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './zooInventory.module.css'

import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from '@mui/material'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import axios from 'axios'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import URLs from '../../../../URLS/urls'
import { Clear, Edit, ExitToApp, Save, Search } from '@mui/icons-material'
import moment from 'moment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import Breadcrumb from '../../../../components/common/BreadcrumbComponent'
import Title from '../../../../containers/VMS_ReusableComponents/Title'
import Loader from '../../../../containers/Layout/components/Loader'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()

  const [loadingState, setLoadingState] = useState(false)
  const [classDropDown, setClassDropDown] = useState([
    {
      id: 1,
      classEn: '',
      classMr: '',
    },
  ])
  const [scheduleDropDown, setScheduleDropDown] = useState([
    {
      id: 1,
      scheduleEn: '',
      scheduleMr: '',
    },
  ])
  const [animalDropDown, setAnimalDropDown] = useState([
    {
      id: 1,
      animalNameEn: '',
      animalNameMr: '',
      classKey: 0,
      scheduleKey: 0,
    },
  ])
  const [animalDetail, setAnimalDetail] = useState({
    classEn: '',
    classMr: '',
    scheduleEn: '',
    scheduleMr: '',
  })
  const [viewTable, setViewTable] = useState({ animalKey: 0, data: [] })
  const [balance, setBalance] = useState({
    male: 0,
    female: 0,
    unsexed: 0,
    total: 0,
  })
  const [remarkField, setRemarkField] = useState(false)
  const [newDataEntry, setNewDataEntry] = useState(false)
  const [loader, setLoader] = useState(false)

  const searchSchema = yup.object().shape({
    // animalKey: yup.number().required().typeError('Please select an animal'),
  })

  const balanceSchema = yup.object().shape({
    openingBalanceMale: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect opening balance'
          : 'चुकीची उघडण्याची शिल्लक'
      ),
    openingBalanceFemale: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect opening balance'
          : 'चुकीची उघडण्याची शिल्लक'
      ),
    openingBalanceUnsexed: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect opening balance'
          : 'चुकीची उघडण्याची शिल्लक'
      ),
    birthsMale: yup
      .number()
      .typeError(
        language === 'en' ? 'Incorrect birth count' : 'चुकीची जन्म गणना'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
    birthsFemale: yup
      .number()
      .typeError(
        language === 'en' ? 'Incorrect birth count' : 'चुकीची जन्म गणना'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
    birthsUnsexed: yup
      .number()
      .typeError(
        language === 'en' ? 'Incorrect birth count' : 'चुकीची जन्म गणना'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
    acquisitionMale: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect acquisition count'
          : 'चुकीची संपादन संख्या'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
    acquisitionFemale: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect acquisition count'
          : 'चुकीची संपादन संख्या'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
    acquisitionUnsexed: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect acquisition count'
          : 'चुकीची संपादन संख्या'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
    acquisitionTotal: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect acquisition count'
          : 'चुकीची संपादन संख्या'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
    disposalsMale: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect disposals count'
          : 'चुकीची विल्हेवाट मोजणी'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      )
      .lessThan(
        balance.male + 1,
        language === 'en'
          ? 'Disposals cannot be greater than opening count'
          : 'विल्हेवाट उघडण्याच्या संख्येपेक्षा जास्त असू शकत नाही'
      ),

    disposalsFemale: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect disposals count'
          : 'चुकीची विल्हेवाट मोजणी'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      )
      .lessThan(
        balance.female + 1,
        language === 'en'
          ? 'Disposals cannot be greater than opening count'
          : 'विल्हेवाट उघडण्याच्या संख्येपेक्षा जास्त असू शकत नाही'
      ),

    disposalsUnsexed: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect disposals count'
          : 'चुकीची विल्हेवाट मोजणी'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      )
      .lessThan(
        balance.unsexed + 1,
        language === 'en'
          ? 'Disposals cannot be greater than opening count'
          : 'विल्हेवाट उघडण्याच्या संख्येपेक्षा जास्त असू शकत नाही'
      ),

    deathsMale: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect deaths count'
          : 'चुकीच्या मृत्यूची संख्या'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      )
      .lessThan(
        balance.male + 1,
        language === 'en'
          ? 'Deaths cannot be greater than opening count'
          : 'मृत्यू उघडण्याच्या संख्येपेक्षा जास्त असू शकत नाही'
      ),

    deathsFemale: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect deaths count'
          : 'चुकीच्या मृत्यूची संख्या'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      )
      .lessThan(
        balance.female + 1,
        language === 'en'
          ? 'Deaths cannot be greater than opening count'
          : 'मृत्यू उघडण्याच्या संख्येपेक्षा जास्त असू शकत नाही'
      ),

    deathsUnsexed: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect deaths count'
          : 'चुकीच्या मृत्यूची संख्या'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      )
      .lessThan(
        balance.unsexed + 1,
        language === 'en'
          ? 'Deaths cannot be greater than opening count'
          : 'मृत्यू उघडण्याच्या संख्येपेक्षा जास्त असू शकत नाही'
      ),

    openingTotal: yup
      .number()
      .typeError(
        language === 'en'
          ? 'Incorrect opening count'
          : 'चुकीची उघडण्याची संख्या'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),

    closingBalanceMale: yup
      .number()
      .typeError(
        language === 'en' ? 'Incorrect closing count' : 'चुकीची बंद गणना'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
    closingBalanceFemale: yup
      .number()
      .typeError(
        language === 'en' ? 'Incorrect closing count' : 'चुकीची बंद गणना'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),

    closingBalanceUnsexed: yup
      .number()
      .typeError(
        language === 'en' ? 'Incorrect closing count' : 'चुकीची बंद गणना'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),

    closingBalanceTotal: yup
      .number()
      .typeError(
        language === 'en' ? 'Incorrect closing count' : 'चुकीची बंद गणना'
      )
      .moreThan(
        -1,
        language === 'en'
          ? 'Count cannot be less than 0'
          : 'संख्या 0 पेक्षा कमी असू शकत नाही'
      ),
  })

  const {
    control,
    setValue: setValue1,
    watch: watch1,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(searchSchema),
  })

  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit: handleSubmit2,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(balanceSchema),
  })

  //Opening Total
  useEffect(() => {
    setValue(
      'openingTotal',
      Number(watch('openingBalanceMale')) +
        Number(watch('openingBalanceFemale')) +
        Number(watch('openingBalanceUnsexed'))
    )
  }, [])

  //acquisition Total
  useEffect(() => {
    setValue(
      'acquisitionTotal',
      Number(watch('acquisitionMale')) +
        Number(watch('acquisitionFemale')) +
        Number(watch('acquisitionUnsexed'))
    )
  }, [
    watch('acquisitionMale'),
    watch('acquisitionFemale'),
    watch('acquisitionUnsexed'),
  ])

  //Disposals Total
  useEffect(() => {
    setValue(
      'disposalsTotal',
      Number(watch('disposalsMale')) +
        Number(watch('disposalsFemale')) +
        Number(watch('disposalsUnsexed'))
    )
  }, [
    watch('disposalsMale'),
    watch('disposalsFemale'),
    watch('disposalsUnsexed'),
  ])

  //Births Total
  useEffect(() => {
    setValue(
      'birthsTotal',
      Number(watch('birthsMale')) +
        Number(watch('birthsFemale')) +
        Number(watch('birthsUnsexed'))
    )
  }, [watch('birthsMale'), watch('birthsFemale'), watch('birthsUnsexed')])

  //Deaths Total
  useEffect(() => {
    setValue(
      'deathsTotal',
      Number(watch('deathsMale')) +
        Number(watch('deathsFemale')) +
        Number(watch('deathsUnsexed'))
    )
  }, [watch('deathsMale'), watch('deathsFemale'), watch('deathsUnsexed')])

  //Closing Male
  useEffect(() => {
    setValue(
      'closingBalanceMale',
      Number(watch('openingBalanceMale')) +
        Number(watch('birthsMale')) +
        Number(watch('acquisitionMale')) -
        Number(watch('disposalsMale')) -
        Number(watch('deathsMale'))
    )
  }, [
    watch('openingBalanceMale'),
    watch('birthsMale'),
    watch('acquisitionMale'),
    watch('disposalsMale'),
    watch('deathsMale'),
  ])

  //Closing Female
  useEffect(() => {
    setValue(
      'closingBalanceFemale',
      Number(watch('openingBalanceFemale')) +
        Number(watch('birthsFemale')) +
        Number(watch('acquisitionFemale')) -
        Number(watch('disposalsFemale')) -
        Number(watch('deathsFemale'))
    )
  }, [
    watch('openingBalanceFemale'),
    watch('birthsFemale'),
    watch('acquisitionFemale'),
    watch('disposalsFemale'),
    watch('deathsFemale'),
  ])

  //Closing Unsexed
  useEffect(() => {
    setValue(
      'closingBalanceUnsexed',
      Number(watch('openingBalanceUnsexed')) +
        Number(watch('birthsUnsexed')) +
        Number(watch('acquisitionUnsexed')) -
        Number(watch('disposalsUnsexed')) -
        Number(watch('deathsUnsexed'))
    )
  }, [
    watch('openingBalanceUnsexed'),
    watch('birthsUnsexed'),
    watch('acquisitionUnsexed'),
    watch('disposalsUnsexed'),
    watch('deathsUnsexed'),
  ])

  //Closing Total
  useEffect(() => {
    setValue(
      'closingBalanceTotal',
      Number(watch('closingBalanceMale')) +
        Number(watch('closingBalanceFemale')) +
        Number(watch('closingBalanceUnsexed'))
    )
  }, [
    watch('closingBalanceMale'),
    watch('closingBalanceFemale'),
    watch('closingBalanceUnsexed'),
  ])

  useEffect(() => {
    setValue1('dateOfEntry', new Date())

    //Get Schedule
    axios
      .get(`${URLs.VMS}/mstSchedule/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setScheduleDropDown(
          res.data.mstScheduleList.map((j) => ({
            id: j.id,
            scheduleEn: j.scheduleEn,
            scheduleMr: j.scheduleMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
    //Get Class
    axios
      .get(`${URLs.VMS}/mstClass/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setClassDropDown(
          res.data.mstClassList.map((j) => ({
            id: j.id,
            classEn: j.classEn,
            classMr: j.classMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    setLoader(true)
    if (scheduleDropDown?.length > 0 && classDropDown?.length > 0) {
      axios
        .get(`${URLs.VMS}/mstZooAnimal/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setAnimalDropDown(
            res.data.mstZooAnimalList.map((j) => ({
              id: j.id,
              animalNameEn: j.animalNameEn,
              animalNameMr: j.animalNameMr,
              classKey: j.classKey,
              scheduleKey: j.scheduleKey,
              scheduleEn: scheduleDropDown.find(
                (obj) => obj.id === j.scheduleKey
              )?.scheduleEn,
              scheduleMr: scheduleDropDown.find(
                (obj) => obj.id === j.scheduleKey
              )?.scheduleMr,
              classEn: classDropDown.find((obj) => obj.id === j.classKey)
                ?.classEn,
              classMr: classDropDown.find((obj) => obj.id === j.classKey)
                ?.classMr,
            }))
          )
          setLoader(false)
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language)

          setLoader(false)
        })
    }
  }, [scheduleDropDown, classDropDown])

  const editEntry = () => {
    setRemarkField(true)
    const rowData = viewTable.data.find((row) => row?.recent)
    const { dateOfEntry, ...restRowData } = rowData
    setNewDataEntry(true)
    reset({
      ...restRowData,
      openingTotal: !!restRowData?.openingBalanceMale
        ? restRowData?.openingBalanceMale
        : 0 + !!restRowData?.openingBalanceFemale
        ? restRowData?.openingBalanceFemale
        : 0 + !!restRowData?.openingBalanceUnsexed
        ? restRowData?.openingBalanceUnsexed
        : 0,
      birthsTotal: !!restRowData?.birthsMale
        ? restRowData?.birthsMale
        : 0 + !!restRowData?.birthsFemale
        ? restRowData?.birthsFemale
        : 0 + !!restRowData?.birthsUnsexed
        ? restRowData?.birthsUnsexed
        : 0,
      acquisitionTotal: !!restRowData?.acquisitionMale
        ? restRowData?.acquisitionMale
        : 0 + !!restRowData?.acquisitionFemale
        ? restRowData?.acquisitionFemale
        : 0 + !!restRowData?.acquisitionUnsexed
        ? restRowData?.acquisitionUnsexed
        : 0,
      disposalsTotal: !!restRowData?.disposalsMale
        ? restRowData?.disposalsMale
        : 0 + !!restRowData?.disposalsFemale
        ? restRowData?.disposalsFemale
        : 0 + !!restRowData?.disposalsUnsexed
        ? restRowData?.disposalsUnsexed
        : 0,
      deathsTotal: !!restRowData?.deathsMale
        ? restRowData?.deathsMale
        : 0 + !!restRowData?.deathsFemale
        ? restRowData?.deathsFemale
        : 0 + !!restRowData?.deathsUnsexed
        ? restRowData?.deathsUnsexed
        : 0,
      closingBalanceTotal:
        (!!restRowData?.closingBalanceMale
          ? restRowData?.closingBalanceMale
          : 0) +
        (!!restRowData.closingBalanceFemale
          ? restRowData.closingBalanceFemale
          : 0) +
        (!!restRowData.closingBalanceUnsexed
          ? restRowData.closingBalanceUnsexed
          : 0),
    })
  }

  const entryTableData = (animalKey) => {
    setRemarkField(false)
    axios
      .get(`${URLs.VMS}/trnZooInventory/getAnimalDataByAnimalKey`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { animalKey },
      })
      .then((res) => {
        reset({
          openingBalanceMale: !!res.data.male ? res.data.male : 0,
          openingBalanceFemale: !!res.data.female ? res.data.female : 0,
          openingBalanceUnsexed: !!res.data.unsexed ? res.data.unsexed : 0,
          birthsMale: 0,
          birthsFemale: 0,
          birthsUnsexed: 0,
          acquisitionMale: 0,
          acquisitionFemale: 0,
          acquisitionUnsexed: 0,
          disposalsMale: 0,
          disposalsFemale: 0,
          disposalsUnsexed: 0,
          deathsMale: 0,
          deathsFemale: 0,
          deathsUnsexed: 0,
          closingBalanceMale: !!res.data.male ? res.data.male : 0,
          closingBalanceFemale: !!res.data.female ? res.data.female : 0,
          closingBalanceUnsexed: !!res.data.unsexed ? res.data.unsexed : 0,

          openingTotal: !!res.data.male
            ? res.data.male
            : 0 + !!res.data.female
            ? res.data.female
            : 0 + !!res.data.unsexed
            ? res.data.unsexed
            : 0,
          birthsTotal: 0,
          acquisitionTotal: 0,
          disposalsTotal: 0,
          deathsTotal: 0,
          closingBalanceTotal:
            (!!res.data.male ? res.data.male : 0) +
            (!!res.data.female ? res.data.female : 0) +
            (!!res.data.unsexed ? res.data.unsexed : 0),
        })

        setBalance({
          ...res.data,
          total: res.data.male + res.data.female + res.data.unsexed,
        })

        setNewDataEntry(true)
      })
      .catch((error) => {
        if (error.response.status == 401) {
          catchExceptionHandlingMethod(error, language)
        } else {
          sweetAlert(
            language === 'en' ? 'Error!' : 'त्रुटी!',
            language === 'en'
              ? 'Something went wrong fetching balance data'
              : 'शिल्लक डेटा आणताना काहीतरी चूक झाली',
            'error',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
        }
        // setLoadingState(false)
      })
  }

  const viewTableData = (animalKey) => {
    setLoadingState(true)

    axios
      .get(`${URLs.VMS}/trnZooInventory/getAllByAnimalKey`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          animalKey,
          sortBy: 'id',
          sortDir: 'desc',
        },
      })
      .then((res) => {
        if (res.data?.trnZooInventoryList?.length > 0) {
          setViewTable({
            animalKey,
            data: res.data?.trnZooInventoryList.map((j, index) => ({
              ...j,
              // srNo: index + 1,
              recent: index == 0,
              // recent: index == res.data?.trnZooInventoryList.length - 1,
            })),
          })
        } else {
          setViewTable({ animalKey, data: [] })
          sweetAlert(
            language === 'en' ? 'Info!' : 'माहिती!',
            language === 'en'
              ? 'No previous record found'
              : 'मागील रेकॉर्ड आढळले नाही',
            'info',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
        }
        setLoadingState(false)
      })
      .catch((error) => {
        if (error.response.status == 401) {
          catchExceptionHandlingMethod(error, language)
        } else {
          sweetAlert(
            language === 'en' ? 'Error!' : 'त्रुटी!',
            language === 'en'
              ? 'Something went wrong fetching animal data'
              : 'प्राण्यांचा डेटा आणताना काहीतरी चूक झाली',
            'error',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
        }
        setLoadingState(false)
      })
  }

  const fetchData = (searchParams) => {
    setLoadingState(true)
    entryTableData(searchParams.animalKey)
    viewTableData(searchParams.animalKey)
  }

  const saveEntry = (entryData) => {
    const bodyForAPI = {
      ...entryData,
      remark: entryData?.remark ?? '',
      dateOfEntry: moment(watch1('dateOfEntry')).format('YYYY-MM-DD'),
      animalKey: viewTable?.animalKey,
      activeFlag: 'Y',
    }

    sweetAlert({
      title: language === 'en' ? 'Confirmation' : 'पुष्टीकरण',
      text:
        language === 'en'
          ? 'Are you sure you want to save the data ?'
          : 'तुमची खात्री आहे की तुम्ही डेटा जतन करू इच्छिता?',
      icon: 'warning',
      buttons: [
        language === 'en' ? 'Cancel' : 'रद्द करा',
        language === 'en' ? 'Save' : 'जतन करा',
      ],
    }).then((ok) => {
      setLoader(true)
      if (ok) {
        axios
          .post(`${URLs.VMS}/trnZooInventory/save`, bodyForAPI, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            setNewDataEntry(false)
            sweetAlert(
              language === 'en' ? 'Success!' : 'यशस्वी झाले!',
              language === 'en'
                ? 'Animal data successfully updated'
                : 'प्राण्यांचा डेटा यशस्वीरित्या अपडेट केला',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )

            remarkField && setRemarkField(false)
            viewTableData(bodyForAPI.animalKey)

            setLoader(false)
          })
          .catch((error) => {
            if (error.response.statu == 401) {
              catchExceptionHandlingMethod(error, language)
            } else {
              sweetAlert(
                language === 'en' ? 'Error!' : 'त्रुटी!',
                language === 'en'
                  ? 'Something went wrong while updating animal data'
                  : 'प्राण्यांचा डेटा अपडेट करताना काहीतरी चूक झाली',
                'error',
                { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
              )
            }
            setLoader(false)
          })
      }
    })
  }

  return (
    <>
      <Head>
        <title>Zoo Inventory</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {loader && <Loader />}
        <Title titleLabel={<FormattedLabel id='zooInventory' />} />

        <form className={styles.row} onSubmit={handleSubmit(fetchData)}>
          <div>
            <FormControl error={!!error.dateOfEntry}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='dateOfEntry'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      disabled
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='dateOfEntry' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '250px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!error.dateOfEntry}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.dateOfEntry ? error.dateOfEntry.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.animalKey}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='zooAnimal' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='animalKey'
                  >
                    {animalDropDown &&
                      animalDropDown.map((value, index) => (
                        <MenuItem
                          key={index}
                          value={value.id}
                          onClick={() =>
                            setAnimalDetail({
                              classEn:
                                classDropDown?.find(
                                  (j) => j.id == value.classKey
                                )?.classEn ?? '',
                              classMr:
                                classDropDown?.find(
                                  (j) => j.id == value.classKey
                                )?.classMr ?? '',
                              scheduleEn:
                                scheduleDropDown?.find(
                                  (j) => j.id == value.scheduleKey
                                )?.scheduleEn ?? '',
                              scheduleMr:
                                scheduleDropDown?.find(
                                  (j) => j.id == value.scheduleKey
                                )?.scheduleMr ?? '',
                            })
                          }
                        >
                          {language == 'en'
                            ? value?.animalNameEn
                            : value?.animalNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='animalKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.animalKey ? error.animalKey.message : null}
              </FormHelperText>
            </FormControl>

            <label>
              <FormattedLabel id='class' /> :
              <b>
                {language === 'en'
                  ? animalDetail.classEn
                  : animalDetail.classMr}
              </b>
            </label>

            <label>
              <FormattedLabel id='schedule' /> :
              <b>
                {language === 'en'
                  ? animalDetail.scheduleEn
                  : animalDetail.scheduleMr}
              </b>
            </label>
          </div>
          <Button
            disabled={loadingState}
            type='submit'
            variant='contained'
            endIcon={
              loadingState ? (
                <svg className={styles.loader} viewBox='25 25 50 50'>
                  <circle r='20' cy='50' cx='50'></circle>
                </svg>
              ) : (
                <Search />
              )
            }
          >
            <FormattedLabel id='search' />
          </Button>
        </form>

        {/* Entry Table */}
        <Slide
          direction={newDataEntry ? 'down' : 'up'}
          in={newDataEntry}
          mountOnEnter
          unmountOnExit
        >
          <form onSubmit={handleSubmit2(saveEntry)}>
            <table className={styles.table}>
              <tbody>
                <tr className={styles.centerHeader}>
                  <th></th>
                  <th>
                    <FormattedLabel id='male' />
                  </th>
                  <th>
                    <FormattedLabel id='female' />
                  </th>
                  <th>
                    <FormattedLabel id='unsexed' />
                  </th>
                  <th>
                    <FormattedLabel id='total' />
                  </th>
                </tr>
                <tr>
                  <th>
                    <FormattedLabel id='openingBalance' />
                  </th>
                  <td>
                    <input
                      disabled
                      min={0}
                      style={{
                        border: !!error2.openingBalanceMale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('openingBalanceMale')}
                    />
                    <Error error={error2} name='openingBalanceMale' />
                  </td>
                  <td>
                    <input
                      disabled
                      min={0}
                      style={{
                        border: !!error2.openingBalanceFemale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('openingBalanceFemale')}
                    />
                    <Error error={error2} name='openingBalanceFemale' />
                  </td>
                  <td>
                    <input
                      disabled
                      min={0}
                      style={{
                        border: !!error2.openingBalanceUnsexed
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('openingBalanceUnsexed')}
                    />
                    <Error error={error2} name='openingBalanceUnsexed' />
                  </td>

                  <td>
                    <input
                      min={0}
                      disabled
                      style={{
                        border: !!error2.openingTotal
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('openingTotal')}
                    />
                    <Error error={error2} name='openingTotal' />
                  </td>
                </tr>
                <tr>
                  <th>
                    <FormattedLabel id='births' />
                  </th>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.birthsMale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('birthsMale')}
                    />
                    <Error error={error2} name='birthsMale' />
                  </td>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.birthsFemale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('birthsFemale')}
                    />
                    <Error error={error2} name='birthsFemale' />
                  </td>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.birthsUnsexed
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('birthsUnsexed')}
                    />
                    <Error error={error2} name='birthsUnsexed' />
                  </td>

                  <td>
                    <input
                      min={0}
                      disabled
                      style={{
                        border: !!error2.birthsTotal
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('birthsTotal')}
                    />
                    <Error error={error2} name='birthsTotal' />
                  </td>
                </tr>

                <tr>
                  <th>
                    <FormattedLabel id='acquisitions' />
                  </th>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.acquisitionMale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('acquisitionMale')}
                    />
                    <Error error={error2} name='acquisitionMale' />
                  </td>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.acquisitionFemale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('acquisitionFemale')}
                    />
                    <Error error={error2} name='acquisitionFemale' />
                  </td>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.acquisitionUnsexed
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('acquisitionUnsexed')}
                    />
                    <Error error={error2} name='acquisitionUnsexed' />
                  </td>

                  <td>
                    <input
                      min={0}
                      disabled
                      style={{
                        border: !!error2.acquisitionTotal
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('acquisitionTotal')}
                    />
                    <Error error={error2} name='acquisitionTotal' />
                  </td>
                </tr>
                <tr>
                  <th>
                    <FormattedLabel id='disposals' />
                  </th>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.disposalsMale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('disposalsMale')}
                    />
                    <Error error={error2} name='disposalsMale' />
                  </td>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.disposalsFemale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('disposalsFemale')}
                    />
                    <Error error={error2} name='disposalsFemale' />
                  </td>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.disposalsUnsexed
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('disposalsUnsexed')}
                    />
                    <Error error={error2} name='disposalsUnsexed' />
                  </td>

                  <td>
                    <input
                      min={0}
                      disabled
                      style={{
                        border: !!error2.disposalsTotal
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('disposalsTotal')}
                    />
                    <Error error={error2} name='disposalsTotal' />
                  </td>
                </tr>
                <tr>
                  <th>
                    <FormattedLabel id='deaths' />
                  </th>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.deathsMale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      {...register('deathsMale')}
                      type='number'
                    />
                    <Error error={error2} name='deathsMale' />
                  </td>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.deathsFemale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('deathsFemale')}
                    />
                    <Error error={error2} name='deathsFemale' />
                  </td>
                  <td>
                    <input
                      disabled={loadingState}
                      min={0}
                      style={{
                        border: !!error2.deathsUnsexed
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('deathsUnsexed')}
                    />
                    <Error error={error2} name='deathsUnsexed' />
                  </td>

                  <td>
                    <input
                      min={0}
                      disabled
                      style={{
                        border: !!error2.deathsTotal
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('deathsTotal')}
                    />
                    <Error error={error2} name='deathsTotal' />
                  </td>
                </tr>
                <tr>
                  <th>
                    <FormattedLabel id='closingBalance' />
                  </th>
                  <td>
                    <input
                      min={0}
                      disabled
                      {...register('closingBalanceMale')}
                      style={{
                        border: !!error2.closingBalanceMale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                    />
                    <Error error={error2} name='closingBalanceMale' />
                  </td>
                  <td>
                    <input
                      min={0}
                      disabled
                      {...register('closingBalanceFemale')}
                      style={{
                        border: !!error2.closingBalanceFemale
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                    />
                    <Error error={error2} name='closingBalanceFemale' />
                  </td>
                  <td>
                    <input
                      min={0}
                      disabled
                      style={{
                        border: !!error2.closingBalanceUnsexed
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('closingBalanceUnsexed')}
                    />
                    <Error error={error2} name='closingBalanceUnsexed' />
                  </td>
                  <td>
                    <input
                      min={0}
                      disabled
                      style={{
                        border: !!error2.closingBalanceTotal
                          ? '2px solid red'
                          : '1px solid #8080808b',
                      }}
                      type='number'
                      {...register('closingBalanceTotal')}
                    />
                    <Error error={error2} name='closingBalanceTotal' />
                  </td>
                </tr>
              </tbody>
            </table>
            {remarkField && (
              <div className={styles.buttons} style={{ marginBottom: 50 }}>
                <TextField
                  disabled={loadingState}
                  sx={{ width: '500px' }}
                  label={<FormattedLabel id='remark' />}
                  variant='standard'
                  {...register('remark')}
                  error={!!error2.remark}
                  InputLabelProps={{
                    shrink: watch('remark') ? true : false,
                  }}
                  helperText={error2?.remark ? error2.remark.message : null}
                />
              </div>
            )}
            <div className={styles.buttons}>
              <Button
                variant='contained'
                color='success'
                type='submit'
                endIcon={<Save />}
              >
                {viewTable?.data.length > 0 ? (
                  <FormattedLabel id='update' />
                ) : (
                  <FormattedLabel id='save' />
                )}
              </Button>
              <Button
                variant='outlined'
                color='error'
                onClick={() =>
                  reset({
                    openingBalanceMale: watch('openingBalanceMale'),
                    birthsMale: 0,
                    acquisitionMale: 0,
                    disposalsMale: 0,
                    deathsMale: 0,
                    openingBalanceFemale: watch('openingBalanceFemale'),
                    birthsFemale: 0,
                    acquisitionFemale: 0,
                    disposalsFemale: 0,
                    deathsFemale: 0,
                    openingBalanceUnsexed: watch('openingBalanceUnsexed'),
                    birthsUnsexed: 0,
                    acquisitionUnsexed: 0,
                    disposalsUnsexed: 0,
                    deathsUnsexed: 0,
                  })
                }
                endIcon={<Clear />}
              >
                <FormattedLabel id='clear' />
              </Button>
              <Button
                variant='contained'
                color='error'
                onClick={() => router.back()}
                endIcon={<ExitToApp />}
              >
                <FormattedLabel id='exit' />
              </Button>
            </div>
          </form>
        </Slide>

        {/* View Table */}
        {viewTable?.data?.length > 0 && (
          <table className={styles.table}>
            <tbody>
              <tr className={styles.header}>
                {/* <td rowSpan={2}>
                  <FormattedLabel id='srNo' />
                </td> */}

                <td colSpan={3}>
                  <FormattedLabel id='openingBalance' />
                </td>
                <td colSpan={3}>
                  <FormattedLabel id='births' />
                </td>
                <td colSpan={3}>
                  <FormattedLabel id='acquisitions' />
                </td>
                <td colSpan={3}>
                  <FormattedLabel id='disposals' />
                </td>
                <td colSpan={3}>
                  <FormattedLabel id='deaths' />
                </td>
                <td colSpan={3}>
                  <FormattedLabel id='closingBalance' />
                </td>
                <td rowSpan={2}>
                  <FormattedLabel id='actions' />
                </td>
              </tr>
              <tr className={styles.header}>
                <td>
                  <FormattedLabel id='m' />
                </td>
                <td>
                  <FormattedLabel id='f' />
                </td>
                <td>
                  <FormattedLabel id='u' />
                </td>
                <td>
                  <FormattedLabel id='m' />
                </td>
                <td>
                  <FormattedLabel id='f' />
                </td>
                <td>
                  <FormattedLabel id='u' />
                </td>
                <td>
                  <FormattedLabel id='m' />
                </td>
                <td>
                  <FormattedLabel id='f' />
                </td>
                <td>
                  <FormattedLabel id='u' />
                </td>
                <td>
                  <FormattedLabel id='m' />
                </td>
                <td>
                  <FormattedLabel id='f' />
                </td>
                <td>
                  <FormattedLabel id='u' />
                </td>
                <td>
                  <FormattedLabel id='m' />
                </td>
                <td>
                  <FormattedLabel id='f' />
                </td>
                <td>
                  <FormattedLabel id='u' />
                </td>
                <td>
                  <FormattedLabel id='m' />
                </td>
                <td>
                  <FormattedLabel id='f' />
                </td>
                <td>
                  <FormattedLabel id='u' />
                </td>
              </tr>
              {viewTable.data?.map((rows, i) => (
                <tr key={i}>
                  {/* <td style={{ width: 40 }}>{rows.srNo}</td> */}

                  <td>{rows?.openingBalanceMale ?? 0}</td>
                  <td>{rows?.openingBalanceFemale ?? 0}</td>
                  <td>{rows?.openingBalanceUnsexed ?? 0}</td>
                  <td>{rows?.birthsMale ?? 0}</td>
                  <td>{rows?.birthsFemale ?? 0}</td>
                  <td>{rows?.birthsUnsexed ?? 0}</td>
                  <td>{rows?.acquisitionMale ?? 0}</td>
                  <td>{rows?.acquisitionFemale ?? 0}</td>
                  <td>{rows?.acquisitionUnsexed ?? 0}</td>
                  <td>{rows?.disposalsMale ?? 0}</td>
                  <td>{rows?.disposalsFemale ?? 0}</td>
                  <td>{rows?.disposalsUnsexed ?? 0}</td>
                  <td>{rows?.deathsMale ?? 0}</td>
                  <td>{rows?.deathsFemale ?? 0}</td>
                  <td>{rows?.deathsUnsexed ?? 0}</td>
                  <td>{rows?.closingBalanceMale ?? 0}</td>
                  <td>{rows?.closingBalanceFemale ?? 0}</td>
                  <td>{rows?.closingBalanceUnsexed ?? 0}</td>

                  <td style={{ textAlign: 'center' }}>
                    {rows.recent && (
                      <IconButton
                        sx={{ width: 20, height: 20 }}
                        onClick={() => editEntry()}
                      >
                        <Edit style={{ color: '#1976d2' }} />
                      </IconButton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Paper>
    </>
  )
}

export default Index

const Error = ({ error, name }) => {
  return (
    <>
      {!!error[name]?.message && (
        <label className={styles.error}>{error[name].message ?? ''}</label>
      )}
    </>
  )
}

// select id, animalKey from vms.trn_zoo_inventory where id = 86
