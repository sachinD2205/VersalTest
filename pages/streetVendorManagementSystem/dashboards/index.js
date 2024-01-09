import CancelIcon from "@mui/icons-material/Cancel";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PeopleIcon from "@mui/icons-material/People";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextareaAutosize,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import SiteVisitSchedule from "../../../components/streetVendorManagementSystem/components/SiteVisitSchedule";
import VerificationAppplicationDetails from "../../../components/streetVendorManagementSystem/components/VerificationAppplicationDetails";
import {
  default as DashboardCSS,
  default as styles,
} from "../../../components/streetVendorManagementSystem/styles/dashboard.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import { catchExceptionHandlingMethod } from "../../../util/util";

// Main Component
const Index = () => {
  const language = useSelector((state) => state?.labels.language);
  // Methods in useForm
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      loadderState: true,
    },
    // resolver: yupResolver(Schema),
  });
  // destructure values from methods
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
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [authority, setAuthority] = useState([]);
  const user = useSelector((state) => state?.user?.user);
  const [applicationData, setApplicationData] = useState();
  const [applicationData1, setApplicationData1] = useState();
  const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);
  const [hardCodeAuthority, setHardCodeAuthority] = useState();
  const [verificationDailog, setVerificationDailog] = useState();
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const [serviceNames, setServiceNames] = useState([]);
  const [
    siteVisitPreviewButtonInputState,
    setSiteVisitPreviewButtonInputState,
  ] = useState(false);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const [whichOne, setWhichOne] = useState("TOTAL");
  // site Schedule Modal
  const siteVisitScheduleOpen = () => setSiteVisitScheduleModal(true);
  const siteVisitScheduleClose = () => setSiteVisitScheduleModal(false);
  // Verification AO Dialog
  const verificationOpne = () => setVerificationDailog(true);
  const verificationClose = () => setVerificationDailog(false);
  // Approve Remark Modal Close
  const approveRevertRemarkDailogOpen = () =>
    setApproveRevertRemarkDailog(true);
  const approveRevertRemarkDailogClose = () =>
    setApproveRevertRemarkDailog(false);
  //=============================================================================>
  // dataGrid
  const [finalTableData, setFinalTableData] = useState([]);
  const [pendingApplicationCount, setPendingApplicationCount] = useState(0);
  const [rejectedApplicationCount, setRejectedApplicationCount] = useState(0);
  const [approvedApplicationCount, setApprovedApplicationCount] = useState(0);
  const userToken = useGetToken();
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

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 100,
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      description: <FormattedLabel id="applicationNumber" />,
      width: 290,
    },
    {
      field: "applicationDate1",
      headerName: <FormattedLabel id="applicationDate" />,
      description: <FormattedLabel id="applicationDate" />,
      width: 150,
    },

    {
      field: language === "en" ? "applicantName" : "applicantNameMr",

      headerName: <FormattedLabel id="applicantName" />,
      description: <FormattedLabel id="applicantName" />,
      width: 250,
    },

    {
      field: language === "en" ? "serviceName" : "serviceNameMr",
      headerName: <FormattedLabel id="serviceName" />,
      description: <FormattedLabel id="serviceName" />,
      width: 320,
    },
    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
      description: <FormattedLabel id="applicationStatus" />,
      width: 320,
    },

    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 500,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            {/** Edit Application - Button to Department Cleark */}
            {(record?.row?.applicationStatus === "APPLICATION_CREATED" ||
              record?.row?.applicationStatus ===
              "APPLICATION_SENT_BACK_TO_DEPT_CLERK") &&
              record?.row?.enrollmentNo != null &&
              record?.row?.enrollmentNo != undefined &&
              record?.row?.enrollmentNo != "" &&
              authority?.find(
                (r) => r === "DEPT_CLERK_VERIFICATION" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    let url = ``;
                    // issuance
                    if (record?.row?.serviceId == 24) {
                      localStorage.setItem(
                        "issuanceOfHawkerLicenseId",
                        record?.row?.id
                      );
                      url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                    }
                    // renewal
                    else if (record?.row?.serviceId == 25) {
                      localStorage.setItem(
                        "renewalOfHawkerLicenseId",
                        record?.row?.id
                      );
                      url = `/streetVendorManagementSystem/transactions/renewalOfStreetVendorLicense`;
                    }
                    // cancellation
                    else if (record?.row?.serviceId == 27) {
                      localStorage.setItem(
                        "cancellationOfHawkerLicenseId",
                        record?.row?.id
                      );
                      url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                    }
                    // transfer
                    else if (record?.row?.serviceId == 26) {
                      localStorage.setItem(
                        "transferOfHawkerLicenseId",
                        record?.row?.id
                      );
                      url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense`;
                    }

                    localStorage.setItem("DepartSideEditApplication", "true");

                    router.push(url);
                  }}
                >
                  <Button variant="contained" size="small">
                    <FormattedLabel id="editApplication" />
                  </Button>
                </IconButton>
              )}

            {/**  Verification DEPT Cleark - Button */}
            {(record?.row?.applicationStatus === "APPLICATION_CREATED" ||
              record?.row?.applicationStatus ===
              "APPLICATION_SENT_BACK_TO_DEPT_CLERK") &&
              authority?.find(
                (r) => r === "DEPT_CLERK_VERIFICATION" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    let finalData = {
                      ...record?.row,
                      serviceName: record?.row?.serviceId,
                      serviceId: record?.row?.serviceId,
                    };
                    reset(finalData);
                    setApplicationData(record?.row);
                    setHardCodeAuthority("DEPT_CLERK_VERIFICATION");
                    setSiteVisitPreviewButtonInputState(false);
                    verificationOpne();
                  }}
                >
                  <Button variant="contained" size="small">
                    <FormattedLabel id="verificationDept" />
                  </Button>
                </IconButton>
              )}

            {/** AO  */}
            {(record?.row?.applicationStatus === "SITE_VISIT_COMPLETED" ||
              record?.row?.applicationStatus ===
              "APPLICATION_SENT_BACK_TO_ADMIN_OFFICER") &&
              authority?.find(
                (r) => r === "ADMIN_OFFICER" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    const finalData = {
                      ...record?.row,
                      serviceName: record?.row?.serviceId,
                      serviceId: record?.row?.serviceId,
                    };
                    reset(finalData);
                    setApplicationData(record?.row);
                    setSiteVisitPreviewButtonInputState(true);
                    setHardCodeAuthority("ADMIN_OFFICER");
                    verificationOpne();
                  }}
                >
                  <Button variant="contained" size="small">
                    <FormattedLabel id="verificationAo" />
                  </Button>
                </IconButton>
              )}
            {/**  Ward Officer */}
            {record?.row?.applicationStatus ===
              "APPLICATION_SENT_TO_WARD_OFFICER" &&
              authority?.find((r) => r === "WARD_OFFICER" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    const finalData = {
                      ...record?.row,
                      serviceName: record?.row?.serviceId,
                      serviceId: record?.row?.serviceId,
                    };
                    reset(finalData);
                    setApplicationData(record?.row);
                    setSiteVisitPreviewButtonInputState(true);
                    setHardCodeAuthority("WARD_OFFICER");
                    verificationOpne();
                  }}
                >
                  <Button variant="contained" size="small">
                    <FormattedLabel id="verificationWo" />
                  </Button>
                </IconButton>
              )}

            {/** Site Visit Schedule Button */}
            {record?.row?.applicationStatus ==
              "DEPT_CLERK_VERIFICATION_COMPLETED" &&
              record?.row?.appointmentType != "S" &&
              authority?.find(
                (r) => r === "SITE_VISIT_SCHEDULE" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    const finalData = {
                      ...record?.row,
                      serviceName: record?.row?.serviceId,
                      serviceId: record?.row?.serviceId,
                    };
                    reset(finalData);
                    siteVisitScheduleOpen();
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="siteVisitSchedule" />}
                  </Button>
                </IconButton>
              )}

            {/** Site Visit ReSchedule Button */}
            {record?.row?.applicationStatus ==
              "DEPT_CLERK_VERIFICATION_COMPLETED" &&
              record?.row?.appointmentType == "S" &&
              authority?.find(
                (r) => r === "SITE_VISIT_SCHEDULE" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    const finalData = {
                      ...record?.row,
                      serviceName: record?.row?.serviceId,
                      serviceId: record?.row?.serviceId,
                    };
                    reset(finalData);
                    siteVisitScheduleOpen();
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="siteVisitReschedule" />}
                  </Button>
                </IconButton>
              )}

            {/** Site Visit Button */}
            {record?.row?.applicationStatus == "SITE_VISIT_SCHEDULED" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <>
                  {/** Site Visit */}
                  <IconButton
                    onClick={() => {
                      let url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/SiteVisit`;

                      if (record?.row?.serviceId == "24") {
                        localStorage.setItem(
                          "issuanceOfHawkerLicenseId",
                          record?.row?.id
                        );
                      } else if (record?.row?.serviceId == "25") {
                        localStorage.setItem(
                          "renewalOfHawkerLicenseId",
                          record?.row?.id
                        );
                      } else if (record?.row?.serviceId == "27") {
                        localStorage.setItem(
                          "cancellationOfHawkerLicenseId",
                          record?.row?.id
                        );
                      } else if (record?.row?.serviceId == "26") {
                        localStorage.setItem(
                          "transferOfHawkerLicenseId",
                          record?.row?.id
                        );
                      }

                      router.push(url);
                    }}
                  >
                    <Button variant="contained" size="small">
                      {<FormattedLabel id="siteVisit" />}
                    </Button>
                  </IconButton>

                  {/** Site Visit  */}
                  <IconButton
                    onClick={() => {
                      const finalData = {
                        ...record?.row,
                        serviceName: record?.row?.serviceId,
                        serviceId: record?.row?.serviceId,
                      };
                      reset(finalData);
                      siteVisitScheduleOpen();
                    }}
                  >
                    <Button variant="contained" size="small">
                      {<FormattedLabel id="siteVisitReschedule" />}
                    </Button>
                  </IconButton>
                </>
              )}

            {/** LOI Generation Button */}
            {record?.row?.applicationStatus ===
              "APPLICATION_VERIFICATION_COMPLETED" &&
              authority?.find(
                (r) => r === "LOI_GENERATION" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    const url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/LoiGeneration`;

                    if (record?.row?.serviceId == "24") {
                      localStorage.setItem(
                        "issuanceOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "25") {
                      localStorage.setItem(
                        "renewalOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "27") {
                      localStorage.setItem(
                        "cancellationOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "26") {
                      localStorage.setItem(
                        "transferOfHawkerLicenseId",
                        record?.row?.id
                      );
                    }
                    router.push(url);
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="loiGeneration" />}
                  </Button>
                </IconButton>
              )}

            {/** LOI Generation Recipt Button */}
            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find((r) => r === "LOI_RECEIPT" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    const url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/LoiGenerationRecipt`;

                    if (record?.row?.serviceId == "24") {
                      localStorage.setItem(
                        "issuanceOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "25") {
                      localStorage.setItem(
                        "renewalOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "27") {
                      localStorage.setItem(
                        "cancellationOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "26") {
                      localStorage.setItem(
                        "transferOfHawkerLicenseId",
                        record?.row?.id
                      );
                    }
                    router.push(url);
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    {<FormattedLabel id="loiGenerationRecipt" />}
                  </Button>
                </IconButton>
              )}

            {/** Payment Collection Button */}
            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    const url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollection`;

                    if (record?.row?.serviceId == "24") {
                      localStorage.setItem(
                        "issuanceOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "25") {
                      localStorage.setItem(
                        "renewalOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "27") {
                      localStorage.setItem(
                        "cancellationOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "26") {
                      localStorage.setItem(
                        "transferOfHawkerLicenseId",
                        record?.row?.id
                      );
                    }

                    router.push(url);
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="paymentCollection" />}
                  </Button>
                </IconButton>
              )}

            {/** Payment Collection Recipt Button */}

            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "PAYMENT_RECEIPT" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    const url = `/streetVendorManagementSystem/transactions/issuanceOfSteetVendorLicense/PaymentCollectionRecipt`;

                    if (record?.row?.serviceId == "24") {
                      localStorage.setItem(
                        "issuanceOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "25") {
                      localStorage.setItem(
                        "renewalOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "27") {
                      localStorage.setItem(
                        "cancellationOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "26") {
                      localStorage.setItem(
                        "transferOfHawkerLicenseId",
                        record?.row?.id
                      );
                    }
                    router.push(url);
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    {<FormattedLabel id="paymentReceipt" />}
                  </Button>
                </IconButton>
              )}

            {/** Generate Certitifcate */}
            {(record?.row?.serviceId == "24" ||
              record?.row?.serviceId == "25" ||
              record?.row?.serviceId == "26") &&
              record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LICENSE_ISSUANCE" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    setValue("loadderState", true);
                    let url = ``;
                    let finalBodyForApi;
                    const routerPushUrl = `/streetVendorManagementSystem/components/Certificate`;
                    if (record?.row?.serviceId == "24") {
                      finalBodyForApi = {
                        id: record?.row?.id,
                        role: "LICENSE_ISSUANCE",
                        approveRemark: "Approve Certificate",
                      };
                      url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
                    } else if (record?.row?.serviceId == "25") {
                      finalBodyForApi = {
                        id: record?.row?.id,
                        role: "LICENSE_ISSUANCE",
                        certificateNo: record?.row?.certificateNo,
                        approveRemark: "Approve Certificate",
                      };
                      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfHawkerLicenseApprove`;
                    } else if (record?.row?.serviceId == "26") {
                      finalBodyForApi = {
                        id: record?.row?.id,
                        role: "LICENSE_ISSUANCE",
                        approveRemark: "Approve Certificate",
                      };
                      url = `${urls.HMSURL}/transferOfHawkerLicense/saveTransferOfHawkerLicenseApprove`;
                    }

                    axios
                      .post(url, finalBodyForApi, {
                        headers: {
                          Authorization: `Bearer ${userToken}`,
                        },
                      })
                      .then((res) => {
                        setValue("loadderState", false);
                        if (res?.status == 200 || res?.status == 201) {
                          sweetAlert({
                            title:
                              language == "en" ? "Generated!" : "व्युत्पन्न!",
                            text:
                              language == "en"
                                ? "Certificate Generated successfully"
                                : "प्रमाणपत्र यशस्वीरित्या व्युत्पन्न केले",
                            icon: "success",
                            buttons: {
                              ok: language == "en" ? "OK" : "ठीक आहे",
                            },
                          });

                          if (record?.row?.serviceId == "24") {
                            // issuance
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              record?.row?.id
                            );
                          } else if (record?.row?.serviceId == "25") {
                            // renewal
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              record?.row?.id
                            );
                          } else if (record?.row?.serviceId == "26") {
                            // transfer
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              record?.row?.id
                            );
                          }

                          router.push(routerPushUrl);
                        }
                      })
                      .catch((error) => {
                        setValue("loadderState", false);
                        callCatchMethod(error, language);
                      });
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="generateCertitifcate" />}
                  </Button>
                </IconButton>
              )}

            {/** view Certificate view */}
            {(((record?.row?.serviceId == "24" ||
              record?.row?.serviceId == "25" ||
              record?.row?.serviceId == "26") &&
              record?.row?.applicationStatus == "LICENSE_ISSUED") ||
              record?.row?.applicationStatus == "CERTIFICATE_GENERATED" ||
              record?.row?.applicationStatus == "I_CARD_ISSUED" ||
              record?.row?.applicationStatus == "I_CARD_GENERATED") &&
              authority?.find((r) => r === "LICENSE_VIEW" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    const url = `/streetVendorManagementSystem/components/Certificate`;

                    if (record?.row?.serviceId == "24") {
                      localStorage.setItem(
                        "issuanceOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "25") {
                      localStorage.setItem(
                        "renewalOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "26") {
                      localStorage.setItem(
                        "transferOfHawkerLicenseId",
                        record?.row?.id
                      );
                    }
                    router.push(url);
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    {<FormattedLabel id="viewCertificate" />}
                  </Button>
                </IconButton>
              )}

            {/** Generate I card */}
            {(((record?.row?.serviceId == "24" ||
              record?.row?.serviceId == "25" ||
              record?.row?.serviceId == "26") &&
              record?.row?.applicationStatus == "LICENSE_ISSUED") ||
              record?.row?.applicationStatus == "CERTIFICATE_GENERATED") &&
              authority?.find(
                (r) => r === "I_CARD_ISSUANCE" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    setValue("loadderState", true);

                    let url = ``;
                    let finalBodyForApi;
                    const routerPushUrl = `/streetVendorManagementSystem/components/IdentityCard`;

                    if (record?.row?.serviceId == "24") {
                      finalBodyForApi = {
                        id: record?.row?.id,
                        role: "I_CARD_ISSUANCE",
                        approveRemark: "I Card Issued",
                      };
                      url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
                    } else if (record?.row?.serviceId == "25") {
                      finalBodyForApi = {
                        id: record?.row?.id,
                        certificateNo: record?.row?.certificateNo,
                        renewalOfliscenseId: record?.row?.id,
                        role: "I_CARD_ISSUANCE",
                        approveRemark: "I Card Issued",
                      };
                      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfHawkerLicenseApprove`;
                    } else if (record?.row?.serviceId == "26") {
                      finalBodyForApi = {
                        id: record?.row?.id,
                        role: "I_CARD_ISSUANCE",
                        approveRemark: "I Card Issued",
                      };
                      url = `${urls.HMSURL}/transferOfHawkerLicense/saveTransferOfHawkerLicenseApprove`;
                    } else if (record?.row?.serviceId == "27") {
                      finalBodyForApi = {
                        id: record?.row?.id,
                        role: "I_CARD_ISSUANCE",
                        approveRemark: "I Card Issued",
                      };
                      url = `${urls.HMSURL}/cancellationOfHawkerLicense/saveCancellationOfHawkerLicenseApprove`;
                    }

                    axios
                      .post(url, finalBodyForApi, {
                        headers: {
                          Authorization: `Bearer ${userToken}`,
                        },
                      })
                      .then((res) => {
                        setValue("loadderState", false);
                        if (res?.status == 200 || res?.status == 201) {
                          sweetAlert({
                            title:
                              language == "en" ? "Generated!" : "व्युत्पन्न!",
                            text:
                              language == "en"
                                ? "ICard Generated successfully"
                                : "आयकार्ड यशस्वीरित्या व्युत्पन्न झाले",
                            icon: "success",
                            buttons: {
                              ok: language == "en" ? "OK" : "ठीक आहे",
                            },
                          });

                          if (record?.row?.serviceId == "24") {
                            localStorage.setItem(
                              "issuanceOfHawkerLicenseId",
                              record?.row?.id
                            );
                          } else if (record?.row?.serviceId == "25") {
                            localStorage.setItem(
                              "renewalOfHawkerLicenseId",
                              record?.row?.id
                            );
                          } else if (record?.row?.serviceId == "26") {
                            localStorage.setItem(
                              "transferOfHawkerLicenseId",
                              record?.row?.id
                            );
                          }

                          router.push(routerPushUrl);
                        }
                      })
                      .catch((error) => {
                        setValue("loadderState", false);
                        callCatchMethod(error, language);
                      });
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="generateIDCard" />}
                  </Button>
                </IconButton>
              )}

            {/**  View I Card */}
            {(((record?.row?.serviceId == "24" ||
              record?.row?.serviceId == "25" ||
              record?.row?.serviceId == "26") &&
              record?.row?.applicationStatus == "LICENSE_ISSUED") ||
              record?.row?.applicationStatus == "I_CARD_ISSUED" ||
              record?.row?.applicationStatus == "I_CARD_GENERATED") &&
              authority?.find((r) => r === "I_CARD_VIEW" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    const url = `/streetVendorManagementSystem/components/IdentityCard`;

                    if (record?.row?.serviceId == "24") {
                      localStorage.setItem(
                        "issuanceOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "25") {
                      localStorage.setItem(
                        "renewalOfHawkerLicenseId",
                        record?.row?.id
                      );
                    } else if (record?.row?.serviceId == "26") {
                      localStorage.setItem(
                        "transferOfHawkerLicenseId",
                        record?.row?.id
                      );
                    }
                    router.push(url);
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    {<FormattedLabel id="viewIDCard" />}
                  </Button>
                </IconButton>
              )}

            {/** Cancell Certificate */}
            {record?.row?.serviceId == "27" &&
              record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LICENSE_CANCLE" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    setValue("loadderState", true);

                    let url = ``;
                    let finalBodyForApi;
                    const routerPushPath = `/streetVendorManagementSystem/transactions/cancellationOfStreetVendorLicense/LetterCancellationofHawkerLicense`;

                    finalBodyForApi = {
                      id: record?.row?.id,
                      role: "LICENSE_CANCLE",
                      approveRemark: "LICENSE_CANCLE",
                    };
                    url = `${urls.HMSURL}/cancellationOfHawkerLicense/saveCancellationOfHawkerLicenseApprove`;

                    axios
                      .post(url, finalBodyForApi, {
                        headers: {
                          Authorization: `Bearer ${userToken}`,
                        },
                      })
                      .then((res) => {
                        if (res?.status == 200 || res?.status == 201) {
                          setValue("loadderState", false);
                          sweetAlert({
                            title:
                              language == "en" ? "Cancelled!" : "रद्द केले!",
                            text:
                              language == "en"
                                ? "Certificate Cancelled successfully"
                                : "प्रमाणपत्र यशस्वीरित्या रद्द केले",
                            icon: "success",
                            buttons: {
                              ok: language == "en" ? "OK" : "ठीक आहे",
                            },
                          });

                          localStorage.setItem(
                            "cancellationOfHawkerLicenseId",
                            record?.row?.id
                          );
                          router.push(routerPushPath);
                        } else {
                          setValue("loadderState", false);
                        }
                      })
                      .catch((error) => {
                        setValue("loadderState", false);
                        callCatchMethod(error, language);
                      });
                  }}
                >
                  <Button variant="contained" size="small">
                    {<FormattedLabel id="cancelCertificate" />}
                  </Button>
                </IconButton>
              )}

            {/** view cancellation Letter */}
            {record?.row?.serviceId == "27" &&
              record?.row?.applicationStatus == "LICENSE_CANCELLED" &&
              authority?.find(
                (r) => r === "LICENSE_CANCLE" || r === "ADMIN"
              ) && (
                <IconButton
                  onClick={() => {
                    const url = `/streetVendorManagementSystem/transactions/cancellationOfStreetVendorLicense/LetterCancellationofHawkerLicense`;

                    if (record?.row?.serviceId == "27") {
                      localStorage.setItem(
                        "cancellationOfHawkerLicenseId",
                        record?.row?.id
                      );
                    }
                    router.push(url);
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    <FormattedLabel id="viewCancellationLetter" />
                  </Button>
                </IconButton>
              )}
          </>
        );
      },
    },
  ];

  // getserviceNames
  const getserviceNames = () => {
    const url = `${urls.CFCURL}/master/service/getAll`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setServiceNames(
            r?.data?.service?.map((row) => ({
              id: row?.id,
              serviceName: row?.serviceName,
              serviceNameMr: row?.serviceNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // onSubmit - mainForm
  const onSubmitForm = (data) => {
  };

  // remarkFunction
  const remarkFun = (data) => {
    setValue("loadderState", true);
    let approveRemark;
    let rejectRemark;
    let finalBodyForApi;

    // Appprove
    if (data == "Approve") {
      approveRemark = watch("verificationRemark");
      finalBodyForApi = {
        approveRemark,
        rejectRemark,
        id: getValues("id"),
        serviceId: getValues("serviceId"),
        desg: hardCodeAuthority,
        role: hardCodeAuthority,
      };

      let url = ``;
      if (finalBodyForApi?.serviceId == "24") {
        url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
      } else if (finalBodyForApi?.serviceId == "25") {
        url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfHawkerLicenseApprove`;
      } else if (finalBodyForApi?.serviceId == "27") {
        url = `${urls.HMSURL}/cancellationOfHawkerLicense/saveCancellationOfHawkerLicenseApprove`;
      } else if (finalBodyForApi?.serviceId == "26") {
        url = `${urls.HMSURL}/transferOfHawkerLicense/saveTransferOfHawkerLicenseApprove`;
      }

      axios
        .post(url, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setValue("loadderState", false);
          if (res?.status == 200 || res?.status == 201) {
            language == "en"
              ? sweetAlert("verification successfully completed", {
                icon: "success",
                buttons: { ok: "OK" },
              })
              : sweetAlert("सत्यापन यशस्वीरित्या पूर्ण झाले", {
                icon: "success",
                buttons: { ok: "ठीक आहे" },
              });

            approveRevertRemarkDailogClose();
            router.push("/streetVendorManagementSystem/dashboards");
          }
        })
        .catch((error) => {
          setValue("loadderState", false);
          callCatchMethod(error, language);
        });
    }
    // Revert
    else if (data == "Revert") {
      if (
        watch("verificationRemark") != "" &&
        watch("verificationRemark") != null &&
        watch("verificationRemark") != undefined
      ) {
        rejectRemark = watch("verificationRemark");

        finalBodyForApi = {
          approveRemark,
          rejectRemark,
          id: getValues("id"),
          serviceId: getValues("serviceId"),
          desg: hardCodeAuthority,
          role: hardCodeAuthority,
        };

        let url = ``;
        if (finalBodyForApi?.serviceId == "24") {
          url = `${urls.HMSURL}/IssuanceofHawkerLicense/saveApplicationApproveByDepartment`;
        } else if (finalBodyForApi?.serviceId == "25") {
          url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/saveRenewalOfHawkerLicenseApprove`;
        } else if (finalBodyForApi?.serviceId == "27") {
          url = `${urls.HMSURL}/cancellationOfHawkerLicense/saveCancellationOfHawkerLicenseApprove`;
        } else if (finalBodyForApi?.serviceId == "26") {
          url = `${urls.HMSURL}/transferOfHawkerLicense/saveTransferOfHawkerLicenseApprove`;
        }

        axios
          .post(url, finalBodyForApi, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((res) => {
            setValue("loadderState", false);

            if (res?.status == 200 || res?.status == 201) {
              language == "en"
                ? sweetAlert("application successfully reassigned", {
                  icon: "success",
                  buttons: { ok: "OK" },
                })
                : sweetAlert("अर्ज यशस्वीरित्या पुन्हा नियुक्त केला", {
                  icon: "success",
                  buttons: { ok: "ठीक आहे" },
                });

              approveRevertRemarkDailogClose();
              router.push("/streetVendorManagementSystem/dashboards");
            }
          })
          .catch((error) => {
            setValue("loadderState", false);
            callCatchMethod(error, language);
          });
      } else {
        setValue("loadderState", false);
        language == "en"
          ? sweetAlert("Remark is Required !!!", {
            icon: "error",
            buttons: { ok: "OK" },
          })
          : sweetAlert("टिप्पणी आवश्यक आहे !!!", {
            icon: "error",
            buttons: { ok: "ठीक आहे" },
          });
      }
    }
  };

  // getIssuanceOfHawkerLicense - tableData
  const getIssuanceOfHawkerLicense = () => {
    setValue("loadderState", true);

    let tempStatues = [];

    // ward Officer
    if (authority?.includes("DEPT_CLERK_VERIFICATION")) {
      tempStatues?.push("APPLICATION_CREATED");
      tempStatues?.push("APPLICATION_SENT_BACK_TO_DEPT_CLERK");
    }

    //  site Visit Schedule
    if (authority?.includes("SITE_VISIT_SCHEDULE")) {
      tempStatues?.push("DEPT_CLERK_VERIFICATION_COMPLETED");
    }

    // site Visit
    if (authority?.includes("SITE_VISIT")) {
      tempStatues?.push("SITE_VISIT_SCHEDULED");
      tempStatues?.push("SITE_VISIT_RESCHEDULED");
    }

    // admin Officer
    if (authority?.includes("ADMIN_OFFICER")) {
      tempStatues?.push("SITE_VISIT_COMPLETED");
      tempStatues?.push("APPLICATION_SENT_TO_ADMIN_OFFICER");
      tempStatues?.push("APPLICATION_SENT_BACK_TO_ADMIN_OFFICER");
    }

    // ward Officer
    if (authority?.includes("WARD_OFFICER")) {
      tempStatues?.push("APPLICATION_SENT_TO_WARD_OFFICER");
    }

    //   loi Generation
    if (authority?.includes("LOI_GENERATION")) {
      tempStatues?.push("APPLICATION_VERIFICATION_COMPLETED");
    }

    // loi Preview
    if (authority?.includes("LOI_RECEIPT")) {
      tempStatues?.push("LOI_GENERATED");
    }
    // payment Collection
    if (authority?.includes("LOI_COLLECTION")) {
      tempStatues?.push("LOI_GENERATED");
    }

    //  payment Receipt
    if (authority?.includes("PAYMENT_RECEIPT")) {
      tempStatues?.push("PAYEMENT_SUCCESSFUL");
    }

    //  license Issuance
    if (authority?.includes("LICENSE_ISSUANCE")) {
      tempStatues?.push("PAYEMENT_SUCCESSFUL");
    }

    // license View
    if (authority?.includes("LICENSE_VIEW")) {
      tempStatues?.push("CERTIFICATE_GENERATED");
    }

    // iCard Issuance
    if (authority?.includes("I_CARD_ISSUANCE")) {
      tempStatues?.push("CERTIFICATE_GENERATED");
    }

    // iCard View
    if (authority?.includes("I_CARD_VIEW")) {
      tempStatues?.push("I_CARD_GENERATED");
    }

    // Admin
    if (authority?.includes("ADMIN")) {
      tempStatues?.push("APPLICATION_CREATED");
      tempStatues?.push("DEPT_CLERK_VERIFICATION_COMPLETED");
      tempStatues?.push("APPLICATION_SENT_BACK_TO_DEPT_CLERK");
      tempStatues?.push("SITE_VISIT_SCHEDULED");
      tempStatues?.push("SITE_VISIT_RESCHEDULED");
      tempStatues?.push("SITE_VISIT_COMPLETED");
      tempStatues?.push("CERTIFICATE_GENERATED");
      tempStatues?.push("I_CARD_GENERATED");
      tempStatues?.push("APPLICATION_SENT_TO_ADMIN_OFFICER");
      tempStatues?.push("APPLICATION_SENT_BACK_TO_ADMIN_OFFICER");
      tempStatues?.push("APPLICATION_SENT_TO_WARD_OFFICER");
      tempStatues?.push("APPLICATION_VERIFICATION_COMPLETED");
      tempStatues?.push("LOI_GENERATED");
      tempStatues?.push("PAYEMENT_SUCCESSFUL");
      tempStatues?.push("LICENSE_ISSUED");
      tempStatues?.push("I_CARD_ISSUED");
    }

    // body
    const body = {
      applicationStatuses: tempStatues,
    };


    if (
      tempStatues != null &&
      tempStatues != undefined &&
      tempStatues?.length != 0
    ) {
      setValue("loadderState", true);
      axios
        .get(`${urls.HMSURL}/report/getDashboardDtlNew`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            whichOne: whichOne,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            if (r?.data != null && r?.data != undefined) {
              setValue("loadderState", true);
              finaDataFilter(r?.data);
            }
          }
        })
        .catch((error) => {
          setValue("loadderState", false);
          callCatchMethod(error, language);
        });
    } else {
      setValue("loadderState", false);
    }
  };
  //--------

  // getApplicationCount
  const getApplicationCount = () => {
    // INCOMING -Pending
    axios
      .get(`${urls.HMSURL}/report/getDashboardCount`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          whichOne: "INCOMING",
        },
      })

      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          let count = 0;
          r?.data?.forEach((data) => {
            count += data?.count;
          });
          setPendingApplicationCount(count);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    // APPROVED -APPROVED
    axios
      .get(`${urls.HMSURL}/report/getDashboardCount`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          whichOne: "APPROVED",
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          let count = 0;
          r?.data?.forEach((data) => {
            count += data?.count;
          });
          setApprovedApplicationCount(count);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    // REVERT -REVERT
    axios
      .get(`${urls.HMSURL}/report/getDashboardCount`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          whichOne: "REVERT",
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          let count = 0;
          r?.data?.forEach((data) => {
            count += data?.count;
          });
          setRejectedApplicationCount(count);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getHawkerData
  const getHawkerLicneseData = () => {
    let url = ``;
    // issuance
    if (applicationData?.serviceId == "24") {
      url = `${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${applicationData?.id}`;
    }
    // renewal
    else if (applicationData?.serviceId == "25") {
      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/getById?id=${applicationData?.id}`;
    }
    // cancellation
    else if (applicationData?.serviceId == "27") {
      url = `${urls.HMSURL}/cancellationOfHawkerLicense/getById?id=${applicationData?.id}`;
    }
    // transfer
    else if (applicationData?.serviceId == "26") {
      url = `${urls.HMSURL}/transferOfHawkerLicense/getById?id=${applicationData?.id}`;
    }

    // Get By ID issuance Of Hawker License
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setApplicationData1(r?.data);
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  const finaDataFilter = (tableData) => {
    if (
      tableData?.length != 0 &&
      tableData != null &&
      tableData != undefined &&
      tableData != "" &&
      serviceNames?.length != 0
    ) {
      const finalData = tableData?.map((data, index) => {
        return {
          ...data,
          srNo: index + 1,
          serviceName: serviceNames.find((s) => s.id == data.serviceId)
            ?.serviceName,
          serviceNameMr: serviceNames.find((s) => s.id == data.serviceId)
            ?.serviceNameMr,
          applicationDate1:
            moment(data?.applicationDate).format("DD-MM-YYYY") != "Invalid date"
              ? moment(data?.applicationDate).format("DD-MM-YYYY")
              : "-",
        };
      });

      setFinalTableData(finalData);
      setValue("loadderState", false);
    } else {
      setFinalTableData([]);
      setValue("loadderState", false);
    }
  };

  //!  ==============>  Use Effects <======================

  // initial useEffect
  useEffect(() => {
    setValue("loadderState", true);
    getserviceNames();
    localStorage.removeItem("applicationRevertedToCititizen");
    localStorage.removeItem("draft");
    localStorage.removeItem("issuanceOfHawkerLicenseId");
    localStorage.removeItem("renewalOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("cancellationOfHawkerLicenseId");
    localStorage.removeItem("transferOfHawkerLicenseId");
    localStorage.removeItem("issuanceOfHawkerLicenseInputState");
    localStorage.removeItem("castOtherA");
    localStorage.removeItem("castCategoryOtherA");
    localStorage.removeItem("applicantTypeOtherA");
    localStorage.removeItem("disabledFieldInputState");
    localStorage.removeItem("disablityNameYN");
    localStorage.removeItem("QueryParamsData");
    localStorage.removeItem("oldLicenseYNA");
    localStorage.removeItem("voterNameYNA");
    localStorage.removeItem("disablityNameYNA");

    const auth = user?.menus?.find((r) => {
      if (
        r?.id == selectedMenuFromDrawer ||
        r?.id == "5061" ||
        r?.id == "276"
      ) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
  }, []);

  useEffect(() => {
    setValue("loadderState", true);
    if (
      whichOne != undefined &&
      whichOne != "" &&
      authority != undefined &&
      authority != "" &&
      authority.length != "0" &&
      serviceNames != undefined &&
      serviceNames != "" &&
      serviceNames != undefined &&
      serviceNames.length != "0"
    ) {
      getIssuanceOfHawkerLicense();
    }

    getApplicationCount();
  }, [whichOne, authority, serviceNames]);

  useEffect(() => {
    if (
      applicationData?.serviceId != null &&
      applicationData?.serviceId != undefined &&
      applicationData?.serviceId != ""
    ) {
      getHawkerLicneseData();
    }
  }, [applicationData]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div>
          <Paper elevation={5} className={styles.paper} component={Box}>
            {/** Dashboard Card  */}

            <div>
              <Paper
                className={styles.hearderPaper}
                component={Box}
                squar="true"
                elevation={5}
              >
                <Grid container>
                  {/** Applications Tabs */}
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className={DashboardCSS.DashBoardHeader}>
                      {<FormattedLabel id="hmsDashboard" />}
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Paper
                      className={styles.cardPaper}
                      squar="true"
                      component={Box}
                      elevation={5}
                    >
                      <div className={styles.test}>
                        <div className={styles.Approved}>
                          {/** Total Application */}
                          <div>
                            <Button
                              className={DashboardCSS.Button1111}
                              onClick={() => {
                                setWhichOne("TOTAL");
                              }}
                            >
                              <div className={DashboardCSS.oneApplication}>
                                <div
                                  className={DashboardCSS.HeaderIconStartText}
                                >
                                  <PeopleIcon color="secondary" />
                                </div>
                                <div
                                  className={DashboardCSS.HeaderIconMiddleText}
                                >
                                  {<FormattedLabel id="totalApplication" />}
                                </div>
                                <div
                                  className={`${DashboardCSS.HeaderIconEndText} ${DashboardCSS.TotalApplicationColor}`}
                                >
                                  {<FormattedLabel id="count" />}
                                </div>
                              </div>
                            </Button>
                          </div>

                          <div className={styles.Approved1}>
                            {/** Divider */}
                            <Divider
                              className={DashboardCSS.Divider}
                              orientation="vertical"

                              variant="middle"
                              flexItem
                            />
                          </div>
                        </div>

                        <div className={styles.Approved}>
                          {/** Approved Application */}

                          <div>
                            <Button
                              onClick={() => {
                                setWhichOne("APPROVED");
                              }}
                              className={DashboardCSS.Button1111}
                            >
                              <div className={DashboardCSS.oneApplication}>
                                <div
                                  className={DashboardCSS.HeaderIconStartText}
                                >
                                  <ThumbUpAltIcon color="success" />
                                </div>

                                <div
                                  className={DashboardCSS.HeaderIconMiddleText}
                                >
                                  {language == "en"
                                    ? "Approved Application"
                                    : "मंजूर अर्ज"}
                                </div>
                                <div
                                  className={`${DashboardCSS.HeaderIconEndText} ${DashboardCSS.ApprovedApplicationColor}`}
                                >
                                  {approvedApplicationCount}
                                </div>
                              </div>
                            </Button>
                          </div>

                          {/** Vertical Line */}
                          <div className={styles.Approved1}>
                            <Divider
                              className={DashboardCSS.Divider}
                              orientation="vertical"

                              variant="middle"
                              flexItem
                            />
                          </div>
                        </div>

                        <div className={styles.Approved}>
                          {/** Pending Applications */}

                          <div>
                            <Button
                              className={DashboardCSS.Button1111}
                              onClick={() => {
                                setWhichOne("INCOMING");
                              }}
                            >
                              <div className={DashboardCSS.oneApplication}>
                                <div
                                  className={DashboardCSS.HeaderIconStartText}
                                >
                                  <PendingActionsIcon color="warning" />
                                </div>

                                <div
                                  className={DashboardCSS.HeaderIconMiddleText}
                                >
                                  {language == "en"
                                    ? "Pending Application"
                                    : "प्रलंबित अर्ज"}
                                </div>
                                <div
                                  className={`${DashboardCSS.HeaderIconEndText} ${DashboardCSS.PendingApplicationColor}`}
                                >
                                  {pendingApplicationCount}
                                </div>
                              </div>
                            </Button>
                          </div>
                          {/** Vertical Line */}
                          <div className={styles.Approved1}>
                            <Divider

                              className={DashboardCSS.Divider}
                              orientation="vertical"

                              variant="middle"
                              flexItem
                            />
                          </div>
                        </div>

                        <div className={styles.Approved}>
                          {/** Rejected Application */}
                          <div>
                            <Button
                              className={DashboardCSS.Button1111}
                              onClick={() => {
                                setWhichOne("REVERT");
                              }}
                            >
                              <div className={DashboardCSS.oneApplication}>
                                <div
                                  className={DashboardCSS.HeaderIconStartText}
                                >
                                  <CancelIcon color="error" />
                                </div>

                                <div
                                  className={DashboardCSS.HeaderIconMiddleText}
                                >
                                  {language == "en"
                                    ? "Rejected Application"
                                    : "नाकारलेले अर्ज"}
                                </div>
                                <div
                                  className={`${DashboardCSS.HeaderIconEndText} ${DashboardCSS.RejectedApplicationColor}`}
                                >
                                  {rejectedApplicationCount}
                                </div>
                              </div>
                            </Button>
                          </div>
                          {/** Vertical Line */}
                          <div className={styles.Approved1}>
                            <Divider

                              className={DashboardCSS.Divider}
                              orientation="vertical"

                              variant="middle"
                              flexItem
                            />
                          </div>
                        </div>
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </div>

            {/* {reRenderCount} */}

            {/** Other */}
            <div>
              <Paper
                className={styles.tablePaper}
                component={Box}
                squar="true"
                elevation={5}
              >
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    {/** DashBoard Table OK  */}
                    <DataGrid
                      componentsProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                          printOptions: { disableToolbarButton: true },
                          csvOptions: { disableToolbarButton: true },
                        },
                      }}
                      components={{ Toolbar: GridToolbar }}
                      sx={{
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
                      density="standard"
                      autoHeight={true}
                      getRowId={(row) => row.srNo}
                      rows={
                        finalTableData != undefined && finalTableData != null
                          ? finalTableData
                          : []
                      }
                      columns={columns}
                      pageSize={10}
                    // rowsPerPageOptions={[5, 10, 20, 50, 100]}
                    // defaultSortModel={[
                    //   {
                    //     field: "applicationNumber",
                    //     sort: "asc",
                    //   },
                    // ]}
                    />



                    <ThemeProvider theme={theme}>
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
                            width: "500px",
                          }}
                          elevation={5}
                          component={Box}
                        >
                          <CssBaseline />
                          <SiteVisitSchedule
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

                      {/**  Verification  */}
                      <Dialog
                        fullWidth
                        maxWidth={"xl"}
                        open={verificationDailog}
                        onClose={() => verificationClose()}
                      >
                        <CssBaseline />
                        <DialogTitle>
                          {<FormattedLabel id="basicApplicationDetails" />}
                        </DialogTitle>
                        <DialogContent>
                          <VerificationAppplicationDetails
                            props={applicationData1}
                            siteVisitPreviewButtonInputState={
                              siteVisitPreviewButtonInputState
                            }
                          />
                        </DialogContent>
                        <DialogTitle>
                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Stack
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                              spacing={3}
                              direction={"row"}
                            >
                              <Button
                                variant="contained"
                                onClick={() => approveRevertRemarkDailogOpen()}
                              >
                                {<FormattedLabel id="action" />}
                              </Button>
                              <Button
                                style={{ backgroundColor: "red" }}
                                variant="contained"
                                onClick={() => verificationClose()}
                              >
                                {<FormattedLabel id="exit" />}
                              </Button>
                            </Stack>
                          </Grid>
                        </DialogTitle>
                      </Dialog>

                      {/** Approve Button   Preview Dailog  */}
                      <Modal
                        open={approveRevertRemarkDailog}
                        onClose={() => approveRevertRemarkDailogClose()}
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
                            height: "400px",
                            width: "600px",
                          }}
                          elevation={5}
                          component={Box}
                        >
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
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                style={{
                                  marginBottom: "30px",
                                  marginTop: "20px",
                                }}
                                variant="h6"
                              >
                                {
                                  <FormattedLabel id="enterRemarkForApplication" />
                                }
                              </Typography>
                              <br />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <TextareaAutosize
                                style={{
                                  width: "550px",
                                  height: "200px",
                                  display: "flex",
                                  justifyContent: "center",
                                  marginBottom: "30px",
                                }}
                                {...register("verificationRemark")}
                              />
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Stack spacing={5} direction="row">
                                <Button
                                  variant="contained"
                                  style={{ backgroundColor: "green" }}
                                  onClick={() => remarkFun("Approve")}
                                >
                                  {<FormattedLabel id="approve" />}
                                </Button>
                                <Button
                                  variant="contained"
                                  onClick={() => remarkFun("Revert")}
                                >
                                  {<FormattedLabel id="reassign" />}
                                </Button>
                                {/** Form Preview Button */}
                                <Button
                                  style={{ backgroundColor: "red" }}
                                  onClick={() =>
                                    approveRevertRemarkDailogClose()
                                  }
                                >
                                  {<FormattedLabel id="exit" />}
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Modal>
                    </ThemeProvider>
                  </form>
                </FormProvider>
              </Paper>
            </div>
            <br />
          </Paper>
        </div>
      )}
    </>
  );
};

export default Index;
