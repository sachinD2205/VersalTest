import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SearchIcon from "@mui/icons-material/Search";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import UploadButton1 from "../../fileUpload/UploadButton1";
import AadharAuthentication from "./AadharAuthentication";
import AdditionalDetails from "./AdditionalDetails";
import AddressOfHawker from "./AddressOfHawker";
import ApplicationPaymentReceipt from "./ApplicationPaymentReceipt";
import BasicApplicationDetails from "./BasicApplicationDetails";
import HawkerDetails from "./HawkerDetails";
import Identity from "./Identity";
import IssuanceOfStreetVendorLicenseCertificate from "./issuanceOfStreetVendorLicenseCertificate";
import LoiCollectionComponent from "./LoiCollectionComponent";
import LoiGenerationComponent from "./LoiGenerationComponent";
import LoiGenerationRecipt from "./LoiGenerationRecipt";
import PropertyAndWaterTaxes from "./PropertyAndWaterTaxes";
import SiteVisit from "./SiteVisit";
import SiteVisitSchedule from "./SiteVisitSchedule";
import VerificationAppplicationDetails from "./VerificationAppplicationDetails";
import styles from "../../../components/streetVendorManagementSystem/styles/deparmentalCleark.module.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

// Main Component - Clerk
const Index = () => {
  // Methods in useForm
  const methods = useForm({
    defaultValues: {
      aadhaarCardPhoto: null,
      panCardPhoto: null,
      rationCardPhoto: null,
      disablityCertificatePhoto: null,
      otherDocumentPhoto: null,
      affidaviteOnRS100StampAttache: null,
      serviceName: "",
      formPreviewDailogState: false,
      applicationNumber: "HMS089734584837",
      applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      trackingID: "46454565454445",
      citySurveyNo: "",
      hawkingZoneName: "",
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      religion: "",
      cast: "",
      subCast: "",
      dateOfBirth: null,
      age: "",
      typeOfDisability: "",
      mobile: "",
      emailAddress: "",
      crCitySurveyNumber: "",
      crAreaName: "",
      crLandmarkName: "",
      crVillageName: "",
      crCityName: "Pimpri-Chinchwad",
      crState: "Maharashtra",
      crPincode: "",
      crLattitude: "",
      crLogitude: "",
      addressCheckBox: "",
      prCitySurveyNumber: "",
      prAreaName: "",
      prLandmarkName: "",
      prVillageName: "",
      prCityName: "Pimpri-Chinchwad",
      prState: "Maharashtra",
      prPincode: "",
      prLattitude: "",
      prLogitude: "",
      wardNo: "",
      wardName: "",
      natureOfBusiness: "",
      hawkingDurationDaily: "",
      hawkerType: "",
      item: "",
      periodOfResidenceInMaharashtra: null,
      periodOfResidenceInPCMC: null,
      rationCardNo: "",
      bankMaster: "",
      branchName: "",
      bankAccountNo: "",
      ifscCode: "",
      crPropertyTaxNumber: "",
      proprtyAmount: "",
      crWaterConsumerNo: "",
      waterAmount: "",
      inputState: true,
      serviceName: "",
    },
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;
  const userToken = useGetToken();

  // role base
  const [authority, setAuthority] = useState();
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("SachinUser", auth);
  }, []);

  const [panCardPhoto, setPanCardPhoto] = useState();
  const [aadhaarCardPhoto, setAadhaarCardPhoto] = useState(null);
  const [rationCardPhoto, setRationCardPhoto] = useState(null);
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] =
    useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] =
    useState(null);

  //=============================================================================>
  const [pendingApplication, setPendingApplication] = useState(0);
  const [rejectedApplication, setRejectedApplication] = useState(0);
  const [approvedApplication, setApprovedApplication] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);
  const [applicationData, setApplicationData] = useState();
  const [tableData, setTableData] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [appID, setappID] = useState();
  // Dailog And Modal == States

  // Form Preview - ===================>
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  // Remark Document Preview
  const [documentRemarkModal, DocumentModal] = useState(false);
  const documentRemarkModalOpen = () => DocumentModal(true);
  const documentRemarkModalClose = () => DocumentModal(false);

  // site Schedule Modal
  const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);
  const siteVisitScheduleOpen = () => setSiteVisitScheduleModal(true);
  const siteVisitScheduleClose = () => setSiteVisitScheduleModal(false);

  // site Visit Dailog
  const [siteVisitDailog, setSetVisitDailog] = useState();
  const siteVisitOpen = () => setSetVisitDailog(true);
  const siteVisitClose = () => setSetVisitDailog(false);

  // Loi Generation Open
  const [loiGeneration, setLoiGeneration] = useState(false);
  const loiGenerationOpen = () => setLoiGeneration(true);
  const loiGenerationClose = () => setLoiGeneration(false);

  // Loi Generation  Recipt
  const [loiGenerationRecipt, setLoiGenerationRecipt] = useState(false);
  const loiGenerationReciptOpen = () => setLoiGenerationRecipt(true);
  const loiGenerationReciptClose = () => setLoiGenerationRecipt(false);

  // loi Collection
  const [loiCollection, setLoiCollection] = useState(false);
  const loiCollectionOpen = () => setLoiCollection(true);
  const loiCollectionClose = () => setLoiCollection(false);

  // Loi Collection Payment Recipt
  const [loiCollectionPaymentRecipt, setLoiCollectionPaymentRecipt] =
    useState(false);
  const loiCollectionPaymentReciptOpen = () =>
    setLoiCollectionPaymentRecipt(true);
  const loiCollectionPaymentReciptClose = () =>
    setLoiCollectionPaymentRecipt(false);

  // Generate Certificate
  const [certificate, setCertificate] = useState(false);
  const openCertificate = () => setCertificate(true);
  const closeCertificate = () => setCertificate(false);

  // I Card Certificate
  const [iCard, setICard] = useState(false);
  const openICard = () => setICard(true);
  const closeICard = () => setICard(false);

  // Verification AO Dialog
  const [verificationAoDailog, setVerificationAoDailog] = useState();
  const verificationAoOpne = () => setVerificationAoDailog(true);
  const verificationAoClose = () => setVerificationAoDailog(false);

  //  Api Calls ===================================>

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneKey: row.zoneName,
          }))
        );
      });
  };

  // Ward Keys
  const [wardKeys, setWardKeys] = useState([]);
  // get Ward Keys
  const getWardKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardKey: row.wardName,
          }))
        );
      });
  };

  // Service name
  const [serviceNames, setServiceNames] = useState([]);
  // get Services
  const getServiceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setServiceNames(
          r.data.service.map((row) => ({
            id: row.id,
            serviceName: row.serviceName,
          }))
        );
      });
  };

  // departments name
  const [departments, setDepartments] = useState([]);
  // get departments
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
      });
  };

  // Use Effect
  useEffect(() => {
    getWardKeys();
    getZoneKeys();
    getServiceNames();
    getDepartments();
  }, []);

  setValue("inputState", true);

  // loi Generation
  const loiGenerationFun = () => {
    loiGenerationOpen();
    loiModalClose();
  };

  // Save Remark
  const viewDocumentPreviewSaveRemark = () => {
    documentRemarkModalClose();
    viewDocumentRemarkSuccessNotify();
  };

  // Filter Data on Find Button
  const mrFilterTableData = () => {
    // Approved Application Count
    const tempData = dataSource.filter((data, index) => {
      return data.wardKey == getValues("wardKey");
    });
    setTableData(tempData);
  };

  // Filters  =============================>

  // Reset Data on Reset Button
  const resetFilterData = () => {
    // alert("ok bhai");
  };

  // Approved Application
  const clerkTabClick = (props) => {
    const tableData = dataSource.filter((data, index) => {
      if (data.applicationVerficationStatus == props) {
        return data;
      } else if ("TotalApplications" == props) {
        return data;
      }
    });
    setTableData(tableData);
  };

  const onSubmitForm = () => {};

  useEffect(() => {
    clerkTabClick("TotalApplications");
  }, [dataSource]);

  // Get Table - Data
  const getIssuanceOfHawkerLicense = () => {
    axios
      .get(
        `${urls.HMSURL}/IssuanceofHawkerLicense/getIssuanceOfHawkerLicenseData`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((resp) => {
        console.log(
          "response Data",
          JSON.stringify(resp.data.issuanceOfHawkerLicense)
        );
        setDataSource(resp.data.issuanceOfHawkerLicense);
        setTableData(resp.data.issuanceOfHawkerLicense);

        // Approved Application Count
        const approvedApplicationCount =
          resp.data.issuanceOfHawkerLicense.filter((data, index) => {
            return data.applicationVerficationStatus == "APPROVED";
          });
        setApprovedApplication(approvedApplicationCount.length);

        // Pending Application
        const pendingApplicationCount =
          resp.data.issuanceOfHawkerLicense.filter((data, index) => {
            return data.applicationVerficationStatus == "PENDING";
          });
        setPendingApplication(pendingApplicationCount.length);

        // Rejected  Application
        const rejectedApplicationCount =
          resp.data.issuanceOfHawkerLicense.filter((data, index) => {
            return data.applicationVerficationStatus == "REJECTED";
          });
        setRejectedApplication(rejectedApplicationCount.length);

        // Total  Application
        const totalApplicationCount = resp.data.issuanceOfHawkerLicense.filter(
          (data, index) => {
            return data.applicationVerficationStatus;
          }
        );

        setTotalApplication(totalApplicationCount.length);
      });
  };

  useEffect(() => {
    getIssuanceOfHawkerLicense();
  }, []);

  const sendApprovedNotify = () => {
    toast.success("Approved Successfully !!!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const viewDocumentRemarkSuccessNotify = () => {
    toast.success("Application Reverted !!!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Revert Button
  const revertButton = () => {
    documentPreviewDailogClose();
    documentRemarkModalOpen();
  };

  // Approve Button
  const approveButton = () => {
    documentPreviewDailogClose();
    sendApprovedNotify();
  };

  // useEffect(() => {
  //   console.log("applicationData", applicationData);
  // }, [applicationData]);

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 30,
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      field: "applicationNumber",
      headerName: "Application No.",
      description: "Application Number",
      width: 180,
      // flex: 1,
    },
    {
      field: "applicationDate",
      headerName: "Application Date",
      description: "Application Date",
      width: 120,
      // flex: 1,
    },

    {
      field: "applicantName",
      headerName: "Applicant Name",
      description: "Applicant Name",
      width: 200,
      // flex: 1,
    },

    {
      field: "serviceName",
      headerName: "Service Name",
      description: "Service Name",
      width: 250,
      // flex: 1,
    },
    {
      field: "applicationStatus",
      headerName: "Application Status",
      headerName: "Application Status",
      width: 250,
      // flex: 1,
    },

    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 2000,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            {/**  Verification DEPT Cleark - Button */}
            {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    formPreviewDailogOpen();
                  }}
                >
                  <Button
                    variant="contained"
                    // endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    VERIFICARION DEPT
                  </Button>
                </IconButton>
              )}
            {/** Form Preview Button */}
            {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    formPreviewDailogOpen();
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    View Form
                  </Button>
                </IconButton>
              )}
            {/** View Document Button */}
            {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      documentPreviewDailogOpen();
                    }}
                  >
                    View Document
                  </Button>
                </IconButton>
              )}
            {/** Site Visit Schedule Button */}
            {record?.row?.applicationStatus ==
              "DEPT_CLERK_VERIFICATION_COMPLETED" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      siteVisitScheduleOpen();
                    }}
                  >
                    Site Visit Schedule
                  </Button>
                </IconButton>
              )}
            {/** Site Visit Button */}
            {record?.row?.applicationStatus == "SITE_VISIT_SCHEDULED" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      siteVisitOpen();
                    }}
                  >
                    Site Visit
                  </Button>
                </IconButton>
              )}
            {/** AO  */}
            {record?.row?.applicationStatus === "SITE_VISIT_COMPLETED" &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    verificationAoOpne();
                  }}
                >
                  <Button
                    variant="contained"
                    // endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    VERIFICARION AO
                  </Button>
                </IconButton>
              )}
            {/**  Ward Officer */}
            {record?.row?.applicationStatus ===
              "APPLICATION_SENT_TO_WARD_OFFICER" &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                  }}
                >
                  <Button
                    variant="contained"
                    // endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    VERIFICARION WO
                  </Button>
                </IconButton>
              )}
            {/** LOI Generation Button */}
            {record?.row?.applicationStatus ===
              "APPLICATION_VERIFICATION_COMPLETED" &&
              authority?.find(
                (r) => r === "PAYEMENT_SUCCESSFUL" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiGenerationOpen();
                    }}
                  >
                    LOI Generation
                  </Button>
                </IconButton>
              )}
            {/** LOI Generation Recipt Button */}
            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiGenerationReciptOpen();
                    }}
                  >
                    LOI Generation Recipt
                  </Button>
                </IconButton>
              )}
            {/** LOI Collection Button */}
            {record?.row?.applicationStatus == "LOI_GENERATED" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiCollectionOpen();
                    }}
                  >
                    LOI Collection
                  </Button>
                </IconButton>
              )}
            {/** LOI Collection Recipt Button */}
            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiCollectionPaymentReciptOpen();
                    }}
                  >
                    Payment Recipt
                  </Button>
                </IconButton>
              )}
            {/** Generate certificate */}
            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LICENSE_ISSUANCE" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      openCertificate();
                    }}
                  >
                    View Certificate
                  </Button>
                </IconButton>
              )}
            {/** Generate certificate */}
            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LICENSE_ISSUANCE" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      openICard();
                    }}
                  >
                    View I Card
                  </Button>
                </IconButton>
              )}
            {/** Send To Revert Authority */}
            {/**  
            <IconButton>
              <Button variant='contained' size='small'>
                Revert
              </Button>
            </IconButton> 
          */}
            {/** Send To Next Authority */}
            {/** 
            <IconButton>
              <Button variant='contained' size='small'>
                Send Next Authority
              </Button>
            </IconButton>
            */}
          </>
        );
      },
    },
  ];

  // view
  return (
    <div style={{ backgroundColor: "white" }}>
      <ToastContainer />
      <Paper
        elevation={5}
        sx={{
          // marginLeft: "100px",
          // marginRight: "50px",
          // marginTop: "110px",
          // padding: 1,
          // paddingLeft: "20px",
          backgroundColor: "#F5F5F5",
        }}
        component={Box}
      >
        {/** DashBoard Header */}
        <Grid container>
          {/** Clerk */}
          <Grid item xs={4}>
            <Paper
              sx={{ height: "160px" }}
              component={Box}
              p={2}
              m={2}
              squar="true"
              elevation={5}
            >
              <Typography variant="h6">
                <strong>WelCome </strong>
              </Typography>

              <Typography variant="h6" style={{ justifyContent: "center" }}>
                <strong>Officer Name</strong>
              </Typography>
              <Typography variant="subtitle">
                <strong>Deparmental clark </strong>
              </Typography>
              <br />
            </Paper>
          </Grid>
          {/** Applicatins Tabs */}
          <Grid item xs={8}>
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
                  onClick={() => clerkTabClick("TotalApplications")}
                >
                  <div className={styles.icono}>
                    <BabyChangingStationIcon color="primary" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Total Application</strong>
                  </div>
                  <Typography variant="h6" align="center" color="primary">
                    {totalApplication}
                  </Typography>
                </div>

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>

                {/** Approved Application */}
                <div
                  className={styles.one}
                  onClick={() => clerkTabClick("APPROVED")}
                >
                  <div className={styles.icono}>
                    <ThumbUpAltIcon color="success" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Approved Application</strong>
                  </div>
                  <Typography variant="h6" align="center" color="green">
                    {approvedApplication}
                  </Typography>
                </div>

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>

                {/** Pending Applications */}
                <div
                  className={styles.one}
                  onClick={() => clerkTabClick("PENDING")}
                >
                  <div className={styles.icono}>
                    <PendingActionsIcon color="warning" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center"> Pending Application</strong>
                  </div>
                  <Typography variant="h6" align="center" color="orange">
                    {pendingApplication}
                  </Typography>
                </div>

                {/** Vertical Line */}
                <div className={styles.jugaad}></div>

                {/** Rejected Application */}
                <div
                  className={styles.one}
                  onClick={() => clerkTabClick("REJECTED")}
                >
                  <div className={styles.icono}>
                    <CancelIcon color="error" />
                  </div>
                  <br />
                  <div className={styles.icono}>
                    <strong align="center">Rejected Application</strong>
                  </div>
                  <Typography variant="h6" align="center" color="error">
                    {rejectedApplication}
                  </Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>

        <ThemeProvider theme={theme}>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              {/** Filters */}
              <div className={styles.gridCenter}>
                <Grid
                  container
                  component={Paper}
                  squar="true"
                  elevation={5}
                  m={2}
                  p={2}
                >
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      style={{
                        backgroundColor: "#0084ff",
                        color: "white",
                        fontSize: 19,
                        // marginTop: 30,
                        // marginBottom: 30,
                        padding: 8,
                        paddingLeft: 10,
                        marginLeft: "10px",
                        marginRight: "45px",
                        borderRadius: 100,
                      }}
                    >
                      Filters
                    </Grid>
                  </Grid>
                  <Grid container ml={2}>
                    <Grid itemxs={12} sm={12} md={6} lg={6} xl={6}>
                      <FormControl
                        variant="standard"
                        sx={{ marginTop: 2 }}
                        error={!!errors.serviceName}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="serviceName" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Service Name *"
                              sx={{ width: "38vw" }}
                            >
                              {serviceNames &&
                                serviceNames.map((serviceName, index) => (
                                  <MenuItem key={index} value={serviceName.id}>
                                    {serviceName.serviceName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="serviceName"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.serviceName
                            ? errors.serviceName.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        variant="standard"
                        sx={{ marginTop: 2 }}
                        error={!!errors.zoneKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="zone" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              //sx={{ width: 230 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Zone Name *"
                            >
                              {zoneKeys &&
                                zoneKeys.map((zoneKey, index) => (
                                  <MenuItem key={index} value={zoneKey.id}>
                                    {zoneKey.zoneKey}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="zoneKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.zoneKey ? errors.zoneKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        variant="standard"
                        sx={{ marginTop: 2 }}
                        error={!!errors.wardKey}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="ward" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label="Ward Name *"
                            >
                              {wardKeys &&
                                wardKeys.map((wardKey, index) => (
                                  <MenuItem key={index} value={wardKey.id}>
                                    {wardKey.wardKey}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="wardKey"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.wardKey ? errors.wardKey.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard">
                        <InputLabel htmlFor="standard-adornment">
                          Application Number
                        </InputLabel>
                        <Input
                          id="standard-adornment"
                          {...register("applicantNumber")}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl variant="standard">
                        <InputLabel htmlFor="standard-adornment">
                          Applicant Name
                        </InputLabel>
                        <Input
                          id="standard-adornment"
                          {...register("applicantName")}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      {" "}
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.fromDate}
                      >
                        <Controller
                          name="fromDate"
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    From Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.fromDate ? errors.fromDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.toDate}
                      >
                        <Controller
                          control={control}
                          name="toDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    To Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) => field.onChange(date)}
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size="small"
                                    fullWidth
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.toDate ? errors.toDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container ml={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Button
                        sx={{
                          marginTop: "5vh",
                          margin: "normal",
                          width: 230,
                          size: "medium",
                        }}
                        variant="contained"
                        onClick={() => {
                          mrFilterTableData();
                        }}
                      >
                        Find
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                      <Button
                        sx={{
                          marginTop: "5vh",
                          margin: "normal",
                          width: 230,
                          size: "medium",
                        }}
                        variant="contained"
                        onClick={() => {
                          resetFilterData();
                        }}
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </div>

              {/** DashBoard Table OK  */}
              <DataGrid
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 100 },
                    printOptions: { disableToolbarButton: true },
                    disableExport: false,
                    disableToolbarButton: false,
                    csvOptions: { disableToolbarButton: true },
                  },
                }}
                components={{ Toolbar: GridToolbar }}
                sx={{
                  backgroundColor: "white",
                  m: 2,
                  overflowY: "scroll",
                  "& .MuiDataGrid-columnHeadersInner": {
                    backgroundColor: "#0084ff",
                    color: "white",
                  },
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                density="density"
                autoHeight
                rows={tableData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />

              {/** Form Preview Dailog  - OK */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={formPreviewDailog}
                onClose={() => formPreviewDailogClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      Preview
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            formPreviewDailogClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <BasicApplicationDetails />
                  <HawkerDetails />
                  <AddressOfHawker />
                  <AadharAuthentication />
                  <PropertyAndWaterTaxes />
                  <AdditionalDetails />
                </DialogContent>

                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button onClick={formPreviewDailogClose}>Exit</Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** Document Preview Dailog - OK */}
              <Dialog
                fullWidth
                maxWidth={"md"}
                open={documentPreviewDialog}
                onClose={() => documentPreviewDailogClose()}
              >
                <Paper sx={{ p: 2 }}>
                  <CssBaseline />
                  <DialogTitle>
                    <Grid container>
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        lg={6}
                        xl={6}
                        md={6}
                        sx={{
                          display: "flex",
                          alignItem: "left",
                          justifyContent: "left",
                        }}
                      >
                        Document Preview
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        sm={2}
                        md={4}
                        lg={6}
                        xl={6}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <IconButton
                          aria-label="delete"
                          sx={{
                            marginLeft: "530px",
                            backgroundColor: "primary",
                            ":hover": {
                              bgcolor: "red", // theme.palette.primary.main
                              color: "white",
                            },
                          }}
                        >
                          <CloseIcon
                            sx={{
                              color: "black",
                            }}
                            onClick={() => {
                              documentPreviewDailogClose();
                            }}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </DialogTitle>
                  <DialogContent
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <table
                      style={{
                        border: "1",
                        cellpadding: "5",
                        cellspacing: "5",
                        width: "1000px",
                        height: "400px",
                      }}
                    >
                      <thead
                        style={{
                          height: "50px",
                        }}
                      >
                        <tr
                          style={{
                            backgroundColor: "blue",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <th>sr.no</th>
                          <th>Document Name</th>
                          <th>Mandatory</th>
                          <th>View Document</th>
                        </tr>
                      </thead>
                      <tbody
                        style={{
                          textAlign: "center",
                        }}
                      >
                        <tr>
                          <td>1</td>
                          <td>Aadhaar Card</td>
                          <td>Required</td>
                          <td>
                            <UploadButton1
                              appName="HMS"
                              serviceName="H-IssuanceofHawkerLicense"
                              filePath={setAadhaarCardPhoto}
                              fileName={getValues("aadhaarCardPhoto")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Pan Card</td>
                          <td>Required</td>
                          <td>
                            <UploadButton1
                              appName="HMS"
                              serviceName="H-IssuanceofHawkerLicense"
                              filePath={setPanCardPhoto}
                              fileName={getValues("panCardPhoto")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Ration Card</td>
                          <td>Required</td>
                          <td>
                            <UploadButton1
                              appName="HMS"
                              serviceName="H-IssuanceofHawkerLicense"
                              filePath={setRationCardPhoto}
                              fileName={getValues("rationCardPhoto")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>Disablity Certificate</td>
                          <td>Required</td>
                          <td>
                            <UploadButton1
                              appName="HMS"
                              serviceName="H-IssuanceofHawkerLicense"
                              filePath={disablityCertificatePhoto}
                              fileName={getValues("disablityCertificatePhoto")}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>Affidavite </td>
                          <td>Required</td>
                          <td>
                            <UploadButton1
                              appName="HMS"
                              serviceName="H-IssuanceofHawkerLicense"
                              filePath={seteAffidaviteOnRS100StampAttache}
                              fileName={getValues(
                                "affidaviteOnRS100StampAttache"
                              )}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>6</td>
                          <td>Other Documents</td>
                          <td>Required</td>
                          <td>
                            <UploadButton1
                              appName="HMS"
                              serviceName="H-IssuanceofHawkerLicense"
                              filePath={setOtherDocumentPhoto}
                              fileName={getValues("otherDocumentPhoto")}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </DialogContent>
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button variant="contained" onClick={approveButton}>
                          Approve
                        </Button>
                        <Button variant="contained" onClick={revertButton}>
                          Revert
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                  <DialogTitle>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="contained"
                        onClick={documentPreviewDailogClose}
                      >
                        Exit
                      </Button>
                    </Grid>
                  </DialogTitle>
                </Paper>
              </Dialog>

              {/** Site Visit Modal*/}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={siteVisitDailog}
                onClose={() => siteVisitClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      Site Visit
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            siteVisitClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <BasicApplicationDetails />
                  <HawkerDetails />
                  <AddressOfHawker />
                  <AadharAuthentication />
                  <PropertyAndWaterTaxes />
                  <AdditionalDetails />
                  <SiteVisit
                    siteVisitDailogP={setSetVisitDailog}
                    appID={getValues("id")}
                  />
                </DialogContent>

                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => siteVisitClose()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** Site Visit Schedule Modal OK*/}
              <Modal
                open={siteVisitScheduleModal}
                onClose={() => siteVisitModalClose()}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Paper
                  sx={{
                    // backgroundColor: "#F5F5F5",
                    padding: 2,
                    height: "600px",
                    width: "500px",
                    // display: "flex",
                    // alignItems: "center",
                    // justifyContent: "center",
                  }}
                  elevation={5}
                  component={Box}
                >
                  <CssBaseline />
                  <SiteVisitSchedule appID={getValues("id")} />
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => siteVisitScheduleClose()}
                      >
                        Exit
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal>

              {/** LOI Generation OK */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={loiGeneration}
                onClose={() => loiGenerationClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      LOI Generation
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            loiGenerationClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <LoiGenerationComponent />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => loiGenerationClose()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** LOI Collection Ok */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={loiCollection}
                onClose={() => loiCollectionClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <Grid container>
                    <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                      LOI Collection
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <IconButton
                        aria-label="delete"
                        sx={{
                          marginLeft: "530px",
                          backgroundColor: "primary",
                          ":hover": {
                            bgcolor: "red", // theme.palette.primary.main
                            color: "white",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                          onClick={() => {
                            loiCollectionClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle>
                <DialogContent>
                  <LoiCollectionComponent />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => loiCollectionClose()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** LOI Collection Payment Recipt OK */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={loiCollectionPaymentRecipt}
                onClose={() => loiCollectionPaymentReciptClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <FormattedLabel id="loiPreview" />
                </DialogTitle>
                <DialogContent>
                  <ApplicationPaymentReceipt props={applicationData} />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => loiCollectionPaymentReciptClose()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** LOI Generation  Recipt  OK */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={loiGenerationRecipt}
                onClose={() => loiGenerationReciptClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <FormattedLabel id="loiPreview" />
                </DialogTitle>
                <DialogContent>
                  <LoiGenerationRecipt props={applicationData} />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => loiGenerationReciptClose()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/**  Certificate */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={certificate}
                onClose={() => closeCertificate()}
              >
                <CssBaseline />
                <DialogTitle>
                  <FormattedLabel id="viewCertificate" />
                </DialogTitle>
                <DialogContent>
                  <IssuanceOfStreetVendorLicenseCertificate
                    props={applicationData}
                  />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => closeCertificate()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** I Card Certificate */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={iCard}
                onClose={() => closeICard()}
              >
                <CssBaseline />
                <DialogTitle>
                  <FormattedLabel id="iCard" />
                </DialogTitle>
                <DialogContent>
                  <Identity props={applicationData} />
                </DialogContent>
                <DialogTitle>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button variant="contained" onClick={() => closeICard()}>
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/**  Verification AO */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={verificationAoDailog}
                onClose={() => verificationAoClose()}
              >
                <CssBaseline />
                <DialogTitle>
                  <FormattedLabel id="basicApplicationDetalils" />
                </DialogTitle>
                <DialogContent>
                  <VerificationAppplicationDetails prop={applicationData} />
                </DialogContent>
                <DialogTitle>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Stack
                      style={{ display: "flex", justifyContent: "center" }}
                      spacing={3}
                      direction={"row"}
                    >
                      <Button
                        variant="contained"
                        style={{ backgroundColor: "green" }}
                        onClick={() => verificationAoClose()}
                      >
                        Approveed / Reject
                      </Button>
                      <Button
                        style={{ backgroundColor: "red" }}
                        variant="contained"
                        onClick={() => verificationAoClose()}
                      >
                        Exit
                      </Button>
                    </Stack>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** Revert Remark Modal Preview Dailog  */}
              <Modal
                open={documentRemarkModal}
                onClose={() => documentRemarkModalClose()}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <Paper
                  sx={{
                    backgroundColor: "#F5F5F5",
                    padding: 2,
                    height: "400px",
                    width: "600px",
                    // display: "flex",
                    // alignItems: "center",
                    // justifyContent: "center",
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
                      <h1 id="parent-modal-description"> Remark</h1>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <TextareaAutosize
                        style={{
                          width: "550px",
                          height: "200px",
                        }}
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
                      <Button
                        variant="contained"
                        onClick={viewDocumentPreviewSaveRemark}
                      >
                        Revert Application
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button onClick={documentRemarkModalClose}>Exit</Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal>
            </form>
          </FormProvider>
        </ThemeProvider>
      </Paper>
    </div>
  );
};

export default Index;
