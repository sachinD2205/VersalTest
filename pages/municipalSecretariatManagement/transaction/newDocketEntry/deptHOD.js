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
  CircularProgress,
  Box,
  Checkbox,
  ListItemText,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material"
// import Add from '@mui/icons-material/Add'
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { Close, ExitToApp, Save, Visibility, Watch } from "@mui/icons-material"
import Slide from "@mui/material/Slide"
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
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import VishapatraUpload from "../../documentsUpload/VishapatraUpload"
import PrapatraUpload from "../../documentsUpload/PrapatraUpload"
import OtherDocumentsUpload from "../../documentsUpload/OtherDocumentsUpload"
import OtherDocumentsUpload2 from "../../documentsUpload/OtherDocumentsUpload2"
import OtherDocumentsUpload3 from "../../documentsUpload/OtherDocumentsUpload3"
import JoditEditor from "../../../common/joditReact_Component/JoditReact"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"
import { toast } from "react-toastify"
import DOMPurify from "dompurify"

const Index = () => {
  const [table, setTable] = useState([])
  const [filteredDataForTable, setFilteredDataForTable] = useState([])
  const [filteredCommitteDropdownValue, setFilteredCommitteDropdownValue] =
    useState("")
  const [docketFilterButtons, setDocketFilterButtons] = useState([])
  const [onButtonClick, setOnButtonClick] = useState(false)

  const [collapseHistoryTable, setCollapseHistoryTable] = useState(false)

  const refToRTE = useRef(null)
  const refToRTEDetails = useRef(null)
  const [refContent, setRefContent] = useState("")
  const [refDetails, setRefDetails] = useState("")
  const parser = new DOMParser()

  const [ID, setID] = useState()
  const [officeName, setOfficeName] = useState([
    { id: 1, officeNameEn: "", officeNameMr: "" },
  ])

  //////////////////////////////////////Showing To the particular HOD of the dept/////////////////////////////
  const selecedHOD = useSelector((state) => {
    console.log(
      "userDetails",
      state?.user?.usersDepartmentDashboardData?.userDao?.department
    )
    return state?.user?.usersDepartmentDashboardData?.userDao?.department
  })
  console.log(":10", selecedHOD)
  ////////////////////////////////////////////

  const [departmentName, setDepartmentName] = useState([])
  const [committeeName, setCommitteeName] = useState([])
  const [financialYear, setFinancialYear] = useState([])
  const [docketType, setDocketType] = useState([
    { id: 1, docketTypeEn: "", docketTypeMr: "" },
  ])
  const [attachment, setAttachment] = useState("")
  const [attachment1, setAttachment1] = useState("")
  const [originalFileNameOnEdit_1, setOriginalFileNameOnEdit_1] = useState("")

  const [attachment2, setAttachment2] = useState("")
  const [originalFileNameOnEdit_2, setOriginalFileNameOnEdit_2] = useState("")

  const [attachment3, setAttachment3] = useState("")
  const [originalFileNameOnEdit_3, setOriginalFileNameOnEdit_3] = useState("")

  const [attachment4, setAttachment4] = useState("")
  const [originalFileNameOnEdit_4, setOriginalFileNameOnEdit_4] = useState("")

  const [attachment5, setAttachment5] = useState("")
  const [originalFileNameOnEdit_5, setOriginalFileNameOnEdit_5] = useState("")

  const [runAgain, setRunAgain] = useState(false)
  const [collapse, setCollapse] = useState(false)
  const [actions, setActions] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingOnSubmit, setLoadingOnSubmit] = useState(false)
  const [selectedValues, setSelectedValues] = useState([])

  const [masterLoading, setMasterLoading] = useState(true)

  const [senderDepartmentEn, setSenderDepartmentEn] = useState(null)
  const [senderNameEn, setSenderNameEn] = useState(null)

  const [senderDepartmentMr, setSenderDepartmentMr] = useState(null)
  const [senderNameMr, setSenderNameMr] = useState(null)

  const [dataForHistoryTable, setDataForHistoryTable] = useState([])

  // ERROR MESSAGE TO SHOW

  const [messageToShowOnError, setMessageToShowOnError] = useState("")
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("")

  // HYPERLINKS CHECKED
  const [nameOfApproverFiledChk, setNameOfApproverFiledChk] = useState(true)
  const [toDepartmentFiledChk, setToDepartmentFiledChk] = useState(true)
  const [toDesignationFiledChk, setToDesignationFiledChk] = useState(true)
  const [remarkFiledChk, setRemarkFiledChk] = useState(true)

  // HYPERLINKS CHECKED

  const [pageSize, setPageSize] = useState(5)
  const [pageSizeForHistory, setPageSizeForHistory] = useState(5)

  const [docketNumber, setDocketNumber] = useState(null)

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

  //Area Details
  let areaDetailsSchema = yup.object().shape({
    action: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    hodRemark: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
  })

  const {
    register: register,
    handleSubmit: handleSubmit,
    // @ts-ignore
    methods: methods,
    reset: reset,
    control: control,
    watch,
    setValue,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(areaDetailsSchema),
  })

  useEffect(() => {
    //Get Office
    setLoading(true)
    axios
      .get(`${URLs.MSURL}/mstElectoral/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setOfficeName(
          r.data.electoral.map((row) => ({
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
        console.log("Department: ", res.data.department)
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
        console.log("error: ", error)
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
        console.log("Committee: ", res.data.committees)
        setCommitteeName(
          res.data.committees.map((j) => ({
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
        console.log("Financial Year: ", res.data.financialYear)
        setFinancialYear(
          res.data.financialYear.map((j) => ({
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
        setMasterLoading(false)
        callCatchMethod(error, language)
      })
  }, [])

  // NEWLY ADDED CODE////////
  const fullNameToSend = useSelector((state) => {
    return state?.user?.user?.userDao
  })

  useEffect(() => {
    if (selecedHOD && departmentName?.length != 0) {
      const sendNameEn = departmentName?.find(
        (o) => o?.id == selecedHOD
      )?.departmentNameEn
      console.log(":a1", sendNameEn)
      setSenderDepartmentEn(sendNameEn)

      const sendNameMr = departmentName?.find(
        (o) => o?.id == selecedHOD
      )?.departmentNameMr
      console.log(":a1", sendNameMr)
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
  // NEWLY ADDED CODE////////

  useEffect(() => {
    if (
      financialYear?.length > 0 &&
      committeeName?.length > 0 &&
      departmentName?.length > 0
    ) {
      setRunAgain(false)
      //Table
      // setLoading(true)
      axios
        .get(`${URLs.MSURL}/trnNewDocketEntry/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          console.log("Table: ", res.data.newDocketEntry)
          setTable(
            res?.data?.newDocketEntry
              ?.filter((obj) => {
                return obj.status === "INITIATED" || obj.status === "SUBMITTED"
              })
              .filter((ob) => {
                console.log(":30", ob)
                return ob.departmentId === selecedHOD
              })
              .map((j, i) => ({
                ...j,
                id: j.id,
                srNo: i + 1,
                attachment: j.uploadDocument,
                vishaypatra: j.vishaypatra,
                prapatra: j.prapatra,
                otherDocument: j.otherDocument,
                status: j.status,
                docketId: j.docketId,
                statusChanged:
                  j.status === "INITIATED"
                    ? "INITIATED BY CLERK"
                    : "" || j.status === "SUBMITTED"
                    ? "SEND TO THE SECRETARY CLERK"
                    : "",
                subject: j.subject,
                subjectSummary: j.subjectSummary,
                subjectDetails: j.subjectDetails,
                subjectSerialNumber: j.subjectSerialNumber,
                subjectDate: j.subjectDate,
                subjectDateShow:
                  j.subjectDate !== null
                    ? moment(j.subjectDate).format("DD-MM-YYYY")
                    : " --- ",
                approvedDate:
                  j.approvedDate !== null
                    ? moment(j.approvedDate).format("DD-MM-YYYY")
                    : " --- ",
                hodRemark: j.hodRemark,
                inwardOutwardNumber: j.inwardOutwardNumber,
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
                outwardNumber: j.outwardNumber,
                reference: j.reference,
                departmentNameEn: departmentName?.find(
                  (obj) => obj.id === j.departmentId
                )?.departmentNameEn,
                departmentNameMr: departmentName?.find(
                  (obj) => obj.id === j.departmentId
                )?.departmentNameMr,

                budgetHead: j.budgetHead,

                nameOfApprover: j.nameOfApprover,
                toDepartment: j.toDepartment,
                toDesignation: j.toDesignation,
                docketId: j.docketId,
              }))
          )
          setMasterLoading(false)
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
          setMasterLoading(false)
          callCatchMethod(error, language)
        })
    }
  }, [departmentName, financialYear, committeeName, runAgain])

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
            {params?.row?.statusChanged === "SEND TO THE SECRETARY CLERK" ? (
              <div style={{ color: "green" }}>
                <Tooltip title="SEND TO THE SECRETARY CLERK">
                  <ArrowUpwardIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            ) : (
              <div style={{ color: "#EB8B0E" }}>
                <Tooltip title="INITIATED BY CLERK">
                  <ArrowDownwardIcon sx={{ fontSize: "16px" }} />
                </Tooltip>
              </div>
            )}
          </div>
        )
      },
    },
    {
      field: "docketId",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="docketId" />,
      width: 150,
    },
    {
      field: "subjectDateShow",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectDate" />,
      width: 150,
    },
    {
      field: "approvedDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="approvedDate" />,
      width: 150,
    },
    {
      field: language === "en" ? "financialYearEn" : "financialYearMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="financialYear" />,
      width: 150,
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
      field: "reference",
      headerAlign: "center",
      headerName: <FormattedLabel id="reference" />,
      width: 300,
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
      // align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectStatus" />,
      width: 350,
      renderCell: (params) => {
        return (
          <div
            // disabled={editButtonInputState}
            // onClick={() => {
            //   console.log("params.row: ", params?.row)
            //   // reset(params.row)
            // }} // IT IS POSSIBLE TO DO ONCLICK IN DIV
            style={{ paddingLeft: "20px" }}
          >
            {params?.row?.statusChanged === "SEND TO THE SECRETARY CLERK" ? (
              <div
                style={{
                  color: "green",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  gap: 10,
                }}
              >
                {params?.row?.statusChanged}
              </div>
            ) : (
              <div
                style={{
                  color: "#EB8B0E",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  gap: 10,
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
            <IconButton
              sx={{
                color:
                  params?.row?.statusChanged === "SEND TO THE SECRETARY CLERK"
                    ? "green"
                    : "#096dd9",
              }}
              onClick={() => {
                console.log(":a3", params.row)
                reset(table[params.row.srNo - 1])
                setDocketNumber(params.row.docketId)
                setRefContent(params.row.subjectSummary)
                setRefDetails(params.row.subjectDetails)
                setAttachment1(params.row.vishaypatra)
                setAttachment2(params.row.prapatra)
                setAttachment3(params.row.otherDocument)
                setAttachment4(params.row.otherDocument2)
                setAttachment5(params.row.otherDocument3)
                // >>>>>>>>>>>>>>>>>>>>>>>
                setOriginalFileNameOnEdit_1(params.row.vishaypatraOriginalName)
                setOriginalFileNameOnEdit_2(params.row.prapatraOriginalName)
                setOriginalFileNameOnEdit_3(
                  params.row.otherDocumentOriginalName
                )
                setOriginalFileNameOnEdit_4(
                  params.row.otherDocument2OriginalName
                )
                setOriginalFileNameOnEdit_5(
                  params.row.otherDocument3OriginalName
                )
                // >>>>>>>>>>>>>>>>>>>>>>>
                setCollapse(!collapse)
                setCollapseHistoryTable(false)
                // setSelectedValues(
                //   params?.row?.committeeId?.split(",").slice(1, -1).map(Number)
                // )
                // setSelectedValues(
                //   params?.row?.commett?.map((obj) => obj.committeeId)
                // )
                setValue("commett", params.row?.commett[0]?.committeeId)
                setDataForHistoryTable(
                  params?.row?.history?.map((o, i) => ({
                    id: o.id,
                    srNo: i + 1,
                    senderName: o.senderName,
                    senderNameMr: o.senderNameMr,
                    senderDepartment: o.senderDepartment,
                    senderDesignation: o.senderDesignation,
                    sendDateTime: moment(o?.sendDateTime).format(
                      "DD-MM-YYYY HH:mm"
                    ),
                    remark: o.remark,
                  }))
                )
              }}
            >
              <Tooltip
                title={
                  params?.row?.statusChanged === "SEND TO THE SECRETARY CLERK"
                    ? "VIEW THIS DOCKET"
                    : "TAKE ACTION ON THIS DOCKET"
                }
              >
                <Visibility />
              </Tooltip>
            </IconButton>
          </>
        )
      },
    },
  ]

  const finalSubmit = (data) => {
    if (
      nameOfApproverFiledChk &&
      toDepartmentFiledChk &&
      toDesignationFiledChk &&
      remarkFiledChk
    ) {
      sweetAlert({
        title: "Are you sure?",
        text: "",
        icon: "warning",
        buttons: ["Cancel", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          setLoadingOnSubmit(true)
          axios
            .post(
              `${URLs.MSURL}/trnNewDocketEntry/saveApplicationApprove`,
              {
                // activeFlag: 'Y',
                id: data.id,
                hodRemark: data.hodRemark,
                action: data.action,
                nameOfApprover: data.nameOfApprover,
                toDepartment: data.toDepartment,
                toDesignation: data.toDesignation,
              },
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                  serviceId: 368,
                },
              }
            )
            .then((res) => {
              if (res.status === 200 || res.status === 201) {
                setLoadingOnSubmit(false)
                sweetAlert({
                  title:
                    watch("action") === "REASSIGN" ? "Reassigned!" : "Saved!",
                  text:
                    watch("action") === "REASSIGN"
                      ? "Record Reassigned Successfully !"
                      : "Record Sent to Sec_Clerk Successfully !",
                  icon: "success",
                  dangerMode: false,
                  closeOnClickOutside: false,
                })

                setRunAgain(true)
                setCollapse(false)
                setCollapseHistoryTable(false)
                setDocketNumber(null)
              }
            })
            .catch((error) => {
              callCatchMethod(error, language)
              setLoadingOnSubmit(false)
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

  const handleSelect = (event) => {
    console.log(":lok3..event", event.target.value)
    setSelectedValues(event.target.value)
  }

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
        pending = 0,
        sent = 0

      table?.forEach((obj) => {
        if (obj.status == "INITIATED") {
          ++pending
        } else if (obj.status == "SUBMITTED") {
          ++sent
        }
      })

      setDocketFilterButtons([
        {
          id: 1,
          // label: <FormattedLabel id="Initiated" />,
          label: "ALL DOCKETS",
          count: all,
          // icon: <ArrowDownwardIcon />,
          status: ["INITIATED", "SUBMITTED"],
          active: true,
          dropdown: false,
        },
        {
          id: 2,
          // label: <FormattedLabel id="InProcess" />,
          label: "PENDING DOCKETS",
          count: pending,
          // icon: <MoreHoriz />,
          status: "INITIATED",
          active: false,
          dropdown: false,
        },
        {
          id: 3,
          // label: <FormattedLabel id="Reassigned" />,
          label: "SENT DOCKETS",
          count: sent,
          // icon: <Undo />,
          status: "SUBMITTED",
          active: false,
          dropdown: false,
        },
        {
          id: 4,
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

    checkField("nameOfApprover", setNameOfApproverFiledChk)
    checkField("toDepartment", setToDepartmentFiledChk)
    checkField("toDesignation", setToDesignationFiledChk)
    checkField("hodRemark", setRemarkFiledChk)
  }, [
    watch("nameOfApprover"),
    watch("toDepartment"),
    watch("toDesignation"),
    watch("hodRemark"),
  ])

  useEffect(() => {
    if (!collapse) {
      setDocketNumber(null)
    }
  }, [collapse])

  return (
    <>
      <Head>
        <title>New Docket (HOD)</title>
      </Head>
      <Box>
        <BreadcrumbComponent />
      </Box>
      {loadingOnSubmit ? (
        <Loader />
      ) : (
        <Paper className={styles.main}>
          <div className={styles.title}>
            <FormattedLabel id="newDocketEntryOnHodLogin" />
          </div>

          <div style={{ marginTop: 20 }}>
            <Grid
              container
              spacing={2}
              style={{
                padding: "0px 5px 10px 40px",
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
            </Grid>
          </div>

          <div>
            {collapse && (
              <Slide direction="down" in={collapse} mountOnEnter unmountOnExit>
                <form onSubmit={handleSubmit(finalSubmit)}>
                  <div className={styles.main}>
                    <div className={styles.row}>
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
                                  <strong>
                                    <FormattedLabel id="subjectDate" required />
                                  </strong>
                                }
                                disabled
                                value={
                                  router.query.subjectDate
                                    ? router.query.subjectDate
                                    : field.value
                                }
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date, "YYYY-MM-DD").format(
                                      "YYYY-MM-DD"
                                    )
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

                      <FormControl
                        disabled
                        variant="standard"
                        error={!!error.departmentId}
                      >
                        <InputLabel
                          id="demo-simple-select-standard-label"
                          //   disabled={isDisabled}
                        >
                          <strong>
                            <FormattedLabel id="departmentName" required />
                          </strong>
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: "400px" }}
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
                          {error?.departmentId
                            ? error.departmentId.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </div>

                    <div className={styles.row}>
                      <strong>{<FormattedLabel id="reference" />}</strong>
                      <TextareaAutosize
                        disabled
                        color="neutral"
                        // minRows={1}
                        // maxRows={3}
                        placeholder="Reference"
                        className={styles.bigText}
                        {...register("reference")}
                      />
                    </div>
                    <div className={styles.row}>
                      <strong>
                        {<FormattedLabel id="subject" required />}
                      </strong>
                      <TextareaAutosize
                        disabled
                        color="neutral"
                        style={{ overflow: "auto" }}
                        minRows={1}
                        maxRows={3}
                        placeholder={language == "en" ? "Subject" : "विषय"}
                        className={styles.bigText}
                        {...register("subject")}
                      />
                    </div>

                    <div className={styles.row}>
                      <strong>
                        {<FormattedLabel id="subjectSummary" required />}
                      </strong>
                    </div>
                    <JoditEditor
                      ref={refToRTE}
                      value={refContent}
                      config={{
                        readonly: true,
                      }}
                      onChange={(newCont) => setRefContent(newCont)}
                    />

                    <div className={styles.row}>
                      <strong>
                        {<FormattedLabel id="subjectDetails" required />}
                      </strong>
                      {/* <TextareaAutosize
                        disabled
                        style={{ overflow: "auto" }}
                        color="neutral"
                        placeholder={
                          language == "en" ? "Subject Details" : "विषय तपशील"
                        }
                        className={styles.bigText}
                        {...register("subjectDetails")}
                      /> */}
                    </div>
                    <JoditEditor
                      ref={refToRTEDetails}
                      value={refDetails}
                      config={{
                        readonly: true,
                      }}
                    />

                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "20px 0px 10px 0px",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      <Grid item xs={4} sm={4} md={3}>
                        <FormControl
                          error={!!error.commett}
                          sx={{ width: "95%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="selectCommittees" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
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
                      </Grid>

                      <Grid item xs={4} sm={4} md={3}>
                        <FormControl
                          disabled
                          variant="standard"
                          error={!!error.financialYear}
                          sx={{ width: "95%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <strong>
                              {" "}
                              <FormattedLabel id="financialYear" required />
                            </strong>
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="financialYear"
                              >
                                {financialYear &&
                                  financialYear.map((value, index) => (
                                    <MenuItem
                                      key={index}
                                      value={
                                        //@ts-ignore
                                        value.id
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
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.financialYear
                              ? error.financialYear.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid item xs={4} sm={4} md={3}>
                        <FormControl
                          disabled
                          variant="standard"
                          error={!!error.docketType}
                          sx={{ width: "95%" }}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <strong>
                              <FormattedLabel id="docketType" required />
                            </strong>
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
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
                            {error?.docketType
                              ? error.docketType.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {watch("docketType") && watch("docketType") == 2 ? (
                        <Grid item xs={3} sm={3} md={3}>
                          <TextField
                            disabled
                            sx={{ width: "95%" }}
                            label={
                              <strong>
                                <FormattedLabel id="budgetHead" />
                              </strong>
                            }
                            variant="standard"
                            {...register("budgetHead")}
                          />
                        </Grid>
                      ) : (
                        ""
                      )}

                      <Grid item xs={4} sm={4} md={3}>
                        <TextField
                          disabled
                          id="standard-basic"
                          sx={{ width: "95%" }}
                          label={
                            <strong>
                              <FormattedLabel id="amount" required />
                            </strong>
                          }
                          variant="standard"
                          {...register("amount")}
                          error={!!error.amount}
                          helperText={
                            error?.amount ? error.amount.message : null
                          }
                          defaultValue={
                            router.query.amount ? router.query.amount : ""
                          }
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3}>
                        <TextField
                          disabled
                          id="standard-basic"
                          sx={{ width: "95%" }}
                          label={
                            <strong>
                              <FormattedLabel id="outwardNo" />
                            </strong>
                          }
                          variant="standard"
                          {...register("outwardNumber")}
                        />
                      </Grid>

                      {/* </div> */}
                    </Grid>
                    {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
                    <div
                      className={styles.sub_title}
                      style={{
                        marginTop: "20px",
                        marginBottom: 20,
                      }}
                    >
                      <FormattedLabel id="documentSection" />
                    </div>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "20px 0px 10px 18px",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      <TableContainer style={{ border: "2px solid #7088F3" }}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                style={{
                                  borderRight: "1px solid black",
                                  minWidth: 280,
                                }}
                              >
                                {attachment1 !== "" ? (
                                  <VishapatraUpload
                                    appName="TP"
                                    serviceName="PARTMAP"
                                    label={
                                      language === "en"
                                        ? "VISHYAPATRA"
                                        : "विषय पत्र"
                                    }
                                    showFileOnEditName={
                                      originalFileNameOnEdit_1
                                    }
                                    filePath={attachment1}
                                    fileUpdater={setAttachment1}
                                    view="true"
                                  />
                                ) : (
                                  <strong
                                    style={{
                                      fontSize: "medium",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {language === "en"
                                      ? "VISHYAPATRA : NA"
                                      : "विषय पत्र : उपलब्ध नाही"}
                                  </strong>
                                )}
                              </TableCell>
                              <TableCell
                                style={{
                                  borderRight: "1px solid black",
                                  minWidth: 250,
                                }}
                              >
                                {attachment2 !== "" ? (
                                  <PrapatraUpload
                                    appName="TP"
                                    serviceName="PARTMAP"
                                    label={<FormattedLabel id="prapatra" />}
                                    showFileOnEditName={
                                      originalFileNameOnEdit_2
                                    }
                                    filePath={attachment2}
                                    fileUpdater={setAttachment2}
                                    view="true"
                                  />
                                ) : (
                                  <strong
                                    style={{
                                      fontSize: "medium",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {language === "en"
                                      ? "PRAPATRA : NA"
                                      : "प्रपत्र : उपलब्ध नाही"}
                                  </strong>
                                )}
                              </TableCell>
                              <TableCell
                                style={{
                                  borderRight: "1px solid black",
                                  minWidth: 250,
                                }}
                              >
                                {attachment3 !== "" ? (
                                  <OtherDocumentsUpload
                                    appName="TP"
                                    serviceName="PARTMAP"
                                    label={
                                      language === "en"
                                        ? "OTHER DOCUMENT_1"
                                        : "इतर दस्तऐवज_1"
                                    }
                                    showFileOnEditName={
                                      originalFileNameOnEdit_3
                                    }
                                    filePath={attachment3}
                                    fileUpdater={setAttachment3}
                                    view="true"
                                  />
                                ) : (
                                  <strong
                                    style={{
                                      fontSize: "medium",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {language === "en"
                                      ? "OTHER DOCUMENT_1 : NA"
                                      : "इतर दस्तऐवज_1 : उपलब्ध नाही"}
                                  </strong>
                                )}
                              </TableCell>
                              <TableCell
                                style={{
                                  borderRight: "1px solid black",
                                  minWidth: 250,
                                }}
                              >
                                {attachment4 !== "" && attachment4 !== null ? (
                                  <OtherDocumentsUpload2
                                    appName="TP"
                                    serviceName="PARTMAP"
                                    label={
                                      language === "en"
                                        ? "OTHER DOCUMENT_2"
                                        : "इतर दस्तऐवज_2"
                                    }
                                    showFileOnEditName={
                                      originalFileNameOnEdit_4
                                    }
                                    filePath={attachment4}
                                    fileUpdater={setAttachment4}
                                    view="true"
                                  />
                                ) : (
                                  <strong
                                    style={{
                                      fontSize: "medium",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {language === "en"
                                      ? "OTHER DOCUMENT_2 : NA"
                                      : "इतर दस्तऐवज_2 : उपलब्ध नाही"}
                                  </strong>
                                )}
                              </TableCell>
                              <TableCell
                                style={{
                                  minWidth: 250,
                                }}
                              >
                                {attachment5 !== "" && attachment5 !== null ? (
                                  <OtherDocumentsUpload3
                                    appName="TP"
                                    serviceName="PARTMAP"
                                    label={
                                      language === "en"
                                        ? "OTHER DOCUMENT_3"
                                        : "इतर दस्तऐवज_3"
                                    }
                                    showFileOnEditName={
                                      originalFileNameOnEdit_5
                                    }
                                    filePath={attachment5}
                                    fileUpdater={setAttachment5}
                                    view="true"
                                  />
                                ) : (
                                  <strong
                                    style={{
                                      fontSize: "medium",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {language === "en"
                                      ? "OTHER DOCUMENT_3 : NA"
                                      : "इतर दस्तऐवज_3 : उपलब्ध नाही"}
                                  </strong>
                                )}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>

                    {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}

                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "20px 0px 10px 0px",
                        display: "flex",
                        alignItems: "baseline",
                      }}
                    >
                      <Grid item xs={4} sm={4} md={3}>
                        <TextField
                          disabled={
                            watch("status") === "SUBMITTED" ? true : false
                          }
                          sx={{ width: "95%" }}
                          label={<FormattedLabel id="approverName" />}
                          variant="standard"
                          {...register("nameOfApprover")}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {!nameOfApproverFiledChk ? error1Messsage() : ""}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={4} sm={4} md={3}>
                        <TextField
                          disabled={
                            watch("status") === "SUBMITTED" ? true : false
                          }
                          sx={{ width: "95%" }}
                          label={<FormattedLabel id="approverDepartment" />}
                          variant="standard"
                          {...register("toDepartment")}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {!toDepartmentFiledChk ? error1Messsage() : ""}
                        </FormHelperText>
                      </Grid>
                      <Grid item xs={4} sm={4} md={3}>
                        <TextField
                          disabled={
                            watch("status") === "SUBMITTED" ? true : false
                          }
                          sx={{ width: "95%" }}
                          label={<FormattedLabel id="approverDesignation" />}
                          variant="standard"
                          {...register("toDesignation")}
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {!toDesignationFiledChk ? error1Messsage() : ""}
                        </FormHelperText>
                      </Grid>

                      <Grid item xs={4} sm={4} md={3}>
                        <FormControl
                          variant="standard"
                          error={!!error.action}
                          sx={{ width: "95%" }}
                        >
                          <InputLabel
                            id="demo-simple-select-standard-label"
                            style={{ fontWeight: "bold" }}
                          >
                            <FormattedLabel id="actions" required />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ fontWeight: "bold" }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={field.value}
                                disabled={
                                  watch("status") === "SUBMITTED" ? true : false
                                }
                                value={
                                  watch("status") === "SUBMITTED"
                                    ? "APPROVED"
                                    : field.value
                                }
                                onChange={(e) => {
                                  if (e.target.value) {
                                    setActions(e.target.value)
                                    field.onChange(e)
                                  }
                                }}
                                label="action"
                              >
                                <MenuItem
                                  key={2}
                                  value="APPROVED"
                                  style={{ fontWeight: "bold" }}
                                >
                                  {language === "en" ? "Approve" : "मंजूर करा"}
                                </MenuItem>
                                <MenuItem
                                  key={3}
                                  value="REASSIGN"
                                  style={{ fontWeight: "bold" }}
                                >
                                  {language === "en" ? "Reassign" : "परत पाठवा"}
                                </MenuItem>
                              </Select>
                            )}
                            name="action"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {error?.action ? error.action.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* <div className={styles.row}> */}
                    <div
                      style={{
                        display: "flex",
                        // flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "baseline",
                        gap: 35,
                        marginTop: 20,
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        sx={{ width: "500vmin" }}
                        label={
                          <span
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            <FormattedLabel id="remark" required />
                          </span>
                        }
                        variant="standard"
                        {...register("hodRemark")}
                        error={!!error.hodRemark}
                        helperText={
                          error?.hodRemark ? error.hodRemark.message : null
                        }
                        defaultValue={
                          watch("status") === "SUBMITTED"
                            ? watch("hodRemark")
                            : ""
                        }
                        disabled={
                          watch("status") === "SUBMITTED" ? true : false
                        }
                      />
                    </div>
                    <FormHelperText style={{ color: "red" }}>
                      {!remarkFiledChk ? error1Messsage() : ""}
                    </FormHelperText>

                    {/* NEWLY ADDED */}

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
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            sx={{ display: "flex", justifyContent: "flex-end" }}
                          >
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                setCollapseHistoryTable(!collapseHistoryTable)
                              }
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
                                  printOptions: { disableToolbarButton: true },
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
                      </div>
                    </div>

                    {/* NEWLY ADDED */}

                    <div className={styles.buttons}>
                      <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        disabled={
                          watch("status") === "SUBMITTED" ? true : false
                        }
                        endIcon={<Save />}
                      >
                        <FormattedLabel id="save" />
                      </Button>
                      {/* <Button
                      variant='outlined'
                      color='error'
                      endIcon={<Clear />}
                      onClick={clearButton}
                    >
                      <FormattedLabel id='clear' />
                    </Button> */}
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<Close />}
                        size="small"
                        onClick={() => {
                          // router.push(
                          //   "/municipalSecretariatManagement/dashboard"
                          // )
                          setCollapse(!collapse)
                          setDataForHistoryTable([])
                          setCollapseHistoryTable(false)
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
                {/* NEWLY ADDED AFTER DIT DEMO */}

                {!collapse ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      gap: 50,
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
                                obj.active ? "red" : "blue"
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
