import React from "react";
import styles from "./[CfcLogin].module.css";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FormattedLabel from "../../../reuseableComponents/FormattedLabel";
import loginLabels from "../../../reuseableComponents/labels/common/loginLabels";
import { useSelector } from "react-redux";

const CfcLogin = ({
  handleClickShowPassword,
  showPassword,
  onCfcUserLogin,
  setCfcUser,
  setCfcPwd,
  handleRegisterClick,
  handleForgotPasswordClick,
}) => {
  const _language = useSelector((state) => {
    return state.labels.language;
  });

  const findLoginLabel = (id) => {
    if (_language) {
      return loginLabels[_language][id];
    } else {
      return loginLabels["mr"][id];
    }
  };

  return (
    <div>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography>
            {/* <FormattedLabel id='cfcCred' /> */}
            {findLoginLabel("cfcCred")}
          </Typography>
          <TextField
            className={styles.userIdIp}
            InputLabelProps={{
              style: { color: "#000000", fontSize: "15px" },
            }}
            inputProps={{ style: { fontSize: "15px" } }}
            variant="outlined"
            fullWidth
            placeholder="abc123@gmail.com"
            size="small"
            onChange={(e) => setCfcUser(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Typography>
            {/* <FormattedLabel id='password' /> */}
            {findLoginLabel("password")}
          </Typography>
          <TextField
            className={styles.userIdIp}
            InputLabelProps={{
              style: { color: "#000000", fontSize: "15px" },
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
            variant="outlined"
            fullWidth
            type={showPassword ? "" : "password"}
            size="small"
            onChange={(e) => setCfcPwd(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            fullWidth
            size="small"
            variant="contained"
            onClick={onCfcUserLogin}
            className={styles.button}
          >
            {findLoginLabel("login")}
          </Button>
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
              onClick={() => handleForgotPasswordClick("CFC")}
            >
              {/* <FormattedLabel id='forgotPassword' /> */}
              {findLoginLabel("forgotPassword")}
            </Link>
          </Box>
        </Grid>
        {/* <Grid item>
          <div className={styles.formbottom}>
            <Typography>Or</Typography>
            <Typography>Continue without login</Typography>
            <Typography>
              Don't have an account?{" "}
              <Link
                tabIndex={1}
                component="button"
                onClick={(e) => handleRegisterClick(e)}
                color="inherit"
              >
                Sign up here
              </Link>
            </Typography>
          </div>
        </Grid> */}
      </Grid>
    </div>
  );
};

export default CfcLogin;
