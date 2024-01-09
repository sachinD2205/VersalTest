import React from "react";
import { Paper } from "@mui/material";
import styles from "./documentStyles/pratidnyaPatra.module.css";
import Head from "next/head";

const Index = () => {
  return (
    <>
      <Head>
        <title>Pratidnya Patra</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h2>पिंपरी चिंचवड महानगरपालिका, पिंपरी – ४११ ०१८</h2>
            <h3>मालमत्ता कर आकारणीकामी</h3>
            <h3>प्रतिज्ञापत्र</h3>
            <h3>
              (महाराष्ट्र महानगरपालिका अधिनियम प्रकरण 8 नियम 8 (1) अन्वये
              मालमत्ताधारकाने भरून देण्याचे प्रतिज्ञापत्र)
            </h3>
          </div>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.srNo}>1.</td>
                <td className={styles.descriptionName}>मालकाचे नाव:</td>
                <td className={styles.valueField}></td>
              </tr>
              <tr>
                <td className={styles.srNo}>2.</td>
                <td className={styles.descriptionName}>भोगवटादार नाव:</td>
                <td className={styles.valueField}></td>
              </tr>
              <tr>
                <td className={styles.srNo}>3.</td>
                <td className={styles.descriptionName}>
                  मालमत्तेचा स्थानिक पत्ता:
                </td>
                <td className={styles.valueField}></td>
              </tr>
              <tr>
                <td className={styles.srNo}></td>
                <td className={styles.descriptionName}>
                  स.नं./सि.स.नं./ सेक्टर / प्लॉट क्रमांक:
                </td>
                <td className={styles.valueField}></td>
              </tr>
              <tr>
                <td className={styles.srNo}>4.</td>
                <td className={styles.descriptionName}>
                  पत्रव्यवहाराचा पत्ता:
                </td>
                <td className={styles.valueField}></td>
              </tr>
              <tr>
                <td className={styles.srNo}>5.</td>
                <td className={styles.descriptionName}>
                  मोबाईल / दूरध्वनी क्रमांक:
                </td>
                <td className={styles.valueField}></td>
              </tr>
              <tr>
                <td className={styles.srNo}>6.</td>
                <td className={styles.descriptionName}>इतर माहिती:</td>
                <td className={styles.valueField}>
                  बँकेचे नाव:
                  <br />
                  शाखा:
                  <br />
                  खाते क्रमांक:
                  <br />
                </td>
              </tr>
              <tr>
                <td className={styles.srNo}>7.</td>
                <td className={styles.descriptionName}>मालमत्ता स्वरुप:</td>
                <td className={styles.valueField}>
                  नवीन / वाढीव
                  <br />
                  वाढीव असल्यास मालमत्ता क्रमांक:
                  <br />
                </td>
              </tr>
              <tr>
                <td className={styles.srNo}>8.</td>
                <td className={styles.descriptionName}>बांधकाम दर्जा:</td>
                <td className={styles.valueField}>
                  <ol style={{ margin: 0, paddingInlineStart: 15 }}>
                    <li>आर.सी.सी. / लोडबेअरींग</li>
                    <li>
                      साधे बांधकाम - दगड, वीट, माती, सिमेंट, छत पत्रा / कौलारु
                    </li>
                    <li>
                      पत्र्याचे बांधकाम – भिंती व छत पत्र्याचे, फायबर, लाकूड,
                      प्लॅस्टिक इत्यादी
                    </li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td className={styles.srNo}>9.</td>
                <td className={styles.descriptionName}>बांधकाम स्वरुप:</td>
                <td className={styles.valueField}>
                  अधिकृत / अनाधिकृत / अंशत: अनाधिकृत / परवाना आहे परंतु
                  भोगवटापत्रक नाही
                </td>
              </tr>
              <tr>
                <td className={styles.srNo}>10.</td>
                <td className={styles.descriptionName}>
                  बांधकाम परवाना क्रमांक व दिनांक:
                </td>
                <td className={styles.valueField}></td>
              </tr>
              <tr>
                <td className={styles.srNo}>11.</td>
                <td className={styles.descriptionName}>
                  भोगवटा पत्र क्रमांक व दिनांक
                </td>
                <td className={styles.valueField}></td>
              </tr>
              <tr>
                <td className={styles.srNo}>12.</td>
                <td className={styles.descriptionName}>
                  इमारत पूर्णत्व व वापर माहिती
                </td>
                <td className={styles.valueField}>
                  पूर्णत्वाची तारीख: <br />
                  इमारत वापर सुरु तारीख:
                </td>
              </tr>
            </tbody>
          </table>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th colSpan={4}>मालमत्तेची माहिती</th>
              </tr>
              <tr>
                <th className={styles.floor}>मजला</th>
                <th className={styles.area}>
                  बांधकाम क्षेत्रफळ <br />( लांबी X रुंदी = एकूण चौ.फूट बिल्टअप)
                </th>
                <th className={styles.constructionType}>
                  वापर (निवासी / बिगरनिवासी / मिश्र / औद्योगिक / मोकळी जमिन)
                </th>
                <th className={styles.usageType}>
                  व्यवसाय असल्यास व्यवसायाचे स्वरुप
                </th>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div className={styles.paragraph}>
            उपरोक्त वर्णन केलेली प्रतिज्ञापत्रकातील माहिती सत्य असून माझे
            समजुतीप्रमाणे बरोबर आहे. प्रतिज्ञापत्रातील माहिती खोटी आहे असे चौकशी
            अंती निदर्शनास महाराष्ट्र महानगरपालिका अधिनियम प्रकरण 8 नियम 8 व
            प्रकरण 25 नियम 393 (4) चा भंग झाल्याचे समजून महानगरपालिके मार्फत
            करण्यात येणा-या कारवाईस मी पात्र राहीन.
          </div>

          <table className={styles.footer}>
            <tbody>
              <tr>
                <td style={{ width: 50 }}>ठिकाण :</td>
                <td style={{ width: 250 }}></td>
                <td style={{ width: 100 }}>मालमत्ता धारकाची सही: </td>
                <td style={{ width: 200 }}></td>
              </tr>
              <tr>
                <td style={{ width: 50 }}>दिनांक :</td>
                <td style={{ width: 250 }}></td>
                <td style={{ width: 100 }}>मालमत्ता धारकाचे नांव: </td>
                <td style={{ width: 200 }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.wrapper} style={{ marginTop: 10 }}>
          <div className={styles.header}>
            <h2>
              करयोग्य मूल्य निश्चितीकामी मूल्यांकन कार्यालयाने भरावयाची माहिती
            </h2>
            <h3>
              मालमत्तेची दिनांक / / रोजी समक्ष पाहणी केली असता खालील वस्तुस्थिती
              निदर्शनास आली
            </h3>
          </div>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th colSpan={4}>मालमत्तेची माहिती</th>
              </tr>
              <tr>
                <th className={styles.floor}>मजला</th>
                <th className={styles.area}>
                  बांधकाम क्षेत्रफळ ( लांबी X रुंदी = एकूण चौ.फूट बिल्टअप)
                </th>
                <th className={styles.constructionType}>
                  वापर (निवासी / बिगरनिवासी / मिश्र / औद्योगिक / मोकळी )
                </th>
                <th className={styles.usageType}>
                  व्यवसाय असल्यास व्यवसायाचे स्वरुप{" "}
                </th>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>1</td>
                <td>मालमत्ताधारकाने भरुन दिलेल्या प्रतिज्ञापत्रकातील माहिती</td>
                <td>
                  बरोबर / चुकीची / अपूर्ण आहे
                  <br />
                  प्रतिज्ञापत्र सादर केले नाही
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>बांधकाम स्वरुप</td>
                <td>
                  अधिकृत / अनाधिकृत / अंशत: अनाधिकृत / परवाना आहे परंतु
                  भोगवटापत्रक नाही
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>मालमत्ता स्वरुप</td>
                <td>
                  नवीन / वाढीव <br />
                  वाढीव असल्यास मालमत्ता क्रमांक
                </td>
              </tr>
              <tr>
                <td>4</td>
                <td>मालमत्ता फ्लोअरेज करास पात्र आहे काय</td>
                <td>होय / नाही</td>
              </tr>
              <tr>
                <td>5</td>
                <td>मालमत्ता मालकी</td>
                <td>खाजगी / म.न.पा. / राज्य शासन / केंद्र शासन</td>
              </tr>
            </tbody>
          </table>
          <b>
            समक्ष पाहणीत आढळून आलेल्या मालमत्तेचा आकारणी तपशील खालील प्रमाणे :
          </b>
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>मजला</th>
                <th>बांधकाम दर्जा</th>
                <th>क्षेत्रफळ</th>
                <th>वापर</th>
                <th>करयोग्य मूल्य दर</th>
                <th>करयोग्य मूल्य</th>
                <th>फ्लोअरेज कर रक्कम</th>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          सबब समक्ष पाहणीत आढळून आलेली मालमत्ता, वापर, बांधकाम दर्जा, उपलब्ध
          कागदपत्रे व माहितीच्या आधारे खालील प्रमाणे मालमत्ता कर आकारणीकामी
          विशेष नोटीस प्रस्तावित करण्यात येत आहे.
          <table className={styles.table}>
            <tbody>
              <tr>
                <th>वापर</th>
                <th>आकारणी क्षेत्रफळ (चौ. फूट)</th>
                <th>करयोग्य मुल्य</th>
                <th>फ्लोअरेज कर रक्कम</th>
                <th>आकारणी कालावधीपासून</th>
              </tr>
              <tr>
                <td>
                  <b>निवासी</b>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>बिगर निवासी</b>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>औद्योगिक</b>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>मोकळी जमीन</b>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>पार्कींग</b>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <b>एकुण</b>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div className={styles.finalFooter}>
            <label>गट प्रमुख</label>
            <label>सहाय्यक मंडलाधिकारी</label>
          </div>
        </div>
      </Paper>
    </>
  );
};

export default Index;
