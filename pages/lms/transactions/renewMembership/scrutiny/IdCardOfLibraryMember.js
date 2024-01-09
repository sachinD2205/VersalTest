import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
//
// import urls from "../../../../URLS/urls";
import urls from "../../../../../URLS/urls";
import { useRouter } from "next/router";
import Loader from "../../../../../containers/Layout/components/Loader";
// import styles from "../../../../components/streetVendorManagementSystem/styles/issuanceOfStreetVendorLicenseCertificate.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import swal from "sweetalert";
import LmsHeader from "../../../../../components/lms/lmsHeader";
import { useSelector } from "react-redux";
/** Authore - Sachin Durge */
// Identity
const IdCardOfLibraryMember = (props) => {
  const componentRef = useRef();
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const router = useRouter();
  const [iCardData, setICardData] = useState();
  const [loadderState, setLoadderState] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [libraryList, setLibraryList] = useState([]);
  const language = useSelector((state) => state?.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [libraryName, setLibraryName] = useState();
  const getICardData = () => {
    setLoadderState(true);
    let Id;
    if (router?.query?.id) {
      Id = router?.query?.id;
    } else if (props?.id) {
      Id = props?.id;
    }
    axios
      .get(`${urls.LMSURL}/trnRenewalOfMembership/getById?id=${Id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        if (
          r?.status == 200 ||
          res?.status == 201 ||
          res?.status == "SUCCESS"
        ) {
          setICardData(r?.data);
          setLoadderState(false);
          setLibraryName(
            libraryList?.find((library) => r.data.libraryKey == library.id)
          );
          console.log(
            "library123",
            libraryList?.find((library) => r.data.libraryKey == library.id)
          );
        } else {
          //
          setLoadderState(false);
        }
      })
      .catch(() => {
        //
        setLoadderState(false);
      });
  };

  useEffect(() => {
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null ||
      localStorage.getItem("issuanceOfHawkerLicenseId") != ""
    ) {
      setIssuanceOfHawkerLicenseId(
        localStorage.getItem("issuanceOfHawkerLicenseId")
      );
    }

    getLibraryList();
  }, []);

  useEffect(() => {
    console.log("issuanceOfHawkerLicenseId", issuanceOfHawkerLicenseId);
    getICardData();
  }, [libraryList]);

  useEffect(() => {
    console.log("iCardData", iCardData);
  }, [iCardData, libraryName]);

  const getLibraryList = () => {
    axios
      // .get(
      //   `${urls.CFCURL
      //   }/master/servicecharges/getByServiceId?serviceId=${getValues(
      //     'serviceId',
      //   )}`,
      // )
      .get(`${urls.LMSURL}/libraryMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setLibraryList(r.data?.libraryMasterList);
      });
  };

  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper
            style={{
              margin: "50px",
            }}
          >
            <LmsHeader
              language={language}
              enName="Library card"
              mrName="लायब्ररी कार्ड"
            />
            <Stack
              direction="row"
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "10px",
              }}
            >
              <Button
                size="small"
                variant="contained"
                type="primary"
                style={{ float: "right" }}
                onClick={() => handlePrint()}
              >
                {<FormattedLabel id="print" />}
              </Button>
              <Button
                size="small"
                onClick={() => {
                  swal({
                    title: language == "en" ? "Exit?" : "बाहेर पडा?",
                    text:
                      language == "en"
                        ? "Are you sure you want to exit this Record?"
                        : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                  }).then((willDelete) => {
                    if (willDelete) {
                      swal(
                        language == "en"
                          ? "Record is Successfully Exited!"
                          : "रेकॉर्डमधून यशस्वीरित्या बाहेर पडले",
                        {
                          icon: "success",
                        }
                      );
                      if (router.query.applicationSide == "Citizen") {
                        router.push({
                          pathname: `/dashboard`,
                        });
                      } else {
                        router.push(
                          "/lms/transactions/renewMembership/scrutiny"
                        );
                      }
                    } else {
                      swal(
                        language == "en"
                          ? "Record is Safe"
                          : "रेकॉर्ड सुरक्षित आहे"
                      );
                    }
                  });
                }}
                type="button"
                variant="contained"
                color="primary"
              >
                {<FormattedLabel id="back" />}
              </Button>
            </Stack>

            <ComponentToPrint
              ref={componentRef}
              iCardData={iCardData}
              libraryName={libraryName}
            />
          </Paper>
        </div>
      )}
    </>
  );
};

// ComponentToPrint - ClassComonent
class ComponentToPrint extends React.Component {
  render() {
    // View
    return (
      <div>
        <Paper
          // style={{
          //   margin: "50px",
          // }}
          elevation={0}
          sx={{
            paddingRight: "75px",
            marginTop: "50px",
            paddingLeft: "30px",
            paddingBottom: "50px",
            height: "1000px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "700px",
                border: "2px solid black",
                paddingLeft: "20px",
                paddingRight: "20px",
                // padding: "20px",
              }}
            >
              {/** First Row */}
              <div
                style={{
                  marginTop: "50px",
                  display: "flex",
                  justifyContent: "space-around",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Image
                    src="/logo.png"
                    alt="PCMC Logo"
                    height={100}
                    width={100}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h2>
                    <b>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</b>
                  </h2>
                  <h3>
                    <b>लायब्ररी कार्ड</b>
                  </h3>
                </div>
                <div className="col-md-7">
                  <Image
                    src="/barcode.jpg"
                    alt="Barcode Logo"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
              <table
                style={{
                  width: "100%",
                  marginTop: "75px",
                  marginLeft: "20px",
                  marginRight: "20px",
                  marginBottom: "20px",
                  // border: "2px solid red",
                }}
              >
                {/**1 */}
                <tr>
                  <td
                    colSpan={30}
                    // style={{ border: "2px solid yellow" }}
                  >
                    <h3>
                      <b>सदस्यत्व क्रमांक: </b>&nbsp;{" "}
                      {this?.props?.iCardData?.membershipNo}
                    </h3>
                  </td>

                  <td
                    colSpan={10}
                    rowSpan={3}
                    style={{
                      // border: "2px solid pink",
                      display: "table-cell",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        marginRight: "2vh",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.iCardData?.photoAttachment}`}
                        alt="Library Member Photo"
                        width={150}
                      ></img>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>ग्रंथालयाचे नाव : </b>&nbsp;
                      {this?.props?.libraryName?.libraryName}
                    </h3>
                  </td>
                </tr>

                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>सदस्यत्व नावं : </b>&nbsp;
                      {this?.props?.iCardData?.applicantNameMr}
                    </h3>
                  </td>
                </tr>
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>सदस्यत्व सुरू होण्याची तारीख :&nbsp;</b>{" "}
                      {moment(this?.props?.iCardData?.startDate).format(
                        "DD-MM-YYYY"
                      )}
                    </h3>
                  </td>
                </tr>
                {/**4 */}
                <tr>
                  <td colSpan={30}>
                    <h3>
                      <b>सदस्यत्व समाप्ती तारीख :&nbsp;</b>{" "}
                      {moment(this?.props?.iCardData?.endDate).format(
                        "DD-MM-YYYY"
                      )}
                    </h3>
                  </td>
                </tr>
                {/**5 */}

                {/**10 */}
                <tr>
                  <td colSpan={30}>
                    <h3>{/* <b>वैधता (पर्यंत) :&nbsp; </b> */}</h3>
                  </td>
                  <td
                    style={{
                      // border: "2px solid pink",
                      display: "table-cell",
                    }}
                  >
                    <h3
                      style={{
                        marginRight: "20px",
                        marginTop: "10vh",
                        //   border: "2px solid pink",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <b>ग्रंथपाल स्वाक्षरी </b>
                    </h3>
                  </td>
                </tr>
                {/**11*/}
              </table>
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default IdCardOfLibraryMember;
