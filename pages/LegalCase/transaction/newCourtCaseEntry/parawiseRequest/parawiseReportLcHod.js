import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Button,
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
// import * as yup from 'yup'
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
// import schema from "../../../../containers/schema/LegalCaseSchema/approveOpinionSchema";
import urls from "../../../../../URLS/urls";
// import { parawiseReportForClerk } from "../../../../../containers/schema/LegalCaseSchema/courtCaseEntrySchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { default as swal, default as sweetAlert } from "sweetalert";

// import { parawiseRequestLcHOD } from "../../../../../containers/schema/LegalCaseSchema/parawiseRequest";
import FileTable from "../../../FileUploadByAnwar/FileTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Delete, Visibility } from "@mui/icons-material";

import Transliteration from "../../../../../components/common/linguosol/transliteration";
import * as yup from "yup";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import Loader from "../../../../../containers/Layout/components/Loader";
import GoogleTranslationComponent from "../../../../../components/common/linguosol/googleTranslation";
import { saveAs } from "file-saver";

import {
  DecryptData,
  EncryptData,
} from "../../../../../components/common/EncryptDecrypt";

const Index = () => {
  // Shcehma
  const generateSchema = (language) => {
    const baseSchema = yup.object({
      //Other Fields
      // caseMainType: yup
      //   .string()
      //   .required(<FormattedLabel id="selectCaseType" />),
    });
    if (language === "en") {
      return baseSchema.shape({
        //
        parawiseReportRemarkHod: yup
          .string()
          .matches(
            //  /^[A-Za-z.]*$/,
            // /^[a-zA-Z0-9 .]*$/,
            /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          )
          .required(<FormattedLabel id="enterRemarks" />),
        // .required(<FormattedLabel id="subTypeEn" />),
      });
    } else if (language === "mr") {
      return baseSchema.shape({
        parawiseReportRemarkHodMr: yup
          .string()
          .matches(
            // /^[aA-zZ\s]+$/,
            // /^[a-zA-Z0-9.]*$/,
            // /^[A-Za-z.]*$/,
            // /^[a-zA-Z0-9.]*$/,
            // /^[\u0900-\u097F0-9\s.]*$/,
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`]*$/,

            "Must be only marathi characters/ फक्त मराठी शब्द"
          )
          .required(<FormattedLabel id="enterRemarks" />),
      });
    } else {
      return baseSchema;
    }
  };

  const language = useSelector((state) => state?.labels?.language);
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
    // methods,
    reset,
    getValues,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = methods;
  // const [dataValidation, setDataValidation] = useState(parawiseRequestLcHOD);

  const user = useSelector((state) => {
    return state.user.user;
  });

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

  // useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(parawiseRequestLcHOD),
  //   mode: "onChange",
  // });
  // const language = useSelector((state) => state.labels.language);
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [dptList, setDptList] = useState([]);
  const [officeLocationList, setOfficeLocationList] = useState([]);
  const [caseEntryData, setCaseEntryData] = useState([]);
  const [buttonText, setButtonText] = useState();
  const [concenDeptNames, setconcenDeptName] = useState([]);
  const [NewCourtCaseEntryAttachmentList, setNewCourtCaseEntryAttachmentList] =
    useState([]);

  const token = useSelector((state) => state.user.user.token);

  // For Documente
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [newTempAttachment, setNewTempAttachment] = useState([]);
  const [_arr, setArr] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  // For Document Modal
  const [openModal, setOpenModal] = useState(false);
  const [rowIndex, setRowIndex] = useState(null);
  const [deptId, setDeptId] = useState(null);

  const [buttonInputStateNew, setButtonInputStateNew] = useState();
  const [deleteButtonInputState, setDeleteButtonInputState] = useState(true);

  const [dataToAttachInPayload, setdataToAttachInPayload] = useState(null);

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (router?.query?.id) {
  //     getDptName();
  //     getOfficeLocation();
  //     localStorage.removeItem("parawiseRequestAttachmentList");
  //     setNewCourtCaseEntryAttachmentList([]);
  //     setAdditionalFiles([]);
  //   }
  // }, [router.query]);

  // useEffect(() => {
  //   if (router?.query?.caseNumber || router?.query?.fillingDate) {
  //     setValue("caseNumber", router.query.caseNumber);
  //     setValue("caseDate", router.query.fillingDate);
  //   }
  // }, [router.query]);

  // useEffect(() => {
  //   if (
  //     router?.query?.parawiseReportRemarkClerkMr ||
  //     router?.query?.parawiseReportRemarkClerk
  //   ) {
  //     setValue(
  //       "parawiseReportRemarkClerkMr",
  //       router?.query?.parawiseReportRemarkClerkMr
  //     );
  //     setValue(
  //       "parawiseReportRemarkClerk",
  //       router?.query?.parawiseReportRemarkClerk
  //     );
  //   }
  // }, [router.query]);

  const parawiseReportRemarkHodAPI = (
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

  const getDptName = () => {
    axios
      .get(`${urls.LCMSURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        let _data = res.data.department;
        setDptList(_data);
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
          console.log("setOfficeLocationList", r?.data?.officeLocation);
          setOfficeLocationList(r?.data?.officeLocation);
        } else {
          //
        }
      })
      .catch((err) => {
        console.log("err", err);
        //
      });
  };

  // const getDeptNameById = () => {
  //   axios
  //     .get(
  //       // `${urls.LCMSURL}/transaction/newCourtCaseEntry/getById?id=${router.query.id}`
  //     )
  //     .then((res) => {
  //       console.log("__res", res.data);
  //       let _res = res?.data?.parawiseRequestList;

  //       const transformedData = _res?.map((item, index) => {
  //         const filePaths = item?.parawiseRequestAttachmentList?.map(
  //           (attachment) => ({
  //             filePath: attachment?.filePath,
  //             FileName: attachment?.originalFileName,
  //           })
  //         );
  //         return {
  //           id: index,
  //           parawiseReqId: item.id,
  //           srNo: index + 1,

  //           locationNameEn: officeLocationList?.find(
  //             (obj) => obj?.id === item?.locationId
  //           )?.officeLocationName,
  //           locationNameMr: officeLocationList?.find(
  //             (obj) => obj?.id === item?.locationId
  //           )?.officeLocationNameMar,

  //           departmentId: item.departmentId,
  //           filePaths: filePaths,
  //           departmentNameEn: dptList?.find(
  //             (obj) => obj.id == item?.departmentId
  //           )?.department,
  //           departmentNameMr: dptList?.find(
  //             (obj) => obj.id == item?.departmentId
  //           )?.departmentMr,
  //         };
  //       });

  //       setTableData(transformedData);
  //     });
  // };

  // NEW CODE
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
        console.log("__res", res.data);
        let _res = res?.data?.trnParawiseListDao;
        const transformedData = _res?.map((item, index) => {
          const filePaths = item?.parawiseRequestAttachmentList?.map(
            (attachment) => ({
              ...attachment,
              filePath: attachment?.filePath,
              FileName: attachment?.originalFileName,
            })
          );
          return {
            id: index,
            parawiseReqId: item.id,
            srNo: index + 1,

            locationNameEn: officeLocationList?.find(
              (obj) => obj?.id === item?.locationId
            )?.officeLocationName,
            locationNameMr: officeLocationList?.find(
              (obj) => obj?.id === item?.locationId
            )?.officeLocationNameMar,

            departmentId: item.departmentId,
            locationId: item.locationId,
            filePaths: filePaths,
            departmentNameEn: dptList?.find(
              (obj) => obj.id == item?.departmentId
            )?.department,
            departmentNameMr: dptList?.find(
              (obj) => obj.id == item?.departmentId
            )?.departmentMr,
          };
        });
        console.log("transformedData", transformedData);

        setTableData(transformedData ?? []);
        setValue(
          "parawiseReportRemarkClerk",
          res?.data?.parawiseReportRemarkClerk
        );
        setValue(
          "parawiseReportRemarkClerkMr",
          res?.data?.parawiseReportRemarkClerkMr
        );
      });
  };

  const handleOpenModal = (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRowData(null);
    setModalOpen(false);
  };

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
  }, [mainFiles, additionalFiles]);

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
                : "काहीतरी चुकीचे घडले आहे, कृपया थोड्यावेळाने प्रयत्न करा!"
            );
            localStorage.removeItem("parawiseRequestAttachmentList");
          }
        })
        .catch((error) => {
          if (!error.status) {
            sweetAlert({
              title: "ERROR",
              text: "Server is unreachable or may be a network issue, please try after sometime",
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

      getDptName();
      getOfficeLocation();
      localStorage.removeItem("parawiseRequestAttachmentList");
      setNewCourtCaseEntryAttachmentList([]);
      setAdditionalFiles([]);
    }
    if (router?.query?.caseNumber || router?.query?.fillingDate) {
      setValue("caseNumber", router.query.caseNumber);
      setValue("caseNumber", router.query.caseNoYear);

      setValue("caseDate", router.query.fillingDate);
    }
    if (
      router?.query?.parawiseReportRemarkClerkMr ||
      router?.query?.parawiseReportRemarkClerk
    ) {
      setValue(
        "parawiseReportRemarkClerkMr",
        router?.query?.parawiseReportRemarkClerkMr
      );
      setValue(
        "parawiseReportRemarkClerk",
        router?.query?.parawiseReportRemarkClerk
      );
    }
  }, [router?.query]);

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
      headerName: language === "en" ? "Location Name" : "स्थानाचे नाव",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: language === "en" ? "departmentNameEn" : "departmentNameMr",
      headerName: <FormattedLabel id="deptName" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "Docs",
      headerName: <FormattedLabel id="viewPreviousDocs" />,
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
              {/* View */}
              <FormattedLabel id="view" />
            </Button>
          )
        );
      },
    },
    // {
    //   field: "Actions",
    //   headerName: <FormattedLabel id="actions" />,
    //   headerAlign: "center",
    //   align: "center",
    //   width: 200,
    //   renderCell: (record) => {
    //     return (
    //       <Button
    //         size="small"
    //         variant="contained"
    //         onClick={() => {
    //           setOpenModal(true);
    //           setRowIndex(record.row.id);
    //           setDeptId(record.row.departmentId);
    //         }}
    //       >
    //         {/* Add Document */}
    //         <FormattedLabel id="addDocuments" />
    //       </Button>
    //     );
    //   },
    // },
  ];
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
      field: "attachedNameEn",
      headerName: language === "en" ? "Uploaded By" : "Uploaded By",
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
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
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
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
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
  //         // callCatchMethod(error, language);
  //         catchExceptionHandlingMethod(error, language);
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
  // For Docuemnt Upload
  // Columns
  const columnsForDocuments = [
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
    if (localStorage.getItem("parawiseRequestAttachmentList") !== null) {
      setAdditionalFiles(
        JSON?.parse(localStorage.getItem("parawiseRequestAttachmentList"))
      );
    }
  }, []);
  useEffect(() => {
    console.log("___selectedRowData", selectedRowData);
  }, [selectedRowData]);

  useEffect(() => {
    if (additionalFiles?.length !== 0) {
      setNewCourtCaseEntryAttachmentList([...mainFiles, ...additionalFiles]);
      localStorage.setItem(
        "parawiseRequestAttachmentList",
        JSON.stringify([...mainFiles, ...additionalFiles])
      );
    }
  }, [mainFiles, additionalFiles]);
  useEffect(() => {
    if (dptList?.length > 0 && officeLocationList?.length > 0) {
      getDeptNameById();
    }
  }, [dptList, officeLocationList]);

  // Save DB
  const onSubmitForm = (data) => {
    console.log(":a3", data);

    let getLocalDataToSend = localStorage.getItem(
      "parawiseRequestAttachmentList"
    )
      ? localStorage.getItem("parawiseRequestAttachmentList")
      : [];

    let setLocalDataToSend =
      getLocalDataToSend?.length !== 0 ? JSON.parse(getLocalDataToSend) : [];

    let paraWiseInfoWithFile = tableData?.map((obj) => {
      return {
        id: obj.parawiseReqId,
        updateUserId: user.id,
        caseDate: data?.caseDate,
        caseNumber: data?.caseNumber,
        caseNoYear: data?.caseNoYear,
        hodRemarkEnglish: null,
        hodRemarkMarathi: null,
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
                  // updateUserId: user.id,
                }))
            : [],
      };
    });

    console.log(":a1", paraWiseInfoWithFile);

    // let body = {
    //   ...dataToAttachInPayload,
    //   parawiseReportRemarkHod: data?.parawiseReportRemarkHod,
    //   parawiseReportRemarkHodMr: data?.parawiseReportRemarkHodMr,
    //   remark: data?.parawiseReportRemarkHod,
    //   remarkMr: data?.parawiseReportRemarkHodMr,
    //   parawiseRequestList: paraWiseInfoWithFile,
    // };
    let action = buttonText == "Approve" ? "APPROVE" : "REVERT";
    let body = {
      id: router?.query?.paraReqId,
      role: "HOD",
      action: action,
      parawiseListId: null,
      hodRemarkEnglish: data?.parawiseReportRemarkHod,
      hodRemarkMarathi: data?.parawiseReportRemarkHodMr,
      trnParawiseListDao: paraWiseInfoWithFile,
    };

    console.log("_body_body_body", body);

    axios
      .post(
        `${urls.LCMSURL}/parawiseRequest/saveApprove`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        // {
        //   // headers: {
        //   //   Authorization: `Bearer ${token}`,
        //   // },
        // }
      )
      .then((res) => {
        console.log("res123", res);
        if (res.status == 200) {
          sweetAlert(
            // "Saved!",
            language === "en" ? "Saved!" : "जतन केले!",
            // "Record Submitted successfully !",
            language === "en"
              ? "Record Submitted successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
            "success"
          );
          localStorage.removeItem("parawiseRequestAttachmentList");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      });

    // if (buttonText == "Approve") {
    //   // alert("qpprove");
    // axios
    //   .post(
    //     `${urls.LCMSURL}/transaction/newCourtCaseEntry/parawiseReportAssignDepartmentsApprovedByHodV1`,
    //     body
    //     // {
    //     //   // headers: {
    //     //   //   Authorization: `Bearer ${token}`,
    //     //   // },
    //     // }
    //   )
    //   .then((res) => {
    //     console.log("res123", res);
    //     if (res.status == 200) {
    //       sweetAlert("Saved!", "Record Submitted successfully !", "success");
    //       localStorage.removeItem("parawiseRequestAttachmentList");
    //       router.push(`/LegalCase/transaction/newCourtCaseEntry`);
    //     }
    //   });
    // } else {
    //   axios
    //     .post(
    //       `${urls.LCMSURL}/transaction/newCourtCaseEntry/parawiseReportReassignedByLegalHod`,
    //       body
    //       // {
    //       //   // headers: {
    //       //   //   Authorization: `Bearer ${token}`,
    //       //   // },
    //       // }
    //     )
    //     .then((res) => {
    //       console.log("res123", res);
    //       if (res.status == 200) {
    //         sweetAlert("Saved!", "Record Reassigned successfully !", "success");
    //         localStorage.removeItem("parawiseRequestAttachmentList");
    //         router.push(`/LegalCase/transaction/newCourtCaseEntry`);
    //       }
    //     });
    // }
  };

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
                  marginTop: 30,
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
                  <FormattedLabel id="hodRemarks" />
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
                      {...register("caseNumber")}
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
              </div>

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
                  xs={1}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    // style={{
                    //   width: "60%",
                    //   height: "70%",
                    // }}
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
                    {language == "en" ? "Documents" : "दस्तऐवज"}
                  </Button>
                </Grid>
              </Grid>

              {/* 2nd table Row */}
              <Grid container sx={{ padding: "10px" }} mt={5} mb={5}>
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
                  hideFooter={true}
                  pagination
                  paginationMode="server"
                  rows={tableData}
                  columns={_col}
                  onPageChange={(_data) => {}}
                  onPageSizeChange={(_data) => {}}
                />
              </Grid>

              {/* 3rd Row */}
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
                    label={<FormattedLabel id="clerkRemarkEn" />}
                    // placeholder="Opinion"
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
                    label={<FormattedLabel id="clerkRemarkMr" />}
                    // placeholder="Opinion"
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

              {/* HOD Remarks */}

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
                    // label="HOD Opinion"
                    label={<FormattedLabel id="hodRemarksEn" required />}
                    // placeholder="Opinion"
                    multiline
                    variant="standard"
                    // style={{ width: 1000 }}
                    fullWidth
                    {...register("parawiseReportRemarkHod")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkHod") ? true : false) ||
                        (router.query.parawiseReportRemarkHod ? true : false),
                    }}
                    error={!!errors.parawiseReportRemarkHod}
                    helperText={
                      errors?.parawiseReportRemarkHod
                        ? errors.parawiseReportRemarkHod.message
                        : null
                    }
                  />
                  {/*  Button For Translation */}
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "3vh",
                      marginLeft: "2vw",
                      height: "5vh",
                    }}
                    onClick={() =>
                      parawiseReportRemarkHodAPI(
                        watch("parawiseReportRemarkHod"),
                        "parawiseReportRemarkHodMr",
                        "en"
                      )
                    }
                  >
                    <FormattedLabel id="mar" />
                  </Button>

                  {/* New Transliteration  */}
                  {/* <GoogleTranslationComponent
                    _key={"parawiseReportRemarkHod"}
                    labelName={"parawiseReportRemarkHod"}
                    fieldName={"parawiseReportRemarkHod"}
                    updateFieldName={"parawiseReportRemarkHodMr"}
                    sourceLang={"en"}
                    targetLang={"mr"}
                    targetError={"parawiseReportRemarkHodMr"}
                    disabled={router?.query?.pageMode === "View"}
                    label={<FormattedLabel id="hodRemarksEn" required />}
                    error={!!errors.parawiseReportRemarkHod}
                    helperText={
                      errors?.parawiseReportRemarkHod
                        ? errors.parawiseReportRemarkHod.message
                        : null
                    }
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
                    label={<FormattedLabel id="hodRemarksMr" />}
                    multiline
                    variant="standard"
                    fullWidth
                    {...register("parawiseReportRemarkHodMr")}
                    InputLabelProps={{
                      //true
                      shrink:
                        (watch("parawiseReportRemarkHodMr") ? true : false) ||
                        (router.query.parawiseReportRemarkHodMr ? true : false),
                    }}
                    error={!!errors.parawiseReportRemarkHodMr}
                    helperText={
                      errors?.parawiseReportRemarkHodMr
                        ? errors.parawiseReportRemarkHodMr.message
                        : null
                    }
                  />
                  <Button
                    variant="contained"
                    sx={{
                      marginTop: "3vh",
                      marginLeft: "2vw",
                      height: "5vh",
                    }}
                    onClick={() =>
                      parawiseReportRemarkHodAPI(
                        watch("parawiseReportRemarkHodMr"),
                        "parawiseReportRemarkHod",
                        "mr"
                      )
                    }
                  >
                    <FormattedLabel id="eng" />
                  </Button>

                  {/* New Transliteration  */}
                  {/* <GoogleTranslationComponent
                    _key={"parawiseReportRemarkHodMr"}
                    labelName={"parawiseReportRemarkHodMr"}
                    fieldName={"parawiseReportRemarkHodMr"}
                    updateFieldName={"parawiseReportRemarkHod"}
                    sourceLang={"mr"}
                    targetLang={"en"}
                    targetError={"parawiseReportRemarkHod"}
                    disabled={router?.query?.pageMode === "View"}
                    label={<FormattedLabel id="hodRemarksMr" />}
                    error={!!errors.parawiseReportRemarkHodMr}
                    helperText={
                      errors?.parawiseReportRemarkHodMr
                        ? errors.parawiseReportRemarkHodMr.message
                        : null
                    }
                  /> */}
                </Grid>
              </Grid>

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
                  onClick={() => setButtonText("Approve")}
                  type="submit"
                  sx={{ backgroundColor: "#00A65A" }}
                  name="Approve"
                  endIcon={<TaskAltIcon />}
                >
                  <FormattedLabel id="approve" />
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setButtonText("Reassign")}
                  // onClick={()=>reassign()}
                  type="submit"
                  sx={{ backgroundColor: "#00A65A" }}
                  name="Reassign"
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
                    localStorage.removeItem("parawiseRequestAttachmentList");
                    router.push("/LegalCase/transaction/newCourtCaseEntry");
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>

              {/* ////////////////////////////////// */}
              {/* Modal */}
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
                {/* ------------------------------------------------------------------------- */}
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
                        style={{ display: "flex", justifyContent: "center" }}
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

              {/* /////////////////////////// */}
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
                    columns={columnsForDocuments} //columns for the table
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
                      // size="small"
                      onClick={() => {
                        setOpenModal(false);
                        setRowIndex(null);
                        setDeptId(null);
                      }}
                      sx={{ width: "70px", marginBottom: "20px" }}
                    >
                      {/* {language == "en" ? "close" : "बंद करा"} */}
                      <FormattedLabel id="submit" />
                      {/* Submit and Close */}
                    </Button>
                  </div>
                </Box>
              </Modal>
            </Paper>
          </form>
        </FormProvider>
      )}
    </>
  );
};

export default Index;
