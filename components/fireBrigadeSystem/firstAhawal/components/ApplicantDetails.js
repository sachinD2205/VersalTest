import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Grid,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Box,
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
  }),
);



const ApplicantDetails = () => {
  const {
    control,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useFormContext();


  useEffect(() => {
    console.log("flag", flag)
  }, [flag])

  const [flag, setFlag] = useState(null);
  const language = useSelector((state) => state?.labels.language);


  const [applicantTypes, setApplicantTypes] = useState([]);

  const getApplicantTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstApplicantType/getApplicantTypeData`)
      .then((r) => {
        setApplicantTypes(
          r.data.map((row) => ({
            id: row.id,
            applicantTypeEn: row.applicantType,
            applicantTypeMar: row.applicantTypeMar,

          })),
        );
      });
  };

  useEffect(() => {
    getApplicantTypes();
  }, []);


  // Titles
  const [titles, setTitles] = useState([]);

  // getTitles
  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`)
      .then((r) => {
        setTitles(
          r.data.title.map((row) => ({
            id: row.id,
            titleEn: row.title,
            titleMar: row.titleMr,

          })),
        );
      });
  };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`)
      .then((r) => {
        console.log('33', r)
        setGenders(
          r.data.gender.map((row) => ({
            id: row.id,
            genderEn: row.gender,
            genderMar: row.genderMr,

          })),
        );
      });
  };

  // useEffect
  useEffect(() => {
    getTitles();
    getGenders();
  }, []);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);



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
          <FormattedLabel id='applicantInformation' />
          {/* <strong> Document Upload</strong> */}
        </div>
        {/* <div>
          <Typography className={styles.rap} variant='h6' sx={{ marginTop: 5 }}>
             <strong>Applicant Information</strong> 
            <FormattedLabel id='applicantInformation' />,
           </Typography>
        </div> */}



        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, align: "center" }}
        >
          {/* 
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              sx={{ m: 2, minWidth: 120 }}
              error={!!errors.applicantType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="applicantType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    // sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Applicant Type *'
                  >
                    {applicantTypes &&
                      applicantTypes.map((applicantType, index) => (
                        <MenuItem key={index} value={applicantType.id}>
                          {applicantType.applicantType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='applicantType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.applicantType ? errors.applicantType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 180 }}
              error={!!errors.applicantType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="applicantType" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 200 }}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      if (value.target.value === 'Firm') {
                        setFlag(value.target.value)
                        console.log(value.target.value);
                      }
                      else {
                        setFlag(false)
                      }
                    }
                    }
                    label=" Applicant Type *"
                  >

                    <MenuItem value={'Individual'}>Individual</MenuItem>
                    <MenuItem value={'Firm'}>Firm</MenuItem>

                  </Select>
                )}
                name="applicantType"
                control={control}
                defaultValue=""
              />

            </FormControl>
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            {flag === 'Firm' && (
              <FormControl>
                <FormLabel id='demo-row-radio-buttons-group-label'>
                  {/* In Case of Applicant is Firm/Organization */}
                  {<FormattedLabel id="applicantIsFirm"></FormattedLabel>}

                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='demo-row-radio-buttons-group-label'
                  name='row-radio-buttons-group'
                >
                  <FormControlLabel
                    value='Manager'
                    control={<Radio />}
                    label={<FormattedLabel id="manager"></FormattedLabel>}
                    // lable = {<FormattedLabel id="manager" />}
                    name='ownertype'
                    {...register("ownertype")}
                    error={!!errors.ownertype}
                    helperText={errors?.ownertype ? errors.ownertype.message : null}
                  />
                  <FormControlLabel
                    value='Director'
                    control={<Radio />}
                    label={<FormattedLabel id="director"></FormattedLabel>}
                    name='ownertype'
                    {...register("ownertype")}
                    error={!!errors.ownertype}
                    helperText={errors?.ownertype ? errors.ownertype.message : null}
                  />

                  <FormControlLabel
                    value='Owner'
                    control={<Radio />}
                    label={<FormattedLabel id="owner"></FormattedLabel>}
                    name='ownertype'
                    {...register("ownertype")}
                    error={!!errors.ownertype}
                    helperText={errors?.ownertype ? errors.ownertype.message : null}
                  />
                </RadioGroup>
              </FormControl>

            )}

          </Grid>
          {/** End First Grid */}
        </Grid>

        <Grid
          container
          sx={{ marginLeft: 5, align: "center" }}
        >
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>


          </Grid>



          <Grid
            container
            sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          ></Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
              <InputLabel id='demo-simple-select-standard-label'>
                <FormattedLabel id='title' />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    autoFocus
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Title *'
                    id='demo-simple-select-standard'
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {titles &&
                      titles.map((title, index) => (
                        <MenuItem key={index} value={title.id}>
                          {title.title}
                          {language == 'en'
                            ?
                            title?.titleEn
                            : title?.titleMar}
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
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="fname"></FormattedLabel>}
              variant='standard'
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={
                errors?.firstName
                  ? errors.firstName.message
                  : null
              }
            />
          </Grid>


          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="mname"></FormattedLabel>}
              variant='standard'
              {...register("middleName")}
              error={!!errors.middleName}
              helperText={
                errors?.middleName
                  ? errors.middleName.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              //  sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="lname"></FormattedLabel>}
              variant='standard'
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={
                errors?.lastName
                  ? errors.lastName.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant='standard'
              // sx={{ m: 2, minWidth: 120 }}
              error={!!errors.gender}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="gender"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    // sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Gender *'
                  >
                    {genders &&
                      genders.map((gender, index) => (
                        <MenuItem key={index} value={gender.id}>
                          {gender.gender}

                          {language == 'en'
                            ?
                            gender?.genderEn
                            : gender?.genderMar}
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
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
              <Controller
                sx={{ marginTop: 0 }}

                control={control}
                name='dateOfBirth'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='DD/MM/YYYY'
                      label={
                        <FormattedLabel id="dateOfBirth" />

                      }
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                        let date1 = moment(date).format("YYYY");
                        setValue(
                          "age",
                          Math.floor(moment().format("YYYY") - date1),
                        );
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
                {errors?.dateOfBirth ? errors.dateOfBirth.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled
              size='3'
              InputLabelProps={{ shrink: true }}
              id='standard-basic'
              label={<FormattedLabel id="age"></FormattedLabel>}
              {...register("age")}
              error={!!errors.age}
              helperText={errors?.age ? errors.age.message : null}
            />
          </Grid>


          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              //     sx={{ width: 200 }}
              id='standard-basic'
              label={<FormattedLabel id="mobile"></FormattedLabel>}
              variant='standard'
              {...register("mobile")}
              error={!!errors.mobile}
              helperText={errors?.mobile ? errors.mobile.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // sx={{ width: 200 }}
              id='standard-basic'
              label={<FormattedLabel id="email"></FormattedLabel>}
              variant='standard'
              {...register("emailAddress")}
              error={!!errors.emailAddress}
              helperText={
                errors?.emailAddress ? errors.emailAddress.message : null
              }
            />
          </Grid>



          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              // sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="panNo"></FormattedLabel>}
              variant='standard'
              {...register("panNo")}
              error={!!errors.panNo}
              helperText={errors?.panNo ? errors.panNo.message : null}
            />
          </Grid>
        </Grid>


        {flag === 'Firm' && (
          <Grid
            container
            sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
          >

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                //   sx={{ width: 300 }}
                id='standard-basic'
                label={<FormattedLabel id="registrationNo"></FormattedLabel>}
                variant='standard'
                {...register("registrationNo")}
                error={!!errors.registrationNo}
                helperText={
                  errors?.registrationNo
                    ? errors.registrationNo.message
                    : null
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                // sx={{ width: 250 }}
                id='standard-basic'
                label={<FormattedLabel id="gstNo"></FormattedLabel>}
                variant='standard'
                {...register("gstNo")}
                error={!!errors.gstNo}
                helperText={
                  errors?.gstNo
                    ? errors.gstNo.message
                    : null
                }
              />
            </Grid>


            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                // sx={{ width: 250 }}
                id='standard-basic'
                label={<FormattedLabel id="tanNo"></FormattedLabel>}
                variant='standard'
                {...register("tanNo")}
                error={!!errors.tanNo}
                helperText={errors?.tanNo ? errors.tanNo.message : null}
              />
            </Grid>


          </Grid>

        )}
      </Main>


      {/* </div>
       */}



    </>
  );
};

export default ApplicantDetails;
