import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Paper,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import ReportLayout from "../NewReportLayout";
import styles from "./report.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const MonthlyGoshwara = () => {
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
  let language = useSelector((state) => state.labels.language);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu),
  );
  const [dataSource, setDataSource] = useState();
  const [zoneKeys, setZoneKeys] = useState([]);
  const [temp, setTemp] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [loaderState, setLoaderState] = useState(false);

  let router = useRouter();
  const {
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [route, setRoute] = useState(null);
  const backToHomeButton = () => {
    router.push({ pathname: "/marriageRegistration/dashboard" });
  };
  let user = useSelector((state) => state.user.user);
  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
      // zoneKey: temp,
    };
    setLoaderState(true);
    axios
      .post(`${urls.MR}/reports/monthlyGhoshwaraNew`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setLoaderState(false);
        setDataSource(
          r.data.monthlyGhoshwara.map((r, i) => {
            return { srNo: i + 1, ...r };
          }),
        );
        setShowTable(true);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getZoneKeys = async () => {
    await axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getZoneKeys();
  }, []);

  return (
    <>
      {loaderState ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // Adjust itasper requirement.
          }}
        >
          <Paper
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "white",
              borderRadius: "50%",
              padding: 8,
            }}
            elevation={8}
          >
            <CircularProgress color="success" />
          </Paper>
        </div>
      ) : (
        <>
          <Box>
            <BreadcrumbComponent />
          </Box>
          <Paper
            sx={{
              padding: "5vh",
              border: 1,
              borderColor: "grey.500",
            }}
          >
            <div className={styles.detailsTABLE}>
              <div className={styles.h1TagTABLE}>
                <h2
                  style={{
                    fontSize: "20",
                    color: "white",
                    marginTop: "7px",
                  }}
                >
                  {language === "en" ? menu.menuNameEng : menu.menuNameMr}
                </h2>
              </div>
            </div>

            <div className={styles.searchFilter} styles={{ marginTop: "50px" }}>
              {/* <FormControl
            variant="standard"
            sx={{ marginTop: 0, marginLeft: "5vh", marginRight: "5vh" }}
            error={!!errors.zoneKey}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="zone" required />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  // disabled={disabled}
                  // InputLabelProps={{
                  //   shrink:
                  //     (watch('zoneKey') ? true : false) ||
                  //     (router.query.zoneKey ? true : false),
                  // }}
                  autoFocus
                  sx={{ width: 230 }}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    // console.log("Zone Key: ", value.target.value)
                    setTemp(value.target.value);
                    setSelectedZone(
                      zoneKeys.find((z) => z.id == value.target.value),
                    );
                  }}
                  label="Zone Name *"
                >
                  {zoneKeys &&
                    zoneKeys.map((zoneKey, index) => (
                      <MenuItem key={index} value={zoneKey.id}>
                       

                        {language == "en"
                          ? zoneKey?.zoneName
                          : zoneKey?.zoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="zoneKey"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.zoneKey ? errors.zoneKey.message : null}
            </FormHelperText>
          </FormControl> */}

              <FormControl sx={{ marginTop: 1 }}>
                <Controller
                  control={control}
                  name="fromDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        maxDate={new Date()}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 14 }}>
                            {language === "en" ? "From Date" : "तारखेपासून"}
                          </span>
                        }
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                          setFromDate(moment(date).format("DD-MM-YYYY"));
                        }}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
              <FormControl sx={{ marginTop: 1, marginLeft: "5vh" }}>
                <Controller
                  control={control}
                  name="toDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        maxDate={new Date()}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 14 }}>
                            {language === "en" ? "To Date" : "आजपर्यंत"}
                          </span>
                        }
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                          setToDate(moment(date).format("DD-MM-YYYY"));
                        }}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
              </FormControl>
              {/* <Button variant='contained' onClick={getApplicationDetail} endIcon={<Search />}>
              
               {language === "en" ? "Search" : "शोधा"}
              </Button> */}
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "20px", marginTop: "2vh" }}
                onClick={getApplicationDetail}
              >
                {language === "en" ? "Search" : "शोधा"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ marginLeft: "20px", marginTop: "2vh" }}
                // style={{ float: "right" }}
                onClick={handlePrint}
              >
                {language === "en" ? "Print" : "प्रत काढा"}
              </Button>
            </div>

            <br />
            {showTable && (
              <div style={{ marginLeft: "50px" }}>
                <ReportLayout
                  centerHeader
                  centerData
                  // rows={table}
                  // columns={columnsPetLicense}
                  columnLength={10}
                  componentRef={componentRef}
                  showDates
                  date={{
                    from: moment(watch("fromDate")).format("DD-MM-YYYY"),
                    to: moment(watch("toDate")).format("DD-MM-YYYY"),
                  }}
                  // deptName={{
                  //   en: "Marriage Registration Management System",
                  //   mr: "पशुवैद्यकीय व्यवस्थापन प्रणाली",
                  // }}
                  // reportName={{
                  //   en: "गोषवारा भाग १",
                  //   mr: "गोषवारा भाग १",
                  // }}
                >
                  <ComponentToPrint
                    data={{
                      dataSource,
                      language,
                      ...menu,
                      route,
                      selectedZone,
                      fromDate,
                      toDate,
                    }}
                  />
                </ReportLayout>

                {/* <ComponentToPrint
            data={{
              dataSource,
              language,
              ...menu,
              route,
              selectedZone,
              fromDate,
              toDate,
            }}
            ref={componentRef}
          /> */}
              </div>
            )}
          </Paper>
        </>
      )}
    </>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px" }}>
          <div className="report">
            <Paper>
              <table className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>Monthly Goshwara</b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>प्रपत्र "अ" </b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={14}
                      style={{
                        textAlign: "left",
                        paddingLeft: "24px",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      }}
                    >
                      {/* <Row style={{ textAlign: 'left', paddingLeft: '25px' }}> */}
                      <div className="row">
                        {/* <Col span={10}> */}
                        <div className="col">
                          <b>
                            विभागाचे नाव -{" "}
                            {this.props.data.language == "en"
                              ? this.props.data.selectedZone?.zoneName
                              : this.props.data.selectedZone?.zoneNameMr}
                          </b>
                        </div>
                        {/* </Col> */}
                      </div>
                      {/* </Row> */}
                      {/* <Row style={{ textAlign: 'left', paddingLeft: '25px' }}> */}
                      <div className="row">
                        <div className="col">
                          {/* <Col span={25}> */}
                          विभागाच्या अधिनस्त सेवा पुरविण्याच्या शासकीय कार्यालय/
                          उपक्रम /प्राधिकरणाचे नाव पिंपरी चिचवड महानगरपलिका{" "}
                          {/* </Col>
                          </Row> */}
                        </div>
                      </div>

                      {/* <Row style={{ textAlign: 'left', paddingLeft: '25px' }}>
                        <Col span={10}> */}
                      <div className="row">
                        <div className="col">
                          अहवाल कालावधी (मासिक अहवाल)-{" "}
                          {this.props.data.fromDate}{" "}
                          {this.props.data.fromDate != null
                            ? this.props.data.language == "en"
                              ? "TO"
                              : "ते"
                            : ""}{" "}
                          {this.props.data.toDate}
                        </div>
                      </div>
                      {/* </Col>
                      </Row> */}
                      {/* <Row style={{ textAlign: 'left', paddingLeft: '25px' }}>
                        <Col span={15}> */}
                      <div className="row">
                        <div className="col">
                          लोकसेवा हक्क कायद्यांतर्गत अधिसूचित केलेल्या सेवांची
                          संख्या- 01
                        </div>
                      </div>
                      {/* </Col>
                  </Row> */}
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={14}>
                      <h3>
                        <b>
                          महाराष्ट्र लोकसेवा हक्क अधिनियम - २०१५ अंतर्गत
                          अधिसूचित लोकांसाठी प्राप्त अर्जाचा गोषवारा (सन 2020 -
                          2021){" "}
                        </b>
                      </h3>
                    </th>
                  </tr>
                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>अ.क्र</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>अधिसूचित सेवेचे नावं</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>अधिसूचित सेवेचा विहितकालावधी</b>
                    </th>
                    <th colSpan={3}>
                      <b>
                        प्राप्त अर्जाचा संख्या (ओनलाईन व ऑफलाईन दोन्ही प्रकारे
                        प्राप्त अर्ज)
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        प्राप्त अर्जांपैकी विहित कालावधीत सेवा देण्यात आलेल्या
                        अर्जाची संख्या
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {" "}
                        प्राप्त अर्जांपैकी विहित कालावधीत नंतर सेवा देण्यात
                        आलेल्या अर्जाची संख्या
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>विहित कालावधीत मधील प्रलंबित अर्जाची संख्या</b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>विहित कालावधीत नंतर प्रलंबित अर्जाची संख्या</b>
                    </th>

                    <th colSpan={3}>
                      <b>नामंजूर अर्जाची संख्या</b>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={1} rowSpan={4}>
                      ओनलाईन अर्जाची संख्या
                    </th>

                    <th colSpan={1} rowSpan={4}>
                      ऑफलाईन अर्जाची संख्या
                    </th>

                    <th colSpan={1} rowSpan={4}>
                      एकुण
                    </th>

                    <th colSpan={1} rowSpan={4}>
                      कारणसह नामंजूर अर्जाची संख्या
                    </th>

                    <th colSpan={1} rowSpan={4}>
                      कारण नमूद न करता नामंजूर केलेल्या अर्जाची संख्या
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td>
                    <td>11</td>
                    <td>12</td>
                  </tr>

                  {this?.props?.data?.dataSource?.map((r, i) => (
                    <tr>
                      <td>{r.srNo}</td>
                      <td>{r.serviceName}</td>
                      <td>{r.serviceDay}</td>
                      <td>{r.onlineCount}</td>
                      <td>{r.offlineCount}</td>
                      <td>{r.totalCount}</td>
                      <td>{r.serviceWithInDay}</td>
                      <td>{r.serviceNotWithInDay}</td>
                      <td>{r.pendingApplicationWithDay}</td>
                      <td>{r.serviceNotCompletedWithInDay}</td>
                      <td>{r.rejectedWithRemark}</td>
                      <td>{r.notRejectedWithRemark}</td>
                    </tr>
                  ))}
                  <tr>
                    <td
                      colSpan={14}
                      style={{
                        textAlign: "left",
                        paddingLeft: "24px",
                        paddingTop: "8px",
                        paddingBottom: "8px",
                      }}
                    >
                      <div className="row">
                        {/* <Row> */}
                        {/* <Col span={7}> */}
                        <div className="col">
                          <b>
                            टीप - प्रपत्र "ब" व प्रपत्र "क" ची माहिती निरंक आहे
                          </b>
                        </div>
                        {/* </Col> */}
                        {/* <Col span={9}></Col>
                        <Col span={7}> */}{" "}
                        <div className="col">
                          <b>
                            ज्येष्ठ वैद्यकीय अधिकारी तथा विवाह निबंधक व
                            <br /> क्षेत्रिय कार्यालय पिंपरी-चिंचवड , पुणे-३३.{" "}
                          </b>
                        </div>
                        {/* </Col> */}
                        {/* </Row> */}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default MonthlyGoshwara;
