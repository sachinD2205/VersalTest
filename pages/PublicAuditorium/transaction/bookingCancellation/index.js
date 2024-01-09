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
  IconButton,
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
import React, { useEffect, useState, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/bookingCancellation";
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import { useRouter } from "next/router";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import useMediaQuery from "@mui/material/useMediaQuery";
import { styled, useTheme } from "@mui/material/styles";

const BookingCancellation = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "levelsOfRolesDaoList",
      control,
    }
  );

  const language = useSelector((state) => state.labels.language);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.user.token);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const accordionRef = useRef(null);

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [editButtonInputState, setEditButtonInputState] = useState(false);
  const [deleteButtonInputState, setDeleteButtonState] = useState(false);
  const [btnSaveText, setBtnSaveText] = useState("Save");
  const [slideChecked, setSlideChecked] = useState(true);
  const [id, setID] = useState();
  const [showAccordion, setShowAccordion] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(false);
  const [showGridBox, setShowGridBox] = useState(false);
  const [zoneNames, setZoneNames] = useState([]);
  const [wardNames, setWardNames] = useState([]);
  const [bookingCancellation, setBookingCancellation] = useState([]);
  const [services, setServices] = useState([]);
  const [auditoriums, setAuditoriums] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [bookingFor, setBookingFor] = useState();
  const [loading, setLoading] = useState(false);
  const [equipments, setEquipments] = useState([]);
  const [bookedData, setBookedData] = useState([]);
  const router = useRouter();

  const [_loggedInUser, set_LoggedInUser] = useState(null);

  useEffect(() => {
    set_LoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

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

  let abc = [];

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getAuditorium();
    getServices();
    getEquipment();
    getDepartments();
    // getNexAuditoriumBookingNumber();
    // getServices();
  }, []);

  useEffect(() => {
    // getAuditoriumBooking();
    getBookingCancellation();
  }, [auditoriums]);

  const appendUI = () => {
    append({
      equipment: "",
      quantity: "",
      rate: "",
      total: "",
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

  const getBookingCancellation = () => {
    axios
      .get(`${urls.PABBMURL}/trnBookingCancellationProcess/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("respe1", res);
        let result = res.data.trnBookingCancellationProcessList;

        let _res = result?.map((row, index) => ({
          id: row.id,
          srNo: index + 1,
          // auditoriumKey: row.auditoriumKey,
          auditoriumName: row.auditoriumName ? row.auditoriumName : "-",
          auditoriumName: row.auditoriumKey
            ? auditoriums.find((obj) => obj?.id == row.auditoriumKey)
                ?.auditoriumNameEn
            : "-",

          // serviceKey: row.serviceKey,
          // serviceName: row.serviceName,
          // cancelByApplicantOrVendor: row.cancelByApplicantOrVendor,
          // cancelByDepartment: row.cancelByDepartment,
          citizenReasonForCancellation: row.citizenReasonForCancellation,
          auditoriumBookingKey: row.auditoriumBookingKey,
          organizationName: row.organizationName ? row.organizationName : "-",
          title: row.title,
          organizationOwnerFirstName: row.organizationOwnerFirstName
            ? row.organizationOwnerFirstName +
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
          mobileNo: row.mobileNo ? row.mobileNo : "-",
          landlineNo: row.landlineNo,
          emailAddress: row.emailAddress,
          // messageDisplayKey: row.messageDisplayKey,
          // messageDisplayName: row.messageDisplayName,
          eventDetails: row.eventDetails,
          eventDate: row.eventDate
            ? moment(row.eventDate).format("DD-MM-YYYY")
            : "-",
          // eventFromDate: row.eventFromDate,
          // eventToDate: row.eventToDate,
          // depositedAmount: row.depositedAmount,
          // depositReceiptNo: row.depositReceiptNo,
          rentAmount: row.rentAmount ? row.rentAmount : "-",
          status: row.activeFlag === "Y" ? "Actice" : "Inactive",
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
        }));

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

  const getAuditoriumBookingDetailsById = (
    applicationNum,
    auditoriumId,
    eveDate
  ) => {
    setLoading(true);
    console.log("oid", id);

    axios
      .get(
        // `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getApplicationDetailsForCancellation`,

        {
          params: {
            auditoriumId: auditoriumId ? auditoriumId : null,
            applicationNumber: applicationNum ? applicationNum : null,
            eventDate: eveDate ? eveDate : null,
            createdUserId: user?.id ? user?.id : null,
            // pageSize: _pageSize,
            // pageNo: _pageNo,
            // sortBy: _sortBy,
            // sortDir: _sortDir,
          },
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
          setShowGridBox(true);
          setShowAccordion(false);
          if (r?.data?.trnAuditoriumBookingOnlineProcessList?.length == 0) {
            toast("No Data Available", {
              type: "error",
            });
          }
          // setBookedData(r?.data);
          let _res = r?.data?.trnAuditoriumBookingOnlineProcessList?.map(
            (val, i) => {
              console.log("445", val);
              return {
                ...val,
                srNo: i + 1,
                id: val?.id,
                status: val?.applicationStatus,
                activeFlag: val?.activeFlag,
                organizationName: val?.organizationName,
                eventTitle: val?.eventTitle,
                applicationNumber: val?.applicationNumber,
                applicationDate: moment(val?.applicationDate).format(
                  "DD-MM-YYYY"
                ),
                auditoriumName: val?.auditoriumId
                  ? auditoriums.find((obj) => obj?.id == val?.auditoriumId)
                      ?.auditoriumNameEn
                  : "Not Available",
                eventDate: val?.eventDate
                  ? moment(val?.eventDate).format("DD-MM-YYYY")
                  : "-",
              };
            }
          );
          setDataSource({
            rows: _res,
            totalRows: 10,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: 10,
            page: 1,
          });
          // setDataSource({
          //   rows: _res,
          //   totalRows: res.data.totalElements,
          //   rowsPerPageOptions: [10, 20, 50, 100],
          //   pageSize: res.data.pageSize,
          //   page: res.data.pageNo,
          // });
          ////////////////////////////////////////////-----/////////////////
          // reset(r.data);
          // setValue("auditoriumBookingNumber", r.data.applicationNumber);
          // setValue("auditoriumId", r.data.auditoriumId);
          // // setValue("serviceId", r.data.serviceId);
          // setValue("serviceId", 114);
          // setValue("bookingDate", r.data.applicationDate);
          // setValue("applicantBuildingName", r.data.applicantFlatBuildingName);

          // r?.data?.extraEquipmentUsedChargesList?.forEach((val, index) => {
          //   setValue(
          //     `levelsOfRolesDaoList[${index}].equipment`,
          //     val?.equipmentKey
          //   );
          //   setValue(`levelsOfRolesDaoList[${index}].quantity`, val?.quantity);
          //   setValue(`levelsOfRolesDaoList[${index}].rate`, val?.rate);
          //   setValue(`levelsOfRolesDaoList[${index}].total`, val?.total);
          //   if (!(index + 1 === r?.data?.equipmentBookingList.length)) {
          //     appendUI();
          //   }
          // });

          ////////////////////////////////////////////-----/////////////////

          // r?.data?.equipmentBookingList?.forEach((val, index) => {
          //   setValue(
          //     `levelsOfRolesDaoList[${index}].equipment`,
          //     val?.equipmentKey
          //   );
          //   setValue(`levelsOfRolesDaoList[${index}].quantity`, val?.rate);
          //   setValue(`levelsOfRolesDaoList[${index}].rate`, val?.quantity);
          //   setValue(`levelsOfRolesDaoList[${index}].total`, val?.total);
          //   if (!(index + 1 === r?.data?.equipmentBookingList.length)) {
          //     appendUI();
          //   }
          // });
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
    // setButtonInputState(false);
    // setSlideChecked(false);
    // setSlideChecked(false);
    // setIsOpenCollapse(false);
    // setEditButtonInputState(false);
    // setDeleteButtonState(false);
    _loggedInUser == "cfcUser"
      ? router.push("../../../CFC_Dashboard")
      : router.push("/dashboardV3");
  };

  const onSubmitForm = (formData) => {
    const eventDate = moment(formData.eventDate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    const applicationDate = moment(formData.eventDate, "DD-MM-YYYY").format(
      "YYYY-MM-DD"
    );
    console.log("formData", formData, eventDate, applicationDate);
    let loggedInUser = localStorage.getItem("loggedInUser");
    const finalBodyForApi = {
      ...bookedData,
      eventDate: eventDate,
      applicationDate,
      citizenReasonForCancellation: formData?.citizenReasonForCancellation,
      cancelBy: "Citizen",
      cancellationRemarkByCitizen: formData?.cancellationRemarkByCitizen,
      remarks: formData?.cancellationRemarkByCitizen,
      processType: "C",
      designation: "Citizen",
      serviceId: 114,
      actionBy: user?.firstName + " " + user?.surname,
      applicantType:
        loggedInUser == "citizenUser"
          ? 1
          : loggedInUser == "departmentUser"
          ? 3
          : 2,
      // eventDate,
      // // auditoriumBookingNo: Number(formData.auditoriumBookingNumber),
      // // auditoriumId: Number(formData.auditoriumId),
      // serviceKey: Number(formData.serviceId),
      // auditoriumBookingKey: Number(formData.auditoriumBookingNumber),
      // auditoriumKey: Number(formData.auditoriumId),
      // aadhaarNo: Number(formData.aadhaarNo),
      // landlineNo: Number(formData.landlineNo),
      // // mobile: Number(formData.mobile),
      // mobileNo: Number(formData.mobile),
      // depositAmount: Number(formData.depositAmount),
      // payRentAmount: Number(formData.payRentAmount),
      // pincode: Number(formData.pincode),
      // rentAmount: Number(formData.rentAmount),
      // extendedRentAmount: Number(formData.extendedRentAmount),
      // bankaAccountNo: Number(formData.bankaAccountNo),
      // // amountToBeReturned: Number(formData.amountToBeReturned),
      // amountToBeReturnedAfterBookingCancellation: Number(formData.amountToBeReturned),
      // notesheetReferenceNo: Number(formData.notesheet_ReferenceNumber),
      // id: null,
    };

    console.log("finalBodyForApi", finalBodyForApi);

    // axios
    //   .post(
    //     `http://192.168.68.145:9006/pabbm/api/trnAuditoriumBookingOnlineProcess/bookingCancellation`,
    //     finalBodyForApi,
    //   )
    //   .then((res) => {
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
          _loggedInUser == "cfcUser"
            ? router.push("../../../CFC_Dashboard")
            : router.push("/dashboardV3");
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
      maxWidth: 70,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      minWidth: 300,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "organizationName",
      headerName: <FormattedLabel id="organizationName" />,
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventTitle",
      headerName: <FormattedLabel id="eventTitle" />,
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "eventDate",
      headerName: <FormattedLabel id="eventDate" />,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "status",
      headerName: <FormattedLabel id="status" />,
      flex: 1,
      align: "center",
      minWidth: 250,
      headerAlign: "center",
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
            <Tooltip title={<FormattedLabel id="selectApplication" />}>
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
                  setBookedData(params.row);
                  if (accordionRef.current) {
                    accordionRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                  setShowAccordion(true);
                  reset({
                    ...params.row,
                    bookingDate: moment(
                      params.row.applicationDate,
                      "DD-MM-YYYY"
                    ).format("MM/DD/YYYY"),
                  });
                  setValue(
                    "auditoriumBookingNumber",
                    params.row.applicationNumber
                  );
                  setValue("auditoriumId", params.row.auditoriumId);
                  // setValue("serviceId", params.row.serviceId);
                  setValue("serviceId", 114);
                  // setValue("bookingDate", params.row.applicationDate);
                  setValue(
                    "applicantBuildingName",
                    params.row.applicantFlatBuildingName
                  );
                }}
              >
                <NotificationsNoneOutlinedIcon />{" "}
              </Button>
            </Tooltip>
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
            <PabbmHeader labelName="bookingCancellation" />
          </Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
                <Grid container style={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={4}
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
                        <FormattedLabel id="auditoriumBookingApplicationNumber" />
                      }
                      variant="outlined"
                      size="small"
                      placeholder="123456789"
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
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={4}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <FormControl
                      error={errors.searchByAuditoriumId}
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
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={field.value}
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
                        name="searchByAuditoriumId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>
                        {errors?.searchByAuditoriumId
                          ? errors.searchByAuditoriumId.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={4}
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
                        name="searchByEventDate"
                        control={control}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              disablePast
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  <FormattedLabel id="searchByEventDate" />
                                </span>
                              }
                              value={field.value || null}
                              onChange={(date) => {
                                field.onChange(date);
                              }}
                              center
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  size="small"
                                  fullWidth
                                  error={errors.searchByEventDate}
                                />
                              )}
                            />
                          </LocalizationProvider>
                        )}
                      />
                      <FormHelperText>
                        {errors?.searchByEventDate
                          ? errors.searchByEventDate.message
                          : null}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container sx={{ padding: "10px" }}>
                  <Grid
                    item
                    xs={4}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setValue("auditoriumBookingNumber", null);
                        setValue("searchByAuditoriumId", null);
                        setValue("searchByEventDate", null);
                      }}
                    >
                      <FormattedLabel id="clear" />
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    sx={{
                      display: "flex",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="success"
                      disabled={
                        !watch("auditoriumBookingNumber") &&
                        !watch("searchByAuditoriumId") &&
                        !watch("searchByEventDate")
                      }
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
                            ? enteredAuditoriumBookingNo
                            : null,
                          watch("searchByAuditoriumId")
                            ? watch("searchByAuditoriumId")
                            : null,
                          watch("searchByEventDate")
                            ? moment(watch("searchByEventDate")).format(
                                "DD-MM-YYYY"
                              )
                            : null
                        );

                        setOpenAccordion(true);
                      }}
                    >
                      <FormattedLabel id="searchByAuditoriumBookingApplicationNumber" />
                    </Button>
                  </Grid>
                </Grid>
                {/* ///////////////////// */}

                {showGridBox && (
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
                      density="compact"
                      autoHeight={true}
                      // rowHeight={50}
                      pagination
                      paginationMode="server"
                      // loading={data.loading}
                      rowCount={dataSource.totalRows}
                      rowsPerPageOptions={dataSource.rowsPerPageOptions}
                      page={dataSource.page}
                      pageSize={dataSource.pageSize}
                      rows={dataSource.rows}
                      columns={columns}
                      onPageChange={(_data) => {
                        getBookingCancellation(dataSource.pageSize, _data);
                      }}
                      onPageSizeChange={(_data) => {
                        console.log("222", _data);
                        // updateData("page", 1);
                        getBookingCancellation(_data, data.page);
                      }}
                    />
                  </Box>
                )}

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

                {showAccordion && (
                  <>
                    <Accordion
                      sx={{ padding: "10px" }}
                      expanded={openAccordion}
                      ref={accordionRef}
                    >
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
                        onClick={() => {
                          setOpenAccordion(!openAccordion);
                        }}
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
                                size="small"
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
                              size="small"
                              label={<FormattedLabel id="eventTitle" />}
                              variant="outlined"
                              disabled
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
                              size="small"
                              sx={{
                                width: "90%",
                              }}
                              variant="outlined"
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
                              size="small"
                              label={
                                <FormattedLabel id="organizationOwnerFirstName" />
                              }
                              disabled
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
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
                              size="small"
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
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

                              sx={{
                                width: "90%",
                              }}
                              InputLabelProps={{ shrink: true }}
                              variant="outlined"
                              size="small"
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
                              size="small"
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
                        </Grid>
                        <Grid container>
                          {bookedData?.timeSlotList &&
                            JSON.parse(bookedData?.timeSlotList)?.map((val) => {
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
                                              value={val.eventDate}
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
                              size="small"
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
                                    label={
                                      <FormattedLabel id="applicantCity" />
                                    }
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
                              label={<FormattedLabel id="applicantPinCode" />}
                              size="small"
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
                          <FormattedLabel id="cancellationRateChart" />
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid
                          container
                          sx={{
                            padding: "10px",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Typography sx={{ fontWeight: "600", color: "blue" }}>
                            कार्यक्रम रद्द झाल्यास / केल्यास, अनामत रक्कम
                            कपातीबाबत तपशील
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
                                बुकिंग शो तारखेच्या आधीच्या दिवसांच्या संख्येवर
                                रद्द करणे
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
                        {/* <Grid container sx={{ padding: "10px" }}>
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
                                    sx={{ minWidth: 220 }}
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    value={field.value}
                                    disabled
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="selectAuditorium" />
                                    }
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
                              size="small"
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
                                    disabled
                                    onChange={(value) => field.onChange(value)}
                                    label={
                                      <FormattedLabel id="selectService" />
                                    }
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
                                render={({ field }) => (
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <DatePicker
                                      // inputFormat="DD/MM/YYYY"
                                      inputFormat="dd/MM/yyyy"
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
                                          label={
                                            <FormattedLabel id="bookingDate" />
                                          }
                                          fullWidth
                                          error={errors.bookingDate}
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
                                  <LocalizationProvider
                                    dateAdapter={AdapterMoment}
                                  >
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
                        </Grid> */}

                        <Grid container sx={{ padding: "10px" }}>
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
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
                                <FormattedLabel
                                  id="citizenReasonForCancellation"
                                  required
                                />
                              }
                              variant="outlined"
                              {...register("citizenReasonForCancellation")}
                              error={!!errors.citizenReasonForCancellation}
                              helperText={
                                errors?.citizenReasonForCancellation
                                  ? errors.citizenReasonForCancellation.message
                                  : null
                              }
                            />
                          </Grid>
                          {/* <Grid
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
                              {...register("cancellationRemarkByCitizen")}
                              error={!!errors.cancellationRemarkByCitizen}
                              helperText={
                                errors?.cancellationRemarkByCitizen
                                  ? errors.cancellationRemarkByCitizen.message
                                  : null
                              }
                            />
                          </Grid> */}
                        </Grid>
                        <Grid
                          container
                          sx={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <Typography
                              sx={{ fontWeight: "600", color: "blue" }}
                            >
                              <FormattedLabel id="refundBreakupDetails" />
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
                                  <FormattedLabel id="srNo" />
                                </th>
                                <th
                                  style={{
                                    border: "1px solid #dddddd",
                                    textAlign: "center",
                                    backgroundColor: "gray",
                                    color: "white",
                                  }}
                                >
                                  <FormattedLabel id="content" />
                                </th>
                                <th
                                  style={{
                                    border: "1px solid #dddddd",
                                    textAlign: "center",

                                    backgroundColor: "gray",
                                    color: "white",
                                  }}
                                >
                                  <FormattedLabel id="amount" />
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
                                  <FormattedLabel id="depositAmountPaid" />
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #dddddd",
                                    textAlign: "right",
                                  }}
                                >
                                  {bookedData?.depositAmount?.toFixed(2)}
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
                                  <FormattedLabel id="cancellationCharges" />
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #dddddd",
                                    textAlign: "right",
                                  }}
                                >
                                  {moment().diff(
                                    moment(
                                      bookedData?.timeSlotList &&
                                        JSON.parse(bookedData?.timeSlotList)[0]
                                          ?.bookingDate,
                                      "YYYY-MM-DD"
                                    ),
                                    "days"
                                  ) < 7 &&
                                    (bookedData?.depositAmount * 0.7)?.toFixed(
                                      2
                                    )}
                                  {moment().diff(
                                    moment(
                                      bookedData?.timeSlotList &&
                                        JSON.parse(bookedData?.timeSlotList)[0]
                                          ?.bookingDate,
                                      "YYYY-MM-DD"
                                    ),
                                    "days"
                                  ) > 7 &&
                                    moment().diff(
                                      moment(
                                        bookedData?.timeSlotList &&
                                          JSON.parse(
                                            bookedData?.timeSlotList
                                          )[0]?.bookingDate,
                                        "YYYY-MM-DD"
                                      ),
                                      "days"
                                    ) < 30 &&
                                    (bookedData?.depositAmount * 0.5)?.toFixed(
                                      2
                                    )}
                                  {moment().diff(
                                    moment(
                                      bookedData?.timeSlotList &&
                                        JSON.parse(bookedData?.timeSlotList)[0]
                                          ?.bookingDate,
                                      "YYYY-MM-DD"
                                    ),
                                    "days"
                                  ) > 30 &&
                                    (bookedData?.depositAmount * 0.3)?.toFixed(
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
                                  3
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #dddddd",
                                    textAlign: "left",

                                    fontWeight: "600",
                                  }}
                                >
                                  <FormattedLabel id="totalRefundableAmount" />
                                </td>
                                <td
                                  style={{
                                    border: "1px solid #dddddd",
                                    textAlign: "right",

                                    fontWeight: "700",
                                  }}
                                >
                                  {(
                                    Number(bookedData?.depositAmount) -
                                    Number(
                                      moment().diff(
                                        moment(
                                          bookedData?.timeSlotList &&
                                            JSON.parse(
                                              bookedData?.timeSlotList
                                            )[0]?.bookingDate,
                                          "YYYY-MM-DD"
                                        ),
                                        "days"
                                      ) < 7 &&
                                        Number(bookedData?.depositAmount * 0.7)
                                    )
                                  )?.toFixed(2)}
                                </td>
                              </tr>
                            </table>
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: "700" }}>
                              <FormattedLabel id="termsAndConditions" />
                            </Typography>
                            <Typography>
                              <FormattedLabel id="certainFees" />
                            </Typography>
                            <Typography>
                              <FormattedLabel id="deductionAre" />
                            </Typography>
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
                    <Grid container style={{ padding: "10px" }}>
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
                        sm={2}
                        md={2}
                        lg={2}
                        xl={2}
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
                          color="error"
                          endIcon={<ExitToAppIcon />}
                          onClick={() => exitButton()}
                        >
                          <FormattedLabel id="exit" />
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider />
                  </>
                )}
              </form>
            </Slide>
          )}

          {/* <Grid container style={{ padding: "10px" }}>
            <Grid item xs={9}></Grid>
            <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
                size="small"
                disabled={buttonInputState}
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
                }}
              >
                <FormattedLabel id="add" />
              </Button>
            </Grid>
          </Grid>

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
          </Box> */}
        </Paper>
      )}
    </div>
  );
};

export default BookingCancellation;
