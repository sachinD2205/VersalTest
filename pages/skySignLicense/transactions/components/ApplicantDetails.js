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
import { useRouter } from "next/router";
import { Watch } from "@mui/icons-material";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

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

const ApplicantDetails = (props) => {
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    console.log("flag", flag);
  }, [flag, watch("applicantType")]);

  const [flag, setFlag] = useState(null);
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
    console.log("abc12345", router?.query);
    // if (router.query.pageMode === 'Add' || router.query.pageMode === 'Edit') {
    //   setDisabled(false)
    // } else {
    //   setDisabled(true)
    // }
    if (router?.query?.disabled) {
      setDisabled(true);
    } else if (props.disabled) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, []);

  const [applicantTypes, setApplicantTypes] = useState([]);

  // const getApplicantTypes = () => {
  //   axios
  //     .get(`${urls.SSLM}/master/MstApplicantType/getApplicantTypeData`, {
  //       headers: {
  //         Authorization: `Bearer ${userToken}`,
  //       },
  //     })
  //     .then((r) => {
  //       setApplicantTypes(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           applicantTypeEn: row.applicantType,
  //           applicantTypeMar: row.applicantTypeMar,
  //         }))
  //       );
  //     })
  //     .catch((error) => {
  //       callCatchMethod(error, language);
  //     });
  // };

  // useEffect(() => {
  //   getApplicantTypes();
  // }, []);

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
            titleEn: row.title,
            titleMar: row.titleMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
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
        console.log("33", r);
        setGenders(
          r.data.gender.map((row) => ({
            id: row.id,
            genderEn: row.gender,
            genderMar: row.genderMr,
          }))
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
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
        {/* <div
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
        </div> */}
        {/* <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, align: "center" }}
        > */}
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
        {/* <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
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
                    autoFocus
                    disabled={disabled}
                    sx={{ width: 200 }}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // if (value.target.value === 'Firm') {
                      //   setFlag(value.target.value)
                      //   console.log(value.target.value);
                      // }
                      // else {
                      //   setFlag(false)
                      // }
                    }
                    }
                    label=" Applicant Type *"
                  >

                    <MenuItem value={'Individual'}>
                      {language == 'en'
                        ?
                        "Individual"
                        : "वैयक्तिक"}
                    </MenuItem>
                    <MenuItem value={'Firm'}>{language == 'en'
                      ?
                      "Firm"
                      : "फर्म"}
                    </MenuItem>

                  </Select>
                )}
                name="applicantType"
                control={control}
                defaultValue=""
              />

            </FormControl>
          </Grid> */}

        {/* <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            {watch('applicantType') === 'Firm' && (

              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="applicantIsFirm" />}</FormLabel>
                <Controller
                  name="ownertype"
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
                        error={!!errors?.ownertype}
                        value="Manager"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="manager" />}
                      />
                      <FormControlLabel
                        error={!!errors?.ownertype}
                        value="Director"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="director" />}
                      />
                      <FormControlLabel
                        error={!!errors?.ownertype}
                        value="Owner"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="owner" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.ownertype}>
                  {errors?.ownertype ? errors?.ownertype?.message : null}
                </FormHelperText>
              </FormControl>
            )}

          </Grid> */}
        {/** End First Grid */}
        {/* </Grid> */}

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
          <FormattedLabel id="applicantName" />
        </div>
        <Grid
          // container
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="title" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    // autoFocus
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Title *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {titles &&
                      titles.map((title, index) => (
                        <MenuItem key={index} value={title.id}>
                          {title.titleEn}
                          {/* {language == 'en'
                            ?
                            title?.titleEn
                            : title?.titleMar} */}
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

          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            <TextField
              // sx={{ width: 250 }}
              disabled={disabled}
              id="standard-basic"
              label={<FormattedLabel id="fname"></FormattedLabel>}
              variant="standard"
              {...register("firstName")}
              InputLabelProps={{ shrink: watch("firstName") ? true : false }}
              error={!!errors.firstName}
              helperText={errors?.firstName ? errors.firstName.message : null}
            />
          </Grid>

          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="mname"></FormattedLabel>}
              variant="standard"
              {...register("middleName")}
              InputLabelProps={{ shrink: watch("middleName") ? true : false }}
              error={!!errors.middleName}
              helperText={errors?.middleName ? errors.middleName.message : null}
            />
          </Grid>

          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              //  sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="lname"></FormattedLabel>}
              variant="standard"
              {...register("lastName")}
              InputLabelProps={{ shrink: watch("lastName") ? true : false }}
              error={!!errors.lastName}
              helperText={errors?.lastName ? errors.lastName.message : null}
            />
          </Grid>
        </Grid>
        <Grid
          // container
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            <FormControl error={!!errors.title} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                <FormattedLabel id="titleMr" />
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    // autoFocus
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Title(In Marathi) *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {titles &&
                      titles.map((title, index) => (
                        <MenuItem key={index} value={title.id}>
                          {title.titleMar}
                          {/* {language == 'en'
                            ?
                            title?.titleEn
                            : title?.titleMar} */}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="titleMr"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.titleMr ? errors.titleMr.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="fnameMr"></FormattedLabel>}
              variant="standard"
              {...register("marFirstName")}
              InputLabelProps={{ shrink: watch("marFirstName") ? true : false }}
              error={!!errors.marFirstName}
              helperText={
                errors?.marFirstName ? errors.marFirstName.message : null
              }
            />
          </Grid>

          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="mnameMr"></FormattedLabel>}
              variant="standard"
              {...register("marMiddleName")}
              InputLabelProps={{
                shrink: watch("marMiddleName") ? true : false,
              }}
              error={!!errors.marMiddleName}
              helperText={
                errors?.marMiddleName ? errors.marMiddleName.message : null
              }
            />
          </Grid>

          <Grid item xl={3} lg={3} md={3} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              //  sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="lnameMr"></FormattedLabel>}
              variant="standard"
              {...register("marLastName")}
              InputLabelProps={{ shrink: watch("marLastName") ? true : false }}
              error={!!errors.marLastName}
              helperText={
                errors?.marLastName ? errors.marLastName.message : null
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
          <FormattedLabel id="applicantDetails" />
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
              variant="standard"
              // sx={{ m: 2, minWidth: 120 }}
              error={!!errors.gender}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="gender"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    // sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Gender *"
                  >
                    {genders &&
                      genders.map((gender, index) => (
                        <MenuItem key={index} value={gender.id}>
                          {gender.gender}

                          {language == "en"
                            ? gender?.genderEn
                            : gender?.genderMar}
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
          {/* <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl error={!!errors.dateOfBirth} sx={{ marginTop: 0 }}>
              <Controller
                sx={{ marginTop: 0 }}

                control={control}
                name='dateOfBirth'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={disabled}
                      inputFormat='DD/MM/YYYY'
                      label={
                        <FormattedLabel id="dateOfBirth" />

                      }
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(moment(date).format("YYYY-MM-DD"));
                        let date2 = moment(new Date()).format("YYYY-MM-DD");
                        let date1 = moment(date).format("YYYY-MM-DD");

                        let temp=moment.duration(moment(date2).diff(moment(date1)))

                        // setValue(
                        //   "age",
                        //   Math.floor(moment().format("YYYY") - date1),
                        // );
                        setValue( "age",temp.years())
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
          </Grid> */}
          {/* <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
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
          </Grid> */}

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              //     sx={{ width: 200 }}
              id="standard-basic"
              label={<FormattedLabel id="mobile"></FormattedLabel>}
              variant="standard"
              {...register("mobile")}
              InputLabelProps={{ shrink: watch("mobile") ? true : false }}
              error={!!errors.mobile}
              helperText={errors?.mobile ? errors.mobile.message : null}
            />
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // sx={{ width: 200 }}
              id="standard-basic"
              label={<FormattedLabel id="email"></FormattedLabel>}
              variant="standard"
              {...register("emailAddress")}
              InputLabelProps={{ shrink: watch("emailAddress") ? true : false }}
              error={!!errors.emailAddress}
              helperText={
                errors?.emailAddress ? errors.emailAddress.message : null
              }
            />
          </Grid>
        </Grid>
        <Grid
          // container
          // sx={{ marginLeft: 5, align: "center" }}
          container
          spacing={1}
          // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          style={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              id="standard-basic"
              label={<FormattedLabel id="aadharNo" />}
              variant="standard"
              {...register("aadhaarNo")}
              InputLabelProps={{ shrink: watch("aadhaarNo") ? true : false }}
              error={!!errors.aadhaarNo}
              helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
            />
          </Grid>

          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <TextField
              disabled={disabled}
              // sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="panNo"></FormattedLabel>}
              variant="standard"
              {...register("panNo")}
              InputLabelProps={{ shrink: watch("panNo") ? true : false }}
              error={!!errors.panNo}
              helperText={errors?.panNo ? errors.panNo.message : null}
            />
          </Grid>
        </Grid>

        {/* {watch('applicantType') === 'Firm' && (
          <Grid
            // container
            // sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
            container
            spacing={1}
            // columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
            style={{ marginTop: '1vh', marginLeft: '5vh' }}
            columns={12}
          >

            <Grid item
              xl={4}
              lg={4}
              md={4}
              sm={12}
              xs={12}>
              <TextField
                disabled={disabled}
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

            <Grid item
              xl={4}
              lg={4}
              md={4}
              sm={12}
              xs={12}>
              <TextField
                disabled={disabled}
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


            <Grid item
              xl={4}
              lg={4}
              md={4}
              sm={12}
              xs={12}>
              <TextField
                disabled={disabled}
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

        )} */}
      </Main>
    </>
  );
};

export default ApplicantDetails;
