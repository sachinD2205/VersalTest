import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Grid,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Timer from "otp-timer";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import OtpInput from "react-otp-input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css";
import { useSelector } from "react-redux";

/** Sachin Durge */
//AadhaarAuthentication
const AadharAuthentication = () => {
  const language = useSelector((state) => state?.labels?.language);
  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const [otpSuccessFullMessage, setOtpSuccessFullMessage] = useState(false);
  const [otpModal, setOtpModal] = useState(false);

  // Otp Modal Open
  const otpModalOpen = () => setOtpModal(true);
  const otpModalClose = () => setOtpModal(false);

  //  successfull otp
  const sendOtpNotify = () => {
    language =="en"?
    toast.success("otp sent successfully", {
      position: toast.POSITION.TOP_RIGHT,
    }): toast.success("OTP यशस्वीपणे पाठविला गेला आहे.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Resend otp
  const resendOtpAlert = () => {
    language =="en"?
    toast.warning("otp resend successfully", {
      position: toast.POSITION.TOP_RIGHT,
    }): toast.warning("otp यशस्वीपणे पुन्हा पाठविला गेला आहे.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Verified otp
  const verfiyOtpAlert = () => {
    language =="en"?
    toast.success("otp verified successfully", {
      position: toast.POSITION.TOP_RIGHT,
    }): toast.success("OTP यशस्वीरित्या सत्यापित केला गेला आहे.", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // worong otp
  const wrongOtpAlert = () => {
    language =="en"?
    toast.error("please enter correct otp", {
      position: toast.POSITION.TOP_RIGHT,
    }):toast.error("कृपया योग्य OTP प्रविष्ट करा", {
      position: toast.POSITION.TOP_RIGHT,
    })
  };

  // view
  return (
    <>
      <ToastContainer />
      <div className={HawkerReusableCSS.MainHeader}>
        <strong>{<FormattedLabel id="aadharAuthentication" />}</strong>
      </div>
      <Grid container className={HawkerReusableCSS.GridContainer}>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <TextField
            disabled={watch("disabledFieldInputState")}
            id="standard-basic"
            inputProps={{ maxLength: 12 }}
            label={<FormattedLabel id="aadhaarNo" required />}
            {...register("aadhaarNo")}
            error={!!errors.aadhaarNo}
            helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
          />
        </Grid>
        {watch("disabledFieldInputState") ? (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
              {!otpSuccessFullMessage && (
                <Button
                  opacity="0"
                  sx={{
                    mt: "23px",
                    onHover: "primary",
                    ":hover": {
                      bgcolor: "primary.main", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => {
                    sendOtpNotify();
                    otpModalOpen();
                  }}
                >
                  {<FormattedLabel id="sendOTP" />}
                </Button>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            ></Grid>
          </>
        )}
      </Grid>

      <Grid
        container
        sx={{
          // marginTop: 1,
          paddingLeft: "50px",
          marginBottom: 5,
        }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {otpSuccessFullMessage && (
            <span>
              <Typography
                varinat="subtitle2"
                style={{ color: "green", textDecoration: "" }}
              >
                {<FormattedLabel id="aadhaarOtpVerified" />}
              </Typography>
            </span>
          )}
        </Grid>
      </Grid>

      {/** OTP Modal */}
      <Modal
        open={otpModal}
        onClose={() => otpModalClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            height: "400px",
            width: "600px",
          }}
          component={Box}
        >
          <IconButton
            aria-label="delete"
            sx={{
              marginLeft: "530px",
              backgroundColor: "primary",
              ":hover": {
                bgcolor: "red",
                color: "white",
              },
            }}
            onClick={() => {
              otpModalClose();
            }}
          >
            <CloseIcon
              sx={{
                color: "black",
              }}
            />
          </IconButton>
          <br />
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textDecoration: "underline",
              textDecorationColor: "blue",
              textDecorationWidth: "1px",
            }}
            display="inline"
            id="modal-modal-title"
            variant="h5"
            component="h2"
          >
            <strong> {<FormattedLabel id="otpVerification" />} </strong>
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
            }}
          >
            <strong>{<FormattedLabel id="sendOTPMessage" />}</strong>
          </Typography>
          <br />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Controller
              render={({ field }) => (
                <OtpInput
                  inputStyle={{
                    width: "4em",
                    height: "4em",
                    borderColor: "blue",
                  }}
                  numInputs={6}
                  isInputNum
                  //maxLength={4}
                  otpType={true}
                  value={field.value}
                  onChange={(data) => field.onChange(data)}
                  separator={<span> - </span>}
                />
              )}
              name="aadharOtp"
              control={control}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Button
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "3vh",
                onHover: "primary",
                ":hover": {
                  bgcolor: "primary.main",
                  color: "white",
                },
              }}
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                verfiyOtpAlert();
                otpModalClose();
                setOtpSuccessFullMessage(true);
              }}
            >
              {<FormattedLabel id="verfiyOtp" />}
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Timer
              text="Time Left"
              textColor={"#000000"}
              ButtonText="Resend OTP"
              buttonColor={"#FFFFFF"}
              background={"#FF5733"}
              seconds={30}
              minutes={0}
              resend={() => resendOtpAlert()}
            />
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default AadharAuthentication;
