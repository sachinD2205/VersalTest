/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import PrintIcon from "@mui/icons-material/Print";
import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../URLS/urls";
import PropertyTaxShapeInformationCSS from "./propertyTaxShapeInformation.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Author - Sachin Durge */
// PropertyTaxShapeInformation
//! http://localhost:4000/propertyTax/components/PropertyTaxShapeInformation
const PropertyTaxShapeInformation = () => {
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
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [propertyTaxShapeInformationData, setPropertyTaxShapeInformationData] =
    useState();
  const [id, setId] = useState();

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

  // certificateData
  const getPropertyTaxShapeInformation = () => {
    setValue("loadderState", true);
    const url = `${urls.HMSURL}/hawkerLiscenseCertificate/getById?issuanceOfliscenseId=${id}`;

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
            setPropertyTaxShapeInformationData(r?.data);
          }
        }
        setValue("loadderState", false);
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // ! =========================> useEffects <===============

  // idSet
  useEffect(() => {
    setValue("loadderState", true);
    if (
      localStorage.getItem("id") != null &&
      localStorage.getItem("id") != "" &&
      localStorage.getItem("id") != undefined
    ) {
      setId(localStorage.getItem("id"));
    } else {
      setValue("loadderState", false);
    }
  }, []);

  // api
  useEffect(() => {
    if (id != null && id != undefined && id != "") {
      getPropertyTaxShapeInformation();
    }
  }, [id]);

  useEffect(() => {
    console.log(
      "propertyTaxShapeInformationData",
      propertyTaxShapeInformationData
    );
  }, [propertyTaxShapeInformationData]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <Paper elevation={0} className={PropertyTaxShapeInformationCSS.Paper}>
          {/**Stack */}
          <Stack
            spacing={5}
            direction="row"
            className={PropertyTaxShapeInformationCSS.Stack}
          >
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
                localStorage.removeItem("id");
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
          <div className={PropertyTaxShapeInformationCSS.ComponentToPrint}>
            <ComponentToPrint
              ref={componentRef}
              propertyTaxShapeInformationData={propertyTaxShapeInformationData}
              language={language}
            />
          </div>
        </Paper>
      )}
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends React.Component {
  // render
  render() {
    // Print_view;
    return (
      <table className={PropertyTaxShapeInformationCSS.Table}>
        {/** Headings */}
        <tr >
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.Header}>
            <div className={PropertyTaxShapeInformationCSS.Header11} >
              <div><img src={`/logo.png`} alt="PCMC LOGO" className={PropertyTaxShapeInformationCSS.PcmcLogo} />  </div>
              <div className={PropertyTaxShapeInformationCSS.HeaderDIV2}>
                <div className={PropertyTaxShapeInformationCSS.HeaderDIV3}>
                  <div className={PropertyTaxShapeInformationCSS.MHeader1}> पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८ </div>
                  <div className={PropertyTaxShapeInformationCSS.MHeader2}>कर आकारणी व करसंकलन विभाग  </div>
                  <div className={PropertyTaxShapeInformationCSS.MHeader3}>_____________________ विभाग  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.hrLineHeadingBelow}></td>
        </tr>
        {/** Heading End */}
        <tr>
          <td colSpan={8} className={PropertyTaxShapeInformationCSS.Kramank}>क्रमांक - कर / / </td>
          <td colSpan={8} className={PropertyTaxShapeInformationCSS.kavi}>कावि / /२० </td>
          <td colSpan={8} className={PropertyTaxShapeInformationCSS.Dinak}>दिनांक - / / </td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.Prati}>प्रति, ___________________________</td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.Shree}>
            श्री. / श्रीमती / मे. __________________________
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.Pata}>पत्ता __________________________</td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.Subject}>
            विषय - मिळकतकर आकारणीकामी माहिती / कागदपत्रे सादर करणेबाबत.{" "}
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.Paragraph1}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; तुम्हास या पत्राद्वारे कळविण्यात येते की मुंबई प्रांतिक
            महानगरपालिका अधिनियम १९४९ मधील अनुसूची 'ड' काराधान नियम प्रकरण ८
            नियम ८ अन्वये पिंपरी चिंचवड महानगरपालिका हद्दीतील तुमची
            _______________________ करसंकलन विभागीय कार्यालयाचे कार्यक्षेत्रात
            ______________________ येथे जी इमारत / जमिन आहे. त्यावर करआकारणी
            करणेकामी खालील माहिती / कागदपत्रांची आवश्यकता आहे.
          </td>
        </tr>
        <tr>
          <td colSpan={24}>
            <ol>
              <li className={PropertyTaxShapeInformationCSS.Li}> खरेदीखत, इंडेक्स २</li>
              <li className={PropertyTaxShapeInformationCSS.Li}> ७/१२ उतारा</li>
              <li className={PropertyTaxShapeInformationCSS.Li}> सर्व्हे नंबर / गट नंबर / सिटी सर्व्हे नंबरचा उतारा</li>
              <li className={PropertyTaxShapeInformationCSS.Li}>
                {" "}
                मिळकत MIDC किंवा पिंपरी चिंचवड नवनगर विकास प्राधिकरण किंवा
                पुणे गृहनिर्माण व क्षेत्र विकास मंडळ यांचेकडील असल्यास - प्लॉट
                / गाळा / ताबा पत्र, रजिस्टर्ड अॅग्रीमेंट.
              </li>
              <li className={PropertyTaxShapeInformationCSS.Li}>
                {" "}
                रजिस्टर्ड बक्षीसपत्र / वाटणी पत्र झाले असल्यास त्याची प्रत.
              </li>
              <li className={PropertyTaxShapeInformationCSS.Li}>
                {" "}
                इमारत / जमिनीचे मालकी हक्काबाबतची इतर अधिकृत / शासन नोंदणीकृत
                पुराव्याची कागदपत्रे
              </li>
              <li className={PropertyTaxShapeInformationCSS.Li}>
                {" "}
                इमारत बांधकाम परवनगी घेतली असेलस परवाना व मजूंर नकाशाची प्रत
              </li>
              <li className={PropertyTaxShapeInformationCSS.Li}> इमारत बांधकाम पूर्णत्वाचा दाखला</li>
              <li className={PropertyTaxShapeInformationCSS.Li}>
                {" "}
                इमारत बांधकाम पुर्णत्वासंबधी अधिकृत / शासन नोंदणीकृत
                पुराव्याची कागदपत्र
              </li>
              <li className={PropertyTaxShapeInformationCSS.Li}> मिळकतीचा कच्चा नकाशा चतुः सिमासह</li>
              <li className={PropertyTaxShapeInformationCSS.Li}></li>

              <li className={PropertyTaxShapeInformationCSS.Li}></li>
            </ol>
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.Paragraph2}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; वरीलप्रमाणे माहिती / कागदपत्रे _______________________ करसंकलन
            विभागीय कार्यालयात हे पत्र मिळालेपासून सात दिवसाचे आत कार्यालयीन
            वेळेत (सार्वजनिक व साप्ताहिक सुट्टीचे दिवस सोडून ) सकाळी १०.०० ते
            ०५.४५ पर्यंत समक्ष अगर पोस्टाने दाखल करावी. सादर केलेली माहिती /
            कागदपत्रे चुकीची सादर केली आहे असे निदर्शनास आलेस किंवा माहिती /
            कागदपत्रे देण्याचे कामी टाळाटाळ केली तर नियमानुसार कारवाई केली
            जाईल यांची कृपया नोंद घ्यावी.
          </td>
        </tr>

        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.SahyakMandalAdhikari}>प्रशासन अधिकारी (करसंकलन)</td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.VibhagiyKarayalay}>करसंकलन विभागीय कार्यालय</td>
        </tr>
        <tr>
          <td colSpan={24} className={PropertyTaxShapeInformationCSS.Pimpari}>पिंपरी चिंचवड महानगरपालिका, पिंपरी - १८.</td>
        </tr>
      </table >
    );
  }
}

export default PropertyTaxShapeInformation;
