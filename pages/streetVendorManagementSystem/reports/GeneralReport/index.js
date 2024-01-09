import { yupResolver } from "@hookform/resolvers/yup";
import { SearchOutlined } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import GeneralReportSchema from "../../../../components/streetVendorManagementSystem/schema/GeneralReportSchema";
import styles from "../../../../components/streetVendorManagementSystem/styles/GeneralReport.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import NewReportLayout from "../../../../components/streetVendorManagementSystem/components/NewReportLayout";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// HawkerLIcenseStatusReport
const Index = () => {
  let language = useSelector((state) => state.labels.language);
  const methods = useForm({
    resolver: yupResolver(GeneralReportSchema),
  });
  const {
    control,
    watch,
    register,
    setValue,
    clearErrors,
    getValues,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [reportData, setReportData] = useState([]);
  const [tempReportData, setTempReportData] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [hawkerTypes, setHawkerType] = useState([]);
  const [items, setItems] = useState([]);
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  // handlePrint
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  //handleNext
  const handleNext = (data) => {
    console.log("data", data);

    axios
      .get(
        `${urls.HMSURL}/report/getGeneralReport?wardName=${
          data?.wardName
        }&zoneName=${data?.zoneName}&fromDate=${moment(data?.fromDate).format(
          "YYYY-MM-DD"
        )}&toDate=${moment(data?.toDate).format("YYYY-MM-DD")}&isApproved=${
          data?.isApproved
        }&item=${data?.item}&hawkerType=${data?.hawkerType}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("generalReport", res?.data?.generalReport);
          if (
            res?.data?.generalReport != null &&
            res?.data?.generalReport != undefined &&
            res?.data?.generalReport != ""
          ) {
            setTempReportData(res?.data?.generalReport);
            sweetAlert({
              title: language == "en" ? "Success!" : "यशस्वीपणे",
              text:
                language == "en"
                  ? "Record Successfully Fetched!"
                  : "रेकॉर्ड यशस्वीरित्या आणले!",
              icon: "success",
              buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
            });
          } else {
            setTempReportData([]);
            sweetAlert({
              title: language == "en" ? "Empty!" : "रिकामे",
              text:
                language == "en" ? "Record Not Found!" : "रेकॉर्ड सापडला नाही!",
              icon: "error",
              buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
            });
          }
        } else {
          setTempReportData([]);
          sweetAlert({
            title: language == "en" ? "Empty!" : "रिकामे",
            text:
              language == "en" ? "Record Not Found!" : "रेकॉर्ड सापडला नाही!",
            icon: "error",
            buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
          });
        }
      })
      .catch((error) => {
        setTempReportData([]);
        callCatchMethod(error, language);
      });
  };

  // zones
  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setZoneNames(
            r?.data?.zone?.map((row) => ({
              id: row?.id,
              zoneName: row?.zoneName,
              zoneNameMr: row?.zoneNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  const getWardName = () => {
    if (
      watch("zoneName") != null &&
      watch("zoneName") != "" &&
      watch("zoneName") != undefined
    ) {
      let url = `${
        urls.CFCURL
      }/master/zoneWardAreaMapping/getWardByZoneAndModuleId?zoneId=${watch(
        "zoneName"
      )}`;

      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            setWardNames(
              r?.data?.map((row) => ({
                id: row?.wardId,
                wardName: row?.wardName,
                wardNameMr: row?.wardNameMr,
              }))
            );
          }
        })
        .catch((error) => {
          callCatchMethod(error, language);
          console.log("wardApiError", error);
        });
    }
  };

  // items
  const getItems = () => {
    axios
      .get(`${urls.HMSURL}/item/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setItems(
            r.data.item.map((row) => ({
              id: row.id,
              item: row.item,
              itemMr: row.itemMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // hawkerTypes
  const getHawkerType = () => {
    axios
      .get(`${urls.HMSURL}/hawkerType/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setHawkerType(
            r.data.hawkerType.map((row) => ({
              id: row.id,
              hawkerType: row.hawkerType,
              hawkerTypeMr: row.hawkerTypeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // clearButton
  const clearButton = () => {
    setValue("wardName", "");
    setValue("zoneName", "");
    setValue("fromDate");
    setValue("toDate");
    setValue("isApproved");
    setValue("hawkerType", "");
    setValue("item", "");
    clearErrors([
      "wardName",
      "zoneName",
      "fromDate",
      "toDate",
      "isApproved",
      "hawkerType",
      "item",
    ]);
    setTempReportData([]);
  };
  // exitButton
  const exitButton = () => {
    router.push(`/streetVendorManagementSystem/dashboards`);
  };

  // useEffect ----------->

  useEffect(() => {
    getZoneName();
    // getWardName();
    getItems();
    getHawkerType();
  }, []);

  useEffect(() => {
    console.log("tempReportData", tempReportData);
    let testReportData = [];
    if (
      tempReportData != null &&
      tempReportData != undefined &&
      tempReportData.length != 0
    ) {
      testReportData = tempReportData.map((data, index) => {
        return {
          ...data,
          srNo: index + 1,
          // for null issue resolve
          crPincode: data?.crPincode != null ? data?.crPincode : "",
          areaName: data?.areaName != null ? data?.areaName : "",
          areaMr: data?.areaMr != null ? data?.areaMr : "",
          landmarkMr: data?.landmarkMr != null ? data?.landmarkMr : "",
          villageMr: data?.villageMr != null ? data?.villageMr : "",
          crCityNameMr: data?.crCityNameMr != null ? data?.crCityNameMr : "",
          crStateMr: data?.crStateMr != null ? data?.crStateMr : "",
          crState: data?.crState != null ? data?.crState : "",
          crCityName: data?.crCityName != null ? data?.crCityName : "",
          crVillageName: data?.crVillageName != null ? data?.crVillageName : "",
          crLandmarkName:
            data?.crLandmarkName != null ? data?.crLandmarkName : "",
          crCitySurveyNumber:
            data?.crCitySurveyNumber != null ? data?.crCitySurveyNumber : "",
        };
      });
    } else {
      testReportData = [];
    }

    setReportData(testReportData);
  }, [tempReportData]);

  useEffect(() => {
    console.log("reportData", reportData);
  }, [reportData]);

  useEffect(() => {
    if (
      watch("zoneName") != null &&
      watch("zoneName") != "" &&
      watch("zoneName") != undefined
    ) {
      getWardName();
    }
  }, [watch("zoneName")]);

  // view -- search
  return (
    <>
      <Paper className={styles.Paper1} elevation={5}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            <ThemeProvider theme={theme}>
              <div className={styles.Paper1}>
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
                  <strong>
                    <center>
                      {language == "en" ? "General Report" : "सामान्य अहवाल"}
                    </center>
                  </strong>
                </div>
                <Grid container className={styles.GridMain}>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    xl={6}
                    className={styles.GridItem}
                  >
                    <FormControl flexDirection="row">
                      <FormLabel
                        sx={{ width: "230px" }}
                        id="demo-row-radio-buttons-group-label"
                        error={!!errors.isApproved}
                      >
                        {language == "en" ? "Status" : "स्थिती"}
                      </FormLabel>

                      <Controller
                        name="isApproved"
                        control={control}
                        render={({ field }) => (
                          <RadioGroup
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            selected={field.value}
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                          >
                            <FormControlLabel
                              error={!!errors?.isApproved}
                              value="Yes"
                              control={<Radio size="small" />}
                              label={language == "en" ? "Approved" : "मंजूर"}
                            />
                            <FormControlLabel
                              error={!!errors?.isApproved}
                              value="No"
                              control={<Radio size="small" />}
                              label={
                                language == "en"
                                  ? "Not Approved"
                                  : "मान्यता नाही"
                              }
                            />
                            <FormControlLabel
                              error={!!errors?.isApproved}
                              value="Yes,No"
                              control={<Radio size="small" />}
                              label={language == "en" ? "All" : "सर्व"}
                            />
                          </RadioGroup>
                        )}
                      />
                      <FormHelperText error={!!errors?.isApproved}>
                        {errors?.isApproved
                          ? errors?.isApproved?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors?.zoneName}
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel
                        id="demo-simple-select-standard-label"
                        shrink={
                          watch("zoneName") !== null &&
                          watch("zoneName") !== undefined &&
                          watch("zoneName") !== ""
                            ? true
                            : false
                        }
                      >
                        {<FormattedLabel id="zoneName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => {
                              setValue("wardName", null);
                              return field.onChange(value);
                            }}
                            label=<FormattedLabel id="zoneName" />
                          >
                            {zoneNames &&
                              zoneNames.map((zoneName, index) => (
                                <MenuItem key={index} value={zoneName?.id}>
                                  {language == "en"
                                    ? zoneName?.zoneName
                                    : zoneName?.zoneNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="zoneName"
                        control={control}
                        defaultValue={null}
                      />
                      <FormHelperText>
                        {errors?.zoneName ? errors?.zoneName?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors?.wardName}
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="wardName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={
                              watch("zoneName") != null &&
                              watch("zoneName") != undefined &&
                              watch("zoneName") != ""
                                ? false
                                : true
                            }
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label=<FormattedLabel id="wardName" />
                          >
                            {wardNames &&
                              wardNames?.map((wardName, index) => (
                                <MenuItem key={index} value={wardName?.id}>
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
                        {errors?.wardName ? errors?.wardName?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      error={!!errors?.item}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="item" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="item" />}
                          >
                            {items &&
                              items.map((item, index) => (
                                <MenuItem key={index} value={item?.id}>
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
                        {errors?.item ? errors?.item?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      disabled={watch("disabledFieldInputState")}
                      variant="standard"
                      sx={{ marginTop: 2 }}
                      error={!!errors?.hawkerType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="hawkerType1" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={watch("disabledFieldInputState")}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="hawkerType" />}
                          >
                            {hawkerTypes &&
                              hawkerTypes.map((hawkerType, index) => (
                                <MenuItem key={index} value={hawkerType?.id}>
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
                        {errors?.hawkerType
                          ? errors?.hawkerType?.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      style={{ marginTop: 0 }}
                      error={!!errors?.fromDate}
                    >
                      <Controller
                        name="fromDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="fromDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              maxDate={new Date()}
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
                        {errors?.fromDate ? errors?.fromDate?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    xl={3}
                    className={styles.GridItem}
                  >
                    <FormControl
                      style={{ marginTop: 0 }}
                      error={!!errors?.toDate}
                    >
                      <Controller
                        control={control}
                        name="toDate"
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disabled={
                                watch("fromDate") != null ? false : true
                              }
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="toDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) =>
                                field.onChange(
                                  moment(date).format("YYYY-MM-DD")
                                )
                              }
                              minDate={watch("fromDate")}
                              maxDate={new Date()}
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
                        {errors?.toDate ? errors?.toDate?.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Stack
                  className={styles.Stack}
                  direction={{
                    xs: "column",
                    sm: "row",
                    md: "row",
                    lg: "row",
                    xl: "row",
                  }}
                  spacing={{ xs: 2, sm: 2, md: 5, lg: 5, xl: 5 }}
                  justifyContent="center"
                  alignItems="center"
                  marginTop="5"
                >
                  <Button
                    type="submit"
                    size="small"
                    variant="contained"
                    style={{
                      backgroundColor: "#008CBA",
                      color: "white",
                    }}
                    startIcon={<SearchOutlined />}
                  >
                    <FormattedLabel id="search" />
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    endIcon={<ClearIcon />}
                    onClick={() => clearButton()}
                  >
                    <FormattedLabel id="clear" />
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Stack>
                <div className={styles.printButton}>
                  <Button
                    size="small"
                    onClick={handlePrint}
                    variant="contained"
                    startIcon={<PrintIcon />}
                    type="button"
                  >
                    <FormattedLabel id="print" />
                  </Button>
                </div>
              </div>
            </ThemeProvider>
          </form>
        </FormProvider>

        <NewReportLayout
          showDates
          date={{
            from: moment(watch("fromDate")).format("DD-MM-YYYY"),
            to: moment(watch("toDate")).format("DD-MM-YYYY"),
          }}
          componentRef={componentRef}
          deptName={{
            en: "Streetvendor Management System",
            mr: "पथविक्रेता व्यवस्थापन प्रणाली",
          }}
          reportName={{
            en: "General Report",
            mr: "सामान्य अहवाल",
          }}
        >
          <ComponentToPrint reportData={reportData} language={language} />
        </NewReportLayout>
      </Paper>
    </>
  );
};

// Class Component  ---- Report Content
class ComponentToPrint extends React.Component {
  render() {
    console.log("propsreportData", this?.props?.reportData);

    return (
      <div className={styles.Div1}>
        <table className={`${styles.table} ${styles.tableBorder}`}>
          <thead>
            {/* <tr className={styles.bg}>
              <th
                colSpan={110}
                className={`${styles.reportHeader} ${styles.tableBorder} ${styles.reportTitle}`}>
                {this?.props?.language == "en"
                  ? "General Report"
                  : "सामान्य अहवाल"}
              </th>
            </tr> */}

            <tr className={styles.bg1}>
              <th
                colSpan={7}
                className={`${styles.reportHeader} ${styles.tableBorder}    ${styles.srWidth}`}
              >
                {this?.props?.language == "en" ? "Sr.No" : "क्र."}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
              >
                {this?.props?.language == "en" ? "Ward Name" : "प्रभागाचे नाव"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
              >
                {this?.props?.language == "en" ? "Zone Name" : "झोनचे नाव"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
              >
                {this?.props?.language == "en"
                  ? "Hawker Mode"
                  : "पथविक्रेता मोड"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
              >
                {this?.props?.language == "en"
                  ? "Hawker Type"
                  : "पथविक्रेता प्रकार"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
              >
                {this?.props?.language == "en" ? "Item" : "वस्तु"}
              </th>
              <th
                colSpan={13}
                className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht2}`}
              >
                {this?.props?.language == "en"
                  ? "Application Number"
                  : "अर्ज क्रमांक"}
              </th>
              <th
                colSpan={13}
                className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht2}`}
              >
                {this?.props?.language == "en"
                  ? "Applicant Name"
                  : "अर्जदाराचे नाव"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
              >
                {this?.props?.language == "en"
                  ? "Aadhaar Number "
                  : "आधार क्रमांक"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
              >
                {this?.props?.language == "en"
                  ? "Mobile Number"
                  : "मोबाईल नंबर"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht2}`}
              >
                {this?.props?.language == "en" ? "Address" : "पत्ता"}
              </th>
              <th
                colSpan={7}
                className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.srWidth}`}
              >
                {this?.props?.language == "en" ? "Is Approved" : "मंजूर आहे"}
              </th>
            </tr>
          </thead>
          <tbody>
            {this?.props?.reportData &&
              this?.props?.reportData?.map((data) => (
                <>
                  <tr className={styles.tdAlign}>
                    <td
                      colSpan={7}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.srWidth}`}
                    >
                      {data?.srNo}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
                    >
                      {data?.wardName}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
                    >
                      {data?.zoneKey}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
                    >
                      {this?.props?.language == "en"
                        ? data?.hawkerMode
                        : data?.hawkerModeMr}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}   ${styles.otherWidht}`}
                    >
                      {this?.props?.language == "en"
                        ? data?.hawkerType
                        : data?.hawkerTypeMr}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
                    >
                      {this?.props?.language == "en"
                        ? data?.item
                        : data?.itemMr}
                    </td>
                    <td
                      colSpan={13}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht1}`}
                    >
                      {data?.applicationNumber}
                    </td>
                    <td
                      colSpan={13}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht1}`}
                    >
                      {data?.applicantName}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
                    >
                      {data?.aadhaarNo}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
                    >
                      {data?.mobile}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.otherWidht}`}
                    >
                      {this?.props?.language == "en"
                        ? data?.crCitySurveyNumber +
                          " " +
                          data?.areaName +
                          " " +
                          data?.crLandmarkName +
                          " " +
                          data?.crVillageName +
                          " " +
                          data?.crCityName +
                          " " +
                          data?.crState +
                          " " +
                          data?.crPincode
                        : data?.crCitySurveyNumber +
                          " " +
                          data?.areaMr +
                          " " +
                          data?.landmarkMr +
                          " " +
                          data?.villageMr +
                          " " +
                          data?.crCityNameMr +
                          " " +
                          data?.crStateMr +
                          " " +
                          data?.crPincode}
                    </td>
                    <td
                      colSpan={7}
                      className={`${styles.reportHeader} ${styles.tableBorder}  ${styles.srWidth}`}
                    >
                      {data?.isApproved}
                    </td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default Index;
