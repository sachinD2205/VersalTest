import { ThemeProvider } from "@emotion/react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import * as yup from "yup";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import styles from "./view.module.css";
// import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Unstable_Grid2";
import { useSelector } from "react-redux";

// import UploadButton from "../../../../../components/fileUpload/UploadButton";
import axios from "axios";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const ReservationDetailsView = () => {
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
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    resolver: yupResolver(yup.object().shape()),
    // mode: "onSubmit",
  });

  const language = useSelector((state) => state?.labels.language);
  const [legend, setLegend] = useState("");
  const [roadType, setroadType] = useState([]);

  const [legendDropDown, setLegendDropDown] = useState([]);
  const [zoneDropDown, setzoneDropDown] = useState([]);
  const [villageNameDropDown, setVillageNameDropDown] = useState([]);
  const [gatDropDown, setGatDropDown] = useState([]);
  const [allVillageName, setAllVillageName] = useState([]);
  const [possessionDetailsArray, setPossessionDetailsArray] = useState([]);
  const [possessionType, setPossessionType] = useState([]);
  useEffect(() => {
    axios
      .get(`${urls.TPURL}/reservationTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log("Reservation Type Master: ", res.data.reservationType);
        setLegendDropDown(
          res.data.reservationType.map((j, i) => ({
            srNo: i + 1,
            ...j,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const getAllZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Zone data:", r.data);
        setzoneDropDown(
          // @ts-ignore
          r.data.zone.map((j, i) => ({
            id: j.id,
            zoneNameEn: j.zoneName,
            zoneNameMr: j.zoneNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getAllVillage = () => {
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Village data: ", r.data);
        setVillageNameDropDown(
          r.data.village.map((j) => ({
            id: j.id,
            villageNameEn: j.villageName,
            villageNameMr: j.villageNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getAllGat = () => {
    axios
      .get(`${urls.TPURL}/master/mstGat/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Gat data:11", r);
        setGatDropDown(
          r.data.mstGat.map((j, i) => ({
            id: j.id,

            gatNameEn: j.gatNameEn,
            gatNameMr: j.gatNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const applicationGetById = (id) => {
    console.log("ApplicationId");
    axios
      .get(`${urls.TPURL}/reservationDetail/getById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        reset({ ...r.data });
        setPossessionDetailsArray(r.data.possessionDetails);
        console.log("yyyyyyyyyyy", r.data.possessionDetails);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getPossessionType = () => {
    axios
      .get(`${urls.TPURL}/mstPossessionType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        setPossessionType(
          r.data.possessionType.map((row) => ({
            id: row.id,

            possessionTypeEn: row.possessionTypeEn,
            possessionTypeMr: row.possessionTypeMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getAllRoadType = () => {
    axios
      .get(`${urls.TPURL}/roadTypeMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setroadType(
          res.data.roadType.map((j, i) => ({
            srNo: i + 1,
            ...j,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    getPossessionType();
  }, []);
  useEffect(() => {
    getAllRoadType();
  }, []);
  console.log("roadType", roadType);
  useEffect(() => {
    applicationGetById(router.query.id);
  }, [router.query.id]);

  useEffect(() => {
    getAllZone();
    getAllVillage();
    getAllGat();
  }, [watch("zoneId"), watch("villageId"), watch("gatId")]);
  return (
    // <></>
    <ThemeProvider theme={theme}>
      <Paper
        style={{
          marginTop: "120px",
          marginBottom: "80px",
        }}
        elevation={2}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>Reservation Detatils</strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container sx={{ padding: "10px" }}>
            {/* -------------------------zone start--------------------------- */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label={language == "en" ? "Zone Name" : "झोनचे नाव"}
                variant="standard"
                {...register("zoneId")}
                name="zoneId"
                value={
                  typeof watch("zoneId") === "string"
                    ? watch("zoneId")
                        ?.split(",")
                        .slice(1, -1)
                        ?.map((val) => {
                          return zoneDropDown?.find((obj) => {
                            return obj.id == val;
                          })?.zoneNameEn;
                        })
                        .toString()
                    : "-------"
                }
                InputLabelProps={{
                  shrink:
                    router.query.applicationNumber || watch("zoneId")
                      ? true
                      : false,
                }}
                error={!!errors.zoneId}
                helperText={errors?.zoneId ? errors.zoneId.message : null}
                disabled
              />
            </Grid>

            {/* -------------------------zone end--------------------------- */}

            {/* -------------------------village start--------------------------- */}

            <Grid
              item
              xl={4}
              lg={4}
              md={6}
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label={language == "en" ? "Village Name" : "झोनचे नाव"}
                variant="standard"
                {...register("villageId")}
                value={
                  typeof watch("villageId") === "string"
                    ? watch("villageId")
                        ?.split(",")
                        .slice(1, -1)
                        ?.map((val) => {
                          return villageNameDropDown?.find((obj) => {
                            return obj.id == val;
                          })?.villageNameEn;
                        })
                        .toString()
                    : "-------"
                }
                InputLabelProps={{
                  shrink:
                    router.query.applicationNumber || watch("villageId")
                      ? true
                      : false,
                }}
                error={!!errors.villageId}
                helperText={errors?.villageId ? errors.villageId.message : null}
                disabled
              />
            </Grid>

            {/* -------------------------village end--------------------------- */}

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
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label={language == "en" ? "Gat Name" : "झोनचे नाव"}
                variant="standard"
                {...register("gatId")}
                value={
                  typeof watch("gatId") === "string"
                    ? watch("gatId")
                        ?.split(",")
                        .slice(1, -1)
                        ?.map((val) => {
                          return gatDropDown?.find((obj) => {
                            return obj.id == val;
                          })?.gatNameEn;
                        })
                        .toString()
                    : "-------"
                }
                InputLabelProps={{
                  shrink:
                    router.query.applicationNumber || watch("gatId")
                      ? true
                      : false,
                }}
                error={!!errors.gatId}
                helperText={errors?.gatId ? errors.gatId.message : null}
                disabled
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
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label={<FormattedLabel id="surveyNo" required />}
                variant="standard"
                {...register("surveyNo")}
                InputLabelProps={{
                  shrink:
                    router.query.applicationNumber || watch("surveyNo")
                      ? true
                      : false,
                }}
                error={!!errors.surveyNo}
                helperText={errors?.surveyNo ? errors.surveyNo.message : null}
                disabled
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
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label="City survey No"
                // label={<FormattedLabel id="citySurveyNo" required />}
                variant="standard"
                InputLabelProps={{
                  shrink:
                    router.query.applicationNumber || watch("citySurveyNo")
                      ? true
                      : false,
                }}
                {...register("citySurveyNo")}
                error={!!errors.citySurveyNo}
                helperText={
                  errors?.citySurveyNo ? errors.citySurveyNo.message : null
                }
                disabled
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
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                InputLabelProps={{
                  shrink:
                    router.query.applicationNumber || watch("landReservationNo")
                      ? true
                      : false,
                }}
                id="standard-basic"
                label={<FormattedLabel id="landReservationNo" required />}
                variant="standard"
                {...register("landReservationNo")}
                error={!!errors.landReservationNo}
                helperText={
                  errors?.landReservationNo
                    ? errors.landReservationNo.message
                    : null
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
                sx={{ width: "230px", marginTop: "2%" }}
                variant="standard"
                error={!!errors.landReservationLegend}
              >
                <InputLabel id="demo-simple-select-standard-label" disabled>
                  <FormattedLabel id="landReservationLegend" required />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      // value={field.value}
                      disabled
                      value={
                        router.query.landReservationLegend
                          ? router.query.landReservationLegend
                          : field.value
                      }
                      onChange={(value) => {
                        field.onChange(value);
                        setLegend(value.target.value);
                      }}
                      label="landReservationLegend"
                    >
                      {legendDropDown &&
                        legendDropDown.map((value, index) => (
                          <MenuItem
                            key={index}
                            value={
                              // @ts-ignore
                              value?.id
                            }
                          >
                            {
                              // @ts-ignore
                              value?.legend
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="landReservationLegend"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.landReservationLegend
                    ? errors.landReservationLegend.message
                    : null}
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
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label={<FormattedLabel id="reservationNameEn" />}
                variant="standard"
                // {...register('reservationNameEn')}
                error={!!errors.reservationNameEn}
                helperText={
                  errors?.reservationNameEn
                    ? errors.reservationNameEn.message
                    : null
                }
                // InputLabelProps={{ shrink: legend ? true : false }}
                disabled
                value={
                  watch("landReservationLegend")
                    ? legendDropDown.find((obj) => {
                        // @ts-ignore
                        return obj?.id === watch("landReservationLegend");
                        // @ts-ignore
                      })?.reservationNameEn
                    : ""
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
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label={<FormattedLabel id="reservationNameMr" />}
                variant="standard"
                // {...register('reservationNameMr')}
                error={!!errors.reservationNameMr}
                helperText={
                  errors?.reservationNameMr
                    ? errors.reservationNameMr.message
                    : null
                }
                // InputLabelProps={{ shrink: legend ? true : false }}
                disabled
                value={
                  watch("landReservationLegend")
                    ? legendDropDown.find((obj) => {
                        // @ts-ignore
                        return obj?.id === watch("landReservationLegend");
                        // @ts-ignore
                      })?.reservationNameMr
                    : ""
                }
              />
            </Grid>
            {watch("landReservationLegend") &&
              watch("landReservationLegend") == 1 && (
                <>
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
                      sx={{
                        width: "230px",
                        marginTop: "2%",
                      }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadLength" required />}
                      variant="standard"
                      {...register("roadLength")}
                      InputLabelProps={{
                        shrink:
                          router.query.applicationNumber || watch("roadLength")
                            ? true
                            : false,
                      }}
                      error={!!errors.roadLength}
                      helperText={
                        errors?.roadLength ? errors.roadLength.message : null
                      }
                      disabled
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
                      sx={{
                        width: "230px",
                        marginTop: "2%",
                      }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadWidth" required />}
                      variant="standard"
                      {...register("roadWidth")}
                      error={!!errors.roadWidth}
                      InputLabelProps={{
                        shrink:
                          router.query.applicationNumber || watch("roadWidth")
                            ? true
                            : false,
                      }}
                      helperText={
                        errors?.roadWidth ? errors.roadWidth.message : null
                      }
                      disabled
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
                      sx={{
                        width: "230px",
                        marginTop: "2%",
                      }}
                      id="standard-basic"
                      label={<FormattedLabel id="roadNumber" required />}
                      variant="standard"
                      {...register("roadNo")}
                      InputLabelProps={{
                        shrink:
                          router.query.applicationNumber || watch("roadNo")
                            ? true
                            : false,
                      }}
                      error={!!errors.roadNo}
                      helperText={errors?.roadNo ? errors.roadNo.message : null}
                      disabled
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
                      style={{ backgroundColor: "white", width: "250px" }}
                      id="roadType"
                      name="roadType"
                      label={<FormattedLabel id="RoadType" />}
                      variant="standard"
                      value={
                        roadType &&
                        roadType?.find((i) => i.id == watch("roadType"))
                          ?.roadSizeEn
                      }
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch("roadType") ? true : false,
                      }}
                    />
                  </Grid>
                </>
              )}

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
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label={<FormattedLabel id="reservationAreaInHector" required />}
                variant="standard"
                {...register("reservationAreaInHector")}
                InputLabelProps={{
                  shrink:
                    router.query.applicationNumber ||
                    watch("reservationAreaInHector")
                      ? true
                      : false,
                }}
                error={!!errors.reservationAreaInHector}
                helperText={
                  errors?.reservationAreaInHector
                    ? errors.reservationAreaInHector.message
                    : null
                }
                disabled
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
                sx={{
                  width: "230px",
                  marginTop: "2%",
                }}
                id="standard-basic"
                label={<FormattedLabel id="landUnderPossession" required />}
                variant="standard"
                {...register("landUnderPossession")}
                error={!!errors.landUnderPossession}
                InputLabelProps={{
                  shrink:
                    router.query.applicationNumber ||
                    watch("landUnderPossession")
                      ? true
                      : false,
                }}
                helperText={
                  errors?.landUnderPossession
                    ? errors.landUnderPossession.message
                    : null
                }
                disabled
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
                    {/* <FormattedLabel id="viewLocationOnMap" /> */}
                    view Location On Map
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "1%",
            }}
          >
            <Box
              className={styles.details1}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "98%",
                height: "auto",
                overflow: "auto",
                padding: "0.5%",
                color: "black",
                fontSize: 19,
                fontWeight: 500,
                // borderRadius: 100,
              }}
            >
              <strong className={styles.fancy_link1}>
                Possession Detatils
              </strong>
            </Box>
          </Box>
          <Grid container sx={{ padding: "10px" }}>
            {/* Land resrvation details start */}

            {possessionDetailsArray &&
              possessionDetailsArray.map((item, i) => (
                <>
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
                      style={{ backgroundColor: "white", width: "250px" }}
                      id={`${item.possessionDate}`}
                      name={`${item.possessionDate}`}
                      label={<FormattedLabel id="possessionDate" />}
                      // label="Zone "
                      // variant="outlined"
                      variant="standard"
                      value={`${item.possessionDate}`}
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch(`${item.possessionDate}`)
                            ? true
                            : false,
                      }}
                      //  error={!!errors.`${item.possessionDate}`}
                      // helperText={errors?.`${item.owner_name}` ? errors.`${item.possessionDate}`.message : null}
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
                      style={{ backgroundColor: "white", width: "250px" }}
                      id={`${item.possessionType}`}
                      name={`${item.possessionType}`}
                      label={<FormattedLabel id="possessionType" />}
                      // label="Zone "
                      // variant="outlined"
                      variant="standard"
                      // value={`${item.possessionType}`}
                      value={
                        possessionType &&
                        possessionType?.find(
                          (i) => i.id == item?.possessionType,
                        )?.possessionTypeEn
                      }
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch(`${item.possessionType}`)
                            ? true
                            : false,
                      }}
                      //  error={!!errors.`${item.possessionType}`}
                      // helperText={errors?.`${item.owner_name}` ? errors.`${item.possessionType}`.message : null}
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
                      style={{ backgroundColor: "white", width: "250px" }}
                      id={`${item.owner_name}`}
                      name={`${item.owner_name}`}
                      label={<FormattedLabel id="ownerName" />}
                      // label="Zone "
                      // variant="outlined"
                      variant="standard"
                      value={`${item.owner_name}`}
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch(`${item.owner_name}`)
                            ? true
                            : false,
                      }}
                      //  error={!!errors.`${item.owner_name}`}
                      // helperText={errors?.`${item.owner_nam}e` ? errors.`${item.owner_name}`.message : null}
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
                      style={{ backgroundColor: "white", width: "250px" }}
                      id={`${item.surveyNumber}`}
                      name={`${item.surveyNumber}`}
                      label={<FormattedLabel id="surveyNo" />}
                      // label="Zone "
                      // variant="outlined"
                      variant="standard"
                      value={`${item.surveyNumber}`}
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch(`${item.surveyNumber}`)
                            ? true
                            : false,
                      }}
                      //  error={!!errors.`${item.surveyNumber}`}
                      // helperText={errors?.`${item.owner_nam}e` ? errors.`${item.surveyNumber}`.message : null}
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
                      style={{ backgroundColor: "white", width: "250px" }}
                      id={`${item.area}`}
                      name={`${item.area}`}
                      label={<FormattedLabel id="reservationAreaInsqmtr" />}
                      // label="Zone "
                      // variant="outlined"
                      variant="standard"
                      value={`${item.area}`}
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch(`${item.area}`)
                            ? true
                            : false,
                      }}
                      //  error={!!errors.`${item.area}`}
                      // helperText={errors?.`${item.owner_nam}e` ? errors.`${item.area}`.message : null}
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
                      style={{ backgroundColor: "white", width: "250px" }}
                      id={`${item.documentNumber}`}
                      name={`${item.documentNumber}`}
                      label={<FormattedLabel id="documentNo" />}
                      // label="Zone "
                      // variant="outlined"
                      variant="standard"
                      value={`${item.documentNumber}`}
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch(`${item.documentNumber}`)
                            ? true
                            : false,
                      }}
                      //  error={!!errors.`${item.documentNumber}`}
                      // helperText={errors?.`${item.owner_nam}e` ? errors.`${item.documentNumber}`.message : null}
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
                      style={{ backgroundColor: "white", width: "250px" }}
                      id={`${item.remark}`}
                      name={`${item.remark}`}
                      label={<FormattedLabel id="remark" />}
                      // label="Zone "
                      // variant="outlined"
                      variant="standard"
                      value={`${item.remark}`}
                      InputLabelProps={{
                        shrink:
                          router.query.id || watch(`${item.remark}`)
                            ? true
                            : false,
                      }}
                      //  error={!!errors.`${item.remark}`}
                      // helperText={errors?.`${item.owner_nam}e` ? errors.`${item.remark}`.message : null}
                    />
                  </Grid>
                </>
              ))}
          </Grid>
          <Button
            type="primary"
            variant="contained"
            onClick={() => {
              router.push(`/townPlanning/transactions/reservationDetail/table`);
            }}
          >
            Exit
          </Button>
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default ReservationDetailsView;
