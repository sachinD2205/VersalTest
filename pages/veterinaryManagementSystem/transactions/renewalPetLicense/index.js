import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './vet.module.css'
import URLs from '../../../../URLS/urls'

import Paper from '@mui/material/Paper'
import { Button, InputLabel, Select, MenuItem } from '@mui/material'
import { Clear, ExitToApp, Save } from '@mui/icons-material'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'
import TextField from '@mui/material/TextField'
import FormHelperText from '@mui/material/FormHelperText'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import UploadButton from '../../../../containers/reuseableComponents/UploadButton'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import { useSelector } from 'react-redux'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()

  const [enableState, setEnableState] = useState(false)
  const [vaccinationPDF, setVaccinationPDF] = useState('')
  const [animalPhoto, setAnimalPhoto] = useState('')
  const [areaDropDown, setAreaDropDown] = useState([
    {
      id: 1,
      areaEn: '',
      areaMr: '',
    },
  ])

  let petSchema = yup.object().shape({
    petAnimal: yup.number().required('Please select an animal'),
    area: yup.number().required('Please select an area'),
    flatOrHouseNo: yup.string().required('Please enter flat or house no.'),
    buildingName: yup.string().required('Please enter building name'),
    detailAddress: yup.string().required('Please enter detail address'),
    ownerName: yup.string().required('Please enter owner name'),
    mobile: yup.number().required('Please enter mobile no.'),
    emailId: yup.string().required('Please enter email id'),
    petName: yup.string().required('Please enter pet name'),
    petBirthdate: yup
      .string()
      .nullable()
      .required(`Please select pet's birthdate`),
    animalBreed: yup.number().required('Please select an animal breed'),
    animalColor: yup.string().required('Please enter color of the animal'),
    animalAge: yup
      .number()
      .required('Please enter the age of animal (in years)'),
    animalWeight: yup
      .number()
      .required('Please enter the weight of animal (in kg)'),
    animalgender: yup
      .number()
      .required('Please enter the gender of the animal'),
    antiRabiesVaccinationStatus: yup
      .string()
      .required('Please select whether the animal is vaccinated'),
    vaccinationDate: yup
      .string()
      .nullable()
      .required(`Please select pet's birthdate`),

    vetDocName: yup
      .string()
      .required('Please enter name of the veterinary doctor'),
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
    resolver: yupResolver(petSchema),
  })

  useEffect(() => {
    if (animalPhoto !== '' && vaccinationPDF !== '') {
      setEnableState(true)
    } else {
      setEnableState(false)
    }
  }, [animalPhoto, vaccinationPDF])

  useEffect(() => {
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
  }, [])

  const finalSubmit = (data) => {
    const bodyForAPI = {
      ...data,
      vaccinationPDF,
      animalPhoto,
      status: 'Applied',
    }

    axios
      .post(`${URLs.VMS}/trnPetLicence/save`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          sweetAlert('Success!', 'Application saved successfully!', 'success')
        }
      })
      .catch((error) => {
        console.log('error: ', error)
        catchExceptionHandlingMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>Pet License</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id='petLicense' />
        </div>
        <form
          onSubmit={handleSubmit(finalSubmit)}
          style={{ padding: '5vh 3%' }}
        >
          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.petAnimal}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='petAnimal' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='petAnimal'
                  >
                    <MenuItem key={1} value={1}>
                      {language === 'en' ? 'Dog' : 'कुत्रा'}
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                      {language === 'en' ? 'Cat' : 'मांजर'}
                    </MenuItem>
                  </Select>
                )}
                name='petAnimal'
                control={control}
              />
              <FormHelperText>
                {error?.petAnimal ? error.petAnimal.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.area}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='area' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='area'
                  >
                    {areaDropDown &&
                      areaDropDown.map((obj, i) => {
                        return (
                          <>
                            <MenuItem key={i} value={obj.id}>
                              {language === 'en' ? obj.areaEn : obj.areaMr}
                            </MenuItem>
                          </>
                        )
                      })}
                  </Select>
                )}
                name='area'
                control={control}
              />
              <FormHelperText>
                {error?.area ? error.area.message : null}
              </FormHelperText>
            </FormControl>
            <div style={{ width: '250px' }}></div>
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='flatOrHouseNo' />}
              variant='standard'
              {...register('flatOrHouseNo')}
              error={!!error.flatOrHouseNo}
              helperText={
                error?.flatOrHouseNo ? error.flatOrHouseNo.message : null
              }
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='buildingName' />}
              variant='standard'
              {...register('buildingName')}
              error={!!error.buildingName}
              helperText={
                error?.buildingName ? error.buildingName.message : null
              }
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='detailAddress' />}
              variant='standard'
              {...register('detailAddress')}
              error={!!error.detailAddress}
              helperText={
                error?.detailAddress ? error.detailAddress.message : null
              }
            />
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='ownerName' />}
              variant='standard'
              {...register('ownerName')}
              error={!!error.ownerName}
              helperText={error?.ownerName ? error.ownerName.message : null}
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='mobileNo' />}
              type='number'
              variant='standard'
              {...register('mobile')}
              error={!!error.mobile}
              helperText={error?.mobile ? error.mobile.message : null}
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='emailId' />}
              variant='standard'
              {...register('emailId')}
              error={!!error.emailId}
              helperText={error?.emailId ? error.emailId.message : null}
            />
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='petName' />}
              variant='standard'
              {...register('petName')}
              error={!!error.petName}
              helperText={error?.petName ? error.petName.message : null}
            />
            <FormControl error={!!error.petBirthdate}>
              <Controller
                control={control}
                name='petBirthdate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='petBirthdate' />}
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '250px' }}
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
                {error?.petBirthdate ? error.petBirthdate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.animalBreed}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='animalBreed' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='animalBreed'
                  >
                    <MenuItem key={1} value={1}>
                      First Breed
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                      Second Breed
                    </MenuItem>
                    <MenuItem key={3} value={3}>
                      Third Breed
                    </MenuItem>
                  </Select>
                )}
                name='animalBreed'
                control={control}
              />
              <FormHelperText>
                {error?.animalBreed ? error.animalBreed.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='animalColor' />}
              variant='standard'
              {...register('animalColor')}
              error={!!error.animalColor}
              helperText={error?.animalColor ? error.animalColor.message : null}
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='animalAge' />}
              type='number'
              variant='standard'
              {...register('animalAge')}
              error={!!error.animalAge}
              helperText={error?.animalAge ? error.animalAge.message : null}
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='animalWeight' />}
              type='number'
              variant='standard'
              {...register('animalWeight')}
              error={!!error.animalWeight}
              helperText={
                error?.animalWeight ? error.animalWeight.message : null
              }
            />
          </div>
          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.animalgender}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='animalGender' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='animalgender'
                  >
                    <MenuItem key={1} value={1}>
                      {language === 'en' ? 'Male' : 'पुरुष'}
                    </MenuItem>
                    <MenuItem key={2} value={2}>
                      {language === 'en' ? 'Female' : 'स्त्री'}
                    </MenuItem>
                  </Select>
                )}
                name='animalgender'
                control={control}
              />
              <FormHelperText>
                {error?.animalgender ? error.animalgender.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div className={styles.row}>
            <FormControl
              variant='standard'
              error={!!error.antiRabiesVaccinationStatus}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='antiRabiesVaccinationStatus' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='antiRabiesVaccinationStatus'
                  >
                    <MenuItem key={1} value={'yes'}>
                      {language === 'en' ? 'Yes' : 'हो'}
                    </MenuItem>
                    <MenuItem key={2} value={'no'}>
                      {language === 'en' ? 'No' : 'नाही'}
                    </MenuItem>
                  </Select>
                )}
                name='antiRabiesVaccinationStatus'
                control={control}
              />
              <FormHelperText>
                {error?.antiRabiesVaccinationStatus
                  ? error.antiRabiesVaccinationStatus.message
                  : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.vaccinationDate}>
              <Controller
                control={control}
                name='vaccinationDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='vaccinationDate' />}
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(
                          moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '250px' }}
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
                {error?.vaccinationDate ? error.vaccinationDate.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='veterinaryDoctorsName' />}
              variant='standard'
              {...register('vetDocName')}
              error={!!error.vetDocName}
              helperText={error?.vetDocName ? error.vetDocName.message : null}
            />
          </div>

          <div className={styles.subTitle}>
            <FormattedLabel id='documents' />
          </div>
          <div className={styles.row} style={{ marginTop: '3%' }}>
            <UploadButton
              appName='TP'
              serviceName='PARTMAP'
              label={<FormattedLabel id='vaccinationPDF' />}
              filePath={vaccinationPDF}
              fileUpdater={setVaccinationPDF}
            />
            <UploadButton
              appName='TP'
              serviceName='PARTMAP'
              label={<FormattedLabel id='animalPhoto' />}
              filePath={animalPhoto}
              fileUpdater={setAnimalPhoto}
            />
            <div style={{ width: '250px' }}></div>
          </div>
          <div className={styles.buttons}>
            <Button
              disabled={!enableState}
              color='success'
              variant='contained'
              type='submit'
              endIcon={<Save />}
            >
              <FormattedLabel id='save' />
            </Button>
            <Button variant='outlined' color='error' endIcon={<Clear />}>
              <FormattedLabel id='clear' />
            </Button>
            <Button
              variant='contained'
              color='error'
              endIcon={<ExitToApp />}
              onClick={() => {
                router.back()
              }}
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
