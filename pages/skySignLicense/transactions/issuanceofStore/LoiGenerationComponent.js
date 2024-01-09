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
import sweetAlert from "sweetalert";
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
import { ToWords } from "to-words";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel.js";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls.js";
import Loader from "../../../../containers/Layout/components/Loader/index.js";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

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
  const [tempBusinessType, setTempBusinessType] = useState(null);
  const [tempBusinessValue, setTempBusinessValue] = useState();
  const [loading, setLoading] = useState(false);
  let user = useSelector((state) => state.user.user);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "serviceCharges", // unique name for your Field Array
    }
  );
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();
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

  // title
  // const [titles, setTitles] = useState([])

  // // getTitles
  // const getTitles = () => {
  //   axios.get(`${urls.CfcURLMaster}/title/getAll`).then((r) => {
  //     setTitles(
  //       r.data.title.map((row) => ({
  //         id: row.id,
  //         aTitle: row.title,
  //         titleMr: row.titleMr,
  //       })),
  //     )
  //   })
  // }

  const [storeTypes, setStoreTypes] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);

  const getBusinessTypes = () => {
    axios
      .get(`${urls.SSLM}/mstStoreTypes/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setStoreTypes(
          r.data?.mstStoreTypesDao?.map((row) => ({
            id: row.id,
            storeType: row.storeType,
            storeTypeMr: row.storeTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getUnitTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstUnitType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setUnitTypes(
          r.data?.mstUnitTypeDaoList?.map((row, i) => ({
            activeFlag: row.activeFlag,
            id: row.id,
            srNo: i + 1,
            unitType: row.unitType,
            status: row.activeFlag === "Y" ? "Active" : "Inactive",
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getBusinessTypes();
    getUnitTypes();
  }, []);
  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
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
    // .catch((err) => {
    //   console.log(err);
    //   toast.error("Error !", {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    // });
  };

  const getServiceCharges = () => {
    if (getValues("serviceId")) {
      axios
        .get(
          `${
            urls.CFCURL
          }/master/servicecharges/getByServiceId?serviceId=${getValues(
            "serviceId"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          setValue("serviceCharges", r.data.serviceCharge);
          setServiceCharges(r.data.serviceCharge);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  const getCharges = () => {
    let finalBodyForApi = {
      storeType: tempBusinessType,

      storeValue: tempBusinessValue,
    };

    axios
      .post(
        `${urls.SSLM}/master/MstRateChartOfStoreLicense/getRateChart`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        // setValue('serviceCharges', r.data.serviceCharge)
        // setServiceCharges(r.data.serviceCharge)
        setValue("storeTypesKey", r?.data?.storeTypesKey);
        setValue("typeOfRate", r?.data?.typeOfRate);
        setValue("minValue", r?.data?.minValue);
        setValue("maxValue", r?.data?.maxValue);
        setValue("noOfQuantity", r?.data?.noOfQuantity);
        setValue("rate", r?.data?.rate);
        setValue("unitKey", r?.data?.unitKey);
        // setValue('loi.amount',r?.data?.rate)
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getLoiGenerationData = () => {
    setLoading(true);
    axios
      .get(
        `${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/getByIdAndServiceId?serviceId=9&id=${router?.query?.id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((r) => {
        setLoading(false);
        // console.log('r.data.status', r)
        if (r.status === 200) {
          setServiceId(r.data?.serviceId);
          console.log("resp.data", r.data);
          reset(r.data);
          setValue("serviceName", r.data.serviceId);
          setValue("applicationNumber", r.data.id);
          setValue("afName", r.data?.firstName);
          setValue("amName", r.data?.middleName);
          setValue("alName", r.data?.lastName);
          setValue("aemail", r.data.emailAddress);
          setValue("amobileNo", r.data?.mobile);
          setTempBusinessType(r.data?.trnStoreDetailsDao?.storeType);
          setTempBusinessValue(r.data?.trnStoreDetailsDao?.storeValue);
          setValue("storeValue", r.data?.trnStoreDetailsDao?.storeValue);
        }
      })
      .catch((err) => {
        setLoading(false);
        sweetAlert({
          title: language === "en" ? "Error !! " : "त्रुटी !!",
          text:
            language === "en"
              ? "Somethings Wrong !! Getting error while fetching records !"
              : "काहीतरी त्रुटी !! रेकॉर्ड मिळवताना त्रुटी येत आहे",
          icon: "error",
          button: language === "en" ? "Ok" : "ठीक आहे",
          dangerMode: false,
          closeOnClickOutside: false,
        }).then((will) => {
          if (will) {
            router.push(`/skySignLicense/dashboards`);
          }
        });
      });
  };

  useEffect(() => {
    getserviceNames();
    if (router?.query?.id) getLoiGenerationData();
  }, [router?.query]);

  useEffect(() => {
    getServiceCharges();
  }, [serviceId]);

  useEffect(() => {
    if (tempBusinessType && tempBusinessValue) {
      getCharges();
    }
  }, [tempBusinessType, tempBusinessValue]);

  useEffect(() => {
    if (watch("rate")) {
      let total = 0;
      // serviceCharge?.forEach((data) => {
      //   total += data.amount
      // })
      setValue("loi.amount", watch("rate"));
      setValue("loi.totalInWords", toWords.convert(watch("rate")));
    }
  }, [watch("rate")]);

  // Handle Next
  const handleNext = (data) => {
    // const loi = {
    // ...data.loi,
    // amount: loi?.amount,
    // boardReg: getValues('id'),
    // }
    // loi,
    // role: 'LOI_GENERATION',
    // loiServiceCharges: getValues('serviceCharges'),
    // applicableChargesDao
    // payement: ,
    // {
    //   headers: {
    //     role: 'LOI_GENERATION',
    //     id: data.id,
    //   },
    // },

    let finalBodyForApi = {
      // ...data,
      role: router?.query?.role,
      // payment: null,
      id: Number(router?.query?.id),
      userId: user.id,
      trnLoiDao: {
        amount: watch("loi.amount"),
      },
    };
    setLoading(true);
    axios
      .post(
        `${urls.SSLM}/Trn/TrnIssuanceOfStoreLicense/saveApprove`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200 || res.status == 201) {
          setLoading(false);
          // router.push({
          //   pathname:
          //     "/skySignLicense/transactions/issuanceofStore/LoiGenerationReciptmarathi",
          //   query: {
          //     id: router?.query?.id,
          //   },
          // });
          sweetAlert({
            title: language === "en" ? "Saved " : "जतन केले",
            text:
              language === "en"
                ? "Record saved successfully"
                : "रेकॉर्ड यशस्वीरित्या जतन केले",
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
            dangerMode: false,
            closeOnClickOutside: false,
          }).then((will) => {
            if (will) {
              router.push({
                pathname:
                  "/skySignLicense/transactions/issuanceofStore/LoiGenerationReciptmarathi",
                query: {
                  id: router?.query?.id,
                },
              });
            }
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        sweetAlert({
          title: language === "en" ? "Error !! " : "त्रुटी !!",
          text:
            language === "en"
              ? "Somethings Wrong !! Record not Saved!"
              : "काहीतरी त्रुटी !! रेकॉर्ड जतन केलेले नाही!",
          icon: "error",
          button: language === "en" ? "Ok" : "ठीक आहे",
          dangerMode: false,
          closeOnClickOutside: false,
        }).then((will) => {
          if (will) {
            router.push(`/skySignLicense/dashboards`);
          }
        });
      });

    // router.push({
    //   pathname:
    //     '/skySignLicense/transactions/issuanceOfBusinessOrIndustry/LoiGenerationReciptmarathi',
    //   query: {
    //     id: router?.query?.id,
    //   },
    // })
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
                {/* <FormattedLabel id="applicantDetails" /> */}
                Applicant Details
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
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    {/* {<FormattedLabel id="serviceName" />} */}
                    Service Name
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={true}
                        sx={{ minWidth: "230px", width: "500px" }}
                        // // dissabled={inputState}
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
                              {/* {<FormattedLabel id="applicationDate" />} */}
                              Application Date
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
                  InputLabelProps={{
                    shrink:
                      (watch("afName") ? true : false) ||
                      (router?.query?.afName ? true : false),
                  }}
                  disabled={true}
                  id="standard-basic"
                  // disabled={inputState}
                  // label={<FormattedLabel id="firstName" />}
                  label="First Name"
                  {...register("afName")}
                  error={!!errors.afName}
                  helperText={errors?.afName ? errors.afName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  disabled={true}
                  InputLabelProps={{
                    shrink:
                      (watch("amName") ? true : false) ||
                      (router?.query?.amName ? true : false),
                  }}
                  id="standard-basic"
                  // disabled={inputState}
                  // label={<FormattedLabel id="middleName" />}
                  label="Middle Name"
                  {...register("amName")}
                  error={!!errors.amName}
                  helperText={errors?.amName ? errors.amName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  disabled={true}
                  InputLabelProps={{
                    shrink:
                      (watch("alName") ? true : false) ||
                      (router?.query?.alName ? true : false),
                  }}
                  id="standard-basic"
                  // disabled={inputState}
                  // label={<FormattedLabel id="lastName" />}
                  label="Last Name"
                  {...register("alName")}
                  error={!!errors.alName}
                  helperText={errors?.alName ? errors.alName.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  disabled={true}
                  InputLabelProps={{
                    shrink:
                      (watch("aemail") ? true : false) ||
                      (router?.query?.aemail ? true : false),
                  }}
                  id="standard-basic"
                  // disabled={inputState}
                  // label={<FormattedLabel id="email" />}
                  label="Email"
                  {...register("aemail")}
                  error={!!errors.aemail}
                  helperText={errors?.aemail ? errors.aemail.message : null}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  disabled={true}
                  InputLabelProps={{
                    shrink:
                      (watch("amobileNo") ? true : false) ||
                      (router?.query?.amobileNo ? true : false),
                  }}
                  id="standard-basic"
                  // disabled={inputState}
                  // label={<FormattedLabel id="mobileNo" />}
                  label="Mobile No"
                  {...register("amobileNo")}
                  error={!!errors.amobileNo}
                  helperText={
                    errors?.amobileNo ? errors.amobileNo.message : null
                  }
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
                {/* <FormattedLabel id="chargesDetails" /> */}
                Charges Details
              </strong>
            </div>
            {/* {serviceCharge?.length > 0 && (
            <>
              {fields.map((serviceChargeId, index) => {
                return (
                  <Grid
                    container
                    key={index}
                    sx={{
                      paddingLeft: '50px',
                      align: 'center',
                    }}
                  >
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        id="standard-basic"
                        key={serviceChargeId.id}
                        disabled={true}
                        label={<FormattedLabel id="serviceChargeTypeName" />}
                        {...register(
                          `serviceCharges.${index}.serviceChargeTypeName`,
                        )}

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
                        sx={{ width: '240px' }}
                        id="standard-basic"
                        disabled={true}
                        key={serviceChargeId.id}
                        label={<FormattedLabel id="chargeName" />}
                        {...register(`serviceCharges.${index}.chargeName`)}
                      // error={!!errors.charge}
                      // helperText={errors?.charge ? errors.charge.message : null}
                      />
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <TextField
                        sx={{ width: '250px' }}
                        id="standard-basic"
                        disabled={true}
                        key={serviceChargeId.id}
                        label={<FormattedLabel id="amount" />}
                        {...register(`serviceCharges.${index}.amount`)}
                      // error={!!errors.amount}
                      // helperText={errors?.amount ? errors.amount.message : null}
                      />
                    </Grid>
                  </Grid>
                )
              })}
            </>
          )} */}

            <Grid
              container
              sx={{
                paddingLeft: "50px",
                align: "center",
              }}
            >
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <FormControl
                  variant="standard"
                  sx={{ m: 1, width: 120 }}
                  error={!!errors.storeTypesKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Store Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 250 }}
                        disabled={true}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Store Type *"
                      >
                        {storeTypes &&
                          storeTypes.map((storeType, index) => (
                            <MenuItem key={index} value={storeType.id}>
                              {storeType.storeType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="storeTypesKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.storeTypesKey
                      ? errors.storeTypesKey.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <TextField
                  id="standard-basic"
                  disabled={true}
                  InputLabelProps={{
                    shrink:
                      (watch(`typeOfRate`) ? true : false) ||
                      (router.query.typeOfRate ? true : false),
                  }}
                  label="Type Of Rate"
                  variant="standard"
                  // value={dataInForm && dataInForm.roadZonePremium}
                  {...register("typeOfRate")}
                  error={!!errors.typeOfRate}
                  helperText={
                    errors?.typeOfRate ? errors.typeOfRate.message : null
                  }
                />
              </Grid>
              {watch("typeOfRate") == "Flat" ||
              watch("typeOfRate") == "Quantity" ? (
                ""
              ) : (
                <>
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <TextField
                      id="standard-basic"
                      disabled={true}
                      InputLabelProps={{
                        shrink:
                          (watch(`minValue`) ? true : false) ||
                          (router.query.minValue ? true : false),
                      }}
                      label="Minimum Value"
                      variant="standard"
                      type="number"
                      // value={dataInForm && dataInForm.roadZonePremium}
                      {...register("minValue")}
                      error={!!errors.minValue}
                      helperText={
                        errors?.minValue ? errors.minValue.message : null
                      }
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                    <TextField
                      id="standard-basic"
                      disabled={true}
                      InputLabelProps={{
                        shrink:
                          (watch(`maxValue`) ? true : false) ||
                          (router.query.maxValue ? true : false),
                      }}
                      label="Maximum Value"
                      variant="standard"
                      type="number"
                      // value={dataInForm && dataInForm.roadZonePremium}
                      {...register("maxValue")}
                      error={!!errors.maxValue}
                      helperText={
                        errors?.maxValue ? errors.maxValue.message : null
                      }
                    />
                  </Grid>
                </>
              )}

              {watch("typeOfRate") == "Quantity" ? (
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                  <TextField
                    id="standard-basic"
                    disabled={true}
                    InputLabelProps={{
                      shrink:
                        (watch(`noOfQuantity`) ? true : false) ||
                        (router.query.noOfQuantity ? true : false),
                    }}
                    label="No Of Quantity"
                    variant="standard"
                    type="number"
                    // value={dataInForm && dataInForm.roadZonePremium}
                    {...register("noOfQuantity")}
                    error={!!errors.noOfQuantity}
                    helperText={
                      errors?.noOfQuantity ? errors.noOfQuantity.message : null
                    }
                  />
                </Grid>
              ) : (
                ""
              )}

              <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                <TextField
                  id="standard-basic"
                  disabled={true}
                  InputLabelProps={{
                    shrink:
                      (watch(`rate`) ? true : false) ||
                      (router.query.rate ? true : false),
                  }}
                  label="Rate*"
                  variant="standard"
                  // value={dataInForm && dataInForm.roadZonePremiumFactor}
                  {...register("rate")}
                  error={!!errors.rate}
                  helperText={errors?.rate ? errors.rate.message : null}
                />
              </Grid>
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <FormControl
                  variant="standard"
                  sx={{ m: 1, width: 120 }}
                  error={!!errors.unitKey}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    Unit Type
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        sx={{ width: 250 }}
                        disabled={true}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label="Unit Type"
                      >
                        {unitTypes &&
                          unitTypes.map((unitType, index) => (
                            <MenuItem key={index} value={unitType.id}>
                              {unitType.unitType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="unitKey"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.unitKey ? errors.unitKey.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
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
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <TextField
                  // label={<FormattedLabel id="totalCharges" />}
                  label="Input Value"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("storeValue")}
                  error={!!errors.storeValue}
                  helperText={
                    errors?.storeValue ? errors.storeValue.message : null
                  }
                />
              </Grid>

              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <TextField
                  // label={<FormattedLabel id="totalCharges" />}
                  label="Total Charges"
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  {...register("loi.amount")}
                  error={!!errors.total}
                  helperText={errors?.total ? errors.total.message : null}
                />
              </Grid>
              <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                <TextField
                  disabled={true}
                  InputLabelProps={{ shrink: true }}
                  // label={<FormattedLabel id="totalInWords" />}
                  label="Total in Words"
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
                    Generate LOI
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </ThemeProvider>
      )}
    </>
  );
};

export default LoiGenerationComponent;
