import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import BasicLayout from "../../../../containers/Layout/BasicLayout";

import { Button, Card } from "@mui/material";
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
        <Card>
          <div>
            <center>
              <h1>Marriage Registration Receipt</h1>
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
        </Card>
        <ComponentToPrint ref={componentRef} />
      </BasicLayout>
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <Card>
          <table className={styles.report}>
            <tr>
              <div className={styles.main}>
                <div className={styles.two}>
                  <img
                    src="/logo.png"
                    alt="Maharashtra Logo"
                    height={100}
                    width={100}
                  ></img>
                </div>
              </div>
              <th colSpan={2}>
                <h2>
                  <b>पिंपरी चिंचवड महानगरपलिका,पिंपरी पुणे - ४११०१८</b>
                </h2>
              </th>
            </tr>
            <tr>
              <th colSpan={2}>
                <h3>सामान्य पावती</h3>
              </th>
            </tr>

            <tr>
              <td>{/* <b>दिनांक :</b> */}</td>

              <td>
                <b>दिनांक :</b>
              </td>
            </tr>

            <tr>
              <td>
                <b>पावती क्रमांक :</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>नाव : श्री/मे.</b>
              </td>
            </tr>

            <tr>
              <td>
                <b>रा. :</b>
              </td>
            </tr>

            <tr>
              <td>
                <b>यांच्याकडून :</b>
              </td>

              <td>
                <b>याबद्दल रोख मिळाले. </b>
              </td>
            </tr>

            <tr>
              <td>
                <b>हस्ते.</b>
              </td>
            </tr>

            <br />
          </table>
          <table className={styles.report}>
            {/* <tr>
              <td>
                <b>पावती क्रमांक :</b>
              </td>
            </tr> */}

            <tr>
              <td>
                <b>विवाह नोंदणी शुल्क फी / विलंब फी </b>
              </td>

              <th rowSpan={4} colSpan={1}>
                <b>२०००.०</b>
              </th>
            </tr>

            <tr>
              <th rowSpan={4} colSpan={1}>
                <b>एकुण.</b>
              </th>
              <th rowSpan={4} colSpan={1}>
                <b>२०००.०</b>
              </th>
            </tr>
          </table>

          <table className={styles.report}>
            <tr>
              <tr>
                <td>
                  <b>अक्षरी रुपये : (दोन हजार रुपये)</b>
                </td>
              </tr>
            </tr>
          </table>
        </Card>
      </div>
    );
  }
}

export default Index;
