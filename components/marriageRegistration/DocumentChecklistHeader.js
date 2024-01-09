//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/DocumentChecklistTab
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
import { default as URLS, default as urls } from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import ReissuanceofMCertificate from "../../pages/marriageRegistration/transactions/ReissuanceofMarriageCertificate";
import BoardRegistration from "../../pages/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration";
import ModBoardRegistration from "../../pages/marriageRegistration/transactions/modificationInMarriageBoardRegisteration/citizen/ModBoardRegistration";
import ModMarriageCertificate from "../../pages/marriageRegistration/transactions/modificationInMarriageCertificate/citizen/modMarriageCertificate";
import styles from "../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import theme from "../../theme";
import ApplicantDetails from "./ApplicantDetails";
import BrideDetails from "./BrideDetails";
import GroomDetails from "./GroomDetails";
import PriestDetails from "./PriestDetails";
import WitnessDetails from "./WitnessDetails";
import { catchExceptionHandlingMethod } from "../../util/util";

const Index = () => {
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
  const [accessValue, setAccessValue] = useState(true);
  // const methods = useForm();
  let serviceId = Number(router.query.serviceId);
  console.log("serviceId", serviceId, typeof serviceId);

  const [data, setData] = useState();
  const methods = useFormContext();
  const {
    control,
    register,
    reset,
    getValues,
    setValue,
    method,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    console.log("router?.query?", router?.query);
    if (router?.query) {
      reset(router?.query);
      setData(router?.query);
    }
  }, []);

  // viewForm
  const viewForm = (props) => {
    console.log("hsldjf", props);
    // alert("value sagar",accessValue)
    const ID = props;
    // if (serviceId === 10) {
    //   axios

    //     .get(
    //       `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${ID}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       }
    //     )
    //     .then((resp) => {
    //       reset(resp?.data);
    //       console.log("data---", resp?.data);
    //     });
    // } else if (serviceId === 67) {
    //   axios
    //     .get(
    //       `${urls.MR}/transaction/marriageBoardRegistration/getapplicantById?applicationId=${ID}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       }
    //     )
    //     .then((resp) => {
    //       if (resp.status == 200) {
    //         // setApplicationData(resp.data)
    //         reset(resp.data);

    //         console.log("sdljfslkdfjslkdjflskdjf", JSON.stringify(resp.data));
    //       }
    //     });
    // } else if (serviceId === 15) {
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
    //       if (resp.status == 200 || resp.status == 201) {
    //         console.log("sdljfslkdfjslkdjflskdjf00", resp.data);
    //         reset(resp.data);
    //         setData(resp.data);
    //       }
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
    // } else if (serviceId === 15) {
    //   axios
    //     .get(
    //       `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${ID}`,

    //       {
    //         headers: {
    //           Authorization: `Bearer ${user.token}`,
    //         },
    //       }
    //     )
    //     .then((resp) => {
    //       console.log("MODboard", resp.data);
    //       reset(resp.data);
    //       setData(resp.data);
    //     });
    // }
    formPreviewDailogOpen();
  };
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

  // useEffect(() => {
  //   console.log(
  //     "router.sdlfksldkfjlds",
  //     ValueServiceName,
  //     ValueServiceNameMr,
  //     ValueApplicantName,
  //     ValueApplicantNameMr,
  //   );
  //   // alert('language', ValueServiceName)
  //   // setValue(
  //   //   "serviceName",
  //   //   language == "en" ? ValueServiceName : ValueServiceNameMr,
  //   // );
  //   setValue(
  //     "serviceName",
  //     language == "en"
  //       ? router?.query?.serviceName
  //       : router?.query?.serviceNameMr,
  //   );
  //   setValue(
  //     "applicantName",
  //     language === "en"
  //       ? router?.query?.applicantName
  //       : router?.query?.applicantNameMr,
  //   );
  // }, [language]);

  // useEffect(() => {
  //   console.log("router?.query? 11", router?.query);
  //   if (router?.query) {
  //     setData(router?.query);
  //     reset(router?.query);
  //   }
  // }, []);

  useEffect(() => {
    const ID = router.query.applicationId;
    const ID1 = router.query.id;
    console.log("router?.query?", router?.query);
    if (serviceId == 10) {
      axios
        .get(
          `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${ID}`,

          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log("new marriage", resp.data);
          reset(resp.data);
          setData(resp.data);
          // alert("yetay ka marriage la");
          // // console.log('sdljfslkdfjslkdjflskdjf', resp.data)
          // setValueServiceName(resp?.data?.serviceName);
          // setValueServiceNameMr(resp?.data?.serviceNameMr);
          // setValueApplicantName(resp?.data?.applicantName);
          // setValueApplicantNameMr(resp?.data?.applicantNameMr);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (serviceId === 15) {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${ID}`,

          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log("board", resp.data);
          reset(resp.data);
          setData(resp.data);
          // alert('yetay')
          // console.log('sdljfslkdfjslkdjflskdjf', resp.data)
          // setValueServiceName(resp?.data?.serviceName);
          // setValueServiceNameMr(resp?.data?.serviceNameMr);
          // setValueApplicantName(resp?.data?.applicantName);
          // setValueApplicantNameMr(resp?.data?.applicantNameMr);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else if (serviceId == 12) {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${ID1}`,

          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          console.log("MOD OF MR CERTIFICATE", resp.data);
          reset(resp.data);
          setData(resp.data);
          // alert('yetay')
          // console.log('sdljfslkdfjslkdjflskdjf', resp.data)
          // setValueServiceName(resp?.data?.serviceName);
          // setValueServiceNameMr(resp?.data?.serviceNameMr);
          // setValueApplicantName(resp?.data?.applicantName);
          // setValueApplicantNameMr(resp?.data?.applicantNameMr);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, []);

  // useEffect(() => {
  //   console.log(
  //     "useeffect madhe ala ka",
  //     ValueServiceName,
  //     ValueServiceNameMr,
  //     ValueApplicantName,
  //     ValueApplicantNameMr,
  //   );
  // }, [
  //   ValueServiceName,
  //   ValueServiceNameMr,
  //   ValueApplicantName,
  //   ValueApplicantNameMr,
  // ]);
  console.log("dsdf", watch());
  const handleDataFromChild = (data) => {
    // Do something with the data received from the child component
    console.log("Data received from child:", data);
  };

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
                  {language === "en" ? "Applicant Details" : "अर्जदार तपशील"}
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
                  // error={!!errors.applicantName}
                  // helperText={
                  //   errors?.applicantName ? errors.applicantName.message : null
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
                {/* <TextField
                  style={{ width: 280 }}
                  InputLabelProps={{ shrink: true }}
                  disabled
                  id="standard-basic"
                  label={<FormattedLabel id="applicationDate" />}
                  // label="Application Date"
                  variant="standard"
                  {...register("applicationDate")}
                  // error={!!errors.applicationDate}
                  // helperText={
                  //   errors?.applicationDate
                  //     ? errors.applicationDate.message
                  //     : null
                  // }
                /> */}

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
                  // setAccessValue(true)

                  const id = router.query.id;
                  console.log("sddlfkjslkfdjsdlkf", router.query.id);
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
          maxWidth={"xl"}
          open={formPreviewDailog}
          onClose={() => formPreviewDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                {language == "en" ? "Preview" : "पूर्वावलोकन"}
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
            {serviceId === 10 ? (
              <>
                <FormProvider {...methods}>
                  <form /* onSubmit={handleSubmit(onFinish)} */>
                    <ApplicantDetails />
                    <GroomDetails />
                    <BrideDetails />
                    <PriestDetails />
                    <WitnessDetails />
                  </form>
                </FormProvider>
              </>
            ) : (
              ""
            )}
            {serviceId === 67 ? (
              <>
                <BoardRegistration
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                  accessValue={accessValue}
                />
              </>
            ) : (
              ""
            )}
            {serviceId === 15 ? (
              <>
                <ModBoardRegistration
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                />
              </>
            ) : (
              ""
            )}

            {serviceId === 12 ? (
              <>
                <ModMarriageCertificate
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                />
              </>
            ) : (
              ""
            )}

            {serviceId === 11 ? (
              <>
                <ReissuanceofMCertificate
                  onlyDoc={false}
                  preview={true}
                  photos={data ? data : []}
                />
              </>
            ) : (
              ""
            )}
            {/* {serviceId === 13 && <></>}
            {serviceId === 14 && <></>}
            {serviceId === 12 && <></>} */}
          </DialogContent>

          <DialogTitle>
            <Grid
              container
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-start" }}
            >
              {((serviceId == 10 || serviceId == 67) &&
                router?.query?.role === "DOCUMENT_VERIFICATION") ||
                (router?.query?.role === "LOI_GENERATION" && (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={6}
                    xl={6}
                    sx={{ justifyContent: "flex-start" }}
                  >
                    <Button
                      // style={{border:'solid red'}}
                      onClick={() => {
                        const textAlert =
                          language == "en"
                            ? "Are you sure you want to update the Application Details ? "
                            : "तुमची खात्री आहे की तुम्ही अर्ज तपशील अपडेट करू इच्छिता ?";
                        const title =
                          language == "en" ? "Updated ! " : "अपडेट केले!";
                        console.log("ddddddddd", watch());
                        setAccessValue(false);
                        swal({
                          title: title,
                          text: textAlert,
                          icon: "warning",
                          buttons: true,
                          dangerMode: true,
                        }).then((willDelete) => {
                          // if (willDelete) {
                          //   swal("Record is Successfully Exit!", {
                          //     icon: "success",
                          formPreviewDailogClose();
                          // });
                          // } else {
                          //   swal("Record is Safe");
                          // }
                        });
                      }}
                    >
                      <FormattedLabel id="update" />
                    </Button>
                  </Grid>
                ))}
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                lg={6}
                xl={6}
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
                              button: "Ok",
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
            </Grid>
          </DialogTitle>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default Index;
