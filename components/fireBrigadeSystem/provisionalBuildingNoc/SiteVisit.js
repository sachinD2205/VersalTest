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
  InputLabel,
  Select,
  MenuItem,
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
import { map } from "lodash";

// func
const SiteVisit = (props) => {
  const [applicationId, setApplicationId] = useState();
  const [applicableCharages, setApplicableCharages] = useState([]);
  const [editableNetNocAmount, setEditableNetNocAmount] = useState(0);

  useEffect(() => {
    getNotes();
    getQuestions();
  }, []);

  const [notes, setNotes] = useState([]);
  const [question, setQuestion] = useState([]);
  const [questions, setQuestions] = useState([]);

  const getNotes = () => {
    axios
      .get(`${urls.FbsURL}/master/recommendationNote/getAll`)
      .then((res) => {
        console.log("notes response", res);
        setNotes(res?.data?.recommendationNote);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (value, index) => {
    console.log(value, "::", index);
    let final = applicableCharages?.map((g, i) => {
      return {
        ...g,
        finalNetNocAmount:
          i == index
            ? isNaN(value)
              ? 0
              : parseFloat(value)
            : g?.finalNetNocAmount
            ? g.finalNetNocAmount
            : 0,
      };
    });
    console.log("final", final);
    setApplicableCharages(final);
  };

  const getQuestions = () => {
    axios
      .get(`${urls.FbsURL}/master/buildingFireNocQuestion/getAll`)
      .then((res) => {
        console.log("gfj", res);
        setQuestions(
          res?.data?.buildingFireNocQuestion?.map((j) => {
            const { id, ...restData } = j;
            return restData;
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const getQuestions = () => {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/master/buildingFireNocQuestion/getAll`
  //     )
  //     .then((res) => {
  //       console.log("Questions", res);
  //       setQuestion(res?.data?.buildingFireNocQuestion);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const router = useRouter();
  useEffect(() => {
    setApplicationId(props.appId);
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
      watch("siteVisitRemark")
    );
  }, []);

  console.log("questions?.length", questions?.length);

  const [answers, setAnswers] = useState(Array(questions?.length));
  const [remarks, setRemarks] = useState(Array(questions?.length));

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

  const handleAllChange = (value, index, label) => {
    setQuestions(
      questions.map((t, i) => {
        return {
          ...t,
          answer: i == index && label == "answer" ? value : t.answer,
          remark: i == index && label == "remark" ? value : t.remark,
          isAnswerMatched:
            i == index && label == "isAnswerMatched"
              ? value
              : t.isAnswerMatched,
        };
      })
    );
  };

  const handleAnswerChangeRemark = (remark, id) => {
    setRemarks([
      ...remarks?.filter((a) => a.questionId != id),
      {
        remark: remark,
        questionId: id,
        serviceId: 78,
      },
    ]);
    console.log("answersAfter", answers);
  };

  // useEffect(() => {
  //   console.log("answersanswersanswers", answers);
  // }, [answers]);

  // OnSubmit Form
  const handleNext = (formData) => {
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
      siteVisits: [{}],
      id: applicationId,
      role: "SITE_VISIT",
      buildingFireNocAnswers: questions,
    };

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi
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
            "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
          );
        }
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
              {/* <div
                style={{
                  backgroundColor: "#0084ff",
                  color: "white",
                  fontSize: 19,
                  marginTop: 30,
                  marginBottom: 30,
                  padding: 8,
                  paddingLeft: 30,
                  marginLeft: "40px",
                  marginRight: "40px",
                  borderRadius: 100,
                }}
              >
                <strong>Site Visit</strong>
              </div> */}

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
                  <Typography varaint='subtitle1'>
                    <strong>
                      Site Visit Photo Upload
                    </strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <div className={styles.attachFile}>
                    <UploadButton
                      appName='HMS'
                      serviceName='H-HmsSiteVisit'
                      filePath={setSiteVisitPhoto1}
                      fileName={siteVisitPhoto1}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <UploadButton
                    appName='HMS'
                    serviceName='H-HmsSiteVisit'
                    filePath={setSiteVisitPhoto2}
                    fileName={siteVisitPhoto2}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <UploadButton
                    appName='HMS'
                    serviceName='H-HmsSiteVisit'
                    filePath={setSiteVisitPhoto3}
                    fileName={siteVisitPhoto3}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <UploadButton
                    appName='HMS'
                    serviceName='H-HmsSiteVisit'
                    filePath={setSiteVisitPhoto4}
                    fileName={siteVisitPhoto4}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={2}
                  sx={{ marginTop: 4 }}
                >
                  <UploadButton
                    appName='HMS'
                    serviceName='H-HmsSiteVisit'
                    filePath={setSiteVisitPhoto5}
                    fileName={siteVisitPhoto5}
                  />
                </Grid>
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
                    marginTop: "15px",
                  }}
                >
                  <Typography variant='subtitle1'>
                    <strong>
                      Street Vendor Information
                    </strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Typography variant='subtitle2'>
                    <strong>
                      street Vendor Photo
                    </strong>
                  </Typography>
                  <div className={styles.attachFile}>
                    <UploadButton
                      appName='HMS'
                      serviceName='H-HmsSiteVisit'
                      filePath={setStreetVendorPhoto}
                      fileName={streetVendorPhoto}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Typography variant='subtitle2'>
                    <strong>
                      Street Vendor Thumb
                    </strong>
                  </Typography>
                  <div className={styles.attachFile}>
                    <UploadButton
                      appName='HMS'
                      serviceName='H-HmsSiteVisit'
                      filePath={setStreetVendorThumb1}
                      fileName={streetVendorThumb1}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <Typography variant='subtitle2'>
                    <strong>
                      street Vendor Thumb 2
                    </strong>
                  </Typography>
                  <div className={styles.attachFile}>
                    <UploadButton
                      appName='HMS'
                      serviceName='H-HmsSiteVisit'
                      filePath={setStreetVendorThumb2}
                      fileName={streetVendorThumb2}
                    />
                  </div>
                </Grid>
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
                    marginTop: "15px",
                  }}
                >
                  <Typography variant='subtitle1'>
                    <strong>
                      street Vendor Question
                    </strong>
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sm={12}
                  lg={12}
                  xl={12}
                  sx={{ marginTop: 2 }}
                >
                  <TextField
                    sx={{ width: "300px" }}
                    // label=<FormattedLabel id="roadWithBusinessLocation" />
                    label='road With Business Location'
                    variant='standard'
                    {...register("roadWithBusinessLocation")}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sm={12}
                  lg={12}
                  xl={12}
                  sx={{ marginTop: 2 }}
                >
                  <FormControl flexDirection='row'>
                    <FormLabel id='demo-row-radio-buttons-group-label'>
                      additional Labour
                    </FormLabel>
                    <Controller
                      name='additionalLabour'
                      control={control}
                      defaultValue='false'
                      render={({ field }) => (
                        <RadioGroup
                          sx={{ width: "270px" }}
                          // disabled={inputState}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby='demo-row-radio-buttons-group-label'
                        >
                          <FormControlLabel
                            // disabled={inputState}
                            value='true'
                            control={<Radio size='small' />}
                            // label={<FormattedLabel id="yes" />}
                            label='Yes'
                            error={!!errors.additionalLabour}
                            helperText={
                              errors?.additionalLabour
                                ? errors.additionalLabour.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value='false'
                            control={<Radio size='small' />}
                            // label={<FormattedLabel id="no" />}
                            label='No'
                            error={!!errors.additionalLabour}
                            helperText={
                              errors?.additionalLabour
                                ? errors.additionalLabour.message
                                : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={12}
                  sm={12}
                  lg={12}
                  xl={12}
                  sx={{ marginTop: 2 }}
                >
                  <FormControl flexDirection='row'>
                    <FormLabel id='demo-row-radio-buttons-group-label'>
                      "business Hawking location"
                    </FormLabel>
                    <Controller
                      name='businessHawkinglocation'
                      control={control}
                      defaultValue='false'
                      render={({ field }) => (
                        <RadioGroup
                          sx={{ width: "270px" }}
                          // disabled={inputState}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby='demo-row-radio-buttons-group-label'
                        >
                          <FormControlLabel
                            // disabled={inputState}
                            value='Applicant itSelef'
                            control={<Radio size='small' />}
                            // label={<FormattedLabel id="applicantItsSelf" />}
                            label='applicant ItsSelf'
                            error={!!errors.businessHawkinglocation}
                            helperText={
                              errors?.businessHawkinglocation
                                ? errors.businessHawkinglocation.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value='with Help of Family Members'
                            control={<Radio size='small' />}
                            label='With Help of Family Members' // <FormattedLabel id="withHelpofFamilyMembers" />
                            error={!!errors.businessHawkinglocation}
                            helperText={
                              errors?.businessHawkinglocation
                                ? errors.businessHawkinglocation.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value='by Keeping servant'
                            control={<Radio size='small' />}
                            // label={<FormattedLabel id="byKeepingservant" />}
                            label='by Keeping servant'
                            error={!!errors.businessHawkinglocation}
                            helperText={
                              errors?.businessHawkinglocation
                                ? errors.businessHawkinglocation.message
                                : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={12}
                  sm={12}
                  lg={12}
                  xl={12}
                  sx={{ marginTop: 2 }}
                >
                  <FormControl flexDirection='row'>
                    <FormLabel id='demo-row-radio-buttons-group-label'>
                      inspection Selling Goods
                    </FormLabel>
                    <Controller
                      name='inspectionSellingGoods'
                      control={control}
                      defaultValue='false'
                      render={({ field }) => (
                        <RadioGroup
                          sx={{ width: "270px" }}
                          // disabled={inputState}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby='demo-row-radio-buttons-group-label'
                        >
                          <FormControlLabel
                            // disabled={inputState}
                            value='true'
                            control={<Radio size='small' />}
                            // label={<FormattedLabel id="yes" />}
                            label='yes'
                            error={!!errors.inspectionSellingGoods}
                            helperText={
                              errors?.inspectionSellingGoods
                                ? errors.inspectionSellingGoods.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value='false'
                            control={<Radio size='small' />}
                            label='no'
                            // label={<FormattedLabel id="no" />}
                            error={!!errors.inspectionSellingGoods}
                            helperText={
                              errors?.inspectionSellingGoods
                                ? errors.inspectionSellingGoods.message
                                : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={12}
                  sm={12}
                  lg={12}
                  xl={12}
                  sx={{ marginTop: 2 }}
                >
                  <FormControl flexDirection='row'>
                    <FormLabel id='demo-row-radio-buttons-group-label'>
                      business Traffic Congestion
                    </FormLabel>
                    <Controller
                      name='businessTrafficCongestion'
                      control={control}
                      defaultValue='false'
                      render={({ field }) => (
                        <RadioGroup
                          sx={{ width: "270px" }}
                          // disabled={inputState}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          selected={field.value}
                          row
                          aria-labelledby='demo-row-radio-buttons-group-label'
                        >
                          <FormControlLabel
                            // disabled={inputState}
                            value='true'
                            control={<Radio size='small' />}
                            // label={<FormattedLabel id="yes" />}
                            label='yes'
                            error={!!errors.businessTrafficCongestion}
                            helperText={
                              errors?.businessTrafficCongestion
                                ? errors.businessTrafficCongestion.message
                                : null
                            }
                          />
                          <FormControlLabel
                            // disabled={inputState}
                            value='false'
                            control={<Radio size='small' />}
                            // label={<FormattedLabel id="no" />}
                            label='no'
                            error={!!errors.businessTrafficCongestion}
                            helperText={
                              errors?.businessTrafficCongestion
                                ? errors.businessTrafficCongestion.message
                                : null
                            }
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={1}
                  md={1}
                  sm={1}
                  lg={1}
                  xl={1}
                  sx={{ marginTop: 2 }}
                >
                  <strong>
                    remark
                  </strong>
                </Grid>
                <Grid
                  item
                  xs={6}
                  md={6}
                  sm={6}
                  lg={6}
                  xl={6}
                  sx={{ marginTop: 2 }}
                >
                  <TextareaAutosize
                    {...register("siteVisitRemark")}
                    style={{
                      width: "250px",
                      height: "50px",
                    }}
                  />
                </Grid>
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
                  <Stack spacing={5} direction='row'>
                    <Button type='submit' variant='contained' color='primary'>
                      Save
                    </Button>
                  </Stack>
                </Grid>
              </Grid> */}

              {/* <Paper
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
                            sx={{ width: "100%" }}
                            label={`Answer ${index + 1}`}
                            {...register(`answers${[index]}`)}
                            // {...register(`queId${q.id}`)}
                            value={answers[index]?.answer}
                            onChange={(e) => {
                              console.log(
                                "e.target.value",
                                e.target.value,
                                q.id
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
                  </Stack>
                </Grid>
              </Paper> */}

              <Paper
                sx={{
                  margin: 1,
                  padding: 2,
                  backgroundColor: "#F5F5F5",
                }}
                elevation={5}
              >
                <Grid container>
                  <table className={styles.openingTable}>
                    <tr>
                      <th>Sr no.</th>
                      <th>Structural Requirements</th>
                      <th>Recommendations as per DC/DPCR rules</th>
                      <th>Req.shown in submitted plans</th>
                      <th>Whether fulfills as per rule</th>
                      <th>Remarks</th>
                    </tr>

                    <tbody>
                      {questions?.map((r, index) => (
                        <>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{r.question}</td>
                            <td>{r.expectedAnswer}</td>
                            {/* <td>
                              <input
                                className={styles.editableTextField}
                                //  width="50"
                                type="text"
                                value={r.expectedAnswer}
                                onChange={(event) =>
                                  handleChange(event.target.value, i)
                                }
                              />
                            </td> */}

                            <td>
                              <TextField
                                // label={`Answer ${index + 1}`}
                                // {...register(`answers${[index]}`)}
                                // {...register(`questions${[index].answer}`)}
                                // {...register(`queId${q.id}`)}
                                sx={{ width: "90%" }}
                                value={questions[index]?.answer}
                                onChange={(e) => {
                                  console.log(
                                    "e.target.value",
                                    e.target.value,
                                    r.id
                                  );
                                  // handleAnswerChange(e.target.value, r.id);
                                  handleAllChange(
                                    e.target.value,
                                    index,
                                    "answer"
                                  );
                                }}
                                fullWidth
                                multiline
                                rows={4}
                              />
                            </td>
                            <td>
                              <FormControl sx={{ width: "80%" }}>
                                <InputLabel
                                  variant="standard"
                                  htmlFor="uncontrolled-native"
                                ></InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      // disabled={viewButtonInputState}
                                      // value={field.value}
                                      // value={answers[index]?.isAnswerMatched}
                                      // onChange={(value) => {
                                      //   field.onChange(value);
                                      //   // setNocTypeEditable(value.target.value);
                                      //   // console.log("121", nocTypeEditable);

                                      // }}
                                      value={questions[index]?.isAnswerMatched}
                                      onChange={(e) => {
                                        console.log(
                                          "e.target.value",
                                          e.target.value,
                                          r.id
                                        );
                                        // handleAnswerChange(e.target.value, r.id);
                                        handleAllChange(
                                          e.target.value,
                                          index,
                                          "isAnswerMatched"
                                        );
                                      }}
                                      name="isAnswerMatched"
                                      fullWidth
                                      size="small"
                                      variant="standard"
                                    >
                                      <MenuItem value="yes">Yes</MenuItem>
                                      <MenuItem value="no">No</MenuItem>
                                      <MenuItem value="na">N/A</MenuItem>
                                    </Select>
                                  )}
                                  name="isAnswerMatched"
                                  control={control}
                                  defaultValue=""
                                />
                              </FormControl>
                            </td>
                            <td>
                              {/* <input
                                defaultValue={"ok"}
                                className={styles.editableTextField}
                                //  width="50"
                                {...register(`answers${[index]}`)}
                                type="text"
                                value={answers[index]?.remark} 
                                onChange={(event) =>
                                  handleChange(event.target.value, index)
                                }
                              /> */}
                              <TextField
                                sx={{ width: "90%" }}
                                // label={`Answer ${index + 1}`}
                                // {...register(`remarks${[index]}`)}
                                // {...register(`queId${q.id}`)}
                                // value={remarks[index]?.remark}
                                // onChange={(e) => {
                                //   console.log(
                                //     "e.target.value",
                                //     e.target.value,
                                //     r.id
                                //   );
                                //   handleAnswerChangeRemark(e.target.value, r.id);
                                // }}
                                value={questions[index]?.remark}
                                onChange={(e) => {
                                  console.log(
                                    "e.target.value",
                                    e.target.value,
                                    r.id
                                  );
                                  // handleAnswerChange(e.target.value, r.id);
                                  handleAllChange(
                                    e.target.value,
                                    index,
                                    "remark"
                                  );
                                }}
                                fullWidth
                                multiline
                                rows={4}
                              />
                            </td>
                            {/* <td>{r.grossBuiltUpArea}</td>
                      <td>{r.parishishtha}</td> 
                      <td>{r.buildingHeightFrom}</td>
                      <td>{r.buildingHeightTo}</td>
                      <td>{r.minimumRate}</td>
                      <td>{r.netBuiltUpAreaAmount}</td>
                      <td>{r.grossBuiltUpAreaAmount}</td>
                      <td>{r.minimumNocAmount}</td> */}
                          </tr>
                        </>
                      ))}

                      {/* <tr>
                  <td colSpan={9}><b>Total</b></td>
                  <td>
                    <b>{sum}</b>
                  </td>
                  <td>
                    <b>{gross}</b>
                  </td>
                  <td>
                    <b>{nocAmount}</b>
                  </td>
               

                  {nocTypeEditable === "net" && (

                    <td>
                      <b>{editableNetNocAmount}</b>
                    </td>
                  )}

                  {nocTypeEditable === "gross" && (

                    <td>
                      <b>{grossTotal}</b>
                    </td>
                  )}

                </tr> */}
                    </tbody>
                  </table>
                </Grid>

                <Grid container>
                  <table className={styles.openingTable}>
                    {/* <tr>
                      <th >Sr no.</th>
                    </tr> */}
                    <h4>Note </h4>

                    <tbody>
                      {notes?.map((r, i) => (
                        <>
                          <tr key={i}>
                            {/* <td>{i + 1}</td> */}
                            {/* <td>checkBox</td> */}
                            <td>
                              <input type="checkbox" />
                            </td>
                            <td>{r.descriptionEng}</td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
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
