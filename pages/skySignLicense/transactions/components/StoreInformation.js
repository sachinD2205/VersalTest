import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Grid,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

/////////////////// Drawer Related

import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Drawer from "@mui/material/Drawer";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

let drawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const StoreInformation = (props) => {
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [ownership, setownership] = useState([]);
  const [zone, setzone] = useState([]);
  const [licenseType, setlicenseType] = useState([]);
  const [storeTypes, setStoreTypes] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [businessSubType, setbusinessSubType] = useState([]);
  const [industryType, setindustryType] = useState([]);
  const [constructionType, setconstructionType] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [subZoneNames, setSubZoneNames] = useState([]);
  const [areaNames, setAreaNames] = useState([]);

  const language = useSelector((state) => state?.labels.language);

  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

  const userToken = useGetToken();
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

  useEffect(() => {
    console.log("abc12345", router.query);
    // if (router.query.pageMode === 'Add' || router.query.pageMode === 'Edit') {
    //   setDisabled(false)
    // } else {
    //   setDisabled(true)
    // }
    if (router.query.disabled) {
      setDisabled(true);
    } else if (props.disabled) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, []);

  useEffect(() => {
    if (watch("crPropertyTaxNumber")) {
      setValue("trnStoreDetailsDao.propertyNo", watch("crPropertyTaxNumber"));
    }
  }, [watch("crPropertyTaxNumber")]);

  const getownership = () => {
    axios
      .get(`${urls.CFCURL}/master/ownershipTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setownership(
          r.data.ownershipType.map((row) => ({
            id: row.id,
            ownershipType: row.ownershipType,
            ownershipTypeMr: row.ownershipTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getZoneName = () => {
    axios
      .get(`${urls.SSLM}/mstSkySignZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setZoneNames(
          res.data.mstSkySignZoneDao
            .map((r, i) => ({
              id: r.id,

              zoneName: r.zoneName,
              zoneNameMr: r.zoneNameMr,
            }))
            ?.sort((a, b) => a?.id - b?.id)
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // getSubZone based on zoneName
  const getSubZone = () => {
    if (watch("trnStoreDetailsDao.zoneKey")) {
      axios
        .get(
          `${urls.SSLM}/mstSubZone/getSubZoneOnZoneKey?zoneKey=${watch(
            "trnStoreDetailsDao.zoneKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setSubZoneNames(
            res?.data
              ?.map((data, index) => ({
                id: data?.id,
                subZoneName: data?.subZoneName,
                subZoneNameMr: data?.subZoneNameMr,
              }))
              ?.sort((a, b) => a?.id - b?.id)
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  // get areaNames based on subZoneKey
  const getAreaNames = () => {
    if (watch("trnStoreDetailsDao.subZoneKey")) {
      axios
        .get(
          `${urls.SSLM}/mstSubZoneArea/getDataOnSubZone?subZonekey=${watch(
            "trnStoreDetailsDao.subZoneKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          setAreaNames(
            res?.data
              ?.map((data, index) => ({
                id: data?.id,
                subZoneAreaName: data?.subZoneAreaName,
                subZoneAreaNameMr: data?.subZoneAreaNameMr,
              }))
              ?.sort((a, b) => a?.id - b?.id)
          );
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  const getlicenseType = () => {
    axios
      .get(`${urls.SSLM}/master/MstLicenseType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setlicenseType(
          r.data.MstLicenseType.map((row) => ({
            id: row.id,
            licenseTypeEn: row.licenseType,
            licenseTypeMar: row.licenseTypeMar,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getStoreType = () => {
    axios
      .get(`${urls.SSLM}/mstStoreTypes/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setStoreTypes(
          r.data?.mstStoreTypesDao?.map((row) => ({
            id: row.id,
            storeType: row.storeType,
            storeTypeMr: row.storeTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getUnitType = () => {
    axios
      .get(`${urls.SSLM}/master/MstUnitType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setUnitTypes(
          r.data?.mstUnitTypeDaoList.map((row) => ({
            id: row.id,
            unitType: row.unitType,
            unitTypeMar: row.unitType,
            // businessTypeMar: row.businessTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getbusinessSubType = () => {
    axios
      .get(`${urls.CFCURL}/master/businessSubType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setbusinessSubType(
          r.data.businessSubType.map((row) => ({
            id: row.id,
            businessSubTypeEn: row.businessSubType,
            businessSubTypeMar: row.businessSubTypeMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getindustryType = () => {
    axios
      .get(`${urls.SSLM}/master/MstIndustryType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setindustryType(
          r.data.mstIndustryTypeDao.map((row) => ({
            id: row.id,
            industryTypeEn: row.industryType,
            industryTypeMar: row.industryTypeMar,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getconstructionType = () => {
    axios
      .get(`${urls.PTAXURL}/master/constructionType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setconstructionType(
          r.data.constructionType.map((row) => ({
            id: row.id,
            constructionTypeEn: row.constructionTypeName,
            constructionTypeMar: row.constructionTypeNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    getownership();
    getStoreType();
    getUnitType();
    getbusinessSubType();
    getlicenseType();
    getconstructionType();
    getindustryType();
    // getzone();
    getZoneName();
    setValue("trnStoreDetailsDao.prCityName", "Pimpri Chinchwad");
    setValue("trnStoreDetailsDao.prState", "Maharashtra");
  }, []);

  useEffect(() => {
    getSubZone();
  }, [watch("trnStoreDetailsDao.zoneKey")]);
  useEffect(() => {
    getAreaNames();
  }, [watch("trnStoreDetailsDao.subZoneKey")]);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const convertFeetToMeter = (val) => {
    let temp = val * 0.09290304;
    return temp;
  };

  useEffect(() => {
    if (watch("trnStoreDetailsDao.totalAreaFt")) {
      setValue(
        "trnStoreDetailsDao.totalAreaM",
        convertFeetToMeter(watch("trnStoreDetailsDao.totalAreaFt"))
      );
    }
    if (watch("trnStoreDetailsDao.constructionAreaFt")) {
      setValue(
        "trnStoreDetailsDao.constructionAreaM",
        convertFeetToMeter(watch("trnStoreDetailsDao.constructionAreaFt"))
      );
    }
  }, [
    watch("trnStoreDetailsDao.totalAreaFt"),
    watch("trnStoreDetailsDao.constructionAreaFt"),
  ]);
  return (
    <>
      {/** Main Component  */}
      <Main>
        <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
          <FormattedLabel id="storeInfo" />
        </div>
        {/* <div>
              <Typography className={styles.rap} variant='h6' sx={{ marginTop: 5 }}>
                <strong>Organization Information</strong>
                {<FormattedLabel id="organizationInformation"></FormattedLabel>}
              </Typography>
            </div> */}
        <Grid
          // container
          // sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              autoFocus
              id="standard-basic"
              label={<FormattedLabel id="nameOfStore"></FormattedLabel>}
              {...register("trnStoreDetailsDao.nameOfStoreOrganization")}
              error={!!errors.nameOfStoreOrganization}
              helperText={
                errors?.nameOfStoreOrganization
                  ? errors.nameOfStoreOrganization.message
                  : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              label={<FormattedLabel id="crPropertyTaxNumber"></FormattedLabel>}
              {...register("trnStoreDetailsDao.propertyNo")}
              error={!!errors.propertyNo}
              helperText={errors?.propertyNo ? errors.propertyNo.message : null}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              label={<FormattedLabel id="propertyStatus"></FormattedLabel>}
              {...register("trnStoreDetailsDao.propertyStatus")}
              error={!!errors.propertyStatus}
              helperText={
                errors?.propertyStatus ? errors.propertyStatus.message : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.ownership}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="ownership"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Ownership *"
                  >
                    {ownership &&
                      ownership.map((ownership, index) => (
                        <MenuItem key={index} value={ownership.id}>
                          {ownership.ownership}
                          {language == "en"
                            ? ownership?.ownershipType
                            : ownership?.ownershipTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnStoreDetailsDao.ownership"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.ownership ? errors.ownership.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              sx={{ width: 230 }}
              id="standard-basic"
              label={<FormattedLabel id="totalAreaFt"></FormattedLabel>}
              {...register("trnStoreDetailsDao.totalAreaFt")}
              error={!!errors.totalAreaFt}
              helperText={
                errors?.totalAreaFt ? errors.totalAreaFt.message : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              InputLabelProps={{
                shrink: watch("trnStoreDetailsDao.totalAreaM") ? true : false,
              }}
              label={<FormattedLabel id="totalAreaM"></FormattedLabel>}
              {...register("trnStoreDetailsDao.totalAreaM")}
              error={!!errors.totalAreaM}
              helperText={errors?.totalAreaM ? errors.totalAreaM.message : null}
            />
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ marginTop: 2 }}
              error={errors.zoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="zonename" />}
                {/* Zone Name */}
              </InputLabel>
              <Controller
                name="trnStoreDetailsDao.zoneKey"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    //   sx={{ width: 250 }}
                    disabled={disabled}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Zone Name"
                  >
                    {zoneNames?.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.id}>
                          {item.zoneName}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.zoneKey ? errors.zoneKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* sub zone names */}
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ marginTop: 2 }}
              error={errors.subZoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="subZoneName" />}
              </InputLabel>
              <Controller
                name="trnStoreDetailsDao.subZoneKey"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    disabled={disabled}
                    // sx={{ width: 250 }}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Sub-Zone Name"
                  >
                    {subZoneNames?.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.id}>
                          {language == "en"
                            ? item.subZoneName
                            : item.subZoneNameMr}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.subZoneKey ? errors.subZoneKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* area names */}
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ marginTop: 2 }}
              error={errors.areaKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Area Name
              </InputLabel>
              <Controller
                name="trnStoreDetailsDao.areaKey"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    disabled={disabled}
                    // sx={{ width: 250 }}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Area Name"
                  >
                    {areaNames?.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.id}>
                          {language == "en"
                            ? item.subZoneAreaName
                            : item.subZoneAreaNameMr}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.areaKey ? errors.areaKey.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.storeType}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="storeType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Store Type *"
                  >
                    {storeTypes &&
                      storeTypes.map((storeType, index) => (
                        <MenuItem key={index} value={storeType.id}>
                          {language == "en"
                            ? storeType?.storeType
                            : storeType?.storeTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnStoreDetailsDao.storeType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.storeType ? errors.storeType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.unitType}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="unitType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Business Type *"
                  >
                    {unitTypes &&
                      unitTypes.map((unitType, index) => (
                        <MenuItem key={index} value={unitType.id}>
                          {language == "en"
                            ? unitType?.unitType
                            : unitType?.unitTypeMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnStoreDetailsDao.unitKey"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.unitType ? errors.unitType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              label={<FormattedLabel id="storeValue"></FormattedLabel>}
              {...register("trnStoreDetailsDao.storeValue")}
              error={!!errors.storeValue}
              helperText={errors?.storeValue ? errors.storeValue.message : null}
            />
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              sx={{ marginTop: 2 }}
              error={!!errors.constructionType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="constructionType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Construction Type *"
                  >
                    {constructionType &&
                      constructionType.map((constructionType, index) => (
                        <MenuItem key={index} value={constructionType.id}>
                          {constructionType.constructionType}
                          {language == "en"
                            ? constructionType?.constructionTypeEn
                            : constructionType?.constructionTypeMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnStoreDetailsDao.constructionType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.constructionType
                  ? errors.constructionType.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              label={<FormattedLabel id="constructionAreaFt"></FormattedLabel>}
              {...register("trnStoreDetailsDao.constructionAreaFt")}
              error={!!errors.constructionAreaFt}
              helperText={
                errors?.constructionAreaFt
                  ? errors.constructionAreaFt.message
                  : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              InputLabelProps={{
                shrink: watch("trnStoreDetailsDao.constructionAreaM")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="constructionAreaM"></FormattedLabel>}
              {...register("trnStoreDetailsDao.constructionAreaM")}
              error={!!errors.constructionAreaM}
              helperText={
                errors?.constructionAreaM
                  ? errors.constructionAreaM.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={disabled}
              sx={{ width: 250 }}
              id="standard-basic"
              placeholder="Example :- 08:30"
              label={<FormattedLabel id="workingHours"></FormattedLabel>}
              variant="standard"
              {...register("trnStoreDetailsDao.workingHours")}
              error={!!errors.workingHours}
              helperText={
                errors?.workingHours ? errors.workingHours.message : null
              }
            />
          </Grid>
        </Grid>

        <div
          style={{
            backgroundColor: "#0084ff",
            color: "white",
            fontSize: 19,
            marginTop: 30,
            marginBottom: 30,
            padding: 8,
            paddingLeft: 30,
            marginLeft: "40px",
            marginRight: "65px",
            borderRadius: 100,
          }}
        >
          <FormattedLabel id="storeAddress" />
        </div>
        <Grid
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl flexDirection="row">
              <FormLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="crCitySurveyNumber1" />}
              </FormLabel>
              <Controller
                name="trnStoreDetailsDao.numbertype"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    selected={field.value}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      error={!!errors?.numbertype}
                      value="citysurveyno"
                      disabled={disabled}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="citysurveyno" />}
                    />
                    <FormControlLabel
                      error={!!errors?.numbertype}
                      value="blockno"
                      disabled={disabled}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="blockno" />}
                    />
                    <FormControlLabel
                      error={!!errors?.numbertype}
                      value="sectorno"
                      disabled={disabled}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="sectorno" />}
                    />
                    <FormControlLabel
                      error={!!errors?.numbertype}
                      value="surveyno"
                      disabled={disabled}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="surveyno" />}
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors?.numbertype}>
                {errors?.numbertype ? errors?.numbertype?.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              label={<FormattedLabel id="crCitySurveyNumber"></FormattedLabel>}
              {...register("trnStoreDetailsDao.citySurveyNo")}
              error={!!errors.citySurveyNo}
              helperText={
                errors?.citySurveyNo ? errors.citySurveyNo.message : null
              }
            />
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              label={<FormattedLabel id="plotNo"></FormattedLabel>}
              {...register("trnStoreDetailsDao.plotNo")}
              error={!!errors.plotNo}
              helperText={errors?.plotNo ? errors.plotNo.message : null}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              label={<FormattedLabel id="roadName"></FormattedLabel>}
              {...register("trnStoreDetailsDao.roadName")}
              error={!!errors.roadName}
              helperText={errors?.roadName ? errors.roadName.message : null}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="villageName"></FormattedLabel>}
              variant="standard"
              {...register("trnStoreDetailsDao.villageName")}
              error={!!errors.villageName}
              helperText={
                errors?.villageName ? errors.villageName.message : null
              }
            />
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              // disabled={disabled}
              disabled
              sx={{ width: 250 }}
              id="standard-basic"
              // disabled
              // defaultValue={"Pimpri Chinchwad"}
              InputLabelProps={{
                shrink: watch("trnStoreDetailsDao.prCityName") ? true : false,
              }}
              label={<FormattedLabel id="crCityName"></FormattedLabel>}
              variant="standard"
              {...register("trnStoreDetailsDao.prCityName")}
              error={!!errors.prCityName1}
              helperText={
                errors?.prCityName1 ? errors.prCityName1.message : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              // disabled={disabled}
              disabled
              sx={{ width: 250 }}
              id="standard-basic"
              // disabled
              // defaultValue={"Maharashtra"}
              InputLabelProps={{
                shrink: watch("trnStoreDetailsDao.prState") ? true : false,
              }}
              label={<FormattedLabel id="crState"></FormattedLabel>}
              variant="standard"
              {...register("trnStoreDetailsDao.prState")}
              error={!!errors.prState1}
              helperText={errors?.prState1 ? errors.prState1.message : null}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="crPincode"></FormattedLabel>}
              variant="standard"
              {...register("trnStoreDetailsDao.Pincode")}
              error={!!errors.Pincode}
              helperText={errors?.Pincode ? errors.Pincode.message : null}
            />
          </Grid>
        </Grid>
      </Main>
    </>
  );
};

export default StoreInformation;
