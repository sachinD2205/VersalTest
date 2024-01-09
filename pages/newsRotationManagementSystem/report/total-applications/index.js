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
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
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
  let language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()
  // const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState()
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
  const [table, setTable] = useState([])

  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
    }

    axios
      .get(`${urls.NRMS}/reportsController/getTotalCount`, {
        params: {
          fromDate: getValues("fromDate"),
          toDate: getValues("toDate"),
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setData(r.data)
        setTable([
          // @ts-ignore
          {
            id: 1,
            srNo: 1,
            processName: "Count Of News Rotation",
            processNameMr: "बातम्या रोटेशनची संख्या",
            count: r.data.newsPublishRequest,
          },
          // @ts-ignore
          {
            id: 2,
            srNo: 2,
            processName: "Count Of Advertisement Rotation",
            processNameMr: "जाहिरात रोटेशनची संख्या",
            count: r.data.advertisementPublishRequest,
          },
          // @ts-ignore
          {
            id: 3,
            srNo: 3,
            processName: "Count Of Press Note",
            processNameMr: "प्रेस नोटची संख्या",
            count: r.data.pressNoteRequest,
          },
        ])
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
      width: 100,
    },
    {
      field: language == "en" ? "processName" : "processNameMr",
      headerName: language == "en" ? "Process Name" : "प्रोसेसचे नाव",
      width: 400,
    },
    {
      field: "count",
      headerName: language == "en" ? "Process Count" : "प्रोसेसची संख्या",
      width: 200,
    },
  ]

  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      <Paper>
        <div style={{ padding: 10 }}>
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
        <div className={styles.searchFilter} styles={{ marginTop: "50px" }}>
          <FormControl sx={{ marginTop: 0 }}>
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
          <FormControl sx={{ marginTop: 0, marginLeft: "5vh" }}>
            <Controller
              control={control}
              name="toDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disableFuture
                    inputFormat="DD/MM/YYYY"
                    disabled={watch("fromDate") ? false : true}
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
            style={{ marginLeft: "4px" }}
            onClick={getApplicationDetail}
          >
            {language === "en" ? "Search" : "शोधा"}
          </Button>
        </div>

        {/* <div style={{ marginLeft: '20%' }}>
          <ReportLayout
            centerHeader
            centerData
            columnLength={3}
            componentRef={componentRef}
            showDates={
              watch('fromDate') != null && watch('toDate') != null
                ? true
                : false
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
                  ? moment(watch('toDate')).format('DD-MM-YYYY') ==
                    'Invalid date'
                    ? null
                    : moment(watch('toDate')).format('DD-MM-YYYY')
                  : null,
            }}
          >
            <ComponentToPrint dataToMap={{ ...data, language, menu }} />
          </ReportLayout>
        </div> */}

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
            rows={table}
            columns={columns}
          />
        </div>

        {/* <ComponentToPrint
          ref={componentRef}
          dataToMap={{ ...data, language, menu }}
        /> */}
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
                      {this?.props?.dataToMap?.language === "en"
                        ? "Sr.No"
                        : "अं.क्र"}
                    </th>
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Process Name"
                        : "प्रोसेसचे नाव"}
                    </th>
                    <th rowSpan={4} colSpan={1}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Process Count"
                        : "प्रोसेसची संख्या"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Count Of News Rotation"
                        : "बातम्या रोटेशनची संख्या"}
                    </td>
                    <td>{this?.props?.dataToMap?.newsPublishRequest}</td>
                  </tr>
                  <tr>
                    {" "}
                    <td>2</td>
                    <td>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Count Of Advertisement Rotation"
                        : "जाहिरात रोटेशनची संख्या"}
                    </td>
                    <td>
                      {this?.props?.dataToMap?.advertisementPublishRequest}
                    </td>
                  </tr>
                  <tr>
                    {" "}
                    <td>3</td>
                    <td>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Count Of Press Note"
                        : "प्रेस नोटची संख्या"}
                    </td>
                    <td>{this?.props?.dataToMap?.pressNoteRequest}</td>
                  </tr>
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
