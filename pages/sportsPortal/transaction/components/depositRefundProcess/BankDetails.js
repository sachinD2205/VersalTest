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

const BankDetails = ({ data }) => {
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
    //Maati kaam
    reset({
      bankName: data?.bankName,
      branchName: data?.branchName,
      bankAccountHolderName: data?.bankAccountHolderName,
      bankAccountNo: data?.bankAccountNo,
      ifscCode: data?.ifscCode,
      bankAddress: data?.bankAddress,
      amount: data?.applicableCharages?.find((j) => j?.chargeType == 2)
        ?.amountPerHead,
    });
  }, [data]);

  return (
    <>
      <div className={styles.subTitle}>
        <FormattedLabel id="paymentDetails" />
      </div>
      <div className={styles.fieldsWrapper}>
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="bankName" />}
          // @ts-ignore
          variant="standard"
          {...register("bankName")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("bankName"),
          }}
          error={!!error.bankName}
          helperText={error?.bankName ? error.bankName.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="branchName" />}
          // @ts-ignore
          variant="standard"
          {...register("branchName")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("branchName"),
          }}
          error={!!error.branchName}
          helperText={error?.branchName ? error.branchName.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="bankAccountHolderName" />}
          // @ts-ignore
          variant="standard"
          {...register("bankAccountHolderName")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("bankAccountHolderName"),
          }}
          error={!!error.bankAccountHolderName}
          helperText={
            error?.bankAccountHolderName
              ? error.bankAccountHolderName.message
              : null
          }
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="bankAccountNo" />}
          // @ts-ignore
          variant="standard"
          {...register("bankAccountNo")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("bankAccountNo"),
          }}
          error={!!error.bankAccountNo}
          helperText={error?.bankAccountNo ? error.bankAccountNo.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="ifscCode" />}
          // @ts-ignore
          variant="standard"
          {...register("ifscCode")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("ifscCode"),
          }}
          error={!!error.ifscCode}
          helperText={error?.ifscCode ? error.ifscCode.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="bankAddress" />}
          // @ts-ignore
          variant="standard"
          {...register("bankAddress")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("bankAddress"),
          }}
          error={!!error.bankAddress}
          helperText={error?.bankAddress ? error.bankAddress.message : null}
        />
        <TextField
          disabled
          sx={{ width: 275 }}
          label={<FormattedLabel id="amount" />}
          // @ts-ignore
          variant="standard"
          {...register("amount")}
          InputLabelProps={{
            shrink: !!router.query.id || !!watch("amount"),
          }}
          error={!!error.amount}
          helperText={error?.amount ? error.amount.message : null}
        />
      </div>
    </>
  );
};

export default BankDetails;
