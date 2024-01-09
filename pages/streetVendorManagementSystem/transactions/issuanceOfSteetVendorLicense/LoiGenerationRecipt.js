/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { Component, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
/** Authore - Sachin Durge */
// LoiGenerationRecipt
const LoiGenerationRecipt = () => {
  // useForm
  const {
    control,
    register,
    getValues,
    reset,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm();
  const userToken = useGetToken();
  const language = useSelector((state) => state?.labels.language);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
    useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
  const [loiGenerationReciptData, setLoiGenerationReciptData] = useState();
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [zoneNames, setZoneNames] = useState([]);
  const [wards, setWards] = useState([]);
  const [areaNames, setAreaName] = useState([]);
  const [roadNames, setRoadNames] = useState([]);
  const [landmarkNames, setLandmarkNames] = useState([]);
  const [pincodes, setPinCodes] = useState([]);
  const [finalData, setFinalData] = useState([]);
  let loggedInUser = localStorage.getItem("loggedInUser");

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
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

  // getZoneName
  const getZoneName = () => {
    const url = `${urls.CFCURL}/master/zone/getAll`;
    axios
      .get(url, {
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

  // getWards
  const getWardNames = () => {
    const url = `${urls.CFCURL}/master/ward/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setWards(
            r?.data?.ward?.map((row) => ({
              id: row?.id,
              wardName: row?.wardName,
              wardNameMr: row?.wardNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getAreaName
  const getAreaName = () => {
    const url = `${urls.CFCURL}/master/area/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setAreaName(
            r?.data?.area?.map((row) => ({
              id: row?.id,
              areaName: row?.areaName,
              areaNameMr: row?.areaNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //villageNames
  const getRoadNames = () => {
    const url = `${urls.CFCURL}/mstRoadName/getAll`;
    // roadname
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setRoadNames(
            r?.data?.roadName?.map((row) => ({
              id: row?.id,
              roadName: row?.roadNameEn,
              roadNameMr: row?.roadNameMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // landmarkNames
  const getLandmarkNames = () => {
    const url = `${urls.CFCURL}/master/locality/getAll`;
    // landMark
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setLandmarkNames(
            r?.data?.locality?.map((row) => ({
              id: row?.id,
              landmarkName: row?.landmarkEng,
              landmarkNameMr: row?.landmarkMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getPinCodes
  const getPinCodes = () => {
    const url = `${urls.CFCURL}/master/pinCode/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          setPinCodes(
            r?.data?.pinCode.map((row) => ({
              id: row?.id,
              pincode: row?.pinCode,
              pincodeMr: row?.pinCodeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // hawker
  const getHawkerLicenseData = () => {
    setValue("loadderState", true);
    let url = ``;
    // issuance
    if (
      issuanceOfHawkerLicenseId != null &&
      issuanceOfHawkerLicenseId != undefined &&
      issuanceOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/IssuanceofHawkerLicense/getById?id=${issuanceOfHawkerLicenseId}`;
    }
    // renewal
    else if (
      renewalOfHawkerLicenseId != null &&
      renewalOfHawkerLicenseId != undefined &&
      renewalOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/transaction/renewalOfHawkerLicense/getById?id=${renewalOfHawkerLicenseId}`;
    }
    // cancellation
    else if (
      cancellationOfHawkerLicenseId != null &&
      cancellationOfHawkerLicenseId != undefined &&
      cancellationOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/cancellationOfHawkerLicense/getById?id=${cancellationOfHawkerLicenseId}`;
    }
    // transfer
    else if (
      transferOfHawkerLicenseId != null &&
      transferOfHawkerLicenseId != undefined &&
      transferOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/transferOfHawkerLicense/getById?id=${transferOfHawkerLicenseId}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201) {
          if (typeof r?.data == "object" && r?.data != undefined) {
            const finalDataOP = {
              ...r?.data,
              loadderState: true,
            };
            reset(finalDataOP);
            setFinalData(finalDataOP);
          }
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // idSet
  useEffect(() => {
    setValue("loadderState", true);
    getZoneName();
    getWardNames();
    getAreaName();
    getLandmarkNames();
    getRoadNames();
    getPinCodes();

    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      setIssuanceOfHawkerLicenseId(
        localStorage.getItem("issuanceOfHawkerLicenseId")
      );
    }

    // renewal
    else if (
      localStorage.getItem("renewalOfHawkerLicenseId") != null &&
      localStorage.getItem("renewalOfHawkerLicenseId") != "" &&
      localStorage.getItem("renewalOfHawkerLicenseId") != undefined
    ) {
      setRenewalOfHawkerLicenseId(
        localStorage.getItem("renewalOfHawkerLicenseId")
      );
    }

    // cancelltion
    else if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      setCancellationOfHawkerLicenseId(
        localStorage.getItem("cancellationOfHawkerLicenseId")
      );
    }

    // transfer
    else if (
      localStorage.getItem("transferOfHawkerLicenseId") != null &&
      localStorage.getItem("transferOfHawkerLicenseId") != "" &&
      localStorage.getItem("transferOfHawkerLicenseId") != undefined
    ) {
      setTransferOfHawkerLicenseId(
        localStorage.getItem("transferOfHawkerLicenseId")
      );
    } else {
      setValue("loadderState", false);
    }
  }, []);

  // api
  useEffect(() => {
    getHawkerLicenseData();
  }, [
    issuanceOfHawkerLicenseId,
    renewalOfHawkerLicenseId,
    cancellationOfHawkerLicenseId,
    transferOfHawkerLicenseId,
  ]);

  // finalData
  useEffect(() => {
    setValue("loadderState", true);
    let finalDataWithAddress = {
      ...finalData,
      // city Survey Number
      citySurveyNoEng: finalData?.citySurveyNo,
      citySurveyNoMar: finalData?.citySurveyNo,
      // zone Name
      zoneNameEng: zoneNames?.find((data) => data?.id == finalData?.zoneKey)
        ?.zoneName,
      zoneNameMar: zoneNames?.find((data) => data?.id == finalData?.zoneKey)
        ?.zoneNameMr,
      // ward Name
      wardNameEng: wards?.find((data) => data?.id == finalData?.wardName)
        ?.wardName,
      wardNameMar: wards?.find((data) => data?.id == finalData?.wardName)
        ?.wardNameMr,

      // area Name
      areaNameEng: areaNames?.find((data) => data?.id == finalData?.areaName)
        ?.areaName,
      areaNameMar: areaNames?.find((data) => data?.id == finalData?.areaName)
        ?.areaNameMr,

      // road Name
      roadNameEng: roadNames?.find((data) => data?.id == finalData?.villageName)
        ?.roadName,
      roadNameMar: roadNames?.find((data) => data?.id == finalData?.villageName)
        ?.roadNameMr,

      // landmark Name
      landmarkNameMar: landmarkNames?.find(
        (data) => data?.id == finalData?.landmarkName
      )?.landmarkNameMr,
      landmarkNameEng: landmarkNames?.find(
        (data) => data?.id == finalData?.landmarkName
      )?.landmarkName,

      // city Name
      cityNameMar: "पिंपरी चिंचवड",
      cityNameEng: "Pimpri Chinchwad",
      // state name
      stateNameMar: "महाराष्ट्र",
      stateNameEng: "Maharashtra",
    };
    setLoiGenerationReciptData(finalDataWithAddress);
    setValue("loadderState", false);
  }, [finalData, zoneNames, wards, areaNames, landmarkNames, roadNames]);

  useEffect(() => { }, [loiGenerationReciptData]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper
            elevation={0}
            style={{
              margin: "50px",
            }}
          >
            <br />
            <br />
            <Stack
              spacing={5}
              direction="row"
              style={{
                display: "flex",
                justifyContent: "left",
                marginLeft: "50px",
              }}
            >
              <Button
                variant="contained"
                type="button"
                color="primary"
                style={{ float: "right" }}
                onClick={() => handlePrint()}
              >
                {<FormattedLabel id="print" />}
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem("issuanceOfHawkerLicenseId");
                  if (loggedInUser == "citizenUser") {
                    setValue("loadderState", false)
                    router.push(`/dashboard`)
                  } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
                    setValue("loadderState", false)
                    router.push(`/CFC_Dashboard`)
                  } else if (loggedInUser == "DEPT_USER") {
                    setValue("loadderState", false)
                    router.push(`/streetVendorManagementSystem/dashboards`)
                  }

                }}
                type="button"
                variant="contained"
                color="primary"
              >
                {<FormattedLabel id="back" />}
              </Button>
            </Stack>
            <br />
            <div>
              <center>
                <h1>सेवा शुल्क पत्र </h1>
              </center>
            </div>

            <ComponentToPrint
              ref={componentRef}
              language={language}
              loiGenerationReciptData={loiGenerationReciptData}
            />
          </Paper>
        </div>
      )}
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends Component {


  render() {
    const language = this?.props?.language;

    // view
    return (
      <div>
        <Paper
          elevation={0}
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "1000px",
          }}
        >
          <div
            style={{
              width: "100%",
              border: "2px solid black",
            }}
          >
            {/** First Row */}
            <div
              style={{
                marginTop: "30px",
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <img
                  src="/logo.png"
                  alt="Maharashtra Logo"
                  height={100}
                  width={100}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <h2>
                  <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                </h2>
                <h3>
                  <b>परवाना प्रणाली</b>
                </h3>
                <h3>
                  <b>सेवाशुल्क पत्र </b>
                </h3>
              </div>
              <div className="col-md-7">
                <img
                  src="/barcode.jpg"
                  alt="Maharashtra Logo"
                  height={100}
                  width={100}
                />
              </div>
            </div>

            {/** Second Row */}
            <div
              style={{ margin: "10px", marginLeft: "15px", padding: "10px" }}
            >
              <div style={{ marginLeft: "40vw" }}>
                <b>सेवा शुल्क पत्र क्र.:</b> &nbsp;
                {this?.props?.loiGenerationReciptData?.loi?.loiNo}
                <br />
              </div>

              <div style={{ marginLeft: "40vw" }}>
                <b>सेवा शुल्क पत्र दिनांक : </b>&nbsp;
                {this?.props?.loiGenerationReciptData?.loi?.loiDate != null &&
                  this?.props?.loiGenerationReciptData?.loi?.loiDate !=
                  undefined &&
                  this?.props?.loiGenerationReciptData?.loi?.loiDate != ""
                  ? moment(
                    this?.props?.loiGenerationReciptData?.loi?.loiDate
                  ).format("DD-MM-YYYY")
                  : "-"}
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>प्रति , </b>
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>अर्जदाराचे नाव :</b>&nbsp;
                {this?.props?.loiGenerationReciptData?.firstNameMr +
                  " " +
                  this?.props?.loiGenerationReciptData?.middleNameMr +
                  " " +
                  this?.props?.loiGenerationReciptData?.lastNameMr}
              </div>

              <div style={{ marginLeft: "3.8vw" }}>
                <b>विषय :</b>&nbsp;&nbsp;पथाविक्रेता परवाना सेवाशुल्क पत्र
              </div>
              <div style={{ marginLeft: "3.8vw" }}>
                <b>पथविक्रेत्याचा व्यवसायाचा पत्ता :</b>&nbsp;&nbsp;
                {this?.props?.loiGenerationReciptData?.citySurveyNoMar +
                  ", " +
                  this?.props?.loiGenerationReciptData?.landmarkNameMar +
                  "," +
                  this?.props?.loiGenerationReciptData?.roadNameMar +
                  ", " +
                  this?.props?.loiGenerationReciptData?.areaNameMar +
                  ", " +
                  this?.props?.loiGenerationReciptData?.wardNameMar +
                  ", " +
                  this?.props?.loiGenerationReciptData?.zoneNameMar +
                  ", " +
                  this?.props?.loiGenerationReciptData?.cityNameMar +
                  ", " +
                  this?.props?.loiGenerationReciptData?.stateNameMar +
                  " ."}
              </div>

              {/** New Row */}
              <br />
              <div
                style={{ margin: "10px", marginLeft: "20px", padding: "10px" }}
              >
                <h4>
                  <b>महोदय ,</b>
                </h4>
                <h4>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;आपला
                  <b>
                    &nbsp;अर्ज क्रमांक. &nbsp;(
                    {this?.props?.loiGenerationReciptData?.applicationNumber})
                  </b>
                  आहे .आर्थिक वर्ष २०२३-२४ मध्ये सेवांसाठी नागरिक सेवा पोर्टेलवर
                  दिलेली
                  <b>
                    &nbsp; रक्कम &nbsp;
                    {this?.props?.loiGenerationReciptData?.loi?.totalAmount} (
                    {this?.props?.loiGenerationReciptData?.loi?.totalInWords})
                  </b>
                  &nbsp; निश्चित करा व online लिंकद्वारे अथवा जवळच्या झोनल
                  ऑफिसला भेट देऊन शुल्क दिलेल्या वेळेत जमा करा .
                </h4>
                <br />
              </div>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default LoiGenerationRecipt;
