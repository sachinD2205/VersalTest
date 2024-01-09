import React, { useEffect, useState } from "react";
import styles from "../../styles/cfc/cfc.module.css";
// import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import {
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import schema from "../../containers/schema/common/ChangePasswordSchema";
import axios from "axios";
import urls from "../../URLS/urls";
import sweetalert from "sweetalert";
import { catchExceptionHandlingMethod } from "../../util/util";
import { EncryptData } from "../../components/common/EncryptDecrypt";
import {
  logout,
  setSelectedApplicationId,
  setSelectedBreadcrumbApplication,
  setUsersDepartmentDashboardData,
} from "../../features/userSlice";

const Index = () => {
  const [userData, setUserData] = useState();

  const user = useSelector((state) => state?.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setUserData(user?.userDao);
  }, []);

  console.log("user", userData);

  const router = useRouter();

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

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

  // Reset Values Exit
  const resetValues = {
    password: "",
    newPassword: "",
  };

  // Exit Button
  const exitButton = () => {
    // router.push("./workFlow");
    router.back();
  };

  const onSubmitForm = (formData) => {
    const encryptedNewPassword = EncryptData(
      "passphrasechangepassword",
      formData?.newPassword
    );

    const encryptedOldPassword = EncryptData(
      "passphrasechangepassword",
      formData?.oldPassword
    );

    console.log(
      "formData",
      formData,
      encryptedNewPassword,
      encryptedOldPassword
    );
    // const fromDate = moment(formData.fromDate).format("YYYY-MM-DD");
    // const toDate = moment(formData.toDate).format("YYYY-MM-DD");
    const finalBodyForApi = {
      // ...formData,
      // ...userData,
      // id: user?.userDao?.id,
      // userName: user?.userDao?.userName,
      // activeFlag: user?.userDao?.activeFlag,
      // oldPassword: formData?.oldPassword,
      // newPassword: formData?.newPassword,
      oldPassword: encryptedOldPassword,
      newPassword: encryptedNewPassword,
      // confirmPassword: formData?.confirmPassword,
      // newPassword: formData?.newPassword,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(`${urls.AuthURL}/changeUserPassword`, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("save data", res);
        if (res.status == 200 || res.status == 201) {
          console.log("password change***", res.data);
          let isPasswordChanged;

          if (res.data.status == "SUCCESS") {
            isPasswordChanged = "Y";
            // dispatch(passwordUpdater(isPasswordChanged))
            localStorage.setItem("isPasswordChanged", isPasswordChanged);

            formData.id
              ? sweetAlert("Updated!", res?.data?.message, "success")
              : sweetAlert("Updated!", res?.data?.message, "success");
            // router.push("/DepartmentDashboard/dashboardV1");
            dispatch(setUsersDepartmentDashboardData(null));
            dispatch(logout());
            router.push("/login");

            // getDepartment();
            // setButtonInputState(false);
            // setIsOpenCollapse(false);
            // setEditButtonInputState(false);
            // setDeleteButtonState(false);
          } else if (res.data.status == "FAILURE") {
            isPasswordChanged = "N";
            sweetAlert("Error!", res?.data?.message, "error");
          }
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
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
                {/* <FormattedLabel id="workFlowMaster" /> */}
                Change Password
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
          <form onSubmit={handleSubmit(onSubmitForm)}>
            <Grid
              container
              columns={{ xs: 12, sm: 12, md: 12 }}
              className={styles.feildres}
            >
              <Grid
                item
                xs={12}
                className={styles.feildres}
                sx={{ paddingBottom: 2 }}
              >
                <TextField
                  // inputProps={{
                  //   shrink: true,
                  // }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  readonly={user?.userDao?.firstNameEn}
                  size="small"
                  sx={{
                    width: "80%",
                    backgroundColor: "white",
                  }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="oldP" />}
                  label="User Name"
                  variant="outlined"
                  value={
                    user?.userDao?.firstNameEn +
                    " " +
                    user?.userDao?.middleNameEn +
                    " " +
                    user?.userDao?.lastNameEn
                  }
                  // {...register("userName")}
                  // error={!!errors.userName}
                  // helperText={errors?.userName ? errors.userName.message : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
                className={styles.feildres}
                sx={{ paddingBottom: 2 }}
              >
                <TextField
                  size="small"
                  sx={{
                    width: "80%",
                    backgroundColor: "white",
                  }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="oldP" />}
                  label="Old Password"
                  variant="outlined"
                  {...register("oldPassword")}
                  error={!!errors.oldPassword}
                  helperText={
                    errors?.oldPassword ? errors.oldPassword.message : null
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                className={styles.feildres}
                sx={{ paddingBottom: 2 }}
              >
                <TextField
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
                />
              </Grid>
              <Grid
                item
                xs={12}
                className={styles.feildres}
                sx={{ paddingBottom: 2 }}
              >
                <TextField
                  size="small"
                  sx={{
                    width: "80%",
                    backgroundColor: "white",
                  }}
                  id="outlined-basic"
                  // label={<FormattedLabel id="confirmP" />}
                  label="Confirm Password"
                  variant="outlined"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={
                    errors?.confirmPassword
                      ? errors.confirmPassword.message
                      : null
                  }
                />
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container className={styles.feildres} spacing={2}>
              <Grid item>
                <Button
                  type="submit"
                  size="small"
                  variant="outlined"
                  className={styles.button}
                  endIcon={<SaveIcon />}
                >
                  {/* <FormattedLabel id="Save" /> */}
                  Save
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  className={styles.button}
                  endIcon={<ClearIcon />}
                  onClick={() => {
                    reset({
                      ...resetValues,
                    });
                  }}
                >
                  {/* {<FormattedLabel id="clear" />} */}
                  Clear
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="small"
                  variant="outlined"
                  className={styles.button}
                  // color="primary"
                  endIcon={<ExitToAppIcon />}
                  onClick={() => exitButton()}
                >
                  {/* {<FormattedLabel id="exit" />} */}
                  Exit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
};

//
export default Index;
