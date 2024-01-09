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
  ListItemIcon,
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
import {
  MenuProps,
  useStyles,
} from "../../../../containers/utils/UserRoleRightUtils";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
// import NewReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";

import NewReportLayout from "../../../../pages/LegalCase/FileUpload/NewReportLayout";
const Index = () => {
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");
  const [inputState, setInputState] = useState(false);
  const [error, setError] = useState(null);
  const language = useSelector((state) => state?.labels?.language);

  const [dataSource, setDataSource] = useState([]);
  const [advocates, setAdvocates] = useState([]);

  const [passDepartment, setPassDepartment] = useState([]);

  const classes = useStyles();
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const [passAdvocateName, setPassAdvocateName] = useState([]);
  const [advocateNamesToBePrinted, setAdvocateNamesToBePrinted] = useState([]);

  const [showTable, setShowTable] = useState(false);

  const token = useSelector((state) => state.user.user.token);

  const [labels, setLabels] = useState(LegalCaseLabels[language ?? "en"]);
  useEffect(() => {
    setLabels(LegalCaseLabels[language ?? "en"]);
  }, [setLabels, language]);

  const [selectAdvocateName, setSelectAdvocateName] = useState([]);

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
  const advId = watch("advId");

  const [selected1, setSelected1] = useState([]);
  const [selectedID1, setSelectedID1] = useState([]);
  const [selected, setSelected] = useState([]);

  const [selectedID, setSelectedID] = useState([]);

  const checkIsAllSelected = (val) => {
    const _selected = [...advocates];
    let selectedIndex = _selected.findIndex((txt) => {
      return;
      // return txt.department === val.id;
    });
    if (selectedIndex > -1)
      return _selected[selectedIndex].advocates.length === setAdvocates.length;

    return false;
  };

  const checkIsIntermediate = (val) => {
    const _selected = [...advocates];
    let selectedIndex = _selected.findIndex((txt) => {
      // return txt.menuId === val.id;
      return;
    });

    if (selectedIndex > -1) {
      return _selected[selectedIndex].advocates.length != advocates.length;
    }

    return false;
  };

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

  //for on the search button
  const searchButton = async () => {
    console.log("setSelectedID133434", selectedID1);

    // Fill advocateNamesToBePrinted

    // Iterate through passAdvocateName - split, use Ids to get names from advocates
    // setAdvocateNamesToBePrinted
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

    try {
      axios
        .get(
          `${urls.LCMSURL}/report/getAdvocatewiseCountReportV3?fromDate=${fromDate}&toDate=${toDate}&strAdvocateIds=${passAdvocateName}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((r) => {
          console.log("Res", r);
          setDataSource(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              advName: j.advName,

              advNameHref:
                "/LegalCase/report/caseEntryReport?advName=" +
                j.advName +
                "advRunningCount=" +
                j.advRunningCount +
                "advOrderJudgementCount=" +
                j.advOrderJudgementCount +
                "advNameMr=" +
                j.advNameMr,

              advNameMr: j.advNameMr,
              advFinalCount: j.advFinalCount,
              advRunningCount: j.advRunningCount,
              advOrderJudgementCount: j.advOrderJudgementCount,
              advTotalCount: j.advTotalCount,
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

  const handleSelect = (evt, value) => {
    console.log(":values", value);
    const selectedIds = value.map((val) => val.id);

    // setSelectedValuesOfDepartments(selectedIds)
    // setPassDepartment(selectedIds)
    setPassAdvocateName(selectedIds);
    setSelectAdvocateName(value);
  };

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
      event.target.value.map((v) => advocates.find((o) => o.id === v)?.id)
    );

    console.log("setSelectedID1", selectedID1);
  };

  const handleClear = () => {
    setSelectAdvocateName([]);
    setShowTable(false);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        // border: "1px solid red",
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
              {labels.advWiseCountDetails}
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
                <FormControl size="small">
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
                          // onChange={
                          //   (date) => field.onChange(date)

                          // }

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
                {/* <FormControl fullWidth variant="outlined" error={!!errors.advocate}>
                  <InputLabel id="demo-simple-select-standard-label">{labels.advocateName}</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        multiple
                        disabled={inputState}
                        sx={{ width: 200 }}
                        value={selected1}
                        // onChange={(value) => {
                        //   field.onChange(value);
                        // }}

                        onChange={handleChange1}
                        label="AdvocateName"
                        renderValue={(selected1) => selected1.join(", ")}
                      >
                        <MenuItem
                          value="all"
                          // key={"mt_" + index}
                          key={advocates.id}
                          classes={{
                            // root: checkIsAllSelected(val)
                            root: checkIsAllSelected() ? classes.selectedAll : classes.container,
                          }}
                        >
                          <ListItemIcon>
                            <Checkbox
                              classes={{
                                indeterminate: classes.indeterminateColor,
                              }}
                              // checked={checkIsAllSelected(val)}
                              checked={checkIsAllSelected()}
                              // indeterminate={checkIsIntermediate(val)}
                              indeterminate={checkIsIntermediate()}
                            />
                          </ListItemIcon>
                          <ListItemText
                            classes={{
                              primary: classes.selectAllText,
                            }}
                            primary="Select All"
                          />
                        </MenuItem>

                        {advocates &&
                          advocates.map((adv, index) => (
                            <MenuItem key={adv} value={adv.id}>
                              <Checkbox checked={selected1?.indexOf(adv.id) > -1} />

                              <ListItemText primary={language === "en" ? adv?.name : adv?.name} />
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name="advId"
                    control={control}
                    defaultValue=""
                  />
                  <FormHelperText>{errors?.advId ? errors.advId.message : null}</FormHelperText>
                </FormControl> */}

                <Autocomplete
                  multiple
                  id="checkboxes-tags-demo"
                  value={selectAdvocateName}
                  // options={department}
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
      {/* <div style={{ marginLeft: "20%" }}> */}
      {showTable && (
        <NewReportLayout
          componentRef={componentRef}
          centerHeader
          centerData
          // rows={table}
          // columns={columnsPetLicense}
          columnLength={20}
          showDates
          date={{
            from: moment(watch("fromDate")).format("DD-MM-YYYY"),
            to: moment(watch("toDate")).format("DD-MM-YYYY"),
          }}
          // From Date :{this.props.fromDate}
          style={{
            // background: "blue",
            // width: "100%",
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
            fromDate={moment(watch("fromDate")).format("DD-MM-YYYY")}
            toDate={moment(watch("toDate")).format("DD-MM-YYYY")}
            advocateNamesToBePrinted={advocateNamesToBePrinted}
          />
        </NewReportLayout>
      )}

      {/* </div> */}

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
    return (
      <>
        {renderedData && (
          <div style={{ padding: "13px" }}>
            <div className="report">
              {renderedData?.length == 0 ? (
                <h4 style={{ textAlign: "center" }}>{labels.noData}</h4>
              ) : (
                <Card>
                  <table className={styles.report_table}>
                    <thead>
                      <tr>
                        <th colSpan={14}>
                          <h3>
                            <b>{labels.advWiseCountDetails}</b>
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

                            <Grid
                              item
                              style={{
                                textAlign: "left",
                              }}
                              xl={8}
                              lg={8}
                            >
                              {this.props.advocateNamesToBePrinted.join(", ")}
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
                          <b>{labels.advocateName}</b>
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
                      {this.props.dataToMap &&
                        this.props.dataToMap.map((r, i) => (
                          <tr key={i}>
                            <td>{r.srNo}</td>
                            {/* <td>{r.advName}</td> */}
                            {/* <a href={r.advNameHref}> */}
                            <td>
                              {language == "mr" ? r.advNameMr : r.advName}
                            </td>
                            {/* </a> */}
                            <td>{r.advRunningCount}</td>
                            <td>{r.advOrderJudgementCount}</td>
                            <td>{r.advFinalCount}</td>
                            <td>{r.advTotalCount}</td>
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
