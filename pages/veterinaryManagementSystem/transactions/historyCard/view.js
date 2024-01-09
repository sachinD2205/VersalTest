import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './historyCard.module.css'

import Title from '../../../../containers/VMS_ReusableComponents/Title'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  TextareaAutosize,
} from '@mui/material'
// import sweetAlert from 'sweetalert'
import Breadcrumb from '../../../../components/common/BreadcrumbComponent'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import axios from 'axios'
import urls from '../../../../URLS/urls'
import { sortByAsc } from '../../../../containers/reuseableComponents/Sorter'
import moment from 'moment'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const View = () => {
  const language = useSelector((state) => state?.labels.language)
  const userToken = useGetToken()

  const [checkboxState, setCheckboxState] = useState({
    tempTest: false,
    fecalTest: false,
    urineTest: false,
    pathologicalTest: false,
  })

  const [animalClass, setAnimalClass] = useState([])
  const [animalFamily, setAnimalFamily] = useState([])
  const [speciesName, setSpeciesName] = useState([])

  let schema = yup.object().shape({})

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    //Animal Class
    axios
      .get(`${urls.VMS}/mstClass/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        sortByAsc(res.data.mstClassList, 'classEn')
        setAnimalClass(
          res.data?.mstClassList?.map((j) => ({
            id: j?.id,
            classEn: j?.classEn,
            classMr: j?.classMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Zoo Animals (Species Name)
    axios
      .get(`${urls.VMS}/mstZooAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        sortByAsc(res.data.mstZooAnimalList, 'animalNameEn')

        setSpeciesName(
          res.data?.mstZooAnimalList?.map((j) => ({
            id: j?.id,
            animalNameEn: j?.animalNameEn,
            animalNameMr: j?.animalNameMr,
            scheduleKey: j?.scheduleKey,
            classKey: j?.classKey,
            familyKey: j?.familyKey,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Animal Family
    axios
      .get(`${urls.VMS}/mstAnimalFamily/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        sortByAsc(res.data.mstAnimalFamilyDaoList, 'familyEn')

        setAnimalFamily(
          res.data?.mstAnimalFamilyDaoList?.map((j) => ({
            id: j?.id,
            familyNameEn: j?.familyEn,
            familyNameMr: j?.familyMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    if (!!router.query.id) {
      axios
        .get(`${urls.VMS}/trnAnimalHistoryCard/getById`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { id: router.query.id },
        })
        .then((res) => {
          reset(res.data)
          setCheckboxState({
            tempTest: !!res.data?.tempTest,
            fecalTest: !!res.data?.fecalTest,
            urineTest: !!res.data?.urineTest,
            pathologicalTest: !!res.data?.pathologicalTest,
          })
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language)
        })
    }
  }, [animalClass, animalFamily, speciesName])

  useEffect(() => {
    !watch('tempTestBoolean') && !router.query?.id && setValue('tempTest', null)
    !watch('fecalTestBoolean') &&
      !router.query?.id &&
      setValue('fecalTest', null)
    !watch('urineTestBoolean') &&
      !router.query?.id &&
      setValue('urineTest', null)
    !watch('pathologicalTestBoolean') &&
      !router.query?.id &&
      setValue('pathologicalTest', null)

    setCheckboxState({
      tempTest: watch('tempTestBoolean'),
      fecalTest: watch('fecalTestBoolean'),
      urineTest: watch('urineTestBoolean'),
      pathologicalTest: watch('pathologicalTestBoolean'),
    })
  }, [
    watch('tempTestBoolean'),
    watch('fecalTestBoolean'),
    watch('urineTestBoolean'),
    watch('pathologicalTestBoolean'),
  ])

  //Resets Acquisition Details data when unchecked
  useEffect(() => {
    if (!watch('acquisitionDetails')) {
      setValue('dateOfAcquisition', null)
      setValue('acquirerName', null)
      setValue('acquirerAddress', null)
      setValue('acquisitionMode', '')
      setValue('animalWeight', null)
      setValue('animalGeneralCondition', null)

      setCheckboxState({
        tempTest: false,
        fecalTest: false,
        urineTest: false,
        pathologicalTest: false,
      })
    }
  }, [watch('acquisitionDetails')])

  //Resets Quarantine data when unchecked
  useEffect(() => {
    if (!watch('quarantineData')) {
      setValue('arrivalDate', null)

      setValue('tempTestBoolean', false)
      setValue('fecalTestBoolean', false)
      setValue('urineTestBoolean', false)
      setValue('pathologicalTestBoolean', false)

      setValue('tempTest', null)
      setValue('fecalTest', null)
      setValue('urineTest', null)
      setValue('pathologicalTest', null)

      setValue('testResult', null)
      setValue('treatment', null)
    }
  }, [watch('quarantineData')])

  //Resets disposal details
  useEffect(() => {
    if (!watch('disposal')) {
      setValue('disposalMethod', null)
      // setValue('disposalDate', null)
      setValue('disposerName', null)
      setValue('disposerAddress', null)

      setValue('causeOfDeath', null)
      setValue('postmortemFindings', null)
      setValue('postMortemReportNo', null)
    }
  }, [watch('disposal')])

  //Resets dynamic disposal METHOD details
  useEffect(() => {
    if (watch('disposalMethod') == 'death') {
      // setValue('disposalDate', null)
      setValue('disposerName', null)
      setValue('disposerAddress', null)
    } else {
      setValue('causeOfDeath', null)
      setValue('postmortemFindings', null)
      setValue('postMortemReportNo', null)
    }
  }, [watch('disposalMethod')])

  //Resets Carcass Disposal Details
  useEffect(() => {
    if (!watch('carcassDisposal')) {
      setValue('carcassDisposalMethod', null)
      setValue('organRemoved', null)
      setValue('organDonationDetails', null)
    }
  }, [watch('carcassDisposal')])

  const clearData = () => {
    reset({})
  }

  const finalSubmit = (data) => {
    const bodyForAPI = {
      ...data,
      dateAcquiredOrReceived: !!data?.dateAcquiredOrReceived
        ? moment(data?.dateAcquiredOrReceived).format('YYYY-MM-DD')
        : null,
      applicationDate: !!data?.applicationDate
        ? moment(data?.applicationDate).format('YYYY-MM-DD')
        : null,
      arrivalDate: !!data?.arrivalDate
        ? moment(data?.arrivalDate).format('YYYY-MM-DD')
        : null,
      dateOfAcquisition: !!data?.dateOfAcquisition
        ? moment(data?.dateOfAcquisition).format('YYYY-MM-DD')
        : null,
      disposalDate: !!data?.disposalDate
        ? moment(data?.disposalDate).format('YYYY-MM-DD')
        : null,
    }
    console.log('Data: ', bodyForAPI)

    axios
      .post(`${urls.VMS}/trnAnimalHistoryCard/save`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          sweetAlert(
            'Saved',
            data?.id
              ? 'Data updated succes60sfully'
              : 'Data saved successfully',
            'success'
          )
          router.push(`/veterinaryManagementSystem/transactions/historyCard`)
        }
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>Animal History Card</title>
      </Head>
      <Breadcrumb />
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='animalHistoryCard' />} />

        <form onSubmit={handleSubmit(finalSubmit)}>
          <Paper className={styles.fieldsWrapper}>
            <FormControl
              disabled={!!router.query.id}
              variant='standard'
              error={!!error.speciesKey}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='speciesName' />
              </InputLabel>
              {/* @ts-ignore */}
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
                        'familyKey',
                        speciesName?.find(
                          (obj) => obj?.id == value.target.value
                        )?.familyKey
                      )
                      setValue(
                        'classKey',
                        speciesName?.find(
                          (obj) => obj?.id == value.target.value
                        )?.classKey
                      )
                    }}
                    label='speciesKey'
                  >
                    {speciesName?.map((obj) => (
                      <MenuItem key={obj?.id} value={obj?.id}>
                        {language == 'en'
                          ? obj?.animalNameEn
                          : obj?.animalNameMr}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name='speciesKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.speciesKey ? error.speciesKey.message : null}
              </FormHelperText>
            </FormControl>

            <FormControl
              disabled
              // disabled={!!router.query.id}
              variant='standard'
              error={!!error.familyKey}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='family' />
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
                    label='familyKey'
                  >
                    {animalFamily?.map((j) => (
                      <MenuItem key={j?.id} value={j?.id}>
                        {language == 'en' ? j?.familyNameEn : j?.familyNameMr}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name='familyKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.familyKey ? error.familyKey.message : null}
              </FormHelperText>
            </FormControl>

            <FormControl
              disabled
              // disabled={!!router.query.id}
              variant='standard'
              error={!!error.classKey}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='class' />
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
                    label='classKey'
                  >
                    {animalClass?.map((obj) => (
                      <MenuItem key={obj?.id} value={obj?.id}>
                        {language == 'en' ? obj?.classEn : obj?.classMr}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name='classKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.classKey ? error.classKey.message : null}
              </FormHelperText>
            </FormControl>

            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='order' />}
              variant='standard'
              {...register('order')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('order'),
              }}
              error={!!error.order}
              helperText={error?.order ? error.order.message : null}
            />

            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='commonName' />}
              variant='standard'
              {...register('commonName')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('commonName'),
              }}
              error={!!error.commonName}
              helperText={error?.commonName ? error.commonName.message : null}
            />
            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='houseName' />}
              variant='standard'
              {...register('houseName')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('houseName'),
              }}
              error={!!error.houseName}
              helperText={error?.houseName ? error.houseName.message : null}
            />

            <FormControl
              disabled={!!router.query.id}
              variant='standard'
              error={!!error.sex}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='sex' />
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
                    label='sex'
                  >
                    <MenuItem key={1} value={'male'}>
                      {language === 'en' ? 'Male' : 'पुरुष'}
                    </MenuItem>
                    <MenuItem key={2} value={'female'}>
                      {language === 'en' ? 'Female' : 'स्त्री'}
                    </MenuItem>
                  </Select>
                )}
                name='sex'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.sex ? error.sex.message : null}
              </FormHelperText>
            </FormControl>

            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='identificationMark' />}
              variant='standard'
              {...register('identificationMark')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('identificationMark'),
              }}
              error={!!error.identificationMark}
              helperText={
                error?.identificationMark
                  ? error.identificationMark.message
                  : null
              }
            />
            <FormControl error={!!error.dateAcquiredOrReceived}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='dateAcquiredOrReceived'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disabled={!!router.query.id}
                      disableFuture
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='dateAcquiredOrReceived' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 250 }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!error.dateAcquiredOrReceived}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.dateAcquiredOrReceived
                  ? error.dateAcquiredOrReceived.message
                  : null}
              </FormHelperText>
            </FormControl>

            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='animalAge' />}
              variant='standard'
              {...register('age')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('age'),
              }}
              error={!!error.age}
              helperText={error?.age ? error.age.message : null}
            />
            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='animalStockOrRegisterNo' />}
              variant='standard'
              {...register('animalStockOrRegisterNo')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('animalStockOrRegisterNo'),
              }}
              error={!!error.animalStockOrRegisterNo}
              helperText={
                error?.animalStockOrRegisterNo
                  ? error.animalStockOrRegisterNo.message
                  : null
              }
            />
            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='pageNo' />}
              variant='standard'
              {...register('pageNo')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('pageNo'),
              }}
              error={!!error.pageNo}
              helperText={error?.pageNo ? error.pageNo.message : null}
            />
            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='studbookNo' />}
              variant='standard'
              {...register('studbookNo')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('studbookNo'),
              }}
              error={!!error.studbookNo}
              helperText={error?.studbookNo ? error.studbookNo.message : null}
            />
            <TextField
              disabled={!!router.query.id}
              sx={{ width: 250 }}
              label={<FormattedLabel id='whereKept' />}
              variant='standard'
              {...register('whereKept')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('whereKept'),
              }}
              error={!!error.whereKept}
              helperText={error?.whereKept ? error.whereKept.message : null}
            />
            <div style={{ width: 250 }} />
            <div style={{ width: 250 }} />
          </Paper>

          <Paper className={styles.fieldsWrapper}>
            <div style={{ width: '100%' }}>
              <FormControl disabled={!!router.query.id}>
                <FormControlLabel
                  label={<FormattedLabel id='acquisitionDetails' />}
                  control={
                    <Checkbox
                      {...register('acquisitionDetails')}
                      checked={!!watch('acquisitionDetails')}
                    />
                  }
                />
              </FormControl>
            </div>
            <FormControl error={!!error.dateOfAcquisition}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='dateOfAcquisition'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disabled={
                        !!router.query.id || !watch('acquisitionDetails')
                      }
                      disableFuture
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='dateOfAcquisition' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 250 }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!error.dateOfAcquisition}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.dateOfAcquisition
                  ? error.dateOfAcquisition.message
                  : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={!!router.query.id || !watch('acquisitionDetails')}
              sx={{ width: 250 }}
              label={<FormattedLabel id='acquirerName' />}
              variant='standard'
              {...register('acquirerName')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('acquirerName'),
              }}
              error={!!error.acquirerName}
              helperText={
                error?.acquirerName ? error.acquirerName.message : null
              }
            />
            <TextField
              disabled={!!router.query.id || !watch('acquisitionDetails')}
              sx={{ width: 250 }}
              label={<FormattedLabel id='acquirerAddress' />}
              variant='standard'
              {...register('acquirerAddress')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('acquirerAddress'),
              }}
              error={!!error.acquirerAddress}
              helperText={
                error?.acquirerAddress ? error.acquirerAddress.message : null
              }
            />
            <FormControl
              disabled={!!router.query.id || !watch('acquisitionDetails')}
              variant='standard'
              error={!!error.acquisitionMode}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='acquisitionMode' />
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
                    label='acquisitionMode'
                  >
                    <MenuItem key={1} value={'birth'}>
                      {language === 'en' ? 'Birth' : 'जन्म'}
                    </MenuItem>
                    <MenuItem key={2} value={'donation'}>
                      {language === 'en' ? 'Donation' : 'दान'}
                    </MenuItem>
                    <MenuItem key={3} value={'exchange'}>
                      {language === 'en' ? 'Exchange' : 'देवाणघेवाण'}
                    </MenuItem>
                    <MenuItem key={4} value={'exchange'}>
                      {language === 'en' ? 'Breeding Loan' : 'प्रजनन कर्ज'}
                    </MenuItem>
                  </Select>
                )}
                name='acquisitionMode'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.acquisitionMode ? error.acquisitionMode.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              disabled={!!router.query.id || !watch('acquisitionDetails')}
              sx={{ width: 250 }}
              label={<FormattedLabel id='animalWeight' />}
              variant='standard'
              {...register('animalWeight')}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('animalWeight'),
              }}
              error={!!error.animalWeight}
              helperText={
                error?.animalWeight ? error.animalWeight.message : null
              }
            />
            <TextField
              disabled={!!router.query.id || !watch('acquisitionDetails')}
              sx={{ width: 250 }}
              label={<FormattedLabel id='animalGeneralCondition' />}
              variant='standard'
              {...register('animalGeneralCondition')}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('animalGeneralCondition'),
              }}
              error={!!error.animalGeneralCondition}
              helperText={
                error?.animalGeneralCondition
                  ? error.animalGeneralCondition.message
                  : null
              }
            />
            <div style={{ width: 250 }} />
            <div style={{ width: 250 }} />
          </Paper>

          <Paper className={styles.fieldsWrapper}>
            <div style={{ width: '100%' }}>
              <FormControl disabled={!!router.query.id}>
                <FormControlLabel
                  label={<FormattedLabel id='quarantineData' />}
                  control={
                    <Checkbox
                      {...register('quarantineData')}
                      checked={!!watch('quarantineData')}
                    />
                  }
                />
              </FormControl>
            </div>
            <div className={styles.row}>
              <FormControl error={!!error.arrivalDate}>
                {/* @ts-ignore */}
                <Controller
                  control={control}
                  name='arrivalDate'
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled={!!router.query.id || !watch('quarantineData')}
                        disableFuture
                        inputFormat='dd/MM/yyyy'
                        label={<FormattedLabel id='arrivalDate' />}
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 250 }}
                            {...params}
                            size='small'
                            fullWidth
                            variant='standard'
                            error={!!error.arrivalDate}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {error?.arrivalDate ? error.arrivalDate.message : null}
                </FormHelperText>
              </FormControl>
              <div className={styles.checkBoxDiv}>
                <label
                  style={{
                    opacity:
                      !!router.query.id || !watch('quarantineData') ? 0.5 : 1,
                  }}
                >
                  <FormattedLabel id='testsConducted' />:
                </label>
                <FormControl
                  disabled={!!router.query.id || !watch('quarantineData')}
                >
                  <FormControlLabel
                    label={<FormattedLabel id='temperature' />}
                    control={
                      <Checkbox
                        {...register('tempTestBoolean')}
                        checked={checkboxState?.tempTest}
                      />
                    }
                  />
                </FormControl>
                <FormControl
                  disabled={!!router.query.id || !watch('quarantineData')}
                >
                  <FormControlLabel
                    label={<FormattedLabel id='fecal' />}
                    control={
                      <Checkbox
                        {...register('fecalTestBoolean')}
                        checked={checkboxState?.fecalTest}
                      />
                    }
                  />
                </FormControl>
                <FormControl
                  disabled={!!router.query.id || !watch('quarantineData')}
                >
                  <FormControlLabel
                    label={<FormattedLabel id='urine' />}
                    control={
                      <Checkbox
                        {...register('urineTestBoolean')}
                        checked={checkboxState?.urineTest}
                      />
                    }
                  />
                </FormControl>
                <FormControl
                  disabled={!!router.query.id || !watch('quarantineData')}
                >
                  <FormControlLabel
                    label={<FormattedLabel id='pathological' />}
                    control={
                      <Checkbox
                        {...register('pathologicalTestBoolean')}
                        checked={checkboxState?.pathologicalTest}
                      />
                    }
                  />
                </FormControl>
              </div>
            </div>
            <TextField
              disabled={!!router.query.id || !watch('tempTestBoolean')}
              sx={{ width: '100%' }}
              label={<FormattedLabel id='temperature' />}
              variant='standard'
              {...register('tempTest')}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('tempTest'),
              }}
              error={!!error.tempTest}
              helperText={error?.tempTest ? error.tempTest.message : null}
            />
            <TextField
              disabled={!!router.query.id || !watch('fecalTestBoolean')}
              sx={{ width: '100%' }}
              label={<FormattedLabel id='fecal' />}
              variant='standard'
              {...register('fecalTest')}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('fecalTest'),
              }}
              error={!!error.fecalTest}
              helperText={error?.fecalTest ? error.fecalTest.message : null}
            />
            <TextField
              disabled={!!router.query.id || !watch('urineTestBoolean')}
              sx={{ width: '100%' }}
              label={<FormattedLabel id='urine' />}
              variant='standard'
              {...register('urineTest')}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('urineTest'),
              }}
              error={!!error.urineTest}
              helperText={error?.urineTest ? error.urineTest.message : null}
            />
            <TextField
              disabled={!!router.query.id || !watch('pathologicalTestBoolean')}
              sx={{ width: '100%' }}
              label={<FormattedLabel id='pathological' />}
              variant='standard'
              {...register('pathologicalTest')}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('pathologicalTest'),
              }}
              error={!!error.pathologicalTest}
              helperText={
                error?.pathologicalTest ? error.pathologicalTest.message : null
              }
            />
            <TextField
              disabled={!!router.query.id}
              sx={{ width: '100%', marginTop: '10px' }}
              label={<FormattedLabel id='testResult' />}
              variant='standard'
              {...register('testResult')}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('testResult'),
              }}
              error={!!error.testResult}
              helperText={error?.testResult ? error.testResult.message : null}
            />
            <TextField
              disabled={!!router.query.id}
              sx={{ width: '100%' }}
              label={<FormattedLabel id='treatment' />}
              variant='standard'
              {...register('treatment')}
              InputLabelProps={{
                shrink: !!router.query.id || !!watch('treatment'),
              }}
              error={!!error.treatment}
              helperText={error?.treatment ? error.treatment.message : null}
            />
          </Paper>

          <Paper className={styles.fieldsWrapper} style={{ marginTop: '50px' }}>
            <FormControl error={!!error.applicationDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='applicationDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disabled={!!router.query.id}
                      disableFuture
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='applicationDate' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 250 }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!error.applicationDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.applicationDate ? error.applicationDate.message : null}
              </FormHelperText>
            </FormControl>

            <div style={{ width: '100%' }}>
              <span
                className={styles.bigTextLabel}
                style={{
                  opacity: router.query.id ? 0.5 : 0.8,
                  color: !!error.recordDetails ? 'red' : 'black',
                }}
              >
                <FormattedLabel id='recordDetails' /> :
              </span>
              {/* @ts-ignore */}
              <TextareaAutosize
                style={{
                  opacity: !!router.query.id ? 0.5 : 1,
                  border: !!error.recordDetails
                    ? '1.5px solid red'
                    : '1.5px solid grey',
                }}
                color='neutral'
                disabled={!!router.query.id}
                minRows={3}
                maxRows={10}
                placeholder={
                  language === 'en'
                    ? 'Record of observations regarding behaviour, reproduction, health, treatment, etc'
                    : 'वर्तन, पुनरुत्पादन, आरोग्य, उपचार इत्यादींसंबंधी निरीक्षणांची नोंद'
                }
                className={styles.bigText}
                {...register('recordDetails')}
              />
            </div>
          </Paper>
          <Paper className={styles.fieldsWrapper}>
            <div className={styles.checkBoxDiv} style={{ width: '100%' }}>
              <FormControl disabled={!!router.query.id}>
                <FormControlLabel
                  label={<FormattedLabel id='disposal' />}
                  control={
                    <Checkbox
                      {...register('disposal')}
                      checked={!!watch('disposal')}
                    />
                  }
                />
              </FormControl>
              :
              <FormControl disabled={!!router.query.id || !watch('disposal')}>
                <Controller
                  name='disposalMethod'
                  control={control}
                  // defaultValue='exchanged'
                  defaultValue={null}
                  render={({ field }) => (
                    <RadioGroup className={styles.radioDiv} {...field} row>
                      {[
                        'exchanged',
                        'sold',
                        'donated',
                        'breedingLoan',
                        'death',
                      ].map((j) => (
                        <FormControlLabel
                          value={j}
                          control={<Radio />}
                          label={<FormattedLabel id={j} />}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </div>
            {watch('disposalMethod') != 'death' ? (
              <>
                <FormControl error={!!error.disposalDate}>
                  {/* @ts-ignore */}
                  <Controller
                    control={control}
                    name='disposalDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disabled={!!router.query.id || !watch('disposal')}
                          disableFuture
                          inputFormat='dd/MM/yyyy'
                          label={<FormattedLabel id='disposalDate' />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: 250 }}
                              {...params}
                              size='small'
                              fullWidth
                              variant='standard'
                              error={!!error.disposalDate}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {error?.disposalDate ? error.disposalDate.message : null}
                  </FormHelperText>
                </FormControl>

                <TextField
                  disabled={!!router.query.id || !watch('disposal')}
                  sx={{ width: 350 }}
                  label={<FormattedLabel id='disposerName' />}
                  variant='standard'
                  {...register('disposerName')}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch('disposerName'),
                  }}
                  error={!!error.disposerName}
                  helperText={
                    error?.disposerName ? error.disposerName.message : null
                  }
                />
                <TextField
                  disabled={!!router.query.id || !watch('disposal')}
                  sx={{ width: 350 }}
                  label={<FormattedLabel id='disposerAddress' />}
                  variant='standard'
                  {...register('disposerAddress')}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch('disposerAddress'),
                  }}
                  error={!!error.disposerAddress}
                  helperText={
                    error?.disposerAddress
                      ? error.disposerAddress.message
                      : null
                  }
                />
              </>
            ) : (
              <>
                <FormControl error={!!error.disposalDate}>
                  {/* @ts-ignore */}
                  <Controller
                    control={control}
                    name='disposalDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disabled={!!router.query.id || !watch('disposal')}
                          disableFuture
                          inputFormat='dd/MM/yyyy'
                          label={<FormattedLabel id='dateOfDeath' />}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: 250 }}
                              {...params}
                              size='small'
                              fullWidth
                              variant='standard'
                              error={!!error.disposalDate}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {error?.disposalDate ? error.disposalDate.message : null}
                  </FormHelperText>
                </FormControl>
                <TextField
                  disabled={!!router.query.id || !watch('disposal')}
                  sx={{ width: 250 }}
                  label={<FormattedLabel id='causeOfDeath' />}
                  variant='standard'
                  {...register('causeOfDeath')}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch('causeOfDeath'),
                  }}
                  error={!!error.causeOfDeath}
                  helperText={
                    error?.causeOfDeath ? error.causeOfDeath.message : null
                  }
                />
                <TextField
                  disabled={!!router.query.id || !watch('disposal')}
                  sx={{ width: 250 }}
                  label={<FormattedLabel id='postmortemFindings' />}
                  variant='standard'
                  {...register('postmortemFindings')}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch('postmortemFindings'),
                  }}
                  error={!!error.postmortemFindings}
                  helperText={
                    error?.postmortemFindings
                      ? error.postmortemFindings.message
                      : null
                  }
                />
                <TextField
                  disabled={!!router.query.id || !watch('disposal')}
                  sx={{ width: 250 }}
                  label={<FormattedLabel id='postMortemReportNo' />}
                  variant='standard'
                  {...register('postMortemReportNo')}
                  InputLabelProps={{
                    shrink: !!router.query.id || watch('postMortemReportNo'),
                  }}
                  error={!!error.postMortemReportNo}
                  helperText={
                    error?.postMortemReportNo
                      ? error.postMortemReportNo.message
                      : null
                  }
                />
              </>
            )}
          </Paper>

          <Paper className={styles.fieldsWrapper}>
            <div className={styles.checkBoxDiv}>
              <FormControl disabled={!!router.query.id}>
                <FormControlLabel
                  label={<FormattedLabel id='carcassDisposal' />}
                  control={
                    <Checkbox
                      {...register('carcassDisposal')}
                      checked={!!watch('carcassDisposal')}
                    />
                  }
                />
              </FormControl>
              :
              <FormControl
                disabled={!!router.query.id || !watch('carcassDisposal')}
              >
                <Controller
                  name='carcassDisposalMethod'
                  control={control}
                  // defaultValue='burial'
                  defaultValue={null}
                  render={({ field }) => (
                    <RadioGroup className={styles.radioDiv} {...field} row>
                      {['burial', 'cremation'].map((j) => (
                        <FormControlLabel
                          value={j}
                          control={<Radio />}
                          label={<FormattedLabel id={j} />}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </div>
            <TextField
              disabled={!!router.query.id || !watch('carcassDisposal')}
              sx={{ width: '100%' }}
              label={<FormattedLabel id='organRemoved' />}
              variant='standard'
              {...register('organRemoved')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('organRemoved'),
              }}
              error={!!error.organRemoved}
              helperText={
                error?.organRemoved ? error.organRemoved.message : null
              }
            />
            <TextField
              disabled={!!router.query.id || !watch('carcassDisposal')}
              sx={{ width: '100%' }}
              label={<FormattedLabel id='organDonationDetails' />}
              variant='standard'
              {...register('organDonationDetails')}
              InputLabelProps={{
                shrink: !!router.query.id || watch('organDonationDetails'),
              }}
              error={!!error.organDonationDetails}
              helperText={
                error?.organDonationDetails
                  ? error.organDonationDetails.message
                  : null
              }
            />
          </Paper>

          <div className={styles.bttnGrp}>
            {!router.query.id && (
              <>
                <Button
                  endIcon={<Save />}
                  type='submit'
                  color='success'
                  variant='contained'
                >
                  <FormattedLabel id='save' />
                </Button>
                <Button
                  endIcon={<Clear />}
                  variant='outlined'
                  color='error'
                  onClick={() => clearData()}
                >
                  <FormattedLabel id='clear' />
                </Button>
              </>
            )}
            <Button
              endIcon={<ExitToApp />}
              variant='contained'
              color='error'
              onClick={() =>
                router.push(
                  '/veterinaryManagementSystem/transactions/historyCard'
                )
              }
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
