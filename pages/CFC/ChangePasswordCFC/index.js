import React from "react";
import { useState } from "react";
import styles from "../../../styles/[ResetPassword].module.css";
// import styles from "../../../styles/resetPassword.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
//import axios from 'axios'

import schema from "../../../containers/schema/ResetPasswordSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InsuranceTwoTone } from "@ant-design/icons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import axios from "axios";
import {
  logout,
  setApplicationName,
  setCitizenDashboardTabsValue,
  setUsersCitizenDashboardData,
} from "../../../features/userSlice";
import { toast } from "react-toastify";
import { catchExceptionHandlingMethod } from "../../../util/util";

const ChangePasswordCFC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const user = useSelector((state) => {
    return state.user.user;
  });

  const language = useSelector((state) => state.labels.language);

  const dispatch = useDispatch();

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

  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const exitButton = () => {
    router.push("/CFC_Dashboard");
  };

  const onFinish = (values) => {
    console.log("values", values, user);

    const body = {
      id: user?.id,
      oldPassword: values?.oldPassword,
      newPassword: values?.newPassword,
      confirmPassword: values?.confirmPassword,
    };

    axios
      .post(`${urls.AuthURL}/changeUserPassword`, body)
      .then((r) => {
        console.log("res", r);
        if (r.status == 201) {
          if (
            r.data.message == "OLD PASSWORD AND NEW PASSWORD CANNOT BE SAME"
          ) {
            toast(
              language == "en"
                ? "Old Password And New Password Cannot Be Same"
                : "जुना पासवर्ड आणि नवीन पासवर्ड एकच असू शकत नाही",
              {
                type: "error",
              }
            );
            return;
          } else if (
            r.data.message == "CONFIRM PASSWORD AND NEW PASSWORD SHOULD BE SAME"
          ) {
            toast("Confirm Password And New Password Should Be Same", {
              type: "error",
            });
            return;
          } else {
            sweetAlert({
              title: language == "en" ? "Done" : "यशस्वी",
              text:
                language == "en"
                  ? "Password Changed Successfully"
                  : "पासवर्ड यशस्वीरित्या बदलला",
              icon: "success",
              dangerMode: true,
              button: "Ok",
              closeOnClickOutside: false,
              allowOutsideClick: false, // Prevent closing on outside click
              allowEscapeKey: false,
            }).then((willDelete) => {
              console.log("willDe", willDelete);
              dispatch(logout());
              dispatch(setUsersCitizenDashboardData(null));
              dispatch(setCitizenDashboardTabsValue(1));
              router.push("/login");
              // router.push("/dashboard");
            });
            // dispatch(login(r.data.userDetails));
            // dispatch(setMenu(r.data.menuCodes));
            // router.push("/");
          }
        } else {
          console.log("error");
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });

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
    <Box
      sx={{
        width: "50%",
        margin: "4%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        marginLeft: "23%",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
        }}
        style={{ backgroundColor: "#BFC9CA  " }}
      >
        <AppBar position="static" sx={{ backgroundColor: "#FBFCFC " }}>
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,
                color: "#2980B9",
              }}
              onClick={() => exitButton()}
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography
              sx={{
                textAlignVertical: "center",
                textAlign: "center",
                color: "rgb(7 110 230 / 91%)",
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                typography: {
                  xs: "body1",
                  sm: "h6",
                  md: "h5",
                  lg: "h4",
                  xl: "h3",
                },
              }}
            >
              <FormattedLabel id="resetP" />
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Paper
        sx={{
          margin: 1,
          padding: 2,
          backgroundColor: "#F5F5F5",
        }}
        elevation={5}
      >
        {/* <Box className={styles.tableHead}>
            <Box className={styles.feildHead}>
cc
            </Box>
          </Box> */}
        <br />
        <form onSubmit={handleSubmit(onFinish)}>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              {/* <TextField
                  size="small"
                  sx={{
                    width: "80%",
                    backgroundColor: "white",
                  }}
                  id="outlined-basic"
                  label="Old Password"
                  variant="outlined"
                  {...register("oldPassword")}
                  error={!!errors.oldPassword}
                  helperText={
                    errors?.oldPassword ? errors.oldPassword.message : null
                  }
                /> */}
              <TextField
                variant="outlined"
                error={false}
                fullWidth
                size="small"
                label={<FormattedLabel id="oldP" />}
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
                        onClick={handleClickShowOldPassword}
                      >
                        {showOldPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showOldPassword ? "" : "password"}
                {...register("oldPassword")}
                helperText={errors.oldPassword?.message}
              />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              {/* <TextField
                  size="small"
                  sx={{
                    width: "80%",
                    backgroundColor: "white",
                  }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="newP" />}
                  label="New Password"
                  variant="outlined"
                  {...register("newPassword")}
                  error={!!errors.newPassword}
                  helperText={
                    errors?.newPassword ? errors.newPassword.message : null
                  }
                /> */}
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                label={<FormattedLabel id="newP" />}
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
                        {showNewPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showNewPassword ? "" : "password"}
                {...register("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
              />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid item xs={12}>
              {/* <TextField
                  size="small"
                  sx={{
                    width: "80%",
                    backgroundColor: "white",
                  }}
                  id="outlined-basic"
                  label="Confirm Password"
                  variant="outlined"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={
                    errors?.confirmPassword
                      ? errors.confirmPassword.message
                      : null
                  }
                /> */}
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                label={<FormattedLabel id="confirmP" />}
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
                        {showConfirmPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                type={showConfirmPassword ? "" : "password"}
                {...register("confirmPassword")}
                helperText={errors.confirmPassword?.message}
                error={!!errors.confirmPassword}
              />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="submit"
                size="small"
                color="success"
                variant="outlined"
                endIcon={<SaveIcon />}
              >
                <FormattedLabel id="save" />
              </Button>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                variant="outlined"
                color="primary"
                endIcon={<ClearIcon />}
                onClick={() => {
                  reset({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                <FormattedLabel id="clear" />
              </Button>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                color="error"
                variant="outlined"
                endIcon={<ExitToAppIcon />}
                onClick={() => exitButton()}
              >
                {<FormattedLabel id="exit" />}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ChangePasswordCFC;
