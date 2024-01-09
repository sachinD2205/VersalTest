import {
  Accordion,
  AccordionSummary,
  Button,
  FormControl,
  AccordionDetails,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import styles from "../../../styles/fireBrigadeSystem/styles/view.module.css";
import theme from "../../../theme.js";
import urls from "../../../URLS/urls";
import UploadButton from "../../fileUpload/UploadButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

// func
const SiteVisit = (props) => {
  const daoNameLocal = localStorage.getItem("key");
  const userToken = useGetToken();

  const [applicationId, setApplicationId] = useState();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);

  const [isDisabled, setIsDisabled] = useState(false);

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
    console.log("props", props?.props?.typeOfBusiness);
  }, []);

  const [daoNameState, setDaoNameState] = useState();

  const getDaoName = () => {
    axios
      .get(
        `${urls.FbsURL}/typeOfBusinessMaster/getTypeOfBusinessMasterDataById?id=${props?.props?.typeOfBusiness}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        // let daoName = r?.data?.remark;
        console.log("123", r?.data?.remark);
        setValue("daoName", r?.data?.remark);
        setDaoNameState(r?.data?.remark);
        console.log("daoName123", watch("daoName"));
      });

    console.log("Allprops", props?.props);
    console.log("props", props?.props?.firmName);
    // setValue(
    //   "answers0",
    //   props?.props?.firmName + ", " + props?.props?.businessAddress
    // );

    // setValue("answers5", props?.props?.area);

    // console.log("9090area", props?.props?.area);
    // // setValue("answers5", props?.props?.area);
    // setValue("answers20", props?.props?.numberOfEmployee);
    // console.log("daoNam2", getValues("daoName"));
    // console.log("daoNameLocal", daoNameState);
    // setValue("allData", props?.props);
    // console.log("allData", props?.props);

    // let dataToMap = watch(`allData.${getValues("daoName")}`);

    // // let dataToMap = props?.props?.daoName;

    // console.log("detokabhava", dataToMap?.widthOfApproachRoad);

    // // setValue("answers6", dataToMap?.widthOfApproachRoad);
    // setValue("answers6", 89797);
    // setValue("answers7", dataToMap?.businessDetails);
    // setValue("answers9", dataToMap?.noOfEmployees);
    // setValue("answers10", dataToMap?.detailsOfFireFightingEquipments);
    // setValue("answers17", dataToMap?.fireFightingWaterTankCapacity);
  };

  console.log("watchhhwaladaoName", daoNameState);
  const getQuestions = () => {
    axios
      .get(
        `${urls.FbsURL}/master/siteVisitQuestions/getAllByServiceId?serviceId=78`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setQuestions(res?.data?.mstSiteVisitQuestionsDaoList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getDaoName();
    getQuestions();
  }, []);

  useEffect(() => {
    setApplicationId(props.appID);
    console.log("props.state", props);
  }, [props]);

  useEffect(() => {
    watch("siteVisitRemark");
    console.log(
      "siteVisitPhoto3",
      watch("siteVisitPhoto3"),
      watch("siteVisitRemark")
    );
  }, []);

  // useEffect(() => {
  // if (props?.props?.id) {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/transaction/trnBussinessNOC/getById?id=${props?.props?.id}`
  //     )
  //     .then((res) => {
  //       reset(res.data);
  //       // setValue("typeOfBusiness",typeOfBusiness);

  //       // setValue("typeOfVardiId", res?.data?.typeOfVardiId);
  //       // reset(res.data.vardiSlip);
  //       // setValue("id", res.data.id);
  //       console.log("res?.data", res?.data);
  //       // reset(res?.data);
  //     });
  // }
  //
  // }, []);

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

    // answers.map((a, indexx) => {
    //   return {
    //     ...a,
    //     answer: indexx == index ? answer : null,
    //     questionId: indexx == index ? id : null,
    //     serviceId: 78,
    //   };
    // })
    // setAnswers([...(answers && answers), { key: id, value: answer }]);
    // const newAnswers = [...answers];
    // newAnswers[index].value = answer;
    // setAnswers({key:id,value:newAnswers});
  };

  useEffect(() => {
    console.log("answersanswersanswers", answers);
  }, [answers]);

  // OnSubmit Form
  const handleNext = (formData) => {
    setIsDisabled(true);
    // let ans = questions.map((a) => {
    //   return a.id;
    // });

    // let iddd = getValues("queId");
    // console.log("queId", iddd);

    // const transformedArray = answers.map((answer, index) => ({
    //   questionId: answer.key,
    //   answer: answer.value,
    //   applicationId: 8,
    //   serviceId: 78,
    // }));

    let finalBodyForApi = {
      siteVisit: {},
      id: applicationId,
      role: "SITE_VISIT",
      questionAnswers: [...answers],
      // userToken,
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/trnBussinessNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            // serviceId: selectedMenuFromDrawer,
          },
        }
      )
      .then((res) => {
        props.siteVisitDailogP(false);
        if (res.status == 200 || res.status == 201) {
          swal("Complete!", "Site Visit Complete!", "success");
          formData.id
            ? sweetAlert("Updated!", "Site visit !", "success")
            : //  sweetAlert("Saved!", "site visit !", "success");
              swal("Complete!", "Site Visit Complete!", "success");
          router.push("/FireBrigadeSystem/transactions/businessNoc/scrutiny");
        }
        setIsDisabled(false);
      });
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
                }}
                elevation={5}
              >
                <Grid container>
                  {questions?.map((q, index) => {
                    return (
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
                            InputLabelProps={{
                              shrink: true,
                            }}
                            sx={{ width: "100%" }}
                            label={`Answer ${index + 1}`}
                            {...register(`answers${[index]}`)}
                            // {...register(`queId${q.id}`)}
                            value={answers[index]?.answer}
                            onChange={(e) => {
                              console.log("indexOfFirstTextFeild", index);
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

                <Box sx={{ display: "flex" }}></Box>

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
                      disabled={isDisabled}
                      size="small"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Save
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
