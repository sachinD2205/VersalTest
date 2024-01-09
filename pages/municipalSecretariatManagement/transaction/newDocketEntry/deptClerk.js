import React, { useState, useEffect, useRef } from "react"
import Head from "next/head"
import router from "next/router"
import styles from "./newDocketEntry.module.css"

import Paper from "@mui/material/Paper"
import {
  Button,
  IconButton,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
  Tooltip,
  Box,
  CircularProgress,
  Autocomplete,
  Checkbox,
  ListItemText,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
} from "@mui/material"
import Add from "@mui/icons-material/Add"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import {
  Clear,
  Close,
  Edit,
  ExitToApp,
  Save,
  Visibility,
} from "@mui/icons-material"
import Slide from "@mui/material/Slide"
import FormControl from "@mui/material/FormControl"
import { Controller, useForm } from "react-hook-form"
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DoneIcon from "@mui/icons-material/Done"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import VishapatraUpload from "../../documentsUpload/VishapatraUpload"
import PrapatraUpload from "../../documentsUpload/PrapatraUpload"
import OtherDocumentsUpload from "../../documentsUpload/OtherDocumentsUpload"
import OtherDocumentsUpload2 from "../../documentsUpload/OtherDocumentsUpload2"
import OtherDocumentsUpload3 from "../../documentsUpload/OtherDocumentsUpload3"
import { toast } from "react-toastify"
import JoditEditor from "../../../common/joditReact_Component/JoditReact"
import Loader from "../../../../containers/Layout/components/Loader"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"
import DOMPurify from "dompurify"
import OriginalDocketPrintComponent from "./originalDocketPrintComponent/OriginalDocketPrintComponent"

