import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useForm } from "react-hook-form";
import urls from "../../../../URLS/urls";
import { Print } from "@mui/icons-material";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const DigitalSignature = () => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  const user = useSelector((state) => {
    return state.user.user;
  });
  const token = useSelector((state) => state.user.user.token);

  const router = useRouter();

  const componentRef = useRef(null);
  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Vakalatnama",
    pageStyle: "A4",
  });

  const [caseData, setCaseData] = useState({});
  const [advocateRemarks, setAdvocateRemarks] = useState([]);

  // ------------------------------------------------------------------------------------------
  const selectedNotice = useSelector((state) => {
    console.log("111selectedNotice", state.user.selectedNotice);
    return state.user.selectedNotice;
  });

  let prNotice = selectedNotice.parawiseTrnParawiseReportDaoLst?.map((val) => {
    return {
      id: val.id,
      issueNo: val?.issueNo,
      paragraphWiseAanswerDraftOfIssues: val.paragraphWiseAanswerDraftOfIssues,
      parawiseReportId: val?.parawiseReportId,
    };
  });

  console.log("PRNotice", prNotice);

  let filtered = prNotice?.map((val) => {
    if (val.parawiseReportId !== null) {
      console.log("valllll", val);
      return {
        ...val,
        paragraphWiseAanswerDraftOfIssuesRTN:
          selectedNotice.parawiseTrnParawiseReportDaoLst.find(
            (rtn) => rtn.parawiseReportId === val.id
          )?.paragraphWiseAanswerDraftOfIssues,
      };
    }
  });
  // ------------------------------------------------------------------------------------------

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
  // get Case Details
  const getCaseDetails = (caseId) => {
    axios
      .get(
        `${urls.LCMSURL}/transaction/newCourtCaseEntry/getByIdV1?id=${Number(
          caseId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r?.status == 200 || r?.status == 201 || r?.status == "SUCCESS") {
          console.log("__error", r?.data);
          setCaseData(r?.data ?? {});
        } else {
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    console.log("router.query", router.query);
    if (router?.query?.caseId) {
      getCaseDetails(router?.query?.caseId);
    }
    if (router?.query?.advocateRemark) {
      let _advData = JSON?.parse(router?.query?.advocateRemark)?.map(
        (_d, i) => ({ ..._d, srNo: i + 1 })
      );
      console.log("_advData", _advData);
      setAdvocateRemarks(_advData ?? []);
    }
  }, [router?.query]);

  // Save DB

  const onSubmitForm = (Data) => {
    console.log("data", Data);
    let body = {
      id: router.query.id,
      updateUserId: user?.id,
      // lawyerRemarkEn: Data.lawyerRemarkEn,
      // lawyerRemarkMr: Data.lawyerRemarkMr,
    };
    let _body = {
      id: Number(router.query.id),
      role: "DIGITAL_SIGNATURE",
    };
    console.log("body", _body);
    axios
      .post(
        // `${urls.LCMSURL}/transaction/newCourtCaseEntry/markAsDigitallySignedByConcernedHod`,
        // body,
        `${urls.LCMSURL}/parawiseRequest/saveApprove`,
        _body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log("createWrittenStatementByLawyer", res);
        if (res.status == 201) {
          sweetAlert("Saved!", "Record Submitted successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        } else if (res.status == 200) {
          sweetAlert("Updated!", "Record Updated successfully !", "success");
          router.push(`/LegalCase/transaction/newCourtCaseEntry`);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Grid
          container
          style={{
            // backgroundColor: "red",
            display: "flex",
            justifyContent: "center",
            width: "90%",
            marginLeft: "5%",
          }}
          // style={{ display: "none" }}
        >
          <Paper
            style={{
              background: "white",
              border: "2px solid #000",
              width: "100%",

              // backgroundColor: "red",
              // height: "50%",
              // marginLeft: "10%",
              // marginRight: "10%",
            }}
            ref={componentRef}
          >
            {/* New Exp */}
            <div
              style={{
                // backgroundColor: "red",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <table
                style={{
                  //border: "2px solid black",
                  width: "90%",
                  alignItems: "center",
                  marginTop: "40px",
                  marginBottom: "40px",
                  marginLeft: "9%",
                  marginRight: "9%",
                  fontSize: "20px",
                }}
              >
                <tr
                  style={{
                    height: "80px",
                  }}
                >
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    IN THE COURT OF {caseData?.courtName?.toUpperCase()}
                  </td>
                </tr>
                {/* Case Type and Case-Sub Type */}
                <tr
                // style={{
                //   height: "80px",
                // }}
                >
                  <td colSpan={2} style={{ textAlign: "right" }}>
                    {caseData?.vcaseMainType},{caseData?.vcaseSubType}
                  </td>
                </tr>
                {/* Case No and Year */}
                <tr
                  style={{
                    height: "3x 0px",
                  }}
                >
                  <td colSpan={2} style={{ textAlign: "right" }}>
                    Reg. C. S. No.
                    {caseData?.caseNoYear}
                  </td>
                </tr>

                <tr
                  style={{
                    height: "60px",
                  }}
                >
                  <td style={{ textAlign: "left" }}>{caseData?.filedBy}</td>
                  <td style={{ textAlign: "right" }}>----------Plaintiff</td>
                </tr>
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <td style={{ textAlign: "left" }}>V/S</td>
                </tr>
                <tr
                  style={{
                    height: "50px",
                  }}
                >
                  <td style={{ textAlign: "left" }}>
                    {caseData?.filedAgainst}
                  </td>
                  <td style={{ textAlign: "right" }}>------Defendants</td>
                </tr>
                {advocateRemarks &&
                  advocateRemarks?.map((val) => {
                    return (
                      <tr
                        style={{
                          // height: "180px",
                          height: "100px",
                        }}
                      >
                        <td colSpan={2}>
                          <n></n>
                          {`${val?.srNo}. ${val?.writtenStatementInEnglish}`}
                          <n></n>
                        </td>
                      </tr>
                    );
                  })}
              </table>
            </div>
          </Paper>
        </Grid>

        {/* Print button  */}
        <Grid
          container
          style={{
            marginTop: "8px",
          }}
        >
          <Grid item lg={3.5}></Grid>

          {/* Approve Vakalatnama  */}

          {/* <Grid item>
            <Button variant="contained" type="submit">
              Approve
            </Button>
          </Grid> */}

          {/* Print Button */}

          <Grid item lg={2}>
            {/* <Button
              variant="contained"
              endIcon={<Print />}
              onClick={handleToPrint}
            >
              Print
            </Button> */}
            <Button
              variant="outlined"
              size="large"
              sx={{
                cursor: "pointer",
                overflow: "hidden",
                fontSize: "10px",
                whiteSpace: "normal",
                backgroundColor: "green",
                color: "white",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#556CD6",
                },
              }}
              type="submit"
            >
              Apply Digital Signature
            </Button>
          </Grid>

          {/* {Vakalatnama_status === "VAKALATNAMA_SIGNED_BY_LEGAL_HOD" && (
              <Grid item lg={2}>
                <Button
                  variant="contained"
                  endIcon={<Print />}
                  onClick={handleToPrint}
                >
                  Print
                </Button>
              </Grid>
            )} */}

          <Grid item lg={3}></Grid>

          {/* Cancel */}

          <Grid item lg={2}>
            <Button
              variant="contained"
              style={{
                background: "red",
              }}
              onClick={() => {
                router.push(
                  `/LegalCase/transaction/newCourtCaseEntry/parawiseRequest`
                );
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>

        {/* +++++++++ */}
      </form>
    </>
  );
};

export default DigitalSignature;
