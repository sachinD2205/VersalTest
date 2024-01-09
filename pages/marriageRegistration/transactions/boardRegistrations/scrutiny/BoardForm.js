import { Button, Grid } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../../URLS/urls";
import styles from "./LoiGenerationRecipt.module.css";
import { catchExceptionHandlingMethod } from "../../../../../util/util";

const BoardForm = () => {
  const language = useSelector((state) => state?.labels.language);
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
            `${urls.MR}/transaction/modOfMarBoardCertificate/getapplicantById?applicationId=${router?.query?.id}`,
            // }/transaction/modOfMarBoardCertificate/getModOfMarCertificateDetails?applicationId=${Number(router?.query?.id)}&serviceId=15`,
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
            `${
              urls.MR
            }/transaction/renewalOfMarraigeBoardCertificate/getapplicantById?applicationId=${Number(
              router?.query?.id,
            )}`,
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
            swal({
              title: "Exit?",
              text: "Are you sure you want to exit this Record ? ",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            }).then((willDelete) => {
              console.log("ersdfdsf", willDelete, loggedInUser);
              if (willDelete) {
                swal("Record is Successfully Exit!", {
                  icon: "success",
                });
                if (loggedInUser == "citizenUser") {
                  router.push("/dashboard");
                } else {
                  router.push(
                    "/marriageRegistration/transactions/boardRegistrations/scrutiny",
                  );
                }
              } else {
                swal("Record is Safe");
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
    console.log(this.props.data, "propsobj");
    return (
      <>
        <div className={styles.main} style={{ fontSize: "12px" }}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.middle}>
                <table>
                  <tr>
                    <center>
                      <h3>
                        <b>नमुना-"अ"</b>
                      </h3>
                      <h3>
                        <b>
                          विवाह मंडळाची नोंदणी / नोंदणीचे नूतनीकरण करण्याकरीता
                          अर्ज
                        </b>
                      </h3>{" "}
                      <h3>(कलम ५ (१) आणि नियम ३ पाहा)</h3>
                    </center>
                  </tr>
                </table>
              </div>
            </div>
            <div className={styles.formcontent}>
              <h3>व्दारा :</h3>
              <h3>प्रति,</h3>
              <Grid container style={{ justifyContent: "space-between" }}>
                <Grid
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  item
                  style={{ paddingLeft: "5vw" }}
                >
                  <h3>(अर्जदाराचे नांव व पत्ता)</h3>
                  <h3>
                    {this?.props?.data?.ofNameMr} {this?.props?.data?.omNameMr}{" "}
                    {this?.props?.data?.olNameMr}
                  </h3>
                  <h3>
                    {this?.props?.data?.oflatBuildingNoMr}{" "}
                    {this?.props?.data?.obuildingNameMr} <br />
                    {this?.props?.data?.oroadNameMr}{" "}
                    {this?.props?.data?.olandmarkMr} <br />
                    {this?.props?.data?.ocityNameMr}{" "}
                    {this?.props?.data?.opincode}
                  </h3>
                  <h3>(कायमस्वरूपी पत्ता)</h3>
                </Grid>
                <Grid
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  item
                  style={{ marginTop: "5vh" }}
                >
                  <h3>
                    {this?.props?.data?.oflatBuildingNoMr}{" "}
                    {this?.props?.data?.obuildingNameMr} <br />
                    {this?.props?.data?.oroadNameMr}{" "}
                    {this?.props?.data?.olandmarkMr} <br />
                    {this?.props?.data?.ocityNameMr}{" "}
                    {this?.props?.data?.opincode}
                  </h3>
                  <h3>(सध्याचा पत्ता)</h3>
                </Grid>
              </Grid>
              <h3>प्रति,</h3>
              <div className={styles.formcontent}>
                <h3>निबंधक,</h3>
                <h3>विवाह मंडळ व विवाह नोंदणी,</h3>
              </div>
              <h3>महोदय,</h3>
              <div className={styles.formcontent}>
                <h3>निबंधक,</h3>
                <h3>
                  मी, उपरोल्लिखित अर्जदार, खालील विवाह मंडळाच्या नोंदणीकरिता
                  नोंदणीचे नूतनीकरण करण्याकरिता अर्ज करु इच्छितो :
                </h3>

                <h3>१.विवाह मंडळाचे नांव आणि पूर्ण पत्ता :</h3>
                <h3>{this?.props?.data?.marriageBoardNameMr} </h3>
                <h3>
                  {this?.props?.data?.bflatBuildingNoMr}{" "}
                  {this?.props?.data?.bbuildingNameMr} <br />
                  {this?.props?.data?.broadNameMr}{" "}
                  {this?.props?.data?.blandmarkMr} <br />
                  {this?.props?.data?.cityMr} {this?.props?.data?.bpincode}
                </h3>
                <h3>
                  ( मंडळाचे नोंदणीकृत ज्या ठिकाणी <br />
                  असेल किंवा होणार असेल ते ठिकाण)
                </h3>
                <h3>२.मी यासोबत खालील दस्तऐवज जोडीत आहे:</h3>
                <h3>{this?.props?.data?.aadharCard && "-आधार कार्ड"}</h3>
                <h3>
                  {this?.props?.data?.agreemenyCopyOfProperty &&
                    "-कराराची प्रत आणि मालमत्तेचा उतारा"}
                </h3>
                <h3>
                  {this?.props?.data?.boardHeadPersonPhoto &&
                    "-मंडळाच्या प्रमुख व्यक्तीच छायाचित्र"}
                </h3>
                <h3>
                  {this?.props?.data?.boardOrganizationPhoto &&
                    "-संस्था किंवा मंडळची दस्तऐवज"}
                </h3>
                <h3>{this?.props?.data?.electricityBill && "-वीज बिल"}</h3>
                <h3>{this?.props?.data?.panCard && "-पॅन कार्ड"}</h3>
                <h3>{this?.props?.data?.rationCard && "-रेशान कार्ड"}</h3>
                <h3>
                  {this?.props?.data?.receiptOfPaymentOfpropertyTax &&
                    "-मालमत्ता कर भरल्याची पावती"}
                </h3>
                <h3>
                  {this?.props?.data?.resolutionOfBoard && "-मंडळाचा ठराव"}
                </h3>
                <h3>{this?.props?.data?.otherDoc && "-इतर दस्तऐवज"}</h3>
                {this?.props?.data?.serviceId == 15 && (
                  <h3>
                    {this?.props?.data?.oldBoardCertificate &&
                      "-जुने बोर्ड प्रमाणपत्र"}
                  </h3>
                )}

                <h3>
                  ज्या अटीस व शर्तीस अधीन राहून नोंदणी करण्यात येईल अशा सर्व अटी
                  व शर्ती माझ्यावर /आमच्यावर बंधनकारक असतील, यास मी / आम्ही
                  वचनबध्द आहे / आहोत.
                </h3>
              </div>

              <Grid container style={{ justifyContent: "space-between" }}>
                <Grid xs={12} sm={6} md={6} lg={6} xl={6} item>
                  <h3>
                    ठिकाण : <b> {this?.props?.data?.ocityNameMr}</b>
                  </h3>
                  <h3>
                    दिनांक :{" "}
                    <b>
                      {moment(this?.props?.data?.applicationDate).format(
                        "DD-MM-YYYY",
                      )}
                    </b>
                  </h3>
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
                  <h3>आपला विश्वासू</h3>
                  <br />
                  <br />
                  <h3>(अर्जदाराची स्वाक्षरी)</h3>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default BoardForm;
