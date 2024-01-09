import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import swal from "sweetalert";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Loader from "../../../../containers/Layout/components/Loader";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import urls from "../../../../URLS/urls";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { yupResolver } from "@hookform/resolvers/yup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import schema from "../../../../containers/schema/publicAuditorium/transactions/bookedPublicAuditorium";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DoneIcon from "@mui/icons-material/Done";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import ReceiptIcon from "@mui/icons-material/Receipt";
import styles from "../../../../styles/publicAuditorium/transactions/[bookedPublicAuditorium].module.css";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const BookedPublicAuditorium = () => {
  const methods = useForm({
    criteriaMode: "all",
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      levelsOfRolesDaoList: [
        { equipment: "", quantity: "", rate: "", total: "" },
      ],
    },
  });
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "levelsOfRolesDaoList",
      control,
    }
  );

  const [auditoriums, setAuditoriums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [services, setServices] = useState([]);
  const [nextEntryNumber, setNextEntryNumber] = useState();
  const [bookedData, setBookedData] = useState([]);
  const [bookingFor, setBookingFor] = useState("Booking For PCMC");
  const [equipments, setEquipments] = useState([]);

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();

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

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [rateChartData, setRateChartData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer);

  let user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  const appendUI = () => {
    append({
      equipment: "",
      quantity: "",
      rate: "",
      total: "",
    });
  };

  const getRowClassName = (params) => {
    const status = params.getValue(params.id, "status");
    if (status === "CANCELLATION_REQUEST_FORWADED_TO_ACCOUNT") {
      return "active-row";
    } else if (status === "PAYMENT_SUCCESSFUL") {
      return "inactive-row";
    } else {
      return "";
    }
  };

  const applicationHistorycolumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationNumberKey",
      headerName: "Application Number",
      flex: 0.3,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: "Appliction Date",
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "applicationStatus",
      headerName: "Application Status",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
    {
      field: "remark",
      headerName: "Remark",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
  ];

  const [applicationHistoryData, setApplicationHistoryData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [events, setEvents] = useState([]);
  const getEvents = () => {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumEvents/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setEvents(
          r.data.trnAuditoriumEventsList.map((row) => ({
            ...row,
            id: row.id,
            programEventDescription: row.programEventDescription,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 0.7,
      headerAlign: "center",
      minWidth: 120,
    },
    {
      field: "_applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      flex: 0.7,
      headerAlign: "center",
      minWidth: 120,
    },
    {
      field: "applicantName",
      headerName: <FormattedLabel id="applicantName" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "auditoriumId",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 300,
    },
    {
      field: "_organizationName",
      headerName: <FormattedLabel id="organizationName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 250,
    },
    // {
    //   field: "organizationOwnerFirstName",
    //   headerName: <FormattedLabel id="organizationOwnerFirstName" />,
    //   flex: 1,
    //   align: "center",
    //   headerAlign: "center",
    // },
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      minWidth: 120,
    },
    {
      field: "mobile",
      headerName: <FormattedLabel id="mobile" />,
      flex: 0.5,
      headerAlign: "center",
      minWidth: 120,
    },
    // {
    //   field: "organizationName",
    //   headerName: <FormattedLabel id="organizationName" />,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      headerAlign: "center",
      minWidth: 250,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.5,
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {/* <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setBookedData(params.row);
                console.log("params", params.row);
                setIsOpenCollapse(!isOpenCollapse);
                reset(params?.row);
                setValue("eventDay", moment(params?.row?.eventDate).format("dddd"));
                setValue("auditoriumBookingNumber", params?.row?.auditoriumBookingNo);
                setValue("auditoriumId", params?.row?._auditoriumId);
                setValue("serviceId", params?.row?.serviceId);
              }}
            >
              Add Remark
            </Button> */}
            {authority?.includes("APPROVAL_REMARK") &&
              params.row.status === "APPLICATION_SUBMITTED" && (
                <Tooltip title="Clerk Action">
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      overflow: "hidden",
                      fontSize: "10px",
                      whiteSpace: "normal",
                    }}
                    onClick={() => {
                      console.log("6554", params?.row);
                      setBookedData(params.row);
                      let dd = params?.row?.timeSlotList;
                      setIsOpenCollapse(!isOpenCollapse);
                      reset(params?.row);
                      setValue("eventDate", params?.row?.eventDate);
                      setValue(
                        "eventDay",
                        moment(params?.row?.eventDate, "DD/MM/YYYY").format(
                          "dddd"
                        )
                      );
                      setValue(
                        "auditoriumBookingNumber",
                        params?.row?.auditoriumBookingNo
                      );
                      setValue("auditoriumId", params?.row?._auditoriumId);
                      setValue("serviceId", params?.row?.serviceId);

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "B";
                        }
                      );

                      let _history = history.map((val, id) => {
                        return {
                          id: id,
                          srNo: id + 1,
                          applicationNumberKey: val?.applicationNumberKey,
                          applicationDate: moment(val?.applicationDate).format(
                            "DD/MM/YYYY"
                          ),
                          designation: val?.designation
                            ? val?.designation
                            : "-",
                          applicationStatus: val?.applicationStatus,
                          remark: val?.remark,
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let _res = [
                        // {
                        //   id: 1,
                        //   srNo: 1,
                        //   auditoriumName: params?.row?._auditoriumId
                        //     ? auditoriums?.find((obj) => {
                        //         return obj?.id == params?.row?._auditoriumId;
                        //       })?.auditoriumNameEn
                        //     : "-",
                        //   eventName: params?.row?.eventKey
                        //     ? events?.find((obj) => {
                        //         return obj?.id == params?.row?.eventKey;
                        //       })?.eventNameEn
                        //     : "-",
                        //   chargeName: "Deposit Amount",
                        //   price: params?.row?.depositAmount,
                        //   gst: 0,
                        // },
                        {
                          id: 1,
                          srNo: 1,
                          auditoriumName: params?.row?._auditoriumId
                            ? auditoriums?.find((obj) => {
                                return obj?.id == params?.row?._auditoriumId;
                              })?.auditoriumNameEn
                            : "-",
                          eventName: params?.row?.eventKey
                            ? events?.find((obj) => {
                                return obj?.id == params?.row?.eventKey;
                              })?.eventNameEn
                            : "-",
                          cgst: (
                            (params?.row?.rentAmount / 1.18) *
                            0.09
                          ).toFixed(2),
                          sgst: (
                            (params?.row?.rentAmount / 1.18) *
                            0.09
                          ).toFixed(2),
                          total: (params?.row?.rentAmount).toFixed(2),
                          actualPrice:
                            params?.row?.bookingFor ==
                            "Booking For PCMC Employee"
                              ? ((params?.row?.rentAmount / 50) * 100)?.toFixed(
                                  2
                                )
                              : params?.row?.bookingFor ==
                                "Booking For Other Than PCMC"
                              ? ((params?.row?.rentAmount / 30) * 100)?.toFixed(
                                  2
                                )
                              : params?.row?.rentAmount?.toFixed(2),
                          chargeName: "Rent Amount",
                          price: params?.row?.rentAmount,
                          gst: params?.row?.rentAmount * 0.18,
                        },
                      ];
                      setRateChartData({
                        rows: _res,
                        totalRows: 10,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 1,
                        page: 1,
                      });

                      params?.row?.equipmentBookingList?.forEach(
                        (val, index) => {
                          setValue(
                            `levelsOfRolesDaoList[${index}].equipment`,
                            val?.equipmentKey
                          );
                          setValue(
                            `levelsOfRolesDaoList[${index}].quantity`,
                            val?.rate
                          );
                          setValue(
                            `levelsOfRolesDaoList[${index}].rate`,
                            val?.quantity
                          );
                          setValue(
                            `levelsOfRolesDaoList[${index}].total`,
                            val?.total
                          );
                          if (
                            !(
                              index + 1 ===
                              params?.row?.equipmentBookingList.length
                            )
                          ) {
                            appendUI();
                          }
                        }
                      );
                    }}
                  >
                    {/* <DoneIcon /> */}
                    <NotificationsNoneOutlinedIcon style={{ color: "red" }} />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("HOD") &&
              params.row.status === "APPROVE_BY_HOD" && (
                <Tooltip title="LOI Genration">
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      overflow: "hidden",
                      fontSize: "10px",
                      whiteSpace: "normal",
                    }}
                    onClick={() => {
                      console.log("aman", params.row);
                      router.push({
                        pathname:
                          "./bookedPublicAuditorium/LoiGenerationComponent",
                        query: {
                          data: JSON.stringify(params.row),
                        },
                      });
                    }}
                  >
                    <ReceiptIcon />{" "}
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("APPROVAL_REMARK") &&
              params.row.status === "LOI_GENERATED" && (
                <Tooltip title="Pay">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      overflow: "hidden",
                      fontSize: "10px",
                      whiteSpace: "normal",
                    }}
                    onClick={() => {
                      console.log("aman", params.row);
                      router.push({
                        pathname: "./auditoriumBooking/PaymentCollection2",
                        query: {
                          data: JSON.stringify(params.row),
                        },
                      });
                    }}
                  >
                    <CurrencyRupeeIcon />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("HOD") &&
              params.row.status === "APPROVE_BY_CLARK" && (
                <Tooltip title="HOD Action">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      overflow: "hidden",
                      fontSize: "10px",
                      whiteSpace: "normal",
                    }}
                    onClick={() => {
                      setBookedData(params.row);
                      console.log("params", params.row);
                      setIsOpenCollapse(!isOpenCollapse);
                      reset(params?.row);
                      setValue("eventDate", params?.row?.eventDate);
                      setValue(
                        "eventDay",
                        moment(params?.row?.eventDate, "DD/MM/YYYY").format(
                          "dddd"
                        )
                      );
                      setValue(
                        "auditoriumBookingNumber",
                        params?.row?.auditoriumBookingNo
                      );
                      setValue("auditoriumId", params?.row?._auditoriumId);
                      setValue("serviceId", params?.row?.serviceId);

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "B";
                        }
                      );

                      let _history = history.map((val, id) => {
                        return {
                          id: id,
                          srNo: id + 1,
                          applicationNumberKey: val?.applicationNumberKey,
                          applicationDate: moment(val?.applicationDate).format(
                            "DD/MM/YYYY"
                          ),
                          designation: val?.designation
                            ? val?.designation
                            : "-",
                          applicationStatus: val?.applicationStatus,
                          remark: val?.remark,
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let _res = [
                        // {
                        //   id: 1,
                        //   srNo: 1,
                        //   auditoriumName: params?.row?._auditoriumId
                        //     ? auditoriums?.find((obj) => {
                        //         return obj?.id == params?.row?._auditoriumId;
                        //       })?.auditoriumNameEn
                        //     : "-",
                        //   eventName: params?.row?.eventKey
                        //     ? events?.find((obj) => {
                        //         return obj?.id == params?.row?.eventKey;
                        //       })?.eventNameEn
                        //     : "-",
                        //   chargeName: "Deposit Amount",
                        //   price: params?.row?.depositAmount,
                        //   gst: 0,
                        // },
                        {
                          id: 1,
                          srNo: 1,
                          auditoriumName: params?.row?._auditoriumId
                            ? auditoriums?.find((obj) => {
                                return obj?.id == params?.row?._auditoriumId;
                              })?.auditoriumNameEn
                            : "-",
                          eventName: params?.row?.eventKey
                            ? events?.find((obj) => {
                                return obj?.id == params?.row?.eventKey;
                              })?.eventNameEn
                            : "-",
                          cgst: (
                            (params?.row?.rentAmount / 1.18) *
                            0.09
                          ).toFixed(2),
                          sgst: (
                            (params?.row?.rentAmount / 1.18) *
                            0.09
                          ).toFixed(2),
                          total: (params?.row?.rentAmount).toFixed(2),
                          actualPrice:
                            params?.row?.bookingFor ==
                            "Booking For PCMC Employee"
                              ? ((params?.row?.rentAmount / 50) * 100)?.toFixed(
                                  2
                                )
                              : params?.row?.bookingFor ==
                                "Booking For Other Than PCMC"
                              ? ((params?.row?.rentAmount / 30) * 100)?.toFixed(
                                  2
                                )
                              : params?.row?.rentAmount?.toFixed(2),
                          chargeName: "Rent Amount",
                          price: params?.row?.rentAmount,
                        },
                      ];
                      setRateChartData({
                        rows: _res,
                        totalRows: 10,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 1,
                        page: 1,
                      });

                      params?.row?.equipmentBookingList?.forEach(
                        (val, index) => {
                          setValue(
                            `levelsOfRolesDaoList[${index}].equipment`,
                            val?.equipmentKey
                          );
                          setValue(
                            `levelsOfRolesDaoList[${index}].quantity`,
                            val?.rate
                          );
                          setValue(
                            `levelsOfRolesDaoList[${index}].rate`,
                            val?.quantity
                          );
                          setValue(
                            `levelsOfRolesDaoList[${index}].total`,
                            val?.total
                          );
                          if (
                            !(
                              index + 1 ===
                              params?.row?.equipmentBookingList.length
                            )
                          ) {
                            appendUI();
                          }
                        }
                      );
                    }}
                  >
                    {/* <DoneIcon /> */}
                    <NotificationsNoneOutlinedIcon style={{ color: "red" }} />
                  </Button>
                </Tooltip>
              )}
          </>
        );
      },
    },
  ];

  const rateChartColumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "auditoriumName",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 300,
    },
    {
      field: "eventName",
      headerName: <FormattedLabel id="eventName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "chargeName",
      headerName: <FormattedLabel id="chargeName" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actualPrice",
      headerName: <FormattedLabel id="actualPrice" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "price",
      headerName: <FormattedLabel id="price" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "cgst",
      headerName: <FormattedLabel id="cgst" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "sgst",
      headerName: <FormattedLabel id="sgst" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "total",
      headerName: <FormattedLabel id="total" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
  ];

  useEffect(() => {
    getAuditorium();
    getEquipment();
    getServices();
    getEvents();
  }, []);

  useEffect(() => {
    getAuditoriumBooking();
  }, [auditoriums]);

  const getEquipment = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipment/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res equipment", res);
        setEquipments(res?.data?.mstEquipmentList);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditorium = () => {
    axios
      .get(`${urls.PABBMURL}/mstAuditorium/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe 4Au", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            ...row,
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getServices = () => {
    axios
      .get(`${urls.CFCURL}/master/service/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        console.log("respe ser", r);
        setServices(
          r.data.service.map((row, index) => ({
            id: row.id,
            serviceName: row.serviceName,
            serviceNameMr: row.serviceNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditoriumBooking = (_pageSize = 10, _pageNo = 0) => {
    setLoading(true);

    // axios
    // .get(`http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/getAll`, {
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: "dsc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res aud", res?.data);

        setLoading(false);
        let result = res.data.trnAuditoriumBookingOnlineProcessList;
        let _res = result.map((val, i) => {
          return {
            ...val,
            srNo: _pageSize * _pageNo + i + 1,
            id: val.id,
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            toDate: val.toDate ? val.toDate : "-",
            fromDate: val.fromDate ? val.fromDate : "-",
            holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
            status: val?.applicationStatus,
            activeFlag: val.activeFlag,
            auditoriumBookingNo: val.applicationNumber,
            auditoriumId: val.auditoriumId
              ? auditoriums.find((obj) => obj?.id == val.auditoriumId)
                  ?.auditoriumNameEn
              : "Not Available",
            _auditoriumId: val.auditoriumId,
            eventDate: val.eventDate
              ? moment(val?.eventDate).format("DD-MM-YYYY")
              : "-",
            mobile: val.mobile && val.mobile,
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName
              : "-",
            organizationName: val?.organizationName
              ? val.organizationName
              : "-",
            _organizationName:
              val?.bookingFor == "Booking For PCMC Employee"
                ? val?.bookingFor
                : val?.organizationName,
            _applicationDate: val?.applicationDate
              ? moment(val?.applicationDate).format("DD/MM/YYYY")
              : "-",
          };
        });

        console.log("_res", _res);

        setData({
          rows: _res,
          totalRows: res.data.totalElements,
          rowsPerPageOptions: [10, 20, 50, 100],
          pageSize: res.data.pageSize,
          page: res.data.pageNo,
        });
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getAuditoriumBookingDetailsById = (id) => {
    setLoading(true);
    console.log("oid", id);

    axios
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByBookingNo?bookingNo=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        setLoading(true);
        console.log("By id", r, moment(r.data.eventDate).format("dddd"));
        setLoading(false);
        if (r.status === 200) {
          reset(r.data);
          setValue("eventDay", moment(r.data.eventDate).format("dddd"));
          setValue("auditoriumBookingNumber", r.data.auditoriumBookingNo);
          setValue("auditoriumId", r.data.auditoriumId);
          setValue("serviceId", r.data.serviceId);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const onSubmitForm = (formData, event) => {
    const submitButton = event.nativeEvent.submitter;
    const submitAction = submitButton.getAttribute("data-action");
    console.log("formData", formData);

    const finalBodyForApi = {
      ...bookedData,
      auditoriumId: bookedData?._auditoriumId,
      eventDate: moment(bookedData?.eventDate, "DD-MM-YYYY").format(
        `YYYY-MM-DD`
      ),
      // status: formData._status,
      approvalRemarkByClark: formData?.approvalRemarkByClark,
      approvalRemarkByHod: formData?.approvalRemarkByHod,
      remarks: authority?.includes("HOD")
        ? formData?.approvalRemarkByHod
        : formData?.approvalRemarkByClark,
      isApproved:
        submitAction == "save" || submitAction == "approve" ? true : false,
      // serviceId: 113,
      auditoriumBookingDetailsList: JSON.parse(bookedData?.timeSlotList),
      designation: authority?.includes("HOD") ? "HOD" : "Clerk",
      processType: "B",
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/save`,
        finalBodyForApi,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // axios
        //   .post(`http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/save`, finalBodyForApi)
        //   .then((res) => {
        console.log("save data", res);
        if (res.status == 201) {
          formData.id
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          getAuditoriumBooking();
          setIsOpenCollapse(true);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
    });
  };

  const resetValuesCancell = {
    billPrefix: "",
    billType: "",
    fromDate: null,
    toDate: null,
    remark: "",
  };

  const resetValuesExit = {
    fromDate: "",
    toDate: "",
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    setIsOpenCollapse(true);
  };

  return (
    <div>
      <Paper>
        <PabbmHeader labelName="bookedPublicAuditorium" />
        {loading ? (
          <Loader />
        ) : (
          <>
            {!isOpenCollapse && (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitForm)}>
                  <Grid container style={{ padding: "10px" }}>
                    {/* <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={4}
                      xl={4}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        id="standard-basic"
                        label={<FormattedLabel id="auditoriumBookingNumber" />}
                        variant="standard"
                        type="number"
                        sx={{
                          width: "90%",
                          "& .MuiInput-input": {
                            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                              "-webkit-appearance": "none",
                            },
                          },
                        }}
                        {...register("auditoriumBookingNumber")}
                        error={!!errors.auditoriumBookingNumber}
                        helperText={
                          errors?.auditoriumBookingNumber ? errors.auditoriumBookingNumber.message : null
                        }
                      />
                    </Grid> */}
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        error={errors.auditoriumId}
                        variant="standard"
                        sx={{ width: "90%" }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="selectAuditorium" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              disabled
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="selectAuditorium" />}
                            >
                              {auditoriums &&
                                auditoriums.map((auditorium, index) => {
                                  return (
                                    <MenuItem key={index} value={auditorium.id}>
                                      {auditorium.auditoriumNameEn}
                                    </MenuItem>
                                  );
                                })}
                            </Select>
                          )}
                          name="auditoriumId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.auditoriumId
                            ? errors.auditoriumId.message
                            : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={6}
                      xl={6}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <FormControl
                        variant="standard"
                        sx={{ width: "90%" }}
                        error={!!errors.serviceId}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          <FormattedLabel id="selectService" />
                        </InputLabel>
                        <Controller
                          render={({ field }) => (
                            <Select
                              sx={{ minWidth: 220 }}
                              labelId="demo-simple-select-standard-label"
                              id="demo-simple-select-standard"
                              value={field.value}
                              disabled
                              onChange={(value) => field.onChange(value)}
                              label={<FormattedLabel id="selectService" />}
                            >
                              {services &&
                                services.map((service, index) => (
                                  <MenuItem
                                    key={index}
                                    sx={{
                                      display: service.serviceName
                                        ? "flex"
                                        : "none",
                                    }}
                                    value={service.id}
                                  >
                                    {service.serviceName}
                                  </MenuItem>
                                ))}
                            </Select>
                          )}
                          name="serviceId"
                          control={control}
                          defaultValue=""
                        />
                        <FormHelperText>
                          {errors?.serviceId ? errors.serviceId.message : null}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  {/* <Grid container sx={{ padding: "10px" }}>
                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <Controller
                      rules={{ required: true }}
                      control={control}
                      name="cancelBy"
                      render={({ field }) => (
                        <RadioGroup
                          {...field}
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                          }}
                        >
                          <FormControlLabel
                            value="Cancel by Applicant/Vendor"
                            control={<Radio />}
                            label={<FormattedLabel id="cancelByApplicant_Vendor" />}
                          />
                          <FormControlLabel
                            value="Cancel by Department"
                            control={<Radio />}
                            label={<FormattedLabel id="cancelByDepartment" />}
                          />
                        </RadioGroup>
                      )}
                    />
                  </FormControl>
                </Grid> */}
                  {/* <Grid container sx={{ padding: "10px" }}>
                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={!watch("auditoriumBookingNumber")}
                        size="small"
                        onClick={() => {
                          let enteredAuditoriumBookingNo = watch("auditoriumBookingNumber");
                          getAuditoriumBookingDetailsById(enteredAuditoriumBookingNo);
                        }}
                      >
                        <FormattedLabel id="searchByAuditoriumBookingNumber" />
                      </Button>
                    </Grid>
                  </Grid> */}
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
                      <Typography>Booking Auditorium Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="organizationName" />}
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            disabled
                            {...register("organizationName")}
                            error={!!errors.organizationName}
                            helperText={
                              errors?.organizationName
                                ? errors.organizationName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="title" />}
                            variant="standard"
                            disabled
                            {...register("title")}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.title}
                            helperText={
                              errors?.title ? errors.title.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="flat_buildingNo" />}
                            disabled
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                  {
                                    "-webkit-appearance": "none",
                                  },
                              },
                            }}
                            variant="standard"
                            type="number"
                            {...register("flatBuildingNo")}
                            InputLabelProps={{ shrink: true }}
                            error={!!errors.flatBuildingNo}
                            helperText={
                              errors?.flatBuildingNo
                                ? errors.flatBuildingNo.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="organizationOwnerFirstName" />
                            }
                            disabled
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            {...register("organizationOwnerFirstName")}
                            error={!!errors.organizationOwnerFirstName}
                            helperText={
                              errors?.organizationOwnerFirstName
                                ? errors.organizationOwnerFirstName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="organizationOwnerMiddleName" />
                            }
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            disabled
                            {...register("organizationOwnerMiddleName")}
                            error={!!errors.organizationOwnerMiddleName}
                            helperText={
                              errors?.organizationOwnerMiddleName
                                ? errors.organizationOwnerMiddleName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={
                              <FormattedLabel id="organizationOwnerLastName" />
                            }
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            {...register("organizationOwnerLastName")}
                            error={!!errors.organizationOwnerLastName}
                            disabled
                            helperText={
                              errors?.organizationOwnerLastName
                                ? errors.organizationOwnerLastName.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="buildingName" />}
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            {...register("buildingName")}
                            error={!!errors.buildingName}
                            disabled
                            helperText={
                              errors?.buildingName
                                ? errors.buildingName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="roadName" />}
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            disabled
                            {...register("roadName")}
                            error={!!errors.roadName}
                            helperText={
                              errors?.roadName ? errors.roadName.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="landmark" />}
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            disabled
                            {...register("landmark")}
                            error={!!errors.landmark}
                            helperText={
                              errors?.landmark ? errors.landmark.message : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="pinCode" />}
                            variant="standard"
                            disabled
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                  {
                                    "-webkit-appearance": "none",
                                  },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 6);
                            }}
                            {...register("pincode")}
                            error={!!errors.pincode}
                            helperText={
                              errors?.pincode ? errors.pincode.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="aadhaarNo" />}
                            disabled
                            // inputProps={{ maxLength: 12 }}
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 12);
                            }}
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                  {
                                    "-webkit-appearance": "none",
                                  },
                              },
                            }}
                            type="number"
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            {...register("aadhaarNo")}
                            error={!!errors.aadhaarNo}
                            helperText={
                              errors?.aadhaarNo
                                ? errors.aadhaarNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="landline" />}
                            variant="standard"
                            disabled
                            InputLabelProps={{ shrink: true }}
                            type="number"
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 10);
                            }}
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                  {
                                    "-webkit-appearance": "none",
                                  },
                              },
                            }}
                            {...register("landlineNo")}
                            error={!!errors.landlineNo}
                            helperText={
                              errors?.landlineNo
                                ? errors.landlineNo.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label={<FormattedLabel id="mobile" />}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            type="number"
                            sx={{
                              width: "90%",
                              "& .MuiInput-input": {
                                "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                                  {
                                    "-webkit-appearance": "none",
                                  },
                              },
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(
                                0,
                                parseInt(e.target.value)
                              )
                                .toString()
                                .slice(0, 10);
                            }}
                            variant="standard"
                            {...register("mobile")}
                            error={!!errors.mobile}
                            helperText={
                              errors?.mobile ? errors.mobile.message : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            disabled
                            label={<FormattedLabel id="emailAddress" />}
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            {...register("emailAddress")}
                            error={!!errors.emailAddress}
                            helperText={
                              errors?.emailAddress
                                ? errors.emailAddress.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl
                            error={errors.messageDisplay}
                            variant="standard"
                            sx={{ width: "90%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              <FormattedLabel id="messageDisplay" />
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  disabled
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label={<FormattedLabel id="messageDisplay" />}
                                >
                                  {[
                                    { id: 1, auditoriumName: "YES" },
                                    { id: 2, auditoriumName: "NO" },
                                  ].map((auditorium, index) => (
                                    <MenuItem key={index} value={auditorium.id}>
                                      {auditorium.auditoriumName}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                              name="messageDisplay"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.messageDisplay
                                ? errors.messageDisplay.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="eventDetails" />}
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            disabled
                            {...register("eventDetails")}
                            error={!!errors.eventDetails}
                            helperText={
                              errors?.eventDetails
                                ? errors.eventDetails.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                          }}
                        >
                          <TextField
                            disabled={true}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: "90%" }}
                            id="standard-textarea"
                            label="eventDate"
                            multiline
                            variant="standard"
                            {...register("eventDate")}
                            error={!!errors.eventDate}
                            helperText={
                              errors?.eventDate
                                ? errors.eventDate.message
                                : null
                            }
                          />
                          {/* <FormControl sx={{ width: "90%" }} error={errors.eventDate}>
                            <Controller
                              name="eventDate"
                              control={control}
                              defaultValue={null}
                              render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                  <DatePicker
                                    inputFormat="DD/MM/YYYY"
                                    label={
                                      <span style={{ fontSize: 16 }}>
                                        <FormattedLabel id="eventDate" />
                                      </span>
                                    }
                                    value={field.value}
                                    disabled
                                    onChange={(date) => {
                                      field.onChange(date);
                                      // setValue("eventDay", moment(date).format("dddd"));
                                    }}
                                    selected={field.value}
                                    center
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        fullWidth
                                        error={errors.eventDate}
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.eventDate ? errors.eventDate.message : null}
                            </FormHelperText>
                          </FormControl> */}
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="eventDay" />}
                            disabled
                            InputLabelProps={{
                              shrink: true,
                            }}
                            variant="standard"
                            {...register("eventDay")}
                            error={!!errors.eventDay}
                            helperText={
                              errors?.eventDay ? errors.eventDay.message : null
                            }
                          />
                        </Grid>
                      </Grid>

                      {/* <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
                          <Controller
                            name="eventTimeFrom"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  value={field.value}
                                  disabled
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="eventTimeFrom" />
                                    </span>
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" error={!!errors.eventTimeFrom} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.eventTimeFrom ? errors.eventTimeFrom.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }} error={!!errors.eventDate}>
                          <Controller
                            name="eventTimeTo"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TimePicker
                                  value={field.value}
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  disabled
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="eventTimeTo" />
                                    </span>
                                  }
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" error={!!errors.eventTimeTo} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.eventTimeTo ? errors.eventTimeTo.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="depositAmount" />}
                          disabled
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          {...register("depositAmount")}
                          error={!!errors.depositAmount}
                          helperText={errors?.depositAmount ? errors.depositAmount.message : null}
                        />
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="payDepositAmount" />
                        </Typography>
                        <Link href="#">Link</Link>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="rentAmount" />}
                          variant="standard"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                          disabled
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("rentAmount")}
                          error={!!errors.rentAmount}
                          helperText={errors?.rentAmount ? errors.rentAmount.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="payRentAmount" />}
                          variant="standard"
                          type="number"
                          disabled
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("payRentAmount")}
                          error={!!errors.payRentAmount}
                          helperText={errors?.payRentAmount ? errors.payRentAmount.message : null}
                        />
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="depositReceipt" />
                        </Typography>
                        <Link href="#">Print</Link>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="extendedRentAmount" />}
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          disabled
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          onInput={(e) => {
                            e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 10);
                          }}
                          {...register("extendedRentAmount")}
                          error={!!errors.extendedRentAmount}
                          helperText={errors?.extendedRentAmount ? errors.extendedRentAmount.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="rentReceipt" />
                        </Typography>
                        <Link href="#">Print</Link>
                      </Grid>
                    </Grid> */}

                      {/* <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            disabled
                            label={<FormattedLabel id="managersDigitalSignature" />}
                            variant="standard"
                            InputLabelProps={{ shrink: true }}
                            {...register("managersDigitalSignature")}
                            error={!!errors.managersDigitalSignature}
                            helperText={
                              errors?.managersDigitalSignature
                                ? errors.managersDigitalSignature.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            label={<FormattedLabel id="termsAndConditions" />}
                            variant="standard"
                            disabled
                            InputLabelProps={{ shrink: true }}
                            {...register("termsAndCondition")}
                            error={!!errors.termsAndCondition}
                            helperText={errors?.termsAndCondition ? errors.termsAndCondition.message : null}
                          />
                        </Grid>
                      </Grid> */}
                    </AccordionDetails>
                  </Accordion>
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
                      <Typography>Applicant Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{ width: "90%" }}
                            id="standard-basic"
                            disabled
                            InputLabelProps={{ shrink: true }}
                            label="Applicant Name"
                            variant="standard"
                            {...register("applicantName")}
                            error={!!errors.applicantName}
                            helperText={
                              errors?.applicantName
                                ? errors.applicantName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label="Mobile Number"
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            {...register("applicantMobileNo")}
                            error={!!errors.applicantMobileNo}
                            helperText={
                              errors?.applicantMobileNo
                                ? errors.applicantMobileNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label="Confirm Mobile"
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            {...register("applicantConfirmMobileNo")}
                            error={!!errors.applicantConfirmMobileNo}
                            helperText={
                              errors?.applicantConfirmMobileNo
                                ? errors.applicantConfirmMobileNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            id="standard-basic"
                            label="Email Address"
                            variant="standard"
                            {...register("applicantEmail")}
                            error={!!errors.applicantEmail}
                            helperText={
                              errors?.applicantEmail
                                ? errors.applicantEmail.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            id="standard-basic"
                            label="Confirm Email Address"
                            variant="standard"
                            {...register("applicantConfirmEmail")}
                            error={!!errors.applicantConfirmEmail}
                            helperText={
                              errors?.applicantConfirmEmail
                                ? errors.applicantConfirmEmail.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            id="standard-basic"
                            label="Relation With Organization"
                            variant="standard"
                            {...register("relationWithOrganization")}
                            error={!!errors.relationWithOrganization}
                            helperText={
                              errors?.relationWithOrganization
                                ? errors.relationWithOrganization.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            id="standard-basic"
                            label="Flat/Building No."
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                            {...register("applicantFlatHouseNo")}
                            error={!!errors.applicantFlatHouseNo}
                            helperText={
                              errors?.applicantFlatHouseNo
                                ? errors.applicantFlatHouseNo.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            id="standard-basic"
                            label="Building Name"
                            variant="standard"
                            {...register("applicantBuildingName")}
                            error={!!errors.applicantBuildingName}
                            helperText={
                              errors?.applicantBuildingName
                                ? errors.applicantBuildingName.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            id="standard-basic"
                            label="Landmark"
                            variant="standard"
                            {...register("applicantLandmark")}
                            error={!!errors.applicantLandmark}
                            helperText={
                              errors?.applicantLandmark
                                ? errors.applicantLandmark.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            id="standard-basic"
                            label="Area"
                            variant="standard"
                            {...register("applicantArea")}
                            error={!!errors.applicantArea}
                            helperText={
                              errors?.applicantArea
                                ? errors.applicantArea.message
                                : null
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl
                            error={errors.applicantCountry}
                            variant="standard"
                            sx={{ width: "90%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Country
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Select Country"
                                  disabled
                                  InputLabelProps={{ shrink: true }}
                                >
                                  {[
                                    { id: 1, name: "India" },
                                    { id: 2, name: "Other" },
                                  ].map((country, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={country.name}
                                      >
                                        {country.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="applicantCountry"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.applicantCountry
                                ? errors.applicantCountry.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl
                            error={errors.applicantState}
                            variant="standard"
                            sx={{ width: "90%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              Select State
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  label="Select State"
                                  disabled
                                  InputLabelProps={{ shrink: true }}
                                >
                                  {["Maharashtra", "Other"].map(
                                    (state, index) => {
                                      return (
                                        <MenuItem key={index} value={state}>
                                          {state}
                                        </MenuItem>
                                      );
                                    }
                                  )}
                                </Select>
                              )}
                              name="applicantState"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.applicantState
                                ? errors.applicantState.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Grid container sx={{ padding: "10px" }}>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <FormControl
                            error={errors.applicantCity}
                            variant="standard"
                            sx={{ width: "90%" }}
                          >
                            <InputLabel id="demo-simple-select-standard-label">
                              City
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-standard-label"
                                  id="demo-simple-select-standard"
                                  value={field.value}
                                  disabled
                                  InputLabelProps={{ shrink: true }}
                                  onChange={(value) => field.onChange(value)}
                                  label="City"
                                >
                                  {["Pune", "Other"].map((city, index) => {
                                    return (
                                      <MenuItem key={index} value={city}>
                                        {city}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              )}
                              name="applicantCity"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.applicantCity
                                ? errors.applicantCity.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <TextField
                            sx={{
                              width: "90%",
                            }}
                            disabled
                            InputLabelProps={{ shrink: true }}
                            id="standard-basic"
                            label="Pin Code"
                            variant="standard"
                            {...register("applicantPinCode")}
                            error={!!errors.applicantPinCode}
                            helperText={
                              errors?.applicantPinCode
                                ? errors.applicantPinCode.message
                                : null
                            }
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
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
                      <Typography>Booking Charges</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {bookedData?.bookingFor == "Booking For PCMC Employee" ? (
                        ""
                      ) : (
                        <Grid container>
                          <Typography sx={{ fontWeight: 600, color: "green" }}>
                            *{" "}
                            {`₹${(bookedData?.depositAmount).toFixed(2)} ${
                              language == "en"
                                ? "Deposit Paid on"
                                : "देय अनामत भरलेली दिनांक"
                            } ${moment(
                              bookedData?.paymentDao?.depositePayDate
                            ).format("DD/MM/YYYY")} ${
                              language == "en"
                                ? ", Receipt Number is"
                                : "पावती क्रमांक आहे"
                            } ${bookedData?.paymentDao?.pgDepositeKey}`}
                          </Typography>
                        </Grid>
                      )}
                      <Grid container sx={{ padding: "10px" }}>
                        <DataGrid
                          componentsProps={{
                            toolbar: {
                              showQuickFilter: true,
                            },
                          }}
                          components={{ Toolbar: GridToolbar }}
                          sx={{
                            overflowY: "scroll",
                            "& .MuiDataGrid-virtualScrollerContent": {},
                            "& .MuiDataGrid-columnHeadersInner": {
                              backgroundColor: "#556CD6",
                              color: "white",
                            },
                            "& .MuiDataGrid-cell:hover": {
                              color: "primary.main",
                            },
                          }}
                          density="compact"
                          initialState={{
                            aggregation: {
                              model: {
                                price: "sum",
                              },
                            },
                          }}
                          autoHeight={true}
                          pagination
                          paginationMode="server"
                          rowCount={rateChartData.totalRows}
                          rowsPerPageOptions={rateChartData.rowsPerPageOptions}
                          page={rateChartData.page}
                          pageSize={rateChartData.pageSize}
                          rows={rateChartData.rows}
                          columns={rateChartColumns}
                          onPageChange={(_data) => {}}
                          onPageSizeChange={(_data) => {}}
                        />
                      </Grid>
                    </AccordionDetails>
                  </Accordion>

                  {/* <Accordion sx={{ padding: "10px" }}>
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
                      <Typography>Equipments</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container>
                        {fields.map((witness, index) => {
                          return (
                            <>
                              <Grid
                                container
                                key={index}
                                sx={{
                                  backgroundColor: "#E8F6F3",
                                  padding: "5px",
                                }}
                              >
                                <Grid
                                  item
                                  xs={5}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <FormControl
                                    style={{ width: "90%" }}
                                    size="small"
                                  >
                                    <InputLabel id="demo-simple-select-label">
                                      Equipment
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label="Equipment"
                                          value={field.value}
                                          disabled
                                          onChange={(value) => {
                                            field.onChange(value);
                                            // let df = equipmentCharges.find((val) => {
                                            //   return (
                                            //     val.equipmentName == value.target.value && val.totalAmount
                                            //   );
                                            // });
                                            // setValue(`levelsOfRolesDaoList.${index}.rate`, df.totalAmount);
                                          }}
                                          style={{ backgroundColor: "white" }}
                                        >
                                          {equipments.length > 0
                                            ? equipments.map((val, id) => {
                                                return (
                                                  <MenuItem
                                                    key={id}
                                                    value={val.id}
                                                  >
                                                    {language === "en"
                                                      ? val.equipmentNameEn
                                                      : val.equipmentNameMr}
                                                  </MenuItem>
                                                );
                                              })
                                            : "Not Available"}
                                        </Select>
                                      )}
                                      name={`levelsOfRolesDaoList.${index}.equipment`}
                                      control={control}
                                      defaultValue=""
                                      key={witness.id}
                                    />
                                    <FormHelperText style={{ color: "red" }}>
                                      {errors?.departmentName
                                        ? errors.departmentName.message
                                        : null}
                                    </FormHelperText>
                                  </FormControl>
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label="Rate"
                                    disabled
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    variant="outlined"
                                    style={{ backgroundColor: "white" }}
                                    {...register(
                                      `levelsOfRolesDaoList.${index}.rate`
                                    )}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label="Quantity"
                                    variant="outlined"
                                    // key={witness.id}
                                    disabled
                                    style={{ backgroundColor: "white" }}
                                    {...register(
                                      `levelsOfRolesDaoList.${index}.quantity`
                                    )}
                                    key={witness.id}
                                    // name={`levelsOfRolesDaoList[${index}].quantity`}
                                    inputRef={register()}
                                    onChange={(event) => {
                                      const { value } = event.target;
                                      setValue(
                                        `levelsOfRolesDaoList[${index}].total`,
                                        value *
                                          watch(
                                            `levelsOfRolesDaoList.${index}.rate`
                                          )
                                      );
                                    }}
                                    error={
                                      errors?.levelsOfRolesDaoList?.[index]
                                        ?.quantity
                                    }
                                    helperText={
                                      errors?.levelsOfRolesDaoList?.[index]
                                        ?.quantity
                                        ? errors.levelsOfRolesDaoList?.[index]
                                            ?.quantity.message
                                        : null
                                    }
                                  />
                                </Grid>
                                <Grid
                                  item
                                  xs={2}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <TextField
                                    sx={{ width: "90%" }}
                                    size="small"
                                    id="outlined-basic"
                                    label="Total"
                                    disabled
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    variant="outlined"
                                    style={{ backgroundColor: "white" }}
                                    {...register(
                                      `levelsOfRolesDaoList.${index}.total`
                                    )}
                                  />
                                </Grid>
                              </Grid>
                            </>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion> */}

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
                      <Typography>Application History</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <DataGrid
                        componentsProps={{
                          toolbar: {
                            showQuickFilter: true,
                          },
                        }}
                        components={{ Toolbar: GridToolbar }}
                        sx={{
                          overflowY: "scroll",

                          "& .MuiDataGrid-virtualScrollerContent": {},
                          "& .MuiDataGrid-columnHeadersInner": {
                            backgroundColor: "#556CD6",
                            color: "white",
                          },

                          "& .MuiDataGrid-cell:hover": {
                            color: "primary.main",
                          },
                        }}
                        density="compact"
                        autoHeight={true}
                        pagination
                        paginationMode="server"
                        rowCount={applicationHistoryData.totalRows}
                        rowsPerPageOptions={
                          applicationHistoryData.rowsPerPageOptions
                        }
                        page={applicationHistoryData.page}
                        pageSize={applicationHistoryData.pageSize}
                        rows={applicationHistoryData.rows}
                        columns={applicationHistorycolumns}
                        onPageChange={(_data) => {}}
                        onPageSizeChange={(_data) => {}}
                      />
                    </AccordionDetails>
                  </Accordion>

                  {/* <Accordion sx={{ padding: "10px" }}>
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
                    <Typography>Amount Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5">
                        <FormattedLabel id="returnAmountDetails" />
                      </Typography>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="shownAnAmountToBeReturnedAfterBookingCancellation" />
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={6}
                        xl={6}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="amountToBeReturned" />}
                          InputLabelProps={{ shrink: true }}
                          variant="standard"
                          {...register("amountToBeReturned")}
                          error={!!errors.amountToBeReturned}
                          helperText={errors?.amountToBeReturned ? errors.amountToBeReturned.message : null}
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h5">
                        <FormattedLabel id="bookingCancellationDetails" />
                      </Typography>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="budgetingUnit" />}
                          InputLabelProps={{ shrink: true }}
                          variant="standard"
                          {...register("budgetingUnit")}
                          error={!!errors.budgetingUnit}
                          helperText={errors?.budgetingUnit ? errors.budgetingUnit.message : null}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          id="standard-basic"
                          label={<FormattedLabel id="notesheet_ReferenceNumber" />}
                          variant="standard"
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          sx={{
                            width: "90%",
                            "& .MuiInput-input": {
                              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                                "-webkit-appearance": "none",
                              },
                            },
                          }}
                          {...register("notesheet_ReferenceNumber")}
                          error={!!errors.notesheet_ReferenceNumber}
                          helperText={
                            errors?.notesheet_ReferenceNumber
                              ? errors.notesheet_ReferenceNumber.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControl sx={{ width: "90%" }} error={errors.eventDate}>
                          <Controller
                            name="billDate"
                            control={control}
                            defaultValue={null}
                            render={({ field }) => (
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="DD/MM/YYYY"
                                  label={
                                    <span style={{ fontSize: 16 }}>
                                      <FormattedLabel id="billDate" />
                                    </span>
                                  }
                                  value={field.value}
                                  onChange={(date) => {
                                    field.onChange(date);
                                  }}
                                  selected={field.value}
                                  center
                                  renderInput={(params) => (
                                    <TextField {...params} size="small" fullWidth error={errors.billDate} />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>{errors?.billDate ? errors.billDate.message : null}</FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "end",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Controller
                              name="budgetingUnit"
                              control={control}
                              render={({ field: props }) => (
                                <Checkbox
                                  {...props}
                                  checked={props.value}
                                  onChange={(e) => props.onChange(e.target.checked)}
                                />
                              )}
                            />
                          }
                          label={<FormattedLabel id="budgetingUnit" />}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="standard-basic"
                          label={<FormattedLabel id="remark" />}
                          variant="standard"
                          {...register("remarks")}
                          InputLabelProps={{ shrink: true }}
                          error={!!errors.remarks}
                          helperText={errors?.remarks ? errors.remarks.message : null}
                        />
                      </Grid>
                    </Grid>

                    <Grid container style={{ padding: "10px" }}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          type="submit"
                          variant="contained"
                          color="success"
                          endIcon={<SaveIcon />}
                        >
                          {btnSaveText}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          endIcon={<ClearIcon />}
                          onClick={() => cancellButton()}
                        >
                          <FormattedLabel id="clear" />
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        lg={4}
                        xl={4}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion> */}
                  {authority?.includes("APPROVAL_REMARK") ? (
                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <TextField
                        sx={{ width: "100%" }}
                        id="outlined-basic"
                        InputLabelProps={{ shrink: true }}
                        label="Approval Clerk Remark"
                        size="small"
                        variant="outlined"
                        {...register("approvalRemarkByClark")}
                        error={!!errors.approvalRemarkByClark}
                        helperText={
                          errors?.approvalRemarkByClark
                            ? errors.approvalRemarkByClark.message
                            : null
                        }
                      />
                    </Grid>
                  ) : (
                    <>
                      <Grid
                        container
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "100%" }}
                          id="outlined-basic"
                          InputLabelProps={{ shrink: true }}
                          label="Approval Clerk Remark"
                          size="small"
                          disabled
                          variant="outlined"
                          {...register("approvalRemarkByClark")}
                          error={!!errors.approvalRemarkByClark}
                          helperText={
                            errors?.approvalRemarkByClark
                              ? errors.approvalRemarkByClark.message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        container
                        sx={{
                          padding: "10px",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "100%" }}
                          id="outlined-basic"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          label="Approval HOD Remark"
                          variant="outlined"
                          {...register("approvalRemarkByHod")}
                          error={!!errors.approvalRemarkByHod}
                          helperText={
                            errors?.approvalRemarkByHod
                              ? errors.approvalRemarkByHod.message
                              : null
                          }
                        />
                      </Grid>
                    </>
                  )}

                  <Grid container sx={{ padding: "10px" }}>
                    {authority?.includes("HOD") && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            data-action="approve"
                            endIcon={<DoneAllIcon />}
                            type="submit"
                          >
                            Approve
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            data-action="reject"
                            type="submit"
                            endIcon={<ThumbDownIcon />}
                          >
                            Reject
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Grid container style={{ padding: "10px" }}>
                    {!authority?.includes("HOD") && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            type="submit"
                            variant="contained"
                            color="success"
                            data-action="save"
                            endIcon={<SaveIcon />}
                          >
                            {btnSaveText}
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            endIcon={<ClearIcon />}
                            onClick={() => cancellButton()}
                          >
                            <FormattedLabel id="clear" />
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={6}
                          lg={4}
                          xl={4}
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            endIcon={<ExitToAppIcon />}
                            onClick={() => exitButton()}
                          >
                            <FormattedLabel id="exit" />
                          </Button>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Divider />
                </form>
              </FormProvider>
            )}
            {isOpenCollapse && (
              <>
                <Box style={{ height: "auto", overflow: "auto" }}>
                  <DataGrid
                    sx={{
                      overflowY: "scroll",
                      "& .MuiDataGrid-virtualScrollerContent": {},
                      "& .MuiDataGrid-columnHeadersInner": {
                        backgroundColor: "#556CD6",
                        color: "white",
                      },

                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                    }}
                    components={{ Toolbar: GridToolbar }}
                    componentsProps={{
                      toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                      },
                    }}
                    density="compact"
                    autoHeight={true}
                    pagination
                    paginationMode="server"
                    rowCount={data.totalRows}
                    rowsPerPageOptions={data.rowsPerPageOptions}
                    page={data.page}
                    pageSize={data.pageSize}
                    rows={data.rows}
                    columns={columns}
                    onPageChange={(_data) => {
                      getAuditoriumBooking(data.pageSize, _data);
                    }}
                    onPageSizeChange={(_data) => {
                      getAuditoriumBooking(_data, data.page);
                    }}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Paper>
    </div>
  );
};

export default BookedPublicAuditorium;
