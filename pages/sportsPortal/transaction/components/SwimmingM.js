import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Checkbox,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Controller,
  useFormContext,
  useForm,
  useFieldArray,
} from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";

import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/sportsPortalStyles/facilityCheck.module.css";

const SwimmingM = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [applicationList, setApplicationList] = useState([]);

  //   const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
  //     {
  //       // name: "applicationName",
  //       name: "Add Members",
  //       control,
  //       // defaultValues: [
  //       //   {applicationName:'aa',
  //       // }]
  //     }
  //   );
  //   const appendUI = () => {
  //     append({
  //       applicationName: "",
  //       roleName: "",
  //     });
  //   };
  //   useEffect(() => {
  //     if (getValues(`applicationRolesList.length`) == 0) {
  //       appendUI();
  //     }
  //   }, []);

  return (
    <>
      {/* <div className={styles.row}>
            <Typography variant="h6" sx={{ marginTop: 4 }}>
              Personal Details
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
          Booking Details
          {/* <FormattedLabel id="personalDetails" /> */}
        </strong>
      </div>
      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 1, marginBottom: 5, align: "center" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl error={!!errors.applicationDate} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {/* {<FormattedLabel id="bookingType" />} */}
                Swimming Pool Name
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ minWidth: 195 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // field.onChange(value), handleOnChange(value.target.value);

                      // setGroup(false);
                      // setKayAheNaav(value.target.value);
                    }}
                    label="swimmingPoolName"
                  >
                    <MenuItem value="swimmingPoolo">Swimming Pool 1</MenuItem>
                    <MenuItem value="swimmingPoolt">Swimming Pool 2</MenuItem>
                    <MenuItem value="swimmingPoolth">Swimming Pool 3</MenuItem>
                    <MenuItem value="swimmingPoolf">Swimming Pool 4</MenuItem>
                  </Select>
                )}
                name="swimmingPoolName"
                control={control}
                defaultValue=""
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl error={!!errors.applicationDate} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="slots" />}
                {/* Slots */}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ minWidth: 195 }}
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      // field.onChange(value), handleOnChange(value.target.value);

                      // setGroup(false);
                      // setKayAheNaav(value.target.value);
                    }}
                    label="slots"
                  >
                    <MenuItem value="Government_School">
                      Government School
                    </MenuItem>
                    <MenuItem value="Private_School">Private School</MenuItem>
                    <MenuItem value="High_School">High School</MenuItem>
                    <MenuItem value="Sports_Club">Sports Club</MenuItem>
                  </Select>
                )}
                name="slots"
                control={control}
                defaultValue=""
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
      <div>
        <TextField
          id="standard-basic"
          // label={<FormattedLabel id="capacity" />}
          label="Name"
          variant="standard"
          {...register("name")}
          error={!!errors.name}
          helperText={errors?.name ? "Name is Required !!!" : null}
        />
        <TextField
          id="standard-basic"
          // label={<FormattedLabel id="capacity" />}
          label="Gender"
          variant="standard"
          {...register("gender")}
          error={!!errors.gender}
          helperText={errors?.name ? "Gender is Required !!!" : null}
        />
      </div>
    </>
  );
};

export default SwimmingM;
