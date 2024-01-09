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
import { Label, Print, Search } from '@mui/icons-material'
import { useReactToPrint } from 'react-to-print'
import sweetAlert from 'sweetalert'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Monthly Report',
  })

  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    { id: 1, petNameEn: '', petNameMr: '' },
  ])
  const [yearDropDown, setYearDropDown] = useState([
    { id: 1, yearEn: '', yearMr: '' },
  ])
  const [table, setTable] = useState([])
  const [grandTotal, setGrandTotal] = useState({
    New: { Count: 0, FeeCollected: 0 },
    Renew: { Count: 0, FeeCollected: 0 },
    TotalFeeCollected: 0,
  })

  let schema = yup.object().shape({
    petAnimalkey: yup
      .number()
      .required('Please select pet animal')
      .typeError('Please select pet animal'),
    yearkey: yup
      .number()
      .required('Please select a year')
      .typeError('Please select a year'),
    licenseType: yup
      .string()
      .required('Please select license type')
      .typeError('Please select license type'),
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
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) =>
      setPetAnimalDropDown(
        res.data.mstPetAnimalList.map((j) => ({
          id: j.id,
          petNameEn: j.nameEn,
          petNameMr: j.nameMr,
        }))
      )
    )

    //Get Year
    axios.get(`${URLs.CFCURL}/master/year/getAll`).then((res) =>
      setYearDropDown(
        res.data.year.map((j) => ({
          id: j.id,
          yearEn: j.year,
          yearMr: j.yearMr,
        }))
      )
    )
  }, [])

  useEffect(() => {
    if (table.length > 1) {
      let newCount = 0,
        newFee = 0,
        renewCount = 0,
        renewFee = 0,
        totalFee = 0

      table.forEach((obj) => {
        // @ts-ignore
        if (obj.New) {
          // @ts-ignore
          newCount += obj.New.Count
          // @ts-ignore
          newFee += obj.New.TotalFee
        }
        // @ts-ignore
        if (obj.Renew) {
          // @ts-ignore
          renewCount += obj.Renew.Count
          // @ts-ignore
          renewFee += obj.Renew.TotalFee
        }

        // @ts-ignore
        if (obj.TotalFee) {
          // @ts-ignore
          totalFee += obj.TotalFee
        }
      })

      setGrandTotal({
        New: { Count: newCount, FeeCollected: newFee },
        Renew: { Count: renewCount, FeeCollected: renewFee },
        TotalFeeCollected: totalFee,
      })
    }
  }, [table])

  const finalSubmit = (data) => {
    axios
      .post(`${URLs.VMS}/reportController/getMonthlyReport`, data)
      .then((res) => setTable(res.data))
      .catch((error) => sweetAlert('Error', 'Something went wrong!', 'error'))
  }

  return (
    <>
      <Head>
        <title>Monthly Report </title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id='monthlyReport' />
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
                      petAnimalDropDown.map((value) => (
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

            <FormControl variant='standard' error={!!errors.yearkey}>
              <InputLabel>
                <FormattedLabel id='year' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  >
                    {yearDropDown &&
                      yearDropDown.map((value) => (
                        <MenuItem key={value.id} value={value.id}>
                          {language == 'en' ? value.yearEn : value.yearMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='yearkey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.yearkey ? errors.yearkey.message : null}
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
                    <MenuItem key={0} value={'ALL'}>
                      {language == 'en' ? 'All' : 'सर्व'}
                    </MenuItem>
                    <MenuItem key={1} value={'NEW'}>
                      {language == 'en' ? 'New' : 'नवीन'}
                    </MenuItem>
                    <MenuItem key={2} value={'RENEW'}>
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
        {/* {table.length != 0 && (
        )} */}
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
                <FormattedLabel id='monthlyReport' />
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
                <FormattedLabel id='month' />
              </td>
              {(watch('licenseType') == 'ALL' ||
                watch('licenseType') == 'NEW') && (
                <>
                  <td colSpan={2}>
                    <FormattedLabel id='newLicense' />
                  </td>
                </>
              )}
              {(watch('licenseType') == 'ALL' ||
                watch('licenseType') == 'RENEW') && (
                <>
                  <td colSpan={2}>
                    <FormattedLabel id='renewedLicense' />
                  </td>
                </>
              )}
              <td rowSpan={2}>
                <FormattedLabel id='totalFeeCollected' />
              </td>
            </tr>
            <tr className={styles.tableHeader}>
              {(watch('licenseType') == 'ALL' ||
                watch('licenseType') == 'NEW') && (
                <>
                  <td>
                    <FormattedLabel id='count' />
                  </td>
                  <td>
                    <FormattedLabel id='feeCollected' />
                  </td>
                </>
              )}
              {(watch('licenseType') == 'ALL' ||
                watch('licenseType') == 'RENEW') && (
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
            {table &&
              table.map((obj) => (
                <tr>
                  <td>
                    {
                      // @ts-ignore
                      obj.Month
                    }
                  </td>
                  {(watch('licenseType') == 'ALL' ||
                    watch('licenseType') == 'NEW') && (
                    <>
                      <td>
                        {
                          // @ts-ignore
                          obj.New.Count
                        }
                      </td>
                      <td>
                        {
                          // @ts-ignore
                          obj.New.TotalFee
                        }
                      </td>
                    </>
                  )}

                  {(watch('licenseType') == 'ALL' ||
                    watch('licenseType') == 'RENEW') && (
                    <>
                      <td>
                        {
                          // @ts-ignore
                          obj.Renew.Count
                        }
                      </td>
                      <td>
                        {
                          // @ts-ignore
                          obj.Renew.TotalFee
                        }
                      </td>
                    </>
                  )}
                  <td>
                    {
                      // @ts-ignore
                      obj.TotalFee
                    }
                  </td>
                </tr>
              ))}
            <tr style={{ fontWeight: 'bold' }}>
              <td>
                <FormattedLabel id='grandTotal' />
              </td>
              {(watch('licenseType') == 'ALL' ||
                watch('licenseType') == 'NEW') && (
                <>
                  <td>{grandTotal.New.Count}</td>
                  <td>{grandTotal.New.FeeCollected}</td>
                </>
              )}
              {(watch('licenseType') == 'ALL' ||
                watch('licenseType') == 'RENEW') && (
                <>
                  <td>{grandTotal.Renew.Count}</td>
                  <td>{grandTotal.Renew.FeeCollected}</td>
                </>
              )}
              <td>{grandTotal.TotalFeeCollected}</td>
            </tr>
          </table>
        </div>
      </Paper>
    </>
  )
}

export default Index
