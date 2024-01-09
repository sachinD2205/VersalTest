import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import axios from "axios";
import urls from "../../../URLS/urls";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import HawkerReusableCSS from "../../../components/streetVendorManagementSystem/styles/hawkerReusableForAllComponents.module.css";
// oldHawkerDetailsTransferLicense
const OldHawkerDetailsTransferLicense = () => {
  const {
    control,
    register,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const userToken = useGetToken();
  const language = useSelector((state) => state?.labels.language);
  const [areaNames, setAreaName] = useState([]);
  const [hawkingZoneNames, setHawkingZoneName] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [titles, setTitles] = useState([]);
  const [genders, setGenders] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // getAreaName
  const getAreaName = () => {
    const url = `${urls.CFCURL}/master/area/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setAreaName(
            r?.data?.area?.map((row) => ({
              id: row?.id,
              areaName: row?.areaName,
              areaNameMr: row?.areaNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        //callCatchMethod(error, language);
      });
  };

  // getHawkingZoneName
  const getHawkingZoneName = () => {
    const url = `${urls.HMSURL}/hawingZone/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setHawkingZoneName(
            r?.data?.hawkingZone?.map((row) => ({
              id: row?.id,
              hawkingZoneName: row?.hawkingZoneName,
              hawkingZoneNameMr: row?.hawkingZoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        //callCatchMethod(error, language);
      });
  };

  // getZoneName
  const getZoneName = () => {
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
              zoneName: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        //callCatchMethod(error, language);
      });
  };

  // getWardName
  const getWardName = () => {
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
              wardName: row?.wardName,
              wardNameMr: row?.wardNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        //callCatchMethod(error, language);
      });
  };

  // getTitles
  const getTitles = () => {
    const url = `${urls.CFCURL}/master/title/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setTitles(
            r?.data?.title.map((row) => ({
              id: row?.id,
              title: row?.title,
              titleMr: row?.titleMr,
            }))
          );
        }
      })
      .catch((error) => {
        //callCatchMethod(error, language);
      });
  };

  // getGenders
  const getGenders = () => {
    const url = `${urls.CFCURL}/master/gender/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setGenders(
            r?.data?.gender.map((row) => ({
              id: row?.id,
              gender: row?.gender,
              genderMr: row?.genderMr,
            }))
          );
        }
      })
      .catch((error) => {
        //callCatchMethod(error, language);
      });
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

  // <====================================>  useEffect <=======================================>

  useEffect(() => {
    // setValue("loadderState", true);
    // loadderSetTimeOutFunction();
    getHawkingZoneName();
    getAreaName();
    getZoneName();
    getWardName();
    getTitles();
    getGenders();
  }, []);

  useEffect(() => {
    console.log("dateOfBirthOld", watch("dateOfBirthOld"));
  }, [watch("dateOfBirthOld")]);

  // view
  return (
    <>
      <div
      className={HawkerReusableCSS.MainHeader}
      >
        <strong><center>{<FormattedLabel id="oldStreetVendorDetails" />}</center></strong>
      </div>
      <Grid
        container
        className={HawkerReusableCSS.GridContainer}
      >
        {/** Zone Name */}
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <FormControl
            variant="standard"
            error={!!errors?.zoneNameOld}
            sx={{ marginTop: 2 }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="zoneName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id="zoneName" />
                >
                  {zoneNames &&
                    zoneNames.map((zoneName) => (
                      <MenuItem key={zoneName?.id} value={zoneName?.id}>
                        {language == "en"
                          ? zoneName?.zoneName
                          : zoneName?.zoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="zoneNameOld"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.zoneNameOld ? errors?.zoneNameOld?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/** ward Name */}
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <FormControl
            variant="standard"
            error={!!errors?.wardNameOld}
            sx={{ marginTop: 2 }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="wardName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label=<FormattedLabel id="wardName" />
                >
                  {wardNames &&
                    wardNames?.map((wardName, index) => (
                      <MenuItem key={wardName?.id} value={wardName?.id}>
                        {language == "en"
                          ? wardName?.wardName
                          : wardName?.wardNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="wardNameOld"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.wardNameOld ? errors?.wardNameOld?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <TextField
            label={<FormattedLabel id="citySurveyNo" />}
            disabled
            {...register("citySurveyNoOld")}
            error={!!errors?.citySurveyNoOld}
            helperText={
              errors?.citySurveyNoOld ? errors?.citySurveyNoOld?.message : null
            }
          />
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <FormControl
            variant="standard"
            error={!!errors?.hawkingZoneNameOld}
            sx={{ marginTop: 2 }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="hawkingZoneName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="hawkingZoneName *"
                >
                  {hawkingZoneNames &&
                    hawkingZoneNames.map((hawkingZoneName, index) => (
                      <MenuItem key={index} value={hawkingZoneName.id}>
                        {language == "en"
                          ? hawkingZoneName?.hawkingZoneName
                          : hawkingZoneName?.hawkingZoneNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="hawkingZoneNameOld"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.hawkingZoneNameOld
                ? errors?.hawkingZoneNameOld?.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors?.areaNameOld}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="areaName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="areaName" />}
                >
                  {areaNames &&
                    areaNames.map((areaName, index) => (
                      <MenuItem key={index} value={areaName.id}>
                        {language == "en"
                          ? areaName?.areaName
                          : areaName?.areaNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="areaNameOld"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.areaNameOld ? errors?.areaNameOld?.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <FormControl error={!!errors.titleOld} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="title" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="title" />}
                  id="demo-simple-select-standard"
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {titles &&
                    titles.map((title, index) => (
                      <MenuItem key={index} value={title.id}>
                        {language == "en" ? title?.title : title?.titleMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="titleOld"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.titleOld ? errors.titleOld.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <TextField
            id="standard-basic"
            disabled
            label={<FormattedLabel id="firstName" />}
            {...register("firstNameOld")}
            error={!!errors.firstNameOld}
            helperText={
              errors?.firstNameOld ? errors.firstNameOld.message : null
            }
          />
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <TextField
            id="standard-basic"
            disabled
            label={<FormattedLabel id="middleName" />}
            {...register("middleNameOld")}
            error={!!errors.middleNameOld}
            helperText={
              errors?.middleNameOld ? errors.middleNameOld.message : null
            }
          />
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <TextField
            id="standard-basic"
            disabled
            label={<FormattedLabel id="lastName" />}
            {...register("lastNameOld")}
            error={!!errors.lastNameOld}
            helperText={errors?.lastNameOld ? errors.lastNameOld.message : null}
          />
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.genderOld}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="gender" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="gender" />}
                >
                  {genders &&
                    genders.map((gender, index) => (
                      <MenuItem key={index} value={gender.id}>
                        {language == "en" ? gender?.gender : gender?.genderMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="genderOld"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.genderOld ? errors.genderOld.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <FormControl error={!!errors.dateOfBirthOld} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="dateOfBirthOld"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    maxDate={moment(new Date())
                      .subtract(18, "years")
                      .calendar()}
                    // minDate={new Date()}
                    disabled
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16, marginTop: 2 }}>
                        {<FormattedLabel id="dateOfBirth" />}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("DD-MM-YYYY"));
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
              {errors?.dateOfBirthOld ? errors.dateOfBirthOld.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <TextField
            disabled
            size="3"
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="age" />}
            {...register("ageOld")}
            error={!!errors.ageOld}
            helperText={errors?.ageOld ? errors.ageOld.message : null}
          />
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <TextField
            id="standard-basic"
            disabled
            label={<FormattedLabel id="mobile" />}
            {...register("mobileOld")}
            error={!!errors.mobileOld}
            helperText={errors?.mobileOld ? errors.mobileOld.message : null}
          />
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>
          <TextField
            id="standard-basic"
            disabled
            label={<FormattedLabel id="emailAddress" />}
            {...register("emailAddressOld")}
            error={!!errors.emailAddressOld}
            helperText={
              errors?.emailAddressOld ? errors.emailAddressOld.message : null
            }
          />
        </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>  </Grid>
        <Grid  item
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={3}
        className={HawkerReusableCSS.GridItemCenter}>  </Grid>
        
      </Grid>
    </>
  );
};

export default OldHawkerDetailsTransferLicense;
