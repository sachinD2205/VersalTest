import { Button, Grid } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "./LoiGenerationRecipt.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";
import { useSelector } from "react-redux";

const BoardRejectionNote = () => {
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };
  const {
    control,
    register,
    getValues,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const getApplicationData = (data) => {
    console.log("1234", router?.query?.applicationId);

    if (router?.query?.applicationId) {
      if (router?.query?.serviceId == 67) {
        axios
          .get(
            `${
              urls.MR
            }/transaction/marriageBoardRegistration/getapplicantById?applicationId=${Number(
              router?.query?.applicationId,
            )}`,
          )
          .then((res) => {
            setdata(res.data);
            console.log("loi recept data", res.data);
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else if (router?.query?.serviceId == 15) {
        axios
          .get(
            `${urls.MR}/transaction/modOfMarCertificate/getapplicantById?applicationId=${router?.query?.applicationId}`,
          )
          .then((res) => {
            setdata(res.data);
            console.log("loi recept data", res.data);
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      } else if (router?.query?.serviceId == 14) {
        axios
          .get(
            `${urls.MR}/transaction/renewalOfMarraigeBoardCertificate/getapplicantById?applicationId=${router?.query?.applicationId}`,
          )
          .then((res) => {
            setdata(res.data);
            console.log("loi recept data", res.data);
          })
          .catch((error) => {
            callCatchMethod(error, language);
          });
      }
    }
  };

  const [data, setdata] = useState();
  useEffect(() => {
    console.log("useeffect");
    getApplicationData();
  }, []);
  let loggedInUser = localStorage.getItem("loggedInUser");
  const language = useSelector((state) => state?.labels.language);
  const componentRef = useRef(null);
  const router = useRouter();
  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  useEffect(() => {
    // console.log("router?.query",user);
    reset(router?.query);
  }, []);
  // const router = useRouter()
  // View
  return (
    <>
      <div>
        <ComponentToPrint ref={componentRef} data={data} />
      </div>
      <br />

      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          print
        </Button>

        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            const textAlert =
              language == "en"
                ? "Are you sure you want to exit this Record ? "
                : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता?";
            const title = language == "en" ? "Exit ! " : "बाहेर पडा!";
            swal({
              title: title,
              text: textAlert,
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              console.log("ersdfdsf", willDelete, loggedInUser);
              if (willDelete) {
                language == "en"
                  ? sweetAlert({
                      title: "Exit!",
                      text: "Record is Successfully Exit!!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "बाहेर पडा!",
                      text: "रेकॉर्ड यशस्वीरित्या बाहेर पडा!",
                      icon: "success",
                      button: "Ok",
                    });
                if (loggedInUser == "citizenUser") {
                  router.push("/dashboard");
                } else {
                  router.push(
                    "/marriageRegistration/transactions/boardRegistrations/scrutiny",
                  );
                }
              } else {
                language == "en"
                  ? sweetAlert({
                      title: "Cancel!",
                      text: "Record is Successfully Cancel!!",
                      icon: "success",
                      button: "Ok",
                    })
                  : sweetAlert({
                      title: "रद्द केले!",
                      text: "रेकॉर्ड यशस्वीरित्या रद्द केले!",
                      icon: "success",
                      button: "ओके",
                    });
              }
            });
          }}
        >
          Exit
        </Button>
      </div>
    </>
  );
};
// class component To Print
class ComponentToPrint extends React.Component {
  render() {
    console.log(this.props.data, "props");
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.middle}>
                <table>
                  <tr>
                    <center>
                      <h3 styles={{ marginTop: "40vh" }}>
                        <b>नमुना-"अ"</b>
                      </h3>
                      <h3 styles={{ marginTop: "40vh" }}>
                        <b>
                          विवाह मंडळाची नोंदणी / नोंदणीचे नूतनीकरण करण्यास नकार
                          देणारा आदेश
                        </b>
                      </h3>{" "}
                      <h3 styles={{ marginTop: "40vh" }}>
                        (कलम ५ (६) आणि नियम ३ (५) पाहा)
                      </h3>
                    </center>
                  </tr>
                </table>
              </div>
            </div>
            <div className={styles.formcontent} style={{ marginTop: "30px" }}>
              <h3>
                मी, विवाह मंडळाच्या निबंधक,{" "}
                <b>{this?.props?.data?.serviceNameMr} </b>
                अर्जाची व त्यासोबत सादर केलेल्या इतर सर्व दस्तऐवजांची व
                कागदपत्रांची छाननी केल्यानंतर आणि दिनांक :
                <b>
                  {" "}
                  {" " +
                    moment(this?.props?.data?.rejectDate, "YYYY-MM-DD").format(
                      "DD-MM-YYYY",
                    )}
                </b>{" "}
                रोजी अर्जदाराचे म्हणणे ऐकून घेतल्यानंतर सदर विवाह मंडळाची नोंदणी
                करण्यास / नोंदणीचे नूतनीकरण करण्यास खालील कारणास्तव नकार देत
                आहे.
                <br />
                .......................................................................
                <br />
                ......................................................................
              </h3>

              <Grid
                container
                style={{ justifyContent: "space-between", marginTop: "30px" }}
              >
                <Grid xs={12} sm={6} md={6} lg={6} xl={6} item>
                  <h3>ठिकाण :</h3>
                  <h3>
                    दिनांक :{" "}
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.data?.rejectDate,
                          "YYYY-MM-DD",
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                  </h3>
                  <div
                    style={{
                      margin: "2vh",
                    }}
                  >
                    <div
                      className={styles.circle}
                      style={{ paddingTop: "2vh", paddingBottom: "2vh" }}
                    >
                      <div className={styles.text}>शिक्का</div>
                    </div>
                  </div>
                </Grid>
                <Grid
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  item
                  style={{ textAlign: "right", paddingRight: "15vw" }}
                >
                  <br />
                  <br />
                  <h3>विवाह मंडळाचे निबंधक</h3>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default BoardRejectionNote;
