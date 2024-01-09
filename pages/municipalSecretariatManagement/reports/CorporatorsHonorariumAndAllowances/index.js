import React, { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  ThemeProvider,
} from "@mui/material"
import styles from "./view.module.css"
import router from "next/router"
import URLS from "../../../../URLS/urls"

import axios from "axios"
import sweetAlert from "sweetalert"
import ReportTableCorporatorsH_and_A from "./ReportTableCorporatorsH_and_A"
import { Controller, useForm } from "react-hook-form"
import moment from "moment"
import { useReactToPrint } from "react-to-print"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { ExitToApp, Print, Search, Visibility } from "@mui/icons-material"
import { useSelector } from "react-redux"
import Head from "next/head"
import theme from "../../../../theme"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import ReportLayout from "../ReportLayoutComponent"
import { toast } from "react-toastify"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
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

  const [genders, setGenders] = useState([])

  const [table, setTable] = useState([])
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }

  const userToken = useGetToken()

  const searchSchema = yup.object().shape({
    fromDate: yup.string().nullable(),
    toDate: yup.string().nullable(),
  })

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(searchSchema),
  })

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${URLS.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setGenders(
            res?.data?.gender?.map((r, i) => ({
              id: r.id,
              srNo: i + 1,
              genderEn: r.gender,
              genderMr: r.genderMr,
            }))
          )
          setLoading(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        callCatchMethod(error, language)
      })
  }, [])

  const submit = (data) => {
    if (watch("fromDate") && watch("toDate")) {
      setLoading(true)
      axios
        .get(
          `${
            URLS.MSURL
          }/trnHonorariumProcess/getByCorporatorsHonoAriumAndAlowances?fromDate=${moment(
            watch("fromDate")
          ).format("YYYY-MM-DD")}&toDate=${moment(watch("toDate")).format(
            "YYYY-MM-DD"
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
                : toast.success("येथे डेटा सापडला....")
              setTable(
                res.data.map((obj, index) => ({
                  id: obj.id,
                  srNo: index + 1,
                  fulNameEng: obj.fulNameEng,
                  fullNameMr: obj.fullNameMr,
                  genderEn: genders?.find((o) => o.id === obj.gender)?.genderEn,
                  genderMr: genders?.find((o) => o.id === obj.gender)?.genderMr,
                  allowancePerMeeting: obj.allowancePerMeeting,
                  maxLimitOfAllowanceInMonth: obj.maxLimitOfAllowanceInMonth,
                  standingCommiotteeCount: obj.standingCommiotteeCount,
                  generalBodyMeetingCount: obj.generalBodyMeetingCount,
                  totalAttendanceCount: obj.totalAttendanceCount,
                }))
              )
              setLoading(false)
              setIsPrint(true)
            } else {
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
          sweetAlert(error)
          setIsPrint(false)
          callCatchMethod(error, language)
        })
    } else {
      language == "en"
        ? toast.error("Both Dates Are Required To Get Data")
        : toast.error("डेटा मिळविण्यासाठी दोन्ही तारखे आवश्यक आहेत")
    }
  }

  const columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 60,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "fulNameEng" : "fullNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="fullName" />,
      width: 250,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "genderEn" : "genderMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="gender" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",
      field: "allowancePerMeeting",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="allowancePerMeeting" />,
      width: 185,
    },
    {
      headerClassName: "cellColor",
      field: "maxLimitOfAllowanceInMonth",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="maxLimitOfAllowanceInMonth" />,
      width: 185,
    },
    {
      headerClassName: "cellColor",
      field: "generalBodyMeetingCount",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="generalBodyMeetingCount" />,
      width: 185,
    },
    {
      headerClassName: "cellColor",
      field: "standingCommiotteeCount",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="standingCommiotteeCount" />,
      width: 185,
    },
    {
      headerClassName: "cellColor",
      field: "totalAttendanceCount",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="totalAttendanceCount" />,
      width: 185,
    },
  ]

  useEffect(() => {
    if (watch("fromDate")) {
      setValue("toDate", "")
    }
  }, [watch("fromDate")])

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Head>
          <title>Corporators Honorarium And Allowances</title>
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
                width: "100%",
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
                <FormattedLabel id="CorporatorsHonorariumAndAllowances" />
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
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!error.fromDate}
                  >
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
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="fromDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {error?.fromDate ? error.fromDate.message : null}
                    </FormHelperText>
                  </FormControl>
                  {/* //////////////// */}

                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!error.toDate}
                  >
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disabled={watch("fromDate") ? false : true}
                            disableFuture
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                            minDate={watch("fromDate")}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {error?.toDate ? error.toDate.message : null}
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
                {/* <ReportTableCorporatorsH_and_A
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
                      en: "Corporators Honorarium And Allowances",
                      mr: "नगरसेवक मानधन आणि भत्ते",
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
