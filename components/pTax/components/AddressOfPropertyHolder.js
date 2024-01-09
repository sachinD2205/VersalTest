/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../URLS/urls";
import { useGetToken, useLanguage, useGetLoggedInUserDetails, useApplicantType } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import styles from "../../../components/pTax/styles/AddressOfPropertyHolder.module.css"
import { Box, Button, Checkbox, Drawer, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, Slide, Stack, TextField, TextareaAutosize } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import Translation from "../../streetVendorManagementSystem/components/Translation";
import { DataGrid, GridToolbar, DeleteIcon } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import { useSelector } from "react-redux";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";


/** Author - Sachin Durge */
// AddressOfPropertyHolder -
const AddressOfPropertyHolder = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useLanguage();
  const userToken = useGetToken();
  const applicantType = useApplicantType();
  const isDeptUser = useSelector(
    (state) => state?.user?.user?.userDao?.deptUser
  );
  const loggedInUserDetails = useGetLoggedInUserDetails();
  const userID = useSelector(
    (state) => state?.user?.user?.id
  );
  const [open, setOpen] = useState(false);
  let drawerWidth;
  const [circleNames, setCircleNames] = useState([]);
  const [gatNames, setGatNames] = useState([
    //   {
    //   id: 1,
    //   gatNameEng: "Gat 1",
    //   gatNameMr: "गट १",
    // }, {
    //   id: 2,
    //   gatNameEng: "Gat 2",
    //   gatNameMr: "गट २",
    // }
  ]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [landMarkNames, setLandMarkNames] = useState([])
  const [villageNames, setVillageNames] = useState([])
  const [pinCodes, setPinCodes] = useState([]);
  const [cityNames, setCityNames] = useState([{
    id: 1,
    cityNameEng: "Pimpri",
    cityNameMr: "पिंपरी",
  }, {
    id: 2,
    cityNameEng: "Chinchwad",
    cityNameMr: "चिंचवड",
  }])

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


  const getCircleNames = () => {
    const url = `${urls.PTAXURL}/master/circle/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          console.log("circleNa32432", r?.data)
          setCircleNames(
            r?.data?.circle?.map((row) => ({
              id: row?.id,
              circleNameEng: row?.circleName,
              circleNameMr: row?.circleNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getGatNames = (id) => {
    const url = `${urls.PTAXURL}/master/circle/getByCircleId?id=${id}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          console.log("circleNames32432432", r?.data);
          setGatNames(
            r?.data?.gatDao?.map((row) => ({
              id: row?.id,
              gatNameEng: row?.gatName,
              gatNameMr: row?.gatName,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };



  const getZoneNames = () => {
    const url = `${urls.CFCURL}/master/zone/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setZoneNames(
            r?.data?.zone?.map((row) => ({
              id: row?.id,
              zoneNameEng: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };



  const getWardNames = () => {
    const url = `${urls.CFCURL}/master/ward/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setWardNames(
            r?.data?.ward?.map((row) => ({
              id: row?.id,
              wardNameEng: row?.wardName,
              wardNameMr: row?.wardNameMr,
            }))
          );
        }
      }).catch((error) => {
        callCatchMethod(error, language);
      });
  }



  const getAreaNames = () => {
    const url = `${urls.CFCURL}/master/area/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setAreaNames(
            r?.data?.area?.map((row) => ({
              id: row?.id,
              areaNameEng: row?.areaName,
              areaNameMr: row?.areaNameMr,
            }))
          );
        }
      }).catch((error) => {
        callCatchMethod(error, language);
      });
  }



  const getPinCodes = () => {
    const url = `${urls.CFCURL}/master/pinCode/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setPinCodes(
            r?.data?.pinCode.map((row) => ({
              id: row?.id,
              pincodeEng: row?.pinCode,
              pincodeMr: row?.pinCodeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };


  const getLandMarkNames = () => {
    const url = `${urls.CFCURL}/master/locality/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setLandMarkNames(
            r?.data?.locality?.map((row) => ({
              id: row?.id,
              landmarkNameEng: row?.landmarkEng,
              landmarkNameMr: row?.landmarkMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }


  const getVillageNames = () => {
    const url = `${urls.CFCURL}/master/village/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setVillageNames(
            r?.data?.village?.map((row) => ({
              id: row?.id,
              villageNameEng: row?.villageName,
              villageNameMr: row?.villageNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }


  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "50%";
  };

  const handleDrawerClose = () => {
    setOpen(false);
    drawerWidth = 0;
  };


  const addressClearErros = () => {
    clearErrors(`trnProprtyHolderAddressDao.citySurveyNumber`);
    clearErrors(`trnProprtyHolderAddressDao.revenueSurveyNumberBilling`);
    clearErrors(`trnProprtyHolderAddressDao.circleIdBilling`);
    clearErrors(`trnProprtyHolderAddressDao.gatIdBilling`);
    // clearErrors(`trnProprtyHolderAddressDao.zoneIdBilling`);
    // clearErrors(`trnProprtyHolderAddressDao.wardIdBilling`);
    clearErrors(`trnProprtyHolderAddressDao.areaIdBilling`);
    clearErrors(`trnProprtyHolderAddressDao.villageIdBilling`);
    clearErrors(`trnProprtyHolderAddressDao.landmarkIdBilling`);
    clearErrors(`trnProprtyHolderAddressDao.pinCodeIdBilling`);
    clearErrors(`trnProprtyHolderAddressDao.sectorBlockNumberBilling`);
    clearErrors(`trnProprtyHolderAddressDao.flatNumberBilling`);
    clearErrors(`trnProprtyHolderAddressDao.buildingNameBilling`);
    clearErrors(`trnProprtyHolderAddressDao.societyNameBilling`);
    clearErrors(`trnProprtyHolderAddressDao.cityNameBilling`);
    clearErrors(`trnProprtyHolderAddressDao.stateBilling`);
    clearErrors(`trnProprtyHolderAddressDao.lattitudeBilling`);
    clearErrors(`trnProprtyHolderAddressDao.logitudeBilling`);
    clearErrors(`trnProprtyHolderAddressDao.addressCheckBox`);
  }

  // Address Change
  const addressChange = (e) => {
    console.log("eeeeeeeeeeeeeeeeee", e)
    if (e == true || e == "true" || e == 1) {
      setValue(`trnProprtyHolderAddressDao.citySurveyNumberBilling`, watch(`trnProprtyHolderAddressDao.citySurveyNumber`));
      setValue(`trnProprtyHolderAddressDao.revenueSurveyNumberBilling`, watch(`trnProprtyHolderAddressDao.revenueSurveyNumber`));
      setValue(`trnProprtyHolderAddressDao.circleIdBilling`, watch(`trnProprtyHolderAddressDao.circleId`));
      setValue(`trnProprtyHolderAddressDao.gatIdBilling`, watch(`trnProprtyHolderAddressDao.gatId`));
      // setValue(`trnProprtyHolderAddressDao.zoneIdBilling`, watch(`trnProprtyHolderAddressDao.zoneId`));
      // setValue(`trnProprtyHolderAddressDao.wardIdBilling`, watch(`trnProprtyHolderAddressDao.wardId`));
      setValue(`trnProprtyHolderAddressDao.areaIdBilling`, watch(`trnProprtyHolderAddressDao.areaId`));
      setValue(`trnProprtyHolderAddressDao.villageIdBilling`, watch(`trnProprtyHolderAddressDao.villageId`));
      setValue(`trnProprtyHolderAddressDao.landmarkIdBilling`, watch(`trnProprtyHolderAddressDao.landmarkId`));
      setValue(`trnProprtyHolderAddressDao.pinCodeIdBilling`, watch(`trnProprtyHolderAddressDao.pinCodeId`));
      setValue(`trnProprtyHolderAddressDao.sectorBlockNumberBilling`, watch(`trnProprtyHolderAddressDao.sectorBlockNumber`));
      setValue(`trnProprtyHolderAddressDao.flatNumberBilling`, watch(`trnProprtyHolderAddressDao.flatNumber`));
      setValue(`trnProprtyHolderAddressDao.buildingNameBilling`, watch(`trnProprtyHolderAddressDao.buildingName`));
      setValue(`trnProprtyHolderAddressDao.societyNameBilling`, watch(`trnProprtyHolderAddressDao.societyName`));
      setValue(`trnProprtyHolderAddressDao.cityNameBilling`, watch(`trnProprtyHolderAddressDao.cityName`));
      setValue(`trnProprtyHolderAddressDao.stateBilling`, watch(`trnProprtyHolderAddressDao.state`));
      setValue(`trnProprtyHolderAddressDao.lattitudeBilling`, watch(`trnProprtyHolderAddressDao.lattitude`));
      setValue(`trnProprtyHolderAddressDao.logitudeBilling`, watch(`trnProprtyHolderAddressDao.logitude`));
      setValue(`trnProprtyHolderAddressDao.postalFullAddressMr`, "");
      setValue(`trnProprtyHolderAddressDao.postalFullAddressEng`, "");
      addressClearErros();

      // setAddressShrink(true);
    } else {
      setValue(`trnProprtyHolderAddressDao.citySurveyNumberBilling`, "");
      setValue(`trnProprtyHolderAddressDao.revenueSurveyNumberBilling`, "");
      setValue(`trnProprtyHolderAddressDao.circleIdBilling`, null);
      setValue(`trnProprtyHolderAddressDao.gatIdBilling`, null);
      // setValue(`trnProprtyHolderAddressDao.zoneIdBilling`, null);
      // setValue(`trnProprtyHolderAddressDao.wardIdBilling`, null);
      setValue(`trnProprtyHolderAddressDao.areaIdBilling`, null);
      setValue(`trnProprtyHolderAddressDao.pinCodeIdBilling`, null);
      setValue(`trnProprtyHolderAddressDao.villageIdBilling`, null);
      setValue(`trnProprtyHolderAddressDao.landmarkIdBilling`, null);
      setValue(`trnProprtyHolderAddressDao.sectorBlockNumberBilling`, "");
      setValue(`trnProprtyHolderAddressDao.flatNumberBilling`, "");
      setValue(`trnProprtyHolderAddressDao.buildingNameBilling`, "");
      setValue(`trnProprtyHolderAddressDao.societyNameBilling`, "");
      setValue(`trnProprtyHolderAddressDao.cityNameBilling`, "");
      setValue(`trnProprtyHolderAddressDao.stateBilling`, "");
      setValue(`trnProprtyHolderAddressDao.lattitudeBilling`, "");
      setValue(`trnProprtyHolderAddressDao.logitudeBilling`, "");
      addressClearErros();
      // setValue(`trnProprtyHolderAddressDao.postalFullAddressMr`, "");
      // setValue(`trnProprtyHolderAddressDao.postalFullAddressEng`, "");
      // setAddressShrink(false);
      // setAddressShrink();
    }
  };




  //! useEffect -  ================================================>

  useEffect(() => {
    getCircleNames();
    // getGatNames();
    // getZoneNames();
    // getWardNames();
    getAreaNames();
    getPinCodes();
    getLandMarkNames();
    getVillageNames();
  }, [])

  useEffect(() => {
    console.log("circleId", watch("trnProprtyHolderAddressDao.circleId"))
    if (watch("trnProprtyHolderAddressDao.circleId")) {
      getGatNames(watch("trnProprtyHolderAddressDao.circleId"))
    }
  }, [watch("trnProprtyHolderAddressDao.circleId")])




  useEffect(() => {
    console.log("df234324234324", watch("trnProprtyHolderAddressDao.addressCheckBox"))
    addressChange(watch("trnProprtyHolderAddressDao.addressCheckBox"))
  }, [watch("trnProprtyHolderAddressDao.addressCheckBox")])




  //! =======================>  view
  return (
    <div>

      <div className={styles.DivOuter}>
        <div className={styles.Header}>
          <FormattedLabel id="address" />
        </div>
      </div>


      {/** Main Address */}


      <div className={styles.PrpertyAddressSubHeader}>
        <FormattedLabel id="propertyAddress" />
      </div>


      <div className={styles.flexMain}>
        <Grid container className={styles.GridContainer}>
          {/** city survey no */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <TextField

              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="citySurveyNumber" required />}
              {...register("trnProprtyHolderAddressDao.citySurveyNumber")}
              error={!!errors?.trnProprtyHolderAddressDao?.citySurveyNumber}
              helperText={
                errors?.trnProprtyHolderAddressDao?.citySurveyNumber
                  ? errors?.trnProprtyHolderAddressDao?.citySurveyNumber?.message
                  : null
              }
            />
          </Grid>

          {/** revenue survey no */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <TextField

              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="revenueSurveyNumber" required />}
              {...register("trnProprtyHolderAddressDao.revenueSurveyNumber")}
              error={!!errors?.trnProprtyHolderAddressDao?.revenueSurveyNumber}
              helperText={
                errors?.trnProprtyHolderAddressDao?.revenueSurveyNumber
                  ? errors?.trnProprtyHolderAddressDao?.revenueSurveyNumber?.message
                  : null
              }
            />
          </Grid>

          {/** circle Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.trnProprtyHolderAddressDao?.circleId}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("trnProprtyHolderAddressDao.circleId") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="circleName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => {
                      setValue("trnProprtyHolderAddressDao.gatId", null);
                      // setValue("trnProprtyHolderAddressDao.wardId", null);
                      // setValue("trnProprtyHolderAddressDao.areaId", null);
                      // setValue("trnProprtyHolderAddressDao.villageId", null);
                      // setValue("trnProprtyHolderAddressDao.landmarkId", null);
                      // setValue("addressUniqueIdCR", null);
                      return field?.onChange(value);
                    }}
                    label=<FormattedLabel id="circleName" required />
                  >
                    {circleNames &&
                      circleNames?.map((circleName) => (
                        <MenuItem key={circleName?.id} value={circleName?.id}>
                          {language == "en"
                            ? circleName?.circleNameEng
                            : circleName?.circleNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnProprtyHolderAddressDao.circleId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.trnProprtyHolderAddressDao?.circleId ? errors?.trnProprtyHolderAddressDao?.circleId?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** gat Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.trnProprtyHolderAddressDao?.gatId}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("trnProprtyHolderAddressDao.gatId") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="gatName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("trnProprtyHolderAddressDao.circleId") == null
                        ? true
                        : watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => {
                      // setValue("trnProprtyHolderAddressDao.zoneId", null);
                      // setValue("trnProprtyHolderAddressDao.wardId", null);
                      // setValue("trnProprtyHolderAddressDao.areaId", null);
                      // setValue("trnProprtyHolderAddressDao.villageId", null);
                      // setValue("trnProprtyHolderAddressDao.landmarkId", null);
                      // setValue("addressUniqueIdCR", null);
                      return field?.onChange(value);
                    }}
                    label=<FormattedLabel id="zoneName" required />
                  >
                    {gatNames &&
                      gatNames?.map((gatName) => (
                        <MenuItem key={gatName?.id} value={gatName?.id}>
                          {language == "en"
                            ? gatName?.gatNameEng
                            : gatName?.gatNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnProprtyHolderAddressDao.gatId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.trnProprtyHolderAddressDao?.gatId ? errors?.trnProprtyHolderAddressDao?.gatId?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** zone Name */}
          {/**
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <FormControl
              variant="standard"
              error={!!errors?.trnProprtyHolderAddressDao?.zoneId}
              sx={{ marginTop: 2 }}
            >
              <InputLabel
                shrink={watch("trnProprtyHolderAddressDao.zoneId") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="zoneName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={watch("trnProprtyHolderAddressDao.gatId") == null
                      ? true
                      : watch("disabledFieldInputState")}
                    value={field?.value}
                    onChange={(value) => {
                      setValue("trnProprtyHolderAddressDao.wardId", null);
                      setValue("trnProprtyHolderAddressDao.areaId", null);
                      setValue("trnProprtyHolderAddressDao.villageId", null);
                      setValue("trnProprtyHolderAddressDao.landmarkId", null);
                      // setValue("addressUniqueIdCR", null);
                      return field?.onChange(value);
                    }}
                    label=<FormattedLabel id="zoneName" required />
                  >
                    {zoneNames &&
                      zoneNames?.map((zoneName) => (
                        <MenuItem key={zoneName?.id} value={zoneName?.id}>
                          {language == "en"
                            ? zoneName?.zoneNameEng
                            : zoneName?.zoneNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnProprtyHolderAddressDao.zoneId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.trnProprtyHolderAddressDao?.zoneId ? errors?.trnProprtyHolderAddressDao?.zoneId?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
           */}

          {/** ward Name */}
          {/**  
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors?.trnProprtyHolderAddressDao?.wardId}
            >
              <InputLabel
                shrink={watch("trnProprtyHolderAddressDao.wardId") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="wardName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      watch("trnProprtyHolderAddressDao.zoneId") == null
                        ? true
                        : watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => {
                      setValue("trnProprtyHolderAddressDao.areaId", null);
                      setValue("trnProprtyHolderAddressDao.villageId", null);
                      setValue("trnProprtyHolderAddressDao.landmarkId", null);
                      // setValue("addressUniqueIdCR", null);
                      return field?.onChange(value);
                    }}
                    label={<FormattedLabel id="wardName" required />}
                  >
                    {wardNames &&
                      wardNames?.map((wardName, index) => (
                        <MenuItem key={index} value={wardName?.id}>
                          {language == "en"
                            ? wardName?.wardNameEng
                            : wardName?.wardNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnProprtyHolderAddressDao.wardId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.trnProprtyHolderAddressDao?.wardId ? errors?.trnProprtyHolderAddressDao?.wardId?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          */}

          {/** area name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.trnProprtyHolderAddressDao?.areaId}>
              <InputLabel
                shrink={watch("trnProprtyHolderAddressDao.areaId") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="areaName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      // watch("trnProprtyHolderAddressDao.wardId") == null
                      //   ? true
                      //   :
                      watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => {
                      // setValue("areaId", null);
                      // setValue("trnProprtyHolderAddressDao.villageId", null);
                      // setValue("trnProprtyHolderAddressDao.landmarkId", null);
                      // setValue("addressUniqueIdCR", null);
                      return field?.onChange(value);
                    }}
                    label={<FormattedLabel id="areaName" required />}
                  >
                    {areaNames &&
                      areaNames?.map((areaName, index) => (
                        <MenuItem key={index} value={areaName?.id}>
                          {language == "en"
                            ? areaName?.areaNameEng
                            : areaName?.areaNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnProprtyHolderAddressDao.areaId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.trnProprtyHolderAddressDao?.areaId ? errors?.trnProprtyHolderAddressDao?.areaId?.message : null}
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
            className={styles.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.trnProprtyHolderAddressDao?.villageId}>
              <InputLabel
                shrink={watch("trnProprtyHolderAddressDao.villageId") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="villageName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      // watch("trnProprtyHolderAddressDao.areaId") == null
                      //   ? true
                      //   :
                      watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => {
                      return field?.onChange(value);
                    }}
                    label={<FormattedLabel id="villageName" required />}
                  >
                    {villageNames &&
                      villageNames?.map((villageName, index) => (
                        <MenuItem key={index} value={villageName?.id}>
                          {language == "en"
                            ? villageName?.villageNameEng
                            : villageName?.villageNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnProprtyHolderAddressDao.villageId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.trnProprtyHolderAddressDao?.villageId ? errors?.trnProprtyHolderAddressDao?.villageId?.message : null}
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
            className={styles.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.trnProprtyHolderAddressDao?.landmarkId}>
              <InputLabel
                shrink={watch("trnProprtyHolderAddressDao.landmarkId") == null ? false : true}
                id="demo-simple-select-standard-label"
              >
                {<FormattedLabel id="landmarkName" required />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={
                      // watch("trnProprtyHolderAddressDao.areaId") == null
                      //   ? true
                      //   : 
                      watch("disabledFieldInputState")
                    }
                    value={field?.value}
                    onChange={(value) => field?.onChange(value)}
                    label={<FormattedLabel id="landmarkName" required />}
                  >
                    {landMarkNames &&
                      landMarkNames?.map((landmarkName, index) => (
                        <MenuItem key={index} value={landmarkName?.id}>
                          {language == "en"
                            ? landmarkName?.landmarkNameEng
                            : landmarkName?.landmarkNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnProprtyHolderAddressDao.landmarkId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.trnProprtyHolderAddressDao?.landmarkId
                  ? errors?.trnProprtyHolderAddressDao?.landmarkId?.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/** sector  Block No */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <TextField

              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="sectorOrBlockNo" required />}
              {...register("trnProprtyHolderAddressDao.sectorBlockNumber")}
              error={!!errors?.trnProprtyHolderAddressDao?.sectorBlockNumber}
              helperText={
                errors?.trnProprtyHolderAddressDao?.sectorBlockNumber
                  ? errors?.trnProprtyHolderAddressDao?.sectorBlockNumber?.message
                  : null
              }
            />
          </Grid>

          {/** flat No  */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <TextField

              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="flatNumber" required />}
              {...register("trnProprtyHolderAddressDao.flatNumber")}
              error={!!errors?.trnProprtyHolderAddressDao?.flatNumber}
              helperText={
                errors?.trnProprtyHolderAddressDao?.flatNumber
                  ? errors?.trnProprtyHolderAddressDao?.flatNumber?.message
                  : null
              }
            />
          </Grid>

          {/** building Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <TextField

              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="buildingName" required />}
              {...register("trnProprtyHolderAddressDao.buildingName")}
              error={!!errors?.trnProprtyHolderAddressDao?.buildingName}
              helperText={
                errors?.trnProprtyHolderAddressDao?.buildingName
                  ? errors?.trnProprtyHolderAddressDao?.buildingName?.message
                  : null
              } x
            />
          </Grid>

          {/** society name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <TextField

              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="societyName" required />}
              {...register("trnProprtyHolderAddressDao.societyName")}
              error={!!errors?.trnProprtyHolderAddressDao?.societyName}
              helperText={
                errors?.trnProprtyHolderAddressDao?.societyName
                  ? errors?.trnProprtyHolderAddressDao?.societyName?.message
                  : null
              }
            />
          </Grid>

          {/** City Name */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          >
            <TextField
              id="standard-basic"
              disabled={watch("disabledFieldInputState")}
              defaultValue={
                language == "en" ? "Pimpri Chinchwad" : "पिंपरी चिंचवड"
              }
              label={<FormattedLabel id="cityName" required />}
              {...register("trnProprtyHolderAddressDao.cityName")}
              error={!!errors?.trnProprtyHolderAddressDao?.cityName}
              helperText={
                errors?.trnProprtyHolderAddressDao?.cityName ? errors?.trnProprtyHolderAddressDao?.cityName?.message : null
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
            className={styles.GridItemCenter}
          >
            <TextField
              id="standard-basic"
              disabled={watch("disabledFieldInputState")}
              defaultValue={language == "en" ? "Maharashtra" : "महाराष्ट्र"}
              label={<FormattedLabel id="state" required />}
              {...register("trnProprtyHolderAddressDao.state")}
              error={!!errors?.trnProprtyHolderAddressDao?.state}
              helperText={errors?.trnProprtyHolderAddressDao?.state ? errors?.trnProprtyHolderAddressDao?.state?.message : null}
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
            className={styles.GridItemCenter}
          >
            <FormControl sx={{ marginTop: 2 }} error={!!errors?.trnProprtyHolderAddressDao?.pinCodeId}>
              <InputLabel
                shrink={watch("trnProprtyHolderAddressDao.pinCodeId") == null ? false : true}
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
                    {pinCodes &&
                      pinCodes?.map((pincode, index) => (
                        <MenuItem key={index} value={pincode?.id}>
                          {language == "en"
                            ? pincode?.pincodeEng
                            : pincode?.pincodeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnProprtyHolderAddressDao.pinCodeId"
                control={control}
                defaultValue={null}
              />
              <FormHelperText>
                {errors?.trnProprtyHolderAddressDao?.pinCodeId ? errors?.trnProprtyHolderAddressDao?.pinCodeId?.message : null}
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
            className={styles.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              defaultValue={null}
              label={<FormattedLabel id="lattitude" />}
              {...register("trnProprtyHolderAddressDao.lattitude")}
              error={!!errors?.trnProprtyHolderAddressDao?.lattitude}
              helperText={
                errors?.trnProprtyHolderAddressDao?.lattitude ? errors?.trnProprtyHolderAddressDao?.lattitude?.message : null
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
            className={styles.GridItemCenter}
          >
            <TextField
              disabled={watch("disabledFieldInputState")}
              id="standard-basic"
              label={<FormattedLabel id="logitude" />}
              {...register("trnProprtyHolderAddressDao.logitude")}
              defaultValue={null}
              error={!!errors?.trnProprtyHolderAddressDao?.logitude}
              helperText={
                errors?.trnProprtyHolderAddressDao?.logitude ? errors?.trnProprtyHolderAddressDao?.logitude?.message : null
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
                className={styles.GridItemCenter}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
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
                className={styles.GridItemCenter}
              >
                <Button
                  className={styles.viewMapLocationButton}
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
                className={styles.GridItemCenter}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                className={styles.GridItemCenter}
              ></Grid>
            </>
          )}
        </Grid>
      </div>













      {/** Other Address */}


      <div className={styles.postalAddressSubHeader}>
        <FormattedLabel id="postalOrBillingAddress" />
      </div>


      <Grid container className={styles.GridContainer}>
        {/** Check Box */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className={styles.GridItemCenter}
        >
          <FormControlLabel
            className={styles.addressCheckBoxButton}
            control={
              <Controller
                name="trnProprtyHolderAddressDao.addressCheckBox"
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
                      setValue("trnProprtyHolderAddressDao.addressCheckBox", e?.target?.checked);
                      clearErrors("trnProprtyHolderAddressDao.addressCheckBox");
                      // addressChange(e);
                    }}
                  />
                )}
              />
            }
            label=<span className={styles.addressCheckBoxButtonSpan}>
              {
                <FormattedLabel id="sameAsPropertyAddress" />
              }
            </span>
            labelPlacement="end"
          />
        </Grid>
      </Grid>


      {watch("trnProprtyHolderAddressDao.addressCheckBox") == true || watch("trnProprtyHolderAddressDao.addressCheckBox") == 1 || watch("trnProprtyHolderAddressDao.addressCheckBox") == "true" ? <Grid container className={styles.GridContainer}>
        {/** city survey no */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <TextField

            disabled
            id="standard-basic"
            label={<FormattedLabel id="citySurveyNumber" required />}
            {...register("trnProprtyHolderAddressDao.citySurveyNumberBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.citySurveyNumberBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.citySurveyNumberBilling
                ? errors?.trnProprtyHolderAddressDao?.citySurveyNumberBilling?.message
                : null
            }
          />
        </Grid>

        {/** revenue survey no */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <TextField

            disabled
            id="standard-basic"
            label={<FormattedLabel id="revenueSurveyNumber" required />}
            {...register("trnProprtyHolderAddressDao.revenueSurveyNumberBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.revenueSurveyNumberBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.revenueSurveyNumberBilling
                ? errors?.trnProprtyHolderAddressDao?.revenueSurveyNumberBilling?.message
                : null
            }
          />
        </Grid>

        {/** circle Name */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <FormControl
            variant="standard"
            error={!!errors?.trnProprtyHolderAddressDao?.circleIdBilling}
            sx={{ marginTop: 2 }}
          >
            <InputLabel
              shrink={watch("trnProprtyHolderAddressDao.circleIdBilling") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="circleName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field?.value}
                  onChange={(value) => {
                    setValue("trnProprtyHolderAddressDao.gatIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.wardIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.areaIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.villageIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.landmarkIdBilling", null);
                    // setValue("addressUniqueIdCR", null);
                    return field?.onChange(value);
                  }}
                  label=<FormattedLabel id="circleName" required />
                >
                  {circleNames &&
                    circleNames?.map((circleName) => (
                      <MenuItem key={circleName?.id} value={circleName?.id}>
                        {language == "en"
                          ? circleName?.circleNameEng
                          : circleName?.circleNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="trnProprtyHolderAddressDao.circleIdBilling"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.circleIdBilling ? errors?.trnProprtyHolderAddressDao?.circleIdBilling?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** gat Name */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <FormControl
            variant="standard"
            error={!!errors?.trnProprtyHolderAddressDao?.gatIdBilling}
            sx={{ marginTop: 2 }}
          >
            <InputLabel
              shrink={watch("trnProprtyHolderAddressDao.gatIdBilling") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="gatName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field?.value}
                  onChange={(value) => {
                    // setValue("trnProprtyHolderAddressDao.zoneIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.wardIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.areaIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.villageIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.landmarkIdBilling", null);
                    // setValue("addressUniqueIdCR", null);
                    return field?.onChange(value);
                  }}
                  label=<FormattedLabel id="zoneName" required />
                >
                  {gatNames &&
                    gatNames?.map((gatName) => (
                      <MenuItem key={gatName?.id} value={gatName?.id}>
                        {language == "en"
                          ? gatName?.gatNameEng
                          : gatName?.gatNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="trnProprtyHolderAddressDao.gatIdBilling"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.gatIdBilling ? errors?.trnProprtyHolderAddressDao?.gatIdBilling?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** zone Name */}
        {/**
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <FormControl
            variant="standard"
            error={!!errors?.trnProprtyHolderAddressDao?.zoneIdBilling}
            sx={{ marginTop: 2 }}
          >
            <InputLabel
              shrink={watch("trnProprtyHolderAddressDao.zoneIdBilling") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="zoneName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field?.value}
                  onChange={(value) => {
                    setValue("trnProprtyHolderAddressDao.wardIdBilling", null);
                    setValue("trnProprtyHolderAddressDao.areaIdBilling", null);
                    setValue("trnProprtyHolderAddressDao.villageIdBilling", null);
                    setValue("trnProprtyHolderAddressDao.landmarkIdBilling", null);
                    // setValue("addressUniqueIdCR", null);
                    return field?.onChange(value);
                  }}
                  label=<FormattedLabel id="zoneName" required />
                >
                  {zoneNames &&
                    zoneNames?.map((zoneName) => (
                      <MenuItem key={zoneName?.id} value={zoneName?.id}>
                        {language == "en"
                          ? zoneName?.zoneNameEng
                          : zoneName?.zoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="trnProprtyHolderAddressDao.zoneIdBilling"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.zoneIdBilling ? errors?.trnProprtyHolderAddressDao?.zoneIdBilling?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
         */}

        {/** ward Name */}
        {/** 
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <FormControl
            variant="standard"
            sx={{ marginTop: 2 }}
            error={!!errors?.trnProprtyHolderAddressDao?.wardIdBilling}
          >
            <InputLabel
              shrink={watch("trnProprtyHolderAddressDao.wardIdBilling") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="wardName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field?.value}
                  onChange={(value) => {
                    setValue("trnProprtyHolderAddressDao.areaIdBilling", null);
                    setValue("trnProprtyHolderAddressDao.villageIdBilling", null);
                    setValue("trnProprtyHolderAddressDao.landmarkIdBilling", null);
                    // setValue("addressUniqueIdCR", null);
                    return field?.onChange(value);
                  }}
                  label={<FormattedLabel id="wardName" required />}
                >
                  {wardNames &&
                    wardNames?.map((wardName, index) => (
                      <MenuItem key={index} value={wardName?.id}>
                        {language == "en"
                          ? wardName?.wardNameEng
                          : wardName?.wardNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="trnProprtyHolderAddressDao.wardIdBilling"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.wardIdBilling ? errors?.trnProprtyHolderAddressDao?.wardIdBilling?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        */}

        {/** area name */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.trnProprtyHolderAddressDao?.areaIdBilling}>
            <InputLabel
              shrink={watch("trnProprtyHolderAddressDao.areaIdBilling") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="areaName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field?.value}
                  onChange={(value) => {
                    // setValue("trnProprtyHolderAddressDao.areaId", null);
                    // setValue("trnProprtyHolderAddressDao.villageIdBilling", null);
                    // setValue("trnProprtyHolderAddressDao.landmarkIdBilling", null);
                    // setValue("addressUniqueIdCR", null);
                    return field?.onChange(value);
                  }}
                  label={<FormattedLabel id="areaName" required />}
                >
                  {areaNames &&
                    areaNames?.map((areaName, index) => (
                      <MenuItem key={index} value={areaName?.id}>
                        {language == "en"
                          ? areaName?.areaNameEng
                          : areaName?.areaNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="trnProprtyHolderAddressDao.areaIdBilling"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.areaIdBilling ? errors?.trnProprtyHolderAddressDao?.areaIdBilling?.message : null}
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
          className={styles.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.trnProprtyHolderAddressDao?.villageIdBilling}>
            <InputLabel
              shrink={watch("trnProprtyHolderAddressDao.villageIdBilling") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="villageName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field?.value}
                  onChange={(value) => {
                    return field?.onChange(value);
                  }}
                  label={<FormattedLabel id="villageName" required />}
                >
                  {villageNames &&
                    villageNames?.map((villageName, index) => (
                      <MenuItem key={index} value={villageName?.id}>
                        {language == "en"
                          ? villageName?.villageNameEng
                          : villageName?.villageNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="trnProprtyHolderAddressDao.villageIdBilling"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.villageIdBilling ? errors?.trnProprtyHolderAddressDao?.villageIdBilling?.message : null}
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
          className={styles.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.trnProprtyHolderAddressDao?.landmarkIdBilling}>
            <InputLabel
              shrink={watch("trnProprtyHolderAddressDao.landmarkIdBilling") == null ? false : true}
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
                  {landMarkNames &&
                    landMarkNames?.map((landmarkName, index) => (
                      <MenuItem key={index} value={landmarkName?.id}>
                        {language == "en"
                          ? landmarkName?.landmarkNameEng
                          : landmarkName?.landmarkNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="trnProprtyHolderAddressDao.landmarkIdBilling"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.landmarkIdBilling
                ? errors?.trnProprtyHolderAddressDao?.landmarkIdBilling?.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/** sector  Block No */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <TextField

            disabled
            id="standard-basic"
            label={<FormattedLabel id="sectorOrBlockNo" required />}
            {...register("trnProprtyHolderAddressDao.sectorBlockNumberBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.sectorBlockNumberBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.sectorBlockNumberBilling
                ? errors?.trnProprtyHolderAddressDao?.sectorBlockNumberBilling?.message
                : null
            }
          />
        </Grid>

        {/** flat No  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <TextField

            disabled
            id="standard-basic"
            label={<FormattedLabel id="flatNumber" required />}
            {...register("trnProprtyHolderAddressDao.flatNumberBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.flatNumberBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.flatNumberBilling
                ? errors?.trnProprtyHolderAddressDao?.flatNumberBilling?.message
                : null
            }
          />
        </Grid>

        {/** building Name */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <TextField

            disabled
            id="standard-basic"
            label={<FormattedLabel id="buildingName" required />}
            {...register("trnProprtyHolderAddressDao.buildingNameBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.buildingNameBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.buildingNameBilling
                ? errors?.trnProprtyHolderAddressDao?.buildingNameBilling?.message
                : null
            } x
          />
        </Grid>

        {/** society name */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <TextField

            disabled
            id="standard-basic"
            label={<FormattedLabel id="societyName" required />}
            {...register("trnProprtyHolderAddressDao.societyNameBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.societyNameBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.societyNameBilling
                ? errors?.trnProprtyHolderAddressDao?.societyNameBilling?.message
                : null
            }
          />
        </Grid>

        {/** City Name */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >
          <TextField
            id="standard-basic"
            disabled
            defaultValue={
              language == "en" ? "Pimpri Chinchwad" : "पिंपरी चिंचवड"
            }
            label={<FormattedLabel id="cityName" required />}
            {...register("trnProprtyHolderAddressDao.cityNameBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.cityNameBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.cityNameBilling ? errors?.trnProprtyHolderAddressDao?.cityNameBilling?.message : null
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
          className={styles.GridItemCenter}
        >
          <TextField
            id="standard-basic"
            disabled
            defaultValue={language == "en" ? "Maharashtra" : "महाराष्ट्र"}
            label={<FormattedLabel id="state" required />}
            {...register("trnProprtyHolderAddressDao.stateBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.stateBilling}
            helperText={errors?.trnProprtyHolderAddressDao?.stateBilling ? errors?.trnProprtyHolderAddressDao?.stateBilling?.message : null}
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
          className={styles.GridItemCenter}
        >
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.trnProprtyHolderAddressDao?.pinCodeIdBilling}>
            <InputLabel
              shrink={watch("trnProprtyHolderAddressDao.pinCodeIdBilling") == null ? false : true}
              id="demo-simple-select-standard-label"
            >
              {<FormattedLabel id="pinCode" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field?.value}
                  onChange={(value) => field?.onChange(value)}
                  label={<FormattedLabel id="pinCode" required />}
                >
                  {pinCodes &&
                    pinCodes?.map((pincode, index) => (
                      <MenuItem key={index} value={pincode?.id}>
                        {language == "en"
                          ? pincode?.pincodeEng
                          : pincode?.pincodeMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="trnProprtyHolderAddressDao.pinCodeIdBilling"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.pinCodeIdBilling ? errors?.trnProprtyHolderAddressDao?.pinCodeIdBilling?.message : null}
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
          className={styles.GridItemCenter}
        >
          <TextField
            disabled
            // InputLabelProps={{shrink:true}}
            id="standard-basic"
            defaultValue={null}
            label={<FormattedLabel id="lattitude" />}
            {...register("trnProprtyHolderAddressDao.lattitudeBilling")}
            error={!!errors?.trnProprtyHolderAddressDao?.lattitudeBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.lattitudeBilling ? errors?.trnProprtyHolderAddressDao?.lattitudeBilling?.message : null
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
          className={styles.GridItemCenter}
        >
          <TextField
            disabled
            id="standard-basic"
            label={<FormattedLabel id="logitude" />}
            {...register("trnProprtyHolderAddressDao.logitudeBilling")}
            defaultValue={null}
            error={!!errors?.trnProprtyHolderAddressDao?.logitudeBilling}
            helperText={
              errors?.trnProprtyHolderAddressDao?.logitudeBilling ? errors?.trnProprtyHolderAddressDao?.logitudeBilling?.message : null
            }
          />

          {/** other  */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          ></Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          ></Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={3}
            className={styles.GridItemCenter}
          ></Grid>


        </Grid>
        {/** empty  */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >

        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >

        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={3}
          className={styles.GridItemCenter}
        >

        </Grid>




      </Grid>
        :
        <div className={styles.row1}>
          <div className={styles.row}>


            <div
              style={{
                fontSize: "medium",
                marginLeft: 10,
                opacity: 1,
              }}
            >
              <FormattedLabel id="billingAddressEn" /> :
            </div>



            <Controller
              name="trnProprtyHolderAddressDao.postalFullAddressEng"
              control={control}
              render={({ field }) => (
                <>
                  <TextareaAutosize
                    {...field}
                    className={`${styles.bigText} ${errors.trnProprtyHolderAddressDao?.postalFullAddressEng ? styles.bigTextError1 : ''}`}
                    minRows={3}
                    maxRows={5}
                  />
                </>
              )}
            />

            <FormHelperText>
              {errors.trnProprtyHolderAddressDao?.postalFullAddressEng && (
                <p className={styles.errormessage}>{errors?.trnProprtyHolderAddressDao?.postalFullAddressEng?.message}</p>
              )}
            </FormHelperText>
            <br />






            <div

              style={{
                fontSize: "medium",
                marginTop: 20,
                marginLeft: 10,
                opacity: 1,
              }}
            >
              <FormattedLabel id="billingAddressMr" /> :
            </div>
            <Controller
              name="trnProprtyHolderAddressDao.postalFullAddressMr"
              control={control}
              render={({ field }) => (
                <>
                  <TextareaAutosize

                    {...field}
                    className={`${styles.bigText} ${errors?.trnProprtyHolderAddressDao?.postalFullAddressMr ? styles.bigTextError2 : ''}`}
                    minRows={3}
                    maxRows={5}
                  />
                </>
              )}
            />
            <FormHelperText>
              {errors?.trnProprtyHolderAddressDao?.postalFullAddressMr && (
                <p className={styles.errormessage}>{errors?.trnProprtyHolderAddressDao?.postalFullAddressMr?.message}</p>
              )}
            </FormHelperText>







          </div>
        </div>}



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
          src="/ABC.png"
          width="800px"
          alt="Map Not Found"
          style={{ width: "100%", height: "100%" }}
        />
      </Drawer>
      {/** End Drawer  */}



    </div >
  );
};

export default AddressOfPropertyHolder;
