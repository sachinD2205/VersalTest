import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/streetVendorManagementSystem/styles/view.module.css";
import UploadButton from "../../../../components/townPlanning/DocumentsUploadDurgeOP";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";

import { useSelector } from "react-redux";
import UploadButtonThumbOP from "../../../../components/townPlanning/CameraDocuments";
import SiteVisitQuestionNew from "../../../../components/townPlanning/SiteVisitQuestionNew";
import { catchExceptionHandlingMethod } from "../../../../util/util.js";
// func
const SiteVisit = (props) => {
  //catch
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
  let user = useSelector((state) => state.user.user);
  const [applicationId, setApplicationId] = useState();
  const language = useSelector((state) => state?.labels.language);
  const [answerPayload, setAnswerPayload] = useState([]);
  // useEffect(() => {
  //   if(router?.query?.serviceId){
  //   getQuestions();
  //   console.log(router.query, "props--serviceid")}
  // }, [router?.query]);

  useEffect(() => {
    console.log("all values", getValues());
  }, []);

  const [questions, setQuestions] = useState([]);

  const getQuestions = () => {
    axios
      .get(
        `${urls.TPURL}/master/siteVisitQuestions/getAllByServiceIdOrderByQuestionNo?serviceId=${router?.query?.serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        console.log(
          "res?.data?.mstSiteVisitQuestionsDaoList",
          res?.data?.mstSiteVisitQuestionsDaoList,
        );
        setQuestions(res?.data?.mstSiteVisitQuestionsDaoList);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const router = useRouter();
  useEffect(() => {
    setApplicationId(props.appID);
    console.log("props.state", props);
  }, [props]);

  // Methods in useForm
  const methods = useForm({
    defaultValues: {},
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    watch,
    setValue,
    getValues,
    register,
    handleSubmit,
    control,
    unregister,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    watch("siteVisitRemark");
    console.log(
      "siteVisitPhoto3",
      watch("siteVisitPhoto3"),
      watch("siteVisitRemark"),
    );
  }, []);

  console.log("questions?.length", questions?.length);

  const [answers, setAnswers] = useState(Array(questions?.length));

  const handleAnswerChange = (answer, id) => {
    setAnswers([
      ...answers?.filter((a) => a.questionId != id),
      {
        answer: answer,
        questionId: id,
        serviceId: router.query.serviceId,
      },
    ]);
    console.log("answersAfter", answers);
  };

  useEffect(() => {
    console.log("answersanswersanswers", answers);
  }, [answers]);

  useEffect(() => {
    if (
      watch("siteVisitPhoto1") ||
      watch("siteVisitPhoto2") ||
      watch("siteVisitPhoto3") ||
      watch("siteVisitPhoto4")
    ) {
      console.log("66666666666", watch("siteVisitPhoto1"));
    }
  }, [
    watch("siteVisitPhoto1"),
    watch("siteVisitPhoto2"),
    watch("siteVisitPhoto3"),
    watch("siteVisitPhoto4"),
  ]);
  // OnSubmit Form
  const handleNext = (formData) => {
    console.log(
      "aala re",
      // formData
      // answers,
      router.query.applicationId,
    );
    let finalBodyForApi = {
      id: Number(router.query.applicationId),

      siteVisitAttachment: {
        siteVisitPhoto1: watch("siteVisitPhoto1"),
        siteVisitPhoto2: watch("siteVisitPhoto2"),
        siteVisitPhoto3: watch("siteVisitPhoto3"),
        siteVisitPhoto4: watch("siteVisitPhoto4"),
      },
      // id: applicationId,
      role: "SITE_VISIT",
      // questionAnswers: answers,
      questionAnswers: answerPayload,
      serviceId: 19,
    };

    let finalBody = {
      id: Number(router.query.applicationId),

      siteVisitAttachment: {
        siteVisitPhoto1: watch("siteVisitPhoto1"),
        siteVisitPhoto2: watch("siteVisitPhoto2"),
        siteVisitPhoto3: watch("siteVisitPhoto3"),
        siteVisitPhoto4: watch("siteVisitPhoto4"),
      },
      // id: applicationId,
      role: "SITE_VISIT",
      questionAnswers: answerPayload,
      serviceId: 17,
    };
    if (router.query.serviceId == 19) {
      axios
        .post(
          `${urls.TPURL}/developmentPlanOpinion/saveApplication`,
          finalBodyForApi,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              serviceId: 19,
            },
          },
        )
        .then((res) => {
          console.log("response11", res);
          // props.siteVisitDailogP(false);
          if (res.status == 200 || res.status == 201) {
            swal(
              language == "en" ? "Slots!" : "स्लॉट!",
              language == "en"
                ? "slot added successfully !"
                : "स्लॉट यशस्वीरित्या जोडला!",
              "success",
            );
            formData.id
              ? sweetAlert(
                  language == "en" ? "Updated!" : "अपडेट केले",
                  language == "en"
                    ? "Site Visit Updated!"
                    : "साईट भेट यशस्वीरित्या अपडेट केले",
                  "success",
                )
              : language == "en"
              ? sweetAlert({
                  title: "Complete!",
                  text: "Site Visit Complete!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "पूर्ण!",
                  text: "यशस्वीरित्यासाइट भेट पूर्ण केले!",
                  icon: "success",
                  button: "ओके",
                });
            router.push(
              "/townPlanning/transactions/developmentPlanOpinion/scrutiny",
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router.query.serviceId == 17) {
      console.log("ssssssss17", router.query.serviceId == 17);
      axios
        .post(`${urls.TPURL}/partplan/savepartplan`, finalBody, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            serviceId: 17,
          },
        })
        .then((res) => {
          console.log("response11", res);

          if (res.status == 200 || res.status == 201) {
            // swal("Slots!", "slot added successfully !", "success");

            swal(
              language == "en" ? "Slots!" : "स्लॉट!",
              language == "en"
                ? "slot added successfully !"
                : "स्लॉट यशस्वीरित्या जोडला!",
              "success",
            );
            formData.id
              ? // ? sweetAlert("Updated!", "site visit !", "success")
                // : swal("Complete!", "Site Visit Complete!", "success");

                sweetAlert(
                  language == "en" ? "Updated!" : "अपडेट केले",
                  language == "en"
                    ? "Site Visit Updated!"
                    : "साईट भेट यशस्वीरित्या अपडेट केले",
                  "success",
                )
              : language == "en"
              ? sweetAlert({
                  title: "Complete!",
                  text: "Site Visit Complete!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "पूर्ण!",
                  text: "यशस्वीरित्यासाइट भेट पूर्ण केले!",
                  icon: "success",
                  button: "ओके",
                });
            router.push("/townPlanning/transactions/partPlan/scrutiny");
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router.query.serviceId == 18) {
      let finalBodyForZoneCerti = {
        id: Number(router.query.applicationId),

        siteVisitAttachment: {
          siteVisitPhoto1: watch("siteVisitPhoto1"),
          siteVisitPhoto2: watch("siteVisitPhoto2"),
          siteVisitPhoto3: watch("siteVisitPhoto3"),
          siteVisitPhoto4: watch("siteVisitPhoto4"),
        },
        // id: applicationId,
        role: "SITE_VISIT",
        questionAnswers: answerPayload,
        serviceId: 18,
      };

      axios
        .post(
          `${urls.TPURL}/transaction/zoneCertificate/savezonecertificate`,
          finalBodyForZoneCerti,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              serviceId: 18,
            },
          },
        )
        .then((res) => {
          console.log("response11", res);
          // props.siteVisitDailogP(false);
          if (res.status == 200 || res.status == 201) {
            swal("Slots!", "slot added successfully !", "success");
            formData.id
              ? sweetAlert("Updated!", "site visit !", "success")
              : //  sweetAlert("Saved!", "site visit !", "success");
                swal("Complete!", "Site Visit Complete!", "success");
            router.push("/townPlanning/transactions/zoneCertificate/scrutiny");
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (router.query.serviceId == 20) {
      let finalBodyForSetBackCerti = {
        id: Number(router.query.applicationId),

        siteVisitAttachment: {
          siteVisitPhoto1: watch("siteVisitPhoto1"),
          siteVisitPhoto2: watch("siteVisitPhoto2"),
          siteVisitPhoto3: watch("siteVisitPhoto3"),
          siteVisitPhoto4: watch("siteVisitPhoto4"),
        },
        // id: applicationId,
        role: "SITE_VISIT",
        questionAnswers: answerPayload,
        serviceId: 20,
      };

      axios
        .post(
          `${urls.TPURL}/setBackCertificate/saveApplication`,
          finalBodyForSetBackCerti,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              serviceId: 20,
            },
          },
        )
        .then((res) => {
          console.log("response11", res);
          // props.siteVisitDailogP(false);
          if (res.status == 200 || res.status == 201) {
            swal("Slots!", "slot added successfully !", "success");
            formData.id
              ? sweetAlert("Updated!", "site visit !", "success")
              : //  sweetAlert("Saved!", "site visit !", "success");
                swal("Complete!", "Site Visit Complete!", "success");
            router.push(
              "/townPlanning/transactions/setBackCertificate/scrutiny",
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  const handleExit = () => {
    // swal("", "Successfully Exitted !", "success");

    swal(
      language == "en" ? "Exit!" : "बाहेर पडा!",
      language == "en" ? "Successfully Exitted !" : "यशस्वीरित्या बाहेर पडले!",
      "success",
    );
    router.push("/townPlanning/transactions");
  };
  // File Upload
  const [siteVisitPhoto1, setSiteVisitPhoto1] = useState(null);
  const [siteVisitPhoto2, setSiteVisitPhoto2] = useState(null);
  const [siteVisitPhoto3, setSiteVisitPhoto3] = useState(null);
  const [siteVisitPhoto4, setSiteVisitPhoto4] = useState(null);

  useEffect(() => {
    setValue("siteVisitPhoto1", siteVisitPhoto1);
    setValue("siteVisitPhoto2", siteVisitPhoto2);
    setValue("siteVisitPhoto3", siteVisitPhoto3);
    setValue("siteVisitPhoto4", siteVisitPhoto4);
  }, [siteVisitPhoto1, siteVisitPhoto2, siteVisitPhoto3, siteVisitPhoto4]);

  useEffect(() => {
    setValue("siteVisitPhoto1", getValues("siteVisitPhoto1"));
    setValue("siteVisitPhoto2", getValues("siteVisitPhoto2"));
    setValue("siteVisitPhoto3", getValues("siteVisitPhoto3"));
    setValue("siteVisitPhoto4", getValues("siteVisitPhoto4"));
  }, []);

  return (
    <>
      <div>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleNext)}>
            <ThemeProvider theme={theme}>
              <Paper
                sx={{
                  margin: 1,
                  padding: 2,
                  backgroundColor: "#F5F5F5",
                  borderBlockColor: "red",
                }}
                style={{
                  margin: "0px 0px 15px 0px",
                  border: "1px solid #9a8f8f",
                }}
                elevation={5}
              >
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "10px",
                    background:
                      "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
                  }}
                >
                  <h2>
                    {" "}
                    {language == "en"
                      ? "Schedule Meeting"
                      : "बैठकीचे वेळापत्रक"}
                  </h2>
                </Box>
                <Grid container style={{marginLeft:"10vw"}}>
                  <SiteVisitQuestionNew setAnswerPayload={setAnswerPayload} />

                  {questions?.map((q, index) => {
                    return (
                      <>
                        <Grid container>
                          <Grid
                            item
                            xs={4}
                            sx={{
                              paddingLeft: 2,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <h4 style={{}}>
                              <b>{q.questionNo}.</b> &nbsp;
                              {q.questionMr}
                            </h4>
                          </Grid>
                          <Grid
                            item
                            xs={8}
                            sx={{
                              display: "flex",
                              // alignItems: "center",
                            }}
                          >
                            <TextField
                              sx={{ width: "100%" }}
                              label={`Answer ${index + 1}`}
                              {...register(`answers${[index]}`)}
                              // {...register(`queId${q.id}`)}
                              value={answers[index]?.answer}
                              onChange={(e) => {
                                console.log(
                                  "e.target.value",
                                  e.target.value,
                                  q.id,
                                );
                                handleAnswerChange(e.target.value, q.id);
                              }}
                              fullWidth
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      </>
                    );
                  })}
                </Grid>

                <br />
                {/* <Grid
                  container
                  sx={{
                    marginTop: 5,
                    marginBottom: 5,
                    paddingLeft: "50px",
                    align: "center",
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "15px",
                    }}
                  >
                    <Typography varaint="subtitle1">
                      <strong>
                        {<FormattedLabel id="siteVisitPhotoUpload" />}
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    sm={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignContent: "space-around",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto1" />}</strong>
                    </Typography>
                    <div className={styles.attachFile}>
                      <UploadButton
                        // appName="TP"
                        // serviceName="TP-developmentPlan"
                        // filePath={setSiteVisitPhoto1}
                        // fileName={siteVisitPhoto1}
                        // // fileKey={"siteVisitPhoto1"}
                        appName="TP"
                        serviceName="TP-developmentPlan"
                        fileName={"siteVisitPhoto1.png"}
                        fileDtl={watch("siteVisitPhoto1")}
                        fileKey={"siteVisitPhoto1"}
                        showDel={router?.query?.role == "SITE_VISIT"}
                      />
                      OR
                    </div>
                    <div className={styles.attachFile}>
                      <UploadButtonThumbOP
                        appName="TP"
                        serviceName="TP-developmentPlan"
                        fileName={"siteVisitPhoto1.png"}
                        fileDtl={watch("siteVisitPhoto1")}
                        fileKey={"siteVisitPhoto1"}
                        showDel={router?.query?.role == "SITE_VISIT"}

                        // showDel={
                        //   pageMode != "APPLICATION VERIFICATION" ? false : true
                        // }
                        // appName="TP"
                        // serviceName="TP-developmentPlan"
                        // filePath={setSiteVisitPhoto1}
                        // fileName={siteVisitPhoto1}
                        // fileKey={"siteVisitPhoto1"}
                      />
                    </div>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                    sm={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignContent: "space-around",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto2" />}</strong>
                    </Typography>
                    <UploadButton
                      appName="TP"
                      serviceName="TP-developmentPlan"
                      fileName={"siteVisitPhoto2.png"}
                      fileDtl={watch("siteVisitPhoto2")}
                      fileKey={"siteVisitPhoto2"}
                      showDel={router?.query?.role == "SITE_VISIT"}
                    />
                    OR
                    <UploadButtonThumbOP
                      appName="TP"
                      serviceName="TP-developmentPlan"
                      fileName={"siteVisitPhoto2.png"}
                      fileDtl={watch("siteVisitPhoto2")}
                      fileKey={"siteVisitPhoto2"}
                      showDel={router?.query?.role == "SITE_VISIT"}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    sm={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignContent: "space-around",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto3" />}</strong>
                    </Typography>
                    <UploadButton
                      appName="TP"
                      serviceName="TP-developmentPlan"
                      fileName={"siteVisitPhoto3.png"}
                      fileDtl={watch("siteVisitPhoto3")}
                      fileKey={"siteVisitPhoto3"}
                      showDel={router?.query?.role == "SITE_VISIT"}
                    />
                    OR
                    <UploadButtonThumbOP
                      appName="TP"
                      serviceName="TP-developmentPlan"
                      fileName={"siteVisitPhoto3.png"}
                      fileDtl={watch("siteVisitPhoto3")}
                      fileKey={"siteVisitPhoto3"}
                      showDel={router?.query?.role == "SITE_VISIT"}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    sm={6}
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      alignContent: "space-around",
                      flexDirection: "column",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography variant="subtitle2">
                      <strong>{<FormattedLabel id="siteVisitPhoto4" />}</strong>
                    </Typography>
                    <UploadButton
                      appName="TP"
                      serviceName="TP-developmentPlan"
                      fileName={"siteVisitPhoto4.png"}
                      fileDtl={watch("siteVisitPhoto4")}
                      fileKey={"siteVisitPhoto4"}
                      showDel={router?.query?.role == "SITE_VISIT"}
                    />
                    OR
                    <UploadButtonThumbOP
                      appName="TP"
                      serviceName="TP-developmentPlan"
                      fileName={"siteVisitPhoto4.png"}
                      fileDtl={watch("siteVisitPhoto4")}
                      fileKey={"siteVisitPhoto4"}
                      showDel={router?.query?.role == "SITE_VISIT"}
                    />
                  </Grid>
                </Grid> */}

                <table
                  style={{
                    border: "1px solid black",
                    height: "300px",
                    width: "850px",
                    marginLeft: "150px",
                  }}
                >
                  {" "}
                  <Grid
                    container
                    sx={{
                      marginTop: 5,
                      marginBottom: 5,
                      // paddingLeft: "50px",
                      align: "center",
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      md={12}
                      sm={12}
                      lg={12}
                      xl={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "15px",
                      }}
                    >
                      <Typography varaint="subtitle1">
                        <strong>
                          {<FormattedLabel id="siteVisitPhotoUpload" />}
                        </strong>
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignContent: "space-around",
                        flexDirection: "column",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="subtitle2">
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto1" />}
                        </strong>
                      </Typography>
                      <div className={styles.attachFile}>
                        <UploadButton
                          // appName="TP"
                          // serviceName="TP-developmentPlan"
                          // filePath={setSiteVisitPhoto1}
                          // fileName={siteVisitPhoto1}
                          // // fileKey={"siteVisitPhoto1"}
                          appName="TP"
                          serviceName="TP-developmentPlan"
                          fileName={"siteVisitPhoto1.png"}
                          fileDtl={watch("siteVisitPhoto1")}
                          fileKey={"siteVisitPhoto1"}
                          showDel={router?.query?.role == "SITE_VISIT"}
                        />
                        <FormattedLabel id="oR" />
                      </div>
                      <div className={styles.attachFile}>
                        <UploadButtonThumbOP
                          appName="TP"
                          serviceName="TP-developmentPlan"
                          fileName={"siteVisitPhoto1.png"}
                          fileDtl={watch("siteVisitPhoto1")}
                          fileKey={"siteVisitPhoto1"}
                          showDel={router?.query?.role == "SITE_VISIT"}

                          // showDel={
                          //   pageMode != "APPLICATION VERIFICATION" ? false : true
                          // }
                          // appName="TP"
                          // serviceName="TP-developmentPlan"
                          // filePath={setSiteVisitPhoto1}
                          // fileName={siteVisitPhoto1}
                          // fileKey={"siteVisitPhoto1"}
                        />
                      </div>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignContent: "space-around",
                        flexDirection: "column",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="subtitle2">
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto2" />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="TP"
                        serviceName="TP-developmentPlan"
                        fileName={"siteVisitPhoto2.png"}
                        fileDtl={watch("siteVisitPhoto2")}
                        fileKey={"siteVisitPhoto2"}
                        showDel={router?.query?.role == "SITE_VISIT"}
                      />
                      <FormattedLabel id="oR" />
                      <UploadButtonThumbOP
                        appName="TP"
                        serviceName="TP-developmentPlan"
                        fileName={"siteVisitPhoto2.png"}
                        fileDtl={watch("siteVisitPhoto2")}
                        fileKey={"siteVisitPhoto2"}
                        showDel={router?.query?.role == "SITE_VISIT"}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignContent: "space-around",
                        flexDirection: "column",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="subtitle2">
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto3" />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="TP"
                        serviceName="TP-developmentPlan"
                        fileName={"siteVisitPhoto3.png"}
                        fileDtl={watch("siteVisitPhoto3")}
                        fileKey={"siteVisitPhoto3"}
                        showDel={router?.query?.role == "SITE_VISIT"}
                      />
                      <FormattedLabel id="oR" />
                      <UploadButtonThumbOP
                        appName="TP"
                        serviceName="TP-developmentPlan"
                        fileName={"siteVisitPhoto3.png"}
                        fileDtl={watch("siteVisitPhoto3")}
                        fileKey={"siteVisitPhoto3"}
                        showDel={router?.query?.role == "SITE_VISIT"}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      sm={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignContent: "space-around",
                        flexDirection: "column",
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="subtitle2">
                        <strong>
                          {<FormattedLabel id="siteVisitPhoto4" />}
                        </strong>
                      </Typography>
                      <UploadButton
                        appName="TP"
                        serviceName="TP-developmentPlan"
                        fileName={"siteVisitPhoto4.png"}
                        fileDtl={watch("siteVisitPhoto4")}
                        fileKey={"siteVisitPhoto4"}
                        showDel={router?.query?.role == "SITE_VISIT"}
                      />
                      <FormattedLabel id="oR" />
                      <UploadButtonThumbOP
                        appName="TP"
                        serviceName="TP-developmentPlan"
                        fileName={"siteVisitPhoto4.png"}
                        fileDtl={watch("siteVisitPhoto4")}
                        fileKey={"siteVisitPhoto4"}
                        showDel={router?.query?.role == "SITE_VISIT"}
                      />
                    </Grid>
                  </Grid>
                </table>

                {/* <FileTable serviceId={19} /> */}
                <br />

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <Stack spacing={5} direction="row">
                    <Button
                      size="small"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      <FormattedLabel id="save" />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      // disabled={validateSearch()}
                      onClick={() => {
                        const titleT =
                          language == "en" ? "Exit?" : "बाहेर पडायचे?";
                        const titleText =
                          language == "en"
                            ? "Are you sure you want to exit this Record ? "
                            : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                        swal({
                          title: titleT,
                          text: titleText,
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            {
                              language == "en"
                                ? swal("Record is Successfully Exit!", {
                                    icon: "success",
                                  })
                                : swal("रेकॉर्ड यशस्वीरित्या बाहेर पडा!", {
                                    icon: "success",
                                  });
                            }
                            handleExit();
                          } else {
                            {
                              language == "en"
                                ? swal("Record is Safe")
                                : swal("रेकॉर्ड सुरक्षित आहे");
                            }
                          }
                        });
                      }}
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </Stack>
                </Grid>
              </Paper>
            </ThemeProvider>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default SiteVisit;
