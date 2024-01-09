import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Sachin Durge */
// AdditionalDetails
const AdditionalDetails = () => {
  const {
    control,
    register,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [areaNames, setAreaName] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wards, setWards] = useState([]);
  const [hawkingDurationDailys, setHawkingDurationDaily] = useState([]);
  const [hawkerTypes, setHawkerType] = useState([]);
  const [items, setItems] = useState([]);
  const [bankMasters, setBankMasters] = useState([]);
  const [landmarkNames, setLandmarkNames] = useState([]);
  const [roadNames, setRoadNames] = useState([]);
  const [hawkingZoneNames, setHawkingZoneName] = useState([]);
  const [educations, setEducations] = useState([]);
  const [streetvendorModeNames, setStreetvendorModeNames] = useState([]);
  const [pincodes, setPinCodes] = useState([]);
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // Drawer
  const [open, setOpen] = React.useState(false);
  let drawerWidth;

  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "5vw";
  };

  // Close Drawer
  const handleDrawerClose = () => {
    setOpen(false);
    drawerWidth = 0;
  };

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

  // zones
  const getZoneName = () => {
    const url = `${urls.CFCURL}/master/zone/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setZoneNames(
            r?.data?.zone?.map((row) => ({
              id: row?.id,
              zoneName: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("zoneNameApiCallError", error);
      });
  };

  // wards
  const getWards = () => {
    if (watch("zoneKey") != null) {
      let url = `${
        urls.CFCURL
      }/master/zoneWardAreaMapping/getWardByZoneAndModuleId?zoneId=${watch(
        "zoneKey"
      )}&moduleId=4`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setWards(
              r?.data?.map((row) => ({
                id: row?.wardId,
                wardName: row?.wardName,
                wardNameMr: row?.wardNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("zoneNameApiCallError", error);
        });
    }
  };

  // areas
  const getAreaName = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      axios
        .get(`${urls.CFCURL}/master/area/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setAreaName(
              r?.data?.area?.map((row) => ({
                id: row?.id,
                areaName: row?.areaName,
                areaNameMr: row?.areaNameMr,
                // id: row?.id,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("areaNameApiError", error);
        });
    } else {
      if (watch("wardName") != null) {
        let url = `${
          urls.CFCURL
        }/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId?zoneId=${watch(
          "zoneKey"
        )}&wardId=${watch("wardName")}&moduleId=4`;

        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (
              r?.status == 200 ||
              res?.status == 201 ||
              res?.status == "SUCCESS"
            ) {
              setAreaName(
                r?.data?.map((row) => ({
                  id: row?.areaId,
                  areaName: row?.areaName,
                  areaNameMr: row?.areaNameMr,
                  uniqueId: row?.uniqueId,
                }))
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
            console.log("areaNameApiCallError", error);
          });
      }
    }
  };

  const getLandmark = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      console.log("deptEdit");

      // landMark
      axios
        .get(`${urls.CFCURL}/master/locality/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setLandmarkNames(
              r?.data?.locality?.map((row) => ({
                id: row?.id,
                landmarkName: row?.landmarkEng,
                landmarkNameMr: row?.landmarkMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("landmarkApiCallError", error);
        });
    } else {
      if (
        watch("addressUniqueId") != null &&
        watch("addressUniqueId") != undefined
      ) {
        let url = `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getLandmarks`;

        let body = {
          zoneWardAreaMapping: watch("addressUniqueId"),
        };

        axios
          .post(url, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (
              r?.status == 200 ||
              res?.status == 201 ||
              res?.status == "SUCCESS"
            ) {
              // landmarks
              setLandmarkNames(
                r?.data?.map((row) => ({
                  id: row?.landMarkId,
                  landmarkName: row?.landMarkEng,
                  landmarkNameMr: row?.landMarkmr,
                }))
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
            console.log("landmarkApiCallError", error);
          });
      }
    }
  };

  const getRoadname = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      console.log("deptEdit");

      // roadname
      axios
        .get(`${urls.CFCURL}/mstRoadName/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (
            r?.status == 200 ||
            res?.status == 201 ||
            res?.status == "SUCCESS"
          ) {
            setRoadNames(
              r?.data?.roadName?.map((row) => ({
                id: row?.id,
                roadName: row?.roadNameEn,
                roadNameMr: row?.roadNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("roadNameApiCallError", error);
        });
    } else {
      if (
        watch("addressUniqueId") != null &&
        watch("addressUniqueId") != undefined
      ) {
        let url = `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getRoads`;

        let body = {
          zoneWardAreaMapping: watch("addressUniqueId"),
        };

        axios
          .post(url, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (
              r?.status == 200 ||
              res?.status == 201 ||
              res?.status == "SUCCESS"
            ) {
              // roadNames
              setRoadNames(
                r?.data?.map((row) => ({
                  id: row?.roadId,
                  roadName: row?.roadName,
                  roadNameMr: row?.roadNameMr,
                }))
              );
            }
          })
          .catch((error) => {
            callCatchMethod(error, language);
            console.log("landmarkApiCallError", error);
          });
      }
    }
  };

  // pinCodes
  const getPinCodes = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setPinCodes(
            r.data.pinCode.map((row) => ({
              id: row.id,
              pincode: row.pinCode,
              pincodeMr: row.pinCodeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("pincodeApiCallError", error);
      });
  };

  // hawkingDurationDailys
  const getHawkingDurationDaily = () => {
    axios
      .get(`${urls.HMSURL}/hawkingDurationDaily/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setHawkingDurationDaily(
            r.data.hawkingDurationDaily.map((row) => ({
              id: row.id,
              hawkingDurationDaily:
                moment(row.hawkingDurationDailyFrom, "HH:mm:ss").format(
                  "hh:mm A"
                ) +
                " To " +
                moment(row.hawkingDurationDailyTo, "HH:mm:ss").format(
                  "hh:mm A"
                ),
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("hawkingDurationCallError", error);
      });
  };

  // hawkerTypes
  const getHawkerType = () => {
    axios
      .get(`${urls.HMSURL}/hawkerType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setHawkerType(
            r.data.hawkerType.map((row) => ({
              id: row.id,
              hawkerType: row.hawkerType,
              hawkerTypeMr: row.hawkerTypeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("hawkerTypeApiCallError", error);
      });
  };

  // items
  const getItems = () => {
    axios
      .get(`${urls.HMSURL}/item/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setItems(
            r.data.item.map((row) => ({
              id: row.id,
              item: row.item,
              itemMr: row.itemMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("zoneNameApiCallError", error);
      });
  };

  // banks
  const getBankMasters = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setBankMasters(
            r.data.bank.map((row) => ({
              id: row.id,
              bankMaster: row.bankName,
              bankMasterMr: row.bankNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("bankApiCallError", error);
      });
  };

  // hawkingZoneName
  const getHawkingZoneName = () => {
    axios
      .get(`${urls.HMSURL}/hawingZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setHawkingZoneName(
            r.data.hawkingZone.map((row) => ({
              id: row.id,
              hawkingZoneName: row.hawkingZoneName,
              hawkingZoneNameMr: row.hawkingZoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("hawkingZoneApiCallError", error);
      });
  };

  // getStreetvendorName
  const getStreetVendorModeName = () => {
    axios
      .get(`${urls.HMSURL}/hawkerMode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setStreetvendorModeNames(
            r.data.hawkerMode.map((row) => ({
              id: row.id,
              streetvendorModeName: row.hawkerMode,
              streetvendorModeNameMr: row.hawkerModeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("streetVendorZoneApiCallError", error);
      });
  };

  // getEducations
  const getEducations = () => {
    axios
      .get(`${urls.HMSURL}/educationCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setEducations(
            r.data.educationCategory.map((row) => ({
              id: row.id,
              education: row.educationCategory,
              educationMr: row.educationCategoryMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("educationApiCallError", error);
      });
  };

  //!   ===============================> useEffect  <=============================>

  useEffect(() => {
    // setValue("loadderState", false);
    // loadderSetTimeOutFunction();
    getZoneName();
    getPinCodes();
    getHawkingDurationDaily();
    getHawkerType();
    getItems();
    getBankMasters();
    getHawkingZoneName();
    getStreetVendorModeName();
    getEducations();
  }, []);

  // get ward
  useEffect(() => {
    getWards();
  }, [watch("zoneKey")]);

  // get Area
  useEffect(() => {
    getAreaName();
  }, [watch("wardName")]);

  // get Landmark and village Names
  useEffect(() => {
    // getLandmarkAndVillageNames();
    const addressUniqueId = areaNames?.find(
      (data) => data?.id == watch("areaName")
    )?.uniqueId;
    setValue("addressUniqueId", addressUniqueId);
  }, [watch("areaName"), areaNames]);

  useEffect(() => {
    getLandmark();
    getRoadname();
  }, [watch("addressUniqueId")]);

  useEffect(() => {
    console.log("12chaDAta", watch("oldLicenseYN"));

    if (
      watch("oldLicenseYN") != null &&
      watch("oldLicenseYN") != undefined &&
      watch("oldLicenseYN") != ""
    ) {
      if (watch("oldLicenseYN") == "true") {
        setValue("oldLicenseYNA", true);
        localStorage.setItem("oldLicenseYNA", true);
      } else {
        setValue("oldLicenseYNA", false);
        localStorage.setItem("oldLicenseYNA", false);
        setValue("oldLicenseNo", "");
        setValue("oldLicenseDate", null);
        clearErrors("oldLicenseNo");
        clearErrors("oldLicenseDate");
      }
    }
  }, [watch("oldLicenseYN")]);

  useEffect(() => {
    console.log("12chaDAta", watch("voterNameYN"));

    if (
      watch("voterNameYN") != null &&
      watch("voterNameYN") != undefined &&
      watch("voterNameYN") != ""
    ) {
      if (watch("voterNameYN") == "true") {
        setValue("voterNameYNA", true);
        localStorage.setItem("voterNameYNA", true);
      } else {
        setValue("voterNameYNA", false);
        localStorage.setItem("voterNameYNA", false);
        setValue("voterId", "");
        clearErrors("voterId");
      }
    }
  }, [watch("voterNameYN")]);

  // View
  return (
    <>
      {/** Header */}
      <>
        <div className={HawkerReusableCSS.MainHeader}>
          {<FormattedLabel id="additionalDetails" />}
        </div>
        {/** content */}
        <Grid container className={HawkerReusableCSS.GridContainer}>
          {/** city survey number */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              label={<FormattedLabel id="citySurveyNo" required />}
              disabled={watch("disabledFieldInputState")}
              {...register("citySurveyNo")}
              error={!!errors?.citySurveyNo}
              helperText={
                errors?.citySurveyNo ? errors?.citySurveyNo?.message : null
              }
            />
          </Grid>

          {/** zone Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.zoneKey}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("zoneKey") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="zoneName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => {
                      setValue("wardName", null);
                      setValue("areaName", null);
                      setValue("villageName", null);
                      setValue("landmarkName", null);
                      setValue("addressUniqueId", null);
                      return field?.onChange(value);
                    }}
                    label=<FormattedLabel id="zoneName" required />
                  >
                    {zoneNames &&
                      zoneNames?.map((zoneName) => (
                        <MenuItem key={zoneName?.id} value={zoneName?.id}>
                          {language == "en"
                            ? zoneName?.zoneName
                            : zoneName?.zoneNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="zoneKey"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.zoneKey ? errors?.zoneKey?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** ward Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors?.wardName}
            >
              <InputLabel
                shrink={watch("wardName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="wardName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("zoneKey") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => {
                      setValue("areaName", null);
                      setValue("villageName", null);
                      setValue("landmarkName", null);
                      setValue("addressUniqueId", null);

                      return field?.onChange(value);
                    }}
                    label={<FormattedLabel id="wardName" required />}
                  >
                    {wards &&
                      wards?.map((wardName) => (
                        <MenuItem key={wardName?.id} value={wardName?.id}>
                          {language == "en"
                            ? wardName?.wardName
                            : wardName?.wardNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="wardName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.wardName ? errors?.wardName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** area name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.areaName}>
              <InputLabel
                shrink={watch("areaName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="areaName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("wardName") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => {
                      setValue("villageName", null);
                      setValue("addressUniqueId", null);
                      setValue("landmarkName", null);
                      return field?.onChange(value);
                    }}
                    label={<FormattedLabel id="areaName" required />}
                  >
                    {areaNames &&
                      areaNames?.map((areaName) => (
                        <MenuItem key={areaName?.id} value={areaName?.id}>
                          {language == "en"
                            ? areaName?.areaName
                            : areaName?.areaNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="areaName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.areaName ? errors?.areaName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** Road Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.villageName}>
              <InputLabel
                shrink={watch("villageName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="roadName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("areaName") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="roadName" required />}
                  >
                    {roadNames &&
                      roadNames?.map((roadName) => (
                        <MenuItem key={roadName?.id} value={roadName?.id}>
                          {language == "en"
                            ? roadName?.roadName
                            : roadName?.roadNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="villageName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.villageName ? errors?.villageName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** landmark Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.landmarkName}>
              <InputLabel
                shrink={watch("landmarkName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="landmarkName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("areaName") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="landmarkName" required />}
                  >
                    {landmarkNames &&
                      landmarkNames?.map((landmarkName) => (
                        <MenuItem
                          key={landmarkName?.id}
                          value={landmarkName?.id}
                        >
                          {language == "en"
                            ? landmarkName?.landmarkName
                            : landmarkName?.landmarkNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="landmarkName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.landmarkName ? errors?.landmarkName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** City Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              id="standard-basic"
              // disabled
              disabled={watch("disabledFieldInputState")}
              defaultValue={
                language == "en" ? "Pimpri Chinchwad" : "पिंपरी चिंचवड"
              }
              label={<FormattedLabel id="cityName" required />}
              {...register("cityName")}
              error={!!errors?.cityName}
              helperText={errors?.cityName ? errors?.cityName?.message : null}
            />
          </Grid>
          {/** State Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              id="standard-basic"
              // disabled
              disabled={watch("disabledFieldInputState")}
              defaultValue={language == "en" ? "Maharashtra" : "महाराष्ट्र"}
              label={<FormattedLabel id="state" required />}
              {...register("state")}
              error={!!errors?.state}
              helperText={errors?.state ? errors?.state?.message : null}
            />
          </Grid>
          {/** pin code  */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.pincode}>
              <InputLabel
                shrink={watch("pincode") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="pinCode" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="pinCode" required />}
                  >
                    {pincodes &&
                      pincodes?.map((pincode) => (
                        <MenuItem key={pincode?.id} value={pincode?.id}>
                          {language == "en"
                            ? pincode?.pincode
                            : pincode?.pincodeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="pincode"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.pincode ? errors?.pincode?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** Hawking Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.hawkingZoneName}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("hawkingZoneName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="hawkingZoneName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="hawkingZoneName" required />}
                  >
                    {hawkingZoneNames &&
                      hawkingZoneNames?.map((hawkingZoneName) => (
                        <MenuItem
                          key={hawkingZoneName?.id}
                          value={hawkingZoneName?.id}
                        >
                          {language == "en"
                            ? hawkingZoneName?.hawkingZoneName
                            : hawkingZoneName?.hawkingZoneNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="hawkingZoneName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.hawkingZoneName
                  ? errors?.hawkingZoneName?.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** hawker type / streetvendor type */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              disabled={watch("disabledFieldInputState")}
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors?.hawkerType}
            >
              <InputLabel
                shrink={watch("hawkerType") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="hawkerType1" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="hawkerType" required />}
                  >
                    {hawkerTypes &&
                      hawkerTypes?.map((hawkerType) => (
                        <MenuItem key={hawkerType?.id} value={hawkerType?.id}>
                          {language == "en"
                            ? hawkerType?.hawkerType
                            : hawkerType?.hawkerTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="hawkerType"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.hawkerType ? errors?.hawkerType?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** nature of Business */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="natureOfBusiness" required />}
              variant="standard"
              {...register("natureOfBusiness")}
              error={!!errors?.natureOfBusiness}
              helperText={
                errors?.natureOfBusiness
                  ? errors?.natureOfBusiness?.message
                  : null
              }
            />
          </Grid>
          {/** hawking Duration Daily */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              disabled={watch("disabledFieldInputState")}
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors?.hawkingDurationDaily}
            >
              <InputLabel
                shrink={watch("hawkingDurationDaily") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="hawkingDurationDaily" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={
                      <FormattedLabel id="hawkingDurationDaily" required />
                    }
                  >
                    {hawkingDurationDailys &&
                      hawkingDurationDailys?.map((hawkingDurationDaily) => (
                        <MenuItem
                          key={hawkingDurationDaily?.id}
                          value={hawkingDurationDaily?.id}
                        >
                          {hawkingDurationDaily?.hawkingDurationDaily}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="hawkingDurationDaily"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.hawkingDurationDaily
                  ? errors?.hawkingDurationDaily?.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** hawker mode */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.hawkerMode}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("hawkerMode") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="streetvendorModeName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={
                      <FormattedLabel id="streetvendorModeName" required />
                    }
                  >
                    {streetvendorModeNames &&
                      streetvendorModeNames?.map((streetvendorModeName) => (
                        <MenuItem
                          key={streetvendorModeName?.id}
                          value={streetvendorModeName?.id}
                        >
                          {language == "en"
                            ? streetvendorModeName?.streetvendorModeName
                            : streetvendorModeName?.streetvendorModeNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="hawkerMode"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.hawkerMode ? errors?.hawkerMode?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** itme */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors?.item}
            >
              <InputLabel
                shrink={watch("item") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="item" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="item" required />}
                  >
                    {items &&
                      items?.map((item) => (
                        <MenuItem key={item?.id} value={item?.id}>
                          {language == "en" ? item?.item : item?.itemMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="item"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.item ? errors?.item?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/** old Licence yes/no */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            sx={{ marginTop: 2 }}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl flexDirection="row">
              <FormLabel
                sx={{ width: "230px" }}
                id="demo-row-radio-buttons-group-label"
                error={!!errors.oldLicenseYN}
              >
                {<FormattedLabel id="oldLicenseYN" required />}
              </FormLabel>
              {/** old Licence yes/no */}
              <Controller
                name="oldLicenseYN"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <RadioGroup
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    selected={field?.value}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      error={!!errors?.oldLicenseYN}
                      value={true}
                      disabled={watch("disabledFieldInputState")}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="yes" />}
                    />
                    <FormControlLabel
                      error={!!errors?.oldLicenseYN}
                      value={false}
                      disabled={watch("disabledFieldInputState")}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="no" />}
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors?.oldLicenseYN}>
                {errors?.oldLicenseYN ? errors?.oldLicenseYN?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {watch("oldLicenseYN") == "true" && (
            <>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              >
                <TextField
                  disabled={watch("disabledFieldInputState")}
                  id="standard-basic"
                  label={<FormattedLabel id="oldLicenseNo" required />}
                  variant="standard"
                  {...register("oldLicenseNo")}
                  error={!!errors?.oldLicenseNo}
                  helperText={
                    errors?.oldLicenseNo ? errors?.oldLicenseNo?.message : null
                  }
                />
              </Grid>
              {/** old license Date */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              >
                <FormControl
                  sx={{ marginTop: 0 }}
                  error={!!errors?.oldLicenseDate}
                >
                  <Controller
                    control={control}
                    name="oldLicenseDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          maxDate={new Date()}
                          error={!!errors?.oldLicenseDate}
                          disabled={watch("disabledFieldInputState")}
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16, marginTop: 2 }}>
                              {<FormattedLabel id="oldLicenseDate" required />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              error={!!errors?.oldLicenseDate}
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
                    {errors?.oldLicenseDate
                      ? errors?.oldLicenseDate?.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </>
          )}

          {/** education */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.education}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("education") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="education" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="education" required />}
                  >
                    {educations &&
                      educations?.map((education, index) => (
                        <MenuItem key={index} value={education?.id}>
                          {language == "en"
                            ? education?.education
                            : education?.educationMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="education"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.education ? errors?.education?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** voter name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            sx={{ marginTop: 2 }}
            className={HawkerReusableCSS.GridItemCenter}
          >
            {/** voter name yes/no */}
            <FormControl flexDirection="row">
              <FormLabel
                sx={{ width: "230px" }}
                id="demo-row-radio-buttons-group-label"
                error={!!errors.voterNameYN}
              >
                {<FormattedLabel id="voterNameYN" required />}
              </FormLabel>

              <Controller
                name="voterNameYN"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <RadioGroup
                    disabled={watch("disabledFieldInputState")}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    selected={field.value}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      error={!!errors?.voterNameYN}
                      value={true}
                      disabled={watch("disabledFieldInputState")}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="yes" />}
                    />
                    <FormControlLabel
                      error={!!errors?.voterNameYN}
                      value={false}
                      disabled={watch("disabledFieldInputState")}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="no" />}
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors?.voterNameYN}>
                {errors?.voterNameYN ? errors?.voterNameYN?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {watch("voterNameYN") == "true" && (
            <>
              {/** voter id */}
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              >
                <TextField
                  disabled={watch("disabledFieldInputState")}
                  id="standard-basic"
                  label={<FormattedLabel id="voterId" required />}
                  variant="standard"
                  {...register("voterId")}
                  error={!!errors?.voterId}
                  helperText={errors?.voterId ? errors?.voterId?.message : null}
                />
              </Grid>
            </>
          )}

          {/** period of residense in Mh */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              defaultValue={""}
              label=<FormattedLabel
                id="periodOfResidenceInMaharashtra"
                required
              />
              variant="standard"
              {...register("periodOfResidenceInMaharashtraMonth")}
              error={!!errors?.periodOfResidenceInMaharashtraMonth}
              helperText={
                errors?.periodOfResidenceInMaharashtraMonth
                  ? errors?.periodOfResidenceInMaharashtraMonth?.message
                  : null
              }
            />
          </Grid>

          {/** period of residense in pcmc */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={
                watch("periodOfResidenceInMaharashtraMonth") == ""
                  ? true
                  : watch("disabledFieldInputState")
              }
              id="standard-basic"
              label=<FormattedLabel id="periodOfResidenceInPcmc" required />
              variant="standard"
              {...register("periodOfResidenceInPCMCMonth")}
              error={!!errors?.periodOfResidenceInPCMCMonth}
              helperText={
                errors?.periodOfResidenceInPCMCMonth
                  ? errors?.periodOfResidenceInPCMCMonth?.message
                  : null
              }
            />
          </Grid>

          {/** lattitude */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="lattitude" />}
              {...register("hawkerLattitude")}
              error={!!errors?.hawkerLattitude}
              helperText={
                errors?.hawkerLattitude
                  ? errors?.hawkerLattitude?.message
                  : null
              }
            />
          </Grid>
          {/** logitude */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="logitude" />}
              {...register("hawkerDetailsLogitude")}
              error={!!errors?.hawkerDetailsLogitude}
              helperText={
                errors?.hawkerDetailsLogitude
                  ? errors?.hawkerDetailsLogitude?.message
                  : null
              }
            />
          </Grid>

          {/** view map button */}
          {watch("disabledFieldInputState") ? (
            <>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={HawkerReusableCSS.GridItemCenter}
              ></Grid>
            </>
          ) : (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              className={HawkerReusableCSS.GridItemCenter}
            >
              <Button
                className={HawkerReusableCSS.viewMapLocationButton}
                variant="contained"
                color="primary"
                onClick={() => {
                  handleDrawerOpen();
                }}
              >
                <FormattedLabel id="viewLocationOnMap" />
              </Button>
            </Grid>
          )}

          {/** additonal for responsive */}

          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            sx={{ marginTop: 4 }}
            className={HawkerReusableCSS.GridItemCenter}
          ></Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            sx={{ marginTop: 4 }}
            className={HawkerReusableCSS.GridItemCenter}
          ></Grid>

          {watch("voterNameYN") == "true" &&
            watch("oldLicenseYN") == "true" && (
              <>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  sx={{ marginTop: 4 }}
                  className={HawkerReusableCSS.GridItemCenter}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  sx={{ marginTop: 4 }}
                  className={HawkerReusableCSS.GridItemCenter}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  sx={{ marginTop: 4 }}
                  className={HawkerReusableCSS.GridItemCenter}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  sx={{ marginTop: 4 }}
                  className={HawkerReusableCSS.GridItemCenter}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  sx={{ marginTop: 4 }}
                  className={HawkerReusableCSS.GridItemCenter}
                ></Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  xl={3}
                  sx={{ marginTop: 4 }}
                  className={HawkerReusableCSS.GridItemCenter}
                ></Grid>
              </>
            )}
        </Grid>

        {/** New Grid */}
        {/** Bank Details Header */}
        <div
          className={`${HawkerReusableCSS.MainHeader} ${HawkerReusableCSS.BankDetailsDiv}`}
        >
          {<FormattedLabel id="bankDetails" />}
        </div>
        <Grid container className={HawkerReusableCSS.GridContainer}>
          {/** bank Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl
              disabled={watch("disabledFieldInputState")}
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors?.bankMaster}
            >
              <InputLabel
                shrink={watch("bankMaster") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="bankName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="bankName" required />}
                  >
                    {bankMasters &&
                      bankMasters?.map((bankMaster, index) => (
                        <MenuItem key={index} value={bankMaster?.id}>
                          {language == "en"
                            ? bankMaster?.bankMaster
                            : bankMaster?.bankMasterMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="bankMaster"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.bankMaster ? errors?.bankMaster?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/** branch Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="branchName" required />}
              variant="standard"
              {...register("branchName")}
              error={!!errors?.branchName}
              helperText={
                errors?.branchName ? errors?.branchName?.message : null
              }
            />
          </Grid>
          {/** account number */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              inputProps={{ maxLength: 18 }}
              label={<FormattedLabel id="bankAccountNo" required />}
              variant="standard"
              {...register("bankAccountNo")}
              error={!!errors?.bankAccountNo}
              helperText={
                errors?.bankAccountNo ? errors?.bankAccountNo?.message : null
              }
            />
          </Grid>
          {/** isfc code no */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              inputProps={{ maxLength: 11 }}
              label={<FormattedLabel id="ifscCode" required />}
              variant="standard"
              {...register("ifscCode")}
              error={!!errors?.ifscCode}
              helperText={errors?.ifscCode ? errors?.ifscCode?.message : null}
            />
          </Grid>
          {/* only for responsive */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          ></Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          ></Grid>
        </Grid>

        {/** Drawer  */}
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <Box
            style={{
              left: 0,
              position: "absolute",
              top: "50%",
              backgroundColor: "#bdbdbd",
            }}
          >
            <IconButton
              color="primary"
              aria-label="open drawer"
              // edge="end"
              onClick={() => handleDrawerClose()}
              sx={{ width: "30px", height: "75px", borderRadius: 0 }}
            >
              <ArrowRightIcon />
            </IconButton>
          </Box>
          <img
            src="/ABC.jpg"
            width="800px"
            alt="Map Not Found"
            style={{ width: "100%", height: "100%" }}
          />
        </Drawer>
        {/** End Drawer  */}
      </>
    </>
  );
};

export default AdditionalDetails;
