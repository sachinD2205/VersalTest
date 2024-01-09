import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons'
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
  Table,
} from 'antd'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import moment from 'moment'

import { TextField } from '@mui/material'
import axios from 'axios'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import KeyPressEvents from '../../../../util/KeyPressEvents'

const Index = () => {
  const router = useRouter()
  const [dataSource, setDataSource] = useState()
  const [collection] = Form.useForm()
  const [form] = Form.useForm()
  const [dataInModal, setDataInModal] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [okText, setOkText] = useState()
  const [ID, setID] = useState()
  const [inputState, setInputState] = useState('false')
  const [modalForDelete, setModalForDelete] = useState(false)
  const [recordId, setRecordId] = useState()

  const getCorrectionByDepartment = () => {
    axios
      // .get(
      //   'http://localhost:8090/cfc/api/CorrectionByDepartment/getCorrectionByDepartmentDetails',
      // )
      .then((r) => {
        setDataSource(
          r.data.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            applicationNo: j.applicationNo,
            remarks: j.remarks,
          })),
        )
        console.log('table values => ', r.data)
      })
  }

  useEffect(() => {
    getCorrectionByDepartment()
  }, [])

  const showModalForEdit = (record) => {
    setDataInModal({
      id: record.id,
      srNo: record.srNo,
      applicationNo: record.applicationNo,
      remarks: record.remarks,
    })
    setInputState(false)

    setIsModalVisible(true)
    setOkText('Save')
    setID(record.id)
  }

  const handleCancelForModal = () => {
    setIsModalVisible(false)
  }

  const editForm = async () => {
    const parametersForEdit = {
      id: ID,
      srNo: dataInModal.srNo,
      applicationNo: dataInModal.applicationNo,
      remarks: dataInModal.remarks,
    }
    if (okText === 'Save') {
      await axios
        // .put(
        //   `http://localhost:8090/cfc/api/CorrectionByDepartment/updateCorrectionByDepartment`,
        //   parametersForEdit,
        // )
        .then((res) => {
          if (res.status === 200) {
            message.success('Data Updated!')
            setIsModalVisible(false)
          }
        })
    } else if (okText === 'Okay') {
      setIsModalVisible(false)
    }
    getCorrectionByDepartment()
  }

  const showModalForView = (record) => {
    console.log(`Record   ${record}`)
    setDataInModal({
      id: record.id,
      srNo: record.srNo,
      applicationNo: record.applicationNo,
      remarks: record.remarks,
    })
    setInputState(true)
    setIsModalVisible(true)
    setOkText('Okay')
  }
  const onCancelForDelete = () => {
    setModalForDelete(false)
  }

  const deleteRecord = (record) => {
    setRecordId(record.id)
    setModalForDelete(true)
    console.log(`id ${record.id}`)
  }
  const deleteForm = async (record) => {
    setModalForDelete(false)
    console.log(`${record.id}`)
    await axios
      // .delete(
      //   `http://localhost:8090/cfc/api/CorrectionByDepartment/deleteCorrectionByDepartment/${recordId}`,
      // )
      .then((res) => {
        if (res.status == 200) {
          message.success('record Deleted !')
        }
        getCorrectionByDepartment()
      })
  }

  const cols = [
    {
      title: 'Sr.No',
      dataIndex: 'srNo',
    },
    {
      title: 'Application Number',
      dataIndex: 'applicationNo',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
    },

    {
      title: 'Actions',
      width: '56px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: 'violet' }}
                />
                <EditTwoTone onClick={() => showModalForEdit(record)} />
                <DeleteOutlined
                  onClick={() => deleteRecord(record)}
                  style={{ color: 'red' }}
                />
              </Col>
            </Row>
          </>
        )
      },
    },
  ]

  return (
    <>
      <BasicLayout titleProp={'none'}>
        <Card>
          <Row style={{ marginBottom: '10px' }}>
            <Col xl={22} lg={22} md={20} sm={18} xs={18}></Col>

            <Col xl={2} lg={2} md={2} sm={4} xs={4}>
              <Button
                type="primary"
                onClick={() =>
                  router.push(
                    `/marriageRegistration/transactions/correctionByDepartment/view`,
                  )
                }
              >
                Add New
              </Button>
            </Col>
          </Row>
        </Card>

        <Card>
          <Table
            bordered
            columns={cols}
            dataSource={dataSource}
            scroll={{ x: 400 }}
          />
        </Card>

        <Modal
          width={900}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm}
        >
          <Form title="relegion" form={form} layout="vertical">
            <Row>
              <Col span={3}></Col>
              <Col span={5}>
                <Form.Item
                  name="applicationNo"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Application Number"
                    variant="standard"
                    disabled={inputState}
                    onKeyPress={KeyPressEvents.isInputChar}
                    defaultValue={dataInModal && dataInModal.applicationNo}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        applicationNo: e.target.value,
                      }))
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={3}></Col>
              <Col span={5}>
                <Form.Item
                  name="remarks"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Remarks"
                    variant="standard"
                    disabled={inputState}
                    onKeyPress={KeyPressEvents.isInputChar}
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
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col span={3}></Col>
              <Col span={6}>
                <Form.Item
                  label="Attach File"
                  // name="attachFile"
                  name="attachFile"
                  rules={[
                    {
                      required: false,
                      message: 'Please Upload Documents',
                    },
                  ]}
                >
                  <Input
                    // @ts-ignore
                    labelCol={{ xs: 8 }}
                    wrapperCol={{ xs: 8 }}
                    accept="image/*"
                    type={'file'}
                    name={'file'}
                    onChange={(e) => handleFile(e)}
                    disabled={inputState}

                    // value={pageType ? router.query.documentsUpload : ""}
                    // disabled={router.query.pageMode === "View"}
                  ></Input>
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          title={'Are Your Sure want to Delete ?'}
          visible={modalForDelete}
          okText={'yes'}
          okType="danger"
          cancelText={'no'}
          onCancel={onCancelForDelete}
          onOk={deleteForm}
        ></Modal>
      </BasicLayout>
    </>
  )
}
export default Index
