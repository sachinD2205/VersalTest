import React, { useEffect, useState } from 'react'
import router from 'next/router'
import Head from 'next/head'
import styles from './vetMasters.module.css'
import { sortByDesc } from '../../../containers/reuseableComponents/Sorter'

import Breadcrumb from '../../../components/common/BreadcrumbComponent'
import URLs from '../../../URLS/urls'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { Paper, Button, TextField, IconButton, Slide } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormProvider, useForm } from 'react-hook-form'
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
import Transliteration from '../../../components/common/linguosol/transliteration'
import Loader from '../../../containers/Layout/components/Loader'
import { useSelector } from 'react-redux'

import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  const language = useSelector((state) => state.labels?.language)

  const userToken = useGetToken()

  const [table, setTable] = useState([])
  const [runAgain, setRunAgain] = useState(false)
  const [collapse, setCollapse] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [loader, setLoader] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)

  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  let petSchema = yup.object().shape({
    nameEn: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter pet animal name in english'
          : 'कृपया पाळीव प्राण्याचे नाव इंग्रजीमध्ये प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z0-9\s]+$/,
        language === 'en'
          ? 'Must be only english characters'
          : 'फक्त इंग्लिश शब्द'
      ),
    nameMr: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter pet animal name in marathi'
          : 'कृपया पाळीव प्राण्याचे नाव मराठीत टाका'
      )
      .matches(
        /^[\u0900-\u0965\u0970-\u097F\s]+$/,
        language === 'en'
          ? 'Must be only marathi characters'
          : 'फक्त मराठी शब्द'
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
    formState: { errors: error },
  } = methods

  useEffect(() => {
    setRunAgain(false)

    getTableData()
  }, [runAgain])

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
            `${URLs.VMS}/mstPetAnimal/save`,
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

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 100,
    },

    {
      headerClassName: 'cellColor',

      field: 'nameEn',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petAnimalEn' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',

      field: 'nameMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='petAnimalMr' />,
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
                  nameEn: params.row.nameEn,
                  nameMr: params.row.nameMr,
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

  const getTableData = (pageSize = 10, pageNo = 0) => {
    setLoadingState(true)
    axios
      .get(`${URLs.VMS}/mstPetAnimal/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize, sortBy: 'id', sortDir: 'desc' },
      })
      .then((res) => {
        setTable(
          res.data.mstPetAnimalList?.map((j, i) => ({
            srNo: i + 1,
            ...j,
            activeFlag: j?.activeFlag,
            status: j?.activeFlag == 'Y' ? 'Active' : 'Inactive',
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

  const finalSubmit = (data) => {
    setLoader(true)

    axios
      .post(
        `${URLs.VMS}/mstPetAnimal/save`,
        { ...data, activeFlag: 'Y' },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (data.id) {
          language === 'en'
            ? sweetAlert(
                'Updated!',
                'Animal data updated successfully!',
                'success',
                { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
              )
            : sweetAlert(
                'अद्यतनित!',
                'प्राण्यांचा डेटा यशस्वीरित्या अपडेट केला!',
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
          id: null,
          nameEn: '',
          nameMr: '',
        })
        setCollapse(!collapse)
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
        <title>Pet Animal Master</title>
      </Head>
      <Breadcrumb />
      <Paper className={styles.main}>
        {loader && <Loader />}
        <div className={styles.title}>
          <FormattedLabel id='petAnimal' />
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
                  <div style={{ width: 250 }}>
                    <Transliteration
                      fieldName={'nameEn'}
                      updateFieldName={'nameMr'}
                      sourceLang={'eng'}
                      targetLang={'mar'}
                      label={<FormattedLabel id='petAnimalEn' required />}
                      error={!!error.nameEn}
                      targetError={'nameEn'}
                      width={250}
                      InputLabelProps={{
                        shrink: !!watch('nameEn'),
                      }}
                      helperText={error?.nameEn ? error.nameEn.message : null}
                    />
                  </div>
                  {/* <TextField
                sx={{ width: '250px' }}
                label={<FormattedLabel id='petAnimalEn' />}
                variant='standard'
                {...register('nameEn')}
                error={!!error.nameEn}
                helperText={error?.nameEn ? error.nameEn.message : null}
              /> */}
                  <TextField
                    sx={{ width: '250px' }}
                    label={<FormattedLabel id='petAnimalMr' required />}
                    variant='standard'
                    {...register('nameMr')}
                    error={!!error.nameMr}
                    helperText={error?.nameMr ? error.nameMr.message : null}
                    InputLabelProps={{
                      shrink: !!watch('nameMr'),
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
                        nameEn: '',
                        nameMr: '',
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
