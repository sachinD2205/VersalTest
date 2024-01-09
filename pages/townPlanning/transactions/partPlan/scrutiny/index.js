// /marriageRegistration/transactions/newMarriageRegistration/scrutiny/index.js
import { Box, Button, IconButton, Paper } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import Loader from "../../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

// Table _ MR
const Index = (props) => {
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
  // let user = useSelector((state) => state.user.user);
  let created = [];
  let checklist = [];
  let apptScheduled = [];
  let clkVerified = [];
  let cmolaKonte = [];
  let cmoVerified = [];
  let loiGenerated = [];
  let cashier = [];
  let paymentCollected = [];
  let certificateGenerated = [];
  let certificateIssued = [];
  let merged = [];

  const router = useRouter();
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [loadderState, setLoadderState] = useState(true);
  const [serviceId, setServiceId] = useState(null);

  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find(
      (r) => r.id == selectedMenuFromDrawer,
    )?.serviceId;
    console.log("serviceId-<>", service);
    console.log("auth0000", auth);
    setAuthority(auth);
    setServiceId(service);
  }, [selectedMenuFromDrawer, user?.menus]);

  const issueCertificate = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      applicationId: record.id,
      role: "OUTPUT_GENERATION",
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  // const applyDigitalSignature = (record) => {
  //   const finalBody = {
  //     id: Number(record.id),
  //     ...record,
  //     applicationId: record.id,
  //     role: "APPLY_DIGITAL_SIGNATURE",
  //   };
  //   console.log("ads yetoy", record);
  //   saveApproval(finalBody);
  // };

  const saveApproval = (body) => {
    axios
      .post(`${urls.TPURL}/partplan/savepartplan`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 17,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (body.role === "OUTPUT_GENERATION") {
            router.push({
              pathname:
                "/townPlanning/transactions/partPlan/scrutiny/partMapLetter",
              query: {
                ...body,
              },
            });
          } else if (body.role === "OUTPUT_VERIFICATION") {
            //APPLY_DIGITAL_SIGNATURE
            router.push({
              pathname:
                "/townPlanning/transactions/partPlan/scrutiny/partMapLetter",
              query: {
                ...body,
              },
            });
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // // Get Table - Data
  const getNewMarriageRegistractionDetails = () => {
    console.log("loader", loadderState);
    // setLoadderState(true);
    console.log("userToken", user.token);
    axios
      .get(`${urls.TPURL}/partplan/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 17,
        },
      })
      .then((resp) => {
        setLoadderState(false);
        setTableData(
          resp?.data?.partPlanList?.map((r, i) => ({
            id: r.id,
            srNo: i + 1,
            applicationNumber: r.applicationNumber,
            firstNameEn: r.firstNameEn,
            applicationStatus: r.applicationStatus,
            applicantName: r.applicantName,
            applicantNameMr: r.applicantNameMr,
            applicationDate: r.applicationDate,
            activeFlag: r.activeFlag,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    console.log("authority", authority);
    if (authority) {
      getNewMarriageRegistractionDetails();
    }
  }, [authority]);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      // width: 70,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      // width: 260,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      // width: 130,
      flex: 1,
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="ApplicantName" />,
      // width: 240,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="statusDetails" />,
      // width: 280,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 300,
      // flex: 1,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        console.log("partplanscrutiny", record);
        return (
          <>
            <div className={styles.buttonRow}>
              {/* {record?.row?.applicationStatus === "APPLICATION_CREATED" && */}
              {["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("DOCUMENT_VERIFICATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/partPlan/scrutiny/scrutiny",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          // serviceId: record.row.serviceId,
                          serviceId: 17,
                          role: "DOCUMENT_VERIFICATION",
                          pageHeader: "CLERK VERIFICATION",
                        },
                      });
                    }}
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {language == "en"
                        ? "DOCUMENT VERIFICATION"
                        : "दस्तऐवज पडताळणी"}
                    </Button>
                  </IconButton>
                )}
              {/* SITE_VISIT_SCHEDULE */}
              {[
                "DOCUMENT_VERIFICATION_COMPLETED",

                "CITIZEN_SEND_BACK_TO_SR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                (authority?.includes("SITE_VISIT_SCHEDULE") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      // console.log("record?.row", record?.row);
                      // reset(record?.row);
                      // setValue("serviceName", record?.row?.serviceId);
                      // setValue("serviceId", record?.row?.serviceId);
                      // siteVisitScheduleOpen();

                      router.push({
                        pathname:
                          "/townPlanning/transactions/components/Schedule",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          applicationStatus: record.row.applicationStatus,
                          applicantName: record.row.applicantName,
                          applicationDate: record.row.applicationDate,
                          serviceId: 17,
                          role: "SITE_VISIT_SCHEDULE",
                          pageHeader: "SITE VISIT SCHEDULE",
                        },
                      });
                    }}
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {language == "en"
                        ? "SITE VISIT SCHEDULE"
                        : "साइट भेटीचे वेळापत्रक"}
                    </Button>
                  </IconButton>
                )}
              {/* SITE VISIT */}
              {["MEETING_SCHEDULED"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("SITE_VISIT") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          // "/townPlanning/transactions/developmentPlanOpinion/scrutiny/SiteVisit",
                          "/townPlanning/transactions/components/SiteVisitmain",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          // serviceId: record.row.serviceId,
                          serviceId: 17,
                          role: "SITE_VISIT",
                          pageHeader: "SITE VISIT",
                        },
                      });
                    }}
                  >
                    <Button variant="contained" size="small">
                      {/* {<FormattedLabel id="siteVisit" />} */}
                      {language == "en"?"Meeting":"बैठक"}
                    </Button>
                  </IconButton>
                )}
              {/* approval */}
              {[
                "SITE_VISIT_COMPLETED",
                "CITIZEN_SEND_BACK_TO_SR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                (authority?.includes("APPLICATION_APPROVAL") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/partPlan/scrutiny/scrutiny",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          // serviceId: record.row.serviceId,
                          serviceId: 17,
                          role: "APPLICATION_APPROVAL",
                          pageHeader: "APPLICATION APPROVAL",
                        },
                      });
                    }}
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {language == "en"
                        ? "APPLICATION APPROVAL"
                        : "अर्ज मंजूरी"}
                    </Button>
                  </IconButton>
                )}
              {/* FINAL_APPROVAL */}
              {[
                "APPLICATION_APPROVED",
                "CITIZEN_SEND_BACK_TO_SR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                (authority?.includes("FINAL_APPROVAL") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/partPlan/scrutiny/scrutiny",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          // serviceId: record.row.serviceId,
                          serviceId: 17,
                          role: "FINAL_APPROVAL",
                          pageHeader: "FINAL APPROVAL",
                        },
                      });
                    }}
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {language == "en" ? "FINAL APPROVAL" : "अंतिम मंजुरी"}
                    </Button>
                  </IconButton>
                )}

              {/* FINAL_APPROVED */}
              {["FINAL_APPROVED", "CITIZEN_SEND_BACK_TO_SR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("LOI_GENERATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/partPlan/scrutiny/LoiGenerationComponent",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          // serviceId: record.row.serviceId,
                          serviceId: 17,
                          role: "LOI_GENERATION",
                          pageHeader: "LOI GENERATION",
                        },
                      });
                    }}
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {language == "en"
                        ? "LOI GENERATION"
                        : "एलओआय उत्पन्न करा"}
                    </Button>
                  </IconButton>
                )}

              {/* LOI_COLLECTION */}
              {["LOI_GENERATED", "CITIZEN_SEND_BACK_TO_SR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("LOI_COLLECTION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/partPlan/scrutiny/PaymentCollection",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          // serviceId: record.row.serviceId,
                          serviceId: 17,
                          role: "LOI_COLLECTION",
                          pageHeader: "LOI COLLECTION",
                        },
                      });
                    }}
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {language == "en" ? "PAYMENT" : "पेमेंट"}
                    </Button>
                  </IconButton>
                )}

              {/* output genration */}
              {[
                "PAYEMENT_SUCCESSFULL",
                "CITIZEN_SEND_BACK_TO_SR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                (authority?.includes("OUTPUT_GENERATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton>
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => issueCertificate(record.row)}
                    >
                      {language == "en" ? "OUTPUT GENERATION" : "आउटपुट जनरेशन"}
                    </Button>
                  </IconButton>
                )}
              {/* output verification */}
              {["OUTPUT_GENERATED", "CITIZEN_SEND_BACK_TO_SR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("OUTPUT_VERIFICATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton>
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => issueCertificate(record.row)}
                    >
                      {language == "en"
                        ? "OUTPUT VERIFICATION"
                        : "आउटपुट पडताळणी"}
                    </Button>
                  </IconButton>
                )}

              {/* apply digital */}
              {["OUTPUT_VERIFIED"].includes(record?.row?.applicationStatus) &&
                (authority?.includes("APPLY_DIGITAL_SIGNATURE") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton>
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => applyDigitalSignature(record.row)}
                    >
                      {language == "en"
                        ? "APPLY DIGITAL SIGNATURE"
                        : "आउटपुट पडताळणी"}
                    </Button>
                  </IconButton>
                )}
              {/* download certificate */}
              {["SIGNATURE_APPLIED"].includes(record?.row?.applicationStatus) &&
                (authority?.includes("DOWNLOAD_CERTIFICATE") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton>
                    <Button
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => issueCertificate(record.row)}
                    >
                      {language == "en"
                        ? "DOWNLOAD CERTIFICATE"
                        : "आउटपुट पडताळणी"}
                    </Button>
                  </IconButton>
                )}
            </div>
          </>
        );
      },
    },
  ];
  useEffect(() => {}, [loadderState]);
  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      {loadderState ? (
        <Loader />
      ) : (
        <Paper
          sx={{
            marginLeft: 1,
            marginRight: 1,
            marginTop: 1,
            marginBottom: 10,
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
                {/* Part Map */}
                {<FormattedLabel id="partMap" />}
              </h2>
            </div>
          </div>

          <DataGrid
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            rowHeight={70}
            sx={{
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 15,
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
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Paper>
      )}
    </>
  );
};
export default Index;
