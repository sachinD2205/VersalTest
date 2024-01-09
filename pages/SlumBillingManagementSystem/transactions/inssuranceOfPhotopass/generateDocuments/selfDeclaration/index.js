import {
  Button,
  Grid,
  Checkbox,
  FormControl,
  FormHelperText,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "../goshwara.module.css";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../../../URLS/urls";
import ReactDOMServer from "react-dom/server";
import "jspdf-autotable";
import axios from "axios";
import { useSelector } from "react-redux";
import html2pdf from "html2pdf-jspdf2";
import { EncryptData,DecryptData } from "../../../../../../components/common/EncryptDecrypt";
const Index = ({ hutOwnerData, husbandWifeCombinedPhoto, hutData, handleClose,village,area,slum,  setSelfDeclarationFlag, selfDeclarationFlag }) => {
  // const [slum, setSlum] = useState("");
  // const [area, setArea] = useState("");
  // const [village, setVillage] = useState("");

  const componentRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const [photo, setPhoto] = useState(null);
  const [checked, setChecked] = React.useState(false);
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    if (husbandWifeCombinedPhoto != null) {
      getIcardPhoto(husbandWifeCombinedPhoto);
    }
  }, [husbandWifeCombinedPhoto]);

  const getIcardPhoto = (filePath) => {
    const DecryptPhoto = DecryptData("passphraseaaaaaaaaupload", filePath);
    const ciphertext = EncryptData("passphraseaaaaaaapreview", DecryptPhoto);
    const url = ` ${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
    axios
      .get(url, {
        headers: headers,
      })
      .then((r) => {
        setPhoto(r?.data?.fileName);
      })
      .catch((error) => {});
  };

  // useEffect(() => {
  // getSlumDetails();
  // getAreaDetails();
  // getVillageDetails();
  //   setSelfDeclarationFlag(true);
  // }, [hutData]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: language == "en" ? "Self Declaration" : "स्व-घोषणा",
  });

  const handleConfirmationChange = (event) => {
    console.log("event___", event.target.checked);
    setChecked(event.target.checked);
  };

  const handleGeneratePdf = () => {
    handleClose();
    setSelfDeclarationFlag(checked);
    let opt = {
      margin: 1,
      filename: "Self Declaration.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };
    const element = ReactDOMServer.renderToString(
      <ComponentToPrint
        hutOwnerData={hutOwnerData}
        language={language}
        slum={slum ? slum : ""}
        area={area ? area : ""}
        village={village ? village : ""}
        photo={photo}
        ref={componentRef}
      />
    );
    let base64str;
    html2pdf().from(element).toPdf().set(opt).output("datauristring").save();
  };

  // view
  return (
    <div>
      <div>
        <ComponentToPrint
          hutOwnerData={hutOwnerData}
          language={language}
          slum={slum ? slum : ""}
          area={area ? area : ""}
          village={village ? village : ""}
          photo={photo}
          ref={componentRef}
        />
      </div>
      <br />
      <Grid
        container
        spacing={2}
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={checked} onChange={handleConfirmationChange} />
            }
            label={<FormattedLabel id="iAgree" />}
          />
        </FormGroup>
      </Grid>
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
              variant="contained"
              color="error"
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
    console.log("photo ", this.props.photo);
    return (
      <div>
        {this?.props?.language == "en" ? (
          <>
            <div className={styles.main}>
              <div className={styles.small}>
                <div className={styles.two}>
                  <div className={styles.date5}>
                    <div className={styles.date6} style={{ marginTop: "6vh" }}>
                      <h4>
                        {" "}
                        <b>Form-A</b>
                      </h4>{" "}
                    </div>
                  </div>
                  <div className={styles.date5}>
                    <div className={styles.date6}>
                      <h4>
                        {" "}
                        <b>Self Declaration Form</b>
                      </h4>{" "}
                    </div>
                  </div>
                  <div className={styles.date7}>
                    <div className={styles.date8}>
                      <div
                        className={styles.add7}
                        style={{
                          marginRight: "80px",
                          width: "145px",
                          height: "150px",
                        }}
                      >
                        {this.props?.photo ? (
                          <img
                            src={`data:image/png;base64,${this.props?.photo}`}
                            // src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.husbandWifeCombinedPhoto}`}
                            alt="Applicant Photo"
                            height="150px"
                            width="144px"
                          />
                        ) : (
                          <h4>Applicant Photo</h4>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                    <div className={styles.date2}>
                      <p style={{ marginLeft: "80px", marginRight: "70px" }}>
                        I am{" "}
                        {`${this?.props?.hutOwnerData?.firstName} ${this?.props?.hutOwnerData?.middleName} ${this?.props?.hutOwnerData?.lastName}`}
                        .. Son/Daughter of Mr.
                        {`${this?.props?.hutOwnerData?.middleName} ${this?.props?.hutOwnerData?.lastName}`}
                        , Age {this.props?.hutOwnerData?.age} years, Adhar
                        Number(if Available){" "}
                        {`${this?.props?.hutOwnerData?.aadharNo}`} Occupation{" "}
                        {`${this?.props?.hutOwnerData?.occupation}`}. Address{" "}
                        {`${this?.props?.slum} ${this?.props?.area} ${this?.props?.village}`}{" "}
                        hereby declares that, For consideration of slum
                        rehabilitation scheme Commercial/residential or both
                        types of huts are in my possession as well as mine Names
                        and names of my spouse or children under eighteen
                        (ignorant) years Other in the area of ​​Municipal
                        Corporation/Municipality/Municipal Council of Local
                        Self-Government The cottage/house/house is not on
                        ownership or rental basis And all this information is my
                        personal Information and belief is true. If the said
                        information is found to be false, under the Indian Penal
                        Code and/or I shall be prosecuted and punished
                        accordingly under the relevant law I am fully aware that
                        I will stay.
                      </p>{" "}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <div className={styles.date4}>
                        <div className={styles.date2}>
                          <p style={{ marginLeft: "80px" }}> Place:-……………….</p>
                        </div>
                      </div>
                      <div
                        className={styles.date4}
                        style={{ marginBottom: "2vh" }}
                      >
                        <div className={styles.date2}>
                          <p style={{ marginLeft: "80px" }}> Date:-……………… </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className={styles.date4}>
                        <div className={styles.date2}>
                          <p style={{ marginRight: "80px" }}>
                            {" "}
                            Applicant Signature:-……………..
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
                            Applicant Name:-……………..{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.main}>
              <div className={styles.small}>
                <div className={styles.two}>
                  <div className={styles.date5}>
                    <div className={styles.date6} style={{ marginTop: "6vh" }}>
                      <h4>
                        {" "}
                        <b> प्रपत्र - अ </b>
                      </h4>{" "}
                    </div>
                  </div>
                  <div className={styles.date5}>
                    <div className={styles.date6}>
                      <h4>
                        {" "}
                        <b> स्वयंघोषणा प्रपत्र </b>
                      </h4>{" "}
                    </div>
                  </div>
                  <div className={styles.date7}>
                    <div className={styles.date8}>
                      <div
                        className={styles.add7}
                        style={{
                          marginRight: "80px",
                          width: "145px",
                          height: "150px",
                        }}
                      >
                        {this.props?.photo ? (
                          <img
                            src={`data:image/png;base64,${this.props?.photo}`}
                            // src={`${urls.CFCURL}/file/preview?filePath=${this?.props?.husbandWifeCombinedPhoto}`}
                            alt="Applicant Photo"
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
                        {`${this?.props?.hutOwnerData?.firstNameMr} ${this?.props?.hutOwnerData?.middleNameMr} ${this?.props?.hutOwnerData?.lastNameMr}`}
                        .. श्री.
                        {`${this?.props?.hutOwnerData?.middleNameMr} ${this?.props?.hutOwnerData?.lastNameMr}`}{" "}
                        यांचा मुलगा/मुलगी वय {this.props?.hutOwnerData?.age}{" "}
                        वर्ष, आधार क्रमांक (असल्यास){" "}
                        {`${this?.props?.hutOwnerData?.aadharNo}`} व्यवसाय{" "}
                        {`${this?.props?.hutOwnerData?.occupation}`}. राहणार{" "}
                        {`${this?.props?.slum} ${this?.props?.area} ${this?.props?.village}`}
                        . याद्वारे घोषित करतो/करते की, झोपडपट्टी पुनर्वसन
                        योजनेच्या विचारार्थ असलेली वाणिज्यिक/निवासी किंवा दोन्ही
                        प्रकारातील झोपडी माझ्या ताब्यात आहे तसेच माझ्या नावे आणि
                        माझ्या पतीच्या/पत्नीच्या नावे अथवा अठरा वर्षाखालील
                        (अज्ञान) मुलांच्या नावे या महानगरपालिका/
                        नगरपालिका/नगरपरिषद स्थानिक स्वराज्य संस्थेच्या क्षेत्रात
                        अन्य झोपडी/घर/सदनिका मालकी तत्वावर अथवा भाडे तत्वावर
                        नाही आणि हि सर्व माहिती माझ्या व्यक्तिगत माहिती व
                        समजुतीनुसार खरी आहे. सदर माहिती खोटी आढळून आल्यास,
                        भारतीय दंड संहिता अन्वये आणि/किंवा संबंधित कायद्यानुसार
                        माझ्यावर खटला भरला जाईल व त्यानुसार मी शिक्षेस पात्र
                        राहीन याची मला पूर्ण जाणीव आहे.
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
                            अर्जदाराचे नाव:-……………..{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Index;
