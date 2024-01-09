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
import React, { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import LegalCaseLabels from "../../../../containers/reuseableComponents/labels/modules/lcLabels";

import styles from "../../../../styles/LegalCase_Styles/multipleAdvocateReport.module.css";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
// import NewReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import NewReportLayout from "../../../../pages/LegalCase/FileUpload/NewReportLayout";

const Index = () => {
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  );

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");
  const [inputState, setInputState] = useState(false);
  const [error, setError] = useState(null);
  const language = useSelector((state) => state?.labels?.language);

  const [dataSource, setDataSource] = useState([]);

  const [selected1, setSelected1] = useState([]);
  const [selectedID1, setSelectedID1] = useState([]);
  const [selected, setSelected] = useState([]);

  const [advocates, setAdvocates] = useState([]);

  const [route, setRoute] = useState(null);

  const [selectedID, setSelectedID] = useState([]);
  const [labels, setLabels] = useState(LegalCaseLabels[language ?? "en"]);

  const [passAdvocateNames, setAdvocateNamses] = useState([]);
  const [selectAdvocateName, setSelectAdvocateName] = useState([]);

  const [advocateNamesToBePrinted, setAdvocateNamesToBePrinted] = useState([]);
  const [passAdvocateName, setPassAdvocateName] = useState([]);

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
  useEffect(() => {
    console.log("selected menu", menu);

    setRoute("courtName");

    // console.log("selected menu",menus?.find((m)=>m?.id==selectedMenu));
  }, [menu, selectedMenu]);

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
  useEffect(() => {
    getadvocate();
  }, []);

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

  const handleSelect = (evt, value) => {
    console.log(":values", value);

    const selectedIds = value.map((val) => val.id);

    setAdvocateNamses(selectedIds);

    // selectAdvocateName(value)
    setSelectAdvocateName(value);
    setPassAdvocateName(selectedIds);
  };

  //for on the search button
  const searchButton = async () => {
    // code for print advocate name
    try {
      let tempAdvocateNamesToBePrinted = [];
      passAdvocateName.forEach((element) => {
        advocates.forEach((adv) => {
          if (adv.id == element) {
            tempAdvocateNamesToBePrinted.push(adv.name);
          }
        });
      });

      // if passAdvocateName is empty, then push ALL to tempAdvocateNamesToBePrinted
      if (passAdvocateName.length == 0) {
        tempAdvocateNamesToBePrinted.push("All");
      }

      setAdvocateNamesToBePrinted(tempAdvocateNamesToBePrinted);
    } catch (e) {
      console.log("error", e);
    }

    // old code
    try {
      axios
        .get(
          `${urls.LCMSURL}/report/getAdvBillTrackingReport?fromDate=${fromDate}&toDate=${toDate}&advIds=${passAdvocateNames}`,
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
              srNo: i + 1,
              id: j?.id,
              caseNumbers: j?.caseNumbers,
              caseNoYear: j?.caseNoYear,

              caseNoYearHref:
                "/LegalCase/report/caseEntryReport?caseNumbers=" +
                j?.caseNumbers +
                "courtName=" +
                j?.courtName +
                "deptName1=" +
                j?.deptName1,

              courtName: j?.courtName,

              courtNameMr1: j?.courtNameMr1,

              deptName1: j?.deptName1,
              deptName1Href:
                "/LegalCase/report/caseEntryReport?deptName1=" + j?.deptName1,

              departmentNameMr1: j?.departmentNameMr1,
              AdvName1: j?.AdvName1,
              advNameMr1: j?.advNameMr1,
              paidAmountDate: j?.paidAmountDate,
              paidAmount: j?.paidAmount,

              advName: j?.advName,
              advNameMr: j?.advNameMr,

              paymentDateForReport: j?.paymentDateForReport,
            }))
          );
          setShowTable(true);
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

  // New HandleChange1
  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    console.log("checkbox values", event.target.value);
    setSelected1(event.target.value);

    console.log("advocates", advocates);

    // setSelectedID1(event.target.value.map((v) => advocates.find((o) => o.name === v).id));\

    // set the advocate  name ?

    setSelectedID1(
      event.target.value.map((v) => advocates.find((o) => o.id === v).id)
    );

    console.log("setSelectedID1", selectedID1);
  };

  const handleClear = () => {
    // setSelectDepartments([])
    setSelectAdvocateName([]);
    setShowTable(false);
  };

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
              {labels.multipleAdvAndBillTracking}
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
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
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

              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl fullWidth>
                  <Controller
                    control={control}
                    name="toDate"
                    // defaultValue={null}
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

              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                {/* AdvocateName Name Autocomplete */}

                <Autocomplete
                  multiple
                  value={selectAdvocateName}
                  // value={selectDepartments}
                  id="checkboxes-tags-demo"
                  options={advocates}
                  disableCloseOnSelect
                  onChange={handleSelect}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.name}
                    </li>
                  )}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Advocate Name"
                      placeholder="Advocate Name"
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
              paddingTop={4}
            >
              <Button
                variant="contained"
                // disabled={loading || !isValid}
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
          // rows={table}
          // columns={columnsPetLicense}
          columnLength={5}
          showDates
          date={{
            from: moment(watch("fromDate")).format("DD-MM-YYYY"),
            to: moment(watch("toDate")).format("DD-MM-YYYY"),
          }}
          style={
            {
              // background: "blue",
              // width: "800px",
              // justifyContent: "center",
              // padding: "10%",
              // align: "center",
              // marginLeft: "80px",
            }
          }
          // From Date :{this.props.fromDate}
        >
          <ComponentToPrint
            ref={componentRef}
            dataToMap={dataSource}
            labels={labels}
            language={language}
            // fromDate={fromDate}
            fromDate={moment(watch("fromDate")).format("DD-MM-YYYY")}
            // toDate={toDate}
            toDate={moment(watch("toDate")).format("DD-MM-YYYY")}
            advocateNamesToBePrinted={advocateNamesToBePrinted}

            // name={advocate}
          />
        </NewReportLayout>
      )}
      {/* <Snackbar
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
      </Snackbar> */}
    </Paper>
  );
};

