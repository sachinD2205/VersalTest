import React from "react";
import { useState } from "react";
import styles from "../../styles/[ResetPassword].module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { TextField, Box, Button, Typography, Grid, Link, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
//import axios from 'axios'

import schema from "../../containers/schema/ResetPasswordSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InsuranceTwoTone } from "@ant-design/icons";
import AppBarComponent from "../../containers/Layout/components/AppBarComponent";

const ResetPassword = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

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

  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const onFinish = (values) => {
    console.log("values", values);
    setIsPasswordUpdated(true);
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
    } else {
      // message.error("Login Failed ! Please Try Again !");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFinish)}>
      <Box className={styles.main}>
        <Grid container>
          <Grid item xs={6}>
            <div>
              <img className={styles.bgLeft} src={"/sign.jpg"} alt="test" />
            </div>
            <div className={styles.main}>
              <div className={styles.part}>
                <div className={styles.left}>
                  <AppBarComponent />
                  <Box className={styles.welcome} p={1}>
                    <Typography variant="h1">WELCOME TO</Typography>
                    <Typography variant="h2">Pimpri Chinchwad Citizen Service Portal</Typography>
                  </Box>

                  {!isPasswordUpdated ? (
                    <>
                      <Box className={styles.welcome} py={5}>
                        <Typography variant="h2">RESET PASSWORD</Typography>
                      </Box>
                      <div className={styles.form}>
                        <div
                          className={styles.fields}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            width: "60%",
                          }}
                        >
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          >
                            <Typography sx={{ color: "#000" }}>New Password</Typography>
                            <TextField
                              variant="outlined"
                              // required
                              // label={name}
                              error={false}
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              InputProps={{
                                style: { fontSize: "15px" },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowNewPassword}
                                    >
                                      {showNewPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              type={showNewPassword ? "" : "password"}
                              //   onChange={(e) => setUser(e.target.value)}
                              {...register("newPassword")}
                              helperText={errors.newPassword?.message}
                            />
                          </Box>
                          <Box
                            style={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                            py={2}
                          >
                            <Typography sx={{ color: "#000" }}>Confirm Password</Typography>
                            <TextField
                              variant="outlined"
                              // required
                              // label={name}
                              error={false}
                              fullWidth
                              size="small"
                              sx={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: "5px",
                              }}
                              InputProps={{
                                style: { fontSize: "15px" },
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowConfirmPassword}
                                    >
                                      {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              type={showConfirmPassword ? "" : "password"}
                              //   onChange={(e) => setUser(e.target.value)}
                              {...register("confirmPassword")}
                              helperText={errors.confirmPassword?.message}
                            />
                          </Box>

                          <Box
                            py={5}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                width: "100%",
                                backgroundColor: "#3B90DB",
                                color: "#FFF",
                              }}
                              className={styles.button}
                              type="submit"
                            >
                              RESET
                            </Button>
                          </Box>
                        </div>
                      </div>
                      <Box>
                        <div className={styles.formbottom}>
                          <Typography>
                            Don't have an account? <Link color="inherit">Sign up here</Link>
                          </Typography>
                        </div>
                      </Box>
                    </>
                  ) : (
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
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#fff",
                          color: "#000",
                        }}
                      >
                        <Typography variant="body1">Password Updated</Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          marginTop: "10%",
                          width: "60%",
                          backgroundColor: "#3B90DB",
                          color: "#FFF",
                        }}
                        className={styles.button}
                      >
                        LOGIN
                      </Button>
                    </Box>
                  )}
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
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
    </form>
  );
};

export default ResetPassword;
