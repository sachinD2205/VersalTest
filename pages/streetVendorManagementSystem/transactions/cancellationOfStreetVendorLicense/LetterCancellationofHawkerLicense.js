import { Button, Paper, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import moment from "moment";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import styles from "../../../../components/streetVendorManagementSystem/styles/cancellationLetter.module.css";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import { useSelector } from "react-redux";

/** Author - Sachin Durge */
// LetterCancellationofHawkerLicense
const LetterCancellationofHawkerLicense = () => {
  const language = useSelector((state) => state?.labels?.language);
  const methods = useForm({
    mode: "onChange",
    criteriaMode: "all",
    // resolver: yupResolver(Schema),
  });

  // destructure values from methods
  const {
    setValue,
    getValues,
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = methods;
  const componentRef = useRef();
  const router = useRouter();
  const [certificateData, setCertificateData] = useState();
  const [cancellationOfHawkerLicenseId, setCancellationOfHawkerLicenseId] =
    useState();
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  let loggedInUser = localStorage.getItem("loggedInUser");
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    console.log("catchMethodStatus", catchMethodStatus);
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  // HandleToPrintButton
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // certificateData
  const getHawkerCertificateData = () => {
    let url = ``;
    // issuance

    // cancellation
    if (
      cancellationOfHawkerLicenseId != null &&
      cancellationOfHawkerLicenseId != undefined &&
      cancellationOfHawkerLicenseId != ""
    ) {
      url = `${urls.HMSURL}/hawkerLiscenseCertificate/getByCancellationId?cancellationOfliscenseId=${cancellationOfHawkerLicenseId}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          if (typeof r?.data == "object" && r?.data != undefined) {
            setCertificateData(r?.data);
            // setValue("loadderState",false);
          }
        } else {
          setValue("loadderState", false);
        }
      })
      .catch((error) => {
        setValue("loadderState", false);
        callCatchMethod(error, language);
      });
  };

  // idSet
  useEffect(() => {
    if (
      localStorage.getItem("cancellationOfHawkerLicenseId") != null &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != "" &&
      localStorage.getItem("cancellationOfHawkerLicenseId") != undefined
    ) {
      setValue("LoadderState", true);
      setCancellationOfHawkerLicenseId(
        localStorage.getItem("cancellationOfHawkerLicenseId")
      );
    }
  }, []);

  // api
  useEffect(() => {
    getHawkerCertificateData();
  }, [cancellationOfHawkerLicenseId]);

  useEffect(() => {
    setValue("loadderState", false);
    console.log("certificateData", certificateData);
  }, [certificateData]);

  // view
  return (
    <>
      {watch("loadderState") ? (
        <Loader />
      ) : (
        <Paper
          elevation={0}
          sx={{
            paddingTop: "50px",
            paddingRight: "100px",
            paddingLeft: "100px",
          }}
        >
          <br />
          <br />
          <Stack
            spacing={5}
            direction="row"
            style={{
              display: "flex",
              justifyContent: "left",
              marginLeft: "50px",
            }}
          >
            <Button
              variant="contained"
              type="button"
              color="primary"
              style={{ float: "right" }}
              onClick={() => handlePrint()}
            >
              {<FormattedLabel id="print" />}
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem("issuanceOfHawkerLicenseId");

                if (loggedInUser == "citizenUser") {
                  setValue("loadderState", false)
                  router.push(`/dashboard`)
                } else if (loggedInUser == "CFC_USER" || loggedInUser == "cfcUser") {
                  setValue("loadderState", false)
                  router.push(`/CFC_Dashboard`)
                } else if (loggedInUser == "DEPT_USER") {
                  setValue("loadderState", false)
                  router.push(`/streetVendorManagementSystem/dashboards`)
                }


              }}
              type="button"
              variant="contained"
              color="primary"
            >
              {<FormattedLabel id="back" />}
            </Button>
          </Stack>
          <br />
          <br />
          {/* {
            console.log()
          } */}

          <ComponentToPrint
            ref={componentRef}
            certificateData={certificateData}
          />
        </Paper>
      )}
    </>
  );
};

// ComponentToPrint
class ComponentToPrint extends React.Component {
  render() {
    console.log("propscertificate", this?.props?.certificateData);

    // view;
    return (
      <>
        {false ? (
          <Loader />
        ) : (
          <div className={styles.MainDiv}>
            <table className={styles.table}>
              <tbody>
                <tr>
                  <td className={styles.date} colSpan={50}>
                    दिनांक :&nbsp;
                    {moment(
                      this?.props?.certificateData?.serviceCompletionDate
                    ).format("DD-MM-YYYY") != "Invalid date"
                      ? moment(
                        this?.props?.certificateData?.serviceCompletionDate
                      ).format("DD-MM-YYYY")
                      : ""}
                  </td>
                </tr>

                <tr className={styles.parti}>
                  <td colSpan={60}>
                    <strong> प्रति,</strong>
                  </td>
                </tr>
                <tr className={styles.shreeArjadhar}>
                  <td colSpan={60}>
                    अर्जधारकाचे नाव :&nbsp;{" "}
                    <strong>
                      {this?.props?.certificateData?.firstNameMr +
                        " " +
                        this?.props?.certificateData?.middleNameMr +
                        " " +
                        this?.props?.certificateData?.lastNameMr}
                    </strong>{" "}
                  </td>
                </tr>
                <tr>
                  <td colSpan={60} className={styles.subject}>
                    <strong>
                      विषय : १) पथविक्रेता प्रमाणपत्र नोंद रद्द करणेबाबत.
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={60} className={styles.subject}>
                    <strong>
                      २) आपला सेवा स्वीकृती पत्राचा क्र.&nbsp;
                      {this?.props?.certificateData?.loi?.loiNo} आणि दि.&nbsp;
                      {moment(
                        this?.props?.certificateData?.loi?.loiDate
                      ).format("DD-MM-YYYY") != "Invalid date"
                        ? moment(
                          this?.props?.certificateData?.loi?.loiDate
                        ).format("DD-MM-YYYY")
                        : ""}
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan={60} className={styles.mahoday}>
                    महोदय \ महोदया,
                  </td>
                </tr>
                <tr>
                  <td colSpan={60} className={styles.letterContent}>
                    <p>
                      &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; संदर्भ २) अन्वये
                      आपण पथ विक्रेता प्रमाणपत्र नोंद रद्द करणेबाबत, अदा
                      करावयाची रक्कम &nbsp;
                      <strong>
                        {
                          this?.props?.certificateData?.paymentCollection
                            ?.receiptAmount
                        }
                      </strong>{" "}
                      पावती क्र. &nbsp;
                      <strong>
                        {this?.props?.certificateData?.paymentCollection
                          ?.receiptNo != null
                          ? this?.props?.certificateData?.paymentCollection
                            ?.receiptNo
                          : this?.props?.certificateData?.paymentCollection
                            ?.transactionDate}
                      </strong>{" "}
                      दि.&nbsp;
                      <strong>
                        {moment(
                          this?.props?.certificateData?.paymentCollection
                            ?.transactionDate
                        ).format("DD-MM-YYYY") != "Invalid date"
                          ? moment(
                            this?.props?.certificateData?.paymentCollection
                              ?.transactionDate
                          ).format("DD-MM-YYYY")
                          : moment(
                            this?.props?.certificateData?.paymentCollection
                              ?.receiptDate
                          ).format("DD-MM-YYYY")}
                      </strong>{" "}
                      अन्वये भरली असून आपणांस या आदेशान्वये पथ विक्रेता
                      प्रमाणपत्र क्र. &nbsp;
                      <strong>
                        {this?.props?.certificateData?.certificateNo}{" "}
                      </strong>
                      ची नोंद दि. &nbsp;
                      <strong>
                        {moment(
                          this?.props?.certificateData?.serviceCompletionDate
                        ).format("DD-MM-YYYY") != "Invalid date"
                          ? moment(
                            this?.props?.certificateData
                              ?.serviceCompletionDate
                          ).format("DD-MM-YYYY")
                          : ""}
                      </strong>{" "}
                      पासून रद्द करण्याची मान्यता देण्यात येत आहे.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td colSpan={60} className={styles.signature}>
                    स्वाक्षरी
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  }
}

export default LetterCancellationofHawkerLicense;
