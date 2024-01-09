// ?agendaDate=2023-02-06&agendaNo=0000000022&committeeId=5

//localhost:8099/ms/api/mstDefineCommitteeMembers/getAll

import React, { useEffect, useState } from "react"
import router from "next/router"
import styles from "./markAttendace.module.css"
import URLs from "../../../../URLS/urls"
import axios from "axios"
import sweetAlert from "sweetalert"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import {
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Box,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import Head from "next/head"
import { useSelector } from "react-redux"
import { DataGrid } from "@mui/x-data-grid"
import { ExitToApp, Save } from "@mui/icons-material"
import moment from "moment"
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent/index"
import Loader from "../../../../containers/Layout/components/Loader/index.js"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const [committessData, setCommittessData] = useState([])
  // const [committeeName, setCommitteeName] = useState({});
  const [data, setData] = useState([])
  const [corporators, setCorporators] = useState([])
  const [showForwrdGr, setShowForwrdGr] = useState(false)
  const [showGenerateMomBtn, setShowGenerateMomBtn] = useState(true)

  const [loading, setLoading] = useState(false)
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
  console.log(":451", router?.query?.committeName)

  // Get Table - Data
  const getAllAttendance = () => {
    setLoading(true)
    axios
      .get(
        `${URLs.MSURL}/mstDefineCommitteeMembers/getByCommitteeId?comId=${router?.query?.committeeId}`,
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
              corporatorNameEn: corporators?.find(
                (o) => o.id == val.corporatorNo
              )?.fullNameEn,
              corporatorNameMr: corporators?.find(
                (o) => o.id == val.corporatorNo
              )?.fullNameMr,
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
        // }
        setLoading(false)
        callCatchMethod(error, language)
      })
  }

  useEffect(() => {
    if (router.query.committeeId) {
      if (corporators.length != 0) {
        getAllAttendance()
      }
    }
  }, [router?.query?.committeeId, corporators])

  useEffect(() => {
    //Get Committee Name
    // axios
    //   .get(`${URLs.MSURL}/mstDefineCommittees/getAll`)
    //   .then((res) => {
    //     res.data.committees.forEach((obj) => {
    //       let letSetData = router.query.committeeId == obj.committeeName;
    //       alert(letSetData);
    //       // setCommittessData()
    //       if (router.query.committeeId == obj.committeeName) {
    //         setCommitteeName(obj);
    //       }
    //     });
    //   })
    setLoading(true)
    axios
      .get(`${URLs.MSURL}/mstDefineCommittees/getAllForDropDown`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setCommittessData(
          r?.data?.committees
            ?.filter((obj) => router.query.committeName == obj.committeeName)
            .map((row) => ({
              id: row.id,
              comitteeEn: row.committeeName,
              comitteeMr: row.committeeNameMr,
            }))
        )
        setLoading(false)
      })
      .catch((error) => {
        console.log("error: ", error)
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

    //Get Corporators
    setLoading(true)
    axios
      .get(`${URLs.MSURL}/mstDefineCorporators/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setCorporators(
          res.data.corporator.map((j, i) => ({
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
            attendance: "absent",
          }))
        )
        setLoading(false)
      })
      .catch((error) => {
        console.log("error: ", error)
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

    /////// CONDITIONS ARE REMOVED FROM HERE ////////
    // if (router.query.agendaNo) {
    //   axios
    //     .get(
    //       `${URLs.MSURL}/trnPrepareMeetingAgenda/getByAgendaNo?agendaNo=${router.query.agendaNo}`
    //     )
    //     .then((res) => {
    //       if (
    //         res.data.prepareMeetingAgenda[0]
    //           .trnMarkAttendanceProceedingAndPublishDao.length != 0
    //       ) {
    //         sweetAlert({
    //           title: "Warning",
    //           text: "Attendance has already been marked for this agenda!",
    //           icon: "warning",
    //           closeOnClickOutside: false,
    //         }).then((will) => {
    //           if (will) {
    //             router.back()
    //           }
    //         })
    //       }
    //     })
    // }
  }, [])

  console.log(":4124", committessData)

  const columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 200,
    },
    {
      headerClassName: "cellColor",

      field: language === "en" ? "corporatorNameEn" : "corporatorNameMr",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="committeeMemberName" />,
      flex: 1,
    },
    // {
    //   headerClassName: "cellColor",

    //   field: "action",
    //   align: "center",
    //   headerAlign: "center",
    //   headerName: <FormattedLabel id="actions" />,
    //   width: 250,
    //   // renderCell: (params) => {
    //   //   return (
    //   //     <>
    //   //       <Select
    //   //         variant="standard"
    //   //         defaultValue={corporators[params.row.srNo - 1]["attendance"]}
    //   //         sx={{
    //   //           width: 200,
    //   //           textAlign: "center",
    //   //         }}
    //   //         onChange={(event) => {
    //   //           // @ts-ignore
    //   //           corporators[params.row.srNo - 1]["attendance"] = event.target.value;
    //   //         }}
    //   //       >
    //   //         <MenuItem key={2} value={"present"}>
    //   //           {language === "en" ? "Present" : "उपस्थित"}
    //   //         </MenuItem>
    //   //         <MenuItem key={3} value={"absent"}>
    //   //           {language === "en" ? "Absent" : "अनुपस्थित"}
    //   //         </MenuItem>
    //   //       </Select>
    //   //       {/* <TextField
    //   //         style={{ backgroundColor: "white" }}
    //   //         id="outlined-basic"
    //   //         // label={<FormattedLabel id="amenities" />}
    //   //         label={<FormattedLabel id="agendaSubject" />}
    //   //         variant="outlined"
    //   //         {...register("agendaSubject")}
    //   //       /> */}
    //   //     </>
    //   //   );
    //   // },

    //   ////////////////////////////////////////
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <Select
    //           fullWidth
    //           autoFocus
    //           value={params}
    //           // onChange={(value) => {
    //           //   field.onChange(value);
    //           // }}
    //         >
    //           {corporators &&
    //             corporators?.map((attend, index) => (
    //               <MenuItem key={index} value={attend?.id}>
    //                 {attend?.attendance}
    //               </MenuItem>
    //             ))}
    //         </Select>
    //       </>
    //     );
    //   },
    // },
  ]

  let agnNo = router.query.agendaNo

  const onSubmit = () => {
    // @ts-ignore
    let committeeMembersAttendance = data?.map((j, i) => ({
      // @ts-ignore
      listOfConcernCommitteeMembers: j.corporatorNo,
      // @ts-ignore
      action: j.attendance,
    }))

    let date = moment(new Date()).format("YYYY-MM-DD")

    // @ts-ignore
    // let committeeId = committessData?.find(
    //   (obj) => router.query.committeeId == obj.comitteeEn
    // )?.id

    const bodyForApi = {
      agendaNo: router?.query?.agendaNo,
      committeeId: +router?.query?.committeeId,
      date,
      attendanceCaptureFrom: "ONLINE",
      committeeMembersAttendance,
    }

    axios
      .post(
        `${URLs.MSURL}/trnMarkAttendanceProceedingAndPublish/save`,
        bodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          sweetAlert({
            title: "Success!",
            text: "Attendance marked successfully !",
            icon: "success",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            console.log(":lk", will)
            if (will) {
              setShowForwrdGr(true)
              setShowGenerateMomBtn(false)
            }
          })
        }
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }

  return (
    <>
      <Head>
        <title>Mark Attendance</title>
      </Head>
      <Box>
        <BreadcrumbComponent />
      </Box>
      {loading ? (
        <Loader />
      ) : (
        <Paper className={styles.adjustForBread}>
          <div className={styles.title}>
            <FormattedLabel id="markAttendance" />
          </div>
          <div
            className={styles.row}
            style={{
              justifyContent: "space-around",
              marginTop: 50,
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                onChange={(e) => {
                  // @ts-ignore
                  console.log("Date Selected: ", e.target.value)
                }}
                inputFormat="dd/MM/yyyy"
                label={
                  <span>
                    <FormattedLabel id="agendaDate" />
                  </span>
                }
                disabled
                value={router.query.agendaDate}
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
            <TextField
              disabled
              sx={{ width: "250px" }}
              label={<FormattedLabel id="agendaNo" />}
              variant="standard"
              value={agnNo}
            />

            {committessData && (
              <TextField
                disabled
                sx={{ width: "250px" }}
                label={<FormattedLabel id="committeeName" />}
                variant="standard"
                value={
                  language === "en"
                    ? // @ts-ignore
                      committessData[0]?.comitteeEn
                    : // @ts-ignore
                      committessData[0]?.comitteeMr
                }
                InputLabelProps={{
                  shrink: committessData ? true : false,
                }}
              />
            )}
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
              }}
            >
              <Paper
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "white",
                  borderRadius: "50%",
                  padding: 8,
                }}
                elevation={8}
              >
                <CircularProgress color="success" />
              </Paper>
            </div>
          ) : (
            <div className={styles.table}>
              <DataGrid
                autoHeight
                sx={{
                  overflowY: "scroll",
                  backgroundColor: "white",
                  "& .MuiDataGrid-virtualScrollerContent": {
                    // backgroundColor:'red',
                    // height: '800px !important',
                    // display: "flex",
                    // flexDirection: "column-reverse",
                    // overflow:'auto !important'
                  },
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#daf25e",
                    color: "black",
                  },

                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                  "& .mui-style-levciy-MuiTablePagination-displayedRows": {
                    marginTop: "17px",
                  },
                  width: "50%",
                }}
                rows={data}
                //@ts-ignore
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
                checkboxSelection={true}
                onSelectionModelChange={(selectionModel) => {
                  const updatedRows = data.map((row) => {
                    const selected = selectionModel.includes(row.id)
                    const action = selected ? "present" : "absent"
                    return { ...row, attendance: action }
                  })
                  setData(updatedRows)
                  //   submitSortedValues(selectedRows)
                  console.log(":100", updatedRows)
                }}
              />
            </div>
          )}

          <div className={styles.row} style={{ justifyContent: "center" }}>
            <div className={styles.buttons}>
              <Button
                // disabled={corporators ? false : true}
                disabled={showForwrdGr}
                color="success"
                variant="contained"
                endIcon={<Save />}
                onClick={() => {
                  onSubmit()
                }}
              >
                <FormattedLabel id="save" />
              </Button>
              <Button
                disabled={showGenerateMomBtn}
                // endIcon={<Save />}
                variant="contained"
                onClick={() => {
                  if (router.query.agendaNo)
                    router.push({
                      pathname:
                        "/municipalSecretariatManagement/transaction/minutesOfMeeting",
                      query: {
                        agendaNo: router.query.agendaNo,
                        committeName: router.query.committeName,
                        committeNameMr: router.query.committeNameMr,
                        committeeId: router.query.committeeId,
                      },
                    })
                }}
              >
                Generate MOM
              </Button>
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
        </Paper>
      )}
    </>
  )
}

export default Index
