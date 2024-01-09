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


} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../styles/skysignstyles/components.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

/////////////////// Drawer Related

import { styled, useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Drawer from "@mui/material/Drawer";
import { Button } from "antd";
import { useSelector } from "react-redux";

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

const BusinessOrIndustryInfo = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  const [ownership, setownership] = useState([]);
  const [zone, setzone] = useState([]);
  const [licenseType, setlicenseType] = useState([]);
  const [businessType, setbusinessType] = useState([]);
  const [businessSubType, setbusinessSubType] = useState([]);
  const [industryType, setindustryType] = useState([]);
  const [constructionType, setconstructionType] = useState([]);

  const language = useSelector((state) => state?.labels.language);

  const getownership = () => {
    axios
      .get(`${urls.PTAXURL}/master/ownershipType/getAll`)
      .then((r) => {
        setownership(
          r.data.map((row) => ({
            id: row.id,
            ownershipEn: row.ownershipType,
            ownershipMar: row.ownershipTypeMr,
          })),
        );
      });
  };

  const getzone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`)
      .then((r) => {
        setzone(
          r.data.zone.map((row) => ({
            id: row.id,
            zoneEn: row.zoneName,
            zoneMar: row.zoneNameMr,
          })),
        );
      });
  };

  const getlicenseType = () => {
    axios
      .get(`${urls.SSLM}/master/MstLicenseType/getAll`)
      .then((r) => {
        setlicenseType(
          r.data.MstLicenseType.map((row) => ({
            id: row.id,
            licenseTypeEn: row.licenseType,
            licenseTypeMar: row.licenseTypeMar,
          })),
        );
      });
  };

  const getbusinessType = () => {
    axios
      .get(`${urls.CFCURL}/master/businessType/getAll`)
      .then((r) => {
        setbusinessType(
          r.data.businessType.map((row) => ({
            id: row.id,
            businessTypeEn: row.businessType,
            businessTypeMar: row.businessTypeMr,
          })),
        );
      });
  };

  const getbusinessSubType = () => {
    axios
      .get(`${urls.CFCURL}/master/businessSubType/getAll`)
      .then((r) => {
        setbusinessSubType(
          r.data.businessSubType.map((row) => ({
            id: row.id,
            businessSubTypeEn: row.businessSubType,
            businessSubTypeMar: row.businessSubTypeMr,
          })),
        );
      });
  };


  const getindustryType = () => {
    axios
      .get(`${urls.PTAXURL}/master/industryType/getAll`)
      .then((r) => {
        setindustryType(
          r.data.map((row) => ({
            id: row.id,
            industryTypeEn: row.industryName,
            industryTypeMar: row.industryNameMr,
          })),
        );
      });
  };
  const getconstructionType = () => {
    axios
      .get(`${urls.PTAXURL}/master/constructionType/getAll`)
      .then((r) => {
        setconstructionType(
          r.data.map((row) => ({
            id: row.id,
            constructionTypeEn: row.constructionTypeName,
            constructionTypeMar: row.constructionTypeNameMr,
          })),
        );
      });
  };
  useEffect(() => {
    getownership();
    getbusinessType();
    getbusinessSubType();
    getlicenseType();
    getconstructionType();
    getindustryType();
    getzone();
  }, []);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);



  return (
    <>
      {/** Main Component  */}
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
          <FormattedLabel id='organizationInformation' />
        </div>
        {/* <div>
          <Typography className={styles.rap} variant='h6' sx={{ marginTop: 5 }}>
            <strong>Organization Information</strong>
            {<FormattedLabel id="organizationInformation"></FormattedLabel>}
          </Typography>
        </div> */}
        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
        >
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="nameOfOrganization"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.nameOfOrganization")}
              error={!!errors.nameOfOrganization}
              helperText={
                errors?.nameOfOrganization
                  ? errors.nameOfOrganization.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="crPropertyTaxNumber"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.propertyNo")}
              error={!!errors.propertyNo}
              helperText={
                errors?.propertyNo
                  ? errors.propertyNo.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="propertyStatus"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.propertyStatus")}
              error={!!errors.propertyStatus}
              helperText={
                errors?.propertyStatus
                  ? errors.propertyStatus.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.ownership}>
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="ownership"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Ownership *'
                  >
                    {ownership &&
                      ownership.map((ownership, index) => (
                        <MenuItem key={index} value={ownership.id}>
                          {ownership.ownership}
                          {language == 'en'
                            ?
                            ownership?.ownershipEn
                            : ownership?.ownershipMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='trnIndustryBussinessDetailsDao.ownership'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.ownership ? errors.ownership.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              sx={{ width: 230 }}
              id='standard-basic'
              label={<FormattedLabel id="totalAreaFt"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.totalAreaFt")}
              error={!!errors.totalAreaFt}
              helperText={
                errors?.totalAreaFt
                  ? errors.totalAreaFt.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="totalAreaM"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.totalAreaM")}
              error={!!errors.totalAreaM}
              helperText={
                errors?.totalAreaM
                  ? errors.totalAreaM.message
                  : null
              }
            />
          </Grid>


          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.zone}>
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="zone"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Zone *'
                  >
                    {zone &&
                      zone.map((zone, index) => (
                        <MenuItem key={index} value={zone.id}>
                          {zone.zone}


                          {language == 'en'
                            ?
                            zone?.zoneEn
                            : zone?.zoneMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='trnIndustryBussinessDetailsDao.zone'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.zone ? errors.zone.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.licenseType}>
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="licenseType"></FormattedLabel>}

              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='License Type *'
                  >
                    {licenseType &&
                      licenseType.map((licenseType, index) => (
                        <MenuItem key={index} value={licenseType.id}>
                          {licenseType.licenseType}

                          {language == 'en'
                            ?
                            licenseType?.licenseTypeEn
                            : licenseType?.licenseTypeMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='trnIndustryBussinessDetailsDao.licenseType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.licenseType ? errors.licenseType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>


          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.licenseType}>
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="industryType"></FormattedLabel>}

              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Industry Type *'
                  >
                    {industryType &&
                      industryType.map((industryType, index) => (
                        <MenuItem key={index} value={industryType.id}>
                          {industryType.industryType}
                          {language == 'en'
                            ?
                            industryType?.industryTypeEn
                            : industryType?.industryTypeMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='trnIndustryBussinessDetailsDao.industryType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.industryType ? errors.industryType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>


          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.businessType}>
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="businessType"></FormattedLabel>}

              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Business Type *'
                  >
                    {businessType &&
                      businessType.map((businessType, index) => (
                        <MenuItem key={index} value={businessType.id}>
                          {businessType.businessType}
                          {language == 'en'
                            ?
                            businessType?.businessTypeEn
                            : businessType?.businessTypeMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='trnIndustryBussinessDetailsDao.businessType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.businessType ? errors.businessType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.businessSubType}>
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="businessSubType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Business Sub Type *'
                  >
                    {businessSubType &&
                      businessSubType.map((businessSubType, index) => (
                        <MenuItem key={index} value={businessSubType.id}>
                          {businessSubType.businessSubType}
                          {language == 'en'
                            ?
                            businessSubType?.businessSubTypeEn
                            : businessSubType?.businessSubTypeMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='trnIndustryBussinessDetailsDao.businessSubType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.businessSubType ? errors.businessSubType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl sx={{ marginTop: 2 }} error={!!errors.constructionType}>
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="constructionType"></FormattedLabel>}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label='Construction Type *'
                  >
                    {constructionType &&
                      constructionType.map((constructionType, index) => (
                        <MenuItem key={index} value={constructionType.id}>
                          {constructionType.constructionType}
                          {language == 'en'
                            ?
                            constructionType?.constructionTypeEn
                            : constructionType?.constructionTypeMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='trnIndustryBussinessDetailsDao.constructionType'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.constructionType ? errors.constructionType.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="constructionAreaFt"></FormattedLabel>}

              {...register("trnIndustryBussinessDetailsDao.constructionAreaFt")}
              error={!!errors.constructionAreaFt}
              helperText={
                errors?.constructionAreaFt
                  ? errors.constructionAreaFt.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="constructionAreaM"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.constructionAreaM")}
              error={!!errors.constructionAreaM}
              helperText={
                errors?.constructionAreaM
                  ? errors.constructionAreaM.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="machineCount"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.machineCount")}
              error={!!errors.machineCount}
              helperText={
                errors?.machineCount
                  ? errors.machineCount.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              // label='Total number of machines in the industry*'
              label={<FormattedLabel id="businessLocationTotalCountOfMachineries"></FormattedLabel>}

              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.businessLocationTotalCountOfMachineries")}
              error={!!errors.businessLocationTotalCountOfMachineries}
              helperText={
                errors?.businessLocationTotalCountOfMachineries
                  ? errors.businessLocationTotalCountOfMachineries.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="workingHours"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.workingHours")}
              error={!!errors.workingHours}
              helperText={
                errors?.workingHours
                  ? errors.workingHours.message
                  : null
              }
            />
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label='Unit *'
              {...register("unit")}
              error={!!errors.unit}
              helperText={
                errors?.unit
                  ? errors.unit.message
                  : null
              }
            />
          </Grid> */}

        </Grid>



        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
          <FormControl sx={{ flexDirection: "row" }} style={{ marginTop: 10, marginLeft: 35 }}>
            <Controller
              sx={{ marginTop: 0 }}
              control={control}
              name='trnIndustryBussinessDetailsDao.industryDate'
              defaultValue={null}
              render={({ field }) => (

                <LocalizationProvider dateAdapter={AdapterMoment}>


                  {
                    <FormattedLabel id="industryDate" />
                    //  <span style={{ fontSize: 16 }}>
                    // If the company is still in operation, then the date of commencement of Industry?
                    //  </span>
                  }
                  <DatePicker
                    inputFormat='YYYY/MM/DD'

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
                            marginTop: 0,
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </FormControl>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: 2 }}>
            <FormControl sx={{ flexDirection: "row" }} style={{ marginTop: 10, marginLeft: 35 }}>

              <Controller
                control={control}
                name='trnIndustryBussinessDetailsDao.temporarylicDate'
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    {<FormattedLabel id="temporarylicDate"></FormattedLabel>
                      // <span style={{ fontSize: 16 }}>
                      //  Date of issuance of temporary license subject to conditions in Notarized Guarantee 
                      // </span>
                    }
                    <DatePicker
                      sx={{ marginTop: 0 }}
                      inputFormat='YYYY/MM/DD'

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
        </Grid>



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
          <FormattedLabel id='industryaddress' />
        </div>
        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, align: "center" }}
        >
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl>
              <FormLabel id='demo-row-radio-buttons-group-label'>
                {<FormattedLabel id="crCitySurveyNumber"></FormattedLabel>}
                {/* {<FormattedLabel id="applicantIsFirm"></FormattedLabel>} */}

              </FormLabel>
              <RadioGroup
                row
                aria-labelledby='demo-row-radio-buttons-group-label'
                name='row-radio-buttons-group'
              >
                <FormControlLabel
                  value='citysurveyno'
                  control={<Radio />}
                  label={<FormattedLabel id="citysurveyno"></FormattedLabel>}
                  // label="citysurveyno"
                  name='numbertype'
                  {...register("trnIndustryBussinessDetailsDao.numbertype")}
                  error={!!errors.numbertype}
                  helperText={errors?.numbertype ? errors.numbertype.message : null}
                />
                <FormControlLabel
                  value='blockno'
                  control={<Radio />}
                  label={<FormattedLabel id="blockno"></FormattedLabel>}
                  name='numbertype'
                  {...register("trnIndustryBussinessDetailsDao.numbertype")}
                  error={!!errors.numbertype}
                  helperText={errors?.numbertype ? errors.numbertype.message : null}
                />

                <FormControlLabel
                  value='sectorno'
                  control={<Radio />}
                  label={<FormattedLabel id="sectorno"></FormattedLabel>}
                  name='numbertype'
                  {...register("trnIndustryBussinessDetailsDao.numbertype")}
                  error={!!errors.numbertype}
                  helperText={errors?.numbertype ? errors.numbertype.message : null}
                />

                <FormControlLabel
                  value='surveyno'
                  control={<Radio />}
                  label={<FormattedLabel id="surveyno"></FormattedLabel>}
                  name='numbertype'
                  {...register("trnIndustryBussinessDetailsDao.numbertype")}
                  error={!!errors.numbertype}
                  helperText={errors?.numbertype ? errors.numbertype.message : null}
                />
              </RadioGroup>
            </FormControl>

          </Grid>


          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="crCitySurveyNumber"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.citySurveyNo")}
              error={!!errors.citySurveyNo}
              helperText={
                errors?.citySurveyNo
                  ? errors.citySurveyNo.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="plotNo"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.plotNo")}
              error={!!errors.plotNo}
              helperText={
                errors?.plotNo
                  ? errors.plotNo.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              autoFocus
              id='standard-basic'
              label={<FormattedLabel id="roadName"></FormattedLabel>}
              {...register("trnIndustryBussinessDetailsDao.roadName")}
              error={!!errors.roadName}
              helperText={
                errors?.roadName
                  ? errors.roadName.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="villageName"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.villageName")}
              error={!!errors.villageName}
              helperText={
                errors?.villageName
                  ? errors.villageName.message
                  : null
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              // disabled
              // defaultValue={"Pimpri Chinchwad"}
              label={<FormattedLabel id="crCityName"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.prCityName1")}
              error={!!errors.prCityName1}
              helperText={errors?.prCityName1 ? errors.prCityName1.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              // disabled
              // defaultValue={"Maharashtra"}
              label={<FormattedLabel id="crState"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.prState1")}
              error={!!errors.prState1}
              helperText={errors?.prState1 ? errors.prState1.message : null}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="crPincode"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.Pincode")}
              error={!!errors.Pincode}
              helperText={
                errors?.Pincode
                  ? errors.Pincode.message
                  : null
              }
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="machineCount"></FormattedLabel>}
              variant='standard'
              {...register("machineCount")}
              error={!!errors.machineCount}
              helperText={
                errors?.machineCount
                  ? errors.machineCount.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              sx={{ width: 250 }}
              id='standard-basic'
              // label='Total number of machines in the industry*'
              label={<FormattedLabel id="businessLocationTotalCountOfMachineries"></FormattedLabel>}

              variant='standard'
              {...register("businessLocationTotalCountOfMachineries")}
              error={!!errors.businessLocationTotalCountOfMachineries}
              helperText={
                errors?.businessLocationTotalCountOfMachineries
                  ? errors.businessLocationTotalCountOfMachineries.message
                  : null
              }
            />
          </Grid> */}


          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                sx={{ width: 250 }}
                id='standard-basic'
                label='License Fees*'
                variant='standard'
                {...register("licenseFees")}
                error={!!errors.licenseFees}
                helperText={errors?.licenseFees ? errors.licenseFees.message : null}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                sx={{ width: 250 }}
                id='standard-basic'
                label='Penalty Fees *'
                variant='standard'
                {...register("penaltyFees")}
                error={!!errors.penaltyFees}
                helperText={errors?.penaltyFees ? errors.penaltyFees.message : null}
              />
           </Grid>
           <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
              <TextField
                sx={{ width: 250 }}
                id='standard-basic'
                label='Notice Fees*'
                variant='standard'
                {...register("noticeFees")}
                error={!!errors.noticeFees}
                helperText={
                  errors?.noticeFees
                    ? errors.noticeFees.message
                    : null
                }
              />
             </Grid>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
                        <FormControl style={{ marginTop: 10 }}>
                          <Controller
                            control={control}
                            name='licenseValidity '
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat='YYYY/MM/DD'
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                     License Validity 
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
             </Grid> */}


        </Grid>
      </Main >
    </>
  )


};

export default BusinessOrIndustryInfo;