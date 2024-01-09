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
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util";
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
const AddressDetails = () => {
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
  const [open, setOpen] = React.useState(false);
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

  const [newDate, setNewDate] = useState("");
  const [reservationName, setReservationName] = useState();
  const [zone, setZone] = useState();
  const [village, setVillage] = useState();
  const [gat, setGat] = useState();
  useEffect(() => {
    // Date
    let appDate = new Date();
    setNewDate(moment(appDate, "YYYY-MM-DD").format("YYYY-MM-DD"));

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
    axios
      .get(`${urls.TPURL}/reservationDetail/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Table data1111111:", r.data);
        setReservationName(
          r.data.reservationDetail.map((j, i) => ({
            id: j.id,
            landReservationNo: j.landReservationNo,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });

    // //DocumentsList
    // axios.get(`${urls.CFCURL}/master/documentMaster/getAll`).then((res) => {
    //   setDocuments(
    //     res.data.documentMaster.map((j, i) => ({
    //       id: j.id,
    //       documentNameEn: j.documentChecklistEn,
    //       documentNameMr: j.documentChecklistMr,
    //     })),
    //   );
    // });
  }, []);

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
              <FormattedLabel id="partmapDetails" />
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
                  error={!!errors.villageName}
                >
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={router.query.villageName ? true : false}
                  >
                    <FormattedLabel id="villageName" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        disabled={router.query.villageName ? true : false}
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
              <Grid
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
              </Grid>
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
                  error={!!errors.reservationNo}
                >
                  <InputLabel
                    id="demo-simple-select-standard-label"
                    disabled={router.query.reservationNo ? true : false}
                  >
                    <FormattedLabel id="reservationNo" required />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        disabled={router.query.reservationNo ? true : false}
                        value={
                          router.query.reservationNo
                            ? router.query.reservationNo
                            : field.value
                        }
                        onChange={(value) => field.onChange(value)}
                        label="reservationNo"
                      >
                        {reservationName &&
                          reservationName.map((value, index) => (
                            <MenuItem
                              key={index}
                              value={
                                // @ts-ignore
                                value?.id
                              }
                            >
                              {/* {
                                            // @ts-ignore
                                            language === 'en'
                                              ? value?.reservationNameEn
                                              : value?.reservationNameMr
                                          } */}
              {/* {value?.landReservationNo}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="reservationNo"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.reservationNo
                      ? errors.reservationNo.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}

              <Grid
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
              </Grid>
              {/* marathi */}

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
                <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("pincode") ? true : false) ||
                      (router.query.pincode ? true : false),
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="pincode" required />}
                  variant="standard"
                  {...register("pincode")}
                  error={!!errors.pincode}
                  helperText={errors?.pincode ? errors.pincode.message : null}
                />
              </Grid> */}

              <Grid
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
                <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("surveyNumber") ? true : false) ||
                      (router.query.surveyNumber ? true : false),
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="surveyNumber" required />}
                  variant="standard"
                  {...register("surveyNumber")}
                  error={!!errors.surveyNumber}
                  helperText={
                    errors?.surveyNumber ? errors.surveyNumber.message : null
                  }
                />
              </Grid>

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
                <TextField
                  InputLabelProps={{
                    shrink:
                      (watch("citySurveyNo") ? true : false) ||
                      (router.query.citySurveyNo ? true : false),
                  }}
                  sx={{ width: 230 }}
                  id="standard-basic"
                  label={<FormattedLabel id="citySurveyNo" required />}
                  variant="standard"
                  {...register("citySurveyNo")}
                  error={!!errors.citySurveyNo}
                  helperText={
                    errors?.citySurveyNo ? errors.citySurveyNo.message : null
                  }
                />
              </Grid> */}
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
                      {/* <FormattedLabel id="viewLocationOnMap" /> */}
                      view Location On Map
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

export default AddressDetails;
