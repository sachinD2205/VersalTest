import {
  Button,
  Grid,
  Paper,
  TextField,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import theme from "../../../../../theme";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import sweetAlert from "sweetalert";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import Loader from "../../../../../containers/Layout/components/Loader";
import { manageStatus } from "../../../../../components/rtiOnlineSystem/commonStatus/manageEnMr";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
  const {
    register,
    reset,
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const [siteImages, setSiteImages] = useState();
  const [dataSource, setDataSource] = useState({});
  const [hutData, setHutData] = useState({});
  const [photo, setPhoto] = useState();
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [relationDropDown, setRelationDropDown] = useState([]);
  const [statusAll, setStatus] = useState([]);

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);

  let loggedInUser = localStorage.getItem("loggedInUser");

  const headers =
    loggedInUser === "citizenUser"
      ? { Userid: user?.id }
      : { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    getPhotopassDataById(router.query.id);
    getRelationDetails();
    getTitleData();
  }, [router.query.id]);

  useEffect(() => {
    getAllStatus();
  }, []);

  const getAllStatus = () => {
    axios
      .get(`${urls.SLUMURL}/mstStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setStatus(
          res.data.mstStatusDaoList.map((r, i) => ({
            id: r.id,
            statusTxt: r.statusTxt,
            statusTxtMr: r.statusTxtMr,
            status: r.status,
          }))
        );
      });
  };
  useEffect(() => {
    getHutData();
  }, [dataSource]);

  useEffect(() => {
    if (dataSource != null) {
      setDataOnForm();
    }
  }, [dataSource, language]);

  const setDataOnForm = () => {
    let letestTime =
      // dataSource?.trnVisitScheduleList?.length > 0
      //   ? dataSource?.trnVisitScheduleList[
      //       dataSource?.trnVisitScheduleList.length - 1
      //     ]
      dataSource?.trnVisitScheduleList?.length > 0
        ? dataSource?.trnVisitScheduleList[0]
        : null;
    setValue("scheduledTime", letestTime ? letestTime?.scheduledDate : "-");
    setValue("rescheduleTime", letestTime ? letestTime?.rescheduleDate : "-");

    let res = dataSource;

    setValue("hutNo", res ? res.hutNo : "-");
    setValue("applicationNo", res ? res.applicationNo : "-");
    setValue("currentStatus", manageStatus(res?.status, language, statusAll));

    setValue(
      "ownerTitle",
      !res?.applicantTitle
        ? "-"
        : language == "en"
        ? titleDropDown &&
          titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleEn
        : titleDropDown &&
          titleDropDown.find((obj) => obj.id == res?.applicantTitle)?.titleMr
    );
    setValue(
      "ownerFirstName",
      !res?.applicantFirstName
        ? "-"
        : language == "en"
        ? res?.applicantFirstName
        : res?.applicantFirstNameMr
    );
    setValue(
      "ownerMiddleName",
      !res?.applicantMiddleName
        ? "-"
        : language == "en"
        ? res?.applicantMiddleName
        : res?.applicantMiddleNameMr
    );
    setValue(
      "ownerLastName",
      !res?.applicantLastName
        ? "-"
        : language == "en"
        ? res?.applicantLastName
        : res?.applicantLastNameMr
    );
    setValue(
      "ownerMobileNo",
      res?.applicantMobileNo ? res?.applicantMobileNo : "-"
    );
    setValue(
      "ownerAadharNo",
      res?.applicantAadharNo ? res?.applicantAadharNo : "-"
    );
    setValue("ownerEmail", res?.applicantEmailId ? res?.applicantEmailId : "-");
    setValue("ownerAge", res?.applicantAge ? res?.applicantAge : "-");
    setValue(
      "ownerOccupation",
      res?.applicantOccupation ? res?.applicantOccupation : "-"
    );
    setValue(
      "ownerRelation",
      !res?.applicantRelationKey
        ? "-"
        : language == "en"
        ? relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.applicantRelationKey)
            ?.relation
        : relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.applicantRelationKey)
            ?.relationMr
    );
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    setValue("outstandingTax", res ? res?.outstandingTax : "-");
    setValue(
      "spouseTitle",
      !res?.coApplicantTitle
        ? "-"
        : language == "en"
        ? titleDropDown &&
          titleDropDown.find((obj) => obj.id == res?.coApplicantTitle)?.titleEn
        : titleDropDown &&
          titleDropDown.find((obj) => obj.id == res?.coApplicantTitle)?.titleMr
    );
    setValue(
      "spouseFirstName",
      !res?.coApplicantFirstName
        ? "-"
        : language == "en"
        ? res?.coApplicantFirstName
        : res?.coApplicantFirstNameMr
    );
    setValue(
      "spouseMiddleName",
      !res?.coApplicantMiddleName
        ? "-"
        : language == "en"
        ? res?.coApplicantMiddleName
        : res?.coApplicantMiddleNameMr
    );
    setValue(
      "spouseLastName",
      !res?.coApplicantLastName
        ? "-"
        : language == "en"
        ? res?.coApplicantLastName
        : res?.coApplicantLastNameMr
    );
    setValue(
      "spouseMobileNo",
      res?.coApplicantMobileNo ? res?.coApplicantMobileNo : "-"
    );
    setValue(
      "spouseAadharNo",
      res?.coApplicantAadharNo ? res?.coApplicantAadharNo : "-"
    );
    setValue(
      "spouseEmail",
      res?.coApplicantEmail ? res?.coApplicantEmail : "-"
    );
    setValue("spouseAge", res?.coApplicantAge ? res?.coApplicantAge : "-");
    setValue(
      "spouseOccupation",
      res?.coApplicantOccupation ? res?.coApplicantOccupation : "-"
    );
    setValue(
      "spouseRelation",
      !res?.coApplicantRelationKey
        ? "-"
        : language == "en"
        ? relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.coApplicantRelationKey)
            ?.relation
        : relationDropDown &&
          relationDropDown.find((obj) => obj.id == res?.coApplicantRelationKey)
            ?.relationMr
    );
    setPhoto({ documentPath: res?.husbandWifeCombinedPhoto });
  };

  useEffect(() => {
    let res = hutData;

    let hutOwner = hutData?.mstHutMembersList?.find(
      (each) => each.headOfFamily == "Y"
    );
    setValue("pincode", res ? res?.pincode : "-");
    setValue("lattitude", res ? res?.lattitude : "-");
    setValue("longitude", res ? res?.longitude : "-");
    getVillageData(res?.villageKey);
    getAreaData(res?.areaKey);
    getSlumData(res?.slumKey);
  }, [hutData, language]);

  const getHutData = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstHutList;
        let res = result && result.find((obj) => obj.id == dataSource?.hutKey);
        setHutData(res);
        setValue("hutNo", res ? res?.hutNo : "-");
      });
  };

  const getRelationDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstRelation/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let temp = r.data.mstRelationDao;
        setRelationDropDown(
          temp?.map((row) => ({
            id: row.id,
            relation: row.relation,
            relationMr: row.relationMr,
          }))
        );
      });
  };

  const getTitleData = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`,
    { headers: headers }).then((r) => {
      let result = r.data.title;
      let res =
        result && result.find((obj) => obj.id == dataSource?.applicantTitle);
      setValue("applicantTitle", language == "en" ? res?.title : res?.titleMr);

      let res1 =
        result &&
        result.map((r) => {
          return {
            id: r.id,
            titleEn: r.title,
            titleMr: r.titleMr,
          };
        });
      setTitleDropDown(res1);
    });
  };

  const getVillageData = (villageKey) => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        let res = result && result.find((obj) => obj.id == villageKey);
        setValue(
          "villageKey",
          !res ? "-" : language === "en" ? res?.villageName : res?.villageNameMr
        );
      });
  };

  const getSlumData = (slumKey) => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        let res = result && result.find((obj) => obj.id == slumKey);
        setValue(
          "slumKey",
          !res ? "-" : language === "en" ? res?.slumName : res?.slumNameMr
        );
      });
  };

  const getAreaData = (areaKey) => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.area;
        let res = result && result.find((obj) => obj.id == areaKey);
        setValue(
          "areaKey",
          !res ? "-" : language === "en" ? res?.areaName : res?.areaNameMr
        );
      });
  };

  const getPhotopassDataById = (id) => {
    setIsLoading(true);
    if (id) {
      axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
          headers: headers,
        })
        .then((r) => {
          setIsLoading(false);
          let result = r.data;
          setDataSource(result);
        });
    }
  };

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnVisitSchedule/issuePhotopass/save`, _body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language === "en" ? "Saved!" : "जतन केले",
            text:
              language === "en"
                ? `Site visit against ${dataSource.applicationNo} scheduled successfully !`
                : `विरुद्ध साइट भेट ${dataSource.applicationNo} 
              यशस्वीरित्या नियोजित!`,
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              router.push(
                "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
              );
            }
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        catchMethod(err);
      });
  };
  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  return (
    <>
      {isLoading && <CommonLoader />}
      <ThemeProvider theme={theme}>
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
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            {/********* Hut Owner Information *********/}
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="hutOwnerDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {photo?.documentPath ? (
                  <img
                    src={`${urls.CFCURL}/file/preview?filePath=${photo?.documentPath}`}
                    alt="अर्जदाराचा फोटो"
                    height="150px"
                    width="144px"
                  />
                ) : (
                  <h4>अर्जदाराचा फोटो</h4>
                )}
              </Grid>

              {/* Hut No */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="hutNo" />}
                  variant="standard"
                  value={watch("hutNo")}
                  InputLabelProps={{
                    shrink: watch("hutNo") ? true : false,
                  }}
                  error={!!error.hutNo}
                  helperText={error?.hutNo ? error.hutNo.message : null}
                />
              </Grid>

              {/* Application No */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="applicationNo" />}
                  variant="standard"
                  value={watch("applicationNo")}
                  InputLabelProps={{
                    shrink: watch("applicationNo") ? true : false,
                  }}
                  error={!!error.applicationNo}
                  helperText={
                    error?.applicationNo ? error.applicationNo.message : null
                  }
                />
              </Grid>

              {/* Current Status */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="currentStatus" />}
                  variant="standard"
                  value={watch("currentStatus")}
                  InputLabelProps={{
                    shrink: watch("currentStatus") ? true : false,
                  }}
                  error={!!error.currentStatus}
                  helperText={
                    error?.currentStatus ? error.currentStatus.message : null
                  }
                />
              </Grid>

              {/* owner Title */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="title" />}
                  variant="standard"
                  value={watch("ownerTitle")}
                  InputLabelProps={{
                    shrink: watch("ownerTitle") ? true : false,
                  }}
                  error={!!error.ownerTitle}
                  helperText={
                    error?.ownerTitle ? error.ownerTitle.message : null
                  }
                />
              </Grid>

              {/* firstName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  value={watch("ownerFirstName")}
                  InputLabelProps={{
                    shrink: watch("ownerFirstName") ? true : false,
                  }}
                  error={!!error.ownerFirstName}
                  helperText={
                    error?.ownerFirstName ? error.ownerFirstName.message : null
                  }
                />
              </Grid>

              {/* middleName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  value={watch("ownerMiddleName")}
                  InputLabelProps={{
                    shrink: watch("ownerMiddleName") ? true : false,
                  }}
                  error={!!error.ownerMiddleName}
                  helperText={
                    error?.ownerMiddleName
                      ? error.ownerMiddleName.message
                      : null
                  }
                />
              </Grid>

              {/* lastName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lastName" />}
                  variant="standard"
                  value={watch("ownerLastName")}
                  InputLabelProps={{
                    shrink: watch("ownerLastName") ? true : false,
                  }}
                  error={!!error.ownerLastName}
                  helperText={
                    error?.ownerLastName ? error.ownerLastName.message : null
                  }
                />
              </Grid>

              {/* mobileNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  value={watch("ownerMobileNo")}
                  InputLabelProps={{
                    shrink: watch("ownerMobileNo") ? true : false,
                  }}
                  error={!!error.ownerMobileNo}
                  helperText={
                    error?.ownerMobileNo ? error.ownerMobileNo.message : null
                  }
                />
              </Grid>

              {/* aadharNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="aadharNo" />}
                  variant="standard"
                  value={watch("ownerAadharNo")}
                  InputLabelProps={{
                    shrink: watch("ownerAadharNo") ? true : false,
                  }}
                  error={!!error.ownerAadharNo}
                  helperText={
                    error?.ownerAadharNo ? error.ownerAadharNo.message : null
                  }
                />
              </Grid>

              {/* email */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="email" />}
                  variant="standard"
                  value={watch("ownerEmail")}
                  InputLabelProps={{
                    shrink: watch("ownerEmail") ? true : false,
                  }}
                  error={!!error.ownerEmail}
                  helperText={
                    error?.ownerEmail ? error.ownerEmail.message : null
                  }
                />
              </Grid>

              {/* age */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="age" />}
                  variant="standard"
                  value={watch("ownerAge")}
                  InputLabelProps={{
                    shrink: watch("ownerAge") ? true : false,
                  }}
                  error={!!error.ownerAge}
                  helperText={error?.ownerAge ? error.ownerAge.message : null}
                />
              </Grid>

              {/* occupation */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="occupation" />}
                  variant="standard"
                  value={watch("ownerOccupation")}
                  InputLabelProps={{
                    shrink: watch("ownerOccupation") ? true : false,
                  }}
                  error={!!error.ownerOccupation}
                  helperText={
                    error?.ownerOccupation
                      ? error.ownerOccupation.message
                      : null
                  }
                />
              </Grid>

              {/* relation  */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="relation" />}
                  variant="standard"
                  value={watch("ownerRelation")}
                  InputLabelProps={{
                    shrink: watch("ownerRelation") ? true : false,
                  }}
                  error={!!error.ownerRelation}
                  helperText={
                    error?.ownerRelation ? error.ownerRelation.message : null
                  }
                />
              </Grid>

              {/* Slum Name */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="slumName" />}
                  variant="standard"
                  value={watch("slumKey")}
                  InputLabelProps={{
                    shrink: watch("slumKey") ? true : false,
                  }}
                  error={!!error.slumKey}
                  helperText={error?.slumKey ? error.slumKey.message : null}
                />
              </Grid>

              {/* Area */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="area" />}
                  variant="standard"
                  value={watch("areaKey")}
                  InputLabelProps={{
                    shrink: watch("areaKey") ? true : false,
                  }}
                  error={!!error.areaKey}
                  helperText={error?.areaKey ? error.areaKey.message : null}
                />
              </Grid>

              {/* Village */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="village" />}
                  variant="standard"
                  value={watch("villageKey")}
                  InputLabelProps={{
                    shrink: watch("villageKey") ? true : false,
                  }}
                  error={!!error.villageKey}
                  helperText={
                    error?.villageKey ? error.villageKey.message : null
                  }
                />
              </Grid>

              {/* pincode */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="pincode" />}
                  variant="standard"
                  value={watch("pincode")}
                  InputLabelProps={{
                    shrink: watch("pincode") ? true : false,
                  }}
                  error={!!error.pincode}
                  helperText={error?.pincode ? error.pincode.message : null}
                />
              </Grid>

              {/* Lattitude */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lattitude" />}
                  variant="standard"
                  value={watch("lattitude")}
                  InputLabelProps={{
                    shrink: watch("lattitude") ? true : false,
                  }}
                  error={!!error.lattitude}
                  helperText={error?.lattitude ? error.lattitude.message : null}
                />
              </Grid>

              {/* Longitude */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="longitude" />}
                  variant="standard"
                  value={watch("longitude")}
                  InputLabelProps={{
                    shrink: watch("longitude") ? true : false,
                  }}
                  error={!!error.longitude}
                  helperText={error?.longitude ? error.longitude.message : null}
                />
              </Grid>
            </Grid>

            {/********* Spouse Information *********/}

            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="spouseDetails" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Spouse Title */}

              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="title" />}
                  variant="standard"
                  value={watch("spouseTitle")}
                  InputLabelProps={{
                    shrink: watch("spouseTitle") ? true : false,
                  }}
                  error={!!error.spouseTitle}
                  helperText={
                    error?.spouseTitle ? error.spouseTitle.message : null
                  }
                />
              </Grid>

              {/* Spouse firstName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseFirstName") != ""}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="firstName" />}
                  variant="standard"
                  {...register("spouseFirstName")}
                  InputLabelProps={{
                    shrink: watch("spouseFirstName") ? true : false,
                  }}
                  error={!!error.spouseFirstName}
                  helperText={
                    error?.spouseFirstName
                      ? error.spouseFirstName.message
                      : null
                  }
                />
              </Grid>

              {/* Spouse middleName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseMiddleName") != ""}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="middleName" />}
                  variant="standard"
                  {...register("spouseMiddleName")}
                  InputLabelProps={{
                    shrink: watch("spouseMiddleName") ? true : false,
                  }}
                  error={!!error.spouseMiddleName}
                  helperText={
                    error?.spouseMiddleName
                      ? error.spouseMiddleName.message
                      : null
                  }
                />
              </Grid>

              {/* Spouse lastName */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseLastName") != ""}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="lastNameEn" />}
                  variant="standard"
                  {...register("spouseLastName")}
                  InputLabelProps={{
                    shrink: watch("spouseLastName") ? true : false,
                  }}
                  error={!!error.spouseLastName}
                  helperText={
                    error?.spouseLastName ? error.spouseLastName.message : null
                  }
                />
              </Grid>

              {/* Spouse mobileNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseMobileNo")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="mobileNo" />}
                  variant="standard"
                  {...register("spouseMobileNo")}
                  InputLabelProps={{
                    shrink: watch("spouseMobileNo") ? true : false,
                  }}
                  error={!!error.spouseMobileNo}
                  helperText={
                    error?.spouseMobileNo ? error.spouseMobileNo.message : null
                  }
                />
              </Grid>

              {/* Spouse aadharNo */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseAadharNo")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="aadharNo" />}
                  variant="standard"
                  {...register("spouseAadharNo")}
                  InputLabelProps={{
                    shrink: watch("spouseAadharNo") ? true : false,
                  }}
                  error={!!error.spouseAadharNo}
                  helperText={
                    error?.spouseAadharNo ? error.spouseAadharNo.message : null
                  }
                />
              </Grid>

              {/* Spouse email */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseEmail")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="email" />}
                  variant="standard"
                  {...register("spouseEmail")}
                  InputLabelProps={{
                    shrink: watch("spouseEmail") ? true : false,
                  }}
                  error={!!error.spouseEmail}
                  helperText={
                    error?.spouseEmail ? error.spouseEmail.message : null
                  }
                />
              </Grid>

              {/* Spouse age */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseAge")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="age" />}
                  variant="standard"
                  {...register("spouseAge")}
                  InputLabelProps={{
                    shrink: watch("spouseAge") ? true : false,
                  }}
                  error={!!error.spouseAge}
                  helperText={error?.spouseAge ? error.spouseAge.message : null}
                />
              </Grid>

              {/* Spouse occupation */}
              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={watch("spouseOccupation")}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="occupation" />}
                  variant="standard"
                  {...register("spouseOccupation")}
                  InputLabelProps={{
                    shrink: watch("spouseOccupation") ? true : false,
                  }}
                  error={!!error.spouseOccupation}
                  helperText={
                    error?.spouseOccupation
                      ? error.spouseOccupation.message
                      : null
                  }
                />
              </Grid>

              {/* Spouse relation */}

              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                <TextField
                  disabled={true}
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="relation" />}
                  variant="standard"
                  value={watch("spouseRelation")}
                  InputLabelProps={{
                    shrink: watch("spouseRelation") ? true : false,
                  }}
                  error={!!error.spouseRelation}
                  helperText={
                    error?.spouseRelation ? error.spouseRelation.message : null
                  }
                />
              </Grid>
            </Grid>

            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="scheduleSiteVisit" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Schedule date & time */}

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Controller
                  control={control}
                  name="scheduledTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        disabled
                        {...field}
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            size="small"
                            fullWidth
                            sx={{ width: "75%" }}
                            error={error.scheduledTime}
                            helperText={
                              error?.scheduledTime
                                ? error.scheduledTime.message
                                : null
                            }
                          />
                        )}
                        label={
                          <FormattedLabel id="scheduleDateTime" required />
                        }
                        // value={field.value}
                        // onChange={(date) =>
                        //   field.onChange(
                        //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                        //   )
                        // }
                        // defaultValue={null}
                        // inputFormat="DD-MM-YYYY hh:mm:ss"
                        onChange={(date) => {
                          const formattedDate =
                            moment(date).format("YYYY-MM-DD");
                          const formattedTime =
                            moment(date).format("hh:mm:ss A");
                          field.onChange(`${formattedDate} ${formattedTime}`);
                        }}
                        value={
                          field.value
                            ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                            : null
                        }
                        defaultValue={null}
                        inputFormat="YYYY-MM-DD hh:mm:ss A"
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>

              <Grid
                item
                xl={4}
                lg={4}
                md={6}
                sm={6}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Controller
                  control={control}
                  name="rescheduleTime"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DateTimePicker
                        disabled
                        {...field}
                        renderInput={(props) => (
                          <TextField
                            {...props}
                            size="small"
                            fullWidth
                            sx={{ width: "75%" }}
                            error={error.scheduledTime}
                            helperText={
                              error?.scheduledTime
                                ? error.scheduledTime.message
                                : null
                            }
                          />
                        )}
                        label={
                          <FormattedLabel id="rescheduleDateTime" required />
                        }
                        // value={field.value}
                        // onChange={(date) =>
                        //   field.onChange(
                        //     moment(date).format("YYYY-MM-DDThh:mm:ss")
                        //   )
                        // }
                        // defaultValue={null}
                        // inputFormat="DD-MM-YYYY hh:mm:ss"
                        onChange={(date) => {
                          const formattedDate =
                            moment(date).format("YYYY-MM-DD");
                          const formattedTime =
                            moment(date).format("hh:mm:ss A");
                          field.onChange(`${formattedDate} ${formattedTime}`);
                        }}
                        value={
                          field.value
                            ? moment(field.value, "YYYY-MM-DD hh:mm:ss A")
                            : null
                        }
                        defaultValue={null}
                        inputFormat="YYYY-MM-DD hh:mm:ss A"
                      />
                    </LocalizationProvider>
                  )}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid
                item
                xl={12}
                lg={12}
                md={12}
                sm={12}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  endIcon={<ExitToApp />}
                  onClick={() => {
                    if(loggedInUser==='citizenUser'){
                      router.push("/dashboard");
                    }else if(loggedInUser==='cfcUser'){
                      router.push("/CFC_Dashboard");
                    } else {
                      router.push(
                        `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
                      );
                    }
                  }}
                >
                  <FormattedLabel id="exit" />
                  {/* {labels["exit"]} */}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
