import { Button, Card, Col, Form, Input, message, Row } from 'antd'
import React, { useState } from 'react'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'
import axios from 'axios'

const Index = () => {
  const [correctionForm] = Form.useForm()
  const router = useRouter()

  const resetForm = () => {
    correctionForm.resetFields()
  }

  const handleSave = async () => {
    const allFields = correctionForm.getFieldValue()
    console.log(allFields)

    let bodyForApi = {
      ...allFields,
    }
    await axios
      // .post(
      //   'http://localhost:8090/cfc/api/CorrectionByDepartment/saveCorrectionByDepartment',
      //   bodyForApi,
      // )
      .then((r) => {
        if (r.status == 200) {
          message.success('Data Saved !')
          correctionForm.resetFields()
          router.push(
            `/marriageRegistration/transactions/correctionByDepartment/`,
          )
        }
      })
  }

  return (
    <div>
      <BasicLayout titleProp={'none'}>
        <Card>
          <center>
            <h2>Correction by Department</h2>
          </center>
        </Card>
        <Card>
          <Form layout="vertical" form={correctionForm} onFinish={handleSave}>
            <Row>
              <Col xl={8} lg={8} md={8}></Col>
              <Col xl={4}>
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
                    onKeyPress={KeyPressEvents.isInputChar}
                  />
                </Form.Item>
              </Col>
              <Col xl={2}></Col>
              <Col xl={4}>
                <Form.Item
                  name="remarks"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  // label="Remarks"
                >
                  <TextField
                    // style={{ width: 100 }}
                    required
                    id="standard-basic"
                    label="Remarks"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                  />
                  {/* <Input type="text" onKeyPress={KeyPressEvents.isInputChar} /> */}
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginTop: 20 }}>
              <Col xl={8}></Col>
              <Col xl={4}>
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
                    // value={pageType ? router.query.documentsUpload : ""}
                    // disabled={router.query.pageMode === "View"}
                  ></Input>
                </Form.Item>

                {/* <Form.Item
                  name="image"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input
                    // @ts-ignore
                    labelCol={{ xs: 8 }}
                    wrapperCol={{ xs: 8 }}
                    addonBefore={"Upload Image"}
                    accept="image/*"
                    type={"file"}
                    name={"file"}
                    onChange={(e) => handleFile(e)}
                  ></Input>
                </Form.Item> */}
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={4}>
                <Form.Item label="Generate Receipt" name="generateCertificate">
                  <Button
                    htmlType="submit"
                    style={{ color: 'white', backgroundColor: 'grey' }}
                    type="default"
                  >
                    Print
                  </Button>
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: 30 }}>
              <Col sm={6} md={7} lg={7} xl={8}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Button
                  type="primary"
                  htmlType="submit"
                  // onClick={() =>
                  //   router.push(`/marriageRegistration/boardRegistrations/`)
                  // }
                >
                  Save
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  onClick={resetForm}
                  htmlType="submit"
                  style={{ color: 'white', backgroundColor: 'orange' }}
                  type="default"
                >
                  Reset
                </Button>
              </Col>

              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  danger
                  onClick={() =>
                    router.push(
                      `/marriageRegistration/transactions/correctionByDepartment/`,
                    )
                  }
                >
                  Cancel
                </Button>
                {/* )} */}
                {/* {router.query.pageMode === "Add" && ( */}
              </Col>
            </Row>
          </Form>
        </Card>

        {/* newCard */}

        {/* <Card>
          <Form layout="vertical" form={correctionForm}>
            <Row>
              <Col xl={7}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={"applicationNumber"}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Application Number"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                  />
                </Form.Item>
              </Col>
              <Col xl={1}></Col>
              <Col xl={7}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  name={"remarks"}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Remarks"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                  />
                </Form.Item>
              </Col>
              <Col xl={1}></Col>
              <Col xl={4}>
                <Form.Item
                  label="Attach File"
                  name="attachFile"
                  rules={[
                    {
                      required: false,
                      message: "Please Upload Documents",
                    },
                  ]}
                >
                  <Input
                    // @ts-ignore
                    labelCol={{ xs: 8 }}
                    wrapperCol={{ xs: 8 }}
                    accept="image/*"
                    type={"file"}
                    name={"file"}
                    onChange={(e) => handleFile(e)}
                  ></Input>
                </Form.Item>
              </Col>
              <Col xl={1}></Col>
              <Col xl={7}>
                <Form.Item label="Generate Receipt">
                  <Button
                    htmlType="submit"
                    style={{ color: "white", backgroundColor: "orange" }}
                    type="default"
                  >
                    Print
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card> */}
      </BasicLayout>
    </div>
  )
}

export default Index
