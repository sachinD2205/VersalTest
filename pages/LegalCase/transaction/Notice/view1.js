import Check from "@mui/icons-material/Check";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import { LoadingButton } from "@mui/lab";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  ThemeProvider,
  Typography,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { BasicApplicationDetailsSchema } from "../../../../components/streetVendorManagementSystem/schema/issuanceOfHawkerLicenseSchema";
import SachinTempSchema from "../../../../components/streetVendorManagementSystem/schema/sachinTempSchema.js";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import Documents from "./Documents";
import NoticeDetails from "./NoticeDetails";
import urls from "../../../../URLS/urls";
import axios from "axios";
import {
  Schema,
  SchemaMr,
} from "../../../../containers/schema/LegalCaseSchema/newNoticeSchema";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from "moment";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { Language, Visibility } from "@mui/icons-material";
import { language } from "../../../../features/labelSlice";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { catchExceptionHandlingMethod } from "../../../../util/util";

import { saveAs } from "file-saver";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt/index.js";

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#784af4",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(100,255,253,1) 0%,rgb(93,99,252,1) 50%,rgb(16,21,145,1) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    // background: rgb(9,32,121),
    // background: linear-gradient(90deg, rgba(9,32,121,1) 1%, rgba(0,212,255,1) 76%);
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
    // "radial-gradient(circle, rgba(100,255,250,1) 11%, rgba(16,21,145,1) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(90deg, rgba(58,81,180,1) 0%, rgba(29,162,253,1) 68%, rgba(69,252,243,0.9700922605370274) 100%)",
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    // 1: <SettingsIcon />,
    1: <PermIdentityIcon />,
    2: <UploadFileIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

// Get steps - Name
function getSteps(i) {
  return [
    <strong key={1}>{<FormattedLabel id="noticeDetails" key={1} />}</strong>,
    <strong key={2}>{<FormattedLabel id="documentUpload" key={2} />}</strong>,
  ];
}

// Get Step Content Form
function getStepContent(step) {
  console.log("step123", step);
  switch (step) {
    case 0:
      return <NoticeDetails key={1} />;

    case 1:
      return <Documents key={2} />;
  }
}

