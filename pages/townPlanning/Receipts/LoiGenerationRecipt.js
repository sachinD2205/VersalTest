import { Button, Grid, Stack } from "@mui/material";
import Link from "next/link";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "../../marriageRegistration/transactions/newMarriageRegistration/scrutiny/LoiGenerationRecipt.module.css";

// Loi Generation
const LoiGenerationRecipt = () => {
  const componentRef = useRef(null);

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

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
                <div className={styles.date}>
                  <h5>Receipt No :-</h5>
                  <h5>Receipt Date :-</h5>
                </div>
              </div>
              <div className={styles.middle}>
                <h3>Pimpri Chinchwad Municipal Corporation</h3>
                <h4> Mumbai-Pune Road,</h4>
                <h4>Pimpri - 411018,</h4>
                <h4> Maharashtra, INDIA</h4>
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>Letter of Intimation</h2>
            </div>

            {/* <div className={styles.right}>
                <div className={styles.leftt}>
                  <h4>Service Name</h4>
                  <h4>TP:Part Plan</h4>
                  <h5>Receipt No :-</h5>
                  <h5>Receipt Date :-</h5>
                </div>
                <div>
                  <h4>Address</h4>
                  <h5>
                    Zone No. :-A Pradhikaran, Nigadi,Pimpri Chinchwad,Pune
                  </h5>
                </div>
    </div>*/}

            <div className={styles.two}>
              <p>
                <b>
                  Dear Applicant,
                  <br></br> &ensp; you have for this services on citizen service
                  portal kindly ensure the amount and pay the amount/charges of
                  the applied service using below link.
                  <br />
                  <Link href="#">Link Data</Link> or by visiting pcmc nearest
                  zonal office.
                  <br></br>
                </b>
                {/* <p>
                  <b>
                    Order No.:- 001235 Shri.ABC ,Address:-Plot
                    No.000,Pradhikaran,Nigadi,Pimpri Chinchwad:411018.
                  </b>
                </p> */}
                {/* <div className={styles.order}>
                  Application Fees = 20.00<br></br> Certificate/Document/Map
                  Fees = 150.00 <br></br>
                  ----------------------------------------------------
                  <br></br> Total Amount = 170.00 <br></br>Amount in Words = One
                  Hundred and Seventy Rupees Only/--
                </div> */}
              </p>

              <div className={styles.enquiry}>
                <div>
                  <b>For Contact :- Mobile No:-9999999999</b>
                </div>
                <div>
                  <b>email:-enquiry@pcmcindia.gov.in</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
