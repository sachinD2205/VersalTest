import React, { useEffect, useRef, useState } from 'react'
import styles from './report.module.css'
import Head from 'next/head'
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
import ReportLayout from '../../../containers/reuseableComponents/ReportLayout'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import moment from 'moment'
import { Print, Search } from '@mui/icons-material'
import { useReactToPrint } from 'react-to-print'
import { useSelector } from 'react-redux'
import axios from 'axios'
import URLs from '../../../URLS/urls'
import Breadcrumb from '../../../components/common/BreadcrumbComponent'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const componentRef = useRef(null)
  const [table, setTable] = useState([])
  const [petAnimal, setPetAnimal] = useState([
    { id: 1, nameEn: '', nameMr: '' },
  ])
  const [petBreeds, setPetBreeds] = useState([
    { id: 1, breedNameEn: '', breedNameMr: '' },
  ])
  const [columns, setColumns] = useState('IPD')

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(
      yup.object().shape({
        departmentType: yup
          .string()
          .required(
            language == 'en'
              ? 'Please select a department'
              : 'कृपया एक विभाग निवडा'
          )
          .typeError(
            language == 'en'
              ? 'Please select a department'
              : 'कृपया एक विभाग निवडा'
          ),
        petAnimalKey: yup
          .number()
          .required(
            language == 'en'
              ? 'Please select an animal'
              : 'कृपया एक प्राणी निवडा'
          )
          .typeError(
            language == 'en'
              ? 'Please select an animal'
              : 'कृपया एक प्राणी निवडा'
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
    ),
  })

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: watch('departmentType') + ' Report',
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
            id: j?.id,
            breedEn: j?.breedNameEn,
            breedMr: j?.breedNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  const ipdColumns = [
    {
      field: 'complainerName',
      headerName:
        language == 'en' ? `Complainer's Name` : 'तक्रारकर्त्याचे नाव',
      width: 130,
    },
    {
      field: language == 'en' ? 'petAnimalEn' : 'petAnimalMr',
      headerName: language == 'en' ? 'Pet Animal' : 'पाळीव प्राणी',
      width: 120,
    },

    {
      field: 'animalColour',
      headerName: language == 'en' ? 'Animal Color' : 'प्राण्याचा रंग',
      width: 100,
    },
    {
      field: 'ownerFullName',
      headerName: language == 'en' ? 'Team Name' : 'संघाचे नाव',
      width: 180,
    },
    {
      field: 'status',
      headerName: language == 'en' ? 'Status' : 'अर्ज स्थिती',
      width: 150,
    },
  ]

  const opdColumns = [
    {
      field: 'licenseNo',
      headerName: language == 'en' ? 'License No.' : 'परवाना क्र.',
      width: 100,
    },
    {
      field: language == 'en' ? 'petAnimalEn' : 'petAnimalMr',
      headerName: language == 'en' ? 'Pet Animal' : 'पाळीव प्राणी',
      width: 90,
    },
    {
      field: language == 'en' ? 'breedEn' : 'breedMr',
      headerName: language == 'en' ? 'Pet Breed' : 'पाळीव प्राण्याची जाती',
      formattedLabel: 'petBreed',
      width: 120,
    },
    // {
    //   field: 'petName',
    //   formattedLabel: 'petName',
    //   width: 100,
    // },
    {
      field: 'animalColour',
      headerName: language == 'en' ? 'Animal Color' : 'प्राण्याचा रंग',
      width: 90,
    },
    {
      field: 'ownerName',
      headerName: language == 'en' ? 'Owner Name' : 'मालकाचे नाव',
      width: 150,
    },
    {
      field: 'status',
      headerName: language == 'en' ? 'Status' : 'अर्ज स्थिती',
      width: 130,
    },
  ]

  const finalSubmit = (data) => {
    setColumns(watch('departmentType'))

    axios
      .get(`${URLs.VMS}/reportController/getOpdOrIpdReport`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          ...data,
          fromDate: moment(data.fromDate).format('DD-MM-YYYY'),
          toDate: moment(data.toDate).format('DD-MM-YYYY'),
        },
      })
      .then((res) => {
        setTable(
          res.data[
            watch('departmentType') == 'IPD'
              ? 'trnAnimalTreatmentIpdList'
              : 'trnAnimalTreatmentList'
          ]?.length > 0
            ? res.data[
                watch('departmentType') == 'IPD'
                  ? 'trnAnimalTreatmentIpdList'
                  : 'trnAnimalTreatmentList'
              ].map((j, i) => ({
                srNo: i + 1,
                licenseNo: j?.licenseNo ?? 'No License',
                casePaperNo: j?.casePaperNo ?? 'No Case Paper No.',
                // ownerFullName: j?.ownerFullName,
                ownerName:
                  j?.firstName + ' ' + j?.middleName + ' ' + j?.lastName,

                complainerName: j?.complainerName ?? 'No Complainer',

                petAnimalEn:
                  petAnimal.find((obj) => obj?.id == j?.animalName)?.nameEn ??
                  'No Animal Found',
                petAnimalMr:
                  petAnimal.find((obj) => obj?.id == j?.animalName)?.nameMr ??
                  'No Animal Found',

                breedEn:
                  petBreeds.find((obj) => obj?.id == j?.animalSpeciesKey)
                    ?.breedEn ?? 'No Breed Found',
                breedMr:
                  petBreeds.find((obj) => obj?.id == j?.animalSpeciesKey)
                    ?.breedMr ?? 'No Breed Found',
                // petName: j?.petName,
                animalColour: j?.animalColour,
                animalAge: j?.animalAge,
                status: j?.status,
              }))
            : []
        )
        res.data[
          watch('departmentType') == 'IPD'
            ? 'trnAnimalTreatmentIpdList'
            : 'trnAnimalTreatmentList'
        ]?.length == 0 && sweetAlert('Info', 'No records found', 'info')
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>IPD or OPD Report</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id='ipdOrOpdReport' />
        </div>
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.departmentType}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='departmentType' required />
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
                    label='departmentType'
                  >
                    <MenuItem key={1} value={'IPD'}>
                      {language === 'en' ? 'IPD' : 'आयपीडी'}
                    </MenuItem>
                    <MenuItem key={2} value={'OPD'}>
                      {language === 'en' ? 'OPD' : 'ओपीडी'}
                    </MenuItem>
                  </Select>
                )}
                name='departmentType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.departmentType ? error.departmentType.message : null}
              </FormHelperText>
            </FormControl>
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
          </div>
          <div className={styles.centerDiv} style={{ gap: 20, marginTop: 20 }}>
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
        </form>

        {table.length > 0 && (
          <div className={styles.centerDiv}>
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
              customReportName={{
                en: columns + ' Report',
                mr: (columns == 'IPD' ? 'आयपीडी' : 'ओपीडी') + ' अहवाल',
              }}
              columns={columns == 'IPD' ? ipdColumns : opdColumns}
            />
          </div>
        )}
      </Paper>
    </>
  )
}

export default Index
