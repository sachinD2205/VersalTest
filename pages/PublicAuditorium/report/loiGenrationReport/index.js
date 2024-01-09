import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import sweetAlert from "sweetalert";
import Paper from "@mui/material/Paper";
import CheckIcon from "@mui/icons-material/Check";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import { Box } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import axios from "axios";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import Loader from "../../../../containers/Layout/components/Loader";
import styles from "../../../../styles/publicAuditorium/reports/[loiGenration].module.css";
import urls from "../../../../URLS/urls";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import schema from "../../../../containers/schema/publicAuditorium/reports/loiGenration";
import { yupResolver } from "@hookform/resolvers/yup";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function LOIGenrationReport() {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    mode: "onChange",
  });

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  let language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  let selectedMenu = localStorage.getItem("selectedMenuFromDrawer");
  let menu = useSelector((state) =>
    state?.user?.user?.menus?.find((m) => m?.id == selectedMenu)
  );
  const [route, setRoute] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (event) => {
    console.log("eventevent", event);
    setSelectedOption(event.target.value);
  };

  const [data, setData] = useState([]);

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

  const [auditoriums, setAuditoriums] = useState([]);

  useEffect(() => {
    getDepartment();
    getAuditorium();
  }, []);

  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("dept", res);
        setDepartments(
          res.data.department.map((r, i) => ({
            id: r.id,
            department: r.department,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {
    console.log(":generateCSVFile", data);

    const csv = [
      columns
        .map((c) => c.headerName)
        .map((obj) => obj?.props?.id)
        .join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    // downloadLink.download = "data.csv";
    downloadLink.download = "data.csv";
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  //////////////////////////////////////////
  function generatePDF(data) {
    const columnsData = columns
      .map((c) => c.headerName)
      .map((obj) => obj?.props?.id);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));
    console.log(
      ":45",
      columns.map((c) => c.headerName).map((obj) => obj)
    );
    const doc = new jsPDF();
    doc.autoTable({
      head: [columnsData],
      body: rowsData,
    });
    doc.save("datagrid.pdf");
  }

  const onSubmitFunc = (data) => {
    let _aud = auditoriums.map((val) => {
      return val.id;
    });
    if (watch("fromDate") && watch("toDate")) {
      // alert("onSubmitFunc");
      let fromDate = moment(watch("fromDate")).format("DD/MM/YYYY");
      let toDate = moment(watch("toDate")).format("DD/MM/YYYY");
      let auditoriumId =
        watch("auditoriumId") == "All"
          ? _aud?.toString()
          : watch("auditoriumId");

      setLoading(true);
      axios
        .get(`${urls.PABBMURL}/loi/getReportByFromDateToDateAndAuditoriumId`, {
          params: {
            fromDate: fromDate,
            toDate: toDate,
            auditoriumId: auditoriumId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data?.loiList?.length > 0) {
              let _res = res?.data?.loiList?.map((r, i) => {
                return {
                  srNo: i + 1,
                  id: r?.id,
                  loiDate: r?.loiDate
                    ? moment(r?.loiDate, "YYYY/MM/DD").format("DD/MM/YYYY")
                    : "-",
                  applicationNumberKey: r?.applicationNumberKey
                    ? r?.applicationNumberKey
                    : "-",
                  bookingId: r?.bookingId ? r?.bookingId : "-",
                  // auditorium: r?.auditoriumId ? r?.auditoriumId : '-',

                  eventDay: r?.eventDay ? r?.eventDay : "-",
                  amount: r?.amount ? r?.amount : "-",
                  loiNo: r?.loiNo ? r?.loiNo : "-",
                  serviceId: r?.serviceId ? r?.serviceId : "-",

                  auditorium: auditoriums?.find((obj) => {
                    return obj?.id == r?.auditoriumId;
                  })?.auditoriumNameEn
                    ? auditoriums?.find((obj) => {
                        return obj?.id == r?.auditoriumId;
                      })?.auditoriumNameEn
                    : "-",
                };
              });
              setData(_res);

              // if (res?.data?.trnAuditoriumBookingOnlineProcessList.length === 0) {
              //   toast("No Data Available", {
              //     type: "error",
              //   });
              // }

              setLoading(false);
            } else {
              sweetAlert({
                title: "Oops!",
                text: "There is nothing to show you!",
                icon: "warning",
                // buttons: ["No", "Yes"],
                dangerMode: false,
                closeOnClickOutside: false,
              });
              setData([]);
              setLoading(false);
            }
          } else {
            setData([]);
            sweetAlert("Something Went Wrong!");
            setLoading(false);
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          setData([]);
          setLoading(false);
          callCatchMethod(err, language);
        });
    } else {
      sweetAlert({
        title: "Oops!",
        text: "All Three Values Are Required!",
        icon: "warning",
        // buttons: ["No", "Yes"],
        dangerMode: false,
        closeOnClickOutside: false,
      });
      setData([]);
    }
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNumberKey",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 0.8,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "loiNo",
      headerName: <FormattedLabel id="loiNo" />,
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "loiDate",
      headerName: <FormattedLabel id="loiDate" />,
      flex: 0.8,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "amount",
      headerName: <FormattedLabel id="amount" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  const columnsPetLicense = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      headerAlign: "center",
      formattedLabel: "srNo",
      width: 50,
      align: "center",
    },
    // {
    //   headerClassName: "cellColor",
    //   field: "applicationDate",
    //   headerAlign: "center",
    //   formattedLabel: "applicationDate",
    //   width: 100,
    //   align: "center",
    // },
    // {
    //   headerClassName: "cellColor",
    //   field: "applicatantName",
    //   headerAlign: "center",
    //   formattedLabel: "applicantName",
    //   width: 100,
    //   align: "center",
    // },
    {
      headerClassName: "cellColor",
      field: "auditorium",
      headerAlign: "center",
      formattedLabel: "auditorium",
      width: 200,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "applicationNumberKey",
      headerAlign: "center",
      formattedLabel: "applicationNumber",
      width: 150,
      align: "center",
    },
    // {
    //   headerClassName: "cellColor",
    //   field: "eventDate",
    //   headerAlign: "center",
    //   formattedLabel: "eventDate",
    //   width: 150,
    //   align: "center",
    // },
    {
      headerClassName: "cellColor",
      field: "loiNo",
      headerAlign: "center",
      formattedLabel: "loiNo",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "loiDate",
      headerAlign: "center",
      formattedLabel: "loiDate",
      width: 150,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "amount",
      headerAlign: "center",
      formattedLabel: "amount",
      width: 150,
      align: "center",
    },
  ];

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
    auditoriumId: null,
  };

  let onCancel = () => {
    setSelectedOption(null),
      reset({
        ...resetValuesCancell,
      });
    router.push("/PublicAuditorium/dashboard");
  };

  const onClearFunc = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  return (
    <Paper>
      <Box>
        <BreadcrumbComponent />
      </Box>
      <PabbmHeader
        language={language}
        enName="LOI Generation Report"
        mrName="उद्देशीय पत्र निर्मिती अहवाल"
      />
      <form onSubmit={handleSubmit(onSubmitFunc)}>
        <Box>
          {loading ? (
            <Loader />
          ) : (
            <Grid container sx={{ padding: "10px" }}>
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl style={{ marginTop: 10 }} error={errors.fromDate}>
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
                              {" "}
                              {language === "en" ? "From Date" : "पासून"}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              fullWidth
                              error={errors.fromDate}
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {errors?.fromDate ? errors.fromDate.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <FormControl style={{ marginTop: 10 }} error={errors.toDate}>
                  <Controller
                    control={control}
                    name="toDate"
                    defaultValue={null}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              {" "}
                              {language === "en" ? "To Date" : "पर्यंत"}
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          minDate={watch("fromDate")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              error={errors.toDate}
                              fullWidth
                              InputLabelProps={{
                                style: {
                                  fontSize: 12,
                                  marginTop: 3,
                                },
                              }}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {" "}
                    {errors?.toDate ? errors.toDate.message : null}{" "}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "end",
                }}
              >
                <FormControl
                  error={errors.auditoriumId}
                  size="small"
                  variant="outlined"
                  sx={{ width: "60%" }}
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    {language === "en"
                      ? "Auditorium"
                      : "प्रेक्षागृह / नाट्यगृह"}
                  </InputLabel>
                  <Select
                    {...register("auditoriumId")}
                    onChange={(e) => {
                      setValue("auditoriumId", e.target.value, {
                        shouldValidate: true,
                      });
                    }}
                    value={watch("auditoriumId")}
                    label={
                      language === "en"
                        ? "Auditorium"
                        : "प्रेक्षागृह / नाट्यगृह"
                    }
                  >
                    <MenuItem value="All" key="none">
                      All
                    </MenuItem>
                    {auditoriums.map((auditorium, index) => (
                      <MenuItem key={index} value={auditorium.id}>
                        {auditorium.auditoriumNameEn}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors?.auditoriumId ? errors.auditoriumId.message : null}
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Box>
        <Grid
          container
          style={{
            padding: "10px",
          }}
        >
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper elevation={4} style={{ width: "auto" }}>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="success"
                endIcon={<RunningWithErrorsIcon />}
              >
                <FormattedLabel id="process" />
              </Button>
            </Paper>
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <FormLabel id="demo-radio-buttons-group-label">
              <FormattedLabel id="exportTo" /> :
            </FormLabel>
            <Controller
              name="format"
              control={control}
              defaultValue="excel"
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  defaultValue="excel"
                >
                  <FormControlLabel
                    value="excel"
                    control={<Radio />}
                    label={<FormattedLabel id="excel" />}
                  />
                  <FormControlLabel
                    value="pdf"
                    control={<Radio />}
                    label={<FormattedLabel id="printPdf" />}
                  />
                </RadioGroup>
              )}
            />
          </Grid>

          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              variant="contained"
              color="primary"
              endIcon={<CleaningServicesIcon />}
              onClick={onClearFunc}
            >
              <FormattedLabel id="clear" />
            </Button>
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper elevation={4} style={{ width: "auto" }}>
              <Button
                size="small"
                variant="contained"
                color="success"
                disabled={data?.length > 0 ? false : true}
                onClick={() => {
                  watch("format") == "excel"
                    ? generateCSVFile(data)
                    : // : generatePDF(data);
                      handlePrint();
                }}
                endIcon={<DownloadIcon />}
              >
                <FormattedLabel id="submit" />
              </Button>
            </Paper>
          </Grid>
          <Grid
            item
            xs={2}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper elevation={4} style={{ width: "auto" }}>
              <Button
                onClick={onCancel}
                size="small"
                variant="contained"
                color="error"
                endIcon={<ClearIcon />}
              >
                <FormattedLabel id="exit" />
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </form>

      <Box sx={{ paddingTop: "10px" }}>
        {data.length !== 0 ? (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <ReportLayout
              centerHeader
              centerData
              rows={data}
              columns={columnsPetLicense}
              showDates
              date={{
                from: moment(watch("fromDate")).format("DD/MM/YYYY"),
                to: moment(watch("toDate")).format("DD/MM/YYYY"),
              }}
              componentRef={componentRef}
            />
            {/* <DataGrid
              autoHeight
              sx={{
                overflowY: "scroll",
                "& .MuiDataGrid-virtualScrollerContent": {
                  // backgroundColor:'red',
                  // height: '800px !important',
                  // display: "flex",
                  // flexDirection: "column-reverse",
                  // overflow:'auto !important'
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
              // disableColumnFilter
              // disableColumnSelector
              // disableDensitySelector
              components={{ Toolbar: GridToolbar }}
              componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 0 },
                  disableExport: true,
                  disableToolbarButton: false,
                  csvOptions: { disableToolbarButton: false },
                  printOptions: { disableToolbarButton: true },
                },
              }}
              rows={data ? data : []}
              columns={columns}
              density="standard"
              pageSize={10}
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
            /> */}
          </div>
        ) : (
          ""
        )}

        {/* <ComponentToPrint
            data={{ dataSource, language, ...menu, route, departments, auditoriums }}
            ref={componentRef}
          /> */}
      </Box>
    </Paper>
  );
}

class ComponentToPrint extends React.Component {
  render() {
    return (
      <>
        <div>
          <div>
            <Paper sx={{ padding: "10px" }}>
              <table className={styles.report}>
                <thead className={styles.head}>
                  <tr>
                    <th colSpan={14}>
                      {
                        this?.props?.data?.language === "en"
                          ? this.props.data.menuNameEng
                          : // "Application Details Report"
                            this.props.data.menuNameMr
                        /* "अर्ज तपशील अहवाल" */
                      }
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Sr.No" : "अ.क्र"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Event Date"
                        : "कार्यक्रमाची तारीख"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Event Day"
                        : "कार्यक्रमाचा दिवस"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Application Date"
                        : "अर्ज तारीख"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Application Number"
                        : "अर्ज क्रमांक"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "LOI No"
                        : "एलओआय क्रमांक"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Applicant Name"
                        : "अर्जदाराचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Applicant Mobile No"
                        : "अर्जदार मोबाईल क्र"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Auditorium"
                        : "प्रेक्षागृह / नाट्यगृह"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Organization Name"
                        : "संस्थेचे नाव"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Deposit"
                        : "अनामत"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en" ? "Rent" : "भाडे"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "Total Amount"
                        : "एकूण रक्कम"}
                    </th>
                    <th colSpan={1}>
                      {this?.props?.data?.language === "en"
                        ? "remarks"
                        : "टिप्पणी"}
                    </th>
                  </tr>
                  {this?.props?.data?.dataSource &&
                    this?.props?.data?.dataSource?.map((r, i) => (
                      <>
                        <tr>
                          <td>{i + 1}</td>

                          <td>
                            {/* {this?.props?.data?.language == "en"
                                ? moment(r.outTime).format("DD-MM-YYYY hh:mm:ss")
                                : moment(r.outTime).format("DD-MM-YYYY hh:mm:ss")} */}
                            {this?.props?.data?.language === "en"
                              ? r?.eventDate
                                ? moment(r?.eventDate).format("DD-MM-YYYY")
                                : "-"
                              : moment(r?.eventDate).format("DD-MM-YYYY")}
                          </td>

                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.eventDay
                              : r?.eventDay}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicationDate
                                ? moment(r?.applicationDate).format(
                                    "DD-MM-YYYY"
                                  )
                                : "-"
                              : moment(r?.applicationDate).format("DD-MM-YYYY")}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicationNumber
                              : r?.applicationNumber}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.LoiNo
                              : r?.LoiNo}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicantName
                              : r?.applicantName}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.applicantMobileNo
                              : r?.applicantMobileNo}
                          </td>
                          <td>
                            {console.log(
                              "first",
                              this?.props?.data?.auditoriums,
                              this?.props?.data
                            )}
                            {this?.props?.data?.language == "en"
                              ? this?.props?.data?.auditoriums?.find((obj) => {
                                  return obj?.id == r?.auditoriumId && obj;
                                })?.auditoriumNameEn
                              : "-"}
                          </td>
                          <td>
                            {" "}
                            {this?.props?.data?.language === "en"
                              ? r?.organizationName
                              : r?.organizationName}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.depositAmount
                              : r?.depositAmount}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.rentAmount
                              : r?.rentAmount}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.totalAmount
                              : r?.totalAmount}
                          </td>
                          <td>
                            {this?.props?.data?.language === "en"
                              ? r?.remarks
                              : r?.remarks}
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </Paper>
          </div>
        </div>
      </>
    );
  }
}
export default LOIGenrationReport;
