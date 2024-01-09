import { Button, Grid } from "@mui/material";
import React, { useEffect,useState } from "react";
import { useReactToPrint } from "react-to-print";
import router from "next/router";
import styles from "../goshwara.module.css";
import urls from "../../../../../../URLS/urls";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import html2pdf from "html2pdf-jspdf2";
import ReactDOMServer from "react-dom/server";
import "jspdf-autotable";
const Index = ({
  connectionData,
  usageType,
  ownership,
  husbandWifeCombinedPhoto,
  slumName,
  handleClose,
  villageName,
  componentRef,
}) => {

  const [hutOwner, setHutOwner] = useState({});

  useEffect(() => {
    let temp =
      connectionData &&
      connectionData?.mstHutMembersList?.find(
        (each) => each.headOfFamily === "Y"
      );
    setHutOwner(temp);
  }, [connectionData]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Photopass",
  });

  const handleGeneratePdf = () => {
    handleClose();
    let opt = {
      margin: 1,
      filename: "photopass.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "legal", orientation: "portrait" },
    };  
   
    
    const element = ReactDOMServer.renderToString(
      <ComponentToPrintPhotopass
        connectionData={connectionData}
        hutOwner={hutOwner}
        slumName={slumName}
        husbandWifeCombinedPhoto={husbandWifeCombinedPhoto}
        usageType={usageType}
        ownership={ownership}
        villageName={villageName}
        ref={componentRef}
      />
    );
    let base64str;
    html2pdf().from(element).toPdf().set(opt).output("datauristring").save();
  };


  // view
  return (
    <>
      <div style={{ backgroundColor: 'white'}}>
        <ComponentToPrintPhotopass
          connectionData={connectionData}
          hutOwner={hutOwner}
          slumName={slumName}
          usageType={usageType}
          husbandWifeCombinedPhoto={husbandWifeCombinedPhoto}
          ownership={ownership}
          villageName={villageName}
          ref={componentRef}
        />
      
      <br />

      <div>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",   backgroundColor: 'white'
          }}
        >
          <Grid item>
            <Button
              type="primary"
              color="error"
              size="small"
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
              size="small"
              variant="contained"
              onClick={handlePrint}
            >
              <FormattedLabel id="print" />
            </Button>
          </Grid>
          {/* <Grid item>
            <Button
              type="primary"
              color="success"
              size="small"
              variant="contained"
              onClick={handleGeneratePdf}
            >
              <FormattedLabel id="download" />
            </Button>
          </Grid> */}
        </Grid>
      </div>
      </div>
    </>
  );
};

