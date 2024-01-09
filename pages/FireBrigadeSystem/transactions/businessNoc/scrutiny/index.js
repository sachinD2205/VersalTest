import CloseIcon from "@mui/icons-material/Close";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import UploadButton1 from "../../../../../components/fileUpload/UploadButton1";
import AadharAuthentication from "../../../../../components/fireBrigadeSystem/buisnessNoc/AadharAuthentication";
import AdditionalDetails from "../../../../../components/fireBrigadeSystem/buisnessNoc/AdditionalDetails";
import AddressOfHawker from "../../../../../components/fireBrigadeSystem/buisnessNoc/AddressOfHawker";
import ApplicationPaymentReceipt from "../../../../../components/fireBrigadeSystem/buisnessNoc/ApplicationPaymentReceipt";
import BasicApplicationDetails from "../../../../../components/fireBrigadeSystem/buisnessNoc/BasicApplicationDetails";
import HawkerDetails from "../../../../../components/fireBrigadeSystem/buisnessNoc/HawkerDetails";
import Identity from "../../../../../components/fireBrigadeSystem/buisnessNoc/Identity";
import LoiCollectionComponent from "../../../../../components/fireBrigadeSystem/buisnessNoc/LoiCollectionComponent";
import LoiGenerationComponent from "../../../../../components/fireBrigadeSystem/buisnessNoc/LoiGenerationComponent";
import LoiGenerationRecipt from "../../../../../components/fireBrigadeSystem/buisnessNoc/LoiGenerationRecipt";
import PropertyAndWaterTaxes from "../../../../../components/fireBrigadeSystem/buisnessNoc/PropertyAndWaterTaxes";
import SiteVisit from "../../../../../components/fireBrigadeSystem/buisnessNoc/SiteVisit";
// import SiteVisitSchedule from "../../../../../components/fireBrigadeSystem/buisnessNoc/SiteVisitSchedule";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import MoneyIcon from "@mui/icons-material/Money";
import PaymentsIcon from "@mui/icons-material/Payments";
import PlaceIcon from "@mui/icons-material/Place";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import urls from "../../../../../URLS/urls";
import VerificationAppplicationDetails from "../../../../../components/fireBrigadeSystem/buisnessNoc/VerificationAppplicationDetails";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import Form from "../citizen/form";
// reports
import HotelRenewalNOC from "../../../reports/HotelRenewalNOC";
import ShoppingMallRenewalNOC from "../../../reports/ShoppingMallRenewalNOC";
import CompanyNoc from "../../../reports/CompanyNoc";
// import NewPertrolDiselPumpNOC from "../../../reports/NewPertrolDiselPumpNOC";
import SiteVisitSchedule from "../../../../common/masters/siteVisitSchedule";
import NewPertrolDiselPumpNOC from "../../../reports/NewPertrolDiselPumpNOC";
// import styles from "../../../../styles/fireBrigadeSystem/view.module.css";
import ApplicantBasicDetails from "../../../../../components/fireBrigadeSystem/buisnessNoc/ApplicantBasicDetails";
import HistoryComponent from "../../../../../components/fireBrigadeSystem/buisnessNoc/HistoryComponent";
import Loader from "../../../../../containers/Layout/components/Loader";
import styles from "../../../../../styles/fireBrigadeSystem/view.module.css";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

