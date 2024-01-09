import BasicLayout from "../../../../containers/Layout/BasicLayout";

import React, { useEffect, useRef, useState } from "react";
import router from "next/router";

import { useReactToPrint } from "react-to-print";
import styles from "../../../../styles/skysignstyles/businessCertificate.module.css";
import { Box, Button, Paper } from "@mui/material";
import { BorderColor, HighlightTwoTone } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";

import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { useSelector } from "react-redux";

//  Certificate Form
const IndustryCertificateReport = () => {
  const componentRef = useRef();
  const componentRef1 = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // content: () => componentRef1.current,
  });

  const language = useSelector((state) => state?.labels.language);
  const userToken = useGetToken();
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

  const [dataa, setDataa] = useState(null);
  const [zones, setZones] = useState([]);
  const [businessType, setBusinessType] = useState([]);

  const getZone = () => {
    axios
      .get(`${urls.SSLM}/mstSkySignZone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("setZones", res?.data?.mstSkySignZoneDao);
        setZones(res?.data?.mstSkySignZoneDao ?? []);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  const getBusinessType = () => {
    axios
      .get(`${urls.SSLM}/master/MstBusinessTypes/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("setBusinessType", res?.data?.mstBusinessTypesDao);
        setBusinessType(res?.data?.mstBusinessTypesDao ?? []);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    if (router?.query?.id && zones && businessType) {
      axios
        .get(
          `${urls.SSLM}/trnIssuanceOfBusinessLicense/getByIdAndServiceId?serviceId=7&id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          console.log("aala", res?.data);
          setDataa({
            ...res?.data,
            zoneName: zones?.find((z) => z?.id == res?.data?.zoneKey)?.zoneName,
            zoneNameMr: zones?.find((z) => z?.id == res?.data?.zoneKey)
              ?.zoneNameMr,
            trnBussinessDetailsDao: {
              ...res?.data?.trnBussinessDetailsDao,
              businessTypeNameEn: businessType?.find(
                (b) => b?.id == res?.data?.trnBussinessDetailsDao?.businessType
              )?.businessType,
              businessTypeNameMr: businessType?.find(
                (b) => b?.id == res?.data?.trnBussinessDetailsDao?.businessType
              )?.businessTypeMr,
            },
          });
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [router?.query, zones, businessType]);
  // dataa?.trnBussinessDetailsDao
  // .businessType
  useEffect(() => {
    getZone();
    getBusinessType();
  }, []);

  // let tempObj = {
  //   "id": 101,
  //   "trnIndustryNumber": null,
  //   "applicationNumber": "PCMC1082023SSLM0000000102",
  //   "applicationDate": "2023-08-10",
  //   "serviceId": 7,
  //   "titleMr": 1,
  //   "applicantTypeKey": null,
  //   "applicantType": null,
  //   "title": 1,
  //   "firstName": "Nayan",
  //   "middleName": "M",
  //   "lastName": "Patil",
  //   "marFirstName": "नयन",
  //   "marMiddleName": "म",
  //   "marLastName": "पाटील",
  //   "isNew": null,
  //   "gender": 1,
  //   "dateOfBirth": null,
  //   "mobile": 8888888888,
  //   "emailAddress": "nayan@gmail.com",
  //   "panNo": "AAAAAA212",
  //   "registrationNo": null,
  //   "gstNo": null,
  //   "tanNo": null,
  //   "aadhaarNo": 456321451231,
  //   "crPropertyTaxNumber": "4324324",
  //   "crPropertyTaxAmount": "15000.00",
  //   "crWaterConsumerNo": "",
  //   "crWaterConsumerAmount": null,
  //   "crCitySurveyNumber": "",
  //   "crAreaName": "",
  //   "crLandmarkName": "",
  //   "crVillageName": "",
  //   "crCityName": "",
  //   "crState": "",
  //   "crPincode": null,
  //   "crLattitude": "",
  //   "crLongitud": null,
  //   "prCitySurveyNumber": "",
  //   "prAreaName": "",
  //   "prLandmarkName": "",
  //   "prVillageName": "",
  //   "prCityName": "",
  //   "prState": "",
  //   "prPincode": null,
  //   "prLattitude": "",
  //   "prLongitud": null,
  //   "remark": "Approved",
  //   "oldLicense": null,
  //   "isIssue": null,
  //   "applicationStatus": "LICENSE_GENRATED",
  //   "fromDate": null,
  //   "mstLicensetypekey": null,
  //   "role": null,
  //   "roledao": null,
  //   "approveRemark": null,
  //   "rejectRemark": null,
  //   "rejected": false,
  //   "userType": 1,
  //   "buildingCommencementCertificate": "/var/pcmcerp/sslm/Issuanceofindustrylic/10_08_2023_11_55_58__abcd1.jpg",
  //   "registrarionCertificate": "/var/pcmcerp/sslm/Issuanceofindustrylic/10_08_2023_11_56_01__bcd2.jpg",
  //   "Rawsiteviewermap": null,
  //   "slumNOC": null,
  //   "foodLicense": null,
  //   "agreementLetter": null,
  //   "occupancyCertificate": null,
  //   "environmentalNoc": null,
  //   "pageMode": null,
  //   "desg": null,
  //   "receiptPrint": null,
  //   "receiptDate": null,
  //   "action": null,
  //   "licenseStatus": null,
  //   "applicantDate": null,
  //   "serviceName": "Issuance Of Business License",
  //   "serviceNameMr": "व्यवसाय परवाना जारी करणे",
  //   "licenseNumber": "0000000202",
  //   "activeFlag": "Y",
  //   "createdUserId": 30,
  //   "age": null,
  //   "ownertype": null,
  //   "mstChartRateIndustrialKey": null,
  //   "nameOfOrganization": null,
  //   "userId": null,
  //   "applicantAddress": "Baner",
  //   "zoneKey": null,
  //   "subZoneKey": null,
  //   "subZoneAreaKey": null,
  //   "trnBussinessDetailsDao": {
  //     "id": 79,
  //     "trnapplicantKey": 101,
  //     "nameOfBusinessOrganization": "Nayan Cars ",
  //     "propertyNo": "4324324",
  //     "propertyStatus": "fsdfsf",
  //     "ownership": 14,
  //     "totalAreaFt": "32",
  //     "totalAreaM": "2.97289728",
  //     "zone": null,
  //     "businessType": 42,
  //     "businessSubType": null,
  //     "constructionType": 9,
  //     "constructionAreaFt": "35",
  //     "constructionAreaM": "3.2516064",
  //     "roadName": "gfdfg",
  //     "villageName": "gdfg",
  //     "prCityName": "Pimpri Chinchwad",
  //     "prState": "Maharashtra",
  //     "Pincode": "453534",
  //     "workingHours": "08:30",
  //     "fireEquirepment": null,
  //     "firstAidKit": null,
  //     "toilets": null,
  //     "storageofrawmaterial": null,
  //     "disposalSystemOfWaste": null,
  //     "nuisanceOfResidents": null,
  //     "ObjectionCertificate": null,
  //     "separatebusiness": null,
  //     "businessDate": null,
  //     "temporarylicDate": null,
  //     "TypeOfCityServerNumber": null,
  //     "CityServrNumber": null,
  //     "plotNo": "44",
  //     "numbertype": "citysurveyno",
  //     "citySurveyNo": "54",
  //     "noOfQuantity": null,
  //     "unitKey": 2,
  //     "businessValue": 9,
  //     "createdUserId": null,
  //     "zoneKey": null,
  //     "subZoneKey": null,
  //     "areaKey": null,
  //     "objectionCertificate": null,
  //     "typeOfCityServerNumber": null,
  //     "cityServrNumber": null,
  //     "pincode": "453534"
  //   },
  //   "trnLicenseDao": {
  //     "id": 202,
  //     "licenseNo": "0000000202",
  //     "applicantDetailsKey": null,
  //     "organizationname": null,
  //     "licenseType": null,
  //     "licenseValidFrom": "2023-08-10",
  //     "licenseValidTill": "2024-08-09",
  //     "issuedDate": null,
  //     "assignedto": null,
  //     "lateFee": null,
  //     "licenseFee": null,
  //     "areaRent": null,
  //     "noticeFee": null,
  //     "advertiseTax": null,
  //     "serviceTax": null,
  //     "applicantName": null,
  //     "mobile": null,
  //     "emailAddress": null,
  //     "applicationNumber": null,
  //     "gstNo": null,
  //     "application_Status": null,
  //     "action": "APPROVE",
  //     "licenseDate": "2023-08-10",
  //     "validityOfYear": null,
  //     "remark": null,
  //     "applicationNo": null,
  //     "trnApplicantDetailsDao": null,
  //     "applicantID": null,
  //     "serviceName": null,
  //     "firstName": null,
  //     "middle_name": null,
  //     "lastName": null,
  //     "panNo": null,
  //     "aadhaarNo": null,
  //     "serviceName1": null,
  //     "licenseType1": null,
  //     "licenseTypeMar": null,
  //     "storeKey": null,
  //     "businessKey": 101,
  //     "industrialKey": null,
  //     "storeId": null
  //   },
  //   "trnLoiDao": {
  //     "id": 399,
  //     "applicantId": null,
  //     "loiDate": "2023-08-10",
  //     "applicationDate": null,
  //     "serviceName": null,
  //     "durationOfLicenseValidity": null,
  //     "serviceCharge": null,
  //     "rate": null,
  //     "amount": 499,
  //     "total": null,
  //     "totalInWords": null,
  //     "paymentType": null,
  //     "paymentMode": null,
  //     "activeFlag": "Y",
  //     "noOfEmployees": null,
  //     "mstService": null,
  //     "reIssuanceId": null,
  //     "servicesName1": null,
  //     "trnLoiServiceChargesDao": null,
  //     "firstName": null,
  //     "middleName": null,
  //     "lastName": null,
  //     "licenseNo": null,
  //     "receiptNo": null,
  //     "receiptDate": null,
  //     "paymentMode1": null,
  //     "paymentType2": null,
  //     "date": null,
  //     "time": null,
  //     "flourMill": null,
  //     "NoflourMill": null,
  //     "storeKey": null,
  //     "businessKey": 101,
  //     "industrialKey": null,
  //     "storeId": null,
  //     "loiNo": "LCL10082023SSLM0000000399",
  //     "noflourMill": null
  //   },
  //   "trnPartnerDao": [
  //     {
  //       "id": 515,
  //       "trnapplicantKey": null,
  //       "businessKey": 101,
  //       "storeKey": null,
  //       "title": null,
  //       "pttitle": 1,
  //       "ptfname": "fdsf",
  //       "ptfname_mr": null,
  //       "ptmname": "dfsd",
  //       "ptmname_mr": null,
  //       "ptlname": "dfds",
  //       "ptlname_mr": null,
  //       "ptgender": 1,
  //       "ptdateOfBirth": "1985-01-22T00:00:00.000+00:00",
  //       "ptage": 38,
  //       "ptmobile": "453534534",
  //       "ptaadharNo": null,
  //       "ptemail": "gdfgdfg",
  //       "ptcrPropertyTaxNumber": null,
  //       "ptroadName": "gdfg",
  //       "ptvillage": "gdfgf",
  //       "ptcity": "gdgfd",
  //       "ptpincode": "534534",
  //       "ptPropertyTaxNumber": "543534",
  //       "partnerCheckBox": null,
  //       "addPartnerCheckBox": null,
  //       "industrialKey": null
  //     }
  //   ],
  //   "trnApplicantDetailsHistoryDao": [
  //     {
  //       "id": 770,
  //       "senderId": null,
  //       "senderName": null,
  //       "senderDepartmentId": null,
  //       "senderDesignationId": null,
  //       "sentDate": "2023-08-10T12:01:23.333674",
  //       "sentTime": "12:01:23",
  //       "remark": "Approved",
  //       "approverName": null,
  //       "userName": "Ashish Sanjay Dahale",
  //       "userNameMr": "आशिष संजय डहाळे",
  //       "curentApplicationStatus": "APPROVE_BY_LI",
  //       "previousApplicationStatus": "APPLICATION_SUBMITTED",
  //       "businessKey": 101,
  //       "industrialKey": null,
  //       "storeId": null
  //     },
  //     {
  //       "id": 771,
  //       "senderId": null,
  //       "senderName": null,
  //       "senderDepartmentId": null,
  //       "senderDesignationId": null,
  //       "sentDate": "2023-08-10T12:01:38.67546",
  //       "sentTime": "12:01:38",
  //       "remark": "Approved",
  //       "approverName": null,
  //       "userName": "Ashish Sanjay Dahale",
  //       "userNameMr": "आशिष संजय डहाळे",
  //       "curentApplicationStatus": "APPROVE_BY_OS",
  //       "previousApplicationStatus": "APPROVE_BY_LI",
  //       "businessKey": 101,
  //       "industrialKey": null,
  //       "storeId": null
  //     },
  //     {
  //       "id": 772,
  //       "senderId": null,
  //       "senderName": null,
  //       "senderDepartmentId": null,
  //       "senderDesignationId": null,
  //       "sentDate": "2023-08-10T12:03:39.747804",
  //       "sentTime": "12:03:39",
  //       "remark": null,
  //       "approverName": null,
  //       "userName": "Ashish Sanjay Dahale",
  //       "userNameMr": "आशिष संजय डहाळे",
  //       "curentApplicationStatus": "SITE_VISITED",
  //       "previousApplicationStatus": "APPOINTMENT_SCHEDULED",
  //       "businessKey": 101,
  //       "industrialKey": null,
  //       "storeId": null
  //     },
  //     {
  //       "id": 773,
  //       "senderId": null,
  //       "senderName": null,
  //       "senderDepartmentId": null,
  //       "senderDesignationId": null,
  //       "sentDate": "2023-08-10T12:04:19.208128",
  //       "sentTime": "12:04:19",
  //       "remark": "Approved",
  //       "approverName": null,
  //       "userName": "Ashish Sanjay Dahale",
  //       "userNameMr": "आशिष संजय डहाळे",
  //       "curentApplicationStatus": "APPROVE_BY_HOD",
  //       "previousApplicationStatus": "SITE_VISITED",
  //       "businessKey": 101,
  //       "industrialKey": null,
  //       "storeId": null
  //     },
  //     {
  //       "id": 774,
  //       "senderId": null,
  //       "senderName": null,
  //       "senderDepartmentId": null,
  //       "senderDesignationId": null,
  //       "sentDate": "2023-08-10T12:04:47.369723",
  //       "sentTime": "12:04:47",
  //       "remark": null,
  //       "approverName": null,
  //       "userName": "Ashish Sanjay Dahale",
  //       "userNameMr": "आशिष संजय डहाळे",
  //       "curentApplicationStatus": "LOI_GENERATED",
  //       "previousApplicationStatus": "APPROVE_BY_HOD",
  //       "businessKey": 101,
  //       "industrialKey": null,
  //       "storeId": null
  //     },
  //     {
  //       "id": 775,
  //       "senderId": null,
  //       "senderName": null,
  //       "senderDepartmentId": null,
  //       "senderDesignationId": null,
  //       "sentDate": "2023-08-10T12:05:34.515667",
  //       "sentTime": "12:05:34",
  //       "remark": null,
  //       "approverName": null,
  //       "userName": "Ashish Sanjay Dahale",
  //       "userNameMr": "आशिष संजय डहाळे",
  //       "curentApplicationStatus": "PAYEMENT_SUCCESSFUL",
  //       "previousApplicationStatus": "LOI_GENERATED",
  //       "businessKey": 101,
  //       "industrialKey": null,
  //       "storeId": null
  //     },
  //     {
  //       "id": 776,
  //       "senderId": null,
  //       "senderName": null,
  //       "senderDepartmentId": null,
  //       "senderDesignationId": null,
  //       "sentDate": "2023-08-10T12:05:59.306525",
  //       "sentTime": "12:05:59",
  //       "remark": null,
  //       "approverName": null,
  //       "userName": "Ashish Sanjay Dahale",
  //       "userNameMr": "आशिष संजय डहाळे",
  //       "curentApplicationStatus": "LICENSE_GENRATED",
  //       "previousApplicationStatus": "PAYEMENT_SUCCESSFUL",
  //       "businessKey": 101,
  //       "industrialKey": null,
  //       "storeId": null
  //     }
  //   ],
  //   "trnPaymentCollectionDao": {
  //     "id": 179,
  //     "applicantId": null,
  //     "loiId": 399,
  //     "paymentType": "Offline ",
  //     "paymentMode": "CASH",
  //     "receiptDate": "2023-08-10",
  //     "receiptNo": "RCPT10082023SSLM0000000000",
  //     "receiptAmount": null,
  //     "dDDate": null,
  //     "dDNo": null,
  //     "bankAccountNo": null,
  //     "bankName": null,
  //     "activeFlag": "Y",
  //     "trnLoiDao": null,
  //     "businessKey": 101,
  //     "industrialKey": null,
  //     "storeId": null,
  //     "ddno": null,
  //     "dddate": null
  //   },
  //   "trnSiteVisitFormDao": {
  //     "id": 93,
  //     "industrialKey": null,
  //     "latitude": null,
  //     "longitude": null,
  //     "remark": "Visited",
  //     "applicationId": null,
  //     "url1": null,
  //     "url2": null,
  //     "url3": null,
  //     "url4": null,
  //     "url5": null,
  //     "activeFlag": "Y",
  //     "fromDate": null,
  //     "toDate": null,
  //     "cfc": null,
  //     "LicenseNumber": null,
  //     "sheduledDate": null,
  //     "resheduleDate": null,
  //     "selectTime": null,
  //     "token": null,
  //     "status": null,
  //     "storeKey": null,
  //     "businessKey": 101,
  //     "fireEquirepment": "true",
  //     "firstAidKit": "true",
  //     "toilets": "false",
  //     "storageofrawmaterial": "false",
  //     "disposalSystemOfWaste": "true",
  //     "nuisanceOfResidents": "false",
  //     "ObjectionCertificate": "true",
  //     "separatebusiness": "false",
  //     "businessDate": "2023-08-10",
  //     "temporarylicDate": "2023-08-10",
  //     "photo2": "/var/pcmcerp/sslm/sslmsitevisit/10_08_2023_12_03_20__abcd1.jpg",
  //     "photo1": "/var/pcmcerp/sslm/sslmsitevisit/10_08_2023_12_03_17__abcd1.jpg",
  //     "photo3": "/var/pcmcerp/sslm/sslmsitevisit/10_08_2023_12_03_22__bcd2.jpg",
  //     "photo4": "/var/pcmcerp/sslm/sslmsitevisit/10_08_2023_12_03_24__abcd1.jpg",
  //     "photo5": "/var/pcmcerp/sslm/sslmsitevisit/10_08_2023_12_03_26__bcd2.jpg",
  //     "photo1TextField": "fdsfgde",
  //     "photo2TextField": "fdsfgdfg",
  //     "photo3TextField": "fdsf",
  //     "photo4TextField": "gdfg",
  //     "photo5TextField": "gdfgggf",
  //     "crLattitude": "212",
  //     "crLongitud": "322",
  //     "storeId": null,
  //     "objectionCertificate": "true",
  //     "licenseNumber": null
  //   },
  //   "appointmentScheduleRescheduleSiteVisteDao": {
  //     "id": 17,
  //     "applicantId": null,
  //     "storeLicenseId": null,
  //     "slotId": 532,
  //     "tokenNo": null,
  //     "remark": null,
  //     "fromTime": "17:00:00",
  //     "toTime": "18:00:00",
  //     "businessLicenseId": 101,
  //     "industrialKey": null,
  //     "siteVisitDate": "2023-08-10",
  //     "activeFlag": "Y"
  //   },
  //   "addressCheckBox": null,
  //   "rawsiteviewermap": null
  // }

  return (
    <Paper>
      <div>
        <center>
          <h1> Certificate</h1>
        </center>
      </div>

      <ComponentToPrint ref={componentRef} dataa={dataa} />
      <div
        style={{
          padding: 10,
          display: "flex",
          justifyContent: "space-evenly",
          marginTop: "5vh",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          // style={{ float: "right" }}
          onClick={handlePrint}
        >
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            swal({
              title: "Exit?",
              text: "Are you sure you want to exit this Record ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal("Record is Successfully Exit!", {
                  icon: "success",
                });

                if (router?.query?.citizenView) {
                  router.push("/dashboard");
                } else {
                  router.push(
                    "/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny"
                  );
                }
              } else {
                swal("Record is Safe");
              }
            });
          }}
        >
          Exit
        </Button>
      </div>
    </Paper>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.outerPrintContainer}>
        <div
          style={
            {
              // backgroundColor: 'aquamarine',
              // height: "170vh",
            }
          }
        >
          <table className={styles.data}>
            <tr>
              <div className={styles.main}>
                <div className={styles.one}>
                  <img
                    src="/logo.png"
                    alt="Maharashtra Logo"
                    // height={200}
                    // width={200}
                    className={styles.mahlogo}
                  ></img>
                </div>
                <div className={styles.headingContain}>
                  <span className={styles.headings}>
                    <b>पिंपरी चिंचवड महानगरपालिका</b>
                  </span>
                  <span className={styles.headings}>
                    <b>मुख्य कार्यालय, पिंपरी ४११ ०१८</b>
                  </span>
                  <span className={styles.headings}>
                    <b>आकाशचिन्ह व परवाना विभाग</b>
                  </span>
                  <span className={styles.headings}>
                    <b>व्यवसाय परवाना</b>
                  </span>{" "}
                  <span className={styles.headings}>
                    <b>(नवीन)</b>
                  </span>{" "}
                  <span className={styles.headings}>
                    (मुंबई प्रांतिक मनपा अधिनियम १९४९ चे कलम ३७६ व उपविधी
                    अन्वये)
                  </span>
                  <span className={styles.headings}>
                    (नागरी व प्रशासकीय सेवेसाठी ISO 9001 : 2008 प्रमाणपत्र
                    प्राप्त संस्था )
                  </span>
                </div>
                <div className={styles.three}>
                  <img
                    src="/rts_servicelogo.png"
                    alt="Maharashtra Logo"
                    // height={197}
                    // width={197}
                    className={styles.servicelogo}
                  ></img>
                </div>
              </div>
            </tr>
            <tr className={styles.upperDetails}>
              <div className={styles.detailLines}>
                <b>
                  परवाना क्रमांक :-&nbsp;
                  {this?.props?.dataa?.trnLicenseDao.licenseNo}
                </b>
              </div>

              <div className={styles.detailLines}>
                <b>टोकन क्रमांक:-&nbsp;</b>
                {this?.props?.dataa?.applicationNumber}
              </div>
            </tr>

            <tr className={styles.upperDetails}>
              <div className={styles.detailLines}>
                <b>
                  {" "}
                  परवाना दिनांक :-&nbsp;
                  {moment(this?.props?.dataa?.trnLicenseDao.licenseDate).format(
                    "DD/MM/YYYY"
                  )}{" "}
                </b>
              </div>
              <div className={styles.detailLines}>
                <b> टोकन दिनांक:-&nbsp;</b>
                {moment(this?.props?.dataa?.applicationDate).format(
                  "DD/MM/YYYY"
                )}
              </div>
            </tr>
          </table>

          <table className={styles.data}>
            <tr>
              <td className={styles.innerTableTd}>
                <table>
                  {/* <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>परवाना क्रमांक :-&nbsp;{this?.props?.dataa?.trnLicenseDao.licenseNo}</b>
                    </div>
                
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b> परवाना दिनांक :-&nbsp;{moment(this?.props?.dataa?.trnLicenseDao.licenseDate).format('DD-MM-YYYY')} </b>
                    </div>
                
                  </tr> */}
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        परवाना कालावधी : &nbsp;
                        {moment(
                          this?.props?.dataa?.trnLicenseDao.licenseValidTill
                        ).format("DD/MM/YYYY")}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        व्यवसायाचे नाव : &nbsp;
                        {
                          this?.props?.dataa?.trnBussinessDetailsDao
                            ?.nameOfBusinessOrganization
                        }
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        मालकाचे नाव : &nbsp;
                        {this?.props?.dataa?.firstName +
                          " " +
                          this?.props?.dataa?.middleName +
                          " " +
                          this?.props?.dataa?.lastName}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>व्यवसायाचे स्वरूप :&nbsp;</b>व्यवसाय परवाना
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        व्यवसायाचा प्रकार : &nbsp;
                        {
                          this?.props?.dataa?.trnBussinessDetailsDao
                            .businessTypeNameMr
                        }
                      </b>
                    </div>
                  </tr>
                  {/* <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>एकूण क्षेत्र : &nbsp;{this?.props?.dataa?.trnBussinessDetailsDao?.totalAreaM + " in sq.m"}</b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b> कामाच्या वेळा :  &nbsp;{this?.props?.dataa?.trnBussinessDetailsDao?.workingHours + " तास"}</b>

                    </div>
                  </tr> */}
                </table>
              </td>
              <td className={styles.innerTableTd2}>
                <table>
                  {/* <tr className={styles.rowCheck}>

                    <div className={styles.detailLines}>
                      <b>टोकन क्रमांक:-&nbsp;</b>१०२५५२१३44444444444
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>  टोकन दिनांक:-&nbsp;</b>११/०८/२३
                    </div>
                  </tr> */}
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b> झोनचे नाव:-&nbsp;</b>
                      <b> {this?.props?.dataa?.zoneNameMr} </b>
                    </div>
                  </tr>

                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        घरचा पत्ता : &nbsp;
                        {this?.props?.dataa?.applicantAddress}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}></div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}></div>
                  </tr>

                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        {" "}
                        व्यवसायाचे ठिकाण : &nbsp;
                        {
                          // this?.props?.dataa?.trnBussinessDetailsDao
                          //   ?.cityServrNumber +
                          //   "," +
                          this?.props?.dataa?.trnBussinessDetailsDao?.roadName +
                            "," +
                            this?.props?.dataa?.trnBussinessDetailsDao
                              ?.prCityName +
                            "," +
                            this?.props?.dataa?.trnBussinessDetailsDao
                              ?.prState +
                            "," +
                            this?.props?.dataa?.trnBussinessDetailsDao?.pincode
                        }
                      </b>{" "}
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}></div>
                  </tr>

                  {/* <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>बांधकाम क्षेत्र :  &nbsp;{this?.props?.dataa?.trnBussinessDetailsDao?.constructionAreaM + " in sq.m"}</b>

                    </div>
                  </tr> */}
                </table>
              </td>
            </tr>
          </table>

          <table className={styles.data}>
            <tr>
              <td className={styles.innerTableTd}>
                <table>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        एकूण क्षेत्र : &nbsp;
                        {this?.props?.dataa?.trnBussinessDetailsDao
                          ?.totalAreaM + " in sq.m"}
                      </b>
                    </div>
                  </tr>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        {" "}
                        कामाच्या वेळा : &nbsp;
                        {this?.props?.dataa?.trnBussinessDetailsDao
                          ?.workingHours + " तास"}
                      </b>
                    </div>
                  </tr>
                </table>
              </td>
              <td className={styles.innerTableTd2}>
                <table>
                  <tr className={styles.rowCheck}>
                    <div className={styles.detailLines}>
                      <b>
                        बांधकाम क्षेत्र : &nbsp;
                        {this?.props?.dataa?.trnBussinessDetailsDao
                          ?.constructionAreaM + " in sq.m"}
                      </b>
                    </div>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table className={styles.report}>
            <tr>
              <tr>
                <div className={styles.rowCheck22}>
                  <b>
                    (सदर परवाना हा महाराष्ट्र महानगरपालिका अधिनियम व
                    महानगरपालिकेचे उपविधी यांच्या शर्तीस अधिन राहिल){" "}
                  </b>
                </div>
                <div className={styles.rowCheck22}>
                  <b>
                    {" "}
                    07/02/2020 च्या नोटराईज हमीपत्रामधील अटीस अधिन राहून
                    तात्पुरत्या स्वरूपाचा परवाना दिला असे{" "}
                  </b>
                </div>
                <div className={styles.rowCheck22}>
                  <b>परवान्याची फी र.रू.: &nbsp;</b>
                  {this?.props?.dataa?.trnLoiDao?.amount}
                </div>
                <div className={styles.rowCheck22}>
                  <b>पावती क्रमांक : &nbsp;</b>
                  {this?.props?.dataa?.trnPaymentCollectionDao?.receiptNo}
                </div>
                <div className={styles.rowCheck22}>
                  <b> फी भरल्याचा दिनांक : &nbsp;</b>
                  {moment(
                    this?.props?.dataa?.trnPaymentCollectionDao?.receiptDate
                  ).format("DD/MM/YYYY")}
                </div>
              </tr>
              {/* <div className={styles.mtwo}>
                          <tr>
                            <div>
                              <right>
                                <h3>
                                  <b>एकूण र.रु. : </b>
                                </h3>
                                
                              </right>
                            </div>
                          </tr>
                        </div> */}
            </tr>
            <tr className={styles.bottomRow}>
              <div className={styles.qrcode}>
                <img
                  src="/qrcode.png"
                  alt="Maharashtra Logo"
                  className={styles.qrLogo}
                ></img>
              </div>

              <div className={styles.signDetails}>
                <tr>
                  <b>उप आयुक्त (परवाना)</b>
                </tr>
                <tr>पिंपरी चिंचवड महानगरपालिका</tr>
                <tr>पिंपरी ४११ ०१८</tr>
              </div>
              {/* <td colSpan="2" style={{ paddingRight: "50px", marginTop: "4vh" }}>
                  {" "}
                  <h3>
                    <b>उप आयुक्त (परवाना)</b>
                  </h3>
                  <h3>पिंपरी चिंचवड महानगरपालिका</h3>
                  <h3>पिंपरी ४११ ०१८</h3>
                </td> */}
            </tr>
          </table>
        </div>

        <div className={styles.secondPageTable}>
          <table className={styles.dataNewPage}>
            <tr>
              <ol className={styles.listDetails}>
                <li className={styles.listClass}>
                  {" "}
                  प्रत्येक परवाना धारकाने परवान्याचे नुतनीकरण दरवर्षी दि.३०
                  एप्रिलच्या आत करुन घेणे बंधनकारक आहे पंरतु सवलत म्हणून दि. ३०
                  जुन पर्यंत नुतनीकरण करता येईल ३० जून पर्यंत नुतनीकरण न केलेस
                  माहे एप्रिल पासून विलंबशुल्क दरमहा १०%प्रमाणे आकारणेत येईल.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  महानगरपालिकेच्या अधिका-याने परवाना तपासणीसाठी मागितला तर तो
                  परवाना धारकाने दाखविला पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  परवाना ज्यासाठी दिला आहे त्या जागेतच उद्योगधंदा चालविला
                  पाहिजे. सार्वजनिक जागेवर अतिक्रमण करता कामा नये.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  पिंपरी चिंचवड महानगरपालिकेने कोणत्याही कारणास्तव जाहिरात
                  परवाना रद्द केल्यास त्याविरुध्द न्यायालयात दाद मागण्याचा हक्क
                  मला राहणार नाही.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  प्रत्येक कामगारास व्यवसाय क्षेत्रामध्ये प्रत्यक्ष जागेच्या
                  ठिकाणी कमीत कमी २५ चौ.फूट जागा ठेवली पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  निवासी भागातील परवाना धारकास जर १० पेक्षा जास्त कामगार ठेवायचे
                  असतील तर त्याने आपला उद्योगधंदा महानगरपालिकेच्या औद्योगिक
                  विभागात हलविला पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  निवासी विभागामध्ये असणा-या परवाना धारकाने रात्री ८.०० ते सकाळी
                  ८.०० पर्यत व्यवसाय बंद ठेवला पाहिजे..
                </li>
                <li className={styles.listClass}>
                  {" "}
                  उद्योगधंदयापासून आजूबाजूच्या रहिवाश्यांना आवाजामुळे किंवा
                  उद्योगधंद्यामुळे निर्माण होणा-या वायुमुहे अगर द्रवपदार्थामुळे
                  उपद्रव होणार नाही किंवा धोका होणार नाही याची काळजी घेतली
                  पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  उद्योगधंद्यापासून निचरा होणारे पाणी रसायने अगर इतर कोणतेही
                  द्रपदार्थ किंवा कचरा वा वायुमुळे अगर द्रवपदार्थामुळे उपद्रव
                  होणार नाही किंवा धोका होणार नाही याची काळजी घेतली पाहिजे.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  महाराष्ट्र महानगरपालिका अधिनियम मधील कलमांचा व्यवसाय धारकाने
                  भंग केल्यास त्यावर कायदेशीर इलाज केला जाईल.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  महानगरपालिका उपविधीमधील तरतुदींचे कोणी उल्लंघन केल्यास
                  त्यांचेवर कायदेशीर इलाज केला जाईल.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  महानगरपालिका या कामी वेळोवळी जे नियम उपविधी करील व परवाना
                  शुल्क संबधी निर्णय घेईल ते परवाना धारकावर बंधनकारक राहतील.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  सदर परवान्या व्यतिरिक्त जे शासकीय / निमशासकीय परवाने धारण करणे
                  आवश्यक असतील असे सर्व परवाने धारण करणेची जबाबदारी ही परवाना
                  धारकावर राहील.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  जाहिरात फलकाचा परवाना कालावधी संपल्यानंतर नुतनीकरण करून घेणेची
                  जबाबदारी माझी राहील तसेच नुतनीकरणासाठी अर्ज सादर केला नाही.
                  त्या कालावधीमध्ये सदरचा जाहिरात फलक अतिवृष्टी, वारा, नैसर्गिक
                  आपत्ती, किंवा अन्य कोणत्याही कारणास्तव फलक पडुन जिवीत अथवा
                  वित्त हानी झाल्यास त्याची संपुर्णपणे कायदेशीर जबाबदारी फलक
                  अस्तित्वात आहे तोपर्यंत माझी राहील. त्या बाबत म.न.पास तोषीस
                  लागून देणार नाही.
                </li>
                <li className={styles.listClass}>
                  {" "}
                  जाहिरात फलकाचे नुतनीकरण संपल्यानंतर किंवा मुदत संपल्यानंतर
                  सदरचा जाहिरात फलक संपुर्णपणे निष्कासित करण्याची जबाबदारी माझी
                  राहील.
                </li>
                <li className={styles.listClass}>
                  मनपाच्या विविध योजना व विविध उपक्रमाबाबत जाहिरात फलकांवर दहा
                  दिवस जाहिरात प्रसिध्द करून देणे बंधनकारक राहील.
                </li>
              </ol>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

class ComponentToPrintNotice extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper>
              <table className={styles.data}>
                <tr>
                  <h2>
                    {" "}
                    १) प्रत्येक परवाना धारकाने परवान्याचे नुतनीकरण दरवर्षी दि.३०
                    एप्रिलच्या आत करुन घेणे बंधनकारक आहे पंरतु सवलत म्हणून दि.
                    ३० जुन पर्यंत नुतनीकरण करता येईल ३० जून पर्यंत नुतनीकरण न
                    केलेस माहे एप्रिल पासून विलंबशुल्क दरमहा १०%प्रमाणे आकारणेत
                    येईल.
                  </h2>
                  <h2>
                    {" "}
                    २) महानगरपालिकेच्या अधिका-याने परवाना तपासणीसाठी मागितला तर
                    तो परवाना धारकाने दाखविला पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    ३) परवाना ज्यासाठी दिला आहे त्या जागेतच उद्योगधंदा चालविला
                    पाहिजे. सार्वजनिक जागेवर अतिक्रमण करता कामा नये.
                  </h2>
                  <h2>
                    {" "}
                    ४) पिंपरी चिंचवड महानगरपालिकेने कोणत्याही कारणास्तव जाहिरात
                    परवाना रद्द केल्यास त्याविरुध्द न्यायालयात दाद मागण्याचा
                    हक्क मला राहणार नाही.
                  </h2>
                  <h2>
                    {" "}
                    ५) प्रत्येक कामगारास व्यवसाय क्षेत्रामध्ये प्रत्यक्ष
                    जागेच्या ठिकाणी कमीत कमी २५ चौ.फूट जागा ठेवली पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    ६) निवासी भागातील परवाना धारकास जर १० पेक्षा जास्त कामगार
                    ठेवायचे असतील तर त्याने आपला उद्योगधंदा महानगरपालिकेच्या
                    औद्योगिक विभागात हलविला पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    ७) निवासी विभागामध्ये असणा-या परवाना धारकाने रात्री ८.०० ते
                    सकाळी ८.०० पर्यत व्यवसाय बंद ठेवला पाहिजे..
                  </h2>
                  <h2>
                    {" "}
                    ८) उद्योगधंदयापासून आजूबाजूच्या रहिवाश्यांना आवाजामुळे किंवा
                    उद्योगधंद्यामुळे निर्माण होणा-या वायुमुहे अगर
                    द्रवपदार्थामुळे उपद्रव होणार नाही किंवा धोका होणार नाही याची
                    काळजी घेतली पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    ९) उद्योगधंद्यापासून निचरा होणारे पाणी रसायने अगर इतर
                    कोणतेही द्रपदार्थ किंवा कचरा वा वायुमुळे अगर द्रवपदार्थामुळे
                    उपद्रव होणार नाही किंवा धोका होणार नाही याची काळजी घेतली
                    पाहिजे.
                  </h2>
                  <h2>
                    {" "}
                    १०) महाराष्ट्र महानगरपालिका अधिनियम मधील कलमांचा व्यवसाय
                    धारकाने भंग केल्यास त्यावर कायदेशीर इलाज केला जाईल.
                  </h2>
                  <h2>
                    {" "}
                    ११) महानगरपालिका उपविधीमधील तरतुदींचे कोणी उल्लंघन केल्यास
                    त्यांचेवर कायदेशीर इलाज केला जाईल.
                  </h2>
                  <h2>
                    {" "}
                    १२) महानगरपालिका या कामी वेळोवळी जे नियम उपविधी करील व
                    परवाना शुल्क संबधी निर्णय घेईल ते परवाना धारकावर बंधनकारक
                    राहतील.
                  </h2>
                  <h2>
                    {" "}
                    १३) सदर परवान्या व्यतिरिक्त जे शासकीय / निमशासकीय परवाने
                    धारण करणे आवश्यक असतील असे सर्व परवाने धारण करणेची जबाबदारी
                    ही परवाना धारकावर राहील.
                  </h2>
                  <h2>
                    {" "}
                    १४) जाहिरात फलकाचा परवाना कालावधी संपल्यानंतर नुतनीकरण करून
                    घेणेची जबाबदारी माझी राहील तसेच नुतनीकरणासाठी अर्ज सादर केला
                    नाही. त्या कालावधीमध्ये सदरचा जाहिरात फलक अतिवृष्टी, वारा,
                    नैसर्गिक आपत्ती, किंवा अन्य कोणत्याही कारणास्तव फलक पडुन
                    जिवीत अथवा वित्त हानी झाल्यास त्याची संपुर्णपणे कायदेशीर
                    जबाबदारी फलक अस्तित्वात आहे तोपर्यंत माझी राहील. त्या बाबत
                    म.न.पास तोषीस लागून देणार नाही.
                  </h2>
                  <h2>
                    {" "}
                    १५) जाहिरात फलकाचे नुतनीकरण संपल्यानंतर किंवा मुदत
                    संपल्यानंतर सदरचा जाहिरात फलक संपुर्णपणे निष्कासित करण्याची
                    जबाबदारी माझी राहील.
                  </h2>
                  <h2>
                    १६) मनपाच्या विविध योजना व विविध उपक्रमाबाबत जाहिरात फलकांवर
                    दहा दिवस जाहिरात प्रसिध्द करून देणे बंधनकारक राहील.
                  </h2>
                </tr>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default IndustryCertificateReport;
