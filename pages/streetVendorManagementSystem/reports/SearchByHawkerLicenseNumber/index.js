import { yupResolver } from "@hookform/resolvers/yup";
import { SearchOutlined } from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PrintIcon from "@mui/icons-material/Print";
import {
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import sweetAlert from "sweetalert";
import urls from "../../../../URLS/urls";
import SearchByHawkerLicenseNumberReportSchema from "../../../../components/streetVendorManagementSystem/schema/SearchByHawkerLicenseNumberReportSchema";
import styles1 from "../../../../components/streetVendorManagementSystem/styles/SearchByHawkerLicenseNumber.module.css";
import styles from "../../../../components/streetVendorManagementSystem/styles/issuanceOfStreetVendorLicenseCertificate.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import CertificateCSS from "../../../../components/streetVendorManagementSystem/styles/Certificate.module.css";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// SearchByHawkerLicenseNumber
const Index = () => {
  let language = useSelector((state) => state.labels.language);
  const methods = useForm({
    resolver: yupResolver(SearchByHawkerLicenseNumberReportSchema),
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
  const [certificateData, setCertificateData] = useState([]);
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

  // handleNext
  const handleNext = (data) => {
    console.log("data", data);
    let body = {
      certificateNo: data.applicationNo,
    };
    axios
      .post(`${urls.HMSURL}/report/findCertificate`, body, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          if (res?.data != null && res?.data != undefined && res?.data != "") {
            setCertificateData(res?.data);
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
            setCertificateData([]);
            sweetAlert({
              title: language == "en" ? "Empty!" : "रिकामे",
              text:
                language == "en" ? "Record Not Found!" : "रेकॉर्ड सापडला नाही!",
              icon: "error",
              buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
            });
          }
        }
      })
      .catch((error) => {
        console.log("findLicenseNumber", error);
        setCertificateData([]);
        if (
          error?.response?.status == 404 &&
          error?.response?.data?.message != "" &&
          error?.response?.data?.message != undefined &&
          error?.response?.data?.message != null
        ) {
          sweetAlert({
            title: language == "en" ? "Data Not Found !" : "डेटा सापडला नाही!",
            text:
              language == "en"
                ? "please enter valid license number!"
                : "कृपया वैध परवाना क्रमांक प्रविष्ट करा!",
            icon: "error",
            buttons: { ok: language == "en" ? "OK" : "ठीक आहे" },
          });
        } else {
          callCatchMethod(error, language);
        }
      });
  };

  // clearButton
  const clearButton = () => {
    setValue("applicationNo", null);
    clearErrors(["applicationNo"]);
    setCertificateData([]);
  };

  // exitButton
  const exitButton = () => {
    router.push(`/streetVendorManagementSystem/dashboards`);
  };

  useEffect(() => {
    console.log("certificateData", certificateData);
  }, [certificateData]);

  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  // view -- search
  return (
    <>
      <Paper className={styles1.Paper1} elevation={5}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            <ThemeProvider theme={theme}>
              <div className={styles1.Paper1}>
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
                      {language == "en" ? "Search License" : "शोध परवाना"}
                    </center>
                  </strong>
                </div>
                <Grid container className={styles1.GridMain}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    xl={6}
                    className={styles1.GridItem}
                  >
                    <TextField
                      variant="outlined"
                      style={{ width: "400px" }}
                      id="standard-basic"
                      label={language == "en" ? "Search License" : "शोध परवाना"}
                      {...register("applicationNo")}
                      error={!!errors?.applicationNo}
                      helperText={
                        errors?.applicationNo
                          ? language == "en"
                            ? "license number is required  !!!"
                            : "परवाना क्रमांक आवश्यक आहे  !!!"
                          : null
                      }
                    />
                  </Grid>
                </Grid>
                <Stack
                  className={styles1.Stack}
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
                <div className={styles1.printButton}>
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

        {certificateData != null &&
        certificateData != undefined &&
        certificateData != "" ? (
          <ComponentToPrint
            ref={componentRef}
            certificateData={certificateData}
            language={language}
          />
        ) : (
          ""
        )}
      </Paper>
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends React.Component {
  render() {
    const language = this?.props?.language;
    console.log("propscertificate", this?.props?.certificateData);

    // view;
    return (
      <div className={CertificateCSS.OverFlowTable}>
        {/** table */}
        <table className={CertificateCSS.Table}>
          <tr className={`${CertificateCSS.Center} ${CertificateCSS.Parisht}`}>
            <td>{language == "en" ? "परिशिष्ट-२" : "परिशिष्ट-२"}</td>
          </tr>
          <tr
            className={`${CertificateCSS.Center} ${CertificateCSS.Pathavikaretha}`}
          >
            <td>
              {language == "en"
                ? "पथविक्रेता (उपजीविका, संरक्षण व पथविक्री विनियमन) अधिनियम, २०१४ नुसार"
                : "पथविक्रेता (उपजीविका, संरक्षण व पथविक्री विनियमन) अधिनियम, २०१४ नुसार"}
            </td>
          </tr>
          <tr
            className={`${CertificateCSS.Center} ${CertificateCSS.NamunaAndOther}`}
          >
            <td>{language == "en" ? "नमुना-२" : "नमुना-२"}</td>
          </tr>
          <tr
            className={`${CertificateCSS.Center} ${CertificateCSS.NamunaAndOther}`}
          >
            <td>{language == "en" ? "[कलम ४]" : "[कलम ४]"}</td>
          </tr>
          <tr
            className={`${CertificateCSS.Center} ${CertificateCSS.NamunaAndOther}`}
          >
            <td>
              {language == "en"
                ? "विक्री प्रमाणपत्राचा नमुना"
                : "विक्री प्रमाणपत्राचा नमुना"}
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.ImageTR}>
              <img
                className={CertificateCSS.Image}
                src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.certificateData?.applicantPhoto}`}
                alt="Street Vendor Photo"
                // layout='fill'
                // objectFit='cover'
                // quality={100}
                // width={200}
                // height={200}
              />
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "१.विक्रेत्याचे नांव: "
                  : "१.विक्रेत्याचे नांव: "}
              </span>
              <span className={CertificateCSS.Content}>
                {language == "en"
                  ? this?.props?.certificateData?.firstNameMr +
                    " " +
                    this?.props?.certificateData?.middleNameMr +
                    " " +
                    this?.props?.certificateData?.lastNameMr
                  : this?.props?.certificateData?.firstNameMr +
                    " " +
                    this?.props?.certificateData?.middleNameMr +
                    " " +
                    this?.props?.certificateData?.lastNameMr}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "२. जोडीदाराचे नांव किंवा अवलंबून असलेल्या अपत्याचे नांव (पथविक्रेत्याबरोबर व्यवसाय करीत असल्यास): "
                  : "२. जोडीदाराचे नांव किंवा अवलंबून असलेल्या अपत्याचे नांव (पथविक्रेत्याबरोबर व्यवसाय करीत असल्यास): "}
              </span>
              <span className={CertificateCSS.Content}>
                {/* {language == "en"
                  ? this?.props?.certificateData?.firstNameMr +
                    " " +
                    this?.props?.certificateData?.middleNameMr +
                    " " +
                    this?.props?.certificateData?.lastNameMr
                  : this?.props?.certificateData?.firstNameMr +
                    " " +
                    this?.props?.certificateData?.middleNameMr +
                    " " +
                    this?.props?.certificateData?.lastNameMr} */}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en" ? "३. जन्मदिनांक: " : "३. जन्मदिनांक: "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.dateOfBirth != null &&
                this?.props?.certificateData?.dateOfBirth != undefined &&
                this?.props?.certificateData?.dateOfBirth != ""
                  ? moment(this?.props?.certificateData?.dateOfBirth).format(
                      "DD-MM-YYYY"
                    )
                  : ""}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en" ? "४. लिंग: " : "४. लिंग: "}
              </span>
              <span className={CertificateCSS.Content}>
                {language == "en"
                  ? this?.props?.certificateData?.genderNameMr
                  : this?.props?.certificateData?.genderNameMr}
              </span>
            </td>
          </tr>
          {/** 
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "५. पथविक्रेत्याचा निवासी पत्ता : "
                  : "५. पथविक्रेत्याचा निवासी पत्ता : "}
              </span>
              <span className={CertificateCSS.Content}>
                {language == "en"
                  ? this?.props?.certificateData?.citySurveyNoCrMar +
                    ", " +
                    this?.props?.certificateData?.landmarkNameCrMar +
                    "," +
                    this?.props?.certificateData?.roadNameCrMar +
                    ", " +
                    this?.props?.certificateData?.areaNameCrMar +
                    ", " +
                    this?.props?.certificateData?.wardNameCrMar +
                    ", " +
                    this?.props?.certificateData?.zoneNameCrMar +
                    ", " +
                    this?.props?.certificateData?.cityNameCrMar +
                    ", " +
                    this?.props?.certificateData?.stateNameCrMar +
                    " ."
                  : this?.props?.certificateData?.citySurveyNoCrMar +
                    ", " +
                    this?.props?.certificateData?.landmarkNameCrMar +
                    "," +
                    this?.props?.certificateData?.roadNameCrMar +
                    ", " +
                    this?.props?.certificateData?.areaNameCrMar +
                    ", " +
                    this?.props?.certificateData?.wardNameCrMar +
                    ", " +
                    this?.props?.certificateData?.zoneNameCrMar +
                    ", " +
                    this?.props?.certificateData?.cityNameCrMar +
                    ", " +
                    this?.props?.certificateData?.stateNameCrMar +
                    " ."}
              </span>
            </td>
          </tr>
          */}
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "५. पथविक्रेत्याची वर्गवारी : "
                  : "५. पथविक्रेत्याची वर्गवारी : "}
              </span>
              <span className={CertificateCSS.Content}>
                {language == "en"
                  ? this?.props?.certificateData?.hawkerTypeNameMr
                  : this?.props?.certificateData?.hawkerTypeNameMr}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "६. फिरत्या विक्रेत्याच्या बाबतीत विक्री ठिकाण/ क्षेत्राचा तपशील : "
                  : "६. फिरत्या विक्रेत्याच्या बाबतीत विक्री ठिकाण/ क्षेत्राचा तपशील : "}
              </span>
              <span className={CertificateCSS.Content}>
                {language == "en"
                  ? this?.props?.certificateData?.citySurveyNoMar +
                    ", " +
                    this?.props?.certificateData?.landmarkNameMar +
                    "," +
                    this?.props?.certificateData?.roadNameMar +
                    ", " +
                    this?.props?.certificateData?.areaNameMar +
                    ", " +
                    this?.props?.certificateData?.wardNameMar +
                    ", " +
                    this?.props?.certificateData?.zoneNameMar +
                    ", " +
                    this?.props?.certificateData?.cityNameMar +
                    ", " +
                    this?.props?.certificateData?.stateNameMar +
                    " ."
                  : this?.props?.certificateData?.citySurveyNoMar +
                    ", " +
                    this?.props?.certificateData?.landmarkNameMar +
                    "," +
                    this?.props?.certificateData?.roadNameMar +
                    ", " +
                    this?.props?.certificateData?.areaNameMar +
                    ", " +
                    this?.props?.certificateData?.wardNameMar +
                    ", " +
                    this?.props?.certificateData?.zoneNameMar +
                    ", " +
                    this?.props?.certificateData?.cityNameMar +
                    ", " +
                    this?.props?.certificateData?.stateNameMar +
                    " ."}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "७. जारी केल्याचा दिनांक : "
                  : "७. जारी केल्याचा दिनांक : "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.certificateIssuedDate != null &&
                this?.props?.certificateData?.certificateIssuedDate !=
                  undefined &&
                this?.props?.certificateData?.certificateIssuedDate != ""
                  ? moment(
                      this?.props?.certificateData?.certificateIssuedDate
                    ).format("DD-MM-YYYY")
                  : ""}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "८. प्रमाणपत्राचा वैधता दिनांक : "
                  : "८. प्रमाणपत्राचा वैधता दिनांक : "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.certificateExpireDate != null &&
                this?.props?.certificateData?.certificateExpireDate !=
                  undefined &&
                this?.props?.certificateData?.certificateExpireDate != ""
                  ? moment(
                      this?.props?.certificateData?.certificateExpireDate
                    ).format("DD-MM-YYYY")
                  : ""}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "९. प्रमाणपत्राचा वैधता कालावधी : "
                  : "९. प्रमाणपत्राचा वैधता कालावधी : "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.licenseValidity != null &&
                this?.props?.certificateData?.licenseValidity != undefined &&
                this?.props?.certificateData?.licenseValidity != ""
                  ? this?.props?.certificateData?.licenseValidity + "   वर्षे"
                  : ""}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "१०. युनिक नोंदणी क्रमांक : "
                  : "१०. युनिक नोंदणी क्रमांक : "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.certificateNo != null &&
                this?.props?.certificateData?.certificateNo != undefined &&
                this?.props?.certificateData?.certificateNo != ""
                  ? this?.props?.certificateData?.certificateNo
                  : ""}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {language == "en"
                  ? "११. विक्रीचे दिवस व वेळ :   "
                  : "११. विक्रीचे दिवस व वेळ :   "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.hawkingDurationDailyDateTime}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.StanikPradhikaranTD}>
              <span className={CertificateCSS.StanikPradhikaran}>
                {language == "en"
                  ? "स्थानिक प्राधिकरणाचा शिक्का / मोहोर"
                  : "स्थानिक प्राधिकरणाचा शिक्का / मोहोर"}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.DateSignatureTD}>
              <span className={CertificateCSS.Date}>
                {language == "en" ? "दिनांक : " : "दिनांक : "}
              </span>
              <span className={CertificateCSS.Signature}>
                {language == "en"
                  ? "प्रमाणपत्र देणाऱ्या प्राधिकाऱ्याची स्वाक्षरी : "
                  : "प्रमाणपत्र देणाऱ्या प्राधिकाऱ्याची स्वाक्षरी : "}
              </span>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Index;
