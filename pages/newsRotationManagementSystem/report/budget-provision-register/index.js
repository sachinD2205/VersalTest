import { Button, FormControl, Paper, TextField } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import axios from "axios"
import moment from "moment"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useReactToPrint } from "react-to-print"
import urls from "../../../../URLS/urls"
import styles from "./report.module.css"
import layoutStyles from "/styles/reusableComponents/ReportsLayout.module.css"
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout"
import { Search } from "@mui/icons-material"
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
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()
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
  const [tableData, setTableData] = useState([])

  const columns = [
    {
      headerName: language === "en" ? "Sr.No." : "अ.क्र.",
      width: 50,
    },
    {
      headerName: language === "en" ? "Bill Date" : "बिलाची तारीख",
      width: 85,
    },
    {
      headerName: language === "en" ? "Bill Details" : "बिलाचा तपशील",
      width: 200,
    },
    {
      headerName: language === "en" ? "Bill Amount" : "बिलाची रक्कम",
      width: 80,
    },
    {
      headerName: language === "en" ? "Previous Expense" : "पूर्वीचा खर्च",
      width: 75,
    },
    {
      headerName:
        language === "en" ? "Expense With This Bill" : "या बिलासह एकूण खर्च",
      width: 100,
    },
    {
      headerName: language === "en" ? "Remaining Amount" : "शिल्लक ₹",
      width: 100,
    },
    // {
    //   headerName: language === 'en' ? 'Clerk Sign' : 'लिपिकाची स्वाक्षरी',
    //   width: 100,
    // },
    // {
    //   headerName: language === 'en' ? 'Officer Sign' : 'अधिकार्याची स्वाक्षरी',
    //   width: 100,
    // },
    // {
    //   headerName: language === 'en' ? 'Remark' : 'शेरा',
    //   width: 100,
    // },
  ]

  useEffect(() => {
    console.log("tableData: ", tableData)
  }, [tableData])

  const getApplicationDetail = () => {
    const body = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
    }

    axios
      .get(`${urls.NRMS}/reportsController/budgetProvisionRagister`, {
        params: {
          fromDate: getValues("fromDate"),
          toDate: getValues("toDate"),
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setDataSource(
          r?.data?.trnNewsPublishRequestList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
            }
          })
        )

        setTableData(
          r?.data?.budgetProvisionRagisterList?.map((j, i) => ({
            ...j,
            srNo: i + 1,
            billDate: moment(j.billDate).format("DD-MM-YYYY"),
          }))
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

        <div className={styles.searchFilter}>
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
            disabled={!watch("fromDate") || !watch("toDate")}
            variant="contained"
            endIcon={<Search />}
            style={{ marginLeft: "4px" }}
            onClick={getApplicationDetail}
          >
            {language === "en" ? "Search" : "शोधा"}
          </Button>
        </div>

        <div className={styles.centerDiv}>
          <ReportLayout
            centerHeader
            centerData
            columnLength={11}
            componentRef={componentRef}
            showDates={!!watch("fromDate") && !!watch("toDate")}
            date={{
              from: !!watch("fromDate")
                ? moment(watch("fromDate")).format("DD-MM-YYYY")
                : "",
              to: !!watch("toDate")
                ? moment(watch("toDate")).format("DD-MM-YYYY")
                : "",
            }}
          >
            {/* <ComponentToPrint dataToMap={{ dataSource, language, menu }} /> */}
            <ReportComponent
              rows={tableData}
              language={language}
              columns={columns}
            />
          </ReportLayout>
        </div>
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
                          ? "Bill Date"
                          : "बिलाची तारीख"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Bill Details"
                          : "बिलाचा तपशील"}{" "}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Bill Amount"
                          : "बिलाची रक्कम"}{" "}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Previous Expense"
                          : "पूर्वीचा खर्च"}{" "}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1}>
                      <b>
                        {this?.props?.dataToMap?.language === "en"
                          ? "Expense With This Bill (4+5)"
                          : "या बिलासह एकूण खर्च ४+५"}
                      </b>
                    </th>

                    <th rowSpan={4} colSpan={1} style={{ width: "8%" }}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Remaining Amount"
                        : "शिल्लक ₹"}
                    </th>

                    <th rowSpan={4} colSpan={1} style={{ width: "8%" }}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Clerk Sign"
                        : "लिपिकाची स्वाक्षरी"}
                    </th>

                    <th rowSpan={4} colSpan={1} style={{ width: "10%" }}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Officer Sign"
                        : "अधिकार्याची स्वाक्षरी"}
                    </th>

                    <th rowSpan={4} colSpan={1} style={{ width: "8%" }}>
                      {this?.props?.dataToMap?.language === "en"
                        ? "Remark"
                        : "शेरा"}
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
                  </tr>

                  {this.props.dataToMap.dataSource &&
                    this.props.dataToMap.dataSource.map((r, i) => (
                      <tr key={i}>
                        <td>{r.srNo}</td>
                        <td>{r?.billDate}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
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

const ReportComponent = ({ rows = [], language, columns = [] }) => {
  return (
    <tbody className={layoutStyles.tableBody}>
      <tr className={layoutStyles.tableHeaders}>
        {columns?.map((col) => (
          <th
            style={{
              width: col.width ?? 50,
              minWidth: 50,
              border: "1px solid black",
              padding: "5px 8px",
              color: "white",
              backgroundColor: "#1976d2",
            }}
          >
            {col.headerName}
          </th>
        ))}
      </tr>
      {rows?.length > 0 ? (
        rows.map((j) => (
          <>
            <tr>
              <td
                rowSpan={j?.budgetBifercationsDaos?.length + 1 ?? 1}
                className={layoutStyles.tableData}
              >
                {j.srNo}
              </td>
              <td
                rowSpan={j?.budgetBifercationsDaos?.length + 1 ?? 1}
                className={layoutStyles.tableData}
              >
                {j?.billDate}
              </td>
              <td className={layoutStyles.tableData}>
                {language == "en" ? j?.billDetails : j?.billDetailsMr}
              </td>
              <td className={layoutStyles.tableData}>---</td>

              <td className={layoutStyles.tableData}>---</td>
              <td className={layoutStyles.tableData}>---</td>
              <td className={layoutStyles.tableData}>---</td>
              {/* <td className={layoutStyles.tableData}></td>
            <td className={layoutStyles.tableData}></td>
            <td className={layoutStyles.tableData}></td> */}
            </tr>
            {j?.budgetBifercationsDaos?.map((newspaper) => (
              <tr>
                <td className={layoutStyles.tableData}>
                  {language == "en"
                    ? newspaper?.newsPaperName
                    : newspaper?.newsPaperNameMr}
                </td>
                <td className={layoutStyles.tableData}>
                  {newspaper?.billAmount}
                </td>
                <td className={layoutStyles.tableData}>
                  {newspaper?.previousExpenses}
                </td>
                <td className={layoutStyles.tableData}>
                  {newspaper?.expensisWithThisBill}
                </td>
                <td className={layoutStyles.tableData}>
                  {newspaper?.remainingAmount}
                </td>
                {/* <td className={layoutStyles.tableData}></td>
              <td className={layoutStyles.tableData}></td>
              <td className={layoutStyles.tableData}></td> */}
              </tr>
            ))}
          </>
        ))
      ) : (
        <tr>
          <td
            colSpan={7}
            className={layoutStyles.tableData}
            style={{ textAlign: "center" }}
          >
            No Data
          </td>
        </tr>
      )}
    </tbody>
  )
}
export default Index
