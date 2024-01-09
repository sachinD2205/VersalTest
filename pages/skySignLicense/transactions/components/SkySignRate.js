

import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Grid,
  Checkbox,

} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import styles from "../../../../styles/skysignstyles/components.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

/////////////////// Drawer Related

import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Drawer from "@mui/material/Drawer";
import { Button } from "antd";

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




const isIlluminatedChange = (e) => {
  alert(e.target.value);
};
// http://localhost:4000/hawkerManagementSystem/transactions/components/HawkerDetails
const ApplicantDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  const [advertisementTypes, setadvertisementTypes] = useState([]);

  const getadvertisementTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstAdvertisementType/getAdvertisementTypeData`)
      .then((r) => {
        setadvertisementTypes(
          r.data.map((row) => ({
            id: row.id,
            advertisementType: row.advertisementType,
          })),
        );
      });
  };

  useEffect(() => {
    getadvertisementTypes();
  }, []);
  const [mediaTypes, setmediaTypes] = useState([]);

  const getmediaTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstMediaType/getMediaTypeData`)
      .then((r) => {
        setmediaTypes(
          r.data.map((row) => ({
            id: row.id,
            mediaType: row.mediaType,
          })),
        );
      });
  };

  useEffect(() => {
    getmediaTypes();
  }, []);


  const [mediaSubTypes, setmediaSubTypes] = useState([]);

  const getmediaSubTypes = () => {
    axios
      .get(`${urls.SSLM}/master/MstMediaSubType/getmediaSubTypeData`)
      .then((r) => {
        setmediaSubTypes(
          r.data.map((row) => ({
            id: row.id,
            mediaSubType: row.mediaSubType,
          })),
        );
      });
  };

  useEffect(() => {
    getmediaSubTypes();
  }, []);





  return (
    <>
      <div>
        {/* // 1st row// */}
        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, align: "center",paddingLeft:"5vh" }}
        >
          <Grid item
            xl={4}
            lg={4}
            md={4}
            sm={12}
            xs={12}>
            <FormControl >
              <Controller
                control={control}
                name='fromDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='YYYY/MM/DD'
                      label={
                        <span style={{ fontSize: 16 }}>
                          {<FormattedLabel id="fromdate"></FormattedLabel>}
                        </span>
                      }
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
                              fontSize: 12,
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

            <FormControl >
              <Controller
                control={control}
                name='toDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat='YYYY/MM/DD'
                      label={
                        <span style={{ fontSize: 16 }}>
                          {<FormattedLabel id="todate"></FormattedLabel>}
                        </span>
                      }
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
                              fontSize: 12,
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

            <FormControl
              variant='standard'
              sx={{ marginTop: 5, minWidth: 120 }}
              error={!!errors.advertisementType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="advertisementtype"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Advertisement Type *'
                  >
                    {advertisementTypes &&
                      advertisementTypes.map((advertisementType, index) => (
                        <MenuItem key={index} value={advertisementType.id}>
                          {advertisementType.advertisementType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='advertisementType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.advertisementType
                  ? errors.advertisementType.message
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
            <FormControl
              variant='standard'
              sx={{ marginTop: 1, minWidth: 120 }}
              error={!!errors.mediaType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="mediaType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Media Type *'
                  >
                    {mediaTypes &&
                      mediaTypes.map((mediaType, index) => (
                        <MenuItem key={index} value={mediaType.id}>
                          {mediaType.mediaType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='mediaType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.mediaType
                  ? errors.mediaType.message
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
            <FormControl
              variant='standard'
              sx={{ marginTop: 1, minWidth: 120 }}
              error={!!errors.mediaSubType}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="mediaSubType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: 250 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Media Sub Type *'
                  >
                    {mediaSubTypes &&
                      mediaSubTypes.map((mediaSubType, index) => (
                        <MenuItem key={index} value={mediaSubType.id}>
                          {mediaSubType.mediaSubType}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='mediaSubType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.mediaSubType
                  ? errors.mediaSubType.message
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
            <FormControl style={{ marginTop: 20 }}>
              <b>
                <FormControlLabel
                  control={<Checkbox />}
                  label={<FormattedLabel id="isilluminated"></FormattedLabel>}
                  {...register("isIlluminatedCheckBox")}
                  onChange={(e) => {
                    isIlluminatedChange(e);
                  }}
                />
              </b>
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
              label={<FormattedLabel id="quantity"></FormattedLabel>}
              variant='standard'
              {...register("quantity")}
              error={!!errors.quantity}
              helperText={
                errors?.quantity
                  ? errors.quantity.message
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
              label={<FormattedLabel id="crAreaName"></FormattedLabel>}
              variant='standard'
              {...register("area")}
              error={!!errors.area}
              helperText={
                errors?.area
                  ? errors.area.message
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
              label={<FormattedLabel id="baselicensefees"></FormattedLabel>}

              variant='standard'
              {...register("baseLicenseFees")}
              error={!!errors.baseLicenseFees}
              helperText={
                errors?.baseLicenseFees
                  ? errors.baseLicenseFees.message
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
              label={<FormattedLabel id="zonepremium"></FormattedLabel>}
              variant='standard'
              {...register("zonePremium")}
              error={!!errors.zonePremium}
              helperText={
                errors?.zonePremium
                  ? errors.zonePremium.message
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
              label={<FormattedLabel id="roadpremium"></FormattedLabel>}
              variant='standard'
              {...register("roadPremium")}
              error={!!errors.roadPremium}
              helperText={
                errors?.roadPremium
                  ? errors.roadPremium.message
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
              label={<FormattedLabel id="illuminationpremium"></FormattedLabel>}
              variant='standard'
              {...register("illuminationPremium")}
              error={!!errors.illuminationPremium}
              helperText={
                errors?.illuminationPremium
                  ? errors.illuminationPremium.message
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
              label={<FormattedLabel id="centraldividerpremium"></FormattedLabel>}
              variant='standard'
              {...register("centralDividerPremium")}
              error={!!errors.centralDividerPremium}
              helperText={
                errors?.centralDividerPremium
                  ? errors.centralDividerPremium.message
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
              label={<FormattedLabel id="totallicfees"></FormattedLabel>}
              variant='standard'
              {...register("totalLicenseFees")}
              error={!!errors.totalLicenseFees}
              helperText={
                errors?.totalLicenseFees
                  ? errors.totalLicenseFees.message
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
              label={<FormattedLabel id="groundrent"></FormattedLabel>}
              variant='standard'
              {...register("groundRent")}
              error={!!errors.groundRent}
              helperText={
                errors?.groundRent
                  ? errors.groundRent.message
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
              label={<FormattedLabel id="groundrentannum"></FormattedLabel>}
              variant='standard'
              {...register("groundRentPerAnnum")}
              error={!!errors.groundRentPerAnnum}
              helperText={
                errors?.groundRentPerAnnum
                  ? errors.groundRentPerAnnum.message
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
              label={<FormattedLabel id="totalannualdemand"></FormattedLabel>}
              variant='standard'
              {...register("totalAnnualDemand")}
              error={!!errors.totalAnnualDemand}
              helperText={
                errors?.totalAnnualDemand
                  ? errors.totalAnnualDemand.message
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
              label={<FormattedLabel id="administrativeAndSupervisionFees"></FormattedLabel>}
              variant='standard'
              {...register("administrativeAndSupervisionFees")}
              error={!!errors.administrativeAndSupervisionFees}
              helperText={
                errors?.administrativeAndSupervisionFees
                  ? errors.administrativeAndSupervisionFees.message
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
              label={<FormattedLabel id="gst"></FormattedLabel>}
              variant='standard'
              {...register("gst")}
              error={!!errors.gst}
              helperText={
                errors?.gst
                  ? errors.gst.message
                  : null
              }
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>

            <Button
              sx={{ marginRight: 8 }}
              type='submit'
              variant='contained'
              color='success'
              endIcon={<SaveIcon />}
            >
              Save
            </Button>{" "}
            <Button
              sx={{ marginRight: 8 }}
              variant='contained'
              color='primary'
              endIcon={<ClearIcon />}
              onClick={() => cancellButton()}
            >
              Clear
            </Button>
            <Button
              variant='contained'
              color='error'
              endIcon={<ExitToAppIcon />}
              onClick={() => exitButton()}
            >
              Exit
            </Button>
          </Grid> */}
        </Grid>

      </div>


    </>
  );
};

export default ApplicantDetails;
