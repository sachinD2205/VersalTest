import { Button } from "@mui/material";

import React, { useEffect, useState } from "react";
import router from "next/router";
import styles from "../goshwara.module.css";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../../../util/commonErrorUtil";


const Index = ({ applicantData, hutData, componentRef }) => {
  const backToHomeButton = () => {
    history.push({ pathname: "/homepage" });
  };
  const [dataa, setDataa] = useState(null);
  const [selectedObject, setSelectedObject] = useState();
  const [work, setWork] = useState();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };
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



  // view
  return (
    <>
      <div>
        <ComponentToPrintOfficialNotesheet
          applicantData={applicantData}
          hutData={hutData}
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
          size="small"
          color="error"
          variant="contained"
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
              `/SlumBillingManagementSystem/transactions/inssuranceOfPhotopass/addApplicantDetails`
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
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.two}>
              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6} style={{ marginTop: "6vh" }}>
                  <h4>
                    {" "}
                    <b>प्रपत्र – ब </b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date5}>
                <div className={styles.date6}>
                  <h4>
                    {" "}
                    <b>स्वयं - साक्षांकनासाठी स्वयंघोषणापत्र </b>
                  </h4>{" "}
                </div>
              </div>

              <div className={styles.date7}>
                <div className={styles.date8}>
                  <div
                    className={styles.add7}
                    style={{
                      marginRight: "80px",
                      paddingBottom: "6vh",
                      paddingTop: "6vh",
                      border: "1px solid black",
                    }}
                  >
                    <h4>अर्जदाराचा फोटो</h4>
                  </div>
                </div>
              </div>

              {/*********** LETTER BODY ****************/}

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "70px" }}>
                    मी{" "}
                    {`${this?.props?.applicantData?.applicantFirstName} ${this?.props?.applicantData?.applicantMiddleName} ${this?.props?.applicantData?.applicantLastName}`}
                    .. श्री.
                    {`${this?.props?.applicantData?.applicantMiddleName} ${this?.props?.applicantData?.applicantLastName}`}{" "}
                    यांचा मुलगा/मुलगी वय …………………………………………… वर्ष, आधार क्रमांक
                    (असल्यास){" "}
                    {`${this?.props?.applicantData?.applicantAadharNo}`} व्यवसाय
                    ………………………………………. राहणार ……………………………………….. याद्वारे घोषित
                    करतो/करते की, झोपडपट्टी पुनर्वसन योजनेत पात्रता तपासण्यासाठी
                    विहित पुराव्याच्या स्वयं साक्षांकित केलेल्या प्रती या मूळ
                    कागपत्रांच्याच सत्य प्रती आहेत. त्या खोट्या असल्याचे आढळून
                    आल्यास, भारतीय दंड संहिता अन्वये आणि/किंवा संबंधित
                    कायद्यानुसार माझ्यावर खटला भरला जाईल व त्यानुसार मी शिक्षेस
                    पात्र राहीन याची मला पूर्ण जाणीव आहे.
                  </p>{" "}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div className={styles.date4}>
                    <div className={styles.date2}>
                      <p style={{ marginLeft: "80px" }}> ठिकाण:-……………….</p>
                    </div>
                  </div>

                  <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                    <div className={styles.date2}>
                      <p style={{ marginLeft: "80px" }}> दिनांक:-……………… </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className={styles.date4}>
                    <div className={styles.date2}>
                      <p style={{ marginRight: "80px" }}>
                        {" "}
                        अर्जदाराची सही:-……………..
                      </p>
                    </div>
                  </div>

                  <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                    <div className={styles.date2}>
                      <p style={{ marginRight: "80px" }}>
                        {" "}
                        अर्जदाराचे नाव:-……………..{" "}
                      </p>
                    </div>
                  </div>
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
