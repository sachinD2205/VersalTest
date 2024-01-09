import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
// import * as yup from 'yup'
import sweetAlert from "sweetalert";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import {
  Controller,
  useForm,
  useFieldArray,
  FormProvider,
} from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
import urls from "../../../../../URLS/urls";
// import { parawiseReportForClerk } from "../../../../../containers/schema/LegalCaseSchema/courtCaseEntrySchema";
// import styles from "../../../../styles/LegalCase_Styles/parawiseReport.module.css";
import styles from "../../../../../styles/LegalCase_Styles/parawiseReport.module.css";
import { parawiseRequestLcConcernClerk1 } from "../../../../../containers/schema/LegalCaseSchema/parawiseRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FileTable from "../../../FileUploadByAnwar/FileTable";
import { Delete, Visibility } from "@mui/icons-material";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import Loader from "../../../../../containers/Layout/components/Loader";
import GoogleTranslationComponent from "../../../../../components/common/linguosol/googleTranslation";
import { saveAs } from "file-saver";
import {
  DecryptData,
  EncryptData,
} from "../../../../../components/common/EncryptDecrypt";

// import Transliteration from "../../../../../components/common/linguosol/transliteration";

// const  parawiseRequestLcConcernClerk = {

//   answerInEnglish: yup.string().matches(/^[aA-zZ\s]*$/, "Must be only english characters / फक्त इंग्लिश शब्द ").required()

//   };

//    let parawiseRequestLcConcernClerk1 = yup.object().shape({
//     parawiseRequestDao: yup.array().of(yup.object().shape(parawiseRequestLcConcernClerk)),
//   });

