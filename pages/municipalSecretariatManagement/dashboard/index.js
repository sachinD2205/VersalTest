import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  TextareaAutosize,
  ThemeProvider,
} from "@mui/material"
import styles from "./msm.module.css"
import Head from "next/head"
import urls from "../../../URLS/urls"
import axios from "axios"
import {
  AcUnit,
  Check,
  Description,
  HourglassTop,
  MoreHoriz,
  Undo,
  Visibility,
} from "@mui/icons-material"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel"
import moment from "moment"
import { useSelector } from "react-redux"
import JoditEditor from "../../common/joditReact_Component/JoditReact"
import Loader from "../../../containers/Layout/components/Loader/index.js"
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent/index"
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../util/util"

const Dashboard = () => {
  const [dashboardType, setDashboardType] = useState("all")
  const [table, setTable] = useState([])
  const [dockets, setDockets] = useState([])
  const [loading, setLoading] = useState(false)

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

  const userToken = useGetToken()

  const parser = new DOMParser()

  const [financialYear, setFinancialYear] = useState([])
  const [committeeName, setCommitteeName] = useState([])

  const [docketSubDetails, setDocketSubDetails] = useState("")
  const [docketSubSummary, setDocketSubSummary] = useState("")

  const [showDocketSubDetailsModel, setShowDocketSubDetailsModel] =
    useState(false)
  const [showDocketSubSummaryModel, setShowDocketSubSummaryModel] =
    useState(false)

  const [pageSize, setPageSize] = useState(5)

  const [docketTiles, setDocketTiles] = useState([
    {
      id: 1,
      label: "",
      count: 0,
      icon: <></>,
      status: "",
    },
  ])

  useEffect(() => {
    //Get Fiscal Year
    setLoading(true)
    axios
      .get(`${urls.CFCURL}/master/financialYearMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status === 200 || res?.status === 201) {
          setFinancialYear(
            res.data.financialYear.map((j) => ({
              id: j.id,
              financialYearEn: j.financialYear,
              financialYearMr: j.financialYearMr,
            }))
          )
          setLoading(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        // console.log("error: ", error)
        // if (!error.status) {
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

    //Get Committee
    setLoading(true)
    axios
      .get(`${urls.MSURL}/mstDefineCommittees/getAllForDropDown`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Committee: ", res.data.committees)
        if (res?.status === 200 || res?.status === 201) {
          setCommitteeName(
            res?.data?.committees?.map((j) => ({
              id: j.id,
              committeeNameEn: j.committeeName,
              committeeNameMr: j.committeeNameMr,
            }))
          )
          setLoading(false)
        } else {
          sweetAlert("Something Went Wrong!")
          setLoading(false)
        }
      })
      .catch((error) => {
        // console.log("error: ", error)
        // if (!error.status) {
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
  }, [])

  useEffect(() => {
    //Get all dockets
    if (financialYear?.length !== 0 && committeeName?.length !== 0) {
      setLoading(true)
      axios
        .get(`${urls.MSURL}/trnNewDocketEntry/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            setDockets(
              res?.data?.newDocketEntry
                ?.filter((j) => {
                  if (dashboardType == "all") {
                    return j
                  } else {
                    return j.isAgendaPrepared == true
                  }
                })
                .map((j, i) => ({
                  srNo: i + 1,
                  ...j,
                  subjectDate: moment(j.subjectDate).format("DD-MM-YYYY"),
                  approvedDate: j.approvedDate
                    ? moment(j.approvedDate).format("DD-MM-YYYY")
                    : "Not Available",
                  financialYearEn: financialYear?.find(
                    (obj) => obj.id === j.financialYear
                  )?.financialYearEn,
                  financialYearMr: financialYear?.find(
                    (obj) => obj.id === j.financialYear
                  )?.financialYearMr,
                  committeeNameEn: j.commett?.map((val) => {
                    return committeeName
                      ?.find((obj) => {
                        return obj.id == val.committeeId && obj
                      })
                      ?.committeeNameEn?.split(" ")
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()
                  }),
                  committeeNameMr: j.commett?.map((val) => {
                    return committeeName
                      ?.find((obj) => {
                        return obj.id == val.committeeId && obj
                      })
                      ?.committeeNameMr?.split(" ")
                      .map((word) => word.charAt(0))
                      .join("")
                      .toUpperCase()
                  }),
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
  }, [financialYear, dashboardType, committeeName])

  useEffect(() => {
    if (dockets.length > 0) {
      let submitted = 0,
        inProcess = 0,
        freezed = 0,
        reassigned = 0,
        approved = 0,
        onHold = 0,
        initiated = 0

      // else if (obj.status == "SUBMITTED") {
      //   ++submitted
      // @ts-ignore
      dockets?.forEach((obj) => {
        console.log(":a1", obj.status)
        // @ts-ignore
        if (obj.status == "ON_HOLD") {
          ++onHold
          // @ts-ignore
        } else if (obj.status == "IN PROCESS") {
          ++inProcess
          // @ts-ignore
        } else if (obj.status == "FREEZED") {
          ++freezed
          // @ts-ignore
        } else if (obj.status == "SUBMITTED") {
          ++approved
          // @ts-ignore
        } else if (
          obj.status == "REASSIGN" ||
          obj.status == "REASSIGN_TO_SECRETARY_CLERK"
        ) {
          ++reassigned
        } else if (obj.status == "INITIATED") {
          ++initiated
        }
      })

      setDocketTiles([
        {
          id: 4,
          label: <FormattedLabel id="Initiated" />,
          count: initiated,
          icon: <ArrowDownwardIcon />,
          status: "INITIATED",
          active: false,
        },
        {
          id: 5,
          label: <FormattedLabel id="InProcess" />,
          count: inProcess,
          icon: <MoreHoriz />,
          status: "IN PROCESS",
          active: false,
        },
        {
          id: 6,
          label: <FormattedLabel id="Reassigned" />,
          count: reassigned,
          icon: <Undo />,
          status: ["REASSIGN", "REASSIGN_TO_SECRETARY_CLERK"],
          active: false,
        },
        {
          id: 7,
          label: <FormattedLabel id="Freezed" />,
          count: freezed,
          icon: <AcUnit />,
          status: "FREEZED",
          active: false,
        },
        {
          id: 8,
          label: <FormattedLabel id="Approved" />,
          count: approved,
          icon: <Check />,
          status: "SUBMITTED",
          active: false,
        },
        {
          id: 9,
          label: <FormattedLabel id="OnHold" />,
          count: onHold,
          icon: <HourglassTop />,
          status: "ON HOLD",
          active: false,
        },
      ])
    }
    if (dashboardType == "all") {
      setTable(dockets?.filter((j) => j.status == "IN PROCESS"))
      toggleActiveStatus("IN PROCESS")
    } else {
      setTable(dockets?.filter((j) => j.status == "FREEZED"))
      toggleActiveStatus("FREEZED")
    }
  }, [dockets])

  const columns = [
    // {
    //   headerClassName: "cellColor",

    //   field: "srNo",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="srNo" />,
    //   width: 80,
    // },
    {
      headerClassName: "cellColor",

      field: "subjectDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectDate" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: "approvedDate",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="approvedDate" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "financialYearEn" : "financialYearMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="financialYear" />,
      width: 150,
    },
    {
      headerClassName: "cellColor",

      field: language == "en" ? "committeeNameEn" : "committeeNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeName" />,
      width: 300,
    },
    {
      headerClassName: "cellColor",
      field: "subject",
      headerAlign: "center",
      headerName: <FormattedLabel id="subject" />,
      width: 400,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setDocketSubDetails(dockets[params.row.srNo - 1]["subject"])
            setShowDocketSubDetailsModel(true)
          }}
        >
          <span>{params?.row?.subject}</span>
        </div>
      ),
    },
    {
      headerClassName: "cellColor",
      field: "subjectSummary",
      headerAlign: "center",
      headerName: <FormattedLabel id="subjectSummary" />,
      width: 500,
      renderCell: (params) => {
        const doc = parser.parseFromString(
          params?.row?.subjectSummary,
          "text/html"
        )
        const plainTextContent = doc.body.innerText
        console.log(plainTextContent)
        return (
          <div
            style={{ paddingLeft: "20px", cursor: "pointer" }}
            onClick={() => {
              setDocketSubSummary(
                dockets[params.row.srNo - 1]["subjectSummary"]
              )
              setShowDocketSubSummaryModel(true)
            }}
          >
            <span>{plainTextContent}</span>
          </div>
        )
      },
    },
  ]

  // ...

  const toggleActiveStatus = (statusToToggle) => {
    setDocketTiles((prevTiles) =>
      prevTiles?.map((tile) =>
        tile.status === statusToToggle
          ? { ...tile, active: true }
          : { ...tile, active: false }
      )
    )
  }

  useEffect(() => {
    console.log(":a2", table)
  }, [docketTiles])

  return (
    <>
      <Head>
        <title>MSM - Dashboard</title>
      </Head>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <Paper className={styles.main}>
        <div className={styles.title}>
          {language == "en"
            ? "Municipal Secretariat Management Dashboard"
            : "महानगरपालिका नगरसचिव व्यवस्थापन प्रणाली"}
        </div>
        <div
          className={styles.row}
          style={{ justifyContent: "center", marginTop: "2.5%" }}
        >
          <FormControl>
            <RadioGroup
              name="dashboard"
              defaultValue="all"
              sx={{ gap: 20 }}
              onChange={(e) => {
                setDashboardType(e.target.value)
              }}
              row
            >
              <FormControlLabel
                value="all"
                control={<Radio />}
                label="All Dockets"
              />
              <FormControlLabel
                value="agendaPrepared"
                control={<Radio />}
                label="Agenda prepared dockets"
              />
            </RadioGroup>
          </FormControl>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {docketTiles?.length > 1 && (
              <div className={styles.tilesWrapper}>
                {docketTiles?.map((obj, i) => {
                  return (
                    <div className={styles.tile} key={i}>
                      <div
                        className={styles.icon}
                        style={{
                          background: obj.active ? "red" : "#556cd6",
                        }}
                      >
                        {obj.icon}
                      </div>
                      <div className={styles.tileContent}>
                        <span
                          style={{
                            textTransform: "uppercase",
                            color: obj.active ? "red" : "#556cd6",
                          }}
                        >
                          {obj.label}
                        </span>
                        <div className={styles.container}>
                          <div className={styles.slider}>
                            <span
                              style={{
                                color: obj.active ? "red" : "#556cd6",
                              }}
                            >
                              {obj.count}
                            </span>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                obj.status == "all"
                                  ? setTable(dockets)
                                  : setTable(
                                      dockets?.filter((j) =>
                                        Array.isArray(obj.status)
                                          ? obj.status.includes(j.status)
                                          : j.status === obj.status
                                      )
                                    ),
                                  toggleActiveStatus(obj.status)
                              }}
                              style={{
                                background: obj.active ? "red" : "#556cd6",
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                        {docketTiles.length - 1 != i && (
                          <div className={styles.divider}></div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <DataGrid
              autoHeight
              sx={{
                marginTop: 4,
                width: "100%",
                "& .cellColor": {
                  background: `#556cd6`,
                  color: "white",
                  fontWeight: `bold`,
                },
                "& .redText": {
                  color: "red",
                },
                "& .orangeText": {
                  color: "orange",
                },
                "& .greenText": {
                  color: "green",
                },
                "& .blueText": {
                  color: "blue",
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
              rows={table}
              //@ts-ignore
              columns={columns}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </>
        )}
        {/* MODAL FOR SHOWING SUBJECT  */}
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
                width: "50%",
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                border: "2px solid black",
                borderRadius: 5,
              }}
            >
              <TextareaAutosize
                disabled
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "15px",
                  resize: "none",
                  overflowY: "auto",
                  borderRadius: 20,
                  marginBottom: "20px",
                  fontWeight: "bold",
                  boxShadow: "0 2px 4px whitesmoke",
                }}
                placeholder="Subject Details"
                value={docketSubDetails}
                color="black"
                minRows={5}
                maxRows={8}
              />

              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => {
                  setShowDocketSubDetailsModel(false), setDocketSubDetails("")
                }}
                sx={{ marginBottom: "20px" }}
              >
                {language == "en" ? "close" : "बंद करा"}
              </Button>
            </Box>
          </Modal>
        </>

        {/* MODAL FOR SHOWING SUMMARY */}
        <>
          <Modal
            open={showDocketSubSummaryModel}
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
                width: "90%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                border: "2px solid black",
                borderRadius: 2.5,
                height: "70%",
              }}
            >
              <div
                style={{
                  height: "100%",
                  overflowX: "auto",
                  width: "100%", // Added width property to the form
                  padding: "5px 15px 10px 15px",
                  marginBottom: "20px",
                }}
              >
                <JoditEditor
                  config={{
                    readonly: true,
                  }}
                  value={docketSubSummary}
                />
              </div>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => {
                  setShowDocketSubSummaryModel(false), setDocketSubSummary("")
                }}
                sx={{ marginBottom: "20px" }}
              >
                {language == "en" ? "close" : "बंद करा"}
              </Button>
            </Box>
          </Modal>
        </>
      </Paper>
    </>
  )
}

export default Dashboard
