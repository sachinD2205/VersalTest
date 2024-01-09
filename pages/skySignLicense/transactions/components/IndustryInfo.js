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

const IndustryInfo = (props) => {
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

  const router = useRouter();
  const [disabled, setDisabled] = useState(false);

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
        "trnIndustryDetailsDao.propertyNo",
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
            ?.sort((a, b) => a?.id - b?.id)
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // getSubZone based on zoneName
  const getSubZone = () => {
    if (watch("trnIndustryDetailsDao.zoneKey")) {
      axios
        .get(
          `${urls.SSLM}/mstSubZone/getSubZoneOnZoneKey?zoneKey=${watch(
            "trnIndustryDetailsDao.zoneKey"
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
    if (watch("trnIndustryDetailsDao.subZoneKey")) {
      axios
        .get(
          `${urls.SSLM}/mstSubZoneArea/getDataOnSubZone?subZonekey=${watch(
            "trnIndustryDetailsDao.subZoneKey"
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
    setValue("trnIndustryDetailsDao.prCityName", "Pimpri Chinchwad");
    setValue("trnIndustryDetailsDao.prState", "Maharashtra");
  }, []);

  useEffect(() => {
    getSubZone();
  }, [watch("trnIndustryDetailsDao.zoneKey")]);
  useEffect(() => {
    getAreaNames();
  }, [watch("trnIndustryDetailsDao.subZoneKey")]);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const convertFeetToMeter = (val) => {
    let temp = val * 0.09290304;
    return temp;
  };

  useEffect(() => {
    if (watch("trnIndustryDetailsDao.totalAreaFt")) {
      setValue(
        "trnIndustryDetailsDao.totalAreaM",
        convertFeetToMeter(watch("trnIndustryDetailsDao.totalAreaFt"))
      );
    }
    if (watch("trnIndustryDetailsDao.constructionAreaFt")) {
      setValue(
        "trnIndustryDetailsDao.constructionAreaM",
        convertFeetToMeter(watch("trnIndustryDetailsDao.constructionAreaFt"))
      );
    }
  }, [
    watch("trnIndustryDetailsDao.totalAreaFt"),
    watch("trnIndustryDetailsDao.constructionAreaFt"),
  ]);

  useEffect(() => {
    if (
      watch("trnIndustryDetailsDao.officeStaff") ||
      watch("trnIndustryDetailsDao.permanentEmployees") ||
      watch("trnIndustryDetailsDao.temporaryEmployees") ||
      watch("trnIndustryDetailsDao.contractualEmployees") ||
      watch("trnIndustryDetailsDao.totalEmployees")
    ) {
      let tempTotal = 0;
      tempTotal =
        Number(watch("trnIndustryDetailsDao.officeStaff")) +
        Number(watch("trnIndustryDetailsDao.permanentEmployees")) +
        Number(watch("trnIndustryDetailsDao.temporaryEmployees")) +
        Number(watch("trnIndustryDetailsDao.contractualEmployees"));
      console.log("temptotal", tempTotal);
      setValue("trnIndustryDetailsDao.totalEmployees", Number(tempTotal));
    }
  }, [
    watch("trnIndustryDetailsDao.officeStaff"),
    watch("trnIndustryDetailsDao.permanentEmployees"),
    watch("trnIndustryDetailsDao.temporaryEmployees"),
    watch("trnIndustryDetailsDao.contractualEmployees"),
    watch("trnIndustryDetailsDao.totalEmployees"),
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
          <FormattedLabel id="businessInfo" />
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
              label={<FormattedLabel id="nameOfIndustry"></FormattedLabel>}
              {...register("trnIndustryDetailsDao.nameOfIndustryOrganization")}
              error={!!errors.nameOfIndustryOrganization}
              helperText={
                errors?.nameOfIndustryOrganization
                  ? errors.nameOfIndustryOrganization.message
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
              {...register("trnIndustryDetailsDao.propertyNo")}
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
              {...register("trnIndustryDetailsDao.propertyStatus")}
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
                name="trnIndustryDetailsDao.ownership"
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
              {...register("trnIndustryDetailsDao.totalAreaFt")}
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
                shrink: watch("trnIndustryDetailsDao.totalAreaM")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="totalAreaM"></FormattedLabel>}
              {...register("trnIndustryDetailsDao.totalAreaM")}
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
                name="trnIndustryDetailsDao.zoneKey"
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
                name="trnIndustryDetailsDao.subZoneKey"
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
                {<FormattedLabel id="areaname" />}
              </InputLabel>
              <Controller
                name="trnIndustryDetailsDao.areaKey"
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

          {/* <Grid item
                xl={4}
                lg={4}
                md={4}
                sm={12}
                xs={12}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.licenseType}>
                  <InputLabel id='demo-simple-select-standard-label'>
                    {<FormattedLabel id="licenseType"></FormattedLabel>}
    
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='License Type *'
                      >
                        {licenseType &&
                          licenseType.map((licenseType, index) => (
                            <MenuItem key={index} value={licenseType.id}>
                              {licenseType.licenseType}
    
                              {language == 'en'
                                ?
                                licenseType?.licenseTypeEn
                                : licenseType?.licenseTypeMar}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='mstLicensetypekey'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {errors?.licenseType ? errors.licenseType.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
    
    */}
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.licenseType}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="industryType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Industry Type *"
                  >
                    {industryType &&
                      industryType.map((industryType, index) => (
                        <MenuItem key={index} value={industryType.id}>
                          {industryType.industryType}
                          {language == "en"
                            ? industryType?.industryTypeEn
                            : industryType?.industryTypeMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="trnIndustryDetailsDao.industryType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.industryType ? errors.industryType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
              <FormControl sx={{ marginTop: 2 }} error={!!errors.businessType}>
                <InputLabel id="demo-simple-select-standard-label">
                  {<FormattedLabel id="businessType"></FormattedLabel>}
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Business Type *"
                    >
                      {businessType &&
                        businessType.map((businessType, index) => (
                          <MenuItem key={index} value={businessType.id}>
                            {businessType.businessType}
                            {language == "en"
                              ? businessType?.businessTypeEn
                              : businessType?.businessTypeMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="trnIndustryDetailsDao.businessType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.businessType ? errors.businessType.message : null}
                </FormHelperText>
              </FormControl>
            </Grid> */}

          {/* <Grid item
                xl={4}
                lg={4}
                md={4}
                sm={12}
                xs={12}>
                <FormControl sx={{ marginTop: 2 }} error={!!errors.businessSubType}>
                  <InputLabel id='demo-simple-select-standard-label'>
                    {<FormattedLabel id="businessSubType"></FormattedLabel>}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={disabled}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label='Business Sub Type *'
                      >
                        {businessSubType &&
                          businessSubType.map((businessSubType, index) => (
                            <MenuItem key={index} value={businessSubType.id}>
                              {businessSubType.businessSubType}
                              {language == 'en'
                                ?
                                businessSubType?.businessSubTypeEn
                                : businessSubType?.businessSubTypeMar}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name='trnIndustryDetailsDao.businessSubType'
                    control={control}
                    defaultValue=''
                  />
                  <FormHelperText>
                    {errors?.businessSubType ? errors.businessSubType.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}
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
                name="trnIndustryDetailsDao.constructionType"
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
              {...register("trnIndustryDetailsDao.constructionAreaFt")}
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
                shrink: watch("trnIndustryDetailsDao.constructionAreaM")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="constructionAreaM"></FormattedLabel>}
              {...register("trnIndustryDetailsDao.constructionAreaM")}
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
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="machineCount"></FormattedLabel>}
              variant="standard"
              {...register("trnIndustryDetailsDao.machineCount")}
              error={!!errors.machineCount}
              helperText={
                errors?.machineCount ? errors.machineCount.message : null
              }
            />
          </Grid>
          {/*
              <Grid item
                xl={4}
                lg={4}
                md={4}
                sm={12}
                xs={12}>
                <TextField
                  disabled={disabled}
                  sx={{ width: 250 }}
                  id='standard-basic'
                  // label='Total number of machines in the industry*'
                  label={<FormattedLabel id="businessLocationTotalCountOfMachineries"></FormattedLabel>}
    
                  variant='standard'
                  {...register("trnIndustryDetailsDao.businessLocationTotalCountOfMachineries")}
                  error={!!errors.businessLocationTotalCountOfMachineries}
                  helperText={
                    errors?.businessLocationTotalCountOfMachineries
                      ? errors.businessLocationTotalCountOfMachineries.message
                      : null
                  }
                />
              </Grid> */}

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={disabled}
              sx={{ width: 250 }}
              id="standard-basic"
              placeholder="Example :- 08:30"
              label={<FormattedLabel id="workingHours"></FormattedLabel>}
              variant="standard"
              {...register("trnIndustryDetailsDao.workingHours")}
              error={!!errors.workingHours}
              helperText={
                errors?.workingHours ? errors.workingHours.message : null
              }
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  autoFocus
                  id='standard-basic'
                  label='Unit *'
                  {...register("unit")}
                  error={!!errors.unit}
                  helperText={
                    errors?.unit
                      ? errors.unit.message
                      : null
                  }
                />
              </Grid> */}
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ marginTop: 2 }}
        >
          {/* <FormControl sx={{ flexDirection: "row" }} style={{ marginTop: 10, marginLeft: 35 }}>
                <Controller
                  sx={{ marginTop: 0 }}
                  control={control}
                  name='trnIndustryDetailsDao.industryDate'
                  defaultValue={null}
                  render={({ field }) => (
    
                    <LocalizationProvider dateAdapter={AdapterMoment}>
     */}

          {/* {
                        <FormattedLabel id="industryDate" />
                        //  <span style={{ fontSize: 16 }}>
                        // If the company is still in operation, then the date of commencement of Industry?
                        //  </span>
                      } */}
          {/* <DatePicker
                        inputFormat='YYYY/MM/DD'
    
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        center
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            fullWidth
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                marginTop: 0,
                              },
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider> */}
          {/* )}
                />
              </FormControl> */}

          {/* <FormControl sx={{ display: "flex", flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }} style={{ marginTop: 10, marginLeft: 35 }}>
                          <FormLabel id='demo-simple-select-standard-label'>
                              {<FormattedLabel id="industryDate"></FormattedLabel>}
                          </FormLabel>
                          <Controller
                              sx={{ marginTop: 0 }}
  
                              control={control}
                              name='trnIndustryDetailsDao.businessDate'
                              defaultValue={null}
                              render={({ field }) => (
                                  <LocalizationProvider dateAdapter={AdapterMoment}>
                                      <DatePicker
                                          disabled={disabled}
                                          inputFormat='DD/MM/YYYY'
                                          // label={
                                          //   <FormattedLabel id="industryDate" />
  
                                          // }
                                          value={field.value}
                                          onChange={(date) => {
                                              field.onChange(moment(date).format("YYYY-MM-DD"));
  
                                          }}
                                          // selected={field.value}
                                          center
                                          renderInput={(params) => (
                                              <TextField
                                                  {...params}
                                                  size='small'
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
                              {errors?.trnIndustryDetailsDao?.businessDate ? errors.trnIndustryDetailsDao.businessDate.message : null}
                          </FormHelperText>
                      </FormControl> */}

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            sx={{ marginTop: 2 }}
          >
            {/* <FormControl sx={{ flexDirection: "row" }} style={{ marginTop: 10, marginLeft: 35 }}>
    
                  <Controller
                    control={control}
                    name='trnIndustryDetailsDao.temporarylicDate'
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        {<FormattedLabel id="temporarylicDate"></FormattedLabel>
                          // <span style={{ fontSize: 16 }}>
                          //  Date of issuance of temporary license subject to conditions in Notarized Guarantee 
                          // </span>
                        }
                        <DatePicker
                          sx={{ marginTop: 0 }}
                          inputFormat='YYYY/MM/DD'
    
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size='small'
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
                </FormControl> */}
            {/* <FormControl sx={{ display: "flex", flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }} style={{ marginTop: 10, marginLeft: 35 }}>
                              <FormLabel id='demo-simple-select-standard-label'>
                                  {<FormattedLabel id="temporarylicDate"></FormattedLabel>}
                              </FormLabel>
                              <Controller
                                  sx={{ marginTop: 0 }}
                                  control={control}
                                  name='trnIndustryDetailsDao.temporarylicDate'
                                  defaultValue={null}
                                  render={({ field }) => (
                                      <LocalizationProvider dateAdapter={AdapterMoment}>
                                     
  
                                          <DatePicker
                                              disabled={disabled}
                                              inputFormat='DD/MM/YYYY'
                                              // label={
                                              //   <FormattedLabel id="industryDate" />
  
                                              // }
                                              value={field.value}
                                              onChange={(date) => {
                                                  field.onChange(moment(date).format("YYYY-MM-DD"));
  
                                              }}
                                              // selected={field.value}
                                              center
                                              renderInput={(params) => (
                                                  <TextField
                                                      {...params}
                                                      size='small'
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
                                  {errors?.trnIndustryDetailsDao?.temporarylicDate ? errors.trnIndustryDetailsDao.temporarylicDate.message : null}
                              </FormHelperText>
                          </FormControl> */}
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
          <FormattedLabel id="employeeDetaills" />
        </div>

        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
        >
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
            <TextField
              disabled={disabled}
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="officeStaff"></FormattedLabel>}
              variant="standard"
              {...register("trnIndustryDetailsDao.officeStaff")}
              error={!!errors.officeStaff}
              helperText={
                errors?.officeStaff ? errors.officeStaff.message : null
              }
            />
          </Grid>
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
            <TextField
              disabled={disabled}
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="permanentEmployees"></FormattedLabel>}
              variant="standard"
              {...register("trnIndustryDetailsDao.permanentEmployees")}
              error={!!errors.permanentEmployees}
              helperText={
                errors?.permanentEmployees
                  ? errors.permanentEmployees.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
            <TextField
              disabled={disabled}
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="temporaryEmployees"></FormattedLabel>}
              variant="standard"
              {...register("trnIndustryDetailsDao.temporaryEmployees")}
              error={!!errors.temporaryEmployees}
              helperText={
                errors?.temporaryEmployees
                  ? errors.temporaryEmployees.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
            <TextField
              disabled={disabled}
              sx={{ width: 250 }}
              id="standard-basic"
              label={
                <FormattedLabel id="contractualEmployees"></FormattedLabel>
              }
              variant="standard"
              {...register("trnIndustryDetailsDao.contractualEmployees")}
              error={!!errors.contractualEmployees}
              helperText={
                errors?.contractualEmployees
                  ? errors.contractualEmployees.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
            <TextField
              // disabled={disabled}
              disabled
              sx={{ width: 250 }}
              id="standard-basic"
              InputLabelProps={{ shrink: true }}
              label={<FormattedLabel id="totalEmployees"></FormattedLabel>}
              variant="standard"
              {...register("trnIndustryDetailsDao.totalEmployees")}
              error={!!errors.totalEmployees}
              helperText={
                errors?.totalEmployees ? errors.totalEmployees.message : null
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
          <FormattedLabel id="businessaddress" />
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
                name="trnIndustryDetailsDao.numbertype"
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
              {...register("trnIndustryDetailsDao.citySurveyNo")}
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
              {...register("trnIndustryDetailsDao.plotNo")}
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
              {...register("trnIndustryDetailsDao.roadName")}
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
              {...register("trnIndustryDetailsDao.villageName")}
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
                shrink: watch("trnIndustryDetailsDao.prCityName")
                  ? true
                  : false,
              }}
              label={<FormattedLabel id="crCityName"></FormattedLabel>}
              variant="standard"
              {...register("trnIndustryDetailsDao.prCityName")}
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
                shrink: watch("trnIndustryDetailsDao.prState") ? true : false,
              }}
              label={<FormattedLabel id="crState"></FormattedLabel>}
              variant="standard"
              {...register("trnIndustryDetailsDao.prState")}
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
              {...register("trnIndustryDetailsDao.Pincode")}
              error={!!errors.Pincode}
              helperText={errors?.Pincode ? errors.Pincode.message : null}
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  sx={{ width: 250 }}
                  id='standard-basic'
                  label={<FormattedLabel id="machineCount"></FormattedLabel>}
                  variant='standard'
                  {...register("machineCount")}
                  error={!!errors.machineCount}
                  helperText={
                    errors?.machineCount
                      ? errors.machineCount.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                <TextField
                  sx={{ width: 250 }}
                  id='standard-basic'
                  // label='Total number of machines in the industry*'
                  label={<FormattedLabel id="businessLocationTotalCountOfMachineries"></FormattedLabel>}
    
                  variant='standard'
                  {...register("businessLocationTotalCountOfMachineries")}
                  error={!!errors.businessLocationTotalCountOfMachineries}
                  helperText={
                    errors?.businessLocationTotalCountOfMachineries
                      ? errors.businessLocationTotalCountOfMachineries.message
                      : null
                  }
                />
              </Grid> */}

          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    sx={{ width: 250 }}
                    id='standard-basic'
                    label='License Fees*'
                    variant='standard'
                    {...register("licenseFees")}
                    error={!!errors.licenseFees}
                    helperText={errors?.licenseFees ? errors.licenseFees.message : null}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    sx={{ width: 250 }}
                    id='standard-basic'
                    label='Penalty Fees *'
                    variant='standard'
                    {...register("penaltyFees")}
                    error={!!errors.penaltyFees}
                    helperText={errors?.penaltyFees ? errors.penaltyFees.message : null}
                  />
               </Grid>
               <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                  <TextField
                    sx={{ width: 250 }}
                    id='standard-basic'
                    label='Notice Fees*'
                    variant='standard'
                    {...register("noticeFees")}
                    error={!!errors.noticeFees}
                    helperText={
                      errors?.noticeFees
                        ? errors.noticeFees.message
                        : null
                    }
                  />
                 </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                            <FormControl style={{ marginTop: 10 }}>
                              <Controller
                                control={control}
                                name='licenseValidity '
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DatePicker
                                      inputFormat='YYYY/MM/DD'
                                      label={
                                        <span style={{ fontSize: 16 }}>
                                         License Validity 
                                        </span>
                                      }
                                      value={field.value}
                                      onChange={(date) => field.onChange(date)}
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size='small'
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
                            </FormControl>
                 </Grid> */}
        </Grid>
      </Main>
    </>
  );
};

export default IndustryInfo;
