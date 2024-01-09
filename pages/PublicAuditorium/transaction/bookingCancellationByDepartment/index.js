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
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/bookingCancellationByDepartment";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
import DoneIcon from "@mui/icons-material/Done";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { catchExceptionHandlingMethod } from "../../../../util/util";

const BookingCancellation = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   setValue,
  //   watch,
  //   formState: { errors },
  // } = useForm({ resolver: yupResolver(schema) });

  const methods = useForm({
    criteriaMode: "all",
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    setError,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(false);
  const [id, setID] = useState();

  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [bookingCancellation, setBookingCancellation] = useState([]);
  const [services, setServices] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [bookingFor, setBookingFor] = useState();
  const [loading, setLoading] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [showAccordion, setShowAccordion] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [bookedData, setBookedData] = useState([]);

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

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  let user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

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

  const applicationHistorycolumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
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
      field: "applicationNumberKey",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 0.4,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      flex: 0.4,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "designation",
      headerName: <FormattedLabel id="designation" />,
      flex: 0.5,
      headerAlign: "center",
    },
    // {
    //   field: "applicationStatus",
    //   headerName: <FormattedLabel id="status" />,
    //   flex: 0.7,
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

  const [applicationHistoryData, setApplicationHistoryData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let abc = [];

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getAuditorium();
    getServices();
    getDepartments();
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
    setLoading(true);
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
                  ?.organizationOwnerFirstName
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
            // budgetingUnit: row.budgetingUnit,
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
        setLoading(false);
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
        title: language == "en" ? "Inactivate?" : "निष्क्रिय करा",
        text:
          language == "en"
            ? "Are you sure you want to inactivate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड निष्क्रिय करू इच्छिता?",
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
                swal(
                  language == "en"
                    ? "Record is Successfully Deactivated!"
                    : "रेकॉर्ड यशस्वीरित्या निष्क्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
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
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
        }
      });
    } else {
      swal({
        title: language == "en" ? "Activate?" : "सक्रिय करा?",
        text:
          language == "en"
            ? "Are you sure you want to activate this Record?"
            : "तुम्हाला खात्री आहे की तुम्ही हे रेकॉर्ड सक्रिय करू इच्छिता?",
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
                swal(
                  language == "en"
                    ? "Record is Successfully Activated!"
                    : "रेकॉर्ड यशस्वीरित्या सक्रिय केले आहे!",
                  {
                    icon: "success",
                  }
                );
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
          swal(language == "en" ? "Record is Safe" : "रेकॉर्ड सुरक्षित आहे");
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
    setButtonInputState(false);
    setSlideChecked(false);
    setSlideChecked(false);
    setIsOpenCollapse(false);
    setEditButtonInputState(false);
    setDeleteButtonState(false);
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData, "bookedData", bookedData);
    const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");

    const finalBodyForApi = {
      ...bookedData.trnAuditoriumBookingOnlineProcess,
      // rentAmount: Number(bookedData.trnAuditoriumBookingOnlineProcess.rentAmount),
      eventDate: eventDate,
      status: bookedData.trnAuditoriumBookingOnlineProcess?.applicationStatus,
      isApproved: true,
      cancellationRemarkByClark: formData?.cancellationRemarkByClark,
      clarkReasonForCancellation: formData?.clarkReasonForCancellation,
      cancellationRemarkByHod: formData?.cancellationRemarkByHod,
      remarks: authority?.includes("HOD")
        ? formData?.cancellationRemarkByHod
        : formData?.cancellationRemarkByClark,
      hodReasonForCancellation: formData?.hodReasonForCancellation,
      applicationStatus:
        bookedData.trnAuditoriumBookingOnlineProcess?.applicationStatus,
      equipmentBookingList:
        bookedData.trnAuditoriumBookingOnlineProcess?.equipmentBookingList,
      designation: authority?.includes("HOD") ? "HOD" : "Clerk",
      processType: "C",
      actionBy: user?.userDao?.firstNameEn + " " + user?.userDao?.lastNameEn,
      noteSheetReferenceNo: formData?.notesheet_ReferenceNumber,
      billDate: moment(formData?.billDate).format("YYYY-MM-DD"),
      cancellationRefundableAmount: formData?.amountToBeReturned,
      // serviceId: 114,

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
            ? sweetAlert(
                language == "en" ? "Updated!" : "अपडेट केले",
                language == "en"
                  ? "Record Updated successfully!"
                  : "रेकॉर्ड यशस्वीरित्या अपडेट केले",
                "success"
              )
            : sweetAlert(
                language == "en" ? "Saved!" : "जतन केले",
                language == "en"
                  ? "Record Saved successfully!"
                  : "रेकॉर्ड यशस्वीरित्या जतन केले",
                "success"
              );
          // getAuditoriumBooking();
          getBookingCancellation();
          setButtonInputState(false);
          setIsOpenCollapse(false);
          setEditButtonInputState(false);
          setDeleteButtonState(false);
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
      minWidth: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 0.7,
      minWidth: 300,
      headerAlign: "center",
    },
    {
      field: "organizationName",
      headerName: <FormattedLabel id="organizationName" />,
      flex: 0.5,
      minWidth: 250,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 0.7,
      minWidth: 150,
      headerAlign: "center",
    },
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
      minWidth: 100,
      align: "center",
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
      minWidth: 100,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            {authority?.includes("CLERK") &&
              params.row.status == "CANCELLATION_REQUESTED" && (
                <Tooltip title="Clerk Action">
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
                      setBookedData(params.row);
                      setShowSearch(false);
                      let dd = params?.row?.timeSlotList;
                      setIsOpenCollapse(!isOpenCollapse);
                      setSlideChecked(true);
                      reset(params?.row?.trnAuditoriumBookingOnlineProcess);
                      setValue(
                        "totalAmount",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.depositAmount
                      );
                      setValue(
                        "applicantBuildingName",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicantFlatBuildingName
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

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "C";
                        }
                      );

                      let _history = history?.map((val, id) => {
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history || [],
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });
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
                    sx={{
                      overflow: "hidden",
                      fontSize: "10px",
                      whiteSpace: "normal",
                    }}
                    size="small"
                    onClick={() => {
                      console.log("6554", params?.row);
                      setBookedData(params.row);
                      let dd = params?.row?.timeSlotList;
                      setIsOpenCollapse(!isOpenCollapse);
                      setSlideChecked(true);
                      reset(params?.row?.trnAuditoriumBookingOnlineProcess);
                      setValue(
                        "totalAmount",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.depositAmount
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

                      setValue("billDate", params?.row?.billDate);
                      setValue(
                        "notesheet_ReferenceNumber",
                        params?.row?.noteSheetReferenceNo
                      );

                      setValue(
                        "amountToBeReturned",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.cancellationRefundableAmount
                      );

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "C";
                        }
                      );

                      let _history = history?.map((val, id) => {
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history || [],
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });
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
          <Box sx={{ padding: "10px" }}>
            <PabbmHeader labelName="bookingCancellationByDepartment" />
          </Box>
          {isOpenCollapse && (
            // <Slide
            //   direction="down"
            //   in={slideChecked}
            //   mountOnEnter
            //   unmountOnExit
            // >
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmitForm)}>
                {showSearch && (
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
                          label={
                            <FormattedLabel id="auditoriumBookingNumber" />
                          }
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
                )}

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
                      <FormattedLabel id="applicationHistory" />
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
                      sx={{ width: "90%" }}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        <FormattedLabel id="auditorium" />
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
                            label={<FormattedLabel id="auditorium" />}
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
                      variant="outlined"
                      sx={{ width: "90%" }}
                      error={!!errors.serviceId}
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
                  {authority?.includes("CLERK") && (
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
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="clarkReasonForCancellation" />
                          }
                          variant="outlined"
                          {...register("clarkReasonForCancellation")}
                          error={!!errors.clarkReasonForCancellation}
                          helperText={
                            errors?.clarkReasonForCancellation
                              ? errors.clarkReasonForCancellation.message
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
                          label={
                            <FormattedLabel id="cancellationRemarkByClark" />
                          }
                          size="small"
                          variant="outlined"
                          {...register("cancellationRemarkByClark")}
                          error={!!errors.cancellationRemarkByClark}
                          helperText={
                            errors?.cancellationRemarkByClark
                              ? errors.cancellationRemarkByClark.message
                              : null
                          }
                        />
                      </Grid>
                    </>
                  )}
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
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          size="small"
                          label={
                            <FormattedLabel id="hodReasonForCancellation" />
                          }
                          variant="outlined"
                          {...register("hodReasonForCancellation")}
                          error={!!errors.hodReasonForCancellation}
                          helperText={
                            errors?.hodReasonForCancellation
                              ? errors.hodReasonForCancellation.message
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
                          label={
                            <FormattedLabel id="cancellationRemarkByHod" />
                          }
                          size="small"
                          variant="outlined"
                          {...register("cancellationRemarkByHod")}
                          error={!!errors.cancellationRemarkByHod}
                          helperText={
                            errors?.cancellationRemarkByHod
                              ? errors.cancellationRemarkByHod.message
                              : null
                          }
                        />
                      </Grid>
                    </>
                  )}
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
                        label={<FormattedLabel id="bookingDate" />}
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
                                  onChange={(value) => field.onChange(value)}
                                  disabled
                                  label={<FormattedLabel id="departmentName" />}
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
                          {...register("organizationOwnerLastName")}
                          error={!!errors.organizationOwnerLastName}
                          disabled
                          size="small"
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
                          disabled
                          size="small"
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
                          disabled
                          size="small"
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
                          disabled
                          size="small"
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
                          size="small"
                          InputLabelProps={{ shrink: true }}
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
                      {bookedData?.trnAuditoriumBookingOnlineProcess
                        ?.timeSlotList &&
                        JSON.parse(
                          bookedData?.trnAuditoriumBookingOnlineProcess
                            ?.timeSlotList
                        )?.map((val) => {
                          return (
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
                                            <span style={{ fontSize: 16 }}>
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
                                  label={<FormattedLabel id="eventHours" />}
                                  disabled
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  value={val.fromTime + " To " + val.toTime}
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
                                  label={<FormattedLabel id="eventDay" />}
                                  disabled
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  value={moment(val.bookingDate).format("dddd")}
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
                        })}
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
                          id="outlined-basic"
                          label={<FormattedLabel id="depositAmount" />}
                          disabled
                          variant="outlined"
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
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          size="small"
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
                          label={<FormattedLabel id="applicantConfirmEmail" />}
                          size="small"
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
                          label={<FormattedLabel id="applicantFlatHouseNo" />}
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
                          size="small"
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
                          sx={{ width: "90%" }}
                          size="small"
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
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          id="outlined-basic"
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
                      {<FormattedLabel id="amountDetails" />}
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
                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: "600", color: "blue" }}>
                        कार्यक्रम रद्द झाल्यास / केल्यास, अनामत रक्कम कपातीबाबत
                        तपशील
                      </Typography>
                      <table
                        style={{
                          width: "80%",
                        }}
                      >
                        <tr>
                          <th
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                              backgroundColor: "gray",
                              color: "white",
                            }}
                          >
                            अ. क्र
                          </th>
                          <th
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                              backgroundColor: "gray",
                              color: "white",
                            }}
                          >
                            बुकिंग शो तारखेच्या आधीच्या दिवसांच्या संख्येवर रद्द
                            करणे
                          </th>
                          <th
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                              backgroundColor: "gray",
                              color: "white",
                            }}
                          >
                            कपात करावयाची रक्कम
                          </th>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                            }}
                          >
                            १
                          </td>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "left",
                              padding: "8px",
                            }}
                          >
                            ७ दिवस आधी शो रद्द केल्यास
                          </td>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                            }}
                          >
                            ७०%
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                            }}
                          >
                            २
                          </td>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "left",
                              padding: "8px",
                            }}
                          >
                            ८ ते ३० दिवसापर्यंत आधी शो रद्द केल्यास
                          </td>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                            }}
                          >
                            ५०%
                          </td>
                        </tr>
                        <tr>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                            }}
                          >
                            ३
                          </td>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "left",
                              padding: "8px",
                            }}
                          >
                            ३० दिवसापेक्षा जास्त दिवस आधी शो रद्द केल्यास
                          </td>
                          <td
                            style={{
                              border: "1px solid #dddddd",
                              textAlign: "center",
                              padding: "8px",
                            }}
                          >
                            ३०%
                          </td>
                        </tr>
                      </table>
                    </Grid>
                    <Grid
                      container
                      sx={{
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography sx={{ fontWeight: "600", color: "blue" }}>
                          Refund Breakup Details
                        </Typography>{" "}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <table
                          style={{
                            width: "80%",
                          }}
                        >
                          <tr>
                            <th
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "center",
                                backgroundColor: "gray",
                                color: "white",
                              }}
                            >
                              Sr No
                            </th>
                            <th
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "center",
                                backgroundColor: "gray",
                                color: "white",
                              }}
                            >
                              Content
                            </th>
                            <th
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "center",

                                backgroundColor: "gray",
                                color: "white",
                              }}
                            >
                              Amount
                            </th>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "center",
                              }}
                            >
                              1
                            </td>
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "left",
                              }}
                            >
                              Deposit amount paid
                            </td>
                            {console.log("bookedData", bookedData)}
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "right",
                              }}
                            >
                              {bookedData?.trnAuditoriumBookingOnlineProcess?.depositAmount?.toFixed(
                                2
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "center",
                              }}
                            >
                              2
                            </td>
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "left",
                              }}
                            >
                              Cancellation Charges
                            </td>
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "right",
                              }}
                            >
                              {moment().diff(
                                moment(
                                  bookedData?.trnAuditoriumBookingOnlineProcess
                                    ?.timeSlotList &&
                                    JSON.parse(
                                      bookedData
                                        ?.trnAuditoriumBookingOnlineProcess
                                        ?.timeSlotList
                                    )[0]?.bookingDate,
                                  "YYYY-MM-DD"
                                ),
                                "days"
                              ) < 7 &&
                                (
                                  bookedData?.trnAuditoriumBookingOnlineProcess
                                    ?.depositAmount * 0.7
                                )?.toFixed(2)}
                              {moment().diff(
                                moment(
                                  bookedData?.trnAuditoriumBookingOnlineProcess
                                    ?.timeSlotList &&
                                    JSON.parse(
                                      bookedData
                                        ?.trnAuditoriumBookingOnlineProcess
                                        ?.timeSlotList
                                    )[0]?.bookingDate,
                                  "YYYY-MM-DD"
                                ),
                                "days"
                              ) > 7 &&
                                moment().diff(
                                  moment(
                                    bookedData
                                      ?.trnAuditoriumBookingOnlineProcess
                                      ?.timeSlotList &&
                                      JSON.parse(
                                        bookedData
                                          ?.trnAuditoriumBookingOnlineProcess
                                          ?.timeSlotList
                                      )[0]?.bookingDate,
                                    "YYYY-MM-DD"
                                  ),
                                  "days"
                                ) < 30 &&
                                (
                                  bookedData?.trnAuditoriumBookingOnlineProcess
                                    ?.depositAmount * 0.5
                                )?.toFixed(2)}
                              {moment().diff(
                                moment(
                                  bookedData?.trnAuditoriumBookingOnlineProcess
                                    ?.timeSlotList &&
                                    JSON.parse(
                                      bookedData
                                        ?.trnAuditoriumBookingOnlineProcess
                                        ?.timeSlotList
                                    )[0]?.bookingDate,
                                  "YYYY-MM-DD"
                                ),
                                "days"
                              ) > 30 &&
                                (
                                  bookedData?.trnAuditoriumBookingOnlineProcess
                                    ?.depositAmount * 0.3
                                )?.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "center",
                              }}
                            >
                              3
                            </td>
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "left",

                                fontWeight: "600",
                              }}
                            >
                              Total refundable amount
                            </td>
                            <td
                              style={{
                                border: "1px solid #dddddd",
                                textAlign: "right",

                                fontWeight: "700",
                              }}
                            >
                              {(
                                Number(
                                  bookedData?.trnAuditoriumBookingOnlineProcess
                                    ?.depositAmount
                                ) -
                                Number(
                                  moment().diff(
                                    moment(
                                      bookedData
                                        ?.trnAuditoriumBookingOnlineProcess
                                        ?.timeSlotList &&
                                        JSON.parse(
                                          bookedData
                                            ?.trnAuditoriumBookingOnlineProcess
                                            ?.timeSlotList
                                        )[0]?.bookingDate,
                                      "YYYY-MM-DD"
                                    ),
                                    "days"
                                  ) < 7 &&
                                    Number(
                                      bookedData
                                        ?.trnAuditoriumBookingOnlineProcess
                                        ?.depositAmount * 0.7
                                    )
                                )
                              )?.toFixed(2)}
                            </td>
                          </tr>
                        </table>
                      </Box>
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
                          <FormattedLabel id="totalAmount" />
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
                          // label="Total Amount"
                          label={<FormattedLabel id="totalAmount" />}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          size="small"
                          disabled
                          value={
                            // bookedData?.trnAuditoriumBookingOnlineProcess
                            //   ?.rentAmount +
                            bookedData?.trnAuditoriumBookingOnlineProcess
                              ?.depositAmount
                          }
                          {...register("totalAmount")}
                          error={!!errors.totalAmount}
                          helperText={
                            errors?.totalAmount
                              ? errors.totalAmount.message
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
                          alignItems: "end",
                        }}
                      >
                        <Typography>
                          <FormattedLabel id="shownAnAmountToBeReturnedAfterBookingCancellation" />
                        </Typography>
                      </Grid>
                      {authority?.includes("HOD") ? (
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
                          <Controller
                            name="amountToBeReturned"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                sx={{ width: "90%" }}
                                id="outlined-basic"
                                label={
                                  <FormattedLabel id="amountToBeReturned" />
                                }
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                size="small"
                                disabled
                                onChange={(e) => {
                                  return field.onChange(e.target.value);
                                }}
                                value={field.value}
                                error={!!errors.amountToBeReturned}
                                helperText={
                                  errors?.amountToBeReturned?.message || ""
                                }
                              />
                            )}
                          />
                        </Grid>
                      ) : (
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
                          <Controller
                            name="amountToBeReturned"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                sx={{ width: "90%" }}
                                id="outlined-basic"
                                label={
                                  <FormattedLabel id="amountToBeReturned" />
                                }
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                  if (
                                    e.target.value >
                                    Number(
                                      Number(
                                        bookedData
                                          ?.trnAuditoriumBookingOnlineProcess
                                          ?.depositAmount
                                      ) -
                                        Number(
                                          moment().diff(
                                            moment(
                                              bookedData
                                                ?.trnAuditoriumBookingOnlineProcess
                                                ?.timeSlotList &&
                                                JSON.parse(
                                                  bookedData
                                                    ?.trnAuditoriumBookingOnlineProcess
                                                    ?.timeSlotList
                                                )[0]?.bookingDate,
                                              "YYYY-MM-DD"
                                            ),
                                            "days"
                                          ) < 7 &&
                                            Number(
                                              bookedData
                                                ?.trnAuditoriumBookingOnlineProcess
                                                ?.depositAmount * 0.7
                                            )
                                        )
                                    )
                                  ) {
                                    setError("amountToBeReturned", {
                                      type: "manual",
                                      message:
                                        "Greater amount than refundable amount",
                                    });
                                  } else {
                                    return field.onChange(e.target.value);
                                  }
                                }}
                                value={field.value}
                                error={!!errors.amountToBeReturned}
                                helperText={
                                  errors?.amountToBeReturned?.message || ""
                                }
                              />
                            )}
                          />
                        </Grid>
                      )}
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
                          border: "solid red",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          id="outlined-basic"
                          label={<FormattedLabel id="budgetingUnit" />}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          size="small"
                          {...register("budgetingUnit")}
                          error={!!errors.budgetingUnit}
                          helperText={
                            errors?.budgetingUnit
                              ? errors.budgetingUnit.message
                              : null
                          }
                        />
                      </Grid> */}
                      {authority?.includes("CLERK") && (
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
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="notesheet_ReferenceNumber" />
                              }
                              variant="outlined"
                              InputLabelProps={{
                                shrink: !!watch("notesheet_ReferenceNumber"),
                              }}
                              sx={{
                                width: "90%",
                              }}
                              size="small"
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
                            <FormControl
                              sx={{ width: "90%" }}
                              error={errors.eventDate}
                              size="small"
                            >
                              <Controller
                                name="billDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
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
                                          error={errors.billDate}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.billDate
                                  ? errors.billDate.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </>
                      )}
                      {authority?.includes("HOD") && (
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
                              justifyContent: "center",
                            }}
                          >
                            <TextField
                              id="outlined-basic"
                              label={
                                <FormattedLabel id="notesheet_ReferenceNumber" />
                              }
                              variant="outlined"
                              InputLabelProps={{
                                shrink: !!watch("notesheet_ReferenceNumber"),
                              }}
                              sx={{
                                width: "90%",
                              }}
                              size="small"
                              disabled
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
                            <FormControl
                              sx={{ width: "90%" }}
                              error={errors.eventDate}
                              size="small"
                            >
                              <Controller
                                name="billDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
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
                                      disabled
                                      selected={field.value}
                                      center
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          size="small"
                                          fullWidth
                                          error={errors.billDate}
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                )}
                              />
                              <FormHelperText>
                                {errors?.billDate
                                  ? errors.billDate.message
                                  : null}
                              </FormHelperText>
                            </FormControl>
                          </Grid>
                        </>
                      )}
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
                          border: "solid red",
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
                                  onChange={(e) =>
                                    props.onChange(e.target.checked)
                                  }
                                />
                              )}
                            />
                          }
                          label={<FormattedLabel id="budgetingUnit" />}
                        />
                      </Grid>
                    </Grid> */}
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
            </FormProvider>
            //</Slide>
          )}

          {!isOpenCollapse && (
            <>
              {/* <Grid container style={{ padding: "10px" }}>
                <Grid item xs={9}></Grid>
                <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    endIcon={<AddIcon />}
                    type="primary"
                    size="small"
                    onClick={() => {
                      reset({
                        ...resetValuesExit,
                      });
                      setEditButtonInputState(true);
                      setDeleteButtonState(true);
                      setBtnSaveText("Save");
                      setButtonInputState(true);
                      setSlideChecked(true);
                      setIsOpenCollapse(!isOpenCollapse);
                      setShowSearch(true);
                    }}
                  >
                    Cancel Booking
                  </Button>
                </Grid>
              </Grid> */}

              <Box
                style={{ height: "auto", overflow: "auto", padding: "10px" }}
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
                  autoHeight={true}
                  // rowHeight={50}
                  pagination
                  paginationMode="server"
                  // loading={data.loading}
                  rowCount={data.totalRows}
                  rowsPerPageOptions={data.rowsPerPageOptions}
                  page={data.page}
                  pageSize={data.pageSize}
                  rows={data.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    getBookingCancellation(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    // updateData("page", 1);
                    getBookingCancellation(_data, data.page);
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      )}
    </div>
  );
};

export default BookingCancellation;
