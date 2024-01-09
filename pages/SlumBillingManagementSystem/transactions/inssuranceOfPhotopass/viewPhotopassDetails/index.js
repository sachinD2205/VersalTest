import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Grid,
  Paper,
  Modal,
  TextField,
  Button,
  IconButton,
  ThemeProvider,
} from "@mui/material";
import theme from "../../../../../theme";
import React from "react";
import { useForm } from "react-hook-form";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import router from "next/router";
import axios from "axios";
import Photopass from "../generateDocuments/photopass";
import { Clear, ExitToApp, Language, Save } from "@mui/icons-material";
import urls from "../../../../../URLS/urls";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import sweetAlert from "sweetalert";
import { manageStatus } from "../../../../../components/ElectricBillingComponent/commonStatus/manageEnMr";
import { ToWords } from "to-words";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
import commonRoleId from "../../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
const Index = (props) => {
  const {
    register,
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
    control,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);
  const [ownership, setOwnership] = useState({});
  const headers = { Authorization: `Bearer ${user?.token}` };

  const handleClose = () => setOpen(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  let loggedInUser = localStorage.getItem("loggedInUser");
  const [isRemarksFilled, setIsRemarksFilled] = useState(false);
  // selected menu from drawer
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [usageType, setUsageType] = useState({});
  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;
  console.log("authority", authority);

  // multiple files attach
  const [finalFiles, setFinalFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authorizedToUpload, setAuthorizedToUpload] = useState(false);
  const [appliNo, setApplicationNo] = useState();
  const [photo, setPhoto] = useState(null);
  const [titleDropDown, setTitleDropDown] = useState([]);
  const [relationDropDown, setRelationDropDown] = useState([]);
  const [statusAll, setStatus] = useState([]);
  const [dataSource, setDataSource] = useState({});
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [remark, setRemark] = useState("");
  const [siteVisitRemark, setSiteVisitRemark] = useState("");
  const [clerkApprovalRemark, setClerkApprovalRemark] = useState("");
  const [hutData, setHutData] = useState({});
  const [headClerkApprovalRemark, setHeadClerkApprovalRemark] = useState("");
  const [isModalOpenForResolved, setIsModalOpenForResolved] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [
    officeSuperintendantApprovalRemark,
    setOfficeSuperintendantApprovalRemark,
  ] = useState("");
  const [
    administrativeOfficerApprovalRemark,
    setAdministrativeOfficerApprovalRemark,
  ] = useState("");
  const [
    assistantCommissionerApprovalRemark,
    setAssistantCommissionerApprovalRemark,
  ] = useState("");

  const [finalApprovedRemark, setFinalApprovedRemark] = useState("");
  const [areRemarksFilled, setAreRemarksFilled] = useState(false);
  const [loiLoading, setLoiIsLoading] = useState(false);

  useEffect(() => {
    setAreRemarksFilled(
      siteVisitRemark ||
        clerkApprovalRemark ||
        headClerkApprovalRemark ||
        administrativeOfficerApprovalRemark ||
        officeSuperintendantApprovalRemark ||
        assistantCommissionerApprovalRemark ||
        finalApprovedRemark
    );
  }, [
    siteVisitRemark,
    clerkApprovalRemark,
    headClerkApprovalRemark,
    administrativeOfficerApprovalRemark,
    assistantCommissionerApprovalRemark,
    officeSuperintendantApprovalRemark,
    finalApprovedRemark,
  ]);
  const [totalInWords, setTotalInWords] = useState(0);

  const toWordsEn = new ToWords({ localeCode: "en-IN" });
  const toWordsMr = new ToWords({ localeCode: "mr-IN" });
  const toWords = language == "en" ? toWordsEn : toWordsMr;

  const handleTotalAmountChange = (event) => {
    const totalAmountValue = event.target.value;

    const totalAmountNumber = parseFloat(totalAmountValue);
    const amountToConvert = isNaN(totalAmountNumber) ? 0 : totalAmountNumber;

    const words = toWords.convert(amountToConvert);
    setTotalInWords(words);
  };

  const handleRemarkChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    switch (fieldName) {
      case "clerkApprovalRemark":
        setClerkApprovalRemark(fieldValue);
        break;
      case "headClerkApprovalRemark":
        setHeadClerkApprovalRemark(fieldValue);
        break;

      case "administrativeOfficerApprovalRemark":
        setAdministrativeOfficerApprovalRemark(fieldValue);
        break;
      case "assistantCommissionerApprovalRemark":
        setAssistantCommissionerApprovalRemark(fieldValue);
        break;
      // case "finalApprovedRemark":
      //   setFinalRemark(fieldValue);
      //   break;
      // case "remarks":
      //   setCompleteApprovalRemark(fieldValue);
      //   break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    setIsModalOpenForResolved(false);
  };

  useEffect(() => {
    setDataSource(props?.data);
  }, [props?.data]);

  // Check some condition for hide and show
  const checkSomeCondition = () => {
    return (
      ((dataSource?.status == 25 || dataSource?.status == 16) &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_CLERK)) ||
      (dataSource?.status == 5 &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK)) ||
      (dataSource?.status == 7 &&
        authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT
        )) ||
      (authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
        ) &&
        dataSource?.status == 9) ||
      (authority &&
        authority.find(
          (val) =>
            val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
            dataSource?.status == 11
        ))
    );
  };

  useEffect(() => {
    getServiceCharges();
  }, []);

  const getServiceCharges = () => {
    axios
      .get(
        `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=120`,
        { headers: headers }
      )
      .then((r) => {
        let temp = r.data.serviceCharge[0];
        setValue("serviceAmount", temp?.amount);
        setValue("totalAmount", temp?.amount);
        setValue(
          "chargeName",
          temp?.chargeName === null ? "-" : temp?.chargeName
        );
        setTotalInWords(toWords.convert(temp?.amount));
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };
  const handleLOIButton = () => {
    setLoiIsLoading(true);
    let formData = {
      referenceKey: dataSource?.id,
      title: dataSource?.applicantTitle,
      middleName: dataSource?.applicantMiddleName,
      firstName: dataSource?.applicantFirstName,
      lastName: dataSource?.applicantLastName,
      mobileNo: dataSource?.applicantMobileNo,
      totalAmount: watch("totalAmount"),
    };
    const tempData = axios
      .post(`${urls.SLUMURL}/trnLoi/issuePhotopass/save`, formData, {
        headers: headers,
      })
      .then((res) => {
        setLoiIsLoading(false);
        if (res.status == 201) {
          setIsModalOpenForResolved(false);
          sweetAlert(
            language == "en" ? "Generated!" : "उत्पन्न!",
            language == "en"
              ? `LOI Payment against ${dataSource.applicationNo} Generated Successfully !`
              : `${dataSource.applicationNo} विरुद्ध LOI पेमेंट यशस्वीरित्या उत्पन्न झाले !`,
            "success",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          ).then((will) => {
            if (will) {
              router.push({
                pathname:
                  "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails",
                query: {
                  id: router.query.id,
                },
              });
            }
          });
        }
      })
      .catch((err) => {
        setLoiIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  function showFileName(fileName) {
    let fileNamee = [];
    fileNamee = fileName?.split("__");

    return fileNamee?.length > 0 && fileNamee[1];
  }

  useEffect(() => {
    if (dataSource != null) {
      setDataOnForm();
    }
  }, [dataSource, language]);

  const setDataOnForm = () => {
    let res = dataSource;

    setValue("hutNo", res ? res.hutNo : "-");
    setValue("applicationNo", res ? res.applicationNo : "-");
    setApplicationNo(res?.applicationNo);
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
    // if (res?.husbandWifeCombinedPhoto) {
    //   getFilePreview(res?.husbandWifeCombinedPhoto);
    // }

    setValue("clerkApprovalRemark", res?.clerkApprovalRemark);
    setValue("headClerkApprovalRemark", res?.headClerkApprovalRemark);
    setValue(
      "officeSuperintendantApprovalRemark",
      res?.officeSuperintendantApprovalRemark
    );
    setValue(
      "administrativeOfficerApprovalRemark",
      res?.administrativeOfficerApprovalRemark
    );
    setValue(
      "assistantCommissionerApprovalRemark",
      res?.assistantCommissionerApprovalRemark
    );

    let siteVisitObj =
      dataSource?.trnVisitScheduleList &&
      dataSource.trnVisitScheduleList[
        dataSource?.trnVisitScheduleList?.length - 1
      ];

    if (siteVisitObj) {
      const showFileNameOrDefault = (fileName) =>
        fileName ? showFileName(fileName) : "Default File Name";

      const finalFiles = Array.from({ length: 5 }, (_, index) => {
        const siteImage = siteVisitObj[`siteImage${index + 1}`];
        if (siteImage) {
          return {
            srNo: index + 1,
            fileName: showFileNameOrDefault(siteImage),
            filePath: siteImage,
          };
        }
        return null;
      }).filter((fileObj) => fileObj !== null);

      setFinalFiles(finalFiles);
    }
    setValue("siteVisitRemark", siteVisitObj?.remarks);
  };

  useEffect(() => {
    setIsRemarksFilled(
      // completeApprovalRemark ||
      clerkApprovalRemark ||
        headClerkApprovalRemark ||
        officeSuperintendantApprovalRemark ||
        administrativeOfficerApprovalRemark ||
        assistantCommissionerApprovalRemark
    );
  }, [
    // completeApprovalRemark,
    clerkApprovalRemark,
    headClerkApprovalRemark,
    officeSuperintendantApprovalRemark,
    administrativeOfficerApprovalRemark,
    assistantCommissionerApprovalRemark,
  ]);
  const handleOnSubmit = (formData) => {
    console.log("f", formData === "revert" && dataSource?.status === 16);
    setIsLoading(true);
    let payload = {
      ...dataSource,
      clerkApprovalRemark: watch("clerkApprovalRemark"),
      headClerkApprovalRemark: watch("headClerkApprovalRemark"),
      administrativeOfficerApprovalRemark: watch(
        "administrativeOfficerApprovalRemark"
      ),
      assistantCommissionerApprovalRemark: watch(
        "assistantCommissionerApprovalRemark"
      ),
      isApproved:
        formData === "approve" ? true : formData === "revert" ? false : null,
      isComplete: false,
      rejected:
        formData === "revert" && dataSource?.status === 16 ? true : false,
      id: dataSource?.id,
      status: dataSource?.status,
      activeFlag: dataSource?.activeFlag,
    };

    console.log("payload", payload);
    const tempData = axios
      .post(`${urls.SLUMURL}/trnIssuePhotopass/save`, payload, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          formData === "revert" && dataSource?.status === 16
            ? sweetAlert(
                language === "en" ? "Rejected!" : "नाकारले!",
                language == "en"
                  ? `Photopass against ${dataSource.applicationNo} rejected successfully !`
                  : `${dataSource.applicationNo} फोटोपास यशस्वीरित्या नाकारले !",`,
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
                if (will) {
                  router.push(
                    "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails"
                  );
                }
              })
            : sweetAlert(
                formData === "approve"
                  ? language == "en"
                    ? "Approved!"
                    : "मंजूर!"
                  : language === "en"
                  ? "Revert!"
                  : "पूर्वस्थितीवर येणे!",
                formData === "approve"
                  ? language == "en"
                    ? `Photopass against ${dataSource.applicationNo} Approved successfully !`
                    : `${dataSource.applicationNo} विरुद्ध फोटोपास यशस्वीरीत्या मंजूर झाला!`
                  : language == "en"
                  ? `Photopass against ${dataSource.applicationNo} reverted successfully !`
                  : `${dataSource.applicationNo} फोटोपास यशस्वीरित्या परत केले!`,
                "success",
                { button: language === "en" ? "Ok" : "ठीक आहे" }
              ).then((will) => {
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
        cfcErrorCatchMethod(err, false);
      });
  };

  return (
    <>
      {isLoading && <CommonLoader />}
      <ThemeProvider theme={theme}>
        {/* <form onSubmit={handleSubmit(handleOnSubmit)}> */}

        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          {/* clerk remark */}

          {((authority &&
            authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
            ((dataSource?.status == 16) || (dataSource?.status == 14) ||
              dataSource?.status == 26)) ||
            (dataSource?.status != 15 && dataSource?.status != 28) ||
            watch("clerkApprovalRemark")) && (
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={
                  authority &&
                  authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
                  (dataSource?.status == 14 ||
                    dataSource?.status == 25 ||
                    dataSource?.status === 16)
                    ? false
                    : true
                }
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="clerkApprovalRemark" />}
                inputProps={{ maxLength: 500 }}
                variant="standard"
                // {...register("clerkApprovalRemark")}
                {...register("clerkApprovalRemark")}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch("clerkApprovalRemark")
                      ? true
                      : false,
                }}
                onChange={(e) => handleRemarkChange(e, "clerkApprovalRemark")}
                error={!!error.clerkApprovalRemark}
                helperText={
                  error?.clerkApprovalRemark
                    ? error.clerkApprovalRemark.message
                    : null
                }
              />
            </Grid>
          )}

          {/* headClerkApprovalRemark */}

          {((authority &&
            authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK) &&
            dataSource?.status == 5) ||
            watch("headClerkApprovalRemark") ||
            (dataSource?.status != 5 &&
              dataSource?.status != 20 &&
              dataSource?.status != 15 &&
              dataSource?.status != 28 &&
              dataSource?.status != 16 &&
              dataSource?.status != 14)) && (
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={
                  authority &&
                  authority.find(
                    (val) => val === commonRoleId.ROLE_HEAD_CLERK
                  ) &&
                  dataSource?.status === 5
                    ? false
                    : true
                }
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={<FormattedLabel id="headClerkApprovalRemark" />}
                inputProps={{ maxLength: 500 }}
                variant="standard"
                // value={watch("headClerkApprovalRemark")}
                {...register("headClerkApprovalRemark")}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch("headClerkApprovalRemark")
                      ? true
                      : false,
                }}
                onChange={(e) =>
                  handleRemarkChange(e, "headClerkApprovalRemark")
                }
                error={!!error.headClerkApprovalRemark}
                helperText={
                  error?.headClerkApprovalRemark
                    ? error.headClerkApprovalRemark.message
                    : null
                }
              />
            </Grid>
          )}

          {/* administrativeOfficerApprovalRemark */}
          {((authority &&
            authority.find(
              (val) =>
                val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER &&
                dataSource?.status == 9
            )) ||
            dataSource?.status === 11 ||
            dataSource?.status == 21 ||
            dataSource?.status === 17 ||
            watch("administrativeOfficerApprovalRemark")) && (
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={authority &&
                  authority.find(
                    (val) =>
                      val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER) &&
                      dataSource?.status == 9?false:true}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={
                  <FormattedLabel id="administrativeOfficerApprovalRemark" />
                }
                inputProps={{ maxLength: 500 }}
                variant="standard"
                {...register("administrativeOfficerApprovalRemark")}
                InputLabelProps={{
                  shrink:
                    router.query.id ||
                    watch("administrativeOfficerApprovalRemark")
                      ? true
                      : false,
                }}
                onChange={(e) =>
                  handleRemarkChange(e, "administrativeOfficerApprovalRemark")
                }
                error={!!error.administrativeOfficerApprovalRemark}
                helperText={
                  error?.administrativeOfficerApprovalRemark
                    ? error.administrativeOfficerApprovalRemark.message
                    : null
                }
              />
            </Grid>
          )}

          {/* assistantCommissionerApprovalRemark */}
          {((authority &&
            authority.find(
              (val) =>
                val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
                dataSource?.status == 11
            )) ||
            dataSource?.status == 21 ||
            watch("assistantCommissionerApprovalRemark") ||
            dataSource?.status === 17) && (
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
                marginTop: "20px",
              }}
            >
              <TextField
                multiline
                disabled={
                  authority &&
                  authority.find(
                    (val) =>
                      val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
                      dataSource?.status == 11
                  )
                    ? false
                    : true
                }
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                label={
                  <FormattedLabel id="assistantCommissionerApprovalRemark" />
                }
                inputProps={{ maxLength: 500 }}
                variant="standard"
                // value={watch("assistantCommissionerApprovalRemark")}
                {...register("assistantCommissionerApprovalRemark")}
                InputLabelProps={{
                  shrink:
                    router.query.id ||
                    watch("assistantCommissionerApprovalRemark")
                      ? true
                      : false,
                }}
                onChange={(e) =>
                  handleRemarkChange(e, "assistantCommissionerApprovalRemark")
                }
                error={!!error.assistantCommissionerApprovalRemark}
                helperText={
                  error?.assistantCommissionerApprovalRemark
                    ? error.assistantCommissionerApprovalRemark.message
                    : null
                }
              />
            </Grid>
          )}
        </Grid>

        <Grid container spacing={2} sx={{ padding: "1rem" }}>
          {loggedInUser === "departmentUser" && dataSource?.status != 17 && (
            <>
              <Grid
                item
                xl={
                  checkSomeCondition()
                    ? 4
                    : ((watch("isRejected") || watch("isRescheduled")) &&
                        (dataSource?.status == 15 ||
                          dataSource?.status === 2 ||
                          dataSource?.status === 28) &&
                        dataSource?.status == 16) ||
                      ((dataSource?.status === 16 ||
                        dataSource?.status === 21 ||
                        dataSource?.status === 4 ||
                        dataSource?.status === 14) &&
                        authority &&
                        authority.find(
                          (val) => val === commonRoleId.ROLE_CLERK
                        ))
                    ? 6
                    : 12
                }
                lg={
                  checkSomeCondition()
                    ? 4
                    : ((watch("isRejected") || watch("isRescheduled")) &&
                        (dataSource?.status == 15 ||
                          dataSource?.status === 2 ||
                          dataSource?.status === 28) &&
                        dataSource?.status == 16) ||
                      ((dataSource?.status === 16 ||
                        dataSource?.status === 21 ||
                        dataSource?.status === 4 ||
                        dataSource?.status === 14) &&
                        authority &&
                        authority.find(
                          (val) => val === commonRoleId.ROLE_CLERK
                        ))
                    ? 6
                    : 12
                }
                md={
                  checkSomeCondition()
                    ? 4
                    : ((watch("isRejected") || watch("isRescheduled")) &&
                        (dataSource?.status == 15 ||
                          dataSource?.status === 2 ||
                          dataSource?.status === 28) &&
                        dataSource?.status == 16) ||
                      ((dataSource?.status === 16 ||
                        dataSource?.status === 21 ||
                        dataSource?.status === 4 ||
                        dataSource?.status === 14) &&
                        authority &&
                        authority.find(
                          (val) => val === commonRoleId.ROLE_CLERK
                        ))
                    ? 6
                    : 12
                }
                sm={
                  checkSomeCondition()
                    ? 4
                    : ((watch("isRejected") || watch("isRescheduled")) &&
                        (dataSource?.status == 15 ||
                          dataSource?.status === 2 ||
                          dataSource?.status === 28) &&
                        dataSource?.status == 16) ||
                      ((dataSource?.status === 16 ||
                        dataSource?.status === 21 ||
                        dataSource?.status === 4 ||
                        dataSource?.status === 14) &&
                        authority &&
                        authority.find(
                          (val) => val === commonRoleId.ROLE_CLERK
                        ))
                    ? 6
                    : 12
                }
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
                    }else {
                      router.push(
                        `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
                      );
                    }
                  }}
                >
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>

              {(((dataSource?.status == 14 ||
                dataSource?.status === 21 ||
                dataSource?.status === 25 ||
                dataSource?.status === 16) &&
                authority &&
                authority.find((val) => val === commonRoleId.ROLE_CLERK)) ||
                (dataSource?.status == 5 &&
                  authority &&
                  authority.find(
                    (val) => val === commonRoleId.ROLE_HEAD_CLERK
                  )) ||
                (dataSource?.status == 7 &&
                  authority &&
                  authority.find(
                    (val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT
                  )) ||
                (authority &&
                  authority.find(
                    (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
                  ) &&
                  dataSource?.status == 9) ||
                (authority &&
                  authority.find(
                    (val) =>
                      val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
                      dataSource?.status == 11
                  ))) && (
                <>
                  {" "}
                  <Grid
                    item
                    xl={
                      dataSource?.status === 21 || dataSource?.status === 14
                        ? 6
                        : 4
                    }
                    lg={
                      dataSource?.status === 21 || dataSource?.status === 14
                        ? 6
                        : 4
                    }
                    md={
                      dataSource?.status === 21 || dataSource?.status === 14
                        ? 6
                        : 4
                    }
                    sm={
                      dataSource?.status === 21 || dataSource?.status === 14
                        ? 6
                        : 4
                    }
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      color="success"
                      variant="contained"
                      size="small"
                      type="submit"
                      disabled={!isRemarksFilled}
                      onClick={() => {
                        handleOnSubmit("approve");
                        // setBtnSaveText("finalApprove");
                      }}
                      endIcon={<Save />}
                    >
                      <FormattedLabel id="APPROVE" />
                    </Button>
                  </Grid>
                  {/* head clerk */}
                  {dataSource?.status != 21 && dataSource?.status != 14 && (
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
                      sm={4}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "10px",
                      }}
                    >
                      <Button
                        color="secondary"
                        variant="contained"
                        size="small"
                        type="submit"
                        disabled={!isRemarksFilled}
                        onClick={() => {
                          handleOnSubmit("revert");
                        }}
                        endIcon={<Save />}
                      >
                        {dataSource?.status === 16 ? (
                          <FormattedLabel id="reject" />
                        ) : (
                          <FormattedLabel id="revert" />
                        )}
                      </Button>
                    </Grid>
                  )}
                </>
              )}

              {authority &&
                authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
                dataSource?.status === 4 && (
                  <Grid
                    item
                    xl={6}
                    lg={6}
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
                    <Button
                      variant="contained"
                      size="small"
                      color="success"
                      onClick={() => {
                        setIsModalOpenForResolved(true);
                      }}
                    >
                      <FormattedLabel id="generateLoi" />
                    </Button>
                  </Grid>
                )}
            </>
          )}
        </Grid>
        {/* </form> */}
      </ThemeProvider>
      <Modal
        title="Modal For LOI"
        open={isModalOpenForResolved}
        onOk={true}
        onClose={handleCancel} // ISKI WAJHASE KAHI BHI CLICK KRNE PER MODAL CLOSE HOTA HAI
        footer=""
        style={{
          maxheight: "40%",
          margin: "50px",
          padding: "10px",
        }}
      >
        <ThemeProvider theme={theme}>
          {loiLoading && <CommonLoader />}
          <Box
            sx={{
              overflowY: "scroll",
              backgroundColor: "white",
              height: "80vh",
              padding: "10px",
            }}
          >
            <>
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
                      <FormattedLabel id="loiGenerate" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <form>
                <Grid container spacing={3} sx={{ padding: "2rem" }}>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="serviceName" />}
                      multiline
                      variant="standard"
                      value={"Photopass Service charges"}
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      id="standard-textarea"
                      label={<FormattedLabel id="applicationNo" />}
                      multiline
                      variant="standard"
                      value={appliNo}
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="applicantName" />}
                      multiline
                      variant="standard"
                      value={
                        watch("ownerFirstName") +
                        " " +
                        watch("ownerMiddleName") +
                        " " +
                        watch("ownerLastName")
                      }
                    />
                  </Grid>
                  {/* mobileNo */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="mobileNo" />}
                      // @ts-ignore
                      variant="standard"
                      value={watch("ownerMobileNo")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  {/* EmailId */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="emailId" />}
                      // @ts-ignore
                      variant="standard"
                      value={watch("ownerEmail")}
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                        <FormattedLabel id="chargesDetails" />
                      </h3>
                    </Grid>
                  </Grid>
                </Box>
                <Grid container spacing={2} sx={{ padding: "2rem" }}>
                  {/* Name of charge */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      InputLabelProps={{ shrink: true }}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="chargeName" />}
                      // multiline
                      {...register("chargeName")}
                      variant="standard"
                      value={watch("chargeName")}
                    />
                  </Grid>
                  {/* loi Genrate */}
                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-textarea"
                      label={<FormattedLabel id="serviceCharges" required />}
                      {...register("serviceAmount")}
                      variant="standard"
                    />
                  </Grid>

                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      label={<FormattedLabel id="totalAmount" required />}
                      id="standard-textarea"
                      // disabled={true}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      {...register("totalAmount")}
                      onChange={handleTotalAmountChange}
                      error={!!error.totalAmount}
                      helperText={
                        error?.totalAmount ? error.totalAmount.message : null
                      }
                    />
                  </Grid>

                  <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                    <TextField
                      label="Total Amount in Words"
                      id={<FormattedLabel id="totalInWords" />}
                      disabled
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      variant="standard"
                      value={totalInWords}
                    />
                  </Grid>

                  <Grid container spacing={2} sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<ClearIcon />}
                        onClick={() => handleCancel()}
                      >
                        <FormattedLabel id="close" />
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xl={6}
                      lg={6}
                      md={6}
                      sm={12}
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        onClick={handleLOIButton}
                        variant="contained"
                        color="success"
                        size="small"
                        endIcon={<SaveIcon />}
                      >
                        <FormattedLabel id="loiGenerate" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            </>
          </Box>
          <div>
            {/* <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                height: "90%",
                // bgcolor: "background.paper",
                border: "2px solid #000",
                boxShadow: 24,
                p: 4,
                margin:'20px',
                overflow: "scroll",
              }}
            >
             
                <Photopass
                  connectionData={props.hutData}
                  ownership={props.ownership}
                  usageType={props.usageType}
                  slumName={props.slumName}
                  husbandWifeCombinedPhoto={props.photo}
                  handleClose={handleClose}
                  villageName={props.villageName}
                  // componentRef={componentRef1}
                />
              
            </Box>
          </Modal> */}
          </div>
        </ThemeProvider>
      </Modal>
    </>
  );
};

export default Index;
