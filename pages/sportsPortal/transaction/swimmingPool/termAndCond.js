import CheckIcon from "@mui/icons-material/Check";
import { Button, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import styles from "../../../../styles/sportsPortalStyles/terms.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import ClearIcon from "@mui/icons-material/Clear";
const Index = () => {
  const language = useSelector((state) => state.labels.language);
  const router = useRouter();

  return (
    <>
      <div>
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
          <div className={styles.new}>
            <div className={styles.mainHeading}>
              <h1
                style={{
                  color: "yellow",
                }}
              >
                <b>
                  {language === "en"
                    ? "Pimpri Chinchwad Municipal Corporation"
                    : " पिंपरी  चिंचवड  महानगरपलिका"}
                </b>
              </h1>
            </div>
            <div className={styles.mainTitle}>
              <h3
                style={{
                  color: "red",
                }}
              >
                <b>
                  {" "}
                  {language === "en"
                    ? "Swimming Pool Daily Booking"
                    : "जलतरण तलाव दैनिक बुकिंग"}
                </b>
              </h3>
            </div>
            {/* term */}

            <div
              style={{
                marginLeft: "70px",
                marginTop: "25px",
                marginRight: "25px",
              }}
            >
              <h4>
                {/* १){" "} */}
                {language === "en" ? "1)" : "१)"}

                {language === "en"
                  ? "The booking for Badminton and lawn Tennis will available between 05 am to 09.00 pm"
                  : "बॅडमिंटन आणि लॉन टेनिसचे बुकिंग पहाटे 05 ते रात्री 09.00 च्या दरम्यान उपलब्ध असेल  "}
              </h4>

              <h4
                style={{
                  marginTop: "10px",
                  marginRight: "25px",
                }}
              >
                {/* 2) */}
                {language === "en" ? "2)" : "२)"}

                {language === "en"
                  ? "Email Id and Mobile No. is mandatory to mention on booking form "
                  : "बुकिंग फॉर्मवर ईमेल आयडी आणि मोबाईल क्रमांक नमूद करणे अनिवार्य आहे"}
              </h4>

              <h4
                style={{
                  marginTop: "10px",
                  marginRight: "25px",
                }}
              >
                {/* 3){" "} */}
                {language === "en" ? "3)" : "३)"}

                {language === "en"
                  ? "Payment for booking is possible only by net banking / Credit Card Debit Card"
                  : "बुकिंगसाठी पेमेंट फक्त नेट बँकिंग / क्रेडिट कार्ड डेबिटद्वारे शक्य आहे कार्ड"}
              </h4>

              <h4
                style={{
                  marginTop: "10px",
                }}
              >
                {/* 4){" "} */}
                {language === "en" ? "4)" : "४)"}

                {language === "en"
                  ? "One person can book only for one single time slot of play, it is mandatory to mention name of all group players. In group of two, those who book the slot. Merit only allowed two players. "
                  : "एक व्यक्ती फक्त एकाच वेळेच्या खेळासाठी बुक करू शकते, हे अनिवार्य आहे सर्व गटातील खेळाडूंची नावे सांगणे. दोनच्या गटात, जे बुक करतात स्लॉट मेरिटने फक्त दोन खेळाडूंना परवानगी दिली."}
              </h4>

              <h4
                style={{
                  marginTop: "10px",
                }}
              >
                {/* 5){" "} */}
                {language === "en" ? "5)" : "५)"}

                {language === "en"
                  ? "The Names mention on booking form can only play on grounds."
                  : "बुकिंग फॉर्मवर नमूद केलेली नावे केवळ मैदानावर खेळू शकतात."}
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
                endIcon={<CheckIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/sportsPortal/transaction/swimmingPool`,
                    query: {
                      pageMode: "Add",
                    },
                  });
                }}
              >
                <FormattedLabel id="Tnc" />
              </Button>
              <div style={{ marginLeft: "5vh" }}>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<ClearIcon />}
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
          </div>
          <div className={styles.row}></div>
        </Paper>
      </div>
    </>
  );
};

export default Index;
