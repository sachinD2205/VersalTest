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
import NewReportLayout from "../../../../components/streetVendorManagementSystem/components/NewReportLayout";
import HawkerSummaryCountSchema from "../../../../components/streetVendorManagementSystem/schema/HawkerSummaryCountSchema";
import styles from "../../../../components/streetVendorManagementSystem/styles/hawkingSummaryReport.module.css";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// HawkingDurationReport
const Index = () => {
  let language = useSelector((state) => state.labels.language);
  const methods = useForm({
    resolver: yupResolver(HawkerSummaryCountSchema),
  });
  const {
    control,
    watch,
    register,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
  } = methods;
  const router = useRouter();
  const [reportData, setReportData] = useState([]);
  const [reportDataFinal, setReportDataFinal] = useState([]);
  const [zoneNames, setZoneNames] = useState([]);
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
      .post(`${urls.HMSURL}/report/getHawkingSummaryCount`, data, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (
            res?.data?.hawkingSummaryCount != null &&
            res?.data?.hawkingSummaryCount != undefined &&
            res?.data?.hawkingSummaryCount != ""
          ) {
            setReportData(
              res?.data?.hawkingSummaryCount?.map((data, index) => {
                return { ...data, srNo: index + 1 };
              })
            );
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
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // clearButton
  const clearButton = () => {
    setValue("zoneName", "");
    clearErrors(["zoneName"]);
    setReportData([]);
  };

  // exitButton
  const exitButton = () => {
    router.push(`/streetVendorManagementSystem/dashboards`);
  };

  const reportDataTotalFind = () => {
    let blindCount = 0;
    let femaleCount = 0;
    let handicappedCount = 0;
    let maleCount = 0;
    let totalSum = 0;
    let transgenderCount = 0;

    reportData.forEach((data) => {
      console.log("data", data);
      blindCount += data?.blindCount;
      femaleCount += data?.femaleCount;
      handicappedCount += data?.handicappedCount;
      maleCount += data?.maleCount;
      totalSum += data?.totalSum;
      transgenderCount += data?.transgenderCount;
    });

    // setReportData([]);
    let reportTotoal = {
      wardname: language == "en" ? "Total" : "एकूण",
      blindCount,
      femaleCount,
      handicappedCount,
      maleCount,
      totalSum,
      transgenderCount,
    };

    setReportDataFinal(reportTotoal);

    console.log("reportTotoal12", reportTotoal);
  };

  useEffect(() => {
    getZoneName();
  }, []);

  useEffect(() => {
    console.log("reportData", reportData);
    reportDataTotalFind();
  }, [reportData]);

  useEffect(() => {
    console.log("reportDataFinal", reportDataFinal);
  }, [reportDataFinal]);

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
                      {language == "en"
                        ? "Street Vendor Summary Count"
                        : "फेरीवाला सारांश संख्या"}
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
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="zoneName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            disabled={watch("disabledFieldInputState")}
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
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
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zoneName ? errors?.zoneName?.message : null}
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
                    variant="contained"
                    color="error"
                    size="small"
                    endIcon={<ExitToAppIcon />}
                    onClick={() => exitButton()}
                  >
                    <FormattedLabel id="exit" />
                  </Button>
                </Stack>
                <div className={styles.printButton}>
                  <Button
                    onClick={handlePrint}
                    variant="contained"
                    size="small"
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
            en: "Street Vendor Summary Count",
            mr: "फेरीवाला सारांश संख्या",
          }}
        >
          <ComponentToPrint
            // ref={componentRef}
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
                  ? "Hawker Summary Count"
                  : "फेरीवाला सारांश संख्या"}
              </th>
            </tr> */}

            <tr className={styles.bg1}>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en" ? "Sr.No" : "क्र."}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en"
                  ? "Election Zone Number"
                  : "निवडणूक झोन क्रमांक"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en" ? "Total Number" : "एकूण संख्या"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en"
                  ? "Male  Numbers"
                  : "पुरुष संख्या"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en"
                  ? "Female Numbers"
                  : "महिला संख्या"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en" ? "Blind" : "आंधळा"}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.language == "en" ? "Handicap" : "अपंग"}
              </th>
            </tr>
          </thead>
          <tbody>
            {this?.props?.reportData &&
              this?.props?.reportData?.map((data) => (
                <>
                  <tr className={styles.tdAlign}>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.srNo}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.wardname}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.totalSum}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.maleCount}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.femaleCount}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.blindCount}
                    </td>
                    <td
                      colSpan={10}
                      className={`${styles.reportHeader} ${styles.tableBorder}`}
                    >
                      {data?.handicappedCount}
                    </td>
                  </tr>
                </>
              ))}
            <tr className={styles.tdAlign}>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {/* {this?.props?.reportDataFinal?.wardname} */}-
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.wardname}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.totalSum}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.maleCount}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.femaleCount}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.blindCount}
              </th>
              <th
                colSpan={10}
                className={`${styles.reportHeader} ${styles.tableBorder}`}
              >
                {this?.props?.reportDataFinal?.handicappedCount}
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default Index;
