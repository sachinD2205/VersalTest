import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import sweetAlert from "sweetalert";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/cancellationByDepartment";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
// import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import moment from "moment";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import urls from "../../../../URLS/urls";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useRouter } from "next/router";
import DoneIcon from "@mui/icons-material/Done";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const CancellationByDepartment = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(true);
  const [id, setID] = useState();

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [bookingCancellation, setBookingCancellation] = useState([]);
  const [services, setServices] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);

  const [bookingFor, setBookingFor] = useState();
  const [loading, setLoading] = useState(false);

  const [showAccordion, setShowAccordion] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [bookedData, setBookedData] = useState([]);

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  let user = useSelector((state) => state.user.user);

  let router = useRouter();

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority, selectedMenuFromDrawer, user?.menus);

  const handleChangeRadio = (event) => {
    setBookingFor(event.target.value);
  };

  const [data, setData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

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

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getAuditorium();
    getServices();
    // getNexAuditoriumBookingNumber();
    // getServices();
  }, []);

  useEffect(() => {
    // getAuditoriumBooking();
    getBookingCancellation();
  }, [auditoriums]);

  const getNexAuditoriumBookingNumber = () => {
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getNextKey`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        let val = r?.data;
        setValue("auditoriumBookingNo", r?.data);
        setLoading(false);
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
        console.log("respe", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
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

  const getBookingCancellation = () => {
    axios
      .get(`${urls.PABBMURL}/trnBookingCancellationProcess/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // axios.get(`http://192.168.68.145:9006/pabbm/api/trnBookingCancellationProcess/getAll`).then((res) => {
        console.log("respe1", res);
        let result = res.data.trnBookingCancellationProcessList;

        let _res = result?.map((row, index) => {
          return {
            ...row,
            id: row.id,
            srNo: index + 1,
            // auditoriumKey: row.auditoriumKey,
            applicationNumber: row.applicationNumberKey,
            _auditoriumName: row.auditoriumName ? row.auditoriumName : "-",
            auditoriumName: row?.trnAuditoriumBookingOnlineProcess?.auditoriumId
              ? auditoriums.find(
                  (obj) =>
                    obj?.id ==
                    row?.trnAuditoriumBookingOnlineProcess?.auditoriumId
                )?.auditoriumNameEn
              : "-",

            // serviceKey: row.serviceKey,
            // serviceName: row.serviceName,
            // cancelByApplicantOrVendor: row.cancelByApplicantOrVendor,
            // cancelByDepartment: row.cancelByDepartment,
            reasonForCancellation:
              row?.trnAuditoriumBookingOnlineProcess?.reasonsForCancellation,

            auditoriumBookingKey: row.auditoriumBookingKey,
            organizationName: row?.trnAuditoriumBookingOnlineProcess
              ?.organizationName
              ? row?.trnAuditoriumBookingOnlineProcess?.organizationName
              : "-",
            title: row.title,
            organizationOwnerFirstName: row?.trnAuditoriumBookingOnlineProcess
              ?.organizationOwnerFirstName
              ? row?.trnAuditoriumBookingOnlineProcess
                  ?.organizationOwnerFirstName +
                " " +
                row.organizationOwnerLastName
              : "-",
            organizationOwnerMiddleName: row.organizationOwnerMiddleName,
            organizationOwnerLastName: row.organizationOwnerLastName,
            flatBuildingNo: row.flatBuildingNo,
            buildingName: row.buildingName,
            roadName: row.roadName,
            landmark: row.landmark,
            pincode: row.pincode,
            aadhaarNo: row.aadhaarNo,
            mobileNo: row?.trnAuditoriumBookingOnlineProcess?.applicantMobileNo
              ? row?.trnAuditoriumBookingOnlineProcess?.applicantMobileNo
              : "-",
            landlineNo: row.landlineNo,
            emailAddress: row.emailAddress,
            // messageDisplayKey: row.messageDisplayKey,
            // messageDisplayName: row.messageDisplayName,
            eventDetails: row.eventDetails,
            eventDate: row?.trnAuditoriumBookingOnlineProcess?.eventDate
              ? moment(
                  row?.trnAuditoriumBookingOnlineProcess?.eventDate
                ).format("DD-MM-YYYY")
              : "-",
            // eventFromDate: row.eventFromDate,
            // eventToDate: row.eventToDate,
            // depositedAmount: row.depositedAmount,
            // depositReceiptNo: row.depositReceiptNo,
            rentAmount: row.rentAmount ? row.rentAmount : "-",
            status: row?.trnAuditoriumBookingOnlineProcess?.applicationStatus,
            // rentReceiptNo: row.rentReceiptNo,
            // termsAndCondition: row.termsAndCondition,
            // amountToBeReturnedAfterBookingCancellation:
            //   row.amountToBeReturnedAfterBookingCancellation,
            // notesheetReferenceNo: row.notesheetReferenceNo,
            billDate: row.billDate,
            // ecsPaymentKey: row.ecsPaymentKey,
            // ecsPaymentName: row.ecsPaymentName,
            // remark: row.remark,
            activeFlag: row.activeFlag,
          };
        });

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
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      // .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByBookingNo?bookingNo=${id}`)
      // .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getById?id=${id}`)
      .then((r) => {
        setLoading(true);
        console.log("By id", r, moment(r.data.eventDate).format("dddd"));
        setLoading(false);
        if (r.status === 200) {
          setBookedData(r?.data);
          reset(r.data);
          setValue("eventDay", moment(r.data.eventDate).format("dddd"));
          setValue("auditoriumBookingNumber", r.data.auditoriumBookingNo);
          setValue("auditoriumId", r.data.auditoriumId);
          setValue("serviceId", r.data.serviceId);
          setValue("bookingDate", r.data.applicationDate);
        }
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

  const getZoneName = () => {
    axios
      .get(`${urls.CFCURL}/master/zone/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setZoneNames(
          r.data.zone.map((row, index) => ({
            id: row.id,
            zoneName: row.zoneName,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getWardNames = () => {
    axios
      .get(`${urls.CFCURL}/master/ward/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setWardNames(
          r.data.ward.map((row) => ({
            id: row.id,
            wardName: row.wardName,
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
    console.log("_pageSize,_pageNo", _pageSize, _pageNo);
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res aud", res);

        setLoading(false);
        let result = res.data.trnAuditoriumBookingOnlineProcessList;
        let _res = result.map((val, i) => {
          console.log("44", val);
          return {
            srNo: val.id,
            id: val.id,
            auditoriumName: val.auditoriumName ? val.auditoriumName : "-",
            toDate: val.toDate ? val.toDate : "-",
            fromDate: val.fromDate ? val.fromDate : "-",
            holidaySchedule: val.holidaySchedule ? val.holidaySchedule : "-",
            status: val.activeFlag === "Y" ? "Active" : "Inactive",
            activeFlag: val.activeFlag,

            auditoriumId: val.auditoriumId
              ? auditoriums.find((obj) => obj?.id == val.auditoriumId)
                  ?.auditoriumName
              : "Not Available",
            eventDate: val.eventDate
              ? moment(formData.eventDate).format("DD-MM-YYYY")
              : "-",
            mobile: val.mobile ? val.mobile : "-",
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName +
                " " +
                val.organizationOwnerLastName
              : "-",
          };
        });

        console.log("result", _res);

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

  const deleteById = (value, _activeFlag) => {
    let body = {
      activeFlag: _activeFlag,
      id: value,
    };
    console.log("body", body);
    if (_activeFlag === "N") {
      swal({
        title: "Inactivate?",
        text: "Are you sure you want to inactivate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/billType/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBookingCancellation();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    } else {
      swal({
        title: "Activate?",
        text: "Are you sure you want to activate this Record ? ",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        console.log("inn", willDelete);
        if (willDelete === true) {
          axios
            .post(`${urls.CFCURL}/master/billType/save`, body, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log("delet res", res);
              if (res.status == 200) {
                swal("Record is Successfully Deleted!", {
                  icon: "success",
                });
                getBookingCancellation();
                setButtonInputState(false);
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else if (willDelete == null) {
          swal("Record is Safe");
        }
      });
    }
  };

  const cancellButton = () => {
    reset({
      ...resetValuesCancell,
      id,
    });
  };

  const resetValuesCancell = {
    billPrefix: "",
    billType: "",
    fromDate: null,
    toDate: null,
    remark: "",
  };

  const exitButton = () => {
    reset({
      ...resetValuesExit,
    });
    //   setButtonInputState(false);
    //   setSlideChecked(false);
    //   setSlideChecked(false);
    //   setIsOpenCollapse(false);
    //   setEditButtonInputState(false);
    //   setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData, "bookedData", bookedData);
    const forceCancellationBillDate = moment(
      formData.forceCancellationBillDate
    ).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...bookedData,
      cancelBy: "Department",
      cancellationRemark: formData?.cancellationRemark,
      reasonsForCancellation: formData?.reasonForCancellation,
      forceCancellationNotesheetReferenceNumber:
        formData?.forceCancellationNotesheetReferenceNumber,
      forceCancellationBillDate: forceCancellationBillDate,
      forceCancellationAmountToBeReturned:
        formData?.forceCancellationAmountToBeReturned,

      // applicationStatus: bookedData.trnAuditoriumBookingOnlineProcess?.applicationStatus,
      // equipmentBookingList: bookedData.trnAuditoriumBookingOnlineProcess?.equipmentBookingList,

      // eventDate,
      // serviceKey: Number(formData.serviceId),
      // auditoriumBookingKey: Number(formData.auditoriumBookingNumber),
      // auditoriumKey: Number(formData.auditoriumId),
      // aadhaarNo: Number(formData.aadhaarNo),
      // landlineNo: Number(formData.landlineNo),
      // mobileNo: Number(formData.mobile),
      // depositAmount: Number(formData.depositAmount),
      // payRentAmount: Number(formData.payRentAmount),
      // pincode: Number(formData.pincode),
      // rentAmount: Number(formData.rentAmount),
      // extendedRentAmount: Number(formData.extendedRentAmount),
      // bankaAccountNo: Number(formData.bankaAccountNo),
      // amountToBeReturnedAfterBookingCancellation: Number(formData.amountToBeReturned),
      // notesheetReferenceNo: Number(formData.notesheet_ReferenceNumber),
      // id: null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    axios
      .post(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/bookingCancellation`,
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
            ? sweetAlert("Updated!", "Record Updated successfully !", "success")
            : sweetAlert("Saved!", "Record Saved successfully !", "success");
          router.push("../dashboard");
          // getAuditoriumBooking();
          // getBookingCancellation();
          // setButtonInputState(false);
          // setIsOpenCollapse(false);
          // setEditButtonInputState(false);
          // setDeleteButtonState(false);
        }
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const resetValuesExit = {
    billPrefix: "",
    fromDate: "",
    toDate: "",
    billType: "",
  };

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.2,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "organizationName",
      headerName: <FormattedLabel id="organizationName" />,
      flex: 0.5,
      headerAlign: "center",
    },
    {
      field: "organizationOwnerFirstName",
      headerName: <FormattedLabel id="organizationOwnerFirstName" />,
      flex: 0.7,
      headerAlign: "center",
    },
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
      maxWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "mobileNo",
      headerName: <FormattedLabel id="mobile" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Tooltip title={params.row.status}>
            <span className="table-cell-trucate">{params.row.status}</span>
          </Tooltip>
        );
      },
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      flex: 0.5,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {authority?.includes("CLERK") &&
              params.row.status == "CANCELLATION_REQUESTED" && (
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
                      // setBookedData(params.row);
                      let dd = params?.row?.timeSlotList;
                      setIsOpenCollapse(!isOpenCollapse);
                      setSlideChecked(true);
                      reset(params?.row?.trnAuditoriumBookingOnlineProcess);
                      setValue(
                        "eventDay",
                        moment(
                          params?.row?.trnAuditoriumBookingOnlineProcess
                            ?.eventDate
                        ).format("dddd")
                      );
                      setValue(
                        "auditoriumBookingNumber",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.auditoriumBookingNo
                      );
                      setValue(
                        "auditoriumId",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?._auditoriumId
                      );
                      setValue(
                        "serviceId",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.serviceId
                      );
                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                    }}
                  >
                    <DoneIcon />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("HOD") &&
              params.row.status ===
                "CANCELLATION_REQUEST_APPROVED_BY_CLARK" && (
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
                      console.log("6554", params?.row);
                      // setBookedData(params.row);
                      let dd = params?.row?.timeSlotList;
                      setIsOpenCollapse(!isOpenCollapse);
                      setSlideChecked(true);
                      reset(params?.row?.trnAuditoriumBookingOnlineProcess);
                      setValue(
                        "eventDay",
                        moment(
                          params?.row?.trnAuditoriumBookingOnlineProcess
                            ?.eventDate
                        ).format("dddd")
                      );
                      setValue(
                        "auditoriumBookingNumber",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.auditoriumBookingNo
                      );
                      setValue(
                        "auditoriumId",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?._auditoriumId
                      );
                      setValue(
                        "serviceId",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.serviceId
                      );
                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                    }}
                  >
                    <DoneIcon />
                  </Button>
                </Tooltip>
              )}
          </>
        );
      },
    },
  ];

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Paper>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
              background:
                "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
            }}
          >
            <h2>
              <FormattedLabel id="forcefullyCancellationByDepartment" />
            </h2>
          </Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <>
                  <Grid container style={{ padding: "10px" }}>
                    <Grid item xs={12} sm={3} md={3} lg={3} xl={3}></Grid>
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
                      <TextField
                        id="outlined-basic"
                        label={<FormattedLabel id="auditoriumBookingNumber" />}
                        variant="outlined"
                        size="small"
                        sx={{
                          width: "90%",
                        }}
                        {...register("auditoriumBookingNumber")}
                        error={!!errors.auditoriumBookingNumber}
                        helperText={
                          errors?.auditoriumBookingNumber
                            ? errors.auditoriumBookingNumber.message
                            : null
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container sx={{ padding: "10px" }}>
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        variant="outlined"
                        color="success"
                        disabled={!watch("auditoriumBookingNumber")}
                        size="small"
                        sx={{
                          "&:hover": {
                            backgroundColor: "#0A4EE8",
                            color: "#fff",
                          },
                        }}
                        onClick={() => {
                          let enteredAuditoriumBookingNo = watch(
                            "auditoriumBookingNumber"
                          );
                          getAuditoriumBookingDetailsById(
                            enteredAuditoriumBookingNo
                          );

                          setShowAccordion(true);
                          setOpenAccordion(true);
                        }}
                      >
                        <FormattedLabel id="searchByAuditoriumBookingNumber" />
                      </Button>
                    </Grid>
                  </Grid>
                </>

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
                    }}
                  >
                    <FormControl
                      error={errors.auditoriumId}
                      variant="outlined"
                      size="small"
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="selectAuditorium" />
                      </InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={field.value}
                            size="small"
                            disabled
                            onChange={(value) => field.onChange(value)}
                            label={<FormattedLabel id="selectAuditorium" />}
                          >
                            {auditoriums &&
                              auditoriums?.map((auditorium, index) => {
                                return (
                                  <MenuItem key={index} value={auditorium?.id}>
                                    {auditorium?.auditoriumNameEn}
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
                            size="small"
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
                    }}
                  >
                    <TextField
                      sx={{ width: "90%" }}
                      id="outlined-basic"
                      size="small"
                      label={<FormattedLabel id="reasonForCancellation" />}
                      variant="outlined"
                      {...register("reasonForCancellation")}
                      error={!!errors.reasonForCancellation}
                      helperText={
                        errors?.reasonForCancellation
                          ? errors.reasonForCancellation.message
                          : null
                      }
                    />
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
                    <TextField
                      sx={{ width: "90%" }}
                      id="outlined-basic"
                      label={<FormattedLabel id="cancellationRemark" />}
                      size="small"
                      variant="outlined"
                      {...register("cancellationRemark")}
                      error={!!errors.cancellationRemark}
                      helperText={
                        errors?.cancellationRemark
                          ? errors.cancellationRemark.message
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
                    lg={6}
                    xl={6}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      sx={{ width: "90%" }}
                      error={errors.bookingDate}
                    >
                      <Controller
                        name="bookingDate"
                        label="Booking Date"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              disabled
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="bookingDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  label={<FormattedLabel id="bookingDate" />}
                                  fullWidth
                                  error={errors.calendar}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.bookingDate
                          ? errors.bookingDate.message
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
                      sx={{ width: "90%" }}
                      error={errors.cancellationDate}
                    >
                      <Controller
                        name="cancellationDate"
                        label={<FormattedLabel id="cancellationDate" />}
                        control={control}
                        defaultValue={new Date()}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              disabled
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="cancellationDate" />
                                </span>
                              }
                              value={field.value}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              selected={field.value}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  label={
                                    <FormattedLabel id="cancellationDate" />
                                  }
                                  fullWidth
                                  error={errors.calendar}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.cancellationDate
                          ? errors.cancellationDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

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
                      <FormattedLabel id="bookingAuditoriumDetails" />
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
                          size="small"
                          label={<FormattedLabel id="organizationName" />}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
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
                          id="outlined-basic"
                          label={<FormattedLabel id="title" />}
                          variant="outlined"
                          size="small"
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
                          size="small"
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
                          size="small"
                          label={<FormattedLabel id="roadName" />}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
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
                          id="outlined-basic"
                          label={<FormattedLabel id="landmark" />}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          size="small"
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
                          id="outlined-basic"
                          label={<FormattedLabel id="pinCode" />}
                          variant="outlined"
                          size="small"
                          disabled
                          type="number"
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
                          size="small"
                          sx={{
                            width: "90%",
                          }}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          {...register("aadhaarNo")}
                          error={!!errors.aadhaarNo}
                          helperText={
                            errors?.aadhaarNo ? errors.aadhaarNo.message : null
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
                          InputLabelProps={{ shrink: true }}
                          size="small"
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
                          size="small"
                          error={errors.eventDate}
                        >
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
                          label={<FormattedLabel id="eventDay" />}
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          variant="outlined"
                          {...register("eventDay")}
                          error={!!errors.eventDay}
                          helperText={
                            errors?.eventDay ? errors.eventDay.message : null
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
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          label={<FormattedLabel id="applicantName" />}
                          variant="outlined"
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
                          size="small"
                          label={
                            <FormattedLabel id="applicantConfirmMobileNo" />
                          }
                          sx={{
                            width: "90%",
                          }}
                          disabled
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
                          size="small"
                          label={<FormattedLabel id="applicantEmail" />}
                          variant="outlined"
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
                          size="small"
                          label={<FormattedLabel id="applicantConfirmEmail" />}
                          variant="outlined"
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
                          size="small"
                          label={
                            <FormattedLabel id="relationWithOrganization" />
                          }
                          variant="outlined"
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
                          size="small"
                          label={<FormattedLabel id="applicantFlatHouseNo" />}
                          sx={{
                            width: "90%",
                          }}
                          disabled
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
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
                          size="small"
                          label={
                            <FormattedLabel id="applicantFlatBuildingName" />
                          }
                          variant="outlined"
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
                          size="small"
                          label={<FormattedLabel id="applicantLandmark" />}
                          variant="outlined"
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
                          size="small"
                          label={<FormattedLabel id="applicantArea" />}
                          variant="outlined"
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
                          size="small"
                          sx={{ width: "90%" }}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="country" />
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
                                    <MenuItem key={index} value={country.name}>
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
                          error={errors.applicantCountry}
                          variant="outlined"
                          size="small"
                          sx={{ width: "90%" }}
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
                                label={<FormattedLabel id="applicantState" />}
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
                          size="small"
                          sx={{ width: "90%" }}
                        >
                          <InputLabel id="demo-simple-select-outlined-label">
                            <FormattedLabel id="applicantCity" />
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
                                label={<FormattedLabel id="applicantCity" />}
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
                      <FormattedLabel id="amountDetails" />
                    </Typography>
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
                          id="outlined-basic"
                          size="small"
                          label={<FormattedLabel id="amountToBeReturned" />}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          {...register("forceCancellationAmountToBeReturned")}
                          error={!!errors.forceCancellationAmountToBeReturned}
                          helperText={
                            errors?.forceCancellationAmountToBeReturned
                              ? errors.forceCancellationAmountToBeReturned
                                  .message
                              : null
                          }
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
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="notesheet_ReferenceNumber" />
                          }
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            width: "90%",
                          }}
                          {...register(
                            "forceCancellationNotesheetReferenceNumber"
                          )}
                          error={
                            !!errors.forceCancellationNotesheetReferenceNumber
                          }
                          helperText={
                            errors?.forceCancellationNotesheetReferenceNumber
                              ? errors.forceCancellationNotesheetReferenceNumber
                                  .message
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
                        <FormControl
                          sx={{ width: "90%" }}
                          error={errors.forceCancellationBillDate}
                        >
                          <Controller
                            name="forceCancellationBillDate"
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
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                      error={errors.forceCancellationBillDate}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                            )}
                          />
                          <FormHelperText>
                            {errors?.forceCancellationBillDate
                              ? errors.forceCancellationBillDate.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

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
                      justifyContent: "end",
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
                <Divider />
              </form>
            </Slide>
          )}
        </Paper>
      )}
    </div>
  );
};

export default CancellationByDepartment;
