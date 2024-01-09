import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { Stack } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router.js";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sweetAlert from "sweetalert";
import { ToWords } from "to-words";
import urls from "../../../../../URLS/urls.js";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel.js";
import theme from "../../../../../theme.js";
import { catchExceptionHandlingMethod } from "../../../../../util/util.js";

// Loi Generation
const LoiGenerationComponent = (props) => {
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
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toWords = new ToWords();
  const router = useRouter();
  const [serviceNames, setServiceNames] = useState([]);
  const [serviceCharge, setServiceCharges] = useState([]);
  const [serviceId, setServiceId] = useState(null);
  const [data, setData] = useState(null);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "mstServiceCharges", // unique name for your Field Array
    },
  );
  const language = useSelector((state) => state?.labels.language);

  // lOI GENERATION PREVIEW

  const [loiGenerationReceiptDailog, setLoiGenerationReceiptDailog] =
    useState(false);
  const loiGenerationReceiptDailogOpen = () =>
    setLoiGenerationReceiptDailog(true);
  const loiGenerationReceiptDailogClose = () =>
    setLoiGenerationReceiptDailog(false);

  // const loi Recipit - Preview
  const loiGenerationReceipt = () => {
    loiGenerationReceiptDailogOpen();
  };
  const [inputState, setInputState] = useState(false);

  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            })),
          );
        } else {
          message.error("Filed To Load !! Please Try Again !");
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   console.log(err);
    //   toast.success("Error !", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // });
  };
  useEffect(() => {
    console.log("serviceId--->", serviceId);
  }, [serviceId]);
  const getServiceCharges = () => {
    axios
      .get(
        `${urls.TPURL}/mstServiceCharges/getByServiceId?serviceId=${router.query.serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        setValue(`mstServiceCharges.[0]`, r.data.mstServiceCharges[0]);
        setServiceCharges(r.data.mstServiceCharges);
        console.log("mstServiceCharges1111111", r.data.mstServiceCharges);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getLoiGenerationData = () => {
    axios
      .get(
        `${urls.TPURL}/developmentPlanOpinion/getDevelopmentPlanOpinionById?id=${router?.query?.applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        // console.log('r.data.status', r)
        if (r.status === 200) {
          setValue("penaltyCharge", r.data.penaltyCharge);
          setValue("mstServiceCharges", r.data.mstServiceCharges);
          setData(r.data);
          setServiceId(r.data.serviceId);
          setValue("serviceName", r.data.serviceId);
          console.log("resp.data", r.data);
          reset(r.data);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getserviceNames();
    if (router?.query?.applicationId) getLoiGenerationData();
  }, []);

  useEffect(() => {
    setValue("serviceName", serviceId);
  }, [serviceId]);

  useEffect(() => {
    getServiceCharges();
  }, [serviceId]);

  // useEffect(() => {
  //   let total = 0;
  //   // serviceCharge.forEach((data) => {
  //   //   total += data.amount
  //   // })
  //   if (data) {
  //     setValue(
  //       "mstServiceCharges.amount",
  //       Number(data?.serviceCharge + data?.penaltyCharge),
  //     );

  //     setValue(
  //       "mstServiceCharges.totalInWords",
  //       toWords.convert(data?.serviceCharge + data?.penaltyCharge),
  //     );
  //   }
  // }, [data]);

  let applicationId;
  if (router?.query?.applicationId) {
    applicationId = router?.query?.applicationId;
  } else if (router?.query?.id) {
    applicationId = router?.query?.id;
  }
  // Handle Next
  const handleNext = (data) => {
    let finalBodyForApi = {
      ...data,
      // role: router?.query?.role,
      role: "LOI_VERIFICATION",
      // loi: null,
      trnLoiDao: { mstServiceChargesId: 2 },
      serviceId: 19,

      id: Number(applicationId),
    };
    if (serviceId == 19) {
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
          if (res.status == 200) {
            console.log("backendResponse", res);
            finalBodyForApi.id
              ? sweetAlert(
                  language == "en" ? "LOI !" : "एल ओ आय",
                  language == "en"
                    ? "LOI Generated successfully !"
                    : "एल ओ आय यशस्वीरित्या व्युत्पन्न झाले",
                  "success",
                )
              : language == "en"
              ? sweetAlert({
                  title: "Saved!",
                  text: "Record Saved successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "जतन केले!",
                  text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  icon: "success",
                  button: "ओके",
                });

            router.push({
              pathname:
                "/townPlanning/transactions/developmentPlanOpinion/scrutiny/LoiGenerationReciptmarathi",
              query: {
                applicationId: getValues("id"),
              },
            });
          } else if (res.status == 201) {
            console.log("backendResponse", res);
            finalBodyForApi.id
              ? sweetAlert(
                  language == "en" ? "LOI !" : "एल ओ आय",
                  language == "en"
                    ? "LOI Generated successfully !"
                    : "एल ओ आय यशस्वीरित्या व्युत्पन्न झाले",
                  "success",
                )
              : language == "en"
              ? sweetAlert({
                  title: "Saved!",
                  text: "Record Saved successfully!",
                  icon: "success",
                  button: "Ok",
                })
              : sweetAlert({
                  title: "जतन केले!",
                  text: "रेकॉर्ड यशस्वीरित्या जतन केले!",
                  icon: "success",
                  button: "ओके",
                });

            router.push({
              pathname:
                "/townPlanning/transactions/developmentPlanOpinion/scrutiny/LoiGenerationReciptmarathi",
              query: {
                applicationId: getValues("id"),
              },
            });
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    let total = 0;
    serviceCharge.forEach((data) => {
      total += data.amount;
    });
    setValue("loi.amount", total);
    setValue("loi.totalInWords", toWords.convert(total));
  }, [serviceCharge]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <form onSubmit={handleSubmit(handleNext)}>
          <div
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
            <strong>
              <FormattedLabel id="applicantDetails" />
            </strong>
          </div>
          <Grid
            container
            sx={{
              marginTop: 1,
              marginBottom: 5,
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
              <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="serviceName" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ minWidth: "230px", width: "400px" }}
                      autoFocus
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Service Name *"
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      {serviceNames &&
                        serviceNames.map((serviceName, index) => (
                          <MenuItem key={index} value={serviceName.id}>
                            {language == "en"
                              ? serviceName?.serviceName
                              : serviceName?.serviceNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="serviceName"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>

            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TextField
                style={{ width: 280 }}
                InputLabelProps={{
                  shrink:
                    (watch("applicationNumber") ? true : false) ||
                    (router?.query?.applicationNumber ? true : false),
                }}
                disabled={true}
                label={<FormattedLabel id="applicationNo" />}
                // label="Application No."
                {...register("applicationNumber")}
                error={!!errors.applicationNumber}
                helperText={
                  errors?.applicationNumber
                    ? errors.applicationNumber.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <FormControl
                sx={{ marginTop: 0 }}
                error={!!errors.applicationDate}
              >
                <Controller
                  name="applicationDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={true}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <span style={{ fontSize: 16, marginTop: 2 }}>
                            {<FormattedLabel id="applicationDate" />}
                          </span>
                        }
                        value={field.value}
                        onChange={(date) =>
                          field.onChange(moment(date).format("YYYY-MM-DD"))
                        }
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 3,
                              },
                            }}
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
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch("firstNameEn") ? true : false) ||
                    (router?.query?.firstNameEn ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="firstNameEn" />}
                {...register("firstNameEn")}
                error={!!errors.firstNameEn}
                helperText={
                  errors?.firstNameEn ? errors.firstNameEn.message : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch("middleNameEn") ? true : false) ||
                    (router?.query?.middleNameEn ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="middleNameEn" />}
                {...register("middleNameEn")}
                error={!!errors.middleNameEn}
                helperText={
                  errors?.middleNameEn ? errors.middleNameEn.message : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch("surnameEn") ? true : false) ||
                    (router?.query?.surnameEn ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="surnameEn" />}
                {...register("surnameEn")}
                error={!!errors.surnameEn}
                helperText={errors?.surnameEn ? errors.surnameEn.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch("emailAddress") ? true : false) ||
                    (router?.query?.emailAddress ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="email" />}
                {...register("emailAddress")}
                error={!!errors.emailAddress}
                helperText={
                  errors?.emailAddress ? errors.emailAddress.message : null
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={true}
                InputLabelProps={{
                  shrink:
                    (watch("mobile") ? true : false) ||
                    (router?.query?.mobile ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="mobile" />}
                {...register("mobile")}
                error={!!errors.mobile}
                helperText={errors?.mobile ? errors.mobile.message : null}
              />
            </Grid>
          </Grid>
          <div
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
            <strong>
              <FormattedLabel id="chargesDetails" />
            </strong>
          </div>

          <Grid
            container
            // key={index}
            sx={{
              paddingLeft: "50px",
              align: "center",
            }}
          >
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value="Fixed"
                id="standard-basic"
                // key={}
                disabled={true}
                label="Service Charge Type Name"
                // label={<FormattedLabel id="serviceChargeTypeName" />}
                {...register(`mstServiceCharges.${0}.serviceChargeTypeName`)}

                // error={!!errors.serviceChargeType}
                // helperText={
                //   errors?.serviceChargeType
                //     ? errors.serviceChargeType.message
                //     : null
                // }
              />
            </Grid>
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value="Development Plan Opinion"
                sx={{ width: "240px" }}
                id="standard-basic"
                disabled={true}
                label={<FormattedLabel id="chargeName" />}
                {...register(`mstServiceCharges.${0}.chargeName`)}
                // error={!!errors.charge}
                // helperText={errors?.charge ? errors.charge.message : null}
              />
            </Grid>
            {console.log("mstServiceCharges-->", watch("mstServiceCharges"))}

            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value="20"
                sx={{ width: "250px" }}
                id="standard-basic"
                disabled={true}
                label="application Fees"
                // {...register(`mstServiceCharges[${0}].applicationFees`)}
                // error={!!errors.amount}
                // helperText={errors?.amount ? errors.amount.message : null}
              />
            </Grid>

            <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value="250"
                sx={{ width: "250px" }}
                id="standard-basic"
                disabled={true}
                label="certificate Charges"
                // key={serviceChargeId.id}
                // label={<FormattedLabel id="amount" />}
                // {...register("certificateCharges")}
                // {...register(`mstServiceCharges.[${0}].amount`)}
                // error={!!errors.amount}
                // helperText={errors?.amount ? errors.amount.message : null}
              />
            </Grid>
          </Grid>

          {/* {data?.penaltyCharge > 0 && (
            <Grid
              container
              // key={index}
              sx={{
                paddingLeft: "50px",
                align: "center",
              }}
            >
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value="Slab"
                  id="standard-basic"
                  // key={}
                  disabled={true}
                  label={<FormattedLabel id="serviceChargeTypeName" />}
                  {...register(`mstServiceCharges.${1}.serviceChargeTypeName`)}

                  // error={!!errors.serviceChargeType}
                  // helperText={
                  //   errors?.serviceChargeType
                  //     ? errors.serviceChargeType.message
                  //     : null
                  // }
                />
              </Grid>
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value="विलंब शुल्क"
                  sx={{ width: "240px" }}
                  id="standard-basic"
                  disabled={true}
                  // key={serviceChargeId.id}
                  label={<FormattedLabel id="chargeName" />}
                  {...register(`mstServiceCharges.${1}.chargeName`)}
                  // error={!!errors.charge}
                  // helperText={errors?.charge ? errors.charge.message : null}
                />
              </Grid>
              <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  value={data?.penaltyCharge}
                  sx={{ width: "250px" }}
                  id="standard-basic"
                  disabled={true}
                  // key={serviceChargeId.id}
                  label={<FormattedLabel id="amount" />}
                  {...register(`mstServiceCharges.${1}.amount`)}
                  // error={!!errors.amount}
                  // helperText={errors?.amount ? errors.amount.message : null}
                />
              </Grid>
            </Grid>
          )} */}

          <Grid
            container
            sx={{
              paddingLeft: "50px",
              align: "center",
              backgroundColor: "primary",
              // border: "4px solid black",
            }}
          >
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}></Grid>

            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                label={<FormattedLabel id="totalCharges" />}
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register(`mstServiceCharges[${0}].amount`)}
                error={!!errors.amount}
                helperText={errors?.amount ? errors.amount.message : null}
              />
            </Grid>
            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="totalInWords" />}
                {...register("loi.totalInWords")}
                error={!!errors.totalInWords}
                helperText={
                  errors?.totalInWords ? errors.totalInWords.message : null
                }
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{
                display: "flex",
                marginTop: "30px",
                justifyContent: "center",
                alignItem: "center",
              }}
            >
              <Stack spacing={5} direction="row">
                <Button
                  type="submit"
                  sx={{ width: "230 px" }}
                  variant="contained"
                  // onClick={() =>
                  //   router.push({
                  //     pathname:
                  //       '/marriageRegistration/transactions/boardRegistrations/scrutiny/LoiGenerationReciptmarathi',
                  //     query: {
                  //       applicationId: getValues('id'),
                  //     },
                  //   })
                  // }
                >
                  {/* <FormattedLabel id="generateLoi" /> */}
                  {language == "en" ? "LOI VERIFY" : "LOI सत्यापित करा"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </ThemeProvider>
    </>
  );
};

export default LoiGenerationComponent;