// Linear Stepper - sachin
const LinaerStepper = () => {
  // const [dataValidation, setDataValidation] = useState(Schema);
  // const methods = useForm({
  //   resolver: yupResolver(SachinTempSchema),
  // });

  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    defaultValues: {
      caseNumber: "",
    },
  });

  const {
    watch,
    register,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = methods;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "white",
    boxShadow: 10,
    p: 2,
  };
  // const { register, getValues, setValue, handleSubmit, methos, watch, reset } = methods;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const dispach = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadderState, setLoadderState] = useState(false);
  const [draftId, setDraftId] = useState();
  const [noticePageMode, setNoticePageMode] = useState();
  let user = useSelector((state) => state.user.user);
  const userDepartment = useSelector(
    (state) => state?.user?.user?.userDao?.department
  );
  const token = useSelector((state) => state.user.user.token);
  const [noticeID, setNoticeID] = useState();
  const [temp, setTemp] = useState();
  const language = useSelector((state) => state?.labels?.language);

  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [dataSource2, setDataSource2] = useState([]);
  const [dataSource3, setDataSource3] = useState([]);
  const [dataSource4, setDataSource4] = useState([]);
  const [departments, setDepartments] = useState([]);

  let pageModeM;

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
  //----------------------view-Remarks---------------------------------------------------------------
  const [displayRemarks, setDisplayRemarks] = useState({});
  const [remarksOpen, setRemarksOpen] = useState(false);
  const handleOpenRemarks = (params) => {
    // const { field, headerName } = params.colDef;
    console.log("Selected Field:", {
      headerName: params.colDef?.headerName,
      value: params?.value,
    });
    setDisplayRemarks({
      headerName: params.colDef?.headerName ?? "",
      value: params?.value ?? "",
    });
    setRemarksOpen(true);
  };

  //view----------------------------------------------------------------
  // const viewFile = (filePath) => {
  //   console.log("filePath", filePath);
  //   if (filePath?.includes(".pdf")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/preview?filePath=${filePath}`;
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
  //         } else {
  //           console.error("Invalid or missing data in the response");
  //         }
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         callCatchMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".csv")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

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
  //         callCatchMethod(error, language);
  //       });
  //   } else if (filePath?.includes(".xlsx")) {
  //     setLoading(true);
  //     const url = `${urls.CFCURL}/file/previewNew?filePath=${filePath}`;

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
  //         callCatchMethod(error, language);
  //       });
  //   } else {
  //     setLoading(true);
  //     const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
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
  //         callCatchMethod(error, language);
  //       });
  //   }
  // };

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
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
  };

  // Handle Back
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("departments", res?.data?.department);
        setDepartments(
          res?.data?.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
      })
      .catch((error) => {
        // setLoading(false);
        callCatchMethod(error, language);
      });
  };

  const getByNoticeID = () => {
    setLoadderState(true);

    if (noticeID != null || noticeID != "" || noticeID != undefined) {
      axios
        .get(`${urls.LCMSURL}/notice/getNoticeById?noticeId=${noticeID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          console.log("32432dsfjsdk", r?.data?.concernDeptUserList);
          if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
            console.log("r000i", r?.data);
            reset(r?.data);
            console.log("getByIdNoticeData89348934", r.data);
            console.log("first", localStorage.getItem("rowsData"));
            // setValue("rowsData", r?.data?.concernDeptUserList);
            // let concernDeptUserList = r?.data?.concernDeptUserList ? r?.data?.concernDeptUserList?.map((data, index) => {
            //   return {
            //     srNo: index + 1,
            //     id: data?.id,
            //     activeFlag: data?.activeFlag,
            //     departmentId: data?.departmentId,
            //     empoyeeId: data?.empoyeeId,
            //     id: data?.id,
            //     notice: data?.notice,
            //     locationId: data?.locationId,
            //   };
            // }) : []
            // localStorage.setItem("rowsData", JSON.stringify(concernDeptUserList));
            setValue("noticeAttachment", r?.data?.noticeAttachment);
            setTemp("dsf");
            setLoadderState(false);
            let _dataSour4 = [
              {
                srNo: 1,
                ...r?.data,
              },
            ];
            setDataSource4(_dataSour4 ?? []);
            console.log("_dataSour4", _dataSour4);
          } else {
            setLoadderState(false);
            //
          }
        });
      // ?.catch((err) => {
      //   console.log("err", err);
      //   callCatchMethod(err, language);
      // });
    }
  };
  // get Response to Notice Legal HOD
  const getResponseToNoticeLegalHOD = () => {
    axios
      .get(
        `${urls.LCMSURL}/notice/getNoticeById?noticeId=${noticeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        //   notice/getNoticeById?noticeId=${noticeID}`)
      )
      .then((res) => {
        let _res = res?.data;
        console.log("_res", _res);
        let _newTemp = [
          {
            hodApprovalRemarkAfterParawise:
              res?.data?.hodApprovalRemarkAfterParawise,
            hodApprovalRemarkAfterParawiseMr:
              res?.data?.hodApprovalRemarkAfterParawiseMr,
            noticeNo: res?.data?.noticeNo,
          },
        ]?.map((dat, i) => {
          console.log("datCheckForNoticeID", dat);
          return {
            ...dat,
            srNo: i + 1,

            approveTime: moment(res?.data?.approveTimeHod).format("DD-MM-YYYY"),
            approveTimeHod: moment(res?.data?.approveTimeHod).format("HH.MM A"),
          };
        });
        console.log("_newTemp", _newTemp);

        // let temp2 = _res
        //   ? JSON?.parse(_res)?.map((r, i) => ({
        //       srNo: i + 1,
        //       id: r.id,
        //       noticeId: r.noticeId,

        //       hodApprovalRemarkAfterParawise: r.hodApprovalRemarkAfterParawise,
        //       hodApprovalRemarkAfterParawiseMr:
        //         r.hodApprovalRemarkAfterParawiseMr,
        //       // hodApprovalRemarkAfterParawise: r.hodApprovalRemarkAfterParawise,
        //       // hodApprovalRemarkAfterParawiseMr:
        //       //   r.hodApprovalRemarkAfterParawiseMr,
        //     }))
        //   : [];

        setDataSource2(_newTemp ?? []);
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
  };

  //   Get Parawise Details

  const getParaDetails = () => {
    axios
      .get(
        `${urls.LCMSURL}/notice/getNoticeById?noticeId=${noticeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        //   notice/getNoticeById?noticeId=${noticeID}`)
      )
      .then((res) => {
        console.log("resDatafsdf", res?.data?.parawiseTrnParawiseReportDaoLst);

        // let temp2 = res.data.parawiseTrnParawiseReportDaoLst?.map((r, i) => ({
        //   srNo: i + 1,
        //   id: r.id,
        //   //   parawiseRemarkEnglish:
        //   //     r?.parawiseRemarkEnglish != null &&
        //   //     r?.parawiseRemarkEnglish != undefined &&
        //   //     r?.parawiseRemarkEnglish != undefined
        //   //       ? JSON.parse(r?.parawiseRemarkEnglish)[0].parawiseRemarkEnglish
        //   //       : "",

        //   parawiseRemarkMarathi: r.parawiseRemarkMarathi,

        //   parawiseRemarkEnglish:
        //     r?.parawiseRemarkEnglish != null &&
        //     r?.parawiseRemarkEnglish != undefined &&
        //     r?.parawiseRemarkEnglish != undefined
        //       ? JSON.parse(r?.parawiseRemarkEnglish)[0].parawiseRemarkEnglish
        //       : "",

        //   parawiseRemarkMarathi:
        //     r?.parawiseRemarkMarathi != null &&
        //     r?.parawiseRemarkMarathi != undefined &&
        //     r?.parawiseRemarkMarathi != undefined
        //       ? JSON.parse(r?.parawiseRemarkMarathi)[0].parawiseRemarkMarathi
        //       : "",

        //   parawiseApprovalRemarkHodEnglish: r.parawiseApprovalRemarkHodEnglish,
        //   parawiseApprovalRemarkHodMarathi: r.parawiseApprovalRemarkHodMarathi,
        //   // createDtTm: moment(r.createDtTm).format("DD-MM-YYYY"),
        //   // vakalatnamaStatus: r.vakalatnamaStatus,
        //   // // createdUserId: r.createdUserId,
        //   // createdUserId: allUsersList?.find(
        //   //   (obj) => obj?.id == r?.createdUserId
        //   // )?.userNameEn,
        //   // createdUserIdMr: allUsersList?.find(
        //   //   (obj) => obj?.id == r?.createdUserId
        //   // )?.userNameMr,
        // }));
        // setDataSource(temp2);

        // let temp2 = res.data.parawiseTrnParawiseReportDaoLst?.map((r, i) => ({
        //   srNo: i + 1,
        //   id: r.id,
        //   parawiseRemarkMarathi: r.parawiseRemarkMarathi,

        //   parawiseRemarkEnglish:
        //     r?.parawiseRemarkEnglish != null &&
        //     r?.parawiseRemarkEnglish != undefined &&
        //     r?.parawiseRemarkEnglish != undefined
        //       ? JSON.parse(r?.parawiseRemarkEnglish)[0].parawiseRemarkEnglish
        //       : "",

        //   parawiseRemarkMarathi:
        //     r?.parawiseRemarkMarathi != null &&
        //     r?.parawiseRemarkMarathi != undefined &&
        //     r?.parawiseRemarkMarathi != undefined
        //       ? JSON.parse(r?.parawiseRemarkMarathi)[0].parawiseRemarkMarathi
        //       : "",

        //   parawiseApprovalRemarkHodEnglish: r.parawiseApprovalRemarkHodEnglish,
        //   parawiseApprovalRemarkHodMarathi: r.parawiseApprovalRemarkHodMarathi,
        // }));
        // --------------------------------------------------------------------------------------
        // const flattenedArray = res?.data?.parawiseTrnParawiseReportDaoLst
        //   ?.flatMap((parentObj) =>
        //     JSON.parse(parentObj?.parawiseRemarkEnglish)?.flatMap((clerk) =>
        //       JSON.parse(parentObj.parawiseApprovalRemarkHodEnglish).map(
        //         (hod) => ({
        //           ...parentObj,
        //           ...clerk,
        //           departmentEn: departments?.find(
        //             (dpt) => dpt?.id == parentObj?.departmentId
        //           )?.department,
        //           departmentMr: departments?.find(
        //             (dpt) => dpt?.id == parentObj?.departmentId
        //           )?.departmentMr,
        //           parawiseRemarkClerkEn: clerk?.parawiseRemarkEnglish,
        //           parawiseRemarkClerkMr: clerk?.parawiseRemarkMarathi,
        //           ...hod,
        //           parawiseRemarkHodEn: hod?.parawiseApprovalRemarkHodEnglish,
        //           parawiseRemarkHodMr: hod?.parawiseApprovalRemarkHodMarathi,
        //         })
        //       )
        //     )
        //   )
        //   ?.map((d, i) => {
        //     return {
        //       srNo: i + 1,
        //       ...d,
        //     };
        //   });
        // --------------------------------------------------------------------------------------
        const flattenedArray =
          res?.data?.parawiseTrnParawiseReportDaoLst?.flatMap((parentObj) => {
            let clerkArray = parentObj?.parawiseRemarkEnglish
              ? JSON.parse(parentObj?.parawiseRemarkEnglish)
              : [];
            let hodArray = parentObj?.parawiseApprovalRemarkHodEnglish
              ? JSON.parse(parentObj?.parawiseApprovalRemarkHodEnglish)
              : [];

            if (clerkArray?.length > 0 || hodArray?.length > 0) {
              return clerkArray.flatMap((clerk) =>
                hodArray.map((hod) => ({
                  ...parentObj,
                  ...clerk,
                  departmentEn: departments?.find(
                    (dpt) => dpt?.id == parentObj?.departmentId
                  )?.department,
                  departmentMr: departments?.find(
                    (dpt) => dpt?.id == parentObj?.departmentId
                  )?.departmentMr,
                  parawiseRemarkClerkEn: clerk?.parawiseRemarkEnglish,
                  parawiseRemarkClerkMr: clerk?.parawiseRemarkMarathi,
                  ...hod,
                  parawiseRemarkHodEn: hod?.parawiseApprovalRemarkHodEnglish,
                  parawiseRemarkHodMr: hod?.parawiseApprovalRemarkHodMarathi,
                }))
              );
            } else [];
          });
        // console.log(
        //   "flattenedArray",
        //   userDepartment,
        //   flattenedArray?.length > 0
        //     ? (userDepartment == 3
        //         ? flattenedArray
        //         : flattenedArray?.filter(
        //             (d) => d?.departmentId == userDepartment
        //           )
        //       )?.map((d, i) => ({
        //         srNo: i + 1,
        //         ...d,
        //       }))
        //     : []
        // );
        setDataSource(
          flattenedArray?.length > 0
            ? (userDepartment == 3
                ? flattenedArray
                : flattenedArray?.filter(
                    (d) => d?.departmentId == userDepartment
                  )
              )?.map((d, i) => ({
                srNo: i + 1,
                ...d,
              }))
            : []
        );
      });
    // --------------------------------------------------------------------------------------
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
  };

  //   getResponseToNotice

  const getResponseToNotice = () => {
    axios
      .get(
        `${urls.LCMSURL}/notice/getNoticeById?noticeId=${noticeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        //   notice/getNoticeById?noticeId=${noticeID}`)
      )
      .then((res) => {
        console.log("__res456888", res.data.clerkApprovalRemarkAfterParawise);
        let _res = res?.data?.clerkApprovalRemarkAfterParawise;

        let temp2 = _res
          ? JSON?.parse(_res)?.map((r, i) => ({
              srNo: i + 1,
              id: r.id,

              // clerkApprovalRemarkAfterParawise:
              //   res.data.clerkApprovalRemarkAfterParawise != null &&
              //   res.data.clerkApprovalRemarkAfterParawise != undefined &&
              //   res.data.clerkApprovalRemarkAfterParawise != ""
              //     ? JSON.parse(res.data.clerkApprovalRemarkAfterParawise)[0]
              //         .parawiseRemarkEnglish
              //     : "",

              clerkApprovalRemarkAfterParawise:
                res.data.clerkApprovalRemarkAfterParawise != null &&
                res.data.clerkApprovalRemarkAfterParawise != undefined &&
                res.data.clerkApprovalRemarkAfterParawise != ""
                  ? JSON.parse(res.data.clerkApprovalRemarkAfterParawise)[i]
                      .parawiseLegalClerkRemarkEnglish
                  : "",

              parawiseRemarkMarathi:
                res.data.clerkApprovalRemarkAfterParawise != null &&
                res.data.clerkApprovalRemarkAfterParawise != undefined &&
                res.data.clerkApprovalRemarkAfterParawise != ""
                  ? JSON.parse(res.data.clerkApprovalRemarkAfterParawise)[i]
                      .parawiseLegalClerkRemarkMarathi
                  : "",

              // parawiseRemarkMarathi:
              //   res.data.clerkApprovalRemarkAfterParawise != null &&
              //   res.data.clerkApprovalRemarkAfterParawise != undefined &&
              //   res.data.clerkApprovalRemarkAfterParawise != ""
              //     ? JSON.parse(res.data.clerkApprovalRemarkAfterParawise)[0]
              //         .parawiseRemarkMarathi
              //     : "",
              // hodApprovalRemarkAfterParawise: r.hodApprovalRemarkAfterParawise,
              // hodApprovalRemarkAfterParawiseMr:
              //   r.hodApprovalRemarkAfterParawiseMr,
              noticeId: r.noticeId,
              approveDate: moment(res?.data?.approveDate).format("DD-MM-YYYY"),
              approveTime: moment(res?.data?.approveTime).format("HH:mm A"),
              // approveTime: moment(res?.data?.approveTime, "HH:mm:ss").format(
              //   "hh:mm A"
              // ),

              //   clerkApprovalRemarkAfterParawise:
              //     r?.clerkApprovalRemarkAfterParawise
              //       ? JSON?.parse(r?.clerkApprovalRemarkAfterParawise)
              //       : [],

              //   parawiseRemarkEnglish:
              //     r?.parawiseRemarkEnglish != null &&
              //     r?.parawiseRemarkEnglish != undefined &&
              //     r?.parawiseRemarkEnglish != undefined
              //       ? JSON.parse(r?.parawiseRemarkEnglish)[0].parawiseRemarkEnglish
              //       : "",

              //   parawiseRemarkMarathi:
              //     r?.parawiseRemarkMarathi != null &&
              //     r?.parawiseRemarkMarathi != undefined &&
              //     r?.parawiseRemarkMarathi != undefined
              //       ? JSON.parse(r?.parawiseRemarkMarathi)[0].parawiseRemarkMarathi
              //       : "",

              //   parawiseApprovalRemarkHodEnglish: r.parawiseApprovalRemarkHodEnglish,
              //   parawiseApprovalRemarkHodMarathi: r.parawiseApprovalRemarkHodMarathi,
            }))
          : [];

        setDataSource1(temp2);
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
  };

  // get Documents
  const getDocuments = () => {
    axios
      .get(
        `${urls.LCMSURL}/notice/getNoticeById?noticeId=${noticeID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        //   notice/getNoticeById?noticeId=${noticeID}`)
      )
      .then((res) => {
        console.log("resDatafsdf", res?.data?.noticeAttachment);
        let temp2 = res?.data?.noticeAttachment?.map((r, i) => ({
          srNo: i + 1,
          id: r.id,
          noticeId: r.noticeId,
          filePath: r.filePath,
          // createDtTm: moment(r.createDtTm).format("DD-MM-YYYY"),
          attachedNameEn: r.attachedNameEn,
          attachedNameMr: r.attachedNameMr,
        }));
        setDataSource3(temp2);
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
  };

  // paracolumn
  const paracolumn = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,

      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentEn" : "departmentMr",
      // headerName: "Department Name",
      headerName: <FormattedLabel id="deptName" />,
      width: 150,

      align: "center",
      headerAlign: "center",
    },

    // {
    //   field: "id",
    //   // headerName: <FormattedLabel id="user" />,
    //   headerName: <FormattedLabel id="parawiseRequestNo" />,
    //   width: 300,
    //   align: "center",
    //   headerAlign: "center",
    // },

    // Remark
    {
      field:
        // language === "en" ? "parawiseRemarkEnglish" : "parawiseRemarkMarathi",
        language === "en" ? "parawiseRemarkClerkEn" : "parawiseRemarkClerkMr",
      headerName:
        language === "en"
          ? "Concern Department Clerk Remark"
          : "संबंधित विभाग लिपिक टिप्पणी",
      width: 500,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field:
        // language === "en"
        //   ? "parawiseApprovalRemarkHodEnglish"
        //   : "parawiseApprovalRemarkHodMarathi",
        language === "en" ? "parawiseRemarkHodEn" : "parawiseRemarkHodMr",
      headerName:
        language === "en"
          ? "Concern Department Hod Remark"
          : "संबंधित विभाग एचओडी टिप्पणी",
      // headerName: "Remark",
      // type: "number",
      width: 500,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },

    // View Documents
    // {
    //   field: "Docs",
    //   headerName: <FormattedLabel id="viewDocuments" />,
    //   width: 200,

    //   renderCell: (params) => {
    //     const rowData = params?.row;
    //     console.log("params", params);
    //     return (

    //       <Button
    //         size="small"
    //         variant="contained"
    //         // onClick={() => parawiseDocumentsForConcDpt(params?.row)}
    //       >
    //         {/* View */}
    //         <FormattedLabel id="view" />
    //       </Button>
    //       // )
    //     );
    //   },
    // },
  ];

  //   responseToNotice(Legal clerk Remark)
  const responseToNotice = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,

      align: "center",
      headerAlign: "center",
    },

    {
      field: "noticeId",
      // headerName: <FormattedLabel id="user" />,
      headerName: <FormattedLabel id="noticeid" />,
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    // Approved Date

    {
      field: "approveDate",
      // headerName: <FormattedLabel id="user" />,
      headerName: <FormattedLabel id="approvedDate" />,
      width: 300,
      align: "center",
      headerAlign: "center",
    },
    // approveTime
    {
      field: "approveTime",
      // headerName: <FormattedLabel id="user" />,
      headerName: <FormattedLabel id="approvedTime" />,
      width: 300,
      align: "center",
      headerAlign: "center",
    },

    // Remark
    {
      field:
        language === "en"
          ? "clerkApprovalRemarkAfterParawise"
          : "parawiseRemarkMarathi",
      headerName:
        language === "en" ? "Department Clerk Remark" : "विभाग लिपिक टिप्पणी",
      // headerName: "Remark",
      // type: "number",
      width: 800,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },

    // View Documents
    // {
    //   field: "Docs",
    //   headerName: <FormattedLabel id="viewDocuments" />,
    //   width: 200,

    //   renderCell: (params) => {
    //     const rowData = params?.row;
    //     console.log("params", params);
    //     return (

    //       <Button
    //         size="small"
    //         variant="contained"
    //         // onClick={() => parawiseDocumentsForConcDpt(params?.row)}
    //       >
    //         {/* View */}
    //         <FormattedLabel id="view" />
    //       </Button>
    //       // )
    //     );
    //   },
    // },
  ];
  // Response to Notice Legal HOD Remark
  const responseToNoticeLegalHOD = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   field: "noticeNo",
    //   // headerName: <FormattedLabel id="user" />,
    //   headerName: <FormattedLabel id="parawiseRequestNo" />,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },\
    // approveTime
    {
      field: "approveTime",
      // headerName: <FormattedLabel id="user" />,
      headerName: <FormattedLabel id="approvedDate" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // approveTimeHod
    {
      field: "approveTimeHod",
      // headerName: <FormattedLabel id="user" />,
      headerName: <FormattedLabel id="approvedTime" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    // Remark

    {
      field:
        language === "en"
          ? "hodApprovalRemarkAfterParawise"
          : "hodApprovalRemarkAfterParawiseMr",
      headerName:
        language === "en" ? "Department Hod Remark" : "विभाग एचओडी टिप्पणी",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer", textDecoration: "none" }}
          onClick={() => {
            handleOpenRemarks(params);
          }}
        >
          {params.value}
        </div>
      ),
    },
  ];

  // get Documents
  const documents = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,

      align: "center",
      headerAlign: "center",
    },

    {
      field: "noticeId",
      headerName: <FormattedLabel id="noticeid" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      headerAlign: "center",
      align: "center",
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (record) => {
        return (
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
        );
      },
    },
  ];
  // get stauswise notice for Digital Draft
  const digitalDraftCol = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "id",
      headerName: <FormattedLabel id="noticeid" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        console.log("statusCheck", params);
        return params?.row?.status === "PARAWISE_REPORT_APPROVED" ? (
          <IconButton
            color="primary"
            onClick={() => {
              // dispatch(setSelectedNotice(params.row));
              router.push({
                pathname: "/LegalCase/transaction/newNotice/digitalSignature",
                query: {
                  // pageMode: "Final",
                  ...params?.row,
                },
              });
            }}
          >
            <Visibility />
          </IconButton>
        ) : (
          "Digital Signature Pending"
        );
      },
    },
  ];

  // Handle Next
  const handleNext = (data) => {
    setLoadderState(true);
    console.log("activeStep", JSON.parse(localStorage.getItem("rowsData")));

    if (activeStep == steps.length - 1) {
      let formattedRequisitionDate = moment(watch("requisitionDate")).format(
        "YYYY-MM-DD"
      );
      const finalBodyForApi = {
        pageMode: localStorage.getItem("pageMode"),
        noticeID: localStorage.getItem("noticeID"),
        id: localStorage.getItem("noticeID"),
        concernDeptUserList: JSON.parse(localStorage.getItem("rowsData")),
        noticeAttachment: JSON.parse(localStorage.getItem("noticeAttachment")),
        advocateAddress: watch("advocateAddress"),
        advocateAddressMr: watch("advocateAddressMr"),
        departmentName: watch("departmentName"),
        inwardNo: watch("inwardNo"),
        departmentName: userDepartment,
        noticeDate: watch("noticeDate"),
        noticeDetails: watch("noticeDetails"),
        noticeDetailsMr: watch("noticeDetailsMr"),
        noticeRecivedDate: watch("noticeRecivedDate"),
        noticeRecivedFromAdvocatePerson: watch(
          "noticeRecivedFromAdvocatePerson"
        ),
        noticeRecivedFromAdvocatePersonMr: watch(
          "noticeRecivedFromAdvocatePersonMr"
        ),
        // requisitionDate: watch("requisitionDate"),
        requisitionDate: formattedRequisitionDate,

        serialNo: watch("serialNo"),
      };

      // console.log("finalBodyForApi", finalBodyForApi);
      axios
        .post(`${urls.LCMSURL}/notice/saveTrnNotice`, finalBodyForApi, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201 || res.status == 200 || res.status) {
            localStorage.removeItem("noticeAttachment");
            localStorage.removeItem("rowsData");
            localStorage.removeItem("pageMode");
            localStorage.removeItem("noticeID");
            setLoadderState(false);
            sweetAlert(
              // "Saved!",
              language == "en" ? "Saved" : "जतन केले",
              language == "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              // language == "en" ? "Saved" : "जतन केले",
              // //  "Record Saved successfully !",
              // language === "en"
              //   ? "Record Saved successfully !"
              //   : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            router.push(`/LegalCase/transaction/newNotice/`);
          } else {
            setLoadderState(false);
            //
          }
        });
      // ?.catch((err) => {
      //   console.log("err", err);
      //   callCatchMethod(err, language);
      // });
    } else {
      setLoadderState(false);
      setActiveStep(activeStep + 1);
    }
    setLoadderState(false);
  };

  useEffect(() => {
    getDepartments();
    console.log("userDepartment", userDepartment);
    if (
      JSON.parse(localStorage.getItem("noticeID")) != null ||
      JSON.parse(localStorage.getItem("noticeID")) != undefined
    ) {
      setNoticeID(JSON.parse(localStorage.getItem("noticeID")));
    }
  }, []);

  // useEffect(() => {
  //   console.log("activeStep", activeStep);
  //   if (activeStep == "0") {
  //     setDataValidation(Schema);
  //   } else if (activeStep == "1") {
  //     setDataValidation(Schema1);
  //   }

  // }, [activeStep]);

  useEffect(() => {
    if (noticeID) {
      getByNoticeID();
      // getParaDetails();
      getResponseToNotice();
      getResponseToNoticeLegalHOD();
      getDocuments();
    }
  }, [noticeID]);

  // useEffect(() => {
  //   getNoticeNumber();
  //   getOfficeLocation();
  // }, []);

  // useEffect(() => {}, [temp]);
  useEffect(() => {
    // console.log("pageMode1145", noticePageMode);
    if (noticeID && departments?.length > 0) {
      getParaDetails();
    }
  }, [noticeID, departments]);

  //
  useEffect(() => {
    if (
      watch("noticeAttachment") != null ||
      watch("noticeAttachment") != undefined
    ) {
      let attachments = watch("noticeAttachment");
      console.log("attachments", attachments);
      let newAttachments = attachments.map((data, index) => {
        return {
          srNo: index + 1,
          id: data?.id,
          activeFlag: data?.activeFlag,
          filePath: data?.filePath,
          extension: data?.extension,
          noticeId: data?.noticeId,
          originalFileName: data?.originalFileName,
          attachedNameMr: data?.attachedNameMr,
          attachedNameEn: data?.attachedNameEn,
          attachedDate: data?.attachedDate,
          attacheDesignation: data?.attacheDesignation,
          attacheDepartment: data?.attacheDepartment,
        };
        console.log("data3432", data?.filePath);
      });
      console.log("noticeAttachment", newAttachments);
      localStorage.setItem("noticeAttachment", JSON.stringify(newAttachments));
    }
  }, [watch("noticeAttachment")]);

  // useEffect(() => {
  //   if (watch("rowsData") != null || watch("rowsData") != undefined) {
  //     console.log("noticeEdlf", watch("rowsData"));
  //     let tempConcernDeptUserList = watch("rowsData");
  //     console.log("tempConcernDeptUserList", tempConcernDeptUserList);
  //     let concernDeptUserList = tempConcernDeptUserList.map((data, index) => {
  //       return {
  //         srNo: index + 1,
  //         id: data?.id,
  //         activeFlag: data?.activeFlag,
  //         departmentId: data?.departmentId,
  //         empoyeeId: data?.empoyeeId,
  //         id: data?.id,
  //         notice: data?.notice,
  //         locationId: data?.locationId,
  //       };
  //     });
  //     localStorage.setItem("rowsData", JSON.stringify(concernDeptUserList));
  //   }
  //   // console.log("concernDeptUserList", watch("rowsData"));
  // }, [watch("rowsData")]);

  // useEffect(()=>{
  // console.log("dataValidation",dataValidation)
  // },[dataValidation])

  // View
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Box
            sx={{
              marginLeft: "1vw",
            }}
          ></Box>
          {loadderState ? (
            // <Loader />
            <Loader />
          ) : (
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
            <div>
              <div>
                <BreadcrumbComponent />
              </div>
              {/** Provide Custmize theme using themeProvider */}
              <ThemeProvider theme={theme}>
                {loadderState ? (
                  <Loader />
                ) : (
                  <Paper
                    sx={{
                      // marginLeft: 5,
                      // marginRight: 5,
                      // marginTop: 5,
                      // marginBottom: 5,
                      padding: 1,
                    }}
                    elevation={5}
                  >
                    {/** Main Heading */}
                    {/* <marquee> */}
                    {/* <Typography
                    variant="h5"
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      marginTop: "5px",
                    }}
                  >
                    <strong>{<FormattedLabel id="notice" />}</strong>
                  </Typography> */}
                    {/* </marquee> */}
                    {/* <br /> <br /> */}
                    <br />

                    <Grid
                      container
                      // style={{
                      //   background:
                      //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                      // }}

                      style={{
                        // backgroundColor: "#0084ff",
                        backgroundColor: "#556CD6",
                        // backgroundColor: "#1C39BB",
                        height: "8vh",

                        // #00308F
                        // color: "white",

                        fontSize: 19,
                        // marginTop: 30,
                        // marginBottom: "50px",
                        // marginTop: ,
                        // padding: 8,
                        // paddingLeft: 30,
                        // marginLeft: "50px",
                        marginRight: "75px",
                        borderRadius: 100,
                      }}
                    >
                      {/* <IconButton> */}
                      <IconButton
                        style={{
                          marginBottom: "2vh",
                          color: "white",
                        }}
                      >
                        <ArrowBackIcon
                          onClick={() => {
                            router.back();
                          }}
                        />
                      </IconButton>

                      <Grid item xs={11}>
                        <h2
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            // background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                          }}
                        >
                          {" "}
                          <FormattedLabel id="notice" />
                        </h2>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      sx={{
                        marginTop: "20px",
                      }}
                    >
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {/** Steeper icons */}
                        <Stack sx={{ width: "100%" }} spacing={4}>
                          <Stepper
                            alternativeLabel
                            activeStep={activeStep}
                            connector={<ColorlibConnector />}
                          >
                            {steps.map((label) => {
                              const labelProps = {};
                              const stepProps = {};

                              return (
                                <Step key={label} {...stepProps}>
                                  <StepLabel
                                    {...labelProps}
                                    StepIconComponent={ColorlibStepIcon}
                                  >
                                    {label}
                                  </StepLabel>
                                </Step>
                              );
                            })}
                          </Stepper>
                        </Stack>
                      </Grid>
                    </Grid>
                    {/** Main Form */}
                    <FormProvider {...methods}>
                      <form
                        onSubmit={methods.handleSubmit(handleNext)}
                        sx={{ marginTop: 10 }}
                      >
                        {getStepContent(activeStep)}

                        {/** Button */}
                        {/* <Stack
                        direction="row"
                        spacing={5}
                        sx={{ paddingLeft: "30px", marginTop: "10vh", align: "center" }}
                      > */}

                        {/** Back Button */}

                        <Grid
                          container
                          style={{
                            marginLeft: "1vw",
                          }}
                        >
                          <Grid item xs={2} xl={2} lg={2} md={2}>
                            <Button
                              disabled={activeStep === 0}
                              // disabled
                              onClick={handleBack}
                              variant="contained"
                            >
                              {<FormattedLabel id="back" />}
                            </Button>
                          </Grid>

                          <Grid
                            style={{
                              // backgroundColor: "red",
                              marginLeft: "5vw",
                            }}
                            item
                            xs={6}
                            xl={6}
                            lg={6}
                          ></Grid>
                          <Grid item xs={1.5} xl={2} lg={1.7}>
                            {/** SaveAndNext Button */}
                            {activeStep != steps.length - 1 && (
                              <Button
                                variant="contained"
                                type="submit"
                                sx={{
                                  width: "100%",
                                }}
                              >
                                {router?.query?.pageMode === "_VIEW" ? (
                                  <FormattedLabel id="next" />
                                ) : (
                                  <FormattedLabel id="saveAndNext" />
                                )}
                              </Button>
                            )}

                            {activeStep == steps.length - 1 && (
                              <>
                                {localStorage.getItem("pageMode") ==
                                  "Draft" && (
                                  <>
                                    <Button
                                      variant="contained"
                                      onClick={() => {
                                        pageModeM = "NOTICE_DRAFT";
                                        // setNoticePageMode("NOTICE_DRAFT");
                                        handleNext("NOTICE_DRAFT");
                                      }}
                                    >
                                      <FormattedLabel id="finish" />
                                    </Button>
                                  </>
                                )}

                                {localStorage.getItem("pageMode") ==
                                  "NOTICE_CREATE" &&
                                  router?.query?.pageMode !== "_VIEW" && (
                                    <>
                                      <Button
                                        variant="contained"
                                        onClick={() => {
                                          handleNext();
                                        }}
                                      >
                                        <FormattedLabel id="finish" />
                                      </Button>
                                    </>
                                  )}
                              </>
                            )}
                          </Grid>

                          <Grid item xs={1} xl={1} lg={1.2} md={1}>
                            {/** Exit Button */}
                            <Button
                              variant="contained"
                              sx={{
                                marginLeft: "3vw",
                              }}
                              onClick={() => {
                                localStorage.removeItem("noticeAttachment");
                                localStorage.removeItem("rowsData");
                                localStorage.removeItem("pageMode");
                                localStorage.removeItem("noticeID");
                                router.push(
                                  `/LegalCase/transaction/newNotice/`
                                );
                              }}
                            >
                              <FormattedLabel id="exit" />
                            </Button>
                          </Grid>
                        </Grid>

                        {/* </Stack> */}
                      </form>
                    </FormProvider>
                  </Paper>

                  //
                )}
              </ThemeProvider>
            </div>
          )}

          {/* Paper For Notice Details */}
          <Paper
            sx={{
              marginLeft: 1,
              //   marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
              paddingTop: 3,
              paddingBottom: 5,
            }}
          >
            <Modal
              open={remarksOpen}
              onClose={() => {
                setRemarksOpen(false);
              }}
            >
              <Box sx={style}>
                <Typography
                  align="center"
                  sx={{
                    // fontWeight: "bolder",
                    // fontSize: "large",
                    // padding: 2,
                    // border: "0.5px solid gray",
                    textTransform: "capitalize",
                  }}
                >
                  {displayRemarks?.value}
                </Typography>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    sx={{ marginTop: "2vw" }}
                    onClick={() => {
                      setRemarksOpen(false);
                    }}
                  >
                    <FormattedLabel id="close" />
                  </Button>
                </div>
              </Box>
            </Modal>

            {/* Table for Parawise Details  */}

            <Grid container>
              <Grid item lg={12}>
                <Accordion elevation={0}>
                  {/* title */}
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                      // marginTop:"2px"
                      marginLeft: "12px",
                      // boxShadow:10
                    }}
                    elevation={10}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      {/* Parawise Details */}

                      <FormattedLabel id="parawiseDetails" />
                    </Typography>
                  </AccordionSummary>

                  {/*  */}

                  <AccordionDetails>
                    <Grid container>
                      <Grid item lg={12} xs={12}>
                        <DataGrid
                          disableColumnFilter
                          disableColumnSelector
                          disableDensitySelector
                          components={{ Toolbar: GridToolbar }}
                          autoHeight
                          rows={dataSource}
                          columns={paracolumn}
                          getRowId={(row) => row.srNo}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          //checkboxSelection
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>

            {/* Table for Response to Notice */}
            <Grid container>
              <Grid item lg={12}>
                <Accordion elevation={0}>
                  {/* title */}
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                      // marginTop:"2px"
                      marginLeft: "12px",
                      // boxShadow:10
                    }}
                    elevation={10}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <FormattedLabel id="legalClerkRemark" />
                      {/* Response to Notice Details(Legal Clerk Remark) */}
                      {/* Legal Clerk Remarks */}

                      {/* <FormattedLabel id="responseDetailsLegalClerk" /> */}
                      {/* <FormattedLabel id="ResponsetoNoticeDetailsLegalClerkHead" /> */}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Grid container>
                      <Grid item lg={12} xs={12}>
                        <DataGrid
                          disableColumnFilter
                          disableColumnSelector
                          disableDensitySelector
                          components={{ Toolbar: GridToolbar }}
                          autoHeight
                          rows={dataSource1}
                          columns={responseToNotice}
                          getRowId={(row) => row.srNo}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          //checkboxSelection
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>

            {/* Table For Respons eto Notice Leagl HOD Approval */}
            <Grid container>
              <Grid item lg={12}>
                <Accordion elevation={0}>
                  {/* title */}
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                      // marginTop:"2px"
                      marginLeft: "12px",
                      // boxShadow:10
                    }}
                    elevation={10}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <FormattedLabel id="legalHODRemarks" />
                      {/* Response to Notice Details(Legal HOD Remark) */}
                      {/* <FormattedLabel id="ResponsetoNoticeDetailsLegalHODHead" /> */}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Grid container>
                      <Grid item lg={12} xs={12}>
                        <DataGrid
                          disableColumnFilter
                          disableColumnSelector
                          disableDensitySelector
                          components={{ Toolbar: GridToolbar }}
                          autoHeight
                          rows={dataSource2}
                          columns={responseToNoticeLegalHOD}
                          getRowId={(row) => row.srNo}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          //checkboxSelection
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>

            {/* Table For Documents */}
            <Grid container>
              <Grid item lg={12}>
                <Accordion elevation={0}>
                  {/* title */}
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                      // marginTop:"2px"
                      marginLeft: "12px",
                      // boxShadow:10
                    }}
                    elevation={10}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      {/* Documents Details */}
                      <FormattedLabel id="documentDetails" />
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Grid container>
                      <Grid item lg={12} xs={12}>
                        <DataGrid
                          disableColumnFilter
                          disableColumnSelector
                          disableDensitySelector
                          components={{ Toolbar: GridToolbar }}
                          autoHeight
                          rows={dataSource3}
                          columns={documents}
                          getRowId={(row) => row.srNo}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          //checkboxSelection
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>

            {/* Table For Digital Draft */}
            <Grid container>
              <Grid item lg={12}>
                <Accordion elevation={0}>
                  {/* title */}
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      textTransform: "uppercase",
                      border: "1px solid white",
                      // marginTop:"2px"
                      marginLeft: "12px",
                      // boxShadow:10
                    }}
                    elevation={10}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      {/* Digital Draft */}
                      <FormattedLabel id="digitalDraft" />
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Grid container>
                      <Grid item lg={12} xs={12}>
                        <DataGrid
                          disableColumnFilter
                          disableColumnSelector
                          disableDensitySelector
                          components={{ Toolbar: GridToolbar }}
                          autoHeight
                          rows={dataSource4}
                          columns={digitalDraftCol}
                          getRowId={(row) => row.srNo}
                          pageSize={5}
                          rowsPerPageOptions={[5]}
                          //checkboxSelection
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </>
  );
};

export default LinaerStepper;
