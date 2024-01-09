import { Button, Grid, FormControlLabel, Checkbox } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import swal from "sweetalert";
import urls from "../../../../URLS/urls";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../acknowledgement/loiGeneratedReceipt.module.css";
import { ToWords } from "to-words";
import Loader from "../../../../containers/Layout/components/Loader";
import SaveIcon from "@mui/icons-material/Save";

import { TextField } from "@mui/material";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";
const LoiGenerationRecipt = () => {
  const {
    reset,
    register,
    formState: { errors },
  } = useForm();

  const logedInUser = localStorage.getItem("loggedInUser");
  const [applications, setApplicationDetails] = useState(null);
  const [data, setdata] = useState(null);
  const [deptnm, setDeptNm] = useState(null);
  const [chargeTypeDetails, setChargeTypeDetails] = useState();
  const [departments, setDepartments] = useState([]);
  const language = useSelector((state) => state.labels.language);
  let user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentGatUrl, setPayGatUrl] = useState(null);
  const [encRequest, setEncRequest] = useState(null);
  const [accessCode, setAccesssCode] = useState(null);
  const [checkedOne, setCheckedOne] = React.useState(false);
  const [applicationId, setApplicationId] = useState(null);

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

  // Handle Print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: language === "en" ? "Loi generation" : "Loi उत्पन्न",
  });

  const handleChangeOne = () => {
    setCheckedOne(!checkedOne);
  };

  useEffect(() => {
    getDepartments();
  }, [router.query.id]);

  useEffect(() => {
    if (checkedOne == true) {
      getPaymentDetails();
    } else {
      setPayGatUrl(null);
      setEncRequest(null);
      setAccesssCode(null);
    }
  }, [checkedOne]);

  useEffect(() => {
    if (router.query.id != undefined) {
      getApplicationDetails();
    }
  }, [departments]);

  useEffect(() => {
    if (applications != null && applications != undefined)
      getLoiGenerationData();
  }, [applications]);

  useEffect(() => {
    reset(router?.query);
  }, []);

  useEffect(() => {
    if (data != null && data != undefined) getChargeType();
  }, [data]);

  const getChargeType = () => {
    axios.get(`${urls.CFCURL}/master/serviceChargeType/getAll`).then((r) => {
      setChargeTypeDetails(
        r.data.serviceChargeType.filter((r) => r.id === data?.chargeTypeKey)[0]
          ?.serviceChargeType
      );
    }).catch((err) => {
      setIsLoading(false);
      cfcErrorCatchMethod(err, true);
    });
  };

  // load department
  const getDepartments = () => {
    axios.get(`${urls.CFCURL}/master/department/getAll`).then((r) => {
      setDepartments(
        r.data.department.map((row) => ({
          id: row.id,
          department: row.department,
        }))
      );
    }).catch((err) => {
      setIsLoading(false);
      cfcErrorCatchMethod(err, true);
    });
  };

  // load payment details
  const getPaymentDetails = () => {
    let encodeUrl = "RTIOnlineSystem/transactions/pgSuccess";
    let body = {
      currency: "INR",
      language: "EN",
      moduleId: "RTI",
      amount: Number(data?.totalAmount),
      divertPageLink: encodeUrl,
      loiId: Number(data?.id),
      loiNo: data?.loiNo,
      ccAvenueKitLtp: "T",
      serviceId: 103,
      applicationId: applicationId,
      applicationNo: router.query.id,
    };
    setIsLoading(true);
    axios
      .post(
        `${urls.CFCURL}/transaction/paymentCollection/initiatePayment`,
        body
      )
      .then((r) => {
        setIsLoading(false);
        setPayGatUrl(r.data.url);
        setEncRequest(r.data.encRequest);
        setAccesssCode(r.data.access_code);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, true);
      });
  };

  // get loi record by application no
  const getLoiGenerationData = () => {
    const headers =
      logedInUser === "citizenUser"
        ? { Userid: user?.id }
        : { Authorization: `Bearer ${user?.token}` };
    axios
      .get(
        `${urls.RTI}/trnAppealLoi/getAllByApplication?applicationNo=${applications?.id}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        if (res.data.trnAppealLoiList.length != 0) {
          setdata(res.data.trnAppealLoiList[0]);
        }
      }).catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // get RTI Application by application no
  const getApplicationDetails = () => {
    setIsLoading(true);
    const headers =
      logedInUser === "citizenUser"
        ? { Userid: user?.id }
        : { Authorization: `Bearer ${user?.token}` };
    axios
      .get(
        `${urls.RTI}/trnRtiApplication/searchByApplicationNumberV2?applicationNumber=${router.query.id}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setIsLoading(false);
        setApplicationId(res.data.id);
        setApplicationDetails(res.data);
        setDeptNm(
          departments?.find((obj) => {
            return obj.id == res.data?.departmentKey;
          })
            ? departments.find((obj) => {
                return obj.id == res.data.departmentKey;
              }).department
            : "-"
        );
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  // LOI Payment api
  const loiPayment = () => {
    const body = {
      activeFlag: "Y",
      isComplete: false,
      isApproved: false,
      ...data,
    };
    setIsLoading(true);
    const headers =
      logedInUser === "citizenUser"
        ? { Userid: user?.id }
        : { Authorization: `Bearer ${user?.token}` };

    const tempData = axios
      .post(`${urls.RTI}/trnAppealLoi/save`, body, {
        headers: headers,
      })
      .then((res) => {
        setIsLoading(false);
        if (res.status == 201) {
          sweetAlert({
            title: language == "en" ? "Saved!" : "जतन केले!",
            text:
              language == "en"
                ? "LOI Payment Done Successful!"
                : "LOI पेमेंट यशस्वी झाले!",
            icon: "success",
            button: language === "en" ? "Ok" : "ठीक आहे",
          }).then((will) => {
            if (will) {
              router.push({
                pathname: "/dashboard",
              });
            }
          });
        } else {
          sweetAlert(
            language == "en" ? "Error!" : "त्रुटी",
            language == "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            "error",
            { button: language === "en" ? "Ok" : "ठीक आहे" }
          );
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };



  // View
  return (
    <>
      {isLoading && <CommonLoader />}
      <div>
        <ComponentToPrint
          ref={componentRef}
          data={data}
          chargeTypeDetails={chargeTypeDetails}
          application={applications}
          deptNm={deptnm}
          language={language}
        />
      </div>
      <br />
      {(data?.transactionStatus == null ||
        data?.transactionStatus === "Failure") && (
        <Grid
          item
          xl={12}
          lg={12}
          md={12}
          sm={12}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                value="I agree"
                checked={checkedOne}
                onChange={handleChangeOne}
              />
            }
            label={<FormattedLabel id="iagreeForOnlinePay" />}
          />
        </Grid>
      )}
      <div className={styles.btn}>
        {/* <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: "10px" }}
          onClick={() => loiPayment()}
        >
          <FormattedLabel id="payment" />
        </Button> */}

        <form method="POST" action={paymentGatUrl} style={{ width: "100%" }}>
          <div className={styles.small} hidden>
            <div className={styles.row}>
              <div>
                <TextField
                  sx={{ width: 250 }}
                  id="standard-basic"
                  label="encRequest"
                  variant="standard"
                  value={encRequest}
                  {...register("encRequest")}
                  error={!!errors.moduleName}
                  helperText={
                    errors?.moduleName ? errors.moduleName.message : null
                  }
                />
              </div>
            </div>

            <div className={styles.row} hidden>
              <div>
                <TextField
                  sx={{ width: 250 }}
                  id="standard-basic"
                  label="access_code"
                  variant="standard"
                  value={accessCode}
                  {...register("access_code")}
                  error={!!errors.moduleName}
                  helperText={
                    errors?.moduleName ? errors.moduleName.message : null
                  }
                />
              </div>
            </div>
          </div>

          <div className={styles.btn}>
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{ marginRight: "10px" }}
              onClick={() => {
                swal({
                  title: language == "en" ? "Exit?" : "बाहेर पडायचे?",
                  text:
                    language == "en"
                      ? "Are you sure you want to exit this Record ? "
                      : "तुम्हाला खात्री आहे की तुम्ही या रेकॉर्डमधून बाहेर पडू इच्छिता ? ",
                  icon: "warning",
                  buttons: true,
                  dangerMode: true,
                  buttons: [
                    language === "en" ? "No" : "नाही",
                    language === "en" ? "Yes" : "होय",
                  ],
                }).then((willDelete) => {
                  if (willDelete) {
                    swal(
                      language == "en"
                        ? "Record is Successfully Exit!"
                        : "रेकॉर्ड यशस्वीरित्या बाहेर पडले!",
                      {
                        icon: "success",
                        button: language === "en" ? "Ok" : "ठीक आहे",
                      }
                    ).then((will) => {
                      if (will) router.push("/dashboard");
                    });
                  } else {
                    swal(
                      language == "en"
                        ? "Record is Safe"
                        : "रेकॉर्ड सुरक्षित आहे",
                      { button: language === "en" ? "Ok" : "ठीक आहे" }
                    );
                  }
                });
              }}
            >
              <FormattedLabel id="exit" />
            </Button>
            <Button
              variant="contained"
              sx={{ marginRight: "10px" }}
              type="primary"
              size="small"
              onClick={handlePrint}
            >
              <FormattedLabel id="print" />
            </Button>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ marginRight: "10px" }}
              disabled={!paymentGatUrl}
              startIcon={<SaveIcon />}
              type="submit"
            >
              <FormattedLabel id="payment" />
            </Button>
          </div>
        </form>

        {/* "https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction" */}
      </div>
    </>
  );
};

