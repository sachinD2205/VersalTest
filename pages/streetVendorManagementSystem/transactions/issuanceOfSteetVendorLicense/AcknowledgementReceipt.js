// "use client";
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, Paper, Stack } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { useForm } from "react-hook-form";

// Index
const Index = () => {
  const userToken = useGetToken();
  const language = useSelector((state) => state?.labels?.language);
  const [loadderState, setLoadderState] = useState(false);
  const [issuanceOfHawkerLicenseId, setIssuanceOfHawkerLicenseId] = useState();
  const [renewalOfHawkerLicenseId, setRenewalOfHawkerLicenseId] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
    useState();
  const [transferOfHawkerLicenseId, setTransferOfHawkerLicenseId] = useState();
  const [acknowledgementReceipt, setAcknowledgementReceipt] = useState();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
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
  let loggedInUser = localStorage.getItem("loggedInUser");
  //! callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  // getHawkerData
  const getHawkerLicneseData = () => {
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
          Accept: `application/json`,
        },
      })
      .then((r) => {
        setValue("loadderState", false);
        if (r.status == 200 || r.status == 201) {
          if (typeof r?.data == "object" && r?.data != undefined) {
            setAcknowledgementReceipt(r?.data);
          }
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  //! useEffects ================>

  // idSet
  useEffect(() => {
    setValue("loadderState", true);
    // issuance
    if (
      localStorage.getItem("issuanceOfHawkerLicenseId") != null &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != "" &&
      localStorage.getItem("issuanceOfHawkerLicenseId") != undefined
    ) {
      setLoadderState(true);
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
      setLoadderState(true);
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
      setLoadderState(true);
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
      setLoadderState(true);
      setTransferOfHawkerLicenseId(
        localStorage.getItem("transferOfHawkerLicenseId")
      );
    } else {
      setValue("loadderState", false);
    }
  }, []);

  // api
  useEffect(() => {
    getHawkerLicneseData();
  }, [
    issuanceOfHawkerLicenseId,
    renewalOfHawkerLicenseId,
    cancellationOfHawkerLicenseId,
    transferOfHawkerLicenseId,
  ]);
  useEffect(() => {
  }, [acknowledgementReceipt]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper
            style={{
              margin: "50px",
            }}
          >
            <div>
              <br />
              <br />
              <center>
                <h1>अर्जाची पावती / पोहोच पावती</h1>
              </center>
            </div>
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
              <Button
                variant="contained"
                type="button"
                color="primary"
                style={{ float: "right" }}
                onClick={handlePrint}
              >
                {<FormattedLabel id="print" />}
              </Button>
            </Stack>
            <ComponentToPrint
              ref={componentRef}
              acknowledgementReceipt={acknowledgementReceipt}
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

    // return
    return (
      <div>
        <Paper
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
                  <b>अर्जाची पावती / पोहोच पावती</b>
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
                  marginLeft: "10vw",
                  marginTop: "30px",
                  marginBottom: "10px",
                }}
              >
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्ज क्र :</b>{" "}
                  {this?.props?.acknowledgementReceipt?.applicationNumber}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>दिनांक :</b>{" "}
                  {moment(
                    this?.props?.acknowledgementReceipt?.applicationDate
                  ).format("DD-MM-YYYY")}
                </Grid>
                {/** Third Row */}

                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>विषय :</b>{" "}
                  {this?.props?.acknowledgementReceipt?.serviceNameMr}
                </Grid>

                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्जादाराचे नाव :</b>
                  {this?.props?.acknowledgementReceipt?.firstNameMr +
                    " " +
                    this?.props?.acknowledgementReceipt?.middleNameMr +
                    " " +
                    this?.props?.acknowledgementReceipt?.lastNameMr}
                  {/* <b>अर्जादाराचे नाव :</b> {this?.props?.acknowledgementReceipt?.applicantName} */}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>ई - मेल आयडी : </b>{" "}
                  {this?.props?.acknowledgementReceipt?.emailAddress}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>मोबाईल नंबर : </b>{" "}
                  {this?.props?.acknowledgementReceipt?.mobile}
                </Grid>
              </Grid>
              {/** New Row */}
              <br />
              <div
                style={{ margin: "10px", marginLeft: "40px", padding: "10px" }}
              >
                <h4>
                  महोदय,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <b>
                    {" "}
                    {this?.props?.acknowledgementReceipt?.firstNameMr +
                      " " +
                      this?.props?.acknowledgementReceipt?.middleNameMr +
                      " " +
                      this?.props?.acknowledgementReceipt?.lastNameMr}
                  </b>
                </h4>
                <h4>
                  <b>
                    आपण दिलेल्या अर्जाची नोंदणी आम्ही घेतली आहे.आपला अर्ज
                    क्रमांक{" "}
                    <b>
                      {" "}
                      ({this?.props?.acknowledgementReceipt?.applicationNumber})
                    </b>{" "}
                    आहे. आपण दिलेले काम अंदाजे <b>दि. &nbsp;</b>
                    पर्यंत पूर्ण होणे अपेक्षित आहे. आपल्या अर्जावर तपासणी करून
                    आपणांस त्याबाबत लवकरच SMS द्वारे कळविण्यात येईल.
                  </b>
                </h4>
                <br />
              </div>

              <div
                style={{
                  margin: "10px",
                  marginLeft: "500px",
                  padding: "10px",
                }}
              >
                <h4>
                  <b>सही </b>
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

export default Index;