const Index = () => {
  const [table, setTable] = useState([])

  const [originaDocketData, setOriginaDocketData] = useState(null)

  const [filteredDataForTable, setFilteredDataForTable] = useState([])
  const [filteredCommitteDropdownValue, setFilteredCommitteDropdownValue] =
    useState("")
  const [docketFilterButtons, setDocketFilterButtons] = useState([])
  const [onButtonClick, setOnButtonClick] = useState(false)

  const [collapseHistoryTable, setCollapseHistoryTable] = useState(false)
  const [collapseMyOriginalContent, setCollapseMyOriginalContent] =
    useState(false)

  const refToRTE = useRef(null)
  const refToRTEDetails = useRef(null)
  const [refContent, setRefContent] = useState("")
  const [refDetails, setRefDetails] = useState("")
  const parser = new DOMParser()

  //////////////////////////////////////Showing To the particular HOD of the dept/////////////////////////////
  const selecedHOD = useSelector((state) => {
    return state?.user?.user?.userDao?.department
  })

  useEffect(() => {
    if (collapse === true) {
      setValue("subjectDate", moment(new Date()).format("YYYY-MM-DD"))
    } else {
      setValue("subjectDate", moment(new Date()).format("YYYY-MM-DD"))
    }
  })

  const [officeName, setOfficeName] = useState([
    { id: 1, officeNameEn: "", officeNameMr: "" },
  ])
  const [departmentName, setDepartmentName] = useState([])
  const [committeeName, setCommitteeName] = useState([])
  const [financialYear, setFinancialYear] = useState([])
  const [docketType, setDocketType] = useState([
    { id: 1, docketTypeEn: "", docketTypeMr: "" },
  ])
  const [docket, setDocket] = useState()
  const [attachment1, setAttachment1] = useState("")
  const [originalFileName_1, setOriginalFileName_1] = useState("")
  const [originalFileNameOnEdit_1, setOriginalFileNameOnEdit_1] = useState("")

  const [attachment2, setAttachment2] = useState("")
  const [originalFileName_2, setOriginalFileName_2] = useState("")
  const [originalFileNameOnEdit_2, setOriginalFileNameOnEdit_2] = useState("")

  const [attachment3, setAttachment3] = useState("")
  const [originalFileName_3, setOriginalFileName_3] = useState("")
  const [originalFileNameOnEdit_3, setOriginalFileNameOnEdit_3] = useState("")

  const [attachment4, setAttachment4] = useState("")
  const [originalFileName_4, setOriginalFileName_4] = useState("")
  const [originalFileNameOnEdit_4, setOriginalFileNameOnEdit_4] = useState("")

  const [attachment5, setAttachment5] = useState("")
  const [originalFileName_5, setOriginalFileName_5] = useState("")
  const [originalFileNameOnEdit_5, setOriginalFileNameOnEdit_5] = useState("")

  const [runAgain, setRunAgain] = useState(false)
  const [collapse, setCollapse] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false)
  const [selectedValues, setSelectedValues] = useState([])
  const [matchedIds, setMatchedIds] = useState([])

  const [showSelectedComFieldError, setShowSelectedComFieldError] =
    useState(false)

  const [initialRender, setInitialRender] = useState(true)
  //////////////////// WHILE RECIEVING RESPONSE/////////////////

  const [selectedFinancialYear, setSelectedFinancialYear] = useState([])
  const [isDisabled, setIsDisabled] = useState(true)

  const [masterLoading, setMasterLoading] = useState(true)

  const [senderDepartmentEn, setSenderDepartmentEn] = useState(null)
  const [senderNameEn, setSenderNameEn] = useState(null)

  const [senderDepartmentMr, setSenderDepartmentMr] = useState(null)
  const [senderNameMr, setSenderNameMr] = useState(null)

  const [dataForHistoryTable, setDataForHistoryTable] = useState([])

  // HYPERLINKS CHECKED
  const [messageToShowOnError, setMessageToShowOnError] = useState("")
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("")

  const [referenceNumberFiledChk, setReferenceNumberFiledChk] = useState(true)
  const [subjectFiledChk, setSubjectFiledChk] = useState(true)
  const [outwardNumberFiledChk, setOutwardNumberFiledChk] = useState(true)
  const [budgetHeadFiledChk, setBudgetHeadFiledChk] = useState(true)
  const [nameOfApproverFiledChk, setNameOfApproverFiledChk] = useState(true)
  const [toDepartmentFiledChk, setToDepartmentFiledChk] = useState(true)
  const [toDesignationFiledChk, setToDesignationFiledChk] = useState(true)

  const [docketNumber, setDocketNumber] = useState(null)

  const [pageSize, setPageSize] = useState(5)
  const [pageSizeForHistory, setPageSizeForHistory] = useState(5)

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

  //Docket Details
  let docketSchema = yup.object().shape({
    subjectDate: yup
      .string()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    subject: yup
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
    commett: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
  })

  const {
    register,
    handleSubmit,
    setValue,
    methods,
    watch,
    reset,
    control,
    clearErrors,
    setError,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(docketSchema),
  })

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${URLs.MSURL}/mstElectoral/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setOfficeName(
          r?.data?.electoral?.map((row) => ({
            id: row.id,
            officeNameEn: row.electoralWardName,
            officeNameMr: row.electoralWardNameMr,
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
        setMasterLoading(false)
        callCatchMethod(error, language)
      })

    //Get Department
    setLoading(true)
    axios
      .get(`${URLs.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDepartmentName(
          res?.data?.department?.map((j) => ({
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
        setMasterLoading(false)
        callCatchMethod(error, language)
      })

    //Get Designation
    setLoading(true)
    axios
      .get(`${URLs.CFCURL}/master/designation/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        // setDepartmentName(
        //   res?.data?.department?.map((j) => ({
        //     id: j.id,
        //     departmentNameEn: j.department,
        //     departmentNameMr: j.departmentMr,
        //   }))
        // )
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
        setMasterLoading(false)
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
        setMasterLoading(false)
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
        setMasterLoading(false)
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
        setMasterLoading(false)
        callCatchMethod(error, language)
      })
  }, [])

  ////////////////////////////////////////////
  const fullNameToSend = useSelector((state) => {
    return state?.user?.user?.userDao
  })

  useEffect(() => {
    if (selecedHOD && departmentName?.length != 0) {
      const sendNameEn = departmentName?.find(
        (o) => o?.id == selecedHOD
      )?.departmentNameEn

      setSenderDepartmentEn(sendNameEn)

      const sendNameMr = departmentName?.find(
        (o) => o?.id == selecedHOD
      )?.departmentNameMr

      setSenderDepartmentMr(sendNameMr)

      //////////////////////////////////////
      if (
        fullNameToSend?.firstNameEn &&
        fullNameToSend?.firstNameMr &&
        fullNameToSend?.middleNameEn &&
        fullNameToSend?.middleNameMr &&
        fullNameToSend?.lastNameEn &&
        fullNameToSend?.lastNameMr
      ) {
        setSenderNameEn(
          `${fullNameToSend.firstNameEn} ${fullNameToSend.middleNameEn} ${fullNameToSend.lastNameEn}`
        )
        setSenderNameMr(
          `${fullNameToSend.firstNameMr} ${fullNameToSend.middleNameMr} ${fullNameToSend.lastNameMr}`
        )
      } else if (
        fullNameToSend?.firstNameEn &&
        fullNameToSend?.firstNameMr &&
        !fullNameToSend?.middleNameEn &&
        !fullNameToSend?.middleNameMr &&
        fullNameToSend?.lastNameEn &&
        fullNameToSend?.lastNameMr
      ) {
        setSenderNameEn(
          `${fullNameToSend.firstNameEn} ${fullNameToSend.lastNameEn}`
        )
        setSenderNameMr(
          `${fullNameToSend.firstNameMr} ${fullNameToSend.lastNameMr}`
        )
      }
    }
  }, [departmentName])
  ////////////////////////////////////////////

  useEffect(() => {
    if (language == "en") {
      setLoading(true)
      setValue(
        "departmentId",
        departmentName
          ?.filter((ob) => {
            return ob.id === selecedHOD
          })
          .map((obj) => {
            return obj.departmentNameEn
          })
      )
      setLoading(false)
    } else {
      setLoading(true)
      setValue(
        "departmentId",
        departmentName
          ?.filter((ob) => {
            return ob.id === selecedHOD
          })
          .map((obj) => {
            return obj?.departmentNameMr
          })
      )
      setLoading(false)
    }
  })

  ////////////////////////////////////////

  useEffect(() => {
    if (
      departmentName?.length > 0 &&
      financialYear?.length > 0 &&
      committeeName?.length > 0
    ) {
      setRunAgain(false)
      //Table

      axios
        .get(`${URLs.MSURL}/trnNewDocketEntry/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setTable(
            res?.data?.newDocketEntry
              // .filter((obj) => {
              //   return (
              //     obj.status === "INITIATED" ||
              //     obj.status === "REASSIGN" ||
              //     obj.status === "IN PROCESS" ||
              //     obj.status === "FREEZED"
              //   );
              // })
              .filter((ob) => {
                return (
                  ob?.departmentId === selecedHOD &&
                  ob?.status !== "REASSIGN_TO_SECRETARY_CLERK"
                )
              })
              .map((j, i) => ({
                ...j,
                id: j.id,
                srNo: i + 1,
                vishaypatra: j.vishaypatra,
                prapatra: j.prapatra,
                otherDocument: j.otherDocument,
                subjectStatus: j.status,
                statusChanged:
                  j.status === "INITIATED"
                    ? "SEND TO THE DEPARTMENT HOD"
                    : "" || j.status === "SUBMITTED"
                    ? "APPROVED BY THE DEPARTMENT HOD"
                    : "" || j.status === "IN PROCESS"
                    ? "APPROVED BY THE SECRETARY CLERK"
                    : "" || j.status === "FREEZED"
                    ? "APPROVED BY THE SECRETARY"
                    : "" || j.status === "REASSIGN"
                    ? "REVERTED BACK"
                    : "",
                subject: j.subject,
                subjectSummary: j.subjectSummary,
                subjectSerialNumber: j.subjectSerialNumber,
                subjectDate: j.subjectDate,
                subjectDateShow:
                  j.subjectDate !== null
                    ? moment(j.subjectDate).format("DD-MM-YYYY")
                    : " --- ",
                approvedDate:
                  j.approvedDate === null
                    ? "Will Get After Approval"
                    : moment(j.approvedDate).format("DD-MM-YYYY, h:mm a"),
                financialYearEn: financialYear?.find((obj) => {
                  return obj.id === j.financialYear
                })?.financialYearEn,
                financialYearMr: financialYear?.find((obj) => {
                  return obj.id === j.financialYear
                })?.financialYearMr,
                // committeeIdEn:
                //   typeof j.committeeId === "string"
                //     ? j.committeeId
                //         ?.split(",")
                //         .slice(1, -1)
                //         ?.map((val) => {
                //           return committeeName?.find((obj) => {
                //             return obj.id == val && obj
                //           })?.committeeNameEn
                //         })
                //         .toString()
                //     : "-----",
                commett: j.commett,
                committeeIdEn: j.commett?.map((val) => {
                  return committeeName?.find((obj) => {
                    return obj.id == val.committeeId && obj
                  })?.committeeNameEn
                }),
                // committeeIdMr:
                //   typeof j.committeeId === "string"
                //     ? j.committeeId
                //         ?.split(",")
                //         .slice(1, -1)
                //         ?.map((val) => {
                //           return committeeName?.find((obj) => {
                //             return obj.id == val && obj
                //           })?.committeeNameMr
                //         })
                //         .toString()
                //     : "-----",
                committeeIdMr: j.commett?.map((val) => {
                  return committeeName?.find((obj) => {
                    return obj.id == val.committeeId && obj
                  })?.committeeNameMr
                }),
                history: j.history,
                outwardNumber: j.outwardNumber,
                reference: j.reference,
                departmentNameEn: departmentName?.find(
                  (obj) => obj.id === j.departmentId
                )?.departmentNameEn,
                departmentNameMr: departmentName?.find(
                  (obj) => obj.id === j.departmentId
                )?.departmentNameMr,
                originalDocketEntry: j.originalDocketEntry,
                docketId: j.docketId,
              }))
          )
          setMasterLoading(false) // Stop loading
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
          console.log(":a2", error)
          setMasterLoading(false) // Stop loading
          callCatchMethod(error, language)
        })
    }
  }, [financialYear, committeeName, runAgain, departmentName])

  const columns = [
    {
      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 90,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 10,
              fontWeight: "bold",
            }}
          >
            {params?.row?.srNo}

            {params?.row?.statusChanged === "APPROVED BY THE SECRETARY" && (
              <div
                style={{
                  color: "green",
                }}
              >
                <Tooltip title="APPROVED BY THE SECRETARY">
                  <CheckCircleIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged ===
              "APPROVED BY THE SECRETARY CLERK" && (
              <div
                style={{
                  color: "#a13eed",
                }}
              >
                <Tooltip title="APPROVED BY THE SECRETARY CLERK">
                  <CheckCircleOutlineIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged ===
              "APPROVED BY THE DEPARTMENT HOD" && (
              <div
                style={{
                  color: "blue",
                }}
              >
                <Tooltip title="APPROVED BY THE DEPARTMENT HOD">
                  <DoneIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "SEND TO THE DEPARTMENT HOD" && (
              <div
                style={{
                  color: "#EB8B0E",
                }}
              >
                <Tooltip title="SEND TO THE DEPARTMENT HOD">
                  <ArrowUpwardIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "REVERTED BACK" && (
              <div
                style={{
                  color: "red",
                }}
              >
                <Tooltip title="REASSIGNED">
                  <SettingsBackupRestoreIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
          </div>
        )
      },
    },
    {
      field: "subjectDateShow",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectDate" />,
      width: 110,
    },
    {
      field: "approvedDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="approvedDate" />,
      width: 210,
    },
    {
      field: language === "en" ? "financialYearEn" : "financialYearMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="financialYear" />,
      width: 110,
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="departmentName" />,
      width: 290,
    },
    {
      field: language === "en" ? "committeeIdEn" : "committeeIdMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeName" />,
      width: 250,
    },
    {
      field: "subject",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 250,
    },
    {
      field: "subjectSummary",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectSummary" />,
      width: 350,
      renderCell: (params) => {
        const doc = parser.parseFromString(
          params?.row?.subjectSummary,
          "text/html"
        )
        const plainTextContent = doc.body.innerText

        return <div>{plainTextContent}</div>
      },
    },
    {
      field: "statusChanged",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectStatus" />,
      width: 320,
      renderCell: (params) => {
        return (
          <div style={{ paddingLeft: "20px", fontWeight: "bold" }}>
            {/* //////////////////////////////////// */}
            {params?.row?.statusChanged === "APPROVED BY THE SECRETARY" && (
              <div
                style={{
                  color: "green",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged ===
              "APPROVED BY THE SECRETARY CLERK" && (
              <div
                style={{
                  color: "#a13eed",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged ===
              "APPROVED BY THE DEPARTMENT HOD" && (
              <div
                style={{
                  color: "blue",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
            {/* ///////////////////////////////// */}
            {params?.row?.statusChanged === "SEND TO THE DEPARTMENT HOD" && (
              <div
                style={{
                  color: "#EB8B0E",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
            {/* ////////////////////////////////////// */}
            {params?.row?.statusChanged === "REVERTED BACK" && (
              <div
                style={{
                  color: "red",
                }}
              >
                {params?.row?.statusChanged}
              </div>
            )}
          </div>
        )
      },
    },
    {
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 130,
      renderCell: (params) => {
        return (
          <>
            {
              // params?.row?.status === "INITIATED" ||
              params?.row?.status === "REASSIGN" && (
                <IconButton
                  disabled={collapse}
                  sx={{ color: "#096dd9" }}
                  onClick={() => {
                    setDocketNumber(params.row.docketId)
                    editById(params.row)
                    setOriginaDocketData(null)
                  }}
                >
                  <Tooltip title="EDIT THIS DOCKET">
                    <Edit />
                  </Tooltip>
                </IconButton>
              )
            }
            {
              // params?.row?.status !== "INITIATED" &&
              params?.row?.status !== "REASSIGN" && (
                <IconButton
                  disabled={collapse}
                  sx={{ color: "green" }}
                  onClick={() => {
                    setDocketNumber(params.row.docketId)
                    onlyViewDocket(params.row)
                    setOriginaDocketData(params.row.originalDocketEntry[0])
                  }}
                >
                  <Tooltip title="VIEW THIS DOCKET">
                    <Visibility />
                  </Tooltip>
                </IconButton>
              )
            }
          </>
        )
      },
    },
  ]

  const columnsForHistoryTable = [
    {
      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
    },
    {
      field: language == "en" ? "senderName" : "senderNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="senderName" />,
      flex: 1,
    },
    {
      field: language == "en" ? "senderDepartment" : "senderDepartmentMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="senderDepartment" />,
      flex: 1,
    },
    {
      field: language == "en" ? "senderDesignation" : "senderDesignationMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="senderDesignation" />,
      flex: 1,
    },
    {
      field: "sendDateTime",
      headerAlign: "center",
      headerName: <FormattedLabel id="sentDateTime" />,
      flex: 1,
    },
    {
      field: "remark",
      headerAlign: "center",
      headerName: <FormattedLabel id="senderRemark" />,
      flex: 1,
    },
  ]

  const [ID, setID] = useState(null)

  const [openHistoryOnEdit, setOpenHistoryOnEdit] = useState(false)

  const editById = (values) => {
    setOpenHistoryOnEdit(true)
    setID(values.id)
    reset({
      ...values,
    })
    setRefContent(values.subjectSummary)
    setRefDetails(values.subjectDetails)
    setAttachment1(values.vishaypatra)
    setAttachment2(values.prapatra)
    setAttachment3(values.otherDocument)
    setAttachment4(values.otherDocument2)
    setAttachment5(values.otherDocument3)
    // >>>>>>>>>>>>>>>>>>>>>>>
    setOriginalFileNameOnEdit_1(values.vishaypatraOriginalName)
    setOriginalFileNameOnEdit_2(values.prapatraOriginalName)
    setOriginalFileNameOnEdit_3(values.otherDocumentOriginalName)
    setOriginalFileNameOnEdit_4(values.otherDocument2OriginalName)
    setOriginalFileNameOnEdit_5(values.otherDocument3OriginalName)
    // >>>>>>>>>>>>>>>>>>>>>>>
    setValue("commett", values?.commett[0]?.committeeId)
    // setSelectedValues(values?.commett?.map((obj) => obj.committeeId))
    setCollapse(true)
    setDataForHistoryTable(
      values?.history?.map((o, i) => ({
        id: o.id,
        srNo: i + 1,
        senderName: o.senderName,
        senderNameMr: o.senderNameMr,
        senderDepartment: o.senderDepartment,
        senderDepartmentMr: o.senderDepartmentMr,
        senderDesignation: o.senderDesignation,
        senderDesignationMr: o.senderDesignationMr,
        sendDateTime: moment(o?.sendDateTime).format("DD-MM-YYYY HH:mm"),
        remark: o.remark,
      }))
    )
    setCollapseHistoryTable(false)
  }

  const [disSaveBtn, setDisSaveBtn] = useState(false)

  const onlyViewDocket = (values) => {
    setDisSaveBtn(true)
    reset({
      ...values,
    })
    setRefContent(values.subjectSummary)
    setRefDetails(values.subjectDetails)
    setAttachment1(values.vishaypatra)
    setAttachment2(values.prapatra)
    setAttachment3(values.otherDocument)
    setAttachment4(values.otherDocument2)
    setAttachment5(values.otherDocument3)
    // >>>>>>>>>>>>>>>>>>>>>>>
    setOriginalFileNameOnEdit_1(values.vishaypatraOriginalName)
    setOriginalFileNameOnEdit_2(values.prapatraOriginalName)
    setOriginalFileNameOnEdit_3(values.otherDocumentOriginalName)
    setOriginalFileNameOnEdit_4(values.otherDocument2OriginalName)
    setOriginalFileNameOnEdit_5(values.otherDocument3OriginalName)
    // >>>>>>>>>>>>>>>>>>>>>>>
    setValue("commett", values?.commett[0]?.committeeId)
    // setSelectedValues(values?.commett?.map((obj) => obj.committeeId))
    setCollapse(true)
    setDataForHistoryTable(
      values?.history?.map((o, i) => ({
        id: o.id,
        srNo: i + 1,
        senderName: o.senderName,
        senderNameMr: o.senderNameMr,
        senderDepartment: o.senderDepartment,
        senderDesignation: o.senderDesignation,
        sendDateTime: moment(o?.sendDateTime).format("DD-MM-YYYY HH:mm"),
        remark: o.remark,
      }))
    )
    setCollapseHistoryTable(false)
    setCollapseMyOriginalContent(false)
  }

  const clearButton = () => {
    reset({
      id: ID,
      reference: "",
      subject: "",
      docketType: "",
      subjectSummary: "",
      subjectDetails: "",
      amount: "",
      outwardNumber: "",
      nameOfApprover: "",
      toDesignation: "",
      toDepartment: "",
    })
    setSelectedValues([])
    setRefContent("")
    setRefDetails("")
    setAttachment1("")
    setAttachment2("")
    setAttachment3("")
    setAttachment4("")
    setAttachment5("")
    // >>>>>>>>>>>>>>>>>>>>>>>
    setOriginalFileNameOnEdit_1("")
    setOriginalFileNameOnEdit_2("")
    setOriginalFileNameOnEdit_3("")
    setOriginalFileNameOnEdit_4("")
    setOriginalFileNameOnEdit_5("")
    // >>>>>>>>>>>>>>>>>>>>>>>
  }

  const finalSubmit = (data) => {
    const bodyForAPI = {
      ...data,
      subjectSummary: refContent,
      subjectDetails: refDetails,
      amount: Number(data.amount),
      docketType: Number(data.docketType),
      // committeeId: selectedValues?.join(",") + ",",
      commett: [
        {
          committeeId: +watch("commett"),
          priority: 1,
        },
      ],
      // commett: selectedValues?.map((val, index) => {
      //   return {
      //     committeeId: val,
      //     priority: index + 1,
      //   }
      // }),
      financialYear: selectedFinancialYear
        ? selectedFinancialYear[0]?.id
        : null,
      departmentId: selecedHOD,
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

    const bodyForAPIForUpdate = {
      id: data.id,
      activeFlag: data.activeFlag,
      amount: Number(data.amount),
      subjectSummary: refContent,
      subjectDetails: refDetails,
      // committeeId: selectedValues?.join(",") + ",",
      commett: [
        {
          committeeId: +watch("commett"),
          priority: 1,
        },
      ],
      docketType: Number(data.docketType),
      financialYear: selectedFinancialYear
        ? selectedFinancialYear[0]?.id
        : null,
      officeName: data.officeName,
      subject: data.subject,
      subjectDate: moment(data.subjectDate).format("YYYY-MM-DD"),
      outwardNumber: data.outwardNumber,
      reference: data.reference,
      budgetHead: data.budgetHead,
      nameOfApprover: data.nameOfApprover,
      toDepartment: data.toDepartment,
      toDesignation: data.toDesignation,
      ///////////////////////////////////
      departmentId: selecedHOD,
      vishaypatra: attachment1,
      prapatra: attachment2,
      otherDocument: attachment3,
      otherDocument2: attachment4,
      otherDocument3: attachment5,
      //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      vishaypatraOriginalName: originalFileNameOnEdit_1,
      prapatraOriginalName: originalFileNameOnEdit_2,
      otherDocumentOriginalName: originalFileNameOnEdit_3,
      otherDocument2OriginalName: originalFileNameOnEdit_4,
      otherDocument3OriginalName: originalFileNameOnEdit_5,
    }

    if (
      subjectFiledChk &&
      referenceNumberFiledChk &&
      nameOfApproverFiledChk &&
      toDepartmentFiledChk &&
      toDesignationFiledChk
    ) {
      sweetAlert({
        title: "Are you sure?",
        text: "You can't edit it after sending it to the department HOD until he reassign it.",
        icon: "warning",
        buttons: ["Cancel", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          if (data?.id) {
            setLoadingOnSubmit(true)
            axios
              .post(
                `${URLs.MSURL}/trnNewDocketEntry/save`,
                bodyForAPIForUpdate,
                {
                  headers: {
                    Authorization: `Bearer ${userToken}`,
                  },
                }
              )
              .then((res) => {
                if (res.status === 200 || res.status === 201) {
                  setLoadingOnSubmit(false)
                  sweetAlert({
                    title: "Updated!",
                    text: "Record updated and sent to the depatment hod successfully!",
                    icon: "success",
                    dangerMode: false,
                    closeOnClickOutside: false,
                  })

                  setRunAgain(true)
                  setSelectedValues([])
                  setCollapse(false)
                  setCollapseHistoryTable(false)
                  setCollapseMyOriginalContent(false)
                  clearButton()
                  setDocketNumber(null)
                }
              })
              .catch((error) => {
                setLoadingOnSubmit(false)
                callCatchMethod(error, language)
              })
          } else {
            setLoadingOnSubmit(true)
            axios
              .post(`${URLs.MSURL}/trnNewDocketEntry/save`, bodyForAPI, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              })
              .then((res) => {
                if (res.status === 200 || res.status === 201) {
                  setLoadingOnSubmit(false)
                  sweetAlert(
                    "Saved!",
                    "Record saved and sent to the depatment hod successfully!",
                    "success"
                  )
                  setRunAgain(true)
                  setSelectedValues([])
                  setCollapse(false)
                  setCollapseHistoryTable(false)
                  setCollapseMyOriginalContent(false)
                  clearButton()
                  setDocketNumber(null)
                }
              })
              .catch((error) => {
                setLoadingOnSubmit(false)
                callCatchMethod(error, language)
              })
          }
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

  const handleSelect = (event, index) => {
    setSelectedValues(event.target.value)
  }

  // const findIds = (selectedValues, committeeName) => {
  //   alert("findIds");
  //   console.log(":lok4...findIds", selectedValues);
  //   const matchedIds = [];
  //   for (const selectedValue of selectedValues) {
  //     for (const committee of committeeName) {
  //       if (committee.committeeNameMr === selectedValue) {
  //         matchedIds.push(committee.id);
  //       }
  //     }
  //   }
  //   return matchedIds.join(",") + ",";
  // };

  // useEffect(() => {
  //   if (selectedValues?.length > 0) {
  //     const ids = findIds(selectedValues, committeeName);
  //     setMatchedIds(ids);
  //   }
  // }, [selectedValues]);

  function getFinancialYear() {
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

    return `${startYear}-${endYear.toString().slice(-2)}`
  }

  // Get the current financial year when the component mounts
  useEffect(() => {
    if (financialYear?.length !== 0) {
      const currentFinancialYear = getFinancialYear()

      let setDirectFinancialYear = financialYear?.find((obj) => {
        return obj.financialYearEn == currentFinancialYear && obj
      })

      setSelectedFinancialYear([setDirectFinancialYear])
    }
  }, [financialYear])

  // useEffect(() => {
  //   console.log(":a9", error)
  //   if (Object.keys(error).length !== 0) {
  //     alert("Object.keys(error).length !== 0")
  //     setShowSelectedComFieldError(true)
  //   } else if (error?.selectedCommValues && selectedValues?.length == 0) {
  //     alert("Object.keys(error).length === 0 && selectedValues?.length == 0")
  //     setShowSelectedComFieldError(true)
  //   } else if (
  //     Object.keys(error).length !== 0 &&
  //     selectedValues?.length !== 0
  //   ) {
  //     alert("Object.keys(error).length !== 0 && selectedValues?.length !== 0")
  //     clearErrors("selectedCommValues")
  //   } else {
  //     alert("else")
  //     setShowSelectedComFieldError(false)
  //     clearErrors("selectedCommValues")
  //   }
  // }, [error, selectedValues, showSelectedComFieldError])

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

  // NEWLY ADDED CODE AFTER DIT DEMO ////////
  const toggleActiveStatus = (statusToToggle) => {
    // alert(statusToToggle)
    setDocketFilterButtons((prevTiles) =>
      prevTiles?.map((tile) =>
        tile.status == statusToToggle
          ? { ...tile, active: true }
          : { ...tile, active: false }
      )
    )
  }

  useEffect(() => {
    if (table?.length > 0) {
      let all = table?.length,
        sent = 0,
        aaprovedByHod = 0,
        aaprovedBySecClerk = 0,
        aaprovedBySecretary = 0,
        reassigned = 0

      table?.forEach((obj) => {
        if (obj.status == "INITIATED") {
          ++sent
        } else if (obj.status == "SUBMITTED") {
          ++aaprovedByHod
        } else if (obj.status == "IN PROCESS") {
          ++aaprovedBySecClerk
        } else if (obj.status == "FREEZED") {
          ++aaprovedBySecretary
        } else if (obj.status == "REASSIGN") {
          ++reassigned
        }
      })

      setDocketFilterButtons([
        {
          id: 1,
          // label: <FormattedLabel id="Initiated" />,
          label: "ALL DOC",
          count: all,
          // icon: <ArrowDownwardIcon />,
          status: [
            "INITIATED",
            "SUBMITTED",
            "IN PROCESS",
            "FREEZED",
            "REASSIGNED",
          ],
          active: true,
          dropdown: false,
        },
        {
          id: 2,
          // label: <FormattedLabel id="Reassigned" />,
          label: "SENT DOC",
          count: sent,
          // icon: <Undo />,
          status: "INITIATED",
          active: false,
          dropdown: false,
        },
        {
          id: 3,
          // label: <FormattedLabel id="Reassigned" />,
          label: "APP.BY HOD",
          count: aaprovedByHod,
          // icon: <Undo />,
          status: "SUBMITTED",
          active: false,
          dropdown: false,
        },
        {
          id: 4,
          // label: <FormattedLabel id="Reassigned" />,
          label: "APP.BY S_CLERK",
          count: aaprovedBySecClerk,
          // icon: <Undo />,
          status: "IN PROCESS",
          active: false,
          dropdown: false,
        },
        {
          id: 5,
          // label: <FormattedLabel id="Reassigned" />,
          label: "APP.BY SEC_",
          count: aaprovedBySecretary,
          // icon: <Undo />,
          status: "FREEZED",
          active: false,
          dropdown: false,
        },
        {
          id: 6,
          // label: <FormattedLabel id="Reassigned" />,
          label: "REASSIGNED",
          count: reassigned,
          // icon: <Undo />,
          status: "REASSIGN",
          active: false,
          dropdown: false,
        },
        {
          id: 7,
          // label: <FormattedLabel id="Reassigned" />,
          label: "Select Committee to Filter",
          count: sent,
          // icon: <Undo />,
          status: committeeName?.map((obj) => obj.id),
          active: false,
          dropdown: true,
        },
      ])
    }

    setFilteredDataForTable(table)
  }, [table])

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
    checkField("outwardNumber", setOutwardNumberFiledChk)
    checkField("budgetHead", setBudgetHeadFiledChk)
    checkField("nameOfApprover", setNameOfApproverFiledChk)
    checkField("toDepartment", setToDepartmentFiledChk)
    checkField("toDesignation", setToDesignationFiledChk)
  }, [
    watch("reference"),
    watch("subject"),
    watch("outwardNumber"),
    watch("budgetHead"),
    watch("nameOfApprover"),
    watch("toDepartment"),
    watch("toDesignation"),
  ])

  return (
    <>
      <Head>
        <title>New Docket Entry</title>
      </Head>
      <Box>
        <BreadcrumbComponent />
      </Box>
      {loadingOnSubmit ? (
        <Loader />
      ) : (
        <Paper className={styles.main}>
          <div className={styles.title}>
            <FormattedLabel id="newDocketEntry" />
          </div>
          <div style={{ marginTop: 20 }}>
            <Grid
              container
              spacing={2}
              style={{
                padding: "0px 5px 10px 5px",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                {docketNumber && (
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "white",
                        color: "black",
                      },
                      cursor: "default",
                    }}
                  >
                    Docket_Id : {docketNumber}
                  </Button>
                )}
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  sx={{ width: 100 }}
                  variant="contained"
                  endIcon={<Add />}
                  onClick={() => {
                    setCollapse(!collapse)
                    setID(null)
                    clearButton()
                    setDisSaveBtn(false)
                    setOpenHistoryOnEdit(false)
                    setDataForHistoryTable([])
                    setOriginaDocketData(null)
                    setCollapseMyOriginalContent(false)
                    setDocketNumber(null)
                  }}
                >
                  <FormattedLabel id="add" />
                </Button>
              </Grid>
            </Grid>
            {/* <Grid container spacing={3}>
              <Grid item xs={10} sm={10} md={10}></Grid>
              <Grid item xs={2} sm={2} md={2}></Grid>
            </Grid> */}
            {collapse && (
              <Slide direction="down" in={collapse} mountOnEnter unmountOnExit>
                <form onSubmit={handleSubmit(finalSubmit)} autoComplete="off">
                  <div className={styles.main} style={{ marginTop: 1 }}>
                    <div className={styles.row}>
                      <FormControl error={!!error.subjectDate}>
                        <Controller
                          control={control}
                          name="subjectDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                disabled
                                inputFormat="dd/MM/yyyy"
                                label={
                                  <span>
                                    <FormattedLabel id="subjectDate" required />
                                  </span>
                                }
                                value={
                                  router.query.subjectDate
                                    ? router.query.subjectDate
                                    : field.value
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
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
                          {error?.subjectDate
                            ? error.subjectDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>

                      {/* /////////////////////////// DROPDOWN REPLACED WITH TEXT FIELD ///////////// */}
                      <TextField
                        disabled={true}
                        // InputLabelProps={{ shrink: user ? true : false }}
                        sx={{ width: "350px", fontSize: "bold" }}
                        id="standard-basic"
                        label={<FormattedLabel id="departmentName" required />}
                        variant="standard"
                        {...register("departmentId")}
                      />
                      {/* /////////////////////////// DROPDOWN REPLACED WITH TEXT FIELD ///////////// */}
                    </div>

                    <div className={styles.row}>
                      <strong>{<FormattedLabel id="reference" />}</strong>
                      <TextareaAutosize
                        color="neutral"
                        disabled={disSaveBtn ? true : false}
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
                      <strong>
                        {<FormattedLabel id="subject" required />}
                      </strong>
                      <TextareaAutosize
                        color="neutral"
                        disabled={disSaveBtn ? true : false}
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
                    {disSaveBtn ? (
                      <>
                        <JoditEditor
                          ref={refToRTE}
                          value={refContent}
                          config={{
                            readonly: true,
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <JoditEditor
                          ref={refToRTE}
                          value={refContent}
                          onBlur={(newCont) => setRefContent(newCont)}
                        />
                      </>
                    )}
                    {/* JODIT FOR DETAILS EDITOR */}
                    <div className={styles.row}>
                      <strong>{<FormattedLabel id="subjectDetails" />}</strong>
                    </div>
                    {disSaveBtn ? (
                      <>
                        <JoditEditor
                          ref={refToRTEDetails}
                          value={refDetails}
                          config={{
                            readonly: true,
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <JoditEditor
                          ref={refToRTEDetails}
                          value={refDetails}
                          onBlur={(newCont) => setRefDetails(newCont)}
                        />
                      </>
                    )}

                    {/* <div className={styles.row}>
                      <strong>{<FormattedLabel id="subjectDetails" />}</strong>
                      <TextareaAutosize
                        color="neutral"
                        disabled={disSaveBtn ? true : false}
                        minRows={1}
                        style={{ overflow: "auto" }}
                        placeholder={
                          language == "en" ? "Subject Details" : "विषय तपशील"
                        }
                        className={styles.bigText}
                        {...register("subjectDetails")}
                      />
                      <FormHelperText style={{ color: "red" }}>
                        {!subjectDetailsFiledChk ? error1Messsage() : ""}
                      </FormHelperText>
                    </div> */}

                    <div className={styles.row}>
                      <FormControl
                        sx={{ width: "250px", marginBottom: "10px" }}
                        error={!!error.commett}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="selectCommittees" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={disSaveBtn}
                              variant="standard"
                              fullWidth
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value)
                              }}
                              label="Name of commett"
                            >
                              {committeeName &&
                                committeeName?.map((value, index) => (
                                  <MenuItem key={index} value={value.id}>
                                    {language == "en"
                                      ? value.committeeNameEn
                                      : value?.committeeNameMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="commett"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {error?.commett ? error.commett.message : null}
                        </FormHelperText>
                      </FormControl>

                      <FormControl
                        variant="standard"
                        error={!!error.financialYear}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="financialYear" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "250px", marginBottom: "10px" }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={selectedFinancialYear[0]?.id}
                              onChange={(value) => {
                                field.onChange(value)
                              }}
                              label="financialYear"
                              disabled={isDisabled}
                            >
                              {/* Render the financialYear options */}
                              {selectedFinancialYear &&
                                selectedFinancialYear?.map((value, index) => (
                                  <MenuItem
                                    key={index}
                                    value={value.id}
                                    // disabled={compareFinancialYear(value.id)}
                                    disabled={true}
                                  >
                                    {language === "en"
                                      ? value.financialYearEn
                                      : value.financialYearMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="financialYear"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {error?.financialYear
                            ? error.financialYear.message
                            : null}
                        </FormHelperText>
                      </FormControl>

                      <FormControl
                        variant="standard"
                        error={!!error.docketType}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="docketType" required />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={disSaveBtn ? true : false}
                              sx={{ width: "250px", marginBottom: "10px" }}
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
                            disabled={disSaveBtn ? true : false}
                            sx={{ width: "250px", marginBottom: "10px" }}
                            label={<FormattedLabel id="budgetHead" />}
                            variant="standard"
                            {...register("budgetHead")}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {!budgetHeadFiledChk ? error1Messsage() : ""}
                          </FormHelperText>
                        </div>
                      ) : (
                        ""
                      )}

                      <TextField
                        disabled={
                          // docket === 1 &&
                          // !watch("docketType") &&
                          watch("docketType") == 2 || watch("docketType") == 3
                            ? false
                            : true
                        }
                        sx={{ width: "250px", marginBottom: "10px" }}
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
                          sx={{ width: "250px", marginBottom: "1px" }}
                          disabled={disSaveBtn}
                          label={<FormattedLabel id="outwardNo" />}
                          variant="standard"
                          {...register("outwardNumber")}
                          InputLabelProps={{
                            shrink: watch("outwardNumber") ? true : false,
                          }}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {!outwardNumberFiledChk ? error1Messsage() : ""}
                        </FormHelperText>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignContent: "baseline",
                        }}
                      >
                        <TextField
                          sx={{ width: "250px", marginBottom: "1px" }}
                          disabled={disSaveBtn}
                          label={<FormattedLabel id="approverName" />}
                          variant="standard"
                          {...register("nameOfApprover")}
                          InputLabelProps={{
                            shrink: watch("nameOfApprover") ? true : false,
                          }}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {!nameOfApproverFiledChk ? error1Messsage() : ""}
                        </FormHelperText>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignContent: "baseline",
                        }}
                      >
                        <TextField
                          sx={{ width: "250px", marginBottom: "1px" }}
                          disabled={disSaveBtn}
                          label={<FormattedLabel id="approverDepartment" />}
                          variant="standard"
                          {...register("toDepartment")}
                          InputLabelProps={{
                            shrink: watch("toDepartment") ? true : false,
                          }}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {!toDepartmentFiledChk ? error1Messsage() : ""}
                        </FormHelperText>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignContent: "baseline",
                        }}
                      >
                        <TextField
                          sx={{ width: "250px", marginBottom: "1px" }}
                          disabled={disSaveBtn}
                          label={<FormattedLabel id="approverDesignation" />}
                          variant="standard"
                          {...register("toDesignation")}
                          InputLabelProps={{
                            shrink: watch("toDesignation") ? true : false,
                          }}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {!toDesignationFiledChk ? error1Messsage() : ""}
                        </FormHelperText>
                      </div>
                    </div>

                    <div
                      className={styles.sub_title}
                      style={{ marginTop: "20px" }}
                    >
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
                        marginBottom: 15,
                      }}
                    >
                      <strong>
                        {language == "en"
                          ? "* MAXIMUM FILE SIZE SHOULD BE 20MB"
                          : "* फाईलचा कमाल आकार 20MB असावा"}
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
                                    language == "en"
                                      ? "VISHYAPATRA"
                                      : "विषय पत्र"
                                  }
                                  originalName={setOriginalFileName_1}
                                  showFileOnEditName={originalFileNameOnEdit_1}
                                  filePath={attachment1}
                                  fileUpdater={setAttachment1}
                                  view={disSaveBtn ? true : false}
                                  setLoading={setLoading}
                                />
                                <hr />
                                {!disSaveBtn && (
                                  <span>
                                    upload all types of files(jpg,pdf etc.)
                                  </span>
                                )}
                              </TableCell>
                              <TableCell
                                style={{
                                  borderRight: "1px solid black",
                                  minWidth: 250,
                                }}
                              >
                                <PrapatraUpload
                                  appName="TP"
                                  serviceName="PARTMAP"
                                  label={<FormattedLabel id="prapatra" />}
                                  originalName={setOriginalFileName_2}
                                  showFileOnEditName={originalFileNameOnEdit_2}
                                  filePath={attachment2}
                                  fileUpdater={setAttachment2}
                                  view={disSaveBtn ? true : false}
                                  setLoading={setLoading}
                                />
                                <hr />
                                {!disSaveBtn && (
                                  <span style={{ color: "red" }}>
                                    acceptable file format is (.xlxs)
                                  </span>
                                )}
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
                                  showFileOnEditName={originalFileNameOnEdit_3}
                                  filePath={attachment3}
                                  fileUpdater={setAttachment3}
                                  view={disSaveBtn ? true : false}
                                  setLoading={setLoading}
                                />
                                <hr />
                                {!disSaveBtn && (
                                  <span>
                                    upload all types of files(jpg,pdf etc.)
                                  </span>
                                )}
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
                                  showFileOnEditName={originalFileNameOnEdit_4}
                                  filePath={attachment4}
                                  fileUpdater={setAttachment4}
                                  view={disSaveBtn ? true : false}
                                  setLoading={setLoading}
                                />
                                <hr />
                                {!disSaveBtn && (
                                  <span>
                                    upload all types of files(jpg,pdf etc.)
                                  </span>
                                )}
                              </TableCell>
                              <TableCell
                                style={{
                                  minWidth: 280,
                                }}
                              >
                                <OtherDocumentsUpload3
                                  appName="TP"
                                  serviceName="PARTMAP"
                                  label={
                                    language == "en"
                                      ? "OTHER DOCUMENT_3"
                                      : "इतर दस्तऐवज_3"
                                  }
                                  originalName={setOriginalFileName_5}
                                  showFileOnEditName={originalFileNameOnEdit_5}
                                  filePath={attachment5}
                                  fileUpdater={setAttachment5}
                                  view={disSaveBtn ? true : false}
                                  setLoading={setLoading}
                                />
                                <hr />
                                {!disSaveBtn && (
                                  <span>
                                    upload all types of files(jpg,pdf etc.)
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                        </Table>
                      </TableContainer>
                    </Grid>
                    {/* NEWLY ADDED */}
                    {/* {disSaveBtn ? ( */}

                    {disSaveBtn || openHistoryOnEdit ? (
                      <div className={styles.row}>
                        <div className={styles.table}>
                          <div
                            className={styles.sub_title}
                            style={{ marginBottom: "25px" }}
                          >
                            <FormattedLabel id="historyTable" />
                          </div>

                          <Grid
                            container
                            spacing={2}
                            style={{
                              padding: "0px 5px 10px 5px",
                              display: "flex",
                              alignItems: "baseline",
                              justifyContent: "space-between",
                            }}
                          >
                            <Grid
                              item
                              xs={6}
                              sm={6}
                              md={6}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            >
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  // alert("ya this my original doc button")
                                  setCollapseHistoryTable(false)
                                  setCollapseMyOriginalContent(
                                    !collapseMyOriginalContent
                                  )
                                }}
                              >
                                {collapseMyOriginalContent
                                  ? "Hide My Original Docket"
                                  : "Show My Original Docket"}
                              </Button>
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              sm={6}
                              md={6}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  setCollapseMyOriginalContent(false)
                                  setCollapseHistoryTable(!collapseHistoryTable)
                                }}
                              >
                                {collapseHistoryTable
                                  ? "Hide History Table"
                                  : "Show History Table"}
                              </Button>
                            </Grid>
                          </Grid>
                          {collapseHistoryTable ? (
                            <>
                              <DataGrid
                                autoHeight
                                sx={{
                                  overflowY: "scroll",
                                  "& .MuiDataGrid-columnHeadersInner": {
                                    backgroundColor: "#556CD6",
                                    color: "white",
                                  },
                                  "& .MuiDataGrid-cell:hover": {
                                    color: "primary.main",
                                  },
                                  "& .mui-style-levciy-MuiTablePagination-displayedRows":
                                    {
                                      marginTop: "17px",
                                    },
                                }}
                                components={{ Toolbar: GridToolbar }}
                                componentsProps={{
                                  toolbar: {
                                    showQuickFilter: true,
                                    quickFilterProps: { debounceMs: 0 },
                                    disableExport: true,
                                    disableToolbarButton: false,
                                    csvOptions: { disableToolbarButton: false },
                                    printOptions: {
                                      disableToolbarButton: true,
                                    },
                                  },
                                }}
                                //////////////////////////////////

                                rows={dataForHistoryTable}
                                columns={columnsForHistoryTable}
                                pageSize={pageSizeForHistory}
                                onPageSizeChange={(newPageSize) =>
                                  setPageSizeForHistory(newPageSize)
                                }
                                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                                disableSelectionOnClick
                                experimentalFeatures={{ newEditingApi: true }}
                              />
                            </>
                          ) : (
                            ""
                          )}
                          {collapseMyOriginalContent ? (
                            <OriginalDocketPrintComponent
                              data={originaDocketData}
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* NEWLY ADDED */}
                    <div
                      className={styles.buttons}
                      style={{
                        marginTop: "60px",
                      }}
                    >
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={disSaveBtn}
                        endIcon={<Save />}
                        size="small"
                      >
                        <FormattedLabel id="save" />
                      </Button>
                      <Button
                        disabled={disSaveBtn ? true : false}
                        variant="outlined"
                        color="error"
                        endIcon={<Clear />}
                        size="small"
                        onClick={
                          () => {
                            sweetAlert({
                              title: "Are you sure?",
                              text: "If you clicked Yes, All fields will be cleared!",
                              icon: "warning",
                              buttons: ["Cancel", "Yes"],
                              dangerMode: false,
                              closeOnClickOutside: false,
                            }).then((yes) => {
                              if (yes) {
                                reset({
                                  id: ID,
                                  reference: "",
                                  subject: "",
                                  docketType: "",
                                  subjectSummary: "",
                                  subjectDetails: "",
                                  amount: "",
                                  outwardNumber: "",
                                  nameOfApprover: "",
                                  toDesignation: "",
                                  toDepartment: "",
                                })
                                setSelectedValues([])
                                setRefContent("")
                                setRefDetails("")
                                setAttachment1("")
                                setAttachment2("")
                                setAttachment3("")
                                setAttachment4("")
                                setAttachment5("")
                                // >>>>>>>>>>>>>>>>>>>>>>>
                                setOriginalFileNameOnEdit_1("")
                                setOriginalFileNameOnEdit_2("")
                                setOriginalFileNameOnEdit_3("")
                                setOriginalFileNameOnEdit_4("")
                                setOriginalFileNameOnEdit_5("")
                                // >>>>>>>>>>>>>>>>>>>>>>>
                                setCollapseHistoryTable(false)
                                setCollapseMyOriginalContent(false)
                              } else {
                                toast.success("All Fields are safe.")
                              }
                            })
                          }
                          // clearButton
                        }
                      >
                        <FormattedLabel id="clear" />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<ExitToApp />}
                        size="small"
                        onClick={() => {
                          // router.push(
                          //   "/municipalSecretariatManagement/dashboard"
                          // )
                          setCollapse(!collapse)
                          clearButton()
                          setDisSaveBtn(false)
                          setOpenHistoryOnEdit(false)
                          setID(null)
                          setDataForHistoryTable([])
                          setCollapseHistoryTable(false)
                          setOriginaDocketData(null)
                          setCollapseMyOriginalContent(false)
                          setDocketNumber(null)
                        }}
                      >
                        <FormattedLabel id="close" />
                      </Button>
                    </div>
                  </div>
                </form>
              </Slide>
            )}

            {masterLoading || onButtonClick ? (
              <Loader />
            ) : (
              <div className={styles.table}>
                {!collapse ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      // gap: 20,
                      marginBottom: "20px",
                      padding: "10px",
                      border: "1.5px solid blue",
                      borderRadius: "20px",
                    }}
                  >
                    {docketFilterButtons?.map((obj) => {
                      return !obj?.dropdown ? (
                        <>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setOnButtonClick(true)

                              toggleActiveStatus(obj.status)
                              setFilteredCommitteDropdownValue("")

                              setTimeout(() => {
                                obj?.status == ["INITIATED", "SUBMITTED"]
                                  ? setFilteredDataForTable(table)
                                  : setFilteredDataForTable(
                                      table?.filter((j) =>
                                        Array.isArray(obj.status)
                                          ? obj.status.includes(j.status)
                                          : j.status === obj.status
                                      )
                                    )
                                setOnButtonClick(false)
                              }, 800)
                            }}
                            size="small"
                            sx={{
                              color: obj.active ? "black" : "white",
                              background: obj.active ? "white" : "#556CD6",
                              fontWeight: obj.active ? "800" : "400",
                              border: `1px solid ${
                                obj.active ? "green" : "black"
                              }`,
                              transition: "transform 0.8s ease-in-out",
                              transform: obj.active ? "scale(1.1)" : "",
                              "&:hover": {
                                backgroundColor: obj.active
                                  ? "white"
                                  : "#556CD6",
                                border: `1px solid ${
                                  obj.active ? "red" : "blue"
                                }`,
                                color: obj.active ? "black" : "white",
                              },
                              marginBottom: "10px",
                            }}
                          >
                            {obj?.label} ({obj.count})
                          </Button>
                        </>
                      ) : (
                        <FormControl
                          sx={{
                            minWidth: "20%",
                          }}
                        >
                          <InputLabel id="demo-simple-select-label">
                            <span
                              style={{
                                color: obj.active ? "red" : "black",
                                fontWeight: obj.active ? "800" : "400",
                              }}
                            >
                              {obj?.label}
                            </span>
                          </InputLabel>
                          <Select
                            id="demo-simple-select"
                            sx={{
                              height: "30px",
                              color: "black",
                              background: "white",
                              transition: "transform 0.8s ease-in-out",
                              transform: obj.active ? "scale(1.1)" : "",
                            }}
                            variant="standard"
                            value={filteredCommitteDropdownValue}
                            label="Select Committe"
                            onChange={(e) => {
                              setOnButtonClick(true)
                              setFilteredCommitteDropdownValue(e.target.value)
                              toggleActiveStatus(obj.status)
                              setTimeout(() => {
                                setFilteredDataForTable(
                                  table?.filter(
                                    (obj) =>
                                      obj?.commett[0]?.committeeId ==
                                      e.target.value
                                  )
                                )
                                setOnButtonClick(false)
                              }, 800)
                            }}
                          >
                            {committeeName?.map((obj, i) => {
                              return (
                                <MenuItem key={obj.id} value={obj.id}>
                                  {language == "en"
                                    ? obj.committeeNameEn
                                    : obj.committeeNameMr}
                                </MenuItem>
                              )
                            })}
                          </Select>
                        </FormControl>
                      )
                    })}
                  </div>
                ) : (
                  ""
                )}
                <DataGrid
                  autoHeight
                  sx={{
                    overflowY: "scroll",
                    "& .MuiDataGrid-virtualScrollerContent": {},
                    "& .MuiDataGrid-columnHeadersInner": {
                      backgroundColor: "#556CD6",
                      color: "white",
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                    "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                      marginTop: "17px",
                    },
                  }}
                  // disableColumnFilter
                  // disableColumnSelector
                  // disableDensitySelector
                  components={{ Toolbar: GridToolbar }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 0 },
                      disableExport: true,
                      disableToolbarButton: false,
                      csvOptions: { disableToolbarButton: false },
                      printOptions: { disableToolbarButton: true },
                    },
                  }}
                  //////////////////////////////////

                  rows={filteredDataForTable}
                  //@ts-ignore
                  columns={columns}
                  pageSize={pageSize}
                  onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                  rowsPerPageOptions={[5, 10, 20, 50, 100]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                />
              </div>
            )}
          </div>
        </Paper>
      )}
    </>
  )
}

export default Index
