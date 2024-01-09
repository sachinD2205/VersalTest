import {
  Button,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import OtpInput from "react-otp-input";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
const AadharAuthentication = ({ readOnly = false }) => {
  const {
    control,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useFormContext();
  const [otpModal, setOtpModal] = useState(false);
  const otpModalOpen = () => setOtpModal(true);
  const otpModalClose = () => setOtpModal(false);


  //!=================useEffect

  useEffect(() => {
    setValue("aadharCardNo", watch("aadharCardNo"));
  }, []);

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
          display: "flex",
          justifyContent: "center",
        }}
      >
        <strong>
          <FormattedLabel id="aadharAuthentication" />
        </strong>
      </div>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{
          marginBottom: "5vh",
        }}
      >
        <Grid item xl={1} lg={1} md={1}></Grid>
        {/* Applicant Aadhar Number */}
        <Grid item xs={2} sm={4} md={4} xl={5}>
          <TextField
            sx={{
              width: "100%",
            }}
            disabled={readOnly}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 12 }}
            id="standard-basic"
            label={<FormattedLabel id="applicantaadharNo" required />}
            variant="outlined"
            {...register("aadharCardNo")}
            error={!!errors.aadharCardNo}
            helperText={
              errors?.aadharCardNo ? errors.aadharCardNo.message : null
            }
          />
        </Grid>
        {/* Send OTP Button */}
        <Grid item xs={2} sm={4} md={4}>
          <Button
            sx={{
              marginTop: "2vh",
              width: "100%",
              height: "30px",
              onHover: "primary",
              marginLeft: "7vw",
              ":hover": {
                bgcolor: "primary.main",
                color: "white",
              },
            }}
            variant="outlined"
            color="primary"
            onClick={() => otpModalOpen()}
          >
            <FormattedLabel id="sendOtp" />
          </Button>
        </Grid>
      </Grid>

      {/* Modal */}
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
                swal({
                  title: "OTP Verification Completed !!",
                  text: "verification completed.... !!",
                  icon: "success",
                  buttons: true,
                  dangerMode: true,
                }).then((willDelete) => {
                  if (willDelete) {
                    swal("verification completed !!!", {
                      icon: "success",
                    });
                  }
                });
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
                onHover: "secondary",
                ":hover": {
                  bgcolor: "secondary.main",
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
    </>
  );
};

export default AadharAuthentication;
