import * as MuiIcons from "@mui/icons-material";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import moment, { lang } from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { setSelectedServiceId } from "../../../features/userSlice";
import urls from "../../../URLS/urls";
// import { catchExceptionHandlingMethod } from "../../../../util/util";
import { catchExceptionHandlingMethod } from "../../../util/util";

// func
const Index = () => {
  const {
    getValues,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
    // defaultValues: {},
  });

  const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();

  const [selectedCard, setSelectedCard] = useState(false);
  const [selectedCard1, setSelectedCard1] = useState(false);

  //service dropdown related
  const [serviceId, setServiceId] = useState([1]);
  const [check, setCheck] = useState([]);
  const [serviceName, setServiceName] = useState([]);

  //case entry wale
  const [caseDtlData, setCaseDtlData] = useState(false);
  const [caseEntryCreated, setCaseEntryCreated] = useState(0);
  const [running, setRunning] = useState(0);
  const [finalOrder, setFinalOrder] = useState(0);
  const [intrimOrder, setIntrimOrder] = useState(0);

  const [totalCaseEntry, setTotalCaseEntry] = useState(0);

  const [totalDemandednBill, setTotalDemandedBill] = useState(0);

  const [totalOpinion, setTotalOpinion] = useState(0);

  const [totalNotice, setTotalNotice] = useState(0);

  //opnion
  const [opinionData, setOpinionData] = useState(false);
  const [opinionDrafted, setOpinionDrafted] = useState(0);
  const [opinionCreated, setOpinionCreated] = useState(0);
  const [opinionApproved, setOpinionApproved] = useState(0);

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
  const [advocateOpinionSubmitted, setAdvocateOpinionSubmitted] = useState(0);
  const [
    advocateOpinionPartiallySubmitted,
    setAdvocateOpinionPartiallySubmitted,
  ] = useState(0);
  const [opinionSubmmited, setOpinionSubmmited] = useState(0);

  //notice chya stata
  const [noticeData, setNoticeData] = useState(false);
  const [noticeDrafted, setNoticeDrafted] = useState(0);
  const [noticeCreated, setNoticeCreated] = useState(0);
  const [noticeApproved, setNoticeApproved] = useState(0);
  const [noticeReassigned, setNoticeReassigned] = useState(0);

  //parawise
  const [parawiseReportDrafted, setParawiseReportDrafted] = useState(0);
  const [parawiseReportCreated, setParawiseReportCreated] = useState(0);
  const [parawiseReportApproved, setParawiseReportApproved] = useState(0);
  const [parawiseReportReassigned, setParawiseReportReassigned] = useState(0);

  //res to notice
  const [responseToNoticeDrafted, setResponseToNoticeDrafted] = useState(0);
  const [responseToNoticeCreated, setResponseToNoticeCreated] = useState(0);
  const [responseToNoticeApproved, setResponseToNoticeApproved] = useState(0);
  const [responseToNoticeReassigned, setResponseToNoticeReassigned] =
    useState(0);

  //demand bill
  const [demandBillData, setDemandBillData] = useState(false);
  const [billRaised, setBillRaised] = useState(0);
  const [billSubmitted, setBillSubmitted] = useState(0);
  const [billApproved, setBillApproved] = useState(0);
  const [billPaid, setBillPaid] = useState(0);
  const [id, setID] = useState();

  const dispatch = useDispatch();

  const ComponentWithIcon = ({ iconName }) => {
    const Icon = MuiIcons[iconName];
    return <Icon style={{ fontSize: "30px" }} />;
  };

  const rows = [
    createData(159, 6.0, 4.0, "ddD", "sdsd"),
    createData(237, 9.0, 4.3, "HDHD", "sdqw"),
    createData(262, 16.0, 6.0, "DQJD", "fqf"),
    createData(305, 3.7, 4.3, "DQWJH", "qaef"),
    createData(356, 16.0, 3.9, "DQW", "ahf"),
  ];

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const handleChange = (event) => {
    console.log("event", event);
    const {
      target: { value },
    } = event;
    setServiceId(typeof value === "string" ? value.split(",") : value);
    setServiceName(
      typeof value === "string"
        ? value
            .split(",")
            ?.map((splits) => check?.find((chk) => chk.serviceId == splits))
        : check?.find((chk) => chk.serviceId == value)?.serviceName
    );
  };
  const response = useSelector((state) => {
    return state.user.usersDepartmentDashboardData;
  });

  const test = useSelector((state) => {
    console.log("test2", state.user.selectedServiceId);
    return state.user.setSelectedServiceId;
  });

  // let check = response?.menus?.filter((test) => test.appKey == 5 && test.parentId == 3).map((test) => test);

  const onSubmitForm = (data) => {
    console.log("data");
  };

  const apiii = () => {
    if (getValues("fromDate") && getValues("toDate") && serviceId) {
      const body = {
        fromDate: getValues("fromDate"),
        toDate: getValues("toDate"),
        services: serviceId,
      };

      axios
        .post(`${urls.LCMSURL}/dashboard/getCountForDashboard`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((r) => {
          if (r.status == 200) {
            console.log("res department", r.data);
            // setResponsee(r.data);
            if (r.data.length > 0) {
              r.data.map((e) => {
                switch (e.serviceId) {
                  case 1:
                    switch (e.applicationStatus) {
                      case "OPINION_DRAFT":
                        if (e.count) {
                          setOpinionDrafted(e.count);
                          setOpinionData(true);
                        }
                        break;
                      case "OPINION_CREATED":
                        if (e.count) {
                          setOpinionCreated(e.count);
                          setOpinionData(true);
                        }
                        break;
                      case "OPINION_APPROVED":
                        if (e.count) {
                          setOpinionApproved(e.count);
                          setOpinionData(true);
                        }
                        break;
                      case "OPINION_SUBMITTED":
                        if (e.count) {
                          setOpinionSubmmited(e.count);
                          setOpinionData(true);
                        }
                        break;
                      case "ADV_OPINION_PARTIALLY_SUBMITTED":
                        if (e.count) {
                          setAdvocateOpinionPartiallySubmitted(e.count);
                          setOpinionData(true);
                        }
                        break;
                      // case "ADD_OPINION_SUBMITTED":
                      case "OPINIONS_SUBMITTED_BY_ALL":
                        if (e.count) {
                          setAdvocateOpinionSubmitted(e.count);
                          setOpinionData(true);
                        }
                        break;
                    }
                    break;

                  case 2:
                    switch (e.applicationStatus) {
                      case "CASE CREATED":
                        if (e.count) {
                          setCaseEntryCreated(e.count);
                          setCaseDtlData(true);
                        }
                        break;
                      case "RUNNING":
                        if (e.count) {
                          setRunning(e.count);
                          setCaseDtlData(true);
                        }
                        break;
                      case "finalOrder":
                        if (e.count) {
                          setFinalOrder(e.count);
                          setCaseDtlData(true);
                        }
                        break;
                      case "intrimOrder":
                        if (e.count) {
                          setIntrimOrder(e.count);
                          setCaseDtlData(true);
                        }
                        break;
                    }
                    break;

                  case 3:
                    switch (e.applicationStatus) {
                      // case "NOTICE_DRAFT":
                      //   if (e.count) {
                      //     setNoticeDrafted(e.count);
                      //     setNoticeData(true);
                      //   }
                      //   break;
                      case "NOTICE_CREATED":
                        if (e.count) {
                          setNoticeCreated(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "NOTICE_APPROVED_BY_LEGAL_HOD":
                        // case "NOTICE_APPROVED":
                        if (e.count) {
                          setNoticeApproved(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "NOTICE_REASSIGNED_BY_LEGAL_HOD":
                        // case "NOTICE_REASSIGNED":
                        if (e.count) {
                          setNoticeReassigned(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "PARAWISE_REPORT_DRAFT":
                        if (e.count) {
                          setParawiseReportDrafted(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "PARAWISE_REPORT_CREATED":
                        if (e.count) {
                          setParawiseReportCreated(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "PARAWISE_REPORT_APPROVED":
                        if (e.count) {
                          setParawiseReportApproved(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "PARAWISE_REPORT_REASSIGNED":
                        if (e.count) {
                          setParawiseReportReassigned(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "RESPONSE_TO_NOTICE_DRAFT":
                        if (e.count) {
                          setResponseToNoticeDrafted(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "RESPONSE_TO_NOTICE_CREATED":
                        if (e.count) {
                          setResponseToNoticeCreated(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "RESPONSE_TO_NOTICE_APPROVED":
                        if (e.count) {
                          setResponseToNoticeApproved(e.count);
                          setNoticeData(true);
                        }
                        break;
                      case "RESPONSE_TO_NOTICE_REASSIGNED":
                        if (e.count) {
                          setResponseToNoticeReassigned(e.count);
                          setNoticeData(true);
                        }
                        break;
                    }
                    break;
                  case 79:
                    switch (e.applicationStatus) {
                      case "BILL_RAISED":
                        if (e.count) {
                          setBillRaised(e.count);
                          setDemandBillData(true);
                        }
                        break;
                      case "BILL_SUBMITTED":
                        if (e.count) {
                          setBillSubmitted(e.count);
                          setDemandBillData(true);
                        }
                        break;
                      case "BILL_APPROVED":
                        if (e.count) {
                          setBillApproved(e.count);
                          setDemandBillData(true);
                        }
                        break;
                      case "BILL_PAID":
                        if (e.count) {
                          setBillPaid(e.count);
                          setDemandBillData(true);
                        }
                        break;
                    }
                    break;
                }
              });
            }
          }
        })
        ?.catch((err) => {
          console.log("err", err);
          callCatchMethod(err, language);
        });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  // Reset Values Cancell
  const resetValuesCancell = {
    fromDate: "",
    // caseSubType: "",
  };

  // ---------useEffects -------

  // useEffect for total Case Entry
  useEffect(() => {
    let totalCaseEntry = caseEntryCreated + running + finalOrder + intrimOrder;

    console.log("totalCaseEntry", totalCaseEntry);

    setTotalCaseEntry(totalCaseEntry);
  }, [caseEntryCreated, running, finalOrder, intrimOrder]),
    // useEffect for Demanded Bill

    useEffect(() => {
      let totalDemandednBill =
        billRaised + billSubmitted + billApproved + billPaid;
      console.log("totalDemandednBill", totalDemandednBill);

      setTotalDemandedBill(totalDemandednBill);
    }, [billRaised, billSubmitted, billApproved, billPaid]),
    useEffect(() => {
      let totalOpinion =
        opinionCreated +
        opinionApproved +
        advocateOpinionSubmitted +
        opinionSubmmited;
      setTotalOpinion(totalOpinion);
    }, [
      opinionCreated,
      opinionApproved,
      advocateOpinionSubmitted,
      opinionSubmmited,
    ]);

  // useEffect for Notice
  useEffect(() => {
    let totalNotice =
      noticeDrafted + noticeCreated + noticeApproved + noticeReassigned;
    setTotalNotice(totalNotice);
  }, [noticeDrafted, noticeCreated, noticeApproved, noticeReassigned]);

  useEffect(() => {}, [
    totalCaseEntry,
    totalDemandednBill,
    totalOpinion,
    totalNotice,
  ]);

  useEffect(() => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("serviceName", r);
        if (r.status == 200) {
          setCheck(
            r.data.service.filter((s) => s.application == 5).map((s) => s)
          );
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        callCatchMethod(err, language);
      });
  }, []);

  useEffect(() => {
    console.log("serviceIds", serviceId);

    apiii();
  }, [serviceId]);

  useEffect(() => {
    console.log("setCheck", check);
  }, [check]);

  useEffect(() => {
    if (router?.query?.serviceId) {
      let serviceIds = router?.query?.serviceId;
      let _a = [];
      Array.isArray(serviceIds)
        ? (_a = serviceIds?.map((obj) => Number(obj)))
        : _a.push(parseInt(serviceIds));
      console.log("_a", _a);
      setServiceId(_a);
    }
  }, [router?.query]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // background:"rgb(173, 216, 230)",
            ///height:"800PX"
          }}
        >
          <Paper
            elevation={5}
            // variant="outlined"
            style={{
              // alignContent:'start',
              border: "2px solid  rgb(173, 216, 230)",
            }}
          >
            <Typography
              sx={{
                marginTop: "25px",
                display: "flex",
                justifyContent: "center",
                // color: "red",
              }}
            >
              <h2
                style={{
                  color: "#ff0000",
                }}
              >
                <b>
                  <FormattedLabel id="legalCaseDashboard" />
                </b>
              </h2>
            </Typography>

            {/* New Exp */}

            <Grid
              container
              sx={{
                marginTop: "40px",
                marginBottom: "40px",
              }}
            >
              <Grid item xl={2} lg={2}></Grid>
              <Grid item xl={1.5} lg={1.5}>
                <FormControl
                  style={{ backgroundColor: "white" }}
                  error={!!errors.fromDate}
                >
                  <Controller
                    control={control}
                    name="fromDate"
                    defaultValue={null}
                    //fullWidth
                    // style={{height:"10px"}}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disableFuture
                          //  fullWidth

                          inputFormat="DD/MM/YYYY"
                          // label={<span style={{ fontSize: 16 }}>From Date</span>}
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="fromDate" />
                            </span>
                          }
                          // fromDate
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              //  style={{height:"10px",}}
                              autoFocus
                              {...params}
                              size="small"
                              //fullWidth
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  {/* <FormHelperText>
                      {errors?.fromDate ? errors.fromDate.message : null}
                    </FormHelperText> */}
                </FormControl>
              </Grid>
              <Grid item xl={0.3} lg={0.3}></Grid>

              {/* to Date */}
              <Grid item xl={1.5} lg={1.5}>
                <FormControl
                  style={{ backgroundColor: "white" }}
                  error={!!errors.fromDate}
                >
                  <Controller
                    control={control}
                    name="toDate"
                    // defaultValue={null}
                    defaultValue={new Date()}
                    fullWidth
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          disableFuture
                          //  fullWidth
                          inputFormat="DD/MM/YYYY"
                          label={
                            <span style={{ fontSize: 16 }}>
                              <FormattedLabel id="toDate" />
                            </span>
                          }
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          selected={field.value}
                          center
                          renderInput={(params) => (
                            <TextField
                              autoFocus
                              {...params}
                              size="small"
                              fullWidth
                            />
                          )}
                          minDate={watch("fromDate")}
                        />
                      </LocalizationProvider>
                    )}
                  />
                  <FormHelperText>
                    {/* {errors?.fromDate ? errors.fromDate.message : null} */}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xl={0.3} lg={0.3}></Grid>

              {/* service  */}
              <Grid item lg={4} xl={4}>
                <FormControl
                  fullWidth
                  size="small"
                  style={{
                    //  width: "60%",
                    backgroundColor: "white",
                  }}
                >
                  <InputLabel id="demo-simple-select-label">
                    <FormattedLabel id="selectService" />
                  </InputLabel>
                  <Select
                    sx={{ width: 350 }}
                    style={{
                      height: "40px",
                    }}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    multiple
                    value={serviceId}
                    label={<FormattedLabel id="selectService" />}
                    onChange={handleChange}
                    renderValue={(selected) =>
                      check
                        .filter((v) => selected.includes(v.id))
                        // .map((v) => v.serviceName)
                        .map((v) =>
                          language === "en" ? v.serviceName : v.serviceNameMr
                        )

                        .join(", ")
                    }
                  >
                    {check.length > 0
                      ? check.map((name, index) => {
                          console.log("name", name);
                          return (
                            // <MenuItem key={name.id} value={name.serviceName}>
                            <MenuItem
                              key={name.id}
                              value={name.id}
                              // value={name.serviceName}
                            >
                              <Checkbox
                                checked={serviceId.indexOf(name.id) > -1}
                              />

                              <ListItemText
                                // primary={name.serviceName}
                                primary={
                                  language === "en"
                                    ? name.serviceName
                                    : name.serviceNameMr
                                }
                              />
                            </MenuItem>
                          );
                        })
                      : []}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xl={0.3} lg={0.3}></Grid>

              {/* <Grid item xl={1} lg={1}>
                <Button
                  style={{ height: "40px", width: "110px" }}
                  variant="contained"
                  endIcon={<MuiIcons.SavedSearch />}
                  onClick={() => {
                    reset();

                    apiii();

                    console.log("serviceId2", serviceId);
                    dispatch(setSelectedServiceId(serviceId));
                  }}
                >
                  {/* SEARCH */}
              {/* <FormattedLabel id="search" /> */}
              {/* </Button>
              </Grid>  */}

              {/* <Grid item xl={0.4} lg={0.4}></Grid> */}
              <Grid item xl={1} lg={1}>
                <Button
                  style={{ height: "40px", width: "110px" }}
                  variant="contained"
                  // size="small"
                  endIcon={<MuiIcons.Clear />}
                  onClick={
                    () => {
                      reset();
                      setServiceId([]);
                      setCaseDtlData(false);
                      setOpinionData(false);
                      setNoticeData(false);
                      setDemandBillData(false);
                    }
                    // cancellButton()
                  }
                >
                  {/* Clear */}
                  <FormattedLabel id="clear" />
                </Button>
              </Grid>
              <Grid item xl={0.3} lg={0.3}></Grid>
            </Grid>

            {/* </Box> */}

            {/* Case details new  Exp*/}

            {/* {opinionData && ( */}
            {serviceId?.includes(1) && (
              <>
                {/* Opinion Details */}
                <Paper
                  sx={{
                    marginTop: "20px",
                    padding: "20px",
                    borderTop: "2px solid  rgb(173, 216, 230)",
                    borderBottom: "2px solid  rgb(173, 216, 230)",
                  }}
                  // variant="outlined" square
                  elevation={3}
                >
                  <Typography
                    style={{
                      padding: "5px !Important",
                      margin: "5px !Important",
                    }}
                  >
                    {/* <h3>Opinion Details</h3> */}
                    <h3>
                      <FormattedLabel id="opinionDetails"></FormattedLabel> :
                      {/* Total Opinions */}
                      <FormattedLabel id="totalOpinions"></FormattedLabel>
                      {totalOpinion}
                    </h3>
                  </Typography>

                  {/* New Code */}
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      {[
                        {
                          icon: "SaveAs",
                          count: opinionCreated,
                          opinionStatus: "OPINION_CREATED",
                          name:
                            language === "en"
                              ? "Created Opinions"
                              : "मत तयार केले",
                          bg: "#306EFF",
                        },
                        {
                          icon: "Save",
                          count: advocateOpinionSubmitted,
                          opinionStatus: "OPINIONS_SUBMITTED_BY_ALL",
                          name:
                            language === "en"
                              ? "Advocate Opinions Submitted"
                              : "वकिलांचे मत सादर केले",
                          bg: "#01F9C6",
                        },
                        {
                          icon: "Save",
                          count: opinionSubmmited,
                          opinionStatus: "OPINION_SUBMITTED",
                          name:
                            language === "en"
                              ? "Clerk Opinion Submitted"
                              : "लिपिकांचे मत सादर केले",
                          bg: "#FBB917",
                        },
                        {
                          icon: "TaskAlt",
                          count: opinionApproved,
                          opinionStatus: "OPINION_APPROVED",
                          name: language === "en" ? "Approved" : "HOD मंजूर",
                          bg: "#F62217",
                        },
                      ].map((val, id) => {
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <Tooltip title={val.name}>
                            <Grid
                              key={id}
                              item
                              xs={3}
                              style={{ padding: "10px" }}
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
                                    backgroundColor: val.bg,
                                    color: "white",
                                    borderRadius: "7px",
                                  }}
                                  boxShadow={2}
                                >
                                  <ComponentWithIcon iconName={val.icon} />
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
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    onClick={() => {
                                      setSelectedCard(true);
                                      setSelectedCard1(true);

                                      router.push({
                                        pathname:
                                          "/LegalCase/transaction/opinion/",
                                        // query: val,
                                        query: {
                                          ...val,
                                          serviceId: serviceId,
                                        },
                                      });
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.name}
                                  </Link>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Tooltip>
                        );
                      })}
                    </Grid>
                  </Grid>

                  {/* Chart Code */}
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        padding: "10px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        style={{
                          padding: "5px !Important",
                          margin: "5px !Important",
                        }}
                      >
                        {/* Pie-Chart Space */}
                      </Typography>
                      <Grid sx={{ display: "flex", flexDirection: "row" }}>
                        {/* 
                        bar chart */}
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            margin: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                stacked: false,
                                xaxis: {
                                  categories: ["Opinion Details"],
                                },
                              },
                            }}
                            series={[
                              {
                                name: "Opinon Details",
                                data: [
                                  { x: "Opinion Created", y: opinionCreated },
                                  {
                                    x: "Advocate Submitted",
                                    y: advocateOpinionSubmitted,
                                  },
                                  { x: "Clerk Submitted", y: opinionSubmmited },
                                  { x: "HOD Approved", y: opinionApproved },
                                ],
                              },
                            ]}
                            yaxis={[
                              {
                                tickAmount: 1,
                                title: {
                                  text: "Case Details",
                                },
                              },
                            ]}
                            type="bar"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            margin: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                id: "basic-pie",
                              },
                              labels: [
                                "Opinion Created",
                                "Advocate Opinion Submitted",
                                "Clerk Opinion Submitted",
                                "HOD Approved",
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
                              opinionCreated,
                              advocateOpinionSubmitted,
                              opinionSubmmited,
                              opinionApproved,
                            ]}
                            type="pie"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )}

            {/* Case Details */}
            {/* {caseDtlData && ( */}
            {serviceId?.includes(2) && (
              <>
                <Paper
                  sx={{
                    marginTop: "20px",
                    padding: "20px",
                    borderTop: "2px solid  rgb(173, 216, 230)",
                    borderBottom: "2px solid  rgb(173, 216, 230)",
                  }}
                  // variant="outlined" square
                  elevation={3}
                >
                  <Typography
                    style={{
                      padding: "5px !Important",
                      margin: "5px !Important",
                    }}
                  >
                    {/* <h3>Case Details</h3> */}
                    <h3>
                      <FormattedLabel id="caseDetails"></FormattedLabel> :
                      {/* Total Case Entries  */}
                      <FormattedLabel id="totalCaseEntries" />
                      {totalCaseEntry}
                      {/* {setOpinionApproved(e.count)} */}
                    </h3>
                  </Typography>

                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      {[
                        {
                          icon: "FileOpenTwoTone",
                          name:
                            language === "en" ? "CASE INITIATED" : "केस तपशील",
                          count: caseEntryCreated,
                          caseStatusFromDashboard: "CASE CREATED",

                          bg: "#306EFF",
                          // bg: "#FFA500",
                        },
                        // {
                        //   icon: "PlayCircleOutline",
                        //   count: running,
                        //   name:
                        //     language === "en"
                        //       ? "RUNNING CASES"
                        //       : "चालू प्रकरणे",
                        //   caseStatusFromDashboard: "",
                        //   bg: "#01F9C6",
                        // },
                        // {
                        //   icon: "Menu",
                        //   count: intrimOrder,
                        //   name:
                        //     language === "en"
                        //       ? "INTERIM ORDERS"
                        //       : "अंतरिम आदेश",
                        //   bg: "#FBB917",
                        // },
                        // {
                        //   icon: "Done",
                        //   count: finalOrder,
                        //   name:
                        //     language === "en" ? "FINAL ORDERS" : "अंतिम आदेश",
                        //   caseStatusFromDashboard: "",
                        //   bg: "#F62217",
                        // },
                      ].map((val, id) => {
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <Grid
                            item
                            xs={3}
                            sx={{
                              border: "1px solid gray",
                              borderRadius: "10px",
                              display: "flex",
                              flexDirection: "row",
                              padding: "5px !Important",
                              margin: "5px !Important",
                              boxShadow: "2px",
                            }}
                          >
                            <Grid
                              item
                              xs={3}
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: val.bg,
                                color: "white",
                                borderRadius: "7px",
                              }}
                              boxShadow={2}
                            >
                              <ComponentWithIcon iconName={val.icon} />
                              {/* <ComponentWithIcon iconName={val.icon} /> */}
                            </Grid>
                            <Grid
                              item
                              xs={8}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Tooltip disableFocusListener title="View">
                                <Link
                                  style={{
                                    fontWeight: "600",
                                    textDecoration: "none",
                                  }}
                                  onClick={() => {
                                    // alert("dl")
                                    setSelectedCard(true);
                                    setSelectedCard1(true);
                                    router.push({
                                      pathname:
                                        "/LegalCase/transaction/newCourtCaseEntry/",
                                      // query: val,
                                      query: {
                                        ...val,
                                        serviceId: serviceId,
                                      },
                                    });
                                  }}
                                  tabIndex={0}
                                  component="button"
                                >
                                  <Typography
                                    style={{
                                      fontWeight: "500",
                                      // fontSize: "25px",
                                      fontSize: "15px",

                                      color: "#556CD6",
                                    }}
                                  >
                                    {/* {val.count} */}
                                    {val.name}
                                  </Typography>

                                  {/* {val.name} */}
                                  {val.count}
                                </Link>
                              </Tooltip>
                            </Grid>
                            {/* </Grid> */}
                            {/* </Grid> */}
                            {/* </Tooltip> */}
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        padding: "10px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        style={{
                          padding: "5px !Important",
                          margin: "5px !Important",
                        }}
                      >
                        {/* Pie-Chart Space */}
                      </Typography>
                      <Grid sx={{ display: "flex", flexDirection: "row" }}>
                        {/* bar chart */}
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            margin: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                stacked: false,
                                xaxis: {
                                  categories: ["Case Details"],
                                },
                              },
                            }}
                            series={[
                              {
                                name: "Case Details",
                                data: [
                                  { x: "Case Initiated", y: caseEntryCreated },
                                  // { x: "Running Cases", y: running },
                                  // { x: "Interim Orders", y: intrimOrder },
                                  // { x: "Final Orders", y: finalOrder },
                                ],
                              },
                            ]}
                            yaxis={[
                              {
                                tickAmount: 1,
                                title: {
                                  text: "Case Details",
                                },
                              },
                            ]}
                            type="bar"
                            // type="column"

                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            margin: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                id: "basic-pie",
                              },
                              labels: [
                                "Case Initiated",
                                // "Running Cases",
                                // "Interim Orders",
                                // "Final Orders",
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
                              caseEntryCreated,
                              // running,
                              // intrimOrder,
                              // finalOrder,
                            ]}
                            type="pie"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )}

            {/* {noticeData && ( */}
            {serviceId?.includes(3) && (
              <>
                {/* Notice Details */}
                <Paper
                  sx={{
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "2px solid  rgb(173, 216, 230)",
                    borderBottom: "2px solid  rgb(173, 216, 230)",
                  }}
                  // variant="outlined" square
                  elevation={3}
                >
                  <Typography
                    style={{
                      padding: "5px !Important",
                      margin: "5px !Important",
                    }}
                  >
                    {/* <h3>Notice Details</h3> */}
                    <h3>
                      <FormattedLabel id="noticeDetails" /> :
                      {/* Total Notice Created  */}
                      <FormattedLabel id="totalNoticeCreated" />
                      {}
                    </h3>
                  </Typography>

                  {/* New Code */}
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      {[
                        // {
                        //   icon: "SaveAs",
                        //   count: noticeDrafted,
                        //   noticeStatus:"",
                        //   name:
                        //     language === "en"
                        //       ? "Notice Drafted"
                        //       : "तात्पुरत्या रुजू केलेल्या सूचना",
                        //   // bg: "#FFA500",
                        //   bg: "#306EFF",
                        // },
                        {
                          icon: "FileOpenTwoTone",
                          count: noticeCreated,
                          noticeStatus: "NOTICE_CREATED",
                          name:
                            language === "en"
                              ? "Notice Initiated"
                              : "नव्याने निर्माण केलेल्या सूचना",
                          bg: "#01F9C6",
                        },
                        {
                          icon: "Task",
                          count: noticeApproved,
                          noticeStatus: "NOTICE_APPROVED_BY_LEGAL_HOD",
                          name:
                            language === "en"
                              ? "Notice Approved"
                              : "मंजूर झालेल्या सूचना",
                          bg: "#FBB917",
                        },
                        {
                          icon: "FlipCameraAndroid",
                          count: noticeReassigned,
                          noticeStatus: "NOTICE_REASSIGNED_BY_LEGAL_HOD",
                          name:
                            language === "en"
                              ? "Notice Reasigned"
                              : "सूचना नामंजूर",
                          bg: "#F62217",
                        },
                      ].map((val, id) => {
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <Tooltip title={val.name}>
                            <Grid
                              key={id}
                              item
                              xs={3}
                              style={{ padding: "10px" }}
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
                                    backgroundColor: val.bg,
                                    color: "white",
                                    borderRadius: "7px",
                                  }}
                                  boxShadow={2}
                                >
                                  <ComponentWithIcon iconName={val.icon} />
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
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    onClick={() => {
                                      setSelectedCard(true);
                                      setSelectedCard1(true);

                                      router.push({
                                        pathname:
                                          "/LegalCase/transaction/newNotice/",
                                        // query: val,
                                        query: {
                                          ...val,
                                          serviceId: serviceId,
                                        },
                                      });
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.name}
                                  </Link>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Tooltip>
                        );
                      })}
                    </Grid>
                  </Grid>

                  {/* Chart */}
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        padding: "10px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        style={{
                          padding: "5px !Important",
                          margin: "5px !Important",
                        }}
                      >
                        {/* Pie-Chart Space */}
                      </Typography>
                      <Grid sx={{ display: "flex", flexDirection: "row" }}>
                        {/* bar chart */}
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            margin: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                stacked: false,
                                xaxis: {
                                  categories: ["Notice Details"],
                                },
                              },
                            }}
                            series={[
                              {
                                name: "Notice Details",
                                data: [
                                  // { x: "Drafted", y: noticeDrafted },
                                  { x: "Initiated", y: noticeCreated },
                                  { x: "Approved", y: noticeApproved },
                                  { x: "Re-Assigned", y: noticeReassigned },
                                ],
                              },
                            ]}
                            yaxis={[
                              {
                                tickAmount: 1,
                                title: {
                                  text: "Notice Details",
                                },
                              },
                            ]}
                            type="bar"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            margin: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                id: "basic-pie",
                              },
                              labels: [
                                // "Notice Drafted",
                                "Notice Initiated",
                                "Notice Approved",
                                "Notice Re-Assigned",
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
                              // noticeDrafted,
                              noticeCreated,
                              noticeApproved,
                              noticeReassigned,
                            ]}
                            type="pie"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Parawise Details */}
                {/* <Paper
                  sx={{
                    marginTop: "20px",
                    borderTop: "2px solid  rgb(173, 216, 230)",
                    borderBottom: "2px solid  rgb(173, 216, 230)",
                  }}
                  
                  elevation={3}
                >
                  <Typography>
                  
                    <h3>
                      <FormattedLabel id="parawiseReportDetails" />
                    </h3>
                  </Typography>

                  {/* New Code */}

                {/* </Paper>  */}

                {/* Response To Notice Details */}
                {/* <Paper
                  sx={{
                    marginTop: "20px",
                    borderTop: "2px solid  rgb(173, 216, 230)",
                    borderBottom: "2px solid  rgb(173, 216, 230)",
                  }}
                  
                  elevation={3}
                >
                  <Typography>
                    <h3>
                      <FormattedLabel id="responseToNoticeDetails" />
                    </h3>
                  </Typography>

                  
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      {[
                        {
                          icon: "SaveAs",
                          count: responseToNoticeDrafted,
                          name:
                            language === "en"
                              ? "Response To Notice Drafted"
                              : "तात्पुरत्या रुजू केलेल्या सूचना",
                          bg: "#306EFF",
                        },
                        {
                          icon: "FileOpenTwoTone",
                          count: responseToNoticeCreated,
                          name:
                            language === "en"
                              ? "Response To Notice Initiated"
                              : "नव्याने निर्माण केलेल्या सूचना",
                          bg: "#01F9C6",
                        },
                        {
                          icon: "Task",
                          count: responseToNoticeApproved,
                          name:
                            language === "en"
                              ? "Response To Notice Approved"
                              : "मंजूर झालेल्या सूचना",
                          bg: "#FBB917",
                        },
                        {
                          icon: "FlipCameraAndroid",
                          count: responseToNoticeReassigned,
                          name:
                            language === "en"
                              ? "Response To Notice Reasigned"
                              : "सूचना नामंजूर",
                          bg: "#F62217",
                        },
                      ].map((val, id) => {
                        return (
                          
                          <Tooltip title={val.name}>
                            <Grid
                              key={id}
                              item
                              xs={3}
                              style={{ padding: "10px" }}
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
                                    backgroundColor: val.bg,
                                    color: "white",
                                    borderRadius: "7px",
                                  }}
                                  boxShadow={2}
                                >
                                  <ComponentWithIcon iconName={val.icon} />
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
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    onClick={() => {
                                      setSelectedCard(true);
                                      setSelectedCard1(true);

                                      router.push({
                                        pathname:
                                          "/LegalCase/transaction/newNotice/",
                                      });
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.name}
                                  </Link>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Tooltip>
                        );
                      })}
                    </Grid>
                  </Grid>

                  {/* Chart */}
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      padding: "10px",
                      border: "1px solid gray",
                      borderRadius: "5px",
                    }}
                  >
                    <Typography
                      style={{
                        padding: "5px !Important",
                        margin: "5px !Important",
                      }}
                    >
                      {/* Pie-Chart Space */}
                    </Typography>
                    <Grid sx={{ display: "flex", flexDirection: "row" }}>
                      {/* bar chart */}
                      {/* <Grid
                        container
                        item
                        xs={6}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          padding: "5px !Important",
                          margin: "5px !Important",
                          boxShadow: "2px",
                          border: "1px solid gray",
                          borderRadius: "10px",
                        }}
                      >
                        <Chart
                          options={{
                            chart: {
                              stacked: false,
                              xaxis: {
                                categories: ["Response to Notice Details"],
                              },
                            },
                          }}
                          series={[
                            {
                              name: "Response to Notice Details",
                              data: [
                                { x: "Drafted", y: responseToNoticeDrafted },
                                {
                                  x: "Initiated",
                                  y: responseToNoticeCreated,
                                },
                                {
                                  x: "Approved",
                                  y: responseToNoticeApproved,
                                },
                                {
                                  x: "Re-Assigned",
                                  y: responseToNoticeReassigned,
                                },
                              ],
                            },
                          ]}
                          yaxis={[
                            {
                              tickAmount: 1,
                              title: {
                                text: "Response to Notice Details",
                              },
                            },
                          ]}
                          type="bar"
                          width={"500"}
                          height={"300"}
                        />
                      </Grid> */}
                      {/* <Grid
                        container
                        item
                        xs={6}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          padding: "5px !Important",
                          margin: "5px !Important",
                          boxShadow: "2px",
                          border: "1px solid gray",
                          borderRadius: "10px",
                        }}
                      >
                        <Chart
                          options={{
                            chart: {
                              id: "basic-pie",
                            },
                            labels: [
                              "Response to Notice Drafted",
                              "Response to Notice Initiated",
                              "Response to Notice Approved",
                              "Response to Notice Re-Assigned",
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
                            responseToNoticeDrafted,
                            responseToNoticeCreated,
                            responseToNoticeApproved,
                            responseToNoticeReassigned,
                          ]}
                          type="pie"
                          width={"500"}
                          height={"300"}
                        />
                      </Grid> */}
                    </Grid>
                  </Grid>
                </Grid>
                {/* </Paper>  */}
              </>
            )}

            {/* {demandBillData && ( */}
            {serviceId?.includes(79) && (
              <>
                {/* Bill Tracking   */}
                <Paper
                  sx={{
                    marginTop: "20px",
                    padding: "20px",
                    borderTop: "2px solid  rgb(173, 216, 230)",
                    borderBottom: "2px solid  rgb(173, 216, 230)",
                  }}
                  // variant="outlined" square
                  elevation={3}
                >
                  <Typography
                    style={{
                      padding: "5px !Important",
                      margin: "5px !Important",
                    }}
                  >
                    {/* <h3>Bill Tracking</h3> */}
                    <h3>
                      <FormattedLabel id="billTracking"></FormattedLabel> :
                      {/* Total Bills */}
                      <FormattedLabel id="totalBills" />
                      {totalDemandednBill}
                    </h3>
                  </Typography>
                  {/* New Code */}
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", flexDirection: "row" }}
                    >
                      {[
                        {
                          icon: "ReceiptLong",
                          // count: 0,
                          count: billRaised,
                          billStatus: "BILL_RAISED",
                          // count: demandBillData?.find((n) => n.applicationStatus == "BILL_RAISED")?.count,

                          name: language === "en" ? "BILL_RAISED" : "बिल",
                          bg: "#306EFF",
                        },
                        {
                          icon: "Payment",
                          // count: 0,
                          count: billSubmitted,
                          billStatus: "BILL_SUBMITTED",
                          // count: demandBillData?.find((n) => n.applicationStatus == "BILL_SUBMITTED")?.count,

                          name:
                            language === "en"
                              ? "BILL_SUBMITTED"
                              : "कारकून ने मंजूर केले बिल",
                          bg: "#01F9C6",
                        },
                        {
                          icon: "CheckBox",
                          // count: 0,
                          count: billApproved,
                          billStatus: "BILL_APPROVED",
                          // count: demandBillData?.find((n) => n.applicationStatus == "BILL_APPROVED")?.count,
                          name:
                            language === "en"
                              ? "BILL_APPROVED"
                              : "तात्पुरत्या रुजू केलेल्या सूचना",

                          // name: language === "en" ? "Bill Approved by HOD" : "विभाग प्रमुख ने मंजूर केले बिल",
                          bg: "#FBB917",
                        },
                        {
                          icon: "CreditScore",
                          //  count: 0,
                          count: billPaid,
                          billStatus: "BILL_PAID",
                          // count: demandBillData?.find((n) => n.applicationStatus == "BILL_PAID")?.count,
                          name:
                            language === "en"
                              ? "BILL_PAID"
                              : "नव्याने निर्माण केलेल्या सूचना",

                          //  name:
                          //    language === "en" ? "Parawise Report Approved" : "देयक तपशील",
                          bg: "#F62217",
                        },
                      ].map((val, id) => {
                        return (
                          // eslint-disable-next-line react/jsx-key
                          <Tooltip title={val.name}>
                            <Grid
                              key={id}
                              item
                              xs={3}
                              style={{ padding: "10px" }}
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
                                    backgroundColor: val.bg,
                                    color: "white",
                                    borderRadius: "7px",
                                  }}
                                  boxShadow={2}
                                >
                                  <ComponentWithIcon iconName={val.icon} />
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
                                  <Link
                                    style={{ fontWeight: "600" }}
                                    onClick={() => {
                                      setSelectedCard(true);
                                      setSelectedCard1(true);
                                      router.push({
                                        pathname:
                                          "/LegalCase/transaction/demandedBillToAdvocate",
                                        query: {
                                          ...val,
                                          serviceId: serviceId,
                                        },
                                        // pathname: "/LegalCase/transaction/demandedBillToAdvocate/",
                                      });
                                    }}
                                    tabIndex={0}
                                    component="button"
                                  >
                                    {val.name}
                                  </Link>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Tooltip>
                        );
                      })}
                    </Grid>
                  </Grid>

                  {/* Chart */}
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        padding: "10px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
                    >
                      <Typography
                        style={{
                          padding: "5px !Important",
                          margin: "5px !Important",
                        }}
                      >
                        {/* Pie-Chart Space */}
                      </Typography>
                      <Grid sx={{ display: "flex", flexDirection: "row" }}>
                        {/* bar chart */}
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            margin: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                stacked: false,
                                xaxis: {
                                  categories: ["Bill Tracking"],
                                },
                              },
                            }}
                            series={[
                              {
                                name: "Bill Tracking",
                                data: [
                                  { x: "BILL_RAISED", y: billRaised },
                                  { x: "BILL_SUBMITTED", y: billSubmitted },
                                  { x: "BILL_APPROVED", y: billApproved },
                                  { x: "BILL_PAID", y: billPaid },
                                  // { x: "Final Orders", y: finalOrder },
                                ],
                              },
                            ]}
                            yaxis={[
                              {
                                tickAmount: 1,
                                title: {
                                  text: "Bill Tracking",
                                },
                              },
                            ]}
                            type="bar"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                        <Grid
                          container
                          item
                          xs={6}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            padding: "5px !Important",
                            margin: "5px !Important",
                            boxShadow: "2px",
                            border: "1px solid gray",
                            borderRadius: "10px",
                          }}
                        >
                          <Chart
                            options={{
                              chart: {
                                id: "basic-pie",
                              },
                              labels: [
                                "BILL_RAISED",
                                "BILL_SUBMITTED",
                                "BILL_APPROVED",
                                "BILL_PAID",
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
                              billRaised,
                              billSubmitted,
                              billApproved,
                              billPaid,
                            ]}
                            type="pie"
                            width={"500"}
                            height={"300"}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )}
          </Paper>
        </Box>
      </form>
    </>
  );
};

export default Index;
