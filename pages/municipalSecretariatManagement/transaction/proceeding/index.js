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
import { catchExceptionHandlingMethod } from "../../../../util/util"

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

  const [committeeName, setCommitteeName] = useState([])
  const [corporators, setCorporators] = useState([])
  const [onHoldSubjects, setOnHoldSubjects] = useState(false)
  const [cheapModal, setCheapModal] = useState(false)
  const [docketDesc, setDocketDesc] = useState("")
  const [attendanceMethod, setAttendanceMethod] = useState("")
  const [commId, setCommId] = useState()
  const [dockets, setDockets] = useState([
    {
      srNo: 1,
      id: 1,
      subjectSerialNumber: "",
      reference: "",
      subject: "",
      subjectSummary: "",
      description: "",
      status: "",
      suchak: 1,
      anumodak: 1,
    },
  ])
  // const [table, setTable] = useState([])

  //MOM Details
  let momSchema = yup.object().shape({
    // agendaNo: yup.string().required('Please enter an agenda no.'),
    // verdict: yup.string().required('Please enter an agenda no.'),
  })

  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    reset,
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
      .get(`${URLs.MSURL}/mstDefineCommittees/getAllForDropDown`)
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

    //Get Corporators
    axios
      .get(`${URLs.MSURL}/mstDefineCorporators/getAll`)
      .then((res) => {
        setCorporators(
          res.data.corporator.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            fullNameEn: j.firstName + " " + j.middleName + " " + j.lastName,
            fullNameMr:
              j.firstNameMr + " " + j.middleNameMr + " " + j.lastNameMr,
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

  useEffect(() => {
    if (router.query.agendaNo) {
      //Get Agenda
      axios
        .get(
          `${URLs.MSURL}/trnPrepareMeetingAgenda/getByAgendaNo?agendaNo=${router.query.agendaNo}`
        )
        .then((res) => {
          if (res.data.prepareMeetingAgenda.length <= 0) {
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
          } else {
            console.log(res.data)

            //setting dockets for final approval or onhold
            setDockets(
              res.data.prepareMeetingAgenda[0].trnNewDocketEntryDao
                ?.filter((obj) => {
                  return obj?.isAgendaPrepared === true
                })
                .filter((obj) => {
                  return obj?.status === "FREEZED"
                })
                .map((obj, index) => ({
                  srNo: index + 1,
                  id: obj.id,
                  reference: obj.reference,
                  subject: obj.subject,
                  subjectSummary: obj.subjectSummary,
                  subjectSerialNumber: obj.subjectSerialNumber,
                  description: obj.subjectSummary,
                  // status: "APPROVE",
                  status: "ONHOLD",
                }))
            )

            //setting commId
            setCommId(res.data.prepareMeetingAgenda[0].committeeId)

            //setting attendanceMethod
            setAttendanceMethod(
              res.data.prepareMeetingAgenda[0]
                .trnMarkAttendanceProceedingAndPublishDao[0]
                .attendanceCaptureFrom
            )

            reset({
              subject: res.data.prepareMeetingAgenda[0].agendaSubject,
              subjectSummary:
                res.data.prepareMeetingAgenda[0].agendaDescription,
            })
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
    }
  }, [])

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
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectSerialNumber" />,
      width: 180,
    },
    {
      headerClassName: "cellColor",

      field: "subject",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",

      field: "description",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="description" />,
      width: 180,
      renderCell: (params) => {
        return (
          <>
            <Button
              variant="contained"
              onClick={() => {
                setDocketDesc(dockets[params.row.srNo - 1]["description"])
                setCheapModal(!cheapModal)
              }}
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
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Select
              variant="standard"
              // @ts-ignore
              // defaultValue={corporators[0]?.id}
              sx={{
                width: 200,
                textAlign: "center",
              }}
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

      ////////////////////////////
      // renderCell: (params) => {
      //   const [value, setValue] = useState("");

      //   const handleAutocompleteChange = (event, newValue) => {
      //     const data = { ...params.row, city: newValue.label };
      //     params.api.updateRowData({ update: [data] });
      //   };

      //   return (
      //     <Autocomplete
      //       options={corporators ? corporators : []}
      //       getOptionLabel={(option) => (language == "en" ? option.fullNameEn : option?.fullNameMr)}
      //       value={{ label: value }}
      //       onChange={handleAutocompleteChange}
      //       renderInput={(params) => <TextField {...params} />}
      //     />
      //   );
      // },
    },
    {
      headerClassName: "cellColor",

      field: "anumodak",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="nameOfAnumodak" />,
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <Select
              variant="standard"
              // @ts-ignore
              // defaultValue={corporators[0]?.id}
              sx={{
                width: 200,
                textAlign: "center",
              }}
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
      width: 250,
      renderCell: (params) => {
        return (
          <>
            {console.log(":params", params)}
            <Select
              variant="standard"
              // defaultValue={dockets[params.row.srNo - 1]["status"]}
              defaultValue={"Select Action"}
              sx={{
                width: 200,
                textAlign: "center",
              }}
              onChange={(event) => {
                // @ts-ignore
                dockets[params.row.srNo - 1]["status"] = event.target.value
              }}
            >
              <MenuItem key={3} value={"APPROVE"}>
                {language === "en" ? "Action Approved" : "क्रिया मंजूर"}
              </MenuItem>
              <MenuItem key={2} value={"ONHOLD"}>
                {language === "en" ? "On Hold" : "होल्ड"}
              </MenuItem>
            </Select>
          </>
        )
      },
    },
  ]

  const getAgenda = () => {
    const agendaNo = watch("agendaNo")

    //Get Agenda
    axios
      .get(
        `${URLs.MSURL}/trnPrepareMeetingAgenda/getByAgendaNoAgendaNoDocket?agendaNo=${agendaNo}`
      )
      .then((res) => {
        if (res.data.prepareMeetingAgenda.length <= 0) {
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
        } else {
          //setting dockets for final approval or onhold
          setDockets(
            res.data.prepareMeetingAgenda[0].trnNewDocketEntryDao
              ?.filter((obj) => {
                return obj?.isAgendaPrepared === true
              })
              .filter((obj) => {
                return obj?.status === "FREEZED"
              })
              .map((obj, index) => ({
                srNo: index + 1,
                id: obj.id,
                reference: obj.reference,
                subject: obj.subject,
                subjectSummary: obj.subjectSummary,
                subjectSerialNumber: obj.subjectSerialNumber,
                description: obj.subjectSummary,
                status: "ONHOLD",
                // status: "APPROVED",
              }))
          )

          //setting commId
          setCommId(res.data.prepareMeetingAgenda[0].committeeId)

          //setting attendanceMethod
          setAttendanceMethod(
            res.data.prepareMeetingAgenda[0]
              .trnMarkAttendanceProceedingAndPublishDao[0].attendanceCaptureFrom
          )

          reset({
            subject: res.data.prepareMeetingAgenda[0].agendaSubject,
            subjectSummary: res.data.prepareMeetingAgenda[0].agendaDescription,
          })
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
      })
  }

  const submit = (data) => {
    const {
      attendanceCapturedFrom,
      committeeId,
      subject,
      subjectSummary,
      ...rest
    } = data

    let agendaNo = router?.query?.agendaNo

    let finalDockets = dockets.map((obj) => ({
      docketid: obj.id,
      status: obj.status,
      shuchak: obj.suchak,
      anumodan: obj.anumodak,
      /////////////////////NEWLY ADDED///////////////////
      reference: obj.reference,
      subject: obj.subject,
      subjectSummary: obj.subjectSummary,
    }))

    const bodyForAPI = { ...rest, agendaNo, momAgendaSubjectDao: finalDockets }

    axios
      .post(`${URLs.MSURL}/trnMom/save`, bodyForAPI)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          sweetAlert(
            "Success!",
            "Proceeding done successfully!",
            "success"
          ).then((ok) => {
            if (ok) {
              router.push(
                `/municipalSecretariatManagement/transaction/calender`
              )
            }
          })
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
      })
  }

  return (
    <>
      <Head>
        {/* <title>Minutes of Meeting</title> */}
        <title>
          <FormattedLabel id="proceeding" />
        </title>
      </Head>
      <Paper className={styles.main} style={{ position: "relative" }}>
        <div className={styles.title}>
          <FormattedLabel id="proceeding" />
        </div>
        <form className={styles.main} onSubmit={handleSubmit(submit)}>
          <div
            className={styles.row}
            style={{
              justifyContent:
                commId && attendanceMethod ? "space-between" : "center",
            }}
          >
            <div className={styles.alignContainer}>
              <TextField
                disabled={router?.query?.agendaNo ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="agendaNo" />}
                variant="standard"
                {...register("agendaNo")}
                // defaultValue={router?.query?.agendaNo ?? ""}
                defaultValue={router?.query?.agendaNo}
              />

              {!router.query.agendaNo && (
                // <Button
                //   variant='contained'
                //   color='primary'
                //   endIcon={<Search />}
                //   onClick={() => getAgenda()}
                // >
                //   {<FormattedLabel id='search' />}
                // </Button>
                <IconButton
                  disabled={watch("agendaNo") !== "" ? false : true}
                  className={styles.searchIcon}
                  onClick={() => {
                    getAgenda()
                  }}
                >
                  <Search />
                </IconButton>
              )}
            </div>
            {attendanceMethod && commId && (
              <>
                <FormControl
                  disabled
                  variant="standard"
                  error={!!error.attendanceCapturedFrom}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="attendanceMethod" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "230px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={attendanceMethod}
                        label="attendanceCapturedFrom"
                      >
                        <MenuItem key={1} value="BIOMETRIC">
                          {language === "en" ? "Biometric" : "बायोमेट्रिक"}
                        </MenuItem>
                        <MenuItem key={2} value="ONLINE">
                          {language === "en" ? "Online" : "ऑनलाइन"}
                        </MenuItem>
                      </Select>
                    )}
                    name="attendanceCapturedFrom"
                    control={control}
                  />
                  <FormHelperText>
                    {error?.attendanceCapturedFrom
                      ? error.attendanceCapturedFrom.message
                      : null}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  disabled
                  variant="standard"
                  error={!!error.committeeId}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="committeeName" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: "230px" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={commId}
                        label="committeeId"
                      >
                        {committeeName &&
                          committeeName.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                //@ts-ignore
                                value.id
                              }
                            >
                              {language == "en"
                                ? //@ts-ignore
                                  value.committeeNameEn
                                : // @ts-ignore
                                  value?.committeeNameMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="committeeId"
                    control={control}
                  />
                  <FormHelperText>
                    {error?.committeeId ? error.committeeId.message : null}
                  </FormHelperText>
                </FormControl>
              </>
            )}
          </div>
          <TextareaAutosize
            color="neutral"
            disabled
            minRows={1}
            maxRows={3}
            placeholder="Subject"
            className={styles.bigText}
            {...register("subject")}
            style={{ opacity: "0.5" }}
          />
          <TextareaAutosize
            color="neutral"
            disabled
            minRows={6}
            maxRows={3}
            placeholder="Subject Summary"
            className={styles.bigText}
            {...register("subjectSummary")}
            style={{ opacity: "0.5" }}
          />

          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            {/* ////////////////////////////////////////////////////////////////// */}
            <FormControl
              style={{
                minWidth: "230px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
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
                    {corporators &&
                      corporators?.map((value, index) => (
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
                name="proposer"
                control={control}
                defaultValue=""
              />
            </FormControl>
            {/* ////////////////////////////////////////////////////////////////// */}

            <FormControl
              style={{
                minWidth: "230px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
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
                    {corporators &&
                      corporators?.map((value, index) => (
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
                name="seconder"
                control={control}
                defaultValue=""
              />
            </FormControl>
            {/* ////////////////////////////////////////////////////////////////// */}

            <FormControl
              style={{
                minWidth: "230px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
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
                    {corporators &&
                      corporators?.map((value, index) => (
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
                name="president"
                control={control}
                defaultValue=""
              />
            </FormControl>
            {/* ////////////////////////////////////////////////////////////////// */}
          </div>

          <TextareaAutosize
            color="neutral"
            disabled={false}
            minRows={10}
            maxRows={3}
            placeholder="Add Proceeding/Verdict"
            className={styles.bigText}
            {...register("verdict")}
          />

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

          <div className={styles.buttons}>
            <Button variant="contained" type="submit" endIcon={<Save />}>
              <FormattedLabel id="save" />
            </Button>
            {/* ///////////////////////////// */}
            {/* /municipalSecretariatManagement/transaction/newDocketEntry/additionalDocket */}
            <Button
              variant="contained"
              type="button"
              endIcon={<AddIcon />}
              onClick={() => {
                router.push({
                  pathname: `/municipalSecretariatManagement/transaction/newDocketEntry/additionalDocket`,
                  query: {
                    agendaNo: router?.query?.agendaNo,
                    committeeName: watch("committeeId"),
                  },
                })
              }}
            >
              <FormattedLabel id="additionalDocket" />
            </Button>
            {/* <Button
              variant='contained'
              // endIcon={<Save />}
            >
              Publish
            </Button> */}
          </div>
          {/* ///////////////////////////////// */}
        </form>
        {cheapModal && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",

              position: "absolute",

              top: "0%",
              left: "0%",
              paddingTop: "30%",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              className={styles.main}
              sx={{ width: "60%", minHeight: "30%", borderRadius: "25px" }}
            >
              <div
                className={styles.row}
                style={{ margin: "0%", justifyContent: "center" }}
              >
                <span style={{ fontWeight: "bold", fontSize: "large" }}>
                  <FormattedLabel id="subjectSummary" />
                </span>
              </div>
              <TextareaAutosize
                className={styles.bigText}
                style={{ opacity: "0.5" }}
                disabled
                placeholder="Subject Summary"
                value={docketDesc}
                color="neutral"
                minRows={5}
                maxRows={8}
              />
              <div className={styles.buttons}>
                <Button
                  variant="contained"
                  onClick={() => {
                    setCheapModal(false)
                  }}
                  color="error"
                  endIcon={<ExitToApp />}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </div>
            </Paper>
          </div>
        )}
      </Paper>
    </>
  )
}

export default Index
