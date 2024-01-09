import React, { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  ThemeProvider,
} from "@mui/material"
import styles from "./view.module.css"
import router from "next/router"
import URLS from "../../../../URLS/urls"

import axios from "axios"
import sweetAlert from "sweetalert"
import ReportTableHonorariumLetter from "./ReportTableHonorariumLetter"
import { Controller, useForm } from "react-hook-form"
import moment from "moment"
import { useReactToPrint } from "react-to-print"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { ExitToApp, Print, Search } from "@mui/icons-material"
import { useSelector } from "react-redux"
import Head from "next/head"
import theme from "../../../../theme"
import { toast } from "react-toastify"
import ReportLayout from "../ReportLayoutComponent"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "List of Corporators",
  })

  const [loading, setLoading] = useState(false)
  const [isPrint, setIsPrint] = useState(false)
  const [financialYear, setFinancialYear] = useState([])

  const [corporatorData, setCorporatorData] = useState([])

  const [returnDates, setReturnDates] = useState(null)

  const [table, setTable] = useState([])
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
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

  const userToken = useGetToken()

  const searchSchema = yup.object().shape({
    fromDate: yup.string().nullable(),
    toDate: yup.string().nullable(),
  })

  const {
    handleSubmit,
    watch,
    control,
    register,
    formState: { errors: error },
  } = useForm({})

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${URLS.MSURL}/mstDefineCorporators/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setCorporatorData(
            res?.data?.corporator
              ?.sort((a, b) => {
                const nameA =
                  a?.firstName?.toLowerCase() +
                  a?.middleName?.toLowerCase() +
                  a?.lastName?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB =
                  b?.firstName?.toLowerCase() +
                  b?.middleName?.toLowerCase() +
                  b?.lastName?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                corporatorNameEn:
                  (r.firstName ? r.firstName : "") +
                  " " +
                  (r.middleName ? r.middleName : "") +
                  " " +
                  (r.lastName ? r.lastName : ""),
                corporatorNameMr:
                  (r.firstNameMr ? r.firstNameMr : "") +
                  " " +
                  (r.middleNameMr ? r.middleNameMr : "") +
                  " " +
                  (r.lastNameMr ? r.lastNameMr : ""),
              }))
          )
          setLoading(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     // buttons: ["No", "Yes"],
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // } else {
        //   sweetAlert(error)
        //   setLoading(false)
        // }
        setLoading(false)
        callCatchMethod(error, language);
      })

    //  financialYear
    axios
      .get(`${URLS.CFCURL}/master/financialYearMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Financial Year: ", res.data.financialYear)
        setFinancialYear(
          res?.data?.financialYear?.map((j) => ({
            id: j.id,
            financialYearEn: j.financialYear,
            financialYearMr: j.financialYearMr,
          }))
        )
      })
      .catch((error) => {
        // console.log("error: ", error)
        // sweetAlert({
        //   title: "ERROR!",
        //   text: `${error}`,
        //   icon: "error",
        //   buttons: {
        //     confirm: {
        //       text: "OK",
        //       visible: true,
        //       closeModal: true,
        //     },
        //   },
        //   dangerMode: true,
        // })
        callCatchMethod(error, language);
      })
  }, [])

  const submit = (data) => {
    if (returnDates && watch("corporatorId")) {
      setLoading(true)
      axios
        .get(
          `${URLS.MSURL
          }/trnHonorariumProcess/getReportByYearAndCorporatorId?fromDate=${returnDates?.formattedStartDate
          }&toDate=${returnDates?.formattedEndDate}&corporatorId=${watch(
            "corporatorId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data)
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length !== 0) {
              language == "en"
                ? toast.success("Data Found Here We Go....")
                : toast.success("येथे डेटा सापडला आम्ही जातो....")

              setTable(
                res.data.map((obj, index) => ({
                  id: obj.id,
                  srNo: index + 1,
                  fulNameEng: obj.fulNameEng,
                  fullNameMr: obj.fullNameMr,
                  fixedAmount: obj.fixedAmount,
                  deductedOtherAmount: obj.deductedOtherAmount,
                  healthInsuranceCharges: obj.healthInsuranceCharges,
                  meetingAttentedAmount: obj.meetingAttentedAmount,
                  mobileCharges: obj.mobileCharges,
                  grandTotal: obj.grandTotal,
                }))
              )
              setLoading(false)
              setIsPrint(true)
            } else {
              // sweetAlert({
              //   title: "Oops!",
              //   text: "No Data Found Against This Selection, please try with different selection",
              //   icon: "warning",
              //   // buttons: ["No", "Yes"],
              //   dangerMode: false,
              //   closeOnClickOutside: false,
              // })
              language == "en"
                ? toast.error("No Data Found Against This Selection")
                : toast.error("या निवडीविरूद्ध कोणताही डेटा आढळला नाही")

              setTable([])
              setLoading(false)
              setIsPrint(false)
            }
          } else {
            setLoading(false)
            sweetAlert("Something Went Wrong!")
            setIsPrint(false)
          }
        })
        .catch((error) => {
          // if (!error.status) {
          //   sweetAlert({
          //     title: "ERROR",
          //     text: "Server is unreachable or may be a network issue, please try after sometime",
          //     icon: "warning",
          //     // buttons: ["No", "Yes"],
          //     dangerMode: false,
          //     closeOnClickOutside: false,
          //   })
          //   setLoading(false)
          //   setIsPrint(false)
          // } else {
          //   setLoading(false)
          //   sweetAlert(error)
          //   setIsPrint(false)
          // }
          setLoading(false)
          // sweetAlert(error)
          setIsPrint(false)
          callCatchMethod(error, language);
        })
    } else {
      language == "en"
        ? toast.error("Both Fields Are Required To Get Data")
        : toast.error("डेटा मिळविण्यासाठी दोन्ही फील्ड आवश्यक आहेत")
    }
  }

  const columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 80,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "fulNameEng" : "fullNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="fullName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: "fixedAmount",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="fixedAmount" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: "deductedOtherAmount",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="deductedOtherAmount" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: "healthInsuranceCharges",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="healthInsuranceCharges" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: "meetingAttentedAmount",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="meetingAttentedAmount" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: "mobileCharges",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="mobileCharges" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",
      field: "grandTotal",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="grandTotal" />,
      flex: 1,
    },
  ]

  function getFinancialYearDates(financialYear) {
    console.log("Start Date:1", financialYear)
    const [startYear, endYear] = financialYear.split("-").map(Number)
    const startDate = `01-04-${startYear}`
    const endDate = `31-03-20${endYear}`

    return formatDateToYYYYMMDD(startDate, endDate)
  }

  function formatDateToYYYYMMDD(startDate, endDate) {
    const partStart = startDate.split("-")
    const dayStart = partStart[0]
    const monthStart = partStart[1]
    const yearStart = partStart[2]

    // END
    const partEnd = endDate.split("-")
    const dayEnd = partEnd[0]
    const monthEnd = partEnd[1]
    const yearEnd = partEnd[2]

    const formattedStartDate = `${yearStart}-${monthStart}-${dayStart}`
    const formattedEndDate = `${yearEnd}-${monthEnd}-${dayEnd}`
    return setReturnDates({ formattedStartDate, formattedEndDate })
  }

  useEffect(() => {
    if (watch("financialYear")) {
      getFinancialYearDates(watch("financialYear"))
    }
  }, [watch("financialYear")])

  useEffect(() => {
    if (returnDates) {
      console.log(":a1", returnDates)
    }
  }, [returnDates])

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Head>
          <title>Committee Establishment</title>
        </Head>

        <Box>
          <BreadcrumbComponent />
        </Box>

        <Paper className={styles.adjustForBread}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "98%",
                height: "auto",
                overflow: "auto",
                padding: "0.5%",
                color: "white",
                fontSize: 19,
                fontWeight: 500,
                borderRadius: 100,
              }}
            >
              <strong>
                <FormattedLabel id="honorariumLetter" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

          {loading ? (
            <Loader />
          ) : (
            <>
              <form onSubmit={handleSubmit(submit)}>
                <div
                  className={styles.row}
                  style={{
                    columnGap: 100,
                    rowGap: 25,
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: "5vh",
                  }}
                >
                  <FormControl error={!!error.corporatorNo}>
                    <InputLabel>
                      <FormattedLabel id="selectCorporator" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          autoFocus
                          variant="standard"
                          fullWidth
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          sx={{ minWidth: 300 }}
                        >
                          {corporatorData &&
                            corporatorData?.map((corporator, index) => (
                              <MenuItem key={index} value={corporator.id}>
                                {language == "en"
                                  ? corporator.corporatorNameEn
                                  : corporator.corporatorNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="corporatorId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {error?.corporatorId ? error.corporatorId.message : null}
                    </FormHelperText>
                  </FormControl>
                  {/* //////////////// */}

                  {/* <TextField
                    id="outlined-basic"
                    label={<FormattedLabel id="year" />}
                    // variant="outlined"
                    variant="standard"
                    {...register("year")}
                  /> */}
                  <FormControl variant="standard" error={!!error.financialYear}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="financialYear" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "230px" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                          label="selectYear"
                        >
                          {financialYear &&
                            financialYear.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  //@ts-ignore
                                  value.financialYearEn
                                }
                              >
                                {language == "en"
                                  ? //@ts-ignore
                                  value.financialYearEn
                                  : // @ts-ignore
                                  value?.financialYearMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="financialYear"
                      control={control}
                    />
                    <FormHelperText>
                      {error?.financialYear
                        ? error.financialYear.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                  {/* //////////////////// */}
                  <Button
                    variant="contained"
                    type="submit"
                    endIcon={<Search />}
                    size="small"
                  >
                    <FormattedLabel id="search" />
                  </Button>
                </div>
                <div
                  className={styles.row}
                  style={{ justifyContent: "center", marginBottom: "5vh" }}
                >
                  <div className={styles.buttons}>
                    <Button
                      variant="contained"
                      endIcon={<Print />}
                      onClick={handleToPrint}
                      size="small"
                    >
                      <FormattedLabel id="print" />
                    </Button>

                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<ExitToApp />}
                      onClick={() => {
                        router.push(`/municipalSecretariatManagement/dashboard`)
                      }}
                      size="small"
                    >
                      <FormattedLabel id="back" />
                    </Button>
                  </div>
                </div>
              </form>
              <div
                className={styles.row}
                style={{
                  columnGap: 100,
                  rowGap: 25,
                  justifyContent: "center",
                  flexWrap: "wrap",
                  marginTop: "5vh",
                }}
              >
                {/* <ReportTableHonorariumLetter
                  rows={table}
                  columns={columns}
                  toPrint={componentRef}
                /> */}

                {isPrint && (
                  <ReportLayout
                    rows={table}
                    columns={columns}
                    componentRef={componentRef}
                    deptName={{
                      en: "Municipal Secretariat Management System",
                      mr: "महानगरपालिका सचिवालय व्यवस्थापन प्रणाली",
                    }}
                    reportName={{
                      en: "Honorarium Letter",
                      mr: "मानधन पत्र",
                    }}
                  />
                )}
              </div>
            </>
          )}
        </Paper>
      </div>
    </ThemeProvider>
  )
}
export default Index
