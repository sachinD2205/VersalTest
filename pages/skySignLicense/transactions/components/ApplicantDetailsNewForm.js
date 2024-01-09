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

  const getApplicantTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstApplicantType/getApplicantTypeData`)
      .then((r) => {
        setApplicantTypes(
          r.data.map((row) => ({
            id: row.id,
            applicantTypeEn: row.applicantType,
            applicantTypeMar: row.applicantTypeMar,
          }))
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
    axios.get(`${urls.CFCURL}/master/title/getAll`).then((r) => {
      setTitles(
        r.data.title.map((row) => ({
          id: row.id,
          titleEn: row.title,
          titleMar: row.titleMr,
        }))
      );
    });
  };

  // Religions
  const [genders, setGenders] = useState([]);

  // getGenders
  const getGenders = () => {
    axios.get(`${urls.CFCURL}/master/gender/getAll`).then((r) => {
      console.log("33", r);
      setGenders(
        r.data.gender.map((row) => ({
          id: row.id,
          genderEn: row.gender,
          genderMar: row.genderMr,
        }))
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
        {/* -------------------------------------------------------------------------------------------------- */}

        <Grid
          container
          spacing={1}
          // style={{ marginTop: "1vh", marginLeft: "5vh" }}
          // columns={12}
        >
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              // backgroundColor: "lightpink",
            }}
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <Typography
              sx={{ mt: 2, fontWeight: "bold" }}
              id="demo-simple-select-standard-label"
            >
              महाराष्ट्र शासन राजपत्र असाधारण भाग एक-अ–मध्य उप-विभाग, मे ९,
              २०२२/वैशाख १९, शके १९४४
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              // backgroundColor: "lightpink",
            }}
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <Typography
              sx={{ mt: 2, fontWeight: "bold", fontSize: 18 }}
              id="demo-simple-select-standard-label"
            >
              Form A
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              // backgroundColor: "lightpink",
            }}
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <Typography
              sx={{ mt: 2, fontWeight: "bold", fontSize: 18 }}
              id="demo-simple-select-standard-label"
            >
              Application Form
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              // backgroundColor: "lightpink",
            }}
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <Typography
              sx={{ mt: 2, fontStyle: "italic" }}
              id="demo-simple-select-standard-label"
            >
              {`[See rule 17]`}
            </Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
            item
            xl={12}
            lg={12}
            md={12}
            sm={12}
            xs={12}
          >
            <Typography sx={{ mt: 2 }} id="demo-simple-select-standard-label">
              {` (See section 244 in the MMC Act)`}
            </Typography>
          </Grid>
        </Grid>
        {/* 1. Name of Applicant */}
        <Grid
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              1. Name of Applicant
            </InputLabel>
          </Grid>
          <Grid
            container
            item
            xl={8}
            lg={8}
            md={8}
            sm={12}
            xs={12}
            alignItems="center"
          >
            <Grid
              item
              sx={{ mt: 1, fontWeight: "bold" }}
              xl={0.3}
              lg={0.3}
              md={0.3}
              sm={0.3}
              xs={0.3}
            >
              :
            </Grid>
            <Grid item xl={7} lg={7} md={7} sm={7} xs={7}>
              <TextField
                sx={{ width: "100%" }}
                disabled={disabled}
                id="standard-basic"
                variant="standard"
                {...register("nameOfApplicantA")}
                InputLabelProps={{
                  shrink: watch("nameOfApplicantA") ? true : false,
                }}
                error={!!errors.nameOfApplicantA}
                helperText={
                  errors?.nameOfApplicantA
                    ? errors.nameOfApplicantA.message
                    : null
                }
              />
            </Grid>
          </Grid>
        </Grid>
        {/* 2. Name of Agency */}
        <Grid
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              2. Name of Agency
            </InputLabel>
          </Grid>
          <Grid
            container
            item
            xl={8}
            lg={8}
            md={8}
            sm={12}
            xs={12}
            alignItems="center"
          >
            <Grid
              item
              sx={{ mt: 1, fontWeight: "bold" }}
              xl={0.3}
              lg={0.3}
              md={0.3}
              sm={0.3}
              xs={0.3}
            >
              :
            </Grid>
            <Grid item xl={7} lg={7} md={7} sm={7} xs={7}>
              <TextField
                sx={{ width: "100%" }}
                disabled={disabled}
                id="standard-basic"
                variant="standard"
                {...register("nameOfAgencyB")}
                InputLabelProps={{
                  shrink: watch("nameOfAgencyB") ? true : false,
                }}
                error={!!errors.nameOfAgencyB}
                helperText={
                  errors?.nameOfAgencyB ? errors.nameOfAgencyB.message : null
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              3. Status
            </InputLabel>
          </Grid>
          <Grid
            container
            item
            xl={8}
            lg={8}
            md={8}
            sm={12}
            xs={12}
            alignItems="center"
          >
            <Grid
              item
              sx={{ mt: 1, fontWeight: "bold" }}
              xl={0.3}
              lg={0.3}
              md={0.3}
              sm={0.3}
              xs={0.3}
            >
              :
            </Grid>
            <Grid
              sx={{ width: "100%" }}
              item
              xl={7}
              lg={7}
              md={7}
              sm={7}
              xs={7}
            >
              <FormControl error={!!errors.statusC} sx={{ marginTop: 2 }}>
                <Controller
                  render={({ field }) => (
                    <Select
                      disabled={disabled}
                      // autoFocus
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Status *"
                      id="demo-simple-select-standard"
                      labelId="id='demo-simple-select-standard-label'"
                    >
                      <MenuItem value={"proprietary_firm"}>
                        Proprietary firm
                      </MenuItem>
                      <MenuItem value={"company"}>Company</MenuItem>
                      <MenuItem value={"charitable_trust"}>
                        Charitable Trust
                      </MenuItem>
                      <MenuItem value={"others"}>Others</MenuItem>
                    </Select>
                  )}
                  name="statusC"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.statusC ? errors.statusC.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              4. Address
            </InputLabel>
          </Grid>
          <Grid
            container
            item
            xl={8}
            lg={8}
            md={8}
            sm={12}
            xs={12}
            alignItems="center"
          >
            <Grid
              item
              sx={{ mt: 1, fontWeight: "bold" }}
              xl={0.3}
              lg={0.3}
              md={0.3}
              sm={0.3}
              xs={0.3}
            >
              :
            </Grid>
            <Grid item xl={7} lg={7} md={7} sm={7} xs={7}>
              <TextField
                sx={{ width: "100%" }}
                disabled={disabled}
                id="standard-basic"
                variant="standard"
                {...register("addressD")}
                InputLabelProps={{ shrink: watch("addressD") ? true : false }}
                error={!!errors.addressD}
                helperText={errors?.addressD ? errors.addressD.message : null}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          container
          spacing={1}
          //   columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}></Grid>
          <Grid item xl={1} lg={1} md={1} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              Telephone :
            </InputLabel>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <TextField
              sx={{ width: "60%" }}
              disabled={disabled}
              id="standard-basic"
              variant="standard"
              {...register("telephoneE")}
              InputLabelProps={{ shrink: watch("telephoneE") ? true : false }}
              error={!!errors.telephoneE}
              helperText={errors?.telephoneE ? errors.telephoneE.message : null}
            />
          </Grid>
        </Grid>
        <Grid
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          container
          spacing={1}
          //   columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}></Grid>
          <Grid item xl={1} lg={1} md={1} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              Fax :
            </InputLabel>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
            <TextField
              sx={{ width: "60%" }}
              disabled={disabled}
              id="standard-basic"
              variant="standard"
              {...register("faxF")}
              InputLabelProps={{ shrink: watch("faxF") ? true : false }}
              error={!!errors.faxF}
              helperText={errors?.faxF ? errors.faxF.message : null}
            />
          </Grid>
        </Grid>
        <Grid
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              5. Medium of advertisements applied for:
            </InputLabel>
          </Grid>
          <Grid
            container
            item
            xl={8}
            lg={8}
            md={8}
            sm={12}
            xs={12}
            alignItems="center"
          >
            {/* <Grid
              item
              sx={{ mt: 1, fontWeight: "bold" }}
              xl={0.3}
              lg={0.3}
              md={0.3}
              sm={0.3}
              xs={0.3}
            >
              :
            </Grid> */}
            <Grid
              sx={{ width: "100%" }}
              item
              xl={7}
              lg={7}
              md={7}
              sm={7}
              xs={7}
            >
              <FormControl sx={{ flex: "2" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="mediumOfAdvertisements"
                  {...register("mediumOfAdvertisements")}
                  onChange={(e) => {
                    setValue("mediumOfAdvertisements", e.target.defaultValue);
                  }}
                >
                  <FormControlLabel
                    value="illuminated"
                    control={<Radio />}
                    label="Illuminated"
                  />
                  <FormControlLabel
                    value="Non Illuminated"
                    control={<Radio />}
                    label="Non Illuminated."
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              6. Form of Advertisement
            </InputLabel>
          </Grid>
          <Grid
            container
            item
            xl={8}
            lg={8}
            md={8}
            sm={12}
            xs={12}
            alignItems="center"
          >
            {/* <Grid
              item
              sx={{ mt: 1, fontWeight: "bold" }}
              xl={0.3}
              lg={0.3}
              md={0.3}
              sm={0.3}
              xs={0.3}
            >
              :
            </Grid> */}
            <Grid
              sx={{ width: "100%" }}
              item
              xl={7}
              lg={7}
              md={7}
              sm={7}
              xs={7}
            >
              <FormControl sx={{ flex: "2" }}>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="formOfAdvertisements"
                  {...register("formOfAdvertisements")}
                  onChange={(e) => {
                    setValue("formOfAdvertisements", e.target.defaultValue);
                  }}
                >
                  <FormControlLabel
                    value="Temporary"
                    control={<Radio />}
                    label="Temporary"
                  />
                  <FormControlLabel
                    value="Non Temporary"
                    control={<Radio />}
                    label="Non Temporary"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          // sx={{ marginLeft: 5, marginBottom: 5, align: "center" }}
          container
          spacing={1}
          columnSpacing={{ xs: 1, sm: 1, md: 1, lg: 12, xl: 12 }}
          sx={{ marginTop: "1vh", marginLeft: "5vh" }}
          columns={12}
        >
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <InputLabel sx={{ mt: 4 }} id="demo-simple-select-standard-label">
              7. Nature of advertisement applied
            </InputLabel>
          </Grid>
          <Grid
            container
            item
            xl={8}
            lg={8}
            md={8}
            sm={12}
            xs={12}
            alignItems="center"
          >
            <Grid
              item
              sx={{ mt: 1, fontWeight: "bold" }}
              xl={0.3}
              lg={0.3}
              md={0.3}
              sm={0.3}
              xs={0.3}
            >
              :
            </Grid>
            <Grid item xl={7} lg={7} md={7} sm={7} xs={7}>
              <TextField
                sx={{ width: "100%" }}
                disabled={disabled}
                id="standard-basic"
                variant="standard"
                {...register("natureOfAdvertisementAppliedFor")}
                InputLabelProps={{
                  shrink: watch("natureOfAdvertisementAppliedFor")
                    ? true
                    : false,
                }}
                error={!!errors.natureOfAdvertisementAppliedFor}
                helperText={
                  errors?.natureOfAdvertisementAppliedFor
                    ? errors.natureOfAdvertisementAppliedFor.message
                    : null
                }
              />
            </Grid>
          </Grid>
        </Grid>
        {/* -------------------------------------------------------------------------------------------------- */}

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
      </Main>
    </>
  );
};

export default ApplicantDetails;
