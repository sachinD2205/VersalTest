import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import HawkerReusableCSS from "../styles/hawkerReusableForAllComponents.module.css";
import styles from "../styles/view.module.css";
import { catchExceptionHandlingMethod } from "../../../util/util";

let drawerWidth;

/** Authore - Sachin Durge */
// AddressOfHawker
const AddressOfHawker = () => {
  const {
    control,
    register,
    setValue,
    getValues,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [addressShrink, setAddressShrink] = useState();
  const [zoneNamesCr, setZoneNamesCr] = useState([]);
  const [zoneNamesPr, setZoneNamesPr] = useState([]);
  const [wardsCr, setWardsCr] = useState([]);
  const [wardsPr, setWardsPr] = useState([]);
  const [areaNamesCr, setAreaNameCr] = useState([]);
  const [areaNamesPr, setAreaNamePr] = useState([]);
  const [landmarkNamesCr, setLandmarkNamesCr] = useState([]);
  const [landmarkNamesPr, setLandmarkNamesPr] = useState([]);
  const [roadNamesCr, setRoadNamesCr] = useState([]);
  const [roadNamesPr, setRoadNamesPr] = useState([]);
  const [pincodesCr, setPinCodesCr] = useState([]);
  const [pincodesPr, setPinCodesPr] = useState([]);
  const [open, setOpen] = useState(false);
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "50%";
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
  const getZoneNameCr = () => {
    const url = `${urls.CFCURL}/master/zone/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setZoneNamesCr(
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
        console.log("zoneKeyApiError", error);
      });
  };

  // zones
  const getZoneNamePr = () => {
    const url = `${urls.CFCURL}/master/zone/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setZoneNamesPr(
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
        console.log("zoneKeyApiError", error);
      });
  };

  // getWardsCr
  const getWardsCr = () => {
    if (watch("crZoneKey") != null) {
      let url = `${urls.CFCURL
        }/master/zoneWardAreaMapping/getWardByZoneAndModuleId?zoneId=${watch(
          "crZoneKey"
        )}&moduleId=4`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setWardsCr(
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
          console.log("wardApiError", error);
        });
    }
  };

  // getWardsPr
  const getWardsPr = () => {
    if (watch("prZoneKey") != null) {
      let url = `${urls.CFCURL
        }/master/zoneWardAreaMapping/getWardByZoneAndModuleId?zoneId=${watch(
          "prZoneKey"
        )}&moduleId=4`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setWardsPr(
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
          console.log("zoneApiError", error);
        });
    }
  };

  // getAreaNameCr
  const getAreaNameCr = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      axios
        .get(`${urls.CFCURL}/master/area/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setAreaNameCr(
              r?.data?.area?.map((row) => ({
                id: row?.id,
                areaName: row?.areaName,
                areaNameMr: row?.areaNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("areaNameApiCall", error);
        });
    } else {
      if (watch("crWardName") != null) {
        let url = `${urls.CFCURL
          }/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId?zoneId=${watch(
            "crZoneKey"
          )}&wardId=${watch("crWardName")}&moduleId=4`;

        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (r?.status == 200 || r?.status == 201) {
              setAreaNameCr(
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

  // getAreaNamePr
  const getAreaNamePr = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      console.log("deptEdit");
      axios
        .get(`${urls.CFCURL}/master/area/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setAreaNamePr(
              r?.data?.area?.map((row) => ({
                id: row?.id,
                areaName: row?.areaName,
                areaNameMr: row?.areaNameMr,
                // uniqueId: row?.uniqueId,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("areaNameApiCall", error);
        });

      // api Callls
      // getLandmarkAndVillageNamesPr();
      // getLandmarkAndVillageNamesCr();
    } else {
      if (watch("prWardName") != null) {
        let url = `${urls.CFCURL
          }/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId?zoneId=${watch(
            "prZoneKey"
          )}&wardId=${watch("crWardName")}&moduleId=4`;

        axios
          .get(url, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (r?.status == 200 || r?.status == 201) {
              setAreaNamePr(
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
            console.log("areaNameApiError", error);
          });
      }
    }
  };

  const getRoadnameCr = () => {
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
          if (r?.status == 200 || r?.status == 201) {
            setRoadNamesCr(
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
        watch("addressUniqueIdCR") != null &&
        watch("addressUniqueIdCR") != undefined
      ) {
        let url = `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getRoads`;

        let body = {
          zoneWardAreaMapping: watch("addressUniqueIdCR"),
        };

        axios
          .post(url, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (r?.status == 200 || r?.status == 201) {
              console.log("roadName,landmarkName", r?.data);
              setRoadNamesCr(
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
            console.log("landmarkApiError", error);
          });
      }
    }
  };

  const getLandmarkCr = () => {
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
          if (r?.status == 200 || r?.status == 201) {
            setLandmarkNamesCr(
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
          console.log("landmarkApiError", error);
        });


    } else {
      if (
        watch("addressUniqueIdCR") != null &&
        watch("addressUniqueIdCR") != undefined
      ) {
        let url = `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getLandmarks`;

        let body = {
          zoneWardAreaMapping: watch("addressUniqueIdCR"),
        };

        axios
          .post(url, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (r?.status == 200 || r?.status == 201) {
              console.log("roadNamesdflandmarkName", r?.data);

              //  landmarkNames
              setLandmarkNamesCr(
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
            console.log("landmarkApiError", error);
          });
      }
    }
  };

  const getLandmarkPr = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      // landMark
      axios
        .get(`${urls.CFCURL}/master/locality/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setLandmarkNamesPr(
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
          console.log("landmarkApiError", error);
        });
    } else {
      if (
        watch("addressUniqueIdPr") != null &&
        watch("addressUniqueIdPr") != undefined
      ) {
        let url = `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getLandmarks`;

        let body = {
          zoneWardAreaMapping: watch("addressUniqueIdPr"),
        };

        axios
          .post(url, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (r?.status == 200 || r?.status == 201) {
              // landmarks
              setLandmarkNamesPr(
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
            console.log("landmarkApiError", error);
          });
      }
    }
  };

  const getRoadnamePr = () => {
    if (localStorage.getItem("DepartSideEditApplication") == "true") {
      // roadname
      axios
        .get(`${urls.CFCURL}/mstRoadName/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setRoadNamesPr(
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
          console.log("roadNameError", error);
        });

      console.log("deptEdit");
    } else {
      if (
        watch("addressUniqueIdPr") != null &&
        watch("addressUniqueIdPr") != undefined
      ) {
        let url = `${urls.HMSURL}/mstAreaZoneWardRoadLandMarkMapping/getRoads`;

        let body = {
          zoneWardAreaMapping: watch("addressUniqueIdPr"),
        };

        axios
          .post(url, body, {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          })
          .then((r) => {
            if (r?.status == 200 || r?.status == 201) {
              console.log("dsfs", r?.data);
              // roadNames
              setRoadNamesPr(
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
            console.log("landmarkApiError", error);
          });
      }
    }
  };

  // getPinCodesCr
  const getPinCodesCr = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setPinCodesCr(
            r?.data?.pinCode.map((row) => ({
              id: row.id,
              pincode: row?.pinCode,
              pincodeMr: row?.pinCodeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("pinCodeApiError", error);
      });
  };

  // getPinCodesPr
  const getPinCodesPr = () => {
    axios
      .get(`${urls.CFCURL}/master/pinCode/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setPinCodesPr(
            r?.data?.pinCode?.map((row) => ({
              id: row?.id,
              pincode: row?.pinCode,
              pincodeMr: row?.pinCodeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
        console.log("zoneKeyApiError", error);
      });
  };

  // Address Change
  const addressChange = (e) => {
    if (e.target.checked == true) {
      setValue("prCitySurveyNumber", watch("crCitySurveyNumber"));
      setValue("prZoneKey", watch("crZoneKey"));
      setValue("prWardName", watch("crWardName"));
      setValue("prAreaName", watch("crAreaName"));
      setValue("addressUniqueIdPr", watch("addressUniqueIdCR"));
      setValue("prLandmarkName", watch("crLandmarkName"));
      setValue("prVillageName", watch("crVillageName"));
      setValue("prPincode", watch("crPincode"));
      setValue("prLattitude", watch("crLattitude"));
      setValue("prLogitude", watch("crLogitude"));
      setValue("prCityName", watch("crCityName"));
      setValue("prState", watch("crState"));
      clearErrors("prCitySurveyNumber");
      clearErrors("prZoneKey");
      clearErrors("prWardName");
      clearErrors("prAreaName");
      clearErrors("prLandmarkName");
      clearErrors("prVillageName");
      clearErrors("prPincode");
      clearErrors("prLattitude");
      clearErrors("prLogitude");
      clearErrors("prCityName");
      clearErrors("prState");
      setAddressShrink(true);
    } else {
      setValue("prCitySurveyNumber", "");
      setValue("prZoneKey", null);
      setValue("prWardName", null);
      setValue("prAreaName", null);
      setValue("addressUniqueIdPr", null);
      setValue("prLandmarkName", null);
      setValue("prVillageName", null);
      setValue("prPincode", null);
      setValue("prLattitude", "");
      setValue("prLogitude", "");
      setValue("prCityName", "");
      setValue("prState", "");
      clearErrors("prCitySurveyNumber");
      clearErrors("crWardName");
      clearErrors("prWardName");
      clearErrors("prAreaName");
      clearErrors("prLandmarkName");
      clearErrors("prVillageName");
      clearErrors("prPincode");
      clearErrors("prLattitude");
      clearErrors("prLogitude");
      clearErrors("prCityName");
      clearErrors("prState");
      setAddressShrink(false);
      setAddressShrink();
    }
  };

  //!   =====================> useEffect  <==================

  // useEffect
  useEffect(() => {
    getZoneNameCr();
    getZoneNamePr();
    getPinCodesCr();
    getPinCodesPr();

    if (language == "en") {
      setValue("crState", "Maharashtra");
      setValue("crCityName", "Pimpri Chinchwad");
    } else {
      setValue("crState", "महाराष्ट्र");
      setValue("crCityName", "पिंपरी चिंचवड");
    }
  }, []);

  // get wardi
  useEffect(() => {
    getWardsCr();
  }, [watch("crZoneKey")]);

  // get ward
  useEffect(() => {
    getWardsPr();
  }, [watch("prZoneKey")]);

  // get Area
  useEffect(() => {
    getAreaNameCr();
  }, [watch("crWardName")]);

  // get Area
  useEffect(() => {
    getAreaNamePr();
  }, [watch("prWardName")]);

  // get Landmark and village Names
  useEffect(() => {
    // getLandmarkAndVillageNamesCr();
    const addressUniqueIdCR = areaNamesCr?.find(
      (data) => data?.id == watch("crAreaName")
    )?.uniqueId;

    setValue("addressUniqueIdCR", addressUniqueIdCR);
  }, [watch("crAreaName"), areaNamesCr]);

  useEffect(() => {
    getLandmarkCr();
    getRoadnameCr();
  }, [watch("addressUniqueIdCR")]);

  // get Landmark and village Names
  useEffect(() => {
    // getLandmarkAndVillageNamesPr();
    const addressUniqueIdPr = areaNamesPr?.find(
      (data) => data?.id == watch("prAreaName")
    )?.uniqueId;
    console.log("addressUniqueIdPr", addressUniqueIdPr);
    setValue("addressUniqueIdPr", addressUniqueIdPr);
  }, [watch("prAreaName"), areaNamesPr]);

  useEffect(() => {
    getLandmarkPr();
    getRoadnamePr();
  }, [watch("addressUniqueIdPr")]);

  useEffect(() => {
    setValue("addresDetail", watch("addressCheckBox"));
  }, [watch("addressCheckBox")]);

  // View
  return (
    <>
      {/** Main Component  */}
      {/** Header First */}
      <div className={HawkerReusableCSS.MainHeader}>
        {<FormattedLabel id="currentAddressofHawker" />}
      </div>
      {/** Current Address Container */}
      <div className={styles.flexMain}>
        <Grid container className={HawkerReusableCSS.GridContainer}>
          {/** city survey no */}
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
              autoFocus
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="citySurveyNumber" required />}
              {...register("crCitySurveyNumber")}
              error={!!errors?.crCitySurveyNumber}
              helperText={
                errors?.crCitySurveyNumber
                  ? errors?.crCitySurveyNumber?.message
                  : null
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
              error={!!errors?.crZoneKey}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("crZoneKey") == null ? false : true}
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
                      setValue("crWardName", null);
                      setValue("crAreaName", null);
                      setValue("crVillageName", null);
                      setValue("crLandmarkName", null);
                      setValue("addressUniqueIdCR", null);
                      return field?.onChange(value);
                    }}
                    label=<FormattedLabel id="zoneName" required />
                  >
                    {zoneNamesCr &&
                      zoneNamesCr?.map((zoneName) => (
                        <MenuItem key={zoneName?.id} value={zoneName?.id}>
                          {language == "en"
                            ? zoneName?.zoneName
                            : zoneName?.zoneNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crZoneKey"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.crZoneKey ? errors?.crZoneKey?.message : null}
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
              error={!!errors?.crWardName}
            >
              <InputLabel
                shrink={watch("crWardName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="wardName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("crZoneKey") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => {
                      setValue("crAreaName", null);
                      setValue("crVillageName", null);
                      setValue("crLandmarkName", null);
                      setValue("addressUniqueIdCR", null);
                      return field?.onChange(value);
                    }}
                    label={<FormattedLabel id="wardName" required />}
                  >
                    {wardsCr &&
                      wardsCr?.map((wardName, index) => (
                        <MenuItem key={index} value={wardName?.id}>
                          {language == "en"
                            ? wardName?.wardName
                            : wardName?.wardNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crWardName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.crWardName ? errors?.crWardName?.message : null}
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
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.crAreaName}>
              <InputLabel
                shrink={watch("crAreaName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="areaName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("crWardName") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => {
                      setValue("crAreaName", null);
                      setValue("crVillageName", null);
                      setValue("crLandmarkName", null);
                      setValue("addressUniqueIdCR", null);
                      return field?.onChange(value);
                    }}
                    label={<FormattedLabel id="areaName" required />}
                  >
                    {areaNamesCr &&
                      areaNamesCr?.map((areaName, index) => (
                        <MenuItem key={index} value={areaName?.id}>
                          {language == "en"
                            ? areaName?.areaName
                            : areaName?.areaNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crAreaName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.crAreaName ? errors?.crAreaName?.message : null}
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
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.crVillageName}>
              <InputLabel
                shrink={watch("crVillageName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="roadName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("crAreaName") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => {
                      return field?.onChange(value);
                    }}
                    label={<FormattedLabel id="roadName" required />}
                  >
                    {roadNamesCr &&
                      roadNamesCr?.map((roadName, index) => (
                        <MenuItem key={index} value={roadName?.id}>
                          {language == "en"
                            ? roadName?.roadName
                            : roadName?.roadNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crVillageName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.crVillageName ? errors?.crVillageName?.message : null}
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
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.crLandmarkName}>
              <InputLabel
                shrink={watch("crLandmarkName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="landmarkName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("crAreaName") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="landmarkName" required />}
                  >
                    {landmarkNamesCr &&
                      landmarkNamesCr?.map((landmarkName, index) => (
                        <MenuItem key={index} value={landmarkName?.id}>
                          {language == "en"
                            ? landmarkName?.landmarkName
                            : landmarkName?.landmarkNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crLandmarkName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.crLandmarkName
                  ? errors?.crLandmarkName?.message
                  : null}
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
              disabled={watch("disabledFieldInputState")}
              defaultValue={
                language == "en" ? "Pimpri Chinchwad" : "पिंपरी चिंचवड"
              }
              label={<FormattedLabel id="cityName" required />}
              {...register("crCityName")}
              error={!!errors?.crCityName}
              helperText={
                errors?.crCityName ? errors?.crCityName?.message : null
              }
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
              disabled={watch("disabledFieldInputState")}
              defaultValue={language == "en" ? "Maharashtra" : "महाराष्ट्र"}
              label={<FormattedLabel id="state" required />}
              {...register("crState")}
              error={!!errors?.crState}
              helperText={errors?.crState ? errors?.crState?.message : null}
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
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.crPincode}>
              <InputLabel
                shrink={watch("crPincode") == null ? false : true}
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
                    {pincodesCr &&
                      pincodesCr?.map((pincode, index) => (
                        <MenuItem key={index} value={pincode?.id}>
                          {language == "en"
                            ? pincode?.pincode
                            : pincode?.pincodeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="crPincode"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.crPincode ? errors?.crPincode?.message : null}
              </FormHelperText>
            </FormControl>
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
              defaultValue={null}
              label={<FormattedLabel id="lattitude" />}
              {...register("crLattitude")}
              error={!!errors?.crLattitude}
              helperText={
                errors?.crLattitude ? errors?.crLattitude?.message : null
              }
            />
          </Grid>
          {/** longitude */}
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
              {...register("crLogitude")}
              defaultValue={null}
              error={!!errors?.crLogitude}
              helperText={
                errors?.crLogitude ? errors?.crLogitude?.message : null
              }
            />
          </Grid>

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
            </>
          )}
        </Grid>
      </div>



      {/** Header Second*/}
      <div className={HawkerReusableCSS.MainHeader}>
        {<FormattedLabel id="permanentPostalAddressOfHawker" />}
      </div>

      <Grid container className={HawkerReusableCSS.GridContainer}>
        {/** Check Box */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={HawkerReusableCSS.GridItemCenter}
        >
          <FormControlLabel
            className={HawkerReusableCSS.addressCheckBoxButton}
            control={
              <Controller
                name="addressCheckBox"
                control={control}
                defaultValue={false}
                render={({ field: { value, ref, ...field } }) => (
                  <Checkbox
                    disabled={watch("disabledFieldInputState")}
                    {...field}
                    inputRef={ref}
                    checked={!!value}
                    onChange={(e) => {
                      console.log("EtargetChekced", e?.target?.checked);
                      setValue("addressCheckBox", e?.target?.checked);

                      clearErrors("addressCheckBox");
                      addressChange(e);
                    }}
                  />
                )}
              />
            }
            label=<span className={HawkerReusableCSS.addressCheckBoxButtonSpan}>
              {
                <FormattedLabel id="permanentAddressAsTheCorrespondenceAddress" />
              }
            </span>
            labelPlacement="end"
          />
        </Grid>
        {/** city Survey No */}
        {watch("addressCheckBox") == true ? (
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
              disabled
              // disabled={watch("disabledFieldInputState")}
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              label={<FormattedLabel id="citySurveyNumber" required />}
              {...register("prCitySurveyNumber")}
              error={!!errors?.prCitySurveyNumber}
              helperText={
                errors?.prCitySurveyNumber
                  ? errors?.prCitySurveyNumber?.message
                  : null
              }
            />
          </Grid>
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
            <TextField
              disabled={watch("disabledFieldInputState")}
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              label={<FormattedLabel id="citySurveyNumber" required />}
              {...register("prCitySurveyNumber")}
              error={!!errors?.prCitySurveyNumber}
              helperText={
                errors?.prCitySurveyNumber
                  ? errors?.prCitySurveyNumber?.message
                  : null
              }
            />
          </Grid>
        )}
        {/** zone Name */}

        {watch("addressCheckBox") == true ? (
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
              <FormControl
                variant="standard"
                error={!!errors?.prZoneKey}
                sx={{ marginTop: 2 }}
              >
                <InputLabel
                  shrink={watch("prZoneKey") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  {<FormattedLabel id="zoneName" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled
                      value={field?.value}
                      onChange={(value) => field?.onChange(value)}
                      label=<FormattedLabel id="zoneName" required />
                    >
                      {zoneNamesPr &&
                        zoneNamesPr?.map((zoneName) => (
                          <MenuItem key={zoneName?.id} value={zoneName?.id}>
                            {language == "en"
                              ? zoneName?.zoneName
                              : zoneName?.zoneNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="prZoneKey"
                  control={control}
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.prZoneKey ? errors?.prZoneKey?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </>
        ) : (
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
                InputLabelProps={{ shrink: addressShrink }}
                id="standard-basic"
                label={<FormattedLabel id="zoneName" required />}
                {...register("prZoneKeyT")}
                error={!!errors?.prZoneKeyT}
                helperText={
                  errors?.prZoneKeyT ? errors?.prZoneKeyT?.message : null
                }
              />
            </Grid>
          </>
        )}

        {/** ward Name */}

        {watch("addressCheckBox") == true ? (
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
              <FormControl
                variant="standard"
                sx={{ marginTop: 2 }}
                error={!!errors?.prWardName}
              >
                <InputLabel
                  shrink={watch("prWardName") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  {<FormattedLabel id="wardName" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled
                      value={field?.value}
                      onChange={(value) => field?.onChange(value)}
                      label={<FormattedLabel id="wardName" required />}
                    >
                      {wardsPr &&
                        wardsPr?.map((wardName) => (
                          <MenuItem key={wardName?.id} value={wardName?.id}>
                            {language == "en"
                              ? wardName?.wardName
                              : wardName?.wardNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="prWardName"
                  control={control}
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.prWardName ? errors?.prWardName?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </>
        ) : (
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
                InputLabelProps={{ shrink: addressShrink }}
                id="standard-basic"
                label={<FormattedLabel id="wardName" required />}
                {...register("prWardNameT")}
                error={!!errors?.prWardNameT}
                helperText={
                  errors?.prWardNameT ? errors?.prWardNameT?.message : null
                }
              />
            </Grid>
          </>
        )}

        {/** Area Name */}
        {watch("addressCheckBox") == true ? (
          <>
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
              <FormControl sx={{ marginTop: 2 }} error={!!errors?.prAreaName}>
                <InputLabel
                  shrink={watch("prAreaName") == null ? false : true}
                  id="demo-simple-select-standard-label"
                >
                  {<FormattedLabel id="areaName" required />}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled
                      value={field?.value}
                      onChange={(value) => field?.onChange(value)}
                      label={<FormattedLabel id="areaName" required />}
                    >
                      {areaNamesPr &&
                        areaNamesPr?.map((areaName) => (
                          <MenuItem key={areaName?.id} value={areaName?.id}>
                            {language == "en"
                              ? areaName?.areaName
                              : areaName?.areaNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="prAreaName"
                  control={control}
                  defaultValue={null}
                />
                <FormHelperText>
                  {errors?.prAreaName ? errors?.prAreaName?.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
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
            <TextField
              disabled={watch("disabledFieldInputState")}
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              label={<FormattedLabel id="areaName" required />}
              {...register("prAreaNameT")}
              error={!!errors?.prAreaNameT}
              helperText={
                errors?.prAreaNameT ? errors?.prAreaNameT?.message : null
              }
            />
          </Grid>
        )}

        {/** Road Name */}
        {watch("addressCheckBox") == true ? (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.prVillageName}>
              <InputLabel
                shrink={watch("prVillageName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="roadName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="roadName" required />}
                  >
                    {roadNamesPr &&
                      roadNamesPr?.map((roadName) => (
                        <MenuItem key={roadName?.id} value={roadName?.id}>
                          {language == "en"
                            ? roadName?.roadName
                            : roadName?.roadNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prVillageName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.prVillageName ? errors?.prVillageName?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        ) : (
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
                InputLabelProps={{ shrink: addressShrink }}
                id="standard-basic"
                label={<FormattedLabel id="roadName" required />}
                {...register("prVillageNameT")}
                error={!!errors?.prVillageNameT}
                helperText={
                  errors?.prVillageNameT
                    ? errors?.prVillageNameT?.message
                    : null
                }
              />
            </Grid>
          </>
        )}

        {/** Landmark Name */}
        {watch("addressCheckBox") == true ? (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.prLandmarkName}>
              <InputLabel
                shrink={watch("prLandmarkName") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="landmarkName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="landmarkName" required />}
                  >
                    {landmarkNamesPr &&
                      landmarkNamesPr?.map((landmarkName, index) => (
                        <MenuItem key={index} value={landmarkName?.id}>
                          {language == "en"
                            ? landmarkName?.landmarkName
                            : landmarkName?.landmarkNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prLandmarkName"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.prLandmarkName
                  ? errors?.prLandmarkName?.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
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
            <TextField
              disabled={watch("disabledFieldInputState")}
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              label={<FormattedLabel id="landmarkName" required />}
              {...register("prLandmarkNameT")}
              error={!!errors?.prLandmarkNameT}
              helperText={
                errors?.prLandmarkNameT
                  ? errors?.prLandmarkNameT?.message
                  : null
              }
            />
          </Grid>
        )}

        {/** city Name */}
        {watch("addressCheckBox") == true ? (
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
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              disabled
              // disabled={watch("disabledFieldInputState")}
              defaultValue={""}
              label={<FormattedLabel id="cityName" required />}
              {...register("prCityName")}
              error={!!errors?.prCityName}
              helperText={
                errors?.prCityName ? errors?.prCityName?.message : null
              }
            />
          </Grid>
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
            <TextField
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              disabled={watch("disabledFieldInputState")}
              defaultValue={""}
              label={<FormattedLabel id="cityName" required />}
              {...register("prCityName")}
              error={!!errors?.prCityName}
              helperText={
                errors?.prCityName ? errors?.prCityName?.message : null
              }
            />
          </Grid>
        )}
        {/** State */}
        {watch("addressCheckBox") == true ? (
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
              disabled
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              // disabled={watch("disabledFieldInputState")}
              defaultValue={""}
              label={<FormattedLabel id="state" required />}
              {...register("prState")}
              error={!!errors?.prState}
              helperText={errors?.prState ? errors?.prState?.message : null}
            />
          </Grid>
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
            <TextField
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              disabled={watch("disabledFieldInputState")}
              defaultValue={""}
              label={<FormattedLabel id="state" required />}
              {...register("prState")}
              error={!!errors?.prState}
              helperText={errors?.prState ? errors?.prState?.message : null}
            />
          </Grid>
        )}

        {/** pin code */}
        {watch("addressCheckBox") == true ? (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.prPincode}>
              <InputLabel
                shrink={watch("prPincode") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="pinCode" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled
                    // disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="pinCode" required />}
                  >
                    {pincodesPr &&
                      pincodesPr?.map((pincode, index) => (
                        <MenuItem key={index} value={pincode?.id}>
                          {language == "en"
                            ? pincode?.pincode
                            : pincode?.pincodeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="prPincode"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.prPincode ? errors?.prPincode?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
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
            <TextField
              disabled={watch("disabledFieldInputState")}
              InputLabelProps={{ shrink: addressShrink }}
              id="standard-basic"
              inputProps={{ maxLength: 6 }}
              label={<FormattedLabel id="pinCode" required />}
              {...register("prPincodeT")}
              error={!!errors?.prPincodeT}
              helperText={
                errors?.prPincodeT ? errors?.prPincodeT?.message : null
              }
            />
          </Grid>
        )}
        {/** lattitude */}
        {watch("addressCheckBox") == true ? (
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
              disabled
              // disabled={watch("disabledFieldInputState")}
              InputLabelProps={{
                shrink:
                  watch("prLattitude") != null &&
                    watch("prLattitude") != undefined &&
                    watch("prLattitude") != ""
                    ? true
                    : false,
              }}
              id="standard-basic"
              label={<FormattedLabel id="lattitude" />}
              {...register("prLattitude")}
              error={!!errors?.prLattitude}
              helperText={
                errors?.prLattitude ? errors?.prLattitude?.message : null
              }
            />
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          ></Grid>
        )}
        {/** logitude */}
        {watch("addressCheckBox") == true ? (
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
              disabled
              // disabled={watch("disabledFieldInputState")}
              InputLabelProps={{
                shrink:
                  watch("prLogitude") != null &&
                    watch("prLogitude") != undefined &&
                    watch("prLogitude") != ""
                    ? true
                    : false,
              }}
              id="standard-basic"
              label={<FormattedLabel id="logitude" />}
              {...register("prLogitude")}
              error={!!errors?.prLogitude}
              helperText={
                errors?.prLogitude ? errors?.prLogitude?.message : null
              }
            />
          </Grid>
        ) : (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={HawkerReusableCSS.GridItemCenter}
          ></Grid>
        )}
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
  );
};

export default AddressOfHawker;
