import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import styles from './report.module.css'
import URLs from '../../../URLS/urls'
import ReportLayout from '../../../containers/reuseableComponents/ReportLayout'

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
import { Controller, useForm } from 'react-hook-form'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import moment from 'moment'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Print, Search } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Breadcrumb from '../../../components/common/BreadcrumbComponent'
import { useReactToPrint } from 'react-to-print'
import sweetAlert from 'sweetalert'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'

import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()

  const [petAnimal, setPetAnimal] = useState([
    { id: 1, nameEn: '', nameMr: '' },
  ])
  const [petBreeds, setPetBreeds] = useState([
    { id: 1, breedEn: '', breedMr: '' },
  ])

  const [table, setTable] = useState([])

  const componentRef = useRef(null)

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: 'Date wise License Expiry Report',
  })

  let reportSchema = yup.object().shape({
    petAnimalKey: yup
      .number()
      .required(
        language == 'en' ? 'Please select an animal' : 'कृपया एक प्राणी निवडा'
      )
      .typeError(
        language == 'en' ? 'Please select an animal' : 'कृपया एक प्राणी निवडा'
      ),
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
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(reportSchema),
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
            breedEn: j.breedNameEn,
            breedMr: j.breedNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'licenseNo',

      headerAlign: 'center',
      headerName: <FormattedLabel id='licenseNo' />,
      width: 140,
    },
    {
      headerClassName: 'cellColor',

      field: 'ownerName',

      headerAlign: 'center',
      headerName: <FormattedLabel id='ownerName' />,
      width: 185,
      // width: 300,
      // flex: 1,
    },

    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'breedEn' : 'breedMr',

      headerAlign: 'center',
      headerName: <FormattedLabel id='petBreed' />,
      width: 130,
    },
    {
      headerClassName: 'cellColor',

      field: 'petName',

      headerAlign: 'center',
      headerName: <FormattedLabel id='petName' />,
      width: 100,
    },
    {
      headerClassName: 'cellColor',

      field: 'animalAge',

      headerAlign: 'center',
      headerName: <FormattedLabel id='animalAge' />,
      width: 120,
    },
  ]

  const finalSubmit = (data) => {
    axios
      .get(
        `${URLs.VMS}/trnRenewalPetLicence/getAllExpiryReportByFromDateAndToDateAndPetType`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: {
            fromDate: moment(data.fromDate).format('DD-MM-YYYY'),
            toDate: moment(data.toDate).format('DD-MM-YYYY'),
            petTypeKey: data.petAnimalKey,
          },
        }
      )
      .then((res) => {
        setTable(
          res.data?.trnRenewalPetLicenceList?.length > 0
            ? res.data.trnRenewalPetLicenceList.map((j, i) => ({
                srNo: i + 1,
                licenseNo: j.licenseNo ?? 'Not Generated Yet',
                // ownerName: j.ownerName,
                ownerName: j.firstName + ' ' + j.middleName + ' ' + j.lastName,
                breedEn:
                  petBreeds.find((obj) => obj.id == j.animalBreedKey)
                    ?.breedEn ?? 'No Breed Found',
                breedMr:
                  petBreeds.find((obj) => obj.id == j.animalBreedKey)
                    ?.breedMr ?? 'No Breed Found',
                petName: j.petName,
                animalAge: j.animalAge,
                status: j.status,
              }))
            : []
        )
        res.data?.trnRenewalPetLicenceList?.length == 0 &&
          sweetAlert('Info', 'No records found', 'info')
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>Renewed License Expiry Report</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id='dateWiseRenewedLicenseExpiry' />
        </div>

        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.petAnimalKey}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='petAnimal' required />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='petAnimalKey'
                  >
                    {petAnimal &&
                      petAnimal.map((obj) => (
                        <MenuItem key={1} value={obj.id}>
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
                      inputFormat='dd-MM-yyyy'
                      label={<FormattedLabel id='fromDate' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
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
                      inputFormat='dd-MM-yyyy'
                      label={<FormattedLabel id='toDate' />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
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

            <div style={{ display: 'flex', gap: 20 }}>
              <Button variant='contained' type='submit' endIcon={<Search />}>
                <FormattedLabel id='search' />
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
          </div>
        </form>
        {table.length > 0 && (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
            }}
          >
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
              columns={columns}
            />
          </div>
        )}
      </Paper>
    </>
  )
}

export default Index
