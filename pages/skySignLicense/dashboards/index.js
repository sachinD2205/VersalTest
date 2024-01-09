import BrushIcon from "@mui/icons-material/Brush";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import EventIcon from "@mui/icons-material/Event";
import PaidIcon from "@mui/icons-material/Paid";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
// import FormattedLabel from '../../../containers/reuseableComponents/FormattedLabel'
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import urls from "../../../URLS/urls";

import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

// Main Component - Clerk
const Index = () => {
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [dataSource, setDataSource] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  const [nmrauthority, setNmrAuthority] = useState([]);
  const [mbrauthority, setMbrAuthority] = useState([]);
  const [mmcauthority, setMmcAuthority] = useState([]);
  const [mmbcauthority, setMmbcAuthority] = useState([]);
  const [rmcauthority, setRmcAuthority] = useState([]);
  const [rmbcauthority, setRmbcAuthority] = useState([]);

  const [pendingApplication, setPendingApplication] = useState([]);
  const [rejectedApplication, setRejectedApplication] = useState([]);
  const [approvedApplication, setApprovedApplication] = useState([]);
  const [totalApplication, setTotalApplication] = useState([]);

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

  useEffect(() => {
    let nmr = user?.menus?.find((r) => r.serviceId == 10)?.roles;
    let rmc = user?.menus?.find((r) => r.serviceId == 11)?.roles;
    let mmc = user?.menus?.find((r) => r.serviceId == 12)?.roles;
    let rmbc = user?.menus?.find((r) => r.serviceId == 14)?.roles;
    let mmbc = user?.menus?.find((r) => r.serviceId == 15)?.roles;
    let mbr = user?.menus?.find((r) => r.serviceId == 67)?.roles;
    console.log("nmr", nmr);
    console.log("rmc", rmc);
    console.log("mmc", mmc);
    console.log("rmbc", rmbc);
    console.log("mmbc", mmbc);
    console.log("mbr", mbr);
    setNmrAuthority(nmr);
    setRmcAuthority(rmc);
    setMmcAuthority(mmc);
    setRmbcAuthority(rmbc);
    setMmbcAuthority(mmbc);
    setMbrAuthority(mbr);
  }, [user?.menus]);

  //
  let nmrcreated = [];
  let apptScheduled = [];
  let nmrclkVerified = [];
  let nmrcmolaKonte = [];
  let nmrcmoVerified = [];
  let nmrloiGenerated = [];
  let nmrpaymentCollected = [];
  let nmrcertificateIssued = [];
  let nmrcertificateGenerated = [];

  //marriage board
  let mbrcreated = [];
  let mbrclkVerified = [];
  let mbrcmolaKonte = [];
  let mbrcmoVerified = [];
  let mbrloiGenerated = [];
  let mbrpaymentCollected = [];
  let mbrcertificateGenerated = [];
  let mbrcertificateIssued = [];

  //modification of marriage
  let mmccreated = [];
  let mmcclkVerified = [];
  let mmccmolaKonte = [];
  let mmccmoVerified = [];
  let mmcloiGenerated = [];
  let mmcpaymentCollected = [];
  let mmccertificateIssued = [];
  let mmccertificateGenerated = [];

  //modification of marriage board
  let mmbccreated = [];
  let mmbcclkVerified = [];
  let mmbccmolaKonte = [];
  let mmbccmoVerified = [];
  let mmbcloiGenerated = [];
  let mmbcpaymentCollected = [];
  let mmbccertificateIssued = [];
  let mmbccertificateGenerated = [];

  //reissue of marriage
  let rmcpaymentCollected = [];

  //renewal of marriage board
  let rmbcpaymentCollected = [];

  //finalUnsorted datasource
  let finalMerged = [];

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
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
    axios
      .get(`${urls.SSLM}/Trn/SkySignetails/getAllData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        let tempTotal = resp?.data?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.id,
            serviceName: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceName,
            serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceNameMr,
          };
        });
        console.log("aala", tempTotal);

        setTotalApplication(tempTotal);

        setDataSource(tempTotal);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    axios
      .get(`${urls.SSLM}/Trn/SkySignetails/getApprove`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        setApprovedApplication(
          resp?.data?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
            };
          })
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    axios
      .get(`${urls.SSLM}/Trn/SkySignetails/getpending`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        setPendingApplication(
          resp?.data?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
            };
          })
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    axios
      .get(`${urls.SSLM}/Trn/SkySignetails/getReject`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        setRejectedApplication(
          resp?.data?.map((r, i) => {
            return {
              srNo: i + 1,
              ...r,
              id: r.id,
              serviceName: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceName,
              serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
                ?.serviceNameMr,
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
    getMyApplications();
  }, []);

  useEffect(() => {
    getMyApplications();
  }, [serviceList]);

  // useEffect(() => {
  //     setTotalApplication(dataSource.length)
  //     setPendingApplication(dataSource.length)
  // }, [dataSource])

  // Columns
  const columns = [
    {
      field: "srNo",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="srNo" />,
      // headerName: "Sr No.",
      width: 90,
    },
    {
      field: "applicationNumber",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicationNo" />,
      // headerName: "Application No",
      width: 270,
    },
    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="serviceNames" />,
      // headerName: "Service Name",
      width: 290,
    },
    {
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationDate" />,
      // headerName: "Application Date",
      width: 220,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicantName" />,
      // headerName: "Application Name",
      width: 270,
    },

    {
      field: "applicationStatus",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicationStatus" />,
      // headerName: "Application Status",
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
                    ? "Sky Sign and Industrial License"
                    : "आकाश चिन्ह आणि औद्योगिक परवाना"}
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
                      {totalApplication.length}
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
                      {approvedApplication.length}
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
                      {pendingApplication.length}
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
                    <Typography variant="h6" align="center" color="error">
                      {rejectedApplication.length}
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
