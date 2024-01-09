import { Box, Grid, Paper, TextField, ThemeProvider } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";
import sweetAlert from "sweetalert";
import urls from "../../URLS/urls";
import theme from "../../theme.js";
// import FileTable from "../../../../components/townPlanning/FileUploadTable/FileTable";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../util/util.js";
// func
const SiteVisit = (props) => {
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
  // let user = useSelector((state) => state.user.user);
  const [applicationId, setApplicationId] = useState();

  useEffect(() => {
    getQuestions();
    console.log(router.query, "props--serviceid");
  }, []);

  useEffect(() => {
    console.log("all values", getValues());
  }, []);

  const [questions, setQuestions] = useState([]);
  const language = useSelector((state) => state?.labels.language);

  const getQuestions = () => {
    if (router?.query?.serviceId) {
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
    }
  };

  const router = useRouter();
  useEffect(() => {
    setApplicationId(props.appID);
    console.log("props.state", props);
  }, [props]);

  // Methods in useForm
  const methods = useFormContext({
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
  let user = useSelector((state) => state.user.user);
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
    console.log("aala ", watch("answers"), answers);
    setValue("tempa", answers);
    console.log("aala mg", watch("tempa"));
  }, [answers]);
  // useEffect(() => {
  //   console.log("answersanswersanswers", answers);
  //   setValue("answers", answers);
  // }, [answers]);

  // OnSubmit Form
  const handleNext = (formData) => {
    console.log(
      "aala re",
      // formData
      answers,
    );
    let finalBodyForApi = {
      id: Number(router.query.applicationId),

      role: "DEPUTY_ENGINEER",
      questionAnswers: answers,
      serviceId: 19,
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
            swal("Slots!", "slot added successfully !", "success");
            formData.id
              ? sweetAlert("Updated!", "site visit !", "success")
              : //  sweetAlert("Saved!", "site visit !", "success");
                swal("Complete!", "Site Visit Complete!", "success");
            router.push(
              "/townPlanning/transactions/developmentPlanOpinion/scrutiny",
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

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
                  <h2> {language === "en" ? "VERIFICATION" : "पडताळणी"}</h2>
                </Box>
                <Grid container>
                  {questions?.map((q, index) => {
                    return (
                      <Grid container key={index}>
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
                    );
                  })}
                </Grid>

                <br />

                {/* <Grid
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
                </Grid> */}
              </Paper>
            </ThemeProvider>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default SiteVisit;
