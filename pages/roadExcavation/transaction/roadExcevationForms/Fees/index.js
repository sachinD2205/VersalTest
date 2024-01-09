import { ThemeProvider } from "@emotion/react";
import React, { useEffect, useState } from "react";
import theme from "../../../../../theme";
import * as yup from "yup";
import router from "next/router";

import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import styles from "./view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Unstable_Grid2";
import { yupResolver } from "@hookform/resolvers/yup";


import UploadButton from "../../../../../components/fileUpload/UploadButton";
// import { paymentSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
// import { paymentSchema } from "../../../../../containers/schema/roadExcavationSchema/roadExcavationNOCPermission";
import urls from "../../../../../URLS/urls";
import axios from "axios";
import FileTable from "../../../../../components/roadExcevation/FileUpload/FileTable";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(yup.object().shape({ ...paymentSchema })),
    // mode: "onSubmit",
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "witnesses", // unique name for your Field Array
    }
  );

  console.log(":fields", fields);
  const language = useSelector((store) => store.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);
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
  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let loggedInUser = localStorage.getItem("loggedInUser");

  //clear
  const [dataSource, setdataSource] = useState({});
  const [typeATotalAmount, settypeATotalAmount] = useState();
  const [typeBTotalAmount, settypeBTotalAmount] = useState();
  const [TotalAmount, setTotalAmount] = useState();
  const userToken = useGetToken();
  const [btnSaveText, setbtnSaveText] = useState("Save");
  const [paymentMode, setPaymentMode] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  let typeOfServicesList = [
    { value: 1, lable: "OFC" },
    { value: 2, lable: "GAS Line" },
    { value: 3, lable: "Electricity Cable" },
    { value: 4, lable: "Drainage" },
    { value: 5, lable: "Water Line" },
    { value: 6, lable: "CCTV" },
    { value: 7, lable: "Other" },
  ];

  const clearButton = () => {
    console.log("clear");
    reset({
      ...resetValuesClear,
    });
  };
  const exitButton = () => {
    router.push("/dashboard");
  };

  //assigning value to fields
  useEffect(() => {
    let res = dataSource;
    console.log("payyyyyy", res );
    setValue("applicationNo", res ? res?.applicationNumber : "-");
    setValue("applicationId", res ? res?.id : "-");
    // setValue("typesOfServices", res ? res?.typesOfServices : "-");
    setValue("typesOfServices", res ? typeOfServicesList?.find((data) => data?.value == res?.typesOfServices)?.lable : "-");
    setValue("applicationDetails", res ? res?.trnLoiDao?.loiNo : "-");
    setValue("loiId", res ? res?.trnLoiDao?.id : "-");
    // setValue("companyName", res ? res?.companyName : "-");
    setValue(
      "applicantNameAdd",
      res ? `${res?.firstName} ${res?.middleName} ${res?.lastName}` : "-"
    );
    settypeATotalAmount( res?.trnLoiDao?.typeATotalAmount);
    settypeBTotalAmount( res?.trnLoiDao?.typeBTotalAmount);
    setTotalAmount( res?.trnLoiDao?.finalTotalAmount);
  }, [dataSource]);

  //get details

  const getApplicationData = (id) => {
    console.log("aaaaaa", id);
    if (id) {
      axios
        .get(
          `${urls.RENPURL}/trnExcavationRoadCpmpletion/getDataById?id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          let result = r.data;
          setdataSource(result);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  useEffect(() => {
    getApplicationData(router.query.id);
  }, [router.query.id]);
  //common Api start
  const getPaymentMode = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.CFCURL}/master/paymentMode/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },        
      })
      .then((r) => {
        let result = r.data.paymentMode;
        setPaymentMode(result);
        console.log("paymentMode", r);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getPaymentType = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
        },
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        
      })
      .then((r) => {
        let result = r.data.paymentType;
        setPaymentType(result);
        console.log("paymentType", result);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    getPaymentMode();
    getPaymentType();
  }, []);
  //common Api end

  // Reset Values Clear
  const resetValuesClear = {
    companyName: "",
    roadType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    landlineNo: "",
    mobileNo: "",
    email: "",
    eligibleForSchemeYn: "",
    mainScheme: "",
    subScheme: "",
    permitPeriod: "",
    scopeOfWork: "",
    startLat: "",
    endLat: "",
    startLng: "",
    endLng: "",
    locationSameAsPcmcOrderYn: "",
    locationRemark: "",
    lengthSameAsPcmcOrderYn: "",
    lengthRemark: "",
    depthSameAsPcmcOrderYn: "",
    depthRemark: "",
    widthSameAsPcmcOrderYn: "",
    widthRemark: "",
  };

  //for date start
  const date = new Date();

  let currentDay = String(date.getDate()).padStart(2, "0");

  let currentMonth = String(date.getMonth() + 1).padStart(2, "0");

  let currentYear = date.getFullYear();

  // we will display the date as DD-MM-YYYY

  let currentDate = `${currentDay}-${currentMonth}-${currentYear}`;

  console.log("The current date is " + currentDate);
  //for date end

  let onSubmitFunc = (formData) => {
    console.log("onSubmitFunc", formData);
    let body = {
      id: router.query.id,
      role: "LOI_COLLECTION",
      trnPaymentCollectionDao: {
        ...formData,
      },
    };
    if (btnSaveText === "Save") {
      if (loggedInUser === "citizenUser") {
        const tempData = axios
          .post(
            `${urls.RENPURL}/trnExcavationRoadCpmpletion/saveApprove`,
            body,
            {
              headers: {
                UserId: user.id,
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 201 || res.status == 200) {
              sweetAlert("Saved!", "Payment Details Get !", "success");
              router.push("/dashboard");
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    }
  };
  // const getToPaymentGateway = (payDetail) => {
  //   // return (
  //   //   <form id="nonseamless" method="post" name="redirect" action={payDetail.url}>
  //   //     <input type="hidden" id="encRequest" name="encRequest" value={payDetail.encRequest}></input>
  //   //     <input type="hidden" id="access_code" name="access_code" value={payDetail.access_code}></input>
  //   //     {/* <script language="javascript">{document.redirect.submit()}</script> */}
  //   //     <script language="javascript">{dispatchEvent(new Event("submit"))}</script>

  //   //   </form>
  //   // )
  //   document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
  //   <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
  //   <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
  //   document.getElementById("dynForm").submit();
  // };
    // getToPaymentGateWay
    const getToPaymentGateway = (payDetail) => {
      console.log("payDetail", payDetail);
      document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
      </form>`;
      document.getElementById("dynForm").submit();
    };
  
  const handlePay = (fromData) => {
    // setValue("payment.amount", dataa?.loi?.amount);
    console.log(" dataa?.id", watch("paymentType"));

    if (watch("paymentType") === 2) {
      console.log("offline");

      let ccAvenueKitLtp = null;
      switch (location.hostname) {
        case "localhost":
          ccAvenueKitLtp = "L";
          break;
        case "noncoredev.pcmcindia.gov.in":
          ccAvenueKitLtp = "T";
          break;
        case "noncoreuat.pcmcindia.gov.in":
          ccAvenueKitLtp = "T";
          break;
        default:
          ccAvenueKitLtp = "L";
          break;
      }
      let testBody = {
        currency: "INR",
        language: "EN",
        moduleId: "RE",
        amount: TotalAmount,
        divertPageLink: "/roadExcavation/pgSuccess",
        loiId: getValues("loiId"),
        loiNo: getValues("applicationDetails"),
        ccAvenueKitLtp: ccAvenueKitLtp,
        serviceId: router?.query?.serviceId,
        applicationId: Number(getValues("applicationId")),
        domain: window.location.hostname,
        // applicationId:router?.query?.applicationNumber
      };

      console.log("testBody", testBody);

      axios
        .post(
          // `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
          `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
          testBody,{
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200 || res.status == 201) {
            let tempBody = {
              encRequest: res.data.encRequest,
              access_code: res.data.access_code,
            };

            // let urltemp = res.data.url;
            // window.location(urltemp);

            // setPayDetail(res.data)
            localStorage.setItem("selectedServiceId", 142);
            localStorage.setItem(
              "selectedApplicationId",
              testBody.applicationId
            );
            getToPaymentGateway(res.data);

            // router.push(urltemp)
            // router.push({
            //   pathname:
            //   urltemp,
            //   query:tempBody,
            // })
            // axios
            //   .post(
            //     `${urltemp}`,
            //     tempBody,
            //   )
            //   .then((res1) => {
            //     swal('Payement Screen')

            //   })
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    } else {
      // console.log("offline",formData);

      let body = {
        id: router.query.id,
        role: "LOI_COLLECTION",
        trnPaymentCollectionDao: {
          ...fromData,
        },
      };
      axios
      .post(
        `${urls.RENPURL}/trnExcavationRoadCpmpletion/saveApprove`,
        body,
        {
          headers: {
            UserId: user.id,
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 201 || res.status == 200) {
          sweetAlert("Saved!", "Payment Details Get !", "success");
          router.push("/dashboard");
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }
}

  return (
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          marginTop: "50px",
          marginBottom: "80px",
        }}
        elevation={2}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              <FormattedLabel id="collectionFeesPenalty" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit(onSubmitFunc)}>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "end",
                marginRight: "65px",
              }}
            >
              <TextField
                autoFocus
                style={{ backgroundColor: "white", width: "250px" }}
                id="date"
                name="date"
                label={<FormattedLabel id="date" />}
                // label="Date"
                variant="standard"
                //   {...register("date")}
                value={currentDate}
                error={!!errors.date}
                helperText={errors?.date ? errors.date.message : null}
              />
            </Grid>

            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicationNo"
                  name="applicationNo"
                  label={<FormattedLabel id="applicationNo" />}
                  // label="application / LOI number"
                  variant="standard"
                  value={watch("applicationNo")}
                  InputLabelProps={{
                    shrink: watch("applicationNo") ? true : false,
                  }}
                  error={!!errors.applicationNo}
                  helperText={
                    errors?.applicationNo ? errors.applicationNo.message : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="typesOfServices"
                  name="typesOfServices"
                  label={language=="en"?"Service Name":"सेवेचे नाव"}
                  // label="application / LOI number"
                  variant="standard"
                  value={watch("typesOfServices")}
                  InputLabelProps={{
                    shrink: watch("typesOfServices") ? true : false,
                  }}
                  error={!!errors.typesOfServices}
                  helperText={
                    errors?.typesOfServices ? errors.typesOfServices.message : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicantNameAdd"
                  name="applicantNameAdd"
                  label={<FormattedLabel id="fullName" />}
                  // label="applicantNameAdd"
                  variant="standard"
                  InputLabelProps={{
                    shrink: watch("applicationNo") ? true : false,
                  }}
                  value={watch("applicantNameAdd")}
                  error={!!errors.applicantNameAdd}
                  helperText={
                    errors?.applicantNameAdd
                      ? errors.applicantNameAdd.message
                      : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="applicationDetails"
                  name="applicationDetails"
                  // label="applicationDetails"
                  // label={<FormattedLabel id="applicationDetails" />}
                  label="Application Detail (LOI Number)"
                  variant="standard"
                  value={watch("applicationDetails")}
                  InputLabelProps={{
                    shrink: watch("applicationDetails") ? true : false,
                  }}
                  //   {...register("applicationDetails")}
                  error={!!errors.applicationDetails}
                  helperText={
                    errors?.applicationDetails
                      ? errors.applicationDetails.message
                      : null
                  }
                />
              </Grid>

              {/* ////////////////////////////////////////// */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <TextField
                  sx={{ width: 250 }}
                  id="duePendingAmount"
                  name="duePendingAmount"
                  label={<FormattedLabel id="duePendingAmount" />}
                  // label="Dues Pending Amount"
                  variant="standard"
                  //   {...register("duePendingAmount")}
                  error={!!errors.duePendingAmount}
                  helperText={
                    errors?.duePendingAmount
                      ? errors.duePendingAmount.message
                      : null
                  }
                />
              </Grid>
              {/* ////////////////////////////////////////// */}
            </Grid>

            {/* /////////////////////////////////////////////////////////////////////////////////////// */}
            <Grid
              container
              // spacing={2}
              style={{
                paddingBottom: "20px",
                display: "flex",
                alignItems: "center",
                // border: "solid 2px black",
                marginTop: "20px",
              }}
            >
              {/* ////////////////////////////////////////// */}
              {/* <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop:"20px"
                }}
              >
                <FormControl xs={12}
                  sm={6}
                  md={4} error={!!errors.wardId}>
                  <InputLabel><FormattedLabel id="chargeTypeName" /></InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        fullWidth
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        variant="standard"
                      >

                        <MenuItem value={"chargeTypeName1"}>chargeTypeName1</MenuItem>
                        <MenuItem value={"chargeTypeName2"}>chargeTypeName2</MenuItem>
                        <MenuItem value={"chargeTypeName3"}>chargeTypeName3</MenuItem>
                        <MenuItem value={"chargeTypeName4"}>chargeTypeName4</MenuItem>
                      </Select>
                    )}
                    name="chargeTypeName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.chargeTypeName ? errors.chargeTypeName.message : null}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              > <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="amount" />}
                  // variant="outlined"
                  variant="standard"
                //   {...register("amount")}
                  error={!!errors.amount}
                  helperText={errors?.amount ? errors.amount.message : null}
                /></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              > <TextField
                  autoFocus
                  style={{ backgroundColor: "white", width: "250px" }}
                  id="outlined-basic"
                  label={<FormattedLabel id="totalAmount" />}
                  // variant="outlined"
                  variant="standard"
                //   {...register("totalAmount")}
                  error={!!errors.totalAmount}
                  helperText={errors?.totalAmount ? errors.totalAmount.message : null}
                /></Grid> */}
              <table className={styles.table} style={{ marginTop: "30px" }}>
                <tr className={styles.tr}> 
                <th className={styles.th}>{language == "en"?"Sr.No":"अ.क्र."}</th>                 
                  <th className={styles.th}>
                    {language == "en" ? "Charge Type" : "चार्ज प्रकार"}
                  </th>
                  <th className={styles.th}>
                    {language == "en" ? "Amount(Rs.)" : "रक्कम (रु.)"}
                  </th>
                </tr>
               
                <tr>
                  <td className={styles.th}>1</td>
                  <td className={styles.th}>
                     {language == "en"
                      ? "Type : A Charges for road rehabilitation"
                      : "प्रकार: अ रस्ता पुर्ववत करण्यासाठीचे शुल्क"}{" "}
                  </td>
                  {/* <td className={styles.th}>{totalLength}</td> */}
                  <td className={styles.th}>
                  {typeATotalAmount}/-
                  </td>
                  {/* <td className={styles.th}> {totalAmount}</td> */}
                </tr>
                <tr>
                  <td className={styles.th}>2</td>
                  <td className={styles.th}>
                     {language == "en"?"Type : B Municipality Surcharge":"प्रकार: ब  मनपा अधिभार"}
                  </td>
                  {/* <td className={styles.th}>{totalLength}</td> */}
                  <td className={styles.th}>
                    {typeBTotalAmount}/-
                  </td>
                  {/* <td className={styles.th}> {totalAmount}</td> */}
                </tr>
                <tr>
                  <td className={styles.th}></td>
                  <td className={styles.th}>
                    <b>{language == "en" ? "Total Amount(Rs.)" : "एकूण र.रु."}</b>{" "}
                  </td>
                  {/* <td className={styles.th}>{totalLength}</td> */}
                  <td className={styles.th}>
                    <b>
                      
                      {TotalAmount}/-
                    </b>
                  </td>
                  {/* <td className={styles.th}> {totalAmount}</td> */}
                </tr>
              </table>
            </Grid>

            {/* ////////////////////////////////////////// */}
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl xs={12} sm={6} md={4} error={!!errors.wardId}>
                  <InputLabel>
                    <FormattedLabel id="paymentType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        // name="paymentType"
                        variant="standard"
                        sx={{ width: 200 }}
                        {...register("paymentType")}
                      >
                        {paymentType &&
                          paymentType.map((paymentType, index) => (
                            <MenuItem key={index} value={paymentType.id}>
                              {paymentType.paymentType}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="paymentType"
                    control={control}
                    defaultValue="Online"
                  />
                  <FormHelperText>
                    {errors?.paymentType ? errors.paymentType.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/* <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FormControl xs={12} sm={6} md={4} error={!!errors.wardId}>
                  <InputLabel>
                    <FormattedLabel id="paymentMode" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        variant="standard"
                        // name="paymentMode"
                        sx={{ width: 200 }}
                        {...register("paymentMode")}
                      >
                        {paymentMode &&
                          paymentMode.map((paymentMode, index) => (
                            <MenuItem key={index} value={paymentMode.id}>
                              {paymentMode.paymentMode}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="PaymentMode"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.PaymentMode ? errors.PaymentMode.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}
              {/* ////////////////////////////////////////// */}
              {/* <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  autoFocus
                  style={{
                    backgroundColor: "white",
                    width: 200,
                    marginTop: "-10px",
                    marginLeft: "-50px",
                  }}
                  id="outlined-basic"
                  label={<FormattedLabel id="remark" />}
                  // label="Remark"
                  // variant="outlined"
                  variant="standard"
                  {...register("paymentremark")}
                  error={!!errors.paymentremark}
                  helperText={
                    errors?.paymentremark ? errors.paymentremark.message : null
                  }
                />
              </Grid> */}
            </Grid>

            <Grid
              container
              spacing={2}
              style={{
                // padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Grid item>
                <Button
                 onClick={() => {
                      handlePay();
                    }} 
                    variant="outlined">
                  <FormattedLabel id="save" />
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={clearButton}>
                  <FormattedLabel id="clear" />
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" onClick={exitButton}>
                  <FormattedLabel id="exit" />
                </Button>
              </Grid>
            </Grid>
            {/* //////////////////////////////////// */}
          </form>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
