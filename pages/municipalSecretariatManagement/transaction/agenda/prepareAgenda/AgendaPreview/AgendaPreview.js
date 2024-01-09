import { ExitToApp, Print } from "@mui/icons-material"
import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Modal,
  Paper,
} from "@mui/material"
import axios from "axios"
import moment from "moment"
import Head from "next/head"
import router, { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import sweetAlert from "sweetalert"
import URLS from "../../../../../../URLS/urls"
import FormattedLabel from "../../../../../../containers/reuseableComponents/FormattedLabel"
import styles from "./view.module.css"
import html2pdf from "html2pdf-jspdf2"
import ReactHtmlParser from "html-react-parser"
import { agendaPreviewGetFromLocalStorage } from "../../../../../../components/redux/features/MunicipalSecretary/municipalSecreLocalStorage"
import ExitToAppIcon from "@mui/icons-material/ExitToApp"
import { useGetToken } from "../../../../../../containers/reuseableComponents/CustomHooks"
import { useSelector } from "react-redux"
import { catchExceptionHandlingMethod } from "../../../../../../util/util"

const AgendaPreview = ({
  openPreviewModal,
  setOpenPreviewModal,
  setFinalSubmitButtonOn,
}) => {
  const language = useSelector((state) => state?.labels.language)
  const [committeeName, setCommitteeName] = useState("")

  const [departmentName, setDepartmentName] = useState([])

  const [showingFormatForVishay, setShowingFormatForVishay] = useState(null)
  const [showingFormat, setShowingFormat] = useState(null)

  const [loading, setLoading] = useState(false)

  const parser = new DOMParser()
  const componentRef = useRef(null) // ANWAR A. ANSARI

  const [agendaPrivewData, setAgendaPrivewData] = useState(
    agendaPreviewGetFromLocalStorage("agendaPrivewData")
  )

  const router = useRouter()

  const userToken = useGetToken()
  const [catchMethodStatus, setCatchMethodStatus] = useState(false)
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language)
        setCatchMethodStatus(false)
      }, [0])
      setCatchMethodStatus(true)
    }
  }

  useEffect(() => {
    //Get Committee Name
    axios
      .get(`${URLS.MSURL}/mstDefineCommittees/getAllForDropDown`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        res.data.committees.forEach((j) => {
          if (j.id === agendaPrivewData?.committeeId) {
            setCommitteeName(j.committeeNameMr)

            commBasedFormatt(j.committeeNameMr)
          }
        })
      })
      .catch((error) => {
        callCatchMethod(error, language)
      })
  }, [])

  ///////////////////////////////////////////////////////
  const commBasedFormatt = (value) => {
    switch (value) {
      case "महापालिका सभा ":
        return (
          setShowingFormat(
            `पिंपरी चिंचवड महानगरपालिकेची मासीक मा.महापालिका सभा`
          ),
          setShowingFormatForVishay(
            `पिंपरी चिंचवड महानगरपालिकेची मा.महापालिका सभा`
          )
        )
      case "स्थायी समिती":
        return (
          setShowingFormat(
            `पिंपरी चिंचवड महानगरपालिकेची मा.स्थायी समितीची साप्ताहीक सभा`
          ),
          setShowingFormatForVishay(
            `पिंपरी चिंचवड महानगरपालिकेची मा.स्थायी समितीची सभा`
          )
        )

      default:
        return (
          setShowingFormat(
            `पिंपरी चिंचवड महानगरपालिकेची मा.${value}ची पाक्षिक सभा`
          ),
          setShowingFormatForVishay(
            `पिंपरी चिंचवड महानगरपालिकेची मा.${value}ची सभा`
          )
        )
    }
  }

  ////////////////////////////////////////////////////

  const exitFunction = () => {
    sweetAlert({
      title: "Are you sure?",
      text: "Do you want to add/remove the dockets?",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: false,
      closeOnClickOutside: false,
    }).then((will) => {
      if (will) {
        setOpenPreviewModal(false)
        setFinalSubmitButtonOn(true)
      } else {
        setOpenPreviewModal(false)
        setFinalSubmitButtonOn(false)
      }
    })
  }

  useEffect(() => {
    //Get Department
    setLoading(true)
    axios
      .get(`${URLS.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        console.log("Department: ", res.data.department)
        setDepartmentName(
          res?.data?.department?.map((j) => ({
            id: j.id,
            departmentNameEn: j.department,
            departmentNameMr: j.departmentMr,
          }))
        )
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        callCatchMethod(error, language)
      })
  }, [])

  return (
    <>
      <Modal
        open={openPreviewModal}
        sx={{
          padding: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            overflow: "auto",
          }}
        >
          <Paper
          // className={styles.main}
          // style={{
          //   backgroundColor: "whitesmoke",
          //   width: "100%",
          // }}
          >
            <div
              id="myForm"
              className={styles.reportWrapper}
              ref={componentRef}
              style={{
                pageBreakInside: "avoid",
                pageBreakBefore: "auto",
                pageBreakAfter: "auto",
              }}
            >
              <Grid
                container
                style={{
                  // marginBottom: "12%",
                  pageBreakAfter: "always",
                }}
              >
                <Grid item xs={12} sm={12} md={8}></Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "start",
                  }}
                >
                  <span>पिंपरी चिंचवड महानगरपालिका,</span>
                  <span style={{ textAlign: "start" }}> पिंपरी - ४११०१८</span>
                  <span style={{ textAlign: "start" }}> नगरसचिव कार्यालय,</span>

                  <span style={{ textJustify: "inter-word" }}>
                    {" "}
                    क्रमांक - {"XXXXXXXXXXXX..."}
                  </span>

                  <span style={{ textAlign: "justify" }}>
                    दिनांक - {"XX-XX-XXXX"}
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
                  <span>प्रती,</span>

                  <span>माननीय सदस्य (सर्व),</span>
                  <span>{committeeName},</span>

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
                    justifyContent: "flex-start",
                    marginTop: "30px",
                  }}
                >
                  विषय - {showingFormatForVishay} दिनांक. {"XX-XX-XXXX"} रोजी
                  आयोजित केलेबाबत.
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
                    style={{
                      textAlign: "justify",
                      textJustify: "inter-word",
                    }}
                  >
                    महोदय/महोदया,
                  </span>
                  <span
                    style={{
                      textAlign: "justify",
                      textJustify: "inter-word",
                      textIndent: "90px",
                    }}
                  >
                    दिनांक. {"XX-XX-XXXX"} रोजी वा. महानगरपालिकेच्या प्रशासकीय
                    इमारती मधील {"XXXXXXXXXXXXXXXX..."} येथे आयोजित करण्यात आली
                    आहे. सोबत सभेची कार्यपत्रिका जोडली आहे. सभेस आपण उपस्थित
                    रहावे, ही विनंती.
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
                  आपला विश्वासू ,
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
                  <span>पिंपरी - ४११०१८</span>
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
                    {/* <li> प्रत - १) सर्व सदस्य,{committeeName}, </li> */}
                    <li> प्रत - १) सर्व संबंधित शाखा प्रमुख व शाखाधिकारी </li>
                    <li style={{ marginLeft: "35px" }}>
                      २) कार्यालयीन नोटीस बोर्ड{" "}
                    </li>
                  </ul>
                </Grid>
              </Grid>

              {/* //////////////////////////// */}
              <div className={styles.heading}>
                <span>पिंपरी चिंचवड महानगरपालिका, पिंपरी-४११०१८. </span>
                <span>
                  मा. <strong>{committeeName}</strong>
                </span>
                <span>कार्यपत्रिका क्रमांक - {"XXXXXXXXXXXX..."}</span>
              </div>

              {/* PAGE BREAKING */}

              <div
                className={styles.dateAndTime}
                style={{ justifyContent: "space-between" }}
              >
                <span>दिनांक - {"XX-XX-XXXX"}</span>
                <span>वेळ - {"XX:XX"}</span>
              </div>
              <p
                className={styles.description}
                style={{ textAlign: "justify", textJustify: "inter-word" }}
              >
                दिनांक {"XX-XX-XXXX"} रोजी {"XX:XX"} वा. महानगरपालिकेच्या{" "}
                <strong>{"XXXXXXXXXXXXXXXXX... "}</strong> येथे आयोजीत करण्यात
                आली आहे . सभेत खालील कामकाज होईल.
              </p>
              {agendaPrivewData &&
                // @ts-ignore
                agendaPrivewData?.agendaSubjectDao?.map((obj, index) => {
                  return (
                    <>
                      <Grid container>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={12}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "20px",
                          }}
                        >
                          <span>
                            विषय क्रं : <strong>{index + 1})</strong>
                          </span>
                          {/* ////////////////////////// */}
                          <span>
                            विभाग :{" "}
                            <strong>
                              {
                                departmentName?.find((val) => {
                                  return obj.departmentId == val.id
                                })?.departmentNameMr
                              }
                            </strong>
                          </span>
                        </Grid>

                        <Grid item xs={12} sm={12} md={12}>
                          <p>{ReactHtmlParser(obj?.subjectSummary)}</p>
                        </Grid>
                      </Grid>
                    </>
                  )
                })}

              <div
                className={styles.signatureWrapper}
                style={{ pageBreakBefore: "always" }}
              >
                <div className={styles.signature}>
                  <span
                    style={{
                      height: 50,
                      width: 200,
                      padding: "2%",
                      marginBottom: "5%",
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
                  <span>पिंपरी - ४११०१८</span>
                </div>
                {/* ADDING OUTER DIV */}
              </div>
              <div className={styles.endDetails}>
                <span>पिंपरी चिंचवड महानगरपालिका</span>
                <span>पिंपरी - १८. नगरसचिव विभाग</span>
                <span>क्रमांक - {"XXXXXXXXXX..."}</span>
                <span>दिनांक - {"XX-XX-XXXX"}</span>
                <br />
                <span>टिप - {agendaPrivewData?.tip}</span>
              </div>
              {/* BUTTON */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  endIcon={<ExitToAppIcon />}
                  size="small"
                  // onClick={() => setOpenPreviewModal(false)}
                  onClick={exitFunction}
                >
                  Exit
                </Button>
              </div>
            </div>
          </Paper>
        </div>
      </Modal>
    </>
  )
}

export default AgendaPreview
