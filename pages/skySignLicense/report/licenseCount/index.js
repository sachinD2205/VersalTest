import { EyeTwoTone, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  //   DatePicker,
  Form,
  Input,
  Row,
  //   Select,
  Table,
} from "antd";
import React, { useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import TextField from "@mui/material/TextField";
import KeyPressEvents from "../../../../util/KeyPressEvents";
import styles from "../../../../styles/skysignstyles/licensecountreport.module.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Index = () => {
  const [dataSource, setDataSource] = useState();
  const [value, setValue] = React.useState(null);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <>
      <BasicLayout titleProp={"none"}>
        <Card>
          <Row>
            <Col xl={9}></Col>
            <Col>
              <h1>License Count Details</h1>
            </Col>
          </Row>

          <Row style={{ marginTop: 40 }}>
            <Col xl={1}></Col>
            <Col xl={6}>
              <Form.Item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From Date"
                    InputLabelProps={{ style: { fontSize: 5 } }}
                    InputProps={{ style: { fontSize: 12 } }}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ width: "60%", height: "50px" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Form.Item>
            </Col>

            {/* <Col xl={1}></Col> */}

            <Col xl={6}>
              <Form.Item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To Date"
                    InputLabelProps={{ style: { fontSize: 5 } }}
                    InputProps={{ style: { fontSize: 12 } }}
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ width: "60%", height: "50px" }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Form.Item>
            </Col>

            {/* <Col xl={1}></Col> */}

            <Col xl={2}>
              <Button type="primary">Search</Button>
            </Col>
            <Col>
              <Button type="primary">Print</Button>
            </Col>
          </Row>
        </Card>

        <ComponentToPrint dataToMap={dataSource} />
      </BasicLayout>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Card style={{ width: "100%" }}>
              {/* <Row>
                <Button>Print</Button>
              </Row> */}
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>License Count Details</b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>Sr.No.</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>License Type </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>License Status</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>From date</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>To date</b>
                    </th>

                    {/* <th rowSpan={4} colSpan={1}>
                      <b>Total </b>
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    {/* <td>6</td> */}
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
export default Index;
