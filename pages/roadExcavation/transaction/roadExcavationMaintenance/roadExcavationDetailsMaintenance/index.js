import React, { useEffect, useState } from "react";
import router from "next/router";
// import styles from "../../renp.module.css";
import {
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  IconButton,
  Box,
  Tooltip,
  Grid,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Add, Clear, Delete, Edit, ExitToApp, Save } from "@mui/icons-material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import FormattedLabel from "../../../../../containers/reuseableComponents/labels/modules/roadExcavation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import moment from "moment";

const Index = () => {
  const [dataSource, setDataSource] = useState({});
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");
  console.log("loggedInUser1", loggedInUser);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;
  const userToken = useGetToken();
  console.log("1authority11111", authority);

  let juniorEngineer =
    authority && authority.find((val) => val === "JUNIOR_ENGINEER");

  useEffect(() => {
    getAllRoadExcevationApplications();
  }, []);

  const getAllRoadExcevationApplications = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);

    // if (loggedInUser === "citizenUser") {
    // if (juniorEngineer) {
    axios
      .get(`${urls.RENPURL}/nocPermissionForMaintenance/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("resultsdf", r.data);
        let result = r.data.nocPermissionForMaintenanceDaoList;
        let _res = result.map((r, i) => {
          return {
            // r.data.map((r, i) => ({
            // activeFlag: r.activeFlag,
            id: r.id,
            srNo: i + 1 + _pageNo * _pageSize,
            applicationNumber: r.applicationNumber,
            fullName: `${r.firstName} ${r.middleName} ${r.lastName}`,
            fullNameMr: `${r.firstNameMr} ${r.middleNameMr} ${r.lastNameMr}`,
            mobileNo: r.mobileNo,
            emailId: r.emailAddress,
            companyName: r.companyName,
            companyNameMr: r.companyNameMr,
            applicationDate:           
            moment(
              r.applicationDate,
              "YYYY-MM-DD HH:mm:ss A"
            ).format("DD-MM-YYYY") ,
            // r.applicationDate,
            applicationStatus: r.applicationStatus,

            // status:
            // r.applicationStatus === 0 ? "Application Created" :
            // r.status === 1 ? "Rejected by Clerk" :
            // r.status === 2 ? "Waiting for Site Visit" :
            // r.status === 3 ? "Rejected by Head Clerk" :
            // r.status === 4 ? "Photopass Waiting for Clerk" :
            // r.status === 5 ? "Waiting For Head Clerk" :
            // r.status === 6 ? "Rejected by Office-Superintendant" :
            // r.status === 7 ? "Waiting for Office-Superintendant" :
            // r.status === 8 ? "Rejected By Administrative-Officer" :
            // r.status === 9 ? "Waiting for Administrative-Officer" :
            // r.status === 10 ? "Rejected by Assistant-Commissioner" :
            // r.status === 11 ? "Waiting for Assistant-Commissioner" :
            // // r.status === 12 ? "send back to assistant commissioner" :
            // r.status === 13 ? "LOI Generated" :
            // r.status === 14 ? "Issue photopass after payment" :
            // r.status === 15 ? "Site Visit Scheduled" :
            // r.status === 16 ? "Site Visit Done" :
            // r.status === 17 ? "Photopass Issued" :
            // r.status === 18 ? "Close" :
            // r.status === 19 ? "Duplicate" :
            // "Pending",
          };
        });
        setDataSource([..._res]);
        setData({
          rows: _res,
          totalRows: r.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: r.data.pageSize,
          page: r.data.pageNo,
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // } else {
    //   axios.get(`${urls.RENPURL}/trnExcavationRoadCpmpletion/getAll`, {
      //   headers: {
      //     Authorization: `Bearer ${userToken}`,
      //   },
      // }).then((r) => {
    //     console.log("result", r.data);
    //     let result = r.data.trnExcavationRoadCpmpletionList;
    //     let _res = result.map((r, i) => {
    //       return {
    //         // r.data.map((r, i) => ({
    //         activeFlag: r.activeFlag,
    //         id: r.id,
    //         srNo: i + 1 + _pageNo * _pageSize,
    //         mobileNo: r.applicantMobileNo,
    //         fullName: `${r.applicantFirstName} ${r.applicantMiddleName} ${r.applicantLastName}`,
    //         emailId: r.applicantEmailId,
    //         aadharNo: r.applicantAadharNo,
    //         applicationDate: r.applicationDate,
    //         // status:
    //         // r.status === 0 ? "Saved as a draft" :
    //         // r.status === 1 ? "Rejected by Clerk" :
    //         // r.status === 2 ? "Waiting for Site Visit" :
    //         // r.status === 3 ? "Rejected by Head Clerk" :
    //         // r.status === 4 ? "Photopass Waiting for Clerk" :
    //         // r.status === 5 ? "Waiting For Head Clerk" :
    //         // r.status === 6 ? "Rejected by Office-Superintendant" :
    //         // r.status === 7 ? "Waiting for Office-Superintendant" :
    //         // r.status === 8 ? "Rejected By Administrative-Officer" :
    //         // r.status === 9 ? "Waiting for Administrative-Officer" :
    //         // r.status === 10 ? "Rejected by Assistant-Commissioner" :
    //         // r.status === 11 ? "Waiting for Assistant-Commissioner" :
    //         // // r.status === 12 ? "send back to assistant commissioner" :
    //         // r.status === 13 ? "LOI Generated" :
    //         // r.status === 14 ? "Issue photopass after payment" :
    //         // r.status === 15 ? "Site Visit Scheduled" :
    //         // r.status === 16 ? "Site Visit Done" :
    //         // r.status === 17 ? "Photopass Issued" :
    //         // r.status === 18 ? "Close" :
    //         // r.status === 19 ? "Duplicate" :
    //         // "Pending",
    //       };
    //     });
    //     setDataSource([..._res]);
    //     setData({
    //       rows: _res,
    //       totalRows: r.data.totalElements,
    //       rowsPerPageOptions: [10, 20, 50, 100],
    //       pageSize: r.data.pageSize,
    //       page: r.data.pageNo,
    //     });
    //   });
    // }
  };

  const handleViewActions = (paramsRow) => {
    // console.log("paramsRow", paramsRow);
    router.push({
      pathname:
        "/roadExcavation/transaction/roadExcavationMaintenance/viewFormJEMaintenance",
      query: {
        id: paramsRow.id,
      },
    });
  };

  const handleGenerateNOC = (paramsRow) => {
    console.log("paramsRow", paramsRow);
    let body = {
      id: paramsRow.id,
      role: "NOC",
    };
   
    const tempData = axios
      .post(`${urls.RENPURL}/nocPermissionForMaintenance/saveApprove`, body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res.status == 201 || res.status == 200) {
          sweetAlert("Saved!", "NOC Genrated Successfully !", "success");
          router.push("/roadExcavation/transaction/documenstGeneration/maintenanceNOC");
          router.push({
            pathname:
            "/roadExcavation/transaction/documenstGeneration/maintenanceNOC",
              query: {
                id: paramsRow.id,   
              },
            });
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const handleSlotBook = (paramsRow) => {
    console.log("paramsRowwwww11", paramsRow);
    if(paramsRow.applicationStatus=="APPOINTMENT_SCHEDULED" || paramsRow.applicationStatus=="APPOINTMENT_RESCHEDULED"){
    router.push({
      pathname:
        "/roadExcavation/transaction/roadExcevationForms/siteVisitScedule",
        query: {
          id: paramsRow.id,
          pageMode: "Maintaince",
          sMode:"ReSchedule"
        },
      });
    }else{
      router.push({
        pathname:
          "/roadExcavation/transaction/roadExcevationForms/siteVisitScedule",
          query: {
            id: paramsRow.id,
            pageMode: "Maintaince",            
          },
        });
    }
  };
  const handleSiteVisit = (paramsRow) => {
    // console.log("paramsRowwwww", paramsRow);
    router.push({
      pathname: "/roadExcavation/transaction/roadExcevationForms/siteVisitForm",
      query: {
        id: paramsRow.id,
        pageMode: "Maintaince",
      },
    });
  };
  const handleAppointmentReschedule = (paramsRow) => {
    // console.log("paramsRowwwww", paramsRow);
    router.push({
      pathname:
        "/roadExcavation/transaction/roadExcevationForms/siteVisitScedule",
      query: {
        id: paramsRow.id,
        pageMode: "Reschedule",
      },
    });
  };
  const handleLOIGeneration = (paramsRow) => {
    // console.log("paramsRowwwww", paramsRow);
    router.push({
      pathname: "/roadExcavation/transaction/roadExcavationMaintenance/viewFormEEMaintenance",
      query: {
        id: paramsRow.id,
        pageMode: "Maintaince",
        mode:"DemandNote"
      },
    });
  };
  const handleViewFormEE = (paramsRow) => {
    // console.log("paramsRowwwww", paramsRow);
    router.push({
      pathname:
        "/roadExcavation/transaction/roadExcavationMaintenance/viewFormEEMaintenance",
      query: {
        id: paramsRow.id,
      },
    });
  };
  const handlepaymentCollection = (paramsRow) => {
    // console.log("paramsRowwwww", paramsRow);
    router.push({
      pathname: "/roadExcavation/transaction/roadExcevationForms/Fees",
      query: {
        id: paramsRow.id,
      },
    });
  };

  const handleAddButton = () => {
    router.push(
      "/roadExcavation/transaction/roadExcevationForms/roadExcavationNocPermission"
    );
  };
  const handleEditAction = (paramsRow) => {
    router.push({
      pathname: "/roadExcavation/transaction/roadExcevationForms/editForm",
      query: {
        id: paramsRow.id,
      },
    });
  };

  const columns = [
    {
      headerClassName: "cellColor",

      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      // headerName: "srNo",
      // headerName: labels["srNo"],
      width: 100,
    },
    {
      headerClassName: "cellColor",

      field: "applicationNumber",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationNumber" />,

      width: 300,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "fullName" : "fullNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="fullName" />,
      //   headerName: labels["fullName"],
      // headerName: "Fullname",

      // flex: 1,
      width: 200,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: language == "en" ? "companyName" : "companyNameMr",
      headerAlign: "center",
      headerName: <FormattedLabel id="companyName" />,
      //   headerName: labels["companyName"],
      // headerName: "Company Name",
      // flex: 1,
      width: 200,
    },
    {
      headerClassName: "cellColor",
      align: "center",
      field: "mobileNo",
      headerAlign: "center",
      headerName: <FormattedLabel id="mobileNo" />,
      // headerName: labels["mobileNo"],
      // headerName: "Mobile No.",
      width: 200,
    },

    {
      headerClassName: "cellColor",
      field: "emailId",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="emailAddress" />,
      // headerName: labels["emailId"],
      // headerName: "Email",
      width: 200,
    },
    {
      headerClassName: "cellColor",
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationDate" />,
      // headerName: labels["applicationDate"],
      // headerName: "Application Date",
      width: 100,
    },

    // status
    {
      // field: language === "en" ? "status" : "statusMr",
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
      // headerName: <label>Application Status</label>,
      // flex: 1,
      width: 350,
      renderCell: (params) => {
        // console.log("statusss",params.row.applicationStatus);
        //   return (
        // <Box>
        //   {params.row.status === "APPLICATION_CREATED" ? (
        //     <p style={{ color: "#4BB543" }}>{params.row.status}</p>
        //   ) : params.row.status.includes("Rejected") ? (
        //     <p style={{ color: "red" }}>{params.row.status}</p>
        //   ) : params.row.status.includes("Waiting For Jr") &&
        //     authority &&
        //     authority.find((val) => val === "ENTRY") ? (
        //     <p style={{ color: "blue" }}>{params.row.status}</p>
        //   ) : params.row.status.includes("Waiting for Dy") &&
        //     authority &&
        //     authority.find((val) => val === "PROPOSAL APPROVAL") ? (
        //     <p style={{ color: "blue" }}>{params.row.status}</p>
        //   ) : params.row.status.includes("Waiting for Exe") &&
        //     authority &&
        //     authority.find((val) => val === "FINAL_APPROVAL") ? (
        //     <p style={{ color: "blue" }}>{params.row.status}</p>
        //   ) : params.row.status.includes("Accountant") &&
        //     authority &&
        //     authority.find((val) => val === "PAYMENT VERIFICATION") ? (
        //     <p style={{ color: "blue" }}>{params.row.status}</p>
        //   ) : (
        //     <p style={{ color: "orange" }}>{params.row.status}</p>
        //   )}
        // </Box>
        //   );
      },
    },

    //Actions
    {
      headerClassName: "cellColor",
      align: "center",
      field: "action",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="action" />,
      // headerName: "Action",

      // headerName: labels["action"],
      width: 400,
      renderCell: (params) => {
        return (
          <Grid container>
            {loggedInUser === "citizenUser" &&
              params.row.applicationStatus == "REVERT_BY_JUNIOR_ENGINEER" && (
                <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Tooltip title="View">
                    <IconButton
                      onClick={() => {
                        handleEditAction(params.row);
                      }}
                    >
                      <EditIcon style={{ color: "#556CD6" }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              )}

            {authority &&
              authority[0] == "JUNIOR_ENGINEER" &&
              params.row.applicationStatus === "APPLICATION_CREATED" && (
                <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Tooltip title="View">
                    <Button
                    variant="contained"
                      onClick={() => {
                        handleViewActions(params.row);
                      }}
                    >
                      {language=="en"?"View":"पहा"}
                      {/* <RemoveRedEyeIcon style={{ color: "#556CD6" }} /> */}
                    </Button>
                  </Tooltip>
                </Grid>
              )}
           
            <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
              {authority &&
              authority[0] == "JUNIOR_ENGINEER" &&
              params.row.applicationStatus == "APPROVE_BY_JUNIOR_ENGINEER" ? (
                <>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleSlotBook(params.row);
                    }}
                  >
                    {/* <FormattedLabel id="bookSlot" /> */}
                    Schedule Appointment
                  </Button>
                </>
              ) : (
                <></>
              )}
              {authority &&
              authority[0] == "JUNIOR_ENGINEER" &&
              (params.row.applicationStatus == "APPOINTMENT_SCHEDULED" ||params.row.applicationStatus == "APPOINTMENT_RESCHEDULED") ? (
                <>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleSlotBook(params.row);
                    }}
                  >
                    {/* <FormattedLabel id="bookSlot" /> */}
                    Reschedule Appointment
                  </Button>
                </>
              ) : (
                <></>
              )}
              {authority &&
                authority[0] == "JUNIOR_ENGINEER" &&
                (params.row.applicationStatus == "APPOINTMENT_SCHEDULED" ||
                  params.row.applicationStatus ==
                    "APPOINTMENT_RESCHEDULED") && (
                  <>
                    <Button
                      variant="contained"
                      sx={{marginLeft:"2vw"}}
                      onClick={() => {
                        handleSiteVisit(params.row);
                      }}
                    >
                      Site Visit
                    </Button>
                  </>
                )}
                {authority &&
                authority[0] == "JUNIOR_ENGINEER" &&
                (params.row.applicationStatus == "SITE_VISIT") && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleLOIGeneration(params.row);
                      }}
                    >
                      Generate Demand Note
                    </Button>
                  </>
                )}
              {/* {
                  authority && authority[0]=="JUNIOR_ENGINEER"&&(params.row.applicationStatus=="APPOINTMENT_SCHEDULED" || params.row.applicationStatus=="APPOINTMENT_RESCHEDULED") && <>
                  <Button  variant="contained" 
                  sx={{marginLeft:"10px"}}
                  onClick={() => {
                    handleAppointmentReschedule(params.row);
                  }}
                  >
                       Appointment Reschedule 
                  </Button>
                  </>
                } */}
              {authority &&
                authority[0] == "DEPUTY_ENGINEER" &&
                (params.row.applicationStatus == "SITE_VISITED" ||
                params.row.applicationStatus == "LOI_GENERATED") && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleViewFormEE(params.row);
                      }}
                    >
                      <FormattedLabel id="view" />
                    </Button>
                  </>
                )}
              {authority &&
                authority[0] == "EXECUTIVE_ENGINEER" &&
                params.row.applicationStatus ==
                  "APPROVE_BY_DEPUTY_ENGINEER" && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleViewFormEE(params.row);
                      }}
                    >
                      <FormattedLabel id="view" />
                    </Button>
                  </>
                )}
              {authority &&
                authority[0] == "EXECUTIVE_ENGINEER" &&
                (params.row.applicationStatus == "PAYEMENT_SUCCESSFUL" || params.row.applicationStatus == "APPROVED_BY_ADDITIONAL_COMMISSIONER")  && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleGenerateNOC(params.row);
                      }}
                    >
                      <FormattedLabel id="generateNOC" />
                    </Button>
                  </>
                )}
              {authority &&
                authority[0] == "ADDITIONAL_CITY_ENGINEER" &&
                params.row.applicationStatus ==
                  "APPROVE_BY_EXECUTIVE_ENGINEER" && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleViewFormEE(params.row);
                      }}
                    >
                      <FormattedLabel id="view" />
                    </Button>
                  </>
                )}
              {authority &&
                authority[0] == "ADDITIONAL_COMMISHIONER" &&
                params.row.applicationStatus ==
                  "APPROVE_BY_JOINT_CITY_ENGINEER" && (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleViewFormEE(params.row);
                      }}
                    >
                      <FormattedLabel id="view" />
                    </Button>
                  </>
                )}
             
              {/* {loggedInUser === "citizenUser" &&
                  params.row.applicationStatus=="LOI_GENERATED" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    // router.push("/roadExcavation/transaction/roadExcevationForms/Fees")
                    handlepaymentCollection(params.row);
                  }}
                  >
                                             <FormattedLabel id="pay" />
                  </Button>
                  </>
                } */}
          
              {/* {loggedInUser === "citizenUser" &&
                  params.row.applicationStatus=="PAYEMENT_SUCCESSFUL" && <>
                  <Button  variant="contained" 
                  onClick={() => {
                    router.push("/roadExcavation/transaction/documenstGeneration/receipt")
                    // handlepaymentCollection(params.row);
                  }}
                  >
   <FormattedLabel id="receipt" />
                  </Button>
                  </>
                } */}
            </Grid>
          </Grid>
        );
      },
    },
  ];

  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          // backgroundColor:'#0E4C92'
          // backgroundColor:'		#0F52BA'
          // backgroundColor:'		#0F52BA'
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>
          <FormattedLabel id="roadExcavationMaintenanceApplications" />
          {/* Road Excavation Applications */}
        </h2>
      </Box>

      {loggedInUser === "citizenUser" ? (
        // <div className={styles.addbtn}>
        <Button variant="contained" endIcon={<Add />} onClick={handleAddButton}>
          <FormattedLabel id="add" />
          {/* Add */}
        </Button>
      ) : (
        //   </div>
        <></>
      )}

      <DataGrid
        // disableColumnFilter
        // disableColumnSelector
        // disableToolbarButton
        // disableDensitySelector
        components={{ Toolbar: GridToolbar }}
        componentsProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
            // printOptions: { disableToolbarButton: true },
            // disableExport: true,
            // disableToolbarButton: true,
            // csvOptions: { disableToolbarButton: true },
          },
        }}
        autoHeight
        sx={{
          // marginLeft: 5,
          // marginRight: 5,
          // marginTop: 5,
          // marginBottom: 5,

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
        // rows={dataSource}
        // columns={columns}
        // pageSize={5}
        // rowsPerPageOptions={[5]}
        //checkboxSelection

        density="compact"
        // autoHeight={true}
        // rowHeight={50}
        pagination
        paginationMode="server"
        // loading={data.loading}
        rowCount={data.totalRows}
        rowsPerPageOptions={data.rowsPerPageOptions}
        page={data.page}
        pageSize={data.pageSize}
        rows={data.rows}
        columns={columns}
        onPageChange={(_data) => {
          getAllRoadExcevationApplications(data.pageSize, _data);
        }}
        onPageSizeChange={(_data) => {
          console.log("222", _data);
          // updateData("page", 1);
          getAllRoadExcevationApplications(_data, data.page);
        }}
      />
    </Paper>
  );
};

export default Index;
