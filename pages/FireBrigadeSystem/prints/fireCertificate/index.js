import React, { useEffect, useRef, useState } from "react";
import styles from "./view.module.css";
import router, { useRouter } from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button, Card, Grid, Paper } from "@mui/material";
import urls from "../../../../URLS/urls";
import axios from "axios";
import moment from "moment";
import { Table } from "antd";
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
      <Paper
        style={{
          border: "4",
        }}
      >
        {/* main Grid container */}
        <Grid
          style={{
            marginLeft: "40px",
            marginRight: "40px",
            marginTop: "40px",
          }}
        >
          <Grid container>
            <Grid item xl={0.5} lg={0.5}></Grid>
            <Grid item xl={2}>
              <img src="/logo.png" alt="" height={80} width={80} />
            </Grid>

            <Grid item xl={0.5} lg={0.5}></Grid>
            <Grid item xl={6.5}>
              <Grid container>
                <Grid item>
                  <h3>पिंपरी चिंचवड महानगरपालिका</h3>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item>
                  <h3>अग्निशमन विभाग</h3>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item>
                  <h3>PIMPRI CHINCHWAD MUNICIPAL CORPORATION</h3>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item>
                  <h3>Fire Department</h3>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xl={0.5} lg={0.5}></Grid>
            <Grid item xl={2}>
              <img src="/rts_servicelogo.png" alt="" height={90} width={90} />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xl={0.5} lg={0.5}></Grid>
            <Grid item xl={2}>
              <h3>
                File No:- <span></span>
              </h3>
            </Grid>
            <Grid item xl={0.5} lg={0.5}></Grid>
            <Grid item xl={6}>
              <h3>O.W.No:- Fire/01/5RC-500/ES/850/2022</h3>
            </Grid>
            <Grid item xl={0.5} lg={0.5}></Grid>
            <Grid item xl={1.5}>
              <h3>Date:-21/01/2022</h3>
            </Grid>
          </Grid>

          <Grid Container>
            <Grid item>
              <h1>
                ................................................................................................................................................
              </h1>
            </Grid>
          </Grid>

          <Grid
            Container
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2>
              <u>FIRE SAFETY CERTIFICATE</u>
            </h2>
          </Grid>

          <Grid
            Container
            style={{
              padding: 20,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <Grid item xs={2}>
              <h3>Token No:-103322230010950</h3>
            </Grid>
            <Grid item xl={0.5} lg={0.5}>
              <h3>Token Dt:- 27/06/2022</h3>
            </Grid>
          </Grid>
        </Grid>

        <Grid Container>
          <Grid item>
            Kendriya Vidyalaya, CME, Dapodi, Pune-411031 had applied for Fire
            Safety Certificate. The Fire Officer has visited the school
            inspected the Fire Protection System installed at site and as per
            his technical remarks this NOC is being issued subject to compliance
            of following conditions
          </Grid>
          <Grid item>
            1)The entire fire protection system installed at the site should be
            maintained in excellent working condition for the any fire
            emergency.
          </Grid>
          <Grid item>
            2) The fire extinguishers handling and operational training to be
            imparted to the teaching/ non-teaching/security staff of the school.
          </Grid>
          <Grid item>
            3) You will carry out testing, maintenance and refilling of all fire
            extinguishers/fire protection systems from competent person (Govt.
            Fire Licensed Agency) and necessary Form-'B' Certificate regarding
            the maintenance and operational condition of the Fire Fighting
            system to be submitted to the Fire Office as per the Sec.3 (3) of
            the Fire Act.2016, for every six months in month of January to July,
            failing of which this NOC shall be treated as cancelled.
          </Grid>
          <Grid item>
            4)You will keep all the Static Water Tanks full for any fire
            emergency.
          </Grid>
          <Grid item>
            5)Fire/Emergency Evacuation Mock Drill should be carried out in the
            school once in every six months.
          </Grid>
          <Grid item>
            6)You will keep all passages and corridors free from any
            obstructions and combustible material.
          </Grid>
          <Grid item>
            7)"No Smoking Boards" "Emergency Exit" "Assembly Area" and
            "Emergency Contact Numbers Boards" of Fire, Ambulance, Police, MSEB,
            shall be always displayed in School to avoid/minimize fire/emergency
            situation/risk.
          </Grid>
          <Grid item>
            8) You have to keep fire protection system (fire extinguishers)
            easily accessible and visible as well as healthy and good working
            condition.
          </Grid>
          <Grid item>
            9) You have to install a Safety Net in the Staircase duct and school
            building construction site in the safety point of view.
          </Grid>
          <Grid item>
            10) This NOC is issued only from the fire safety point of view. It
            cannot be treated for any other purposes. However necessary
            permission from the statutory authorities should be obtained
          </Grid>
          <Grid item>
            11) You are not permitted to construct the school building's
            remaining floors in the school working hours.
          </Grid>
          <Grid item>
            12) LPG cylinder placed inside the chemistry lab near the flammable
            chemicals should be kept at a safe place outside the chemistry lab.
            Inspection of the LPG connection should be carried out through the
            concern authority and inspection certificate should be submitted
            next time while coming for the Fire Safety Certificate
          </Grid>
          <Grid item>
            13) Electrical cable duct/conduit should be provided for all the
            electrical cables which are hanging inside the passage area.
          </Grid>
          <Grid item>
            14) Regarding the safe working of all the electrical equipment in
            this educational building, Electrical Audit by the Hon. Electrical
            Inspector, Yerwada, Pune should be done before next renewal of Fire
            Safety Certificate.
          </Grid>
          <Grid item>
            15) All the repair work should be done as per the Structural Safety
            Audit before coming next time for the Fire Safety Certificate.
          </Grid>
          <Grid item>
            16) PCMC Fire Department has noticed that, You did not obtain
            Provisional Fire NOC and Final Fire NOC for the school building.
            Hence, Provisional Fire NOC and Final Fire NOC for the school
            building should be obtained before coming next time for the Fire
            Safety Certificate.
          </Grid>
          <Grid item>
            17) All the rules, regulations declared time to time from the PCMC
            or Govt. of Maharashtra shall be binding on you and any violation of
            these shall be viewed seriously.
          </Grid>
          <Grid item>
            18) This School Operational (Utility) Fire NOC is issued for only
            Gr+01 Floor, The terms and condition must be strictly fullfilled
            mentioned in fire NOC.
          </Grid>
          <Grid item>
            19)This Fire NOC is valid up to Dt. 31 March 2023 only and renewal
            of these NOC should be done every year before above mentioned date.
          </Grid>
          <Grid item>Chief Fire Officer</Grid>
          <Grid item>Pimpri Chinchwad Municipal Corporation</Grid>
          <Grid item>पिंपरी-१८</Grid>
          <Grid item>
            प्रति M/s. Express Petro Services, सर्वे नं. ३५/२, ३४(पी). दापोडी,
            पुणे. (अनि सेवा शुक्ल र.रु. ३००/- .पा. क्र. ३०३३२१२२००२०२६८ दि.
            १३/१२/२०२१. स्वीकारलेत आणि शिल्लक शुल्क र.रु. १२०००/- येणे बाकी
            आहेत)
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default Index;
