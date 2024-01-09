import { Button, Paper, Stack } from "@mui/material";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "./FireNoObjectionCertificate.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";

// http://localhost:4000//FireBrigadeSystem/reports/FireNoObjectionCertificate
// Index
const Index = () => {
  const router = useRouter();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [loadderState, setLoadderState] = useState(false);
  const language = useSelector((state) => state?.labels.language);
  // view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <div style={{ color: "white" }}>
          <Paper className={styles.MainPaper}>
            <div className={styles.Title}>
              <h1> NOC</h1>
            </div>
            <Stack spacing={5} direction='row' className={styles.Stack}>
              <Button
                onClick={() => {
                  router.push("/FireBrigadeSystem");
                }}
                type='button'
                variant='contained'
                color='primary'>
                {<FormattedLabel id='back' />}
              </Button>
              <Button variant='contained' type='primary' onClick={handlePrint}>
                {language == "en" ? "Print" : "प्रिंट"}
              </Button>
            </Stack>
            <ComponentToPrint ref={componentRef} />
          </Paper>
        </div>
      )}
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div className={styles.MainDiv}>
        <table className={styles.Table}>
          <tr className={styles.TitleHeaderImage}>
            <td>
              <img
                className={styles.img1}
                src='/logo.png'
                alt='Maharashtra Logo'></img>
            </td>
            <td className={styles.tt}>
              <div className={styles.div1}>पिंपरी चिंचवड महानगरपालिका</div>
              <div className={styles.div2}>अग्निशमन विभाग</div>
              <div className={styles.div3}>
                Pimpri Chinchwad Municipal Corporation
              </div>
              <div className={styles.div4}>Fire Department.</div>
            </td>
            <td>
              <img
                src='/rts_servicelogo.png'
                alt='Maharashtra Logo'
                className={styles.img2}></img>
            </td>
          </tr>

          <tr className={styles.FileOwc}>
            <td>
              <strong>File No:- </strong>
            </td>
            <td>
              <strong>O.W.No:- Fire/01/5RC-455/ WS/797/2022</strong>
            </td>
            <td>
              <strong>Date:-</strong>
            </td>
          </tr>

          <hr className={styles.hr}></hr>
          <tr className={styles.Name1}>
            <td>
              <strong>FIRE NO OBJECTION CERTIFICATE</strong>
            </td>
          </tr>
          <tr className={styles.Token}>
            <td>
              <strong>Token No:- 103321220012182</strong>
            </td>
            <td>
              <strong>Token Dt:- 15/12/2021</strong>
            </td>
          </tr>
          <tr className={styles.TextArea}>
            <td>
              <strong>
                M/s. Vishal Chitra Mandir, Sr. No 206/1, Pimpri-Waghere, Pimpri,
                Pune-411018.
              </strong>{" "}
              had applied for Cinema's Business Fire NOC against Comm.
              building's <strong>Final Fire NOC Of </strong>Dedicated Multiplex
              Theatre for{" "}
              <strong>
                03 Nos. of Screens. (Seating Capacity Screen No.01: 454 Seats,
                Screen No.02- 201 Seats, Screen No.03- 195 Seats, & Seat
                Capacity 850 Nos.)
              </strong>
            </td>
          </tr>

          <tr className={styles.Points}>
            <td>
              The Fire Brigade Officer had visited the Theater and as per his
              technical remarks this NOC is being issued to you on following
              conditions.
            </td>
          </tr>

          <tr>
            <td>
              <ol>
                <li>
                  The entire Fire Fighting System installation installed at the
                  site should be maintained excellent working condition for Fire
                  Emergency and training to be imparted to your employees.
                </li>
                <li>
                  You will carry out refilling and testing of the Fire
                  Extinguishers and maintain Fire Fighting system from competent
                  person and submit the certificate in writing every year along
                  with the renewal application.
                </li>

                <li>
                  You will keep the static water tanks full for emergency
                  purpose and also for spectators every time.
                </li>
                <li>
                  You will keep all passages and corridors free from any
                  obstructions and combustible material.
                </li>
                <li>
                  The emergency Exit sign shall be kept ON while screening of
                  Films.
                </li>
                <li>
                  No smoking boards shall be always displayed in Cinema Hall to
                  avoid Fire.
                </li>
                <li>
                  This NOC is issued as per The Maharashtra Cinema Regulation
                  Act, 1996 and The Bombay Cinema Regulation Act, 1983 for the
                  period of One year i.e. 01/01/2022 to 31/12/2022.
                </li>
                <li>
                  All the rules, regulations and condition by PCMC from the to
                  time shall be binding on you and any violation of these shall
                  be viewed seriously.
                </li>
                <li>
                  Renewal of these NOC should be done before 31 December every
                  year, and next renewal of this NOC will be before 31 December
                  2022.
                </li>
                <li>
                  Necessary 'B' form towards the maintenance and operational
                  working of the Fire Fighting system to be submitted to the
                  Fire office as per the Sec.3(3) of the Fire Act.2006, failing
                  of which the NOC to be treated as cancelled.
                </li>
              </ol>
            </td>
          </tr>

          <tr className={styles.Bottom1}>
            <td>
              <strong>Chief Fire Officer</strong>
            </td>
          </tr>

          <tr className={styles.Bottom2}>
            <td>
              <strong>Pimpri Chinchwad Municipal Corporation</strong>
            </td>
          </tr>

          <tr className={styles.Bottom3}>
            <td>
              <strong>Pimpri-411018.</strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>Copy to,</strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>M/s. Vishal Chitra Mandir,</strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>Sr. No 206/1, Pimpri-Waghere, </strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>Pimpri, Pune-411018. </strong>
            </td>
          </tr>
          <tr className={styles.BBottom1}>
            <td>
              <strong>
                Fire NOC Fees Rs. 37,875/--40/- 37,835/- Rounded Amount Rs.
                37,900/- Paid Vide R.No.303321220021706, Dt.28/12/2021)
              </strong>
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

export default Index;
