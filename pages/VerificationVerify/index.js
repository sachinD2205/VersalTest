import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/[VerificationLogin].module.css";
import axios from "axios";
import urls from "../../URLS/urls";
import sweetAlert from "sweetalert";
import Loader from "../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import { mountLabels, language } from "../../features/labelSlice";
import loginLabels from "../../containers/reuseableComponents/labels/common/loginLabels";
import AppBarComponent from "../../containers/Layout/components/AppBarComponent";

const VerificationVerify = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // const [otp, setOtp] = useState(new Array(4).fill(""));
  const [otp, setOtp] = useState(0);
  const [isError, setIsError] = useState(false);
  const [sentPasswordLink, setSentPasswordLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const _language = useSelector((state) => {
    return state.labels.language;
  });

  useEffect(() => {
    console.log("router.query", router.query);
  }, []);

  const [timer, setTimer] = useState(30); // Initial timer value in seconds
  const [isResending, setIsResending] = useState(false);

  const handleResendClick = () => {
    // Handle OTP resend logic here
    // You can make an API call to request a new OTP, for example
    setIsResending(true);

    const finalBodyForApi = {
      username: router?.query?.username,
    };

    if (router?.query?.screen == "Citizen") {
      axios
        .post(
          `${urls.OPENCFCURL}/transaction/citizen/forgotPasswordSendOtp`,
          finalBodyForApi
        )
        .then((res) => {
          console.log("res", res);
          if (res.status == 200 || res.status == 201) {
            toast("OTP sent", {
              type: "success",
            });
          } else {
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error", err);
          sweetAlert(err?.response?.data?.message, "Try Again", "warning");
        });

      // Simulate API call with a delay (2 seconds)
      setTimeout(() => {
        setIsResending(false);
        setTimer(30); // Reset the timer
      }, 2000);
    } else if (router?.query?.screen == "Department") {
      axios
        .post(`${urls.AuthURL}/forgotPasswordSendOtp`, finalBodyForApi)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200 || res.status == 201) {
            toast("OTP sent", {
              type: "success",
            });
          } else {
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error", err);
          sweetAlert(err?.response?.data?.message, "Try Again", "warning");
        });

      // Simulate API call with a delay (2 seconds)
      setTimeout(() => {
        setIsResending(false);
        setTimer(30); // Reset the timer
      }, 2000);
    } else if (router?.query?.screen == "CFC") {
      axios
        .post(`${urls.AuthURL}/forgotPasswordSendOtp`, finalBodyForApi)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200 || res.status == 201) {
            toast("OTP sent", {
              type: "success",
            });
          } else {
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error", err);
          sweetAlert(err?.response?.data?.message, "Try Again", "warning");
        });

      // Simulate API call with a delay (2 seconds)
      setTimeout(() => {
        setIsResending(false);
        setTimer(30); // Reset the timer
      }, 2000);
    } else {
    }
  };

  useEffect(() => {
    let countdown;

    if (timer > 0 && !isResending) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(countdown);
    }

    return () => clearInterval(countdown);
  }, [timer, isResending]);

  const handleChange = (otp) => {
    setOtp(otp);
  };

  const onFinish = (values) => {
    if (otp?.length < 6) {
      toast("Incomplete OTP", {
        type: "error",
      });
      return;
    }
    setLoading(true);
    // setSentPasswordLink(true);
    setIsError(true);

    const finalBodyForApi = {
      username: router.query.username,
      otp: otp,
    };

    if (router?.query?.screen == "Citizen") {
      axios
        .post(
          `${urls.OPENCFCURL}/transaction/citizen/forgotPassword`,
          finalBodyForApi
        )
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res?.data?.status == "FAILURE") {
            toast("Invalid OTP or Something went wrong", {
              type: "error",
            });
          } else {
            // sweetAlert("Default password sent on your mail", "Done", "success");
            sweetAlert({
              title: "Done",
              text: "Default password sent on your mail",
              icon: "success",
              dangerMode: true,
              button: "Ok",
              closeOnClickOutside: false,
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false,
            }).then((willDelete) => {
              router.push("/login");
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error", err);
          toast("Invalid OTP or Something went wrong", {
            type: "error",
          });
        });
    } else if (router?.query?.screen == "Department") {
      axios
        .post(`${urls.AuthURL}/forgotPassword`, finalBodyForApi)
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res?.data?.status == "FAILURE") {
            toast("Invalid OTP or Something went wrong", {
              type: "error",
            });
          } else {
            // sweetAlert("Default password sent on your mail", "Done", "success");
            sweetAlert({
              title: "Done",
              text: "Default password sent on your mail",
              icon: "success",
              dangerMode: true,
              button: "Ok",
              closeOnClickOutside: false,
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false,
            }).then((willDelete) => {
              router.push("/login");
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error", err);
          toast("Invalid OTP or Something went wrong", {
            type: "error",
          });
        });
    } else if (router?.query?.screen == "CFC") {
      axios
        .post(`${urls.AuthURL}/forgotPassword`, finalBodyForApi)
        .then((res) => {
          setLoading(false);
          console.log("res", res);
          if (res?.data?.status == "FAILURE") {
            toast("Invalid OTP or Something went wrong", {
              type: "error",
            });
          } else {
            sweetAlert({
              title: "Done",
              text: "Default password sent on your mail",
              icon: "success",
              dangerMode: true,
              button: "Ok",
              closeOnClickOutside: false,
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false,
            }).then((willDelete) => {
              router.push("/login");
            });
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log("Error", err);
          toast("Invalid OTP or Something went wrong", {
            type: "error",
          });
        });
    } else {
    }
  };

  const handleChangeLanguage = (e) => {
    e == "ENG" ? dispatch(language("en")) : dispatch(language("mr"));
  };

  const findLoginLabel = (id) => {
    if (_language) {
      return loginLabels[_language][id];
    } else {
      return loginLabels["mr"][id];
    }
  };

  return (
    <Box className={styles.main}>
      {loading ? (
        <Loader />
      ) : (
        <Grid container>
          <Grid item xs={6}>
            <div>
              <img className={styles.bgLeft} src={"/sign.jpg"} alt="test" />
            </div>
            <div className={styles.main}>
              <div className={styles.part}>
                <div className={styles.left}>
                  {/* <div className={styles.header}>
                  <div className={styles.leftHeader}>
                    <img
                      className={styles.logoLeft}
                      src={"/logo.png"}
                      alt="pcmcLogo"
                    />
                    <Typography variant="h5">
                      Pimpri Chinchwad Municipal Corporation
                    </Typography>
                  </div>
                  <img
                    className={styles.logoRight}
                    src={"/smartCityPCMC.png"}
                    alt="pcmcLogo"
                  />
                </div> */}
                  <AppBarComponent />
                  <Grid
                    container
                    // className={styles.welcome}
                    style={{ backgroundColor: "#F7F7F7" }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "11%",
                        right: "1%",
                        // width: '100%',
                        // display: 'flex',
                        // justifyContent: 'end',
                      }}
                    >
                      {_language == "en" ? (
                        <Avatar
                          onClick={() => {
                            handleChangeLanguage("MAR");
                          }}
                          sx={{
                            width: "35px",
                            height: "35px",
                            bgcolor: "#3B90DB",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                        >
                          म
                        </Avatar>
                      ) : (
                        <Avatar
                          onClick={() => {
                            handleChangeLanguage("ENG");
                          }}
                          sx={{
                            width: "35px",
                            height: "35px",

                            bgcolor: "#3B90DB",
                            cursor: "pointer",
                            fontSize: "15px",
                          }}
                        >
                          ENG
                        </Avatar>
                      )}
                    </Box>
                    <Grid
                      item
                      xs={1}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          router.back();
                        }}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h5">
                        {findLoginLabel("welcomeTo")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="h6">
                        {findLoginLabel("pcmcNameNew")}
                      </Typography>
                    </Grid>
                  </Grid>
                  {sentPasswordLink ? (
                    <Box
                      sx={{
                        height: "50%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          borderRadius: "5px",
                          width: "40%",
                          height: "40%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fff",
                          color: "#000",
                        }}
                      >
                        <Typography variant="body1">
                          Password reset link has been sent
                        </Typography>
                        <Typography variant="body1">
                          to your registered{" "}
                        </Typography>
                        <Typography variant="body1">
                          Email id/Phone Number
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      <Box className={styles.welcome} p={2}>
                        <Typography variant="h5">
                          {findLoginLabel("verification")}
                        </Typography>
                        <Typography variant="subtitle1">
                          {findLoginLabel("enterTheOtpReceivedOnYourEmail_ID")}
                        </Typography>
                      </Box>
                      <Box className={styles.welcome}>
                        <Typography variant="subtitle1">
                          {findLoginLabel("otp")}
                        </Typography>
                      </Box>

                      <div className={styles.form}>
                        <div className={styles.fields}>
                          <Box>
                            <Grid
                              container
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                              spacing={2}
                            >
                              <Grid item>
                                <Box
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                  }}
                                >
                                  <OtpInput
                                    placeholder="000000"
                                    value={otp}
                                    isInputNum={true}
                                    shouldAutoFocus={true}
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    inputStyle={{
                                      margin: "5px",
                                      width: "30px",
                                      height: "30px",
                                    }}
                                    numInputs={6}
                                    separator={<span>-</span>}
                                    hasErrored={isError}
                                    errorStyle={{
                                      border: "1px solid red",
                                    }}
                                  />
                                </Box>
                              </Grid>

                              {/* <Grid
                              item
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <Typography>
                                Didn't received the verification OTP?{" "}
                                <Link href="#">Resend again</Link>
                              </Typography>
                            </Grid> */}
                              <Grid
                                item
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <p style={{ color: "white" }}>
                                  {_language == "en"
                                    ? `Resend OTP in ${timer} seconds`
                                    : `${timer} सेकंदात ओटीपी पुन्हा पाठवा`}
                                  {!isResending ? (
                                    <Button
                                      onClick={handleResendClick}
                                      disabled={timer > 0}
                                      size="small"
                                      variant="contained"
                                      color="error"
                                      sx={{ marginLeft: "10px" }}
                                    >
                                      {findLoginLabel("resend")}
                                    </Button>
                                  ) : (
                                    <Box>{findLoginLabel("resending")}</Box>
                                  )}
                                </p>
                              </Grid>
                              <Grid
                                item
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={onFinish}
                                  type="submit"
                                >
                                  {findLoginLabel("verify")}
                                </Button>
                              </Grid>
                              <Grid item></Grid>
                              {/* <Grid item>
                              <div className={styles.formbottom}>
                                <Typography>
                                  Don't have an account?{" "}
                                  <Link
                                    onClick={() => {
                                      router.push("/Register");
                                    }}
                                    color="inherit"
                                  >
                                    Sign up here
                                  </Link>
                                </Typography>
                              </div>
                            </Grid> */}
                            </Grid>
                          </Box>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Grid>
          <Grid
            item
            xs={6}
            // sx={{
            //   "@media (max-width: 650px)": {
            //     display: "none",
            //   },
            // }}
          >
            {/* <div>
            <img className={styles.bgRight} src={"/sign.jpg"} alt="bg-img" />
          </div> */}
            <div className={styles.right}>
              <div className={styles.footer}>
                <h4>{findLoginLabel("footer")}</h4>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default VerificationVerify;
