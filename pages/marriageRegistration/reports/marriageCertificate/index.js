import { Button, Paper } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./goshwara.module.css";
// import router from 'next/router'
import { Image } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";

const MarriageCertificateReport = () => {
  let user = useSelector((state) => state.user.user);
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [data, setData] = useState(null);
  // useEffect(() => {
  //   // console.log('this?.props?.data?', this?.props?.data)
  //   axios
  //     .get(
  //       `${urls.MR}/transaction/prime/getApplicationByServiceIdApplicationId?applicationId=${router?.query?.applicationId}&serviceId=${router?.query?.serviceId}`,
  //     )
  //     .then((r) => {
  //       console.log('r.data', r.data)
  //       setData({...r.data,token:user?.token})
  //     })
  // }, [])

  useEffect(() => {
    let applicationId;
    let serviceId;
    if (router?.query?.applicationId) {
      applicationId = router?.query?.applicationId;
    } else if (localStorage.getItem("applicationId")) {
      applicationId = localStorage.getItem("applicationId");
    } else if (router?.query?.id) {
      applicationId = router?.query?.id;
    }

    if (router?.query?.serviceId) {
      serviceId = router?.query?.serviceId;
    } else if (localStorage.getItem("serviceId")) {
      serviceId = localStorage.getItem("serviceId");
    }
    axios
      .get(
        `${urls.MR}/transaction/marriageCertificate/getMCBySIdAndId?applicationId=${applicationId}&serviceId=${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((r) => {
        console.log("r.data", r.data);
        setData({ ...r.data, token: user?.token });
      });
  }, [router?.query?.applicationId, router?.query?.serviceId, user?.token]);

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
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
          sx={{ width: "25px" }}
          type="primary"
          variant="contained"
          onClick={() => {
            console.log("tokeeennn", this?.props?.data?.token);
            if (this?.props?.data?.token != null) {
              router.push(
                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
              );
            } else {
              router.push("/dashboard");
            }
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
        <div>
          <div>
            <Paper>
              <table className={styles.data} style={{ marginTop: "25px" }}>
                <tr>
                  <div className={styles.main}>
                    <div className={styles.one}>
                      <Image
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.gphoto}`}
                        alt="Groom Photo"
                        height={140}
                        width={130}
                      />
                      {/* </img> */}
                    </div>
                    <div className={styles.two}>
                      {/* <Image
                        width={300}
                        height={200}
                        src={`${urls.CFCURL}/file/preview?filePath=${filePath}`}
                      /> */}
                      <Image
                        src={"/logoCer.jpg"}
                        alt="Maharashtra Logo"
                        height={200}
                        width={200}
                      ></Image>
                    </div>
                    <div className={styles.three}>
                      <Image
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.bphoto}`}
                        alt="Bride Photo"
                        height={140}
                        width={130}
                      ></Image>
                    </div>
                  </div>
                </tr>

                {/* <div style={{ alignContent: 'center' }}>
                  <h1>महाराष्ट्र शासन</h1>
                  <h1>GOVERNMENT OF MAHARASHTRA</h1>
                  <h3>नमुना 'इ'</h3>
                  <h3>Form 'E'</h3> <h3>विवाह नोंदणी प्रमाणपत्र</h3>{' '}
                  <h3>Certificate Of Registration Of Marriage</h3>
                  <h3>
                    (पहा कलम ६ (१) आणि नियम ५) See section 6(1) and Rule 5
                  </h3>
                </div> */}
                <tr>
                  <center style={{ lineHeight: "0.8" }}>
                    <h1>महाराष्ट्र शासन</h1>
                    <h1>GOVERNMENT OF MAHARASHTRA</h1>
                    <h3>नमुना 'इ'</h3>
                    <h3>Form 'E'</h3> <h3>विवाह नोंदणी प्रमाणपत्र</h3>{" "}
                    <h3>Certificate Of Registration Of Marriage</h3>
                    <h3>
                      (पहा कलम ६ (१) आणि नियम ५) See section 6(1) and Rule 5
                    </h3>
                  </center>
                </tr>
              </table>

              <table className={styles.data}>
                <tr>
                  <div className={styles.data1}>
                    <td
                      style={{
                        paddingLeft: "5vh",
                        paddingTop: "2vh",
                        paddingRight: "5vh",
                        paddingBottom: "1vh",
                      }}
                    >
                      <label>
                        प्रमाणित करण्यात येते की , पतीचे नाव :
                        <b>
                          {" "}
                          {this?.props?.data?.gfNameMr + " "}{" "}
                          {this?.props?.data?.gmNameMr + " "}
                          {this?.props?.data?.glNameMr}
                        </b>{" "}
                        राहणार{" "}
                        <b>
                          {this?.props?.data?.gbuildingNoMr}{" "}
                          {this?.props?.data?.gbuildingNameMr}
                          {this?.props?.data?.groadNameMr} {","}
                          {this?.props?.data?.glandmarkMr} {","}
                          {this?.props?.data?.gcityNameMr} {","}
                          {this?.props?.data?.astateMr} {","}
                          {this?.props?.data?.gpincode}{" "}
                        </b>{" "}
                        आणि पत्नीचे नाव :{" "}
                        <b>
                          {this?.props?.data?.bfNameMr + " "}
                          {this?.props?.data?.bmNameMr + " "}
                          {this?.props?.data?.blNameMr}{" "}
                        </b>{" "}
                        राहणार{" "}
                        <b>
                          {" "}
                          {this?.props?.data?.bbuildingNoMr}{" "}
                          {this?.props?.data?.bbuildingNameMr}
                          {this?.props?.data?.broadNameMr} {","}
                          {this?.props?.data?.blandmarkMr} {","}
                          {this?.props?.data?.bcityNameMr} {","}
                          {this?.props?.data?.astateMr}
                          {" ,"}
                          {this?.props?.data?.bpincode}{" "}
                        </b>{" "}
                        यांचा विवाह दिनांक :{" "}
                        <b>
                          {" "}
                          {" " +
                            moment(
                              this?.props?.data?.marriageDate,
                              "YYYY-MM-DD",
                            ).format("DD-MM-YYYY")}
                        </b>{" "}
                        रोजी{" "}
                        <b>{" " + this?.props?.data?.pplaceOfMarriageMr}</b>{" "}
                        (ठिकाणी) येथे विधी संपन्न झाला. त्याची महाराष्ट्र विवाह
                        मंडळाचे विनियमन आणि विवाह नोंदणी विधेयक १९९८ अन्वये
                        ठेवण्यात आलेल्या , नोंद वहीच्या खंड क्र ३ अनुक्रमांक :
                        <b>{" " + this?.props?.data?.registrationNumber}</b> वर
                        दिनांक :{" "}
                        <b>
                          {" " +
                            moment(
                              this?.props?.data?.applicationDate,
                              "YYYY-MM-DD",
                            ).format("DD-MM-YYYY")}
                        </b>{" "}
                        रोजी माझ्याकडून नोंदणी करण्यात आली आहे.
                        <br />
                        <br />
                        Certified that Marriage between , Groom's name:
                        <b>
                          {" "}
                          {this?.props?.data?.gfName + " "}{" "}
                          {this?.props?.data?.gmName + " "}
                          {this?.props?.data?.glName}
                        </b>{" "}
                        residing at :{" "}
                        <b>
                          {this?.props?.data?.gbuildingNo}{" "}
                          {this?.props?.data?.gbuildingName}
                          {this?.props?.data?.groadName} {","}
                          {this?.props?.data?.glandmark} {","}
                          {this?.props?.data?.gcityName} {","}
                          {this?.props?.data?.gstate}
                          {" ,"}
                          {this?.props?.data?.gpincode}{" "}
                        </b>
                        and Bride's name :
                        <b>
                          {this?.props?.data?.bfName + " "}
                          {this?.props?.data?.bmName + " "}
                          {this?.props?.data?.blName}{" "}
                        </b>
                        residing at{" "}
                        <b>
                          {" "}
                          {this?.props?.data?.bbuildingNo}
                          {" ,"}
                          {this?.props?.data?.bbuildingName}
                          {", "}
                          {this?.props?.data?.broadName} {","}
                          {this?.props?.data?.blandmark} {","}
                          {this?.props?.data?.bcityName} {","}
                          {this?.props?.data?.bstate}
                          {", "}
                          {this?.props?.data?.bpincode}{" "}
                        </b>
                        Solemnized on :
                        <b>
                          {" "}
                          {" " +
                            moment(
                              this?.props?.data?.marriageDate,
                              "YYYY-MM-DD",
                            ).format("DD-MM-YYYY")}
                        </b>{" "}
                        at (Place) is :
                        <b>{" " + this?.props?.data?.pplaceOfMarriage}</b>{" "}
                        registered by me on{" "}
                        <b>
                          {" " +
                            moment(
                              this?.props?.data?.applicationDate,
                              "YYYY-MM-DD",
                            ).format("DD-MM-YYYY")}
                        </b>{" "}
                        at Serial No:
                        <b>{" " + this?.props?.data?.registrationNumber}</b> of
                        Volume 3 of register of Marriages maintained under the
                        Maharashtra Regulation of Marriage Bureaus and
                        Registration of Marriage Act 1998.{" "}
                      </label>
                    </td>
                  </div>
                </tr>
                <div className={styles.logo1}>
                  <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                </div>
              </table>
              {/* /////////////////////////// */}
              <div className={styles.kahipn}>
                <div
                  style={{
                    paddingLeft: "5vh",
                    paddingTop: "10vh",
                  }}
                >
                  <b>
                    ठिकाण :
                    {/* {' ' + this?.props?.data?.zone?.zoneNameMr + ' '} */}
                  </b>

                  <b> पिंपरी चिंचवड महानगरपलिका</b>
                  <br />
                  <b>
                    दिनांक :{" "}
                    <b>
                      {" " +
                        moment(
                          this?.props?.data?.applicationDate,
                          "YYYY-MM-DD",
                        ).format("DD-MM-YYYY")}
                    </b>
                  </b>
                </div>
                <div
                  style={{
                    paddingLeft: "5vh",
                    paddingTop: "10vh",
                    paddingBottom: "2vh",
                  }}
                >
                  <div className={styles.circle}>
                    <div className={styles.text}>Seal</div>
                  </div>
                </div>
                <div style={{ paddingTop: "10vh", paddingRight: "5vh" }}>
                  <b>
                    विवाह निबंधक :{" " + this?.props?.data?.zone?.zoneNameMr}
                    <br />
                    <b> पिंपरी चिंचवड</b>
                  </b>
                </div>
              </div>
              {/* <table className={styles.report}>
                <tr>
                  <td
                    style={{
                      paddingLeft: '5vh',
                      paddingTop: '7vh',
                      backgroundColor: 'red',
                    }}
                  >
                    <b>
                      ठिकाण :{' ' + this?.props?.data?.zone?.zoneNameMr + ' '}
                    </b>

                    <b> पिंपरी चिंचवड</b>
                    <br />
                    <b>
                      दिनांक :{' '}
                      <b>
                        {' ' +
                          moment(
                            this?.props?.data?.applicationDate,
                            'YYYY-MM-DD',
                          ).format('DD-MM-YYYY')}
                      </b>
                    </b>
                  </td>
                  <td style={{ paddingLeft: '5vh', paddingTop: '10vh' }}>
                    <div className={styles.circle}>
                      <div className={styles.text}>Seal</div>
                    </div>
                  </td>
                  <td style={{ paddingTop: '10vh' }}>
                    {' '}
                    <b>
                      विवाह निबंधक :<br />
                      {' ' + this?.props?.data?.zone?.zoneNameMr}
                      <br />
                      <b> पिंपरी चिंचवड</b>
                    </b>
                  </td>
                </tr>
                

              
              </table> */}
            </Paper>
          </div>
        </div>
      </>
    );
  }
}

export default MarriageCertificateReport;
