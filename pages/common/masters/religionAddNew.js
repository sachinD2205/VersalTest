import React from "react";
import { useRouter } from "next/router";

import BasicLayout from "../../../containers/Layout/BasicLayout";
import {
  Form,
  Input,
  Card,
  Row,
  Col,
  Select,
  Upload,
  Button,
  DatePicker,
  Space,
  message,
} from "antd";
import KeyPressEvents from "../../../util/KeyPressEvents";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useState } from "react";
// import urls from "../../../../URLS/urls";
import urls from "../../../URLS/urls";

const ReligionAdd = () => {
  const router = useRouter();
  const [religionForm] = Form.useForm();

  const resetForm = () => {
    religionForm.resetFields();
  };

  const handleSave = async () => {
    const allFields = religionForm.getFieldsValue();
    console.log(allFields);
    let bodyForApi = {
      ...allFields,
    };
    await axios
      .post(
        // "http://localhost:8080/mr/api/religion/saveReligion",
        `${urls.BaseURL}/religion/saveReligion`,
        bodyForApi
      )
      .then((r) => {
        if (r.status == 200) {
          message.success("Data Saved !");
          religionForm.resetFields();
          router.push("/marriageRegistration/master/religion");
        }
      });
  };

  return (
    <>
      <>
        <Card>
          <Row>
            <Col xl={11} lg={11} md={11} sm={11} xs={24}></Col>
            <Col xl={4} lg={4} md={4} sm={4} xs={24}>
              <h3>Religion</h3>
            </Col>
          </Row>
        </Card>

        <Form layout="vertical" form={religionForm} onFinish={handleSave}>
          <Card>
            <Row>
              <Col xl={6} lg={6} md={5} sm={5}></Col>
              <Col xl={4} lg={6} md={6} sm={6} xs={24}>
                <Form.Item
                  // labelCol={{ sm: 20 }}
                  // label="Sr. No."
                  name="srNo"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Serial No",
                    },
                    // {
                    //   type: "",
                    //   max: 10,
                    //   message: "Board Namr shoud be upto 11 numbers",
                    // },
                  ]}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Sr. No"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputNumber}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={3} md={3} sm={4}></Col>

              <Col xl={4} lg={6} md={6} sm={6} xs={24}>
                <Form.Item
                  // label="Religion"
                  name="religion"
                  rules={[
                    {
                      required: true,
                      message: "Please Enter Religion",
                    },
                    // {
                    //   type: "",
                    //   max: 10,
                    //   message: "Board Namr shoud be upto 11 numbers",
                    // },
                  ]}
                >
                  {/* <Input
                    type="text"
                    onKeyPress={KeyPressEvents.isInputChar}
                  ></Input> */}
                  <TextField
                    required
                    id="standard-basic"
                    label="Religion"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Buttons */}
            <Row style={{ marginTop: 30 }}>
              <Col sm={6} md={7} lg={7} xl={8}></Col>
              <Col xs={1} sm={1} md={1} lg={2} xl={2}>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Col>
              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  onClick={resetForm}
                  htmlType="submit"
                  style={{ color: "white", backgroundColor: "orange" }}
                  type="default"
                >
                  Reset
                </Button>
              </Col>

              <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
              <Col xl={2} lg={2} md={1} sm={1} xs={1}>
                <Button
                  danger
                  onClick={() => router.push(`/marriageRegistration/master`)}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      </>
    </>
  );
};

export default ReligionAdd;
