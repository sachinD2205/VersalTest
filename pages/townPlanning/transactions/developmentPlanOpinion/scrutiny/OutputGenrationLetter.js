import { Button } from "@mui/material";
import axios from "axios";
import moment from "moment";
import router from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../../URLS/urls";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./OutputGenrationLetter.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
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
  const outPutGenration = (data) => {
    console.log("AppontmentSchID", router?.query?.applicationId);

    if (router?.query?.applicationId) {
      axios
        .get(
          `${urls.TPURL}/developmentPlanOpinion/getDevelopmentPlanOpinionById?id=${router?.query?.applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => {
          setdata(res.data);
          console.log("outPut Genration", res.data);
        })
        .catch((error) => {
          callCatchMethod(error, language);
        });
    }
  };

  useEffect(() => {
    console.log("useeffect-outPutGenration");
    outPutGenration();
  }, []);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const language = useSelector((state) => state?.labels.language);

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
        <ComponentToPrint ref={componentRef} data={data} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            const textAlert =
              language == "en"
                ? "Are you sure you want to exit this Record ? "
                : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
            const title = language == "en" ? "Exit ! " : "बाहेर पडा!";

            sweetAlert({
              title: title,
              text: textAlert,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                language == "en"
                  ? sweetAlert({
                      title: "Exit!",
                      text: "Record is Successfully Exit!!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "बाहेर पडा!",
                      text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                      icon: "success",
                      button: "Ok",
                    });
                router.push(
                  "/townPlanning/transactions/developmentPlanOpinion/scrutiny/",
                );
              } else {
                language == "en"
                  ? sweetAlert({
                      title: "Cancel!",
                      text: "Record is Successfully Cancel!!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "रद्द केले!",
                      text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                      icon: "success",
                      button: "ओके",
                    });
              }
            });
          }}
        >
          <FormattedLabel id="exit" />
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
              <div className={styles.middle}>
                <h4>
                  पिंपरी चिंचवड महानगरपालिका <br />
                  पिंपरी १८ <br />
                  नगररचना व विकास विभाग, <br />
                  क्र.नरवी/कावी/ चऱ्होली /टे.क्र.३०/२/२०२१ <br />
                  दि :
                  {" " +
                    moment(
                      this?.props?.data?.applicationDate,
                      "YYYY-MM-DD",
                    ).format("DD-MM-YYYY")}
                  <br />
                  टो.क्र.{this?.props?.data?.applicationNumber}
                </h4>
              </div>
            </div>
            <div className={styles.prati}>
              <h4>
                प्रती , <br />
                श्री.{this?.props?.data?.applicantName},
                <br />
                रा.चाहोली , पुणे.
              </h4>
            </div>
            <div className={styles.vishay}>
              <h4>
                विषय - विकास योजना अभिप्राय मिळणेबाबत. <br />
                संदर्भ - आपला दि .
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
                दाखला देण्यात येतो की, पिंपरी चिंचवड महानगरपालिकेच्या वाढीव
                क्षेत्राची महाराष्ट्र प्रादेशिक व नगररचना अधिनियम १९६६ चे कलम
                ३१(१) नुसार महाराष्ट्र शासन, नगरविकास विभाग, निर्णय क्रमांक
                टिपीएस- १८०५/१०५०/- ७९५/०५/नवि-१३ दि. ३०/०५/२००८ व महाराष्ट्र
                शासन, नगरविकास विभाग, निर्णय क्रमांक पीएम- १८०८/८९४/सी. आर.
                १७२७/०९/नवि-१३, दिनांक १८/०८/२००९ व अधिसूचना क्र. टिपीएस-
                १८१२/१६०/सी.आर-५८/१२ पुनर्रचना नं. २७/१२ ई.पी. मंजुर/दी-१३
                दि.०२/०३/२०१५ अन्वये मंजूर असलेल्या विकास योजनेत मौजे होली स.नं.
                ५४२/७ पै. येथील जमिन वालीन प्रमाणे प्रस्तावित केलेली आहे.
              </h4>
            </div>

            <table
              id="table-to-xls"
              className={styles.report_table}
              style={{ marginLeft: "3vh", marginRight: "5vh" }}
            >
              <thead>
                <tr>
                  <th colSpan={2}>मिळकतीचे वर्णन</th>
                  <th colSpan={8}>मंजूर विकास योजनेचा प्रस्ताव</th>
                </tr>

                <tr>
                  <td rowSpan={5} colSpan={4} style={{ paddingLeft: "2vh" }}>
                    चाहोली, {this?.props?.data?.area}. <br />
                    उप अधिक्षक , भूमि- अभीलेख ,हवेली , यांचे कार्यालया <br />
                    कडील नकाशा नियमित मो.र.नं ६१६६/२०१९ <br />
                    मोजणी दिनांक -{" "}
                    {" " +
                      moment(
                        this?.props?.data?.applicationDate,
                        "YYYY-MM-DD",
                      ).format("DD-MM-YYYY")}{" "}
                  </td>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    १)आरक्षण क्र.व प्रयोजन
                  </td>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    <b>{this?.props?.data?.questionAnswers[0].answer}</b>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    २)नियोजित रस्ते
                  </td>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    <b>{this?.props?.data?.questionAnswers[1].answer}</b>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    ३)नियोजित रस्तारुंदी
                  </td>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    <b>{this?.props?.data?.questionAnswers[2].answer}</b>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    ४) झोनिंग
                  </td>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    <b>{this?.props?.data?.questionAnswers[3].answer}</b>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    ५)इतर प्रस्ताव
                  </td>
                  <td style={{ border: "1px solid black", padding: 10 }}>
                    <b>{this?.props?.data?.questionAnswers[4].answer}</b>
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} style={{ paddingLeft: "2vh" }}>
                    मंजुर बी.आर.टी.कॉरीडोर (२०० मी.प्रमाणे)
                  </td>

                  <td colSpan={4} style={{ paddingLeft: "2vh" }}>
                    <b>{this?.props?.data?.questionAnswers[5].answer}</b>
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} style={{ paddingLeft: "2vh" }}>
                    पुररेषा
                  </td>

                  <td colSpan={4} style={{ paddingLeft: "2vh" }}>
                    <b>{this?.props?.data?.questionAnswers[6].answer}</b>
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} style={{ paddingLeft: "2vh" }}>
                    रेडझोन व बफर झोन{" "}
                  </td>

                  <td colSpan={4} style={{ paddingLeft: "2vh" }}>
                    <b>{this?.props?.data?.questionAnswers[7].answer}</b>
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} style={{ paddingLeft: "2vh" }}>
                    म.प्रा.व न.र.अधिनियम १९६६ चे कलम ३७ नुसार <br /> प्रस्तावित
                    फेरबदल{" "}
                  </td>

                  <td colSpan={4} style={{ paddingLeft: "2vh" }}>
                    <b>{this?.props?.data?.questionAnswers[8].answer}</b>
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
            <div className={styles.contain}>
              <h4>सोबत - प्रस्ताव दर्शक नकाशा</h4>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default OutputGenrationLetter;
