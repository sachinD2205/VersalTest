import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../components/view.module.css";

// http://localhost:4000/hawkerManagementSystem/transactions/components/AddressOfHawker
const AddressOfHawker = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  // crAreaNames
  const [crAreaNames, setCRAreaName] = useState([]);

  // getAreaName
  const getCRAreaName = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setCRAreaName(
          r.data.map((row) => ({
            id: row.id,
            crAreaName: row.crAreaName,
          })),
        );
      });
  };

  // crLandmarkNames
  const [crLandmarkNames, setCrLandmark] = useState([]);

  // getCrLandmark
  const getCrLandmark = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setCrLandmark(
          r.data.map((row) => ({
            id: row.id,
            crLandmarkName: row.crLandmarkName,
          })),
        );
      });
  };

  // crVillageNames
  const [crVillageNames, setCrVilageNames] = useState([]);

  // getCrVillageNames
  const getCrVillageNames = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setCrVilageNames(
          r.data.map((row) => ({
            id: row.id,
            crVillageName: row.crVillageName,
          })),
        );
      });
  };

  // crPincodes
  const [crPincodes, setCrPinCodes] = useState([]);

  // getCrPinCodes
  const getCrPinCodes = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setCrPinCodes(
          r.data.map((row) => ({
            id: row.id,
            crPincode: row.crPincode,
          })),
        );
      });
  };

  // Address Change
  const addressChange = (e) => {
    alert(e.target.value);
  };

  // crAreaNames
  const [prAreaNames, setprAreaName] = useState([]);

  // getAreaName
  const getprAreaName = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setprAreaName(
          r.data.map((row) => ({
            id: row.id,
            prAreaName: row.prAreaName,
          })),
        );
      });
  };

  // crLandmarkNames
  const [prLandmarkNames, setprLandmark] = useState([]);

  // getCrLandmark
  const getprLandmark = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setprLandmark(
          r.data.map((row) => ({
            id: row.id,
            prLandmarkName: row.prLandmarkName,
          })),
        );
      });
  };

  // crVillageNames
  const [prVillageNames, setprVilageNames] = useState([]);

  // getCrVillageNames
  const getprVillageNames = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setprVilageNames(
          r.data.map((row) => ({
            id: row.id,
            prVillageName: row.prVillageName,
          })),
        );
      });
  };

  // crPincodes
  const [prPincodes, setprPinCodes] = useState([]);

  // getCrPinCodes
  const getprPinCodes = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setprPinCodes(
          r.data.map((row) => ({
            id: row.id,
            prPincode: row.prPincode,
          })),
        );
      });
  };

  // useEffect
  useEffect(() => {
    getCrLandmark();
    getCRAreaName();
    getCrVillageNames();
    getCrPinCodes();
    getprLandmark();
    getprAreaName();
    getprVillageNames();
    getprPinCodes();
  }, []);

  return (
    <>
      {/** First Row */}
      <div className={styles.small}>
        <div className={styles.row}>
          <h1>
            <Typography>Current Address of Hawker</Typography>
          </h1>
        </div>

        {/** Second Row */}
        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='City Survey Number *'
              variant='standard'
              {...register("crCitySurveyNumber")}
              error={!!errors.crCitySurveyNumber}
              helperText={
                errors?.crCitySurveyNumber
                  ? errors.crCitySurveyNumber.message
                  : null
              }
            />
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.crAreaName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Area Name *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Area Name *'
                  >
                    {crAreaNames &&
                      crAreaNames.map((crAreaName, index) => (
                        <MenuItem key={index} value={crAreaName.id}>
                          {crAreaName.crAreaName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='crAreaName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.crAreaName ? errors.crAreaName.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.crLandmarkName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Landmark Name *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Landmark Name *'
                  >
                    {crLandmarkNames &&
                      crLandmarkNames.map((crLandmarkName, index) => (
                        <MenuItem key={index} value={crLandmarkName.id}>
                          {crLandmarkName.crLandmarkName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='crLandmarkName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.crLandmarkName ? errors.crLandmarkName.message : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
        {/** Third Row */}
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.crVillageName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Village Name *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Village Name *'
                  >
                    {crVillageNames &&
                      crVillageNames.map((crVillageName, index) => (
                        <MenuItem key={index} value={crVillageName.id}>
                          {crVillageName.crVillageName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='crVillageName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.crVillageName ? errors.crVillageName.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              disabled
              defaultValue={"Pimpri Chinchwad"}
              label='City Name *'
              variant='standard'
              {...register("crCityName")}
              error={!!errors.crCityName}
              helperText={errors?.crCityName ? errors.crCityName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              disabled
              defaultValue={"Maharashtra"}
              label='State *'
              variant='standard'
              {...register("crState")}
              error={!!errors.crState}
              helperText={errors?.crState ? errors.crState.message : null}
            />
          </div>
        </div>
        {/** Fourth Row */}
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.crPincode}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Pin Code *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Pin Code *'
                  >
                    {crPincodes &&
                      crPincodes.map((crPincode, index) => (
                        <MenuItem key={index} value={crPincode.id}>
                          {crPincode.crPincode}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='crPincode'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.crPincode ? errors.crPincode.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='Lattitude *'
              variant='standard'
              {...register("crLattitude")}
              error={!!errors.crLattitude}
              helperText={
                errors?.crLattitude ? errors.crLattitude.message : null
              }
            />
          </div>
          <div></div>
        </div>
        {/** Fifth Row */}
        <div className={styles.row}>
          <h1>
            <Typography> Permanent / Postal Address of Hawker </Typography>
          </h1>
        </div>
        {/** Sixth  Row */}
        <div className={styles.row2}>
          <div sx={{ marginLeft: 50 }}>
            <b>
              <FormControlLabel
                control={<Checkbox />}
                label='Permanent Address as the Correspondence Address'
                {...register("addressCheckBox")}
                onChange={(e) => {
                  addressChange(e);
                }}
              />
            </b>
          </div>
        </div>
        {/** Eight Row */}
        <div className={styles.row}>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='City Survey Number *'
              variant='standard'
              {...register("prCitySurveyNumber")}
              error={!!errors.prCitySurveyNumber}
              helperText={
                errors?.prCitySurveyNumber
                  ? errors.prCitySurveyNumber.message
                  : null
              }
            />
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.prAreaName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Area Name *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Area Name *'
                  >
                    {prAreaNames &&
                      prAreaNames.map((prAreaName, index) => (
                        <MenuItem key={index} value={prAreaName.id}>
                          {prAreaName.prAreaName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='prAreaName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.prAreaName ? errors.prAreaName.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.prLandmarkName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Landmark Name *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Landmark Name *'
                  >
                    {prLandmarkNames &&
                      prLandmarkNames.map((prLandmarkName, index) => (
                        <MenuItem key={index} value={prLandmarkName.id}>
                          {prLandmarkName.prLandmarkName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='prLandmarkName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.prLandmarkName ? errors.prLandmarkName.message : null}
              </FormHelperText>
            </FormControl>
          </div>
        </div>
        {/** Nine Row */}
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.prVillageName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Village Name *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Village Name *'
                  >
                    {prVillageNames &&
                      prVillageNames.map((prVillageName, index) => (
                        <MenuItem key={index} value={prVillageName.id}>
                          {prVillageName.prVillageName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='prVillageName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.prVillageName ? errors.prVillageName.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              disabled
              defaultValue={"Pimpri Chinchwad"}
              label='City Name *'
              variant='standard'
              {...register("prCityName")}
              error={!!errors.prCityName}
              helperText={errors?.prCityName ? errors.prCityName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              disabled
              defaultValue={"Maharashtra"}
              label='State *'
              variant='standard'
              {...register("prState")}
              error={!!errors.prState}
              helperText={errors?.prState ? errors.prState.message : null}
            />
          </div>
        </div>
        {/** Ten Row */}
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.prPincode}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Pin Code *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Pin code *'
                  >
                    {prPincodes &&
                      prPincodes.map((prPincode, index) => (
                        <MenuItem key={index} value={prPincode.id}>
                          {prPincode.prPincode}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='prPincode'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.prPincode ? errors.prPincode.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='Lattitude *'
              variant='standard'
              {...register("prLattitude")}
              error={!!errors.prLattitude}
              helperText={
                errors?.prLattitude ? errors.prLattitude.message : null
              }
            />
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default AddressOfHawker;
