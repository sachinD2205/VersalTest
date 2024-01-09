import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "./OutputGenrationLetter.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { useSelector } from "react-redux";
const OutputGenrationLetter = () => {
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
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels?.language);

  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [data, setdata] = useState();
  const [village, setVillage] = useState();

  const getAllData = (data) => {
    console.log("1234", router?.query?.applicationId);

    if (router?.query?.applicationId) {
      axios
        .get(
          `${urls.TPURL}/transaction/zoneCertificate/getById?id=${router?.query?.applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          setdata(res.data);
          console.log("loi recept data", res.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };
  const getVillages = () => {
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setVillage(
          res.data.village.map((j) => ({
            id: j.id,
            villageEn: j.villageName,
            villageMr: j.villageNameMr,
          })),
        );
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
  useEffect(() => {
    getAllData();
    getVillages();
  }, [router?.query?.applicationId]);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    router.push({ pathname: "/homepage" });
  };
  useEffect(() => {
    console.log("router?.query", router?.query);
    reset(router?.query);
  }, []);
  // view
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={data} village={village} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            swal({
              title: "Exit?",
              text: "Are you sure you want to exit this Record ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                swal("Record is Successfully Exit!", {
                  icon: "success",
                });
                router.back();
              } else {
                swal("Record is Safe");
              }
            });
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
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div style={{ paddingTop: "2vh" }}>
                  <img src="/logo.png" alt="" height="120vh" width="120vw" />
                </div>
              </div>

              <div className={styles.logo}>
                <div style={{ paddingTop: "2vh" }}>
                  <img
                    src="/rts_servicelogo.png"
                    alt=""
                    height="120vh"
                    width="120vw"
                  />
                </div>
              </div>
            </div>
            <div className={styles.header}>
              <div className={styles.prati}>
                <h4>
                  प्रती , <br />
                  अर्जदार: {this?.props?.data?.applicantNameMr} <br />
                  रा:{" "}
                  {
                    this.props?.village?.find(
                      (item) => item.id == this.props?.data?.village,
                    )?.villageMr
                  }{" "}
                  <br />
                  जिल्हा: पुणे
                  <br />
                  मोबाईल नं: {this?.props?.data?.mobile}
                </h4>
              </div>
              <div className={styles.middle}>
                <h4>
                  पिंपरी चिंचवड महानगरपालिका <br />
                  पिंपरी १८ <br />
                  नगररचना व विकास विभाग, <br />
                  क्र.नरवी/कावी/ चऱ्होली /टे.क्र.३०/२/२०२१
                  {/* टोकन नं :______ */}
                  <br />
                  अर्ज.क्र: {this?.props?.data?.applicationNumber}
                  <br /> दि.{" "}
                  {" " +
                    moment(
                      this?.props?.data?.applicationDate,
                      "YYYY-MM-DD",
                    ).format("DD-MM-YYYY")}
                </h4>
              </div>
            </div>
            <div className={styles.vishay}>
              <h4>
                विषय - झोन दाखला मिळणेबाबत. <br />
                संदर्भ - आपला दि .{" "}
                {" " +
                  moment(
                    this?.props?.data?.applicationDate,
                    "YYYY-MM-DD",
                  ).format("DD-MM-YYYY")}{" "}
                रोजीचा अर्ज{" "}
              </h4>
            </div>
            <div className={styles.contain}>
              <h4>
                &nbsp;&nbsp;&nbsp;महोदय / महोदया <br />
                झोन दाखला देण्यात येतो की , पिंपरी चिंचवड महानगरपालिकेच्या वाढीव
                क्षेत्राची महाराष्ट्र प्रादेशिक व नगररचना अधिनियम,१९६६ चे कलम
                ३१(१) नुसार महाराष्ट्र शासन , नगरविकास विभाग शासन निर्णय क्र.
                टिपीएस-१८०५/१०५०/प्र.क्र-७९५/०५/नदि-१३,दि-३०/५/२००८ व महाराष्ट्र
                शासन,नगरविकास विकास ,निर्णय क्र.टिपीएस-१८०८/८९४/सीआर - १७२७ / ०९
                / नवी-१३,दि-१८/०८/२००९ अनन्वाये शासन निर्णय
                क्र.टिपीएस-१८१२/६०/प्र.क्र ५८/१२ पुनर्बांधणी क्र./२७/१२/ईपी
                मजुरी / नवी १३ दि.०२/०३/२०१५ तसेच महाराष्ट्र शासन नगरविकास विभाग
                मंत्रालय , मुबई-४०००३२, शासन अधिसूचना क्र.-
                टिपीएस-१८१६/१५५२/प्र.क्र.७४/१७/नवी १३. दि १४/०३/२०१८ मंजूर
                असलेल्या विकास योजनेत मोजे :-
                <b>
                  {" "}
                  {
                    this.props?.village?.find(
                      (item) => item.id == this.props?.data?.village,
                    )?.villageMr
                  }{" "}
                </b>
                येथील स.न. / गट नं :- {this?.props?.data?.serveyNo} जमीन
                खालीलप्रमाणे प्रस्थावित केलेली आहे.
              </h4>
            </div>

            <table
              id="table-to-xls"
              className={styles.report_table}
              style={{ marginLeft: "3vh", marginRight: "5vh" }}
            >
              <thead>
                <tr>
                  <th colSpan={5}>गावाचे नाव स.नं / गट.नं</th>
                  <th colSpan={5}>मंजूर विकास योजनेचा प्रस्ताव</th>
                </tr>

                <tr>
                  <td colSpan={5} style={{ paddingLeft: "2vh" }}></td>

                  <td colSpan={5} style={{ paddingLeft: "2vh" }}>
                    १)आरक्षण क्रमांक व प्रयोजन :{" "}
                    {this?.props?.data?.questionAnswers[0]?.answer}
                    {/* २/१४८ - उद्यान(G),2/१४९ - उंच
                    पाण्याची टाकी(ESR), २/१५० - प्राथमिक शाळा(ps),2/१५१ - खेळाचे
                    मैदान(PG), 2/१४९ अ - उंच पाण्याचीटाकी(ESR) */}
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} style={{ paddingLeft: "2vh" }}>
                    {
                      this.props?.village?.find(
                        (item) => item.id == this.props?.data?.village,
                      )?.villageMr
                    }{" "}
                    {this?.props?.data?.serveyNo}
                  </td>

                  <td colSpan={5} style={{ paddingLeft: "2vh" }}>
                    २)नियोजित रस्ते :{" "}
                    {this?.props?.data?.questionAnswers[1]?.answer}
                    {/* १५.०० मी.दोन,१२.००.दोन, */}
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} style={{ paddingLeft: "2vh" }}></td>

                  <td colSpan={5} style={{ paddingLeft: "2vh" }}>
                    ३)नियोजित रस्ता रुंदी :{" "}
                    {this?.props?.data?.questionAnswers[2]?.answer}
                    {/* १५.०० मी.दोन, */}
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} style={{ paddingLeft: "2vh" }}></td>

                  <td colSpan={5} style={{ paddingLeft: "2vh" }}>
                    ४)इतर प्रस्ताव :{" "}
                    {this?.props?.data?.questionAnswers[4]?.answer}
                    {/* सामाजिक उपयोग (उंच पाण्याची टाकी),२००.0
                    मी,बी.आर.टी.कॉरीडॉर */}
                  </td>
                </tr>

                <tr>
                  <td colSpan={5} style={{ paddingLeft: "2vh" }}></td>

                  <td colSpan={5} style={{ paddingLeft: "2vh" }}>
                    ५)झोनिग : {this?.props?.data?.questionAnswers[3]?.answer}
                    {/* रहिवास विभाग */}
                  </td>
                </tr>

                <tr>
                  <td colSpan={12} style={{ paddingLeft: "2vh" }}>
                    प्रस्तुत प्रकरणातील जागेच्या हद्दी बाबत अथवा सव्हे
                    नं./मि.स.नं./गट.नं./ नंबरच्या हद्दीबाबत वाद निर्माण झाल्यास
                    <br />
                    पिंपरी चिचवड मनापा जबाबदार राहणार नाही.सदरचा अभिप्राय उपलब्ध
                    अभिलेखावरून देण्यात <br />
                    आलेला आहे.
                  </td>
                </tr>
              </thead>
            </table>

            <div className={styles.containfoot}>
              <h4>
                <b>
                  कनिष्ठ अभियंता <br />
                  नगररचना व विकास विभाग <br />
                  पिंपरी चिंचवड महानगरपालिका
                </b>
              </h4>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default OutputGenrationLetter;