class ComponentToPrintPhotopass extends React.Component {
  render() {
    // const toWords = new ToWords({ localeCode: "mr-IN" });
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                <div className={styles.add8}>
                  <div className={styles.add}>
                    {/* <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका </b>
                    </h5> */}
                    <h5>
                      {" "}
                      <b>
                        मुंबई पुणे महामार्ग पिंपरी पुणे 411-018 महाराष्ट्र, भारत
                      </b>
                    </h5>
                    {/* <h5>
                      <b> महाराष्ट्र, भारत</b>
                    </h5> */}
                  </div>
                </div>
                <div className={styles.add8}>
                  <div className={styles.add1}>
                    <h5>
                      <b>फोन क्रमांक:91-020-2742-5511/12/13/14</b>
                    </h5>
                    <h5>
                      <b>
                        {" "}
                        इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in
                      </b>
                    </h5>
                    {/* <h5>
                      <b>/ sarathi@pcmcindia.gov.in</b>
                    </h5> */}
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
              <h2 className={styles.heading}>
                {/* <b>पावती</b> */}
                <h5>
                  {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                </h5>
              </h2>
            </div>

            <div
              className={styles.add7}
              style={{
                marginLeft: "65%",
                marginRight: "40px",
                marginTop: "20px",
                // width: "220px",
                textAlign: "right",
                display: "flex",
              }}
            >
              <p>
                <b>
                  ओळखपत्राचा अ.क्र.: {this?.props?.connectionData?.hutNo}
                </b>
              </p>
              
              {/* &nbsp; */}
              {/* <p>{this?.props?.connectionData?.hutNo}</p> */}
            </div>

            <div className={styles.two}>
              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6} style={{ marginTop: "4vh" }}>
                  <h4>
                    {" "}
                    <b>झोपडीधारकाचे ओळखपत्र </b>
                  </h4>{" "}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  marginTop: "4vh",
                }}
              >
                {/*********** LETTER BODY ****************/}

                <div
                  className={styles.date4}
                  style={{ marginBottom: "2vh", width: "800px" }}
                >
                  <div>
                    <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                      {console.log("aaa,,,,,,,,,,,", this.props)}
                      १. झोपडीधारक कुटुंब प्रमुख पती/पत्नीचे संपूर्ण नाव: {`  `}
                      {`${this?.props?.hutOwner?.firstNameMr} ${this?.props?.hutOwner?.middleNameMr} ${this?.props?.hutOwner?.lastNameMr}`}
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                      २. झोपडीतील एकूण व्यक्तींची संख्या: {`  `}{" "}
                      {`${this?.props?.connectionData?.totalFamilyMembers}`}
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                      ३. झोपडपट्टीचे नाव व पत्ता: {`  `}{" "}
                      {`${
                        this?.props?.slumName ? this?.props?.slumName : "-"
                      },${
                        this?.props?.villageName
                          ? this?.props?.villageName
                          : "-"
                      }`}
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                      ४. झोपडीचा वापर: {`  `} {`${this?.props?.usageType}`}
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                      ५. झोपडीचे क्षेत्रफळ-निवासी: {`  `}{" "}
                      {`${this?.props?.connectionData?.areaOfHut}`}
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                      ६. विधानसभा मतदार संघाचे नाव {"  "}{" "}
                      {`${this?.props?.connectionData?.assemblyConstituency}`}{" "}
                      यादीतील भाग क्र.{"  "}{" "}
                      {`${this?.props?.connectionData?.partNoInList}`} अनु.
                      क्र.------------- वॉर्ड क्र.
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                      ७. जमिनीची मालकी: {`  `} {`${this?.props?.ownership}`}{" "}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    height: "150px",
                    width: "145px",
                    marginRight: "40px",
                  }}
                >
                  {this.props?.husbandWifeCombinedPhoto ? (
                    <img
                    src={`data:image/png;base64,${this.props?.husbandWifeCombinedPhoto}`}
                      alt="अर्जदाराचा फोटो"
                      height="150px"
                      width="144px"
                    />
                  ) : (
                    <h4>अर्जदाराचा फोटो</h4>
                  )}
                </div>
              </div>

              <div
                className={styles.add7}
                style={{
                  marginLeft: "80%",
                  marginRight: "40px",
                  marginTop: "50px",
                  width: "145px",
                  textAlign: "right",
                }}
              >
                <p> सक्षम प्राधिकारी तथा सहा. आयुक्त यांची सही </p>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    <u>अटी व शर्ती </u>{" "}
                  </p>
                </div>
              </div>

              <div
                className={styles.date4}
                style={{ marginBottom: "2vh", marginTop: "2vh" }}
              >
                <div>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    १. सदरहू झोपडीच्या जागेवर झोपडीधारकाचा कोणताही मालकी हक्क
                    राहणार नाही.
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    २. ताब्यात घेतलेली भूभाग/ झोपडी कोणासही भाड्याने अगर
                    पोटभाड्याने दिली जाऊ नये.
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    ३. भू -भागधारकाने / झोपडीच्या मालकाने वरील अटींचा भंग
                    केल्यास किंवा कोणत्याही प्रकारे गैरवापर केल्यास सादर
                    भू-भागधारक/ झोपडीमालक बाहेर काढून टाकण्यास पात्र ठरेल आणि
                    सदर भू-भाग /झोपडी मोडून टाकणेची तजवीज केली जाईल /करावी
                    लागेल.
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    ४. आपल्याला देण्यात आलेल्या मागणी बिलाप्रमाणे रक्कम रोख भरणा
                    करावी.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
