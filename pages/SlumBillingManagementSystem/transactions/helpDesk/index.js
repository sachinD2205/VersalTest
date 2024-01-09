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
import React,{useEffect} from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useState } from "react";
import axios from "axios";
import trnRtiApplicationSchema from "../../../../containers/schema/rtiOnlineSystemSchema/trnRtiApplicationSchema";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import applicationNameData from "./applications.json";
import HutTransferView from "./HutTransferView";
import IssuanceOfNOCView from "./IssuanceOfNOCView";
import IssuanceOfPhotopassView from "./IssuanceOfPhotopassView";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import IconButton from "@mui/material/IconButton";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import { useRouter } from "next/router";

const EntryForm = () => {
  const {
    register,
    control,setValue,
    methods,
    watch,
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
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const [isLoading, setIsLoading] = useState(false);
const [nocDetails,setNocDetails]=useState([])
  const [photopassDetails, setPhotopassDetails] = useState([]);
  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;
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

  useEffect(()=>{

    console.log('nocDetails',nocDetails )
  },[nocDetails])
  const getHutDetails = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.SLUMURL
        }/trnTransferHut/search/applicationNumber?applicationNumber=${watch(
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
        setIsLoading(false);
        setApplicationDetails([]);
        cfcErrorCatchMethod(err, false);
      });
  };

  // get application by id
  const searchApplication = () => {
    if (watch("applicationNo") != undefined) {
      if (watch("application") === 1) {
        getPhotopassDetails();
      } else if (watch("application") === 2) {
        getHutDetails();
      } else {
        getIssuanceOfNoc();
      }
    }
  };

  const getIssuanceOfNoc = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.SLUMURL
        }/trnIssueNoc/search/applicationNumber?applicationNumber=${watch(
          "applicationNo"
        ).trim()}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setNocDetails(r.data);
        console.log('r.data', r.data)
      })
      .catch((err) => {
        setIsLoading(false);
        setNocDetails([]);
        cfcErrorCatchMethod(err, false);
      });
  };

  const getPhotopassDetails = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.SLUMURL
        }/trnIssuePhotopass/search/applicationNumber?applicationNumber=${watch(
          "applicationNo"
        ).trim()}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setPhotopassDetails(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setPhotopassDetails({});
        cfcErrorCatchMethod(err, false);
      });
  };

  // View
  return (
    <>
      <ThemeProvider theme={theme}>
        <>
          <BreadcrumbComponent />
        </>
        {isLoading && <CommonLoader />}
        <Paper
          elevation={8}
          variant="outlined"
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
          <Divider />
          <Box>
            {/* <Box
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "10px",
                background:
                  "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
              }}
            >
              <h2>
                <FormattedLabel id="helpDeskOfSlum" />
              </h2>
            </Box> */}
            <Box>
              <Grid
                container
                className={commonStyles.title}
                style={{ marginBottom: "8px" }}
              >
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
                    <FormattedLabel id="helpDeskOfSlum" />
                  </h3>
                </Grid>
              </Grid>
            </Box>
            <FormProvider {...methods}>
              <form>
                <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
                              setApplicationDetails([])
                              setPhotopassDetails([])
                              setNocDetails([])
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
                                    // flexDirection: "column",
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
                      sx={{ marginTop: 2, marginLeft: "-1rem" }}
                      variant="contained"
                      color="primary"
                      size='small'
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

                {photopassDetails.length != 0 && (
                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    <IssuanceOfPhotopassView data={photopassDetails} />
                  </Grid>
                )}

                {applications.length != 0 && (
                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    <HutTransferView data={applications} />
                  </Grid>
                )}

                {(nocDetails.length != 0&& nocDetails != undefined) && (
                  <Grid container spacing={2} sx={{ padding: "1rem" }}>
                    <IssuanceOfNOCView data={nocDetails} />
                  </Grid>
                )}
              </form>
            </FormProvider>
          </Box>
        </Paper>
      </ThemeProvider>

      {((watch("application") === 1 && photopassDetails.length === 0) ||
        (watch("application") === 2 && applications.length === 0) ||
        (watch("application") === 3 && nocDetails.length === 0)) && (
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
