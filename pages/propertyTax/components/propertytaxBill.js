import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import router from "next/router";
import styles from "./documentStyles/propertyTaxBill.module.css";
import responseBody from "./billBody.json";

import { Paper, Button } from "@mui/material";
import { Print, ExitToApp } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import URLs from "../../../URLS/urls";
import { useSelector } from "react-redux";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { useGetToken } from "../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Property tax bill",
  });

  // @ts-ignore
  const language = useSelector((state) => state.labels.language);

  const userToken = useGetToken();

  const [billDetails, setBillDetails] = useState({
    // ...responseBody,
    // zoneEn: '',
    // zoneMr: '',
    // gatEn: '',
    // gatMr: '',
  });
  const [allGat, setAllGat] = useState([
    {
      id: 1,
      gatEn: "",
      gatMr: "",
    },
  ]);
  const [allZone, setAllZone] = useState([
    {
      id: 1,
      zoneEn: "",
      zoneMr: "",
    },
  ]);

  useEffect(() => {
    axios
      .get(`${URLs.CFCURL}/master/gatMaster/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => setAllGat(res.data?.gatMaster))
      .catch((error) => catchExceptionHandlingMethod(error, language));

    axios
      .get(`${URLs.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => setAllZone(res.data?.zone))
      .catch((error) => catchExceptionHandlingMethod(error, language));
  }, []);

  useEffect(() => {
    if (allGat.length > 1 && allZone.length > 1) console.log("Gats", allGat);

    axios
      .post(
        `${URLs.PTAXURL}/transaction/property/bill/getPropertyBillByBillIdV1`,
        { id: router.query.id },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) =>
        setBillDetails({
          ...res.data,
          gatEn: allGat.find((j) => j.id == res.data.gatNo)?.gatNameEn,
          gatMr: allGat.find((j) => j.id == res.data.gatNo)?.gatNameMr,
          zoneEn: allZone.find((j) => j.id == res.data.zoneNo)?.zoneName,
          zoneMr: allZone.find((j) => j.id == res.data.zoneNo)?.zoneNameMr,
        })
      );
  }, [allGat, allZone]);

  return (
    <>
      <Head>
        <title>Property Tax Bill</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.billWrapper} ref={componentRef}>
          <div className={styles.front}>
            <div className={styles.header}>
              <img src="/logo.png" alt="PCMC Logo" width={65} height={65} />
              <div className={styles.centerHeader}>
                <h2>
                  {`मालमत्ता कराचे बील :- सन (${billDetails?.billGeneratedYear})`}
                </h2>
                <h1>पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११ ०१८</h1>
                <h3>
                  {`(महाराष्ट्र महानगरपालिका अधिनियम अनुसूची ड प्रकरण ८ नियम ३९
                  प्रमाणे)`}
                </h3>
              </div>
              <img src="/logo.png" alt="PCMC Logo" width={65} height={65} />
            </div>
            <div className={styles.subHeader}>
              <label>
                <FormattedLabel id="zoneNo" />:{" "}
                <span>
                  {language == "en" ? billDetails?.zoneEn : billDetails?.zoneMr}
                </span>
              </label>
              <label>
                <FormattedLabel id="gatNo" />:
                <span>
                  {language == "en" ? billDetails?.gatEn : billDetails?.gatMr}
                </span>
              </label>
              <label>
                <FormattedLabel id="propertyCode" />:{" "}
                <span>{billDetails?.propertyCode}</span>
              </label>
              <label>
                <FormattedLabel id="billNo" />:{" "}
                <span>{billDetails?.billNo}</span>
              </label>
              <label>
                <FormattedLabel id="date" />:
                <span>{billDetails?.billDate}</span>
              </label>
            </div>
            <div className={styles.basicInfo}>
              <label>
                <FormattedLabel id="ownerName" />:
                <span>{billDetails?.ownerName}</span>
              </label>
              <label>
                <FormattedLabel id="occupantName" />:
                <span>{billDetails?.occupantName}</span>
              </label>
              <label>
                <FormattedLabel id="propertyAddress" />:
                <span>{billDetails?.propertyAddress}</span>
              </label>
              <label>
                <FormattedLabel id="propertyDescription" />:
                <span>{billDetails?.propertyDescription}</span>
              </label>
            </div>
            <table className={styles.mainTable}>
              <tr>
                <td className={styles.redText} rowSpan={2}></td>
                <td className={styles.redText} rowSpan={2}>
                  <FormattedLabel id="residential" />
                </td>
                <td className={styles.redText} colSpan={2}>
                  <FormattedLabel id="nonResidential" />
                </td>
                <td className={styles.redText} rowSpan={2}>
                  <FormattedLabel id="freeLand" />
                </td>
                <td className={styles.redText} rowSpan={2}>
                  <FormattedLabel id="total" />
                </td>
              </tr>
              <tr>
                <td className={styles.redText}>
                  <FormattedLabel id="professional" />
                </td>
                <td className={styles.redText}>
                  <FormattedLabel id="industrial" />
                </td>
              </tr>
              <tr>
                <td className={styles.redText}>
                  <FormattedLabel id="area" />
                </td>
                <td>
                  {Number(billDetails?.areaBuiltUp?.resident ?? 0).toFixed(2)}
                </td>
                <td>
                  {Number(
                    billDetails?.areaBuiltUp?.nonResident?.professional ?? 0
                  ).toFixed(2)}
                </td>
                <td>
                  {Number(
                    billDetails?.areaBuiltUp?.nonResident?.industrial ?? 0
                  ).toFixed(2)}
                </td>
                <td>
                  {Number(billDetails?.areaBuiltUp?.freeLand ?? 0).toFixed(2)}
                </td>
                <td>
                  {Number(billDetails?.areaBuiltUp?.total ?? 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className={styles.redText}>
                  <FormattedLabel id="taxableValue" />
                </td>
                <td>
                  {Number(billDetails?.taxableValue?.resident ?? 0).toFixed(2)}
                </td>
                <td>
                  {Number(
                    billDetails?.taxableValue?.nonResident?.professional ?? 0
                  ).toFixed(2)}
                </td>
                <td>
                  {Number(
                    billDetails?.taxableValue?.nonResident?.industrial ?? 0
                  ).toFixed(2)}
                </td>
                <td>
                  {Number(billDetails?.taxableValue?.freeLand ?? 0).toFixed(2)}
                </td>
                <td>
                  {Number(billDetails?.taxableValue?.total ?? 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td className={styles.redText}>
                  <FormattedLabel id="taxName" />
                </td>
                <td className={styles.redText}>
                  <FormattedLabel id="ratePercent" />
                </td>
                <td className={styles.redText}>
                  <FormattedLabel id="pastDue" />
                </td>
                <td className={styles.redText}>
                  <FormattedLabel id="firstHalf" />
                </td>
                <td className={styles.redText}>
                  <FormattedLabel id="secondHalf" />
                </td>
                <td className={styles.redText}>
                  <FormattedLabel id="total" />
                </td>
              </tr>
              {billDetails?.taxes?.map((taxDetails) => (
                <tr>
                  <td className={styles.redText}>
                    {language == "en"
                      ? taxDetails.taxName
                      : taxDetails.taxNameMr}
                  </td>
                  <td>{Number(taxDetails.rate ?? 0).toFixed(2)}</td>
                  <td>{Number(taxDetails.pastDue ?? 0).toFixed(2)}</td>
                  <td>{Number(taxDetails.firstHalf ?? 0).toFixed(2)}</td>
                  <td>{Number(taxDetails.secondHalf ?? 0).toFixed(2)}</td>
                  <td>{Number(taxDetails.total ?? 0).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td rowSpan={2} colSpan={5} style={{ textAlign: "left" }}>
                  <label className={styles.redText}>सर्व साधारण सुचना:</label>
                  <ol style={{ marginBottom: 0 }}>
                    <li>
                      सर्व करांचा रक्कम दिनांक १ एप्रिल व १ ऑक्टोबर रोजी सुरु
                      होणाऱ्या सहामाही हप्त्याने आगाऊ देय आहेत.
                    </li>
                    <li>
                      बील भरणेची मुदत - पहिली सहामाही बील मिळालेपासून ०३
                      महिन्याचे आत अथवा ३० सप्टेंबर तशेच दुसरी सहामाही ३१
                      डिसेंबरपर्यंत.
                    </li>
                    <li>
                      धनादेश/ डिमांड ड्राफ्ट आयुक्त, पिंपरी चिंचवड महानगरपालिका,
                      पिंपरी - ४११०१८ अथवा COMMISSIONER, P.C.M.C., PIMPRI -
                      411018 या नावाने काढावा.
                    </li>
                    <li>
                      www.pcmcindia.gov.in या संकेतस्थळावर नागरिक लिंकवर क्लिक
                      करून मालमत्ता कर भरणा करणेची सुविधा उपलब्ध आहे.
                    </li>
                    <li>
                      विहित मुदतीत बिलात मागणी केलेली रक्कम भरली नाही तर कराधान
                      नियम ४१ नुसार दरमहा २% शास्ती लागू होईल.
                    </li>
                    <li>
                      जुनी इमारत पाडलेस, नवीन किंवा मूळ मालमत्तेमध्ये वाढीव
                      बांधकाम केल्यास १५ दिवसांचे आत म.न.पा.स लेखी कळविणे
                      बंधकारक आहे.
                    </li>
                    <li>
                      कर देणेस प्रथम पात्र असलेल्या व्यक्तीच्या माल्मत्तेसंभंधी
                      मालकी हक्काचे हस्तांतरण करणेत येईल तेव्हा हस्तांतरण
                      आल्यानंतर ०३ महिनेचे आत तसेच कर देण्यास पात्र व्यक्ती मरण
                      पाल्यास मयात व्यक्तीच्या मालकी हक्काचे, वारस म्हणून किंवा
                      ज्या व्यक्तीकडे हस्तांतरण करणेत येईल त्या व्यक्तीने मयात
                      व्यक्तीच्या मृत्युनंतर ०१ वर्षाचे आत अशा हस्तांतरणासंभंधी
                      लेखी कळविणे बंधनकारक आहे.
                    </li>
                    <li>
                      आकारणी पुस्तकामध्ये माल्भत्तेसंबंधे नोंदविलेल्या मालक /
                      भोगवटादाराचे नाव, मालमत्ता वर्णन, पत्ता, करयोग्य मुल्य
                      किंवा कराबाबत तक्रार असल्यास महाराष्ट्र महानगरपालिका
                      अधिनियमातील अनुसूची 'ड' प्रकरण ०८ नियम १६ नुसार दरवर्षी
                      डिसेंबर महिन्यामध्ये हरकती मागविल्या जातात तेव्हा
                      मालमत्ताधारकास लेखी अर्ज करता येईल.
                    </li>
                  </ol>
                </td>
                <td
                  style={{
                    paddingTop: 50,
                  }}
                >
                  <label>
                    (निलेश देशमुख) <br /> सहाय्यक आयुक्त <br /> कर आकारणी व{" "}
                    <br /> कर संकलन विभाग
                  </label>
                </td>
              </tr>
              <tr>
                <td style={{ width: 145 }}>
                  Payment gateway वरील wallets
                  <div className={styles.imageWrapper}>
                    <img
                      src="/paytm.png"
                      alt="paytm wallet"
                      width={50}
                      className={styles.walletImages}
                    />
                    <img
                      src="/JioMoney.png"
                      alt="jio money wallet"
                      width={50}
                      className={styles.walletImages}
                    />
                    <img
                      src="/mobikwik.png"
                      alt="mobikwik wallet"
                      width={50}
                      className={styles.walletImages}
                    />
                    <img
                      src="/amazonPay.png"
                      alt="mobikwik wallet"
                      width={50}
                      className={styles.walletImages}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: "left" }}>
                  <label className={styles.redText}>
                    प्रकार निवारण व्यवस्था
                  </label>
                  <ol style={{ marginBottom: 0 }}>
                    <li>सारथी तक्रार निवारण ८८८८००६६६६</li>
                    <li>सारथी हेल्पलाईन www.pcmchelpline.in</li>
                    <li>कर संकलन विभाग इमेल ptax@pcmcindia.gov.in</li>
                    <li>कर संकलन विभाग मुख्य कार्यालय ०२०-६७३३१५४५</li>
                  </ol>
                </td>
                <td colSpan={3}> Bank of Baroda Advertisement here</td>
              </tr>
            </table>
          </div>
          <div className={styles.back}>
            <div className={styles.first}>
              <h2>INLAND LETTER CARD</h2>
              <h3 className={styles.redText}>
                पिंपरी चिंचवड महानगरपालिका - मालमत्ता कर बील सन:
              </h3>
              <div className={styles.basicInfo}>
                <label>
                  प्रती,
                  <span></span>
                </label>
                <label>
                  <FormattedLabel id="ownerName" />:
                  <span>{billDetails?.ownerName}</span>
                </label>
                <label>
                  <FormattedLabel id="occupantName" />:
                  <span>{billDetails?.occupantName}</span>
                </label>
                <label>
                  <FormattedLabel id="propertyCode" />:
                  <span>{billDetails?.propertyCode}</span>
                </label>
                <label>
                  <FormattedLabel id="propertyAddress" />:
                  <span>{billDetails?.propertyAddress}</span>
                </label>
                <label>
                  <FormattedLabel id="mobileNo" />:
                  <span>{billDetails?.mobileNo}</span>
                </label>
              </div>
              <div className={styles.detailsForPostman}>
                <img
                  className={styles.pcmcLogo}
                  src="/logo.png"
                  alt="PCMC Logo"
                  width={70}
                />
                <div className={styles.subDetailsForPostman}>
                  <div className={styles.returnType1}>
                    <label className={styles.returnTypeLabel}>
                      बिल परतयेण्याचे कारण - अपूर्णपत्ता
                      <span className={styles.tickBox} />
                    </label>
                    <label className={styles.returnTypeLabel}>
                      मोकळी जागा
                      <span className={styles.tickBox} />
                    </label>
                    <label className={styles.returnTypeLabel}>
                      इतर
                      <span className={styles.tickBox} />
                    </label>
                  </div>
                  <div className={styles.returnType2}>
                    <label className={styles.returnTypeLabel}>
                      {/* बिट क्रमांक <span className={styles.tickBox} /> */}
                      बिट क्रमांक
                    </label>
                    <label className={styles.returnTypeLabel}>
                      पोस्टमनची स्वाक्षरी
                      <span className={styles.signBox} />
                    </label>
                  </div>
                </div>
              </div>
              <label className={styles.redText}>
                कर संकलन विभागीय कार्यालय
              </label>
              <br />
              <label className={styles.redText}>कार्यालायचा पत्ता</label>
            </div>
            <div className={styles.second}>
              <label
                className={styles.redText}
                style={{ alignSelf: "center", marginBottom: 15 }}
              >
                नागरिकांसाठी सूचना
              </label>
              <label className={styles.redText}>
                मालमत्ता कर सवलतीच्या योजना:
              </label>
              <label>
                चालू सरकारी वर्षाचे चालू मागणीतील देय सामान्य कर रकमे वर खालील
                प्रमाणे सामान्य कर सवलत योजना अंमलात आहेत
              </label>
              <ol>
                <li>
                  स्वातंत्र्य सैनिक किंवा त्यांचे पत्नी यांचे स्वतः राहत
                  असलेल्या फक्त एका निवासी घरास - ५०% सवलत
                </li>
                <li>
                  फक्त महिलांचे नाव असलेल्या, स्वतः राहत असलेल्या फक्त एका
                  निवासी घरास - ५०% सवलत
                </li>
                <li>
                  ४०% किंवा त्यापेक्षा जास्त दिव्यंगत्व असणाऱ्या अंध, पांग,
                  मतिमंद, कर्णबधिर व मूकबधिर यांच्या नावावर असणाऱ्या मालमत्तेस -
                  ५०% सवलत
                </li>
                <li>
                  संपूर्ण मालमत्ता कराची रक्कम आगाऊ भरणाऱ्या करीता - स्वतंत्र
                  असलेल्या निवासी मालमत्तेस - १०% सवलत बिगरनिवासी / मिश्र /
                  औद्योगिक / मोकळ्या जमिनी इ. मालमत्तेस - ५% सवलत
                </li>
                <li>
                  ग्रीन बिल्डिंग रेटिंग राबवणाऱ्या मालमत्तेस (ग्रीन बिल्डिंग
                  सर्टिफिकेट असणाऱ्या मालमत्तेस)
                  <br />
                  ग्रीहा: २५००चौ. मी. पेक्षा जास्त भूखंडावरील प्रकल्प ३ STAR
                  RATING :५% सवलत, ४ STAR RATING : ८% सवलत, ५ STAR RATING : १०%{" "}
                  <br />
                  सवलत स्वग्रीहा: २५००चौ. मी. पेक्षा कमी भूखंडावरील प्रकल्प 1
                  STAR RATING :५% सवलत, 2 STAR RATING : ८% सवलत, 3 STAR RATING :
                  १०% सवलत, 4 STAR RATING : १२% सवलत, 5 STAR RATING : १५% सवलत
                </li>
                <li>
                  वरील १ ते ५ योजने पैकी कोणत्याही फक्त एका योजनेचा लाभ मालमत्ता
                  धारकास घेता येईल या सवलतीचा लाभ घेणे कामी थकबाकी सह दोन्ही
                  सहामाहीची संपूर्ण बिलाची रक्कम एक रक्कमी आगाऊ धारणेची मुदत
                  (बिल मिळो अथवा न मिळो) - ३० जून अखेर
                </li>
                <li>
                  संरक्षण दलातील शौर्य पदक धारक आणि माजी सैनिकांच्या विधवा तसेच
                  अविवाहित शाहिद सैनिकांचे नामनिर्देषितांचे राहणाऱ्या त्याच
                  प्रमाणे शहरात वास्तव्य करणाऱ्या माजी सैनिकांना मालमत्ताकरात
                  (सामान्य कर, मलप्रवाह सुविधा लाभ कर, पाणी पुरवठा लाभ कर, रस्ता
                  करात) १००% सूट
                </li>
                <li>
                  प्रामाणिकपणे दर वर्षी मालमत्ता कराचा भरणा करणाऱ्या मालमत्ता
                  धारकांना ३ वर्षाचे ब्लॉक नंतर चौथ्यावर्षी - सामान्य करात २%
                  सवलत संपूर्ण वर्षासाठी
                </li>
                <li>
                  माझी मालमत्ता माझी आकारणी योजना: स्वयंस्फूर्तीने मालमत्ता
                  कराची आकारणी करणाऱ्यांसाठी सामान्य करात २% सवलत संपूर्ण वर्षा
                  साठी
                </li>
                <li>
                  स्वच्छाग्रह चालू साफ सफाई कराच्या १) ऑन साईट कंपोस्टिंग २०% २)
                  ऑन साईट कंपोस्टिंग + एस टी पी ३०% ३) झिरो गार्बेज + एस टी पी
                  ५०%
                </li>
                <li>
                  थकबाकीसह एक रक्कमी मालमत्ता कराचा भरणा ऑनलाईन पेमेंट गेट -
                  वेद्वारे करणाऱ्या मालमत्ता धारकास चालू आर्थिक वर्षाचे सामान्य
                  करात सवलत - माहे जून अखेर - ५% व माहे जुलै ते मार्च अखेर - २%
                </li>
              </ol>
            </div>
            <div className={styles.third}>
              <label className={styles.redText}>
                तक्रार निवारणासाठी विभागीय कार्यालय संपर्क क्रमांक
              </label>
              <label style={{ marginTop: 10 }}>
                निगडीप्राधिकरण - 27657870, आकुर्डी - 27653298, चिंचवड -
                27453310, थेरगाव - 7447421014, सांगावी - 27280023, पिंपरीनगर -
                27413782, मनपाभवन - 27422462, फुगेवाडी - दापोडी - 27145255,
                चऱ्होली - 7447421016, मोशी - 7447421015, चिखली - 9552578738,
                तळवाडे - 27660434, दिघीबोपखेल - 7722060944
              </label>
            </div>
            <div className={styles.fourth}>Bank of Baroda Ad here</div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Button
            variant="contained"
            endIcon={<Print />}
            onClick={handleToPrint}
          >
            <FormattedLabel id="print" />
          </Button>
          <Button
            variant="outlined"
            color="error"
            endIcon={<ExitToApp />}
            onClick={() => {
              router.back();
            }}
          >
            <FormattedLabel id="exit" />
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
