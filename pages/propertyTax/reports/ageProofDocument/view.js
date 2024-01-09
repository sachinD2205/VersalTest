import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, Col, Form, message, Row, Select } from "antd";
import axios from "axios";
import urls from "/URLS/urls";
import { useRouter } from "next/router";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import KeyPressEvents from "../../../../util/KeyPressEvents";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

// ageProof fun
const AgeProofDocument = () => {
  const userToken = useGetToken();

  // Save Button - Disabled
  const [inputStateSave, setInputStateSave] = useState(false);

  const [selectData, setSelectData] = useState([
    {
      departmentName: "",
      serviceName: "",
    },
  ]);

  const router = useRouter();

  //
  const resetForm = () => {
    ageProofDocument.resetFields();
  };

  // add button
  const addForm = () => {
    alert("Add Function is Clicked !!!");
  };

  // const

  const [ageProofDocument] = Form.useForm();

  const handleSave = async () => {
    setInputStateSave(true);
    const allFields = ageProofDocument.getFieldsValue();
    let bodyForApi = {
      ...allFields,
      ...selectData,
    };
    await axios
      .post(
        //  `http://localhost:8090/cfc/api/ageProofDocument/saveAgeProofDocument`
        `${urls.BaseURL}/ageProofDocument/saveAgeProofDocument`,

        bodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        if (r.status == 200) {
          console.log(r.data);
          message.success("Data Saved !");
          // reset fields
          ageProofDocument.resetFields();
          router.push("/citizenFacilitationCenter/masters/ageProofDocument");
        }
      })
      .catch((error) => catchExceptionHandlingMethod(error, language));
  };

  console.log(inputStateSave);
  return (
    <div>
      <BasicLayout titleProp={"Age Proof Document"}>
        <Form
          title="ageProofDocument"
          form={ageProofDocument}
          layout="vertical"
          onFinish={handleSave}
        >
          <Row>
            <Col xl={3} lg={3} md={3}></Col>
            <Col xl={6} lg={6} md={6} sm={6} xs={24}>
              <Form.Item
                name={"departmentName"}
                label="Deparment Name"
                rules={[
                  {
                    required: true,
                    message: "Deparment Name Selection is Required !!!",
                  },
                ]}
              >
                <Select placeholder="Select Deparment Name">
                  <Select.Option value="Deparment Name 1">
                    deparment 1
                  </Select.Option>
                  <Select.Option value="Deparment Name 2">
                    deparment 2
                  </Select.Option>
                  <Select.Option value="Deparment Name 3">
                    deparment 3
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={3} lg={3} md={3}></Col>
            <Col xl={6} lg={6} md={6} sm={6} xs={24}>
              <Form.Item
                name={"serviceName"}
                label="Service Name"
                rules={[
                  {
                    required: true,
                    message: "Sevice Name Selection is Required !!!!",
                  },
                ]}
              >
                <Select placeholder="Select Service Name">
                  <Select.Option value="service1">Service 1</Select.Option>
                  <Select.Option value="service2">Service 2</Select.Option>
                  <Select.Option value="service3">Service 3</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/** Change in Check List */}
          <Row>
            <Col xl={3} lg={3} md={3}></Col>
            <Col xl={6} lg={6} md={6} sm={6} xs={24}>
              <Form.Item
                name={"documentChecklist"}
                rules={[
                  {
                    required: true,
                    message: "Document Check list is Required !!!",
                  },
                ]}
              >
                <TextField
                  required
                  id="standard-basic"
                  label="Document Check List"
                  variant="standard"
                  onKeyPress={KeyPressEvents.isInputChar}
                />
              </Form.Item>
            </Col>
            <Col xl={3} lg={3} md={3}></Col>
            <Col xl={6} lg={6} md={6} sm={6} xs={24}>
              <Form.Item
                name={"typeOfDocument"}
                rules={[
                  {
                    required: true,
                    message: "Type of Document is Required !!!",
                  },
                ]}
              >
                <TextField
                  required
                  id="standard-basic"
                  label="Type of Document"
                  variant="standard"
                  onKeyPress={KeyPressEvents.isInputChar}
                />
              </Form.Item>
            </Col>
          </Row>

          {/** Buttons */}
          <br />
          <Row>
            <Col sm={1} md={1} lg={1} xl={5}></Col>
            <Col xs={3} sm={1} md={1} lg={2} xl={2}>
              <Button type="primary" onClick={addForm}>
                Add New
              </Button>
            </Col>
            <Col xs={1} sm={1} md={1} lg={1} xl={1}></Col>
            <Col xs={3} sm={1} md={1} lg={2} xl={2}>
              <Button
                type="primary"
                disabled={inputStateSave}
                htmlType="submit"
              >
                Save
              </Button>
            </Col>
            <Col xs={1} xl={1} lg={1} md={1} sm={4}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button onClick={resetForm}>Reset</Button>
            </Col>
            <Col xs={1} xl={1} lg={1} md={1} sm={4}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}>
              <Button
                danger
                onClick={() => {
                  router.push(
                    `/citizenFacilitationCenter/masters/ageProofDocument`
                  );
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </BasicLayout>
    </div>
  );
};

export default AgeProofDocument;
