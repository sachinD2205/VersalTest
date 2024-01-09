import { DeleteOutlined, EditTwoTone, EyeTwoTone } from '@ant-design/icons'
// import {
//   // Button,
//   Card,
//   Col,
//   DatePicker,
//   Form,
//   Input,
//   message,
//   Modal,
//   Row,
//   Select,
//   Table,
// } from "antd";
// import {
//   Form,
// } from "antd";

// import { Button, Grid } from "@mui/material";
import { Button, Card, Grid, IconButton, Modal } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
// import urls from "../../../URLS/urls"
import urls from '../../../../URLS/urls'

import { Box, TextField } from '@mui/material'
import axios from 'axios'
import BasicLayout from '../../../../containers/Layout/BasicLayout'
import KeyPressEvents from '../../../../util/KeyPressEvents'
import { DataGrid } from '@mui/x-data-grid'

const Index = () => {
  const router = useRouter()
  const [dataSource, setDataSource] = useState([])
  // const [collection] = Form.useForm();
  // const [form] = Form.useForm();
  const [dataInModal, setDataInModal] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [okText, setOkText] = useState()
  const [ID, setID] = useState()
  const [inputState, setInputState] = useState('false')
  const [modalForDelete, setModalForDelete] = useState(false)
  const [recordId, setRecordId] = useState()

  const getCorrectionByDepartment = () => {
    axios
      .get(
        // ` ${urls.BaseURL}/CorrectionByDepartment/getCorrectionByDepartmentDetails`
        `${urls.CFCURL}/transaction/correctionByDepartment/getCorrectionByDepartmentDetails`
      )
      .then((r) => {
        console.log('res getCorrectionByDepartment', r)

        let _res = r.data.map((j, i) => {
          return {
            id: j.id,
            srNo: i + 1,
            applicationNo: j.applicationNo,
            remarks: j.remarks,
          }
        })

        setDataSource(_res)

        console.log('table values => ', dataSource, _res)
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
        .put(
          `${urls.BaseURL}/CorrectionByDepartment/updateCorrectionByDepartment`,
          parametersForEdit
        )
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
      .delete(
        `${urls.BaseURL}/CorrectionByDepartment/deleteCorrectionByDepartment/${recordId}`
      )
      .then((res) => {
        if (res.status == 200) {
          message.success('record Deleted !')
        }
        getCorrectionByDepartment()
      })
  }

  const cols = [
    {
      field: 'srNo',
      headerName: 'srNo',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'applicationNo',
      headerName: 'Application Number',
      flex: 1,
      align: 'center',
    },
    {
      field: 'remarks',
      headerName: 'Remarks',
      flex: 1,
      align: 'center',
    },

    {
      field: 'Actions',
      width: '56px',
      flex: 1,
      align: 'center',
      render: (record) => {
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
              <EditIcon style={{ color: '#556CD6' }} />
            </IconButton>
            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText('Update'),
                  setID(params.row.id),
                  //   setIsOpenCollapse(true),
                  setSlideChecked(true)
                setButtonInputState(true)
                console.log('params.row: ', params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == 'Y' ? (
                <ToggleOnIcon
                  style={{ color: 'green', fontSize: 30 }}
                  onClick={() => deleteById(params.id, 'N')}
                />
              ) : (
                <ToggleOffIcon
                  style={{ color: 'red', fontSize: 30 }}
                  onClick={() => deleteById(params.id, 'Y')}
                />
              )}
            </IconButton>
            {/* <Row>
              <Col>
                <EyeTwoTone
                  onClick={() => showModalForView(record)}
                  style={{ color: "violet" }}
                />
                <EditTwoTone onClick={() => showModalForEdit(record)} />
                <DeleteOutlined
                  onClick={() => deleteRecord(record)}
                  style={{ color: "red" }}
                />
              </Col>
            </Row> */}
          </>
        )
      },
    },
  ]

  return (
    <Box sx={{ margin: '100px' }}>
      {/* <BasicLayout titleProp={"none"}> */}
      <Grid container>
        <Grid item xs={10}></Grid>
        <Grid item xs={2}>
          <Button
            variant='outlined'
            endIcon={<AddIcon />}
            onClick={() =>
              router.push(`/common/transactions/correctionByDepartment/view`)
            }
          >
            Add New
          </Button>
        </Grid>
      </Grid>
      <DataGrid
        sx={{
          overflowY: 'scroll',

          '& .MuiDataGrid-virtualScrollerContent': {},
          '& .MuiDataGrid-columnHeadersInner': {
            backgroundColor: '#556CD6',
            color: 'white',
          },

          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
        density='compact'
        autoHeight={true}
        pagination
        paginationMode='server'
        // rowCount={data.totalRows}
        // rowsPerPageOptions={data.rowsPerPageOptions}
        // page={data.page}
        // pageSize={data.pageSize}
        rows={dataSource}
        columns={cols}
        onPageChange={(_data) => {
          getCorrectionByDepartment()
        }}
        onPageSizeChange={(_data) => {
          console.log('222', _data)
          // updateData("page", 1);
          getCorrectionByDepartment()
        }}
      />
    </Box>
    // <Box sx={{ border: "solid red", padding: "100px" }}>
    //   {/* <BasicLayout titleProp={"none"}> */}
    //     <Grid container>
    //       <Grid item xs={10}></Grid>
    //       <Grid item xs={2}>
    //         <Button
    //           endIcon={<AddIcon />}
    //           onClick={() =>
    //             router.push(`/common/transactions/correctionByDepartment/view`)
    //           }
    //         >
    //           Add New
    //         </Button>
    //       </Grid>
    //     </Grid>

    //   <Card>
    //     <Table
    //       bordered
    //       columns={cols}
    //       dataSource={dataSource}
    //       scroll={{ x: 400 }}
    //     />
    //   </Card>

    //   <Modal
    //     width={900}
    //     visible={isModalVisible}
    //     okText={okText}
    //     onCancel={handleCancelForModal}
    //     onOk={editForm}
    //   >
    //     <Form title="relegion" form={form} layout="vertical">
    //       <Row>
    //         <Col span={3}></Col>
    //         <Col span={5}>
    //           <Form.Item
    //             name="applicationNo"
    //             rules={[
    //               {
    //                 required: true,
    //               },
    //             ]}
    //           >
    //             <TextField
    //               required
    //               id="standard-basic"
    //               label="Application Number"
    //               variant="standard"
    //               disabled={inputState}
    //               onKeyPress={KeyPressEvents.isInputChar}
    //               defaultValue={dataInModal && dataInModal.applicationNo}
    //               onChange={(e) => {
    //                 setDataInModal((preDataInModal) => ({
    //                   ...preDataInModal,
    //                   applicationNo: e.target.value,
    //                 }));
    //               }}
    //             />
    //           </Form.Item>
    //         </Col>
    //         <Col span={3}></Col>
    //         <Col span={5}>
    //           <Form.Item
    //             name="remarks"
    //             rules={[
    //               {
    //                 required: true,
    //               },
    //             ]}
    //           >
    //             <TextField
    //               required
    //               id="standard-basic"
    //               label="Remarks"
    //               variant="standard"
    //               disabled={inputState}
    //               onKeyPress={KeyPressEvents.isInputChar}
    //               defaultValue={dataInModal && dataInModal.remarks}
    //               onChange={(e) => {
    //                 setDataInModal((preDataInModal) => ({
    //                   ...preDataInModal,
    //                   remarks: e.target.value,
    //                 }));
    //               }}
    //             />
    //           </Form.Item>
    //         </Col>
    //       </Row>
    //       <Row style={{ marginTop: 20 }}>
    //         <Col span={3}></Col>
    //         <Col span={6}>
    //           <Form.Item
    //             label="Attach File"
    //             // name="attachFile"
    //             name="attachFile"
    //             rules={[
    //               {
    //                 required: false,
    //                 message: "Please Upload Documents",
    //               },
    //             ]}
    //           >
    //             <Input
    //               // @ts-ignore
    //               labelCol={{ xs: 8 }}
    //               wrapperCol={{ xs: 8 }}
    //               accept="image/*"
    //               type={"file"}
    //               name={"file"}
    //               onChange={(e) => handleFile(e)}
    //               disabled={inputState}

    //               // value={pageType ? router.query.documentsUpload : ""}
    //               // disabled={router.query.pageMode === "View"}
    //             ></Input>
    //           </Form.Item>
    //         </Col>
    //         <Col xl={2} lg={2} md={2}></Col>
    //       </Row>
    //     </Form>
    //   </Modal>

    //   <Modal
    //     title={"Are Your Sure want to Delete ?"}
    //     visible={modalForDelete}
    //     okText={"yes"}
    //     okType="danger"
    //     cancelText={"no"}
    //     onCancel={onCancelForDelete}
    //     onOk={deleteForm}
    //   ></Modal>
    //   {/* </BasicLayout> */}
    // </Box>
  )
}
export default Index