// class component To Print
class ComponentToPrint extends React.Component {
  render() {
    const toWordsEn = new ToWords({ localeCode: "en-IN" });
    const toWordsMr = new ToWords({ localeCode: "mr-IN" });
    const toWords = this.props.language == "en" ? toWordsEn : toWordsMr;
    return (
      <>
        <div className={styles.main}>
          <div className={styles.small}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img
                    src="/smartCityPCMC.png"
                    alt=""
                    height="100vh"
                    width="100vw"
                  />
                </div>
              </div>
              <div
                className={styles.middle}
                styles={{ paddingTop: "15vh", marginTop: "20vh" }}
              >
                <div className={styles.logo1} style={{ margin: "5px" }}>
                  <img src="/logo.png" alt="" height="50vh" width="50vw" />
                </div>
                <h1>
                  <b>
                    <FormattedLabel id="pimpariChinchwadMaha" />
                  </b>
                </h1>
              </div>
              <div className={styles.logo1}>
                <img
                  src="/RTIReceiptLogo.jpeg"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div className={styles.heading}>
              <h2>
                <b>
                  <FormattedLabel id="serviceAcceptance" />
                </b>
              </h2>
            </div>

            <div className={styles.two}>
              <div className={styles.labelValue}>
                <b>
                  <h3 className={styles.label}>
                    <FormattedLabel id="ackDear" />,{" "}
                    {this.props.language == "en" && (
                      <>
                        {" "}
                        {this?.props?.application?.applicantFirstName +
                          " " +
                          this?.props?.application?.applicantMiddleName +
                          " " +
                          this?.props?.application?.applicantLastName}
                      </>
                    )}
                    {this.props.language == "mr" && (
                      <>
                        {" "}
                        {this?.props?.application?.applicantFirstNameMr +
                          " " +
                          this?.props?.application?.applicantMiddleNameMr +
                          " " +
                          this?.props?.application?.applicantLastNameMr}
                      </>
                    )}
                  </h3>
                  <FormattedLabel id="rtiApplicationAmt" />
                  {/* :{" "}
                  {this?.props?.data?.totalAmount} <br /> */}
                  <FormattedLabel id="determineandPayAmt" />
                  {/* <FormattedLabel id="contactNearestpcmcDivisionalOffice" /> */}
                </b>
              </div>

              <div className={styles.date2}>
                <div className={styles.labelValue}>
                  <h4>
                    <b>
                      <FormattedLabel id="departmentKey" />{" "}
                    </b>{" "}
                    :{" "}
                  </h4>{" "}
                  <div style={{ marginLeft: "10px" }}>{this.props.deptNm}</div>
                  {/* <h4>
                    <b>
                      <FormattedLabel id="RTI" />
                    </b>
                  </h4> */}
                </div>
              </div>

              <div className={styles.date2}>
                <div className={styles.labelValue}>
                  <h4>
                    <b>
                      <FormattedLabel id="loiNo" /> :{" "}
                    </b>{" "}
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.data?.loiNo}
                  </h4>
                </div>
              </div>

              <table id="table-to-xls" className={styles.report_table}>
                <thead>
                  <tr>
                    <th colSpan={2}>
                      <FormattedLabel id="srNo" />
                    </th>
                    <th colSpan={4}>
                      <FormattedLabel id="chargeNm" />{" "}
                    </th>
                    <th colSpan={4}>
                      <FormattedLabel id="quantity" />
                    </th>
                    {/* <th colSpan={4}><FormattedLabel id="ratePerPage" /></th> */}
                    <th colSpan={2}>
                      <FormattedLabel id="amount" />
                    </th>
                  </tr>
                  {this.props.data?.trnLoiChargesDaos?.map((obj, index) => {
                    return (
                      <tr>
                        <td colSpan={2}>
                          {/* <FormattedLabel id="no1" /> */}
                          {index + 1}
                        </td>
                        <td colSpan={4}>
                          {obj.serviceChargeTypeName}
                          {/* {"("} {this.props.deptNm}
                      {")"} */}
                        </td>
                        <td colSpan={4}>{obj.unit}</td>
                        {/* <td colSpan={4}> {this?.props?.data?.amount}</td> */}
                        <td colSpan={2}>{obj.amount}</td>
                      </tr>
                    );
                  })}
                </thead>
                <tbody>
                  {/* <tr>
                    <td colSpan={2}>
                      <FormattedLabel id="no2" />
                    </td>
                    <td colSpan={4}>
                      {" "}
                      <FormattedLabel id="other" />
                    </td>
                    <td colSpan={4}>
                      <b>{"-"}</b>
                    </td>
                    <td colSpan={4}>{"-"}</td>
                  </tr> */}
                  <tr>
                    <td colSpan={2}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>
                        <FormattedLabel id="totalAmount" /> :{" "}
                        {this?.props?.data?.totalAmount}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <div className={styles.labelValue}>
                  <h4>
                    <b>
                      <FormattedLabel id="amountInWord" /> :
                    </b>{" "}
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {" "}
                    : ₹.{" "}
                    {toWords.convert(
                      Number(
                        this?.props?.data?.totalAmount == undefined
                          ? 0
                          : this?.props?.data?.totalAmount
                      )
                    )}{" "}
                    {this.props.language === "en"
                      ? " Rupees Only"
                      : " रुपये फक्त "}
                  </h4>
                </div>
              </div>

              <div className={styles.date2}>
                <div className={styles.labelValue}>
                  <h4>
                    <b>
                      <FormattedLabel id="applicationNo" /> :{" "}
                    </b>{" "}
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.application?.applicationNo}
                  </h4>
                </div>
              </div>

