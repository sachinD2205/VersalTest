import React, { useEffect, useState } from "react";
import router from "next/router";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import {
  useLanguage,
  useGetToken,
} from "../../../../../containers/reuseableComponents/CustomHooks";
import styles from "../../depositRefundProcess/deposit.module.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import axios from "axios";
import urls from "../../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const BookingDetails = ({ data }) => {
  const language = useLanguage();
  const userToken = useGetToken();

  //   const schema = yup.object().shape({});

  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [wardDropDown, setWardDropDown] = useState([]);

  const [venueDropDown, setVenueDropDown] = useState([]);
  const [facilityTypeDropDown, setFacilityTypeDropDown] = useState([]);
  const [facilitySubTypeDropDown, setFacilitySubTypeDropDown] = useState([]);
  const [durationTypeDropDown, setDurationTypeDropDown] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  useEffect(() => {
    //Get Zone
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setZoneDropDown(
          res.data.zone.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            zoneNameEn: j?.zoneName,
            zoneNameMr: j?.zoneNameMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Wards
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setWardDropDown(
          res.data.ward.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            wardNameEn: j?.wardName,
            wardNameMr: j?.wardNameMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Venue
    axios
      .get(`${urls.SPURL}/venueMasterSection/getAllYN`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setVenueDropDown(
          res.data.venueSection.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            venueNameEn: j?.venue,
            venueNameMr: j?.venueMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Facility Types
    axios
      .get(`${urls.SPURL}/facilityType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setFacilityTypeDropDown(
          res.data.facilityType.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            facilityTypeEn: j?.facilityType,
            facilityTypeMr: j?.facilityTypeMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });
    //Get Facility Sub-Types
    axios
      .get(`${urls.SPURL}/facilityName/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setFacilitySubTypeDropDown(
          res.data.facilityName.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            facilitySubTypeEn: j?.facilityName,
            facilitySubTypeMr: j?.facilityNameMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });

    //Get Duration Types
    axios
      .get(`${urls.SPURL}/master/durationType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setDurationTypeDropDown(
          res.data.durationType.map((j, i) => ({
            srNo: i + 1,
            id: j?.id,
            durationTypeEn: j?.typeName,
            durationTypeMr: j?.typeNameMr,
          }))
        );
      })
      .catch((error) => {
        catchExceptionHandlingMethod(error, language);
      });
  }, []);

  return (
    <>
      <div className={styles.subTitle}>
        <FormattedLabel id="bookingDetails" />
      </div>
      <div className={styles.fieldsWrapper}>
        <FormControl error={!!error.applicationDate}>
          <Controller
            control={control}
            name="applicationDate"
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disabled
                  inputFormat="dd/MM/yyyy"
                  label={<FormattedLabel id="applicationDate" />}
                  value={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: 275 }}
                      {...params}
                      size="small"
                      fullWidth
                      variant="standard"
                      error={!!error.applicationDate}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          <FormHelperText>
            {error?.applicationDate ? error.applicationDate.message : null}
          </FormHelperText>
        </FormControl>
        <FormControl disabled variant="standard" error={!!error.venue}>
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="venue" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                sx={{ width: 275 }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                // @ts-ignore
                value={field.value}
                onChange={(value) => field.onChange(value)}
                label="venue"
              >
                {venueDropDown &&
                  venueDropDown.map((value, index) => (
                    <MenuItem
                      key={index}
                      value={
                        //@ts-ignore
                        value.id
                      }
                    >
                      {language == "en"
                        ? //@ts-ignore
                          value.venueNameEn
                        : // @ts-ignore
                          value?.venueNameMr}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="venue"
            control={control}
            defaultValue=""
          />
          <FormHelperText>
            {error?.venue ? error.venue.message : null}
          </FormHelperText>
        </FormControl>
        <FormControl disabled variant="standard" error={!!error.facilityType}>
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="facilityType" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                sx={{ width: 275 }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                // @ts-ignore
                value={field.value}
                onChange={(value) => field.onChange(value)}
                label="facilityType"
              >
                {facilityTypeDropDown &&
                  facilityTypeDropDown.map((value, index) => (
                    <MenuItem
                      key={index}
                      value={
                        //@ts-ignore
                        value.id
                      }
                    >
                      {language == "en"
                        ? //@ts-ignore
                          value.facilityTypeEn
                        : // @ts-ignore
                          value?.facilityTypeMr}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="facilityType"
            control={control}
            defaultValue=""
          />
          <FormHelperText>
            {error?.facilityType ? error.facilityType.message : null}
          </FormHelperText>
        </FormControl>
        <FormControl disabled variant="standard" error={!!error.facilityName}>
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="facilityName" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                sx={{ width: 275 }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                // @ts-ignore
                value={field.value}
                onChange={(value) => field.onChange(value)}
                label="facilityName"
              >
                {facilitySubTypeDropDown &&
                  facilitySubTypeDropDown.map((value, index) => (
                    <MenuItem
                      key={index}
                      value={
                        //@ts-ignore
                        value.id
                      }
                    >
                      {language == "en"
                        ? //@ts-ignore
                          value?.facilitySubTypeEn
                        : // @ts-ignore
                          value?.facilitySubTypeMr}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="facilityName"
            control={control}
            defaultValue=""
          />
          <FormHelperText>
            {error?.facilityName ? error.facilityName.message : null}
          </FormHelperText>
        </FormControl>
        <FormControl disabled variant="standard" error={!!error.zoneName}>
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="zone" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                sx={{ width: 275 }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                // @ts-ignore
                value={field.value}
                onChange={(value) => field.onChange(value)}
                label="zoneName"
              >
                {zoneDropDown &&
                  zoneDropDown.map((value, index) => (
                    <MenuItem
                      key={index}
                      value={
                        //@ts-ignore
                        value.id
                      }
                    >
                      {language == "en"
                        ? //@ts-ignore
                          value.zoneNameEn
                        : // @ts-ignore
                          value?.zoneNameMr}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="zoneName"
            control={control}
            defaultValue=""
          />
          <FormHelperText>
            {error?.zoneName ? error.zoneName.message : null}
          </FormHelperText>
        </FormControl>
        <FormControl disabled variant="standard" error={!!error.wardName}>
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="ward" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                sx={{ width: 275 }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                // @ts-ignore
                value={field.value}
                onChange={(value) => field.onChange(value)}
                label="wardName"
              >
                {wardDropDown &&
                  wardDropDown.map((value, index) => (
                    <MenuItem
                      key={index}
                      value={
                        //@ts-ignore
                        value.id
                      }
                    >
                      {language == "en"
                        ? //@ts-ignore
                          value.wardNameEn
                        : // @ts-ignore
                          value?.wardNameMr}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="wardName"
            control={control}
            defaultValue=""
          />
          <FormHelperText>
            {error?.wardName ? error.wardName.message : null}
          </FormHelperText>
        </FormControl>
        <FormControl disabled variant="standard" error={!!error.durationType}>
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="durationType" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                sx={{ width: 275 }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                // @ts-ignore
                value={field.value}
                onChange={(value) => field.onChange(value)}
                label="durationType"
              >
                {durationTypeDropDown &&
                  durationTypeDropDown.map((value, index) => (
                    <MenuItem
                      key={index}
                      value={
                        //@ts-ignore
                        value.id
                      }
                    >
                      {language == "en"
                        ? //@ts-ignore
                          value.durationTypeEn
                        : // @ts-ignore
                          value?.durationTypeMr}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="durationType"
            control={control}
            defaultValue=""
          />
          <FormHelperText>
            {error?.durationType ? error.durationType.message : null}
          </FormHelperText>
        </FormControl>
      </div>
    </>
  );
};

export default BookingDetails;
