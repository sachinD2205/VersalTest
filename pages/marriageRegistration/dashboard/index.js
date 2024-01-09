import BrushIcon from "@mui/icons-material/Brush";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import EventIcon from "@mui/icons-material/Event";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PeopleIcon from "@mui/icons-material/People";
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import BreadcrumbComponent from "../../../components/common/BreadcrumbComponent";
import Loader from "../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/marrigeRegistration/[dashboard].module.css";
import { catchExceptionHandlingMethod } from "../../../util/util";

import { useForm } from "react-hook-form";
// Main Component - Clerk
const Index = () => {
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
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const [loadderState, setLoadderState] = useState(true);
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
  const language = useSelector((state) => state?.labels.language);

  const [dataSource, setDataSource] = useState([]);

  const [dataSourcei, setDataSourceI] = useState([]);
  const [dataSourcer, setDataSourceR] = useState([]);
  const [dataSourcea, setDataSourceA] = useState([]);
  const [dataSourcet, setDataSourceT] = useState([]);

  const [showIncoming, setShowIncoming] = useState();
  const [showApproved, setShowApproved] = useState();
  const [showReverted, setShowReverted] = useState();
  const [showTotal, setShowTotal] = useState();

  const [serviceList, setServiceList] = useState([]);

  const [pendingApplication, setPendingApplication] = useState(0);
  const [rejectedApplication, setRejectedApplication] = useState(0);
  const [approvedApplication, setApprovedApplication] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);
  const [totalApplication1, setTotalApplication1] = useState(0);
  const [nmrstatuses, setNmrStatuses] = useState([]);

  const [nmrauthority, setNmrAuthority] = useState([]);
  const [mbrauthority, setMbrAuthority] = useState([]);
  const [mmcauthority, setMmcAuthority] = useState([]);
  const [mmbcauthority, setMmbcAuthority] = useState([]);
  const [rmcauthority, setRmcAuthority] = useState([]);
  const [rmbcauthority, setRmbcAuthority] = useState([]);

  //new marriage
  let nmrcreated = [];
  let apptScheduled = [];
  let nmrclkVerified = [];
  let nmrcmolaKonte = [];
  let nmrcmoVerified = [];
  let nmrloiGenerated = [];
  let nmrpaymentCollected = [];
  let nmrdownloadcertificate = [];
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
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [serviceId, setServiceId] = useState(null);

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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getMyApplications = async () => {
    let incoming = [];
    let rejected = [];
    let approved = [];
    //incoming
    axios
      .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          whichOne: "INCOMING",
        },
      })
      .then((resp) => {
        setLoadderState(false);
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
      .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
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
      .get(`${urls.MR}/transaction/prime/getDashboardDtlNew`, {
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
      incoming.length + rejected.length + approved.length,
    );
    setTotalApplication(incoming.length + rejected.length + approved.length);
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

  const applyDigitalSignature = (record) => {
    const finalBody = {
      id: Number(record.id),
      ...record,
      role: "APPLY_DIGITAL_SIGNATURE",
    };
    console.log("yetoy", record);
    saveApproval(finalBody);
  };

  const saveApproval = (body) => {
    if (router.query.serviceId == 10) {
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
                pathname:
                  "/marriageRegistration/reports/marriageCertificateNew",
                query: {
                  ...body,
                  // role: "CERTIFICATE_ISSUER",
                },
              });
            } else if (body.role === "APPLY_DIGITAL_SIGNATURE") {
              router.push({
                pathname:
                  "/marriageRegistration/reports/marriageCertificateNew",
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
    } else if (router.query.serviceId == 67) {
      axios
        .post(
          `${urls.MR}/transaction/marriageBoardRegistration/saveMarraigeBoardRegistrationApprove`,
          body,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
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
            } else if (
              body.role === "CERTIFICATE_ISSUER" ||
              body.role === "APPLY_DIGITAL_SIGNATURE"
            ) {
              {
                body.serviceId == 14
                  ? router.push({
                      pathname:
                        "/marriageRegistration/reports/boardcertificateui",
                      query: {
                        ...body,
                        certiMode: "renew",
                        // role: "CERTIFICATE_ISSUER",
                      },
                    })
                  : router.push({
                      pathname:
                        "/marriageRegistration/reports/boardcertificateui",
                      query: {
                        ...body,
                        // role: "CERTIFICATE_ISSUER",
                      },
                    });
              }
            }
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router.query.serviceId == 12) {
      axios
        .post(
          `${urls.MR}/transaction/modOfMarCertificate/saveApplicationApprove`,
          body,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((response) => {
          if (response.status === 200) {
            if (body.role === "LOI_GENERATION") {
              router.push({
                pathname:
                  "/marriageRegistration/transactions/modOfMarCertificate/scrutiny/LoiGenerationReciptmarathi",
                query: {
                  ...body,
                },
              });
            } else if (body.role === "CERTIFICATE_ISSUER") {
              router.push({
                pathname:
                  "/marriageRegistration/reports/marriageCertificateNew",
                query: {
                  // applicationId: record.row.id,
                  // serviceId: 12,
                  // applicationId: body.id,
                  ...body,
                  role: "CERTIFICATE_ISSUER",
                },
              });
            }
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router.query.serviceId == 15) {
      axios
        .post(
          `${urls.MR}/transaction/modOfMarBoardCertificate/saveModOfMarBoardCertificateApprove`,
          body,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((response) => {
          setLoaderState(false);
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
                pathname: "/marriageRegistration/reports/boardcertificateui",
                query: {
                  // applicationId: record.row.id,
                  serviceId: 15,
                  applicationId: body.id,
                  // ...body,
                  // role: "CERTIFICATE_ISSUER",
                },
              });
            }
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  //atach takla ahe yala apan change karu
  const issueCertificate1 = (record) => {
    const finalBody = {
      // applicationId: record.id,
      id: record.id,
      serviceId: 14,
      role: "CERTIFICATE_ISSUER",
    };

    axios
      .post(
        `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/saveRenewalOfMarriageBoardCertificateApprove`,
        finalBody,
      )
      .then((res) => {
        console.log(res);
        swal("Submitted!", "Certificate Issued successfully !", "success");
        router.push({
          pathname: "/marriageRegistration/reports/boardcertificateui",
          query: {
            // ...body,
            applicationId: record.id,
            serviceId: 14,
            // role: "CERTIFICATE_ISSUER",
          },
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
        router.back();
      });
    // .catch((err) => {
    //   swal("Error!", "Somethings Wrong!", "error");
    // });
  };

  //atach takla ahe yala apan change karu
  const issueCertificate2 = (record) => {
    const finalBody = {
      id: record.id,
      serviceId: 11,
      role: "CERTIFICATE_ISSUER",
    };
    console.log("re-issue", record);

    axios
      .post(
        `${urls.MR}/transaction/reIssuanceM/saveApplicationApprove`,

        finalBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            serviceId: 11,
          },
        },
      )
      .then((res) => {
        console.log(res);
        swal("Submitted!", "Certificate Issued successfully !", "success");
        router.push({
          pathname: "/marriageRegistration/reports/marriageCertificateNew",
          query: {
            // ...body,
            id: record.id,
            serviceId: 11,
            // role: "CERTIFICATE_ISSUER",
          },
        });
      })
      .catch((error) => {
        callCatchMethod(error, language);
        router.back();
      });
    // .catch((err) => {
    //   swal("Error!", "Somethings Wrong!", "error");
    // });
  };

  // isDateInRange
  function isDateInRange(record) {
    console.log(
      "appontmentDate",
      record?.row?.appointmentScheduleReschDao?.appointmentDate,
    );
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

  // 1st

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
      minWidth: 90,
      flex: 1,
    },
    {
      field: "applicationNumber",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="applicationNo" />,
      minWidth: 270,
      flex: 1,
    },
    {
      field: language == "en" ? "serviceName" : "serviceNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="serviceName" />,
      minWidth: 290,
      flex: 1,
    },
    {
      field: "applicationDate",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="applicationDate" />,
      minWidth: 120,
      flex: 1,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="ApplicantName" />,
      minWidth: 270,
      flex: 1,
    },

    {
      field: "applicationStatus",
      headerAlign: "center",
      align: "left",
      headerName: <FormattedLabel id="statusDetails" />,
      minWidth: 280,
      flex: 1,
    },

    {
      field: "actions",
      headerAlign: "center",
      align: "center",
      headerName: <FormattedLabel id="actions" />,
      width: 340,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            {record.row.serviceId == 10 && (
              <div className={styles.buttonRow}>
                {/* {record?.row?.applicationStatus === "APPLICATION_CREATED" && */}
                {["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(
                  record?.row?.applicationStatus,
                ) &&
                  (nmrauthority?.includes("DOCUMENT_CHECKLIST") ||
                    nmrauthority?.includes("ADMIN")) && (
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
                  (nmrauthority?.includes("APPOINTMENT_SCHEDULE") ||
                    nmrauthority?.includes("ADMIN")) && (
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
                            pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slot`,
                            // pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/MeetingSchedule`,
                            query: {
                              appId: record.row.id,
                              role: "APPOINTMENT_SCHEDULE",
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
                      // "APPLICATION_SENT_TO_SR_CLERK",
                      // "CITIZEN_SEND_BACK_TO_SR_CLERK",
                    ].includes(record?.row?.applicationStatus) &&
                      (nmrauthority?.includes("APPOINTMENT_SCHEDULE") ||
                        nmrauthority?.includes("ADMIN")) && (
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
                                pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/slotNew`,
                                // pathname: `/marriageRegistration/transactions/newMarriageRegistration/scrutiny/MeetingSchedule`,
                                query: {
                                  appId: record.row.id,
                                  role: "APPOINTMENT_SCHEDULE",
                                },
                              })
                            }
                          >
                            {language == "en" ? "RESCHEDULE" : "वेळापत्रक"}
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
                      nmrauthority?.find(
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

                {/* {[
                  "CMO_SENT_BACK_TO_SR_CLERK",
                  "APPOINTMENT_SCHEDULED",
                ].includes(record?.row?.applicationStatus) &&
                  nmrauthority?.find(
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
                  nmrauthority?.find(
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
                  nmrauthority?.find(
                    (r) => r === "LOI_GENERATION" || r === "ADMIN",
                  ) && (
                    <IconButton>
                      <Button
                        variant="contained"
                        endIcon={<BrushIcon />}
                        style={{
                          height: "30px",
                          width: "250px",
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
                        {language == "en"
                          ? "GENERATE LOI"
                          : "LOI व्युत्पन्न करा"}
                      </Button>
                    </IconButton>
                  )}

                {record?.row?.applicationStatus === "LOI_GENERATED" &&
                  nmrauthority?.find(
                    (r) => r === "CASHIER" || r === "ADMIN",
                  ) && (
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
                        {language == "en"
                          ? "COLLECT PAYMENT"
                          : "पेमेंट गोळा करा"}
                      </Button>
                    </IconButton>
                  )}

                {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                  nmrauthority?.find(
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
                 nmrauthority?.find(
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
                  nmrauthority?.find(
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

                {/* {record?.row?.applicationStatus === "CERTIFICATE_GENERATED" &&
                 nmrauthority?.find(
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
            )}
            {record.row.serviceId == 12 && (
              <>
                <div className={styles.buttonRow}>
                  {["APPLICATION_CREATED"].includes(
                    record?.row?.applicationStatus,
                  ) &&
                    // {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
                    (mmcauthority?.includes("DOCUMENT_CHECKLIST") ||
                      mmcauthority?.includes("ADMIN")) && (
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny",
                            query: {
                              disabled: true,
                              ...record.row,
                              role: "DOCUMENT_CHECKLIST",
                              pageHeader: "DOCUMENT CHECKLIST",
                              pageMode: "Edit",
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

                  {[
                    "CMO_SENT_BACK_TO_SR_CLERK",
                    "APPLICATION_SENT_TO_SR_CLERK",
                    "APPOINTMENT_SCHEDULED",
                  ].includes(record?.row?.applicationStatus) &&
                    // {record?.row?.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK" &&
                    mmcauthority?.find(
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
                                  "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny",
                                query: {
                                  // ...record.row,
                                  id: record.row.id,
                                  serviceId: record.row.serviceId,
                                  serviceName: record.row.serviceName,
                                  serviceNameMr: record.row.serviceNameMr,
                                  role: "DOCUMENT_VERIFICATION",

                                  pageHeader: "APPLICATION VERIFICATION",
                                  pageMode: "Edit",
                                  pageHeaderMr: "अर्ज पडताळणी",
                                },
                              })
                            }
                          >
                            {language == "en"
                              ? "DOCUMENT VERIFICATION"
                              : "दस्तऐवज पडताळणी"}
                          </Button>
                        </IconButton>
                      </>
                    )}
                  {["APPLICATION_SENT_TO_CMO"].includes(
                    record?.row?.applicationStatus,
                  ) &&
                    // {/* {record?.row?.applicationStatus === "APPLICATION_SENT_TO_CMO" && */}
                    mmcauthority?.find(
                      (r) => r === "FINAL_APPROVAL" || r === "ADMIN",
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
                                  "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/scrutiny",
                                query: {
                                  id: record.row.id,
                                  serviceId: record.row.serviceId,
                                  serviceName: record.row.serviceName,
                                  serviceNameMr: record.row.serviceNameMr,
                                  role: "FINAL_APPROVAL",
                                  pageHeader: "FINAL APPROVAL",
                                  pageMode: "Edit",
                                  pageHeaderMr: "अर्ज पडताळणी",
                                },
                              })
                            }
                          >
                            {language == "en"
                              ? "CMO/ MARRIAGE REGISTRAR VERIFY"
                              : "सी एम ओ / विवाह निबंधक सत्यापित करा"}
                          </Button>
                        </IconButton>
                      </>
                    )}

                  {record?.row?.applicationStatus === "CMO_APPROVED" &&
                    mmcauthority?.find(
                      (r) => r === "LOI_GENERATION" || r === "ADMIN",
                    ) && (
                      <IconButton>
                        <Button
                          variant="contained"
                          endIcon={<BrushIcon />}
                          style={{
                            height: "30px",
                            width: "250px",
                          }}
                          //  color="success"
                          // onClick={() => viewLOI(record.row)}
                          onClick={() =>
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationComponent",
                              query: {
                                // ...record.row,
                                id: record.row.id,
                                serviceId: record.row.serviceId,
                                serviceName: record.row.serviceName,
                                serviceNameMr: record.row.serviceNameMr,
                                // loiServicecharges: null,
                                role: "LOI_GENERATION",
                              },
                            })
                          }
                        >
                          {language == "en"
                            ? "GENERATE LOI"
                            : "LOI व्युत्पन्न करा"}
                        </Button>
                      </IconButton>
                    )}

                  {record?.row?.applicationStatus === "LOI_GENERATED" &&
                    mmcauthority?.find(
                      (r) => r === "CASHIER" || r === "ADMIN",
                    ) && (
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
                                "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/PaymentCollection",

                              query: {
                                // ...record.row,
                                role: "CASHIER",
                                applicationId: record.row.id,
                                serviceId: 12,
                              },
                            })
                          }
                        >
                          {language == "en"
                            ? "COLLECT PAYMENT"
                            : "पेमेंट गोळा करा"}
                        </Button>
                      </IconButton>
                    )}

                  {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                    mmcauthority?.find(
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
                            ? "GENERATE CERTIFICATE"
                            : "प्रमाणपत्र व्युत्पन्न करा"}
                        </Button>
                      </IconButton>
                    )}

                  {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                    mmcauthority?.find(
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
                    )}
                </div>
              </>
            )}

            {record.row.serviceId == 11 && (
              <>
                <div className={styles.buttonRow}>
                  {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
                    rmcauthority?.find(
                      (r) => r === "CASHIER" || r === "ADMIN",
                    ) && (
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
                                "/marriageRegistration/transactions/ReissuanceofMarriageCertificate/PaymentCollection",
                              query: {
                                ...record.row,
                                role: "CASHIER",
                              },
                            })
                          }
                        >
                          {language == "en"
                            ? "COLLECT PAYMENT"
                            : "पेमेंट गोळा करा"}
                        </Button>
                      </IconButton>
                    )}

                  {/* {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                    rmcauthority?.find(
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
                          onClick={() => issueCertificate2(record.row)}
                        >
                          {language == "en"
                            ? "GENERATE CERTIFICATE"
                            : "प्रमाणपत्र व्युत्पन्न करा"}
                        </Button>
                   
                      </IconButton>
                    )} */}

                  {/* {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" && ( */}
                  {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                    rmcauthority?.find(
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
                          onClick={() => issueCertificate2(record.row)}
                        >
                          {language == "en"
                            ? "DOWNLOAD CERTIFICATE"
                            : "प्रमाणपत्र डाउनलोड करा"}
                        </Button>
                      </IconButton>
                    )}
                </div>
              </>
            )}

            {record.row.serviceId == 67 && (
              <>
                <div className={styles.buttonRow}>
                  {["APPLICATION_CREATED", "CITIZEN_SEND_TO_JR_CLERK"].includes(
                    record?.row?.applicationStatus,
                  ) &&
                    (mbrauthority?.includes("DOCUMENT_CHECKLIST") ||
                      mbrauthority?.includes("ADMIN")) && (
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/boardRegistrations/scrutiny/scrutiny",
                            query: {
                              disabled: true,
                              ...record.row,
                              role: "DOCUMENT_CHECKLIST",
                              pageHeader: "DOCUMENT CHECKLIST",
                              pageMode: "Check",
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

                  {[
                    "APPLICATION_SENT_TO_SR_CLERK",
                    "CMO_SENT_BACK_TO_SR_CLERK",
                    "CITIZEN_SEND_BACK_TO_SR_CLERK",
                  ].includes(record?.row?.applicationStatus) &&
                    mbrauthority?.find(
                      (r) => r == "DOCUMENT_VERIFICATION" || r == "ADMIN",
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
                                  "/marriageRegistration/transactions/boardRegistrations/scrutiny/scrutiny",
                                query: {
                                  ...record.row,
                                  role: "DOCUMENT_VERIFICATION",

                                  pageHeader: "APPLICATION VERIFICATION",
                                  // pageMode: 'Edit',
                                  pageMode: "Check",
                                  pageHeaderMr: "अर्ज पडताळणी",
                                },
                              })
                            }
                          >
                            {language == "en"
                              ? "DOCUMENT VERIFICATION"
                              : "दस्तऐवज पडताळणी"}
                          </Button>
                        </IconButton>
                      </>
                    )}

                  {record?.row?.applicationStatus ===
                    "APPLICATION_SENT_TO_CMO" &&
                    mbrauthority?.find(
                      (r) => r === "FINAL_APPROVAL" || r === "ADMIN",
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
                                  "/marriageRegistration/transactions/boardRegistrations/scrutiny/scrutiny",
                                query: {
                                  ...record.row,
                                  role: "FINAL_APPROVAL",
                                  pageHeader: "FINAL APPROVAL",
                                  // pageMode: 'Edit',
                                  pageMode: "Check",
                                  pageHeaderMr: "अर्ज पडताळणी",
                                },
                              })
                            }
                          >
                            {language == "en"
                              ? "CMO/ MARRIAGE REGISTRAR VERIFY"
                              : "सी एम ओ / विवाह निबंधक सत्यापित करा"}
                          </Button>
                        </IconButton>
                      </>
                    )}

                  {record?.row?.applicationStatus === "CMO_APPROVED" &&
                    mbrauthority?.find(
                      (r) => r === "LOI_GENERATION" || r === "ADMIN",
                    ) && (
                      <IconButton>
                        <Button
                          variant="contained"
                          endIcon={<BrushIcon />}
                          style={{
                            height: "30px",
                            width: "250px",
                          }}
                          onClick={() =>
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationComponent",
                              query: {
                                id: record.row.id,
                                serviceName: record.row.serviceId,

                                role: "LOI_GENERATION",
                              },
                            })
                          }
                        >
                          {language == "en"
                            ? "GENERATE LOI"
                            : "LOI व्युत्पन्न करा"}
                        </Button>
                      </IconButton>
                    )}

                  {record?.row?.applicationStatus === "LOI_GENERATED" &&
                    mbrauthority?.find(
                      (r) => r === "CASHIER" || r === "ADMIN",
                    ) && (
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
                                "/marriageRegistration/transactions/boardRegistrations/scrutiny/PaymentCollection",

                              query: {
                                ...record.row,
                                role: "CASHIER",
                              },
                            })
                          }
                        >
                          {language == "en"
                            ? "COLLECT PAYMENT"
                            : "पेमेंट गोळा करा"}
                        </Button>
                      </IconButton>
                    )}

                  {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                    mbrauthority?.find(
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
                            ? "GENERATE CERTIFICATE"
                            : "प्रमाणपत्र व्युत्पन्न करा"}
                        </Button>
                      </IconButton>
                    )}
                  {record?.row?.applicationStatus === "CERTIFICATE_GENERATED" &&
                    mbrauthority?.find(
                      (r) => r === "APPLY_DIGITAL_SIGNATURE" || r === "ADMIN",
                    ) && (
                      <IconButton>
                        <Button
                          variant="contained"
                          style={{
                            height: "px",
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
                    )}
                  {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" && (
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
                              "/marriageRegistration/reports/boardcertificateui",
                            query: {
                              serviceId: record.row.serviceId,
                              applicationId: record.row.id,
                              certiMode: "renew",
                            },
                          })
                        }
                      >
                        {language == "en"
                          ? "DOWNLOAD CERTIFICATE"
                          : "प्रमाणपत्र डाउनलोड करा"}
                      </Button>
                    </IconButton>
                  )}
                </div>
              </>
            )}
            {record.row.serviceId == 15 && (
              <>
                <div className={styles.buttonRow}>
                  {["APPLICATION_CREATED"].includes(
                    record?.row?.applicationStatus,
                  ) &&
                    // {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
                    (mmbcauthority?.includes("DOCUMENT_CHECKLIST") ||
                      mmbcauthority?.includes("ADMIN")) && (
                      <IconButton
                        onClick={() =>
                          router.push({
                            pathname:
                              "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/scrutiny",
                            query: {
                              disabled: true,
                              ...record.row,
                              role: "DOCUMENT_CHECKLIST",
                              pageHeader: "DOCUMENT CHECKLIST",
                              pageMode: "View",
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
                  {[
                    "CMO_SENT_BACK_TO_SR_CLERK",
                    "APPLICATION_SENT_TO_SR_CLERK",
                    "APPOINTMENT_SCHEDULED",
                  ].includes(record?.row?.applicationStatus) &&
                    // {record?.row?.applicationStatus === "APPLICATION_SENT_TO_SR_CLERK" &&
                    mmbcauthority?.find(
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
                                pathname: "scrutiny/scrutiny",
                                query: {
                                  ...record.row,
                                  role: "DOCUMENT_VERIFICATION",

                                  pageHeader: "APPLICATION VERIFICATION",
                                  pageMode: "Edit",
                                  pageHeaderMr: "अर्ज पडताळणी",
                                },
                              })
                            }
                          >
                            {language == "en"
                              ? "DOCUMENT VERIFICATION"
                              : "दस्तऐवज पडताळणी"}
                          </Button>
                        </IconButton>
                      </>
                    )}
                  {["APPLICATION_SENT_TO_CMO"].includes(
                    record?.row?.applicationStatus,
                  ) &&
                    // {record?.row?.applicationStatus === "APPLICATION_VERIFICATION_COMPLETED" &&
                    mmbcauthority?.find(
                      (r) => r === "FINAL_APPROVAL" || r === "ADMIN",
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
                                pathname: "scrutiny/scrutiny",
                                query: {
                                  ...record.row,
                                  role: "FINAL_APPROVAL",
                                  pageHeader: "FINAL APPROVAL",
                                  pageMode: "Edit",
                                  pageHeaderMr: "अर्ज पडताळणी",
                                },
                              })
                            }
                          >
                            {language == "en"
                              ? "CMO/ MARRIAGE REGISTRAR VERIFY"
                              : "सी एम ओ / विवाह निबंधक सत्यापित करा"}
                          </Button>
                        </IconButton>
                      </>
                    )}

                  {record?.row?.applicationStatus === "CMO_APPROVED" &&
                    mmbcauthority?.find(
                      (r) => r === "LOI_GENERATION" || r === "ADMIN",
                    ) && (
                      <IconButton>
                        <Button
                          variant="contained"
                          endIcon={<BrushIcon />}
                          style={{
                            height: "30px",
                            width: "250px",
                          }}
                          //  color="success"
                          // onClick={() => viewLOI(record.row)}
                          onClick={() =>
                            router.push({
                              pathname:
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/LoiGenerationComponent",
                              query: {
                                // ...record.row,
                                id: record.row.id,
                                serviceName: record.row.serviceId,
                                // loiServicecharges: null,
                                role: "LOI_GENERATION",
                              },
                            })
                          }
                        >
                          {language == "en"
                            ? "GENERATE LOI"
                            : "LOI व्युत्पन्न करा"}
                        </Button>
                      </IconButton>
                    )}

                  {record?.row?.applicationStatus === "LOI_GENERATED" &&
                    mmbcauthority?.find(
                      (r) => r === "CASHIER" || r === "ADMIN",
                    ) && (
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
                                "/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/scrutiny/PaymentCollection",

                              query: {
                                // ...record.row,
                                role: "CASHIER",
                                applicationId: record.row.id,
                                serviceId: 15,
                              },
                            })
                          }
                        >
                          {language == "en"
                            ? "COLLECT PAYMENT"
                            : "पेमेंट गोळा करा"}
                        </Button>
                      </IconButton>
                    )}

                  {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                    mmbcauthority?.find(
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
                            ? "GENERATE CERTIFICATE"
                            : "प्रमाणपत्र व्युत्पन्न करा"}
                        </Button>
                      </IconButton>
                    )}

                  {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                    mmbcauthority?.find(
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
                          onClick={() =>
                            router.push({
                              pathname:
                                "/marriageRegistration/reports/boardcertificateui",
                              query: {
                                serviceId: record.row.serviceId,
                                applicationId: record.row.id,
                                certiMode: "renew",
                              },
                            })
                          }
                        >
                          {language == "en"
                            ? " DOWNLOAD CERTIFICATE"
                            : "प्रमाणपत्र डाउनलोड करा"}
                        </Button>
                      </IconButton>
                    )}
                </div>
              </>
            )}
            {record.row.serviceId == 14 && (
              <>
                <div className={styles.buttonRow}>
                  {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFULL" &&
                    rmbcauthority?.find(
                      (r) => r === "CERTIFICATE_ISSUER" || r === "ADMIN",
                    ) && (
                      // {record?.row?.applicationStatus ===
                      //   "PAYEMENT_SUCCESSFULL" && (
                      <IconButton>
                        {/* <Buttonremarks */}
                        <Button
                          variant="contained"
                          style={{
                            height: "px",
                            width: "250px",
                          }}
                          color="success"
                          onClick={() => issueCertificate1(record.row)}
                        >
                          {language == "en"
                            ? "GENERATE CERTIFICATE"
                            : "प्रमाणपत्र व्युत्पन्न करा"}
                        </Button>
                        {/* </Buttonremarks> */}
                      </IconButton>
                    )}
                  {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" &&
                    rmbcauthority?.find(
                      (r) => r === "DOWNLOAD_CERTIFICATE" || r === "ADMIN",
                    ) && (
                      // {record?.row?.applicationStatus === "CERTIFICATE_ISSUED" && (
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
                                "/marriageRegistration/reports/boardcertificateui",
                              query: {
                                // // ...body,
                                applicationId: record?.row?.id,
                                serviceId: 14,
                                // // role: "CERTIFICATE_ISSUER",
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
                </div>
              </>
            )}
          </>
        );
      },
    },
  ];

  const getMyApplications1 = async (props) => {
    const url = `${urls.MR}/transaction/prime/getDashboardDtlNew1?serviceId=${props}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          whichOne: watch("whichOne"),
        },
      })
      .then((resp) => {
        setLoadderState(false);
        const response = resp?.data?.map((r, i) => {
          return {
            srNo: i + 1,
            ...r,
            id: r.applicationId,
            serviceName: serviceList?.find((s) => s?.id == r?.serviceId)
              ?.serviceName,
            serviceNameMr: serviceList?.find((s) => s?.id == r?.serviceId)
              ?.serviceNameMr,
          };
        });

        setDataSource(response);
        // setTotalApplication1(watch("whichOne").length);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //! ====================> useEffect

  useEffect(() => {
    getServiceName();
    // for new api
    setValue("whichOne", "TOTAL");
  }, []);

  // useEffect(() => {
  //   getMyApplications1();
  // }, []);

  // 2nd
  useEffect(() => {
    getMyApplications();
    // getMyApplications1();
    // getMyApplicationss();
  }, [serviceList]);

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

    // let nmrStatuses = nmr.map((n) => {
    //   let stringss = "";
    //   switch (n) {
    //     case "DOCUMENT_CHECKLIST":
    //       stringss = stringss.concat("APPLICATION_CREATED,CITIZEN_SEND_TO_JR_CLERK");
    //       break;
    //     case "DOCUMENT_VERIFICATION":
    //       stringss = stringss.concat("APPOINTMENT_SCHEDULED,CITIZEN_SEND_BACK_TO_SR_CLERK");
    //       break;
    //     case "FINAL_APPROVAL":
    //       stringss = stringss.concat("APPLICATION_SENT_TO_CMO");
    //       break;
    //     case "LOI_GENERATION":
    //       stringss = stringss.concat("CMO_APPROVED");
    //       break;
    //     case "CASHIER":
    //       stringss = stringss.concat("LOI_GENERATED");
    //       break;
    //     case "CERTIFICATE_ISSUER":
    //       stringss = stringss.concat("PAYEMENT_SUCCESSFULL");
    //       break;
    //     case "APPLY_DIGITAL_SIGNATURE":
    //       stringss = stringss.concat("CERTIFICATE_GENERATED");
    //       break;
    //     case "ADMIN":
    //       stringss = stringss.concat("APPLICATION_CREATED,CITIZEN_SEND_TO_JR_CLERK,APPOINTMENT_SCHEDULED,CITIZEN_SEND_BACK_TO_SR_CLERK,APPLICATION_SENT_TO_CMO,CMO_APPROVED,LOI_GENERATED,LOI_GENERATED,PAYEMENT_SUCCESSFULL,CERTIFICATE_GENERATED")
    //   }
    //   return stringss;
    // })
    // console.log("nmrStatuses.toString()", nmrStatuses.toString());
    // setNmrStatuses(nmrStatuses.toString());
  }, [user?.menus]);

  useEffect(() => {
    console.log(
      "Total Applications GG",
      dataSourcei.length + dataSourcer.length + dataSourcea.length,
    );
    let total = dataSourcei.length + dataSourcer.length + dataSourcea.length;
    let totalApplicationInDS = [...dataSourcei, ...dataSourcea, ...dataSourcer];

    setTotalApplication(total);

    console.log("dataSourcei", dataSourcei);
    console.log("dataSourcer", dataSourcer);
    console.log("dataSourcea", dataSourcea);
    console.log("dataSourcet", totalApplicationInDS);
    console.log("serviceid===>", serviceId);

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
      }),
    );
  }, [dataSourcei, dataSourcer, dataSourcea]);

  useEffect(() => {
    let auth = user?.menus?.find((r) => r.id == selectedMenuFromDrawer)?.roles;
    let service = user?.menus?.find(
      (r) => r.id == selectedMenuFromDrawer,
    )?.serviceId;
    console.log("serviceId-<>", service);
    console.log("auth0000", auth);
    // setAuthority(auth);
    setServiceId(service);
  }, [selectedMenuFromDrawer, user?.menus]);

  useEffect(() => {}, [loadderState]);

  useEffect(() => {
    console.log("sdfllds", dataSourcei, dataSourcer, dataSourcea, dataSourcet);
  }, [dataSourcei, dataSourcer, dataSourcea, dataSourcet]);

  //view
  return (
    <>
      <Box>
        <BreadcrumbComponent />
      </Box>
      {loadderState ? (
        // <Loader />

        // <div
        //   style={{
        //     display: "flex",
        //     justifyContent: "center",
        //     alignItems: "center",
        //     height: "60vh", // Adjust itasper requirement.
        //   }}
        // >
        //   <Paper
        //     style={{
        //       display: "flex",
        //       justifyContent: "center",
        //       alignItems: "center",
        //       background: "white",
        //       borderRadius: "50%",
        //       padding: 8,
        //     }}
        //     elevation={8}
        //   >
        //     <CircularProgress color="success" />
        //   </Paper>
        // </div>
        <Loader />
      ) : (
        <>
          <Paper
            // className={styles.paperContainer}
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
                      ? "Marriage Registration Dashboard"
                      : "विवाह नोंदणी डॅशबोर्ड"}
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
                  // style={{ opacity: 0.7 }}
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <Button
                          style={{ marginLeft: "4vh" }}
                          onClick={() => {
                            setDataSource(dataSourcet);
                            setValue("whichOne", "TOTAL");
                          }}
                        >
                          <Typography
                            variant="h6"
                            align="center"
                            color="secondary"
                          >
                            {totalApplication}
                          </Typography>
                        </Button>
                      </div>
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <Button
                          style={{ marginLeft: "4vh" }}
                          onClick={() => {
                            setValue("whichOne", "APPROVED");
                            setDataSource(dataSourcea);
                          }}
                        >
                          <Typography variant="h6" align="center" color="green">
                            {approvedApplication}
                          </Typography>
                        </Button>
                      </div>
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <Button
                          onClick={() => {
                            setDataSource(dataSourcei);
                            setValue("whichOne", "INCOMING");
                          }}
                        >
                          <Typography
                            variant="h6"
                            align="center"
                            color="orange"
                          >
                            {pendingApplication}
                          </Typography>
                        </Button>
                      </div>
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <Button
                          onClick={() => {
                            setDataSource(dataSourcer);
                            setValue("whichOne", "REVERT");
                          }}
                        >
                          <Typography variant="h6" align="center" color="error">
                            {rejectedApplication}
                          </Typography>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <h2 style={{ textAlign: "center", color: "#ff0000" }}>
                  <b>
                    {language == "en"
                      ? "Service Wise Application"
                      : "सेवानिहाय अर्ज"}
                  </b>
                </h2>
              </Grid>
              <h4></h4>
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
                    {/** new marriage regstration */}
                    <div className={styles.one}>
                      <div className={styles.icono}>
                        <PeopleIcon color="secondary" />
                      </div>
                      <br />
                      <div className={styles.icono}>
                        <Button
                          onClick={() => {
                            getMyApplications1(10);
                          }}
                        >
                          <strong>
                            {language == "en" ? "NMR" : "एन एम आर"}
                            {/* ({" "}
                            {totalApplication1}) */}
                          </strong>
                        </Button>
                      </div>
                    </div>

                    {/** Vertical Line */}
                    <div className={styles.jugaad}></div>

                    {/** modification of marriage reg */}
                    <div className={styles.one}>
                      <div className={styles.icono}>
                        <PeopleIcon color="error" />
                      </div>
                      <br />
                      <div className={styles.icono}>
                        <Button
                          onClick={() => {
                            getMyApplications1(12);
                          }}
                        >
                          <strong>
                            {language == "en" ? "MMR" : "एम एम आर"}
                            {/* ({" "}
                            {totalApplication1}) */}
                          </strong>
                        </Button>
                      </div>
                    </div>

                    {/** Vertical Line */}
                    <div className={styles.jugaad}></div>

                    {/** issuence of marriage reg */}
                    <div className={styles.one}>
                      <div className={styles.icono}>
                        <PeopleIcon color="warning" />
                      </div>
                      <br />
                      <div className={styles.icono}>
                        <Button
                          onClick={() => {
                            getMyApplications1(11);
                          }}
                        >
                          <strong /* align="center" */>
                            {language == "en" ? "IMC" : "आय एम आर"}
                            {/* ({" "}
                            {totalApplication1}) */}
                          </strong>
                        </Button>
                      </div>
                    </div>

                    {/** Vertical Line */}
                    <div className={styles.jugaad}></div>

                    {/** board reg */}
                    <div className={styles.one}>
                      <div className={styles.icono}>
                        <PeopleIcon color="success" />
                      </div>
                      <br />
                      <div className={styles.icono}>
                        <Button
                          onClick={() => {
                            getMyApplications1(67);
                          }}
                        >
                          <strong /* align="center" */>
                            {language == "en" ? "MBR" : "एम बी आर"}
                            {/* ({" "}
                            {totalApplication1}) */}
                          </strong>
                        </Button>
                      </div>
                    </div>

                    {/** renewal board */}
                    <div className={styles.jugaad}></div>
                    <div className={styles.one}>
                      <div className={styles.icono}>
                        <PeopleIcon color="success" />
                      </div>
                      <br />
                      <div className={styles.icono}>
                        <Button
                          onClick={() => {
                            getMyApplications1(14);
                          }}
                        >
                          <strong /* align="center" */>
                            {language == "en" ? "RBR" : "आर बी आर"}
                            {/* ({" "}
                            {totalApplication1}) */}
                          </strong>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
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
        </>
      )}
    </>
  );
};

export default Index;
