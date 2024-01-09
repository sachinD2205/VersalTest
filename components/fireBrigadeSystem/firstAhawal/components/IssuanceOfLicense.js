import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Box,

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



const IssuanceOfLicense = () => {
  const {
    control,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useFormContext();

  // ServiceName
  const [serviceNames, setServiceNames] = useState([]);


  useEffect(() => {
    //alert("df")
    // console.log("router?.query.pageMode", router?.query.pageMode);
    // if (router?.query.pageMode === 'Edit') {
    //   setValue("courtCaseNumber", router?.query?.courtCaseNumber);
    // } else
    {
      getApplication();
    }
  },);



  const language = useSelector((state) => state?.labels.language);

  // getserviceNames
  const getserviceNames = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceNameEn: row.serviceName,
          serviceNameMar: row.serviceNameMr,
        })),
      );

    });
  };

  // useEffect
  useEffect(() => {
    getserviceNames();
  }, []);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const getApplication = () => {
    axios
      .get(`${urls.SSLM}/Trn/ApplicantDetails/getApplicationNo`)
      .then((res) => {

        setValue("applicationNumber", res.data);

      });
  };



  return (
    <Box>
      {/** Main Component  */}
      <Main>
        <div>
          <Typography className={styles.rap} variant='h6' sx={{ marginTop: 5 }}>
            <strong> </strong>
          </Typography>
        </div>
        <Grid
          container
          sx={{ marginLeft: 5, marginTop: 2, marginBottom: 5, align: "center" }}
        >

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>

            <FormControl
              variant='standard'
              sx={{ marginTop: 2 }}
              error={!!errors.serviceName}
            >
              <InputLabel id='demo-simple-select-standard-label'>
                {<FormattedLabel id="serviceNames" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    // sx={{ width: 500 }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}

                  >
                    {serviceNames &&
                      serviceNames.map((serviceName, index) => (
                        <MenuItem key={index} value={serviceName.id}>
                          {serviceName.serviceName}

                          {language == 'en'
                            ?
                            serviceName?.serviceNameEn
                            : serviceName?.serviceNameMar}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name='serviceName'
                control={control}
                defaultValue=''
              />
              <FormHelperText>
                {errors?.serviceName ? errors.serviceName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              id='standard-basic'
              InputLabelProps={{ shrink: true }}

              label={<FormattedLabel id="applicationNumber" />}
              variant='standard'
              disabled
              // defaultValue='23848494848'
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <FormControl
              sx={{ marginTop: 0 }}
              error={!!errors.applicationDate}
            >
              <Controller
                control={control}
                name='applicationDate'
                // defaultValue={Date.now()}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled
                      inputFormat='DD/MM/YYYY'
                      label={
                        <span style={{ fontSize: 16 }}>
                          <FormattedLabel id="applicationDate" />
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
              <FormHelperText>
                {errors?.applicationDate
                  ? errors.applicationDate.message
                  : null}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              
              id='standard-basic'
              label='Tracking ID *'
              variant='standard'
              disabled
              {...register("trackingID")}
              error={!!errors.trackingID}
              helperText={errors?.trackingID ? errors.trackingID.message : null}
            />
         </Grid>
         <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              
              id='standard-basic'
              label='License No. *'
              variant='standard'
              {...register("licenseNo")}
              error={!!errors.licenseNo}
              helperText={
                errors?.licenseNo ? errors.licenseNo.message : null
              }
            />
         </Grid>
          
         <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <TextField
              
              id='standard-basic'
              label='Search '
              variant='standard'
              {...register("search")}
              error={!!errors.search}
              helperText={errors?.search ? errors.search.message : null}
            />
         </Grid> */}
        </Grid>
      </Main>
    </Box>
  );
};

export default IssuanceOfLicense;
