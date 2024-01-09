import { Button, Paper } from "@mui/material";
import { Image } from "antd";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./MRC.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";
const MarriageCertificateReport = () => {
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [gPhoto, setGPhoto] = useState();
  const [bPhoto, setBPhoto] = useState();
  const language = useSelector((state) => state?.labels.language);
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
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [data, setData] = useState(null);

  const getGPhoto = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setGPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  const getBPhoto = (filePath) => {
    console.log("filePath123", filePath);

    // const url = ` ${urls.CFCURL}/file/previewNew?filePath=${filePath}`;
    // const url = ` ${urls.CFCURL}/file/preview?filePath=${filePath}`;
    const plaintext = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", plaintext);

    console.log(filePath, plaintext, ciphertext, "kljk000");

    const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        console.log("ImageApi21312", r?.data);
        setBPhoto(r?.data?.fileName);
      })
      .catch((error) => {
        console.log("CatchPreviewApi", error);
        callCatchMethod(error, language);
      });
  };

  useEffect(() => {
    axios
      .get(
        `${urls.MR}/transaction/applicant/getapplicantById?applicationId=${router?.query?.applicationId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        setData(res?.data);

        getGPhoto(res?.data?.gphoto);
        getBPhoto(res?.data?.bphoto);
        console.log("provisonal", res.data);
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  }, []);

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  return (
    <>
      <div>
        <ComponentToPrint
          data={data}
          ref={componentRef}
          gPhoto={gPhoto}
          bPhoto={bPhoto}
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
          <FormattedLabel id="print" />
        </Button>
        <Button
          sx={{ width: "50px" }}
          type="primary"
          variant="contained"
          onClick={() => {
            console.log("tokeeennn", this?.props?.data?.token);
            if (this?.props?.data?.token != null) {
              router.push(
                "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
              );
            } else {
              localStorage.loggedInUser == "departmentUser"
                ? router.push(
                    "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
                  )
                : router.back();
            }
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
        <div>
          <div>
            <Paper>
              <table className={styles.data} style={{ marginTop: "25px" }}>
                <tr>
                  <div className={styles.main}>
                    <div className={styles.one}>
                      {/* <Image
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.gphoto}`}
                        alt="Groom Photo"
                        height={140}
                        width={130}
                      /> */}
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
                        height={100}
                        width={100}
                      ></Image>
                    </div>
                    <div className={styles.three}>
                      {/* <Image
                        src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.bphoto}`}
                        alt="Bride Photo"
                        height={140}
                        width={130}
                      ></Image> */}
                      <Image
                        src={"/mahaonline.png"}
                        alt="Maharashtra Logo"
                        height={80}
                        width={80}
                      ></Image>
                    </div>
                  </div>
                </tr>

                <tr>
                  <center style={{ lineHeight: "0.8" }}>
                    <h2>महाराष्ट्र शासन</h2>
                    <h2>GOVERNMENT OF MAHARASHTRA</h2>
                    <h3>पिंपरी चिंचवड महानगरपालिका</h3>{" "}
                    <h3>Pimpri-Chinchwad Municipal Corporation</h3>{" "}
                    <h3>
                      (भाग चार-ब) महाराष्ट्र शासन राजपत्र , मे 20, १९९९ / वैशाख
                      ३० , शके १९२१{" "}
                    </h3>{" "}
                    <h3>नमुना 'इ' / Form 'E'</h3>
                    <h3>विवाह नोंदणी प्रमाणपत्र</h3>{" "}
                    <h3>Certificate Of Registration Of Marriage</h3>
                    <h4>(कलम ६ (१) आणि नियम ५ पहा) </h4>
                    <h4>See section 6(1) and Rule 5</h4>
                  </center>
                </tr>
              </table>

              <table className={styles.data}>
                <div className={styles.data1}>
                  <div
                    className={styles.a}
                    style={{
                      paddingLeft: "2vh",
                      paddingTop: "4px",
                      paddingRight: "2vh",
                      paddingBottom: "1vh",
                    }}
                  >
                    <div style={{ marginLeft: "150px" }}>
                      <b>
                        प्रमाणित करण्यात येते की ,/Certified that,Marriage
                        between
                      </b>
                    </div>
                    <br />
                    <div className={styles.nameAdh1}>
                      पतीचे नाव
                      <div style={{ marginLeft: "8vh" }}>
                        <b>
                          : {this?.props?.data?.gfNameMr + " "}{" "}
                          {this?.props?.data?.gmNameMr ? (
                            <b>{this?.props?.data?.gmNameMr + " "}</b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.glNameMr}
                        </b>{" "}
                      </div>
                      <div style={{ marginLeft: "160px" }}>
                        आधार क्रमांक/Aadhar No:
                        {this?.props?.data?.gaadharNo ? (
                          <b>{this?.props?.data?.gaadharNo + " "}</b>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      Name of Husband
                      <div style={{ marginLeft: "40px" }}>
                        <b>
                          : {this?.props?.data?.gfName?.toUpperCase() + " "}{" "}
                          {this?.props?.data?.gmName ? (
                            <b>
                              {" "}
                              {this?.props?.data?.gmName?.toUpperCase() + " "}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.glName?.toUpperCase()}
                        </b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      राहणार
                      <div style={{ marginLeft: "102px" }}>
                        <b>
                          : {this?.props?.data?.gbuildingNoMr}{" "}
                          {this?.props?.data?.gbuildingNameMr ? (
                            <b>{this?.props?.data?.gbuildingNameMr}</b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.groadNameMr ? (
                            <b>
                              {" "}
                              {this?.props?.data?.groadNameMr} {","}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.glandmarkMr ? (
                            <b>
                              {" "}
                              {this?.props?.data?.glandmarkMr} {","}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.gcityNameMr ? (
                            <b>
                              {" "}
                              {this?.props?.data?.gcityNameMr} {""}
                            </b>
                          ) : (
                            ""
                          )}
                          {/* {this?.props?.data?.astateMr} {","}
                        {this?.props?.data?.gpincode}{" "} */}
                        </b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      Residing at:
                      <div style={{ marginLeft: "74px" }}>
                        <b>
                          :{this?.props?.data?.gbuildingNo?.toUpperCase()}{" "}
                          {this?.props?.data?.gbuildingName ? (
                            <b>
                              {" "}
                              {this?.props?.data?.gbuildingName?.toUpperCase()}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.groadName ? (
                            <b>
                              {" "}
                              {this?.props?.data?.groadName?.toUpperCase()}{" "}
                              {","}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.glandmark ? (
                            <b>
                              {" "}
                              {this?.props?.data?.glandmark?.toUpperCase()}{" "}
                              {","}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.gcityName ? (
                            <b>
                              {" "}
                              {this?.props?.data?.gcityName?.toUpperCase()} {""}
                            </b>
                          ) : (
                            ""
                          )}
                          {/* {this?.props?.data?.gstate}
                        {" ,"}
                        {this?.props?.data?.gpincode}{" "} */}
                        </b>
                      </div>
                    </div>
                    <br />
                    <div className={styles.nameAdh1}>
                      पत्नीचे नाव
                      <div style={{ marginLeft: "8vh" }}>
                        <b>
                          : {this?.props?.data?.bfNameMr + " "}
                          {this?.props?.data?.bmNameMr ? (
                            <b>{this?.props?.data?.bmNameMr + " "}</b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.blNameMr}{" "}
                        </b>
                      </div>
                      <div style={{ marginLeft: "160px" }}>
                        आधार क्रमांक/Aadhar No:
                        {this?.props?.data?.baadharNo ? (
                          <b>{this?.props?.data?.baadharNo + " "}</b>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      Wife's Name
                      <div style={{ marginLeft: "67px" }}>
                        <b>
                          : {this?.props?.data?.bfName?.toUpperCase() + " "}
                          {this?.props?.data?.bmName ? (
                            <b>
                              {this?.props?.data?.bmName?.toUpperCase() + " "}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.blName?.toUpperCase()}{" "}
                        </b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      राहणार
                      <div style={{ marginLeft: "102px" }}>
                        <b>
                          : {this?.props?.data?.bbuildingNoMr}{" "}
                          {this?.props?.data?.bbuildingNameMr ? (
                            <b>{this?.props?.data?.bbuildingNameMr}</b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.broadNameMr ? (
                            <b>
                              {this?.props?.data?.broadNameMr} {","}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.blandmarkMr ? (
                            <b>
                              {this?.props?.data?.blandmarkMr} {","}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.bcityNameMr ? (
                            <b>
                              {this?.props?.data?.bcityNameMr} {""}
                            </b>
                          ) : (
                            ""
                          )}
                        </b>
                      </div>
                    </div>
                    <div className={styles.nameAdh}>
                      Residing at
                      <div style={{ marginLeft: "75px" }}>
                        <b>
                          : {this?.props?.data?.bbuildingNo?.toUpperCase()}{" "}
                          {this?.props?.data?.bbuildingName ? (
                            <b>
                              {this?.props?.data?.bbuildingName?.toUpperCase()}
                              {", "}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.broadName ? (
                            <b>
                              {this?.props?.data?.broadName?.toUpperCase()}{" "}
                              {","}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.blandmark ? (
                            <b>
                              {this?.props?.data?.blandmark?.toUpperCase()}{" "}
                              {","}
                            </b>
                          ) : (
                            ""
                          )}
                          {this?.props?.data?.bcityName ? (
                            <b>
                              {this?.props?.data?.bcityName?.toUpperCase()} {""}
                            </b>
                          ) : (
                            ""
                          )}
                        </b>
                      </div>
                    </div>
                    <br />
                    यांचा विवाह दिनांक :
                    {this?.props?.data?.marriageDate ? (
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.data?.marriageDate,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>
                    ) : (
                      ""
                      // "__ __ ____"
                    )}
                    रोजी
                    <b>{" " + this?.props?.data?.pplaceOfMarriageMr}</b>
                    (ठिकाणी) येथे विधी संपन्न झाला. त्याची महाराष्ट्र विवाह
                    मंडळाचे विनियमन आणि विवाह नोंदणी विधेयक १९९८ अन्वये ठेवण्यात
                    आलेल्या , नोंद वहीच्या खंड क्र ३ अनुक्रमांक :
                    {this?.props?.data?.registrationNumber ? (
                      <b>{" " + this?.props?.data?.registrationNumber}</b>
                    ) : (
                      // "________"
                      ""
                    )}
                    वर दिनांक :{" "}
                    {this?.props?.data?.applicationDate ? (
                      <b>
                        {" " +
                          moment(
                            this?.props?.data?.applicationDate,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>
                    ) : (
                      ""
                    )}{" "}
                    रोजी माझ्याकडून नोंदणी करण्यात आली आहे.
                    <br />
                    <br />
                    Solemnized on :
                    {this?.props?.data?.marriageDate ? (
                      <b>
                        {" "}
                        {" " +
                          moment(
                            this?.props?.data?.marriageDate,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>
                    ) : (
                      ""
                    )}{" "}
                    at (Place) is :
                    <b>{" " + this?.props?.data?.pplaceOfMarriage}</b>{" "}
                    registered by me on{" "}
                    {this?.props?.data?.applicationDate ? (
                      <b>
                        {" " +
                          moment(
                            this?.props?.data?.applicationDate,
                            "YYYY-MM-DD",
                          ).format("DD-MM-YYYY")}
                      </b>
                    ) : (
                      ""
                    )}{" "}
                    at Serial No:
                    {this?.props?.data?.registrationNumber ? (
                      <b>{" " + this?.props?.data?.registrationNumber}</b>
                    ) : (
                      ""
                    )}
                    of Volume 3 of register of Marriages maintained under the
                    Maharashtra Regulation of Marriage Bureaus and Registration
                    of Marriage Act 1998. {/* </td> */}
                  </div>
                </div>
              </table>
              <div className={styles.kahipnB}>
                <div className={styles.mainB}>
                  <div className={styles.oneB}>
                    <Image
                      src={`data:image/png;base64,${this?.props?.gPhoto}`}
                      // src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.gphoto}`}
                      alt="Groom Photo"
                      height={90}
                      width={80}
                    />
                    {/* </img> */}
                  </div>
                  <div className={styles.twoB}></div>
                  <div className={styles.threeB}>
                    <Image
                      src={`data:image/png;base64,${this?.props?.bPhoto}`}
                      // src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.data?.bphoto}`}
                      alt="Bride Photo"
                      height={90}
                      width={80}
                    ></Image>
                  </div>
                </div>
              </div>
              <div className={styles.kahipn}>
                <div>
                  <div className={styles.digital}>
                    <div className={styles.logo1}>
                      <img
                        src="/qrcode1.png"
                        alt=""
                        height="40vh"
                        width="40vw"
                      />
                    </div>

                    {this?.props?.data?.applicationStatus ==
                    "CERTIFICATE_ISSUED" ? (
                      <div
                        className={styles.logo1}
                        // style={{ marginLeft: "45vh" }}
                      >
                        <img
                          src="/verified.png"
                          alt="Verified Logo"
                          height={50}
                          width={50}
                        ></img>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={styles.nameAdh}
                    style={{
                      paddingLeft: "5vh",
                    }}
                  >
                    प्रमाणपत्र क्र / Certificate No :&nbsp;{" "}
                    {this?.props?.data?.certificateNo ? (
                      <b>{" " + this?.props?.data?.certificateNo}</b>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className={styles.kahipnL}>
                  <div
                    style={{
                      marginLeft: "5vh",
                      // marginRight: "5vh",
                      marginTop: "5px",
                      paddingRight: "5vh",
                      display: "flex",
                    }}
                  >
                    <div>
                      <div>
                        <b>ठिकाण: </b>{" "}
                        <b>
                          &nbsp;{" " + this?.props?.data?.zone?.zoneaddressMr}
                        </b>
                      </div>
                      <div>
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
                      {/* <div>
                        <b>&nbsp;चिंचवड</b>
                      </div>
                      <div>
                        <b>&nbsp;महानगरपालिका</b>
                      </div> */}
                    </div>
                    {/* <br />
                    <div>
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
                    </div> */}
                  </div>

                  <div
                    style={{
                      margin: "2vh",
                    }}
                  >
                    <div
                      className={styles.circle}
                      style={{ paddingTop: "2vh", paddingBottom: "2vh" }}
                    >
                      <div className={styles.text}>Seal</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <b>
                      विवाह निबंधक <br />
                      {" " + this?.props?.data?.zone?.zoneNameMr}
                      <br />
                      <b>पिंपरी चिंचवड महानगरपालिका</b>
                    </b>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}

export default MarriageCertificateReport;
