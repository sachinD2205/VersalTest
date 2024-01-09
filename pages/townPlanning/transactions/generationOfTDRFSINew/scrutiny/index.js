// /marriageRegistration/transactions/newMarriageRegistration/scrutiny/index.js
import {
  Box,
  Button,
  CssBaseline,
  Grid,
  IconButton,
  Modal,
  Paper,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import SiteVisitScheduleTP from "../../../../../components/townPlanning/SiteVisitScheduleTP";
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

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });
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
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [authority, setAuthority] = useState([]);
  const [tableData, setTableData] = useState([]);
  let user = useSelector((state) => state.user.user);
  let language = useSelector((state) => state.labels.language);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [loadderState, setLoadderState] = useState(true);
  const [serviceId, setServiceId] = useState(null);
  const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);

  // site Schedule Modal
  const siteVisitScheduleOpen = () => setSiteVisitScheduleModal(true);
  const siteVisitScheduleClose = () => setSiteVisitScheduleModal(false);

  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find(
      (r) => r.id == selectedMenuFromDrawer,
    )?.serviceId;
    console.log("serviceId-<>", serviceId);
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

  const saveApproval = (body) => {
    axios
      .post(`${urls.TPURL}/developmentPlanOpinion/saveApplication`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 19,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (body.role === "OUTPUT_GENERATION") {
            router.push({
              pathname:
                "/townPlanning/transactions/developmentPlanOpinion/scrutiny/OutputGenrationLetter",
              query: {
                ...body,
              },
            });
          } else if (body.role === "OUTPUT_VERIFICATION") {
            router.push({
              pathname:
                "/townPlanning/transactions/developmentPlanOpinion/scrutiny/OutputGenrationLetter",
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
  const getTdrFsiAllData = () => {
    console.log("loader", loadderState);
    // setLoadderState(true);
    console.log("userToken", user.token);
    axios
      .get(`${urls.TPURL}/generationTdrFsi/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          serviceId: 21,
        },
      })
      .then((resp) => {
        setLoadderState(false);
        console.log("resp", resp);
        setTableData(
          resp?.data?.generationTdrFsiDao?.map((r, i) => ({
            ...r,
            id: r.id,
            srNo: i + 1,
            applicationNumber: r.applicationNumber,
            applicantName: r.applicantNameEn,
            applicantNameMr: r.applicantNameMr,
            applicationStatus: r.applicationStatus,
            activeFlag: r.activeFlag,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    console.log("authority333", authority);
    if (authority) {
      getTdrFsiAllData();
    }
  }, [authority]);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 30,
      // flex: 1,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 160,
      // flex: 1,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 130,
      // flex: 1,
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 240,
      // flex: 1,
      headerAlign: "center",
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
      // flex: 1,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 500,
      // flex: 1,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {/* {record?.row?.applicationStatus === "APPLICATION_CREATED" && */}
              {[
                "APPLICATION_CREATED",
                "SENT_BACK_TO_SURVEYOR",
                "CITIZEN_SEND_TO_JR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                authority?.includes("SURVEYOR_SITE_VISIT_SCHEDULE") && (
                  //  ||
                  // authority?.includes("REMEETING_SCHEDULE") ||
                  // authority?.includes("ADMIN")
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/generationOfTDRFSINew/scrutiny/SiteVisitScheduleTdrFsi",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          applicationStatus: record.row.applicationStatus,
                          applicantName: record.row.applicantName,
                          applicantNameMr: record.row.applicantNameMr,
                          applicationDate: record.row.applicationDate,
                          serviceId: 21,
                          role: "MEETING_SCHEDULE",
                          pageHeader: "MEETING SCHEDULE",
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
                        ? "Schedule Site Visit"
                        : "साइट भेटीचे वेळापत्रक"}
                    </Button>
                  </IconButton>
                )}
              {[
                "SURVEYOR_SITE_VISIT_SCHEDULED",
                "SURVEYOR_SITE_VISIT_RESCHEDULED",
                // "CITIZEN_SEND_TO_JR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                authority?.includes("SURVEYOR_SITE_VISIT_RESCHEDULE") && (
                  //  ||
                  // authority?.includes("REMEETING_SCHEDULE") ||
                  // authority?.includes("ADMIN")
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/generationOfTDRFSINew/scrutiny/SiteVisitScheduleTdrFsi",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          applicationStatus: record.row.applicationStatus,
                          applicantName: record.row.applicantName,
                          applicantNameMr: record.row.applicantNameMr,
                          applicationDate: record.row.applicationDate,
                          serviceId: 21,
                          role: "MEETING_SCHEDULE",
                          pageHeader: "MEETING SCHEDULE",
                          siteVisitMode: "Reschedule",
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
                        ? "Reschedule Site Visit"
                        : "साइटला भेट रीशेड्युल करा"}
                    </Button>
                  </IconButton>
                )}

              {[
                "SURVEYOR_SITE_VISIT_SCHEDULED",
                "SURVEYOR_SITE_VISIT_RESCHEDULED",

                // "SENT_BACK_TO_SURVEYOR",
                // "CITIZEN_SEND_TO_JR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                authority?.includes("SURVEYOR_SITE_VISIT_RESCHEDULE") && (
                  //  ||
                  // authority?.includes("REMEETING_SCHEDULE") ||
                  // authority?.includes("ADMIN")
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/generationOfTDRFSINew/scrutiny/scrutiny",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          applicationStatus: record.row.applicationStatus,
                          applicantName: record.row.applicantName,
                          applicantNameMr: record.row.applicantNameMr,
                          applicationDate: record.row.applicationDate,
                          serviceId: 21,
                          action: "SiteVisit",
                          // role: "MEETING_SCHEDULE",
                          // pageHeader: "MEETING SCHEDULE",
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
                      {language == "en" ? "Site Visit" : "साइटला भेट द्या"}
                    </Button>
                  </IconButton>
                )}

              {/* ******************************for 2nd site visit*********************************** */}
              {[
                "JE_SITE_VISIT_RESCHEDULED",
                "JE_SITE_VISIT_SCHEDULED",
                // "SENT_BACK_TO_SURVEYOR",
                // "CITIZEN_SEND_TO_JR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                (authority?.includes("JE_SITE_VISIT_ENTRY") ||
                  authority?.includes("JE_SITE_VISIT_SCHEDULE")) && (
                  //  ||
                  // authority?.includes("REMEETING_SCHEDULE") ||
                  // authority?.includes("ADMIN")
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/generationOfTDRFSINew/scrutiny/scrutiny",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          applicationStatus: record.row.applicationStatus,
                          applicantName: record.row.applicantName,
                          applicantNameMr: record.row.applicantNameMr,
                          applicationDate: record.row.applicationDate,
                          serviceId: 21,
                          action: "SiteVisit",
                          site: "JESiteVisit",
                          // role: "MEETING_SCHEDULE",
                          // pageHeader: "MEETING SCHEDULE",
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
                      {language == "en" ? "Site Visit" : "साइटला भेट द्या"}
                    </Button>
                  </IconButton>
                )}

              {/* approval */}
              {[
                "SURVEYOR_SITE_VISIT_COMPLETED",
                "DOCUMENTS_CORRECTED",
              ].includes(record?.row?.applicationStatus) &&
                (authority?.includes("DOCUMENT_VERIFICATION") ||
                  // authority?.includes("ADP") ||
                  // authority?.includes("ADTP") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/generationOfTDRFSINew/scrutiny/scrutiny",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          applicationStatus: record.row.applicationStatus,
                          applicantName: record.row.applicantName,
                          applicantNameMr: record.row.applicantNameMr,
                          applicationDate: record.row.applicationDate,
                          serviceId: 21,
                          pageHeader: "VERIFICATION",
                          mode: "DOCUMENT_VERIFICATION",
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

              {["DOCUMENT_VERIFICATION_COMPLETED"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("DOCUMENT_VERIFICATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/generationOfTDRFSINew/scrutiny/SiteVisitScheduleTdrFsi",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          applicationStatus: record.row.applicationStatus,
                          applicantName: record.row.applicantName,
                          applicantNameMr: record.row.applicantNameMr,
                          applicationDate: record.row.applicationDate,
                          serviceId: 21,
                          role: "MEETING_SCHEDULE",
                          pageHeader: "MEETING SCHEDULE",
                          site: "JrSiteVisit",
                          // siteVisitMode: "Reschedule"
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
                        ? "Site Visit Schedule"
                        : "साइट भेटीचे वेळापत्रक"}
                    </Button>
                  </IconButton>
                )}
              {[
                "JE_SITE_VISIT_SCHEDULED",
                "JE_SITE_VISIT_RESCHEDULED",
              ].includes(record?.row?.applicationStatus) &&
                (authority?.includes("DOCUMENT_VERIFICATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/generationOfTDRFSINew/scrutiny/SiteVisitScheduleTdrFsi",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          applicationStatus: record.row.applicationStatus,
                          applicantName: record.row.applicantName,
                          applicantNameMr: record.row.applicantNameMr,
                          applicationDate: record.row.applicationDate,
                          serviceId: 21,
                          role: "MEETING_SCHEDULE",
                          pageHeader: "MEETING SCHEDULE",
                          siteVisitMode: "Reschedule",
                          site: "JrSiteVisit",
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
                        ? "Site Visit ReSchedule"
                        : "साइट भेटीचे वेळापत्रक"}
                    </Button>
                  </IconButton>
                )}

              {/* FINAL_APPROVAL */}
              {/* {[
                  "APPLICATION_APPROVED",
                  "CITIZEN_SEND_BACK_TO_SR_CLERK",
                ].includes(record?.row?.applicationStatus) &&
                  (authority?.includes("FINAL_APPROVAL") ||
                    authority?.includes("ADMIN")) && (
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/townPlanning/transactions/developmentPlanOpinion/scrutiny/scrutiny",
                          query: {
                            pageMode: "View",
                            disabled: true,
                            applicationId: record.row.id,
                         
                            serviceId: 19,
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
                        FINAL APPROVAL
                      </Button>
                    </IconButton>
                  )} */}

              {/* FINAL_APPROVED */}
              {/* {["FINAL_APPROVED", "CITIZEN_SEND_BACK_TO_SR_CLERK"].includes(
                  record?.row?.applicationStatus,
                ) &&
                  (authority?.includes("LOI_GENERATION") ||
                    authority?.includes("ADMIN")) && (
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/townPlanning/transactions/developmentPlanOpinion/scrutiny/LoiGenerationComponent",
                          query: {
                            pageMode: "View",
                            disabled: true,
                            applicationId: record.row.id,
                            // serviceId: record.row.serviceId,
                            serviceId: 19,
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
                        LOI GENERATION
                      </Button>
                    </IconButton>
                  )} */}

              {/* LOI_VERIFICATION */}

              {["LOI_GENERATED", "CITIZEN_SEND_BACK_TO_SR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("LOI_VERIFICATION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/developmentPlanOpinion/scrutiny/LoiGenerationComponent",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          // serviceId: record.row.serviceId,
                          serviceId: 19,
                          role: "LOI_VERIFICATION",
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
                      {language == "en" ? "LOI VERIFICATION" : "LOI पडताळणी"}
                    </Button>
                  </IconButton>
                )}

              {["LOI_VERIFIED", "CITIZEN_SEND_BACK_TO_SR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("LOI_COLLECTION") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() => {
                      router.push({
                        pathname:
                          "/townPlanning/transactions/developmentPlanOpinion/scrutiny/PaymentCollection",
                        query: {
                          pageMode: "View",
                          disabled: true,
                          applicationId: record.row.id,
                          // serviceId: record.row.serviceId,
                          serviceId: 19,
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

              {/* LOI_COLLECTION */}
              {/* {[
                  "PAYEMENT_SUCCESSFULL",
                  "CITIZEN_SEND_BACK_TO_SR_CLERK",
                ].includes(record?.row?.applicationStatus) &&
                  (authority?.includes("OUTPUT_GENERATION") ||
                    authority?.includes("ADMIN")) && (
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname:
                            "/townPlanning/transactions/developmentPlanOpinion/scrutiny/OutputGenrationLetter",
                          query: {
                            pageMode: "View",
                            disabled: true,
                            applicationId: record.row.id,
                            // serviceId: record.row.serviceId,
                            serviceId: 19,
                            role: "OUTPUT_GENERATION",
                            pageHeader: "OUTPUT GENERATION",
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
                        OUTPUT GENERATION
                      </Button>
                    </IconButton>
                  )} */}

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
                (authority?.includes("DEPUTY_ENGINEER") ||
                  authority?.includes("ADP") ||
                  authority?.includes("ADTP") ||
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
                        : "आउटपुट सत्यापन"}
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
        <>
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
                  {language == "en"
                    ? "Generate Of TDR / FSI"
                    : "TDR/FSI व्युत्पन्न करा"}
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

          {/** Site Visit Schedule Modal OK*/}
          <Modal
            open={siteVisitScheduleModal}
            onClose={() => siteVisitScheduleClose()}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 5,
            }}
          >
            <Paper
              sx={{
                padding: 2,
                height: "600px",
                width: "800px",
              }}
              elevation={5}
              component={Box}
            >
              <CssBaseline />
              <SiteVisitScheduleTP
                appID={getValues("id")}
                serviceId={getValues("serviceId")}
              />
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => siteVisitScheduleClose()}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Modal>
        </>
      )}
    </>
  );
};
export default Index;
