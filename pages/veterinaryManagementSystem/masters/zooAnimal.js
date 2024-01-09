import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from './vetMasters.module.css'
import URLs from '../../../URLS/urls'
import { useSelector } from 'react-redux'
import {
  Button,
  FormControl,
  IconButton,
  Paper,
  Slide,
  TextField,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { sortByAsc } from '../../../containers/reuseableComponents/Sorter'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Add,
  Clear,
  Edit,
  ExitToApp,
  Save,
  ToggleOff,
  ToggleOn,
} from '@mui/icons-material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import Breadcrumb from '../../../components/common/BreadcrumbComponent'
import Transliteration from '../../../components/common/linguosol/transliteration'
import Loader from '../../../containers/Layout/components/Loader'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  const userToken = useGetToken()

  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const [collapse, setCollapse] = useState(false)
  const [table, setTable] = useState([])
  const [scheduleDropDown, setScheduleDropDown] = useState([])
  const [classDropDown, setClassDropDown] = useState([])
  const [familyDropDown, setFamilyDropDown] = useState([])
  const [loader, setLoader] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)

  //Get Schedule
  useEffect(() => {
    axios
      .get(`${URLs.VMS}/mstSchedule/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setScheduleDropDown(() => {
          sortByAsc(res.data.mstScheduleList, 'scheduleEn')

          return res.data.mstScheduleList.map((j) => ({
            id: j.id,
            scheduleEn: j.scheduleEn,
            scheduleMr: j.scheduleMr,
          }))
        })
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
    //Get Class
    axios
      .get(`${URLs.VMS}/mstClass/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setClassDropDown(() => {
          sortByAsc(res.data.mstClassList, 'classEn')
          return res.data.mstClassList.map((j) => ({
            id: j.id,
            classEn: j.classEn,
            classMr: j.classMr,
          }))
        })
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
    //Get Family
    axios
      .get(`${URLs.VMS}/mstAnimalFamily/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setFamilyDropDown(() => {
          sortByAsc(res.data.mstAnimalFamilyDaoList, 'familyEn')
          return res.data.mstAnimalFamilyDaoList.map((j) => ({
            id: j.id,
            familyEn: j.familyEn,
            familyMr: j.familyMr,
          }))
        })
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  const [runAgain, setRunAgain] = useState(false)
  const [loadingState, setLoadingState] = useState(false)

  let zooAnimalSchema = yup.object().shape({
    animalNameEn: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter animal Name in English'
          : 'कृपया प्राण्याचे नाव इंग्रजीमध्ये प्रविष्ट करा'
      )
      .typeError(
        language === 'en'
          ? 'Please enter name in English'
          : 'कृपया प्राण्याचे नाव इंग्रजीमध्ये प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z0-9\s ()_{}]+$/,
        language === 'en'
          ? 'Must be only english characters'
          : 'फक्त इंग्लिश शब्द'
      ),
    animalNameMr: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter animal name in marathi'
          : 'कृपया प्राण्याचे नाव मराठीत टाका'
      )
      .typeError(
        language === 'en'
          ? 'Please enter name in marathi'
          : 'कृपया प्राण्याचे नाव मराठीत टाका'
      )
      .matches(
        /^[०-९\u0900-\u097F ()_{} ]+$/,
        language === 'en'
          ? 'Must be only marathi characters'
          : 'फक्त मराठी शब्द'
      ),
    scheduleKey: yup
      .number()
      .required(
        language === 'en'
          ? 'Please select a Schedule'
          : 'कृपया एक वेळापत्रक निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select a Schedule'
          : 'कृपया एक वेळापत्रक निवडा'
      ),
    classKey: yup
      .number()
      .required(
        language === 'en' ? 'Please select a Class' : 'कृपया वर्ग निवडा'
      )
      .typeError(
        language === 'en' ? 'Please select a Class' : 'कृपया वर्ग निवडा'
      ),
  })

  const methods = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(zooAnimalSchema),
  })
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors: error },
  } = methods

  useEffect(() => {
    setRunAgain(false)
    getTableData()
  }, [runAgain, classDropDown, scheduleDropDown])

  const getTableData = (pageSize = 10, pageNo = 0) => {
    setLoadingState(true)
    axios
      .get(`${URLs.VMS}/mstZooAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize, sortBy: 'id', sortDir: 'desc' },
      })
      .then((res) => {
        setTable(
          res.data.mstZooAnimalList.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            animalNameEn: j.animalNameEn,
            animalNameMr: j.animalNameMr,
            scheduleKey: j.scheduleKey,
            classKey: j.classKey,
            scheduleEn: scheduleDropDown.find((obj) => obj.id === j.scheduleKey)
              ?.scheduleEn,
            scheduleMr: scheduleDropDown.find((obj) => obj.id === j.scheduleKey)
              ?.scheduleMr,
            classEn: classDropDown.find((obj) => obj.id === j.classKey)
              ?.classEn,
            classMr: classDropDown.find((obj) => obj.id === j.classKey)
              ?.classMr,
            familyEn: familyDropDown.find((obj) => obj.id === j.familyKey)
              ?.familyEn,
            familyMr: familyDropDown.find((obj) => obj.id === j.familyKey)
              ?.familyMr,
            activeFlag: j.activeFlag,
            status: j.activeFlag == 'Y' ? 'Active' : 'Inactive',
          }))
        )

        setData({
          ...data,
          totalRows: res.data.totalElements,
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })
        setLoadingState(false)
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
        setLoadingState(false)
      })
  }

  const columns = [
    {
      headerClassName: 'cellColor',
      field: 'srNo',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },
    {
      headerClassName: 'cellColor',
      field: language === 'en' ? 'animalNameEn' : 'animalNameMr',

      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='animalName' />,
      minWidth: 200,
      flex: 1.5,
    },

    {
      headerClassName: 'cellColor',
      field: language === 'en' ? 'scheduleEn' : 'scheduleMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='schedule' />,
      minWidth: 150,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',
      field: language === 'en' ? 'classEn' : 'classMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='class' />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'familyEn' : 'familyMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='family' />,
      minWidth: 200,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'status',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='status' />,
      width: 125,
    },

    {
      headerClassName: 'cellColor',
      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: params.row.activeFlag == 'Y' ? '#1976d2' : 'lightgray',
              }}
              disabled={params.row.activeFlag == 'N'}
              onClick={() => {
                console.table({ ...params.row })
                reset({
                  id: params.row.id,
                  animalNameEn: params.row.animalNameEn,
                  animalNameMr: params.row.animalNameMr,
                  classKey: params.row.classKey,
                  scheduleKey: params.row.scheduleKey,
                })
                setCollapse(true)
                setIsUpdateState(true)
              }}
            >
              <Edit />
            </IconButton>
            <IconButton
              sx={{ color: params.row.activeFlag == 'Y' ? 'green' : 'red' }}
              onClick={() => deleteById(params.row, params.row.activeFlag)}
            >
              {params.row.activeFlag == 'Y' ? (
                <ToggleOn
                  sx={{
                    fontSize: 30,
                  }}
                />
              ) : (
                <ToggleOff
                  sx={{
                    fontSize: 30,
                  }}
                />
              )}
            </IconButton>
          </>
        )
      },
    },
  ]

  const deleteById = (rowData, flag) => {
    sweetAlert({
      title: language === 'en' ? 'Confirmation' : 'पुष्टीकरण',
      text:
        language === 'en'
          ? 'Do you really want to change the status of this record ?'
          : 'तुम्हाला खरोखर या रेकॉर्डची स्थिती बदलायची आहे का?',
      icon: 'warning',
      buttons: [
        language === 'en' ? 'No' : 'नाही',
        language === 'en' ? 'Yes' : 'होय',
      ],
    }).then((ok) => {
      if (ok) {
        setLoader(true)
        axios
          .post(
            `${URLs.VMS}/mstZooAnimal/save`,
            {
              ...rowData,
              activeFlag: flag == 'Y' ? 'N' : 'Y',
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            sweetAlert(
              language === 'en' ? 'Success' : 'यशस्वी झाले',
              flag == 'Y'
                ? language === 'en'
                  ? 'Record successfully deactivated'
                  : 'रेकॉर्ड यशस्वीरित्या निष्क्रिय केले'
                : language === 'en'
                ? 'Record successfully activated'
                : 'रेकॉर्ड यशस्वीरित्या सक्रिय केले',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
            setRunAgain(true)
            setLoader(false)
          })
          .catch((error) => {
            catchExceptionHandlingMethod(error, language)
            setLoader(false)
          })
      }
    })
  }

  const finalSubmit = (data) => {
    setLoader(true)

    axios
      .post(
        `${URLs.VMS}/mstZooAnimal/save`,
        {
          ...data,
          activeFlag: 'Y',
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        data.id
          ? sweetAlert(
              language === 'en' ? 'Success' : 'यशस्वी झाले',
              language === 'en'
                ? 'Data successfully updated'
                : 'डेटा यशस्वीरित्या अपडेट केला',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
          : sweetAlert(
              language === 'en' ? 'Success' : 'यशस्वी झाले',
              language === 'en'
                ? 'Data successfully saved'
                : 'डेटा यशस्वीरित्या जतन केला',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
        setRunAgain(true)
        reset({
          id: null,
          animalNameEn: '',
          animalNameMr: '',
          classKey: '',
          scheduleKey: '',
        })
        setCollapse(false)
        setLoader(false)
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
        setLoader(false)
      })
  }

  return (
    <>
      <Head>
        <title>Zoo Animal Master</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {loader && <Loader />}

        <div className={styles.title}>
          <FormattedLabel id='zooAnimalMaster' />
        </div>
        <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() => {
              setCollapse(!collapse)
              setIsUpdateState(false)
            }}
          >
            <FormattedLabel id='add' />
          </Button>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(finalSubmit)}>
            <Slide direction='down' in={collapse} mountOnEnter unmountOnExit>
              <div>
                <div className={styles.row}>
                  <div style={{ width: 250 }}>
                    <Transliteration
                      fieldName={'animalNameEn'}
                      updateFieldName={'animalNameMr'}
                      sourceLang={'eng'}
                      targetLang={'mar'}
                      label={<FormattedLabel id='animalNameEn' required />}
                      error={!!error.animalNameEn}
                      targetError={'animalNameEn'}
                      width={250}
                      InputLabelProps={{
                        shrink: !!watch('animalNameEn'),
                      }}
                      helperText={
                        error?.animalNameEn ? error.animalNameEn.message : null
                      }
                    />
                  </div>
                  {/* <TextField
                  sx={{ width: '200px' }}
                  label={<FormattedLabel id='animalNameEn' />}
                  variant='standard'
                  {...register('animalNameEn')}
                  error={!!error.animalNameEn}
                  helperText={
                    error?.animalNameEn ? error.animalNameEn.message : null
                  }
                /> */}
                  <TextField
                    sx={{ width: 250 }}
                    label={<FormattedLabel id='animalNameMr' required />}
                    variant='standard'
                    {...register('animalNameMr')}
                    error={!!error.animalNameMr}
                    helperText={
                      error?.animalNameMr ? error.animalNameMr.message : null
                    }
                    InputLabelProps={{
                      shrink: !!watch('animalNameMr'),
                    }}
                  />
                  <TextField
                    sx={{ width: 250 }}
                    label={<FormattedLabel id='scientificName' />}
                    variant='standard'
                    {...register('scientificName')}
                    error={!!error.scientificName}
                    helperText={
                      error?.scientificName
                        ? error.scientificName.message
                        : null
                    }
                    InputLabelProps={{
                      shrink: !!watch('scientificName'),
                    }}
                  />
                  <FormControl variant='standard' error={!!error.scheduleKey}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      <FormattedLabel id='schedule' required />
                    </InputLabel>
                    {/* @ts-ignore */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label='scheduleKey'
                        >
                          {scheduleDropDown &&
                            scheduleDropDown.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  //  @ts-ignore
                                  value.id
                                }
                              >
                                {language == 'en'
                                  ? //@ts-ignore
                                    value.scheduleEn
                                  : // @ts-ignore
                                    value?.scheduleMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='scheduleKey'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {error?.scheduleKey ? error.scheduleKey.message : null}
                    </FormHelperText>
                  </FormControl>
                  <FormControl variant='standard' error={!!error.classKey}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      <FormattedLabel id='class' required />
                    </InputLabel>
                    {/* @ts-ignore */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label='classKey'
                        >
                          {classDropDown &&
                            classDropDown.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  // @ts-ignore
                                  value.id
                                }
                              >
                                {language == 'en'
                                  ? //@ts-ignore
                                    value.classEn
                                  : // @ts-ignore
                                    value?.classMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='classKey'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {error?.classKey ? error.classKey.message : null}
                    </FormHelperText>
                  </FormControl>

                  <FormControl variant='standard' error={!!error.familyKey}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      <FormattedLabel id='family' />
                    </InputLabel>
                    {/* @ts-ignore */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 250 }}
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label='familyKey'
                        >
                          {familyDropDown &&
                            familyDropDown.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  // @ts-ignore
                                  value.id
                                }
                              >
                                {language == 'en'
                                  ? //@ts-ignore
                                    value.familyEn
                                  : // @ts-ignore
                                    value?.familyMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='familyKey'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {error?.familyKey ? error.familyKey.message : null}
                    </FormHelperText>
                  </FormControl>
                  <div style={{ width: 250 }} />
                  <div style={{ width: 250 }} />
                </div>

                <div className={styles.buttons}>
                  <Button
                    color='success'
                    variant='contained'
                    type='submit'
                    endIcon={<Save />}
                  >
                    {isUpdateState ? (
                      <FormattedLabel id='update' />
                    ) : (
                      <FormattedLabel id='save' />
                    )}
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    endIcon={<Clear />}
                    onClick={() => {
                      reset((old) => ({
                        ...old,
                        animalNameEn: '',
                        animalNameMr: '',
                        classKey: '',
                        scheduleKey: '',
                      }))
                    }}
                  >
                    <FormattedLabel id='clear' />
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      reset({
                        animalNameEn: '',
                        animalNameMr: '',
                        classKey: '',
                        scheduleKey: '',
                      })
                      setCollapse(false)
                    }}
                  >
                    <FormattedLabel id='exit' />
                  </Button>
                </div>
              </div>
            </Slide>
          </form>
        </FormProvider>
        <DataGrid
          loading={loadingState}
          autoHeight
          sx={{
            marginTop: '5vh',
            width: '100%',

            '& .cellColor': {
              backgroundColor: '#1976d2',
              color: 'white',
            },
          }}
          rows={table}
          //@ts-ignore
          columns={columns}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          paginationMode='server'
          rowCount={data?.totalRows}
          rowsPerPageOptions={data?.rowsPerPageOptions}
          page={data?.page}
          pageSize={data?.pageSize}
          onPageChange={(pageNo) => {
            getTableData(data?.pageSize, pageNo)
          }}
          onPageSizeChange={(pageSize) => {
            setData({ ...data, pageSize })
            getTableData(pageSize, data?.page)
          }}
          components={{ Toolbar: GridToolbar }}
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
        />
      </Paper>
    </>
  )
}

export default Index
