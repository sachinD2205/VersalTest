import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import moment from "moment";
import React, { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import LegalCaseLabels from "../../../../containers/reuseableComponents/labels/modules/lcLabels";

import styles from "../../../../styles/LegalCase_Styles/courtWiseReport.module.css";

// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
// import NewReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import NewReportLayout from "../../../../pages/LegalCase/FileUpload/NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");
  const [inputState, setInputState] = useState(false);
  const [error, setError] = useState(null);
  const language = useSelector((state) => state?.labels?.language);
  const [labels, setLabels] = useState(LegalCaseLabels[language ?? "en"]);
  useEffect(() => {
    setLabels(LegalCaseLabels[language ?? "en"]);
  }, [setLabels, language]);

  const [dataSource, setDataSource] = useState([]);

  const {
    watch,
    control,
    trigger,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });

  const fromDate = moment(watch("fromDate")).format("YYYY-MM-DD");
  const token = useSelector((state) => state.user.user.token);
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
  useEffect(() => {
    searchButton();
  }, []);

  //for on the search button
  const searchButton = async () => {
    try {
      axios
        .get(
          `${urls.LCMSURL}/report/getDailyCauseListReport?currentDate=${fromDate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          setDataSource(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              caseNumber: j.caseNumber,
              fillingDate: j.fillingDate,
              filedBy: j.filedBy,
              // hearingDate: j.hearingDate,
              // moment(watch("fromDate")).format("YYYY-MM-DD")
              hearingDate: moment(j.hearingDate).format("DD-MM-YYYY"),

              filedAgainst1: j.filedAgainst1,
              advocateName1: j.advocateName1,
              caseStage: j.caseStage,
              caseStatus: j.caseStatus,
            }))
          );
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } catch (err) {
      //  catch (e) {
      //   setError(e.message);
      // }
      console.log("err", err);
      callCatchMethod(err, language);
    } finally {
      setLoading(false);
    }
  };
  console.log("dataSource", dataSource);

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });
  return (
    <Paper
      variant="outlined"
      sx={{
        border: 1,
        borderColor: "grey.500",
        marginLeft: "10px",
        marginRight: "10px",
        padding: 1,
      }}
    >
      <Grid container gap={4} direction="column">
        <Grid
          container
          display="flex"
          justifyContent="center"
          justifyItems="center"
          // padding={2}
          // sx={{
          //   background:
          //     "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
          // }}

          style={{
            // backgroundColor: "#0084ff",
            backgroundColor: "#556CD6",
            // backgroundColor: "#1C39BB",

            // #00308F
            color: "white",
            fontSize: 15,
            // marginTop: 30,
            // marginBottom: "50px",
            // // marginTop: ,
            // padding: 8,
            // paddingLeft: 30,
            // marginLeft: "50px",
            // marginRight: "75px",
            borderRadius: 100,
            height: "8vh",
          }}
        >
          <Grid item>
            <h2 style={{ marginBottom: 0, marginTop: "1vh", color: "white" }}>
              {labels.dailyCauseList}
            </h2>
          </Grid>
        </Grid>
        <form>
          <Grid container display="flex" direction="column" gap={2}>
            <Grid
              container
              direction="row"
              display="flex"
              spacing={4}
              justifyContent="center"
            >
              {/* Remove Datepicker as per BA'S Observations  */}
              {/* <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl fullWidth>
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="YYYY/MM/DD"
                          label={<span style={{ fontSize: 16 }}>{labels.selectDate}</span>}
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </FormControl>
              </Grid> */}
            </Grid>
            <Grid
              container
              direction="row"
              display="flex"
              spacing={4}
              gap={2}
              justifyContent="center"
              // paddingTop={4}
            >
              <Grid item xl={10} lg={10}></Grid>
              <Grid item>
                <Button
                  // style={{
                  //   float: "right",
                  // }}
                  variant="contained"
                  disabled={loading || !isValid}
                  onClick={() => {
                    handlePrint();
                    // setIsReady("none");
                  }}
                >
                  {labels.printReport}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Grid>

      <Snackbar
        open={error?.length > 0}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={() => setError(null)}
      >
        <Alert
          severity="error"
          sx={{ width: "100%" }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      </Snackbar>

      <NewReportLayout
        componentRef={componentRef}
        centerHeader
        centerData
        // rows={table}
        // columns={columnsPetLicense}
        columnLength={5}
        showDates
        date={{
          from: moment(watch("fromDate")).format("DD-MM-YYYY"),
          to: moment(watch("toDate")).format("DD-MM-YYYY"),
        }}
        // From Date :{this.props.fromDate}
        style={{
          display: "flex",
          justifyContent: "center",
          // padding: "10%",
          // align: "center",
          // marginLeft: "80px",
        }}
      >
        <ComponentToPrint
          ref={componentRef}
          dataToMap={dataSource}
          labels={labels}
          language={language}
        />
      </NewReportLayout>
    </Paper>
  );
};
class ComponentToPrint extends React.Component {
  render() {
    const renderedData = this.props.dataToMap;
    const labels = this.props.labels;
    const language = this.props.language;

    return (
      <>
        {renderedData && (
          <div style={{ padding: "13px" }}>
            <div className="report">
              {renderedData?.length == 0 ? (
                <h4 style={{ textAlign: "center" }}>{labels.noData}</h4>
              ) : (
                <Card style={{ width: "100%" }}>
                  <Grid container sx={{ padding: "10px" }}>
                    {/* <Grid
                      item
                      xs={3}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src="/logo.png"
                        alt=""
                        height="100vh"
                        width="100vw"
                      />
                    </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        component="div"
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {/* <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            fontWeight: "regular",
                            m: 1,
                          }}
                        >
                          पिंपरी चिंचवड महानगरपालिका , पिंपरी- ४११ ०१८
                        </Box> */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 25,
                            fontWeight: "bold",
                            m: 1,
                          }}
                        >
                          {labels.dailyCauseList}
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid>
                  <table className={styles.report_table}>
                    <thead>
                      <tr>
                        <th colSpan={14}>
                          <h3>
                            <b>{labels.dailyCauseList}</b>
                          </h3>
                        </th>
                      </tr>
                      <tr>
                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.srNo}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.caseNo}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.prevHearingDate}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.caseNoFiledBy}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.filedAgainst}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.advocate}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.caseStage}</b>
                        </th>
                        {/* <th rowSpan={4} colSpan={1}>
                          <b>{labels.caseStatus}</b>
                        </th> */}
                      </tr>
                    </thead>

                    <tbody>
                      {renderedData &&
                        renderedData.map((r, i) => (
                          <tr key={i}>
                            <td>{r.srNo}</td>
                            <td>{r.caseNumber}</td>
                            <td>{r.hearingDate}</td>
                            <td>{r.filedBy}</td>
                            <td>{r.filedAgainst1}</td>
                            <td>{r.advocateName1}</td>
                            <td>{r.caseStage}</td>
                            {/* <td>{r.caseStatus}</td> */}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </Card>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}
export default Index;
