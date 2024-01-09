import { ClearOutlined, SearchOutlined } from "@mui/icons-material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Divider,
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
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import urls from "../../../../URLS/urls";
import LegalCaseLabels from "../../../../containers/reuseableComponents/labels/modules/lcLabels";
import NewReportLayout from "../../../../pages/LegalCase/FileUpload/NewReportLayout";
import styles from "../../../../styles/LegalCase_Styles/courtWiseReport.module.css";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const language = useSelector((state) => state?.labels?.language);
  const [passCourtNames, setPassCourtNames] = useState([]);
  const [selectCourtNames, setSelectCourtNames] = useState([]);
  const [courtNameToBePrinted, setcourtNameToBePrinted] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [courts, setCourts] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);
  const [yearNames, setYearNames] = useState([]);
  const [labels, setLabels] = useState(LegalCaseLabels[language ?? "en"]);

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
    const selectedIds = value?.map((val) => val?.id);
    setPassCourtNames(selectedIds);
    setSelectCourtNames(value);
  };

  const handleClear = () => {
    setValue("toDate", null);
    setSelectCourtNames([]);
    setPassCourtNames([]);
    setShowTable(false);
  };

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
  const getAllDepartNames = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("department", r);
        setDepartmentNames(
          r?.data?.department?.map((row) => ({
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };
  const getAllYears = () => {
    axios
      .get(`${urls.CFCURL}/master/year/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("department", r);
        setYearNames(
          r?.data?.year?.map((row) => ({
            id: row.id,
            year: row.year,
            yearMr: row.yearMr,
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
    getAllDepartNames();
    getAllYears();
  }, []);

  //for on the search button
  const searchButton = async () => {
    // print courtName

    try {
      let tempCourtNamesToBePrinted = [];
      let printNames = {};
      passCourtNames.forEach((element) => {
        courts.forEach((court) => {
          if (court.id == element) {
            tempCourtNamesToBePrinted.push({
              courtName: court?.courtName,
              courtMr: court?.courtMr,
            });
          }
        });
      });
      let _a = tempCourtNamesToBePrinted
        ?.map((obj) => obj?.courtName)
        ?.join(", ");
      let _b = tempCourtNamesToBePrinted
        ?.map((obj) => obj?.courtMr)
        ?.join(", ");
      printNames = { courtName: _a ?? "", courtMr: _b ?? "" };
      // if passAdvocateName is empty, then push ALL to tempAdvocateNamesToBePrinted
      if (passCourtNames.length == 0) {
        printNames = { courtName: "All", courtMr: "सर्व" };
      }
      setcourtNameToBePrinted(printNames);
      // console.log("printNames", printNames);
    } catch (e) {
      console.log("error", e);
    }
    let _body = {
      courtId: passCourtNames,
      fromDate: fromDate,
      toDate: toDate,
    };

    console.log("_body", _body);
    try {
      axios
        .post(`${urls.LCMSURL}/vakalatnama/getReportParawise`, _body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          if (r?.status == 200 || r?.status == 201) {
            let _res = r?.data?.reportParawiseRequest?.map((da, i) => {
              let caseYr = yearNames?.find((obj) => obj?.id == da?.year)?.year;
              let _dptName = da?.trnParawiseListDao?.map((obj) => ({
                nameEn: departmentNames?.find((d) => d?.id == obj?.departmentId)
                  ?.department,
                nameMr: departmentNames?.find((d) => d?.id == obj?.departmentId)
                  ?.departmentMr,
              }));
              let _a = _dptName?.map((obj) => obj?.nameEn)?.join(", ");
              let _b = _dptName?.map((obj) => obj?.nameMr)?.join(", ");
              return {
                srNo: i + 1,
                caseNoYear: `${da?.caseNumber}/${caseYr ?? "-"}`,
                filedBy: da?.filedBy ?? "-",
                deptNameEn: _a ?? "-",
                deptNameMr: _b ?? "-",
                paraReqDate:
                  moment(da?.parawiseCreatedDate)?.format("DD-MM-YYYY") ?? "-",
              };
            });
            setDataSource(_res ?? []);
            setShowTable(true);
          }
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
  // console.log("dataSource", dataSource);

  const componentRef = useRef(null);

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
              {/* Court Wise Parawise Pending Reports */}
              {labels?.courtWisePara}
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
                          disableFuture
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
                {/* Court Name by Using Autocomplete */}
                <Autocomplete
                  multiple
                  value={selectCourtNames}
                  id="checkboxes-tags-demo"
                  options={courts}
                  disableCloseOnSelect
                  onChange={handleSelect}
                  getOptionLabel={(option) =>
                    language === "en" ? option.courtName : option.courtMr
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {language === "en" ? option.courtName : option.courtMr}
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
                      label={labels.courtName}
                      placeholder="Court Name"
                      // size="small"
                      variant="outlined"
                      style={{
                        width: 340,

                        // overflowY: "auto",
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
                  <table className={styles.report_table}>
                    <thead>
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
                            {/* Court Name */}
                            {/* Advocate Name */}
                            <Grid item xl={3} lg={3}>
                              <Typography
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                {labels?.courtName} :-
                              </Typography>
                            </Grid>
                            <Grid item xl={7} lg={7}>
                              {language === "en"
                                ? this.props.courtNameToBePrinted?.courtName
                                : this.props.courtNameToBePrinted?.courtMr}
                            </Grid>
                            {/* From Date */}
                          </Grid>
                        </th>

                        {/* For To Date */}
                      </tr>
                      <tr>
                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.srNo}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels?.caseNoYear}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels?.partyBy}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels?.deptName}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels?.paraReqDate}</b>
                        </th>

                        {/* <th rowSpan={4} colSpan={1}>
                          <b>{labels.total} </b>
                        </th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {renderedData &&
                        renderedData.map((r, i) => (
                          <tr key={i}>
                            <td>{r.srNo}</td>
                            {/* <a href={r.courtIdHref}>
                              <td>
                                {language == "mr" ? r.courtNameMr : r.courtName}
                              </td>
                            </a> */}
                            <td>{r.caseNoYear}</td>
                            <td>{r.filedBy}</td>
                            <td>
                              {language === "en" ? r.deptNameEn : r.deptNameMr}
                            </td>
                            <td>{r.paraReqDate}</td>
                            {/* <td>{r.totalCount}</td> */}
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
