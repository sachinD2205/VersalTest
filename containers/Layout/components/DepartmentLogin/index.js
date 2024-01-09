import React, { useState } from "react";
import styles from "./[DepartmentLogin].module.css";
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
import loginLabels from "../../../reuseableComponents/labels/common/loginLabels";
import { useSelector } from "react-redux";

const DepartmentLogin = ({
  onDepartmentLogin,
  setUser,
  setPwd,
  handleClickShowPassword,
  showPassword,
  handleRegisterClick,
  handleForgotPasswordClick,
}) => {
  const _language = useSelector((state) => {
    return state.labels.language;
  });

  // const [loginButtonDisableState, setLoginButtonDisableState] = useState(false);

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
            {/* <FormattedLabel id='departmentCred' /> */}
            {findLoginLabel("departmentCred")}
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
            onChange={(e) => setUser(e.target.value)}
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
            inputProps={{ style: { fontSize: "15px" } }}
            variant="outlined"
            fullWidth
            type={showPassword ? "" : "password"}
            size="small"
            onChange={(e) => setPwd(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button
            // sx={{ border: "solid red" }}
            fullWidth
            // disabled={loginButtonDisableState}
            size="small"
            variant="contained"
            type="button"
            onClick={
              // () => {
              onDepartmentLogin
              // , setLoginButtonDisableState(true);
              // }
            }
            className={styles.button}
          >
            {findLoginLabel("login")}
            {/* <FormattedLabel id='login' /> */}
          </Button>
        </Grid>
        <Grid item>
          <Box className={styles.forgotPwContainer}>
            {/* <Checkbox
              checked={checked}
              onChange={handleRememberMe}
              inputProps={{ "aria-label": "controlled" }}
            /> */}
            {/* <Link
              tabIndex={0}
              component="button"
              color="inherit"
              onClick={() => handleForgotPasswordClick("Department")}
            >
              {findLoginLabel("forgotPassword")}
            </Link> */}
          </Box>
        </Grid>
        {/* <Grid item>
          <div className={styles.formbottom}>
            <Typography>Or</Typography>
            <Typography>Continue without login</Typography>
            <Typography>
              Don't have an account?{' '}
              <Link
                tabIndex={1}
                component='button'
                onClick={(e) => handleRegisterClick(e)}
                color='inherit'
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

export default DepartmentLogin;
