import {
  Tooltip,
  Button,
  Typography,
  Link,
  FormControl,
  FormHelperText,
  Grid,
  Box,
  InputLabel,
  MenuItem,
  Paper,
  ThemeProvider,
  Select,
  TextField,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import * as MuiIcons from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { GridToolbar } from "@mui/x-data-grid";
import Loader from "../../../containers/Layout/components/Loader";
import theme from "../../../theme";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios from "axios";
import urls from "../../../URLS/urls";
import moment from "moment";
import { useSelector } from "react-redux";
import { sortByProperty } from "../../../components/bsupNagarVasthi/bsupCommonFunctions";
import dynamic from "next/dynamic";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useRouter } from "next/router";
import CommonLoader from "../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../util/commonErrorUtil";

const Index = () => {
  const {
    handleSubmit,
    register,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [mainNames, setMainNames] = useState([]);
  const [subSchemeNames, setSubSchemeNames] = useState([]);
  const language = useSelector((state) => state.labels.language);
  const [areaName, setAreaNames] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [totalRowCount, setTotalRowCount] = useState(0);
  const [bachatGatRegData, setBachatgatRegData] = useState([]);
  const [totalBachatgatCount, setTotalBachatgatCount] = useState(0);
  const [totalApprovedCount, setTotalApprovedCount] = useState(0);
  const [totalRevertedCount, setTotalRevertedCount] = useState(0);
  const [totalRejectedCount, setTotalRejectedCount] = useState(0);
  const [totalPendingCount, setTotalPendingCount] = useState(0);
  const [isChart, setChart] = useState(false);

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

  // const [setCardIndex ]
  const cancelButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };
  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  const resetValuesCancell = {
    zoneKey: "",
    wardKey: "",
    areaKey: "",
    mainSchemeKey: "",
    subSchemeKey: null,
    benecode: "",
    adharNo: "",
    cfcackNo: "",
    patraApatra: "",
    applicantFirstName: "",
    applicantMiddleName: "",
    applicantLastName: "",
  };

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  const patraApatraData = [
    {
      id: 1,
      val: "Y",
      patraName: "Approved",
      patraNameMr: "मंजूर केलेले",
    },
    {
      id: 2,
      val: "N",
      patraName: "Reverted",
      patraNameMr: "पूर्ववत केलेले",
    },
    {
      id: 3,
      val: "Reject",
      patraName: "Rejected",
      patraNameMr: "नाकारलेले",
    },
  ];

  const columns = [
    {
      field: "applicationNo",
      headerName: <FormattedLabel id="applicationNo" />,
      width: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      width: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "mainSchemeName",
      headerName: <FormattedLabel id="mainScheme" />,
      width: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "subSchemeName",
      headerName: <FormattedLabel id="subScheme" />,
      width: 350,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      width: 100,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "patraApatra",
      headerName: <FormattedLabel id="patraApatra" />,
      width: 220,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "isbenefited",
      headerName: <FormattedLabel id="hasBenefit" />,
      width: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <Box>
            <IconButton
              onClick={() => {
                router.push({
                  pathname:
                    "/BsupNagarvasthi/transaction/newApplicationScheme/view",
                  query: {
                    id: params.row.schemeId,
                  },
                });
              }}
            >
              <RemoveRedEyeIcon style={{ color: "#556CD6" }} />
            </IconButton>
          </Box>
        );
      },
    },
  ];
  const onSubmitForm = (formData) => {
    const data = {
      ...formData,
      wardKey:
        formData.wardKey === undefined ||
        formData.wardKey === null ||
        formData.wardKey === ""
          ? 0
          : formData.wardKey,
      zoneKey:
        formData.zoneKey === undefined ||
        formData.zoneKey === null ||
        formData.zoneKey === ""
          ? 0
          : formData.zoneKey,
      areaKey:
        formData.areaKey === undefined ||
        formData.areaKey === null ||
        formData.areaKey === ""
          ? 0
          : formData.areaKey,
      mainSchemeKey:
        formData.mainSchemeKey === undefined ||
        formData.mainSchemeKey === null ||
        formData.mainSchemeKey === ""
          ? 0
          : formData.mainSchemeKey,
      subSchemeKey:
        formData.subSchemeKey === undefined ||
        formData.subSchemeKey === null ||
        formData.subSchemeKey === ""
          ? 0
          : formData.subSchemeKey,
    };
    setIsLoading(true);
    axios
      .post(
        `${urls.BSUPURL}/dashboard/getSchemeApplicationDashboardSummary`,
        data,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        if (r?.data?.length === 0) {
          setChart(false);
          setTotalBachatgatCount(0);
          setTotalApprovedCount(0);
          setTotalRevertedCount(0);
          setTotalRejectedCount(0);
          setBachatgatRegData([]);
          setTotalPendingCount(0);
        } else {
          setChart(true);
          setTotalBachatgatCount(r.data[0]?.totalApplicationsCount);
          setTotalPendingCount(
            r.data[0]?.pendingApplicationsCount
              ? r.data[0]?.pendingApplicationsCount
              : 0
          );

          setTotalApprovedCount(r.data[0]?.totalApprovedApplicationCount);
          setTotalRevertedCount(r.data[0]?.totalRevertedApplicationsCount);
          setTotalRejectedCount(r.data[0]?.totalRejectedApplicationsCount);
          setBachatgatRegData(
            r?.data[0]?.schemeApplicationRowMapperDaoList.map((obj, index) => ({
              id: index + 1,
              schemeId: obj.schemeId,
              applicationDate: moment(obj.applicationDate).format("DD-MM-YYYY"),
              applicationNo: obj.applicationNo,
              bachatgatName: obj.bachatgatName,
              applicantName: obj.applicantName,
              registrationNo: obj.registrationNo,
              status: obj.status,
              isbenefited: obj.isbenefited,
              mainSchemeName: obj.mainSchemeName,
              subSchemeName: obj.subSchemeName,
              patraApatra:
                obj.patraApatra === "true"
                  ? "Approved"
                  : obj.patraApatra === "false"
                  ? "Reverted"
                  : obj.patraApatra,
            }))
          );
        }
      })
      .catch((err) => {
        setChart(false);
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };
  useEffect(() => {
    setTotalRowCount(bachatGatRegData.length);
  }, [bachatGatRegData]);
  const catchMethod = (err) => {
    if (err.message === "Network Error") {
      sweetAlert(
        language == "en" ? "Network Error" : "नेटवर्क त्रुटी !",
        language == "en"
          ? "Server is unreachable or may be a network issue, please try after sometime"
          : "सर्व्हर पोहोचण्यायोग्य नाही किंवा नेटवर्क समस्या असू शकते, कृपया काही वेळानंतर प्रयत्न करा",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else if (err.message === "Request failed with status code 404") {
      sweetAlert(
        language == "en" ? "Bad Request" : "वाईट विनंती !",
        language == "en" ? "Unauthorized access !" : "अनधिकृत पोहोच !!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    } else {
      sweetAlert(
        language == "en" ? "Error" : "त्रुटी !",
        language == "en" ? "Something went to wrong !" : "काहीतरी चूक झाली!",
        "error",
        { button: language === "en" ? "Ok" : "ठीक आहे" }
      );
    }
  };

  useEffect(() => {
    getZone();
    getMainScheme();
  }, []);

  useEffect(() => {
    if (watch("zoneKey") != null && watch("zoneKey") != "") getWardDetails();
  }, [watch("zoneKey")]);

  useEffect(() => {
    if (
      watch("wardKey") != null &&
      watch("wardKey") != "" &&
      watch("wardKey") != undefined
    )
      getAreaByWard();
  }, [watch("wardKey")]);

  const getWardDetails = () => {
    setIsLoading(true);
    axios
      // .get( `${urls.CFCURL}/master/zoneWardAreaMapping/getByZone?zoneId=${watch("zoneKey")}`)
      .get(
        `${
          urls.CFCURL
        }/master/zoneAndWardLevelMapping/getWardByDepartmentId?departmentId=2&zoneId=${watch(
          "zoneKey"
        )}`,
        { headers: headers }
      )
      .then((res) => {
        setIsLoading(false);
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.map((r, i) => ({
            id: r.id,
            wardName: r.wardName,
            wardNameMr: r.wardNameMr,
          }));
          setWardNames(
            language === "en"
              ? data.sort(sortByProperty("wardName"))
              : data.sort(sortByProperty("wardNameMr"))
          );
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, true);
      });
  };

  const getAreaByWard = () => {
    setIsLoading(true);
    axios
      // .get(`${urls.CFCURL}/master/zoneWardAreaMapping/getByWard?wardId=${watch('wardKey')}`)
      .get(
        `${
          urls.CFCURL
        }/master/zoneWardAreaMapping/getAreaByZoneAndWardAndModuleId?zoneId=${watch(
          "zoneKey"
        )}&wardId=${watch("wardKey")}`,
        { headers: headers }
      )

      .then((res) => {
        setIsLoading(false);
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.map((r, i) => ({
            id: r.areaId,
            areaName: r.areaName,
            areaNameMr: r.areaNamemr,
          }));
          setAreaNames(
            language === "en"
              ? data.sort(sortByProperty("areaName"))
              : data.sort(sortByProperty("areaNameMr"))
          );
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, true);
      });
  };

  const getZone = () => {
    axios
      // .get(`${urls.CFCURL}/master/zone/getAll`)
      .get(
        `${urls.CFCURL}/master/zoneAndWardLevelMapping/getZoneByDepartmentId?departmentId=2`,
        { headers: headers }
      )

      .then((res) => {
        setIsLoading(false);
        if (res?.status === 200 || res?.status === 201) {
          let data = res?.data?.map((r, i) => ({
            id: r.id,
            zoneName: r.zoneName,
            zoneNameMr: r.zoneNameMr,
          }));
          setZoneNames(
            language === "en"
              ? data.sort(sortByProperty("zoneName"))
              : data.sort(sortByProperty("zoneNameMr"))
          );
        } else {
          sweetAlert({
            title: language === "en" ? "OOPS!" : "क्षमस्व!",
            text:
              language === "en" ? "Something went wrong!" : "काहीतरी चूक झाली!",
            icon: "error",
            dangerMode: true,
            closeOnClickOutside: false,
            button: language === "en" ? "Ok" : "ठीक आहे",
          });
        }
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, true);
      });
  };

  const getMainScheme = () => {
    axios
      .get(`${urls.BSUPURL}/mstMainSchemes/getAll`, {
        headers: headers,
      })
      .then((r) => {
        let data = r.data.mstMainSchemesList.map((row, index) => ({
          id: row.id,
          schemeName: row.schemeName,
          schemeNameMr: row.schemeNameMr,
          schemePrefix: row.schemePrefix,
        }));
        setMainNames(
          language === "en"
            ? data.sort(sortByProperty("schemeName"))
            : data.sort(sortByProperty("schemeNameMr"))
        );
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  useEffect(() => {
    if (
      watch("mainSchemeKey") != null &&
      watch("mainSchemeKey") != "" &&
      watch("mainSchemeKey") != undefined
    )
      getSubSchemeFromMainScheme();
  }, [watch("mainSchemeKey")]);

  const getSubSchemeFromMainScheme = () => {
    setIsLoading(true);
    axios
      .get(
        `${
          urls.BSUPURL
        }/mstSubSchemes/getAllByMainSchemeKey?mainSchemeKey=${watch(
          "mainSchemeKey"
        )}`,
        {
          headers: headers,
        }
      )
      .then((r) => {
        setIsLoading(false);
        let data = r.data.mstSubSchemesList.map((row, index) => ({
          id: row.id,
          subSchemeName: row.subSchemeName,
          subSchemeNameMr: row.subSchemeNameMr,
          benefitAmount: row.benefitAmount,
          forBachatGat: row.forBachatGat,
        }));
        setSubSchemeNames(
          language === "en"
            ? data.sort(sortByProperty("subSchemeName"))
            : data.sort(sortByProperty("subSchemeNameMr"))
        );
      })
      .catch((err) => {
        setIsLoading(false);
        cfcErrorCatchMethod(err, false);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading && <CommonLoader />}
      <Paper
        elevation={8}
        variant="outlined"
        sx={{
          border: 1,
          borderColor: "grey.500",
          marginTop: "10px",
          marginBottom: "60px",
          padding: 1,
          "@media (max-width: 770px)": {
            marginTop: "4rem",
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <Grid container spacing={2} style={{ padding: "1rem" }}>
            {/* Zone Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                error={errors.zoneKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="zoneNames" />
                </InputLabel>
                <Controller
                  {...register("zoneKey")}
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      {zoneNames &&
                        zoneNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.zoneName
                              : auditorium.zoneNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="zoneKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.zoneKey ? errors.zoneKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Ward name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                error={errors.wardKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="wardName" />
                </InputLabel>
                <Controller
                  {...register("wardKey")}
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      {wardNames &&
                        wardNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.wardName
                              : auditorium.wardNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="wardKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.wardKey ? errors.wardKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <FormControl
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                error={!!errors.areaKey}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="areaName" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      label="Select Service"
                      watch
                    >
                      {areaName &&
                        areaName.map((service, index) => (
                          <MenuItem key={index} value={service.id}>
                            {language === "en"
                              ? service.areaName
                              : service.areaNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="areaKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.areaKey ? errors.areaKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                error={errors.mainSchemeKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="mainScheme" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      label="Select Auditorium"
                    >
                      {mainNames &&
                        mainNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.schemeName
                              : auditorium.schemeNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="mainSchemeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.mainSchemeKey ? errors.mainSchemeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>
            {/* Sub Scheme Key */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                error={errors.subSchemeKey}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="subScheme" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      label="Select Auditorium"
                    >
                      {subSchemeNames &&
                        subSchemeNames.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.subSchemeName
                              : auditorium.subSchemeNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="subSchemeKey"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.subSchemeKey ? errors.subSchemeKey.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* approved/reverted/rejeccted */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FormControl
                error={errors.patraApatra}
                variant="standard"
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  <FormattedLabel id="patraApatra" />
                </InputLabel>
                <Controller
                  render={({ field }) => (
                    <Select
                      sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      label="Select Auditorium"
                    >
                      {patraApatraData &&
                        patraApatraData.map((auditorium, index) => (
                          <MenuItem key={index} value={auditorium.id}>
                            {language === "en"
                              ? auditorium.patraName
                              : auditorium.patraNameMr}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                  name="patraApatra"
                  control={control}
                  defaultValue=""
                />
                <FormHelperText>
                  {errors?.patraApatra ? errors.patraApatra.message : null}
                </FormHelperText>
              </FormControl>
            </Grid>

            <>
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={4}
                xl={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextField
                  sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                  id="standard-basic"
                  label={<FormattedLabel id="beneficiaryCode" />}
                  variant="standard"
                  InputLabelProps={{ shrink: watch("benecode") ? true : false }}
                  {...register("benecode")}
                  error={!!errors.benecode}
                  helperText={errors?.benecode ? errors.benecode.message : null}
                />
              </Grid>
            </>

            {/* adhar no */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="applicantAdharNo" />}
                variant="standard"
                {...register("adharNo")}
                InputLabelProps={{
                  shrink: watch("adharNo") ? true : false,
                }}
                error={!!errors.adharNo}
                helperText={errors?.adharNo ? errors.adharNo.message : null}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                label={<FormattedLabel id="cfcackNo" />}
                variant="standard"
                {...register("cfcackNo")}
                InputLabelProps={{
                  shrink: watch("cfcackNo") ? true : false,
                }}
                error={!!errors.cfcackNo}
                helperText={errors?.cfcackNo ? errors.cfcackNo.message : null}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                InputLabelProps={{ shrink: watch("applicantFirstName") }}
                label={<FormattedLabel id="applicantFirstName" />}
                variant="standard"
                {...register("applicantFirstName")}
                error={!!errors.applicantFirstName}
                helperText={
                  errors?.applicantFirstName
                    ? errors.applicantFirstName.message
                    : null
                }
              />
            </Grid>
            {/* Middle Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                InputLabelProps={{ shrink: watch("applicantMiddleName") }}
                label={<FormattedLabel id="applicantMiddleName" />}
                variant="standard"
                {...register("applicantMiddleName")}
                error={!!errors.applicantMiddleName}
                helperText={
                  errors?.applicantMiddleName
                    ? errors.applicantMiddleName.message
                    : null
                }
              />
            </Grid>
            {/* Last Name */}
            <Grid
              item
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                id="standard-basic"
                InputLabelProps={{ shrink: watch("applicantLastName") }}
                label={<FormattedLabel id="applicantLastName" />}
                variant="standard"
                {...register("applicantLastName")}
                error={!!errors.applicantLastName}
                helperText={
                  errors?.applicantLastName
                    ? errors.applicantLastName.message
                    : null
                }
              />
            </Grid>
          </Grid>
          <Grid container sx={{ padding: "10px" }}>
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
              <Button
                onClick={() => {
                  cancelButton();
                }}
                size="small"
                variant="contained"
                color="error"
              >
                <FormattedLabel id="clear" />
              </Button>
            </Grid>
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
              <Button
                variant="contained"
                color="success"
                size="small"
                type="submit"
              >
                <FormattedLabel id="showAll" />
              </Button>
            </Grid>
          </Grid>
        </form>
        <hr />
        <Grid container style={{ display: "flex", justifyContent: "center" }}>
          {[
            {
              id: 1,
              icon: "Menu",
              count: totalBachatgatCount,
              name: <FormattedLabel id="totalApplication" />,
              bg: "#7F00FF",
            },
            {
              id: 2,
              icon: "Menu",
              count: totalPendingCount,
              name: <FormattedLabel id="pendingApplication" />,
              bg: "#dc143c",
            },
            {
              id: 3,
              icon: "Menu",
              count: totalApprovedCount,
              name: <FormattedLabel id="approvedApplication" />,
              bg: "#00FF00",
            },
            {
              id: 4,
              icon: "Menu",
              count: totalRevertedCount,
              name: <FormattedLabel id="revertedApplication" />,
              bg: "#dc143c",
            },
            {
              id: 5,
              icon: "Menu",
              count: totalRejectedCount,
              name: <FormattedLabel id="rejectedApplication" />,
              bg: "#FFC0CB",
            },
          ]?.map((val, id) => {
            return (
              <Tooltip title={val?.name}>
                <Grid
                  key={id}
                  item
                  xs={3}
                  style={{
                    paddingTop: "10px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    paddingBottom: "0px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Grid
                    container
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "10px",
                      borderRadius: "15px",
                      backgroundColor: "white",
                      height: "100%",
                    }}
                    sx={{
                      ":hover": {
                        boxShadow: "0px 5px #556CD6",
                      },
                    }}
                    boxShadow={3}
                  >
                    <Grid
                      item
                      xs={2}
                      style={{
                        padding: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: val?.bg,
                        color: "white",
                        borderRadius: "7px",
                      }}
                      boxShadow={2}
                    >
                      <ComponentWithIcon iconName={val?.icon} />
                    </Grid>
                    <Grid
                      item
                      xs={10}
                      style={{
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: "500",
                          fontSize: "25px",
                          color: "#556CD6",
                        }}
                      >
                        {val.count}
                      </Typography>
                      {val.id === 1 && (
                        <Link
                          style={{ fontWeight: "600" }}
                          onClick={() => {
                            // setCardIndex(0);
                            // getBachatgatRegistrationDetails();
                          }}
                          tabIndex={0}
                          component="button"
                        >
                          {val?.name}
                        </Link>
                      )}
                      {val.id === 2 && (
                        <Link
                          style={{ fontWeight: "600" }}
                          tabIndex={0}
                          component="button"
                        >
                          {val.name}
                        </Link>
                      )}
                      {val?.id === 3 && (
                        <Link
                          style={{ fontWeight: "600" }}
                          onClick={() => {
                            // setCardIndex(1);
                            // getRegDetails(1);
                          }}
                          tabIndex={0}
                          component="button"
                        >
                          {val.name}
                        </Link>
                      )}

                      {val.id === 4 && (
                        <Link
                          style={{ fontWeight: "600" }}
                          onClick={() => {
                            // setCardIndex(2);
                            // getRegDetails(2);
                          }}
                          tabIndex={0}
                          component="button"
                        >
                          {val.name}
                        </Link>
                      )}
                      {val.id === 5 && (
                        <Link
                          style={{ fontWeight: "600" }}
                          onClick={() => {
                            // setCardIndex(3);
                            // getRegDetails(3);
                          }}
                          tabIndex={0}
                          component="button"
                        >
                          {val.name}
                        </Link>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Tooltip>
            );
          })}
        </Grid>

        {/* Charts Section */}

        {isChart && (
          <Box
            sx={{
              display: "flex",
              padding: "30px",
              flexDirection: ["column", "row"],
              flexWrap: "wrap",
              justifyContent: "space-around",
            }}
          >
            <Chart
              options={{
                chart: {
                  id: "basic-pie-1", // Use a unique id for each chart
                },
                labels: [
                  language === "en" ? "Approved Applications" : "मंजूर अर्ज",
                  language === "en"
                    ? "Reverted Applications"
                    : "परत केलेले अर्ज",
                  language === "en"
                    ? "Rejected Applications"
                    : "नाकारलेले अर्ज",
                  language === "en" ? "Pending Applications" : "प्रलंबित अर्ज",
                ],
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 200,
                      },
                      legend: {
                        position: "bottom",
                      },
                    },
                  },
                ],
              }}
              series={[
                totalApprovedCount,
                totalRevertedCount,
                totalRejectedCount,
                totalPendingCount,
              ]}
              // series={[50,50]}
              type="pie"
              // width={400}
              // height={300}
              width={600}
              height={500}
            />

            <Chart
              options={{
                chart: {
                  id: "basic-bar-1", // Use a unique id for the bar chart
                },
                xaxis: {
                  categories: [
                    language === "en" ? "Total Applications" : "एकूण अर्ज",
                    language === "en"
                      ? "Pending Applications"
                      : "प्रलंबित अर्ज",
                    language === "en" ? "Approved Applications" : "मंजूर अर्ज",
                    language === "en"
                      ? "Reverted Applications"
                      : "परत केलेले अर्ज",
                    language === "en"
                      ? "Rejected Applications"
                      : "नाकारलेले अर्ज",
                  ],
                },
                responsive: [
                  {
                    breakpoint: 480,
                    options: {
                      chart: {
                        width: 300, // Adjust the width for better responsiveness
                      },
                    },
                  },
                ],
              }}
              series={[
                {
                  name: "Applications",
                  data: [
                    totalBachatgatCount,
                    totalPendingCount,
                    totalApprovedCount,
                    totalRevertedCount,
                    totalRejectedCount,
                  ],
                },
              ]}
              type="bar"
              // width={400}
              // height={300}
              width={600}
              height={500}
            />
          </Box>
        )}

        <DataGrid
          components={{ Toolbar: GridToolbar }}
          componentsProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          autoHeight
          sx={{
            overflowY: "scroll",
            marginTop: "20px",
            "& .MuiDataGrid-virtualScrollerContent": {},
            "& .MuiDataGrid-columnHeadersInner": {
              backgroundColor: "#556CD6",
              color: "white",
            },
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-root[aria-label='Export']":
              {
                display: "none",
              },
          }}
          density="standard"
          pagination
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          rowCount={totalRowCount}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50, 100]}
          rows={bachatGatRegData}
          columns={columns}
          onPageChange={(_data) => {}}
          onPageSizeChange={(_data) => {}}
        />
      </Paper>
    </ThemeProvider>
  );
};
export default Index;
