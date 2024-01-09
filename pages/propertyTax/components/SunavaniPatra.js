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
import SunavaniPatraCSS from "./SunavaniPatra.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Author - Sachin Durge */
// SunavaniPatra
//! http://localhost:4000/propertyTax/components/SunavaniPatra
const SunavaniPatra = () => {
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
        <Paper elevation={0} className={SunavaniPatraCSS.Paper}>
          {/**Stack */}
          <Stack
            spacing={5}
            direction="row"
            className={SunavaniPatraCSS.Stack}
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
          <div className={SunavaniPatraCSS.ComponentToPrint}>
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
      <table className={SunavaniPatraCSS.Table}>
        {/** Headings */}
        <tr >
          <td colSpan={24} className={SunavaniPatraCSS.Header}>
            <div className={SunavaniPatraCSS.Header11} >
              <div><img src={`/logo.png`} alt="PCMC LOGO" className={SunavaniPatraCSS.PcmcLogo} />  </div>
              <div className={SunavaniPatraCSS.HeaderDIV2}>
                <div className={SunavaniPatraCSS.HeaderDIV3}>
                  <div className={SunavaniPatraCSS.MHeader1}> पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८ </div>
                  <div className={SunavaniPatraCSS.MHeader2}>कर आकारणी व करसंकलन विभाग  </div>
                  <div className={SunavaniPatraCSS.MHeader3}><strong>दुरध्वनी क्रमांक :</strong> 020 67331545  &nbsp;&nbsp;&nbsp;&nbsp;   <strong>E-mail :</strong> ptax@pcmcindia.gov.in  </div>
                  <div className={SunavaniPatraCSS.MHeader3}> <strong>Website :</strong>www.pcmcindia.gov.in                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.hrLineHeadingBelow}></td>
        </tr>
        {/** Heading End */}
        <tr>
          <td colSpan={8} className={SunavaniPatraCSS.Kramank}>क्रमांक - कर / / </td>
          <td colSpan={8} className={SunavaniPatraCSS.kavi}>कावि / /२० </td>
          <td colSpan={8} className={SunavaniPatraCSS.Dinak}>दिनांक - / / </td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.FlorageNoticeHeader}>
            सुनावणी पत्र
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Prati}>प्रति, ___________________________</td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Shree}>
            श्री. / श्रीमती / मे. __________________________
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Pata}>पत्ता __________________________</td>
        </tr>

        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Subject1}><strong>विषय :</strong>&nbsp;मालमत्ता कर आकारणीबाबत करयोग्य मुल्य  ररू. - ------------------- च्या विरूदध दिनांक    /    / 2022 रोजी दाखल झालेल्या हरकत अर्जाची सुनावणी.
          </td>

        </tr>




        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Paragraph1}>
            &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;<strong>संदर्भ :</strong> पिंपरी चिंचवड महानगरपालिका हद्दीतील -------------------------- विभागीय कार्यालयाचे कार्यक्षेत्रातील आपल्या -------------------------- येथील मालमत्तेची कर आकारणी संदर्भात हरकत अर्जाची सुनावणी खालील प्रमाणे होणार आहे.

          </td>
        </tr>

        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Paragraph12}>
            <table className={SunavaniPatraCSS.InnerTable}>
              <tr>
                <th colSpan={4} className={`${SunavaniPatraCSS.InnerTableTh} ${SunavaniPatraCSS.InnerTableThh}`}>सुनावणी तारीख</th>
                <th colSpan={4} className={`${SunavaniPatraCSS.InnerTableTh} ${SunavaniPatraCSS.InnerTableThh}`}>वेळ</th>
                <th colSpan={4} className={`${SunavaniPatraCSS.InnerTableTh} ${SunavaniPatraCSS.InnerTableThh}`}>सुनावणीचे ठिकाण</th>
              </tr>
              <tr className={SunavaniPatraCSS.InnerTableTrContent}>
                <td colSpan={4} className={SunavaniPatraCSS.InnerTableTr}></td>
                <td colSpan={4} className={SunavaniPatraCSS.InnerTableTr}></td>
                <td colSpan={4} className={SunavaniPatraCSS.InnerTableTr}></td>
              </tr>

            </table>

          </td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Paragraph11}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; या सुनावणीस आपल्या वतीने कोणत्याही व्यक्तीस अधिकारपत्र दाखल करून हजर राहता येईल.मात्र आपण अगर आपले प्रतिनिधी गैरहजर राहिल्यास आपली काहीही तक्रार नाही असे समजून केस निकालात काढली जाईल.
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Paragraph1}>
            &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;<strong>सूचना :</strong>सुनावणीस येताना खालीलप्रमाणे पुराव्याची कागदपत्रे व हे पत्र बरोबर घेऊन यावे.</td>
        </tr>

        <tr>
          <td colSpan={24}>
            <ol>
              <li className={SunavaniPatraCSS.Li}>इमारत बांधली त्या जागेचा स.नं. / सि.स.नं. चा उतारा.</li>
              <li className={SunavaniPatraCSS.Li}>	भाडे पावत्या किंवा भाडे संबंधिचे करारनामे व भाडे संबंधीची इतर कागदपत्रे</li>
              <li className={SunavaniPatraCSS.Li}>	बांधकामाचा मंजुर केलेला नकाशा / नूतनीकरण अर्ज / भोगवटापत्रकाची प्रत.</li>
              <li className={SunavaniPatraCSS.Li}>	जागेची मालकी हक्काची कागदपत्रे.</li>
            </ol>
          </td>
        </tr>


        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Paragraph1}>
            &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;इतरही काही मालकी हक्काचे कागदपत्र असतील तर ती दाखल करावीत.</td>
        </tr>

        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.ParagraphBhava}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;महाराष्ट्र महानगरपालिका अधिनियम प्रकरण ८ (कराधान नियम) नियम ८ प्रमाणे कर आकारणीसाठी अचूक माहिती सादर करणे हे बंधनकारक असून माहिती सादर न केल्यास अथवा चुकीची सादर केल्यास उक्त नियमातील तरतुदीनुसार मालमत्ते वर एकतर्फी कर आकारणी करण्यात येईल व त्यानुसार मालमत्ता कराचे बिल बजावण्यात येईल, तसेच केलेल्या कर आकारणीस आक्षेप घेण्यास प्रतिबंध करण्यात येईल.
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.ParagraphBhava1}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp; मागणी केलेली कागदपत्र सादर न करणे किंवा योग्य माहिती सादर न करणे उक्त अधिनियमातील नियम ३९३ प्रमाणे तसेच भारतीय दंड संहितेच्या यथास्थिती कलम १७६ व १७७ अन्वये शिक्षापात्र अपराध केला आहे असे मानले जाईल, याची नोंद घ्यावी.
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Paragraph1}>
            &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;सबब उपरोक्त प्रमाणे प्रमाणित केलेली कागदपत्र सुनावणीचे वेळी सादर करावीत.</td>
        </tr>


        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.SahyakMandalAdhikari}>प्रशासन अधिकारी (करसंकलन)</td>
        </tr>
        <tr>
          <td colSpan={24} className={SunavaniPatraCSS.Pimpari}>पिंपरी चिंचवड महानगरपालिका, पिंपरी - १८.</td>
        </tr>
      </table >
    );
  }
}

export default SunavaniPatra;
