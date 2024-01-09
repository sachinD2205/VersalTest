import React, { useState, useEffect, useRef } from 'react'
import styles from './report.module.css'
import { useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useReactToPrint } from 'react-to-print'
import axios from 'axios'
import Head from 'next/head'
import {
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { Print, Search } from '@mui/icons-material'
import URLs from '../../../URLS/urls'
import moment from 'moment'
import ReportLayout from '../../../containers/reuseableComponents/ReportLayout'
import Breadcrumb from '../../../components/common/BreadcrumbComponent'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'

import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  const userToken = useGetToken()

  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const componentRef = useRef(null)

  const [aLLZooAnimal, setALLZooAnimal] = useState([
    { id: 1, nameEn: '', nameMr: '' },
  ])
  const [aLLZooKeeperName, setALLZooKeeperName] = useState([])
  const [table, setTable] = useState([])

  const schema = yup.object().shape({
    entryDate: yup
      .date()
      .required(language == 'en' ? 'Please select a Date' : 'कृपया तारीख निवडा')
      .typeError(
        language == 'en' ? 'Please select a Date' : 'कृपया तारीख निवडा'
      ),
  })

  const {
    watch,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: 'Zoo Keeper Report',
  })

  useEffect(() => {
    axios
      .get(`${URLs.VMS}/master/user/getZooKeepers`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setALLZooKeeperName(
          res.data?.map((j) => ({
            id: j.id,
            zooKeeperNameEn:
              j?.firstNameEn + ' ' + j?.middleNameEn + ' ' + j?.lastNameEn,
            zooKeeperNameMr:
              j?.firstNameMr + ' ' + j?.middleNameMr + ' ' + j?.lastNameMr,
          }))
        )
      )
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })

    //Get Zoo Animals
    axios
      .get(`${URLs.VMS}/mstZooAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setALLZooAnimal(
          res.data.mstZooAnimalList.map((j, i) => ({
            id: j.id,
            animalNameEn: j.animalNameEn,
            animalNameMr: j.animalNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    console.log('Table: ', table)
  }, [table])

  const columns = [
    {
      field: 'srNo',
      formattedLabel: 'srNo',
      width: 75,
    },
    {
      field: language == 'en' ? 'zooKeeperNameEn' : 'zooKeeperNameMr',
      formattedLabel: 'zooKeeperName',
      width: 175,
    },
    {
      field: language == 'en' ? 'zooAnimalEn' : 'zooAnimalMr',
      formattedLabel: 'zooAnimal',
      width: 125,
    },
    {
      field: 'observation',
      formattedLabel: 'observation',
      width: 200,
    },
    {
      field: 'status',
      formattedLabel: 'status',
      width: 125,
    },
  ]

  const finalSubmit = (data) => {
    axios
      .get(`${URLs.VMS}/trnZooKeeperReport/getByEntryDate`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { entryDate: moment(data?.entryDate).format('YYYY-MM-DD') },
      })
      .then((res) => {
        if (res?.data?.trnZooKeeperReportList?.length > 0) {
          setTable(
            res?.data?.trnZooKeeperReportList?.map((j, i) => ({
              ...j,
              srNo: i + 1,
              zooAnimalEn: aLLZooAnimal?.find(
                (animal) => animal?.id == j.zooAnimalKey
              )?.animalNameEn,
              zooAnimalMr: aLLZooAnimal?.find(
                (animal) => animal?.id == j.zooAnimalKey
              )?.animalNameMr,
              zooKeeperNameEn:
                aLLZooKeeperName?.find(
                  (zooKeeper) => zooKeeper.id == j.zooKeeperId
                )?.zooKeeperNameEn ?? 'Admin User',
              zooKeeperNameMr:
                aLLZooKeeperName?.find(
                  (zooKeeper) => zooKeeper.id == j.zooKeeperId
                )?.zooKeeperNameMr ?? 'प्रशासक वापरकर्ता',
            }))
          )
        } else {
          sweetAlert('Info', 'No records found', 'info')
          setTable([])
        }
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>Daily Report of Animals</title>
      </Head>
      <Breadcrumb />
      <Paper className={styles.main}>
        <div className={styles.title}>
          {/* <FormattedLabel id='dailyReportOfZooKeeper' /> */}
          <FormattedLabel id='dailyReport' />
        </div>
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div
            className={styles.centerDiv}
            style={{ justifyContent: 'space-evenly', marginTop: '4vh' }}
          >
            <FormControl error={!!error.entryDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='entryDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat='dd-MM-yyyy'
                      label={<FormattedLabel id='dateOfEntry' required />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '200px' }}
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
                {error?.entryDate ? error.entryDate.message : null}
              </FormHelperText>
            </FormControl>
            <div style={{ display: 'flex', gap: 50, flexWrap: 'wrap' }}>
              <Button variant='contained' type='submit' endIcon={<Search />}>
                <FormattedLabel id='search' />
              </Button>
              <Button
                disabled={table.length == 0}
                variant='outlined'
                onClick={handleToPrint}
                endIcon={<Print />}
              >
                <FormattedLabel id='print' />
              </Button>
            </div>
          </div>
        </form>
        {table.length > 0 && (
          <div className={styles.centerDiv}>
            <ReportLayout
              centerHeader
              showDates={watch('entryDate')}
              date={{
                from: moment(watch('entryDate')).format('DD-MM-YYYY'),
                to: moment(watch('entryDate')).format('DD-MM-YYYY'),
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
