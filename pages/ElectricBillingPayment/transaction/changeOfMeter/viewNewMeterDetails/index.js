import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Slide,
  InputLabel,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextareaAutosize,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import React from "react";
import BasicLayout from "../../../../../containers/Layout/BasicLayout";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../../../containers/schema/ElelctricBillingPaymentSchema/changeOfLoadSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { height } from "@mui/system";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import moment from "moment";
import sweetAlert from "sweetalert";
import { useRouter } from "next/router";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import { language } from "../../../../../features/labelSlice";
import urls from "../../../../../URLS/urls";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import IconButton from "@mui/material/IconButton";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loader from "../../../../../containers/Layout/components/Loader";
import UploadButton from "../../../../../components/ElectricBillingComponent/uploadDocument/uploadButton";
import commonStyles from "../../../../../styles/BsupNagarvasthi/transaction/commonStyle.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CommonLoader from "../../../../../containers/reuseableComponents/commonLoader";
import {
  cfcCatchMethod,
  moduleCatchMethod,
} from "../../../../../util/commonErrorUtil";
const Index = () => {
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
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
  };

  const language = useSelector((state) => state.labels.language);

  //get logged in user
  const user = useSelector((state) => state.user.user);

  // selected menu from drawer

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  // get authority of selected user

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  const router = useRouter();
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [dataSource, setDataSource] = useState({});
  const [ward, setWard] = useState([]);
  const [department, setDepartment] = useState([]);
  const [zone, setZone] = useState([]);
  const [consumptionType, setConsumptionType] = useState([]);
  const [loadType, setLoadType] = useState([]);
  const [phaseType, setPhaseType] = useState([]);
  const [slabType, setSlabType] = useState([]);
  const [usageType, setUsageType] = useState([]);
  const [msedclDivision, setMsedclDivision] = useState([]);
  const [msedclCategory, setMsedclCategory] = useState([]);
  const [billingDivisionAndUnit, setBillingDivisionAndUnit] = useState([]);
  const [subDivision, setSubDivision] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [slideChecked, setSlideChecked] = useState(true);
  const [departmentCategory, setDepartmentCategory] = useState([]);
  const [billingCycle, setBillingCycle] = useState([]);
  const [meterStatus, setMeterStatus] = useState([]);
  const [juniorEngineerDropDown, setJuniorEngineerDropDown] = useState([]);
  const [deputyEngineerDropDown, setDeputyEngineerDropDown] = useState([]);
  const [executiveEngineerDropDown, setExecutiveEngineerDropDown] = useState(
    []
  );
  const [accountantDropDown, setAccountantDropDown] = useState([]);
  const [loading, setLoading] = useState(false);
  const [referalDocument, setReferalDocument] = useState(null);
  const [equipementCapacityDropdown, setEquipementCapacityDropdown] = useState(
    []
  );
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

  useEffect(() => {
    if (router.query.id) {
      getNewConnectionsData(router.query.id);
    }
  }, [router.query.id]);

  useEffect(() => {
    getWard();
    getDepartment();
    getZone();
    getConsumptionType();
    getLoadType();
    getPhaseType();
    getSlabType();
    getUsageType();
    getMsedclCategory();
    getBillingDivisionAndUnit();
    getSubDivision();
    getDepartmentCategory();
    getBillingCycle();
    getMeterStatus();
    getMsedclDivision();
    getEquipementCapacity();
    getAllRoleOfUser();
  }, []);

  useEffect(() => {
    let _res = dataSource;

    setValue("vanNo", _res?.vanNo ? _res?.vanNo : "");
    setValue("consumerNo", _res?.consumerNo ? _res?.consumerNo : "");
    setValue("zoneKey", _res?.zoneKey ? _res?.zoneKey : "");
    setValue("wardKey", _res?.wardKey ? _res?.wardKey : "");
    setValue(
      "consumerName",
      !_res?.consumerName
        ? ""
        : language == "en"
        ? _res?.consumerName
        : _res?.consumerNameMr
    );
    setValue(
      "consumerAddress",
      !_res?.consumerAddress
        ? ""
        : language == "en"
        ? _res?.consumerAddress
        : _res?.consumerAddressMr
    );
    setValue("pinCode", _res?.pinCode ? _res?.pinCode : "");
    setValue("email", _res?.email ? _res?.email : "");
    setValue("mobileNo", _res?.mobileNo ? _res?.mobileNo : "");
    setValue(
      "consumptionTypeKey",
      _res?.consumptionTypeKey ? _res?.consumptionTypeKey : ""
    );
    setValue("loadTypeKey", _res?.loadTypeKey ? _res?.loadTypeKey : "");
    setValue("phaseKey", _res?.phaseKey ? _res?.phaseKey : "");
    setValue("slabTypeKey", _res?.slabTypeKey ? _res?.slabTypeKey : "");
    setValue("usageTypeKey", _res?.usageTypeKey ? _res?.usageTypeKey : "");

    setValue(
      "msedclDivisionKey",
      _res?.msedclDivisionKey ? _res?.msedclDivisionKey : "-"
    );
    setValue(
      "billingUnitKey",
      _res?.billingUnitKey ? _res?.billingUnitKey : ""
    );
    setValue(
      "subDivisionKey",
      _res?.subDivisionKey ? _res?.subDivisionKey : ""
    );
    setValue(
      "departmentCategoryKey",
      _res?.departmentCategoryKey ? _res?.departmentCategoryKey : ""
    );
    setValue("transactionNo", _res?.transactionNo ? _res?.transactionNo : "");
    setValue("departmentKey", _res?.departmentKey ? _res?.departmentKey : "");

    setValue(
      "multiplyingFactor",
      _res?.multiplyingFactor ? _res?.multiplyingFactor : ""
    );
    setValue(
      "billingCycleKey",
      _res?.billingCycleKey ? _res?.billingCycleKey : ""
    );

    setValue(
      "oldmsedclCategoryKey",
      _res?.oldmsedclCategoryKey
        ? _res?.oldmsedclCategoryKey
        : _res?.msedclCategoryKey
    );
    setValue(
      "oldMeterConnectionDate",
      _res?.oldMeterConnectionDate
        ? _res?.oldMeterConnectionDate
        : _res?.meterConnectionDate
    );
    setValue(
      "oldMeterInitialReading",
      _res?.oldMeterInitialReading
        ? _res?.oldMeterInitialReading
        : _res?.newMeterInitialReading
    );
    setValue(
      "oldMeterReadingDate",
      _res?.oldMeterReadingDate
        ? _res?.oldMeterReadingDate
        : _res?.meterReadingDate
    );
    setValue("oldMeterNo", _res?.oldMeterNo ? _res?.oldMeterNo : _res?.meterNo);
    setValue(
      "oldMeterStatusKey",
      _res?.oldMeterStatusKey ? _res?.oldMeterStatusKey : _res?.meterStatusKey
    );

    setValue("juniorEnggKey", _res?.juniorEnggKey ? _res?.juniorEnggKey : "");
    setValue("dyEngineerKey", _res?.dyEngineerKey ? _res?.dyEngineerKey : "");
    setValue("exEngineerKey", _res?.exEngineerKey ? _res?.exEngineerKey : "");
    setValue(
      "accountOfficerKey",
      _res?.accountOfficerKey ? _res?.accountOfficerKey : ""
    );
    setValue(
      "sanctionedLoad",
      _res?.sanctionedLoad ? _res?.sanctionedLoad : ""
    );
    setValue(
      "sanctionedDemand",
      _res?.sanctionedDemand ? _res?.sanctionedDemand : ""
    );
    setValue("connectedLoad", _res?.connectedLoad ? _res?.connectedLoad : "");
    setValue(
      "contractDemand",
      _res?.contractDemand ? _res?.contractDemand : ""
    );
    setValue("capacityKey", _res?.capacityKey ? _res?.capacityKey : "");
    setValue(
      "msedclCategoryKey",
      _res?.oldmsedclCategoryKey ? _res?.msedclCategoryKey : ""
    );
    setValue(
      "meterConnectionDate",
      _res?.oldMeterConnectionDate ? _res?.meterConnectionDate : null
    );
    setValue(
      "meterReadingDate",
      _res?.oldMeterReadingDate ? _res?.meterReadingDate : null
    );
    setValue(
      "oldMeterClosingDate",
      _res?.oldMeterClosingDate ? _res?.oldMeterClosingDate : ""
    );
    setValue(
      "oldMeterLastReading",
      _res?.oldMeterLastReading ? _res?.oldMeterLastReading : ""
    );
    setValue(
      "newMeterInstallationDate",
      _res?.newMeterInstallationDate ? _res?.newMeterInstallationDate : null
    );
    setValue(
      "newMeterInitialReading",
      _res?.oldMeterInitialReading ? _res?.newMeterInitialReading : ""
    );
    setValue("meterNo", _res?.oldMeterNo ? _res?.meterNo : "");
    setValue(
      "newMeterStatusKey",
      _res?.oldMeterStatusKey ? _res?.meterStatusKey : ""
    );
    setReferalDocument(_res?.docForChangeOfMeter);
    setValue(
      "reasonForChangeOfMeter",
      _res?.reasonForChangeOfMeter ? _res?.reasonForChangeOfMeter : ""
    );
  }, [dataSource, language]);

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

  // get Equipement Capacity
  const getEquipementCapacity = () => {
    axios
      .get(`${urls.EBPSURL}/mstLoadEquipmentCapacity/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setEquipementCapacityDropdown(res.data.mstLoadEquipmentCapacityList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getAllRoleOfUser = () => {
    axios
      .get(`${urls.CFCURL}/master/mstRole/getAll`, { headers: headers })
      .then((res) => {
        let roles = res.data.mstRole;
        let userRole = roles.filter(
          (each) =>
            each.name == "JUNIOR_ENGINEER" ||
            each.name == "DEPUTY_ENGINEER" ||
            each.name == "EXECUTIVE_ENGINEER" ||
            each.name == "ACCOUNTANT"
        );

        userRole.map((obj) => {
          axios
            .get(`${urls.CFCURL}/master/user/getUserByRole?roleId=${obj.id}`, {
              headers: headers,
            })
            .then((res) => {
              if (obj.name == "JUNIOR_ENGINEER") {
                setJuniorEngineerDropDown(res.data.user);
              }
              if (obj.name == "DEPUTY_ENGINEER") {
                setDeputyEngineerDropDown(res.data.user);
              }
              if (obj.name == "EXECUTIVE_ENGINEER") {
                setExecutiveEngineerDropDown(res.data.user);
              }
              if (obj.name == "ACCOUNTANT") {
                setAccountantDropDown(res.data.user);
              }
            }).catch((err) => {
              cfcErrorCatchMethod(err, true);
            });
           
        });
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Msedcl Division
  const getMsedclDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstDivision/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setMsedclDivision(res.data.mstDivisionDao);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Ward Name
  const getWard = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.ward;
        setWard(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Department Name
  const getDepartment = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.department;
        setDepartment(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Zone Name
  const getZone = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, { headers: headers })
      .then((res) => {
        let temp = res.data.zone;
        setZone(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, true);
      });
  };

  // get Consumption Type
  const getConsumptionType = () => {
    axios
      .get(`${urls.EBPSURL}/mstConsumptionType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstConsumptionTypeList;
        setConsumptionType(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Load Type
  const getLoadType = () => {
    axios
      .get(`${urls.EBPSURL}/mstLoadType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstLoadTypeList;
        setLoadType(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Phase Type
  const getPhaseType = () => {
    axios
      .get(`${urls.EBPSURL}/mstPhaseType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstPhaseTypeList;
        setPhaseType(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Slab Type
  const getSlabType = () => {
    axios
      .get(`${urls.EBPSURL}/mstSlabType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstSlabTypeList;
        setSlabType(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Meter Status
  const getMeterStatus = () => {
    axios
      .get(`${urls.EBPSURL}/mstMeterStatus/getAll`, {
        headers: headers,
      })
      .then((res) => {
        setMeterStatus(res.data.mstMeterStatusList);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Billing Cycle
  const getBillingCycle = () => {
    axios
      .get(`${urls.EBPSURL}/mstBillingCycle/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstBillingCycleList;
        setBillingCycle(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Usage Type
  const getUsageType = () => {
    axios
      .get(`${urls.EBPSURL}/mstEbUsageType/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstEbUsageTypeList;
        setUsageType(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Msedcl Category
  const getMsedclCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstMsedclCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstMsedclCategoryList;
        setMsedclCategory(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Billing Division And Unit
  const getBillingDivisionAndUnit = () => {
    axios
      .get(`${urls.EBPSURL}/mstBillingUnit/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstBillingUnitList;
        setBillingDivisionAndUnit(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get SubDivision
  const getSubDivision = () => {
    axios
      .get(`${urls.EBPSURL}/mstSubDivision/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstSubDivisionList;
        setSubDivision(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  // get Department Category
  const getDepartmentCategory = () => {
    axios
      .get(`${urls.EBPSURL}/mstDepartmentCategory/getAll`, {
        headers: headers,
      })
      .then((res) => {
        let temp = res.data.mstDepartmentCategoryList;
        setDepartmentCategory(temp);
      })
      .catch((err) => {
        cfcErrorCatchMethod(err, false);
      });
  };

  const getNewConnectionsData = (id) => {
    setLoading(true);
    if (id) {
      axios
        .get(`${urls.EBPSURL}/trnNewConnectionEntry/getById?id=${id}`, {
          headers: headers,
        })
        .then((res) => {
          setLoading(false);
          let temp = res.data;
          setDataSource(temp);
        })
        .catch((err) => { setLoading(false);
          cfcErrorCatchMethod(err, false);
        });
    }
  };

  // Reset Values Cancell
  const resetValuesForClear = {
    loadTypeKey: "",
  };

  // Exit Button
  const handleExitButton = () => {
    reset({
      ...resetValuesForClear,
      id: null,
    });
    router.push(
      `/ElectricBillingPayment/transaction/changeOfMeter/changeOfMeterDetails`
    );
  };

  // Row

  return loading ? (
    <CommonLoader />
  ) : (
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
      <FormProvider {...methods}>
        {isOpenCollapse && (
          <Slide direction="down" in={slideChecked} mountOnEnter unmountOnExit>
            <form>
              <Box>
                <Grid
                  container
                  className={commonStyles.title}
                  style={{ marginBottom: "8px" }}
                >
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
                      <FormattedLabel id="connectionForNewConnection" />
                    </h3>
                  </Grid>
                </Grid>
              </Box>
              <>
                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="consumerInformation" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.zoneKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {<FormattedLabel id="zone" required />}
                          </InputLabel>
                          <Controller
                            name="zoneKey"
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // {...field}
                                onChange={(value) => {
                                  field.onChange(value);
                                }}
                                // {...register("zoneKey")}

                                label={<FormattedLabel id="zone" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {zone &&
                                  zone.map((each, index) => (
                                    <MenuItem key={index} value={each.id}>
                                      {language == "en"
                                        ? each.zoneName
                                        : each.zoneNameMr}
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

                      {/* Ward Name */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.wardKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="ward" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                {...register("wardKey")}
                                label={<FormattedLabel id="ward" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {ward &&
                                  ward.map((wa, index) => (
                                    <MenuItem key={index} value={wa.id}>
                                      {language == "en"
                                        ? wa.wardName
                                        : wa.wardNameMr}
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

                      {/* Department Name */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.departmentKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="deptName" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("departmentKey")}
                                label={<FormattedLabel id="deptName" />}
                              >
                                {department &&
                                  department.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.department
                                        : type.departmentMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="departmentKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.departmentKey
                              ? errors.departmentKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Consumption Type */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.consumptionTypeKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="consumptionType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("consumptionTypeKey")}
                                label={<FormattedLabel id="consumptionType" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {consumptionType &&
                                  consumptionType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.consumptionType
                                        : type.consumptionTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="consumptionTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.consumptionTypeKey
                              ? errors.consumptionTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* usage Type */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.usageTypeKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {<FormattedLabel id="ebUsageType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("usageTypeKey")}
                                label={<FormattedLabel id="ebUsageType" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {usageType &&
                                  usageType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.usageType
                                        : type.usageTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="usageTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.usageTypeKey
                              ? errors.usageTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* slab Type */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.slabTypeKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {<FormattedLabel id="slabType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("slabTypeKey")}
                                label={<FormattedLabel id="slabType" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {slabType &&
                                  slabType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.slabType
                                        : type.slabTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="slabTypeKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.slabTypeKey
                              ? errors.slabTypeKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/* Consumer Number */}

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
                          disabled
                          id="standard-textarea"
                          label={<FormattedLabel id="consumerNo" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("consumerNo")}
                          error={!!errors.consumerNo}
                          helperText={
                            errors?.consumerNo
                              ? errors.consumerNo.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("consumerNo") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Consumer Name */}

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
                          disabled
                          id="standard-textarea"
                          label={<FormattedLabel id="consumerName" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("consumerName")}
                          error={!!errors.consumerName}
                          helperText={
                            errors?.consumerName
                              ? errors.consumerName.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("consumerName") ? true : false,
                          }}
                        />
                      </Grid>

                      {/*Consumer Address */}

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
                          disabled
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="consumerAddress" required />
                          }
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          multiline
                          variant="standard"
                          {...register("consumerAddress")}
                          error={!!errors.consumerAddress}
                          helperText={
                            errors?.consumerAddress
                              ? errors.consumerAddress.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("consumerAddress") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* Mobile Number */}

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
                          disabled
                          id="standard-textarea"
                          label={<FormattedLabel id="mobile" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("mobileNo")}
                          error={!!errors.mobileNo}
                          helperText={
                            errors?.mobileNo ? errors.mobileNo.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("mobileNo") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Mail Id */}

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
                          disabled
                          id="standard-textarea"
                          label={<FormattedLabel id="email" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("email")}
                          error={!!errors.email}
                          helperText={
                            errors?.email ? errors.email.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("email") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Pin Code */}

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
                          disabled
                          id="standard-textarea"
                          label={<FormattedLabel id="pincode" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("pinCode")}
                          error={!!errors.pinCode}
                          helperText={
                            errors?.pinCode ? errors.pinCode.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("pinCode") ? true : false,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>

              <>
                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="billingDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* MSEDCL Division */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.msedclDivisionKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {<FormattedLabel id="msedclDivision" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("msedclDivisionKey")}
                                label={<FormattedLabel id="msedclDivision" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {msedclDivision &&
                                  msedclDivision.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.division
                                        : type.divisionMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="msedclDivisionKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.msedclDivisionKey
                              ? errors.msedclDivisionKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Billing Division/Unit */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.billingUnitKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {
                              <FormattedLabel
                                id="billingUnitAndDivision"
                                required
                              />
                            }
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("billingUnitKey")}
                                label={
                                  <FormattedLabel id="billingUnitAndDivision" />
                                }
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {billingDivisionAndUnit &&
                                  billingDivisionAndUnit.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? `${type.divisionName}/${type.billingUnit}`
                                        : `${type.divisionNameMr}/${type.billingUnit}`}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="billingUnitKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.billingUnitKey
                              ? errors.billingUnitKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* SubDivision */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.subDivisionKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {<FormattedLabel id="subDivision" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("subDivisionKey")}
                                label={<FormattedLabel id="subDivision" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {subDivision &&
                                  subDivision.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.subDivision
                                        : type.subDivisionMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="subDivisionKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.subDivisionKey
                              ? errors.subDivisionKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      {/*van No */}

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
                          disabled
                          id="standard-textarea"
                          label={<FormattedLabel id="vanNo" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("vanNo")}
                          error={!!errors.vanNo}
                          helperText={
                            errors?.vanNo ? errors.vanNo.message : null
                          }
                          InputLabelProps={{
                            shrink: watch("vanNo") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* Billing Cycle */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.billingCycleKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="billingCycle" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}
                                {...register("billingCycleKey")}
                                // onChange={(e) => setBillingCycleKey(e.target.value)}
                                label={<FormattedLabel id="billingCycle" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {billingCycle &&
                                  billingCycle.map((cycle, index) => (
                                    <MenuItem key={index} value={cycle.id}>
                                      {language == "en"
                                        ? cycle.billingCycle
                                        : cycle.billingCycleMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="billingCycleKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.billingCycleKey
                              ? errors.billingCycleKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/*Multiplying Factor */}

                      {/* <Grid
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
                          disabled
                          id="standard-textarea"
                          label={<FormattedLabel id="multiplyingFactor" />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("multiplyingFactor")}
                          error={!!errors.multiplyingFactor}
                          helperText={
                            errors?.multiplyingFactor
                              ? errors.multiplyingFactor.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("multiplyingFactor") ? true : false,
                          }}
                        />
                      </Grid> */}

                      {/* Junior Engineer */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.juniorEnggKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="juniorEngineer" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("juniorEnggKey")}
                                label={<FormattedLabel id="juniorEngineer" />}
                              >
                                {juniorEngineerDropDown &&
                                  juniorEngineerDropDown.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? `${type.firstNameEn} ${type.middleNameEn} ${type.lastNameEn}`
                                        : `${type.firstNameMr} ${type.middleNameMr} ${type.lastNameMr}`}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="juniorEnggKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.juniorEnggKey
                              ? errors.juniorEnggKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Deputy Engineer */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.dyEngineerKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="deputyEngineer" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("dyEngineerKey")}
                                label={<FormattedLabel id="deputyEngineer" />}
                              >
                                {deputyEngineerDropDown &&
                                  deputyEngineerDropDown.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? `${type.firstNameEn} ${type.middleNameEn} ${type.lastNameEn}`
                                        : `${type.firstNameMr} ${type.middleNameMr} ${type.lastNameMr}`}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="dyEngineerKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.dyEngineerKey
                              ? errors.dyEngineerKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Executive Engineer */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.exEngineerKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="executiveEngineer" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("exEngineerKey")}
                                label={
                                  <FormattedLabel id="executiveEngineer" />
                                }
                              >
                                {executiveEngineerDropDown &&
                                  executiveEngineerDropDown.map(
                                    (type, index) => (
                                      <MenuItem key={index} value={type.id}>
                                        {language == "en"
                                          ? `${type.firstNameEn} ${type.middleNameEn} ${type.lastNameEn}`
                                          : `${type.firstNameMr} ${type.middleNameMr} ${type.lastNameMr}`}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="exEngineerKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.exEngineerKey
                              ? errors.exEngineerKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* accountant */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.accountOfficerKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="accountant" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("accountOfficerKey")}
                                label={<FormattedLabel id="accountant" />}
                              >
                                {accountantDropDown &&
                                  accountantDropDown.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? `${type.firstNameEn} ${type.middleNameEn} ${type.lastNameEn}`
                                        : `${type.firstNameMr} ${type.middleNameMr} ${type.lastNameMr}`}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="accountOfficerKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.accountOfficerKey
                              ? errors.accountOfficerKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>

              <>
                <Accordion sx={{ padding: "10px" }}>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="meterDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* Department Category */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.departmentCategoryKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {
                              <FormattedLabel
                                id="departmentCategory"
                                required
                              />
                            }
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("departmentCategoryKey")}
                                label={
                                  <FormattedLabel id="departmentCategory" />
                                }
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {departmentCategory &&
                                  departmentCategory.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.departmentCategory
                                        : type.departmentCategoryMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="departmentCategoryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.departmentCategoryKey
                              ? errors.departmentCategoryKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* phase Type */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.phaseKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {<FormattedLabel id="phaseType" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("phaseKey")}
                                label={<FormattedLabel id="phaseType" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {phaseType &&
                                  phaseType.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.phaseType
                                        : type.phaseTypeMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="phaseKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.phaseKey ? errors.phaseKey.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Sanctioned Load */}

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
                          disabled
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="sanctionedLoad" required />
                          }
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("sanctionedLoad")}
                          error={!!errors.sanctionedLoad}
                          helperText={
                            errors?.sanctionedLoad
                              ? errors.sanctionedLoad.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("sanctionedLoad") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Sanctioned Demand */}

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
                          disabled
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="sanctionedDemand" required />
                          }
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("sanctionedDemand")}
                          error={!!errors.sanctionedDemand}
                          helperText={
                            errors?.sanctionedDemand
                              ? errors.sanctionedDemand.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("sanctionedDemand") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Connected Load */}

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
                          disabled
                          id="standard-textarea"
                          label={<FormattedLabel id="connectedLoad" required />}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("connectedLoad")}
                          error={!!errors.connectedLoad}
                          helperText={
                            errors?.connectedLoad
                              ? errors.connectedLoad.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("connectedLoad") ? true : false,
                          }}
                        />
                      </Grid>

                      {/* Contract Demand */}

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
                          disabled
                          id="standard-textarea"
                          label={
                            <FormattedLabel id="contractDemand" required />
                          }
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          variant="standard"
                          {...register("contractDemand")}
                          error={!!errors.contractDemand}
                          helperText={
                            errors?.contractDemand
                              ? errors.contractDemand.message
                              : null
                          }
                          InputLabelProps={{
                            shrink: watch("contractDemand") ? true : false,
                          }}
                        />
                      </Grid>
                      {/* Equipement Capacity */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.capacityKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {
                              <FormattedLabel
                                id="LoadEquipmentCapacity"
                                required
                              />
                            }
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("capacityKey")}
                                label={
                                  <FormattedLabel id="LoadEquipmentCapacity" />
                                }
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {equipementCapacityDropdown &&
                                  equipementCapacityDropdown.map(
                                    (type, index) => (
                                      <MenuItem key={index} value={type.id}>
                                        {language == "en"
                                          ? type.loadEquipmentCapacity
                                          : type.loadEquipmentCapacityMr}
                                      </MenuItem>
                                    )
                                  )}
                              </Select>
                            )}
                            name="capacityKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.capacityKey
                              ? errors.capacityKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* old MSEDCL Category */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.oldmsedclCategoryKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {<FormattedLabel id="msedclCategory" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("oldmsedclCategoryKey")}
                                label={<FormattedLabel id="msedclCategory" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {msedclCategory &&
                                  msedclCategory.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.msedclCategory
                                        : type.msedclCategoryMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="oldmsedclCategoryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.oldmsedclCategoryKey
                              ? errors.oldmsedclCategoryKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/*Old Meter Connection Date*/}

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
                        {/* Meter Connection Date in English */}
                        <FormControl
                          error={!!errors.oldMeterConnectionDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="oldMeterConnectionDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  disabled
                                  inputFormat="dd/MM/yyyy"
                                  label={
                                    <FormattedLabel id="oldMeterConnectionDate" />
                                  }
                                  // @ts-ignore
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      variant="standard"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.oldMeterConnectionDate
                              ? errors.oldMeterConnectionDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* old Meter Initial Reading */}

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
                          disabled
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          name="oldMeterInitialReading"
                          id="standard-textarea"
                          label={<FormattedLabel id="oldMeterInitialReading" />}
                          variant="standard"
                          {...register("oldMeterInitialReading")}
                          error={!!errors.oldMeterInitialReading}
                          helperText={
                            errors?.oldMeterInitialReading
                              ? errors?.oldMeterInitialReading.message
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("oldMeterInitialReading")
                                ? true
                                : false) ||
                              (router.query.oldMeterInitialReading
                                ? true
                                : false),
                          }}
                        />
                      </Grid>

                      {/* old Meter Reading Date*/}

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
                          error={!!errors.oldMeterReadingDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="oldMeterReadingDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  disabled
                                  inputFormat="dd/MM/yyyy"
                                  label={
                                    <FormattedLabel id="oldMeterReadingDate" />
                                  }
                                  // @ts-ignore
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{
                                        m: { xs: 0, md: 1 },
                                        minWidth: "100%",
                                      }}
                                      {...params}
                                      size="small"
                                      variant="standard"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.oldMeterReadingDate
                              ? errors.oldMeterReadingDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Old Meter No */}

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
                          disabled
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          name="oldMeterNo"
                          id="standard-textarea"
                          label={<FormattedLabel id="oldMeterNo" />}
                          variant="standard"
                          value={watch("oldMeterNo")}
                          error={!!errors.oldMeterNo}
                          helperText={
                            errors?.oldMeterNo
                              ? errors?.oldMeterNo.message
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("oldMeterNo") ? true : false) ||
                              (router.query.oldMeterNo ? true : false),
                          }}
                        />
                      </Grid>

                      {/* Old Meter Status */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.oldMeterStatusKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {<FormattedLabel id="oldMeterStatus" />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("oldMeterStatusKey")}
                                label={<FormattedLabel id="oldMeterStatus" />}
                              >
                                {meterStatus &&
                                  meterStatus.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.meterStatus
                                        : type.meterStatusMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="oldMeterStatusKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.oldMeterStatusKey
                              ? errors.oldMeterStatusKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>

              <>
                <Accordion sx={{ padding: "10px" }} defaultExpanded>
                  <AccordionSummary
                    sx={{
                      backgroundColor: "#0070f3",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    backgroundColor="#0070f3"
                  >
                    <Typography>
                      <FormattedLabel id="changeOfMeter" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2} sx={{ padding: "1rem" }}>
                      {/* MSEDCL Category */}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.msedclCategoryKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            {/* Location Name */}
                            {<FormattedLabel id="msedclCategory" required />}
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}
                                disabled
                                {...register("msedclCategoryKey")}
                                label={<FormattedLabel id="msedclCategory" />}
                                // InputLabelProps={{
                                //   //true
                                //   shrink:
                                //     (watch("officeLocation") ? true : false) ||
                                //     (router.query.officeLocation ? true : false),
                                // }}
                              >
                                {msedclCategory &&
                                  msedclCategory.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.msedclCategory
                                        : type.msedclCategoryMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="msedclCategoryKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.msedclCategoryKey
                              ? errors.msedclCategoryKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/*Meter Connection Date*/}

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
                        {/* Meter Connection Date in English */}
                        <FormControl
                          error={!!errors.meterConnectionDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="meterConnectionDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  disabled
                                  inputFormat="dd/MM/yyyy"
                                  label={
                                    <FormattedLabel id="meterConnectionDate" />
                                  }
                                  // @ts-ignore
                                  value={field.value}
                                  onChange={(date) =>
                                    field.onChange(
                                      moment(date, "YYYY-MM-DD").format(
                                        "YYYY-MM-DD"
                                      )
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      variant="standard"
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.meterConnectionDate
                              ? errors.meterConnectionDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* Old Meter Closing Date */}

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
                        {/* payment date in English */}
                        <FormControl
                          error={!!errors.oldMeterClosingDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="oldMeterClosingDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel
                                        id="oldMeterClosingDate"
                                        required
                                      />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => {
                                    // field.onChange(date)
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      size="small"
                                      error={!!errors.oldMeterClosingDate}
                                      helperText={
                                        errors?.oldMeterClosingDate
                                          ? errors?.oldMeterClosingDate.message
                                          : null
                                      }
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
                        </FormControl>
                      </Grid>

                      {/* Old Meter Last Reading */}

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
                          disabled
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          name="oldMeterLastReading"
                          id="standard-textarea"
                          label={<FormattedLabel id="oldMeterLastReading" />}
                          variant="standard"
                          {...register("oldMeterLastReading")}
                          error={!!errors.oldMeterLastReading}
                          helperText={
                            errors?.oldMeterLastReading
                              ? errors?.oldMeterLastReading.message
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("oldMeterLastReading") ? true : false) ||
                              (router.query.oldMeterLastReading ? true : false),
                          }}
                        />
                      </Grid>

                      {/* New Meter Installation Date */}

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
                          error={!!errors.newMeterInstallationDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="newMeterInstallationDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel
                                        id="newMeterInstallationDate"
                                        required
                                      />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => {
                                    // field.onChange(date)
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      size="small"
                                      error={!!errors.newMeterInstallationDate}
                                      helperText={
                                        errors?.newMeterInstallationDate
                                          ? errors?.newMeterInstallationDate
                                              .message
                                          : null
                                      }
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
                        </FormControl>
                      </Grid>

                      {/* New Meter Initial Reading */}

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
                          disabled
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          name="newMeterInitialReading"
                          id="standard-textarea"
                          label={<FormattedLabel id="newMeterInitialReading" />}
                          variant="standard"
                          {...register("newMeterInitialReading")}
                          error={!!errors.newMeterInitialReading}
                          helperText={
                            errors?.newMeterInitialReading
                              ? errors?.newMeterInitialReading.message
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("newMeterInitialReading")
                                ? true
                                : false) ||
                              (router.query.newMeterInitialReading
                                ? true
                                : false),
                          }}
                        />
                      </Grid>

                      {/* Meter Reading Date */}

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
                        {/* payment date in English */}
                        <FormControl
                          error={!!errors.meterReadingDate}
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                        >
                          <Controller
                            control={control}
                            name="meterReadingDate"
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  disabled
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel
                                        id="meterReadingDate"
                                        required
                                      />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => {
                                    // field.onChange(date)
                                    field.onChange(
                                      moment(date).format("YYYY-MM-DD")
                                    );
                                  }}
                                  // selected={field.value}
                                  // center
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      variant="standard"
                                      size="small"
                                      error={!!errors.meterReadingDate}
                                      helperText={
                                        errors?.meterReadingDate
                                          ? errors?.meterReadingDate.message
                                          : null
                                      }
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
                        </FormControl>
                      </Grid>

                      {/* New Meter No */}

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
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          disabled
                          name="meterNo"
                          id="standard-textarea"
                          label={<FormattedLabel id="newMeterNo" />}
                          variant="standard"
                          // value={meterNo}
                          {...register("meterNo")}
                          error={!!errors.meterNo}
                          helperText={
                            errors?.meterNo ? errors?.meterNo.message : null
                          }
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("meterNo") ? true : false) ||
                              (router.query.meterNo ? true : false),
                          }}
                        />
                      </Grid>

                      {/*New Meter Status*/}

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
                          // variant="outlined"
                          variant="standard"
                          size="small"
                          sx={{ m: { xs: 0, md: 1 }, minWidth: "100%" }}
                          error={!!errors.newMeterStatusKey}
                        >
                          <InputLabel id="demo-simple-select-standard-label">
                            <FormattedLabel id="newMeterStatus" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                disabled
                                // sx={{ width: 200 }}
                                value={field.value}
                                // onChange={(value) => field.onChange(value)}

                                {...register("newMeterStatusKey")}
                                label={<FormattedLabel id="meterStatus" />}
                              >
                                {meterStatus &&
                                  meterStatus.map((type, index) => (
                                    <MenuItem key={index} value={type.id}>
                                      {language == "en"
                                        ? type.meterStatus
                                        : type.meterStatusMr}
                                    </MenuItem>
                                  ))}
                              </Select>
                            )}
                            name="newMeterStatusKey"
                            control={control}
                            defaultValue=""
                          />
                          <FormHelperText>
                            {errors?.newMeterStatusKey
                              ? errors.newMeterStatusKey.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>

                      {/* upload Document */}

                      <Grid
                        item
                        xl={4}
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <label>
                          <b>
                            <FormattedLabel id="referalDocument" />:
                          </b>
                        </label>
                        <UploadButton
                          appName="EBP"
                          serviceName="EBP-ChnageOfMeter"
                          filePath={(path) => {
                            setReferalDocument(path);
                          }}
                          fileName={referalDocument}
                          mode={"View"}
                        />
                      </Grid>

                      {/* Reason for Change */}

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
                        }}
                      >
                        <TextField
                          disabled
                          sx={{ m: 1, minWidth: "83%" }}
                          name="reasonForChangeOfMeter"
                          id="standard-textarea"
                          multiline
                          inputProps={{ maxLength: 2000 }}
                          label={<FormattedLabel id="reasonForChange" />}
                          variant="standard"
                          {...register("reasonForChangeOfMeter")}
                          error={!!errors.reasonForChangeOfMeter}
                          helperText={
                            errors?.reasonForChangeOfMeter
                              ? errors?.reasonForChangeOfMeter.message
                              : null
                          }
                          InputLabelProps={{
                            //true
                            shrink:
                              (watch("reasonForChangeOfMeter")
                                ? true
                                : false) ||
                              (router.query.reasonForChangeOfMeter
                                ? true
                                : false),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              </>

              {/* Button Row */}

              <Grid container sx={{ padding: "10px" }}>
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
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={handleExitButton}
                  >
                    {<FormattedLabel id="exit" />}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Slide>
        )}
      </FormProvider>
    </Paper>
  );
};

export default Index;
