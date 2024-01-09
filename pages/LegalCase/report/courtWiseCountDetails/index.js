import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import LegalCaseLabels from "../../../../containers/reuseableComponents/labels/modules/lcLabels";

import styles from "../../../../styles/LegalCase_Styles/courtWiseReport.module.css";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
// import NewReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import NewReportLayout from "../../../../pages/LegalCase/FileUpload/NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  // *****
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [advocates, setAdvocates] = useState([]);
  const [passCourtNames, setPassCourtNames] = useState([]);
  const [selectCourtNames, setSelectCourtNames] = useState([]);

  const [courtNameToBePrinted, setcourtNameToBePrinted] = useState([]);
  const [passCourtName, setCourtName] = useState([]);

  const [showTable, setShowTable] = useState(false);

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

  const handleSelect = (evt, value) => {
    console.log(":values", value);
    const selectedIds = value.map((val) => val.id);

    setPassCourtNames(selectedIds);
    setSelectCourtNames(value);
  };

  const handleClear = () => {
    setSelectCourtNames([]);
    setShowTable(false);
  };

  const getadvocate = () => {
    axios
      .get(`${urls.LCMSURL}/master/advocate/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("rersponse", r);
        setAdvocates(
          r.data.advocate.map((row) => ({
            id: row.id,
            name: `${row.firstName} ${row.lastName}`,
            nameMr: `${row.firstNameMr} ${row.lastNameMr}`,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getadvocate();
  }, []);

  // New HandleChange1
  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    console.log("checkbox values", event.target.value);
    setSelected1(event.target.value);

    // setSelectedID1(event.target.value.map((v) => advocates.find((o) => o.name === v).id));\

    setSelectedID1(
      event.target.value.map((v) => courts.find((o) => o.id === v).id)
    );

    console.log("setSelectedID1", selectedID1);
  };

  //
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");
  const [inputState, setInputState] = useState(false);
  const [error, setError] = useState(null);
  const language = useSelector((state) => state?.labels?.language);

  const [dataSource, setDataSource] = useState([]);
  const [courts, setCourts] = useState([]);
  const [selected1, setSelected1] = useState([]);
  const [selectedID1, setSelectedID1] = useState([]);
  const [selected, setSelected] = useState([]);

  const [selectedID, setSelectedID] = useState([]);
  const [labels, setLabels] = useState(LegalCaseLabels[language ?? "en"]);

  useEffect(() => {
    setLabels(LegalCaseLabels[language ?? "en"]);
  }, [setLabels, language]);

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
  const toDate = moment(watch("toDate")).format("YYYY-MM-DD");
  const courtId = watch("courtId");

  const getCourt = () => {
    axios
      .get(`${urls.LCMSURL}/master/court/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("getCourt", r);
        setCourts(
          r.data.court.map((row) => ({
            id: row.id,
            courtName: row.courtName,
            courtMr: row.courtMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };

  useEffect(() => {
    getCourt();
  }, []);

  //for on the search button
  const searchButton = async () => {
    // print courtName

    try {
      let tempCourtNamesToBePrinted = [];
      passCourtName.forEach((element) => {
        setCourts.forEach((court) => {
          if (court.id == element) {
            tempCourtNamesToBePrinted.push(court.name);
          }
        });
      });

      // if passAdvocateName is empty, then push ALL to tempAdvocateNamesToBePrinted
      if (passCourtName.length == 0) {
        tempCourtNamesToBePrinted.push("All");
      }

      setcourtNameToBePrinted(tempCourtNamesToBePrinted);
    } catch (e) {
      console.log("error", e);
    }

    // old code
    try {
      axios
        .get(
          `${urls.LCMSURL}/report/getCourtwiseCountReportV2?fromDate=${fromDate}&toDate=${toDate}&strCourtIds=${passCourtNames}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          console.log("searchButton", r);
          setDataSource(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              courtName: j.courtName,

              courtNameHref:
                "/LegalCase/report/caseEntryReport?courtName=" + j.courtName,

              // courtId
              courtIdHref:
                "/LegalCase/report/caseEntryReport?courtId=" + j.court,

              courtNameMr: j.courtNameMr,
              runningCount: j.runningCount,
              orderJudgementCount: j.orderJudgementCount,
              finalOrderCount: j.finalOrderCount,
              totalCount: j.totalCount,
            }))
          );
          setShowTable(true);
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    } catch (e) {
      setError(e.message);
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
              {labels.courtWiseCountDetails}
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
              <Grid item lg={3} md={4} sm={8} xs={12} display="flex">
                <FormControl fullWidth>
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              {labels.fromDate}
                            </span>
                          }
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
              </Grid>

              <Grid item lg={3} md={4} sm={8} xs={12} display="flex">
                <FormControl fullWidth size="small">
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={moment()}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          sx={{ marginLeft: 5, marginTop: 2, align: "center" }}
                          label={
                            <span style={{ fontSize: 16 }}>
                              {labels.toDate}
                            </span>
                          }
                          value={field.value}
                          minDate={moment(watch("fromDate")).add(1, "days")}
                          // onChange={(date) => field.onChange(date)}
                          onChange={(date) => {
                            if (date.isAfter(moment())) {
                              return; // Prevent selecting future dates
                            }
                            field.onChange(date);
                          }}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // size="small"
                              //fullWidth
                            />
                          )}
                          disableFuture
                        />
                      </LocalizationProvider>
                    )}
                  />
                </FormControl>
              </Grid>

              {/* New Grid */}
              <Grid item lg={3} md={4} sm={8} xs={12} display="flex">
                {/* New Exp */}
                {/* <FormControl fullWidth variant="outlined"
                 
                   >
                  <InputLabel id="demo-simple-select-standard-label">{labels.courtName}</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        multiple
                        disabled={inputState}
                        sx={{ width: 200 }}
                        value={selected1}
                        

                        onChange={handleChange1}
                        label="AdvocateName"

                        renderValue={(selected1) => selected1.join(", ")}

                      >
                       
                        {courts &&
                        
                          courts.map((court, index) => (
                            
                            <MenuItem 
                            key={court} 
                            value={court.id}>
                              <Checkbox checked={selected1?.indexOf(court.id) > -1} />
                              
                              <ListItemText
                                primary={
                                  

                                  language === "en" ? court?.courtName : court?.courtMr

                
                                }
                              />

                              
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="courtId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.courtId ? errors.courtId.message : null}</FormHelperText>
                </FormControl> */}

                {/* Court Name by Using Autocomplete */}

                <Autocomplete
                  multiple
                  value={selectCourtNames}
                  id="checkboxes-tags-demo"
                  options={courts}
                  disableCloseOnSelect
                  onChange={handleSelect}
                  getOptionLabel={(option) => option.courtName}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.courtName}
                    </li>
                  )}
                  // style={{ width: 500,
                  //   // width: "50%",
                  //   background:"red"
                  //  }}
                  renderInput={(params) => (
                    <TextField
                      size="small"
                      {...params}
                      label="Court Name"
                      placeholder="Court Name"
                      // size="small"
                      variant="outlined"
                      style={{
                        width: 340,

                        overflowY: "auto",
                        maxHeight: "270px",
                      }}
                      // size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Grid
              container
              direction="row"
              display="flex"
              spacing={4}
              gap={2}
              justifyContent="center"
              paddingTop={1}
              sx={{ marginTop: 3 }}
            >
              <Button
                variant="contained"
                // disabled={loading || !isValid}
                style={{
                  backgroundColor: "#008CBA",
                  color: "white",
                }}
                startIcon={<SearchOutlined />}
                onClick={searchButton}
              >
                {labels.search}
              </Button>
              <Button
                // disabled={loading}
                variant="contained"
                color="warning"
                startIcon={<ClearOutlined />}
                onClick={() => {
                  reset();
                  handleClear();

                  setDataSource([]);
                }}
              >
                {labels.clear}
              </Button>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#008CBA",
                  color: "white",
                }}
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
        </form>
      </Grid>
      <Divider />
      {showTable && (
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
          }}
        >
          <ComponentToPrint
            ref={componentRef}
            dataToMap={dataSource}
            labels={labels}
            language={language}
            fromDate={moment(watch("fromDate")).format("DD-MM-YYYY")}
            toDate={moment(watch("toDate")).format("DD-MM-YYYY")}
            courtId={courtId}
            courtNameToBePrinted={courtNameToBePrinted}
          />
        </NewReportLayout>
      )}
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
    </Paper>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    const renderedData = this.props.dataToMap;
    const labels = this.props.labels;
    const language = this.props.language;
    console.log("language", language);
    console.log("renderedData", renderedData);
    return (
      <>
        {renderedData && (
          <div style={{ padding: "13px" }}>
            <div className="report">
              {renderedData?.length == 0 ? (
                <h4 style={{ textAlign: "center" }}>{labels.noData}</h4>
              ) : (
                <Card style={{ width: "100%" }}>
                  {/* <Grid container sx={{ padding: "10px" }}> */}
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
                  {/* <Grid
                    item
                    xs={6}
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
                    > */}
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
                  {/* <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 25,
                      fontWeight: "bold",
                      m: 1,
                    }}
                  >
                    {labels.courtWiseCountDetails}
                  </Box> */}
                  {/* </Typography>
                  </Grid> */}
                  {/* </Grid> */}
                  {/* <Divider /> */}

                  <table className={styles.report_table}>
                    <thead>
                      {/* <tr>
                        <th colSpan={14}>
                          <h3>
                            <b>{labels.courtWiseCountDetails}</b>
                          </h3>
                        </th>
                      </tr> */}

                      {/* From Date and To Date for Print */}
                      <tr>
                        <th colSpan={15}>
                          <Grid
                            container
                            style={{
                              height: "40px",
                              marginTop: "12px",
                            }}
                          >
                            {/* <Grid item lg={1}></Grid> */}
                            {/* <Grid item lg={2}>
                              <Typography
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                From Date:{this.props.fromDate}
                              </Typography>
                            </Grid> */}
                            {/* <Grid item lg={1.5}></Grid>
                            <Grid item lg={3}>
                              <Typography
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                To Date:{this.props.toDate}
                              </Typography>
                            </Grid> */}

                            {/* Court Name */}
                            {/* Advocate Name */}
                            <Grid item xl={3} lg={3}>
                              <Typography
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                Court Names:
                              </Typography>
                            </Grid>
                            <Grid item xl={7} lg={7}>
                              {this.props.courtNameToBePrinted}
                            </Grid>
                            {/* From Date */}
                          </Grid>
                          {/* <h3>
                            From Date={this.props.fromDate}
                            To Date={this.props.toDate}

                          </h3> */}
                        </th>

                        {/* For To Date */}
                      </tr>
                      <tr>
                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.srNo}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.courtName}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.runningCases}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.forOrderNJudg}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.finalOrder}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.total} </b>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderedData &&
                        renderedData.map((r, i) => (
                          <tr key={i}>
                            <td>{r.srNo}</td>
                            <a href={r.courtIdHref}>
                              <td>
                                {language == "mr" ? r.courtNameMr : r.courtName}
                              </td>
                            </a>
                            <td>{r.runningCount}</td>
                            <td>{r.orderJudgementCount}</td>
                            <td>{r.finalOrderCount}</td>
                            <td>{r.totalCount}</td>
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
