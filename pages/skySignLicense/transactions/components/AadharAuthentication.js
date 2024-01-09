import {
  Grid,
  Typography,
  TextField,
  Button,
  Modal,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import styles from "../../../../styles/skysignstyles/components.module.css";
import { Controller, useFormContext } from "react-hook-form";
import OtpInput from "react-otp-input";
import { Box } from "@mui/system";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import sweetAlert from "sweetalert";

////test

const AadharAuthentication = () => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  // Otp Modal Open
  const [btnText, setBtnText] = useState("Successful");
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const otpModalOpen = () => setOtpModal(true);
  const otpModalClose = () => setOtpModal(false);

  // view
  return (
    <>
      {/* <div className={styles.row}>
        <Typography variant='h6' sx={{ marginTop: 4 }}>
           <strong>Aadhar Authentication</strong> 
          {<FormattedLabel id="aadharAuthentication"></FormattedLabel>}
        </Typography>
      </div> */}
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
        <FormattedLabel id="aadharAuthentication" />
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <TextField
            id="standard-basic"
            label=<FormattedLabel id="aadharNo" />
            variant="outlined"
            sx={{
              width: "500px",
              height: "50px",
            }}
            size="large"
            {...register("aadhaarNo")}
            error={!!errors.aadhaarNo}
            helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <Button
            sx={{
              marginTop: "3vh",
              width: "250px",
              height: "50px",
              onHover: "primary",

              ":hover": {
                bgcolor: "primary.main", // theme.palette.primary.main
                color: "white",
              },
            }}
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => otpModalOpen()}
          >
            {<FormattedLabel id="sendOTP" />}
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
              {/* <strong> OTP VERIFICATION</strong> */}
              {<FormattedLabel id="oTPVERIFICATION"></FormattedLabel>}
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
              <strong> 6 digit OTP is sent to your registered number </strong>
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
                onClick={() => {
                  sweetAlert("Verified Successfully");
                  setIsOpenCollapse("true");
                }}
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
                onClick={() => {
                  sweetAlert("Resend OTP Successfully");
                  setIsOpenCollapse("true");
                }}
              >
                Resend OTP
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 0.5,
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "2vh",
                  bgcolor: "error.main",
                  width: "80px",
                  height: "30px",

                  onHover: "primary",

                  ":hover": {
                    bgcolor: "error.main", // theme.palette.primary.main
                    color: "white",
                  },
                }}
                variant="contained"
                color="primary"
                size="large"
                onClick={() => otpModalClose()}
              >
                BACK
              </Button>
            </Box>
          </Paper>
        </Modal>
      </Grid>
    </>
  );
};

export default AadharAuthentication;
