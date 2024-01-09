import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

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
  })
);

// Main
const AdditionalDetails = () => {
  const {
    control,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useFormContext();
  const inputState = getValues("inputState");
  const userToken = useGetToken();

  const language = useSelector((state) => state?.labels.language);
  // wards
  const [wards, setWards] = useState([]);

  // getWards
  const getWards = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setWards(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
            wardNameMr: row.wardNameMr,
            wardNo: row.wardNo,
            wardNoMr: row.wardNoMr,
          }))
        );
      });
  };

  // hawkingDurationDailys
  const [hawkingDurationDailys, setHawkingDurationDaily] = useState([]);

  // getHawkingDurationDaily
  const getHawkingDurationDaily = () => {
    axios
      .get(`${urls.HMSURL}/hawkingDurationDaily/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setHawkingDurationDaily(
          r.data.hawkingDurationDaily.map((row) => ({
            id: row.id,
            hawkingDurationDailyEn:
              moment(row.hawkingDurationDailyFrom, "HH:mm:ss").format(
                "hh:mm:ss A"
              ) +
              " To " +
              moment(row.hawkingDurationDailyTo, "HH:mm:ss").format(
                "hh:mm:ss A"
              ),
            hawkingDurationDailyMr:
              moment(row.hawkingDurationDailyFromMr, "HH:mm:ss").format(
                "hh:mm:ss A"
              ) +
              " To " +
              moment(row.hawkingDurationDailyToMr, "HH:mm:ss").format(
                "hh:mm:ss A"
              ),
          }))
        );
      });
  };

  // hawkerTypes
  const [hawkerTypes, setHawkerType] = useState([]);

  // getHawkerType
  const getHawkerType = () => {
    axios
      .get(`${urls.HMSURL}/hawkerType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setHawkerType(
          r.data.hawkerType.map((row) => ({
            id: row.id,
            hawkerType: row.hawkerType,
            hawkerTypeMr: row.hawkerTypeMr,
          }))
        );
      });
  };

  // Items
  const [items, setItems] = useState([]);

  // getItems
  const getItems = () => {
    axios
      .get(`${urls.HMSURL}/item/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setItems(
          r.data.item.map((row) => ({
            id: row.id,
            item: row.item,
            itemMr: row.itemMr,
          }))
        );
      });
  };

  // Bank Masters
  const [bankMasters, setBankMasters] = useState([]);

  // getBankMasters
  const getBankMasters = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setBankMasters(
          r.data.bank.map((row) => ({
            id: row.id,
            bankMaster: row.bankName,
            bankMasterMr: row.bankNameMr,
          }))
        );
      });
  };

  // hawkingZoneName
  const [hawkingZoneNames, setHawkingZoneName] = useState([]);

  // getHawkingZoneName
  const getHawkingZoneName = () => {
    axios
      .get(`${urls.HMSURL}/hawingZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setHawkingZoneName(
          r.data.hawkingZone.map((row) => ({
            id: row.id,
            hawkingZoneName: row.hawkingZoneName,
            hawkingZoneNameMr: row.hawkingZoneNameMr,
          }))
        );
      });
  };

  // streetvendorModeNames
  const [streetvendorModeNames, setStreetvendorModeNames] = useState([]);

  // getStreetvendorName
  const getStreetvendorName = () => {
    // axios.get(`${urls.HMSURL}/hawingZone/getAll`).then((r) => {
    //   setStreetvendorModeNames(
    //     r.data.map((row) => ({
    //       id: row.id,
    //       streetvendorModeName: row.streetvendorModeName,
    //       streetvendorModeNamesMr: row.streetvendorModeName,
    //     })),
    //   );
    // });
  };

  // educations
  const [educations, setEducations] = useState([]);

  // getEducations
  const getEducations = () => {
    axios
      .get(`${urls.HMSURL}/hawingZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setEducations(
          r.data.hawkingZone.map((row) => ({
            id: row.id,
            educations: row.educations,
            educationsMr: row.educations,
          }))
        );
      });
  };

  // useEffect
  useEffect(() => {
    getWards();
    getHawkingDurationDaily();
    getHawkerType();
    getItems();
    getBankMasters();
    getHawkingZoneName();
    getEducations();
  }, []);

  // Drawer Code
  const [open, setOpen] = React.useState(false);

  // Open Drawer
  const handleDrawerOpen = () => {
    setOpen(!open);
    drawerWidth = "50%";
  };

  // Close Drawer
  const handleDrawerClose = () => {
    setOpen(false);
    drawerWidth = 0;
  };

  return (
    <>
      {/** Button */}
      {/** <Box
        style={{
          right: 25,
          position: "absolute",
          top: "50%",
          backgroundColor: "#bdbdbd",
        }}
      >
        <IconButton
          color='inherit'
          aria-label='open drawer'
          // edge="end"
          onClick={handleDrawerOpen}
          sx={{ width: "30px", height: "75px", borderRadius: 0 }}
        >
          <ArrowLeftIcon />
        </IconButton>
      </Box>
      */}
      {/** Button Close */}

      {/** Main Component */}
      <Main>
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
          <strong>{<FormattedLabel id="additionalDetails" />}</strong>
          {/** <Typography variant='h6' sx={{ marginTop: 4 }}>
          <strong> Additional Details</strong>
        </Typography>*/}
        </div>
        <Grid
          container
          sx={{
            marginTop: 1,
            marginBottom: 5,
            paddingLeft: "50px",
            align: "center",
          }}
        >
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              error={!!errors.hawkingZoneName}
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="hawkingZoneName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={inputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="hawkingZoneName" />}
                  >
                    {hawkingZoneNames &&
                      hawkingZoneNames.map((hawkingZoneName, index) => (
                        <MenuItem key={index} value={hawkingZoneName.id}>
                          {language == "en"
                            ? hawkingZoneName?.hawkingZoneName
                            : hawkingZoneName?.hawkingZoneNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="hawkingZoneName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.hawkingZoneName
                  ? errors.hawkingZoneName.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              error={!!errors.streetvendorModeName}
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="streetvendorModeName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={inputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="streetvendorModeName" />}
                  >
                    {streetvendorModeNames &&
                      streetvendorModeNames.map(
                        (streetvendorModeName, index) => (
                          <MenuItem key={index} value={hawkingMode.id}>
                            {language == "en"
                              ? streetvendorModeName?.streetvendorModeName
                              : streetvendorModeName?.streetvendorModeNameMr}
                          </MenuItem>
                        )
                      )}
                  </Select>
                )}
                name="streetvendorModeName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.streetvendorModeName
                  ? errors.streetvendorModeName.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.wardName}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="wardName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={inputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="wardName" />}
                  >
                    {wards &&
                      wards.map((wardName, index) => (
                        <MenuItem key={index} value={wardName.id}>
                          {language == "en"
                            ? wardName?.wardName
                            : wardName?.wardNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="wardName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.wardName ? errors.wardName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={inputState}
              id="standard-basic"
              label={<FormattedLabel id="natureOfBusiness" />}
              variant="standard"
              {...register("natureOfBusiness")}
              error={!!errors.natureOfBusiness}
              helperText={
                errors?.natureOfBusiness
                  ? errors.natureOfBusiness.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              disabled={inputState}
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.hawkingDurationDaily}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="hawkingDurationDaily" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="hawkingDurationDaily" />}
                  >
                    {hawkingDurationDailys &&
                      hawkingDurationDailys.map(
                        (hawkingDurationDaily, index) => (
                          <MenuItem key={index} value={hawkingDurationDaily.id}>
                            {language == "en"
                              ? hawkingDurationDaily?.hawkingDurationDailyEn
                              : hawkingDurationDaily?.hawkingDurationDailyMr}
                          </MenuItem>
                        )
                      )}
                    {/**
                  <MenuItem value={1}>Hawking Duratio 1</MenuItem>
                  <MenuItem value={2}>Hawking Duratio 2</MenuItem>
                  <MenuItem value={3}>Hawking Duratio 3</MenuItem>
                */}
                  </Select>
                )}
                name="hawkingDurationDaily"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.hawkingDurationDaily
                  ? errors.hawkingDurationDaily.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              disabled={inputState}
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.hawkerType}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="hawkerType" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={inputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="hawkerType" />}
                  >
                    {hawkerTypes &&
                      hawkerTypes.map((hawkerType, index) => (
                        <MenuItem key={index} value={hawkerType.id}>
                          {language == "en"
                            ? hawkerType?.hawkerType
                            : hawkerType?.hawkerTypeMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="hawkerType"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.hawkerType ? errors.hawkerType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              sx={{ marginTop: 2 }}
              error={!!errors.item}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="item" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={inputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="item" />}
                  >
                    {items &&
                      items.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {language == "en" ? item?.item : item?.itemMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="item"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.item ? errors.item.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={inputState}
              sx={{ width: 250 }}
              id="standard-basic"
              label={<FormattedLabel id="oldLicenseNo" />}
              variant="standard"
              {...register("oldLicenseNo")}
              error={!!errors.name}
              helperText={
                errors?.oldLicenseNo ? errors.oldLicenseNo.message : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 0 }} error={!!errors.oldLicenseDate}>
              <Controller
                control={control}
                name="oldLicenseDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={inputState}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 16, marginTop: 2 }}>
                          {<FormattedLabel id="oldLicenseDate" />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
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
              <FormHelperText>
                {errors?.oldLicenseDate ? errors.oldLicenseDate.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              variant="standard"
              error={!!errors.education}
              sx={{ marginTop: 2 }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="education" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    disabled={inputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label={<FormattedLabel id="education" />}
                  >
                    {educations &&
                      educations.map((education, index) => (
                        <MenuItem key={index} value={education.id}>
                          {language == "en"
                            ? education?.education
                            : education?.educationMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="education"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.education ? errors.education.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name="periodOfResidenceInMaharashtra"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={inputState}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 15, marginTop: 0 }}>
                          {
                            <FormattedLabel id="periodOfResidenceInMaharashtra" />
                          }
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
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
              {/** 
              <FormHelperText>
                {errors?.periodOfResidenceInMaharashtra ? errors.periodOfResidenceInMaharashtra.message : null}
              </FormHelperText>
            */}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 0 }}>
              <Controller
                control={control}
                name="periodOfResidenceInPCMC"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled={inputState}
                      inputFormat="DD/MM/YYYY"
                      label={
                        <span style={{ fontSize: 15, marginTop: 0 }}>
                          {<FormattedLabel id="periodOfResidenceInPcmc" />}
                        </span>
                      }
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
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
              {/** 
              <FormHelperText>
                {errors?.periodOfResidenceInMaharashtra ? errors.periodOfResidenceInMaharashtra.message : null}
              </FormHelperText>
            */}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={inputState}
              id="standard-basic"
              label={<FormattedLabel id="areaOfStreetvendor" />}
              variant="standard"
              {...register("areaOfStreetvendor")}
              error={!!errors.areaOfStreetvendor}
              helperText={
                errors?.areaOfStreetvendor
                  ? errors.areaOfStreetvendor.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} sx={{ marginTop: 2 }}>
            <FormControl flexDirection="row">
              <FormLabel
                sx={{ width: "230px" }}
                id="demo-row-radio-buttons-group-label"
              >
                {<FormattedLabel id="voterNameYN" />}
              </FormLabel>

              <Controller
                name="voterNameYN"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    disabled={inputState}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    selected={field.value}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                  >
                    <FormControlLabel
                      value="true"
                      disabled={inputState}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="yes" />}
                      error={!!errors.voterNameYN}
                      helperText={
                        errors?.voterNameYN ? errors.voterNameYN.message : null
                      }
                    />
                    <FormControlLabel
                      value="false"
                      disabled={inputState}
                      control={<Radio size="small" />}
                      label={<FormattedLabel id="no" />}
                      error={!!errors.voterNameYN}
                      helperText={
                        errors?.voterNameYN ? errors.voterNameYN.message : null
                      }
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              disabled={inputState}
              id="standard-basic"
              label={<FormattedLabel id="voterId" />}
              variant="standard"
              {...register("voterId")}
              error={!!errors.voterId}
              helperText={errors?.voterId ? errors.voterId.message : null}
            />
          </Grid>

          {inputState ? (
            <></>
          ) : (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <Button
                sx={{
                  marginTop: "5vh",
                  margin: "normal",
                  width: 230,
                  // height: "40px",
                }}
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  handleDrawerOpen();
                }}
              >
                <FormattedLabel id="viewLocationOnMap" />
              </Button>
            </Grid>
          )}
        </Grid>

        {/** New Grid */}
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
          <strong>{<FormattedLabel id="bankDetails" />}</strong>
          {/** <Typography variant='h6' sx={{ marginTop: 4 }}>
          <strong> Bank Details</strong>
        </Typography>*/}
        </div>
        <Grid
          container
          sx={{
            marginTop: 1,
            marginBottom: 5,
            paddingLeft: "50px",
            align: "center",
          }}
        >
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              disabled={inputState}
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
                    label={<FormattedLabel id="bankName" />}
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
              disabled={inputState}
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
                       disabled={inputState}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label='Branch Name *'
                    >
                      {branchNames &&
                        branchNames.map((branchName, index) => (
                          <MenuItem key={index} value={branchName.id}>
                            {language=="en"?branchName?.branchName:branchName?.branchNameMr}
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
              disabled={inputState}
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
              disabled={inputState}
              id="standard-basic"
              label={<FormattedLabel id="ifscCode" />}
              variant="standard"
              {...register("ifscCode")}
              error={!!errors.ifscCode}
              helperText={errors?.ifscCode ? errors.ifscCode.message : null}
            />
          </Grid>
        </Grid>
      </Main>
      {/** Main Component */}

      {/** Drawer  */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        {/* <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader> */}
        {/* <Divider /> */}

        <Box
          style={{
            left: 0,

            position: "absolute",
            top: "50%",
            backgroundColor: "#bdbdbd",
          }}
        >
          <IconButton
            aria-label="open drawer"
            // edge="end"
            onClick={handleDrawerClose}
            sx={{
              width: "30px",
              height: "75px",
              borderRadius: 0,
              color: "blue",
            }}
          >
            <ArrowRightIcon />
          </IconButton>
        </Box>
        <img
          src="/ABC.jpg"
          //hegiht='300px'
          width="800px"
          alt="Map Not Found"
          style={{ width: "100%", height: "100%" }}
        />
      </Drawer>
      {/** End Drawer  */}
    </>
  );
};

export default AdditionalDetails;
