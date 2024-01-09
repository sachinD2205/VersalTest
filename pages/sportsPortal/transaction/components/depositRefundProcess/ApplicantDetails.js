import React, { useEffect } from "react";
import router from "next/router";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { useLanguage } from "../../../../../containers/reuseableComponents/CustomHooks";
import styles from "../../depositRefundProcess/deposit.module.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

const ApplicantDetails = ({ data }) => {
  //   const language = useLanguage();

  //   const schema = yup.object().shape({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(data);
  }, [data]);

  return (
    <>
      <div className={styles.subTitle}>
        <FormattedLabel id="applicantDetails" />
      </div>
      <div className={styles.fieldsWrapper}>
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="enterFName" />}
          // @ts-ignore
          variant="standard"
          {...register("firstName")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("firstName"),
          }}
          error={!!error.firstName}
          helperText={error?.firstName ? error.firstName.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="enterMName" />}
          // @ts-ignore
          variant="standard"
          {...register("middleName")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("middleName"),
          }}
          error={!!error.middleName}
          helperText={error?.middleName ? error.middleName.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="enterLName" />}
          // @ts-ignore
          variant="standard"
          {...register("lastName")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("lastName"),
          }}
          error={!!error.lastName}
          helperText={error?.lastName ? error.lastName.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="enterFNameMr" />}
          // @ts-ignore
          variant="standard"
          {...register("firstNameMr")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("firstNameMr"),
          }}
          error={!!error.firstNameMr}
          helperText={error?.firstNameMr ? error.firstNameMr.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="enterMNameMr" />}
          // @ts-ignore
          variant="standard"
          {...register("middleNameMr")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("middleNameMr"),
          }}
          error={!!error.middleNameMr}
          helperText={error?.middleNameMr ? error.middleNameMr.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="enterFNameMr" />}
          // @ts-ignore
          variant="standard"
          {...register("lastNameMr")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("lastNameMr"),
          }}
          error={!!error.lastNameMr}
          helperText={error?.lastNameMr ? error.lastNameMr.message : null}
        />

        <FormControl error={!!error.dateOfBirth}>
          <Controller
            control={control}
            name="dateOfBirth"
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disableFuture
                  disabled
                  inputFormat="dd/MM/yyyy"
                  label={<FormattedLabel id="dateOfBirth" />}
                  value={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: 275 }}
                      {...params}
                      size="small"
                      fullWidth
                      variant="standard"
                      error={!!error.dateOfBirth}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          <FormHelperText>
            {error?.dateOfBirth ? error.dateOfBirth.message : null}
          </FormHelperText>
        </FormControl>

        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="aadharNo" />}
          // @ts-ignore
          variant="standard"
          {...register("aadharCardNo")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("aadharCardNo"),
          }}
          error={!!error.aadharCardNo}
          helperText={error?.aadharCardNo ? error.aadharCardNo.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="mobileNo" />}
          // @ts-ignore
          variant="standard"
          {...register("mobileNo")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("mobileNo"),
          }}
          error={!!error.mobileNo}
          helperText={error?.mobileNo ? error.mobileNo.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="emailAddress" />}
          // @ts-ignore
          variant="standard"
          {...register("emailAddress")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("emailAddress"),
          }}
          error={!!error.emailAddress}
          helperText={error?.emailAddress ? error.emailAddress.message : null}
        />
      </div>
    </>
  );
};

export default ApplicantDetails;
