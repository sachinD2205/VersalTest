import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
import urls from "../../../../URLS/urls";
import FileTable from "../../FileUpload/FileTable";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import * as yup from "yup";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const Index = () => {
  // Schema
  const language = useSelector((state) => state.labels.language);
  const [loadderState, setLoadderState] = useState(false);

  // Handle cathch method to display Error sweetalert
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

  // Schema
  const generateSchema = (language) => {
    const baseSchema = yup.object({
      // other
      opinionSubmisionDate: yup
        .date()
        .typeError(<FormattedLabel id="selectDate" />)
        .required(<FormattedLabel id="opinionSubmissionDate" />),
    });

    if (language === "en") {
      return baseSchema.shape({
        hodReassignRemarkEn: yup
          .string()
          .required(<FormattedLabel id="enterRemarks" />)
          .nullable()
          .matches(
            /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?\'\–]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),
      });
    } else if (language === "mr") {
      return baseSchema.shape({
        hodReassignRemarkMr: yup
          .string()
          .required(<FormattedLabel id="enterRemarks" />)
          .nullable()
          .matches(
            // /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?\'\–]*$/,
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\'\?\'\–]*$/,

            "Must be only marathi characters/ फक्त मराठी शब्द"
          ),
      });
    } else {
      return baseSchema;
    }
  };
  // const language = useSelector((state) => state?.labels?.language);
  const schema = generateSchema(language);

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = methods;
  // const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [courtNames, setCourtNames] = useState([]);
  const [advocateNames, setAdvocateNames] = useState([]);
  const [id, setId] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);
  const [btnSaveText, setBtnSaveText] = useState("Save");

  const [isOpenCollapse1, setIsOpenCollapse1] = useState(false);
  const [isOpenCollapse2, setIsOpenCollapse2] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [personName, setPersonName] = React.useState([]);
  const token = useSelector((state) => state.user.user.token);

  const [personName1, setPersonName1] = React.useState([]);

  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [attachedFile, setAttachedFile] = useState("");
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [buttonText, setButtonText] = useState(null);
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState("submit");

  const [displayOpinionDetails, setDisplayOpinionDetails] = useState("");
  const [showDocketSubDetailsModel, setShowDocketSubDetailsModel] =
    useState(false);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log("31", value);
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  //Documents view----------------------------------------------------------------
  // const viewFile = (filePath) => {
  //   console.log("filePath", filePath);

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

  // For hodReassignRemarkEnApi

  // --------------------------Transaltion API--------------------------------
  const hodReassignRemarkEnApi = (
    currentFieldInput,
    updateFieldName,
    languagetype
  ) => {
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
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAdvocateNames(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            advocateName: r.firstName + " " + r.middleName + " " + r.lastName,
            advocateNameMr:
              r.firstNameMr + " " + r.middleNameMr + " " + r.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, []);
  useEffect(() => {
    //  reset(router.query)
    axios
      .get(
        `${urls.LCMSURL}/transaction/opinion/getById?id=${router?.query?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("ghfgf", r);

        reset(r.data);

        let _dataList = r?.data?.trnOpinionAttachmentDao?.map((val) => {
          console.log("wfdc", val);
          return {
            id: val.id,
            srNo: val.id,
            attachedDate: "2023-03-01",
            attachedNameEn: val?.attachedNameEn,
            // uploadedBy: val.attachmentNameEng ? val.attachmentNameEng : "-",
            // uploadedBy: val.attachedNameEn ? val.attachedNameEn : "-",
            attachedNameMr: val?.attachedNameMr,
            attachmentNameMr: null,
            extension: val.extension ? val.extension : "-",
            originalFileName: val.originalFileName ? val.originalFileName : "-",
            filePath: val.filePath,
          };
        });

        _dataList !== null && setMainFiles([..._dataList]);

        let _res = r.data.opinionAdvPanelList.map((r, i) => {
          return {
            srNo: i + 1,
            advocate: advocateNames?.find((a) => a?.id === r?.advocate)
              ?.advocateName,
            // advocateOpinion: r.opinion,
            advocateOpinion: r.opinion,
            advocateOpinionMr: r.opinionMr,
          };
        });
        // setData(_res)
        setData({
          rows: _res,
          totalRows: r.data.opinionAdvPanelList.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: 100,
          page: 0,
        });

        let _res1 = r.data.reportAdvPanelList.map((r, i) => {
          return {
            srNo: i + 1,
            advocate: advocateNames?.find((a) => a?.id === r?.advocate)
              ?.advocateName,
            // advocateOpinion: r.opinion,
            advocateOpinion: r.opinion,
            advocateOpinionMr: r.opinionMr,
          };
        });
        // setData(_res)
        setData1({
          rows: _res1,
          totalRows: r.data.reportAdvPanelList.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: 100,
          page: 0,
        });

        // console.log("getValues",getValues("opinionAdvPanelList"));
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
    // setId(router.query.id)
    //  getApproveOpinion()
  }, [router.query, advocateNames]);

  useEffect(() => {
    let _docs = [...additionalFiles]?.map((doc) => {
      return {
        srNo: doc?.srNo,
        attachedDate: doc?.attachedDate,
        attachedNameEn: doc?.attachedNameEn,
        attachedNameMr: doc?.attachedNameMr,
        extension: doc?.extension,
        filePath: doc?.filePath,
        originalFileName: doc?.originalFileName,
      };
    });
    setFinalFiles([...mainFiles, ..._docs]);
  }, [mainFiles, additionalFiles]);
  useEffect(() => {
    console.log("finalFiles", finalFiles);
  }, [finalFiles]);

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    console.log("31", value);
    setPersonName1(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const _columns = [
    // {
    //   headerName: "Sr.No",
    //   field: "srNo",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: "File Name",
      field: "originalFileName",
      // File: "originalFileName",
      width: 400,
      // flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 400,
    },
    {
      headerName: "Uploaded By",
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      width: 400,
      // width: 300,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 400,
      // flex: 1,

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
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  const checkBox1 = (e) => {
    // alert(e.target.value);
    if (e.target.checked == true) {
      // console.log("Checked ", e.target.value);
      setIsOpenCollapse1(true);
    } else if (e.target.checked == false) {
      // console.log(" Un Checked ", e.target.value);
      setIsOpenCollapse1(false);
    }
  };

  const checkBox2 = (e) => {
    if (e.target.checked == true) {
      setIsOpenCollapse2(true);
    } else if (e.target.checked == false) {
      setIsOpenCollapse2(false);
    }
  };

  // For Paginantion
  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [data1, setData1] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getDeptName();
    getOfficeName();
  }, []);

  useEffect(() => {
    // getAllOpinion();
  }, [concenDeptNames, officeName]);

  useEffect(() => {
    console.log("advocateName", advocateNames);
  }, []);

  // Save DB

  const onSubmitForm = (Data) => {
    console.log("data", Data);
    let _updatedAttachment = additionalFiles?.map((doc) => {
      return {
        id: null,
        opinionId: Data?.id,
        attachedDate: doc?.attachedDate,
        attachedNameMr: doc?.attachedNameMr,
        attachedNameEn: doc?.attachedNameEn,
        extension: doc?.extension,
        filePath: doc?.filePath,
        originalFileName: doc?.originalFileName,
      };
    });

    let body = {
      ...Data,
      trnOpinionAttachmentDao: [
        ...Data?.trnOpinionAttachmentDao,
        ..._updatedAttachment,
      ],

      role: "OPINION_APPROVAL",

      status:
        buttonText === "reassign" ? "OPINION_REASSIGNED" : "OPINION_APPROVED",

      role: buttonText === "reassign" ? "OPINION_REASSIGN" : "OPINION_APPROVAL",
    };
    // status: buttonText === "reassign" ? "OPINION_REASSIGNED" : "OPINION_APPROVED",

    console.log("___body", body);
    setLoadderState(true);

    axios
      .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoadderState(false);

        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert(
            // "Saved!"
            language === "en" ? "Saved!" : "जतन केले!",

            //  "Record Submitted successfully !"
            language === "en"
              ? "Record Submitted successfully !"
              : "रेकॉर्ड यशस्वीरित्या सबमिट केले!",
            "success"
          );
          router.push(`/LegalCase/transaction/opinion`);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Reassign
  // const reassign =(Data) =>{

  //   let body = {
  //     ...Data,
  //    role: "OPINION_REASSIGN",
  //   };
  //   axios
  //   .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //   .then((res) => {
  //     console.log("res123", res);
  //     if (res.status == 200) {
  //       sweetAlert("Saved!", "Record Submitted successfully !", "success");
  //       router.push(`/LegalCase/transaction/opinion`);
  //     }
  //   });
  // }
  const getDeptName = () => {
    // alert("HEllo");
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setconcenDeptName(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            departmentMr: r.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // get Location Name

  const getOfficeName = () => {
    axios
      .get(`${urls.CFCURL}/master/mstOfficeLocation/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("ghfgf", res);
        setOfficeName(
          res.data.officeLocation.map((r, i) => ({
            id: r.id,
            officeLocationName: r.officeLocationName,
            officeLocationNameMr: r.officeLocationNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  //Delete By ID

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                // getAllOpinion();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.LCMSURL}/transaction/opinion/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                // getSubType()
                // getAllOpinion();
              }
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  //

  const ExpandableCell = ({ value }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div>
        {expanded ? value : value.slice(0, 40)}{" "}
        {value.length > 40 && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Link
            type="button"
            component="button"
            onClick={() => setExpanded(!expanded)}
          >
            <FormattedLabel id={expanded ? "viewLess" : "viewMore"} />
          </Link>
        )}
      </div>
    );
  };

  const columns = [
    {
      headerName: "Sr.No",
      field: "srNo",
      width: 200,
    },

    {
      // headerName: <FormattedLabel id="opinionRequestDate" />,
      headerName: "Advocate Name",
      field: "advocate",
      width: 400,
    },

    {
      // headerName: <FormattedLabel id="locationName" />,
      headerName: "Advocate Opinion",
      field: "advocateOpinion",
      width: 700,
      // renderCell: (params) => <ExpandableCell {...params} />,
      renderCell: (params) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            console.log(":a2", params?.row?.advocateOpinion);

            setDisplayOpinionDetails(params?.row?.advocateOpinion);
            setShowDocketSubDetailsModel(true);
          }}
        >
          <span>{params?.row?.advocateOpinion}</span>
        </div>
      ),
    },
  ];

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
      {/* Loader */}
      {loadderState ? (
        <Loader />
      ) : (
        <>
          <div>
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Paper
                  elevation={8}
                  variant="outlined"
                  sx={{
                    border: 1,
                    borderColor: "grey.500",
                    marginLeft: "10px",
                    marginRight: "10px",
                    marginTop: "10px",
                    marginBottom: "60px",
                    padding: 1,
                  }}
                >
                  <Box
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
                      {" "}
                      <FormattedLabel id="hodOpinion" />
                      {/* Opinion approval For Clerk */}
                    </h2>
                  </Box>
                  <Divider />

                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "right",
                        marginTop: 10,
                      }}
                    ></div>

                    {/* First Row */}

                    <Grid container sx={{ padding: "10px" }}>
                      {/* <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled
                label="Court Case Number"
                variant="standard"
                maxRows={4}
                style={{ width: 200 }}
                {...register("caseNumber")}
                InputLabelProps={{
                  shrink: //true
                    (watch("caseNumber") ? true : false) ||
                    (router.query.caseNumber ? true : false),
                }}
              />
            </Grid> */}

                      {/* Filed By */}
                      {/* <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                //// required
                style={{ width: 200 }}
                variant="standard"
                disabled
                label={<FormattedLabel id="filedBy" />}
                {...register("filedBy")}

                InputLabelProps={{
                  shrink: //true
                    (watch("filedBy") ? true : false) ||
                    (router.query.filedBy ? true : false),
                }}
              />
            </Grid> */}

                      {/* Case Details */}
                      {/* <Grid
              item
              xs={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <TextField
                id="standard-textarea"
                label={<FormattedLabel id="caseDetails" />}
                placeholder="Placeholder"
                multiline
                disabled
                style={{ width: 200 }}
                variant="standard"
                {...register("caseDetails")}
                InputLabelProps={{
                  shrink: //true
                    (watch("caseDetails") ? true : false) ||
                    (router.query.caseDetails ? true : false),
                }}
              />
            </Grid> */}
                    </Grid>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xl={3}
                        lg={3}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          disabled
                          variant="standard"
                          style={{ marginTop: 10 }}
                          error={!!errors.opinionRequestDate}
                        >
                          <Controller
                            // variant="standard"
                            control={control}
                            disabled
                            name="opinionRequestDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  // disabled={router?.query?.pageMode === "View"}
                                  disabled
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      {/* Opinion Request Date */}

                                      {
                                        <FormattedLabel id="opinionRequestDate" />
                                      }
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    )
                                  }
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      disabled
                                      size="small"
                                      variant="standard"
                                      sx={{ width: 230 }}
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },

                                        //true
                                        shrink:
                                          (watch("opinionRequestDate")
                                            ? true
                                            : false) ||
                                          (router.query.opinionRequestDate
                                            ? true
                                            : false),
                                      }}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.opinionRequestDate
                              ? errors.opinionRequestDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Location Name */}

                      <Grid
                        item
                        xl={3}
                        lg={3}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          disabled
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}

                            {<FormattedLabel id="locationName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                sx={{ width: 230 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="locationName" />}
                                InputLabelProps={{
                                  //true
                                  shrink:
                                    (watch("locationName") ? true : false) ||
                                    (router.query.locationName ? true : false),
                                }}
                              >
                                {officeName &&
                                  officeName.map(
                                    (officeLocationName, index) => (
                                      <MenuItem
                                        key={index}
                                        value={officeLocationName.id}
                                      >
                                        {language == "en"
                                          ? officeLocationName?.officeLocationName
                                          : officeLocationName?.officeLocationNameMar}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="officeLocation"
                            control={control}
                            defaultValue=""
                          />
                          {/* <FormHelperText>
                          {errors?.concenDeptId
                            ? errors.concenDeptId.message
                            : null}
                        </FormHelperText> */}
                        </FormControl>
                      </Grid>

                      {/** Concern Department ID */}
                      <Grid
                        item
                        xl={3}
                        lg={3}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl
                          disabled
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: 1, minWidth: 120 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="deptName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                sx={{ width: 230 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="deptName" />}
                                InputLabelProps={{
                                  //true
                                  shrink:
                                    (watch("concenDeptId") ? true : false) ||
                                    (router.query.concenDeptId ? true : false),
                                }}
                              >
                                {concenDeptNames &&
                                  concenDeptNames.map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {/* {department.department}
                                       */}

                                      {language == "en"
                                        ? department?.department
                                        : department?.departmentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="concenDeptId"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.concenDeptId
                              ? errors.concenDeptId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      sx={{
                        marginTop: "10vh",
                        marginLeft: "3vw",
                      }}
                    >
                      <Grid
                        item
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        sx={{
                          display: "flex",
                          // justifyContent: "center",
                          // alignItems: "center",
                        }}
                      >
                        <TextField
                          // disabled={router?.query?.pageMode === "View"}
                          disabled
                          sx={{
                            width: "90%",
                          }}
                          id="standard-textarea"
                          // label="Opinion Subject"
                          label={<FormattedLabel id="opinionSubject" />}
                          placeholder="Opinion Subject"
                          multiline
                          variant="standard"
                          // style={{ width: 200 }}
                          {...register("opinionSubject")}
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("opinionSubject") ? true : false) ||
                              (router.query.opinionSubject ? true : false),
                          }}
                          error={!!errors.opinionSubject}
                          helperText={
                            errors?.opinionSubject
                              ? errors.opinionSubject.message
                              : null
                          }
                        />
                      </Grid>
                    </Grid>

                    {/* </Paper> */}

                    <Box
                      // style={{
                      //   display: "flex",
                      //   justifyContent: "center",
                      //   paddingTop: "10px",
                      //   marginTop: "40px",
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
                        marginTop: 30,
                        // marginBottom: "8vh",
                        marginTop: "7vh",
                        marginBottom: "1vh",
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
                        {" "}
                        <FormattedLabel id="opinionForPanelAdvocate" />
                        {/* Opinion For Panel Advocate */}
                        {/* Panel Advocate Opinion */}
                      </h2>
                    </Box>

                    <Box
                      sx={{
                        height: 250,
                      }}
                    >
                      <DataGrid
                        getRowId={(row) => row.srNo}
                        // disableColumnFilter
                        // disableColumnSelector
                        // disableToolbarButton
                        // disableDensitySelector
                        // components={{ Toolbar: GridToolbar }}
                        // componentsProps={{
                        //   toolbar: {
                        //     showQuickFilter: true,
                        //     quickFilterProps: { debounceMs: 500 },
                        //     printOptions: { disableToolbarButton: true },

                        //     csvOptions: { disableToolbarButton: true },
                        //   },
                        // }}
                        autoHeight
                        sx={{
                          // marginLeft: 5,
                          // marginRight: 5,
                          // marginTop: 5,
                          // marginBottom: 5,

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
                        // density="compact"
                        getEstimatedRowHeight={() => 50}
                        // autoHeight={true}
                        // rowHeight={50}
                        pagination
                        paginationMode="server"
                        // loading={data.loading}
                        rowCount={data.totalRows}
                        rowsPerPageOptions={data.rowsPerPageOptions}
                        page={data.page}
                        pageSize={data.pageSize}
                        rows={data.rows}
                        columns={columns}
                        onPageChange={(_data) => {
                          // getCaseType(data.pageSize, _data);
                          // getAllOpinion(data.pageSize, _data);
                        }}
                        onPageSizeChange={(_data) => {
                          console.log("222", _data);
                          // updateData("page", 1);
                          // getAllOpinion(_data, data.page);
                        }}
                      />
                    </Box>

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
                        // fontSize: 19,
                        marginTop: 30,
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "center",
                        // marginTop: ,
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
                        {" "}
                        <FormattedLabel id="opinionForSearchTitleReport" />
                        {/* Opinion For Report Title Advocate */}
                      </h2>
                    </Box>

                    <Box
                      sx={{
                        height: 250,
                        // width: 1000,
                        // marginLeft: 10,

                        // width: '100%',

                        // overflowX: 'auto',
                      }}
                    >
                      <DataGrid
                        getRowId={(row) => row.srNo}
                        autoHeight
                        sx={{
                          // marginLeft: 5,
                          // marginRight: 5,
                          // marginTop: 5,
                          // marginBottom: 5,

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
                        // density="compact"
                        getEstimatedRowHeight={() => 50}
                        // autoHeight={true}
                        // rowHeight={50}
                        pagination
                        paginationMode="server"
                        // loading={data.loading}
                        rowCount={data1.totalRows}
                        rowsPerPageOptions={data1.rowsPerPageOptions}
                        page={data1.page}
                        pageSize={data1.pageSize}
                        rows={data1.rows}
                        columns={columns}
                        onPageChange={(_data1) => {
                          // getCaseType(data.pageSize, _data);
                          // getAllOpinion(data1.pageSize, _data1);
                        }}
                        onPageSizeChange={(_data1) => {
                          console.log("222", _data1);
                          // updateData("page", 1);
                          // getAllOpinion(_data1, data1.page);
                        }}
                      />
                    </Box>
                  </div>

                  <Grid
                    container
                    style={{ padding: "10px", backgroundColor: "white" }}
                  >
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography style={{ fontWeight: 900, fontSize: "20px" }}>
                        {language === "en"
                          ? "Opinion Attachment"
                          : "अभिप्राय अटॅचमेंट"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FileTable
                        appName="LCMS" //Module Name
                        serviceName={"L-Notice"} //Transaction Name
                        fileName={attachedFile} //State to attach file
                        filePath={setAttachedFile} // File state upadtion function
                        newFilesFn={setAdditionalFiles} // File data function
                        columns={_columns} //columns for the table
                        rows={finalFiles} //state to be displayed in table
                        uploading={setUploading}
                        showNoticeAttachment={router.query.showNoticeAttachment}
                      />
                    </Grid>
                  </Grid>

                  {/* Fourth Row */}
                  <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
                    <Grid
                      item
                      xs={12}
                      xl={12}
                      md={12}
                      sm={12}
                      sx={
                        {
                          // display: "flex",
                          // justifyContent: "center",
                          // alignItems: "center",
                          // border:'solid red'
                        }
                      }
                    >
                      <TextField
                        id="standard-textarea"
                        disabled
                        // label="Opinion"
                        label={<FormattedLabel id="opinionEn" />}
                        // placeholder="Opinion"
                        multiline
                        variant="standard"
                        fullWidth
                        {...register("clerkRemarkEn")}
                        InputLabelProps={{
                          //true
                          shrink:
                            (watch("clerkRemarkEn") ? true : false) ||
                            (router.query.clerkRemarkEn ? true : false),
                        }}
                        error={!!errors.clerkRemarkEn}
                        helperText={
                          errors?.clerkRemarkEn
                            ? errors.clerkRemarkEn.message
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
                        marginTop: "30px",
                        // display: "flex",
                        // justifyContent: "center",
                        // alignItems: "center",
                      }}
                    >
                      <TextField
                        id="standard-textarea"
                        disabled
                        // label="Opinion"
                        label={<FormattedLabel id="opinionMr" />}
                        // placeholder="Opinion"
                        multiline
                        variant="standard"
                        fullWidth
                        // style={{ width: 1000 , marginTop:"30px"}}
                        {...register("clerkRemarkMr")}
                        InputLabelProps={{
                          //true
                          shrink:
                            (watch("clerkRemarkEn") ? true : false) ||
                            (router.query.clerkRemarkEn ? true : false),
                        }}
                        error={!!errors.clerkRemarkEn}
                        helperText={
                          errors?.clerkRemarkEn
                            ? errors.clerkRemarkEn.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>

                  {/* HOD Opinion */}

                  <Grid container sx={{ padding: "10px" }}>
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
                      <TextField
                        sx={{
                          width: "87%",
                        }}
                        id="standard-textarea"
                        disabled={router?.query?.pageMode === "View"}
                        label={<FormattedLabel id="legalAdvisorOpinionEn" />}
                        multiline
                        variant="standard"
                        // style={{ width: 1000 }}
                        fullWidth
                        // {...register("hodRemarkEn")}hodReassignRemarkEn
                        {...register("hodReassignRemarkEn")}
                        InputLabelProps={{
                          shrink:
                            (watch("hodReassignRemarkEn") ? true : false) ||
                            (router.query.hodReassignRemarkEn ? true : false),
                        }}
                      />

                      {/*  Button For Translation */}
                      <Button
                        variant="contained"
                        sx={{
                          marginTop: "30px",
                          marginLeft: "1vw",
                          height: "5vh",
                          width: "9vw",
                        }}
                        onClick={() =>
                          hodReassignRemarkEnApi(
                            watch("hodReassignRemarkEn"),
                            "hodReassignRemarkMr",
                            "en"
                          )
                        }
                      >
                        {/* Translate */}
                        <FormattedLabel id="mar" />
                      </Button>

                      {/* <Transliteration
                        multiline
                        _key={"hodReassignRemarkEn"}
                        labelName={"hodReassignRemarkEn"}
                        fieldName={"hodReassignRemarkEn"}
                        updateFieldName={"hodReassignRemarkMr"}
                        sourceLang={"eng"}
                        targetLang={"mar"}
                        // disabled={disabled}
                        label={<FormattedLabel id="hodRemarksEn" required />}
                        error={!!errors.hodReassignRemarkEn}
                        helperText={
                          errors?.hodReassignRemarkEn
                            ? errors.hodReassignRemarkEn.message
                            : null
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      /> */}
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
                      <TextField
                        sx={{
                          width: "87%",
                        }}
                        id="standard-textarea"
                        disabled={router?.query?.pageMode === "View"}
                        // label="HOD Opinion in Marathi"
                        label={<FormattedLabel id="legalAdvisorOpinionMr" />}
                        // placeholder="Opinion"
                        multiline
                        variant="standard"
                        // style={{ width: 1000 }}
                        fullWidth
                        // {...register("hodRemarkMr")}
                        {...register("hodReassignRemarkMr")}
                        InputLabelProps={{
                          shrink:
                            (watch("hodReassignRemarkMr") ? true : false) ||
                            (router.query.hodReassignRemarkMr ? true : false),
                        }}
                      />

                      <Button
                        variant="contained"
                        sx={{
                          marginTop: "30px",
                          marginLeft: "1vw",
                          height: "5vh",
                          width: "9vw",
                        }}
                        onClick={() =>
                          hodReassignRemarkEnApi(
                            watch("hodReassignRemarkMr"),
                            "hodReassignRemarkEn",
                            "mr"
                          )
                        }
                      >
                        {/* Translate */}
                        <FormattedLabel id="eng" />
                      </Button>

                      {/* <Transliteration
                        multiline
                        _key={"hodReassignRemarkMr"}
                        labelName={"hodReassignRemarkMr"}
                        fieldName={"hodReassignRemarkMr"}
                        updateFieldName={"hodReassignRemarkEn"}
                        sourceLang={"mar"}
                        targetLang={"eng"}
                        // disabled={disabled}
                        label={<FormattedLabel id="hodRemarksMr" required />}
                        error={!!errors.hodReassignRemarkMr}
                        helperText={
                          errors?.hodReassignRemarkMr
                            ? errors.hodReassignRemarkMr.message
                            : null
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      /> */}
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      xl={3}
                      md={3}
                      sm={3}
                      sx={{
                        marginTop: "30px",
                        // display: "flex",
                        // justifyContent: "center",
                        // alignItems: "center",
                        // marginLeft: "50px",
                      }}
                    >
                      <FormControl
                        style={{ marginTop: 10 }}
                        error={!!errors.opinionSubmisionDate}
                      >
                        <Controller
                          control={control}
                          name="opinionSubmisionDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                disabled={router?.query?.pageMode === "View"}
                                inputFormat="DD/MM/YYYY"
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    {/* Opinion Submission Date */}
                                    <FormattedLabel id="opinionSubmissionDate" />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    disabled={
                                      router?.query?.pageMode === "View"
                                    }
                                    {...params}
                                    size="small"
                                    variant="standard"
                                    // fullWidth
                                    sx={{ width: 230 }}
                                    InputLabelProps={{
                                      style: {
                                        fontSize: 12,
                                        marginTop: 3,
                                      },

                                      //true
                                      shrink:
                                        (watch("opinionSubmisionDate")
                                          ? true
                                          : false) ||
                                        (router.query.opinionSubmisionDate
                                          ? true
                                          : false),
                                    }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        />
                        <FormHelperText>
                          {errors?.opinionSubmisionDate
                            ? errors.opinionSubmisionDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* Button Row */}
                  <Grid container mt={10} ml={5} mb={5} border px={5}>
                    <Grid item xs={2}></Grid>

                    {/* <Grid item xs={2}></Grid> */}

                    <Grid item>
                      <Button
                        // onClick={() => setButtonText("submit")}

                        variant="contained"
                        onClick={() => setButtonText("submit")}
                        type="Submit"

                        // btnSaveText ="submit"
                      >
                        {/* Submit */}
                        {<FormattedLabel id="approve" />}
                      </Button>
                    </Grid>

                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        //  btnSaveText="reassign"
                        onClick={() => setButtonText("reassign")}
                        type="Submit"

                        //  btnSaveText='reassign'
                        // onClick={() => setStatus('reassign')}

                        //  onClick={()=>reassign()

                        //  }
                      >
                        {/* {<FormattedLabel id="submit" />} */}
                        {/* Reassign */}
                        <FormattedLabel id="reassign" />
                      </Button>
                    </Grid>

                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() =>
                          router.push(`/LegalCase/transaction/opinion/`)
                        }
                      >
                        {/* Cancel */}

                        {<FormattedLabel id="cancel" />}
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </form>
            </FormProvider>

            <>
              <Modal
                open={showDocketSubDetailsModel}
                sx={{
                  padding: 5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <Box
                  sx={{
                    width: "50%",
                    bgcolor: "background.paper",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    border: "2px solid black",
                    borderRadius: 5,
                  }}
                >
                  <TextareaAutosize
                    disabled
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "15px",
                      resize: "none",
                      overflowY: "auto",
                      borderRadius: 20,
                      marginBottom: "20px",
                      fontWeight: "bold",
                      boxShadow: "0 2px 4px whitesmoke",
                    }}
                    placeholder="Subject Details"
                    value={displayOpinionDetails}
                    color="black"
                    minRows={5}
                    maxRows={8}
                  />

                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => {
                      setShowDocketSubDetailsModel(false),
                        setDisplayOpinionDetails("");
                    }}
                    sx={{ marginBottom: "20px" }}
                  >
                    {language == "en" ? "close" : "बंद करा"}
                  </Button>
                </Box>
              </Modal>
            </>
          </div>
        </>
      )}

      {/*  */}
    </>
  );
};

export default Index;
