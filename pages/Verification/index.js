import React from "react";
import { useState } from "react";
import styles from "../../styles/[verification].module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { TextField, Box, Button, Typography, Grid, Link, IconButton } from "@mui/material";
import OtpInput from "react-otp-input";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Verification = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // const [otp, setOtp] = useState(new Array(4).fill(""));
  const [otp, setOtp] = useState(0);
  const [isError, setIsError] = useState(false);

  const [otpValue, setOtpValue] = useState("");
  const handleChange = (otp) => {
    setOtp(otp);
  };

  //   const handlelOTPChange = (e, index) => {
  //     console.log("e.nextSibling", e);
  //     if (isNaN(e.target.value)) return false;
  //     setOtp([
  //       ...otp.map((d, idx) => {
  //         return idx === index ? e.target.value : d;
  //       }),
  //     ]);

  //     if (e.nextSibling) {
  //       e.nextSibling.focus();
  //     }
  //   };

  const onFinish = (values) => {
    console.log("values", values);
    setIsError(true);
    // axios.post('http://localhost:5000/pcmc/loginApi', body).then((r) => {
    //   if (r.status == 200) {
    //     console.log('res', r.data.menuCodes)
    //     dispatch(login(r.data.userDetails))
    //     dispatch(setMenu(r.data.menuCodes))
    //     router.push('/')
    //   } else {
    //     message.error('Login Failed ! Please Try Again !')
    //   }
    // })

    // if (user === "Admin" && pwd === "12345") {
    if (true) {
      //   dispatch(login(userDetails));
      //   dispatch(setMenu(backEndApiMenu));
      // router.push("/dashboard");
      // router.push("/Register");
    } else {
      // message.error("Login Failed ! Please Try Again !");
    }
  };

  return (
    <Box className={styles.main}>
      <Grid container>
        <Grid item xs={6}>
          <div>
            <img className={styles.bgLeft} src={"/sign.jpg"} alt="test" />
          </div>
          <div className={styles.main}>
            <div className={styles.part}>
              <div className={styles.left}>
                <div className={styles.header}>
                  <div className={styles.leftHeader}>
                    <img className={styles.logoLeft} src={"/logo.png"} alt="pcmcLogo" />
                    <Typography variant="h5">Pimpri Chinchwad Municipal Corporation</Typography>
                  </div>
                  <img className={styles.logoRight} src={"/smartCityPCMC.png"} alt="pcmcLogo" />
                </div>

                <Grid container direction="column" style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                  <Grid item>
                    <Grid container>
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
                        <Typography variant="h5">WELCOME TO</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="h6">Pimpri Chinchwad Citizen Service Portal</Typography>
                  </Grid>
                </Grid>
                <Box className={styles.welcome} p={2}>
                  <Typography variant="h5">VERIFICATION</Typography>
                  <Typography variant="subtitle1">
                    Enter the OTP received on your Email ID/Phone number
                  </Typography>
                </Box>
                <Box className={styles.welcome}>
                  <Typography variant="subtitle1">OTP</Typography>
                </Box>

                <div className={styles.form}>
                  <div className={styles.fields}>
                    <Box>
                      <Grid container style={{ display: "flex", flexDirection: "column" }} spacing={2}>
                        <Grid item>
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "center",
                            }}
                          >
                            <OtpInput
                              placeholder="0000"
                              value={otp}
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              inputStyle={{
                                margin: "5px",
                                width: "30px",
                                height: "30px",
                              }}
                              numInputs={4}
                              separator={<span>-</span>}
                              hasErrored={isError}
                              errorStyle={{
                                border: "1px solid red",
                              }}
                            />
                            {/* {otp.map((data, index) => {
                              return (
                                <Box
                                  key={index}
                                  m={1}
                                  style={{
                                    width: "8%",
                                  }}
                                >
                                  <TextField
                                    value={data}
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => {
                                      handlelOTPChange(e, index);
                                    }}
                                    variant="outlined"
                                    size="small"
                                    inputProps={{
                                      maxLength: 1,
                                      style: { textAlign: "center" },
                                    }}
                                    sx={{
                                      backgroundColor: "#FFFFFF",
                                      borderRadius: "5px",
                                      "& .MuiFormHelperText-root": {
                                        color: "red",
                                      },
                                    }}
                                  />
                                </Box>
                              );
                            })} */}
                          </Box>
                        </Grid>
                        <Grid item style={{ display: "flex", justifyContent: "center" }}>
                          <Typography>
                            Didn't received the verification OTP? <Link href="#">Resend again</Link>
                          </Typography>
                        </Grid>
                        <Grid item style={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={onFinish}
                            sx={{
                              width: "50%",
                              backgroundColor: "#3B90DB",
                              color: "#FFF",
                            }}
                            className={styles.button}
                            type="submit"
                          >
                            Login
                          </Button>
                        </Grid>
                        <Grid item></Grid>
                        <Grid item>
                          <div className={styles.formbottom}>
                            <Typography>Or</Typography>
                            <Typography>Continue without login</Typography>
                            <Typography>
                              Don't have an account?{" "}
                              <Link href="#" color="inherit">
                                Sign up here
                              </Link>
                            </Typography>
                          </div>
                        </Grid>
                      </Grid>
                    </Box>
                  </div>
                </div>
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
              <h4>© 2022, developed by Probity Software Ltd.</h4>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Verification;
