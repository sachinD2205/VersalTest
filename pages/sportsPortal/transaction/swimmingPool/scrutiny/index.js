// Main Component - Clerk
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../../../../../containers/Layout/components/Loader";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import UploadButton1 from "../../../../../components/fileUpload/UploadButton1";
import styles from "../../../../../components/streetVendorManagementSystem/styles/deparmentalCleark.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../../theme";
import urls from "../../../../../URLS/urls";
import AadharAuthentication from "../../components/AadharAuthentication";
import BookingDetailsSwimming from "../../components/BookingDetailsSwimming";
import DocumentsUpload from "../../components/DocumentsUpload";
import EcsDetails from "../../components/EcsDetails";
import PersonalDetails from "../../components/PersonalDetails";
import ScrutinyAction from "../../components/ScrutinyAction";
import VerificationApplicationDaily from "../../components/VerificationApplicationDaily";
import LoiGenerationComponent from "../scrutiny/LoiGenerationComponent";
import PaymentCollection from "../scrutiny/PaymentCollection";
import SwimmingHistoryComponent from "../../components/SwimmingHistoryComponent";
import BreadcrumbComponent from "../../../../../components/common/BreadcrumbComponent";

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
      applicationNumber: "SP089734584837",
      // applicationDate: moment(Date.now()).format("YYYY-MM-DD"),
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
      serviceId: "",
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

  // role base
  const [authority, setAuthority] = useState();
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const user = useSelector((state) => state.user.user);

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

  const [panCard, setpanCard] = useState(null);
  const [aadharCard, setaadharCard] = useState(null);
  const [loadderState, setLoadderState] = useState(false);

  const [disablityCertificatePhoto, setDisablityCertificatePhoto] =
    useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] =
    useState(null);
  const [newRole, setNewRole] = useState();

  const [applicationData, setApplicationData] = useState();
  const [tableData, setTableData] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  // // Form Preview - ===================>
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  // // Remark Document Preview

  // // site Schedule Modal
  const [siteVisitScheduleModal, setSiteVisitScheduleModal] = useState(false);
  const siteVisitScheduleOpen = () => setSiteVisitScheduleModal(true);
  const siteVisitScheduleClose = () => setSiteVisitScheduleModal(false);

  // // site Visit Dailog
  const [siteVisitDailog, setSetVisitDailog] = useState();
  const siteVisitOpen = () => setSetVisitDailog(true);
  const siteVisitClose = () => setSetVisitDailog(false);

  // // Loi Generation Open
  const [loiGeneration, setLoiGeneration] = useState(false);
  const loiGenerationOpen = () => setLoiGeneration(true);
  const loiGenerationClose = () => setLoiGeneration(false);

  // // Loi Generation  Recipt
  const [loiGenerationRecipt, setLoiGenerationRecipt] = useState(false);
  const loiGenerationReciptOpen = () => setLoiGenerationRecipt(true);
  const loiGenerationReciptClose = () => setLoiGenerationRecipt(false);

  // // certificate issue
  const [certificateissue, setcertificateissue] = useState(false);
  const certificateissueOpen = () => setcertificateissue(true);
  const certificateissueClose = () => setcertificateissue(false);

  // // loi Collection
  const [loiCollection, setLoiCollection] = useState(false);
  const loiCollectionOpen = () => setLoiCollection(true);
  const loiCollectionClose = () => setLoiCollection(false);
  const [hardCodeAuthority, setHardCodeAuthority] = useState();

  // // Loi Collection Payment Recipt
  const [loiCollectionPaymentRecipt, setLoiCollectionPaymentRecipt] =
    useState(false);
  const loiCollectionPaymentReciptOpen = () =>
    setLoiCollectionPaymentRecipt(true);
  const loiCollectionPaymentReciptClose = () =>
    setLoiCollectionPaymentRecipt(false);

  // // Generate Certificate
  const [certificate, setCertificate] = useState(false);
  const openCertificate = () => setCertificate(true);
  const closeCertificate = () => setCertificate(false);

  // // I Card Certificate
  const [iCard, setICard] = useState(false);
  const openICard = () => setICard(true);
  const closeICard = () => setICard(false);

  const [verificationAoDailog, setVerificationAoDailog] = useState();
  const verificationAoOpne = () => {
    setVerificationAoDailog(true), setValue("verification", true);
  };
  const verificationAoClose = () => setVerificationAoDailog(false);

  // //  AO Dialog
  // const [verificationAoDailog, setVerificationAoDailog] = useState();
  // const verificationAoOpne = () => setVerificationAoDailog(true);
  // const verificationAoClose = () => setVerificationAoDailog(false);

  // // Verification SFO Dialog
  const [verificationSfoDailog, setVerificationSfoDailog] = useState();
  const verificationSfoOpne = () => setVerificationSfoDailog(true);
  const verificationSfoClose = () => setVerificationSfoDailog(false);

  // // Approve Remark Modal Close
  const [approveRevertRemarkDailog, setApproveRevertRemarkDailog] = useState();
  const approveRevertRemarkDailogOpen = () =>
    setApproveRevertRemarkDailog(true);
  const approveRevertRemarkDailogClose = () =>
    setApproveRevertRemarkDailog(false);

  // //  Api Calls ===================================>

  // // zones
  const [zoneKeys, setZoneKeys] = useState([]);
  // get Zone Keys
  const getZoneKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneKey: row.zoneName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // // Ward Keys
  const [wardKeys, setWardKeys] = useState([]);
  // get Ward Keys
  const getWardKeys = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardKeys(
          r.data.ward.map((row) => ({
            id: row.id,
            wardKey: row.wardName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // // Service name
  const [serviceNames, setServiceNames] = useState([]);
  // get Services
  const getServiceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setServiceNames(
          r.data.service.map((row) => ({
            id: row.id,
            serviceName: row.serviceName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // departments name
  const [departments, setDepartments] = useState([]);
  // get departments
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const remarkFun = (data) => {
    let approveRemark;
    let rejectRemark;

    if (data == "Approve") {
      approveRemark = watch("verificationRemark");

      const finalBodyForApi = {
        approveRemark,
        rejectRemark,
        id: getValues("id"),
        desg: hardCodeAuthority,
        role: newRole,
        serviceId: 35,
        emailAddress: watch("emailAddress"),
        bookingTimeId: watch("bookingTimeId"),
        applicantType: watch("applicantType"),
        type: watch("type"),
        attachmentList: watch("attachmentList") ?? [],
        // isValidCertificate: watch("isValidCertificate"),
        isValidCertificate: true,
        // isValidCertificate: watch("checked"),
        // isValidCertificate: getValues("checked"),
      };
      console.log("finalBodyForApi", finalBodyForApi);
      axios
        .post(
          `${urls.SPURL}/swimmingPool/saveApplicationApprove`,
          finalBodyForApi,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            router.push("/sportsPortal/transaction/swimmingPool/scrutiny");

            approveRevertRemarkDailogClose();
          } else if (res.status == 201) {
            router.push("/sportsPortal/transaction/swimmingPool/scrutiny");
            approveRevertRemarkDailogClose();
          }
        });
    } else if (data == "Revert") {
      if (
        watch("verificationRemark") != "" &&
        watch("verificationRemark") != null &&
        watch("verificationRemark") != undefined
      ) {
        rejectRemark = watch("verificationRemark");
        const finalBodyForApi = {
          approveRemark,
          rejectRemark,
          id: getValues("id"),
          desg: hardCodeAuthority,
          role: newRole,
          serviceId: 35,
          emailAddress: watch("emailAddress"),
          attachmentList: watch("attachmentList") ?? [],
        };
        console.log("finalBodyForApi", finalBodyForApi);
        axios
          .post(
            `${urls.SPURL}/swimmingPool/saveApplicationApprove`,
            finalBodyForApi,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              router.push("/sportsPortal/transaction/swimmingPool/scrutiny");

              approveRevertRemarkDailogClose();
            } else if (res.status == 201) {
              router.push("/sportsPortal/transaction/swimmingPool/scrutiny");
              approveRevertRemarkDailogClose();
            }
          });
      } else {
        setValue("loadderState", false);
        toast.error("Remark is Required !!!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // alert("Remark is Required !!!")
      }
    }
  };

  // setValue('inputState', true)

  // // loi Generation
  // const loiGenerationFun = () => {
  //   loiGenerationOpen()
  //   loiModalClose()
  // }

  // // Save Remark
  // const viewDocumentPreviewSaveRemark = () => {
  //   documentRemarkModalClose()
  //   viewDocumentRemarkSuccessNotify()
  // }

  // // Filter Data on Find Button
  // const mrFilterTableData = () => {
  //   // Approved Application Count
  //   const tempData = dataSource.filter((data, index) => {
  //     return data.wardKey == getValues('wardKey')
  //   })
  //   setTableData(tempData)
  // }

  // // Filters  =============================>

  // // Reset Data on Reset Button
  // // const resetFilterData = () => {
  // //   // alert("ok bhai");
  // // };

  // // Approved Application
  // // const clerkTabClick = (props) => {
  // //   const tableData = dataSource.filter((data, index) => {
  // //     if (data.applicationVerficationStatus == props) {
  // //       return data;
  // //     } else if ("TotalApplications" == props) {
  // //       return data;
  // //     }
  // //   });
  // //   setTableData(tableData);
  // // };

  const onSubmitForm = (data) => {
    // alert("djljdslf");
    console.log("dsfldsj", data);
  };

  useEffect(() => {
    // if (router.query.pageMode === 'Edit' || router.query.pageMode === 'Add') {

    setValue("title", user.title);
    setValue("firstName", user.firstName);
    setValue("middleName", user.middleName);
    setValue("lastName", user.surname);
    setValue("gender", user.gender);
    // setValue('dateOfBirth', user.dateOfBirth)
    setValue("mobileNo", user.mobile);
    setValue("emailAddress", user.emailID);

    setValue(
      "cAddress",
      user.cflatBuildingNo +
        "," +
        user.cbuildingName +
        "," +
        user.croadName +
        "," +
        user.clandmark
    );
    setValue("cCityName", user.ccity);
    setValue("cPincode", user.cpinCode);

    // }
  }, [user]);

  // // useEffect(() => {
  // //   clerkTabClick("TotalApplications");
  // // }, [dataSource]);

  // // Get Table - Data
  // // const getSwimmingData = () => {
  // //   axios
  // //     .get(`${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getAll`)
  // //     .then((resp) => {
  // //       console.log('2312', resp.data.provisionBuilding)
  // //       setDataSource(resp.data.provisionBuilding)
  // //       setTableData(resp.data.provisionBuilding)

  // //       // Approved Application Count
  // //       // const approvedApplicationCount =
  // //       //   resp.data.issuanceOfHawkerLicense.filter((data, index) => {
  // //       //     return data.applicationVerficationStatus == "APPROVED";
  // //       //   });
  // //       // setApprovedApplication(approvedApplicationCount.length);

  // //       // Pending Application
  // //       // const pendingApplicationCount =
  // //       //   resp.data.issuanceOfHawkerLicense.filter((data, index) => {
  // //       //     return data.applicationVerficationStatus == "PENDING";
  // //       //   });
  // //       // setPendingApplication(pendingApplicationCount.length);

  // //       // Rejected  Application
  // //       // const rejectedApplicationCount =
  // //       //   resp.data.issuanceOfHawkerLicense.filter((data, index) => {
  // //       //     return data.applicationVerficationStatus == "REJECTED";
  // //       //   });
  // //       // setRejectedApplication(rejectedApplicationCount.length);

  // //       // Total  Application
  // //       // const totalApplicationCount = resp.data.issuanceOfHawkerLicense.filter(
  // //       //   (data, index) => {
  // //       //     return data.applicationVerficationStatus;
  // //       //   }
  // //       // );

  // //       // setTotalApplication(totalApplicationCount.length);
  // //     })
  // // }

  const getSwimmingData = () => {
    setLoadderState(true);

    axios
      .get(`${urls.SPURL}/swimmingPool/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((resp) => {
        // console.log("Swimming Data", resp);
        console.log("Swimming Data", resp.data.swimmingPool);
        if (resp.status == 200) {
          setLoadderState(false);

          const data = resp?.data.swimmingPool?.map((data, index) => {
            return {
              ...data,
              srNo: index + 1,
              applicantNameMr:
                data?.firstNameMr +
                " " +
                data?.middleNameMr +
                " " +
                data?.lastNameMr,
            };
          });

          // setDataSource(
          //   _data.map((val) => {
          //     return {
          //       id: val.id,
          //       ...val,
          //       // applicantName:
          //       //   val?.firstName + " " + val?.middleName + " " + val?.lastName,
          //     };
          //   })
          // );

          // setDataSource(resp.data.swimmingPool);
          // setTableData(resp.data.swimmingPool);
          // reset(resp.data.swimmingPool);
          setDataSource(data);
          setTableData(data);
          reset(data);
        } else {
          // swal("");
          console.log("error");
        }
        // let _data = resp.data.swimmingPool;
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // // Revert Button
  const revertButton = () => {
    documentPreviewDailogClose();
    documentRemarkModalOpen();
  };

  // // Approve Button
  const approveButton = () => {
    documentPreviewDailogClose();
    sendApprovedNotify();
  };

  // // Columns
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
      headerName: <FormattedLabel id="applicationNumber" />,
      description: "Application Number",
      width: 250,
      // flex: 1,
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      description: "Application Date",
      width: 120,
      valueFormatter: (params) => moment(params.value).format("DD/MM/YYYY"),
      // flex: 1,
    },
    {
      field: "createDtTm",
      headerName: <FormattedLabel id="applicationTime" />,
      width: 120,
      valueFormatter: (params) => moment(params.value).format("hh:mm:ss A"),
      // flex: 1,
    },

    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="applicantName" />,
      description: "Applicant Name",
      width: 260,
      // flex: 1,
    },

    {
      field: "applicationStatus",
      headerName: <FormattedLabel id="applicationStatus" />,
      width: 250,
      // flex: 1,
    },

    {
      field: "actions",
      description: "Actions",
      headerName: <FormattedLabel id="actions" />,
      width: 280,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        return (
          <>
            {/**  Verification DEPT Cleark - Button */}

            {["APPLICATION_CREATED", "APPLICATION_SENT_BACK_TO_CLERK"].includes(
              record?.row?.applicationStatus
            ) &&
              authority?.find((r) => r == "CLERK" || r == "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      console.log("recordRow983", record?.row);
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      console.log("6546545645645646545", record.row);
                      setNewRole("VERIFICATION");
                      setHardCodeAuthority("CLERK");
                      verificationAoOpne();
                      setValue("approveBtnState", "DISABLE");
                    }}
                  >
                    {/* VERIFICATION CLERK */}
                    <FormattedLabel id="clerkVerification" />
                  </Button>
                </IconButton>
              )}

            {/* {[
              "APPLICATION_SENT_TO_SUPERVISOR",
              "APPLICATION_SENT_BACK_TO_SUPERVISOR",
            ].includes(record?.row?.applicationStatus) &&
              authority?.find((r) => r === "SUPERVISOR" || r === "ADMIN") && (
                <IconButton>
                  <Button
                    variant="contained"
                    //                   // endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      setNewRole("VERIFICATION");
                      setHardCodeAuthority("SUPERVISOR");
                      verificationAoOpne();
                    }}
                  >
                    VERIFICARION SUPERVISOR
                  </Button>
                </IconButton>
              )} */}
            {/* * Form Preview Button */}

            {/* {[
              "APPLICATION_SENT_TO_SPORTS_OFFICER",
              "APPLICATION_SENT_BACK_TO_SPORTS_OFFICER",
            ].includes(record?.row?.applicationStatus) &&
              authority?.find(
                (r) => r === "SPORTS_OFFICER" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      setApplicationData(record.row);
                      setNewRole("VERIFICATION");
                      setHardCodeAuthority("SPORTS_OFFICER");
                      verificationAoOpne();
                    }}
                  >
                    VERIFICATION SPORTS OFFICER
                  </Button>
                </IconButton>
              )} */}
            {/** View Document Button */}

            {/* loi genration com */}

            {/* {record?.row?.applicationStatus ===
              "APPLICATION_VERIFICATION_COMPLETED" &&
              authority?.find(
                (r) => r === "LOI_GENERATION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiGenerationOpen();
                      setApplicationData(record.row);
                      setNewRole("LOI_GENERATION");
                      //setHardCodeAuthority("LOI_GENERATION");
                    }}
                  >

                    <FormattedLabel id="loiGeneration" />
                  </Button>
                </IconButton>
              )} */}

            {/* payment */}
            {/* {record?.row?.applicationStatus === "LOI_GENERATED" &&
              authority?.find(
                (r) => r === "LOI_COLLECTION" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      reset(record.row);
                      setValue("serviceName", record.row.serviceId);
                      loiGenerationReciptOpen();
                      setApplicationData(record.row);
                      setNewRole("LOI_COLLECTION");
                    }}
                  >
                    payment collection
                  </Button>
                </IconButton>
              )} */}

            {record?.row?.applicationStatus === "PAYEMENT_SUCCESSFUL" &&
              authority?.find(
                (r) => r === "LICENSE_ISSUANCE" || r === "ADMIN"
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      console.log("675675", record?.row?.id);
                      localStorage.setItem("id", record?.row?.id);
                      localStorage.setItem(
                        "applicationRevertedToCititizen",
                        "false"
                      );
                      router.push(
                        `/sportsPortal/transaction/swimmingPoolM/card`
                      );
                    }}
                    // onClick={() => {
                    //   console.log("record323232", record?.row);
                    //   reset(record.row);
                    //   setValue("serviceName", record.row.serviceId);
                    //   let data = record?.row;
                    //   // certificateissueOpen();
                    //   // router.push(
                    //   //   "/sportsPortal/transaction/swimmingPoolM/scrutiny/SanctionLetter/sanctionLetter",
                    //   // );
                    //   router.push({
                    //     pathname:
                    //       "/sportsPortal/transaction/swimmingPoolM/scrutiny/SanctionLetter/sanctionLetter",
                    //     query: {
                    //       id: record?.row?.id,
                    //       photo: record?.row?.idCard,
                    //       firstName: record?.row?.firstName,
                    //       middleName: record?.row?.middleName,
                    //       lastName: record?.row?.lastName,
                    //       bookingRegistrationId:
                    //         record?.row?.bookingRegistrationId,
                    //       amount: record?.row?.amount,
                    //       mobileNo: record?.row?.mobileNo,
                    //       applicationDate: record?.row?.applicationDate,
                    //       // receiptNo: record?.row?.,
                    //       applicationNumber: record?.row?.applicationNumber,
                    //       cAddress: record?.row?.cAddress,
                    //       selectSlot: record?.row?.selectSlot,
                    //     },
                    //   });
                    // }}
                  >
                    {/* CARD */}
                    <FormattedLabel id="iCard" />
                  </Button>
                </IconButton>
              )}

            {/** Site Visit Schedule Button */}
            {console.log(
              "4321",
              record?.row?.applicationStatus,
              authority?.find((r) => r === "SUB_FIRE_OFFICER" || r === "ADMIN")
            )}

            {/* {record?.row?.applicationStatus ==
              'DOCUMENT_VERIFICATION_COMPLETED' &&
              authority?.find(
                (r) => r === 'SITE_SCHEDULED' || r === 'ADMIN',
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      siteVisitScheduleOpen()
                    }}
                  >
                    Site Visit Schedule
                  </Button>
                </IconButton>
              )} */}
            {/** Site Visit Button */}
            {/* {record?.row?.applicationStatus == 'SITE_VISIT_SCHEDULED' &&
              authority?.find((r) => r === 'SITE_VISIT' || r === 'ADMIN') && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      siteVisitOpen()
                      setNewRole('LOI_GENERATION')
                      setHardCodeAuthority('SUB_FIRE_OFFICER')
                    }}
                  >
                    Site Visit
                  </Button>
                </IconButton>
              )} */}
            {/** AO  */}
            {/* {record?.row?.applicationStatus === 'SITE_VISIT_COMPLETED' &&
              authority?.find((r) => r === 'VERIFICATION' || r === 'ADMIN') && (
                <IconButton
                  onClick={() => {
                    reset(record.row)
                    setValue('serviceName', record.row.serviceId)
                    setApplicationData(record.row)
                    setNewRole('VERIFICATION')
                    setHardCodeAuthority('ADMIN_OFFICER')
                    verificationAoOpne()
                  }}
                >
                  <Button
                    variant="contained"
                    //                   // endIcon={<DoneAllIcon />}
                    size="small"
                  >
                    VERIFICARION AO
                  </Button>
                </IconButton>
              )} */}
            {/** LOI Generation Button */}
            {/* {record?.row?.applicationStatus === 'SITE_VISIT_COMPLETED' &&
              authority?.find(
                (r) => r === 'LOI_GENERATION' || r === 'ADMIN',
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      loiGenerationOpen()
                      setNewRole('LOI_COLLECTION')
                      setHardCodeAuthority('SUB_FIRE_OFFICER')
                    }}
                  >
                    LOI Generation
                  </Button>
                </IconButton>
              )} */}
            {/* LOI Generation Recipt Button */}
            {/* {record?.row?.applicationStatus == 'LOI_GENERATED' &&
              authority?.find(
                (r) => r === 'LOI_COLLECTION' || r === 'ADMIN',
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row)
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      loiGenerationReciptOpen()
                    }}
                  >
                    LOI Generation Recipt
                  </Button>
                </IconButton>
              )} */}
            {/* NOC */}
            {/* {record?.row?.applicationStatus == 'NOC_ISSUED_TO_CITIZEN' &&
              authority?.find((r) => r === 'NOC_ISSUE' || r === 'ADMIN') && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row)
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      NOCOpen()
                      setNewRole('NOC_ISSUE')
                      setHardCodeAuthority('NOC_ISSUE')
                    }}
                  >
                    NOC
                  </Button>
                </IconButton>
              )} */}
            {/** LOI Collection Button */}
            {/* {record?.row?.applicationStatus == 'LOI_GENERATED' &&
              authority?.find(
                (r) => r === 'LOI_COLLECTION' || r === 'ADMIN',
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row)
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      loiCollectionOpen()
                      setNewRole('LOI_COLLECTION')
                      setHardCodeAuthority('LOI_COLLECTION')
                    }}
                  >
                    LOI Collection
                  </Button>
                </IconButton>
              )} */}
            {/* //Approved by ACCOUNT_OFFICER */}
            {/* {record?.row?.applicationStatus == 'LOI_GENERATED' &&
              authority?.find(
                (r) => r === 'LOI_COLLECTION' || r === 'ADMIN',
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row)
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      loiCollectionOpen()
                      setNewRole('ACCOUNT_OFFICER')
                      setHardCodeAuthority('ACCOUNT_OFFICER')
                    }}
                  >
                    Approved
                  </Button>
                </IconButton>
              )} */}
            {/** LOI Collection Recipt Button */}
            {/* {record?.row?.applicationStatus == 'PAYEMENT_SUCCESSFUL' &&
              authority?.find(
                (r) => r === 'ACCOUNT_OFFICER' || r === 'ADMIN',
              ) && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row)
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      loiCollectionPaymentReciptOpen()
                    }}
                  >
                    Payment Recipt
                  </Button>
                </IconButton>
              )} */}
            {/** Generate certificate */}
            {/* {record?.row?.applicationStatus == 'NOC_ISSUE' &&
              authority?.find((r) => r === 'NOC_ISSUE' || r === 'ADMIN') && (
                <IconButton>
                  <Button
                    variant="contained"
                    endIcon={<DoneAllIcon />}
                    size="small"
                    onClick={() => {
                      setApplicationData(record.row)
                      reset(record.row)
                      setValue('serviceName', record.row.serviceId)
                      openCertificate()
                    }}
                  >
                    ISSUE NOC
                  </Button>
                </IconButton>
              )} */}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("User", auth);
    console.log("shree", user);
  }, []);

  useEffect(() => {
    getWardKeys();
    getZoneKeys();
    getServiceNames();
    getDepartments();
  }, []);

  useEffect(() => {
    getSwimmingData();
  }, []);

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div style={{ backgroundColor: "white" }}>
          <ToastContainer />
          <Box>
            <BreadcrumbComponent />
          </Box>
          <Paper
            elevation={5}
            sx={{
              backgroundColor: "#F5F5F5",
            }}
            component={Box}
          >
            <DataGrid
              // componentsProps={{
              //   toolbar: {
              //     showQuickFilter: true,
              //     quickFilterProps: { debounceMs: 100 },
              //     printOptions: { disableToolbarButton: true },
              //     disableExport: false,
              //     disableToolbarButton: false,
              //     csvOptions: { disableToolbarButton: true },
              //   },
              // }}
              // components={{ Toolbar: GridToolbar }}
              // sx={{
              //   backgroundColor: "white",
              //   m: 2,
              //   overflowY: "scroll",
              //   "& .MuiDataGrid-columnHeadersInner": {
              //     backgroundColor: "#0084ff",
              //     color: "white",
              //   },
              //   "& .MuiDataGrid-cell:hover": {
              //     color: "primary.main",
              //   },
              // }}
              getRowId={(data) => data?.srNo}
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
              autoHeight
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
              density="density"
              rows={tableData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
            <ThemeProvider theme={theme}>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/** Filters */}
                  {/* <div className={styles.gridCenter}>
                  <Grid container component={Paper} squar="true" elevation={5} m={2} p={2}>
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
                        <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.serviceName}>
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
                            {errors?.serviceName ? errors.serviceName.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.zoneKey}>
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
                          <FormHelperText>{errors?.zoneKey ? errors.zoneKey.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl variant="standard" sx={{ marginTop: 2 }} error={!!errors.wardKey}>
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
                          <FormHelperText>{errors?.wardKey ? errors.wardKey.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl variant="standard">
                          <InputLabel htmlFor="standard-adornment">Application Number</InputLabel>
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
                          <InputLabel htmlFor="standard-adornment">Applicant Name</InputLabel>
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
                        <FormControl sx={{ marginTop: 0 }} error={!!errors.fromDate}>
                          <Controller
                            name="fromDate"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={<span style={{ fontSize: 16, marginTop: 2 }}>From Date</span>}
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
                          <FormHelperText>{errors?.fromDate ? errors.fromDate.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl sx={{ marginTop: 0 }} error={!!errors.toDate}>
                          <Controller
                            control={control}
                            name="toDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={<span style={{ fontSize: 16, marginTop: 2 }}>To Date</span>}
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
                          <FormHelperText>{errors?.toDate ? errors.toDate.message : null}</FormHelperText>
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
                </div> */}

                  {/** DashBoard Table OK  */}

                  {/** Form Preview Dailog  - OK */}
                  <Dialog
                    fullWidth
                    maxWidth={"lg"}
                    open={formPreviewDailog}
                    onClose={() => {
                      formPreviewDailogClose();
                    }}
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
                      <PersonalDetails />
                      <AadharAuthentication />
                      <EcsDetails />
                      <DocumentsUpload />
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
                    maxWidth={"xl"}
                    open={documentPreviewDialog}
                    onClose={() => {
                      documentPreviewDailogClose();
                    }}
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
                                <TableCell style={{ color: "white" }}>
                                  sr.no
                                </TableCell>
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
                                <TableCell>Aadhaar Card</TableCell>
                                <TableCell>Required</TableCell>
                                <TableCell>
                                  <UploadButton1
                                    appName="SP"
                                    serviceName="SP-SPORTSBOOKING"
                                    filePath={setaadharCard}
                                    fileName={getValues("aadharCard")}
                                  />
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2 </TableCell>
                                <TableCell>Pan Card </TableCell>
                                <TableCell>Required</TableCell>
                                <TableCell>
                                  <UploadButton1
                                    appName="SP"
                                    serviceName="SP-SPORTSBOOKING"
                                    filePath={setpanCard}
                                    fileName={getValues("panCard")}
                                  />
                                </TableCell>
                              </TableRow>

                              <TableRow>
                                <TableCell>3</TableCell>
                                <TableCell>Other Documents</TableCell>
                                <TableCell>Required</TableCell>
                                <TableCell>
                                  <UploadButton1
                                    appName="SP"
                                    serviceName="SP-SPORTSBOOKING"
                                    filePath={setOtherDocumentPhoto}
                                    fileName={getValues("otherDocumentPhoto")}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </DialogContent>
                      <Grid container>
                        {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <Button
                            type="submit"
                            variant="contained"
                            onClick={approveButton}
                          >
                            Approve
                          </Button>
                          <Button variant="contained" onClick={revertButton}>
                            Revert
                          </Button>
                        </Stack>
                      </Grid> */}
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
                            onClick={() => {
                              documentPreviewDailogClose();
                            }}
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
                    onClose={() => {
                      siteVisitClose();
                    }}
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
                  <AdditionalDetails /> */}
                      {/* <PropertyTax /> */}
                      {/* <ApplicantDetails /> */}
                      {/* <FormsDetails /> */}
                      {/* <BuildingUse /> */}
                      {/* <SiteVisit
                    siteVisitDailogP={setSetVisitDailog}
                    appID={getValues('id')}
                  /> */}
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
                          onClick={() => {
                            siteVisitClose();
                          }}
                        >
                          Exit
                        </Button>
                      </Grid>
                    </DialogTitle>
                  </Dialog>

                  {/** Site Visit Schedule Modal OK*/}
                  <Modal
                    open={siteVisitScheduleModal}
                    onClose={() => {
                      siteVisitModalClose();
                    }}
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
                      {/* <SiteVisitSchedule appID={getValues('id')} /> */}
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
                            onClick={() => {
                              siteVisitScheduleClose();
                            }}
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
                    onClose={() => {
                      loiGenerationClose();
                    }}
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
                      {/* <LoiGenerationReciptmarathi /> */}
                      <LoiGenerationComponent
                        newRole={newRole}
                        data={applicationData}
                      />

                      {/* <LoiGenerationComponent /> */}
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
                          onClick={() => {
                            loiGenerationClose();
                          }}
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
                    onClose={() => {
                      loiCollectionClose();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <Grid container>
                        <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                          {/* LOI Collection */}
                          Payment Verification
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
                      {/* <LoiCollectionComponent /> */}
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
                          onClick={() => {
                            loiCollectionClose();
                          }}
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
                    onClose={() => {
                      loiCollectionPaymentReciptClose();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <FormattedLabel id="loiPreview" />
                    </DialogTitle>
                    <DialogContent>
                      {/* <ApplicationPaymentReceipt props={applicationData} /> */}
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
                          onClick={() => {
                            loiCollectionPaymentReciptClose();
                          }}
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
                    onClose={() => {
                      loiGenerationReciptClose();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <FormattedLabel id="loiPreview" />
                    </DialogTitle>
                    <DialogContent>
                      <PaymentCollection
                        newRole={newRole}
                        data={applicationData}
                        // props={applicationData}
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
                          onClick={() => {
                            loiGenerationReciptClose();
                          }}
                        >
                          Exit
                        </Button>
                      </Grid>
                    </DialogTitle>
                  </Dialog>

                  {/* issue certificate */}
                  <Dialog
                    fullWidth
                    maxWidth={"lg"}
                    open={certificateissue}
                    onClose={() => {
                      certificateissueClose();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <FormattedLabel id="loiPreview" />
                    </DialogTitle>
                    <DialogContent>
                      <sanctionLetter />
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
                          onClick={() => {
                            certificateissueClose();
                          }}
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
                    onClose={() => {
                      closeCertificate();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <FormattedLabel id="viewCertificate" />
                    </DialogTitle>
                    <DialogContent>
                      {/* <IssuanceOfStreetVendorLicenseCertificate
                    props={applicationData}
                  /> */}
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
                          onClick={() => {
                            closeCertificate();
                          }}
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
                    onClose={() => {
                      closeICard();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <FormattedLabel id="iCard" />
                    </DialogTitle>
                    <DialogContent>
                      {/* <Identity props={applicationData} /> */}
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
                          onClick={() => {
                            closeICard();
                          }}
                        >
                          Exit
                        </Button>
                      </Grid>
                    </DialogTitle>
                  </Dialog>

                  {/**  Verification AO */}
                  {/* <Dialog
                  fullWidth
                  maxWidth={"lg"}
                  open={verificationAoDailog}
                  onClose={() => {
                    verificationAoClose();
                  }}
                >
                  <CssBaseline />
                  <DialogTitle>Basic Application Details</DialogTitle>
                  <DialogContent>
                    <BookingDetailsSwimming
                
                    />
                    <PersonalDetails />
                    <AadharAuthentication />
                    <EcsDetails />
                    <DocumentsUpload />
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        marginLeft: "5vh",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => {
                          documentPreviewDailogOpen();
                        }}
                      >
                        document Preview
                      </Button>
                    </Grid>
                  </DialogContent>
                  <DialogTitle>
                    <ScrutinyAction
                      data={applicationData}
                      hardCodeAuthority={hardCodeAuthority}
                      newRole={newRole}
                    />
                  </DialogTitle>
                </Dialog> */}

                  <Dialog
                    fullWidth
                    maxWidth={"lg"}
                    open={verificationAoDailog}
                    onClose={() => {
                      verificationAoClose();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>
                      <FormattedLabel id="basicApplicationDetails" />
                    </DialogTitle>
                    <DialogContent sx={{ overflow: "unset" }}>
                      <VerificationApplicationDaily props={applicationData} />
                    </DialogContent>
                    <Grid>
                      <SwimmingHistoryComponent id={getValues("id")} />
                    </Grid>
                    <DialogTitle>
                      <Typography
                        // style={{ marginBottom: "30px", marginTop: "20px" }}
                        variant="h6"
                      >
                        Enter Remark for Application
                      </Typography>

                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <TextareaAutosize
                          style={{
                            width: "90vw",
                            height: "50px",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "30px",
                          }}
                          {...register("verificationRemark")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Stack
                          style={{ display: "flex", justifyContent: "center" }}
                          spacing={3}
                          direction={"row"}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            // type='submit'
                            // style={{ backgroundColor: "green" }}
                            disabled={
                              watch("approveBtnState") === "ENABLE"
                                ? false
                                : true
                            }
                            onClick={() => {
                              remarkFun("Approve");
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              remarkFun("Revert");
                            }}
                          >
                            Revert
                          </Button>
                          {/* <Button
                          variant="contained"
                          style={{ backgroundColor: "green" }}
                          onClick={() => {
                            approveRevertRemarkDailogOpen();
                          }}
                        >
                          <FormattedLabel id="actions" />
                        </Button> */}
                          <Button
                            style={{ backgroundColor: "red" }}
                            variant="contained"
                            onClick={() => {
                              verificationAoClose();
                            }}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Stack>
                      </Grid>
                    </DialogTitle>
                  </Dialog>

                  {/** Approve Button   Preview Dailog  */}
                  {/* <Modal
                  open={approveRevertRemarkDailog}
                  onClose={() => {
                    approveRevertRemarkDailogClose();
                  }}
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
                          style={{ marginBottom: "30px", marginTop: "20px" }}
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
                        <Stack spacing={5} direction="row">
                          <Button
                            variant="contained"
                            // type='submit'
                            style={{ backgroundColor: "green" }}
                            onClick={() => {
                              remarkFun("Approve");
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              remarkFun("Revert");
                            }}
                          >
                            Revert
                          </Button>
                          <Button
                            style={{ backgroundColor: "red" }}
                            onClick={approveRevertRemarkDailogClose}
                          >
                            Exit
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </Modal> */}

                  {/**  Verification AO */}
                  <Dialog
                    fullWidth
                    maxWidth={"lg"}
                    open={verificationSfoDailog}
                    onClose={() => {
                      verificationSfoClose();
                    }}
                  >
                    <CssBaseline />
                    <DialogTitle>Basic Application Details</DialogTitle>
                    <DialogContent>
                      {/* <VerificationApplicationDaily props={applicationData} /> */}
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
                            onClick={() => approveRevertRemarkDailogOpen()}
                          >
                            Action
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
                  {/** Approve Button   Preview Dailog  */}
                  {/* <Modal
                  open={approveRevertRemarkDailog}
                  onClose={() => {
                    approveRevertRemarkDailogClose();
                  }}
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
                        <Typography style={{ marginBottom: "30px", marginTop: "20px" }} variant="h6">
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
                        <Stack spacing={5} direction="row">
                          <Button
                            variant="contained"
                            // type='submit'
                            style={{ backgroundColor: "green" }}
                            onClick={() => {
                              remarkFun("Approve");
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            onClick={() => {
                              remarkFun("Revert");
                            }}
                          >
                            Revert
                          </Button>
                          <Button style={{ backgroundColor: "red" }} onClick={approveRevertRemarkDailogClose}>
                            Exit
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Paper>
                </Modal> */}
                </form>
              </FormProvider>
            </ThemeProvider>
          </Paper>
        </div>
      )}
    </>
  );
};

export default Index;
