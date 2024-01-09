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
} from "@mui/material";
import React, { useState, useEffect } from "react";
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel";
import styles from "../goshwara.module.css";
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

const Index = ({ handleCloseDakhala, selectedId, getCreatedBillData }) => {
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

  const headers = {
    Authorization: `Bearer ${user.token}`,
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
            handleCloseDakhala();
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
            handleCloseDakhala();
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  return (
    <Box>
      <div>
        <Grid
          container
          ref={componentRef}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className={styles.main}>
            <div className={styles.small}>
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
                  <div className={styles.add8}>
                    <div className={styles.add}>
                      <h5>
                        <b>पिंपरी चिंचवड महानगरपलिका </b>
                      </h5>
                      <h5>
                        {" "}
                        <b>मुंबई पुणे महामार्ग पिंपरी पुणे 411-018</b>
                      </h5>
                      <h5>
                        <b> महाराष्ट्र, भारत</b>
                      </h5>
                    </div>

                    <div className={styles.add1}>
                      <h5>
                        <b>फोन क्रमांक:91-020-2742-5511/12/13/14</b>
                      </h5>
                      <h5>
                        <b> इमेल: egov@pcmcindia.gov.in</b>
                      </h5>
                      <h5>
                        <b>/ sarathi@pcmcindia.gov.in</b>
                      </h5>
                    </div>
                  </div>
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
                  {/* <b>पावती</b> */}
                  <h5>
                    {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                  </h5>
                </h2>
              </div>

              <div className={styles.two}>
                {/********** LETTER SUBJECT **************/}

                <div className={styles.date5}>
                  <div className={styles.date6}>
                    <h4
                      style={{
                        marginTop: "40px",
                        marginBottom: "40px",
                      }}
                    >
                      {" "}
                      <b>विषय : </b>{" "}
                      {`${zoneName ? zoneName : ""} कार्यक्षेत्रातील  ${
                        subDivisionName ? subDivisionName : ""
                      } विद्युत उपविभागातील `}{" "}
                      इमारत, शाळा व कार्यालये येथील वीजमीटरचे वीजबील
                      म.रा.वि.वि.क.ली. यांना अदा करणेबाबत.
                    </h4>{" "}
                  </div>
                </div>

                {/*********** LETTER TABLE ****************/}

                <div className={styles.table} style={{ marginBottom: "2vh" }}>
                  <table>
                    <tr>
                      <th>अ.क्र.</th>
                      <th>ग्राहक क्रमांक</th>
                      <th>ग्राहकाचे नाव</th>
                      <th>मीटर क्रमांक</th>
                      <th>VAN क्रमांक</th>
                      <th>खपत युनिट</th>
                      <th>माहे</th>
                      <th>युनिट</th>
                      <th>रक्कम रुपये</th>
                    </tr>
                    {meterReadingData &&
                      meterReadingData.map((obj, i) => (
                        <tr key={i}>
                          <td style={{ width: "5%" }}>{i + 1}</td>
                          <td>{obj?.consumerNo}</td>
                          <td>{obj?.newConnectionEntryDao?.consumerNameMr}</td>
                          <td>{obj?.newConnectionEntryDao?.meterNo}</td>
                          <td>{obj?.newConnectionEntryDao?.vanNo}</td>
                          <td>{obj?.consumedUnit}</td>
                          <td>
                            {moment(obj?.monthAndYear).format("YYYY-MMM")}
                          </td>
                          <td>{obj?.consumedUnit}</td>
                          <td style={{ width: "10%", textAlign: "end" }}>
                            {obj?.amountToBePaid?.toString().includes(".")
                              ? obj?.amountToBePaid
                              : `${obj?.amountToBePaid}.00`}
                          </td>
                        </tr>
                      ))}

                    <tr>
                      <td style={{ width: "5%" }}> </td>
                      <td> </td>
                      <td> </td>
                      <td> </td>
                      <td> </td>
                      <td> </td>
                      <td> </td>
                      <td>
                        <b>एकूण रक्कम रुपये</b>
                      </td>
                      <td style={{ width: "10%", textAlign: "end" }}>
                        <b>
                          {selectedData?.amountToBePaid
                            ?.toString()
                            .includes(".")
                            ? selectedData?.amountToBePaid
                            : `${selectedData?.amountToBePaid}.00`}
                        </b>
                      </td>
                    </tr>
                  </table>
                </div>

                <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                  <div className={styles.date2}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>दिनांक :</b>
                      <b>{`  ${day}/${month}/${year}`}</b>
                    </h4>
                  </div>
                </div>

                <div className={styles.date5}>
                  <div>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>दाखला :-</b>
                      {"  "}
                    </h4>
                  </div>

                  <div>
                    <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                      <b>(1)</b> सदरचे बिल यापुर्वी अदा केलेले नाही
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                      <b>(2)</b> सदरचे बिल म.रा.वि.वि.क.ली. मंडळाच्या नियमानुसार
                      योग्य आहे
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                      <b>(3)</b> सदरच्या बिलाची नोंद बिल रजिस्टर मध्ये घेन्यात
                      आली आहे
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                      <b>(4)</b> प्रदानार्थ मंजूर रक्कम रु.{" "}
                      <b>
                        {selectedData?.amountToBePaid
                          ? selectedData?.amountToBePaid
                          : "0"}
                      </b>
                    </p>
                    <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                      <b>(5)</b> अक्षरी रक्कम रु.{" "}
                      <b>
                        {toWords.convert(
                          selectedData?.amountToBePaid
                            ? selectedData?.amountToBePaid
                            : "0"
                        )}
                      </b>{" "}
                      फक्त
                    </p>
                  </div>
                </div>

                <div className={styles.btn} style={{ marginTop: "80px" }}>
                  <div>
                    <p style={{ marginLeft: "80px" }}> कनिष्ठ अभियंता (वि)</p>
                    <p style={{ marginLeft: "80px" }}>
                      <b>विद्युत विभाग</b>
                    </p>
                  </div>

                  <div>
                    <p style={{ marginLeft: "80px" }}> उप-अभियंता (वि)</p>
                    <p style={{ marginLeft: "80px" }}>
                      <b>विद्युत विभाग</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>

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

          {authority &&
          authority.find((val) => val == "DEPUTY_ENGINEER") &&
          (selectedData?.status == 3 || selectedData?.status == 4) ? (
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
                  <FormattedLabel id="approve" />
                </Button>
              </Tooltip>
            </Grid>
          ) : (
            <></>
          )}

          {authority &&
          authority.find((val) => val == "EXECUTIVE_ENGINEER") &&
          (selectedData?.status == 5 || selectedData?.status == 6) ? (
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
                title="Revert"
                sx={{ marginLeft: "5px", marginRight: "5px" }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    // onSubmitForm("REVERT");
                    setmodalforAprov(true);
                  }}
                >
                  <FormattedLabel id="revert" />
                </Button>
              </Tooltip>
            </Grid>
          ) : (
            <></>
          )}

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
                handleCloseDakhala();
              }}
            >
              <FormattedLabel id="back" />
            </Button>
          </Grid>
        </Grid>

        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form {...methods} onSubmit={handleSubmit("remarks")}>
            <div className={modalStyles.model}>
              <Modal
                open={modalforAprov}
                //onClose={clerkApproved}
                onCancel={() => {
                  setmodalforAprov(false);
                }}
              >
                <div className={modalStyles.boxRemark}>
                  <div className={modalStyles.titlemodelremarkAprove}>
                    <Typography
                      className={modalStyles.titleOne}
                      variant="h6"
                      component="h2"
                      color="#f7f8fa"
                      style={{ marginLeft: "25px" }}
                    >
                      <FormattedLabel id="remarkModel" />
                      {/* Enter Remark on application */}
                    </Typography>

                    <IconButton>
                      <CloseIcon onClick={() => setmodalforAprov(false)} />
                    </IconButton>
                  </div>

                  <div
                    className={modalStyles.btndate}
                    style={{ marginLeft: "200px" }}
                  >
                    <TextareaAutosize
                      aria-label="minimum height"
                      minRows={4}
                      placeholder="Enter a Remarks"
                      style={{ width: 700 }}
                      // onChange={(e) => {
                      //   setRemark(e.target.value)
                      // }}
                      // name="remark"
                      {...register("remark")}
                    />
                  </div>

                  {authority &&
                  authority.find((val) => val == "DEPUTY_ENGINEER") &&
                  (selectedData?.status == 3 || selectedData?.status == 4) ? (
                    <div className={modalStyles.btnappr}>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<UndoIcon />}
                        onClick={() => {
                          handleApprovalBill("APPROVE");
                        }}
                      >
                        <FormattedLabel id="submit" />
                      </Button>
                    </div>
                  ) : authority &&
                    authority.find((val) => val == "EXECUTIVE_ENGINEER") &&
                    (selectedData?.status == 5 || selectedData?.status == 6) ? (
                    <div className={modalStyles.btnappr}>
                      <Button
                        variant="contained"
                        color="primary"
                        endIcon={<UndoIcon />}
                        onClick={() => {
                          handleApprovalBill("REVERT");
                        }}
                      >
                        <FormattedLabel id="submit" />
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Modal>
            </div>
          </form>
        </Grid>
      </div>
    </Box>
  );
};

export default Index;
