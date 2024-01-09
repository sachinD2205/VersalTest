import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import URLS from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import theme from "../../theme";
import DocumentUpload from "./DocumentUpload";
import PersonalDetails from "./PersonalDetails";
import PersonalDetailsDOP from "./PersonalDetailsDOP";
import PersonalDetailsZoneCertificate from "./PersonalDetailsZoneCertificate";
import PersonalDetailssetback from "./PersonalDetailssetback";
import { catchExceptionHandlingMethod } from "../../util/util";

const Index = () => {
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

  const router = useRouter();
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const [document, setDocument] = useState([]);
  const [modalforAprov, setmodalforAprov] = useState(false);
  const [remark, setRemark] = useState(null);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);
  const [ValueServiceNameMr, setValueServiceNameMr] = useState();
  const [ValueServiceName, setValueServiceName] = useState();
  const [ValueApplicantNameMr, setValueApplicantNameMr] = useState();
  const [ValueApplicantName, setValueApplicantName] = useState();
  // const methods = useForm();
  let serviceId = Number(router.query.serviceId);
  console.log("serviceId", serviceId, typeof serviceId);

  // let serviceId = 67
  const [data, setData] = useState();
  const methods = useFormContext();
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    method,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    console.log("router?.query?", router?.query);
    if (router?.query) {
      // reset(router?.query);
      // setData(router?.query);
    }
  }, []);

  // viewForm
  const viewForm = (props) => {
    console.log("hsldjf", props);
    const ID = props;
    // if (serviceId === 17) {
    //   axios
    //     .get(`${urls.TPURL}/partplan/getById/id=${38}`, {
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //       },
    //     })
    //     .then((resp) => {
    //       reset(resp?.data);
    //     });
    // } else if (serviceId === 19) {
    //   const ID = router.query.applicationId;
    //   alert("developmentplan la ala ka bho"),
    //     axios
    //       .get(
    //         `${urls.TPURL}/developmentPlanOpinion/getDevelopmentPlanOpinion/${ID}`,
    //         {
    //           headers: {
    //             Authorization: `Bearer ${user.token}`,
    //           },
    //         },
    //       )
    //       .then((resp) => {
    //         if (resp.status == 200) {
    //           // gg
    //           reset(resp.data);
    //           // let fileee = getValues("files");
    //           // setFinalFiles(fileee.map((ff,i) => { return { ...ff,srNo:i+1 } }));
    //           // setValue("files", fileee);
    //           // console.log("filee", fileee);
    //           console.log("development", JSON.stringify(resp.data));
    //         }
    //       });
    // }
    // else if (serviceId === 15) {
    //   axios
    //     .get(
    //       `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${ID}`,
    //       // localhost:8091/mr/api/transaction/modOfMarBoardCertificate/getModOfMarCertificateById?applicationId=3
    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       }
    //     )
    //     .then((resp) => {
    //       console.log("sdljfslkdfjslkdjflskdjf", resp.data);
    //       reset(resp.data);
    //       setData(resp.data);
    //     });
    // } else if (serviceId === 12) {
    //   axios
    //     .get(
    //       `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${ID}`,

    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       }
    //     )
    //     .then((resp) => {
    //       console.log("MODOFCER", resp.data);
    //       reset(resp.data);
    //       setData(resp.data);
    //     });
    // }

    formPreviewDailogOpen();
  };

  useEffect(() => {
    //DocumentsList
    if (Number(router?.query?.id) != null) {
      // reset(router.query);
      axios
        .get(`${URLS.CFCURL}/master/documentMaster/getAll`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setDocument(
            res.data.documentMaster.map((j, i) => ({
              id: j.id,
              documentNameEn: j.documentChecklistEn,
              documentNameMr: j.documentChecklistMr,
            })),
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, []);

  useEffect(() => {
    console.log("router.sdlfksldkfjlds", ValueServiceName, ValueServiceNameMr);
    // alert('language', ValueServiceName)
    setValue(
      "serviceName",
      language == "en" ? ValueServiceName : ValueServiceNameMr,
    );
    setValue(
      "applicantName",
      language === "en"
        ? router?.query?.applicantName
        : router?.query?.applicantNameMr,
    );
  }, [language]);

  // useEffect(() => {
  //   console.log("router?.query?", router?.query);
  //   if (router?.query) {
  //     setData(router?.query);
  //     reset(router?.query);
  //   }
  // }, []);

  // useEffect(() => {
  //   const ID = router.query.applicationId;

  //   console.log("router?.query?", router?.query);
  //   {
  //     axios
  //       .get(
  //         `${urls.TPURL}/developmentPlanOpinion/getDevelopmentPlanOpinion/${ID}`,

  //         {
  //           headers: {
  //             Authorization: `Bearer ${user.token}`,
  //           },
  //         },
  //       )
  //       .then((resp) => {
  //         console.log("hederData", resp.data);
  //         reset(resp.data);
  //         setData(resp.data);
  //         let fileee = getValues("files");
  //         console.log("ahe ka kahi index", fileee);
  //         // alert('yetay')
  //         // console.log('sdljfslkdfjslkdjflskdjf', resp.data)
  //         setValueServiceName(resp?.data?.serviceName);
  //         setValueServiceNameMr(resp?.data?.serviceNameMr);
  //         setValueApplicantName(resp?.data?.ApplicantName);
  //         setValueApplicantNameMr(resp?.data?.ApplicantNameMr);
  //       });
  //   }
  // }, []);

  // useEffect(() => {}, [ValueServiceName, ValueServiceNameMr]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <form /* onSubmit={handleSubmit(onFinish)} */>
          <div className={styles.small}>
            <div className={styles.detailsApot}>
              <div className={styles.h1TagApot}>
                <h1
                  style={{
                    color: "white",
                    marginTop: "1px",
                  }}
                >
                  {language === "en"
                    ? router?.query?.pageHeader
                    : router?.query?.pageHeaderMr}
                  {/* {
                    language === 'en' ? router?.query?.pageMode : router?.query?.pageModeMr
                  } */}
                  {/* Document Verification */}
                </h1>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.h1Tag}>
                <h3
                  style={{
                    color: "white",
                    marginTop: "6px",
                  }}
                >
                  {language === "en" ? "Applicant details" : "अर्जदार तपशील"}
                </h3>
              </div>
            </div>

            <div className={styles.row2}>
              <div>
                <TextField
                  style={{ width: 280 }}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  // label="Service Name"
                  label={<FormattedLabel id="serviceName" />}
                  variant="standard"
                  {...register("serviceName")}
                  error={!!errors.serviceName}
                  helperText={
                    errors?.serviceName ? errors.serviceName.message : null
                  }
                />
              </div>

              <div>
                <TextField
                  style={{ width: 280 }}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  // label="Applicant Name"
                  label={<FormattedLabel id="ApplicatName" />}
                  variant="standard"
                  {...register("applicantName")}
                  // error={!!errors.firstNameEn}
                  // helperText={
                  //   errors?.firstNameEn ? errors.firstNameEn.message : null
                  // }
                />
              </div>
            </div>

            <div className={styles.row2}>
              <div>
                <TextField
                  style={{ width: 280 }}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  label={<FormattedLabel id="applicationNo" />}
                  variant="standard"
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
                  }
                />
              </div>

              <div>
                <FormControl
                  variant="standard"
                  style={{ marginTop: 10 }}
                  error={!!errors.applicationDate}
                >
                  <Controller
                    control={control}
                    name="applicationDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled
                          variant="standard"
                          inputFormat="DD/MM/yyyy"
                          // label={<FormattedLabel id="newsFromDate" />}
                          label={<FormattedLabel id="applicationDate" />}
                          value={field.value}
                          minDate={new Date()}
                          onChange={(date) =>
                            field.onChange(
                              moment(date).format("YYYY-MM-DDThh:mm:ss"),
                            )
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              variant="standard"
                              sx={{ width: 280 }}
                              error={!!errors.applicationDate}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.applicationDate
                      ? errors.applicationDate.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </div>
            </div>

            <div className={styles.row2}>
              <Button
                variant="contained"
                endIcon={<VisibilityIcon />}
                size="small"
                onClick={() => {
                  const id = router.query.applicationId;
                  console.log("sddlfkjslkfdjsdlkf", router.query.applicationId);
                  viewForm(id);
                }}
              >
                {language === "en" ? "View Form" : "अर्ज पहा"}
              </Button>
            </div>
          </div>
        </form>

        {/** Form Preview Dailog */}

        <Dialog
          fullWidth
          maxWidth={"lg"}
          open={formPreviewDailog}
          onClose={() => formPreviewDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                <FormattedLabel id="preview" />{" "}
              </Grid>
              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  aria-label="delete"
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                    onClick={() => {
                      formPreviewDailogClose();
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            {serviceId === 17 ? (
              <>
                <FormProvider {...methods}>
                  <form>
                    <PersonalDetails />

                    <DocumentUpload />
                  </form>
                </FormProvider>
              </>
            ) : (
              ""
            )}
            {serviceId === 19 ? (
              <>
                <PersonalDetailsDOP />

                {/* <DocumentUpload /> */}
              </>
            ) : (
              ""
            )}
            {serviceId === 18 ? (
              <>
                <PersonalDetailsZoneCertificate />
              </>
            ) : (
              ""
            )}
            {serviceId === 20 ? (
              <>
                <PersonalDetailssetback />
              </>
            ) : (
              ""
            )}

            {/* {serviceId === 12 ? (
              <>
                <ModMarriageCertificate
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                />
              </>
            ) : (
              ""
            )} */}
          </DialogContent>

          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                onClick={() => {
                  const textAlert =
                    language == "en"
                      ? "Are you sure you want to exit this Record ? "
                      : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
                  const title = language == "en" ? "Exit ! " : "बाहेर पडा!";

                  sweetAlert({
                    title: title,
                    text: textAlert,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,

                    // swal({
                    //   title: "Exit?",
                    //   text: "Are you sure you want to exit this Record ? ",
                    //   icon: "warning",
                    //   buttons: true,
                    //   dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      language == "en"
                        ? sweetAlert({
                            title: "Exit!",
                            text: "Record is Successfully Exit!!",
                            icon: "success",
                            button: "Ok",
                          })
                        : sweetAlert({
                            title: "बाहेर पडा!",
                            text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                            icon: "success",
                            button: "ओके",
                          });
                      formPreviewDailogClose();
                    } else {
                      language == "en"
                        ? sweetAlert({
                            title: "Cancel!",
                            text: "Record is Successfully Cancel!!",
                            icon: "success",
                            button: "Ok",
                          })
                        : sweetAlert({
                            title: "रद्द केले!",
                            text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                            icon: "success",
                            button: "ओके",
                          });
                    }
                  });
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default Index;
