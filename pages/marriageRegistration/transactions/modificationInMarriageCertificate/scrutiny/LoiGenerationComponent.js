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
import { DataGrid } from "@mui/x-data-grid";
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
  const [noOfCopies, setNoOfCopies] = useState(0);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "marriageServiceCharges", // unique name for your Field Array
    },
  );
  const language = useSelector((state) => state?.labels.language);

  // lOI GENERATION PREVIEW
  // const language = useSelector((state) => state?.labels.language);

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
  let user = useSelector((state) => state.user.user);
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
  };

  const handleNoOfCopiesChange = (value) => {
    console.log("value of no of cp", value);
    setNoOfCopies(value);
    setValue(
      "marriageServiceCharges",
      watch("marriageServiceCharges")?.map((x) => {
        return {
          ...x,
          totalAmount: x.id == 8 ? x.rate * value : x.amount,
        };
      }),
    );

    let finalAmount = 0;
    watch("marriageServiceCharges")?.map((x) => {
      finalAmount += x.totalAmount;
    });
    setValue("loi.amount", finalAmount);
    setValue("loi.totalInWords", toWords.convert(finalAmount));
    // Number(data?.serviceCharge + data?.penaltyCharge) +
    //   Number(watch("noOfCopies")),
  };

  // const getServiceCharges = () => {
  //   if (getValues('serviceId')) {
  //     axios
  //       .get(
  //         `${
  //           urls.CFCURL
  //         }/master/servicecharges/getByServiceId?serviceId=${getValues(
  //           'serviceId',
  //         )}`,
  //       )
  //       .then((r) => {
  //         setValue('marriageServiceCharges', r.data.serviceCharge)
  //         setServiceCharges(r.data.serviceCharge)
  //         console.log('marriageServiceCharges', r.data.serviceCharge)
  //       })
  //   }
  // }

  const getServiceCharges = () => {
    axios
      .get(
        `${urls.MR}/master/mstMarriageServiceCharges/getByServiceId?serviceId=12&trnId=${router?.query?.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        // console.log('r.data.status', r)
        if (r.status === 200) {
          setValue(
            "marriageServiceCharges",
            r?.data?.marriageServiceCharges.length > 0
              ? r?.data?.marriageServiceCharges?.map((x, y) => {
                  return {
                    ...x,
                    srNo: y + 1,
                    // id: null,
                    serviceChargesId: x.id,
                    applicationId: router?.query?.applicationId,
                    // durationFrom: x.durationFrom != null ? x.durationFrom : "-",
                    // durationTo: x.durationTo != null ? x.durationTo : "-",
                    rate: x.amount,
                    totalAmount: x.id == 5 ? x.amount * noOfCopies : x.amount,
                  };
                })
              : [],
          );

          let finalAmount = 0;

          watch("marriageServiceCharges")?.map((x) => {
            finalAmount += x.totalAmount;
          });

          setValue("loi.amount", finalAmount);

          setValue("loi.totalInWords", toWords.convert(finalAmount));
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getLoiGenerationData = () => {
    if (
      router?.query?.id != null &&
      router?.query?.id != undefined &&
      router?.query?.id != ""
    ) {
      axios
        .get(
          `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((r) => {
          // console.log('r.data.status', r)
          if (r.status === 200) {
            setServiceId(r.data.serviceId);
            console.log("resp.data", r.data);
            reset(r.data);
            setValue("serviceName", r.data.serviceId);
            getServiceCharges();

            setValue("penaltyCharge", r.data.penaltyCharge);
            setValue("serviceCharge", r.data.serviceCharge);

            setValue("serviceName", r.data.serviceId);
            console.log("resp.data", r.data);
            reset({ ...r?.data, exclude: ["marriageServiceCharges"] });
            setServiceId(r.data.serviceId);
            getServiceCharges();
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  // useEffect(() => {
  //   // getserviceNames();
  //   if (router?.query?.applicationId) getLoiGenerationData();
  //   setValue("marriageServiceCharges", []);
  // }, []);
  useEffect(() => {
    console.log("router.query.serviceId", router.query.serviceId);
    if (router?.query?.serviceId) {
      setServiceId(router.query.serviceId);
      getserviceNames();
      if (router?.query?.id) getLoiGenerationData();
      setValue("marriageServiceCharges", []);
    }
  }, []);

  // useEffect(() => {
  //   getServiceCharges();
  // }, [serviceId]);

  // useEffect(() => {
  //   let total = 0;
  //   serviceCharge.forEach((data) => {
  //     total += data.amount;
  //   });
  //   setValue("loi.amount", total);
  //   setValue("loi.totalInWords", toWords.convert(total));
  // }, [serviceCharge]);

  // Handle Next
  const handleNext = (data) => {
    let finalBodyForApi = {
      ...data,
      role: router?.query?.role,
      payment: null,
    };

    axios
      .post(
        `${urls.MR}/transaction/modOfMarCertificate/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
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
              "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationReciptmarathi",
            query: {
              applicationId: getValues("id"),
              serviceId: 12,
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
              "/marriageRegistration/transactions/modificationInMarriageCertificate/scrutiny/LoiGenerationReciptmarathi",
            query: {
              applicationId: getValues("id"),
              serviceId: 12,
            },
          });
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const columns = [
    {
      field: "srNo",
      headerName: language == "en" ? "Sr.No." : "अं.क्र.",
      flex: 1,
    },

    {
      field: "chargeName",
      headerName: language == "en" ? "Charge Name" : "अं.क्र.",
      flex: 1,
    },

    {
      field: "chargeType",
      headerName: language == "en" ? "Charge Type" : "अं.क्र.",
      flex: 1,
    },

    {
      field: "durationFrom",
      headerName:
        language == "en" ? "Duration From" : "पासून कालावधी(दिवसांमध्ये)",
      flex: 1,
    },

    {
      field: "durationTo",
      headerName:
        language == "en" ? "Duration To" : "पर्यंत कालावधी(दिवसांमध्ये)",
      flex: 1,
    },

    {
      field: "rate",
      headerName: language == "en" ? "Rate" : "एकुण रक्कम",
      flex: 1,
    },
    {
      field: "totalAmount",
      headerName: language == "en" ? "Total Amount" : "एकुण रक्कम",
      flex: 1,
    },
  ];
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
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              {/* <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="serviceName" />}
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
              </FormControl> */}

              <TextField
                style={{ width: 280 }}
                InputLabelProps={{
                  shrink:
                    (watch("serviceName") ? true : false) ||
                    (router?.query?.serviceName ? true : false),
                }}
                disabled={true}
                label={<FormattedLabel id="serviceName" />}
                // label="Application No."
                {...register("serviceName")}
                error={!!errors.serviceName}
                helperText={
                  errors?.serviceName ? errors.serviceName.message : null
                }
              />
            </Grid>

            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <TextField
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
                    (watch("afName") ? true : false) ||
                    (router?.query?.afName ? true : false),
                }}
                id="standard-basic"
                // disabled={inputState}
                label={<FormattedLabel id="firstName" />}
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
                label={<FormattedLabel id="middleName" />}
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
                label={<FormattedLabel id="lastName" />}
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
                label={<FormattedLabel id="email" />}
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
                label={<FormattedLabel id="mobileNo" />}
                {...register("amobileNo")}
                error={!!errors.amobileNo}
                helperText={errors?.amobileNo ? errors.amobileNo.message : null}
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
          {serviceCharge.length > 0 && (
            <>
              {fields.map((serviceChargeId, index) => {
                return (
                  <Grid
                    container
                    key={index}
                    sx={{
                      paddingLeft: "50px",
                      align: "center",
                    }}
                  >
                    <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
                      <TextField
                        id="standard-basic"
                        key={serviceChargeId.id}
                        disabled={true}
                        label={<FormattedLabel id="serviceChargeTypeName" />}
                        {...register(
                          `marriageServiceCharges.${index}.serviceChargeTypeName`,
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
                        sx={{ width: "240px" }}
                        id="standard-basic"
                        disabled={true}
                        key={serviceChargeId.id}
                        label={<FormattedLabel id="chargeName" />}
                        {...register(
                          `marriageServiceCharges.${index}.chargeName`,
                        )}
                        // error={!!errors.charge}
                        // helperText={errors?.charge ? errors.charge.message : null}
                      />
                    </Grid>
                    <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                      <TextField
                        sx={{ width: "250px" }}
                        id="standard-basic"
                        disabled={true}
                        key={serviceChargeId.id}
                        label={<FormattedLabel id="amount" />}
                        {...register(`marriageServiceCharges.${index}.amount`)}
                        // error={!!errors.amount}
                        // helperText={errors?.amount ? errors.amount.message : null}
                      />
                    </Grid>
                  </Grid>
                );
              })}
            </>
          )}
          {/* <Grid
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
                {...register("loi.amount")}
                error={!!errors.total}
                helperText={errors?.total ? errors.total.message : null}
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
          </Grid> */}

          <DataGrid
            getRowId={(row) => row.srNo}
            sx={{
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 2,
              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            density="compact"
            autoHeight
            scrollbarSize={17}
            rows={
              watch("marriageServiceCharges")
                ? watch("marriageServiceCharges")
                : []
            }
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />

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
              <FormControl
                // error={!!errors.loi.noOfCopies}
                sx={{ marginTop: 2 }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="noOfCopies" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ minWidth: "230px", width: "200px" }}
                      autoFocus
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value),
                          handleNoOfCopiesChange(value.target.value);
                      }}
                      label="No. of Copies*"
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={6}>6</MenuItem>
                      <MenuItem value={7}>7</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                      <MenuItem value={9}>9</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                    </Select>
                  )}
                  name="loi.noOfCopies"
                  control={control}
                  defaultValue={noOfCopies}
                />
                {/* <FormHelperText>
                  {errors?.loi.noOfCopies
                    ? errors.loi.noOfCopies.message
                    : null}
                </FormHelperText> */}
              </FormControl>
            </Grid>

            <Grid item xs={4} md={4} sm={4} xl={4} lg={4}>
              <TextField
                label={<FormattedLabel id="totalCharges" />}
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
                >
                  <FormattedLabel id="generateLoi" />
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
