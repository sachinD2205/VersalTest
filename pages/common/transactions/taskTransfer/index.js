import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons'
import { IconButton, Input, TextField } from '@mui/material'
import {
  Card,
  Col,
  DatePicker,
  Form,
  message,
  Modal,
  Row,
  Select,
  Table,
} from 'antd'
import { Button } from '@mui/material'
// import urls from "../../../URLS/urls"
import urls from '../../../../URLS/urls'
import axios from 'axios'
import React from 'react'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import { useState } from 'react'
import { useEffect } from 'react'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import { useRouter } from 'next/router'
import moment from 'moment'
import Edit from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'

// Task Transfer - Table Form
const Index = () => {
  const [dataSource, setDataSource] = useState()
  const [taskTransferFormViewEdit] = Form.useForm()
  const [inputState, setInputState] = useState()
  const [isModalVisible, setIsModalVisible] = useState()
  const [okText, setOkText] = useState()
  const [Id, setId] = useState()
  const [modalForDelete, setModalForDelete] = useState()
  const [recordId, setRecodId] = useState()
  const [dataInModal, setDataInModal] = useState()

  // Get API
  const getTaskTransferForm = () => {
    axios
      .get(`${urls.CFCURL}/transaction/taskTransfer/getTaskTransferDetails`)
      .then((resp) => {
        console.log('res getTaskTransferDetails', resp)
        setDataSource(
          resp.data.map((r, index) => ({
            id: r.id,
            srNo: index + 1,
            departmentName: r.departmentName,
            taskServiceName: r.taskServiceName,
            employeeNameTransferFrom: r.employeeNameTransferFrom,
            employeeNameTransferTo: r.employeeNameTransferTo,
            fromDuration: moment(r.fromDuration, 'YYYY-MM-DD').format(
              'YYYY-MM-DD'
            ),
            toDuration: moment(r.toDuration, 'YYYY-MM-DD').format('YYYY-MM-DD'),
            counterNo: r.counterNo,
            remarks: r.remarks,
          }))
        )
      })
  }

  // define useEfect
  useEffect(() => {
    getTaskTransferForm()
  }, [])

  // View Modal
  const showModalForView = (record) => {
    setDataInModal(
      {
        id: record.id,
        departmentName: record.departmentName,
        taskServiceName: record.taskServiceName,
        employeeNameTransferFrom: record.employeeNameTransferFrom,
        employeeNameTransferTo: record.employeeNameTransferTo,
        fromDuration: moment(record.fromDuration, 'YYYY-MM-DD').format(
          'YYYY-MM-DD'
        ),
        toDuration: moment(record.toDuration, 'YYYY-MM-DD').format(
          'YYYY-MM-DD'
        ),
        counterNo: record.counterNo,
        remarks: record.remarks,
      },
      setInputState(true),
      setIsModalVisible(true),
      setOkText('Okay')
    )
  }

  // Edit -View Modal
  const showModalForEdit = (record) => {
    taskTransferFormViewEdit.resetFields()
    setDataInModal(
      {
        id: record.id,
        departmentName: record.departmentName,
        taskServiceName: record.taskServiceName,
        employeeNameTransferFrom: record.employeeNameTransferFrom,
        employeeNameTransferTo: record.employeeNameTransferTo,
        fromDuration: moment(record.fromDuration, 'YYYY-MM-DD').format(
          'YYYY-MM-DD'
        ),
        toDuration: moment(record.toDuration, 'YYYY-MM-DD').format(
          'YYYY-MM-DD'
        ),
        counterNo: record.counterNo,
        remarks: record.remarks,
      },
      setInputState(false),
      setIsModalVisible(true),
      setOkText('Save'),
      setId(record.id)
    )
  }

  // Edit - Save Put
  const editForm = async () => {
    const parametersForEdit = {
      id: dataInModal.id,
      departmentName: dataInModal.departmentName,
      taskServiceName: dataInModal.taskServiceName,
      employeeNameTransferFrom: dataInModal.employeeNameTransferFrom,
      employeeNameTransferTo: dataInModal.employeeNameTransferTo,
      fromDuration: moment(dataInModal.fromDuration, 'YYYY-MM-DD').format(
        'YYYY-MM-DD'
      ),
      toDuration: moment(dataInModal.toDuration, 'YYYY-MM-DD').format(
        'YYYY-MM-DD'
      ),
      remarks: dataInModal.remarks,
      counterNo: dataInModal.counterNo,
    }
    if (okText == 'Save') {
      await axios
        .put(
          `${urls.CFCURL}/TaskTransfer/updateTaskTransfer`,
          parametersForEdit
        )
        .then((resp) => {
          if (resp.status == 200) {
            message.success('Data Updated !!!')
          }
          setIsModalVisible(false)
        })
    } else if (okText === 'Okay') {
      setIsModalVisible(false)
    }
    getTaskTransferForm()
  }

  // Delete Modal
  const deleteRecord = (record) => {
    setRecodId(record.id)
    setModalForDelete(true)
    console.log(`id ${record.id}`)
  }

  // Delete API
  const deleteForm = async (record) => {
    setModalForDelete(false)
    await axios
      .delete(`${urls.CFCURL}/TaskTransfer/deleteTaskTransfer/${recordId}`)
      .then((resp) => {
        if (resp.status == 200) {
          message.success('Record Deleted')
        }
        getTaskTransferForm()
      })
  }

  // view Edit - Cancell
  const handleCancelForModal = () => {
    setIsModalVisible(false)
  }

  // Delete Cancell
  const onCancelForDelete = () => {
    setModalForDelete(false)
  }

  // router
  const router = useRouter()

  // cols - Table
  const columns = [
    {
      field: 'srNo',
      headerName: 'Sr No',
      //   flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'departmentName',
      headerName: 'Department Name',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'taskServiceName',
      headerName: 'Deparment NameTask/Service Name',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'employeeNameTransferFrom',
      headerName: 'Employee Name (Transfer From)',
      width: 100,
      //   flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'employeeNameTransferTo',
      headerName: 'Employee Name (Transfer To)',
      //   width: 160,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'fromDuration',
      headerName: 'From Duration',
      width: 100,
      //   flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'toDuration',
      headerName: 'To Duration',
      //   width: 160,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'counterNo',
      headerName: 'Counter Number',
      //   width: 160,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      //   width: 160,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
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
                console.log('params.row: ', params.row)
                reset(params.row)
              }}
            >
              {/* <EditIcon style={{ color: "#556CD6" }} /> */}
            </IconButton>
          </>
        )
      },
    },
  ]
  const cols = [
    {
      title: 'Deparment Name',
      dataIndex: 'departmentName',
    },
    {
      title: 'Deparment NameTask/Service Name',
      dataIndex: 'taskServiceName',
    },
    {
      title: 'Employee Name (Transfer From)',
      dataIndex: 'employeeNameTransferFrom',
    },
    {
      title: 'Employee Name(Transfer To)',
      dataIndex: 'employeeNameTransferTo',
    },
    {
      title: 'From Duration',
      dataIndex: 'fromDuration',
    },
    {
      title: 'To Duration',
      dataIndex: 'toDuration',
    },
    // photo preview
    // {
    //   title:'Reason for Task Transfer',
    //   dataIndex:'reasonForTaskTransfer'
    // },
    {
      title: 'Counter Number',
      dataIndex: 'counterNo',
    },

    // Photo Preview
    // {
    //   title:'attachFile',
    //   dataIndex:'Attach File'
    // },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
    },
    {
      title: 'Actions',
      width: '56px',
      render: (record) => {
        // view
        return (
          <>
            <Row>
              <Col>
                {/** View Action Button  */}
                <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
                />

                {/** View Edit Button  */}
                <EditTwoTone onClick={() => showModalForEdit(record)} />

                {/** View Delete Button  */}
                <DeleteOutlined
                  onClick={() => deleteRecord(record)}
                  style={{ color: 'red', marginLeft: 12 }}
                />
              </Col>
            </Row>
          </>
        )
      },
    },
  ]

  return (
    <div style={{ padding: '120px' }}>
      {/* <BasicLayout title='Task Transfer'> */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'right' }}>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            onClick={() => {
              router.push(`/common/transactions/taskTransfer/view`)
            }}
          >
            Add
          </Button>
        </div>
        <br />
        <br />
        <Table columns={cols} dataSource={dataSource}></Table>

        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm}
        >
          <Form
            title='taskTransfer'
            form={taskTransferFormViewEdit}
            layout='vertical'
          >
            {/** Rows */}
            <Row>
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                <Form.Item
                  name={'departmentName'}
                  label='Deparment Name'
                  rules={[
                    {
                      required: true,
                      message: 'Deparment Name Selection is Required !!!',
                    },
                  ]}
                  disabled={inputState}
                >
                  <Select
                    placeholder='Select Deparment Name'
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.departmentName}
                    onSelect={(value) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        departmentName: value,
                      }))
                    }}
                  >
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
              <Col xl={1} lg={1} md={1} sm={1}></Col>
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
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
                  <Select
                    placeholder='Select Task/Service Name'
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.taskServiceName}
                    onSelect={(value) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        taskServiceName: value,
                      }))
                    }}
                  >
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
              <Col xl={1} lg={1} md={1} sm={1}></Col>
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
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
                  <Select
                    placeholder='Select Employee Name Transfer Form'
                    disabled={inputState}
                    defaultValue={
                      dataInModal && dataInModal.employeeNameTransferFrom
                    }
                    onSelect={(value) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        employeeNameTransferFrom: value,
                      }))
                    }}
                  >
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
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                <Form.Item
                  name={'employeeNameTransferTo'}
                  label='Employee Name(Transfer To)'
                  rules={[
                    {
                      required: true,
                      message:
                        'Employee Name Transfer To Selection is Required !',
                    },
                  ]}
                >
                  <Select
                    placeholder='Select Employee Name Transfer To'
                    disabled={inputState}
                    defaultValue={
                      dataInModal && dataInModal.employeeNameTransferTo
                    }
                    onSelect={(value) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        employeeNameTransferTo: value,
                      }))
                    }}
                  >
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
              <Col xl={1} lg={1} md={1} sm={1}></Col>
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
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
                    disabled={inputState}
                    defaultValue={
                      dataInModal && moment(dataInModal.formDuration)
                    }
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        fromDuration: moment(e, 'YYYY-MM-DD').format(
                          'YYYY-MM-DD'
                        ),
                      }))
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={1} sm={1}></Col>
              <Col xl={7} lg={7} md={7} sm={7} xs={24}>
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
                    disabled={inputState}
                    defaultValue={dataInModal && moment(dataInModal.toDuration)}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        toDuration: moment(e, 'YYYY-MM-DD').format(
                          'YYYY-MM-DD'
                        ),
                      }))
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/** Row End */}

            {/** Buttons */}
            <br />
            {/** 
        
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
        */}
            {/** Buttons End  */}

            {/** Next Rows  */}
            <br />
            <Row>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  label='Reason for Task Transfer'
                  name='reasonForTaskTransfer'
                  rules={[
                    {
                      required: false,
                      message: 'Please Upload Documents',
                    },
                  ]}
                  disabled={inputState}
                >
                  <Input
                    labelCol={{ xs: 8 }}
                    wrapperCol={{ xs: 8 }}
                    accept='image/*'
                    type={'file'}
                    name={'file'}
                    onChange={(e) => handleFile(e)}
                  ></Input>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
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
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.counterNo}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        counterNo: e.target.value,
                      }))
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item name={'remarks'}>
                  <TextField
                    id='standard-basic'
                    label='Remarks'
                    variant='standard'
                    onKeyPress={KeyPressEvents.isInputVarchar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.remarks}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        remarks: e.target.value,
                      }))
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  label='Attach File'
                  name='attachFile'
                  rules={[
                    {
                      required: false,
                      message: 'Please Upload Documents',
                    },
                  ]}
                  disabled={inputState}
                >
                  <Input
                    labelCol={{ xs: 8 }}
                    wrapperCol={{ xs: 8 }}
                    accept='image/*'
                    type={'file'}
                    name={'file'}
                    onChange={(e) => handleFile(e)}
                  ></Input>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title={'Are Your Sure want to Delete ?'}
          visible={modalForDelete}
          okText={'Yes'}
          okType='danger'
          cancelText={'No'}
          onCancel={onCancelForDelete}
          onOk={deleteForm}
        ></Modal>
      </Card>
      {/* </BasicLayout> */}
    </div>
  )
}

export default Index
