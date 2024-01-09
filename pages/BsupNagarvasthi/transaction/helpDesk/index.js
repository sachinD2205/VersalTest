import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Button,
  MenuItem,
  Paper,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import theme from "../../../../theme";
import React, { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import axios from "axios";

import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import applicationNameData from "./application.json";
import RTIAppealView from "./NewSchemeView";
import BachatgatRegView from "./bachatgatRegView";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import NewSchemeView from "./NewSchemeView";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const EntryForm = () => {
  const {
    register,
    control,
    methods,setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  const router = useRouter();

  const [bachatgatRegDetails, setBachatgatRegDetails] = useState([]);
  let user = useSelector((state) => state.user.user);
  const logedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state?.labels?.language);
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [isLoading, setIsLoading] = useState(false);

  const [newSchemeDetails, setNewSchemeDetails] = useState([]);
  // const headers =
  // logedInUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  // const authority = user?.menus?.find((r) => {
  //     return r.id == selectedMenuFromDrawer;
  // })?.roles;
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roleIds;

  const getBachatgatRegDetails = () => {
 
      axios
        .get(
          `${
            urls.BSUPURL
          }/trnBachatgatRegistration/getByApplicationNo?applicationNo=${watch(
            "applicationNo"
          ).trim()}`,
          {
            headers: headers,
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setBachatgatRegDetails(res.data);
          } else {
            setBachatgatRegDetails([]);
          }
        })
        .catch((err) => {
          setBachatgatRegDetails([]);

          cfcErrorCatchMethod(err, false);
        });
    
  };

  // get application by id
  const searchApplication = () => {
    if (watch("applicationNo") != undefined) {
      if (watch("application") === 1) {
        getBachatgatRegDetails();
      } else {
        getnewSchemeDetails();
      }
    }
  };

  const getnewSchemeDetails = () => {

      setIsLoading(true);
      axios
        .get(
          `${
            urls.BSUPURL
          }/trnSchemeApplicationNew/getByApplicationNo?applicationNo=${watch(
            "applicationNo"
          ).trim()}`,
          {
            headers: headers,
          }
        )
        .then((r) => {
          setIsLoading(false);
          setNewSchemeDetails(r.data);
        })
        .catch((err) => {
          setIsLoading(false);
          setNewSchemeDetails([]);
          cfcErrorCatchMethod(err, false);
        });
    
  };
  // View
  return (
    <>
      <>
        <BreadcrumbComponent />
      </>
      {isLoading && <CommonLoader />}
      <ThemeProvider theme={theme}>
        <Paper
          elevation={8}
          variant="outlined"
          sx={{
            border: 1,
            borderColor: "grey.500",
            [theme.breakpoints.down("sm")]: {
              marginTop: "2rem",
              marginBottom: "2rem",
            },
          }}
        >
          <Divider />
          <Box>
            <Box>
              <Grid container className={commonStyles.title}>
                <Grid item xs={1}>
                  <IconButton
                    style={{
                      color: "white",
                    }}
                    onClick={() => {
                      router.back();
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <h3
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      marginRight: "2rem",
                    }}
                  >
                    <FormattedLabel id="helpDeskBSUP" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <FormProvider {...methods}>
              <form>
                <Grid container spacing={3} sx={{ padding: "1rem" }}>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormControl
                      error={!!errors.application}
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        <FormattedLabel id="applicationName" />
                      </InputLabel>

                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ width: "100%" }}
                            variant="standard"
                            fullWidth
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              setBachatgatRegDetails([])
                              setNewSchemeDetails([])
                              setValue('applicationNo','')
                            }}
                            label={<FormattedLabel id="applicationName" />}
                          >
                            {applicationNameData &&
                              applicationNameData.map((application, index) => (
                                <MenuItem
                                  key={index}
                                  value={application.id}
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  {application.serviceName}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="application"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.application
                          ? errors.application.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      autoFocus
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="applicationNo" />}
                      variant="standard"
                      {...register("applicationNo")}
                      error={!!errors.applicationNo}
                      helperText={
                        errors?.applicationNo
                          ? errors.applicationNo.message
                          : null
                      }
                    />
                  </Grid>
                  <Grid
                    item
                    xl={2}
                    lg={2}
                    md={2}
                    sm={12}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      sx={{ marginTop: 2, marginLeft: "-10px" }}
                      variant="contained"
                      color="primary"
                      size="small"
                      className={commonStyles.search}
                      disabled={
                        watch("applicationNo") && watch("application")
                          ? false
                          : true
                      }
                      endIcon={<SearchIcon />}
                      onClick={() => searchApplication()}
                    >
                      <FormattedLabel id="search" />
                    </Button>
                  </Grid>
                </Grid>
                {bachatgatRegDetails.length != 0 && (
                  <Grid
                    container
                    sx={{
                      padding: "1rem",
                    }}
                  >
                    <BachatgatRegView data={bachatgatRegDetails} />
                  </Grid>
                )}

                {newSchemeDetails.length != 0 && (
                  <Grid container sx={{ padding: "1rem" }}>
                    <NewSchemeView data={newSchemeDetails} />
                  </Grid>
                )}
              </form>
            </FormProvider>
          </Box>
        </Paper>
      </ThemeProvider>
      {((watch("application") === 1 && bachatgatRegDetails.length === 0) ||
        (watch("application") === 2 && newSchemeDetails.length === 0)) && (
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <h4
            style={{
              fontSize: "18px",
            }}
          >
            {language === "en" ? "Record Not Found !" : "रेकॉर्ड सापडला नाही!"}
          </h4>
        </Grid>
      )}
    </>
  );
};

export default EntryForm;
