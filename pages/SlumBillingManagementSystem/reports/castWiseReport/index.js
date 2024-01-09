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
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import theme from "../../../../theme";
import sweetAlert from "sweetalert";
import ClearIcon from "@mui/icons-material/Clear";
import ListAltIcon from "@mui/icons-material/List";
import { useSelector } from "react-redux";
import axios from "axios";
import urls from "../../../../URLS/urls";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import "jspdf-autotable";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/router";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import BreadcrumbComponent from "../../../../components/common/BreadcrumbComponent";
import CommonLoader from "../../../../containers/reuseableComponents/commonLoader";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cfcCatchMethod,moduleCatchMethod } from "../../../../util/commonErrorUtil";
const Index = () => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
  });
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [slumDropDown, setSlumDropDown] = useState([]);
  const [religionDropDown, setReligionDropDown] = useState([]);
  const [casteDropDown, setCasteDropDown] = useState([]);
  const [usageDropDown, setUsageDropDown] = useState([]);
  const [hutDropDown, setHutDropDown] = useState([]);
  const [castObj, setCastObj] = useState();
  const [religionObj, setReligionObj] = useState();
  const [zoneObj, setZoneObj] = useState();
  const [slumObj, setSlumObj] = useState();
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const router = useRouter();
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
    documentTitle: language==='en'?"Cast Wise Report":'जातनिहाय अहवाल',
  });

  useEffect(() => {
    getZoneData();
    getSlumData();
    getReligionData();
    getCasteData();
    getUsageData();
    getHutData();
  }, []);

  const getZoneData = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }).then((res) => {
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

  const getReligionData = () => {
    axios
      .get(`${urls.CFCURL}/master/religion/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.religion;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              religionEn: r.religion,
              religionMr: r.religionMr,
            };
          });
        setReligionDropDown(res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
      });
  };

  const getCasteData = () => {
    axios
      .get(`${urls.CFCURL}/master/cast/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((r) => {
        let result = r.data.mCast;
        let res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              casteEn: r.cast,
              casteMr: r.castMr,
            };
          });
        setCasteDropDown(res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, true);
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
    fromDate: null,
    toDate: null,
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const onSubmitFunc = () => {
    // if (watch("slumKey") && watch("zoneKey")) {
      setCastObj({
        casteEn: !casteDropDown?.find((obj) => {
          return obj.id == watch("castKey");
        })
          ? "-"
          : casteDropDown.find((obj) => {
              return obj.id == watch("castKey");
            }).casteEn,
        casteMr: !casteDropDown?.find((obj) => {
          return obj.id == watch("castKey");
        })
          ? "-"
          : casteDropDown.find((obj) => {
              return obj.id == watch("castKey");
            }).casteMr,
      });

      setReligionObj({
        religionEn: !religionDropDown?.find((obj) => {
          return obj.id == watch("religionKey");
        })
          ? "-"
          : religionDropDown.find((obj) => {
              return obj.id == watch("religionKey");
            }).religionEn,
        religionMr: !religionDropDown?.find((obj) => {
          return obj.id == watch("religionKey");
        })
          ? "-"
          : religionDropDown.find((obj) => {
              return obj.id == watch("religionKey");
            }).religionMr,
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

      let apiBodyToSend = {
        slumKey: watch("slumKey"),
        zoneKey: watch("zoneKey"),
        castKey: watch("casteKey"),
        religionKey: watch("religionKey"),
      };
      setLoading(true);
      axios
        .post(`${urls.SLUMURL}/report/getCastwiseReport`, apiBodyToSend, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  hutNo: r.hutNo,
                  ownerName: r.hutOwnerName,
                  ownerNameMr: r.ownerNameMr,
                  hutArea: !hutDropDown?.find((obj) => {
                    return obj.id == r?.hutKey;
                  })
                    ? "-"
                    : hutDropDown.find((obj) => {
                        return obj.id == r?.hutKey;
                      }).areaOfHut,
                  casteEn: !casteDropDown?.find((obj) => {
                    return obj.id == r?.castKey;
                  })
                    ? "-"
                    : casteDropDown.find((obj) => {
                        return obj.id == r?.castKey;
                      }).casteEn,
                  casteMr: !casteDropDown?.find((obj) => {
                    return obj.id == r?.castKey;
                  })
                    ? "-"
                    : casteDropDown.find((obj) => {
                        return obj.id == r?.castKey;
                      }).casteMr,
                  usage: !usageDropDown?.find((obj) => {
                    return obj.id == r?.usegekey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usegekey;
                      }).usage,
                  usageMr: !usageDropDown?.find((obj) => {
                    return obj.id == r?.usegekey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usegekey;
                      }).usageMr,
                  handicap: r?.handicap ? "Yes" : "No",
                  widow: r?.widow ? "Yes" : "No",
                  handicapMr: r?.handicap ? "होय" : "नाही",
                  widowMr: r?.widow ? "होय" : "नाही",
                  eligibleIneligibleCriteria: r.eligibleIneligibleCriteria,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Hut No": r.hutNo,
                  "Owner Name": r.hutOwnerName,
                  "Hut Area": !hutDropDown?.find((obj) => {
                    return obj.id == r?.hutKey;
                  })
                    ? "-"
                    : hutDropDown.find((obj) => {
                        return obj.id == r?.hutKey;
                      }).areaOfHut,
                  Cast: !casteDropDown?.find((obj) => {
                    return obj.id == r?.castKey;
                  })
                    ? "-"
                    : casteDropDown.find((obj) => {
                        return obj.id == r?.castKey;
                      }).casteEn,

                  Usage: !usageDropDown?.find((obj) => {
                    return obj.id == r?.usegekey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usegekey;
                      }).usage,

                  Handicap: r?.handicap ? "Yes" : "No",
                  Widow: r?.widow ? "Yes" : "No",
                  "Eligible Ineligible Criteria": r.eligibleIneligibleCriteria,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  "झोपडी क्रमांक": r.hutNo,
                  "मालकाचे नाव": r.ownerNameMr,
                  "झोपडी क्षेत्र": !hutDropDown?.find((obj) => {
                    return obj.id == r?.hutKey;
                  })
                    ? "-"
                    : hutDropDown.find((obj) => {
                        return obj.id == r?.hutKey;
                      }).areaOfHut,

                  जात: !casteDropDown?.find((obj) => {
                    return obj.id == r?.castKey;
                  })
                    ? "-"
                    : casteDropDown.find((obj) => {
                        return obj.id == r?.castKey;
                      }).casteMr,

                  वापर: !usageDropDown?.find((obj) => {
                    return obj.id == r?.usegekey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usegekey;
                      }).usageMr,

                  अपंग: r?.handicap ? "होय" : "नाही",
                  विधवा: r?.widow ? "होय" : "नाही",
                  "पात्र अपात्र निकष": r.eligibleIneligibleCriteria,
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
        .catch((error) => {
          setData([]);
          setLoading(false);
          cfcErrorCatchMethod(error, false);
        });
  };

  const columns = [
    {
      field: "id",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hutNo",
      headerName: <FormattedLabel id="hutNo" />,
      width: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "ownerName" : "ownerNameMr",
      headerName: <FormattedLabel id="ownerName" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hutArea",
      headerName: <FormattedLabel id="hutArea" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "usage" : "usageMr",
      headerName: <FormattedLabel id="usageType" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "casteEn" : "casteMr",
      headerName: <FormattedLabel id="caste" />,
      width: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "handicap" : "handicapMr",
      headerName: <FormattedLabel id="handicap" />,
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "widow" : "widowMr",
      headerName: <FormattedLabel id="widow" />,
      width: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "eligibleIneligibleCriteria",
      headerName: <FormattedLabel id="eligibleIneligibleCriteria" />,
      width: 200,
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
    const fileName = language == "en" ? "Cast wise report" : "जातनिहाय अहवाल";
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
      v: language == "en" ? `Cast wise report` : `जातनिहाय अहवाल`,
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
          ? `Religion: ${religionObj?.religionEn}`
          : `धर्म: ${religionObj?.religionMr}`,
      s: dataStyle,
    };
    ws.F7 = {
      t: "s",
      v:
        language == "en"
          ? `Caste: ${castObj?.casteEn}`
          : `जात: ${castObj?.casteMr}`,
      s: dataStyle,
    };
    ws.F8 = {
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
                <FormattedLabel id="casteWiseReport" />
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
                    error={!!errors.religionKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="religion"  />}
                    </InputLabel>
                    <Controller
                      name="religionKey"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id="religion"  />}
                        >
                          {religionDropDown &&
                            religionDropDown.map((each, index) => (
                              <MenuItem key={index} value={each.id}>
                                {language == "en"
                                  ? each.religionEn
                                  : each.religionMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.religionKey ? errors.religionKey.message : null}
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
                    error={!!errors.casteKey}
                  >
                    <InputLabel id="demo-simple-select-standard-label">
                      {<FormattedLabel id="caste"  />}
                    </InputLabel>
                    <Controller
                      name="casteKey"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          label={<FormattedLabel id="caste"  />}
                        >
                          {casteDropDown &&
                            casteDropDown.map((each, index) => (
                              <MenuItem key={index} value={each.id}>
                                {language == "en" ? each.casteEn : each.casteMr}
                              </MenuItem>
                            ))}
                        </Select>
                      )}
                      control={control}
                      defaultValue=""
                    />
                    <FormHelperText>
                      {errors?.casteKey ? errors.casteKey.message : null}
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
                      onClick={() => {
                        handlePrint();
                      }}
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
              <div
                style={{
                  width: "100%",
                }}
              >
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
