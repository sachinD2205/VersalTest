import React, { useEffect, useState } from 'react'
import router from 'next/router'
import styles from './dailyReport.module.css'

import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  TextField,
  MenuItem,
  Button,
  Slide,
  IconButton,
  Paper,
} from '@mui/material'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import URLs from '../../../../URLS/urls'
import { useSelector } from 'react-redux'
import {
  Clear,
  Edit,
  ExitToApp,
  Save,
  Search,
  Visibility,
} from '@mui/icons-material'
import moment from 'moment'
import sweetAlert from 'sweetalert'
import { DataGrid } from '@mui/x-data-grid'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = ({ menuRoles = [] }) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()

  const [zooKeepers, setZooKeepers] = useState([])
  const [table, setTable] = useState([])
  const [selectedRecords, setSelectedRecords] = useState([])
  const [collapse, setCollapse] = useState(false)
  const [collapseFields, setCollapseFields] = useState(false)

  const getSchema = yup.object().shape({
    date: yup
      .date()
      .typeError(
        language === 'en' ? 'Please select a Date' : 'कृपया तारीख निवडा'
      )
      .required(
        language === 'en' ? 'Please select a Date' : 'कृपया तारीख निवडा'
      ),
  })

  const [dynamicSchema, setDynamicSchema] = useState({})
  const [animalDropDown, setAnimalDropDown] = useState([])

  useEffect(() => {
    setDynamicSchema(
      menuRoles?.includes('APPROVAL')
        ? {
            zooAnimalKey: yup
              .number()
              .required(
                language === 'en'
                  ? 'Please select an animal'
                  : 'कृपया एक प्राणी निवडा'
              )
              .typeError(
                language === 'en'
                  ? 'Please select an animal'
                  : 'कृपया एक प्राणी निवडा'
              ),

            observation: yup
              .string()
              .required(
                language === 'en'
                  ? 'Please enter the observation'
                  : 'कृपया निरीक्षण प्रविष्ट करा'
              )
              .typeError(
                language === 'en'
                  ? 'Please enter the observation'
                  : 'कृपया निरीक्षण प्रविष्ट करा'
              ),
            treatment: yup
              .string()
              .required(
                language === 'en'
                  ? 'Please enter a remark'
                  : 'कृपया एक टिप्पणी प्रविष्ट करा'
              )
              .typeError(
                language === 'en'
                  ? 'Please enter a remark'
                  : 'कृपया एक टिप्पणी प्रविष्ट करा'
              ),
          }
        : {
            curatorRemark: yup
              .string()
              .required(
                language === 'en'
                  ? 'Please enter a remark'
                  : 'कृपया एक टिप्पणी प्रविष्ट करा'
              )
              .typeError(
                language === 'en'
                  ? 'Please enter a remark'
                  : 'कृपया एक टिप्पणी प्रविष्ट करा'
              ),
          }
    )
  }, [language])

  const scrutinySchema = yup.object().shape({
    action: yup
      .string()
      .required(
        language === 'en'
          ? 'Please select an action'
          : 'कृपया एखादी क्रिया निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select an action'
          : 'कृपया एखादी क्रिया निवडा'
      ),
    ...dynamicSchema,
  })

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(getSchema),
  })

  const {
    control: control2,
    watch: watch2,
    setValue: setValue2,
    reset: reset2,
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(scrutinySchema),
  })

  useEffect(() => {
    axios
      .get(`${URLs.VMS}/master/user/getZooKeepers`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) =>
        setZooKeepers(
          res.data?.map((j) => ({
            id: j.id,
            nameEn:
              j?.firstNameEn + ' ' + j?.middleNameEn + ' ' + j?.lastNameEn,
            nameMr:
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
        setAnimalDropDown(res.data?.mstZooAnimalList)
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  const deptUserName = {
    en: '(Entry by Admin User)',
    mr: '(प्रशासक वापरकर्त्याने भरलेली माहिती)',
  }

  const columns = [
    // {
    //   headerClassName: 'cellColor',
    //   ...GRID_CHECKBOX_SELECTION_COL_DEF,
    //   width: 60,
    // },
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 60,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'zooKeeperNameEn' : 'zooKeeperNameMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='zooKeeperName' />,
      width: 180,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'zooAnimalNameEn' : 'zooAnimalNameMr',
      headerAlign: 'center',
      // headerName: <FormattedLabel id='zooAnimal' />,
      headerName: <FormattedLabel id='speciesName' />,
      width: 125,
    },
    {
      headerClassName: 'cellColor',

      field: 'observation',
      headerAlign: 'center',
      headerName: <FormattedLabel id='observation' />,
      minWidth: 200,
      flex: 1,
    },
    // {
    //   headerClassName: 'cellColor',

    //   field: 'scrutinyRemark',
    //   headerAlign: 'center',
    //   // headerName: <FormattedLabel id='scrutinyRemark' />,
    //   headerName: <FormattedLabel id='treatment' />,
    //   minWidth: 400,
    // },
    {
      headerClassName: 'cellColor',

      field: 'treatment',
      headerAlign: 'center',
      headerName: <FormattedLabel id='doctorComment' />,
      minWidth: 200,
    },
    {
      headerClassName: 'cellColor',

      field: 'curatorRemark',
      headerAlign: 'center',
      headerName: <FormattedLabel id='curatorRemark' />,
      minWidth: 200,
    },
    {
      headerClassName: 'cellColor',

      field: 'status',
      headerAlign: 'center',
      headerName: <FormattedLabel id='status' />,
      width: 150,
      renderCell: (params) => (
        <div style={{ textTransform: 'capitalize' }}>{params?.value}</div>
      ),
    },
    {
      headerClassName: 'cellColor',

      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton
            style={{ color: !collapseFields ? '#1976d2' : '#afafaf' }}
            onClick={() => {
              console.log('Resetting: ', params.row)
              setCollapseFields(true)
              reset2({
                ...params.row,
                // zooAnimalKey: params.row?.zooAnimalKey,
                // observation: params.row?.observation,
              })
            }}
          >
            {menuRoles?.includes('APPROVAL') ? <Edit /> : <Visibility />}
          </IconButton>
        </>
      ),
    },
  ]

  const clearData = () => {
    menuRoles?.includes('FINAL_APPROVAL')
      ? reset2({
          id: watch2('id'),
          action: '',
          curatorRemark: '',
          observation: watch2('observation'),
          treatment: watch2('treatment'),
        })
      : reset2({
          id: watch2('id'),
          zooAnimalKey: '',
          treatment: '',
          observation: '',
          curatorRemark: '',
        })
  }

  useEffect(() => {
    console.log('id: ', watch2('id'))
  }, [watch2('id')])

  const getData = (data) => {
    axios
      .get(
        `${URLs.VMS}/trnZooKeeperReport/${
          menuRoles?.includes('APPROVAL')
            ? 'getByEntryDateForSupervisor'
            : 'getByEntryDateForOfficer'
        }`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { entryDate: moment(data?.date).format('YYYY-MM-DD') },
        }
      )
      .then((res) => {
        if (res.data?.trnZooKeeperReportList.length > 0) {
          setTable(
            res.data?.trnZooKeeperReportList.map((j, i) => ({
              ...j,
              srNo: i + 1,
              id: j.id,
              observation: j.observation,
              // scrutinyRemark: j.scrutinyRemark ?? 'Pending',
              treatment: j.treatment ?? 'Pending',
              curatorRemark: j.curatorRemark ?? 'Pending',
              status: j.status,
              zooAnimalKey: j?.zooAnimalKey,
              zooAnimalNameEn: animalDropDown?.find(
                (obj) => obj?.id == j?.zooAnimalKey
              )?.animalNameEn,
              zooAnimalNameMr: animalDropDown?.find(
                (obj) => obj?.id == j?.zooAnimalKey
              )?.animalNameMr,
              zooKeeperNameEn:
                // @ts-ignore
                zooKeepers.find((obj) => obj?.id == j.zooKeeperId)?.nameEn ??
                deptUserName?.en,
              zooKeeperNameMr:
                // @ts-ignore
                zooKeepers.find((obj) => obj?.id == j.zooKeeperId)?.nameMr ??
                deptUserName?.mr,
            }))
          )

          setCollapse(true)
        } else {
          sweetAlert(
            language === 'en' ? 'Info!' : 'माहिती!',
            language === 'en'
              ? 'No record remaining for approval for selected date'
              : 'निवडलेल्या तारखेसाठी मंजुरीसाठी कोणतेही रेकॉर्ड शिल्लक नाही',
            'info',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
          setCollapse(false)
          setSelectedRecords([])
          setTable([])
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language))
  }

  const scrutinySubmit = (data) => {
    const bodyForAPI = {
      ...data,
      role: menuRoles?.includes('APPROVAL') ? 'doctor' : 'curator',
      zooKeeperReportIds: selectedRecords.join(','),
    }

    sweetAlert({
      title: language === 'en' ? 'Confirmation' : 'पुष्टीकरण',
      text:
        language === 'en'
          ? `Are you sure you want to ${watch2('action')} the data ?`
          : `तुम्हाला खात्री आहे की तुम्ही डेटा ${watch2('action')} इच्छिता?`,
      icon: 'warning',
      buttons: [
        language === 'en' ? 'Cancel' : 'रद्द करा',
        language === 'en' ? 'Save' : 'जतन करा',
      ],
    }).then((ok) => {
      if (ok) {
        axios
          .post(`${URLs.VMS}/trnZooKeeperReport/saveApprove`, bodyForAPI, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            sweetAlert(
              language === 'en' ? 'Success!' : 'यशस्वी झाले!',
              watch2('action') == 'approve'
                ? language === 'en'
                  ? 'Approved successfully'
                  : 'यशस्वीरित्या मंजूर केले'
                : language === 'en'
                ? 'Rejected successfully'
                : 'यशस्वीरित्या नाकारले',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
            // setCollapse(false)
            // setSelectedRecords([])
            setCollapseFields(false)
            clearData()
            setValue2('id', null)
            setTable([])
            getData(watch('date'))
          })
          .catch((error) => catchExceptionHandlingMethod(error, language))
      }
    })
  }

  return (
    <>
      <form className={styles.row} onSubmit={handleSubmit(getData)}>
        <FormControl error={!!error.date}>
          {/* @ts-ignore */}
          <Controller
            control={control}
            name='date'
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disableFuture
                  inputFormat='dd/MM/yyyy'
                  label={<FormattedLabel id='date' />}
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: '180px' }}
                      {...params}
                      size='small'
                      fullWidth
                      variant='standard'
                      error={!!error.date}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          <FormHelperText>
            {error?.date ? error.date.message : null}
          </FormHelperText>
        </FormControl>
        <Button variant='contained' type='submit' endIcon={<Search />}>
          <FormattedLabel id='search' />
        </Button>
      </form>
      <Slide direction={'down'} in={collapse} mountOnEnter unmountOnExit>
        <div>
          <Slide
            direction={'down'}
            in={collapseFields}
            mountOnEnter
            unmountOnExit
          >
            <Paper
              style={{
                boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.5)',
                padding: 15,
                marginTop: 20,

                position: 'relative',
              }}
            >
              <form onSubmit={handleSubmit2(scrutinySubmit)}>
                <div className={styles.row}>
                  <FormControl
                    variant='standard'
                    error={!!error2.zooAnimalKey}
                    disabled={menuRoles?.includes('FINAL_APPROVAL')}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      {/* <FormattedLabel id='zooAnimal' /> */}
                      <FormattedLabel id='speciesName' />
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
                          label='zooAnimalKey'
                        >
                          {animalDropDown?.map((j) => (
                            <MenuItem key={j?.id} value={j?.id}>
                              {language === 'en'
                                ? j?.animalNameEn
                                : j?.animalNameMr}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                      name='zooAnimalKey'
                      control={control2}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {error2?.zooAnimalKey
                        ? error2.zooAnimalKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                  <TextField
                    disabled={menuRoles?.includes('FINAL_APPROVAL')}
                    sx={{
                      width: menuRoles?.includes('FINAL_APPROVAL') ? 400 : 500,
                    }}
                    label={<FormattedLabel id='observation' required />}
                    variant='standard'
                    {...register2('observation')}
                    InputLabelProps={{ shrink: !!watch2('observation') }}
                    error={!!error2.observation}
                    helperText={
                      error2?.observation ? error2.observation.message : null
                    }
                  />
                  {menuRoles?.includes('FINAL_APPROVAL') && (
                    <TextField
                      disabled
                      sx={{ width: 400 }}
                      label={<FormattedLabel id='doctorComment' required />}
                      variant='standard'
                      {...register2('treatment')}
                      InputLabelProps={{ shrink: !!watch2('treatment') }}
                      error={!!error2.treatment}
                      helperText={
                        error2?.treatment ? error2.treatment.message : null
                      }
                    />
                  )}
                </div>
                <div className={styles.row}>
                  <FormControl variant='standard' error={!!error2.action}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      <FormattedLabel id='actions' />
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
                          label='action'
                        >
                          <MenuItem key={1} value={'approve'}>
                            {language === 'en' ? 'Approve' : 'मंजूर'}
                          </MenuItem>
                          <MenuItem key={3} value={'revert'}>
                            {language === 'en' ? 'Revert' : 'मागे'}
                          </MenuItem>
                          <MenuItem key={2} value={'reject'}>
                            {language === 'en' ? 'Reject' : 'नामंजूर'}
                          </MenuItem>
                        </Select>
                      )}
                      name='action'
                      control={control2}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {error2?.action ? error2.action.message : null}
                    </FormHelperText>
                  </FormControl>

                  {menuRoles?.includes('APPROVAL') ? (
                    <TextField
                      sx={{ width: '500px' }}
                      label={<FormattedLabel id='doctorComment' required />}
                      variant='standard'
                      {...register2('treatment')}
                      InputLabelProps={{ shrink: !!watch2('treatment') }}
                      error={!!error2.treatment}
                      helperText={
                        error2?.treatment ? error2.treatment.message : null
                      }
                    />
                  ) : (
                    <TextField
                      sx={{ width: '500px' }}
                      label={<FormattedLabel id='curatorRemark' required />}
                      variant='standard'
                      {...register2('curatorRemark')}
                      InputLabelProps={{ shrink: !!watch2('curatorRemark') }}
                      error={!!error2.curatorRemark}
                      helperText={
                        error2?.curatorRemark
                          ? error2.curatorRemark.message
                          : null
                      }
                    />
                  )}
                </div>
                <div className={styles.row}>
                  <Button
                    variant='contained'
                    color='success'
                    type='submit'
                    endIcon={<Save />}
                  >
                    <FormattedLabel id='save' />
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={clearData}
                    endIcon={<Clear />}
                  >
                    <FormattedLabel id='clear' />
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    // onClick={() => router.back()}
                    onClick={() => {
                      reset2({
                        id: null,
                        zooAnimalKey: '',
                        treatment: '',
                        observation: '',
                        curatorRemark: '',
                      })

                      setCollapseFields(false)
                    }}
                    endIcon={<ExitToApp />}
                  >
                    <FormattedLabel id='exit' />
                  </Button>
                </div>
              </form>
            </Paper>
          </Slide>

          <DataGrid
            autoHeight
            sx={{
              marginTop: '40px',
              '& .cellColor': {
                backgroundColor: '#1976d2',
                color: 'white',
              },
              '.MuiDataGrid-cellContent': {
                whiteSpace: 'normal',
              },
              '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                py: 1,
              },
              '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                py: '15px',
              },
              '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                py: '22px',
              },
            }}
            getEstimatedRowHeight={() => 100}
            getRowHeight={() => 'auto'}
            loading={table.length == 0}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 0 },
                disableExport: false,
                disableToolbarButton: false,
                csvOptions: { disableToolbarButton: false },
                printOptions: { disableToolbarButton: true },
              },
            }}
            rows={table}
            //@ts-ignore
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            // checkboxSelection
            disableSelectionOnClick
            // selectionModel={selectedRecords}
            // onSelectionModelChange={(allRowsId) => {
            //   // @ts-ignore
            //   setSelectedRecords(allRowsId)
            // }}
            experimentalFeatures={{ newEditingApi: true }}
          />
        </div>
      </Slide>
    </>
  )
}

export default Index
