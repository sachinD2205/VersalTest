import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons'
import { TextField } from '@mui/material'
import { Button, Card, Col, DatePicker, Form, message, Modal, Row, Select, Table } from 'antd'
import React, { useEffect } from 'react'
import { useState, useForm } from 'react'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import axios from 'axios'
import moment from 'moment'
// import urls from "../../../URLS/urls"
import urls from "../../../../URLS/urls"

import { useRouter } from 'next/router'

// Table Form  view applicationsThroughCFCHeadOffice
const Index = () => {
  // all 
  const [dataSource, setDataSource] = useState()
  const [isModalVisible, setIsModalVisible] = useState()
  const [inputState, setInputState] = useState()
  const [applicationDate, setApplicationDate] = useState()
  const [serviceCompletionDate, setServiceCompletionDate] = useState()
  const [dataInModal, setDataInModal] = useState()
  const [okText, setOkText] = useState()
  const [id, setId] = useState()
  const [recordId, setRecordId] = useState()
  const [modalForDelete, setModalForDelete] = useState()



  // define router 
  const router = useRouter()

  // define form 
  const [applicationThroughCFCandZoneOfficeViewEdit] = Form.useForm()

  // Get Api 
  const getApplicationThroughCFCandZoneOffice = () => {
    axios.get(`${urls.BaseURL}/ApplicationThroughCFCAndZoneOffice/getApplicationThroughCFCAndZoneOfficeDetails`).then(
      (resp) => {
        setDataSource(
          resp.data.map(
            (r, i) => ({
              srNo: i + 1,
              id: r.id,
              applicationDate: moment(r.applicationDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
              applicationNumber: r.applicationNumber,
              subject: r.subject,
              title: r.title,
              firstName: r.firstName,
              middleName: r.middleName,
              lastName: r.lastName,
              gender: r.gender,
              flatBuildingNo: r.flatBuildingNo,
              buildingName: r.buildingName,
              roadName: r.roadName,
              pincode: r.pincode,
              adhaarNo: r.adhaarNo,
              PANNo: r.PANNo,
              landmark: r.landmark,
              mobile: r.mobile,
              emailAddress: r.emailAddress,
              serviceCompletionDate: moment(r.serviceCompletionDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
            })
          )
        )
      }
    )
  }

  // useEffect
  useEffect(() => {
    getApplicationThroughCFCandZoneOffice()
  }, [])



  // View 
  const showModalForView = (record) => {
    setDataInModal(
      {
        id: record.id,
        applicationDate: moment(record.applicationDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        applicationNumber: record.applicationNumber,
        subject: record.subject,
        title: record.title,
        firstName: record.firstName,
        middleName: record.middleName,
        lastName: record.lastName,
        gender: record.gender,
        flatBuildingNo: record.flatBuildingNo,
        buildingName: record.buildingName,
        roadName: record.roadName,
        pincode: record.pincode,
        adhaarNo: record.adhaarNo,
        PANNo: record.PANNo,
        mobile: record.mobile,
        landmark: record.landmark,
        emailAddress: record.emailAddress,
        serviceCompletionDate: moment(record.serviceCompletionDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
      },
      setInputState(true),
      setIsModalVisible(true),
      setOkText('Okay'),
    )

  }


  // Edit-View
  const showModalForEdit = (record) => {
    applicationThroughCFCandZoneOfficeViewEdit.resetFields()
    setDataInModal(
      {
        id: record.id,
        applicationDate: moment(record.applicationDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        applicationNumber: record.applicationNumber,
        subject: record.subject,
        title: record.title,
        firstName: record.firstName,
        middleName: record.middleName,
        lastName: record.lastName,
        gender: record.gender,
        flatBuildingNo: record.flatBuildingNo,
        buildingName: record.buildingName,
        roadName: record.roadName,
        pincode: record.pincode,
        adhaarNo: record.adhaarNo,
        PANNo: record.PANNo,
        mobile: record.mobile,
        landmark: record.landmark,
        emailAddress: record.emailAddress,
        serviceCompletionDate: moment(record.serviceCompletionDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
      },
      setInputState(false),
      setIsModalVisible(true),
      setOkText('Save'),
      setId(record.id)
    )

  }

  // Put API  - Update?{ut}
  const editForm = async () => {
    const parametersForEdit = {
      id: dataInModal.id,
      applicationDate: moment(dataInModal.applicationDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      applicationNumber: dataInModal.applicationNumber,
      subject: dataInModal.subject,
      title: dataInModal.title,
      firstName: dataInModal.firstName,
      middleName: dataInModal.middleName,
      lastName: dataInModal.lastName,
      gender: dataInModal.gender,
      flatBuildingNo: dataInModal.flatBuildingNo,
      buildingName: dataInModal.buildingName,
      roadName: dataInModal.roadName,
      pincode: dataInModal.pincode,
      adhaarNo: dataInModal.adhaarNo,
      PANNo: dataInModal.PANNo,
      mobile: dataInModal.mobile,
      landmark: dataInModal.landmark,
      emailAddress: dataInModal.emailAddress,
      serviceCompletionDate: moment(dataInModal.serviceCompletionDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    }
    if (okText == 'Save') {
      await axios.put(`
        ${urls.BaseURL}/ApplicationThroughCFCAndZoneOffice/updateApplicationThroughCFCAndZoneOffice
        `, parametersForEdit).then(
        (resp) => {
          if (resp.status == 200) {
            message.success('Data Updated !!!')
            setIsModalVisible(false)
            router.push(`/common/transactions/applicationThroughCFCandZoneOffice/`)
          }
        }
      )
    }
    else if (okText == 'Okay') {
      setIsModalVisible(false)
    }
    getApplicationThroughCFCandZoneOffice()
  }



  // Delete 
  const deleteRecord = (record) => {
    setRecordId(record.id)
    setModalForDelete(true)
  }

  // Delete Api - Delete
  const deleteForm = async (record) => {

    setModalForDelete(false)

    console.log(recordId);

    await axios.delete(`${urls.BaseURL}/ApplicationThroughCFCAndZoneOffice/deleteApplicationThroughCFCAndZoneOffice/${recordId}`).then(
      (resp) => {
        if (resp.status == 200) {
          message.success('Record Deleted')
        }
        getApplicationThroughCFCandZoneOffice()
      }
    )
  }

  // cancell 
  const handleCancelForModal = () => {
    setIsModalVisible(false)
  }

  // cancell Delete 
  const onCancelForDelete = () => {
    setModalForDelete(false)
  }

  // cols 
  const cols = [
    {
      dataIndex: 'srNo',
      title: 'Sr.No'
    },
    {
      dataIndex: 'applicationDate',
      title: 'Application Date'
    },
    {
      dataIndex: 'applicationNumber',
      title: 'Application Number'
    },
    {
      dataIndex: 'subject',
      title: 'Subject'
    },
    {
      dataIndex: 'title',
      title: 'Title'
    },
    {
      dataIndex: 'firstName',
      title: 'First Name'
    },
    {
      dataIndex: 'middleName',
      title: 'Middle Name'
    },
    {
      dataIndex: 'lastName',
      title: 'Surname/Lastnamee'
    },
    {
      dataIndex: 'gender',
      title: 'Gender'
    },
    {
      dataIndex: 'flatBuildingNo',
      title: 'Flat/Building No'
    },
    {
      dataIndex: 'buildingName',
      title: 'Building Name'
    },
    {
      dataIndex: 'roadName',
      title: 'Road Name'
    },
    {
      dataIndex: 'landmark',
      title: 'Landmark'
    },
    {
      dataIndex: 'pincode',
      title: 'Pincode'
    },
    {
      dataIndex: 'adhaarNo',
      title: 'Aadhaar No'
    },
    {
      dataIndex: 'PANNo',
      title: 'PAN No'
    },
    {
      dataIndex: 'mobile',
      title: 'Mobile No'
    },
    {
      dataIndex: 'emailAddress',
      title: 'Email Address'
    },
    {
      dataIndex: 'serviceCompletionDate',
      title: 'Service Completion Date'
    },
    {
      title: 'Actions',
      width: '120px',
      render: (record) => {
        // view 
        return (
          <>
            <Row>
              <Col>

                {/** View Action Button  */}
                <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: 'violet', marginLeft: 12, marginTop: 10, marginRight: 20 }}
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
    <div>
      <BasicLayout titleProp={'Application Through CFC and Zone Office'}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Button
              type="primary"
              onClick={() => {
                router.push(
                  `/common/transactions/applicationThroughCFCandZoneOffice/view`,
                )
              }}
            >
              {' '}
              Add
            </Button>
          </div>
          <br />
          <br />
          {/** Table */}
          <Table
            bordered
            dataSource={dataSource}
            columns={cols}
            pagination={
              {
                pageSizeOptions: [
                  10, 20, 50, 100
                ]
              }
            }
            scroll={
              {
                y: 450,
                x: 1900
              }
            }
          ></Table>



          <Modal
            width={1000}
            visible={isModalVisible}
            okText={okText}
            onCancel={handleCancelForModal}
            onOk={editForm}
          >

            <Form
              title='applicationThroughCFCandZoneOffice'
              form={applicationThroughCFCandZoneOfficeViewEdit}
              layout='vertical'
            >

              {/** Row */}
              <Row>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item name={'applicationDate'} label='Application Date'
                    rules={
                      [
                        {
                          required: true,
                          message: 'Application Date Selection is Required !! '
                        }
                      ]
                    }
                    disabled={inputState}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.applicationDate)}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              applicationDate: (
                                moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD')
                              )
                            })
                          )
                        }
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}></Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name={'applicationNumber'}
                    rules={[
                      {
                        required: true,
                        message: 'Application Number is Required !!!',
                      },
                    ]}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.applicationNumber}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              applicationNumber: e.target.value
                            })
                          )
                        }
                      }
                      required
                      id="standard-basic"
                      label="Application Number"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputNumber}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={1} sm={1}>
                </Col>
                <Col xl={7} lg={7} md={7} sm={7} xs={24}>
                  <Form.Item
                    name={'subject'}
                    rules={[
                      {
                        required: true,
                        message: 'Application Number is Required !!!',
                      },
                    ]}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.subject}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              subject: e.target.value
                            })
                          )
                        }
                      }
                      required
                      id="standard-basic"
                      label="Subject (Service Name)"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputChar}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'title'}
                    rules={[
                      {
                        required: true,
                        message: 'Title is Required !!!',
                      },
                    ]}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.title}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              title: e.target.value
                            })
                          )
                        }
                      }
                      required
                      id="standard-basic"
                      label="Title"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputChar}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'firstName'}
                    rules={[
                      {
                        required: true,
                        message: 'First Name is Required !!!',
                      },
                    ]}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.firstName}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              firstName: e.target.value
                            })
                          )
                        }
                      }
                      required
                      id="standard-basic"
                      label="First Name"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputChar}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'middleName'}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.middleName}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              middleName: e.target.value
                            })
                          )
                        }
                      }
                      id="standard-basic"
                      label="Middle Name"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputChar}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'lastName'}
                    required={
                      [
                        {
                          required: true,
                          message: 'Surname/LastName is Required !!!'
                        }
                      ]
                    }
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.lastName}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              lastName: e.target.value
                            })
                          )
                        }
                      }
                      required
                      id="standard-basic"
                      label="Surname/Lastname"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputChar}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={4} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'gender'}
                    label="Gender"
                    rules={[
                      {
                        required: true,
                        message: 'Gender Selection is Required !!!',
                      },
                    ]}
                    disabled={inputState}
                  >
                    <Select placeholder="Select Gender"
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.gender}
                      onSelect={
                        (value) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              gender: value
                            })
                          )
                        }
                      }
                    >
                      <Select.Option value="Male">
                        Male
                      </Select.Option>
                      <Select.Option value="Female">
                        Female
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={2} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'flatBuildingNo'}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.flatBuildingNo}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              flatBuildingNo: e.target.value
                            })
                          )
                        }
                      }
                      id="standard-basic"
                      label="Flat/Building No"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputNumber}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'buildingName'}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.buildingName}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              buildingName: e.target.value
                            })
                          )
                        }
                      }
                      id="standard-basic"
                      label="Building Name"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputChar}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'roadName'}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.roadName}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              roadName: e.target.value
                            })
                          )
                        }
                      }
                      id="standard-basic"
                      label="Road Name"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputChar}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'landmark'}
                    required={
                      [
                        {
                          required: true,
                          message: 'Landmark is Required !!!'
                        }
                      ]
                    }
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.landmark}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              landmark: e.target.value
                            })
                          )
                        }
                      }
                      required
                      id="standard-basic"
                      label="Landmark"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'pincode'}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.pincode}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              pincode: e.target.value
                            })
                          )
                        }
                      }
                      id="standard-basic"
                      label="Pincode"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputNumber}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'adhaarNo'}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.adhaarNo}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              adhaarNo: e.target.value
                            })
                          )
                        }
                      }
                      id="standard-basic"
                      label="Aadhaar No"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputNumber}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'PANNo'}
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.PANNo}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              PANNo: e.target.value
                            })
                          )
                        }
                      }
                      id="standard-basic"
                      label="PAN No"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'mobile'}
                    required={
                      [
                        {
                          required: true,
                          message: 'Mobile No is Required !!!'
                        }
                      ]
                    }
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.mobile}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              mobile: e.target.value
                            })
                          )
                        }
                      }
                      required
                      id="standard-basic"
                      label="Mobile No"
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputNumber}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                  <Form.Item
                    name={'emailAddress'}
                    required={
                      [
                        {
                          required: true,
                          message: 'Email Address is Required !!!'
                        }
                      ]
                    }
                  >
                    <TextField
                      disabled={inputState}
                      defaultValue={dataInModal && dataInModal.emailAddress}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              emailAddress: e.target.value
                            })
                          )
                        }
                      }
                      required
                      id="standard-basic"
                      label="Email Address
                  "
                      variant="standard"
                      onKeyPress={KeyPressEvents.isInputVarchar}
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={8} lg={8} md={12} sm={8} xs={24}>
                  <Form.Item name={'serviceCompletionDate'} label='Service Completion Date'
                    rules={
                      [
                        {
                          required: true,
                          message: 'Service Completion Date Selection is Required !! '
                        }
                      ]
                    }
                    disabled={inputState}
                  >
                    <DatePicker
                      disabled={inputState}
                      defaultValue={dataInModal && moment(dataInModal.serviceCompletionDate)}
                      onChange={
                        (e) => {
                          setDataInModal(
                            (preDataInModal) => ({
                              ...preDataInModal,
                              serviceCompletionDate: (
                                moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD')
                              )
                            })
                          )
                        }
                      }
                    />
                  </Form.Item>
                </Col>
                <Col xl={1} lg={1} md={2} sm={1}></Col>
                <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                </Col>
              </Row>
              {/** End Rows  */}
            </Form>
          </Modal>

          <Modal
            title={'Are Your Sure want to Delete ?'}
            visible={modalForDelete}
            okText={'Yes'}
            okType="danger"
            cancelText={'No'}
            onCancel={onCancelForDelete}
            onOk={deleteForm}
          ></Modal>

        </Card>
      </BasicLayout>
    </div>
  )
}

export default Index