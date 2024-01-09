import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import router from 'next/router'
import styles from './paymentGateway.module.css'
import URLs from '../../../URLS/urls'

import Paper from '@mui/material/Paper'
import { Button, InputLabel, Select, MenuItem } from '@mui/material'
import { Clear, ExitToApp, Payment, Pets, Save } from '@mui/icons-material'
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
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import { useSelector } from 'react-redux'
import Title from '../../../containers/VMS_ReusableComponents/Title'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const userToken = useGetToken()

  const [bankName, setBankName] = useState([])
  const [paymentType, setPaymentType] = useState([
    {
      type: 'online',
      nameEn: 'Net Banking',
      nameMr: 'Net Banking in marathi',
      value: 'netBanking',
    },
    { type: 'online', nameEn: 'UPI', nameMr: 'UPI in marathi', value: 'upi' },
    {
      type: 'offline',
      nameEn: 'Demand Draft',
      nameMr: 'Demand Draft in marathi',
      value: 'dd',
    },
    {
      type: 'offline',
      nameEn: 'Cash',
      nameMr: 'Cash in marathi',
      value: 'cash',
    },
  ])

  let petSchema = yup.object().shape({
    // lattitude: yup.string().required("Please enter lattitude"),
  })

  const {
    register,
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
    router.query.amount && setValue('amount', router.query.amount)

    //Get Bank
    axios
      .get(`${URLs.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBankName(
          res.data.bank.map((j) => ({
            id: j.id,
            bankNameEn: j.bankName,
            bankNameMr: j.bankNameMr,
            branchNameEn: j.branchName,
            branchNameMr: j.branchNameMr,
          }))
        )
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  const finalSubmit = (data) => {
    const { payerName, amount, paymentMode, paymentType } = data
    let bodyForAPI

    if (watch('paymentMode') === 'online') {
      if (watch('paymentType') === 'netBanking') {
        const {
          bankName,
          branchName,
          ifscCode,
          accountNo,
          cfcCode,
          counterNo,
        } = data

        bodyForAPI = {
          payerName,
          amount,
          paymentMode,
          paymentType,
          bankName,
          branchName,
          ifscCode,
          accountNo,
          cfcCode,
          counterNo,
        }
      } else if (watch('paymentType') === 'upi') {
        bodyForAPI = {
          payerName,
          amount,
          paymentMode,
          paymentType,
        }
      }
    } else {
      if (watch('paymentType') === 'dd') {
        const { ddNo, ddDate } = data
        bodyForAPI = {
          payerName,
          amount,
          paymentMode,
          paymentType,
          ddNo,
          ddDate,
        }
      } else if (watch('paymentType') === 'cash') {
        bodyForAPI = {
          payerName,
          amount,
          paymentMode,
          paymentType,
        }
      }
    }

    console.table(bodyForAPI)
  }

  return (
    <>
      <Head>
        <title>Payment Gateway</title>
      </Head>
      <Paper className={styles.main}>
        <Title titleLabel={<FormattedLabel id='paymentGateway' />} />

        <form
          onSubmit={handleSubmit(finalSubmit)}
          style={{ padding: '3vh 3%' }}
        >
          <div className={styles.row}>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='receivedFrom' />}
              variant='standard'
              {...register('payerName')}
              error={!!error.payerName}
              helperText={error?.payerName ? error.payerName.message : null}
            />
            <TextField
              disabled
              sx={{ width: '250px' }}
              label={<FormattedLabel id='amount' />}
              variant='standard'
              {...register('amount')}
              error={!!error.amount}
              helperText={error?.amount ? error.amount.message : null}
            />
            <div style={{ width: '250px' }}></div>
            <div style={{ width: '250px' }}></div>
          </div>
          <div className={styles.row}>
            <FormControl variant='standard' error={!!error.paymentMode}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='paymentMode' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='paymentMode'
                  >
                    <MenuItem key={1} value={'online'}>
                      Online
                    </MenuItem>
                    <MenuItem key={1} value={'offline'}>
                      Offline
                    </MenuItem>
                  </Select>
                )}
                name='paymentMode'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.paymentMode ? error.paymentMode.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl
              disabled={watch('paymentMode') ? false : true}
              variant='standard'
              error={!!error.paymentType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='paymentType' />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '250px' }}
                    labelId='demo-simple-select-standard-label'
                    id='demo-simple-select-standard'
                    // @ts-ignore
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='paymentType'
                  >
                    {paymentType &&
                      paymentType
                        .filter((obj) => obj.type === watch('paymentMode'))
                        .map((obj, index) => {
                          return (
                            <MenuItem key={index} value={obj.value}>
                              {language === 'en' ? obj.nameEn : obj.nameMr}
                            </MenuItem>
                          )
                        })}
                  </Select>
                )}
                name='paymentType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.paymentType ? error.paymentType.message : null}
              </FormHelperText>
            </FormControl>

            <div style={{ width: '250px' }}></div>
            <div style={{ width: '250px' }}></div>
          </div>
          {watch('paymentMode') === 'online' &&
            watch('paymentType') === 'netBanking' && (
              <div className={styles.row}>
                <FormControl variant='standard' error={!!error.bankName}>
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='bankName' />
                  </InputLabel>
                  {/* @ts-ignore */}
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '250px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        // @ts-ignore
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='bankName'
                      >
                        {bankName &&
                          bankName.map((obj, index) => {
                            return (
                              <MenuItem
                                key={index}
                                // @ts-ignore
                                value={obj.id}
                              >
                                {language === 'en'
                                  ? // @ts-ignore
                                    obj.bankNameEn
                                  : // @ts-ignore
                                    obj.bankNameMr}
                              </MenuItem>
                            )
                          })}
                      </Select>
                    )}
                    name='bankName'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.bankName ? error.bankName.message : null}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  disabled={watch('bankName') ? false : true}
                  variant='standard'
                  error={!!error.branchName}
                >
                  <InputLabel id='demo-simple-select-standard-label'>
                    <FormattedLabel id='branchName' />
                  </InputLabel>

                  {/* @ts-ignore */}
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: '250px' }}
                        labelId='demo-simple-select-standard-label'
                        id='demo-simple-select-standard'
                        // @ts-ignore
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='branchName'
                      >
                        {bankName &&
                          bankName
                            // @ts-ignore
                            .filter((obj) => obj.id === watch('bankName'))
                            .map((obj, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  // @ts-ignore
                                  value={obj.id}
                                >
                                  {language === 'en'
                                    ? // @ts-ignore
                                      obj.branchNameEn
                                    : // @ts-ignore
                                      obj.branchNameMr}
                                </MenuItem>
                              )
                            })}
                      </Select>
                    )}
                    name='branchName'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {error?.branchName ? error.branchName.message : null}
                  </FormHelperText>
                </FormControl>
                <TextField
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='ifscCode' />}
                  variant='standard'
                  {...register('ifscCode')}
                  error={!!error.ifscCode}
                  helperText={error?.ifscCode ? error.ifscCode.message : null}
                />
                <TextField
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='accountNo' />}
                  variant='standard'
                  {...register('accountNo')}
                  error={!!error.accountNo}
                  helperText={error?.accountNo ? error.accountNo.message : null}
                />
              </div>
            )}
          {watch('paymentMode') === 'online' &&
            watch('paymentType') === 'upi' && (
              <div className={styles.row}>
                <span className={styles.upi}>UPI ID: 9890822400@paytm</span>
              </div>
            )}
          {watch('paymentMode') === 'offline' &&
            watch('paymentType') === 'dd' && (
              <div className={styles.row}>
                <TextField
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='ddNo' />}
                  variant='standard'
                  {...register('ddNo')}
                  error={!!error.ddNo}
                  helperText={error?.ddNo ? error.ddNo.message : null}
                />
                <FormControl error={!!error.ddDate}>
                  {/* @ts-ignore */}
                  <Controller
                    control={control}
                    name='ddDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          disabled={
                            router.query.pageMode == 'view' ? true : false
                          }
                          inputFormat='dd/MM/yyyy'
                          label={<FormattedLabel id='ddDate' />}
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(
                              moment(date, 'YYYY-MM-DD').format('YYYY-MM-DD')
                            )
                          }}
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
                    {error?.ddDate ? error.ddDate.message : null}
                  </FormHelperText>
                </FormControl>
                <div style={{ width: '250px' }}></div>
                <div style={{ width: '250px' }}></div>
              </div>
            )}
          <div className={styles.row}>
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='cfcCounterNo' />}
              variant='standard'
              {...register('counterNo')}
              error={!!error.counterNo}
              helperText={error?.counterNo ? error.counterNo.message : null}
            />
            <TextField
              sx={{ width: '250px' }}
              label={<FormattedLabel id='cfcCode' />}
              variant='standard'
              {...register('cfcCode')}
              error={!!error.cfcCode}
              helperText={error?.cfcCode ? error.cfcCode.message : null}
            />
            <div style={{ width: '250px' }}></div>
            <div style={{ width: '250px' }}></div>
          </div>
          <div className={styles.buttons}>
            <Button
              color='success'
              variant='contained'
              type='submit'
              endIcon={<Payment />}
            >
              <FormattedLabel id='makePayment' />
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