const Index = () => {
  const user = useSelector((state) => {
    return state.user.user;
  });

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(parawiseRequestLcConcernClerk1),
    mode: "onChange",
    defaultValues: {
      parawiseRequestDao: [
        { issueNo: "", answerInEnglish: "", answerInMarathi: "" },
      ],
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    getValues,
    formState: { errors },
  } = methods;

  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   methods,
  //   reset,
  //   getValues,
  //   setValue,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(parawiseRequestLcConcernClerk1),
  //   mode: "onChange",
  //   defaultValues: {
  //     parawiseRequestDao: [
  //       { issueNo: "", answerInEnglish: "Vishal", answerInMarathi: "" },
  //     ],
  //   },
  // });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "parawiseRequestDao", // unique name for your Field Array
    }
  );

  const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [caseEntryData, setCaseEntryData] = useState([]);
  const [buttonText, setButtonText] = useState();

  // For Modal
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [deptId, setDeptId] = useState(null);
  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] =
    useState([]);

  const [buttonInputStateNew, setButtonInputStateNew] = useState();

  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [parawiseData, setParawiseData] = useState([]);

  const token = useSelector((state) => state.user.user.token);

  const [loading, setLoading] = useState(false);

  // --------------------------Transaltion API--------------------------------
  const translateRemarksApi = (
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
  // -------------------------------------------------------------------------

  const getCaseEntryData = () => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.caseEntryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("res", res.data);
        setCaseEntryData(res.data);
        let _docs = res?.data?.parawiseRequestList
          ?.find(
            (docs) =>
              docs?.trnNewCourtCaseEntryDaoKey == router?.query?.caseEntryId
          )
          ?.parawiseRequestAttachmentList?.map((jj, i) => {
            return {
              ...jj,
              srNo: i + 1,
            };
          });
        setMainFiles(_docs?.length > 0 ? _docs : []);
        console.log("_docs", _docs);
        // setMainFiles(res?.data?.parawiseRequestList);
      });
  };

  // For Docuemnt Upload
  // Columns
  const columns = [
    {
      headerName: <FormattedLabel id="fileName" />,
      field: "originalFileName",
      valueFormatter: (params) =>
        params?.value?.split(".")?.slice(0, -1)?.join("."),
      // width: 300,
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
        let prevDocsDelBtn = record?.row?.id ? true : false;
        console.log("prevDocsDelBtn", prevDocsDelBtn);
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
              <IconButton
                disabled={prevDocsDelBtn}
                color="error"
                onClick={() => discard(record.row)}
              >
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
  // ------------------------------------------------------------------------

  // Delete
  const discard = async (props) => {
    const discardDecryptPhoto = DecryptData(
      "passphraseaaaaaaaaupload",
      props?.filePath
    );
    const discardFilePath = EncryptData(
      "passphraseaaaaaaadiscard",
      discardDecryptPhoto
    );
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

  // Save DB

  const onSubmitForm = (Data) => {
    //convert data.parawiseRequestDao to json string
    let finalData = JSON.stringify(Data.parawiseRequestDao);

    console.log(":a1", caseEntryData?.parawiseRequestList);

    let getLocalDataToSend = localStorage.getItem(
      "parawiseRequestAttachmentList"
    )
      ? localStorage.getItem("parawiseRequestAttachmentList")
      : [];

    let setLocalDataToSend =
      getLocalDataToSend?.length !== 0
        ? JSON.parse(getLocalDataToSend)?.filter((obj) => obj?.id === undefined)
        : [];

    let filteredAsPerDeptId = caseEntryData?.parawiseRequestList
      ?.filter((o) => o?.departmentId == Number(router?.query?.departmentId))
      .map((obj) => {
        return {
          ...obj,
          updateUserId: user.id,

          parawiseRequestAttachmentListForUpload:
            setLocalDataToSend?.length != 0 ||
            Object.keys(setLocalDataToSend).length != 0
              ? setLocalDataToSend.map((o) => ({
                  id: null,
                  parawiseRequestId: obj?.id,
                  attachedDate: o.attachedDate,
                  attacheDepartment: o.deptId,
                  attacheDesignation: null,
                  attachedNameMr: null,
                  attachedNameEn: o.attachedNameEn,
                  attachedBy: null,
                  extension: o.extension,
                  filePath: o.filePath,
                  originalFileName: o.originalFileName,
                  createdUserId: user.id,
                  updateUserId: null,
                }))
              : [],

          clerkRemarkEnglish: finalData,
          clerkRemarkMarathi: finalData,
          remark: finalData,
          remarkMr: finalData,
        };
      });

    let sendOneObject = filteredAsPerDeptId ? filteredAsPerDeptId[0] : [];

    let body = {
      ...sendOneObject,
    };

    let _body = {
      id: router?.query?.id,
      role: "CONSERN_DPT_CLERK",
      remark: finalData,
      remarkMr: finalData,
      trnParawiseListDao: [
        {
          id: parawiseData[0]?.id,
          parawiseRequestAttachmentList:
            setLocalDataToSend?.length != 0 ||
            Object.keys(setLocalDataToSend).length != 0
              ? setLocalDataToSend.map((o) => ({
                  id: null,
                  attachedDate: o.attachedDate,
                  attacheDepartment: o.deptId,
                  attacheDesignation: null,
                  attachedNameMr: null,
                  attachedNameEn: o.attachedNameEn,
                  attachedBy: null,
                  extension: o.extension,
                  filePath: o.filePath,
                  originalFileName: o.originalFileName,
                  createdUserId: user.id,
                  updateUserId: null,
                }))
              : [],
        },
      ],
    };
    console.log("___body", _body);

    // console.log(":a2", body)
    axios
      // .post(`${urls.LCMSURL}/parawiseRequest/sendParawiseReportToHod`, body, {
      .post(`${urls.LCMSURL}/parawiseRequest/saveApprove`, _body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("conc_dpt_clerk_res", res);
        if (res.status == 201) {
          sweetAlert(
            // "Saved!",
            language === "en" ? "Saved!" : "जतन केले!",
            //  "Record Submitted successfully !",
            language === "en"
              ? "Record Submitted successfully !"
              : "रेकॉर्ड यशस्वीरित्या सबमिट केले!",
            "success"
          );
          localStorage.removeItem("parawiseRequestAttachmentList");
          router.push(
            `/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`
          );
        } else if (res.status == 200) {
          sweetAlert(
            // "Updated!",
            language === "en" ? "Updated!" : "जतन केले!",
            // "Record Updated successfully !",
            language === "en"
              ? "Record Updated successfully!"
              : "रेकॉर्ड यशस्वीरित्या सबमिट केले!",
            "success"
          );
          localStorage.removeItem("parawiseRequestAttachmentList");
          router.push(
            `/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`
          );
        }
      });
  };

  useEffect(() => {
    console.log(
      "NewCourtCaseEntryAttachmentList",
      NewCourtCaseEntryAttachmentList
    );
  }, [NewCourtCaseEntryAttachmentList]);

  // useEffect(() => {
  //   console.log("caseEntryData", caseEntryData);
  //   setValue(
  //     "parawiseReportRemarkClerkMr",
  //     caseEntryData?.parawiseReportRemarkClerkMr
  //   );
  //   setValue(
  //     "parawiseReportRemarkClerk",
  //     caseEntryData?.parawiseReportRemarkClerk
  //   );
  //   setValue("parawiseReportRemarkHod", caseEntryData?.parawiseReportRemarkHod);
  //   setValue(
  //     "parawiseReportRemarkHodMr",
  //     caseEntryData?.parawiseReportRemarkHodMr
  //   );
  // }, [caseEntryData]);

  useEffect(() => {
    console.log("router.query", JSON.parse(router?.query.trnParawiseListDao));
    if (router?.query) {
      setValue(
        "parawiseReportRemarkClerkMr",
        router?.query?.parawiseReportRemarkClerkMr
      );
      setValue(
        "parawiseReportRemarkClerk",
        router?.query?.parawiseReportRemarkClerk
      );
      setValue("parawiseReportRemarkHod", router?.query?.hodRemarkEnglish);
      setValue("parawiseReportRemarkHodMr", router?.query?.hodRemarkMarathi);
      setValue("courtCaseNumber", router.query.courtCaseNumber);
      setValue("fillingDate", router.query.fillingDate);

      let _trnParawiseListDao = router?.query?.trnParawiseListDao
        ? JSON.parse(router?.query?.trnParawiseListDao)
        : [];
      console.log("_trnParawiseListDao_", _trnParawiseListDao);
      _trnParawiseListDao ? setParawiseData(_trnParawiseListDao) : [];

      let oldClerkRemark = _trnParawiseListDao[0]?.consernDptClerkRemark
        ? JSON.parse(_trnParawiseListDao[0]?.consernDptClerkRemark)
        : [];
      console.log(
        "_trnParawiseListDao__trnParawiseListDao__trnParawiseListDao_",
        oldClerkRemark
      );

      if (router?.query?.isReassign) {
        // console.log("router?.query?.isReassign", router?.query?.isReassign);
        setValue("parawiseRequestDao", oldClerkRemark);
        setValue("concHodRemarkEnglish", router?.query?.consernDptHodRemark);
        setValue("concHodRemarkMarathi", router?.query?.consernDptHodRemarkMr);
      } else if (router?.query?.REASSIGN_BY_ADVOCATE) {
        setValue("parawiseRequestDao", oldClerkRemark);
        setValue("concHodRemarkEnglish", router?.query?.consernDptHodRemark);
        setValue("concHodRemarkMarathi", router?.query?.consernDptHodRemarkMr);
        setValue(
          "advocateReassignedRemarksEn",
          JSON?.parse(router?.query.trnParawiseListDao)[0]
            ?.advocateReassignedRemarksEn
        );
        setValue(
          "advocateReassignedRemarksMr",
          JSON?.parse(router?.query.trnParawiseListDao)[0]
            ?.advocateReassignedRemarksMr
        );
      }

      _trnParawiseListDao[0]?.parawiseRequestAttachmentList
        ? setMainFiles(
            _trnParawiseListDao[0]?.parawiseRequestAttachmentList?.map(
              (files, index) => {
                return {
                  ...files,
                  srNo: index + 1,
                };
              }
            )
          )
        : [];
    }

    if (router?.query?.caseEntryId) {
      getCaseEntryData();
      // ///////////////////
      console.log("router.query", router.query);
      setValue("courtCaseNumber", router.query.caseNumber);
      setValue("fillingDate", router.query.caseDate);
      localStorage.removeItem("parawiseRequestAttachmentList");
    }
  }, [router?.query]);

  useEffect(() => {
    // if (additionalFiles?.length !== 0) {
    if (additionalFiles?.length !== 0 || mainFiles?.length > 0) {
      console.log("mainFiles&additionalFiles", mainFiles, additionalFiles);
      // alert("...mainFiles")

      let uniqueArrayOfAttachments = Object?.values(
        [...mainFiles, ...additionalFiles]?.reduce((acc, obj) => {
          acc[obj?.srNo] = obj;
          return acc;
        }, {})
      );

      console.log("uniqueArrayOfAttachments", uniqueArrayOfAttachments);
      // setNewCourtCaseEntryAttachmentList([...mainFiles, ...additionalFiles]);
      setNewCourtCaseEntryAttachmentList(uniqueArrayOfAttachments ?? []);

      localStorage.setItem(
        "parawiseRequestAttachmentList",
        // JSON.stringify([...mainFiles, ...additionalFiles])
        JSON.stringify(uniqueArrayOfAttachments ?? [])
      );
    }
  }, [mainFiles, additionalFiles]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
                  display: "flex",
                  justifyContent: "center",
                  // paddingTop: "10px",
                  // // backgroundColor:'#0E4C92'
                  // // backgroundColor:'		#0F52BA'
                  // // backgroundColor:'		#0F52BA'
                  // background:
                  //   "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",

                  backgroundColor: "#556CD6",

                  color: "white",
                  fontSize: 19,
                  // marginTop: 30,
                  marginBottom: 20,
                  // padding: 8,
                  height: "8vh",

                  paddingLeft: 30,
                  // marginLeft: "50px",
                  // marginRight: "75px",
                  borderRadius: 100,
                  width: "100%",
                }}
              >
                <h2
                  style={{
                    color: "white",
                  }}
                >
                  {" "}
                  <FormattedLabel id="concDptClerkRemarks" />
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
                <Grid
                  container
                  sx={{
                    // padding: "10px",
                    marginTop: "30px",
                  }}
                >
                  {/* court case no */}
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
                      {...register("courtCaseNumber")}
                    />
                  </Grid>
                  {/* case date */}
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
                        name="fillingDate"
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
              </div>

              {/* 2nd Row */}
              <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
                {/* legal clerk Remark in English */}
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
                    // label={<FormattedLabel id="clerkRemarkEn" />}

                    label={<FormattedLabel id="legalDeptRemarkEn" />}
                    multiline
                    variant="standard"
                    fullWidth
                    {...register("parawiseReportRemarkClerk")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkClerk") ? true : false) ||
                        (router.query.parawiseReportRemarkClerk ? true : false),
                    }}
                    error={!!errors.clerkRemarkEn}
                    helperText={
                      errors?.clerkRemarkEn
                        ? errors.clerkRemarkEn.message
                        : null
                    }
                  />
                </Grid>

                {/* legal clerk Remark in Marathi */}

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
                    // label={<FormattedLabel id="clerkRemarkMr" />}
                    label={<FormattedLabel id="legalDeptRemarkMr" />}
                    multiline
                    variant="standard"
                    fullWidth
                    // style={{ width: 1000 , marginTop:"30px"}}
                    {...register("parawiseReportRemarkClerkMr")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkClerkMr") ? true : false) ||
                        (router.query.parawiseReportRemarkClerkMr
                          ? true
                          : false),
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

              {/*legal HOD Remarks in English */}

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
                    id="standard-textarea"
                    disabled
                    // label={<FormattedLabel id="hodRemarksEn" />}
                    label={<FormattedLabel id="legalHODRemarkEn" />}
                    multiline
                    variant="standard"
                    fullWidth
                    {...register("parawiseReportRemarkHod")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkHod") ? true : false) ||
                        (router.query.parawiseReportRemarkHod ? true : false),
                    }}
                    error={!!errors.hodRemarkEn}
                    helperText={
                      errors?.hodRemarkEn ? errors.hodRemarkEn.message : null
                    }
                  />
                </Grid>
                {/*legal HOD Remarks in Marathi */}

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
                    id="standard-textarea"
                    disabled
                    // label={<FormattedLabel id="hodRemarksMr" />}
                    label={<FormattedLabel id="legalHODRemarkMr" />}
                    multiline
                    variant="standard"
                    // style={{ width: 1000 }}
                    fullWidth
                    {...register("parawiseReportRemarkHodMr")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkHodMr") ? true : false) ||
                        (router.query.parawiseReportRemarkHodMr ? true : false),
                    }}
                    error={!!errors.hodRemarkMr}
                    helperText={
                      errors?.hodRemarkMr ? errors.hodRemarkMr.message : null
                    }
                  />
                </Grid>
              </Grid>

              {/* DOCUMENT UPLOAD  */}

              <Grid container sx={{ padding: "10px" }}>
                <Grid item xs={12} xl={12} md={12} sm={12}>
                  <Box
                    sx={{
                      border: "5px",
                      background: "white",
                      // marginTop: "100px",
                      height: "auto",
                      width: "100%",
                      // marginLeft: "200px",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#0084ff",
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
                        {language == "en"
                          ? "Upload Document"
                          : "दस्तऐवज अपलोड करा"}
                      </strong>
                    </div>

                    {/** FileTableComponent **/}
                    {uploading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "auto",
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
                    )}
                  </Box>
                </Grid>
              </Grid>

              <Grid container sx={{ padding: "10px" }}>
                {/* <Grid
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
                id="standard-textarea"
                disabled={router?.query?.pageMode === "View"}
                label={<FormattedLabel id="clerkRemarkEn" />}
                multiline
                variant="standard"
                fullWidth
                {...register("clerkRemarkEnglish")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkEnglish") ? true : false) ||
                    (router.query.parawiseReportRemarkHod ? true : false),
                }}
                error={!!errors.clerkRemarkEn}
                helperText={errors?.clerkRemarkEn ? errors.clerkRemarkEn.message : null}
              />
            </Grid> */}

                {/* <Grid
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
                id="standard-textarea"
                disabled={router?.query?.pageMode === "View"}
                label={<FormattedLabel id="clerkRemarkMr" />}
                multiline
                variant="standard"
                // style={{ width: 1000 }}
                fullWidth
                {...register("clerkRemarkMarathi")}
                InputLabelProps={{
                  //true
                  shrink:
                    (watch("clerkRemarkMarathi") ? true : false) ||
                    (router.query.clerkRemarkMarathi ? true : false),
                }}
                error={!!errors.clerkRemarkMr}
                helperText={errors?.clerkRemarkMr ? errors.clerkRemarkMr.message : null}
              />
            </Grid> */}
              </Grid>

              <div
                style={{
                  backgroundColor: "#0084ff",
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
                <Grid container className={styles.theme1}>
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
                      {/* Point No */}
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
                      {/* Points Explanation */}
                      <FormattedLabel id="pointsExplanation" />
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
                      onClick={() =>
                        append({
                          // srNO: "",
                          issueNo: "",
                          answerInEnglish: "",
                          answerInMarathi: "",
                        })
                      }
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
                  height={450}
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
                          component={Box}
                          style={{ marginTop: 20 }}
                        >
                          {/* <Grid item xs={0.1}></Grid> */}
                          {/* Issue No */}
                          <Grid
                            item
                            xs={2.4}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <TextField
                              placeholder="Issue No"
                              // size="small"
                              height={500}
                              // type="number"
                              // oninput="auto_height(this)"
                              {...register(
                                `parawiseRequestDao.${index}.issueNo`
                              )}
                              key={parawise.id}
                              error={
                                !!errors?.parawiseRequestDao?.[index]?.issueNo
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]?.issueNo
                                  ? errors?.parawiseRequestDao?.[index]?.issueNo
                                      .message
                                  : null
                              }

                              // error={!!errors.issueNo}
                              // helperText={
                              //   errors?.issueNo ? errors.issueNo.message : null
                              // }
                            ></TextField>
                          </Grid>
                          {/* <Grid item xs={0.2}></Grid> */}
                          {/* para for english */}
                          <Grid
                            item
                            xs={3.4}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            {/* <GoogleTranslationComponent
                              textArea={true}
                              placeholder="Paragraph Wise Answer Draft Of Issues(In English)"
                              fieldName={`parawiseRequestDao.${index}.answerInEnglish`}
                              updateFieldName={`parawiseRequestDao.${index}.answerInMarathi`}
                              sourceLang={"en"}
                              targetLang={"mr"}
                              targetError={`parawiseRequestDao.${index}.answerInMarathi`}
                              // label={<FormattedLabel id="opponentAdvocateEn" />}
                              error={
                                !!errors?.parawiseRequestDao?.[index]
                                  ?.answerInEnglish
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]
                                  ?.answerInEnglish
                                  ? errors?.parawiseRequestDao?.[index]
                                      ?.answerInEnglish.message
                                  : null
                              }
                            /> */}
                            <TextField
                              // required

                              style={{
                                border: "1px  solid blue",
                              }}
                              fullWidth
                              multiline
                              rows={5}
                              placeholder="Paragraph Wise Answer Draft Of Issues(In English)"
                              size="small"
                              // oninput="auto_height(this)"
                              {...register(
                                `parawiseRequestDao.${index}.answerInEnglish`
                              )}
                              // error={!!errors.answerInEnglish}
                              // helperText={
                              //   errors?.answerInEnglish
                              //     ? errors.answerInEnglish.message
                              //     : null
                              // }

                              // error={!!errors.answerInEnglish}
                              // helperText={errors?.answerInEnglish ? errors.answerInEnglish.message : null}

                              key={parawise.id}
                              error={
                                !!errors?.parawiseRequestDao?.[index]
                                  ?.answerInEnglish
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]
                                  ?.answerInEnglish
                                  ? errors?.parawiseRequestDao?.[index]
                                      ?.answerInEnglish.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid
                            item
                            xs={1.4}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                // marginTop: "1vh",
                                marginLeft: "1vw",
                              }}
                              onClick={() =>
                                translateRemarksApi(
                                  watch(
                                    `parawiseRequestDao.${index}.answerInEnglish`
                                  ),
                                  `parawiseRequestDao.${index}.answerInMarathi`,
                                  "en"
                                )
                              }
                            >
                              <FormattedLabel id="mar" />
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                marginTop: "10px",
                                marginLeft: "1vw",
                              }}
                              onClick={() =>
                                translateRemarksApi(
                                  watch(
                                    `parawiseRequestDao.${index}.answerInMarathi`
                                  ),
                                  `parawiseRequestDao.${index}.answerInEnglish`,
                                  "mr"
                                )
                              }
                            >
                              <FormattedLabel id="eng" />
                            </Button>
                          </Grid>
                          {/* <Grid item xs={0.3}></Grid> */}
                          {/* para for Marathi */}
                          <Grid
                            item
                            xs={3.4}
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <TextField
                              style={{
                                border: "1px  solid blue",
                              }}
                              fullWidth
                              multiline
                              rows={5}
                              placeholder="Paragraph Wise Answer Draft Of Issues(In Marathi)"
                              size="small"
                              // oninput="auto_height(this)"
                              {...register(
                                `parawiseRequestDao.${index}.answerInMarathi`
                              )}
                              key={parawise.id}
                              error={
                                !!errors?.parawiseRequestDao?.[index]
                                  ?.answerInMarathi
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]
                                  ?.answerInMarathi
                                  ? errors?.parawiseRequestDao?.[index]
                                      ?.answerInMarathi.message
                                  : null
                              }
                            />
                            {/* <GoogleTranslationComponent
                              textArea={true}
                              placeholder="Paragraph Wise Answer Draft Of Issues(In Marathi)"
                              fieldName={`parawiseRequestDao.${index}.answerInMarathi`}
                              updateFieldName={`parawiseRequestDao.${index}.answerInEnglish`}
                              sourceLang={"mr"}
                              targetLang={"en"}
                              targetError={`parawiseRequestDao.${index}.answerInEnglish`}
                              // label={<FormattedLabel id="opponentAdvocateEn" />}
                              error={
                                !!errors?.parawiseRequestDao?.[index]
                                  ?.answerInMarathi
                              }
                              helperText={
                                errors?.parawiseRequestDao?.[index]
                                  ?.answerInMarathi
                                  ? errors?.parawiseRequestDao?.[index]
                                      ?.answerInMarathi.message
                                  : null
                              }
                            /> */}
                            {/* <Transliteration
                          multiline
                          rows={5}
                          variant={"outlined"}
                          _key={`parawiseRequestDao.${index}.answerInMarathi`}
                          labelName={`parawiseRequestDao.${index}.answerInMarathi`}
                          fieldName={`parawiseRequestDao.${index}.answerInMarathi`}
                          updateFieldName={
                            "parawiseRequestDao.${index}.answerInMarathiMr"
                          }
                          sourceLang={"eng"}
                          targetLang={"mar"}
                          // disabled={disabled}
                          label={<FormattedLabel id='informerName' required />}
                          error={
                            !!errors[
                              "parawiseRequestDao.${index}.answerInMarathi"
                            ]
                          }
                          helperText={
                            errors[
                              "parawiseRequestDao.${index}.answerInMarathi"
                            ]
                              ? errors[
                                  "parawiseRequestDao.${index}.answerInMarathi"
                                ].message
                              : null
                          }
                        /> */}
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

                          {/*  */}
                        </Grid>
                      </>
                    );
                  })}
                  {/* </ThemeProvider> */}
                </Box>
              </Box>
              {router?.query?.isReassign && (
                <Grid container sx={{ padding: "10px", marginTop: "30px" }}>
                  {/* conc hod Remark in English */}
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
                      disabled={true}
                      label={<FormattedLabel id="hodRemarksEn" />}
                      multiline
                      variant="standard"
                      fullWidth
                      {...register("concHodRemarkEnglish")}
                      error={!!errors.concHodRemarkEnglish}
                      InputLabelProps={{
                        shrink: watch("concHodRemarkEnglish" ? true : false),
                      }}
                      helperText={
                        errors?.concHodRemarkEnglish
                          ? errors.concHodRemarkEnglish.message
                          : null
                      }
                    />
                  </Grid>

                  {/* conc hod Remark in Marathi */}

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
                      disabled={true}
                      label={<FormattedLabel id="hodRemarksMr" />}
                      multiline
                      variant="standard"
                      // style={{ width: 1000 }}
                      fullWidth
                      {...register("concHodRemarkMarathi")}
                      error={!!errors.concHodRemarkMarathi}
                      InputLabelProps={{
                        shrink: watch("concHodRemarkMarathi") ? true : false,
                      }}
                      helperText={
                        errors?.concHodRemarkMarathi
                          ? errors.concHodRemarkMarathi.message
                          : null
                      }
                    />
                  </Grid>
                </Grid>
              )}

              {/* Advocate Reassign Remarks */}
              {router?.query?.REASSIGN_BY_ADVOCATE && (
                <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={12} xl={12} md={12} sm={12}>
                    <TextField
                      id="standard-textarea"
                      disabled
                      // label={<FormattedLabel id="hodRemarksEn" />}
                      label={<FormattedLabel id="advocateRemarksEn" />}
                      multiline
                      variant="standard"
                      fullWidth
                      {...register("advocateReassignedRemarksEn")}
                      InputLabelProps={{
                        //true
                        shrink:
                          (watch("advocateReassignedRemarksEn")
                            ? true
                            : false) ||
                          (router.query.advocateReassignedRemarksEn
                            ? true
                            : false),
                      }}
                      // error={!!errors.hodRemarkEn}
                      // helperText={
                      //   errors?.hodRemarkEn ? errors.hodRemarkEn.message : null
                      // }
                    />
                  </Grid>
                  {/*legal HOD Remarks in Marathi */}

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
                      id="standard-textarea"
                      disabled
                      // label={<FormattedLabel id="hodRemarksMr" />}
                      label={<FormattedLabel id="advocateRemarksMr" />}
                      multiline
                      variant="standard"
                      // style={{ width: 1000 }}
                      fullWidth
                      {...register("advocateReassignedRemarksMr")}
                      InputLabelProps={{
                        //true
                        shrink:
                          (watch("advocateReassignedRemarksMr")
                            ? true
                            : false) ||
                          (router.query.advocateReassignedRemarksMr
                            ? true
                            : false),
                      }}
                      // error={!!errors.hodRemarkMr}
                      // helperText={
                      //   errors?.hodRemarkMr ? errors.hodRemarkMr.message : null
                      // }
                    />
                  </Grid>
                </Grid>
              )}

              {/* Button Row */}

              <Grid
                container
                mt={10}
                ml={5}
                mb={5}
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
                xs={12}
              >
                <Button
                  variant="contained"
                  size="small"
                  type="submit"
                  onClick={() => setButtonText("Approve")}
                  sx={{ backgroundColor: "#00A65A" }}
                  name="Approve"
                  endIcon={<TaskAltIcon />}
                >
                  <FormattedLabel id="save" />
                </Button>
                {/* <Button
              variant="contained"
              size="small"
              //   type="submit"
              onClick={() => setButtonText("Reassign")}
              sx={{ backgroundColor: "#00A65A" }}
              name="Reassign"
              endIcon={<UndoIcon />}
            >
              <FormattedLabel id="reassign" />
            </Button> */}
                <Button
                  size="small"
                  variant="contained"
                  sx={{ backgroundColor: "#DD4B39" }}
                  endIcon={<CloseIcon />}
                  onClick={() => {
                    localStorage.removeItem("parawiseRequestAttachmentList");
                    router.push(
                      "/LegalCase/transaction/newCourtCaseEntry/parawiseRequest"
                    );
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </Paper>
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default Index;
