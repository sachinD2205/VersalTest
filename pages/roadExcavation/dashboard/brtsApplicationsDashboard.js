import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Main Component - Clerk
const Index = () => {
  const router = useRouter();
  const userToken = useGetToken();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [dataSource, setDataSource] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  const [pendingApplication, setPendingApplication] = useState([]);
  const [rejectedApplication, setRejectedApplication] = useState([]);
  const [approvedApplication, setApprovedApplication] = useState([]);
  const [totalApplication, setTotalApplication] = useState([]);
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
  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getMyApplications = async () => {
    console.log("user", user);
    axios.get(`${urls.RENPURL}/report/getTotalApplication1`,{
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    }).then((resp) => {
      console.log("total", resp);

      setTotalApplication(
        resp?.data?.dashboardDaoList?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.id,
            serviceName: serviceList?.find((s) => s.id == r.serviceId)
              ?.serviceName,
            serviceNameMr: serviceList?.find((s) => s.id == r.serviceId)
              ?.serviceNameMr,
            applicantName: r.applicantName,
            applicantNameMr: r.applicantNameMr,
          };
        })
      );

      setDataSource(
        resp?.data?.dashboardDaoList?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.id,
            serviceName: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceName,
            serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceNameMr,
            applicantName: r.applicantName,
            applicantNameMr: r.applicantNameMr,
          };
        })
      );
    }) .catch((error) => {
      callCatchMethod(error, language);
    });

    axios
      .get(`${urls.RENPURL}/report/getTotalApprovedApplication1`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        console.log("approved", resp);
        setApprovedApplication(
          resp?.data?.dashboardDaoList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
              applicantName: r.applicantName,
              applicantNameMr: r.applicantNameMr,
            };
          })
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    axios
      .get(`${urls.RENPURL}/report/getTotalRejectedApplication1`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        console.log("rejected", resp);
        setRejectedApplication(
          resp?.data?.dashboardDaoList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
              applicantName: r.applicantName,
              applicantNameMr: r.applicantNameMr,
            };
          })
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    axios
      .get(`${urls.RENPURL}/report/getTotalPendingApplication1`,{
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        console.log("pending", resp);
        setPendingApplication(
          resp?.data?.dashboardDaoList?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
              applicantName: r.applicantName,
              applicantNameMr: r.applicantNameMr,
            };
          })
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getServiceName();
  }, []);

  useEffect(() => {
    getMyApplications();
  }, [serviceList]);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 90,
    },
    {
      field: "applicationNumber",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 270,
    },
    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="serviceName" />,
      width: 350,
    },
    {
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 220,
      valueFormatter: (params) => moment(params.value).format("DD-MM-YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicantName" />,
      width: 270,
    },

    {
      field: "applicationStatus",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicationStatus" />,
      width: 280,
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
                    ? "Road Excavation BRTS Applications Dashboard"
                    : "रस्ता उत्खनन बीआरटीएस ऍप्लिकेशन डॅशबोर्ड"}
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
                      <strong align="center">
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
                      <strong align="center">
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
                      <strong align="center">
                        {language == "en"
                          ? "Pending Application"
                          : "प्रलंबित अर्ज"}
                      </strong>
                    </div>
                    <Typography variant="h6" align="center" color="orange">
                      {pendingApplication?.length}
                    </Typography>
                  </div>

                  <div className={styles.jugaad}></div>

                  {/** Rejected Application */}
                  <div
                    className={styles.one}
                    onClick={() => setDataSource(rejectedApplication)}
                  >
                    <div className={styles.icono}>
                      <CancelIcon color="error" />
                    </div>
                    <br />
                    <div className={styles.icono}>
                      <strong align="center">
                        {language == "en"
                          ? "Rejected Application"
                          : "नाकारलेले अर्ज"}
                      </strong>
                    </div>
                    <Button onClick={() => setDataSource(rejectedApplication)}>
                      <Typography variant="h6" align="center" color="error">
                        {rejectedApplication.length}
                      </Typography>
                    </Button>
                  </div>

                  <div
                    className={styles.one}
                    // onClick={() => clerkTabClick('REJECTED')}
                  >
                    <Chart
                      options={{
                        chart: {
                          id: "basic-pie",
                        },
                        labels: [
                          "Rejected Application",
                          "Approved Application",
                          "Pending Application",
                        ],
                        responsive: [
                          {
                            breakpoint: 480,
                            options: {
                              chart: {
                                width: 200,
                              },
                              legend: {
                                position: "bottom",
                              },
                            },
                          },
                        ],
                      }}
                      series={[
                        rejectedApplication?.length,
                        approvedApplication?.length,
                        pendingApplication?.length,
                      ]}
                      type="pie"
                      width={400}
                      height={120}
                    />
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
          rows={dataSource}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7]}
        />
      </Box>
    </>
  );
};

export default Index;
