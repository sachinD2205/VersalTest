//http://localhost:4000/marriageRegistration/transactions/newMarriageRegistration/components/termAndCond
import { Button, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import styles from "../../../../../components/marriageRegistration/board.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
const Index = () => {
  const router = useRouter();

  return (
    <>
      {/* <BasicLayout> */}
      <Paper
        sx={{
          marginLeft: 2,
          marginRight: 2,

          marginBottom: 2,
          padding: 1,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <div className={styles.small}>
          <div
            style={{
              backgroundColor: "#3EADCF",
            }}
          >
            <h1
              style={{
                marginLeft: "350px",
                marginTop: "25px",
                color: "yellow",
              }}
            >
              <b>पिंपरी चिंचवड महानगरपलिका,पिंपरी-४११०१८</b>
            </h1>
            <h3
              style={{
                marginLeft: "500px",
                color: "yellow",
              }}
            >
              <b>(राजपत्र ,मे २०,१९९९)</b>
            </h3>
          </div>

          <h3
            style={{
              marginLeft: "30vw",
              marginTop: "25px",
              color: "red",
            }}
          >
            <b> विवाह मंडळ नोंदणी / नोंदणीचे नुतनीकरण करण्याची कार्यपद्धती </b>
          </h3>
          {/* term */}

          <div
            style={{
              marginLeft: "70px",
              marginTop: "25px",
              marginRight: "25px",
            }}
          >
            <h4>
              1) सदरचे प्रमाणपत्र मंडळाच्या कार्यालात दर्शनी भागावर प्रदर्शित
              करावे.
            </h4>

            <h4>
              2) सदर प्रमाणपत्र दिल्याच्या दिनांकापासून दोन वर्षाकरीता वैध
              राहील. प्रत्येक दोन वर्षांने त्याचे नुतनीकरण मुदत समाप्तीपूर्वी आठ
              दिवस अगोदर करावे लागेल. नोंदणीचे व नूतनीकरण <br />
              करण्याची फी र.रु.२०००/- (पहा अधिसूचना क्रमांक विनोंका.
              २००७/९३८/प्र.क्र.२३७/ कु.क .२, दि. १ नोव्हेंबर २००७) आकारले जाईल
              परंतु त्यावेळेस प्रत्यक्षात नियमानुसार जी फी देय आहे,
              <br />
              ती भरणे बंधनकारक राहील. तक्रार करता येणार नाही.
            </h4>

            <h4
              style={{
                marginTop: "10px",
                marginRight: "25px",
              }}
            >
              3)प्रमाणपत्रात नेमुन दिलेल्या ठिकाणावरच विवाह मंडळाने आपले कामकाज
              चालवावे.
            </h4>

            <h4
              style={{
                marginTop: "10px",
                marginRight: "25px",
              }}
            >
              4) या अधिनियमात / नियमात वेळोवेळी होणारे बदल / दुरुस्ती बंदनकारक
              राहतील.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              5) या कायदयातील कोणत्याही तरतुदीचा भंग केल्यास रु. ५०००/- दंड
              किंवा ६ महिने कारावास भोगावा लागेल किंवा दोन्ही शिक्षा एकाच वेळी
              भोगाव्या लागतील.
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              6) कोणतेही विवाह मंडळ, विवाह मंडळ म्हणून असलेले आपले काम पोट-कलम
              (२) खाली देण्यात आलेल्या प्रमाणपत्रामध्ये विनिर्दिष्ट करण्यात
              आलेले आपले नोंदणीकृत कार्यालय किंवा जागा या <br />
              अतिरिक्त अन्यत्र करणार नाही,
              <b>
                संबंधित विवाह मंडळाची नोंदणी फक्त त्या कार्यक्षेत्रापुरती
                असल्याने, कार्यक्षेत्राबाहेर त्यांना काम करता येणार नाही.
              </b>
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              7)मंडळाने वरीलपैकी कोणत्याही अटीचा भंग केल्यास विवाह मंडळाची
              नोंदणी रदद करण्यात येईल.
            </h4>
          </div>
          <div
            className={styles.AcceptBtn}
            style={{
              marginRight: "20px",
            }}
          >
            <Button
              variant="contained"
              color="success"
              // endIcon={<CheckIcon />}
              onClick={() => {
                router.push({
                  pathname: `/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration`,
                  query: {
                    pageMode: "Add",
                  },
                });
              }}
              // disabled={state}
            >
              <FormattedLabel id="Tnc" />
            </Button>
            <div style={{ marginLeft: "5vh" }}>
              <Button
                variant="contained"
                color="error"
                // endIcon={<ClearIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/dashboard`,
                    query: {
                      pageMode: "Add",
                    },
                  });
                }}
              >
                <FormattedLabel id="exit" />
              </Button>
            </div>
          </div>
          {/* <div
            className={styles.AcceptBtn}
            style={{
              marginRight: '20px',
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={
                () =>
                  router.push(
                    `/marriageRegistration/transactions/boardRegistrations/citizen/boardRegistration`,
                  )
                
              }
             
            >
              <FormattedLabel id="Tnc" />
            </Button>
          </div> */}
        </div>
        <div className={styles.row}></div>
      </Paper>
      {/* </BasicLayout> */}
    </>
  );
};

export default Index;
