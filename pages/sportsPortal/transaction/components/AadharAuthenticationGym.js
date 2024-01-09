import {
  Grid,
  Typography,
  TextField,
  Button,
  Modal,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import Box from "@mui/material/Box";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import OtpInput from "react-otp-input";
import { useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";
const AadharAuthentication = () => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) }); //useFormContext();

  // Otp Modal Open
  const [otpModal, setOtpModal] = useState(false);
  const otpModalOpen = () => setOtpModal(true);
  const otpModalClose = () => setOtpModal(false);
  const groups = useSelector((state) => {
    console.log("123", state.user.group);
  });

  // view
  return (
    <>
      {/**
     <div className={styles.row}>
        <Typography variant='h6' sx={{ marginTop: 4 }}>
          <strong>Aadhar Authentication</strong>
        </Typography>
      </div>
    */}
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
        <strong>
          <FormattedLabel id="aadharAuthentication" />
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="aadharNo" />}
            variant="outlined"
            sx={{
              width: "300px",
              height: "30px",
            }}
            size="large"
            {...register("AaadhaarNo")}
            error={!!errors.aadhaarNo}
            helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Button
            sx={{
              marginTop: "3vh",
              width: "200px",
              height: "30px",
              onHover: "primary",

              ":hover": {
                bgcolor: "primary.main", // theme.palette.primary.main
                color: "white",
              },
            }}
            variant="outlined"
            color="primary"
            // size="large"
            onClick={() => otpModalOpen()}
          >
            Send OTP
          </Button>
        </Grid>
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
              // display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
            }}
            component={Box}
          >
            <Typography
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textDecoration: "underline",
              }}
              display="inline"
              id="modal-modal-title"
              variant="h5"
              component="h2"
            >
              <strong> OTP VERIFICATION</strong>
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
              <strong> 6-Digit OTP Send To Your Mobile Number </strong>
            </Typography>{" "}
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
                    inputStyle={{ width: "4em", height: "4em" }}
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
                //defaultValue=''
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
                  // width: "250px",
                  // height: "50px",

                  onHover: "primary",

                  ":hover": {
                    bgcolor: "primary.main", // theme.palette.primary.main
                    color: "white",
                  },
                }}
                variant="contained"
                color="primary"
                size="large"
              >
                VERIFY OTP
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
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // marginTop: "1vh",
                  // width: "250px",
                  // height: "50px",

                  onHover: "secondary",

                  ":hover": {
                    bgcolor: "secondary.main", // theme.palette.primary.main
                    color: "white",
                  },
                }}
                variant="outlined"
                color="secondary"
                size="small"
              >
                Resend OTP
              </Button>
            </Box>
          </Paper>
        </Modal>
      </Grid>
    </>
  );
};

export default AadharAuthentication;
