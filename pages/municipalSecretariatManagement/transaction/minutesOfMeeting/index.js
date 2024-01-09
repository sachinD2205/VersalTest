import React, { useEffect, useState } from "react"
import router from "next/router"
import Head from "next/head"
import styles from "./minutesOfMeeting.module.css"

import URLs from "../../../../URLS/urls"
import axios from "axios"
import sweetAlert from "sweetalert"
// import moment from 'moment'
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
  Autocomplete,
  Grid,
  Box,
  ThemeProvider,
  Modal,
  CircularProgress,
  Typography,
} from "@mui/material"
import { ExitToApp, Save, Search } from "@mui/icons-material"
import { DataGrid } from "@mui/x-data-grid"
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useSelector } from "react-redux"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import AddIcon from "@mui/icons-material/Add"
import theme from "../../../../theme"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import JoditEditor from "../../../common/joditReact_Component/JoditReact"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util.js"
import DOMPurify from "dompurify"

const Index = () => {
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

  const [loading, setLoading] = useState(false)
  const [loadingOnSave, setLoadingOnSave] = useState(false)

  const [committeeName, setCommitteeName] = useState([])
  const [corporators, setCorporators] = useState([])

  const [cheapModal, setCheapModal] = useState(false)
  // const [docketDesc, setDocketDesc] = useState([
  //   /* {key:null,value:[]} */
  // ])
  const [docketDesc, setDocketDesc] = useState([])

  const [updateCommInPayload, setUpdateCommInPayload] = useState([])

  const [index, setIndex] = useState()
  const [docketSubDetails, setDocketSubDetails] = useState("")
  const [attendanceMethod, setAttendanceMethod] = useState("")
  const [committeeDataFromMain, setcommitteeDataFromMain] = useState([])
  const [dockets, setDockets] = useState([])
  // const [table, setTable] = useState([])
  const [attendanceData, setAttendanceData] = useState([])
  const [statusValue, setStatusValue] = useState("")

  const [showDocketModel, setShowDocketModel] = useState(false)
  const [showDocketSubDetailsModel, setShowDocketSubDetailsModel] =
    useState(false)

  //  VALIDATION FOR NONMANDATORY FIELDS
  const [verdictFiledChk, setVerdictFiledChk] = useState(true)
  const [momOutwardnoFiledChk, setMomOutwardnoFiledChk] = useState(true)

  // HYPERLINKS CHECKED
  const [messageToShowOnError, setMessageToShowOnError] = useState("")
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("")

  const userToken = useGetToken()

  //MOM Details
  let momSchema = yup.object().shape({
    // agendaNo: yup.string().required('Please enter an agenda no.'),
    // verdict: yup.string().required('Please enter an agenda no.'),
    proposer: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    seconder: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    president: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
    verdict: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),

    momOutwardno: yup
      .string()
      .nullable()
      .required(<FormattedLabel id="thisFieldIsrequired" />),
  })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(momSchema),
  })

  useEffect(() => {
    //Get Committee
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

    //Get Committess
    getcomittees1()

    //Get Corporators
    axios
      .get(`${URLs.MSURL}/mstDefineCorporators/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setCorporators(
            res?.data?.corporator?.map((j, i) => ({
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
        } else {
          setCorporators([])
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
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

  useEffect(() => {
    if (router.query.committeeId) {
      setLoading(true)
      //Get Agenda
      axios
        .get(
          `${URLs.MSURL}/trnNewDocketEntry/getDock?commId=${router.query.committeeId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            //setting dockets for final approval or onhold

            setDockets(
              res?.data?.map((obj, index) => ({
                ...obj,
                srNo: index + 1,
                id: obj.id,
                reference: obj.reference,
                subject: obj.subject,
                subjectSummary: obj.subjectSummary,
                subjectDetails: obj.subjectDetails,
                subjectSerialNumber: obj.subjectSerialNumber,
                subjectDate: obj.subjectDate,
                // description: obj.subjectSummary,
                commett: obj.commett,
                prapatra: obj.prapatra,
                outwardNumber: obj.outwardNumber,
                isDirectlyAdded: obj.isDirectlyAdded,
                suchak: 10000,
                anumodak: 10000,
                status: obj.status,
                statusMom: "Approve",
              }))
            )
            //setting commId
            setcommitteeDataFromMain(
              res?.data?.commet?.map((o) => {
                return {
                  id: o.id,
                  committeeId: o.committeeId,
                  docketId: o.docketId,
                  isAgendaPrepared: o.isAgendaPrepared,
                  priority: o.priority,
                }
              })
            )

            //setting attendanceMethod
            // setAttendanceMethod(
            //   res.data.prepareMeetingAgenda[0]
            //     .trnMarkAttendanceProceedingAndPublishDao[0]
            //     .attendanceCaptureFrom
            // )

            // reset({
            //   subject: res.data.prepareMeetingAgenda[0].agendaSubject,
            //   subjectSummary:
            //     res.data.prepareMeetingAgenda[0].agendaDescription,
            // })
            setLoading(false)
          } else {
            setLoading(false)
            sweetAlert({
              title: "OOPS!",
              text: "No Agenda found with that id",
              icon: "warning",
              buttons: {
                confirm: {
                  text: "OK",
                  visible: true,
                  closeModal: true,
                },
              },
            })
          }
        })
        .catch((error) => {
          // console.log("error: ", error)
          setLoading(false)
          callCatchMethod(error, language)
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
    }
  }, [router.query.committeeId])

  // CONCERNED COMMITTEE MEMBERS
  const [data, setData] = useState([])
  // Get Table - Data
  const getAllAttendance = () => {
    setLoading(true)
    axios
      .get(
        `${URLs.MSURL}/mstDefineCommitteeMembers/getByCommitteeId?comId=${router.query.committeeId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log(";res", res)
        if (res?.status === 200 || res?.status === 201) {
          let result = res.data
          let _res = result?.map((val, i) => {
            console.log("44")
            return {
              activeFlag: val.activeFlag,
              id: val.id,
              srNo: i + 1,
              corporatorNo: val.corporatorNo,
              fullNameEn: corporators?.find((o) => o.id == val.corporatorNo)
                ?.fullNameEn,
              fullNameMr: corporators?.find((o) => o.id == val.corporatorNo)
                ?.fullNameMr,
            }
          })
          setData(_res)
          setLoading(false)
        } else {
          setData([])
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
        //     dangerMode: false,
        //     closeOnClickOutside: false,
        //   })
        //   setLoading(false)
        // } else {
        //   sweetAlert(error)
        //   setLoading(false)
        // }
        callCatchMethod(error, language)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (corporators?.length !== 0) {
      getAllAttendance()
    }
  }, [corporators])

  useEffect(() => {
    if (router.query.agendaNo && router.query.committeeId) {
      setValue("agendaNo", router.query.agendaNo)

      // ///////////////
      getAttendanceOfCorp()
    }
  }, [router?.query?.agendaNo, router?.query?.committeeId])
  useEffect(() => {
    if (router.query.committeName && router.query.committeNameMr) {
      if (language == "en") {
        setValue("committeName", router.query.committeName)
      } else {
        setValue("committeName", router.query.committeNameMr)
      }
    }
  }, [router?.query, language])

  const [comittees1, setcomittees1] = useState([])

  const getcomittees1 = () => {
    // setLoading(true)
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
          // setLoading(false)
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
        callCatchMethod(error, language)
        setLoading(false)
      })
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
      field: "subjectSerialNumber",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectSerialNumber" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",
      field: "subject",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",
      field: "subjectSummary",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectSummary" />,
      width: 220,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="contained"
              onClick={() => {
                setIndex(params.row.srNo - 1)

                // setDockets([
                //   // ...(docketDesc && docketDesc),
                //   ...(dockets &&
                //     dockets?.filter((ff) => ff.key != params.row.srNo - 1)),
                //   {
                //     key: params.row.srNo - 1,
                //     value: dockets.find((ff) => ff.key == params.row.srNo - 1)
                //       ?.value
                //       ? dockets.find((ff) => ff.key == params.row.srNo - 1)
                //           ?.value
                //       : dockets[params.row.srNo - 1]["subjectSummary"],
                //   },
                // ])
                setDocketDesc([
                  // ...(docketDesc && docketDesc),
                  ...(docketDesc &&
                    docketDesc.filter((ff) => ff.key != params.row.srNo - 1)),
                  {
                    key: params.row.srNo - 1,
                    value: docketDesc.find(
                      (ff) => ff.key == params.row.srNo - 1
                    )?.value
                      ? docketDesc.find((ff) => ff.key == params.row.srNo - 1)
                          ?.value
                      : dockets[params.row.srNo - 1]["subjectSummary"],
                  },
                ])
                setShowDocketModel(true)
              }}
              size="small"
            >
              <FormattedLabel id="preview_Edit" />
            </Button>
          </>
        )
      },
    },
    {
      headerClassName: "cellColor",
      field: "subjectDetails",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectDetails" />,
      width: 180,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="contained"
              onClick={() => {
                setDocketSubDetails(
                  dockets[params.row.srNo - 1]["subjectDetails"]
                )
                setShowDocketSubDetailsModel(true)
              }}
              size="small"
            >
              <FormattedLabel id="preview" />
            </Button>
          </>
        )
      },
    },
    {
      headerClassName: "cellColor",
      field: "suchak",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="nameOfSuchak" />,
      width: 350,
      renderCell: (params) => {
        return (
          <>
            <Select
              variant="standard"
              sx={{
                width: 350,
                textAlign: "center",
                margin: "20px",
              }}
              defaultValue={dockets[params.row.srNo - 1]["suchak"]}
              onChange={(event) => {
                dockets[params.row.srNo - 1]["suchak"] = event.target.value
              }}
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
            {/* ///////////////////////////////////// */}
          </>
        )
      },
    },
    {
      headerClassName: "cellColor",
      field: "anumodak",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="nameOfAnumodak" />,
      width: 350,
      renderCell: (params) => {
        return (
          <>
            <Select
              variant="standard"
              sx={{
                width: 350,
                textAlign: "center",
                margin: "20px",
              }}
              defaultValue={dockets[params.row.srNo - 1]["anumodak"]}
              onChange={(event) => {
                dockets[params.row.srNo - 1]["anumodak"] = event.target.value
              }}
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
          </>
        )
      },
    },
    {
      headerClassName: "cellColor",
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 520,
      renderCell: (params) => {
        const handleActionChange = (event) => {
          const selectedAction = event.target.value

          dockets[params.row.srNo - 1]["statusMom"] = event.target.value

          setStatusValue(event.target.value)

          if (selectedAction === "Forward") {
          } else {
            let filterdVal = updateCommInPayload?.filter((o) => {
              return o.key !== params?.row.srNo - 1
            })
            setUpdateCommInPayload(filterdVal)
          }
        }

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 20,
            }}
          >
            <Select
              variant="standard"
              label="Select Action"
              defaultValue={dockets[params.row.srNo - 1]["statusMom"]}
              // defaultValue={"Approve"}
              sx={{
                width: 190,
                textAlign: "center",
                margin: "20px",
              }}
              onChange={handleActionChange}
            >
              <MenuItem value={"Approve"} style={{ color: "green" }}>
                {language === "en" ? "Approve" : "मंजूर करा"}
              </MenuItem>
              <MenuItem value={"Reject"} style={{ color: "red" }}>
                {language === "en"
                  ? "Reject/Daftari Dakhal"
                  : "नामंजुर/दप्तरी दाखल"}
              </MenuItem>
              {/* <MenuItem value={"Tahakub "}>
                {language === "en" ? "Tahakub " : "तहकुब"}
              </MenuItem> */}
              <MenuItem value={"Forward"} style={{ color: "orange" }}>
                {language === "en" ? "Forward" : "फॉरवर्ड करा"}
              </MenuItem>
              <MenuItem value={"ON_HOLD"}>
                {language === "en" ? "On Hold" : "होल्ड वर ठेवा"}
              </MenuItem>
            </Select>

            {dockets[params.row.srNo - 1]["statusMom"] == "Forward" && (
              <Select
                variant="standard"
                sx={{
                  width: 290,
                  textAlign: "center",
                }}
                defaultValue={dockets[params.row.srNo - 1]["committeID"]}
                onChange={(event) => {
                  console.log(":200a", event.target.value)

                  dockets[params.row.srNo - 1]["committeID"] =
                    event.target.value

                  setUpdateCommInPayload([
                    ...(updateCommInPayload &&
                      updateCommInPayload.filter(
                        (rr) => rr.key != params.row.srNo - 1
                      )),
                    {
                      docId: params.row.id,
                      name: params.row.status,
                      key: params.row.srNo - 1,
                      value: event.target.value,
                    },
                  ])
                }}
              >
                {comittees1
                  ?.filter(
                    (comittee) =>
                      params?.row?.commett?.find(
                        (x) => x.committeeId == comittee.id
                      )?.committeeId != comittee.id
                  )
                  ?.map((comittee, index) => {
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
          </div>
        )
      },
    },
  ]

  const submit = (data) => {
    const {
      attendanceCapturedFrom,
      committeeId,
      subject,
      subjectSummary,
      ...rest
    } = data

    let updateDocket = []
    dockets.forEach((obj, ind) => {
      updateDocket.push({
        ...obj,
        id: updateCommInPayload?.find((uu) => uu.key == ind)?.docId
          ? updateCommInPayload?.find((uu) => uu.key == ind)?.docId
          : obj.id,
        activeFlag: "Y",
        // status: "FREEZED",
        // isFromMom: true,
        subjectSummary: docketDesc.find((uu) => uu.key == ind)?.value
          ? docketDesc.find((uu) => uu.key == ind)?.value
          : obj.subjectSummary,
        commett: [
          ...obj.commett,
          {
            docketId: Number(
              updateCommInPayload?.find((uu) => uu.key == ind)?.docId
            ),
            committeeId: Number(
              updateCommInPayload?.find((uu) => uu.key == ind)?.value
            ),
          },
        ],
      })
    })

    let agendaNo = router?.query?.agendaNo

    let payloadOutSide = {
      agendaNo,
      committeeId: router?.query?.committeeId
        ? Number(router?.query?.committeeId)
        : null,
      proposer: watch("proposer") ? Number(watch("proposer")) : null,
      seconder: watch("seconder") ? Number(watch("seconder")) : null,
      president: watch("president") ? Number(watch("president")) : null,
      verdict: watch("verdict"),
      momOutwardno: watch("momOutwardno"),
    }

    let finalDockets = dockets.map((obj, ind) => ({
      docketId: obj.id,
      status: obj.statusMom,
      suchak: obj.suchak,
      anumodak: obj.anumodak,
      ///////////////////// NEWLY ADDED ///////////////////
      reference: obj.reference,
      subject: obj.subject,
      subjectSummary: docketDesc.find((uu) => uu.key == ind)?.value
        ? docketDesc.find((uu) => uu.key == ind)?.value
        : obj.subjectSummary,
      subjectDetails: obj.subjectDetails,
      subjectDate: obj.subjectDate,
      departmentId: obj.departmentId,
      // /////////////////////////////
      forwardToComm: updateCommInPayload?.find((uu) => uu.key == ind)?.value,
      // /////////////////////////////
      prapatra: obj.prapatra,
      outwardNumber: obj.outwardNumber,
      isDirectlyAdded: obj.isDirectlyAdded,
    }))

    const bodyForAPI = {
      ...payloadOutSide,
      attendance: attendanceData.length !== 0 ? attendanceData : [],
      momAgendaSubjectDao: finalDockets,
      docketDao: updateDocket,
    }

    console.log(":100Dbc", bodyForAPI)

    // //////////////////// trnMom //////////////////////
    if (momOutwardnoFiledChk && verdictFiledChk) {
      sweetAlert({
        title: "Are you sure?",
        text: "",
        icon: "warning",
        buttons: ["Cancel", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      }).then((will) => {
        if (will) {
          setLoadingOnSave(true)
          axios
            .post(`${URLs.MSURL}/trnMom/save`, bodyForAPI, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((res) => {
              if (res.status === 200 || res.status === 201) {
                setLoadingOnSave(false)
                sweetAlert({
                  title: "Success",
                  text: `Success!", "MOM Generated Successfully!`,
                  icon: "success",
                  closeOnClickOutside: false,
                  dangerMode: false,
                }).then((ok) => {
                  if (ok) {
                    router.push(
                      `/municipalSecretariatManagement/transaction/calender`
                    )
                  }
                })
              }
            })
            .catch((error) => {
              // if (!error.status) {
              //   console.log(":100", error)
              //   sweetAlert({
              //     title: "ERROR",
              //     text: error.toString(),
              //     icon: "error",
              //     dangerMode: false,
              //     closeOnClickOutside: false,
              //   })
              //   setLoadingOnSave(false)
              // } else {
              //   sweetAlert(error)
              //   setLoadingOnSave(false)
              // }
              callCatchMethod(error, language)
              setLoadingOnSave(false)
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

  ///////////////////////////////////////
  const getAttendanceOfCorp = () => {
    setLoading(true)
    axios
      .get(
        `${URLs.MSURL}/trnMarkAttendanceProceedingAndPublish/getForMom?agendaNo=${router.query.agendaNo}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        console.log(":log", res)
        if (res?.status === 200 || res?.status === 201) {
          setAttendanceData(
            res?.data[0]?.committeeMembersAttendance
              ?.filter((fill) => fill.action == "present")
              ?.map((r, i) => ({
                listOfConcernCommitteeMembers: r.listOfConcernCommitteeMembers,
                action: r.action,
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
        //   console.log(":check2 : ", error)
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
        callCatchMethod(error, language)
      })
  }

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

    checkField("verdict", setVerdictFiledChk)
    checkField("momOutwardno", setMomOutwardnoFiledChk)
  }, [watch("verdict"), watch("momOutwardno")])

  return (
    <ThemeProvider theme={theme}>
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
                <FormattedLabel id="MOM" />
              </strong>
            </Box>
          </Box>
          {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
          {loadingOnSave ? (
            <Loader />
          ) : (
            <form style={{ padding: "1.5%" }} onSubmit={handleSubmit(submit)}>
              <div
                // className={styles.row}
                // style={{
                //   justifyContent:
                //     commId && attendanceMethod ? "space-between" : "center",
                // }}

                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "baseline",
                }}
              >
                {/* <div className={styles.alignContainer}> */}
                <TextField
                  disabled={router?.query?.agendaNo ? true : false}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="agendaNo" />}
                  variant="standard"
                  {...register("agendaNo")}
                  // defaultValue={router?.query?.agendaNo ?? ""}
                  InputLabelProps={{ shrink: watch("agendaNo") ? true : false }}
                />
                {/* //////////////////////////// */}
                <TextField
                  disabled={router?.query?.committeName ? true : false}
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="committeeName" />}
                  variant="standard"
                  {...register("committeName")}
                  InputLabelProps={{
                    shrink: watch("committeName") ? true : false,
                  }}
                />
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
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Box
                    className={styles.details}
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                      width: "100%",
                      height: "auto",
                      overflow: "auto",
                      padding: "0.2% 0% 0.2% 2%",
                      color: "white",
                      fontSize: 15,
                      fontWeight: 350,
                      borderRadius: 100,
                      letterSpacing: "2px",
                    }}
                  >
                    <strong>
                      <FormattedLabel id="attendees" /> :
                    </strong>
                  </Box>
                </Grid>

                {attendanceData?.length !== 0 &&
                  attendanceData?.map((obj, index) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                        }}
                      >
                        <span>
                          {index + 1} {"\u00A0"}:{"\u00A0"}
                          {"\u00A0"}
                          {"\u00A0"}
                        </span>

                        <TextField
                          disabled
                          sx={{ width: "300px" }}
                          variant="standard"
                          value={
                            language == "en"
                              ? corporators?.find(
                                  (o) =>
                                    o.id == obj.listOfConcernCommitteeMembers
                                  // (o) => o.id == obj.id
                                )?.fullNameEn
                              : corporators?.find(
                                  (o) =>
                                    o.id == obj.listOfConcernCommitteeMembers
                                  // (o) => o.id == obj.id
                                )?.fullNameMr
                          }
                          {...register("corporatorName")}
                        />
                      </Grid>
                    )
                  })}

                {/* ///////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Box
                    className={styles.details}
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                      width: "100%",
                      height: "auto",
                      overflow: "auto",
                      padding: "0.1% 0% 0.1% 2%",
                      color: "white",
                      fontSize: 15,
                      fontWeight: 350,
                      borderRadius: 100,
                      letterSpacing: "2px",
                    }}
                  >
                    <strong>
                      <FormattedLabel id="AddAdditionalDocketSection" /> :
                    </strong>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={9}
                  sm={9}
                  md={9}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Typography style={{ color: "red" }}>
                    {language == "en" ? "*NOTE" : "*नोट"} :{" "}
                    {language == "en"
                      ? "If You Want To Add Any Additional Docket, please Add It Before Filling MOM Data."
                      : "तुम्हाला कोणतेही अतिरिक्त डॉकेट जोडायचे असल्यास, कृपया ठरावाचा डेटा भरण्यापूर्वी ते जोडा."}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Button
                    variant="contained"
                    type="button"
                    endIcon={<AddIcon />}
                    onClick={() => {
                      router.push({
                        pathname: `/municipalSecretariatManagement/transaction/newDocketEntry/additionalDocket`,
                        query: {
                          agendaNo: router?.query?.agendaNo,
                          committeeId: router?.query?.committeeId,
                          committeName: router?.query?.committeName,
                          committeNameMr: router?.query?.committeNameMr,
                        },
                      })
                    }}
                    size="small"
                  >
                    <FormattedLabel id="additionalDocket" />
                  </Button>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <Box
                    className={styles.details}
                    sx={{
                      display: "flex",
                      justifyContent: "left",
                      alignItems: "center",
                      width: "100%",
                      height: "auto",
                      overflow: "auto",
                      padding: "0.1% 0% 0.1% 2%",
                      color: "white",
                      fontSize: 15,
                      fontWeight: 350,
                      borderRadius: 100,
                      letterSpacing: "2px",
                    }}
                  >
                    <strong>
                      <FormattedLabel id="editableSection" /> :
                    </strong>
                  </Box>
                </Grid>
              </Grid>

              {/* <TextareaAutosize
                color="neutral"
                minRows={1}
                maxRows={3}
                placeholder="Subject"
                className={styles.bigText}
                {...register("subject")}
              />
              <TextareaAutosize
                color="neutral"
                minRows={6}
                maxRows={3}
                placeholder="Subject Summary"
                className={styles.bigText}
                {...register("subjectSummary")}
              /> */}

              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                {/* ////////////////////////////////////////////////////////////////// */}
                <FormControl
                  style={{
                    minWidth: "230px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                  error={!!error.proposer}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="nameOfSuchak" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        fullWidth
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                        }}
                        label="Name of Proposer"
                      >
                        {data &&
                          data?.map((value, index) => (
                            <MenuItem key={index} value={value.corporatorNo}>
                              {language == "en"
                                ? value.fullNameEn
                                : value?.fullNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="proposer"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {error?.proposer ? error.proposer.message : null}
                  </FormHelperText>
                </FormControl>
                {/* ////////////////////////////////////////////////////////////////// */}

                <FormControl
                  style={{
                    minWidth: "230px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                  error={!!error.seconder}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="nameOfAnumodak" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        fullWidth
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                        }}
                        label="Name of Seconder"
                      >
                        {data &&
                          data?.map((value, index) => (
                            <MenuItem key={index} value={value.corporatorNo}>
                              {language == "en"
                                ? value.fullNameEn
                                : value?.fullNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="seconder"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {error?.seconder ? error.seconder.message : null}
                  </FormHelperText>
                </FormControl>
                {/* ////////////////////////////////////////////////////////////////// */}

                <FormControl
                  style={{
                    minWidth: "230px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                  error={!!error.president}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="nameOfPresident" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        fullWidth
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value)
                        }}
                        label="Name of President"
                      >
                        {data &&
                          data?.map((value, index) => (
                            <MenuItem key={index} value={value.corporatorNo}>
                              {language == "en"
                                ? value.fullNameEn
                                : value?.fullNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="president"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {error?.president ? error.president.message : null}
                  </FormHelperText>
                </FormControl>
                {/* ////////////////////////////////////////////////////////////////// */}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TextareaAutosize
                  color="neutral"
                  disabled={false}
                  minRows={1}
                  maxRows={15}
                  placeholder={
                    language == "en"
                      ? "Add Proceeding/Verdict"
                      : "ठरावाचा निर्णय लिहा "
                  }
                  className={styles.bigText}
                  {...register("verdict")}
                  error={!!error.verdict}
                />
                <FormHelperText
                  style={{
                    color: "#BD2A0D",
                    width: "100%",
                  }}
                >
                  {error?.verdict ? error.verdict.message : null}
                  {!verdictFiledChk ? error1Messsage() : ""}
                </FormHelperText>
              </div>
              {/* ///////////////// */}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <TextField
                  sx={{ width: "250px" }}
                  label={<FormattedLabel id="outwardNo" />}
                  variant="standard"
                  {...register("momOutwardno")}
                  placeholder={
                    language == "en"
                      ? "Please Provide Outward No."
                      : "कृपया जावक क्रमांक प्रदान करा"
                  }
                  error={!!error.momOutwardno}
                  helperText={
                    error?.momOutwardno ? error.momOutwardno.message : null
                  }
                />
                <FormHelperText
                  style={{
                    color: "#BD2A0D",
                    width: "100%",
                  }}
                >
                  {!momOutwardnoFiledChk ? error1Messsage() : ""}
                </FormHelperText>
              </div>

              {/* ////////////////////////////////// REMOVING THESE FUNCTIONALITY BEACAUSE IN THE COMMISIONER DEMO THEY DONT WANT THIS >>>>>ANWAR ANSARI /////////////////////////////////// */}
              {/* <div className={styles.alignContainer} style={{ marginTop: "20px" }}>
            <span className={styles.checkBoxLabel}>{<FormattedLabel id="onHoldSubjects" />}</span>
            <Checkbox
              onChange={() => {
                setOnHoldSubjects(!onHoldSubjects);
              }}
            />
          </div> */}
              {/* {onHoldSubjects && (
            <DataGrid
              autoHeight
              sx={{
                marginTop: "5vh",
                marginBottom: "3vh",

                "& .cellColor": {
                  backgroundColor: "#1976d2",
                  color: "white",
                },
              }}
              rows={dockets}
              //@ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          )} */}

              {/* //////////////////////////// DIRECT /////////////////////////// */}
              {loading ? (
                <Loader />
              ) : (
                <DataGrid
                  autoHeight
                  sx={{
                    marginTop: "5vh",
                    marginBottom: "3vh",

                    "& .cellColor": {
                      backgroundColor: "#556cd6",
                      color: "white",
                    },
                  }}
                  rows={dockets}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                />
              )}

              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  endIcon={<Save />}
                  size="small"
                >
                  <FormattedLabel id="save" />
                </Button>
                <Button
                  // disabled={corporators ? false : true}
                  color="error"
                  variant="contained"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    router.back()
                  }}
                  size="small"
                >
                  <FormattedLabel id="back" />
                </Button>
              </div>
              {/* ///////////////////////////////// */}
            </form>
          )}

          <>
            <Modal
              open={showDocketModel}
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
                  bgcolor: "background.paper",
                  width: "80%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  border: "2px solid black",
                  borderRadius: 5,
                  marginBottom: "10px",
                  height: "70%",
                }}
              >
                <form
                  style={{
                    height: "100%",
                    overflowX: "hidden",
                    width: "100%", // Added width property to the form
                    margin: 5,
                    padding: "5px 15px 10px 15px",
                  }}
                >
                  {/* <TextareaAutosize
                    className={styles.bigText}
                    sx={{ width: "100%" }}
                    placeholder="Subject Summary"
                    // value={docketDesc[index]?.value}
                    value={docketDesc?.find((fff) => fff.key === index)?.value}
                    onChange={(e) => {
                      setDocketDesc([
                        ...(docketDesc &&
                          docketDesc.filter((ff) => ff.key !== index)),
                        { key: index, value: e.target.value },
                      ])
                    }}
                    color="neutral"
                    minRows={5}
                    maxRows={8}
                  /> */}
                  <JoditEditor
                    // ref={refToRTE}
                    value={docketDesc?.find((fff) => fff.key === index)?.value}
                    onBlur={(newCont) =>
                      setDocketDesc([
                        ...(docketDesc &&
                          docketDesc.filter((ff) => ff.key !== index)),
                        { key: index, value: newCont },
                      ])
                    }
                  />
                </form>

                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => setShowDocketModel(false)}
                  sx={{ marginBottom: "10px" }}
                >
                  {language == "en" ? "save and close" : "जतन आणि बंद करा"}
                </Button>
              </Box>
            </Modal>
          </>
          {/* /////////////////////// MODAL FOR SUBJECT DETAILS /////////////////////// */}
          <>
            <Modal
              open={showDocketSubDetailsModel}
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
                  width: "80%",
                  bgcolor: "background.paper",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  border: "2px solid black",
                  borderRadius: 5,
                  marginBottom: "20px",
                  maxHeight: "70%",
                }}
              >
                <form
                  style={{
                    height: "100%",
                    overflowX: "hidden",
                    width: "100%", // Added width property to the form
                    margin: 5,
                    padding: "5px 15px 10px 15px",
                  }}
                >
                  {/* <TextareaAutosize
                    className={styles.bigText}
                    disabled
                    sx={{ width: "100%" }}
                    placeholder="Subject Details"
                    value={docketSubDetails}
                    color="neutral"
                    minRows={5}
                    maxRows={8}
                  /> */}
                  <JoditEditor
                    value={docketSubDetails}
                    config={{
                      readonly: true,
                    }}
                  />
                </form>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => setShowDocketSubDetailsModel(false)}
                  sx={{ marginBottom: "20px" }}
                >
                  {language == "en" ? "close" : "बंद करा"}
                </Button>
              </Box>
            </Modal>
          </>
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default Index
