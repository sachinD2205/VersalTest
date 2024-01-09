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
import LegalCaseLabels from "../../../../containers/reuseableComponents/labels/modules/lcLabels";
import urls from "../../../../URLS/urls";

import styles from "../../../../styles/LegalCase_Styles/courtWiseReport.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { catchExceptionHandlingMethod } from "../../../../util/util";

// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
// import NewReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import NewReportLayout from "../../../../pages/LegalCase/FileUpload/NewReportLayout";
const Index = () => {
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");
  const [inputState, setInputState] = useState(false);
  const [error, setError] = useState(null);
  const language = useSelector((state) => state?.labels?.language);

  const [dataSource, setDataSource] = useState([]);
  const [department, setDepartmentName] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [departmentNames, setDepartmentNames] = useState([]);

  const [passDepartment, setPassDepartment] = useState([]);

  const [selectDepartments, setSelectDepartments] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const token = useSelector((state) => state.user.user.token);

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
  const deptID = watch("department");

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

  const getdepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("response", r);
        setDepartmentName(
          r.data.department.map((row) => ({
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

  const handleSelect = (evt, value) => {
    console.log(":values", value);
    const selectedIds = value.map((val) => val.id);
    // setSelectedValuesOfDepartments(selectedIds)
    setDepartmentIds(selectedIds);
    setDepartmentNames(
      selectedIds.map((x) => department.find((rr) => rr.id == x).department)
    );
    setSelectDepartments(value);
  };

  useEffect(() => {
    getdepartment();
  }, []);

  //for on the search button
  const searchButton = async () => {
    let temp = {
      fromDate,
      toDate,
    };

    let payload =
      departmentIds.length > 0
        ? { ...temp, departmentIds: departmentIds }
        : { ...temp };
    console.log("payload", payload);

    let urll;
    if (departmentIds?.length > 0) {
      urll = `${urls.LCMSURL}/report/getDepartmentwiseCountReportV1?fromDate=${fromDate}&toDate=${toDate}&departmentIds=${departmentIds}`;
    } else {
      urll = `${urls.LCMSURL}/report/getDepartmentwiseCountReportV1?fromDate=${fromDate}&toDate=${toDate}`;
    }

    axios
      .get(urll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("searchButton", r);
        setDataSource(
          r.data.map((j, i) => ({
            id: j.id,
            srNo: i + 1,
            deptName: j.deptName,
            deptNameMr: j.deptNameMr,
            deptRunningCount: j.deptRunningCount,
            deptFinalCount: j.deptFinalCount,
            deptOrderJudgementCount: j.deptOrderJudgementCount,
            deptTotalCount: j.deptTotalCount,
          }))
        );
        setShowTable(true);
      })
      // .catch((err) => {
      //   sweetAlert(
      //     "Error",
      //     err?.message ? err?.message : "Something Went Wrong",
      //     "error"
      //   );
      //   console.log("Errfirst", err);
      // });
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  };
  console.log("dataSource", dataSource);

  const componentRef = useRef(null);

  console.log("componentRef", componentRef);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "new document",
  });

  const handleClear = () => {
    setSelectDepartments([]);
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
              {labels.deptWiseCountDetails}
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

              {/* <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={!!errors.advocate}
                >
                  <InputLabel id="demo-simple-select-standard-label">
                    {labels.deptName}
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        disabled={inputState}
                        sx={{ width: 200 }}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        label={labels.deptName}
                      >
                        {department &&
                          department.map((department, index) => (
                            <MenuItem key={index} value={department.id}>
                              {language == "en"
                                ? department?.department
                                : department?.departmentMr}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="department"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>
                    {errors?.department ? errors.department.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid> */}

              {/* Autocomplete */}
              <Grid item lg={2} md={3} sm={6} xs={12} display="flex">
                <Autocomplete
                  multiple
                  value={selectDepartments}
                  id="checkboxes-tags-demo"
                  options={department}
                  disableCloseOnSelect
                  onChange={handleSelect}
                  getOptionLabel={(option) => option.department}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {option.department}
                    </li>
                  )}
                  style={{ width: 500 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department Name"
                      placeholder="Department Name"
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
                  setDepartmentIds([]);
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
          centerHeader
          centerData
          columnLength={5}
          showDates
          date={{
            from: moment(watch("fromDate")).format("DD-MM-YYYY"),
            to: moment(watch("toDate")).format("DD-MM-YYYY"),
          }}
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
            departmentIds={departmentNames}
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
    console.log("language", renderedData);
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
                          {labels.deptWiseCountDetails}
                        </Box>
                      </Typography>
                    </Grid> */}
                  </Grid>
                  {/* <Row>
                <Button>Pr
                int</Button>
              </Row> */}

                  <table className={styles.report_table}>
                    <thead>
                      <tr>
                        <th colSpan={14}>
                          <h3>
                            <b> {labels.deptWiseCountDetails}</b>
                          </h3>
                        </th>
                      </tr>

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
                            {/* <Grid item lg={1.5}></Grid> */}
                            {/* <Grid item lg={3}>
                              <Typography
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                To Date:{this.props.toDate}
                              </Typography>
                            </Grid> */}

                            {/* Department Name  */}
                            <Grid item lg={4}>
                              <Typography
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                              >
                                Department Name:
                              </Typography>
                            </Grid>

                            <Grid item>{this.props.departmentIds}</Grid>
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
                          <b>{labels.deptName}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.runningCases}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.finalOrder}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.forOrderNJudg}</b>
                        </th>

                        <th rowSpan={4} colSpan={1}>
                          <b>{labels.total} </b>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this?.props?.dataToMap &&
                        this.props.dataToMap.map((r, i) => (
                          <tr key={i}>
                            <td>{r.srNo}</td>
                            {/* <td>{r.deptName}</td> */}
                            <td>
                              {language == "mr" ? r.deptNameMr : r.deptName}
                            </td>
                            <td>{r.deptRunningCount}</td>
                            <td>{r.deptFinalCount}</td>
                            <td>{r.deptOrderJudgementCount}</td>
                            <td>{r.deptTotalCount}</td>
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
