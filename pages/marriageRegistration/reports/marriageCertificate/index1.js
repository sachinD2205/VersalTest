import { SearchOutlined } from "@ant-design/icons";
import { width } from "@mui/system";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import { Button, Card, Col, DatePicker, Form, Input, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./report.module.css";

// url http://localhost:4001/marriageRegistration/reports/marriageCertificate/marriageCertificateReport
// Marriage Certificate Form
const MarriageCertificateReport = () => {
  const [dataSource, setDataSource] = useState();

  //    // getAPI
  //    const getMarriageCertificateReport = () => {

  //     axios.get(`http://localhost:4001/marriageRegistration/`).then(
  //      (resp) => {
  //        console.log('Get API Called !!')
  //        setDataSource(
  //         resp.data.map(
  //            (r,i) => ({
  //              srNo:i+1,
  //              rf:r+1,
  //            })
  //          )
  //        )
  //      }
  //    )
  //   }

  //   // UseEffect
  //   useEffect(() => {
  //    getMarriageCertificateReport()
  //  }, [])

  //   const cols = [
  //     {
  //       dataIndex: 'srNO',
  //       title: 'Sr.No',
  //       align:'center',
  //       width:'10px'
  //     },
  //     {
  //       dataIndex: 'marriageDate',
  //       title: 'Marriage Date',

  //       align:'center'

  //     },
  //     {
  //       dataIndex: 'marriageRegistrationNo',
  //       title: 'Marriage Registration No.',
  //       align:'center'
  //     },

  //     {
  //       title: "Actions",
  //       width: "120px",
  //       align:'center',
  //       render: (record) => {
  //         // Action Buttons
  //         return (
  //           <>
  //             <Row>
  //               <Col>
  //                 {/** View Action Button  */}
  //                 <EyeTwoTone
  //                 //  onClick={() => showModalForView(record)}
  //                   style={{ color: "violet", marginLeft: 12, marginTop: 10, marginRight:10 }}
  //                 />
  //               </Col>
  //             </Row>
  //           </>
  //         );
  //       },
  //     },

  //   ]

  return (
    <div>
      <BasicLayout titleProp={"Marriage Certificate"}>
        <Card>
          <div>
            <center>
              <h1>Marriage Certificate</h1>
            </center>
            <br />
            <br />
            <Row>
              <Col xl={4} lg={4} md={4} sm={24} xs={24}></Col>
              <Col xl={6} lg={6} md={6} sm={24} xs={24}>
                <Form.Item
                  name={"fromDate"}
                  label="From Date "
                  rules={[
                    {
                      required: true,
                      message: "Please Select Date",
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
                  name={"toDate"}
                  label="To Date "
                  rules={[
                    {
                      required: true,
                      message: "Please Select Date",
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
            <Row style={{ marginBottom: "10px" }}>
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
          {/* <Table bordered columns={cols} dataSource={dataSource} /> */}
        </Card>
        <ComponentToPrint dataToMap={dataSource} />
      </BasicLayout>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Card>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>Marriage Certificate Report</b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>Sr. No.</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Marriage Date</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>Marriage Registration No.</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                  </tr>
                  {/* {this.props.dataToMap.map((r, i) => (
                    <tr>
                      <td></td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </>
    );
  }
}

export default MarriageCertificateReport;
