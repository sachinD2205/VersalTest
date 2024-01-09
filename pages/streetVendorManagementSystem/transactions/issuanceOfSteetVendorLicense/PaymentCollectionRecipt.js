/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, Paper, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";

import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";
// PaymentCollectionRecipt
const PaymentCollectionRecipt = () => {
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
  const language = useSelector((state) => state?.labels?.language);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
    useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
  const [paymentCollectionReciptData, setPaymentCollectionReciptData] =
    useState();
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
  const userToken = useGetToken();
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
      .catch((errors) => { });
  };

  // getWards
  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
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
            r?.data?.pinCode?.map((row) => ({
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
            const testData = r?.data;
            const finalDataOP = {
              ...testData,
              loadderState: false,
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
  // ! =======================> useEffect <==============

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
    const finalDataWithAddress = {
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

      // State Name
      stateNameMar: "महाराष्ट्र",
      stateNameEng: "Maharashtra",
    };
    setPaymentCollectionReciptData(finalDataWithAddress);
    setValue("loadderState", false);
  }, [finalData, zoneNames, wards, areaNames, landmarkNames, roadNames]);

  useEffect(() => {
  }, [paymentCollectionReciptData]);
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
            <div>
              <br />
              <br />
              <center>
                <h1>पैसे भरल्याची पावती / Payment Receipt</h1>
              </center>
            </div>

            <ComponentToPrint
              ref={componentRef}
              paymentCollectionReciptData={paymentCollectionReciptData}
              language={language}
            />
          </Paper>
        </div>
      )}
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    const language = this?.props?.language;
    return (
      <div>
        <Paper
          elevation={0}

          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "650px",
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
                  <b>पथविक्रेता व्यवस्थापन प्रणाली</b>
                </h3>
                <h3>
                  <b>पैसे भरल्याची पावती </b>
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
            <div>
              <Grid
                container
                style={{
                  marginLeft: "5vw",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>पावती क्रमांक : </b>&nbsp;
                  {
                    this?.props?.paymentCollectionReciptData?.paymentCollection
                      ?.receiptNo
                  }
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>सेवा शुल्क पत्र:</b>
                  {this?.props?.paymentCollectionReciptData?.loi?.loiNo}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्ज क्र : </b>&nbsp;
                  {this?.props?.paymentCollectionReciptData?.applicationNumber}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>दिनांक : </b>&nbsp;
                  {this?.props?.paymentCollectionReciptData?.paymentCollection
                    ?.receiptDate != null &&
                    this?.props?.paymentCollectionReciptData?.paymentCollection
                      ?.receiptDate != undefined &&
                    this?.props?.paymentCollectionReciptData?.paymentCollection
                      ?.receiptDate != ""
                    ? moment(
                      this?.props?.paymentCollectionReciptData
                        ?.paymentCollection?.receiptDate
                    ).format("DD-MM-YYYY")
                    : "-"}
                </Grid>
                {/** Third Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>वेळ : </b>&nbsp; &nbsp;
                  {this?.props?.paymentCollectionReciptData?.paymentCollection
                    ?.receiptTime != null &&
                    this?.props?.paymentCollectionReciptData?.paymentCollection
                      ?.receiptTime != undefined &&
                    this?.props?.paymentCollectionReciptData?.paymentCollection
                      ?.receiptTime != " "
                    ? moment(
                      this?.props?.paymentCollectionReciptData
                        ?.paymentCollection?.receiptTime,
                      "hh:mm:ss"
                    ).format("hh:mm:ss A")
                    : "-"}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय : </b>&nbsp;
                  {this?.props?.paymentCollectionReciptData?.serviceNameMr}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विभाग : </b>&nbsp;भूमी आणि जिंदगी
                </Grid>
                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्जादाराचे नाव : </b>&nbsp;
                  {this?.props?.paymentCollectionReciptData?.firstNameMr +
                    " " +
                    this?.props?.paymentCollectionReciptData?.middleNameMr +
                    " " +
                    this?.props?.paymentCollectionReciptData?.lastNameMr}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>ई - मेल आयडी : </b>&nbsp;
                  {this?.props?.paymentCollectionReciptData?.emailAddress}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>मोबाईल नंबर : </b>&nbsp;
                  {this?.props?.paymentCollectionReciptData?.mobile}
                </Grid>

                {/** Fifth Row */}
                <Grid item sx={4} sm={4} md={4} lg={4} xl={4}>
                  <b>पथविक्रेत्याचा व्यवसायाचा पत्ता :</b>&nbsp;
                  {this?.props?.paymentCollectionReciptData?.citySurveyNoMar +
                    ", " +
                    this?.props?.paymentCollectionReciptData?.landmarkNameMar +
                    "," +
                    this?.props?.paymentCollectionReciptData?.roadNameMar +
                    ", " +
                    this?.props?.paymentCollectionReciptData?.areaNameMar +
                    ", " +
                    this?.props?.paymentCollectionReciptData?.wardNameMar +
                    ", " +
                    this?.props?.paymentCollectionReciptData?.zoneNameMar +
                    ", " +
                    this?.props?.paymentCollectionReciptData?.cityNameMar +
                    ", " +
                    this?.props?.paymentCollectionReciptData?.stateNameMar +
                    " ."}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}></Grid>
              </Grid>
              {/** New Row */}
              <br />
              <div
                style={{
                  margin: "10px",
                  marginLeft: "40px",
                  padding: "10px",
                }}
              >
                <h3>
                  <b>
                    देय रक्कम :&nbsp;&nbsp;
                    {this?.props?.paymentCollectionReciptData?.loi?.totalAmount}
                    (
                    {
                      this?.props?.paymentCollectionReciptData?.loi
                        ?.totalInWords
                    }
                    )
                  </b>
                </h3>

                <h3>
                  <b>
                    पेमेंट मोड :&nbsp;&nbsp;
                    {
                      this?.props?.paymentCollectionReciptData
                        ?.paymentCollection?.paymentType
                    }

                  </b>
                </h3>

                <br />
              </div>
            </div>
          </div>

          {/**
          <table className={styles.report} style={{ marginLeft: "50px" }}>
            <tr style={{ marginLeft: "25px" }}>
              <td>
                <h5 style={{ padding: "10px", marginLeft: "20px" }}>
                  अर्जासोबत खालील कागदपत्रे स्वीकारण्यात आली.
                  <br />
                  <br />
                  <br /> <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </h5>
              </td>
            </tr>
          </table>
           */}
        </Paper>
      </div>
    );
  }
}

export default PaymentCollectionRecipt;
