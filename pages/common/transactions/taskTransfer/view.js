import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Upload,
} from 'antd'
import React, { useEffect } from 'react'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
// import useForm from "react";
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import axios from 'axios'
import { useRouter } from 'next/router'
import moment from 'moment'
// import urls from "../../../URLS/urls"
import urls from '../../../../URLS/urls'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import { PlusOutlined } from '@ant-design/icons'
import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons'
import Image from 'next/image'
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
import { LocalizationProvider } from '@mui/x-date-pickers'
import FormattedLabel from '../../../../containers/reuseableComponents/FormattedLabel'
// import ExitIcon from "@mui/icons-material/Exit";
import ClearIcon from '@mui/icons-material/Clear'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SaveIcon from '@mui/icons-material/Save'

// getBase64 view
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => resolve(reader.result)

    reader.onerror = (error) => reject(error)
  })

// component
const View = () => {
  const [inputStateSave, setInputStateSave] = useState(false)
  // const [taskTransferForm] = Form.useForm();
  const [fromDuration, setfromDuration] = useState()
  const [toDuration, setToDuration] = useState()

  // router
  const router = useRouter()

  // moveForward Button
  const moveForward = () => {
    alert('Move Forward Button Clicked !!!')
  }

  // moveBackward Button
  const moveBackward = () => {
    alert('Move Backward Button Clikced !!!')
  }

  // reset Form
  const resetForm = () => {
    taskTransferForm.resetFields()
  }

  // const for File Upload
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const [files, setFiles] = useState()
  const [file1, setFile1] = useState()
  const [file2, setFile2] = useState()
  const [defaultFileList, setDefaultFileList] = useState([])
  const [progress, setProgress] = useState(0)
  const [config1, setConfig1] = useState()

  const [departmentList, setDepartmentList] = useState([])
  const [serviceList, setServiceList] = useState([])
  const [userList, setUserList] = useState([])
  const lang = useSelector((state) => state.user.lang)
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(), mode: 'onChange' })

  useEffect(() => {
    getDepartmentName()
    getServiceName()
    getUserName()
  }, [])

  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res department', r)
          setDepartmentList(r.data.department)
        }
      })
      .catch((err) => {
        // console.log("err", err);
      })
  }

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`)
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getAll`)
      .then((r) => {
        if (r.status == 200) {
          console.log('res user', r)

          setUserList(r.data.user)
        }
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  // cancell preview
  const handleCancel = () => setPreviewVisible(false)

  // handlePreview
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }

  // Handle Change - On Change
  const handleOnChange = ({ file, fileList, event }) => {
    console.log(file, fileList, event)
    //Using Hooks to update the state to the current filelist
    setDefaultFileList(fileList)
    //filelist - [{uid: "-1",url:'Some url to image'}]
  }

  // CustomRequest handler
  const uploadImage = (options) => {
    const { onSuccess, onError, file, filename, onProgress } = options
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        console.log((event.loaded / event.total) * 100)
        onProgress({ percent: (event.loaded / event.total) * 100 }, file)
      },
    }

    if (filename == 'reasonForTaskTranfer') {
      setFile1(file)
    } else if (filename == 'attachFile') {
      setFile2(file)
    }
  }

  // handleSave Fun
  const handleSave = async () => {
    setInputStateSave(true)
    // get Form Values
    const allFields = taskTransferForm.getFieldValue()
    const bodyForApi = {
      ...allFields,
      toDuration,
      fromDuration,
    }

    // FormData
    let formData = new FormData()
    formData.append('taskTransferDao', JSON.stringify(bodyForApi))
    formData.append(`multipartFiles`, file1)
    formData.append(`multipartFiles`, file2)

    // Post -API
    let res = await axios
      .post(`${urls.CFCURL}/TaskTransfer/saveTaskTransfer`, formData, config1)
      .then((resp) => {
        if (resp.status == 200) {
          message.success('All Data Saved !!!')
          // taskTransferForm.resetFields();
          // router.push(`/common/transactions/taskTransfer`);
        }
      })
    console.log(res)
  }

  // view
  return (
    <div style={{ padding: '120px' }}>
      <Grid container sx={{ padding: '10px' }}>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl size='small' sx={{ width: '80%' }}>
            <InputLabel id='demo-simple-select-standard-label'>
              Department Name
            </InputLabel>

            <Controller
              render={({ field }) => (
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Department Name'
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  style={{ backgroundColor: 'white' }}
                >
                  {departmentList.length > 0
                    ? departmentList.map((department, index) => {
                        return (
                          <MenuItem key={index} value={department.id}>
                            {lang === 'en'
                              ? department.department
                              : department.departmentMr}
                          </MenuItem>
                        )
                      })
                    : []}
                </Select>
              )}
              name='departmentName'
              control={control}
              defaultValue=''
            />
            <FormHelperText style={{ color: 'red' }}>
              {/* {errors?.departmentName ? errors.departmentName.message : null} */}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl size='small' sx={{ width: '80%' }}>
            <InputLabel id='demo-simple-select-standard-label'>
              Service Name
            </InputLabel>

            <Controller
              render={({ field }) => (
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Service Name'
                  value={field.value}
                  // onChange={(value) => field.onChange(value)}
                  onChange={(value) => {
                    field.onChange(value)
                    setSelectedService(value.target.value)
                    // handleRoleNameChange(value);
                  }}
                  style={{ backgroundColor: 'white' }}
                >
                  {serviceList.length > 0
                    ? serviceList.map((service, index) => {
                        return (
                          <MenuItem key={index} value={service.id}>
                            {service.serviceName}
                          </MenuItem>
                        )
                      })
                    : 'NA'}
                </Select>
              )}
              name='serviceName'
              control={control}
              defaultValue=''
            />
            <FormHelperText style={{ color: 'red' }}>
              {errors?.roleName ? errors.roleName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl size='small' sx={{ width: '80%' }}>
            <InputLabel id='demo-simple-select-standard-label'>
              Employee Name(Transfer from)
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Employee Name'
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value), setSelectedUser(value.target.value)
                    // userR = userList.filter((u) => u.id === value.target.value),
                    // console.log("userR",userR);
                  }}
                  style={{ backgroundColor: 'white' }}
                >
                  {userList.length > 0
                    ? userList
                        // .filter((user) => {
                        //   if (
                        //     // user.department === selectedDepartment &&
                        //     // user.designation === selectedDesignation
                        //     selectedDepartment &&
                        //     selectedDesignation &&
                        //     user.department === selectedDepartment &&
                        //     user.designation === selectedDesignation
                        //   ) {
                        //     return user;
                        //   } else {
                        //     return user;
                        //   }
                        // })
                        .map((user, index) => {
                          return (
                            <MenuItem key={index} value={user.id}>
                              {user.firstNameEn +
                                ' ' +
                                user.middleNameEn +
                                ' ' +
                                user.lastNameEn}
                            </MenuItem>
                          )
                        })
                    : []}
                </Select>
              )}
              name='employeeName'
              control={control}
              defaultValue=''
            />
            <FormHelperText style={{ color: 'red' }}>
              {errors?.employeeName ? errors.employeeName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container sx={{ padding: '10px' }}>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl size='small' sx={{ width: '80%' }}>
            <InputLabel id='demo-simple-select-standard-label'>
              Employee Name(Transfer to)
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  label='Employee Name'
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value), setSelectedUser(value.target.value)
                    // userR = userList.filter((u) => u.id === value.target.value),
                    // console.log("userR",userR);
                  }}
                  style={{ backgroundColor: 'white' }}
                >
                  {userList.length > 0
                    ? userList
                        // .filter((user) => {
                        //   if (
                        //     // user.department === selectedDepartment &&
                        //     // user.designation === selectedDesignation
                        //     selectedDepartment &&
                        //     selectedDesignation &&
                        //     user.department === selectedDepartment &&
                        //     user.designation === selectedDesignation
                        //   ) {
                        //     return user;
                        //   } else {
                        //     return user;
                        //   }
                        // })
                        .map((user, index) => {
                          return (
                            <MenuItem key={index} value={user.id}>
                              {user.firstNameEn +
                                ' ' +
                                user.middleNameEn +
                                ' ' +
                                user.lastNameEn}
                            </MenuItem>
                          )
                        })
                    : []}
                </Select>
              )}
              name='employeeName'
              control={control}
              defaultValue=''
            />
            <FormHelperText style={{ color: 'red' }}>
              {errors?.employeeName ? errors.employeeName.message : null}
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
          <FormControl
            style={{ backgroundColor: 'white', width: '80%' }}
            error={!!errors.fromDate}
          >
            <Controller
              control={control}
              name='fromDate'
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id='fromDate' />
                      </span>
                    }
                    value={field.value || null}
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
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
              {errors?.fromDate ? errors.fromDate.message : null}
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
          <FormControl
            style={{ backgroundColor: 'white', width: '80%' }}
            error={!!errors.toDate}
          >
            <Controller
              control={control}
              name='toDate'
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16 }}>
                        <FormattedLabel id='toDate' />
                      </span>
                    }
                    value={field.value || null}
                    onChange={(date) => field.onChange(date)}
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size='small'
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
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            required
            id='standard-basic'
            label='Counter Number'
            variant='outlined'
            size='small'
            sx={{ backgroundColor: 'white', width: '80%' }}
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
            Save
            {/* <FormattedLabel id={btnSaveText} /> */}
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

      <Form
        title='taskTransfer'
        // form={taskTransferForm}
        layout='vertical'
        onFinish={handleSave}
      >
        {/** Rows */}
        <Row>
          <Col xl={1} lg={1} md={1} sm={1}></Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={24}>
            <Form.Item
              name={'departmentName'}
              label='Deparment Name'
              rules={[
                {
                  required: true,
                  message: 'Deparment Name Selection is Required !!!',
                },
              ]}
            >
              <Select placeholder='Select Deparment Name'>
                <Select.Option value='Deparment Name 1'>
                  deparment 1
                </Select.Option>
                <Select.Option value='Deparment Name 2'>
                  deparment 2
                </Select.Option>
                <Select.Option value='Deparment Name 3'>
                  deparment 3
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2}></Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={24}>
            <Form.Item
              name={'taskServiceName'}
              label='Task/Service Name'
              rules={[
                {
                  required: true,
                  message: 'Task/Service Name Selection is Required !!!',
                },
              ]}
            >
              <Select placeholder='Select Task/Service Name'>
                <Select.Option value='Task/Service Name 1'>
                  Task/Service Name 1
                </Select.Option>
                <Select.Option value='Task/Service Name 2'>
                  Task/Service Name 2
                </Select.Option>
                <Select.Option value='Task/Service Name 3'>
                  Task/Service Name 3
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2}></Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={24}>
            <Form.Item
              name={'employeeNameTransferFrom'}
              label='
            Employee Name (Transfer From)'
              rules={[
                {
                  required: true,
                  message:
                    'Employee Name Transfer Form Selection is Required !',
                },
              ]}
            >
              <Select placeholder='Select Employee Name Transfer Form'>
                <Select.Option value='employeeNameTF1'>
                  Employee Name TF 1
                </Select.Option>
                <Select.Option value='employeeNameTF2'>
                  Employee Name TF 2
                </Select.Option>
                <Select.Option value='employeeNameTF3'>
                  Employee Name TF 3
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col xl={1} lg={1} md={1} sm={1}></Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={24}>
            <Form.Item
              name={'employeeNameTransferTo'}
              label='Employee Name(Transfer To)'
              rules={[
                {
                  required: true,
                  message: 'Employee Name Transfer To Selection is Required !',
                },
              ]}
            >
              <Select placeholder='Select Employee Name Transfer To'>
                <Select.Option value='employeeNameTT1'>
                  Employee Name TF 1
                </Select.Option>
                <Select.Option value='employeeNameTT2'>
                  Employee Name TF 2
                </Select.Option>
                <Select.Option value='employeeNameTT3'>
                  Employee Name TF 3
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2}></Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={24}>
            <Form.Item
              name={'fromDuration'}
              label='From Duration'
              rules={[
                {
                  required: true,
                  message: 'Form Duration Duration is Required !!!',
                },
              ]}
            >
              <DatePicker
                onChange={(e) => {
                  setfromDuration(moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD'))
                }}
              />
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2}></Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={24}>
            <Form.Item
              name={'toDuration'}
              label='To Duration'
              rules={[
                {
                  required: true,
                  message: 'To Duration is Required !!!',
                },
              ]}
            >
              <DatePicker
                onChange={(e) => {
                  setToDuration(moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD'))
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        {/** Row End */}

        {/** Buttons */}
        <br />
        <Row>
          <Col xl={8} lg={8} md={8} sm={8}></Col>
          <Col xl={4} lg={4} md={4} sm={4} xs={24}>
            <Button type='primary' onClick={moveForward}>
              Move Forward
            </Button>
          </Col>

          <Col xl={4} lg={4} md={4} sm={4} xs={24}>
            <Button type='primary' onClick={moveBackward}>
              Move BackWard
            </Button>
          </Col>
        </Row>
        {/** Buttons End  */}

        {/** Next Rows  */}
        <br />
        <Row>
          <Col xl={1} lg={1} md={1} sm={1}></Col>
          {/** Photo */}
          <Col xl={4} lg={4} md={4} sm={4} xs={24}>
            {/** Attach File Photo */}
            <Form.Item
              label='Reason for Task Transfer'
              // name='reasonForTaskTranfer'
              rules={[
                {
                  required: false,
                  message: 'Please Upload Documents',
                },
              ]}
            >
              {/** File Upload Antd */}
              <Upload
                name='reasonForTaskTranfer'
                onPreview={handlePreview}
                // multiple={true}
                customRequest={uploadImage}
                onChange={(options) => {
                  handleOnChange(options)
                }}
                //fileList={fileList}
                maxCount={1}
                accept='.png,.jpeg,.jpg,.pdf'
                listType='picture-card'
                beforeUpload={(file) => {
                  console.log(file.size)
                  if (file.size >= 2097152) {
                    message.error('File Should not be more than 2 MB !')
                    return false
                  } else {
                    return true
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>

                <Modal
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <Image
                    alt='example'
                    layout='fill'
                    // style={{
                    //   width: '100%',
                    // }}
                    src={previewImage}
                  />
                </Modal>
              </Upload>
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2}></Col>
          <Col xl={3} lg={3} md={3} sm={3} xs={24}>
            <Form.Item
              name={'counterNo'}
              rules={[
                {
                  required: true,
                  message: 'Counter Number is Required !!!',
                },
              ]}
            >
              <TextField
                required
                id='standard-basic'
                label='Counter Number'
                variant='standard'
                onKeyPress={KeyPressEvents.isInputNumber}
              />
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2}></Col>
          <Col xl={3} lg={3} md={3} sm={3} xs={24}>
            <Form.Item name={'remarks'}>
              <TextField
                id='standard-basic'
                label='Remarks'
                variant='standard'
                onKeyPress={KeyPressEvents.isInputVarchar}
              />
            </Form.Item>
          </Col>
          <Col xl={2} lg={2} md={2} sm={2}></Col>
          <Col xl={3} lg={3} md={3} sm={3} xs={24}>
            {/** Attach File Photo */}
            <Form.Item
              label='Attach File'
              //name="attachFile"
              rules={[
                {
                  required: false,
                  message: 'Please Upload Documents',
                },
              ]}
            >
              {/** File Upload Antd */}
              <Upload
                // multiple={true}
                name='attachFile'
                onPreview={handlePreview}
                customRequest={uploadImage}
                // onChange={handleOnChange}
                // fileList={fileList}
                //onChange={(file) => handleOnChange(file, 'd1')}
                // customRequest={(file) => handleChange(file)}

                maxCount={1}
                accept='.png,.jpeg,.jpg,.pdf'
                listType='picture-card'
                beforeUpeload={(file) => {
                  console.log(file.size)
                  if (file.size >= 2097152) {
                    message.error('File Should not be more than 2 MB !')
                    return false
                  } else {
                    return true
                  }
                }}
              >
                <Button icon={<UploadOutlined />}>Upload</Button>

                <Modal
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <Image
                    alt='example'
                    layout='fill'
                    // style={{
                    //   width: '100%',
                    // }}
                    src={previewImage}
                  />
                </Modal>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/** Start Buttons -  View / Edit / Delete  */}
        <Row>
          <Col sm={2} md={4} lg={4} xl={8}></Col>
          <Col xs={1} sm={1} md={1} lg={2} xl={2}>
            <Button
              type='primary'
              // disabled={inputStateSave}
              htmlType='submit'
            >
              Save
            </Button>
          </Col>
          <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
          <Col xl={2} lg={2} md={1} sm={1} xs={1}>
            <Button onClick={resetForm}>Reset</Button>
          </Col>
          <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
          <Col xl={2} lg={2} md={1} sm={1} xs={1}>
            <Button
              danger
              onClick={() => {
                router.push(`/common/transactions/taskTransfer`)
              }}
            >
              Cancel
            </Button>
          </Col>
        </Row>
        {/** End  Buttons -  View / Edit / Delete  */}
      </Form>
    </div>
  )
}

export default View
