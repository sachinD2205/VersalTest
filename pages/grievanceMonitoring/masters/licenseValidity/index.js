import { yupResolver } from '@hookform/resolvers/yup'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { DataGrid } from '@mui/x-data-grid'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import sweetAlert from 'sweetalert'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import urls from '../../../../URLS/urls'
import styles from '../licenseValidity/view.module.css'
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";


// func
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: 'all',
    // resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [dataSource, setDataSource] = useState([])
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [fetchData, setFetchData] = useState(null)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)
  const [hawkerTypes, setHawkerTypes] = useState([])

  const getHawkerType = () => {
    axios.get(`${urls.BaseURL}/hawkerType/getHawkerTypeData`).then((r) => {
      setHawkerTypes(
        r.data.map((row) => ({
          id: row.id,
          hawkerType: row.hawkerType,
        })),
      )
    })
  }

  useEffect(() => {
    getHawkerType()
  }, [])

  // Get Table - Data
  const getLicenseValidityDetails = () => {
    axios
      .get(`${urls.BaseURL}/licenseValidity/getLicenseValidityData`)
      .then((res) => {
        setDataSource(
          res.data.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            licenseValidityPrefix: r.licenseValidityPrefix,
            toDate: moment(r.toDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            fromDate: moment(r.fromDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            licenseValidity: r.licenseValidity,
            hawkerType: r.hawkerType,
            hawkerTypeName: hawkerTypes?.find((obj) => obj?.id === r.hawkerType)
              ?.hawkerType,
            remark: r.remark,
          })),
        )
      })
  }

  // useEffect - Reload On update , delete ,Saved on refresh
  useEffect(() => {
    getLicenseValidityDetails()
  }, [hawkerTypes])

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    const fromDate = new Date(formData.fromDate).toISOString()
    const toDate = moment(formData.toDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    // Update Form Data
    const finalBodyForApi = {
      ...formData,
      fromDate,
      toDate,
    }

    axios
      .post(
        `${urls.BaseURL}/licenseValidity/saveLicenseValidity`,
        finalBodyForApi,
      )
      .then((res) => {
        if (res.status == 201) {
          formData.id
            ? sweetAlert('Updated!', 'Record Updated Successfully !', 'success')
            : sweetAlert('Saved!', 'Record Saved Successfully !', 'Success')
          getLicenseValidityDetails()
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)
          setDeleteButtonState(false)
        }
      })
  }

  // Delete By ID
  const deleteById = (value) => {
    swal({
      title: 'Delete?',
      text: 'Are you sure you want to delete this Record ? ',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      axios
        .delete(
          `${urls.BaseURL}/licenseValidity/discardLicenseValidity/${value}`,
        )
        .then((res) => {
          if (res.status == 226) {
            if (willDelete) {
              swal('Record is Successfully Deleted!', {
                icon: 'success',
              })
            } else {
              swal('Record is Safe')
            }
            getLicenseValidityDetails()
            setButtonInputState(false)
          }
        })
    })
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setDeleteButtonState(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: null,
    toDate: null,
    licenseValidity: '',
    licenseValidityPrefix: '',
    remark: '',
  }

  // Reset Values Exit
  const resetValuesExit = {
    fromDate: null,
    toDate: null,
    licenseValidity: '',
    licenseValidityPrefix: '',
    remark: '',
    id: null,
  }

  // define colums table
  const columns = [
    {
      field: 'srNo',
      headerName: 'Sr.No',
      flex: 1,
    },
    {
      field: 'licenseValidityPrefix',
      headerName: 'License Validity Prefix',
      flex: 1,
    },
    { field: 'fromDate', headerName: 'fromDate' },
    {
      field: 'toDate',
      headerName: 'To Date',
      //type: "number",
      flex: 1,
    },
    {
      field: 'licenseValidity',
      headerName: 'License Validity (Years)',
      // type: "number",
      flex: 2,
    },
    {
      field: 'hawkerTypeName',
      headerName: 'Hawker Type',
      //type: "number",
      flex: 1,
    },
    {
      field: 'remark',
      headerName: 'Remark',
      //type: "number",
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText('Update'),
                  setID(params.row.id),
                  setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                reset(params.row)
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              disabled={deleteButtonInputState}
              onClick={() => deleteById(params.id)}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )
      },
    },
  ]

  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <>
        <Paper
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
          }}
        >
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <div className={styles.small}>
                      <div className={styles.row}>
                        <div className={styles.fieldss}>
                          <TextField
                            autoFocus
                            sx={{ width: 250 }}
                            id="standard-basic"
                            label="License Validity Prefix *"
                            variant="standard"
                            {...register('licenseValidityPrefix')}
                            error={!!errors.licenseValidityPrefix}
                            helperText={
                              errors?.licenseValidityPrefix
                                ? errors.licenseValidityPrefix.message
                                : null
                            }
                          />
                        </div>
                        <div className={styles.fieldss}>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.fromDate}
                          >
                            <Controller
                              control={control}
                              name="fromDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        From Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
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
                              {errors?.fromDate
                                ? errors.fromDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div className={styles.fieldss}>
                          <FormControl
                            style={{ marginTop: 10 }}
                            error={!!errors.toDate}
                          >
                            <Controller
                              control={control}
                              name="toDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        To Date
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => field.onChange(date)}
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
                              {errors?.toDate ? errors.toDate.message : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div className={styles.fieldss}>
                          <FormControl
                            variant="standard"
                            sx={{ m: 1, minWidth: 120 }}
                            error={!!errors.hawkerType}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Hawker Type
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Hawker Type"
                                >
                                  {hawkerTypes &&
                                    hawkerTypes.map((hawkerType, index) => (
                                      <MenuItem
                                        key={index}
                                        value={hawkerType.id}
                                      >
                                        {hawkerType.hawkerType}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="hawkerType"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.hawkerType
                                ? errors.hawkerType.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </div>
                        <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250, marginTop: '5vh' }}
                            id="standard-basic"
                            label="License Validity(Years) *"
                            variant="standard"
                            // value={dataInForm && dataInForm.religion}
                            {...register('licenseValidity')}
                            error={!!errors.licenseValidity}
                            helperText={
                              errors?.licenseValidity
                                ? errors.licenseValidity.message
                                : null
                            }
                          />
                        </div>
                        <div className={styles.fieldss}>
                          <TextField
                            sx={{ width: 250, marginTop: '5vh' }}
                            id="standard-basic"
                            label="Remark"
                            variant="standard"
                            // value={dataInForm && dataInForm.remark}
                            {...register('remark')}
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                          />
                        </div>
                      </div>

                      <div className={styles.btn}>
                        <div className={styles.btn1}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText}
                          </Button>{' '}
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            Clear
                          </Button>
                        </div>
                        <div className={styles.btn1}>
                          <Button
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            Exit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}
          <div className={styles.addbtn}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              type="primary"
              disabled={buttonInputState}
              onClick={() => {
                reset({
                  ...resetValuesExit,
                })
                setEditButtonInputState(true)
                setDeleteButtonState(true)
                setBtnSaveText('Save')
                setButtonInputState(true)
                setSlideChecked(true)
                setIsOpenCollapse(!isOpenCollapse)
              }}
            >
              Add{' '}
            </Button>
          </div>
          <DataGrid
            autoHeight
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            //checkboxSelection
          />
        </Paper>
      </>
    </>
  )
}

export default Index
