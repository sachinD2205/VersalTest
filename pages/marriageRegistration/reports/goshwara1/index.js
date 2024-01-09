import { Button, Paper } from "@mui/material";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./goshwara.module.css";

// Goshwara Part – 1
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
      {/* <BasicLayout titleProp={'none'}> */}
      <Paper>
        <div>
          <center>
            <h1>गोषवारा भाग १</h1>
          </center>
        </div>
        <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            print
          </Button>
          <Button
            onClick={backToHomeButton}
            variant="contained"
            color="primary"
          >
            back To home
          </Button>
        </div>
      </Paper>
      <ComponentToPrint ref={componentRef} />
      {/* </BasicLayout> */}
    </div>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <Paper>
          <table className={styles.report}>
            <tr className={styles.trrow}>
              <td colSpan={2}>
                <b>विवाह निबंधक कार्यालय :</b>
              </td>
            </tr>
            <tr>
              <th colSpan={2}>
                <h1>गोषवारा भाग १</h1>
              </th>
            </tr>
            <tr>
              <td>
                <b>विवाह नोंदणी क्रमांक:</b>
              </td>
              <td className={styles.trrow}>
                <b>दिनांक :</b>
              </td>
            </tr>
          </table>
          <table className={styles.data}>
            <tr>
              <th style={{ width: "50%" }}>वराची माहीती </th>
              <th style={{ width: "25%" }}>छायाचित्र </th>
              <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
            </tr>
            <tr>
              <td>
                नावं:<br></br>
                वय :<br></br>
                पत्ता :<br></br>
                सही :<br></br>
              </td>
              <td
                style={{
                  padding: "1.5vh",
                }}
                className={styles.tdcard}
              >
                <div
                  className="photo"
                  style={{
                    backgroundColor: "beige",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  वराचा छायाचित्र
                </div>
              </td>

              <td
                style={{
                  padding: "1.5vh",
                }}
              >
                <div
                  className="thumb"
                  style={{
                    backgroundColor: "beige",
                    width: "100px",
                    height: "100px",
                    marginLeft: "7.2vw",
                  }}
                >
                  वराचा अंगठ्याचा ठसा
                </div>
              </td>
            </tr>
            <tr>
              <th style={{ width: "50%" }}>वधूची माहीती </th>
              <th style={{ width: "25%" }}>छायाचित्र </th>
              <th style={{ width: "25%" }}>अंगठ्याचा ठसा</th>
            </tr>
            <tr>
              <td>
                नावं:<br></br>
                वय :<br></br>
                पत्ता :<br></br>
                सही :<br></br>
              </td>
              <td
                style={{
                  padding: "1.5vh",
                }}
                className={styles.tdcard}
              >
                <div
                  className="photo"
                  style={{
                    backgroundColor: "beige",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  वधूचा छायाचित्र
                </div>
              </td>

              <td
                style={{
                  padding: "1.5vh",
                }}
              >
                <div
                  className="thumb"
                  style={{
                    backgroundColor: "beige",
                    width: "100px",
                    height: "100px",
                    marginLeft: "7.2vw",
                  }}
                >
                  वधूचा अंगठ्याचा ठसा
                </div>
              </td>
            </tr>
          </table>
          <table className={styles.report}>
            <tr>
              <td>
                {" "}
                <b>दिनांक :</b>
              </td>
            </tr>
            <tr className={styles.trrowf}>
              <td colSpan={2} style={{ paddingRight: "50px" }}>
                {" "}
                <b>
                  विवाह निबंधक <br></br>फ क्षेत्रिय कार्यालय:
                </b>
              </td>
            </tr>
          </table>
        </Paper>
      </div>
    );
  }
}

export default Index;
