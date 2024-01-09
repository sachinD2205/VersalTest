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
  const [allData, setAllData] = useState();
  const [village, setVillage] = useState();
  const getAllData = (data) => {
    console.log("1234", router?.query?.applicationId);

    if (router?.query?.applicationId) {
      axios
        .get(
          `${urls.TPURL}/setBackCertificate/getsetBackCertificate?id=${router?.query?.applicationId}`,
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
  // view
  return (
    <>
      <div>
        <ComponentToPrint
          ref={componentRef}
          data={data}
          village={village}
          //  allData={allData}
        />
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
            const titleT = language == "en" ? "Exit?" : "बाहेर पडायचे?";
            const titleText =
              language == "en"
                ? "Are you sure you want to exit this Record ? "
                : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
            swal({
              title: titleT,
              text: titleText,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                {
                  language == "en"
                    ? swal("Record is Successfully Exit!", {
                        icon: "success",
                      })
                    : swal("रेकॉर्ड यशस्वीरित्या बाहेर पडा!", {
                        icon: "success",
                      });
                }
                router.back();
              } else {
                {
                  language == "en"
                    ? swal("Record is Safe")
                    : swal("रेकॉर्ड सुरक्षित आहे");
                }
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
        {/* { console.log("ppppppppp",this.props.village)} */}
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
                <h3>
                  नगररचना व विकास विभाग जा.क्र. नरवि। कावि। पिं.नि. । ३७|32|२०२१{" "}
                  <br />
                  दिनांक-{" "}
                  {moment(
                    this?.props?.data?.applicationDate,
                    "YYYY-MM-DD",
                  ).format("DD-MM-YYYY")}
                  . टो.क्र. -{this.props?.data?.applicationNumber}.
                </h3>
              </div>
            </div>

            {/* <div className={styles.contain}>
              <h4>
                &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;भाग नकाशा
                देण्यात येतो की, पिंपरी चिंचवड महानगरपालिकेच्या नवनगर विकास
                प्राधिकरणाच्या महाराष्ट्र शासन, नगर विकास विभाग अधिसूचना क
                टिपीएस- १८९३ / १४१०-१३ दिनांक २८/११/१९९५ अन्वये मंजूर विकास
                आराखस्यात तथापि, महाराष्ट्र शासन, नगरविकास विभाग, अधिसूचना क्र.
                पीसीएन १९१७/९३८/२.५. ८९ नावि २२, दिनांक १५/११/१९९७ अन्वये पिंपरी
                चिंचवड महानगरपालिकेच्या नियोजन नियंत्रण कक्षेमध्ये समाविष्ट -
                करण्यात आलेली मौजे रावेत येथील स.न. / गट नं. 125 येथील आरक्षण
                क्र. व सभोवतालच्या परिसराचा वापर खालीलप्रमाणे प्रस्तावित आहे.
              </h4>
            </div>
            <hr /> */}

            <div className={styles.contain}>
              <h4>प्रति,</h4>
            </div>
            <div className={styles.contain}>
              <h4>
                {this.props?.data?.applicantNameMr}
                <br />
                रा.
                {
                  this.props?.village?.find(
                    (item) => item.id == this.props?.data?.villageName,
                  )?.villageMr
                }{" "}
                .
              </h4>
            </div>
            <div className={styles.contain}>
              <h4>
                &nbsp; &nbsp;&nbsp; &nbsp;विषय - सामासिक अंतर तपासणी बाबत.
                <br />
                &nbsp; &nbsp;&nbsp; &nbsp;मौजे -
                {
                  this.props?.village?.find(
                    (item) => item.id == this.props?.data?.villageName,
                  )?.villageMr
                }
                <br />
                &nbsp; &nbsp;&nbsp; &nbsp;संदर्भ - आपला दिनांक{" "}
                {moment(
                  this?.props?.data?.applicationDate,
                  "YYYY-MM-DD",
                ).format("DD-MM-YYYY")}{" "}
                चा अर्ज.
              </h4>
            </div>
            <div className={styles.contain}>
              <h4>
                महाशय,
                <br />
                मौजे{" "}
                {
                  this.props?.village?.find(
                    (item) => item.id == this.props?.data?.villageName,
                  )?.villageMr
                }{" "}
                येथील स.नं. {this.props?.data?.serveyNo} , सि.स.नं. ११९७, १२१४
                या मिळकती मध्ये इमारतीचे जोते स्तंभ व रस्तारुंदी रेषा या मधील
                सामासिक अंतर तपासणीच्या वेळी दि. ११।०६।२०२१ रोजी अर्जदार यांच्या
                प्रतिनीधींनी दाखविलेल्या मिळकतींच्या हद्दी व मंजुर बांधकाम
                परवानगीचा नकाशा क्र/बीपी.{" "}
                {
                  this.props?.village?.find(
                    (item) => item.id == this.props?.data?.villageName,
                  )?.villageMr
                }{" "}
                ५३।२०१९, दिनांक ११/०९/२०१९ विचारात घेता मंजुर बांधकाम परवानगी
                नकाशात दर्शविलेले १२.०० मी दक्षिणोत्तर रस्ता ते इमारतीचे जोते
                स्तंभ या मध्ये किमान अंतर आढळुन येत आहे.
              </h4>
            </div>
            <div className={styles.containfoot}>
              {/* <h4><b>आपला</b></h4><br/> */}
              <h4>
                <b>
                  आपला <br />
                  <br />
                  <br />
                  उपअभियंता, नगररचना
                  <br />
                  पिंपरी चिंचवड महानगरपालिका <br />
                  पिंपरी - १८
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
