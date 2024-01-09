import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import router from "next/router"
import styles from "./newDocketEntry.module.css"

import Paper from "@mui/material/Paper"
import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Checkbox,
  ListItemText,
  CircularProgress,
  Box,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  // IconButton,
} from "@mui/material"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
// import { DataGrid } from '@mui/x-data-grid'
import {
  Clear,
  ExitToApp,
  Save,
  // Delete,
  // Edit,
  // Watch,
} from "@mui/icons-material"
// import Slide from '@mui/material/Slide'
import FormControl from "@mui/material/FormControl"
import { Controller, FormProvider, useForm } from "react-hook-form"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import moment from "moment"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import URLs from "../../../../URLS/urls"
import { useSelector } from "react-redux"
import sweetAlert from "sweetalert"
import UploadButton from "../../../../containers/reuseableComponents/UploadButton"
import VishapatraUpload from "../../documentsUpload/VishapatraUpload"
import PrapatraUpload from "../../documentsUpload/PrapatraUpload"
import OtherDocumentsUpload from "../../documentsUpload/OtherDocumentsUpload"
import OtherDocumentsUpload2 from "../../documentsUpload/OtherDocumentsUpload2"
import OtherDocumentsUpload3 from "../../documentsUpload/OtherDocumentsUpload3"
import JoditEditor from "../../../common/joditReact_Component/JoditReact"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"
import { toast } from "react-toastify"
import DOMPurify from "dompurify"

