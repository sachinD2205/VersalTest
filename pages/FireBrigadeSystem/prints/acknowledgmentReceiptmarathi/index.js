import React, { useEffect, useRef, useState } from "react";
import styles from "./view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card } from "@mui/material";
import urls from "../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const userToken = useGetToken();

  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("router.query", router?.query?.id);
    if (router?.query?.id || router?.query?.serviceId) {
      axios
        .get(
          `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("r.data", r.data);
          setData(r.data);
        })
        .catch((err) => console.log("errTodata", err));
    }
  }, []);

  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
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
    return (
      <div className={styles.mainn}>
        <div className={styles.main}>
          <div className={styles.one}>
            <div className={styles.logo}>
              <div>
                <img src="/logo.png" alt="" height="100vh" width="100vw" />
              </div>
            </div>
            <div
              className={styles.middle}
              // style={{ paddingTop: "15vh", marginTop: "20vh" }}
            >
              <h1>
                <b>पिंपरी चिंचवड महानगरपालिका</b>
              </h1>
              {/* <h4>
                  {' '}
                  <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
                </h4> */}

              {/* <h4>
                  {' '}
                  <b>महाराष्ट्र, भारत</b>
                </h4> */}
            </div>
            <div className={styles.logo1}>
              <img
                src="/smartCityPCMC.png"
                alt=""
                height="100vh"
                width="100vw"
              />
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>
              <b>पोच पावती</b>
            </h2>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h3>
                  प्रिय, {/* <br /> */}
                  <b>
                    {console.log("12345", this?.props)}
                    {this?.props?.data?.applicantDTLDao?.applicantNameMr}{" "}
                    {this?.props?.data?.applicantDTLDao?.applicantMiddleNameMr
                      ? this?.props?.data?.applicantDTLDao
                          ?.applicantMiddleNameMr
                      : ""}{" "}
                    {this?.props?.data?.applicantDTLDao?.applicantLastNameMr}
                  </b>
                </h3>
                <h3>पिंपरी चिंचवड नागरिक सेवा वापरल्याबद्दल धन्यवाद !!</h3>
                <h3>
                  पिंपरी चिंचवड महापालिकेअंतर्गत येणाऱ्या नागरिक सेवा अंतर्गत
                  तुमचा {this?.props?.data?.serviceNameMr} अर्ज यशस्वीरीत्या
                  सादर झाला आहे.
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}>अर्जाचा तपशील</h2>
            </div>
            <Card>
              {/* <h2 className={styles.summary}>Application Summary</h2> */}
              <div className={styles.summ}>
                <div>
                  <h3>अर्जाचा क्रमांक </h3>
                  <h3>अर्जदाराचे नाव </h3>
                  <h3>अर्ज दिनांक </h3>
                  {/* <h3>पत्ता </h3> */}
                </div>
                <div>
                  <h3> : {this?.props?.data?.applicationNumber}</h3>
                  <h3>
                    {" "}
                    :{" "}
                    <b>
                      {this?.props?.data?.applicantDTLDao?.applicantNameMr}{" "}
                      {this?.props?.data?.applicantDTLDao?.applicantMiddleNameMr
                        ? this?.props?.data?.applicantDTLDao
                            ?.applicantMiddleNameMr
                        : ""}{" "}
                      {this?.props?.data?.applicantDTLDao?.applicantLastNameMr}
                    </b>
                  </h3>
                  <h3>
                    {" "}
                    :{" "}
                    {moment(this?.props?.data?.applicationDate).format(
                      "DD-MM-YYYY"
                    )}
                  </h3>
                  {/* <h3>
                    : {this?.props?.data?.aflatBuildingNoMr}{" "}
                    {this?.props?.data?.abuildingNameMr} {","}
                    {this?.props?.data?.aroadNameMr} {","}{" "}
                    {this?.props?.data?.alandmarkMr} {","}{" "}
                    {this?.props?.data?.acityNameMr} {","}{" "}
                    {this?.props?.data?.astateMr}{" "}
                  </h3> */}
                </div>
              </div>
            </Card>
            <div className={styles.query}>
              <h4>
                कोणत्याही प्रश्नासाठी कृपया तुमच्या जवळच्या ऑपरेटरशी संपर्क साधा
                खालील संपर्क तपशील:
              </h4>
            </div>

            <div className={styles.foot}>
              <div className={styles.add}>
                <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                {/* <h5> महाराष्ट्र, भारत</h5> */}
              </div>
              <div className={styles.add1}>
                <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                {/* <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5> */}
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                }}
              >
                <img src="/qrcode1.png" alt="" height="100vh" width="100vw" />
              </div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                  marginRight: "5vh",
                }}
              >
                <img src="/barcode.png" alt="" height="50vh" width="100vw" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
