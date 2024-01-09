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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sweetAlert from "sweetalert";
import { ToWords } from "to-words";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel.js";
import theme from "../../../../../theme.js";
import urls from "../../../../../URLS/urls.js";
import styles from "../../sportBooking/PaymentCollection.module.css";
import Loader from "../../../../../containers/Layout/components/Loader";
import { catchExceptionHandlingMethod } from "../../../../../util/util.js";

// Loi Generation
const LoiGenerationComponent = (props) => {
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
  const [loadderState, setLoadderState] = useState(false);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "serviceCharges", // unique name for your Field Array
    }
  );
  const language = useSelector((state) => state?.labels.language);
  let user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.user.token);

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
  const [applicableCharages, setApplicableCharages] = useState([]);

  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`,{headers: {
        Authorization: `Bearer ${token}`,
      }
      })
      .then((r) => {
        if (r.status == 200) {
          setServiceNames(
            r.data.service.map((row) => ({
              id: row.id,
              serviceName: row.serviceName,
              serviceNameMr: row.serviceNameMr,
            }))
          );
        } else {
          message.error("Filed To Load !! Please Try Again !");
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getServiceCharges = () => {
    axios
      .get(
        `${urls.CFCURL}/master/servicecharges/getByServiceId?serviceId=${35}`,{headers: {
          Authorization: `Bearer ${token}`,
        }
        }
      )
      .then((r) => {
        setValue("serviceCharges", r.data.serviceCharge);
        setServiceCharges(r.data.serviceCharge);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

  };

  useEffect(() => {
    console.log("applicableCharages", applicableCharages);
  }, [applicableCharages]);

  useEffect(() => {
    console.log("router?.query?.role", router?.query?.role);
    reset(props?.data);
    console.log("propsyetoy", props);
  }, []);
  // const getLoiGenerationData = () => {
  //   axios.get(`${urls.SPURL}/swimmingPool/getById?id=${props?.data?.id}`).then((r) => {
  //     if (r.status === 200) {
  //       setValue("penaltyCharge", r.data.penaltyCharge);
  //       setValue("serviceCharge", r.data.serviceCharge);
  //       setData(r.data);
  //       setServiceId(r.data.serviceId);
  //       setValue("serviceName", r.data.serviceId);
  //       console.log("resp.data", r.data);
  //       reset(r.data);
  //     }
  //   });
  // };
  const getSwimmingBookingData = () => {
    if(props?.data?.id){
    axios
      .get(`${urls.SPURL}/swimmingBookingMonthly/getById?id=${props?.data?.id}`,{headers: {
        Authorization: `Bearer ${token}`,
      }
      })
      .then((res) => {
        console.log("11", res);
        setApplicableCharages(res?.data?.appCharagesDaos);
        // const tempData = res?.data;

        // reset(res);
        // setDataa(_res);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    }
  };

  useEffect(() => {
    console.log("props details", props);
    getserviceNames();
    getSwimmingBookingData();
    // getLoiGenerationData();
  }, []);

  useEffect(() => {
    setValue("serviceName", serviceId);
  }, [serviceId]);

  // useEffect(() => {
  //   getServiceCharges();
  // }, [serviceId]);

  // Handle Next
  const handleNext = (data) => {
    setLoadderState(true);

    let finalBodyForApi = {
      ...data,
      id: props?.data?.id,
      role: props?.newRole,
      serviceId: 35,
      emailAddress: watch("emailAddress"),
      // serviceChargeDao:
      // payment: null,
    };

    axios
      .post(
        `${urls.SPURL}/swimmingBookingMonthly/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          setLoadderState(false);

          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");

          router.push({
            pathname:
              "/sportsPortal/transaction/swimmingPoolM/scrutiny/LoiGenerationReciptmarathi",
            query: {
              applicationId: getValues("id"),
            },
          });
        } else if (res.status == 201) {
          console.log("backendResponse", res);
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved !", "Record Saved successfully !", "success");

          router.push({
            pathname:
              "/sportsPortal/transaction/swimmingPoolM/scrutiny/LoiGenerationReciptmarathi",
            query: {
              applicationId: getValues("id"),
            },
          });
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
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
                {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="serviceName" />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={true}
                      sx={{ minWidth: "230px", width: "500px" }}
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
                            {language == "en" ? serviceName?.serviceName : serviceName?.serviceNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="serviceName"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid> */}

                {/* <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                value={"Swimming Pool Monthly Booking"}
                disabled={true}
                label="Service Name"
                helperText={
                  errors?.applicationNumber
                    ? errors.applicationNumber.message
                    : null
                }
              />
            </Grid> */}

                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <TextField
                    InputLabelProps={{
                      shrink:
                        (watch("applicationNumber") ? true : false) ||
                        (router?.query?.applicationNumber ? true : false),
                    }}
                    disabled={true}
                    // label={<FormattedLabel id="applicationNo" />}
                    label="Application No."
                    {...register("applicationNumber")}
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
                        (watch("firstName") ? true : false) ||
                        (router?.query?.firstName ? true : false),
                    }}
                    id="standard-basic"
                    // disabled={inputState}
                    label={<FormattedLabel id="firstName" />}
                    {...register("firstName")}
                    error={!!errors.firstName}
                    helperText={
                      errors?.firstName ? errors.firstName.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    disabled={true}
                    InputLabelProps={{
                      shrink:
                        (watch("middleName") ? true : false) ||
                        (router?.query?.middleName ? true : false),
                    }}
                    id="standard-basic"
                    // disabled={inputState}
                    label={<FormattedLabel id="middleName" />}
                    {...register("middleName")}
                    error={!!errors.middleName}
                    helperText={
                      errors?.middleName ? errors.middleName.message : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    disabled={true}
                    InputLabelProps={{
                      shrink:
                        (watch("lastName") ? true : false) ||
                        (router?.query?.lastName ? true : false),
                    }}
                    id="standard-basic"
                    // disabled={inputState}
                    label={<FormattedLabel id="lastName" />}
                    {...register("lastName")}
                    error={!!errors.lastName}
                    helperText={
                      errors?.lastName ? errors.lastName.message : null
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    disabled={true}
                    InputLabelProps={{
                      shrink:
                        (watch("firstNameMr") ? true : false) ||
                        (router?.query?.firstNameMr ? true : false),
                    }}
                    id="standard-basic"
                    // disabled={inputState}
                    label={<FormattedLabel id="firstNamemr" />}
                    {...register("firstNameMr")}
                    error={!!errors.firstNameMr}
                    helperText={
                      errors?.firstNameMr ? errors.firstNameMr.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    disabled={true}
                    InputLabelProps={{
                      shrink:
                        (watch("middleNameMr") ? true : false) ||
                        (router?.query?.middleNameMr ? true : false),
                    }}
                    id="standard-basic"
                    // disabled={inputState}
                    label={<FormattedLabel id="middleNamemr" />}
                    {...register("middleNameMr")}
                    error={!!errors.middleNameMr}
                    helperText={
                      errors?.middleNameMr ? errors.middleNameMr.message : null
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    disabled={true}
                    InputLabelProps={{
                      shrink:
                        (watch("lastNameMr") ? true : false) ||
                        (router?.query?.lastNameMr ? true : false),
                    }}
                    id="standard-basic"
                    // disabled={inputState}
                    label={<FormattedLabel id="lastNamemr" />}
                    {...register("lastNameMr")}
                    error={!!errors.lastNameMr}
                    helperText={
                      errors?.lastNameMr ? errors.lastNameMr.message : null
                    }
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
                    // label={<FormattedLabel id="email" />}
                    label="Email-ID"
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
                        (watch("mobileNo") ? true : false) ||
                        (router?.query?.mobileNo ? true : false),
                    }}
                    id="standard-basic"
                    // disabled={inputState}
                    label={<FormattedLabel id="mobileNo" />}
                    {...register("mobileNo")}
                    error={!!errors.mobileNo}
                    helperText={
                      errors?.mobileNo ? errors.mobileNo.message : null
                    }
                  />
                </Grid>
              </Grid>
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
            <strong>
              Booking Details
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
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
                InputLabelProps={{
                  shrink: (watch("selectSlot") ? true : false) || (router?.query?.selectSlot ? true : false),
                }}
                disabled={true}
                label="Slot "
                {...register("selectSlot")}
                error={!!errors.selectSlot}
                helperText={errors?.selectSlot ? errors.selectSlot.message : null}
              />
            </Grid>
          </Grid> */}

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
                <>
                  <table id="table-to-xls" className={styles.report_table}>
                    <thead>
                      <tr>
                        <th colSpan={2}>अ.क्र</th>
                        <th colSpan={8}>शुल्काचे नाव</th>
                        <th colSpan={2}>रक्कम (रु)</th>
                      </tr>
                      {/* <tr>
                  <td colSpan={4}>1)</td>
                  <td colSpan={4}>
                    <b>Registration Fees</b>
                  </td>
                  <td colSpan={4}></td>
                </tr> */}
                    </thead>
                    <tbody>
                      {/* <tr>
                  <td colSpan={4}>2)</td>
                  <td colSpan={4}>
                    <b>Deposit</b>
                  </td>
                  <td colSpan={4}></td>
                </tr> */}
                      <tr>
                        <td colSpan={4}>1)</td>
                        <td colSpan={4}>
                          {/* <b>Rate</b> */}
                          {applicableCharages?.map((charge, index) => {
                            return (
                              <td colSpan={4}>
                                <b>{charge.chargeTypeName}</b>
                              </td>
                            );
                          })}
                        </td>

                        <>
                          {applicableCharages?.map((charge, index) => {
                            console.log("serviceChargeId1212", charge);
                            return <td colSpan={4}>{charge.amountPerHead}</td>;
                          })}
                        </>
                      </tr>

                      <tr>
                        <td colSpan={4}>
                          <b></b>
                        </td>
                        <td colSpan={4}>
                          <b>एकूण रक्कम : </b>
                        </td>
                        <td colSpan={4}>
                          <b>
                            {applicableCharages?.map((charge, index) => {
                              console.log("serviceChargeId1212", charge);
                              return <td colSpan={4}>{charge.totalAmount}</td>;
                            })}
                          </b>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>

                {/* <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
              <TextField
                InputLabelProps={{ shrink: true }}
                value="Swimming Pool"
                sx={{ width: "240px" }}
                id="standard-basic"
                disabled={true}
                // key={serviceChargeId.id}
                label={<FormattedLabel id="chargeName" />}
                {...register(`serviceCharges.${0}.chargeName`)}
                // error={!!errors.charge}
                // helperText={errors?.charge ? errors.charge.message : null}
              />
            </Grid> */}
                {/* <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
              <TextField
                InputLabelProps={{ shrink: true }}
                // value="50"
                sx={{ width: "250px" }}
                id="standard-basic"
                disabled={true}
                // key={serviceChargeId.id}
                // label={<FormattedLabel id="amount" />}
                label="Amount (Rs.)"
                // {...register(`serviceCharges.${0}.amount`)}
                {...register("amount")}
                // error={!!errors.amount}
                // helperText={errors?.amount ? errors.amount.message : null}
              />
            </Grid> */}
              </Grid>

              <Grid
                container
                sx={{
                  paddingLeft: "50px",
                  align: "center",
                  backgroundColor: "primary",
                  // border: "4px solid black",
                }}
              >
                {/* <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
              <TextField
                // label={<FormattedLabel id="totalCharges" />}
                label="Total Charges (Rs.)"
                disabled={true}
                InputLabelProps={{ shrink: true }}
                {...register("amount")}
                // error={!!errors.total}
                // helperText={errors?.total ? errors.total.message : null}
              />
            </Grid> */}
                {/* <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
              <TextField
                disabled={true}
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="totalInWords" />}
                // {...register("loi.totalInWords")}
                // error={!!errors.totalInWords}
                // helperText={errors?.totalInWords ? errors.totalInWords.message : null}
              />
            </Grid> */}
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
                      <FormattedLabel id="generateLoi" />
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </ThemeProvider>
        </>
      )}
    </>
  );
};

export default LoiGenerationComponent;
