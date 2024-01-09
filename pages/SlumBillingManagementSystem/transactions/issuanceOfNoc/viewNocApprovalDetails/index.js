import { Box, Grid, TextField, Button, ThemeProvider } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import schema from "../../../../../containers/schema/slumManagementSchema/issuanceOfNocSchema";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import router from "next/router";
import theme from "../../../../../theme";
import axios from "axios";
import { Clear, ExitToApp, FiveG, Language, Save } from "@mui/icons-material";
import urls from "../../../../../URLS/urls";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import commonRoleId from "../../../../../components/SlumBillingManagementSystem/FileUpload/RoleId/commonRole";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
const Index = (props) => {
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  let loggedInUser = localStorage.getItem("loggedInUser");
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

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
  // get authority of selected user
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;

  // multiple files attach
  const [dataSource, setDataSource] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [clerkApprovalRemark, setClerkApprovalRemark] = useState("");
  const [headClerkApprovalRemark, setHeadClerkApprovalRemark] = useState("");
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
  const headers = { Authorization: `Bearer ${user?.token}` };

  const checkVisible = () => {
    
    return (
      ((dataSource.status == 29 || dataSource.status === 3) &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
        clerkApprovalRemark != "") ||
      (dataSource.status === 27 &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
        finalApprovedRemark != "") ||
      (dataSource.status == 5 &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK) &&
        headClerkApprovalRemark != "") ||
      (authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
        ) &&
        dataSource.status == 9 &&
        administrativeOfficerApprovalRemark != "") ||
      (authority &&
        authority.find(
          (val) =>
            val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
            dataSource.status === 11
        ) &&
        assistantCommissionerApprovalRemark != "")
    );
  };

  const checkSomeCondition = () => {
    return (
      (dataSource.status != 29 &&
        dataSource.status != 27 &&
        dataSource.status != 3 &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_CLERK)) ||
      (dataSource.status != 5 &&
        authority &&
        authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK)) ||
      (dataSource.status != 7 &&
        authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT
        )) ||
      (authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
        ) &&
        dataSource.status != 9) ||
      (authority &&
        authority.find(
          (val) =>
            val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
            dataSource.status != 11
        )) ||
      loggedInUser === "citizenUser" ||
      loggedInUser === "cfcUser"
    );
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
      case "finalApprovalRemark":
        setFinalApprovedRemark(fieldValue);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setDataSource(props?.data);
  }, [props?.data]);

  useEffect(() => {
    let res = dataSource;
    setValue("purpose", res?.purpose ? res?.purpose : "");
    setValue("clerkApprovalRemark", res?.clerkApprovalRemark);
    setClerkApprovalRemark(res?.clerkApprovalRemark);
    setValue("headClerkApprovalRemark", res?.headClerkApprovalRemark);
    setValue(
      "administrativeOfficerApprovalRemark",
      res?.administrativeOfficerApprovalRemark
    );
    setValue(
      "assistantCommissionerApprovalRemark",
      res?.assistantCommissionerApprovalRemark
    );
    setValue("finalApprovalRemark", res?.finalApprovalRemark);
    setFinalApprovedRemark(res?.finalApprovalRemark);
  }, [dataSource, language]);

  const approvalValidation = () => {
    let clerk =
      authority && authority.find((val) => val === commonRoleId.ROLE_CLERK);
    let headClerk =
      authority &&
      authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK);
    let officeSuperintendant =
      authority &&
      authority.find((val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT);
    let adminOfficer =
      authority &&
      authority.find((val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER);
    let asstComissioner =
      authority &&
      authority.find((val) => val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER);

    return clerk == 60 &&
      (dataSource?.status == 14 ||
        dataSource?.status == 3 ||
        dataSource?.status == 4 ||
        dataSource?.status == 25 ||
        dataSource?.status == 26 ||
        dataSource?.status == 29)
      ? false
      : headClerk === 62 && (dataSource?.status == 5 || dataSource?.status == 6)
      ? false
      : officeSuperintendant === 104 &&
        (dataSource?.status == 7 || dataSource?.status == 8)
      ? false
      : adminOfficer === 65 &&
        (dataSource?.status == 9 || dataSource?.status == 10)
      ? false
      : asstComissioner === 66 &&
        (dataSource?.status == 11 || dataSource?.status == 12)
      ? false
      : true;
  };

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    let body;
    authority && authority.find((val) => val === commonRoleId.ROLE_CLERK)
      ? (body = {
          ...dataSource,
          clerkApprovalRemark: clerkApprovalRemark,
          finalApprovalRemark: finalApprovedRemark,
          isComplete: false,
        })
      : authority &&
        authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK)
      ? (body = {
          ...dataSource,
          headClerkApprovalRemark: headClerkApprovalRemark,
          isComplete: false,
        })
      : authority &&
        authority.find((val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT)
      ? (body = {
          ...dataSource,
          officeSuperintendantApprovalRemark:
            officeSuperintendantApprovalRemark,
          isComplete: false,
        })
      : authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
        )
      ? (body = {
          ...dataSource,
          administrativeOfficerApprovalRemark:
            administrativeOfficerApprovalRemark,
          isComplete: false,
        })
      : authority &&
        authority.find(
          (val) => val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER
        )
      ? (body = {
          ...dataSource,
          assistantCommissionerApprovalRemark:
            assistantCommissionerApprovalRemark,
          assistantCommissionerApprovalStatus: "Y",
          isComplete: true,
        })
      : "";

    let payload = {
      ...body,
      isApproved:
        formData === "Save" ? true : formData === "Revert" ? false : true,
      rejected: null,
      id: dataSource?.id,
      status: dataSource?.status,
      activeFlag: dataSource?.activeFlag,
      isComplete: formData === "Complete" ? true : false,
    };
    const tempData = axios
      .post(`${urls.SLUMURL}/trnIssueNoc/save`, payload, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          formData === "Save"
            ? sweetAlert({
                title: language == "en" ? "Approved!" : "यशस्वी !",
                text:
                  language == "en"
                    ? `NOC against ${dataSource.applicationNo} Approved successfully !`
                    : `एन.ओ.सी विरुद्ध ${dataSource.applicationNo} यशस्वीरित्या मंजूर केले!`,
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will) => {
                if (will) {
                  router.push(
                    "/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails"
                  );
                }
              })
            : formData === "Revert"
            ? sweetAlert({
                title: language == "en" ? "Revert!" : "पूर्वस्थितीवर येणे",
                text:
                  language == "en"
                    ? `Noc against ${dataSource.applicationNo} Revert Back successfully !`
                    : ` एन.ओ.सी ${dataSource.applicationNo} यशस्वीरित्या परत या!`,
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will) => {
                if (will) {
                  router.push(
                    "/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails"
                  );
                }
              })
            : formData === "Complete"
            ? sweetAlert({
                title: language == "en" ? "Completed!" : "पूर्ण झाले !",
                text:
                  language == "en"
                    ? `NOC against ${dataSource.applicationNo} Completed successfully !`
                    : `एन.ओ.सी ${dataSource.applicationNo} यशस्वीरित्या पूर्ण झाले!`,
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will) => {
                if (will) {
                  router.push(
                    "/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails"
                  );
                }
              })
            : sweetAlert({
                title: language == "en" ? "Approved!" : "यशस्वी !",
                text:
                  language == "en"
                    ? `NOC against ${dataSource.applicationNo} Approved successfully !`
                    : `एन.ओ.सी विरुद्ध ${dataSource.applicationNo} यशस्वीरित्या मंजूर केले!`,
                icon: "success",
                button: language === "en" ? "Ok" : "ठीक आहे",
              }).then((will) => {
                if (will) {
                  router.push(
                    "/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails"
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
        <>
          <form onSubmit={handleSubmit(handleOnSubmit)}>
            <Box>
              <Grid
                container
                className={commonStyles.title}
                style={{ marginTop: "8px" }}
              >
                <Grid item xs={12}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    <FormattedLabel id="purposeForNoc" />
                  </h3>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  label={<FormattedLabel id="purpose" required />}
                  variant="standard"
                  disabled
                  {...register("purpose")}
                  inputProps={{ maxLength: 1000 }}
                  InputLabelProps={{
                    shrink: router.query.id || watch("purpose") ? true : false,
                  }}
                  multiline
                  error={!!error.purpose}
                  helperText={error?.purpose ? error.purpose.message : null}
                />
              </Grid>
            </Grid>

            {/* Remarks */}
            {(((dataSource.status == 29 || dataSource.status == 1) &&
              authority &&
              authority.find((val) => val === commonRoleId.ROLE_CLERK)) ||
              dataSource.status != 1) && (
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
                      <FormattedLabel id="approvalSection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {/* Clerk Approval Remark */}
              {((authority &&
                authority.find((val) => val === commonRoleId.ROLE_CLERK) &&
                (dataSource.status == 29 || dataSource.status == 1)) ||
                (dataSource.status != 15 &&
                  dataSource.status != 28 &&
                  dataSource.status != 29 &&
                  dataSource.status != 16) ||
                watch("clerkApprovalRemark")) && (
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    label={<FormattedLabel id="clearkRemarks" />}
                    variant="standard"
                    disabled={
                      authority &&
                      authority.find((val) => val == commonRoleId.ROLE_CLERK) &&
                      (dataSource.status == 29 || dataSource.status == 3)
                        ? false
                        : true
                    }
                    {...register("clerkApprovalRemark")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{ maxLength: 500 }}
                    onChange={(e) =>
                      handleRemarkChange(e, "clerkApprovalRemark")
                    }
                    multiline
                    error={!!error.clerkApprovalRemark}
                    helperText={
                      error?.clerkApprovalRemark
                        ? error.clerkApprovalRemark.message
                        : null
                    }
                  />
                </Grid>
              )}
              {/* Head Clerk Approval Remark */}
              {((authority &&
                authority.find((val) => val === commonRoleId.ROLE_HEAD_CLERK) &&
                dataSource.status == 5) ||
                (dataSource.status != 5 &&
                  dataSource.status != 29 &&
                  dataSource.status != 1) ||
                watch("headClerkApprovalRemark")) && (
                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                  <TextField
                    sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    label={<FormattedLabel id="headClerkApprovalRemark" />}
                    variant="standard"
                    disabled={
                      authority &&
                      authority.find(
                        (val) => val == commonRoleId.ROLE_HEAD_CLERK
                      ) &&
                      dataSource.status == 5
                        ? false
                        : true
                    }
                    {...register("headClerkApprovalRemark")}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{ maxLength: 500 }}
                    multiline
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
              {/* admin officer Approval Remark */}
              {(authority &&
                authority.find(
                  (val) =>
                    val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER &&
                    dataSource.status == 9
                )) ||
              (dataSource.status != 9 &&
                dataSource.status != 3 &&
                dataSource.status != 5 &&
                dataSource.status != 29 &&
                dataSource.status != 1) ||
              watch("administrativeOfficerApprovalRemark") ? (
                <>
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
                    <TextField
                      multiline
                      disabled={
                        authority &&
                        authority.find(
                          (val) =>
                            val == commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
                        ) &&
                        dataSource.status == 9
                          ? false
                          : true
                      }
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={
                        <FormattedLabel id="administrativeOfficerApprovalRemark" />
                      }
                      // @ts-ignore
                      variant="standard"
                      {...register("administrativeOfficerApprovalRemark")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ maxLength: 500 }}
                      onChange={(e) =>
                        handleRemarkChange(
                          e,
                          "administrativeOfficerApprovalRemark"
                        )
                      }
                      error={!!error.administrativeOfficerApprovalRemark}
                      helperText={
                        error?.administrativeOfficerApprovalRemark
                          ? error.administrativeOfficerApprovalRemark.message
                          : null
                      }
                    />
                  </Grid>
                </>
              ) : (
                <></>
              )}
            </Grid>
            {(watch("finalApprovalRemark") ||
              (dataSource?.status == 27 &&
                loggedInUser != "citizenUser" &&
                authority &&
                authority.find((val) => val === commonRoleId.ROLE_CLERK) ))&& (
                  <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      label={<FormattedLabel id="finalApprovedRemark" />}
                      variant="standard"
                      disabled={dataSource?.status == 17}
                      {...register("finalApprovalRemark")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      multiline
                      onChange={(e) =>
                        handleRemarkChange(e, "finalApprovalRemark")
                      }
                      inputProps={{ maxLength: 500 }}
                      error={!!error.finalApprovalRemark}
                      helperText={
                        error?.finalApprovalRemark
                          ? error.finalApprovalRemark.message
                          : null
                      }
                    />
                  </Grid>
                )}

            <Grid container spacing={2} sx={{ padding: "1rem" }}>
              {(((dataSource.status == 29 || dataSource.status == 3) &&
                authority &&
                authority.find((val) => val === commonRoleId.ROLE_CLERK)) ||
                (dataSource.status == 5 &&
                  authority &&
                  authority.find(
                    (val) => val === commonRoleId.ROLE_HEAD_CLERK
                  )) ||
                (dataSource.status == 7 &&
                  authority &&
                  authority.find(
                    (val) => val === commonRoleId.ROLE_OFFICE_SUPERINTENDANT
                  )) ||
                (authority &&
                  authority.find(
                    (val) => val === commonRoleId.ROLE_ADMINISTRATIVE_OFFICER
                  ) &&
                  dataSource.status == 9) ||
                (authority &&
                  authority.find(
                    (val) =>
                      val === commonRoleId.ROLE_ASSISTANT_COMMISHIONER &&
                      dataSource.status == 11
                  ))) && (
                <>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
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
                      size="small"
                      variant="contained"
                      color="error"
                      endIcon={<ExitToApp />}
                      onClick={() => {
                        if(loggedInUser==='citizenUser'){
                          router.push("/dashboard");
                        }else if(loggedInUser==='cfcUser'){
                          router.push("/CFC_Dashboard");
                        } else {
                          router.push(
                            `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`
                          );
                        }
                      }}
                    >
                      <FormattedLabel id="exit" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xl={4}
                    lg={4}
                    md={4}
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
                      size="small"
                      color="success"
                      variant="contained"
                      type="submit"
                      disabled={!checkVisible()}
                      onClick={() => {
                        handleOnSubmit("Save");
                      }}
                      endIcon={<Save />}
                    >
                      <FormattedLabel id="APPROVE" />
                    </Button>
                  </Grid>

                  {dataSource.status != 14 && (
                    <Grid
                      item
                      xl={4}
                      lg={4}
                      md={4}
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
                        size="small"
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={!checkVisible()}
                        onClick={() => {
                          handleOnSubmit("Revert");
                        }}
                      >
                        <FormattedLabel id="Revert" />
                      </Button>
                    </Grid>
                  )}
                </>
              )}

              {dataSource?.status == 27 &&
                loggedInUser != "citizenUser" &&
                authority &&
                authority.find((val) => val === commonRoleId.ROLE_CLERK) && (
                  <>
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
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        endIcon={<ExitToApp />}
                        onClick={() => {
                          if(loggedInUser==='citizenUser'){
                            router.push("/dashboard");
                          }else if(loggedInUser==='cfcUser'){
                            router.push("/CFC_Dashboard");
                          } else {
                            router.push(
                              `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`
                            );
                          }
                        }}
                      >
                        <FormattedLabel id="exit" />
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
                        marginTop: "20px",
                      }}
                    >
                      {" "}
                      <Button
                        size="small"
                        color="success"
                        variant="contained"
                        type="submit"
                        disabled={!checkVisible}
                        onClick={() => {
                          handleOnSubmit("Complete");
                        }}
                        endIcon={<Save />}
                      >
                        <FormattedLabel id="completeAndIssueOrder" />
                      </Button>
                    </Grid>
                  </>
                )}
              {checkSomeCondition() && dataSource.status != 17 && (
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
                          `/SlumBillingManagementSystem/transactions/issuanceOfNoc/issuanceOfNocDetails`
                        );
                      }
                    }}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </>
      </ThemeProvider>
    </>
  );
};

export default Index;
