import { Box, Button, IconButton, Paper, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import axios from "axios"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
// import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
//import AppointmentSlot from "../../AppointmentSlot/AppointmentSlot";
// import styles from "../../../../skySignLicense/view.module.css"
// import styles from "../transactions/components/components.module.css"
import styles from "../../../styles/skysignstyles/components.module.css"

// import { addAllNewMarriageRegistraction } from "../../../redux/features/newMarriageRegistrationSlice"
import FlakyIcon from "@mui/icons-material/Flaky"
import EventIcon from "@mui/icons-material/Event"
//dont do like this
// import urls from ".../../../URLS/urls"
//do like this
import urls from "../../../URLS/urls"
const Index = () => {
  const [dataSource, setDataSource] = useState([])
  const router = useRouter()
  const dispach = useDispatch()
  const [tableData, setTableData] = useState([])
  let user = useSelector((state) => state.user.user)

  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer")

  const authority = user?.menus?.find(
    (r) => r.clickTo === selectedMenuFromDrawer
  )?.roles

  console.log("authority", authority)
  // Get Table - Data
  const getNewMarriageRegistractionDetails = () => {
    console.log("userToken", user.token)
    axios
      .get(`${urls.SSLM}/Trn/ApplicantDetails/getApplicantDetails`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((resp) => {
        let tableData
        if (authority?.find((r) => r === "DOCUMENT_CHECKLIST")) {
          tableData = resp.data.filter((data, index) => {
            return data.applicationStatus === "APPLICATION_CREATED"
          })
        }

        if (authority?.find((r) => r === "APPOINTMENT_SCHEDULE")) {
          tableData = resp.data.filter((data, index) => {
            return data.applicationStatus === "APPOINTMENT_SCHEDULED"
          })
        }

        if (authority?.find((r) => r === "DOCUMENT_VERIFICATION")) {
          tableData = resp.data.filter((data, index) => {
            return data.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK"
          })
        }

        if (authority?.find((r) => r === "FINAL_APPROVAL")) {
          tableData = resp.data.filter((data, index) => {
            return data.applicationStatus === "APPLICATION_SENT_TO_CMO"
          })
        }
        if (authority?.find((r) => r === "LOI_GENERATION")) {
          tableData = resp.data.filter((data, index) => {
            return data.applicationStatus === "CASHIER"
          })
        }
        if (authority?.find((r) => r === "CERTIFICATE_ISSUER")) {
          tableData = resp.data.filter((data, index) => {
            return data.applicationStatus === "CMO_APPROVED"
          })
        } else {
          setTableData(resp.data)
        }
        setTableData(tableData)
        // {record?.row?.applicationStatus === 'APPLICATION_CREATED' &&
        // authority?.find((r) => r === 'DOCUMENT CHECKLIST')
        // console.log('response Data', resp.data)
        // dispach(addAllNewMarriageRegistraction(resp.data))
        // setDataSource(resp.data)
      })
    //   .then((resp) => {
    //     console.log('response Data', JSON.stringify(resp.data))
    //     dispach(addAllNewMarriageRegistraction(resp.data))
    //     // setDataSource(resp.data)
    //     setTableData(resp.data)
    //   })
    // .map((res, index) => ({
    //   id: res.id,
    //   srNo: index + 1,
    //   registrationNo: res.registrationNo,
    //   hName: res.gFName + ' ' + res.gLName,
    //   wName: res.bFName + ' ' + res.bLName,
    //   pPlaceOfMarriage: res.pPlaceOfMarriage,
    //   marriageDate: res.marriageDate,
    // }))
  }

  useEffect(() => {
    getNewMarriageRegistractionDetails()
  }, [])

  // // Add Record
  // const addNewRecord = () => {
  //   router.push({
  //     pathname: `/marriageRegistration/transactions/newMarriageRegistration`,
  //     query: {
  //       pageMode: 'Add',
  //     },
  //   })
  // }

  // EditData
  // const editRecord = (value) => {
  //   router.push({
  //     pathname: `/marriageRegistration/transactions/newMarriageRegistration/newMarriageRegistration`,
  //     query: {
  //       pageMode: 'Edit',
  //       ...value,
  //     },
  //   })
  // }

  // // Delete By ID
  // const deleteById = (value) => {
  //   swal({
  //     title: 'Delete?',
  //     text: 'Are you sure you want to delete this Record ? ',
  //     icon: 'warning',
  //     buttons: true,
  //     dangerMode: true,
  //   }).then((willDelete) => {
  //     if (willDelete) {
  //       axios
  //         .delete(
  //           `${urls.SSLM}/api/applicant/deleteApplicantRegistration/${value}`,
  //         )
  //         .then((res) => {
  //           if (res.status == 226) {
  //             swal('Record is Successfully Deleted!', {
  //               icon: 'success',
  //             })
  //             setButtonInputState(false)
  //             getNewMarriageRegistractionDetails()
  //           }
  //         })
  //     } else {
  //       swal('Record is Safe')
  //     }
  //   })
  // }

  // view
  const viewRecord = (record) => {
    console.log("record value => ", record)

    router.push({
      pathname:
        "/marriageRegistration/transactions/newMarriageRegistration/cleark/AprovalTab",

      query: {
        pageMode: "View",
        disabled: true,
        ...record,
      },
    })
  }
  //ckecklist
  const checklistRecord = (record) => {
    console.log("record value => ", record)

    router.push({
      // pathname:
      //   '/marriageRegistration/transactions/newMarriageRegistration/cleark/DocumentAproveTAB',
      pathname:
        "/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab",
      // 'pages/marriageRegistration/transactions/newMarriageRegistration/components/FormPreview.js',
      query: {
        pageMode: "DOCUMENT_CHECKLIST",
        disabled: true,
        ...record,
        role: "DOCUMENT CHECKLIST",
      },
    })
  }

  let srNO = 0

  // Columns
  const columns = [
    {
      field: "srNo",
      // headerName: <FormattedLabel id="srNo" />,

      width: 40,
    },
    {
      field: "applicationNumber",
      headerName: "Application No.",
      flex: 1,
    },
    {
      field: "applicationDate",
      headerName: "Application Date",
      flex: 1,
    },

    {
      field: "gFName",
      headerName: "Applicant Name",
      flex: 1,
    },
    // {
    //   field: 'departments',
    //   headerName: 'Department Name',
    //   flex: 1,
    // },
    {
      field: "serviceName",
      headerName: "Service Name",
      flex: 1,
    },
    {
      field: "applicationStatus",
      headerName: "Status",
      flex: 1,
    },

    {
      field: "actions",
      // headerName: <FormattedLabel id="actions" />,
      width: 340,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {/*               <IconButton onClick={() => viewRecord(record.row)}>
                <Button
                  style={{
                    height: '30px',
                    width: '50px',
                  }}
                  variant="contained"
                  // endIcon={<FlakyIcon />}
                  color="success"
                >
                  verify
                </Button>
              </IconButton> */}
              {
                /* record?.row?.applicationStatus === 'APPLICATION_CREATED' && */
                authority?.find((r) => r === "DOCUMENT CHECKLIST") && (
                  <IconButton onClick={() => checklistRecord(record.row)}>
                    <Button
                      style={{
                        height: "30px",
                        width: "180px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Document Checklist
                    </Button>
                  </IconButton>
                )
              }
              {
                /* record?.row?.applicationStatus ===
                                'APPLICATION_SENT_TO_SR_CLERK' && */
                authority?.find((r) => r === "APPOINTMENT_SCHEDULE") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<EventIcon />}
                      style={{
                        height: "30px",
                        width: "105px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/components/slot`,
                          query: {
                            appId: record.row.id,
                            role: "APPOINTMENT_SCHEDULE",
                          },
                        })
                      }
                    >
                      Schedule
                    </Button>
                  </IconButton>
                )
              }
              {authority?.find((r) => r === "DOCUMENT_VERIFICATION") && (
                <>
                  {/* <IconButton onClick={() => viewRecord(record.row)}>
                      <Button
                        style={{
                          height: '30px',
                          width: '50px',
                        }}
                        variant="contained"
                        // endIcon={<FlakyIcon />}
                        color="success"
                      >
                        verify
                      </Button>
                    </IconButton> */}

                  <IconButton>
                    <Button
                      variant="contained"
                      // endIcon={<EventIcon />}
                      style={{
                        height: "30px",
                        width: "80px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/components/slot`,
                          query: {
                            appId: record.row.id,
                            role: "DOCUMENT_VERIFICATION",
                          },
                        })
                      }
                    >
                      Verify
                    </Button>
                  </IconButton>

                  {/* <IconButton>
                      <Button
                        variant="contained"
                        // endIcon={<EventIcon />}
                        style={{
                          height: '30px',
                          width: '120px',
                        }}
                        color="success"
                        onClick={() =>
                          router.push(
                            `/marriageRegistration/transactions/newMarriageRegistration/cleark/applicationDtlAndDoc`,
                          )
                        }
                      >
                        document Tab
                      </Button>
                    </IconButton> */}
                </>
              )}

              {
                /* record?.row?.applicationStatus ===
                                'APPLICATION_SENT_TO_SR_CLERK' && */
                authority?.find((r) => r === "FINAL_APPROVAL") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<EventIcon />}
                      style={{
                        height: "30px",
                        width: "105px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/components/slot`,
                          query: {
                            appId: record.row.id,
                            role: "FINAL_APPROVAL",
                          },
                        })
                      }
                    >
                      CMO VERIFY
                    </Button>
                  </IconButton>
                )
              }

              {
                /* record?.row?.applicationStatus === 'LOI_GENERATED' &&
                 */ authority?.find((r) => r === "LOI_GENERATION") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "30px",
                        width: "50px",
                      }}
                      color="success"
                      // onClick={() => {
                      //   setmodalforAprov(true)
                      //   router.push({
                      //     pathname: `/marriageRegistration/transactions/newMarriageRegistration/components/slot`,
                      //     query: {
                      //       appId: record.row.id,
                      //       role: 'LOI_GENERATION',
                      //     },
                      //   })
                      // }}
                    >
                      LOI
                    </Button>
                  </IconButton>
                )
              }

              {
                /* record?.row?.applicationStatus === 'LOI_GENERATED' &&
                 */ authority?.find((r) => r === "CASHIER" || r === "") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "30px",
                        width: "50px",
                      }}
                      color="success"
                      onClick={() => {
                        setmodalforAprov(true)
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/components/slot`,
                          query: {
                            appId: record.row.id,
                            role: "CASHIER",
                          },
                        })
                      }}
                    >
                      payment
                    </Button>
                  </IconButton>
                )
              }
              {
                /* record?.row?.applicationStatus === 'LOI_GENERATED' &&
                 */ authority?.find(
                  (r) => r === "CERTIFICATE_ISSUER" || r === ""
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "30px",
                        width: "50px",
                      }}
                      color="success"
                      onClick={() => {
                        setmodalforAprov(true)
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/components/slot`,
                          query: {
                            appId: record.row.id,
                            role: "CERTIFICATE_ISSUER",
                          },
                        })
                      }}
                    >
                      GENERATE CERTIFICATE
                    </Button>
                  </IconButton>
                )
              }
            </div>
          </>
        )
      },
    },
  ]

  return (
    <>
      {/* <BasicLayout> */}
      <Paper
        sx={{
          marginLeft: 5,
          marginRight: 2,
          marginTop: 5,
          marginBottom: 5,
          padding: 1,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <br />
        <div className={styles.detailsTABLE}>
          <div className={styles.h1TagTABLE}>
            <h2
              style={{
                fontSize: "20",
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {/* {<FormattedLabel id="newMRtable" />} */}
            </h2>
          </div>
        </div>
        {/* <div className={styles.titleM}>
          <Typography variant="h4" display="block" gutterBottom>
            {<FormattedLabel id="newMRtable" />}
          </Typography>
        </div> */}
        <br />

        {/* 
          <div className={styles.addbtn}>
            <Button
              variant='contained'
              color='primary'
              onClick={() => addNewRecord()}
            >
              {<FormattedLabel id='add' />}
            </Button>
          </div>
          <br />
          */}

        {/* <DataGrid
          autoHeight
          sx={{
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
          }}
          rows={dataSource}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        /> */}

        <DataGrid
          sx={{
            marginLeft: 9,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5,
            overflowY: "scroll",

            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          density="compact"
          autoHeight
          scrollbarSize={17}
          rows={tableData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Paper>
      {/* </BasicLayout> */}
    </>
  )
}

export default Index
