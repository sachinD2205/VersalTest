import React from "react"
import styles from "./[CitizenLogin].module.css"
import {
  TextField,
  Box,
  Button,
  Typography,
  Grid,
  Checkbox,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import FormattedLabel from "../../../reuseableComponents/FormattedLabel"
import loginLabels from "../../../reuseableComponents/labels/common/loginLabels"
import { useSelector } from "react-redux"
import { Router } from "react-router-dom"
import { useRouter } from "next/router"

const CitizenLogin = ({
  register,
  errors,
  handleClickShowPassword,
  showPassword,
  checked,
  handleRememberMe,
  handleForgotPasswordClick,
  handleRegisterClick,
  showOTPCitizen,
  setOtpCitizen,
  isVerifiedCitizen,
  isOtpVerifiedCitizen,
  handleVerifyOtpCitizen,
  disableLoginButton,
}) => {
  const _language = useSelector((state) => {
    return state.labels.language
  })

  const router = useRouter()

  const findLoginLabel = (id) => {
    if (_language) {
      return loginLabels[_language][id]
    } else {
      return loginLabels["mr"][id]
    }
  }

  return (
    <div>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <label>
            {/* <FormattedLabel id="citizenCred" /> */}
            {findLoginLabel("citizenCred")}
          </label>
          <TextField
            InputLabelProps={{
              style: { fontSize: "15px" },
            }}
            inputProps={{ style: { fontSize: "15px" } }}
            variant="outlined"
            // label="Citizen Email Id/Phone number"
            fullWidth
            placeholder="abc123@gmail.com"
            size="small"
            onChange={(e) => setUser(e.target.value)}
            {...register("Username")}
            helperText={errors.Username?.message}
            className={styles.userIdIp}
            sx={{
              "& .MuiFormHelperText-root": {
                color: "red",
              },
            }}
          />
        </Grid>
        <Grid item>
          <label>
            {/* <FormattedLabel id='password' /> */}
            {findLoginLabel("password")}
          </label>
          <TextField
            InputLabelProps={{
              style: { fontSize: "15px" },
            }}
            InputProps={{
              style: { fontSize: "15px" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
            variant="outlined"
            // label="Password"
            type={showPassword ? "" : "password"}
            size="small"
            onChange={(e) => setPwd(e.target.value)}
            {...register("password")}
            helperText={errors.password?.message}
            className={styles.userIdIp}
            sx={{
              "& .MuiFormHelperText-root": {
                color: "red",
              },
            }}
          />
        </Grid>
        <Grid item>
          <Button
            sx={{ backgroundColor: "#2980B9", color: "white" }}
            fullWidth
            size="small"
            variant="contained"
            // className={styles.button}
            type="submit"
            disabled={disableLoginButton}
          >
            {/* <FormattedLabel id='verifyMe' /> */}
            {findLoginLabel("verifyMe")}
          </Button>
        </Grid>
        <Grid item>
          {showOTPCitizen && (
            <Grid container>
              <Grid item>
                <Typography>OTP sent on email id and mobile no</Typography>
              </Grid>
              <Grid item>
                <Typography>Enter OTP</Typography>
              </Grid>
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "10px",
                }}
              >
                <Grid item xs={7}>
                  <TextField
                    sx={{
                      letterSpacing: "15px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "5px",
                    }}
                    InputLabelProps={{
                      style: {
                        color: "#000000",
                        fontSize: "15px",
                        letterSpacing: "12px",
                      },
                    }}
                    InputProps={{
                      style: { fontSize: "15px", letterSpacing: "15px" },
                    }}
                    inputProps={{ style: { fontSize: "15px" }, maxLength: 6 }}
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="- - - - - -"
                    // value={otp}
                    onChange={(txt) => {
                      setOtpCitizen(txt.target.value)
                    }}
                  />
                </Grid>
                {!isOtpVerifiedCitizen && (
                  <>
                    <Grid
                      item
                      xs={5}
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        fullWidth
                        size="small"
                        variant="contained"
                        type="button"
                        disabled={isOtpVerifiedCitizen}
                        onClick={handleVerifyOtpCitizen}
                        className={styles.button}
                        sx={{ width: "80%" }}
                      >
                        {isOtpVerifiedCitizen ? "Verified" : "Verify OTP"}
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item>
          {isOtpVerifiedCitizen && (
            <Button
              fullWidth
              size="small"
              variant="contained"
              type="button"
              onClick={() => router.push("/dashboard")}
              className={styles.button}
            >
              Login
            </Button>
          )}
        </Grid>
        <Grid item>
          <Box className={styles.forgotPwContainer}>
            {/* <Checkbox
              checked={checked}
              onChange={handleRememberMe}
              inputProps={{ "aria-label": "controlled" }}
            /> */}
            <Link
              tabIndex={0}
              component="button"
              color="inherit"
              onClick={() => handleForgotPasswordClick("Citizen")}
            >
              {/* <FormattedLabel id='forgotPassword' /> */}
              {findLoginLabel("forgotPassword")}
            </Link>
          </Box>
        </Grid>
        <Grid item>
          <div className={styles.formbottom}>
            <Typography>
              {/* <FormattedLabel id='or' /> */}
              {findLoginLabel("or")}
            </Typography>
          </div>

          <div className={styles.formbottom}>
            <Typography>
              {/* <FormattedLabel id='dontHaveAnAccount' /> <br /> */}
              {findLoginLabel("dontHaveAnAccount")}
              <br />
              <Link
                tabIndex={1}
                component="button"
                onClick={(e) => handleRegisterClick(e)}
                color="inherit"
              >
                {/* <FormattedLabel id='signUpHere' /> */}
                {findLoginLabel("signUpHere")}
              </Link>
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default CitizenLogin
