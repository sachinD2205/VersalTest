import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import URLS from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const EcsDetails = ({ readOnly = false }) => {
  const {
    control,
    register,
    reset,
    watch,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);
  const [bankMasters, setBankMasters] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  // handlePasswordChange
  const handlePasswordChange = () => {
    setPassword(watch("bankAccountNo"));
    setShowPassword(true);
    setTimeout(() => {
      setShowPassword(false);
    }, 350);
  };

  //!============================> useEffect

  useEffect(() => {
    handlePasswordChange();
  }, [watch("bankAccountNo")]);

  // getBankMasters
  const getBankMasters = () => {
    axios.get(`${URLS.CFCURL}/master/bank/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then((r) => {
      setBankMasters(
        r.data.bank
          .map((row) => ({
            id: row.id,
            bankMaster: row.bankName,
            bankMasterMr: row.bankNameMr,
          }))
          ?.sort((a, b) => a?.bankMaster?.localeCompare(b?.bankMaster))
      );
    }).catch((error) => {
      callCatchMethod(error, language);
    });
  };

  // useEffect
  useEffect(() => {
    getBankMasters();
  }, []);

  return (
    <>
      <div
        style={{
          backgroundColor: "#0084ff",
          color: "white",
          fontSize: 19,
          marginTop: 30,
          marginBottom: 30,
          padding: 8,
          paddingLeft: 30,
          marginLeft: "40px",
          marginRight: "65px",
          borderRadius: 100,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <strong>
          <FormattedLabel id="eCSDetails" />
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={12} md={8} lg={6} xl={4}>
          <FormControl
            defaultValue={null}
            variant="standard"
            sx={{ marginTop: 2 }}
            error={!!errors.bankName}
            disabled={readOnly}
          >
            <InputLabel shrink={true} id="demo-simple-select-standard-label">
              {<FormattedLabel id="bankName" required />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  style={{ width: "500px" }}
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Bank Name *"
                >
                  {bankMasters &&
                    bankMasters.map((bankMaster, index) => (
                      <MenuItem key={index} value={bankMaster.id}>
                        {language == "en"
                          ? bankMaster?.bankMaster
                          : bankMaster?.bankMasterMr}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="bankName"
              control={control}
              defaultValue={null}
            />
            <FormHelperText>
              {errors?.bankName ? errors.bankName.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="branchName" required />}
            variant="standard"
            {...register("branchName")}
            error={!!errors.branchName}
            helperText={errors?.branchName ? errors.branchName.message : null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="bankAccountHolderName" required />}
            variant="standard"
            {...register("bankAccountHolderName")}
            error={!!errors.bankAccountHolderName}
            helperText={
              errors?.bankAccountHolderName
                ? errors.bankAccountHolderName.message
                : null
            }
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>

          <TextField
            label={<FormattedLabel id="bankAccountNo" required />}
            inputProps={{ maxLength: 15 }}
            disabled={readOnly}
            type={showPassword ? "text" : readOnly ? "text" : "password"}
            value={password}
            {...register("bankAccountNo")}
            error={!!errors.bankAccountNo}
            helperText={
              errors?.bankAccountNo ? errors.bankAccountNo.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            inputProps={{ maxLength: 15 }}
            label={<FormattedLabel id="confirmBankAccountNo" required />}
            variant="standard"
            onPaste={(e) => e.preventDefault()}
            {...register("confirmBankAccountNo")}
            error={!!errors.confirmBankAccountNo}
            helperText={
              errors?.confirmBankAccountNo
                ? errors.confirmBankAccountNo.message
                : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            inputProps={{ maxLength: 11 }}
            label={<FormattedLabel id="ifscCode" required />}
            variant="standard"
            {...register("ifscCode")}
            error={!!errors.ifscCode}
            helperText={errors?.ifscCode ? errors.ifscCode.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            disabled={readOnly}
            id="standard-basic"
            label={<FormattedLabel id="bankAddress" required />}
            variant="standard"
            {...register("bankAddress")}
            error={!!errors.bankAddress}
            helperText={errors?.bankAddress ? errors.bankAddress.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}></Grid>
      </Grid>
    </>
  );
};

export default EcsDetails;
