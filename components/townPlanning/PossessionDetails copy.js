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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../util/util";

// Component
const PersonalDetails = () => {
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

  const [possessionType, setPossessionType] = useState([]);
  let isDisabled = false;

  // getPossessionType
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

  useEffect(() => {
    getPossessionType();
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
          <h2>Possession Details</h2>
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
                style={{
                  width: "230px",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "2%",
                }}
                error={!!errors.possessionDate}
              >
                <Controller
                  control={control}
                  name="possessionDate"
                  defaultValue={null}
                  render={({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        error={!!errors.possessionDate}
                        inputFormat="dd/MM/yyyy"
                        label={
                          <span style={{ fontSize: 16 }}>
                            <FormattedLabel id="possessionDate" required />
                          </span>
                        }
                        disabled={router.query.possessionDate ? true : false}
                        value={
                          router.query.possessionDate
                            ? router.query.possessionDate
                            : field.value
                        }
                        onChange={(date) =>
                          field.onChange(
                            moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"),
                          )
                        }
                        // selected={field.value}
                        // center
                        renderInput={(params) => (
                          <TextField
                            error={!!errors.possessionDate}
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
                  {errors?.possessionDate
                    ? errors.possessionDate.message
                    : null}
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
              <FormControl
                variant="standard"
                error={!!errors.possessionType}
                sx={{ marginTop: 2 }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="possessionType" required />
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
                      {possessionType &&
                        possessionType.map((value, index) => (
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
                                ? value?.possessionTypeEn
                                : value?.possessionTypeMr
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="possessionType"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.possessionType
                    ? errors.possessionType.message
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
                label={<FormattedLabel id="ownerName" required />}
                variant="standard"
                {...register("owner_name")}
                error={!!errors.owner_name}
                helperText={
                  errors?.owner_name ? errors.owner_name.message : null
                }
                disabled={isDisabled}
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
                {...register("surveyNumber")}
                error={!!errors.surveyNumber}
                helperText={
                  errors?.surveyNumber ? errors.surveyNumber.message : null
                }
                disabled={isDisabled}
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
                label={<FormattedLabel id="reservationAreaInsqmtr" required />}
                variant="standard"
                {...register("area")}
                error={!!errors.area}
                helperText={errors?.area ? errors.area.message : null}
                disabled={isDisabled}
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
                label={<FormattedLabel id="documentNo" required />}
                variant="standard"
                {...register("documentNumber")}
                error={!!errors.documentNumber}
                helperText={
                  errors?.documentNumber ? errors.documentNumber.message : null
                }
                disabled={isDisabled}
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
                label={<FormattedLabel id="remark" required />}
                variant="standard"
                {...register("remark")}
                error={!!errors.remark}
                helperText={errors?.remark ? errors.remark.message : null}
                disabled={isDisabled}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  );
};

export default PersonalDetails;
