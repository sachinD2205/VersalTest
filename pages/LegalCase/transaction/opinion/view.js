import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
// import Transliteration from "../../../../components/common/linguosol/transliteration";
import * as yup from "yup";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Typography } from "antd";
import { Visibility } from "@mui/icons-material";
import { saveAs } from "file-saver";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt/index.js";

const View = () => {
  const language = useSelector((state) => state.labels.language);
  const [loadderState, setLoadderState] = useState(true);

  // Schema
  const generateSchema = (language) => {
    const baseSchema = yup.object({
      // other
      // inwardNo
      inwardNo: yup
        .string()
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Please Enter Inward Number / कृपया आवक क्रमांक प्रविष्ट करा "
        )
        .required(),

      opinionRequestDate: yup
        .date()
        // .required()
        .typeError(<FormattedLabel id="selectDate" />)
        .required(),

      // officeLocation: yup.string().required(<FormattedLabel id="selectLocation" />),

      concenDeptId: yup
        .string()
        .nullable()
        .required(<FormattedLabel id="selectDepartmet" />),

      officeLocation: yup
        .string()
        .required(<FormattedLabel id="selectLocation" />),
    });

    if (language === "en") {
      return baseSchema.shape({
        opinionSubject: yup
          .string()
          .required("Opinion Subject is required.")
          .matches(
            /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?]*$/,

            "Must be only english characters / फक्त इंग्लिश शब्द "
          ),

        panelRemarks: yup
          .string()
          .nullable()
          .when("advPanel", {
            is: true,
            then: yup
              .string()
              .matches(
                // /^[aA-zZ\s]+$/,
                /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?]*$/,

                "Must be only english characters / फक्त इंग्लिश शब्द "
              )
              .required("Remark is required"),
          }),

        // reportAdvPanel

        reportRemarks: yup
          .string()
          .nullable()

          .when("reportAdvPanel", {
            is: true,
            then: yup
              .string()
              .nullable()
              .matches(
                // /^[aA-zZ\s]+$/,
                /^[A-Za-z0-9][A-Za-z0-9\s\/\*\@#\$%&()\!\+\-\:\:\>\<\.\,\=\^\_\~\`\"\'\;\[\]\{\}\>\<\.\?]*$/,

                "Must be only english characters / फक्त इंग्लिश शब्द "
              )
              .required("Remark is required"),
          }),
      });
    } else if (language === "mr") {
      return baseSchema.shape({
        opinionSubjectMr: yup
          .string()
          .required(<FormattedLabel id="opinionSubjectisRequired" />)
          .matches(
            /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?]*$/,
            "Must be only marathi characters/ फक्त मराठी शब्द"
          ),

        panelRemarksMr: yup
          .string()
          .nullable()
          .when("advPanel", {
            is: true,
            then: yup
              .string()
              .matches(
                /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?]*$/,
                "Must be only marathi characters/ फक्त मराठी शब्द"
              )
              .required("Remark Mr is required"),
          }),

        reportRemarksMr: yup
          .string()
          .nullable()
          .when("reportAdvPanel", {
            is: true,
            then: yup
              .string()
              .nullable()
              .matches(
                /^[ऀ-ॿ][ऀ-ॿ0-9\s\@\~\#\$\%\^\&\*\(\)\[\]\!\-\_\=\+\=\''\"\:\;\.\,\?\>\<\{\}\/\\\अॅ\~\`\?]*$/,
                "Must be only marathi characters/ फक्त मराठी शब्द"
              )
              .required("Remark Mr is required"),
          }),
      });
    } else {
      return baseSchema;
    }
  };
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
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = methods;

  const router = useRouter();

  const token = useSelector((state) => state.user.user.token);

  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);

  const [buttonText, setButtonText] = useState(null);

  const [advocateNames, setadvocateName] = useState([]);

  const [isOpenCollapse1, setIsOpenCollapse1] = useState(false);

  const [isOpenCollapse2, setIsOpenCollapse2] = useState(false);

  const [isOpenCollapse3, setIsOpenCollapse3] = useState(true);

  const [personName, setPersonName] = React.useState([]);

  const [personName1, setPersonName1] = React.useState([]);

  const [selected, setSelected] = useState([]);

  const [selected1, setSelected1] = useState([]);

  const [selectedID, setSelectedID] = useState([]);
  const [selectedID1, setSelectedID1] = useState([]);

  const [advPanel, setAdvPanel] = useState(false);
  const [reportAdvPanel, setReportAdvPanel] = useState(false);

  const [reportAdvocate, setReportAdvocate] = useState(false);

  const [clerkData, setClerkData] = useState([]);
  // setHODData
  const [hodData, setHODData] = useState([]);

  const [opinionAdvocateData, setOpinionAdvocateData] = useState([]);
  const [reportAdvocateData, setReportAdvocateData] = useState([]);
  const [docsDetails, setDocsDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const _opinionRequestDate = watch("opinionRequestDate");

  const _concenDeptId = watch("concenDeptId");
  const _opinionSubject = watch("opinionSubject");
  const _officeLocation = watch("officeLocation");
  const _panelRemarks = watch("panelRemarks");
  const abc = watch("opinionRequestDate");

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

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // New HandleChange
  const handleChange = (event, value) => {
    setSelected(value);
    setSelectedID(value.map((item) => item.id));

    // setSelectedID(
    //   value.map((v) => advocateNames.find((o) => o.FullName === v).id)
    // );
  };

  // New HandleChange1
  const handleChange1 = (event, value) => {
    setSelected1(value);
    setSelectedID1(value.map((item) => item.id));

    // const {
    //   target: { value },
    // } = event;
    // setSelected1(event.target.value);

    // setSelectedID1(
    //   event.target.value.map(
    //     (v) => advocateNames.find((o) => o.FullName === v).id
    //   )
    // );
  };

  const checkBox1 = (e) => {
    // alert(e.target.value);
    if (e.target.checked == true) {
      setIsOpenCollapse1(true);
      setIsOpenCollapse3(false);
    } else if (e.target.checked == false) {
      // console.log(" Un Checked ", e.target.value);
      setIsOpenCollapse1(false);
      setIsOpenCollapse3(true);
    }
    setAdvPanel(e.target.checked);
    setValue("advPanel", e.target.checked);
  };

  const checkBox2 = (e) => {
    if (e.target.checked == true) {
      setIsOpenCollapse2(true);
      setIsOpenCollapse3(false);
    } else if (e.target.checked == false) {
      setIsOpenCollapse2(false);
      setIsOpenCollapse3(true);
    }
    setReportAdvPanel(e.target.checked);
    setValue("reportAdvPanel", e.target.checked);
  };

  const getAdvocateNames = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // let advs=
        // setadvocateName1(
        //   advs );
        setadvocateName(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            FullName: r.firstName + "  " + r.middleName + "  " + r.lastName,
            FullNameMr:
              r.firstNameMr + "  " + r.middleNameMr + "  " + r.lastNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  const getDeptName = () => {
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

  // get Office Name
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
            officeLocationNameMar: r.officeLocationNameMar,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // Save - DB
  const onSubmitForm = (Data) => {
    console.log("data11", Data);
    const opinionRequestDate = moment(Data.opinionRequestDate).format(
      "YYYY-MM-DD"
    );
    console.log(
      "LCMS: onSubmitForm - selectedId =",
      JSON.stringify(selectedID)
    );
    let body = {
      ...Data,
      opinionRequestDate,
      opinionAdvPanelList: selectedID.map((val) => {
        return {
          advocate: val,
        };
      }),

      // role: "OPINION_CREATE",
      status:
        buttonText === "saveAsDraft" ? "OPINION_DRAFT" : "OPINION_CREATED",
      sentToAdvocate: buttonText === "saveAsDraft" ? "N" : "Y",
      role:
        buttonText === "saveAsDraft"
          ? "OPINION_SAVE_AS_DRAFT"
          : "CREATE_OPINION",

      // role:
      //   Data.target.textContent === "Submit"
      //     ? "OPINION_CREATE"
      //     : "OPINION_DRAFT",

      reportAdvPanelList: selectedID1.map((val) => {
        return {
          advocate: val,
        };
      }),

      // id: null,
      //name
      id: router.query.pageMode == "Opinion" ? null : Data.id,

      // role :"OPINION_DRAFT"

      // role:"OPINION_SAVE_AS_DRAFT"
    };

    console.log("LCMS: body =", body);

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
            // "Saved!",
            language == "en" ? "Saved" : "जतन केले",
            language == "en"
              ? "Record Saved successfully !"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
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

  // get Opinion Serial Number\

  // notice number - serial number
  const getOpinionNumber = async () => {
    setLoadderState(true);

    await axios
      .get(`${urls.LCMSURL}/transaction/opinion/getOpinionNumber`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoadderState(false);

        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          r?.data ? setValue("opinionNo", r.data) : setValue("opinionNo", 0);
        } else {
          ////
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
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
      console.log("else else");
      setLoading(true);
      const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
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
          console.log("err33", error);
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

  // --------------------------Transaltion API--------------------------------
  const transalationApiCall = (currentFieldInput, updateFieldName) => {
    if (currentFieldInput) {
      let _payL = {
        apiKey: "Alpesh",
        textToTranslate: currentFieldInput,
      };
      setLoadderState(true);
      axios
        .post(`${urls.TRANSLATIONAPI}`, _payL)
        .then((r) => {
          setLoadderState(false);
          if (r.status === 200 || r.status === 201) {
            if (updateFieldName) {
              setValue(updateFieldName, r?.data);
            }
          }
        })
        .catch((e) => {
          setLoadderState(false);
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

  // ----------------------
  useEffect(() => {
    if (watch("advPanel")) {
      setIsOpenCollapse1(true);
      setIsOpenCollapse3(false);
    } else {
      setIsOpenCollapse1(false);
      setIsOpenCollapse3(true);
    }
  }, [watch("advPanel")]);

  // for report panel

  useEffect(() => {
    if (watch("reportAdvPanel")) {
      setIsOpenCollapse2(true);
      setIsOpenCollapse3(false);
    } else {
      setIsOpenCollapse2(false);
      setIsOpenCollapse3(true);
    }
  }, [watch("reportAdvPanel")]);

  useEffect(() => {
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "View" ||
      router.query.pageMode == "Opinion"
    ) {
      setLoadderState(true);

      axios
        .get(
          `${urls.LCMSURL}/transaction/opinion/getById?id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setLoadderState(false);

          console.log("resssss", res.data);
          reset(res.data);

          console.log("LC: getById data =", res.data);
          setClerkData(
            [
              {
                id: res.data.id,
                clerkRemarkEn: res.data.clerkRemarkEn,
                clerkRemarkMr: res.data.clerkRemarkMr,
              },
            ]?.map((_dat, i) => ({ ..._dat, srNo: i + 1 }))
          );

          setHODData(
            [
              {
                id: res.data.id,
                hodReassignRemarkEn: res.data.hodReassignRemarkEn,
                hodReassignRemarkMr: res.data.hodReassignRemarkMr,
              },
            ]?.map((_dat, i) => ({ ..._dat, srNo: i + 1 }))
          );
          setOpinionAdvocateData(
            res?.data?.opinionAdvPanelList?.map((_d, i) => ({
              ..._d,
              srNo: i + 1,
            })) ?? []
          );
          setReportAdvocateData(
            res?.data?.reportAdvPanelList?.map((_d, i) => ({
              ..._d,
              srNo: i + 1,
            })) ?? []
          );
          setDocsDetails(
            res?.data?.trnOpinionAttachmentDao?.map((_d, i) => ({
              ..._d,
              srNo: i + 1,
            })) ?? []
          );

          setAdvPanel(res.data.advPanel);
          setReportAdvPanel(res.data.reportAdvPanel);

          setIsOpenCollapse1(res.data.advPanel);
          setIsOpenCollapse2(res.data.reportAdvPanel);
          if (res.data.reportAdvPanel == true || res.data.advPanel == true) {
            setIsOpenCollapse3(false);
          } else {
            setIsOpenCollapse3(true);
          }

          setSelectedID(
            res?.data?.opinionAdvPanelList.map((o) => {
              return o?.advocate;
            })
          );

          let selected = res?.data?.opinionAdvPanelList?.map((op) =>
            advocateNames?.find((o) => o?.id === op?.advocate)
          );
          setSelected(selected);

          let selected1 = res?.data?.reportAdvPanelList?.map((op) =>
            advocateNames?.find((o) => o?.id === op?.advocate)
          );
          setSelected1(selected1);

          console.log("opinionAdvPanelList", res.data.opinionAdvPanelList);
          console.log("advocateNames", advocateNames);
          console.log("selected)))", selected);
          console.log("selected1)))", selected1);

          setSelectedID1(
            res.data.reportAdvPanelList.map((o) => {
              return o.advocate;
            })
          );
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });

      // setValue("opinionSubject", router.query.opinionSubject),

      // getValues("reportAdvPanel"),
      // setValue(Boolean(getValues(router.query.reportAdvPanel))),
      // setValue(Boolean(getValues(router.query.advPanel)))
      // setValue("advPanel",router.query.advPanel == "true" ? true : false)
    }
  }, [advocateNames]);

  useEffect(() => {
    getAdvocateNames();
    // getAdvocateNames1();
    getDeptName();
    getOfficeName();
    getOpinionNumber();
  }, []);

  const clerkColumn = [
    // { field: "id", width: 70 },
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    {
      field: "clerkRemarkEn",
      headerName:
        language == "en" ? "Clerk Opinion in English" : "इंग्रजीमध्ये लिपिक मत",
      flex: 1,
    },
    {
      field: "clerkRemarkMr",
      headerName:
        language == "en" ? "Clerk Opinion in Marathi" : "मराठीत लिपिक मत",
      flex: 1,
    },
  ];

  const advocateHistoryColumns = [
    { field: "srNo", headerName: <FormattedLabel id="srNo" />, flex: 1 },
    {
      field: "advocate",
      headerName: <FormattedLabel id="advocateName" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {advocateNames.find((item) => item.id === params.value)?.FullName}
          </>
        );
      },
    },
    {
      field: "opinion",
      headerName: <FormattedLabel id="opinion" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.value !== null && params.value !== ""
              ? language === "en"
                ? params.row.opinion
                : params.row.opinionMr
              : "No opinion found"}
          </>
        );
      },
    },
    // {
    //   field: "remark",
    //   headerName: "Remarks",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {params.value !== null && params.value !== ""
    //           ? language === "en"
    //             ? params.row.remark
    //             : params.row.remarkMr
    //           : "No remark found"}
    //       </>
    //     );
    //   },
    // },
  ];

  const hodColumn = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    // {
    //   field: language === "en" ? "hodRemarkEn" : "hodRemarkMr",
    //   headerName: language == "en" ? "Opinion" : "मत",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {params.value !== null &&
    //         params.value !== undefined &&
    //         params.value !== ""
    //           ? params.value
    //           : "-"}
    //       </>
    //     );
    //   },
    // },

    {
      // field: language === "en" ? "hodReassignRemarkEn" : "hodReassignRemarkMr",
      field: "hodReassignRemarkEn",

      headerName: <FormattedLabel id="hodOpinionInEnglish" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.value !== null &&
            params.value !== undefined &&
            params.value !== ""
              ? params.value
              : "-"}
          </>
        );
      },
    },

    {
      field: "hodReassignRemarkMr",
      headerName: <FormattedLabel id="hodOpinionInMarathi" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {params.value !== null &&
            params.value !== undefined &&
            params.value !== ""
              ? params.value
              : "-"}
          </>
        );
      },
    },
    // {
    //   field: "hodReassignRemarkMr",
    //   headerName:
    //     language == "en"
    //       ? "Re-assign Remark In Marathi"
    //       : "मराठीत रिमार्क पुन्हा नियुक्त करा",
    //   flex: 1,
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         {params.value !== null &&
    //         params.value !== undefined &&
    //         params.value !== ""
    //           ? params.value
    //           : "-"}
    //       </>
    //     );
    //   },
    // },
  ];

  const docsDetailsCol = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 1,
    },
    // {
    //   field: "opinionId",
    //   headerName: language === "en" ? "Opinion No." : "मत क्र.",
    //   flex: 1,
    // },
    {
      field: "originalFileName",
      headerName: language === "en" ? "Document Name" : "दस्तऐवजाचे नाव",
      valueFormatter: (params) =>
        params?.value?.split(".")?.slice(0, -1)?.join("."),
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="uploadedBy" />,
      field: language === "en" ? "attachedNameEn" : "attachedNameMr",
      flex: 1,
    },
    {
      headerName: <FormattedLabel id="actions" />,
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            color="primary"
            onClick={() => {
              console.log("ViewTest", params?.row);
              viewFile(params?.row?.filePath);

              // window.open(
              //   `${urls.CFCURL}/file/preview?filePath=${params?.row?.filePath}`,
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

  // View
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
      {loading ? (
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
        <>
          {/* <ThemeProvider theme={theme}> */}
          {/*  */}
          <ThemeProvider theme={theme}>
            <Paper
              elevation={12}
              variant="outlined"
              sx={{
                border: 2,
                // borderColor: "grey.500",
                borderColor: "grey.500",

                marginLeft: "10px",
                marginRight: "10px",
                // marginTop: "10px",
                marginBottom: "60px",
                padding: 1,
              }}
            >
              <Box
                // style={{
                //   display: "flex",
                //   justifyContent: "center",
                //   paddingTop: "10px",
                //   // backgroundColor:'#0E4C92'
                //   // backgroundColor:'		#0F52BA'
                //   // backgroundColor:'		#0F52BA'
                //   // background: "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                //   background: " #1976d2",
                //   // color: "white"
                // }}

                style={{
                  // backgroundColor: "#0084ff",
                  backgroundColor: "#556CD6",

                  display: "flex",
                  justifyContent: "center",
                  width: "100%",

                  // #00308F
                  color: "white",
                  fontSize: 15,
                  // marginTop: 30,
                  // marginBottom: "50px",
                  // marginTop: ,
                  padding: 8,
                  // paddingLeft: 30,
                  // marginLeft: "50px",
                  height: "8vh",
                  marginRight: "75px",
                  borderRadius: 100,
                }}
              >
                <h2
                  style={{
                    color: "white",
                  }}
                >
                  <FormattedLabel id="opinionDetailsBtn" />
                </h2>
              </Box>

              {/* <Divider /> */}

              <Box
                sx={{
                  marginLeft: 5,
                  marginRight: 5,
                  // marginTop: 2,
                  marginBottom: 5,
                  padding: 1,
                  // border:1,
                  // borderColor:'grey.500'
                }}
              >
                <Box p={4}>
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmitForm)}>
                      {/* First Row */}

                      <Grid
                        container
                        style={{
                          marginLeft: "10px",
                        }}
                      >
                        {/* Opinion Serial Number */}
                        <Grid item xl={3} lg={3} md={3}>
                          <TextField
                            sx={{ width: 250 }}
                            // disabled={router?.query?.pageMode === "View"}
                            id="standard-textarea"
                            label="Serail Number"
                            multiline
                            disabled
                            variant="standard"
                            // style={{ width: 200 }}
                            {...register("opinionNo")}
                            error={!!errors.opinionNo}
                            helperText={
                              errors?.opinionNo
                                ? errors.opinionNo.message
                                : null
                            }
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("opinionNo") ? true : false) ||
                                (router.query.opinionNo ? true : false),
                            }}
                          />
                        </Grid>
                        <Grid item xl={1.5} lg={1.5} maxWidth={1.5}></Grid>

                        {/* Inward Numner */}
                        <Grid item xl={3} lg={3} md={3}>
                          <TextField
                            sx={{ width: 250 }}
                            disabled
                            id="standard-textarea"
                            // label="Inward Number"
                            label={<FormattedLabel id="inwardNo" />}
                            // placeholder="Opinion Subject"
                            multiline
                            variant="standard"
                            // style={{ width: 200 }}
                            {...register("inwardNo")}
                            error={!!errors.inwardNo}
                            helperText={
                              errors?.inwardNo ? errors.inwardNo.message : null
                            }
                            InputLabelProps={{
                              //true
                              shrink:
                                (watch("inwardNo") ? true : false) ||
                                (router.query.inwardNo ? true : false),
                            }}
                          />
                        </Grid>
                        <Grid item xl={1.5} lg={1.5} md={1.5}></Grid>

                        {/* opinionRequestDate */}
                        <Grid item xl={3} lg={3} md={3}>
                          <FormControl fullWidth>
                            <Controller
                              control={control}
                              name="opinionRequestDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    disabled
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 15 }}>
                                        {
                                          <FormattedLabel id="opinionRequestDate" />
                                        }
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => {
                                      field.onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      );
                                      setValue(
                                        "requisitionDate",
                                        moment(date).add(30, "days")
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        // required
                                        {...params}
                                        size="small"
                                        error={
                                          errors?.opinionRequestDate
                                            ? true
                                            : false
                                        }
                                        fullWidth
                                        variant="standard"
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.opinionRequestDate ? (
                                <span style={{ color: "red" }}>
                                  {errors.opinionRequestDate.message}
                                </span>
                              ) : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        {/* Location Name */}

                        {/* <Grid
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
                        marginBottom: "1px",
                        marginTop: "20px",
                      }}
                    >
                      <FormControl
                        // variant="outlined"
                        variant="standard"
                        size="small"
                        // sx={{ m: 1, minWidth: 120 }}
                        error={!!errors.officeLocation}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {/* Location Name */}
                        {/* 
                          {<FormattedLabel id="locationName" />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ width: 200 }}
                              disabled={router?.query?.pageMode === "View"}
                              // sx={{ width: 200 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="locationName" />}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("officeLocation") ? true : false) ||
                                  (router.query.officeLocation ? true : false),
                              }}
                            >
                              {officeName &&
                                officeName.map((officeLocationName, index) => (
                                  <MenuItem
                                    key={index}
                                    value={officeLocationName.id}
                                  >
                                    {language == "en"
                                      ? officeLocationName?.officeLocationName
                                      : officeLocationName?.officeLocationNameMar}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="officeLocation"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.officeLocation
                            ? errors.officeLocation.message
                            : null}
                        </FormHelperText>
                      </FormControl> */}
                        {/* {/* </Grid>  */}
                      </Grid>

                      {/* 2nd Row  */}
                      <Grid
                        container
                        style={{
                          marginLeft: "10px",
                        }}
                      >
                        {/* Location Name  */}

                        <Grid item xl={3} lg={3} md={3}>
                          <FormControl
                            // sx={{ marginTop: 2 }}
                            // required
                            variant="standard"
                            size="small"
                            error={!!errors.officeLocation}
                            sx={{ marginTop: "6vh" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              {<FormattedLabel id="locationName" />}
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ width: 250 }}
                                  disabled
                                  // sx={{ width: 200 }}
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="locationName" />}
                                  InputLabelProps={{
                                    //true
                                    shrink:
                                      (watch("officeLocation")
                                        ? true
                                        : false) ||
                                      (router.query.officeLocation
                                        ? true
                                        : false),
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
                            <FormHelperText>
                              {errors?.officeLocation
                                ? errors.officeLocation.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid ietm xl={1.5} lg={1.5} md={1.5}></Grid>

                        {/* Department Name  */}
                        <Grid iem xl={3} lg={3} md={3}>
                          {/* <FormControl
                        variant='standard'
                        size='small'
                        error={!!errors.concenDeptId}
                      >
                        <InputLabel id='demo-simple-select-standard-label'>
                          {<FormattedLabel id='deptName' />}
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              disabled={router?.query?.pageMode === "View"}
                              sx={{ width: 250 }}
                              value={field.value}
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id='deptName' />}
                              InputLabelProps={{
                                //true
                                shrink:
                                  (watch("concenDeptId") ? true : false) ||
                                  (router.query.concenDeptId ? true : false),
                              }}
                            >
                              {concenDeptNames &&
                                concenDeptNames
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
                                  .map((department, index) => (
                                    <MenuItem key={index} value={department.id}>
                                      {language === "en"
                                        ? department?.department
                                        : department?.departmentMr}
                                    </MenuItem>
                                  ))}
                            </Select>
                          )}
                          name='concenDeptId'
                          control={control}
                          defaultValue=''
                        />
                        <FormHelperText>
                          {errors?.concenDeptId
                            ? errors.concenDeptId.message
                            : null}
                        </FormHelperText>
                      </FormControl> */}

                          {/* Using Autocomplete  */}

                          <FormControl
                            variant="standard"
                            error={errors?.concenDeptId}
                            sx={{ marginTop: 2 }}
                          >
                            <Controller
                              name="concenDeptId"
                              control={control}
                              defaultValue={null}
                              render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                  id="controllable-states-demo"
                                  disabled
                                  // sx={{ width: 300 }}
                                  onChange={(event, newValue) => {
                                    onChange(newValue ? newValue.id : null);
                                  }}
                                  value={
                                    concenDeptNames?.find(
                                      (data) => data?.id === value
                                    ) || null
                                  }
                                  options={concenDeptNames.sort((a, b) =>
                                    language === "en"
                                      ? a.department.localeCompare(b.department)
                                      : a.departmentMr.localeCompare(
                                          b.departmentMr
                                        )
                                  )} //! api Data
                                  getOptionLabel={(department) =>
                                    language == "en"
                                      ? department?.department
                                      : department?.departmentMr
                                  } //! Display name the Autocomplete
                                  renderInput={(params) => (
                                    //! display lable list
                                    <TextField
                                      // required
                                      {...params}
                                      label={
                                        language == "en"
                                          ? "Department Name"
                                          : "विभागाचे नाव"
                                      }
                                      error={
                                        errors?.concenDeptId ? true : false
                                      }
                                    />
                                  )}
                                />
                              )}
                            />
                            <FormHelperText>
                              {errors?.concenDeptId
                                ? errors?.concenDeptId?.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>

                        <Grid item xl={1.5} lg={1.5} md={1.5}></Grid>

                        {/* Requsition Date  */}
                        <Grid item xl={3} lg={3} md={3}>
                          <FormControl
                            style={{
                              width: 250,
                            }}
                          >
                            <Controller
                              control={control}
                              name="requisitionDate"
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider
                                  dateAdapter={AdapterMoment}
                                >
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    disabled
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="requisitionDate" />
                                      </span>
                                    }
                                    value={field.value}
                                    onChange={(date) => {
                                      field.onChange(
                                        moment(date).format("YYYY-MM-DD")
                                      );
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="standard"
                                        sx={{ width: 250 }}
                                        // size="small"
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                          </FormControl>
                        </Grid>
                      </Grid>

                      {/* 3rd Row  */}

                      <Grid
                        container
                        style={{
                          marginLeft: "10px",
                        }}
                      >
                        {/* opinion subject in English  */}
                        <Grid
                          item
                          sx={{
                            marginTop: "5vh",
                          }}
                          xl={12}
                          lg={12}
                          md={12}
                        >
                          <TextField
                            sx={{ width: "100%" }}
                            disabled
                            id="standard-textarea"
                            label={<FormattedLabel id="opinionSubjectEn" />}
                            placeholder="Opinion Subject"
                            multiline
                            variant="standard"
                            {...register("opinionSubject")}
                            error={!!errors.opinionSubject}
                            helperText={
                              errors?.opinionSubject
                                ? errors.opinionSubject.message
                                : null
                            }
                            InputLabelProps={{
                              shrink:
                                (watch("opinionSubject") ? true : false) ||
                                (router.query.opinionSubject ? true : false),
                            }}
                          />
                        </Grid>

                        {/* Button For Translation  */}
                        {/* <Button
                          onClick={() =>
                            transalationApiCall(watch("opinionSubject"))
                          }
                        >
                          Translate
                        </Button> */}

                        {/* <Grid item xl={1.8} lg={1.8} maxWidth={1.8}></Grid> */}
                        {/* opinion subject in Marathi  */}
                        <Grid
                          item
                          sx={{
                            marginTop: "5vh",
                          }}
                          xl={12}
                          lg={12}
                          md={12}
                        >
                          <TextField
                            sx={{ width: "100%" }}
                            disabled
                            id="standard-textarea"
                            label={<FormattedLabel id="opinionSubjectMr" />}
                            placeholder="Opinion Subject"
                            multiline
                            variant="standard"
                            {...register("opinionSubjectMr")}
                            error={!!errors.opinionSubjectMr}
                            helperText={
                              errors?.opinionSubjectMr
                                ? errors.opinionSubjectMr.message
                                : null
                            }
                            InputLabelProps={{
                              shrink:
                                (watch("opinionSubjectMr") ? true : false) ||
                                (router.query.opinionSubjectMr ? true : false),
                            }}
                          />

                          {/* Transliteration For Translation  */}
                          {/* <Transliteration
                            multiline
                            _key={"opinionSubjectMr"}
                            labelName={"opinionSubjectMr"}
                            fieldName={"opinionSubjectMr"}
                            updateFieldName={"opinionSubject"}
                            sourceLang={"mar"}
                            targetLang={"eng"}
                            // disabled={disabled}
                            disabled={router?.query?.pageMode === "View"}
                            label={
                              <FormattedLabel id="opinionSubjectMr" required />
                            }
                            error={!!errors.opinionSubjectMr}
                            helperText={
                              errors?.opinionSubjectMr
                                ? errors.opinionSubjectMr.message
                                : null
                            }
                          /> */}
                        </Grid>
                      </Grid>

                      <Grid mt={5} border>
                        <Grid item lg={12}>
                          <Accordion elevation={0}>
                            {/* title */}
                            <AccordionSummary
                              style={{
                                backgroundColor: "#0084ff",
                                textTransform: "uppercase",
                                border: "1px solid white",
                                marginLeft: "12px",
                              }}
                              elevation={10}
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "white" }} />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              backgroundColor="#0070f3"
                            >
                              <Typography
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >
                                {/* Clerk details */}
                                <FormattedLabel id="clerkOpinion" />
                              </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                              <Grid container>
                                <Grid item lg={12} xs={12}>
                                  <DataGrid
                                    sx={{
                                      overflowY: "scroll",

                                      [`& .${gridClasses.cell}`]: {
                                        py: 1,
                                      },

                                      "& .MuiDataGrid-virtualScrollerContent":
                                        {},
                                      "& .MuiDataGrid-columnHeadersInner": {
                                        // backgroundColor: "#076ee6",
                                        backgroundColor: "white",
                                        // color: "white",
                                      },

                                      "& .MuiDataGrid-cell:hover": {
                                        color: "primary.main",
                                      },
                                    }}
                                    // density="compact"
                                    autoHeight
                                    scrollbarSize={17}
                                    rows={clerkData}
                                    columns={clerkColumn}
                                    pageSize={10}
                                    pagination
                                    paginationMode="server"
                                    rowsPerPageOptions={[10]}
                                    getRowHeight={() => "auto"}
                                  />
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                        {/* opinionAdvPanelList */}
                        <Grid item lg={12}>
                          <Accordion elevation={0}>
                            {/* title */}
                            <AccordionSummary
                              style={{
                                backgroundColor: "#0084ff",
                                color: "#ffffff",
                                textTransform: "uppercase",
                                border: "1px solid white",
                                // marginTop:"2px"
                                marginLeft: "12px",
                                // boxShadow:10
                              }}
                              elevation={10}
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "white" }} />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              backgroundColor="#0070f3"
                            >
                              <Typography
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >
                                {/* Opinion Advocate details */}
                                <FormattedLabel id="opinionForPanelAdvocate" />
                              </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                              <Grid container>
                                <Grid item lg={12} xs={12}>
                                  <DataGrid
                                    sx={{
                                      overflowY: "scroll",

                                      [`& .${gridClasses.cell}`]: {
                                        py: 1,
                                      },

                                      "& .MuiDataGrid-virtualScrollerContent":
                                        {},
                                      "& .MuiDataGrid-columnHeadersInner": {
                                        // backgroundColor: "#076ee6",
                                        // color: "white",
                                      },

                                      "& .MuiDataGrid-cell:hover": {
                                        color: "primary.main",
                                      },
                                    }}
                                    autoHeight
                                    scrollbarSize={17}
                                    rows={opinionAdvocateData}
                                    columns={advocateHistoryColumns}
                                    pageSize={10}
                                    pagination
                                    paginationMode="server"
                                    rowsPerPageOptions={[10]}
                                    getRowHeight={() => "auto"}
                                  />
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                        {/* reportAdvPanelList */}
                        <Grid item lg={12}>
                          <Accordion elevation={0}>
                            {/* title */}
                            <AccordionSummary
                              style={{
                                backgroundColor: "#0084ff",
                                color: "white",
                                textTransform: "uppercase",
                                border: "1px solid white",
                                // marginTop:"2px"
                                marginLeft: "12px",
                                // boxShadow:10
                              }}
                              elevation={10}
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "white" }} />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              backgroundColor="#0070f3"
                            >
                              <Typography
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >
                                {/* Report Advocate details */}
                                <FormattedLabel id="opinionForSearchTitleReport" />
                              </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                              <Grid container>
                                <Grid item lg={12} xs={12}>
                                  <DataGrid
                                    sx={{
                                      overflowY: "scroll",

                                      [`& .${gridClasses.cell}`]: {
                                        py: 1,
                                      },

                                      "& .MuiDataGrid-virtualScrollerContent":
                                        {},
                                      "& .MuiDataGrid-columnHeadersInner": {
                                        // backgroundColor: "#076ee6",
                                        // color: "white",
                                      },

                                      "& .MuiDataGrid-cell:hover": {
                                        color: "primary.main",
                                      },
                                    }}
                                    autoHeight
                                    scrollbarSize={17}
                                    rows={reportAdvocateData}
                                    columns={advocateHistoryColumns}
                                    pageSize={10}
                                    pagination
                                    paginationMode="server"
                                    rowsPerPageOptions={[10]}
                                    getRowHeight={() => "auto"}
                                  />
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>

                        {/* HodList */}
                        <Grid item lg={12}>
                          <Accordion elevation={0}>
                            {/* title */}
                            <AccordionSummary
                              style={{
                                backgroundColor: "#0084ff",
                                color: "white",
                                textTransform: "uppercase",
                                border: "1px solid white",
                                // marginTop:"2px"
                                marginLeft: "12px",
                                // boxShadow:10
                              }}
                              elevation={10}
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "white" }} />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              backgroundColor="#0070f3"
                            >
                              <Typography
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >
                                {/* HOD details */}
                                <FormattedLabel id="hodOpinion" />
                              </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                              <Grid container>
                                <Grid item lg={12} xs={12}>
                                  <DataGrid
                                    sx={{
                                      overflowY: "scroll",

                                      [`& .${gridClasses.cell}`]: {
                                        py: 1,
                                      },

                                      "& .MuiDataGrid-virtualScrollerContent":
                                        {},
                                      "& .MuiDataGrid-columnHeadersInner": {
                                        // backgroundColor: "#076ee6",
                                        // color: "white",
                                      },

                                      "& .MuiDataGrid-cell:hover": {
                                        color: "primary.main",
                                      },
                                    }}
                                    autoHeight
                                    scrollbarSize={17}
                                    rows={hodData}
                                    columns={hodColumn}
                                    pageSize={10}
                                    pagination
                                    paginationMode="server"
                                    rowsPerPageOptions={[10]}
                                    getRowHeight={() => "auto"}
                                  />
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                        {/* DOCUMENTDETAILS */}
                        <Grid item lg={12}>
                          <Accordion elevation={0}>
                            {/* title */}
                            <AccordionSummary
                              style={{
                                backgroundColor: "#0084ff",
                                color: "white",
                                textTransform: "uppercase",
                                border: "1px solid white",
                                // marginTop:"2px"
                                marginLeft: "12px",
                                // boxShadow:10
                              }}
                              elevation={10}
                              expandIcon={
                                <ExpandMoreIcon sx={{ color: "white" }} />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              backgroundColor="#0070f3"
                            >
                              <Typography
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >
                                {language === "en"
                                  ? "Documents Details"
                                  : "दस्तऐवज तपशील"}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container>
                                <Grid item lg={12} xs={12}>
                                  <DataGrid
                                    sx={{
                                      overflowY: "scroll",

                                      [`& .${gridClasses.cell}`]: {
                                        py: 1,
                                      },

                                      "& .MuiDataGrid-virtualScrollerContent":
                                        {},
                                      "& .MuiDataGrid-columnHeadersInner": {
                                        // backgroundColor: "#076ee6",
                                        // color: "white",
                                      },

                                      "& .MuiDataGrid-cell:hover": {
                                        color: "primary.main",
                                      },
                                    }}
                                    autoHeight
                                    scrollbarSize={17}
                                    rows={docsDetails}
                                    columns={docsDetailsCol}
                                    pageSize={10}
                                    pagination
                                    paginationMode="server"
                                    rowsPerPageOptions={[10]}
                                    getRowHeight={() => "auto"}
                                  />
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      </Grid>

                      {/* Row Button */}

                      <Grid container mt={10} ml={5} mb={5} border px={5}>
                        <Button
                          variant="contained"
                          onClick={() => router.back()}
                          style={{ margin: "0 auto" }}
                        >
                          {<FormattedLabel id="exit" />}
                        </Button>
                      </Grid>
                    </form>
                  </FormProvider>
                </Box>
              </Box>
            </Paper>
          </ThemeProvider>
          {/* </ThemeProvider> */}
        </>
      )}

      {/*  */}
    </>
  );
};

export default View;
