import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import styles from "../../../styles/fireBrigadeSystem/view.module.css";
/** Sachin Durge */
// applicantDetails
const ApplicantDetails = ({ readOnly = false }) => {
  const {
    control,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext();

  // view
  return (
    <>
      <div>
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ marginLeft: "35%" }}
        >
          <Grid item xs={4} className={styles.feildres}>
            <FormControl sx={{ width: "200%" }} error={!!errors.nocType}>
              <InputLabel variant="standard" htmlFor="uncontrolled-native">
                Select NOC Type
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    // disabled={router?.query?.disabled}
                    sx={{ width: "100%" }}
                    // disabled={viewButtonInputState}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // setFirm(value.target.value);
                    }}
                    name="nocType"
                    fullWidth
                    size="small"
                    variant="standard"
                  >
                    <MenuItem value="Provisional Building NOC">
                      Provisional Building NOC
                    </MenuItem>
                    <MenuItem value="Revised Provisional Building NOC">
                      Revised Provisional Building NOC
                    </MenuItem>
                    <MenuItem value="Final Provisional Building NOC">
                      Final Provisional Building NOC
                    </MenuItem>
                  </Select>
                )}
                name="nocType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.nocType ? errors.nocType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={styles.feildres}
        >
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantName" />}
              variant="standard"
              {...register("applicantDTLDao.applicantName")}
              error={!!errors?.applicantName}
              helperText={
                errors?.applicantDTLDao?.applicantName
                  ? errors?.applicantDTLDao?.applicantName?.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantMiddleName" />}
              variant="standard"
              {...register("applicantDTLDao.applicantMiddleName")}
              error={!!errors.applicantMiddleName}
              helperText={
                errors?.applicantDTLDao?.applicantMiddleName
                  ? errors.applicantDTLDao?.applicantMiddleName?.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantLastName" />}
              variant="standard"
              {...register("applicantDTLDao.applicantLastName")}
              error={!!errors?.applicantDTLDao?.applicantLastName}
              helperText={
                errors?.applicantDTLDao?.applicantLastName
                  ? errors?.applicantDTLDao?.applicantLastName?.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantNameMr" />}
              variant="standard"
              {...register("applicantDTLDao.applicantNameMr")}
              error={!!errors?.applicantNameMr}
              helperText={
                errors?.applicantDTLDao?.applicantNameMr
                  ? errors?.applicantDTLDao?.applicantNameMr?.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantMiddleNameMr" />}
              variant="standard"
              {...register("applicantDTLDao.applicantMiddleNameMr")}
              error={!!errors?.applicantDTLDao?.applicantMiddleNameMr}
              helperText={
                errors?.applicantDTLDao?.applicantMiddleNameMr
                  ? errors?.applicantDTLDao?.applicantMiddleNameMr.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="applicantLastNameMr" />}
              variant="standard"
              {...register("applicantDTLDao.applicantLastNameMr")}
              error={!!errors?.applicantDTLDao?.applicantLastNameMr}
              helperText={
                errors?.applicantDTLDao?.applicantLastNameMr
                  ? errors?.applicantDTLDao?.applicantLastNameMr?.message
                  : null
              }
            />
          </Grid>
        </Grid>
        <Grid
          container
          columns={{ xs: 4, sm: 8, md: 12 }}
          className={styles.feildres}
        >
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="mobileNo" />}
              variant="standard"
              {...register("applicantDTLDao.applicantMobileNo")}
              error={!!errors?.applicantDTLDao?.applicantMobileNo}
              helperText={
                errors?.applicantDTLDao?.applicantMobileNo
                  ? errors?.applicantDTLDao?.applicantMobileNo?.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={4} className={styles.feildres}>
            <TextField
              sx={{ width: "80%" }}
              id="standard-basic"
              label={<FormattedLabel id="emailId" />}
              variant="standard"
              {...register("applicantDTLDao.applicantEmailId")}
              error={!!errors?.applicantDTLDao?.applicantEmailId}
              helperText={
                errors?.applicantDTLDao?.applicantEmailId
                  ? errors?.applicantDTLDao?.applicantEmailId?.message
                  : null
              }
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ApplicantDetails;
