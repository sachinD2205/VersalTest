import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import WcIcon from "@mui/icons-material/Wc";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import urls from "../../../URLS/urls";
// Main Component - Clerk
const Index = () => {
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);

  const [dataSource, setDataSource] = useState([]);

  const [dataSourcei, setDataSourceI] = useState([]);
  const [dataSourcer, setDataSourceR] = useState([]);
  const [dataSourcea, setDataSourceA] = useState([]);
  const [dataSourcet, setDataSourceT] = useState([]);

  const [serviceList, setServiceList] = useState([]);

  const [pendingApplication, setPendingApplication] = useState(0);
  const [rejectedApplication, setRejectedApplication] = useState(0);
  const [approvedApplication, setApprovedApplication] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);

  const getServiceName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceList(r.data.service);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  const getMyApplications = async () => {
    let incoming = [];
    let rejected = [];
    let approved = [];
    //incoming
    axios
      .get(`${urls.SPURL}/report/getDashboardDtlNew`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          whichOne: "INCOMING",
        },
      })
      .then((resp) => {
        console.log("5645", resp);
        incoming = resp.data.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.applicationId,
            serviceName: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceName,
            serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceNameMr,
          };
        });
        setDataSource(incoming);
        setDataSourceI(incoming);
        setPendingApplication(incoming.length);
      });

    //revert
    axios
      .get(`${urls.SPURL}/report/getDashboardDtlNew`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          whichOne: "REVERT",
        },
      })
      .then((resp) => {
        rejected = resp.data.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.applicationId,
            serviceName: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceName,
            serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceNameMr,
          };
        });
        setDataSourceR(rejected);
        setRejectedApplication(rejected.length);
      });
    //approved
    axios
      .get(`${urls.SPURL}/report/getDashboardDtlNew`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          whichOne: "APPROVED",
        },
      })
      .then((resp) => {
        approved = resp.data.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.applicationId,
            serviceName: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceName,
            serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
              ?.serviceNameMr,
          };
        });
        setDataSourceA(approved);
        setApprovedApplication(approved.length);
      });

    console.log(
      "Total Applications",
      incoming.length + rejected.length + approved.length
    );
    setTotalApplication(incoming.length + rejected.length + approved.length);
  };

  useEffect(() => {
    getServiceName();
  }, []);

  useEffect(() => {
    getMyApplications();
  }, [serviceList]);

  useEffect(() => {
    console.log(
      "Total Applications GG",
      dataSourcei.length + dataSourcer.length + dataSourcea.length
    );
    let total = dataSourcei.length + dataSourcer.length + dataSourcea.length;
    let totalApplicationInDS = [...dataSourcei, ...dataSourcea, ...dataSourcer];

    setTotalApplication(total);

    console.log("dataSourcei", dataSourcei);
    console.log("dataSourcer", dataSourcer);
    console.log("dataSourcea", dataSourcea);
    console.log("dataSourcet", totalApplicationInDS);

    setDataSourceT(
      totalApplicationInDS.map((r, i) => {
        return {
          ...r,
          srNo: i + 1,
          id: r.applicationId,
          serviceName: serviceList.find((s) => s.id == r.serviceId)
            ?.serviceName,
          serviceNameMr: serviceList.find((s) => s.id == r.serviceId)
            ?.serviceNameMr,
        };
      })
    );
  }, [dataSourcei, dataSourcer, dataSourcea]);

  // useEffect(() => {

  // setTotalApplication(dataSource.filter((d) => nmrstatuses.includes(d.applicationStatus)).length);

  // setPendingApplication(dataSource.filter((d) => nmrstatuses.includes(d.applicationStatus)).length);

  // }, [dataSource]);

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
      width: 290,
    },
    {
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 130,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 270,
    },

    {
      field: "applicationStatus",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
    },
  ];
  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
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
            {/* <Grid item xs={12}>
              <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                <b>{language == "en" ? "Sports Booking System Dashboard" : "खेळ नोंदणी प्रणाली डॅशबोर्ड"}</b>
              </h2>
            </Grid> */}
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
                  // onClick={() => clerkTabClick('TotalApplications')}
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
                    <Button onClick={() => setDataSource(dataSourcet)}>
                      <Typography variant="h6" align="center" color="secondary">
                        {totalApplication}
                      </Typography>
                    </Button>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Approved Application */}
                  <div
                    className={styles.one}
                  // onClick={() => clerkTabClick('APPROVED')}
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
                    <Button onClick={() => setDataSource(dataSourcea)}>
                      <Typography variant="h6" align="center" color="green">
                        {approvedApplication}
                      </Typography>
                    </Button>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Pending Applications */}
                  <div
                    className={styles.one}
                  // onClick={() => clerkTabClick('PENDING')}
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
                    <Button onClick={() => setDataSource(dataSourcei)}>
                      <Typography variant="h6" align="center" color="orange">
                        {pendingApplication}
                      </Typography>
                    </Button>
                  </div>

                  {/** Vertical Line */}
                  <div className={styles.jugaad}></div>

                  {/** Rejected Application */}
                  <div
                    className={styles.one}
                  // onClick={() => clerkTabClick('REJECTED')}
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
                    <Button onClick={() => setDataSource(dataSourcer)}>
                      <Typography variant="h6" align="center" color="error">
                        {rejectedApplication}
                      </Typography>
                    </Button>
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
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          rowHeight={70}
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

      {/* <Box
        style={{
          backgroundColor: "white",
          height: "auto",
          width: "auto",
          overflow: "auto",
        }}
      >
        <DataGrid
          rowHeight={70}
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
      </Box> */}
    </>
  );
};

export default Index;
