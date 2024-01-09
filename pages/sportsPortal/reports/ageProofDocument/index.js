import { DeleteOutlined, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import TextField from "@mui/material/TextField";
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import axios from "axios";
import URLS from "../../../../URLS/urls";
import { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import KeyPressEvents from "../../../../util/KeyPressEvents";
import { useRouter } from "next/dist/client/router";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";

const Index = () => {
  const router = useRouter();
  const [dataSource, setDataSource] = useState();
  const [inputState, setInputState] = useState("false");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [okText, setOkText] = useState();
  const [dataInModal, setDataInModal] = useState("");
  const [ID, setID] = useState();
  const [modalForDelete, setModalForDelete] = useState(false);
  const [recordId, setRecordId] = useState();
  const [ageProofDocumentViewEdit] = Form.useForm();
  const language = useSelector((state) => state?.labels.language);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  // getAPI
  const getAgeProofDocumentDetails = () => {
    axios
      .get(`${urls.BaseURL}/ageProofDocument/getAgeProofDocumentDetails`)
      .then((r) => {
        setDataSource(
          r.data.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            departmentName: j.departmentName,
            serviceName: j.serviceName,
            documentChecklist: j.documentChecklist,
            typeOfDocument: j.typeOfDocument,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // useEffect
  useEffect(() => {
    getAgeProofDocumentDetails();
  }, []);

  // view
  const showModalForView = (record) => {
    console.log(`Record   ${record}`);
    setDataInModal({
      id: record.id,
      departmentName: record.departmentName,
      serviceName: record.serviceName,
      documentChecklist: record.documentChecklist,
      typeOfDocument: record.typeOfDocument,
    });
    setInputState(true);
    setIsModalVisible(true);
    setOkText("Okay");
  };

  // Edit-View
  const showModalForEdit = (record) => {
    ageProofDocumentViewEdit.resetFields();
    setDataInModal({
      id: record.id,
      departmentName: record.departmentName,
      serviceName: record.serviceName,
      documentChecklist: record.documentChecklist,
      typeOfDocument: record.typeOfDocument,
    });
    setInputState(false);
    setIsModalVisible(true);
    setOkText("Save");
    setID(record.id);
  };

  // Edit - Save
  const editForm = async () => {
    const parametersForEdit = {
      id: ID,
      departmentName: dataInModal.departmentName,
      serviceName: dataInModal.serviceName,
      documentChecklist: dataInModal.documentChecklist,
      typeOfDocument: dataInModal.typeOfDocument,
    };
    if (okText === "Save") {
      await axios
        .put(
          // `${URLS.CFCURL}/ageProofDocument/updateAgeProofDocument`,
          `${URLS.CFCURL}/ageProofDocument/updateAgeProofDocument`,

          parametersForEdit,
        )
        .then((res) => {
          if (res.status === 200) {
            message.success("Data Updated !");
            setIsModalVisible(false);
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (okText === "Okay") {
      setIsModalVisible(false);
    }
    getAgeProofDocumentDetails();
  };

  // delete Api
  const deleteRecord = (record) => {
    setRecordId(record.id);
    setModalForDelete(true);
    console.log(`id ${record.id}`);
  };
  const deleteForm = async (record) => {
    setModalForDelete(false);
    console.log(`${record.id}`);
    await axios
      .delete(
        `${urls.BaseURL}/ageProofDocument/deleteAgeProofDocument/${recordId}`,
      )
      .then((res) => {
        if (res.status == 200) {
          message.success("Record Deleted !");
        }
        getAgeProofDocumentDetails();
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // View Cancell Button Fun
  const handleCancelForModal = () => {
    getAgeProofDocumentDetails();
    setIsModalVisible(false);
  };

  // cancell delete
  const onCancelForDelete = () => {
    setModalForDelete(false);
  };

  const cols = [
    {
      title: "SrNo",
      dataIndex: "srNo",
    },
    {
      title: "Deparment Name",
      dataIndex: "departmentName",
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
    },
    {
      title: "Document Check List",
      dataIndex: "documentChecklist",
    },
    {
      title: "Type of Document",
      dataIndex: "typeOfDocument",
    },
    {
      title: "Actions",
      width: "120px",
      render: (record) => {
        // Action Buttons
        return (
          <>
            <Row>
              <Col>
                {/** View Action Button  */}
                <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{
                    color: "violet",
                    marginLeft: 12,
                    marginTop: 10,
                    marginRight: 10,
                  }}
                />

                {/** View Edit Button  */}
                <EditTwoTone onClick={() => showModalForEdit(record)} />

                {/** View Delete Button  */}
                <DeleteOutlined
                  onClick={() => deleteRecord(record)}
                  style={{ color: "red", marginLeft: 12 }}
                />
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  return (
    <BasicLayout titleProp={"none"}>
      <Card>
        <div style={{ display: "flex", justifyContent: "right" }}>
          <Button
            type="primary"
            onClick={() => {
              router.push(
                `/citizenFacilitationCenter/masters/ageProofDocument/view`,
              );
            }}
          >
            Add{" "}
          </Button>{" "}
          <br />
          <br />
        </div>
        <Table bordered columns={cols} dataSource={dataSource} />

        <Modal
          width={1000}
          visible={isModalVisible}
          okText={okText}
          onCancel={handleCancelForModal}
          onOk={editForm}
        >
          <Form
            title="ageProofDocument"
            form={ageProofDocumentViewEdit}
            layout="vertical"
          >
            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name={"departmentName"}
                  label="Deparment Name"
                  disabled={inputState}
                  rules={[
                    {
                      required: true,
                      message: "Deparment Name Selection is Required !!!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Deparment Name"
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.departmentName}
                    onSelect={(value) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        departmentName: value,
                      }));
                    }}
                  >
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

              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name={"serviceName"}
                  label="Service Name"
                  rules={[
                    {
                      required: true,
                      message: "Sevice Name Selection is Required !!!!",
                    },
                  ]}
                  disabled={inputState}
                >
                  <Select
                    placeholder="Select Service Name"
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.serviceName}
                    onSelect={(value) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        serviceName: value,
                      }));
                    }}
                  >
                    <Select.Option value="service1">Service 1</Select.Option>
                    <Select.Option value="service2">Service 2</Select.Option>
                    <Select.Option value="service3">Service 3</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name={"documentChecklist"}
                  rules={[
                    {
                      required: true,
                      message: "Document Check list is Required !!!",
                    },
                  ]}
                  disabled={inputState}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Document Check List"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.documentChecklist}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        documentChecklist: e.target.value,
                      }));
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xl={2} lg={2} md={2}></Col>
              <Col xl={11} lg={11} md={11} sm={24} xs={24}>
                <Form.Item
                  name={"typeOfDocument"}
                  rules={[
                    {
                      required: true,
                      message: "Type of Document is Required !!!",
                    },
                  ]}
                  disabled={inputState}
                >
                  <TextField
                    required
                    id="standard-basic"
                    label="Type of Document"
                    variant="standard"
                    onKeyPress={KeyPressEvents.isInputChar}
                    disabled={inputState}
                    defaultValue={dataInModal && dataInModal.typeOfDocument}
                    onChange={(e) => {
                      setDataInModal((preDataInModal) => ({
                        ...preDataInModal,
                        typeOfDocument: e.target.value,
                      }));
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          title={"Are Your Sure want to Delete ?"}
          visible={modalForDelete}
          okText={"Yes"}
          okType="danger"
          cancelText={"No"}
          onCancel={onCancelForDelete}
          onOk={deleteForm}
        ></Modal>
      </Card>
    </BasicLayout>
  );
};
export default Index;
