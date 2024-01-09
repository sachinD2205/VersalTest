import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/LegalCaseSchema/addOpinionSchema";
import { Delete, Visibility } from "@mui/icons-material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import { language } from "../../../../features/labelSlice";
import styles from "../../../../styles/LegalCase_Styles/opinion.module.css";
import urls from "../../../../URLS/urls";
import Documents from "./Documents";
import Transliteration from "../../../../components/common/linguosol/transliteration";
import BreadcrumbComponent from "../../../../pages/LegalCase/FileUpload/BreadcrumbComponent";
import Loader from "../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../util/util";
const View = () => {
  const [loadderState, setLoadderState] = useState(false);

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
    watch,
    reset,
    getValues,
    clearErrors,

    formState: { errors },
  } = methods;
  //  useForm({
  //   criteriaMode: "all",
  //   resolver: yupResolver(schema),
  //   mode: "onChange",
  // });

  const router = useRouter();

  // const token = useSelector((state) => state.user.user.token);
  // const [advocateNames1, setadvocateName1] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [activeStep, setActiveStep] = useState(0);
  const language = useSelector((state) => state.labels.language);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.user.user.token);
  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [finalFiles, setFinalFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [concenDeptNames, setconcenDeptName] = useState([]);

  const [officeName, setOfficeName] = useState([]);

  const [advocateNames, setadvocateName] = useState([]);

  const [isOpenCollapse1, setIsOpenCollapse1] = useState(false);
  const [isOpenCollapse2, setIsOpenCollapse2] = useState(false);

  const [personName, setPersonNcallCatchMethodame] = React.useState([]);

  const [personName1, setPersonName1] = React.useState([]);

  const _opinionRequestDate = watch("opinionRequestDate");

  const _concenDeptId = watch("concenDeptId");
  const _opinionSubject = watch("opinionSubject");
  const _officeLocation = watch("officeLocation");

  const [document, setDocument] = useState([]);
  const [completed, setCompleted] = useState({});
  const [opinionDetails, setOpinionDetails] = useState({});

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

  // const isLastStep = () => {
  //   return activeStep === totalSteps() - 1;
  // };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
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
        console.log("ghfgf33", res);
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

  // // get Opinion
  // const getAllOpinion = (_pageSize = 10, _pageNo = 0) => {
  //   console.log("_pageSize,_pageNo", _pageSize, _pageNo);
  //   axios
  //     .get(`${urls.LCMSURL}/transaction/opinion/getAll`, {
  //       params: {
  //         pageSize: _pageSize,
  //         pageNo: _pageNo,
  //       },
  //     })
  //     .then((r) => {
  //       console.log("r", r);
  //       let result = r.data.opinion;
  //       console.log("result", result);

  //       let _res = result.map((r, i) => {
  //         console.log("44");
  //         return {
  //           // r.data.map((r, i) => ({
  //           activeFlag: r.activeFlag,

  //           id: r.id,
  //           srNo: i + 1,
  //           opinionRequestDate: moment(r.opinionRequestDate).format(
  //             "YYYY-MM-DD"
  //           ),

  //           searchTitleRptDate: moment(r.searchTitleRptDate).format(
  //             "YYYY-MM-DD"
  //           ),

  //           finalDraftDeliveryDate: moment(r.finalDraftDeliveryDate).format(
  //             "YYYY-MM-DD"
  //           ),
  //           opinionSubject: r.opinionSubject,
  //           // concenDeptName: r.concenDeptName,
  //           concenDeptId: r.concenDeptId,
  //           concenDeptName: concenDeptNames?.find(
  //             (obj) => obj?.id === r.concenDeptId
  //           )?.department,

  //           advPanel: r.advPanel,
  //           panelRemarks: r.panelRemarks,
  //           reportRemarks: r.reportRemarks,
  //           remarks: r.remarks,
  //           opinionSubmisionDate: moment(r.opinionSubmisionDate).format(
  //             "YYYY-MM-DD"
  //           ),
  //           opinion: r.opinion,
  //           officeLocation: r.officeLocation,
  //           officeLocationNameText: officeName?.find(
  //             (obj) => obj?.id === r.officeLocation
  //           )?.officeLocationName,
  //           officeLocationNameTextMr: officeName?.find(
  //             (obj) => obj?.id === r.officeLocation
  //           )?.officeLocationNameMr,

  //           department: r.department,
  //           department: concenDeptNames?.find(
  //             (obj) => obj?.id === r.concenDeptId
  //           )?.department,
  //           departmentMr: concenDeptNames?.find(
  //             (obj) => obj?.id === r.concenDeptId
  //           )?.department,

  //           opinionMr: r.opinionMr,

  //           panelRemarks: r.panelRemarks,
  //           panelRemarksMr: r.panelRemarksMr,

  //           courtCaseNumber: r.courtCaseNumber,

  //           filedBy: r.filedBy,
  //           filedByMr: r.filedByMr,
  //           caseDetails: r.caseDetails,
  //           caseDetailsMr: r.caseDetailsMr,

  //           status: r.activeFlag === "Y" ? "Active" : "Inactive",
  //         };
  //       });
  //       // setDataSource([..._res]);
  //       // setData({
  //       //   rows: _res,
  //       //   totalRows: r.data.totalElements,
  //       //   rowsPerPageOptions: [10, 20, 50, 100],
  //       //   pageSize: r.data.pageSize,
  //       //   page: r.data.pageNo,
  //       // });
  //     });
  // };

  // final submit
  const onSubmitForm = (data) => {
    console.log("data", data);
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    // handleNext();

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
        id: item?.id,
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

    console.log("_attachedDocs", _attachedDocs);

    //public Long id;
    //public Long opinionId;
    //public Long advocate;
    //public String remarkMr;
    //public String remark;
    //public String opinionMr;
    //public String opinion;
    //public LocalDate reportDate;
    //public LocalDate submissionDate;
    //public String status;
    //public Character activeFlag;

    // Create body for API using above commented fields
    // TODO: Narmada | Used above commented fields to create body for API | check by passing it instead of bodyForAPI
    const bodyForAPIOpinion = {
      opinionId: data.id,
      advocate: user.userDao.advocateId,
      //remarkMr: data?.reportTitleAdvocateOpinionMr ? data?.reportTitleAdvocateOpinionMr : null,
      //remark: data?.reportTitleAdvocateOpinion ? data?.reportTitleAdvocateOpinion : null,
      opinionMr: data?.panelAdvocateOpinionMr
        ? data?.panelAdvocateOpinionMr
        : "-",
      opinion: data?.panelAdvocateOpinion ? data?.panelAdvocateOpinion : "-",
      //reportDate: moment(new Date()).unix().toString(),
      //submissionDate: moment(new Date()).unix().toString(),
      //status: "ADD_OPINION_SUBMITTED",
      //activeFlag: "Y",
      trnOpinionAttachmentDao: _attachedDocs,
    };

    const bodyForAPISearchReport = {
      opinionId: data.id,
      advocate: user.userDao.advocateId,
      //remarkMr: data?.reportTitleAdvocateOpinionMr ? data?.reportTitleAdvocateOpinionMr : null,
      //remark: data?.reportTitleAdvocateOpinion ? data?.reportTitleAdvocateOpinion : null,
      opinionMr: data?.reportTitleAdvocateOpinionMr
        ? data?.reportTitleAdvocateOpinionMr
        : "-",
      opinion: data?.reportTitleAdvocateOpinion
        ? data?.reportTitleAdvocateOpinion
        : "-",
      //reportDate: moment(new Date()).unix().toString(),
      //submissionDate: moment(new Date()).unix().toString(),
      //status: "ADD_OPINION_SUBMITTED",
      //activeFlag: "Y",
      trnOpinionAttachmentDao: _attachedDocs,
    };

    const bodyForAPI = {
      ...data,
      ...opinionDetails,
      id: router?.query?.id,
      //role kuthy ith
      role: "ADD_OPINION",

      status: "ADD_OPINION_SUBMITTED",
      timeStamp: moment(new Date()).unix().toString(),
      // noticeAttachment: faltugiri,
      reportAdvPanelList: data?.reportAdvLst?.map((rpt) => {
        if (rpt.advocate == getValues("reportAdvPanelList")) {
          return {
            ...rpt,
            remark: data?.reportTitleAdvocateOpinion
              ? data?.reportTitleAdvocateOpinion
              : null,
            remarkMr: data?.reportTitleAdvocateOpinionMr
              ? data?.reportTitleAdvocateOpinionMr
              : null,
          };
        }
      }),
      opinionAdvPanelList: data?.opinionAdvLst?.map((rpt) => {
        if (rpt.advocate == getValues("opinionAdvPanelList")) {
          return {
            ...rpt,
            remark: data?.panelAdvocateOpinion
              ? data?.panelAdvocateOpinion
              : null,
            remarkMr: data?.panelAdvocateOpinionMr
              ? data?.panelAdvocateOpinionMr
              : null,
          };
        }
      }),

      trnOpinionAttachmentDao: _attachedDocs,
    };

    console.log("Final Data: ", bodyForAPI);

    //  if(opinionAdvPanelList){
    //   console.log("opinionAdvPanelList",opinionAdvPanelList)
    //   axios
    //   .post(`${urls.LCMSURL}/opinionAdvocatePanel/save`, bodyForAPI, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }).then((res) => {
    //     if (res.status == 200) {
    //       sweetAlert("Saved!", "Record Saved successfully !", "success");
    //       router.push(`/LegalCase/transaction/opinion/`);
    //       localStorage.removeItem("trnOpinionAttachmentDao");
    //     }
    //   });

    //  }
    //  else{
    //   axios
    //   .post(`${urls.LCMSURL}/reportAdvocatePanel/save`, bodyForAPI, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }).then((res) => {
    //     if (res.status == 200) {
    //       sweetAlert("Saved!", "Record Saved successfully !", "success");
    //       router.push(`/LegalCase/transaction/opinion/`);
    //       localStorage.removeItem("trnOpinionAttachmentDao");
    //     }
    //   });

    //  }

    console.log("bodyForAPI___", bodyForAPI);
    if (
      router.query.reportAdvPanel &&
      getValues("reportAdvPanelList")?.includes(user.userDao.advocateId)
    ) {
      console.log("bodyForAPISearchReport", bodyForAPISearchReport);
      setLoadderState(true);

      axios
        .post(
          `${urls.LCMSURL}/reportAdvocatePanel/save`,
          bodyForAPISearchReport,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log("bodyForAPISearchReport res", res);
          if (res.status == 200 || res.status == 201) {
            sweetAlert(
              // "Saved!",
              language == "en" ? "Saved!" : "जतन केले!",
              //  "Record Saved successfully !",
              language == "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              "success"
            );
            router.push(`/LegalCase/transaction/opinion/`);
            localStorage.removeItem("trnOpinionAttachmentDao");
            setLoadderState(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }

    if (
      router.query.advPanel &&
      getValues("opinionAdvPanelList")?.includes(user.userDao.advocateId)
    ) {
      console.log("bodyForAPIOpinion", bodyForAPIOpinion);
      setLoadderState(true);

      axios
        .post(`${urls.LCMSURL}/opinionAdvocatePanel/save`, bodyForAPIOpinion, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("bodyForAPIOpinion res", res);
          setLoadderState(false);

          if (res.status == 200 || res.status == 201) {
            sweetAlert(
              // "Saved!",
              language == "en" ? "Saved!" : "जतन केले!",
              language == "en"
                ? "Record Saved successfully !"
                : "रेकॉर्ड यशस्वीरित्या जतन केले!",
              //  "Record Saved successfully !",
              "success"
            );
            router.push(`/LegalCase/transaction/opinion/`);
            localStorage.removeItem("trnOpinionAttachmentDao");
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
      // .catch((err) => {
      //   setLoadderState(false);

      //   sweetAlert(err.message, "Something went wrong !", "error");
      //   console.log("bodyForAPIOpinion err", err);
      // });
    }

    // axios
    //   .post(`${urls.LCMSURL}/transaction/opinion/save`, bodyForAPI, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //   .then((res) => {
    //     if (res.status == 200) {
    //       sweetAlert("Saved!", "Record Saved successfully !", "success");
    //       router.push(`/LegalCase/transaction/opinion/`);
    //       localStorage.removeItem("trnOpinionAttachmentDao");
    //     }
    //   });
  };

  const columns = [
    // {
    //   headerName: 'Sr.No',
    //   field: 'srNo',
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: "File Name",
      // field: "fileLabel",
      File: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 140,
    },
    {
      headerName: "Uploaded By",
      field: "uploadedBy",
      flex: 1,
      // width: 300,
    },
    {
      headerName: "action",
      field: "Action",
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.fileName}`,
                  "_blank"
                );
              }}
            >
              <Visibility />
            </IconButton>

            <IconButton
              color="error"
              onClick={() => discard(record.row.fileName, record.row.srNo)}
            >
              <Delete />
            </IconButton>
          </>
        );
      },
    },
  ];

  // reportAdvocateIds:[{
  //   opinionRequestDate:opinionRequestDate,
  //   concenDeptId:concenDeptId,
  //   opinionSubject:opinionSubject,
  //   panelRemarks:panelRemarks
  // }]

  // --------------------------Transaltion API--------------------------------
  const panelAdvocateOpinionAPi = (
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

  // --------useEffects -------
  useEffect(() => {
    getAdvocateNames();
    getDeptName();
    getOfficeName();
    // getAllOpinion();
  }, []);

  useEffect(() => {
    if (
      router.query.pageMode == "Edit" ||
      router.query.pageMode == "View" ||
      router.query.pageMode == "Opinion"
    ) {
      // setValue("opinionSubject", router.query.opinionSubject),
      console.log("Data------", router.query);
      console.log("advPanel------", router.query.advPanel);
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
          console.log("TestForDocsss", res);
          reset(res.data);

          setValue(
            "reportAdvLst",
            res.data.reportAdvPanelList.map((ra) => ra)
          );
          setValue(
            "opinionAdvLst",
            res.data.opinionAdvPanelList.map((ra) => ra)
          );

          setValue(
            "reportAdvPanelList",
            res.data.reportAdvPanelList.map((ra) => ra.advocate)
          );
          setValue(
            "opinionAdvPanelList",
            res.data.opinionAdvPanelList.map((pa) => pa.advocate)
          );

          localStorage.setItem(
            "trnOpinionAttachmentDao",
            res?.data?.trnOpinionAttachmentDao
              ? JSON.stringify(res?.data?.trnOpinionAttachmentDao)
              : []
          );

          console.log("getValues", res?.data?.trnOpinionAttachmentDao);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
      // reset(router.query);
    }
  }, []);

  useEffect(() => {
    setFinalFiles([...additionalFiles]);
  }, [additionalFiles]);

  useEffect(() => {
    if (router.query.pageMode == "PanelAdv") {
      console.log("advPanel------", router.query.advPanel);
      reset(router.query);
    }
  }, []);

  // View
  return (
    <>
      <Box>
        <div>
          <BreadcrumbComponent />
        </div>
      </Box>
      {/* Loader */}
      {loadderState ? (
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
          <Paper
            elevation={8}
            variant="outlined"
            sx={{
              border: 1,
              borderColor: "grey.500",
              // marginLeft: "10px",
              // marginRight: "10px",
              marginTop: "10px",
              marginBottom: "60px",
              padding: 1,
            }}
          >
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

                display: "flex",
                justifyContent: "center",
                width: "100%",
                // #00308F
                color: "white",
                // fontSize: 19,
                // marginTop: 30,
                marginBottom: "50px",
                // marginTop: ,
                // padding: 8,
                height: "8vh",
                // paddingLeft: 30,
                // marginLeft: "50px",
                marginRight: "75px",
                borderRadius: 100,
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginTop: "1vh",
                }}
              >
                <FormattedLabel id="advocateOpinion" />
              </h2>
            </Box>

            {/* <Divider /> */}

            <Box
              sx={{
                marginLeft: 5,
                marginRight: 5,
                marginTop: 5,
                marginBottom: 5,
                padding: 1,
                // border:1,
                // borderColor:'grey.500'
              }}
            >
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  {/* New Exp  */}
                  <Box sx={{ flexGrow: 1, marginLeft: "30px" }}>
                    <Grid
                      container
                      spacing={{ xs: 2, md: 5 }}
                      columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      {/* Opinion Request Date */}

                      <Grid item xs={2} sm={4} md={4}>
                        <FormControl
                          variant="standard"
                          style={{ marginTop: 10 }}
                          error={!!errors.opinionRequestDate}
                        >
                          <Controller
                            // variant="standard"
                            control={control}
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
                                      size="small"
                                      variant="standard"
                                      // sx={{ width: 230 }}
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

                      <Grid item xs={2} sm={4} md={4}>
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          // size="small"
                          sx={{ m: 1, width: 200 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}

                            {<FormattedLabel id="locationName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // disabled={router?.query?.pageMode === "View"}
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="locationName" />}
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
                      <Grid item xs={2} sm={4} md={4}>
                        <FormControl
                          // variant="outlined"
                          variant="standard"
                          sx={{ m: 1, minWidth: 200 }}
                          error={!!errors.concenDeptId}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="deptName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // disabled={router?.query?.pageMode === "View"}
                                disabled
                                // sx={{ width: 230 }}
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="deptName" />}
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

                      {/* Search Title Report Datepicker */}
                      {/* <Grid item xs={2} sm={4} md={4}>
                        <FormControl variant="standard">
                          <Controller
                            control={control}
                            name="searchTitleRptDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  variant="standard"
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      {
                                        <FormattedLabel id="searchTitleReport" />
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
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      // size="small"
                                      variant="standard"
                                      // sx={{ width: 230 }}
                                      InputLabelProps={{
                                        style: {
                                          fontSize: 12,
                                          marginTop: 3,
                                        },

                                        //true
                                        shrink:
                                          (watch("searchTitleRptDate")
                                            ? true
                                            : false) ||
                                          (router.query.searchTitleRptDate
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
                            {errors?.searchTitleRptDate
                              ? errors.searchTitleRptDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid> */}
                    </Grid>
                    <Grid
                      container
                      sx={{
                        marginTop: "5vh",
                      }}
                    >
                      {/* opinion subject  */}
                      <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
                        <TextField
                          sx={{
                            width: "100%",
                          }}
                          disabled
                          multiline
                          id="standard-textarea"
                          // label="Opinion Subject"
                          label={<FormattedLabel id="opinionSubject" />}
                          placeholder="Opinion Subject"
                          variant="standard"
                          // style={{ width: 224 }}
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

                    {/* Panel Advocate Remark  */}
                    <Grid
                      container
                      style={{
                        marginTop: "30px",
                      }}
                      // spacing={{ xs: 2, md: 3 }}
                      // columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      {/* Opinion Request Date */}

                      <Grid item xs={9} sm={12} md={12}>
                        {router.query.advPanel &&
                          getValues("opinionAdvPanelList")?.includes(
                            user.userDao?.advocateId
                          ) && (
                            <>
                              <TextField
                                disabled
                                id="standard-textarea"
                                // label="Opinion"
                                // label={<FormattedLabel id="clerkRemark" />}
                                label="Panel Advocate Remarks"
                                style={{ marginLeft: "10px" }}
                                // placeholder="Opinion"
                                multiline
                                fullWidth
                                variant="standard"
                                // style={{ width: 1000, marginTop: "20px" }}
                                {...register("panelRemarks")}
                                InputLabelProps={{
                                  //true
                                  shrink:
                                    (watch("panelRemarks") ? true : false) ||
                                    (router.query.panelRemarks ? true : false),
                                }}
                                error={!!errors.panelRemarks}
                                helperText={
                                  errors?.opinion
                                    ? errors.panelRemarks.message
                                    : null
                                }
                              />
                            </>
                          )}
                      </Grid>
                    </Grid>

                    {/* ***  */}
                    <Grid
                      container
                      style={{
                        marginTop: "10px",
                      }}
                      // spacing={{ xs: 2, md: 3 }}
                      // columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
                        {router.query.reportAdvPanel &&
                          getValues("reportAdvPanelList")?.includes(
                            user.userDao?.advocateId
                          ) && (
                            <>
                              <TextField
                                fullWidth
                                disabled
                                id="standard-textarea"
                                // label="Opinion"
                                // label={<FormattedLabel id="clerkRemark" />}
                                label="Title Report Remark"
                                // placeholder="Opinion"
                                multiline
                                variant="standard"
                                // style={{ width: 200, marginLeft: "10px" }}
                                {...register("reportRemarks")}
                                InputLabelProps={{
                                  //true
                                  shrink:
                                    (watch("reportRemarks") ? true : false) ||
                                    (router.query.reportRemarks ? true : false),
                                }}
                                error={!!errors.panelRemarks}
                                helperText={
                                  errors?.opinion
                                    ? errors.panelRemarks.message
                                    : null
                                }
                              />
                            </>
                          )}
                      </Grid>
                    </Grid>

                    {/* * */}
                    <Grid
                      container
                      style={{
                        marginTop: "10px",
                      }}
                      // spacing={{ xs: 2, md: 3 }}
                      // columns={{ xs: 4, sm: 8, md: 12 }}
                    >
                      <Grid item xs={9} sm={12} md={12}>
                        {router.query.advPanel &&
                          getValues("opinionAdvPanelList")?.includes(
                            user.userDao?.advocateId
                          ) && (
                            <>
                              {/* Third Row */}
                              <Grid
                                container
                                sx={
                                  {
                                    // padding: "10px"
                                  }
                                }
                              >
                                {/* opinin Panel Advoacte En*/}
                                <Grid item xs={12} xl={12} md={12} sm={12}>
                                  <TextField
                                    sx={{ width: "88%" }}
                                    disabled={
                                      router?.query?.pageMode === "View"
                                    }
                                    id="standard-textarea"
                                    label={
                                      <FormattedLabel id="panalAdvocateOpinionEn" />
                                    }
                                    // placeholder="Opinion Subject"
                                    multiline
                                    variant="standard"
                                    {...register("panelAdvocateOpinion")}
                                    error={!!errors.panelAdvocateOpinion}
                                    helperText={
                                      errors?.panelAdvocateOpinion
                                        ? errors.panelAdvocateOpinion.message
                                        : null
                                    }
                                    InputLabelProps={{
                                      shrink:
                                        (watch("panelAdvocateOpinion")
                                          ? true
                                          : false) ||
                                        (router.query.panelAdvocateOpinion
                                          ? true
                                          : false),
                                    }}
                                  />

                                  {/* Button for Translation */}

                                  {/*  Button For Translation */}
                                  <Button
                                    variant="contained"
                                    sx={{
                                      marginTop: "20px",
                                      marginLeft: "1vw",
                                      height: "5vh",
                                      width: "9vw",
                                    }}
                                    onClick={() =>
                                      panelAdvocateOpinionAPi(
                                        watch("panelAdvocateOpinion"),
                                        "panelAdvocateOpinionMr",
                                        "en"
                                      )
                                    }
                                  >
                                    {/* Translate */}
                                    <FormattedLabel id="mar" />
                                  </Button>

                                  {/* Transliteration  for translation */}

                                  {/* <Transliteration
                                    _key={"panelAdvocateOpinion"}
                                    labelName={"panelAdvocateOpinion"}
                                    fieldName={"panelAdvocateOpinion"}
                                    updateFieldName={"panelAdvocateOpinionMr"}
                                    sourceLang={"eng"}
                                    targetLang={"mar"}
                                    label={
                                      <FormattedLabel
                                        id="panalAdvocateOpinionEn"
                                        required
                                      />
                                    }
                                    error={!!errors.panelAdvocateOpinion}
                                    helperText={
                                      errors?.panelAdvocateOpinion
                                        ? errors.panelAdvocateOpinion.message
                                        : " "
                                    }
                                  /> */}
                                </Grid>

                                {/* Opinion Panel Advoacte Mr */}
                                <Grid
                                  item
                                  sx={{
                                    marginTop: "5vh",
                                  }}
                                  xs={12}
                                  xl={12}
                                  md={12}
                                  sm={12}
                                >
                                  <TextField
                                    sx={{ width: "88%" }}
                                    disabled={
                                      router?.query?.pageMode === "View"
                                    }
                                    id="standard-textarea"
                                    label={
                                      <FormattedLabel id="panalAdvocateOpinionMr" />
                                    }
                                    // placeholder="Opinion Subject"
                                    multiline
                                    variant="standard"
                                    {...register("panelAdvocateOpinionMr")}
                                    error={!!errors.panelAdvocateOpinionMr}
                                    helperText={
                                      errors?.panelAdvocateOpinionMr
                                        ? errors.panelAdvocateOpinionMr.message
                                        : null
                                    }
                                    InputLabelProps={{
                                      shrink:
                                        (watch("panelAdvocateOpinionMr")
                                          ? true
                                          : false) ||
                                        (router.query.panelAdvocateOpinionMr
                                          ? true
                                          : false),
                                    }}
                                  />

                                  <Button
                                    variant="contained"
                                    sx={{
                                      marginTop: "20px",
                                      marginLeft: "1vw",
                                      height: "5vh",
                                      width: "9vw",
                                    }}
                                    onClick={() =>
                                      panelAdvocateOpinionAPi(
                                        watch("panelAdvocateOpinionMr"),
                                        "panelAdvocateOpinion",
                                        "mr"
                                      )
                                    }
                                  >
                                    {/* Translate */}
                                    <FormattedLabel id="eng" />
                                  </Button>
                                  {/* Transliteration for translation  */}
                                  {/* <Transliteration
                                    _key={"panelAdvocateOpinionMr"}
                                    labelName={"panelAdvocateOpinionMr"}
                                    fieldName={"panelAdvocateOpinionMr"}
                                    updateFieldName={"panelAdvocateOpinion"}
                                    sourceLang={"mar"}
                                    targetLang={"eng"}
                                    label={
                                      <FormattedLabel
                                        id="panalAdvocateOpinionMr"
                                        required
                                      />
                                    }
                                    error={!!errors.panelAdvocateOpinionMr}
                                    helperText={
                                      errors?.panelAdvocateOpinionMr
                                        ? errors.panelAdvocateOpinionMr.message
                                        : " "
                                    }
                                  /> */}
                                </Grid>
                              </Grid>
                            </>
                          )}

                        {router.query.reportAdvPanel &&
                          getValues("reportAdvPanelList")?.includes(
                            user.userDao.advocateId
                          ) && (
                            <>
                              <Grid
                                container
                                sx={{
                                  marginTop: "3vh",
                                }}
                              >
                                <Grid item xs={12} xl={12} md={12} sm={12}>
                                  <TextField
                                    sx={{
                                      width: "88%",
                                    }}
                                    fullWidth
                                    id="standard-textarea"
                                    // label="Opinion"
                                    // label={<FormattedLabel id="clerkRemark" />}
                                    label={
                                      <FormattedLabel id="reportAdvocateOpinionEn" />
                                    }
                                    // placeholder="Opinion"
                                    multiline
                                    variant="standard"
                                    // style={{ width: 200, marginLeft: "10px" }}
                                    {...register("reportTitleAdvocateOpinion")}
                                    InputLabelProps={{
                                      //true
                                      shrink:
                                        (watch("reportTitleAdvocateOpinion")
                                          ? true
                                          : false) ||
                                        (router.query.reportTitleAdvocateOpinion
                                          ? true
                                          : false),
                                    }}
                                    error={!!errors.reportTitleAdvocateOpinion}
                                    helperText={
                                      errors?.opinion
                                        ? errors.reportTitleAdvocateOpinion
                                            .message
                                        : null
                                    }
                                  />

                                  {/* Button for Translate */}
                                  <Button
                                    variant="contained"
                                    sx={{
                                      marginTop: "30px",
                                      marginLeft: "1vw",
                                      height: "5vh",
                                      width: "9vw",
                                    }}
                                    onClick={() =>
                                      panelAdvocateOpinionAPi(
                                        watch("reportTitleAdvocateOpinion"),
                                        "reportTitleAdvocateOpinionMr",
                                        "en"
                                      )
                                    }
                                  >
                                    {/* Translate */}
                                    <FormattedLabel id="mar" />
                                  </Button>

                                  {/* Transliteration for Translation  */}

                                  {/* <Transliteration
                                    _key={"reportTitleAdvocateOpinion"}
                                    labelName={"reportTitleAdvocateOpinion"}
                                    fieldName={"reportTitleAdvocateOpinion"}
                                    updateFieldName={
                                      "reportTitleAdvocateOpinionMr"
                                    }
                                    sourceLang={"eng"}
                                    targetLang={"mar"}
                                    label={
                                      <FormattedLabel
                                        id="reportAdvocateOpinionEn"
                                        required
                                      />
                                    }
                                    error={!!errors.reportTitleAdvocateOpinion}
                                    helperText={
                                      errors?.reportTitleAdvocateOpinion
                                        ? errors.reportTitleAdvocateOpinion
                                            .message
                                        : null
                                    }
                                  /> */}
                                </Grid>

                                <Grid
                                  item
                                  sx={{
                                    marginTop: "5vh",
                                  }}
                                  xs={12}
                                  xl={12}
                                  md={12}
                                  sm={12}
                                >
                                  <TextField
                                    sx={{
                                      marginTop: "3vh",
                                      width: "88%",
                                    }}
                                    fullWidth
                                    id="standard-textarea"
                                    // label="Opinion"
                                    // label={<FormattedLabel id="clerkRemark" />}
                                    label={
                                      <FormattedLabel id="reportAdvocateOpinionMr" />
                                    }
                                    // placeholder="Opinion"
                                    multiline
                                    variant="standard"
                                    // style={{ width: 200, marginLeft: "10px" }}
                                    {...register(
                                      "reportTitleAdvocateOpinionMr"
                                    )}
                                    InputLabelProps={{
                                      //true
                                      shrink:
                                        (watch("reportTitleAdvocateOpinionMr")
                                          ? true
                                          : false) ||
                                        (router.query
                                          .reportTitleAdvocateOpinionMr
                                          ? true
                                          : false),
                                    }}
                                    error={
                                      !!errors.reportTitleAdvocateOpinionMr
                                    }
                                    helperText={
                                      errors?.opinion
                                        ? errors.reportTitleAdvocateOpinionMr
                                            .message
                                        : null
                                    }
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
                                      panelAdvocateOpinionAPi(
                                        watch("reportTitleAdvocateOpinionMr"),
                                        "reportTitleAdvocateOpinion",
                                        "mr"
                                      )
                                    }
                                  >
                                    {/* Translate */}
                                    <FormattedLabel id="eng" />
                                  </Button>
                                  {/* Transliteration for Translation  */}
                                  {/* <Transliteration
                                    _key={"reportTitleAdvocateOpinionMr"}
                                    labelName={"reportTitleAdvocateOpinionMr"}
                                    fieldName={"reportTitleAdvocateOpinionMr"}
                                    updateFieldName={
                                      "reportTitleAdvocateOpinion"
                                    }
                                    sourceLang={"mar"}
                                    targetLang={"eng"}
                                    // disabled={disabled}
                                    label={
                                      <FormattedLabel
                                        id="reportAdvocateOpinionMr"
                                        required
                                      />
                                    }
                                    error={
                                      !!errors.reportTitleAdvocateOpinionMr
                                    }
                                    helperText={
                                      errors?.reportTitleAdvocateOpinionMr
                                        ? errors.reportTitleAdvocateOpinionMr
                                            .message
                                        : null
                                    }
                                  /> */}
                                </Grid>
                              </Grid>
                            </>
                          )}
                      </Grid>
                    </Grid>
                  </Box>

                  {/* OLD CODE  */}
                  {/* First Row */}

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
                    <Grid item xs={3.5}></Grid>
                    <Grid item>
                      <Button
                        type="Submit"
                        variant="contained"
                        // onClick={finalSubmit}
                      >
                        {/* Submit */}

                        {<FormattedLabel id="submit" />}
                      </Button>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() => {
                          localStorage.removeItem("trnOpinionAttachmentDao");
                          router.push(`/LegalCase/transaction/opinion/`);
                        }}
                      >
                        {/* Cancel */}

                        {<FormattedLabel id="cancel" />}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Box>
          </Paper>
        </>
      )}

      {/*  */}

      {/* </Box> */}

      {/* </BasicLayout> */}
    </>
  );
};

export default View;
