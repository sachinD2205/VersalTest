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

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Detail Collection Report',
  })

  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    { id: 1, petNameEn: '', petNameMr: '' },
  ])
  const [table, setTable] = useState([])
  const [grandTotal, setGrandTotal] = useState(0)

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
    axios.get(`${URLs.VMS}/mstPetAnimal/getAll`).then((res) =>
      setPetAnimalDropDown(
        res.data.mstPetAnimalList.map((j) => ({
          id: j.id,
          petNameEn: j.nameEn,
          petNameMr: j.nameMr,
        }))
      )
    )
  }, [])

  const finalSubmit = (data) => {
    axios
      .post(`${URLs.VMS}/reportController/getCollectionReport`, data)
      .then((res) => {
        let total = 0

        res.data.reportDaoList.forEach((obj) => (total += obj.feeCollected))
        setGrandTotal(total)
        setTable(
          res.data.reportDaoList?.map((j, i) => ({
            srNo: i + 1,
            petAnimal: j.petAnimal,
            licenseNo: j.licenseNo,
            ownerName: j.ownerName,
            mobileNo: j.mobileNo,
            licenseType: j.licenseType,
            feeCollected: j.feeCollected,
          }))
        )
      })
  }
  return (
    <>
      <Head>
        <title>Detail Collection Report</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id='detailCollection' />
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
                  <FormattedLabel id='detailCollectionReport' />
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
                <td>
                  <FormattedLabel id='srNo' />
                </td>
                <td>
                  <FormattedLabel id='petAnimal' />
                </td>
                <td>
                  <FormattedLabel id='licenseNo' />
                </td>
                <td>
                  <FormattedLabel id='ownerName' />
                </td>
                <td>
                  <FormattedLabel id='mobileNo' />
                </td>
                <td>
                  <FormattedLabel id='licenseType' />
                </td>
                <td>
                  <FormattedLabel id='feeCollected' />
                </td>
              </tr>

              {table.map((obj) => (
                <tr>
                  <td>{obj.srNo}</td>
                  <td>{obj.petAnimal}</td>
                  <td>{obj.licenseNo}</td>
                  <td>{obj.ownerName}</td>
                  <td>{obj.mobileNo}</td>
                  <td>{obj.licenseType}</td>
                  <td>{obj.feeCollected}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold' }}>
                <td colSpan={6} style={{ textAlign: 'end', paddingRight: 20 }}>
                  <FormattedLabel id='grandTotal' />
                </td>
                <td>{grandTotal}</td>
              </tr>
            </table>
          </div>
        )}
      </Paper>
    </>
  )
}

export default Index
