import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
// import styles from "./view.module.css";
import styles from "./view.module.css";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import DetailsIcon from "@mui/icons-material/Details";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    // criteriaMode: "all",
    // resolver: yupResolver(Schema),
    // mode: "onSubmit",
  });
  const [data, setData] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const language = useSelector((store) => store.labels.language);
  const user = useSelector((state) => state.user.user);
  const loggedUser = localStorage.getItem("loggedInUser");

  // const headers =
  //   loggedUser === "citizenUser"
  //     ? { Userid: user?.id, Authorization: `Bearer ${user?.token}` }
  //     : { Authorization: `Bearer ${user?.token}` };

  const headers = { Authorization: `Bearer ${user?.token}` };

  const [catchMethodStatus, setCatchMethodStatus] = useState(false);

  const cfcErrorCatchMethod = (error, moduleOrCFC) => {
    if (!catchMethodStatus) {
      if (moduleOrCFC) {
        setTimeout(() => {
          cfcCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      } else {
        setTimeout(() => {
          moduleCatchMethod(error, language);
          setCatchMethodStatus(false);
        }, [0]);
      }
      setCatchMethodStatus(true);
    }
  };


  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  ///////////// On submit method ////////////////////
  const onSubmitFunc = () => {
    if (watch("fromDate") && watch("toDate")) {
      let sendFromDate = moment(watch("fromDate")).format(
        "YYYY-MM-DDThh:mm:ss"
      );
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DDThh:mm:ss");

      let apiBodyToSend = {
        strFromDate: sendFromDate.replace("T", " "),
        strToDate: sendToDate.replace("T", " "),
      };

      ///////////////////////////////////////////
      axios
        .post(
          `${urls.BSUPURL}/report/getTotalApplicationSummmaryReport`,
          apiBodyToSend,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setLoading(true);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  aadharNo: r.aadharNo,
                  areaName: r.areaName,
                  areaNameMr: r.areaNameMr,
                  beneficiaryAddress: r.beneficiaryAddress,
                  beneficiaryName: r.beneficiaryName,
                  // cfcApplicationNo: r.cfcApplicationNo,
                  // cfcApplicationNo: r.onlineApplicationNo,
                  emailId: r.emailId,
                  mobileNo: r.mobileNo,
                  onlineApplicationNo: r.onlineApplicationNo,
                  schemeName: r.schemeName,
                  schemeNameMr: r.schemeNameMr,
                  status: r.status,
                  subSchemeName: r.subSchemeName,
                  subSchemeNameMr: r.subSchemeNameMr,
                  wardName: r.wardName,
                  wardNameMr: r.wardNameMr,
                  zoneName: r.zoneName,
                  beneficiaryAddress: r.beneficiaryAddress,
                  zoneNameMr: r.zoneNameMr,
                  zoneOfficeApplicationNo: r.zoneOfficeApplicationNo,
                  applicationDate: r.applicationDate.split(" ")[0],
                }))
              );
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
        .catch((err) => {
          setData([]);
          // sweetAlert(error);
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      sweetAlert({
        title: "Oops!",
        text: "Both From And To Dates Are Required!",
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
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "onlineApplicationNo",
      headerName: <FormattedLabel id="onlineApplicationNo" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "cfcApplicationNo",
    //   headerName: <FormattedLabel id="cfcApplicationNo" />,
    //   minWidth: 150,
    //   headerAlign: "center",
    //   align: "center",
    // },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "zoneName",
      headerName: <FormattedLabel id="zoneName" />,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },
    // {
    //   field: "zoneNameMr",
    //   headerName: <FormattedLabel id="zoneNameMr" />,
    //   minWidth: 180,
    //   headerAlign: "center",
    //   align: "center",
    // },

    {
      field: "wardName",
      headerName: <FormattedLabel id="wardName" />,
      minWidth: 180,
      headerAlign: "center",
      align: "center",
    },

    // {
    //     field: "wardNameMr",
    //     headerName: <FormattedLabel id="wardNameMr" />,
    //     minWidth: 180,
    //     headerAlign: "center",
    //     align: "center",
    //   },

    {
      field: "beneficiaryName",
      headerName: <FormattedLabel id="beneficiaryName" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "beneficiaryAddress",
      headerName: <FormattedLabel id="beneficiaryAddress" />,
      minWidth: 400,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "aadharNo",
      headerName: <FormattedLabel id="aadharNo" />,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "mobileNo",
      headerName: <FormattedLabel id="mobileNo" />,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "schemeName",
      headerName: <FormattedLabel id="schemeName" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },

    //   {
    //     field: "schemeNameMr",
    //     headerName: <FormattedLabel id="schemeNameMr" />,
    //     minWidth: 250,
    //     headerAlign: "center",
    //     align: "center",
    //   },

    {
      field: "subSchemeName",
      headerName: <FormattedLabel id="subSchemeName" />,
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },

    //   {
    //     field: "subSchemeNameMr",
    //     headerName: <FormattedLabel id="subSchemeNameMr" />,
    //     minWidth: 250,
    //     headerAlign: "center",
    //     align: "center",
    //   },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  function generateCSVFile(data) {

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
    downloadLink.download = data ? `Total Application Summary.csv` : "data.csv";
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        style={{
          margin: "30px",
        }}
      >
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1%",
          }}
        >
          <Box
            className={styles.details1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "98%",
              height: "auto",
              overflow: "auto",
              padding: "0.5%",
              color: "black",
              fontSize: 19,
              fontWeight: 500,
              // borderRadius: 100,
            }}
          >
            <strong className={styles.fancy_link1}>
              <FormattedLabel id="totalApplicationSummaryHeading" />
            </strong>
          </Box>
        </Box>
        {/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */}
        <Box
          style={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} style={{ margin: "10px", width: "80%" }}>
            <form onSubmit={handleSubmit(onSubmitFunc)}>
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              ></Grid>

              {/* From date */}
              <Grid
                container
                spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "baseline",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.fromDate}
                  >
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
                                <FormattedLabel id="fromDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
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
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{ backgroundColor: "white" }}
                    error={!!errors.toDate}
                  >
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
                                <FormattedLabel id="toDate" />
                              </span>
                            }
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                            selected={field.value}
                            center
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                fullWidth
                                variant="standard"
                              />
                            )}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <FormHelperText>
                      {errors?.toDate ? errors.toDate.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              {/* to date */}

              <Grid
                container
                // spacing={2}
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "baseline",
                }}
              >
                {/* ///////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      className={commonStyles.buttonSubmit}
                      color="success"
                      endIcon={<ArrowUpwardIcon />}
                    >
                      {<FormattedLabel id="submit" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* ///////////////////////////////////////////// */}
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<DownloadIcon />}
                      onClick={() => generateCSVFile(data)}
                    >
                      {<FormattedLabel id="download" />}
                    </Button>
                  </Paper>
                </Grid>
                {/* ///////////////////// */}

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      // sx={{ marginRight: 8 }}
                      type="button"
                      variant="contained"
                      color="primary"
                      className={commonStyles.buttonBack}
                      endIcon={<ClearIcon />}
                      onClick={onCancel}
                    >
                      {<FormattedLabel id="cancel" />}
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </form>
          </Paper>
          {loading ? (
            <CommonLoader />
          ) : data.length !== 0 ? (
            <div style={{ width: "100%" }}>
              <DataGrid
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
              />
            </div>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
