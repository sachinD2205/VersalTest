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

  const [dataSource, setDataSource] = useState()
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
  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
    }

    axios
      .get(
        `${
          urls.NRMS
        }/reportsController/getAllByFromDateAndToDatePressNoteRequestApproval?fromDate=${getValues(
          "fromDate"
        )}&toDate=${getValues("toDate")}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        setDataSource(
          r?.data?.trnPressNoteRequestApprovalList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            }
          })
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
      field: "pressNoteRequestNo",
      headerName: language == "en" ? "Press Note Number" : "प्रेस नोट नंबर",
      width: 150,
    },
    {
      field: language == "en" ? "departmentName" : "departmentNameMr",
      headerName: language == "en" ? "Department Name" : "विभागाचे नाव",
      width: 150,
    },
    {
      field: language == "en" ? "zoneName" : "zoneNameMr",
      headerName: language == "en" ? "Zone Name" : "झोनचे नाव",
      width: 100,
    },
    {
      field: language == "en" ? "wardName" : "wardNameMr",
      headerName: language == "en" ? "Ward Name" : "वार्डचे नाव",
      width: 100,
    },
    // {
    //   field: language == 'en' ? 'priorityName' : 'priorityNameMr',
    //   headerName: language == 'en' ? 'Priority' : 'प्राधान्य',
    //   width: 100,
    // },
    {
      field: "pressNoteSubject",
      headerName: language == "en" ? "Press Note Subject" : "प्रेस नोट विषय",
      width: 150,
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
            columnLength={10}
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
            <ComponentToPrint dataToMap={{ dataSource, language, menu }} />
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
            // rows={this?.props?.dataToMap?.dataSource}
            rows={dataSource}
            columns={columns}
          />
        </div>
        {/* <ComponentToPrint
          ref={componentRef}
          dataToMap={{ dataSource, language, menu }}
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
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Sr.No."
                          : "अ.क्र."}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Press Note Number"
                          : "प्रेस नोट नंबर"}
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
                          ? "Zone Name"
                          : "झोनचे नाव"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Ward Name"
                          : "वार्डचे नाव"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Priority"
                          : "प्राधान्य"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Press Note Subject"
                          : "प्रेस नोट विषय"}
                      </b>
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
                  </tr>

                  {this.props.dataToMap.dataSource &&
                    this.props.dataToMap.dataSource.map((r, i) => (
                      <tr key={i}>
                        <td>{r.srNo}</td>

                        <td>{r.pressNoteRequestNo}</td>

                        <td>
                          {this.props.dataToMap.language == "en"
                            ? r.departmentName
                            : r.departmentNameMr}
                        </td>

                        <td>
                          {this.props.dataToMap.language == "en"
                            ? r.zoneName
                            : r.zoneNameMr}
                        </td>

                        <td>
                          {this.props.dataToMap.language == "en"
                            ? r.wardName
                            : r.wardNameMr}
                        </td>

                        <td>
                          {this.props.dataToMap.language == "en"
                            ? r.priorityName
                            : r.priorityNameMr}
                        </td>

                        <td>{r.pressNoteSubject}</td>
                      </tr>
                    ))}
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
