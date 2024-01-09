import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons'
import {
  Button,
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

// import urls from "../../../URLS/urls"
import urls from "../../../../URLS/urls"

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
  const [dataInModal, setDataInModal] = useState()
  const [inputState, setInputState] = useState(false)
  const [ID, setID] = useState()
  const [modalForDelete, setModalForDelete] = useState(false)
  const [recordId, setRecordId] = useState()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [okText, setOkText] = useState()

  const getcollectionDetails = () => {
    axios
      .get(`${urls.BaseURL}/collection/getcollectionDetails`)
      .then((r) => {
        setDataSource(
          r.data.map((j, i) => ({
            id: j.id,
            srNo: i + 1,

            transactionDate: j.transactionDate,
            serviceName: j.serviceName,
            receiptNo: j.receiptNo,
            collectionCenter: j.collectionCenter,
            counter: j.counter,
            moduleName: j.moduleName,
            userName: j.userName,
            receiptType: j.receiptType,
            reference: j.reference,
            referenceDate: j.referenceDate,
            payerName: j.payerName,
            address: j.address,
            narration: j.narration,
            paymentMode: j.paymentMode,
            accountCode: j.accountCode,
            codeDescription: j.codeDescription,
            amount: j.amount,
          })),
        )
      })
  }
  useEffect(() => {
    getcollectionDetails()
  })
  const handleCancelForModal = () => {
    setIsModalVisible(false)
  }
  const showModalForView = (record) => {
    collection.resetFields()
    setDataInModal({
      id: record.id,
      transactionDate: record.transactionDate,
      serviceName: record.serviceName,
      receiptNo: record.receiptNo,
      collectionCenter: record.collectionCenter,
      counter: record.counter,
      moduleName: record.moduleName,
      userName: record.userName,
      receiptType: record.receiptType,
      reference: record.reference,
      referenceDate: record.referenceDate,
      payerName: record.payerName,
      address: record.address,
      narration: record.narration,
      paymentMode: record.paymentMode,
      accountCode: record.accountCode,
      codeDescription: record.codeDescription,
      amount: record.amount,
    })
    setInputState(true)
    setIsModalVisible(true)
    setOkText('Okay')
  }

  const editForm = async () => {
    const parametersForEdit = {
      id: ID,
      transactionDate: dataInModal.transactionDate,
      serviceName: dataInModal.serviceName,
      receiptNo: dataInModal.receiptNo,
      collectionCenter: dataInModal.collectionCenter,
      counter: dataInModal.counter,
      moduleName: dataInModal.moduleName,
      userName: dataInModal.userName,
      receiptType: dataInModal.receiptType,
      reference: dataInModal.reference,
      referenceDate: dataInModal.referenceDate,
      payerName: dataInModal.payerName,
      address: dataInModal.address,
      narration: dataInModal.narration,
      paymentMode: dataInModal.paymentMode,
      accountCode: dataInModal.accountCode,
      codeDescription: dataInModal.codeDescription,
      amount: dataInModal.amount,
    }
    if (okText === 'Save') {
      await axios
        .put(
          `${urls.BaseURL}/collection/updateCollection`,
          parametersForEdit,
        )
        .then((res) => {
          if (res.status === 200) {
            message.success('Data Updated !!')
            setIsModalVisible(false)
          }
        })
    } else if (okText === 'Okay') {
      setIsModalVisible(false)
    }
    getcollectionDetails()
  }
  const onCancelForDelete = () => {
    setModalForDelete(false)
  }
  const showModalForEdit = (record) => {
    collection.resetFields()
    setDataInModal({
      id: record.id,
      transactionDate: record.transactionDate,
      serviceName: record.serviceName,
      receiptNo: record.receiptNo,
      collectionCenter: record.collectionCenter,
      counter: record.counter,
      moduleName: record.moduleName,
      userName: record.userName,
      receiptType: record.receiptType,
      reference: record.reference,
      referenceDate: record.referenceDate,
      payerName: record.payerName,
      address: record.address,
      narration: record.narration,
      paymentMode: record.paymentMode,
      accountCode: record.accountCode,
      codeDescription: record.codeDescription,
      amount: record.amount,
    })
    setInputState(false)
    setIsModalVisible(true)
    setOkText('Save')
    setID(record.id)
  }

  const deleteRecord = (record) => {
    setRecordId(record.id)
    setModalForDelete(true)
  }

  const deleteForm = async (record) => {
    setModalForDelete(false)
    await axios
      .delete(
        `${urls.BaseURL}/collection/deleteCollection/${recordId}`,
      )
      .then((res) => {
        if (res.status == 226) {
          message.success('Record Deleted !!')
          setDataSource()
        }
      })
    getcollectionDetails()
  }
  const cols = [
    {
      title: 'Sr.No',
      dataIndex: 'srNo',
    },
    {
      title: 'Transaction Date',
      dataIndex: 'transactionDate',
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
    },
    {
      title: 'Receipt No ',
      dataIndex: 'receiptNo',
    },
    {
      title: 'Collection Center',
      dataIndex: 'collectionCenter',
    },
    {
      title: 'Counter ',
      dataIndex: 'counter',
    },
    {
      title: 'Module Name',
      dataIndex: 'moduleName',
    },

    {
      title: 'User Name',
      dataIndex: 'userName',
    },
    {
      title: 'Receipt Type',
      dataIndex: 'receiptType',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
    },
    {
      title: 'Reference Date',
      dataIndex: 'referenceDate',
    },
    {
      title: 'Payer Name',
      dataIndex: 'payerName',
    },
    {
      title: 'Address ',
      dataIndex: 'address',
    },
    {
      title: 'Narration',
      dataIndex: 'narration',
    },

    {
      title: 'Payment Mode',
      dataIndex: 'paymentMode',
    },
    {
      title: 'Account Code',
      dataIndex: 'accountCode',
    },
    {
      title: 'Code Description',
      dataIndex: 'codeDescription',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },

    {
      title: 'Actions',
      width: '120px',
      render: (record) => {
        return (
          <>
            <Row>
              <Col>
                <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: 'violet', marginLeft: 12, marginTop: 10, marginRight: 20 }}
                />
                <EditTwoTone onClick={() => showModalForEdit(record)} />
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
                    `/common/transactions/collection/collection`,
                  )
                }
              >
                Add
              </Button>
            </Col>
          </Row>
          <div>
            <Table
              bordered
              columns={cols}
              dataSource={dataSource}
              pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
              scroll={{ y: 450, x: 1900 }}
            />
          </div>
        </Card>
        <Modal
          title={'Are you sure you want to delete this'}
          visible={modalForDelete}
          okText={'Yes'}
          okType="danger"
          cancelText={'No'}
          onCancel={onCancelForDelete}
          onOk={deleteForm}
        ></Modal>
        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm}
        >
          <Form title="Collection" form={collection} layout="vertical">
            <Row>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'transactionDate'}
                  label="Transaction Date"
                  required
                >
                  <DatePicker
                    disabled={inputState}
                    defaultValue={
                      dataInModal && moment(dataInModal.transactionDate)
                    }
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        transactionDate: moment(e).format('YYYY-MM-DD'),
                      }))
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'serviceName'}
                  label="Service Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Service Name',
                    },
                  ]}
                >
                  <Select
                    placeholder={'Select Service'}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.serviceName}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        serviceName: e,
                      }))
                    }}
                  >
                    <Select.Option value="serviceName 1">
                      Service Name 1
                    </Select.Option>
                    <Select.Option value="serviceName 2">
                      Service Name 2
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'receiptNo'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Receipt No',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Receipt No"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputNumber}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.receiptNo}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        receiptNo: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>

              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'collectionCenter'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Collection Center',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Collection Center"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.collectionCenter}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        collectionCenter: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'counter'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Counter',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Counter"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.counter}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        counter: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'moduleName'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Module Name',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Module Name"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.moduleName}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        moduleName: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'userName'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter User Name',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="User Name"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.userName}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        userName: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item name={'receiptType'} label={'Receipt Type'} required>
                  <Select
                    placeholder={'Recipt Type'}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.receiptType}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        receiptType: e,
                      }))
                    }}
                  >
                    <Select.Option value="recipt1">Recipt Type 1</Select.Option>
                    <Select.Option value="recipt2">Recipt Type 2</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'reference'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Reference',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Reference"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.reference}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        reference: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'referenceDate'}
                  label="Reference Date"
                  required
                >
                  <DatePicker
                    disabled={inputState}
                    defaultValue={
                      dataInModal && moment(dataInModal.referenceDate)
                    }
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        referenceDate: moment(e).format('YYYY-MM-DD'),
                      }))
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'payerName'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Payer Name',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Payer Name"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.payerName}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        payerName: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'address'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Address',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Address"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.address}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        address: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'narration'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Narration',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Narration"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.narration}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        narration: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item name={'paymentMode'} label="Payment Mode" required>
                  <Select
                    placeholder={'Select Option'}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.paymentMode}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        paymentMode: e,
                      }))
                    }}
                  >
                    <Select.Option value="cash">Cash</Select.Option>
                    <Select.Option value="cheque">Cheque</Select.Option>
                    <Select.Option value="dd">DD</Select.Option>
                    <Select.Option value="onlinePayment">
                      Online Payment
                    </Select.Option>
                    <Select.Option value="creditDebit">
                      Credit or DebitCard
                    </Select.Option>
                    <Select.Option value="rTGS">RTGS</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'accountCode'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Account Code',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Account Code"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputNumber}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.accountCode}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        accountCode: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'codeDescription'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Code Description',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Code Description"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputVarchar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.codeDescription}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        codeDescription: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}></Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item
                  name={'amount'}
                  rules={[
                    {
                      required: true,
                      message: 'Please Enter Amount',
                    },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Amount"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputVarchar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.amount}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        amount: e.target.value,
                      }))
                    }}
                  >
                    {' '}
                  </TextField>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}>
                <Form.Item name={'receiptPrint'} label="Receipt Print">
                  <Button type="primary">Print</Button>
                </Form.Item>
              </Col>
              <Col xl={1} lg={1} md={2} sm={1}></Col>
              <Col xl={5} lg={7} md={11} sm={7} xs={24}></Col>
            </Row>
          </Form>
        </Modal>
      </BasicLayout>
    </>
  )
}
export default Index
