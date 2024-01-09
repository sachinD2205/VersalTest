import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Radio,
  Grid,
  Col,
  Row,
  Form,
  FormLabel,
  RadioGroup,

} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import { useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Drawer from "@mui/material/Drawer";
import { Button } from "antd";
import { styled, useTheme } from "@mui/material/styles";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";


let drawerWidth;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);


const SkySignBusinessDetails = () => {



  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  // const [form] = Form.useForm();
  const [flag, setFlag] = useState(null);
  useEffect(() => {
    console.log("flag", flag)
  }, [flag])

  return (
    <>
      {/** First row */}
      <div className={styles.small}>
        <div className={styles.row}>
          <h1>
            <Typography>Skysign Dimensions</Typography>
          </h1>
        </div>
      </div>
      {/** Second row */}

      <Grid
        container
        sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center", paddingLeft: "5vh" }}
      >
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <TextField
            sx={{ width: 250 }}
            id='standard-basic'
            label={<FormattedLabel id="length"></FormattedLabel>}
            variant='standard'
            {...register("length")}
            error={!!errors.length}
            helperText={
              errors?.length
                ? errors.length.message
                : null
            }
          />
        </Grid>
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <TextField
            sx={{ width: 250 }}
            id='standard-basic'
            label={<FormattedLabel id="breadth"></FormattedLabel>}
            variant='standard'
            {...register("breadth")}
            error={!!errors.breadth}
            helperText={
              errors?.breadth
                ? errors.breadth.message
                : null
            }
          />
        </Grid>
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <TextField
            sx={{ width: 250 }}
            id='standard-basic'
            label={<FormattedLabel id="heightOfSkysign"></FormattedLabel>}
            variant='standard'
            {...register("heightOfSkysign")}
            error={!!errors.heightOfSkysign}
            helperText={
              errors?.heightOfSkysign
                ? errors.heightOfSkysign.message
                : null
            }
          />
        </Grid>


        {/** 3rd row */}
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <b>
            <FormControlLabel
              control={<Checkbox />}
              sx={{ marginTop: "4vh" }}
              label={<FormattedLabel id="terraceCheckBox"></FormattedLabel>}
              {...register("terraceCheckBox")}
              onChange={(e) => {
                addressChange(e);
              }}
            />
          </b>
        </Grid>


        {/** 4th row */}
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <TextField
            sx={{ width: 250 }}
            id='standard-basic'
            label={<FormattedLabel id="heightFromTerrace"></FormattedLabel>}
            variant='standard'
            {...register("heightFromTerrace")}
            error={!!errors.heightFromTerrace}
            helperText={
              errors?.heightFromTerrace
                ? errors.heightFromTerrace.message
                : null
            }
          />
        </Grid>
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <TextField
            sx={{ width: 250 }}
            id='standard-basic'
            label={<FormattedLabel id="heightFromGround"></FormattedLabel>}
            variant='standard'
            {...register("heightFromGround")}
            error={!!errors.heightFromGround}
            helperText={
              errors?.heightFromGround
                ? errors.heightFromGround.message
                : null
            }
          />
        </Grid>
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <TextField
            sx={{ width: 250 }}
            id='standard-basic'
            label={<FormattedLabel id="heightOfSkysignRoadLevel"></FormattedLabel>}
            variant='standard'
            {...register("heightOfSkysignRoadLevel")}
            error={!!errors.heightOfSkysignRoadLevel}
            helperText={
              errors?.heightOfSkysignRoadLevel
                ? errors.heightOfSkysignRoadLevel.message
                : null
            }
          />
        </Grid>

        {/** 5th row */}
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <TextField
            sx={{ width: 250 }}
            id='standard-basic'
            label={<FormattedLabel id="heightFromGround"></FormattedLabel>}
            variant='standard'
            {...register("DistanceFromPoachMarg")}
            error={!!errors.DistanceFromPoachMarg}
            helperText={
              errors?.DistanceFromPoachMarg
                ? errors.DistanceFromPoachMarg.message
                : null
            }
          />
        </Grid>
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>
          <TextField
            sx={{ width: 250 }}
            id='standard-basic'
            label={<FormattedLabel id="heightOfSkysigncenterlineRoad"></FormattedLabel>}
            variant='standard'
            {...register("heightOfSkysigncenterlineRoad")}
            error={!!errors.heightOfSkysigncenterlineRoad}
            helperText={
              errors?.heightOfSkysigncenterlineRoad
                ? errors.heightOfSkysigncenterlineRoad.message
                : null
            }
          />
        </Grid>



        {/** 6th row  */}
        <Grid item
          xl={4}
          lg={4}
          md={4}
          sm={12}
          xs={12}>

          <FormControl
            variant="standard"
            sx={{ m: 1, minWidth: 120 }}
            error={!!errors.ownership}
          >
            <InputLabel id="demo-simple-select-standard-label">
              {<FormattedLabel id="selfownership"></FormattedLabel>}
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  sx={{ width: 250 }}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value.target.value === 'No') {
                      setFlag(value.target.value)
                      console.log(value.target.value);
                    }
                    else {
                      setFlag(false)
                      console.log('hi');
                    }
                  }
                  }
                  label=" Self Ownership *"
                >

                  <MenuItem value={'Yes'}>Yes</MenuItem>
                  <MenuItem value={'No'}>No</MenuItem>

                </Select>
              )}
              name="selfownership"
              control={control}
              defaultValue=""
            />

          </FormControl>

        </Grid>
      </Grid>

      {/**7th row */}



      {flag === 'No' && (

        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
        >
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              error={!!errors.title}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="title"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Title"
                  >

                    <MenuItem value={'Mr'}>Mr</MenuItem>
                    <MenuItem value={'Ms'}>Ms</MenuItem>
                    <MenuItem value={'Mrs'}>Mrs</MenuItem>
                    <MenuItem value={'Dr'}>Dr</MenuItem>
                  </Select>
                )}
                name="title"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.title
                  ? errors.title.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="fname"></FormattedLabel>}
              variant='standard'
              {...register("firstName")}
              error={!!errors.firstName}
              helperText={
                errors?.firstName
                  ? errors.firstName.message
                  : null
              }
            />
          </Grid>


          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="mname"></FormattedLabel>}
              variant='standard'
              {...register("middleName")}
              error={!!errors.middleName}
              helperText={
                errors?.middleName
                  ? errors.middleName.message
                  : null
              }
            />
          </Grid>

          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="lname"></FormattedLabel>}
              variant='standard'
              {...register("lastName")}
              error={!!errors.lastName}
              helperText={
                errors?.lastName
                  ? errors.lastName.message
                  : null
              }
            />
          </Grid>

          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl>
              {/* <FormLabel id='demo-controlled-radio-buttons-group'>Consent of Property holder</FormLabel> */}
              <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group'>
                <FormControlLabel
                  value='Yes'
                  sx={{ marginTop: "2vh" }}
                  control={<Radio />}
                  label={<FormattedLabel id="ConsentofPropertyholder"></FormattedLabel>}
                  name='RadioButton'
                  {...register("radioButton")}
                  error={!!errors.radioButton}
                  helperText={errors?.radioButton ? errors.radioButton.message : null}
                />
              </RadioGroup>
            </FormControl>

          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl>
              {/* <FormLabel id='demo-controlled-radio-buttons-group'>Is the skysign location is in
                Open land?
              </FormLabel> */}
              <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group'>
                <FormControlLabel
                  value='Yes'
                  sx={{ marginTop: "2vh" }}
                  control={<Radio />}
                  label={<FormattedLabel id="skysignlocationOpenland"></FormattedLabel>}
                  name='RadioButton'
                  {...register("radioButton")}
                  error={!!errors.radioButton}
                  helperText={errors?.radioButton ? errors.radioButton.message : null}
                />
              </RadioGroup>
            </FormControl>

          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl>
              {/* <FormLabel id='demo-controlled-radio-buttons-group'>Is the skysign location is in
                human habitat?</FormLabel> */}
              <RadioGroup aria-labelledby='demo-controlled-radio-buttons-group'>
                <FormControlLabel
                  value='Yes'
                  sx={{ marginTop: "2vh" }}
                  control={<Radio />}
                  label={<FormattedLabel id="skysignlocationhumanhabitat"></FormattedLabel>}
                  name='RadioButton'
                  {...register("radioButton")}
                  error={!!errors.radioButton}
                  helperText={errors?.radioButton ? errors.radioButton.message : null}
                />
              </RadioGroup>
            </FormControl>

          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name='Date of placement'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='YYYY/MM/DD'
                      label={<FormattedLabel id="dateofplacement"></FormattedLabel>}

                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          fullWidth
                          InputLabelProps={{
                            style: {
                              // fontSize: 12,
                              marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl style={{ marginTop: 10 }}>
              <Controller
                control={control}
                name='Duration of Validity '
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='YYYY/MM/DD'
                      label={<FormattedLabel id="durationofValidity"></FormattedLabel>}
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          fullWidth
                          InputLabelProps={{
                            style: {
                              // fontSize: 12,
                              marginTop: 3,
                            },
                          }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="additionalInfo"></FormattedLabel>}
              variant='standard'
              {...register("additionalInfo")}
              error={!!errors.additionalInfo}
              helperText={
                errors?.additionalInfo
                  ? errors.additionalInfo.message
                  : null
              }
            />
          </Grid>

        </Grid>



      )}



    </>
  )
};

export default SkySignBusinessDetails;


