import { Button, Paper } from "@mui/material";
import React, { useRef } from "react";
import styles from "./report.module.css";
// import { FormattedMessage } from 'umi'
import { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";

const PaymentReceipt = () => {
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
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
              "/marriageRegistration/transactions/newMarriageRegistration/scrutiny",
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
      <>
        <div>
          <div className="report">
            <Paper sx={{ padding: 5 }}>
              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan="12" style={{ padding: "5vh" }}>
                      <h3 style={{ color: "red" }}>
                        <b>RECEIPT/पावती</b>
                      </h3>
                      <h4 style={{ marginLeft: "80vh" }}>Customer Copy</h4>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={2}>Receipt No/पावती क्र</th>
                    <th colSpan={2}>Date/दिनांक</th>
                    <th colSpan={2}>Related/च्या करता</th>
                    <th colSpan={3}>CFC Ref./ सी एफ सी संदर्भ</th>
                    <th colSpan={3}>Counter Ref./खिडकी संदर्भ</th>
                  </tr>
                  <tr>
                    <td colSpan={2}>da</td>
                    <td colSpan={2}>dad</td>
                    <td colSpan={2}>dad</td>
                    <td colSpan={3}>dadad</td>
                    <td colSpan={3}>sdsds</td>
                  </tr>
                  <tr style={{ textAlign: "left" }}>
                    <th
                      colSpan={3}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      Received From/कोणाकडून
                    </th>
                    <td
                      colSpan={9}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      abc
                    </td>
                  </tr>
                  <tr style={{ textAlign: "left", textAlign: "left" }}>
                    <th
                      colSpan={3}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      Subject/विषय
                    </th>
                    <td
                      colSpan={9}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      abc
                    </td>
                  </tr>
                  <tr style={{ textAlign: "left" }}>
                    <th
                      colSpan={3}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      Narration/विवरण
                    </th>
                    <td
                      colSpan={9}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      qwe
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ height: "20px" }}>
                    <th colSpan={12}>Payment Mode/देयकाचा प्रकार </th>
                    {/* <th colSpan={7}></th> */}
                  </tr>
                  <tr>
                    <th colSpan={2}>Mode/प्रकार</th>
                    <th colSpan={2}>Rupees/रुपये</th>
                    <th colSpan={2}>Cheque no/धनादेश क्र</th>
                    <th colSpan={3}>Cheque date/धनादेश दिनांक</th>
                    <th colSpan={3}>Bank name/खिडकी संदर्भ</th>

                    {/* <th colSpan={2}> */}
                    {/* <FormattedMessage id="villageReport1.table.naAssessment" /> */}
                    {/* ethe taka */}
                    {/* </th> */}
                  </tr>

                  <tr style={{ height: "20px" }}>
                    <th colSpan={2}></th>
                    <th colSpan={2}></th>

                    <th colSpan={2}></th>

                    <th colSpan={3}></th>

                    <th colSpan={3}></th>
                  </tr>
                  <tr>
                    <th colSpan={2}>Reference No /संदर्भ क्र</th>
                    <th colSpan={2}>Date /दिनांक</th>
                    <th colSpan={3}>Details/तपशील</th>
                    <th colSpan={3}>Payable Amount /देय रक्कम</th>
                    <th colSpan={2}>Amt. Recd / मिळालेली रक्कम</th>
                  </tr>
                  <tr>
                    <td colSpan={2}>1324</td>
                    <td colSpan={2}>21/05/22</td>

                    <td colSpan={3}>fsdf</td>

                    <td colSpan={3}>2000</td>

                    <td colSpan={2}>1000</td>
                  </tr>
                  {/* {this.props.dataToMap &&
                this.props.dataToMap.map((r) => (
                  <tr>
                    <td>{r.surveyHissaNo}</td>
                    <td>{r.tenureName}</td>
                    <td>
                      {r.totalAreaH
                        .substring(0, r.totalAreaH.length - 2)
                        .concat('.')
                        .concat(r.totalAreaH.substring(r.totalAreaH.length - 2))}
                    </td>
                    <td>{r.potkharabaType}</td>
                    <td>{r.cultivableAreaInt}</td>
                    <td>
                      {r.netCultiAreaH
                        .substring(0, r.netCultiAreaH.length - 2)
                        .concat('.')
                        .concat(r.netCultiAreaH.substring(r.netCultiAreaH.length - 2))}
                    </td>
                    <td>{r.assessment}</td>
                    <td>{r.publicRightsOfWayAndEasements}</td>
                    <td>{r.particularsOfAlteration}</td>
                    <td>{r.orderSanctioningChanges}</td>
                    <td>{r.orderDate}</td>
                    <td>{r.remarks}</td>
                  </tr>
                ))} */}
                  <tr colSpan="12">
                    <td colSpan={2}>
                      <b>Amount In Words/अक्षरी रुपये</b>
                    </td>
                    <td colSpan={5}>
                      <b></b>
                    </td>
                    <td colSpan={2}>
                      <b>Total received amount/एकूण मिळालेली रक्कम</b>
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr colSpan="12" style={{ height: "30px" }}>
                    <td
                      colSpan={12}
                      style={{ textAlign: "left", paddingTop: "5vh" }}
                    >
                      <b style={{ marginLeft: "2vh" }}>PCMC Help Line 111000</b>
                      <br />
                      <b style={{ marginLeft: "820px" }}>
                        Receiver's Signature/स्वीकारनार्याची स्वाक्षरी{" "}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                id="table-to-xls"
                className={styles.report_table}
                style={{ marginTop: "5vh" }}
              >
                <thead>
                  <tr>
                    <th colSpan="12" style={{ padding: "5vh" }}>
                      <h3 style={{ color: "red" }}>
                        <b>RECEIPT/पावती</b>
                      </h3>
                      <h4 style={{ marginLeft: "80vh" }}>Department Copy</h4>
                    </th>
                  </tr>
                  <tr>
                    <th colSpan={2}>Receipt No/पावती क्र</th>
                    <th colSpan={2}>Date/दिनांक</th>
                    <th colSpan={2}>Related/च्या करता</th>
                    <th colSpan={3}>CFC Ref./ सी एफ सी संदर्भ</th>
                    <th colSpan={3}>Counter Ref./खिडकी संदर्भ</th>
                  </tr>
                  <tr>
                    <td colSpan={2}>da</td>
                    <td colSpan={2}>dad</td>
                    <td colSpan={2}>dad</td>
                    <td colSpan={3}>dadad</td>
                    <td colSpan={3}>sdsds</td>
                  </tr>
                  <tr style={{ textAlign: "left" }}>
                    <th
                      colSpan={3}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      Received From/कोणाकडून
                    </th>
                    <td
                      colSpan={9}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      abc
                    </td>
                  </tr>
                  <tr style={{ textAlign: "left", textAlign: "left" }}>
                    <th
                      colSpan={3}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      Subject/विषय
                    </th>
                    <td
                      colSpan={9}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      abc
                    </td>
                  </tr>
                  <tr style={{ textAlign: "left" }}>
                    <th
                      colSpan={3}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      Narration/विवरण
                    </th>
                    <td
                      colSpan={9}
                      style={{ paddingLeft: "2vh", textAlign: "left" }}
                    >
                      qwe
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ height: "20px" }}>
                    <th colSpan={12}>Payment Mode/देयकाचा प्रकार </th>
                    {/* <th colSpan={7}></th> */}
                  </tr>
                  <tr>
                    <th colSpan={2}>Mode/प्रकार</th>
                    <th colSpan={2}>Rupees/रुपये</th>
                    <th colSpan={2}>Cheque no/धनादेश क्र</th>
                    <th colSpan={3}>Cheque date/धनादेश दिनांक</th>
                    <th colSpan={3}>Bank name/खिडकी संदर्भ</th>

                    {/* <th colSpan={2}> */}
                    {/* <FormattedMessage id="villageReport1.table.naAssessment" /> */}
                    {/* ethe taka */}
                    {/* </th> */}
                  </tr>

                  <tr style={{ height: "20px" }}>
                    <th colSpan={2}></th>
                    <th colSpan={2}></th>

                    <th colSpan={2}></th>

                    <th colSpan={3}></th>

                    <th colSpan={3}></th>
                  </tr>
                  <tr>
                    <th colSpan={2}>Reference No /संदर्भ क्र</th>
                    <th colSpan={2}>Date /दिनांक</th>
                    <th colSpan={3}>Details/तपशील</th>
                    <th colSpan={3}>Payable Amount /देय रक्कम</th>
                    <th colSpan={2}>Amt. Recd / मिळालेली रक्कम</th>
                  </tr>
                  <tr>
                    <td colSpan={2}>1324</td>
                    <td colSpan={2}>21/05/22</td>

                    <td colSpan={3}>fsdf</td>

                    <td colSpan={3}>2000</td>

                    <td colSpan={2}>1000</td>
                  </tr>
                  {/* {this.props.dataToMap &&
                this.props.dataToMap.map((r) => (
                  <tr>
                    <td>{r.surveyHissaNo}</td>
                    <td>{r.tenureName}</td>
                    <td>
                      {r.totalAreaH
                        .substring(0, r.totalAreaH.length - 2)
                        .concat('.')
                        .concat(r.totalAreaH.substring(r.totalAreaH.length - 2))}
                    </td>
                    <td>{r.potkharabaType}</td>
                    <td>{r.cultivableAreaInt}</td>
                    <td>
                      {r.netCultiAreaH
                        .substring(0, r.netCultiAreaH.length - 2)
                        .concat('.')
                        .concat(r.netCultiAreaH.substring(r.netCultiAreaH.length - 2))}
                    </td>
                    <td>{r.assessment}</td>
                    <td>{r.publicRightsOfWayAndEasements}</td>
                    <td>{r.particularsOfAlteration}</td>
                    <td>{r.orderSanctioningChanges}</td>
                    <td>{r.orderDate}</td>
                    <td>{r.remarks}</td>
                  </tr>
                ))} */}
                  <tr colSpan="12">
                    <td colSpan={2}>
                      <b>Amount In Words/अक्षरी रुपये</b>
                    </td>
                    <td colSpan={5}>
                      <b></b>
                    </td>
                    <td colSpan={2}>
                      <b>Total received amount/एकूण मिळालेली रक्कम</b>
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                  <tr colSpan="12" style={{ height: "30px" }}>
                    <td
                      colSpan={12}
                      style={{ textAlign: "left", paddingTop: "5vh" }}
                    >
                      <b style={{ marginLeft: "2vh" }}>PCMC Help Line 111000</b>
                      <br />
                      <b style={{ marginLeft: "820px" }}>
                        Receiver's Signature/स्वीकारनार्याची स्वाक्षरी{" "}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default PaymentReceipt;
