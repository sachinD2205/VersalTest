import CheckIcon from "@mui/icons-material/Check";
import { Button, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../termsNdCondition/view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
// import  commonStyles  from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css"
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";

const Index = () => {
  const router = useRouter();

  let serviceId = null;

  const userDetailsInRedux = useSelector((state) => {
    serviceId = state.user.applicationName?.id;
    return state.user;
  });

  return (
    <>
      <Paper
        sx={{
          marginLeft: 2,
          marginRight: 2,
          marginBottom: 5,
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
                marginTop: "25px",
                color: "yellow",
              }}
            >
              <b>
                <center>
                  <FormattedLabel id="bsupTermsndTitle" />
                </center>
              </b>
            </h1>
            <h3
              style={{
                color: "yellow",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <b>
                <center>
                  <FormattedLabel id="rtiAct2005" />
                </center>
              </b>
            </h3>
          </div>

          <h3
            style={{
              marginTop: "25px",
              color: "red",
            }}
          >
            <b>
              <center>
                <FormattedLabel id="guidelineOfBsup" />
              </center>
            </b>
          </h3>

          <div
            style={{
              marginLeft: "70px",
              marginTop: "25px",
              marginRight: "25px",
            }}
          >
            <h4>
              <FormattedLabel id="guideline1" />
            </h4>

            <h4
              style={{
                marginTop: "10px",
                marginRight: "25px",
              }}
            >
              <FormattedLabel id="guideline2" />
            </h4>

            <h4
              style={{
                marginTop: "10px",
                marginRight: "25px",
              }}
            >
              <FormattedLabel id="guideline3" />
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              <FormattedLabel id="guideline4" />
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              <FormattedLabel id="guideline5" />
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              <FormattedLabel id="guideline6" />
            </h4>
            <h4
              style={{
                marginTop: "10px",
              }}
            >
              <FormattedLabel id="guideline7" />
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              <FormattedLabel id="guideline8" />
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              <FormattedLabel id="guideline9" />
            </h4>

            <h4
              style={{
                marginTop: "10px",
              }}
            >
              <FormattedLabel id="guideline10" />
            </h4>
            {/* 
            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline11" />
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline12" />
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline13" />
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline14" />
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline15" />
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline16" />
            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline17" />

            </h4>
            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline18" />

            </h4>


            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline19" />

            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline20" />

            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline21" />

            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline22" />

            </h4>

            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline23" />

            </h4>
            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline24" />

            </h4>
            <h4
              style={{
                marginTop: '10px',
              }}
            >
              <FormattedLabel id="guideline25" />

            </h4> */}
          </div>

          <div className={styles.AcceptBtn} style={{ marginLeft: "5vh" }}>
            {serviceId == 108 && (
              <Button
                variant="contained"
                color="success"
                className={commonStyles.tNcButton}
                endIcon={<CheckIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/BsupNagarvasthi/transaction/newApplicationScheme`,
                  });
                }}
              >
                <FormattedLabel id="Tnc" />
              </Button>
            )}

            {serviceId == 100 && (
              <Button
                variant="contained"
                color="success"
                className={commonStyles.tNcButton}
                endIcon={<CheckIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/BsupNagarvasthi/transaction/bachatgatRegistration/form`,
                  });
                }}
              >
                <FormattedLabel id="Tnc" />
              </Button>
            )}

            {serviceId == 106 && (
              <Button
                variant="contained"
                color="success"
                // className={commonStyles.tNcButton}
                endIcon={<CheckIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/BsupNagarvasthi/transaction/bachatgatRenewal`,
                  });
                }}
              >
                <FormattedLabel id="Tnc" />
              </Button>
            )}

            {serviceId == 107 && (
              <Button
                variant="contained"
                color="success"
                className={commonStyles.tNcButton}
                endIcon={<CheckIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/BsupNagarvasthi/transaction/bachatgatModification`,
                  });
                }}
              >
                <FormattedLabel id="Tnc" />
              </Button>
            )}

            {serviceId == 109 && (
              <Button
                variant="contained"
                color="success"
                // className={commonStyles.tNcButton}
                endIcon={<CheckIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/BsupNagarvasthi/transaction/schemeApplicationRenewal`,
                  });
                }}
              >
                <FormattedLabel id="Tnc" />
              </Button>
            )}

            {serviceId == 105 && (
              <Button
                variant="contained"
                color="success"
                className={commonStyles.tNcButton}
                endIcon={<CheckIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/BsupNagarvasthi/transaction/bachatGatCancellation`,
                  });
                }}
              >
                <FormattedLabel id="Tnc" />
              </Button>
            )}

            <div style={{ marginLeft: "2vh" }}>
              <Button
                variant="contained"
                color="error"
                className={commonStyles.buttonExit}
                endIcon={<ClearIcon />}
                onClick={() => {
                  router.push({
                    pathname: `/dashboard`,
                  });
                }}
              >
                <FormattedLabel id="exitTNC" />
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.row}></div>
      </Paper>
    </>
  );
};

export default Index;
