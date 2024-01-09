import { useSelector } from "react-redux";
import styles from "./term.module.css";
import { Button, Checkbox, Paper } from "@mui/material";
import { useState } from "react";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { ExitToApp } from "@mui/icons-material";
import Head from "next/head";
import router from "next/router";
import { useForm } from "react-hook-form";
import { textAlign } from "@mui/system";

const TermsAndConditions = () => {
  const {
    register,
    handleSubmit,
    setValue,
    // @ts-ignore
    methods,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(petSchema),
  });
  const language = useSelector((state) => state.labels.language);
  const [TnC, setTnC] = useState(false);

  const finalSubmit = (data) => {
    router.push({
      pathname: `/newsRotationManagementSystem/transaction/newsAdvertisementRotation/create`,
      //   query: { petAnimal: data.petAnimalKey },
    });
  };

  return (
    <>
      <Head>
        {language === "en" ? (
          <title>Terms and Condition</title>
        ) : (
          <title>धोरणात्मक बाबी व अटी शर्ती</title>
        )}
      </Head>
      <Paper sx={{ margin: 5 }} className={styles.main}>
        {/* <div className={styles.title}>
          <FormattedLabel id='petLicense' />
        </div> */}
        <form onSubmit={handleSubmit(finalSubmit)}>
          <div
            className={styles.row}
            style={{ justifyContent: "center" }}
          ></div>
          <div className={styles.row}>
            {/* <label>
              Citizens coming to obtain pet license will be required to follow
              all general terms , conditions and rules as follows.
            </label> */}
            {language === "en" ? (
              <label className={styles.subHeader}>Terms and Condition</label>
            ) : (
              <label className={styles.subHeader}>
                नियम व शर्ती खालील प्रमाणे राहतील
              </label>
            )}
          </div>
          <div className={styles.terms}>
            {language === "en" ? (
              <>
                <br /> 1. The number that will be running for municipal
                advertisement is rotation Have to accept.
                <br /> 2. Took advertisement rotation from information and
                public relations department Also, mutual newspapers should not
                be given advertisements.
                <br /> 3. After receiving rotation from Information and Public
                Relations Department Publish the said advertisement in the
                relevant newspaper without delay should be given Also tender or
                other advertisement by concerned department Its main title viz.
                Pimpri Chinchwad Municipal Corporation font size 14,
                Architectural Department is font size 19 while tender
                instruction no. 1/2018- 19 is font size 9.5 as well as other
                text e.g. Tender Terms & Conditions Titles of works should be
                printed in 9.5 font size and also in English 14, 19, 8.5 and 8.5
                font size for newspapers respectively Newspapers should be
                informed to print advertisement.
                <br /> 4. Received from Information and Public Relations
                Department Newspapers that advertise in the least volume as per
                rotation Others depending on the size of the newspaper in which
                it is published Newspapers should be billed.
                <br /> 5. Multiple works in tender as per rotation 'A' Rs. 2
                crores and one or more as per rotation 'B' If the works are more
                than 2 crores but up to crores then only one for that
                Independent rotation for rotation 'A' and rotation 'B' without
                rotation should be taken.
                <br /> 6. M.N.P. within the period prescribed by the newspapers
                on the rotation list Advertisement should be published.
                Advertisement by newspapers after the prescribed period If
                printed per day Rs. 100/- for late fee related advertisement
                should be deducted from the bill.
                <br /> 7. The concerned departments shall submit the
                advertisement draft evening. till 4.00 p.m By sending in front
                or through e-mail to the concerned newspapers Confirm receipt of
                advertisement through mobile phone.
                <br /> 8. Draft advertisement for national level newspapers
                Should be published in Hindi or English language only.
                <br /> 9. In newspaper by concerned department after receipt of
                rotation If the advertisement is not given for publicity, the
                reasons thereof Hon. Commissioner or Hon. It should be submitted
                immediately to the Additional Commissioner and after his
                approval A copy should be submitted to the Information and
                Public Relations Department.
                <br /> 10. Newspapers within 15 days from publication of
                advertisement Advertisement bills should be submitted to the
                concerned department. Then submit Newspaper advertisement bills
                made will not be accepted Also no payment will be received.
                Advertisement by concerned departments Received within 15 days
                from the date of publication Payment of newspaper bills should
                be completed in one month.
                <br /> 11. Municipal emblem and advertisement number in
                advertisement Notice of publication should be given to concerned
                newspapers. Municipal emblem / advertisement number / one of
                advertisement draft Penalty if a word or a line is not published
                by a newspaper in an advertisement Hence 10% of the bill amount
                to the concerned newspaper To be deducted from advertisement
                bill. Such certificate is given in the bill should come Also
                recovery of some errors / objections in audit objection If
                found, immediate recovery through concerned department head
                should come And such settlement report should be sent to
                Information and Public Relations Department.
                <br /> 12. Information and public relations from all
                departments/offices of the municipality A letter seeking
                rotation is given to the department. Along with office Draft
                advertisement / tender works to be submitted for publication of
                approved proposals should be provided with updated information.
                The said letter is expected to be advertised Information and
                Public Relations at least 3 days before publication date must be
                given to the department.
                <br /> 13. Some difficulties in the new advertising/accepted
                policy If it is created or needs to be modified, then complete
                it Right to take decision Hon. Remains to the Commissioner.
                <br /> 14. Advertisement bills of circulars by concerned
                department as per rules Preparation and payment of bills by
                making provisions from Information and Public Relations
                Department Further action should be taken. Also accounts for
                payment of advertising bills should be sent to the department.
                <br /> 15. Implementation Order of the said Rotation Policy
                Circular The circular was adopted from the date of issue.
                happened should come Also come till next years rotation is
                decided
              </>
            ) : (
              <>
                <br /> १. मनपाच्या जाहिरातीसाठी जो क्रमांक चालु असेल ते रोटेशन
                स्विकारावे लागेल.
                <br /> २. माहिती व जनसंपर्क विभागाकडून जाहिरात रोटेशन घेतल्या
                शिवाय परस्पर वृत्तपत्रांना जाहिराती देण्यात येवू नयेत.
                <br /> ३. माहिती व जनसंपर्क विभागाकडून रोटेशन प्राप्त झालेनंतर
                सदरची जाहिरात विनाविलंब संबंधित वृत्तपत्रामध्ये प्रसिध्दिस
                देण्यात यावी. तसेच संबंधित विभागाने निविदा किंवा इतर जाहिरात
                यांचे मुख्य शिर्षक उदा. पिंपरी चिंचवड महानगरपालिका हा फॉन्ट साईज
                १४, स्थापत्य विभाग हा फॉन्ट साईज १९ तर निविदा सुचना क्र. १/२०१८-
                १९ हा फॉन्ट साईज ९.५ तसेच इतर मजकुराचा उदा. निविदा अटी शर्ती व
                कामाची नावे ९.५ या फॉन्ट साईज मध्ये छापणेस तसेच इंग्रजी
                वृत्तपत्रे यांना अनुक्रमे १४,१९,८.५ व ८.५ या फ़ॉन्ट साईझ प्रमाणे
                जाहिरात छापणेस वृत्तपत्रांना कळविण्यात यावे.
                <br /> ४. माहिती व जनसंपर्क विभागाकडून प्राप्त झालेल्या
                रोटेशननुसार ज्या वृत्तपत्रांने कमीत कमी आकारमानात जाहिरात
                प्रसिध्द केली असेल त्या वृत्तपत्राच्या आकारमानानुसार इतर
                वृत्तपत्रांना बिले अदा करण्यात यावीत.
                <br /> ५. रोटेशन 'अ' नुसार निविदेमध्ये एकापेक्षा जास्त कामे ही
                र.रू. २ कोटीपर्यंत असल्यास तसेच रोटेशन 'ब' नुसार एक किंवा जास्त
                कामे २ कोटीपेक्षा जास्त परंतु कोटीपर्यंत असल्यास त्यासाठी एकच
                रोटेशन न घेता रोटेशन 'अ' व रोटेशन 'ब' साठी स्वतंत्र रोटेशन
                घेण्यात यावे.
                <br /> 6. म.न.पा. रोटेशन यादीवरील वृत्तपत्रांनी विहित मुदतीमध्ये
                जाहिरात प्रसिद्ध करावी. विहित मुदतीनंतर वृत्तपत्रांनी जाहिरात
                छापल्यास प्रतिदिन र.रु. १००/- विलंब शुल्क संबंधित जाहिरातीच्या
                बिलातून वजा करण्यात यावी.
                <br /> ७. संबंधित विभागांनी जाहिरात मसूदा सायं. ४.०० वा पर्यंत
                संबंधित वृत्तपत्रांना समक्ष अथवा ई-मेलद्वारे पाठवण्यात येऊन
                भ्रमणध्वनीद्वारे जाहिरात मिळाल्याची खातरजमा करावी.
                <br /> ८. राष्ट्रीय स्तरावरील वृत्तपत्रांचा जाहिरातीचा मसूदा
                केवळ हिंदी अथवा इंग्रजी भाषेमध्येच प्रसिद्ध करावा.
                <br /> ९. रोटेशन प्राप्तीनंतर संबंधित विभागाने वृत्तपत्रामध्ये
                जाहिरात प्रसिद्धीसाठी न दिल्यास त्याची कारणे मा. आयुक्त अथवा मा.
                अतिरिक्त आयुक्त यांचेकडे त्वरित सादर करावी व मान्यतेनंतर त्याची
                एक प्रत माहिती व जनसंपर्क विभागाकडे सादर करावी.
                <br /> १०. जाहिरात प्रसिध्द झालेपासून १५ दिवसात वृत्तपत्रांनी
                संबंधित विभागाकडे जाहिरात बिले सादर करावीत. त्यानंतर सादर
                केलेल्या वृत्तपत्रांची जाहिरात बिले स्वीकारण्यात येणार नाहीत
                तसेच अदायगीस प्राप्त राहणार नाहीत. संबंधित विभागांनी जाहिरात
                प्रसिद्धीच्या दिनांकापासून १५ दिवसात प्राप्त झालेल्या
                वृत्तपत्रांची बिले अदायगीची कार्यवाही एक महिन्यात पूर्ण करावी.
                <br /> ११. महापालिकेचे बोधचिन्ह व जाहिरात क्रमांक जाहिरातीमध्ये
                प्रसिध्द करण्याच्या सूचना संबंधित वृत्तपत्रांना देण्यात याव्यात.
                मनपाचे बोधचिन्ह / जाहिरात क्रमांक / जाहिरात मसुद्यातील एखादा
                शब्द अथवा एखादी ओळ वृत्तपत्राने जाहिरातीत प्रसिध्द न केल्यास दंड
                म्हणून बिलाच्या रकमेच्या १०% रक्कम संबंधित वृत्तपत्राच्या
                जाहिरात बिलामधून वजा करण्यात यावेत. तसा दाखला बिलामध्ये देण्यात
                यावा. तसेच लेखापरिक्षण आक्षेपामध्ये काही त्रुटी / आक्षेप वसुली
                आढळून आल्यास संबंधित विभागप्रमुखांमार्फत त्वरित वसुली करण्यात
                यावी. व तसा पुर्तता अहवाल माहिती व जनसंपर्क विभागाकडे पाठवावा.
                <br /> १२. मनपाच्या सर्व विभागा/ कार्यालयाकडून माहिती व जनसंपर्क
                विभागाकडे रोटेशन मिळणेकामी पत्र दिले जाते. त्यासोबत कार्यालयीन
                मंजूर प्रस्ताव प्रसिध्दिसाठी यावयाचा मसुदा जाहिरात / निविदा कामे
                अद्ययावत माहितीसह देण्यात यावी. सदरचे पत्र जाहिरात अपेक्षित
                प्रसिद्धी दिनांकापूर्वी किमान ३ दिवस अगोदर माहिती व जनसंपर्क
                विभागाकडे देणे आवश्यक आहे.
                <br /> १३. नव्याने जाहिराती देणे/ मान्य धोरणात काही अडचणी
                निर्माण झाल्यास अगर फेरबदल करणे आवश्यक असल्यास याबाबत संपुर्ण
                निर्णय घेण्याचा अधिकार मा. आयुक्त यांना राहिल
                <br /> १४. संबंधित विभागाने वृतपत्रांची जाहिरात बिले नियमानुसार
                तयार करून माहिती व जनसंपर्क विभागाकडून तरतुद टाकून बिले अदायगीची
                पुढील कार्यवाही करावी. तसेच जाहिरातीचे बिले अदायगीकरिता लेखा
                विभागाकडे पाठवावी
                <br /> १५. सदरच्या रोटेशन धोरण परिपत्रकाची अंमलबजावणी आदेश
                निर्गमित दिनांकापासून करण्यात परिपत्रकाचा अवलंब कराया. झालेल्या
                यावी. तसेच पुढील वर्षांचे रोटेशन निश्चित होईपर्यंत या
                <br />
                <br />
              </>
            )}

            {/* <div className={styles.row} style={{ justifyContent: "right" }}>
              {language == "en" ? (
                <b>
                  Signature/- <br />
                  Commissioner <br />
                  Pimpri Chinchwad Municipal Corporation Pimpri - 18
                </b>
              ) : (
                <b>
                  सही/- <br />
                  आयुक्त <br />
                  पिंपरी चिंचवड महानगरपालिका पिंपरी - १८{" "}
                </b>
              )}
            </div> */}
          </div>
          <div
            className={styles.row}
            style={{ justifyContent: "center", columnGap: 10 }}
          >
            <Checkbox
              onChange={() => {
                setTnC(!TnC);
              }}
            />
            {language == "en" ? (
              <span>
                I have read and agreed to all the terms and conditions
              </span>
            ) : (
              <span>
                मी सर्व अटी व शर्ती वाचल्या आहेत आणि त्यांच्याशी सहमत आहे
              </span>
            )}
          </div>
          <div className={styles.row} style={{ justifyContent: "center" }}>
            <Button
              size="small"
              sx={{ margin: 2 }}
              disabled={!TnC}
              variant="contained"
              color="success"
              type="submit"
            >
              <FormattedLabel id="agreeAndNext" />
            </Button>
            <Button
              size="small"
              color="error"
              variant="outlined"
              endIcon={<ExitToApp />}
              onClick={() => {
                router.back();
              }}
            >
              <FormattedLabel id="back" />
            </Button>
          </div>
        </form>
      </Paper>
    </>
  );
};

export default TermsAndConditions;
