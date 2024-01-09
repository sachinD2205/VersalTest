import React, { Component } from "react";
import styles from "./goshwara.module.css";
import moment from "moment";

class ComponentToPrint extends Component {
  render() {
    // console.log("NRMS: this.props =", this.props);
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small} style={{ fontSize: "small" }}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div
                className={styles.middle}
                // styles={{ paddingTop: "15vh", marginTop: "20vh" }}
              >
                <h3>
                  <b>पिंपरी चिंचवड महानगरपालिका, पिंपरी,पुणे - 411 018</b>
                </h3>
                <h4>
                  <b>माहिती व जनसंपर्क विभाग </b>
                </h4>
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>दुरध्वनी क्रमांक:020-67333333/1528/1534</b>
                    </h5>
                    <h5>
                      <b>E-mail :pro@pcmcindia.gov.in</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फॅक्स क्रमांक:27425600</b>
                    </h5>
                    <h5>
                      <b> website: www.noncoreuat.pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div>
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
              <hr />
            </div>

            <div className={styles.two}>
              <div className={styles.date4} style={{ marginTop: "2vh" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "490px" }}>
                    <b>ऑर्डर क्रमांक : </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.releasingOrderNumber}
                  </h4>
                </div>
              </div>
              <div className={styles.date4} /* style={{ marginTop: "2vh" }} */>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "40px" }}>
                    <b>प्रति</b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {/* {this?.props?.selectedObject?.id} */}
                  </h4>
                </div>
              </div>

              <div
                className={styles.date4} /* style={{ marginBottom: "2vh" }} */
              >
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>मा. जाहिरात व्‍यवस्‍थापक </b>
                    {/* <br /> */}
                    <br />
                    <b>
                      {this?.props?.selectedObject?.newsPapersNamesMr
                        ?.split(",")
                        ?.map((gg) => (
                          // ["E"]?.map((gg) => (
                          <>
                            {gg}
                            <br />
                          </>
                        ))}
                      {/* {this?.props?.selectedObject?.language == "en"
                        ? this?.props?.selectedObject?.newsPapersNames
                            ?.split(",")
                            ?.map((gg) => (
                              <>
                                {gg}
                                <br />
                              </>
                            ))
                        : this?.props?.selectedObject?.newsPapersNamesMr
                            ?.split(",")
                            ?.map((gg) => (
                              <>
                                {gg}
                                <br />
                              </>
                            ))} */}
                    </b>
                  </h4>{" "}
                  {/* <h4 style={{ marginLeft: "10px" }}>
                  </h4> */}
                </div>
              </div>

              {/* subject */}

              <div
                className={styles.date5} /* style={{ marginBottom: "2vh" }} */
              >
                <div className={styles.date6}>
                  <h4 style={{ marginLeft: "40px" }}>
                    {" "}
                    <b>विषय- जाहिरात प्रसिद्धीबाबात </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {/* {' ' +
                                                moment(
                                                    this?.props?.selectedObject?.createDtTm,
                                                    'YYYY-MM-DD',
                                                ).format('DD-MM-YYYY')} */}
                    </b>{" "}
                  </h4>
                </div>
              </div>

              {/* 
                            <div className={styles.date4} style={{ marginBottom: '2vh' }}>
                                <div className={styles.date2}>
                                    <h4 style={{ marginLeft: '40px' }}>
                                        {' '}
                                        <b>अर्जदाराचे नाव : </b>
                                    </h4>{' '}
                                    <h4 style={{ marginLeft: '10px' }}>
                                        {' ' +
                                            this?.props?.dataa?.afNameMr +
                                            ' ' +
                                            this?.props?.dataa?.alNameMr}
                                    </h4>
                                </div>
                            </div> */}

              <div
                className={styles.date4} /* style={{ marginBottom: "1vh" }} */
              >
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "60px" }}>
                    <b>महोदय, </b>
                  </h4>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "1vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    पिंपरी चिंचवड महानगरपालिकेकडील खालील जाहिरात आपल्या
                    वर्तमानपत्रात प्रसिद्ध करण्यात यावी.
                  </p>
                </div>
              </div>

              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> जाहिरात क्र :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.newsPublishRequestNo}
                  </h4>
                  {/* {console.log("XCV",priority)} */}
                </div>
              </div>

              {/* department name */}
              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> विभागाचे नाव :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.departmentNameMr}
                    {/* {this?.props?.selectedObject?.language == "en"
                      ? this?.props?.selectedObject?.departmentName
                      : this?.props?.selectedObject?.departmentNameMr} */}
                  </h4>
                </div>
                {/* department name */}
              </div>
              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> कामाचा तपशिल :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    जाहीर प्रकटन प्रसिद्धीबाबत...
                    {/* {this?.props?.selectedObject?.newsAdvertisementSubject} */}
                  </h4>
                  {/* {console.log("XCV",priority)} */}
                </div>

                {/* department name */}
              </div>

              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b> प्रसिध्दी तारीख :</b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {/* {this?.props?.selectedObject?.fromDate?.split("T")[0]} */}
                    {moment(
                      this?.props?.selectedObject?.newsPublishDate,
                      "YYYY-MM-DD"
                    ).format("DD-MM-YYYY")}
                  </h4>
                  {/* {console.log("XCV",priority)} */}
                </div>

                {/* department name */}
              </div>

              <div className={styles.date4} style={{ marginTop: "" }}>
                <div className={styles.date3}>
                  <h4 style={{ marginLeft: "90px" }}>
                    <ul>
                      <li>
                        <b>
                          {" "}
                          प्रसिद्धीचा स्तर :
                          {this?.props?.selectedObject?.newsPaperLevelNameMr}
                          {/* {this?.props?.selectedObject?.language == "en"
                            ? this?.props?.selectedObject?.newsPaperLevelName
                            : this?.props?.selectedObject?.newsPaperLevelNameMr} */}
                        </b>
                      </li>
                    </ul>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.selectedObject?.language == "en"
                      ? this?.props?.selectedObject?.priorityName
                      : this?.props?.selectedObject?.priorityNameMr}
                  </h4>
                </div>

                {/* department name */}
              </div>

              {/* details */}
              <div
                className={styles.date4} /* style={{ marginBottom: "2vh" }} */
              >
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    {" "}
                    तरी उपरोक्त प्रमाणे सदरची जाहिरात कमीत कमी आकारमानात
                    प्रसिद्ध करावी. जाहिरात बिलाची अदायगी जाहिरात रोटेशन धोरण सन
                    २०१९-२० नुसार करण्यात येईल.{" "}
                    <b>
                      तसेच सदर जाहिरातीचे बिल उपायुक्त, माहिती व जनसंपर्क विभाग,
                      पिंपरी चिंचवड महानगरपलिका यांच्या नावे दोन प्रतीमध्ये
                      माहिती व जनसंपर्क विभागात जाहिरात प्रसिद्धी दिनांकापासून
                      १५ दिवसाचे आत सादर करावे
                    </b>
                  </p>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b></b>
                  </h4>
                </div>
              </div>

              <div
                className={styles.date7} /* style={{ marginBottom: "2vh" }} */
              >
                {/* <div className={styles.date2}>
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div> */}
                <div className={styles.date8} style={{ display: "flex" }}>
                  <div
                    style={{
                      marginLeft: "8vh",
                      marginTop: "5%",
                      marginBottom: "5%",
                    }}
                  >
                    <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                  </div>

                  <div
                    className={styles.add7}
                    // style={{ marginLeft: "140vh" /* , marginRight: "100px" */ }}
                  >
                    <h5>{/* <b>सही/-</b> */}</h5>
                    <h5>उपायुक्त</h5>
                    <h5>माहिती व जनसंपर्क विभाग</h5>
                    <h5>पिंपरी चिंचवड महानगरपालिका</h5>
                    <h5>पिंपरी ४११ ०१८</h5>
                  </div>

                  <h4 style={{ marginLeft: "10px" }}>
                    <b></b>
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ComponentToPrint;
