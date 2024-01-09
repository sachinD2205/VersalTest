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
import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import BasicLayout from '../../../../containers/Layout/BasicLayout'

// http://localhost:4001/marriageRegistration/reports/goshwara2/goshwaraReport2
// Goshwara Part – 2
const GoshwaraReport2 = () => {
  const [dataSource, setDataSource] = useState()

  // getAPI
  const getGoshwaraReport = () => {
    axios.get(`${urls.MR}/applicant/getapplicantDetails`).then((r) => {
      console.log('Get API Called !!')
      setDataSource(
        r.data.map((r, i) => ({
          srNo: i + 1,
          witnessFName: r.hFName,
        })),
      )
    })
  }

  // UseEffect
  useEffect(() => {
    getGoshwaraReport()
  }, [])

  // view
  return (
    <div>
      <BasicLayout titleProp={'Goshwara 2'}>
        <Card>
          <div>
            <center>
              <h1>Goshwara 2</h1>
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
              dataIndex="marriageRegistrationNo"
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
              dataIndex="witnessFName"
              title="Marriage Date"
              width="130px"
              align="center"
            ></columns>

            <ColumnGroup title="Witnes Details-1">
              <columns
                dataIndex="witnes1Name"
                title="Name"
                width="200px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes1Age"
                title="Age"
                width="70px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes1Address"
                title="Address"
                width="150px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes1Sign"
                title="Sign"
                width="100px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes1WebPhoto"
                title="Web-Photo"
                width="120px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes1Impression"
                title="Thumb Impression"
                width="160px"
                align="center"
              ></columns>
            </ColumnGroup>

            <ColumnGroup title="Witnes Details-2">
              <columns
                dataIndex="witnes2Name"
                title="Bride Name"
                width="200px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes2Age"
                title="Age"
                width="70px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes2Address"
                title="Address"
                width="150px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes2Sign"
                title="Sign"
                width="100px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes2Photo"
                title="Web-Photo"
                width="120px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes2ThumbImpression"
                title="Thumb Impression"
                width="160px"
                align="center"
              ></columns>
            </ColumnGroup>

            <ColumnGroup title="Witnes Details-3">
              <columns
                dataIndex="witnes3Name"
                title="Bride Name"
                width="200px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes3Age"
                title="Age"
                width="70px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes3Address"
                title="Address"
                width="150px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes3Sign"
                title="Sign"
                width="100px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes3Photo"
                title="Web-Photo"
                width="120px"
                align="center"
              ></columns>
              <columns
                dataIndex="witnes3ThumbImpression"
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
                    onClick={() => showModalForView(record)}
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

export default GoshwaraReport2
