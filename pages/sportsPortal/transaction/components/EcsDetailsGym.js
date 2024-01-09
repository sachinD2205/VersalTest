import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import URLS from "../../../../URLS/urls";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";
import moment from "moment";
import theme from "../../../../theme";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/sportsPortalSchema/bookingTimeSchema";

const EcsDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) }); //useFormContext();

  // Bank Masters
  const [bankMasters, setBankMasters] = useState([]);

  // getBankMasters
  const getBankMasters = () => {
    axios.get(`${URLS.CFCURL}/master/bank/getAll`).then((r) => {
      setBankMasters(
        r.data.bank.map((row) => ({
          id: row.id,
          bankMaster: row.bankName,
        }))
      );
    });
  };

  // // BranchNames
  // const [branchNames, setBranchNames] = useState([]);

  // getBranchNames
  // const getBranchNames = () => {
  //   axios
  //     .get(`${urls.BaseURL}/religionMaster/getReligionMasterData`)
  //     .then((r) => {
  //       setBranchNames(
  //         r.data.map((row) => ({
  //           id: row.id,
  //           branchName: row.branchName,
  //         })),
  //       );
  //     });
  // };

  // useEffect
  useEffect(() => {
    getBankMasters();
    // getBranchNames();
  }, []);

  return (
    <>
      {/* <div className={styles.row}>
        <Typography variant="h6" sx={{ marginTop: 4 }}>
          ECS Details
        </Typography>
      </div> */}

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
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <FormControl
            variant="standard"
            sx={{ marginTop: 2 }}
            error={!!errors.bankMaster}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="bankName" />}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                  label="Bank Name *"
                >
                  {bankMasters &&
                    bankMasters.map((bankMaster, index) => (
                      <MenuItem key={index} value={bankMaster.id}>
                        {bankMaster.bankMaster}
                      </MenuItem>
                    ))}
                </Select>
              )}
              name="bankMaster"
              control={control}
              defaultValue=""
            />
            <FormHelperText>
              {errors?.bankMaster ? errors.bankMaster.message : null}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="branchName" />}
            variant="standard"
            {...register("branchName")}
            error={!!errors.branchName}
            helperText={errors?.branchName ? errors.branchName.message : null}
          />

          {/**    <FormControl
                variant='standard'
               sx={{ marginTop: 2 }}
                error={!!errors.branchName}
              >
                <InputLabel id='demo-simple-select-standard-label'>
                  Branch Name *
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                     
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label='Branch Name *'
                    >
                      {branchNames &&
                        branchNames.map((branchName, index) => (
                          <MenuItem key={index} value={branchName.id}>
                            {branchName.branchName}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name='branchName'
                  control={control}
                  defaultValue=''
                />
                <FormHelperText>
                  {errors?.branchName ? errors.branchName.message : null}
                </FormHelperText>
              </FormControl>*/}
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="bankAccountHolderName" />}
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
            id="standard-basic"
            label={<FormattedLabel id="bankAccountNo" />}
            variant="standard"
            {...register("bankAccountNo")}
            error={!!errors.bankAccountNo}
            helperText={
              errors?.bankAccountNo ? errors.bankAccountNo.message : null
            }
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="ifscCode" />}
            variant="standard"
            {...register("ifscCode")}
            error={!!errors.ifscCode}
            helperText={errors?.ifscCode ? errors.ifscCode.message : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <TextField
            id="standard-basic"
            label={<FormattedLabel id="bankAddress" />}
            variant="standard"
            {...register("bankAddress")}
            error={!!errors.bankAddress}
            helperText={errors?.bankAddress ? errors.bankAddress.message : null}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default EcsDetails;
