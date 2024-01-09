import React, { useEffect, useState } from "react"
import router from "next/router"
import Head from "next/head"
import styles from "./honorarium.module.css"

import URLs from "../../../../URLS/urls"
import axios from "axios"
import sweetAlert from "sweetalert"
import moment from "moment"
import * as yup from "yup"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import {
  Paper,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  FormHelperText,
  TextareaAutosize,
  Checkbox,
  Button,
  IconButton,
  Slide,
  Box,
} from "@mui/material"
import { Clear, ExitToApp, Group, Save, Search } from "@mui/icons-material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { toast } from "react-toastify"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"
import DOMPurify from "dompurify"

const Index = () => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  const [healthInsuranceCharges, setHealthInsuranceCharges] = useState(false)
  const [corporators, setCorporators] = useState([])
  const [dataToShowInGrid, setDataToShowInGrid] = useState([])

  const [loading, setLoading] = useState(false)
  const userToken = useGetToken()

  const [year, setYear] = useState([])
  const month = [
    { id: 1, NameEn: "January", NameMr: "जानेवारी" },
    { id: 2, NameEn: "February", NameMr: "फेब्रुवारी" },
    { id: 3, NameEn: "March", NameMr: "मार्च" },
    { id: 4, NameEn: "April", NameMr: "एप्रिल" },
    { id: 5, NameEn: "May", NameMr: "मे" },
    { id: 6, NameEn: "June", NameMr: "जून" },
    { id: 7, NameEn: "July", NameMr: "जुलै" },
    { id: 8, NameEn: "August", NameMr: "ऑगस्ट" },
    { id: 9, NameEn: "September", NameMr: "सप्टेंबर" },
    { id: 10, NameEn: "October", NameMr: "ऑक्टोबर" },
    { id: 11, NameEn: "November", NameMr: "नोव्हेंबर" },
    { id: 12, NameEn: "December", NameMr: "डिसेंबर" },
  ]
  const [fixedAmount, setFixedAmount] = useState(0)
  const [
    amountForMeetingAttendedInTheMonth,
    setAmountForMeetingAttendedInTheMonth,
  ] = useState(0)
  const [deductedOtherAmount, setDeductedOtherAmount] = useState(0)
  const [mobileChargesAmount, setMobileChargesAmount] = useState(0)
  const [healthInsuranceChargesValue, setHealthInsuranceChargesValue] =
    useState(0)
  const [total, setTotal] = useState(0)
  const [fetchAgain, setFetchAgain] = useState(false)
  const [comittees1, setcomittees1] = useState([])
  const [directTableData, setDirectTableData] = useState([])

  const [pageSize, setPageSize] = useState(5)
  const [pageSizeForHistory, setPageSizeForHistory] = useState(5)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)

  // HYPERLINKS CHECKED
  const [messageToShowOnError, setMessageToShowOnError] = useState("")
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("")

  const [messageToShowOnRemarkError, setMessageToShowOnRemarkError] =
    useState("")
  const [messageToShowOnRemarkErrorMr, setMessageToShowOnRemarkErrorMr] =
    useState("")

  const [deductedOtherAmountFiledChk, setDeductedOtherAmountFiledChk] =
    useState(true)
  const [healthInsuranceChargesFiledChk, setHealthInsuranceChargesFiledChk] =
    useState(true)
  const [mobileChargesFiledChk, setMobileChargesFiledChk] = useState(true)
  const [remarkFiledChk, setRemarkFiledChk] = useState(true)

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

  //honorariumSchema Details
  let honorariumSchema = yup.object().shape({
    selectMonth: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    selectYear: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    corporatorNo: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    remark: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    deductedOtherAmount: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    healthInsuranceCharges: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
  })

  const {
    register,
    handleSubmit,
    setValue,
    methods,
    reset,
    control,
    watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(honorariumSchema),
  })

  useEffect(() => {
    setTotal(
      fixedAmount +
        amountForMeetingAttendedInTheMonth -
        deductedOtherAmount -
        healthInsuranceChargesValue -
        mobileChargesAmount
    )
  }, [
    fixedAmount,
    amountForMeetingAttendedInTheMonth,
    deductedOtherAmount,
    mobileChargesAmount,
    healthInsuranceChargesValue,
  ])

  useEffect(() => {
    if (!fetchAgain) {
      setFixedAmount(0)
      setAmountForMeetingAttendedInTheMonth(0)
      setDeductedOtherAmount(0)
      setMobileChargesAmount(0)
      setHealthInsuranceChargesValue(0)
      setTotal(0)

      setValue("amountForMeetingAttendedInTheMonth", 0)
      setValue("fixedAmount", 0)
      setValue("deductedOtherAmount", 0)
      setValue("mobileCharges", 0)
      setValue("healthInsuranceCharges", 0)
      setValue("totalCount", 0)
      setValue("remark", "")
      setDataToShowInGrid([])
    }
  }, [fetchAgain, healthInsuranceCharges])

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAllForDropDown`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r.status == 200 || r.status == 201) {
          setcomittees1(
            r?.data?.committees?.map((row) => ({
              id: row.id,
              comitteeEn: row.committeeName,
              comitteeMr: row.committeeNameMr,
            }))
          )
          setLoading(false)
        } else {
          sweetAlert({
            title: "ERROR!",
            text: `Something Went Wrong!`,
            icon: "error",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            closeOnClickOutside: false,
            dangerMode: true,
          })
          setLoading(false)
        }
      })
      .catch((error) => {
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
        //   closeOnClickOutside: false,
        //   dangerMode: true,
        // })
        callCatchMethod(error, language)
        setLoading(false)
      })

    //Get Year
    setLoading(true)
    axios
      .get(`${URLs.CFCURL}/master/year/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setYear(
          res.data.year.map((j, i) => ({
            id: j.id,
            yearEn: j.year,
            yearMr: j.yearMr,
          }))
        )
        setLoading(false)
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
        callCatchMethod(error, language)
        setLoading(false)
      })

    //Get Corporators
    setLoading(true)
    axios
      .get(`${URLs.MSURL}/mstDefineCorporators/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setCorporators(
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
            .map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              fullNameEn:
                (j.firstName ? j.firstName : "") +
                " " +
                (j.middleName ? j.middleName : "") +
                " " +
                (j.lastName ? j.lastName : ""),
              fullNameMr:
                (j.firstNameMr ? j.firstNameMr : "") +
                " " +
                (j.middleNameMr ? j.middleNameMr : "") +
                " " +
                (j.lastNameMr ? j.lastNameMr : ""),
            }))
        )
        setLoading(false)
      })
      .catch((error) => {
        // if (!error.status) {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: error?.toString(),
        //     icon: "warning",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // } else {
        //   sweetAlert({
        //     title: "ERROR",
        //     text: error?.toString(),
        //     icon: "warning",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        // }
        callCatchMethod(error, language)
        setLoading(false)
      })
  }, [])

  const getMainTableData = () => {
    if (comittees1?.length !== 0 && corporators?.length !== 0) {
      setLoading(true)
      axios
        .get(`${URLs.MSURL}/trnHonorariumProcess/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setDirectTableData(
            res.data?.honorariumProcess?.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              comitteeEn: comittees1?.find((obj) => obj.id === j.committeeId)
                ?.comitteeEn,
              comitteeMr: comittees1?.find((obj) => obj.id === j.committeeId)
                ?.comitteeMr,
              corporatorNo: j.corporatorNo,
              corporatorNameEn: corporators?.find(
                (obj) => obj.id === j.corporatorNo
              )?.fullNameEn,
              corporatorNameMr: corporators?.find(
                (obj) => obj.id === j.corporatorNo
              )?.fullNameMr,
              honorariumProcessDate: moment(j.honorariumProcessDate).format(
                "DD-MM-YYYY"
              ),
              day: gettingDate(j.honorariumProcessDate),
              month: j.selectMonth,
              selectYear: j.selectYear,
              monthNameEn: month?.find((obj) => obj.id === j.selectMonth)
                ?.NameEn,
              monthNameMr: month?.find((obj) => obj.id === j.selectMonth)
                ?.NameMr,
              fixedAmount: j.fixedAmount,
              deductedOtherAmount: j.deductedOtherAmount
                ? j.deductedOtherAmount
                : "-",
              healthInsuranceCharges: j.healthInsuranceCharges
                ? j.healthInsuranceCharges
                : "-",
              mobileCharges: j.mobileCharges ? j.mobileCharges : "-",
              totalCount: j.totalCount ? j.totalCount : "-",
              amountForMeetingAttendedInTheMonth:
                j.amountForMeetingAttendedInTheMonth
                  ? j.amountForMeetingAttendedInTheMonth
                  : "-",
              grandTotal: j.grandTotal,
            }))
          )
          setLoading(false)
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
          callCatchMethod(error, language)
          setLoading(false)
        })
    } else {
      sweetAlert(
        "Error!",
        "Something Went Wrong, please try again later!",
        "error"
      )
      setLoading(false)
    }
  }

  useEffect(() => {
    if (comittees1?.length !== 0 && corporators?.length !== 0) {
      // ADDED NEW API FOR TABLE

      getMainTableData()
    }
  }, [comittees1, corporators])

  const getAttendance = () => {
    let selectedMonth = watch("selectMonth")
    let selectedYear = watch("selectYear")
    let corporatorId = watch("corporatorNo")

    var date = new Date(`${selectedYear}-${selectedMonth}- 1`)

    var fromDate = moment(
      new Date(date.getFullYear(), date.getMonth(), 1)
    ).format("YYYY-MM-DD")
    var toDate = moment(
      new Date(date.getFullYear(), date.getMonth() + 1, 0)
    ).format("YYYY-MM-DD")
    // var fromDate = moment(new Date(date.getFullYear(), date.getMonth(), 1)).format("DD-MM-YYYY");
    // var toDate = moment(new Date(date.getFullYear(), date.getMonth() + 1, 0)).format("DD-MM-YYYY");
    if (watch("selectMonth") && watch("selectYear") && watch("corporatorNo")) {
      setLoading(true)
      axios
        .get(
          `${URLs.MSURL}/trnHonorariumProcess/getByCorporateIdAndDate?corporatorNo=${corporatorId}&fromDate=${fromDate}&toDate=${toDate}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res.data.length > 0) {
            console.log("Response: ", res.data[0])
            language == "en"
              ? toast.success("Data Found Here We Go...")
              : toast.success("डेटा सापडला!")
            setValue(
              "amountForMeetingAttendedInTheMonth",
              res.data[0]["amountForMeetingAttendedInTheMonth"]
            )
            setValue("fixedAmount", res.data[0]["fixedAmount"])
            setValue("totalCount", res.data[0]["totalCount"])
            setFixedAmount(res.data[0]["fixedAmount"])
            setAmountForMeetingAttendedInTheMonth(
              res.data[0]["amountForMeetingAttendedInTheMonth"]
            )
            setDataToShowInGrid(
              res.data[0]?.corpoDao?.map((r, i) => ({
                id: i,
                srNo: i + 1,
                committeeId: r.committeeId,
                date: moment(r.date).format("DD-MM-YYYY"),
                comitteeEn: r.committeeNameEn,
                comitteeMr: r.committeeNameMr,
                day: gettingDate(r.date),
              }))
            )
            setFetchAgain(true)
            setLoading(false)
          } else {
            language == "en"
              ? toast.error("No amount generated for this corporator!", {
                  position: "top-center",
                })
              : toast.error("या नगरसेवकासाठी एकही रक्कम काढली नाही!", {
                  position: "top-center",
                })
            setLoading(false)
            // sweetAlert({
            //   title: "OOPS!",
            //   text: "No amount generated for this corporator",
            //   icon: "warning",
            //   buttons: {
            //     confirm: {
            //       text: "OK",
            //       visible: true,
            //       closeModal: true,
            //     },
            //   },
            // })
          }
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
          callCatchMethod(error, language)
          setLoading(false)
        })
    } else {
      language == "en"
        ? toast.error("All Three Fields Are Reqiured To Select!")
        : toast.error("निवडण्यासाठी सर्व तीन फील्ड आवश्यक आहेत!")

      setLoading(false)
    }
  }

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      minWidth: 80,
    },
    {
      field: language == "en" ? "comitteeEn" : "comitteeMr",
      headerName: <FormattedLabel id="committeeName" />,
      headerAlign: "center",
      // align: "center",
      flex: 2,
      renderCell: (params) => {
        console.log(":para", params?.row)
        return (
          <div>
            <strong>
              {language == "en"
                ? params?.row?.comitteeEn
                : params?.row?.comitteeMr}
            </strong>
          </div>
        )
      },
    },
    {
      field: "date",
      headerName: <FormattedLabel id="dateAndDay" />,
      headerAlign: "center",

      flex: 1,
      renderCell: (params) => {
        console.log(":para", params?.row)
        return (
          <div>
            <strong>
              {params?.row?.day}, {params?.row?.date}
            </strong>
          </div>
        )
      },
    },
  ]

  // NEW COLUMN FOR THE MAIN TABLE
  const columnsForMainTable = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerAlign: "center",
      align: "center",
      minWidth: 80,
    },
    {
      field: language == "en" ? "corporatorNameEn" : "corporatorNameMr",
      headerName: <FormattedLabel id="corporatorName" />,
      headerAlign: "center",
      // align: "center",
      minWidth: 300,
    },
    {
      field: language == "en" ? "monthNameEn" : "monthNameMr",
      headerName: <FormattedLabel id="month" />,
      headerAlign: "center",

      minWidth: 100,
      renderCell: (params) => {
        console.log(":para", params?.row)
        return (
          <div>
            {language == "en"
              ? params?.row?.monthNameEn
              : params?.row?.monthNameEn}
            , {params?.row?.selectYear}
          </div>
        )
      },
    },
    {
      field: "honorariumProcessDate",
      headerName: <FormattedLabel id="honorariumProcessDate" />,
      headerAlign: "center",
      minWidth: 200,
      renderCell: (params) => {
        console.log(":para", params?.row)
        return (
          <div>
            {params?.row?.day}, {params?.row?.honorariumProcessDate}
          </div>
        )
      },
    },
    {
      field: "fixedAmount",
      headerName: <FormattedLabel id="fixedAmount" />,
      headerAlign: "center",
      align: "right",
      minWidth: 150,
    },
    {
      field: "totalCount",
      headerName: <FormattedLabel id="totalCount" />,
      headerAlign: "center",
      align: "right",
      minWidth: 300,
    },
    {
      field: "amountForMeetingAttendedInTheMonth",
      headerName: <FormattedLabel id="amountForMeetingAttendedInTheMonth" />,
      headerAlign: "center",
      align: "right",
      minWidth: 330,
    },
    {
      field: "deductedOtherAmount",
      headerName: <FormattedLabel id="deductedOtherAmount" />,
      headerAlign: "center",
      align: "right",
      minWidth: 200,
    },
    {
      field: "healthInsuranceCharges",
      headerName: <FormattedLabel id="healthInsuranceCharges" />,
      headerAlign: "center",
      align: "right",
      minWidth: 200,
    },
    {
      field: "mobileCharges",
      headerName: <FormattedLabel id="mobileCharges" />,
      headerAlign: "center",
      align: "right",
      minWidth: 200,
    },
    {
      field: "grandTotal",
      headerName: <FormattedLabel id="grandTotal" />,
      headerAlign: "center",
      align: "right",
      minWidth: 200,
    },
  ]

  let gettingDate = (date) => {
    const weekdayNames = [
      "रविवार",
      "सोमवार",
      "मंगळवार",
      "बुधवार",
      "गुरुवार",
      "शुक्रवार",
      "शनिवार",
    ]
    const dateString = moment(date).format("DD/MM/YYYY")
    const dateParts = dateString?.split("/")
    const dayIndex = new Date(
      `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
    ).getDay()
    const dayName = weekdayNames[dayIndex]

    return dayName
  }

  const finalSubmit = (data) => {
    const { dateOfHonorariumProcess, ...rest } = data

    const bodyForAPI = {
      ...rest,
      honorariumProcessDate: moment(new Date()).format("YYYY-MM-DD"),
      grandTotal: total,
      mobileCharges:
        typeof watch("mobileCharges") == "string"
          ? Number(watch("mobileCharges"))
          : watch("mobileCharges"),
    }

    console.log(":a12", bodyForAPI)

    if (
      deductedOtherAmountFiledChk &&
      healthInsuranceChargesFiledChk &&
      mobileChargesFiledChk &&
      remarkFiledChk
    ) {
      setLoading(true)
      axios
        .post(`${URLs.MSURL}/trnHonorariumProcess/save`, bodyForAPI, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            sweetAlert(
              "Success!",
              "Honorarium Process for the corporator done successfully!",
              "success"
            )
            getMainTableData()
            setFetchAgain(false)
            setLoading(false)
          } else {
            sweetAlert("Error!", "Something Went Wrong!", "error")
            setLoading(false)
          }
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            sweetAlert({
              title: "ERROR!",
              text: `${error?.response?.data?.message}`,
              icon: "error",
              buttons: {
                confirm: {
                  text: "OK",
                  visible: true,
                  closeModal: true,
                },
              },
              dangerMode: true,
            })
            setFetchAgain(false)
            setLoading(false)
          } else {
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
            setFetchAgain(false)
            setLoading(false)
            callCatchMethod(error, language)
          }

          console.log("abc : ", error?.response?.data?.message)
        })
    } else {
      toast.error(
        language == "en"
          ? `Please remove the "ERROR" from the input field`
          : `कृपया इनपुट फील्डमधून "ERROR" काढा`
      )
    }
  }

  // MANUAL HANDLING VALIDATIONS
  const error1Messsage = () => {
    if (language == "en") {
      return messageToShowOnError
    } else {
      return messageToShowOnErrorMr
    }
  }
  const error2Messsage = () => {
    if (language == "en") {
      return messageToShowOnRemarkError
    } else {
      return messageToShowOnRemarkErrorMr
    }
  }

  useEffect(() => {
    const hyperlinkRegex = /https?:\/\/|ftp:\/\//i
    const csvRegex = /,\s*=/
    const noSpecialCharRegex = /^[!@#$%^&*()_+\-={}[\]:;'"<>,.?/\\|`].*/

    const checkField = (fieldName, setFieldChk) => {
      const fieldValue = watch(fieldName)

      if (!fieldValue) {
        setFieldChk(true)
        return
      }

      if (!noSpecialCharRegex.test(fieldValue)) {
        setFieldChk(true)

        if (!hyperlinkRegex.test(fieldValue)) {
          setFieldChk(true)

          if (csvRegex.test(fieldValue)) {
            setFieldChk(false)
            setMessageToShowOnRemarkError("Potential CSV injection detected! ")
            setMessageToShowOnRemarkErrorMr("संभाव्य CSV इंजेक्शन आढळले! ")
          } else {
            const sanitizedValue = DOMPurify.sanitize(fieldValue)

            if (fieldValue !== sanitizedValue) {
              setFieldChk(false)
              setMessageToShowOnRemarkError(
                "Potential HTML/Script injection detected! "
              )
              setMessageToShowOnRemarkErrorMr(
                "संभाव्य एचटीएमएल/स्क्रिप्ट इंजेक्शन आढळले! "
              )
            } else {
              setFieldChk(true)
            }
          }
        } else {
          setFieldChk(false)
          setMessageToShowOnRemarkError("Hyperlink is not allowed ")
          setMessageToShowOnRemarkErrorMr("हायपरलिंकला परवानगी नाही ")
        }
      } else {
        setFieldChk(false)
        setMessageToShowOnRemarkError(
          "Value should not start with any special character "
        )
        setMessageToShowOnRemarkError(
          "मूल्य कोणत्याही विशेष वर्णाने सुरू होऊ नये "
        )
      }
    }

    checkField("remark", setRemarkFiledChk)
  }, [watch("remark")])

  const handleValueCheck = (fieldName, setFieldChk) => {
    const zeroToNineValidaions = /^[0-9]+$/

    const fieldValue = fieldName

    if (!fieldValue) {
      setFieldChk(true)
      return
    }

    if (zeroToNineValidaions.test(fieldValue)) {
      setFieldChk(true)
    } else {
      setFieldChk(false)
      setMessageToShowOnError("Amount must be a valid number! ")
      setMessageToShowOnErrorMr("संख्या वैध असणे आवश्यक आहे! ")
    }
  }

  return (
    <>
      <Head>
        <title>Honorarium Process</title>
      </Head>
      <Box>
        <BreadcrumbComponent />
      </Box>
      {loading ? (
        <Loader />
      ) : (
        <Paper className={styles.main}>
          <div className={styles.title}>
            <FormattedLabel id="honorariumProcess" />
          </div>
          <form className={styles.main} onSubmit={handleSubmit(finalSubmit)}>
            <div className={styles.row} style={{ justifyContent: "center" }}>
              <FormControl error={!!error.dateOfHonorariumProcess}>
                <Controller
                  control={control}
                  name="dateOfHonorariumProcess"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        inputFormat="dd/MM/yyyy"
                        label={
                          <span>
                            <FormattedLabel id="dateOfHonorariumProcess" />
                          </span>
                        }
                        disabled
                        value={moment(new Date()).format("YYYY-MM-DD")}
                        onChange={(date) =>
                          field.onChange(
                            moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                          )
                        }
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: "250px" }}
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
                  {error?.dateOfHonorariumProcess
                    ? error.dateOfHonorariumProcess.message
                    : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.row}>
              <FormControl variant="standard" error={!!error.selectMonth}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="month" required />
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
                        setFetchAgain(false)
                      }}
                      label="selectMonth"
                    >
                      {month &&
                        month.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.NameEn
                              : // @ts-ignore
                                value?.NameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="selectMonth"
                  control={control}
                />
                <FormHelperText>
                  {error?.selectMonth ? error.selectMonth.message : null}
                </FormHelperText>
              </FormControl>
              <FormControl variant="standard" error={!!error.selectYear}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="year" required />
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
                        setFetchAgain(false)
                      }}
                      label="selectYear"
                    >
                      {year &&
                        year.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.yearEn
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.yearEn
                              : // @ts-ignore
                                value?.yearMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="selectYear"
                  control={control}
                />
                <FormHelperText>
                  {error?.selectYear ? error.selectYear.message : null}
                </FormHelperText>
              </FormControl>

              {/* //////////////////////////////////////////// */}
              <FormControl variant="standard" error={!!error.corporatorNo}>
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="corporatorName" required />
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
                        setFetchAgain(false)
                      }}
                      label="corporatorNo"
                    >
                      {corporators &&
                        corporators.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              //@ts-ignore
                              value.id
                            }
                          >
                            {language == "en"
                              ? //@ts-ignore
                                value.fullNameEn
                              : // @ts-ignore
                                value?.fullNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="corporatorNo"
                  control={control}
                />
                <FormHelperText>
                  {error?.corporatorNo ? error.corporatorNo.message : null}
                </FormHelperText>
              </FormControl>
            </div>
            <div className={styles.buttons} style={{ marginBottom: "20px" }}>
              <Button
                disabled={fetchAgain}
                variant="contained"
                endIcon={<Group />}
                onClick={() => {
                  getAttendance()
                }}
              >
                <FormattedLabel id="captureAttendance" />
              </Button>
              {/* <div className={styles.alignContainer}>
              <span className={styles.checkBoxLabel}>
                <FormattedLabel id="healthInsuranceCharges" />
              </span>
              <Checkbox
                onChange={() => {
                  setHealthInsuranceCharges(!healthInsuranceCharges)
                  if (healthInsuranceCharges) {
                    setValue("healthInsuranceCharges", 0)
                    setHealthInsuranceChargesValue(0)
                  }
                }}
              />
            </div> */}
            </div>

            {/* NEW DATA GRID ADDED TO SHOW CORPORATOR ATTENDED MEETING HISTORY */}
            {fetchAgain && dataToShowInGrid?.length != 0 && (
              <Box
                style={{
                  height: "auto",
                  overflow: "auto",
                  border: "0.1px solid #556CD6",
                }}
              >
                <DataGrid
                  autoHeight
                  sx={{
                    overflowY: "scroll",
                    "& .MuiDataGrid-columnHeadersInner": {
                      background: `#556CD6`,
                      color: "white",
                      // fontFamily: `serif`,
                      fontSize: `15px`,
                      fontWeight: `bold`,
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "black", // change the color of the check mark here
                    },
                  }}
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                      disableExport: true,
                      disableToolbarButton: true,
                      csvOptions: { disableToolbarButton: false },
                      printOptions: { disableToolbarButton: false },
                    },
                  }}
                  density="compact"
                  rows={dataToShowInGrid || []}
                  columns={columns}
                  pageSize={pageSizeForHistory}
                  onPageSizeChange={(newPageSize) =>
                    setPageSizeForHistory(newPageSize)
                  }
                  rowsPerPageOptions={[5, 10, 20, 50, 100]}
                  disableSelectionOnClick
                />
              </Box>
            )}

            {/* NEW DATA GRID ADDED TO SHOW CORPORATOR ATTENDED MEETING HISTORY */}

            <div className={styles.row1}>
              <TextField
                disabled
                sx={{ width: "270px" }}
                label={<FormattedLabel id="fixedAmountPerMonth" />}
                variant="standard"
                {...register("fixedAmount")}
                type="number"
                defaultValue={0}
                InputLabelProps={{
                  // shrink: watch('fixedAmount') >= 0 ? true : false,
                  shrink: true,
                }}
              />
              <TextField
                disabled
                sx={{ width: "270px" }}
                label={<FormattedLabel id="totalCount" />}
                variant="standard"
                {...register("totalCount")}
                type="number"
                defaultValue={0}
                InputLabelProps={{
                  // shrink: watch('fixedAmount') >= 0 ? true : false,
                  shrink: true,
                }}
              />
              <TextField
                disabled
                sx={{ width: "270px" }}
                label={
                  <FormattedLabel id="amountForMeetingAttendedInTheMonth" />
                }
                variant="standard"
                {...register("amountForMeetingAttendedInTheMonth")}
                defaultValue={0}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  type="number"
                  sx={{ width: "270px" }}
                  label={<FormattedLabel id="deductedOtherAmount" />}
                  variant="standard"
                  {...register("deductedOtherAmount")}
                  onChange={(event) => {
                    // @ts-ignore
                    setDeductedOtherAmount(event.target.value)

                    handleValueCheck(
                      event.target.value,
                      setDeductedOtherAmountFiledChk
                    )
                  }}
                  defaultValue={0}
                  // error={!!error.deductedOtherAmount}
                  // helperText={
                  //   error?.deductedOtherAmount
                  //     ? error.deductedOtherAmount.message
                  //     : null
                  // }
                />
                <FormHelperText style={{ color: "red" }}>
                  {!deductedOtherAmountFiledChk ? error1Messsage() : ""}
                </FormHelperText>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  type="number"
                  sx={{ width: "270px" }}
                  label={<FormattedLabel id="mobileCharges" />}
                  variant="standard"
                  {...register("mobileCharges")}
                  onChange={(event) => {
                    // @ts-ignore
                    setMobileChargesAmount(event.target.value)

                    handleValueCheck(
                      event.target.value,
                      setMobileChargesFiledChk
                    )
                  }}
                  defaultValue={0}
                  // error={!!error.mobileCharges}
                  // helperText={
                  //   error?.mobileCharges ? error.mobileCharges.message : null
                  // }
                />
                <FormHelperText style={{ color: "red" }}>
                  {!mobileChargesFiledChk ? error1Messsage() : ""}
                </FormHelperText>
              </div>

              {/* <div className={styles.alignContainer}> */}
              <div>
                <span className={styles.checkBoxLabel}>
                  <FormattedLabel id="healthInsuranceCharges" />
                </span>
                <Checkbox
                  onChange={() => {
                    setHealthInsuranceCharges(!healthInsuranceCharges)
                    if (healthInsuranceCharges) {
                      setValue("healthInsuranceCharges", 0)
                      setHealthInsuranceChargesValue(0)
                      setHealthInsuranceChargesFiledChk(true)
                    }
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <TextField
                  disabled={!healthInsuranceCharges}
                  sx={{ width: "270px" }}
                  label={<FormattedLabel id="healthInsuranceCharges" />}
                  variant="standard"
                  type="number"
                  {...register("healthInsuranceCharges")}
                  defaultValue={0}
                  onChange={(event) => {
                    // @ts-ignore
                    setHealthInsuranceChargesValue(
                      new Number(event.target.value)
                    )
                    handleValueCheck(
                      event.target.value,
                      setHealthInsuranceChargesFiledChk
                    )
                  }}
                  // error={!!error.healthInsuranceCharges}
                  // helperText={
                  //   error?.healthInsuranceCharges
                  //     ? error.healthInsuranceCharges.message
                  //     : null
                  // }
                />
                <FormHelperText style={{ color: "red" }}>
                  {!healthInsuranceChargesFiledChk ? error1Messsage() : ""}
                </FormHelperText>
              </div>

              <TextField
                disabled
                sx={{ width: "270px" }}
                label={<FormattedLabel id="grandTotal" />}
                variant="standard"
                type="number"
                {...register("grandTotal")}
                // value={
                //   watch('fixedAmount') +
                //   watch('amountForMeetingAttendedInTheMonth') +
                //   watch('deductedOtherAmount') +
                //   watch('healthInsuranceCharges')
                // }
                value={total}
                defaultValue={0}
              />
            </div>
            <div className={styles.row}>
              <TextField
                sx={{ width: "100%" }}
                label={<FormattedLabel id="remark" />}
                variant="standard"
                {...register("remark")}
                error={!!error.remark}
                helperText={error?.remark ? error.remark.message : null}
              />
              <FormHelperText style={{ color: "red" }}>
                {!remarkFiledChk ? error2Messsage() : ""}
              </FormHelperText>
            </div>
            {/* 
          <div
            className={styles.row}
            style={{
              justifyContent: "center",
              margin: "10vh 0vh",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                border: "1px solid black",
                padding: 20,
                fontWeight: "bold",
              }}
            >
              DIGITAL SIGNATURE AREA
            </div>
          </div> */}

            <div className={styles.buttons} style={{ marginBottom: "20px" }}>
              <Button variant="contained" type="submit" endIcon={<Save />}>
                <FormattedLabel id="save" />
              </Button>
              <Button
                variant="outlined"
                color="error"
                endIcon={<Clear />}
                onClick={() => setFetchAgain(false)}
              >
                <FormattedLabel id="clear" />
              </Button>
            </div>

            {/* NEW DATA GRID ADDED TO SHOW CORPORATOR ATTENDED MEETING HISTORY */}

            <Box
              style={{
                height: "auto",
                overflow: "auto",
                border: "0.1px solid #556CD6",
              }}
            >
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
                  "& .MuiDataGrid-columnHeadersInner": {
                    background: `#556CD6`,
                    color: "white",
                    // fontFamily: `serif`,
                    fontSize: `15px`,
                    fontWeight: `bold`,
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  "& .MuiSvgIcon-root": {
                    color: "black", // change the color of the check mark here
                  },
                }}
                // disableColumnFilter
                // disableColumnSelector
                // hideFooterPagination
                // disableDensitySelector
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    disableExport: true,
                    disableToolbarButton: true,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: false },
                  },
                }}
                density="compact"
                rows={directTableData || []}
                columns={columnsForMainTable}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                disableSelectionOnClick
              />
            </Box>
          </form>
        </Paper>
      )}
    </>
  )
}

export default Index
