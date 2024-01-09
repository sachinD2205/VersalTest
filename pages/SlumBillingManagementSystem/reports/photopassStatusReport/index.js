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
  IconButton,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import ListAltIcon from "@mui/icons-material/List";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
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
  });

  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [slumDropDown, setSlumDropDown] = useState([]);
  const [villageDropDown, setVillageDropDown] = useState([]);
  const [casteDropDown, setCasteDropDown] = useState([]);
  const [usageDropDown, setUsageDropDown] = useState([]);
  const [usageSubTypeDropDown, setUsageSubTypeDropDown] = useState([]);
  const [hutDropDown, setHutDropDown] = useState([]);
  const [zoneObj, setZoneObj] = useState();
  const [slumObj, setSlumObj] = useState();
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const language = useSelector((store) => store.labels.language);
  const user = useSelector((state) => state.user.user);
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
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle:language == "en" ? "Photopass status report" : "झोपडीनुसार तपशील"
  });

  useEffect(() => {
    getZoneData();
    getSlumData();
    getUsageData();
    getVillageData();
    getUsageSubTypeData();
    getHutData();
  }, []);

  const getVillageData = () => {
    axios
      .get(`${urls.CFCURL}/master/village/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let result = res.data.village;
        let _res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              villageEn: r.villageName,
              villageMr: r.villageNameMr,
            };
          });
        setVillageDropDown(_res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

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

  const getUsageSubTypeData = () => {
    axios
      .get(`${urls.SLUMURL}/mstSbSubUsageType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setUsageSubTypeDropDown(
          res.data.mstSbSubUsageTypeList?.map((r, i) => ({
            id: r.id,
            usageSubType: r.subUsageType,
            usageSubTypeMr: r.subUsageTypeMr,
          }))
        );
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getHutData = () => {
    axios
      .get(`${urls.SLUMURL}/mstHut/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setHutDropDown(res.data.mstHutList);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  let resetValuesCancell = {
    zoneKey: "",
    slumKey: "",
    hutNo: "",
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const onSubmitFunc = () => {
    if ( watch("hutNo")) {
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
      let apiBodyToSend = {
        slumKey: watch("slumKey"),
        zoneKey: watch("zoneKey"),
        hutNo: watch("hutNo"),
      };

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(
          `${urls.SLUMURL}/report/getPhotopassStatusReport`,
          apiBodyToSend,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          console.log(":log", res);
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,

                  hutNo: r.hutNo,
                  applicationNo: r?.applicationNo,

                  applicantName: `${r?.applicantFirstName} ${r?.applicantMiddleName} ${r?.applicantLastName}`,
                  applicantNameMr: `${r?.applicantFirstNameMr} ${r?.applicantMiddleNameMr} ${r?.applicantLastNameMr}`,

                  mobileNo: r?.applicantMobileNo,
                  adharNo: r?.applicantAadharNo,
                  clerkApprovalRemark: r?.clerkApprovalRemark,
                  headClerkApprovalRemark: r?.headClerkApprovalRemark,
                  officeSuperintendantApprovalRemark:
                    r?.officeSuperintendantApprovalRemark,
                  administrativeOfficerApprovalRemark:
                    r?.administrativeOfficerApprovalRemark,
                  assistantCommissionerApprovalRemark:
                    r?.assistantCommissionerApprovalRemark,

                  slumName: !slumDropDown?.find((obj) => {
                    return obj.id == r?.slumKey;
                  })
                    ? "-"
                    : slumDropDown.find((obj) => {
                        return obj.id == r?.slumKey;
                      }).slumEn,

                  slumNameMr: !slumDropDown?.find((obj) => {
                    return obj.id == r?.slumKey;
                  })
                    ? "-"
                    : slumDropDown.find((obj) => {
                        return obj.id == r?.slumKey;
                      }).slumMr,

                  zone: !zoneDropDown?.find((obj) => {
                    return obj.id == r?.zoneKey;
                  })
                    ? "-"
                    : zoneDropDown.find((obj) => {
                        return obj.id == r?.zoneKey;
                      }).zoneEn,

                  zoneMr: !zoneDropDown?.find((obj) => {
                    return obj.id == r?.zoneKey;
                  })
                    ? "-"
                    : zoneDropDown.find((obj) => {
                        return obj.id == r?.zoneKey;
                      }).zoneMr,

                  village: !villageDropDown?.find((obj) => {
                    return obj.id == r?.villageKey;
                  })
                    ? "-"
                    : villageDropDown.find((obj) => {
                        return obj.id == r?.villageKey;
                      }).villageEn,

                  villageMr: !villageDropDown?.find((obj) => {
                    return obj.id == r?.villageKey;
                  })
                    ? "-"
                    : villageDropDown.find((obj) => {
                        return obj.id == r?.villageKey;
                      }).villageMr,
                }))
              );
              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Hut No": r.hutNo,
                  "Application No": r?.applicationNo,

                  "Applicant Name": `${r?.applicantFirstName} ${r?.applicantMiddleName} ${r?.applicantLastName}`,

                  "Mobile No": r?.applicantMobileNo,
                  "Adhar No": r?.applicantAadharNo,
                  "Clerk Approval Remark": r?.clerkApprovalRemark,
                  "Head Clerk Approval Remark": r?.headClerkApprovalRemark,
                  "Office Superintendant Approval Remark":
                    r?.officeSuperintendantApprovalRemark,
                  administrativeOfficerApprovalRemark:
                    r?.administrativeOfficerApprovalRemark,
                  assistantCommissionerApprovalRemark:
                    r?.assistantCommissionerApprovalRemark,

                  "Slum Name": !slumDropDown?.find((obj) => {
                    return obj.id == r?.slumKey;
                  })
                    ? "-"
                    : slumDropDown.find((obj) => {
                        return obj.id == r?.slumKey;
                      }).slumEn,

                  Zone: !zoneDropDown?.find((obj) => {
                    return obj.id == r?.zoneKey;
                  })
                    ? "-"
                    : zoneDropDown.find((obj) => {
                        return obj.id == r?.zoneKey;
                      }).zoneEn,

                  Village: !villageDropDown?.find((obj) => {
                    return obj.id == r?.villageKey;
                  })
                    ? "-"
                    : villageDropDown.find((obj) => {
                        return obj.id == r?.villageKey;
                      }).villageEn,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  "झोपडी क्रमांक": r.hutNo,

                  "अर्ज क्र": r?.applicationNo,

                  "अर्जदाराचे नाव": `${r?.applicantFirstNameMr} ${r?.applicantMiddleNameMr} ${r?.applicantLastNameMr}`,

                  "मोबाईल क्र": r?.applicantMobileNo,
                  "आधार क्र": r?.applicantAadharNo,
                  "लिपिक मंजूरी टिप्पणी": r?.clerkApprovalRemark,
                  "मुख्य लिपिक मंजूरी टिप्पणी": r?.headClerkApprovalRemark,
                  "कार्यालय अधीक्षक अनुमोदन टिप्पणी":
                    r?.officeSuperintendantApprovalRemark,
                  administrativeOfficerApprovalRemark:
                    r?.administrativeOfficerApprovalRemark,
                  assistantCommissionerApprovalRemark:
                    r?.assistantCommissionerApprovalRemark,

                  "झोपडपट्टीचे नाव": !slumDropDown?.find((obj) => {
                    return obj.id == r?.slumKey;
                  })
                    ? "-"
                    : slumDropDown.find((obj) => {
                        return obj.id == r?.slumKey;
                      }).slumMr,

                  झोन: !zoneDropDown?.find((obj) => {
                    return obj.id == r?.zoneKey;
                  })
                    ? "-"
                    : zoneDropDown.find((obj) => {
                        return obj.id == r?.zoneKey;
                      }).zoneMr,

                  गाव: !villageDropDown?.find((obj) => {
                    return obj.id == r?.villageKey;
                  })
                    ? "-"
                    : villageDropDown.find((obj) => {
                        return obj.id == r?.villageKey;
                      }).villageMr,
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
          // sweetAlert(error);
          setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    } else {
      sweetAlert({
        title: language == "en" ? "Oops!" : "क्षमस्व!",
        text:
          language == "en"
            ? "Hut No. is required!"
            : "झोपडी क्रमांक आवश्यक आहे!",
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
      flex: 1,
      width: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "applicantName" : "applicantNameMr",
      headerName: <FormattedLabel id="applicantName" />,
      width: 400,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mobileNo",
      headerName: <FormattedLabel id="mobileNo" />,
      width: 300,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "adharNo",
      headerName: <FormattedLabel id="AadharNo" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hutNo",
      headerName: <FormattedLabel id="hutNo" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "slumName",
      headerName: <FormattedLabel id="slumName" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "zone",
      headerName: <FormattedLabel id="zone" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "village",
      headerName: <FormattedLabel id="village" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "clerkApprovalRemark",
      headerName: <FormattedLabel id="clerk" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "headClerkApprovalRemark",
      headerName: <FormattedLabel id="headClerk" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "officeSuperintendantApprovalRemark",
      headerName: <FormattedLabel id="officeSuperintendant" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "administrativeOfficerApprovalRemark",
      headerName: <FormattedLabel id="administrativeOfficer" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "assistantCommissionerApprovalRemark",
      headerName: <FormattedLabel id="assistantCommissioner" />,
      width: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];


  function generateCSVFile(data) {
    const keyNames = Object.keys(data[0]);
    const csv = [
      columns.map((c) => c.headerName).join(","),
      ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
    ].join("\n");
    const fileName =
      language == "en" ? "Photopass status report" : "झोपडीनुसार तपशील";
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
          ? `Report Name: Photopass status report`
          : `अहवालाचे नाव: फोटोपास स्थिती अहवाल`,
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
                <FormattedLabel id="photopassStatusReport" />
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
                {/* slum */}
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
                      {<FormattedLabel id="slumName"  />}
                    </InputLabel>
                    <Controller
                      name="slumKey"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id="slumName" />}
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

                {/* Zone */}
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
                      {<FormattedLabel id="zone" />}
                    </InputLabel>
                    <Controller
                      name="zoneKey"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}

                          label={<FormattedLabel id="zone" />}
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

                {/* Hut No */}

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
                  <TextField
                    sx={{ width: "250px" }}
                    label={<FormattedLabel id="hutNo" required />}
                    variant="standard"
                    {...register("hutNo")}
                    InputLabelProps={{
                      shrink: watch("hutNo") ? true : false,
                    }}
                    error={!!errors.hutNo}
                    helperText={errors?.hutNo ? errors.hutNo.message : null}
                  />
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
