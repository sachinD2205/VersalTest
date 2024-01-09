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
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useSelector } from "react-redux";
import styles from "../../../styles/publicAuditorium/newDashboard/[newDashboard].module.css";
import urls from "../../../URLS/urls";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ClearIcon from "@mui/icons-material/Clear";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "../../../containers/schema/publicAuditorium/transactions/newDashboard";
import Loader from "../../../containers/Layout/components/Loader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { addNumbers } from "../../../components/publicAuditorium/DataGridHideUnhide";
import { catchExceptionHandlingMethod } from "../../../util/util";

const Index = () => {
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

  const user = useSelector((state) => state?.user.user);
  const token = useSelector((state) => state.user.user.token);
  const language = useSelector((state) => state?.labels.language);
  const [loading, setLoading] = useState(false);
  const [auditoriums, setAuditoriums] = useState([]);
  const router = useRouter();
  const selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );
  const authority = user?.roles;
  const [bookedData, setBookedData] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [applicationHistoryData, setApplicationHistoryData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [departments, setDepartments] = useState([]);

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

  console.log("authority", authority);

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

  const getDepartments = () => {
    axios
      .get(`${urls.CFCURL}/master/department/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setDepartments(
          r?.data?.department?.map((row, index) => ({
            ...row,
            id: row.id,
            department: row.department,
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

  const [rateChartData, setRateChartData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    getAuditorium();
    getEquipment();
    getServices();
    getEvents();
    getDepartments();
  }, []);

  useEffect(() => {
    getAuditoriumBooking();
  }, [auditoriums]);

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
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
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
    ,
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
      headerAlign: "center",
      align: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {authority?.includes("ROLE_CLERK") &&
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
                      console.log("6554", params?.row, authority);

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
                      setValue(
                        "applicantBuildingName",
                        params?.row?.applicantFlatBuildingName
                      );

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
                          actionBy: val?.actionBy,
                          eventTitle: val?.eventTitle,
                          timeSlotList: val?.timeSlotList,
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
                          id: 2,
                          srNo: 1,
                          // auditoriumName: params?.row?._auditoriumId
                          //   ? auditoriums?.find((obj) => {
                          //       return obj?.id == params?.row?._auditoriumId;
                          //     })?.auditoriumNameEn
                          //   : "-",
                          auditoriumName: params?.row?.auditoriumId
                            ? params?.row?.auditoriumId
                            : "-",
                          eventName: params?.row?.eventTitle,
                          // eventName: params?.row?.eventKey
                          //   ? events?.find((obj) => {
                          //       return obj?.id == params?.row?.eventKey;
                          //     })?.eventNameEn
                          //   : "-",
                          chargeName: "Rent Amount",
                          price: (params?.row?.rentAmount / 1.18)?.toFixed(2),
                          cgst: (
                            (params?.row?.rentAmount / 1.18)?.toFixed(2) * 0.09
                          ).toFixed(2),
                          sgst: (
                            (params?.row?.rentAmount / 1.18)?.toFixed(2) * 0.09
                          ).toFixed(2),
                          total: params?.row?.rentAmount?.toFixed(2),
                          actualPrice: (
                            params?.row?.rentAmountWithoutGst * 1.18
                          )?.toFixed(2),
                        },
                        // {
                        //   id: 3,
                        //   srNo: 3,
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
                        //   chargeName: "Board Charges",
                        //   price: params?.row?.boardChargesAmount,
                        //   gst: params?.row?.boardChargesAmount * 0.18,
                        // },
                        // {
                        //   id: 4,
                        //   srNo: 4,
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
                        //   chargeName: "Security Guard Charges",
                        //   price: params?.row?.securityGuardChargeAmount,
                        //   gst: params?.row?.securityGuardChargeAmount * 0.18,
                        // },
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

                      // const levelsOfRolesDaoList =
                      //   params.row.equipmentBookingList.map((val,index) => {
                      //     return {
                      //       equipment: val.equipmentKey,
                      //       rate: val.rate,
                      //       quantity: val.quantity,
                      //       total: val.total,
                      //     };
                      //   });

                      // setValue("levelsOfRolesDaoList", levelsOfRolesDaoList);
                      // appendUI();
                    }}
                  >
                    <NotificationsNoneOutlinedIcon style={{ color: "red" }} />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("ROLE_HOD") &&
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
                          "./transaction/bookedPublicAuditorium/LoiGenerationComponent",
                        // "./bookedPublicAuditorium/LoiGenerationComponent",
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
            {authority?.includes("ROLE_APPROVAL_REMARK") &&
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
            {authority?.includes("ROLE_HOD") &&
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
                      setValue(
                        "applicantBuildingName",
                        params?.row?.applicantFlatBuildingName
                      );

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
                          actionBy: val?.actionBy,
                          eventTitle: val?.eventTitle,
                          timeSlotList: val?.timeSlotList,
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
                          id: 2,
                          srNo: 1,
                          // auditoriumName: params?.row?._auditoriumId
                          //   ? auditoriums?.find((obj) => {
                          //       return obj?.id == params?.row?._auditoriumId;
                          //     })?.auditoriumNameEn
                          //   : "-",
                          auditoriumName: params?.row?.auditoriumId
                            ? params?.row?.auditoriumId
                            : "-",
                          eventName: params?.row?.eventTitle,
                          // eventName: params?.row?.eventKey
                          //   ? events?.find((obj) => {
                          //       return obj?.id == params?.row?.eventKey;
                          //     })?.eventNameEn
                          //   : "-",
                          chargeName: "Rent Amount",
                          price: (params?.row?.rentAmount / 1.18).toFixed(2),
                          cgst: (
                            (params?.row?.rentAmount / 1.18).toFixed(2) * 0.09
                          ).toFixed(2),
                          sgst: (
                            (params?.row?.rentAmount / 1.18).toFixed(2) * 0.09
                          ).toFixed(2),
                          total: (params?.row?.rentAmount).toFixed(2),
                          actualPrice: (
                            params?.row?.rentAmountWithoutGst * 1.18
                          ).toFixed(2),
                        },
                        // {
                        //   id: 3,
                        //   srNo: 3,
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
                        //   chargeName: "Board Charges",
                        //   price: params?.row?.boardChargesAmount,
                        //   gst: params?.row?.boardChargesAmount * 0.18,
                        // },
                        // {
                        //   id: 4,
                        //   srNo: 4,
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
                        //   chargeName: "Security Guard Charges",
                        //   price: params?.row?.securityGuardChargeAmount,
                        //   gst: params?.row?.securityGuardChargeAmount * 0.18,
                        // },
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
                    <NotificationsNoneOutlinedIcon style={{ color: "red" }} />
                  </Button>
                </Tooltip>
              )}
          </>
        );
      },
    },
  ];

  const [colsState, setColsState] = useState(columns);
  const [mno, setMno] = useState();

  // useEffect(() => {
  //   let HiddenCols = localStorage.getItem("HiddenCols");
  //   let mnopq = JSON.parse(HiddenCols);
  //   console.log("HiddenCols", mnopq);
  //   setMno(mnopq);
  // }, []);

  // useEffect(() => {
  //   if (mno) {
  //     setColsState((prev) =>
  //       prev.map((val) => {
  //         return {
  //           ...val,
  //           hide: !mno[val?.field],
  //         };
  //       })
  //     );
  //   }
  // }, [mno]);

  useEffect(() => {
    addNumbers("get", "HiddenCols", setColsState);
  }, []);

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
      headerName: <FormattedLabel id="discountedPrice" />,
      flex: 1,
      align: "center",
      headerAlign: "center",
      minWidth: 150,
    },
  ];

  const applicationHistorycolumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actionBy",
      headerName: "Name",
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="designation" />,
      flex: 0.3,
      headerAlign: "center",
    },
    {
      field: "applicationNumberKey",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      flex: 0.3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventTitle",
      headerName: <FormattedLabel id="eventTitle" />,
      flex: 0.3,
      align: "center",
      headerAlign: "center",
    },

    // {
    //   field: "applicationStatus",
    //   headerName: <FormattedLabel id="status" />,
    //   flex: 0.6,
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <Tooltip title={params.value}>
    //       <span className="csutable-cell-trucate">{params.value}</span>
    //     </Tooltip>
    //   ),
    // },
    {
      field: "remark",
      headerName: <FormattedLabel id="remark" />,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
  ];

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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

  const getAuditoriumBooking = (
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortBy: _sortBy,
          sortDir: _sortDir,
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

        console.log("result", result);

        // let ffg = [...result];
        // let nn = [];
        // ffg.forEach((item) => {
        //   let oo = [].concat(...JSON.parse(item.timeSlotList));
        //   oo.forEach((obj) => {
        //     obj.applicationStatus = item.applicationStatus;
        //     obj.applicantName = item.applicantName;
        //   });
        //   delete item.key2;
        //   nn.push(oo);
        // });

        // const mergedArray = [].concat(...nn);

        // setMeetings(
        //   mergedArray?.map((val) => {
        //     return {
        //       start: moment(val.bookingDate).format("YYYY/MM/DD"),
        //       end: moment(val.bookingDate).format("YYYY/MM/DD"),
        //       title: `${val.fromTime} To ${val.toTime}`,
        //       applicationStatus: val?.applicationStatus,
        //       applicantName: val?.applicantName,
        //     };
        //   })
        // );

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

  const handleSelectEvent = (event) => {
    console.log("event", event);
    // setSelectedEvent(event);
    // event?.title && setIsModalOpen(true);
  };

  const appendUI = () => {
    append({
      equipment: "",
      quantity: "",
      rate: "",
      total: "",
    });
  };

  const onSubmitForm = (formData, event) => {
    sweetAlert({
      title: language == "en" ? "Auditorium Booking" : "प्रेक्षागृह बुकिंग",
      text: language == "en" ? "Are you sure?" : "तुम्हाला खात्री आहे?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: [
        language == "en" ? "No" : "नाही",
        language == "en" ? "Yes" : "हो",
      ],
    }).then((will) => {
      if (will) {
        const submitButton = event.nativeEvent.submitter;
        const submitAction = submitButton.getAttribute("data-action");
        console.log("formData", formData);

        const finalBodyForApi = {
          ...bookedData,
          auditoriumId: bookedData?._auditoriumId,
          eventDate: moment(bookedData?.eventDate, "DD-MM-YYYY").format(
            `YYYY-MM-DD`
          ),
          approvalRemarkByClark: formData?.approvalRemarkByClark,
          approvalRemarkByHod: formData?.approvalRemarkByHod,
          actionBy:
            user?.userDao?.firstNameEn + " " + user?.userDao?.lastNameEn,
          remarks: authority?.includes("ROLE_HOD")
            ? formData?.approvalRemarkByHod
            : formData?.approvalRemarkByClark,
          isApproved:
            submitAction == "save" || submitAction == "approve" ? true : false,
          auditoriumBookingDetailsList: JSON.parse(bookedData?.timeSlotList),
          designation: authority?.includes("ROLE_HOD")
            ? "ROLE_HOD"
            : "ROLE_CLERK",
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
            console.log("save data", res);
            if (res.status == 201) {
              formData.id
                ? sweetAlert(
                    language == "en" ? "Updated!" : "अपडेट केले",
                    language == "en"
                      ? "Record Updated successfully !"
                      : "रेकॉर्ड यशस्वीरित्या अपडेट केले!",
                    "success"
                  )
                : sweetAlert(
                    language == "en" ? "Saved!" : "जतन केले",
                    language == "en"
                      ? "Record Saved successfully !"
                      : "रेकॉर्ड यशस्वीरित्या जतन केले",
                    "success"
                  );
              getAuditoriumBooking();
              setIsOpenCollapse(true);
              if (res?.data?.applicationStatus === "APPROVE_BY_HOD") {
                sweetAlert({
                  title:
                    language == "en"
                      ? "Auditorium Booking"
                      : "प्रेक्षागृह बुकिंग",
                  text:
                    language == "en"
                      ? "Do you want to gerenate LOI?"
                      : "तुम्हाला एलओआय तयार करायचे आहे का?",
                  dangerMode: false,
                  closeOnClickOutside: false,
                  buttons: [
                    language == "en" ? "No" : "नाही",
                    language == "en" ? "Yes" : "हो",
                  ],
                }).then((will) => {
                  if (will) {
                    router.push({
                      pathname:
                        "./transaction/bookedPublicAuditorium/LoiGenerationComponent",
                      query: {
                        data: JSON.stringify(res?.data),
                      },
                    });
                  } else {
                    router.push("./newDashboard");
                  }
                });
              } else {
                router.push("./newDashboard");
              }
            }
          })
          ?.catch((err) => {
            console.log("err", err);
            setLoading(false);
            callCatchMethod(err, language);
          });
      } else {
        router.push("./newDashboard");
      }
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

  const getRowClassName = (params) => {
    const row = params.row;

    console.log("row2", row);

    // Define your condition here

    if (row.status == "PAYMENT_SUCCESSFUL") {
      return styles.rowGreen;
    } else if (row.status == "LOI_GENERATED") {
      return styles.rowYellow;
    } else if (row.status == "APPLICATION_SUBMITTED") {
      return styles.rowGray;
    } else if (row.status == "APPROVE_BY_CLARK") {
      return styles.rowPink;
    } else if (row.status == "APPROVE_BY_HOD") {
      return styles.rowOrange;
    } else {
      return styles.rowIvory;
    }

    return "";
  };

  return (
    <div>
      <Paper component={Box} squar="true" elevation={5}>
        <Grid container>
          <Paper
            component={Box}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              border: "1px solid #556CD6",
              padding: "5px",
            }}
            squar="true"
            elevation={5}
          >
            <Typography
              style={{ justifyContent: "center" }}
              variant="h5"
              sx={{ color: "blue" }}
            >
              <b>
                {language == "en"
                  ? "Public Auditorium Booking And Broadcast Management Dashboard"
                  : "सार्वजनिक प्रेक्षागृह / नाट्यगृह बुकिंग आणि प्रसारण व्यवस्थापन डॅशबोर्ड"}
              </b>
            </Typography>
          </Paper>
        </Grid>
        <Grid container sx={{ paddingX: "10px" }}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {!isOpenCollapse && (
                <FormProvider {...methods}>
                  <form
                    onSubmit={handleSubmit(onSubmitForm)}
                    style={{ width: "100%" }}
                  >
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
                          {<FormattedLabel id="applicationHistory" />}
                        </Typography>
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
                    <Grid container style={{ padding: "10px" }}>
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
                          variant="outlined"
                          sx={{ width: "90%" }}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="selectAuditorium" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={field.value}
                                disabled
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="selectAuditorium" />}
                              >
                                {auditoriums &&
                                  auditoriums.map((auditorium, index) => {
                                    return (
                                      <MenuItem
                                        key={index}
                                        value={auditorium.id}
                                      >
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
                          variant="outlined"
                          sx={{ width: "90%" }}
                          error={!!errors.serviceId}
                          size="small"
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="selectService" />
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                sx={{ minWidth: 220 }}
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
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
                            {errors?.serviceId
                              ? errors.serviceId.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
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
                          <FormattedLabel id="bookingAuditoriumDetails" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container sx={{ padding: "10px" }}>
                          {bookedData?.employeeDepartment ? (
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
                                error={errors.departmentName}
                                variant="outlined"
                                size="small"
                                sx={{ width: "90%" }}
                              >
                                <InputLabel id="demo-simple-select-outlined-label">
                                  <FormattedLabel id="departmentName" />
                                </InputLabel>
                                <Controller
                                  render={({ field }) => (
                                    <Select
                                      labelId="demo-simple-select-outlined-label"
                                      id="demo-simple-select-outlined"
                                      value={field.value}
                                      onChange={(value) =>
                                        field.onChange(value)
                                      }
                                      disabled
                                      label={
                                        <FormattedLabel id="departmentName" />
                                      }
                                    >
                                      {departments?.map((department, index) => {
                                        return (
                                          <MenuItem
                                            key={index}
                                            value={department.id}
                                          >
                                            {department.department}
                                          </MenuItem>
                                        );
                                      })}
                                    </Select>
                                  )}
                                  name="employeeDepartment"
                                  control={control}
                                  defaultValue=""
                                />
                                <FormHelperText>
                                  {errors?.departmentName
                                    ? errors.departmentName.message
                                    : null}
                                </FormHelperText>
                              </FormControl>
                            </Grid>
                          ) : (
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
                                id="outlined-basic"
                                label={<FormattedLabel id="organizationName" />}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                disabled
                                size="small"
                                {...register("organizationName")}
                                error={!!errors.organizationName}
                                helperText={
                                  errors?.organizationName
                                    ? errors.organizationName.message
                                    : null
                                }
                              />
                            </Grid>
                          )}
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
                              id="outlined-basic"
                              label={<FormattedLabel id="eventTitle" />}
                              variant="outlined"
                              disabled
                              size="small"
                              {...register("eventTitle")}
                              InputLabelProps={{ shrink: true }}
                              error={!!errors.eventTitle}
                              helperText={
                                errors?.eventTitle
                                  ? errors.eventTitle.message
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
                              id="outlined-basic"
                              label={<FormattedLabel id="flat_buildingNo" />}
                              disabled
                              sx={{
                                width: "90%",
                              }}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="organizationOwnerFirstName" />
                              }
                              disabled
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="organizationOwnerMiddleName" />
                              }
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              disabled
                              size="small"
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
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="organizationOwnerLastName" />
                              }
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={<FormattedLabel id="buildingName" />}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={<FormattedLabel id="roadName" />}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
                              disabled
                              {...register("roadName")}
                              error={!!errors.roadName}
                              helperText={
                                errors?.roadName
                                  ? errors.roadName.message
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
                              id="outlined-basic"
                              label={<FormattedLabel id="landmark" />}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
                              disabled
                              {...register("landmark")}
                              error={!!errors.landmark}
                              helperText={
                                errors?.landmark
                                  ? errors.landmark.message
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
                              id="outlined-basic"
                              label={<FormattedLabel id="pinCode" />}
                              variant="outlined"
                              size="small"
                              disabled
                              InputLabelProps={{ shrink: true }}
                              sx={{
                                width: "90%",
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
                              id="outlined-basic"
                              label={<FormattedLabel id="aadhaarNo" />}
                              disabled
                              // inputProps={{ maxLength: 12 }}
                              size="small"
                              sx={{
                                width: "90%",
                              }}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
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
                              id="outlined-basic"
                              label={<FormattedLabel id="landline" />}
                              variant="outlined"
                              disabled
                              size="small"
                              InputLabelProps={{ shrink: true }}
                              sx={{
                                width: "90%",
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
                              id="outlined-basic"
                              label={<FormattedLabel id="mobile" />}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              size="small"
                              sx={{
                                width: "90%",
                              }}
                              variant="outlined"
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
                              id="outlined-basic"
                              disabled
                              label={<FormattedLabel id="emailAddress" />}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
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
                            <TextField
                              sx={{ width: "90%" }}
                              id="outlined-basic"
                              label={<FormattedLabel id="eventDetails" />}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              disabled
                              size="small"
                              {...register("eventDetails")}
                              error={!!errors.eventDetails}
                              helperText={
                                errors?.eventDetails
                                  ? errors.eventDetails.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid container>
                          {bookedData?.timeSlotList &&
                          JSON.parse(bookedData?.timeSlotList).length > 0
                            ? JSON.parse(bookedData?.timeSlotList)?.map(
                                (val, index) => {
                                  return (
                                    <Grid
                                      container
                                      sx={{ padding: "10px" }}
                                      key={index}
                                    >
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
                                        <FormControl
                                          sx={{ width: "90%" }}
                                          error={errors.eventDate}
                                        >
                                          <Controller
                                            name="eventDate"
                                            control={control}
                                            defaultValue={val.date}
                                            render={({ field }) => (
                                              <LocalizationProvider
                                                dateAdapter={AdapterMoment}
                                              >
                                                <DatePicker
                                                  disablePast
                                                  inputFormat="DD/MM/YYYY"
                                                  disabled
                                                  label={
                                                    <span
                                                      style={{ fontSize: 16 }}
                                                    >
                                                      <FormattedLabel id="eventDate" />
                                                      {/* Event Date From */}
                                                    </span>
                                                  }
                                                  value={val.bookingDate}
                                                  onChange={(date) => {
                                                    field.onChange(date);
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
                                            {errors?.eventDate
                                              ? errors.eventDate.message
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
                                          sx={{ width: "90%" }}
                                          id="outlined-basic"
                                          size="small"
                                          label={
                                            <FormattedLabel id="eventHours" />
                                          }
                                          disabled
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          value={
                                            val.fromTime + " To " + val.toTime
                                          }
                                          variant="outlined"
                                          {...register("EventHours")}
                                          error={!!errors.EventHours}
                                          helperText={
                                            errors?.EventHours
                                              ? errors.EventHours.message
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
                                          id="outlined-basic"
                                          size="small"
                                          label={
                                            <FormattedLabel id="eventDay" />
                                          }
                                          disabled
                                          InputLabelProps={{
                                            shrink: true,
                                          }}
                                          value={moment(val.bookingDate).format(
                                            "dddd"
                                          )}
                                          variant="outlined"
                                          {...register("eventDay")}
                                          error={!!errors.eventDay}
                                          helperText={
                                            errors?.eventDay
                                              ? errors.eventDay.message
                                              : null
                                          }
                                        />
                                      </Grid>
                                    </Grid>
                                  );
                                }
                              )
                            : null}
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
                        <Typography>
                          <FormattedLabel id="applicantDetails" />
                        </Typography>
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
                              id="outlined-basic"
                              disabled
                              InputLabelProps={{ shrink: true }}
                              label={<FormattedLabel id="applicantName" />}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={<FormattedLabel id="applicantMobileNo" />}
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="applicantConfirmMobileNo" />
                              }
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              size="small"
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              {...register("applicantConfirmMobileNo")}
                              error={!!errors.applicantConfirmMobileNo}
                              helperText={
                                errors?.applicantConfirmMobileNo
                                  ? errors.applicantConfirmMobileNo.message
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
                              id="outlined-basic"
                              label={<FormattedLabel id="applicantEmail" />}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="applicantConfirmEmail" />
                              }
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="relationWithOrganization" />
                              }
                              variant="outlined"
                              size="small"
                              {...register("relationWithOrganization")}
                              error={!!errors.relationWithOrganization}
                              helperText={
                                errors?.relationWithOrganization
                                  ? errors.relationWithOrganization.message
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
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="applicantFlatHouseNo" />
                              }
                              sx={{
                                width: "90%",
                              }}
                              disabled
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="applicantFlatBuildingName" />
                              }
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={<FormattedLabel id="applicantLandmark" />}
                              variant="outlined"
                              size="small"
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
                              id="outlined-basic"
                              label={<FormattedLabel id="applicantArea" />}
                              variant="outlined"
                              size="small"
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
                              variant="outlined"
                              sx={{ width: "90%" }}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-outlined-label">
                                {<FormattedLabel id="country" />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={<FormattedLabel id="country" />}
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
                              variant="outlined"
                              sx={{ width: "90%" }}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-outlined-label">
                                <FormattedLabel id="applicantState" />
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="applicantState" />
                                    }
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
                              variant="outlined"
                              sx={{ width: "90%" }}
                              size="small"
                            >
                              <InputLabel id="demo-simple-select-outlined-label">
                                {<FormattedLabel id="applicantCity" />}
                              </InputLabel>
                              <Controller
                                render={({ field }) => (
                                  <Select
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={field.value}
                                    disabled
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="applicantCity" />
                                    }
                                  >
                                    {["Pune", "Pimpri Chinchwad", "Other"].map(
                                      (city, index) => {
                                        return (
                                          <MenuItem key={index} value={city}>
                                            {city}
                                          </MenuItem>
                                        );
                                      }
                                    )}
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
                              id="outlined-basic"
                              size="small"
                              label={<FormattedLabel id="applicantPinCode" />}
                              variant="outlined"
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
                        <Typography>
                          <FormattedLabel id="bookingCharges" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {bookedData?.bookingFor ==
                        "Booking For PCMC Employee" ? (
                          ""
                        ) : (
                          <Grid container>
                            <Typography
                              sx={{ fontWeight: 600, color: "green" }}
                            >
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

                        <Grid
                          container
                          sx={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
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
                            rowsPerPageOptions={
                              rateChartData.rowsPerPageOptions
                            }
                            page={rateChartData.page}
                            pageSize={rateChartData.pageSize}
                            rows={rateChartData.rows}
                            columns={rateChartColumns}
                            onPageChange={(_data) => {}}
                            onPageSizeChange={(_data) => {}}
                          />
                          <Box
                            sx={{
                              paddingY: "10px",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography sx={{ fontWeight: "600" }}>{`${
                              language == "en"
                                ? "Grand Total - ₹ "
                                : "एकूण - ₹ "
                            }${(bookedData?.rentAmount).toFixed(
                              2
                            )} (18% GST (9% CGST +
                                            9% SGST))`}</Typography>
                          </Box>
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
                        <Typography>
                          <FormattedLabel id="equipments" />
                        </Typography>
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
                                        <FormattedLabel id="equipment" />
                                      </InputLabel>
                                      <Controller
                                        render={({ field }) => (
                                          <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label={
                                              <FormattedLabel id="equipment" />
                                            }
                                            value={field.value}
                                            disabled
                                            onChange={(value) => {
                                              field.onChange(value);
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
                                      label={<FormattedLabel id="rate" />}
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
                                      label={<FormattedLabel id="quantity" />}
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
                                      label={<FormattedLabel id="total" />}
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

                    {authority?.includes("ROLE_CLERK") ? (
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
                          label={<FormattedLabel id="approvalClerkRemark" />}
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
                            label={<FormattedLabel id="approvalClerkRemark" />}
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
                            label={<FormattedLabel id="approvalRemarkByHod" />}
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
                      {authority?.includes("ROLE_HOD") && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={5}
                            md={5}
                            lg={5}
                            xl={5}
                            style={{
                              display: "flex",
                              justifyContent: "end",
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
                              <FormattedLabel id="approve" />
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={2} md={2} lg={2} xl={2}></Grid>
                          <Grid
                            item
                            xs={12}
                            sm={5}
                            md={5}
                            lg={5}
                            xl={5}
                            style={{
                              display: "flex",
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
                              <FormattedLabel id="reject" />
                            </Button>
                          </Grid>
                        </>
                      )}
                    </Grid>
                    <Grid container style={{ padding: "10px" }}>
                      {!authority?.includes("ROLE_HOD") && (
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Box style={{ width: "100%", padding: "10px" }}>
                    <DataGrid
                      // columnVisibilityModel={localStorage.getItem("HiddenCols")}
                      onColumnVisibilityModelChange={(newModel) => {
                        console.log("newModel", JSON.stringify(newModel));
                        // let abc = JSON.stringify(newModel);
                        // localStorage.setItem("HiddenCols", abc);

                        let res = addNumbers(
                          "set",
                          "HiddenCols",
                          setColsState,
                          newModel
                        );
                        console.log("addNum", res, colsState);
                      }}
                      sx={{
                        overflowY: "scroll",
                        "& .MuiDataGrid-virtualScrollerContent": {},
                        "& .MuiDataGrid-columnHeadersInner": {
                          backgroundColor: "#556CD6",
                          color: "white",
                        },
                        "& .MuiDataGrid-row:hover": {
                          color: "black",
                          backgroundColor: "#C3C1C8",
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
                      columns={colsState}
                      onPageChange={(_data) => {
                        getAuditoriumBooking(data.pageSize, _data);
                      }}
                      onPageSizeChange={(_data) => {
                        getAuditoriumBooking(_data, data.page);
                      }}
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
        </Grid>
      </Paper>
    </div>
  );
};

export default Index;
