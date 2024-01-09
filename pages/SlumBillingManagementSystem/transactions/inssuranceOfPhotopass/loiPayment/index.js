import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  IconButton,
  Select,
  ThemeProvider,
  TextField,
} from "@mui/material";
import theme from "../../../../../theme";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import router from "next/router";
import schema from "../../../../../containers/schema/slumManagementSchema/insuranceOfPhotopassSchema";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import UploadButton from "../../../../../components/fileUpload/UploadButton";
import { Clear, ExitToApp, Save } from "@mui/icons-material";
import moment from "moment";
import sweetAlert from "sweetalert";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { useSelector } from "react-redux";
import Loader from "../../../../../containers/Layout/components/Loader";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Index = () => {
  const {
    register,
    reset,
    watch,
    setValue,
    handleSubmit,
    control,
    formState: { errors: errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
  });
  const [dataSource, setDataSource] = useState({});
  const [hutData, setHutData] = useState({});
  const [paymentModeDropDown, setPaymentModeDropDown] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  let loggedInUser = localStorage.getItem("loggedInUser");
  const headers = { Authorization: `Bearer ${user?.token}` };
  useEffect(() => {
    getPhotopassDataById(router.query.id);
    getPaymentMode();
    getTitleData();
  }, [router.query.id]);

  useEffect(() => {
    let _res = dataSource;
    setValue(
      "applicantTitle",
      _res?.applicantTitle ? _res?.applicantTitle : "-"
    );
    setValue(
      "applicantFirstName",
      _res?.applicantFirstName ? _res?.applicantFirstName : "-"
    );
    setValue(
      "applicantMiddleName",
      _res?.applicantMiddleName ? _res?.applicantMiddleName : "-"
    );
    setValue(
      "applicantLastName",
      _res?.applicantLastName ? _res?.applicantLastName : "-"
    );
    setValue(
      "applicantMobileNo",
      _res?.applicantMobileNo ? _res?.applicantMobileNo : "-"
    );
    setValue("amount", _res?.feesApplicable ? _res?.feesApplicable : "-");
    setValue("totalAmount", _res?.feesApplicable ? _res?.feesApplicable : "-");

    getTitleData();
  }, [dataSource, language]);

  const getTitleData = () => {
    axios.get(`${urls.CFCURL}/master/title/getAll`,
    { headers: headers }).then((r) => {
      let result = r.data.title;
      let res =
        result && result.find((obj) => obj.id == dataSource?.applicantTitle);
      setValue("applicantTitle", language == "en" ? res?.title : res?.titleMr);
    });
  };

  //get Payment Mode

  const getPaymentMode = () => {
    axios.get(`${urls.EBPSURL}/master/paymentMode/getAll`,
    { headers: headers }).then((res) => {
      let temp = res.data.paymentMode;
      setPaymentModeDropDown(temp);
    });
  };

  const getPhotopassDataById = (id) => {
    setIsLoading(true);
    if (id) {
      axios
        .get(`${urls.SLUMURL}/trnIssuePhotopass/getById?id=${id}`, {
          headers: headers,
        })
        .then((r) => {
          setIsLoading(false);
          let result = r.data;
          setDataSource(result);
        });
    }
  };

  const handleOnSubmit = (formData) => {
    setIsLoading(true);
    let loiData =
      dataSource?.trnLoiList.length !== 0
        ? dataSource?.trnLoiList[dataSource?.trnLoiList.length - 1]
        : null;
    if (loiData !== null) {
      let _body = {
        title: formData.applicantTitle,
        middleName: formData.applicantMiddleName,
        firstName: formData.applicantFirstName,
        lastName: formData.applicantLastName,
        mobileNo: formData.applicantMobileNo,
        ...formData,
        loiNo: loiData?.loiNo,
        transactionRefNo: loiData?.transactionRefNo,
        transactionType: loiData?.transactionType,
        referenceKey: dataSource?.id,
        isComplete: true,
        id: loiData?.id,
        status: dataSource?.status,
        activeFlag: dataSource?.activeFlag,
      };
      const tempData = axios
        .post(`${urls.SLUMURL}/trnLoi/issuePhotopass/save`, _body, {
          headers: headers,
        })
        .then((res) => {
          setIsLoading(false);
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Done!" : " ",
              language == "en"
                ? `LOI payment against ${dataSource.applicationNo} done successfully !`
                : `विरुद्ध LOI पेमेंट ${dataSource.applicationNo} 
                यशस्वीरित्या केले!`,
              "success",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            ).then((will)=>{
              if(will){
                router.push(
                  "/dashboard"
                );
              }
            });
          }
        })
        .catch((err) => {
          setIsLoading(false);
          catchMethod(err);
        });
    } else {
      sweetAlert(
        language === "en" ? "error!" : "त्रुटी!",
        language === "en" ? "Something went wrong" : "काहीतरी चूक झाली",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading && <CommonLoader />}
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <form onSubmit={handleSubmit(handleOnSubmit)}>

          <Box>
                    <Grid container className={commonStyles.title}>
                      <Grid item xs={12}>
                        <h3
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          <FormattedLabel id="loiDetails" />
                        </h3>
                      </Grid>
                    </Grid>
                  </Box>

          <Grid container sx={{ padding: "10px" }}>
            {/* Title */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="applicantTitle" />}
                // @ts-ignore
                variant="standard"
                value={watch("applicantTitle")}
                error={!!errors.applicantTitle}
                helperText={
                  errors?.applicantTitle ? errors.applicantTitle.message : null
                }
              />
            </Grid>

            {/* firstName */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="firstName" />}
                // @ts-ignore
                variant="standard"
                value={watch("applicantFirstName")}
                error={!!errors.applicantFirstName}
                helperText={
                  errors?.applicantFirstName
                    ? errors.applicantFirstName.message
                    : null
                }
              />
            </Grid>

            {/* middleName */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="middleName" />}
                // @ts-ignore
                variant="standard"
                value={watch("applicantMiddleName")}
                error={!!errors.applicantMiddleName}
                helperText={
                  errors?.applicantMiddleName
                    ? errors.applicantMiddleName.message
                    : null
                }
              />
            </Grid>

            {/* lastName */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="lastName" />}
                // @ts-ignore
                variant="standard"
                value={watch("applicantLastName")}
                error={!!errors.applicantLastName}
                helperText={
                  errors?.applicantLastName
                    ? errors.applicantLastName.message
                    : null
                }
              />
            </Grid>

            {/* mobileNo */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="mobileNo" />}
                // @ts-ignore
                variant="standard"
                value={watch("applicantMobileNo")}
                error={!!errors.applicantMobileNo}
                helperText={
                  errors?.applicantMobileNo
                    ? errors.applicantMobileNo.message
                    : null
                }
              />
            </Grid>

            {/* transaction date & time */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Controller
                control={control}
                name="transactionTime"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                      {...field}
                      renderInput={(props) => (
                        <TextField
                          {...props}
                          size="small"
                          variant="standard"
                          fullWidth
                          sx={{ width: "250px" }}
                          error={errors.transactionTime}
                          helperText={
                            errors?.transactionTime
                              ? errors.transactionTime.message
                              : null
                          }
                        />
                      )}
                      label={
                        <FormattedLabel id="transactionDateTime" required />
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(
                          moment(date).format("YYYY-MM-DDThh:mm:ss")
                        )
                      }
                      defaultValue={null}
                      inputFormat="DD-MM-YYYY hh:mm:ss"
                    />
                  </LocalizationProvider>
                )}
              />
            </Grid>

            {/* amount */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="amount" />}
                // label={labels["amount"]}
                // @ts-ignore
                variant="standard"
                value={watch("amount")}
                InputLabelProps={{
                  shrink: router.query.id || watch("amount") ? true : false,
                }}
                error={!!errors.amount}
                helperText={errors?.amount ? errors.amount.message : null}
              />
            </Grid>

            {/* totalAmount */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="totalAmount" />}
                // label={labels["totalAmount"]}
                // @ts-ignore
                variant="standard"
                value={watch("totalAmount")}
                InputLabelProps={{
                  shrink:
                    router.query.id || watch("totalAmount") ? true : false,
                }}
                error={!!errors.totalAmount}
                helperText={
                  errors?.totalAmount ? errors.totalAmount.message : null
                }
              />
            </Grid>

            {/* receivedAmount */}
            {/* <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="receivedAmount" />}
              variant="standard"
              {...register("receivedAmount")}
              InputLabelProps={{
                shrink: router.query.id || watch("receivedAmount") ? true : false,
              }}
              error={!!errors.receivedAmount}
              helperText={errors?.receivedAmount ? errors.receivedAmount.message : null}
            />
          </Grid> */}

            {/* paymentMode */}
            {/* <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FormControl
              disabled={router.query.pageMode == "view" ? true : false}
              variant="standard"
              error={!!errors.paymentModeKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="paymentModeKey" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "250px" }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="paymentModeKey"
                  >
                    {paymentModeDropDown &&
                      paymentModeDropDown.map((value, I) => (
                        <MenuItem
                          key={index}
                          value={
                            value.id
                          }
                        >
                          {language == "en"
                            ? 
                              value?.paymentMode
                            :
                              value?.paymentModeMr
                            }
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="paymentModeKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>{errors?.paymentModeKey ? errors.paymentModeKey.message : null}</FormHelperText>
            </FormControl>
          </Grid> */}

            {/* paymentAmount */}
            {/* <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="paymentAmount" />}
              variant="standard"
              {...register("paymentAmount")}
              InputLabelProps={{
                shrink: router.query.id || watch("paymentAmount") ? true : false,
              }}
              error={!!errors.paymentAmount}
              helperText={errors?.paymentAmount ? errors.paymentAmount.message : null}
            />
          </Grid> */}

            {/* transactionStatus */}
            {/* <Grid
            item
            xl={4}
            lg={4}
            md={6}
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              disabled={router.query.pageMode == "view" ? true : false}
              sx={{ width: "250px" }}
              label={<FormattedLabel id="transactionStatus" />}
              variant="standard"
              {...register("transactionStatus")}
              InputLabelProps={{
                shrink: router.query.id || watch("transactionStatus") ? true : false,
              }}
              error={!!errors.transactionStatus}
              helperText={errors?.transactionStatus ? errors.transactionStatus.message : null}
            />
          </Grid> */}

            {/* remarks */}
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                multiline
                disabled={router.query.pageMode == "view" ? true : false}
                sx={{ width: "250px" }}
                label={<FormattedLabel id="remarks" />}
                // label={labels["remarks"]}
                // @ts-ignore
                variant="standard"
                {...register("remarks")}
                InputLabelProps={{
                  shrink: router.query.id || watch("remarks") ? true : false,
                }}
                error={!!errors.remarks}
                helperText={errors?.remarks ? errors.remarks.message : null}
              />
            </Grid>
          </Grid>

          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                color="success"
                variant="contained"
                type="submit"
                endIcon={<Save />}
              >
                <FormattedLabel id="save" />
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  router.push({
                    pathname:
                      "/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/viewAddApplicantDetails",
                    query: {
                      id: router.query.id,
                    },
                  })
                }
                endIcon={<Clear />}
              >
                <FormattedLabel id="back" />
              </Button>
            </Grid>

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Button
                variant="contained"
                color="error"
                endIcon={<ExitToApp />}
                onClick={() => {
                  if(loggedInUser==='citizenUser'||loggedInUser==='cfcUser'){
                    router.push(
                      `/dashboard`
                    );
                  }else{
                  router.push(
                    `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/photopassDetails`
                  );
                  }
                }}
              >
                <FormattedLabel id="exit" />
                {/* {labels["exit"]} */}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
