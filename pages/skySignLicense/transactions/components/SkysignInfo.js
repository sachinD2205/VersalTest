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
  TextareaAutosize,
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

const SkysignInfo = (props) => {
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();

  const [ownership, setownership] = useState([]);
  const [zone, setzone] = useState([]);
  const [licenseType, setlicenseType] = useState([]);
  const [businessType, setbusinessType] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [businessSubType, setbusinessSubType] = useState([]);
  const [industryType, setindustryType] = useState([]);
  const [constructionType, setconstructionType] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [subZoneNames, setSubZoneNames] = useState([]);
  const [areaNames, setAreaNames] = useState([]);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [mediaSubTypes, setMediaSubTypes] = useState([]);
  const [formOfAdvertisements, setFormOfAdvertisements] = useState([
    {
      id: 1,
      formOfAdvertisement: "Temporary",
      formOfAdvertisementMr: "तात्पुरती ",
    },
    {
      id: 2,
      formOfAdvertisement: "Non Temporary ",
      formOfAdvertisementMr: "तात्पुरती नसलेली ",
    },
  ]);

  const [statusNames, setStatusNames] = useState([
    {
      id: 1,
      status: "High Class",
      statusMr: "उच्च वर्ग",
    },
    {
      id: 2,
      status: "Middle Class",
      statusMr: "मध्यम वर्ग",
    },
  ]);

  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

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
      setValue(
        "trnBussinessDetailsDao.propertyNo",
        watch("crPropertyTaxNumber")
      );
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
            .sort((a, b) => a.id - b.id)
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getSubZoneName = () => {
    axios
      .get(
        `${urls.SSLM}/mstSubZone/getSubZoneOnZoneKey?zoneKey=${watch(
          "zoneKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setSubZoneNames(
          res?.data?.map((r, i) => ({
            id: r.id,

            subZoneName: r.subZoneName,
            subZoneNameMr: r.subZoneNameMr,
            zoneKey: r.zoneKey,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getAreaName = () => {
    axios
      .get(
        `${urls.SSLM}/mstSubZoneArea/getDataOnSubZone?subZonekey=${watch(
          "subZoneKey"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setAreaNames(
          res?.data?.map((r, i) => ({
            id: r.id,
            subZoneAreaName: r.subZoneAreaName,
            subZoneAreaNameMr: r.subZoneAreaNameMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
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

  const getbusinessType = () => {
    axios
      .get(`${urls.SSLM}/master/MstBusinessTypes/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setbusinessType(
          r.data?.mstBusinessTypesDao?.map((row) => ({
            id: row.id,
            businessTypeEn: row.businessType,
            businessTypeMr: row.businessTypeMr,
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

  const getMediaType = () => {
    axios
      .get(`${urls.SSLM}/master/MstMediaType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setMediaTypes(
          r.data?.MstMediaType?.map((row) => ({
            id: row.id,
            mediaType: row.mediaType,
            mediaTypemr: row.mediaTypemr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getSubMediaType = () => {
    axios
      .get(`${urls.SSLM}/master/MstMediaSubType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setMediaSubTypes(
          r?.data?.MstMediaSubType?.map((row) => ({
            id: row.id,
            mediaSubType: row.mediaSubType,
            mediaSubTypemr: row.mediaSubTypemr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    getownership();
    getbusinessType();
    getUnitType();
    getbusinessSubType();
    getlicenseType();
    getconstructionType();
    getindustryType();
    // getzone();
    getZoneName();
    getMediaType();
    getSubMediaType();
    setValue("trnBussinessDetailsDao.prCityName", "Pimpri Chinchwad");
    setValue("trnBussinessDetailsDao.prState", "Maharashtra");
  }, []);

  useEffect(() => {
    if (watch("zoneKey")) {
      getSubZoneName();
    }
  }, [watch("zoneKey")]);

  useEffect(() => {
    if (watch("subZoneKey")) {
      getAreaName();
    }
  }, [watch("subZoneKey")]);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const convertFeetToMeter = (val) => {
    let temp = val * 0.09290304;
    return temp;
  };

  useEffect(() => {
    if (watch("trnBussinessDetailsDao.totalAreaFt")) {
      setValue(
        "trnBussinessDetailsDao.totalAreaM",
        convertFeetToMeter(watch("trnBussinessDetailsDao.totalAreaFt"))
      );
    }
    if (watch("trnBussinessDetailsDao.constructionAreaFt")) {
      setValue(
        "trnBussinessDetailsDao.constructionAreaM",
        convertFeetToMeter(watch("trnBussinessDetailsDao.constructionAreaFt"))
      );
    }
  }, [
    watch("trnBussinessDetailsDao.totalAreaFt"),
    watch("trnBussinessDetailsDao.constructionAreaFt"),
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
          <FormattedLabel id="agencyInformation" />
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
              label={<FormattedLabel id="nameOfAgency"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.nameOfAgency")}
              error={!!errors.nameOfBusinessOrganization}
              helperText={
                errors?.nameOfBusinessOrganization
                  ? errors.nameOfBusinessOrganization.message
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
              {...register("trnBussinessDetailsDao.propertyNo")}
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
              {...register("trnBussinessDetailsDao.propertyStatus")}
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
                name="trnBussinessDetailsDao.ownership"
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
              {...register("trnBussinessDetailsDao.totalAreaFt")}
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
                shrink: watch("trnBussinessDetailsDao.totalAreaM")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="totalAreaM"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.totalAreaM")}
              error={!!errors.totalAreaM}
              helperText={errors?.totalAreaM ? errors.totalAreaM.message : null}
            />
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ m: 1, minWidth: 120 }}
              error={errors.zoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="zonename" />}
                {/* Zone Name */}
              </InputLabel>
              <Controller
                name="zoneKey"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    sx={{ width: 250 }}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Zone Name"
                  >
                    {zoneNames?.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.id}>
                          {language == "en" ? item.zoneName : item.zoneNameMr}
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
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ m: 1, minWidth: 120 }}
              error={errors.subZoneKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="subZoneName" />}
                {/* Zone Name */}
              </InputLabel>
              <Controller
                name="subZoneKey"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    sx={{ width: 250 }}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Sub Zone Name"
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
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ m: 1, minWidth: 120 }}
              error={errors.areaKey}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="areaName" />}
                {/* Zone Name */}
              </InputLabel>
              <Controller
                name="areaKey"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    sx={{ width: 250 }}
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
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ m: 1, minWidth: 120 }}
              error={errors.status}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="status" />}
                {/* Zone Name */}
              </InputLabel>
              <Controller
                name="status"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    sx={{ width: 250 }}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Status"
                  >
                    {statusNames?.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.id}>
                          {language == "en" ? item.status : item.statusMr}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.status ? errors.status.message : null}
              </FormHelperText>
            </FormControl>
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
                name="trnBussinessDetailsDao.constructionType"
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
              {...register("trnBussinessDetailsDao.constructionAreaFt")}
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
                shrink: watch("trnBussinessDetailsDao.constructionAreaM")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="constructionAreaM"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.constructionAreaM")}
              error={!!errors.constructionAreaM}
              helperText={
                errors?.constructionAreaM
                  ? errors.constructionAreaM.message
                  : null
              }
            />
          </Grid>
          {/*   
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                disabled={disabled}
                sx={{ width: 250 }}
                id="standard-basic"
                placeholder="Example :- 08:30"
                label={<FormattedLabel id="workingHours"></FormattedLabel>}
                variant="standard"
                {...register("trnBussinessDetailsDao.workingHours")}
                error={!!errors.workingHours}
                helperText={
                  errors?.workingHours ? errors.workingHours.message : null
                }
              />
            </Grid> */}
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
          <FormattedLabel id="agencyAddress" />
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
                name="trnBussinessDetailsDao.numbertype"
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
              {...register("trnBussinessDetailsDao.citySurveyNo")}
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
              {...register("trnBussinessDetailsDao.plotNo")}
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
              {...register("trnBussinessDetailsDao.roadName")}
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
              {...register("trnBussinessDetailsDao.villageName")}
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
                shrink: watch("trnBussinessDetailsDao.prCityName")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="crCityName"></FormattedLabel>}
              variant="standard"
              {...register("trnBussinessDetailsDao.prCityName")}
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
                shrink: watch("trnBussinessDetailsDao.prState") ? true : false,
              }}
              label={<FormattedLabel id="crState"></FormattedLabel>}
              variant="standard"
              {...register("trnBussinessDetailsDao.prState")}
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
              {...register("trnBussinessDetailsDao.Pincode")}
              error={!!errors.Pincode}
              helperText={errors?.Pincode ? errors.Pincode.message : null}
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
          <FormattedLabel id="skySignDetails" />
        </div>
        <Grid
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ m: 1, minWidth: 120 }}
              error={errors.mediaType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="mediaType" />}
                {/* Zone Name */}
              </InputLabel>
              <Controller
                name="mediaType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    sx={{ width: 250 }}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Media Type"
                  >
                    {mediaTypes?.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.id}>
                          {language == "en" ? item.mediaType : item.mediaTypemr}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.mediaType ? errors.mediaType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ m: 1, minWidth: 120 }}
              error={errors.mediaSubType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="mediaSubType" />}
                {/* Zone Name */}
              </InputLabel>
              <Controller
                name="mediaSubType"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    sx={{ width: 250 }}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Zone Name"
                  >
                    {mediaSubTypes?.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.id}>
                          {language == "en"
                            ? item.mediaSubType
                            : item.mediaSubTypemr}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.mediaSubType ? errors.mediaSubType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl
              fullWidth
              variant="standard"
              size="small"
              sx={{ m: 1, minWidth: 120 }}
              error={errors.formOfAdvertisement}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="formOfAdvertisement" />}
                {/* Zone Name */}
              </InputLabel>
              <Controller
                name="formOfAdvertisement"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    // {...field}
                    sx={{ width: 250 }}
                    onChange={(value) => field.onChange(value)}
                    value={field.value}
                    // label={<FormattedLabel id="departmentName" required />}
                    label="Form Of Advertisement"
                  >
                    {formOfAdvertisements?.map((item, i) => {
                      return (
                        <MenuItem key={i} value={item.id}>
                          {language == "en"
                            ? item.formOfAdvertisement
                            : item.formOfAdvertisementMr}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              <FormHelperText style={{ color: "red" }}>
                {errors?.formOfAdvertisement
                  ? errors.formOfAdvertisement.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              InputLabelProps={{
                shrink: watch("trnBussinessDetailsDao.natureOfAdvertisement")
                  ? true
                  : false,
              }}
              label={
                <FormattedLabel id="natureOfAdvertisement"></FormattedLabel>
              }
              {...register("trnBussinessDetailsDao.natureOfAdvertisement")}
              error={!!errors.natureOfAdvertisement}
              helperText={
                errors?.natureOfAdvertisement
                  ? errors.natureOfAdvertisement.message
                  : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl flexDirection="row">
              <FormLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="isDisplayOfFreeBaner" />}
              </FormLabel>
              <Controller
                name="trnBussinessDetailsDao.isDisplayOfFreeBaner"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    selected={field.value}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      disabled={disabled}
                      error={!!errors?.fireEquirepment}
                      value="true"
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="yes" />}
                    />
                    <FormControlLabel
                      disabled={disabled}
                      error={!!errors?.fireEquirepment}
                      value="false"
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="no" />}
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors?.fireEquirepment}>
                {errors?.fireEquirepment
                  ? errors?.fireEquirepment?.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        {watch("trnBussinessDetailsDao.isDisplayOfFreeBaner") == "true" ? (
          <Grid
            container
            spacing={1}
            // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
            style={{ marginTop: "1vh", marginLeft: "5vh" }}
            columns={12}
          >
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <FormControl
                fullWidth
                variant="standard"
                size="small"
                sx={{ m: 1, minWidth: 120 }}
                error={errors.zoneKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="purpose" />}
                  {/* Zone Name */}
                </InputLabel>
                <Controller
                  name="purpose"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      // {...field}
                      sx={{ width: 250 }}
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

            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
                style={{ marginTop: 10, marginLeft: 35 }}
              >
                {/* <FormLabel id='demo-simple-select-standard-label'>
                                    {<FormattedLabel id="periodFrom"></FormattedLabel>}
                                </FormLabel> */}
                <Controller
                  sx={{ marginTop: 0 }}
                  control={control}
                  name="trnSiteVisitFormDao.periodFrom"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={disabled}
                        inputFormat="DD/MM/YYYY"
                        label={
                          <FormattedLabel id="periodFrom"></FormattedLabel>
                        }
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        // selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                // fontSize: 12,
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
                  {errors?.trnBussinessDetailsDao?.businessDate
                    ? errors.trnBussinessDetailsDao.businessDate.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <FormControl
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                }}
                style={{ marginTop: 10, marginLeft: 35 }}
              >
                {/* <FormLabel id='demo-simple-select-standard-label'>
                                    {<FormattedLabel id="periodTo"></FormattedLabel>}
                                </FormLabel> */}
                <Controller
                  sx={{ marginTop: 0 }}
                  control={control}
                  name="trnSiteVisitFormDao.periodTo"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        disabled={disabled}
                        inputFormat="DD/MM/YYYY"
                        label={<FormattedLabel id="periodTo"></FormattedLabel>}
                        value={field.value}
                        onChange={(date) => {
                          field.onChange(moment(date).format("YYYY-MM-DD"));
                        }}
                        // selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            fullWidth
                            InputLabelProps={{
                              style: {
                                // fontSize: 12,
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
                  {errors?.trnBussinessDetailsDao?.businessDate
                    ? errors.trnBussinessDetailsDao.businessDate.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <TextField
                disabled={disabled}
                // autoFocus
                id="standard-basic"
                InputLabelProps={{
                  shrink: watch("trnBussinessDetailsDao.noOfLocation")
                    ? true
                    : false,
                }}
                label={<FormattedLabel id="noOfLocation"></FormattedLabel>}
                {...register("trnBussinessDetailsDao.noOfLocation")}
                error={!!errors.constructionAreaM}
                helperText={
                  errors?.constructionAreaM
                    ? errors.constructionAreaM.message
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
                  shrink: watch("trnBussinessDetailsDao.categoryOfCivicMessage")
                    ? true
                    : false,
                }}
                label={
                  <FormattedLabel id="categoryOfCivicMessage"></FormattedLabel>
                }
                {...register("trnBussinessDetailsDao.categoryOfCivicMessage")}
                error={!!errors.constructionAreaM}
                helperText={
                  errors?.constructionAreaM
                    ? errors.constructionAreaM.message
                    : null
                }
              />
            </Grid>

            <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="isTrustRegistrationAttached" />}
                </FormLabel>
                <Controller
                  name="trnBussinessDetailsDao.isTrustRegistrationAttached"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        disabled={disabled}
                        error={!!errors?.fireEquirepment}
                        value="true"
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        disabled={disabled}
                        error={!!errors?.fireEquirepment}
                        value="false"
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.fireEquirepment}>
                  {errors?.fireEquirepment
                    ? errors?.fireEquirepment?.message
                    : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TextareaAutosize
                disabled={disabled}
                //  InputLabelProps={{ shrink: true }}
                aria-label="minimum height"
                minRows={3}
                placeholder="Text of Message On Free Banner"
                style={{ marginTop: 40, width: 1000 }}
                id="standard-basic"
                label="messageOfFreeBanner"
                {...register("trnSiteVisitFormDao.messageOfFreeBanner")}
                error={!!errors.remark}
                helperText={errors?.remark ? errors.remark.message : null}
              />
            </Grid>
          </Grid>
        ) : (
          ""
        )}

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
          <FormattedLabel id="dimensions" />
        </div>
        <Grid
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              InputLabelProps={{
                shrink: watch("trnBussinessDetailsDao.length") ? true : false,
              }}
              label={<FormattedLabel id="length"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.length")}
              error={!!errors.constructionAreaM}
              helperText={
                errors?.constructionAreaM
                  ? errors.constructionAreaM.message
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
                shrink: watch("trnBussinessDetailsDao.width") ? true : false,
              }}
              label={<FormattedLabel id="width"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.width")}
              error={!!errors.constructionAreaM}
              helperText={
                errors?.constructionAreaM
                  ? errors.constructionAreaM.message
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
                shrink: watch("trnBussinessDetailsDao.height") ? true : false,
              }}
              label={<FormattedLabel id="height"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.height")}
              error={!!errors.constructionAreaM}
              helperText={
                errors?.constructionAreaM
                  ? errors.constructionAreaM.message
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
                shrink: watch("trnBussinessDetailsDao.totalArea")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="totalArea"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.totalArea")}
              error={!!errors.constructionAreaM}
              helperText={
                errors?.constructionAreaM
                  ? errors.constructionAreaM.message
                  : null
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
          <FormattedLabel id="siteLocationDetails" />
        </div>
        <Grid
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              InputLabelProps={{
                shrink: watch("trnBussinessDetailsDao.siteLocation")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="siteLocation"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.siteLocation")}
              error={!!errors.siteLocation}
              helperText={
                errors?.siteLocation ? errors.siteLocation.message : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              InputLabelProps={{
                shrink: watch(
                  "trnBussinessDetailsDao.nameOfTheRoadDrawingVisibility"
                )
                  ? true
                  : false,
              }}
              label={
                <FormattedLabel id="nameOfTheRoadDrawingVisibility"></FormattedLabel>
              }
              {...register(
                "trnBussinessDetailsDao.nameOfTheRoadDrawingVisibility"
              )}
              error={!!errors.nameOfTheRoadDrawingVisibility}
              helperText={
                errors?.nameOfTheRoadDrawingVisibility
                  ? errors.nameOfTheRoadDrawingVisibility.message
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
                shrink: watch("trnBussinessDetailsDao.widthOfRoad")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="widthOfRoad"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.widthOfRoad")}
              error={!!errors.widthOfRoad}
              helperText={
                errors?.widthOfRoad ? errors.widthOfRoad.message : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              InputLabelProps={{
                shrink: watch(
                  "trnBussinessDetailsDao.noOfHoardingLocatedWithin25mtr"
                )
                  ? true
                  : false,
              }}
              label={
                <FormattedLabel id="noOfHoardingLocatedWithin25mtr"></FormattedLabel>
              }
              {...register(
                "trnBussinessDetailsDao.noOfHoardingLocatedWithin25mtr"
              )}
              error={!!errors.noOfHoardingLocatedWithin25mtr}
              helperText={
                errors?.noOfHoardingLocatedWithin25mtr
                  ? errors.noOfHoardingLocatedWithin25mtr.message
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
                shrink: watch("trnBussinessDetailsDao.noOfTrees")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="noOfTrees"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.noOfTrees")}
              error={!!errors.noOfTrees}
              helperText={errors?.noOfTrees ? errors.noOfTrees.message : null}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl flexDirection="row">
              <FormLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="isTreesRequired" />}
              </FormLabel>
              <Controller
                name="trnBussinessDetailsDao.isTreesRequired"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    selected={field.value}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      disabled={disabled}
                      error={!!errors?.fireEquirepment}
                      value="true"
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="yes" />}
                    />
                    <FormControlLabel
                      disabled={disabled}
                      error={!!errors?.fireEquirepment}
                      value="false"
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="no" />}
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors?.fireEquirepment}>
                {errors?.fireEquirepment
                  ? errors?.fireEquirepment?.message
                  : null}
              </FormHelperText>
            </FormControl>
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
          <FormattedLabel id="landlordDetails" />
        </div>
        <Grid
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // autoFocus
              id="standard-basic"
              InputLabelProps={{
                shrink: watch("trnBussinessDetailsDao.nameOfLandlord")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="nameOfLandlord"></FormattedLabel>}
              {...register("trnBussinessDetailsDao.nameOfLandlord")}
              error={!!errors.nameOfLandlord}
              helperText={
                errors?.nameOfLandlord ? errors.nameOfLandlord.message : null
              }
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl flexDirection="row">
              <FormLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="isNocOfLandlordSubmitted" />}
              </FormLabel>
              <Controller
                name="trnBussinessDetailsDao.isNocOfLandlordSubmitted"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    selected={field.value}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      disabled={disabled}
                      error={!!errors?.isNocOfLandlordSubmitted}
                      value="true"
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="yes" />}
                    />
                    <FormControlLabel
                      disabled={disabled}
                      error={!!errors?.isNocOfLandlordSubmitted}
                      value="false"
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="no" />}
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors?.fireEquirepment}>
                {errors?.fireEquirepment
                  ? errors?.fireEquirepment?.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl flexDirection="row">
              <FormLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="whetherDocumentsAreSubmitted" />}
              </FormLabel>
              <Controller
                name="trnBussinessDetailsDao.whetherDocumentsAreSubmitted"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    selected={field.value}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      disabled={disabled}
                      error={!!errors?.whetherDocumentsAreSubmitted}
                      value="true"
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="yes" />}
                    />
                    <FormControlLabel
                      disabled={disabled}
                      error={!!errors?.whetherDocumentsAreSubmitted}
                      value="false"
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="no" />}
                    />
                  </RadioGroup>
                )}
              />
              <FormHelperText error={!!errors?.fireEquirepment}>
                {errors?.fireEquirepment
                  ? errors?.fireEquirepment?.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </Main>
    </>
  );
};

export default SkysignInfo;
