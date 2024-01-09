import {
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
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import FileTable from "../../FileUpload/FileTableLcWithoutAddButton";
import {
  LowPriority,
  RemoveRoadTwoTone,
  TenMp,
  Visibility,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { toast, ToastContainer } from "react-toastify";
import UndoIcon from "@mui/icons-material/Undo";
import sweetAlert from "sweetalert";
import DeleteIcon from "@mui/icons-material/Delete";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import { catchExceptionHandlingMethod } from "../../../../util/util";

import { saveAs } from "file-saver";

import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ResponseToNoticeApproval = () => {
  const methods = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      parawiseTrnParawiseReportDaoLst: [
        {
          issueNo: "",
          paragraphWiseAanswerDraftOfIssues: "",
          paragraphWiseAanswerDraftOfIssuesMarathi: "",
        },
      ],
    },
  });

  const {
    getValues,
    setValue,
    control,
    register,
    reset,
    watch,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = methods;
  const [noticeId, setNoticeId] = React.useState(null);
  const router = useRouter();

  const [requisitionDate, setRequisitionDate] = React.useState(null);
  let pageType = false;
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [mode, setMode] = useState();
  const token = useSelector((state) => state.user.user.token);
  const [employeeList, setEmployeeList] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [authority, setAuthority] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [audienceSample, setAudienceSample] = useState(selectedNotice);
  const [noticeData, setNoticeData] = useState();
  const language = useSelector((state) => state.labels.language);
  // noticeData
  const [concerDeptList, setConcernDeptList] = useState([]);
  const [noticeHistoryList, setNoticeHistoryList] = useState([]);
  const [approveRejectRemarkMode, setApproveRejectRemarkMode] = useState("");
  const handleOpen = (approveRejectRemarkMode) => {
    setOpen(true);
    setApproveRejectRemarkMode(approveRejectRemarkMode);
  };
  const [applicableDepartments, setApplicableDepartments] = useState([]);
  const [tempDepartment, setTempDepartment] = useState([]);
  const [tempDepartment1, setTempDepartment1] = useState([]);
  const uniqueDepartments = [
    ...new Set(tempDepartment1.map((dept) => dept.department)),
  ];

  // For Reassign

  const handleClose = () => setOpen(false);
  const [parawiseReportList, setParawiseReportList] = useState([]);
  const [open, setOpen] = useState(false);

  const selectedNotice = useSelector((state) => {
    console.log("selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });

  const [parawiseReportId, setParawiseReportId] = useState();
  const [parawiseReport, setParawiseReport] = useState();

  let user = useSelector((state) => state.user.user);

  //key={field.id}

  //view----------------------------------------------------------------
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

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "parawiseReportDao", // unique name for your Field Array
    }
  );

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
  const onFinish = () => {};
  // userName
  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getUserBasicDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("UserName", r);
        if (r.status == 200) {
          console.log("setEmployeeList", r?.data?.userList);
          setEmployeeList(r?.data?.userList);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };
  //

  // departments
  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let ds = res.data.department.map((r, i) => ({
          id: r.id,
          department: r.department,
        }));

        console.log("ds", ds);
        setDepartments(ds);
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // authority
  const getAuthority = () => {
    axios
      .get(`${urls.CFCURL}/master/employee/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Authority yetayt ka re: ", res.data);
        setAuthority(
          res.data.map((r, i) => ({
            id: r.id,
            firstName: r.firstName,
            middleName: r.middleName,
            lastName: r.lastName,
            department: r.department,
            departmentName: departments?.find((obj) => obj?.id === r.department)
              ?.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // ParawiseReport
  const getParawiseReport = (noticeIdPassed) => {
    let url = `${urls.LCMSURL}/parawiseReport/getByNoticeIdAndDeptId?noticeId=${noticeIdPassed}&deptId=${user?.userDao?.department}`;

    console.log("url", url);
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("res parawiseReport", r);
        if (r.status == 200) {
          console.log("res office location", r);
          setParawiseReport(r.data);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Location
  const getOfficeLocation = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          console.log("res office location", r);
          setOfficeLocationList(r.data.officeLocation);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (data) => {
    let bodyForApiApproveTrnNoticeAfterParawiseByHod;

    // let bodyForApiApproveParawiseReport;
    if (approveRejectRemarkMode == "Reassign") {
      bodyForApiApproveTrnNoticeAfterParawiseByHod = {
        id: noticeId,
        reassignRmarkLegalHod: data?.remark,
        reassignRmarkLegalHodMr: data?.remarkMr,
      };

      //

      axios
        .post(
          `${urls.LCMSURL}/notice/reassignByHodClerk`,
          bodyForApiApproveTrnNoticeAfterParawiseByHod,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 201 || r.status == 200) {
            sweetAlert(
              // "Saved!",
              language === "en" ? "Saved!" : "जतन केले!",
              // "Record Saved successfully !",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            router.push(`/LegalCase/transaction/newNotice`);
          } else {
            console.log("Login Failed ! Please Try Again !");
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } else if (approveRejectRemarkMode == "Approve") {
      bodyForApiApproveTrnNoticeAfterParawiseByHod = {
        id: noticeId,
        hodApprovalRemarkAfterParawise: data?.remark,
        hodApprovalRemarkAfterParawiseMr: data?.remarkMr,
        sendToDepartmentId: watch("sendToDepartmentId"),
      };

      axios
        .post(
          `${urls.LCMSURL}/notice/approveTrnNoticeAfterParawiseByHod`,
          bodyForApiApproveTrnNoticeAfterParawiseByHod,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          if (r.status == 201 || r.status == 200) {
            sweetAlert(
              // "Saved!",
              language === "en" ? "Saved!" : "जतन केले!",
              // "Record Saved successfully !",
              language === "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            router.push(`/LegalCase/transaction/newNotice`);
          } else {
            console.log("Login Failed ! Please Try Again !");
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } else {
      bodyForApiApproveTrnNoticeAfterParawiseByHod = {
        id: noticeId,
        hodApprovalRemarkAfterParawise: data?.remark,
        hodApprovalRemarkAfterParawiseMr: data?.remarkMr,
      };
    }

    // const bodyForApiApproveTrnNoticeAfterParawiseByHod = {
    //   id: noticeId,
    //   hodApprovalRemarkAfterParawise: "SagarTest",
    //   hodApprovalRemarkAfterParawiseMr: "",
    // };

    console.log(
      "bodyForApiApproveTrnNoticeAfterParawiseByHod",
      bodyForApiApproveTrnNoticeAfterParawiseByHod
    );

    // axios
    //   .post(
    //     `${urls.LCMSURL}/notice/approveTrnNoticeAfterParawiseByHod`,
    //     bodyForApiApproveTrnNoticeAfterParawiseByHod,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   )
    //   .then((r) => {
    //     if (r.status == 201 || r.status == 200) {
    //       sweetAlert(
    //         // "Saved!",
    //         language === "en" ? "Saved!" : "जतन केले!",
    //         // "Record Saved successfully !",
    //         language === "en"
    //           ? "Record Saved successfully !"
    //           : "रेकॉर्ड यशस्वीरित्या जतन केले!",
    //         "success"
    //       );
    //       router.push(`/LegalCase/transaction/newNotice`);
    //     } else {
    //       console.log("Login Failed ! Please Try Again !");
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("errror4545", err);
    //     toast("Failed ! Please Try Again !", {
    //       type: "error",
    //     });
    //   });
  };

  // For remarkApi Translate
  // --------------------------Transaltion API--------------------------------
  const remarkApi = (currentFieldInput, updateFieldName, languagetype) => {
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
  // -------------------------------------------------------------------------
  // getNoticeHistory
  // const getNoticeHistory = () => {
  //   axios
  //     .get(
  //       `${urls.LCMSURL}/transaction/noticeHistory/getHistoryByNoticeId?noticeId=${noticeId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )
  //     .then((r) => {
  //       console.log("datachech", r.data);
  //       if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
  //         setNoticeHistoryList(r?.data);

  //         // setPaymentCollectionReciptData(r?.data);
  //       } else {
  //       }
  //     })
  //     ?.catch((err) => {
  //       console.log("err", err);
  //       callCatchMethod(err, language);
  //     });
  // };

  // Notice Attachments
  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "srNo",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    },
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="fileType" />,
      field: "extension",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: <FormattedLabel id="action" />,
      headerName: <FormattedLabel id="action" />,
      flex: 1,
      align: "center",
      headerAlign: "center",

      renderCell: (record) => {
        return (
          <>
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
          </>
        );
      },
    },
  ];

  // Notice Remark
  const _columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "noticeSentDate",
      headerName: <FormattedLabel id="remarkDate" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field:
        language == "en"
          ? "noticeRecivedFromPersonEng"
          : "noticeRecivedFromPersonMr",
      headerName: <FormattedLabel id="user" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   field: "department",
    //   headerName: <FormattedLabel id="deptName" />,
    //   // type: "number",
    //   width: 150,
    //   align: "center",
    //   headerAlign: "center",
    // },

    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  // concer Dept noticeAttachment
  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "locationNameEn" : "locationNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="subDepartment" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
  ];

  // parawiseRportColumns
  const parawiseRportColums = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "issueNo",
      headerName: <FormattedLabel id="issueNo" />,
      flex: 1,
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssues",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "paragraphWiseAanswerDraftOfIssuesMarathi",
      headerName: <FormattedLabel id="pointsExp" />,
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
  ];

  // Parawise Response
  // const parawiseResponseColumn = [
  //   {
  //     headerName: <FormattedLabel id="srNo" />,
  //     field: "srNo",
  //     width: 100,
  //     align: "center",
  //     headerAlign: "center",
  //     renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
  //   },
  //   {
  //     headerName: "Parawise Remark English",
  //     field: "parawiseRemarkEnglish",
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  //   {
  //     headerName: "Parawise Remark Marathi",
  //     field: "parawiseRemarkMarathi",
  //     flex: 1,
  //     align: "center",
  //     headerAlign: "center",
  //   },
  // ];

  useEffect(() => {
    getDepartments();
    getOfficeLocation();
    getUserName();
    // getAuthority();

    // getNoticeHistory();
  }, []);

  useEffect(() => {
    // set NotifData only if departments is not null and not empty
    if (departments != null && departments.length > 0) {
      console.log("departments", departments);
      setNoticeData(selectedNotice);
    }
  }, [departments]);

  useEffect(() => {
    let clerkApprovalRemarkAfterParawise =
      noticeData?.clerkApprovalRemarkAfterParawise;
    console.log(
      "clerkApprovalRemarkAfterParawise",
      clerkApprovalRemarkAfterParawise
    );

    // check if clerkApprovalRemarkAfterParawise is not null
    if (clerkApprovalRemarkAfterParawise == null) {
      return;
    }

    // convert clerkApprovalRemarkAfterParawise to json array
    let _clerkApprovalRemarkAfterParawise = JSON.parse(
      clerkApprovalRemarkAfterParawise
    );
    console.log(
      "_clerkApprovalRemarkAfterParawise",
      _clerkApprovalRemarkAfterParawise
    );

    // iterate over _clerkApprovalRemarkAfterParawise
    remove();

    _clerkApprovalRemarkAfterParawise?.map((item, i) => {
      console.log("valjsonsagar", item);
      console.log("i", i);
      if (item.issueNo != null && item.issueNo != "") {
        // append to Fields
        append({
          departmentId: item.departmentId,
          // fetch departmentName from department id by refering to departmentList if departmentList is not null else assign "sagar"
          departmentName: departments?.find(
            (dept) => dept.id === item.departmentId
          )?.department,
          issueNo: item.issueNo,
          parawiseRemarkEnglish: item.parawiseRemarkEnglish,
          parawiseRemarkMarathi: item.parawiseRemarkMarathi,
          parawiseLegalClerkRemarkEnglish: item.parawiseLegalClerkRemarkEnglish,
          parawiseLegalClerkRemarkMarathi: item.parawiseLegalClerkRemarkMarathi,
        });
      }

      console.log("fields", fields);
    });
    const tempId = [];
    _clerkApprovalRemarkAfterParawise?.map((data) => {
      tempId.push(data?.departmentId);
    });
    setTempDepartment(tempId);
  }, [noticeData]);

  useEffect(() => {
    console.log("Notice DAta", noticeData);
    setValue("noticeRecivedDate", noticeData?.noticeRecivedDate);
    setValue("noticeDate", noticeData?.noticeDate);
    setValue(
      "noticeDate",
      moment(noticeData?.noticeDate).format("YYYY-MM-DDThh:mm:ss")
    );
    setValue(
      "noticeRecivedFromAdvocatePerson",
      noticeData?.noticeRecivedFromAdvocatePerson
    );
    setValue("requisitionDate", noticeData?.requisitionDate);
    setValue(
      "noticeRecivedFromAdvocatePerson",
      noticeData?.noticeReceivedFromAdvocatePerson
    );
    setValue(
      "noticeRecivedFromAdvocatePersonMr",
      noticeData?.noticeRecivedFromAdvocatePersonMr
    );
    setValue("noticeDetails", noticeData?.noticeDetails);
    setValue("inwardNo", noticeData?.inwardNo);

    // noticeDetailsMr
    setValue("noticeDetailsMr", noticeData?.noticeDetailsMr);

    // notice id
    setNoticeId(noticeData?.id);
    if (noticeId) {
      getParawiseReport(noticeData?.id);
    }

    // concernDept - Details
    let _ress = noticeData?.concernDeptUserList?.map((val, i) => {
      console.log("resd", val);
      return {
        srNo: i + 1,
        id: i,
        departmentNameEn: departments?.find(
          (obj) => obj?.id === val.departmentId
        )?.department,
        departmentNameMr: departments?.find(
          (obj) => obj?.id === val.departmentId
        )?.departmentMr,
        locationNameEn: officeLocationList?.find(
          (obj) => obj?.id === val.locationId
        )?.officeLocationName,
        locationNameMr: officeLocationList?.find(
          (obj) => obj?.id === val.locationId
        )?.officeLocationNameMar,
        departmentId: val?.departmentId,
        locationId: val?.locationId,
      };
    });
    setConcernDeptList(_ress);

    // Notice History
    // let _noticeHisotry = noticeData?.noticeHisotry?.map((file, index) => {
    //   return {
    //     id: index,
    //     srNo: index + 1,
    //     remark: file.remark ? file.remark : "-",
    //     remark: file.remark
    //       ? JSON.parse(file.remark)[0]?.parawiseRemarkEnglish || "-"
    //       : "-",

    //     // remark: file.remark
    //     //   ? JSON.parse(file.remark)[0]?.parawiseRemarkEnglish
    //     //   : "-",

    //     designation: file.designation ? file.designation : "Not Available",
    //     noticeRecivedFromPerson: employeeList.find(
    //       (obj) => obj.id === file.noticeRecivedFromPerson
    //     )?.firstNameEn
    //       ? employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)
    //           ?.firstNameEn
    //       : "Not Available",
    //     department: departments?.find(
    //       (obj) =>
    //         obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
    //     )?.department
    //       ? departments?.find(
    //           (obj) =>
    //             obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
    //         )?.department
    //       : "Not Available",
    //     noticeSentDate: file.noticeSentDate
    //       ? file.noticeSentDate
    //       : "Not Available",
    //   };
    // });

    console.log("noticeData333333333", noticeData?.noticeHisotry);

    let _noticeHisotry = noticeData?.noticeHisotry
      ?.filter((file) => file?.remark != null)
      ?.filter((data1) => data1?.department != user?.userDao?.department)
      ?.map((file, index) => {
        let remark = "-"; // Default remark value in case of parsing error or missing data
        let isHod = true;
        try {
          const parsedRemark = JSON.parse(file.remark);
          console.log("parsedRemark09009", parsedRemark);
          remark = parsedRemark[0]?.parawiseRemarkEnglish || "-";
          isHod = parsedRemark[0]?.issueNo ? false : true;
        } catch (error) {
          // If there's an error in parsing JSON or accessing the field, the default value ("-") will be used.
          console.error("Error parsing remark:", error);
        }

        // if (file?.remark != null) {
        return {
          id: index,
          srNo: index + 1,
          remark: remark,
          designation: file.designation ? file.designation : "Not Available",
          isHod: isHod,

          //! = old
          // noticeRecivedFromPerson: employeeList?.find(
          //   (obj) => obj.id === file.noticeRecivedFromPerson
          // )?.firstNameEn
          //   ? employeeList.find(
          //       (obj) => obj.id === file.noticeRecivedFromPerson
          //     )?.firstNameEn
          //   : "Not Available",

          noticeRecivedFromPersonEng:
            employeeList?.find(
              (data) => data?.id == file?.noticeRecivedFromPerson
            )?.firstNameEn +
            " " +
            employeeList?.find(
              (data) => data?.id == file?.noticeRecivedFromPerson
            )?.middleNameEn +
            " " +
            employeeList?.find(
              (data) => data?.id == file?.noticeRecivedFromPerson
            )?.lastNameEn,

          noticeRecivedFromPersonMr:
            employeeList?.find(
              (data) => data?.id == file?.noticeRecivedFromPerson
            )?.firstNameMr +
            " " +
            employeeList?.find(
              (data) => data?.id == file?.noticeRecivedFromPerson
            )?.middleNameMr +
            " " +
            employeeList?.find(
              (data) => data?.id == file?.noticeRecivedFromPerson
            )?.middleNameMr,

          department: departments?.find(
            (obj) =>
              obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
          )?.department
            ? departments?.find(
                (obj) =>
                  obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
              )?.department
            : "Not Available",

          // moment(r.noticeDate).format("DD-MM-YYYY"),
          noticeSentDate: moment(file.noticeSentDate).format("DD-MM-YYYY"),

          // noticeSentDate: file.noticeSentDate
          //   ? file.noticeSentDate
          //   : "Not Available",
        };
        // }
      })
      ?.filter((da) => da?.isHod === true)
      .map((val, i) => {
        console.log("resd", val);
        return {
          ...val,
          srNo: i + 1,
        };
      });

    console.log("_NoticeHistory321111", _noticeHisotry);
    setNoticeHistoryList(_noticeHisotry);

    // Notice Attachment
    if (true) {
      const noticeAttachment = [...selectedNotice.noticeAttachment];
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id ? file.id : "Not Available",
          srNo: file.id ? file.id : "Not Available",
          originalFileName: file.originalFileName
            ? file.originalFileName
            : "Not Available",
          extension: file.extension ? file.extension : "Not Available",
          attachedNameEn: file.attachedNameEn
            ? file.attachedNameEn
            : "Not Available",
          attachedNameMr: file.attachedNameMr
            ? file.attachedNameMr
            : "Not Available",
          filePath: file.filePath ? file.filePath : "-",
        };
      });
      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
    }

    // Parawise Report
    let _parawiseReport = noticeData?.parawiseTrnParawiseReportDaoLst?.map(
      (val, i) => {
        console.log("resd", val);
        return {
          srNo: i + 1,
          id: i,
          paragraphWiseAanswerDraftOfIssues:
            val?.paragraphWiseAanswerDraftOfIssues,
          paragraphWiseAanswerDraftOfIssuesMarathi:
            val?.paragraphWiseAanswerDraftOfIssuesMarathi,
          issueNo: val?.issueNo,
        };
      }
    );
    setParawiseReportList(_parawiseReport);

    // add data in fields
  }, [officeLocationList, departments, employeeList, authority, noticeData]);

  useEffect(() => {
    console.log("parawiseReportList", parawiseReportList);
    console.log("concerDeptList", concerDeptList);
    console.log("Notice History", noticeHistoryList);
  }, [concerDeptList, noticeHistoryList, finalFiles, parawiseReportList]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    const tempData = [];
    tempDepartment?.map((data) => {
      console.log("sdf34132", departments.includes(data), data, departments);

      departments.map((data1) => {
        if (data1?.id == data) {
          tempData.push(data1);
        }
      });
      // if (departments.includes(data)) {
      //   tempData.push(tempData);
      // }
    });
    setTempDepartment1(tempData);
    console.log("tempDepartment3424", tempData);
  }, [tempDepartment]);
  // view
  return (
    <>
      <Box
        sx={{
          marginLeft: "2vw",
        }}
      >
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmitForm)}>
          <Paper
            sx={{
              margin: 3,
              padding: 2,
            }}
            elevation={5}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <Box
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {/* Form Header */}
                  <Box
                    // style={{
                    //   display: "flex",
                    //   justifyContent: "center",
                    //   paddingTop: "10px",
                    //   // backgroundColor:'#0E4C92'
                    //   // backgroundColor:'		#0F52BA'
                    //   // backgroundColor:'		#0F52BA'
                    //   background:
                    //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                    // }}

                    style={{
                      // backgroundColor: "#0084ff",
                      backgroundColor: "#556CD6",
                      // backgroundColor: "#1C39BB",

                      // #00308F
                      color: "white",
                      display: "flex",
                      justifyContent: "center",
                      // fontSize: 19,
                      // marginTop: 30,
                      // marginBottom: "50px",
                      // // marginTop: ,
                      // padding: 8,
                      // paddingLeft: 30,
                      // marginLeft: "50px",
                      // marginRight: "75px",
                      borderRadius: 100,
                      height: "8vh",
                    }}
                  >
                    <h2
                      style={{
                        color: "white",
                        marginTop: "1vh",
                      }}
                    >
                      {/* Response To Notice Approval */}
                      <FormattedLabel id="responseToNoticeApproval" />
                    </h2>
                  </Box>
                </Box>
                <div
                  style={{
                    backgroundColor: "#556CD6",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>{<FormattedLabel id="noticeDetails" />}</strong>
                </div>

                <ThemeProvider theme={theme}>
                  <div style={{ marginBottom: "5vh" }}>
                    <Grid container>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl
                          sx={{ marginTop: 0 }}
                          error={!!errors.noticeDate}
                        >
                          <Controller
                            control={control}
                            name="noticeDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      <FormattedLabel id="noticeDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  disabled
                                  onChange={(date) => {
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  // selected={field.value}
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
                                      error={!!errors.noticeDate}
                                      helperText={
                                        errors?.noticeDate
                                          ? errors?.noticeDate.message
                                          : null
                                      }
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          disabled
                          InputLabelProps={{ shrink: true }}
                          id="standard-basic"
                          label={<FormattedLabel id="inwardNo" />}
                          variant="standard"
                          {...register("inwardNo")}
                          error={!!errors.inwardNo}
                        />
                      </Grid>

                      {/* Notice Received from Advocate in English */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          label={
                            <FormattedLabel id="noticeReceviedFromAdvocateEn" />
                          }
                          variant="standard"
                          {...register("noticeRecivedFromAdvocatePerson")}
                          error={!!errors.noticeRecivedFromAdvocatePerson}
                          helperText={
                            errors?.noticeRecivedFromAdvocatePerson
                              ? errors.noticeRecivedFromAdvocatePerson.message
                              : null
                          }
                        />
                      </Grid>

                      {/* Notice Recived from Advocate in Marathi */}
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          label={
                            <FormattedLabel id="noticeReceviedFromAdvocateMr" />
                          }
                          variant="standard"
                          {...register("noticeRecivedFromAdvocatePersonMr")}
                          error={!!errors.noticeRecivedFromAdvocatePersonMr}
                          helperText={
                            errors?.noticeRecivedFromAdvocatePersonMr
                              ? errors.noticeRecivedFromAdvocatePersonMr.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl
                          error={!!errors.noticeRecivedDate}
                          sx={{ marginTop: 0 }}
                        >
                          <Controller
                            control={control}
                            name="noticeRecivedDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  disabled
                                  label={
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      <FormattedLabel id="noticeRecivedDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!errors.noticeRecivedDate}
                                      helperText={
                                        errors?.noticeRecivedDate
                                          ? errors?.noticeRecivedDate.message
                                          : null
                                      }
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
                          {/* <FormHelperText>
                                {errors?.noticeRecivedDate
                                  ? errors.noticeRecivedDate.message
                                  : null}
                              </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <FormControl
                          error={!!errors.requisitionDate}
                          sx={{ marginTop: 0 }}
                        >
                          <Controller
                            control={control}
                            name="requisitionDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      <FormattedLabel id="requisitionDate" />
                                    </span>
                                  }
                                  disabled
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      error={!!errors.requisitionDate}
                                      helperText={
                                        errors?.requisitionDate
                                          ? errors?.requisitionDate.message
                                          : null
                                      }
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
                          {/* <FormHelperText>
                                {errors?.requisitionDate
                                  ? errors?.requisitionDate.message
                                  : null}
                              </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{
                          display: "flex",
                          // justifyContent: "center",
                          // alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          sx={{
                            width: "86%",
                            marginLeft: "6vw",
                          }}
                          disabled
                          multiline
                          id="standard-basic"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.noticeDetails}
                          helperText={
                            errors?.noticeDetails
                              ? errors.noticeDetails.message
                              : null
                          }
                          size="small"
                          {...register("noticeDetails")}
                          label={<FormattedLabel id="noticeDetailsEn" />}
                        />
                      </Grid>

                      {/* Notice Details in Marathi */}
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{
                          display: "flex",
                          // justifyContent: "center",
                          // alignItem: "center",
                          marginBottom: "5px",
                        }}
                      >
                        <TextField
                          sx={{
                            width: "86%",
                            marginLeft: "6vw",
                          }}
                          disabled
                          multiline
                          id="standard-basic"
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.noticeDetailsMr}
                          helperText={
                            errors?.noticeDetailsMr
                              ? errors.noticeDetailsMr.message
                              : null
                          }
                          size="small"
                          {...register("noticeDetailsMr")}
                          label={<FormattedLabel id="noticeDetailsMr" />}
                        />
                      </Grid>
                    </Grid>

                    {/** 
                    <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                      <DataGrid
                        getRowId={(row) => row.srNo}
                        density="compact"
                        autoHeight={true}
                        pagination
                        paginationMode="server"
                        rows={
                          concerDeptList == [] || concerDeptList == undefined || concerDeptList == ""
                            ? []
                            : concerDeptList
                        }
                        columns={_col}
                        onPageChange={(_data) => {}}
                        onPageSizeChange={(_data) => {}}
                      />
                    </Grid>
                    */}
                  </div>
                </ThemeProvider>

                {/* Notice History */}
                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#556CD6",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="noticeHistory" />}</strong>
                  </div>
                  <Grid
                    container
                    style={{
                      padding: "10px",
                      paddingLeft: "5vh",
                      paddingRight: "5vh",
                    }}
                  >
                    <Grid item xs={12}>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                        rows={
                          noticeHistoryList == [] ||
                          noticeHistoryList == undefined ||
                          noticeHistoryList == ""
                            ? []
                            : noticeHistoryList
                        }
                        columns={_columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        //checkboxSelection
                      />
                    </Grid>
                  </Grid>
                </div>

                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#556CD6",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="noticeAttachment" />}</strong>
                  </div>
                  <Grid
                    container
                    style={{
                      padding: "10px",
                      paddingLeft: "5vh",
                      paddingRight: "5vh",
                    }}
                  >
                    <Grid item xs={12}>
                      <FileTable
                        appName="LCMS" //Module Name
                        serviceName={"L-Notice"} //Transaction Name
                        fileName={attachedFile} //State to attach file
                        filePath={setAttachedFile} // File state upadtion function
                        newFilesFn={setAdditionalFiles} // File data function
                        columns={columns} //columns for the table
                        rows={finalFiles} //state to be displayed in table
                        uploading={setUploading}
                        showNoticeAttachment={router.query.showNoticeAttachment}
                      />
                    </Grid>
                  </Grid>
                </div>

                <h1>
                  <FormattedLabel id="responseToNoticeApproval" />
                </h1>

                <Box
                  sx={{
                    border: "0.1rem outset black",
                    marginTop: "10px",
                  }}
                >
                  <Grid className={styles.theme1} container>
                    <Grid
                      item
                      xs={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h3>
                        <FormattedLabel id="pointNo" />
                      </h3>
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h3>
                        <FormattedLabel id="pointExp" />
                      </h3>
                    </Grid>
                  </Grid>
                  <Box
                    overflow="auto"
                    height={500}
                    flex={1}
                    flexDirection="column"
                    display="flex"
                    p={2}
                    padding="0px"
                    // sx={{
                    //   border: "0.2rem outset black",
                    //   marginTop:"10px"
                    // }}
                  >
                    {fields.map((parawise, index) => {
                      return (
                        <>
                          <Grid
                            container
                            className={styles.theme2}
                            component={Box}
                            style={{ marginTop: 20 }}
                          >
                            <Grid item xs={0.1}></Grid>

                            <Grid
                              item
                              xs={1}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <TextField
                                disabled
                                placeholder="Department"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(
                                  `parawiseReportDao.${index}.departmentName`
                                )}
                              ></TextField>
                            </Grid>
                            <Grid item xs={0.1}></Grid>

                            <Grid
                              item
                              xs={1}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <TextField
                                disabled
                                placeholder="Issue No"
                                size="small"
                                type="number"
                                // oninput="auto_height(this)"
                                {...register(
                                  `parawiseReportDao.${index}.issueNo`
                                )}
                              ></TextField>
                            </Grid>

                            <Grid item xs={0.2}></Grid>

                            {/* Para for Marathi */}
                            <Grid
                              item
                              xs={4.2}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <TextField // style={auto_height_style}
                                disabled
                                // rows="1"
                                // style={{ width: 500 }}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Paragraph Wise Answer Draft Of Issues(In Marathi)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(
                                  `parawiseReportDao.${index}.parawiseRemarkMarathi`
                                )}
                              ></TextField>
                            </Grid>

                            <Grid item xs={0.3}></Grid>

                            {/* para for english */}
                            <Grid
                              item
                              xs={4.2}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <TextField // style={auto_height_style}
                                // rows="1"
                                // style={{ width: 500 }}
                                disabled
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Paragraph Wise Answer Draft Of Issues(In English)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(
                                  `parawiseReportDao.${index}.parawiseRemarkEnglish`
                                )}
                              ></TextField>
                            </Grid>
                          </Grid>

                          {/* responses by legal clerk*/}
                          <Grid
                            container
                            className={styles.theme2}
                            component={Box}
                            style={{ marginTop: 20 }}
                          >
                            <Grid item xs={1.1}></Grid>

                            <Grid item xs={1.1}></Grid>

                            <Grid item xs={0.2}></Grid>

                            {/* Para for Marathi */}
                            <Grid
                              item
                              xs={4.2}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <TextField // style={auto_height_style}
                                disabled
                                // rows="1"
                                // style={{ width: 500 }}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Legal Clerk Response(In Marathi)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(
                                  `parawiseReportDao.${index}.parawiseLegalClerkRemarkMarathi`
                                )}
                              ></TextField>
                            </Grid>

                            <Grid item xs={0.3}></Grid>

                            {/* para for english */}
                            <Grid
                              item
                              xs={4.2}
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <TextField // style={auto_height_style}
                                disabled
                                // rows="1"
                                // style={{ width: 500 }}
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="Legal Clerk Response(In English)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(
                                  `parawiseReportDao.${index}.parawiseLegalClerkRemarkEnglish`
                                )}
                              ></TextField>
                            </Grid>
                          </Grid>
                        </>
                      );
                    })}
                    {/* </ThemeProvider> */}
                  </Box>
                </Box>

                {/**
                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="noticeHistory" />}</strong>
                  </div>
                  <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                    <Grid item xs={12}>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                        rows={
                          noticeHistoryList == [] || noticeHistoryList == undefined || noticeHistoryList == ""
                            ? []
                            : noticeHistoryList
                        }
                        columns={_columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        //checkboxSelection
                      />
                    </Grid>
                  </Grid>
                </div>

                <div style={{ marginBottom: "5vh" }}>
                  <div
                    style={{
                      backgroundColor: "#0084ff",
                      color: "white",
                      fontSize: 19,
                      marginTop: 30,
                      marginBottom: 30,
                      padding: 8,
                      paddingLeft: 30,
                      marginLeft: "40px",
                      marginRight: "65px",
                      borderRadius: 100,
                    }}
                  >
                    <strong>{<FormattedLabel id="parawiseReport" />}</strong>
                  </div>
                  <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
                    <Grid item xs={12}>
                      <DataGrid
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        components={{ Toolbar: GridToolbar }}
                        autoHeight
                        rows={
                          parawiseReportList == [] ||
                          parawiseReportList == undefined ||
                          parawiseReportList == ""
                            ? []
                            : parawiseReportList
                        }
                        columns={parawiseRportColums}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        //checkboxSelection
                      />
                    </Grid>
                  </Grid>
                </div>
                 */}

                {/** 
                <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>Parawise Remark Clerk</strong>
                </div>
                <Grid container style={{ marginBottom: "5vh" }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItem: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <TextField
                      disabled
                      id="standard-basic"
                      variant="standard"
                      // InputLabelProps={{ shrink: true }}
                      error={!!errors.parawiseRemarkEnglish}
                      helperText={errors?.parawiseRemarkEnglish ? errors.parawiseRemarkEnglish.message : null}
                      size="small"
                      {...register("parawiseRemarkEnglish")}
                      label="parawise remark english"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItem: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <TextField
                      disabled
                      id="standard-basic"
                      variant="standard"
                      // InputLabelProps={{ shrink: true }}
                      error={!!errors.parawiseRemarkMarathi}
                      helperText={errors?.parawiseRemarkMarathi ? errors.parawiseRemarkMarathi.message : null}
                      size="small"
                      {...register("parawiseRemarkMarathi")}
                      label="parawise remark marathi"
                    />
                  </Grid>
                </Grid>
                */}

                {/**
                <div
                  style={{
                    backgroundColor: "#0084ff",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "40px",
                    marginRight: "65px",
                    borderRadius: 100,
                  }}
                >
                  <strong>Parawise Respone </strong>
                </div>
                */}

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "row",
                    xl: "row",
                  }}
                  spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                  justifyContent="center"
                  alignItems="center"
                  marginTop="20px"
                >
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen("Approve")}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Approve"
                    endIcon={<TaskAltIcon />}
                  >
                    {/* Approve */}
                    {/* Submit */}
                    <FormattedLabel id="approve" />
                  </Button>
                  {/* <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen("Reassign")}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Reassign"
                    endIcon={<UndoIcon />}
                  >
                    Reassign
                  </Button> */}
                  {/* Reassign */}
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen("Reassign")}
                    sx={{ backgroundColor: "#DD4B10" }}
                    name="Approve"
                    endIcon={<UndoIcon />}
                  >
                    <FormattedLabel id="reassign" />
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    sx={{ backgroundColor: "#DD4B39" }}
                    endIcon={<CloseIcon />}
                    onClick={() => {
                      router.push("/LegalCase/transaction/newNotice");
                    }}
                  >
                    {/* Exit */}
                    <FormattedLabel id="exit" />
                  </Button>
                </Stack>

                {/** Modal */}
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <form onSubmit={handleSubmit(onFinish)}>
                    {/* Drop-Down for Department */}

                    {/*  */}
                    <Box sx={style}>
                      {/*  Department name */}
                      {approveRejectRemarkMode === "Approve" && (
                        <Grid
                          container
                          sx={{
                            marginTop: "10px",
                          }}
                        >
                          <Grid
                            item
                            // xs={12}
                            xs={4}
                          >
                            {/* Department Name  */}
                            <FormControl
                              sx={{ marginTop: 2 }}
                              // error={!!errors?.departmentName}
                              fullWidth
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="deptName" />
                              </InputLabel>

                              <Controller
                                render={({ field }) => (
                                  <Select
                                    fullWidth
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label={<FormattedLabel id="deptName" />}
                                    // placeholder="Select Department Name"

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
                                    {tempDepartment1
                                      .filter(
                                        (dept, index, self) =>
                                          self.findIndex(
                                            (d) => d.id === dept.id
                                          ) === index
                                      )
                                      .map((dept, index) => (
                                        <MenuItem
                                          key={index}
                                          value={dept.id}
                                          style={{
                                            display: dept.department
                                              ? "flex"
                                              : "none",
                                          }}
                                        >
                                          {/* {user.department} */}

                                          {language == "en"
                                            ? dept?.department
                                            : dept?.departmentMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="sendToDepartmentId"
                                // name="department"
                                control={control}
                                defaultValue=""
                              />
                              {/* <FormHelperText>
                              {errors?.departmentName
                                ? errors?.departmentName?.message
                                : null}
                            </FormHelperText> */}
                            </FormControl>
                          </Grid>
                        </Grid>
                      )}

                      {/* Remarks */}
                      <Box sx={{ padding: "10px" }}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          Enter Remark
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          multiline
                          size="small"
                          {...register("remark")}
                          label={<FormattedLabel id="enterRemarkEn" />}
                          InputLabelProps={{
                            shrink:
                              (watch("remark") ? true : false) ||
                              (router.query.remark ? true : false),
                          }}
                        />

                        {/*  Button For Translation */}
                        <Button
                          variant="contained"
                          sx={{
                            // marginTop: "70px",
                            marginLeft: "1vw",
                            height: "5vh",
                            width: "9vw",
                          }}
                          onClick={() =>
                            remarkApi(watch("remark"), "remarkMr", "en")
                          }
                        >
                          {/* Translate */}
                          <FormattedLabel id="mar" />
                        </Button>

                        {/* Transiliteraton */}
                        {/* <Transliteration
                          _key={"remark"}
                          labelName={"remark"}
                          fieldName={"remark"}
                          updateFieldName={"remarkMr"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="enterRemarkEn" required />}
                        /> */}
                      </Box>

                      {/* remarks in Marathi */}
                      <Box
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        {/* remarks in Marathi */}
                        <TextField
                          multiline
                          fullWidth
                          size="small"
                          {...register("remarkMr")}
                          label={<FormattedLabel id="enterRemarkMr" />}
                          InputLabelProps={{
                            shrink:
                              (watch("remarkMr") ? true : false) ||
                              (router.query.remarkMr ? true : false),
                          }}
                        />

                        <Button
                          variant="contained"
                          sx={{
                            // marginTop: "70px",
                            marginLeft: "1vw",
                            height: "5vh",
                            width: "9vw",
                          }}
                          onClick={() =>
                            remarkApi(watch("remarkMr"), "remark", "mr")
                          }
                        >
                          {/* Translate */}
                          <FormattedLabel id="eng" />
                        </Button>
                        {/* transliteration */}
                        {/* <Transliteration
                          _key={"remarkMr"}
                          labelName={"remarkMr"}
                          fieldName={"remarkMr"}
                          updateFieldName={"remark"}
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id="enterRemarkMr" required />}
                        /> */}
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          padding: "10px",
                          marginTop: "3vh",
                        }}
                      >
                        <Button variant="contained" size="small" type="submit">
                          Submit
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleClose}
                        >
                          CANCEL
                        </Button>
                      </Box>
                    </Box>
                  </form>
                </Modal>
              </>
            )}
          </Paper>
        </form>
      </FormProvider>
    </>
  );
};

export default ResponseToNoticeApproval;
