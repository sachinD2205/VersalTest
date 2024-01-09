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
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

const HawkerDetails = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  // {
  // criteriaMode: "all",
  // resolver: yupResolver(HawkerDetailsSchema),
  // mode: "onChange",
  // }
  const userToken = useGetToken();

  const inputState = getValues("inputState");

  const language = useSelector((state) => state?.labels.language);

  // Titles
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setTitles(
          r.data.title.map((row) => ({
            id: row.id,
            title: row.title,
            titleMr: row.titleMr,
          }))
        );
      });
  };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setGenders(
          r.data.gender.map((row) => ({
            id: row.id,
            gender: row.gender,
            genderMr: row.genderMr,
          }))
        );
      });
  };

  // casts
  const [casts, setCasts] = useState([]);

  // getCasts
  const getCasts = () => {
    axios
      .get(`${urls.CFCURL}/master/cast/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setCasts(
          r.data.mCast.map((row) => ({
            id: row.id,
            cast: row.cast,
            castMr: row.castMr,
          }))
        );
      });
  };

  // Religions
  const [religions, setReligions] = useState([]);

  // getReligions
  const getReligions = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          }))
        );
      });
  };

  // subCasts
  const [subCasts, setSubCast] = useState([]);

  // getSubCast
  const getSubCast = () => {
    axios
      .get(`${urls.CFCURL}/master/subCast/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setSubCast(
          r.data.subCast.map((row) => ({
            id: row.id,
            subCast: row.subCast,
            subCastMr: row.subCastMr,
          }))
        );
      });
  };

  // typeOfDisabilitys
  const [typeOfDisabilitys, setTypeOfDisability] = useState([]);

  // getTypeOfDisability
  const getTypeOfDisability = () => {
    axios
      .get(`${urls.CFCURL}/master/typeOfDisability/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setTypeOfDisability(
          r.data.typeOfDisability.map((row) => ({
            id: row.id,
            typeOfDisability: row.typeOfDisability,
            typeOfDisabilityMr: row.typeOfDisabilityMr,
          }))
        );
      });
  };

  // Religions
  const [applicantTypes, setApplicantTypes] = useState([]);

  // getGenders
  const getApplicants = () => {
    axios
      .get(`${urls.HMSURL}/mstStreetVendorApplicantCategory/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setApplicantTypes(
          r.data.streetVendorApplicantCategory.map((row) => ({
            id: row.id,
            applicantType: row.type,
            applicantTypeMr: row.typeMr,
          }))
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
    getApplicants();
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
        <>
          <strong>{<FormattedLabel id="hawkerDetails" />}</strong>
        </>
      </div>

      <Grid
        container
        sx={{
          marginTop: 1,
          marginBottom: 5,
          paddingLeft: "50px",
          align: "center",
        }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="title" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
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
              name="title"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.title ? errors.title.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled={inputState}
            label={<FormattedLabel id="firstName" />}
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors?.firstName ? errors.firstName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled={inputState}
            label={<FormattedLabel id="middleName" />}
            {...register("middleName")}
            error={!!errors.middleName}
            helperText={errors?.middleName ? errors.middleName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled={inputState}
            label={<FormattedLabel id="lastName" />}
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors?.lastName ? errors.lastName.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.gender}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="gender" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
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
              name="gender"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.gender ? errors.gender.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.religion}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="religion" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="religion" />}
                >
                  {religions &&
                    religions.map((religion, index) => (
                      <MenuItem key={index} value={religion.id}>
                        {language == "en"
                          ? religion?.religion
                          : religion?.religionMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="religion"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.religion ? errors.religion.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.cast}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="caste" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="caste" />}
                >
                  {casts &&
                    casts.map((caste, index) => (
                      <MenuItem key={index} value={caste.id}>
                        {language == "en" ? caste?.cast : caste?.castMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="cast"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.cast ? errors.cast.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.subCast}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="subCast" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="subCast" />}
                >
                  {subCasts &&
                    subCasts.map((subCaste, index) => (
                      <MenuItem key={index} value={subCaste.id}>
                        {language == "en"
                          ? subCaste?.subCast
                          : subCaste?.subCastMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="subCast"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.subCast ? errors.subCast.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
            <Controller
              control={control}
              name="dateOfBirth"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={inputState}
                    inputFormat="DD/MM/YYYY"
                    label={
                      <span style={{ fontSize: 16, marginTop: 2 }}>
                        {<FormattedLabel id="dateOfBirth" />}
                      </span>
                    }
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(moment(date).format("YYYY-MM-DD"));
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
              {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={inputState}
            size="3"
            InputLabelProps={{ shrink: true }}
            id="standard-basic"
            label={<FormattedLabel id="age" />}
            {...register("age")}
            error={!!errors.age}
            helperText={errors?.age ? errors.age.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled={inputState}
            label={<FormattedLabel id="mobile" />}
            {...register("mobile")}
            error={!!errors.mobile}
            helperText={errors?.mobile ? errors.mobile.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            disabled={inputState}
            label={<FormattedLabel id="emailAddress" />}
            {...register("emailAddress")}
            error={!!errors.emailAddress}
            helperText={
              errors?.emailAddress ? errors.emailAddress.message : null
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={inputState}
            id="standard-basic"
            label={<FormattedLabel id="rationCardNo" />}
            {...register("rationCardNo")}
            error={!!errors.rationCardNo}
            helperText={
              errors?.rationCardNo ? errors.rationCardNo.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.applicantType}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="applicantType" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="applicantType" />}
                >
                  {applicantTypes &&
                    applicantTypes.map((applicantType, index) => (
                      <MenuItem key={index} value={applicantType.id}>
                        {language == "en"
                          ? applicantType?.applicantType
                          : applicantType?.applicantTypeMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="applicantType"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.applicantType ? errors.applicantType.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        {/**  <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
          <FormControl flexDirection='row'>
            <FormLabel id='demo-row-radio-buttons-group-label'>
              {<FormattedLabel id='disability' />}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby='demo-row-radio-buttons-group-label'
              name='row-radio-buttons-group'
            >
              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id='yes' />}
                name='disbality'
                {...register("disbality")}
                error={!!errors.disbality}
                helperText={errors?.disbality ? errors.disbality.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id='no' />}
                name='disbality'
                {...register("disbality")}
                error={!!errors.disbality}
                helperText={errors?.disbality ? errors.disbality.message : null}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
                    */}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl sx={{ marginTop: 2 }} error={!!errors.typeOfDisability}>
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="typeOfDisability" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  disabled={inputState}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="typeOfDisability" />}
                >
                  {typeOfDisabilitys &&
                    typeOfDisabilitys.map((typeOfDisability, index) => (
                      <MenuItem key={index} value={typeOfDisability.id}>
                        {language == "en"
                          ? typeOfDisability?.typeOfDisability
                          : typeOfDisability?.typeOfDisabilityMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="typeOfDisability"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.typeOfDisability
                ? errors.typeOfDisability.message
                : null}
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default HawkerDetails;
