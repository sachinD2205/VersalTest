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
  IconButton,
} from "@mui/material";
import theme from "../../../../theme";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import axios from "axios";
import trnRtiApplicationSchema from "../../../../containers/schema/rtiOnlineSystemSchema/trnRtiApplicationSchema";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import applicationNameData from "../../reports/applicationwiseCollection/applicationName.json";
import RTIAppealView from "./RTIAppealView";
import RTIApplicationView from "./RTIApplicationView";
import Loader from "../../../../containers/Layout/components/Loader";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const EntryForm = () => {
  const {
    register,
    control,
    methods,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(trnRtiApplicationSchema),
    mode: "onChange",
  });

  const router = useRouter();

  const [applications, setApplicationDetails] = useState([]);
  let user = useSelector((state) => state.user.user);
  const logedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state?.labels?.language);
  const [appealDetails, setAppealDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const getApplicationDetails = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.RTI
        }/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${watch(
          "applicationNo"
        ).trim()}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200) {
          setApplicationDetails(res.data);
        }
      })
      .catch((err) => {
        setApplicationDetails([]);
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };


  // get application by id
  const searchApplication = () => {
    if (watch("applicationNo") != undefined) {
      if (watch("application") === 103) {
        setAppealDetails([]);
        getApplicationDetails();
      } else {
        setApplicationDetails([]);
        getAppealDetails();
      }
    }
  };

  const getAppealDetails = () => {
    setIsLoading(true);

    axios
      .get(
        `${urls.RTI}/trnRtiAppeal/getByApplicationNo?applicationNo=${watch(
          "applicationNo"
        ).trim()}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setAppealDetails(r.data);
      })
      .catch((err) => {
        setAppealDetails([]);
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };
  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <BreadcrumbComponent />
        {isLoading && <CommonLoader />}
        <Paper
          elevation={8}
          sx={{
            border: 1,
            borderColor: "grey.500",
            marginLeft: "10px",
            marginRight: "10px",
            [theme.breakpoints.down("sm")]: {
              marginTop: "2rem",
              marginBottom: "2rem",
            },
            padding: 1,
          }}
        >
          {/* <Divider /> */}
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
                    <FormattedLabel id="helpDeskRTI" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <FormProvider {...methods}>
              <form>
                <Grid container spacing={3} sx={{ padding: "1rem" }}>
                  <Grid item xs={12} sm={12} md={5}>
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
                              setValue("applicationNo", "");
                              field.onChange(value);
                            }}
                            label={<FormattedLabel id="applicationName" />}
                          >
                            {applicationNameData &&
                              applicationNameData.map((application, index) => (
                                <MenuItem
                                  key={index}
                                  value={application.serviceId}
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
                  <Grid item xs={12} sm={12} md={5}>
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

                {applications.length != 0 && (
                  <Grid item>
                    <RTIApplicationView data={applications} />
                  </Grid>
                )}

                {appealDetails.length != 0 && (
                  <Grid item>
                    <RTIAppealView data={appealDetails} />
                  </Grid>
                )}
              </form>
            </FormProvider>
          </Box>
        </Paper>
      </ThemeProvider>

      {((watch("application") === 1 && applications.length === 0) ||
        (watch("application") === 2 && appealDetails.length === 0)) && (
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
