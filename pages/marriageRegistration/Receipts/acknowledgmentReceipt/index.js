import { Button, Card } from "@mui/material";
import router from "next/router";
import React, { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "../acknowledgmentReceipt/view.module.css";

const Index = () => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  useEffect(() => {
    console.log("router.query", router.query);
  }, []);
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} />
      </div>
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
      <div className={styles.mainn}>
        <div className={styles.main}>
          <div className={styles.smain}>
            <div className={styles.logo}>
              <img src="/logo.png" alt="" height="100vh" width="100vw" />
            </div>
            <div>
              <h1>Pimpri Chinchwad Municipal Corporation</h1>
              <h3> Mumbai-Pune Road,</h3>
              <h3>Pimpri - 411018,</h3>
              <h3> Maharashtra, INDIA</h3>
            </div>
          </div>
          <div>
            <h2 className={styles.heading}>Application Acknowledgment</h2>
          </div>
          <div>
            <Card>
              <div className={styles.info}>
                <h3>Dear, {router?.query?.applicantName}</h3>
                <h3>
                  Thank you for using PCMC Pimpri Chinchwad Citizen Service
                  Portal
                </h3>
                <h3>
                  Your application for Marriage Certificate under PCMC of pune
                  has been successfully submitted.
                </h3>
              </div>
            </Card>

            <div>
              <h2 className={styles.heading}>Application Summary</h2>
            </div>
            <Card>
              {/* <h2 className={styles.summary}>Application Summary</h2> */}
              <div className={styles.summ}>
                <div>
                  <h3>Application No: </h3>
                  <h3>Name of the Applicant </h3>
                  <h3>Date of the Application </h3>
                  <h3>Address </h3>
                </div>
                <div>
                  <h3> :{router?.query?.applicationNumber}</h3>
                  <h3> : {router.query.applicantName}</h3>
                  <h3> : {router.query.applicationDate}</h3>
                  <h3>
                    : {router.query.aflatBuildingNo}{" "}
                    {router.query.abuildingName}
                    <br></br>
                    {router.query.aroadName} {","}
                    {router.query.aLandmark} {","}
                    <br></br>
                    {router.query.aCityName} {","}
                    {router.query.aState}{" "}
                  </h3>
                </div>
              </div>
            </Card>
            <div className={styles.query}>
              <h4>
                For any query please contact your nearest operator or the
                following contact details:
              </h4>
            </div>

            <div className={styles.add}>
              <h5>Block Development Officer,</h5>
              <h5> Corporation : Pimpari-Chichwad,</h5>
              <h5> Sub-Division : Pimpari-Chichwad,</h5>
              <h5>District : Pune, India</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
