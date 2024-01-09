///////////////////////////////////////////////////////////////////////////////////////////////////////////

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
  IconButton,
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
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useRouter } from "next/router";
import ReportLayout from "../../../../containers/reuseableComponents/ReportLayout";
import { useReactToPrint } from "react-to-print";
import { tr } from "date-fns/locale";
import XLSX from "sheetjs-style";
import * as FileSaver from "file-saver";
import BreadCrumb from "../../../../components/common/BreadcrumbComponent";
import commonStyles from "../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../util/commonErrorUtil";

const Index = () => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Year Wise Report",
  });

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
  const [wardDropDown, setWardDropDown] = useState([]);
  const [zoneDropDown, setZoneDropDown] = useState([]);
  const [departmentDropDown, setDepartmentDropDown] = useState([]);
  const [phaseTypeDropDown, setPhaseTypeDropDown] = useState([]);
  const [loadTypeDropDown, setLoadTypeDropDown] = useState([]);
  const [msedclCategoryDropDown, setMsedclCategoryDropDown] = useState([]);
  const [divisionDropDown, setDivisionDropDown] = useState([]);
  const [subDivisionDropDown, setSubDivisionDropDown] = useState([]);
  const [consumptionTypeDropDown, setConsumptionTypeDropDown] = useState([]);
  const router = useRouter();

  const [engReportsData, setEngReportsData] = useState([]);
  const [mrReportsData, setMrReportsData] = useState([]);
  const [dateObj, setDateObj] = useState({
    from: "",
    to: "",
  });
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

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  const [loading, setLoading] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 1300);
    };

    // Add event listener to listen for window resize
    window.addEventListener("resize", handleResize);

    handleResize();

    // Remove the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getZoneData();
    getDepartmentData();
    getPhaseTypeData();
    getLoadTypeData();
    getMsedclCategoryData();
    getSubDivisionData();
    getDivisionData();
    getConsumptionTypeData();
  }, []);

  useEffect(() => {
    if (watch("department") && watch("zone")) {
      getZoneWiseWard();
    }
  }, [watch("department"), watch("zone")]);

  const getZoneData = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setZoneDropDown(res.data.zone);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getZoneWiseWard = () => {
    axios
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getWardByDepartmentId`,
        {
          params: {
            departmentId: watch("department"),
            zoneId: watch("zone"),
          },
          headers: headers,
        }
      )
      .then((res) => {
        setWardDropDown(res.data);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getDepartmentData = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, { headers: headers })
      .then((r) => {
        setDepartmentDropDown(
          r.data.department.map((row) => ({
            id: row.id,
            department: row.department,
            departmentMr: row.departmentMr,
          }))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  const getPhaseTypeData = () => {
    axios
      .get(`${urls.EBPSURL}/mstPhaseType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setPhaseTypeDropDown(res.data.mstPhaseTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getLoadTypeData = () => {
    axios
      .get(`${urls.EBPSURL}/mstLoadType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setLoadTypeDropDown(res.data.mstLoadTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getMsedclCategoryData = () => {
    axios
      .get(`${urls.EBPSURL}/mstMsedclCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setMsedclCategoryDropDown(res.data.mstMsedclCategoryList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getSubDivisionData = () => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setSubDivisionDropDown(res.data.mstSubDivisionList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getDivisionData = () => {
    axios
      .get(`${urls.EBPSURL}/mstBillingUnit/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstBillingUnitList;
        setDivisionDropDown(
          temp.map((each) => {
            return {
              id: each.id,
              division: each.divisionName,
              divisionMr: each.divisionNameMr,
            };
          })
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getConsumptionTypeData = () => {
    axios
      .get(`${urls.EBPSURL}/mstConsumptionType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setConsumptionTypeDropDown(res.data.mstConsumptionTypeList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  let resetValuesCancell = {
    fromDate: null,
    toDate: null,
    consumerNo: "",
  };

  let onCancel = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const onSubmitFunc = (formData) => {
    delete formData.fromDate;
    delete formData.toDate;
    if (watch("fromDate") && watch("toDate")) {
      // alert("onSubmitFunc");
      let sendFromDate = moment(watch("fromDate")).format(
        "YYYY-MM-DD hh:mm:ss"
      );
      let sendToDate = moment(watch("toDate")).format("YYYY-MM-DD hh:mm:ss");

      setDateObj({
        from: moment(watch("fromDate")).format("DD-MM-YYYY"),
        to: moment(watch("toDate")).format("DD-MM-YYYY"),
      });

      let apiBodyToSend = {
        strFromDate: sendFromDate,
        strToDate: sendToDate,
        consumerNo: watch("consumerNo") ? watch("consumerNo") : null,
        ward: watch("ward") ? watch("ward") : null,
        zone: watch("zone") ? watch("zone") : null,
        department: watch("department") ? watch("department") : null,
        phase: watch("phase") ? watch("phase") : null,
        loadType: watch("loadType") ? watch("loadType") : null,
        msedclCategory: watch("msedclCategory")
          ? watch("msedclCategory")
          : null,
        division: watch("division") ? watch("division") : null,
        subDivision: watch("subDivision") ? watch("subDivision") : null,
        consumptionType: watch("consumptionType")
          ? watch("consumptionType")
          : null,
      };

      ///////////////////////////////////////////
      setLoading(true);
      axios
        .post(
          `${urls.EBPSURL}/report/getYearWiseElectricBillDetails`,
          apiBodyToSend,
          {
            headers: headers,
          }
        )
        .then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            if (res?.data.length > 0) {
              setData(
                res?.data?.map((r, i) => ({
                  id: i + 1,
                  // srNo: i + 1,
                  consumerNo: r.connsumerNo,
                  consumerName: r.consumerName,
                  consumerNameMr: r.consumerNameMr,
                  aprilUnit:
                    r.monthUnitAmount["4"] != undefined
                      ? r.monthUnitAmount["4"][
                          Object.keys(r.monthUnitAmount["4"])[0]
                        ]
                      : "0",
                  aprilAmount:
                    r.monthUnitAmount["4"] != undefined
                      ? r.monthUnitAmount["4"][
                          Object.keys(r.monthUnitAmount["4"])[1]
                        ]
                      : "0",
                  mayUnit:
                    r.monthUnitAmount["5"] != undefined
                      ? r.monthUnitAmount["5"][
                          Object.keys(r.monthUnitAmount["5"])[0]
                        ]
                      : "0",
                  mayAmount:
                    r.monthUnitAmount["5"] != undefined
                      ? r.monthUnitAmount["5"][
                          Object.keys(r.monthUnitAmount["5"])[1]
                        ]
                      : "0",
                  juneUnit:
                    r.monthUnitAmount["6"] != undefined
                      ? r.monthUnitAmount["6"][
                          Object.keys(r.monthUnitAmount["6"])[0]
                        ]
                      : "0",
                  juneAmount:
                    r.monthUnitAmount["6"] != undefined
                      ? r.monthUnitAmount["6"][
                          Object.keys(r.monthUnitAmount["6"])[1]
                        ]
                      : "0",
                  julyUnit:
                    r.monthUnitAmount["7"] != undefined
                      ? r.monthUnitAmount["7"][
                          Object.keys(r.monthUnitAmount["7"])[0]
                        ]
                      : "0",
                  julyAmount:
                    r.monthUnitAmount["7"] != undefined
                      ? r.monthUnitAmount["7"][
                          Object.keys(r.monthUnitAmount["7"])[1]
                        ]
                      : "0",
                  augUnit:
                    r.monthUnitAmount["8"] != undefined
                      ? r.monthUnitAmount["8"][
                          Object.keys(r.monthUnitAmount["8"])[0]
                        ]
                      : "0",
                  augAmount:
                    r.monthUnitAmount["8"] != undefined
                      ? r.monthUnitAmount["8"][
                          Object.keys(r.monthUnitAmount["8"])[1]
                        ]
                      : "0",
                  septUnit:
                    r.monthUnitAmount["9"] != undefined
                      ? r.monthUnitAmount["9"][
                          Object.keys(r.monthUnitAmount["9"])[0]
                        ]
                      : "0",
                  septAmount:
                    r.monthUnitAmount["9"] != undefined
                      ? r.monthUnitAmount["9"][
                          Object.keys(r.monthUnitAmount["9"])[1]
                        ]
                      : "0",
                  octUnit:
                    r.monthUnitAmount["10"] != undefined
                      ? r.monthUnitAmount["10"][
                          Object.keys(r.monthUnitAmount["10"])[0]
                        ]
                      : "0",
                  octAmount:
                    r.monthUnitAmount["10"] != undefined
                      ? r.monthUnitAmount["10"][
                          Object.keys(r.monthUnitAmount["10"])[1]
                        ]
                      : "0",
                  novUnit:
                    r.monthUnitAmount["11"] != undefined
                      ? r.monthUnitAmount["11"][
                          Object.keys(r.monthUnitAmount["11"])[0]
                        ]
                      : "0",
                  novAmount:
                    r.monthUnitAmount["11"] != undefined
                      ? r.monthUnitAmount["11"][
                          Object.keys(r.monthUnitAmount["11"])[1]
                        ]
                      : "0",
                  decUnit:
                    r.monthUnitAmount["12"] != undefined
                      ? r.monthUnitAmount["12"][
                          Object.keys(r.monthUnitAmount["12"])[0]
                        ]
                      : "0",
                  decAmount:
                    r.monthUnitAmount["12"] != undefined
                      ? r.monthUnitAmount["12"][
                          Object.keys(r.monthUnitAmount["12"])[1]
                        ]
                      : "0",
                  janUnit:
                    r.monthUnitAmount["1"] != undefined
                      ? r.monthUnitAmount["1"][
                          Object.keys(r.monthUnitAmount["1"])[0]
                        ]
                      : "0",
                  janAmount:
                    r.monthUnitAmount["1"] != undefined
                      ? r.monthUnitAmount["1"][
                          Object.keys(r.monthUnitAmount["1"])[1]
                        ]
                      : "0",
                  febUnit:
                    r.monthUnitAmount["2"] != undefined
                      ? r.monthUnitAmount["2"][
                          Object.keys(r.monthUnitAmount["2"])[0]
                        ]
                      : "0",
                  febAmount:
                    r.monthUnitAmount["2"] != undefined
                      ? r.monthUnitAmount["2"][
                          Object.keys(r.monthUnitAmount["2"])[1]
                        ]
                      : "0",
                  marchUnit:
                    r.monthUnitAmount["3"] != undefined
                      ? r.monthUnitAmount["3"][
                          Object.keys(r.monthUnitAmount["3"])[0]
                        ]
                      : "0",
                  marchAmount:
                    r.monthUnitAmount["3"] != undefined
                      ? r.monthUnitAmount["3"][
                          Object.keys(r.monthUnitAmount["3"])[1]
                        ]
                      : "0",
                }))
              );

              setEngReportsData(
                res?.data?.map((r, i) => ({
                  "Sr.No": i + 1,
                  "Consumer Number": r.connsumerNo,
                  "Consumer Name":
                    language == "en" ? r.consumerName : r?.consumerNameMr,

                  AprilUnit:
                    r.monthUnitAmount["4"] != undefined
                      ? r.monthUnitAmount["4"][
                          Object.keys(r.monthUnitAmount["4"])[0]
                        ]
                      : "0",
                  AprilAmount:
                    r.monthUnitAmount["4"] != undefined
                      ? r.monthUnitAmount["4"][
                          Object.keys(r.monthUnitAmount["4"])[1]
                        ]
                      : "0",

                  MayUnit:
                    r.monthUnitAmount["5"] != undefined
                      ? r.monthUnitAmount["5"][
                          Object.keys(r.monthUnitAmount["5"])[0]
                        ]
                      : "0",
                  MayAmount:
                    r.monthUnitAmount["5"] != undefined
                      ? r.monthUnitAmount["5"][
                          Object.keys(r.monthUnitAmount["5"])[1]
                        ]
                      : "0",
                  JuneUnit:
                    r.monthUnitAmount["6"] != undefined
                      ? r.monthUnitAmount["6"][
                          Object.keys(r.monthUnitAmount["6"])[0]
                        ]
                      : "0",
                  JuneAmount:
                    r.monthUnitAmount["6"] != undefined
                      ? r.monthUnitAmount["6"][
                          Object.keys(r.monthUnitAmount["6"])[1]
                        ]
                      : "0",

                  JulyUnit:
                    r.monthUnitAmount["7"] != undefined
                      ? r.monthUnitAmount["7"][
                          Object.keys(r.monthUnitAmount["7"])[0]
                        ]
                      : "0",
                  JulyAmount:
                    r.monthUnitAmount["7"] != undefined
                      ? r.monthUnitAmount["7"][
                          Object.keys(r.monthUnitAmount["7"])[1]
                        ]
                      : "0",

                  AugustUnit:
                    r.monthUnitAmount["8"] != undefined
                      ? r.monthUnitAmount["8"][
                          Object.keys(r.monthUnitAmount["8"])[0]
                        ]
                      : "0",
                  AugustAmount:
                    r.monthUnitAmount["8"] != undefined
                      ? r.monthUnitAmount["8"][
                          Object.keys(r.monthUnitAmount["8"])[1]
                        ]
                      : "0",
                  SeptemberUnit:
                    r.monthUnitAmount["9"] != undefined
                      ? r.monthUnitAmount["9"][
                          Object.keys(r.monthUnitAmount["9"])[0]
                        ]
                      : "0",
                  SeptemberAmount:
                    r.monthUnitAmount["9"] != undefined
                      ? r.monthUnitAmount["9"][
                          Object.keys(r.monthUnitAmount["9"])[1]
                        ]
                      : "0",
                  OctoberUnit:
                    r.monthUnitAmount["10"] != undefined
                      ? r.monthUnitAmount["10"][
                          Object.keys(r.monthUnitAmount["10"])[0]
                        ]
                      : "0",
                  OctoberAmount:
                    r.monthUnitAmount["10"] != undefined
                      ? r.monthUnitAmount["10"][
                          Object.keys(r.monthUnitAmount["10"])[1]
                        ]
                      : "0",
                  NovemberUnit:
                    r.monthUnitAmount["11"] != undefined
                      ? r.monthUnitAmount["11"][
                          Object.keys(r.monthUnitAmount["11"])[0]
                        ]
                      : "0",
                  NovemberAmount:
                    r.monthUnitAmount["11"] != undefined
                      ? r.monthUnitAmount["11"][
                          Object.keys(r.monthUnitAmount["11"])[1]
                        ]
                      : "0",
                  DecemberUnit:
                    r.monthUnitAmount["12"] != undefined
                      ? r.monthUnitAmount["12"][
                          Object.keys(r.monthUnitAmount["12"])[0]
                        ]
                      : "0",
                  DecemberAmount:
                    r.monthUnitAmount["12"] != undefined
                      ? r.monthUnitAmount["12"][
                          Object.keys(r.monthUnitAmount["12"])[1]
                        ]
                      : "0",
                  JanuaryUnit:
                    r.monthUnitAmount["1"] != undefined
                      ? r.monthUnitAmount["1"][
                          Object.keys(r.monthUnitAmount["1"])[0]
                        ]
                      : "0",
                  JanuaryAmount:
                    r.monthUnitAmount["1"] != undefined
                      ? r.monthUnitAmount["1"][
                          Object.keys(r.monthUnitAmount["1"])[1]
                        ]
                      : "0",
                  FebruaryUnit:
                    r.monthUnitAmount["2"] != undefined
                      ? r.monthUnitAmount["2"][
                          Object.keys(r.monthUnitAmount["2"])[0]
                        ]
                      : "0",
                  FebruaryAmount:
                    r.monthUnitAmount["2"] != undefined
                      ? r.monthUnitAmount["2"][
                          Object.keys(r.monthUnitAmount["2"])[1]
                        ]
                      : "0",
                  MarchUnit:
                    r.monthUnitAmount["3"] != undefined
                      ? r.monthUnitAmount["3"][
                          Object.keys(r.monthUnitAmount["3"])[0]
                        ]
                      : "0",
                  MarchAmount:
                    r.monthUnitAmount["3"] != undefined
                      ? r.monthUnitAmount["3"][
                          Object.keys(r.monthUnitAmount["3"])[1]
                        ]
                      : "0",
                }))
              );

              // setMrReportsData(
              //   res?.data?.map((r, i) => ({
              //     id: i + 1,
              //     // srNo: i + 1,
              //     consumerNo: r.connsumerNo,
              //     consumerName: r.consumerName,
              //     consumerNameMr: r.consumerNameMr,
              //     aprilUnit:
              //       r.monthUnitAmount["4"] != undefined
              //         ? r.monthUnitAmount["4"][
              //             Object.keys(r.monthUnitAmount["4"])[0]
              //           ]
              //         : "0",
              //     aprilAmount:
              //       r.monthUnitAmount["4"] != undefined
              //         ? r.monthUnitAmount["4"][
              //             Object.keys(r.monthUnitAmount["4"])[1]
              //           ]
              //         : "0",
              //     mayUnit:
              //       r.monthUnitAmount["5"] != undefined
              //         ? r.monthUnitAmount["5"][
              //             Object.keys(r.monthUnitAmount["5"])[0]
              //           ]
              //         : "0",
              //     mayAmount:
              //       r.monthUnitAmount["5"] != undefined
              //         ? r.monthUnitAmount["5"][
              //             Object.keys(r.monthUnitAmount["5"])[1]
              //           ]
              //         : "0",
              //     juneUnit:
              //       r.monthUnitAmount["6"] != undefined
              //         ? r.monthUnitAmount["6"][
              //             Object.keys(r.monthUnitAmount["6"])[0]
              //           ]
              //         : "0",
              //     juneAmount:
              //       r.monthUnitAmount["6"] != undefined
              //         ? r.monthUnitAmount["6"][
              //             Object.keys(r.monthUnitAmount["6"])[1]
              //           ]
              //         : "0",
              //     julyUnit:
              //       r.monthUnitAmount["7"] != undefined
              //         ? r.monthUnitAmount["7"][
              //             Object.keys(r.monthUnitAmount["7"])[0]
              //           ]
              //         : "0",
              //     julyAmount:
              //       r.monthUnitAmount["7"] != undefined
              //         ? r.monthUnitAmount["7"][
              //             Object.keys(r.monthUnitAmount["7"])[1]
              //           ]
              //         : "0",
              //     augUnit:
              //       r.monthUnitAmount["8"] != undefined
              //         ? r.monthUnitAmount["8"][
              //             Object.keys(r.monthUnitAmount["8"])[0]
              //           ]
              //         : "0",
              //     augAmount:
              //       r.monthUnitAmount["8"] != undefined
              //         ? r.monthUnitAmount["8"][
              //             Object.keys(r.monthUnitAmount["8"])[1]
              //           ]
              //         : "0",
              //     septUnit:
              //       r.monthUnitAmount["9"] != undefined
              //         ? r.monthUnitAmount["9"][
              //             Object.keys(r.monthUnitAmount["9"])[0]
              //           ]
              //         : "0",
              //     septAmount:
              //       r.monthUnitAmount["9"] != undefined
              //         ? r.monthUnitAmount["9"][
              //             Object.keys(r.monthUnitAmount["9"])[1]
              //           ]
              //         : "0",
              //     octUnit:
              //       r.monthUnitAmount["10"] != undefined
              //         ? r.monthUnitAmount["10"][
              //             Object.keys(r.monthUnitAmount["10"])[0]
              //           ]
              //         : "0",
              //     octAmount:
              //       r.monthUnitAmount["10"] != undefined
              //         ? r.monthUnitAmount["10"][
              //             Object.keys(r.monthUnitAmount["10"])[1]
              //           ]
              //         : "0",
              //     novUnit:
              //       r.monthUnitAmount["11"] != undefined
              //         ? r.monthUnitAmount["11"][
              //             Object.keys(r.monthUnitAmount["11"])[0]
              //           ]
              //         : "0",
              //     novAmount:
              //       r.monthUnitAmount["11"] != undefined
              //         ? r.monthUnitAmount["11"][
              //             Object.keys(r.monthUnitAmount["11"])[1]
              //           ]
              //         : "0",
              //     decUnit:
              //       r.monthUnitAmount["12"] != undefined
              //         ? r.monthUnitAmount["12"][
              //             Object.keys(r.monthUnitAmount["12"])[0]
              //           ]
              //         : "0",
              //     decAmount:
              //       r.monthUnitAmount["12"] != undefined
              //         ? r.monthUnitAmount["12"][
              //             Object.keys(r.monthUnitAmount["12"])[1]
              //           ]
              //         : "0",
              //     janUnit:
              //       r.monthUnitAmount["1"] != undefined
              //         ? r.monthUnitAmount["1"][
              //             Object.keys(r.monthUnitAmount["1"])[0]
              //           ]
              //         : "0",
              //     janAmount:
              //       r.monthUnitAmount["1"] != undefined
              //         ? r.monthUnitAmount["1"][
              //             Object.keys(r.monthUnitAmount["1"])[1]
              //           ]
              //         : "0",
              //     febUnit:
              //       r.monthUnitAmount["2"] != undefined
              //         ? r.monthUnitAmount["2"][
              //             Object.keys(r.monthUnitAmount["2"])[0]
              //           ]
              //         : "0",
              //     febAmount:
              //       r.monthUnitAmount["2"] != undefined
              //         ? r.monthUnitAmount["2"][
              //             Object.keys(r.monthUnitAmount["2"])[1]
              //           ]
              //         : "0",
              //     marchUnit:
              //       r.monthUnitAmount["3"] != undefined
              //         ? r.monthUnitAmount["3"][
              //             Object.keys(r.monthUnitAmount["3"])[0]
              //           ]
              //         : "0",
              //     marchAmount:
              //       r.monthUnitAmount["3"] != undefined
              //         ? r.monthUnitAmount["3"][
              //             Object.keys(r.monthUnitAmount["3"])[1]
              //           ]
              //         : "0",
              //   }))
              // );

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
              setEngReportsData([]);
              setMrReportsData([]);
              setLoading(false);
            }
          } else {
            setData([]);
            setEngReportsData([]);
            setMrReportsData([]);
            sweetAlert("Something Went Wrong!");
            setLoading(false);
          }
        })
        .catch((err) => {
          cfcErrorCatchMethod(err, false);
          setData([]);
          setEngReportsData([]);
          setMrReportsData([]);
          sweetAlert(err);
          setLoading(false);
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
      setEngReportsData([]);
      setMrReportsData([]);
    }
  };

  ///////////// Test Export excell function ///////////

  function exportToExcel(responseArray) {
    const workbook = XLSX.utils.book_new();
    const sheetName = "Sheet1";
    const worksheet = XLSX.utils.json_to_sheet(responseArray, {
      header: Object.keys(responseArray[0]),
    });

    // Example of merging cells in rows 1 and 2, columns A and B
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // Merge cells from A1 to B2 for Sr. No
      { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Merge cells from A1 to B2 for ConsumerNo
      { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // Merge cells from A1 to B2 for ConsumerName
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data.xlsx");
  }

  ////////////////////////////////////////////////////////////////

  const columns = [
    {
      headerName: <FormattedLabel id="srNo" />,
      field: "id",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: <FormattedLabel id="consumerNo" />,
      field: "consumerNo",
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: <FormattedLabel id="consumerName" />,
      field: language == "en" ? "consumerName" : "consumerNameMr",
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "aprilUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "aprilAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mayUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "mayAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "juneUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "juneAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "julyUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "julyAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "augUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "augAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "septUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "septAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "octUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "octAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "novUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "novAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "decUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "decAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "janUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "janAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "febUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "febAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "marchUnit",
      headerName: <FormattedLabel id="unit" />,
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "marchAmount",
      headerName: <FormattedLabel id="amount" />,
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
  ];

  const columnGroupingModel = [
    {
      groupId: language == "en" ? "April" : "à¤à¤ªà¥à¤°à¤¿à¤²",
      children: [{ field: "aprilUnit" }, { field: "aprilAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "May" : "à¤®à¥‡",
      children: [{ field: "mayUnit" }, { field: "mayAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "June" : "à¤œà¥‚à¤¨",
      children: [{ field: "juneUnit" }, { field: "juneAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "July" : "à¤œà¥à¤²à¥ˆ",
      children: [{ field: "julyUnit" }, { field: "julyAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "August" : "à¤‘à¤—à¤¸à¥à¤Ÿ",
      children: [{ field: "augUnit" }, { field: "augAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "September" : "à¤¸à¤ªà¥à¤Ÿà¥‡à¤‚à¤¬à¤°",
      children: [{ field: "septUnit" }, { field: "septAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "October" : "à¤‘à¤•à¥à¤Ÿà¥‹à¤¬à¤°",
      children: [{ field: "octUnit" }, { field: "octAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "November" : "à¤¨à¥‹à¤µà¥à¤¹à¥‡à¤‚à¤¬à¤°",
      children: [{ field: "novUnit" }, { field: "novAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "December" : "à¤¡à¤¿à¤¸à¥‡à¤‚à¤¬à¤°",
      children: [{ field: "decUnit" }, { field: "decAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "January" : "à¤œà¤¾à¤¨à¥‡à¤µà¤¾à¤°à¥€",
      children: [{ field: "janUnit" }, { field: "janAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "February" : "à¤«à¥‡à¤¬à¥à¤°à¥à¤µà¤¾à¤°à¥€",
      children: [{ field: "febUnit" }, { field: "febAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      groupId: language == "en" ? "March" : "à¤®à¤¾à¤°à¥à¤š",
      children: [{ field: "marchUnit" }, { field: "marchAmount" }],
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
  ];

  const excellColumns = [
    {
      headerName: "Sr.No",
      field: "id",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Consumer No",
      field: "consumerNo",
      minWidth: 230,
      headerAlign: "center",
      align: "center",
    },
    {
      headerName: "Consumer Name",
      field: language == "en" ? "consumerName" : "consumerNameMr",
      minWidth: 250,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "April Unit",
      headerName: "April Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "April Amount",
      headerName: "April Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "May Unit",
      headerName: "May Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "May Amount",
      headerName: "May Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "June Unit",
      headerName: "June Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "June Amount",
      headerName: "June Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "July Unit",
      headerName: "July Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "July Amount",
      headerName: "July Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "August Unit",
      headerName: "August Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "August Amount",
      headerName: "August Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "September Unit",
      headerName: "September Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "September Amount",
      headerName: "September Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "October Unit",
      headerName: "October Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "October Amount",
      headerName: "October Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "November Unit",
      headerName: "November Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "November Amount",
      headerName: "November Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "December Unit",
      headerName: "December Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "December Amount",
      headerName: "December Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "January Unit",
      headerName: "January Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "January Amount",
      headerName: "January Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "February Unit",
      headerName: "February Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "February Amount",
      headerName: "February Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "March Unit",
      headerName: "March Unit",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "March Amount",
      headerName: "March Amount",
      minWidth: 60,
      headerAlign: "center",
      align: "center",
    },
  ];

  /////////////// EXCEL DOWNLOAD ////////////
  // function generateCSVFile(data) {
  //   console.log("data", data);
  //   const csv = [
  //     columns.map((c) => c.headerName).join(","),
  //     ...data.map((d) => columns.map((c) => d[c.field]).join(",")),
  //   ].join("\n");
  //   // const headerColumns = columns.map((c) => c.headerName);
  //   console.log("data__", csv);
  //   const fileName = "Excel";
  //   let col = () => {};
  //   col();
  //   const fileType =
  //     "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
  //   const fileExtention = ".xlsx";
  //   // const ws = XLSX.utils.json_to_sheet(data,{header: headerColumns});
  //   const ws = XLSX.utils.json_to_sheet(data, { origin: "A9" });
  //   // const ws = XLSX.utils.sheet_add_aoa(ws0,);
  //   ws.B1 = {
  //     t: "s",
  //     v:
  //       language == "en"
  //         ? "Pimpri-Chinchwad Municipal Corporation"
  //         : "à¤ªà¤¿à¤‚à¤ªà¤°à¥€-à¤šà¤¿à¤‚à¤šà¤µà¤¡ à¤®à¤¹à¤¾à¤¨à¤—à¤°à¤ªà¤¾à¤²à¤¿à¤•à¤¾",
  //   };
  //   ws.B2 = {
  //     t: "s",
  //     v:
  //       language == "en"
  //         ? "Mumbai-Pune Road, Pimpri - 411018"
  //         : "à¤®à¥à¤‚à¤¬à¤ˆ-à¤ªà¥à¤£à¥‡ à¤°à¥‹à¤¡, à¤ªà¤¿à¤‚à¤ªà¤°à¥€ - à¥ªà¥§à¥§ à¥¦à¥§à¥®",
  //   };
  //   ws.B3 = {
  //     t: "s",
  //     v:
  //       language == "en"
  //         ? `Department Name: Electric Billing Payment System`
  //         : `à¤µà¤¿à¤­à¤¾à¤—à¤¾à¤šà¥‡ à¤¨à¤¾à¤µ: à¤‡à¤²à¥‡à¤•à¥à¤Ÿà¥à¤°à¤¿à¤• à¤¬à¤¿à¤²à¤¿à¤‚à¤— à¤ªà¥‡à¤®à¥‡à¤‚à¤Ÿ à¤¸à¤¿à¤¸à¥à¤Ÿà¤®`,
  //   };
  //   ws.B4 = {
  //     t: "s",
  //     v:
  //       language == "en"
  //         ? `Report Name: Year Wise Report`
  //         : `à¤…à¤¹à¤µà¤¾à¤²à¤¾à¤šà¥‡ à¤¨à¤¾à¤µ: à¤µà¤°à¥à¤·à¤¨à¤¿à¤¹à¤¾à¤¯ à¤…à¤¹à¤µà¤¾à¤²`,
  //   };
  //   ws.B5 = {
  //     t: "s",
  //     v:
  //       language == "en"
  //         ? `From Date:${dateObj?.from}`
  //         : `à¤¤à¤¾à¤°à¤–à¥‡à¤ªà¤¾à¤¸à¥‚à¤¨:${dateObj?.from}`,
  //   };
  //   ws.B6 = {
  //     t: "s",
  //     v:
  //       language == "en"
  //         ? `To Date:${dateObj?.to}`
  //         : `à¤¤à¤¾à¤°à¤–à¥‡à¤ªà¤°à¥à¤¯à¤‚à¤¤:${dateObj?.to}`,
  //   };

  //   // const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } },  // Merge cells from A1 to B2 for Header
  //   //   { s: { r: 8, c: 0 }, e: { r:7, c: 0 } }, // Merge cells from A8 to A9 for Sr. No
  //   //   { s: { r: 8, c: 1 }, e: { r:7, c: 1 } }, // Merge cells from B8 to B9 for ConsumerNo
  //   //   { s: { r: 8, c: 2 }, e: { r:7, c: 2 } }, // Merge cells from C8 to C9 for ConsumerName

  //   //   { s: { r: 7, c: 3 }, e: { r:7, c: 4 } }, // Merge cells from A1 to B2 for April month
  //   //   { s: { r: 7, c: 5 }, e: { r:7, c: 6 } }, // Merge cells from A1 to B2 for May month
  //   //   { s: { r: 7, c: 7 }, e: { r:7, c: 8 } }, // Merge cells from A1 to B2 for June month
  //   //   { s: { r: 7, c: 9 }, e: { r:7, c: 10 } }, // Merge cells from A1 to B2 for July month
  //   //   { s: { r: 7, c: 11 }, e: { r:7, c:12 } }, // Merge cells from A1 to B2 for August month
  //   //   { s: { r: 7, c: 13 }, e: { r:7, c:14 } }, // Merge cells from A1 to B2 for September month
  //   //   { s: { r: 7, c: 15 }, e: { r:7, c:16 } }, // Merge cells from A1 to B2 for October month
  //   //   { s: { r: 7, c: 17 }, e: { r:7, c: 18 } }, // Merge cells from A1 to B2 for November month
  //   //   { s: { r: 7, c: 19 }, e: { r:7, c: 20 } }, // Merge cells from A1 to B2 for December month
  //   //   { s: { r: 7, c: 21 }, e: { r:7, c: 22 } }, // Merge cells from A1 to B2 for January month
  //   //   { s: { r: 7, c: 23 }, e: { r:7, c: 24 } }, // Merge cells from A1 to B2 for February month
  //   //   { s: { r: 7, c: 25 }, e: { r:7, c: 26 } }, // Merge cells from A1 to B2 for March month
  //   // ];
  //   // ws["!merges"] = merge;

  //   // ws["A8"] = { t: "s", v: "Sr.No", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["B8"] = { t: "s", v: "Consumer Number", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["C8"] = { t: "s", v: "Consumer Name", s: { font: { bold: true }, alignment: { horizontal: "center" } } };

  //   // ws["D8"] = { t: "s", v: "April", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["F8"] = { t: "s", v: "May", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["H8"] = { t: "s", v: "June", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["J8"] = { t: "s", v: "July", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["L8"] = { t: "s", v: "August", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["N8"] = { t: "s", v: "September", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["P8"] = { t: "s", v: "October", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["R8"] = { t: "s", v: "November", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["T8"] = { t: "s", v: "December", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["V8"] = { t: "s", v: "January", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["X8"] = { t: "s", v: "February", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   // ws["Z8"] = { t: "s", v: "March", s: { font: { bold: true }, alignment: { horizontal: "center" } } };

  //   //===========================================================================================

  //   // Merge the "April" header cell
  //   ws["!merges"] = [{ s: { r: 2, c: 3 }, e: { r: 2, c: 4 } }];

  //   // Set the "April" header text in cell C6
  //  ws["D8"] = { t: "s", v: "April", s: { font: { bold: true }, alignment: { horizontal: "center" } } };

  //  // Merge cells C6 and D6
  //  const mergeAprilHeader = [{ s: { r: 7, c: 3 }, e: { r: 7, c: 4 } }];
  //  ws["!merges"] = ws["!merges"] || [];
  //  ws["!merges"] = ws["!merges"].concat(mergeAprilHeader); // Add the mergeAprilHeader object to the existing merges

  //   // Set "Unit" and "Amount" subheaders
  //   ws["D9"] = { t: "s", v: "Unit", s: { font: { bold: true }, alignment: { horizontal: "center" } } };
  //   ws["E9"] = { t: "s", v: "Amount", s: { font: { bold: true }, alignment: { horizontal: "center" } } };

  //   // Populate data under the "April" column
  //   data.forEach((d, index) => {
  //     const rowIndex = index + 10; // Assuming the data starts at row 8
  //     ws["D" + rowIndex] = { t: "n", v: d["April"]["Unit"] || 0 }; // Assuming "Unit" data is in "April.Unit" property
  //     ws["E" + rowIndex] = { t: "n", v: d["April"]["Amount"] || 0 }; // Assuming "Amount" data is in "April.Amount" property
  //   });

  //   //===========================================================================================

  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   console.log("wb", wb);
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   console.log("wb__", excelBuffer);
  //   const blob = new Blob([excelBuffer], { type: fileType });

  //   FileSaver.saveAs(blob, fileName + fileExtention);
  // }

  function generateCSVFile(data) {
    const csv = [
      excellColumns.map((c) => c.headerName).join(","),
      ...data.map((d) => excellColumns.map((c) => d[c.field]).join(",")),
    ].join("\n");

    console.log("csv", csv);
    console.log("data", data);
    // const headerColumns = columns.map((c) => c.headerName);
    const fileName =
      language == "en"
        ? "Year Wise Report"
        : "à¤µà¤°à¥à¤·à¤¨à¤¿à¤¹à¤¾à¤¯ à¤…à¤¹à¤µà¤¾à¤²";
    let col = () => {};
    col();
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheethtml.sheet;charset=utf-8";
    const fileExtention = ".xlsx";
    // const ws = XLSX.utils.json_to_sheet(data,{header: headerColumns});
    const ws = XLSX.utils.json_to_sheet(data, { origin: "A9" });

    // Merge the "April" header cell
    // ws["!merges"] = [{ s: { r: 2, c: 3 }, e: { r: 2, c: 4 } }];

    // Merge the first two cells in the first column (cells A1 and A2)
    ws["!merges"] = [{ s: { r: 7, c: 0 }, e: { r: 8, c: 0 } }];
    ws["A8"] = {
      t: "s",
      v: language == "en" ? "Sr.No" : "à¤…à¤¨à¥. à¤•à¥à¤°",
      s: { font: { bold: true }, alignment: { horizontal: "center" } },
    };

    // Merge the "Consumer No" and "Unit" header cells (cells A7 and B7)
    ws["!merges"].push({ s: { r: 7, c: 1 }, e: { r: 8, c: 1 } });
    ws["B8"] = {
      t: "s",
      v: language == "en" ? "Consumer No" : "à¤—à¥à¤°à¤¾à¤¹à¤• à¤•à¥à¤°",
      s: { font: { bold: true }, alignment: { horizontal: "center" } },
    };

    // Merge the "Consumer Name" header cells (cells A7 and B7)
    ws["!merges"].push({ s: { r: 7, c: 2 }, e: { r: 8, c: 2 } });
    ws["C8"] = {
      t: "s",
      v:
        language == "en"
          ? "Consumer Name"
          : "à¤—à¥à¤°à¤¾à¤¹à¤•à¤¾à¤šà¥‡ à¤¨à¤¾à¤µ",
      s: { font: { bold: true }, alignment: { horizontal: "center" } },
    };

    const monthNames = [
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
      "January",
      "February",
      "March",
    ];

    const monthNamesMr = [
      "à¤à¤ªà¥à¤°à¤¿à¤²",
      "à¤®à¥‡",
      "à¤œà¥‚à¤¨",
      "à¤œà¥à¤²à¥ˆ",
      "à¤‘à¤—à¤¸à¥à¤Ÿ",
      "à¤¸à¤ªà¥à¤Ÿà¥‡à¤‚à¤¬à¤°",
      "à¤‘à¤•à¥à¤Ÿà¥‹à¤¬à¤°",
      "à¤¨à¥‹à¤µà¥à¤¹à¥‡à¤‚à¤¬à¤°",
      "à¤¡à¤¿à¤¸à¥‡à¤‚à¤¬à¤°",
      "à¤œà¤¾à¤¨à¥‡à¤µà¤¾à¤°à¥€",
      "à¤«à¥‡à¤¬à¥à¤°à¥à¤µà¤¾à¤°à¥€",
      "à¤®à¤¾à¤°à¥à¤š",
    ];

    // Loop through each month and set the merges and header texts
    for (let i = 0; i < 12; i++) {
      const startRow = 7;
      const startCol = 3 + i * 2;
      const endCol = startCol + 1;

      // Merge the header cells for the current month
      ws["!merges"].push({
        s: { r: startRow, c: startCol },
        e: { r: startRow, c: endCol },
      });

      // Set the month header text
      ws[XLSX.utils.encode_cell({ r: startRow, c: startCol })] = {
        t: "s",
        v: language == "en" ? monthNames[i] : monthNamesMr[i],
        s: { font: { bold: true }, alignment: { horizontal: "center" } },
      };

      // Set "Unit" and "Amount" subheaders
      const unitSubheaderRow = startRow + 1;
      const subheaderRow = startRow + 1; // Set the same row for both "Unit" and "Amount" subheaders

      ws[XLSX.utils.encode_cell({ r: subheaderRow, c: startCol })] = {
        t: "s",
        v: language == "en" ? "Unit" : "à??à??à??à??à??",
        s: { font: { bold: true }, alignment: { horizontal: "center" } },
      };

      ws[XLSX.utils.encode_cell({ r: subheaderRow, c: startCol + 1 })] = {
        t: "s",
        v: language == "en" ? "Amount" : "à??à??à??à??à??",
        s: { font: { bold: true }, alignment: { horizontal: "center" } },
      };

      // Populate data under the current month column
      data.forEach((d, index) => {
        console.log("data", d);
        const rowIndex = index + startRow + 2; // Add 2 for the header and subheaders, and the fact that data starts from the next row
        console.log("rowIndex", rowIndex, startCol);
        ws[XLSX.utils.encode_cell({ r: rowIndex, c: startCol })] = {
          t: "n",
          v: d[`${monthNames[i]}Unit`] || 0,
        };

        console.log(
          "unit data",
          ws[XLSX.utils.encode_cell({ r: rowIndex, c: startCol })]
        );

        ws[XLSX.utils.encode_cell({ r: rowIndex, c: startCol + 1 })] = {
          t: "n",
          v: d[`${monthNames[i]}Amount`] || 0,
        };
        console.log(
          "Amount data",
          ws[XLSX.utils.encode_cell({ r: rowIndex, c: startCol + 1 })]
        );
      });
    }

    ws.B1 = {
      t: "s",
      v:
        language == "en"
          ? "Pimpri-Chinchwad Municipal Corporation"
          : "à?ªà??à??à?ªà??à??-à??à??à??à??à?µà?? à??à??à??à??à??à??à?ªà??à??à??à??à??",
    };
    ws.B2 = {
      t: "s",
      v:
        language == "en"
          ? "Mumbai-Pune Road, Pimpri - 411018"
          : "à??à??à??à??à??-à?ªà??à??à?? à??à??à??, à?ªà??à??à?ªà??à?? - à?ªà??à?? à??à??à??",
    };
    ws.B3 = {
      t: "s",
      v:
        language == "en"
          ? `Department Name: Electric Billing Payment System`
          : `à?µà??à??à??à??à??à??à?? à??à??à?µ: à??à??à??à??à??à??à??à??à??à?? à??à??à??à??à??à?? à?ªà??à??à??à??à?? à??à??à??à??à??à??`,
    };
    ws.B4 = {
      t: "s",
      v:
        language == "en"
          ? `Report Name: Year Wise Report`
          : `à??à??à?µà??à??à??à??à?? à??à??à?µ: à?µà??à??à??à??à??à??à??à?? à??à??à?µà??à??`,
    };
    ws.B5 = {
      t: "s",
      v:
        language == "en"
          ? `From Date:${dateObj?.from}`
          : `à??à??à??à??à??à?ªà??à??à??à??:${dateObj?.from}`,
    };
    ws.B6 = {
      t: "s",
      v:
        language == "en"
          ? `To Date:${dateObj?.to}`
          : `à??à??à??à??à??à?ªà??à??à??à??à??:${dateObj?.to}`,
    };

    // const merge = [{ s: { r: 0, c: 1 }, e: { r: 0, c: 7 } }];
    // ws["!merges"] = merge;

    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    console.log("wb", wb);
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    console.log("wb__", excelBuffer);
    const blob = new Blob([excelBuffer], { type: fileType });

    FileSaver.saveAs(blob, fileName + fileExtention);
  }
  ///////////////////////////////////////////

  function generatePDF(data) {
    const columnsData = columns
      .map((c) => c.headerName)
      .map((obj) => obj?.props?.id);
    const rowsData = data.map((row) => columns.map((col) => row[col.field]));

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
        <Box>
          <div>
            <BreadCrumb />
          </div>
        </Box>
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
              <Grid item xs={10}>
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    marginRight: "2rem",
                  }}
                >
                  <FormattedLabel id="yearWiseReport" />
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
                  {/* From Date */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white", marginLeft: "30px" }}
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
                              disableFuture
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
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      style={{ backgroundColor: "white", marginLeft: "30px" }}
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
                              minDate={watch("fromDate")}
                              disableFuture
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

                  {/* Consumer No */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <TextField
                      type="number"
                      sx={{ width: "70%" }}
                      id="standard-basic"
                      label={<FormattedLabel id="consumerNo" />}
                      variant="standard"
                      InputLabelProps={{
                        shrink: watch("consumerNo") ? true : false,
                      }}
                      {...register("consumerNo")}
                      error={!!errors.consumerNo}
                      helperText={
                        errors?.consumerNo ? errors.consumerNo.message : null
                      }
                    />
                  </Grid>

                  {/* department */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.department}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="deptName" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("department")}
                            label={<FormattedLabel id="deptName" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {departmentDropDown &&
                              departmentDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.department
                                    : each.departmentMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="department"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.department ? errors.department.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* zone */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.zone}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="zone" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("zone")}
                            label={<FormattedLabel id="zone" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {zoneDropDown &&
                              zoneDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.zoneName
                                    : each.zoneNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="zone"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.zone ? errors.zone.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Ward */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.ward}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="ward" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("ward")}
                            label={<FormattedLabel id="ward" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {wardDropDown &&
                              wardDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.wardName
                                    : each.wardNameMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="ward"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.ward ? errors.ward.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* phaseType */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.phase}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="phaseType" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("phase")}
                            label={<FormattedLabel id="phaseType" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {phaseTypeDropDown &&
                              phaseTypeDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.phaseType
                                    : each.phaseTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="phase"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.phase ? errors.phase.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* loadType */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.loadType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="loadType" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("loadType")}
                            label={<FormattedLabel id="loadType" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {loadTypeDropDown &&
                              loadTypeDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.loadType
                                    : each.loadTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="loadType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.loadType ? errors.loadType.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* MSEDCL category */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.msedclCategory}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="msedclCategory" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("msedclCategory")}
                            label={<FormattedLabel id="msedclCategory" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {msedclCategoryDropDown &&
                              msedclCategoryDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.msedclCategory
                                    : each.msedclCategoryMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="msedclCategory"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.msedclCategory
                          ? errors.msedclCategory.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* division */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.division}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="division" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("division")}
                            label={<FormattedLabel id="division" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {divisionDropDown &&
                              divisionDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.division
                                    : each.divisionMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="division"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.division ? errors.division.message : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* SubDivision */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.subDivision}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="subDivision" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("subDivision")}
                            label={<FormattedLabel id="subDivision" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {subDivisionDropDown &&
                              subDivisionDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.subDivision
                                    : each.subDivisionMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="subDivision"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.subDivision
                          ? errors.subDivision.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>

                  {/* Consumption Type */}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    xl={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      // variant="outlined"
                      variant="standard"
                      size="small"
                      sx={{ m: 1, minWidth: "50%" }}
                      error={!!errors.consumptionType}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        {<FormattedLabel id="consumptionType" />}
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            // sx={{ width: 200 }}
                            value={field.value}
                            {...register("consumptionType")}
                            label={<FormattedLabel id="consumptionType" />}
                            // InputLabelProps={{
                            //   //true
                            //   shrink:
                            //     (watch("officeLocation") ? true : false) ||
                            //     (router.query.officeLocation ? true : false),
                            // }}
                          >
                            {consumptionTypeDropDown &&
                              consumptionTypeDropDown.map((each, index) => (
                                <MenuItem key={index} value={each.id}>
                                  {language == "en"
                                    ? each.consumptionType
                                    : each.consumptionTypeMr}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="consumptionType"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.consumptionType
                          ? errors.consumptionType.message
                          : null}
                      </FormHelperText>
                    </FormControl>
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
                          watch("fromDate") == null || watch("toDate") == null
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
                        onClick={() => generateCSVFile(engReportsData)}
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
                        color="success"
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
                        color="primary"
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
              <CircularProgress color="success" />
            ) : data.length !== 0 ? (
              <div
                style={
                  isLargeScreen
                    ? {
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }
                    : { width: "100%", textAlign: "center" }
                }
              >
                {/* <DataGrid
                autoHeight
                experimentalFeatures={{ columnGrouping: true }}
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
                columnGroupingModel={columnGroupingModel}
              /> */}

                <ReportLayout
                  componentRef={componentRef}
                  rows={data ? data : []}
                  columnLength={27}
                  showDates={true}
                  date={dateObj}
                >
                  <tbody style={{ width: "100%" }}>
                    <tr>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          textAlign: "center",
                          width: "10px",
                        }}
                        rowSpan={2}
                      >
                        <FormattedLabel id="srNo" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                          width: "50px",
                        }}
                        rowSpan={2}
                      >
                        <FormattedLabel id="consumerNo" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                          width: "100px",
                        }}
                        rowSpan={2}
                      >
                        <FormattedLabel id="consumerName" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="april" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="may" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="june" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="july" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="august" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="september" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="october" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="november" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="december" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="january" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="february" />
                      </th>
                      <th
                        style={{
                          border: "1px solid black",
                          backgroundColor: "blue",
                          color: "white",
                          padding: "5px",
                        }}
                        colSpan={2}
                      >
                        <FormattedLabel id="march" />
                      </th>
                    </tr>
                    <tr>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((obj) => (
                        <>
                          <th
                            style={{
                              border: "1px solid black",
                              backgroundColor: "blue",
                              color: "white",
                              textAlign: "center",
                              padding: "3px",
                            }}
                          >
                            <FormattedLabel id="unit" />
                          </th>
                          <th
                            style={{
                              border: "1px solid black",
                              backgroundColor: "blue",
                              color: "white",
                              textAlign: "center",
                              padding: "3px",
                            }}
                          >
                            <FormattedLabel id="amount" />
                          </th>
                        </>
                      ))}
                    </tr>
                    {data.map((rowData, index) => (
                      <tr>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.consumerNo}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {language == "en"
                            ? rowData.consumerName
                            : rowData.consumerNameMr}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.aprilUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.aprilAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.mayUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.mayAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.juneUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.juneAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.julyUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.julyAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.augUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.augAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.septUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.septAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.octUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.octAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.novUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.novAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.decUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.decAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.janUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.janAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.febUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.febAmount}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.marchUnit}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            textAlign: "center",
                          }}
                        >
                          {rowData.marchAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ReportLayout>
              </div>
            ) : (
              ""
            )}
          </Box>
        </Paper>
      </>
    </ThemeProvider>
  );
};

export default Index;
