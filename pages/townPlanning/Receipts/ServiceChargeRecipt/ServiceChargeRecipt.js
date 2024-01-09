import { Button, Card } from "@mui/material";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

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
    <>
      <div>
        <ComponentToPrint ref={componentRef} />
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
            router.push(
              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny"
            );
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
      <div>
        <Card>
          <table className={styles.report}>
            <tr>
              <th colSpan={2}>
                <h2>चलन</h2>
              </th>
            </tr>
            <tr>
              <th colSpan={2}>
                <h3>
                  (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८)
                </h3>
              </th>
            </tr>

            <tr>
              <td>
                <b>दिनांक :</b>
              </td>

              <td>
                <b>वेळ :</b>
              </td>
            </tr>

            <tr>
              <td>
                <b>वर :</b>
              </td>
            </tr>
            <tr>
              <td>
                <b>वधु :</b>
              </td>
            </tr>

            <tr>
              <td>
                <b>विवाह नोंदणी क्र :</b>
              </td>
            </tr>

            <tr>
              <td>
                <b>पावती क्रमांक :</b>
              </td>
            </tr>

            <tr>
              <td>
                <b>विवाह दिनांक :</b>
              </td>
            </tr>

            <br />

            <tr>
              <h5 style={{ padding: "15px" }}>
                <b>
                  पुढीलप्रमाणे फी मिळाली :-
                  <br />
                  ५(२) विवाह शास्त्रोक्त पद्धतीने झालेल्याच्या दिनांकापासून रू.{" "}
                  <br />
                  ३६५ दिवसानंतर विवाह नोंदणीकृत आकारण्यात येणारे विवाह नोंदणी
                  शुल्क
                  <br />
                </b>
                <b>एकूण फी</b>
              </h5>
            </tr>
          </table>

          <table className={styles.report}>
            <tr>
              <td>
                प्रशासन अधिकारी <br />
                ब क्षेत्रीय कार्यालय
                <br />
                पि.चि.म.न.पा.पिंपरी-१८
              </td>
            </tr>
          </table>
        </Card>
      </div>
    );
  }
}

export default Index;
