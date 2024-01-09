import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  TextareaAutosize,
  ThemeProvider,
  Tooltip,
} from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import theme from "../../../../theme"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import styles from "../../../../components/municipalSecretariatManagement/styles/view.module.css"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import ScheduleIcon from "@mui/icons-material/Schedule"
import { Visibility } from "@mui/icons-material"
import axios from "axios"
import urls from "../../../../URLS/urls"
import sweetAlert from "sweetalert"
import { useSelector } from "react-redux"
import router from "next/router"
import moment from "moment"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import JoditEditor from "../../../common/joditReact_Component/JoditReact"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const [loading, setLoading] = useState(false)
  const [agendaDetails, setAgendaDetails] = useState([])
  const [comittees1, setcomittees1] = useState([])
  const [showDocketModel, setShowDocketModel] = useState(false)

  const refToRTE = useRef(null)

  const [particularRow, setParticularRow] = useState(null)

  const [pageSize, setPageSize] = useState(5)

  const language = useSelector((store) => store.labels.language)

  const userToken = useGetToken()

  useEffect(() => {
    if (comittees1?.length > 0) {
      setLoading(true)
      axios
        .get(`${urls.MSURL}/trnPrepareMeetingAgenda/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r.status == 200 || r.status == 201) {
            setAgendaDetails(
              r?.data?.prepareMeetingAgenda
                // ?.filter((o) => o?.isMeetingScheduled == false)
                .map((r, i) => ({
                  id: r.id,
                  srNo: i + 1,
                  agendaNo: r.agendaNo,
                  comitteeEn: comittees1?.find(
                    (obj) => obj.id === r.committeeId
                  )?.comitteeEn
                    ? comittees1?.find((obj) => obj.id === r.committeeId)
                        ?.comitteeEn
                    : "Not Available",
                  comitteeMr: comittees1?.find(
                    (obj) => obj.id === r.committeeId
                  )?.comitteeMr
                    ? comittees1?.find((obj) => obj.id === r.committeeId)
                        ?.comitteeMr
                    : "उपलब्ध नाही",
                  ///////////////////////////////////////////
                  agendaOutwardDate: r.agendaOutwardDate,
                  agendaOutwardNo: r.agendaOutwardNo,
                  agendaSubject: r.agendaSubject,
                  coveringLetterNote: r.coveringLetterNote,
                  coveringLetterSubject: r.coveringLetterSubject,
                  isMeetingScheduled: r.isMeetingScheduled,

                  isMeetingScheduledShowInEn: r.isMeetingScheduled
                    ? "_Scheduled"
                    : "Not Scheduled",

                  isMeetingScheduledShowInMr: r.isMeetingScheduled
                    ? "_शेड्यूल केलेली आहे"
                    : "शेड्यूल केलेली नाही",
                  tip: r.tip,
                  /////////////////////////////////
                  agendaSubjectDao: r.agendaSubjectDao,
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
  }, [comittees1])

  useEffect(() => {
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
  }, [])

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // headerClassName: styles.header_cell,
      minWidth: 100,
      maxWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "agendaNo",
      headerName: <FormattedLabel id="agendaNo" />,
      // headerClassName: styles.header_cell,
      minWidth: 150,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <strong> {params?.row?.agendaNo}</strong>
          </>
        )
      },
    },
    {
      field: language == "en" ? "comitteeEn" : "comitteeMr",
      headerName: <FormattedLabel id="committeeName" />,
      // headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <>
            <strong>
              {" "}
              {language == "en"
                ? params?.row?.comitteeEn
                : params?.row?.comitteeMr}
            </strong>
          </>
        )
      },
    },
    {
      field: "coveringLetterSubject",
      headerName: <FormattedLabel id="coveringLetterSubject" />,
      // headerClassName: styles.header_cell,
      minWidth: 350,
      headerAlign: "center",
    },
    {
      field:
        language == "en"
          ? "isMeetingScheduledShowInEn"
          : "isMeetingScheduledShowInMr",
      headerName: <FormattedLabel id="meetingScheduled" />,
      minWidth: 190,
      headerAlign: "center",
      renderCell: (params) => {
        const modifiedTextEn =
          params?.row?.isMeetingScheduledShowInEn?.substring(
            params?.row?.isMeetingScheduledShowInEn?.indexOf("_") + 1
          )
        const modifiedTextMr =
          params?.row?.isMeetingScheduledShowInMr?.substring(
            params?.row?.isMeetingScheduledShowInMr?.indexOf("_") + 1
          )

        return (
          <>
            {params?.row?.isMeetingScheduledShowInEn == "_Scheduled" ? (
              language == "en" ? (
                <strong style={{ color: "green" }}>{modifiedTextEn}</strong>
              ) : (
                <strong style={{ color: "green" }}>{modifiedTextMr}</strong>
              )
            ) : language == "en" ? (
              <strong style={{ color: "red" }}>
                {params?.row?.isMeetingScheduledShowInEn}
              </strong>
            ) : (
              <strong style={{ color: "red" }}>
                {params?.row?.isMeetingScheduledShowInMr}
              </strong>
            )}
          </>
        )
      },
    },
    {
      field: "action",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 130,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: 10,
            }}
          >
            <IconButton
              sx={{ color: "#096dd9" }}
              onClick={() => {
                // setParticularRow(params?.row);
                console.log(":10000", params?.row)
                setParticularRow(params?.row)
                setShowDocketModel(true)
              }}
            >
              <Tooltip
                title={
                  language == "en"
                    ? "VIEW THIS AGENDA'S INFO"
                    : "या अजेंडाची माहिती पहा"
                }
              >
                <Visibility />
              </Tooltip>
            </IconButton>
            {/* /////////////////////////// */}
            {params?.row?.isMeetingScheduled == false ? (
              <IconButton
                sx={{ color: "#096dd9" }}
                onClick={() => {
                  router.push({
                    pathname:
                      "/municipalSecretariatManagement/transaction/meetingScheduling",
                    query: {
                      agendaNo: params?.row?.agendaNo,
                    },
                  })
                }}
              >
                <Tooltip
                  title={
                    language == "en"
                      ? "SCHEDULE MEETING AGAINST THIS AGENDA"
                      : "या अजेंडाच्या विरोधात बैठकीचे वेळापत्रक"
                  }
                >
                  <ScheduleIcon />
                </Tooltip>
              </IconButton>
            ) : (
              ""
            )}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper className={styles.adjustForBread}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "1%",
            marginBottom: "0.5%",
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
          <>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <Grid item xs={12} md={9} lg={9}></Grid>
              <Grid
                item
                xs={12}
                md={3}
                lg={3}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<AddCircleIcon />}
                  onClick={() =>
                    router.push({
                      pathname:
                        "/municipalSecretariatManagement/transaction/agenda/prepareAgenda",
                    })
                  }
                  size="small"
                >
                  {<FormattedLabel id="prepareAgenda" />}
                </Button>
              </Grid>
            </Grid>
            <Box style={{ height: "auto", overflow: "auto", padding: "10px" }}>
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",

                  "& .MuiDataGrid-columnHeadersInner": {
                    background: `#556cd6`,
                    color: "white",
                    fontSize: `17px`,
                    fontWeight: `bold`,
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  // "& .MuiSvgIcon-root": {
                  //   color: "black", // change the color of the check mark here
                  // },
                }}
                components={{ Toolbar: GridToolbar }}
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                    disableExport: false,
                    disableToolbarButton: true,
                    csvOptions: { disableToolbarButton: false },
                    printOptions: { disableToolbarButton: false },
                  },
                }}
                density="compact"
                rows={agendaDetails || []}
                columns={columns}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
              />
            </Box>
            {/* //////////////////MODEL/////////////// */}
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
                    <strong>AGENDA PREVIEW</strong>
                  </div>
                </Box>
                <form
                  style={{
                    maxHeight: "calc(100vh - 170px)",
                    overflowY: "auto",
                    width: "100%",
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    style={{
                      padding: "10px",
                      display: "flex",
                      justifyContent: "center",
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
                        flexDirection: "column",
                        alignItems: "left",
                        alignItems: "center",
                        flexDirection: "column",
                        margin: "1%",
                      }}
                    >
                      <Paper
                        elevation={1}
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                        }}
                      >
                        <strong style={{ fontSize: "medium" }}>
                          {<FormattedLabel id="coveringLetterSubject" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.coveringLetterSubject}
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
                          {<FormattedLabel id="tip" />}
                        </strong>
                        <TextareaAutosize
                          disabled
                          style={{ overflow: "auto" }}
                          className={styles.bigText}
                          value={particularRow?.tip}
                        />
                      </Paper>
                    </Grid>

                    {language == "en" ? (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "left",
                          margin: "1%",
                        }}
                      >
                        <TextField
                          aria-disabled
                          label={<FormattedLabel id="committeeName" />}
                          variant="standard"
                          value={particularRow?.comitteeEn}
                        />
                      </Grid>
                    ) : (
                      <Grid
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "left",
                          margin: "1%",
                        }}
                      >
                        <TextField
                          // sx={{ width: "230px" }}
                          label={<FormattedLabel id="committeeName" />}
                          variant="standard"
                          value={particularRow?.comitteeMr}
                          aria-disabled
                        />
                      </Grid>
                    )}

                    {/* /////////////////////////////// */}
                    {particularRow?.agendaSubjectDao?.length > 0
                      ? particularRow?.agendaSubjectDao?.map((o, i) => {
                          return (
                            <>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                  alignItems: "left",
                                  margin: "1%",
                                }}
                              >
                                <Paper
                                  elevation={1}
                                  style={{
                                    width: "100%",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <strong
                                    style={{ fontSize: "medium" }}
                                  >{`Subject : ${i + 1}`}</strong>
                                  <TextareaAutosize
                                    disabled
                                    style={{ overflow: "auto" }}
                                    className={styles.bigText}
                                    value={o?.subject}
                                  />
                                </Paper>
                              </Grid>
                              {/* /////////////////////////////// */}
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  flexDirection: "column",
                                  alignItems: "left",
                                  margin: "1%",
                                }}
                              >
                                <Paper
                                  elevation={1}
                                  style={{
                                    width: "100%",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <strong
                                    style={{ fontSize: "medium" }}
                                  >{`Subject Summary : ${i + 1}`}</strong>
                                  {/* <TextareaAutosize
                                    disabled
                                    style={{ overflow: "auto" }}
                                    className={styles.bigText}
                                    value={o?.subjectSummary}
                                  /> */}

                                  <JoditEditor
                                    ref={refToRTE}
                                    value={o?.subjectSummary}
                                    config={{
                                      readonly: true,
                                    }}
                                  />
                                </Paper>
                              </Grid>
                              <br />
                            </>
                          )
                        })
                      : ""}
                  </Grid>
                </form>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => setShowDocketModel(false)}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Box>
            </Modal>
          </>
        )}
      </Paper>
    </>
  )
}

export default Index
