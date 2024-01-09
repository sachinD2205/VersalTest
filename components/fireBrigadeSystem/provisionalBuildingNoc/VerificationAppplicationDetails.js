import CloseIcon from "@mui/icons-material/Close";
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
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Stack, flexbox } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import urls from "../../../URLS/urls";
import DocumentVerification from "../../../components/fireBrigadeSystem/provisionalBuildingNocNew/DocumentVerification";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import ApplicantDetails from "../../fireBrigadeSystem/provisionalBuildingNocNew/ApplicantDetails";
// import BuildingDetails from "./BuildingDetails";
// import FormsDetails from "./FormsDetails";
// import OwnerDetail from "./OwnerDetail";
import BuildingDetails from "../../fireBrigadeSystem/provisionalBuildingNocNew/BuildingDetails";
import OwnerDetail from "../provisionalBuildingNocNew/OwnerDetail";
import FormsDetails from "../provisionalBuildingNocNew/FormsDetails";

//  Verification Application Details
const VerificationAppplicationDetails = (props) => {
  // const methods = useForm();
  const methods = useFormContext();
  const {
    control,
    getValues,
    setValue,
    register,
    watch,
    reset,
    formState: { errors },
  } = methods;
  const [serviceNames, setServiceNames] = useState([]);
  const language = useSelector((state) => state?.labes?.language);
  const [panCardPhoto, setPanCardPhoto] = useState();
  const [aadhaarCardPhoto, setAadhaarCardPhoto] = useState(null);
  const [rationCardPhoto, setRationCardPhoto] = useState(null);
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] =
    useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [affidaviteOnRS100StampAttache, seteAffidaviteOnRS100StampAttache] =
    useState(null);
  const [overHearWaterTankCoApprovedMaps, setWaterTank] = useState(null);
  const [layoutPlan, setLayoutPlan] = useState(null);
  const [tank, setTank] = useState(null);
  const [permission, setPermission] = useState(null);
  const [stability, setStability] = useState(null);
  const [fireDrawing, setFireDrawing] = useState(null);
  const [elivation, setElivation] = useState(null);
  const [road, setRoad] = useState(null);
  const [explosive, setExplosive] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [lift, setLift] = useState(null);
  // Form Preview - ===================>
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Document  Preview Dailog - ===================>
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  // getserviceNames
  const getserviceNames = () => {
    axios.get(`${urls.CFCURL}/master/service/getAll`).then((r) => {
      setServiceNames(
        r.data.service.map((row) => ({
          id: row.id,
          serviceName: row.serviceName,
          serviceNameMr: row.serviceNameMr,
        }))
      );
    });
  };

  useEffect(() => {
    getserviceNames();
  }, []);

  useEffect(() => {
    console.log("propssdflsdjf", props);
  }, [props]);

  return (
    <>
      <FormProvider {...methods}>
        <Grid container>
          {/* <Grid item lg={3} md={3} xl={3} sm={12} xs={12} sx={{ marginTop: 2, marginLeft:1 }}>
            <FormControl error={!!errors.serviceName}>
              <InputLabel id="demo-simple-select-standard-label">
                Service Name
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    autoWidth
                    autoFocus
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                    label="Service Name *"
                    id="demo-simple-select-standard"
                    labelId="id='demo-simple-select-standard-label'"
                  >
                    {serviceNames &&
                      serviceNames.map((serviceName, index) => (
                        <MenuItem key={index} value={serviceName.id}>
                          {language == "en"
                            ? serviceName?.serviceName
                            : serviceName?.serviceNameMr}
                        </MenuItem>
                      ))}
                  </Select>
                )}
                name="serviceName"
                control={control}
                defaultValue=""
              />
              <FormHelperText>
                {errors?.serviceName ? errors.serviceName.message : null}
              </FormHelperText>
            </FormControl>
          </Grid> */}
{/* 
<DialogTitle>
                 <b> {<FormattedLabel id="applicationDtlHeading" />}</b>
                </DialogTitle> */}

          <Grid item lg={3} md={3} xl={3} sm={12} xs={12} sx={{ marginTop: 2 ,marginLeft:6 ,marginRight:6}}>
            <TextField
              id="standard-basic"
              autoWidth
              sx={{ width: "40vh" }}
              label={<FormattedLabel id="applicationNo" />}
              disabled
              defaultValue=""
              {...register("applicationNumber")}
              error={!!errors.applicationNumber}
              helperText={
                errors?.applicationNumber
                  ? errors.applicationNumber.message
                  : null
              }
            />
          </Grid>

          <Grid item lg={3} md={3} xl={3} sm={12} xs={12}>
            <FormControl error={!!errors.applicationDate}>
              <Controller
                control={control}
                name="applicationDate"
                defaultValue={null}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      disabled
                      inputFormat="DD/MM/YYYY"
                      label="Application Date"
                      value={field.value}
                      onChange={(date) =>
                        field.onChange(moment(date).format("YYYY-MM-DD"))
                      }
                      selected={field.value}
                      center
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // size="small"
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

          <Grid item lg={3} md={3} xl={3} sm={12} xs={12} sx={{ marginTop: 2 }}>
            <TextField
              id="standard-basic"
              // sx={{ width: "50vh", marginLeft: 2 }}
              // sx={{ width: "50vh" }}
              label={<FormattedLabel id="applicationStatus" />}
              disabled
              defaultValue=""
              {...register("applicationStatus")}
              error={!!errors.applicationStatus}
              helperText={
                errors?.applicationStatus
                  ? errors.applicationStatus.message
                  : null
              }
            />
          </Grid>
        </Grid>

        <DialogTitle>
                 <b> View Form</b>
                </DialogTitle>
         
         {/* <DialogContent> */}
            {/* <PropertyTax /> */}
            <ApplicantDetails readOnly />
            <OwnerDetail view />
            <FormsDetails readOnly view />
            <BuildingDetails view />
            {/* <BuildingUse view /> */}
          {/* </DialogContent> */}
          {/* <DialogContent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              // width: 900,
            }}
          > */}

<DialogTitle>
                 <b> Document Verification</b>
                </DialogTitle>
            <DocumentVerification />
          {/* </DialogContent> */}
                


        {/* <Grid container>
          <Grid item xs={12} sm={12} md={12} xl={12} lg={12}>
            <Stack
              style={{ display: flexbox, justifyContent: "center" }}
              spacing={3}
              direction={"row"}
            >
            
              <IconButton
                onClick={() => {
                  console.log("viewFormProps", props?.props);
                  // reset(props?.props);
                  setValue("serviceName", props.serviceId);
                  formPreviewDailogOpen();
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  size="small"
                >
                  View Form
                </Button>
              </IconButton>



              <IconButton>
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  size="small"
                  onClick={() => {
                    reset(props?.props);
                    setValue("serviceName", props.serviceId);
                    documentPreviewDailogOpen();
                  }}
                >
                  View Document
                </Button>
              </IconButton>
            </Stack>
          </Grid>
        </Grid> */}

        {/** Form Preview Dailog  - OK */}
        <Dialog
          fullWidth
          maxWidth={"lg"}
          open={formPreviewDailog}
          onClose={() => formPreviewDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                Preview
              </Grid>
              <Grid
                item
                xs={1}
                sm={2}
                md={4}
                lg={6}
                xl={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <IconButton
                  aria-label="delete"
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                    onClick={() => {
                      formPreviewDailogClose();
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            {/* <PropertyTax /> */}
            <ApplicantDetails readOnly />
            <OwnerDetail view />
            <FormsDetails readOnly view />
            <BuildingDetails view />
            {/* <BuildingUse view /> */}
          </DialogContent>
          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button onClick={formPreviewDailogClose}>Exit</Button>
            </Grid>
          </DialogTitle>
        </Dialog>

        {/** Document Preview Dailog - OK */}
        <Dialog
          fullWidth
          // fullScreen
          maxWidth={"lg"}
          open={documentPreviewDialog}
          onClose={() => documentPreviewDailogClose()}
        >
          {/* <Paper sx={{ p: 2 }}> */}
          <CssBaseline />

          <DialogTitle>
            <Grid container>
              <Grid
                item
                xs={6}
                sm={6}
                lg={6}
                xl={6}
                md={6}
                sx={{
                  display: "flex",
                  alignItem: "left",
                  justifyContent: "left",
                }}
              >
                <FormattedLabel id="documentPreview" />
              </Grid>

              <Grid
                item
                xs={1}
                sm={1}
                md={1}
                lg={1}
                xl={1}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginLeft: 30,
                }}
              >
                <IconButton
                  aria-label="delete"
                  sx={{
                    marginLeft: "530px",
                    backgroundColor: "primary",
                    ":hover": {
                      bgcolor: "red", // theme.palette.primary.main
                      color: "white",
                    },
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                    onClick={() => {
                      documentPreviewDailogClose();
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>

          <DialogContent
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              // width: 900,
            }}
          >
            <DocumentVerification />
          </DialogContent>

          <DialogTitle>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button variant="contained" onClick={documentPreviewDailogClose}>
                Exit
              </Button>
            </Grid>
          </DialogTitle>
          {/* </Paper> */}
        </Dialog>
      </FormProvider>
    </>
  );
};

export default VerificationAppplicationDetails;
