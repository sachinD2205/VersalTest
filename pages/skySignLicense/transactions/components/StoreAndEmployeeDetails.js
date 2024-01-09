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
  import { FileDownload } from "@mui/icons-material";
  import { useRouter } from "next/router";
  
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
  
  
  const IndustryAndEmployeeDetaills = (props) => {
    const {
      control,
      register,
      reset,
      watch,
      setValue,
      formState: { errors },
    } = useFormContext();
  
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
  
    const router = useRouter()
    const [disabled, setDisabled] = useState(false)
  
  
    useEffect(() => {
      console.log("abc12345", router.query);
      // if (router.query.pageMode === 'Add' || router.query.pageMode === 'Edit') {
      //   setDisabled(false)
      // } else {
      //   setDisabled(true)
      // }
      if (router.query.disabled) {
        setDisabled(true)
      } else if (props.disabled) {
        setDisabled(true)
      } else {
        setDisabled(false)
      }
    }, [])
  
    useEffect(() => {
      if (watch('trnStoreDetailsDao.officeStaff') || watch('trnStoreDetailsDao.permanentEmployees') || watch('trnStoreDetailsDao.temporaryEmployees') || watch('trnStoreDetailsDao.contractualEmployees') || watch('trnStoreDetailsDao.totalEmployees')) {
        let tempTotal = 0;
        tempTotal = Number(watch('trnStoreDetailsDao.officeStaff')) + Number(watch('trnStoreDetailsDao.permanentEmployees')) + Number(watch('trnStoreDetailsDao.temporaryEmployees')) + Number(watch('trnStoreDetailsDao.contractualEmployees'))
        console.log("temptotal", tempTotal);
        setValue('trnStoreDetailsDao.totalEmployees', Number(tempTotal))
      }
  
    }, [watch('trnStoreDetailsDao.officeStaff'), watch('trnStoreDetailsDao.permanentEmployees'), watch('trnStoreDetailsDao.temporaryEmployees'), watch('trnStoreDetailsDao.contractualEmployees'), watch('trnStoreDetailsDao.totalEmployees')])
  
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
            <FormattedLabel id='employeeDetaills' />
          </div>
          {/* <div>
            <Typography className={styles.rap} variant='h6' sx={{ marginTop: 5 }}>
              <strong> Employees Details</strong>
              {<FormattedLabel id="employeeDetaills"></FormattedLabel>}
            </Typography>
          </div> */}
          <Grid
            container
            sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
          >
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TextField
                disabled={disabled}
                sx={{ width: 250 }}
                id='standard-basic'
                label={<FormattedLabel id="officeStaff"></FormattedLabel>}
                variant='standard'
                {...register("trnStoreDetailsDao.officeStaff")}
                error={!!errors.officeStaff}
                helperText={
                  errors?.officeStaff
                    ? errors.officeStaff.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TextField
                disabled={disabled}
                sx={{ width: 250 }}
                id='standard-basic'
                label={<FormattedLabel id="permanentEmployees"></FormattedLabel>}
                variant='standard'
                {...register("trnStoreDetailsDao.permanentEmployees")}
                error={!!errors.permanentEmployees}
                helperText={
                  errors?.permanentEmployees
                    ? errors.permanentEmployees.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TextField
                disabled={disabled}
                sx={{ width: 250 }}
                id='standard-basic'
                label={<FormattedLabel id="temporaryEmployees"></FormattedLabel>}
                variant='standard'
                {...register("trnStoreDetailsDao.temporaryEmployees")}
                error={!!errors.temporaryEmployees}
                helperText={
                  errors?.temporaryEmployees
                    ? errors.temporaryEmployees.message
                    : null
                }
              />
            </Grid>
  
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TextField
                disabled={disabled}
                sx={{ width: 250 }}
                id='standard-basic'
                label={<FormattedLabel id="contractualEmployees"></FormattedLabel>}
                variant='standard'
                {...register("trnStoreDetailsDao.contractualEmployees")}
                error={!!errors.contractualEmployees}
                helperText={
                  errors?.contractualEmployees
                    ? errors.contractualEmployees.message
                    : null
                }
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <TextField
                // disabled={disabled}
                disabled
                sx={{ width: 250 }}
                id='standard-basic'
                InputLabelProps={{ shrink: true }}
                label={<FormattedLabel id="totalEmployees"></FormattedLabel>}
                variant='standard'
                {...register("trnStoreDetailsDao.totalEmployees")}
                error={!!errors.totalEmployees}
                helperText={
                  errors?.totalEmployees
                    ? errors.totalEmployees.message
                    : null
                }
              />
            </Grid>
          </Grid>
  
          {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <TextField
                sx={{ width: 250 }}
                id='standard-basic'
                label={<FormattedLabel id="workingHours"></FormattedLabel>}
                variant='standard'
                {...register("workingHours")}
                error={!!errors.workingHours}
                helperText={
                  errors?.workingHours
                    ? errors.workingHours.message
                    : null
                }
              />
            </Grid> */}
  
          {/* table */}
  
  
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
            <FormattedLabel id='isavailable' />
          </div>
          <div style={{ display: "flex", flexDirection: "row", alignItems: 'center' }}>
            {/* label sathi */}
            {/* <div style={{ display: "flex", flexDirection: "column", width: '45vw' }}>
  
              <div style={{ marginLeft: 35, marginTop: '1.5vh', marginBottom: '1.5vh' }}>
                {<FormattedLabel id="fireEquirepment" />}
              </div>
              <div style={{ marginLeft: 35, marginTop: '1.5vh', marginBottom: '1.5vh' }}>
                {<FormattedLabel id="firstAidKit" />}
              </div>
              <div style={{ marginLeft: 35, marginTop: '1.5vh', marginBottom: '1.5vh' }}>
                {<FormattedLabel id="toilets" />}
              </div>
              <div style={{ marginLeft: 35, marginTop: '1.5vh', marginBottom: '1.5vh' }}>
                {<FormattedLabel id="storageofrawmaterial" />}
              </div>
              <div style={{ marginLeft: 35, marginTop: '1.5vh', marginBottom: '1.5vh' }}>
                {<FormattedLabel id="disposalSystemOfWaste" />}
              </div>
              <div style={{ marginLeft: 35, marginTop: '1.5vh', marginBottom: '1.5vh' }}>
                {<FormattedLabel id="nuisanceOfResidents" />}
              </div>
              <div style={{ marginLeft: 35, marginTop: '1.5vh', marginBottom: '1.5vh' }}>
                {<FormattedLabel id="ObjectionCertificate" />}
              </div>
              <div style={{ marginLeft: 35, marginTop: '1.5vh', marginBottom: '1.5vh' }}>
                {<FormattedLabel id="separatebusiness" />}
              </div>
  
            </div> */}
            {/* radio sathi */}
            <div style={{ display: "flex", flexDirection: "column", width: '45vw', margin: "5vh" }}>
  
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="fireEquirepment" />}</FormLabel>
                <Controller
                  name="trnStoreDetailsDao.fireEquirepment"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        error={!!errors?.fireEquirepment}
                        value="true"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        error={!!errors?.fireEquirepment}
                        value="false"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.fireEquirepment}>
                  {errors?.fireEquirepment ? errors?.fireEquirepment?.message : null}
                </FormHelperText>
              </FormControl>
  
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="firstAidKit" />}</FormLabel>
  
                <Controller
                  name="trnStoreDetailsDao.firstAidKit"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        error={!!errors?.firstAidKit}
                        value="true"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        error={!!errors?.firstAidKit}
                        value="false"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.firstAidKit}>
                  {errors?.firstAidKit ? errors?.firstAidKit?.message : null}
                </FormHelperText>
              </FormControl>
  
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="toilets" />}</FormLabel>
                <Controller
                  name="trnStoreDetailsDao.toilets"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        error={!!errors?.toilets}
                        value="true"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        error={!!errors?.toilets}
                        value="false"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.toilets}>
                  {errors?.toilets ? errors?.toilets?.message : null}
                </FormHelperText>
              </FormControl>
  
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="storageofrawmaterial" />}</FormLabel>
                <Controller
                  name="trnStoreDetailsDao.storageofrawmaterial"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        error={!!errors?.storageofrawmaterial}
                        value="true"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        error={!!errors?.storageofrawmaterial}
                        value="false"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.storageofrawmaterial}>
                  {errors?.storageofrawmaterial ? errors?.storageofrawmaterial?.message : null}
                </FormHelperText>
              </FormControl>
  
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="disposalSystemOfWaste" />}</FormLabel>
                <Controller
                  name="trnStoreDetailsDao.disposalSystemOfWaste"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        error={!!errors?.disposalSystemOfWaste}
                        value="true"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        error={!!errors?.disposalSystemOfWaste}
                        value="false"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.disposalSystemOfWaste}>
                  {errors?.disposalSystemOfWaste ? errors?.disposalSystemOfWaste?.message : null}
                </FormHelperText>
              </FormControl>
  
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="nuisanceOfResidents" />}</FormLabel>
                <Controller
                  name="trnStoreDetailsDao.nuisanceOfResidents"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        error={!!errors?.nuisanceOfResidents}
                        value="true"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        error={!!errors?.nuisanceOfResidents}
                        value="false"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.nuisanceOfResidents}>
                  {errors?.nuisanceOfResidents ? errors?.nuisanceOfResidents?.message : null}
                </FormHelperText>
              </FormControl>
  
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="ObjectionCertificate" />}</FormLabel>
                <Controller
                  name="trnStoreDetailsDao.ObjectionCertificate"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        error={!!errors?.ObjectionCertificate}
                        value="true"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        error={!!errors?.ObjectionCertificate}
                        value="false"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.ObjectionCertificate}>
                  {errors?.ObjectionCertificate ? errors?.ObjectionCertificate?.message : null}
                </FormHelperText>
              </FormControl>
  
              <FormControl flexDirection="row">
                <FormLabel id="demo-simple-select-standard-label">{<FormattedLabel id="separatebusiness" />}</FormLabel>
                <Controller
                  name="trnStoreDetailsDao.separatebusiness"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      disabled={disabled}
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      selected={field.value}
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                    >
                      <FormControlLabel
                        error={!!errors?.separatebusiness}
                        value="true"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="yes" />}
                      />
                      <FormControlLabel
                        error={!!errors?.separatebusiness}
                        value="false"
                        disabled={disabled}
                        control={<Radio size="small" />}
                        label={<FormattedLabel id="no" />}
                      />
                    </RadioGroup>
                  )}
                />
                <FormHelperText error={!!errors?.separatebusiness}>
                  {errors?.separatebusiness ? errors?.separatebusiness?.message : null}
                </FormHelperText>
              </FormControl>
  
  
              <div>
  
              </div>
            </div>
          </div>
  
  
        </Main >
      </>
    )
  };
  export default IndustryAndEmployeeDetaills;