import { yupResolver } from "@hookform/resolvers/yup";
import { SearchOutlined } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import HawkingSummaryReportSchema from "../../../../components/streetVendorManagementSystem/schema/HawkingSummaryReportSchema";
import styles from "../../../../components/streetVendorManagementSystem/styles/hawkingSummaryReport.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import NewReportLayout from "../../../../components/streetVendorManagementSystem/components/NewReportLayout";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// HawkingDurationReport
const Index = () => {
  let language = useSelector((state) => state.labels.language);
  const methods = useForm({
    resolver: yupResolver(HawkingSummaryReportSchema),
  });
  const {
    control,
    watch,
    setValue,
    getValues,
    clearErrors,
    register,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [reportData, setReportData] = useState([]);
  const [reportDataFinal, setReportDataFinal] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
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

  const handleNext = (data) => {
    console.log("data", data);

    axios
      .post(`${urls.HMSURL}/report/getHawkingSummary`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data?.hawkingSummaryReport != null &&
            res?.data?.hawkingSummaryReport != undefined &&
            res?.data?.hawkingSummaryReport != ""
          ) {
            setReportData(res?.data?.hawkingSummaryReport);
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
            setReportData([]);
            sweetAlert({
              title: language == "en" ? "Empty!" : "रिकामे",
              text:
                language == "en" ? "Record Not Found!" : "रेकॉर्ड सापडला नाही!",
              icon: "error",
              buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
            });
          }
        } else {
          setReportData([]);
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
        setReportData([]);
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
      .catch((errors) => {
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

  // clearButton
  const clearButton = () => {
    setValue("wardName", null);
    setValue("zoneName", null);
    clearErrors(["wardName", "zoneName"]);
    setReportData([]);
  };

  // exitButton
  const exitButton = () => {
    router.push(`/streetVendorManagementSystem/dashboards`);
  };

  const reportDataTotalFind = () => {
    let stable = 0;
    let moveble = 0;
    let temporary = 0;
    let total = 0;

    reportData.forEach((data) => {
      stable += data?.stable;
      moveble += data?.moveble;
      temporary += data?.temporary;
      total += data?.total;
    });

    let reportTotoal = {
      hawkerMode: language == "en" ? "Total" : "एकूण",
      stable,
      moveble,
      temporary,
      total,
    };

    setReportDataFinal(reportTotoal);
  };

  // ==================================> useEffect ========>

  useEffect(() => {
    getZoneName();
    // getWardName();
  }, []);

  useEffect(() => {
    console.log("reportData", reportData);
    reportDataTotalFind();
  }, [reportData]);

  useEffect(() => {
    console.log("reportDataFinal", reportDataFinal);
  }, [reportDataFinal]);
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
                      {<FormattedLabel id="hawkingSummaryReport" />}
                    </center>
                  </strong>
                </div>
                <Grid container className={styles.GridMain}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    xl={6}
                    className={styles.GridItem}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors?.zoneName}
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel
                        shrink={
                          watch("zoneName") !== null &&
                          watch("zoneName") !== undefined &&
                          watch("zoneName") !== ""
                            ? true
                            : false
                        }
                        id="demo-simple-select-standard-label"
                      >
                        {<FormattedLabel id="zoneName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={watch("disabledFieldInputState")}
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
                    md={6}
                    xl={6}
                    className={styles.GridItem}
                  >
                    <FormControl
                      variant="standard"
                      error={!!errors?.wardName}
                      sx={{ marginTop: 2 }}
                    >
                      <InputLabel
                        shrink={
                          watch("wardName") !== null &&
                          watch("wardName") !== undefined &&
                          watch("wardName") !== ""
                            ? true
                            : false
                        }
                        id="demo-simple-select-standard-label"
                      >
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
                        defaultValue={null}
                      />
                      <FormHelperText>
                        {errors?.wardName ? errors?.wardName?.message : null}
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
          componentRef={componentRef}
          deptName={{
            en: "Streetvendor Management System",
            mr: "पथविक्रेता व्यवस्थापन प्रणाली",
          }}
          reportName={{
            en: "Hawking Summary Report",
            mr: "फेरीवाला सारांश अहवाल",
          }}
        >
          <ComponentToPrint
            reportData={reportData}
            reportDataFinal={reportDataFinal}
            language={language}
          />
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
                colSpan={60}
                className={`${styles.reportHeader} ${styles.tableBorder} ${styles.reportTitle}`}>
                {this?.props?.language == "en"
                  ? "Hawking Summary Report"
                  : "फेरीवाला सारांश अहवाल"}{" "}
              </th>
            </tr> */}

            <tr className={styles.bg1}>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              ></th>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en" ? "Stable" : "स्थिर"}
              </th>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en" ? "Movable" : "फिरता"}
              </th>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en" ? "Other" : "इतर"}
              </th>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en" ? "Total" : "एकूण"}
              </th>
            </tr>
          </thead>
          <tbody>
            {this?.props?.reportData &&
              this?.props?.reportData?.map((data) => (
                <>
                  <tr className={styles.tdAlign}>
                    <th
                      colSpan={12}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.hawkerMode}
                    </th>
                    <td
                      colSpan={12}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.stable}
                    </td>
                    <td
                      colSpan={12}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.moveble}
                    </td>
                    <td
                      colSpan={12}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.temporary}
                    </td>
                    <td
                      colSpan={12}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.total}
                    </td>
                  </tr>
                </>
              ))}
            <tr className={styles.tdAlign}>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.hawkerMode}
              </th>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.stable}
              </th>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.moveble}
              </th>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.temporary}
              </th>
              <th
                colSpan={12}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.total}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default Index;
