import React, { useEffect, useRef, useState } from "react";
import styles from "./view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card, Grid } from "@mui/material";
import urls from "../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";

const Index = () => {
  const componentRef = useRef(null);
  const router = useRouter();
  const userToken = useGetToken();

  const [data, setData] = useState(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    console.log("router.query", router.query);
    if (router.query.id && router.query.serviceId) {
      axios
        .get(
          `${urls.FbsURL}/transaction/provisionalBuildingFireNOC/getById?appId=${router.query.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("r.data", r.data);
          setData(r.data);
        });
    }
  }, []);

  return (
    <>
      <div>
        <ComponentToPrint data={data} ref={componentRef} />
      </div>

      {/* Button for Print and Exit */}
      <div className={styles.btn}>
        <Button variant="contained" type="primary" onClick={handlePrint}>
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            router.push("/dashboard");
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
        <div className={styles.mainBox}>
          <div className={styles.reportContainer}>
            <div className={styles.header}>
              <div className={styles.one}>
                <img src="/logo.png" alt="" height={100} width={110} />
              </div>

              <div className={styles.second}>
                <div className={styles.pcm}>
                  <b>पिंपरी-चिंचवड महानगरपालिका</b>
                </div>
                <div className={styles.pcmMiddle}>
                  <b>अग्निशमन विभाग</b>
                </div>
                <div className={styles.pcmSecond}>
                  <h4>
                    <b>Pimpri Chinchwad Municipal Corporation</b>
                  </h4>
                </div>
              </div>
              <div className={styles.one}>
                <img
                  src="/rts_servicelogo.png"
                  alt=""
                  height={100}
                  width={110}
                />
              </div>
            </div>

            <div className={styles.footer}>
              <h2>Fire Department</h2>
            </div>

            <div className={styles.reportContent}>
              <div className={styles.sHeadingg}>
                <b>
                  File No:- <span></span>
                </b>

                <b>
                  O.W.No:- Fire/01/5PC/WS/<span></span>/2022
                </b>

                <b>
                  Date:- <span>18</span>
                  <span>/06</span>/2022
                </b>
              </div>
              <div className={styles.footer}>
                <b>
                  ................................................................................................................................................................................................................................................
                </b>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h2>
                  <u>FIRE SAFETY CERTIFICATE</u>
                </h2>
              </div>

              <div className={styles.sHeadingg}>
                <div>
                  <h3>Token No:-103322230010950</h3>
                </div>

                <div>
                  <h3>Token Dt:- 26/10/2022</h3>
                </div>
              </div>

              <p>
                Kendriya Vidyalaya, CME, Dapodi, Pune-411031 had applied for
                Fire Safety Certificate. The Fire Officer has visited the school
                inspected the Fire Protection System installed at site and as
                per his technical remarks this NOC is being issued subject to
                compliance of following conditions.
              </p>
              <ol>
                <li>
                  The entire fire protection system installed at the site should
                  be maintained in excellent working condition for the any fire
                  emergency. /{" "}
                </li>
                <li>
                  {" "}
                  The fire extinguishers handling and operational training to be
                  imparted to non-teaching/security staff of the school.
                </li>
                <li>
                  You will carry out testing, maintenance and refilling of all
                  fire extinguishers/fire protection systems from competent
                  person (Govt. Fire Licensed Agency) and necessary Form-'B'
                  Certificate regarding the maintenance and operational
                  condition of the Fire Fighting system to be submitted to the
                  Fire Office as per the Sec.3 (3) of the Fire Act.2016, for
                  every six months in month of January to July, failing of which
                  this NOC shall be treated as cancelled.{" "}
                </li>
                <li>
                  You will keep all the Static Water Tanks full for any fire
                  emergency.{" "}
                </li>
                <li>
                  Fire/Emergency Evacuation Mock Drill should be carried out in
                  the school once in every six months.{" "}
                </li>
                <li>
                  {" "}
                  You will keep all passages and corridors free from any
                  obstructions and combustible material.{" "}
                </li>
                <li>
                  {" "}
                  "No Smoking Boards" "Emergency Exit" "Assembly Area" and
                  "Emergency Contact Numbers Boards" of Fire, Ambulance, Police,
                  MSEB, shall be always displayed in School to avoid/minimize
                  fire/emergency situation/risk.{" "}
                </li>
                <li>
                  You have to keep fire protection system (fire extinguishers)
                  easily accessible and visible as well as healthy and good
                  working condition.
                </li>
                <li>
                  You have to install a Safety Net in the Staircase duct and
                  school building construction site in the safety point of view.{" "}
                </li>
                <li>
                  This NOC is issued only from the fire safety point of view. It
                  cannot be treated for any other purposes. However necessary
                  permission from the statutory authorities should be obtained.
                </li>
                <li>
                  You are not permitted to construct the school building's
                  remaining floors in the school working hours.{" "}
                </li>
                <li>
                  LPG cylinder placed inside the chemistry lab near the
                  flammable chemicals should be kept at a safe place outside the
                  chemistry lab. Inspection of the LPG connection should be
                  carried out through the concern authority and inspection
                  certificate should be submitted next time while coming for the
                  Fire Safety Certificate{" "}
                </li>
                <li>
                  Electrical cable duct/conduit should be provided for all the
                  electrical cables which are hanging inside the passage area.{" "}
                </li>
                <li>
                  Regarding the safe working of all the electrical equipment in
                  this educational building, Electrical Audit by the Hon.
                  Electrical Inspector, Yerwada, Pune should be done before next
                  renewal of Fire Safety Certificate.{" "}
                </li>
                <li>
                  All the repair work should be done as per the Structural
                  Safety Audit before coming next time for the Fire Safety
                  Certificate.{" "}
                </li>
                <li>
                  PCMC Fire Department has noticed that, You did not obtain
                  Provisional Fire NOC and Final Fire NOC for the school
                  building. Hence, Provisional Fire NOC and Final Fire NOC for
                  the school building should be obtained before coming next time
                  for the Fire Safety Certificate.{" "}
                </li>
                <li>
                  All the rules, regulations declared time to time from the PCMC
                  or Govt. of Maharashtra shall be binding on you and any
                  violation of these shall be viewed seriously.{" "}
                </li>
                <li>
                  This School Operational (Utility) Fire NOC is issued for only
                  Gr+01 Floor, The terms and condition must be strictly
                  fulfilled mentioned in fire NOC.{" "}
                </li>
                <li>
                  {" "}
                  This Fire NOC is valid up to Dt. 31 March 2023 only and
                  renewal of these NOC should be done every year before above
                  mentioned date.
                </li>
              </ol>
              <div>
                <div className={styles.mFooter}>
                  <div>
                    {" "}
                    <div className={styles.footer}>
                      <b>Chief Fire Officer </b>
                    </div>
                    <div className={styles.footer}>
                      <b>Pimpri Chinchwad Municipal Corporation Pimpri-18 </b>{" "}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className={styles.lFooter}>
                  <div>
                    {" "}
                    <div>
                      <b> To, </b>
                    </div>
                    <div>
                      <b> The Principal, </b>{" "}
                    </div>
                    <div className={styles.footer}>
                      <b>Kendriya Vidyalaya, CME, Dapodi, Pune-411031</b>{" "}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.footer}>
                <p>
                  <b>
                    (This is Central Govt. School Bldg. Therefore, Fire NOC Fees
                    payment Exempted.)
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
