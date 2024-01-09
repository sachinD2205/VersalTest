import React from 'react'
import router from 'next/router'
import Head from 'next/head'
import styles from './documentStyles/sr1Legal.module.css'
import { Paper } from '@mui/material'

const Index = () => {
  return (
    <>
      <Head>
        <title>SR1 Illegal</title>
      </Head>
      <Paper className={styles.main}>
        <div className={styles.docWrapper}>
          <table className={styles.headTable}>
            <tbody className={styles.tableBody}>
              <tr>
                <td rowSpan={4} className={styles.borderedBody}>
                  <img
                    src='/logo.png'
                    alt='PCMC Logo'
                    className={styles.pcmcLogo}
                  />
                </td>
                <td className={styles.nonBorderedBody}>
                  <b className={styles.labelHeading}>
                    पिंपरी-चिंचवड महानगरपालिका
                  </b>
                </td>
                <td className={styles.borderedBody}>
                  <b>विभागीय कार्यालय</b>
                </td>
                <td className={styles.borderedBody}>110</td>
              </tr>
              <tr>
                <td className={styles.nonBorderedBody}>
                  <b className={styles.labelSubHeading1}>
                    करआकारणी व करसंकलन विभाग
                  </b>
                </td>
                <td className={styles.borderedBody}>
                  <b>गट व ब्लॉक क्रमांक</b>
                </td>
                <td className={styles.borderedBody}>111</td>
              </tr>
              <tr>
                <td className={styles.nonBorderedBody}>
                  <label className={styles.labelSubHeading2}>
                    {
                      '(महाराष्ट्र महानगरपालिका अधिनियम प्रकरण ८ नियम २० (२) १५ (२) अन्वये)'
                    }
                  </label>
                </td>
                <td className={styles.borderedBody}>
                  <b>इमारत क्रमांक</b>
                </td>
                <td className={styles.borderedBody}>112</td>
              </tr>
              <tr>
                <td className={styles.nonBorderedBody}>
                  <b className={styles.labelSubHeading1}>
                    मालमत्ता कर आकारणीबाबत विशेष नोटीस
                  </b>
                </td>
                <td className={styles.borderedBody}>
                  <b>मालमत्ता क्रमांक</b>
                </td>
                <td className={styles.borderedBody}>113</td>
              </tr>
              <tr>
                <td
                  colSpan={2}
                  className={`${styles.borderedBody} ${styles.labelSubHeading2}`}
                >
                  <b>बांधकाम: अधिकृत/अनधिकृत/परवाना आहे, भोगवटापत्रक नाही</b>
                </td>
                <td
                  colSpan={2}
                  className={`${styles.borderedBody} ${styles.labelSubHeading2}`}
                >
                  <b>नवीन/वाढीव/वापरात बदल</b>
                </td>
              </tr>
            </tbody>
          </table>

          <div className={styles.docBody}>
            <table style={{ marginTop: 20 }}>
              <tbody>
                <tr>
                  <td style={{ paddingLeft: 0 }}>प्रती,</td>
                </tr>
                <tr>
                  <td className={styles.details1} style={{ paddingLeft: 0 }}>
                    <b>मालकाचे नाव</b>
                  </td>
                  <td className={styles.details2}>: </td>
                  <td className={styles.details3}> जोई त्रीबियानी </td>
                </tr>
                <tr>
                  <td className={styles.details1} style={{ paddingLeft: 0 }}>
                    <b>भोगवटादाराचे नाव</b>
                  </td>
                  <td className={styles.details2}>: </td>
                  <td className={styles.details3}>फिबी बुफे</td>
                </tr>
                <tr>
                  <td className={styles.details1} style={{ paddingLeft: 0 }}>
                    <b>मालमत्तेचा स्थानिक पत्ता</b>
                  </td>
                  <td className={styles.details2}>: </td>
                  <td className={styles.details3}>
                    सेन्ट्रल पर्क, मेनहटन, निऊ योर्क
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className={styles.docBodyParagraph}>
                    आपणास महाराष्ट्र महानगरपालिका अधिनियम, प्रकरण ८, नियम २० (२)
                    / १५ (२) अन्वये नोटीस देणेत येते की, आपली पिंपरी चिंचवड
                    महानगरपालिका _____________ हद्दीतील ________________
                    उपविभागात <b>इमारत / जमीन</b>
                    असून सध्या अस्तित्वात असलेल्या कर निर्धारण यादीत{' '}
                    <b>नवीन / वाढीव इमारतीची /जमीनीची</b>
                    कर निर्धारण यादी तयार केली असून सदर मालमत्ते वर सन{' '}
                    <b>/ /२०२…</b>
                    पासून कराची आकारणी करणेकामी तुमचे मालमत्तेचे खालीलप्रमाणे
                    करयोग्य मूल्य ठरविले आहे.
                  </td>
                </tr>
              </tbody>
            </table>
            <table className={styles.bodyTable}>
              <tbody>
                <tr>
                  <th className={styles.borderedBody}>
                    <b>वापर</b>
                  </th>
                  <th className={styles.borderedBody}>
                    <b>आकारणी क्षेत्रफळ (चौ. फुट )</b>
                  </th>
                  <th className={styles.borderedBody}>
                    <b>करयोग्य मूल्य</b>
                  </th>
                  <th className={styles.borderedBody}>
                    <b>आकारणी कालावधी पासून</b>
                  </th>
                </tr>
                <tr>
                  <td className={styles.borderedBody}>
                    <b>निवासी</b>
                  </td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                </tr>
                <tr>
                  <td className={styles.borderedBody}>
                    <b>बिगर निवासी</b>
                  </td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                </tr>
                <tr>
                  <td className={styles.borderedBody}>
                    <b>औद्योगिक</b>
                  </td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                </tr>
                <tr>
                  <td className={styles.borderedBody}>
                    <b>मोकळी जमीन</b>
                  </td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                </tr>
                <tr>
                  <td className={styles.borderedBody}>
                    <b>पार्कींग</b>
                  </td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                </tr>
                <tr>
                  <td className={styles.borderedBody}>
                    <b>एकुण</b>
                  </td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                  <td className={styles.borderedBody}></td>
                </tr>

                <tr>
                  <td colSpan={4} className={styles.docBodyParagraph}>
                    सबब, या ठरविणेत आलेल्या करयोग्य मूल्यांचे रकमेबाबत अथवा कर
                    आकारणी रजिस्टर मधील इतर कोणत्याही नोंदीबाबत आपली काही हरकत
                    अगर तक्रार असेल तर ती उक्त कायद्यातील प्रकरण ८, नियम १६ ला
                    अधिन राहून सबळ कारणासह व पुराव्याच्या कागदपत्रासह लेखी अर्ज
                    <b>मा. सहायक आयुक्त (कर) / प्रशासन अधिकारी (कर)</b>
                    यांचे नावे महापालिकेचे _______________ विभागीय कार्यालय
                    /करसंकलन मुख्यालय या ठिकाणी दि. / /२०२.. रोजी दुपारी ३.००
                    वा. पर्यंत मिळेल अशा रितीने पोष्टाने पाठवावी किंवा समक्ष
                    दाखल करावी व पोहोच घ्यावी, दिनांक / / २०२.. रोजी दुपारी ३.००
                    नंतर आलेल्या किंवा योग्य कारणे न देता आलेल्या हरकती किंवा
                    तक्रारी अर्जाचा विचार केला जाणार नाही. तसेच मुदतीत हरकत
                    किंवा तक्रार अर्ज न आलेस करयोग्य मूल्य व इतर नोंदी व आपणास
                    मान्य आहेत असे समजून त्या कायम केल्या जातील.
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className={styles.docBodyParagraph}>
                    महाराष्ट्र महानगरपालिका अधिनियमातील कलम 267अ नुसार आपल्या
                    अवैध/ <b>अनधिकृत</b> मालमत्तेचे किंवा मालमत्तेच्या भागाचे
                    अवैधरित्या झालेल्या बांधकामांना ते बांधकाम जोपर्यंत अवैध
                    बांधकाम म्हणुन राहील, तोपर्यंत अधिनियमातील तरतूदीनुसार /
                    शासन आदेशानुसार शास्ती भरण्यास पात्र राहील. तसेच या
                    बांधकामावर मालमत्ता करआकारणी व अवैध बांधकाम शास्तीची आकारणी
                    केली म्हणजे सदरचे बांधकाम विनियमित झाले आहे असा अन्वयार्थ
                    लावला जाणार नाही. अधिनियमातील कलम 260 व 397 अ तरतुदीनुसार
                    अवैध/ अनधिकृत बांधकाम निष्कासित करणेची संबंधीत वैधानिक
                    महामंडळ यांनी कारवाई केल्यास आपणास प्रतिबंध/ विरोध/ अटकाव
                    करता येणार नाही किंवा न्यायालयात दावा दाखल करता येणार नाही,
                    तसेच सदर अवैध/ अनधिकृत मालमत्ते वर कोणत्याही स्वरुपाचा
                    कोणत्याही वित्तीय संस्थेचा बोजा असेल व सदर मालमत्ता कलम 260
                    व 397 अ चे तरतुदी प्रमाणे निष्कासीत केली तर, निष्कासित
                    कार्यवाही करणारी संस्था सदर बोजास जबाबदार रहाणार नसुन
                    निष्कासित करणेचा खर्च वसुल करणेत येईल.
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className={styles.docBodyParagraph}>
                    मालमत्तेच्या कर योग्य मूल्याबाबत, मालकी हक्काबाबत किंवा
                    मालमत्तेच्या वर्णनासह इतर नोंदी बाबतचा तपशील _____________
                    येथील महानगरपालिकेच्या करसंकलन विभागीय कार्यालयात सुट्टीचे
                    दिवस सोडून कार्यालयीन वेळेत सकाळी ११.०० ते ३.०० वाजेपर्यंत
                    पहावयास मिळेल.
                  </td>
                </tr>
                <tr>
                  <td style={{ paddingTop: 75 }}></td>
                </tr>
                <tr>
                  <td colSpan={3}></td>
                  <th>प्रशासन अधिकारी (करसंकलन)</th>
                </tr>
                <tr>
                  <td colSpan={3}>क्रमांक : कर/ / /एस आर-१/ /२०२..</td>
                  <td className={styles.nonBorderedBody} style={{ padding: 0 }}>
                    पिंपरी चिंचवड महानगरपालिका
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>दिनांक : / /२०२…</td>
                  <td className={styles.nonBorderedBody} style={{ padding: 0 }}>
                    पिंपरी ४११०१८.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className={styles.dividerWrapper}>
            <div className={styles.divider}></div>
          </div>
          {/* <table className={styles.footTable}>
            <tbody>
              <tr>
                <td>नोटीस स्विकारणा-याचे नाव :</td>
                <td></td>
                <td colSpan={2}>नोटीस बजावणा-याचे नाव :</td>
              </tr>
              <tr>
                <td>सही : </td>
                <td></td>
                <td colSpan={2}>सही : </td>
              </tr>
              <tr>
                <td colSpan={2}>दिनांक : / /२०२… </td>
                <td></td>
              </tr>
            </tbody>
          </table> */}
          <div className={styles.docFooter}>
            <div className={styles.leftFooter}>
              <label>नोटीस स्विकारणा-याचे नाव :</label>
              <label>सही : </label>
              <label>दिनांक : / /२०२…</label>
            </div>
            <div className={styles.rightFooter}>
              <label>नोटीस बजावणा-याचे नाव:</label>
              <label>सही : </label>
            </div>
          </div>
        </div>
      </Paper>
    </>
  )
}

export default Index
