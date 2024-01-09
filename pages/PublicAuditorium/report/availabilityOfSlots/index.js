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
import styles from "../../../../styles/publicAuditorium/reports/[auditoriumBooking].module.css";
import urls from "../../../../URLS/urls";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../containers/schema/publicAuditorium/reports/availabilityOfSlots";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

function AvailabilityOfSlots() {
  const {
    register,
    control,
    handleSubmit,
    methods,
    reset,
    setValue,
    watch,
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

  // const [data, setData] = useState({
  //   rows: [],
  //   totalRows: 0,
  //   rowsPerPageOptions: [10, 20, 50, 100],
  //   pageSize: 10,
  //   page: 1,
  // });

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
      let fromDate = moment(watch("fromDate")).format("YYYY-MM-DD");
      let toDate = moment(watch("toDate")).format("YYYY-MM-DD");
      let auditoriumId =
        watch("auditoriumId") == "All"
          ? _aud?.toString()
          : watch("auditoriumId");

      setLoading(true);
      axios
        .get(
          `${urls.PABBMURL}/auditoriumBookingDetails/getBookingDetailsByDateAndAuditoriumId`,
          {
            params: {
              fromDate: fromDate,
              toDate: toDate,
              auditoriumId: auditoriumId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data?.auditoriumBookingDetailsList?.length > 0) {
              let _res = res?.data?.auditoriumBookingDetailsList?.map(
                (r, i) => {
                  return {
                    ...r,
                    fromTime: moment(r?.fromTime, "h:mm:ss").format("HH:mm: A"),
                    toTime: moment(r?.toTime, "h:mm:ss").format("HH:mm: A"),
                    srNo: i + 1,
                    eventDate: moment(r?.bookingDate, "YYYY/MM/DD").format(
                      "DD/MM/YYYY"
                    ),
                    eventHours:
                      (r?.toTime == "00:00:00"
                        ? "24"
                        : r?.toTime?.split(":")[0]) -
                      r?.fromTime?.split(":")[0],
                    eventDay: r?.eventDay ? r?.eventDay : "-",
                    applicationDate: moment(
                      r?.trnAuditoriumBookingOnlineProcess?.applicationDate,
                      "YYYY/MM/DD"
                    ).format("DD/MM/YYYY"),
                    loiNo: r?.LoiNo ? r?.LoiNo : "-",
                    applicationNumber: r?.applicationNumberKey
                      ? r?.applicationNumberKey
                      : "-",
                    applicantMobile: r?.applicantMobileNo,
                    eventTitle:
                      r?.trnAuditoriumBookingOnlineProcess?.eventTitle,
                    auditorium: auditoriums?.find(
                      (obj) => obj.id == r?.auditoriumId
                    ).auditoriumNameEn,
                    deposite: r?.depositAmount,
                    rent: r?.rentAmount,
                    applicantName:
                      r?.trnAuditoriumBookingOnlineProcess?.applicantName,
                    applicantMobile:
                      r?.trnAuditoriumBookingOnlineProcess?.applicantMobileNo,
                    date: r?.bookingDate
                      ? moment(r?.bookingDate, "YYYY/MM/DD").format(
                          "DD/MM/YYYY"
                        )
                      : "-",
                  };
                }
              );
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
          setData([]);
          console.log("err", err);
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
      field: "auditorium",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicantMobile",
      headerName: <FormattedLabel id="applicantMobile" />,
      flex: 0.8,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      flex: 0.8,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 0.9,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "eventTitle",
      headerName: "Event Title",
      flex: 0.9,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "fromTime",
      headerName: "From Time",
      flex: 0.9,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "toTime",
      headerName: "To Time",
      flex: 0.9,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "eventDate",
      headerName: "Event Date",
      flex: 0.9,
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
    ,
    {
      headerClassName: "cellColor",
      field: "auditorium",
      headerAlign: "center",
      formattedLabel: "auditorium",
      width: 350,
      align: "center",
    },
    // {
    //   headerClassName: "cellColor",
    //   field: "applicantMobile",
    //   headerAlign: "center",
    //   formattedLabel: "applicantMobile",
    //   width: 80,
    //   align: "center",
    // },
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
    //   field: "applicationNumber",
    //   headerAlign: "center",
    //   formattedLabel: "applicationNumber",
    //   width: 40,
    //   align: "center",
    // },
    // {
    //   headerClassName: "cellColor",
    //   field: "eventTitle",
    //   headerAlign: "center",
    //   formattedLabel: "eventTitle",
    //   width: 60,
    //   align: "center",
    // },
    {
      headerClassName: "cellColor",
      field: "date",
      headerAlign: "center",
      formattedLabel: "date",
      width: 120,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "fromTime",
      headerAlign: "center",
      formattedLabel: "fromTime",
      width: 260,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "toTime",
      headerAlign: "center",
      formattedLabel: "toTime",
      width: 260,
      align: "center",
    },
    {
      headerClassName: "cellColor",
      field: "eventHours",
      headerAlign: "center",
      formattedLabel: "eventHours",
      width: 80,
      align: "center",
    },
    // {
    //   headerClassName: "cellColor",
    //   field: "eventDate",
    //   headerAlign: "center",
    //   formattedLabel: "eventDate",
    //   width: 120,
    //   align: "center",
    // },
  ];

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
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
        enName="Availability Of Slots"
        mrName="स्लॉट्सची उपलब्धता"
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
                              fullWidth
                              error={errors.toDate}
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
                    {errors?.toDate ? errors.toDate.message : null}
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
                },
                "& .MuiDataGrid-columnHeadersInner": {
                  backgroundColor: "#556CD6",
                  color: "white",
                },

                "& .MuiDataGrid-cell:hover": {
                  color: "primary.main",
                },
              }}
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

export default AvailabilityOfSlots;