class ComponentToPrint extends React.Component {
  render() {
    const renderedData = this.props.dataToMap;
    const labels = this.props.labels;
    const language = this.props.language;
    console.log("renderedData", renderedData);
    return (
      <>
        {renderedData && (
          <div style={{ padding: "1px" }}>
            <div className="report">
              {renderedData?.length == 0 ? (
                <h4 style={{ textAlign: "center" }}>{labels.noData}</h4>
              ) : (
                <Card>
                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid
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
                    </Grid>
                    <Grid
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
                      >
                        <Box
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
                        </Box>
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
                          {labels.multipleAdvAndBillTracking}
                        </Box>
                      </Typography>
                    </Grid>
                  </Grid> */}
                  {/* <Row>
                <Button>Print</Button>
              </Row> */}

                  {/* <Grid container>
                    <Grid item>
                    From Date={this.props.fromDate},


                    </Grid>
                  </Grid> */}

                  <table className={styles.report_table}>
                    <thead>
                      {/* for Filter display */}
                      <tr>
                        <th colSpan={14}>
                          <h3>
                            <b>{labels.multipleAdvAndBillTracking}</b>
                          </h3>
                        </th>
                      </tr>

                      {/* From Date and To Date for Print */}
                      <tr>
                        <th colSpan={15}>
                          <Grid
                            container
                            style={{
                              height: "80px",
                              marginTop: "12px",
                            }}
                          >
                            <Grid item xl={3} lg={3}>
                              <Typography
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "bold",
                                }}
                              >
                                Advocate Names:
                              </Typography>
                            </Grid>
                            {/* Advocate Name */}
                            <Grid item lg={8}>
                              <Typography
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  textAlign: "left",
                                }}
                              >
                                {/* Advocate Names: */}
                                {this.props.advocateNamesToBePrinted.join(",")}
                              </Typography>
                            </Grid>
                          </Grid>

                          {/* <h3>
                            From Date={this.props.fromDate}
                            To Date={this.props.toDate}

                          </h3> */}
                        </th>

                        {/* For To Date */}
                      </tr>

                      <tr className={styles.report_table_tr}>
                        <th>
                          <b>{labels.srNo}</b>
                        </th>

                        <th>
                          <b>{labels.caseNo}</b>
                        </th>

                        <th>
                          <b>{labels.courtName}</b>
                        </th>

                        {/* <th>
                          <b>{labels.deptName}</b>
                        </th> */}

                        <th>
                          <b>{labels.advocateName}</b>
                        </th>

                        {/* <th>
                          <b>{labels.paymentDate}</b>
                        </th> */}
                        <th>
                          <b>{labels.paidAmount}</b>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderedData &&
                        renderedData.map((r, i) => (
                          <tr key={i}>
                            <td>{r.srNo}</td>
                            {/* <a > */}
                            <td>{r.caseNoYear}</td>
                            {/* </a> */}
                            <td>
                              {language == "mr" ? r.courtNameMr1 : r.courtName}
                            </td>

                            {/* <td>
                              {language == "mr"
                                ? r.departmentNameMr1
                                : r.deptName1}
                            </td> */}

                            <td>
                              {language == "mr" ? r.advName1 : r.AdvName1}
                            </td>

                            {/* <td>{r.paymentDateForReport}</td> */}

                            <td>{r.paidAmount}</td>
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
