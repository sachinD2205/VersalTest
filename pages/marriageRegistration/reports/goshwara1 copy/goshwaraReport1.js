import {
  DeleteOutlined,
  EditTwoTone,
  EyeTwoTone,
  SearchOutlined,
} from '@ant-design/icons'
import { width } from '@mui/system'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Table,
} from 'antd'
import ColumnGroup from 'antd/lib/table/ColumnGroup'
import axios from 'axios'
import React, { useState } from 'react'
import { render } from 'react-dom'
import BasicLayout from '../../../../containers/Layout/BasicLayout'

// http://localhost:4000/marriageRegistration/reports/goshwara1/goshwaraReport1
// Goshwara Part – 1
const GoshwaraReport1 = () => {
  const [dataSource, setDataSource] = useState()

  // getAPI
  axios.get(`${urls.MR}/applicant/getapplicantDetails`).then((resp) => {
    console.log('Get API Called !!')
    setDataSource(
      resp.data.map((r, i) => ({
        srNo: i + 1,
        marriageDate: r.marriageDate,
        registrationNo: r.registrationNo,
        marriageRegistrarOfficeName: r.marriageRegistrarOfficeName,
        marriageDate: r.marriageDate,
        groomName: r.hFName + ' ' + r.hMName + ' ' + r.hLName,
        hAge: r.hAge,
        hAddressP: r.hAddressP,
        husbandSign: r.husbandSign,
        husbandPhoto: r.husbandPhoto,
        husbandThumb: r.husbandThumb,
        brideName: r.wFName + ' ' + r.wMName + ' ' + r.wLName,
        wAge: r.wAge,
        wAddressP: r.wAddressP,
        wifeSign: r.wifeSign,
        wifePhoto: r.wifePhoto,
        wifeThumb: r.wifeThumb,
        printDateandTime: r.printDateandTime,
        marriageRegistrar: r.marriageRegistrar,
        zoneOfficeName: r.zoneOfficeName,
        nameOfCorporation: r.nameOfCorporation,
      })),
    )
  })

  // view
  return (
    <div>
      <BasicLayout titleProp={'Goshwara 1'}>
        <Card>
          <div>
            <center>
              <h1>Goshwara 1</h1>
            </center>
            <br />
            <br />
            <Row>
              <Col xl={4} lg={4} md={4} sm={24} xs={24}></Col>
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  name={'fromDate'}
                  label="From Date "
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Date',
                    },
                  ]}
                >
                  <DatePicker
                  // disabled={inputState}
                  // defaultValue={dataInModal && moment(dataInModal.fromDate)}
                  // onChange={(e) => {
                  //   setDataInModal((preDataInModal) => ({
                  //     ...preDataInModal,
                  //     fromDate: moment(e).format('YYYY-MM-DD'),
                  //   }))
                  // }}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={3} md={3} sm={1}></Col>
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  name={'toDate'}
                  label="To Date "
                  rules={[
                    {
                      required: true,
                      message: 'Please Select Date',
                    },
                  ]}
                >
                  <DatePicker
                  // disabled={inputState}
                  // defaultValue={dataInModal && moment(dataInModal.toDate)}
                  // onChange={(e) => {
                  //   setDataInModal((preDataInModal) => ({
                  //     ...preDataInModal,
                  //     toDate: moment(e).format('YYYY-MM-DD'),
                  //   }))
                  // }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginBottom: '10px' }}>
              {/* <Col xl={1} lg={1} md={1} sm={1} xs={1}></Col>
          <Col xl={5} lg={5} md={5} sm={5} xs={5}>
            <Input
              type="text"
              placeholder="Search.."
              name="search"
              suffix={<SearchOutlined />}
            ></Input>
          </Col> */}

              <Col xl={22} lg={22} md={20} sm={18} xs={18}></Col>

              <Col xl={2} lg={2} md={2} sm={4} xs={4}>
                <Button type="primary">Print</Button>
              </Col>
            </Row>

            <Row>
              <br />
              <br />
              <Col xl={18} lg={18} md={18} sm={18} xs={18}></Col>

              <Col xl={5} lg={5} md={5} sm={5} xs={5}>
                <Input
                  type="text"
                  placeholder="Search.."
                  name="search"
                  suffix={<SearchOutlined />}
                ></Input>
              </Col>
            </Row>
          </div>
          <Table
            bordered
            dataSource={dataSource}
            pagination={{ pageSizeOptions: [10, 20, 50, 100] }}
            scroll={{ y: 350, x: 1900 }}
          >
            <columns
              dataIndex="marriageDate"
              title="Marriage Date"
              width="150px"
              align="center"
            ></columns>
            <columns
              dataIndex="registrationNo"
              title="Marriage Registration No."
              width="200px"
              align="center"
            ></columns>
            <columns
              dataIndex="marriageRegistrarOfficeName"
              title="Marriage Registrar Office Name"
              width="180px"
              align="center"
            ></columns>
            <columns
              dataIndex="marriageDate"
              title="Marriage Date"
              width="130px"
              align="center"
            ></columns>

            <ColumnGroup title="Groom Details">
              <columns
                dataIndex="groomName"
                title="Groom Name"
                width="200px"
                align="center"
              ></columns>
              <columns
                dataIndex="hAge"
                title="Age"
                width="70px"
                align="center"
              ></columns>
              <columns
                dataIndex="hAddressP"
                title="Address"
                width="150px"
                align="center"
              ></columns>
              <columns
                dataIndex="husbandSign"
                title="Sign"
                width="100px"
                align="center"
              ></columns>
              <columns
                dataIndex="husbandPhoto"
                title="Web-Photo"
                width="120px"
                align="center"
              ></columns>
              <columns
                dataIndex="husbandThumb"
                title="Thumb Impression"
                width="160px"
                align="center"
              ></columns>
            </ColumnGroup>

            <ColumnGroup title="Bride Details">
              <columns
                dataIndex="brideName"
                title="Bride Name"
                width="200px"
                align="center"
              ></columns>
              <columns
                dataIndex="wAge"
                title="Age"
                width="70px"
                align="center"
              ></columns>
              <columns
                dataIndex="wAddressP"
                title="Address"
                width="150px"
                align="center"
              ></columns>
              <columns
                dataIndex="wifeSign"
                title="Sign"
                width="100px"
                align="center"
              ></columns>
              <columns
                dataIndex="wifePhoto"
                title="Web-Photo"
                width="120px"
                align="center"
              ></columns>
              <columns
                dataIndex="wifeThumb"
                title="Thumb Impression"
                width="160px"
                align="center"
              ></columns>
            </ColumnGroup>

            <columns
              dataIndex="printDateandTime"
              title="Print Date and Time"
              width="170px"
              align="center"
            ></columns>
            <columns
              dataIndex="marriageRegistrar"
              title="Marriage Registrar"
              width="160px"
              align="center"
            ></columns>
            <columns
              dataIndex="zoneOfficeName"
              title="Zone Office Name"
              width="150px"
              align="center"
            ></columns>
            <columns
              dataIndex="nameOfCorporation"
              title="Name of Corporation"
              width="120px"
              align="center"
            ></columns>
            <columns
              title="Actions"
              width="100px"
              align="center"
              render={(_, record) => (
                <Space size="middle">
                  <EyeTwoTone
                    // onClick={() => showModalForView(record)}
                    style={{ color: 'violet', marginLeft: 12, marginTop: 10 }}
                  />
                </Space>
              )}
            />
          </Table>
        </Card>
      </BasicLayout>
    </div>
  )
}

export default GoshwaraReport1
