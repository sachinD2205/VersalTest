import { Visibility } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import { toast } from "react-toastify";
import sweetAlert from "sweetalert";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import FileTable from "../../FileUpload/FileTableLcWithoutAddButton";
import { Schema } from "../../../../containers/schema/LegalCaseSchema/noticeApprovalSchema";
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
  width: "70%",
  height: "60%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

//
const NoticeApproval = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(Schema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    // methods,
    reset,
    clearErrors,
    formState: { errors },
  } = methods;
  // useForm({
  //   resolver: yupResolver(Schema),
  // });
  const handleClose = () => setOpen(false);
  const router = useRouter();
  const [rowsData, setRowsData] = useState([]);
  const noticeData = useSelector((state) => state.user.selectedNotice);
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [open, setOpen] = useState(false);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [approveRejectRemarkMode, setApproveRejectRemarkMode] = useState("");
  const handleOpen = (approveRejectRemarkMode) => {
    setOpen(true);
    setApproveRejectRemarkMode(approveRejectRemarkMode);
  };
  const [departments, setDepartments] = useState([]);
  const [_departmentList, _setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  // const [noticeData, setNoticeData] = useState();
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state.labels.language);
  const [userData, setUserData] = useState();

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
  //         callCatchMethod(error, language);
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
  //         callCatchMethod(error, language);
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
  // columns - attachment
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

  // columns -- Remark History
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
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "remark",
      headerName: <FormattedLabel id="remarks" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  // concerDept
  const _col = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      // field: "locationName",
      field: language === "en" ? "locationNameEn" : "locationNameMr",

      // locationNameMar
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      // field: "departmentId",
      // departmentNameMr
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",

      headerName: <FormattedLabel id="subDepartment" />,
      // type: "number",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
  ];

  // userName
  const getUserName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/user/getUserBasicDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setEmployeeList(r.data.userList);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

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
  // designation Name
  const getDesignationName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/designation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setDesignationList(r.data.designation);
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

  // department Name
  const getDepartmentName = async () => {
    await axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setDepartments(r.data.department);
          _setDepartmentList(r.data.department);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // submit
  const onFinish = (data) => {
    let bodyForApiApproveTrnNoticeByLegalHod;
    if (approveRejectRemarkMode == "Reassign") {
      bodyForApiApproveTrnNoticeByLegalHod = {
        id: noticeData?.id,
        // hodRejectionRemark: data?.remark,
        // hodRejectionRemarkMr: data?.remarkMr,
        hodRejectionRemark: data?.remark,

        hodRejectionRemarkMr: data?.remarkMr,
      };
    }
    if (approveRejectRemarkMode == "Approve") {
      bodyForApiApproveTrnNoticeByLegalHod = {
        id: noticeData?.id,
        hodApprovalRemark: data?.remark,
        hodApprovalRemarkMr: data?.remarkMr,

        // hodRejectionRemark: data?.remark,
        // hodRejectionRemarkMr: data?.remarkMr,
      };
    } else {
      bodyForApiApproveTrnNoticeByLegalHod = {
        id: noticeData?.id,
        // hodApprovalRemark: data?.remark,
        // hodApprovalRemarkMr: data?.remarkMr,

        hodRejectionRemark: data?.remark,
        hodRejectionRemarkMr: data?.remarkMr,
      };
    }

    // const bodyForApiApproveTrnNoticeByLegalHod = {
    //   id: noticeData?.id,
    //   hodApprovalRemark: data?.remark,
    //   hodApprovalRemarkMr: data?.remarkMr,
    // };

    console.log(
      "bodyForApiApproveTrnNoticeByLegalHod",
      bodyForApiApproveTrnNoticeByLegalHod
    );
    if (approveRejectRemarkMode == "Reassign") {
      axios
        .post(
          `${urls.LCMSURL}/notice/reassignTrnNoticeByLegalHod`,
          bodyForApiApproveTrnNoticeByLegalHod,
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
                ? "Notice send successfully"
                : "सूचना यशस्वीरित्या पाठवा",
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
          `${urls.LCMSURL}/notice/approveTrnNoticeByLegalHod`,
          bodyForApiApproveTrnNoticeByLegalHod,
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
  };

  useEffect(() => {
    getDepartmentName();
    getOfficeLocation();
    getDesignationName();
    getUserName();
    // setNoticeData(selectedNotice);
    setUserData(user);
  }, []);

  useEffect(() => {
    setLoading(true);
    console.log("noticeData", noticeData);
    setValue("noticeRecivedDate", noticeData?.noticeRecivedDate);
    setValue(
      "noticeDate",
      moment(noticeData?.noticeDate, "DD-MM-YYYY")?.format("YYYY-MM-DD")
    );
    // setValue("noticeDate", noticeData?.noticeDate);
    // setValue(
    //   "noticeDate",
    //   moment(noticeData?.noticeDate).format("YYYY-MM-DDThh:mm:ss")
    // );
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

    setRowsData(_ress);
  }, [officeLocationList, departments, noticeData, user]);

  useEffect(() => {
    const noticeAttachment = [...noticeData.noticeAttachment];
    const noticeHisotry = [...noticeData.noticeHisotry];
    if (employeeList?.length > 0 && departments.length > 0) {
      setLoading(false);
      let _noticeAttachment = noticeAttachment.map((file, index) => {
        console.log("23", file);
        return {
          id: file.id,
          srNo: file.id,
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

      let _noticeHisotry = noticeHisotry.map((file, index) => {
        console.log("24", departments, file);
        return {
          id: index,
          srNo: index + 1,
          remark: file.remark ? file.remark : "-",
          designation: file.designation ? file.designation : "Not Available",

          noticeRecivedFromPerson: employeeList.find(
            (obj) => obj.id === file.noticeRecivedFromPerson
          )?.firstNameEn
            ? employeeList.find(
                (obj) => obj.id === file.noticeRecivedFromPerson
              )?.firstNameEn
            : "-",
          department: departments?.find(
            (obj) => obj.id === file.noticeRecivedFromPerson
          )?.department,
          noticeSentDate: file.noticeSentDate ? file.noticeSentDate : "-",
        };
      });
      _noticeAttachment !== null && setMainFiles([..._noticeAttachment]);
      _noticeHisotry !== null && setDataSource([..._noticeHisotry]);
    }
  }, [employeeList, departments]);

  useEffect(() => {
    console.log("Language bol: ", language);
    console.log("Files:", mainFiles, additionalFiles);
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

  useEffect(() => {}, [approveRejectRemarkMode]);

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

      <Paper
        sx={{
          margin: 3,
          padding: 2,
        }}
        elevation={5}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh", // Adjust itasper requirement.
            }}
          >
            <Paper
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "white",
                borderRadius: "50%",
                padding: 8,
              }}
              elevation={8}
            >
              <CircularProgress color="success" />
            </Paper>
          </div>
        ) : (
          <>
            <div
              style={{
                // backgroundColor: "#0084ff",
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

            <div style={{ marginBottom: "5vh" }}>
              <ThemeProvider theme={theme}>
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
                                <span style={{ fontSize: 16, marginTop: 2 }}>
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
                      disabled
                      id="standard-basic"
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
                      disabled
                      id="standard-basic"
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
                                <span style={{ fontSize: 16, marginTop: 2 }}>
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
                                <span style={{ fontSize: 16, marginTop: 2 }}>
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
                      // fullWidth
                      multiline
                      disabled
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
                      // fullWidth
                      multiline
                      disabled
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
                      {...register("noticeDetailsMr")}
                      label={<FormattedLabel id="noticeDetailsMr" />}
                    />
                  </Grid>
                </Grid>

                <div
                  style={{
                    // backgroundColor: "#0084ff",
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
                    <FormattedLabel id="concernedDepartmentList" />
                  </strong>
                </div>

                <Grid
                  container
                  style={{
                    padding: "10px",
                    paddingLeft: "5vh",
                    paddingRight: "5vh",
                  }}
                >
                  <DataGrid
                    getRowId={(row) => row.srNo}
                    density="compact"
                    autoHeight={true}
                    pagination
                    paginationMode="server"
                    rows={rowsData}
                    columns={_col}
                    onPageChange={(_data) => {}}
                    onPageSizeChange={(_data) => {}}
                  />
                </Grid>
              </ThemeProvider>
            </div>

            <div style={{ marginBottom: "5vh" }}>
              <div
                style={{
                  // backgroundColor: "#0084ff",
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
                  rows={dataSource}
                  columns={_columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  //checkboxSelection
                />
              </Grid>
            </Grid>
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
              marginTop="5"
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
                        fullWidth
                        multiline
                        size="small"
                        {...register("remark")}
                        label={<FormattedLabel id="enterRemarkEn" />}
                        error={!!errors.remark}
                        helperText={
                          errors?.remark ? errors.remark.message : null
                        }
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
                          // marginTop: "10px",
                          marginLeft: "1vw",
                          height: "6vh",
                          width: "9vw",
                        }}
                        onClick={() =>
                          remarkApi(watch("remark"), "remarkMr", "en")
                        }
                      >
                        <FormattedLabel id="mar" />
                      </Button>
                      {/* <Transliteration
                        _key={"remark"}
                        labelName={"remark"}
                        fieldName={"remark"}
                        updateFieldName={"remarkMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        // disabled={disabled}
                        label={<FormattedLabel id="enterRemarkEn" required />}
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
                        width: "100%",
                      }}
                    >
                      {/* remarks in Marathi */}
                      <TextField
                        fullWidth
                        multiline
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
                          // marginTop: "10px",
                          marginLeft: "1vw",
                          height: "6vh",
                          width: "9vw",
                        }}
                        onClick={() =>
                          remarkApi(watch("remarkMr"), "remark", "mr")
                        }
                      >
                        <FormattedLabel id="eng" />
                      </Button>

                      {/* <Transliteration
                        required
                        _key={"remarkMr"}
                        labelName={"remarkMr"}
                        fieldName={"remarkMr"}
                        updateFieldName={"remark"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        // disabled={disabled}
                        label={<FormattedLabel id="enterRemarkMr" />}
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
                        marginTop: "5vh",
                      }}
                    >
                      <Button variant="contained" size="small" type="submit">
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
    </>
  );
};

export default NoticeApproval;