const Index = () => {
  // const [table, setTable] = useState([])
  const [officeName, setOfficeName] = useState([
    { id: 1, officeNameEn: "", officeNameMr: "" },
  ])
  const [departmentName, setDepartmentName] = useState([])
  const [committeeName, setCommitteeName] = useState([])
  const [financialYear, setFinancialYear] = useState([])
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("")
  const [docketType, setDocketType] = useState([
    { id: 1, docketTypeEn: "", docketTypeMr: "" },
  ])
  const [docket, setDocket] = useState()
  const [attachment1, setAttachment1] = useState("")
  const [originalFileName_1, setOriginalFileName_1] = useState("")

  const [attachment2, setAttachment2] = useState("")
  const [originalFileName_2, setOriginalFileName_2] = useState("")

  const [attachment3, setAttachment3] = useState("")
  const [originalFileName_3, setOriginalFileName_3] = useState("")

  const [attachment4, setAttachment4] = useState("")
  const [originalFileName_4, setOriginalFileName_4] = useState("")

  const [attachment5, setAttachment5] = useState("")
  const [originalFileName_5, setOriginalFileName_5] = useState("")

  // HYPERLINKS CHECKED

  const [messageToShowOnError, setMessageToShowOnError] = useState("")
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("")

  const [referenceNumberFiledChk, setReferenceNumberFiledChk] = useState(true)
  const [subjectFiledChk, setSubjectFiledChk] = useState(true)
  const [subjectDetailsFiledChk, setSubjectDetailsFiledChk] = useState(true)
  const [outwardNumberFiledChk, setOutwardNumberFiledChk] = useState(true)
  const [budgetHeadFiledChk, setBudgetHeadFiledChk] = useState(true)
  const [inwardNumberFiledChk, setInwardNumberFiledChk] = useState(true)

  const [selectedValues, setSelectedValues] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingDoc, setLoadingDoc] = useState(false)

  // @ts-ignore
  const language = useSelector((state) => state?.labels.language)

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

  const refToRTE = useRef(null)
  const refToRTEDetails = useRef(null)
  const [refContent, setRefContent] = useState("")
  const [refDetails, setRefDetails] = useState("")

  //Docket Details
  let docketSchema = yup.object().shape({
    subjectDate: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    subject: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    departmentId: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    docketType: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    amount: yup
      .string()
      .required(<FormattedLabel id="thisFieldIsrequired" />)
      .matches(
        /^[0-9]+$/,
        language == "en"
          ? "Amount must be a valid number"
          : "संख्या वैध असणे आवश्यक आहे"
      ),
  })

  const {
    register,
    // handleSubmit: handleSubmit,
    handleSubmit,
    setValue,
    // @ts-ignore
    // methods,
    watch,
    reset,
    control,
    // watch,
    setError,
    clearErrors,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(docketSchema),
  })

  useEffect(() => {
    //Get Department
    setLoading(true)
    axios
      .get(`${URLs.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Department: ", res.data.department)
        setDepartmentName(
          res?.data?.department
            ?.sort((a, b) => {
              const nameA = a?.department?.trimStart().toLowerCase() // Convert names to lowercase for case-insensitive sorting
              const nameB = b?.department?.trimStart().toLowerCase()
              if (nameA < nameB) return -1
              if (nameA > nameB) return 1
              return 0
            })
            .map((j) => ({
              id: j.id,
              departmentNameEn: j.department,
              departmentNameMr: j.departmentMr,
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
        setLoading(false)
        callCatchMethod(error, language)
      })

    //Get Committee
    setLoading(true)
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAllForDropDown`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Committee: ", res.data.committees)
        setCommitteeName(
          res?.data?.committees?.map((j) => ({
            id: j.id,
            committeeNameEn: j.committeeName,
            committeeNameMr: j.committeeNameMr,
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
        setLoading(false)
        callCatchMethod(error, language)
      })

    //Get Financial Year
    setLoading(true)
    axios
      .get(`${URLs.CFCURL}/master/financialYearMaster/getAll`, {
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
        setLoading(false)
        callCatchMethod(error, language)
      })

    //Get Docket Type
    setLoading(true)
    axios
      .get(`${URLs.MSURL}/mstDocketType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Docket Type: ", res.data.docketType)
        setDocketType(
          res.data.docketType.map((j) => ({
            id: j.id,
            docketTypeEn: j.docketType,
            docketTypeMr: j.docketTypeMr,
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
        setLoading(false)
        callCatchMethod(error, language)
      })
  }, [])

  const clearButton = () => {
    reset({
      //   id: ID,
      subjectDate: null,
      subject: "",
      officeName: "",
      departmentId: "",
      financialYear: "",
      docketType: "",
      subjectSummary: "",
      amount: "",
    })
    setAttachment1("")
    setAttachment2("")
    setAttachment3("")
    setAttachment4("")
    setAttachment5("")
  }

  const finalSubmit = (data) => {
    if (
      referenceNumberFiledChk &&
      subjectFiledChk &&
      subjectDetailsFiledChk &&
      outwardNumberFiledChk &&
      budgetHeadFiledChk &&
      inwardNumberFiledChk
    ) {
      const clonedData = { ...data }

      // Remove the 'committeeName' property from the clonedData object
      delete clonedData?.committeeName

      const bodyForAPI = {
        ...clonedData,
        agendaNo: router?.query?.agendaNo,
        inwardNumber: data.inwardNumber,
        outwardNumber: data.outwardNumber,

        departmentId: Number(clonedData?.departmentId),
        docketType: Number(clonedData?.docketType),
        subjectSummary: refContent,
        subjectDetails: refDetails,
        commett: [
          {
            committeeId: Number(router?.query?.committeeId),
            priority: 1,
          },
        ],
        financialYear: selectedFinancialYear,
        vishaypatra: attachment1,
        prapatra: attachment2,
        otherDocument: attachment3,
        otherDocument2: attachment4,
        otherDocument3: attachment5,
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        vishaypatraOriginalName: originalFileName_1,
        prapatraOriginalName: originalFileName_2,
        otherDocumentOriginalName: originalFileName_3,
        otherDocument2OriginalName: originalFileName_4,
        otherDocument3OriginalName: originalFileName_5,
      }
      console.log(":z1", bodyForAPI)
      sweetAlert({
        title: "Are you sure?",
        text: "",
        icon: "warning",
        buttons: ["Cancel", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          setLoading(true)
          axios
            .post(`${URLs.MSURL}/trnNewDocketEntry/saveNewDocket`, bodyForAPI, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              if (res.status === 200 || res.status === 201) {
                sweetAlert("Saved!", "Record Saved successfully !", "success")
                clearButton()
                router.push({
                  pathname: `/municipalSecretariatManagement/transaction/minutesOfMeeting`,
                  query: {
                    agendaNo: router.query.agendaNo,
                    committeeId: router?.query?.committeeId,
                    committeName: router.query.committeName,
                    committeNameMr: router.query.committeNameMr,
                  },
                })
                setLoading(false)
              }
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
              setLoading(false)
              callCatchMethod(error, language)
            })
        }
      })
    } else {
      toast.error(
        language == "en"
          ? `Please remove the "ERROR" from the input field`
          : `कृपया इनपुट फील्डमधून "ERROR" काढा`
      )
    }
  }

  // const handleSelect = (event) => {
  //   console.log(":lok3..event", event.target.value)
  //   setSelectedValues(event.target.value)
  // }

  // ///////////////////////////////////
  function getCurrentFinancialYear() {
    const today = new Date()
    const currentMonth = today.getMonth() + 1 // Adding 1 because getMonth() returns zero-based month

    let startYear, endYear
    if (currentMonth >= 4) {
      // Financial year starts from April
      startYear = today.getFullYear()
      endYear = startYear + 1
    } else {
      // Financial year starts from the previous year's April
      startYear = today.getFullYear() - 1
      endYear = startYear + 1
    }

    const financialYear = `${startYear}-${endYear.toString().slice(-2)}`

    return financialYear
  }

  // Get the current financial year when the component mounts
  useEffect(() => {
    if (financialYear?.length !== 0) {
      const currentYear = getCurrentFinancialYear()
      const currentYearData = financialYear.find(
        (item) => item.financialYearEn === currentYear
      )
      setSelectedFinancialYear(currentYearData.id)
    }
  }, [financialYear])

  useEffect(() => {
    if (router?.query?.agendaNo && router?.query?.committeeId) {
      setValue("agendaNo", router?.query?.agendaNo)

      if (language == "en") {
        setValue("committeName", router?.query?.committeName)
      } else {
        setValue("committeName", router?.query?.committeNameMr)
      }
    }
  }, [router?.query, language])

  useEffect(() => {
    if (watch("amount")) {
      clearErrors("amount")
    } else if (watch("docketType") == 1) {
      clearErrors("amount")
    } else if (!watch("docketType")) {
      clearErrors("amount")
    } else {
      setError("amount", {
        type: "manual", // You can use 'manual' type for custom errors
        message: <FormattedLabel id="thisFieldIsrequired" />,
      })
    }
  }, [watch("amount"), watch("docketType")])

  //  VALIDATION FOR NONMANDATORY FIELDS

  const error1Messsage = () => {
    if (language == "en") {
      return messageToShowOnError
    } else {
      return messageToShowOnErrorMr
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
            setMessageToShowOnError("Potential CSV injection detected! 😣")
            setMessageToShowOnErrorMr("संभाव्य CSV इंजेक्शन आढळले! 😣")
          } else {
            const sanitizedValue = DOMPurify.sanitize(fieldValue)

            if (fieldValue !== sanitizedValue) {
              setFieldChk(false)
              setMessageToShowOnError(
                "Potential HTML/Script injection detected! 😣"
              )
              setMessageToShowOnErrorMr(
                "संभाव्य एचटीएमएल/स्क्रिप्ट इंजेक्शन आढळले! 😣"
              )
            } else {
              setFieldChk(true)
            }
          }
        } else {
          setFieldChk(false)
          setMessageToShowOnError("Hyperlink is not allowed 😒")
          setMessageToShowOnErrorMr("हायपरलिंकला परवानगी नाही 😒")
        }
      } else {
        setFieldChk(false)
        setMessageToShowOnError(
          "Value should not start with any special character 😒"
        )
        setMessageToShowOnErrorMr(
          "मूल्य कोणत्याही विशेष वर्णाने सुरू होऊ नये 😒"
        )
      }
    }

    checkField("reference", setReferenceNumberFiledChk)
    checkField("subject", setSubjectFiledChk)
    checkField("budgetHead", setBudgetHeadFiledChk)
    checkField("inwardNumber", setInwardNumberFiledChk)
    checkField("outwardNumber", setOutwardNumberFiledChk)
  }, [
    watch("reference"),
    watch("subject"),
    watch("budgetHead"),
    watch("inwardNumber"),
    watch("outwardNumber"),
  ])

  return (
    <>
      <Head>
        <title>New Docket Entry</title>
      </Head>

      <Paper className={styles.main}>
        <div className={styles.title}>
          <FormattedLabel id="additionalDocketEntry" />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div style={{ marginTop: 40 }}>
            <form onSubmit={handleSubmit(finalSubmit)} autoComplete="off">
              <div>
                <div
                  className={styles.row}
                  style={{ justifyContent: "center" }}
                >
                  <TextField
                    disabled
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="agendaNo" required />}
                    variant="standard"
                    {...register("agendaNo")}
                    InputLabelProps={{
                      shrink: router?.query?.agendaNo ? true : false,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    flexWrap: "wrap",
                    width: "100%",
                    marginTop: 30,
                    marginBottom: 20,
                  }}
                >
                  <FormControl error={!!error.subjectDate}>
                    <Controller
                      control={control}
                      name="subjectDate"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            inputFormat="dd/MM/yyyy"
                            label={
                              <span>
                                <FormattedLabel id="subjectDate" required />
                              </span>
                            }
                            disabled={router.query.subjectDate ? true : false}
                            disablePast
                            value={
                              router.query.subjectDate
                                ? router.query.subjectDate
                                : field.value
                            }
                            onChange={(date) =>
                              field.onChange(
                                moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                sx={{ width: "30vmin" }}
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
                      {error?.subjectDate ? error.subjectDate.message : null}
                    </FormHelperText>
                  </FormControl>

                  <TextField
                    disabled
                    InputLabelProps={{
                      shrink: router?.query?.committeeId ? true : false,
                    }}
                    id="standard-basic"
                    sx={{ width: "50vmin" }}
                    label={<FormattedLabel id="committeName" required />}
                    variant="standard"
                    {...register("committeName")}
                  />

                  <FormControl variant="standard" error={!!error.departmentId}>
                    <InputLabel
                      id="demo-simple-select-standard-label"
                      //   disabled={isDisabled}
                    >
                      <FormattedLabel id="departmentName" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: "50vmin" }}
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label="departmentName"
                        >
                          {departmentName &&
                            departmentName.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  //@ts-ignore
                                  value.id
                                }
                              >
                                {language == "en"
                                  ? //@ts-ignore
                                    value.departmentNameEn
                                  : // @ts-ignore
                                    value?.departmentNameMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="departmentId"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {error?.departmentId ? error.departmentId.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>

                <div className={styles.row}>
                  <strong>{<FormattedLabel id="reference" />}</strong>
                  <TextareaAutosize
                    color="neutral"
                    disabled={false}
                    minRows={1}
                    maxRows={3}
                    placeholder={
                      language == "en"
                        ? "Department File Reference Number"
                        : "विभाग फाइल संदर्भ क्रमांक"
                    }
                    className={styles.bigText}
                    {...register("reference")}
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {!referenceNumberFiledChk ? error1Messsage() : ""}
                  </FormHelperText>
                </div>

                <div className={styles.row}>
                  <strong>{<FormattedLabel id="subject" required />}</strong>
                  <TextareaAutosize
                    color="neutral"
                    disabled={false}
                    minRows={1}
                    maxRows={3}
                    placeholder={language == "en" ? "Subject" : "विषय"}
                    className={styles.bigText}
                    {...register("subject")}
                    error={!!error.subject}
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {error?.subject ? error.subject.message : null}
                    {!subjectFiledChk ? error1Messsage() : ""}
                  </FormHelperText>
                </div>

                <div className={styles.row}>
                  <strong>
                    {<FormattedLabel id="subjectSummary" required />}
                  </strong>
                </div>
                <JoditEditor
                  ref={refToRTE}
                  value={refContent}
                  onBlur={(newCont) => setRefContent(newCont)}
                />

                <div className={styles.row} style={{ marginBottom: "20px" }}>
                  <strong>{<FormattedLabel id="subjectDetails" />}</strong>
                  {/* <TextareaAutosize
                    color="neutral"
                    disabled={false}
                    minRows={1}
                    style={{ overflow: "auto" }}
                    placeholder={
                      language == "en" ? "subject Details" : "विषय तपशील"
                    }
                    className={styles.bigText}
                    {...register("subjectDetails")}
                  />
                  <FormHelperText style={{ color: "red" }}>
                    {!subjectDetailsFiledChk ? error1Messsage() : ""}
                  </FormHelperText> */}
                </div>
                <JoditEditor
                  ref={refToRTEDetails}
                  value={refDetails}
                  onBlur={(newCont) => setRefDetails(newCont)}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    marginTop: 20,
                    gap: 30,
                    flexWrap: "wrap",
                  }}
                >
                  <FormControl variant="standard">
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="financialYear" required />
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          disabled={true}
                          id="financialYear"
                          value={selectedFinancialYear}
                          // onChange={handleDropdownChange}
                          sx={{
                            width: "230px",
                          }}
                          name="financialYear"
                        >
                          {financialYear &&
                            financialYear?.map((financialYear) => (
                              <MenuItem
                                key={financialYear.id}
                                value={financialYear.id}
                              >
                                {language == "en"
                                  ? financialYear?.financialYearEn
                                  : financialYear?.financialYearMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="financialYear"
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>

                  <FormControl variant="standard" error={!!error.docketType}>
                    <InputLabel id="demo-simple-select-standard-label">
                      <FormattedLabel id="docketType" required />
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
                            setDocket(value.target.value)
                            if (value.target.value === 1) {
                              setValue("amount", 0)
                              clearErrors("amount")
                            } else {
                              setValue("amount", "")
                              setError("amount", {
                                type: "manual", // You can use 'manual' type for custom errors
                                message: (
                                  <FormattedLabel id="thisFieldIsrequired" />
                                ),
                              })
                            }
                          }}
                          label="docketType"
                        >
                          {docketType &&
                            docketType.map((value, index) => (
                              <MenuItem
                                key={index}
                                value={
                                  //@ts-ignore
                                  value.id
                                }
                              >
                                {language == "en"
                                  ? //@ts-ignore
                                    value.docketTypeEn
                                  : // @ts-ignore
                                    value?.docketTypeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name="docketType"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {error?.docketType ? error.docketType.message : null}
                    </FormHelperText>
                  </FormControl>

                  {watch("docketType") &&
                  (watch("docketType") == 2 || watch("docketType") == 3) ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignContent: "baseline",
                      }}
                    >
                      <TextField
                        sx={{ width: "230px" }}
                        label={<FormattedLabel id="budgetHead" />}
                        variant="standard"
                        {...register("budgetHead")}
                      />
                      <FormHelperText style={{ color: "red", width: "230px" }}>
                        {!budgetHeadFiledChk ? error1Messsage() : ""}
                      </FormHelperText>
                    </div>
                  ) : (
                    ""
                  )}

                  <TextField
                    disabled={
                      watch("docketType") == 2 || watch("docketType") == 3
                        ? false
                        : true
                    }
                    type="number"
                    sx={{ width: "230px" }}
                    label={<FormattedLabel id="amount" required />}
                    variant="standard"
                    {...register("amount")}
                    error={!!error.amount}
                    helperText={error?.amount ? error.amount.message : null}
                    InputLabelProps={{
                      shrink: watch("docketType") ? true : false,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "baseline",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="inwardNumber" />}
                      variant="standard"
                      {...register("inwardNumber")}
                    />
                    <FormHelperText style={{ color: "red", width: "230px" }}>
                      {!inwardNumberFiledChk ? error1Messsage() : ""}
                    </FormHelperText>
                  </div>
                  {/* //////////////// */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignContent: "baseline",
                    }}
                  >
                    <TextField
                      id="standard-basic"
                      sx={{ width: "230px" }}
                      label={<FormattedLabel id="outwardNumber" />}
                      variant="standard"
                      {...register("outwardNumber")}
                    />
                    <FormHelperText style={{ color: "red", width: "230px" }}>
                      {!outwardNumberFiledChk ? error1Messsage() : ""}
                    </FormHelperText>
                  </div>
                </div>

                {/* ////////////////////////////////////////////////////////// */}

                <div className={styles.title} style={{ marginTop: "35px" }}>
                  <FormattedLabel id="documentSection" />
                </div>
                <div
                  style={{
                    textAlign: "center",
                    color: "red",
                    marginTop: "20px",
                    fontWeight: 500,
                    textDecoration: "underline",
                    fontSize: "16px",
                  }}
                >
                  <strong>
                    {language == "en"
                      ? "* MAXIMUM FILE SIZE SHOULD BE 20MB"
                      : "* फाईलचा कमाल आकार २0MB असावा"}
                  </strong>
                </div>

                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "20px 0px 10px 0px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <TableContainer style={{ border: "2px solid #7088F3" }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{
                              borderRight: "1px solid black",
                              minWidth: 280,
                            }}
                          >
                            <VishapatraUpload
                              appName="TP"
                              serviceName="PARTMAP"
                              label={
                                language == "en" ? "VISHYAPATRA" : "विषय पत्र"
                              }
                              originalName={setOriginalFileName_1}
                              filePath={attachment1}
                              fileUpdater={setAttachment1}
                              setLoading={setLoadingDoc}
                            />
                            <hr />
                            <span>
                              upload all types of files(jpg, pdf etc.)
                            </span>
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "1px solid black",
                              minWidth: 280,
                            }}
                          >
                            <PrapatraUpload
                              appName="TP"
                              serviceName="PARTMAP"
                              label={<FormattedLabel id="prapatra" />}
                              originalName={setOriginalFileName_2}
                              filePath={attachment2}
                              fileUpdater={setAttachment2}
                              setLoading={setLoadingDoc}
                            />
                            <hr />
                            <span style={{ color: "red" }}>
                              acceptable file format is (.xlxs)
                            </span>
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "1px solid black",
                              minWidth: 280,
                            }}
                          >
                            <OtherDocumentsUpload
                              appName="TP"
                              serviceName="PARTMAP"
                              label={
                                language == "en"
                                  ? "OTHER DOCUMENT_1"
                                  : "इतर दस्तऐवज_1"
                              }
                              originalName={setOriginalFileName_3}
                              filePath={attachment3}
                              fileUpdater={setAttachment3}
                              setLoading={setLoadingDoc}
                            />
                            <hr />
                            <span>
                              upload all types of files(jpg, pdf etc.)
                            </span>
                          </TableCell>
                          <TableCell
                            style={{
                              borderRight: "1px solid black",
                              minWidth: 280,
                            }}
                          >
                            <OtherDocumentsUpload2
                              appName="TP"
                              serviceName="PARTMAP"
                              label={
                                language == "en"
                                  ? "OTHER DOCUMENT_2"
                                  : "इतर दस्तऐवज_2"
                              }
                              originalName={setOriginalFileName_4}
                              filePath={attachment4}
                              fileUpdater={setAttachment4}
                              setLoading={setLoadingDoc}
                            />
                            <hr />
                            <span>
                              upload all types of files(jpg, pdf etc.)
                            </span>
                          </TableCell>
                          <TableCell>
                            <OtherDocumentsUpload3
                              appName="TP"
                              serviceName="PARTMAP"
                              label={
                                language == "en"
                                  ? "OTHER DOCUMENT_3"
                                  : "इतर दस्तऐवज_3"
                              }
                              originalName={setOriginalFileName_5}
                              filePath={attachment5}
                              fileUpdater={setAttachment5}
                              setLoading={setLoadingDoc}
                            />
                            <hr />
                            <span>
                              upload all types of files(jpg, pdf etc.)
                            </span>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* ////////////////////////////////////////////////////////// */}

                <div className={styles.buttons}>
                  <Button
                    variant="contained"
                    type="submit"
                    // disabled={attachment1 ? false : true}
                    endIcon={<Save />}
                  >
                    <FormattedLabel id="save" />
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    endIcon={<Clear />}
                    onClick={clearButton}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                  {/* <Button
                    variant="contained"
                    color="error"
                    endIcon={<ExitToApp />}
                    // onClick={onBack}
                    onClick={() => {
                      router.push("/municipalSecretariatManagement/dashboard")
                    }}
                  >
                    <FormattedLabel id="exit" />
                  </Button> */}
                  <Button
                    // disabled={corporators ? false : true}
                    color="error"
                    variant="contained"
                    endIcon={<ExitToApp />}
                    onClick={() => {
                      router.back()
                    }}
                  >
                    <FormattedLabel id="back" />
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </Paper>
    </>
  )
}

export default Index
