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
import ListAltIcon from "@mui/icons-material/List";
import urls from "../../../../URLS/urls";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import "jspdf-autotable";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import { useReactToPrint } from "react-to-print";
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
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
  });

  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [slumDropDown, setSlumDropDown] = useState([]);
  const [villageDropDown, setVillageDropDown] = useState([]);
  const [constructionTypeDropDown, setConstructionTypeDropDown] = useState([]);
  const [usageDropDown, setUsageDropDown] = useState([]);
  const [usageSubTypeDropDown, setUsageSubTypeDropDown] = useState([]);
  const [hutDropDown, setHutDropDown] = useState([]);
  const [zoneObj, setZoneObj] = useState();
  const [slumObj, setSlumObj] = useState();
  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const language = useSelector((store) => store.labels.language);
  //get logged in user
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
    documentTitle: language == "en" ? "Hut wise detail report" : "झोपडीनुसार तपशील"
  });

  useEffect(() => {
    getZoneData();
    getSlumData();
    getUsageData();
    getVillageData();
    getUsageSubTypeData();
    getConstructionTypeData();
  }, []);

  const getConstructionTypeData = () => {
    axios
      .get(`${urls.SLUMURL}/mstConstructionType/getAll`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        let result = res.data.mstConstructionTypeList;
        let _res =
          result &&
          result.map((r) => {
            return {
              id: r.id,
              constructionTypeEn: r.constructionType,
              constructionTypeMr: r.constructionTypeMr,
            };
          });
        setConstructionTypeDropDown(_res);
      }).catch((err)=>{
        cfcErrorCatchMethod(err, false);
      });
  };

  const getVillageData = () => {
    axios.get(`${urls.CFCURL}/master/village/getAll`,{ headers: {
      Authorization: `Bearer ${user.token}`,
    },}).then((res) => {
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
      cfcErrorCatchMethod(err, false);
    });
  };

  const getZoneData = () => {
    axios.get(`${urls.CFCURL}/master/zone/getAll`,{
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
      cfcErrorCatchMethod(err, false);
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
      setLoading(true);
      axios
        .post(`${urls.SLUMURL}/report/getHutWiseDetailReport`, apiBodyToSend, {
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
                  usageType: !usageDropDown?.find((obj) => {
                    return obj.id == r?.usageTypeKey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usageTypeKey;
                      }).usage,
                  usageTypeMr: !usageDropDown?.find((obj) => {
                    return obj.id == r?.usageTypeKey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usageTypeKey;
                      }).usageMr,
                  usageSubType: !usageSubTypeDropDown?.find((obj) => {
                    return obj.id == r?.usageSubTypeKey;
                  })
                    ? "-"
                    : usageSubTypeDropDown.find((obj) => {
                        return obj.id == r?.usageSubTypeKey;
                      }).usageSubType,
                  usageSubTypeMr: !usageSubTypeDropDown?.find((obj) => {
                    return obj.id == r?.usageSubTypeKey;
                  })
                    ? "-"
                    : usageSubTypeDropDown.find((obj) => {
                        return obj.id == r?.usageSubTypeKey;
                      }).usageSubTypeMr,

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

                  constructionType: !constructionTypeDropDown?.find((obj) => {
                    return obj.id == r?.constructionTypeKey;
                  })
                    ? "-"
                    : constructionTypeDropDown.find((obj) => {
                        return obj.id == r?.constructionTypeKey;
                      }).constructionTypeEn,

                  constructionTypeMr: !constructionTypeDropDown?.find((obj) => {
                    return obj.id == r?.constructionTypeKey;
                  })
                    ? "-"
                    : constructionTypeDropDown.find((obj) => {
                        return obj.id == r?.constructionTypeKey;
                      }).constructionTypeMr,

                  areaOfHut: r?.areaOfHut,
                  totalFamilyMembers: r?.totalFamilyMembers,
                  waterConnection: r?.waterConnection,
                  rehabilitation: r?.rehabilitation,
                  eligibility: r?.eligibility,
                  correction: r?.correction,
                  assemblyConstituency: r?.assemblyConstituency,
                  breadth: r?.breadth,
                  height: r?.height,
                  lattitude: r?.lattitude,
                  length: r?.length,
                  longitude: r?.longitude,
                  noOfFloors: r?.noOfFloors,
                  maleCount: r?.maleCount,
                  femaleCount: r?.femaleCount,
                  partNoInList: r?.partNoInList,
                  pincode: r?.pincode,
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Hut No": r.hutNo,
                  "Usage Type": !usageDropDown?.find((obj) => {
                    return obj.id == r?.usageTypeKey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usageTypeKey;
                      }).usage,
                  "Usage Sub Type": !usageSubTypeDropDown?.find((obj) => {
                    return obj.id == r?.usageSubTypeKey;
                  })
                    ? "-"
                    : usageSubTypeDropDown.find((obj) => {
                        return obj.id == r?.usageSubTypeKey;
                      }).usageSubType,
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

                  "Construction Type": !constructionTypeDropDown?.find(
                    (obj) => {
                      return obj.id == r?.constructionTypeKey;
                    }
                  )
                    ? "-"
                    : constructionTypeDropDown.find((obj) => {
                        return obj.id == r?.constructionTypeKey;
                      }).constructionTypeEn,

                  "Area Of Hut": r?.areaOfHut,
                  "Total Family Members": r?.totalFamilyMembers,
                  "Water Connection": r?.waterConnection,
                  Rehabilitation: r?.rehabilitation,
                  Eligibility: r?.eligibility,
                  Correction: r?.correction,
                  "Assembly Constituency": r?.assemblyConstituency,
                  Breadth: r?.breadth,
                  Height: r?.height,
                  Lattitude: r?.lattitude,
                  Length: r?.length,
                  Longitude: r?.longitude,
                  "No Of Floors": r?.noOfFloors,
                  "Male Count": r?.maleCount,
                  "Female Count": r?.femaleCount,
                  "Part No In List": r?.partNoInList,
                  Pincode: r?.pincode,
                }))
              );

              setMrReportsData(
                res?.data?.map((r, i) => ({
                  "अ.क्र.": i + 1,
                  "झोपडी क्रमांक": r.hutNo,

                  "वापराचा प्रकार": !usageDropDown?.find((obj) => {
                    return obj.id == r?.usageTypeKey;
                  })
                    ? "-"
                    : usageDropDown.find((obj) => {
                        return obj.id == r?.usageTypeKey;
                      }).usageMr,

                  "वापर उपप्रकार": !usageSubTypeDropDown?.find((obj) => {
                    return obj.id == r?.usageSubTypeKey;
                  })
                    ? "-"
                    : usageSubTypeDropDown.find((obj) => {
                        return obj.id == r?.usageSubTypeKey;
                      }).usageSubTypeMr,

                  "झोपडपट्टीचे नाव": !slumDropDown?.find((obj) => {
                    return obj.id == r?.slumKey;
                  })
                    ? "-"
                    : slumDropDown.find((obj) => {
                        return obj.id == r?.slumKey;
                      }).slumMr,

                  "झोनचे नाव": !zoneDropDown?.find((obj) => {
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

                  "बांधकाम प्रकार": !constructionTypeDropDown?.find((obj) => {
                    return obj.id == r?.constructionTypeKey;
                  })
                    ? "-"
                    : constructionTypeDropDown.find((obj) => {
                        return obj.id == r?.constructionTypeKey;
                      }).constructionTypeMr,

                  "झोपडीचे क्षेत्रफळ": r?.areaOfHut,
                  "एकूण कुटुंब सदस्य": r?.totalFamilyMembers,
                  "पाणी कनेक्शन": r?.waterConnection,
                  पुनर्वसन: r?.rehabilitation,
                  पात्रता: r?.eligibility,
                  दुरुस्ती: r?.correction,
                  "विधानसभा मतदारसंघ": r?.assemblyConstituency,
                  रुंदी: r?.breadth,
                  उंची: r?.height,
                  अक्षांश: r?.lattitude,
                  लांबी: r?.length,
                  रेखांश: r?.longitude,
                  "मजल्यांची संख्या": r?.noOfFloors,
                  "पुरुषांची संख्या": r?.maleCount,
                  "महिलांची संख्या": r?.femaleCount,
                  "यादीतील भाग क्र": r?.partNoInList,
                  "पिन कोड": r?.pincode,
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
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "hutNo",
      headerName: <FormattedLabel id="hutNo" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "usageType" : "usageTypeMr",
      headerName: <FormattedLabel id="usageType" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "usageSubType" : "usageSubTypeMr",
      headerName: <FormattedLabel id="usageSubTypeKey" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "constructionType" : "constructionTypeMr",
      headerName: <FormattedLabel id="constructionType" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "slumName" : "slumNameMr",
      headerName: <FormattedLabel id="slumName" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "zone" : "zoneMr",
      headerName: <FormattedLabel id="zone" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: language == "en" ? "village" : "villageMr",
      headerName: <FormattedLabel id="village" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pincode",
      headerName: <FormattedLabel id="pincode" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lattitude",
      headerName: <FormattedLabel id="lattitude" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "longitude",
      headerName: <FormattedLabel id="longitude" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "areaOfHut",
      headerName: <FormattedLabel id="areaOfHut" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "totalFamilyMembers",
      headerName: <FormattedLabel id="totalFamilyMembers" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "maleCount",
      headerName: <FormattedLabel id="maleCount" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "femaleCount",
      headerName: <FormattedLabel id="femaleCount" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "noOfFloors",
      headerName: <FormattedLabel id="noOfFloors" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "height",
      headerName: <FormattedLabel id="height" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "length",
      headerName: <FormattedLabel id="length" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "breadth",
      headerName: <FormattedLabel id="breadth" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "assemblyConstituency",
      headerName: <FormattedLabel id="assemblyConstituency" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "partNoInList",
      headerName: <FormattedLabel id="partNoInList" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "waterConnection",
      headerName: <FormattedLabel id="waterConnection" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "rehabilitation",
      headerName: <FormattedLabel id="rehabilitation" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "eligibility",
      headerName: <FormattedLabel id="eligibility" />,
      minWidth: 230,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "correction",
      headerName: <FormattedLabel id="correction" />,
      minWidth: 230,
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
      language == "en" ? "Hut wise detail report" : "झोपडीनुसार तपशील";
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
          ? `Report Name: Hut wise details`
          : `अहवालाचे नाव: झोपडीनुसार तपशील`,
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
                <FormattedLabel id="hutWiseDetailReport" />
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
