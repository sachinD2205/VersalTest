import { yupResolver } from "@hookform/resolvers/yup";
import {
  Delete,
  DocumentScanner,
  Language,
  Visibility,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Step,
  StepButton,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { default as swal, default as sweetAlert } from "sweetalert";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../../styles/LegalCase_Styles/view.module.css";
import urls from "../../../../../URLS/urls";
import { DataGrid } from "@mui/x-data-grid";
import {
  parawiseRequestLcClerk,
  parawiseRequestLcClerkMr,
} from "../../../../../containers/schema/LegalCaseSchema/parawiseRequest";
import FileTable from "../../../FileUploadByAnwar/FileTable";
import BreadcrumbComponent from "../../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import GoogleTranslationComponent from "../../../../../components/common/linguosol/googleTranslation";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import Loader from "../../../../../containers/Layout/components/Loader";
import { saveAs } from "file-saver";

import {
  DecryptData,
  EncryptData,
} from "../../../../../components/common/EncryptDecrypt";

const View = () => {
  const user = useSelector((state) => {
    return state.user.user;
  });

  const [dataValidation, setDataValidation] = useState(parawiseRequestLcClerk);
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(dataValidation),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    // methods,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = methods;

  //   defaultValues: {
  //     // parawiseRequestAttachmentList: [],
  //   },
  // });

  const router = useRouter();
  const styleForModal = {
    position: "absolute",
    top: "20%",
    left: "20%",
    // transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [dataToAttachInPayload, setdataToAttachInPayload] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [selectedRowData, setSelectedRowData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [officeLocationList, setOfficeLocationList] = useState([]);

  const [_arr, setArr] = useState([]);
  const selectedNotice = useSelector((state) => {
    return state.user.selectedNotice;
  });
  const [rowsData, setRowsData] = useState([]);

  // For Modal
  const [openModal, setOpenModal] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [deptId, setDeptId] = useState(null);

  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] =
    useState([]);

  const [buttonInputStateNew, setButtonInputStateNew] = useState();

  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);

  //  +-+-+-+-+-+-+-+-+-+-+-+-+- Stepper Functions +-+-+-+-+-+-+-+-+-+-+-+-+-+
  const language = useSelector((state) => state?.labels?.language);

  const steps = [
    // <FormattedLabel key={1} id="parawiseReport" />,
    // <FormattedLabel key={2} id="documentUpload" />,
  ];

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const newCompleted = completed;
    newCompleted[activeStep - 1] = false;
    setCompleted(newCompleted);
  };

  const handleExit = () => {
    localStorage.removeItem("trnDptLocationDao");
    localStorage.removeItem("parawiseRequestAttachmentList");
    router.push(`/LegalCase/transaction/newCourtCaseEntry`);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleOpenModal = (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRowData(null);
    setModalOpen(false);
  };

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
      });
  };

  // officeLocation
  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          setOfficeLocationList(r.data.officeLocation);
        } else {
          //
        }
      })
      .catch((err) => {
        console.log("err", err);
        //
      });
  };

  const getDeptNameById = () => {
    axios
      .get(
        `${urls.LCMSURL}/parawiseRequest/getById?id=${router.query.paraReqId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("__res__res", res.data);
        let _res = res?.data?.trnParawiseListDao;
        setdataToAttachInPayload(res?.data);

        const transformedData = _res?.map((item, index) => {
          const filePaths = item?.parawiseRequestAttachmentList?.map(
            (attachment) => ({
              filePath: attachment?.filePath,
              FileName: attachment?.originalFileName,
            })
          );
          return {
            id: item.id,
            parawiseReqId: item.id,
            srNo: index + 1,

            //! location Id
            locationId: item?.locationId,

            locationNameEn: officeLocationList?.find(
              (obj) => obj?.id === item?.locationId
            )?.officeLocationName,
            locationNameMr: officeLocationList?.find(
              (obj) => obj?.id === item?.locationId
            )?.officeLocationNameMar,

            departmentId: item.departmentId,
            filePaths: filePaths,
            departmentNameEn: departments?.find(
              (obj) => obj.id == item?.departmentId
            )?.department,
            departmentNameMr: departments?.find(
              (obj) => obj.id == item?.departmentId
            )?.departmentMr,
          };
        });

        setRowsData(transformedData ?? []);
        setValue("clerkRemarkEnglish", res?.data?.parawiseReportRemarkClerk);
        setValue("clerkRemarkMarathi", res?.data?.parawiseReportRemarkClerkMr);
        setValue(
          "parawiseReportRemarkHod",
          res?.data?.hodReassignRemarkEnglish
        );
        setValue(
          "parawiseReportRemarkHodMr",
          res?.data?.hodReassignRemarkMarathi
        );
      });
  };

  //For clerkRemarkEnglishApi Translate

  const clerkRemarkEnglishApi = (
    currentFieldInput,
    updateFieldName,
    languagetype
  ) => {
    //---------------------------------- old-----------------------------------------
    // let stringToSend = currentFieldInput;
    // const url = `https://noncoredev.pcmcindia.gov.in/backend/lc/lc/api/translator/translate`;
    // axios.post(url, { body: stringToSend }).then((res) => {
    //   if (res?.status == 200 || res?.status == 201) {
    //     let bodyResponse = JSON.parse(res?.data.text);
    //     console.log("titlepanelRemark", bodyResponse.body);
    //     setValue("caseDetailsMr", bodyResponse?.body);
    //   }
    // });

    // --------------------------------new by vishal--------------------------------------------------------

    if (currentFieldInput) {
      let _payL = {
        apiKey: "Alpesh",
        textToTranslate: currentFieldInput,
        languagetype: languagetype,
      };
      setLoading(true);
      axios
        // .post(`${urls.TRANSLATIONAPI}`, _payL)
        .post(`${urls.GOOGLETRANSLATIONAPI}`, _payL)
        .then((r) => {
          setLoading(false);
          if (r.status === 200 || r.status === 201) {
            console.log("_res", currentFieldInput, r);
            if (updateFieldName) {
              setValue(updateFieldName, r?.data);
              clearErrors(updateFieldName);
            }
          }
        })
        .catch((e) => {
          setLoading(false);
          catchExceptionHandlingMethod(e, language);
        });
    } else {
      sweetAlert({
        title: language === "en" ? "Not Found !!" : "सापडले नाही !!",
        text:
          language === "en"
            ? "We do not received any input to translate !!"
            : "आम्हाला भाषांतर करण्यासाठी कोणतेही इनपुट मिळाले नाही !!",
        icon: "warning",
      });
    }
  };

  useEffect(() => {
    if (router?.query?.id) {
      axios
        .get(
          `${urls.LCMSURL}/transaction/newCourtCaseEntry/getByIdV1?id=${Number(
            router?.query?.id
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            console.log(":a4", res?.data);
            setdataToAttachInPayload(res?.data);
            localStorage.removeItem("parawiseRequestAttachmentList");
          } else {
            sweetAlert(
              // "Something Went Wrong, Please try Again Later!"
              language === "en"
                ? "Something Went Wrong, Please try Again Later!"
                : "काहीतरी चुकीचे घडले आहे, कृपया थोड्यावेळाने प्रयत्न करा!                  "
            );
            localStorage.removeItem("parawiseRequestAttachmentList");
          }
        })
        .catch((error) => {
          if (!error.status) {
            sweetAlert({
              title: "ERROR",
              text:
                // "Server is unreachable or may be a network issue, please try after sometime",
                language === "en"
                  ? "Server is unreachable or may be a network issue, please try after sometime"
                  : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
              icon: "warning",
              // buttons: ["No", "Yes"],
              dangerMode: false,
              closeOnClickOutside: false,
            });
            localStorage.removeItem("parawiseRequestAttachmentList");
          } else {
            localStorage.removeItem("parawiseRequestAttachmentList");
            sweetAlert(error);
          }
        });
    }
  }, [router?.query]);

  const onSubmitForm = (data) => {
    let getLocalDataToSend = localStorage.getItem(
      "parawiseRequestAttachmentList"
    )
      ? localStorage.getItem("parawiseRequestAttachmentList")
      : [];

    let setLocalDataToSend =
      getLocalDataToSend?.length !== 0 ? JSON.parse(getLocalDataToSend) : [];

    let paraWiseInfoWithFile = rowsData?.map((obj) => {
      return {
        caseDate: data?.caseDate,
        caseNumber: data?.caseNumber,
        caseNoYear: data?.caseNoYear,
        clerkRemarkEnglish: null,
        clerkRemarkMarathi: null,
        createdUserId: user.id,
        departmentId: obj.departmentId,
        locationId: obj.locationId,
        // parawiseRequestAttachmentListForUpload:
        parawiseRequestAttachmentList:
          setLocalDataToSend?.length != 0 ||
          Object.keys(setLocalDataToSend).length != 0
            ? setLocalDataToSend
                .filter((o) => o.deptId === obj.departmentId)
                .map((o) => ({
                  id: null,
                  parawiseRequestId: null,
                  attachedDate: o.attachedDate,
                  attacheDepartment: o.deptId,
                  attacheDesignation: null,
                  // attachedNameMr: null,
                  attachedNameMr: o?.attachedNameMr ?? null,
                  attachedNameEn: o.attachedNameEn,
                  attachedBy: null,
                  extension: o.extension,
                  filePath: o.filePath,
                  originalFileName: o.originalFileName,
                  createdUserId: user.id,
                  updateUserId: user.id,
                }))
            : [],
      };
    });
    let _newParaWiseInfoWithFile = rowsData?.map((obj) => {
      return {
        caseDate: data?.caseDate,
        caseNumber: data?.caseNumber,
        caseNoYear: data?.caseNoYear,
        clerkRemarkEnglish: null,
        clerkRemarkMarathi: null,
        createdUserId: user.id,
        departmentId: obj.departmentId,
        locationId: obj.locationId,
        parawiseRequestAttachmentList:
          setLocalDataToSend?.length != 0 ||
          Object.keys(setLocalDataToSend).length != 0
            ? setLocalDataToSend
                // .filter((o) => o.deptId === obj.departmentId)
                .map((o) => ({
                  id: null,
                  parawiseRequestId: null,
                  attachedDate: o.attachedDate,
                  attacheDepartment: obj.departmentId,
                  attacheDesignation: null,
                  // attachedNameMr: null,
                  attachedNameMr: o?.attachedNameMr ?? null,
                  attachedNameEn: o.attachedNameEn,
                  attachedBy: null,
                  extension: o.extension,
                  filePath: o.filePath,
                  originalFileName: o.originalFileName,
                  createdUserId: user.id,
                  updateUserId: user.id,
                }))
            : [],
      };
    });

    // let _body = {
    //   ...dataToAttachInPayload,
    //   parawiseReportRemarkClerk: data?.clerkRemarkEnglish,
    //   parawiseReportRemarkClerkMr: data?.clerkRemarkMarathi,
    //   remark: data?.clerkRemarkEnglish,
    //   remarkMr: data?.clerkRemarkMarathi,
    //   parawiseRequestList: paraWiseInfoWithFile,
    // };
    // let _body = {
    //   ...dataToAttachInPayload,
    //   remark: data?.clerkRemarkEnglish,
    //   remarkMr: data?.clerkRemarkMarathi,
    // trnParawiseRequestDao: {
    //   trnParawiseListDao: paraWiseInfoWithFile,
    //   parawiseReportRemarkClerk: data?.clerkRemarkEnglish,
    //   parawiseReportRemarkClerkMr: data?.clerkRemarkMarathi,
    // },
    // };
    let _body = {
      id: router?.query?.id,
      trnParawiseRequestDao: {
        trnParawiseListDao: paraWiseInfoWithFile,
        parawiseReportRemarkClerk: data?.clerkRemarkEnglish,
        parawiseReportRemarkClerkMr: data?.clerkRemarkMarathi,
      },
    };
    // _newBody for --> Docs for all --> _newParaWiseInfoWithFile
    let _newBody = {
      id: router?.query?.id,
      trnParawiseRequestDao: {
        trnParawiseListDao: _newParaWiseInfoWithFile,
        parawiseReportRemarkClerk: data?.clerkRemarkEnglish,
        parawiseReportRemarkClerkMr: data?.clerkRemarkMarathi,
      },
    };

    console.log("rowsData534534", rowsData);
    // for save revert parawise request
    if (router?.query?.paraReqId) {
      let _paraWiseInfoWithFile = rowsData?.map((obj) => {
        return {
          id: obj?.id,
          caseDate: data?.caseDate,
          caseNumber: data?.caseNumber,
          caseNoYear: data?.caseNoYear,
          clerkRemarkEnglish: null,
          clerkRemarkMarathi: null,
          createdUserId: user.id,
          departmentId: obj.departmentId,
          locationId: obj.locationId,
          // parawiseRequestAttachmentListForUpload:
          parawiseRequestAttachmentList:
            setLocalDataToSend?.length != 0 ||
            Object.keys(setLocalDataToSend).length != 0
              ? setLocalDataToSend
                  // .filter((o) => o.deptId === obj.departmentId)
                  .map((o) => ({
                    id: null,
                    parawiseRequestId: null,
                    attachedDate: o.attachedDate,
                    // attacheDepartment: o.deptId,
                    attacheDepartment: obj.departmentId,
                    attacheDesignation: null,
                    // attachedNameMr: null,
                    attachedNameMr: o?.attachedNameMr ?? null,
                    attachedNameEn: o.attachedNameEn,
                    attachedBy: null,
                    extension: o.extension,
                    filePath: o.filePath,
                    originalFileName: o.originalFileName,
                    createdUserId: user.id,
                    updateUserId: user.id,
                  }))
              : [],
        };
      });

      let body = {
        ...dataToAttachInPayload,
        parawiseReportRemarkClerk: data?.clerkRemarkEnglish,
        parawiseReportRemarkClerkMr: data?.clerkRemarkMarathi,
        trnParawiseListDao: _paraWiseInfoWithFile,
      };

      console.log("_body_forRevertParaReq", body);
      axios
        .post(`${urls.LCMSURL}/parawiseRequest/saveApprove`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("res123", res);
          if (res.status == 200) {
            sweetAlert(
              // "Saved!",
              Language === "en" ? "Saved!" : "जतन केले!",
              //  "Record Submitted successfully !",
              language === "en"
                ? "Record Submitted successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            localStorage.removeItem("parawiseRequestAttachmentList");
            router.push(`/LegalCase/transaction/newCourtCaseEntry`);
          }
        });
    } else {
      console.log("_body_body", _newBody);
      axios
        .post(
          // `${urls.LCMSURL}/transaction/newCourtCaseEntry/parawiseReportAssignDepartmentsByClerkV1`,
          `${urls.LCMSURL}/transaction/newCourtCaseEntry/saveApprove`,
          // _body
          _newBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res?.status == 200 || res?.status == 201) {
            sweetAlert(
              // "Saved!",
              language === "en" ? "Saved!" : "जतन केले!",
              //  "Record Saved successfully !",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            localStorage.removeItem("parawiseRequestAttachmentList");
            localStorage.removeItem("trnDptLocationDao");
            router.push(`/LegalCase/transaction/newCourtCaseEntry`);
          } else {
            sweetAlert(
              // "Something Went Wrong, Please try Again Later!"
              language === "en"
                ? "Something Went Wrong, Please try Again Later!"
                : "काहीतरी चुकीचे घडले आहे, कृपया थोड्यावेळाने प्रयत्न करा!"
            );
            localStorage.removeItem("parawiseRequestAttachmentList");
            localStorage.removeItem("trnDptLocationDao");
          }
        })
        .catch((error) => {
          if (!error.status) {
            sweetAlert({
              title: "ERROR",
              text:
                // "Server is unreachable or may be a network issue, please try after sometime"
                language === "en"
                  ? "Server is unreachable or may be a network issue, please try after sometime"
                  : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
              icon: "warning",
              // buttons: ["No", "Yes"],
              dangerMode: false,
              closeOnClickOutside: false,
            });
          } else {
            sweetAlert(error);
          }
        });
    }
  };

  function goToNewCourtCaseEntry() {
    router.push(`/LegalCase/transaction/newCourtCaseEntry`);
  }
  const handleDeleteDpt = (props) => {
    swal({
      title:
        // "Delete?"
        language === "en" ? "Delete?" : "हटवायचे?",
      text:
        // "Are you sure you want to delete the file ? "
        language === "en"
          ? "Are you sure you want to delete the file ?"
          : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let updatedArray = rowsData.filter(
          (obj) => obj.departmentId !== props.departmentId
        );

        setRowsData(updatedArray);
        setArr([]);

        //////////////////////// REMOVING DATA FROM LOCAL STORAGE ////////////////////////
        if (localStorage.getItem("parawiseRequestAttachmentList")) {
          if (
            JSON.parse(localStorage.getItem("parawiseRequestAttachmentList"))
          ) {
            // alert("aaya")
            let attachement = JSON.parse(
              localStorage.getItem("parawiseRequestAttachmentList")
            )?.filter((a) => a?.deptId != props.departmentId);
            localStorage.setItem(
              "parawiseRequestAttachmentList",
              JSON.stringify(attachement)
            );

            setNewCourtCaseEntryAttachmentList(attachement);
            setAdditionalFiles([]);

            console.log(":a6", attachement);
            // alert(" set kiya")
          }
        }
      } else {
        swal(
          // "File is Safe"
          language === "en" ? "File is Safe" : "फाइल सुरक्षित आहे"
        );
      }
    });
  };

  const _docsCol = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "FileName",
      headerName: language === "en" ? "File Name" : "फाईलचे नाव",
      valueFormatter: (params) =>
        params?.value?.split(".")?.slice(0, -1)?.join("."),
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      // field:
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                viewFile(record?.row?.filePath);
                //
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                //   "_blank"
                // );
              }}
            >
              <Visibility />
            </IconButton>
          </>
        );
      },
    },
  ];

  //view----------------------------------------------------------------
  // const viewFile = (filePath) => {
  //   console.log("filePath", filePath);

  //   //

  //   const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);

  //   const newFilePath = DecryptPhoto?.split(".").pop().toLowerCase();

  //   const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

  //   //
  //   if (filePath?.includes(".pdf")) {
  //     setLoading(true);
  //     // const url = `${urls.CFCURL}/file/preview?filePath=${filePath}`;

  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         responseType: "arraybuffer",
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         if (response && response.data instanceof ArrayBuffer) {
  //           const pdfBlob = new Blob([response.data], {
  //             type: "application/pdf",
  //           });
  //           const pdfUrl = URL.createObjectURL(pdfBlob);

  //           const newTab = window.open();
  //           newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
  //           // console.log("NewCode");
  //           // const newTab = window.open();
  //           // const iframe = document.createElement("iframe");
  //           // iframe.width = "100%";
  //           // iframe.height = "100%";
  //           // iframe.src = pdfUrl;
  //           // newTab.document.body.appendChild(iframe);
  //         } else {
  //           console.error("Invalid or missing data in the response");
  //         }
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".csv")) {
  //     setLoading(true);
  //     // const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         console.log("Excel API Response:", response);
  //         console.log("Excel API Response Data:", response.data.fileName);

  //         const excelBase64 = response.data.fileName;

  //         const data = base64ToArrayBuffer(excelBase64);

  //         const excelBlob = new Blob([data], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });

  //         saveAs(excelBlob, "NewDoc.csv");
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".xlsx")) {
  //     setLoading(true);
  //     // const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //         console.log("Excel API Response:", response);
  //         console.log("Excel API Response Data:", response.data.fileName);

  //         const excelBase64 = response.data.fileName;

  //         const data = base64ToArrayBuffer(excelBase64);

  //         const excelBlob = new Blob([data], {
  //           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //         });

  //         saveAs(excelBlob, "Vishaypatra.xlsx");
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //   } else {
  //     setLoading(true);
  //     // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

  //     const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
  //     axios
  //       .get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((r) => {
  //         setLoading(false);
  //         console.log(
  //           "ImageApi21312",
  //           `data:image/png;base64,${r?.data?.fileName}`
  //         );
  //         const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
  //         const newTab = window.open();
  //         // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
  //         newTab.document.body.innerHTML = `<img src="${imageUrl}" style="width: 100vw; height: 100vh; object-fit: scale-down ;" />`;
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
  //       });
  //   }
  // };

  //

  const viewFile = (filePath) => {
    // alert("aaaya");
    console.log("filePath", filePath);

    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);

    const newFilePath = DecryptPhoto?.split(".").pop().toLowerCase();

    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);

    if (newFilePath === "pdf") {
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log(r?.data, "doccheck32423");
          setLoading(false);
          // if (response && response.data instanceof ArrayBuffer) {
          //   const pdfBlob = new Blob([response.data], {
          //     type: "application/pdf",
          //   });
          //   const pdfUrl = URL.createObjectURL(pdfBlob);

          //   const newTab = window.open();
          //   newTab.document.body.innerHTML = `<iframe width="100%" height="100%" src="${pdfUrl}" frameborder="0"></iframe>`;
          // } else {
          //   console.error("Invalid or missing data in the response");
          // }

          // New
          if (
            r?.data?.mimeType == "application/xlxs" ||
            r?.data?.mimeType == "text/csv" ||
            r?.data?.mimeType ==
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            const excelBase64 = r?.data?.fileName;

            const data = base64ToArrayBuffer(excelBase64);

            const excelBlob = new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            saveAs(excelBlob, "FileName.xlsx");
          } else {
            // alert("pdf elsesss");
            const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
            const newTab = window.open();
            newTab.document.write(`
                    <html>
                      <body style="margin: 0;">
                        <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
                      </body>
                    </html>
                  `);
          }
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (newFilePath === "csv") {
      // alert("CSV");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          console.log("Excel API Response:", response);
          console.log("Excel API Response Data:", response.data.fileName);

          const excelBase64 = response.data.fileName;

          const data = base64ToArrayBuffer(excelBase64);

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(excelBlob, "NewDoc.csv");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else if (newFilePath === "xlsx") {
      // alert("xlsx");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoading(false);
          console.log("Excel API Response:", response);
          console.log("Excel API Response Data:", response.data.fileName);

          const excelBase64 = response.data.fileName;

          const data = base64ToArrayBuffer(excelBase64);

          const excelBlob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });

          saveAs(excelBlob, "Spreadsheetml.xlsx");
        })
        .catch((error) => {
          setLoading(false);
          callCatchMethod(error, language);
        });
    } else {
      // alert("else");
      setLoading(true);
      const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          // alert("then");
          setLoading(false);
          console.log(
            "ImageApi21312",
            `data:image/png;base64,${r?.data?.fileName}`
          );
          const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
          // alert("imageUrl");
          const newTab = window.open();
          // alert("window");
          // newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
          newTab.document.body.innerHTML = `<img src="${imageUrl}"/>`;
        })
        .catch((error) => {
          // alert("error");
          setLoading(false);
          callCatchMethod(error, language);
        });
    }
  };
  //
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };
  // ------------------------------------------------------------------------

  // Delete
  const discard = async (props) => {
    //

    const discardDecryptPhoto = DecryptData(
      "passphraseaaaaaaaaupload",
      props?.filePath
    );
    const discardFilePath = EncryptData(
      "passphraseaaaaaaadiscard",
      discardDecryptPhoto
    );

    //
    swal({
      title: language == "en" ? "Delete ?" : "हटवा ?",
      text:
        language == "en"
          ? "Are you sure you want to delete the file ?"
          : "तुम्हाला खात्री आहे की तुम्ही फाइल हटवू इच्छिता ?",
      icon: "warning",
      buttons: true,
      buttons: [
        language == "en" ? "Cancel" : "रद्द करा",
        language == "en" ? "OK" : "ठीक आहे",
      ],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `${urls.CFCURL}/file/discardEncrypted?filePath=${discardFilePath}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              let attachement =
                localStorage.getItem("parawiseRequestAttachmentList") &&
                JSON.parse(
                  localStorage.getItem("parawiseRequestAttachmentList")
                )
                  ?.filter((a) => a?.filePath != props.filePath)
                  ?.map((a) => a);

              setAdditionalFiles(attachement);

              localStorage.removeItem("parawiseRequestAttachmentList");

              localStorage.setItem(
                "parawiseRequestAttachmentList",
                attachement
              );
              swal(
                language == "en"
                  ? "File Deleted Successfully!"
                  : "फाइल यशस्वीरित्या हटवली!",
                { icon: "success" }
              );
            } else {
              swal("Something went wrong..!!!");
            }
          });
      }
    });
  };

  useEffect(() => {
    console.log("__rowsData", rowsData);
  }, [rowsData]);

  useEffect(() => {
    console.log("router?.query", router?.query);
    console.log("dataToAttachInPayload", dataToAttachInPayload);
    if (
      router?.query?.paraReqId &&
      departments?.length > 0 &&
      officeLocationList?.length > 0
    ) {
      getDeptNameById();

      // setValue("clerkRemarkEnglish", router?.query?.parawiseReportRemarkClerk);
      // setValue(
      //   "clerkRemarkMarathi",
      //   router?.query?.parawiseReportRemarkClerkMr
      // );
      // setValue(
      //   "parawiseReportRemarkHod",
      //   router?.query?.parawiseReportRemarkHod
      // );
      // setValue(
      //   "parawiseReportRemarkHodMr",
      //   router?.query?.parawiseReportRemarkHodMr
      // );
    }
  }, [router?.query, departments, officeLocationList]);

  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: language === "en" ? "Location Name" : "स्थानाचे नाव",
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      // field: "departmentNameEn",
      field: language === "mr" ? "departmentNameMr" : "departmentNameEn",

      // departmentNameMr
      // field: language === "en" ? "departmentNameEn" : "departmentNameMr",

      headerName: <FormattedLabel id="deptName" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "Docs",
      headerName: "View Previous Docs",
      headerAlign: "center",
      align: "center",
      width: 200,
      renderCell: (params) => {
        const rowData = params?.row; // Get the data of the current row

        return (
          rowData?.filePaths?.length !== 0 && (
            <Button
              size="small"
              variant="contained"
              onClick={() => handleOpenModal(rowData)}
            >
              View
            </Button>
          )
        );
      },
    },
    {
      headerName: <FormattedLabel id="action" />,
      width: 200,
      renderCell: (record) => {
        return (
          <>
            {/** deleteButton */}
            {rowsData && (
              <IconButton
                color="error"
                onClick={() => handleDeleteDpt(record.row)}
              >
                <Delete />
              </IconButton>
            )}

            {/* Document Upload button  */}
            {/* <Button
              sx={{
                height: "4vh",
                backgroundColor: "#D0EAFA",
              }}
              variant="outlined"
              onClick={() => {
                setOpenModal(true);

                setRowIndex(record.row.id);
                setDeptId(record.row.departmentId);
              }}
            >
              <FormattedLabel id="addDocuments" />
            </Button> */}
          </>
        );
      },
    },
  ];

  // For Docuemnt Upload
  // Columns
  const columns = [
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      // width: 300,
      valueFormatter: (params) =>
        params?.value?.split(".")?.slice(0, -1)?.join("."),
      flex: 0.7,
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      width: 140,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      // width: 300,
    },
    {
      // field:
      headerName: <FormattedLabel id="actions" />,
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            {/** viewButton */}
            <IconButton
              color="primary"
              onClick={() => {
                viewFile(record?.row?.filePath);
                // window.open(
                //   `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                //   "_blank"
                // );
              }}
            >
              <Visibility />
            </IconButton>
            {/** deleteButton */}
            {deleteButtonInputState && (
              <IconButton color="error" onClick={() => discard(record.row)}>
                {/* <IconButton
                color="error"
                onClick={() => console.log(":1bc", record.row)}
              > */}
                <Delete />
              </IconButton>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (
      localStorage.getItem("trnDptLocationDao") !== undefined &&
      localStorage.getItem("trnDptLocationDao") !== null
      // localStorage.getItem("trnDptLocationDao") !== []
    ) {
      let localRowsData = JSON.parse(localStorage.getItem("trnDptLocationDao"));

      if (
        localRowsData?.length > 0 &&
        officeLocationList?.length > 0 &&
        departments?.length > 0
      ) {
        let _data = localRowsData?.map((val, i) => {
          return {
            srNo: i + 1,
            id: i,
            departmentId: val?.dptId,
            locationId: val?.locationId,
            locationNameEn: officeLocationList?.find(
              (obj) => obj?.id === val?.locationId
            )?.officeLocationName,
            locationNameMr: officeLocationList?.find(
              (obj) => obj?.id === val?.locationId
            )?.officeLocationNameMar,
            departmentNameEn: departments?.find((obj) => obj?.id === val?.dptId)
              ?.department,
            departmentNameMr: departments?.find((obj) => obj?.id === val?.dptId)
              ?.departmentMr,

            // userName: allUserNames?.find(
            //   (obj) => obj?.id === val?.concernPersonId
            // )?.userName,
            // userNameMr: allUserNames?.find(
            //   (obj) => obj?.id === val.concernPersonId
            // )?.userNameMr,
          };
        });
        setRowsData(_data);
      }
    }
  }, [
    localStorage.getItem("trnDptLocationDao"),
    officeLocationList,
    departments,
  ]);

  useEffect(() => {
    if (router?.query) {
      setValue("caseNumber", router.query.caseNumber);
      setValue("caseNumber", router.query.caseNoYear);

      setValue("caseDate", router.query.fillingDate);
    }
  }, [router.query]);
  useEffect(() => {
    getOfficeLocation();
  }, []);

  useEffect(() => {
    if (activeStep == "0" && language == "en") {
      setDataValidation(parawiseRequestLcClerk);
    }
    if (activeStep == "0" && language == "mr") {
      setDataValidation(parawiseRequestLcClerkMr);
    }
  }, [activeStep, language]);

  useEffect(() => {
    getDepartments();
    if (router.query.pageMode === "Edit") {
      // reset(router.query);
      reset(selectedNotice);
      append({
        departmentName: "",
      });
      // attachedFileEdit = router.query.attachedFile
    }
  }, [officeLocationList]);

  useEffect(() => {
    if (additionalFiles?.length !== 0) {
      // alert("...mainFiles")
      setNewCourtCaseEntryAttachmentList([...mainFiles, ...additionalFiles]);
      localStorage.setItem(
        "parawiseRequestAttachmentList",
        JSON.stringify([...mainFiles, ...additionalFiles])
      );
    }
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    console.log("rowsData", rowsData);
  }, [rowsData]);
  return (
    <>
      <Box
        sx={{
          marginLeft: "1vw",
        }}
      >
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
      {loading ? (
        <Loader />
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div>
              <Paper
                sx={{
                  marginY: "10px",
                  paddingY: "10px",
                }}
              >
                <Box>
                  <Box>
                    {/* Form Header */}
                    <Box
                      style={{
                        // display: "flex",
                        // // justifyContent: "center",
                        // // marginLeft:'50px',
                        // paddingTop: "10px",
                        // // marginTop: "20px",

                        backgroundColor: "#556CD6",

                        color: "white",
                        fontSize: 19,
                        marginTop: 30,
                        marginBottom: 20,
                        // padding: 8,
                        height: "8vh",

                        paddingLeft: 30,
                        // marginLeft: "50px",
                        // marginRight: "75px",
                        borderRadius: 100,
                        width: "100%",

                        background: "#556CD6",
                      }}
                    >
                      <Typography
                        style={{
                          display: "flex",
                          marginLeft: "30px",
                          color: "white",
                          float: "left",
                          marginTop: "1vh",
                          // justifyContent: "center",
                        }}
                      >
                        <h2
                          style={{
                            // display: "flex",
                            // marginLeft: "30px",
                            color: "white",
                            // float: "left",
                            // marginTop: "1vh",
                            // justifyContent: "center",
                          }}
                        >
                          <FormattedLabel id="parawiseReport" />
                        </h2>
                      </Typography>
                    </Box>

                    {/* 1st Row */}
                    <Grid container sx={{ padding: "10px", marginTop: "7vh" }}>
                      <Grid
                        item
                        xs={12}
                        sm={8}
                        md={6}
                        lg={4}
                        xl={2}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          sx={{ width: "90%" }}
                          autoFocus
                          disabled
                          id="standard-basic"
                          InputLabelProps={{ shrink: true }}
                          label={<FormattedLabel id="courtCaseNumber" />}
                          variant="standard"
                          {...register("caseNumber")}
                        />
                      </Grid>

                      {/* Case Date */}
                      <Grid
                        item
                        xs={12}
                        sm={8}
                        md={6}
                        lg={4}
                        xl={2}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl fullWidth sx={{ width: "90%" }}>
                          <Controller
                            control={control}
                            name="caseDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  disabled
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="caseDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      size="small"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* 2nd row */}
                    <Grid container sx={{ padding: "20px", marginTop: "5vh" }}>
                      {/* remarks in English */}
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{
                          display: "flex",
                          // justifyContent: "center",
                          // alignItems: "center",
                          // border: "2px solid red",
                          marginLeft: "10px",
                        }}
                      >
                        <TextField
                          multiline
                          fullWidth
                          sx={{ width: "87%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="remarksEn" required />}
                          variant="standard"
                          {...register("clerkRemarkEnglish")}
                          error={!!errors.clerkRemarkEnglish}
                          helperText={
                            errors?.clerkRemarkEnglish
                              ? errors.clerkRemarkEnglish.message
                              : null
                          }
                          InputLabelProps={{
                            shrink:
                              (watch("clerkRemarkEnglish") ? true : false) ||
                              (router.query.clerkRemarkEnglish ? true : false),
                          }}
                        />

                        {/* New Transliteration  */}

                        {/* <GoogleTranslationComponent
                          _key={"clerkRemarkEnglish"}
                          labelName={"clerkRemarkEnglish"}
                          fieldName={"clerkRemarkEnglish"}
                          updateFieldName={"clerkRemarkMarathi"}
                          sourceLang={"en"}
                          targetLang={"mr"}
                          targetError={"clerkRemarkMarathi"}
                          // disabled={disabled}
                          label={<FormattedLabel id="remarksEn" required />}
                          error={!!errors.clerkRemarkEnglish}
                          helperText={
                            errors?.clerkRemarkEnglish
                              ? errors.clerkRemarkEnglish.message
                              : null
                          }
                        /> */}

                        <Button
                          variant="contained"
                          sx={{
                            marginTop: "4vh",
                            marginLeft: "2vw",
                            height: "5vh",
                            width: "8vw",

                            // backgroundColor: "green",
                          }}
                          onClick={() =>
                            clerkRemarkEnglishApi(
                              watch("clerkRemarkEnglish"),
                              "clerkRemarkMarathi",
                              "en"
                            )
                          }
                        >
                          <FormattedLabel id="mar" />
                        </Button>
                      </Grid>

                      {/* remarksMr in Marathi */}
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        sx={{
                          display: "flex",
                          // justifyContent: "center",
                          // alignItems: "center",
                          marginTop: "5vh",
                          // border: "2px solid red",
                          marginLeft: "10px",
                        }}
                      >
                        <TextField
                          multiline
                          fullWidth
                          sx={{ width: "87%", marginTop: "5vh" }}
                          id="standard-basic"
                          label={<FormattedLabel id="remarksMr" />}
                          // label="Advocate Address (In Marathi)"
                          variant="standard"
                          {...register("clerkRemarkMarathi")}
                          error={!!errors.clerkRemarkMarathi}
                          helperText={
                            errors?.clerkRemarkMarathi
                              ? errors.clerkRemarkMarathi.message
                              : null
                          }
                          InputLabelProps={{
                            shrink:
                              (watch("clerkRemarkMarathi") ? true : false) ||
                              (router.query.clerkRemarkMarathi ? true : false),
                          }}
                        />
                        <Button
                          variant="contained"
                          sx={{
                            marginTop: "4vh",
                            marginLeft: "2vw",
                            height: "5vh",
                            width: "8vw",

                            // backgroundColor: "green",
                          }}
                          onClick={() =>
                            clerkRemarkEnglishApi(
                              watch("clerkRemarkMarathi"),
                              "clerkRemarkEnglish",
                              "mr"
                            )
                          }
                        >
                          <FormattedLabel id="eng" />
                        </Button>

                        {/* New Transliteration  */}
                        {/* <GoogleTranslationComponent
                          _key={"clerkRemarkMarathi"}
                          labelName={"clerkRemarkMarathi"}
                          fieldName={"clerkRemarkMarathi"}
                          updateFieldName={"clerkRemarkEnglish"}
                          sourceLang={"mr"}
                          targetLang={"en"}
                          targetError={"clerkRemarkEnglish"}
                          // disabled={disabled}
                          label={<FormattedLabel id="remarksMr" />}
                          error={!!errors.clerkRemarkMarathi}
                          helperText={
                            errors?.clerkRemarkMarathi
                              ? errors.clerkRemarkMarathi.message
                              : null
                          }
                        /> */}
                      </Grid>
                    </Grid>
                    {router?.query?.paraReqId && (
                      <Grid
                        container
                        sx={{ padding: "10px", marginLeft: "1vw" }}
                      >
                        <Grid
                          item
                          xs={12}
                          xl={12}
                          md={12}
                          sm={12}
                          sx={
                            {
                              // marginTop:"30px"
                              // display: "flex",
                              // justifyContent: "center",
                              // alignItems: "center",
                            }
                          }
                        >
                          <Transliteration
                            _key={"parawiseReportRemarkHod"}
                            labelName={"parawiseReportRemarkHod"}
                            fieldName={"parawiseReportRemarkHod"}
                            updateFieldName={"parawiseReportRemarkHodMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            disabled={true}
                            label={
                              <FormattedLabel id="hodRemarksEn" required />
                            }
                            error={!!errors.parawiseReportRemarkHod}
                            helperText={
                              errors?.parawiseReportRemarkHod
                                ? errors.parawiseReportRemarkHod.message
                                : null
                            }
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          xl={12}
                          md={12}
                          sm={12}
                          sx={{
                            marginTop: "20px",
                            // display: "flex",
                            // justifyContent: "center",
                            // alignItems: "center",
                          }}
                        >
                          <Transliteration
                            _key={"parawiseReportRemarkHodMr"}
                            labelName={"parawiseReportRemarkHodMr"}
                            fieldName={"parawiseReportRemarkHodMr"}
                            updateFieldName={"parawiseReportRemarkHod"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            disabled={true}
                            label={
                              <FormattedLabel id="hodRemarksMr" required />
                            }
                            error={!!errors.parawiseReportRemarkHodMr}
                            helperText={
                              errors?.parawiseReportRemarkHodMr
                                ? errors.parawiseReportRemarkHodMr.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                    )}

                    {/* dept names and table */}
                    <Grid
                      container
                      sx={{ my: "25px" }}
                      // style={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      // }}
                    >
                      {/*  Department name */}
                      {/* <Grid
                      item
                      xs={8}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        fullWidth
                        size='small'
                        sx={{ width: "90%" }}
                        error={rowsData.length === 0 && !!errors.departmentName}
                      >
                        <InputLabel id='demo-simple-select-standard-label'>
                          <FormattedLabel id='deptName' />
                        </InputLabel>

                        <Controller
                          render={({ field }) => (
                            <Select
                              labelId='demo-simple-select-label'
                              id='demo-simple-select'
                              label={<FormattedLabel id='deptName' />}
                              value={field.value}
                              // onChange={(value) => field.onChange(value)}
                              onChange={(value) => {
                                field.onChange(value);
                                // setSelectedDepartment(
                                //   value.target.value
                                // );
                              }}
                              style={{ backgroundColor: "white" }}
                            >
                              {departments.length > 0
                                ? departments
                                    .slice()
                                    .sort((a, b) =>
                                      a.department.localeCompare(
                                        b.department,
                                        undefined,
                                        {
                                          numeric: true,
                                        }
                                      )
                                    )
                                    .map((dept, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={dept.id}
                                          style={{
                                            display: dept.department
                                              ? "flex"
                                              : "none",
                                          }}
                                        >
                                          {language == "en"
                                            ? dept?.department
                                            : dept?.departmentMr}
                                        </MenuItem>
                                      );
                                    })
                                : []}
                            </Select>
                          )}
                          name='departmentName'
                          // name="department"
                          control={control}
                          defaultValue=''
                        />
                        <FormHelperText style={{ color: "red" }}>
                          {rowsData.length === 0 &&
                            (errors?.departmentName
                              ? errors.departmentName.message
                              : null)}
                        </FormHelperText>
                      </FormControl>

                      </Grid> */}
                      {/* Autocomplte */}
                      {/* <Grid
                      item
                      xs={8}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        error={!!errors?.departmentName}
                        sx={{ marginTop: 2, marginLeft: "-190px" }}
                      >
                        <Controller
                          name="departmentName"
                          control={control}
                          defaultValue={null}
                          render={({ field: { onChange, value } }) => (
                            <Autocomplete
                              variant="standard"
                              id="controllable-states-demo"
                              sx={{ width: 300 }}
                              onChange={(event, newValue) => {
                                onChange(newValue ? newValue.id : null); //! store Selected id -- dont change here
                              }}
                              value={
                                departments?.find(
                                  (data) => data?.id === value
                                ) || null
                              }
                              options={departments.sort((a, b) =>
                                language === "en"
                                  ? a.department.localeCompare(b.department)
                                  : a.departmentMr.localeCompare(b.departmentMr)
                              )} //! api Data
                              getOptionLabel={(data) =>
                                language == "en"
                                  ? data?.department
                                  : data?.departmentMr
                              } //! Display name the Autocomplete
                              renderInput={(params) => (
                                //! display lable list
                                <TextField
                                  fullWidth
                                  {...params}
                                  label={
                                    language == "en"
                                      ? "Department Name"
                                      : "विभागाचे नाव"
                                  }
                                  // variant="outlined"
                                  variant="standard"
                                />
                              )}
                              // disabled={disabledButtonInputState}
                            />
                          )}
                        />
                        <FormHelperText>
                          {errors?.departmentName
                            ? errors?.departmentName?.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid> */}

                      {/* Add More Button */}
                      <Grid
                        item
                        xs={2}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {watch("departmentName") && (
                          <Button
                            // disabled={typeof watch("departmentName") == "string"}
                            variant="contained"
                            size="small"
                            onClick={(e, index) => {
                              let obj = {
                                departmentId: watch("departmentName"),
                                index: index,
                              };

                              let temp;

                              if (_arr.length > 0) {
                                setArr([..._arr, obj]);
                                temp = [..._arr, obj];
                              } else {
                                setArr([obj]);
                                temp = [obj];
                              }

                              let uniqueDepartmentIds = [];
                              let _res =
                                temp && temp.length !== 0
                                  ? temp.reduce((result, val, i) => {
                                      if (
                                        !uniqueDepartmentIds.includes(
                                          val.departmentId
                                        )
                                      ) {
                                        uniqueDepartmentIds.push(
                                          val.departmentId
                                        );
                                        result.push({
                                          srNo: result.length + 1,
                                          id: i,
                                          locationId: val?.locationId,
                                          departmentNameEn: departments?.find(
                                            (obj) =>
                                              obj?.id === val.departmentId
                                          )?.department,
                                          departmentNameMr: departments?.find(
                                            (obj) =>
                                              obj?.id === val.departmentId
                                          )?.departmentMr,
                                          departmentId: val?.departmentId,
                                        });
                                      }
                                      return result;
                                    }, [])
                                  : [];

                              setRowsData(_res);

                              setValue("departmentName", null);
                            }}
                          >
                            <FormattedLabel id="add" />
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        // display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            setOpenModal(true);
                            // setRowIndex(record.row.id);
                            // setDeptId(record.row.departmentId);
                          }}
                        >
                          {" "}
                          {/* Add / View Documents */}
                          {language == "en"
                            ? "Add / View Documents"
                            : "दस्तऐवज जोडा / पहा"}
                        </Button>
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <DataGrid
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
                        density="compact"
                        autoHeight={true}
                        pagination
                        paginationMode="server"
                        rows={rowsData}
                        columns={_col.filter((obj) => {
                          if (router?.query?.paraReqId) {
                            return obj;
                          } else {
                            return obj?.field !== "Docs";
                          }
                        })}
                        onPageChange={(_data) => {}}
                        onPageSizeChange={(_data) => {}}
                      />
                    </Grid>
                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Grid
                        item
                        xs={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={handleExit}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                      {/* <Grid item xs={9}>
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={handleBack}
                        disabled={activeStep == 0}
                        sx={{ mr: 1 }}
                        size="small"
                      >
                        <FormattedLabel id="back" />
                      </Button>
                    </Grid> */}
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          color="primary"
                          variant="contained"
                          size="small"
                          // onClick={finalSubmit}
                          type="submit"
                          name="buttonname"
                          value="hiddenvalue"
                        >
                          <FormattedLabel id="save" />
                        </Button>
                      </Grid>
                    </Grid>
                    {/* </> */}
                    {/* )} */}
                  </Box>

                  <Box>
                    <Modal
                      open={modalOpen}
                      onClose={handleCloseModal}
                      sx={{
                        padding: 5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                      }}
                    >
                      {/* <Box
                      sx={{
                        width: "auto",
                        bgcolor: "white",
                        p: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        border: "1px solid black",
                        borderRadius: "20px",
                      }}
                    >
                      {selectedRowData && (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexWrap: "wrap",
                            // flexDirection: "column",
                          }}
                        >
                          {selectedRowData?.filePaths.map((filePath, index) => (
                            <IconButton
                              key={index}
                              color="primary"
                              onClick={() => {
                                window.open(
                                  `${urls.CFCURL}/file/preview?filePath=${filePath.filePath}`,
                                  "_blank"
                                );
                              }}
                            >
                              <div
                                style={
                                  {
                                    // display: "flex",
                                    // justifyContent: "center",
                                    // alignItems: "center",
                                    // flexWrap: "wrap",
                                  }
                                }
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "15px",
                                    color: "black",
                                  }}
                                >
                                  {filePath?.FileName}
                                </Button>
                              </div>
                            </IconButton>
                          ))}
                        </div>
                      )}

                      <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={handleCloseModal}
                        sx={{
                          marginTop: "20px",
                        }}
                      >
                        <FormattedLabel id="submit" />
                      </Button>
                    </Box> */}
                      <Box sx={styleForModal}>
                        <>
                          <div
                            style={{
                              backgroundColor: "#0084ff",
                              color: "white",
                              fontSize: 19,
                              marginTop: 30,
                              marginBottom: 20,
                              padding: 8,
                              paddingLeft: 30,
                              marginLeft: "50px",
                              marginRight: "75px",
                              borderRadius: 100,
                            }}
                          >
                            <strong
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              All Previous Documents
                            </strong>
                          </div>
                          <DataGrid
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
                            density="compact"
                            getRowId={(row) => row.srNo}
                            autoHeight
                            scrollbarSize={17}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            // pagination
                            // paginationMode="server"
                            // hideFooter={true}
                            rows={
                              // []
                              selectedRowData?.filePaths?.map((data, i) => {
                                return {
                                  ...data,
                                  srNo: i + 1,
                                };
                              })
                            }
                            columns={_docsCol}
                            // onPageChange={(_data) => {}}
                            // onPageSizeChange={(_data) => {}}
                          />
                          <Grid
                            container
                            paddingTop={2}
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                          >
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              onClick={handleCloseModal}
                              sx={{
                                marginTop: "20px",
                              }}
                            >
                              <FormattedLabel id="submit" />
                            </Button>
                          </Grid>
                        </>
                      </Box>
                    </Modal>
                    {/* For Modal  */}
                    <Modal
                      open={openModal}
                      sx={{
                        // padding: 5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          border: "5px",
                          background: "white",
                          // marginTop: "100px",
                          height: "auto",
                          width: "1000px",
                          // marginLeft: "200px",
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          textAlign: "center",
                        }}
                      >
                        <Typography>Document Upload</Typography>

                        {/** FileTableComponent **/}
                        <FileTable
                          appName="LCMS" //Module Name
                          serviceName={"L-Notice"} //Transaction Name
                          fileName={attachedFile} //State to attach file
                          filePath={setAttachedFile} // File state upadtion function
                          newFilesFn={setAdditionalFiles} // File data function
                          columns={columns} //columns for the table
                          rows={NewCourtCaseEntryAttachmentList} //state to be displayed in table
                          uploading={setUploading}
                          buttonInputStateNew={buttonInputStateNew}
                          rowIndex={rowIndex != null ? rowIndex : null}
                          deptId={deptId != null ? deptId : null}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "20px",
                          }}
                        >
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => {
                              setOpenModal(false);
                              setRowIndex(null);
                              setDeptId(null);
                            }}
                            sx={{ width: "70px", marginBottom: "20px" }}
                          >
                            {language == "en" ? "close" : "बंद करा"}
                          </Button>
                        </div>
                      </Box>
                    </Modal>
                  </Box>
                </Box>
              </Paper>
            </div>
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default View;
