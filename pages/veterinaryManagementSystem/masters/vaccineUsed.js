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
  const userToken = useGetToken()

  // @ts-ignore

  const [data, setData] = useState({
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })
  const language = useSelector((state) => state.labels?.language)
  const [collapse, setCollapse] = useState(false)
  const [table, setTable] = useState([])
  const [runAgain, setRunAgain] = useState(false)
  const [loadingState, setLoadingState] = useState(false)
  const [loader, setLoader] = useState(false)
  const [isUpdateState, setIsUpdateState] = useState(false)

  let vaccineUsedSchema = yup.object().shape({
    vaccineUsedEn: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter vaccination used in english'
          : 'कृपया इंग्रजीमध्ये वापरलेली लसीकरण प्रविष्ट करा'
      )
      .typeError(
        language === 'en'
          ? 'Please enter vaccination used in english'
          : 'कृपया इंग्रजीमध्ये वापरलेली लसीकरण प्रविष्ट करा'
      )
      .matches(
        /^[A-Za-z0-9\s]+$/,
        language === 'en'
          ? 'Must be only english characters'
          : 'फक्त इंग्लिश शब्द'
      ),
    vaccineUsedMr: yup
      .string()
      .required(
        language === 'en'
          ? 'Please enter vaccination used in marathi'
          : 'कृपया मराठीत वापरलेली लसीकरण प्रविष्ट करा'
      )
      .typeError(
        language === 'en'
          ? 'Please enter vaccination used in marathi'
          : 'कृपया मराठीत वापरलेली लसीकरण प्रविष्ट करा'
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
    resolver: yupResolver(vaccineUsedSchema),
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
      .get(`${URLs.VMS}/mstVaccineUsed/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: { pageNo, pageSize, sortBy: 'id', sortDir: 'desc' },
      })
      .then((res) => {
        console.log(res)
        setTable(
          res.data.mstVaccineUsedList?.map((j, i) => ({
            srNo: i + 1,
            id: j.id,
            vaccineUsedEn: j.vaccineUsedEn,
            vaccineUsedMr: j.vaccineUsedMr,
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
      field: 'vaccineUsedEn',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='vaccineUsedEn' />,
      flex: 1,
    },
    {
      headerClassName: 'cellColor',
      field: 'vaccineUsedMr',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='vaccineUsedMr' />,
      flex: 1,
    },

    {
      headerClassName: 'cellColor',

      field: 'status',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='status' />,
      flex: 1,
    },

    {
      headerClassName: 'cellColor',
      field: 'action',
      align: 'center',
      headerAlign: 'center',
      headerName: <FormattedLabel id='actions' />,
      width: 340,
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
                  vaccineUsedEn: params.row.vaccineUsedEn,
                  vaccineUsedMr: params.row.vaccineUsedMr,
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
      title: language == 'en' ? 'Confirmation' : 'पुष्टीकरण',
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
            `${URLs.VMS}/mstVaccineUsed/save`,
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
        `${URLs.VMS}/mstVaccineUsed/save`,
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
              language == 'en' ? 'Success' : 'यशस्वी झाले',
              language == 'en'
                ? 'Data successfully updated'
                : 'डेटा यशस्वीरित्या अपडेट केला',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
          : sweetAlert(
              language == 'en' ? 'Success' : 'यशस्वी झाले',
              language == 'en'
                ? 'Data successfully saved'
                : 'डेटा यशस्वीरित्या जतन केला',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
        setRunAgain(true)
        reset({
          id: null,
          vaccineUsedEn: '',
          vaccineUsedMr: '',
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
        <title>Vaccination Used Master</title>
      </Head>
      <Breadcrumb />

      <Paper className={styles.main}>
        {loader && <Loader />}

        <div className={styles.title}>
          <FormattedLabel id='vaccineUsedMaster' />
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
                <div
                  className={styles.row}
                  style={{ justifyContent: 'space-evenly' }}
                >
                  <div style={{ width: 250 }}>
                    <Transliteration
                      fieldName={'vaccineUsedEn'}
                      updateFieldName={'vaccineUsedMr'}
                      sourceLang={'eng'}
                      targetLang={'mar'}
                      label={<FormattedLabel id='vaccineUsedEn' required />}
                      error={!!error.vaccineUsedEn}
                      targetError={'vaccineUsedEn'}
                      width={250}
                      InputLabelProps={{
                        shrink: !!watch('vaccineUsedEn'),
                      }}
                      helperText={
                        error?.vaccineUsedEn
                          ? error.vaccineUsedEn.message
                          : null
                      }
                    />
                  </div>
                  {/* <TextField
                  sx={{ width: '250px' }}
                  label={<FormattedLabel id='vaccineUsedEn' />}
                  variant='standard'
                  {...register('vaccineUsedEn')}
                  error={!!error.vaccineUsedEn}
                  helperText={
                    error?.vaccineUsedEn ? error.vaccineUsedEn.message : null
                  }
                /> */}
                  <TextField
                    sx={{ width: '250px' }}
                    label={<FormattedLabel id='vaccineUsedMr' required />}
                    variant='standard'
                    {...register('vaccineUsedMr')}
                    error={!!error.vaccineUsedMr}
                    helperText={
                      error?.vaccineUsedMr ? error.vaccineUsedMr.message : null
                    }
                    InputLabelProps={{
                      shrink: !!watch('vaccineUsedMr'),
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
                      reset((old) => ({
                        ...old,
                        vaccineUsedEn: '',
                        vaccineUsedMr: '',
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
                        vaccineUsedEn: '',
                        vaccineUsedMr: '',
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
