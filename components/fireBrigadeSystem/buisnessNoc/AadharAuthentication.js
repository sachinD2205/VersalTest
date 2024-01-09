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
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import OtpInput from "react-otp-input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";

//AadhaarAuthentication
const AadharAuthentication = () => {
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const inputState = getValues("inputState");
  // Otp Modal Open
  const [otpModal, setOtpModal] = useState(false);
  const otpModalOpen = () => setOtpModal(true);
  const otpModalClose = () => setOtpModal(false);

  //  successfull otp
  const sendOtpNotify = () => {
    toast.success("otp sent successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Resend otp
  const resendOtpAlert = () => {
    toast.warning("otp resend successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // Verified otp
  const verfiyOtpAlert = () => {
    toast.success("otp verified successfully", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  // worong otp
  const wrongOtpAlert = () => {
    toast.error("please enter correct otp", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const [otpSuccessFullMessage, setOtpSuccessFullMessage] = useState(false);

  // view
  return (
    <>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
        }}
      >
        <strong>{<FormattedLabel id='aadharAuthentication' />}</strong>
      </div>
      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        <Grid item xs={6} sm={6} md={6} lg={3} xl={3}>
          <TextField
            disabled={inputState}
            id='standard-basic'
            label={<FormattedLabel id='aadhaarNo' />}
            {...register("aadhaarNo")}
            error={!!errors.aadhaarNo}
            helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
          />
        </Grid>
        {inputState ? (
          <></>
        ) : (
          <Grid item xs={6} sm={6} md={6} lg={3} xl={3}>
            <Button
              opacity='0'
              sx={{
                mt: "23px",
                onHover: "primary",
                ":hover": {
                  bgcolor: "primary.main", // theme.palette.primary.main
                  color: "white",
                },
              }}
              variant='contained'
              color='primary'
              size='large'
              onClick={() => {
                sendOtpNotify();

                otpModalOpen();
              }}
            >
              <ToastContainer />

              {<FormattedLabel id='sendOTP' />}
            </Button>
          </Grid>
        )}
      </Grid>

      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
        }}
      >
        <Grid item xs={3} sm={6} md={6} lg={3} xl={3}>
          {otpSuccessFullMessage && (
            <span>
              <Typography varinat='h6' color='success'>
                {<FormattedLabel id='aadhaarOtpVerified' />}
              </Typography>
            </span>
          )}
        </Grid>
      </Grid>

      {/** OTP Modal */}
      <Modal
        open={otpModal}
        onClose={() => otpModalClose()}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
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
            aria-label='delete'
            sx={{
              marginLeft: "530px",
              backgroundColor: "primary",
              ":hover": {
                bgcolor: "red",
                color: "white",
              },
            }}
          >
            <CloseIcon
              sx={{
                color: "black",
              }}
              onClick={() => {
                otpModalClose();
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
            display='inline'
            id='modal-modal-title'
            variant='h5'
            component='h2'
          >
            <strong> {<FormattedLabel id='otpVerification' />} </strong>
          </Typography>
          <Typography
            id='modal-modal-description'
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
            }}
          >
            <strong>{<FormattedLabel id='sendOTPMessage' />}</strong>
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
              name='aadharOtp'
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
              variant='contained'
              color='primary'
              size='large'
              onClick={() => {
                verfiyOtpAlert();
                otpModalClose();
                setOtpSuccessFullMessage(true);
              }}
            >
              {<FormattedLabel id='verfiyOtp' />}
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
              text='Time Left'
              textColor={"#000000"}
              ButtonText='Resend OTP'
              buttonColor={"#FFFFFF"}
              background={"#FF5733"}
              seconds={30}
              minutes={0}
              resend={resendOtpAlert}
            />
          </Box>
        </Paper>
      </Modal>
    </>
  );
};

export default AadharAuthentication;
