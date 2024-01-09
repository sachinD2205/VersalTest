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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import UploadButton1 from "../../../components/streetVendorManagementSystem/fileUpload/UploadButton1";
import AadharAuthentication from "./AadharAuthentication";
import AdditionalDetails from "./AdditionalDetails";
import AddressOfHawker from "./AddressOfHawker";
import HawkerDetails from "./ApplicantDetails";
import PropertyAndWaterTaxes from "./PropertyAndWaterTaxes";
import SiteVisitView from "./SiteVisitView";

/** Authore - Sachin Durge */
//  Verification Application Details
const VerificationAppplicationDetails = (props) => {
  const userToken = useGetToken();
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
  const [aadharPhoto, setAadharPhoto] = useState(null);
  const [rationCardPhoto, setRationCardPhoto] = useState(null);
  const [disablityCertificatePhoto, setDisablityCertificatePhoto] =
    useState(null);
  const [otherDocumentPhoto, setOtherDocumentPhoto] = useState(null);
  const [applicantPhoto, setApplicantPhoto] = useState(null);
  const [chequeorPassbookPhoto, setChequeOrPassbookPhoto] = useState(null);
  const [shopBusinessOldLicensePhoto, setBusinessOldLicensePhoto] =
    useState(null);
  const [formPreviewDailog, setFormPreviewDailog] = useState(false);
  const [documentPreviewDialog, setDocumentPreviewDialog] = useState(false);
  const [siteVisitPreviewDailog, setSiteVisitPreviewDailog] = useState(false);

  // Form Preview - ===================>
  const formPreviewDailogOpen = () => setFormPreviewDailog(true);
  const formPreviewDailogClose = () => setFormPreviewDailog(false);

  // Document  Preview Dailog - ===================>
  const documentPreviewDailogOpen = () => setDocumentPreviewDialog(true);
  const documentPreviewDailogClose = () => setDocumentPreviewDialog(false);

  // Site Visit Preview
  const siteVisitPreviewDailogOpen = () => setSiteVisitPreviewDailog(true);
  const siteVisitPreviewDailogClose = () => setSiteVisitPreviewDailog(false);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // serviceNames
  const getserviceNames = () => {
    const url = `${urls.CFCURL}/master/service/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          setServiceNames(
            r?.data?.service?.map((row) => ({
              id: row?.id,
              serviceName: row?.serviceName,
              serviceNameMr: row?.serviceNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        //callCatchMethod(error, language);
      });
  };

  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  //! =======================> useEffect =====>
  useEffect(() => {
    getserviceNames();
  }, []);

  // view
  return (
    <>
      <FormProvider {...methods}>
        <Grid container>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <TextField
              id="standard-basic"
              sx={{ width: "50vh" }}
              label={<FormattedLabel id="applicationNumber" />}
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
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <TextField
              id="standard-basic"
              label={<FormattedLabel id="applicantName" />}
              disabled
              defaultValue=""
              {...register("applicantName")}
              error={!!errors.applicantName}
              helperText={
                errors?.applicantName ? errors.applicantName.message : null
              }
            />
          </Grid>
          <Grid item xs={4} md={4} xl={4} lg={4} sm={4}>
            <FormControl
              error={!!errors.applicationDate}
              sx={{ marginTop: 0 }}
              // sx={{ border: "solid 1px yellow" }}
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
            <FormControl error={!!errors.serviceName} sx={{ marginTop: 2 }}>
              <InputLabel id="demo-simple-select-standard-label">
                {<FormattedLabel id="serviceName" />}
              </InputLabel>
              <Controller
                render={({ field }) => (
                  <Select
                    sx={{ width: "50vh" }}
                    disabled
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
                onClick={() => {
                  console.log("ViewFormButtonProps", props?.props);
                  reset(props?.props);
                  setValue("serviceName", props.serviceId);
                  setValue("disabledFieldInputState", true);
                  formPreviewDailogOpen();
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  size="small"
                >
                  {<FormattedLabel id="viewForm" />}
                </Button>
              </IconButton>

              {/** View Document Button */}
              <IconButton
                onClick={() => {
                  console.log("viewDocumentButtonProps", props?.props);
                  reset(props?.props);
                  setValue("serviceName", props.serviceId);
                  documentPreviewDailogOpen();
                }}
              >
                <Button
                  variant="contained"
                  endIcon={<VisibilityIcon />}
                  size="small"
                >
                  {<FormattedLabel id="viewDocument" />}
                </Button>
              </IconButton>

              {/** site visit preview Button */}
              {props?.siteVisitPreviewButtonInputState && (
                <IconButton
                  onClick={() => {
                    console.log(
                      "siteVisitPreviewButton",
                      props?.props?.siteVisit
                    );
                    reset(props?.props);
                    setValue("serviceName", props.serviceId);
                    setValue("disabledFieldInputState", true);
                    setValue("siteVisitData", props?.props?.siteVisit);
                    siteVisitPreviewDailogOpen();
                  }}
                >
                  <Button
                    variant="contained"
                    endIcon={<VisibilityIcon />}
                    size="small"
                  >
                    {<FormattedLabel id="siteVisitFormPreview" />}
                  </Button>
                </IconButton>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/** Form Preview Dailog  - OK */}
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={formPreviewDailog}
          onClose={() => formPreviewDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                {<FormattedLabel id="viewForm" />}
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
                  onClick={() => {
                    formPreviewDailogClose();
                  }}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <HawkerDetails />
            <AddressOfHawker />
            <AadharAuthentication />
            <PropertyAndWaterTaxes />
            <AdditionalDetails />
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
              <Button onClick={() => formPreviewDailogClose()}>
                {" "}
                {<FormattedLabel id="exit" />}
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>

        {/** Document Preview Dailog - OK */}
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={documentPreviewDialog}
          onClose={() => documentPreviewDailogClose()}
        >
          <Paper sx={{ p: 2 }}>
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
                  {<FormattedLabel id="viewDocument" />}
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
                    onClick={() => documentPreviewDailogClose()}
                  >
                    <CloseIcon
                      sx={{
                        color: "black",
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
                alignItems: "center",
              }}
            >
              <TableContainer style={{ border: "2px soiid black" }}>
                <Table style={{ border: "2px soiid red" }}>
                  {/** Table Header */}
                  <TableHead
                    stickyheader={true}
                    sx={{
                      backgroundColor: "#1890ff",
                    }}
                  >
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>
                          {" "}
                          {<FormattedLabel id="srNo" />}
                        </h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>
                          {<FormattedLabel id="DocumentName" />}
                        </h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>
                          {<FormattedLabel id="mandatory" />}
                        </h3>
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <h3 style={{ color: "white" }}>
                          {<FormattedLabel id="viewDocument" />}
                        </h3>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/** Hawker Photo */}
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        1
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="hawkerPhoto" required />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="mandatory" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="HMS"
                          serviceName="H-IssuanceofHawkerLicense"
                          filePath={setApplicantPhoto}
                          fileName={getValues("applicantPhoto")}
                        />
                      </TableCell>
                    </TableRow>

                    {/** Aadhaar Card Photo */}
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        2
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="adharCard" required />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="mandatory" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="HMS"
                          serviceName="H-IssuanceofHawkerLicense"
                          filePath={setAadharPhoto}
                          fileName={getValues("aadharPhoto")}
                        />
                      </TableCell>
                    </TableRow>
                    {/** Pan Card Photo */}
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        3
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="panCard" required />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="mandatory" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="HMS"
                          serviceName="H-IssuanceofHawkerLicense"
                          filePath={setPanCardPhoto}
                          fileName={getValues("panCardPhoto")}
                        />
                      </TableCell>
                    </TableRow>

                    {/** Ration Card Photo */}
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        4
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="rationCard" required />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="mandatory" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="HMS"
                          serviceName="H-IssuanceofHawkerLicense"
                          filePath={setRationCardPhoto}
                          fileName={getValues("rationCardPhoto")}
                        />
                      </TableCell>
                    </TableRow>

                    {/** shop business old licences phtoto  */}
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        5
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {
                          <FormattedLabel
                            id="shopBusinessOldLicensePhoto"
                            required
                          />
                        }
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="mandatory" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="HMS"
                          serviceName="H-IssuanceofHawkerLicense"
                          filePath={setBusinessOldLicensePhoto}
                          fileName={getValues("shopBusinessOldLicensePhoto")}
                        />
                      </TableCell>
                    </TableRow>

                    {/** Cheque or Passbook photo  */}
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        6
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="chequeorPassbookPhoto" required />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="mandatory" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="HMS"
                          serviceName="H-IssuanceofHawkerLicense"
                          filePath={setChequeOrPassbookPhoto}
                          fileName={getValues("chequeorPassbookPhoto")}
                        />
                      </TableCell>
                    </TableRow>

                    {/** disablity Certificate Photo */}
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        7
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="disablityCretificatePhoto" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="nonMandatory" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="HMS"
                          serviceName="H-IssuanceofHawkerLicense"
                          filePath={disablityCertificatePhoto}
                          fileName={getValues("disablityCertificatePhoto")}
                        />
                      </TableCell>
                    </TableRow>

                    {/** other Photo */}
                    <TableRow>
                      <TableCell style={{ border: "2px soiid black" }}>
                        8
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="otherDocumentPhoto" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        {<FormattedLabel id="nonMandatory" />}
                      </TableCell>
                      <TableCell style={{ border: "2px soiid black" }}>
                        <UploadButton1
                          appName="HMS"
                          serviceName="H-IssuanceofHawkerLicense"
                          filePath={setOtherDocumentPhoto}
                          fileName={getValues("otherDocumentPhoto")}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
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
                <Button
                  variant="contained"
                  onClick={() => documentPreviewDailogClose()}
                >
                  {<FormattedLabel id="exit" />}
                </Button>
              </Grid>
            </DialogTitle>
          </Paper>
        </Dialog>

        {/** Form Preview Dailog  - OK */}
        <Dialog
          fullWidth
          maxWidth={"xl"}
          open={siteVisitPreviewDailog}
          onClose={() => siteVisitPreviewDailogClose()}
        >
          <CssBaseline />
          <DialogTitle>
            <Grid container>
              <Grid item xs={6} sm={6} lg={6} xl={6} md={6}>
                {<FormattedLabel id="siteVisitFormPreview" />}
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
                      color: "white",
                    },
                  }}
                  onClick={() => siteVisitPreviewDailogClose()}
                >
                  <CloseIcon
                    sx={{
                      color: "black",
                    }}
                  />
                </IconButton>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent>
            <SiteVisitView props={watch("siteVisitData")} />
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
              <Button onClick={() => siteVisitPreviewDailogClose()}>
                {" "}
                {<FormattedLabel id="exit" />}
              </Button>
            </Grid>
          </DialogTitle>
        </Dialog>
      </FormProvider>
    </>
  );
};

export default VerificationAppplicationDetails;
