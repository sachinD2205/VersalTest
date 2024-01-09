import { Button, FormControl, Paper, TextField } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import React, { useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useReactToPrint } from "react-to-print"
import urls from "../../../../URLS/urls"
import styles from "./report.module.css"
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout"
import { Search } from "@mui/icons-material"
import sweetAlert from "sweetalert"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const language = useSelector((state) => state?.labels?.language)

  const userToken = useGetToken()

  const {
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm()

  let router = useRouter()
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer")
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  )

  let selectedApplicationId = useSelector(
    (state) => state?.user?.selectedApplicationId
  )

  let applicationDtl = useSelector((state) =>
    state?.user?.user?.applications?.find(
      (af) => af.id == selectedApplicationId
    )
  )

  console.log("applicationDtl", applicationDtl)
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
  const [dataSource, setDataSource] = useState()

  const getApplicationDetail = () => {
    setDataSource([])

    axios
      .get(
        `${urls.NRMS}/reportsController/getAllByFromDateAndToDateRotationRequest`,
        {
          params: {
            fromDate: getValues("fromDate"),
            toDate: getValues("toDate"),
          },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        r?.data?.trnNewsPublishRequestList?.length > 0
          ? setDataSource(
              r?.data?.trnNewsPublishRequestList?.map((r, i) => {
                return {
                  srNo: i + 1,
                  ...r,
                  newsPublishRequestNo:
                    r.newsPublishRequestNo + ", " + r.newsAdvertisementSubject,
                }
              })
            )
          : sweetAlert(
              language === "en" ? "Info!" : "माहिती!",
              language === "en" ? "No data found" : "माहिती आढळली नाही",
              "info",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            )
      })
      .catch((error) => {
        callCatchMethod(error, language);
      })
  }

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const backToHomeButton = () => {
    router.push("/newsRotationManagementSystem/dashboard")
  }

  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr.No." : "अ.क्र.",
      width: 50,
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
      width: 150,
    },
    {
      field: "newsPublishRequestNo",
      headerName:
        language == "en"
          ? "News/Advertisement Request Number And Advertisement Subject"
          : "बातमी/जाहिरात विनंती क्रमांक आणि जाहिरात विषय",
      width: 150,
    },
    {
      field: "newsPublishDate",
      headerName: language == "en" ? "Published Date" : "प्रकाशित तारीख",
      width: 100,
    },
    {
      field: "rotationGroupName",
      headerName: language == "en" ? "Rotation Group" : "रोटेशन ग्रुप",
      width: 80,
    },
    {
      field: language == "en" ? "newsPapersNames" : "newsPapersNamesMr",
      headerName:
        language == "en"
          ? "News Paper Names"
          : "वर्तमानपत्रे/साप्ताहिके यांची नावे",
      width: 170,
    },
  ]

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper style={{ padding: "10px" }}>
        {/* <div style={{ padding: 10 }}> */}
        <div>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            {language === "en" ? "Print" : "प्रत काढा"}
          </Button>
          <p>
            <center>
              <h1>
                {
                  language === "en"
                    ? menu?.menuNameEng /* "Application Details Report" */
                    : menu?.menuNameMr /* "अर्ज तपशील अहवाल" */
                }
              </h1>
            </center>
          </p>
          <Button
            onClick={backToHomeButton}
            variant="contained"
            color="primary"
            style={{ marginTop: "-100px" }}
          >
            {language === "en" ? "Back To home" : "मुखपृष्ठ"}
          </Button>
        </div>

        {/* <center>
          <h1>Application Details Report</h1>
        </center> */}
        <div className={styles.centerDiv} style={{ gap: 25 }}>
          <FormControl>
            <Controller
              control={control}
              name="fromDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disableFuture
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 14 }}>
                        {language === "en" ? "From Date" : "पासून"}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
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
          <FormControl>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disableFuture
                    disabled={watch("fromDate") ? false : true}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 14 }}>
                        {language === "en" ? "To Date" : "पर्यंत"}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) =>
                      field.onChange(moment(date).format("YYYY-MM-DD"))
                    }
                    selected={field.value}
                    center
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        fullWidth
                        InputLabelProps={{
                          style: {
                            fontSize: 12,
                            marginTop: 3,
                          },
                        }}
                      />
                    )}
                    minDate={watch("fromDate")}
                  />
                </LocalizationProvider>
              )}
            />
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Search />}
            onClick={getApplicationDetail}
          >
            {language === "en" ? "Search" : "शोधा"}
          </Button>
        </div>
        {/* <Row>
            <Col xl={4} lg={4} md={4} sm={24} xs={24}></Col>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Ward
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  name="online"
                  label="online"
                >
                  <MenuItem value="">
                    <em>Choose a ward</em>
                  </MenuItem>
                  {wards &&
                    wards.map((ward, index) => (
                      <MenuItem key={index} value={ward.wardName}>
                        {ward.wardName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Col>

            <Col xl={3} lg={3} md={3} sm={1}></Col>
            <Col xl={6} lg={6} md={6} sm={24} xs={24}>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Zone
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  //value={online}
                  name="online"
                  //onChange={handleChange}
                  label="online"
                >
                  <MenuItem value="">
                    <em>Choose a zone</em>
                  </MenuItem>
                  {zones &&
                    zones.map((zone, index) => (
                      <MenuItem key={index} value={zone.zoneName}>
                        {zone.zoneName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Col>
            <br />
          </Row>
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
                <DatePicker/>
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
                />
              </Form.Item>
            </Col>

            <Col xl={1} lg={1} md={1} sm={1} xs={1} />
            <Col
              xl={2}
              lg={2}
              md={2}
              sm={2}
              xs={2}
              style={{ marginTop: '30px' }}
            >
              <Button
                onClick={() => {
                  if (wards) {
                    getApplicationDetail()
                  } else if (wards == null) {
                    message.info('Please Select all field')
                  }
                }}
                type="primary"
              >
                Search
              </Button>
            </Col>
          </Row> */}
        {/* <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            color="primary"
            type="primary"
            style={{ float: 'right' }}
            onClick={handlePrint}
          >
            print
          </Button>
          <Button
            onClick={backToHomeButton}
            type="primary"
            variant="contained"
            color="primary"
          >
            back To home
          </Button>
        </div> */}

        {/* <ComponentToPrint
          ref={componentRef}
          dataToMap={{ dataSource, language, menu }}
        /> */}
        {/* <div style={{ marginRight: "5" }}> */}
        {/* <ReportLayout
          centerHeader
          centerData
          columnLength={10}
          componentRef={componentRef}
          showDates={
            watch('fromDate') != null && watch('toDate') != null ? true : false
          }
          date={{
            from:
              watch('fromDate') != null
                ? moment(watch('fromDate')).format('DD-MM-YYYY') ==
                  'Invalid date'
                  ? null
                  : moment(watch('fromDate')).format('DD-MM-YYYY')
                : null,
            to:
              watch('toDate') != null
                ? moment(watch('toDate')).format('DD-MM-YYYY') == 'Invalid date'
                  ? null
                  : moment(watch('toDate')).format('DD-MM-YYYY')
                : null,
          }}
        >
          <ComponentToPrint dataToMap={{ dataSource, language, menu }} />
        </ReportLayout> */}

        <div className={styles.centerDiv}>
          <ReportLayout
            style={{
              marginTop: "4vh",
              boxShadow: "0px 2px 10px 0px rgba(0,0,0,0.75)",
            }}
            componentRef={componentRef}
            centerHeader
            centerData
            showDates={!!watch("fromDate") && !!watch("toDate")}
            date={{
              from: !!watch("fromDate")
                ? moment(watch("fromDate")).format("DD-MM-YYYY")
                : "",
              to: !!watch("toDate")
                ? moment(watch("toDate")).format("DD-MM-YYYY")
                : "",
            }}
            // rows={this?.props?.dataToMap?.dataSource}
            rows={dataSource}
            columns={columns}
          />
        </div>
        {/* </div> */}
      </Paper>
    </>
  )
}
class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div style={{ padding: "13px", width: "auto" }}>
          <div className="report">
            <Paper>
              <table className={styles.report_table}>
                <thead>
                  {/* <tr>
                    <th colSpan={30}>
                      <h3>
                        <b>Application Form Report</b>
                      </h3>
                    </th>
                  </tr> */}
                  {/* <tr>
                    <th colSpan={30}>
                      <h3>
                        <b>
                          {this?.props?.dataToMap?.language === "en"
                            ? this?.props?.dataToMap[0]?.zone?.zoneName
                            : this.props.dataToMap[0]?.zone.zoneNameMr}
                        </b>
                      </h3>
                    </th>
                  </tr> */}
                  <tr>
                    <th colSpan={30}>
                      <h3>
                        <b>
                          {this?.props?.dataToMap?.language === "en"
                            ? this?.props?.dataToMap?.menu?.menuNameEng
                            : this?.props?.dataToMap?.menu?.menuNameMr}
                        </b>
                      </h3>
                    </th>
                  </tr>

                  <tr>
                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Sr.No."
                          : "अ.क्र."}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Department Name"
                          : "विभागाचे नाव"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "News/Advertisement Request Number And Advertisement Subject"
                          : "बातमी/जाहिरात विनंती क्रमांक आणि जाहिरात विषय"}{" "}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Published Date"
                          : "प्रकाशित तारीख"}{" "}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Rotation Group"
                          : "रोटेशन ग्रुप"}{" "}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "News Paper Names"
                          : "वर्तमानपत्रे/साप्ताहिके यांची नावे"}
                      </b>
                    </th>

                    {/* <th rowSpan={4} colSpan={1} style={{ width: "8%" }}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Date"
                        : "दिनांक"}
                    </th>

                    <th rowSpan={4} colSpan={1} style={{ width: "8%" }}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Signature"
                        : "स्वाक्षरी"}
                    </th>

                    <th rowSpan={4} colSpan={1} style={{ width: "10%" }}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Remark"
                        : "शेरा"}
                    </th>

                    <th rowSpan={4} colSpan={1} style={{ width: "8%" }}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Rotation Received Sign"
                        : "रोटेशन मिळाल्याची सही"}
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6}>No data</td>

                    {/* <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>10</td> */}
                  </tr>

                  {/* {this.props.dataToMap.dataSource &&
                    this.props.dataToMap.dataSource.map((r, i) => (
                      <tr key={i}>
                        <td>{r.srNo}</td>
                        <td>
                          {this.props.dataToMap.language == "en"
                            ? r.departmentName
                            : r.departmentNameMr}
                        </td>
                        <td>
                          {r.newsPublishRequestNo}
                          <br />
                          {r.newsAdvertisementSubject}
                        </td>
                        <td>{r.newsPublishDate}</td>
                        <td>
                          {this.props.dataToMap.language == "en"
                            ? r.rotationGroupName + "-" + r.rotationSubGroupName
                            : r.rotationGroupNameMr +
                              "-" +
                              r.rotationSubGroupNameMr}
                        </td>
                        <td>
                          {this.props.dataToMap.language == "en"
                            ? r.newsPapersNames
                            : r.newsPapersNamesMr}
                        </td>
                      </tr>
                    ))} */}

                  {/* <td></td>
                        <td></td>
                        <td></td>
                        <td></td> */}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    )
  }
}
export default Index
