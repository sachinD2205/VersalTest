import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../styles/[register].module.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import axios from "axios";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import urls from "../../URLS/urls";
import AppBarComponent from "../../containers/Layout/components/AppBarComponent";
import schema from "../../containers/schema/RegisterSchema";
import sweetAlert from "sweetalert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "../../containers/Layout/components/Loader";

const Register = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [hintQuestion, setHintQuestion] = useState("");
  const [emailChecked, setEmailChecked] = useState(true);
  const [societyChecked, setSocietyChecked] = useState(false);
  const [resendOTP, setResendOTP] = useState(false);
  const [phoneNumberVerified, setPhoneNumberVerified] = useState(null);
  // for email otp
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendEmailOTP, setResendEmailOTP] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [zoneNames, setZoneNames] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [titleNames, setTitleNames] = useState([]);
  const [genderNames, setGenderNames] = useState([]);
  const language = useSelector((state) => state?.labels.language);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleEmailCheckedChange = (event) => {
    setEmailChecked(event.target.checked);
  };
  const handleSocietyCheckedChange = (event) => {
    setSocietyChecked(event.target.checked);
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    mode: "onChange",
  });

  // enabled button when full name, mobile number and email is entered.
  const [disabledGenrateOtpBtn, setDisabledGenrateOtpBtn] = useState(true);
  const [disabledResendMobileOtp, setDisabledResendMobileOtp] = useState(true);
  // const [disabledResendEmailOtp, setDisabledResendEmailOtp] = useState(true);

  const [disabled, setDisabled] = useState(true);
  const [disabledResendEmailOtp, setDisabledResendEmailOtp] = useState(true);

  useEffect(() => {
    if (watch("email")) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [watch("email")]);

  useEffect(() => {
    if (watch("mobileNumber")) {
      setDisabledGenrateOtpBtn(false);
    } else {
      setDisabledGenrateOtpBtn(true);
    }
  }, [watch("mobileNumber")]);

  useEffect(() => {
    getWardNames();
    getZoneName();
    getTitle();
    getGender();
    getQuestions();
  }, []);

  const [timer, setTimer] = useState();
  const [isCountdownStarted, setIsCountdownStarted] = useState(false);

  const [mobileTimer, setMobileTimer] = useState();
  const [isMobileCountdownStarted, setIsMobileCountdownStarted] =
    useState(false);

  useEffect(() => {
    let countdown;

    // Countdown function
    const startCountdown = () => {
      if (timer > 0) {
        countdown = setTimeout(() => setTimer(timer - 1), 1000); // Decrease timer by 1 every second
      } else {
        console.log("else22");
        setResendEmailOTP(true);
        setDisabledResendEmailOtp(false);
      }
    };

    if (isCountdownStarted) {
      startCountdown(); // Start the countdown
    } else {
      clearTimeout(countdown); // Stop the countdown if the button is clicked again or the component unmounts
    }

    let mobileCountdown;

    const startMobileCountdown = () => {
      if (mobileTimer > 0) {
        mobileCountdown = setTimeout(
          () => setMobileTimer(mobileTimer - 1),
          1000
        ); // Decrease timer by 1 every second
      } else {
        console.log("else22");
        setResendOTP(true);
        setDisabledResendMobileOtp(false);
      }
    };

    if (isMobileCountdownStarted) {
      startMobileCountdown(); // Start the countdown
    } else {
      clearTimeout(mobileCountdown); // Stop the countdown if the button is clicked again or the component unmounts
    }

    // Cleanup function
    return () => {
      clearTimeout(countdown); // Clear the timeout when the component unmounts
      clearTimeout(mobileCountdown);
    };
  }, [timer, isCountdownStarted, mobileTimer, isMobileCountdownStarted]);

  const handleSelectChange = (event) => {
    console.log("event");
    setHintQuestion(event.target.value);
  };

  const onGenerateOTPClick = (text) => {
    setLoading(true);
    setDisabledGenrateOtpBtn(true);
    setDisabledResendMobileOtp(true);

    const finalBodyForApi = {
      firstName: watch("firstName"),
      middleName: watch("middleName"),
      surname: watch("lastName"),
      mobile: watch("mobileNumber"),
      // emailID: watch("email"),
    };
    axios
      // .post(`${urls.CFCURL}/transaction/citizen/sendOtp`, finalBodyForApi)
      .post(`${urls.AuthURL}/citizen/existsByMobileNo`, finalBodyForApi)
      .then((res) => {
        setLoading(false);
        console.log("mobile no res", res);
        if (res.status == 200 || res.status == 201) {
          if (res?.data?.message == "Mobile No Is Already Exist") {
            toast(res?.data?.message, {
              type: "error",
            });
          } else {
            toast(res?.data?.message, {
              type: "success",
            });
            // setResendOTP(true);
            // setDisabledResendMobileOtp(true);
            if (text == "GENERATE_MOBILE_OTP") {
              setDisabledResendMobileOtp(true);
            } else {
              setDisabledResendEmailOtp(true);
            }
            setMobileTimer(30); // Reset the timer to 60 seconds
            setIsMobileCountdownStarted(true);
          }
        }
        //  else if (res.status == 400) {
        //   sweetAlert("LOI !", `LOI Generated successfully ! `, "success");
        // }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error", err);
        toast("Something Went Wrong", {
          type: "error",
        });
      });
  };

  const onGenerateEmailOTPClick = (text) => {
    setLoading(true);
    console.log("text", text, watch("firstName"));

    const finalBodyForApi = {
      firstName: watch("firstName"),
      middleName: watch("middleName"),
      surname: watch("lastName"),
      mobile: watch("mobileNumber"),
      emailID: watch("email"),
    };
    axios
      // .post(`${urls.CFCURL}/transaction/citizen/sendOtp`, finalBodyForApi)
      .post(`${urls.AuthURL}/citizen/existsByEmailId`, finalBodyForApi)
      .then((res) => {
        console.log("res gen email otp", res);
        if (res.status == 200 || res.status == 201) {
          if (res?.data?.message == "Email Id Is Already Exist") {
            toast(res?.data?.message, {
              type: "error",
            });
          } else {
            toast(res?.data?.message, {
              type: "success",
            });
            if (text == "GENERATE_EMAIL_OTP") {
              setDisabled(true);
            } else {
              setDisabledResendEmailOtp(true);
            }
            setTimer(60); // Reset the timer to 60 seconds
            setIsCountdownStarted(true); // Set isCountdownStarted to true
          }
          setLoading(false);
        }
        setLoading(false);
        //  else if (res.status == 400) {
        //   sweetAlert("LOI !", `LOI Generated successfully ! `, "success");
        // }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error", err?.response?.data);
        sweetAlert(err?.response?.data, "Try with different", "warning");
      });
    // console.log("genrate otp");
    // setResendEmailOTP(true);
    // toast("OTP sent", {
    //   type: "success",
    // });
  };

  const verifyOTP = () => {
    const body = {
      username: watch("mobileNumber"),
      otp: watch("mobileOtp"),
    };
    axios
      .post(`${urls.AuthURL}/citizen/verifyOtp`, body)

      .then((r) => {
        console.log("verify res", r);
        if (r.status == 200) {
          setPhoneNumberVerified(true);
          toast("OTP Verified Successfully", {
            type: "success",
          });
        } else if (r.status == 401) {
          toast("Invalid OTP Please try Again", {
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.log("errw", err);
        toast("Invalid OTP Please try Again !", {
          type: "error",
        });
      });
  };

  // Verify Email Otp
  const verifyEmailOTP = () => {
    const body = {
      username: watch("email"),
      otp: watch("emailOtp"),
    };
    axios
      .post(`${urls.AuthURL}/citizen/verifyOtp`, body)

      .then((r) => {
        console.log("verify res", r);
        if (r.status == 200) {
          setEmailVerified(true);
          toast("OTP Verified Successfully", {
            type: "success",
          });
        } else if (r.status == 401) {
          toast("Invalid OTP Please try Again", {
            type: "error",
          });
        }
      })
      .catch((err) => {
        // setCountDown(countDown + 1);
        // if (countDown == 2) {
        // setLoginData();
        // setShowOTPCitizen(false);
        // setDisableLoginButton(false);
        // }
        console.log("errw", err);
        // setDisableLoginButton(true);
        // setLoading(false);
        // setIsOtpVerifiedCitizen(false);

        toast("Invalid OTP Please try Again !", {
          type: "error",
        });
      });
  };

  const getQuestions = () => {
    axios.get(`${urls.OPENCFCURL}/master/question/getAll`).then((r) => {
      console.log("rr", r);
      setQuestions(
        r.data.questionMaster
          .filter((q) => q.application == 0)
          .map((row) => ({
            id: row.id,
            question: row.question,
            questionMar: row.questionMar,
          }))
      );
    });
  };

  const getZoneName = () => {
    axios.get(`${urls.OPENCFCURL}/master/zone/getAll`).then((r) => {
      setZoneNames(
        r.data.zone.map((row) => ({
          id: row.id,
          zoneName: row.zoneName,
          zoneNameMr: row.zoneNameMr,
        }))
      );
    });
  };

  const getWardNames = () => {
    axios.get(`${urls.OPENCFCURL}/master/ward/getAll`).then((r) => {
      setWardNames(
        r.data.ward.map((row) => ({
          id: row.id,
          wardName: row.wardName,
          wardNameMr: row.wardNameMr,
        }))
      );
    });
  };

  const getTitle = () => {
    axios.get(`${urls.OPENCFCURL}/master/title/getAll`).then((r) => {
      console.log("res title", r);
      setTitleNames(
        r.data.title.map((row) => ({
          id: row.id,
          title: row.title,
          titleMr: row.titleMr,
        }))
      );
    });
  };
  const getGender = () => {
    axios.get(`${urls.OPENCFCURL}/master/gender/getAll`).then((r) => {
      console.log("res title", r);
      setGenderNames(
        r.data.gender.map((row) => ({
          id: row.id,
          gender: row.gender,
          genderMr: row.genderMr,
        }))
      );
    });
  };

  const onFinish = (values) => {
    console.log("values", values);

    const body = {
      firstName: values?.societyName + " - " + values?.firstName,
      middleName: values.middleName,
      surname: values.lastName,
      // dateOfBirth: "1995-10-25",
      emailID: values.email,
      mobile: values.mobileNumber,
      username: values.loginId,
      password: values.password,
      hintQuestion: values.hintQuestion,
      answer: values.hintQuestionAnswer,
      zone: values.zoneName,
      ward: values.wardName,
      title: values.title,
      gender: values.gender,
      cflatBuildingNo: values.buildingNo,
      cbuildingName: values.buildingName,
      croadName: values.roadName,
      // clandmark: values.landmark,
      cState: values.cState,
      cCity: values.cCity,
      cpinCode: values.pinCode,
      firstNamemr: values.firstNameMr,
      middleNamemr: values.middleNameMr,
      surnamemr: values.lastNameMr,
      // cCityMr: value.cCityMr,
      // cStateMr:value.cStateMr,
      // clandmarkMr: value.landmarkMr,
      // croadNameMr: value.roadNameMr,
      // cbuildingNameMr: value.buildingNameMr,
      // cflatBuildingNoMr: value.flatBuildingNoMr,
      // permanentAddress: "True",
      // plandmark: "Pune",
      societyChecked: societyChecked,
    };

    console.log("body", body);

    const headers = { Accept: "application/json" };

    axios
      .post(`${urls.AuthURL}/citizen/register`, body, { headers })
      .then((r) => {
        if (r.status == 200) {
          console.log("res", r);
          toast("Registered Successfully", {
            type: "success",
          });
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log("err", err);
        toast("Registeration Failed ! Please Try Again !", {
          type: "error",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit(onFinish)}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Grid container>
            <Grid item xs={6}>
              <div>
                {/* <img className={styles.bgLeft} src={"/sign.jpg"} alt="test" /> */}
              </div>
              <div className={styles.main}>
                <div className={styles.part}>
                  <div className={styles.left}>
                    <AppBarComponent />
                    <Box className={styles.welcome} p={1}>
                      <Box sx={{ display: "flex" }}>
                        <Grid item sx={{ marginLeft: -25 }}>
                          <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{
                              paddingLeft: "10px",
                              color: "blue",
                            }}
                            onClick={() =>
                              router.push({
                                pathname: "/login",
                              })
                            }
                          >
                            <ArrowBackIcon />
                          </IconButton>
                        </Grid>
                        <Grid item sx={{ marginLeft: 27 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            WELCOME TO
                          </Typography>
                        </Grid>
                      </Box>
                      <Typography variant="h6">
                        Pimpri Chinchwad Citizen Service Portal
                      </Typography>
                    </Box>
                    {/* <Box className={styles.welcome} p={1}>
                  <Typography variant="h1">WELCOME TO</Typography>
                  <Typography variant="h2">Pimpri Chinchwad Citizen Service Portal</Typography>
                </Box> */}
                    <div className={styles.form}>
                      <div className={styles.fields}>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                          py={1}
                        >
                          <Grid item xs={3.8}>
                            {/* <Typography>First name</Typography> */}
                            <TextField
                              variant="outlined"
                              // required={field.required}
                              label="First Name"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              {...register("firstName")}
                              error={errors.firstName}
                              // helperText = {`errors.${field.stateName}.message`}
                              helperText={errors.firstName?.message}
                            />
                          </Grid>

                          <Grid item xs={3.8}>
                            {/* <Typography>Middle name</Typography> */}
                            <TextField
                              variant="outlined"
                              // required={field.required}
                              label="Middle Name"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              error={errors.middleName}
                              {...register("middleName")}
                              // helperText = {`errors.${field.stateName}.message`}
                              helperText={errors.middleName?.message}
                            />
                          </Grid>

                          <Grid item xs={3.8}>
                            {/* <Typography>Last name</Typography> */}
                            <TextField
                              variant="outlined"
                              // required={field.required}
                              label="Last Name"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              {...register("lastName")}
                              error={errors.lastName}
                              // helperText = {`errors.${field.stateName}.message`}
                              helperText={errors.lastName?.message}
                            />
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                          py={1}
                        >
                          <Grid item xs={5}>
                            {/* <Typography>Mobile Number</Typography> */}
                            <TextField
                              variant="outlined"
                              label="Mobile Number"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              {...register("mobileNumber")}
                              error={errors.mobileNumber}
                              helperText={errors.mobileNumber?.message}
                            />
                          </Grid>
                          {!phoneNumberVerified ? (
                            <>
                              <Grid
                                item
                                xs={3}
                                style={{ display: "flex", alignItems: "end" }}
                              >
                                {!resendOTP ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <Button
                                      disabled={disabledGenrateOtpBtn}
                                      fullWidth
                                      size="small"
                                      variant="contained"
                                      onClick={() => {
                                        onGenerateOTPClick(
                                          "GENERATE_MOBILE_OTP"
                                        );
                                      }}
                                      sx={{
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        width: "80%",
                                        ":hover": {
                                          color: "white",
                                        },
                                      }}
                                      // className={styles.button}
                                    >
                                      GENERATE OTP
                                    </Button>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography sx={{ fontWeight: "900" }}>
                                        {mobileTimer}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <Button
                                      fullWidth
                                      disabled={disabledResendMobileOtp}
                                      //   size="small"
                                      variant="contained"
                                      onClick={() => {
                                        onGenerateOTPClick("RESEND_MOBILE_OTP");
                                      }}
                                      sx={{
                                        // backgroundColor: "#CAD9E5",
                                        backgroundColor: "#0070f3",
                                        color: "white",
                                        width: "80%",
                                        ":hover": {
                                          color: "white",
                                        },
                                      }}
                                      // className={styles.button}
                                    >
                                      RESEND OTP
                                    </Button>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography sx={{ fontWeight: "900" }}>
                                        {mobileTimer}
                                      </Typography>
                                    </Box>
                                  </Box>
                                )}
                              </Grid>
                              <Grid item xs={3}>
                                {/* <Typography>Verify OTP</Typography> */}
                                <TextField
                                  variant="outlined"
                                  inputProps={{ minLength: 6, maxLength: 6 }}
                                  fullWidth
                                  label="Verify OTP"
                                  size="small"
                                  sx={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: "5px",
                                  }}
                                  {...register("mobileOtp")}
                                  error={phoneNumberVerified === false}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment
                                        position="end"
                                        onClick={() => {
                                          verifyOTP();
                                        }}
                                      >
                                        <Tooltip title="Verify Mobile OTP">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            // onClick={handleClickShowPassword}
                                            edge="end"
                                          >
                                            <ArrowForwardIcon />
                                          </IconButton>
                                        </Tooltip>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                            </>
                          ) : (
                            <Grid
                              item
                              xs={7}
                              style={{
                                display: "flex",
                                alignItems: "end",
                              }}
                            >
                              <Box
                                p={1}
                                sx={{
                                  color: "green",
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "5px",
                                  width: "100%",
                                }}
                              >
                                Phone number verified successfully
                              </Box>
                            </Grid>
                          )}
                        </Grid>

                        <Grid
                          container
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                          py={1}
                        >
                          <Grid item xs={5}>
                            {/* <Typography>Email Address</Typography> */}
                            <TextField
                              variant="outlined"
                              label="Email Address"
                              fullWidth
                              disabled={emailVerified}
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                                "&.MuiFormHelperText-root.Mui-error": {
                                  color: "red",
                                },
                              }}
                              //   onChange={(e) => setUser(e.target.value)}
                              {...register("email")}
                              error={errors.email}
                              helperText={errors.email?.message}
                              InputProps={{ autoComplete: "off" }}
                            />
                            <Box
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Checkbox
                                checked={emailChecked}
                                onChange={handleEmailCheckedChange}
                                inputProps={{ "aria-label": "controlled" }}
                              />
                              <Typography>
                                Use my email id as login id
                              </Typography>
                            </Box>
                          </Grid>
                          {/* email otp */}
                          {!emailVerified ? (
                            <>
                              <Grid
                                item
                                xs={3}
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  paddingTop: 3.4,
                                }}
                              >
                                {!resendEmailOTP ? (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <Button
                                      disabled={disabledResendMobileOtp}
                                      fullWidth
                                      size="small"
                                      variant="contained"
                                      onClick={() => {
                                        onGenerateEmailOTPClick(
                                          "GENERATE_EMAIL_OTP"
                                        );
                                      }}
                                      sx={{
                                        backgroundColor: "#67CB33",
                                        color: "white",
                                        width: "80%",
                                        ":hover": {
                                          color: "white",
                                        },
                                      }}
                                      // className={styles.button}
                                    >
                                      GENERATE OTP
                                    </Button>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography sx={{ fontWeight: "900" }}>
                                        {timer}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      width: "100%",
                                    }}
                                  >
                                    <Button
                                      disabled={disabledResendEmailOtp}
                                      fullWidth
                                      size="small"
                                      variant="contained"
                                      onClick={() => {
                                        onGenerateEmailOTPClick(
                                          "RESEND_EMAIL_OTP"
                                        );
                                      }}
                                      sx={{
                                        backgroundColor: "#67CB33",
                                        color: "white",
                                        width: "80%",
                                        ":hover": {
                                          color: "white",
                                        },
                                      }}
                                      // className={styles.button}
                                    >
                                      RESEND OTP
                                    </Button>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography sx={{ fontWeight: "900" }}>
                                        {timer}
                                      </Typography>
                                    </Box>
                                  </Box>
                                )}
                              </Grid>
                              <Grid item xs={3}>
                                {/* <Typography>Verify OTP</Typography> */}
                                <TextField
                                  variant="outlined"
                                  label="Verify OTP"
                                  fullWidth
                                  size="small"
                                  inputProps={{ minLength: 6, maxLength: 6 }}
                                  sx={{
                                    backgroundColor: "#FFFFFF",
                                    borderRadius: "5px",
                                  }}
                                  {...register("emailOtp")}
                                  error={emailVerified === false}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment
                                        position="end"
                                        onClick={() => {
                                          verifyEmailOTP();
                                        }}
                                      >
                                        <Tooltip title="Verify Email OTP">
                                          <IconButton
                                            aria-label="toggle password visibility"
                                            // onClick={handleClickShowPassword}
                                            edge="end"
                                          >
                                            <ArrowForwardIcon />
                                          </IconButton>
                                        </Tooltip>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              </Grid>
                            </>
                          ) : (
                            <Grid
                              item
                              xs={7}
                              style={{
                                display: "flex",
                                alignItems: "end",
                              }}
                            >
                              <Box
                                p={1}
                                sx={{
                                  color: "green",
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "5px",
                                  width: "100%",
                                }}
                              >
                                Email verified successfully
                              </Box>
                            </Grid>
                          )}
                        </Grid>

                        {/*                      <Grid
                        container
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                        }}
                        py={1}
                      >

                      </Grid> */}

                        {/* <Grid
                        container
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                        }}
                      > */}
                        {/*    <Grid item xs={5}>
                          <FormControl
                            variant="standard"
                            fullWidth
                            error={!!errors.zoneName}
                            size="small"
                            sx={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '5px',
                            }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Zone
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  size="small"
                                  onChange={(value) => field.onChange(value)}
                                  label="zoneName"
                                >
                                  {zoneNames &&
                                    zoneNames.map((zoneName, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={zoneName.id}
                                        >
                                          {language == 'en'
                                            ? zoneName?.zoneName
                                            : zoneName?.zoneNameMr}
                                        </MenuItem>
                                      )
                                    })}
                                </Select>
                              )}
                              name="zoneName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.zoneName
                                ? errors.zoneName.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                          <FormControl
                            variant="standard"
                            error={!!errors.wardName}
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: '#FFFFFF',
                              borderRadius: '5px',
                            }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Ward
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="wardName"
                                >
                                  {wardNames &&
                                    wardNames.map((wardName, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={wardName.id}
                                        >
                                          {language == 'en'
                                            ? wardName?.wardName
                                            : wardName?.wardNameMr}
                                        </MenuItem>
                                      )
                                    })}
                                </Select>
                              )}
                              name="wardName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.wardName
                                ? errors.wardName.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid> */}
                        {/* </Grid> */}
                        <Grid
                          container
                          spacing={2}
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                          py={1}
                        >
                          <Grid item xs={5}>
                            {/* <Typography>Gender</Typography> */}

                            <FormControl
                              variant="outlined"
                              size="small"
                              fullWidth
                              error={!!errors.gender}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Gender
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{
                                      backgroundColor: "#FFFFFF",
                                      borderRadius: "5px",
                                    }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Gender"
                                  >
                                    {genderNames?.map((val, index) => {
                                      return (
                                        <MenuItem key={index} value={val.id}>
                                          {val.gender}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="gender"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.gender ? errors.gender.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid item xs={5}>
                            {/* <Typography>Login ID</Typography> */}
                            <TextField
                              variant="outlined"
                              label="Login ID"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              {...register("loginId")}
                              helperText={errors.loginId?.message}
                              error={errors.loginId}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                          py={1}
                        >
                          <Grid item xs={5}>
                            {/* <Typography>Password</Typography> */}
                            <TextField
                              InputLabelProps={{
                                style: { color: "#000000", fontSize: "15px" },
                              }}
                              label="Password"
                              InputProps={{
                                style: { fontSize: "15px" },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                    >
                                      {showPassword ? (
                                        <VisibilityIcon />
                                      ) : (
                                        <VisibilityOffIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              {...register("password")}
                              helperText={errors.password?.message}
                              error={errors.password}
                              inputProps={{ style: { fontSize: "15px" } }}
                              variant="outlined"
                              fullWidth
                              type={showPassword ? "" : "password"}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={5}>
                            {/* <Typography>Confirm Password</Typography> */}
                            {/* <TextField
                            variant="outlined"
                            // label="Confirm Password"
                            fullWidth
                            size="small"
                            sx={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                            }}
                            {...register("passwordConfirmation")}
                            helperText={errors.passwordConfirmation?.message}
                            error={errors.passwordConfirmation}
                          /> */}
                            <TextField
                              InputLabelProps={{
                                style: { color: "#000000", fontSize: "15px" },
                              }}
                              label="Confirm Password"
                              InputProps={{
                                style: { fontSize: "15px" },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowConfirmPassword}
                                    >
                                      {showConfirmPassword ? (
                                        <VisibilityIcon />
                                      ) : (
                                        <VisibilityOffIcon />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              {...register("passwordConfirmation")}
                              helperText={errors.passwordConfirmation?.message}
                              error={errors.passwordConfirmation}
                              inputProps={{ style: { fontSize: "15px" } }}
                              variant="outlined"
                              fullWidth
                              type={showConfirmPassword ? "" : "password"}
                              size="small"
                            />
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                          py={1}
                        >
                          <Grid item xs={11}>
                            {/* <Typography>Hint Question</Typography> */}
                            <FormControl
                              variant="outlined"
                              size="small"
                              fullWidth
                              error={!!errors.hintQuestion}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                Hint Question
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{
                                      backgroundColor: "#FFFFFF",
                                      borderRadius: "5px",
                                    }}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label="Hint Question"
                                  >
                                    {questions?.map((val, index) => {
                                      return (
                                        <MenuItem
                                          key={index}
                                          value={val.id}
                                          style={{
                                            display: val?.question
                                              ? "flex"
                                              : "none",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {val?.question}
                                        </MenuItem>
                                      );
                                    })}
                                  </Select>
                                )}
                                name="hintQuestion"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.hintQuestion
                                  ? errors.hintQuestion.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                          py={1}
                        >
                          <Grid item xs={11}>
                            {/* <Typography>Answer</Typography> */}
                            <TextField
                              variant="outlined"
                              label="Answer"
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              {...register("hintQuestionAnswer")}
                              helperText={errors.hintQuestionAnswer?.message}
                              error={errors.hintQuestionAnswer}
                            />
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "10px",
                          }}
                        >
                          <Grid
                            item
                            xs={5}
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              checked={societyChecked}
                              onChange={handleSocietyCheckedChange}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                            <Typography>Register Society Name</Typography>
                          </Grid>
                          <Grid item xs={7}>
                            {societyChecked && (
                              <TextField
                                variant="outlined"
                                fullWidth
                                label="Society Name"
                                size="small"
                                sx={{
                                  backgroundColor: "#FFFFFF",
                                  borderRadius: "5px",
                                }}
                                {...register("societyName")}
                              />
                            )}
                          </Grid>
                        </Grid>

                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "15px",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            // disabled={!emailVerified}
                            sx={{
                              width: "50%",
                              backgroundColor: "#CAD9E5",
                              color: "black",
                              ":hover": {
                                bgcolor: "blue", // theme.palette.primary.main
                                color: "#fff",
                              },
                            }}
                            type="submit"
                          >
                            SIGN UP
                          </Button>
                        </Box>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "15px",
                          }}
                        >
                          <Typography>
                            Already have an account?
                            <Link
                              onClick={() => {
                                router.push("/login");
                              }}
                            >
                              {" "}
                              Login here
                            </Link>
                          </Typography>
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div>
                <img
                  className={styles.bgRight}
                  src={"/sign.jpg"}
                  alt="bg-img"
                  style={{ width: "98%" }}
                />
              </div>
              <div className={styles.right}>
                <div className={styles.footer}>
                  <h4>© 2024, Developed Under GIS Enabled ERP Project</h4>
                </div>
              </div>
            </Grid>
          </Grid>
        </>
      )}
    </form>
  );
};

export default Register;
