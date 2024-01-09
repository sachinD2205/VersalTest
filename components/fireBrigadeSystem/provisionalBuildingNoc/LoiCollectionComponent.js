import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Stack, ThemeProvider } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import urls from "../../../URLS/urls";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
import router, { useRouter } from "next/router";
import { toast } from "react-toastify";
import Loader from "../../../containers/Layout/components/Loader";

const LoiCollectionComponent = () => {
  // Table Style
  const thTdStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
  };

  const {
    setValue,
    getValues,
    methods,
    watch,
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);
  const [inputState, setInputState] = useState(false);
  // payment Mode
  const [paymentModeName, setPaymentModeName] = useState();
  const [nocTypeEditable, setNocTypeEditable] = useState();
  const [applicableCharages, setApplicableCharages] = useState([]);
  const [total, setTotal] = useState([]);
  const [shrinkState, setShrinkState] = useState(false);

  // Pay
  const pay = () => {};

  useEffect(() => {
    let item = localStorage.getItem("nocType");
    console.log("item", item);
    setNocTypeEditable(item);
  }, []);

  useEffect(() => {
    console.log("1234", router?.query?.id);
    if (router?.query?.id) {
      axios
        .get(
          `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${router?.query?.id}`
        )
        .then((res) => {
          console.log("221297", res?.data);
          if (res.status == 200) {
            // setLoaderTableData(false);
            setApplicableCharages(
              res?.data?.loi?.buildingNocApplicableCharagesDao
            );
            setTotal(res?.data?.loi);
            // reset(res.data);
            console.log("resp.data", res?.data);

            // let _res = res?.data?.map((r, i) => ({
            //   activeFlag: r.activeFlag,

            //   id: r.id,
            //   serialNo: i + 1 + _pageNo * _pageSize,
            // }));
          }
        });
    }
  }, []);

  useEffect(() => {
    console.log("watch", watch("paymentMode"));
  }, [watch("paymentMode")]);

  // LOI Coolection getAll Data

  useEffect(() => {
    // loi generation API Call
    const finalBodyForApi = {
      trnId: getValues("id"),
    };
    console.log("application ID", finalBodyForApi);
    axios
      .post(
        `${urls.FbsURL}/master/rateCharge/getRateForBuildingNoc`,
        finalBodyForApi
      )
      .then((res) => {
        console.log("11", res);
        setApplicableCharages(
          res?.data?.map((charge, i) => {
            return {
              ...charge,
              srNo: i + 1,
            };
          })
        );

        let total = 0;
        let totalGross = 0;
        let totalNocAmount = 0;
        let totalEditableNetNocAmount = 0;
        let totalEditableGrossNocAmount = 0;
        res?.data?.map((charge) => {
          total = total + charge.netBuiltUpAreaAmount;
          totalGross = totalGross + charge.grossBuiltUpAreaAmount;
          totalNocAmount = totalNocAmount + charge.minimumNocAmount;
          // totalEditableNetNocAmount = totalEditableNetNocAmount + charge.finalNetNocAmount;
          totalEditableGrossNocAmount =
            totalEditableGrossNocAmount + charge.finalGrossNocAmount;
        });

        setSum(total);
        setGross(totalGross);
        setNocAmount(totalNocAmount);
        setNetTotal(totalEditableNetNocAmount);
        setGrossTotal(totalEditableGrossNocAmount);
      });
  }, []);

  // Input State
  useEffect(() => {
    setInputState(true);
  }, []);

  const [licenseTypes, setLicenseTypes] = useState([]);

  const getLicenseTypes = () => {
    axios.get(`${urls.HMSURL}/licenseValidity/getAll`).then((r) => {
      setLicenseTypes(
        r.data.licenseValidity.map((row) => ({
          id: row.id,
          licenseType: row.licenseValidity,
          licenseTypeMr: row.licenseValidity,
        }))
      );
    });
  };

  // title
  const [titles, setTitles] = useState();

  // getTitles
  const getTitles = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        }))
      );
    });
  };

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getserviceNames();
    getTitles();
    getLicenseTypes();
    getBankMasters();
    getPaymentMode();
  }, []);

  const [serviceNames, setServiceNames] = useState([]);

  const [valuePaymentMode, setValuePaymentMode] = React.useState();

  const [paymentMode, setPaymentMode] = useState();

  const getPaymentMode = () => {
    axios
      .get(`${urls.FbsURL}/master/paymentMode/getAll`)
      .then((res) => {
        console.log("ttttt", res?.data?.paymentMode);
        setPaymentMode(res?.data?.paymentMode);
      })
      .catch((err) => console.log(err));
  };

  // select
  const getserviceNames = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`)
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
      .catch((err) => {
        console.log(err);
        // toast.success("Error !", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      });
  };

  const [paymentTypes, setPaymentTypes] = useState([]);

  const getPaymentTypes = () => {
    axios.get(`${urls.CFCURL}/master/paymentType/getAll`).then((r) => {
      setPaymentTypes(
        r.data.paymentType.map((row) => ({
          id: row.id,
          paymentType: row.paymentType,
          paymentTypeMr: row.paymentTypeMr,
        }))
      );
    });
  };

  const [paymentModes, setPaymentModes] = useState([]);

  const getPaymentModes = () => {
    axios.get(`${urls.HMSURL}/master/paymentMode/getAll`).then((r) => {
      setPaymentModes(
        r.data.paymentMode.map((row) => ({
          id: row.id,
          paymentMode: row.paymentMode,
          paymentModeMr: row.paymentModeMr,
        }))
      );
    });
  };

  // Bank Masters

  const [bankMasters, setBankMasters] = useState([]);

  // getBankMasters
  const getBankMasters = () => {
    axios.get(`${urls.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(
        r.data.bank.map((row) => ({
          id: row.id,
          bankMaster: row.bankName,
          bankMasterMr: row.bankNameMr,
        }))
      );
    });
  };

  const [loaderTableData, setLoaderTableData] = useState(false);

  // const getLoiCollectionData = () => {
  //   // setLoaderTableData(true);
  //   const appId = router?.query?.data?.id;
  //   axios
  //     .get(
  //       `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${appId}`
  //     )
  //     .then((res) => {
  //       console.log("221297", res?.data);
  //       if (res.status == 200) {
  //         // setLoaderTableData(false);
  //         setApplicableCharages(
  //           res?.data?.loi?.buildingNocApplicableCharagesDao
  //         );
  //         setTotal(res?.data?.loi);
  //         // reset(res.data);
  //         console.log("resp.data", res?.data);

  //         // let _res = res?.data?.map((r, i) => ({
  //         //   activeFlag: r.activeFlag,

  //         //   id: r.id,
  //         //   serialNo: i + 1 + _pageNo * _pageSize,
  //         // }));
  //       }
  //     });
  // };

  let appId;
  appId = getValues("id");
  console.log("appId", appId);

  // useEffect(() => {
  //   appId = getValues("id");

  //   getLoiCollectionData();
  // }, [getValues("id")]);

  const handleNext = (data) => {
    const finalBodyForApi = {
      // ...data,
      role: "LOI_COLLECTION",
      NocId: appId,

      loi: {
        buildingNocApplicableCharagesDao: [...applicableCharages],
      },
      id: appId,
      paymentDetails: {
        rtgsUtrNo: data.rtgsUtrNo,
        modeOfPayment: data.modeOfPayment,
        bankName: data.bankName,
        chequeNo: data.chequeNo,
        chequeDate: data.chequeDate,
        cfcCenter: data.cfcCenter,
        cashDate: data.cashDate,
        onlineUpiID: data.onlineUpiID,
        referenceNo: data.referenceNo,
        onlineDate: data.onlineDate,
        rtgsUtrNo: data.rtgsUtrNo,
        rtgsDate: data.rtgsDate,
        ddNo: data.ddNo,
        ddDate: data.ddDate,
      },
    };
    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/saveApplicationApprove`,
        finalBodyForApi,
        {
          headers: {
            role: "LOI_COLLECTION",
            id: appId,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          finalBodyForApi.id
            ? sweetAlert("LOI !", `LOI Generated successfully ! `, "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push(
            "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
          );
        } else if (res.status == 201) {
          finalBodyForApi.id
            ? sweetAlert("LOI !", "LOI Generated successfully !", "success")
            : sweetAlert("Saved !", "Record Saved successfully !", "success");
          // router.push(
          //   "/FireBrigadeSystem/transactions/provisionalBuildingNoc/scrutiny"
          // );
        }
      });
  };

  useEffect(() => {
    if (getValues("paymentCollection.paymentMode") == "CASH") {
      setValue("paymentCollection.receiptAmount", getValues("loi.total"));
    }
  }, [watch("paymentMode")]);

  // view
  return (
    <>
      <div>
        <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit(handleNext)}>
            <div>
              {/***
            <div
              style={{
                backgroundColor: "#0084ff",
                color: "white",
                fontSize: 19,
                marginTop: 30,
                // marginBottom: 30,
                padding: 8,
                paddingLeft: 30,
                marginLeft: "40px",
                marginRight: "40px",
                borderRadius: 100,
              }}
            >
              <strong>{<FormattedLabel id='loiCollection' />}</strong>
            </div>
            <Grid
              container
              sx={{
                marginTop: 1,
                marginBottom: "15px",
                paddingLeft: "50px",
                align: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >
                <TextField
                  label={<FormattedLabel id='applicationNumber' />}
                  {...register("applicationNumber")}
                  error={!!errors.applicationNumber}
                  helperText={
                    errors?.applicationNumber
                      ? errors.applicationNumber.message
                      : null
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                  marginTop: "20px",
                }}
              >
                <Typography variant='h1'>
                  <strong>
                    <FormattedLabel id='or' />
                  </strong>
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >

                <Stack spacing={12} direction='row'>
                  <TextField
                    label={<FormattedLabel id='loiNO' />}
                    {...register("loi.loiNo")}
                    // error={!!errors.loi.loiNo}
                    // helperText={
                    //   errors?.(loi.loiNo) ? errors.loi.loiNo.message : null
                    // }
                  />
                  <FormControl
                    sx={{ marginTop: 2 }}

                    // error={!!errors.loi.loi.loiDate}
                  >
                    <Controller
                      name='loi.loiDate'
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat='DD/MM/YYYY'
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                <FormattedLabel id='loiDate' />
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
                                size='small'
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
                      {errors?.loiDate ? errors.loiDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItem: "center",
                }}
              >
                <Button variant='contained' sx={{ marginTop: "20px" }}>
                  <FormattedLabel id='search'></FormattedLabel>
                </Button>
              </Grid>
            </Grid>
              */}
              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  {<FormattedLabel id='applicantDetails' />}
                </Box>
              </Box>
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='applicantName' />}
                    variant='standard'
                    {...register("applicantDTLDao.applicantName")}
                    error={!!errors.applicantName}
                    helperText={
                      errors?.applicantName
                        ? errors.applicantName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='applicantMiddleName' />}
                    variant='standard'
                    {...register("applicantDTLDao.applicantMiddleName")}
                    error={!!errors.applicantMiddleName}
                    helperText={
                      errors?.applicantMiddleName
                        ? errors.applicantMiddleName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='applicantLastName' />}
                    variant='standard'
                    {...register("applicantDTLDao.applicantLastName")}
                    error={!!errors.applicantLastName}
                    helperText={
                      errors?.applicantLastName
                        ? errors.applicantLastName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='applicantNameMr' />}
                    variant='standard'
                    {...register("applicantDTLDao.applicantNameMr")}
                    error={!!errors.applicantNameMr}
                    helperText={
                      errors?.applicantNameMr
                        ? errors.applicantNameMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='applicantMiddleNameMr' />}
                    variant='standard'
                    {...register("applicantDTLDao.applicantMiddleNameMr")}
                    error={!!errors.applicantMiddleNameMr}
                    helperText={
                      errors?.applicantMiddleNameMr
                        ? errors.applicantMiddleNameMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='applicantLastNameMr' />}
                    variant='standard'
                    {...register("applicantDTLDao.applicantLastNameMr")}
                    error={!!errors.applicantLastNameMr}
                    helperText={
                      errors?.applicantLastNameMr
                        ? errors.applicantLastNameMr.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                {/* <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id="standard-basic"
                    label={<FormattedLabel id="applicantAddresss" />}
                    variant="standard"
                    {...register("applicantAddress")}
                    error={!!errors.applicantAddress}
                    helperText={
                      errors?.applicantAddress
                        ? errors.applicantAddress.message
                        : null
                    }
                  />
                </Grid> */}
                {/* <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id="standard-basic"
                    label={<FormattedLabel id="applicantAddressMr" />}
                    variant="standard"
                    {...register("applicantAddressMr")}
                    error={!!errors.applicantAddressMr}
                    helperText={
                      errors?.applicantAddressMr
                        ? errors.applicantAddressMr.message
                        : null
                    }
                  />
                </Grid> */}
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='mobileNo' />}
                    variant='standard'
                    {...register("applicantDTLDao.applicantMobileNo")}
                    error={!!errors.mobileNo}
                    helperText={
                      errors?.mobileNo ? errors.mobileNo.message : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    InputLabelProps={{
                      shrink: { shrinkState },
                    }}
                    sx={{ width: "80%" }}
                    id='standard-basic'
                    label={<FormattedLabel id='emailId' />}
                    variant='standard'
                    {...register("applicantDTLDao.applicantEmailId")}
                    error={!!errors.emailId}
                    helperText={errors?.emailId ? errors.emailId.message : null}
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}></Grid>
                <Grid item xs={4} className={styles.feildres}></Grid>
              </Grid>
              <br />
              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  {<FormattedLabel id='loiDetails' />}
                </Box>
              </Box>

              <Grid
                container
                sx={{
                  marginTop: 1,
                  marginBottom: 5,
                  paddingLeft: "50px",
                  align: "center",
                }}
              >
                <Grid item xs={5} md={5} sm={5} xl={5} lg={5}>
                  <TextField
                    sx={{ width: "90%" }}
                    label={<FormattedLabel id='loiNo' />}
                    {...register("loi.loiNO")}
                    error={!!errors.loiNO}
                    helperText={errors?.loiNO ? errors.loiNO.message : null}
                  />
                </Grid>

                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl sx={{ marginTop: 0 }} error={!!errors.loiDate}>
                    <Controller
                      name='loi.loiDate'
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat='DD/MM/YYYY'
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                <FormattedLabel id='loiDate' />
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
                                size='small'
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
                      {errors?.loiDate ? errors.loiDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl
                    variant='standard'
                    sx={{ marginTop: 2 }}
                    error={!!errors.durationOfLicenseValidity}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='durationOfLicenseValidity' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ width: 230 }}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label={
                            <FormattedLabel id='durationOfLicenseValidity' />
                          }
                        >
                          {licenseTypes &&
                            licenseTypes.map((licenseType, index) => (
                              <MenuItem key={index} value={licenseType.id}>
                                {licenseType.licenseType}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='loi.durationOfLicenseValidity'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.licenseType ? errors.licenseType.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid> */}
                {/* <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    label={<FormattedLabel id="totalCharges" />}
                    {...register("loi.allTotal")}
                    error={!!errors.allTotal}
                    helperText={
                      errors?.allTotal ? errors.allTotal.message : null
                    }
                  />
                </Grid> */}
                {/* <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <TextField
                    label={<FormattedLabel id='totalInWords' />}
                    {...register("loi.totalInWordss")}
                    error={!!errors.totalInWordss}
                    helperText={
                      errors?.totalInWordss
                        ? errors.totalInWordss.message
                        : null
                    }
                  />
                </Grid> */}
              </Grid>

              <Grid
                container
                sx={{
                  marginTop: 1,
                  marginBottom: 5,
                  paddingLeft: "50px",
                  align: "center",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid black",
                    padding: 8,
                  }}
                  //  className={styles.openingTable}
                >
                  <thead>
                    <tr>
                      <th style={thTdStyle}>Sr no.</th>
                      <th style={thTdStyle}>Building Name</th>
                      <th style={thTdStyle}>Occupancy Type</th>
                      <th style={thTdStyle}>Net Built Up Area</th>
                      <th style={thTdStyle}>Gross Built Up Area</th>
                      <th style={thTdStyle}>Prishishatha</th>
                      <th style={thTdStyle}>Building Height (from)</th>
                      <th style={thTdStyle}>Building height (to)</th>
                      <th style={thTdStyle}>Rate (sq.mr)</th>
                      <th style={thTdStyle}>Net Built Up Area Amount</th>
                      <th style={thTdStyle}>Gross Built Up Area Amount</th>
                      <th style={thTdStyle}>Minimum Rate for NOC</th>
                      {/* <th> Rate for NOC</th> */}
                      {nocTypeEditable === "net" && (
                        <th style={thTdStyle}> Final Net Built Up Area</th>
                      )}

                      {nocTypeEditable === "gross" && (
                        <th style={thTdStyle}> Final Gross Built Up Area</th>
                      )}
                      {/* {nocCollectionType === "grossBuiltUpArea" && (
                  <th> Final Gross Built Up Area</th>
                  )} */}

                      {/* <th disabled={nocTypeEditable==="gross"}> Final Net Built Up Area</th>
                  <th disabled={nocTypeEditable==="net"}> Final Gross Built Up Area</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {loaderTableData && <Loader />}
                    {applicableCharages?.map((r, i) => (
                      <>
                        <tr key={i}>
                          <td style={thTdStyle}>{i + 1}</td>
                          <td style={thTdStyle}>{r.buildingName}</td>
                          <td style={thTdStyle}>{r.occupancyType}</td>
                          <td style={thTdStyle}>{r.netBuiltUpArea}</td>
                          <td style={thTdStyle}>{r.grossBuiltUpArea}</td>
                          <td style={thTdStyle}>{r.parishishtha}</td>
                          <td style={thTdStyle}>{r.buildingHeightFrom}</td>
                          <td style={thTdStyle}>{r.buildingHeightTo}</td>
                          <td style={thTdStyle}>{r.minimumRate}</td>
                          <td style={thTdStyle}>{r.netBuiltUpAreaAmount}</td>
                          <td style={thTdStyle}>{r.grossBuiltUpAreaAmount}</td>
                          <td style={thTdStyle}>{r.minimumNocAmount}</td>
                          {nocTypeEditable === "net" && (
                            <td style={thTdStyle}>{r.finalNetNocAmount}</td>
                          )}
                          {nocTypeEditable === "gross" && (
                            <td style={thTdStyle}>{r.finalGrossNocAmount}</td>
                          )}
                          {/* <td>
                        <input
                          className={styles.editableTextField}
                          //  width="50"
                          type="number"
                          min="0"
                          value={r.totalEditableNocAmount}
                          onChange={(event) =>
                            handleChange(event.target.value, i)
                          }
                        />
                      </td> */}

                          {/* {nocTypeEditable === "net" && (
                            <td>
                              <input
                                // className={styles.editableTextField}
                                //  width="50"
                                type='number'
                                min='0'
                                value={r.finalNetNocAmount}
                                // onChange={(event) =>
                                //   handleChange(event.target.value, i)
                                // }
                              />
                            </td>
                          )} */}

                          {/* {nocTypeEditable === "gross" && (
                            <td>
                              <input
                                // className={styles.editableTextField}
                                //  width="50"
                                type='number'
                                min='0'
                                value={r.finalGrossNocAmount}
                                // onChange={(event) =>
                                //   handleChange(event.target.value, i)
                                // }
                              />
                            </td>
                          )} */}
                        </tr>
                      </>
                    ))}

                    <tr>
                      <td
                        style={{
                          textAlign: "right",
                        }}
                        colSpan={8}
                      ></td>
                      <td
                        style={{
                          textAlign: "center",
                        }}
                      >
                        Total
                      </td>
                      <td style={thTdStyle}>
                        <b>{total.totalNetbuiltUpArea}</b>
                      </td>
                      <td style={thTdStyle}>
                        {" "}
                        <b>{total.totalGrossbuiltUpArea}</b>
                      </td>
                      <td style={thTdStyle}>
                        <b>{total.totalNocAmount}</b>
                      </td>
                      <td style={thTdStyle}>
                        <b>{total.totalNocAmount}</b>
                      </td>
                    </tr>

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

              <Box className={styles.tableHead}>
                <Box className={styles.feildHead}>
                  {<FormattedLabel id='paymentDetails' />}
                </Box>
              </Box>
              {/* <Grid
                container
                sx={{
                  marginTop: 1,
                  marginBottom: 5,
                  paddingLeft: "50px",
                  align: "center",
                }}
              >
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl
                    error={!!errors.paymentType}
                    sx={{ marginTop: 2 }}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='paymentType' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "230px" }}
                          // // dissabled={inputState}
                          autoFocus
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          label=<FormattedLabel id='paymentType' />
                          id='demo-simple-select-standard'
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {paymentTypes &&
                            paymentTypes.map((paymentType, index) => (
                              <MenuItem
                                key={index}
                                value={paymentType.paymentType}
                              >
                                {language == "en"
                                  ? paymentType?.paymentType
                                  : paymentType?.paymentTypeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='paymentCollection.paymentType'
                      control={control}
                      defaultValue=''
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                  <FormControl
                    error={!!errors.paymentMode}
                    sx={{ marginTop: 2 }}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      {<FormattedLabel id='paymentMode' />}
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ minWidth: "230px" }}
                          // // dissabled={inputState}
                          autoFocus
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id='paymentMode' />}
                          id='demo-simple-select-standard'
                          labelId="id='demo-simple-select-standard-label'"
                        >
                          {paymentModes &&
                            paymentModes.map((paymentMode, index) => (
                              <MenuItem
                                key={index}
                                value={paymentMode.paymentMode}
                              >
                                {language == "en"
                                  ? paymentMode?.paymentMode
                                  : paymentMode?.paymentModeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='paymentCollection.paymentMode'
                      control={control}
                      defaultValue=''
                    />
                  </FormControl>
                </Grid>

                {watch("paymentCollection.paymentMode") == "DD" && (
                  <>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='bankName' />}
                        variant='standard'
                        {...register("paymentCollection.bankName")}
                        error={!!errors.bankName}
                        helperText={
                          errors?.bankName ? errors.bankName.message : null
                        }
                      />
                    </Grid>

                
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <TextField
                    disabled={inputState}
                    id='standard-basic'
                    label={<FormattedLabel id='branchName' />}
                    variant='standard'
                    {...register("branchName")}
                    error={!!errors.branchName}
                    helperText={
                      errors?.branchName ? errors.branchName.message : null
                    }
                  />
                </Grid>
            
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='bankAccountNo' />}
                        variant='standard'
                        {...register("paymentCollection.bankAccountNo")}
                        error={!!errors.bankAccountNo}
                        helperText={
                          errors?.bankAccountNo
                            ? errors.bankAccountNo.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='ddNo' />}
                        variant='standard'
                        {...register("paymentCollection.dDNo")}
                        error={!!errors.dDNo}
                        helperText={errors?.dDNo ? errors.dDNo.message : null}
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.dDDate}
                      >
                        <Controller
                          name='paymentCollection.dDDate'
                          control={control}
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    <FormattedLabel id='ddDate' />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.dDDate ? errors.dDDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}

                {watch("paymentCollection.paymentMode") == "CASH" && (
                  <>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='receiptAmount' />}
                        variant='standard'
                        {...register("paymentCollection.receiptAmount")}
                        error={!!errors.receiptAmount}
                        helperText={
                          errors?.receiptAmount
                            ? errors.receiptAmount.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <TextField
                        // disabled={inputState}
                        id='standard-basic'
                        label={<FormattedLabel id='receiptNumber' />}
                        variant='standard'
                        {...register("paymentCollection.receiptNo")}
                        error={!!errors.receiptNo}
                        helperText={
                          errors?.receiptNo ? errors.receiptNo.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <FormControl
                        sx={{ marginTop: 0 }}
                        error={!!errors.receiptDate}
                      >
                        <Controller
                          name='paymentCollection.receiptDate'
                          control={control}
                          defaultValue={moment()}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16, marginTop: 2 }}>
                                    <FormattedLabel id='receiptDate' />
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.receiptDate
                            ? errors.receiptDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid> */}

              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <FormControl
                    sx={{ width: "80%" }}
                    variant='standard'
                    error={!!errors.modeOfPayment}
                  >
                    <InputLabel id='demo-simple-select-standard-label'>
                      Payment Mode
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            setValuePaymentMode(value.target.value);
                          }}
                          label='Payment Mode'
                        >
                          {paymentMode &&
                            paymentMode.map((mode, index) => (
                              <MenuItem key={mode.id} value={mode.id}>
                                {language == "en"
                                  ? mode.paymentMode
                                  : mode.paymentModeMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      name='modeOfPayment'
                      control={control}
                      defaultValue=''
                    />
                    <FormHelperText>
                      {errors?.modeOfPayment
                        ? errors.modeOfPayment.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={4} className={styles.feildres}></Grid>
                <Grid item xs={4} className={styles.feildres}></Grid>
              </Grid>
              {/* Cheque */}
              {valuePaymentMode == 2 || valuePaymentMode == "Cheque" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='Bank Name'
                        variant='standard'
                        {...register("bankName")}
                        error={!!errors.bankName}
                        helperText={
                          errors?.bankName ? errors.bankName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='Cheque No'
                        variant='standard'
                        {...register("chequeNo")}
                        error={!!errors.chequeNo}
                        helperText={
                          errors?.chequeNo ? errors.chequeNo.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.chequeDate}
                      >
                        <Controller
                          control={control}
                          name='chequeDate'
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    cheque Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.chequeDate
                            ? errors.chequeDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* Cash */}
              {valuePaymentMode == 1 || valuePaymentMode == "Cash" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='CFC Center/ Counter'
                        variant='standard'
                        {...register("cfcCenter")}
                        error={!!errors.cfcCenter}
                        helperText={
                          errors?.cfcCenter ? errors.cfcCenter.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.cashDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(cDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name='cashDate'
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Cash Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.cashDate ? errors.cashDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* Online */}
              {valuePaymentMode == 3 || valuePaymentMode == "Online" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='UPI ID'
                        variant='standard'
                        {...register("onlineUpiID")}
                        error={!!errors.onlineUpiID}
                        helperText={
                          errors?.onlineUpiID
                            ? errors.onlineUpiID.message
                            : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='bankName'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='Reference Number'
                        variant='standard'
                        {...register("referenceNo")}
                        error={!!errors.referenceNo}
                        helperText={
                          errors?.referenceNo
                            ? errors.referenceNo.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.onlineDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(onlineDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name='onlineDate'
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    Online Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.onlineDate
                            ? errors.onlineDate.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* RTGS */}
              {valuePaymentMode == 4 || valuePaymentMode == "RTGS" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='standard-basic'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='UTR ID'
                        variant='standard'
                        {...register("rtgsUtrNo")}
                        error={!!errors.rtgsUtrNo}
                        helperText={
                          errors?.rtgsUtrNo ? errors.rtgsUtrNo.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.rtgsDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(rtgsDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name='rtgsDate'
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>
                                    RTGS Date
                                  </span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.rtgsDate ? errors.rtgsDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* DD */}
              {valuePaymentMode == 5 ||
              valuePaymentMode == "DD- demand draft" ? (
                <>
                  <Grid
                    container
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    className={styles.feildres}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "80%" }}
                        id='bankName'
                        //   label={<FormattedLabel id="informerLastName" />}
                        label='DD Number'
                        variant='standard'
                        {...register("ddNo")}
                        error={!!errors.ddNo}
                        helperText={errors?.ddNo ? errors.ddNo.message : null}
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        sx={{ width: "80%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.ddDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(ddDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name='ddDate'
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat='DD/MM/YYYY'
                                label={
                                  <span style={{ fontSize: 16 }}>DD Date</span>
                                }
                                value={field.value}
                                onChange={(date) =>
                                  field.onChange(
                                    moment(date).format("YYYY-MM-DD")
                                  )
                                }
                                selected={field.value}
                                center
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    size='small'
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
                          {errors?.ddDate ? errors.ddDate.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}></Grid>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {/* Button */}
              <br />
              <br />
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Stack
                    direction='row'
                    spacing='5'
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button size='small' type='submit'>
                      Submit LOI{" "}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </div>
          </form>
        </ThemeProvider>
      </div>
    </>
  );
};

export default LoiCollectionComponent;
