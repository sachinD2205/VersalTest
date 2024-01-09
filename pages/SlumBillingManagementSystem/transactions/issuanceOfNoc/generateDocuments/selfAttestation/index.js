import { Button, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "../goshwara.module.css";
import urls from "../../../../../../URLS/urls";
import ReactDOMServer from "react-dom/server";
import "jspdf-autotable";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf-jspdf2";
import axios from "axios";

const Index = ({
  hutOwnerData,
  hutData,
  handleClose,
  setSelfAttestationFlag,
  selfAttestationFlag,
  applicantPhoto,
}) => {
  const [age, setAge] = useState(0);
  // const [applicantPhoto, setApplicantPhoto] = useState();

  const [slum, setSlum] = useState("");
  const [area, setArea] = useState("");
  const [village, setVillage] = useState("");

  const componentRef = useRef(null);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    let temp =
      hutData?.mstHutMembersList &&
      hutData?.mstHutMembersList.find(
        (member) => member?.firstName === hutOwnerData?.applicantFirstNameEn
      );
    setAge(temp?.age);
    getSlumDetails();
    getAreaDetails();
    getVillageDetails();
    setSelfAttestationFlag(true);
  }, [hutData]);

  // useEffect(() => {
  //   setApplicantPhoto(hutOwnerData?.applicantPhoto?.documentPath);
  //   console.log("applicatinData", hutOwnerData);
  // }, [hutOwnerData?.applicantPhoto?.documentPath]);

  const getSlumDetails = () => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.mstSlumList.find(
          (r, i) => r.id == hutData[0]?.slumKey
        );
        setSlum(temp?.slumNameMr);
      });
  };

  const getAreaDetails = () => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.area.find((r, i) => r.id == hutData[0]?.areaKey);
        setArea(temp?.areaNameMr);
      });
  };

  const getVillageDetails = () => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let temp = res.data.village.find(
          (r, i) => r.id == hutData[0]?.villageKey
        );
        setVillage(temp?.villageNameMr);
      });
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Self Attestation",
  });

  const handleGeneratePdf = () => {
    handleClose();
    setSelfAttestationFlag(true);
    let opt = {
      margin: 1,
      filename: "Self Attestation.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };
    const element = ReactDOMServer.renderToString(
      <ComponentToPrint
        hutOwnerData={hutOwnerData}
        slum={slum && slum}
        area={area && area}
        village={village && village}
        applicantPhoto={applicantPhoto}
        ref={componentRef}
      />
    );
    let base64str;
    html2pdf().from(element).toPdf().set(opt).output("datauristring").save();
  };

  return (
    <div id="selfAttestation">
      {console.log("applicatinData", hutOwnerData)}
      <div>
        <ComponentToPrint
          hutOwnerData={hutOwnerData}
          slum={slum && slum}
          area={area && area}
          village={village && village}
          applicantPhoto={applicantPhoto}
          ref={componentRef}
        />
      </div>
      <br />
      <div className={styles.btn}>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Grid item>
            <Button
              type="primary"
              size="small"
              color="error"
              variant="contained"
              onClick={() => {
                handleClose();
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
          </Grid>

          <Grid item>
            <Button
              type="primary"
              color="primary"
              size="small"
              variant="contained"
              onClick={handlePrint}
            >
              <FormattedLabel id="print" />
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="primary"
              size="small"
              color="success"
              variant="contained"
              onClick={handleGeneratePdf}
            >
              <FormattedLabel id="download" />
            </Button>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <>
          <div className={styles.main}>
            <div className={styles.small}>
              <div className={styles.two}>
                <div className={styles.date5}>
                  <div className={styles.date6} style={{ marginTop: "6vh" }}>
                    <h4>
                      {" "}
                      <b>प्रपत्र – ब </b>
                    </h4>{" "}
                  </div>
                </div>
                <div className={styles.date5}>
                  <div className={styles.date6}>
                    <h4>
                      {" "}
                      <b>स्वयं - साक्षांकनासाठी स्वयंघोषणापत्र </b>
                    </h4>{" "}
                  </div>
                </div>
                <div className={styles.date7}>
                  <div className={styles.date8}>
                    <div
                      className={styles.add7}
                      style={{
                        marginRight: "80px",
                        height: "150px",
                        width: "145px",
                      }}
                    >
                      {this.props?.applicantPhoto ? (
                        <img
                          src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.applicantPhoto}`}
                          alt="अर्जदाराचा फोटो"
                          height="150px"
                          width="144px"
                        />
                      ) : (
                        <h4>अर्जदाराचा फोटो</h4>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                  <div className={styles.date2}>
                    <p style={{ marginLeft: "80px", marginRight: "70px" }}>
                      मी{" "}
                      {`${this.props?.hutOwnerData?.firstNameMr} ${this.props?.hutOwnerData?.middleNameMr} ${this.props?.hutOwnerData?.lastNameMr}`}
                      .. श्री.
                      {`${this.props?.hutOwnerData?.middleNameMr} ${this.props?.hutOwnerData?.lastNameMr}`}{" "}
                      यांचा मुलगा/मुलगी वय {this.props?.hutOwnerData?.age} वर्ष,
                      आधार क्रमांक (असल्यास){" "}
                      {`${this.props?.hutOwnerData?.aadharNo}`} व्यवसाय{" "}
                      {` ${this.props?.hutOwnerData?.occupation}`}.. राहणार{" "}
                      {`${this?.props?.slum} ${this?.props?.area} ${this?.props?.village}`}
                      . याद्वारे घोषित करतो/करते की, झोपडपट्टी पुनर्वसन योजनेत
                      पात्रता तपासण्यासाठी विहित पुराव्याच्या स्वयं साक्षांकित
                      केलेल्या प्रती या मूळ कागपत्रांच्याच सत्य प्रती आहेत. त्या
                      खोट्या असल्याचे आढळून आल्यास, भारतीय दंड संहिता अन्वये
                      आणि/किंवा संबंधित कायद्यानुसार माझ्यावर खटला भरला जाईल व
                      त्यानुसार मी शिक्षेस पात्र राहीन याची मला पूर्ण जाणीव आहे.
                    </p>{" "}
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <div className={styles.date4}>
                      <div className={styles.date2}>
                        <p style={{ marginLeft: "80px" }}> ठिकाण:-……………….</p>
                      </div>
                    </div>
                    <div
                      className={styles.date4}
                      style={{ marginBottom: "2vh" }}
                    >
                      <div className={styles.date2}>
                        <p style={{ marginLeft: "80px" }}> दिनांक:-……………… </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={styles.date4}>
                      <div className={styles.date2}>
                        <p style={{ marginRight: "80px" }}>
                          {" "}
                          अर्जदाराची सही:-……………..
                        </p>
                      </div>
                    </div>
                    <div
                      className={styles.date4}
                      style={{ marginBottom: "2vh" }}
                    >
                      <div className={styles.date2}>
                        <p style={{ marginRight: "80px" }}>
                          {" "}
                          अर्जदाराचे नाव:-
                          {`${this.props?.hutOwnerData?.firstNameMr} ${this.props?.hutOwnerData?.middleNameMr} ${this.props?.hutOwnerData?.lastNameMr}`}
                          .{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </div>
    );
  }
}

export default Index;
