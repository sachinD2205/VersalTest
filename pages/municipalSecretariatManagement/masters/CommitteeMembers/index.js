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
  Grid,
  Box,
  ThemeProvider,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextareaAutosize,
  Modal,
} from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Schema from "../../../../containers/schema/municipalSecretariatManagement/MstCommitteeMembersSchema"
import moment from "moment"
import ToggleOnIcon from "@mui/icons-material/ToggleOn"
import ToggleOffIcon from "@mui/icons-material/ToggleOff"
import swal from "sweetalert"
import { useSelector } from "react-redux"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import urls from "../../../../URLS/urls"
import styles from "../view.module.css"
import theme from "../../../../theme"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const {
    register,
    watch,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onSubmit",
  })

  const [btnSaveText, setBtnSaveText] = useState("Save")
  const [btnSaveTextMr, setBtnSaveTextMr] = useState("जतन करा")
  const [buttonInputState, setButtonInputState] = useState()
  const [isOpenCollapse, setIsOpenCollapse] = useState(false)
  const [id, setID] = useState()
  const [editButtonInputState, setEditButtonInputState] = useState(false)
  const [slideChecked, setSlideChecked] = useState(false)

  const [loading, setLoading] = useState(false)
  const [loadingComm, setLoadingComm] = useState(false)
  const [loadingCommMembers, setLoadingCommMembers] = useState(false)
  const [memberChangeButton, setMemberChangeButton] = useState(false)
  const [memberChange, setMemberChange] = useState(false)

  const [showErrorModel, setShowErrorModel] = useState(false)
  const [errorData, setErrorData] = useState([])

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  })

  const [commData, setCommData] = useState([])
  const [corporatorData, setCorporatorData] = useState([])
  const [paramsDotRowData, setParamsDotRowData] = useState(null)

  const [corporatorForMemberChange, setCorporatorForMemberChange] = useState([])

  const [nominatedAsChairperson, setNominatedAsChairperson] = useState(false)

  const language = useSelector((store) => store.labels.language)
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)

  const showErrorMessagesInModel = (data) => {
    setErrorData(data)
    setShowErrorModel(true)
  }

  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language, showErrorMessagesInModel)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }

  const userToken = useGetToken()

  // Get Table - Data
  const getAllCommitteMembersData = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true)
    axios
      .get(`${urls.MSURL}/mstDefineCommitteeMembers/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(";res", res)
        if (res?.status === 200 || res?.status === 201) {
          let result = res.data?.committeeMembers
          let _res = result?.map((r, i) => {
            console.log("44", r)
            return {
              id: r.id,
              srNo: i + 1 + _pageNo * _pageSize,
              nominatedAsChairperson: r.nominatedAsChairperson,
              nominatedAsChairpersonShow:
                r.nominatedAsChairperson == true ? "Yes" : "No",
              corporatorNo: r.corporatorNo,
              corporatorEn: corporatorData?.find((o) => o.id == r.corporatorNo)
                ?.corporatorNameEn,
              corporatorMr: corporatorData?.find((o) => o.id == r.corporatorNo)
                ?.corporatorNameMr,
              committee: r.committee,
              comitteeEn: commData?.find((o) => o.id === r.committee)
                ?.comitteeEn,
              comitteeMr: commData?.find((o) => o.id === r.committee)
                ?.comitteeMr,
              /////////////////////////////////////////
              fromDate: r.fromDate,
              toDate: r.toDate,
              fromDateShow: moment(r.fromDate)?.format("DD-MM-YYYY"),
              toDateShow: moment(r.toDate)?.format("DD-MM-YYYY"),
              activeFlag: r.activeFlag,
            }
          })
          setData({
            rows: _res,
            totalRows: res.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: res.data.pageSize,
            page: res.data.pageNo,
          })
          setLoading(false)
        } else {
          setData([])
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        // console.log("error", error)
        // if (!error.status) {
        //   console.log(":1000", error)
        //   sweetAlert({
        //     title: "ERROR",
        //     text: "Server is unreachable or may be a network issue, please try after sometime",
        //     icon: "warning",
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // } else {
        //   sweetAlert(error)
        //   setLoading(false)
        // }
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  ///////////////////////////////////////
  const getCommittees = () => {
    setLoadingComm(true)
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setCommData(
            res?.data?.committees
              ?.sort((a, b) => {
                const nameA = a?.committeeName?.toLowerCase() // Convert names to lowercase for case-insensitive sorting
                const nameB = b?.committeeName?.toLowerCase()
                if (nameA < nameB) return -1
                if (nameA > nameB) return 1
                return 0
              })
              .map((r, i) => ({
                id: r.id,
                srNo: i + 1,
                comitteeEn: r.committeeName,
                comitteeMr: r.committeeNameMr,
              }))
          )
          setLoadingComm(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingComm(false)
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
        //   setLoadingComm(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingComm(false)
        // }
        setLoadingComm(false)
        callCatchMethod(error, language)
      })
  }

  ///////////////////////////////////////
  const getCorporators = () => {
    setLoadingCommMembers(true)
    axios
      .get(`${urls.MSURL}/mstDefineCorporators/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log(":log", res)
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
          setLoadingCommMembers(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingCommMembers(false)
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
        //   setLoadingCommMembers(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingCommMembers(false)
        // }
        setLoadingCommMembers(false)
        callCatchMethod(error, language)
      })
  }
  // Corporator For Member  Change
  const getCorporatorsMemberChange = () => {
    setLoadingCommMembers(true)
    axios
      .get(
        `${
          urls.MSURL
        }/mstDefineCorporators/getCorporatorsForMemberChange?committeeId=${+watch(
          "committee"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setCorporatorForMemberChange(
            res?.data
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
          setLoadingCommMembers(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoadingCommMembers(false)
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
        //   setLoadingCommMembers(false)
        // } else {
        //   sweetAlert(error)
        //   setLoadingCommMembers(false)
        // }
        setLoadingCommMembers(false)
        callCatchMethod(error, language)
      })
  }

  ////////////////////////////////////////////////

  useEffect(() => {
    if (commData?.length !== 0 && corporatorData?.length !== 0) {
      getAllCommitteMembersData()
    }
  }, [commData, corporatorData])

  useEffect(() => {
    getCommittees()
    getCorporators()
  }, [])

  // OnSubmit Form
  //////////////////////////////////////////////////////////////////////////

  let callingAxiosReq = (body1, body2) => {
    if (memberChange == false) {
      return axios.post(`${urls.MSURL}/mstDefineCommitteeMembers/save`, body1, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
    } else {
      return axios.post(`${urls.MSURL}/mstDefineCommitteeMembers/save`, body2, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
    }
  }
  //////////////////
  const onSubmitForm = (formData) => {
    const fromDate = moment(formData?.fromDate).format("YYYY-MM-DD")
    const fromDateMemberChange = moment(formData?.newFromDate).format(
      "YYYY-MM-DD"
    )

    const toDate = moment(formData?.toDate).format("YYYY-MM-DD")
    const toDateMemberChange = moment(formData?.newToDate).format("YYYY-MM-DD")

    const finalBodyForApi = {
      id: formData.id ? Number(formData.id) : null,
      committee: formData.committee ? Number(formData.committee) : null,
      corporatorNo: formData.corporatorNo
        ? Number(formData.corporatorNo)
        : null,
      nominatedAsChairperson: nominatedAsChairperson,
      fromDate,
      toDate,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    const finalBodyForApiMemberChange = {
      oldCorporatorId: formData.id ? Number(formData.id) : null,
      committee: formData.committee ? Number(formData.committee) : null,
      corporatorNo: formData.newCorporatorNo
        ? Number(formData.newCorporatorNo)
        : null,
      nominatedAsChairperson: nominatedAsChairperson,
      fromDate: fromDateMemberChange,
      toDate: toDateMemberChange,
      reasonForChange: formData.reasonForChange,
      reasonForChangeMr: formData.reasonForChangeMr,
      activeFlag: btnSaveText === "Update" ? formData.activeFlag : null,
    }

    setLoading(true)

    callingAxiosReq(finalBodyForApi, finalBodyForApiMemberChange)
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success")
          getAllCommitteMembersData()
          setButtonInputState(false)
          setIsOpenCollapse(false)
          setEditButtonInputState(false)
          ////////////////////////
          setMemberChange(false)
          setParamsDotRowData(null)
          //////////////////////////
          setLoading(false)
        }
      })
      .catch((error) => {
        // if (error.request.status === 500) {
        //   swal(error.response.data.message, {
        //     icon: "error",
        //   })
        //   getAllCommitteMembersData()
        //   setButtonInputState(false)
        //   ////////////////////////
        //   setMemberChange(false)
        //   setParamsDotRowData(null)
        //   //////////////////////////
        //   setLoading(false)
        // } else {
        //   swal("Something went wrong!", {
        //     icon: "error",
        //   })
        //   getAllCommitteMembersData()
        //   setButtonInputState(false)
        //   ////////////////////////
        //   setMemberChange(false)
        //   setParamsDotRowData(null)
        //   //////////////////////////
        //   setLoading(false)

        // }

        getAllCommitteMembersData()
        setButtonInputState(false)
        ////////////////////////
        setMemberChange(false)
        setParamsDotRowData(null)
        //////////////////////////
        setLoading(false)
        callCatchMethod(error, language)
        // console.log("error", error);
      })
  }

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    }

    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("520", body)
        if (willDelete === true) {
          setLoading(true)
          axios
            .post(`${urls.MSURL}/mstDefineCommitteeMembers/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Inactivated!", {
                  icon: "success",
                })
                getAllCommitteMembersData()
                setButtonInputState(false)
                setLoading(false)
              }
            })
            .catch((error) => {
              getAllCommitteMembersData()
              setButtonInputState(false)
              setLoading(false)
              callCatchMethod(error, language)
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setButtonInputState(false)
          setLoading(false)
        }
      })
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        // console.log("inn", willDelete);
        console.log("620", body)

        if (willDelete === true) {
          setLoading(true)
          axios
            .post(`${urls.MSURL}/mstDefineCommitteeMembers/save`, body, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              console.log("delet res", res)
              if (res.status == 200 || res.status == 201) {
                swal("Record is Successfully Activated!", {
                  icon: "success",
                })
                getAllCommitteMembersData()
                setButtonInputState(false)
                setLoading(false)
              }
            })
            .catch((error) => {
              getAllCommitteMembersData()
              setButtonInputState(false)
              setLoading(false)
              callCatchMethod(error, language)
            })
        } else if (willDelete == null) {
          swal("Record is Safe")
          setButtonInputState(false)
          setLoading(false)
        }
      })
    }
  }

  // Exit Button
  const exitButton = () => {
    reset({
      ...resetValuesExit,
    })
    setButtonInputState(false)
    setSlideChecked(false)
    setSlideChecked(false)
    setIsOpenCollapse(false)
    setEditButtonInputState(false)
    setNominatedAsChairperson(false)
    setMemberChange(false)
    setParamsDotRowData(null)
    setMemberChangeButton(false)
  }

  // cancell Button
  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    })
  }

  // Reset Values Cancell
  const resetValuesCancell = {
    committeeName: "",
    committeeNameMr: "",
    countOfCommitteeMembers: "",
  }

  // Reset Values Exit
  const resetValuesExit = {
    committeeName: "",
    committeeNameMr: "",
    countOfCommitteeMembers: "",
    id: null,
  }

  // ////////////////////////////////////
  const handleMemberChangeBtn = () => {
    // setMemberChange(!memberChange)
    if (paramsDotRowData !== null) {
      const finalBodyForApi = {
        ...paramsDotRowData,
        activeFlag: "N",
      }
      /////////////////////////////////////////
      sweetAlert({
        title: "Are You Sure?",
        text: "Do you really want to change the COMMITTEE MEMBER?",
        icon: "warning",
        buttons: ["No", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((yes) => {
        if (yes) {
          setLoading(true)
          axios
            .post(
              `${urls.MSURL}/mstDefineCommitteeMembers/save`,
              finalBodyForApi,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              }
            )
            .then((res) => {
              if (res?.status == 200 || res?.status == 201) {
                setMemberChange(true)
                setLoading(false)
              } else {
                setLoading(false)
                setMemberChange(false)
                setParamsDotRowData(null)
              }
            })
            .catch((error) => {
              // if (!error.status) {
              //   swal(
              //     "Oops! Something went wrong or it may be a Network issue",
              //     {
              //       icon: "error",
              //     }
              //   )
              //   setLoading(false)
              //   setMemberChange(false)
              //   setParamsDotRowData(null)
              // }

              setLoading(false)
              setMemberChange(false)
              setParamsDotRowData(null)
              callCatchMethod(error, language)
            })
        } else {
          setMemberChange(false)
        }
      })
    } else {
      sweetAlert({
        title: "OOPS!",
        text: "This is your new entry, you can use this only on the existing entries",
        icon: "warning",
        dangerMode: false,
        closeOnClickOutside: false,
      })
    }
  }

  const columns = [
    {
      field: "srNo",
      // headerName: "Sr.No",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "comitteeEn" : "comitteeMr",
      headerName: <FormattedLabel id="committeeName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: language == "en" ? "corporatorEn" : "corporatorMr",
      headerName: <FormattedLabel id="corporatorName" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "fromDateShow",
      headerName: <FormattedLabel id="fromDate" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "toDateShow",
      headerName: <FormattedLabel id="toDate" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "nominatedAsChairpersonShow",
      headerName: <FormattedLabel id="nominatedAsChairperson" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            {params?.row?.activeFlag === "Y" && (
              <IconButton
                disabled={editButtonInputState}
                onClick={() => {
                  setBtnSaveText("Update"),
                    setBtnSaveTextMr("अद्यतन"),
                    setID(params.row.id),
                    setIsOpenCollapse(true),
                    setSlideChecked(true)
                  setButtonInputState(true)
                  console.log("params.row: ", params.row)
                  reset(params.row)
                  setParamsDotRowData(params.row)
                  setNominatedAsChairperson(params.row.nominatedAsChairperson)
                  setMemberChangeButton(true)
                }}
              >
                {language == "en" ? (
                  <Tooltip title={`EDIT THIS RECORD`}>
                    <EditIcon style={{ color: "#556CD6" }} />
                  </Tooltip>
                ) : (
                  <Tooltip title={`हा रेकॉर्ड एडिट करा`}>
                    <EditIcon style={{ color: "#556CD6" }} />
                  </Tooltip>
                )}
              </IconButton>
            )}

            <IconButton
              disabled={editButtonInputState}
              onClick={() => {
                setBtnSaveText("Update"),
                  setBtnSaveTextMr("अद्यतन"),
                  setID(params.row.id),
                  setSlideChecked(true)
                setButtonInputState(true)

                console.log("params.row: ", params.row)
                reset(params.row)
              }}
            >
              {params.row.activeFlag == "Y" ? (
                language == "en" ? (
                  <Tooltip title={`DE-ACTIVATE THIS RECORD`}>
                    <ToggleOnIcon
                      style={{ color: "green", fontSize: 30 }}
                      onClick={() => deleteById(params.id, "N")}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={`हा रेकॉर्ड डी-एक्टिव्हेट करा`}>
                    <ToggleOnIcon
                      style={{ color: "green", fontSize: 30 }}
                      onClick={() => deleteById(params.id, "N")}
                    />
                  </Tooltip>
                )
              ) : language == "en" ? (
                <Tooltip title={`ACTIVATE THIS RECORD`}>
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              ) : (
                <Tooltip title={`हा रेकॉर्ड सक्रिय करा`}>
                  <ToggleOffIcon
                    style={{ color: "red", fontSize: 30 }}
                    onClick={() => deleteById(params.id, "Y")}
                  />
                </Tooltip>
              )}
            </IconButton>
          </div>
        )
      },
    },
  ]

  useEffect(() => {
    if (!watch("newFromDate")) {
      setValue("newToDate", "")
    }
  }, [watch("newFromDate")])

  useEffect(() => {
    if (watch("committee") && memberChange) {
      getCorporatorsMemberChange()
    }
  }, [watch("committee"), memberChange])

  // Row

  return (
    // <ThemeProvider theme={theme}>
    <div>
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
              <FormattedLabel id="defineCommitteeMembers" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <div>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {/* ////////////////////////////////////////First Line//////////////////////////////////////////// */}

                <Grid
                  container
                  spacing={2}
                  style={{
                    padding: "10px",
                    display: "flex",
                    // justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    <FormControlLabel
                      control={<Checkbox color="success" />}
                      label={<FormattedLabel id="nominatedAsChairperson" />}
                      checked={nominatedAsChairperson}
                      onChange={(e) => {
                        console.log(":1000", e.target.checked)
                        setNominatedAsChairperson(e.target.checked)
                      }}
                    />
                  </Grid>

                  {/* /////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    {loadingComm ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="selectCommittee" />
                          </InputLabel>
                          <Select
                            sx={{ minWidth: 300 }}
                            variant="standard"
                            multiple
                            fullWidth
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <FormControl error={!!errors.committee}>
                        <InputLabel>
                          <FormattedLabel id="selectCommittee" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              sx={{ width: 300 }}
                              disabled={memberChange}
                            >
                              {commData &&
                                commData?.map((value, index) => (
                                  <MenuItem key={index} value={value.id}>
                                    {language == "en"
                                      ? value.comitteeEn
                                      : value.comitteeMr}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="committee"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.committee ? errors.committee.message : null}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Grid>
                  {/* /////////////////////// */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                    }}
                  >
                    {loadingCommMembers ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        <FormControl>
                          <InputLabel>
                            <FormattedLabel id="selectCorporator" />
                          </InputLabel>
                          <Select
                            variant="standard"
                            multiple
                            fullWidth
                            sx={{ minWidth: 300 }}
                          ></Select>
                        </FormControl>
                        <CircularProgress size={15} color="error" />
                      </div>
                    ) : (
                      <FormControl error={!!errors.corporatorNo}>
                        <InputLabel>
                          <FormattedLabel id="selectCorporator" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              variant="standard"
                              fullWidth
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              sx={{ minWidth: 300 }}
                              disabled={memberChange}
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
                          name="corporatorNo"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.corporatorNo
                            ? errors.corporatorNo.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </Grid>

                  <Grid
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
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      error={!!errors.fromDate}
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
                              disabled={memberChange}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "300px" }}
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
                        {errors?.fromDate ? errors.fromDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid
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
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      error={!!errors.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="toDate" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => field.onChange(date)}
                              selected={field.value}
                              disabled={memberChange}
                              center
                              renderInput={(params) => (
                                <TextField
                                  sx={{ width: "300px" }}
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
                        {errors?.toDate ? errors.toDate.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* /////////////////////////////// */}
                  {memberChangeButton && (
                    <>
                      <Grid item xs={9}></Grid>
                      <Grid
                        item
                        xs={3}
                        sm={3}
                        md={3}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Paper
                          elevation={4}
                          style={{ margin: "30px", width: "auto" }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            endIcon={<ChangeCircleIcon />}
                            onClick={() => handleMemberChangeBtn()}
                          >
                            {<FormattedLabel id="memberChange" />}
                          </Button>
                        </Paper>
                      </Grid>
                    </>
                  )}

                  {/* ////////////  ELECTED DATE  //////////// */}
                  {memberChange && (
                    <>
                      {/* /////////////////////// */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        {loadingComm ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <FormControl>
                              <InputLabel>
                                <FormattedLabel id="selectCommittee" />
                              </InputLabel>
                              <Select
                                sx={{ minWidth: 300 }}
                                variant="standard"
                                multiple
                                fullWidth
                              ></Select>
                            </FormControl>
                            <CircularProgress size={15} color="error" />
                          </div>
                        ) : (
                          <FormControl error={!!errors.committee}>
                            <InputLabel>
                              <FormattedLabel id="selectCommittee" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  disabled
                                  autoFocus
                                  variant="standard"
                                  fullWidth
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  sx={{ width: 300 }}
                                >
                                  {commData &&
                                    commData?.map((value, index) => (
                                      <MenuItem key={index} value={value.id}>
                                        {language == "en"
                                          ? value.comitteeEn
                                          : value.comitteeMr}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                              name="committee"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.committee
                                ? errors.committee.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        )}
                      </Grid>
                      {/* /////////////////////// */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "baseline",
                        }}
                      >
                        {loadingCommMembers ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "baseline",
                            }}
                          >
                            <FormControl>
                              <InputLabel>
                                <FormattedLabel id="selectCorporator" />
                              </InputLabel>
                              <Select
                                variant="standard"
                                multiple
                                fullWidth
                                sx={{ minWidth: 300 }}
                              ></Select>
                            </FormControl>
                            <CircularProgress size={15} color="error" />
                          </div>
                        ) : (
                          <FormControl error={!!errors.newCorporatorNo}>
                            <InputLabel>
                              <FormattedLabel id="selectCorporator" />
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
                                  {corporatorForMemberChange &&
                                    corporatorForMemberChange
                                      ?.filter(
                                        (o) => o?.id !== watch("corporatorNo")
                                      )
                                      .map((corporator, index) => (
                                        <MenuItem
                                          key={index}
                                          value={corporator.id}
                                        >
                                          {language == "en"
                                            ? corporator.corporatorNameEn
                                            : corporator.corporatorNameMr}
                                        </MenuItem>
                                      ))}
                                </Select>
                              )}
                              name="newCorporatorNo"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.newCorporatorNo
                                ? errors.newCorporatorNo.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        )}
                      </Grid>
                      {/* /////////////////////// */}
                      <Grid
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
                        <FormControl
                          style={{ backgroundColor: "white" }}
                          error={!!errors.newFromDate}
                        >
                          <Controller
                            control={control}
                            name="newFromDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  // disableFuture
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
                                      sx={{ width: "300px" }}
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
                            {errors?.newFromDate
                              ? errors.newFromDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* /////////////////////// */}
                      <Grid
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
                        <FormControl
                          style={{ backgroundColor: "white" }}
                          error={!!errors.newToDate}
                        >
                          <Controller
                            control={control}
                            name="newToDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled={watch("newFromDate") ? false : true}
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="toDate" />
                                    </span>
                                  }
                                  value={field.value || null}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  minDate={watch("newFromDate")}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{ width: "300px" }}
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
                            {errors?.newToDate
                              ? errors.newToDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* ////////////  REASON ENGLISH //////////// */}
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
                          margin: "0% 3.5%",
                        }}
                      >
                        <Paper
                          elevation={1}
                          style={{ width: "100%", borderRadius: "10px" }}
                        >
                          <span style={{ fontSize: "16px" }}>
                            {<FormattedLabel id="reason" />}
                          </span>
                          <TextareaAutosize
                            style={{ overflow: "auto" }}
                            placeholder={
                              language == "en"
                                ? "Reason In English"
                                : "कारण इंग्लिश मधे"
                            }
                            className={styles.bigText}
                            {...register("reasonForChange")}
                          />
                          <FormHelperText>
                            <span style={{ color: "red" }}>
                              {errors?.reasonForChange
                                ? errors.reasonForChange.message
                                : null}
                            </span>
                          </FormHelperText>
                        </Paper>
                      </Grid>
                      {/* ////////////  REASON MARATHI //////////// */}
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
                          margin: "0% 3.5%",
                        }}
                      >
                        <Paper
                          elevation={1}
                          style={{ width: "100%", borderRadius: "10px" }}
                        >
                          <span style={{ fontSize: "16px" }}>
                            {<FormattedLabel id="reason" />}
                          </span>
                          <TextareaAutosize
                            style={{ overflow: "auto" }}
                            placeholder={
                              language == "en"
                                ? "Reason In Marathi"
                                : "कारण मराठी मधे"
                            }
                            className={styles.bigText}
                            {...register("reasonForChangeMr")}
                          />
                          <FormHelperText>
                            <span style={{ color: "red" }}>
                              {errors?.reasonForChangeMr
                                ? errors.reasonForChangeMr.message
                                : null}
                            </span>
                          </FormHelperText>
                        </Paper>
                      </Grid>
                    </>
                  )}
                </Grid>

                {/* ///////////////////////////////////////// */}

                <Grid
                  container
                  style={{
                    // padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Grid
                    item
                    xs={2}
                    sm={2}
                    md={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        disabled={
                          memberChange && !watch("newCorporatorNo")
                            ? true
                            : false
                        }
                        size="small"
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={<SaveIcon />}
                      >
                        {language === "en" ? btnSaveText : btnSaveTextMr}
                      </Button>
                    </Paper>
                  </Grid>

                  {/* <Grid
                    item
                    xs={2}
                    sm={2}
                    md={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        endIcon={<ClearIcon />}
                        onClick={() => cancellButton()}
                      >
                        {<FormattedLabel id="clear" />}
                      </Button>
                    </Paper>
                  </Grid> */}

                  <Grid
                    item
                    xs={2}
                    sm={2}
                    md={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Paper
                      elevation={4}
                      style={{ margin: "30px", width: "auto" }}
                    >
                      <Button
                        size="small"
                        disabled={memberChange}
                        variant="contained"
                        color="error"
                        endIcon={<ExitToAppIcon />}
                        onClick={() => exitButton()}
                      >
                        {<FormattedLabel id="exit" />}
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Slide>
        )}
        <Grid
          container
          style={{ padding: "10px" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={9}></Grid>
          {!loading && (
            <Grid
              item
              xs={2}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                disabled={buttonInputState}
                onClick={() => {
                  reset({
                    ...resetValuesExit,
                  })
                  setEditButtonInputState(true)
                  setBtnSaveText("Save")
                  setBtnSaveTextMr("जतन करा")
                  setButtonInputState(true)
                  setSlideChecked(true)
                  setIsOpenCollapse(!isOpenCollapse)
                  setMemberChangeButton(false)
                }}
              >
                {<FormattedLabel id="add" />}
              </Button>
            </Grid>
          )}
        </Grid>
        <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
          {loading ? (
            <Loader />
          ) : data.length !== 0 ? (
            <div style={{ width: "100%" }}>
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

                  // "& .MuiSvgIcon-root": {
                  //   color: "black", // change the color of the check mark here
                  // },
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
                // density="compact"
                autoHeight={true}
                pagination
                paginationMode="server"
                rowCount={data?.totalRows}
                rowsPerPageOptions={data?.rowsPerPageOptions}
                page={data?.page}
                pageSize={data?.pageSize}
                rows={data?.rows}
                columns={columns}
                onPageChange={(_data) => {
                  getAllCommitteMembersData(data?.pageSize, _data)
                }}
                onPageSizeChange={(_data) => {
                  console.log("222", _data)

                  getAllCommitteMembersData(_data, data?.page)
                }}
              />
            </div>
          ) : (
            ""
          )}
        </Box>

        {/* MODEL FOR ERROR SHOWING */}
        <Modal
          open={showErrorModel}
          sx={{
            padding: 5,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              width: "50%",
              background: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              border: "2px solid blue",
              borderRadius: 5,
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 3)",
            }}
          >
            {errorData?.map((obj, ind) => {
              return (
                <TextField
                  // disabled={true}
                  sx={{
                    width: "90%",
                    padding: "10px",
                    borderRadius: 2,
                    "& .MuiInput-input": {
                      color: "red", // Set the text color to red
                    },
                    marginTop: "5px",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  // label={<FormattedLabel id="" />}
                  label={`Error ${ind + 1}`}
                  variant="standard"
                  value={obj?.code}
                />
              )
            })}
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => {
                setShowErrorModel(false)
              }}
              sx={{ margin: "5px 0px 2px 0px" }}
            >
              {language == "en" ? "close" : "बंद करा"}
            </Button>
          </Box>
        </Modal>
      </Paper>
    </div>
    // {/* </ThemeProvider> */}
  )
}

export default Index
