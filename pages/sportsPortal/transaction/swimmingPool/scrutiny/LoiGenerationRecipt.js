import { Grid, Stack } from "@mui/material";
import { Button } from "antd";
import Link from "next/link";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./LoiGenerationRecipt.module.css";

// Loi Generation
// useEffect(() => {
//   console.log('router.query', router.query)
// }, [])
const LoiGenerationRecipt = () => {
  const componentRef = useRef(null);

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  // const router = useRouter()
  // View
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} />
      </div>
      <br />
      <Grid container>
        <Grid
          item
          xs={12}
          md={12}
          xl={12}
          sm={12}
          lg={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItem: "center",
          }}
        >
          <Stack direction="row">
            <Button
              variant="contained"
              sx={{ size: "23px" }}
              type="primary"
              onClick={handlePrint}
            >
              print
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

// class component To Print
class ComponentToPrint extends React.Component {
  render() {
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
                <h3>Pimpri Chinchwad Municipal Corporation</h3>
                <h4> Mumbai-Pune Road,</h4>
                <h4>Pimpri - 411018,</h4>
                <h4> Maharashtra, INDIA</h4>
              </div>
              <div className={styles.logo}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>Letter of Intimation</h2>
            </div>

            <div className={styles.two}>
              <p>
                <b>
                  Dear Applicant Name,
                  <br></br> &ensp; you have for this services on citizen service
                  portal kindly ensure the amount and pay the amount/charges of
                  the applied service using below link.
                  <br />
                  <Link href="#">Link Data</Link> or by visiting pcmc nearest
                  zonal office.
                  <br></br>
                </b>
              </p>

              <div className={styles.date}>
                <div>
                  <h4>Service Name:</h4>
                  <h4>Application No: </h4>
                  <h4>Name of the Applicant </h4>
                  <h4>Date of the Application </h4>
                  <h4>Address </h4>
                </div>
                {/* <div>
                  <h3> :{router?.query?.applicationNumber}</h3>
                  <h3> : {router.query.applicantName}</h3>
                  <h3> : {router.query.applicationDate}</h3>
                  <h3>
                    : {router.query.aflatBuildingNo}{' '}
                    {router.query.abuildingName}
                    <br></br>
                    {router.query.aroadName} {','}
                    {router.query.aLandmark} {','}
                    <br></br>
                    {router.query.aCityName} {','}
                    {router.query.aState}{' '}
                  </h3>
                </div> */}
              </div>
              {/* <div>
                <h2 className={styles.heading}>Help</h2>
              </div> */}
              <hr />

              <div className={styles.add}>
                <h5>पिंपरी चिंचवड महानगरपलिका </h5>
                <h5> मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</h5>
                <h5> महाराष्ट्र, भारत</h5>
              </div>

              <div className={styles.add1}>
                <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
