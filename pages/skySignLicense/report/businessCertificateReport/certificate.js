import BasicLayout from "../../../../containers/Layout/BasicLayout";

import React, { useEffect, useRef, useState } from "react";
import router from 'next/router'

import { useReactToPrint } from "react-to-print";
import styles from "../../../../styles/skysignstyles/businessCertificateMod.module.css";
import { Box, Button, Paper } from "@mui/material";
import { BorderColor, HighlightTwoTone } from "@mui/icons-material";
import axios from "axios";
import urls from "../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { yellow } from "@mui/material/colors";

//  Certificate Form
const IndustryCertificateReport = () => {
    const componentRef = useRef();
    const componentRef1 = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        // content: () => componentRef1.current,
    });

    const [dataa, setDataa] = useState(null)


    useEffect(() => {
        if (router?.query?.id) {
            axios
                .get(
                    `${urls.SSLM}/trnIssuanceOfBusinessLicense/getByIdAndServiceId?serviceId=7&id=${router?.query?.id}`,
                )
                .then((res) => {
                    console.log("aala", res?.data)
                    setDataa(res?.data)
                })
        }
    }, [])


    let tempObj = {
        "id": 48,
        "trnIndustryNumber": null,
        "applicationNumber": "PCMC1472023SSLM0000000049",
        "applicationDate": "2023-07-14",
        "serviceId": 7,
        "titleMr": 1,
        "applicantTypeKey": null,
        "applicantType": null,
        "title": 1,
        "firstName": "Rahul",
        "middleName": "M",
        "lastName": "Jadhav",
        "marFirstName": "राहुल ",
        "marMiddleName": "एम ",
        "marLastName": "जाधव ",
        "isNew": null,
        "gender": 1,
        "dateOfBirth": null,
        "mobile": 9096811399,
        "emailAddress": "g@gmail.com",
        "panNo": "Test123L",
        "registrationNo": null,
        "gstNo": null,
        "tanNo": null,
        "aadhaarNo": 678612786177,
        "crPropertyTaxNumber": "0123010312",
        "crPropertyTaxAmount": "15000.00",
        "crWaterConsumerNo": "",
        "crWaterConsumerAmount": null,
        "crCitySurveyNumber": "41",
        "crAreaName": "Test",
        "crLandmarkName": "Test ",
        "crVillageName": "Pimpri ",
        "crCityName": "Pimpri ",
        "crState": "Maharashtra ",
        "crPincode": 411018,
        "crLattitude": "1231231",
        "crLongitud": "123131231",
        "prCitySurveyNumber": "41",
        "prAreaName": "Test",
        "prLandmarkName": "Test ",
        "prVillageName": "Pimpri ",
        "prCityName": "Pimpri ",
        "prState": "Maharashtra ",
        "prPincode": 411018,
        "prLattitude": "1231231",
        "prLongitud": "123131231",
        "remark": "",
        "oldLicense": null,
        "isIssue": null,
        "applicationStatus": "LICENSE_GENRATED",
        "fromDate": null,
        "mstLicensetypekey": null,
        "role": null,
        "roledao": null,
        "approveRemark": null,
        "rejectRemark": null,
        "rejected": false,
        "userType": 1,
        "buildingCommencementCertificate": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_32_33__S Adhar Card.png",
        "registrarionCertificate": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_32_37__S Affidavite.jpeg",
        "Rawsiteviewermap": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_32_40__S Disability Certificate.png",
        "slumNOC": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_32_43__S Affidavite.jpeg",
        "foodLicense": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_32_46__S Ration Card.jpeg",
        "agreementLetter": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_32_55__S Pan.jpeg",
        "occupancyCertificate": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_32_58__S Pan.jpeg",
        "environmentalNoc": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_33_02__S Adhar Card.png",
        "pageMode": null,
        "desg": null,
        "receiptPrint": null,
        "receiptDate": null,
        "action": null,
        "licenseStatus": null,
        "applicantDate": null,
        "zoneKey": null,
        "serviceName": "Issuance Of Business License",
        "serviceNameMr": "व्यवसाय परवाना जारी करणे",
        "licenseNumber": "0000000000",
        "activeFlag": "Y",
        "createdUserId": 50,
        "age": null,
        "ownertype": null,
        "mstChartRateIndustrialKey": null,
        "nameOfOrganization": null,
        "trnBussinessDetailsDao": {
            "id": 52,
            "trnapplicantKey": 48,
            "nameOfBusinessOrganization": "Ganesh Wools",
            "propertyNo": "0102012120",
            "propertyStatus": "Legal",
            "ownership": 14,
            "totalAreaFt": "12000",
            "totalAreaM": "120",
            "zone": 1,
            "businessType": 41,
            "businessSubType": null,
            "constructionType": 2,
            "constructionAreaFt": "1000",
            "constructionAreaM": "120",
            "roadName": "Old Mumbai Pune Highway ",
            "villageName": "Pimpri ",
            "prCityName": "Pimpri ",
            "prState": "Maharashtra",
            "Pincode": "411018",
            "workingHours": "8.30",
            "fireEquirepment": "true",
            "firstAidKit": "true",
            "toilets": "true",
            "storageofrawmaterial": "false",
            "disposalSystemOfWaste": "true",
            "nuisanceOfResidents": "true",
            "ObjectionCertificate": "true",
            "separatebusiness": "true",
            "businessDate": "2023-07-17T00:00:00.000+00:00",
            "temporarylicDate": "2023-07-14T00:00:00.000+00:00",
            "TypeOfCityServerNumber": null,
            "CityServrNumber": null,
            "plotNo": "12",
            "numbertype": "citysurveyno",
            "citySurveyNo": "12",
            "noOfQuantity": null,
            "unitKey": 1,
            "businessValue": 12,
            "createdUserId": null,
            "objectionCertificate": "true",
            "typeOfCityServerNumber": null,
            "cityServrNumber": null,
            "pincode": "411018"
        },
        "trnLicenseDao": {
            "id": 192,
            "licenseNo": "0000000000",
            "applicantDetailsKey": null,
            "organizationname": null,
            "licenseType": null,
            "licenseValidFrom": "2023-07-15",
            "licenseValidTill": "2026-07-14",
            "issuedDate": null,
            "assignedto": null,
            "lateFee": null,
            "licenseFee": null,
            "areaRent": null,
            "noticeFee": null,
            "advertiseTax": null,
            "serviceTax": null,
            "applicantName": null,
            "mobile": null,
            "emailAddress": null,
            "applicationNumber": null,
            "gstNo": null,
            "application_Status": null,
            "action": "APPROVE",
            "licenseDate": "2023-07-15",
            "validityOfYear": null,
            "remark": null,
            "applicationNo": null,
            "trnApplicantDetailsDao": null,
            "applicantID": null,
            "serviceName": null,
            "firstName": null,
            "middle_name": null,
            "lastName": null,
            "panNo": null,
            "aadhaarNo": null,
            "serviceName1": null,
            "licenseType1": null,
            "licenseTypeMar": null,
            "storeKey": null,
            "businessKey": 48
        },
        "trnLoiDao": {
            "id": 388,
            "applicantId": null,
            "loiDate": "2023-07-14",
            "applicationDate": null,
            "serviceName": null,
            "durationOfLicenseValidity": null,
            "serviceCharge": null,
            "rate": null,
            "amount": 472,
            "total": null,
            "totalInWords": null,
            "paymentType": null,
            "paymentMode": null,
            "activeFlag": "Y",
            "noOfEmployees": null,
            "mstService": null,
            "reIssuanceId": null,
            "servicesName1": null,
            "trnLoiServiceChargesDao": null,
            "firstName": null,
            "middleName": null,
            "lastName": null,
            "licenseNo": null,
            "receiptNo": null,
            "receiptDate": null,
            "paymentMode1": null,
            "paymentType2": null,
            "date": null,
            "time": null,
            "flourMill": null,
            "NoflourMill": null,
            "storeKey": null,
            "businessKey": 48,
            "loiNo": "LCL14072023SSLM0000000000",
            "noflourMill": null
        },
        "trnPartnerDao": [
            {
                "id": 431,
                "trnapplicantKey": null,
                "trnindustrykey": null,
                "businessKey": 48,
                "storeKey": null,
                "title": null,
                "pttitle": 1,
                "ptfname": "Rahul",
                "ptfname_mr": null,
                "ptmname": "M",
                "ptmname_mr": null,
                "ptlname": "Jadhav",
                "ptlname_mr": null,
                "ptgender": 1,
                "ptdateOfBirth": null,
                "ptage": null,
                "ptmobile": "9096811399",
                "ptaadharNo": null,
                "ptemail": "g@gmail.com",
                "ptcrPropertyTaxNumber": null,
                "ptroadName": "Test",
                "ptvillage": "Pimpri ",
                "ptcity": "Pimpri ",
                "ptpincode": "411018",
                "ptPropertyTaxNumber": "0123010312",
                "partnerCheckBox": true
            }
        ],
        "trnPaymentCollectionDao": {
            "id": 162,
            "applicantId": null,
            "loiId": 388,
            "paymentType": "Offline ",
            "paymentMode": "CASH",
            "receiptDate": "2023-07-14",
            "receiptNo": "RCPT14072023SSLM0000000162",
            "receiptAmount": null,
            "dDDate": null,
            "dDNo": null,
            "bankAccountNo": null,
            "bankName": null,
            "activeFlag": "Y",
            "trnLoiDao": null,
            "businessKey": 48,
            "dddate": null,
            "ddno": null
        },
        "addressCheckBox": true,
        "rawsiteviewermap": "/var/pcmcerp/sslm/Issuanceofindustrylic/14_07_2023_15_32_40__S Disability Certificate.png"
    }

    return (

        <Paper >
            <div>
                <center>
                    <h1> Certificate</h1>
                </center>
            </div>

            <ComponentToPrint ref={componentRef} dataa={tempObj} />
            <div style={{ padding: 10, display: "flex", justifyContent: "space-evenly", marginTop: "5vh" }}>
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
                            title: 'Exit?',
                            text: 'Are you sure you want to exit this Record ? ',
                            icon: 'warning',
                            buttons: true,
                            dangerMode: true,
                        }).then((willDelete) => {
                            if (willDelete) {
                                swal('Record is Successfully Exit!', {
                                    icon: 'success',
                                })

                                if (router?.query?.citizenView) {
                                    router.push(
                                        '/dashboard',
                                    )
                                }
                                else {
                                    router.push(
                                        '/skySignLicense/transactions/issuanceOfBusinessOrIndustry/scrutiny',
                                    )
                                }
                            } else {
                                swal('Record is Safe')
                            }
                        })
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
            <>
                <Paper sx={{ padding: "5vh" }}>


                    <table className={styles.data}>

                        {/** 1st tr */}
                        <tr  >
                            <td colSpan={4} className={styles.img11}>
                                <img
                                    src="/logo.png"
                                    alt="Maharashtra Logo"
                                    // height={200}
                                    // width={200}
                                    className={styles.mahlogo}
                                ></img>
                            </td>

                            <td colSpan={12} className={styles.h11s}>
                                {/** Table2 */}
                                <table className={styles.table2}>

                                    <tr>
                                        <td className={styles.textAlign}>
                                            <b>पिंपरी चिंचवड महानगरपालिका</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={styles.textAlign}>
                                            <b>मुख्य कार्यालय, पिंपरी ४११ ०१८</b>
                                        </td>

                                    </tr>
                                    <tr>
                                        <td className={styles.textAlign} >
                                            <b>आकाशचिन्ह व परवाना विभाग</b>
                                        </td>
                                    </tr>
                                    <tr>  <td className={styles.textAlign}>
                                        <b>व्यवसाय परवाना</b>
                                    </td>
                                    </tr>
                                    <tr>
                                        <td className={styles.textAlign}>
                                            <b>(नवीन)</b>
                                        </td>
                                    </tr>
                                </table>


                            </td>


                            <td colSpan={4} className={styles.img22}>
                                <img
                                    src="/rts_servicelogo.png"
                                    alt="Maharashtra Logo"
                                    // height={197}
                                    // width={197}
                                    className={styles.servicelogo}
                                ></img>
                            </td>

                        </tr>

                        {/** 2nd tr tr */}
                        <tr >
                            <td colSpan={20} className={styles.tr2}>
                                <span className={styles.headings}>
                                    (मुंबई प्रांतिक मनपा अधिनियम १९४९ चे कलम ३७६ व
                                    उपविधी अन्वये)
                                </span>
                            </td>
                        </tr>

                        {/** 3rd tr tr */}
                        <tr >
                            <td colSpan={20} className={styles.tr2}>
                                <span className={styles.headings}>
                                    (नागरी व प्रशासकीय सेवेसाठी ISO 9001 : 2008
                                    प्रमाणपत्र प्राप्त संस्था )
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={12} className={styles.row444}>
                                <b>परवाना क्रमांक :-&nbsp;{this?.props?.dataa?.trnLicenseDao.licenseNo}</b>
                            </td>
                            <td colSpan={8} className={styles.row445}>
                                <b>token no :-&nbsp;aala</b>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={12} className={styles.row444}>
                                <b> परवाना दिनांक :-&nbsp;{moment(this?.props?.dataa?.trnLicenseDao.licenseDate).format('DD-MM-YYYY')} </b>
                            </td>
                            <td colSpan={8} className={styles.row445}>
                                <b>token दिनांक :-&nbsp;aala</b>
                            </td>
                        </tr>
                    </table>


                </Paper >


            </>
        );
    }
}


export default IndustryCertificateReport;
