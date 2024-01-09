import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

// import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

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
import DOMPurify from "dompurify";
import Documents from "../addOpinion/Documents.js";

import styles from "../../../../styles/LegalCase_Styles/opinion.module.css";

const View = () => {
  const language = useSelector((state) => state.labels.language);
  const [loadderState, setLoadderState] = useState(true);

  // HYPERLINKS CHECKED
  const [messageToShowOnError, setMessageToShowOnError] = useState("");
  const [messageToShowOnErrorMr, setMessageToShowOnErrorMr] = useState("");

  // inwardNo
  const [inwardNoFiledChk, setInwardNoFiledChk] = useState(true);

  const error1Messsage = () => {
    if (language == "en") {
      return messageToShowOnError;
    } else {
      return messageToShowOnErrorMr;
    }
  };

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
    clearErrors,
    formState: { errors },
  } = methods;

  const router = useRouter();
  const [loading, setLoading] = useState(false);

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

  const _opinionRequestDate = watch("opinionRequestDate");

  const _concenDeptId = watch("concenDeptId");
  const _opinionSubject = watch("opinionSubject");
  const _officeLocation = watch("officeLocation");
  const _panelRemarks = watch("panelRemarks");
  const abc = watch("opinionRequestDate");

  const user = useSelector((state) => state.user.user);

  const [document, setDocument] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);

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
            // FullName: r.firstName + "  " + r.middleName + "  " + r.lastName,
            // FullNameMr:
            //   r.firstNameMr + "  " + r.middleNameMr + "  " + r.lastNameMr,

            FullName: `${r.firstName ?? ""} ${r.middleName ?? ""} ${
              r.lastName ?? ""
            }`.trim(),
            FullNameMr: `${r.firstNameMr ?? ""} ${r.middleNameMr ?? ""} ${
              r.lastNameMr ?? ""
            }`.trim(),
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
    //

    const requisitionDate = moment(Data.requisitionDate).format("YYYY-MM-DD");

    //

    console.log(
      "LCMS: onSubmitForm - selectedId =",
      JSON.stringify(selectedID)
    );

    let _attachedDocs = JSON.parse(
      localStorage.getItem("trnOpinionAttachmentDao")
    )?.map((item) => {
      return {
        attachedNameMr: `${user?.userDao?.firstNameMr} ${user?.userDao?.middleNameMr} ${user?.userDao?.lastNameMr}`,
        attachedDate: item?.attachedDate,
        attachedNameEn: item?.attachedNameEn,
        extension: item?.extension,
        filePath: item?.filePath,
        originalFileName: item?.originalFileName,
        srNo: item?.srNo,
      };
    });

    setDocument(
      additionalFiles.map((Obj, index) => {
        return {
          // attachedNameEn: Obj.attachedNameEn,
          attachedNameEn:
            user?.userDao?.firstNameEn + " " + user?.userDao?.lastNameEn,
          attachedNameMr:
            user?.userDao?.firstNameMr + " " + user?.userDao?.lastNameMr,
          // attachedNameMr: Obj.attachedNameMr,
          attachedDate: Obj.attachedDate,
          originalFileName: Obj.originalFileName,
          attachmentNameEng: Obj.attachmentName,
          extension: Obj.extension,
        };
      })
    );

    let body1 = {
      ...Data,
      opinionRequestDate,
      requisitionDate,
      trnOpinionAttachmentDao: _attachedDocs,

      // status: "OPINION_SUBMITTED",
    };

    let body2 = {
      ...Data,
      opinionRequestDate,
      requisitionDate,
      trnOpinionAttachmentDao: _attachedDocs,

      opinionAdvPanelList: selectedID.map((val) => {
        return {
          advocate: val,
        };
      }),

      status:
        buttonText === "saveAsDraft" ? "OPINION_DRAFT" : "OPINION_CREATED",
      sentToAdvocate: buttonText === "saveAsDraft" ? "N" : "Y",
      role:
        buttonText === "saveAsDraft"
          ? "OPINION_SAVE_AS_DRAFT"
          : "CREATE_OPINION",

      reportAdvPanelList: selectedID1.map((val) => {
        return {
          advocate: val,
        };
      }),

      id: router.query.pageMode == "Opinion" ? null : Data.id,
    };

    // console.log("LCMS: body =", body);

    // Exp

    //  Condition
    if (watch("clerkRemarkEn") && watch("clerkRemarkMr")) {
      axios
        .post(`${urls.LCMSURL}/transaction/opinion/save`, body1, {
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
    } else {
      axios
        .post(`${urls.LCMSURL}/transaction/opinion/save`, body2, {
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
    }

    setLoadderState(true);
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

  // --------------------------Transaltion API--------------------------------
  const transalationApiCall = (
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

  useEffect(() => {
    const hyperlinkRegex = /https?:\/\/|ftp:\/\//i;
    const csvRegex = /,\s*=/;
    const noSpecialCharRegex = /^(=).*/;

    const checkField = (fieldName, setFieldChk) => {
      const fieldValue = watch(fieldName);

      if (!fieldValue) {
        setFieldChk(true);
        return;
      }

      if (!noSpecialCharRegex.test(fieldValue)) {
        setFieldChk(true);

        if (!hyperlinkRegex.test(fieldValue)) {
          setFieldChk(true);

          if (csvRegex.test(fieldValue)) {
            setFieldChk(false);
            setMessageToShowOnError("Potential CSV injection detected! 😣");
            setMessageToShowOnErrorMr("संभाव्य CSV इंजेक्शन आढळले! 😣");
          } else {
            const sanitizedValue = DOMPurify.sanitize(fieldValue);

            if (fieldValue !== sanitizedValue) {
              setFieldChk(false);
              setMessageToShowOnError(
                "Potential HTML/Script injection detected! 😣"
              );
              setMessageToShowOnErrorMr(
                "संभाव्य एचटीएमएल/स्क्रिप्ट इंजेक्शन आढळले! 😣"
              );
            } else {
              setFieldChk(true);
            }
          }
        } else {
          setFieldChk(false);
          setMessageToShowOnError("Hyperlink is not allowed 😒");
          setMessageToShowOnErrorMr("हायपरलिंकला परवानगी नाही 😒");
        }
      } else {
        setFieldChk(false);
        setMessageToShowOnError(
          "Value should not start with any special character 😒"
        );
        setMessageToShowOnErrorMr(
          "मूल्य कोणत्याही विशेष वर्णाने सुरू होऊ नये 😒"
        );
      }
    };

    checkField("inwardNo", setInwardNoFiledChk);
  }, [watch("inwardNo")]);

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
      {loadderState ? (
        <Loader />
      ) : (
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
                style={{
                  // backgroundColor: "#0084ff",
                  backgroundColor: "#556CD6",

                  display: "flex",
                  justifyContent: "center",
                  width: "100%",

                  color: "white",
                  fontSize: 15,

                  padding: 8,

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
                  {" "}
                  <FormattedLabel id="opinion" />
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
                            label={<FormattedLabel id="serialNo" />}
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
                            disabled={router?.query?.pageMode === "View"}
                            id="standard-textarea"
                            // label="Inward Number"
                            label={<FormattedLabel id="inwardNo" />}
                            multiline
                            variant="standard"
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

                          <FormHelperText style={{ color: "red" }}>
                            {!inwardNoFiledChk ? error1Messsage() : ""}
                          </FormHelperText>
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
                                    disabled={
                                      router?.query?.pageMode === "View"
                                    }
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
                                  disabled={router?.query?.pageMode === "View"}
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
                                  disabled={router?.query?.pageMode === "View"}
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
                            sx={{ width: "86%" }}
                            disabled={router?.query?.pageMode === "View"}
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

                          {/*  Button For Translation */}
                          <Button
                            sx={{
                              marginTop: "40px",
                              marginLeft: "1vw",
                              height: "5vh",
                              width: "9vw",
                            }}
                            onClick={() =>
                              transalationApiCall(
                                watch("opinionSubject"),
                                "opinionSubjectMr",
                                "en"
                              )
                            }
                          >
                            {/* Translate */}
                            <FormattedLabel id="mar" />
                          </Button>
                          {/* Transliteration For Translation  */}

                          {/* <Transliteration
                            multiline
                            // multiple
                            _key={"opinionSubject"}
                            labelName={"opinionSubject"}
                            fieldName={"opinionSubject"}
                            updateFieldName={"opinionSubjectMr"}
                            sourceLang={"eng"}
                            targetLang={"mar"}
                            // disabled={disabled}
                            disabled={router?.query?.pageMode === "View"}
                            label={
                              <FormattedLabel id="opinionSubjectEn" required />
                            }
                            error={!!errors.opinionSubject}
                            helperText={
                              errors?.opinionSubject
                                ? errors.opinionSubject.message
                                : null
                            }
                            InputLabelProps={{}}
                          /> */}
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
                            sx={{ width: "86%" }}
                            disabled={router?.query?.pageMode === "View"}
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

                          <Button
                            sx={{
                              marginTop: "40px",
                              marginLeft: "1vw",
                              height: "5vh",
                              width: "9vw",
                            }}
                            onClick={() =>
                              transalationApiCall(
                                watch("opinionSubjectMr"),
                                "opinionSubject",
                                "mr"
                              )
                            }
                          >
                            {/* Translate */}
                            <FormattedLabel id="eng" />
                          </Button>

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

                      <Grid
                        container
                        style={{
                          marginLeft: "10px",
                          marginTop: "5vh",
                        }}
                      >
                        <Grid item xl={3} lg={3} md={3}>
                          <FormControlLabel
                            // disabled={
                            //   disabled
                            //     ? true
                            //     : getValues("isApplicantBride")
                            //     ? true
                            //     : false
                            // }
                            sx={{
                              marginTop: "5vh",
                            }}
                            control={
                              <Checkbox
                                // {...register("advPanel")}
                                disabled={router?.query?.pageMode === "View"}
                                checked={
                                  getValues("advPanel")
                                    ? getValues("advPanel")
                                    : false
                                }
                              />
                            }
                            label={<FormattedLabel id="advPanel" />}
                            onChange={(e) => {
                              checkBox1(e);
                            }}
                          />
                          {console.log("advPanel123", getValues("advPanel"))}
                        </Grid>
                        <Grid item xl={1.5} lg={1.5} md={1.5}></Grid>
                        <Grid item xl={3} lg={3} md={3}>
                          {isOpenCollapse1 && (
                            <>
                              <Box>
                                <FormControl variant="standard">
                                  <Autocomplete
                                    disabled={
                                      router?.query?.pageMode === "View"
                                    }
                                    multiple
                                    value={selected}
                                    onChange={handleChange}
                                    renderValue={(selected) => {
                                      return selected
                                        .map((item) => item.FullName)
                                        .join(", ");
                                    }}
                                    options={advocateNames
                                      .slice()
                                      .sort((a, b) =>
                                        a.FullName.localeCompare(b.FullName)
                                      )}
                                    getOptionLabel={(option) =>
                                      language === "en"
                                        ? option?.FullName
                                        : option?.FullNameMr
                                    }
                                    renderOption={(props, option) => (
                                      <li {...props}>
                                        <Checkbox
                                          checked={
                                            selected.indexOf(option) > -1
                                          }
                                        />
                                        {language === "en"
                                          ? option?.FullName
                                          : option?.FullNameMr}
                                      </li>
                                    )}
                                    disableCloseOnSelect
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label={
                                          <FormattedLabel id="advocateName" />
                                        }
                                      />
                                    )}
                                  />
                                </FormControl>
                              </Box>

                              {/* Client told to use Autocomplete component instead of Select component */}
                              {/* <Box>
                                <FormControl variant="standard">
                                  <InputLabel htmlFor="age-native-simple">
                                    <FormattedLabel id="advocateName" />
                                  </InputLabel>
                                  <Select
                                    disabled={
                                      router?.query?.pageMode === "View"
                                    }
                                    multiple
                                    value={selected}
                                    name="first"
                                    onChange={handleChange}
                                    renderValue={(selected) =>
                                      selected.join(", ")
                                    }
                                  >
                                    {advocateNames
                                      .slice()
                                      .sort((a, b) =>
                                        a.FullName.localeCompare(b.FullName)
                                      )
                                      .map((advocateName) => (
                                        <MenuItem
                                          key={advocateName.id}
                                          value={advocateName.FullName}
                                        >
                                          <Checkbox
                                            checked={
                                              selected.indexOf(
                                                advocateName.FullName
                                              ) > -1
                                            }
                                          />
                                          <ListItemText
                                            primary={
                                              language === "en"
                                                ? advocateName?.FullName
                                                : advocateName?.FullNameMr
                                            }
                                          />
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Box> */}
                            </>
                          )}
                        </Grid>
                      </Grid>

                      {/* 5th row for panel advocate remark in English */}
                      <Grid
                        container
                        sx={{
                          marginTop: "7vh",
                        }}
                      >
                        <Grid item xl={12} lg={12} md={12}>
                          {isOpenCollapse1 && (
                            <>
                              <TextField
                                sx={{
                                  width: "87%",
                                }}
                                id="standard-textarea"
                                disabled={router?.query?.pageMode === "View"}
                                label={<FormattedLabel id="remarksEn" />}
                                multiline
                                variant="standard"
                                {...register("panelRemarks")}
                                error={!!errors.panelRemarks}
                                helperText={
                                  errors?.panelRemarks
                                    ? errors.panelRemarks.message
                                    : null
                                }
                              />

                              <Button
                                sx={{
                                  marginTop: "40px",
                                  marginLeft: "1vw",
                                  height: "5vh",
                                  width: "9vw",
                                }}
                                onClick={() =>
                                  transalationApiCall(
                                    watch("panelRemarks"),
                                    "panelRemarksMr",
                                    "en"
                                  )
                                }
                              >
                                {/* Translate */}
                                <FormattedLabel id="mar" />
                              </Button>
                            </>

                            //

                            // Transliteration For Translation
                            // <Transliteration
                            //   disabled={router?.query?.pageMode === "View"}
                            //   _key={"panelRemarks"}
                            //   labelName={"panelRemarks"}
                            //   fieldName={"panelRemarks"}
                            //   updateFieldName={"panelRemarksMr"}
                            //   sourceLang={"eng"}
                            //   targetLang={"mar"}
                            //   // disabled={disabled}
                            //   label={<FormattedLabel id="remarksEn" required />}
                            //   error={!!errors.panelRemarks}
                            //   helperText={
                            //     errors?.panelRemarks
                            //       ? errors.panelRemarks.message
                            //       : null
                            //   }
                            //   InputLabelProps={{
                            //     //true
                            //     shrink:
                            //       (watch("panelRemarks") ? true : false) ||
                            //       (router.query.panelRemarks ? true : false),
                            //   }}
                            // />
                          )}
                        </Grid>
                      </Grid>

                      {/* 6th row for panel adv
                      ocate remark in marathi  */}

                      <Grid
                        container
                        sx={{
                          marginTop: "7vh",
                        }}
                      >
                        <Grid ietm xl={12} lg={12} md={12}>
                          {isOpenCollapse1 && (
                            <>
                              <TextField
                                sx={{
                                  width: "87%",
                                }}
                                id="standard-textarea"
                                disabled={router?.query?.pageMode === "View"}
                                label={<FormattedLabel id="remarksMr" />}
                                multiline
                                variant="standard"
                                {...register("panelRemarksMr")}
                                error={!!errors.panelRemarksMr}
                                helperText={
                                  errors?.panelRemarksMr
                                    ? errors.panelRemarksMr.message
                                    : null
                                }
                                InputLabelProps={{
                                  shrink: true, // This controls label shrinking behavior
                                }}
                              />

                              <Button
                                sx={{
                                  marginTop: "40px",
                                  marginLeft: "1vw",
                                  height: "5vh",
                                  width: "9vw",
                                }}
                                onClick={() =>
                                  transalationApiCall(
                                    watch("panelRemarksMr"),
                                    "panelRemarks",
                                    "mr"
                                  )
                                }
                              >
                                {/* Translate */}
                                <FormattedLabel id="eng" />
                              </Button>
                            </>

                            // Transliteration for Translation
                            // <Transliteration
                            //   disabled={router?.query?.pageMode === "View"}
                            //   _key={"panelRemarksMr"}
                            //   labelName={"panelRemarksMr"}
                            //   fieldName={"panelRemarksMr"}
                            //   updateFieldName={"panelRemarks"}
                            //   sourceLang={"mar"}
                            //   targetLang={"eng"}
                            //   // disabled={disabled}
                            //   label={<FormattedLabel id="remarksMr" required />}
                            //   error={!!errors.panelRemarksMr}
                            //   helperText={
                            //     errors?.panelRemarksMr
                            //       ? errors.panelRemarksMr.message
                            //       : null
                            //   }
                            //   InputLabelProps={{
                            //     //true
                            //     shrink:
                            //       (watch("panelRemarksMr") ? true : false) ||
                            //       (router.query.panelRemarksMr ? true : false),
                            //   }}
                            // />
                          )}
                        </Grid>
                      </Grid>
                      {/* 7th row search title panel advocate checkbox */}
                      <Grid
                        container
                        style={{
                          marginLeft: "10px",
                          marginTop: "9vh",
                        }}
                      >
                        <Grid
                          item
                          // style={{
                          //   marginBottom: "20px",
                          //   background: "red",
                          // }}
                          xl={3}
                          lg={3}
                          md={3}
                          sx={{
                            marginTop: "4vh",
                          }}
                        >
                          {/* {console.log(
                        "reportAdvPanel***",
                        getValues("reportAdvPanel")
                      )}{" "} */}
                          <FormControlLabel
                            // disabled={
                            //   disabled
                            //     ? true
                            //     : getValues("isApplicantBride")
                            //     ? true
                            //     : false
                            // }

                            control={
                              <Checkbox
                                // {...register("reportAdvPanel")}
                                disabled={router?.query?.pageMode === "View"}
                                checked={
                                  getValues("reportAdvPanel")
                                    ? getValues("reportAdvPanel")
                                    : false
                                }
                                // checked={getValues("reportAdvPanel")}
                              />
                            }
                            label={<FormattedLabel id="reportAdvPanel" />}
                            onChange={(e) => {
                              checkBox2(e);
                            }}
                          />
                        </Grid>
                        <Grid item xl={1.5} lg={1.5} md={1.5}></Grid>
                        <Grid item xl={3} lg={3} md={3}>
                          {" "}
                          {isOpenCollapse2 && (
                            <Box>
                              {/* <FormControl variant='standard'>
                            <InputLabel htmlFor='age-native-simple'>
                              <FormattedLabel id='advocateName' />
                            </InputLabel>
                            <Select
                              multiple
                              disabled={router?.query?.pageMode === "View"}
                              value={selected1}
                              name='first'
                              onChange={handleChange1}
                              renderValue={(selected) => selected.join(", ")}
                            >
                              {advocateNames
                                .sort((a, b) =>
                                  a.FullName.localeCompare(
                                    b.FullName,
                                    undefined,
                                    {
                                      sensitivity: "base",
                                    }
                                  )
                                )
                                .map((advocateNames) => (
                                  <MenuItem
                                    key={advocateNames.id}
                                    value={advocateNames.FullName}
                                  >
                                    <Checkbox
                                      checked={
                                        selected1.indexOf(
                                          advocateNames.FullName
                                        ) > -1
                                      }
                                    />
                                    <ListItemText
                                      primary={
                                        // advocateNames.FullName

                                        language === "en"
                                          ? advocateNames?.FullName
                                          : advocateNames?.FullNameMr
                                      }
                                    />
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl> */}
                              <FormControl variant="standard">
                                <Autocomplete
                                  disabled={router?.query?.pageMode === "View"}
                                  multiple
                                  value={selected1}
                                  onChange={handleChange1}
                                  renderValue={(selected) =>
                                    selected.join(", ")
                                  }
                                  options={advocateNames
                                    .slice()
                                    .sort((a, b) =>
                                      a.FullName.localeCompare(b.FullName)
                                    )}
                                  getOptionLabel={(option) =>
                                    language === "en"
                                      ? option?.FullName
                                      : option?.FullNameMr
                                  }
                                  renderOption={(props, option) => (
                                    <li {...props}>
                                      <Checkbox
                                        checked={selected1.indexOf(option) > -1}
                                      />
                                      {language === "en"
                                        ? option?.FullName
                                        : option?.FullNameMr}
                                    </li>
                                  )}
                                  disableCloseOnSelect
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={
                                        <FormattedLabel id="advocateName" />
                                      }
                                    />
                                  )}
                                />

                                {/* <InputLabel htmlFor="age-native-simple">
                                  <FormattedLabel id="advocateName" />
                                </InputLabel>
                                <Select
                                  multiple
                                  disabled={router?.query?.pageMode === "View"}
                                  value={selected1}
                                  name="first"
                                  onChange={handleChange1}
                                  renderValue={(selected) =>
                                    selected.join(", ")
                                  }
                                >
                                  {advocateNames
                                    .slice()
                                    .sort((a, b) =>
                                      a.FullName.localeCompare(b.FullName)
                                    )
                                    .map((advocateNames) => (
                                      <MenuItem
                                        key={advocateNames.id}
                                        value={advocateNames.FullName}
                                      >
                                        <Checkbox
                                          checked={
                                            selected1.indexOf(
                                              advocateNames.FullName
                                            ) > -1
                                          }
                                        />
                                        <ListItemText
                                          primary={
                                            // advocateNames.FullName

                                            language === "en"
                                              ? advocateNames?.FullName
                                              : advocateNames?.FullNameMr
                                          }
                                        />
                                      </MenuItem>
                                    ))}
                                </Select> */}
                              </FormControl>
                            </Box>
                          )}
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        sx={{
                          marginTop: "7vh",
                        }}
                      >
                        <Grid item xl={12} lg={12} md={12}>
                          {isOpenCollapse2 && (
                            <>
                              <Box>
                                <TextField
                                  sx={{
                                    width: "87%",
                                  }}
                                  id="standard-textarea"
                                  disabled={router?.query?.pageMode === "View"}
                                  label={<FormattedLabel id="remarksEn" />}
                                  multiline
                                  variant="standard"
                                  {...register("reportRemarks")}
                                  InputLabelProps={{
                                    shrink:
                                      (watch("reportRemarks") ? true : false) ||
                                      (router.query.reportRemarks
                                        ? true
                                        : false),
                                  }}
                                  error={!!errors.reportRemarks}
                                  helperText={
                                    errors?.reportRemarks
                                      ? errors.reportRemarks.message
                                      : null
                                  }
                                />
                                <Button
                                  sx={{
                                    marginTop: "40px",
                                    marginLeft: "1vw",
                                    height: "5vh",
                                    width: "9vw",
                                  }}
                                  onClick={() =>
                                    transalationApiCall(
                                      watch("reportRemarks"),
                                      "reportRemarksMr",
                                      "en"
                                    )
                                  }
                                >
                                  {/* Translate */}
                                  <FormattedLabel id="mar" />
                                </Button>

                                {/* Transliteration for Translation  */}

                                {/* <Transliteration
                                  disabled={router?.query?.pageMode === "View"}
                                  _key={"reportRemarks"}
                                  labelName={"reportRemarks"}
                                  fieldName={"reportRemarks"}
                                  updateFieldName={"reportRemarksMr"}
                                  sourceLang={"eng"}
                                  targetLang={"mar"}
                                  // disabled={disabled}
                                  label={
                                    <FormattedLabel id="remarksEn" required />
                                  }
                                  error={!!errors.reportRemarks}
                                  helperText={
                                    errors?.reportRemarks
                                      ? errors.reportRemarks.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    shrink:
                                      (watch("reportRemarks") ? true : false) ||
                                      (router.query.reportRemarks
                                        ? true
                                        : false),
                                  }}
                                /> */}
                              </Box>
                            </>
                          )}
                        </Grid>
                      </Grid>

                      {/* 9th row for search title panela advocate remark in maratahi  */}
                      <Grid
                        container
                        sx={{
                          marginTop: "7vh",
                        }}
                      >
                        <Grid item xl={12} lg={12} md={12}>
                          {isOpenCollapse2 && (
                            <>
                              <Box>
                                <TextField
                                  sx={{
                                    width: "87%",
                                  }}
                                  id="standard-textarea"
                                  disabled={router?.query?.pageMode === "View"}
                                  label={<FormattedLabel id="remarksMr" />}
                                  multiline
                                  variant="standard"
                                  {...register("reportRemarksMr")}
                                  InputLabelProps={{
                                    //true
                                    shrink:
                                      (watch("reportRemarksMr")
                                        ? true
                                        : false) ||
                                      (router.query.reportRemarksMr
                                        ? true
                                        : false),
                                  }}
                                  error={!!errors.reportRemarksMr}
                                  helperText={
                                    errors?.reportRemarksMr
                                      ? errors.reportRemarksMr.message
                                      : null
                                  }
                                />

                                <Button
                                  sx={{
                                    marginTop: "40px",
                                    marginLeft: "1vw",
                                    height: "5vh",
                                    width: "9vw",
                                  }}
                                  onClick={() =>
                                    transalationApiCall(
                                      watch("reportRemarksMr"),
                                      "reportRemarks",
                                      "mr"
                                    )
                                  }
                                >
                                  {/* Translate */}
                                  <FormattedLabel id="eng" />
                                </Button>

                                {/* Transliteration for Translation  */}

                                {/* <Transliteration
                                  _key={"reportRemarksMr"}
                                  labelName={"reportRemarksMr"}
                                  fieldName={"reportRemarksMr"}
                                  updateFieldName={"reportRemarks"}
                                  sourceLang={"mar"}
                                  targetLang={"eng"}
                                  label={
                                    <FormattedLabel id="remarksMr" required />
                                  }
                                  error={!!errors.reportRemarksMr}
                                  helperText={
                                    errors?.reportRemarksMr
                                      ? errors.reportRemarksMr.message
                                      : null
                                  }
                                  InputLabelProps={{
                                    //true
                                    shrink:
                                      (watch("reportRemarksMr")
                                        ? true
                                        : false) ||
                                      (router.query.reportRemarksMr
                                        ? true
                                        : false),
                                  }}
                                /> */}
                              </Box>
                            </>
                          )}
                        </Grid>
                      </Grid>

                      {/* OPinion From Clerk  */}
                      {isOpenCollapse3 && (
                        <>
                          <Grid container sx={{ padding: "10px" }}>
                            <Grid
                              item
                              xs={12}
                              xl={12}
                              md={12}
                              sm={12}
                              // sx={{
                              //   display: "flex",
                              //   justifyContent: "center",
                              //   alignItems: "center",
                              // }}
                            >
                              <TextField
                                id="standard-textarea"
                                // label={<FormattedLabel id="clerkOpinionEn" />}
                                // opinion
                                label={<FormattedLabel id="opinionEn" />}
                                // label="Clerk Remark in English"

                                multiline
                                sx={{
                                  width: "87%",
                                }}
                                variant="standard"
                                {...register("clerkRemarkEn")}
                                InputLabelProps={{
                                  //true
                                  shrink:
                                    (watch("clerkRemarkEn") ? true : false) ||
                                    (router.query.clerkRemarkEn ? true : false),
                                }}
                              />

                              <Button
                                sx={{
                                  marginTop: "40px",
                                  marginLeft: "1vw",
                                  height: "5vh",
                                  width: "9vw",
                                }}
                                onClick={() =>
                                  transalationApiCall(
                                    watch("clerkRemarkEn"),
                                    "clerkRemarkMr",
                                    "en"
                                  )
                                }
                              >
                                {/* Translate */}
                                <FormattedLabel id="mar" />
                              </Button>
                            </Grid>

                            <Grid
                              item
                              xs={12}
                              xl={12}
                              md={12}
                              sm={12}
                              // sx={{
                              //   display: "flex",
                              //   justifyContent: "center",
                              //   alignItems: "center",
                              // }}
                            >
                              <TextField
                                id="standard-textarea"
                                // label={<FormattedLabel id="clerkOpinionMr" />}

                                // opinionMr
                                label={<FormattedLabel id="opinionMr" />}
                                multiline
                                // style={{ width: 1000, marginTop: "20px" }}
                                sx={{
                                  width: "87%",
                                }}
                                variant="standard"
                                {...register("clerkRemarkMr")}
                                InputLabelProps={{
                                  //true
                                  shrink:
                                    (watch("clerkRemarkMr") ? true : false) ||
                                    (router.query.clerkRemarkMr ? true : false),
                                }}
                              />

                              <Button
                                sx={{
                                  marginTop: "40px",
                                  marginLeft: "1vw",
                                  height: "5vh",
                                  width: "9vw",
                                }}
                                onClick={() =>
                                  transalationApiCall(
                                    watch("clerkRemarkMr"),
                                    "clerkRemarkEn",
                                    "en"
                                  )
                                }
                              >
                                {/* Translate */}
                                <FormattedLabel id="eng" />
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      )}

                      <div className={styles.small}>
                        <h4
                          style={{
                            marginLeft: "40px",
                            color: "red",
                            fontStyle: "italic",
                            marginTop: "25px",
                          }}
                        ></h4>
                        <div className={styles.details}>
                          <div className={styles.h1Tag}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {" "}
                              Documents Upload
                            </h3>

                            <h5
                              style={{
                                color: "white",
                                marginTop: "10px",
                                marginLeft: "5px",
                              }}
                            >
                              (Only jpg.jpeg.png.bmp.pdf file allowed to upload.
                              File size should be 2 MB)
                            </h5>
                          </div>
                        </div>

                        {/* FileTable */}
                        <div>
                          {/**
                     * <FileTable
                      appName="LCMS" //Module Name
                      serviceName={"L-Opinion"} //Transaction Name
                      fileName={attachedFile} //State to attach file
                      filePath={setAttachedFile} // File state upadtion function
                      newFilesFn={setAdditionalFiles} // File data function
                      columns={columns} //columns for the table
                      rows={finalFiles} //state to be displayed in table
                      uploading={setUploading}
                      showOpinionAttachment={router.query.showOpinionAttachment}
                    />
                     */}

                          <Documents />
                        </div>
                      </div>

                      {/* Row Button */}

                      <Grid container mt={10} ml={5} mb={5} border px={5}>
                        <Grid item xs={2}></Grid>

                        {router?.query?.pageMode != "View" && (
                          <>
                            {/* Save ad Draft */}
                            <Grid item>
                              <Button
                                onClick={() => setButtonText("saveAsDraft")}
                                type="Submit"
                                variant="contained"
                              >
                                {/* Submit */}
                                {<FormattedLabel id="saveAsDraft" />}
                              </Button>
                            </Grid>

                            <Grid item xs={2}></Grid>

                            <Grid item>
                              <Button
                                onClick={() => setButtonText("finalSubmit")}
                                type="Submit"
                                variant="contained"
                              >
                                {/* Submit */}
                                {<FormattedLabel id="save" />}
                              </Button>
                            </Grid>
                          </>
                        )}

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
