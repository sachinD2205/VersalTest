import React, { useEffect, useRef, useState } from "react";
import styles from "./bachatgatRegistrationCertificate.module.css";
import router from "next/router";
import { useReactToPrint } from "react-to-print";
import { Button } from "@mui/material";
import urls from "../../../URLS/urls";
import axios from "axios";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import Loader from "../../../containers/Layout/components/Loader";
import  commonStyles  from "../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css"
import CommonLoader from "../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";


const Index = () => {
  const [registrationDetails, setRegistrationDetails] = useState([]);
  const loggedUser = localStorage.getItem("loggedInUser");
  const user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state.labels.language);
  const componentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };

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

  useEffect(() => {
    if (router.query.id != undefined && router.query.id != null) {
      fetchRegistrationDetails();
    }
  }, [router.query.id]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:
      language === "en"
        ? "Bachatgat Registration Certificate"
        : "बचतगट नोंदणी प्रमाणपत्र",
  });

  // call api by id
  const fetchRegistrationDetails = () => {
    setIsLoading(true);
    axios
      .get(
        `${urls.BSUPURL}/trnBachatgatRegistration/getById?id=${router.query.id}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        if (r.data.status === 10) {
          setRegistrationDetails(r.data);
        } else {
          swal(
            language === "en"
              ? "Requested Bachat Gat Registration is NOT completed yet.."
              : "विनंती बचत गट नोंदणी अद्याप पूर्ण झालेली नाही..",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
          cfcErrorCatchMethod(err, false);
        
      });
  };

  const catchMethod = (err) => {
    console.log("err ", err);
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  return (
    <>
    {isLoading && <CommonLoader/>}
      <div className={styles.container}>
        <ComponentToPrint
          data={registrationDetails}
          logedInUser={loggedUser}
          user={user}
          ref={componentRef}
        />
      </div>
      <div className={styles.btn}>
      <Button
          type="primary"
          size="small"
          // className={commonStyles.buttonExit}
          color="error"
          variant="contained"
          onClick={() => {
            if (loggedUser === "citizenUser") {
              router.push("/dashboard");
            } else {
              router.push("/BsupNagarvasthi/transaction/bachatgatRegistration");
            }
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
        <Button
          variant="contained"
          // className={commonStyles.buttonPrint}
          size="small"
          type="primary"
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>
        
      </div>
    </>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    return (
   
        <div style={{padding:'10% 10% 10% 10%'}}>
          <div className={styles.header_container}>
            <img className={styles.logo} src="/logo.png" alt="Logo" />

            <div className={styles.header_name}>
              <h2 className={styles.right_aligned}>
                पिंपरी चिंचवड महानगरपालिका,{" "}
              </h2>
              <h3 className={styles.right_aligned}>
                समाज विकास विभाग, महीला व बाल कल्याणयोजना
              </h3>
              <h3 className={styles.right_aligned}>
                क्र. सविवि/10/कवि/304/2023
              </h3>
              <p className={styles.right_aligned}>पिंपरी – 411018</p>
            </div>
          </div>

          <div className={styles.content}>
            <h1 className={styles.certificate_header}>बचतगट प्रमाणपत्र</h1>
            <p className={styles.para_text}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              प्रमाणपत्र देण्यात येते की {this.props?.data?.bachatgatName} पत्ता
              :-
              {this.props?.data?.flatBuldingNo} {","}
              {this.props?.data?.buildingName} {","}
              {this.props?.data?.roadName} {","} {this.props?.data?.landmark}{" "}
              {"."}
              यांची नोंदणी पिंपरी चिंचवड महानगरपालिकेच्या समाज विकास विभागात
              करण्यात आली असुन त्यांचा नोंदणी क्रमांक{" "}
              {this.props?.data?.bachatgatNo} दिनांक{" "}
              {this.props?.data?.registrationCompleteDate != null &&
              this.props?.data?.registrationCompleteDate != undefined
                ? format(
                    new Date(
                      this.props?.data?.registrationCompleteDate.split(".")[0]
                    ),
                    "dd/MM/yyyy"
                  )
                : "---"}{" "}
              असा आहे. सदर नोंदणी महानगरपालिकेच्या कार्यालयीन कामकाजासाठी
              करण्यात आली असुन त्याचा उपयोग / वापर अन्य कोणत्याही कारणासाठी करणे
              अनुज्ञेय नाही. आपला अर्ज क्रमांक {this.props?.data?.applicationNo}{" "}
              व अर्ज दिनांक{" "}
              {this.props?.data?.createDtTm != null &&
              this.props?.data?.createDtTm != undefined
                ? format(
                    new Date(this.props?.data?.createDtTm.split(".")[0]),
                    "dd/MM/yyyy"
                  )
                : "---"}{" "}
              या नुसार सदर बचत गटाचे लेखी / आँनलाईन अर्जाद्वारे मागणी केले नुसार
              त्यांना सदरचे प्रमाणपत्र देण्यात येत आहे.
            </p>
          </div>
          <div className={styles.footer}>
            <p className={styles.right_aligned}>
              प्रशासन अधिकारी
              <br />
              समाज विकास विभाग
              <br />
              पिंपरी चिंचवड महानगरपालिका
              <br />
              पिंपरी – 411018
            </p>
          </div>
        </div>
  
    );
  }
}

export default Index;
