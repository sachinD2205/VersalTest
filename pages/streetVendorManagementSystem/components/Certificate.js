/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import PrintIcon from "@mui/icons-material/Print";
import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../URLS/urls";
import CertificateCSS from "../../../components/streetVendorManagementSystem/styles/Certificate.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { EncryptData, DecryptData } from "../../../components/common/EncryptDecrypt"

/** Author - Sachin Durge */
// IssuanceOfStreetVendorlicensecertificate
const Index = () => {
  // language
  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();
  // useForm
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });
  // destructure values from methods
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;
  const componentRef = useRef();
  const router = useRouter();
  const [certificateData, setCertificateData] = useState();
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
    useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
  const [zoneNames, setZoneNames] = useState([]);
  const [wards, setWards] = useState([]);
  const [areaNames, setAreaName] = useState([]);
  const [roadNames, setRoadNames] = useState([]);
  const [landmarkNames, setLandmarkNames] = useState([]);
  const [pincodes, setPinCodes] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [photo, setPhoto] = useState();
  const [durationOfLicenseValidity, setDurationOfLicenseValidity] = useState(
    []
  );
  // hawkingDurationDailys
  const [hawkingDurationDailys, setHawkingDurationDaily] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
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

  // HandleToPrintButton
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

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
            r.data.pinCode.map((row) => ({
              id: row.id,
              pincode: row.pinCode,
              pincodeMr: row.pinCodeMr,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // certificateData
  const getHawkerCertificateData = () => {
    setValue("loadderState", true);
    let url = ``;
    // issuance
    if (
      issuanceOfHawkerLicenseId != null &&
      issuanceOfHawkerLicenseId != undefined &&
      issuanceOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseCertificate/getById?issuanceOfliscenseId=${issuanceOfHawkerLicenseId}`;
    }
    // renewal
    else if (
      renewalOfHawkerLicenseId != null &&
      renewalOfHawkerLicenseId != undefined &&
      renewalOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseCertificate/getByRenewalId?renewalOfliscenseId=${renewalOfHawkerLicenseId}`;
    }
    // cancellation
    else if (
      cancellationOfHawkerLicenseId != null &&
      cancellationOfHawkerLicenseId != undefined &&
      cancellationOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseCertificate/getById?issuanceOfliscenseId=${issuanceOfHawkerLicenseId}`;
    }
    // transfer
    else if (
      transferOfHawkerLicenseId != null &&
      transferOfHawkerLicenseId != undefined &&
      transferOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseCertificate/getByTransferId?transferOfliscenseId=${transferOfHawkerLicenseId}`;
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
              loadderState: true,
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

  // getDurationOfLicenseValidity
  // durationOfLicenseValiditys
  const getDurationOfLicenseValiditys = () => {
    const url = `${urls.HMSURL}/licenseValidity/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          setDurationOfLicenseValidity(
            res?.data?.licenseValidity?.map((r) => ({
              id: r?.id,
              licenseValidity: r?.licenseValidity,
              hawkerType: r?.hawkerType,
            }))
          );
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  // getHawkingDurationDaily
  const getHawkingDurationDaily = () => {
    const url = `${urls.HMSURL}/hawkingDurationDaily/getAll`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        setHawkingDurationDaily(
          r?.data?.hawkingDurationDaily?.map((row) => ({
            id: row?.id,
            hawkingDurationDailyTime:
              moment(row?.hawkingDurationDailyFrom, "HH:mm").format("hh:mm A") +
              " To " +
              moment(row.hawkingDurationDailyTo, "HH:mm").format("hh:mm A"),
          }))
        );
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
    getHawkingDurationDaily();
    getDurationOfLicenseValiditys();

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
    getHawkerCertificateData();
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
      zoneNameEng:
        zoneNames?.find((data) => data?.id == finalData?.zoneKey)?.zoneName !=
          undefined
          ? zoneNames?.find((data) => data?.id == finalData?.zoneKey)?.zoneName
          : "",
      zoneNameMar:
        zoneNames?.find((data) => data?.id == finalData?.zoneKey)?.zoneNameMr !=
          undefined
          ? zoneNames?.find((data) => data?.id == finalData?.zoneKey)
            ?.zoneNameMr
          : "",
      // ward Name
      wardNameEng:
        wards?.find((data) => data?.id == finalData?.wardName)?.wardName !=
          undefined
          ? wards?.find((data) => data?.id == finalData?.wardName)?.wardName
          : "",
      wardNameMar:
        wards?.find((data) => data?.id == finalData?.wardName)?.wardNameMr !=
          undefined
          ? wards?.find((data) => data?.id == finalData?.wardName)?.wardNameMr
          : "",

      // area Name
      areaNameEng:
        areaNames?.find((data) => data?.id == finalData?.areaName)?.areaName !=
          undefined
          ? areaNames?.find((data) => data?.id == finalData?.areaName)?.areaName
          : "",
      areaNameMar:
        areaNames?.find((data) => data?.id == finalData?.areaName)
          ?.areaNameMr != undefined
          ? areaNames?.find((data) => data?.id == finalData?.areaName)
            ?.areaNameMr
          : "",

      // road Name
      roadNameEng:
        roadNames?.find((data) => data?.id == finalData?.villageName)
          ?.roadName != undefined
          ? roadNames?.find((data) => data?.id == finalData?.villageName)
            ?.roadName
          : "",
      roadNameMar:
        roadNames?.find((data) => data?.id == finalData?.villageName)
          ?.roadNameMr != undefined
          ? roadNames?.find((data) => data?.id == finalData?.villageName)
            ?.roadNameMr
          : "",

      // landmark Name
      landmarkNameMar:
        landmarkNames?.find((data) => data?.id == finalData?.landmarkName)
          ?.landmarkNameMr != undefined
          ? landmarkNames?.find((data) => data?.id == finalData?.landmarkName)
            ?.landmarkNameMr
          : " ",
      landmarkNameEng:
        landmarkNames?.find((data) => data?.id == finalData?.landmarkName)
          ?.landmarkName != undefined
          ? landmarkNames?.find((data) => data?.id == finalData?.landmarkName)
            ?.landmarkName
          : "",

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

      // licenseValidity
      licenseValidity:
        durationOfLicenseValidity?.find(
          (data) => data?.id == finalData?.loi?.durationOfLicenseValidity
        )?.licenseValidity != undefined
          ? durationOfLicenseValidity?.find(
            (data) => data?.id == finalData?.loi?.durationOfLicenseValidity
          )?.licenseValidity
          : "",

      hawkingDurationDailyDateTime:
        hawkingDurationDailys?.find(
          (data) => data?.id == finalData?.hawkingDurationDaily
        )?.hawkingDurationDailyTime != undefined
          ? hawkingDurationDailys?.find(
            (data) => data?.id == finalData?.hawkingDurationDaily
          )?.hawkingDurationDailyTime
          : "",

      //! Current Address
      // city Survey Number
      citySurveyNoCrEng: finalData?.crCitySurveyNumber,
      citySurveyNoCrMar: finalData?.crCitySurveyNumber,
      // zone Name
      zoneNameCrEng:
        zoneNames?.find((data) => data?.id == finalData?.crZoneKey)?.zoneName !=
          undefined
          ? zoneNames?.find((data) => data?.id == finalData?.crZoneKey)
            ?.zoneName
          : "",
      zoneNameCrMar:
        zoneNames?.find((data) => data?.id == finalData?.crZoneKey)
          ?.zoneNameMr != undefined
          ? zoneNames?.find((data) => data?.id == finalData?.crZoneKey)
            ?.zoneNameMr
          : "",

      // area Name
      areaNameCrEng:
        areaNames?.find((data) => data?.id == finalData?.crAreaName)
          ?.areaName != undefined
          ? areaNames?.find((data) => data?.id == finalData?.crAreaName)
            ?.areaName
          : "",
      areaNameCrMr:
        areaNames?.find((data) => data?.id == finalData?.crAreaName)
          ?.areaNameMr != undefined
          ? areaNames?.find((data) => data?.id == finalData?.crAreaName)
            ?.areaNameMr
          : "",

      // road Name
      roadNameCrEng:
        roadNames?.find((data) => data?.id == finalData?.crVillageName)
          ?.roadName != undefined
          ? roadNames?.find((data) => data?.id == finalData?.crVillageName)
            ?.roadName
          : "",
      roadNameCrMar:
        roadNames?.find((data) => data?.id == finalData?.crVillageName)
          ?.roadNameMr != undefined
          ? roadNames?.find((data) => data?.id == finalData?.crVillageName)
            ?.roadNameMr
          : "",

      // landmark Name
      landmarkNameCrMar:
        landmarkNames?.find((data) => data?.id == finalData?.crLandmarkName)
          ?.landmarkNameMr != undefined
          ? landmarkNames?.find((data) => data?.id == finalData?.crLandmarkName)
            ?.landmarkNameMr
          : "",
      landmarkNameCrEng:
        landmarkNames?.find((data) => data?.id == finalData?.crLandmarkName)
          ?.landmarkName != undefined
          ? landmarkNames?.find((data) => data?.id == finalData?.crLandmarkName)
            ?.landmarkName
          : "",

      // ward Name
      wardNameCrEng:
        wards?.find((data) => data?.id == finalData?.crWardName)?.wardName !=
          undefined
          ? wards?.find((data) => data?.id == finalData?.crWardName)?.wardName
          : "",
      wardNameCrMar:
        wards?.find((data) => data?.id == finalData?.crWardName)?.wardNameMr !=
          undefined
          ? wards?.find((data) => data?.id == finalData?.crWardName)?.wardNameMr
          : "",

      // city Name
      cityNameCrMar: "पिंपरी चिंचवड",
      cityNameCrEng: "Pimpri Chinchwad",
      // cityNameCrMar: finalData?.cityName,
      // cityNameCrEng: finalData?.cityName,
      // State Name
      stateNameCrMar: "महाराष्ट्र",
      stateNameCrEng: "Maharashtra",
      // stateNameCrMar: finalData?.state,
      // stateNameCrEng: finalData?.state,
    };
    setCertificateData(finalDataWithAddress);
    setValue("loadderState", false);
  }, [finalData, zoneNames, wards, areaNames, landmarkNames, roadNames]);

  useEffect(() => { }, [certificateData]);



  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <Paper elevation={0} className={CertificateCSS.Paper}>
          {/**Stack */}
          <Stack spacing={5} direction="row" className={CertificateCSS.Stack}>
            {/** Print Button */}
            <Button
              variant="contained"
              type="primary"
              startIcon={<PrintIcon />}
              style={{ float: "right" }}
              onClick={() => handlePrint()}
            >
              {<FormattedLabel id="print" />}
            </Button>
            {/** Back Button */}
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

          {/** componentToPrint */}
          <div className={CertificateCSS.ComponentToPrint}>
            <ComponentToPrint
              ref={componentRef}
              certificateData={certificateData}
              language={language}
              photo={photo}
            />
          </div>
          {/** Identity Card Name */}
        </Paper>
      )}
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends React.Component {
  // render
  render() {
    console.log("photo323", this?.props?.photo)
    // Print_view;
    return (
      <div className={CertificateCSS.OverFlowTable}>
        {/** table */}
        <table className={CertificateCSS.Table}>
          <tr className={`${CertificateCSS.Center} ${CertificateCSS.Parisht}`}>
            <td>{"परिशिष्ट-२"}</td>
          </tr>
          <tr
            className={`${CertificateCSS.Center} ${CertificateCSS.Pathavikaretha}`}
          >
            <td>
              {
                "पथविक्रेता (उपजीविका, संरक्षण व पथविक्री विनियमन) अधिनियम, २०१४ नुसार"
              }
            </td>
          </tr>
          <tr
            className={`${CertificateCSS.Center} ${CertificateCSS.NamunaAndOther}`}
          >
            <td>{"नमुना-२"}</td>
          </tr>
          <tr
            className={`${CertificateCSS.Center} ${CertificateCSS.NamunaAndOther}`}
          >
            <td>{"[कलम ४]"}</td>
          </tr>
          <tr
            className={`${CertificateCSS.Center} ${CertificateCSS.NamunaAndOther}`}
          >
            <td>{"विक्री प्रमाणपत्राचा नमुना"}</td>
          </tr>
          <tr>
            <td className={CertificateCSS.ImageTR}>
              <img
                src={`data:image/png;base64,${this?.props?.photo}`}
                alt="Street Vendor Photo"
                className={CertificateCSS.Image}
              // width={150}
              // height={150}
              // style={{ border: "2px solid black" }}
              />
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {"१.विक्रेत्याचे नांव: "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.firstNameMr +
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
                {
                  "२. जोडीदाराचे नांव किंवा अवलंबून असलेल्या अपत्याचे नांव (पथविक्रेत्याबरोबर व्यवसाय करीत असल्यास): "
                }
              </span>
              <span className={CertificateCSS.Content}>
                {/* this?.props?.certificateData?.firstNameMr +
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
                {"३. जन्मदिनांक: "}
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
              <span className={CertificateCSS.HeaderBold}>{"४. लिंग: "}</span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.genderNameMr}
              </span>
            </td>
          </tr>
          {/** 
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {
                   "५. पथविक्रेत्याचा निवासी पत्ता : "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.citySurveyNoCrMar +
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
                {"५. पथविक्रेत्याची वर्गवारी : "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.hawkerTypeNameMr}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {
                  "६. फिरत्या विक्रेत्याच्या बाबतीत विक्री ठिकाण/ क्षेत्राचा तपशील : "
                }
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.citySurveyNoMar +
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
                {"७. जारी केल्याचा दिनांक : "}
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
                {"८. प्रमाणपत्राचा वैधता दिनांक : "}
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
                {"९. प्रमाणपत्राचा वैधता कालावधी : "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.licenseValidityYear != null &&
                  this?.props?.certificateData?.licenseValidityYear !=
                  undefined &&
                  this?.props?.certificateData?.licenseValidityYear != ""
                  ? this?.props?.certificateData?.licenseValidityYear + " वर्षे"
                  : ""}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.CommonTrPadding}>
              <span className={CertificateCSS.HeaderBold}>
                {"१०. युनिक नोंदणी क्रमांक : "}
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
                {"११. विक्रीचे दिवस व वेळ :   "}
              </span>
              <span className={CertificateCSS.Content}>
                {this?.props?.certificateData?.hawkingDurationDailyDateTime}
              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.StanikPradhikaranTD}>
              <span className={CertificateCSS.StanikPradhikaran}>

                <img
                  src="/barcode.jpg"
                  alt="Maharashtra Logo"
                  height={100}
                  width={100}
                />

              </span>
            </td>
          </tr>
          <tr>
            <td className={CertificateCSS.DateSignatureTD}>

              <span className={CertificateCSS.Date}>
                <div>
                  {"स्थानिक प्राधिकरणाचा शिक्का / मोहोर"}
                </div>

                <div>
                  {/**
                  {"दिनांक : "}
                */}
                </div></span>
              <span className={CertificateCSS.Signature}>
                {"प्रमाणपत्र देणाऱ्या प्राधिकाऱ्याची स्वाक्षरी : "}
              </span>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Index;
