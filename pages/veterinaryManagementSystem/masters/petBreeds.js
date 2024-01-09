import React, { useEffect, useState } from 'react'
import router from 'next/router'
import Head from 'next/head'
import styles from './vetMasters.module.css'
import { sortByAsc } from '../../../containers/reuseableComponents/Sorter'

import Breadcrumb from '../../../components/common/BreadcrumbComponent'

import URLs from '../../../URLS/urls'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import {
  Paper,
  Button,
  TextField,
  IconButton,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import {
  Add,
  Clear,
  Delete,
  Edit,
  ExitToApp,
  Save,
  ToggleOff,
  ToggleOn,
} from '@mui/icons-material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import axios from 'axios'
import sweetAlert from 'sweetalert'
import { useSelector } from 'react-redux'
import Transliteration from '../../../components/common/linguosol/transliteration'
import Loader from '../../../containers/Layout/components/Loader'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  const userToken = useGetToken()

  const [table, setTable] = useState([])
  const [petAnimalDropDown, setPetAnimalDropDown] = useState([
    {
      id: 1,
      petNameEn: '',
      petNameMr: '',
    },
  ])
  const [runAgain, setRunAgain] = useState(false)
  const [collapse, setCollapse] = useState(false)
  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })
  const [loadingState, setLoadingState] = useState(false)
  const [loader, setLoader] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)

  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  let petSchema = yup.object().shape({
    petAnimalKey: yup
      .number()
      .required(
        language === 'en'
          ? 'Please select a pet animal'
          : 'कृपया पाळीव प्राणी निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select a pet animal'
          : 'कृपया पाळीव प्राणी निवडा'
      ),
    breedNameEn: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter breed name in english'
          : 'कृपया जातीचे नाव इंग्रजीमध्ये प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z0-9\s]+$/,
        language === 'en'
          ? 'Must be only english characters'
          : 'फक्त इंग्लिश शब्द'
      ),

    breedNameMr: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter breed name in marathi'
          : 'कृपया जातीचे नाव मराठीत टाका'
      )
      .matches(
        /^[०-९\u0900-\u097F ]+$/,
        language === 'en'
          ? 'Must be only marathi characters'
          : 'फक्त मराठी शब्द '
      ),
  })

  const methods = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(petSchema),
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
    //Get Pet Animals
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setPetAnimalDropDown(() => {
          sortByAsc(res.data.mstPetAnimalList, 'nameEn')
          return res.data.mstPetAnimalList?.map((j) => ({
            id: j?.id,
            petNameEn: j?.nameEn,
            petNameMr: j?.nameMr,
          }))
        })
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language)
      })
  }, [])

  useEffect(() => {
    setRunAgain(false)

    //Get Pet Breeds
    getTableData()
  }, [runAgain, petAnimalDropDown])

  const getTableData = (pageSize = 10, pageNo = 0) => {
    setLoadingState(true)
    axios
      .get(`${URLs.VMS}/mstAnimalBreed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize, sortBy: 'id', sortDir: 'desc' },
      })
      .then((res) => {
        setTable(() => {
          return res.data.mstAnimalBreedList?.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            petAnimalKey: j?.petAnimalKey,
            breedNameEn: j?.breedNameEn,
            breedNameMr: j?.breedNameMr,
            petAnimalEn: petAnimalDropDown.find(
              (obj) => obj?.id === j?.petAnimalKey
            )?.petNameEn,
            petAnimalMr: petAnimalDropDown.find(
              (obj) => obj?.id === j?.petAnimalKey
            )?.petNameMr,
            activeFlag: j?.activeFlag,
            status: j?.activeFlag == 'Y' ? 'Active' : 'Inactive',
          }))
        })

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
            `${URLs.VMS}/mstAnimalBreed/save`,
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
              language === 'en' ? 'Success!' : 'यशस्वी झाले!',
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

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },
    {
      headerClassName: 'cellColor',

      field: language === 'en' ? 'petAnimalEn' : 'petAnimalMr',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petAnimal' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'breedNameEn',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='breedNameEn' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'breedNameMr',
      // align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='breedNameMr' />,
      flex: 1,
    },

    {
      headerClassName: 'cellColor',

      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              style={{
                color: params.row.activeFlag == 'Y' ? '#1976d2' : 'lightgray',
              }}
              disabled={params.row.activeFlag == 'N'}
              onClick={() => {
                reset({
                  id: params.row.id,
                  petAnimalKey: params.row.petAnimalKey,
                  breedNameEn: params.row.breedNameEn,
                  breedNameMr: params.row.breedNameMr,
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
  const finalSubmit = (data) => {
    setLoader(true)

    axios
      .post(
        `${URLs.VMS}/mstAnimalBreed/save`,
        { ...data, activeFlag: 'Y' },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (data.id) {
          sweetAlert(
            language == 'en' ? 'Updated!' : 'अद्यतनित!',
            language == 'en'
              ? 'Animal data updated successfully!'
              : 'प्राण्यांचा डेटा यशस्वीरित्या अपडेट केला!',
            'success',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
        } else {
          sweetAlert(
            language === 'en' ? 'Success!' : 'यशस्वी झाले!',
            language === 'en'
              ? 'Animal data saved successfully!'
              : 'प्राण्यांचा डेटा यशस्वीरित्या जतन केला!',
            'success',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
        }
        reset({
          petAnimalKey: '',
          breedNameEn: '',
          breedNameMr: '',
        })
        setRunAgain(true)
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
        <title>Pet Breeds Master</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {loader && <Loader />}

        <div className={styles.title}>
          <FormattedLabel id='petBreed' />
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
              <div style={{ padding: '5vh 3%' }}>
                <div
                  className={styles.row}
                  style={{ justifyContent: 'space-evenly' }}
                >
                  <FormControl variant='standard' error={!!error.petAnimalKey}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      <FormattedLabel id='petAnimal' required />
                    </InputLabel>
                    {/* @ts-ignore */}
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: '250px' }}
                          labelId='demo-simple-select-standard-label'
                          id='demo-simple-select-standard'
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label='petAnimalKey'
                        >
                          {petAnimalDropDown &&
                            petAnimalDropDown?.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  //@ts-ignore
                                  value.id
                                }
                              >
                                {language == 'en'
                                  ? //@ts-ignore
                                    value.petNameEn
                                  : // @ts-ignore
                                    value?.petNameMr}
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
                  <div style={{ width: 250 }}>
                    <Transliteration
                      fieldName={'breedNameEn'}
                      updateFieldName={'breedNameMr'}
                      sourceLang={'eng'}
                      targetLang={'mar'}
                      label={<FormattedLabel id='breedNameEn' required />}
                      error={!!error.breedNameEn}
                      targetError={'breedNameEn'}
                      width={250}
                      InputLabelProps={{
                        shrink: !!watch('breedNameEn'),
                      }}
                      helperText={
                        error?.breedNameEn ? error.breedNameEn.message : null
                      }
                    />
                  </div>
                  {/* <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='breedNameEn' />}
                variant='standard'
                {...register('breedNameEn')}
                error={!!error.breedNameEn}
                helperText={
                  error?.breedNameEn ? error.breedNameEn.message : null
                }
              /> */}
                  <TextField
                    sx={{ width: '250px' }}
                    label={<FormattedLabel id='breedNameMr' required />}
                    variant='standard'
                    {...register('breedNameMr')}
                    error={!!error.breedNameMr}
                    helperText={
                      error?.breedNameMr ? error.breedNameMr.message : null
                    }
                    InputLabelProps={{
                      shrink: !!watch('breedNameMr'),
                    }}
                  />
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
                      reset({
                        petAnimalKey: null,
                        breedNameEn: '',
                        breedNameMr: '',
                      })
                    }}
                  >
                    <FormattedLabel id='clear' />
                  </Button>
                  <Button
                    variant='contained'
                    color='error'
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      router.push(`/veterinaryManagementSystem/dashboard`)
                    }}
                  >
                    <FormattedLabel id='exit' />
                  </Button>
                </div>
              </div>
            </Slide>
          </form>
        </FormProvider>

        <div className={styles.table}>
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
          />
        </div>
      </Paper>
    </>
  )
}

export default Index
