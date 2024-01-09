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
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../../pages/townPlanning/transactions/partPlan/view.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
// Component
const AddressDetails = () => {
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

  //   if (router.query.pageMode === "Edit" || router.query.pageMode === "Add") {
  //     console.log("router.query.pageMode", router.query);
  //     console.log("atitleMr", getValues("atitleMr"));

  //     setValue("atitle", user.title);
  //     setValue("afName", user.firstName);
  //     setValue("amName", user.middleName);
  //     setValue("alName", user.surname);
  //   }
  // }, [user]);
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
      .get(`${urls.TPURL}/landReservationMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        console.log("Table data: ", r.data);
        setReservationName(
          r.data.map((j, i) => ({
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
            <FormattedLabel id="partmapDetails" />
          </h2>
        </Box>

        <Box
          sx={{
            marginTop: 2,
          }}
        >
          <Grid container sx={{ padding: "10px" }}>
            <Paper className={styles.leftSide}>
              {/* <div style={{ width: "100%", marginBottom: "1vw" }}>
                <Button color="primary" variant="contained">
                  Locate
                </Button>
              </div> */}
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
                              {value?.landReservationNo}
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
              </Grid>
            </Paper>
            <div className={styles.rightSide}>
              <div className={styles.img}>
                <img src={"/map.png"} alt="Map.png" height={300} width={345} />
              </div>
            </div>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default AddressDetails;
