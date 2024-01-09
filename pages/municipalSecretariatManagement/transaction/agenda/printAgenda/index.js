import React, { useEffect, useRef, useState } from "react"
import {
  Paper,
  Button,
  Checkbox,
  ThemeProvider,
  Box,
  Grid,
  FormControl,
  TextField,
} from "@mui/material"
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel"
import { useReactToPrint } from "react-to-print"
import theme from "../../../../../theme"
import { Controller, useForm } from "react-hook-form"
import moment from "moment"
import PrintIcon from "@mui/icons-material/Print"
import { getPrepareAgendaDataFromLocalStorage } from "../../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { catchExceptionHandlingMethod } from "../../../../../util/util"
const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({})

  // const [checkB, setCheckB] = useState(null)

  const [meetingDateFromLocal, setMeetingDateFromLocal] = useState(
    getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")?.meetingDate
  )
  const [agendaOutwardDateFromLocal, setAgendaOutwardDateFromLocal] = useState(
    getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
      ?.agendaOutwardDate
  )
  const componentRef = useRef(null)
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

  const handleToPrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: ,
    pageStyle: "A4",
    color: "color",
    // print: "color",
    // onAfterPrint: () => alert("Print success"),
  })
  const logedInUser = localStorage.getItem("loggedInUser")
  let router = useRouter()

  // let checkB = JSON.parse(router?.query?.dataForDownload) //Ye problem solve karna hai ki double parse ko kaise roksakte hai

  // useEffect(() => {
  //   console.log(":20", router?.query?.dataForDownload)
  //   if (router?.query?.dataForDownload !== undefined) {
  //     setCheckB(JSON.parse(router?.query?.dataForDownload))
  //   }
  // }, [router?.query?.dataForDownload])

  //   useEffect(() => {
  //     console.log(":20", checkB)
  //   }, [router?.query?.dataForDownload])

  const [agendaNum] = useState(
    getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
      ? getPrepareAgendaDataFromLocalStorage("PrepareAgendaFormData")
        ?.agendaOutwardNo
      : ""
  )

  useEffect(() => {
    if (meetingDateFromLocal !== null) {
      setMeetingDateFromLocal(
        moment(meetingDateFromLocal && meetingDateFromLocal).format(
          "DD-MM-YYYY"
        )
      )
    }
    if (agendaOutwardDateFromLocal !== null) {
      setAgendaOutwardDateFromLocal(
        moment(agendaOutwardDateFromLocal && agendaOutwardDateFromLocal).format(
          "DD-MM-YYYY"
        )
      )
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Paper
          style={{
            marginBottom: "30px",
            width: "70%",
          }}
        >
          <div>
            <form ref={componentRef}>
              <Grid
                container
                spacing={3}
                style={{
                  // padding: "10px",
                  marginTop: "10px",
                  paddingLeft: "100px",
                  paddingRight: "85px",
                  // pageBreakAfter: "300px",
                }}
              >
                <Grid item xs={12} sm={12} md={7}></Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={5}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "start",
                  }}
                >
                  <span>पिंपरी चिंचवड महानगरपालिका,</span>
                  <span style={{ textAlign: "start" }}> पिंपरी - ४११०१८</span>
                  <span style={{ textAlign: "start" }}>मा. "__________"</span>
                  <span style={{ textAlign: "justify" }}>
                    क्रमांक - {agendaNum}
                  </span>
                </Grid>

                {/* ///////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "start",
                    marginTop: "20px",
                  }}
                >
                  <span>प्रति,</span>
                  <span>मा._________________________________,</span>
                  <span>सदस्य, "__________"</span>
                  <span>पिंपरी चिंचवड महानगरपालिका,</span>
                  <span> पिंपरी - ४११०१८</span>
                </Grid>
                {/* ///////////////////////////////////////// */}
                <Grid item xs={12} sm={12} md={2}></Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={10}
                  style={{
                    display: "flex",
                    // flexDirection: "column",
                    justifyContent: "flex-start",
                    // alignItems: "center",
                    marginTop: "30px",
                  }}
                >
                  विषय - पिंपरी चिंचवड महानगरपालिका, मा. "__________" ची सभा
                  दिनांक. "__________" रोजी आयोजित केलेबाबत.
                </Grid>

                {/* ///////////////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "start",
                    marginTop: "30px",
                  }}
                >
                  <span
                    style={{ textAlign: "justify", textJustify: "inter-word" }}
                  >
                    महोदय/महोदया,
                  </span>
                  <br />
                  <span
                    style={{
                      textAlign: "justify",
                      textJustify: "inter-word",
                      marginLeft: "90px",
                    }}
                  >
                    पिंपरी चिंचवड महापालिकेच्या, मा. "__________" ची सभा दिनांक.
                    "__________" "__________" वा. मा.अवर सचिव महाराष्ट्र शासन
                    यांचेकडील पत्र क्र. कोरोना/२०२०/प्र.क्र.७६/नवि-१४ दि. ३
                    जानेवारी २०२२ अन्वये ऑनलाईन पध्दतीने (व्हिडिओ कॉन्फरन्सिंग
                    द्वारे) आयोजित करण्यात आली आहे. महानगरपालिकेच्या प्रशासकीय
                    इमारतीमधील व्हिडीओ कॉन्फरन्स रुम मधून मा. सभापती, __________
                    हे सभा संचलित करणार आहेत. सोबत सभेची कार्यपत्रिका जोडली आहे.
                    सभेस आपण ऑनलाईन पध्दतीने सहभागी व्हावे, ही विनंती.
                  </span>
                </Grid>
                <Grid item xs={12} sm={12} md={6}></Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: "35px",
                  }}
                >
                  आपल्या विश्वासू ,
                  <span
                    style={{
                      height: 50,
                      width: 200,
                      padding: "2%",
                      marginBottom: "5%",
                      marginTop: "5%",
                      border: "1px solid black",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ opacity: "30%" }}>इथे हस्ताक्षर करा</span>
                  </span>
                  <span>{"( उल्हास बबनराव जगताप )"}</span>
                  <span>
                    <strong>नगरसचिव</strong>
                  </span>
                  <span>पिंपरी चिंचवड महानगरपालिका</span>
                  <span>पिंपरी - ४११ ०१८</span>
                </Grid>
                {/* //////////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "start",
                    marginTop: "40px",
                  }}
                >
                  <ul style={{ listStyle: "none" }}>
                    <li> प्रत - १) सर्व संबंदित शाखा प्रमुख व शाखाधिकारी</li>
                    <li style={{ marginLeft: "35px" }}>
                      २) कारयालीन नोटीस बोर्ड{" "}
                    </li>
                  </ul>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "40px",
                  }}
                >
                  <h3>
                    <strong>
                      पिंपरी चिंचवड महानगरपालिका, पिंपरी - ४११०१८{" "}
                    </strong>
                  </h3>
                  <h3>
                    <strong>मा. "__________"</strong>{" "}
                  </h3>
                  <h3>
                    <strong>कार्यपत्रिका क्रमांक - "__________"</strong>{" "}
                  </h3>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",

                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginTop: "40px",
                  }}
                >
                  <span>दिनांक - "__________"</span>
                  <span>वेळ - "__________"</span>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{ textAlign: "justify", textJustify: "inter-word" }}
                  >
                    <span style={{ marginLeft: "90px" }}>
                      पिंपरी चिंचवड महापालिकेच्या, मा. "__________" ची सभा
                      दिनांक. "__________" "__________" वा.{" "}
                    </span>
                    मा.अवर सचिव महाराष्ट्र शासन यांचेकडील पत्र
                    क्र.कोरोना/२०२०/प्र.क्र.७६/नवि-१४ दि. "__________" अन्वये
                    ऑनलाईन पध्दतीने (व्हिडिओ कॉन्फरन्सिंग द्वारे) आयोजित करण्यात
                    आली आहे. महानगरपालिकेच्या प्रशासकीय इमारतीमधील व्हिडीओ
                    कॉन्फरन्स रुम मधून मा. सभापती, स्थायी समिती हे सभा संचलित
                    करणार आहेत. सभेत खालील कामकाज होईल.
                  </span>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "baseline",
                  }}
                >
                  <strong>- - - - - - - - - - </strong>
                </Grid>

                {/* //////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                {getPrepareAgendaDataFromLocalStorage("PrepareAgendaDocketData")
                  .length > 0
                  ? getPrepareAgendaDataFromLocalStorage(
                    "PrepareAgendaDocketData"
                  ).map((obj, index) => {
                    // alert("obj");
                    return (
                      <Grid item xs={12} sm={12} md={12}>
                        <div
                          style={{
                            // width: "930px",
                            // height: "200px",
                            display: "flex",
                            flexDirection: "column",
                            // justifyContent: "flex-start",
                            alignItems: "flex-start",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "justify",
                              textJustify: "inter-word",
                            }}
                          >
                            <label
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                // textAlign: "justify",
                                // textJustify: "inter-word",
                              }}
                            >
                              विषय क्र. {index + 1} ) :
                            </label>

                            <strong
                              style={{
                                paddingLeft: "5px",
                                // textAlign: "justify",
                                // textJustify: "inter-word",
                              }}
                            >
                              {/* {checkB?.subject} */}
                              {obj.subject}
                            </strong>
                          </div>
                          <br />
                          <div
                            style={{
                              textAlign: "justify",
                              textJustify: "inter-word",
                            }}
                          >
                            <label
                              style={{
                                fontSize: 15,
                                fontWeight: 700,
                                // textAlign: "justify",
                                // textJustify: "inter-word",
                              }}
                            >
                              सारांश क्र. {index + 1}) :
                            </label>
                            <strong
                              style={{
                                paddingLeft: "5px",
                                paddingTop: "30px",
                                paddingBottom: "30px",
                                // textAlign: "justify",
                                // textJustify: "inter-word",
                              }}
                            >
                              {/* {checkB?.subject} */}
                              {obj.subjectSummary}
                            </strong>
                          </div>
                        </div>
                      </Grid>
                    )
                  })
                  : ""}
              </Grid>

              {/* ////////////////////////////////////////Second Line//////////////////////////////////////////// */}
            </form>
            <Grid
              container
              spacing={2}
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* //////////////////////////////////////////////////////////////////////////// */}

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{ width: "100px" }}
                  // disabled={showSaveButton}
                  type="button"
                  variant="contained"
                  color="primary"
                  endIcon={<PrintIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={handleToPrint}
                >
                  <FormattedLabel id="print" />
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  sx={{ width: "100px" }}
                  // disabled={showSaveButton}
                  type="button"
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowBackIcon />}
                  style={{ borderRadius: "20px" }}
                  size="small"
                  onClick={() => {
                    router.push(
                      "/municipalSecretariatManagement/transaction/agenda"
                    )
                  }}
                >
                  <FormattedLabel id="back" />
                </Button>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </div>
    </ThemeProvider>
  )
}

export default Index
