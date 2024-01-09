import {
  Box,
  Grid,
  Paper,
  Button,
  Typography,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  ThemeProvider,
  MenuItem,
  TextField,
  IconButton,
  InputAdornment,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  CssBaseline,
  Modal,
  TextareaAutosize,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DoneIcon from "@mui/icons-material/Done";
import WcIcon from "@mui/icons-material/Wc";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
// import styles from "./deparmentalCleark.module.css";
import styles from "../../../../styles/skysignstyles/deparmentalCleark.module.css";

import { Divider } from "antd";
import axios from "axios";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import SearchIcon from "@mui/icons-material/Search";
import { Search, SearchOutlined } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EventIcon from "@mui/icons-material/Event";
import FlakyIcon from "@mui/icons-material/Flaky";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import LinaerStepper from "../../issuanceOfHawkerLicense";
// import BasicApplicationDetails from "../../components/BasicApplicationDetails";
import IssuanceOfLicense from "../../transactions/components/IssuanceOfLicense";
import ReIssuanceOfLicense from "../../transactions/components/ReIssuanceOfLicense";
import AadharAuthentication from "../../transactions/components/AadharAuthentication";
import AddressOfLicense from "../../transactions/components/AddressOfLicense";
import BusinessOrIndustryInfo from "../../transactions/components/BusinessOrIndustryInfo";
import CancellationofIndustry from "../../transactions/components/CancellationofIndustry";
import IndustryAndEmployeeDetaills from "../../transactions/components/IndustryAndEmployeeDetaills";
// import PartenershipDetail from "../../transactions/components/PartenershipDetail";
import SiteVisit from "../../transactions/components/SiteVisit";
// import HawkerDetails from "../../components/HawkerDetails";
// import AddressOfHawker from "../../components/AddressOfHawker";
// import AadharAuthentication from "../../components/AadharAuthentication";
// import PropertyAndWaterTaxes from "../../components/PropertyAndWaterTaxes";
// import DocumentsUpload from "../../components/DocumentsUpload";
// import AdditionalDetails from "../../components/AdditionalDetails";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
// import DocumentPrivewScreen from "../../components/DocumentPrivewScreen";
// import FormPreview from "../../components/formPreview";
//  import Schema from "../../issuanceOfHawkerLicense/Schema";
// import LoiGeneration from "../../components/LoiGeneration";
// import LoiGenerationReport from "../../components/LoiGenerationReport";

import { ToastContainer, toast } from "react-toastify";

import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
// import BusinessOrIndustryInfo from "../../transactions/components/BusinessOrIndustryInfo";
import PartenershipDetail from "../../transactions/components/PartenershipDetail";
// Main Component - Clerk
const Index = () => {
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);
  const [documentRemarkModal, DocumentModal] = useState(false);
  const documentRemarkModalOpen = () => DocumentModal(true);
  const documentRemarkModalClose = () => DocumentModal(false);
  const [siteVisitModal, setSiteVisitModal] = useState(false);
  const siteVisitModalOpen = () => setSiteVisitModal(true);
  const siteVisitModalClose = () => setSiteVisitModal(false);
  const [LoiModal, setLoiModal] = useState(false);
  const LoiModalOpen = () => setLoiModal(true);
  const LoiModalClose = () => setLoiModal(false);
  // const [loiGeneration, setLoiGeneration] = useState(false);
  const LoiGenerationOpen = () => setLoiGeneration(true);
  const LoiGenerationClose = () => setLoiGeneration(false);
  const [siteVisitDailog, setSetVisitDailog] = useState();
  const siteVisitOpen = () => setSetVisitDailog(true);
  const siteVisitClose = () => setSetVisitDailog(false);
  const [tableData, setTableData] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  // loi Generation
  const loiGeneration = () => {
    setLoiGeneration(true);
  };

  // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`).then((r) => {
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
    axios.get(`${urls.CFCURL}/ward/getAll`).then((r) => {
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
    axios.get(`${urls.CFCURL}/service/getAll`).then((r) => {
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
    axios.get(`${urls.CFCURL}/department/getAll`).then((r) => {
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

  const rows1 = [
    {
      id: 1,
      srNO: 1,
      documentName: "Aadhaar Card",
    },
    {
      id: 2,
      srNO: 1,
      documentName: "Aadhaar Card",
    },
  ];

  const columns1 = [
    {
      field: "srNO",
      headerName: "Sr.No",
      widht: 50,
      align: "center",
    },
    {
      field: "documentName",
      headerName: "Document Name",
      width: 500,
      align: "center",
    },
    {
      field: "actions",
      headerName: "viewButton",
      width: 150,
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <strong>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => {
                  console.log("Yetoy Ka");
                  <a
                    href={`${urls.SSLM}/file/preview?filePath=${getValues(
                      "aadhaarCardPhoto"
                    )}`}
                    target="__blank"
                  ></a>;
                }}
              >
                View
              </Button>
            </strong>
          </>
        );
      },
    },
  ];

  // Methods in useForm
  const methods = useForm({
    defaultValues: {
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
      disbality: "",
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

  setValue("inputState", true);

  // site visit preview
  const siteVisitPreview = () => {
    siteVisitOpen();
    siteVisitModalClose();
  };

  // Application Form Preview
  const ApplicationFormPreview = (props) => {
    reset(props);

    return (
      <>
        <Grid
          container
          alignItems="center"
          justify="center"
          style={{ minWidth: "500px" }}
        >
          <Grid xs="auto">
            <Button
              type="button"
              onClick={() => {
                setDocumentPreviewDialog(true);
              }}
              color="primary"
              variant="contained"
            >
              Preview Application Form
            </Button>
          </Grid>
          <br />
          <br />
        </Grid>

        <></>
      </>
    );
  };

  // Site Visit Form Preview
  const SiteVisitFormPreview = (props) => {
    reset(props);
    siteVisitModalOpen(record);
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
    console.log("tempData", tempData);
    setTableData(tempData);
  };

  // Reset Data on Reset Button
  const resetFilterData = () => {
    alert("ok bhai");
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

  const onSubmitForm = () => { };

  useEffect(() => {
    clerkTabClick("TotalApplications");
  }, [dataSource]);

  // Record Count State
  const [pendingApplication, setPendingApplication] = useState(0);
  const [rejectedApplication, setRejectedApplication] = useState(0);
  const [approvedApplication, setApprovedApplication] = useState(0);
  const [totalApplication, setTotalApplication] = useState(0);

  // Get Table - Data
  const getIssuanceOfHawkerLicense = () => {
    axios
      .get(`${urls.BaseURL}/Trn/ApplicantDetails/getApplicantDetails`)
      .then((resp) => {
        console.log("response Data", JSON.stringify(resp.data));
        // dispach(addAllNewMarriageRegistraction(resp.data));

        // const response = {
        //   ...resp.data,
        //   // srNo: i + 1,
        // };
        setDataSource(resp.data);
        setTableData(resp.data);
        // console.log("response", resp.data);

        // Approved Application Count
        const approvedApplicationCount = resp.data.filter((data, index) => {
          return data.applicationVerficationStatus == "APPROVED";
        });
        setApprovedApplication(approvedApplicationCount.length);

        // Pending Application
        const pendingApplicationCount = resp.data.filter((data, index) => {
          return data.applicationVerficationStatus == "PENDING";
        });
        setPendingApplication(pendingApplicationCount.length);

        // Rejected  Application
        const rejectedApplicationCount = resp.data.filter((data, index) => {
          return data.applicationVerficationStatus == "REJECTED";
        });
        setRejectedApplication(rejectedApplicationCount.length);

        // Total  Application
        const totalApplicationCount = resp.data.filter((data, index) => {
          return data.applicationVerficationStatus;
        });
        setTotalApplication(totalApplicationCount.length);
      });
  };

  useEffect(() => {
    getIssuanceOfHawkerLicense();
  }, []);

  // view
  const viewRecord = (record) => {
    const record1 = { ...record };
    ApplicationFormPreview(record1);
    formPreviewDailogOpen();
    // setFormDailogState(true);
    // setValue("formPreviewDailogState", true);
  };

  // view
  const viewRecord1 = (record) => {
    const record1 = { ...record };
    ApplicationFormPreview(record1);
    documentPreviewDailogOpen();
    // setValue("formPreviewDailogState", true);
  };

  // Site Visit
  const siteVisit = (record) => {
    const record2 = { ...record };
    reset(record2);
    siteVisitModalOpen();
  };

  const loiGenerationModal = (record) => {
    LoiModalOpen();
  };

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

  // Columns
  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      description: "Serial Number",
      width: 30,
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
      field: "gFName",
      headerName: "Applicant Name",
      description: "Applicant Name",
      width: 100,
      // flex: 1,
    },
    {
      field: "departments",
      headerName: "Department Name",
      description: "Department Name",
      width: 120,
      // flex: 1,
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      description: "Service Name",
      width: 120,
      // flex: 1,
    },
    {
      field: "applicationVerficationStatus",
      headerName: "Status",
      headerName: "Status",
      width: 100,
      // flex: 1,
    },

    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      // flex: 1,
      width: 800,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            <IconButton onClick={() => viewRecord(record.row)}>
              <Button endIcon={<VisibilityIcon />} size="small">
                View Form
              </Button>
              {/* <VisibilityIcon /> */}
            </IconButton>

            <IconButton
            // onClick={() => viewRecord(record.row)}
            >
              <Button
                endIcon={<VisibilityIcon />}
                size="small"
                onClick={() => viewRecord1(record.row)}
              >
                View Document
              </Button>
              {/* <VisibilityIcon /> */}
            </IconButton>

            <IconButton
            // onClick={() => viewRecord(record.row)}
            >
              <Button size="small" onClick={() => siteVisit(record.row)}>
                Site Visit
              </Button>
              {/* <VisibilityIcon /> */}
            </IconButton>

            <IconButton
            // onClick={() => viewRecord(record.row)}
            >
              <Button
                size="small"
                onClick={() => loiGenerationModal(record.row)}
              >
                LOI
              </Button>
              {/* <VisibilityIcon /> */}
            </IconButton>

            <IconButton
            // onClick={() => viewRecord(record.row)}
            >
              <Button size="small">DR Letter</Button>
              {/* <VisibilityIcon /> */}
            </IconButton>
            <IconButton
            // onClick={() => viewRecord(record.row)}
            >
              <Button size="small">Collection</Button>
              {/* <VisibilityIcon /> */}
            </IconButton>
            <IconButton
            // onClick={() => viewRecord(record.row)}
            >
              <Button size="small">Approval</Button>
              {/* <VisibilityIcon /> */}
            </IconButton>
          </>
        );
      },
    },
  ];

  // view
  return (
    <div>
      <ToastContainer />
      <Paper
        elevation={5}
        sx={{
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
          paddingLeft: "20px",
          backgroundColor: "#F5F5F5",
        }}
      // component={Box}
      // squar='true'
      // m={1}
      // pt={2}
      // pb={2}
      // pr={2}
      // pl={4}
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
                      {"         "} Filters
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
              {/** Table */}
              <DataGrid
                componentsProps={{
                  toolbar: {
                    showQuickFilter: true,
                    // quickFilterProps: { debounceMs: 100 },
                    // printOptions: { disableToolbarButton: true },
                    // disableExport: true,
                    // disableToolbarButton: true,
                    // csvOptions: { disableToolbarButton: true },
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
              {/** Form Preview Dailog */}

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
                  {/* <BasicApplicationDetails />
                  <HawkerDetails />
                  <AddressOfHawker />
                  <AadharAuthentication />
                  <PropertyAndWaterTaxes />
                  <AdditionalDetails /> */}
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

              {/** Document Preview Dailog */}
              <Dialog
                fullWidth
                maxWidth={"lg"}
                open={documentPreviewDialog}
                onClose={() => documentPreviewDailogClose()}
              >
                <Paper sx={{ p: 2 }}>
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
                              documentPreviewDailogClose();
                            }}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </DialogTitle>

                  <DataGrid
                    autoHeight
                    rows={rows1}
                    columns={columns1}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    density="standard"
                    sx={{
                      m: 5,
                      overflowY: "scroll",
                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                      "& .mui-style-f3jnds-MuiDataGrid-columnHeaders": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },
                    }}
                  />
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Button onClick={approveButton}>Approve</Button>
                        <Button onClick={revertButton}>Revert</Button>
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
                      <Button onClick={documentPreviewDailogClose}>Exit</Button>
                    </Grid>
                  </DialogTitle>
                </Paper>
              </Dialog>

              {/** Revert Remark Modal Preview Dailog */}
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
                      <Button onClick={viewDocumentPreviewSaveRemark}>
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

              {/** Site Visit Modal */}
              <Modal
                open={siteVisitModal}
                onClose={siteVisitModalClose}
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
                    height: "200px",
                    width: "500px",
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
                        backgroundColor: "#0084ff",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <h3
                        id="parent-modal-description"
                        style={{ color: "white" }}
                      >
                        Site Visit
                      </h3>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "#0084ff",
                        color: "white",
                      }}
                    ></Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        mt: "30px",
                        mb: "30px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Stack direction="row" spacing={4}>
                        <Button>Schedule Site Visit</Button>
                        <Button onClick={siteVisitPreview}>Site Visit</Button>
                      </Stack>
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
                      <Button size="small" onClick={siteVisitModalClose}>
                        Exit
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal>

              {/** LOI Modal */}
              <Modal
                open={LoiModal}
                onClose={LoiModalClose}
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
                    height: "200px",
                    width: "500px",
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
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "#0084ff",
                      }}
                    >
                      <h3
                        id="parent-modal-description"
                        style={{ color: "white" }}
                      >
                        LOI
                      </h3>
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={2}
                      md={4}
                      lg={6}
                      xl={6}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "#0084ff",
                        color: "white",
                      }}
                    ></Grid>

                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        mt: "30px",
                        mb: "30px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Stack direction="row" spacing={4}>
                        {/* <Button onClick={}>LOI Generation</Button> */}
                        <Button>LOI Collection</Button>
                      </Stack>
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
                      <Button size="small" onClick={LoiModalClose}>
                        Exit
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Modal>

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
                  {/* <BasicApplicationDetails />
                  <HawkerDetails />
                  <AddressOfHawker />
                  <AadharAuthentication />
                  <PropertyAndWaterTaxes />
                  <AdditionalDetails />
                  <SiteVisit /> */}
                  <SiteVisit />
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
                    <Button onClick={() => siteVisitClose()}>Exit</Button>
                  </Grid>
                </DialogTitle>
              </Dialog>

              {/** LOI Generation?Preview */}
              {/* <Dialog
                fullWidth
                maxWidth={"lg"}
                open={loiGeneration}
                onClose={() => LoiGenerationClose()}
              >
                <CssBaseline /> */}
              {/* <DialogTitle>
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
                        aria-label='delete'
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
                            // LoiGenerationClose();
                          }}
                        />
                      </IconButton>
                    </Grid>
                  </Grid>
                </DialogTitle> */}
              {/* <DialogContent> */}
              {/* <LoiGeneration /> */}
              {/* </DialogContent> */}

              {/* <DialogTitle>
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
                       onClick= {() => LoiGenerationClose()}>
                      Exit
                    </Button> 
                  </Grid>
                </DialogTitle> */}
              {/* </Dialog> */}
            </form>
          </FormProvider>
        </ThemeProvider>
      </Paper>
    </div>
  );
};

export default Index;
