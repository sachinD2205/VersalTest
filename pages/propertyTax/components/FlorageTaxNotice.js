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
import FlorageTaxNoticeCSS from "./FlorageTaxNotice.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Author - Sachin Durge */
// FlorageTaxNotice
//! http://localhost:4000/propertyTax/components/FlorageTaxNotice
const FlorageTaxNotice = () => {
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
        <Paper elevation={0} className={FlorageTaxNoticeCSS.Paper}>
          {/**Stack */}
          <Stack
            spacing={5}
            direction="row"
            className={FlorageTaxNoticeCSS.Stack}
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
          <div className={FlorageTaxNoticeCSS.ComponentToPrint}>
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
      <table className={FlorageTaxNoticeCSS.Table}>
        {/** Headings */}
        <tr >
          <td colSpan={24} className={FlorageTaxNoticeCSS.Header}>
            <div className={FlorageTaxNoticeCSS.Header11} >
              <div><img src={`/logo.png`} alt="PCMC LOGO" className={FlorageTaxNoticeCSS.PcmcLogo} />  </div>
              <div className={FlorageTaxNoticeCSS.HeaderDIV2}>
                <div className={FlorageTaxNoticeCSS.HeaderDIV3}>
                  <div className={FlorageTaxNoticeCSS.MHeader1}> पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८ </div>
                  <div className={FlorageTaxNoticeCSS.MHeader2}>कर आकारणी व करसंकलन विभाग  </div>
                  <div className={FlorageTaxNoticeCSS.MHeader3}>( महाराष्ट्र महानगरपालिका अधिनियम प्रकरण 8 नियम 20 (2) / 15 (2) अन्वये ) </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.hrLineHeadingBelow}></td>
        </tr>
        {/** Heading End */}
        <tr>
          <td colSpan={8} className={FlorageTaxNoticeCSS.Kramank}>क्रमांक - कर / / </td>
          <td colSpan={8} className={FlorageTaxNoticeCSS.kavi}>कावि / /२० </td>
          <td colSpan={8} className={FlorageTaxNoticeCSS.Dinak}>दिनांक - / / </td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.FlorageNoticeHeader}>
            फ्लोरेज कर नोटीस
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.Prati}>प्रति, ___________________________</td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.Shree}>
            श्री. / श्रीमती / मे. __________________________
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.Pata}>पत्ता __________________________</td>
        </tr>

        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.Paragraph1}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; महाराष्ट्र शासनाकडील नगर विकास विभागाकडील अधिसुचना क्र. आरपीटी /१०८८ /१८४ / युडी-२० अन्वये महाराष्ट्र (मोठया निवासी जागा असलेल्या ) इमारती वरील कर (पुन्हा अधिनियम करणे) नियमावली १९७९ हा कायदा पिंपरी चिंचवड महानगरपालिका हद्दीतील इमारतींना लागु केलेला आहे. या कायदया प्रमाणे मोठया निवासी जागांना त्यांच्या करयोग्य मुल्याच्या १०% कर फ्लोरेजकर म्हणून लावणेची तरतूद आहे. महाराष्ट्र शासनाची वरील अधिसुचना महाराष्ट्रशासन राजपत्र असाधारण सोमवार दि. ३१ जुलै १९८९ मध्ये भाग चार ब मध्ये प्रसिद्ध करण्यात आलेली आहे..
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.Paragraph11}>
            <strong>आपणांस महाराष्ट्र</strong> २० अन्वये महाराष्ट्र (मोठया निवासी जागा असलेल्या ) इमारती वरील कर (पुन्हा अधिनियम करणे) नियमावली १९७९ नियम ३ अन्वये नोटीस देण्यात येत आहे. आपली मालमत्ता पिंपरी ‍चिंचवड महानगरपालिका हद्दीमध्ये ……………… विभागीय कार्यालय, गट क्रमांक ……… येथे असुन त्या मालमत्ते चा वापर आपण स्वत:चे निवासासाठी करीत आहात व या वापरात असलेल्या इमारतीचे तळक्षेत्र १५० चौ. मी.  म्हणजे १६१५ चौ. फुटापेक्षा जास्त आहे व तिचे करयोग्य मुल्य १५००/- पेक्षा जास्त आहे, म्हणूनही इमारत या कायद्यानुसार फ्लोरेज करास प्राप्त झाली आहे अशा करास प्राप्त असलेली इमारतींचे कर निर्धारण यादी तयार केली असुन सदर मालमत्ते वर दि.     /   /२०२.. साला पासून कराची आकारणी करणेकामी तुमचे मालमत्ते चे खालील प्रमाणे / यापुर्वीचे करयोग्य मुल्यासह या करा करीता ठरविलेले आहे. सदर करयोग्यमुल्य ठरवितांना महाराष्ट्र महानगरपालिका अधिनियमातील अनुसुची प्रकरण ८ कराधान नियम ७ प्रमाणे काढलेले आहे.
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.Paragraph12}>
            <table className={FlorageTaxNoticeCSS.InnerTable}>
              <tr>
                <th colSpan={4} className={`${FlorageTaxNoticeCSS.InnerTableTh} ${FlorageTaxNoticeCSS.InnerTableThh}`}>उपविभाग</th>
                <th colSpan={4} className={`${FlorageTaxNoticeCSS.InnerTableTh} ${FlorageTaxNoticeCSS.InnerTableThh}`}>सि.स.नं.</th>
                <th colSpan={4} className={`${FlorageTaxNoticeCSS.InnerTableTh} ${FlorageTaxNoticeCSS.InnerTableThh}`}>गट क्रमांक</th>
                <th colSpan={4} className={`${FlorageTaxNoticeCSS.InnerTableTh} ${FlorageTaxNoticeCSS.InnerTableThh}`}>निवासी वापरा खालील क्षेत्र चौ.मी./चौ.फु.</th>
                <th colSpan={4} className={`${FlorageTaxNoticeCSS.InnerTableTh} ${FlorageTaxNoticeCSS.InnerTableThh}`}>करयोग्य मुल्य</th>
                <th colSpan={4} className={`${FlorageTaxNoticeCSS.InnerTableTh} ${FlorageTaxNoticeCSS.InnerTableThh}`}>फ्लोरेजकर एकुण करयोग्य मुल्याचे १०%</th>
              </tr>
              <tr className={FlorageTaxNoticeCSS.InnerTableTrContent}>
                <td colSpan={4} className={FlorageTaxNoticeCSS.InnerTableTr}></td>
                <td colSpan={4} className={FlorageTaxNoticeCSS.InnerTableTr}></td>
                <td colSpan={4} className={FlorageTaxNoticeCSS.InnerTableTr}></td>
                <td colSpan={4} className={FlorageTaxNoticeCSS.InnerTableTr}></td>
                <td colSpan={4} className={FlorageTaxNoticeCSS.InnerTableTr}></td>
                <td colSpan={4} className={FlorageTaxNoticeCSS.InnerTableTr}></td>
              </tr>

            </table>

          </td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.Paragraph111}>
            <strong>सबब,</strong> सदरची इमारत ही उक्त कायदयातील तरतुदी प्रमाणे फ्लोरेजकरास प्राप्त झालेली आहे. या इमारतीचे करयोग्य मुल्यावर प्रतिवर्ष १०% जादा दराने कर आकारण्यात येणार आहे. याबाबत अथवा करनिर्धारण यादीमधील नोंदी बाबत आपली काही हरकत अगर तक्रार असेल तर ती लेखी कारणासह मा. सहाय्यक आयुक्त, करसंकलन विभाग, पिंपरी चिंचवड महानगरपालिका, पिंपरी-१८ यांच्या नावे महानगरपालिकेचे………...…… विभागीय कार्यालय येथे दि.   /     /२०.. रोजी दुपारी ०३.०० वाजेपर्यंत मिळेल अशा रितीने पोष्टाने अथवा समक्ष दाखल करावी व पाहोच घ्यावी. सदर मुदतीत दु. ०३.०० वाजेनंतर आलेल्या किंवा योग्य कारणे न देता आलेल्या हरकती किंवा अर्जाचा विचार केला जाणार नाही. तसेच मुदतीत हरकत अगर तक्रार न आल्यास सदर चा कर बसविल्याबद्दल आपली काहीही हरकत नाही, असे समजुन ते कायम केले जाईल.  मालमत्तेच्या वार्षिक भाडयाबाबत, करयोग्य मुल्याबाबत, निवासी वापरा बाबत तळक्षेत्राबाबत किंवा इतर नोंदीचा तपशील …………………  विभागीय कार्यालय येथे सुट्टीचे दिवस सोडून कार्यालयीन वेळेत सकाळी ११.०० ते दुपारी ३.०० वा. पर्यंत पहावयास मिळेल.

          </td>
        </tr>

        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.SahyakMandalAdhikari}>प्रशासन अधिकारी (करसंकलन)</td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.VibhagiyKarayalay}>करसंकलन विभागीय कार्यालय</td>
        </tr>
        <tr>
          <td colSpan={24} className={FlorageTaxNoticeCSS.Pimpari}>पिंपरी चिंचवड महानगरपालिका, पिंपरी - १८.</td>
        </tr>
      </table >
    );
  }
}

export default FlorageTaxNotice;
