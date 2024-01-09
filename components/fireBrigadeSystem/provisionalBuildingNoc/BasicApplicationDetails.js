import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";

const BasicApplicationDetails = () => {
  const {
    control,
    register,
    getValues,
    reset,
    setValue,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [areaNames, setAreaName] = useState([]);
  const [serviceNames, setServiceNames] = useState([]);
  const [hawkingZoneNames, setHawkingZoneName] = useState([]);

  const inputState = getValues("inputState");

  // crAreaNames

  // getAreaName
  const getAreaName = () => {
    axios.get(`${urls.CFCURL}/master/area/getAll`).then((r) => {
      setAreaName(
        r.data.area.map((row) => ({
          id: row.id,
          areaName: row.areaName,
          areaNameMr: row.areaNameMr,
        })),
      );
    });
  };

  // getserviceNames
  const getserviceNames = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceName: row.serviceName,
          serviceNameMr: row.serviceNameMr,
        })),
      );
    });
  };

  // getserviceNames
  const getHawkingZoneName = () => {
    axios.get(`${urls.HMSURL}/hawingZone/getAll`).then((r) => {
      setHawkingZoneName(
        r.data.hawkingZone.map((row) => ({
          id: row.id,
          hawkingZoneName: row.hawkingZoneName,
          hawkingZoneNameMr: row.hawkingZoneNameMr,
        })),
      );
    });
  };

  // useEffect
  useEffect(() => {
    getserviceNames();
    getHawkingZoneName();
    getAreaName();
  }, []);

  return (
    <>
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
        <strong>{<FormattedLabel id='basicApplicationDetails' />}</strong>
      </div>
      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
          paddingLeft: "60px",
          display: "flex",
          justifyContent: "center",
          align: "center",
        }}
      >
        {/** 
        <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
          <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
            <InputLabel id='demo-simple-select-standard-label'>
              {<FormattedLabel id='serviceName' />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: "50vh" }}
                  disabled={inputState}
                  autoFocus
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label='Service Name *'
                  id='demo-simple-select-standard'
                  labelId="id='demo-simple-select-standard-label'"
                >
                  {serviceNames &&
                    serviceNames.map((serviceName, index) => (
                      <MenuItem key={index} value={serviceName.id}>
                        {language == "en"
                          ? serviceName?.serviceName
                          : serviceName?.serviceNameMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name='serviceName'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.serviceName ? errors.serviceName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        */}
        {/** 
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            id='standard-basic'
            label={<FormattedLabel id='applicationNumber' />}
            disabled
            defaultValue='23848494848'
            {...register("applicationNumber")}
            error={!!errors.applicationNumber}
            helperText={
              errors?.applicationNumber
                ? errors.applicationNumber.message
                : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl
            error={!!errors.applicationDate}
            sx={{ marginTop: 0 }}
            // sx={{ border: "solid 1px yellow" }}
          >
            <Controller
              control={control}
              name='applicationDate'
              defaultValue={Date.now()}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled
                    inputFormat='DD/MM/YYYY'
                    label={
                      <span style={{ fontSize: 16 }}>
                        {<FormattedLabel id='applicationDate' />}
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
            <FormHelperText>
              {errors?.applicationDate ? errors.applicationDate.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label={<FormattedLabel id='citySurveyNo' />}
            disabled={inputState}
            {...register("citySurveyNo")}
            error={!!errors.citySurveyNo}
            helperText={
              errors?.citySurveyNo ? errors.citySurveyNo.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl
            variant='standard'
            error={!!errors.hawkingZoneName}
            sx={{ marginTop: 2 }}
          >
            <InputLabel id='demo-simple-select-standard-label'>
              {<FormattedLabel id='hawkingZoneName' />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label='hawkingZoneName *'
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
              name='hawkingZoneName'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.hawkingZoneName ? errors.hawkingZoneName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.areaName}>
            <InputLabel id='demo-simple-select-standard-label'>
              {<FormattedLabel id='areaName' />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id='areaName' />}
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
              name='areaName'
              control={control}
              defaultValue=''
            />
            <FormHelperText>
              {errors?.areaName ? errors.areaName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}></Grid>
      </Grid>
    </>
  );
};

export default BasicApplicationDetails;
