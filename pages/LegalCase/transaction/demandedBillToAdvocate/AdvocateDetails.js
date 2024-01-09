import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme.js";
import urls from "../../../../URLS/urls";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// AdvocateDetails
const AdvocateDetails = (props) => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const router = useRouter();
  const [courtNames, setCourtNames] = useState([]);
  const advocateName = getValues();
  const language = useSelector((state) => state.labels.language);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [authority, setAuthority] = useState();
  const user = useSelector((state) => state?.user?.user);
  let selectedMenuFromDrawer = localStorage.getItem("selectedMenuFromDrawer");
  const token = useSelector((state) => state.user.user.token);

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

  // advocatesNames
  const getAdvocatesName = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("adv", res.data.advocate);
        setAdvocates(
          res.data.advocate.map((r, i) => ({
            id: r.id,
            firstName: r.firstName,
            lastName: r.lastName,
            name: `${r.firstName} ${r?.middleName} ${r.lastName}`,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };
  // departmentNames
  const getDepartmentName = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDepartmentNames(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
            department: r.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // courtNames
  const getCourtName = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourtNames(
          res.data.court.map((r, i) => ({
            id: r.id,
            courtName: r.courtName,
            courtMr: r.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  // -------------------- useEffects --------

  useEffect(() => {
    getDepartmentName();
    getAdvocatesName();
  }, []);

  useEffect(() => {
    getCourtName();
  }, [departmentNames]);

  useEffect(() => {
    let auth = user?.menus?.find((r) => {
      if (r.id == selectedMenuFromDrawer) {
        return r;
      }
    })?.roles;
    setAuthority(auth);
    console.log("authority", auth);
  }, []);

  useEffect(() => {
    if (watch("advocateNameKey")) {
      axios
        .get(
          `${urls.LCMSURL}/master/advocate/getById?advocateId=${watch(
            "advocateNameKey"
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          // console.log("adv", res.data.advocate);

          setValue("city", res?.data?.city);
          setValue("area", res?.data?.area);
          setValue("roadName", res?.data?.roadName);
          setValue("landmark", res?.data?.landmark);
          setValue("pinCode", res?.data?.pinCode);
          setValue("mobileNo", res?.data?.mobileNo);
          setValue("emailAddress", res?.data?.emailAddress);
          localStorage.setItem("advDetails", JSON.stringify(res?.data));
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  }, [watch("advocateNameKey")]);

  // view
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container style={{ marginLeft: 70, padding: "10px" }}>
          {/** AdvocateName */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            {authority?.includes("ADMIN") ? (
              <FormControl sx={{ width: 230 }} disabled>
                <InputLabel required error={!!errors.itiKey}>
                  Select Advocate
                </InputLabel>
                <Controller
                  control={control}
                  name="advocateNameKey"
                  defaultValue=""
                  render={({ field }) => (
                    <Select
                      disabled
                      // disabled={watch("disabledDemandedBillInputState")}
                      variant="standard"
                      {...field}
                      error={!!errors.advocateNameKey}
                    >
                      {advocates &&
                        advocates.map((adv) => (
                          <MenuItem key={adv.id} value={adv.id}>
                            {adv?.name}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                />
                <FormHelperText>
                  {errors?.itiKey ? errors.itiKey.message : null}
                </FormHelperText>
              </FormControl>
            ) : (
              <TextField
                InputLabelProps={{ shrink: watch("shrink") }}
                // disabled={watch("disabledDemandedBillInputState")}
                disabled
                label={<FormattedLabel id="advocateName" />}
                {...register("advocateName")}
                error={!!errors?.advocateName}
                helperText={
                  errors?.advocateName ? errors?.advocateName?.message : null
                }
              />
            )}
          </Grid>

          {/** city */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id="cityOrVillage" />}
              {...register("city")}
              error={!!errors?.city}
              helperText={errors?.city ? errors?.city?.message : null}
            />
          </Grid>

          {/** area */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id="area" />}
              {...register("area")}
              error={!!errors?.area}
              helperText={errors?.area ? errors?.area?.message : null}
            />
          </Grid>

          {/** roadName */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id="roadName" />}
              {...register("roadName")}
              error={!!errors?.roadName}
              helperText={errors?.roadName ? errors?.roadName.message : null}
            />
          </Grid>

          {/** landmark */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id="landmark" />}
              {...register("landmark")}
              error={!!errors?.landmark}
              helperText={errors?.landmark ? errors?.landmark?.message : null}
            />
          </Grid>

          {/** pinCode */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id="pincode" />}
              {...register("pinCode")}
              error={!!errors?.pinCode}
              helperText={errors?.pinCode ? errors?.pinCode?.message : null}
            />
          </Grid>

          {/** mobileNo */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id="mobile" />}
              {...register("mobileNo")}
              error={!!errors?.mobileNo}
              helperText={errors?.mobileNo ? errors?.mobileNo?.message : null}
            />
          </Grid>

          {/** email */}
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              InputLabelProps={{ shrink: watch("shrink") }}
              // disabled={watch("disabledDemandedBillInputState")}
              disabled
              label={<FormattedLabel id="email" />}
              {...register("emailAddress")}
              error={!!errors?.emailAddress}
              helperText={
                errors?.emailAddress ? errors?.emailAddress?.message : null
              }
            />
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default AdvocateDetails;
