import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util";
import Transliteration from "../common/linguosol/transliteration";
let drawerWidth;

// Main
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

// DrawerHeader
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));
// Component
const PersonalDetails = () => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const router = useRouter();
  const user = useSelector((state) => state?.user.user);
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
  //   setValue("title", user.title);
  //   setValue("titleMr", user.title);
  //   setValue("firstNameEn", user.firstName);
  //   setValue("middleNameEn", user.middleName);
  //   setValue("surnameEn", user.surname);
  //   setValue("firstNameMr", user.firstNamemr);
  //   setValue("middleNameMr", user.middleNamemr);
  //   setValue("surnameMr", user.surnamemr);
  //   setValue("gender", user.gender);
  //   setValue("mobile", user.mobile);
  //   setValue("emailAddress", user.emailID);
  // }, [user]);
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

  const [temp, setTemp] = useState();
  const addressChange = (e) => {
    setValue("isApplicant", e.target.checked);

    console.log("isApplicant", getValues("isApplicant"));
    if (e.target.checked) {
      setValue("title", getValues("title"));
      setTemp(true);
    } else {
      setValue("gtitle", "");
      setValue("gtitleMar", "");
      setValue("gfName", "");
      setTemp();
    }
  };

  const [gender, setGender] = useState();
  const [title, setTitle] = useState();
  const [zone, setZone] = useState();
  const [village, setVillage] = useState();
  const [gat, setGat] = useState();
  const [reservationName, setReservationName] = useState();
  const [documents, setDocuments] = useState();
  // Titles
  const [gTitleMars, setgTitleMars] = useState([]);

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
    // axios
    //   .get(`${urls.TPURL}/landReservationMaster/getAll`, {
    //     headers: {
    //       Authorization: `Bearer ${user.token}`,
    //     },
    //   })
    //   .then((r) => {
    //     console.log("Table data: ", r.data);
    //     setReservationName(
    //       r.data.map((j, i) => ({
    //         id: j.id,
    //         landReservationNo: j.landReservationNo,
    //       })),
    //     );
    //   })
    //   .catch((error) => {
    //     callCatchMethod(error, language);
    //   });

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

  const [open, setOpen] = React.useState(false);
  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "50%";
  };

  // Close Drawer
  const handleDrawerClose = () => {
    setOpen(false);
    drawerWidth = 0;
  };

  const [disabled, setDisabled] = useState(false);
  // view
  return (
    <>
      <Main>
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
              <FormattedLabel id="personalDetails" />
            </h2>
          </Box>

          {/* <div style={{ marginLeft: "25px" }}>
            <FormControlLabel
              control={
                <Checkbox checked={getValues("isApplicant") ? true : false} />
              }
              label=<Typography>
                <b>applicant</b>
              </Typography>
              onChange={(e) => {
                addressChange(e);
              }}
            />
          </div> */}

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
                    disabled={router.query.disabled ? true : false}
                  >
                    <FormattedLabel id="titleInenglish" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        disabled={router.query.disabled ? true : false}
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

                <Transliteration
                  disabled={router.query.disabled ? true : false}
                  InputLabelProps={{
                    shrink:
                      (watch("firstNameEn") ? true : false) ||
                      (router.query.firstNameEn ? true : false),
                  }}
                  _key={"firstNameEn"}
                  labelName={"firstNameEn"}
                  fieldName={"firstNameEn"}
                  updateFieldName={"firstNameMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  label={<FormattedLabel id="firstNameEn" required />}
                  error={!!errors.firstNameEn}
                  helperText={
                    errors?.firstNameEn ? errors.firstNameEn.message : null
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

                <Transliteration
                  InputLabelProps={{
                    shrink:
                      (watch("middleNameEn") ? true : false) ||
                      (router.query.middleNameEn ? true : false),
                  }}
                  disabled={router.query.disabled ? true : false}
                  _key={"middleNameEn"}
                  labelName={"middleNameEn"}
                  fieldName={"middleNameEn"}
                  updateFieldName={"middleNameMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  label={<FormattedLabel id="middleNameEn" required />}
                  error={!!errors.middleNameEn}
                  helperText={
                    errors?.middleNameEn ? errors.middleNameEn.message : null
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
                  helperText={
                    errors?.surnameEn ? errors.surnameEn.message : null
                  }
                /> */}

                <Transliteration
                  InputLabelProps={{
                    shrink:
                      (watch("surnameEn") ? true : false) ||
                      (router.query.surnameEn ? true : false),
                  }}
                  disabled={router.query.disabled ? true : false}
                  _key={"surnameEn"}
                  labelName={"surnameEn"}
                  fieldName={"surnameEn"}
                  updateFieldName={"surnameMr"}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  width={230}
                  label={<FormattedLabel id="surnameEn" required />}
                  error={!!errors.surnameEn}
                  helperText={
                    errors?.surnameEn ? errors.surnameEn.message : null
                  }
                />
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
                  variant="standard"
                  error={!!errors.titleMr}
                  sx={{ marginTop: 2 }}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    <FormattedLabel id="titleInmarathi" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);

                          setValue("gtitle", value.target.value);
                        }}
                        label="Title  "
                        id="demo-simple-select-standard"
                        labelId="id='demo-simple-select-standard-label'"
                      >
                        {gTitleMars &&
                          gTitleMars.map((gtitleMar, index) => (
                            <MenuItem key={index} value={gtitleMar.id}>
                              {gtitleMar.gtitleMar}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="titleMr"
                    control={control}
                    defaultValue=""
                    disabled={router.query.disabled ? true : false}
                  />
                  <FormHelperText>
                    {errors?.titleMr ? errors.titleMr.message : null}
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
                {/* <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("firstNameMr") ? true : false) ||
                      (router.query.firstNameMr ? true : false),
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="firstNameMr" required />}
                  variant="standard"
                  {...register("firstNameMr")}
                  error={!!errors.firstNameMr}
                  helperText={
                    errors?.firstNameMr ? errors.firstNameMr.message : null
                  }
                /> */}

                <Transliteration
                  InputLabelProps={{
                    shrink:
                      (watch("firstNameMr") ? true : false) ||
                      (router.query.firstNameMr ? true : false),
                  }}
                  disabled={router.query.disabled ? true : false}
                  _key={"firstNameMr"}
                  labelName={"firstNameMr"}
                  fieldName={"firstNameMr"}
                  updateFieldName={"firstNameEn"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
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
                {/* <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("middleNameMr") ? true : false) ||
                      (router.query.middleNameMr ? true : false),
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="middleNameMr" required />}
                  variant="standard"
                  {...register("middleNameMr")}
                  error={!!errors.middleNameMr}
                  helperText={
                    errors?.middleNameMr ? errors.middleNameMr.message : null
                  }
                /> */}

                <Transliteration
                  InputLabelProps={{
                    shrink:
                      (watch("middleNameMr") ? true : false) ||
                      (router.query.middleNameMr ? true : false),
                  }}
                  disabled={router.query.disabled ? true : false}
                  _key={"middleNameMr"}
                  labelName={"middleNameMr"}
                  fieldName={"middleNameMr"}
                  updateFieldName={"middleNameEn"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
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
                {/* <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("surnameMr") ? true : false) ||
                      (router.query.surnameMr ? true : false),
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="surnameMr" required />}
                  variant="standard"
                  {...register("surnameMr")}
                  error={!!errors.surnameMr}
                  helperText={
                    errors?.surnameMr ? errors.surnameMr.message : null
                  }
                /> */}

                <Transliteration
                  InputLabelProps={{
                    shrink:
                      (watch("surnameMr") ? true : false) ||
                      (router.query.surnameMr ? true : false),
                  }}
                  disabled={router.query.disabled ? true : false}
                  _key={"surnameMr"}
                  labelName={"surnameMr"}
                  fieldName={"surnameMr"}
                  updateFieldName={"surnameEn"}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  width={230}
                  label={<FormattedLabel id="surnameMr" required />}
                  error={!!errors.surnameMr}
                  helperText={
                    errors?.surnameMr ? errors.surnameMr.message : null
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
                <FormControl
                  sx={{
                    width: "230px",
                  }}
                  variant="standard"
                  error={!!errors.gender}
                >
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={router.query.disabled ? true : false}
                  >
                    <FormattedLabel id="gender" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        // value={field.value}
                        disabled={router.query.disabled ? true : false}
                        value={
                          router.query.gender
                            ? router.query.gender
                            : field.value
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
                      (watch("address") ? true : false) ||
                      (router.query.address ? true : false),
                  }}
                  disabled={router.query.disabled ? true : false}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="address" required />}
                  variant="standard"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors?.address ? errors.address.message : null}
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
                <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("mobile") ? true : false) ||
                      (router.query.mobile ? true : false),
                  }}
                  inputProps={{ maxLength: 10 }}
                  disabled={router.query.disabled ? true : false}
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
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("panNo") ? true : false) ||
                      (router.query.panNo ? true : false),
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="panNo" required />}
                  variant="standard"
                  {...register("panNo")}
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
                  disabled={router.query.disabled ? true : false}
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
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("aadhaarNo") ? true : false) ||
                      (router.query.aadhaarNo ? true : false),
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="aadharNo" required />}
                  variant="standard"
                  {...register("aadhaarNo")}
                  error={!!errors.aadhaarNo}
                  helperText={
                    errors?.aadhaarNo ? errors.aadhaarNo.message : null
                  }
                />
              </Grid> */}
            </Grid>
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
                <FormattedLabel id="partPlanDetails" />
              </h2>
            </Box>
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
                  // sx={{ width: "230px", marginTop: "2%" }}
                  variant="standard"
                  error={!!errors.villageName}
                >
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={router.query.disabled ? true : false}
                  >
                    <FormattedLabel id="villageName" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        disabled={router.query.disabled ? true : false}
                        value={
                          router.query.villageName
                            ? router.query.villageName
                            : field.value
                        }
                        onChange={(value) => field.onChange(value)}
                        label="villageName"
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
                    name="villageName"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.villageName ? errors.villageName.message : null}
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
                  // sx={{ width: "230px" }}
                  variant="standard"
                  error={!!errors.tDRZone}
                >
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={router.query.tDRZone ? true : false}
                  >
                    <FormattedLabel id="zoneName" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        disabled={router.query.tDRZone ? true : false}
                        value={
                          router.query.tDRZone
                            ? router.query.tDRZone
                            : field.value
                        }
                        onChange={(value) => field.onChange(value)}
                        label="tDRZone"
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
                                language === "en"
                                  ? value?.zoneEn
                                  : value?.zoneMr
                              }
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="tDRZone"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.tDRZone ? errors.tDRZone.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}
              {/* <Grid
              item
              xl={4}
              lg={4}
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
                      (watch("surveyNumber") ? true : false) ||
                      (router.query.surveyNumber ? true : false),
                  }}
                  disabled={router.query.disabled ? true : false}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="surveyNo" required />}
                  variant="standard"
                  {...register("surveyNumber")}
                  error={!!errors.surveyNumber}
                  helperText={
                    errors?.surveyNumber ? errors.surveyNumber.message : null
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
                <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("citySurveyNo") ? true : false) ||
                      (router.query.citySurveyNo ? true : false),
                  }}
                  disabled={router.query.disabled ? true : false}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="citySurveyNo" />}
                  variant="standard"
                  {...register("citySurveyNo")}
                  error={!!errors.citySurveyNo}
                  helperText={
                    errors?.citySurveyNo ? errors.citySurveyNo.message : null
                  }
                />
              </Grid>

              {watch("disabledFieldInputState") ? (
                <></>
              ) : (
                <>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Button
                      sx={{
                        marginTop: "5vh",
                        margin: "normal",
                        width: 240,
                        // height: "40px",
                      }}
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        handleDrawerOpen();
                      }}
                    >
                      <FormattedLabel id="viewLocationOnMap" />
                      {/* view Location On Map */}
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Paper>
      </Main>
      {/** Drawer  */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {/* <DrawerHeader>
          <IconButton onClick={()handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader> */}
        {/* <Divider /> */}

        <Box
          style={{
            left: 0,
            position: "absolute",
            top: "50%",
            backgroundColor: "#bdbdbd",
          }}
        >
          <IconButton
            color="primary"
            aria-label="open drawer"
            // edge="end"
            onClick={() => handleDrawerClose()}
            sx={{ width: "30px", height: "75px", borderRadius: 0 }}
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>
        <img
          src="/map.png"
          //hegiht='300px'
          width="80px"
          alt="Map Not Found"
          style={{ width: "100%", height: "100%" }}
        />
      </Drawer>
      {/** End Drawer  */}
    </>
  );
};

export default PersonalDetails;
