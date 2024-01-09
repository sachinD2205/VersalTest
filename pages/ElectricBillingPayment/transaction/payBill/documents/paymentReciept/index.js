import {
  Button,
  Grid,
  Tooltip,
  CircularProgress,
  Box,
  Modal,
  Typography,
  IconButton,
  TextareaAutosize,
  Card,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "./view.module.css";
import axios from "axios";
import urls from "../../../../../../URLS/urls";
import { useSelector } from "react-redux";
import moment from "moment";
import { ToWords } from "to-words";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import scrutinyActionSchema from "../../../../../../containers/schema/ElelctricBillingPaymentSchema/scrutinyActionSchema";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UndoIcon from "@mui/icons-material/Undo";
import modalStyles from "../../../../../../styles/ElectricBillingPayment_Styles/scutinyActions.module.css";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../../util/commonErrorUtil";
// import CircularProgress from "../../../../../../containers/Layout/components/CircularProgress";

const Index = ({ setOpenPaymentReciept, selectedId, getCreatedBillData }) => {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(scrutinyActionSchema),
    mode: "onChange",
  });
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const language = useSelector((state) => state.labels.language);

  const user = useSelector((state) => state.user.user);

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const [selectedData, setSelectedData] = useState({});
  const [meterReadingData, setMeterReadingData] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [subDivisionName, setSubDivisionName] = useState("");
  const [modalforAprov, setmodalforAprov] = useState(false);
  const toWords = new ToWords({ localeCode: "mr-IN" });

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
    if (selectedId) {
      getAllGeneratedBillData(selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    getZone(meterReadingData[0]?.zoneKey);
    getSubDivision(meterReadingData[0]?.subDivisionKey);
  }, [meterReadingData]);

  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error"
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error"
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error"
      );
    }
  };

  // get Zone Name
  const getZone = (id) => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.zone;
        let _res = temp.find((each) => each.id == id);
        setZoneName(_res?.zoneNameMr);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get SubDivision
  const getSubDivision = (id) => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstSubDivisionList;
        let _res = temp.find((each) => each.id == id);
        setSubDivisionName(_res?.subDivisionMr);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // Get Table - Data
  const getAllGeneratedBillData = (id) => {
    axios
      .get(`${urls.EBPSURL}/trnBillGenerate/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let res = r.data.trnBillGenerateList;
        let temp = res && res.find((each) => each.id == id);
        setSelectedData(temp);
        setMeterReadingData(temp?.trnMeterReadingAndBillGenerateDaoList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const handleApprovalBill = (btnType) => {
    let jrEngRole = authority?.find((val) => val === "JUNIOR_ENGINEER");
    let dyEngRole = authority?.find((val) => val === "DEPUTY_ENGINEER");
    let exEngRole = authority?.find((val) => val === "EXECUTIVE_ENGINEER");
    let deptAccRole = authority?.find((val) => val === "ACCOUNTANT");
    let hoAccRole = authority?.find((val) => val === "HEAD_ACCOUNTANT");

    let remarkObj = {
      jrEngApprovalRemark: jrEngRole
        ? watch("remark")
        : selectedData?.jrEngApprovalRemark,
      dyApprovalRemark: dyEngRole
        ? watch("remark")
        : selectedData?.dyApprovalRemark,
      exApprovalRemark: exEngRole
        ? watch("remark")
        : selectedData?.exApprovalRemark,
      deptAccApprovalRemark: deptAccRole
        ? watch("remark")
        : selectedData?.deptAccApprovalRemark,
      hoAccApprovalRemark: hoAccRole
        ? watch("remark")
        : selectedData?.hoAccApprovalRemark,
    };
    let temp = [selectedData];

    if (btnType === "APPROVE") {
      let result =
        temp &&
        temp.map((each) => {
          return {
            ...each,
            ...remarkObj,
            isApproved: true,
            isComplete: null,
            isSentToMsecdl: null,
            tippaniGenrated: selectedData?.tippaniGenrated,
            dakhalaGenerated: true,
            adeshGenerated: selectedData?.adeshGenerated,
            tippaniRejected: selectedData?.tippaniRejected,
          };
        });

      let _data = {
        trnBillGenerateDao: result,
      };

      const tempData = axios
        .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Approved!" : "मंजूर",
              language == "en"
                ? "Bill Approved Successfully !!!"
                : "बिल यशस्वीरित्या मंजूर झाले !!!",
              "success"
            );
            getCreatedBillData();
            setOpenPaymentReciept(false);
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    } else if (btnType === "REVERT") {
      let result =
        temp &&
        temp.map((each) => {
          return {
            ...each,
            ...remarkObj,
            isApproved: false,
            isComplete: null,
            isSentToMsecdl: null,
            tippaniGenrated: selectedData?.tippaniGenrated,
            dakhalaGenerated: selectedData?.dakhalaGenerated,
            adeshGenerated: false,
            tippaniRejected: selectedData?.tippaniRejected,
          };
        });

      let _data = {
        trnBillGenerateDao: result,
      };

      const tempData = axios
        .post(`${urls.EBPSURL}/trnBillGenerate/save/multiplBills`, _data, {
          headers: headers,
        })
        .then((res) => {
          if (res.status == 201) {
            sweetAlert(
              language == "en" ? "Revert!" : "पूर्ववत केले",
              language == "en"
                ? "Bill Revert Back successfully !"
                : "बिल यशस्वीरित्या परत आले!",
              "success"
            );
            getCreatedBillData();
            setOpenPaymentReciept(false);
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  return (
    <Box>
      <div style={{ paddingTop: "5%" }}>
        <div className={styles.mainn}>
          <div className={styles.main}>
            <div className={styles.one}>
              <div className={styles.logo}>
                <div>
                  <img src="/logo.png" alt="" height="100vh" width="100vw" />
                </div>
              </div>
              <div className={styles.middle}>
                <h1>
                  <b>पिंपरी चिंचवड महानगरपालिका</b>
                </h1>
                {/* <h4>
                  {' '}
                  <b>मुंबई पुणे महामार्ग ,</b> <b>पिंपरी पुणे 411-018</b>
                </h4> */}

                {/* <h4>
                  {' '}
                  <b>महाराष्ट्र, भारत</b>
                </h4> */}
              </div>
              <div className={styles.logo1}>
                <img
                  src="/smartCityPCMC.png"
                  alt=""
                  height="100vh"
                  width="100vw"
                />
              </div>
            </div>
            <div>
              <h2 className={styles.heading}>
                <b>पोच पावती</b>
              </h2>
            </div>
            <div>
              <Card>
                <div className={styles.info}>
                  <h3>
                    प्रिय, <b>{this?.props?.data?.applicantName}</b>
                  </h3>
                  <h3>पिंपरी चिंचवड नागरिक सेवा वापरल्याबद्दल धन्यवाद !!</h3>
                  <h3>
                    पिंपरी चिंचवड महापालिकेअंतर्गत येणाऱ्या नागरिक सेवा अंतर्गत
                    तुमचा {this?.props?.data?.serviceNameMr} अर्ज यशस्वीरीत्या
                    सादर झाला आहे.
                  </h3>
                </div>
              </Card>

              <div>
                <h2 className={styles.heading}>अर्जाचा तपशील</h2>
              </div>
              <Card>
                {/* <h2 className={styles.summary}>Application Summary</h2> */}
                <div className={styles.summ}>
                  <div>
                    <h3>अर्जाचा क्रमांक </h3>
                    <h3>अर्जदाराचे नाव </h3>
                    <h3>अर्ज दिनांक </h3>
                    <h3>पत्ता </h3>
                  </div>
                  <div>
                    <h3> : {this?.props?.data?.applicationNumber}</h3>
                    <h3>
                      {" "}
                      : <b>{this?.props?.data?.applicantName}</b>
                    </h3>
                    <h3>
                      {" "}
                      :{" "}
                      {moment(this?.props?.data?.applicationDate).format(
                        "DD-MM-YYYY"
                      )}
                    </h3>
                    <h3>
                      : {this?.props?.data?.applicantFlatHouseNo}{" "}
                      {this?.props?.data?.applicantFlatBuildingName} {","}
                      {this?.props?.data?.applicantLandmark} {","}{" "}
                      {this?.props?.data?.applicantArea} {","}{" "}
                      {this?.props?.data?.applicantCity} {","}{" "}
                      {this?.props?.data?.applicantState}{" "}
                    </h3>
                  </div>
                </div>
              </Card>

              <Grid container className={styles.bottom}>
                <Grid item xs={4}>
                  <h5>पिंपरी चिंचवड महानगरपलिका, </h5>
                  <h5> मुंबई पुणे महामार्ग, पिंपरी, पुणे, 411-018</h5>
                </Grid>
                <Grid
                  item
                  xs={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h5>फोन क्रमांक:91-020-2742-5511/12/13/14</h5>
                  {/* <h5>इमेल: egov@pcmcindia.gov.in / sarathi@pcmcindia.gov.in</h5> */}
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src="/qrcode1.png" alt="" height="80vh" width="80vw" />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img src="/barcode.png" alt="" height="50vh" width="100vw" />
                </Grid>
              </Grid>

              {/* <div className={styles.foot}>
              <div className={styles.add}></div>
              <div className={styles.add1}></div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                }}
              ></div>
              <div
                className={styles.logo1}
                style={{
                  marginLeft: "5vh",
                  marginRight: "5vh",
                }}
              ></div>
            </div> */}
            </div>
          </div>
        </div>
      </div>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "30px",
        }}
      >
        <Grid
          item
          xl={3}
          lg={3}
          md={6}
          sm={6}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Button variant="contained" onClick={handlePrint}>
            <FormattedLabel id="print" />
          </Button>
        </Grid>

        <Grid
          item
          xl={3}
          lg={3}
          md={6}
          sm={6}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Tooltip
            title="Approve"
            sx={{ marginLeft: "5px", marginRight: "5px" }}
          >
            <Button
              variant="contained"
              onClick={() => {
                // onSubmitForm("APPROVE");
                setmodalforAprov(true);
              }}
            >
              <FormattedLabel id="sendToJrEng" />
            </Button>
          </Tooltip>
        </Grid>

        <Grid
          item
          xl={3}
          lg={3}
          md={6}
          sm={6}
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              setOpenPaymentReciept(false);
            }}
          >
            <FormattedLabel id="back" />
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Index;
