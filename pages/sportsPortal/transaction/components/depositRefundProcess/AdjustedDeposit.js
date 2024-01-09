import React, { useEffect } from "react";
import styles from "../../depositRefundProcess/deposit.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { TextField } from "@mui/material";

const AdjustedDeposit = ({ amount }) => {
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
  });

  useEffect(() => {
    if (amount?.amount > 0) {
      reset({
        ...amount,
        refundableAmount:
          amount.amount - (amount.equipmentCharges + amount.otherCharges),
      });
    }
  }, [amount]);
  return (
    <>
      <div className={styles.subTitle}>
        <FormattedLabel id="adjustedDeposit" />
      </div>
      <div
        className={styles.fieldsWrapper}
        style={{ justifyContent: "space-between" }}
      >
        <TextField
          disabled
          sx={{ width: 250 }}
          label={<FormattedLabel id="amount" />}
          // @ts-ignore
          variant="standard"
          {...register("amount")}
          InputLabelProps={{
            shrink: !!watch("amount"),
          }}
          error={!!error.amount}
          helperText={error?.amount ? error.amount.message : null}
        />
        <TextField
          disabled
          sx={{ width: 250 }}
          label={<FormattedLabel id="equipmentCharges" />}
          // @ts-ignore
          variant="standard"
          {...register("equipmentCharges")}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!error.equipmentCharges}
          helperText={
            error?.equipmentCharges ? error.equipmentCharges.message : null
          }
        />
        <TextField
          disabled
          sx={{ width: 250 }}
          label={<FormattedLabel id="otherCharges" />}
          // @ts-ignore
          variant="standard"
          {...register("otherCharges")}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!error.otherCharges}
          helperText={error?.otherCharges ? error.otherCharges.message : null}
        />
        <TextField
          disabled
          sx={{ width: 250 }}
          label={<FormattedLabel id="refundableAmount" />}
          // @ts-ignore
          variant="standard"
          {...register("refundableAmount")}
          InputLabelProps={{
            shrink: true,
          }}
          error={!!error.refundableAmount}
          helperText={
            error?.refundableAmount ? error.refundableAmount.message : null
          }
        />
      </div>
    </>
  );
};

export default AdjustedDeposit;
