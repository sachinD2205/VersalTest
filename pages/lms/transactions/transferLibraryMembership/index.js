import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slide,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import theme from "../../../../theme";
import styles from "../../../../styles/lms/[closeMembership]view.module.css";
import InIcon from "@mui/icons-material/Input";
import OutIcon from "@mui/icons-material/Output";
import urls from "../../../../URLS/urls";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import swal from "sweetalert";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import SaveIcon from "@mui/icons-material/Save";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// import { renewalOfMembershipSchema } from '../../../../../components/lms/schema/renewalOfMembershipSchema';
import { yupResolver } from "@hookform/resolvers/yup";
import LmsHeader from "../../../../components/lms/lmsHeader";
import Loader from "../../../../containers/Layout/components/Loader";

const Index = (props) => {
  let appName = "LMS";
  let serviceName = "C-LMS";
  let applicationFrom = "Web";
  const user = useSelector((state) => state?.user.user);
  const router = useRouter();
  const language = useSelector((state) => state?.labels.language);

  const closeMember = useForm({
    // resolver: yupResolver(renewalOfMembershipSchema),
    mode: "onChange",
  });
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = closeMember;

  const [libraryIdsList, setLibraryIdsList] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState(null);
  const [buttonInputState, setButtonInputState] = useState();
  const [atitles, setatitles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showDetails, setShowDetails] = useState(false);
  const [memberName, setMemberName] = useState();
  const [oldId, setOldId] = useState();
  const [oldStartDate, setOldStartDate] = useState();
  const [oldEndDate, setOldEndDate] = useState();
  const [tempDisabled, setTempDisabled] = useState();
  const [isReopen, setIsReopen] = useState(false);
  const [dataPass, setDataPass] = useState();
  const token = useSelector((state) => state.user.user.token);

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

  const membershipMonthsKeys = [
    {
      months: 6,
      label: "6 Months",
    },
    {
      months: 12,
      label: "12 Months",
    },
  ];

  useEffect(() => {
    setAllLibrariesList();
    getZoneKeys();
    getTitles();
    getTitleMr();
    // getAllBooks()
    if (localStorage.getItem("loggedInUser") !== "cfcUser") {
      getMembershipDetails();
    }
    if (props.disabled) {
      setShowDetails(true);
      setTempDisabled(props.disabled);
    }
    {
      setTempDisabled(true);
    }
    console.log("aalanai", props.id);
    if (router?.query?.id) {
      axios
        .get(
          `${urls.LMSURL}/trnRenewalOfMembership/getByIdAndServiceId?id=${
            router?.query?.id
          }&serviceId=${90}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res, "reg123");
          setDataPass(res?.data);
          setShowDetails(true);
          reset(res.data);
          // setValue('lastEndDate', res.data.endDateOld)
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, []);

  const [libraryKeys, setLibraryKeys] = useState([]);
  const [libraryKeysM, setLibraryKeysM] = useState([]);
  useEffect(() => {
    if (watch("zoneKey")) {
      getLibraryKeys();
    }
  }, [watch("zoneKey")]);

  useEffect(() => {
    if (watch("zoneKey")) {
      getLibraryKeysM();
    }
  }, [watch("zoneKeyM")]);

  const getLibraryKeysM = () => {
    //setValues("setBackDrop", true);
    axios
      .get(
        `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${watch(
          "zoneKeyM"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        let tempLib = r.data.libraryMasterList.filter(
          (library) => library.libraryType == "C"
        );
        setLibraryKeysM(
          tempLib.map((row) => ({
            id: row.id,
            // zoneName: row.zoneName,
            // zoneNameMr: row.zoneNameMr,
            libraryName: row.libraryName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getLibraryKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(
        `${urls.LMSURL}/libraryMaster/getLibraryByZoneKey?zoneKey=${watch(
          "zoneKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        let tempLib = r.data.libraryMasterList.filter(
          (library) => library.libraryType == "C"
        );
        setLibraryKeys(
          tempLib.map((row) => ({
            id: row.id,
            // zoneName: row.zoneName,
            // zoneNameMr: row.zoneNameMr,
            libraryName: row.libraryName,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const [zoneKeys, setZoneKeys] = useState([]);
  // getZoneKeys
  const getZoneKeys = () => {
    //setValues("setBackDrop", true);
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneKeys(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneName: row.zoneName,
            zoneNameMr: row.zoneNameMr,
          }))
        );
      })
      .catch((err) => {
        swal(
          language == "en" ? "Error!" : "त्रुटी!",
          language == "en"
            ? "Somethings Wrong, Zones not Found!"
            : "काहीतरी चुकीचे आहे, झोन सापडले नाहीत!",
          "error"
        );
      });
  };

  const getTitles = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setatitles(
          r.data.title.map((row) => ({
            id: row.id,
            atitle: row.title,
            // titlemr: row.titlemr,
          }))
        );
      })
      .catch((err) => {
        swal(
          language == "en" ? "Error!" : "त्रुटी!",
          language == "en"
            ? "Somethings Wrong, Titles not Found!"
            : "काहीतरी चुकीचे आहे, शीर्षके सापडली नाहीत!",
          "error"
        );
      });
  };
  const [TitleMrs, setTitleMrs] = useState([]);
  const getTitleMr = async () => {
    await axios
      .get(`${urls.BaseURL}/title/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setTitleMrs(
          r.data.title.map((row) => ({
            id: row.id,
            atitlemr: row.titleMr,
          }))
        );
      })
      .catch((err) => {
        swal(
          language == "en" ? "Error!" : "त्रुटी!",
          language == "en"
            ? "Somethings Wrong, Titles not Found!"
            : "काहीतरी चुकीचे आहे, शीर्षके सापडली नाहीत!",
          "error"
        );
      });
  };

  const setAllLibrariesList = () => {
    const url = urls.LMSURL + "/libraryMaster/getAll";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Error getting libraries");
        }
        if (
          !response.data ||
          !response.data.libraryMasterList ||
          response.data.libraryMasterList.length === 0
        ) {
          throw new Error("No libraries found");
        }
        let tempLibraryList = response.data.libraryMasterList
          .filter((library) => library.libraryType == "C")
          .sort((a, b) => a.id - b.id);
        console.log("librarylist", tempLibraryList);
        setLibraryIdsList(tempLibraryList);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    // .catch((err) => {
    //   console.error(err);
    //   swal(err.message, { icon: "error" });
    // });
  };

  const getMembershipDetails = () => {
    setLoading(true);
    const url =
      urls.LMSURL +
      "/libraryMembership/getByCreatedUserIdForTransfer?createdUserId=" +
      user?.id;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        // if (
        //   !response.data ||
        //   !response.data.trnBookIssueReturnList ||
        //   response.data.trnBookIssueReturnList.length === 0
        // ) {
        //   throw new Error('No books found')
        // }
        // setReturnBooksAvailableList(response.data.trnBookIssueReturnList)
        setValue("memberName", response?.data?.applicantName);
        setValue("endDate", response?.data?.endDate);
        setMemberName(response?.data?.applicantName);
        setOldId(response?.data?.id);
        setOldStartDate(response?.data?.startDate);
        setOldEndDate(response?.data?.endDate);
        setShowDetails(true);
        reset(response?.data);
        setValue("startDate", new Date());
        // setIsReopen(response?.data?.isReopen)
      })
      .catch((error) => {
        setLoading(false);
        if (error?.request?.status == 404) {
          swal(
            language == "en" ? "Not Found !" : "आढळले नाही !",
            language == "en"
              ? "Record Not Found for current user !"
              : "वर्तमान वापरकर्त्यासाठी रेकॉर्ड आढळले नाही !",
            "error"
          );
        } else {
          callCatchMethod(error, language);
        }
      });
    // .catch((err) => {
    //   console.error("error", err);
    //   swal(err?.response?.data?.message, { icon: "error" });
    // });
  };
  const getMembershipDetailsFromCfc = (membershipNoForSearch) => {
    setLoading(true);
    let userType;
    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    } else {
      userType = 2;
    }
    // const url = `${urls.LMSURL}/libraryMembership/getByCreatedUserIdForTransferCfc?membershipNo=LMS202300000006&createdUserId=${user?.id}&applicantType=${userType}`;
    const url = `${urls.LMSURL}/libraryMembership/getByCreatedUserIdForTransferCfc?membershipNo=${membershipNoForSearch}&createdUserId=${user?.id}&applicantType=${userType}`;

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setLoading(false);
        setValue("memberName", response?.data?.applicantName);
        setValue("endDate", response?.data?.endDate);
        setMemberName(response?.data?.applicantName);
        setOldId(response?.data?.id);
        setOldStartDate(response?.data?.startDate);
        setOldEndDate(response?.data?.endDate);
        setShowDetails(true);
        reset(response?.data);
        setValue("startDate", new Date());
        // setIsReopen(response?.data?.isReopen)
      })
      .catch((error) => {
        setLoading(false);
        if (error?.request?.status == 404) {
          swal(
            language == "en" ? "Not Found !" : "आढळले नाही !",
            language == "en" ? "Record Not Found !" : "रेकॉर्ड सापडला नाही !",
            "error"
          );
        } else {
          callCatchMethod(error, language);
        }
      });
  };

  const onSubmitForm = (dataa) => {
    setLoading(true);
    let userType;
    if (localStorage.getItem("loggedInUser") == "citizenUser") {
      userType = 1;
    } else if (localStorage.getItem("loggedInUser") == "departmentUser") {
      userType = 3;
    } else {
      userType = 2;
    }
    let bodyForApi;
    let tempVar = dataPass;
    if (router?.query?.side) {
      bodyForApi = {
        ...dataa,
        id: null,
        createdUserId: user?.id,
        applicationFrom,
        // serviceCharges: null,
        serviceId: 92,
        applicationStatus: "APPLICATION_TRANSFERED",
        oldId: oldId,
        zoneKey: watch("zoneKeyM"),
        libraryKey: watch("libraryKeyM"),
        applicantType: userType,
      };
    } else {
      bodyForApi = {
        ...dataa,
        id: null,
        createdUserId: user?.id,
        applicationFrom,
        // serviceCharges: null,
        serviceId: 92,
        applicationStatus: "APPLICATION_TRANSFERED",
        oldId: oldId,
        zoneKey: watch("zoneKeyM"),
        libraryKey: watch("libraryKeyM"),
        applicantType: userType,
      };
    }
    console.log("Final Data: ", bodyForApi);

    // Save - DB

    axios
      .post(`${urls.LMSURL}/trnLibraryTransfer/save`, bodyForApi, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.status == 200 || res.status == 201) {
          swal(
            language == "en" ? "Saved!" : "जतन केले!",
            language == "en"
              ? "Record Saved successfully!"
              : "रेकॉर्ड यशस्वीरित्या जतन केले!",
            "success"
          );
          // router.push({
          //     pathname: `/dashboard`,
          // })
          let temp = res?.data?.message;
          // router.push({
          //     pathname: `/lms/transactions/renewMembership/acknowledgmentReceipt`,
          //     query: {
          //         id: Number(temp.split(':')[1]),
          //     },
          // })
          if (localStorage.getItem("loggedInUser") == "cfcUser") {
            router.push(`/CFC_Dashboard`);
          } else {
            router.push(`/dashboard`);
          }
          // router.push({
          //   pathname: "/dashboard",
          // });
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err123", err.response.data.status);
        if (err.response.data.status == 409) {
          swal(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "Application for this member already exist!"
              : "या सदस्यासाठी अर्ज आधीच अस्तित्वात आहे!",
            "error"
          );
        } else {
          swal(
            language == "en" ? "Error!" : "त्रुटी!",
            language == "en"
              ? "Somethings Wrong, Record not Saved!"
              : "काहीतरी चुकीचे आहे, रेकॉर्ड सेव्ह नाही!",
            "error"
          );
        }
      });
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider theme={theme}>
          <Paper
            sx={{
              marginLeft: 5,
              marginRight: 5,
              marginTop: 5,
              marginBottom: 5,
              padding: 1,
            }}
            id="paper-top"
          >
            <LmsHeader labelName="transferLibraryMembership" />
            {loading ? (
              <Loader />
            ) : (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <>
                    {localStorage.getItem("loggedInUser") == "cfcUser" &&
                      !showDetails && (
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          ></Grid>
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              paddingTop: "2",
                            }}
                          >
                            <TextField
                              // disabled={watch("afName") ? true : false}
                              InputLabelProps={{
                                shrink: watch("membershipNoForSearch")
                                  ? true
                                  : false,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="membershipNo" required />
                              }
                              // label="First Name (In English)"
                              variant="standard"
                              {...register("membershipNoForSearch")}
                              error={!!errors.membershipNoForSearch}
                              helperText={
                                errors?.membershipNoForSearch
                                  ? errors.membershipNoForSearch.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              paddingTop: "2",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="success"
                              // size="small"
                              endIcon={<SearchIcon />}
                              disabled={
                                watch("membershipNoForSearch") ? false : true
                              }
                              onClick={() => {
                                getMembershipDetailsFromCfc(
                                  watch("membershipNoForSearch")
                                );
                              }}
                            >
                              <FormattedLabel id="search" />
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    {showDetails ? (
                      <>
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.zoneKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zone" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    //sx={{ width: 230 }}
                                    disabled={watch("zoneKey") ? true : false}
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "Zone Key: ",
                                        value.target.value
                                      );
                                      // setTemp(value.target.value)
                                    }}
                                    label="Zone Name  "
                                  >
                                    {zoneKeys &&
                                      zoneKeys.map((zoneKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={zoneKey.id}
                                        >
                                          {/*  {zoneKey.zoneKey} */}

                                          {language == "en"
                                            ? zoneKey?.zoneName
                                            : zoneKey?.zoneNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="zoneKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.zoneKey
                                  ? errors.zoneKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.libraryKey}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="libraryCSC" required />
                                {/* Library/Competitive Study Centre */}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    //sx={{ width: 230 }}
                                    // disabled={disable}
                                    disabled={
                                      watch("libraryKey") ? true : false
                                    }
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "Zone Key: ",
                                        value.target.value
                                      );
                                      // setTemp(value.target.value)
                                    }}
                                    // label="Library/Competitive Study Centre "
                                    label={
                                      <FormattedLabel
                                        id="libraryCSC"
                                        required
                                      />
                                    }
                                  >
                                    {libraryKeys &&
                                      libraryKeys.map((libraryKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={libraryKey.id}
                                        >
                                          {/*  {zoneKey.zoneKey} */}

                                          {/* {language == 'en'
                                                                                                 ? libraryKey?.libraryName
                                                                                                 : libraryKey?.libraryNameMr} */}
                                          {libraryKey?.libraryName}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="libraryKey"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.libraryKey
                                  ? errors.libraryKey.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </Grid>
                        <div className={styles.details1TABLE}>
                          <div className={styles.h2TagTABLE}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {<FormattedLabel id="applicantName" />}
                              {/* Applicant Name */}
                            </h3>
                          </div>
                        </div>
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors.atitle}
                              sx={{ marginTop: 2 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="titleEn" required />
                                {/* Title In English */}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    // disabled
                                    // disabled={disable}
                                    disabled={watch("atitle") ? true : false}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="titleEn" required />
                                    }
                                    id="demo-simple-select-standard"
                                    labelId="id='demo-simple-select-standard-label'"
                                  >
                                    {atitles &&
                                      atitles.map((atitle, index) => (
                                        <MenuItem key={index} value={atitle.id}>
                                          {atitle.atitle}
                                          {/* {language == 'en'
                                                     ? atitle?.title
                                                     : atitle?.titleMr} */}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="atitle"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.atitle ? errors.atitle.message : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              // disabled={disable}
                              disabled={watch("afName") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={<FormattedLabel id="fnameEn" required />}
                              // label="First Name (In English)"
                              variant="standard"
                              {...register("afName")}
                              error={!!errors.afName}
                              helperText={
                                errors?.afName ? errors.afName.message : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("amName") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              // label="Middle Name (In English)"
                              label={<FormattedLabel id="mnameEn" required />}
                              variant="standard"
                              {...register("amName")}
                              error={!!errors.amName}
                              helperText={
                                errors?.amName ? errors.amName.message : null
                              }
                            />
                          </Grid>
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              // disabled
                              // disabled={disable}
                              disabled={watch("alName") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              // label="Last Name (In English)"
                              label={<FormattedLabel id="lnameEn" required />}
                              variant="standard"
                              {...register("alName")}
                              error={!!errors.alName}
                              helperText={
                                errors?.alName ? errors.alName.message : null
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                          >
                            <FormControl
                              variant="standard"
                              error={!!errors.atitlemr}
                              sx={{ marginTop: 2 }}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="titleMr" required />
                                {/* Title in Marathi */}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    // disabled
                                    // disabled={disable}
                                    disabled={watch("atitlemr") ? true : false}
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="titleMr" required />
                                    }
                                    id="demo-simple-select-standard"
                                    labelId="id='demo-simple-select-standard-label'"
                                  >
                                    {TitleMrs &&
                                      TitleMrs.map((atitlemr, index) => (
                                        <MenuItem
                                          key={index}
                                          value={atitlemr.id}
                                        >
                                          {atitlemr.atitlemr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="atitlemr"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.atitlemr
                                  ? errors.atitlemr.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("afNameMr") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              // label="First Name (In Marathi)"
                              label={<FormattedLabel id="fnameMr" required />}
                              // label=" Hello"
                              variant="standard"
                              {...register("afNameMr")}
                              error={!!errors.afNameMr}
                              helperText={
                                errors?.afNameMr
                                  ? errors.afNameMr.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("amNameMr") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              // label="Middle Name (In Marathi)"
                              label={<FormattedLabel id="mnameMr" required />}
                              // label="मधले नावं *"
                              variant="standard"
                              {...register("amNameMr")}
                              error={!!errors.amNameMr}
                              helperText={
                                errors?.amNameMr
                                  ? errors.amNameMr.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={3}
                            lg={3}
                            md={3}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              // disabled
                              // disabled={disable}
                              disabled={watch("alNameMr") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              // label="Last Name (In Marathi) "
                              label={<FormattedLabel id="lnameMr" required />}
                              // label="आडनाव *"
                              variant="standard"
                              {...register("alNameMr")}
                              error={!!errors.alNameMr}
                              helperText={
                                errors?.alNameMr
                                  ? errors.alNameMr.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>

                        <div className={styles.details1TABLE}>
                          <div className={styles.h2TagTABLE}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {<FormattedLabel id="ApplicatDetails" />}
                              {/* Applicant Details */}
                            </h3>
                          </div>
                        </div>

                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("aflatBuildingNo") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="flatBuildingNo" required />
                              }
                              // label="Flat/Building No (In English) "
                              variant="standard"
                              {...register("aflatBuildingNo")}
                              error={!!errors.aflatBuildingNo}
                              helperText={
                                errors?.aflatBuildingNo
                                  ? errors.aflatBuildingNo.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("abuildingName") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="buildingName" required />
                              }
                              // label="Apartment Name (In English)"
                              variant="standard"
                              {...register("abuildingName")}
                              error={!!errors.abuildingName}
                              helperText={
                                errors?.abuildingName
                                  ? errors.abuildingName.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("aroadName") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="roadNameEn" required />
                              }
                              // label="Road Name (In English)"
                              variant="standard"
                              {...register("aroadName")}
                              error={!!errors.aroadName}
                              helperText={
                                errors?.aroadName
                                  ? errors.aroadName.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("alandmark") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="landmarkEn" required />
                              }
                              // label="Landmark (In English)"
                              variant="standard"
                              {...register("alandmark")}
                              error={!!errors.alandmark}
                              helperText={
                                errors?.alandmark
                                  ? errors.alandmark.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("acityName") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="cityOrVillageEn" required />
                              }
                              // label="City Name / Village Name (In English)"
                              variant="standard"
                              {...register("acityName")}
                              error={!!errors.acityName}
                              helperText={
                                errors?.acityName
                                  ? errors.acityName.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              defaultValue="Maharashtra"
                              //  disabled
                              // disabled={disable}
                              disabled={watch("astate") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="state" required />}
                              // label="State (In English)"
                              variant="standard"
                              {...register("astate")}
                              error={!!errors.astate}
                              helperText={
                                errors?.astate ? errors.astate.message : null
                              }
                            />
                          </Grid>
                        </Grid>

                        {/* marathi Adress */}

                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              // disabled={disable}
                              disabled={
                                watch("aflatBuildingNoMr") ? true : false
                              }
                              sx={{ width: 250 }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              id="standard-basic"
                              label={
                                <FormattedLabel
                                  id="flatBuildingNoMr"
                                  required
                                />
                              }
                              // label="Flat/Building No (In Marathi)"
                              variant="standard"
                              //  value={`${this.state.pflatBuildingNo},${this.state.cflatBuildingNo}`}
                              //  value={pflatBuildingNo}
                              // onChange={(e) => setValue(e.target.pflatBuildingNo)}
                              {...register("aflatBuildingNoMr")}
                              error={!!errors.aflatBuildingNoMr}
                              helperText={
                                errors?.aflatBuildingNoMr
                                  ? errors.aflatBuildingNoMr.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("abuildingNameMr") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="buildingNameMr" required />
                              }
                              // label="Apartment Name (In Marathi)"
                              variant="standard"
                              {...register("abuildingNameMr")}
                              error={!!errors.abuildingNameMr}
                              helperText={
                                errors?.abuildingNameMr
                                  ? errors.abuildingNameMr.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("aroadNameMr") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              // label="Road Name (In Marathi)"
                              label={
                                <FormattedLabel id="roadNameMr" required />
                              }
                              // label="गल्लीचे नाव"
                              variant="standard"
                              {...register("aroadNameMr")}
                              error={!!errors.aroadNameMr}
                              helperText={
                                errors?.aroadNameMr
                                  ? errors.aroadNameMr.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("alandmarkMr") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              // label="Landmark (In Marathi)"
                              label={
                                <FormattedLabel id="landmarkMr" required />
                              }
                              // label="जमीन चिन्ह"
                              variant="standard"
                              {...register("alandmarkMr")}
                              error={!!errors.alandmarkMr}
                              helperText={
                                errors?.alandmarkMr
                                  ? errors.alandmarkMr.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("acityNameMr") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              // label="City Name / Village Name (In Marathi)"
                              label={
                                <FormattedLabel id="cityOrVillageMr" required />
                              }
                              // label="शहराचे नाव"
                              variant="standard"
                              {...register("acityNameMr")}
                              error={!!errors.acityNameMr}
                              helperText={
                                errors?.acityNameMr
                                  ? errors.acityNameMr.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              defaultValue="महाराष्ट्र"
                              // disabled={disable}
                              disabled={watch("astateMr") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 230 }}
                              id="standard-basic"
                              label={<FormattedLabel id="stateMr" required />}
                              // label="State (In Marathi)"
                              variant="standard"
                              {...register("astateMr")}
                              error={!!errors.astateMr}
                              helperText={
                                errors?.astateMr
                                  ? errors.astateMr.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              //  disabled
                              // disabled={disable}
                              disabled={watch("apincode") ? true : false}
                              InputLabelProps={{ shrink: true }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="pincode" required />}
                              variant="standard"
                              {...register("apincode")}
                              error={!!errors.apincode}
                              helperText={
                                errors?.apincode
                                  ? errors.apincode.message
                                  : null
                              }
                            />
                          </Grid>
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              // disabled={disable}
                              disabled={watch("amobileNo") ? true : false}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="mobile" required />}
                              // label="Mobile No"
                              variant="standard"
                              // value={pageType ? router.query.mobile : ''}
                              // disabled={router.query.pageMode === 'View'}
                              {...register("amobileNo")}
                              error={!!errors.amobileNo}
                              helperText={
                                errors?.amobileNo
                                  ? errors.amobileNo.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              // disabled={disable}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{ width: 250 }}
                              id="standard-basic"
                              label={<FormattedLabel id="email" required />}
                              variant="standard"
                              //  value={pageType ? router.query.emailAddress : ''}
                              // disabled={router.query.pageMode === 'View'}
                              disabled={watch("aemail") ? true : false}
                              {...register("aemail")}
                              error={!!errors.aemail}
                              helperText={
                                errors?.aemail ? errors.aemail.message : null
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  (watch("aadharNo") ? true : false) ||
                                  (router.query.aadharNo ? true : false),
                              }}
                              id="standard-basic"
                              label={<FormattedLabel id="aadharNo" required />}
                              // label="Aadhar No"
                              variant="standard"
                              disabled={watch("aadharNo") ? true : false}
                              {...register("aadharNo")}
                              error={!!errors.aadharNo}
                              helperText={
                                errors?.aadharNo
                                  ? errors.aadharNo.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>

                        {/* owner details */}

                        <div className={styles.details1TABLE}>
                          <div className={styles.h2TagTABLE}>
                            <h3
                              style={{
                                color: "white",
                                marginTop: "7px",
                              }}
                            >
                              {
                                <FormattedLabel id="transferMembershipDetails" />
                              }
                              {/* Membership Details */}
                              {/* Owner Details : */}
                            </h3>
                          </div>
                        </div>

                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors?.zoneKeyM}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="zone" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    //sx={{ width: 230 }}
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "Zone Key: ",
                                        value.target.value
                                      );
                                      // setTemp(value.target.value)
                                    }}
                                    label="Zone Name  "
                                  >
                                    {zoneKeys &&
                                      zoneKeys.map((zoneKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={zoneKey.id}
                                        >
                                          {/*  {zoneKey.zoneKey} */}

                                          {language == "en"
                                            ? zoneKey?.zoneName
                                            : zoneKey?.zoneNameMr}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="zoneKeyM"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.zoneKeyM
                                  ? errors.zoneKeyM.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <FormControl
                              variant="standard"
                              sx={{ marginTop: 2 }}
                              error={!!errors.libraryKeyM}
                            >
                              <InputLabel id="demo-simple-select-standard-label">
                                <FormattedLabel id="libraryCSC" required />
                                {/* Library/Competitive Study Centre */}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    //sx={{ width: 230 }}
                                    // disabled={disable}
                                    value={field.value}
                                    onChange={(value) => {
                                      field.onChange(value);
                                      console.log(
                                        "Zone Key: ",
                                        value.target.value
                                      );
                                      // setTemp(value.target.value)
                                    }}
                                    // label="Library/Competitive Study Centre "
                                    label={
                                      <FormattedLabel
                                        id="libraryCSC"
                                        required
                                      />
                                    }
                                  >
                                    {libraryKeysM &&
                                      libraryKeysM.map((libraryKey, index) => (
                                        <MenuItem
                                          key={index}
                                          value={libraryKey.id}
                                        >
                                          {/*  {zoneKey.zoneKey} */}

                                          {/* {language == 'en'
                                                                                                 ? libraryKey?.libraryName
                                                                                                 : libraryKey?.libraryNameMr} */}
                                          {libraryKey?.libraryName}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                )}
                                name="libraryKeyM"
                                control={control}
                                defaultValue=""
                              />
                              <FormHelperText>
                                {errors?.libraryKeyM
                                  ? errors.libraryKeyM.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          spacing={2}
                          columnSpacing={{
                            xs: 1,
                            sm: 2,
                            md: 3,
                            lg: 12,
                            xl: 12,
                          }}
                          style={{ marginTop: "1vh", marginLeft: "1vh" }}
                          columns={16}
                        >
                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  (watch("membershipNo") ? true : false) ||
                                  (router.query.membershipNo ? true : false),
                              }}
                              id="standard-basic"
                              label={
                                <FormattedLabel id="membershipNo" required />
                              }
                              disabled={watch("membershipNo") ? true : false}
                              // label="Aadhar No"
                              variant="standard"
                              {...register("membershipNo")}
                              error={!!errors.membershipNo}
                              helperText={
                                errors?.membershipNo
                                  ? errors.membershipNo.message
                                  : null
                              }
                            />
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <FormControl
                              sx={{ marginTop: 0 }}
                              error={!!errors.lastEndDate}
                            >
                              <Controller
                                control={control}
                                name="lastEndDate"
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
                                    <DatePicker
                                      // maxDate={new Date()}
                                      // disabled={disable}
                                      disabled
                                      inputFormat="DD/MM/YYYY"
                                      label={
                                        <span style={{ fontSize: 14 }}>
                                          {" "}
                                          {/* Membership Start Date */}
                                          {
                                            <FormattedLabel
                                              id="lastEndDate"
                                              required
                                            />
                                          }
                                        </span>
                                      }
                                      value={oldEndDate}
                                      onChange={(date) =>
                                        field.onChange(
                                          moment(date).format("YYYY-MM-DD")
                                        )
                                      }
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          // disabled={disabled}
                                          {...params}
                                          size="small"
                                          fullWidth
                                          InputLabelProps={{
                                            style: {
                                              fontSize: 12,
                                              marginTop: 3,
                                            },
                                          }}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.lastEndDate
                                  ? errors.lastEndDate.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>

                          <Grid
                            // style={{ marginTop: '1vh' }}
                            item
                            xl={4}
                            lg={4}
                            md={4}
                            sm={12}
                            xs={12}
                          >
                            <TextField
                              InputLabelProps={{
                                shrink:
                                  (watch("remainingMembershipNumberOfMonth")
                                    ? true
                                    : false) ||
                                  (router.query.remainingMembershipNumberOfMonth
                                    ? true
                                    : false),
                              }}
                              id="standard-basic"
                              label={
                                <FormattedLabel
                                  id="membershipMonths"
                                  required
                                />
                              }
                              disabled={
                                watch("remainingMembershipNumberOfMonth")
                                  ? true
                                  : false
                              }
                              // label="Aadhar No"
                              variant="standard"
                              {...register("remainingMembershipNumberOfMonth")}
                              error={!!errors.remainingMembershipNumberOfMonth}
                              helperText={
                                errors?.remainingMembershipNumberOfMonth
                                  ? errors.remainingMembershipNumberOfMonth
                                      .message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                        {tempDisabled ? (
                          <>
                            <Grid
                              container
                              spacing={2}
                              columnSpacing={{
                                xs: 1,
                                sm: 2,
                                md: 3,
                                lg: 12,
                                xl: 12,
                              }}
                              style={{ marginTop: "1vh", marginLeft: "1vh" }}
                              columns={16}
                            >
                              <Grid
                                item
                                style={{ marginTop: "4vh" }}
                                xl={4}
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                              >
                                <Button
                                  type="submit"
                                  variant="contained"
                                  // color="success"
                                  endIcon={<SaveIcon />}
                                  disabled={isReopen}
                                >
                                  {<FormattedLabel id="save" />}
                                  {/* save */}
                                </Button>
                              </Grid>

                              <Grid
                                item
                                style={{ marginTop: "4vh" }}
                                xl={4}
                                lg={4}
                                md={4}
                                sm={12}
                                xs={12}
                              >
                                <Button
                                  variant="contained"
                                  onClick={() => {
                                    swal({
                                      title:
                                        language == "en" ? "Error!" : "त्रुटी!",
                                      text:
                                        language == "en"
                                          ? "Are you sure you want to exit this Record?"
                                          : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?",
                                      icon: "warning",
                                      buttons: true,
                                      dangerMode: true,
                                    }).then((willDelete) => {
                                      if (willDelete) {
                                        swal(
                                          language == "en"
                                            ? "Record is Successfully Exited!"
                                            : "रेकॉर्डमधून यशस्वीरित्या बाहेर पडले!",
                                          {
                                            icon: "success",
                                          }
                                        );
                                        if (
                                          localStorage.getItem(
                                            "loggedInUser"
                                          ) == "cfcUser"
                                        ) {
                                          router.push(`/CFC_Dashboard`);
                                        } else {
                                          router.push(`/dashboard`);
                                        }
                                        // router.push({
                                        //   pathname: `/dashboard`,
                                        // });
                                      } else {
                                        swal(
                                          language == "en"
                                            ? "Record is Safe"
                                            : "रेकॉर्ड सुरक्षित आहे"
                                        );
                                      }
                                    });
                                  }}
                                >
                                  <FormattedLabel id="exit" />
                                  {/* exit */}
                                </Button>
                              </Grid>
                            </Grid>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    ) : (
                      <>
                        {localStorage.getItem("loggedInUser") !== "cfcUser" && (
                          <div className={styles.row}>
                            {language == "en" ? (
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  color: "red",
                                  margin: "5vh",
                                }}
                              >
                                {/* <FormattedLabel id="attachmentSchema" /> */}
                                *Note:- Your membership for Competetive Study
                                Center not available to Transfer
                              </Typography>
                            ) : (
                              <Typography
                                sx={{
                                  fontWeight: 800,
                                  color: "red",
                                  margin: "5vh",
                                }}
                              >
                                {/* <FormattedLabel id="attachmentSchema" /> */}
                                *नोंद:- तुमची स्पर्धात्मक अभ्यास केंद्राची
                                सदस्यता हस्तांतरणासाठी उपलब्ध नाही
                              </Typography>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </>
                </form>
              </FormProvider>
            )}
          </Paper>
        </ThemeProvider>
      </LocalizationProvider>
    </>
  );
};

export default Index;
