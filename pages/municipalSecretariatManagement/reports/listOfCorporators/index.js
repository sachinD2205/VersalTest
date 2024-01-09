// /mstDefineCorporators/getByFromDateToDate?fromDate=2019-01-01&toDate=2023-01-01
import React, { useEffect, useRef, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  Paper,
  TextField,
  ThemeProvider,
} from "@mui/material"
import styles from "./view.module.css"
import router from "next/router"
import URLS from "../../../../URLS/urls"

import axios from "axios"
import sweetAlert from "sweetalert"
import ReportTable from "../../../../containers/reuseableComponents/ReportTable"
import { Controller, useForm } from "react-hook-form"
import { LocalizationProvider } from "@mui/x-date-pickers/node/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/node/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import moment from "moment"
import { useReactToPrint } from "react-to-print"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { ExitToApp, Print, Search, Visibility } from "@mui/icons-material"
import { DataGrid } from "@mui/x-data-grid"
import { useSelector } from "react-redux"
import Head from "next/head"
import theme from "../../../../theme"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import { toast } from "react-toastify"
import ReportLayout from "../ReportLayoutComponent"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util//util"

const Index = () => {
  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "List of Corporators",
  })

  const [loading, setLoading] = useState(false)
  const [isPrint, setIsPrint] = useState(false)

  const [electedWardDropDown, setElectedWardDropDown] = useState([
    { id: 1, electedWardEn: "", electedWardMr: "" },
  ])
  const [religion, setReligion] = useState([
    {
      id: 1,
      religionEn: "",
      religionMr: "",
    },
  ])
  const [ward, setWard] = useState([
    {
      id: 1,
      wardNameEn: "",
      wardNameMr: "",
    },
  ])
  const [gender, setGender] = useState([
    {
      id: 1,
      genderEn: "",
      genderMr: "",
    },
  ])
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
    register,
    watch,
    setValue,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(searchSchema),
  })

  useEffect(() => {
    //Gender
    setLoading(true)
    axios
      .get(`${URLS.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setGender(
            res.data.gender.map((j) => ({
              id: j.id,
              genderEn: j.gender,
              genderMr: j.genderMr,
            }))
          )
          setLoading(false)
        } else {
          setLoading(false)
          sweetAlert("Something Went Wrong!")
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
        //   setLoading(false)
        //   sweetAlert(error)
        // }
        setLoading(false)
        callCatchMethod(error, language)
      })

    //Ward
    setLoading(true)
    axios
      .get(`${URLS.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Yetoy na bhai", res.data.ward)
        if (res?.status === 200 || res?.status === 201) {
          setWard(
            res.data.ward.map((j) => ({
              id: j.id,
              wardNameEn: j.wardName,
              wardNameMr: j.wardNameMr,
            }))
          )
          setLoading(false)
        } else {
          setLoading(false)
          sweetAlert("Something Went Wrong!")
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
        //   setLoading(false)
        //   sweetAlert(error)
        // }
        setLoading(false)
        callCatchMethod(error, language)
      })

    //Get Elected Ward
    setLoading(true)
    axios
      .get(`${URLS.MSURL}/mstElectoral/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(res.data.electoral)
        if (res?.status === 200 || res?.status === 201) {
          setElectedWardDropDown(
            res.data.electoral.map((j) => ({
              id: j.id,
              electedWardEn: j.electoralWardName,
              electedWardMr: j.electoralWardNameMr,
            }))
          )
          setLoading(false)
        } else {
          setLoading(false)
          sweetAlert("Something Went Wrong!")
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
        //   setLoading(false)
        //   sweetAlert(error)
        // }
        setLoading(false)
        callCatchMethod(error, language)
      })

    //Religion
    setLoading(true)
    axios
      .get(`${URLS.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setReligion(
            res.data.religion.map((j) => ({
              id: j.id,
              religionEn: j.religion,
              religionMr: j.religionMr,
            }))
          )
          setLoading(false)
        } else {
          setLoading(false)
          sweetAlert("Something Went Wrong!")
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
        //   setLoading(false)
        //   sweetAlert(error)
        // }
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
          }/mstDefineCorporators/getByFromDateToDate?fromDate=${moment(
            data.fromDate
          ).format("YYYY-MM-DD")}&toDate=${moment(data.toDate).format(
            "YYYY-MM-DD"
          )}&activeFlag=Y`,
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
                  ward: obj.ward,
                  electedWard: obj.electedWard,
                  fullNameEn:
                    (obj.firstName ? obj.firstName : "") +
                    " " +
                    (obj.middleName ? obj.middleName : "") +
                    " " +
                    (obj.lastName ? obj.lastName : ""),
                  fullNameMr:
                    (obj.firstNameMr ? obj.firstNameMr : "") +
                    " " +
                    (obj.middleNameMr ? obj.middleNameMr : "") +
                    " " +
                    (obj.lastNameMr ? obj.lastNameMr : ""),
                  // @ts-ignore
                  genderEn: gender.find((j) => j.id === obj.gender).genderEn,
                  // @ts-ignore
                  genderMr: gender.find((j) => j.id == obj.gender).genderMr,
                  // @ts-ignore
                  wardEn: ward.find((j) => j.id == obj.ward)?.wardNameEn,
                  // @ts-ignore
                  wardMr: ward.find((j) => j.id == obj.ward)?.wardNameMr,
                  // @ts-ignore
                  religionEn: religion.find((j) => j.id == obj.religion)
                    ?.religionEn,
                  // @ts-ignore
                  religionMr: religion.find((j) => j.id == obj.religion)
                    ?.religionMr,
                  electedWardEn: electedWardDropDown.find(
                    (j) => j.id === obj.electedWard
                  )?.electedWardEn,
                  electedWardMr: electedWardDropDown.find(
                    (j) => j.id === obj.electedWard
                  )?.electedWardMr,
                  DOB: moment(obj.dateOfBirth).format("MM-DD-YYYY"),
                  religion: obj.religion,
                }))
              )
              setLoading(false)
              setIsPrint(true)
            } else {
              language == "en"
                ? toast.error("No Data Found Against This Selection")
                : toast.error("या निवडीविरूद्ध कोणताही डेटा आढळला नाही")

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
      width: 80,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "fullNameEn" : "fullNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="fullName" />,
      width: 250,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "genderEn" : "genderMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="gender" />,
      width: 175,
    },
    {
      headerClassName: "cellColor",

      field: "DOB",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="dateOfBirth" />,
      width: 175,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "wardEn" : "wardMr",
      // field: 'ward',
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="ward" />,
      width: 175,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "electedWardEn" : "electedWardMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="electedWard" />,
      width: 175,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "religionEn" : "religionMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="religion" />,
      width: 175,
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
          <title>List of Corporators</title>
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
                <FormattedLabel id="listOfCorporators" />
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
                {/* <ReportTable
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
                      en: "List Of Corporators",
                      mr: "नगरसेवकांची यादी",
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
