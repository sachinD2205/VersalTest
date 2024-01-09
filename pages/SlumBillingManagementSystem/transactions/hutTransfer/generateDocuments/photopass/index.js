import { Button } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import router from "next/router";
import styles from "../goshwara.module.css";
import axios from "axios";
import urls from "../../../../../../URLS/urls";
import swal from "sweetalert";
import moment from "moment";
import { ToWords } from "to-words";

// pages/marriageRegistration/transactions/boardRegistrations/scrutiny/ServiceChargeRecipt/index.js
// import urls from '../../../../../../URLS/urls'

const Index = ({
  connectionData,
  usageType,
  ownership,
  slumName,
  villageName,
  componentRef,
}) => {
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
  const [selectedObject, setSelectedObject] = useState();
  const [work, setWork] = useState();

  //   let approvalData = useSelector((state) => state.user.setApprovalOfNews)
  let approvalId = router?.query?.id;
  useEffect(() => {
    // getWard();
    // getAllTableData();
    // getDepartment();
    // getRotationGroup();
    // getRotationSubGroup();
    // getNewsPaper();
    // getDate();
  });
  console.log("connectionData", ownership);

  // view
  return (
    <>
      <div>
        <ComponentToPrintOfficialNotesheet
          connectionData={connectionData}
          slumName={slumName}
          usageType={usageType}
          ownership={ownership}
          villageName={villageName}
          ref={componentRef}
        />
      </div>
      <br />

      <div className={styles.btn}>
        {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                    onClick={handlePrint}
                >
                    print
                </Button> */}

        {/* <Button
                    variant="contained"
                    sx={{ size: '23px' }}
                    type="primary"
                >
                    Digital Signature
                </Button> */}

        <Button
          type="primary"
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            // swal(
            //     'Exit!',
            //     'जारी केलेल्या प्रमाणपत्र प्रत घेण्यास झोन ऑफिस ला भेट दया',
            //     'success',
            // )
            // const record = selectedObject;

            // router.push({
            //   pathname: '/nrms/transaction/newsAdvertisementRotation/view',
            //   query: {
            //     pageMode: "View",
            //     ...record,

            //   },
            // });

            router.push(
              `/ElectricBillingPayment/transaction/billGenerationAndPayment/billGeneration`
            );
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};

class ComponentToPrintOfficialNotesheet extends React.Component {
  render() {
    const toWords = new ToWords({ localeCode: "mr-IN" });
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

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
              <div
                className={styles.middle}
                styles={{ paddingTop: "15vh", marginTop: "20vh" }}
              >
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                <div className={styles.add8}>
                  <div className={styles.add}>
                    <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका </b>
                    </h5>
                    <h5>
                      {" "}
                      <b>मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</b>
                    </h5>
                    <h5>
                      <b> महाराष्ट्र, भारत</b>
                    </h5>
                  </div>

                  <div className={styles.add1}>
                    <h5>
                      <b>फोन क्रमांक:91-020-2742-5511/12/13/14</b>
                    </h5>
                    <h5>
                      <b> इमेल: egov@pcmcindia.gov.in</b>
                    </h5>
                    <h5>
                      <b>/ sarathi@pcmcindia.gov.in</b>
                    </h5>
                  </div>
                </div>
              </div>
              <div className={styles.logo1}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                {/* <b>पावती</b> */}
                <h5>
                  {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6} style={{ marginTop: "4vh" }}>
                  <h4>
                    {" "}
                    <b>झोपडीधारकाचे ओळखपत्र </b>
                  </h4>{" "}
                </div>
              </div>

              {/*********** LETTER BODY ****************/}

              <div
                className={styles.date4}
                style={{ marginBottom: "2vh", marginTop: "2vh" }}
              >
                <div>
                  <p style={{ marginLeft: "10px", marginRight: "10px" }}>
                    {console.log("aaa,,,,,,,,,,,", this.props)}
                    १. झोपडीधारक कुटुंब प्रमुख पती/पत्नीचे संपूर्ण नाव: {`  `}
                    {`${this?.props?.connectionData?.applicantFirstNameMr} ${this?.props?.connectionData?.applicantMiddleNameMr} ${this?.props?.connectionData?.applicantLastNameMr}`}
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                    २. झोपडीतील एकूण व्यक्तींची संख्या: {`  `}{" "}
                    {`${this?.props?.connectionData?.totalFamilyMembers}`}
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                    ३. झोपडपट्टीचे नाव व पत्ता: {`  `}{" "}
                    {`${this?.props?.slumName ? this?.props?.slumName : "-"},${
                      this?.props?.villageName ? this?.props?.villageName : "-"
                    }`}
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                    ४. झोपडीचा वापर-निवासी /बिगर निवासी /मिश्र: {`  `}{" "}
                    {`${this?.props?.usageType}`}
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                    ५. झोपडीचे क्षेत्रफळ-निवासी: {`  `}{" "}
                    {`${this?.props?.connectionData?.areaOfHut}`}चौरस फूट/ बिगर
                    निवासी--------------- चौरस फूट
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "10px" }}>
                    ६. विधानसभा मतदार संघाचे नाव ----------------------- यादीतील
                    भाग क्र.----------------------- अनु.
                    क्र.--------------------------- वॉर्ड क्र.
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    ७. जमिनीची मालकी: {`  `} {`${this?.props?.ownership}`}{" "}
                    खासगी. सरकारी. निमसरकारी
                  </p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "6vh",
                }}
              >
                <div className={styles.date4}>
                  <div className={styles.date2}>
                    <p style={{ marginLeft: "80px" }}>
                      {" "}
                      पर्यवेक्षकाची स्वाक्षरी{" "}
                    </p>
                  </div>
                </div>

                <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                  <div className={styles.date2}>
                    <p style={{ marginRight: "80px" }}>
                      {" "}
                      क्षेत्रीय अधिकाऱ्याची सही{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    <u>अटी व शर्ती </u>{" "}
                  </p>
                </div>
              </div>

              <div
                className={styles.date4}
                style={{ marginBottom: "2vh", marginTop: "2vh" }}
              >
                <div>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    १. सदरहू झोपडीच्या जागेवर झोपडीधारकाचा कोणताही मालकी हक्क
                    राहणार नाही.
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    २. ताब्यात घेतलेली भूभाग/ झोपडी कोणासही भाड्याने अगर
                    पोटभाड्याने दिली जाऊ नये.
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    ३. भू -भागधारकाने / झोपडीच्या मालकाने वरील अटींचा भंग
                    केल्यास किंवा कोणत्याही प्रकारे गैरवापर केल्यास सादर
                    भू-भागधारक/ झोपडीमालक बाहेर काढून टाकण्यास पात्र ठरेल आणि
                    सदर भू-भाग /झोपडी मोडून टाकणेची तजवीज केली जाईल /करावी
                    लागेल.
                  </p>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    ४. आपल्याला देण्यात आलेल्या मागणी बिलाप्रमाणे रक्कम रोख भरणा
                    करावी.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
