import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Paper,
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
import { Visibility } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { toast, ToastContainer } from "react-toastify";
import UndoIcon from "@mui/icons-material/Undo";
import sweetAlert from "sweetalert";
import DeleteIcon from "@mui/icons-material/Delete";
import { Schema } from "../../../../containers/schema/LegalCaseSchema/parawiseApprovalSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
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
  width: "90%",
  height: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ParawiseApproval = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
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
    watch,
    reset,
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
  let department = useSelector(
    (state) => state?.user?.user?.userDao?.department
  );

  //key={field.id}
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

  // Documents view----------------------------------------------------------------
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

  const onFinish = () => {};
  // userName
  // const getUserName = async () => {
  //   await axios
  //     .get(`${urls.CFCURL}/master/user/getAllOLD`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((r) => {
  //       if (r.status == 200) {
  //         console.log("res user", r);
  //         setEmployeeList(r.data.user);
  //       }
  //     })
  //     ?.catch((err) => {
  //       console.log("err", err);
  //       callCatchMethod(err, language);
  //     });
  // };

  // departments
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
          }))
        );
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
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
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

          let jsonArrayStringRemarks = r.data.parawiseRemarkEnglish;

          console.log("jsonArrayStringRemarks", jsonArrayStringRemarks);
          // convert jsonArrayStringRemarks string to jsonArray
          let jsonArrayRemarks = JSON.parse(jsonArrayStringRemarks);
          console.log("jsonArrayRemarks", jsonArrayRemarks);

          // iterate jsonArrayRemarks
          // Clear the fields
          fields.forEach((element) => {
            remove(element.id);
          });

          jsonArrayRemarks.forEach((element) => {
            if (element.issueNo != null) {
              append({
                id: element.id,
                issueNo: element.issueNo,
                parawiseRemarkEnglish: element.parawiseRemarkEnglish,
                parawiseRemarkMarathi: element.parawiseRemarkMarathi,
              });
            }
            console.log("element", element);
          });

          setParawiseReport(r.data);
        }
      });
    // ?.catch((err) => {
    //   console.log("err", err);
    //   callCatchMethod(err, language);
    // });
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
    let bodyForApiApproveParawiseReport;
    // if (approveRejectRemarkMode == "Reassign") {
    //   bodyForApiApproveParawiseReport = {
    //     id: parawiseReport?.id,
    //     // noticeId: noticeId,
    //     // department: department,
    //     parawiseRejectionRemarkHodEnglish: data?.remark,
    //     parawiseRejectionRemarkHodMarathi: data?.remarkMr,
    //   };
    // }

    // New If condition

    //----new ---- for stringfy
    const data1Remark = {
      noticeId: data?.inwardNo,
      parawiseApprovalRemarkHodEnglish: data?.remark,
      parawiseRemarkEnglish: data?.remark,
      parawiseApprovalRemarkHodMarathi: data?.remarkMr,
      parawiseRemarkMarathi: data?.remarkMr,
    };

    const data1RemarkMarathi = {
      noticeId: data?.inwardNo,
      parawiseApprovalRemarkHodEnglish: data?.remark,
      parawiseRemarkEnglish: data?.remark,
      parawiseApprovalRemarkHodMarathi: data?.remarkMr,
      parawiseRemarkMarathi: data?.remarkMr,
    };

    if (approveRejectRemarkMode == "Approve") {
      bodyForApiApproveParawiseReport = {
        id: parawiseReport?.id,
        // createdUserId: user.id,

        parawiseApprovalRemarkHodEnglish: JSON.stringify([data1Remark]),
        // parawiseRemarkEnglish: JSON.stringify([data1Remark]),
        parawiseApprovalRemarkHodMarathi: JSON.stringify([data1RemarkMarathi]),
        // parawiseRemarkMarathi: JSON.stringify([data1RemarkMarathi]),

        // hodRejectionRemark: data?.remark,
        // hodRejectionRemarkMr: data?.remarkMr,
      };
    } else {
      bodyForApiApproveParawiseReport = {
        id: parawiseReport?.id,
        createdUserId: user.id,

        // hodApprovalRemark: data?.remark,
        // hodApprovalRemarkMr: data?.remarkMr,

        parawiseRejectionRemarkHodEnglish: JSON.stringify([data1Remark]),
        // parawiseRemarkEnglish: JSON.stringify([data1Remark]),
        // hodApprovalRemarkMr: data?.remarkMr,
        parawiseRejectionRemarkHodMarathi: JSON.stringify([data1RemarkMarathi]),
        // parawiseRemarkMarathi: JSON.stringify([data1RemarkMarathi]),
      };
    }

    // alert("sdfsd");
    console.log("HodRemarkApprove204", bodyForApiApproveParawiseReport, data);

    // New Code

    if (approveRejectRemarkMode == "Reassign") {
      axios
        .post(
          `${urls.LCMSURL}/parawiseReport/reassignParawiseReportByConcrndHod`,
          bodyForApiApproveParawiseReport,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("resDetails", res);
          if (res.status == 201 || res.status == 200) {
            sweetAlert(
              // "Saved!",
              language === "en" ? "Saved!" : "जतन केले!",
              // "notice send successfully !",
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
      axios
        .post(
          `${urls.LCMSURL}/parawiseReport/approveParawiseReport`,
          bodyForApiApproveParawiseReport,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("resDetails", res);
          if (res.status == 201 || res.status == 200) {
            sweetAlert(
              // "Saved!",
              language === "en" ? "Saved!" : "जतन केले!",
              //  "notice send successfully !",
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
    }

    // Old COde
    // if (approveRejectRemarkMode == "Approve") {
    //   bodyForApiApproveParawiseReport = {
    //     id: parawiseReport.id,
    //     // noticeId: noticeId,
    //     // department: department,
    //     parawiseApprovalRemarkHodEnglish: data?.remark,
    //     parawiseApprovalRemarkHodMarathi: data?.remarkMr,
    //   };
    // } else {
    //   bodyForApiApproveParawiseReport = {
    //     id: parawiseReport.id,
    //     // noticeId: noticeId,
    //     // department: department,
    //     parawiseApprovalRemarkHodEnglish: data?.remark,
    //     parawiseApprovalRemarkHodMarathi: data?.remarkMr,
    //   };
    // }

    //   if(approveRejectRemarkMode == "Reassign"){
    //     axios
    //     .post(`${urls.LCMSURL}/parawiseReport/reassignParawiseReportByConcrndHod`, bodyForApiApproveParawiseReport, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //     )
    //     .then((res) => {
    //       if(res.status == 200 ||  res.status == 200 ){
    //     sweetAlert("Saved!", "notice send successfully !", "success");
    //     router.push(`/LegalCase/transaction/newNotice`);

    //     }
    //     else{
    //     console.log("Login Failed ! Please Try Again !");

    //     }
    //     ).catch((err) =>{
    //    console.log("455454", err);
    //   toast("Failed ! Please Try Again !", {
    //     type: "error",

    //     });
    //     })
    //   }
    //   else{
    //     axios
    //        .post(`${urls.LCMSURL}/notice/approveTrnNoticeByLegalHod`, bodyForApiApproveTrnNoticeByLegalHod, {
    //          headers: {
    //            Authorization: `Bearer ${token}`,
    //          },
    //        })
    //        .then((res) => {
    //          console.log("resDetails", res);
    //          if (res.status == 201 || res.status == 200) {
    //            sweetAlert("Saved!", "notice send successfully !", "success");
    //            router.push(`/LegalCase/transaction/newNotice`);
    //          } else {
    //            console.log("Login Failed ! Please Try Again !");
    //          }
    //        })
    //        .catch((err) => {
    //          console.log("455454", err);
    //          toast("Failed ! Please Try Again !", {
    //            type: "error",
    //          });
    //        });

    //  }
    //  }

    // console.log("bodyForApiApproveParawiseReport", bodyForApiApproveParawiseReport);

    // axios
    //   .post(`${urls.LCMSURL}/parawiseReport/approveParawiseReport`, bodyForApiApproveParawiseReport, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((r) => {
    //     if (r.status == 201 || r.status == 200) {
    //       sweetAlert("Saved!", "Record Saved successfully !", "success");
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
      field: "noticeRecivedFromPerson",
      headerName: <FormattedLabel id="user" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "department",
      headerName: <FormattedLabel id="deptName" />,
      // type: "number",
      width: 150,
      align: "center",
      headerAlign: "center",
    },

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
    // getUserName();
    getAuthority();
    setNoticeData(selectedNotice);
  }, []);

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
    // noticeDetailsMr
    setValue("noticeDetailsMr", noticeData?.noticeDetailsMr);

    setValue("inwardNo", noticeData?.inwardNo);

    // notice id
    setNoticeId(noticeData?.id);

    getParawiseReport(noticeData?.id);

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
    let _noticeHisotry = noticeData?.noticeHisotry?.map((file, index) => {
      return {
        id: index,
        srNo: index + 1,
        remark: file.remark ? file.remark : "-",
        designation: file.designation ? file.designation : "Not Available",
        noticeRecivedFromPerson: employeeList.find(
          (obj) => obj.id === file.noticeRecivedFromPerson
        )?.firstNameEn
          ? employeeList.find((obj) => obj.id === file.noticeRecivedFromPerson)
              ?.firstNameEn
          : "Not Available",
        department: departments?.find(
          (obj) =>
            obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
        )?.department
          ? departments?.find(
              (obj) =>
                obj.id === selectedNotice.concernDeptUserList[0]?.departmentId
            )?.department
          : "Not Available",
        noticeSentDate: file.noticeSentDate
          ? file.noticeSentDate
          : "Not Available",
      };
    });

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

    console.log("_noticeAttachment", mainFiles);

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

    // Parawise Report Remarks

    console.log(
      "noticeData?.parawiseTrnParawiseReportDaoLst",
      noticeData?.parawiseTrnParawiseReportDaoLst,
      department
    );

    let parawiseReportRemark =
      noticeData?.parawiseTrnParawiseReportDaoLst?.find((data) => {
        if (data?.department == department) {
          return data;
        }
      });

    //setValue("parawiseRemarkEnglish", parawiseReportRemark?.parawiseRemarkEnglish);
    //setValue("parawiseRemarkMarathi", parawiseReportRemark?.parawiseRemarkMarathi);

    console.log("32432432", parawiseReportRemark?.parawiseRemarkEnglish);

    // parawiseTrnParawiseReportDaoLst;
  }, [noticeData]);

  useEffect(() => {
    console.log("parawiseReportList", parawiseReportList);
    console.log("concerDeptList", concerDeptList);
  }, [concerDeptList, noticeHistoryList, finalFiles, parawiseReportList]);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  // view
  return (
    <>
      <div>
        <BreadcrumbComponent />
      </div>
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
                      display: "flex",
                      justifyContent: "center",

                      // #00308F
                      color: "white",
                      // fontSize: 19,
                      // marginTop: 30,
                      // marginBottom: "50px",
                      // // marginTop: ,
                      // padding: 8,
                      // paddingLeft: 30,
                      // marginLeft: "50px",
                      // marginRight: "75px",
                      height: "8vh",
                      borderRadius: 100,
                    }}
                  >
                    <h2
                      style={{
                        color: "white",
                        marginTop: "1vh",
                      }}
                    >
                      <FormattedLabel id="parawiseResponse" />
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

                      {/* Notic Details in Marathi */}
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
                  <strong>
                    <FormattedLabel id="parawiseRemarkClerk" />
                  </strong>
                </div>
                <Grid container style={{ marginBottom: "5vh" }}>
                  {/* <Grid
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
                      marginLeft: "50px",
                      // border: "2px solid red",
                      marginBottom: "5px",
                    }}
                  >
                    <TextField
                      disabled
                      id="standard-basic"
                      variant="standard"
                      style={{ width: "500px" }}
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.parawiseRemarkEnglish}
                      helperText={errors?.parawiseRemarkEnglish ? errors.parawiseRemarkEnglish.message : null}
                      size="small"
                      {...register("parawiseRemarkEnglish")}
                      label="Parawise Remark English"
                    />
                  </Grid> */}
                  {/* <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
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
                      style={{ width: "500px" }}
                      variant="standard"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.parawiseRemarkMarathi}
                      helperText={errors?.parawiseRemarkMarathi ? errors.parawiseRemarkMarathi.message : null}
                      size="small"
                      {...register("parawiseRemarkMarathi")}
                      label="Parawise Remark Marathi"
                    />
                  </Grid> */}
                </Grid>

                <h1>
                  <FormattedLabel id="parawiseRemark" />
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
                    <Grid
                      item
                      xs={1}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    ></Grid>
                  </Grid>
                  <Box
                    overflow="auto"
                    height={250}
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
                              xs={1.5}
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
                            {/* para for Marathi */}
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
                                placeholder="Paragraph Wise Aanswer Draft Of Issues(In Marathi)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(
                                  `parawiseReportDao.${index}.parawiseRemarkMarathi`
                                )}
                              ></TextField>
                            </Grid>

                            <Grid item xs={0.3}></Grid>

                            {/* para for English */}
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
                                placeholder="Paragraph Wise Aanswer Draft Of Issues(In English)"
                                size="small"
                                // oninput="auto_height(this)"
                                {...register(
                                  `parawiseReportDao.${index}.parawiseRemarkEnglish`
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
                    <FormattedLabel id="approve" />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen("Reassign")}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Reassign"
                    endIcon={<UndoIcon />}
                  >
                    {/* Reassign */}
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
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onFinish)}>
                      <Box sx={style}>
                        <Box sx={{ padding: "10px" }}>
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            {/* Enter Remark */}
                            <FormattedLabel id="enterRemark" />
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
                            multiline
                            fullWidth
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
                              // marginTop: "6vh",
                              // marginTop: "70px",
                              marginLeft: "1vw",
                              height: "6vh",
                              width: "9vw",
                            }}
                            onClick={() =>
                              remarkApi(watch("remark"), "remarkMr", "en")
                            }
                          >
                            {/* Translate */}
                            <FormattedLabel id="mar" />
                          </Button>
                          {/* New  */}
                          {/* <Transliteration
                            _key={"remark"}
                            labelName={"remark"}
                            fieldName={"remark"}
                            updateFieldName={"remarkMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            // disabled={disabled}
                            label={
                              <FormattedLabel id="enterRemarkEn" required />
                            }
                            error={!!errors.remark}
                            helperText={
                              errors?.remark ? errors.remark.message : null
                            }
                          /> */}
                        </Box>

                        {/* remarks in Marathi */}
                        <Box
                          sx={{
                            padding: "10px",
                            display: "flex",
                            justifyContent: "center",
                            // width: "90%",
                          }}
                        >
                          {/* remarks in Marathi */}
                          <TextField
                            sx={{
                              marginTop: "5vh",
                              width: "90%",
                            }}
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
                              marginTop: "5vh",
                              // marginTop: "70px",
                              marginLeft: "1vw",
                              height: "6vh",
                              width: "9vw",
                            }}
                            onClick={() =>
                              remarkApi(watch("remarkMr"), "remark", "mr")
                            }
                          >
                            {/* Translate */}
                            <FormattedLabel id="eng" />
                          </Button>

                          {/* <Transliteration
                            _key={"remarkMr"}
                            labelName={"remarkMr"}
                            fieldName={"remarkMr"}
                            updateFieldName={"remark"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            // disabled={disabled}
                            label={
                              <FormattedLabel id="enterRemarkMr" required />
                            }
                            error={!!errors.remarkMr}
                            helperText={
                              errors?.remarkMr ? errors.remarkMr.message : null
                            }
                          /> */}
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                            padding: "10px",
                            marginTop: "6vh",
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            type="submit"
                          >
                            {/* Submit */}
                            <FormattedLabel id="submit" />
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleClose}
                          >
                            {/* CANCEL */}
                            <FormattedLabel id="cancel" />
                          </Button>
                        </Box>
                      </Box>
                    </form>
                  </FormProvider>
                </Modal>
              </>
            )}
          </Paper>
        </form>
      </FormProvider>
    </>
  );
};

export default ParawiseApproval;
