import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import dynamic from "next/dynamic";
import urls from "../../../URLS/urls";
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import schoolLabels from "../../../containers/reuseableComponents/labels/modules/schoolLabels";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../util/util";

// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Main Component - Clerk
const Index = () => {
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [dataSource, setDataSource] = useState([]);
  const [labels, setLabels] = useState(schoolLabels[language ?? "en"]);

  useEffect(() => {
    setLabels(schoolLabels[language ?? "en"]);
  }, [setLabels, language]);

  const userToken = useGetToken();
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

  //   const [serviceList, setServiceList] = useState([
  //     {
  //       srNo: 1,
  //       studentName: "Ganesh AA Mane",
  //       applicationStatus: "APPROVED_BY_PRINCIPAL",
  //       serviceName: "Student Admission",
  //       serviceNameMr: "विद्यार्थी प्रवेश",
  //       applicationDate: "2023-07-13",
  //     },
  //   ]);

  const [totalApplication, setTotalApplication] = useState([]);
  const [approvedApplication, setApprovedApplication] = useState([]);
  const [pendingApplication, setPendingApplication] = useState([]);
  const [rejectedApplication, setRejectedApplication] = useState([]);

  const getMyApplications = async () => {
    if (user?.id) {
      axios
        .get(
          `${urls.SCHOOL}/trnItiTraineeAdmissionForm/getAllDashBoard?userId=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((resp) => {
          setTotalApplication(
            resp?.data?.map((r, i) => {
              return {
                srNo: i + 1,
                studentName: r.studentName,
                serviceName: r.serviceName,
                serviceNameMr: r.serviceNameMr,
                applicationDate: r.applicationDate,
                applicationStatus: r.applicationStatus,
              };
            })
          );

          setDataSource(
            resp?.data?.map((r, i) => {
              return {
                srNo: i + 1,
                studentName: r.studentName,
                serviceName: r.serviceName,
                serviceNameMr: r.serviceNameMr,
                applicationDate: r.applicationDate,
                applicationStatus: r.applicationStatus,
              };
            })
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

      axios
        .get(
          `${urls.SCHOOL}/trnItiTraineeAdmissionForm/getApprove?userId=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((resp) => {
          setApprovedApplication(
            resp?.data?.map((r, i) => {
              return {
                srNo: i + 1,
                studentName: r.studentName,
                serviceName: r.serviceName,
                serviceNameMr: r.serviceNameMr,
                applicationDate: r.applicationDate,
                applicationStatus: r.applicationStatus,
              };
            })
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

      axios
        .get(
          `${urls.SCHOOL}/trnItiTraineeAdmissionForm/getPending?userId=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((resp) => {
          setPendingApplication(
            resp?.data?.map((r, i) => {
              return {
                srNo: i + 1,
                studentName: r.studentName,
                serviceName: r.serviceName,
                serviceNameMr: r.serviceNameMr,
                applicationDate: r.applicationDate,
                applicationStatus: r.applicationStatus,
              };
            })
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });

      axios
        .get(
          `${urls.SCHOOL}/trnItiTraineeAdmissionForm/getRejected?userId=${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((resp) => {
          setRejectedApplication(
            resp?.data?.map((r, i) => {
              return {
                srNo: i + 1,
                studentName: r.studentName,
                serviceName: r.serviceName,
                serviceNameMr: r.serviceNameMr,
                applicationDate: r.applicationDate,
                applicationStatus: r.applicationStatus,
              };
            })
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    getMyApplications();
  }, []);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: labels.srNo,
      flex: 1,
    },
    {
      field: "studentName",
      headerAlign: "center",
      align: "left",
      headerName: labels.studentName,
      flex: 1,
    },
    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerAlign: "center",
      align: "left",
      headerName: labels.serviceName,
      flex: 1,
      //   width: 90,
    },
    {
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
      //   headerName: <FormattedLabel id="applicationDate" />,
      headerName: labels.applicationDate,
      //   width: 220,
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: "applicationStatus",
      headerAlign: "center",
      align: "left",
      //   headerName: <FormattedLabel id="applicationStatus" />,
      headerName: labels.applicationStatus,
      //   width: 280,
      flex: 1,
    },
  ];

  return (
    <>
      <div>
        <Paper
          component={Box}
          squar="true"
          elevation={5}
          m={1}
          pt={2}
          pb={2}
          pr={2}
          pl={4}
        >
          <Grid container>
            {/** Applications Tabs */}
            <Grid item xs={12}>
              <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>
                  {language == "en"
                    ? "Industrial Training Institute Dasboard"
                    : "औद्योगिक प्रशिक्षण संस्था डॅशबोर्ड"}
                </b>
              </h2>
            </Grid>
            <Grid item xs={12}>
              <Paper
                sx={{ height: "160px" }}
                component={Box}
                p={2}
                m={2}
                squar="true"
                elevation={5}
                // sx={{ align: "center" }}
              >
                <div className={styles.test}>
                  {/** Total Application */}

                  <div
                    className={styles.one}
                    onClick={() => setDataSource(totalApplication)}
                  >
                    <div className={styles.icono}>
                      <WcIcon color="secondary" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong style={{ align: "center" }}>
                        {language == "en" ? "Total Application" : "एकूण अर्ज"}
                      </strong>
                    </div>
                    <Typography variant="h6" align="center" color="secondary">
                      {totalApplication?.length}
                    </Typography>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Approved Application */}
                  <div
                    className={styles.one}
                    onClick={() => setDataSource(approvedApplication)}
                  >
                    <div className={styles.icono}>
                      <ThumbUpAltIcon color="success" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong style={{ align: "center" }}>
                        {language == "en"
                          ? "Approved Application"
                          : "मंजूर अर्ज"}
                      </strong>
                    </div>
                    <Typography variant="h6" align="center" color="green">
                      {approvedApplication?.length}
                    </Typography>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Pending Applications */}
                  <div
                    className={styles.one}
                    onClick={() => setDataSource(pendingApplication)}
                  >
                    <div className={styles.icono}>
                      <PendingActionsIcon color="warning" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong style={{ align: "center" }}>
                        {language == "en"
                          ? "Pending Application"
                          : "प्रलंबित अर्ज"}
                      </strong>
                    </div>
                    <Typography variant="h6" align="center" color="orange">
                      {pendingApplication?.length}
                    </Typography>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Rejected Application */}
                  <div
                    className={styles.one}
                    onClick={() => setDataSource(rejectedApplication)}
                  >
                    <div className={styles.icono}>
                      {/* <CancelIcon color="error" /> */}
                      <WcIcon color="secondary" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong style={{ align: "center" }}>
                        {language == "en"
                          ? "Rejected Application"
                          : "नाकारलेले अर्ज"}
                      </strong>
                    </div>
                    <Typography variant="h6" align="center" color="error">
                      {rejectedApplication?.length}
                    </Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </div>

      <Box
        style={{
          backgroundColor: "white",
          height: "auto",
          width: "auto",
          overflow: "auto",
        }}
      >
        <DataGrid
          getRowId={(row) => row.srNo}
          sx={{
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },

            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          autoHeight
          scrollbarSize={17}
          rows={dataSource ? dataSource : []}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box>
    </>
  );
};

export default Index;
