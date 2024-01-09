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
import React, { useEffect, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
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
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Loader from "../../../../containers/Layout/components/Loader";
import { toast } from "react-toastify";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import DoneIcon from "@mui/icons-material/Done";
import MultipleUpload from "./multipleUpload";
import FileTable from "../../../../components/publicAuditorium/FileTable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PabbmHeader from "../../../../components/publicAuditorium/pabbmHeader";
import { useRouter } from "next/router";
import { catchExceptionHandlingMethod } from "../../../../util/util";
import {
  DecryptData,
  EncryptData,
} from "../../../../components/common/EncryptDecrypt";

const DepositeRefundProcessing = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      levelsOfRolesDaoList: [
        { equipment: "", quantity: "", rate: "", total: "" },
      ],
      extraEqList: [{ equipment: "", quantity: "", rate: "", total: "" }],
    },
  });

  // const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
  //   name: "levelsOfRolesDaoList",
  //   control,
  // });

  const {
    fields: fieldsList1,
    remove: removeList1,
    append: appemdList1,
  } = useFieldArray({ control, name: "levelsOfRolesDaoList" });

  const {
    fields: fieldsList2,
    remove: removeList2,
    append: appemdList2,
  } = useFieldArray({ control, name: "extraEqList" });

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const router = useRouter();

  const [equipments, setEquipments] = useState([]);
  const [equipmentCharges, setEquipmentCharges] = useState([]);

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
  const [bankNames, setBankNames] = useState([]);

  const [bookingFor, setBookingFor] = useState("Booking For PCMC");
  const [loading, setLoading] = useState(false);

  const [events, setEvents] = useState([]);
  const [bookedData, setBookedData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const [extraEquipmentAmount, setExtraEquipmentAmount] = useState();

  const [files, setFiles] = useState([]);

  const [electrialInspectorCertificate, setElectrialInspectorCertificate] =
    useState(null);

  console.log("electrialInspectorCertificate", electrialInspectorCertificate);

  const [attachedFile, setAttachedFile] = useState("");
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const [mainFiles, setMainFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [finalFiles, setFinalFiles] = useState([]);
  // const [slideChecked, setSlideChecked] = useState(false);
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

  let appName = "PABBM";
  let serviceName = "PABBM-DRPBA";

  const _columns = [
    {
      headerName: "Sr.No",
      field: "srNo",
      flex: 0.3,
      // flex: 1,
    },
    {
      headerName: "File Name",
      field: "documentChecklistEn",
      flex: 0.7,
    },
    {
      headerName: "File Type",
      field: "extension",
      width: 140,
    },
    // {
    //   headerName: "Uploaded By",
    //   field: "uploadedBy",
    //   flex: 1,
    // },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      // flex: 1,

      renderCell: (record) => {
        return (
          <>
            {record?.row?.filePath != null && (
              <IconButton
                color="primary"
                onClick={async () => {
                  setLoading(true);
                  const DecryptPhoto = await DecryptData(
                    "passphraseaaaaaaaaupload",
                    record.row.filePath
                  );

                  const ciphertext = await EncryptData(
                    "passphraseaaaaaaapreview",
                    DecryptPhoto
                  );
                  const url = `${urls.CFCURL}/file/previewNewEncrypted?filePath=${ciphertext}`;
                  axios
                    .get(url, {
                      headers: {
                        Authorization: `Bearer ${user.token}`,
                      },
                    })
                    .then((r) => {
                      setLoading(false);
                      console.log("rrr", r);
                      if (r?.data?.mimeType == "application/pdf") {
                        const byteCharacters = atob(r?.data?.fileName);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                          byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], {
                          type: "application/pdf",
                        });
                        const url = URL.createObjectURL(blob);
                        const newTab = window.open();
                        newTab.location.href = url;
                      }
                      // for img
                      else if (r?.data?.mimeType == "image/jpeg") {
                        const imageUrl = `data:image/png;base64,${r?.data?.fileName}`;
                        const newTab = window.open();
                        newTab.document.body.innerHTML = `<img src="${imageUrl}" />`;
                      } else {
                        const dataUrl = `data:${r?.data?.mimeType};base64,${r?.data?.fileName}`;
                        const newTab = window.open();
                        newTab.document.write(`
                          <html>
                            <body style="margin: 0;">
                              <iframe src="${dataUrl}" width="100%" height="100%" frameborder="0"></iframe>
                            </body>
                          </html>
                        `);
                      }
                    })
                    .catch((error) => {
                      setLoading(false);
                      console.log("CatchPreviewApi", error);
                    });
                }}
              >
                <VisibilityIcon />
              </IconButton>
            )}

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

  const [applicationHistoryData, setApplicationHistoryData] = useState({
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [10, 20, 50, 100],
    pageSize: 10,
    page: 1,
  });

  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  );

  let user = useSelector((state) => state.user.user);

  const authority = user?.menus?.find((r) => {
    return r.id == selectedMenuFromDrawer;
  })?.roles;

  console.log("authority", authority);

  let abc = [];

  useEffect(() => {
    // getZoneName();
    // getWardNames();
    getAuditorium();
    getServices();
    getEvents();
    getBankName();
    // getNexAuditoriumBookingNumber();
    // getServices();
  }, []);

  useEffect(() => {
    // getAuditoriumBooking();
    getDepositRefundProcessing();
  }, [auditoriums]);

  useEffect(() => {
    getEquipment();
    getEquipmentCharges();
    getDepartments();
  }, []);

  useEffect(() => {
    console.log("bookedData", bookedData);
  }, [bookedData]);

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

  const getEquipmentCharges = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCharges/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res equipment charges", res);
        setEquipmentCharges(res?.data?.mstEquipmentChargesList);
      })
      ?.catch((err) => {
        console.log("err", err);
        setLoading(false);
        callCatchMethod(err, language);
      });
  };

  const appendUI = () => {
    appemdList1({
      equipment: "",
      quantity: "",
      rate: "",
      total: "",
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
        console.log("respe aud", r);
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
    setLoading(true);
    axios
      .get(`${urls.PABBMURL}/trnDepositeRefundProcessByDepartment/getAll`, {
        // axios
        //   .get(`http://192.168.68.145:9006/pabbm/api/trnDepositeRefundProcessByDepartment/getAll`, {
        params: {
          pageSize: _pageSize,
          pageNo: _pageNo,
          sortDir: "dsc",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res, i) => {
        setLoading(false);
        console.log("respe154", res);
        let result = res.data.trnDepositeRefundProcessByDepartmentList;

        let _res = result?.map((row, i) => {
          console.log("second", row);
          return {
            ...row,
            id: row.id,
            srNo: _pageSize * _pageNo + i + 1,
            auditoriumName: row?.trnAuditoriumBookingOnlineProcess?.auditoriumId
              ? auditoriums?.find((obj) => {
                  return (
                    obj?.id ==
                    row?.trnAuditoriumBookingOnlineProcess?.auditoriumId
                  );
                })?.auditoriumNameEn
              : "-",
            applicantName: row?.trnAuditoriumBookingOnlineProcess?.applicantName
              ? row?.trnAuditoriumBookingOnlineProcess?.applicantName
              : "-",
            applicationDate:
              row?.trnAuditoriumBookingOnlineProcess?.applicationDate &&
              moment(
                row?.trnAuditoriumBookingOnlineProcess?.applicationDate
              ).format("DD/MM/YYYY"),

            serviceId: row.serviceId,
            applicationStatus: row.applicationStatus,
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
            mobileNo: row?.trnAuditoriumBookingOnlineProcess?.applicantMobileNo,
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
            bankAccountNo: row?.payment?.bankaAccountNo,
            typeOfBankAccountKey: row.typeOfBankAccountKey,
            typeOfBankAccountName: row.typeOfBankAccountName,
            bankNameId: row.bankNameId,
            bankName: row.bankName,
            bankAddress: row.bankAddress,
            ifscCode: row.ifscCode,
            micrCode: row.micrCode,
            activeFlag: row.activeFlag,
            status: row.applicationStatus,
            applicationNumber: row.applicationNumberKey,
            eventTitle: row.trnAuditoriumBookingOnlineProcess.eventTitle,
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

  const getAuditoriumBookingDetailsById = (id) => {
    setLoading(true);
    axios
      // .get(`${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`)
      .get(
        `${urls.PABBMURL}/trnAuditoriumBookingOnlineProcess/getByApplicationNo?applicationNo=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((r) => {
        if (r.status === 200) {
          console.log("By id", r);
          setBookedData(r?.data);
          reset(r.data);
          setValue(
            "organizationName",
            r.data.organizationName ? r.data.organizationName : "-"
          );
          setValue("title", r.data.title ? r.data.title : "-");
          setValue(
            "flatBuildingNo",
            r.data.flatBuildingNo ? r.data.flatBuildingNo : "-"
          );
          setValue(
            "organizationOwnerFirstName",
            r.data.organizationOwnerFirstName
              ? r.data.organizationOwnerFirstName
              : "-"
          );
          setValue(
            "organizationOwnerMiddleName",
            r.data.organizationOwnerMiddleName
              ? r.data.organizationOwnerMiddleName
              : "-"
          );
          setValue(
            "organizationOwnerLastName",
            r.data.organizationOwnerLastName
              ? r.data.organizationOwnerLastName
              : "-"
          );
          setValue(
            "buildingName",
            r.data.buildingName ? r.data.buildingName : "-"
          );
          setValue("roadName", r.data.roadName ? r.data.roadName : "-");
          setValue("landmark", r.data.landmark ? r.data.landmark : "-");
          setValue("pincode", r.data.pincode ? r.data.pincode : "-");
          setValue("aadhaarNo", r.data.aadhaarNo ? r.data.aadhaarNo : "-");
          setValue("mobile", r.data.mobile ? r.data.mobile : "-");
          setValue("landlineNo", r.data.landlineNo ? r.data.landlineNo : "-");
          setValue(
            "emailAddress",
            r.data.emailAddress ? r.data.emailAddress : "-"
          );
          setValue(
            "depositeReceiptNo",
            r.data.depositDeceiptId ? r.data.depositDeceiptId : "-"
          );
          setValue(
            "depositeAmount",
            r.data.depositedAmount ? r.data.depositedAmount : "-"
          );
          setValue(
            "eventTimeFrom",
            r.data.eventTimeFrom ? r.data.eventTimeFrom : "-"
          );
          setValue(
            "eventTimeTo",
            r.data.eventTimeTo ? r.data.eventTimeTo : "-"
          );
          setValue(
            "depositeReceiptDate",
            r.data.depositReceiptDate ? r.data.depositReceiptDate : "-"
          );
          console.log("first", r.data);
          setValue(
            "bankAccountHolderName",
            r?.data?.paymentDao?.bankAccountHolderName
              ? r?.data?.paymentDao?.bankAccountHolderName
              : "-"
          );
          setValue(
            "bankaAccountNo",
            r?.data?.paymentDao?.bankaAccountNo
              ? r?.data?.paymentDao?.bankaAccountNo
              : "-"
          );
          setValue(
            "typeOfBankAccountId",
            r?.data?.paymentDao?.typeOfBankAccountId
              ? r?.data?.paymentDao?.typeOfBankAccountId
              : "-"
          );
          setValue(
            "bankNameId",
            r?.data?.paymentDao?.bankNameId
              ? r?.data?.paymentDao?.bankNameId
              : "-"
          );
          setValue(
            "bankAddress",
            r?.data?.paymentDao?.bankAddress
              ? r?.data?.paymentDao?.bankAddress
              : "-"
          );
          setValue(
            "ifscCode",
            r?.data?.paymentDao?.ifscCode ? r?.data?.paymentDao?.ifscCode : "-"
          );
          setValue(
            "micrCode",
            r?.data?.paymentDao?.micrCode ? r?.data?.paymentDao?.micrCode : "-"
          );
          setValue("event", r.data.event ? r.data.event : "-");
          setValue(
            "applicantBuildingName",
            r.data.applicantFlatBuildingName
              ? r.data.applicantFlatBuildingName
              : "-"
          );

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
    console.log("formData", formData, bookedData);

    sweetAlert({
      title: language === "en" ? "Deposit Refund" : "अनामत रक्कम परतावा",
      text: language === "en" ? "Are you sure?" : "तुम्हाला खात्री आहे??",
      dangerMode: false,
      closeOnClickOutside: false,
      buttons: [
        language === "en" ? "No" : "नाही",
        language === "en" ? "Yes" : "होय",
      ],
    }).then((will) => {
      if (will) {
        // const eventDate = moment(formData.eventDate).format("YYYY-MM-DD");
        let chargesOfExtraEquipmentsUsed = formData?.levelsOfRolesDaoList?.map(
          (val) => {
            return val.total;
          }
        );

        let _chargesOfExtraEquipmentsUsed =
          chargesOfExtraEquipmentsUsed?.reduce(
            (partialSum, a) => partialSum + a,
            0
          );

        const billDate = formData?.billDate
          ? moment(formData?.billDate).format("YYYY-MM-DD")
          : moment(new Date()).format("YYYY-MM-DD");

        const finalBodyForApi = {
          // ...formData,
          // ...bookedData,
          // extraEquipmentUsedChargesList: formData?.levelsOfRolesDaoList,
          // extraEquipmentUsedChargesList: formData.levelsOfRolesDaoList.map(
          //   (val) => {
          //     return {
          //       equipmentKey: Number(val.equipment),
          //       quantity: Number(val.quantity),
          //       rate: Number(val.rate),
          //       total: Number(val.total),
          //     };
          //   }
          // ),
          // extraUsedEquipmentChargesAmount: _chargesOfExtraEquipmentsUsed,
          // finalRefundableAmount:
          //   bookedData?.trnAuditoriumBookingOnlineProcess?.depositAmount -
          //   _chargesOfExtraEquipmentsUsed,
          isApproved: true,
          activeFlag: bookedData?.activeFlag,
          applicationNumberKey: bookedData?.applicationNumberKey,
          applicationStatus: bookedData?.applicationStatus,
          id: bookedData?.id,
          attachDocuments: electrialInspectorCertificate,
          depositeRefundRemarkByClark: formData?.depositeRefundRemarkByClark,
          depositeRefundRemarkByHod: formData?.depositeRefundRemarkByHod,
          depositeRefundRemarkBySpDyAccountant:
            formData?.depositeRefundRemarkBySpDyAccountant,
          depositeRefundRemarkBySpDyCommissioner:
            formData?.depositeRefundRemarkBySpDyCommissioner,
          depositeRefundRemarkByHoAccountant:
            formData?.depositeRefundRemarkByHoAccountant,
          depositeRefundRemarkByCashier:
            formData?.depositeRefundRemarkByCashier,
          depositeRefundRemarkByManager:
            formData?.depositeRefundRemarkByManager,

          remarks: authority?.includes("HOD")
            ? formData?.depositeRefundRemarkByHod
            : formData?.depositeRefundRemarkByClark,
          auditoriumId: Number(formData.auditoriumId),
          designation: authority?.includes("HOD") ? "HOD" : "Clerk",
          processType: "D",
          serviceId: 122,
          actionBy:
            user?.userDao?.firstNameEn + " " + user?.userDao?.lastNameEn,
          applicationDate: moment(
            bookedData?.applicationDate,
            "DD/MM/YYYY"
          ).format("YYYY-MM-DD"),
          budgetingUnit: formData?.budgetingUnit,
          notsheetRefNo: formData?.notesheetReferenceNo,
          billDate: billDate,
          ecsPayment: formData?.ecsPayment,
          pcmcBankName: formData?.pcmcBankName,
          pcmcBranchName: formData?.pcmcBranchName,
          pcmcChequeNumber: formData?.pcmcChequeNumber,
          pcmcChequeDate: formData?.pcmcChequeDate,
        };

        console.log("finalBodyForApi", finalBodyForApi);

        let targetArray = [
          "DEPUTY_ACCOUNTANT",
          "ASSISTANT_COMMISHIONER",
          "HEAD_ACCOUNTANT",
          "CASHIER",
        ];

        if (authority?.some((item) => targetArray.includes(item))) {
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
                getDepositRefundProcessing();
                setButtonInputState(false);
                setIsOpenCollapse(false);
                setEditButtonInputState(false);
                setDeleteButtonState(false);

                router.push({
                  pathname:
                    "/PublicAuditorium/transaction/depositeRefundProcessing/form_no_fourteen",
                  query: {
                    bookedData: JSON.stringify(bookedData),
                  },
                });
              }
            })
            ?.catch((err) => {
              console.log("err", err);
              setLoading(false);
              callCatchMethod(err, language);
            });
        } else {
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
                getDepositRefundProcessing();
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
        }
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

  const applicationHistorycolumns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      srNo: 0.3,
      align: "center",
      headerAlign: "center",
      minWidth: 70,
    },
    {
      field: "actionBy",
      headerName: "Name",
      flex: 0.3,
      headerAlign: "center",
      minWidth: 170,
    },
    {
      field: "applicationNumberKey",
      headerName: "Application Number",
      flex: 0.3,
      headerAlign: "center",
      minWidth: 150,
    },
    {
      field: "applicationDate",
      headerName: "Appliction Date",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 0.5,
      headerAlign: "center",
      minWidth: 100,
    },
    {
      field: "applicationStatus",
      headerName: "Application Status",
      flex: 1,
      minWidth: 170,
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
      minWidth: 100,
      headerAlign: "center",
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span className="csutable-cell-trucate">{params.value}</span>
        </Tooltip>
      ),
    },
  ];

  const columns = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      flex: 0.3,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "auditoriumName",
      headerName: <FormattedLabel id="auditorium" />,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "applicationNumber",
      headerName: <FormattedLabel id="applicationNumber" />,
      flex: 0.6,
      headerAlign: "center",
    },
    {
      field: "applicationDate",
      headerName: <FormattedLabel id="applicationDate" />,
      flex: 0.6,
      align: "right",
      headerAlign: "center",
    },
    {
      field: "eventTitle",
      headerName: <FormattedLabel id="eventTitle" />,
      flex: 0.6,
      align: "right",
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
              params.row.applicationStatus ==
                "DEPOSITE_REFUND_REQUEST_SEND_TO_CLARK" && (
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
                        "auditoriumBookingNumber",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.auditoriumBookingNo
                      );
                      setValue(
                        "auditoriumId",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?._auditoriumId
                      );
                      // setValue(
                      //   "serviceId",
                      //   params?.row?.trnAuditoriumBookingOnlineProcess
                      //     ?.serviceId
                      // );
                      setValue("serviceId", 122);

                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                      setValue(
                        "bankAccountHolderName",
                        params?.row?.payment?.bankAccountHolderName
                          ? params?.row?.payment?.bankAccountHolderName
                          : "-"
                      );
                      setValue(
                        "bankaAccountNo",
                        params?.row?.payment?.bankaAccountNo
                          ? params?.row?.payment?.bankaAccountNo
                          : "-"
                      );
                      setValue(
                        "typeOfBankAccountId",
                        params?.row?.payment?.typeOfBankAccountId
                          ? params?.row?.payment?.typeOfBankAccountId
                          : "-"
                      );
                      setValue(
                        "bankNameId",
                        params?.row?.payment?.bankNameId
                          ? params?.row?.payment?.bankNameId
                          : "-"
                      );
                      setValue(
                        "bankAddress",
                        params?.row?.payment?.bankAddress
                          ? params?.row?.payment?.bankAddress
                          : "-"
                      );
                      setValue(
                        "ifscCode",
                        params?.row?.payment?.ifscCode
                          ? params?.row?.payment?.ifscCode
                          : "-"
                      );
                      setValue(
                        "micrCode",
                        params?.row?.payment?.micrCode
                          ? params?.row?.payment?.micrCode
                          : "-"
                      );
                      setValue(
                        "event",
                        params?.row?.eventDetails
                          ? params?.row?.eventDetails
                          : "-"
                      );
                      setValue(
                        "applicantBuildingName",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          .applicantFlatBuildingName
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              .applicantFlatBuildingName
                          : "-"
                      );

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "D";
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let attachmentData = params?.row?.attachments.map(
                        (val, id) => {
                          return {
                            srNo: id + 1,
                            applicationNumberKey: val?.applicationNumberKey,
                            attachedDate: val?.attachedDate,
                            uploadedBy: val?.attachedNameEn,
                            attachedNameMr: val?.attachedNameMr,
                            attachedTime: val?.attachedTime,
                            extension: val?.filePath?.split(".")[1],
                            documentChecklistEn: val?.documentChecklistEn,
                            filePath: val?.filePath,
                            id: val?.id,
                          };
                        }
                      );

                      setFinalFiles(attachmentData);
                    }}
                  >
                    <DoneIcon />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("HOD") &&
              params.row.status ===
                // "DEPOSITE_REFUND_REQUEST_APPROVE_BY_CLARK" && (
                "DEPOSITE_REFUND_REQUEST_SEND_TO_MANAGER" && (
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

                      setValue("budgetingUnit", params?.row?.budgetingUnit);
                      setValue(
                        "notesheetReferenceNo",
                        params?.row?.notsheetRefNo
                      );
                      setValue("billDate", params?.row?.billDate);
                      setValue("ecsPayment", params?.row?.ecsPayment);

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
                      // setValue(
                      //   "serviceId",
                      //   params?.row?.trnAuditoriumBookingOnlineProcess
                      //     ?.serviceId
                      // );
                      setValue("serviceId", 122);
                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                      setValue(
                        "bankAccountHolderName",
                        params?.row?.payment?.bankAccountHolderName
                          ? params?.row?.payment?.bankAccountHolderName
                          : "-"
                      );
                      setValue(
                        "bankaAccountNo",
                        params?.row?.payment?.bankaAccountNo
                          ? params?.row?.payment?.bankaAccountNo
                          : "-"
                      );
                      setValue(
                        "typeOfBankAccountId",
                        params?.row?.payment?.typeOfBankAccountId
                          ? params?.row?.payment?.typeOfBankAccountId
                          : "-"
                      );
                      setValue(
                        "bankNameId",
                        params?.row?.payment?.bankNameId
                          ? params?.row?.payment?.bankNameId
                          : "-"
                      );
                      setValue(
                        "bankAddress",
                        params?.row?.payment?.bankAddress
                          ? params?.row?.payment?.bankAddress
                          : "-"
                      );
                      setValue(
                        "ifscCode",
                        params?.row?.payment?.ifscCode
                          ? params?.row?.payment?.ifscCode
                          : "-"
                      );
                      setValue(
                        "micrCode",
                        params?.row?.payment?.micrCode
                          ? params?.row?.payment?.micrCode
                          : "-"
                      );
                      setValue(
                        "event",
                        params?.row?.eventDetails
                          ? params?.row?.eventDetails
                          : "-"
                      );
                      setValue(
                        "depositeRefundRemarkByClark",
                        params?.row?.depositeRefundRemarkByClark
                          ? params?.row?.depositeRefundRemarkByClark
                          : "-"
                      );

                      setValue(
                        "applicantBuildingName",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          .applicantFlatBuildingName
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              .applicantFlatBuildingName
                          : "-"
                      );

                      setValue(
                        "refundableAmount",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.refundableAmount
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              ?.refundableAmount
                          : "-"
                      );

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "D";
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let attachmentData = params?.row?.attachments.map(
                        (val, id) => {
                          return {
                            srNo: id + 1,
                            applicationNumberKey: val?.applicationNumberKey,
                            attachedDate: val?.attachedDate,
                            uploadedBy: val?.attachedNameEn,
                            attachedNameMr: val?.attachedNameMr,
                            attachedTime: val?.attachedTime,
                            extension: val?.filePath?.split(".")[1],
                            documentChecklistEn: val?.documentChecklistEn,
                            filePath: val?.filePath,
                            id: val?.id,
                          };
                        }
                      );

                      setFinalFiles(attachmentData);

                      const extraEqList =
                        params?.row?.extraEquipmentUsedChargesList?.map(
                          (val) => {
                            console.log("firs", val);
                            return {
                              equipment: val?.equipmentKey,
                              rate: val?.rate,
                              quantity: val?.quantity,
                              total: val?.total,
                            };
                          }
                        );

                      setValue("extraEqList", extraEqList);
                      let chargesOfExtraEquipmentsUsed = watch(
                        "extraEqList"
                      )?.map((val) => {
                        return val.total;
                      });

                      let _chargesOfExtraEquipmentsUsed =
                        chargesOfExtraEquipmentsUsed?.reduce(
                          (partialSum, a) => partialSum + a,
                          0
                        );
                      setExtraEquipmentAmount(_chargesOfExtraEquipmentsUsed);
                      appendUI();
                    }}
                  >
                    <DoneIcon />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("DEPUTY_ACCOUNTANT") &&
              params.row.status ===
                "DEPOSITE_REFUND_REQUEST_SEND_TO_SPORT_DEPT_DY_ACCOUNTANT" && (
                <Tooltip title="Sport Dept Dy Accountant Action">
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
                      setValue("budgetingUnit", params?.row?.budgetingUnit);
                      setValue(
                        "notesheetReferenceNo",
                        params?.row?.notsheetRefNo
                      );
                      setValue("billDate", params?.row?.billDate);
                      setValue("ecsPayment", params?.row?.ecsPayment);
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
                      // setValue(
                      //   "serviceId",
                      //   params?.row?.trnAuditoriumBookingOnlineProcess
                      //     ?.serviceId
                      // );
                      setValue("serviceId", 122);
                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                      setValue(
                        "bankAccountHolderName",
                        params?.row?.payment?.bankAccountHolderName
                          ? params?.row?.payment?.bankAccountHolderName
                          : "-"
                      );
                      setValue(
                        "bankaAccountNo",
                        params?.row?.payment?.bankaAccountNo
                          ? params?.row?.payment?.bankaAccountNo
                          : "-"
                      );
                      setValue(
                        "typeOfBankAccountId",
                        params?.row?.payment?.typeOfBankAccountId
                          ? params?.row?.payment?.typeOfBankAccountId
                          : "-"
                      );
                      setValue(
                        "bankNameId",
                        params?.row?.payment?.bankNameId
                          ? params?.row?.payment?.bankNameId
                          : "-"
                      );
                      setValue(
                        "bankAddress",
                        params?.row?.payment?.bankAddress
                          ? params?.row?.payment?.bankAddress
                          : "-"
                      );
                      setValue(
                        "ifscCode",
                        params?.row?.payment?.ifscCode
                          ? params?.row?.payment?.ifscCode
                          : "-"
                      );
                      setValue(
                        "micrCode",
                        params?.row?.payment?.micrCode
                          ? params?.row?.payment?.micrCode
                          : "-"
                      );
                      setValue(
                        "event",
                        params?.row?.eventDetails
                          ? params?.row?.eventDetails
                          : "-"
                      );
                      setValue(
                        "depositeRefundRemarkByClark",
                        params?.row?.depositeRefundRemarkByClark
                          ? params?.row?.depositeRefundRemarkByClark
                          : "-"
                      );
                      setValue(
                        "depositeRefundRemarkByHod",
                        params?.row?.depositeRefundRemarkByHod
                          ? params?.row?.depositeRefundRemarkByHod
                          : "-"
                      );

                      setValue(
                        "applicantBuildingName",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          .applicantFlatBuildingName
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              .applicantFlatBuildingName
                          : "-"
                      );

                      setValue(
                        "refundableAmount",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.refundableAmount
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              ?.refundableAmount
                          : "-"
                      );

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "D";
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let attachmentData = params?.row?.attachments.map(
                        (val, id) => {
                          return {
                            srNo: id + 1,
                            applicationNumberKey: val?.applicationNumberKey,
                            attachedDate: val?.attachedDate,
                            uploadedBy: val?.attachedNameEn,
                            attachedNameMr: val?.attachedNameMr,
                            attachedTime: val?.attachedTime,
                            extension: val?.filePath?.split(".")[1],
                            documentChecklistEn: val?.documentChecklistEn,
                            filePath: val?.filePath,
                            id: val?.id,
                          };
                        }
                      );

                      setFinalFiles(attachmentData);

                      const extraEqList =
                        params?.row?.extraEquipmentUsedChargesList?.map(
                          (val) => {
                            console.log("firs", val);
                            return {
                              equipment: val?.equipmentKey,
                              rate: val?.rate,
                              quantity: val?.quantity,
                              total: val?.total,
                            };
                          }
                        );

                      setValue("extraEqList", extraEqList);
                      let chargesOfExtraEquipmentsUsed = watch(
                        "extraEqList"
                      )?.map((val) => {
                        return val.total;
                      });

                      let _chargesOfExtraEquipmentsUsed =
                        chargesOfExtraEquipmentsUsed?.reduce(
                          (partialSum, a) => partialSum + a,
                          0
                        );
                      setExtraEquipmentAmount(_chargesOfExtraEquipmentsUsed);
                      appendUI();
                    }}
                  >
                    <DoneIcon />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("ASSISTANT_COMMISHIONER") &&
              params.row.status ===
                "DEPOSITE_REFUND_REQUEST_SEND_TO_SPORT_DEPT_DY_COMMISSIONER" && (
                <Tooltip title="Sport Dept Dy Commissioner Action">
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
                      setValue("budgetingUnit", params?.row?.budgetingUnit);
                      setValue(
                        "notesheetReferenceNo",
                        params?.row?.notsheetRefNo
                      );
                      setValue("billDate", params?.row?.billDate);
                      setValue("ecsPayment", params?.row?.ecsPayment);
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
                      // setValue(
                      //   "serviceId",
                      //   params?.row?.trnAuditoriumBookingOnlineProcess
                      //     ?.serviceId
                      // );
                      setValue("serviceId", 122);
                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                      setValue(
                        "bankAccountHolderName",
                        params?.row?.payment?.bankAccountHolderName
                          ? params?.row?.payment?.bankAccountHolderName
                          : "-"
                      );
                      setValue(
                        "bankaAccountNo",
                        params?.row?.payment?.bankaAccountNo
                          ? params?.row?.payment?.bankaAccountNo
                          : "-"
                      );
                      setValue(
                        "typeOfBankAccountId",
                        params?.row?.payment?.typeOfBankAccountId
                          ? params?.row?.payment?.typeOfBankAccountId
                          : "-"
                      );
                      setValue(
                        "bankNameId",
                        params?.row?.payment?.bankNameId
                          ? params?.row?.payment?.bankNameId
                          : "-"
                      );
                      setValue(
                        "bankAddress",
                        params?.row?.payment?.bankAddress
                          ? params?.row?.payment?.bankAddress
                          : "-"
                      );
                      setValue(
                        "ifscCode",
                        params?.row?.payment?.ifscCode
                          ? params?.row?.payment?.ifscCode
                          : "-"
                      );
                      setValue(
                        "micrCode",
                        params?.row?.payment?.micrCode
                          ? params?.row?.payment?.micrCode
                          : "-"
                      );
                      setValue(
                        "event",
                        params?.row?.eventDetails
                          ? params?.row?.eventDetails
                          : "-"
                      );
                      setValue(
                        "depositeRefundRemarkByClark",
                        params?.row?.depositeRefundRemarkByClark
                          ? params?.row?.depositeRefundRemarkByClark
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkByHod",
                        params?.row?.depositeRefundRemarkByHod
                          ? params?.row?.depositeRefundRemarkByHod
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkBySpDyAccountant",
                        params?.row?.depositeRefundRemarkBySpDyAccountant
                          ? params?.row?.depositeRefundRemarkBySpDyAccountant
                          : "-"
                      );

                      setValue(
                        "applicantBuildingName",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          .applicantFlatBuildingName
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              .applicantFlatBuildingName
                          : "-"
                      );

                      setValue(
                        "refundableAmount",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.refundableAmount
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              ?.refundableAmount
                          : "-"
                      );

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "D";
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let attachmentData = params?.row?.attachments.map(
                        (val, id) => {
                          return {
                            srNo: id + 1,
                            applicationNumberKey: val?.applicationNumberKey,
                            attachedDate: val?.attachedDate,
                            uploadedBy: val?.attachedNameEn,
                            attachedNameMr: val?.attachedNameMr,
                            attachedTime: val?.attachedTime,
                            extension: val?.filePath?.split(".")[1],
                            documentChecklistEn: val?.documentChecklistEn,
                            filePath: val?.filePath,
                            id: val?.id,
                          };
                        }
                      );

                      setFinalFiles(attachmentData);

                      const extraEqList =
                        params?.row?.extraEquipmentUsedChargesList?.map(
                          (val) => {
                            console.log("firs", val);
                            return {
                              equipment: val?.equipmentKey,
                              rate: val?.rate,
                              quantity: val?.quantity,
                              total: val?.total,
                            };
                          }
                        );

                      setValue("extraEqList", extraEqList);
                      let chargesOfExtraEquipmentsUsed = watch(
                        "extraEqList"
                      )?.map((val) => {
                        return val.total;
                      });

                      let _chargesOfExtraEquipmentsUsed =
                        chargesOfExtraEquipmentsUsed?.reduce(
                          (partialSum, a) => partialSum + a,
                          0
                        );
                      setExtraEquipmentAmount(_chargesOfExtraEquipmentsUsed);
                      appendUI();
                    }}
                  >
                    <DoneIcon />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("HOD") &&
              params.row.status ===
                "DEPOSITE_REFUND_REQUEST_APPROVE_BY_SPORT_DEPT_DY_COMMISSIONER" && (
                <Tooltip title="HOD Action After commissioner">
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
                      setValue("budgetingUnit", params?.row?.budgetingUnit);
                      setValue(
                        "notesheetReferenceNo",
                        params?.row?.notsheetRefNo
                      );
                      setValue("billDate", params?.row?.billDate);
                      setValue("ecsPayment", params?.row?.ecsPayment);
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
                      // setValue(
                      //   "serviceId",
                      //   params?.row?.trnAuditoriumBookingOnlineProcess
                      //     ?.serviceId
                      // );
                      setValue("serviceId", 122);
                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                      setValue(
                        "bankAccountHolderName",
                        params?.row?.payment?.bankAccountHolderName
                          ? params?.row?.payment?.bankAccountHolderName
                          : "-"
                      );
                      setValue(
                        "bankaAccountNo",
                        params?.row?.payment?.bankaAccountNo
                          ? params?.row?.payment?.bankaAccountNo
                          : "-"
                      );
                      setValue(
                        "typeOfBankAccountId",
                        params?.row?.payment?.typeOfBankAccountId
                          ? params?.row?.payment?.typeOfBankAccountId
                          : "-"
                      );
                      setValue(
                        "bankNameId",
                        params?.row?.payment?.bankNameId
                          ? params?.row?.payment?.bankNameId
                          : "-"
                      );
                      setValue(
                        "bankAddress",
                        params?.row?.payment?.bankAddress
                          ? params?.row?.payment?.bankAddress
                          : "-"
                      );
                      setValue(
                        "ifscCode",
                        params?.row?.payment?.ifscCode
                          ? params?.row?.payment?.ifscCode
                          : "-"
                      );
                      setValue(
                        "micrCode",
                        params?.row?.payment?.micrCode
                          ? params?.row?.payment?.micrCode
                          : "-"
                      );
                      setValue(
                        "event",
                        params?.row?.eventDetails
                          ? params?.row?.eventDetails
                          : "-"
                      );
                      setValue(
                        "depositeRefundRemarkByClark",
                        params?.row?.depositeRefundRemarkByClark
                          ? params?.row?.depositeRefundRemarkByClark
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkByHod",
                        params?.row?.depositeRefundRemarkByHod
                          ? params?.row?.depositeRefundRemarkByHod
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkBySpDyAccountant",
                        params?.row?.depositeRefundRemarkBySpDyAccountant
                          ? params?.row?.depositeRefundRemarkBySpDyAccountant
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkBySpDyCommissioner",
                        params?.row?.depositeRefundRemarkBySpDyCommissioner
                          ? params?.row?.depositeRefundRemarkBySpDyCommissioner
                          : "-"
                      );

                      setValue(
                        "applicantBuildingName",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          .applicantFlatBuildingName
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              .applicantFlatBuildingName
                          : "-"
                      );

                      setValue(
                        "refundableAmount",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.refundableAmount
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              ?.refundableAmount
                          : "-"
                      );

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "D";
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let attachmentData = params?.row?.attachments.map(
                        (val, id) => {
                          return {
                            srNo: id + 1,
                            applicationNumberKey: val?.applicationNumberKey,
                            attachedDate: val?.attachedDate,
                            uploadedBy: val?.attachedNameEn,
                            attachedNameMr: val?.attachedNameMr,
                            attachedTime: val?.attachedTime,
                            extension: val?.filePath?.split(".")[1],
                            documentChecklistEn: val?.documentChecklistEn,
                            filePath: val?.filePath,
                            id: val?.id,
                          };
                        }
                      );

                      setFinalFiles(attachmentData);

                      const extraEqList =
                        params?.row?.extraEquipmentUsedChargesList?.map(
                          (val) => {
                            console.log("firs", val);
                            return {
                              equipment: val?.equipmentKey,
                              rate: val?.rate,
                              quantity: val?.quantity,
                              total: val?.total,
                            };
                          }
                        );

                      setValue("extraEqList", extraEqList);
                      let chargesOfExtraEquipmentsUsed = watch(
                        "extraEqList"
                      )?.map((val) => {
                        return val.total;
                      });

                      let _chargesOfExtraEquipmentsUsed =
                        chargesOfExtraEquipmentsUsed?.reduce(
                          (partialSum, a) => partialSum + a,
                          0
                        );
                      setExtraEquipmentAmount(_chargesOfExtraEquipmentsUsed);
                      appendUI();
                    }}
                  >
                    <DoneIcon />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("HEAD_ACCOUNTANT") &&
              params.row.status ===
                "DEPOSITE_REFUND_REQUEST_SEND_TO_HEAD_OF_DEPARTMENT_ACCOUNT" && (
                <Tooltip title="HO Accountant Action">
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
                      setValue("budgetingUnit", params?.row?.budgetingUnit);
                      setValue(
                        "notesheetReferenceNo",
                        params?.row?.notsheetRefNo
                      );
                      setValue("billDate", params?.row?.billDate);
                      setValue("ecsPayment", params?.row?.ecsPayment);
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
                      // setValue(
                      //   "serviceId",
                      //   params?.row?.trnAuditoriumBookingOnlineProcess
                      //     ?.serviceId
                      // );
                      setValue("serviceId", 122);
                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                      setValue(
                        "bankAccountHolderName",
                        params?.row?.payment?.bankAccountHolderName
                          ? params?.row?.payment?.bankAccountHolderName
                          : "-"
                      );
                      setValue(
                        "bankaAccountNo",
                        params?.row?.payment?.bankaAccountNo
                          ? params?.row?.payment?.bankaAccountNo
                          : "-"
                      );
                      setValue(
                        "typeOfBankAccountId",
                        params?.row?.payment?.typeOfBankAccountId
                          ? params?.row?.payment?.typeOfBankAccountId
                          : "-"
                      );
                      setValue(
                        "bankNameId",
                        params?.row?.payment?.bankNameId
                          ? params?.row?.payment?.bankNameId
                          : "-"
                      );
                      setValue(
                        "bankAddress",
                        params?.row?.payment?.bankAddress
                          ? params?.row?.payment?.bankAddress
                          : "-"
                      );
                      setValue(
                        "ifscCode",
                        params?.row?.payment?.ifscCode
                          ? params?.row?.payment?.ifscCode
                          : "-"
                      );
                      setValue(
                        "micrCode",
                        params?.row?.payment?.micrCode
                          ? params?.row?.payment?.micrCode
                          : "-"
                      );
                      setValue(
                        "event",
                        params?.row?.eventDetails
                          ? params?.row?.eventDetails
                          : "-"
                      );
                      setValue(
                        "depositeRefundRemarkByClark",
                        params?.row?.depositeRefundRemarkByClark
                          ? params?.row?.depositeRefundRemarkByClark
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkByHod",
                        params?.row?.depositeRefundRemarkByHod
                          ? params?.row?.depositeRefundRemarkByHod
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkBySpDyAccountant",
                        params?.row?.depositeRefundRemarkBySpDyAccountant
                          ? params?.row?.depositeRefundRemarkBySpDyAccountant
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkBySpDyCommissioner",
                        params?.row?.depositeRefundRemarkBySpDyCommissioner
                          ? params?.row?.depositeRefundRemarkBySpDyCommissioner
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkByManager",
                        params?.row?.depositeRefundRemarkByManager
                          ? params?.row?.depositeRefundRemarkByManager
                          : "-"
                      );

                      setValue(
                        "applicantBuildingName",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          .applicantFlatBuildingName
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              .applicantFlatBuildingName
                          : "-"
                      );

                      setValue(
                        "refundableAmount",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.refundableAmount
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              ?.refundableAmount
                          : "-"
                      );

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "D";
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let attachmentData = params?.row?.attachments.map(
                        (val, id) => {
                          return {
                            srNo: id + 1,
                            applicationNumberKey: val?.applicationNumberKey,
                            attachedDate: val?.attachedDate,
                            uploadedBy: val?.attachedNameEn,
                            attachedNameMr: val?.attachedNameMr,
                            attachedTime: val?.attachedTime,
                            extension: val?.filePath?.split(".")[1],
                            documentChecklistEn: val?.documentChecklistEn,
                            filePath: val?.filePath,
                            id: val?.id,
                          };
                        }
                      );

                      setFinalFiles(attachmentData);

                      const extraEqList =
                        params?.row?.extraEquipmentUsedChargesList?.map(
                          (val) => {
                            console.log("firs", val);
                            return {
                              equipment: val?.equipmentKey,
                              rate: val?.rate,
                              quantity: val?.quantity,
                              total: val?.total,
                            };
                          }
                        );

                      setValue("extraEqList", extraEqList);
                      let chargesOfExtraEquipmentsUsed = watch(
                        "extraEqList"
                      )?.map((val) => {
                        return val.total;
                      });

                      let _chargesOfExtraEquipmentsUsed =
                        chargesOfExtraEquipmentsUsed?.reduce(
                          (partialSum, a) => partialSum + a,
                          0
                        );
                      setExtraEquipmentAmount(_chargesOfExtraEquipmentsUsed);
                      appendUI();
                    }}
                  >
                    <DoneIcon />
                  </Button>
                </Tooltip>
              )}
            {authority?.includes("CASHIER") &&
              params.row.status ===
                "DEPOSITE_REFUND_REQUEST_SEND_TO_CASHIER" && (
                <Tooltip title="Cashier Action">
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
                      setValue("budgetingUnit", params?.row?.budgetingUnit);
                      setValue(
                        "notesheetReferenceNo",
                        params?.row?.notsheetRefNo
                      );
                      setValue("billDate", params?.row?.billDate);
                      setValue("ecsPayment", params?.row?.ecsPayment);
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
                      // setValue(
                      //   "serviceId",
                      //   params?.row?.trnAuditoriumBookingOnlineProcess
                      //     ?.serviceId
                      // );
                      setValue("serviceId", 122);
                      setValue(
                        "reasonForCancellation",
                        params?.row?.reasonsForCancellation
                      );
                      setValue(
                        "bookingDate",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.applicationDate
                      );
                      setValue(
                        "bankAccountHolderName",
                        params?.row?.payment?.bankAccountHolderName
                          ? params?.row?.payment?.bankAccountHolderName
                          : "-"
                      );
                      setValue(
                        "bankaAccountNo",
                        params?.row?.payment?.bankaAccountNo
                          ? params?.row?.payment?.bankaAccountNo
                          : "-"
                      );
                      setValue(
                        "typeOfBankAccountId",
                        params?.row?.payment?.typeOfBankAccountId
                          ? params?.row?.payment?.typeOfBankAccountId
                          : "-"
                      );
                      setValue(
                        "bankNameId",
                        params?.row?.payment?.bankNameId
                          ? params?.row?.payment?.bankNameId
                          : "-"
                      );
                      setValue(
                        "bankAddress",
                        params?.row?.payment?.bankAddress
                          ? params?.row?.payment?.bankAddress
                          : "-"
                      );
                      setValue(
                        "ifscCode",
                        params?.row?.payment?.ifscCode
                          ? params?.row?.payment?.ifscCode
                          : "-"
                      );
                      setValue(
                        "micrCode",
                        params?.row?.payment?.micrCode
                          ? params?.row?.payment?.micrCode
                          : "-"
                      );
                      setValue(
                        "event",
                        params?.row?.eventDetails
                          ? params?.row?.eventDetails
                          : "-"
                      );
                      setValue(
                        "depositeRefundRemarkByClark",
                        params?.row?.depositeRefundRemarkByClark
                          ? params?.row?.depositeRefundRemarkByClark
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkByClark",
                        params?.row?.depositeRefundRemarkByClark
                          ? params?.row?.depositeRefundRemarkByClark
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkByHod",
                        params?.row?.depositeRefundRemarkByHod
                          ? params?.row?.depositeRefundRemarkByHod
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkBySpDyAccountant",
                        params?.row?.depositeRefundRemarkBySpDyAccountant
                          ? params?.row?.depositeRefundRemarkBySpDyAccountant
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkBySpDyCommissioner",
                        params?.row?.depositeRefundRemarkBySpDyCommissioner
                          ? params?.row?.depositeRefundRemarkBySpDyCommissioner
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkByManager",
                        params?.row?.depositeRefundRemarkByManager
                          ? params?.row?.depositeRefundRemarkByManager
                          : "-"
                      );

                      setValue(
                        "depositeRefundRemarkByHoAccountant",
                        params?.row?.depositeRefundRemarkByHoAccountant
                          ? params?.row?.depositeRefundRemarkByHoAccountant
                          : "-"
                      );

                      setValue(
                        "applicantBuildingName",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          .applicantFlatBuildingName
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              .applicantFlatBuildingName
                          : "-"
                      );

                      setValue(
                        "refundableAmount",
                        params?.row?.trnAuditoriumBookingOnlineProcess
                          ?.refundableAmount
                          ? params?.row?.trnAuditoriumBookingOnlineProcess
                              ?.refundableAmount
                          : "-"
                      );

                      let history = params?.row?.applicationHistoryList?.filter(
                        (val, id) => {
                          return val.processType === "D";
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
                        };
                      });

                      setApplicationHistoryData({
                        rows: _history,
                        totalRows: 0,
                        rowsPerPageOptions: [10, 20, 50, 100],
                        pageSize: 10,
                        page: 1,
                      });

                      let attachmentData = params?.row?.attachments.map(
                        (val, id) => {
                          return {
                            srNo: id + 1,
                            applicationNumberKey: val?.applicationNumberKey,
                            attachedDate: val?.attachedDate,
                            uploadedBy: val?.attachedNameEn,
                            attachedNameMr: val?.attachedNameMr,
                            attachedTime: val?.attachedTime,
                            extension: val?.filePath?.split(".")[1],
                            documentChecklistEn: val?.documentChecklistEn,
                            filePath: val?.filePath,
                            id: val?.id,
                          };
                        }
                      );

                      setFinalFiles(attachmentData);

                      const extraEqList =
                        params?.row?.extraEquipmentUsedChargesList?.map(
                          (val) => {
                            console.log("firs", val);
                            return {
                              equipment: val?.equipmentKey,
                              rate: val?.rate,
                              quantity: val?.quantity,
                              total: val?.total,
                            };
                          }
                        );

                      setValue("extraEqList", extraEqList);
                      let chargesOfExtraEquipmentsUsed = watch(
                        "extraEqList"
                      )?.map((val) => {
                        return val.total;
                      });

                      let _chargesOfExtraEquipmentsUsed =
                        chargesOfExtraEquipmentsUsed?.reduce(
                          (partialSum, a) => partialSum + a,
                          0
                        );
                      setExtraEquipmentAmount(_chargesOfExtraEquipmentsUsed);
                      appendUI();
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
            <PabbmHeader labelName="depositRefundProcess" />
          </Box>
          {isOpenCollapse && (
            <Slide
              direction="down"
              in={slideChecked}
              mountOnEnter
              unmountOnExit
            >
              <form onSubmit={handleSubmit(onSubmitForm)}>
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
                    <TextField
                      id="outlined-basic"
                      label={<FormattedLabel id="applicationNumber" />}
                      // label="Application Number"
                      variant="outlined"
                      size="small"
                      disabled
                      sx={{ width: "90%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      {...register("applicationNumber")}
                      error={!!errors.applicationNumber}
                      helperText={
                        errors?.applicationNumber
                          ? errors.applicationNumber.message
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
                    lg={4}
                    xl={4}
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
                      error={errors.bookingDate}
                    >
                      <Controller
                        name="bookingDate"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker
                              inputFormat="DD/MM/YYYY"
                              label={
                                <span style={{ fontSize: 16 }}>
                                  {<FormattedLabel id="bookingDate" />}
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
                      disabled
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      {...register("eventTitle")}
                      error={!!errors.eventTitle}
                      helperText={
                        errors?.eventTitle ? errors.eventTitle.message : null
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
                      size="small"
                      disabled
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
                {/* <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="subtitle2">
                      Upload Documents
                    </Typography>
                    <MultipleUpload files={files} setFiles={setFiles}/>
                  </Grid>
                </Grid> */}
                {/* <Grid container sx={{ padding: "10px" }}>
                  <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      disabled={!watch("auditoriumBookingNumber")}
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
                    <Typography>
                      <FormattedLabel id="attachment" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <FileTable
                          appName={appName} //Module Name
                          serviceName={serviceName} //Transaction Name
                          fileName={attachedFile} //State to attach file
                          filePath={setAttachedFile} // File state upadtion function
                          newFilesFn={setAdditionalFiles} // File data function
                          columns={_columns} //columns for the table
                          rows={finalFiles} //state to be displayed in table
                          uploading={setUploading}
                          authority={authority}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

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
                      {" "}
                      <FormattedLabel id="depositRefundBillDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container sx={{ padding: "10px" }}>
                      {`* ₹${Number(
                        bookedData?.trnAuditoriumBookingOnlineProcess
                          ?.depositAmount
                      )?.toFixed(2)} Deposit Paid on ${moment(
                        bookedData?.payment?.depositePayDate
                      ).format("DD/MM/YYYY")} with transaction id = ${
                        bookedData?.payment?.pgDepositeKey
                      }.`}
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
                          label={<FormattedLabel id="budgetingUnit" />}
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          disabled={!authority?.includes("CLERK")}
                          size="small"
                          {...register("budgetingUnit")}
                          error={!!errors.budgetingUnit}
                          helperText={
                            errors?.budgetingUnit
                              ? errors.budgetingUnit.message
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
                            <FormattedLabel id="notesheet_ReferenceNumber" />
                          }
                          InputLabelProps={{ shrink: true }}
                          variant="outlined"
                          size="small"
                          sx={{
                            width: "90%",
                          }}
                          disabled={!authority?.includes("CLERK")}
                          {...register("notesheetReferenceNo")}
                          error={!!errors.notesheetReferenceNo}
                          helperText={
                            errors?.notesheetReferenceNo
                              ? errors.notesheetReferenceNo.message
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
                          error={errors.billDate}
                        >
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
                                  disabled={!authority?.includes("CLERK")}
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
                            {errors?.billDate ? errors.billDate.message : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={4}>
                        <FormControl
                          component="fieldset"
                          error={!!errors?.ecsPayment}
                        >
                          <Controller
                            name="ecsPayment"
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Controller
                                    name="ecsPayment"
                                    control={control}
                                    render={({ field: props }) => (
                                      <Checkbox
                                        {...props}
                                        disabled={!authority?.includes("CLERK")}
                                        checked={props.value}
                                        onChange={(e) =>
                                          props.onChange(e.target.checked)
                                        }
                                      />
                                    )}
                                  />
                                }
                                label={<FormattedLabel id="ecsPayment" />}
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors?.ecsPayment?.message}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container sx={{ padding: "10px" }}>
                      {authority?.includes("CLERK") && (
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
                              InputLabelProps={{
                                shrink: true,
                              }}
                              sx={{
                                width: "90%",
                              }}
                              label="Clerk Remark"
                              variant="outlined"
                              size="small"
                              {...register("depositeRefundRemarkByClark")}
                              error={!!errors.depositeRefundRemarkByClark}
                              helperText={
                                errors?.depositeRefundRemarkByClark
                                  ? errors.depositeRefundRemarkByClark.message
                                  : null
                              }
                            />
                          </Grid>
                        </Grid>
                      )}
                      {authority?.includes("HOD") &&
                        bookedData?.depositeRefundRemarkByHod == null && (
                          <>
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
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  size="small"
                                  disabled
                                  label="Clerk Remark"
                                  variant="outlined"
                                  {...register("depositeRefundRemarkByClark")}
                                  error={!!errors.depositeRefundRemarkByClark}
                                  helperText={
                                    errors?.depositeRefundRemarkByClark
                                      ? errors.depositeRefundRemarkByClark
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
                                  id="outlined-basic"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  size="small"
                                  label="HOD Remark"
                                  variant="outlined"
                                  {...register("depositeRefundRemarkByHod")}
                                  error={!!errors.depositeRefundRemarkByHod}
                                  helperText={
                                    errors?.depositeRefundRemarkByHod
                                      ? errors.depositeRefundRemarkByHod.message
                                      : null
                                  }
                                />
                              </Grid>
                            </Grid>
                          </>
                        )}
                      {authority?.includes("DEPUTY_ACCOUNTANT") && (
                        <>
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                disabled
                                label="Clerk Remark"
                                variant="outlined"
                                {...register("depositeRefundRemarkByClark")}
                                error={!!errors.depositeRefundRemarkByClark}
                                helperText={
                                  errors?.depositeRefundRemarkByClark
                                    ? errors.depositeRefundRemarkByClark.message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="HOD Remark"
                                variant="outlined"
                                disabled
                                {...register("depositeRefundRemarkByHod")}
                                error={!!errors.depositeRefundRemarkByHod}
                                helperText={
                                  errors?.depositeRefundRemarkByHod
                                    ? errors.depositeRefundRemarkByHod.message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Deputy Accountant Remark"
                                variant="outlined"
                                {...register(
                                  "depositeRefundRemarkBySpDyAccountant"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkBySpDyAccountant
                                }
                                helperText={
                                  errors?.depositeRefundRemarkBySpDyAccountant
                                    ? errors
                                        .depositeRefundRemarkBySpDyAccountant
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {/* COMMISHIONER */}
                      {authority?.includes("ASSISTANT_COMMISHIONER") && (
                        <>
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                disabled
                                label="Clerk Remark"
                                variant="outlined"
                                {...register("depositeRefundRemarkByClark")}
                                error={!!errors.depositeRefundRemarkByClark}
                                helperText={
                                  errors?.depositeRefundRemarkByClark
                                    ? errors.depositeRefundRemarkByClark.message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="HOD Remark"
                                variant="outlined"
                                disabled
                                {...register("depositeRefundRemarkByHod")}
                                error={!!errors.depositeRefundRemarkByHod}
                                helperText={
                                  errors?.depositeRefundRemarkByHod
                                    ? errors.depositeRefundRemarkByHod.message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Deputy Accountant Remark"
                                variant="outlined"
                                disabled
                                {...register(
                                  "depositeRefundRemarkBySpDyAccountant"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkBySpDyAccountant
                                }
                                helperText={
                                  errors?.depositeRefundRemarkBySpDyAccountant
                                    ? errors
                                        .depositeRefundRemarkBySpDyAccountant
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
                                id="outlined-basic"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Deputy Commissioner Remark"
                                variant="outlined"
                                {...register(
                                  "depositeRefundRemarkBySpDyCommissioner"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkBySpDyCommissioner
                                }
                                helperText={
                                  errors?.depositeRefundRemarkBySpDyCommissioner
                                    ? errors
                                        .depositeRefundRemarkBySpDyCommissioner
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {authority?.includes("HOD") &&
                        bookedData?.depositeRefundRemarkByHod != null && (
                          <>
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
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  size="small"
                                  disabled
                                  label="Clerk Remark"
                                  variant="outlined"
                                  {...register("depositeRefundRemarkByClark")}
                                  error={!!errors.depositeRefundRemarkByClark}
                                  helperText={
                                    errors?.depositeRefundRemarkByClark
                                      ? errors.depositeRefundRemarkByClark
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
                                  id="outlined-basic"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  size="small"
                                  label="HOD Remark"
                                  variant="outlined"
                                  disabled
                                  {...register("depositeRefundRemarkByHod")}
                                  error={!!errors.depositeRefundRemarkByHod}
                                  helperText={
                                    errors?.depositeRefundRemarkByHod
                                      ? errors.depositeRefundRemarkByHod.message
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
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  size="small"
                                  label="Deputy Accountant Remark"
                                  variant="outlined"
                                  disabled
                                  {...register(
                                    "depositeRefundRemarkBySpDyAccountant"
                                  )}
                                  error={
                                    !!errors.depositeRefundRemarkBySpDyAccountant
                                  }
                                  helperText={
                                    errors?.depositeRefundRemarkBySpDyAccountant
                                      ? errors
                                          .depositeRefundRemarkBySpDyAccountant
                                          .message
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
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  disabled
                                  size="small"
                                  label="Deputy Commissioner Remark"
                                  variant="outlined"
                                  {...register(
                                    "depositeRefundRemarkBySpDyCommissioner"
                                  )}
                                  error={
                                    !!errors.depositeRefundRemarkBySpDyCommissioner
                                  }
                                  helperText={
                                    errors?.depositeRefundRemarkBySpDyCommissioner
                                      ? errors
                                          .depositeRefundRemarkBySpDyCommissioner
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
                                  id="outlined-basic"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  disabled
                                  size="small"
                                  label="Deputy Commissioner Remark"
                                  variant="outlined"
                                  {...register(
                                    "depositeRefundRemarkBySpDyCommissioner"
                                  )}
                                  error={
                                    !!errors.depositeRefundRemarkBySpDyCommissioner
                                  }
                                  helperText={
                                    errors?.depositeRefundRemarkBySpDyCommissioner
                                      ? errors
                                          .depositeRefundRemarkBySpDyCommissioner
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
                                  id="outlined-basic"
                                  InputLabelProps={{
                                    shrink: true,
                                  }}
                                  sx={{
                                    width: "90%",
                                  }}
                                  size="small"
                                  label="Manager / HOD Remark "
                                  variant="outlined"
                                  {...register("depositeRefundRemarkByManager")}
                                  error={!!errors.depositeRefundRemarkByManager}
                                  helperText={
                                    errors?.depositeRefundRemarkByManager
                                      ? errors.depositeRefundRemarkByManager
                                          .message
                                      : null
                                  }
                                />
                              </Grid>
                            </Grid>
                          </>
                        )}
                      {authority?.includes("HEAD_ACCOUNTANT") && (
                        <>
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                disabled
                                label="Clerk Remark"
                                variant="outlined"
                                {...register("depositeRefundRemarkByClark")}
                                error={!!errors.depositeRefundRemarkByClark}
                                helperText={
                                  errors?.depositeRefundRemarkByClark
                                    ? errors.depositeRefundRemarkByClark.message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="HOD Remark"
                                variant="outlined"
                                disabled
                                {...register("depositeRefundRemarkByHod")}
                                error={!!errors.depositeRefundRemarkByHod}
                                helperText={
                                  errors?.depositeRefundRemarkByHod
                                    ? errors.depositeRefundRemarkByHod.message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Deputy Accountant Remark"
                                variant="outlined"
                                disabled
                                {...register(
                                  "depositeRefundRemarkBySpDyAccountant"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkBySpDyAccountant
                                }
                                helperText={
                                  errors?.depositeRefundRemarkBySpDyAccountant
                                    ? errors
                                        .depositeRefundRemarkBySpDyAccountant
                                        .message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Deputy Commissioner Remark"
                                variant="outlined"
                                disabled
                                {...register(
                                  "depositeRefundRemarkBySpDyCommissioner"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkBySpDyCommissioner
                                }
                                helperText={
                                  errors?.depositeRefundRemarkBySpDyCommissioner
                                    ? errors
                                        .depositeRefundRemarkBySpDyCommissioner
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
                                id="outlined-basic"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Manager / HOD Remark "
                                variant="outlined"
                                disabled
                                {...register("depositeRefundRemarkByManager")}
                                error={!!errors.depositeRefundRemarkByManager}
                                helperText={
                                  errors?.depositeRefundRemarkByManager
                                    ? errors.depositeRefundRemarkByManager
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
                                id="outlined-basic"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="HO Accountant Remark"
                                variant="outlined"
                                {...register(
                                  "depositeRefundRemarkByHoAccountant"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkByHoAccountant
                                }
                                helperText={
                                  errors?.depositeRefundRemarkByHoAccountant
                                    ? errors.depositeRefundRemarkByHoAccountant
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {authority?.includes("CASHIER") && (
                        <>
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                disabled
                                label="Clerk Remark"
                                variant="outlined"
                                {...register("depositeRefundRemarkByClark")}
                                error={!!errors.depositeRefundRemarkByClark}
                                helperText={
                                  errors?.depositeRefundRemarkByClark
                                    ? errors.depositeRefundRemarkByClark.message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="HOD Remark"
                                variant="outlined"
                                disabled
                                {...register("depositeRefundRemarkByHod")}
                                error={!!errors.depositeRefundRemarkByHod}
                                helperText={
                                  errors?.depositeRefundRemarkByHod
                                    ? errors.depositeRefundRemarkByHod.message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Deputy Accountant Remark"
                                variant="outlined"
                                disabled
                                {...register(
                                  "depositeRefundRemarkBySpDyAccountant"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkBySpDyAccountant
                                }
                                helperText={
                                  errors?.depositeRefundRemarkBySpDyAccountant
                                    ? errors
                                        .depositeRefundRemarkBySpDyAccountant
                                        .message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Deputy Commissioner Remark"
                                variant="outlined"
                                disabled
                                {...register(
                                  "depositeRefundRemarkBySpDyCommissioner"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkBySpDyCommissioner
                                }
                                helperText={
                                  errors?.depositeRefundRemarkBySpDyCommissioner
                                    ? errors
                                        .depositeRefundRemarkBySpDyCommissioner
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
                                id="outlined-basic"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                disabled
                                label="HO Accountant Remark"
                                variant="outlined"
                                {...register(
                                  "depositeRefundRemarkByHoAccountant"
                                )}
                                error={
                                  !!errors.depositeRefundRemarkByHoAccountant
                                }
                                helperText={
                                  errors?.depositeRefundRemarkByHoAccountant
                                    ? errors.depositeRefundRemarkByHoAccountant
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
                                id="outlined-basic"
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                disabled
                                label="Manager / HOD Remark "
                                variant="outlined"
                                {...register("depositeRefundRemarkByManager")}
                                error={!!errors.depositeRefundRemarkByManager}
                                helperText={
                                  errors?.depositeRefundRemarkByManager
                                    ? errors.depositeRefundRemarkByManager
                                        .message
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
                                InputLabelProps={{
                                  shrink: true,
                                }}
                                sx={{
                                  width: "90%",
                                }}
                                size="small"
                                label="Cashier Remark"
                                variant="outlined"
                                {...register("depositeRefundRemarkByCashier")}
                                error={!!errors.depositeRefundRemarkByCashier}
                                helperText={
                                  errors?.depositeRefundRemarkByCashier
                                    ? errors.depositeRefundRemarkByCashier
                                        .message
                                    : null
                                }
                              />
                            </Grid>
                          </Grid>
                        </>
                      )}
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
                      <FormattedLabel id="bookingAuditoriumDetails" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container sx={{ padding: "10px" }}>
                      {bookedData?.trnAuditoriumBookingOnlineProcess
                        ?.employeeDepartment ? (
                        <Grid
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
                          sx={{
                            width: "90%",
                          }}
                          size="small"
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
                          label={<FormattedLabel id="refundableAmount" />}
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
                          label={<FormattedLabel id="applicantFlatHouseNo" />}
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
                {/* {authority?.includes("CLERK") ? (
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
                        <FormattedLabel id="addExtraEquipments" />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "end",
                          marginBottom: "10px",
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<AddBoxOutlinedIcon />}
                          onClick={() => {
                            appendUI();
                          }}
                        >
                          <FormattedLabel id="addMore" />
                        </Button>
                      </Box>
                      <Grid container>
                        {fieldsList1.map((witness, index) => {
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
                                      <FormattedLabel id="equipments" />
                                    </InputLabel>
                                    <Controller
                                      render={({ field }) => (
                                        <Select
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label={
                                            <FormattedLabel id="equipments" />
                                          }
                                          value={field.value}
                                          onChange={(value) => {
                                            field.onChange(value);
                                            // console.log("value",value.target.value);
                                            let df = equipmentCharges.find(
                                              (val) => {
                                                return (
                                                  val.equipmentName ==
                                                    value.target.value &&
                                                  val.totalAmount
                                                );
                                              }
                                            );
                                            setValue(
                                              `levelsOfRolesDaoList.${index}.rate`,
                                              df.totalAmount
                                            );
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

                                      let chargesOfExtraEquipmentsUsed = watch(
                                        "levelsOfRolesDaoList"
                                      )?.map((val) => {
                                        return val.total;
                                      });

                                      let _chargesOfExtraEquipmentsUsed =
                                        chargesOfExtraEquipmentsUsed?.reduce(
                                          (partialSum, a) => partialSum + a,
                                          0
                                        );
                                      setExtraEquipmentAmount(
                                        _chargesOfExtraEquipmentsUsed
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
                                <Grid
                                  item
                                  xs={1}
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <IconButton
                                    color="error"
                                    onClick={() => removeList1(index)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ) : (
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
                        <FormattedLabel id="extraEquipments" />
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container>
                        {fieldsList2.map((witness, index) => {
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
                                          disabled
                                          value={field.value}
                                          onChange={(value) => {
                                            field.onChange(value);
                                            let df = equipmentCharges.find(
                                              (val) => {
                                                return (
                                                  val.equipmentName ==
                                                    value.target.value &&
                                                  val.totalAmount
                                                );
                                              }
                                            );
                                            setValue(
                                              `extraEqList.${index}.rate`,
                                              df.totalAmount
                                            );
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
                                      name={`extraEqList.${index}.equipment`}
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
                                    {...register(`extraEqList.${index}.rate`)}
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
                                    disabled
                                    // key={witness.id}
                                    style={{ backgroundColor: "white" }}
                                    {...register(
                                      `extraEqList.${index}.quantity`
                                    )}
                                    key={witness.id}
                                    // name={`extraEqList[${index}].quantity`}
                                    inputRef={register()}
                                    onChange={(event) => {
                                      const { value } = event.target;
                                      setValue(
                                        `extraEqList[${index}].total`,
                                        value *
                                          watch(`extraEqList.${index}.rate`)
                                      );

                                      let chargesOfExtraEquipmentsUsed = watch(
                                        "extraEqList"
                                      )?.map((val) => {
                                        return val.total;
                                      });

                                      let _chargesOfExtraEquipmentsUsed =
                                        chargesOfExtraEquipmentsUsed?.reduce(
                                          (partialSum, a) => partialSum + a,
                                          0
                                        );
                                      setExtraEquipmentAmount(
                                        _chargesOfExtraEquipmentsUsed
                                      );
                                    }}
                                    error={
                                      errors?.extraEqList?.[index]?.quantity
                                    }
                                    helperText={
                                      errors?.extraEqList?.[index]?.quantity
                                        ? errors.extraEqList?.[index]?.quantity
                                            .message
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
                                    {...register(`extraEqList.${index}.total`)}
                                  />
                                </Grid>
                              </Grid>
                            </>
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )} */}

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
                      <FormattedLabel id="bankDetails" />
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
                          label={<FormattedLabel id="bankAccountHolderName" />}
                          variant="outlined"
                          disabled
                          size="small"
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
                          size="small"
                          sx={{
                            width: "90%",
                          }}
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
                                onChange={(value) => field.onChange(value)}
                                label="Type of bank account"
                              >
                                {[
                                  { id: 1, bankAcc: "Current" },
                                  { id: 2, bankAcc: "Saving" },
                                ].map((bank, index) => (
                                  <MenuItem key={index} value={bank.id}>
                                    {bank.bankAcc}
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
                          error={!!errors.bankNameId}
                          sx={{ width: "90%" }}
                          size="small"
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
                                onChange={(value) => field.onChange(value)}
                                label={<FormattedLabel id="bankName" />}
                                disabled
                              >
                                {bankNames?.map((bank, index) => (
                                  <MenuItem
                                    sx={{
                                      display: bank.bankName ? "flex" : "none",
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
                          size="small"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          {...register("ifscCode")}
                          error={!!errors.ifscCode}
                          helperText={
                            errors?.ifscCode ? errors.ifscCode.message : null
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
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          sx={{
                            width: "90%",
                          }}
                          label={<FormattedLabel id="micrCode" />}
                          variant="outlined"
                          {...register("micrCode")}
                          error={!!errors.micrCode}
                          helperText={
                            errors?.micrCode ? errors.micrCode.message : null
                          }
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {authority?.includes("CASHIER") && (
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
                        {/* <FormattedLabel id="bankDetails" /> */}
                        Payment Details
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
                          <FormControl
                            variant="outlined"
                            error={!!errors.pcmcBankName}
                            sx={{ width: "90%" }}
                            size="small"
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {/* <FormattedLabel id="bankName" /> */}
                              PCMC Bank Name
                            </InputLabel>
                            <Controller
                              render={({ field }) => (
                                <Select
                                  sx={{ minWidth: 220 }}
                                  labelId="demo-simple-select-outlined-label"
                                  id="demo-simple-select-outlined"
                                  value={field.value}
                                  onChange={(value) => field.onChange(value)}
                                  // label={<FormattedLabel id="bankName" />}
                                  label="PCMC Bank Name"
                                >
                                  {bankNames?.map((bank, index) => (
                                    <MenuItem
                                      sx={{
                                        display: bank.bankName
                                          ? "flex"
                                          : "none",
                                      }}
                                      key={index}
                                      value={bank.bankName}
                                    >
                                      {bank.bankName}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                              name="pcmcBankName"
                              control={control}
                              defaultValue=""
                            />
                            <FormHelperText>
                              {errors?.pcmcBankName
                                ? errors.pcmcBankName.message
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
                            fullWidth
                            id="outlined-basic"
                            size="small"
                            // label={<FormattedLabel id="extraEquipmentAmount" />}
                            label="Branch Name"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: watch("pcmcBranchName") ? true : false,
                            }}
                            sx={{ width: "90%" }}
                            {...register("pcmcBranchName")}
                            error={!!errors.pcmcBranchName}
                            helperText={
                              errors?.pcmcBranchName
                                ? errors.pcmcBranchName.message
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
                            fullWidth
                            id="outlined-basic"
                            size="small"
                            // label={<FormattedLabel id="extraEquipmentAmount" />}
                            label="Cheque number"
                            variant="outlined"
                            InputLabelProps={{
                              shrink: watch("pcmcChequeNumber") ? true : false,
                            }}
                            sx={{ width: "90%" }}
                            {...register("pcmcChequeNumber")}
                            error={!!errors.pcmcChequeNumber}
                            helperText={
                              errors?.pcmcChequeNumber
                                ? errors.pcmcChequeNumber.message
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
                            alignItems: "end",
                          }}
                        >
                          <FormControl
                            sx={{ width: "90%" }}
                            error={errors.pcmcChequeDate}
                          >
                            <Controller
                              name="pcmcChequeDate"
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
                                        {/* {<FormattedLabel id="bookingDate" />} */}
                                        Cheque Date
                                      </span>
                                    }
                                    value={field.value}
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
                                        error={errors.pcmcChequeDate}
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              )}
                            />
                            <FormHelperText>
                              {errors?.pcmcChequeDate
                                ? errors.pcmcChequeDate.message
                                : null}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )}

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
                      id="outlined-basic"
                      label={<FormattedLabel id="depositAmount" />}
                      variant="outlined"
                      size="small"
                      disabled
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
                      fullWidth
                      id="outlined-basic"
                      size="small"
                      label={<FormattedLabel id="extraEquipmentAmount" />}
                      // label="Extra Equipment Amount"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                      value={extraEquipmentAmount}
                      sx={{ width: "90%" }}
                      {...register("extraEquipmentAmount")}
                      error={!!errors.extraEquipmentAmount}
                      helperText={
                        errors?.extraEquipmentAmount
                          ? errors.extraEquipmentAmount.message
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
                      fullWidth
                      id="outlined-basic"
                      size="small"
                      label={<FormattedLabel id="refundableAmount" />}
                      // label="Refundable Amount"
                      variant="outlined"
                      sx={{ width: "90%" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      // value={watch("depositAmount") - extraEquipmentAmount}
                      {...register("refundableAmount")}
                      error={!!errors.refundableAmount}
                      helperText={
                        errors?.refundableAmount
                          ? errors.refundableAmount.message
                          : null
                      }
                    />
                  </Grid>
                </Grid> */}
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

          {!isOpenCollapse && (
            <>
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
                  pagination
                  paginationMode="server"
                  rowCount={data.totalRows}
                  rowsPerPageOptions={data.rowsPerPageOptions}
                  page={data.page}
                  pageSize={data.pageSize}
                  rows={data.rows}
                  columns={columns}
                  onPageChange={(_data) => {
                    getDepositRefundProcessing(data.pageSize, _data);
                  }}
                  onPageSizeChange={(_data) => {
                    console.log("222", _data);
                    getDepositRefundProcessing(_data, data.page);
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

export default DepositeRefundProcessing;
