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
import SamakshPahaniAhwalCSS from "./SamakshPahaniAhwal.module.css";
import Loader from "../../../containers/Layout/components/Loader";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { catchExceptionHandlingMethod } from "../../../util/util";

/** Author - Sachin Durge */
// SamakshPahaniAhwal
//! http://localhost:4000/propertyTax/components/SamakshPahaniAhwal
const SamakshPahaniAhwal = () => {
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
        <Paper elevation={0} className={SamakshPahaniAhwalCSS.Paper}>
          {/**Stack */}
          <Stack
            spacing={5}
            direction="row"
            className={SamakshPahaniAhwalCSS.Stack}
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
          <div className={SamakshPahaniAhwalCSS.ComponentToPrint}>
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
      <table className={SamakshPahaniAhwalCSS.Table}>

        {/** Headings */}
        <tr >
          <td colSpan={24} className={SamakshPahaniAhwalCSS.Header}>
            <div className={SamakshPahaniAhwalCSS.Header11} >
              <div><img src={`/logo.png`} alt="PCMC LOGO" className={SamakshPahaniAhwalCSS.PcmcLogo} />  </div>
              <div className={SamakshPahaniAhwalCSS.HeaderDIV2}>
                <div className={SamakshPahaniAhwalCSS.HeaderDIV3}>
                  <div className={SamakshPahaniAhwalCSS.MHeader1}> पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८ </div>
                  <div className={SamakshPahaniAhwalCSS.MHeader2}>कर आकारणी व करसंकलन विभाग  </div>
                  <div className={SamakshPahaniAhwalCSS.MHeader3}>_____________________ विभाग  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
        {/** Heading End*/}



        {/** HR Line Start */}
        <tr>
          <td colSpan={24} className={SamakshPahaniAhwalCSS.hrLineHeadingBelow}></td>
        </tr>
        {/** HR Line End */}



        {/** Header Start */}

        <tr>
          <td colSpan={24} className={SamakshPahaniAhwalCSS.FlorageNoticeHeader}>
            समक्ष पहाणी अहवाल
          </td>
        </tr>

        {/** Header End */}


        {/** content 1 start */}


        <tr>
          <td colSpan={24} className={SamakshPahaniAhwalCSS.Paragraph1}>
            आज दिनांक:      /     /     रोजी सकाळी / दुपारी      वाजता     …………………..विभागीय कार्यालयाचे कार्यक्षेत्रातील …………………………………या पत्त्यावरील व  मनपा दप्तरी नोंद असलेल्या मालमत्ता क्रमांक ......................... मालमत्ते ची समक्ष पहाणी करणेत आली आहे. त्याचा तपशील खालील प्रमाणे :
          </td>
        </tr>


        {/** content 1 end */}



        {/** table 1 start*/}

        <tr>
          <td colSpan={24} className={SamakshPahaniAhwalCSS.Paragraph12}>
            <table className={SamakshPahaniAhwalCSS.InnerTable}>
              {/** Table Header */}
              <tr>
                <th colSpan={2} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh}`}>मजला </th>
                <th colSpan={2} style={{ width: "2.5%" }} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh}`}>बांधकामदर्जा</th>
                <th colSpan={3} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh} ${SamakshPahaniAhwalCSS.BandkaamShetrphal}`}>बांधकाम क्षेत्रफळ (चौफुट) (लांबीXरुंदी = एकुण)</th>
                <th colSpan={3} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh}`}>कोणत्या कारणासाठी वापर आहे.(निवासी/ बि.नि./औ./इतर)</th>
                <th colSpan={3} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh}`}>व्यवसाय असल्यास व्यवसायाचे स्वरुप</th>
                <th colSpan={3} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh}`}>सद्या वापर कोण करतो. मालक / भाडेकरु</th>
                <th colSpan={3} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh}`}>भाडेकरु वापर असल्यास भाडेकरुचे नाव व मासिक भाडे रक्कम</th>
                <th colSpan={3} style={{ width: "3%" }} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh}  ${SamakshPahaniAhwalCSS.EttarMahiti}`}>इतर माहीती</th>
                <th colSpan={2} style={{ width: "1.5%" }} className={`${SamakshPahaniAhwalCSS.InnerTableTh} ${SamakshPahaniAhwalCSS.InnerTableThh}`}></th>
              </tr>
              {/** Table Header End */}

              {/** 1 */}
              <tr>
                <td colSpan={2} rowSpan={5} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk} ${SamakshPahaniAhwalCSS.InnerTableOkBorder}  `} ></td>
                <td colSpan={2} rowSpan={5} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkBorder}`} ></td>
                <td colSpan={3} rowSpan={5} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkBorder}`} ></td>
                <td colSpan={3} rowSpan={5} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkBorder}`} ></td>
                <td colSpan={3} rowSpan={5} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkBorder}`} ></td>
                <td colSpan={3} rowSpan={5} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkBorder}`} ></td>
                <td colSpan={3} rowSpan={5} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkBorder}`} ></td>
                <td colSpan={3} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`} >1) यापुर्वीचे पाहणी नुसार बांधकाम आहे किंवा नाही</td>
                <td colSpan={2} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk} ${SamakshPahaniAhwalCSS.InnerTableOkK}`} >आहे / नाही</td>
              </tr>

              {/** 2 */}
              <tr>
                <td colSpan={3} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`}>2) मुळ बांधकामात वाढ झाली आहे काय.</td>
                <td colSpan={2} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`}>आहे / नाही</td>
              </tr>

              {/** 3 */}
              <tr>
                <td colSpan={3} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`}>3) मालमत्ते चा वापर सुरु आहे किंवा नाही.</td>
                <td colSpan={2} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`}>आहे / नाही</td>
              </tr>

              {/** 4 */}
              <tr>
                <td colSpan={3} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`}>4) इमारतीच्या पूर्वीच्या वापरात बदल झाला आहे काय.</td>
                <td colSpan={2} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`}>आहे / नाही</td>
              </tr>

              {/** 5 */}
              <tr>
                <td colSpan={3} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`}>5) मनपा दप्तरी नोंद असलेल्या बांधकामाचा अंशत:/  पुर्णत: भाग पाडला आहे काय
                  (मालमत्ता पाडली असल्यास पाडलेल्या मालमत्तेचा पंचनामा जोडावा)</td>
                <td colSpan={2} rowSpan={1} className={`${SamakshPahaniAhwalCSS.InnerTableThOk} ${SamakshPahaniAhwalCSS.InnerTableOk}  ${SamakshPahaniAhwalCSS.InnerTableOkK}`}>आहे / नाही</td>
              </tr>







            </table>

          </td>
        </tr>

        {/** table 1 end*/}

        {/** table end content */}
        <tr >
          <td colSpan={24} className={SamakshPahaniAhwalCSS.KramankPahave}>(कृ.मा.पहावे)</td>
        </tr>

        {/** second table start */}
        <tr>
          <td colSpan={24} className={`${SamakshPahaniAhwalCSS.HawaBhavachi}`}>
            <table>
              <tr><td colSpan={24} className={`${SamakshPahaniAhwalCSS.SecondTableTd} ${SamakshPahaniAhwalCSS.HarkatichaTapshil} ${SamakshPahaniAhwalCSS.SecondTableTdd}`}>हरकतीचा संक्षिप्त तपशील :</td></tr>
              <tr>
                <td colSpan={24} className={`${SamakshPahaniAhwalCSS.SecondTableTd} ${SamakshPahaniAhwalCSS.SadarMalamta} ${SamakshPahaniAhwalCSS.SecondTableTdd}`}>सदर मालमत्ते वरील सन &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; अखेर येणे रकमेची माहीती: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;थकबाकी र.रू. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /-चालु  र.रू  /- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; एकुण र.रू  /-
                </td>
              </tr>



              <tr><td colSpan={10} rowSpan={1} className={` ${SamakshPahaniAhwalCSS.SecondTableTdd} ${SamakshPahaniAhwalCSS.Nishkarsh}`}>मालमत्ता धारक यांचे हरकत अर्जाचे अनुषंगाने मिळकतीची पाहणी केल्यानंतर चा निष्कर्ष :



              </td>
                <td colSpan={14} className={` ${SamakshPahaniAhwalCSS.SecondTableTdd} ${SamakshPahaniAhwalCSS.borderRightOnePixel}`}>
                  मालमत्ता धारकाचा अर्ज
                </td>
              </tr>

              <tr>
                <td colSpan={10} rowSpan={5} className={`${SamakshPahaniAhwalCSS.Bhava} `}></td>
                <td colSpan={14} className={` ${SamakshPahaniAhwalCSS.SecondTableTdd} ${SamakshPahaniAhwalCSS.borderRightOnePixel}`}>
                  ७/१२ उतारा
                </td>
              </tr>

              <tr>
                <td colSpan={9} className={` ${SamakshPahaniAhwalCSS.SecondTableTdd} ${SamakshPahaniAhwalCSS.borderRightOnePixel}`}>
                  इंडेक्स –२
                </td>
              </tr>

              <tr>
                <td colSpan={9} className={` ${SamakshPahaniAhwalCSS.SecondTableTdd} ${SamakshPahaniAhwalCSS.borderRightOnePixel}`}>

                  प्रतिज्ञापत्र
                </td>
              </tr>


              <tr>
                <td colSpan={9} className={` ${SamakshPahaniAhwalCSS.SecondTableTdd} ${SamakshPahaniAhwalCSS.borderRightOnePixel}`}>
                  5) इमारतीचे फोटो
                </td>
              </tr>


              <tr>
                <td colSpan={9} className={` ${SamakshPahaniAhwalCSS.SecondTableTdd} ${SamakshPahaniAhwalCSS.borderRightOnePixel}`}>
                  6) इतर
                </td>
              </tr>








              <tr><td colSpan={24} className={`${SamakshPahaniAhwalCSS.SecondTableTd} ${SamakshPahaniAhwalCSS.SecondTableTdd}`}>
                <strong> इतर पुराव्याचे कागदपत्रा बाबतचा तपशील :</strong>&nbsp;
                सदर इमारतीची समक्ष पहाणी केली असता, सदर इमारतीचे बांधकाम पुर्ण झाले असल्याचे आढळुन आले. सदर इमारतीचा वापर निवासी होतअ सल्याचे आढळुन आले. सदर इमारतीची नोंद दिनांक      /    /       पासून करणेस हरकत वाटत नाही.</td></tr>
              <tr><td colSpan={24} className={`${SamakshPahaniAhwalCSS.SecondTableTd} ${SamakshPahaniAhwalCSS.SecondTableTdd}`}>
                इतर निष्कर्ष  /  अभिप्राय :
              </td></tr>
            </table>
          </td>

        </tr>
        {/** second table end  */}





        {/** Second content Start*/}
        <tr>
          <td colSpan={24} className={SamakshPahaniAhwalCSS.Paragraph111}>
            वरील प्रमाणे सदर मालमत्तेचा अहवाल सादर करणेत आला असे.</td>
        </tr>
        {/** Second content End*/}


        {/** fotter Start  */}

        <tr>
          <td colSpan={12} className={`${SamakshPahaniAhwalCSS.Prshasan}`}>गटप्रमुख / मालमत्ता निरीक्षक</td>
          <td colSpan={12} className={SamakshPahaniAhwalCSS.SahyakMandalAdhikari}>प्रशासन अधिकारी (करसंकलन)</td>
        </tr>


        <tr>

          <td colSpan={12} className={`${SamakshPahaniAhwalCSS.GatKramank} `}>गटक्रमांक  7</td>

          <td colSpan={12} className={SamakshPahaniAhwalCSS.VibhagiyKarayalay}>करसंकलन विभागीय कार्यालय</td>
        </tr>
        <tr>
          <td colSpan={12} className={` ${SamakshPahaniAhwalCSS.GatacheName}`}>गटाचे  नाव -------------------   </td>
          <td colSpan={12} className={SamakshPahaniAhwalCSS.Pimpari}>पिंपरी चिंचवड महानगरपालिका, पिंपरी - १८.</td>
        </tr>
      </table >
    );
  }
}

export default SamakshPahaniAhwal;
