import {
  Button,
  Grid,
  Tooltip,
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
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
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

const Index = ({ selectedId, handleCloseAdesh, getCreatedBillData }) => {
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



  const toWords = new ToWords({ localeCode: "mr-IN" });

  const [selectedData, setSelectedData] = useState({});
  const [meterReadingData, setMeterReadingData] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [subDivisionName, setSubDivisionName] = useState("");
  const [modalforAprov, setmodalforAprov] = useState(false);
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
            dakhalaGenerated: selectedData?.dakhalaGenerated,
            adeshGenerated: true,
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
            setmodalforAprov(false);
            handleCloseAdesh();
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
            setmodalforAprov(false);
            handleCloseAdesh();
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  return (
    <div>
      <Grid
        container
        ref={componentRef}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
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

                {/* <div className={styles.foot}>
           
           
            
          </div> */}
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
                {/* <b>पावती</b> */}
                <h5>
                  {/* (महाराष्ट्र विवाह मंडळाचे विनियमन विवाह नोदणी अधिनियम १९९८) */}
                </h5>
              </h2>
            </div>

            <div className={styles.two}>
              {/* <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div >
              <h4>
                {' '}
                <b>दिनांक :</b>
              </h4>{' '}
              <h4 style={{ marginLeft: '10px' }}>
                <b>{this?.props?.dataa?.payment?.receiptDate}</b>
              </h4>
            </div>

            <div >
              <h4>
                {' '}
                <b>वेळ :</b>
              </h4>{' '}
              <h4 style={{ marginLeft: '10px' }}>
                {this?.props?.dataa?.payment?.receiptTime}
              </h4>
            </div>
          </div>
          <div className={styles.date2}>
            <h4 style={{ marginLeft: '40px' }}>
              {' '}
              <b>पावती क्रमांक :</b>
            </h4>{' '}
            <h4 style={{ marginLeft: '10px' }}>
              <b>{this?.props?.dataa?.payment?.receiptNo}</b>
            </h4>
          </div> */}

              {/********** LETTER HEADER **************/}

              <div className={styles.date7}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>
                        १) मा.कार्यकारी अभियंता (वि), विदयुत यांचेकडील दिनांक{" "}
                        {`  ${day}/${month}/${year}`} रोजीची मंजुर टिपणी.
                      </b>
                    </h4>
                  </div>
                </div>
              </div>

              <div className={styles.date7}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>
                        २) म.रा.वि.वि.कंपनी लि. यांचेकडील प्राप्त बील माहे :{" "}
                        {meterReadingData[0]?.monthAndYear
                          ? moment(meterReadingData[0]?.monthAndYear).format(
                              "MMM-YYYY"
                            )
                          : ""}
                      </b>
                    </h4>
                  </div>
                </div>
              </div>

              <div className={styles.date7}>
                <div className={styles.date4} style={{ marginTop: "2vh" }}>
                  <div className={styles.date3}>
                    <h4 style={{ marginLeft: "80px" }}>
                      <b>
                        ३) मा.आयुक्त यांचेकडील अधिकार प्रदान आदेश क्र.
                        लेखा/कावि/४१४/२०१८/, दि {"23/04/2018"}
                      </b>
                    </h4>
                  </div>
                </div>
              </div>

              <hr
                style={{
                  height: "2px",
                  backgroundColor: "#000",
                  marginLeft: "70px",
                  marginRight: "70px",
                }}
              />

              <div
                className={styles.date7}
                style={{ marginBottom: "2vh", marginTop: "2vh" }}
              >
                <div className={styles.date8}>
                  <div className={styles.add7}>
                    <h5>
                      <b>पिंपरी चिंचवड महानगरपलिका</b>
                    </h5>
                    <h5>पिंपरी - १८</h5>
                    <h5>क्र.: /वि/जा/</h5>
                    <h5>
                      {" "}
                      दिनांक:- <b>{`  ${day}/${month}/${year}`}</b>
                    </h5>
                  </div>
                </div>
              </div>

              {/********** LETTER SUBJECT **************/}

              <div className={styles.date5}>
                <div className={styles.date6}>
                  <h4>
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

              {/*********** LETTER TO ****************/}

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <h4 style={{ marginLeft: "80px" }}>
                    {" "}
                    <b>आदेश, </b>
                  </h4>{" "}
                  <h4 style={{ marginLeft: "10px" }}>
                    <b>
                      {" "}
                      {/* {' ' +
                                            moment(
                                                this?.props?.selectedObject?.createDtTm,
                                                'YYYY-MM-DD',
                                            ).format('DD-MM-YYYY')} */}
                    </b>{" "}
                    {/* {this?.props?.dataa?.applicationDate} */}
                  </h4>
                </div>
              </div>

              {/*********** LETTER BODY ****************/}

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "40px" }}>
                    {"  "}
                    {`${zoneName ? zoneName : ""} कार्यक्षेत्रातील  ${
                      subDivisionName ? subDivisionName : ""
                    } विद्युत उपविभागातील `}{" "}
                    इमारत, शाळा व कार्यालये येथील वीजमीटरचे वीजबील या कार्यालयास
                    प्राप्त झाले असुन, सदर बिलांची तांत्रीक तपासणी केली असता
                    मीटर ग्राहक क्रमांक व देय रक्कम म.रा.वि.वि.कं.लि. चे
                    नियमाप्रमाणे योग्य आहेत. प्राप्त बिलांचा तपशिल खालीलप्रमाणे.
                  </p>{" "}
                </div>
              </div>

              {/*********** LETTER TABLE ****************/}

              <div className={styles.table} style={{ marginBottom: "2vh" }}>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>अ.क्र.</th>
                    <th>विजमिटरचे ठिकाण</th>
                    <th>ग्राहक क्रमांक</th>
                    <th>VAN क्रमांक</th>
                    <th>खपत युनिट</th>
                    <th>माहे</th>
                    <th>मीटर क्रमांक</th>
                    <th>निव्वळ देय रक्कम</th>
                  </tr>
                  {meterReadingData &&
                    meterReadingData.map((each, i) => (
                      <tr key={i}>
                        <td style={{ width: "5%" }}>{i + 1}</td>
                        <td>
                          {each?.newConnectionEntryDao?.consumerAddressMr}
                        </td>
                        <td>{each?.consumerNo}</td>
                        <td>{each?.newConnectionEntryDao?.vanNo}</td>
                        <td>{each?.consumedUnit}</td>
                        <td>{moment(each?.monthAndYear).format("YYYY-MMM")}</td>
                        <td>{each?.newConnectionEntryDao?.meterNo}</td>
                        <td style={{ width: "10%", textAlign: "end" }}>
                          {each?.amountToBePaid?.toString().includes(".")
                            ? each?.amountToBePaid
                            : `${each?.amountToBePaid}.00`}
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
                    <td>
                      <b>एकूण रक्कम रुपये</b>
                    </td>
                    <td style={{ width: "10%", textAlign: "end" }}>
                      <b>
                        {selectedData?.amountToBePaid?.toString().includes(".")
                          ? selectedData?.amountToBePaid
                          : `${selectedData?.amountToBePaid}.00`}
                      </b>
                    </td>
                  </tr>
                </table>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    उपरोक्त ठिकाणी म.न.पा. तर्फे विजवापर होत असलेले सदरचे बिल
                    म.रा.वि.वि.क. लि.स अदा करणे आवश्यक आहे.
                  </p>{" "}
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px", marginRight: "80px" }}>
                    {" "}
                    सबब, मी, कार्यकारी अभियंता (वि), विदयुत, पिंपरी चिंचवड
                    महानगरपालिका, या आदेशान्वये म.रा.वि.वि.कं.लि.स रक्कम रुपये{" "}
                    <b>
                      {selectedData?.amountToBePaid
                        ? selectedData?.amountToBePaid
                        : "0"}
                    </b>{" "}
                    अक्षरी रक्कम रुपये{" "}
                    <b>
                      {toWords.convert(
                        selectedData?.amountToBePaid
                          ? selectedData?.amountToBePaid
                          : "0"
                      )}
                    </b>{" "}
                    रुपये फक्त म.रा.वि.वि.कं.लि.स अदा करण्यास या आदेशान्वये
                    मान्यता देण्यात येत आहे.
                  </p>{" "}
                </div>
              </div>

              {/*********** LETTER SIGNATURE ****************/}

              <div className={styles.date7} style={{ marginTop: "40px" }}>
                <div className={styles.date8}>
                  <div className={styles.add7}>
                    <h5>
                      <b>कार्यकारी अभियंता (वि)</b>
                    </h5>
                    <h5>
                      {" "}
                      <b>पिंपरी चिंचवड महानगरपलिका</b>
                    </h5>
                  </div>
                </div>
              </div>

              <div className={styles.date4}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    <b>प्रत-</b>
                  </p>
                </div>
              </div>

              <div className={styles.date4} style={{ marginBottom: "2vh" }}>
                <div className={styles.date2}>
                  <p style={{ marginLeft: "80px" }}>
                    <b> १. लेखा विभाग</b>
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
          }}
        >
          <Button variant="contained" onClick={handlePrint}>
            <FormattedLabel id="print" />
          </Button>
        </Grid>

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
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              handleCloseAdesh();
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
                authority.find((val) => val == "EXECUTIVE_ENGINEER") &&
                (selectedData?.status == 5 || selectedData?.status == 6) ? (
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
                ) : (
                  <></>
                )}
              </div>
            </Modal>
          </div>
        </form>
      </Grid>
    </div>
  );
};

export default Index;
