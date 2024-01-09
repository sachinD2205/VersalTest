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
const PartMapLetter = () => {
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
        .get(`${urls.TPURL}/partplan/getById/${router?.query?.applicationId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
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
                // router.push(
                //   "/townPlanning/transactions/developmentPlanOpinion/scrutiny/",
                // );
                router.back();
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
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका पिंपरी १८</b>
                </h1>
              </div>
            </div>

            <div className={styles.contain}>
              <h4>
                &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;भाग नकाशा
                देण्यात येतो की, पिंपरी चिंचवड महानगरपालिकेच्या नवनगर विकास
                प्राधिकरणाच्या महाराष्ट्र शासन, नगर विकास विभाग अधिसूचना क
                टिपीएस- १८९३ / १४१०-१३ दिनांक २८/११/१९९५ अन्वये मंजूर विकास
                आराखस्यात तथापि, महाराष्ट्र शासन, नगरविकास विभाग, अधिसूचना क्र.
                पीसीएन १९१७/९३८/२.५. ८९ नावि २२, दिनांक १५/११/१९९७ अन्वये पिंपरी
                चिंचवड महानगरपालिकेच्या नियोजन नियंत्रण कक्षेमध्ये समाविष्ट -
                करण्यात आलेली मौजे रावेत येथील स.न. / गट नं.{" "}
                {this?.props?.data?.surveyNumber} येथील आरक्षण क्र. व
                सभोवतालच्या परिसराचा वापर खालीलप्रमाणे प्रस्तावित आहे.
              </h4>
            </div>
            <hr />
            <table
              style={{
                border: "1px solid red",
                marginLeft: "10vh",
                marginRight: "10vh",
              }}
            >
              <tr>
                <td
                  colSpan={5}
                  style={{
                    // backgroundColor: "yellow",
                    border: "1px solid black",
                  }}
                >
                  अर्जदार -{this?.props?.data?.applicantNameMr}
                </td>
                <td
                  colSpan={5}
                  style={{
                    // backgroundColor: "yellow",
                    border: "1px solid black",
                  }}
                >
                  अर्ज दि.{" "}
                  {" " +
                    moment(
                      this?.props?.data?.applicationDate,
                      "YYYY-MM-DD",
                    ).format("DD-MM-YYYY")}{" "}
                </td>
                <td
                  colSpan={5}
                  style={{
                    // backgroundColor: "yellow",
                    border: "1px solid black",
                  }}
                >
                  अर्ज क्र. {this?.props?.data?.applicationNumber}
                </td>
              </tr>
              <tr>
                <td
                  colSpan={10}
                  style={{
                    // backgroundColor: "yellowgreen",
                    border: "1px solid black",
                  }}
                >
                  जा.क्र.नरवि | कावि | भान / 04/236/2021
                </td>
                <td
                  colSpan={5}
                  style={{
                    // backgroundColor: "yellowgreen",
                    border: "1px solid black",
                  }}
                >
                  दि.{" "}
                  {" " +
                    moment(
                      this?.props?.data?.paymentDetails?.createDtTm,
                      "YYYY-MM-DD",
                    ).format("DD-MM-YYYY")}{" "}
                </td>
              </tr>
            </table>
            <div
              style={{
                marginLeft: "10vh",
                marginRight: "10vh",
                // border: "2px solid blue",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <img src="/partMap.png" alt="" height="250vh" width="470vw" />
            </div>

            <div className={styles.contain}>
              <h4>खुलासा -(REFERENCE)</h4>
            </div>

            <div className={styles.contain}>
              <h4>
                {/* <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    ०१)
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    रहिवास- Residential
                  </div>

                  <div style={{ display: "flex" }}>
                    {" "}
                    ०२){" "}
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    वाणिज्य- Commercial
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    ०३)
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    औद्योगिक (म.आ.वि.म.) Industrial (M.I.D.C.)
                  </div>

                  <div style={{ display: "flex" }}>
                    {" "}
                    ०४){" "}
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    औद्योगिक Industrial
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    ०५)
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    सार्वजनिक / निमसार्वजनिक:- public semi public)
                  </div>

                  <div style={{ display: "flex" }}>
                    {" "}
                    ०६){" "}
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    उद्यान, बाग, खेळाने मैदान - Parks, Gardens,Playground
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    ०७)
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    शेती विभाग खुली जागा Green belts. open Space etc.
                  </div>

                  <div style={{ display: "flex" }}>
                    {" "}
                    ०८){" "}
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    शेती- Agricultural
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    ०९)
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    नदी, नाले, तलाव - Water bodies
                  </div>

                  <div style={{ display: "flex" }}>
                    {" "}
                    १०){" "}
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    वाहतूक व दळणवळण - Transport & Communication
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    ११)
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    सार्वजनिक उपयोगाकरिता - Public utility
                  </div>

                  <div style={{ display: "flex" }}>
                    {" "}
                    १२){" "}
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    विद्यमान रस्ते Existing Roads
                  </div>
                </div>

                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div style={{ display: "flex" }}>
                    १३)
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    नियोजित रस्ते-Proposed Roads
                  </div>

                  <div style={{ display: "flex" }}>
                    {" "}
                    १४){" "}
                    <td
                      style={{
                        border: "1px solid black",
                        height: "20px",
                        width: "30px",
                      }}
                    />
                    मंजूर विकास योजना आरक्षण Development plan Reservation
                  </div>
                </div> */}

                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div>
                    <div style={{ display: "flex" }}>
                      ०१)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp;रहिवास- Residential
                    </div>
                    <div style={{ display: "flex" }}>
                      ०३)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; औद्योगिक (म.आ.वि.म.) Industrial (M.I.D.C.)
                    </div>
                    <div style={{ display: "flex" }}>
                      ०५)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; सार्वजनिक / निमसार्वजनिक:- public semi public)
                    </div>
                    <div style={{ display: "flex" }}>
                      ०७)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; शेती विभाग खुली जागा Green belts. open Space etc.
                    </div>
                    <div style={{ display: "flex" }}>
                      ०९)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; नदी, नाले, तलाव - Water bodies
                    </div>
                    <div style={{ display: "flex" }}>
                      ११)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; सार्वजनिक उपयोगाकरिता - Public utility
                    </div>
                    <div style={{ display: "flex" }}>
                      १३)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; नियोजित रस्ते-Proposed Roads
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex" }}>
                      ०२)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; वाणिज्य- Commercial
                    </div>
                    <div style={{ display: "flex" }}>
                      ०४)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; औद्योगिक Industrial
                    </div>
                    <div style={{ display: "flex" }}>
                      {" "}
                      ०६)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; उद्यान, बाग, खेळाचे मैदान - Parks,
                      Gardens,Playground
                    </div>
                    <div style={{ display: "flex" }}>
                      {" "}
                      ०८)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; शेती- Agricultural
                    </div>

                    <div style={{ display: "flex" }}>
                      {" "}
                      १०)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; वाहतूक व दळणवळण - Transport & Communication
                    </div>
                    <div style={{ display: "flex" }}>
                      {" "}
                      १२)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; विद्यमान रस्ते Existing Roads
                    </div>
                    <div style={{ display: "flex" }}>
                      {" "}
                      १४)&nbsp;
                      <td
                        style={{
                          border: "1px solid black",
                          height: "20px",
                          width: "30px",
                        }}
                      />
                      &nbsp; मंजूर विकास योजना आरक्षण Development plan
                      Reservation
                    </div>
                  </div>
                </div>
              </h4>
            </div>

            <div className={styles.contain}>
              <h4>
                टिप :- १)सदर सर्व्हे नंबरचा काही भाग लाल पूररेषेने बाधित आहे.{" "}
                <br />
                २) महाराष्ट्र शासन नगर विकास विभाग मंत्रालय, मुंबई- ४०००३२, शासन
                अधिसूचना त्र.. टिपीएस-१८१७/२००२/प्र.प्र.१८/१८/नवि-१३,
                <br /> दिनांक: २६/०२/२०१८, कलम ३७ अन्वये ३४.५० मी. रस्त्याने
                ४५.०० मी. प्रस्तावित करण्यात येत आहे
              </h4>
            </div>

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

export default PartMapLetter;
