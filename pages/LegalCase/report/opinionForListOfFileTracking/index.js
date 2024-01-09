import {
  ClearOutlined,
  SearchOutlined,
  ThirtyFpsRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
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
  Checkbox,
  ListItemIcon,
  ListItemText,
  Autocomplete,
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

import styles from "../../../../styles/LegalCase_Styles/opinion.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
// import { MenuProps, useStyles } from "../../../containers/utils/UserRoleRightUtils";
import {
  MenuProps,
  useStyles,
} from "../../../../containers/utils/UserRoleRightUtils";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

// import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
// import NewReportLayout from "../../../../containers/reuseableComponents/NewReportLayout";
import NewReportLayout from "../../../../pages/LegalCase/FileUpload/NewReportLayout";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const Index = () => {
  const token = useSelector((state) => state.user.user.token);

  const [value, settValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState("none");
  const [inputState, setInputState] = useState(false);
  const [error, setError] = useState(null);
  const language = useSelector((state) => state?.labels?.language);
  const [labels, setLabels] = useState(LegalCaseLabels[language ?? "en"]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState();

  const [selectedCaseStatus, setSelectedCaseStatus] = useState([]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [passDepartment, setPassDepartment] = useState([]);
  const [passCaseStatus, setPassCaseStatus] = useState([]);
  const [selectCaseStatus, setSelectCaseStatus] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const isAllSelected =
    department?.length > 0 &&
    setSelectedDepartments.length === department.length;

  const classes = useStyles();

  const checkIsAllSelected = (val) => {
    const _selected = [...department];
    let selectedIndex = _selected.findIndex((txt) => {
      return;
      // return txt.department === val.id;
    });
    if (selectedIndex > -1)
      return (
        _selected[selectedIndex].department.length === setDepartmentName.length
      );

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

  const checkIsIntermediate = (val) => {
    const _selected = [...department];
    let selectedIndex = _selected.findIndex((txt) => {
      // return txt.menuId === val.id;
      return;
    });

    if (selectedIndex > -1) {
      return _selected[selectedIndex].department.length != department.length;
    }

    return false;
  };

  // For Case Status
  const checkIsAllSelected1 = (val) => {
    const _selected1 = [...selectedCaseStatus];
    let selectedIndex1 = _selected1.findIndex((txt) => {
      return;
      // return txt.department === val.id;
    });
    if (selectedIndex1 > -1)
      return (
        _selected[selectedIndex1].selectedCaseStatus.length ===
        setSelectedCaseStatus.length
      );

    return false;
  };

  const checkIsIntermediate1 = (val) => {
    const _selected1 = [...selectedCaseStatus];
    let selectedIndex1 = _selected1.findIndex((txt) => {
      // return txt.menuId === val.id;
      return;
    });

    if (selectedIndex1 > -1) {
      return (
        _selected1[selectedIndex1].selectedCaseStatus.length !=
        selectedCaseStatus.length
      );
    }

    return false;
  };

  // create casestatus array
  const caseStatusDetails = [
    // {
    //   id: 1,
    //   caseStatus: language === "en" ? "All" : "सर्व",
    // },
    {
      id: 2,
      caseStatus:
        language === "en"
          ? "Pending with concern Department"
          : "संबंधित विभागाकडे प्रलंबित",
    },

    {
      id: 3,
      caseStatus:
        language === "en"
          ? "Pending with Legal Department"
          : "विधी विभागाकडे प्रलंबित",
    },

    {
      id: 4,
      caseStatus: language === "en" ? "Disposed" : " ",
    },

    {
      id: 5,
      caseStatus:
        language === "en" ? "Pending with Advocate" : "वकिलाकडे प्रलंबित",
    },
  ];

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
  const toDate = moment(watch("toDate")).format("YYYY-MM-DD");
  const [department, setDepartmentName] = useState([]);

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

  useEffect(() => {
    getdepartment();
  }, []);

  useEffect(() => {
    console.log("department", department);
  }, [department]);

  const handleDepartmentChangeOldNarmada = (event) => {
    setSelectedDepartments(event.target.value);

    // iterate through the selected departments and get the ids from departments list
    var selectedIds = "";
    event.target.value.forEach((selectedDepartment) => {
      if (selectedDepartment == "all") {
        let selectedsdfdsfIds = department.toString();
        //  let  selectedsdfdsfIds=department.forEach((data)=> {

        //   // return {
        //     console.log("data23",data?.department)

        //    return   data?.department

        //     // }
        //   });
        console.log("2322", selectedsdfdsfIds);
        selectedIds = [selectedsdfdsfIds];
      } else {
        selectedIds += selectedDepartment + ",";
      }
      console.log("first6565", selectedIds);
      // const selectedDepartmentId = department.find((d) => d.department === selectedDepartment)?.id;
    });

    // remove last comma from selectedIds
    // selectedIds = selectedIds.substring(0, selectedIds.length - 1);
    console.log("selectedIds", selectedIds);

    setSelectedDepartmentIds(selectedIds);

    console.log("selectedDepartmentIds", selectedIds);
    console.log("selectedDepartmentIds", event.target.value);
  };

  const handleDepartmentChange = (event) => {
    // check if all is selected or deselected and change the ids accordingly
    if (event.target.value.includes("all")) {
      // if all is selected then get all the department ids
      var tempAllDepartments = ["all"];
      var selectedIds = "0,";
      department.forEach((selectedDepartment) => {
        selectedIds += selectedDepartment.id + ",";
        tempAllDepartments.push(selectedDepartment.department);
      });
      setSelectedDepartmentIds(selectedIds);
      setSelectedDepartments(tempAllDepartments);
      console.log("selectedDepartmentIds ALL", selectedIds);
      console.log("selectedDepartmentIds ALL", tempAllDepartments);
    } else {
      if (
        !event.target.value.includes("all") &&
        selectedDepartments.includes("all")
      ) {
        // This is a deselect event
        // remove all from selected departments
        var tempSelectedDepartments = [];
        var selectedIds = "";

        console.log("selectedDepartmentIds DESELECT", selectedIds);
        console.log("selectedDepartmentIds DESELECT", tempSelectedDepartments);

        setSelectedDepartmentIds(selectedIds);
        setSelectedDepartments(tempSelectedDepartments);
      } else {
        // if all is not selected then get the ids of selected departments
        var selectedIds = "";
        event.target.value.forEach((selectedDepartment) => {
          // DepartmentId from department list and compare witj selected department
          const selectedDepartmentId = department.find(
            (d) => d.department === selectedDepartment
          )?.id;
          selectedIds += selectedDepartmentId + ",";
        });
        setSelectedDepartmentIds(selectedIds);
        setSelectedDepartments(event.target.value);
        console.log("selectedDepartmentIds NOTALL", selectedIds);
        console.log("selectedDepartmentIds NOTALL", event.target.value);
      }
    }

    console.log("selectedIds", selectedIds);
  };

  const handleStatusChange = (event) => {
    setSelectedCaseStatus(event.target.value);
    console.log("setSelectedCaseStatus", event.target.value);
  };

  //for on the search button
  const searchButton = async () => {
    try {
      axios
        .get(
          `${urls.LCMSURL}/report/getOpinionListFileTrackingReportV2?fromDate=${fromDate}&toDate=${toDate}&dptIds=${passDepartment}&status=${passCaseStatus}`,
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
              dptName: j.deptName,
              dptNameMr: j.dptNameMr,
              opinionTrnDate: j.opinionTrnDate,
              opinionTrnDateForReport: j.opinionTrnDateForReport,

              finalDeliveredDateForReport: j.finalDeliveredDateForReport,

              Subject: j.suject,
              sujectMr: j.sujectMr,
              clerkRemark: j.clerkRemark,
              clerkRemarkMr: j.clerkRemarkMr,
              finalDelivererdDate: j.finalDelivererdDate,
              AdvocateName2: j.AdvocateName2,
              AdvocateNameMr2: j.AdvocateNameMr2,
              opinion: j.opinion,
              opinionMr: j.opinionMr,
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

  const handleSelect = (evt, value) => {
    console.log(":valuesForDepartment", value);
    const selectedIds = value.map((val) => val.id);

    // setSelectedValuesOfDepartments(selectedIds)
    setPassDepartment(selectedIds);

    setSelectedDepartments(value);
  };

  const handleSelect1 = (evt, value) => {
    console.log(":valuesForStatus", value);
    // const selectedIds = value.map((val) => val.caseStatus);
    const selectedIds = value.map((val) => val.id);

    // setSelectedValuesOfDepartments(selectedIds)
    // setPassDepartment(selectedIds)
    setPassCaseStatus(selectedIds);

    setSelectCaseStatus(value);
  };

  const handleClear = () => {
    // setValue(null);
    // setPassDepartment(null)
    // setPassDepartment('')
    setSelectedDepartments([]);
    setSelectCaseStatus([]);
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
              {labels.opinionForListOfFileTracking}
            </h2>
          </Grid>
        </Grid>
        <form>
          <Grid container display="flex" direction="column" gap={2}>
            <Grid
              container
              direction="row"
              display="flex"
              spacing={2}
              justifyContent="center"
            >
              <Grid item lg={3} md={6} sm={8} xs={12} display="flex">
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

              <Grid item lg={3} md={6} sm={8} xs={12} display="flex">
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

              {/* Autocomplete Department Name  */}
              <Grid item lg={3} md={6} sm={8} xs={12} display="flex">
                <Autocomplete
                  //  value={passDepartment}
                  value={selectedDepartments}
                  //  ListboxProps={{ style: { maxHeight: 150 } }}
                  multiple
                  // sx={{ width: 100 }}
                  // ListboxProps={{ style: { maxHeight: 10 } }}
                  id="checkboxes-tags-demo"
                  options={department}
                  disableCloseOnSelect
                  onChange={handleSelect}
                  getOptionLabel={(option) => option.department}
                  renderOption={(props, option, { selected }) => {
                    // Insert console logs here to check values
                    // console.log("Rendering option:", option.department);
                    // console.log("Selected:", selected);
                    return (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.department}
                      </li>
                    );
                  }}
                  // style={{ width: 500,
                  //   // width: "50%",
                  //   background:"red"
                  //  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Department Name"
                      placeholder="Department Name"
                      // size="small"
                      variant="outlined"
                      style={{
                        width: 300,
                        overflowY: "auto",
                        maxHeight: "280px",
                        // height: "5px",
                        // background:"red",
                        // height:"1px"
                      }}
                      // size="small"
                    />
                  )}
                />
              </Grid>

              {/* Autocomplete Case Status */}

              <Grid item lg={3} md={6} sm={8} xs={12} display="flex">
                <Autocomplete
                  value={selectCaseStatus}
                  multiple
                  id="checkboxes-tags-demo"
                  options={caseStatusDetails}
                  disableCloseOnSelect
                  onChange={handleSelect1}
                  getOptionLabel={(option) => option.caseStatus}
                  renderOption={(props, option, { selected }) => {
                    console.log("Rendering option:", option.caseStatus);
                    console.log("Selected:", selected);
                    return (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.caseStatus}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label=" Opinion-Status"
                      placeholder=" Opinion-Status"
                      variant="outlined"
                      style={{
                        width: 280,
                        marginLeft: 9,
                        overflowY: "auto",
                        maxHeight: "300px",
                        // background:"red",
                        // height:"1px"
                      }}
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
                size="small"
                variant="contained"
                // disabled={loading || !isValid}
                startIcon={<SearchOutlined />}
                onClick={searchButton}
              >
                {labels.search}
              </Button>
              <Button
                // disabled={loading}
                size="small"
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
                size="small"
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
      {/* <Divider /> */}
      <br />
      {/* <div style={{ border: "1px solid black" }}> */}
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
            // background: "blue",
            // width: "800px",
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
            // fromDate={fromDate}
            // toDate={toDate}

            fromDate={moment(watch("fromDate")).format("DD-MM-YYYY")}
            toDate={moment(watch("toDate")).format("DD-MM-YYYY")}
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
      {/* </div> */}
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
                          {labels.opinionForListOfFileTracking}
                        </Box> */}
                      </Typography>
                    </Grid>
                  </Grid>

                  {/* From Date and To Date for a Print */}

                  {/* ++ */}
                  <table className={styles.report_table}>
                    <thead>
                      <tr>
                        <th colSpan={14}>
                          <h3>
                            <b>{labels.opinionForListOfFileTracking}</b>
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
                            <Grid item lg={1}></Grid>
                            <Grid item lg={2}>
                              <Typography
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                {/* From Date:{this.props.fromDate} */}
                              </Typography>
                            </Grid>
                            <Grid item lg={1.5}></Grid>
                            <Grid item lg={3}>
                              <Typography
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                }}
                              >
                                {/* To Date:{this.props.toDate} */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </th>

                        {/* For To Date */}
                      </tr>

                      <tr className={styles.report_table_tr}>
                        <th>
                          <b>{labels.srNo}</b>
                        </th>

                        <th>
                          <b>{labels.deptName}</b>
                        </th>

                        <th>
                          <b>{labels.opinionTranDate}</b>
                        </th>

                        <th>
                          <b>{labels.opinionSubject}</b>
                        </th>
                        {/* <th>
                          <b>{labels.finalOpinionDelivDate}</b>
                        </th> */}
                        <th>
                          <b>Advocate Name of STR</b>
                        </th>
                      </tr>
                    </thead>

                    {/* From Date and To Date for Print */}

                    <tbody>
                      {renderedData &&
                        renderedData.map((r, i) => (
                          <tr key={i}>
                            <td>{r.srNo}</td>
                            <td>
                              {language == "mr" ? r.dptNameMr : r.dptName}
                            </td>
                            {/* <td>{r.opinionTrnDate}</td> */}
                            <td>{r.opinionTrnDateForReport}</td>

                            <td>{language == "mr" ? r.sujectMr : r.Subject}</td>
                            {/* <td>{language == "mr" ? r.clerkRemarkMr : r.clerkRemark}</td> */}
                            {/* <td>{r.finalDelivererdDate}</td> */}
                            {/* <td>{r.finalDeliveredDateForReport}</td> */}

                            <td>
                              {language == "mr"
                                ? r.AdvocateNameMr2
                                : r.AdvocateName2}
                            </td>
                            {/* <td>{language == "mr" ? r.opinionMr : r.opinion}</td> */}
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
