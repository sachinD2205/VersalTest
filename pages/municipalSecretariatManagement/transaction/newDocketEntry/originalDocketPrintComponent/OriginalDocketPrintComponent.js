import { Button, Grid, Paper, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel"
import { useSelector } from "react-redux"
import styles from "./OriginalDocketPrintComponent.module.css"
import ReactHtmlParser from "html-react-parser"
import { useReactToPrint } from "react-to-print"
import { ExitToApp, Print } from "@mui/icons-material"
import axios from "axios"
import URLs from "../../../../../URLS/urls"
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../../util/util"

const OriginalDocketPrintComponent = ({ data }) => {
  const componentRef = useRef(null)

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

  const userToken = useGetToken()

  const [docketType, setDocketType] = useState([])

  const language = useSelector((state) => state?.labels.language)

  const handleToNormalPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Original Copy Of The Docket",
    pageStyle: "A4",
    color: "color",
  })

  useEffect(() => {
    if (data?.docketType) {
      axios
        .get(`${URLs.MSURL}/mstDocketType/getAll`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          setDocketType(
            res?.data?.docketType
              ?.filter((o) => o.id === data?.docketType)
              .map((j) => ({
                id: j.id,
                docketTypeEn: j.docketType,
                docketTypeMr: j.docketTypeMr,
              }))
          )
        })
        .catch((error) => {
          callCatchMethod(error, language)
        })
    }
  }, [data?.docketType])

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Paper
        style={{
          backgroundColor: "whitesmoke",
          width: "100%",
          padding: 20,
        }}
      >
        {Object.keys(data ? data : {})?.length !== 0 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleToNormalPrint()
            }}
            size="small"
          >
            {<Print />}
          </Button>
        )}

        <div ref={componentRef}>
          <Grid
            container
            style={{
              pageBreakAfter: "always",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <h2
              style={{
                borderBottom: "1px solid black",
              }}
            >
              {language == "en"
                ? `ORIGINAL DOCKET COPY (DocketId : ${
                    data?.docketId ? data?.docketId : ""
                  })`
                : `डॉकेटची मूळ कॉपी (डॉकेटआयडी : ${
                    data?.docketId ? data?.docketId : ""
                  })`}
            </h2>
            <Grid item xs={12} sm={12} md={12}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div>
                  <strong>
                    <FormattedLabel id="subjectDate" /> :{" "}
                  </strong>
                  <strong>{data?.subjectDate}</strong>
                </div>
                <div>
                  <strong>
                    <FormattedLabel id="departmentName" /> :{" "}
                  </strong>
                  <strong>
                    {language == "en"
                      ? data?.departmentName
                      : data?.departmentNameMr}
                  </strong>
                </div>
              </div>
              {/* FILE REF>>> DIV */}
              <div className={styles.marginBot}>
                <strong>
                  <FormattedLabel id="reference" /> :{" "}
                </strong>
                <strong>{data?.reference}</strong>
              </div>
              {/* SIBJECT DIV */}
              <div className={styles.marginBot}>
                <strong>
                  <FormattedLabel id="subject" /> :{" "}
                </strong>
                <strong>{data?.subject}</strong>
              </div>
              {/* SIBJECT_SUMMARY DIV */}
              <div className={styles.marginBot}>
                <strong>
                  <FormattedLabel id="subjectSummary" /> :{" "}
                </strong>
                <span>
                  {data?.subjectSummary
                    ? ReactHtmlParser(data?.subjectSummary)
                    : ""}
                </span>
              </div>
              {/* SIBJECT_DETAILS DIV */}
              <div className={styles.marginBot}>
                <strong>
                  <FormattedLabel id="subjectDetails" /> :{" "}
                </strong>
                <span>
                  {data?.subjectDetails
                    ? ReactHtmlParser(data?.subjectDetails)
                    : ""}
                </span>
              </div>
              {/* DIV FOR DROPDOWNS */}
              <div className={styles.flexSpaceBetween}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography>
                      <strong>
                        <FormattedLabel id="selectCommittees" /> :{" "}
                      </strong>
                      <strong>
                        {language == "en"
                          ? data?.committeeName
                          : data?.committeeNameMr}
                      </strong>
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography>
                      <strong>
                        <FormattedLabel id="financialYear" /> :{" "}
                      </strong>
                      <strong>
                        {language == "en"
                          ? data?.financialYearEn
                          : data?.financialYearMr}
                      </strong>
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography>
                      <strong>
                        <FormattedLabel id="docketType" /> :{" "}
                      </strong>
                      {docketType?.length !== 0 &&
                        docketType?.map((o) => (
                          <strong>
                            {language == "en" ? o.docketTypeEn : o.docketTypeMr}
                          </strong>
                        ))}
                    </Typography>
                  </Grid>

                  {data?.budgetHead !== null && (
                    <Grid item xs={4}>
                      <Typography>
                        <strong>
                          <FormattedLabel id="budgetHead" /> :{" "}
                        </strong>
                        <strong>{data?.budgetHead}</strong>
                      </Typography>
                    </Grid>
                  )}

                  <Grid item xs={4}>
                    <Typography>
                      <strong>
                        <FormattedLabel id="amount" /> :{" "}
                      </strong>
                      <strong>{data?.amount}</strong>
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography>
                      <strong>
                        <FormattedLabel id="outwardNo" /> :{" "}
                      </strong>
                      <strong>{data?.outwardNumber}</strong>
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography>
                      <strong>
                        <FormattedLabel id="approverName" /> :{" "}
                      </strong>
                      <strong>{data?.nameOfApprover}</strong>
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography>
                      <strong>
                        <FormattedLabel id="approverDepartment" /> :{" "}
                      </strong>
                      <strong>{data?.toDepartment}</strong>
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography>
                      <strong>
                        <FormattedLabel id="approverDesignation" /> :{" "}
                      </strong>
                      <strong>{data?.toDesignation}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </div>
      </Paper>
    </div>
  )
}

export default OriginalDocketPrintComponent
