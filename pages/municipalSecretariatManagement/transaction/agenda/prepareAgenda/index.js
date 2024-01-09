import { yupResolver } from "@hookform/resolvers/yup"
import AddIcon from "@mui/icons-material/Add"
import ClearIcon from "@mui/icons-material/Clear"
import EditIcon from "@mui/icons-material/Edit"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import SaveIcon from "@mui/icons-material/Save"
import {
  Button,
  Paper,
  Slide,
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  LinearProgress,
  ThemeProvider,
  TextareaAutosize,
  Modal,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Input,
  Tooltip,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import PrintIcon from "@mui/icons-material/Print"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
// import Schema from "../../../containers/schema/propertyTax/masters/amenitiesMaster"
import moment from "moment"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../../URLS/urls"
import styles from "../../../../../components/municipalSecretariatManagement/styles/view.module.css"
import theme from "../../../../../theme"
import { object } from "yup"
import { useRouter } from "next/router"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import { Visibility } from "@mui/icons-material"
import Loader from "../../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent/index"
import {
  agendaPreviewAddToLocalStorage,
  agendaPreviewGetFromLocalStorage,
  agendaPreviewRemoveFromLocalStorage,
} from "../../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage"
import dynamic from "next/dynamic"
import AgendaPreview from "./AgendaPreview/AgendaPreview"
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../../util/util"
import { toast } from "react-toastify"
import DOMPurify from "dompurify"
import {
  DecryptData,
  EncryptData,
} from "../../../../../components/common/EncryptDecrypt/index.js"
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({})

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा")
  const [buttonInputState, setButtonInputState] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRows, setSelectedRows] = React.useState([])
  const [getRowsData, setGetRowsData] = React.useState([])
  const [submitDataButton, setSubmitDataButton] = useState(true)
  const [committeeId2, setCommitteeId2] = useState({})
  const [showSaveButton, setshowSaveButton] = useState(true)
  const [loading, setLoading] = useState(false)
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const [openPreviewModal, setOpenPreviewModal] = useState(false)

  const [finalSubmitButtonOn, setFinalSubmitButtonOn] = useState(true)

  const refToRTE = useRef(null)
  const refToRTEDetails = useRef(null)
  const [refContent, setRefContent] = useState("")
  const parser = new DOMParser()

  const userToken = useGetToken()

  ///////////////////////////////////////////////////////////
  const [setAgendaNumber, setSetAgendaNumber] = useState(null)

  const [showDocketModel, setShowDocketModel] = useState(false)

  // HYPERLINKS CHECKED
  const [messageToShowOnError, setMessageToShowOnError] = useState("")
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("")
  //  VALIDATION FOR NONMANDATORY FIELDS
  const [coveringLetterSubjectFiledChk, setCoveringLetterSubjectFiledChk] =
    useState(true)
  const [tipFiledChk, setTipFiledChk] = useState(true)

  const [financialYear, setFinancialYear] = useState([
    {
      id: 1,
      financialYearEn: "",
      financialYearMr: "",
    },
  ])

  const [selectedCommiteeName, setSelectedCommiteeName] = useState()
  let defaultcoveringSubject = "पिंपरी चिंचवड महानगरपालिकेची   आयोजित केलेबाबत."
  let chiSabha = "ची सभा"

  const [tipForAgendaFixed, setTipForAgendaFixed] = useState(
    "प्रस्तुत कार्यपत्रिकेवरील विषयांची विषयपत्रे (डॉकेटस् ) नगरसचिव कार्यालयात वाचण्यासाठी ठेवण्यात आलेली आहेत."
  )

  useEffect(() => {
    setValue("coveringLetterSubject", defaultcoveringSubject)
  }, [])

  useEffect(() => {
    let tukde = getValues("coveringLetterSubject")?.split("   ")
    if (tukde?.length > 0 && selectedCommiteeName) {
      console.log("selectedCommiteeName", selectedCommiteeName)
      let nayaHaiVah = ""
      let chiSabha = ""
      if (selectedCommiteeName !== "महापालिका सभा ") {
        chiSabha = "ची सभा "
      }
      nayaHaiVah = tukde[0] + " " + selectedCommiteeName + chiSabha + tukde[1]
      console.log("nayaHaiVah", nayaHaiVah)
      setValue("coveringLetterSubject", nayaHaiVah)
    }
  }, [selectedCommiteeName])

  const [data, setData] = useState({
    rows: [],
    // totalRows: 0,
    // rowsPerPageOptions: [10, 20, 50, 100],
    // pageSize: 10,
    // page: 1,
  })

  const router = useRouter()

  const language = useSelector((store) => store.labels.language)
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

  // Get Modal Table - Data
  const getAllDocketEntry = (_pageSize = 10, _pageNo = 0) => {
    if (watch("committeeId")) {
      setSelectedRows([])
      setLoading(true)

      axios
        .get(
          `${urls.MSURL}/trnNewDocketEntry/getByCmId?cmId=${watch(
            "committeeId"
          )}`,
          {
            params: {
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            let result = res?.data
            if (result?.length > 0) {
              let _res = result?.map((j, i) => {
                console.log("44")
                return {
                  ...j,
                  id: j.id,
                  srNo: i + 1,
                  amount: j.amount,
                  vishaypatra: j.vishaypatra,
                  prapatra: j.prapatra,
                  otherDocument: j.otherDocument,
                  otherDocument2: j.otherDocument2,
                  otherDocument3: j.otherDocument3,
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
                  inwardDate: j.sentDateClerk
                    ? moment(j.sentDateClerk).format("DD-MM-YYYY , h:mm a")
                    : "Not Available",
                  hodRemark: j.hodRemark,
                  inwardOutwardNumber: j.inwardOutwardNumber,
                  financialYearEn: financialYear?.find((obj) => {
                    return obj.id === j.financialYear
                  })?.financialYearEn,
                  financialYearMr: financialYear?.find((obj) => {
                    return obj.id === j.financialYear
                  })?.financialYearMr,
                  committeeIdEn: j.commett?.map((val) => {
                    return comittees1?.find((obj) => {
                      return obj.id == val.committeeId && obj
                    })?.comitteeEn
                  }),
                  committeeIdMr: j.commett?.map((val) => {
                    return comittees1?.find((obj) => {
                      return obj.id == val.committeeId && obj
                    })?.comitteeMr
                  }),
                  inwardOutWardDate:
                    j.inwardOutWardDate !== null
                      ? moment(j.inwardOutWardDate).format("DD-MM-YYYY")
                      : " --- ",
                  outwardNumber: j.outwardNumber,
                  reference: j.reference,
                  departmentId: j.departmentId,

                  departmentNameEn: departments?.find(
                    (obj) => obj.id === j.departmentId
                  )?.departmentEn,
                  departmentNameMr: departments?.find(
                    (obj) => obj.id === j.departmentId
                  )?.departmentMr,

                  docketType: j.docketType,
                  budgetHead: j.budgetHead,

                  nameOfApprover: j.nameOfApprover,
                  toDepartment: j.toDepartment,
                  toDesignation: j.toDesignation,
                }
              })

              setData({
                rows: _res ? _res : "",
              })
              setLoading(false)
            } else {
              sweetAlert({
                title: "WARNING!",
                text: `No Dockets Are Generated Against Your Selected Committe!`,
                icon: "warning",
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
              setData([])
              setSelectedRows([])
              setLoading(false)
            }
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
            setData([])
            setSelectedRows([])
            setLoading(false)
          }
        })
        .catch((error) => {
          setData([])
          setSelectedRows([])
          setLoading(false)
          callCatchMethod(error, language)
        })
    }
  }

  useEffect(() => {
    getAllDocketEntry()
  }, [watch("committeeId")])

  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll`, {
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
      })
      .catch((error) => {
        callCatchMethod(error, language)
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
      })
  }, [])

  // OnSubmit Form
  const onSubmitForm = (formData) => {
    console.log("form Data", formData)

    if (tipFiledChk && coveringLetterSubjectFiledChk) {
      let agendaSubjectDao = selectedRows?.map((j, i) => ({
        docketId: j.id,
        departmentId: j.departmentId,
        // NEW FIELD ADDED
        inwardOutWardDate: j.inwardOutWardDate
          ? moment(j.inwardOutWardDate, "DD-MM-YYYY").format("YYYY-MM-DD")
          : null,
        outwardNumber: j.outwardNumber,
        // NEW FIELD ADDED
        status: j.status,
        subject: j.subject,
        subjectDate: j.subjectDate,
        subjectSerialNumber: j.subjectSerialNumber,
        subjectSummary: j.subjectSummary,
        prapatra: j.prapatra,
      }))

      const finalBodyForApi = {
        ...formData,
        agendaNo: formData.agendaNo,
        committeeId: Number(formData.committeeId),
        activeFlag: "Y",
        agendaSubjectDao,
        searchedCommiteeId: watch("committeeId"),
      }

      setTimeout(() => {
        agendaPreviewAddToLocalStorage("agendaPrivewData", finalBodyForApi)
        // router.push({
        //   pathname:
        //     "/municipalSecretariatManagement/transaction/agenda/prepareAgenda/agendaPreview",
        // })
        setOpenPreviewModal(true)
      }, 10)
    } else {
      toast.error(
        language == "en"
          ? `Please remove the "ERROR" from the input field`
          : `कृपया इनपुट फील्डमधून "ERROR" काढा`
      )
    }
  }

  const finalSubmitFunction = () => {
    if (tipFiledChk && coveringLetterSubjectFiledChk) {
      const getDataFromLocal =
        agendaPreviewGetFromLocalStorage("agendaPrivewData")
      sweetAlert({
        title: "Are you sure?",
        text: "You want to save the agenda please select yes otherwise not!",
        icon: "warning",
        buttons: ["Cancel", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((willDelete) => {
        if (willDelete) {
          axios
            .post(
              `${urls.MSURL}/trnPrepareMeetingAgenda/save`,
              getDataFromLocal,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              if (res.status == 200 || res.status == 201) {
                sweetAlert(
                  "Saved!",
                  "Agenda Saved successfully !",
                  "success"
                ).then((will) => {
                  if (will) {
                    axios
                      .get(
                        `${urls.MSURL}/trnPrepareMeetingAgenda/getAgendaNo`,
                        {
                          headers: {
                            Authorization: `Bearer ${userToken}`,
                          },
                        }
                      )
                      .then((res) => {
                        if (res.status == 200 || res.status == 201) {
                          setSetAgendaNumber(res?.data)
                          sweetAlert({
                            title: "Great, Please Note Your Agenda Number",
                            text: `Your Agenda Number is : ${res.data}`,
                            icon: "success",
                            // buttons: ["Cancel", "Yes"],
                            dangerMode: false,
                          }).then((will) => {
                            if (will) {
                              router.push({
                                pathname:
                                  "/municipalSecretariatManagement/transaction/meetingScheduling",
                                query: {
                                  agendaNo: res?.data,
                                },
                              })
                              agendaPreviewRemoveFromLocalStorage(
                                "agendaPrivewData"
                              )
                            } else {
                              router.push({
                                pathname:
                                  "/municipalSecretariatManagement/transaction/meetingScheduling",
                                query: {
                                  agendaNo: res?.data,
                                },
                              })
                              agendaPreviewRemoveFromLocalStorage(
                                "agendaPrivewData"
                              )
                            }
                          })
                        } else {
                          sweetAlert("Something Went Wrong")
                        }
                      })
                      .catch((error) => {
                        callCatchMethod(error, language)
                        // sweetAlert("Something Went Wrong!")
                      })
                  } else {
                    axios
                      .get(
                        `${urls.MSURL}/trnPrepareMeetingAgenda/getAgendaNo`,
                        {
                          headers: {
                            Authorization: `Bearer ${userToken}`,
                          },
                        }
                      )
                      .then((res) => {
                        if (res.status == 200 || res.status == 201) {
                          sweetAlert({
                            title: "Great, Please Note Your Agenda Number",
                            text: `Your Agenda Number is : ${res.data}`,
                            icon: "success",
                            // buttons: ["Cancel", "Yes"],
                            dangerMode: false,
                          }).then((will) => {
                            if (will) {
                              router.push({
                                pathname:
                                  "/municipalSecretariatManagement/transaction/meetingScheduling",
                                query: {
                                  agendaNo: res?.data,
                                },
                              })
                              agendaPreviewRemoveFromLocalStorage(
                                "agendaPrivewData"
                              )
                            } else {
                              router.push({
                                pathname:
                                  "/municipalSecretariatManagement/transaction/meetingScheduling",
                                query: {
                                  agendaNo: res?.data,
                                },
                              })
                              agendaPreviewRemoveFromLocalStorage(
                                "agendaPrivewData"
                              )
                            }
                          })
                        } else {
                          sweetAlert("Something Went Wrong")
                        }
                      })
                      .catch((error) => {
                        callCatchMethod(error, language)
                        // sweetAlert("Something Went Wrong!")
                      })
                  }
                })
              } else {
                setFinalSubmitButtonOn(true)
              }
            })
            .catch((error) => {
              if (error.request.status === 500) {
                swal(error.response.data.message, {
                  icon: "error",
                })
                // getAllDocketEntry()
                setButtonInputState(false)
              } else {
                swal("Something went wrong!", {
                  icon: "error",
                })
                // getAllDocketEntry()
                setButtonInputState(false)
              }
              // console.log("error", error);
            })
        } else {
          sweetAlert("Record Is Safe")
          setFinalSubmitButtonOn(true)
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

  const [comittees1, setcomittees1] = useState([])

  const getcomittees1 = () => {
    setLoading(true)
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAllForDropDown`, {
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
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  ////////////////////DEPARTMENT//////////////////////
  const [departments, setDepartments] = useState([])

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDepartments(
          res?.data?.department?.map((r, i) => ({
            id: r.id,
            departmentEn: r.department,
            departmentMr: r.departmentMr,
          }))
        )
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    getcomittees1()
    getDepartment()
  }, [])

  // USE  EFFECT

  useEffect(() => {
    if (selectedRows?.length > 0) {
      if (getRowsData.length > 0) {
        setshowSaveButton(false)
      }
    } else {
      setshowSaveButton(true)
    }
  }, [selectedRows])

  // AFTER SUBMIT
  const submitSortedValues = () => {
    console.log("500", getRowsData)
    setSelectedRows(getRowsData)
    handleCancel()
    setSubmitDataButton(true)
    setFinalSubmitButtonOn(true)
  }

  //   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>   //
  const showModal = () => {
    setIsModalOpen(true)
    // alert("true")
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setSubmitDataButton(true)
  }

  const columns1 = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      headerClassName: styles.header_cell,

      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "departmentId",
      headerName: <FormattedLabel id="departmentName" />,
      headerClassName: styles.header_cell,
      minWidth: 300,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {language === "en" ? (
              <strong style={{ color: "black" }}>
                {
                  departments?.find(
                    (obj) => obj.id === params?.row?.departmentId
                  )?.departmentEn
                }
              </strong>
            ) : (
              <strong style={{ color: "black" }}>
                {
                  departments?.find(
                    (obj) => obj.id === params?.row?.departmentId
                  )?.departmentMr
                }
              </strong>
            )}
          </>
        )
      },
    },
    {
      field: "subject",
      headerName: <FormattedLabel id="subject" />,
      headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
    },
    {
      field: "subjectSummary",
      headerName: <FormattedLabel id="subjectSummary" />,
      headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
      renderCell: (params) => {
        const doc = parser.parseFromString(
          params?.row?.subjectSummary,
          "text/html"
        )
        const plainTextContent = doc.body.innerText
        console.log(plainTextContent)
        return <div>{plainTextContent}</div>
      },
    },
    {
      field: "inwardDate",
      headerName: <FormattedLabel id="inwardDate" />,
      headerClassName: styles.header_cell,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      headerClassName: styles.header_cell,
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: "#096dd9" }}
              onClick={() => {
                setShowDocketModel(true)
                setParticularRow(params?.row)
              }}
            >
              <Tooltip
                title={
                  language == "en"
                    ? "VIEW THIS DOCKET'S INFO"
                    : "या डॉकेटची माहिती पहा"
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

  const columns = [
    {
      field: "departmentId",
      headerName: <FormattedLabel id="departmentName" />,
      headerClassName: styles.header_cell,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            {language === "en" ? (
              <strong style={{ color: "black" }}>
                {
                  departments?.find(
                    (obj) => obj.id === params?.row?.departmentId
                  )?.departmentEn
                }
              </strong>
            ) : (
              <strong style={{ color: "black" }}>
                {
                  departments?.find(
                    (obj) => obj.id === params?.row?.departmentId
                  )?.departmentMr
                }
              </strong>
            )}
          </>
        )
      },
    },
    {
      field: "subject",
      headerName: <FormattedLabel id="subject" />,
      headerClassName: styles.header_cell,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "subjectSummary",
      headerName: <FormattedLabel id="subjectSummary" />,
      headerClassName: styles.header_cell,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        const doc = parser.parseFromString(
          params?.row?.subjectSummary,
          "text/html"
        )
        const plainTextContent = doc.body.innerText
        console.log(plainTextContent)
        return <div>{plainTextContent}</div>
      },
    },
    {
      field: "inwardDate",
      headerName: <FormattedLabel id="inwardDate" />,
      headerClassName: styles.header_cell,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      headerClassName: styles.header_cell,
      width: 130,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              sx={{ color: "#096dd9" }}
              onClick={() => {
                setShowDocketModel(true)
                setParticularRow(params?.row)
              }}
            >
              <Tooltip
                title={
                  language == "en"
                    ? "VIEW THIS DOCKET'S INFO"
                    : "या डॉकेटची माहिती पहा"
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

  useEffect(() => {
    // Load previously selected row IDs from another array
    const prevSelectedRowIds = loadSelectedRowIds()
    setSelectedRowIds(prevSelectedRowIds)
  }, [selectedRows])

  const loadSelectedRowIds = () => {
    // Load selected row IDs from other array (e.g. localStorage)
    const savedRowIds = selectedRows.map((obj) => obj.id)
    return savedRowIds ? savedRowIds : []
  }

  /////////////////////////////////////////////////////////
  const [particularRow, setParticularRow] = useState(null)
  // const renderFormFields = () => {
  //   if (!particularRow) return null;
  //   return Object.keys(particularRow).map((field) => (
  //     // <TextField key={field} label={field} value={particularRow[field]} disabled />
  //     <FormControl key={field} style={{ minWidth: 120, marginBottom: "5px" }}>
  //       <InputLabel htmlFor={field}>{field}</InputLabel>
  //       <Input id={field} value={particularRow[field]} disabled />
  //     </FormControl>
  //   ));
  // };

  // Row

  // useEffect(() => {
  //   if (tipForAgendaFixed) {
  //     alert("aaaya")
  //     setSubjectForAgendaFixed()
  //   }
  // }, [tipForAgendaFixed])

  useEffect(() => {
    if (watch("tip")) {
      setTipForAgendaFixed(watch("tip"))
    } else {
      setTipForAgendaFixed(tipForAgendaFixed)
    }
  }, [watch("tip")])

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

    checkField("coveringLetterSubject", setCoveringLetterSubjectFiledChk)
    checkField("tip", setTipFiledChk)
  }, [watch("coveringLetterSubject"), tipForAgendaFixed, watch("tip")])

  // >>>>>>>>>>>>>>>> FILE PREVIEW PATH
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64)
    const length = binaryString.length
    const bytes = new Uint8Array(length)

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    return bytes.buffer
  }

  const handleDocumentsOpen = (field) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", field)

    const fileExtension = DecryptPhoto.split(".").pop().toLowerCase()
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto)

    if (fileExtension === "pdf") {
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          const dataUrl = `data:${response?.data?.mimeType};base64,${response?.data?.fileName}`
          const newTab = window.open()
          newTab.document.write(`
                          <html>
                            <body style="margin: 0;">
                              <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
                            </body>
                          </html>
                        `)
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    } else if (fileExtension === "xlsx") {
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          console.log("Excel API Response:", response)
          console.log("Excel API Response Data:", response.data.fileName)

          const excelBase64 = response?.data?.fileName

          const data = base64ToArrayBuffer(excelBase64)

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })

          saveAs(excelBlob, "Document.xlsx")
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    } else {
      const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          console.log("ImageApi21312", r?.data)
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`
          const newTab = window.open()
          newTab.document.body.innerHTML = `<img src="${imageUrl}" />`
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    }
  }

  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper style={{ height: "100vh" }} className={styles.adjustForBread}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
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
              <FormattedLabel id="prepareAgenda" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {loading ? (
          <Loader />
        ) : (
          <div>
            <form onSubmit={handleSubmit(onSubmitForm)} autoComplete="off">
              {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}

              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={2}
                    lg={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0% 2.5%",
                    }}
                  >
                    <Paper elevation={4} style={{ width: "auto" }}>
                      <Button
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() =>
                          router.push({
                            pathname:
                              "/municipalSecretariatManagement/transaction/agenda",
                          })
                        }
                        size="small"
                      >
                        {<FormattedLabel id="back" />}
                      </Button>
                    </Paper>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={8}
                    lg={8}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl error={!!errors.committeeId}>
                      <InputLabel>
                        {<FormattedLabel id="selectCommitteeName" />}{" "}
                      </InputLabel>
                      <Controller
                        control={control}
                        render={({ field }) => (
                          <Select
                            fullWidth
                            autoFocus
                            value={field.value}
                            label={<FormattedLabel id="selectCommitteeName" />}
                            onChange={(value) => {
                              field.onChange(value),
                                setValue(
                                  "coveringLetterSubject",
                                  defaultcoveringSubject
                                )

                              setSelectedCommiteeName(
                                comittees1?.find(
                                  (x) => x.id === value.target.value
                                )?.comitteeMr
                              )
                            }}
                            variant="standard"
                            style={{ width: "26vw" }}
                          >
                            {comittees1 &&
                              comittees1.map((comittee, index) => {
                                setCommitteeId2(comittee.id, comittee.comittee)
                                return (
                                  <MenuItem key={index} value={comittee.id}>
                                    {language == "en"
                                      ? //@ts-ignore
                                        comittee.comitteeEn
                                      : // @ts-ignore
                                        comittee?.comitteeMr}
                                  </MenuItem>
                                )
                              })}
                          </Select>
                        )}
                        name="committeeId"
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.committeeId
                          ? errors.committeeId.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {/* ////////////////// */}
                  <Grid
                    item
                    xs={12}
                    md={2}
                    lg={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  ></Grid>
                </Grid>

                {/* <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  disabled
                  style={{ backgroundColor: "white" }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="amenities" />}
                  label={<FormattedLabel id="committeeName" />}
                  // value={
                  //   comittees1?.find(
                  //     (obj) => obj.id === Number(watch("committeeId"))
                  //   )?.committee
                  // }
                  InputLabelProps={{
                    shrink: watch("committeeId") ? true : false,
                  }}
                  value={
                    language == "en"
                      ? comittees1.find((c) => c.id == watch("committeeId"))?.comitteeEn
                      : comittees1.find((c) => c.id == watch("committeeId"))?.comitteeMr
                  }
                  variant="outlined"
                  {...register("committeeName")}
                  error={!!errors.committeeName}
                  helperText={errors?.committeeName ? errors.committeeName.message : null}
                />
              </Grid> */}

                {/* .....................................Letter Subject................................... */}

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "1% 7%",
                  }}
                >
                  <Paper
                    elevation={1}
                    style={{ width: "100%", borderRadius: "10px" }}
                  >
                    <strong style={{ fontSize: "medium" }}>
                      {<FormattedLabel id="coveringLetterSubject" />}
                    </strong>
                    <TextareaAutosize
                      // defaultValue={subjectForAgendaFixed}
                      style={{ overflow: "auto" }}
                      placeholder={
                        language == "en"
                          ? "Covering Letter Subject"
                          : "कव्हरिंग लेटर विषय"
                      }
                      className={styles.bigText}
                      {...register("coveringLetterSubject")}
                      // onChange={(e) => setSubjectForAgendaFixed(e.target.value)}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {!coveringLetterSubjectFiledChk ? error1Messsage() : ""}
                    </FormHelperText>
                  </Paper>
                </Grid>

                {/* .....................................Letter Subject Note................................... */}
                {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "1% 7%",
                  }}
                >
                  <Paper
                    elevation={1}
                    style={{ width: "100%", borderRadius: "10px" }}
                  >
                    <strong style={{ fontSize: "medium" }}>
                      {<FormattedLabel id="coveringLetterNote" />}
                    </strong>
                    <TextareaAutosize
                      style={{ overflow: "auto" }}
                      placeholder={
                        language == "en"
                          ? "Covering Letter Note"
                          : "कव्हरिंग लेटर नोट"
                      }
                      className={styles.bigText}
                      {...register("coveringLetterNote")}
                    />
                  </Paper>
                </Grid> */}

                {/* .....................................Agenda Description................................... */}
                {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "1% 7%",
                  }}
                >
                  <Paper
                    elevation={1}
                    style={{ width: "100%", borderRadius: "10px" }}
                  >
                    <strong style={{ fontSize: "medium" }}>
                      {<FormattedLabel id="agendaDescription" />}
                    </strong>
                    <TextareaAutosize
                      style={{ overflow: "auto" }}
                      placeholder={
                        language == "en" ? "Agenda Description" : "अजेंडा वर्णन"
                      }
                      className={styles.bigText}
                      {...register("agendaDescription")}
                    />
                  </Paper>
                </Grid> */}

                {/* .....................................Tip................................... */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "left",
                    alignItems: "center",
                    flexDirection: "column",
                    margin: "1% 7%",
                  }}
                >
                  <Paper
                    elevation={1}
                    style={{ width: "100%", borderRadius: "10px" }}
                  >
                    <strong style={{ fontSize: "medium" }}>
                      {<FormattedLabel id="tip" />}
                    </strong>
                    <TextareaAutosize
                      defaultValue={tipForAgendaFixed}
                      style={{ overflow: "auto" }}
                      placeholder={language == "en" ? "Tip" : "टिप"}
                      className={styles.bigText}
                      {...register("tip")}
                      // onChange={(e) => (e.target.value)}
                    />
                    <FormHelperText style={{ color: "red" }}>
                      {!tipFiledChk ? error1Messsage() : ""}
                    </FormHelperText>
                  </Paper>
                </Grid>
              </Grid>

              {/* ////////////////////////////////////////Buttons Line//////////////////////////////////////////// */}

              <Grid
                container
                // spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={2}
                  // lg={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "5px", width: "auto" }}>
                    <Button
                      disabled={data?.rows?.length > 0 ? false : true}
                      variant="contained"
                      endIcon={<InsertInvitationIcon />}
                      onClick={() => {
                        if (tipFiledChk && coveringLetterSubjectFiledChk) {
                          return setIsModalOpen(true)
                        } else {
                          toast.error(
                            language == "en"
                              ? `Please remove the "ERROR" from the input field`
                              : `कृपया इनपुट फील्डमधून "ERROR" काढा`
                          )
                        }
                      }}
                      color="primary"
                      size="small"
                    >
                      {<FormattedLabel id="selectDockets" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* Preview */}

                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={2}
                  // lg={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "5px", width: "auto" }}>
                    <Button
                      disabled={showSaveButton}
                      type="submit"
                      variant="contained"
                      color="success"
                      endIcon={<Visibility />}
                      size="small"
                    >
                      {<FormattedLabel id="preview" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* Submit */}
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={2}
                  // lg={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper elevation={4} style={{ margin: "5px", width: "auto" }}>
                    <Button
                      // sx={{ marginRight: 8 }}
                      // disabled={showSaveButton}
                      disabled={finalSubmitButtonOn}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<SaveIcon />}
                      size="small"
                      onClick={finalSubmitFunction}
                    >
                      {language === "en" ? btnSaveText : btnSaveTextMr}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </div>
        )}

        {/* ...........................................BUTTONS................................... */}
        {selectedRows?.length > 0 ? (
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
              // "& .MuiSvgIcon-root": {
              //   color: "black", // change the color of the check mark here
              // },
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
            rows={selectedRows || []}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
          />
        ) : (
          ""
        )}

        <>
          <Modal
            title="Select Dockets"
            open={isModalOpen}
            onOk={true}
            footer=""
            sx={{
              padding: 5,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                width: "90%",
              }}
            >
              <DataGrid
                sx={{
                  overflowY: "scroll",
                  backgroundColor: "white",
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
                autoHeight={true}
                // rowHeight={50}
                // pagination
                // paginationMode="server"
                // loading={data.loading}
                //   rowCount={data?.totalRows}
                //   rowsPerPageOptions={data?.rowsPerPageOptions}
                //   page={data?.page}
                //   pageSize={data?.pageSize}
                //////////////////////////////////////////////////////////
                rows={data?.rows || []}
                columns={columns1}
                pageSize={10}
                rowsPerPageOptions={[5]}
                checkboxSelection={true}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                selectionModel={selectedRowIds}
                onSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids)

                  setSelectedRowIds(ids)
                  const selectedRows = data?.rows?.filter((row) =>
                    selectedIDs.has(row.id)
                  )

                  setGetRowsData(selectedRows)
                  setSubmitDataButton(false)
                }}
              />
              <div
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 90,
                }}
              >
                <Button
                  disabled={submitDataButton}
                  type="button"
                  variant="contained"
                  color="success"
                  endIcon={<SaveIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={submitSortedValues}
                >
                  {<FormattedLabel id="submitData" />}
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleCancel}
                >
                  {<FormattedLabel id="closeModal" />}
                </Button>
              </div>
            </Box>
          </Modal>
        </>

        {/* ///////////////////////////////////////////NEW MODEL TO SHOW DOCTKET///////////////////////////////////////////// */}

        <>
          <Modal
            open={showDocketModel}
            sx={{
              padding: 5,
              display: "flex",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                width: "90%",
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                border: "2px solid black",
              }}
            >
              <Box
                className={styles.details}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "99%",
                  height: "auto",
                  overflow: "auto",
                  padding: "0.5%",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 500,
                  borderRadius: 100,
                  border: "1px solid black",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <strong>DOCKET PREVIEW</strong>
                </div>
              </Box>
              <form
                style={{
                  maxHeight: "calc(100vh - 170px)",
                  width: "100%",
                  overflowY: "auto",
                }}
              >
                <div style={{ marginTop: 20 }}>
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "0px 5px 10px 22px",
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
                        Docket_Id : {particularRow?.docketId}
                      </Button>
                    </Grid>
                  </Grid>
                </div>

                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    style={{
                      margin: "1%",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "150px" }}
                      label={<FormattedLabel id="subjectDate" />}
                      variant="standard"
                      value={moment(particularRow?.subjectDate).format(
                        "DD-MM-YYYY"
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    style={{
                      margin: "1%",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "400px" }}
                      label={<FormattedLabel id="departmentName" />}
                      variant="standard"
                      value={
                        language == "en"
                          ? particularRow?.departmentNameEn
                          : particularRow?.departmentNameMr
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "1%",
                    }}
                  >
                    <Paper
                      elevation={1}
                      style={{ width: "100%", borderRadius: "10px" }}
                    >
                      <strong style={{ fontSize: "medium" }}>
                        {<FormattedLabel id="reference" />}
                      </strong>
                      <TextareaAutosize
                        disabled
                        style={{ overflow: "auto" }}
                        className={styles.bigText}
                        value={particularRow?.reference}
                      />
                    </Paper>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "1%",
                    }}
                  >
                    <Paper
                      elevation={1}
                      style={{ width: "100%", borderRadius: "10px" }}
                    >
                      <strong style={{ fontSize: "medium" }}>
                        {<FormattedLabel id="subject" />}
                      </strong>
                      <TextareaAutosize
                        disabled
                        style={{ overflow: "auto" }}
                        className={styles.bigText}
                        value={particularRow?.subject}
                      />
                    </Paper>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "1%",
                    }}
                  >
                    <Paper
                      elevation={1}
                      style={{ width: "100%", borderRadius: "10px" }}
                    >
                      <strong style={{ fontSize: "medium" }}>
                        {<FormattedLabel id="subjectSummary" />}
                      </strong>
                      <JoditEditor
                        ref={refToRTE}
                        value={particularRow?.subjectSummary}
                        config={{
                          readonly: true,
                        }}
                      />
                    </Paper>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      alignItems: "center",
                      flexDirection: "column",
                      margin: "1%",
                    }}
                  >
                    <Paper
                      elevation={1}
                      style={{ width: "100%", borderRadius: "10px" }}
                    >
                      <strong style={{ fontSize: "medium" }}>
                        {<FormattedLabel id="subjectDetails" />}
                      </strong>
                      {/* <TextareaAutosize
                        disabled
                        style={{ overflow: "auto" }}
                        className={styles.bigText}
                        value={particularRow?.subjectDetails}
                      /> */}
                      <JoditEditor
                        ref={refToRTEDetails}
                        value={particularRow?.subjectDetails}
                        config={{
                          readonly: true,
                        }}
                      />
                    </Paper>
                  </Grid>

                  {language == "en" ? (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1%",
                      }}
                    >
                      <Paper
                        elevation={1}
                        style={{ width: "100%", borderRadius: "10px" }}
                      >
                        <strong style={{ fontSize: "medium" }}>
                          {<FormattedLabel id="selectedCommittees" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.committeeIdEn}
                        />
                      </Paper>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1%",
                      }}
                    >
                      <Paper
                        elevation={1}
                        style={{ width: "100%", borderRadius: "10px" }}
                      >
                        <strong style={{ fontSize: "medium" }}>
                          {<FormattedLabel id="selectedCommittees" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.committeeIdMr}
                        />
                      </Paper>
                    </Grid>
                  )}

                  {language == "en" ? (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ width: "90%" }}
                        label={<FormattedLabel id="financialYear" />}
                        variant="standard"
                        value={particularRow?.financialYearEn}
                      />
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ width: "90%" }}
                        label={<FormattedLabel id="financialYear" />}
                        variant="standard"
                        value={particularRow?.financialYearMr}
                      />
                    </Grid>
                  )}

                  {/* /////////////////////////////// */}

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "90%" }}
                      label={<FormattedLabel id="docketType" />}
                      variant="standard"
                      value={
                        particularRow?.docketType == 2
                          ? language == "en"
                            ? "Expenditure"
                            : "खर्च"
                          : language == "en"
                          ? "General"
                          : "सामान्य"
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "90%" }}
                      label={<FormattedLabel id="amount" />}
                      variant="standard"
                      value={particularRow?.amount}
                    />
                  </Grid>

                  {particularRow?.docketType == 2 && (
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        disabled
                        sx={{ width: "90%" }}
                        label={<FormattedLabel id="budgetHead" />}
                        variant="standard"
                        value={particularRow?.budgetHead}
                      />
                    </Grid>
                  )}

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "90%" }}
                      label={<FormattedLabel id="outwardNumber" />}
                      variant="standard"
                      value={particularRow?.outwardNumber}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "90%" }}
                      label={<FormattedLabel id="approverName" />}
                      variant="standard"
                      value={particularRow?.nameOfApprover}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "90%" }}
                      label={<FormattedLabel id="approverDepartment" />}
                      variant="standard"
                      value={particularRow?.toDepartment}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      disabled
                      sx={{ width: "90%" }}
                      label={<FormattedLabel id="approverDesignation" />}
                      variant="standard"
                      value={particularRow?.toDesignation}
                    />
                  </Grid>

                  <Grid container spacing={2} sx={{ padding: 5 }}>
                    {particularRow?.vishaypatra ? (
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleDocumentsOpen(particularRow?.vishaypatra)
                          }}
                          sx={{ minWidth: "215px", height: "24px" }}
                        >
                          {/* {language == "en" ? "VISHYAPATRA" : "विषय पत्र"} */}
                          {particularRow?.vishaypatraOriginalName
                            ? particularRow?.vishaypatraOriginalName
                            : "FileName is not Available"}
                        </Button>
                      </Grid>
                    ) : (
                      ""
                    )}

                    {particularRow?.prapatra ? (
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleDocumentsOpen(particularRow?.prapatra)
                          }}
                          sx={{ minWidth: "215px", height: "24px" }}
                        >
                          {/* {language == "en" ? "PRAPATRA" : "प्रापत्र"} */}
                          {particularRow?.prapatraOriginalName
                            ? particularRow?.prapatraOriginalName
                            : "FileName is not Available"}
                        </Button>
                      </Grid>
                    ) : (
                      ""
                    )}

                    {particularRow?.otherDocument ? (
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleDocumentsOpen(particularRow?.otherDocument)
                          }}
                          sx={{ minWidth: "215px", height: "24px" }}
                        >
                          {/* {language == "en"
                          ? "OTHER DOCUMENT_1"
                          : "इतर दस्तऐवज_1"} */}
                          {particularRow?.otherDocumentOriginalName
                            ? particularRow?.otherDocumentOriginalName
                            : "FileName is not Available"}
                        </Button>
                      </Grid>
                    ) : (
                      ""
                    )}
                    {/* /////////////////////////////////////////// */}
                    {particularRow?.otherDocument2 ? (
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleDocumentsOpen(particularRow?.otherDocument2)
                          }}
                          sx={{ minWidth: "215px", height: "24px" }}
                        >
                          {/* {language == "en"
                          ? "OTHER DOCUMENT_2"
                          : "इतर दस्तऐवज_2"} */}
                          {particularRow?.otherDocument2OriginalName
                            ? particularRow?.otherDocument2OriginalName
                            : "FileName is not Available"}
                        </Button>
                      </Grid>
                    ) : (
                      ""
                    )}
                    {/* /////////////////////////////////////////// */}
                    {particularRow?.otherDocument3 ? (
                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleDocumentsOpen(particularRow?.otherDocument3)
                          }}
                          sx={{ minWidth: "215px", height: "24px" }}
                        >
                          {/* {language == "en"
                          ? "OTHER DOCUMENT_3"
                          : "इतर दस्तऐवज_3"} */}
                          {particularRow?.otherDocument3OriginalName
                            ? particularRow?.otherDocument3OriginalName
                            : "FileName is not Available"}
                        </Button>
                      </Grid>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </form>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => setShowDocketModel(false)}
              >
                {language == "en" ? "Cancel" : "रद्द करा"}
              </Button>
            </Box>
          </Modal>
        </>

        {/* AGENDA PREVIEW COMPONENT */}

        {openPreviewModal && (
          <AgendaPreview
            openPreviewModal={openPreviewModal}
            setOpenPreviewModal={setOpenPreviewModal}
            setFinalSubmitButtonOn={setFinalSubmitButtonOn}
          />
        )}
      </Paper>
    </>
  )
}

export default Index
