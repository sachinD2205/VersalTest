import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextField,
} from '@mui/material'
import sweetAlert from 'sweetalert'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import schema from '../../../containers/schema/common/UsageChargeMaster'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid } from '@mui/x-data-grid'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'
import axios from 'axios'
import moment from 'moment'
import CheckIcon from '@mui/icons-material/Check'
import { yupResolver } from '@hookform/resolvers/yup'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import styles from '../../../styles/[userChargeMaster].module.css'
import urls from '../../../URLS/urls'
import BasicLayout from '../../../containers/Layout/BasicLayout'

const UserChargeMaster = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })
  const [buttonInputState, setButtonInputState] = useState()
  const [dataSource, setDataSource] = useState([])
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [deleteButtonInputState, setDeleteButtonState] = useState(false)
  const [btnSaveText, setBtnSaveText] = useState('Save')
  const [slideChecked, setSlideChecked] = useState(false)
  const [id, setID] = useState()

  const [services, setServices] = useState([])
  const [chargeName, setChargeName] = useState([])
  const [chargeType, setChargeType] = useState([])

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  useEffect(() => {
    getServices()
    getChargeName()
    getChargeType()
    getBillType()
  }, [])

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('service res', r)

          let services = {}
          r.data.service.map((r) => (services[r.id] = r.serviceName))
          setServices(r.data.service)
        } else {
          message.error('Failed ! Please Try Again !')
        }
      })
      .catch((err) => {
        console.log(err)
        toast('Login Failed ! Please Try Again !', {
          type: 'error',
        })
      })
  }

  const getChargeName = () => {
    axios
      .get(`${urls.CFCURL}/master/chargeName/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('service res', r)
          setChargeName(r.data.chargeName)
        } else {
          message.error('Failed ! Please Try Again !')
        }
      })
      .catch((err) => {
        console.log(err)
        toast('Login Failed ! Please Try Again !', {
          type: 'error',
        })
      })
  }

  const getChargeType = () => {
    axios
      .get(`${urls.CFCURL}/master/serviceChargeType/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('service res', r)
          setChargeType(r.data.serviceChargeType)
        } else {
          message.error('Failed ! Please Try Again !')
        }
      })
      .catch((err) => {
        console.log(err)
        toast('Login Failed ! Please Try Again !', {
          type: 'error',
        })
      })
  }

  const getBillType = (_pageSize = 10, _pageNo = 0) => {
    console.log('_pageSize,_pageNo', _pageSize, _pageNo)
    axios
      .get(`${urls.CFCURL}/master/userCharge/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
      })
      .then((res) => {
        console.log(';res', res)
       

        let result = res.data.userCharge
        let _res = result.map((val, i) => {
          console.log('44')
          return {
            activeFlag: val.activeFlag,
            srNo: val.id,
          
            id: val.id,
         
          
            status: val.activeFlag === 'Y' ? 'Active' : 'Inactive',
            // Service:r.Service

            Service : services?.find((obj) => {
              return obj?.id === val.service;
            })?.serviceName,

            chargeType : chargeType?.find((obj) => {
              return obj?.id === val.serviceChargeType;
            })?.serviceChargeType,

            dependsOn:val.dependsOn,

            // chargeName : chargeName?.find((obj) => {
            //   return obj?.id === val.chargeName;
            // })?.charge,

           
            chargeName:chargeName [val.chargeName]
            && chargeName [val.chargeName].charge,

            amount:val.amount,
            formula:val.formula,
            description:val.description
          }
        })
        // setDataSource([..._res]);

        console.log('result', _res)
        // setDataSource(
        //   res.data.billType.map((val, i) => {
        //     return {};
        //   })
        // );
        // setDataSource(()=>abc);
        // setTotalElements(res.data.totalElements);
        // setPageSize(res.data.pageSize);
        // setPageNo(res.data.pageNo);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        })
      })
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }
    console.log('body', body)
    if (_activeFlag === 'N') {
      swal({
        title: 'Inactivate?',
        text: 'Are you sure you want to inactivate this Record ? ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/userCharge/save`, body)
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 200) {
                swal('Record is Successfully Deleted!', {
                  icon: 'success',
                })
                getBillType()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    } else {
      swal({
        title: 'Activate?',
        text: 'Are you sure you want to activate this Record ? ',
        icon: 'warning',
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log('inn', willDelete)
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/userCharge/save`, body)
            .then((res) => {
              console.log('delet res', res)
              if (res.status == 200) {
                swal('Record is Successfully Deleted!', {
                  icon: 'success',
                })
                getBillType()
                setButtonInputState(false)
              }
            })
        } else if (willDelete == null) {
          swal('Record is Safe')
        }
      })
    }
  }

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  const resetValuesCancell = {
    Service:"",
    chargeName:"",
    chargeType:"",
    amount:"",
    dependsOn:"",
    formula:"",
    description:""
  }

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

  const onSubmitForm = (formData) => {
    console.log('formData', formData)
    
    const finalBodyForApi = {
      ...formData,
  
    }

    console.log('finalBodyForApi', finalBodyForApi)
   

    axios
      .post(
       
        `${urls.CFCURL}/master/userCharge/save`,
        finalBodyForApi
      )
      .then((res) => {
        console.log('save data', res)
        if (res.status == 200) {
          formData.id
            ? sweetAlert('Updated!', 'Record Updated successfully !', 'success')
            : sweetAlert('Saved!', 'Record Saved successfully !', 'success')
          getBillType()
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)
          setDeleteButtonState(false)
        }
      })
  }

  const resetValuesExit = {
    Service:"",
    chargeName:"",
    chargeType:"",
    amount:"",
    dependsOn:"",
    formula:"",
    description:""
  }

  const columns = [
    {
      field: 'srNo',
      headerName: <FormattedLabel id='srNo' />,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'Service',
      headerName: <FormattedLabel id='service' />,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
  
    {
      field: 'chargeType',
      headerName: <FormattedLabel id='chargeType' />,
      // type: "number",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'chargeName',
      headerName: <FormattedLabel id='chargeName' />,
      // type: "number",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'dependsOn',
      headerName: <FormattedLabel id='dependsOn' />,
      // type: "number",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'amount',
      headerName: <FormattedLabel id='amount' />,
      // type: "number",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'formula',
      headerName: <FormattedLabel id='formula' />,
      // type: "number",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'description',
      headerName: <FormattedLabel id='description' />,
      // type: "number",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      headerName: <FormattedLabel id='actions' />,
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
                console.log('params.row: ', params.row)
                reset(params.row)
              }}
            >
              <EditIcon style={{ color: '#556CD6' }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText('Update'),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log('params.row: ', params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == 'Y' ? (
                <ToggleOnIcon
                  style={{ color: 'green', fontSize: 30 }}
                  onClick={() => deleteById(params.id, 'N')}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: 'red', fontSize: 30 }}
                  onClick={() => deleteById(params.id, 'Y')}
                />
              )}
            </IconButton>
          </>
        )
      },
    },
  ]

  return (
    <>

<div
        style={{
          // backgroundColor: "#0084ff",
          backgroundColor: "#757ce8",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
          
        }}
      >
User Charge Master
        {/* <FormattedLabel id='aadharAuthentication' /> */}
      </div>
      <Paper style={{ margin: '50px' }}>
        {isOpenCollapse && (
          <Slide direction='down' in={slideChecked} mountOnEnter unmountOnExit>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Grid container style={{ padding: '10px' }}>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FormControl size='small' sx={{ m: 1, width: '50%' }}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='serviceId' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label={<FormattedLabel id='serviceId' />}
                          value={field.value}
                          // {...register("applicationName")}
                          // onChange={(value) => field.onChange(value)}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                          style={{ backgroundColor: 'white' }}
                        >
                          {services.length > 0
                            ? services.map((service, index) => {
                                return (
                                  <MenuItem key={index} value={service.id}>
                                    {service.serviceName}
                                  </MenuItem>
                                )
                              })
                            : 'NA'}
                        </Select>
                      )}
                      name='service'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {errors?.service ? errors.service.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>


                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FormControl size='small' sx={{ m: 1, width: '50%' }}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='chargeName' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label={<FormattedLabel id='chargeName' />}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                          style={{ backgroundColor: 'white' }}
                        >
                          {chargeName.length > 0
                            ? chargeName.map((chargeName, index) => {
                                return (
                                  <MenuItem key={index} value={chargeName.id}>
                                    {chargeName.charge}
                                  </MenuItem>
                                )
                              })
                            : 'NA'}
                        </Select>
                      )}
                      name='chargeName'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {errors?.chargeName ? errors.chargeName.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <FormControl size='small' sx={{ m: 1, width: '50%' }}>
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='chargeType' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label={<FormattedLabel id='chargeType' />}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                          style={{ backgroundColor: 'white' }}
                        >
                          {chargeType.length > 0
                            ? chargeType.map((chargeType, index) => {
                                return (
                                  <MenuItem key={index} value={chargeType.id}>
                                    {chargeType.serviceChargeType}
                                  </MenuItem>
                                )
                              })
                            : 'NA'}
                        </Select>
                      )}
                      name='serviceChargeType'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText style={{ color: 'red' }}>
                      {errors?.serviceChargeType ? errors.serviceChargeType.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextField
                    size='small'
                    style={{ backgroundColor: 'white' }}
                    id='outlined-basic'
                    // label="Bill Type"
                    label={<FormattedLabel id='amount' />}
                    variant='outlined'
                    {...register('amount')}
                    error={!!errors.amount}
                    helperText={errors?.amount ? errors.amount.message : null}
                  />
                </Grid>


                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextField
                    size='small'
                    style={{ backgroundColor: 'white' }}
                    id='outlined-basic'
                    // label="Bill Type"
                    label={<FormattedLabel id='dependsOn' />}
                    variant='outlined'
                    {...register('dependsOn')}
                    error={!!errors.dependsOn}
                    helperText={errors?.dependsOn ? errors.dependsOn.message : null}
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextField
                    size='small'
                    style={{ backgroundColor: 'white' }}
                    id='outlined-basic'
                    // label="Bill Type"
                    label={<FormattedLabel id='formula' />}
                    variant='outlined'
                    {...register('formula')}
                    error={!!errors.formula}
                    helperText={errors?.formula ? errors.formula.message : null}
                  />
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TextField
                    size='small'
                    style={{ backgroundColor: 'white' }}
                    id='outlined-basic'
                    // label="Bill Type"
                    label={<FormattedLabel id='description' />}
                    variant='outlined'
                    {...register('description')}
                    error={!!errors.description}
                    helperText={
                      errors?.description ? errors.description.message : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid container style={{ padding: '10px' }}>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    type='submit'
                    variant='contained'
                    color='success'
                    endIcon={<SaveIcon />}
                  >
                    <FormattedLabel id={btnSaveText} />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    sx={{ marginRight: 8 }}
                    variant='contained'
                    color='primary'
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    <FormattedLabel id='clear' />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant='contained'
                    color='error'
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id='exit' />
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </form>
          </Slide>
        )}

        <Grid container style={{ padding: '10px' }}>
          <Grid item xs={9}></Grid>
          <Grid
            item
            xs={2}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              variant='contained'
              endIcon={<AddIcon />}
              type='primary'
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
              <FormattedLabel id='add' />
            </Button>
          </Grid>
        </Grid>

        <Box style={{ height: 'auto', overflow: 'auto' }}>
          <DataGrid
            sx={{
              // fontSize: 16,
              // fontFamily: 'Montserrat',
              // font: 'center',
              // backgroundColor:'yellow',
              // // height:'auto',
              // border: 2,
              // borderColor: "primary.light",
              overflowY: 'scroll',

              '& .MuiDataGrid-virtualScrollerContent': {
                // backgroundColor:'red',
                // height: '800px !important',
                // display: "flex",
                // flexDirection: "column-reverse",
                // overflow:'auto !important'
              },
              '& .MuiDataGrid-columnHeadersInner': {
                backgroundColor: '#556CD6',
                color: 'white',
              },

              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
            density='compact'
            autoHeight={true}
            // rowHeight={50}
            pagination
            paginationMode='server'
            // loading={data.loading}
            rowCount={data.totalRows}
            rowsPerPageOptions={data.rowsPerPageOptions}
            page={data.page}
            pageSize={data.pageSize}
            rows={data.rows}
            columns={columns}
            onPageChange={(_data) => {
              getBillType(data.pageSize, _data)
            }}
            onPageSizeChange={(_data) => {
              console.log('222', _data)
              // updateData("page", 1);
              getBillType(_data, data.page)
            }}
          />
        </Box>

        {/* <DataGrid
            autoHeight
            sx={{
              margin: 5,
            }}
            rows={dataSource}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => {
              getBillType(newPageSize);
              setPageSize(newPageSize);
            }}
            onPageChange={(e) => {
              console.log("event", e);
              setPageNo(e);
              setTotalElements(res.data.totalElements);
              console.log("dataSource->", dataSource);
            }}
            rowsPerPageOptions={[10, 20, 50, 100]}
            pagination
            rowCount={totalElements}
          /> */}
      </Paper>
    </>
  )
}

export default UserChargeMaster
