import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import sweetAlert from "sweetalert";
import urls from "../../../URLS/urls";
import styles from "../../../components/streetVendorManagementSystem/styles/renewalHawkerLicense.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Authore - Sachin Durge */
// SearchHawkerLicense
const SearchHawkerLicense = (props) => {
  const {
    control,
    register,
    getValues,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const router = useRouter();
  const [renewalId, setRenewalId] = useState();
  const [cancellationId, setCancellationId] = useState();
  const [transferId, setTransferId] = useState();
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  let loggedInUser = localStorage.getItem("loggedInUser");


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

  // getHawkerLicenseData
  const getHawkerLicenseData = () => {
    setValue("loadderStateSearch", true);

    let url = ``;

    if (renewalId != null && renewalId != undefined && renewalId != "") {
      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/getById?id=${renewalId}`;
    }
    if (
      cancellationId != null &&
      cancellationId != undefined &&
      cancellationId != ""
    ) {
      url = `${urls.HMSURL}/cancellationOfHawkerLicense/getById?id=${cancellationId}`;
    }
    if (transferId != null && transferId != undefined && transferId != "") {
      url = `${urls.HMSURL}/transferOfHawkerLicense/getById?id=${transferId}`;
    }

    /** Api */

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data != null &&
            res?.data != undefined &&
            res?.data != "" &&
            typeof res?.data != "string"
          ) {
            const resetData = {
              ...res?.data,
              disabledFieldInputState: true,
              SearchAndOtherButtonConditionalState: true,
              loadderStateSearch: false,
            };
            reset(resetData);
          }
        } else {
          setValue("loadderStateSearch", false);
        }
      })
      .catch((error) => {
        setValue("loadderStateSearch", false);
        callCatchMethod(error, language);
        console.log("searchByLicenseNumber", error);
      });
  };

  // handleExit
  const handleExit = () => {
    if (loggedInUser == "citizenUser") {
      setValue("loadderState", false)
      router.push(`/dashboard`)
    } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
      setValue("loadderState", false)
      router.push(`/CFC_Dashboard`)
    } else if (loggedInUser == "DEPT_USER") {
      setValue("loadderState", false)
      router.push(`/streetVendorManagementSystem/dashboards`)
    }

  };




  // handleSerach
  const issuanceOfHakerLicenseSerach = () => {
    // onSearchClickLoader
    setValue("loadderStateSearch", true);
    let applicantName = watch("applicantName");
    let dateOfBirth = watch("dateOfBirth");
    // let mobile = watch("mobile");
    let certificateNo = watch("certificateNo");

    // body
    let body = {
      // dateOfBirth
      dateOfBirth: dateOfBirth,

      // applicantName
      applicantName:
        applicantName != null && applicantName != "" && applicantName != undefined
          ? typeof applicantName == "number"
            ? applicantName.toString().trim().toLowerCase()
            : applicantName.trim().toLowerCase()
          : applicantName.trim().toLowerCase(),

      // applicantNameMr
      applicantNameMr:
        applicantName != null && applicantName != "" && applicantName != undefined
          ? typeof applicantName == "number"
            ? applicantName.toString().trim().toLowerCase()
            : applicantName.trim().toLowerCase()
          : applicantName.trim().toLowerCase(),

      // // applicantName
      // applicantName:
      //   applicantName != null && applicantName != "" &&  applicantName != undefined
      //     ? typeof applicantName == "number"
      //       ? applicantName.toString().trim()
      //       : applicantName.trim()
      //     : applicantName,

      // mobile
      // mobile:
      //   mobile != null && mobile != "" && mobile != undefined
      //     ? typeof mobile == "number"
      //       ? mobile.toString().trim()
      //       : mobile.trim()
      //     : mobile,

      // certificateNo
      certificateNo:
        certificateNo != null &&
          certificateNo != "" &&
          certificateNo != undefined
          ? typeof certificateNo == "number"
            ? certificateNo.toString().trim()
            : certificateNo.trim()
          : certificateNo,
    };

    console.log("body1212", body);
    let url = ``;

    if (props?.serviceId == "25") {
      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/getByLicensenNo`;
    }

    if (props?.serviceId == "27") {
      url = `${urls.HMSURL}/cancellationOfHawkerLicense/getByLicensenNo`;
    }

    if (props?.serviceId == "26") {
      url = `${urls.HMSURL}/transferOfHawkerLicense/getByLicensenNo`;
    }

    // cancellationOfHawkerLicense / getByLicensenNo;
    console.log("licenseNumber2332", watch("certificateNo"), props?.serviceId);
    if (
      (certificateNo != null &&
        certificateNo != undefined &&
        certificateNo != "") ||
      (applicantName != null &&
        applicantName != undefined &&
        applicantName != "") ||
      (dateOfBirth != null && dateOfBirth != undefined && dateOfBirth != "")
    ) {
      axios
        .post(url, body, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          // upper if
          if (res?.status == 200 || res?.status == 201) {
            if (
              res?.data != null &&
              res?.data != undefined &&
              typeof res?.data != "string"
            ) {
              if (props?.serviceId == "26") {
                // console.log("res35354",res?.data?.dateOfBirth,moment(res?.data?.dateOfBirth,"YYYY-MM-DD").format("DD-MM-YYYYThh:mm:ss"))
                const resetFinalData = {
                  zoneNameOld: res?.data?.zoneKey,
                  wardNameOld: res?.data?.wardName,
                  citySurveyNoOld: res?.data?.citySurveyNo,
                  hawkingZoneNameOld: res?.data?.hawkingZoneName,
                  areaNameOld: res?.data?.areaName,
                  titleOld: res?.data?.title,
                  firstNameOld: res?.data?.firstName,
                  middleNameOld: res?.data?.middleName,
                  lastNameOld: res?.data?.lastName,
                  dateOfBirthOld: res?.data?.dateOfBirth,
                  ageOld: res?.data?.age,
                  mobileOld: res?.data?.mobile,
                  emailAddressOld: res?.data?.emailAddress,
                  genderOld: res?.data?.gender,
                  disabledFieldInputState: false,
                  SearchAndOtherButtonConditionalState: true,
                  loadderStateSearch: false,
                  certificateNo: res?.data?.certificateNo,
                };
                reset(resetFinalData);
                clearErrors("dateOfBirthOld");
              } else {
                const dataReset = {
                  ...res?.data,
                  disabledFieldInputState: true,
                  SearchAndOtherButtonConditionalState: true,
                  loadderStateSearch: false,
                };
                reset(dataReset);
              }
            }
          } else {
            setValue("loadderStateSearch", false);
            setValue("certificateNo", "");
            setValue("applicantName", "");
            setValue("dateOfBirth", null);
          }
        })
        .catch((errors) => {
          setValue("certificateNo", "");
          setValue("applicantName", "");
          setValue("dateOfBirth", null);
          setValue("loadderStateSearch", false);
          console.log("searchApiCatch", errors)
          if (
            errors?.response?.data?.message != "" &&
            errors?.response?.data?.message != undefined
          ) {

            sweetAlert({
              // title: language == "en" ? "Error !" : "त्रुटी!",
              text:
                language == "en"
                  ? "Data Not Found Against License No and Other Inputs."
                  : "लायसेंस नंबर आणि इतर माहितीच्या विरुद्ध डेटा सापडला नाही.",
              icon: "error",
              buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
            });
          } else {
            callCatchMethod(errors, language);
          }

          setValue("loadderStateSearch", false);
        });
    } else {
      setValue("certificateNo", "");
      setValue("applicantName", "");
      setValue("dateOfBirth", null);
      setValue("loadderStateSearch", false);
      sweetAlert({
        text:
          language == "en"
            ? "Please Enter Valid Input."
            : "कृपया वैध इनपुट प्रविष्ट करा",
        icon: "warning",
        buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
      });


    }
  };

  //! ==========================> useEffect <===========================
  useEffect(() => {
    if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
      localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
      localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
      setRenewalId(localStorage.getItem("renewalOfHawkerLicenseId"));
    }

    if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      setCancellationId(localStorage.getItem("cancellationOfHawkerLicenseId"));
    }

    if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" &&
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
      setTransferId(localStorage.getItem("transferOfHawkerLicenseId"));
    }
  }, []);

  useEffect(() => {
    if (
      (renewalId != null && renewalId != undefined && renewalId != "") ||
      (cancellationId != null &&
        cancellationId != undefined &&
        cancellationId != "") ||
      (transferId != null && transferId != undefined && transferId != "")
    ) {
      getHawkerLicenseData();
    }

    console.log("Id", renewalId, cancellationId, transferId);
  }, [renewalId, cancellationId, transferId]);

  useEffect(() => {
    if (watch("certificateNo") != "" && watch("certificateNo") != null && watch("certificateNo") != undefined) {
      setValue("applicantName", "");
      setValue("dateOfBirth", null);
    }

  }, [watch("certificateNo")])

  useEffect(() => {
    if (watch("applicantName") != "" && watch("applicantName") != null && watch("applicantName") != undefined) {
      setValue("certificateNo", "");
    }
  }, [watch("applicantName")])

  useEffect(() => {
    if (watch("dateOfBirth") != "" && watch("dateOfBirth") != null && watch("dateOfBirth") != undefined) {
      setValue("certificateNo", "");
    }
  }, [watch("dateOfBirth")])



  // view
  return (
    <>
      {watch("loadderStateSearch") ? (
        <Loader />
      ) : (
        <>
          {/** First params */}
          <Accordion sx={{ margin: "5vh 2vw" }}>
            <AccordionSummary
              sx={{
                backgroundColor: "#278bff",
                color: "white",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#278bff"
            >
              <Typography> {<FormattedLabel id="issuanceOfHawkerLicenseNumber1" />}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className={styles.center}>
                <TextField
                  variant="outlined"
                  style={{ width: "400px" }}
                  id="standard-basic"
                  label={<FormattedLabel id="issuanceOfHawkerLicenseNumber" />}
                  {...register("certificateNo")}
                />
              </div>
            </AccordionDetails>
          </Accordion>

          {/** Third params */}
          {/** Second parms */}
          <Accordion sx={{ margin: "5vh 2vw" }}>
            <AccordionSummary
              sx={{
                backgroundColor: "#278bff",
                color: "white",
                textTransform: "uppercase",
              }}
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              backgroundColor="#278bff"
            >
              <Typography>
                {<FormattedLabel id="streetVendorFullNameAndDateOfBirth" />}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  padding: "0 10vw",
                }}
              >
                <div>
                  <TextField
                    variant="outlined"
                    style={{ width: "400px" }}
                    // disabled={watch("disabledFieldInputState")}
                    id="standard-basic"
                    label={<FormattedLabel id="streetVendorFullName" />}
                    {...register("applicantName")}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "3vh",
                  }}
                >
                  <Typography style={{ textAlign: "center", color: "black" }}>
                    <FormattedLabel id="and" />
                  </Typography>
                </div>
                <div>
                  <FormControl
                    error={!!errors.dateOfBirth}
                    sx={{ marginTop: 0 }}
                  >
                    <Controller
                      control={control}
                      name="dateOfBirth"
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16, marginTop: 2 }}>
                                {<FormattedLabel id="dateOfBirth" />}
                              </span>
                            }
                            value={field.value}
                            onChange={(date) => {
                              field.onChange(moment(date).format("YYYY-MM-DD"));
                              let date1 = moment(date).format("YYYY");
                              setValue(
                                "age",
                                Math.floor(moment().format("YYYY") - date1)
                              );
                            }}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                variant="outlined"
                                sx={{ width: "400px" }}
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
                      {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
                    </FormHelperText>
                  </FormControl>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>

          {/** Third params */}
          {/** 
             <Accordion sx={{margin: "5vh 2vw"}}
                  >
                    <AccordionSummary
                      sx={{
                        backgroundColor: "#278bff",
                        color: "white",
                        textTransform: "uppercase",
                      }}
                      expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      backgroundColor="#278bff"
                    >
                      <Typography> 2) Streetvendor FullName and Mobile Number</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
            <div style={{
              display: "flex",
                    justifyContent: "space-between",
             flexWrap: "wrap",
              alignItems: "center",
              padding:"0 10vw"
            }}>
              <div>
                <TextField
                variant="outlined"
                        id="standard-basic"
                          style={{ width: "400px" }}
              label={<FormattedLabel id="streetVendorFullName" />}
              {...register("applicantName")}
            /></div>
              <div
                style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop:"3vh"
              }}>
                <Typography
                  style={{textAlign:"center",color:"black"}}
                >
                  <FormattedLabel id="and"/>
                  </Typography>
              </div>
              <div>
                 <TextField
                 variant="outlined"
            style={{ width: "400px" }}
              id="standard-basic"
              label={<FormattedLabel id="mobile" />}
              {...register("mobile")}
            />
                
                
                
                  </div>
              </div>
            
                     
                    </AccordionDetails>
    </Accordion>

            */}

          {/** Button */}
          {!watch("SearchAndOtherButtonConditionalState") && (
            <>
              <Stack
                style={{
                  marginTop: "4vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
                direction="row"
                spacing={5}
              // sx={{ paddingLeft: "30px", align: "center" }}
              >
                {/** Search Button */}
                <Button
                  startIcon={<SearchIcon />}
                  onClick={() => {
                    setValue("loadderStateSearch", true);
                    issuanceOfHakerLicenseSerach();
                  }}
                  variant="contained"
                >
                  {<FormattedLabel id="search" />}
                </Button>
                {/** Exit Button */}
                <Button onClick={handleExit} variant="contained">
                  {<FormattedLabel id="exit" />}
                </Button>
              </Stack>
            </>
          )}
        </>
      )}
    </>
  );
};

export default SearchHawkerLicense;
