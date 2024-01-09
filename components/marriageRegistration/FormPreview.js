//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import theme from "../../../../../theme";
import URLS from "../../../../../URLS/urls";
import styles from "../../newMarriageRegistration/view.module.css";
// import URLS from '../../../../../../pcmc all project erp/pcmcerp-tp/pages/townPlanning/urls'
import CloseIcon from "@mui/icons-material/Close";
import NextPlanIcon from "@mui/icons-material/NextPlan";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import UndoIcon from "@mui/icons-material/Undo";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ApplicantDetails from "./ApplicantDetails";
import BrideDetails from "./BrideDetails";
import GroomDetails from "./GroomDetails";
import PriestDetails from "./PriestDetails";
import WitnessDetails from "./WitnessDetails";
import urls from "../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../util/util";
const Index = () => {
  const methods = useForm({
    defaultValues: {
      setBackDrop: false,
      rejectRemark: "",
      approveRemark: "",
      id: null,
      applicationFrom: "",
      zoneKey: "",
      wardKey: "",
      aFName: "",
      aMName: "",
      aLName: "",
      aflatBuildingNo: "",
      abuildingName: "",
      aroadName: "",
      aLandmark: "",
      aCityName: "",
      aState: "",
      aPincode: "",
      aMobileNo: "",
      aEmail: "",

      applicantName: "" /* [{ aFName, aMName, aLName }] */,
      //  religionKey: '',
      // aFName + aMName + aLName
      //husband/groom

      gFName: "",
      gMName: "",
      gLName: "",
      gBuildingNo: "",
      gBuildingName: "",
      gRoadName: "",
      gLandmark: "",
      gVillageName: "",
      gCityName: "",
      gPincode: "",
      gState: "Maharashtra",
      gGender: "",
      gMobileNo: "",
      gPhoneNo: "",
      gEmail: "",
      gAge: "",
      gStatus: "",
      gReligionByBirth: "",
      gReligionByAdoption: "",
      gBirthDate: null,
      gFNameMar: "पंकज",
      gMNameMar: "",
      gLNameMar: "",
      // Groom Father
      gFFName: "",
      gFMName: "",
      gFLName: "",
      gFAge: "",
      gFAadharNo: "",
      gFMobileNo: "",
      gFBuildingNo: "",
      gFBuildingName: "",
      gFRoadName: "",
      gFLandmark: "",
      gFVillageName: "",
      gFCityName: "",
      gFPincode: "",
      gFState: "Maharashtra",
      gFEmail: "",
      //groom mother
      gMFName: "",
      gMMName: "",
      gMLName: "",
      gMMobileNo: "",
      gMAadharNo: "",
      gMAge: "",

      //wife/bride
      bFName: "",
      bMName: "",
      bLName: "",
      bLName: "",
      bBuildingNo: "",
      bBuildingName: "",
      bRoadName: "",
      bLandmark: "",
      bVillageName: "",
      bCityName: "",
      bPincode: "",
      bState: "Maharashtra",
      bGender: "",
      bAadharNo: "",
      bMobileNo: "",
      bPhoneNo: "",
      bEmail: "",
      bAge: "",
      bStatus: "",
      bReligionByBirth: "",
      bReligionByAdoption: "",
      bBirthDate: null,
      //bride father
      bFFName: "",
      bFMName: "",
      bFLName: "",
      bFAge: "",
      bFAadharNo: "",
      bFMobileNo: "",
      bFBuildingNo: "",
      bFBuildingName: "",
      bFRoadName: "",
      bFLandmark: "",
      bFVillageName: "",
      bFCityName: "",
      bFPincode: "",
      bFState: "Maharashtra",
      bFEmail: "",
      //bride mother
      bMFName: "",
      bMMName: "",
      bMLName: "",
      bMMobileNo: "",
      bMAadharNo: "",
      bMAge: "",
      //prist
      pFName: "",
      pMName: "",
      pLName: "",
      pBuildingNo: "",
      pBuildingName: "",
      pRoadName: "",
      pLandmark: "",
      pVillageName: "",
      pCityName: "",
      pState: "Maharashtra",
      pGender: "",
      pAadharNo: "",
      pMobileNo: "",
      pPhoneNo: "",
      pEmail: "",
      pAge: "",
      pReligionByBirth: "",
      pReligionByAdoption: "",
      pBirthDate: null,
      pPlaceOfMarriage: "",
      // documents
      gAgeProofDocument: "",
      gResidentialProofDocument: "",
      gPhoto: "",
      gThumb: "",
      bAgeProofDocument: "",
      bResidentialProofDocument: "",
      bPhoto: "",
      bThumb: "",
      pDocument: "",
      invitationProof: "",
      inventPhoto: "",
      divorceCertificate: "",
      dateCertificate: "",
      unofficialMarriageCertificate: "",
      // Photo
      bPhoto: "",
      gPhoto: "",
      religionCertificatePhoto: "",
      dateCertificate: "",
      divorceCertificate: "",
      invitationProof: "",
      pDocument: "",
      bResidentialProofDocument: "",
      bAgeProofDocument: "",
      gResidentialProofDocument: "",
      gAgeProofDocument: "",
      marriageDate: null,
      uInvitationCard: "",

      //applicant detail
      serviceName: "",

      // witness
      witnesses: [],
    },
  });

  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  //   const methods = useForm({
  //     defaultValues: {
  //       setBackDrop: false,
  //       id: null,
  //       applicationFrom: '',
  //       zoneKey: '',
  //       wardKey: '',
  //       aFName: '',
  //       aMName: '',
  //       aLName: '',
  //       aflatBuildingNo: '',
  //       abuildingName: '',
  //       aroadName: '',
  //       aLandmark: '',
  //       aCityName: '',
  //       aState: '',
  //       aPincode: '',
  //       aMobileNo: '',
  //       aEmail: '',

  //       applicantName: '' /* [{ aFName, aMName, aLName }] */,
  //       //  religionKey: '',
  //       // aFName + aMName + aLName
  //       //husband/groom

  //       gFName: '',
  //       gMName: '',
  //       gLName: '',
  //       gBuildingNo: '',
  //       gBuildingName: '',
  //       gRoadName: '',
  //       gLandmark: '',
  //       gVillageName: '',
  //       gCityName: '',
  //       gPincode: '',
  //       gState: 'Maharashtra',
  //       gGender: '',
  //       gMobileNo: '',
  //       gPhoneNo: '',
  //       gEmail: '',
  //       gAge: '',
  //       gStatus: '',
  //       gReligionByBirth: '',
  //       gReligionByAdoption: '',
  //       gBirthDate: null,
  //       // Groom Father
  //       gFFName: '',
  //       gFMName: '',
  //       gFLName: '',
  //       gFAge: '',
  //       gFAadharNo: '',
  //       gFMobileNo: '',
  //       gFBuildingNo: '',
  //       gFBuildingName: '',
  //       gFRoadName: '',
  //       gFLandmark: '',
  //       gFVillageName: '',
  //       gFCityName: '',
  //       gFPincode: '',
  //       gFState: 'Maharashtra',
  //       gFEmail: '',
  //       //groom mother
  //       gMFName: '',
  //       gMMName: '',
  //       gMLName: '',
  //       gMMobileNo: '',
  //       gMAadharNo: '',
  //       gMAge: '',

  //       //wife/bride
  //       bFName: '',
  //       bMName: '',
  //       bLName: '',
  //       bLName: '',
  //       bBuildingNo: '',
  //       bBuildingName: '',
  //       bRoadName: '',
  //       bLandmark: '',
  //       bVillageName: '',
  //       bCityName: '',
  //       bPincode: '',
  //       bState: 'Maharashtra',
  //       bGender: '',
  //       bAadharNo: '',
  //       bMobileNo: '',
  //       bPhoneNo: '',
  //       bEmail: '',
  //       bAge: '',
  //       bStatus: '',
  //       bReligionByBirth: '',
  //       bReligionByAdoption: '',
  //       bBirthDate: null,
  //       //bride father
  //       bFFName: '',
  //       bFMName: '',
  //       bFLName: '',
  //       bFAge: '',
  //       bFAadharNo: '',
  //       bFMobileNo: '',
  //       bFBuildingNo: '',
  //       bFBuildingName: '',
  //       bFRoadName: '',
  //       bFLandmark: '',
  //       bFVillageName: '',
  //       bFCityName: '',
  //       bFPincode: '',
  //       bFState: 'Maharashtra',
  //       bFEmail: '',
  //       //bride mother
  //       bMFName: '',
  //       bMMName: '',
  //       bMLName: '',
  //       bMMobileNo: '',
  //       bMAadharNo: '',
  //       bMAge: '',
  //       //prist
  //       pFName: '',
  //       pMName: '',
  //       pLName: '',
  //       pBuildingNo: '',
  //       pBuildingName: '',
  //       pRoadName: '',
  //       pLandmark: '',
  //       pVillageName: '',
  //       pCityName: '',
  //       pState: 'Maharashtra',
  //       pGender: '',
  //       pAadharNo: '',
  //       pMobileNo: '',
  //       pPhoneNo: '',
  //       pEmail: '',
  //       pAge: '',
  //       pReligionByBirth: '',
  //       pReligionByAdoption: '',
  //       pBirthDate: null,
  //       pPlaceOfMarriage: '',
  //       // documents
  //       gAgeProofDocument: '',
  //       gResidentialProofDocument: '',
  //       gPhoto: '',
  //       gThumb: '',
  //       bAgeProofDocument: '',
  //       bResidentialProofDocument: '',
  //       bPhoto: '',
  //       bThumb: '',
  //       pDocument: '',
  //       invitationProof: '',
  //       inventPhoto: '',
  //       divorceCertificate: '',
  //       dateCertificate: '',
  //       unofficialMarriageCertificate: '',
  //       // Photo
  //       bPhoto: '',
  //       gPhoto: '',
  //       religionCertificatePhoto: '',
  //       dateCertificate: '',
  //       divorceCertificate: '',
  //       invitationProof: '',
  //       pDocument: '',
  //       bResidentialProofDocument: '',
  //       bAgeProofDocument: '',
  //       gResidentialProofDocument: '',
  //       gAgeProofDocument: '',
  //       marriageDate: null,
  //       uInvitationCard: '',

  //       //applicant detail
  //       serviceName: '',

  //       // witness
  //       witnesses: [],
  //     },
  //     mode: 'onChange',
  //     criteriaMode: 'all',
  //     // resolver: yupResolver(Schema),
  //   })
  setValue("inputState", true);
  const router = useRouter();
  const [id1, setId] = useState();
  let user = useSelector((state) => state.user.user);

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      setId(router.query.id1);
    }
  }, []);

  const [modalforAprov, setmodalforAprov] = useState(false);
  // const [btnSaveText, setBtnSaveText] = useState()
  const [remark, setRemark] = useState(null);
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
  useEffect(() => {
    axios
      .get(`${URLS.CFCURL}/master/documentMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("Document Master: ", res.data);
        setDocuments(
          res.data.documentMaster.map((j, i) => ({
            id: j.id,
            documentNameEn: j.documentChecklistEn,
            documentNameMr: j.documentChecklistMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  useEffect(() => {
    reset(router.query);
  }, []);

  const dispach = useDispatch();
  // const [dataSource, setDataSource] = useState([])

  // Get Table - Data
  // const getNewMarriageRegistractionDetails = () => {
  //   axios
  //     .get(
  //       `http://localhost:8091/mr/api/transaction/applicant/getapplicantById?applicationId=${router.query.id}`,
  //     )
  //     .then((resp) => {
  //       console.log('response Data', JSON.stringify(resp.data))
  //       dispach(addAllNewMarriageRegistraction(resp.data))
  //       // setDataSource(resp.data)
  //       setTableData(resp.data)
  //     })
  // }

  // useEffect(() => {
  //   getNewMarriageRegistractionDetails()
  // }, [])

  const onFinish = (data) => {
    //   dispach(addNewMarriageRegistraction(data))
    //   if (router.query.pageMode == 'Edit') {
    //     if (btnSaveText === 'Edit') {
    //       axios
    //         .put(
    //           `http://localhost:8091/mr/api/applicant/UpdateRegistrationDetails/${id}`,
    //           data,
    //         )
    //         .then((res) => {
    //           if (res.status == 201) {
    //             swal('Updated!', 'Record Saved successfully !', 'success')
    //           }
    //         })
    //     }
    //   } else {
    //     if (btnSaveText === 'Save') {
    //       console.log(`data --------->s ${data}`)
    //       axios
    //         .post(
    //           `http://localhost:8091/mr/api/transaction/applicant/saveApplicantRegistration`,
    //           data,
    //         )
    //         .then((res) => {
    //           if (res.status == 201) {
    //             swal('Saved!', 'Record Saved successfully !', 'success')
    //           }
    //           router.push(
    //             `/marriageRegistration/transactions/newMarriageRegistration`,
    //           )
    //         })
    //     }
    //   }
  };

  //document verifiaction
  const [filesUpdated, setFilesUpdated] = useState(false);
  const [filesAale, setFilesAale] = useState(false);

  let tempFilee = [];
  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentChecklistEn: "",
      documentChecklistMr: "",
    },
  ]);
  const [files, setFiles] = useState([
    {
      id: 1,
      srNo: 1,
      isDocumentMandetory: true,
      docKey: 1,
      documentNameEn: "",
      documentNameMr: "",
      filePath: "",
      status: "",
      remark: "",
    },
  ]);

  const verification = async () => {
    let tempNewFiles = files.map((j) => ({
      id: j.id,
      docKey: j.docKey,
      attachments: j.filePath,
      status: j.status === "rejected" ? "upload" : "verified",
      remark: j.remark,
    }));

    let status = tempNewFiles.find((obj) => obj.status === "upload")
      ? "Clerk Rejected"
      : "Clerk Approved";

    const statusUpdation = { id: router.query.id, files: tempNewFiles, status };

    await axios
      .post(
        `${urls.MR}/transaction/applicant/saveApplicantRegistration`,
        statusUpdation,

        {
          headers: {
            role: "CITIZEN",
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(
            "/marriageRegistration/transactions/newMarriageRegistration/cleark",
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    //Document Checklist
    axios
      .post(
        `${
          URLS.CFCURL
        }/master/serviceWiseChecklist/getDocumentsByService?service=${10}`,
      )
      .then((r) => {
        console.log("service wise checklist: ", r);
        if (router.query.id) {
          axios
            .get(
              `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router.query.id}`,
              {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                },
              },
            )
            .then((res) => {
              console.log("Applicant Data", res);
              let response = r.data.map((r, i) => ({
                id: getID(res.data.attachments, r.document),
                srNo: i + 1,
                isDocumentMandetory: r.isDocumentMandetory,
                docKey: r.document,
                documentNameEn: getDocumentName(r.document, "en"),
                documentNameMr: getDocumentName(r.document, "mr"),
                filePath: getFilePath(res.data.attachments, r.document),
                status: getStatus(res.data.attachments, r.document),
                remark: res.data.attachments.find(
                  (file) => file.docKey === r.document,
                )?.remark,
              }));
              console.log("response", response);
              setFiles(response);
              setFilesAale(true);
            });
        } else {
          setFiles(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              isDocumentMandetory: j.isDocumentMandetory,
              docKey: j.document,
              documentNameEn: getDocumentName(j.document, "en"),
              documentNameMr: getDocumentName(j.document, "mr"),
              filePath: "",
              status: "upload",
              remark: "",
            })),
          );
          setFilesAale(true);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, [documents]);

  useEffect(() => {
    //To view files of an application
    if (router.query.id) {
      console.log("Aat ya saheb: ", router.query.id);

      axios
        .get(
          `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router.query.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          console.log("yetoy ka baher", res);

          setFiles(
            // temp,
            tempFilee.map((obj) => ({
              ...obj,
              id: getID(res.data.attachments, obj.docKey),
              filePath: getFilePath(res.data.attachments, obj.docKey),
              status: getStatus(res.data.attachments, obj.docKey),
              remark: res.data.attachments.find(
                (file) => file.docKey === obj.docKey,
              ).remark,
            })),
          );
          console.log("tempFilee", tempFilee);

          setFilesAale(true);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [filesUpdated]);

  const getID = (arr, docKey) => {
    return arr.find((file) => file?.docKey === docKey)?.id;
  };

  const getFilePath = (arr, id) => {
    return arr.find((file) => file?.docKey === id)?.filePath;
  };

  const getStatus = (arr, docKey) => {
    return arr.find((file) => file?.docKey === docKey)?.status;
  };

  const getDocumentName = (value, lang) => {
    if (lang == "en") {
      return documents.find((arg) => arg.id === value)?.documentNameEn;
    } else {
      return documents.find((arg) => arg.id === value)?.documentNameMr;
    }
  };

  //aprovel
  const remarks = (props) => {
    let btnSaveText = props;
    // alert('hsdlkfj')
    let approveRemark = null;
    let rejectRemark = null;
    if (btnSaveText == "APPROVE") {
      approveRemark = remark;
    } else if (btnSaveText == "REASSIGN") {
      rejectRemark = remark;
    }

    let data = "";
    const finalBody = {
      ...data,
      id: Number(router.query.id),
      approveRemark,
      rejectRemark,
      role: "DOCUMENT_CHECKLIST",
      //role: 'FINAL_APPROVAL',
    };
    console.log("remark44444", remark);
    axios
      .post(
        `${urls.MR}/transaction/applicant/saveApplicationApprove`,
        finalBody,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((response) => {
        if (response.status === 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          // router.push(
          //   '/marriageRegistration/transactions/newMarriageRegistration/cleark',
          // )
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  // view
  const FormPreview = (record) => {
    const record1 = { ...record };
    ApplicationFormPreview(record1);
    formPreviewDailogOpen();
    // setFormDailogState(true);
    // setValue("formPreviewDailogState", true);
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

  return (
    <>
      <form onSubmit={handleSubmit(onFinish)}>
        <ThemeProvider theme={theme}>
          <FormProvider {...methods}>
            <Paper
              sx={{
                marginLeft: 2,
                marginRight: 2,
                marginTop: 1,
                marginBottom: 2,
                padding: 1,
              }}
            >
              <div className={styles.small}>
                <div className={styles.detailsApot}>
                  <div className={styles.h1TagApot}>
                    <h1
                      style={{
                        color: "white",
                        marginTop: "1px",
                      }}
                    >
                      Document Verification
                    </h1>
                  </div>
                </div>
                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "6px",
                      }}
                    >
                      Applicant details
                    </h3>
                  </div>
                </div>

                <div className={styles.row2}>
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Service Name"
                      variant="standard"
                      {...register("serviceName")}
                      error={!!errors.serviceName}
                      helperText={
                        errors?.serviceName ? errors.serviceName.message : null
                      }
                    />
                  </div>

                  <div>
                    <TextField
                      id="standard-basic"
                      label="Applicant Name"
                      variant="standard"
                      {...register("applicantName")}
                      error={!!errors.applicantName}
                      helperText={
                        errors?.applicantName
                          ? errors.applicantName.message
                          : null
                      }
                    />
                  </div>
                </div>

                <div className={styles.row2}>
                  <div>
                    <TextField
                      id="standard-basic"
                      label="Application Number"
                      variant="standard"
                      {...register("applicationNumber")}
                      error={!!errors.applicationNumber}
                      helperText={
                        errors?.applicationNumber
                          ? errors.applicationNumber.message
                          : null
                      }
                    />
                  </div>

                  <div>
                    <TextField
                      id="standard-basic"
                      label="Application Date"
                      variant="standard"
                      {...register("applicationDate")}
                      error={!!errors.applicationDate}
                      helperText={
                        errors?.applicationDate
                          ? errors.applicationDate.message
                          : null
                      }
                    />
                  </div>
                </div>

                <div className={styles.details}>
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "6px",
                      }}
                    >
                      Uploaded Documents
                    </h3>
                  </div>
                </div>

                <div className={styles.row2}>
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                    onClick={() => FormPreview(router.query)}
                  >
                    View Form
                  </Button>
                </div>

                <div className={styles.apprve} style={{ marginTop: "25px" }}>
                  <Button
                    variant="contained"
                    endIcon={<NextPlanIcon />}
                    color="success"
                    onClick={() => {
                      setmodalforAprov(true);
                    }}
                  >
                    Action
                  </Button>

                  <Button
                    variant="contained"
                    endIcon={<CloseIcon />}
                    color="error"
                    // onClick={() => {
                    //   setmodalforRejt(true)
                    // }}
                  >
                    exit
                  </Button>
                </div>
              </div>
            </Paper>
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
                <ApplicantDetails />
                <GroomDetails />
                <BrideDetails />
                <PriestDetails />
                <WitnessDetails />
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
          </FormProvider>
        </ThemeProvider>
        <form onSubmit={handleSubmit("remarks")}>
          <div className={styles.model}>
            <Modal
              open={modalforAprov}
              //onClose={clerkApproved}
              onCancel={() => {
                setmodalforAprov(false);
              }}
            >
              <div className={styles.boxRemark}>
                <div className={styles.titlemodelremarkAprove}>
                  <Typography
                    className={styles.titleOne}
                    variant="h6"
                    component="h2"
                    color="#f7f8fa"
                    style={{ marginLeft: "25px" }}
                  >
                    Enter Remark on application
                  </Typography>
                  <IconButton>
                    <CloseIcon
                      onClick={() =>
                        router.push(
                          `/marriageRegistration/transactions/newMarriageRegistration/newMarriageRegistractionRecord`,
                        )
                      }
                    />
                  </IconButton>
                </div>

                <div className={styles.btndate} style={{ marginLeft: "200px" }}>
                  <TextareaAutosize
                    aria-label="minimum height"
                    minRows={4}
                    placeholder="Enter a Remarks"
                    style={{ width: 700 }}
                    onChange={(e) => {
                      setRemark(e.target.value);
                    }}
                  />
                </div>

                <div className={styles.btnappr}>
                  <Button
                    variant="contained"
                    color="success"
                    endIcon={<ThumbUpIcon />}
                    onClick={async () => {
                      remarks("APPROVE");
                      // setBtnSaveText('APPROVED')
                      router.push(
                        `/marriageRegistration/transactions/newMarriageRegistration/newMarriageRegistractionRecord`,
                      );
                    }}
                  >
                    approve
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<UndoIcon />}
                    onClick={() => {
                      // alert('tu karnar ressign ')
                      // setBtnSaveText('REASSIGN')
                      remarks("REASSIGN");
                      router.push(
                        `/marriageRegistration/transactions/newMarriageRegistration/newMarriageRegistractionRecord`,
                      );
                    }}
                  >
                    reassign
                  </Button>

                  <Button
                    variant="contained"
                    endIcon={<CloseIcon />}
                    color="error"
                    onClick={() =>
                      router.push(
                        `/marriageRegistration/transactions/newMarriageRegistration/newMarriageRegistractionRecord`,
                      )
                    }
                  >
                    Exit
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </form>
      </form>
    </>
  );
};

export default Index;
