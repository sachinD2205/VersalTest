import React, { useState, useEffect, useRef } from 'react'
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
import { useSelector } from 'react-redux'
import axios from 'axios'
import URLs from '../../../URLS/urls'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import moment from 'moment'
import { Print, Search } from '@mui/icons-material'
import { useReactToPrint } from 'react-to-print'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Summary Collection Report',
  })

  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    { id: 1, petNameEn: '', petNameMr: '' },
  ])
  const [table, setTable] = useState([])
  const [grandTotal, setGrandTotal] = useState({})

  let schema = yup.object().shape({
    fromDate: yup
      .string()
      .typeError(`Please select a from date`)
      .required(`Please select a from date`),
    toDate: yup
      .string()
      .typeError(`Please select a to date`)
      .required(`Please select a to date`),
    petAnimalkey: yup
      .number()
      .required('Please select pet animal')
      .typeError('Please select pet animal'),
    licenseType: yup.string().required('Please select license type'),
  })

  const {
    // register,
    handleSubmit,
    // setValue,
    watch,
    // reset,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`)
      .then((res) =>
        setPetAnimalDropDown(
          res.data.mstPetAnimalList.map((j) => ({
            id: j.id,
            petNameEn: j.nameEn,
            petNameMr: j.nameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    if (table.length > 0) {
      console.log('Table state: ', table)
      let forNewCount = 0,
        forNewFee = 0,
        forRenewalCount = 0,
        forRenewalFee = 0,
        forTotalFee = 0

      table.forEach((obj) => {
        if (obj.new) {
          forNewCount += obj.new.count
          forNewFee += obj.new.feeCollected
        }
        if (obj.renewal) {
          forRenewalCount += obj.renewal.count
          forRenewalFee += obj.renewal.feeCollected
        }
        if (obj.totalFeeCollected) {
          forTotalFee += obj.totalFeeCollected
        }
      })
      setGrandTotal({
        name: 'Grand Total',
        new: { count: forNewCount, feeCollected: forNewFee },
        renewal: { count: forRenewalCount, feeCollected: forRenewalFee },
        totalFeeCollected: forTotalFee,
      })
    }
  }, [table])

  const finalSubmit = (data) => {
    axios
      .post(`${URLs.VMS}/reportController/getSummaryReportDetails`, data)
      .then((res) =>
        setTable(
          res.data?.map((j) => ({
            petAnimal: j.petAnimal,
            new: {
              count: j.new?.Count,
              // feeCollected: Number(j.new?.TotalFeeCollected) * 75,
              feeCollected: j.new?.TotalFeeCollected,
            },
            renewal: {
              count: j.Renewal?.Count,
              // feeCollected: Number(j.Renewal?.TotalFeeCollected) * 50,
              feeCollected: j.Renewal?.TotalFeeCollected,
            },
            // totalFeeCollected: Number(j.TotalFeeCollected),
            totalFeeCollected: j.TotalFeeCollected,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>Summary Collection Report</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id='summaryCollection' />
        </div>

        <form onSubmit={handleSubmit(finalSubmit)}>
          <div className={styles.row}>
            <FormControl variant='standard' error={!!errors.petAnimalkey}>
              <InputLabel>
                <FormattedLabel id='petAnimal' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  >
                    <MenuItem key={0} value={0}>
                      {language == 'en' ? 'All' : 'सर्व'}
                    </MenuItem>
                    {petAnimalDropDown &&
                      petAnimalDropDown.map((value, index) => (
                        <MenuItem key={value.id} value={value.id}>
                          {language == 'en' ? value.petNameEn : value.petNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='petAnimalkey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.petAnimalkey ? errors.petAnimalkey.message : null}
              </FormHelperText>
            </FormControl>

            <FormControl error={!!errors.fromDate}>
              <Controller
                control={control}
                name='fromDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='fromDate' />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format('YYYY-MM-DD'))
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!errors.fromDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.fromDate ? errors.fromDate.message : null}
              </FormHelperText>
            </FormControl>

            <FormControl error={!!errors.toDate}>
              <Controller
                control={control}
                name='toDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='toDate' />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format('YYYY-MM-DD'))
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!errors.toDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {errors?.fromDate ? errors.fromDate.message : null}
              </FormHelperText>
            </FormControl>

            <FormControl variant='standard' error={!!errors.licenseType}>
              <InputLabel>
                <FormattedLabel id='licenseType' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
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
                {errors?.licenseType ? errors.licenseType.message : null}
              </FormHelperText>
            </FormControl>
          </div>

          <div
            className={styles.row}
            style={{
              justifyContent: 'center',
              columnGap: '5vw',
              marginBottom: '5vh',
            }}
          >
            <Button
              color='success'
              type='submit'
              variant='contained'
              endIcon={<Search />}
            >
              <FormattedLabel id='search' />
            </Button>
            <Button
              onClick={handleToPrint}
              variant='contained'
              endIcon={<Print />}
            >
              <FormattedLabel id='print' />
            </Button>
          </div>
        </form>
        {table.length != 0 && (
          <div className={styles.reports} ref={componentRef}>
            <div className={styles.header}>
              <img src='/logo.png' alt='PCMC Logo' width='auto' height={90} />
              <div className={styles.middleHeader}>
                <h2>
                  <FormattedLabel id='pcmc' />
                </h2>
                <h3>
                  <FormattedLabel id='vms' />
                </h3>
                <h3>
                  <FormattedLabel id='summaryCollectionReport' />
                </h3>
              </div>
              <img
                src='/aazadiKaAmrutMahotsav.png'
                alt='Aazadi ka Mahotsav'
                width='auto'
                height={80}
              />
            </div>
            <table className={styles.table}>
              <tr className={styles.tableHeader}>
                <td rowSpan={2}>
                  <FormattedLabel id='animalType' />
                </td>
                {(watch('licenseType') == 'all' ||
                  watch('licenseType') == 'new') && (
                  <td colSpan={2}>
                    <FormattedLabel id='newLicense' />
                  </td>
                )}
                {(watch('licenseType') == 'all' ||
                  watch('licenseType') == 'renew') && (
                  <td colSpan={2}>
                    <FormattedLabel id='renewedLicense' />
                  </td>
                )}
                <td rowSpan={2}>
                  <FormattedLabel id='totalFeeCollected' />
                </td>
              </tr>
              <tr
                className={styles.tableHeader}
                style={{ textTransform: 'capitalize' }}
              >
                {(watch('licenseType') == 'all' ||
                  watch('licenseType') == 'new') && (
                  <>
                    <td>
                      <FormattedLabel id='count' />
                    </td>
                    <td>
                      <FormattedLabel id='feeCollected' />
                    </td>
                  </>
                )}
                {(watch('licenseType') == 'all' ||
                  watch('licenseType') == 'renew') && (
                  <>
                    <td>
                      <FormattedLabel id='count' />
                    </td>
                    <td>
                      <FormattedLabel id='feeCollected' />
                    </td>
                  </>
                )}
              </tr>

              {table.map((obj, i) => (
                <tr key={i}>
                  <td>{obj?.petAnimal}</td>
                  {(watch('licenseType') == 'all' ||
                    watch('licenseType') == 'new') && (
                    <>
                      <td>{obj.new?.count}</td>
                      <td>{obj.new?.feeCollected}</td>
                    </>
                  )}
                  {(watch('licenseType') == 'all' ||
                    watch('licenseType') == 'renew') && (
                    <>
                      <td>{obj.renewal?.count}</td>
                      <td>{obj.renewal?.feeCollected}</td>
                    </>
                  )}
                  <td>{obj?.totalFeeCollected}</td>
                </tr>
              ))}

              <tr style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                <td>{grandTotal.name}</td>
                {(watch('licenseType') == 'all' ||
                  watch('licenseType') == 'new') && (
                  <>
                    <td>{grandTotal.new?.count}</td>
                    <td>{grandTotal.new?.feeCollected}</td>
                  </>
                )}
                {(watch('licenseType') == 'all' ||
                  watch('licenseType') == 'renew') && (
                  <>
                    <td>{grandTotal.renewal?.count}</td>
                    <td>{grandTotal.renewal?.feeCollected}</td>
                  </>
                )}
                <td>{grandTotal?.totalFeeCollected}</td>
              </tr>
            </table>
          </div>
        )}
      </Paper>
    </>
  )
}

export default Index
