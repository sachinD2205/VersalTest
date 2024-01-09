import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../../../URLS/urls";
import styles from "./printForm.module.css";
import { catchExceptionHandlingMethod } from "../../../../../../util/util";

const Index = () => {
  const methods = useForm({
    // criteriaMode: 'all',
    // resolver: yupResolver(dataValidation),
    // mode: 'onChange',
  });
  const {
    reset,
    method,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = methods;
  const componentRef = useRef(null);
  let user = useSelector((state) => state.user.user);
  const [allData, setAllData] = useState("");
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  const language = useSelector((state) => state?.labels.language);
  const [religions, setReligions] = useState([]);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  // getReligion
  const getReligions = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`)
      .then((r) => {
        setReligions(
          r.data.religion.map((row) => ({
            id: row.id,
            religion: row.religion,
            religionMr: row.religionMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  // Status at time mR
  const [witnessRelations, setwitnessRelations] = useState([]);

  // getStatus at time mR
  const getwitnessRelations = () => {
    axios
      .get(`${urls.MR}/master/relation/getAll`)
      .then((r) => {
        setwitnessRelations(
          r.data.relation.map((row) => ({
            id: row.id,
            relation: row.relation,
            relationMar: row.relationMar,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  //Mr Status
  const [gStatusAtTimeMarriageKeys, setgStatusAtTimeMarriageKeys] = useState(
    [],
  );

  const getgStatusAtTimeMarriageKeys = () => {
    axios
      .get(`${urls.MR}/master/maritalstatus/getAll`)
      .then((r) => {
        setgStatusAtTimeMarriageKeys(
          r.data.maritalStatus.map((row) => ({
            id: row.id,
            statusDetails: row.statusDetails,
            statusDetailsMar: row.statusDetailsMar,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };

  //       ====================>
  useEffect(() => {
    getReligions();
    getwitnessRelations();
    getgStatusAtTimeMarriageKeys();
  }, []);
  useEffect(() => {
    console.log("router.query", router.query.id);

    if (router.query.serviceId == 10) {
      axios
        .get(
          `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router.query.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((resp) => {
          setAllData(resp?.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  }, [religions, witnessRelations]);

  const [document, setDocument] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${urls.CFCURL}/master/serviceWiseChecklist/getAllByServiceId?serviceId=10`,
      )
      .then((r) => {
        setDocument(r.data.serviceWiseChecklist);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  console.log("allDatadocument", document);
  return (
    <>
      <div>
        <ComponentToPrint
          ref={componentRef}
          allData={allData}
          religions={religions}
          witnessRelations={witnessRelations}
          gStatusAtTimeMarriageKeys={gStatusAtTimeMarriageKeys}
          document={document}
        />
      </div>
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    console.log(
      "this.stateeeeee",
      this.props.document,
      this.props.witnessRelations,
    );
    const allData = this.props.allData;
    const document = this.props.document;
    return (
      <div class={styles.report}>
        <div class={styles.titleContainer}>
          <div class={styles.titleItem}>
            <div class={styles.photos}>
              <p>वर फोटो</p>
              <p>Groom Photo</p>
            </div>
          </div>
          <div class={styles.titleItem}>
            <p>
              <b>
                पिपरी चिंचवड महानगरपालिका <br></br>
                नमुना 'ड' <br></br>
                FORM “D” <br></br>
                Memorandum Of Marriage <br></br>
                (पहा कलम ६ आणि ५) <br></br>
                (See Section 6 and Rule 5 )
              </b>
            </p>
          </div>
          <div class={styles.titleItem}>
            <div class={styles.photosBride}>
              <p>वधू फोटो</p>
              <p>Bride Photo</p>
            </div>
          </div>
        </div>
        <div class={styles.main}>
          <p>
            १. विवाहाचा दिनांक:-
            <b>{moment(allData.marriageDate).format("DD-MM-YYYY")} </b>
            <br></br>
            1) Date of Marriage:-
            <b>{moment(allData.marriageDate).format("DD-MM-YYYY")}</b>
            <br></br>
            २. विवाहाचे ठिकाण (संपुर्ण तपशिलासह):-
            <b>{allData.pplaceOfMarriageMr}</b>
            <br></br>
            2) Place Of Marriage (With Full Particulars ):-
            <b>{allData.pplaceOfMarriage}</b>
            <br></br>
            ३. पक्षकारांमधील विवाह ज्या व्यक्तीगत कायद्यान्वये संपन्न झाला
            (संपुर्ण तपशिलासह):-<b>{allData.lawOfMarriageMr}</b> <br></br>
            3) Personal Law According to Which the Marriage between the parties
            was solemnized:-<b>{allData.lawOfMarriage}</b> <br></br>
            ४. (अ) पतीचे नाव (प्रथम आडनावासह पुर्ण नाव):-
            <b>
              {allData.glNameMr} {allData.gfNameMr} {allData.gmNameMr}
            </b>{" "}
            <br></br>
            4) (a) Name of the Husband (Full name beginning with Surname):-
            <b>
              {allData.glName} {allData.gfName} {allData.gmName}{" "}
            </b>
            <br></br>
            (ब) पतीला दुस-या नावाने (कोणतेही असो) ओळखत असल्यास ते नाव/ ती नावे:-
            <b>{allData.gotherNameMr}</b>
            <br></br>
            (b) Other name (if any) by which The husband is known:-
            <b>{allData.gotherName}</b>
            <br></br>
            (क) धर्म:-
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (i) जन्माने:-{" "}
            <b>
              {" "}
              {
                this.props.religions.find(
                  (item) => item.id == allData?.greligionByBirth,
                )?.religionMr
              }
            </b>
            <br></br>
            (c) Religion:- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(i)
            By birth{" "}
            <b>
              {" "}
              {
                this.props.religions.find(
                  (item) => item.id == allData?.greligionByBirth,
                )?.religion
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (ii) दुसरा धर्म स्विकारला असल्यास (कोणताही असल्यास):-
            <b>
              {
                this.props.religions.find(
                  (item) => item.id == allData?.greligionByAdoption,
                )?.religionMr
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (ii) By adoption (if any):-
            <b>
              {
                this.props.religions.find(
                  (item) => item.id == allData?.greligionByAdoption,
                )?.religion
              }
            </b>
            <br></br>
            (ड) विवाह विधी ज्या तारखेला संपन्न झाला असेल त्या तारखेस असलेले वय:-{" "}
            <b>{allData.gage} वर्षे</b> <br></br>
            (d) Age as on the date of solemnization Of Marriage:-
            <b> {allData.gage} Years</b> <br></br>
            (इ) व्यवसाय कार्यालयाच्या पत्यासहः-व्यवसाय:
            <b> {allData.goccupationMr}</b> पत्ता:
            <b> {allData.goccupationAddressMr}</b>
            <br></br>
            (e) Occupation along with office Address:-Occupation:{" "}
            <b> {allData.goccupation}</b> Address:
            <b> {allData.goccupationAddress}</b>
            <br></br>
            (फ) विवाहाच्या वेळेची स्थिती:-{" "}
            <b>
              {
                this.props.gStatusAtTimeMarriageKeys.find(
                  (item) => item.id == allData?.gstatusAtTimeMarriageKey,
                )?.statusDetailsMar
              }
            </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* अविवाहित/ विधूर/ घटस्फोटीत */}
            <br></br>
            (f) Status at the time of marriage:-{" "}
            <b>
              {
                this.props.gStatusAtTimeMarriageKeys.find(
                  (item) => item.id == allData?.gstatusAtTimeMarriageKey,
                )?.statusDetails
              }
            </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* Unmarried/ Widower/Divorced */}
            <br></br>
            (ग) पतीचा पुर्ण पत्ता:-
            <b>
              {allData.gbuildingNoMr}, {allData.gbuildingNameMr},{" "}
              {allData.glandmarkMr}, {allData.gcityNameMr}, {allData.gpincode}
            </b>
            <br></br>
            (g) Full address of the husband At the time of marriage:-
            <b>
              {allData.gbuildingNo}, {allData.gbuildingName},{" "}
              {allData.glandmark}, {allData.gcityName}, {allData.gpincode}
            </b>
            <br></br>
            (ह) पतीची दिनांकासह सही:-<br></br>
            (h) Signature of the husband with date:-<br></br>
            ५. (अ) पत्नीचे (लग्नापुर्वीचे नाव) (प्रथम आडनावासह पुर्ण नाव):-
            <b>
              {allData.blNameMr} {allData.bfNameMr} {allData.bmNameMr}{" "}
            </b>
            <br></br>
            5. (a) Name Of the Wife (Maiden Name) (Full name beginning with
            Surname):-
            <b>
              {allData.blName} {allData.bfName} {allData.bmName}
            </b>{" "}
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;(ब) पत्नीला दुस-या नावाने (कोणतेही असल्यास)
            ओळखत असल्यास ते नाव/नावे:-<b>{allData.botherNameMr}</b> <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;(b) Other name (if any) by Which The wife is
            known:-<b>{allData.gotherName}</b>
            <br></br>
            (क) धर्म:-
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (i) जन्माने:-{" "}
            <b>
              {" "}
              {
                this.props.religions.find(
                  (item) => item.id == allData?.breligionByBirth,
                )?.religionMr
              }
            </b>
            <br></br>
            (c) Religion:- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(i)
            By birth:-
            <b>
              {" "}
              {
                this.props.religions.find(
                  (item) => item.id == allData?.breligionByBirth,
                )?.religion
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (ii) दुसरा धर्म स्विकारला असल्यास (कोणताही असल्यास):-{" "}
            <b>
              {
                this.props.religions.find(
                  (item) => item.id == allData?.breligionByAdoption,
                )?.religionMr
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (ii) By adoption (if any):-{" "}
            <b>
              {
                this.props.religions.find(
                  (item) => item.id == allData?.breligionByAdoption,
                )?.religionMr
              }
            </b>
            <br></br>
            (ड) विवाह विधी ज्या तारखेला संपन्न झाला असेल त्या तारखेस असलेले वय:-
            <b> {allData.bage} वर्षे </b>
            <br></br>
            (d) Age as on the date of solemnization Of Marriage:-{" "}
            <b>{allData.bage} Years</b>
            <br></br>
            (इ) विवाहाच्या वेळेची स्थिती:-{" "}
            <b>
              {
                this.props.gStatusAtTimeMarriageKeys.find(
                  (item) => item.id == allData?.bstatusAtTimeMarriageKey,
                )?.statusDetailsMar
              }
            </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* अविवाहित/ विधूर/ घटस्फोटीत */}
            <br></br>
            (e) Status at the time of marriage:-{" "}
            <b>
              {
                this.props.gStatusAtTimeMarriageKeys.find(
                  (item) => item.id == allData?.bstatusAtTimeMarriageKey,
                )?.statusDetails
              }
            </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {/* Unmarried/ Widower/Divorced */}
            <br></br>
            (फ) विवाहाच्या पुर्वीचा अथवा विवाहाच्या वेळचा पत्नीचा पुर्ण पत्ता:
            <b>
              {" "}
              {allData.bbuildingNoMr}, {allData.bbuildingNameMr},{" "}
              {allData.blandmarkMr}, {allData.bcityNameMr}, {allData.bpincode}
            </b>
            <br></br>
            (f) Full address of the wife At the time of marriage:-
            <b>
              {allData.bbuildingNo}, {allData.bbuildingName},{" "}
              {allData.blandmark}, {allData.bcityName}, {allData.bpincode}
            </b>
            <br></br>
            (ग) पत्नीची दिनांकासह सही:-<br></br>
            (g) Signature of the wife with date:-<br></br>
            ६. साक्षीदार - <br></br>
            6. Witness-
            {/* *******************witness start******************************** */}
            {allData &&
              allData?.witnesses.map((item, i) => (
                <>
                  <p class={styles.witnessContainer}>
                    <div class={styles.religonItem1}>
                      <div class={styles.witnessphotos}>
                        <p>साक्षीदार फोटो</p>
                        <p>Witness Photo</p>
                      </div>
                    </div>
                    <div class={styles.religonItem}>
                      ({i + 1}) (एक) &nbsp;नाव:-{" "}
                      <b>
                        {item.witnessFNameMr} {item.witnessMNameMr}{" "}
                        {item.witnessLNameMr}
                      </b>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;वयः{" "}
                      <b>{item.witnessAge} वर्षे </b>
                      <br></br>
                      (i)&nbsp;&nbsp;&nbsp;&nbsp;Name:-{" "}
                      <b>
                        {item.witnessFName} {item.witnessMName}{" "}
                        {item.witnessLName}
                      </b>
                      <br></br>
                      (दोन) पत्ता:-<b>{item.witnessAddressCMar}</b>
                      <br></br>
                      (ii)Address:-<b>{item.witnessAddressC}</b>
                      <br></br>
                      (तीन) व्यवसाय आणि कार्यालयाचा पत्ता:-व्यवसाय:
                      <b> {item.witnessOccupationMr}</b> पत्ता:
                      <b> {item.witnessOccupationAddressMr}</b>
                      <br></br>
                      (iii) Occupation and Office Address:-Occupation:{" "}
                      <b> {item.witnessOccupation}</b> Address:
                      <b> {item.witnessOccupationAddress}</b> <br></br>
                      (चार) विवाहीत जोडप्याशी असलेले नाते:-{" "}
                      <b>
                        {
                          this.props.witnessRelations.find(
                            (i) => i.id == item.witnessRelation,
                          )?.relationMar
                        }
                      </b>
                      <br></br>
                      (iv) Relation (if any) With the married couple:-
                      <b>
                        {
                          this.props.witnessRelations.find(
                            (i) => i.id == item.witnessRelation,
                          )?.relation
                        }
                      </b>
                      <br></br>
                      (पाच) दिनांकासह सही:-<br></br>
                      (v) Signature with date:-<br></br>
                    </div>
                  </p>
                </>
              ))}
            {/* *******************witness end******************************** */}
            ७. पुरोहित
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (अ) पुरोहिताचे नाव:-{" "}
            <b>
              {allData.pfName} {allData.pmName} {allData.plName}
            </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;वयः
            <b>{allData.page} वर्षे</b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (a) Name of the priest (if any):-{" "}
            <b>
              {allData.pfName} {allData.pmName} {allData.plName}
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (ब) पूर्ण पत्ता:-
            <b>
              {allData.pbuildingNoMr}, {allData.pbuildingNameMr},{" "}
              {allData.plandmarkMr}, {allData.pcityNameMr}, {allData.ppincode}
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (b) Full Address:-
            <b>
              {allData.pbuildingNo}, {allData.pbuildingName},{" "}
              {allData.plandmark}, {allData.pcityName}, {allData.ppincode}
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (क) धर्म:-
            <b>
              {" "}
              {
                this.props.religions.find(
                  (item) => item.id == allData?.preligionByBirth,
                )?.religionMr
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (c) Religion:-
            <b>
              {" "}
              {
                this.props.religions.find(
                  (item) => item.id == allData?.preligionByBirth,
                )?.religion
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (ई) दिंनाकासह सही:-<br></br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            (e) Signature with date:-<br></br>
            ८. या ज्ञापनासह सादर केलेले दस्तएवज <br></br>
            8. Document presented along with this memorandum<br></br>
            (१) पती वयाचा पुरावा:-
            <b>
              {
                document.find((obj) => allData.gageProofDocumentKey == obj.id)
                  ?.documentChecklistMr
              }
            </b>
            <br></br>
            (a) Husband - Age proof:-
            <b>
              {
                document.find((obj) => allData.gageProofDocumentKey == obj.id)
                  ?.documentChecklistEn
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;पत्ता पुरावा:-
            <b>
              {
                document.find(
                  (obj) => allData.gresidentialDocumentKey == obj.id,
                )?.documentChecklistMr
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;Address proof:-
            <b>
              {
                document.find((obj) => allData.gageProofDocumentKey == obj.id)
                  ?.documentChecklistEn
              }
            </b>
            <br></br>
            (२) पत्नी वयाचा पुरावा :-
            <b>
              {
                document.find((obj) => allData.bageProofDocumentKey == obj.id)
                  ?.documentChecklistMr
              }
            </b>
            <br></br>
            (b) Wife - Age proof:-
            <b>
              {
                document.find((obj) => allData.bageProofDocumentKey == obj.id)
                  ?.documentChecklistEn
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;पत्ता पूरावा:-
            <b>
              {
                document.find(
                  (obj) => allData.bresidentialDocumentKey == obj.id,
                )?.documentChecklistMr
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;Address proof:-
            <b>
              {
                document.find(
                  (obj) => allData.bresidentialDocumentKey == obj.id,
                )?.documentChecklistEn
              }
            </b>
            <br></br>
            (३) साक्षीदार क्रमांक (१) (पत्ता पुरावा):-
            <b>
              {
                document.find(
                  (obj) => allData.wfResidentialDocumentKey == obj.id,
                )?.documentChecklistMr
              }
            </b>
            <br></br>
            (c) Witness No. (1) (Address proof):-
            <b>
              {
                document.find(
                  (obj) => allData.wfResidentialDocumentKey == obj.id,
                )?.documentChecklistEn
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;साक्षीदार क्रमांक (२) (पता पुरावा):-
            <b>
              {
                document.find(
                  (obj) => allData.wsResidentialDocumentKey == obj.id,
                )?.documentChecklistMr
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;Witness No. (2) (Address proof):-
            <b>
              {
                document.find(
                  (obj) => allData.wsResidentialDocumentKey == obj.id,
                )?.documentChecklistEn
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;साक्षीदार क्रमांक (३) (पता पुरावा):-
            <b>
              {
                document.find(
                  (obj) => allData.wtResidentialDocumentKey == obj.id,
                )?.documentChecklistMr
              }
            </b>
            <br></br>
            &nbsp;&nbsp;&nbsp;Witness No. (3) (Address proof):-
            <b>
              {
                document.find(
                  (obj) => allData.wtResidentialDocumentKey == obj.id,
                )?.documentChecklistEn
              }
            </b>
            <br></br>
            (४) लग्नाचा पुरावा:-
            <b>
              {allData.uinvitationCard == "Marriage Invitation Card"
                ? "विवाह निमंत्रण पत्रिका"
                : "प्रतिज्ञापत्र"}
            </b>
            <br></br>
            (d) Marriage Proof:-<b>{allData.uinvitationCard}</b>
            <br></br>
            ९. निबंधकाकडे सादर केल्यास दिनांक:-
            <b>{moment(allData.applicationDate).format("DD-MM-YYYY")}</b>{" "}
            <br></br>
            9. Presented before the registrar on:-
            <b>{moment(allData.applicationDate).format("DD-MM-YYYY")}</b>
            <br></br>
            नोंदणी फी:-
            <br></br>
            नोंदणी क्रमांक:-<b>{allData.applicationNumber}</b>
            <br></br>
          </p>
          <p class={styles.rules}>
            <b>टीप:</b> कोणत्याही व्यक्तीने ज्ञापनामध्ये केलेले कोणतेही विधान
            अथवा प्रतिज्ञापत्र जे विशेष महत्वाचे बाबतीत खोटे असेल अथवा सादर
            केलेले कोणतेही दस्तएवज जे खोटे असल्याने त्याला / तिला माहित असेल
            अथवा जे खोटे असल्याने मानण्यास कारण असेल तो / ती व्यक्ती कलम १२ खाली
            दंडनीय कारवाईस पात्र ठरेल.<br></br>
            <b>N.B:</b> Any person making any statement or declaration in the
            memorandum, Which is false in any material particular or submits any
            documents which he / she knows or has reason to belive to be false
            shall be liable for penal action under Section 12.<br></br>
            <div class={styles.head}>
              <b>
                महाराष्ट्र विवाह नोंदणी कायदा १९९८, मुंबई विवाह नोंदणी करण्याची
                प्रक्रिया -
              </b>
            </div>
            <br></br>
            १) वधू, वर यापैंकी एकजण पिंपरी चिंचवड महानगरपालिका क्षेत्रातील
            रहिवासी असणे आवश्यक आहे. <br></br>
            २) विवाह नोंदणी फॉर्मवर वर + वधू + ३ साक्षीदारांचे पासपोर्ट साईजचे
            फोटो चिकटवावेत. फॉर्मच्या पान क्रमांक ४ वर रुपये १००/- किमतीचे कोर्ट
            फी स्टॅम्प लेबल चिकटवावेत.<br></br>
            ३) फॉर्म सोबत वर वधू यांच्या जन्म तारखेचा पुरावा म्हणुन शाळा
            सोडल्याचा दाखला/ दहावी/ बारवीचे प्रमाणपत्र / वाहनपरवाना/ पासपोर्ट/
            पॅनकार्ड /वाहन परवाना इत्यादीपैंकी एक नोटराईज्ड प्रमाणित केलेली
            झेरॉक्स प्रत जोडावी.
            <br></br>
            ४) वर+वधू ३ साक्षीदारांचे पत्याचे पुरावे म्हणुन रेशनकार्ड /लायसेन्स
            / पासपोर्ट/निवडणूक ओळखपत्र/शासकीय + कार्यालयांचे ओळखपत्र /
            संबधितांच्या नावाचा उल्लेख असणारे वीज बिल / बी.एस.एन.एल टेलीफोन बील
            यापैकी एक झेरॉक्स प्रत जोडावी. वरील सर्व झेरॉक्स प्रती अटेस्ट /
            नोटराईज्ड सत्यप्रती असणे आवश्यक आहे.<br></br>
            ५) फॉर्ममध्ये कॉलम क्रमांक ७ मध्ये पुरोहीत भटजी यांची माहिती व
            स्वाक्षरी दिनांकासहीत असावी.<br></br>
            ६) मुस्लीम व्यक्तीच्या विवाह कायद्यान्वये विवाह झाला असल्यास कॉलम ७
            मध्ये काझी यांची माहिती व दिनांकासह स्वाक्षरी असावी व निकाहनाम्याची
            अटेस्टेड प्रत जोडावी.निकाहनामा जर उर्दू भाषेत असेल तर त्याचे इंग्रजी
            किंवा मराठी भाषांतर करुन त्यावर काझी यांची स्वीक्षरी घेऊन प्रत सोबत
            जोडावी.<br></br>
            ७) पुर्ण भरलेला फॉर्म हा वधू/ वर / साक्षीदार यापैंकी एका व्यक्तीने
            सकाळी १० ते १.३० या वेळेत दाखल केल्यास फॉर्म तपासून टोकन क्रमांक व
            दिनांक, वेळ सांगितली जाईल, त्यावेळी वर+ वधू+ 3 साक्षीदार यांनी समक्ष
            हजर व्हावे. त्याचदिवशी नोंदणी पुर्ण करुन प्रमाणपत्र दिले जाईल.
            <br></br>
            ८) मुळ लग्नपत्रिका.<br></br>
            ९) वर, वधू घटास्फोटीत असलेस कोर्टाच्या हुकुमनाम्याची नोटराईड
            सत्यप्रत जोडणे आवश्यक आहे.<br></br>
            १०) लग्नपत्रिका नसलेस शासनाने दिलेल्या विहित नमुन्यातील
            प्रतिज्ञापत्र र.रु. १०० चे स्टॅम्प पेपरवर सादर करणे आवश्यक आहे. तसेच
            लग्नविधी प्रसंगिचा एक फोटो आवश्यक आहे.<br></br>
            ११) वर- वधू प्रत्येकी ३ फोटो (पासपोर्टसाईज).<br></br>
            १२) साक्षीदार प्रत्येकी २ फोटो (पासपोर्टसाईज).<br></br>
            १३) सर्व मूळ कागदपत्रे विवाह नोदंणी करतेवेळी आणणे.<br></br>
            १४) वधू वर पैकी विधवा/ विधूर असल्यास मयत पती किंवा पत्नीचा दाखला.
            <br></br>
          </p>
        </div>
      </div>
    );
  }
}
export default Index;
