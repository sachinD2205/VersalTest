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
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../components/view.module.css";

// http://localhost:4000/hawkerManagementSystem/transactions/components/HawkerDetails
const HawkerDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  // Titles
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setTitles(
          r.data.map((row) => ({
            id: row.id,
            title: row.title,
          })),
        );
      });
  };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setGenders(
          r.data.map((row) => ({
            id: row.id,
            gender: row.gender,
          })),
        );
      });
  };

  // casts
  const [casts, setCasts] = useState([]);

  // getCasts
  const getCasts = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setCasts(
          r.data.map((row) => ({
            id: row.id,
            cast: row.cast,
          })),
        );
      });
  };

  // Religions
  const [religions, setReligions] = useState([]);

  // getReligions
  const getReligions = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setReligions(
          r.data.map((row) => ({
            id: row.id,
            religion: row.religion,
          })),
        );
      });
  };

  // subCasts
  const [subCasts, setSubCast] = useState([]);

  // getSubCast
  const getSubCast = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setSubCast(
          r.data.map((row) => ({
            id: row.id,
            subCast: row.subCast,
          })),
        );
      });
  };

  // typeOfDisabilitys
  const [typeOfDisabilitys, setTypeOfDisability] = useState([]);

  // getTypeOfDisability
  const getTypeOfDisability = () => {
    axios
      .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
      .then((r) => {
        setTypeOfDisability(
          r.data.map((row) => ({
            id: row.id,
            typeOfDisability: row.typeOfDisability,
          })),
        );
      });
  };

  // useEffect
  useEffect(() => {
    getTitles();
    getTypeOfDisability();
    getGenders();
    getCasts();
    getSubCast();
    getReligions();
  }, []);

  return (
    <>
      {/** First Row */}
      <div className={styles.small}>
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.title}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Title *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 100 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Title *'
                  >
                    {titles &&
                      titles.map((title, index) => (
                        <MenuItem key={index} value={title.id}>
                          {title.title}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='title'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.title ? errors.title.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='First Name *'
              variant='standard'
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={errors?.firstName ? errors.firstName.message : null}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='Middle Name'
              variant='standard'
              {...register("middleName")}
            />
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='Surname / Last Name *'
              variant='standard'
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={errors?.lastName ? errors.lastName.message : null}
            />
          </div>
        </div>

        {/** Second Row */}
        <div className={styles.row}>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.gender}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Gender *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Gender *'
                  >
                    {genders &&
                      genders.map((gender, index) => (
                        <MenuItem key={index} value={gender.id}>
                          {gender.gender}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='gender'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.gender ? errors.gender.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.religion}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Religion *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Religion *'
                  >
                    {religions &&
                      religions.map((religion, index) => (
                        <MenuItem key={index} value={religion.id}>
                          {religion.religion}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='religion'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.religion ? errors.religion.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.cast}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Cast *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Cast *'
                  >
                    {casts &&
                      casts.map((cast, index) => (
                        <MenuItem key={index} value={cast.id}>
                          {cast.cast}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='cast'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.cast ? errors.cast.message : null}
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
              error={!!errors.subCast}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Sub Cast *
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Sub Cast *'
                  >
                    {subCasts &&
                      subCasts.map((subCast, index) => (
                        <MenuItem key={index} value={subCast.id}>
                          {subCast.subCast}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='subCast'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.subCast ? errors.subCast.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <FormControl style={{ marginTop: 10 }} error={!!errors.dateOfBirth}>
              <Controller
                control={control}
                name='dateOfBirth'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='DD/MM/YYYY'
                      label={
                        <span style={{ fontSize: 16 }}>Date of Birth *</span>
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
                {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              disabled
              sx={{ width: 250 }}
              id='standard-basic'
              label='Age *'
              variant='standard'
              {...register("age")}
              error={!!errors.age}
              helperText={errors?.age ? errors.age.message : null}
            />
          </div>
        </div>
        {/** Fourth Row */}
        <div className={styles.row}>
          <div>
            <FormControl>
              <FormLabel id='demo-controlled-radio-buttons-group'>
                Disbality *
              </FormLabel>
              <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group'>
                <FormControlLabel
                  value='Yes'
                  control={<Radio />}
                  label='Yes'
                  name='disbality'
                  {...register("disbality")}
                  error={!!errors.disbality}
                  helperText={
                    errors?.disbality ? errors.disbality.message : null
                  }
                />
                <FormControlLabel
                  value='NO'
                  control={<Radio />}
                  label='NO'
                  name='disbality'
                  {...register("disbality")}
                  error={!!errors.disbality}
                  helperText={
                    errors?.disbality ? errors.disbality.message : null
                  }
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div>
            <FormControl
              variant='standard'
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.typeOfDisability}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                Type of Disability
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Type of Disability'
                  >
                    {typeOfDisabilitys &&
                      typeOfDisabilitys.map((typeOfDisability, index) => (
                        <MenuItem key={index} value={typeOfDisability.id}>
                          {typeOfDisability.typeOfDisability}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='typeOfDisability'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.typeOfDisability
                  ? errors.typeOfDisability.message
                  : null}
              </FormHelperText>
            </FormControl>
          </div>
          <div>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label='Mobile No. *'
              variant='standard'
              {...register("mobile")}
              error={!!errors.mobile}
              helperText={errors?.mobile ? errors.mobile.message : null}
            />
          </div>
        </div>
        {/** Sixth  Row */}
        <div className={styles.row}>
          <div>
            <div>
              <TextField
                sx={{ width: 250 }}
                id='standard-basic'
                label='Email Address *'
                variant='standard'
                {...register("emailAddress")}
                error={!!errors.emailAddress}
                helperText={
                  errors?.emailAddress ? errors.emailAddress.message : null
                }
              />
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default HawkerDetails;
