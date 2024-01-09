import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AppBarComponent from "../../containers/Layout/components/AppBarComponent";
import styles from "../../styles/[forgotPassword].module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../containers/schema/ForgotPasswordSchema";
import axios from "axios";
import urls from "../../URLS/urls";
import { mountLabels, language } from "../../features/labelSlice";
import loginLabels from "../../containers/reuseableComponents/labels/common/loginLabels";
import * as yup from "yup";
import Loader from "../../containers/Layout/components/Loader";
import { useEffect } from "react";

const ForgotPassword = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {},
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    getValues,
    formState: { errors },
  } = methods;

  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [isValidId, setIsValidId] = useState(true);
  const _language = useSelector((state) => {
    return state.labels.language;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("useEffect", router.query);
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    console.log("values", values);

    const finalBodyForApi = {
      username: values?.email,
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
            router.push({
              pathname: "/VerificationVerify",
              query: { username: values?.email, screen: router.query.screen },
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
    } else if (router?.query?.screen == "Department") {
      axios
        .post(`${urls.AuthURL}/forgotPasswordSendOtp`, finalBodyForApi)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200 || res.status == 201) {
            toast("OTP sent", {
              type: "success",
            });
            router.push({
              pathname: "/VerificationVerify",
              query: { username: values?.email, screen: router.query.screen },
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
    } else if (router?.query?.screen == "CFC") {
      axios
        .post(`${urls.AuthURL}/forgotPasswordSendOtp`, finalBodyForApi)
        .then((res) => {
          console.log("res", res);
          if (res.status == 200 || res.status == 201) {
            toast("OTP sent", {
              type: "success",
            });
            router.push({
              pathname: "/VerificationVerify",
              query: { username: values?.email, screen: router.query.screen },
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
    } else {
      toast("Something went wrong", {
        type: "error",
      });
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
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onFinish)}>
                <div>
                  <img className={styles.bgLeft} src={"/sign.jpg"} alt="test" />
                </div>
                <div className={styles.main}>
                  <div className={styles.part}>
                    <div className={styles.left}>
                      <AppBarComponent />
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

                      <Box className={styles.welcome} p={3}>
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
                        <Box sx={{ display: "flex" }}>
                          <Grid item sx={{ marginLeft: -35 }}>
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
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: "bold" }}
                            >
                              {findLoginLabel("welcomeTo")}
                            </Typography>
                          </Grid>
                        </Box>
                        <Typography variant="h6">
                          {findLoginLabel("pcmcNameNew")}
                        </Typography>
                      </Box>
                      <br />
                      <Box className={styles.welcome} py={1}>
                        <Typography variant="h1">
                          {findLoginLabel("forgotPassword")}
                        </Typography>
                        <h3 style={{ fontFamily: "Arial", paddingTop: 8 }}>
                          {findLoginLabel(
                            "enterYourRegisteredEmail_PhoneNumber"
                          )}
                        </h3>
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
                            <Controller
                              name="email" // Field name (should match the name in the form data)
                              control={control}
                              defaultValue="" // Default value
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={findLoginLabel("email_phoneNumber")}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  margin="normal"
                                  sx={{ backgroundColor: "white" }}
                                  error={errors.email}
                                  helperText={
                                    errors.email ? errors.email.message : null
                                  }
                                />
                              )}
                            />
                            {/* <TextField
                          variant="outlined"
                          fullWidth
                          size="small"
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "10px",
                          }}
                          // error={isValidId === false}
                          // onChange={(e) => setUserId(e.target.value)}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          {...register("email")}
                          error={errors.email}
                          helperText={
                            errors.email ? errors.email.message : null
                          }
                        /> */}
                          </Box>
                          <br />
                          <br />
                          <br />
                          <Box
                            py={1}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                backgroundColor: "#0070f3",
                                width: "100%",
                                color: "white",
                              }}
                              type="submit"
                            >
                              {findLoginLabel("next")}
                            </Button>
                          </Box>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          </Grid>
          <Grid item xs={6}>
            <div>
              <img className={styles.bgRight} src={"/sign.jpg"} alt="bg-img" />
            </div>
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

export default ForgotPassword;