              <div className={styles.date2}>
                <div className={styles.labelValue}>
                  <h4>
                    <b>
                      <FormattedLabel id="applicantName" /> :{" "}
                    </b>{" "}
                  </h4>

                  <h4 style={{ marginLeft: "10px" }}>
                    {this.props.language == "en" && (
                      <>
                        {" "}
                        {this?.props?.application?.applicantFirstName +
                          " " +
                          this?.props?.application?.applicantMiddleName +
                          " " +
                          this?.props?.application?.applicantLastName}
                      </>
                    )}
                    {this.props.language == "mr" && (
                      <>
                        {" "}
                        {this?.props?.application?.applicantFirstNameMr +
                          " " +
                          this?.props?.application?.applicantMiddleNameMr +
                          " " +
                          this?.props?.application?.applicantLastNameMr}
                      </>
                    )}
                  </h4>
                </div>
              </div>

              <div className={styles.date2}>
                <div className={styles.labelValue}>
                  <h4>
                    <b>
                      <FormattedLabel id="dateofApplication" /> :
                    </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {" " +
                        moment(
                          this?.props?.application?.applicationDate
                        ).format("DD-MM-YYYY")}
                    </b>{" "}
                  </h4>
                </div>
              </div>

              <div className={styles.date2}>
                <div className={styles.labelValue}>
                  <h4>
                    <b>
                      <FormattedLabel id="applicantAddress" /> :{" "}
                    </b>{" "}
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    {this?.props?.language === "en"
                      ? this?.props?.application?.address
                      : this?.props?.application?.addressMr}
                  </h4>
                </div>
              </div>

              <hr />

              <div className={styles.foot}>
                <div className={styles.add}>
                  <h5>
                    <FormattedLabel id="pimpariChinchwadMaha" />
                  </h5>
                  <h5>
                    {" "}
                    <FormattedLabel id="ackpcmcAddress" />
                  </h5>
                </div>
                <div className={styles.add1}>
                  <h5>
                    <FormattedLabel id="ackPcmcphNo" />
                  </h5>
                </div>
                <div className={styles.logo1}>
                  <img
                    src="/rtiqrcode.png"
                    alt=""
                    height="100vh"
                    width="100vw"
                  />
                </div>
                <div
                  className={styles.logo1}
                  style={{
                    marginLeft: "5vh",
                    marginRight: "5vh",
                  }}
                >
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
