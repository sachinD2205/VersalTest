import { TextField } from '@mui/material'
import { Button, Col, DatePicker, Form, message, Row, Select } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import moment from 'moment'
// import urls from "../../../URLS/urls"
import urls from "../../../../URLS/urls"


// Add Form  applicationThroughCFCandZoneOffice
const View = () => {
  // All Const 
  const [inputStateSave, setInputStateSave] = useState(false)
  const [applicationDate, setApplicationDate] = useState()
  const [serviceCompletionDate, setServiceCompletionDate] = useState()
  // Define Form 
  const [applicationThroughCFCandZoneOffice] = Form.useForm()

  // define router 
  const router = useRouter()

  // resetForm Button 
  const resetForm = () => {
    applicationThroughCFCandZoneOffice.resetFields()
  }

  // handleSave 
  const handleSave = async () => {
    setInputStateSave(true)
    // Form Get Values
    const formFields = applicationThroughCFCandZoneOffice.getFieldValue()

    // Update Form Values 
    const postValues = {
      ...formFields,
      applicationDate: moment(applicationDate, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      serviceCompletionDate: moment(serviceCompletionDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
    }

    await axios.post(`${urls.BaseURL}/ApplicationThroughCFCAndZoneOffice/saveApplicationThroughCFCAndZoneOffice`, postValues).then(
      (resp) => {
        if (resp.status == 200) {
          message.success('Data Saved !!!')
        }
        router.push(`/common/transactions/applicationThroughCFCandZoneOffice`)
      }
    )


  }

  return (
    <div>
      <BasicLayout titleProp={'Application through CFC and Zone Office'}>
        <Form
          title='applicationThroughCFCandZoneOffice'
          form={applicationThroughCFCandZoneOffice}
          layout='vertical'
          onFinish={handleSave}
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
              >
                <DatePicker
                  onChange={
                    (e) => {
                      setApplicationDate(moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD'))
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
              >
                <Select placeholder="Select Gender">
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
              >
                <DatePicker
                  onChange={
                    (e) => {
                      setServiceCompletionDate(moment(e, 'YYYY-MM-DD').format('YYYY-MM-DD'))
                    }
                  }
                />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={2} sm={1}></Col>
            <Col xl={5} lg={7} md={11} sm={7} xs={24}>
            </Col>
          </Row>

          {/** Buttons */}
          <br />
          <Row>
            <Col sm={2} md={4} lg={4} xl={5}></Col>
            <Col xs={3} sm={2} md={4} lg={4} xl={2}></Col>
            <Col xs={3} sm={1} md={1} lg={2} xl={2}>
              <Button type="primary" disabled={inputStateSave} htmlType='submit'>
                Save
              </Button>
            </Col>
            <Col xs={3} xl={2} lg={2} md={3} sm={4}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button onClick={resetForm}>Reset</Button>
            </Col>
            <Col xs={5} xl={2} lg={2} md={3} sm={4}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                danger
                onClick={() => {
                  router.push(`/common/transactions/applicationThroughCFCandZoneOffice`)
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
          {/** End Rows  */}


        </Form>
      </BasicLayout>
    </div>
  )
}

export default View