import { yupResolver } from "@hookform/resolvers/yup";
import { Visibility } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Modal,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import CloseIcon from "@mui/icons-material/Close";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";

import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

// import schema from "./schema";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, FormControl, Grid, Paper, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
// import { parawiseRequestLcConcernClerk1 } from "../../../../../containers/schema/LegalCaseSchema/parawiseRequest";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
const handleClose = () => setOpen(false);
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { parawiseRequestLcConcernClerk1 } from "../../../../containers/schema/LegalCaseSchema/parawiseReportSchema";
import theme from "../../../../theme";
import FileTable from "../../FileUpload/FileTableLcWithoutAddButton";
// import { parawiseRequestLcConcernClerk1 } from "../../../../containers/schema/LegalCaseSchema/noticeParawiseEntry";
// import { parawiseRequestLcConcernClerk1 } from "../../../../containers/schema/LegalCaseSchema/noticeParawiseEntry";
// import Transliteration from "../../../../components/common/linguosol/transliteration";
import Transliteration from "../../../../components/common/linguosol/transliterationForParawise";
import { width } from "@mui/system";
import * as yup from "yup";
import { catchExceptionHandlingMethod } from "../../../../util/util";

import { saveAs } from "file-saver";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

// parawiseReport
const ParawiseEntry = () => {
  // Validation
  const language = useSelector((state) => state.labels.language);

  // // Schema
  // const generateSchema = (language) => {

  //   const baseSchema = yup.object({
  //     // other

  //   });

  //   if (language === "en") {

  //     return baseSchema.shape({
  //       clerkRemarkEnglish: yup
  //         .string()
  //         .required("Opinion Subject is required.")
  //         .matches(
  //     /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?\–]*$/,

  //           "Must be only english characters / फक्त इंग्लिश शब्द "
  //         ),

  //     });
  //   } else if (language === "mr") {
  //     return baseSchema.shape({
  //       clerkRemarkMarathi: yup
  //         .string()
  //         .required("Opinion Subject is required.")
  //         .matches(
  //           /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?\–]*$/,
  //           "Must be only marathi characters/ फक्त मराठी शब्द"
  //         ),

  //     });
  //   } else {
  //     return baseSchema;
  //   }
  // };
  // // const language = useSelector((state) => state?.labels?.language);
  // const schema = generateSchema(language);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(parawiseRequestLcConcernClerk1),
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

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "parawiseReportDao", // unique name for your Field Array
    }
  );

  const appendUI = () => {
    append({
      issueNo: "",
      answerInEnglish: "",
      answerInMarathi: "",
    });
  };

  useEffect(() => {
    if (watch(`parawiseReportDao`).length == 0) {
      append();
    }
  }, []);

  const {
    fields: ParawiseFields,
    append: ParawiseAppend,
    remove: ParawiseRemove,
  } = useFieldArray({ control, name: "parawiseTrnParawiseReportDaoLst" });
  const {
    fields: noticeFields,
    append: noticeAppend,
    remove: noticeRemove,
  } = useFieldArray({ control, name: "testconcernDeptUserList" });

  const [noticeId, setNoticeId] = React.useState(null);
  const router = useRouter();
  const [requisitionDate, setRequisitionDate] = React.useState(null);
  let pageType = false;
  const user = useSelector((state) => state.user.user);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [slideChecked, setSlideChecked] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);
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
  // const language = useSelector((state) => state.labels.language);
  const [concerDeptList, setConcernDeptList] = useState([]);
  const [noticeAttachment, setNoticeAttachment] = useState([]);
  const [noticeHistoryList, setNoticeHistoryList] = useState([]);
  const [approveRejectRemarkMode, setApproveRejectRemarkMode] = useState("");

  const [noticeHistory, SetNoticeHistory] = useState([]);

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

  const handleOpen = (approveRejectRemarkMode) => {
    console.log("fields", fields);
    setOpen(true);
    setApproveRejectRemarkMode(approveRejectRemarkMode);
  };
  const selectedNotice = useSelector((state) => {
    console.log("selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });
  const [open, setOpen] = useState(false);
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

  // notice History
  const getNoticeHistory = (noticeId) => {
    if (noticeId) {
      axios
        .get(
          `${urls.LCMSURL}/transaction/noticeHistory?noticeId=${Number(
            noticeId
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          SetNoticeHistory(
            res.data.noticeHistory.map((r, i) => ({
              // id: r.id,
              // department: r.department,
            }))
          );
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  const onSubmitForm = (data) => {
    let bodyForApiParawiseReport;
    if (approveRejectRemarkMode == "Reassign") {
      bodyForApiParawiseReport = {
        noticeId: Number(noticeId),
        department: user?.userDao?.department,
        parawiseRemarkEnglish: data?.remark,
        parawiseRemarkMarathi: data?.remarkMr,
      };
    }
    if (approveRejectRemarkMode == "Approve") {
      bodyForApiParawiseReport = {
        noticeId: Number(noticeId),
        department: user?.userDao?.department,
        parawiseRemarkEnglish: data?.remark,
        parawiseRemarkMarathi: data?.remarkMr,
      };
    } else {
      bodyForApiParawiseReport = {
        noticeId: Number(noticeId),
        department: user?.userDao?.department,
        parawiseRemarkEnglish: data?.remark,
        parawiseRemarkMarathi: data?.remarkMr,
      };
    }

    // const bodyForApiParawiseReport = {
    //   noticeId: Number(noticeId),
    //   department: user?.userDao?.department,
    //   parawiseRemarkEnglish: fromData?.parawiseRemarkEnglish,
    //   parawiseRemarkMarathi: fromData?.parawiseRemarkMarathi,
    // };

    // const finalBody = {
    //   ...noticeData,
    //   parawiseTrnParawiseReportDaoLst: fromData?.parawiseTrnParawiseReportDaoLst,
    //   departmentName: null,
    //   id: Number(noticeId),
    //   pageMode: window.event.submitter.name == "save" ? "PARAWISE_REPORT_CREATE" : "PARAWISE_REPORT_DRAFT",
    //   timeStamp: moment(new Date()).unix().toString(),
    // };
    console.log("bodyForApiParawiseReport", bodyForApiParawiseReport);

    axios
      .post(
        `${urls.LCMSURL}/parawiseReport/saveParawiseReportV2`,
        bodyForApiParawiseReport,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {
        console.log("ressaveParawiseReportV2", res);
        if (res.status == 201 || res.status == 200) {
          sweetAlert(
            // "Saved!",
            language === "en" ? "Saved!" : "जतन केले!",
            //  "Record Saved successfully !",
            language === "en"
              ? "Record Saved successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
            "success"
          );
          router.push(`/LegalCase/transaction/newNotice`);
        } else {
          sweetAlert(
            // "Error!",
            language === "en" ? "Error!" : "त्रुटी प्रवण",
            //  "Record Not save successfully !",
            language === "en"
              ? "Record Not save successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन नाही!",
            "error"
          );
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
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

  // Notice Attachments
  const columns = [
    // {
    //   headerName: <FormattedLabel id="srNo" />,
    //   field: "srNo",
    //   width: 100,
    //   align: "center",
    //   headerAlign: "center",
    //   renderCell: (index) => index.api.getRowIndex(index.row.id) + 1,
    // },
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
      width: 250,
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

    // {
    //   field: "department",
    //   headerName: <FormattedLabel id="deptName" />,
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

  const submitParaWiseReport = (dataFromForm) => {
    console.log("sagardataFromForm", dataFromForm);
    console.log("fields", fields);

    // convert fields to json array
    let data = dataFromForm.parawiseReportDao.map((item) => {
      if (
        item.issueNo != null &&
        item.issueNo != undefined &&
        item.issueNo != ""
      ) {
        return {
          issueNo: item.issueNo,
          noticeId: Number(selectedNotice.id),
          parawiseRemarkEnglish: item.answerInEnglish,
          parawiseRemarkMarathi: item.answerInMarathi,
        };
      }
    });

    // convert json array to string
    data = JSON.stringify(data);

    console.log("sagardata", data);

    let bodyForApiParawiseReport;

    bodyForApiParawiseReport = {
      noticeId: Number(selectedNotice.id),
      departmentId: user?.userDao?.department,
      parawiseRemarkEnglish: data,
      parawiseRemarkMarathi: data,
    };

    console.log("sagarbodyForApiParawiseReport", bodyForApiParawiseReport);

    axios
      .post(
        `${urls.LCMSURL}/parawiseReport/saveParawiseReportV2`,
        bodyForApiParawiseReport,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      .then((res) => {
        console.log("ressaveParawiseReportV2", res);
        if (res.status == 201 || res.status == 200) {
          sweetAlert(
            // "Saved!",
            language === "en" ? "Saved!" : "जतन केले!",
            //  "Record Saved successfully !",
            language === "en"
              ? "Record Saved successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
            "success"
          );
          router.push(`/LegalCase/transaction/newNotice`);
        } else {
          sweetAlert(
            // "Error!",
            language === "en" ? "Error!" : "त्रुटी प्रवण",
            // "Record Not save successfully !",
            language === "en"
              ? "Record Not save successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन नाही!",
            "error"
          );
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getDepartments();
    getOfficeLocation();
    // getUserName();
    // getAuthority();
    setNoticeData(selectedNotice);
    let noticeAttachment = selectedNotice?.noticeAttachment?.map((f, i) => {
      return { ...f, srNo: i + 1 };
    });
    setMainFiles(noticeAttachment ?? []);
  }, []);

  useEffect(() => {
    console.log("concerDeptList", concerDeptList);
  }, [concerDeptList, noticeHistoryList, finalFiles]);

  useEffect(() => {
    console.log("Notice DAta", noticeData);
    // console.log("noticeDate", noticeData.noticeDate);

    setValue("noticeRecivedDate", noticeData?.noticeRecivedDate);
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

    console.log(
      "sdfsdf324234",
      noticeData?.parawiseTrnParawiseReportDaoLst[0]?.parawiseRemarkEnglish !=
        null &&
        noticeData?.parawiseTrnParawiseReportDaoLst[0]?.parawiseRemarkEnglish !=
          undefined &&
        noticeData?.parawiseTrnParawiseReportDaoLst[0]?.parawiseRemarkEnglish !=
          ""
        ? JSON.parse(
            noticeData?.parawiseTrnParawiseReportDaoLst[0]
              ?.parawiseRemarkEnglish
          )
        : ""
    );

    //nnnn
    // setValue(
    //   "parawiseReportDao",
    //   noticeData?.parawiseTrnParawiseReportDaoLst[0]?.parawiseRemarkEnglish !=
    //     null &&
    //     noticeData?.parawiseTrnParawiseReportDaoLst[0]?.parawiseRemarkEnglish !=
    //       undefined &&
    //     noticeData?.parawiseTrnParawiseReportDaoLst[0]?.parawiseRemarkEnglish !=
    //       ""
    //     ? JSON.parse(
    //         noticeData?.parawiseTrnParawiseReportDaoLst[0]
    //           ?.parawiseRemarkEnglish
    //       )
    //     : ""
    // );

    // notice id
    setNoticeId(noticeData?.id);

    // getNoticeHistory(noticeData?.id);

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

    //     // remark: JSON.parse(file.remark)[0].answerInEnglish,

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

    let _noticeHisotry = noticeData?.noticeHisotry?.map((file, index) => {
      let remark = "-"; // Default remark value in case of parsing error or missing data
      try {
        const parsedRemark = JSON.parse(file.remark);
        remark = parsedRemark[0]?.parawiseRemarkEnglish || "-";
      } catch (error) {
        // If there's an error in parsing JSON or accessing the field, the default value ("-") will be used.
        console.error("Error parsing remark:", error);
      }

      return {
        id: index,
        srNo: index + 1,
        remark: remark,
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
    if (employeeList.length > 0 && departments.length > 0) {
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
  }, [officeLocationList, departments, employeeList, authority, noticeData]);

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

  useEffect(() => {
    console.log("router?.query", router?.query);
    if (router?.query?.status === "PARAWISE_REPORT_REASSIGNED") {
      setValue(
        "parawiseRejectionRemarkHodEnglish",
        router?.query?.parawiseRejectionRemarkHodEnglish
      );
      setValue(
        "parawiseRejectionRemarkHodMarathi",
        router?.query?.parawiseRejectionRemarkHodMarathi
      );
      let _hisRem = JSON?.parse(router?.query?.parawiseRemarkEnglish)?.map(
        (_d) => {
          return {
            // ..._d,
            issueNo: _d?.issueNo,
            noticeId: _d?.noticeId,
            answerInEnglish: _d?.parawiseRemarkEnglish,
            answerInMarathi: _d?.parawiseRemarkMarathi,
          };
        }
      );
      // console.log("_hisRem", _hisRem);
      setValue("parawiseReportDao", _hisRem ?? []);
    }
  }, [router?.query]);

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
        <form onSubmit={methods.handleSubmit(submitParaWiseReport)}>
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
                      marginBottom: "50px",
                      // marginTop: ,
                      // padding: 8,
                      // paddingLeft: 30,
                      // marginLeft: "50px",
                      // marginRight: "75px",
                      borderRadius: 100,
                    }}
                  >
                    {/* <h2>Parawise Report</h2> */}
                    <h2
                      style={{
                        color: "white",
                      }}
                    >
                      <FormattedLabel id="parawiseReport" />
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
                          disabled
                          sx={{
                            width: "86%",
                            marginLeft: "6vw",
                          }}
                          id="standard-basic"
                          variant="standard"
                          multiline
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

                      {/* Notice details in Marathi */}
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
                          disabled
                          sx={{
                            width: "86%",
                            marginLeft: "6vw",
                          }}
                          id="standard-basic"
                          variant="standard"
                          multiline
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.noticeDetails}
                          helperText={
                            errors?.noticeDetails
                              ? errors.noticeDetails.message
                              : null
                          }
                          size="small"
                          {...register("noticeDetailsMr")}
                          label={<FormattedLabel id="noticeDetailsMr" />}
                        />
                      </Grid>

                      {/* <Grid
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
                          disabled
                          sx={{
                            width: "86%",
                            marginLeft: "6vw",
                          }}
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
                          label={<FormattedLabel id="noticeDetailsMr" />}
                        />
                      </Grid> */}
                    </Grid>
                    {/* <Grid container style={{ padding: "10px", paddingLeft: "5vh", paddingRight: "5vh" }}>
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
                    </Grid> */}
                  </div>
                </ThemeProvider>

                {/* Notice History */}
                {/* <div style={{ marginBottom: "5vh" }}>
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
                </div> */}
                {/* Reassign Remark by Depart HOD */}
                {router?.query?.status === "PARAWISE_REPORT_REASSIGNED" && (
                  <Grid
                    container
                    sx={{
                      padding: "10px",
                      marginLeft: "5vw",
                    }}
                  >
                    {/* {watch("parawiseRejectionRemarkHodEnglish") != undefined &&
                    watch("parawiseRejectionRemarkHodEnglish") != null &&
                    watch("parawiseRejectionRemarkHodEnglish") != "" && ( */}
                    <Grid
                      item
                      sx={
                        {
                          // width: "50%",
                        }
                      }
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <TextField
                        style={{
                          width: "90%",
                        }}
                        multiline
                        variant="standard"
                        fullWidth
                        disabled
                        label={<FormattedLabel id="hodRemarksEn" />}
                        {...register("parawiseRejectionRemarkHodEnglish")}
                        // error={!!errors?.caseFees}
                        // helperText={errors?.caseFees ? errors?.caseFees?.message : null}
                        InputLabelProps={{
                          shrink:
                            watch("caseFees") == "" || null ? false : true,
                        }}
                      />
                    </Grid>
                    {/* // )} */}
                    <Grid
                      item
                      sx={{
                        width: "100%",
                        marginTop: "10vh",
                      }}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <TextField
                        style={{
                          width: "90%",
                        }}
                        multiline
                        variant="standard"
                        fullWidth
                        disabled
                        label={<FormattedLabel id="hodRemarksMr" />}
                        {...register("parawiseRejectionRemarkHodMarathi")}
                        // error={!!errors?.caseFees}
                        // helperText={errors?.caseFees ? errors?.caseFees?.message : null}
                        InputLabelProps={{
                          shrink:
                            watch("caseFees") == "" || null ? false : true,
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                {/*  */}

                {/* Notice Attachment */}
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

                {/* <h1>Parawise Remark</h1> */}

                <div
                  style={{
                    backgroundColor: "#556CD6",
                    color: "white",
                    fontSize: 19,
                    marginTop: 30,
                    marginBottom: 30,
                    padding: 8,
                    paddingLeft: 30,
                    marginLeft: "10px",
                    // marginRight: "50px",
                    borderRadius: 100,
                  }}
                >
                  {/* <strong>Parawise Remark</strong> */}
                  <strong>
                    <FormattedLabel id="parawiseRemark" />
                  </strong>
                </div>

                <Box
                  sx={{
                    border: "0.1rem outset black",
                    marginTop: "10px",
                  }}
                >
                  <Grid
                    sx={
                      {
                        // background:"#CCCCFF	"
                        // background:"#33CCFF"
                        // background:"##E6E6FA"
                        //  background:"	#E0FFFF"
                      }
                    }
                    className={styles.theme1}
                    container
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
                      {/* <h3>Point No</h3> */}
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
                      {/* <h3>Points Explanation (Parawise)</h3> */}
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
                    >
                      <Button
                        // variant="primary"
                        onClick={() =>
                          append({
                            // srNO: "",
                            issueNo: "",
                            answerInEnglish: "",
                            answerInMarathi: "",
                          })
                        }
                        // color="white"
                        // color="#e0e0e0"
                        style={{
                          // background: " #555555",
                          backgroundColor: "LightGray",
                          // background: "#e7e7e7",
                          // border: "2px solid #4CAF50",
                          // opacity: 1,
                          // background:"	#87CEEB",
                          border: "4px solid",
                          height: "30px",
                        }}
                      >
                        {/* ADD */}
                        <FormattedLabel id="add" />
                        {/* + */}
                      </Button>
                    </Grid>
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
                    {fields &&
                      fields.map((parawise, index) => {
                        return (
                          <>
                            <Grid
                              container
                              className={styles.theme2}
                              component={Box}
                              style={{ marginTop: 20 }}
                            >
                              {/* <Grid item xs={0.1}></Grid> */}

                              <Grid
                                item
                                xs={2.4}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <TextField
                                  placeholder="Parawise No"
                                  // placeholder={<FormattedLabel id="issueNo"/>}

                                  height={500}
                                  // size="small"
                                  // type="number"
                                  // oninput="auto_height(this)"
                                  {...register(
                                    `parawiseReportDao.${index}.issueNo`
                                  )}
                                  key={parawise.id}
                                  error={
                                    !!errors?.parawiseReportDao?.[index]
                                      ?.issueNo
                                  }
                                  helperText={
                                    errors?.parawiseReportDao?.[index]?.issueNo
                                      ? errors?.parawiseReportDao?.[index]
                                          ?.issueNo.message
                                      : null
                                  }
                                ></TextField>
                              </Grid>

                              {/* <Grid item xs={0.2}></Grid> */}
                              {/* para for Marathi */}
                              <Grid
                                item
                                xs={3.4}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={5}
                                  placeholder="Paragraph Wise Aanswer Draft Of Issues(In Marathi)"
                                  size="small"
                                  {...register(
                                    `parawiseReportDao.${index}.answerInMarathi`
                                  )}
                                  style={{
                                    // background:"red"

                                    border: "1px solid",
                                    // width: "100%",
                                  }}
                                  key={parawise.id}
                                  error={
                                    !!errors?.parawiseReportDao?.[index]
                                      ?.answerInMarathi
                                  }
                                  helperText={
                                    errors?.parawiseReportDao?.[index]
                                      ?.answerInMarathi
                                      ? errors?.parawiseReportDao?.[index]
                                          ?.answerInMarathi.message
                                      : null
                                  }
                                ></TextField>
                                {/* <Box 
                                  sx={{
                                    border: "1px solid ",
                                    width: "100%",
                                    // height:"10%"
                                  }}
                                > */}
                                {/* <Transliteration
                                    _key={"answerInMarathi"}
                                    labelName={"answerInMarathi"}
                                    fieldName={`parawiseReportDao.${index}.answerInMarathi`}
                                    updateFieldName={`parawiseReportDao.${index}.answerInEnglish`}
                                    sourceLang={"mar"}
                                    targetLang={"eng"}
                                    // disabled={disabled}
                                    label={
                                      <FormattedLabel
                                        id="parawiseAnsMr"
                                        required
                                      />
                                    }
                                    // placeholder:""
                                    error={
                                      !!errors?.parawiseReportDao?.[index]
                                        ?.answerInMarathi
                                    }
                                    helperText={
                                      errors?.parawiseReportDao?.[index]
                                        ?.answerInMarathi
                                        ? errors?.parawiseReportDao?.[index]
                                            ?.answerInMarathi.message
                                        : null
                                    }
                                  /> */}
                                {/* </Box> */}

                                {/* Transliteration */}
                              </Grid>

                              {/* <Grid item xs={0.3}></Grid> */}
                              <Grid
                                item
                                sx={{
                                  marginTop: "5vh",
                                  marginLeft: "1vw",
                                }}
                                xs={1}
                                // style={{
                                //   display: "flex",
                                //   justifyContent: "center",
                                //   alignItems: "center",
                                // }}
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={{
                                    // marginTop: "1vh",
                                    marginLeft: "1vw",
                                  }}
                                  onClick={() =>
                                    remarkApi(
                                      watch(
                                        `parawiseReportDao.${index}.answerInEnglish`
                                      ),
                                      `parawiseReportDao.${index}.answerInMarathi`,
                                      "en"
                                    )
                                  }
                                >
                                  <FormattedLabel id="mar" />
                                </Button>

                                {/* Marathi */}
                                <Button
                                  variant="contained"
                                  size="small"
                                  sx={{
                                    marginTop: "1vh",
                                    marginLeft: "1vw",
                                  }}
                                  onClick={() =>
                                    remarkApi(
                                      watch(
                                        `parawiseReportDao.${index}.answerInMarathi`
                                      ),
                                      `parawiseReportDao.${index}.answerInEnglish`,
                                      "mr"
                                    )
                                  }
                                >
                                  <FormattedLabel id="eng" />
                                </Button>
                              </Grid>

                              {/* para for english */}

                              {/* New  */}
                              <Grid
                                item
                                xs={3.4}
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={5}
                                  placeholder="Paragraph Wise Aanswer Draft Of Issues(In English)"
                                  size="small"
                                  {...register(
                                    `parawiseReportDao.${index}.answerInEnglish`
                                  )}
                                  style={{
                                    // background:"red"

                                    border: "1px solid",
                                    // width: "100%",
                                  }}
                                  key={parawise.id}
                                  error={
                                    !!errors?.parawiseReportDao?.[index]
                                      ?.answerInEnglish
                                  }
                                  helperText={
                                    errors?.parawiseReportDao?.[index]
                                      ?.answerInEnglish
                                      ? errors?.parawiseReportDao?.[index]
                                          ?.answerInEnglish.message
                                      : null
                                  }
                                ></TextField>

                                {/* Transliteration */}
                                <Box
                                  sx={{
                                    border: "1px solid ",
                                    // width: "100%",
                                    // height:"10%"

                                    // multiline
                                    // rows={5}
                                  }}
                                >
                                  {/* <Transliteration
                                    multiline
                                    rows={5}
                                    _key={"answerInEnglish"}
                                    labelName={"answerInEnglish"}
                                    fieldName={`parawiseReportDao.${index}.answerInEnglish`}
                                    updateFieldName={`parawiseReportDao.${index}.answerInMarathi`}
                                    sourceLang={"eng"}
                                    targetLang={"mar"}
                                    // disabled={disabled}
                                    label={
                                      <FormattedLabel
                                        id="parawiseAnsEn"
                                        required
                                      />
                                    }
                                    error={
                                      !!errors?.parawiseReportDao?.[index]
                                        ?.answerInEnglish
                                    }
                                    helperText={
                                      errors?.parawiseReportDao?.[index]
                                        ?.answerInEnglish
                                        ? errors?.parawiseReportDao?.[index]
                                            ?.answerInEnglish.message
                                        : null
                                    }
                                  /> */}
                                </Box>
                              </Grid>

                              {/* <Grid item xs={0.4}></Grid> */}

                              <Grid
                                item
                                xs={1.4}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<DeleteIcon />}
                                  style={{
                                    color: "white",
                                    backgroundColor: "red",
                                  }}
                                  onClick={() => {
                                    // remove({
                                    //   applicationName: "",
                                    //   roleName: "",
                                    // });
                                    remove(index);
                                  }}
                                >
                                  {/* Delete */}
                                  <FormattedLabel id="delete" />
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        );
                      })}
                    {/* </ThemeProvider> */}
                  </Box>
                </Box>

                {/* <div style={{ marginBottom: "5vh" }}>
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
                </div> */}
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
                  <strong>Parawise Remark</strong>
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
                <Stack
                  sx={{
                    marginTop: "10px",
                  }}
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
                  marginTop="5"
                >
                  <Button
                    variant="contained"
                    size="small"
                    type="submit"
                    //onClick={() => submitParaWiseReport()}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Approve"
                    endIcon={<TaskAltIcon />}
                  >
                    {/* Submit */}
                    <FormattedLabel id="submit" />
                  </Button>
                  {/** 
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleOpen("Reassign")}
                    sx={{ backgroundColor: "#00A65A" }}
                    name="Reassign"
                    endIcon={<UndoIcon />}
                  >
                    Reassign
                  </Button>
                  */}
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
                    <Box sx={style}>
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
                          size="small"
                          {...register("remark")}
                          label={<FormattedLabel id="enterRemarkEn" />}
                        />
                      </Box>

                      {/* remarks in Marathi */}
                      <Box
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {/* remarks in Marathi */}
                        <TextField
                          fullWidth
                          size="small"
                          {...register("remarkMr")}
                          label={<FormattedLabel id="enterRemarkMr" />}
                        />
                      </Box>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          padding: "10px",
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

export default ParawiseEntry;
