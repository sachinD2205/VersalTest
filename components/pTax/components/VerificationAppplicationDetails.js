import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Button,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  ThemeProvider
} from "@mui/material";
import { Stack, flexbox } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../theme";
import { catchExceptionHandlingMethod } from "../../../util/util";
import ViewFormDepartment from "./ViewFormDepartment";
import ViewDocumentFormDepartment from "./ViewDocumentFormDepartment";
import ApproveRejectDailog from "./ApproveRejectDailog";

/** Authore - Sachin Durge */
//  Verification Application Details
const Index = () => {
  const userToken = useGetToken();
  const {
    control,
    getValues,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels?.language);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const getByIdPropertyRegistractionData = () => {
    console.log("sdfdslf32432", watch("id"))

    setValue("loadderState", true)

    const url = `${urls.PTAXURL}/transaction/property/getById`;

    const finalBodyForApi = {
      id: watch("id")
    }

    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {

          if (r?.data) {

            const finalData = {
              ...watch(),
              ...r?.data,

              //! propertyHoldersDetails
              collapse: (r?.data?.propertyHoldersDetails != null && r?.data?.propertyHoldersDetails != undefined && r?.data?.propertyHoldersDetails != "" && r?.data?.propertyHoldersDetails.filter(data => data?.activeFlag == "Y").length >= 1) ? false : true,

              addHolderInputState: (r?.data?.propertyHoldersDetails != null && r?.data?.propertyHoldersDetails != undefined && r?.data?.propertyHoldersDetails != "" && r?.data?.propertyHoldersDetails.filter(data => data?.activeFlag == "Y").length >= 1) ? false : true,

              //! propertyInformation 
              collapsePropertyInformation: (r?.data?.propertyDetails != null && r?.data?.propertyDetails != undefined && r?.data?.propertyDetails != "" && r?.data?.propertyDetails.filter(data => data?.activeFlag == "Y").length >= 1) ? false : true,

              addPropertyInformationInputState: (
                r?.data?.propertyDetails != null &&
                r?.data?.propertyDetails != undefined &&
                r?.data?.propertyDetails != ""
                && r?.data?.propertyDetails.filter(data => data?.activeFlag == "Y").length >= 1) ? false : true,

              //! electric
              collapseElectricConnection: false,
              addElectricConnectionInformationInputState: false,

              //! water
              addWaterConnectionInformationInputState: false,
              collapseWaterConnection: false,

              //! documents 
              documents: r?.data?.documents != null && r?.data?.documents != undefined && r?.data?.documents != "" && r?.data?.documents.length >= 1 ? r?.data?.documents?.sort((a, b) => a?.id - b?.id)?.map((data, index) => { return { srNo: index + 1, ...data } }) : null,

              //! 
              verificationDailog: true,

              //! 
              disabledFieldInputState: true,
            }
            console.log("finalDFDSFDF", finalData);
            reset(finalData)
            setValue("trnProprtyHolderAddressDao.addressCheckBox",
              r?.data?.trnProprtyHolderAddressDao?.addressCheckBox == true || r?.data?.trnProprtyHolderAddressDao?.addressCheckBox == "true" || r?.data?.trnProprtyHolderAddressDao?.addressCheckBox == 1 ? true : false)
          }
          setValue("loadderState", false)

        } else {
          setValue("loadderState", false)
        }
      })
      .catch((error) => {
        setValue("loadderState", false)
        callCatchMethod(error, language)
      })
  }

  //! =======================> useEffect =====>

  useEffect(() => {
    if (watch("id")) {
      getByIdPropertyRegistractionData();
    }
  }, [watch("id")])

  //! =============>  view
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={watch("verificationDailog")}
          onClose={() => {
            const data = {
              loadderState: false,
              verificationDailog: false,
            }
            reset(data);
          }}
        >
          <CssBaseline />
          <DialogTitle>
            {<FormattedLabel id="basicApplicationDetails" />}
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={4} md={4} xl={5} lg={4} sm={4}>
                <TextField
                  id="standard-basic"
                  sx={{ width: "50vh" }}
                  label={<FormattedLabel id="applicationNumber" />}
                  disabled
                  defaultValue=""
                  {...register("applicationNo")}
                  error={!!errors.applicationNo}
                  helperText={
                    errors?.applicationNo
                      ? errors.applicationNo.message
                      : null
                  }
                />
              </Grid>
              <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
                {language == "en" ? <>
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="applicantName" />}
                    disabled
                    defaultValue=""
                    {...register("applicantFullNameEng")}
                    error={!!errors.applicantFullNameEng}
                    helperText={
                      errors?.applicantFullNameEng ? errors.applicantFullNameEng?.message : null
                    }
                  />
                </> : <>
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="applicantName" />}
                    disabled
                    defaultValue=""
                    {...register("applicantFullNameMr")}
                    error={!!errors.applicantFullNameMr}
                    helperText={
                      errors?.applicantFullNameMr ? errors?.applicantFullNameMr?.message : null
                    }
                  /></>}
              </Grid>
              <Grid item xs={4} md={4} xl={3} lg={4} sm={4}>
                <FormControl
                  error={!!errors.applicationDate}
                  sx={{ marginTop: 0 }}
                >
                  <Controller
                    control={control}
                    name="applicationDate"
                    defaultValue={Date.now()}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disabled
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              {<FormattedLabel id="applicationDate" />}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) =>
                            field.onChange(moment(date).format("YYYY-MM-DD"))
                          }
                          selected={field.value}
                          center
                          defaultValue={null}
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
                    {errors?.applicationDate
                      ? errors.applicationDate.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={12} md={4} lg={4} xl={4}>
                {language == "en" ? <>
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="serviceName" />}
                    disabled
                    defaultValue=""
                    {...register("serviceNameEng")}
                    error={!!errors.serviceNameEng}
                    helperText={
                      errors?.serviceNameEng ? errors.serviceNameEng?.message : null
                    }
                  />
                </> : <>
                  <TextField
                    id="standard-basic"
                    label={<FormattedLabel id="serviceName" />}
                    disabled
                    defaultValue=""
                    {...register("serviceNameMr")}
                    error={!!errors.serviceNameMr}
                    helperText={
                      errors?.serviceNameMr ? errors?.serviceNameMr?.message : null
                    }
                  /></>}
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
                <Stack
                  style={{ display: flexbox, justifyContent: "center" }}
                  spacing={3}
                  direction={"row"}
                >
                  {/** Form Preview Button */}
                  <IconButton
                    onClick={() => setValue("viewFormDailog", true)}
                  >
                    <Button
                      variant="contained"
                      endIcon={<VisibilityIcon />}
                      size="small"
                    >
                      {<FormattedLabel id="viewForm" />}
                    </Button>
                  </IconButton>

                  {/** view document Button */}
                  <IconButton
                    onClick={() => setValue("viewDocumentDailog", true)}
                  >
                    <Button
                      variant="contained"
                      endIcon={<VisibilityIcon />}
                      size="small"
                    >
                      {<FormattedLabel id="viewDocument" />}
                    </Button>
                  </IconButton>
                  {/** Action */}
                  <IconButton
                    onClick={() => setValue("approveRejectDailog", true)}
                  >
                    <Button
                      variant="contained"
                      size="small"
                    >
                      {<FormattedLabel id="action" />}
                    </Button>
                  </IconButton>
                  {/* Exit Button */}
                  <IconButton
                    onClick={() => {
                      const data = {
                        loadderState: false,
                        verificationDailog: false,
                      }
                      reset(data);

                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                    >
                      {<FormattedLabel id="exit" />}
                    </Button>
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>

          </DialogContent>

        </Dialog>
        {/** View Form Dailog */}
        <ViewFormDepartment />
        <ViewDocumentFormDepartment />
        <ApproveRejectDailog />
      </ThemeProvider>
    </div >
  );
};

export default Index;
