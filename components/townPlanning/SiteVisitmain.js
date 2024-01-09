import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../../../../URLS/urls";
import theme from "../../../../../theme.js";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util.js";

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
  const language = useSelector((state) => state?.labels?.language);

  const [applicationId, setApplicationId] = useState();

  useEffect(() => {
    getQuestions();
  }, []);

  const [questions, setQuestions] = useState([]);

  const getQuestions = () => {
    axios
      .get(
        `${urls.FbsURL}/master/siteVisitQuestions/getAllByServiceId?serviceId=78`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
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
        serviceId: 78,
      },
    ]);
    console.log("answersAfter", answers);
  };

  useEffect(() => {
    console.log("answersanswersanswers", answers);
  }, [answers]);

  // OnSubmit Form
  const handleNext = (formData) => {
    let finalBodyForApi = {
      siteVisits: [{}],
      id: applicationId,
      role: "SITE_VISIT",
      questionAnswers: [...answers],
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        console.log("response11", res);
        props.siteVisitDailogP(false);
        if (res.status == 200 || res.status == 201) {
          swal("Slots!", "slot added successfully !", "success");
          formData.id
            ? sweetAlert("Updated!", "site visit !", "success")
            : //  sweetAlert("Saved!", "site visit !", "success");
              swal("Complete!", "Site Visit Complete!", "success");
          router.push(
            "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny",
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const handleExit = () => {
    swal("Exit!", "Successfully Exitted  Payment!", "success");
    router.push("/townPlanning/transactions/developmentPlanOpinion/scrutiny/");
  };
  // File Upload
  const [siteVisitPhoto1, setSiteVisitPhoto1] = useState(null);
  const [siteVisitPhoto2, setSiteVisitPhoto2] = useState(null);
  const [siteVisitPhoto3, setSiteVisitPhoto3] = useState(null);
  const [siteVisitPhoto4, setSiteVisitPhoto4] = useState(null);
  const [siteVisitPhoto5, setSiteVisitPhoto5] = useState(null);
  const [streetVendorPhoto, setStreetVendorPhoto] = useState(null);
  const [streetVendorThumb1, setStreetVendorThumb1] = useState(null);
  const [streetVendorThumb2, setStreetVendorThumb2] = useState(null);

  useEffect(() => {
    setValue("siteVisitPhoto1", siteVisitPhoto1);
    setValue("siteVisitPhoto2", siteVisitPhoto2);
    setValue("siteVisitPhoto3", siteVisitPhoto3);
    setValue("siteVisitPhoto4", siteVisitPhoto4);
    setValue("siteVisitPhoto5", siteVisitPhoto5);
    setValue("streetVendorPhoto", streetVendorPhoto);
    setValue("streetVendorThumb1", streetVendorThumb1);
    setValue("streetVendorThumb2", streetVendorThumb2);
  }, [
    siteVisitPhoto1,
    siteVisitPhoto2,
    siteVisitPhoto3,
    siteVisitPhoto4,
    siteVisitPhoto5,
    streetVendorPhoto,
    streetVendorThumb1,
    streetVendorThumb2,
  ]);

  useEffect(() => {
    setValue("siteVisitPhoto1", getValues("siteVisitPhoto1"));
    setValue("siteVisitPhoto2", getValues("siteVisitPhoto2"));
    setValue("siteVisitPhoto3", getValues("siteVisitPhoto3"));
    setValue("siteVisitPhoto4", getValues("siteVisitPhoto4"));
    setValue("siteVisitPhoto5", getValues("siteVisitPhoto5"));
    setValue("streetVendorPhoto", getValues("streetVendorPhoto"));
    setValue("streetVendorThumb1", getValues("streetVendorThumb1"));
    setValue("streetVendorThumb2", getValues("streetVendorThumb2"));
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
                  <h2>Site Visit</h2>
                </Box>
                <Grid container>
                  {questions?.map((q, index) => {
                    return (
                      <Grid container key={q.id}>
                        {console.log("esrdfsdf", q)}
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
                            rows={4}
                          />
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>

                <br />
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
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      // disabled={validateSearch()}
                      onClick={() => {
                        swal({
                          title: "Exit?",
                          text: "Are you sure you want to exit this Record ? ",
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          if (willDelete) {
                            swal("Record is Successfully Exit!", {
                              icon: "success",
                            });
                            handleExit();
                          } else {
                            swal("Record is Safe");
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
