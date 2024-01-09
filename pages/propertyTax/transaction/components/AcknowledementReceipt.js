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
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { useForm, useFormContext } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

// Index
const Index = () => {
  const userToken = useGetToken();
  const language = useSelector((state) => state?.labels?.language);
  const [propertyRegistractionId, setPropertyRegistractionId] = useState(null);
  const [acknowledgementReceipt, setAcknowledgementReceipt] = useState();
  const [serviceNames, setServiceNames] = useState([])
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
  } = useFormContext();

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


  const getserviceNames = () => {
    const url = `${urls.CFCURL}/master/service/getAll`;
    axios.get(url, {
      headers: {
        Authorization: `Bearer ${userToken}`,
        Accept: `application/json`,
      },
    }).then((r) => {
      setServiceNames(
        r?.data?.service?.map((row) => ({
          id: row?.id,
          serviceNameEng: row?.serviceName,
          serviceNameMr: row?.serviceNameMr,
        }))
      );
    }).catch((error) => {
      console.log("324234234324", error)
      setValue("loadderState", false);
      callCatchMethod(error, language);
    });;
  };



  // getHawkerData
  const getAcknowldgementReciptData = () => {
    setValue("loadderState", true);




    // property Registration
    if (propertyRegistractionId) {
      const url = `${urls.PTAXURL}/transaction/property/getById`;
      const finalBodyForApi = {
        id: propertyRegistractionId
      }

      getAcknowldgementReciptDataGetById(url, finalBodyForApi)
    } else {
      setValue("loadderState", false);
    }



  };

  const getAcknowldgementReciptDataGetById = (url, finalBodyForApi) => {
    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: `application/json`,
        },
      })
      .then((r) => {
        setValue("loadderState", false);
        if (r.status == 200 || r.status == 201) {
          if (typeof r?.data == "object" && r?.data != undefined) {
            let serviceNamerMr = "";
            let serviceNameEng = "";
            console.log("serviceNames23432", serviceNames)
            if (serviceNames != undefined && serviceNames != null && serviceNames != " " && serviceNames?.length >= 1) {
              serviceNamerMr = serviceNames?.find((data) => data?.id == r?.data?.serviceId)?.serviceNameMr;
              serviceNameEng = serviceNames?.find((data) => data?.id == r?.data?.serviceId).serviceNameEng;
            }

            const applicantData = {
              applicantEmaiId: r?.data?.applicantEmaiId,
              applicantFullNameEng: r?.data?.applicantFullNameEng,
              applicantFullNameMr: r?.data?.applicantFullNameMr,
              applicantMobileNumber: r?.data?.applicantMobileNumber,
              applicationNo: r?.data?.applicationNo,
              serviceId: r?.data?.serviceId,
              serviceNamerMr: serviceNamerMr,
              serviceNameEng: serviceNameEng,
            }
            setAcknowledgementReceipt(applicantData);
            setValue("loadderState", false);
          }
        }
      })
      .catch((error) => {
        console.log("ddsf32432rdf", error)
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  }

  //! useEffects ================>

  // idSet
  useEffect(() => {
    setValue("loadderState", true);
    getserviceNames();

    let propertyRegistractionId = localStorage.getItem("propertyRegistractionId");

    // property Registraction
    if (propertyRegistractionId) {
      setPropertyRegistractionId(propertyRegistractionId);
    } else {
      setValue("loadderState", false);
    }

  }, []);

  // api
  useEffect(() => {

    setValue("loadderState", true);
    const propertyRegistractionIdTrueFalse = propertyRegistractionId != null && propertyRegistractionId != undefined && propertyRegistractionId != "";
    const serviceIdTrueFalse = serviceNames != null && serviceNames != undefined && serviceNames != "" && serviceNames.length >= 1;



    if (propertyRegistractionIdTrueFalse && serviceIdTrueFalse) {
      getAcknowldgementReciptData();
    } else {
      setValue("loadderState", false);
    }
  }, [
    propertyRegistractionId, serviceNames
  ]);
  useEffect(() => {
    console.log("acknowledgementReceipt", acknowledgementReceipt)
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
              <Button
                variant="contained"
                type="button"
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
                  {this?.props?.acknowledgementReceipt?.applicationNo}
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
                  {this?.props?.acknowledgementReceipt?.serviceNamerMr}
                </Grid>

                {/** Fourth Row */}
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>अर्जादाराचे नाव :</b>
                  {this?.props?.acknowledgementReceipt?.applicantFullNameMr}
                  {/* <b>अर्जादाराचे नाव :</b> {this?.props?.acknowledgementReceipt?.applicantFullNameEng} */}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>ई - मेल आयडी : </b>{" "}
                  {this?.props?.acknowledgementReceipt?.applicantEmaiId}
                </Grid>
                <Grid item sx={6} sm={6} md={6} lg={6} xl={6}>
                  <b>मोबाईल नंबर : </b>{" "}
                  {this?.props?.acknowledgementReceipt?.applicantMobileNumber}
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
                    {this?.props?.acknowledgementReceipt?.pplicantFullNameMr}
                  </b>
                </h4>
                <h4>
                  <b>
                    आपण दिलेल्या अर्जाची नोंदणी आम्ही घेतली आहे.आपला अर्ज
                    क्रमांक{" "}
                    <b>
                      ({this?.props?.acknowledgementReceipt?.applicationNo})
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
