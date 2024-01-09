import { Button, Paper } from "@mui/material";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

import styles from "./goshwara.module.css";

const Index = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };

  // view
  return (
    <div>
      <BasicLayout titleProp={"none"}>
        <Paper>
          <div>
            <center>
              <h1>अर्जाची पावती / पोहोच पावती / Acknowledgement slip</h1>
            </center>
          </div>
          <div style={{ padding: 10 }}>
            <Button
              type="primary"
              style={{ float: "right" }}
              onClick={handlePrint}
            >
              print
            </Button>
            <Button onClick={backToHomeButton} type="primary">
              back To home
            </Button>
          </div>
        </Paper>
        <ComponentToPrint ref={componentRef} />
      </BasicLayout>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <Paper>
          <table
            className={styles.report}
            style={{ marginLeft: "50px", marginTop: "50px" }}
          >
            {/* <tr>
              <th colspan="3">
                <h2>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</h2>
              </th>
            </tr> */}

            <div className={styles.main1}></div>

            <tr>
              <th colSpan={"3"}>
                <h2>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</h2>
                <h3>नागरी सुविधा केंद्र (संगणक प्रणाली )</h3>
                <h4>अर्जाची पावती / पोहोच पावती </h4>
              </th>
            </tr>

            {/* <tr className={styles.trThree}>
              <th colspan="3">
                <h4>अर्जाची पावती / पोहोच पावती 1</h4>
              </th>
            </tr> */}
            <tr>
              <th colSpan={"3"}>
                <div className={styles.main}>
                  <img
                    src="/logo.png"
                    alt="Maharashtra Logo"
                    height={100}
                    width={100}
                  />

                  <img
                    src="/barcode.jpg"
                    alt="Maharashtra Logo"
                    height={100}
                    width={100}
                  />
                </div>
              </th>
            </tr>

            {/* <tr>
              <th colspan="3">
                <h2>पिंपरी चिंचवड महानगरपलिका, पिंपरी ४११०१८</h2>
              </th>
            </tr>

            <tr>
              <th colspan="3">
                <h3>नागरी सुविधा केंद्र (संगणक प्रणाली )</h3>
              </th>
            </tr>

            <tr className={styles.trThree}>
              <th colspan="3">
                <h4>अर्जाची पावती / पोहोच पावती / Acknowledgement slip</h4>
              </th>
            </tr> */}
          </table>
          <table className={styles.report} style={{ marginLeft: "50px" }}>
            <tr className={styles.trFour} style={{ marginLeft: "25px" }}>
              <td colSpan={"2"}>
                <b>Receipt No:</b>
              </td>
              <div className={styles.date}>
                <td>
                  <b>दिनांक :</b>
                </td>
              </div>
            </tr>

            <tr className={styles.trFive} style={{ marginLeft: "25px" }}>
              <div>
                <td>
                  <b>अर्ज क्र :</b>
                </td>
              </div>
              <div className={styles.vel}>
                <td>
                  <b>वेळ :</b>
                </td>
              </div>
              <div className={styles.vel}>
                <td>
                  <b>कार्यालय :</b>
                </td>
              </div>
            </tr>

            <tr className={styles.trSix} style={{ marginLeft: "25px" }}>
              <td>
                <b>विषय :</b>
              </td>
              <div className={styles.vibhag}>
                <td>
                  <b>विभाग :</b>
                </td>
              </div>
              <div className={styles.patta}>
                <td>
                  <b>पत्ता :</b>
                </td>
              </div>
            </tr>

            <tr className={styles.trSeven} style={{ marginLeft: "25px" }}>
              <td>
                <b>अर्जादाराचे नाव :</b>
              </td>
              <div className={styles.mobile}>
                <td>
                  <b>Mobile No :</b>
                </td>
              </div>
              <div className={styles.pattaa}>
                <td>
                  <b>पत्ता :</b>
                </td>
              </div>
            </tr>

            <br />
          </table>

          <table className={styles.report} style={{ marginLeft: "50px" }}>
            <tr>
              <h5 style={{ padding: "15px", marginLeft: "50px" }}>
                महोदय,
                <br />
                आपण दिलेल्या अर्जाची नोंद आम्ही घेतली आहे.आपला अर्ज क्रमांक
                ______ _____ _____ ___ आहे.आपण दिलेले काम अंदाजे <br />
                दि._______ पर्यत पूर्ण होणे अपेक्षित आहे. आपल्या अर्जावर तपासणी
                करून आपणांस त्याबाबत लवकरच SMS द्वारे कळविण्यात येईल.
                <br />
                आपले प्रमाणपत्र / कागदपत्र मिळविण्याचे ठिकाण ________/_______
                राहील.
                <br />
                २०(विस फक्त)
              </h5>
            </tr>
          </table>

          <table className={styles.report} style={{ marginLeft: "50px" }}>
            <tr style={{ marginLeft: "25px" }}>
              <td>
                <h5 style={{ padding: "10px", marginLeft: "20px" }}>
                  अर्जासोबत खालील कागदपत्रे स्वीकारण्यात आली.
                  <br />
                  १)फॉर्ममध्ये कॉलम ७ मध्ये पुरोहित / भटजी यांची माहिती व
                  स्वाक्षरी दिनांका सहित असावी..
                </h5>
              </td>
            </tr>

            <tr>
              <td>
                <h5 style={{ marginLeft: "20px" }}>
                  <b>कागदपत्रांची यादी :</b>
                </h5>
              </td>
            </tr>
            <tr>
              <b>1)</b>
            </tr>

            <tr>
              <b>2)</b>
            </tr>

            {/* <tr>
              <b>3)</b>
            </tr>

            <tr>
              <b>4)</b>
            </tr>

            <tr>
              <b>5)</b>
            </tr>

            <tr>
              <b>6)</b>
            </tr> */}
          </table>
        </Paper>
      </div>
    );
  }
}

export default Index;
