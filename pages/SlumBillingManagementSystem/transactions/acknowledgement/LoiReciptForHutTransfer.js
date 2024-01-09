import {
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
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
import styles from "../acknowledgement/loiGeneratedReceipt1.module.css";
import { ToWords } from "to-words";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const LoiGenerationRecipt = () => {
  const {
    register,
    formState: { errors },
  } = useForm();

  const componentRef = useRef(null);
  const router = useRouter();
  const language = useSelector((state) => state.labels.language);
  let loggedInUser = localStorage.getItem("loggedInUser");
  const [applications, setApplicationDetails] = useState([]);
  const [data, setdata] = useState(null);
  const [deptnm, setDeptNm] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [hutData, setHutData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [slumData, setSlumData] = useState({});
  const [areaData, setAreaData] = useState({});
  const [villageData, setVillageData] = useState({});
  const [cityData, setCityData] = useState({});
  const [checkedOne, setCheckedOne] = React.useState(false);
  const [paymentGatUrl, setPayGatUrl] = useState(null);
  const [encRequest, setEncRequest] = useState(null);
  const [accessCode, setAccesssCode] = useState(null);
  let user = useSelector((state) => state.user.user);
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
  const cityDropDown = [
    {
      id: 1,
      cityEn: "Pimpri",
      cityMr: "पिंपरी",
    },
    {
      id: 2,
      cityEn: "Chinchwad",
      cityMr: "चिंचवड",
    },
    {
      id: 3,
      cityEn: "Bhosari",
      cityMr: "भोसरी",
    },
  ];

  useEffect(() => {
    if (data != null) {
      // getSlumData(data?.slumKey);
      // getAreaData(data?.areaKey);
      // getVillageData(data?.villageKey);
      // getCityData(data?.cityKey);
      // getApplicationDetails(data);
      getHutData(data?.hutKey);
      setApplicationDetails(data?.trnLoiList[data?.trnLoiList?.length - 1]);
    }
  }, [data]);

useEffect(()=>{

  console.log('applications', applications?.loiNo)
},[applications])

  useEffect(() => {
    if (hutData != null) {
      getSlumData(hutData?.slumKey);
      getAreaData(hutData?.areaKey);
      getVillageData(hutData?.villageKey);
      getCityData(hutData?.cityKey);
    }
  }, [hutData]);

  // const handleChangeOne = () => {
  //   setCheckedOne(!checkedOne);
  // };

  // useEffect(() => {
  //   if (checkedOne == true) {
  //     getPaymentDetails();
  //   } else {
  //     setPayGatUrl(null);
  //     setEncRequest(null);
  //     setAccesssCode(null);
  //   }
  // }, [checkedOne]);

  const getPaymentDetails = () => {
    let encodeUrl = "SlumBillingManagementSystem/transactions/pgSuccess";
    let body = {
      currency: "INR",
      language: "EN",
      moduleId: "SB",
      domain: window.location.hostname,
      amount: Number(applications?.totalAmount),
      divertPageLink: encodeUrl,
      loiId: Number(applications?.id),
      loiNo: Number(applications?.loiNo),
      ccAvenueKitLtp: "T",
      // "ccAvenueKitLtp": "L",
      serviceId: 123,
      applicationNo: router.query.id,
      applicationId: data.id,
    };
    setIsLoading(true);
    axios
      .post(
        `${urls.CFCPAYMENTURL}/transaction/paymentCollection/initiatePaymentV1`,
        body,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        setPayGatUrl(r.data.url);
        setEncRequest(r.data.encRequest);
        setAccesssCode(r.data.access_code);
        getToPaymentGateway(r.data);
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, true);
      });
  };

  const getToPaymentGateway = (payDetail) => {
    console.log("payDetail", payDetail);
    document.body.innerHTML += `<form id="dynForm" action=${payDetail} method="post">
    </form>`;
    document.getElementById("dynForm").submit();
  };

  const getHutData = (selectedId) => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getById?id=${selectedId}`, {
        headers: headers,
      })
      .then((r) => {
        // let result = r.data.mstHutList;
        // let selectedHut = result && result.find((obj) => obj.id == selectedId);
        setHutData(r.data);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getSlumData = (slumKey) => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getById?id=${slumKey}`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data;
        // let slum = result && result.find((each) => each.id == slumKey);
        setSlumData(result);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAreaData = (areaKey) => {
    axios
      .get(`${urls.CFCURL}/master/area/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.area;
        let area = result && result.find((each) => each.id == areaKey);
        setAreaData(area);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const getVillageData = (villageKey) => {
    axios
      .get(`${urls.SLUMURL}/master/village/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let result = r.data.village;
        let village = result && result.find((each) => each.id == villageKey);
        setVillageData(village);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getCityData = (cityKey) => {
    let city = cityDropDown && cityDropDown.find((city) => city.id == cityKey);
    setCityData(city);
  };

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: headers,
      })
      .then((r) => {
        setDepartments(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  //funxtion to get photopass issuance data by filter by application no

  const getLoiGenerationData = (applicationNo) => {
    axios
      .get(
        `${urls.SLUMURL}/trnTransferHut/search/applicationNumber?applicationNumber=${applicationNo}`,
        {
          headers: headers,
        }
      )
      .then((res) => {
        setdata(res.data);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    getDepartments();
  }, []);

  useEffect(() => {
    if (router.query.id) {
      getLoiGenerationData(router.query.id);
    }
  }, [router.query.id]);

  // function to get data of LOI payment



  // Handle Print

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "LOI Pay Receipt",
  });

  return (
    <>
      {isLoading && <CommonLoader />}
      <br />
      <div>
        <ComponentToPrint
          ref={componentRef}
          language={language}
          hutData={hutData}
          data={data}
          slumData={slumData}
          areaData={areaData}
          villageData={villageData}
          cityData={cityData}
          applications={applications}
          deptNm={deptnm}
        />
      </div>
      <br />
      {/* <Grid
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
      </Grid> */}

      <div className={styles.btn}>
        {/* {data?.status == 13 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => loiPayment()}
          >
            <FormattedLabel id="payment" />
          </Button>
        ) : (
          <></>
        )} */}

        {/* <form method="POST" action={paymentGatUrl}> */}
        {/* <div className={styles.small} hidden>
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
          </div> */}

        <Button
          type="primary"
          size="small"
          color="error"
          variant="contained"
          onClick={() => {
            swal({
              title: language == "en" ? "Exit?" : " बाहेर पडू इच्छिता ?",
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
                    : "रेकॉर्ड यशस्वीरित्या बाहेर पडते आहे!",
                  {
                    icon: "success",
                    button: language === "en" ? "Ok" : "ठीक आहे",
                  }
                ).then((will)=>{
                  if(will){
                    if(loggedInUser==='citizenUser'){
                      router.push("/dashboard");
                    }else if(loggedInUser==='cfcUser'){
                      router.push("/CFC_Dashboard");
                    }
                  }
                });
              } else {
                swal(
                  language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे",
                  { button: language === "en" ? "Ok" : "ठीक आहे" }
                );
              }
            });
          }}
        >
          <FormattedLabel id="exit" />
        </Button>
        {/* </form> */}
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          color="primary"
          size="small"
          onClick={handlePrint}
        >
          <FormattedLabel id="print" />
        </Button>
        <div className={styles.row}>
          <div>
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{ marginRight: "10px" }}
              onClick={getPaymentDetails}
              startIcon={<SaveIcon />}
              type="submit"
            >
              <FormattedLabel id="payment" />
            </Button>
          </div>
        </div>
      </div>
      <br />
      <br />
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
            <Grid container>
              <Grid
                item
                xl={4}
                lg={4}
                md={4}
                sm={4}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </Grid>
              </Grid>
              <Grid
                item
                xl={4}
                lg={4}
                md={4}
                sm={4}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h1 style={{ textAlign: "center" }}>
                  <b>
                    <FormattedLabel id="pimpariChinchwadMaha" />
                  </b>
                </h1>
              </Grid>
              <Grid
                item
                xl={4}
                lg={4}
                md={4}
                sm={4}
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </Grid>
            </Grid>
            <div>
              <h2 className={styles.heading}>
                <b>
                  <FormattedLabel id="serviceAcceptance" />
                </b>
              </h2>
            </div>

            <div className={styles.two}>
              <p>
                <b>
                  <h3>
                    <FormattedLabel id="ackDear" />{" "}
                    {this?.props?.language == "en"
                      ? this?.props?.data?.proposedOwnerFirstName +
                        " " +
                        this?.props?.data?.proposedOwnerMiddleName +
                        " " +
                        this?.props?.data?.proposedOwnerLastName
                      : this?.props?.data?.proposedOwnerFirstNameMr +
                        " " +
                        this?.props?.data?.proposedOwnerMiddleNameMr +
                        " " +
                        this?.props?.data?.proposedOwnerLastNameMr}
                  </h3>
                  <br></br> <FormattedLabel id="hutTransferAmt" />:{" "}
                  {this?.props?.data?.feesApplicable} <br />
                  <FormattedLabel id="determineandPayAmt" />
                  <br />{" "}
                  <FormattedLabel id="contactNearestpcmcDivisionalOffice" />
                  <br></br>
                </b>
              </p>

              <div className={styles.date2}>
                <h4>
                  <FormattedLabel id="departmentKey" /> :{" "}
                </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    <FormattedLabel id="slumKey" />
                  </b>
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>
                  <FormattedLabel id="loiNo" /> :{" "}
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {this?.props?.applications?.loiNo}
                </h4>
              </div>

              <table
                id="table-to-xls"
                className={styles.report_table}
                style={{ marginLeft: "10px" }}
              >
                <thead>
                  <tr>
                    <th colSpan={2}>
                      <FormattedLabel id="srNo" />
                    </th>
                    <th colSpan={8}>
                      <FormattedLabel id="chargeNm" />
                    </th>
                    <th colSpan={2}>
                      <FormattedLabel id="amount" />
                    </th>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <FormattedLabel id="no1" />
                    </td>
                    <td colSpan={4}>
                      <FormattedLabel id="hutTransfer" />
                    </td>
                    <td colSpan={4}>{this?.props?.applications?.totalAmount}</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      {" "}
                      <FormattedLabel id="other" />
                    </td>
                    <td colSpan={4}>{this?.props?.data?.penaltyCharge}</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b></b>
                    </td>
                    <td colSpan={4}>
                      <b>
                        <FormattedLabel id="totalAmount" /> :{" "}
                        {this?.props?.applications?.totalAmount}{" "}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className={styles.date2}>
                <h4>
                  <b>
                    <FormattedLabel id="amountInWord" /> :
                  </b>{" "}
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {" "}
                  ₹.{" "}
                  {toWords.convert(
                    Number(
                      this?.props?.data?.penaltyCharge
                        ? this?.props?.data?.feesApplicable +
                            this?.props?.data?.penaltyCharge
                        : this?.props?.data?.feesApplicable == undefined
                        ? 0
                        : this?.props?.data?.penaltyCharge
                        ? this?.props?.data?.feesApplicable +
                          this?.props?.data?.penaltyCharge
                        : this?.props?.data?.feesApplicable
                    )
                  )}{" "}
                  {this.props.language === "en"
                    ? " Rupees Only"
                    : " रुपये फक्त "}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>
                  <b>
                    <FormattedLabel id="applicationNo" />:{" "}
                  </b>
                </h4>
                <h4 style={{ marginLeft: "5px", overflowWrap: "anywhere" }}>
                  {this?.props?.data?.applicationNo}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>
                  <b>
                    <FormattedLabel id="applicantName" />{" "}
                  </b>
                </h4>
                <h4 style={{ marginLeft: "10px" }}>
                  {" "}
                  {this?.props?.language == "en"
                    ? this?.props?.data?.proposedOwnerFirstName +
                      " " +
                      this?.props?.data?.proposedOwnerMiddleName +
                      " " +
                      this?.props?.data?.proposedOwnerLastName
                    : this?.props?.data?.proposedOwnerFirstNameMr +
                      " " +
                      this?.props?.data?.proposedOwnerMiddleNameMr +
                      " " +
                      this?.props?.data?.proposedOwnerLastNameMr}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>
                  <b>
                    <FormattedLabel id="dateofApplication" /> :
                  </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  <b>
                    {" "}
                    {" " +
                      moment(this?.props?.data?.applicationDate).format(
                        "DD-MM-YYYY"
                      )}
                  </b>{" "}
                </h4>
              </div>

              <div className={styles.date2}>
                <h4>
                  <b>
                    <FormattedLabel id="applicantAddress" /> :
                  </b>
                </h4>{" "}
                <h4 style={{ marginLeft: "10px" }}>
                  {`${
                    this?.props?.slumData?.slumName
                      ? this?.props?.language == "en"
                        ? this?.props?.slumData?.slumName
                        : this?.props?.slumData?.slumNameMr
                      : ""
                  } , ${
                    this?.props?.areaData?.areaName
                      ? this?.props?.language == "en"
                        ? this?.props?.areaData?.areaName
                        : this?.props?.areaData?.areaNameMr
                      : ""
                  }, ${
                    this?.props?.villageData?.villageName
                      ? this?.props?.language == "en"
                        ? this?.props?.villageData?.villageName
                        : this?.props?.villageData?.villageNameMr
                      : ""
                  }, ${this?.props?.language == "en" ? "Pune" : "पुणे"} ${
                    this?.props?.hutData?.pincode
                  }`}
                </h4>
              </div>

              <hr />

              {/* <Grid container> */}
              <div className={styles.foot}>
                {/* <Grid item xl={3} lg={3} md={3} sm={6} xs={12}> */}
                {/* <Grid item xl={3}
                  lg={3}
                  md={3}
                  sm={3}
                  xs={12}> */}
                <div className={styles.add}>
                  <h5>
                    <FormattedLabel id="pimpariChinchwadMaha" />
                  </h5>

                  <h5>
                    <FormattedLabel id="ackpcmcAddress" />
                  </h5>
                  <h5>
                    {" "}
                    <FormattedLabel id="ackstateCountry" />
                  </h5>
                  {/* </Grid> */}
                </div>
                {/* <Grid item xl={3} lg={3} md={3} sm={6} xs={12}> */}
                {/* <Grid item xl={3}
                  lg={3}
                  md={3}
                  sm={3}
                  xs={12}> */}
                <div className={styles.add1}>
                  <h5>
                    <FormattedLabel id="ackPcmcphNo" />
                  </h5>
                  <h5>
                    <FormattedLabel id="emailId" />: egov@pcmcindia.gov.in /
                    sarathi@pcmcindia.gov.in
                  </h5>
                  {/* </Grid> */}
                </div>
                {/* <Grid item xl={3} lg={3} md={3} sm={6} xs={12}> */}
                {/* <Grid item xl={3}
                  lg={3}
                  md={3}
                  sm={3}
                  xs={12}> */}
                <div className={styles.logo1}>
                  <img
                    src="/slumqrcode.png"
                    alt=""
                    height="100vh"
                    width="100vw"
                  />
                  {/* </Grid> */}
                </div>
                {/* <Grid
                  item
                  xl={3}
                  lg={3}
                  md={6}
                  sm={6}
                  xs={12}
                  sx={{ marginTop: "10px" }}
                > */}
                {/* <Grid
                  item
                  xl={3}
                  lg={3}
                  md={3}
                  sm={3}
                  xs={12}
                  sx={{ marginTop: "10px" }}
                > */}
                <div
                  className={styles.logo1}
                  style={{
                    marginLeft: "5vh",
                    marginRight: "5vh",
                  }}
                >
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                  {/* </Grid>
                   */}
                </div>
                {/* </Grid> */}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoiGenerationRecipt;
