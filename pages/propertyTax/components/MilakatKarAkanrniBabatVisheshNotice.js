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
import MilakatKarAkanrniBabatVisheshNoticeCSS from "./MilakatKarAkanrniBabatVisheshNotice.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Author - Sachin Durge */
// MilakatKarAkanrniBabatVisheshNotice
//! http://localhost:4000/propertyTax/components/MilakatKarAkanrniBabatVisheshNotice
const MilakatKarAkanrniBabatVisheshNotice = () => {
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
        <Paper elevation={0} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Paper}>
          {/**Stack */}
          <Stack
            spacing={5}
            direction="row"
            className={MilakatKarAkanrniBabatVisheshNoticeCSS.Stack}
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
          <div className={MilakatKarAkanrniBabatVisheshNoticeCSS.ComponentToPrint}>
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
      <table className={MilakatKarAkanrniBabatVisheshNoticeCSS.Table}>
        {/** Headings */}
        <tr >
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Header}>
            <div className={MilakatKarAkanrniBabatVisheshNoticeCSS.Header11} >
              <div><img src={`/logo.png`} alt="PCMC LOGO" className={MilakatKarAkanrniBabatVisheshNoticeCSS.PcmcLogo} />  </div>
              <div className={MilakatKarAkanrniBabatVisheshNoticeCSS.HeaderDIV2}>
                <div className={MilakatKarAkanrniBabatVisheshNoticeCSS.HeaderDIV3}>

                  <div className={MilakatKarAkanrniBabatVisheshNoticeCSS.MHeader1}> पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८ </div>

                  {/**
                  <div className={MilakatKarAkanrniBabatVisheshNoticeCSS.MHeader2}>कर आकारणी व करसंकलन विभाग  </div>
                */}

                  <div className={MilakatKarAkanrniBabatVisheshNoticeCSS.MHeader3}>( महाराष्ट्र (मुंबई प्रांतिक महानगरपालिका अधिनियम १९५९, प्रकरण ८ नियम २० (२) /१५ (२) अन्वये) </div>
                </div>
              </div>
            </div>
          </td>
        </tr>


        {/** Heading End*/}




        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.hrLineHeadingBelow}></td>
        </tr>
        {/** Heading End */}

        <tr>
          <td colSpan={8} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Kramank}>क्रमांक - कर   /    /     </td>
          <td colSpan={8} className={MilakatKarAkanrniBabatVisheshNoticeCSS.kavi}>कावि    /   /२०  </td>
          <td colSpan={8} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Dinak}>दिनांक -   /   / </td>
        </tr>



        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.FlorageNoticeHeader}>
            मिळकत कर आकारणी बाबत विशेष नोटीस
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Bandakaam}>
            (बांधकाम : अधिकृत/अनधिकृत/परवाना आहे, भोगवटापत्रक नाही/नवीन/वाढीव/वापरात बदल)
          </td>
        </tr>
        <tr>
          <td colSpan={20} ></td>
          <td colSpan={4} >
            {/** Second Table  */}
            <table >
              <tr >
                <td className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTable2Td}`}>गटाचा क्र. </td>
                <td className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTable2Td}`}> </td>
              </tr>
              <tr >
                <td className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTable2Td}`}>गटाचे नाव</td>
                <td className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTable2Td}`}></td>
              </tr>

            </table>
          </td>
        </tr>

        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Prati}>मालक : मे. /श्री./श्रीमती ___________________________</td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Shree}>
            भोगवटादार : मे. /श्री./श्रीमती  __________________________
          </td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Pata}>पत्ता :  ___________________________________________</td>
        </tr>

        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Paragraph1}>
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;आपणास मुंबई प्रांतिक महानगरपालिका अधिनियम १९४९, प्रकरण ८, नियम २० (२)/१५(२) अन्वये नोटीस देण्यात येते की, आपली पिंपरी चिंचवड महानगरपालिका  _____________  हदीतील  _______________ उपविभागात इमारत / जमीन असून सध्या अस्तित्वात असलेल्या कर निर्धारण यादीत नवीन / वाढीव इमारतीची / जमिनीची कर निर्धारण यादी तयार केली असून सदर मिळकतीवर सन __________  पासून कराची आकारणी करणेकामी तुमचे मिळकतीचे खालीलप्रमाणे कऱयोग्यमूल्य ठरविले आहे . करयोग्यमूल्य ठरविताना सदर मिळकतीपासून येणाऱ्या वार्षिक भाड्यांचे उत्पन्नातून मिळकतीचे दुरुस्तीसाठी मुंबई प्रांतिक महानगरपालिका अधिनियम १९४९ ) प्रकरण ८, नियम ७ अन्वये १०% रकमेची सूट देण्यात आली आहे.
          </td>
        </tr>

        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Paragraph12}>
            <table className={MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTable}>
              <tr>
                <th colSpan={4} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTh} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableThh}`}>मिळकतीचा स्थानिक  पत्ता </th>
                <th colSpan={4} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTh} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableThh}`}>वापर</th>
                <th colSpan={4} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTh} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableThh}`}>आकारणी क्षेत्रफळ (चौ.फूट)</th>
                <th colSpan={4} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTh} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableThh}`}>करयोग्य मूल्य</th>
                <th colSpan={4} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTh} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableThh}`}>आकारणी कालावधी (पासून)</th>
              </tr>
              <tr className={MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrContent}>
                <td colSpan={4} rowSpan={3} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr}  ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}>निवासी</td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr}${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
              </tr>

              <tr className={MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrContent}>

                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}>बिगर निवासी </td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
              </tr>
              <tr className={MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrContent}>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}>औद्योगिक</td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
              </tr>

              <tr className={MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrContent}>
                <td colSpan={4} rowSpan={3} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}>मिळकत क्रमांक </td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
              </tr>

              <tr className={MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrContent}>

                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}>मोकळी जमीन</td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}> </td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
                <td colSpan={4} rowSpan={1} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace1}`}></td>
              </tr>

            </table>

          </td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Paragraph111}>
            सबव या ठरविणेत आलेल्या करयोग्य मूल्याचे रकमेबाबत अथवा कर आकारणी रजिस्टर मधील इतर कोणत्याही नोंदीबाबत आपली काही हरकत अगर तक्रार असेल तर ती उक्त कायद्यातील प्रकरण ८, नियम १६ ला अधिन गहन सबळ कारणास्तव व पुराव्यासह कागदपत्रासह लेखी अर्ज <strong>मा. करआकारणी व करसंकलन प्रमुख /प्रशासन अधिकारी (कर)</strong> यांचे नावे महापालिकेचे  ------------  विभागीय कार्यालय/कर संकलन मुख्यालय या ठिकाणी दिनांक / __ /२०१ रोजी दुपारी ३.०० वा. पर्यंत मिळेल अशा रितीने पोस्टाने पाठवावी किंवा समक्ष टाखल करावी व पोहोच घ्यावी, दिनांक /   /  २०१  रोजी दुपारी ३.०० नंतर आलेल्या किंवा योग्य कारण न देता आलेल्या हरकती किंवा तक्रारी अर्जाचा विचार केला जाणार नाही. तसेच मुदतीत हरकत किंवा तक्रार अर्ज न आलेस करयोग्यमूल्य व इतर नोंदी आपणास मान्य आहेत असे समजून त्या कायम केल्या जातील.</td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Paragraph1112}>
            &nbsp; &nbsp; &nbsp; &nbsp;  मिळकतीच्या करयोग्य मूल्याबाबत, मालकी हक्काबाबत किंवा मिळकतीचे वर्णनासह इतर नोंटीबाबतचा तपशील --------- येथील महापालिकेचे विभागीय कार्यालयात सुट्टीचे दिवस सोडून कार्यालयीन वेळेत सकाळी ११ ते ३ वाजेपर्यंत पहावयास मिळेल.</td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.SahyakMandalAdhikari}>प्रशासन अधिकारी (करसंकलन)</td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.VibhagiyKarayalay}>करसंकलन विभागीय कार्यालय</td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.Pimpari}>पिंपरी चिंचवड महानगरपालिका, पिंपरी - १८.</td>
        </tr>
        <tr>
          <td colSpan={24} className={MilakatKarAkanrniBabatVisheshNoticeCSS.hrLineHeadingBelow1}></td>
        </tr>
        <tr>
          <td colSpan={12} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace11} ${MilakatKarAkanrniBabatVisheshNoticeCSS.hrBelowSpace}`}>
            नोटीस स्विकारणाऱ्याचे नाव :
          </td>
          <td colSpan={12} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace11}  ${MilakatKarAkanrniBabatVisheshNoticeCSS.hrBelowSpace}`}>
            नोटीस बजावणाऱ्याचे नाव :
          </td>
        </tr>
        <tr>
          <td colSpan={12} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace11}`}>
            नोटीस स्विकारणाऱ्याची सही :
          </td>
          <td colSpan={12} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace11}`}>
            सही:
          </td>
        </tr>
        <tr>
          <td colSpan={12} className={`${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrr} ${MilakatKarAkanrniBabatVisheshNoticeCSS.InnerTableTrSpace11}`}>
            दिनांक :      /    /२०१
          </td>
        </tr>
      </table >
    );
  }
}

export default MilakatKarAkanrniBabatVisheshNotice;
