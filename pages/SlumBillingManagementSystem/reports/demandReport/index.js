import { ThemeProvider } from "@emotion/react";
import {
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
  IconButton,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import styles from "./view.module.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import { useReactToPrint } from "react-to-print";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { useRouter } from "next/router";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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

  const router = useRouter();

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [slumDropDown, setSlumDropDown] = useState([]);
  const [usageDropDown, setUsageDropDown] = useState([]);

  const language = useSelector((store) => store.labels.language);
  //get logged in user
  const user = useSelector((state) => state.user.user);

  const componentRef = useRef(null);
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
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Demand Report",
  });

  useEffect(() => {
    getZoneData();
    getSlumData();
    getUsageData();
  }, []);

  const getZoneData = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let result = res.data.zone;
        let _res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              zoneEn: r.zoneName,
              zoneMr: r.zoneNameMr,
            };
          });
        setZoneDropDown(_res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const getSlumData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSlum/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.mstSlumList;
        // console.log("getSlumData", result);
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              slumEn: r.slumName,
              slumMr: r.slumNameMr,
            };
          });
        setSlumDropDown(res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getUsageData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbUsageType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setUsageDropDown(
          res.data.mstSbUsageTypeList.map((r, i) => ({
            id: r.id,
            usage: r.usageType,
            usageMr: r.usageTypeMr,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
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

  const onSubmitFunc = () => {
    if (
      watch("slumKey") &&
      watch("usageKey") &&
      watch("fromDate") &&
      watch("toDate")
    ) {
      // alert("onSubmitFunc");
      let sendFromDate = moment(watch("fromDate")).format(
        "YYYY-MM-DD hh:mm:ss"
      );
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DD hh:mm:ss");

      let apiBodyToSend = {
        slumKey: watch("slumKey"),
        usageKey: watch("usageKey"),
        strFromDate: sendFromDate,
        strToDate: sendToDate,
      };

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(`${urls.SLUMURL}/report/getDemandReport`, apiBodyToSend, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,

                  recieptDate: moment(r?.billDate).format("DD-MM-YYYY"),

                  hutNo: r.hutNo,
                  hutArea: r?.area,

                  usageType: !usageDropDown?.find((obj) => {
                    return obj.id == r?.usegekey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usegekey;
                      }).usage,

                  usageTypeMr: !usageDropDown?.find((obj) => {
                    return obj.id == r?.usegekey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usegekey;
                      }).usageMr,

                  hutOccupierName: r?.ownerName,
                  hutOccupierNameMr: r?.ownerNameMr,

                  previousAmount: r?.prevAmount,
                  currentAmount: r?.currAmount,
                  overAmount: r?.overAmount,
                  totalAmount: r?.totalAmount,
                }))
              );
              setLoading(false);
            } else {
              sweetAlert({
                title: language == "en" ? "Oops!" : "क्षमस्व!",
                text:
                  language == "en"
                    ? "There is nothing to show you!"
                    : "तुम्हाला दाखवण्यासारखे काही नाही!",
                icon: "warning",
                dangerMode: false,
                closeOnClickOutside: false,
                button: language === "en" ? "Ok" : "ठीक आहे",
              });
              setData([]);
              setLoading(false);
            }
          } else {
            setData([]);
            sweetAlert(
              language == "en" ? "Something Went Wrong!" : "काहीतरी चूक झाली!",
              { button: language === "en" ? "Ok" : "ठीक आहे" }
            );
            setLoading(false);
          }
        })
        .catch((err) => {
          setData([]);
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      sweetAlert({
        title: language == "en" ? "Oops!" : "क्षमस्व!",
        text:
          language == "en"
            ? "All Three Values Are Required!"
            : "सर्व तीन मूल्ये आवश्यक आहेत!",
        icon: "warning",
        dangerMode: false,
        closeOnClickOutside: false,
        button: language === "en" ? "Ok" : "ठीक आहे",
      });
      setData([]);
    }
  };

  // const columns = [
  //   {
  //     field: "id",
  //     headerName: <FormattedLabel id="srNo" />,
  //     flex: 1,
  //     minWidth: 60,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: language === "en" ? "hutOccupierName" : "hutOccupierNameMr",
  //     headerName: <FormattedLabel id="hutOccupierName" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "hutNo",
  //     headerName: <FormattedLabel id="hutNo" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "hutArea",
  //     headerName: <FormattedLabel id="hutArea" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: language == "en" ? "usageType" : "usageTypeMr",
  //     headerName: <FormattedLabel id="usageType" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "eligible",
  //     headerName: <FormattedLabel id="eligible" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "ineligible",
  //     headerName: <FormattedLabel id="inEligible" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "previousAmount",
  //     headerName: <FormattedLabel id="previousAmount" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "currentAmount",
  //     headerName: <FormattedLabel id="currentAmount" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "overAmount",
  //     headerName: <FormattedLabel id="overAmount" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   {
  //     field: "totalAmount",
  //     headerName: <FormattedLabel id="totalAmount" />,
  //     minWidth: 230,
  //     flex: 1,
  //     headerAlign: "center",
  //     align: "center",
  //   },
  //   // {
  //   //   field: "slumName",
  //   //   headerName: <FormattedLabel id="slumName" />,
  //   //   minWidth: 230,
  //   //   flex: 1,
  //   //   headerAlign: "center",
  //   //   align: "center",
  //   // },
  //   // {
  //   //   field: "year",
  //   //   headerName: <FormattedLabel id="year" />,
  //   //   minWidth: 230,
  //   //   flex: 1,
  //   //   headerAlign: "center",
  //   //   align: "center",
  //   // },
  // ];

  // const columnGroupingModel = [
  //   {
  //     groupId: "Pimpri Chinchwad Munciple Corporation Pimpri 18",
  //     className: `${styles.stickyHeader}`,
  //     children: [
  //       {
  //         groupId: "SLUM Department",
  //         className: `${styles.stickyHeader}`,
  //         children: [
  //           {
  //             groupId: "Hut Occupier/ Hut Wise Demand Report No 2",
  //             className: `${styles.stickyHeader}`,
  //             children: [
  //               {
  //                 groupId: "slum name and year",
  //                 className: `${styles.stickyHeader}`,
  //                 children: [
  //                   { field: "id" },
  //                   { field: "hutOccupierName" },
  //                   { field: "hutOccupierNameMr" },
  //                   { field: "hutNo" },
  //                   { field: "hutArea" },
  //                   { field: "usageType" },
  //                   { field: "usageTypeMr" },
  //                   { field: "eligible" },
  //                   { field: "ineligible" },
  //                   { field: "previousAmount" },
  //                   { field: "currentAmount" },
  //                   { field: "overAmount" },
  //                   { field: "totalAmount" },
  //                 ],
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   // {
  //   //   groupId: language == "en" ? "Combined Service Charges" : "एकत्रित सेवा शुल्क",
  //   //   children: [{ field: 'previousAmount' },{field: 'currentAmount'},{field: 'overAmount'},{field: 'totalAmount'}],
  //   //   minWidth: 700,
  //   //   headerAlign: "center",
  //   //   align: "center",
  //   // },
  // ];

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

  ///////////////////////////////////////////

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

  return (
    <ThemeProvider theme={theme}>
      <>
        <BreadcrumbComponent />
      </>
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginLeft: "10px",
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
        }}
      >
        <Box>
          <Grid container className={commonStyles.title}>
            <Grid item xs={1}>
              <IconButton
                style={{
                  color: "white",
                }}
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs={11}>
              <h3
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginRight: "2rem",
                }}
              >
                <FormattedLabel id="demandReport" />
              </h3>
            </Grid>
          </Grid>
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
              >
                <Grid container sx={{ marginTop: "20px" }}>
                  {/* slum */}

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.slumKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {<FormattedLabel id="slumName" required />}
                      </InputLabel>
                      <Controller
                        name="slumKey"
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            // {...field}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            // {...register("slumKey")}

                            label={<FormattedLabel id="slumName" required />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {slumDropDown &&
                              slumDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en" ? each.slumEn : each.slumMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.slumKey ? errors.slumKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Usage Type */}

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.usageKey}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {/* Location Name */}
                        {<FormattedLabel id="usageType" required />}
                      </InputLabel>
                      <Controller
                        name="usageKey"
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            // {...field}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                            // {...register("usageKey")}

                            label={<FormattedLabel id="usageType" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {usageDropDown &&
                              usageDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en" ? each.usage : each.usageMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.usageKey ? errors.usageKey.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container>
                  {/* From Date */}

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
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
                                  <FormattedLabel id="fromDate" required />
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

                  {/* To Date */}

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white" }}
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
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
                                  <FormattedLabel id="toDate" required />
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
              </Grid>

              {/* ////////////////////////////// */}

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
                      disabled={
                        watch("slumKey") == null || watch("usageKey") == null
                      }
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
                      {<FormattedLabel id="downloadEXCELL" />}
                    </Button>
                  </Paper>
                </Grid>
                {/* ////////////////////////////// */}
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
                      color="primary"
                      endIcon={<DownloadIcon />}
                      // onClick={() => generatePDF(data)}
                      onClick={() => handlePrint()}
                    >
                      {<FormattedLabel id="print" />}
                    </Button>
                  </Paper>
                </Grid>

                {/* //////////////////////////////////// */}

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
                      color="error"
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
            // <div style={{ width: "100%" }}>
            //   <DataGrid
            //     autoHeight
            //     experimentalFeatures={{ columnGrouping: true }}
            //     sx={{
            //       overflowY: "scroll",
            //       "& .MuiDataGrid-virtualScrollerContent": {
            //         // backgroundColor:'red',
            //         // height: '800px !important',
            //         // display: "flex",
            //         // flexDirection: "column-reverse",
            //         // overflow:'auto !important'
            //       },
            //       "& .MuiDataGrid-columnHeadersInner": {
            //         backgroundColor: "#556CD6",
            //         color: "white",
            //       },

            //       "& .MuiDataGrid-cell:hover": {
            //         color: "primary.main",
            //       },
            //     }}
            //     // disableColumnFilter
            //     // disableColumnSelector
            //     // disableDensitySelector
            //     components={{ Toolbar: GridToolbar }}
            //     componentsProps={{
            //       toolbar: {
            //         showQuickFilter: true,
            //         quickFilterProps: { debounceMs: 0 },
            //         disableExport: true,
            //         disableToolbarButton: false,
            //         csvOptions: { disableToolbarButton: false },
            //         printOptions: { disableToolbarButton: true },
            //       },
            //     }}
            //     rows={data ? data : []}
            //     columns={columns}
            //     density="standard"
            //     pageSize={10}
            //     rowsPerPageOptions={[10]}
            //     disableSelectionOnClick
            //     columnGroupingModel={columnGroupingModel}
            //   />
            // </div>

            <Grid
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "1%",
              }}
            >
              <Card>
                <div style={{ width: "100%" }}>
                  {/* <table> */}
                  <ReportLayout
                    componentRef={componentRef}
                    rows={data ? data : []}
                    columnLength={27}
                    className={styles.report_table}
                  >
                    <tbody>
                      <tr>
                        <th colspan="12">
                          <h3>
                            <b>Pimpri Chinchwad Municipal Corporation</b>
                          </h3>
                        </th>
                      </tr>

                      <tr>
                        <th colspan="12">
                          <h3>
                            <b>Slum Department</b>
                          </h3>
                        </th>
                      </tr>

                      <tr>
                        <th colspan="12">
                          <h3>
                            <b>Hut Occupier/Hut Wise Demand Report No 2</b>
                          </h3>
                        </th>
                      </tr>

                      <tr
                        style={{
                          width: "100%",
                        }}
                      >
                        <td colSpan={6}>
                          <h3>
                            <b>Slum Name:</b>
                          </h3>{" "}
                        </td>
                        <td
                          colSpan={6}
                          style={{
                            width: "50%",
                          }}
                        >
                          {" "}
                          <h3>
                            <b>Year:</b>
                          </h3>{" "}
                        </td>
                      </tr>

                      <tr>
                        <th rowSpan={3}>
                          <h3>
                            <b>Sr. No</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Hut Occupier Name</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Hut No</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Area Of Hut</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Usage Type</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Eligible</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Ineligible</b>
                          </h3>
                        </th>
                        <th colSpan={3} rowSpan={1}>
                          <h3>
                            <b>Demand</b>
                          </h3>
                        </th>
                        <th colSpan={3} rowSpan={1}>
                          <h3>
                            <b>Combined service Charge</b>
                          </h3>
                        </th>
                        <th colSpan={1} rowSpan={1}>
                          <h3>
                            <b>Previous</b>
                          </h3>
                        </th>

                        <th colSpan={1} rowSpan={1}>
                          <h3>
                            <b>Current</b>
                          </h3>
                        </th>

                        <th colSpan={1} rowSpan={1}>
                          <h3>
                            <b>Total</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>If Amount Is Paid</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Recovered</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Arrears</b>
                          </h3>
                        </th>
                        <th rowSpan={3}>
                          <h3>
                            <b>Extra Recovered</b>
                          </h3>
                        </th>
                      </tr>

                      <tr></tr>

                      <tr></tr>
                    </tbody>
                  </ReportLayout>
                  {/* </table> */}
                </div>
              </Card>
            </Grid>
          ) : (
            ""
          )}
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default Index;
