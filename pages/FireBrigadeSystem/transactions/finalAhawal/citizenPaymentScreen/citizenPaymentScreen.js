import {
  Grid,
  FormControl,
  TextField,
  FormHelperText,
  InputLabel,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import sweetAlert from "sweetalert";
import styles from "../../../../../styles/fireBrigadeSystem/view.module.css";
// import Swal from "sweetalert2";
// import ComponentToPrint from "./print/ComponentToPrint";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../URLS/urls";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { language } from "../../../../../features/labelSlice";
import { useSelector } from "react-redux";
import style from "../../../../../styles/fireBrigadeSystem/view.module.css";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { set } from "date-fns";
import { ToWords } from "to-words";
import Transliteration from "../../../../../components/common/linguosol/transliteration";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/fireBrigadeSystem/emergencyCitizenPayment";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const getToPaymentGateway = (payDetail) => {
    document.body.innerHTML += `<form id="dynForm" action=${payDetail.url} method="post">
    <input type="hidden" id="encRequest" name="encRequest" value=${payDetail.encRequest}></input>
    <input type="hidden" id="access_code" name="access_code" value=${payDetail.access_code}></input>    </form>`;
    document.getElementById("dynForm").submit();
  };

  const converter = require("number-to-words");
  const userToken = useGetToken();

  const toWords = new ToWords({ localeCode: "mr-IN" });

  const token = useSelector((state) => state.user.user.token);

  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [paymentMode, setPaymentMode] = useState();

  const language = useSelector((state) => state?.labels.language);

  const [chequeDateValue, setChequeDateValue] = React.useState(null);
  const [cashDateValue, setCashDateValue] = React.useState(null);
  const [onlineDateValue, setOnlineDateValue] = React.useState(null);
  const [rtgsDateValue, setRtgsDateValue] = React.useState(null);
  const [ddDateValue, setDdDateValue] = React.useState(null);

  const [valuePaymentMode, setValuePaymentMode] = React.useState();

  const router = useRouter();

  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = methods;
  //   const {
  //     register,
  //     control,
  //     handleSubmit,
  //     methods,
  //     reset,
  //     watch,
  //     setValue,
  //     formState: { errors },
  //   } = useForm({
  //     criteriaMode: "all",
  //     // resolver: yupResolver(schema),
  //     mode: "onChange",
  //   });

  //Button Click Function

  const opensweetalert = () => {
    // Swal.fire({
    //   title: "Pay",
    //   text: "Are you Sure Want to Pay",
    //   type: "confirmation",
    // });
  };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("Table Data");

      console.log("hello", router.query);
      reset(router.query);

      if (router?.query?.id) {
        axios
          .get(
            `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${router?.query?.id}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then((res) => {
            // if (r.status == 200) {
            console.log("332233", res?.data?.loii?.allTotal);
            // methods.reset(res?.data);

            setValue("loii.id", res?.data?.loii?.id);
            setValue("loii.loiNO", res?.data?.loii?.loiNO);

            setValue("totalAmount", res?.data?.loii?.allTotal);
            setValue(
              "amountInWord",
              converter.toWords(res?.data?.loii?.allTotal)
            );

            setValue(
              "amountInWordMr",
              toWords.convert(
                Number(
                  res?.data?.loii?.allTotal == undefined
                    ? 0
                    : res?.data?.loii?.allTotal
                )
              )
            );
          })
          .catch((err) => {
            console.log("errApplication", err);
          });
      }
    }
  }, [router.query.pageMode == "Edit"]);

  const opensweetalertdanger = () => {
    // Swal.fire({
    //   title: "Cancel",
    //   text: "Are You Sure Want To Cancel",
    //   type: "confiramtion",
    // });
  };

  //   // console.log("fromData", fromData);
  //   // const finalBody = {
  //   //   ...fromData,
  //   //   dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
  //   //     "YYYY-MM-DDThh:mm:ss"
  //   //   ),
  //   // };
  //   // axios
  //   //   .post(`${urls.BaseURL}/transaction/trnEmergencyServices/save`, finalBody)
  //   //   .then((res) => {
  //   //     if (res.status == 200) {
  //   //       fromData.id
  //   //         ? sweetAlert("Update!", "Record Updated successfully !", "success")
  //   //         : sweetAlert("Saved!", "Record Saved successfully !", "success");
  //   //       router.back();
  //   //     }
  //   //   });
  // };

  //   const handleSubmit = () => {
  //     sweetAlert("Update!", "Record Updated successfully !", "success");
  //     sweetAlert("Saved!", "Record Saved successfully !", "success");
  //   };

  useEffect(() => {
    getUser();
    getPaymentMode();
  }, []);

  const getPaymentMode = () => {
    axios
      .get(`${urls.FbsURL}/master/paymentMode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("ttttt", res?.data?.paymentMode);
        setPaymentMode(res?.data?.paymentMode);
      })
      .catch((err) => console.log(err));
  };

  // get employee from cfc
  const getUser = () => {
    axios
      .get(`${urls.CFCURL}transaction/paymentDetails/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setUserLst(res?.data);
        console.log(res, "payscreen data.................");
      });
  };

  var record = {
    serviceName: "priyanka aglave",
    amountInWord: "",
  };

  const onSubmitForm = (fromData) => {
    console.log("router.query", router.query);

    const finalBody = {
      id: router?.query?.id ? router.query.id : null,

      isPayment: "Y",
      role: "LOI_COLLECTION",
      // desg: "LOI_COLLECTION",
      paymentDetails: {
        // dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
        //   "YYYY-MM-DDThh:mm:ss"
        // ),
        // departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
        emergencyServiceId: router?.query?.id ? router.query.id : null,

        isPayment: "Y",
        // ...fromData,
        id: null,
        // id: router?.query?.id ? router.query.id : null,

        isPayment: "Y",
        // id: router?.query?.id,
        chequeDate:
          fromData.chequeDate == "Invalid date"
            ? null
            : moment(fromData.chequeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
        cashDate: fromData.cashDate
          ? moment(fromData.cashDate, "YYYY-MM-DD").format("YYYY-MM-DD")
          : null,
        // onlineDate: fromData.onlineDate ? moment(fromData.onlineDate, "YYYY-MM-DD").format("YYYY-MM-DD") : null,
        onlineDate: fromData.onlineDate,
        rtgsDate: fromData.rtgsDate
          ? moment(fromData.rtgsDate, "YYYY-MM-DD").format("YYYY-MM-DD")
          : null,
        ddDate: fromData.ddDate
          ? moment(fromData.ddDate, "YYYY-MM-DD").format("YYYY-MM-DD")
          : null,

        billPayerName: fromData.billPayerName,
        billPayerNameMr: fromData.billPayerNameMr,
        billPayerMiddleName: fromData.billPayerMiddleName,
        billPayerMiddleNameMr: fromData.billPayerMiddleNameMr,
        billPayerLastName: fromData.billPayerLastName,
        billPayerLastNameMr: fromData.billPayerLastNameMr,
        billPayeraddress: fromData.billPayeraddress,
        billPayeraddressMr: fromData.billPayeraddressMr,
        billPayerVillage: fromData.billPayerVillage,
        billPayerVillageMr: fromData.billPayerVillageMr,
        billPayerContact: fromData.billPayerContact,
        billPayerEmail: fromData.billPayerEmail,
        totalAmount: fromData.totalAmount,
        amountInWord: fromData.amountInWord,
        amountInWordMr: fromData?.amountInWordMr,
        chequeNO: fromData?.chequeNO,
        bankName: fromData?.bankName,
        cfcCenter: fromData?.cfcCenter,
        onlineUpiID: fromData?.onlineUpiID,
        referenceNo: fromData?.referenceNo,
        rtgsUtrNo: fromData?.rtgsUtrNo,
        ddNo: fromData?.ddNo,
        payMode: fromData?.payMode,

        serviceName: "Emergency Services",
        serviceId: 43,
      },

      // ...fromData,
      // isPayment: "Y",
      // chequeDate: moment(fromData.chequeDate, "YYYY-MM-DD").format(
      //   "YYYY-MM-DD"
      // ),
      // // dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
      // //   "YYYY-MM-DDThh:mm:ss"
      // // ),
      // departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
    };

    console.log("finalBody", finalBody);

    sweetAlert({
      title: "Confirmation",
      text: "Are you sure you want to Pay ?",
      icon: "warning",
      buttons: ["Cancel", "Save"],
    }).then((ok) => {
      if (ok) {
        axios
          .post(
            `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
            finalBody,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            if (res.status == 200) {
              swal({
                title: "Payment Successfully",
                text: "Payment Successfully....!!",
                icon: "success",
                button: "Ok",
              });

              router.back();
            }
          });
      }
    });
  };

  const handlePay = () => {
    // setValue("payment.amount", dataa?.loi?.amount);
    console.log("watchpayMode", getValues("loii.id"), getValues("loii.loiNO"));

    if (watch("payMode") == 1) {
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
        moduleId: "FBS",
        amount: watch("totalAmount"),
        divertPageLink: "FireBrigadeSystem/transactions/finalAhawal/pgSuccess",
        loiId: Number(getValues("loii.id")),
        loiNo: getValues("loii.loiNO"),
        ccAvenueKitLtp: ccAvenueKitLtp,
        serviceId: 43,
        applicationId: Number(getValues("id")),
        // applicationId:router?.query?.applicationNumber
      };

      console.log("testBody", testBody);

      axios
        .post(
          `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
          testBody,
          {
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
            localStorage.setItem("selectedServiceId", 10);
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
        });
    } else {
      console.log("offline");

      // const finalBody = {
      //   id: router?.query?.id ? router.query.id : null,

      //   isPayment: "Y",
      //   role: "LOI_COLLECTION",
      //   // desg: "LOI_COLLECTION",
      //   paymentDetails: {
      //     // dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
      //     //   "YYYY-MM-DDThh:mm:ss"
      //     // ),
      //     // departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
      //     emergencyServiceId: router?.query?.id ? router.query.id : null,

      //     isPayment: "Y",
      //     // ...fromData,
      //     id: null,
      //     // id: router?.query?.id ? router.query.id : null,

      //     isPayment: "Y",
      //     // id: router?.query?.id,
      //     chequeDate:
      //       fromData.chequeDate == "Invalid date"
      //         ? null
      //         : moment(fromData.chequeDate, "YYYY-MM-DD").format("YYYY-MM-DD"),
      //     cashDate: fromData.cashDate
      //       ? moment(fromData.cashDate, "YYYY-MM-DD").format("YYYY-MM-DD")
      //       : null,
      //     // onlineDate: fromData.onlineDate ? moment(fromData.onlineDate, "YYYY-MM-DD").format("YYYY-MM-DD") : null,
      //     onlineDate: fromData.onlineDate,
      //     rtgsDate: fromData.rtgsDate
      //       ? moment(fromData.rtgsDate, "YYYY-MM-DD").format("YYYY-MM-DD")
      //       : null,
      //     ddDate: fromData.ddDate
      //       ? moment(fromData.ddDate, "YYYY-MM-DD").format("YYYY-MM-DD")
      //       : null,

      //     billPayerName: fromData.billPayerName,
      //     billPayerNameMr: fromData.billPayerNameMr,
      //     billPayerMiddleName: fromData.billPayerMiddleName,
      //     billPayerMiddleNameMr: fromData.billPayerMiddleNameMr,
      //     billPayerLastName: fromData.billPayerLastName,
      //     billPayerLastNameMr: fromData.billPayerLastNameMr,
      //     billPayeraddress: fromData.billPayeraddress,
      //     billPayeraddressMr: fromData.billPayeraddressMr,
      //     billPayerVillage: fromData.billPayerVillage,
      //     billPayerVillageMr: fromData.billPayerVillageMr,
      //     billPayerContact: fromData.billPayerContact,
      //     billPayerEmail: fromData.billPayerEmail,
      //     totalAmount: fromData.totalAmount,
      //     amountInWord: fromData.amountInWord,
      //     amountInWordMr: fromData?.amountInWordMr,
      //     chequeNO: fromData?.chequeNO,
      //     bankName: fromData?.bankName,
      //     cfcCenter: fromData?.cfcCenter,
      //     onlineUpiID: fromData?.onlineUpiID,
      //     referenceNo: fromData?.referenceNo,
      //     rtgsUtrNo: fromData?.rtgsUtrNo,
      //     ddNo: fromData?.ddNo,
      //     payMode: fromData?.payMode,

      //     serviceName: "Emergency Services",
      //     serviceId: 43,
      //   },

      //   // ...fromData,
      //   // isPayment: "Y",
      //   // chequeDate: moment(fromData.chequeDate, "YYYY-MM-DD").format(
      //   //   "YYYY-MM-DD"
      //   // ),
      //   // // dateAndTimeOfVardi: moment(fromData.dateAndTimeOfVardi).format(
      //   // //   "YYYY-MM-DDThh:mm:ss"
      //   // // ),
      //   // departureTime: moment(fromData.departureTime, "HH:mm").format("HH:mm"),
      // };

      // console.log("finalBody", finalBody);

      // sweetAlert({
      //   title: "Confirmation",
      //   text: "Are you sure you want to Pay ?",
      //   icon: "warning",
      //   buttons: ["Cancel", "Save"],
      // }).then((ok) => {
      //   if (ok) {
      //     axios
      //       .post(
      //         `${urls.FbsURL}/transaction/trnEmergencyServices/save`,
      //         finalBody,
      //         {
      //           headers: {
      //             Authorization: `Bearer ${token}`,
      //           },
      //         }
      //       )
      //       .then((res) => {
      //         if (res.status == 200) {
      //           swal({
      //             title: "Payment Successfully",
      //             text: "Payment Successfully....!!",
      //             icon: "success",
      //             button: "Ok",
      //           });

      //           router.back();
      //         }
      //       })
      //       .catch((err) => console.log(err));
      //   }
      // });
    }
  };

  return (
    <>
      <Box
        style={{
          margin: "4%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            margin: 1,
            padding: 2,
            backgroundColor: "#F5F5F5",
          }}
          elevation={5}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitForm)}>
              <Box className={style.tableHead}>
                <Box className={style.feildHead}>
                  {<FormattedLabel id="paymentDetails" />}
                </Box>
              </Box>
              <br />
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                spacing={4}
                className={styles.feildres}
              >
                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            
            id='outlined-basic'
            variant='outlined'
          
            label={<FormattedLabel id='firstName' />}
            {...register("finalAhawal.billPayerName")}
            error={!!errors.billPayerName}
            helperText={
              errors?.billPayerName ? errors.billPayerName.message : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayerName"}
                    labelName={"billPayerName"}
                    fieldName={"billPayerName"}
                    updateFieldName={"billPayerNameMr"}
                    sourceLang={"eng"}
                    targetLang={"mar"}
                    // disabled={disabled}
                    label={<FormattedLabel id="firstName" required />}
                    error={errors?.billPayerName}
                    helperText={
                      errors?.billPayerName
                        ? errors?.billPayerName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
          
            label={<FormattedLabel id='middleName' />}
            variant='outlined'
            {...register("billPayerMiddleName")}
            error={!!errors.billPayerMiddleName}
            helperText={
              errors?.billPayerMiddleName
                ? errors.billPayerMiddleName.message
                : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayerMiddleName"}
                    labelName={"billPayerMiddleName"}
                    fieldName={"billPayerMiddleName"}
                    updateFieldName={"billPayerMiddleNameMr"}
                    sourceLang={"eng"}
                    targetLang={"mar"}
                    // disabled={disabled}
                    label={<FormattedLabel id="middleName" required />}
                    error={errors?.billPayerMiddleName}
                    helperText={
                      errors?.billPayerMiddleName
                        ? errors?.billPayerMiddleName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
        
            label={<FormattedLabel id='lastName' />}
            variant='outlined'
            {...register("billPayerLastName")}
            error={!!errors.billPayerLastName}
            helperText={
              errors?.billPayerLastName
                ? errors.billPayerLastName.message
                : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayerLastName"}
                    labelName={"billPayerLastName"}
                    fieldName={"billPayerLastName"}
                    updateFieldName={"billPayerLastNameMr"}
                    sourceLang={"eng"}
                    targetLang={"mar"}
                    // disabled={disabled}
                    label={<FormattedLabel id="lastName" required />}
                    error={errors?.billPayerLastName}
                    helperText={
                      errors?.billPayerLastName
                        ? errors?.billPayerLastName.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
        
            label={<FormattedLabel id='firstNameMr' />}
            variant='outlined'
            {...register("billPayerNameMr")}
            error={!!errors.billPayerNameMr}
            helperText={
              errors?.billPayerNameMr ? errors.billPayerNameMr.message : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayerNameMr"}
                    labelName={"billPayerNameMr"}
                    fieldName={"billPayerNameMr"}
                    updateFieldName={"billPayerName"}
                    sourceLang={"mar"}
                    targetLang={"eng"}
                    // disabled={disabled}
                    label={<FormattedLabel id="firstNameMr" required />}
                    error={errors?.billPayerNameMr}
                    helperText={
                      errors?.billPayerNameMr
                        ? errors?.billPayerNameMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
        
            label={<FormattedLabel id='middleNameMr' />}
            variant='outlined'
            {...register("billPayerMiddleMr")}
            error={!!errors.billPayerMiddleMr}
            helperText={
              errors?.billPayerMiddleMr
                ? errors.billPayerMiddleMr.message
                : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayerMiddleMr"}
                    labelName={"billPayerMiddleMr"}
                    fieldName={"billPayerMiddleMr"}
                    updateFieldName={"billPayerMiddle"}
                    sourceLang={"mar"}
                    targetLang={"eng"}
                    // disabled={disabled}
                    label={<FormattedLabel id="middleNameMr" required />}
                    error={errors?.billPayerMiddleMr}
                    helperText={
                      errors?.billPayerMiddleMr
                        ? errors?.billPayerMiddleMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
       
            label={<FormattedLabel id='lastNameMr' />}
            variant='outlined'
            {...register("billPayerLastNameMr")}
            error={!!errors.billPayerLastNameMr}
            helperText={
              errors?.billPayerLastNameMr
                ? errors.billPayerLastNameMr.message
                : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayerLastNameMr"}
                    labelName={"billPayerLastNameMr"}
                    fieldName={"billPayerLastNameMr"}
                    updateFieldName={"billPayerLastName"}
                    sourceLang={"mar"}
                    targetLang={"eng"}
                    // disabled={disabled}
                    label={<FormattedLabel id="lastNameMr" required />}
                    error={errors?.billPayerLastNameMr}
                    helperText={
                      errors?.billPayerLastNameMr
                        ? errors?.billPayerLastNameMr.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <br />

              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
                spacing={4}
              >
                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
            label={<FormattedLabel id='area' />}
            variant='outlined'
            {...register("billPayeraddress")}
            error={!!errors.billPayeraddress}
            helperText={
              errors?.billPayeraddress ? errors.billPayeraddress.message : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayeraddress"}
                    labelName={"billPayeraddress"}
                    fieldName={"billPayeraddress"}
                    updateFieldName={"billPayeraddressMr"}
                    sourceLang={"eng"}
                    targetLang={"mar"}
                    // disabled={disabled}
                    label={<FormattedLabel id="area" required />}
                    error={errors?.billPayeraddress}
                    helperText={
                      errors?.billPayeraddress
                        ? errors?.billPayeraddress.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
            label={<FormattedLabel id='city' />}
            variant='outlined'
            {...register("billPayerVillage")}
            error={!!errors.billPayerVillage}
            helperText={
              errors?.billPayerVillage ? errors.billPayerVillage.message : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayerVillage"}
                    labelName={"billPayerVillage"}
                    fieldName={"billPayerVillage"}
                    updateFieldName={"billPayerVillageMr"}
                    sourceLang={"eng"}
                    targetLang={"mar"}
                    // disabled={disabled}
                    label={<FormattedLabel id="city" required />}
                    error={errors?.billPayerVillage}
                    helperText={
                      errors?.billPayerVillage
                        ? errors?.billPayerVillage.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    size="small"
                    sx={{ width: "100%", backgroundColor: "white" }}
                    id="outlined-basic"
                    variant="outlined"
                    label={<FormattedLabel id="contactNumber" />}
                    {...register("billPayerContact")}
                    InputLabelProps={{
                      shrink: watch("billPayerContact") ? true : false,
                    }}
                    error={errors?.billPayerContact}
                    helperText={
                      errors?.billPayerContact
                        ? errors?.billPayerContact.message
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
            label={<FormattedLabel id='areaMr' />}
            variant='outlined'
            {...register("billPayeraddressMr")}
            error={!!errors.billPayeraddressMr}
            helperText={
              errors?.billPayeraddressMr
                ? errors.billPayeraddressMr.message
                : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayeraddressMr"}
                    labelName={"billPayeraddressMr"}
                    fieldName={"billPayeraddressMr"}
                    updateFieldName={"billPayeraddress"}
                    sourceLang={"mar"}
                    targetLang={"eng"}
                    // disabled={disabled}
                    label={<FormattedLabel id="areaMr" required />}
                    error={errors?.billPayeraddressMr}
                    helperText={
                      errors?.billPayeraddressMr
                        ? errors?.billPayeraddressMr.message
                        : null
                    }
                  />
                </Grid>

                <Grid item xs={4} className={styles.feildres}>
                  {/* <TextField
            sx={{ width: "80%" }}
            id='outlined-basic'
            label={<FormattedLabel id='cityMr' />}
            variant='outlined'
            {...register("billPayerVillageMr")}
            error={!!errors.billPayerVillageMr}
            helperText={
              errors?.billPayerVillageMr
                ? errors.billPayerVillageMr.message
                : null
            }
          /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"billPayerVillageMr"}
                    labelName={"billPayerVillageMr"}
                    fieldName={"billPayerVillageMr"}
                    updateFieldName={"billPayerVillage"}
                    sourceLang={"mar"}
                    targetLang={"eng"}
                    // disabled={disabled}
                    label={<FormattedLabel id="cityMr" required />}
                    error={errors?.billPayerVillageMr}
                    helperText={
                      errors?.billPayerVillageMr
                        ? errors?.billPayerVillageMr.message
                        : null
                    }
                  />
                </Grid>
                <Grid item xs={4} className={styles.feildres}>
                  <TextField
                    size="small"
                    sx={{ width: "100%", backgroundColor: "white" }}
                    id="outlined-basic"
                    variant="outlined"
                    label={<FormattedLabel id="email" />}
                    {...register("billPayerEmail")}
                    InputLabelProps={{
                      shrink: watch("billPayerEmail") ? true : false,
                    }}
                    error={errors?.billPayerEmail}
                    helperText={
                      errors?.billPayerEmail
                        ? errors?.billPayerEmail.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <br />
              <br />
              <Box className={style.tableHead}>
                <Box className={style.feildHead}>
                  {/* {<FormattedLabel id="paymentDetails" />} */}
                  Payment Details
                </Box>
              </Box>
              <br />
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
                spacing={4}
              >
                <Grid item xs={3} className={styles.feildres}>
                  <TextField
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: "100%", backgroundColor: "white" }}
                    // id="totalAmount"
                    //   label={<FormattedLabel id="informerLastName" />}
                    label="Total amount (In Rs)"
                    variant="outlined"
                    {...register("totalAmount")}
                    error={!!errors.totalAmount}
                    helperText={
                      errors?.totalAmount ? errors.totalAmount.message : null
                    }
                  />
                </Grid>
                <Grid item xs={4.5} className={styles.feildres}>
                  {/* <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: "80%" }}
                    fullWidth
                    id='amountInWord'
                    label='Amount in words'
                    variant='outlined'
                    {...register("amountInWord")}
                    error={!!errors.amountInWord}
                    helperText={
                      errors?.amountInWord ? errors.amountInWord.message : null
                    }
                  /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"amountInWord"}
                    labelName={"amountInWord"}
                    fieldName={"amountInWord"}
                    updateFieldName={"amountInWordMr"}
                    sourceLang={"eng"}
                    targetLang={"mar"}
                    // disabled={disabled}
                    label={<FormattedLabel id="amountInWord" required />}
                    error={errors?.amountInWord}
                    helperText={
                      errors?.amountInWord ? errors?.amountInWord.message : null
                    }
                  />
                </Grid>
                <Grid item xs={4.5} className={styles.feildres}>
                  {/* <TextField
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{ width: "80%" }}
                    fullWidth
                    id='amountInWordMr'
                    label='Amount in words'
                    variant='outlined'
                    {...register("amountInWordMr")}
                    error={!!errors.amountInWordMr}
                    helperText={
                      errors?.amountInWordMr
                        ? errors.amountInWordMr.message
                        : null
                    }
                  /> */}
                  <Transliteration
                    variant={"outlined"}
                    _key={"amountInWordMr"}
                    labelName={"amountInWordMr"}
                    fieldName={"amountInWordMr"}
                    updateFieldName={"amountInWord"}
                    sourceLang={"eng"}
                    targetLang={"mar"}
                    // disabled={disabled}
                    label={<FormattedLabel id="amountInWordMr" required />}
                    error={errors?.amountInWordMr}
                    helperText={
                      errors?.amountInWordMr
                        ? errors?.amountInWordMr.message
                        : null
                    }
                  />
                </Grid>
              </Grid>
              <br />
              <Grid
                container
                columns={{ xs: 4, sm: 8, md: 12 }}
                className={styles.feildres}
                spacing={4}
              >
                <Grid item xs={4} className={styles.feildres}>
                  <FormControl
                    size="small"
                    sx={{ width: "100%" }}
                    variant="outlined"
                    error={errors?.payMode}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Payment Mode
                    </InputLabel>
                    <Controller
                      render={({ field }) => (
                        <Select
                          sx={{ backgroundColor: "white" }}
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            // setValuePaymentMode(value.target.value);
                          }}
                          label="Payment Mode"
                        >
                          <MenuItem value="1">Online</MenuItem>
                        </Select>
                      )}
                      name="payMode"
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.payMode ? errors.payMode.message : null}
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
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "100%", backgroundColor: "white" }}
                        id="outined-basic"
                        //   label={<FormattedLabel id="informerLastName" />}
                        label="Bank Name"
                        variant="outined"
                        {...register("bankName")}
                        error={errors.bankName}
                        helperText={
                          errors?.bankName ? errors.bankName.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "100%", backgroundColor: "white" }}
                        id="outlined-basic"
                        //   label={<FormattedLabel id="informerLastName" />}
                        label="Cheque No"
                        variant="outlined"
                        {...register("chequeNO")}
                        error={!!errors.chequeNO}
                        helperText={
                          errors?.chequeNO ? errors?.chequeNO?.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        size="small"
                        sx={{ width: "100%" }}
                        style={{ marginTop: 10 }}
                        error={!!errors.chequeDate}
                      >
                        <Controller
                          control={control}
                          name="chequeDate"
                          defaultValue={null}
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
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
                                    sx={{ backgroundColor: "white" }}
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
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        sx={{ width: "100%" }}
                        id="outlined-basic"
                        //   label={<FormattedLabel id="informerLastName" />}
                        label="CFC Center/ Counter"
                        variant="outlined"
                        {...register("cfcCenter")}
                        error={!!errors.cfcCenter}
                        helperText={
                          errors?.cfcCenter ? errors.cfcCenter.message : null
                        }
                      />
                    </Grid>
                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        size="small"
                        sx={{ width: "100%" }}
                        style={{ marginTop: 10 }}
                        error={errors.cashDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(cDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name="cashDate"
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
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
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "100%", backgroundColor: "white" }}
                        id="outlined-basic"
                        //   label={<FormattedLabel id="informerLastName" />}
                        label="UPI ID"
                        variant="outlined"
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
                        size="small"
                        sx={{ width: "100%", backgroundColor: "white" }}
                        id="bankName"
                        //   label={<FormattedLabel id="informerLastName" />}
                        label="Reference Number"
                        variant="outlined"
                        {...register("referenceNo")}
                        error={errors.referenceNo}
                        helperText={
                          errors?.referenceNo
                            ? errors.referenceNo.message
                            : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        size="small"
                        sx={{ width: "100%" }}
                        style={{ marginTop: 10, backgroundColor: "white" }}
                        error={errors.onlineDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(onlineDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name="onlineDate"
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
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
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "100%", backgroundColor: "white" }}
                        id="outlined-basic"
                        //   label={<FormattedLabel id="informerLastName" />}
                        label="UTR ID"
                        variant="outlined"
                        {...register("rtgsUtrNo")}
                        error={!!errors.rtgsUtrNo}
                        helperText={
                          errors?.rtgsUtrNo ? errors.rtgsUtrNo.message : null
                        }
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        size="small"
                        sx={{ width: "100%", backgroundColor: "white" }}
                        style={{ marginTop: 10 }}
                        error={errors.rtgsDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(rtgsDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name="rtgsDate"
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
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
                    spacing={4}
                  >
                    <Grid item xs={4} className={styles.feildres}>
                      <TextField
                        size="small"
                        sx={{ width: "100%", backgroundColor: "white" }}
                        id="bankName"
                        //   label={<FormattedLabel id="informerLastName" />}
                        label="DD Number"
                        variant="outlined"
                        {...register("ddNo")}
                        error={!!errors.ddNo}
                        helperText={errors?.ddNo ? errors.ddNo.message : null}
                      />
                    </Grid>

                    <Grid item xs={4} className={styles.feildres}>
                      <FormControl
                        size="small"
                        sx={{ width: "100%" }}
                        style={{ marginTop: 10 }}
                        error={errors.ddDate}
                      >
                        <Controller
                          control={control}
                          // defaultValue={moment(ddDate).format(
                          //   "YYYY-DD-MMThh:mm:ss"
                          // )}
                          name="ddDate"
                          render={({ field }) => (
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                              <DatePicker
                                inputFormat="DD/MM/YYYY"
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

              {/* ..........................................*************.................. */}

              {/* ..................******************.................. */}

              {/* ......................**********************....................... */}

              {/* <Box>
                  <div>
                    Service Charges: <b>1600</b> <br />
                    Distance from fire station: 8 charges per km: 200
                  </div>
                  <Button
                    variant="contained"
                    //   onClick={sweetAlert("Are You Sure")}
                  >
                    Pay
                  </Button>
                </Box> */}
              {/* <Box
                  style={{
                    margin: "4%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    paddingTop: "6%",
                  }}
                >
                  <Paper
                    sx={{
                      margin: 1,
                      padding: 2,
                      backgroundColor: "#F5F5F5",
                    }}
                    elevation={5}
                  > */}

              {/* </Paper> */}
              {/* </Box> */}
              <br />
              <br />

              <Grid container className={style.feildres} spacing={2}>
                <Grid item>
                  <Button
                    // type='submit'
                    onClick={() => {
                      handlePay();
                    }}
                    size="small"
                    variant="outlined"
                    className={styles.button}
                    endIcon={<SaveIcon />}
                  >
                    {<FormattedLabel id="pay" />}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    className={styles.button}
                    endIcon={<ClearIcon />}
                    onClick={() => cancellButton()}
                  >
                    {<FormattedLabel id="clear" />}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    variant="outlined"
                    className={styles.button}
                    endIcon={<ExitToAppIcon />}
                    onClick={() =>
                      router.push({
                        pathname:
                          "/FireBrigadeSystem/transactions/finalAhawal/citizenPaymentScreen/finalAhawalData",
                      })
                    }
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
                {/* <Grid item>
                    
          <Button
            variant="contained"
            onClick={() =>
              router.push({
                pathname: "/FireBrigadeSystem/transactions/finalAhawal/forPrint",
                query: {
                  ...record
                },
              })
            }
          >
            View
          </Button>
          </Grid> */}
              </Grid>
            </form>
          </FormProvider>
        </Paper>
      </Box>
      {/* <Box sx={{ backgroundColor: "white", height: "50vh", paddingTop: "5%" }}>
          <Grid
            container
            columns={{ xs: 4, sm: 8, md: 12 }}
            className={styles.feildres}
          >
            <Grid item xs={4} className={styles.feildres}></Grid>
            <Grid item xs={4} className={styles.feildres}>
              <div>
                Service Charges: <b>1600</b> <br />
                Distance from fire station: 8 <br />
                charges per km: 200
              </div>
            </Grid>
            <Grid item xs={4} className={styles.feildres}></Grid>
            <Grid item xs={4} className={styles.feildres}></Grid>
  
            <Grid
              item
              xs={4}
              style={{ paddingTop: "4%" }}
              className={styles.feildres}
            >
              <Button
                variant="contained"
                sx={{ margin: "1%" }}
                onClick={opensweetalert}
              >
                Pay
              </Button>
              <Button variant="contained" onClick={opensweetalertdanger}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={4} className={styles.feildres}></Grid>
          </Grid>
  
          <Button
            variant="contained"
            onClick={() =>
              router.push({
                pathname: "/FireBrigadeSystem/transactions/finalAhawal/forPrint",
                query: {
                  ...record
                },
              })
            }
          >
            View
          </Button>
        </Box> */}
    </>
  );
};

export default Index;
