import {
  Box,
  Button,
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
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../URLS/urls";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
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
  } = useFormContext({
    defaultValues: {
      possessionDetails: [],
    },
  });

  useEffect(() => {
    console.log("possessionDetails:", getValues("possessionDetails"));
    if (router.query.pageMode === "Add" || router.query.pageMode === "Edit") {
    } else {
      console.log("disabled");
    }
  }, []);

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

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "possessionDetails", // unique name for your Field Array
    },
  );

  //  Append Function
  const appendFun = () => {
    append({
      possessionDate: null,
      possessionType: "",
      owner_name: "",
      surveyNumber: "",
      area: "",
      documentNumber: "",
      remark: "",
    });
  };

  // Call Append In UseEffect - First Time Only
  useEffect(() => {
    if (getValues(`possessionDetails.length`) == 0) {
      appendFun();
    }
  }, []);

  const [btnValue, setButtonValue] = useState(false);

  // Disable Add Button After Three Wintess Add
  const buttonValueSetFun = () => {
    if (getValues(`possessionDetails.length`) >= 5) {
      setButtonValue(true);
    } else {
      appendFun();
      setButtonValue(false);
    }
  };

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
        {fields.map((r, index) => {
          return (
            <Box
              key={index}
              sx={{
                marginTop: 2,
              }}
            >
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
                  style: { color: "red", fontWeight: "bold" },
                }}
              >
                <h2>Possession Details {`: ${index + 1}`}</h2>
              </Grid>
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
                      key={r.id}
                      {...register(`possessionDetails.${index}.possessionDate`)}
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
                            disabled={
                              router.query.possessionDate ? true : false
                            }
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
                      {errors?.possessionDetails?.[index]?.possessionDate
                        ? errors?.possessionDetails?.[index]?.possessionDate
                            .message
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
                      name={`possessionDetails.${index}.possessionType`}
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.possessionDetails?.[index]?.possessionType
                        ? errors?.possessionDetails?.[index]?.possessionType
                            .message
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
                    {...register(`possessionDetails.${index}.owner_name`)}
                    error={!!errors?.possessionDetails?.[index]?.owner_name}
                    helperText={
                      errors?.possessionDetails?.[index]?.owner_name
                        ? errors?.possessionDetails?.[index]?.owner_name.message
                        : null
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
                    {...register(`possessionDetails.${index}.surveyNumber`)}
                    error={!!errors?.possessionDetails?.[index]?.surveyNumber}
                    helperText={
                      errors?.possessionDetails?.[index]?.surveyNumber
                        ? errors?.possessionDetails?.[index]?.surveyNumber
                            .message
                        : null
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
                    label={
                      <FormattedLabel id="reservationAreaInsqmtr" required />
                    }
                    variant="standard"
                    // {...register("area")}
                    // error={!!errors.area}
                    // helperText={errors?.area ? errors.area.message : null}

                    {...register(`possessionDetails.${index}.area`)}
                    error={!!errors?.possessionDetails?.[index]?.area}
                    helperText={
                      errors?.possessionDetails?.[index]?.area
                        ? errors?.possessionDetails?.[index]?.area.message
                        : null
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
                    label={<FormattedLabel id="documentNo" required />}
                    variant="standard"
                    {...register(`possessionDetails.${index}.documentNumber`)}
                    error={!!errors?.possessionDetails?.[index]?.documentNumber}
                    helperText={
                      errors?.possessionDetails?.[index]?.documentNumber
                        ? errors?.possessionDetails?.[index]?.documentNumber
                            .message
                        : null
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
                    {...register(`possessionDetails.${index}.remark`)}
                    error={!!errors?.possessionDetails?.[index]?.remark}
                    helperText={
                      errors?.possessionDetails?.[index]?.remark
                        ? errors?.possessionDetails?.[index]?.remark.message
                        : null
                    }
                    disabled={isDisabled}
                  />
                </Grid>
              </Grid>
            </Box>
          );
        })}
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
          <Button
            sx={{
              width: "40vh",
            }}
            disabled={fields.length > 5 ? true : btnValue}
            onClick={() => buttonValueSetFun()}
            variant="contained"
          >
            Add possession Details
          </Button>
        </Grid>
      </Paper>
    </>
  );
};

export default PersonalDetails;
