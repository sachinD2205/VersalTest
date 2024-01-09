/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../URLS/urls";
import IdentityCardCSS from "../../../components/streetVendorManagementSystem/styles/IndentityCard.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import { EncryptData, DecryptData } from "../../../components/common/EncryptDecrypt"

// Identity
const Index = () => {
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
  const language = useSelector((state) => state?.labels.language);
  const componentRef = useRef();
  const router = useRouter();
  const [iCardData, setICardData] = useState();
  const [loadderState, setLoadderState] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
    useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
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
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [photo, setPhoto] = useState();
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    console.log("catchMethodStatus", catchMethodStatus);
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  // getICardData
  const getICardData = () => {
    setValue("loadderState", true);
    let url = ``;
    // issuance
    if (
      issuanceOfHawkerLicenseId != null &&
      issuanceOfHawkerLicenseId != undefined &&
      issuanceOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseIdCard/getById?issuanceOfliscenseId=${issuanceOfHawkerLicenseId}`;
    }
    // renewal
    else if (
      renewalOfHawkerLicenseId != null &&
      renewalOfHawkerLicenseId != undefined &&
      renewalOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseIdCard/getByRenewalId?renewalOfliscenseId=${renewalOfHawkerLicenseId}`;
    }
    // cancellation
    else if (
      cancellationOfHawkerLicenseId != null &&
      cancellationOfHawkerLicenseId != undefined &&
      cancellationOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseIdCard/getById?cancellationOfHawkerLicenseId=${cancellationOfHawkerLicenseId}`;
    }
    // transfer
    else if (
      transferOfHawkerLicenseId != null &&
      transferOfHawkerLicenseId != undefined &&
      transferOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseIdCard/getByTransferId?transferOfliscenseId=${transferOfHawkerLicenseId}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || res?.status == 201) {
          if (typeof r?.data == "object" && r?.data != undefined) {
            const finalDataOP = {
              ...r?.data,
              loadderState: false,
            };
            reset(finalDataOP);
            setFinalData(r?.data);
            console.log("BhavachaData", r?.data);
            if (r?.data?.applicantPhoto != null && r?.data?.applicantPhoto != undefined && r?.data?.applicantPhoto != "") {
              getStreetVendorPhoto(r?.data?.applicantPhoto);
            }
          }
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
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

  const getStreetVendorPhoto = (filePath) => {
    console.log("filePath123", filePath);
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error)
        callCatchMethod(error, language);
      });


  }

  // ! =========================> useEffects <===============

  // idSet
  useEffect(() => {
    setValue("loadderState", true);
    // zone Names
    getZoneName();
    // ward Names
    getWardNames();
    // area Names
    getAreaName();
    // landmark
    getLandmarkNames();
    // roadNames
    getRoadNames();
    // pin codes
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
    // ICardData
    getICardData();
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
      // cityNameMar: finalData?.cityName,
      // cityNameEng: finalData?.cityName,
      // State Name
      stateNameMar: "महाराष्ट्र",
      stateNameEng: "Maharashtra",
      // stateNameMar: finalData?.state,
      // stateNameEng: finalData?.state,
    };
    setICardData(finalDataWithAddress);
    setValue("loadderState", false);
  }, [finalData, zoneNames, wards, areaNames, landmarkNames, roadNames]);

  useEffect(() => { }, [iCardData]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper classsName={IdentityCardCSS.Paper}>
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
                type="primary"
                style={{ float: "right" }}
                onClick={() => handlePrint()}
              >
                {<FormattedLabel id="print" />}
              </Button>
              <Button
                onClick={() => {
                  localStorage.removeItem("issuanceOfHawkerLicenseId");
                  if (localStorage.getItem("loggedInUser") == "citizenUser") {
                    router.push("/dashboard");
                  } else {
                    router.push("/streetVendorManagementSystem/dashboards");
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
              <center>
                <h1>ओळखपत्र</h1>
              </center>
            </div>

            <ComponentToPrint
              ref={componentRef}
              iCardData={iCardData}
              language={language}
              photo={photo}
            />
            <br />
          </Paper>
        </div>
      )}
    </>
  );
};

// ComponentToPrint - ClassComonent
class ComponentToPrint extends React.Component {
  // render
  render() {
    // language
    const language = this?.props?.language;
    // View
    return (
      <div className={IdentityCardCSS.MainDiv}>
        <table className={IdentityCardCSS.Table}>
          <tr
            className={`${IdentityCardCSS.Center} ${IdentityCardCSS.Parisht}`}
          >
            <td colSpan={10}>
              {language == "en" ? "परिशिष्ट-३" : "परिशिष्ट-३"}
            </td>
          </tr>
          <tr
            className={`${IdentityCardCSS.Center} ${IdentityCardCSS.Pathavikaretha}`}
          >
            <td colSpan={10}>
              {language == "en"
                ? "पथविक्रेता (उपजीविका, संरक्षण व पथविक्री विनियमन) अधिनियम, २०१४ नुसार"
                : "पथविक्रेता (उपजीविका, संरक्षण व पथविक्री विनियमन) अधिनियम, २०१४ नुसार"}
            </td>
          </tr>
          <tr
            className={`${IdentityCardCSS.Center} ${IdentityCardCSS.NamunaAndOther}`}
          >
            <td colSpan={10}>{language == "en" ? "नमुना-२" : "नमुना-२"}</td>
          </tr>
          <tr
            className={`${IdentityCardCSS.Center} ${IdentityCardCSS.NamunaAndOther}`}
          >
            <td colSpan={10}>{language == "en" ? "(कलम ७)" : "(कलम ४)"}</td>
          </tr>

          <tr
            className={`${IdentityCardCSS.Center} ${IdentityCardCSS.NamunaAndOther}`}
          >
            <td colSpan={10}>
              {language == "en" ? "ओळखपत्राचा नमुना" : "ओळखपत्राचा नमुना"}
            </td>
          </tr>

          {/** Special Content */}

          <tr className={IdentityCardCSS.TrAlong}>
            <td colSpan={6} rowSpan={10} style={{ width: "100" }}>
              <tr>
                <td>
                  <span>ओळखपत्र क्रमांक :&nbsp; </span>
                  <span> {this?.props?.iCardData?.iCardNo}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>नावं : &nbsp;</span>
                  <span>
                    {this?.props?.iCardData?.firstNameMr +
                      " " +
                      this?.props?.iCardData?.middleNameMr +
                      " " +
                      this?.props?.iCardData?.lastNameMr}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span> जन्मदिनांक :&nbsp;</span>
                  <span>
                    {moment(this?.props?.iCardData?.dateOfBirth).format(
                      "DD-MM-YYYY"
                    )}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>लिंग :&nbsp;</span>
                  <span>{this?.props?.iCardData?.genderNameMr}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>पथविक्रेत्याची वर्गवारी :&nbsp; </span>
                  <span> {this?.props?.iCardData?.hawkerTypeNameMr}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span> व्यवसायाचा प्रकार : &nbsp;</span>
                  <span> {this?.props?.iCardData?.hawkingModeNameMr}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>भ्रमणध्वनी क्रमांक : &nbsp;</span>
                  <span> {this?.props?.iCardData?.mobile}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span> जारी केल्याचा दिनांक : &nbsp;</span>
                  <span>
                    {moment(this?.props?.iCardData?.icardIssuedDate).format(
                      "DD-MM-YYYY"
                    )}
                  </span>
                </td>
              </tr>{" "}
              <tr>
                <td>
                  <span> ओळखपत्र वैधता कालावधी : &nbsp;</span>
                  <span>
                    {this?.props?.iCardData?.iCardValidityDate != null &&
                      this?.props?.iCardData?.iCardValidityDate != undefined &&
                      this?.props?.iCardData?.iCardValidityDate != ""
                      ? moment(
                        this?.props?.iCardData?.iCardValidityDate
                      ).format("DD-MM-YYYY")
                      : ""}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>वैधता (पर्यंत) :&nbsp;</span>
                  <span>
                    {this?.props?.iCardData?.licenseValidityYear != null &&
                      this?.props?.iCardData?.licenseValidityYear != undefined &&
                      this?.props?.iCardData?.licenseValidityYear != ""
                      ? this?.props?.iCardData?.licenseValidityYear + " वर्षे"
                      : ""}
                  </span>
                </td>
              </tr>
              <tr>
                <td>
                  <span>
                    पथविक्रेत्याचा व्यवसायाचा पत्ता : &nbsp; &nbsp;&nbsp;
                  </span>
                  <span>
                    {this?.props?.iCardData?.citySurveyNoMar +
                      ", " +
                      this?.props?.iCardData?.landmarkNameMar +
                      "," +
                      this?.props?.iCardData?.roadNameMar +
                      ", " +
                      this?.props?.iCardData?.areaNameMar +
                      ", " +
                      this?.props?.iCardData?.wardNameMar +
                      ", " +
                      this?.props?.iCardData?.zoneNameMar +
                      ", " +
                      this?.props?.iCardData?.cityNameMar +
                      ", " +
                      this?.props?.iCardData?.stateNameMar +
                      " ."}
                  </span>
                </td>
              </tr>
            </td>
            <td
              // width={"100%"}
              colSpan={4}
              rowSpan={10}
              style={
                {
                  // backgroundColor: "red",
                  // position: "relative",
                  // display: "flex",
                  // flexDirection: "column",
                }
              }
            >
              <div>
                <img
                  className={IdentityCardCSS.ImageOp}
                  src={`data:image/png;base64,${this?.props?.photo}`}
                  alt="Street Vendor Photo"
                // width={200}
                ></img>

                <img
                  src="/barcode.jpg"
                  alt="Maharashtra Logo"
                  height={100}
                  width={100}
                />
              </div>

            </td>
          </tr>

          {/* <tr>
            <td colSpan={10}>स्वाक्षरी :</td>
          </tr> */}

          {/** signature */}
          {/* <tr colSpan={10}>
            <td className={`${IdentityCardCSS.Signature}`}>स्वाक्षरी :</td>
          </tr> */}

          {/* <tr>
            <td className={`${IdentityCardCSS.End}`} colSpan={10}>
              स्वाक्षरी :
            </td>
          </tr> */}
        </table>
      </div>
    );
  }
}

export default Index;
