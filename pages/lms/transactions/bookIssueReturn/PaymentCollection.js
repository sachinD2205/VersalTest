import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import { ToWords } from "to-words";
// import FormattedLabel from '../../../../../containers/reuseableComponents/FormattedLabel'
import theme from "../../../../theme";
import urls from "../../../../URLS/urls";
import styles from "./PaymentCollection.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import LmsHeader from "../../../../components/lms/lmsHeader";

const Index = () => {
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const router = useRouter();
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const onlinModes = [
    {
      id: 1,
      paymentModePrefixMr: null,
      paymentModePrefix: "Test payment Mode Prefix ",
      fromDate: "2022-12-11",
      toDate: "2022-12-12",
      paymentModeMr: null,
      paymentMode: "UPI",
      paymentTypeId: null,
      remark: "remark",
      remarkMr: null,
      activeFlag: "Y",
    },
    {
      id: 2,
      paymentModePrefixMr: null,
      paymentModePrefix: "test payment mode prefix 2",
      fromDate: "2019-02-11",
      toDate: "2022-10-10",
      paymentModeMr: null,
      paymentMode: "Net Banking",
      paymentTypeId: null,
      remark: "Done",
      remarkMr: null,
      activeFlag: "Y",
    },
  ];

  const validatePay = () => {
    if (
      watch("accountNumber") === undefined ||
      watch("accountNumber") === "" ||
      watch("bankName") === undefined ||
      watch("bankName") === "" ||
      watch("branchName") === undefined ||
      watch("branchName") === "" ||
      watch("ifsc") === undefined ||
      watch("ifsc") === ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleExit = () => {
    swal(
      language == "en" ? "Exit!" : "बाहेर पडा!",
      language == "en"
        ? "Successfully Exitted Payment!"
        : "पेमेंटमधून यशस्वीरित्या बाहेर पडले!",
      "success",
      { button: language === "en" ? "Ok" : "ठीक आहे" }
    );
    if (router.query.applicationSide == "Citizen") {
      router.push({
        pathname: `/dashboard`,
      });
    } else {
      router.push("/lms/transactions/bookIssueReturn");
    }
  };

  const handlePay = () => {
    setLoading(true);
    let _amt = 0;
    dataa !== null && dataa?.isFinePending === true
      ? (_amt = Number(router?.query?.temp) + Number(dataa?.fine))
      : (_amt = Number(router?.query?.temp));
    // setValue("payment.amount", router?.query?.temp);
    setValue("payment.amount", _amt);
    // const finalBody = {
    //   id: Number(router?.query?.id),
    //   lostRemark: remark
    //   // role: 'CASHIER',
    //   // loi: getValues('loi'),
    //   // paymentDao: getValues('payment'),
    // }
    // console.log("_amt", watch("payment.amount"));
    let pl = {};
    axios
      .post(
        `${urls.LMSURL}/trnBookIssueReturn/markBookAsLost?id=${Number(
          router?.query?.id
        )}&lostRemark=${router?.query?.remark}`,
        pl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log(res);
        swal(
          language == "en" ? "Submitted!" : "सबमिट केले!",
          language == "en"
            ? "Fine Collected successfully!"
            : "दंड यशस्वीरित्या गोळा केला!",
          "success"
        );
        if (res.status == 200 || res.status == 201) {
          router.push({
            pathname: "/lms/transactions/bookIssueReturn",
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        swal(
          language == "en" ? "Error!" : "त्रुटी!",
          language == "en" ? "Somethings Wrong!" : "काहीतरी चूक आहे!",
          "error"
        );
        router.push("/lms/transactions/bookIssueReturn");
      });
  };

  const [paymentTypes, setPaymentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataa, setDataa] = useState(null);

  const getPaymentTypes = () => {
    setLoading(true);
    axios
      .get(`${urls.CFCURL}/master/paymentType/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);

        let tempArr = [];
        r.data.paymentType.forEach((row) => {
          if (row.paymentType != "Online") {
            tempArr.push({
              id: row.id,
              paymentType: row.paymentType,
              paymentTypeMr: row.paymentTypeMr,
            });
          }
        });
        console.log("aala citizen", tempArr);

        setPaymentTypes(tempArr);
      })
      .catch((err) => setLoading(false));
  };

  const [paymentModes, setPaymentModes] = useState([]);
  const [pmode, setPmode] = useState([]);
  const getPaymentModes = () => {
    setLoading(true);
    axios
      .get(`${urls.BaseURL}/paymentMode/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLoading(false);
        setPmode(
          r.data.paymentMode.map((row) => ({
            id: row.id,
            paymentMode: row.paymentMode,
            paymentModeMr: row.paymentModeMr,
          }))
        );
      })
      .catch((err) => setLoading(false));
  };

  const getIsFinePending = () => {
    if (router?.query?.id) {
      setLoading(true);
      axios
        .get(
          `${
            urls.LMSURL
          }/trnBookIssueReturn/calculateFineOfIssueBook?id=${Number(
            router?.query?.id
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          setLoading(false);
          let _res = r?.data;
          // console.log("_res", _res);
          setDataa(_res);
        })
        .catch((er) => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    getPaymentTypes();
    getPaymentModes();
    getIsFinePending();
  }, []);

  useEffect(() => {
    console.log("paymenttype", watch("payment.paymentType"));
    if (watch("payment.paymentType") === "Online") {
      setPaymentModes(onlinModes);
    } else {
      setPaymentModes(pmode);
    }
  }, [watch("payment.paymentType")]);
  // const [data, setdata] = useState()

  return (
    <>
      <ThemeProvider theme={theme}>
        <Paper
          sx={{
            marginLeft: 10,
            marginRight: 2,
            marginTop: 5,
            marginBottom: 5,
            padding: 1,
            border: 2,
            borderColor: "black.500",
          }}
        >
          <LmsHeader
            language={language}
            enName="Payment Collection"
            mrName="पेमेंट संकलन"
          />
          {/* <div className={styles.details}>
            <div className={styles.h1Tag}>
              <h3
                style={{
                  color: "white",
                  marginTop: "7px",
                }}
              >
                Payment Collection
              </h3>
            </div>
          </div> */}
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className={styles.appDetails}>
                {/* <div className={styles.row} >
                            <div > */}
                <h4>सदस्यत्व क्र : {router?.query?.membershipNo}</h4>
                {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
                <h4>सदस्यत्व नाव :{" " + router?.query?.memberName}</h4>
                {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
                <h4>दिनांक : {moment(new Date()).format("DD-MM-YYYY")}</h4>
                {/* </div>
                        </div>
                        <div className={styles.row1}>
                            <div > */}
                {/* </div>
                        </div> */}
                <div className={styles.row5}></div>
                <h4>
                  एकुण रक्कम :{" "}
                  {dataa?.isFinePending === true
                    ? Number(router?.query?.temp) + Number(dataa?.fine)
                    : router?.query?.temp}
                  &nbsp;रु
                </h4>

                <table id="table-to-xls" className={styles.report_table}>
                  <thead>
                    <tr>
                      <th colSpan={2}>अ.क्र</th>
                      <th colSpan={8}>शुल्काचे नाव</th>
                      <th colSpan={2}>रक्कम(रु)</th>
                    </tr>
                    <tr>
                      <td colSpan={4}>{`1)`}</td>
                      <td colSpan={4}>हरवलेल्या पुस्तकाचे तपशिल</td>
                      <td colSpan={4}>{router?.query?.temp}</td>
                    </tr>
                    {dataa?.isFinePending === true ? (
                      <tr>
                        <td colSpan={4}>{`2)`}</td>
                        <td colSpan={4}>विलंब शुल्क</td>
                        <td colSpan={4}>{dataa?.fine}</td>
                      </tr>
                    ) : (
                      ""
                    )}
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={4}>
                        <b></b>
                      </td>
                      <td colSpan={4}>
                        <b></b>
                      </td>
                      <td colSpan={4}>
                        <b>
                          एकूण रक्कम :{" "}
                          {dataa?.isFinePending === true
                            ? Number(router?.query?.temp) + Number(dataa?.fine)
                            : router?.query?.temp}
                          /-
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div
                  className={styles.details}
                  style={{ marginLeft: 0, marginRight: 0 }}
                >
                  <div className={styles.h1Tag}>
                    <h3
                      style={{
                        color: "white",
                        marginTop: "7px",
                      }}
                    >
                      {/* <FormattedLabel id="receiptModeDetails" /> */}
                      {language === "en" ? "Payment Details" : "देयक तपशील"}
                    </h3>
                  </div>
                </div>
                <Grid
                  container
                  sx={{
                    marginTop: 1,
                    marginBottom: 5,
                    // paddingLeft: '50px',
                    align: "center",
                  }}
                >
                  <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                    <FormControl
                      error={!!errors.paymentType}
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* {<FormattedLabel id="paymentType" />} */}
                        {language === "en" ? " Payment Type" : "देयकाचा प्रकार"}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: "230px" }}
                            // // dissabled={inputState}
                            autoFocus
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            // label=<FormattedLabel id="paymentType" />
                            label="Payment Type"
                            id="demo-simple-select-standard"
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
                        name="payment.paymentType"
                        control={control}
                        defaultValue=""
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                    <FormControl
                      error={!!errors.paymentMode}
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* {<FormattedLabel id="paymentMode" />} */}
                        {language === "en" ? "Payment Mode" : "भरणा मोड"}
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
                            // label={<FormattedLabel id="paymentMode" />}
                            label="Payment Mode"
                            id="demo-simple-select-standard"
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
                        name="payment.paymentMode"
                        control={control}
                        defaultValue=""
                      />
                    </FormControl>
                  </Grid>

                  {watch("payment.paymentMode") == "DD" && (
                    <>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          // label={<FormattedLabel id="bankName" />}
                          label="Bank Name"
                          variant="standard"
                          {...register("payment.bankName")}
                          error={!!errors.bankName}
                          helperText={
                            errors?.bankName ? errors.bankName.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          // label={<FormattedLabel id="bankAccountNo" />}
                          label="Bank Account No"
                          variant="standard"
                          {...register("payment.accountNo")}
                          error={!!errors.accountNo}
                          helperText={
                            errors?.accountNo ? errors.accountNo.message : null
                          }
                        />
                      </Grid>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          // label={<FormattedLabel id="ddNo" />}
                          label="DD No"
                          variant="standard"
                          {...register("payment.ddNo")}
                          error={!!errors.ddNo}
                          helperText={errors?.ddNo ? errors.ddNo.message : null}
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <FormControl
                          sx={{ marginTop: 0 }}
                          error={!!errors.dDDate}
                        >
                          <Controller
                            name="payment.ddDate"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span
                                      style={{ fontSize: 16, marginTop: 2 }}
                                    >
                                      {/* <FormattedLabel id="ddDate" /> */}
                                      DD Date
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
                            {errors?.ddDate ? errors.ddDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {watch("payment.paymentMode") == "UPI" && (
                    <>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          // disabled={inputState}
                          id="standard-basic"
                          // label={<FormattedLabel id="bankName" />}
                          label="UPI ID"
                          variant="standard"
                          {...register("payment.upiId")}
                          error={!!errors.upiId}
                          helperText={
                            errors?.upiId ? errors.upiId.message : null
                          }
                        />
                      </Grid>

                      <Grid item xs={3} md={3} sm={3} xl={3} lg={3}>
                        <FormControl
                          variant="standard"
                          sx={{ marginTop: 2 }}
                          error={!!errors.upilist}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            UPI LIST
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                                label="Status at time of marriage *"
                              >
                                <MenuItem value={1}>@ybl</MenuItem>
                                <MenuItem value={2}>@okaxis</MenuItem>
                                <MenuItem value={3}>@okicici</MenuItem>
                              </Select>
                            )}
                            name="upilist"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.upilist ? errors.upilist.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </>
                  )}

                  {watch("payment.paymentMode") == "Net Banking" && (
                    <>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          //  disabled
                          sx={{ width: 230 }}
                          id="standard-basic"
                          // label={<FormattedLabel id="bankName" required />}
                          label="Bank Name"
                          variant="standard"
                          {...register("bankName")}
                          // error={!!errors.aFName}
                          // helperText={errors?.aFName ? errors.aFName.message : null}
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          //disabled={inputState}
                          id="standard-basic"
                          // label={<FormattedLabel id="branchName" />}
                          label="Branch Name"
                          variant="standard"
                          {...register("branchName")}
                          error={!!errors.branchName}
                          helperText={
                            errors?.branchName
                              ? errors.branchName.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          //  disabled
                          sx={{ width: 230 }}
                          id="standard-basic"
                          // label={<FormattedLabel id="ifsc" required />}
                          label="IFSC"
                          variant="standard"
                          {...register("ifsc")}
                          // error={!!errors.aFName}
                          // helperText={errors?.aFName ? errors.aFName.message : null}
                        />
                      </Grid>

                      <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <TextField
                          //  disabled
                          sx={{ width: 230 }}
                          id="standard-basic"
                          // label={<FormattedLabel id="accountNumber" required />}
                          label="Account No"
                          variant="standard"
                          {...register("accountNumber")}
                          // error={!!errors.aFName}
                          // helperText={errors?.aFName ? errors.aFName.message : null}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <div>
                  <div className={styles.row4}>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        //disabled={validatePay()}
                        onClick={() => {
                          handlePay();
                        }}
                      >
                        {/* {<FormattedLabel id="pay" />} */}
                        {language === "en" ? "Pay" : "पैसे भरा"}
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        // disabled={validateSearch()}

                        onClick={() => {
                          swal({
                            title: language == "en" ? "Exit?" : "बाहेर पडायचे?",
                            text:
                              language == "en"
                                ? "Are you sure you want to exit this Record?"
                                : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?",
                            icon: "warning",
                            buttons: {
                              ok: language === "en" ? "Ok" : "ठीक आहे",
                              cancel: language === "en" ? "Cancel" : "रद्द करा",
                            },
                            dangerMode: true,
                          }).then((willDelete) => {
                            if (willDelete) {
                              // swal(
                              //   language == "en"
                              //     ? "Record is Successfully Exited!"
                              //     : "यशस्वीरित्या बाहेर",
                              //   {
                              //     icon: "success",
                              //     button: language === "en" ? "Ok" : "ठीक आहे",
                              //   }
                              // );
                              handleExit();
                            } else {
                              swal(
                                language == "en"
                                  ? "Record is Safe"
                                  : "रेकॉर्ड सुरक्षित आहे",
                                { button: language === "en" ? "Ok" : "ठीक आहे" }
                              );
                            }
                          });
                        }}
                      >
                        {/* {<FormattedLabel id="exit" />} */}
                        {language === "en" ? "Exit" : "बाहेर पडा"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Index;
