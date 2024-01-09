import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import Transliteration from "../common/linguosol/transliteration";
import { catchExceptionHandlingMethod } from "../../util/util";
// Component
const PersonalDetails = () => {
  //catch
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
  let user = useSelector((state) => state.user.user);
  const router = useRouter();

  const language = useSelector((state) => state?.labels.language);

  // React Hook Form
  const {
    control,
    register,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
    } else {
      console.log("disabled");
    }
  }, []);

  // useEffect(() => {

  //   if (router.query.pageMode === "Edit" || router.query.pageMode === "Add") {
  //     console.log("router.query.pageMode", router.query);
  //     console.log("atitleMr", getValues("atitleMr"));

  //     setValue("atitle", user.title);
  //     setValue("afName", user.firstName);
  //     setValue("amName", user.middleName);
  //     setValue("alName", user.surname);
  //   }
  // }, [user]);

  const [gender, setGender] = useState();
  const [title, setTitle] = useState();
  const [zone, setZone] = useState();
  const [village, setVillage] = useState();
  const [gat, setGat] = useState();
  const [reservationName, setReservationName] = useState();
  const [documents, setDocuments] = useState();
  // Titles
  const [gTitleMars, setgTitleMars] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // getTitles
  const getgTitleMars = () => {
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setgTitleMars(
          r.data.title.map((row) => ({
            id: row.id,
            gtitleMar: row.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  console.log("errors", errors);
  useEffect(() => {
    // Date
    let appDate = new Date();
    // setNewDate(moment(appDate, "YYYY-MM-DD").format("YYYY-MM-DD"));

    //Gender
    axios
      .get(`${urls.CFCURL}/master/gender/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setGender(
          res.data.gender.map((j) => ({
            id: j.id,
            genderEn: j.gender,
            genderMr: j.genderMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
    //Title
    axios
      .get(`${urls.CFCURL}/master/title/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setTitle(
          res.data.title.map((j) => ({
            id: j.id,
            titleEn: j.title,
            titleMr: j.titleMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Zone
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setZone(
          res.data.zone.map((j) => ({
            id: j.id,
            zoneEn: j.zoneName,
            zoneMr: j.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Village
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setVillage(
          res.data.village.map((j) => ({
            id: j.id,
            villageEn: j.villageName,
            villageMr: j.villageNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Gat
    axios
      .get(`${urls.CFCURL}/master/gatMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setGat(
          r.data.gatMaster.map((j, i) => ({
            id: j.id,
            gatEn: j.gatNameEn,
            gatMr: j.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    //Reservation Name
    // axios.get(`${urls.TPURL}/landReservationMaster/getAll`).then((r) => {
    //   console.log("Table data: ", r.data);
    //   setReservationName(
    //     r.data.map((j, i) => ({
    //       id: j.id,
    //       landReservationNo: j.landReservationNo,
    //     })),
    //   );
    // });

    //DocumentsList
    axios
      .get(`${urls.CFCURL}/master/documentMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setDocuments(
          res.data.documentMaster.map((j, i) => ({
            id: j.id,
            documentNameEn: j.documentChecklistEn,
            documentNameMr: j.documentChecklistMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    getgTitleMars();
  }, []);
  useEffect(() => {
    if (router.query.pageMode === "View") {
      setDisabled(true);
    }
  }, []);
  // view
  return (
    <>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          padding: 1,
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
            background:
              "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          }}
        >
          <h2>
            <FormattedLabel id="zoneCertificateDetails" />
            {/* Zone Certificate Details */}
          </h2>
        </Box>

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <Grid container sx={{ padding: "10px" }}>
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.title}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.title ? true : false}
                >
                  <FormattedLabel id="title" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      disabled={router.query.title ? true : false}
                      value={
                        router.query.title ? router.query.title : field.value
                      }
                      onChange={(value) => field.onChange(value)}
                      label="title"
                    >
                      {title &&
                        title.map((value, index) => (
                          // <MenuItem key={index}  value={ value?.id}>
                          //   {gtitleMar.gtitleMar}
                          // </MenuItem>

                          <MenuItem key={index} value={value?.id}>
                            {
                              // @ts-ignore
                              language === "en"
                                ? value?.titleEn
                                : value?.titleEn
                            }
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

            {/* priority */}
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                _key={"firstNameEn"}
                labelName={"firstNameEn"}
                fieldName={"firstNameEn"}
                updateFieldName={"firstNameMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                width={230}
                disabled={disabled}
                label={<FormattedLabel id="firstNameEn" required />}
                error={!!errors.firstNameEn}
                helperText={
                  errors?.firstNameEn ? errors.firstNameEn.message : null
                }
              />
              {/* <TextField
                InputLabelProps={{
                  shrink:
                    (watch("firstNameEn") ? true : false) ||
                    (router.query.firstNameEn ? true : false),
                }}
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="firstNameEn" required />}
                variant="standard"
                {...register("firstNameEn")}
                error={!!errors.firstNameEn}
                helperText={
                  errors?.firstNameEn ? errors.firstNameEn.message : null
                }
              /> */}
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                _key={"middleNameEn"}
                labelName={"middleNameEn"}
                fieldName={"middleNameEn"}
                updateFieldName={"middleNameMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                width={230}
                disabled={disabled}
                label={<FormattedLabel id="middleNameEn" required />}
                error={!!errors.middleNameEn}
                helperText={
                  errors?.middleNameEn ? errors.middleNameEn.message : null
                }
              />
              {/* <TextField
                InputLabelProps={{
                  shrink:
                    (watch("middleNameEn") ? true : false) ||
                    (router.query.middleNameEn ? true : false),
                }}
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="middleNameEn" required />}
                variant="standard"
                {...register("middleNameEn")}
                error={!!errors.middleNameEn}
                helperText={
                  errors?.middleNameEn ? errors.middleNameEn.message : null
                }
              /> */}
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                _key={"surnameEn"}
                labelName={"surnameEn"}
                fieldName={"surnameEn"}
                updateFieldName={"surnameMr"}
                sourceLang={"eng"}
                targetLang={"mar"}
                width={230}
                disabled={disabled}
                label={<FormattedLabel id="surnameEn" required />}
                error={!!errors.surnameEn}
                helperText={errors?.surnameEn ? errors.surnameEn.message : null}
              />
              {/* <TextField
                InputLabelProps={{
                  shrink:
                    (watch("surnameEn") ? true : false) ||
                    (router.query.surnameEn ? true : false),
                }}
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="surnameEn" required />}
                variant="standard"
                {...register("surnameEn")}
                error={!!errors.surnameEn}
                helperText={errors?.surnameEn ? errors.surnameEn.message : null}
              /> */}
            </Grid>
            {/* marathi */}

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.title}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.title ? true : false}
                >
                  <FormattedLabel id="title" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // disabled={router.query.title ? true : false}
                      // value={
                      //   router.query.title ? router.query.title : field.value
                      // }
                      disabled={disabled}
                      {...field}
                      onChange={(value) => field.onChange(value)}
                      label="title"
                    >
                      {title &&
                        title.map((value, index) => (
                          // <MenuItem key={index}  value={ value?.id}>
                          //   {gtitleMar.gtitleMar}
                          // </MenuItem>

                          <MenuItem key={index} value={value?.id}>
                            {value?.titleMr}
                            {/* {
                              // @ts-ignore
                              language === "en"
                                ? value?.titleEn
                                : value?.titleEn
                            } */}
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
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                _key={"firstNameMr"}
                labelName={"firstNameMr"}
                fieldName={"firstNameMr"}
                updateFieldName={"firstNameEn"}
                sourceLang={"mar"}
                targetLang={"eng"}
                disabled={disabled}
                width={230}
                label={<FormattedLabel id="firstNameMr" required />}
                error={!!errors.firstNameMr}
                helperText={
                  errors?.firstNameMr ? errors.firstNameMr.message : null
                }
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                _key={"middleNameMr"}
                labelName={"middleNameMr"}
                fieldName={"middleNameMr"}
                updateFieldName={"middleNameEn"}
                sourceLang={"mar"}
                targetLang={"eng"}
                disabled={disabled}
                width={230}
                label={<FormattedLabel id="middleNameMr" required />}
                error={!!errors.middleNameMr}
                helperText={
                  errors?.middleNameMr ? errors.middleNameMr.message : null
                }
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Transliteration
                _key={"surnameMr"}
                labelName={"surnameMr"}
                fieldName={"surnameMr"}
                updateFieldName={"surnameEn"}
                sourceLang={"mar"}
                targetLang={"eng"}
                width={230}
                disabled={disabled}
                label={<FormattedLabel id="surnameMr" required />}
                error={!!errors.surnameMr}
                helperText={errors?.surnameMr ? errors.surnameMr.message : null}
              />
            </Grid>

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{
                  width: "230px",
                }}
                variant="standard"
                error={!!errors.gender}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.gender ? true : false}
                >
                  <FormattedLabel id="gender" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // value={field.value}
                      disabled={router.query.gender ? true : false}
                      value={
                        router.query.gender ? router.query.gender : field.value
                      }
                      onChange={(value) => field.onChange(value)}
                      label="gender"
                    >
                      {gender &&
                        gender.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              // @ts-ignore
                              value?.id
                            }
                          >
                            {
                              // @ts-ignore
                              language === "en"
                                ? value?.genderEn
                                : value?.genderMr
                            }
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

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch("mobile") ? true : false) ||
                    (router.query.mobile ? true : false),
                }}
                inputProps={{ maxLength: 10 }}
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="mobile" required />}
                variant="standard"
                {...register("mobile")}
                error={!!errors.mobile}
                helperText={errors?.mobile ? errors.mobile.message : null}
              />
            </Grid>

            {/* <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="panNo" required />}
                variant="standard"
                {...register('panNo')}
                error={!!errors.panNo}
                helperText={errors?.panNo ? errors.panNo.message : null}
              />
            </Grid> */}

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch("emailAddress") ? true : false) ||
                    (router.query.emailAddress ? true : false),
                }}
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="email" required />}
                variant="standard"
                {...register("emailAddress")}
                error={!!errors.emailAddress}
                helperText={
                  errors?.emailAddress ? errors.emailAddress.message : null
                }
              />
            </Grid>
            {/* <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TextField
                sx={{ width: '230px' }}
                id="standard-basic"
                label={<FormattedLabel id="flatNo" required />}
                variant="standard"
                {...register('buildingNo')}
                error={!!errors.buildingNo}
                helperText={
                  errors?.buildingNo ? errors.buildingNo.message : null
                }
                disabled={router.query.buildingNo ? true : false}
                defaultValue={
                  router.query.buildingNo ? router.query.buildingNo : ''
                }
              />
            </Grid> */}
            {/* <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TextField
                sx={{ width: '230px' }}
                id="standard-basic"
                label={<FormattedLabel id="buildingName" required />}
                variant="standard"
                {...register('buildingName')}
                error={!!errors.buildingName}
                helperText={
                  errors?.buildingName ? errors.buildingName.message : null
                }
                disabled={router.query.buildingName ? true : false}
                defaultValue={
                  router.query.buildingName ? router.query.buildingName : ''
                }
              />
            </Grid> */}

            {/* zone  */}
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ width: "230px", marginTop: "2%" }}
                variant="standard"
                error={!!errors.zoneName}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.zoneName ? true : false}
                >
                  <FormattedLabel id="zoneName" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      disabled={router.query.zoneName ? true : false}
                      value={
                        router.query.zoneName
                          ? router.query.zoneName
                          : field.value
                      }
                      onChange={(value) => field.onChange(value)}
                      label="zoneName"
                    >
                      {zone &&
                        zone.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              // @ts-ignore
                              value?.id
                            }
                          >
                            {
                              // @ts-ignore
                              language === "en" ? value?.zoneEn : value?.zoneMr
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="zoneName"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.zoneName ? errors.zoneName.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* zone end */}
            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ width: "230px", marginTop: "" }}
                variant="standard"
                error={!!errors.village}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.village ? true : false}
                >
                  <FormattedLabel id="villageName" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      disabled={router.query.village ? true : false}
                      value={
                        router.query.village
                          ? router.query.village
                          : field.value
                      }
                      onChange={(value) => field.onChange(value)}
                      label="village"
                    >
                      {village &&
                        village.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              // @ts-ignore
                              value?.id
                            }
                          >
                            {
                              // @ts-ignore
                              language === "en"
                                ? value?.villageEn
                                : value?.villageMr
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="village"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.village ? errors.village.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ width: "230px", marginTop: "2%" }}
                variant="standard"
                error={!!errors.gatNo}
              >
                <InputLabel
                  id="demo-simple-select-standard-label"
                  disabled={router.query.gatNo ? true : false}
                >
                  <FormattedLabel id="gatName" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      disabled={router.query.gatNo ? true : false}
                      value={
                        router.query.gatNo ? router.query.gatNo : field.value
                      }
                      onChange={(value) => field.onChange(value)}
                      label="gatNo"
                    >
                      {gat &&
                        gat.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              // @ts-ignore
                              value?.id
                            }
                          >
                            {
                              // @ts-ignore
                              language === "en" ? value?.gatEn : value?.gatMr
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="gatNo"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.gatNo ? errors.gatNo.message : null}
                </FormHelperText>
              </FormControl>
            </Grid> */}

            {/* <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                style={{
                  width: "230px",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "2%",
                }}
                error={!!errors.serviceCompletionDate}
              >
                <Controller
                  control={control}
                  name="serviceCompletionDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        error={!!errors.serviceCompletionDate}
                        inputFormat="dd/MM/yyyy"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="serviceCompletionDate" required />
                          </span>
                        }
                        disabled={router.query.serviceCompletionDate ? true : false}
                        value={
                          router.query.serviceCompletionDate
                            ? router.query.serviceCompletionDate
                            : field.value
                        }
                        onChange={(date) => field.onChange(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))}
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            error={!!errors.serviceCompletionDate}
                            {...params}
                            size="small"
                            fullWidth
                            variant="standard"
                            // InputLabelProps={{
                            //   style: {
                            //     fontSize: 15,
                            //     marginTop: 4,
                            //   },
                            // }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  )}
                />
                <FormHelperText>
                  {errors?.serviceCompletionDate ? errors.serviceCompletionDate.message : null}
                </FormHelperText>
              </FormControl>
            </Grid> */}

            <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                InputLabelProps={{
                  shrink:
                    (watch("serveyNo") ? true : false) ||
                    (router.query.serveyNo ? true : false),
                }}
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="surveyNo" required />}
                variant="standard"
                {...register("serveyNo")}
                error={!!errors.serveyNo}
                helperText={errors?.serveyNo ? errors.serveyNo.message : null}
              />
            </Grid>

            {/* <Grid
              item
              xl={3}
              lg={3}
              md={6}
              sm={6}
              xs={12}
              p={1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {" "}
              <TextField
                sx={{ width: 230 }}
                id="standard-basic"
                label={<FormattedLabel id="aadharNo" required />}
                variant="standard"
                {...register("aadhaarNo")}
                error={!!errors.aadhaarNo}
                helperText={errors?.aadhaarNo ? errors.aadhaarNo.message : null}
              />
            </Grid> */}
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default PersonalDetails;