// Main Component - Clerk
const Index = () => {
  // Methods in useForm
  const methods = useForm({
    defaultValues: {
      letterToApplicant: null,
      locationMap: null,
      permissionFromLandOwner: null,
      refellingCertificate: null,
      trainFirePersonList: null,
      structuralStabilityCertificate: null,
      electrialInspectorCertificate: null,
      serviceName: "",
      formPreviewDailogState: false,
      applicationNumber: "",
      // applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
      applicationDate: "",
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
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;

  const router = useRouter();
  const userToken = useGetToken();

  // role base
  const [authority, setAuthority] = useState();
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user = useSelector((state) => state.user.user);

  // const generateNoc = (fromData) => {
  //   console.log("fromData", fromData);

  //   const finalBody = {
  //     // nocNo: fromData?.nocType == "Renew" ? fromData?.nocNo : "",
  //     nocNo: fromData?.nocNumber,
  //     nocType: fromData?.nocType,
  //     id: fromData.id,
  //     role: "NOC_ISSUE",
  //   };

  //   console.log("finalBody", finalBody);

  //   // sweetAlert({
  //   //   title: "Confirmation",
  //   //   text: "Are you sure you want to submit the application ?",
  //   //   icon: "warning",
  //   //   buttons: ["Cancel", "Save"],
  //   // }).then((ok) => {
  //   //   if (ok) {
  //   axios
  //     .post(
  //       `${urls.FbsURL}/transaction/trnBussinessNOC/saveApplicationApprove`,
  //       finalBody
  //     )
  //     .then((res) => {
  //       if (res.status == 200) {
  //         swal({
  //           title: "Noc Generated",
  //           text: "Noc generated successfully",
  //           icon: "success",
  //           button: "Ok",
  //         });

  //         //   router.back();
  //         router.push({
  //           pathname: "/FireBrigadeSystem/transactions/businessNoc/scrutiny",
  //         });
  //       }
  //     });
  //   //   }
  //   // });
  // };

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
  }, []);

  const [load, setLoad] = useState(false);

  // document upload
  const [letterToApplicant, setLetterToApplicant] = useState(null);
  const [locationMap, setLocationMap] = useState(null);
  const [permissionFromLandOwner, setPermissionFromLandOwner] = useState(null);
  const [refellingCertificate, setRefellingCertificate] = useState(null);
  const [trainFirePersonList, setTrainFirePersonList] = useState(null);
  const [structuralStabilityCertificate, setStructuralStabilityCertificate] =
    useState(null);
  const [electrialInspectorCertificate, setElectrialInspectorCertificate] =
    useState(null);

  const [newRole, setNewRole] = useState();

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
  const [hardCodeAuthority, setHardCodeAuthority] = useState();

  // Loi Collection Payment Recipt
  const [loiCollectionPaymentRecipt, setLoiCollectionPaymentRecipt] =
    useState(false);

  const loiCollectionPaymentReciptOpen = () =>
    setLoiCollectionPaymentRecipt(true);

  const loiCollectionPaymentReciptClose = () =>
    setLoiCollectionPaymentRecipt(false);

  // NOC Display
  const [hotelNocRecipt, setHotelRecipt] = useState(false);

  const [businessState, setBusinessState] = useState();

  const hotelNOCOpen = (value) => {
    setHotelRecipt(true);
    setBusinessState(value);
  };

  console.log("businessState", businessState);

  const hotelNOCClose = () => setHotelRecipt(false);

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

  // Approve Remark Modal Close
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const approveRevertRemarkDailogOpen = () =>
    setApproveRevertRemarkDailog(true);
  const approveRevertRemarkDailogClose = () =>
    setApproveRevertRemarkDailog(false);

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

  useEffect(() => {
    getBusinessType();
  }, []);

  const [bussinessTypes, setBussinessTypes] = useState([]);

  // Get Table - Data
  const getBusinessType = () => {
    axios
      .get(`${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterData`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setBussinessTypes(res?.data);
      })
      .catch((err) => {
        console.log("err", err);
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

  const language = useSelector((state) => state.labels.language);

  // Use Effect
  // useEffect(() => {
  //   getWardKeys();
  //   getZoneKeys();
  //   getServiceNames();
  //   getDepartments();
  // }, []);

  // setValue("inputState", true);

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
  // const resetFilterData = () => {
  //   // alert("ok bhai");
  // };

  // Approved Application
  // const clerkTabClick = (props) => {
  //   const tableData = dataSource.filter((data, index) => {
  //     if (data.applicationVerficationStatus == props) {
  //       return data;
  //     } else if ("TotalApplications" == props) {
  //       return data;
  //     }
  //   });
  //   setTableData(tableData);
  // };

  // useEffect(() => {
  //   clerkTabClick("TotalApplications");
  // }, [dataSource]);

  useEffect(() => {
    getData();
  }, []);

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  // Get Table - Data
  const getData = (
    _pageSize = 6,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoad(true);
    axios
      .get(`${urls.FbsURL}/transaction/trnBussinessNOC/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((resp) => {
        // let _res = resp?.data?.bussiness;

        let _res = resp?.data?.bussiness.map((r, i) => ({
          ...r,
          activeFlag: r.activeFlag,

          serialNo: i + 1 + _pageNo * _pageSize,

          id: r.id,

          applicationDateCol: moment(Date.now()).format("DD-MM-YYYY"),

          applicantNameCol:
            r?.applicantName +
            " " +
            r?.applicantMiddleName +
            " " +
            r?.applicantLastName,
          applicantNameColMr:
            r?.applicantNameMr +
            " " +
            r?.applicantMiddleNameMr +
            " " +
            r?.applicantLastNameMr,
        }));
        setLoad(false);

        // setDataSource(resp.data.bussiness);
        // setTableData(resp.data.bussiness);

        setData({
          rows: _res,
          totalRows: resp.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: resp.data.pageSize,
          page: resp.data.pageNo,
        });
        // Approved Application Count
        // const approvedApplicationCount =
        //   resp.data.issuanceOfHawkerLicense.filter((data, index) => {
        //     return data.applicationVerficationStatus == "APPROVED";
        //   });
        // setApprovedApplication(approvedApplicationCount.length);

        // Pending Application
        // const pendingApplicationCount =
        //   resp.data.issuanceOfHawkerLicense.filter((data, index) => {
        //     return data.applicationVerficationStatus == "PENDING";
        //   });
        // setPendingApplication(pendingApplicationCount.length);

        // Rejected  Application
        // const rejectedApplicationCount =
        //   resp.data.issuanceOfHawkerLicense.filter((data, index) => {
        //     return data.applicationVerficationStatus == "REJECTED";
        //   });
        // setRejectedApplication(rejectedApplicationCount.length);

        // Total  Application
        // const totalApplicationCount = resp.data.issuanceOfHawkerLicense.filter(
        //   (data, index) => {
        //     return data.applicationVerficationStatus;
        //   }
        // );

        // setTotalApplication(totalApplicationCount.length);
      })
      .catch((err) => {
        setLoad(false);

        console.log("err", err);
      });
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

  const token = useSelector((state) => state.user.user.token);

  const [isDisabled, setIsDisabled] = useState(false);

  // console.log("data000000", get());

  // Verification API Call
  const remarkFun = (data) => {
    setIsDisabled(true);
    // console.log("applicationDataForRevert", applicationData?.attachments);
    console.log("applicationDataForRevert", getValues("attachments"));

    let approveRemark;
    let rejectRemark;

    if (data == "Approve") {
      approveRemark = watch("verificationRemark");
    } else if (data == "Revert") {
      rejectRemark = watch("verificationRemark");
    }

    const finalBodyForApi = {
      attachments: getValues("attachments"),
      approveRemark,
      rejectRemark,
      id: getValues("id"),
      desg: hardCodeAuthority,
      role: newRole,
    };
    console.log("finalBodyForApi", finalBodyForApi);
    axios
      .post(
        `${urls.FbsURL}/transaction/trnBussinessNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          swal("Approved!", "your application is approved!", "success");

          router.push("/FireBrigadeSystem/transactions/businessNoc/scrutiny");

          approveRevertRemarkDailogClose();
        } else if (res.status == 201) {
          swal("Approved!", "your application is approved!", "success");
          router.push("/FireBrigadeSystem/transactions/businessNoc/scrutiny");
          approveRevertRemarkDailogClose();
        }
        setIsDisabled(false);
      });
  };

  // Columns
  const columns = [
    {
      field: "serialNo",
      headerName: <FormattedLabel id="srNo" />,
      align: "center",
      headerAlign: "center",
      flex: 0.4,
    },
    {
      // field: "nocNo",
      field: "applicationNo",
      headerName: "Application No.",
      description: "Application Number",
      flex: 2.3,
    },
    {
      field: "applicationDateCol",
      headerName: "Application Date",
      description: "Application Date",
      flex: 1.0,
    },
    {
      field: "nocType",
      headerName: "NOC Type",
      description: "NOC Type",
      flex: 1.0,
    },

    {
      field: language == "en" ? "applicantNameCol" : "applicantNameColMr",
      headerName: "Applicant Name",
      description: "Applicant Name",
      flex: 1.4,
    },

    {
      field: language == "en" ? "typeOfBusinessEng" : "typeOfBusinessMr",
      headerName: <FormattedLabel id="typeOfBusiness" />,
      flex: 1.4,
    },
    // {
    //   field: "applicationStatus",
    //   headerName: "Application Status",
    //   headerName: "Application Status",
    //   flex: 1.9,
    // },

    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 3.9,

      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        console.log("applicationStatus123", record?.row);

        return (
          <>
            {/**  Verification DEPT Cleark - Button */}
            {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
              authority?.find((r) => r === "DEPT_CLERK" || r === "ADMIN") && (
                <IconButton
                // onClick={() => {
                //   reset(record.row);
                //   setValue("serviceName", record.row.serviceId);
                //   formPreviewDailogOpen();
                // }}
                >
                  <Button
                    endIcon={<FactCheckIcon />}
                    sx={{
                      width: 190,
                      backgroundColor: "#E8DAEF",
                      color: "#4A235A",
                      "&:hover": {
                        backgroundColor: "#D2B4DE",
                        color: "#8E44AD",
                      },
                    }}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      console.log(
                        "record.row222",
                        record.row.IsRentalApplicant
                      );

                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      setNewRole("DOCUMENT_VERIFICATION");
                      setHardCodeAuthority("DEPT_CLERK");
                      verificationAoOpne();
                    }}
                  >
                    VERIFICARION CLEARK
                  </Button>
                </IconButton>
              )}

            {/**  when sfo reject application */}
            {/* {record?.row?.applicationStatus ===
              "APPLICATION_SENT_BACK_TO_DEPT_CLERK" &&
              authority?.find((r) => r === "DEPT_CLERK" || r === "ADMIN") && (
                <IconButton
                // onClick={() => {
                //   reset(record.row);
                //   setValue("serviceName", record.row.serviceId);
                //   formPreviewDailogOpen();
                // }}
                >
                  <Button
                    variant='contained'
                    endIcon={<CheckIcon />}
                    // sx={{
                    //   backgroundColor: "green",
                    //   border: "solid red",
                    //   color: "white",
                    //   "&:hover": {
                    //     backgroundColor: "green",
                    //     color: "white",
                    //   },
                    // }}
                    size='small'
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      setNewRole("DOCUMENT_VERIFICATION");
                      setHardCodeAuthority("DEPT_CLERK");
                      verificationAoOpne();
                    }}
                  >
                    VERIFICARION CLEARK
                  </Button>
                </IconButton>
              )} */}

            {/*
 VERIFICATION SFO */}
            {record?.row?.applicationStatus ==
              "APPLICATION_SENT_TO_SUB_FIRE_OFFICER" &&
              authority?.find(
                (r) => r === "SUB_FIRE_OFFICER" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    endIcon={<FactCheckIcon />}
                    sx={{
                      width: 190,

                      backgroundColor: "#A2D9CE",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#A2D9CE",
                        color: "black",
                      },
                    }}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      setNewRole("DOCUMENT_VERIFICATION");
                      setHardCodeAuthority("SUB_FIRE_OFFICER");
                      verificationAoOpne();
                    }}
                  >
                    VERIFICATION SFO
                  </Button>
                </IconButton>
              )}
            {console.log("authority", authority)}
            {/* fbs- verification clerk (revert) */}
            {record?.row?.applicationStatus ==
              "APPLICATION_SENT_BACK_TO_CITIZEN" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    style={{
                      backgroundColor: "red",
                    }}
                    variant="contained"
                    size="small"
                    // onClick={() => {
                    // reset(record.row);
                    // setApplicationData(record.row);
                    // setValue("serviceName", record.row.serviceId);
                    // siteVisitOpen();
                    // setNewRole("LOI_GENERATION");
                    // setHardCodeAuthority("SUB_FIRE_OFFICER");
                    // }}
                  >
                    application Revert to citizen
                  </Button>
                </IconButton>
              )}

            {/* fbs- verification sfo(revert) */}
            {/* {record?.row?.applicationStatus ==
              "APPLICATION_SENT_BACK_TO_DEPT_CLERK" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    style={{
                      backgroundColor: "green",
                    }}
                    variant='contained'
                    size='small'
                    // onClick={() => {
                    // reset(record.row);
                    // setApplicationData(record.row);
                    // setValue("serviceName", record.row.serviceId);
                    // siteVisitOpen();
                    // setNewRole("LOI_GENERATION");
                    // setHardCodeAuthority("SUB_FIRE_OFFICER");
                    // }}
                  >
                    application Revert to clerk
                  </Button>
                </IconButton>
              )} */}

            {/* {record?.row?.applicationStatus ===
              "APPLICATION_SEND_TO_SUB_FIRE_OFFICER" &&
              authority?.find(
                (r) => r === "SUB_FIRE_OFFICER" || r === "ADMIN"
              ) && (
                <IconButton
                // onClick={() => {
                //   reset(record.row);
                //   setValue("serviceName", record.row.serviceId);
                //   formPreviewDailogOpen();
                // }}
                >
                  <Button
                    variant="contained"
                    // endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      setNewRole("DOCUMENT_VERIFICATION");
                      setHardCodeAuthority("SUB_FIRE_OFFICER");
                      verificationAoOpne();
                    }}
                  >
                    VERIFICARION SFO
                  </Button>
                </IconButton>
              )} */}

            {/** Form Preview Button */}

            {/** 
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
                    variant='contained'
                    endIcon={<VisibilityIcon />}
                    size='small'
                  >
                    View Form
                  </Button>
                </IconButton>
              )}
              */}

            {/** View Document Button */}
            {/** 
            {record?.row?.applicationStatus === "APPLICATION_CREATED" &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant='contained'
                    endIcon={<VisibilityIcon />}
                    size='small'
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
              */}
            {console.log("909090", record?.row?.nocType)}
            {/** Site Visit Schedule Button */}
            {record?.row?.applicationStatus ==
              "DOCUMENT_VERIFICATION_COMPLETED" &&
              authority?.find(
                (r) => r === "SITE_SCHEDULED" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    sx={{
                      width: 190,

                      backgroundColor: "#8E44AD",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#8E44AD",
                        color: "white",
                      },
                    }}
                    endIcon={<CalendarMonthIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      // reset(record.row);
                      // setValue("serviceName", record.row.serviceId);
                      // siteVisitScheduleOpen();
                      // setNewRole("DOCUMENT_VERIFICATION");
                      // setHardCodeAuthority("SUB_FIRE_OFFICER");
                      console.log("record?.row123", record?.row),
                        router.push({
                          pathname: "/common/masters/siteVisitSchedule",
                          query: {
                            // btnSaveText: "Update",
                            // pageMode: "Edit",
                            ...record?.row,
                            nocType: record?.row?.nocType,
                            // slipHandedOverTo: record.slipHandedOverTo,
                          },
                        });
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
                    sx={{
                      width: 190,

                      backgroundColor: "#8E44AD",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#8E44AD",
                        color: "white",
                      },
                    }}
                    endIcon={<PlaceIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setApplicationData(record.row);
                      setValue("serviceName", record.row.serviceId);
                      siteVisitOpen();
                      setNewRole("LOI_GENERATION");
                      setHardCodeAuthority("SUB_FIRE_OFFICER");
                    }}
                  >
                    Site Visit
                  </Button>
                </IconButton>
              )}

            {/* Site Visit Reschedule button */}
            {record?.row?.applicationStatus == "SITE_VISIT_RESCHEDULED" &&
              authority?.find((r) => r === "SITE_VISIT" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    sx={{
                      width: 190,

                      backgroundColor: "#8E44AD",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#8E44AD",
                        color: "white",
                      },
                    }}
                    endIcon={<PlaceIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setApplicationData(record.row);
                      setValue("serviceName", record.row.serviceId);
                      siteVisitOpen();
                      setNewRole("LOI_GENERATION");
                      setHardCodeAuthority("SUB_FIRE_OFFICER");
                    }}
                  >
                    Site Visit
                  </Button>
                </IconButton>
              )}

            {/** AO  */}
            {/* {record?.row?.applicationStatus === "SITE_VISIT_COMPLETED" &&
              authority?.find((r) => r === "VERIFICATION" || r === "ADMIN") && (
                <IconButton
                  onClick={() => {
                    reset(record.row);
                    setValue("serviceName", record.row.serviceId);
                    setApplicationData(record.row);
                    setNewRole("VERIFICATION");
                    setHardCodeAuthority("ADMIN_OFFICER");
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
              )} */}

            {/** LOI Generation Button */}
            {record?.row?.applicationStatus === "SITE_VISIT_COMPLETED" &&
              authority?.find(
                (r) => r === "SUB_FIRE_OFFICER" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    sx={{
                      width: 190,
                    }}
                    endIcon={<PaymentsIcon />}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      // reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiGenerationOpen();
                      setApplicationData(record.row);
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
                    sx={{
                      backgroundColor: "#AEB6BF",
                      color: "black",
                      "&:hover": {
                        backgroundColor: "#AEB6BF",
                        color: "black",
                      },
                    }}
                    endIcon={<ReceiptLongIcon />}
                    variant="contained"
                    // endIcon={<VisibilityIcon />}
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
                    endIcon={<MoneyIcon />}
                    sx={{
                      backgroundColor: "#4386B2",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#4386B2",
                        color: "white",
                      },
                    }}
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
            {/* {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant='contained'
                    endIcon={<VisibilityIcon />}
                    size='small'
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiCollectionPaymentReciptOpen();
                      // router.push({
                      //   // pathname:
                      //   //   "/FireBrigadeSystem/transactions/emergencyService/form",
                      //   query: {
                      //     ...record.row,
                      //     // mode: "view",
                      //     // pageMode: "VieFw",
                      //   },
                      // });
                    }}
                  >
                    Payment Recipt
                  </Button>
                </IconButton>
              )} */}
            {console.log("record.row", record.row.typeOfBusinessEng)}
            {/* Generate LOI  */}
            {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    // sx={{ backgroundColor: "#BFC9CA", color: "black" }}
                    sx={{
                      width: 190,

                      backgroundColor: "#138D75",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "#138D75",
                        color: "white",
                      },
                    }}
                    variant="contained"
                    endIcon={<ReceiptIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record?.row?.serviceId);
                      hotelNOCOpen(record?.row?.typeOfBusinessEng);
                      // generateNoc(record?.row);

                      // router.push({
                      //   pathname: "/common/masters/siteVisitSchedule",
                      //   query: {
                      //     // btnSaveText: "Update",
                      //     // pageMode: "Edit",
                      //     ...record?.row,
                      //     // nocType: record?.row?.nocType,
                      //   },
                      // });
                    }}
                  >
                    Generate NOC
                  </Button>
                </IconButton>
              )}

            {record?.row?.applicationStatus == "NOC_ISSUED_TO_CITIZEN" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    // sx={{ backgroundColor: "#BFC9CA", color: "black" }}
                    sx={{
                      width: 190,

                      backgroundColor: "#229954",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "green",
                        color: "white",
                      },
                    }}
                    variant="contained"
                    endIcon={<ReceiptIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row);
                      reset(record.row);
                      setValue("serviceName", record?.row?.serviceId);
                      hotelNOCOpen(record?.row?.typeOfBusinessEng);
                      // generateNoc(record?.row);

                      // router.push({
                      //   pathname: "/common/masters/siteVisitSchedule",
                      //   query: {
                      //     // btnSaveText: "Update",
                      //     // pageMode: "Edit",
                      //     ...record?.row,
                      //     // nocType: record?.row?.nocType,
                      //   },
                      // });
                    }}
                  >
                    NOC Issued
                  </Button>
                </IconButton>
                // <IconButton>
                //   <Button
                //     // sx={{ backgroundColor: "#BFC9CA", color: "black" }}
                // sx={{
                //   width: 190,

                //   backgroundColor: "#229954",
                //   color: "white",
                //   "&:hover": {
                //     backgroundColor: "green",
                //     color: "white",
                //   },
                // }}
                //     variant='contained'
                //     // endIcon={<ReceiptIcon />}
                //     size='small'
                //     onClick={() => {
                //       setApplicationData(record.row);
                //       reset(record.row);
                //       setValue("serviceName", record.row.serviceId);
                //       // hotelNOCOpen(record.row.typeOfBusinessEng);
                //     }}
                //   >
                //     Noc Issued
                //   </Button>
                // </IconButton>
              )}

            {/** Generate certificate */}
            {/* {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LICENSE_ISSUANCE" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant='contained'
                    endIcon={<VisibilityIcon />}
                    size='small'
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
              )} */}
            {/** Generate certificate */}
            {/* {record?.row?.applicationStatus == "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LICENSE_ISSUANCE" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant='contained'
                    endIcon={<VisibilityIcon />}
                    size='small'
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
              )} */}
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
    <>
      {/* <ToastContainer /> */}

      {/** DashBoard Header */}
      {/* <Grid container>
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
          <Grid item xs={8}>
            <Paper
              sx={{ height: "160px" }}
              component={Box}
              p={2}
              m={2}
              squar="true"
              elevation={5}
            >
              <div className={styles.test}>
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

                <div className={styles.jugaad}></div>

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

                <div className={styles.jugaad}></div>

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

                <div className={styles.jugaad}></div>

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
        </Grid> */}

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
            <Button size="small" onClick={() => formPreviewDailogClose()}>
              Exit
            </Button>
          </Grid>
        </DialogTitle>
      </Dialog>

      {/** Document Preview Dailog - OK */}
      <Dialog
        fullWidth
        maxWidth={"xl"}
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
                Document Previewbbbb
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
            <TableContainer>
              <Table>
                <TableHead
                  stickyHeader={true}
                  sx={{
                    // textDecorationColor: "white",
                    backgroundColor: "#1890ff",
                  }}
                >
                  <TableRow>
                    <TableCell style={{ color: "white" }}>sr.no</TableCell>
                    <TableCell style={{ color: "white" }}>
                      <h3>Document Name</h3>
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      <h3>Mandatory</h3>
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      <h3>View Document</h3>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1 </TableCell>
                    <TableCell>
                      {" "}
                      Letter to Applicant by Police inspector, Licence Branch,
                      Vadodra City
                    </TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>
                      <UploadButton1
                        appName="FBS"
                        serviceName="businessNoc"
                        filePath={setLetterToApplicant}
                        fileName={getValues("letterToApplicant")}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2 </TableCell>
                    <TableCell>
                      Location Map / Internal Drawing with Entry or Exit with
                      measurement
                    </TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>
                      <UploadButton1
                        appName="FBS"
                        serviceName="businessNoc"
                        filePath={setLocationMap}
                        fileName={getValues("locationMap")}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3</TableCell>
                    <TableCell> Permission From Land Owner</TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>
                      <UploadButton1
                        appName="FBS"
                        serviceName="businessNoc"
                        filePath={setPermissionFromLandOwner}
                        fileName={getValues("permissionFromLandOwner")}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>4</TableCell>
                    <TableCell>
                      Refelling Certificate of Fire Fightning equipments
                    </TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>
                      <UploadButton1
                        appName="FBS"
                        serviceName="businessNoc"
                        filePath={setRefellingCertificate}
                        fileName={getValues("refellingCertificate")}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>5</TableCell>
                    <TableCell>
                      Train Fire Persion List with their Name & Mobile
                    </TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>
                      <UploadButton1
                        appName="FBS"
                        serviceName="businessNoc"
                        filePath={setTrainFirePersonList}
                        fileName={getValues("trainFirePersonList")}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>6</TableCell>
                    <TableCell>
                      Structural Stability Certificate From PWD Department
                    </TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>
                      <UploadButton1
                        appName="FBS"
                        serviceName="businessNoc"
                        filePath={setStructuralStabilityCertificate}
                        fileName={getValues("structuralStabilityCertificate")}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>7</TableCell>
                    <TableCell>Electrical Inspector Certificate</TableCell>
                    <TableCell>Required</TableCell>
                    <TableCell>
                      <UploadButton1
                        appName="FBS"
                        serviceName="Business Noc"
                        filePath={setElectrialInspectorCertificate}
                        fileName={getValues("otherDocumentPhoto")}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <Grid container>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  onClick={approveButton}
                >
                  Approve
                </Button>
                <Button variant="contained" onClick={() => revertButton()}>
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
                size="small"
                variant="contained"
                // onClick={() => alert("dsf")}

                // onClick={documentPreviewDailogClose}
              >
                Exit
              </Button>
            </Grid>
          </DialogTitle>
        </Paper>
      </Dialog>

      {/** Site Visit Modal*/}
      <Dialog
        // fullWidth
        maxWidth="6000px"
        maxHeight="6000px"
        // maxWidth='100px'
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
                  color: "black",

                  ":hover": {
                    bgcolor: "#3498DB", // theme.palette.primary.main
                    color: "white",
                  },
                }}
                onClick={() => {
                  siteVisitClose();
                }}
              >
                <CloseIcon />
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
          {/* <Form props={applicationData} /> */}
          {/* Display Form Seperately */}
          <ApplicantBasicDetails props={applicationData} />
          <br />
          <br />
          <HistoryComponent appId={getValues("id")} />
          <br />
          <br />
          <Accordion
            sx={{
              margin: "40px",
              marginLeft: "5vh",
              marginRight: "5vh",
              marginTop: "2vh",
              marginBottom: "2vh",
            }}
            elevation={0}
          >
            <AccordionSummary
              sx={{
                backgroundColor: "#0084ff",
                color: "white",
                textTransform: "uppercase",
                border: "1px solid white",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#0070f3"
            >
              <Typography variant="subtitle">Applicant Form Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Form props={{ ...applicationData, docPriview: true }} />
            </AccordionDetails>
          </Accordion>
          <Accordion
            sx={{
              margin: "40px",
              marginLeft: "5vh",
              marginRight: "5vh",
              marginTop: "2vh",
              marginBottom: "2vh",
            }}
            elevation={0}
          >
            <AccordionSummary
              sx={{
                backgroundColor: "#0084ff",
                color: "white",
                textTransform: "uppercase",
                border: "1px solid white",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#0070f3"
            >
              <Typography variant="subtitle">Site Visit</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SiteVisit
                props={applicationData}
                siteVisitDailogP={setSetVisitDailog}
                appID={getValues("id")}
              />
            </AccordionDetails>
          </Accordion>
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
              size="small"
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
        onClose={() => siteVisitScheduleClose()}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // padding: 5,
          overflowY: "auto",
          marginTop: 3,
        }}
      >
        <Paper
          sx={{
            // backgroundColor: "#F5F5F5",
            padding: 2,
            // height: "900px",
            // width: "800px",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "center",
          }}
          elevation={5}
          component={Box}
        >
          {/* <CssBaseline /> */}
          {/* <SiteVisitSchedule appID={getValues("id")} /> */}
          {console.log("applicationData", applicationData)}
          <SiteVisitSchedule applicationData={applicationData} />
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
                size="small"
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
        maxWidth={"xl"}
        // sx={{ border: "solid red", width: "100vw", height: "100vh" }}
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
                }}
              >
                <CloseIcon
                  sx={{
                    color: "black",
                    ":hover": {
                      // bgcolor: "red", // theme.palette.primary.main
                      border: "2px solid black",
                    },
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
          {console.log("applicationData345", applicationData)}
          <LoiGenerationComponent props={applicationData} />
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
              size="small"
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
          {console.log("applicationDataLOICollection", applicationData)}

          <LoiCollectionComponent props={applicationData} />
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
              size="small"
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
              size="small"
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
          {console.log("applicationData", applicationData)}
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
              size="small"
              variant="contained"
              onClick={() => loiGenerationReciptClose()}
            >
              Exit
            </Button>
          </Grid>
        </DialogTitle>
      </Dialog>

      {/**  Certificate */}
      {/* <Dialog
                fullWidth
                maxWidth={"lg"}
                open={certificate}
                onClose={() => closeCertificate()}
              >
                <CssBaseline />
                <DialogTitle>
                  <FormattedLabel id='viewCertificate' />
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
                      size='small'
                      variant='contained'
                      onClick={() => closeCertificate()}
                    >
                      Exit
                    </Button>
                  </Grid>
                </DialogTitle>
              </Dialog> */}
      <Dialog
        fullWidth
        maxWidth={"xl"}
        open={hotelNocRecipt}
        onClose={() => hotelNOCClose()}
      >
        <CssBaseline />
        <DialogTitle>
          {/* <FormattedLabel id='viewCertificate' /> */}
        </DialogTitle>
        <DialogContent>
          {(businessState == "Hotel (only food service)" ||
            businessState == 4) && <HotelRenewalNOC props={applicationData} />}

          {(businessState == "Company" || businessState == 12) && (
            <CompanyNoc props={applicationData} />
          )}

          {(businessState == "Petrol Pump" || businessState == 8) && (
            <NewPertrolDiselPumpNOC props={applicationData} />
          )}

          {(businessState == "Cinema Hall / Auditorium " ||
            businessState == 11) && (
            <NewPertrolDiselPumpNOC props={applicationData} />
          )}

          {(businessState == "Lodging" || businessState == 7) && (
            <NewPertrolDiselPumpNOC props={applicationData} />
          )}

          {(businessState == "Hotel Lodging" || businessState == 5) && (
            <HotelRenewalNOC props={applicationData} />
          )}

          {console.log("businessState", businessState)}

          {(businessState == "Grossary Mart" || businessState == 10) && (
            <ShoppingMallRenewalNOC props={applicationData} />
          )}

          {(businessState == "Mall Complex" || businessState == 2) && (
            <ShoppingMallRenewalNOC props={applicationData} />
          )}

          {(businessState == "Hotel Permit Room / Restaurant" ||
            businessState == 6) && <HotelRenewalNOC props={applicationData} />}

          {(businessState == "Shaley Poshan Aahar" || businessState == 13) && (
            <HotelRenewalNOC props={applicationData} />
          )}

          {(businessState == "Hospital / Nursing home " ||
            businessState == 9) && <HotelRenewalNOC props={applicationData} />}

          {(businessState == "Banquet hall" || businessState == 17) && (
            <HotelRenewalNOC props={applicationData} />
          )}

          {(businessState == "Water Park / Amusement Park /Adventure Park" ||
            businessState == 21) && <HotelRenewalNOC props={applicationData} />}

          {(businessState == "Battery charging station" ||
            businessState == 20) && (
            <NewPertrolDiselPumpNOC props={applicationData} />
          )}

          {(businessState ==
            "Government Offices (police station, laboratory, defense etc..)" ||
            businessState == 19) && (
            <NewPertrolDiselPumpNOC props={applicationData} />
          )}

          {(businessState == "CNG Service Station" || businessState == 14) && (
            <NewPertrolDiselPumpNOC props={applicationData} />
          )}

          {(businessState == " School /College / Safety certificate" ||
            businessState == 15) && (
            <NewPertrolDiselPumpNOC props={applicationData} />
          )}
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
            {/* <Button
                      size='small'
                      variant='contained'
                      onClick={() => hotelNOCClose()}
                    >
                      Exit
                    </Button> */}
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
            <Button
              size="small"
              variant="contained"
              onClick={() => closeICard()}
            >
              Exit
            </Button>
          </Grid>
        </DialogTitle>
      </Dialog>

      {/**  Verification AO */}
      <Dialog
        fullWidth
        maxWidth={"xl"}
        open={verificationAoDailog}
        onClose={() => verificationAoClose()}
      >
        <CssBaseline />
        <DialogTitle
          sx={{
            backgroundColor: "#5DADE2",
            color: "white",
          }}
        >
          Basic Application Details
        </DialogTitle>
        <br />
        <DialogContent>
          <VerificationAppplicationDetails props={applicationData} />
        </DialogContent>
        <DialogTitle>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Stack
              style={{ display: "flex", justifyContent: "center" }}
              spacing={3}
              direction={"row"}
            >
              <Button
                size="small"
                variant="contained"
                style={{ backgroundColor: "green" }}
                onClick={() => approveRevertRemarkDailogOpen()}
              >
                Action
              </Button>
              <Button
                size="small"
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
              <Typography
                style={{
                  marginBottom: "30px",
                  marginTop: "20px",
                }}
                variant="h6"
              >
                Enter Remark for Application
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
              <Stack spacing={1.5} direction="row">
                <Button
                  disabled={isDisabled}
                  size="small"
                  variant="contained"
                  // type='submit'
                  style={{ backgroundColor: isDisabled ? "gray" : "green" }}
                  endIcon={<DoneOutlineIcon />}
                  onClick={() => {
                    remarkFun("Approve");
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    remarkFun("Revert");
                  }}
                  endIcon={<AssignmentReturnIcon />}
                >
                  Revert
                </Button>
                <Button
                  size="small"
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={approveRevertRemarkDailogClose}
                  endIcon={<ExitToAppIcon />}
                >
                  Exit
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Modal>

      {/* <BreadcrumbComponent /> */}
      <Box style={{ display: "flex" }}>
        <Box className={styles.tableHead}>
          <Box className={styles.h1Tag}>
            {<FormattedLabel id="addBusinessNoc" />}
          </Box>
        </Box>
      </Box>
      {load && <Loader />}
      {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={load}
        onClick={handleLoad}
      >
        Loading....
        <CircularProgress color='inherit' />
      </Backdrop> */}
      {/** DashBoard Table OK  */}
      <Box style={{ height: "100%", width: "100%" }}>
        <DataGrid
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          components={{ Toolbar: GridToolbar }}
          // autoHeight
          autoHeight={data.pageSize}
          density="compact"
          sx={{
            backgroundColor: "white",
            boxShadow: 2,
            border: 1,
            borderColor: "primary.light",
            "& .MuiDataGrid-cell:hover": {
              transform: "scale(1.1)",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#E1FDFF",
            },
            "& .MuiDataGrid-columnHeadersInner": {
              // backgroundColor: "#87E9F7",
              backgroundColor: "#2E86C1",
              color: "white",
            },
          }}
          pagination
          paginationMode="server"
          rowCount={data.totalRows}
          rowsPerPageOptions={data.rowsPerPageOptions}
          page={data.page}
          pageSize={data.pageSize}
          rows={data.rows}
          columns={columns}
          onPageChange={(_data) => {
            getData(data.pageSize, _data);
          }}
          onPageSizeChange={(_data) => {
            console.log("222", _data);
            // updateData("page", 1);
            getData(_data, data.page);
          }}
        />
      </Box>
    </>
  );
};

export default Index;
