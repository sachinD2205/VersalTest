import React, { useEffect } from "react";
import router from "next/router";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useForm } from "react-hook-form";
import styles from "../../depositRefundProcess/deposit.module.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLanguage } from "../../../../../containers/reuseableComponents/CustomHooks";

const ApplicationDetails = ({ data }) => {
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
        <FormattedLabel id="applicationDetails" />
      </div>
      <div
        className={styles.fieldsWrapper}
        style={{ justifyContent: "space-between" }}
      >
        <FormControl error={!!error.applicationDate}>
          <Controller
            control={control}
            name="applicationDate"
            defaultValue={null}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disableFuture
                  disabled
                  inputFormat="dd/MM/yyyy"
                  label={<FormattedLabel id="applicationDate" />}
                  value={field.value}
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  renderInput={(params) => (
                    <TextField
                      sx={{ width: 250 }}
                      {...params}
                      size="small"
                      fullWidth
                      variant="standard"
                      error={!!error.applicationDate}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          <FormHelperText>
            {error?.applicationDate ? error.applicationDate.message : null}
          </FormHelperText>
        </FormControl>

        <TextField
          disabled
          sx={{ width: 250 }}
          label={<FormattedLabel id="applicationNumber" />}
          // @ts-ignore
          variant="standard"
          {...register("applicationNumber")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("applicationNumber"),
          }}
          error={!!error.applicationNumber}
          helperText={
            error?.applicationNumber ? error.applicationNumber.message : null
          }
        />
        <TextField
          disabled
          sx={{ width: 250 }}
          label={<FormattedLabel id="serviceName" />}
          // @ts-ignore
          variant="standard"
          {...register("serviceName")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("serviceName"),
          }}
          error={!!error.serviceName}
          helperText={error?.serviceName ? error.serviceName.message : null}
        />
        {data?.timeSpan ? (
          <FormControl error={!!error.bookingDate}>
            <Controller
              control={control}
              name="bookingDate"
              defaultValue={null}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    disabled
                    inputFormat="dd/MM/yyyy"
                    label={<FormattedLabel id="bookingDate" />}
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    renderInput={(params) => (
                      <TextField
                        sx={{ width: 250 }}
                        {...params}
                        size="small"
                        fullWidth
                        variant="standard"
                        error={!!error.bookingDate}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
            <FormHelperText>
              {error?.bookingDate ? error.bookingDate.message : null}
            </FormHelperText>
          </FormControl>
        ) : (
          <>
            <FormControl error={!!error.fromDate}>
              <Controller
                control={control}
                name="fromDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      disabled
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="fromDate" />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 250 }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                          error={!!error.fromDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.fromDate ? error.fromDate.message : null}
              </FormHelperText>
            </FormControl>
            <FormControl error={!!error.toDate}>
              <Controller
                control={control}
                name="toDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      disableFuture
                      disabled
                      inputFormat="dd/MM/yyyy"
                      label={<FormattedLabel id="toDate" />}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                      }}
                      renderInput={(params) => (
                        <TextField
                          sx={{ width: 250 }}
                          {...params}
                          size="small"
                          fullWidth
                          variant="standard"
                          error={!!error.toDate}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
              <FormHelperText>
                {error?.toDate ? error.toDate.message : null}
              </FormHelperText>
            </FormControl>
          </>
        )}
      </div>
    </>
  );
};

export default ApplicationDetails;
