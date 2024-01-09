import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from './vetMasters.module.css'
import URLs from '../../../URLS/urls'
import { Button, IconButton, Paper, Slide, TextField } from '@mui/material'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import { FormProvider, useForm } from 'react-hook-form'
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
import { useSelector } from 'react-redux'
import { useGetToken } from '../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../util/util'

const Index = () => {
  // @ts-ignore

  const language = useSelector((state) => state.labels?.language)

  const userToken = useGetToken()

  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })
  const [loadingState, setLoadingState] = useState(false)
  const [collapse, setCollapse] = useState(false)
  const [table, setTable] = useState([])
  const [runAgain, setRunAgain] = useState(false)
  const [loader, setLoader] = useState(false)
  let classSchema = yup.object().shape({
    classEn: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter class name in english'
          : 'कृपया इंग्रजीमध्ये वर्गीकरणाचे नाव प्रविष्ट करा'
      )
      .typeError(
        language === 'en'
          ? 'Please enter class name in english'
          : 'कृपया इंग्रजीमध्ये वर्गीकरणाचे नाव प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z\s]+$/,
        language === 'en'
          ? 'Must be only english characters'
          : 'फक्त इंग्लिश शब्द '
      ),
    classMr: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter class name in marathi'
          : 'कृपया मराठीत वर्गीकरणाचे नाव टाका'
      )
      .typeError(
        language === 'en'
          ? 'Please enter class name in marathi'
          : 'कृपया मराठीत वर्गीकरणाचे नाव टाका'
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
    resolver: yupResolver(classSchema),
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

  const getTableData = (pageSize = 10, pageNo = 0) => {
    setLoadingState(true)
    axios
      .get(`${URLs.VMS}/mstClass/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize, sortBy: 'id', sortDir: 'desc' },
      })
      .then((res) => {
        setTable(
          res.data.mstClassList?.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            classEn: j.classEn,
            classMr: j.classMr,
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
        if (error.response.status == 401) {
          catchExceptionHandlingMethod(error, language)
        } else {
          sweetAlert(
            language === 'en' ? 'Error!' : 'त्रुटी!',
            language === 'en' ? 'Something went wrong' : 'काहीतरी चूक झाली',
            'error',
            { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
          )
        }
        setLoadingState(false)
      })
  }

  const columns = [
    {
      headerClassName: 'cellColor',
      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 80,
    },
    {
      headerClassName: 'cellColor',
      field: 'classEn',
      headerAlign: 'center',
      headerName: <FormattedLabel id='classNameEn' />,
      minWidth: 250,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',
      field: 'classMr',
      headerAlign: 'center',
      headerName: <FormattedLabel id='classNameMr' />,
      minWidth: 250,
      flex: 1,
    },

    {
      headerClassName: 'cellColor',

      field: 'status',
      headerAlign: 'center',
      headerName: <FormattedLabel id='status' />,
      minWidth: 150,
      flex: 0.3,
    },

    {
      headerClassName: 'cellColor',
      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      minWidth: 150,
      flex: 0.3,
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
                  classEn: params.row.classEn,
                  classMr: params.row.classMr,
                })
                setCollapse(true)
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
            `${URLs.VMS}/mstClass/save`,
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
            sweetAlert(
              language === 'en' ? 'Error!' : 'त्रुटी!',
              language === 'en' ? 'Something went wrong' : 'काहीतरी चूक झाली',
              'error',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
            setLoader(false)
          })
      }
    })
  }

  const finalSubmit = (data) => {
    setLoader(true)
    axios
      .post(
        `${URLs.VMS}/mstClass/save`,
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
          classEn: '',
          classMr: '',
        })
        setCollapse(false)
        setLoader(false)
      })
      .catch((error) => {
        sweetAlert(
          language === 'en' ? 'Error!' : 'त्रुटी!',
          language === 'en' ? 'Something went wrong' : 'काहीतरी चूक झाली',
          'error',
          { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
        )
        setLoader(false)
      })
  }

  return (
    <>
      <Head>
        <title>Animal Classification Master</title>
      </Head>
      <Breadcrumb />
      <Paper className={styles.main}>
        {loader && <Loader />}
        <div className={styles.title}>
          <FormattedLabel id='classMaster' />
        </div>
        <div className={styles.row} style={{ justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            endIcon={<Add />}
            onClick={() => setCollapse(!collapse)}
          >
            <FormattedLabel id='add' />
          </Button>
        </div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(finalSubmit)}>
            <Slide direction='down' in={collapse} mountOnEnter unmountOnExit>
              <div>
                <div
                  className={styles.row}
                  style={{ justifyContent: 'space-evenly' }}
                >
                  {/* <TextField
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='classNameEn' />}
                  variant='standard'
                  {...register('classEn')}
                  error={!!error.classEn}
                  helperText={error?.classEn ? error.classEn.message : null}
                /> */}
                  <div style={{ width: 250 }}>
                    <Transliteration
                      fieldName={'classEn'}
                      updateFieldName={'classMr'}
                      sourceLang={'eng'}
                      targetLang={'mar'}
                      label={<FormattedLabel id='classNameEn' required />}
                      error={!!error.classEn}
                      targetError={'classEn'}
                      width={250}
                      InputLabelProps={{
                        shrink: !!watch('classEn'),
                      }}
                      helperText={error?.classEn ? error.classEn.message : null}
                    />
                  </div>
                  <TextField
                    sx={{ width: '250px' }}
                    label={<FormattedLabel id='classNameMr' required />}
                    variant='standard'
                    {...register('classMr')}
                    error={!!error.classMr}
                    helperText={error?.classMr ? error.classMr.message : null}
                    InputLabelProps={{
                      shrink: !!watch('classMr'),
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
                    <FormattedLabel id='save' />
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    endIcon={<Clear />}
                    onClick={() => {
                      reset((old) => ({
                        ...old,
                        classEn: '',
                        classMr: '',
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
                        classEn: '',
                        classMr: '',
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
              disableExport: true,
              disableToolbarButton: true,
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
            },
          }}
        />
      </Paper>
    </>
  )
}

export default Index
