//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/cleark/appointmentSchReSch
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import BasicLayout from '../../../../../containers/Layout/BasicLayout'

import styles from '../../newMarriageRegistration/view.module.css'
import { addAllNewMarriageRegistraction } from '../../../../redux/features/newMarriageRegistrationSlice'
import { Controller, useForm } from 'react-hook-form'
import theme from '../../../../../theme'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment'
import urls from '../../URLS/urls'

const Index = () => {
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

  const [dataSource, setDataSource] = useState([])
  const router = useRouter()
  const dispach = useDispatch()

  // Get Table - Data
  const getNewMarriageRegistractionDetails = () => {
    axios
      .get(`${urls.MR}/transaction/applicant/getapplicantDetails`)
      .then((resp) => {
        console.log('response Data', JSON.stringify(resp.data))
        dispach(addAllNewMarriageRegistraction(resp.data))
        setDataSource(resp.data)
      })
  }

  const [ApplicationNameKeys, setApplicationNameKeys] = useState([])

  // getApplicationName
  const getApplicationNameKeys = () => {
    axios.get(`${urls.CFCURL}/master/application/getAll`).then((r) => {
      setApplicationNameKeys(
        r.data.map((row) => ({
          id: row.id,
          ApplicationNameKey: row.applicationNameEng,
        })),
      )
    })
  }

  const [ServiceNameKeys, setServiceNameKeys] = useState([])

  // getApplicationName
  const getServiceNameKeys = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
      setServiceNameKeys(
        r.data.map((row) => ({
          id: row.id,
          ServiceNameKey: row.service,
        })),
      )
    })
  }

  const [ChargeTypeKeys, setChargeTypeKeys] = useState([])

  // getApplicationName
  const getChargeTypeKeys = () => {
    axios.get(`${urls.CFCURL}/master/serviceChargeType/getAll`).then((r) => {
      setChargeTypeKeys(
        r.data.map((row) => ({
          id: row.id,
          ChargeTypeKey: row.serviceChargeType,
        })),
      )
    })
  }

  const [ChargeNameKeys, setChargeNameKeys] = useState([])

  // getApplicationName
  const getChargeNameKeys = () => {
    axios.get(`${urls.CFCURL}/master/servicecharges/getAll`).then((r) => {
      setChargeNameKeys(
        r.data.map((row) => ({
          id: row.id,
          ChargeNameKey: row.charge,
        })),
      )
    })
  }

  useEffect(() => {
    getNewMarriageRegistractionDetails()
    getServiceNameKeys()
    getApplicationNameKeys()
    getChargeTypeKeys()
    getChargeNameKeys()
  }, []) // useEffect

  return (
    <>
      <BasicLayout>
        <ThemeProvider theme={theme}>
          <Paper
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
            }}
          >
            <div className={styles.small}>
              <div className={styles.detailsApot}>
                <div className={styles.h1TagApot}>
                  <h1
                    style={{
                      color: 'white',
                      marginTop: '1px',
                    }}
                  >
                    Service charges
                  </h1>
                </div>
              </div>
              <div>
                <h2
                  style={{
                    marginLeft: '40px',
                    fontStyle: 'italic',
                    marginTop: '25px',
                  }}
                >
                  {' '}
                  Applicant Details:
                </h2>
              </div>
              <div className={styles.row}>
                <div style={{ marginLeft: '50px' }}>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.ApplicationNameKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Module Name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {ApplicationNameKeys &&
                            ApplicationNameKeys.map(
                              (ApplicationNameKey, index) => (
                                <MenuItem
                                  key={index}
                                  value={ApplicationNameKey.id}
                                >
                                  {ApplicationNameKey.ApplicationNameKey}
                                </MenuItem>
                              ),
                            )}
                        </Select>
                      )}
                      name="ApplicationNameKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.ApplicationNameKey
                        ? errors.ApplicationNameKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </div>

                <div style={{ marginLeft: '50px' }}>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.ServiceNameKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Service Name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {ServiceNameKeys &&
                            ServiceNameKeys.map((ServiceNameKey, index) => (
                              <MenuItem key={index} value={ServiceNameKey.id}>
                                {ServiceNameKey.ServiceNameKey}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="ServiceNameKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.ServiceNameKey
                        ? errors.ServiceNameKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </div>

                <div style={{ marginLeft: '50px' }}>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.ChargeTypeKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Charges type
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {ChargeTypeKeys &&
                            ChargeTypeKeys.map((ChargeTypeKey, index) => (
                              <MenuItem key={index} value={ChargeTypeKey.id}>
                                {ChargeTypeKey.ChargeTypeKey}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="ChargeTypeKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.ChargeTypeKey
                        ? errors.ChargeTypeKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </div>

                <div style={{ marginLeft: '50px' }}>
                  <FormControl
                    variant="standard"
                    sx={{ marginTop: 2 }}
                    error={!!errors.ChargeNameKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      Charges Name
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        >
                          {ChargeNameKeys &&
                            ChargeNameKeys.map((ChargeNameKey, index) => (
                              <MenuItem key={index} value={ChargeNameKey.id}>
                                {ChargeNameKey.ChargeNameKey}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="ChargeNameKey"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.ChargeNameKey
                        ? errors.ChargeNameKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>

              <div style={{ marginLeft: '40px' }}>
                <h3
                  style={{
                    marginTop: '6px',
                  }}
                >
                  Choose Date:
                </h3>

                <FormControl sx={{ marginTop: 0 }} error={!!errors.gBirthDate}>
                  <Controller
                    control={control}
                    name="gBirthDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 13 }}>Choose date</span>
                          }
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(moment(date).format('YYYY-MM-DD'))
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.gBirthDate ? errors.gBirthDate.message : null}
                  </FormHelperText>
                </FormControl>
              </div>
            </div>
          </Paper>
        </ThemeProvider>
      </BasicLayout>
    </>
  )
}

export default Index
