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


const IndustryAndEmployeeDetaills = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

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
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="officeStaff"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.officeStaff")}
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
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="permanentEmployees"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.permanentEmployees")}
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
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="temporaryEmployees"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.temporaryEmployees")}
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
              sx={{ width: 250 }}
              id='standard-basic'
              label={<FormattedLabel id="contractualEmployees"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.contractualEmployees")}
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
              sx={{ width: 250 }}
              id='standard-basic'

              label={<FormattedLabel id="totalEmployees"></FormattedLabel>}
              variant='standard'
              {...register("trnIndustryBussinessDetailsDao.totalEmployees")}
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
          <div style={{ display: "flex", flexDirection: "column", width: '45vw' }}>

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

          </div>
          {/* radio sathi */}
          <div style={{ display: "flex", flexDirection: "column", width: '45vw' }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id="yes"></FormattedLabel>}

                name='fireEquirepment'
                {...register("trnIndustryBussinessDetailsDao.fireEquirepment")}
                error={!!errors.fireEquirepment}
                helperText={errors?.fireEquirepment ? errors.fireEquirepment.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id="no"></FormattedLabel>}

                name='fireEquirepment'
                {...register("trnIndustryBussinessDetailsDao.fireEquirepment")}
                error={!!errors.fireEquirepment}
                helperText={errors?.fireEquirepment ? errors.fireEquirepment.message : null}
              />


            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>

              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id="yes"></FormattedLabel>}
                name='firstAidKit'
                {...register("trnIndustryBussinessDetailsDao.firstAidKit")}
                error={!!errors.firstAidKit}
                helperText={errors?.firstAidKit ? errors.firstAidKit.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id="no"></FormattedLabel>}

                name='firstAidKit'
                {...register("trnIndustryBussinessDetailsDao.firstAidKit")}
                error={!!errors.firstAidKit}
                helperText={errors?.firstAidKit ? errors.firstAidKit.message : null}
              />

            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>

              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id="yes"></FormattedLabel>}
                name='toilets'
                {...register("trnIndustryBussinessDetailsDao.toilets")}
                error={!!errors.toilets}
                helperText={errors?.toilets ? errors.toilets.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id="no"></FormattedLabel>}

                name='toilets'
                {...register("trnIndustryBussinessDetailsDao.toilets")}
                error={!!errors.toilets}
                helperText={errors?.toilets ? errors.toilets.message : null}
              />

            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>

              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id="yes"></FormattedLabel>}
                name='storageofrawmaterial'
                {...register("trnIndustryBussinessDetailsDao.storageofrawmaterial")}
                error={!!errors.storageofrawmaterial}
                helperText={errors?.storageofrawmaterial ? errors.storageofrawmaterial.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id="no"></FormattedLabel>}

                name='storageofrawmaterial'
                {...register("trnIndustryBussinessDetailsDao.storageofrawmaterial")}
                error={!!errors.storageofrawmaterial}
                helperText={errors?.storageofrawmaterial ? errors.storageofrawmaterial.message : null}
              />


            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>

              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id="yes"></FormattedLabel>}
                name='disposalSystemOfWaste'
                {...register("trnIndustryBussinessDetailsDao.disposalSystemOfWaste")}
                error={!!errors.disposalSystemOfWaste}
                helperText={errors?.disposalSystemOfWaste ? errors.disposalSystemOfWaste.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id="no"></FormattedLabel>}

                name='disposalSystemOfWaste'
                {...register("trnIndustryBussinessDetailsDao.disposalSystemOfWaste")}
                error={!!errors.disposalSystemOfWaste}
                helperText={errors?.disposalSystemOfWaste ? errors.disposalSystemOfWaste.message : null}
              />


            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>

              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id="yes"></FormattedLabel>}
                name='nuisanceOfResidents'
                {...register("trnIndustryBussinessDetailsDao.nuisanceOfResidents")}
                error={!!errors.nuisanceOfResidents}
                helperText={errors?.nuisanceOfResidents ? errors.nuisanceOfResidents.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id="no"></FormattedLabel>}

                name='nuisanceOfResidents'
                {...register("trnIndustryBussinessDetailsDao.nuisanceOfResidents")}
                error={!!errors.nuisanceOfResidents}
                helperText={errors?.nuisanceOfResidents ? errors.nuisanceOfResidents.message : null}
              />

            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id="yes" />}
                name='ObjectionCertificate'
                {...register("trnIndustryBussinessDetailsDao.ObjectionCertificate")}
                error={!!errors.ObjectionCertificate}
                helperText={errors?.ObjectionCertificate ? errors.ObjectionCertificate.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id="no" />}
                name='ObjectionCertificate'
                {...register("trnIndustryBussinessDetailsDao.ObjectionCertificate")}
                error={!!errors.ObjectionCertificate}
                helperText={errors?.ObjectionCertificate ? errors.ObjectionCertificate.message : null}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <FormControlLabel
                value='Yes'
                control={<Radio />}
                label={<FormattedLabel id="yes"></FormattedLabel>}

                name='separatebusiness'
                {...register("trnIndustryBussinessDetailsDao.separatebusiness")}
                error={!!errors.separatebusiness}
                helperText={errors?.separatebusiness ? errors.separatebusiness.message : null}
              />
              <FormControlLabel
                value='NO'
                control={<Radio />}
                label={<FormattedLabel id="no"></FormattedLabel>}

                name='separatebusiness'
                {...register("trnIndustryBussinessDetailsDao.separatebusiness")}
                error={!!errors.separatebusiness}
                helperText={errors?.separatebusiness ? errors.separatebusiness.message : null}
              />


            </div>
            <div>

            </div>
          </div>
        </div>


      </Main >
    </>
  )
};
export default IndustryAndEmployeeDetaills;