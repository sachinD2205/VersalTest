import React, { useState, useEffect } from 'react'
import styles from './dailyReport.module.css'

import {
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Paper,
  TextField,
  MenuItem,
  Button,
  Slide,
  IconButton,
  Link,
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
import { Add, Clear, Edit, ExitToApp, Save } from '@mui/icons-material'
import moment from 'moment'
import sweetAlert from 'sweetalert'
import { DataGrid } from '@mui/x-data-grid'
import Loader from '../../../../containers/Layout/components/Loader'
import { useGetToken } from '../../../../containers/reuseableComponents/CustomHooks'
import { catchExceptionHandlingMethod } from '../../../../util/util'

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

  const userToken = useGetToken()

  // @ts-ignore
  const zooKeeperId = useSelector((state) => state?.user?.user?.userDao?.id)

  const [animalDropDown, setAnimalDropDown] = useState([])
  const [collapse, setCollapse] = useState(false)
  const [runAgain, setRunAgain] = useState(false)
  const [table, setTable] = useState([])
  const [loading, setLoading] = useState(false)

  const schema = yup.object().shape({
    entryDate: yup
      .date()
      .required(
        language === 'en'
          ? 'Please select a from Date'
          : 'कृपया तारखेमधून निवडा'
      )
      .typeError(
        language === 'en'
          ? 'Please select an entry date'
          : 'कृपया प्रवेशाची तारीख निवडा'
      ),
    zooAnimalKey: yup
      .number()
      .required()
      .typeError(
        language === 'en' ? 'Please select an animal' : 'कृपया एक प्राणी निवडा'
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
  })

  const {
    control,
    reset,
    register,
    // setValue,
    watch,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: 'all',
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    setLoading(true)
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
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setRunAgain(false)

    if (!!animalDropDown) {
      //Get userWiseData
      axios
        .get(`${URLs.VMS}/trnZooKeeperReport/getAllByZooKeeperId`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          params: { zooKeeperId },
        })
        .then((res) => {
          setTable(
            res.data?.trnZooKeeperReportList.map((j, i) => ({
              ...j,
              dateShow: moment(new Date(j.entryDate)).format('DD-MM-YYYY'),
              srNo: i + 1,
              scrutinyRemark: j.scrutinyRemark ?? 'No scrutiny yet',
              animalNameEn: animalDropDown.find(
                (obj) => obj.id == j.zooAnimalKey
              )?.animalNameEn,
              animalNameMr: animalDropDown.find(
                (obj) => obj.id == j.zooAnimalKey
              )?.animalNameMr,
            }))
          )
          setLoading(false)
        })
        .catch((error) => {
          catchExceptionHandlingMethod(error, language)
          setLoading(false)
        })
    }
  }, [animalDropDown, runAgain])

  const ExpandableCell = ({ value }) => {
    const [expanded, setExpanded] = useState(false)
    return (
      <div>
        {expanded ? value : value.slice(0, 43)}{' '}
        {value.length > 43 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link
            type='button'
            component='button'
            onClick={() => setExpanded(!expanded)}
          >
            <FormattedLabel id={expanded ? 'viewLess' : 'viewMore'} />
          </Link>
        )}
      </div>
    )
  }

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'srNo',
      headerAlign: 'center',
      headerName: <FormattedLabel id='srNo' />,
      width: 60,
    },
    {
      headerClassName: 'cellColor',

      field: 'dateShow',
      headerAlign: 'center',
      headerName: <FormattedLabel id='dateOfEntry' />,
      width: 110,
    },
    {
      headerClassName: 'cellColor',

      field: language == 'en' ? 'animalNameEn' : 'animalNameMr',
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
      minWidth: 250,
      flex: 1,
      renderCell: (params) => <ExpandableCell {...params} />,
    },

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
      width: 170,
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
      width: 85,
      renderCell: (params) => {
        return (
          <>
            {(params.row.status == 'Pending' ||
              params.row.status == null ||
              params.row.status == 'Rejected By supervisor') && (
              <IconButton
                disabled={collapse}
                style={{ color: !collapse ? '#1976d2' : '#afafaf' }}
                onClick={() => {
                  reset({ ...params.row })
                  setCollapse(true)
                }}
              >
                <Edit />
              </IconButton>
            )}
          </>
        )
      },
    },
  ]

  const clearData = () => {
    reset({
      entryDate: null,
      observation: null,
      zooAnimalKey: '',
    })
  }

  const dataEntry = (data) => {
    const bodyForAPI = {
      ...data,
      entryDate: moment(watch('entryDate')).format('YYYY-MM-DD'),
      zooKeeperId,
      action: 'new',
    }

    sweetAlert({
      title: language === 'en' ? 'Confirmation' : 'पुष्टीकरण',
      text:
        language === 'en'
          ? 'Are you sure you want to save the data?'
          : 'तुमची खात्री आहे की तुम्ही डेटा जतन करू इच्छिता?',
      icon: 'warning',
      buttons: [
        language === 'en' ? 'Cancel' : 'रद्द करा',
        language === 'en' ? 'Save' : 'जतन करा',
      ],
    }).then((ok) => {
      if (ok) {
        setLoading(true)
        axios
          .post(`${URLs.VMS}/trnZooKeeperReport/save`, bodyForAPI, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            sweetAlert(
              language === 'en' ? 'Success!' : 'यशस्वी झाले!',
              !!bodyForAPI.id
                ? language === 'en'
                  ? 'Report updated successfully'
                  : 'अहवाल यशस्वीरित्या अपडेट केला'
                : language === 'en'
                ? 'Report added successfully'
                : 'अहवाल यशस्वीरित्या जोडला',
              'success',
              { button: language === 'en' ? 'Ok' : 'ठीक आहे' }
            )
            clearData()
            setCollapse(false)
            setRunAgain(true)
            setLoading(false)
          })
          .catch((error) => {
            catchExceptionHandlingMethod(error, language)
            setLoading(false)
          })
      }
    })
  }

  return (
    <>
      <div className={styles.endDiv}>
        <Button
          variant='contained'
          endIcon={<Add />}
          onClick={() => setCollapse(!collapse)}
        >
          <FormattedLabel id='add' />
        </Button>
      </div>
      <Slide direction={'down'} in={collapse} mountOnEnter unmountOnExit>
        <form onSubmit={handleSubmit(dataEntry)}>
          <div className={styles.row}>
            <FormControl error={!!error.entryDate}>
              {/* @ts-ignore */}
              <Controller
                control={control}
                name='entryDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      inputFormat='dd/MM/yyyy'
                      label={<FormattedLabel id='dateOfEntry' required />}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: '180px' }}
                          {...params}
                          size='small'
                          fullWidth
                          variant='standard'
                          error={!!error.entryDate}
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

            <FormControl variant='standard' error={!!error.zooAnimalKey}>
              <InputLabel>
                <FormattedLabel id='speciesName' required />
              </InputLabel>
              {/* @ts-ignore */}
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: '200px' }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='zooAnimalKey'
                  >
                    {animalDropDown &&
                      animalDropDown.map((value, index) => (
                        <MenuItem key={index} value={value.id}>
                          {language == 'en'
                            ? value?.animalNameEn
                            : value?.animalNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='zooAnimalKey'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {error?.zooAnimalKey ? error.zooAnimalKey.message : null}
              </FormHelperText>
            </FormControl>
            <TextField
              sx={{ width: '400px' }}
              label={<FormattedLabel id='observation' required />}
              variant='standard'
              {...register('observation')}
              InputLabelProps={{ shrink: !!watch('observation') }}
              error={!!error.observation}
              helperText={error?.observation ? error.observation.message : null}
            />
          </div>

          <div className={styles.row}>
            <Button
              variant='contained'
              color='success'
              type='submit'
              endIcon={<Save />}
            >
              {!!watch('id') ? (
                <FormattedLabel id='update' />
              ) : (
                <FormattedLabel id='save' />
              )}
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
              onClick={() => {
                setCollapse(false)
                clearData()
              }}
              endIcon={<ExitToApp />}
            >
              <FormattedLabel id='exit' />
            </Button>
          </div>
        </form>
      </Slide>
      <DataGrid
        autoHeight
        sx={{
          marginTop: '10px',
          width: '100%',

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
        loading={loading}
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
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </>
  )
}

export default Index
