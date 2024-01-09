import React, { useEffect, useRef, useState } from "react"
import Head from "next/head"
import styles from "./view.module.css"
import router from "next/router"

import UploadButton from "../../../../containers/reuseableComponents/UploadButton"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import { useReactToPrint } from "react-to-print"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Button,
  Checkbox,
  Tooltip,
  Box,
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { LocalizationProvider } from "@mui/x-date-pickers/node/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/node/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import moment from "moment"
import { ExitToApp, Search, Send, Visibility } from "@mui/icons-material"
import PrintIcon from "@mui/icons-material/Print"
import { DataGrid } from "@mui/x-data-grid"
import IconButton from "@mui/material/IconButton"
import axios from "axios"
import URLs from "../../../../URLS/urls"
import { useSelector } from "react-redux"
// import Checkbox from '@mui/material/Checkbox'
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import sweetAlert from "sweetalert"
import { catchExceptionHandlingMethod } from "../../../../util/util"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"

const Print = () => {
  const [attachment, setAttachment] = useState("")
  const [checkBoxState, setCheckBoxState] = useState(false)
  const [committeeName, setCommitteeName] = useState([
    {
      id: 1,
      committeeNameEn: "",
      committeeNameMr: "",
    },
  ])
  const [table, setTable] = useState([])

  const userToken = useGetToken()

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

  const componentRef = useRef(null)
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Agenda",
  })

  const meetingAgendaSchema = yup.object().shape({
    // agendaNo: yup.string().required('Please enter agenda number'),
    // fromDate: yup.string().required('Please select from date'),
    // toDate: yup.string().required('Please select to date'),
    agendaNo: yup.string().nullable(),
    fromDate: yup.string().nullable(),
    toDate: yup.string().nullable(),
  })

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(meetingAgendaSchema),
  })

  const Comp = () => {
    return (
      <div className={styles.reportWrapper} ref={componentRef}>
        <div className={styles.heading}>
          <span>पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८ </span>
          <span>
            मा. शहर सुधारणा समिती <strong> ( विशेष सभा )</strong>
          </span>
          <span>कार्यपत्रिका क्रमांक - ०१</span>
        </div>
        <div
          className={styles.dateAndTime}
          style={{ justifyContent: "space-between" }}
        >
          {/* <span>दिनांक - {'insert date here'}</span> */}
          {/* <span>वेळ - {'insert time here'}</span> */}
          <span>
            दिनांक - <strong> ०१/०२/२०२३</strong>
          </span>
          <span>
            वेळ -<strong> सकाळी ११:३० वा</strong>
          </span>
        </div>
        <p className={styles.description}>
          {
            "पिंपरी चिंचवड महानगरपालिका मा. शहर सुधारणा समितीची पहिली सभा (विशेष सभा) शुक्रवार दिनांक २३/०१/२०२३ रोजी सकाळी ११:३० वा.  महानगरपालिका प्रशाश्कीय इमारतीमधील दिवंगत महापौर मधुकरराव पवळे ऑनलाईन पद्धतीने (व्हिडिओ कोन्फारन्सिंग द्वारे) आयोजित करणेत आले आहे. सभेत खालील कामकाज होईल."
          }
        </p>
        <span>
          <strong>
            {"विषय क्र. १) मा. शहर सुधारणा समितीच्या सभापतींची नेमणूक करणे"}
          </strong>
        </span>
        <p className={styles.description}>
          {
            'टिप - मुंबई प्रांतिक महानगरपालिका (स्थायी समिती, परिवहन समिती, प्रभाग समिती आणि इतर समित्यांचे सभापती यांची निवडणूक घेणे) मूळ नियम २००७ व (सुधारणा) नियम २००८ मधील नियम क्र.४ अन्वये "विशेष बैठकीच्या अध्यक्षस्थानी संबंधित विभाघीय आयुक्त किंव्हा त्यांचा प्रतिनिधी असेल जो अतिरिक्त आयुक्तांच्या कमी दर्जाचा नसावा" अशी तरतूद आहे'
          }
        </p>
        <div className={styles.signatureWrapper}>
          <div className={styles.signature}>
            <span
              style={{
                height: 50,
                width: 150,
                padding: "2%",
                marginBottom: "5%",
                border: "1px solid black",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Sign here
            </span>
            <span>{"( उल्हास बबनराव जगताप )"}</span>
            <span>
              <strong>नगरसचिव</strong>
            </span>
            <span>पिंपरी चिंचवड महानगरपालिका</span>
            <span>पिंपरी - ४११ ०१८</span>
          </div>
        </div>
        <div className={styles.endDetails}>
          <span>पिंपरी चिंचवड महानगरपालिका</span>
          <span>पिंपरी - १८. नगरसचिव कार्यालय</span>
          <span>क्रमांक : नस/४/कवि/२९३/२०२०</span>
          <span>दिनांक : ०२/०२/२०२३</span>
        </div>
        <div className={styles.tip}>
          <span className={styles.tipLeft}>टिप -</span>
          <span className={styles.tipRight}>
            {
              "प्रस्तुत कार्यपत्रिकेवरील विषयाचे विषयपत्र (डॉकेट) नगरसचिव कार्यालयात वाचणेसाठी ठेवणेत आले आहे"
            }
          </span>
        </div>
      </div>
    )
  }

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
      })
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

      field: "agendaNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="agendaNo" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "committeeNameEn" : "committeeNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeName" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "coveringLetterSubject",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "tip",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="tip" />,
      flex: 1,
    },
    {
      headerClassName: "cellColor",

      field: "actions",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => {
                console.log(":mail", params.row)
                router.push({
                  pathname:
                    "/municipalSecretariatManagement/reports/meetingAgenda/print",
                  query: {
                    agendaNo: params.row.agendaNo,
                    mailSent: params.row.mailSent,
                  },
                })
              }}
            >
              <Tooltip title={`VIEW AND PRINT`}>
                <Visibility sx={{ color: "#1976d2" }} />
              </Tooltip>
            </IconButton>
          </>
        )
      },
    },
  ]

  // const sendAgenda = () => {
  //   let agendaToSend = watch("agendaNo");
  //   console.log("agendaNo: ", watch("agendaNo"));
  //   console.log("Filepath: ", attachment);

  //   let apiBody = {
  //     agendaNo: watch("agendaNo"),
  //     filePath: [attachment],
  //   };

  //   axios
  //     // .get(
  //     .post(
  //       // `${URLs.MSURL}/trnPrepareMeetingAgenda/sendMeetingCircularOnMail?agendaNo=${agendaToSend}&filePath=${attachment}`
  //       `${URLs.MSURL}/trnPrepareMeetingAgenda/sendMeetingCircularOnMail`,
  //       apiBody,
  //     )
  //     .then((res) => {
  //       console.log(res.data);

  //       sweetAlert("Success", "Agenda sent successfully !", "success");
  //     });
  // };

  const returnEndPoints = (x, data) => {
    if (x) {
      return axios.get(
        `${URLs.MSURL}/trnPrepareMeetingAgenda/getByFromDateAndToDateOrAgendaNo?agendaNo=${data?.agendaNo}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
    } else {
      return axios.get(
        `${URLs.MSURL}/trnPrepareMeetingAgenda/getByFromDateAndToDateOrAgendaNo?fromDate=${data?.fromDate}&toDate=${data?.toDate}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
    }
  }

  const submit = (data) => {
    setTable([])

    returnEndPoints(checkBoxState, data)
      .then((res) => {
        if (res?.data?.prepareMeetingAgenda?.length > 0) {
          setTable(
            res.data.prepareMeetingAgenda.map((j, i) => ({
              srNo: i + 1,
              id: j.id,
              agendaNo: j.agendaNo,
              committeeId: j.committeeId,
              committeeNameEn: committeeName?.find(
                (obj) => obj.id === j.committeeId
              )?.committeeNameEn,
              committeeNameMr: committeeName?.find(
                (obj) => obj.id === j.committeeId
              )?.committeeNameMr,
              meetingDate: j.meetingDate,
              karyakramPatrikaNo: j.karyakramPatrikaNo,
              coveringLetterSubject: j.coveringLetterSubject,
              coveringLetterSubjectMr: j.coveringLetterSubjectMr,
              agendaSubjectEn: j.agendaSubject,
              agendaSubjectMr: j.agendaSubjectMr,
              coveringLetterNote: j.coveringLetterNote,
              coveringLetterNoteMr: j.coveringLetterNoteMr,
              agendaDescriptionEn: j.agendaDescription,
              agendaDescriptionMr: j.agendaDescriptionMr,
              agendaOutwardDate: j.agendaOutwardDate,
              agendaOutwardNo: j.agendaOutwardNo,
              tip: j.tip,
              tipMr: j.tipMr,
              sabhavruttant: j.sabhavruttant,
              sabhavruttantMr: j.sabhavruttantMr,
              agendaSubjectDao: j.agendaSubjectDao,
              meetingSchedule: j.meetingSchedule,
              mailSent: j.mailSent,
            }))
          )
        } else {
          sweetAlert({
            title: "OOPS!",
            text: `No agenda found`,
            icon: "warning",
            buttons: {
              confirm: {
                text: "OK",
                visible: true,
                closeModal: true,
              },
            },
            // dangerMode: true,
          })
        }
        console.log("Table: ", table)
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    if (checkBoxState) {
      setValue("fromDate", null)
      setValue("toDate", null)
    } else {
      setValue("agendaNo", "")
    }
  }, [checkBoxState])

  return (
    <>
      <Head>
        <title>Circulating and Publishing Meeting Agenda</title>
      </Head>
      <div style={{ display: "none" }}>
        <Comp />
      </div>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper className={styles.main}>
        <form onSubmit={handleSubmit(submit)}>
          <div
            className={styles.row}
            style={{
              justifyContent: "center",
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <span
              style={{
                fontWeight: "bolder",
                fontSize: "large",
              }}
            >
              Search by Agenda Number
            </span>
            <Checkbox
              onChange={() => {
                setCheckBoxState(!checkBoxState)
              }}
            />
          </div>
          <div
            className={styles.row}
            style={{
              justifyContent: "center",
              columnGap: 100,
              alignItems: "baseline",
            }}
          >
            {checkBoxState ? (
              <TextField
                type="number"
                disabled={attachment ? true : false}
                sx={{
                  width: "200px",
                }}
                label={<FormattedLabel id="agendaNo" />}
                variant="standard"
                {...register("agendaNo")}
                error={!!error.agendaNo}
                helperText={error?.agendaNo ? error.agendaNo.message : null}
                minValue={+1}
              />
            ) : (
              <>
                <FormControl error={!!error.fromDate}>
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          label={
                            <span>
                              <FormattedLabel id="fromDate" />
                            </span>
                          }
                          disabled={router.query.fromDate ? true : false}
                          value={
                            router.query.fromDate
                              ? router.query.fromDate
                              : field.value
                          }
                          onChange={(date) =>
                            field.onChange(
                              moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "200px" }}
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
                <FormControl error={!!error.toDate}>
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          inputFormat="dd/MM/yyyy"
                          label={
                            <span>
                              <FormattedLabel id="toDate" />
                            </span>
                          }
                          disabled={router.query.toDate ? true : false}
                          value={
                            router.query.toDate
                              ? router.query.toDate
                              : field.value
                          }
                          minDate={watch("fromDate")}
                          onChange={(date) =>
                            field.onChange(
                              moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              sx={{ width: "200px" }}
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
                    {error?.toDate ? error.toDate.message : null}
                  </FormHelperText>
                </FormControl>
              </>
            )}

            <Button
              disabled={
                watch("agendaNo") || (watch("fromDate") && watch("toDate"))
                  ? false
                  : true
              }
              sx={{
                width: "80px",
                height: "30px",
              }}
              variant="contained"
              type="submit"
              endIcon={<Search />}
              size="small"
            >
              <FormattedLabel id="search" />
            </Button>
          </div>
        </form>

        <div className={styles.row}>
          <Button
            variant="contained"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              router.push({
                pathname:
                  "/municipalSecretariatManagement/transaction/calender",
              })
            }}
            sx={{ minWidth: "50px", height: "28px" }}
          >
            <FormattedLabel id="back" />
          </Button>
        </div>
        {table?.length !== 0 && (
          <div className={styles.table} style={{ marginTop: "4%" }}>
            <DataGrid
              sx={{
                overflowY: "scroll",

                "& .MuiDataGrid-columnHeadersInner": {
                  background: `#556cd6`,
                  color: "white",
                  // fontFamily: `serif`,
                  // fontSize: `18px`,
                  // fontWeight: `bold`,
                },
                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
                "& .MuiSvgIcon-root": {
                  color: "black", // change the color of the check mark here
                },
              }}
              autoHeight
              rows={table}
              //@ts-ignore
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
        )}
      </Paper>
    </>
  )
}

export default Print
