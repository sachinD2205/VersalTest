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
import { Controller, FormProvider, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/depositeRefundProcessing";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import styles from "../../../../styles/publicAuditorium/masters/[auditorium].module.css";
import ClearIcon from "@mui/icons-material/Clear";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import UploadButton from "../../../../components/fileUpload/UploadButton";
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
import MultipleUpload from "../depositeRefundProcessing/multipleUpload";
import FileTable from "../../../../components/publicAuditorium/FileTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
// import UploadButtonOP from "../../../../components/fileUpload/DocumentsUploadOP.js";
import UploadButtonOP from "../../../../components/publicAuditorium/DocumentsUploadOP";
import Document from "../../../../components/publicAuditorium/DepositeRefund/Document";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { catchExceptionHandlingMethod } from "../../../../util/util.js";

const DepositeRefundProcessingByApplicant = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   watch,
  //   setValue,
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
    getValues,
    watch,
    formState: { errors },
  } = methods;

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const user = useSelector((state) => state.user.user);
  console.log("useruser", user);

  const router = useRouter();

  const [buttonInputState, setButtonInputState] = useState();
  const [dataSource, setDataSource] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });
  const [isOpenCollapse, setIsOpenCollapse] = useState(true);
  const [showGridBox, setShowGridBox] = useState(false);
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
  const [departments, setDepartments] = useState([]);
  const [bankNames, setBankNames] = useState([]);

  const [bookingFor, setBookingFor] = useState("Booking For PCMC");
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [bookedData, setBookedData] = useState([]);

  const [files, setFiles] = useState([]);

  const [electrialInspectorCertificate, setElectrialInspectorCertificate] =
    useState(null);

  console.log("electrialInspectorCertificate", electrialInspectorCertificate);

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

  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  // const [slideChecked, setSlideChecked] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const accordionRef = useRef(null);

  let appName = "PABBM";
  let serviceName = "PABBM-DRPBA";

  const _columns = [
    // {
    //   headerName: "Sr.No",
    //   field: "srNo",
    //   width: 100,
    //   // flex: 1,
    // },
    {
      headerName: "File Name",
      field: "originalFileName",
      // File: "originalFileName",
      // width: 300,
      flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 140,
    },
    {
      headerName: "Uploaded By",
      field: "uploadedBy",
      flex: 1,
      // width: 300,
    },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            <IconButton
              color="primary"
              onClick={() => {
                console.log("fillleeeee", record.row);
                window.open(
                  `${urls.CFCURL}/file/preview?filePath=${record.row.filePath}`,
                  "_blank"
                );
              }}
            >
              <VisibilityIcon />
            </IconButton>
            {/* <IconButton
              color="primary"
              onClick={() => {
                axios.delete(`${urls.CFCURL}/file/discard?filePath=${record.row.filePath}`).then((res) => {
                  let attachementY = JSON.parse(localStorage.getItem("noticeAttachment"))
                    ?.filter((a) => a?.filePath != record.row.filePath)
                    ?.map((a) => a);
                  setAdditionalFiles(attachementY);
                  localStorage.removeItem("noticeAttachment");
                  localStorage.setItem("noticeAttachment", JSON.stringify(attachementY));
                });
              }}
            >
              <DeleteIcon color="error" />
            </IconButton> */}
          </>
        );
      },
    },
  ];

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

  const [_loggedInUser, set_LoggedInUser] = useState(null);

  useEffect(() => {
    set_LoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getAuditorium();
    getServices();
    getEvents();
    getBankName();
    getDepartments();
    // getNexAuditoriumBookingNumber();
    // getServices();
    getDocuments();
  }, []);

  useEffect(() => {
    setFinalFiles([...mainFiles, ...additionalFiles]);
    localStorage.setItem(
      "noticeAttachment",
      JSON.stringify([...mainFiles, ...additionalFiles])
    );
  }, [mainFiles, additionalFiles]);

  useEffect(() => {
    // getAuditoriumBooking();
    getDepositRefundProcessing();
  }, [auditoriums]);

  useEffect(() => {
    console.log("watch", watch("attachmentss"));
  }, [watch("attachmentss")]);

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
        console.log("respe aud", r);
        setAuditoriums(
          r.data.mstAuditoriumList.map((row, index) => ({
            id: row.id,
            auditoriumNameEn: row.auditoriumNameEn,
            auditoriumNameMr: row.auditoriumNameMr,
          }))
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getBankName = () => {
    axios
      .get(`${urls.CFCURL}/master/bank/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((r) => {
        setBankNames(r.data.bank);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const getDepositRefundProcessing = (_pageSize = 10, _pageNo = 0) => {
    axios
      .get(`${urls.PABBMURL}/trnDepositeRefundProcessByDepartment/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res, i) => {
        console.log("respe154", res);
        let result = res.data.trnDepositeRefundProcessByDepartmentList;

        let _res = result?.map((row, i) => ({
          id: row.id,
          srNo: _pageSize * _pageNo + i + 1,
          auditoriumName: row.auditoriumId
            ? auditoriums?.find((obj) => {
                return obj?.id == row.auditoriumId;
              })?.auditoriumName
            : "-",
          serviceId: row.serviceId,
          auditoriumBookingNo: row.auditoriumBookingNo,
          attachDocuments: row.attachDocuments,
          budgetingUnit: row.budgetingUnit,
          notesheetReferenceNo: row.notesheetReferenceNo,
          billDate: row.billDate ? row.billDate : "-",
          ecsPayment: row.ecsPayment,
          organizationName: row.organizationNameId
            ? row.organizationNameId
            : "-",
          title: row.title,
          organizationOwnerFirstName: row.organizationOwnerFirstName,
          organizationOwnerLastName: row.organizationOwnerLastName,
          organizationOwnerMiddleName: row.organizationOwnerMiddleName,
          flatBuildingNo: row.flatBuildingNo,
          buildingName: row.buildingName,
          roadName: row.roadName,
          landmark: row.landmark,
          pincode: row.pincode,
          aadhaarNo: row.aadhaarNo,
          mobileNo: row.mobile,
          landlineNo: row.landlineNo,
          emailAddress: row.emailAddress,
          depositDeceiptId: row.depositDeceiptId,
          depositedAmount: row.depositedAmount,
          depositReceiptDate: row.depositReceiptDate,
          eventDay: row.eventDay,
          eventTimeFrom: row.eventTimeFrom,
          eventTimeTo: row.eventTimeTo,
          termsAndCondition: row.termsAndCondition,
          managersDigitalSignature: row.managersDigitalSignature,
          bankAccountHolderName: row.bankAccountHolderName,
          bankAccountNo: row.bankAccountNo,
          typeOfBankAccountKey: row.typeOfBankAccountKey,
          typeOfBankAccountName: row.typeOfBankAccountName,
          bankNameId: row.bankNameId,
          bankName: row.bankName,
          bankAddress: row.bankAddress,
          ifscCode: row.ifscCode,
          micrCode: row.micrCode,
          activeFlag: row.activeFlag,
          status: row.activeFlag === "Y" ? "Active" : "Inactive",
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

  const getAuditoriumBookingDetailsById = (
    applicationNum,
    auditoriumId,
    eveDate,
    _pageSize = 10,
    _pageNo = 0,
    _sortBy = "id",
    _sortDir = "desc"
  ) => {
    setLoading(true);
    axios
      .get(
        // `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getApplicationDetailsForDepositeRefund`,
        {
          params: {
            auditoriumId: auditoriumId ? auditoriumId : null,
            applicationNumber: applicationNum ? applicationNum : null,
            eventDate: eveDate ? eveDate : null,
            createdUserId: user?.id ? user?.id : null,
            pageSize: _pageSize,
            pageNo: _pageNo,
            sortBy: _sortBy,
            sortDir: _sortDir,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        console.log("Byyye id", r);
        if (r.status === 200) {
          setShowGridBox(true);
          console.log("bankDao", r);
          if (r?.data?.trnAuditoriumBookingOnlineProcessList?.length == 0) {
            setShowGridBox(false);
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
                attachmentss: watch("attachmentss"),
              };
            }
          );
          setDataSource({
            rows: _res,
            totalRows: r.data.totalElements,
            rowsPerPageOptions: [10, 20, 50, 100],
            pageSize: r.data.pageSize,
            page: r.data.pageNo,
          });
          // reset(r.data);
          // setValue("serviceId", 122);
          // setValue(
          //   "organizationName",
          //   r.data.organizationName ? r.data.organizationName : "-"
          // );
          // setValue("title", r.data.title ? r.data.title : "-");
          // setValue(
          //   "flatBuildingNo",
          //   r.data.flatBuildingNo ? r.data.flatBuildingNo : "-"
          // );
          // setValue(
          //   "organizationOwnerFirstName",
          //   r.data.organizationOwnerFirstName
          //     ? r.data.organizationOwnerFirstName
          //     : "-"
          // );
          // setValue(
          //   "organizationOwnerMiddleName",
          //   r.data.organizationOwnerMiddleName
          //     ? r.data.organizationOwnerMiddleName
          //     : "-"
          // );
          // setValue(
          //   "organizationOwnerLastName",
          //   r.data.organizationOwnerLastName
          //     ? r.data.organizationOwnerLastName
          //     : "-"
          // );
          // setValue(
          //   "buildingName",
          //   r.data.buildingName ? r.data.buildingName : "-"
          // );
          // setValue("roadName", r.data.roadName ? r.data.roadName : "-");
          // setValue("landmark", r.data.landmark ? r.data.landmark : "-");
          // setValue("pincode", r.data.pincode ? r.data.pincode : "-");
          // setValue("aadhaarNo", r.data.aadhaarNo ? r.data.aadhaarNo : "-");
          // setValue("mobile", r.data.mobile ? r.data.mobile : "-");
          // setValue("landlineNo", r.data.landlineNo ? r.data.landlineNo : "-");
          // setValue(
          //   "emailAddress",
          //   r.data.emailAddress ? r.data.emailAddress : "-"
          // );
          // setValue(
          //   "depositeReceiptNo",
          //   r.data.depositDeceiptId ? r.data.depositDeceiptId : "-"
          // );
          // setValue(
          //   "depositeAmount",
          //   r.data.depositedAmount ? r.data.depositedAmount : "-"
          // );
          // setValue(
          //   "eventTimeFrom",
          //   r.data.eventTimeFrom ? r.data.eventTimeFrom : "-"
          // );
          // setValue(
          //   "eventTimeTo",
          //   r.data.eventTimeTo ? r.data.eventTimeTo : "-"
          // );
          // setValue(
          //   "depositeReceiptDate",
          //   r.data.depositReceiptDate ? r.data.depositReceiptDate : "-"
          // );

          // setValue(
          //   "bankAccountHolderName",
          //   r?.data?.paymentDao?.bankAccountHolderName
          //     ? r?.data?.paymentDao?.bankAccountHolderName
          //     : "-"
          // );
          // setValue(
          //   "bankaAccountNo",
          //   r?.data?.paymentDao?.bankaAccountNo
          //     ? r?.data?.paymentDao?.bankaAccountNo
          //     : "-"
          // );
          // setValue(
          //   "typeOfBankAccountId",
          //   r?.data?.paymentDao?.typeOfBankAccountId
          //     ? r?.data?.paymentDao?.typeOfBankAccountId
          //     : "-"
          // );
          // setValue(
          //   "bankNameId",
          //   r?.data?.paymentDao?.bankNameId
          //     ? r?.data?.paymentDao?.bankNameId
          //     : "-"
          // );
          // setValue(
          //   "bankAddress",
          //   r?.data?.paymentDao?.bankAddress
          //     ? r?.data?.paymentDao?.bankAddress
          //     : "-"
          // );
          // setValue(
          //   "ifscCode",
          //   r?.data?.paymentDao?.ifscCode ? r?.data?.paymentDao?.ifscCode : "-"
          // );
          // setValue(
          //   "micrCode",
          //   r?.data?.paymentDao?.micrCode ? r?.data?.paymentDao?.micrCode : "-"
          // );
          // setValue(
          //   "event",
          //   r?.data?.paymentDao?.event ? r?.data?.paymentDao?.event : "-"
          // );
          // setValue(
          //   "applicantBuildingName",
          //   r?.data?.applicantFlatBuildingName
          //     ? r?.data?.applicantFlatBuildingName
          //     : "-"
          // );
          // setValue(
          //   "bookingDate",
          //   r?.data?.applicationDate ? r?.data?.applicationDate : "-"
          // );
          // setValue(
          //   "eventTitle",
          //   r?.data?.eventTitle ? r?.data?.eventTitle : "-"
          // );

          setLoading(false);
        } else {
          setLoading(false);
          toast("Not Found !", {
            type: "error",
          });
        }
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
            eventDate: val.eventDate ? val.eventDate : "-",
            mobile: val.mobile ? val.mobile : "-",
            organizationName: val.organizationName ? val.organizationName : "-",
            organizationOwnerFirstName: val.organizationOwnerFirstName
              ? val.organizationOwnerFirstName +
                " " +
                val.organizationOwnerLastName
              : "-",
            attachmentss: watch("attachmentss"),
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
                getBillType();
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
                getBillType();
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
    _loggedInUser == "cfcUser"
      ? router.push("../../../CFC_Dashboard")
      : router.push("/dashboardV3");
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);

    sweetAlert({
      title: language === "en" ? "Deposit Refund" : "अनामत रक्कम परतावा",
      text:
        language === "en"
          ? "Do you really want to apply for deposit refund?"
          : "तुम्हाला खरोखरच अनामत रक्कम परताव्यासाठी अर्ज करायचा आहे?",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((will) => {
      if (will) {
        // const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
        let loggedInUser = localStorage.getItem("loggedInUser");

        const finalBodyForApi = {
          // ...formData,
          // ...bookedData,
          isApproved: true,
          applicationNumberKey: bookedData?.applicationNumber,
          attachDocuments: electrialInspectorCertificate,
          // attachments:
          //   watch("attachmentss") == undefined ? [] : watch("attachmentss"),
          attachments:
            watch("attachmentss") == undefined
              ? []
              : watch("attachmentss").map((attachment) => {
                  return {
                    ...attachment,
                    filePath: attachment?.filePathEncrypted,
                  };
                }),
          processType: "D",
          designation: "Citizen",
          actionBy: user?.firstName + " " + user?.surname,
          createdUserId: user?.id,
          serviceId: 122,
          // auditoriumBookingNo: Number(formData.auditoriumBookingNumber),
          applicantType:
            loggedInUser == "citizenUser"
              ? 1
              : loggedInUser == "departmentUser"
              ? 3
              : 2,
        };

        console.log("finalBodyForApi", finalBodyForApi);

        axios
          .post(
            `${urls.PABBMURL}/trnDepositeRefundProcessByDepartment/save`,
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
                    "Updated!",
                    "Record Updated successfully !",
                    "success"
                  )
                : sweetAlert(
                    "Saved!",
                    "Record Saved successfully !",
                    "success"
                  );
              getAuditoriumBooking();
              _loggedInUser == "cfcUser"
                ? router.push("../../../CFC_Dashboard")
                : router.push("/dashboardV3");
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
      } else {
      }
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
            <Tooltip title="Select Application">
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
                  setShowFields(true);
                  if (accordionRef.current) {
                    accordionRef.current.scrollIntoView({ behavior: "smooth" });
                  }
                  // reset({
                  //   ...params.row,
                  //   bookingDate: moment(
                  //     params.row.applicationDate,
                  //     "DD-MM-YYYY"
                  //   ).format("MM/DD/YYYY"),
                  // });
                  reset(params.row);
                  // reset(r.data);
                  setValue("serviceId", 122);
                  setValue(
                    "organizationName",
                    params.row.organizationName
                      ? params.row.organizationName
                      : "-"
                  );
                  setValue("title", params.row.title ? params.row.title : "-");
                  setValue(
                    "flatBuildingNo",
                    params.row.flatBuildingNo ? params.row.flatBuildingNo : "-"
                  );
                  setValue(
                    "organizationOwnerFirstName",
                    params.row.organizationOwnerFirstName
                      ? params.row.organizationOwnerFirstName
                      : "-"
                  );
                  setValue(
                    "organizationOwnerMiddleName",
                    params.row.organizationOwnerMiddleName
                      ? params.row.organizationOwnerMiddleName
                      : "-"
                  );
                  setValue(
                    "organizationOwnerLastName",
                    params.row.organizationOwnerLastName
                      ? params.row.organizationOwnerLastName
                      : "-"
                  );
                  setValue(
                    "buildingName",
                    params.row.buildingName ? params.row.buildingName : "-"
                  );
                  setValue(
                    "roadName",
                    params.row.roadName ? params.row.roadName : "-"
                  );
                  setValue(
                    "landmark",
                    params.row.landmark ? params.row.landmark : "-"
                  );
                  setValue(
                    "pincode",
                    params.row.pincode ? params.row.pincode : "-"
                  );
                  setValue(
                    "aadhaarNo",
                    params.row.aadhaarNo ? params.row.aadhaarNo : "-"
                  );
                  setValue(
                    "mobile",
                    params.row.mobile ? params.row.mobile : "-"
                  );
                  setValue(
                    "landlineNo",
                    params.row.landlineNo ? params.row.landlineNo : "-"
                  );
                  setValue(
                    "emailAddress",
                    params.row.emailAddress ? params.row.emailAddress : "-"
                  );
                  setValue(
                    "depositeReceiptNo",
                    params.row.depositDeceiptId
                      ? params.row.depositDeceiptId
                      : "-"
                  );
                  setValue(
                    "depositeAmount",
                    params.row.depositedAmount
                      ? params.row.depositedAmount
                      : "-"
                  );
                  setValue(
                    "eventTimeFrom",
                    params.row.eventTimeFrom ? params.row.eventTimeFrom : "-"
                  );
                  setValue(
                    "eventTimeTo",
                    params.row.eventTimeTo ? params.row.eventTimeTo : "-"
                  );
                  setValue(
                    "depositeReceiptDate",
                    params.row.depositReceiptDate
                      ? params.row.depositReceiptDate
                      : "-"
                  );

                  setValue(
                    "bankAccountHolderName",
                    params.row?.paymentDao?.bankAccountHolderName
                      ? params.row?.paymentDao?.bankAccountHolderName
                      : "-"
                  );
                  setValue(
                    "bankaAccountNo",
                    params.row?.paymentDao?.bankaAccountNo
                      ? params.row?.paymentDao?.bankaAccountNo
                      : "-"
                  );
                  setValue(
                    "typeOfBankAccountId",
                    params.row?.paymentDao?.typeOfBankAccountId
                      ? params.row?.paymentDao?.typeOfBankAccountId
                      : "-"
                  );
                  setValue(
                    "bankNameId",
                    params.row?.paymentDao?.bankNameId
                      ? params.row?.paymentDao?.bankNameId
                      : "-"
                  );
                  setValue(
                    "bankAddress",
                    params.row?.paymentDao?.bankAddress
                      ? params.row?.paymentDao?.bankAddress
                      : "-"
                  );
                  setValue(
                    "ifscCode",
                    params.row?.paymentDao?.ifscCode
                      ? params.row?.paymentDao?.ifscCode
                      : "-"
                  );
                  setValue(
                    "micrCode",
                    params.row?.paymentDao?.micrCode
                      ? params.row?.paymentDao?.micrCode
                      : "-"
                  );
                  setValue(
                    "event",
                    params.row?.paymentDao?.event
                      ? params.row?.paymentDao?.event
                      : "-"
                  );
                  setValue(
                    "applicantBuildingName",
                    params.row?.applicantFlatBuildingName
                      ? params.row?.applicantFlatBuildingName
                      : "-"
                  );
                  setValue(
                    "bookingDate",
                    params.row?.applicationDate
                      ? params.row?.applicationDate
                      : "-"
                  );
                  setValue(
                    "eventTitle",
                    params.row?.eventTitle ? params.row?.eventTitle : "-"
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

  const columnsF = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
    },
    {
      // field: language == "en" ? "documentChecklistEn" : "documentChecklistMr",
      field: "documentChecklistEn",
      headerName: "Document Name",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Upload Document",
      flex: 1,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <>
            <UploadButtonOP
              appName={appName}
              serviceName={serviceName}
              fileDtl={getValues(
                `attachmentss[${params.row.srNo - 1}].filePath`
              )}
              fileKey={params.row.srNo - 1}
              showDel={true}
            />
          </>
        );
      },
    },
  ];

  console.log("getValues", getValues());

  const getDocuments = () => {
    setLoading(true);
    axios
      .get(
        `${
          urls.CFCURL
        }/master/serviceWiseChecklist/getAllByServiceId?serviceId=${122}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        console.log("122", res);
        setValue(
          "attachmentss",
          res?.data?.serviceWiseChecklist?.map((r, ind) => {
            return {
              ...r,
              docKey: r.document,
              id: data?.attachments?.find((dd) => dd.docKey == r.document)?.id
                ? data?.attachments?.find((dd) => dd.docKey == r.document)?.id
                : null,
              status: r.isDocumentMandetory ? "Mandatory" : "Not Mandatory",
              srNo: ind + 1,
              filePath: data?.attachments?.find((dd) => dd.docKey == r.document)
                ?.filePath
                ? data?.attachments?.find((dd) => dd.docKey == r.document)
                    ?.filePath
                : null,
            };
          })
        );
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <Paper>
          <Box>
            <PabbmHeader labelName="depositRefundProcess" />
          </Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <FormProvider {...methods}>
                  <form onSubmit={handleSubmit(onSubmitForm)}>
                    <Grid
                      container
                      style={{
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Grid item xs={6} sm={6} md={6} lg={6} xl={6}></Grid>
                    </Grid>
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
                            <FormattedLabel id="auditoriumBookingNumber" />
                          }
                          variant="outlined"
                          size="small"
                          sx={{ width: "90%" }}
                          InputLabelProps={{
                            shrink: watch("auditoriumBookingNumber")
                              ? true
                              : false,
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
                                      <MenuItem
                                        key={index}
                                        value={auditorium.id}
                                      >
                                        {language == "en"
                                          ? auditorium.auditoriumNameEn
                                          : auditorium.auditoriumNameMr}
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
                        <FormControl
                          sx={{ width: "90%" }}
                          error={errors.eventDate}
                        >
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
                          }}
                        >
                          <FormattedLabel id="searchByAuditoriumBookingNumber" />
                        </Button>
                      </Grid>
                    </Grid>

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
                          pagination
                          paginationMode="server"
                          rowCount={dataSource.totalRows}
                          rowsPerPageOptions={dataSource.rowsPerPageOptions}
                          page={dataSource.page}
                          pageSize={dataSource.pageSize}
                          rows={dataSource.rows}
                          columns={columns}
                          onPageChange={(_data) => {
                            // getBillType(dataSource.pageSize, _data);
                          }}
                          onPageSizeChange={(_data) => {
                            console.log("222", _data);
                            // getBillType(_data, dataSource.page);
                          }}
                        />
                      </Box>
                    )}

                    {showFields && (
                      <>
                        <Accordion sx={{ padding: "10px" }}>
                          <AccordionSummary
                            sx={{
                              backgroundColor: "#0070f3",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#0070f3"
                          >
                            <Typography>
                              <FormattedLabel id="details" />
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
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
                                }}
                              >
                                <FormControl
                                  error={errors.auditoriumId}
                                  size="small"
                                  variant="outlined"
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
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label={
                                          <FormattedLabel id="selectAuditorium" />
                                        }
                                      >
                                        {auditoriums &&
                                          auditoriums.map(
                                            (auditorium, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={auditorium.id}
                                                >
                                                  {language == "en"
                                                    ? auditorium.auditoriumNameEn
                                                    : auditorium.auditoriumNameMr}
                                                </MenuItem>
                                              );
                                            }
                                          )}
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
                                lg={4}
                                xl={4}
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <FormControl
                                  variant="outlined"
                                  size="small"
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
                                        disabled
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
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
                                              {language == "en"
                                                ? service.serviceName
                                                : service.serviceNameMr}
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
                                {/* <FormControl variant="outlined" sx={{ width: "90%" }} error={!!errors.serviceId}>
                      <InputLabel id="demo-simple-select-outlined-label">Event</InputLabel>
                      <Controller
                        render={({ field }) => (
                          <Select
                            sx={{ minWidth: 220 }}
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            disabled
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            label="Event"
                          >
                            {events &&
                              events.map((service, index) => (
                                <MenuItem
                                  key={index}
                                  sx={{
                                    display: service.eventNameEn ? "flex" : "none",
                                  }}
                                  value={service.id}
                                >
                                  {service.eventNameEn}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                        name="serviceId"
                        control={control}
                        defaultValue=""
                      />
                      <FormHelperText>{errors?.serviceId ? errors.serviceId.message : null}</FormHelperText>
                    </FormControl> */}
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
                                  alignItems: "end",
                                }}
                              >
                                <FormControl
                                  sx={{ width: "90%" }}
                                  size="small"
                                  error={errors.bookingDate}
                                >
                                  <Controller
                                    name="bookingDate"
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
                                              {
                                                <FormattedLabel id="bookingDate" />
                                              }
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
                                  size="small"
                                  disabled
                                  InputLabelProps={{ shrink: true }}
                                  {...register("eventTitle")}
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
                                  sx={{ width: "90%" }}
                                  id="outlined-basic"
                                  label={<FormattedLabel id="applicantName" />}
                                  variant="outlined"
                                  disabled
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  {...register("applicantName")}
                                  error={!!errors.applicantName}
                                  helperText={
                                    errors?.applicantName
                                      ? errors.applicantName.message
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
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#0070f3"
                          >
                            <Typography>
                              {<FormattedLabel id="attachment" />}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid container sx={{ padding: "10px" }}>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                              >
                                {/* <MultipleUpload files={files} setFiles={setFiles} /> */}

                                {/* <FileTable
                          appName={appName} //Module Name
                          serviceName={serviceName} //Transaction Name
                          fileName={attachedFile} //State to attach file
                          filePath={setAttachedFile} // File state upadtion function
                          newFilesFn={setAdditionalFiles} // File data function
                          columns={_columns} //columns for the table
                          rows={finalFiles} //state to be displayed in table
                          uploading={setUploading}
                        /> */}

                                {/* <Document /> */}
                                <DataGrid
                                  getRowId={(row) => row.srNo}
                                  disableColumnFilter
                                  disableColumnSelector
                                  disableDensitySelector
                                  disableExport
                                  hideFooter
                                  components={{ Toolbar: GridToolbar }}
                                  autoHeight
                                  density="compact"
                                  sx={{
                                    backgroundColor: "white",
                                    // paddingLeft: "2%",
                                    // paddingRight: "2%",
                                    boxShadow: 2,
                                    border: 1,
                                    borderColor: "primary.light",
                                    "& .MuiDataGrid-cell:hover": {},
                                    "& .MuiDataGrid-row:hover": {
                                      backgroundColor: "#E1FDFF",
                                    },
                                    "& .MuiDataGrid-columnHeadersInner": {
                                      backgroundColor: "#87E9F7",
                                    },
                                  }}
                                  rows={
                                    watch(`attachmentss`)
                                      ? watch(`attachmentss`)
                                      : []
                                  }
                                  columns={columnsF}
                                />
                              </Grid>

                              {/* <Grid item xs={2}>
                    <input accept="image/*" multiple type="file" />
                  </Grid> */}
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
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            backgroundColor="#0070f3"
                          >
                            <Typography>
                              <FormattedLabel id="bankDetails" />{" "}
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
                                  label={
                                    <FormattedLabel id="bankAccountHolderName" />
                                  }
                                  variant="outlined"
                                  size="small"
                                  disabled
                                  InputLabelProps={{ shrink: true }}
                                  {...register("bankAccountHolderName")}
                                  error={!!errors.bankAccountHolderName}
                                  helperText={
                                    errors?.bankAccountHolderName
                                      ? errors.bankAccountHolderName.message
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
                                  label={<FormattedLabel id="bankAccountNo" />}
                                  variant="outlined"
                                  disabled
                                  sx={{
                                    width: "90%",
                                  }}
                                  size="small"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  {...register("bankaAccountNo")}
                                  error={!!errors.bankaAccountNo}
                                  helperText={
                                    errors?.bankaAccountNo
                                      ? errors.bankaAccountNo.message
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
                                  variant="outlined"
                                  error={!!errors.typeOfBankAccountId}
                                  sx={{ width: "90%" }}
                                  size="small"
                                >
                                  <InputLabel id="demo-simple-select-outlined-label">
                                    <FormattedLabel id="typeOfBankAccount" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        sx={{ minWidth: 220 }}
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={field.value}
                                        disabled
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label="Type of bank account"
                                      >
                                        {[
                                          { id: 1, type: "Current" },
                                          { id: 2, type: "Saving" },
                                          { id: 3, type: "Other" },
                                        ].map((bank, index) => (
                                          <MenuItem key={index} value={bank.id}>
                                            {bank.type}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    )}
                                    name="typeOfBankAccountId"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.typeOfBankAccountId
                                      ? errors.typeOfBankAccountId.message
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
                                  variant="outlined"
                                  size="small"
                                  error={!!errors.bankNameId}
                                  sx={{ width: "90%" }}
                                >
                                  <InputLabel id="demo-simple-select-outlined-label">
                                    <FormattedLabel id="bankName" />
                                  </InputLabel>
                                  <Controller
                                    render={({ field }) => (
                                      <Select
                                        sx={{ minWidth: 220 }}
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        value={field.value}
                                        d
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label={<FormattedLabel id="bankName" />}
                                        disabled
                                      >
                                        {bankNames?.map((bank, index) => (
                                          <MenuItem
                                            sx={{
                                              display: bank.bankName
                                                ? "flex"
                                                : "none",
                                            }}
                                            key={index}
                                            value={bank.id}
                                          >
                                            {bank.bankName}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    )}
                                    name="bankNameId"
                                    control={control}
                                    defaultValue=""
                                  />
                                  <FormHelperText>
                                    {errors?.bankNameId
                                      ? errors.bankNameId.message
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
                                  label={<FormattedLabel id="bankAddress" />}
                                  variant="outlined"
                                  size="small"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  disabled
                                  {...register("bankAddress")}
                                  error={!!errors.bankAddress}
                                  helperText={
                                    errors?.bankAddress
                                      ? errors.bankAddress.message
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
                                  label={<FormattedLabel id="ifscCode" />}
                                  disabled
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  size="small"
                                  variant="outlined"
                                  {...register("ifscCode")}
                                  error={!!errors.ifscCode}
                                  helperText={
                                    errors?.ifscCode
                                      ? errors.ifscCode.message
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
                                  disabled
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  size="small"
                                  label={<FormattedLabel id="micrCode" />}
                                  variant="outlined"
                                  {...register("micrCode")}
                                  error={!!errors.micrCode}
                                  helperText={
                                    errors?.micrCode
                                      ? errors.micrCode.message
                                      : null
                                  }
                                />
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>

                        <Accordion sx={{ padding: "10px" }} ref={accordionRef}>
                          <AccordionSummary
                            sx={{
                              backgroundColor: "#0070f3",
                              color: "white",
                              textTransform: "uppercase",
                            }}
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
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
                                          {departments?.map(
                                            (department, index) => {
                                              return (
                                                <MenuItem
                                                  key={index}
                                                  value={department.id}
                                                >
                                                  {department.department}
                                                </MenuItem>
                                              );
                                            }
                                          )}
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
                                    label={
                                      <FormattedLabel id="organizationName" />
                                    }
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
                                  label={
                                    <FormattedLabel id="flat_buildingNo" />
                                  }
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
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
                                  {...register("organizationOwnerFirstName")}
                                  error={!!errors.organizationOwnerFirstName}
                                  helperText={
                                    errors?.organizationOwnerFirstName
                                      ? errors.organizationOwnerFirstName
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
                                      ? errors.organizationOwnerMiddleName
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
                                  disabled
                                  size="small"
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
                                    errors?.pincode
                                      ? errors.pincode.message
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
                                    errors?.mobile
                                      ? errors.mobile.message
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
                                  disabled
                                  size="small"
                                  label={<FormattedLabel id="emailAddress" />}
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
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
                                JSON.parse(bookedData?.timeSlotList)?.map(
                                  (val) => {
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
                                            value={moment(
                                              val.bookingDate
                                            ).format("dddd")}
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
                                )}
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
                                  label={<FormattedLabel id="depositAmount" />}
                                  variant="outlined"
                                  disabled
                                  size="small"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  {...register("depositAmount")}
                                  error={!!errors.depositAmount}
                                  helperText={
                                    errors?.depositAmount
                                      ? errors.depositAmount.message
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
                                    <FormattedLabel id="refundableAmount" />
                                  }
                                  variant="outlined"
                                  disabled
                                  size="small"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  {...register("refundableAmount")}
                                  error={!!errors.refundableAmount}
                                  helperText={
                                    errors?.refundableAmount
                                      ? errors.refundableAmount.message
                                      : null
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
                          id="outlined-basic"
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
                            expandIcon={
                              <ExpandMoreIcon sx={{ color: "white" }} />
                            }
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
                                  label={
                                    <FormattedLabel id="applicantMobileNo" />
                                  }
                                  sx={{
                                    width: "90%",
                                  }}
                                  disabled
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  variant="outlined"
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
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  id="outlined-basic"
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
                                  label={
                                    <FormattedLabel id="applicantFlatHouseNo" />
                                  }
                                  sx={{
                                    width: "90%",
                                  }}
                                  disabled
                                  size="small"
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
                                  label={
                                    <FormattedLabel id="applicantLandmark" />
                                  }
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
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
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
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label={
                                          <FormattedLabel id="applicantState" />
                                        }
                                        disabled
                                        InputLabelProps={{ shrink: true }}
                                      >
                                        {["Maharashtra", "Other"].map(
                                          (state, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={state}
                                              >
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
                                        onChange={(value) =>
                                          field.onChange(value)
                                        }
                                        label={
                                          <FormattedLabel id="applicantCity" />
                                        }
                                      >
                                        {["Pune", "Other"].map(
                                          (city, index) => {
                                            return (
                                              <MenuItem
                                                key={index}
                                                value={city}
                                              >
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
                                  label={
                                    <FormattedLabel id="applicantPinCode" />
                                  }
                                  variant="outlined"
                                  size="small"
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
                          </AccordionDetails>
                        </Accordion>

                        <Divider />
                      </>
                    )}
                  </form>
                </FormProvider>
              </div>
            </Slide>
          )}

          {/* <Grid container style={{ padding: "10px" }}>
            <Grid item xs={9}></Grid>
            <Grid item xs={2} style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                type="primary"
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
          </Grid> */}
        </Paper>
      )}
    </div>
  );
};

export default DepositeRefundProcessingByApplicant;
