// /marriageRegistration/transactions/newMarriageRegistration/scrutiny/index.js
import BrushIcon from "@mui/icons-material/Brush";
import CheckIcon from "@mui/icons-material/Check";
import EventIcon from "@mui/icons-material/Event";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import urls from "../../../../../URLS/urls";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
// Table _ MR
const Index = () => {
  let created = [];
  let checklist = [];
  let apptScheduled = [];
  let clkVerified = [];
  let cmolaKonte = [];
  let cmoVerified = [];
  let loiGenerated = [];
  let downloadcertificate = [];
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
  const [loadderState, setLoadderState] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  //error
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
  const [newMarriageData, setNewMarriageData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
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

  // Get Table - Data
  const getNewMarriageRegistractionDetails = (_pageSize = 10, _pageNo = 0) => {
    console.log("loader", loadderState);
    // setLoadderState(true);

    console.log("userToken", user.token);
    if (serviceId == 10) {
      axios
        .get(
          // `${urls.MR}/transaction/applicant/getapplicantDetails?serviceId=${serviceId}`,
          `${urls.MR}/transaction/applicant/paginationAgainsrService`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            params: {
              serviceId: serviceId,
              pageSize: _pageSize,
              pageNo: _pageNo,
            },
          },
        )
        .then((resp) => {
          setNewMarriageData({
            rows: resp.data.applicant,
            totalRows: resp.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: resp.data.pageSize,
            page: resp.data.pageNo,
          });
          setLoadderState(false);
          if (
            authority.includes("DOCUMENT_CHECKLIST") ||
            authority.includes("ADMIN")
          ) {
            console.log("APPLICATION_CREATED");
            created = resp.data.applicant.filter((data) =>
              ["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(
                data.applicationStatus,
              ),
            );
          }

          if (
            authority?.find(
              (r) =>
                ["APPOINTMENT_SCHEDULE"].includes(r) ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            console.log("APPOINTMENT_SCHEDULE");
            clkVerified = resp.data.applicant.filter(
              (data) =>
                data.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK",
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "DOCUMENT_VERIFICATION" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            console.log("DOCUMENT_VERIFICATION");
            apptScheduled = resp.data.applicant.filter((data) =>
              [
                "APPOINTMENT_SCHEDULED",
                "CMO_SENT_BACK_TO_SR_CLERK",
                "CITIZEN_SEND_BACK_TO_SR_CLERK",
              ].includes(data.applicationStatus),
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "FINAL_APPROVAL" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cmolaKonte = resp.data.applicant.filter(
              (data) => data.applicationStatus === "CERTIFICATE_GENERATED",
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "LOI_GENERATION" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cmoVerified = resp.data.applicant.filter(
              (data) => data.applicationStatus === "FINAL_APPROVED",
            );
          }

          if (
            authority?.find(
              (r) => r === "CASHIER" || authority?.find((r) => r === "ADMIN"),
            )
          ) {
            cashier = resp.data.applicant.filter(
              (data) => data.applicationStatus === "LOI_GENERATED",
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "CERTIFICATE_ISSUER" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            loiGenerated = resp.data.applicant.filter(
              (data) => data.applicationStatus === "PAYEMENT_SUCCESSFULL",
            );
          }

          if (
            authority?.find(
              (r) =>
                r === "DOWNLOAD_CERTIFICATE" ||
                authority?.find((r) => r === "ADMIN"),
            )
          ) {
            downloadcertificate = resp.data.applicant.filter(
              (data) => data.applicationStatus === "CERTIFICATE_ISSUED",
            );
          }

          // if (
          //   authority?.find(
          //     (r) =>
          //       r === "APPLY_DIGITAL_SIGNATURE" ||
          //       authority?.find((r) => r === "ADMIN")
          //   )
          // ) {
          //   certificateIssued = resp.data.applicant.filter(
          //     (data) => data.applicationStatus === "CERTIFICATE_GENERATED"
          //   );
          // }

          merged = [
            ...created,
            ...checklist,
            ...apptScheduled,
            ...clkVerified,
            ...cmolaKonte,
            ...cmoVerified,
            ...loiGenerated,
            ...downloadcertificate,
            ...cashier,
            ...paymentCollected,
            ...certificateGenerated,
            // ...certificateIssued,
          ];

          console.log("created", created);
          console.log("checklist", checklist);
          console.log("apptScheduled", apptScheduled);
          console.log("clkVerified", clkVerified);
          console.log("cmoVerified", cmoVerified);
          console.log("loiGenerated", loiGenerated);
          console.log("downloadcertificate", downloadcertificate);
          console.log("paymentCollected", paymentCollected);
          console.log("certificateIssued", certificateIssued);
          console.log("certificateGenerated", certificateGenerated);
          console.log("merged", merged);

          setTableData(
            merged.map((r, i) => {
              return {
                srNo: i + 1,
                ...r,
              };
            }),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    console.log("authority", authority);
    if (authority) {
      getNewMarriageRegistractionDetails();
    }
  }, [authority]);

  const viewLOI = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      role: "LOI_GENERATION",
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const issueCertificate = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      applicationId: record.id,
      role: "CERTIFICATE_ISSUER",
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const applyDigitalSignature = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      applicationId: record.id,
      role: "APPLY_DIGITAL_SIGNATURE",
    };
    console.log("ads yetoy", record);
    saveApproval(finalBody);
  };

  const saveApproval = (body) => {
    axios
      .post(`${urls.MR}/transaction/applicant/saveApplicationApprove`, body, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          if (body.role === "LOI_GENERATION") {
            router.push({
              pathname:
                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationReciptmarathi",
              query: {
                ...body,
              },
            });
          } else if (body.role === "CERTIFICATE_ISSUER") {
            router.push({
              pathname: "/marriageRegistration/reports/marriageCertificateNew",
              query: {
                ...body,
                // role: "CERTIFICATE_ISSUER",
              },
            });
          } else if (body.role === "APPLY_DIGITAL_SIGNATURE") {
            router.push({
              pathname: "/marriageRegistration/reports/marriageCertificateNew",
              query: {
                ...body,
                // role: "CERTIFICATE_ISSUER",
              },
            });
          }
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // let minDate = new Date();
  // const isDateInRange = (minDate) => {
  //   // console.log("Baiiiii", moment(new Date()).format("YYYY-MM-DD") <= minDate);
  //   // console.log("aajchi tarikh ", moment(new Date()).format("YYYY-MM-DD"));
  //   // console.log("appt schedule", minDate);

  //   const firstDate = new Date();
  //   // const formatDate = moment(firstDate).format("YYYY-MM-DD");
  //   const secondDate = new Date(minDate);
  //   console.log("dattteee", firstDate == secondDate);
  //   return firstDate == secondDate;
  // };

  function isDateInRange(record) {
    // console.log("record", record);
    // console.log("result", new Date() == new Date(record?.row?.appointmentDate));

    // return new Date() == new Date(record?.row?.appointmentDate);
    if (record?.row?.applicationStatus == "APPOINTMENT_SCHEDULED") {
      const firstDate = moment(new Date()).format("YYYY-MM-DD");
      const secondDate =
        record?.row?.appointmentScheduleReschDao?.appointmentDate;

      console.log("firstDate", firstDate);
      console.log("secondDate", secondDate);
      console.log("dattteee", firstDate == secondDate);
      return firstDate == secondDate;
    }
  }

  // Columnss
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 70,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 260,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 130,
      headerAlign: "center",
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="ApplicantName" />,
      width: 240,
      headerAlign: "center",
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="statusDetails" />,
      width: 280,
      headerAlign: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 700,
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <div className={styles.buttonRow}>
              {/* {record?.row?.applicationStatus === "APPLICATION_CREATED" && */}
              {["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(
                record?.row?.applicationStatus,
              ) &&
                (authority?.includes("DOCUMENT_CHECKLIST") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton
                    onClick={() =>
                      router.push({
                        pathname:
                          "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny",
                        query: {
                          disabled: true,
                          applicationId: record.row.id,
                          serviceId: record.row.serviceId,
                          // ...record.row,
                          role: "DOCUMENT_CHECKLIST",
                          pageMode: "DOCUMENT CHECKLIST",
                          pageModeMr: "कागदपत्र तपासणी",
                          pageHeader: "DOCUMENT CHECKLIST",
                          pageHeaderMr: "कागदपत्र तपासणी",
                        },
                      })
                    }
                  >
                    <Button
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      variant="contained"
                      color="primary"
                    >
                      {language == "en"
                        ? "DOCUMENT CHECKLIST"
                        : "दस्तऐवज चेकलिस्ट"}
                    </Button>
                  </IconButton>
                )}

              {/* {record?.row?.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK" && */}
              {[
                "APPLICATION_SENT_TO_SR_CLERK",
                "CITIZEN_SEND_BACK_TO_SR_CLERK",
              ].includes(record?.row?.applicationStatus) &&
                (authority?.includes("APPOINTMENT_SCHEDULE") ||
                  authority?.includes("ADMIN")) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<EventIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slotAutoNew`,
                          // pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slot`,
                          // pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/MeetingSchedule`,
                          query: {
                            appId: record.row.id,
                            role: "APPOINTMENT_SCHEDULE",
                            zoneKey: record.row.zoneKey,
                          },
                        })
                      }
                    >
                      {language == "en" ? "SCHEDULE" : "वेळापत्रक"}
                    </Button>
                  </IconButton>
                )}
              {/* {record?.row?.applicationStatus === "APPOINTMENT_SCHEDULED" && */}
              {!isDateInRange(record) ? (
                <>
                  {[
                    "APPOINTMENT_SCHEDULED",
                    "APPLICATION_SENT_TO_SR_CLERK",
                    "CITIZEN_SEND_BACK_TO_SR_CLERK",
                  ].includes(record?.row?.applicationStatus) &&
                    (authority?.includes("APPOINTMENT_SCHEDULE") ||
                      authority?.includes("ADMIN")) && (
                      <IconButton>
                        <Button
                          variant="contained"
                          endIcon={<EventIcon />}
                          style={{
                            height: "30px",
                            width: "250px",
                          }}
                          onClick={() =>
                            router.push({
                              pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slotAutoNew`,
                              // pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/MeetingSchedule`,
                              query: {
                                appId: record.row.id,
                                role: "APPOINTMENT_SCHEDULE",
                                zoneKey: record.row.zoneKey,
                              },
                            })
                          }
                        >
                          {language == "en" ? "RESCHEDULE" : "पुन्हा वेळापत्रक"}
                        </Button>
                      </IconButton>
                    )}
                </>
              ) : (
                <>
                  {[
                    "CMO_SENT_BACK_TO_SR_CLERK",
                    "APPOINTMENT_SCHEDULED",
                  ].includes(record?.row?.applicationStatus) &&
                    authority?.find(
                      (r) => r === "DOCUMENT_VERIFICATION" || r === "ADMIN",
                    ) && (
                      <>
                        <IconButton>
                          <Button
                            variant="contained"
                            endIcon={<CheckIcon />}
                            style={{
                              height: "30px",
                              width: "250px",
                            }}
                            onClick={() =>
                              router.push({
                                pathname:
                                  "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny",
                                query: {
                                  ...record.row,
                                  applicationId: record.row.id,
                                  serviceId: record.row.serviceId,

                                  role: "DOCUMENT_VERIFICATION",
                                  pageMode: "APPLICATION VERIFICATION",
                                  pageModeMr: "अर्ज पडताळणी",
                                  pageHeader: "APPLICATION VERIFICATION",
                                  pageHeaderMr: "अर्ज पडताळणी",
                                },
                              })
                            }
                          >
                            {language == "en"
                              ? "CLERK VERIFY"
                              : "लिपिक पडताळणी"}
                          </Button>
                        </IconButton>
                      </>
                    )}
                </>
              )}
              {/* {["CMO_SENT_BACK_TO_SR_CLERK", "APPOINTMENT_SCHEDULED"].includes(
                record?.row?.applicationStatus,
              ) &&
                authority?.find(
                  (r) => r === "DOCUMENT_VERIFICATION" || r === "ADMIN",
                ) && (
                  <>
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<CheckIcon />}
                        style={{
                          height: "30px",
                          width: "250px",
                        }}
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny",
                            query: {
                              ...record.row,
                              applicationId: record.row.id,
                              serviceId: record.row.serviceId,

                              role: "DOCUMENT_VERIFICATION",
                              pageMode: "APPLICATION VERIFICATION",
                              pageModeMr: "अर्ज पडताळणी",
                              pageHeader: "APPLICATION VERIFICATION",
                              pageHeaderMr: "अर्ज पडताळणी",
                            },
                          })
                        }
                      >
                        {language == "en" ? "CLERK VERIFY" : "लिपिक पडताळणी"}
                      </Button>
                    </IconButton>
                  </>
                )} */}

              {/* {record?.row?.applicationStatus === "APPLICATION_SENT_TO_CMO" && */}
              {["CERTIFICATE_GENERATED"].includes(
                record?.row?.applicationStatus,
              ) &&
                authority?.find(
                  (r) => r === "FINAL_APPROVAL" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<CheckIcon />}
                      style={{
                        height: "30px",
                        width: "320px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny",
                          query: {
                            ...record.row,
                            applicationId: record.row.id,
                            serviceId: record.row.serviceId,
                            role: "FINAL_APPROVAL",
                            pageMode: "FINAL VERIFICATION",
                            pageModeMr: "अंतिम पडताळणी",
                            pageHeader: "FINAL VERIFICATION",
                            pageHeaderMr: "अंतिम पडताळणी",
                          },
                        })
                      }
                    >
                      {language == "en"
                        ? "CMO/ MARRIAGE REGISTRAR VERIFY"
                        : "सी एम ओ / विवाह निबंधक सत्यापित करा"}
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "FINAL_APPROVED" &&
                authority?.find(
                  (r) => r === "LOI_GENERATION" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<BrushIcon />}
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      //  color="success"
                      // onClick={() => viewLOI(record.row)}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationComponent",
                          query: {
                            // ...record.row,
                            applicationId: record.row.id,
                            serviceId: record.row.serviceId,
                            // loiServicecharges: null,
                            role: "LOI_GENERATION",
                          },
                        })
                      }
                    >
                      {language == "en" ? "GENERATE LOI" : "LOI व्युत्पन्न करा"}
                    </Button>
                  </IconButton>
                )}

              {/* provisonal */}
              {record?.row?.applicationStatus === "FINAL_APPROVED" &&
                authority?.find(
                  (r) => r === "LOI_GENERATION" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "220px",
                      }}
                      color="success"
                      onClick={() => {
                        router.push({
                          pathname:
                            "/marriageRegistration/reports/marriageCertificatePro",
                          query: {
                            applicationId: record.row.id,
                            serviceId: record.row.serviceId,

                            // ...params.row,
                          },
                        });
                      }}
                    >
                      {language == "en"
                        ? "Provisional CERTIFICATE"
                        : "प्रमाणपत्र डाउनलोड करा"}
                    </Button>
                  </IconButton>
                )}
              {record?.row?.applicationStatus === "FINAL_APPROVED" &&
                authority?.find(
                  (r) => r === "LOI_GENERATION" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      endIcon={<CheckIcon />}
                      style={{
                        height: "30px",
                        width: "200px",
                      }}
                      onClick={() =>
                        router.push({
                          pathname:
                            "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/scrutiny",
                          query: {
                            ...record.row,
                            applicationId: record.row.id,
                            serviceId: record.row.serviceId,
                            pageMode: "Edit",
                            role: "LOI_GENERATION",
                            pageMode: "APPLICATION VERIFICATION",
                            pageModeMr: "अर्ज पडताळणी",
                            pageHeader: "APPLICATION VERIFICATION",
                            pageHeaderMr: "अर्ज पडताळणी",
                          },
                        })
                      }
                    >
                      {language == "en" ? "edit application" : "लिपिक पडताळणी"}
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "LOI_GENERATED" &&
                authority?.find((r) => r === "CASHIER" || r === "ADMIN") && (
                  <IconButton>
                    <Button
                      variant="contained"
                      // endIcon={<PaidIcon />}
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() =>
                        router.push({
                          pathname:
                            "/marriageRegistration/transactions/newMarriageRegistration/scrutiny/PaymentCollection",
                          query: {
                            ...record.row,
                            role: "CASHIER",
                          },
                        })
                      }
                    >
                      {language == "en" ? "COLLECT PAYMENT" : "पेमेंट गोळा करा"}
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                authority?.find(
                  (r) => r === "CERTIFICATE_ISSUER" || r === "ADMIN",
                ) && (
                  <IconButton>
                    {/* <Buttonremarks */}
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      {language == "en"
                        ? "GENERATE CERTIFICATE"
                        : "प्रमाणपत्र व्युत्पन्न करा"}
                    </Button>
                    {/* </Buttonremarks> */}
                  </IconButton>
                )}

              {/* {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                authority?.find(
                  (r) => r === "CERTIFICATE_ISSUER" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => issueCertificate(record.row)}
                    >
                      {language == "en"
                        ? "DOWNLOAD CERTIFICATE"
                        : "प्रमाणपत्र डाउनलोड करा"}
                    </Button>
                  </IconButton>
                )} */}

              {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                authority?.find(
                  (r) => r === "DOWNLOAD_CERTIFICATE" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => {
                        router.push({
                          pathname:
                            "/marriageRegistration/reports/marriageCertificateNew",
                          query: {
                            applicationId: record.row.id,
                            serviceId: record.row.serviceId,
                            // ...params.row,
                          },
                        });
                      }}
                    >
                      {language == "en"
                        ? "DOWNLOAD CERTIFICATE"
                        : "प्रमाणपत्र डाउनलोड करा"}
                    </Button>
                  </IconButton>
                )}

              {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                authority?.find(
                  (r) => r === "DOWNLOAD_CERTIFICATE" || r === "ADMIN",
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        // height: "px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => {
                        router.push({
                          pathname:
                            "/marriageRegistration/reports/marriageRegister",
                          query: {
                            applicationId: record.row.id,
                            serviceId: record.row.serviceId,
                            // ...params.row,
                          },
                        });
                      }}
                    >
                      {language == "en" ? "MARRIAGE REGISTER" : "विवाह नोंदणी"}
                    </Button>
                  </IconButton>
                )}
              {/* {record?.row?.applicationStatus === "CERTIFICATE_GENERATED" &&
                authority?.find(
                  (r) => r === "APPLY_DIGITAL_SIGNATURE" || r === "ADMIN"
                ) && (
                  <IconButton>
                    <Button
                      variant="contained"
                      style={{
                        height: "30px",
                        width: "250px",
                      }}
                      color="success"
                      onClick={() => applyDigitalSignature(record.row)}
                    >
                      {language == "en"
                        ? "APPLY DIGITAL SIGNATURE"
                        : "डिजिटल स्वाक्षरी लागू करा"}
                    </Button>
                  </IconButton>
                )} */}
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
        // <Loader />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh", // Adjust itasper requirement.
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
                {" "}
                {<FormattedLabel id="newMRtable" />}
              </h2>
            </div>
          </div>
          {/* <div className={styles.titleM}>
          <Typography variant="h4" display="block" gutterBottom>
            {<FormattedLabel id="newMRtable" />}
          </Typography>
        </div> */}
          <br />

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
            // rows={tableData}
            columns={columns}
            // pageSize={5}
            // rowsPerPageOptions={[5]}

            pagination
            paginationMode="server"
            page={newMarriageData?.page}
            rowCount={newMarriageData?.totalRows}
            rowsPerPageOptions={newMarriageData?.rowsPerPageOptions}
            pageSize={newMarriageData?.pageSize}
            rows={newMarriageData?.rows?.map((data, index) => {
              return {
                ...data,
                srNo: index + 1,
              };
            })}
            onPageChange={(_data) => {
              getNewMarriageRegistractionDetails(
                newMarriageData?.pageSize,
                _data,
              );
            }}
            onPageSizeChange={(_data) => {
              getNewMarriageRegistractionDetails(_data, newMarriageData?.page);
            }}
          />
        </Paper>
      )}
    </>
  );
};
export default Index;
