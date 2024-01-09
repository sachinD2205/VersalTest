import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import styles from './report.module.css'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@mui/material'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { yupResolver } from '@hookform/resolvers/yup'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import axios from 'axios'
import { useSelector } from 'react-redux'
import URLs from '../../../URLS/urls'
import { Clear, Print, Search } from '@mui/icons-material'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import ReportLayout from '../../../containers/reuseableComponents/ReportLayout'
import Breadcrumb from '../../../components/common/BreadcrumbComponent'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const componentRef = useRef(null)

  const animalGenders = [
    { id: 1, value: 'Male', genderEn: 'Male', genderMr: 'पुरुष' },
    { id: 2, value: 'Female', genderEn: 'Female', genderMr: 'स्त्री' },
  ]

  const [areaDropDown, setAreaDropDown] = useState([])
  const [zoneDropDown, setZoneDropDown] = useState([])
  const [wardDropDown, setWardDropDown] = useState([])
  const [petAnimal, setPetAnimal] = useState([])
  const [petBreeds, setPetBreeds] = useState([])
  const [table, setTable] = useState([])

  const schema = yup.object().shape({
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
  })

  const {
    control,
    reset,
    register,
    watch,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: language == 'en' ? 'Generic Report' : 'सामान्य अहवाल',
  })

  useEffect(() => {
    getZones()

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
            petAnimalKey: j.petAnimalKey,
            breedEn: j.breedNameEn,
            breedMr: j.breedNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    console.log('TableData: ', table)
  }, [table])

  const columns = [
    {
      field: 'srNo',
      formattedLabel: 'srNo',
      width: 30,
    },
    {
      field: language == 'en' ? 'zone' : 'zoneMr',
      formattedLabel: 'zone',
      width: 60,
    },
    {
      field: language == 'en' ? 'ward' : 'wardMr',
      formattedLabel: 'ward',
      width: 50,
    },
    {
      field: language == 'en' ? 'area' : 'areaMr',
      formattedLabel: 'area',
      width: 60,
    },
    {
      field: language == 'en' ? 'petAnimalEn' : 'petAnimalMr',
      formattedLabel: 'petAnimal',
      width: 55,
    },
    {
      field: language == 'en' ? 'petBreed' : 'petBreedMr',
      formattedLabel: 'petBreed',
      width: 75,
    },
    {
      field: language == 'en' ? 'gender' : 'genderMr',
      formattedLabel: 'animalGender',
      width: 55,
    },
    {
      field: 'animalAge',
      formattedLabel: 'animalAge',
      width: 60,
    },
    {
      field: 'licenseNo',
      formattedLabel: 'licenseNo',
      width: 60,
    },
    {
      field: 'ownerName',
      formattedLabel: 'ownerName',
      width: 75,
    },
    {
      field: 'licenseStartDate',
      formattedLabel: 'licenseStartDate',
      width: 65,
    },
    {
      field: 'licenseEndDate',
      formattedLabel: 'licenseEndDate',
      width: 65,
    },
    {
      field: 'licenseType',
      formattedLabel: 'licenseType',
      width: 60,
    },
  ]

  const getZones = () => {
    axios
      .get(`${URLs.CFCURL}/master/zoneWardAreaMapping/getZoneByApplicationId`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setZoneDropDown(
          res.data.map((zones) => ({
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
          res.data.map((wards) => ({
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

  const getAreas = (zoneId, wardId) => {
    axios
      .get(
        `${URLs.CFCURL}/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { zoneId, wardId },
        }
      )
      .then((res) =>
        setAreaDropDown(
          res.data.map((areas) => ({
            id: areas.areaId,
            areaEn: areas.areaName,
            areaMr: areas.areaNameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  const finalSubmit = (data) => {
    setTable([])

    const bodyForAPI = {
      ...data,
      fromDate: !!data.fromDate
        ? moment(data.fromDate).format('YYYY-MM-DD')
        : '',
      toDate: !!data.toDate ? moment(data.toDate).format('YYYY-MM-DD') : '',
    }
    console.log(bodyForAPI)

    axios
      .post(`${URLs.VMS}/reportController/getGenericReportV1`, bodyForAPI, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        res.data?.reportDaoList?.length > 0
          ? setTable(
              res.data?.reportDaoList.map((j, i) => ({
                ...j,
                srNo: i + 1,
                licenseStartDate: !!j.licenseStartDate
                  ? moment(j.licenseStartDate).format('DD-MM-YYYY')
                  : // : 'To be generated',
                    '-',
                licenseEndDate: !!j.licenseEndDate
                  ? moment(j.licenseEndDate).format('DD-MM-YYYY')
                  : // : 'To be generated',
                    '-',
                genderMr: j.gender == 'Male' ? 'पुरुष' : 'स्त्री',
                licenseNo: j.licenceNo ?? 'Not Generated Yet',
                petAnimalEn: petAnimal.find(
                  (obj) =>
                    // @ts-ignore
                    obj.id == j.petAnimalkey
                )?.nameEn,
                petAnimalMr: petAnimal.find(
                  (obj) =>
                    // @ts-ignore
                    obj.id == j.petAnimalkey
                )?.nameMr,
              }))
            )
          : sweetAlert('Info', 'No records found', 'info')
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>Generic Report</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id='genericReport' />
        </div>
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.rowWrapper}>
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
                      maxDate={watch('toDate')}
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='fromDate' required />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 200 }}
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
                      minDate={watch('fromDate')}
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='toDate' required />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 200 }}
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
            <FormControl variant='standard' error={!!error.zoneKey}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='zone' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 200 }}
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
            <FormControl
              disabled={wardDropDown.length == 0 || !watch('zoneKey')}
              variant='standard'
              error={!!error.wardKey}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='ward' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 200 }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value)
                      getAreas(watch('zoneKey'), value.target.value)
                    }}
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
            <FormControl
              disabled={areaDropDown.length == 0 || !watch('wardKey')}
              variant='standard'
              error={!!error.areaKey}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='area' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 200 }}
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
            <FormControl variant='standard' error={!!error.petAnimalkey}>
              <InputLabel>
                <FormattedLabel id='petAnimal' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='petAnimalkey'
                  >
                    {petAnimal &&
                      petAnimal.map((obj, index) => (
                        <MenuItem
                          key={index}
                          value={
                            // @ts-ignore
                            obj.id
                          }
                        >
                          {/* @ts-ignore */}
                          {language === 'en' ? obj.nameEn : obj.nameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='petAnimalkey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.petAnimalkey ? error.petAnimalkey.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={!watch('petAnimalkey')}
              variant='standard'
              error={!!error.animalBreedKey}
            >
              <InputLabel>
                <FormattedLabel id='petBreed' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='animalBreedKey'
                  >
                    {petBreeds &&
                      petBreeds
                        .filter(
                          // @ts-ignore
                          (j) => j.petAnimalKey == Number(watch('petAnimalkey'))
                        )
                        .map((obj, index) => (
                          <MenuItem
                            key={index}
                            value={
                              // @ts-ignore
                              obj.id
                            }
                          >
                            {/* @ts-ignore */}
                            {language === 'en' ? obj.breedEn : obj.breedMr}
                          </MenuItem>
                        ))}
                  </Select>
                )}
                name='animalBreedKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.animalBreedKey ? error.animalBreedKey.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.animalGender}>
              <InputLabel>
                <FormattedLabel id='animalGender' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='animalGender'
                  >
                    {animalGenders &&
                      animalGenders.map((obj, index) => (
                        <MenuItem key={index} value={obj.value}>
                          {language === 'en' ? obj.genderEn : obj.genderMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='animalGender'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.animalGender ? error.animalGender.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl variant='standard' error={!!error.licenseType}>
              <InputLabel>
                <FormattedLabel id='licenseType' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='licenseType'
                  >
                    <MenuItem key={0} value={'all'}>
                      {language == 'en' ? 'All' : 'सर्व'}
                    </MenuItem>
                    <MenuItem key={1} value={'new'}>
                      {language == 'en' ? 'New' : 'नवीन'}
                    </MenuItem>
                    <MenuItem key={2} value={'renew'}>
                      {language == 'en' ? 'Renewal' : 'नूतनीकरण केलेले'}
                    </MenuItem>
                  </Select>
                )}
                name='licenseType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.licenseType ? error.licenseType.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div className={styles.buttons}>
            <Button variant='contained' type='submit' endIcon={<Search />}>
              <FormattedLabel id='search' />
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={() =>
                reset({
                  fromDate: null,
                  toDate: null,
                  zoneKey: '',
                  wardKey: '',
                  areaKey: '',
                  petAnimalkey: '',
                  animalBreedKey: '',
                  animalGender: '',
                  licenseType: '',
                })
              }
              endIcon={<Clear />}
            >
              <FormattedLabel id='clear' />
            </Button>
            <Button
              disabled={table.length == 0}
              variant='contained'
              onClick={handleToPrint}
              endIcon={<Print />}
            >
              <FormattedLabel id='print' />
            </Button>
          </div>
        </form>
        <div className={styles.centerDiv}>
          {table.length > 0 && (
            <ReportLayout
              centerHeader
              showDates={watch('fromDate') && watch('toDate')}
              date={{
                from: moment(watch('fromDate')).format('DD-MM-YYYY'),
                to: moment(watch('toDate')).format('DD-MM-YYYY'),
              }}
              style={{
                marginTop: '5vh',
                boxShadow: '0px 2px 10px 0px rgba(0,0,0,0.75)',
              }}
              componentRef={componentRef}
              rows={table}
              // customReportName={{
              //   en: columns + ' Report',
              //   mr: (columns == 'IPD' ? 'आयपीडी' : 'ओपीडी') + ' अहवाल',
              // }}
              columns={columns}
            />
          )}
        </div>
      </Paper>
    </>
  )
}

export default Index
