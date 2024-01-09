import React, { useRef } from "react";
import styles from "./acknowledgement.module.css";
import { Button, Divider, Paper } from "@mui/material";
import {
  useGetToken,
  useLanguage,
  useUser,
} from "../../../../containers/reuseableComponents/CustomHooks";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useReactToPrint } from "react-to-print";
import { Home, Print } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Index = () => {
  const language = useLanguage();
  const userToken = useGetToken();

  const user = useUser();
  const nameOfLoggedInUser =
    language == "en"
      ? user.userDao?.firstNameEn +
        " " +
        user.userDao?.middleNameEn +
        " " +
        user.userDao?.lastNameEn
      : user.userDao?.firstNameMr +
        " " +
        user.userDao?.middleNameMr +
        " " +
        user.userDao?.lastNameMr;

  const componentRef = useRef(null);

  const applicationNumber = "tempNo";

  const serviceName = useSelector((state) =>
    // @ts-ignore
    state?.user?.user?.menus?.find(
      (menu) =>
        menu.id == Number(localStorage.getItem("selectedMenuFromDrawer"))
    )
  );

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // @ts-ignore
    documentTitle: "Acknowledgement Receipt (" + applicationNumber + ")",
  });

  return (
    <>
      <Paper className={styles.main}>
        <div className={styles.wrapper} ref={componentRef}>
          <div className={styles.header}>
            <img src={"/logo.png"} alt="Pcmc Logo" width={80} height={80} />
            <h2>
              <FormattedLabel id="pcmc" textCase="uppercase" bold />
            </h2>
            <img
              src={`/aazadiKaAmrutMahotsav.png`}
              width={120}
              height={65}
              alt="75amrutMahotsav"
            />
          </div>
          <div className={styles.subTitle}>
            <FormattedLabel id="acknowledgment" />
          </div>
          <div className={styles.content}>
            <span>
              <FormattedLabel id="dear" />
              <b>{nameOfLoggedInUser}</b>,
            </span>
            <br />
            <br />
            <span>
              <FormattedLabel id="thanksForUsingPCMCservice" />.
            </span>
            <br />
            <span>
              <FormattedLabel id="applicationSubmittedline1" />
              <b style={{ textDecoration: "underline" }}>
                {serviceName[language == "en" ? "menuNameEng" : "menuNameMr"]}
              </b>{" "}
            </span>
            <span>
              <FormattedLabel id="applicationSubmittedline2" />.
            </span>
          </div>
          <Divider className={styles.divider} />
          <label className={styles.heading}>
            <FormattedLabel id="applicationDetails" bold textCase="uppercase" />
          </label>

          <div className={styles.content}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td>
                    <FormattedLabel id="applicationNo" />
                  </td>
                  <td>:</td>
                  <td>
                    <b>PCMC00010</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedLabel id="applicationDate" />
                  </td>
                  <td>:</td>
                  <td>
                    <b>02/10/2023</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    <FormattedLabel id="applicantName" />
                  </td>
                  <td>:</td>
                  <td>
                    <b>Karan Sable</b>
                  </td>
                </tr>
                <tr>
                  <td>
                    Applicant Address
                    {/* <FormattedLabel id="applicantAddress" /> */}
                  </td>
                  <td>:</td>
                  <td>
                    <b>
                      C-109, Narmada Building, Mhada Society, Pimpri C-109,
                      Narmada Building, Mhada Society, Pimpri
                    </b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Divider className={styles.divider} />
          <div className={styles.content}>
            <div className={styles.footer}>
              <img src="/qrcode.png" alt="qrcode" width={85} />
              <FormattedLabel id="contactForQueries" />
              <img src="/barcode.png" alt="barcode" width={125} />
            </div>
          </div>
        </div>
        <div className={styles.bttnGrp}>
          <Button
            variant="contained"
            endIcon={<Print />}
            onClick={handleToPrint}
          >
            <FormattedLabel id="print" />
          </Button>
          <Button
            variant="contained"
            color="success"
            endIcon={<Home />}
            // onClick={handleToPrint}
          >
            Go to Dashboard
            {/* <FormattedLabel id="print" /> */}
          </Button>
        </div>
      </Paper>
    </>
  );
};

export default Index;
