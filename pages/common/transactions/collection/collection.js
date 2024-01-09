import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
} from 'antd'

import React, { useState } from 'react'

import TextField from '@mui/material/TextField'
// import urls from "../../../URLS/urls"
import urls from "../../../../URLS/urls"

import axios from 'axios'
import { useRouter } from 'next/router'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import KeyPressEvents from '../../../../util/KeyPressEvents'

const Collection = () => {
  const [collection] = Form.useForm()
  const router = useRouter()
  const [inputStateSave, setInputStateSave] = useState(false)
  const handleSave = async () => {
    const allFields = collection.getFieldValue()
    setInputStateSave(true)
    let bodyForApi = {
      ...allFields,
    }
    await axios
      .post(
        `${urls.BaseURL}/collection/saveCollection`,
        bodyForApi,
      )
      .then((r) => {
        if (r.status == 200) {
          message.success('Data Saved !')
          collection.resetFields()
          router.push('/common')
        }
      })
  }

  return (
    <div>
      <BasicLayout titleProp={'Collection'}>
        <Form
          title="Collection"
          form={collection}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row>
            <Col xl={1} lg={1} md={2} sm={1}></Col>
            <Col xl={5} lg={7} md={11} sm={7} xs={24}>
              <Form.Item
                name={'transactionDate'}
                label="Transaction Date"
                required
              >
                <DatePicker />
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
                <Select placeholder={'Select Service'}>
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
                >
                  {' '}
                </TextField>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={1} lg={1} md={2} sm={1}></Col>
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
                >
                  {' '}
                </TextField>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={2} sm={1}></Col>
            <Col xl={5} lg={7} md={11} sm={7} xs={24}>
              <Form.Item name={'receiptType'} label={'Receipt Type'} required>
                <Select placeholder={'Recipt Type'}>
                  <Select.Option value="recipt1">Recipt Type 1</Select.Option>
                  <Select.Option value="recipt2">Recipt Type 2</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={1} lg={1} md={2} sm={1}></Col>
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
                >
                  {' '}
                </TextField>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={2} sm={1}></Col>
            <Col xl={5} lg={7} md={11} sm={7} xs={24}>
              <Form.Item name={'referenceDate'} label="Reference Date" required>
                <DatePicker />
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
                >
                  {' '}
                </TextField>
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col xl={1} lg={1} md={2} sm={1}></Col>
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
                >
                  {' '}
                </TextField>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={2} sm={1}></Col>
            <Col xl={5} lg={7} md={11} sm={7} xs={24}>
              <Form.Item name={'paymentMode'} label="Payment Mode" required>
                <Select placeholder={'Select Option'}>
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
                >
                  {' '}
                </TextField>
              </Form.Item>
            </Col>
          </Row>

          <Row>
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
                >
                  {' '}
                </TextField>
              </Form.Item>
            </Col>
            {/* <Col xl={1} lg={1} md={2} sm={1}></Col>
            <Col xl={5} lg={7} md={11} sm={7} xs={24}>
              <Form.Item name={'receiptPrint'} label="Receipt Print">
                <Button type="primary">Print</Button>
              </Form.Item>
            </Col> */}
            <Col xl={1} lg={1} md={2} sm={1}></Col>
            <Col xl={5} lg={7} md={11} sm={7} xs={24}></Col>
          </Row>

          <Row>
            <Col sm={2} md={4} lg={4} xl={8}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}>
              <Button type="primary" disabled={setInputStateSave} htmlType="submit">
                Save
              </Button>
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button>Reset</Button>
            </Col>
            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                danger
                onClick={() =>
                  router.push(`/common/transactions/collection`)
                }
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </BasicLayout>
    </div>
  )
}

export default Collection
