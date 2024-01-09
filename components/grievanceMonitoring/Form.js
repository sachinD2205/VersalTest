import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import urls from "../../URLS/urls";
import Transliteration from "../common/linguosol/transliteration";
import { useRouter } from "next/router";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { cfcCatchMethod, moduleCatchMethod } from "../../util/commonErrorUtil";
const Form = () => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const router = useRouter();

  const [titles, setTitles] = useState([]);
  const userCitizen = useSelector((state) => {
    return state?.user?.user;
  });
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };

  const logedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state?.labels.language);
  const userToken = useSelector((state) => {
    return state?.user?.user?.token;
  });
  const headers = { Authorization: `Bearer ${userToken}` };
  useEffect(() => {
    if (logedInUser === "citizenUser") {
      setValue("firstName", userCitizen?.firstName);
      setValue("middleName", userCitizen?.middleName);
      setValue("surname", userCitizen?.surname);
      setValue("email", userCitizen?.emailID);
      setValue("houseNo", userCitizen?.pflatBuildingNo);
      setValue("buildingNo", userCitizen?.pflatBuildingNo);
      setValue("roadName", userCitizen?.proadName);
      setValue("area", userCitizen?.plandmark);
      setValue("location", userCitizen?.pcity);
      setValue("city", userCitizen?.pcity);
      setValue("pincode", userCitizen?.ppincode);
      setValue("title", userCitizen?.title);
      setValue("title", userCitizen?.title);
      setValue("firstNameMr", userCitizen?.firstNamemr);
      setValue("middleNameMr", userCitizen?.middleNamemr);
      setValue("surnameMr", userCitizen?.surnamemr);
      setValue("mobileNumber", userCitizen?.mobile);
      setValue("houseNoMr", userCitizen?.pflatBuildingNoMr);
      setValue("buildingNoMr", userCitizen?.pflatBuildingNoMr);
      setValue("roadNameMr", userCitizen?.proadNameMr);
      setValue("areaMr", userCitizen?.plandmarkMr);
      setValue("locationMr", userCitizen?.pcityMr);
      setValue("cityMr", userCitizen?.pcityMr);
      setValue("pincodeMr", userCitizen?.ppincode);
    }
  }, [userCitizen, language]);

  useEffect(() => {
    getTitles();
  }, []);

  const getTitles = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setTitles(
          r?.data?.title?.map((row) => ({
            id: row.id,
            titleEn: row.title,
            titleMr: row.titleMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // View
  return (
    <Paper
      elevation={8}
      variant="outlined"
      sx={{
        marginLeft: "10px",
        marginRight: "10px",
        marginTop: "10px",
        marginBottom: "60px",
        padding: 1,
      }}
    >
      <Box>
        <Grid
          container
          style={{
            display: "flex",
            alignItems: "center", // Center vertically
            alignItems: "center",
            width: "100%",
            height: "auto",
            overflow: "auto",
            color: "white",
            fontSize: "18.72px",
            borderRadius: 100,
            fontWeight: 500,
            background:
              "linear-gradient( 90deg, rgb(72 115 218 / 91%) 2%, rgb(142 122 231) 100%)",
          }}
        >
          <Grid item xs={1}>
            <IconButton
              style={{
                color: "white",
              }}
              onClick={() => {
                router.back();
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item xs={11}>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                marginRight: "2rem",
              }}
            >
              <FormattedLabel id="personalDetailss" />
            </h3>
          </Grid>
        </Grid>
      </Box>
      <Grid
        container
        spacing={2}
        style={{
          padding: "1rem",
        }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          xl={4}
          lg={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl
            error={!!errors.title}
            sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              <FormattedLabel id="titles" />
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={logedInUser === "citizenUser" ? true : false}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label={<FormattedLabel id="titles" />}
                >
                  {titles &&
                    titles.map((title, index) => (
                      <MenuItem key={index} value={title.id}>
                        {title.titleEn}
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

        {logedInUser !== "citizenUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                variant={"standard"}
                _key={"firstName"}
                labelName={"firstName"}
                fieldName={"firstName"}
                updateFieldName={"firstNameMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                label={<FormattedLabel id="firstName" required />}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                variant={"standard"}
                _key={"middleName"}
                labelName={"middleName"}
                fieldName={"middleName"}
                updateFieldName={"middleNameMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                label={<FormattedLabel id="middleName" required />}
                error={!!errors.middleName}
                helperText={
                  errors?.middleName ? errors.middleName.message : null
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                variant={"standard"}
                _key={"surname"}
                labelName={"lastNameV"}
                fieldName={"surname"}
                updateFieldName={"surnameMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                label={<FormattedLabel id="lastNameV" required />}
                error={!!errors.surname}
                helperText={errors?.surname ? errors.surname.message : null}
              />
            </Grid>

            <>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"houseNo"}
                  labelName={"houseNumberEn"}
                  fieldName={"houseNo"}
                  updateFieldName={"houseNoMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="houseNumberEn" required />}
                  error={!!errors.houseNo}
                  helperText={errors?.houseNo ? errors.houseNo.message : null}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"buildingNo"}
                  labelName={"flatBuildingNo"}
                  fieldName={"buildingNo"}
                  updateFieldName={"buildingNoMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="flatBuildingNo" required />}
                  error={!!errors.buildingNo}
                  helperText={
                    errors?.buildingNo ? errors.buildingNo.message : null
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"roadName"}
                  labelName={"roadNamesEn"}
                  fieldName={"roadName"}
                  updateFieldName={"roadNameMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="roadNamesEn" required />}
                  error={!!errors.roadName}
                  helperText={errors?.roadName ? errors.roadName.message : null}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"area"}
                  labelName={"areasEn"}
                  fieldName={"area"}
                  updateFieldName={"areaMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="areasEn" required />}
                  error={!!errors.area}
                  helperText={errors?.area ? errors.area.message : null}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"location"}
                  labelName={"lacationsEn"}
                  fieldName={"location"}
                  updateFieldName={"locationMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="lacationsEn" required />}
                  error={!!errors.location}
                  helperText={errors?.location ? errors.location.message : null}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"city"}
                  labelName={"citysEn"}
                  fieldName={"city"}
                  updateFieldName={"cityMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="citysEn" required />}
                  error={!!errors.city}
                  helperText={errors?.city ? errors.city.message : null}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"pincode"}
                  labelName={"pincodesEn"}
                  fieldName={"pincode"}
                  updateFieldName={"pincodeMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="pincodesEn" required />}
                  error={!!errors.pincode}
                  helperText={errors?.pincode ? errors.pincode.message : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={logedInUser == "citizenUser" ? true : false}
                  inputProps={{ maxLength: 10, minLength: 10 }}
                  id="standard-basic"
                  label={<FormattedLabel id="mobileNo" required />}
                  variant="standard"
                  {...register("mobileNumber")}
                  error={!!errors.mobileNumber}
                  helperText={
                    errors?.mobileNumber ? errors.mobileNumber.message : null
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  disabled={logedInUser == "citizenUser" ? true : false}
                  id="standard-basic"
                  label={<FormattedLabel id="emailIds" required />}
                  variant="standard"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors?.email ? errors.email.message : null}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              ></Grid>
            </>
          </>
        )}

        {logedInUser === "citizenUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="firstName" required />}
                variant="standard"
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors?.firstName ? errors.firstName.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="middleName" required />}
                variant="standard"
                {...register("middleName")}
                error={!!errors.middleName}
                helperText={
                  errors?.middleName ? errors.middleName.message : null
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="lastName" required />}
                variant="standard"
                {...register("surname")}
                error={!!errors.surname}
                helperText={errors?.surname ? errors.surname.message : null}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="houseNumberEn" required />}
                variant="standard"
                {...register("houseNo")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="flatBuildingNo" required />}
                variant="standard"
                {...register("buildingNo")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="roadName" required />}
                variant="standard"
                {...register("roadName")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="areasEn" required />}
                variant="standard"
                {...register("area")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="lacationsEn" required />}
                variant="standard"
                {...register("location")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="citysEn" required />}
                variant="standard"
                {...register("city")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                inputProps={{ maxLength: 6 }}
                label={<FormattedLabel id="pincodesEn" required />}
                variant="standard"
                {...register("pincode")}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={logedInUser == "citizenUser" ? true : false}
                inputProps={{ maxLength: 10, minLength: 10 }}
                id="standard-basic"
                label={<FormattedLabel id="mobileNo" required />}
                variant="standard"
                {...register("mobileNumber")}
                error={!!errors.mobileNumber}
                helperText={
                  errors?.mobileNumber ? errors.mobileNumber.message : null
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled={logedInUser == "citizenUser" ? true : false}
                id="standard-basic"
                label={<FormattedLabel id="emailIds" required />}
                variant="standard"
                {...register("email")}
                error={!!errors.email}
                helperText={errors?.email ? errors.email.message : null}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></Grid>
          </>
        )}

        {logedInUser === "citizenUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                error={!!errors.title}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="titles" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={logedInUser === "citizenUser" ? true : false}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="titles" />}
                    >
                      {titles &&
                        titles.map((title, index) => (
                          <MenuItem key={index} value={title.id}>
                            {title?.titleMr}
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="firstNamemr" required />}
                variant="standard"
                {...register("firstNameMr")}
                error={!!errors.firstNameMr}
                helperText={
                  errors?.firstNameMr ? errors.firstNameMr.message : null
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="middleNamemr" required />}
                variant="standard"
                {...register("middleNameMr")}
                error={!!errors.middleNameMr}
                helperText={
                  errors?.middleNameMr ? errors.middleNameMr.message : null
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                InputLabelProps={{ shrink: true }}
                id="standard-basic"
                label={<FormattedLabel id="lastNamemr" required />}
                variant="standard"
                {...register("surnameMr")}
                error={!!errors.surnameMr}
                helperText={errors?.surnameMr ? errors.surnameMr.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="houseNumberMr" required />}
                variant="standard"
                {...register("houseNoMr")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="flatBuildingNomr" required />}
                variant="standard"
                {...register("buildingNoMr")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="roadNamesMr" required />}
                variant="standard"
                {...register("roadNameMr")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="areasMr" required />}
                variant="standard"
                {...register("areaMr")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="lacationsMr" required />}
                variant="standard"
                {...register("locationMr")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                label={<FormattedLabel id="citysMr" required />}
                variant="standard"
                {...register("cityMr")}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                disabled
                id="standard-basic"
                inputProps={{ maxLength: 6 }}
                label={<FormattedLabel id="pincodesMr" required />}
                variant="standard"
                {...register("pincodeMr")}
              />
            </Grid>
          </>
        )}

        {logedInUser !== "citizenUser" && (
          <>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                error={!!errors.title}
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="titles" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      disabled={logedInUser === "citizenUser" ? true : false}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label={<FormattedLabel id="titles" />}
                    >
                      {titles &&
                        titles.map((title, index) => (
                          <MenuItem key={index} value={title.id}>
                            {title?.titleMr}
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
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                variant={"standard"}
                _key={"firstNameMr"}
                labelName={"firstNamemr"}
                fieldName={"firstNameMr"}
                updateFieldName={"firstName"}
                sourceLang={"mar"}
                targetLang={"eng"}
                label={<FormattedLabel id="firstNamemr" required />}
                error={!!errors.firstNameMr}
                helperText={
                  errors?.firstNameMr ? errors.firstNameMr.message : null
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                variant={"standard"}
                _key={"middleNameMr"}
                labelName={"middleNamemr"}
                fieldName={"middleNameMr"}
                updateFieldName={"middleName"}
                sourceLang={"mar"}
                targetLang={"eng"}
                label={<FormattedLabel id="middleNamemr" required />}
                error={!!errors.middleNameMr}
                helperText={
                  errors?.middleNameMr ? errors.middleNameMr.message : null
                }
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              xl={4}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                variant={"standard"}
                _key={"lastNamemr"}
                labelName={"lastNamemr"}
                fieldName={"surnameMr"}
                updateFieldName={"surname"}
                sourceLang={"mar"}
                targetLang={"eng"}
                label={<FormattedLabel id="lastNamemr" required />}
                error={!!errors.surnameMr}
                helperText={errors?.surnameMr ? errors.surnameMr.message : null}
              />
            </Grid>

            <>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"houseNoMr"}
                  labelName={"houseNumberMr"}
                  fieldName={"houseNoMr"}
                  updateFieldName={"houseNo"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  label={<FormattedLabel id="houseNumberMr" required />}
                  error={!!errors.houseNoMr}
                  helperText={
                    errors?.houseNoMr ? errors.houseNoMr.message : null
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"buildingNoMr"}
                  labelName={"flatBuildingNomr"}
                  fieldName={"buildingNoMr"}
                  updateFieldName={"buildingNo"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  label={<FormattedLabel id="flatBuildingNomr" required />}
                  error={!!errors.buildingNoMr}
                  helperText={
                    errors?.buildingNoMr ? errors.buildingNoMr.message : null
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"roadNameMr"}
                  labelName={"roadNamesMr"}
                  fieldName={"roadNameMr"}
                  updateFieldName={"roadName"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  label={<FormattedLabel id="roadNamesMr" required />}
                  error={!!errors.roadNameMr}
                  helperText={
                    errors?.roadNameMr ? errors.roadNameMr.message : null
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"areaMr"}
                  labelName={"areasMr"}
                  fieldName={"areaMr"}
                  updateFieldName={"area"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  label={<FormattedLabel id="areasMr" required />}
                  error={!!errors.areaMr}
                  helperText={errors?.areaMr ? errors.areaMr.message : null}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"locationMr"}
                  labelName={"lacationsMr"}
                  fieldName={"locationMr"}
                  updateFieldName={"location"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  label={<FormattedLabel id="lacationsMr" required />}
                  error={!!errors.locationMr}
                  helperText={
                    errors?.locationMr ? errors.locationMr.message : null
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"cityMr"}
                  labelName={"citysMr"}
                  fieldName={"cityMr"}
                  updateFieldName={"city"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  label={<FormattedLabel id="citysMr" required />}
                  error={!!errors.cityMr}
                  helperText={errors?.cityMr ? errors.cityMr.message : null}
                />
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                xl={4}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={"pincodeMr"}
                  labelName={"pincodesMr"}
                  fieldName={"pincodeMr"}
                  updateFieldName={"pincode"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  label={<FormattedLabel id="pincodesMr" required />}
                  error={!!errors.pincodeMr}
                  helperText={
                    errors?.pincodeMr ? errors.pincodeMr.message : null
                  }
                />
              </Grid>
            </>
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default Form;
