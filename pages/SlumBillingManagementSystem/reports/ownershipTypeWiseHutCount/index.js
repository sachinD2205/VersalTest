import { ThemeProvider } from "@emotion/react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import moment from "moment";
import ListAltIcon from "@mui/icons-material/List";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import { useRouter } from "next/router";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const Index = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
  });

  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateObj, setDateObj] = useState();
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [slumDropDown, setSlumDropDown] = useState([]);
  const [ownershipDropDown, setOwnershipDropDown] = useState([]);
  const [ownershipObj, setOwnershipObj] = useState();
  const [zoneObj, setZoneObj] = useState();
  const [slumObj, setSlumObj] = useState();
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const currDate = new Date();
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
  const language = useSelector((store) => store.labels.language);
  const user = useSelector((state) => state.user.user);
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:  language == "en"
    ? "Ownership type wise hut count"
    : "मालकी प्रकारानुसार झोपडीची संख्या"
  });

  useEffect(() => {
    getZoneData();
    getSlumData();
    getOwnershipData();
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

  const getOwnershipData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbOwnershipType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.mstSbOwnershipTypeList;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              ownershipEn: r.ownershipType,
              ownershipMr: r.ownershipTypeMr,
            };
          });
        setOwnershipDropDown(res);
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
    if (watch("fromDate") && watch("toDate")) {
       setSlumObj({
        slumEn: !slumDropDown?.find((obj) => {
          return obj.id == watch("slumKey");
        })
          ? "-"
          : slumDropDown.find((obj) => {
              return obj.id == watch("slumKey");
            }).slumEn,
        slumMr: !slumDropDown?.find((obj) => {
          return obj.id == watch("slumKey");
        })
          ? "-"
          : slumDropDown.find((obj) => {
              return obj.id == watch("slumKey");
            }).slumMr,
      });
      setZoneObj({
        zoneEn: !zoneDropDown?.find((obj) => {
          return obj.id == watch("zoneKey");
        })
          ? "-"
          : zoneDropDown.find((obj) => {
              return obj.id == watch("zoneKey");
            }).zoneEn,
        zoneMr: !zoneDropDown?.find((obj) => {
          return obj.id == watch("zoneKey");
        })
          ? "-"
          : zoneDropDown.find((obj) => {
              return obj.id == watch("zoneKey");
            }).zoneMr,
      });
      setOwnershipObj({
        ownershipEn: !ownershipDropDown?.find((obj) => {
          return obj.id == watch("ownershipKey");
        })
          ? "-"
          : ownershipDropDown.find((obj) => {
              return obj.id == watch("ownershipKey");
            }).ownershipEn,
        ownershipMr: !ownershipDropDown?.find((obj) => {
          return obj.id == watch("ownershipKey");
        })
          ? "-"
          : ownershipDropDown.find((obj) => {
              return obj.id == watch("ownershipKey");
            }).ownershipMr,
      });
      let sendFromDate = moment(watch("fromDate")).format(
        "YYYY-MM-DD hh:mm:ss"
      );
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DD hh:mm:ss");

      let apiBodyToSend = {
        slumKey: watch("slumKey"),
        zoneKey: watch("zoneKey"),
        ownershipKey: watch("ownershipKey"),
        strFromDate: sendFromDate,
        strToDate: sendToDate,
      };
      setDateObj({
        from: moment(watch("fromDate")).format("DD-MM-YYYY"),
        to: moment(watch("toDate")).format("DD-MM-YYYY"),
      });
      setLoading(true);
      axios
        .post(
          `${urls.SLUMURL}/report/getOwnershipTypewiseReport`,
          apiBodyToSend,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  hutCount: r.hutCount,
                  ownership: !ownershipDropDown?.find((obj) => {
                    return obj.id == r?.ownershipType;
                  })
                    ? "-"
                    : ownershipDropDown.find((obj) => {
                        return obj.id == r?.ownershipType;
                      }).ownershipEn,
                  ownershipMr: !ownershipDropDown?.find((obj) => {
                    return obj.id == r?.ownershipType;
                  })
                    ? "-"
                    : ownershipDropDown.find((obj) => {
                        return obj.id == r?.ownershipType;
                      }).ownershipMr,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Hut Count": r.hutCount,
                  Ownership: !ownershipDropDown?.find((obj) => {
                    return obj.id == r?.ownershipType;
                  })
                    ? "-"
                    : ownershipDropDown.find((obj) => {
                        return obj.id == r?.ownershipType;
                      }).ownershipEn,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  "झोपडी गणना": r.hutCount,

                  मालकी: !ownershipDropDown?.find((obj) => {
                    return obj.id == r?.ownershipType;
                  })
                    ? "-"
                    : ownershipDropDown.find((obj) => {
                        return obj.id == r?.ownershipType;
                      }).ownershipMr,
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
            ? "Both Dates Are Required!"
            : "दोन्ही तारखा आवश्यक आहेत!",
        icon: "warning",
        dangerMode: false,
        closeOnClickOutside: false,
        button: language === "en" ? "Ok" : "ठीक आहे",
      });
      setData([]);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "ownership" : "ownershipMr",
      headerName: <FormattedLabel id="ownership" />,
      width: 500,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hutCount",
      headerName: <FormattedLabel id="hutCount" />,
      width: 500,
      headerAlign: "center",
      align: "center",
    },
  ];


  function generateCSVFile(data) {
    console.log("data", data);
    const keyNames = Object.keys(data[0]);
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    const fileName =
      language == "en"
        ? "Ownership type wise hut count"
        : "मालकी प्रकारानुसार झोपडीची संख्या";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A11" });
    const boldFont = { bold: true };
    const fontSize = 16;
    const headerStyle = {
      font: { ...boldFont, size: fontSize },
    };
    const dataStyle = {
      font: { ...boldFont, size: fontSize },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const columnWidths = keyNames.map((column) => column.length);

    keyNames.forEach((column, index) => {
      const cell = XLSX.utils.encode_cell({ r: 10, c: index });
      ws[cell] = {
        t: "s",
        v: column,
        s: headerStyle,
      };

      const columnWidth = (columnWidths[index] + 2) * 10;
      if (!ws["!cols"]) ws["!cols"] = [];
      ws["!cols"][index] = { wpx: columnWidth };
    });
    ws.F1 = {
      t: "s",
      v:
        language == "en"
          ? "Pimpri-Chinchwad Municipal Corporation"
          : "पिंपरी-चिंचवड महानगरपालिका",
      s: dataStyle,
    };
    ws.F2 = {
      t: "s",
      v:
        language == "en"
          ? "Mumbai-Pune Road, Pimpri - 411018"
          : "मुंबई-पुणे रोड, पिंपरी - ४११ ०१८",
      s: dataStyle,
    };
    ws.F3 = {
      t: "s",
      v:
        language == "en"
          ? `Department Name: Slum Billing Management System`
          : `विभागाचे नाव: झोपडपट्टी बिलिंग व्यवस्थापन प्रणाली`,
      s: dataStyle,
    };
    ws.F4 = {
      t: "s",
      v:
        language == "en"
          ? `Report Name: Ownership type wise hut count`
          : `अहवालाचे नाव: मालकी प्रकारानुसार झोपडीची संख्या`,
      s: dataStyle,
    };
    ws.F5 = {
      t: "s",
      v:
        language == "en"
          ? `Slum Name: ${slumObj?.slumEn}`
          : `झोपडपट्टीचे नाव: ${slumObj?.slumMr}`,
      s: dataStyle,
    };

    ws.F6 = {
      t: "s",
      v:
        language == "en"
          ? `Zone: ${zoneObj?.zoneEn}`
          : `झोन: ${zoneObj?.zoneMr}`,
      s: dataStyle,
    };
    ws.F7 = {
      t: "s",
      v:
        language == "en"
          ? `Zone: ${ownershipObj?.ownershipEn}`
          : `झोन: ${ownershipObj?.ownershipMr}`,
      s: dataStyle,
    };
    ws.F8 = {
      t: "s",
      v:
        language == "en"
          ? `From Date: ${dateObj?.from}`
          : `तारखेपासून: ${dateObj?.from}`,
      s: dataStyle,
    };
    ws.F9 = {
      t: "s",
      v:
        language == "en"
          ? `To Date: ${dateObj?.to}`
          : `तारखेपर्यंत: ${dateObj?.to}`,
      s: dataStyle,
    };

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
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
                <FormattedLabel id="ownershipTypeWiseReport" />
              </h3>
            </Grid>
          </Grid>
        </Box>
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
                <Grid
                  item
                  xl={4}
                  lg={4}
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
                    variant="standard"
                    size="small"
                    sx={{ m: 1, minWidth: "50%" }}
                    error={!!errors.slumKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="slumName" />}
                    </InputLabel>
                    <Controller
                      name="slumKey"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id="slumName"  />}
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
                <Grid
                  item
                  xl={4}
                  lg={4}
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
                    variant="standard"
                    size="small"
                    sx={{ m: 1, minWidth: "50%" }}
                    error={!!errors.zoneKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="zone"  />}
                    </InputLabel>
                    <Controller
                      name="zoneKey"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id="zone"  />}
                        >
                          {zoneDropDown &&
                            zoneDropDown.map((each, index) => (
                              <MenuItem key={index} value={each.id}>
                                {language == "en" ? each.zoneEn : each.zoneMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.zoneKey ? errors.zoneKey.message : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                {/* Ownership */}
                <Grid
                  item
                  xl={4}
                  lg={4}
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
                    variant="standard"
                    size="small"
                    sx={{ m: 1, minWidth: "50%" }}
                    error={!!errors.ownershipKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="ownership" />}
                    </InputLabel>
                    <Controller
                      name="ownershipKey"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id="ownership" />}
                        >
                          {ownershipDropDown &&
                            ownershipDropDown.map((each, index) => (
                              <MenuItem key={index} value={each.id}>
                                {language == "en"
                                  ? each.ownershipEn
                                  : each.ownershipMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.ownershipKey
                        ? errors.ownershipKey.message
                        : null}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xl={4}
                  lg={4}
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
                                <FormattedLabel id="fromDate" required/>
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
                  xl={4}
                  lg={4}
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
                    error={!!errors.toDate}
                  >
                    <Controller
                      control={control}
                      name="toDate"
                      defaultValue={currDate}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            disableFuture
                            minDate={watch("fromDate")}
                            inputFormat="DD/MM/YYYY"
                            label={
                              <span style={{ fontSize: 16 }}>
                                <FormattedLabel id="toDate" required/>
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

              <Grid
                container
                style={{
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
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
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={
                        watch("slumKey") == null || watch("zoneKey") == null
                      }
                      color="success"
                      endIcon={<ArrowUpwardIcon />}
                    >
                      {<FormattedLabel id="submit" />}
                    </Button>
                  </Paper>
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
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >

                    <Button
                      size="small"
                      disabled={data?.length > 0 ? false : true}
                      type="button"
                      variant="contained"
                      color="success"
                      endIcon={<ListAltIcon />}
                      onClick={() =>
                        language == "en"
                          ? generateCSVFile(engReportsData)
                          : generateCSVFile(mrReportsData)
                      }
                    >
                      {language == "en"
                        ? "Download Excel"
                        : "एक्सेल डाउनलोड करा"}
                    </Button>
                  </Paper>
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
                      onClick={() => handlePrint()}
                    >
                      {<FormattedLabel id="print" />}
                    </Button>
                  </Paper>
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
                  <Paper
                    elevation={4}
                    style={{ margin: "30px", width: "auto" }}
                  >
                    <Button
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
            <Grid
              item
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
              <div style={{ width: "100%" }}>
          
                <ReportLayout
                  componentRef={componentRef}
                  rows={data ? data : []}
                  columns={columns}
                />
              </div>
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
